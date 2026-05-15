import { collectAliases, expandAliasClass, isAliasDefinition } from './aliases';
import { buildRule } from './builder';
import { ALIAS_CLASS_CACHE, CLASS_CACHE } from './constants/caches';
import { OPTIONS } from './constants/config';
import { REGEX_WHITESPACE } from './constants/regex';
import { isMergeException } from './helpers/merge.helper';
import { insert } from './stylesheet';
import { RuleData } from './types';

const mergeCache = new WeakMap<Element, string>();
type StyleCache = typeof CLASS_CACHE;

interface GeneratedClass {
  cache?: StyleCache;
  cacheKey?: string;
  conflictKey?: string;
  rule?: RuleData;
}

/**
 * Processes an element's classes, removing earlier conflicting classes.
 * Uses reverse loop: later classes always win.
 */
export function processClassList(element: Element): void {
  const currentClass = element.getAttribute('class') ?? '';

  if (!currentClass) return;

  if (mergeCache.has(element)) {
    const previousClass = mergeCache.get(element);

    mergeCache.delete(element);

    if (previousClass === currentClass) {
      return;
    }
  }

  /**
   * Use class attribute's value as the source of classes.
   * classList has its own deduplication logic, in Maple
   * we need to process all the classes to let the later
   * classes override the earlier ones.
   */
  const classList = currentClass.trim().split(REGEX_WHITESPACE);
  let i = classList.length;

  if (i === 0) return;

  const isRoot = element.tagName.toLowerCase() === 'html';

  if (isRoot) {
    collectAliases(classList);
  }

  if (OPTIONS.nomerge) {
    for (const srcClass of classList) {
      for (const item of getClassItems(srcClass)) {
        generateStylesFromClass(item.srcClass, isRoot, true, item.selClass);
      }
    }

    return;
  }

  const seenExact = new Set<string>();
  const seenConflict = new Set<string>();
  const rules: Array<RuleData> = [];
  let newClass = '';

  // Reverse iterate: later classes win
  while (i--) {
    const srcClass = classList[i];

    // Exact duplicate check
    if (seenExact.has(srcClass)) continue;

    seenExact.add(srcClass);

    const items = getClassItems(srcClass);
    let hasActiveRule = false;

    for (const item of items) {
      const { cache, cacheKey, conflictKey, rule } = generateStylesFromClass(
        item.srcClass,
        isRoot,
        false,
        item.selClass,
      );

      // Conflict check
      if (conflictKey) {
        if (seenConflict.has(conflictKey)) continue;

        let coveredByShorthand = false;

        const colonIndex = conflictKey.indexOf(':');
        const propKey = conflictKey.slice(0, colonIndex);
        const propParents = conflictKey.slice(colonIndex);

        // Skip hierarchy check for specific properties that share a prefix but are not covered by the shorthand
        if (!isMergeException(propKey)) {
          let dashIdx = propKey.lastIndexOf('-');

          while (dashIdx > 0) {
            const parentKey = propKey.slice(0, dashIdx);
            if (seenConflict.has(parentKey + propParents)) {
              coveredByShorthand = true;
              break;
            }
            dashIdx = propKey.lastIndexOf('-', dashIdx - 1);
          }
        }

        if (coveredByShorthand) continue;

        seenConflict.add(conflictKey);
      }

      if (rule) {
        rules.push(rule);
      }

      if (cache && cacheKey && conflictKey) {
        cache.set(cacheKey, conflictKey);
      }

      hasActiveRule = true;
    }

    if (hasActiveRule || items.length === 0) {
      newClass = srcClass + (newClass ? ' ' : '') + newClass;
    }
  }

  let j = rules.length;

  while (j--) {
    insert(rules[j]);
  }

  // Rebuild classList if anything changed
  if (currentClass !== newClass) {
    mergeCache.set(element, newClass);
    element.setAttribute('class', newClass);
  }
}

function generateStylesFromClass(
  srcClass: string,
  isRoot: boolean,
  canInsert?: boolean,
  selClass = srcClass,
): GeneratedClass {
  if (isAliasDefinition(srcClass)) {
    return {
      conflictKey: srcClass,
    };
  }

  /**
   * The class cache should leave as long as the
   * application is running. This will prevent the
   * same class from being parsed and inserted multiple times.
   */
  const { cache, cacheKey } = getStyleCache(srcClass, selClass);

  if (cache.has(cacheKey)) {
    return {
      conflictKey: cache.get(cacheKey),
    };
  }

  try {
    const rule = buildRule(srcClass, isRoot, selClass);

    if (rule) {
      if (canInsert && !rule.parsed.isDynamic) {
        cache.set(cacheKey, rule.parsed.conflictKey);
      }

      if (canInsert) {
        insert(rule);
      }

      return {
        rule,
        cache: rule.parsed.isDynamic ? undefined : cache,
        cacheKey: rule.parsed.isDynamic ? undefined : cacheKey,
        conflictKey: rule.parsed.conflictKey,
      };
    }
  } catch (error) {
    console.error(error);
  }

  return {
    conflictKey: srcClass,
  };
}

function getStyleCache(srcClass: string, selClass: string) {
  const isAliasRule = selClass !== srcClass;

  return {
    cache: isAliasRule ? ALIAS_CLASS_CACHE : CLASS_CACHE,
    cacheKey: isAliasRule ? `${selClass}=>${srcClass}` : srcClass,
  };
}

function getClassItems(srcClass: string) {
  if (isAliasDefinition(srcClass)) return [];

  const expanded = expandAliasClass(srcClass);

  if (!expanded) {
    return [{ srcClass, selClass: srcClass }];
  }

  return expanded.map((expandedClass) => ({
    srcClass: expandedClass, // source class for building rule
    selClass: srcClass, // selector class for cache key
  }));
}

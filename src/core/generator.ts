import { buildRule } from './builder';
import { CLASS_CACHE } from './constants/caches';
import { OPTIONS } from './constants/config';
import { REGEX_WHITESPACE } from './constants/regex';
import { isMergeException } from './helpers/merge.helper';
import { insert } from './stylesheet';
import { RuleData } from './types';

const mergeCache = new WeakMap<Element, string>();

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

  if (OPTIONS.nomerge) {
    for (const srcClass of classList) {
      generateStylesFromClass(srcClass, isRoot, true);
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

    // Get conflict key from cache, or generate styles and cache key
    const { conflictKey, rule } = generateStylesFromClass(
      srcClass,
      isRoot,
      false,
    );

    if (rule) {
      rules.push(rule);
    }

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

    newClass = srcClass + (newClass ? ' ' : '') + newClass;
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
): { conflictKey?: string; rule?: RuleData } {
  /**
   * The class cache should leave as long as the
   * application is running. This will prevent the
   * same class from being parsed and inserted multiple times.
   */
  if (CLASS_CACHE.has(srcClass)) {
    return {
      conflictKey: CLASS_CACHE.get(srcClass),
    };
  }

  CLASS_CACHE.set(srcClass, srcClass);

  try {
    const rule = buildRule(srcClass, isRoot);

    if (rule) {
      if (rule.parsed.isDynamic) {
        // Dynamic rules are not cached
        CLASS_CACHE.delete(srcClass);
      } else {
        CLASS_CACHE.set(srcClass, rule.parsed.conflictKey);
      }

      if (canInsert) {
        insert(rule);
      }

      return {
        rule,
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

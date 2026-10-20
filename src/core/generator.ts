import { collectAliases, expandAliasClass, isAliasDefinition } from './aliases';
import { buildRule } from './builder';
import { CLASS_CACHE, SKIPPED_CLASS_CACHE } from './constants/caches';
import { CHAR_DOLLAR, CHAR_EXCLAMATION_MARK } from './constants/chars';
import { OPTIONS } from './constants/config';
import { REGEX_WHITESPACE } from './constants/regex';
import { setCacheItem } from './helpers/cache.helper';
import { debugWarn, setDebugContext } from './helpers/debug.helper';
import { isMergeException } from './helpers/merge.helper';
import { resolveType } from './helpers/property.helper';
import { toCamelCase } from './helpers/string.helper';
import { parseClass } from './parser-class';
import { insert } from './stylesheet';
import { RuleData } from './types';

const mergeCache = new WeakMap<Element, string>();
const selectorCache = new Map<string, string>();

interface GeneratedClass {
  cacheKey?: string;
  conflictKey?: string;
  rule?: RuleData;
}

interface ClassItem {
  srcClass: string;
  selClass: string;
}

interface SurvivingProp {
  propKey: string;
  context: string;
  srcClass: string;
}

/**
 * Processes an element's classes, removing earlier conflicting classes.
 * Uses reverse loop: later classes always win.
 */
export function processClassList(element: Element): void {
  const currentClass = element.getAttribute('class') ?? '';

  if (!currentClass) return;

  if (OPTIONS.debug) setDebugContext(element);

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
  const surviving: Array<SurvivingProp> = [];
  const seenConflictItems = new Map<string, ClassItem>();
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
    let itemIndex = items.length;

    while (itemIndex--) {
      const item = items[itemIndex];
      const { cacheKey, conflictKey, rule } = generateStylesFromClass(
        item.srcClass,
        isRoot,
        false,
        item.selClass,
      );

      // Conflict check
      if (conflictKey) {
        if (seenConflict.has(conflictKey)) {
          const winner = seenConflictItems.get(conflictKey);
          const overrideRule = buildAliasOverrideRule(item, winner, isRoot);

          if (overrideRule) {
            rules.push(overrideRule);
          }

          continue;
        }

        let coveredByShorthand = false;

        const colonIndex = conflictKey.indexOf(':');
        const propKey = conflictKey.slice(0, colonIndex);
        const propParents = conflictKey.slice(colonIndex);
        const isImportant = propParents.startsWith(':!');
        const normalPropParents = isImportant
          ? ':' + propParents.slice(2)
          : propParents;

        // Skip hierarchy check for specific properties that share a prefix but are not covered by the shorthand
        let dashIdx = propKey.lastIndexOf('-');

        while (dashIdx > 0) {
          const parentKey = propKey.slice(0, dashIdx);
          if (
            !isMergeException(propKey, parentKey) &&
            (seenConflict.has(parentKey + propParents) ||
              (isImportant && seenConflict.has(parentKey + normalPropParents)))
          ) {
            coveredByShorthand = true;
            break;
          }
          dashIdx = propKey.lastIndexOf('-', dashIdx - 1);
        }

        if (coveredByShorthand) continue;

        seenConflict.add(conflictKey);
        seenConflictItems.set(conflictKey, item);

        if (OPTIONS.debug) {
          surviving.push({
            propKey,
            context: normalPropParents,
            srcClass,
          });
        }

        /**
         * Important utilities override earlier normal utilities with the same
         * property/context, but normal utilities after an important one are
         * preserved because they are still part of the authored class order.
         */
        if (isImportant) {
          seenConflict.add(propKey + normalPropParents);
          seenConflictItems.set(propKey + normalPropParents, item);
        }
      }

      if (rule) {
        rules.push(rule);
      }

      if (cacheKey && conflictKey) {
        CLASS_CACHE.set(cacheKey, conflictKey);
      }

      hasActiveRule = true;
    }

    if (hasActiveRule || items.length === 0) {
      newClass = srcClass + (newClass ? ' ' : '') + newClass;
    }
  }

  if (OPTIONS.debug) warnShorthandOverlap(surviving);

  let j = rules.length;

  while (j--) {
    insert(rules[j]);
  }

  // Rebuild classList if anything changed
  if (currentClass !== newClass) {
    if (OPTIONS.debug) {
      debugWarn(`merged: "${currentClass}" -> "${newClass}"`);
    }

    mergeCache.set(element, newClass);
    element.setAttribute('class', newClass);
  }
}

function warnShorthandOverlap(surviving: Array<SurvivingProp>): void {
  for (const longhand of surviving) {
    for (const shorthand of surviving) {
      if (longhand.context === shorthand.context) continue;
      if (!longhand.propKey.startsWith(shorthand.propKey + '-')) continue;
      if (isMergeException(longhand.propKey, shorthand.propKey)) continue;

      const longType = resolveType(
        longhand.propKey,
        toCamelCase(longhand.propKey),
      );
      const shortType = resolveType(
        shorthand.propKey,
        toCamelCase(shorthand.propKey),
      );

      if (longType === shortType) continue;

      debugWarn(
        `layer order decides between "${longhand.srcClass}" (${longhand.propKey}) and "${shorthand.srcClass}" (${shorthand.propKey}) on this element: the longhand wins whatever the class order`,
      );
    }
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
   * Alias-expanded rules use a `selClass=>srcClass` key so they
   * never collide with the plain entry for the same source class.
   */
  const isAliasRule = selClass !== srcClass;
  const cacheKey = isAliasRule ? `${selClass}=>${srcClass}` : srcClass;

  if (CLASS_CACHE.has(cacheKey)) {
    return {
      conflictKey: CLASS_CACHE.get(cacheKey),
    };
  }

  if (SKIPPED_CLASS_CACHE.has(cacheKey)) {
    return {
      conflictKey: srcClass,
    };
  }

  try {
    const rule = buildRule(srcClass, isRoot, selClass);

    if (rule) {
      if (!rule.parsed.isDynamic) {
        rule.cacheKey = cacheKey;
      }

      if (canInsert && !rule.parsed.isDynamic) {
        CLASS_CACHE.set(cacheKey, rule.parsed.conflictKey);
      }

      if (canInsert) {
        insert(rule);
      }

      return {
        rule,
        cacheKey: rule.parsed.isDynamic ? undefined : cacheKey,
        conflictKey: rule.parsed.conflictKey,
      };
    }

    if (!isDynamicClass(srcClass)) {
      setCacheItem(SKIPPED_CLASS_CACHE, cacheKey, 1);
    }
  } catch (error) {
    console.error('[maple]', error);
  }

  return {
    conflictKey: srcClass,
  };
}

/**
 * Mirrors the `$$` detection in `parseClass`, which reads the flag
 * after an optional `!`.
 */
function isDynamicClass(srcClass: string): boolean {
  const offset = srcClass.charCodeAt(0) === CHAR_EXCLAMATION_MARK ? 1 : 0;

  return (
    srcClass.charCodeAt(offset) === CHAR_DOLLAR &&
    srcClass.charCodeAt(offset + 1) === CHAR_DOLLAR
  );
}

function buildAliasOverrideRule(
  loser: ClassItem,
  winner: ClassItem | undefined,
  isRoot: boolean,
): RuleData | undefined {
  if (!winner) return;
  if (loser.selClass === loser.srcClass) return;
  if (winner.selClass === winner.srcClass) return;
  if (loser.selClass === winner.selClass) return;

  const cacheKey = `${winner.selClass}+${loser.selClass}=>${winner.srcClass}`;

  if (CLASS_CACHE.has(cacheKey)) return;

  const selectorOverride =
    getClassSelector(loser.selClass) + getClassSelector(winner.selClass);
  const rule = buildRule(
    winner.srcClass,
    isRoot,
    winner.selClass,
    selectorOverride,
  );

  if (rule) {
    rule.cacheKey = cacheKey;
    CLASS_CACHE.set(cacheKey, rule.parsed.conflictKey);
  }

  return rule;
}

function getClassSelector(srcClass: string): string {
  let selector = selectorCache.get(srcClass);

  if (!selector) {
    selector = parseClass(srcClass).srcSel;
    selectorCache.set(srcClass, selector);
  }

  return selector;
}

function getClassItems(srcClass: string): Array<ClassItem> {
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

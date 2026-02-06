import { buildRule } from './builder';
import { CLASS_CACHE } from './constants/caches';
import { insert } from './stylesheet';

// Flag to prevent recursive mutations
let isMerging = false;

/**
 * Processes an element's classList, removing earlier conflicting classes.
 * Uses reverse loop: later classes in classList always win.
 */
export function processClassList(element: Element): void {
  const classList = element.classList;
  let i = classList.length;

  if (i === 0) return;

  const seenExact = new Set<string>();
  const seenConflict = new Set<string>();
  let newClassVal = '';

  // Reverse iterate: later classes win
  while (i--) {
    const srcClass = classList[i];

    // Exact duplicate check
    if (seenExact.has(srcClass)) continue;

    seenExact.add(srcClass);

    // Get conflict key from cache, or generate styles and cache key
    const conflictKey =
      CLASS_CACHE.get(srcClass) ?? generateStylesFromClass(srcClass);

    // Conflict check
    if (conflictKey) {
      if (seenConflict.has(conflictKey)) continue;

      let coveredByShorthand = false;

      const colonIndex = conflictKey.indexOf(':');
      const propKey = conflictKey.slice(0, colonIndex);
      const propParents = conflictKey.slice(colonIndex);

      // Skip hierarchy check for specific properties that share a prefix but are not covered by the shorthand
      if (!isShorthandException(propKey)) {
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

    newClassVal = srcClass + (newClassVal ? ' ' : '') + newClassVal;
  }

  // Rebuild classList if anything changed
  if (classList.toString().length !== newClassVal.length) {
    isMerging = true;
    element.setAttribute('class', newClassVal);
    isMerging = false;
  }
}

/**
 * Check if we're currently in a merge operation.
 * Used by observer to skip mutations caused by merge.
 */
export function isMergingInProgress(): boolean {
  return isMerging;
}

function generateStylesFromClass(srcClass: string): string | undefined {
  /**
   * The class cache should leave as long as the
   * application is running. This will prevent the
   * same class from being parsed and inserted multiple times.
   */
  if (CLASS_CACHE.has(srcClass)) return;

  CLASS_CACHE.set(srcClass, srcClass);

  try {
    const rule = buildRule(srcClass);

    if (rule) {
      CLASS_CACHE.set(srcClass, rule.parsed.conflictKey);
      insert(rule);
      return rule.parsed.conflictKey;
    }
  } catch (error) {
    console.error(error);
  }

  return srcClass;
}

function isShorthandException(key: string): boolean {
  // border-* exceptions
  if (key.startsWith('border-')) {
    return (
      key.includes('radius') ||
      key.includes('image') ||
      key === 'border-collapse' ||
      key === 'border-spacing'
    );
  }
  // flex-* exceptions
  if (key.startsWith('flex-')) {
    return (
      key === 'flex-direction' || key === 'flex-wrap' || key === 'flex-flow'
    );
  }

  // grid-* exceptions
  if (key.includes('grid-')) {
    // grid shorthand resets grid-template-*, but NOT grid-column/row/area (item props)
    // We must be specific to avoid catching grid-template-columns/rows/areas
    return (
      key.startsWith('grid-column') ||
      key.startsWith('grid-row') ||
      key.startsWith('grid-area')
    );
  }

  // transform-* exceptions
  if (key.includes('transform-')) {
    return (
      key.includes('origin') || key.includes('style') || key.includes('box')
    );
  }

  // overflow-* exceptions
  if (key.includes('overflow-')) {
    return key.includes('wrap') || key.includes('anchor');
  }

  // outline-* exceptions
  if (key.includes('outline-')) {
    return key.includes('offset');
  }

  return false;
}

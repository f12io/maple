import { ParsedMediaQuery } from './types';
import { getBreakpoints } from '../helpers/get-breakpoints';

// --- Internal State (Encapsulated in the module) ---
const ID = 'runtime-maple-styles';
const customBreakpointMatcher = /@(min|max)/;
const rawClassCache = new Map<string, boolean>();
let breakpoints: Record<string, string> = getBreakpoints();
const containerRules = new Map<string, CSSContainerRule | undefined>();
const breakpointRules = new Map<string, CSSMediaRule | undefined>();

let sheet: CSSStyleSheet | null = null;
let el: HTMLStyleElement | null = null;
let baseRules: CSSLayerBlockRule | undefined;

const parseMedia = (mediaText: string): ParsedMediaQuery => {
  const min = mediaText.match(/min-width\s*:\s*(\d+)px/);
  const max = mediaText.match(/max-width\s*:\s*(\d+)px/);
  return {
    raw: mediaText,
    min: min ? Number(min[1]) : 0,
    max: max ? Number(max[1]) : 0,
    type: min ? 'min' : max ? 'max' : 'other',
  };
};

const compareMedia = (a: ParsedMediaQuery, b: ParsedMediaQuery): number => {
  const order = { other: 0, max: 1, min: 2 };
  if (a.type !== b.type) return order[a.type] - order[b.type];
  if (a.type === 'max') return b.max - a.max;
  if (a.type === 'min') return a.min - b.min;
  return a.raw.localeCompare(b.raw);
};

const bpQueryBuilder = (bp: string, size?: string) => {
  const type = bp.match(customBreakpointMatcher)?.[1] || 'min';
  const resolvedSize =
    breakpoints[bp] ||
    (!isNaN(parseInt(size || ''))
      ? size
      : size
      ? breakpoints[size]
      : breakpoints[bp]);

  return resolvedSize
    ? `(${type === 'min' ? 'min-width' : 'max-width'}: ${resolvedSize})`
    : null;
};

export const init = () => {
  if (sheet) return;
  el =
    (document.getElementById(ID) as HTMLStyleElement) ||
    document.createElement('style');
  if (!el.parentNode) {
    el.id = ID;
    document.head.appendChild(el);
    breakpoints = getBreakpoints();
    // Initial media rules insertion
    const sortedBps = Object.entries(breakpoints).sort(
      (prev, curr) => parseInt(prev[1]) - parseInt(curr[1])
    );

    sortedBps.forEach(([key, size]) => {
      const query = bpQueryBuilder(key, size);
      el!.sheet?.insertRule(`@media ${query}{}`, el!.sheet.cssRules.length);
      breakpointRules.set(
        key,
        el!.sheet?.cssRules[el!.sheet.cssRules.length - 1] as CSSMediaRule
      );
    });
  }

  el.sheet?.insertRule('@layer base {}', 0);
  baseRules = el.sheet?.cssRules[0] as CSSLayerBlockRule;
  sheet = el.sheet as CSSStyleSheet;
};

const findMediaRuleOrInsert = (
  bp: string,
  mediaQuery?: string
): CSSMediaRule | undefined => {
  const key = mediaQuery ? `${bp}-${mediaQuery}` : bp;
  let mediaRule = breakpointRules.get(key);
  const query = bpQueryBuilder(bp, mediaQuery);

  if (!mediaRule && breakpointRules.size > 0) {
    const parsedQuery = parseMedia(query || '');
    for (let i = 1; i < sheet!.cssRules.length; i++) {
      const rule = sheet!.cssRules[i];
      if (
        rule instanceof CSSMediaRule &&
        compareMedia(parsedQuery, parseMedia(rule.conditionText)) < 0
      ) {
        sheet!.insertRule(`@media ${query} {}`, i);
        mediaRule = sheet!.cssRules[i] as CSSMediaRule;
        breakpointRules.set(key, mediaRule);
        return mediaRule;
      }
    }
  }

  if (!mediaRule) {
    const pos = breakpointRules.size + 1;
    sheet!.insertRule(`@media ${query} {}`, pos);
    mediaRule = sheet!.cssRules[pos] as CSSMediaRule;
    breakpointRules.set(key, mediaRule);
  }
  return mediaRule;
};

const findContainerOrInsert = (
  bp: string,
  container: string,
  mediaQuery?: string
): CSSContainerRule => {
  const query = bpQueryBuilder(bp, mediaQuery);
  const key = `${container}-${query}`.trim();
  let containerRule = containerRules.get(key);

  if (!containerRule && containerRules.size > 0) {
    const parsedQuery = parseMedia(query || '');
    for (let i = breakpointRules.size + 1; i < sheet!.cssRules.length; i++) {
      const rule = sheet!.cssRules[i];
      if (
        rule instanceof CSSContainerRule &&
        compareMedia(parsedQuery, parseMedia(rule.conditionText)) < 0
      ) {
        sheet!.insertRule(
          `@container ${
            container === 'none' ? '' : container + ' '
          }${query} {}`,
          i
        );
        containerRule = sheet!.cssRules[i] as CSSContainerRule;
        containerRules.set(key, containerRule);
        return containerRule;
      }
    }
  }

  if (!containerRule) {
    const pos = breakpointRules.size + containerRules.size + 1;
    sheet!.insertRule(
      `@container ${container === 'none' ? '' : container + ' '}${query} {}`,
      pos
    );
    containerRule = sheet!.cssRules[pos] as CSSContainerRule;
    containerRules.set(key, containerRule);
  }
  return containerRule!;
};

// --- Exported API ---

/**
 * Checks if a selector is already in the runtime cache.
 */
export const hasCache = (selector: string) => rawClassCache.has(selector);

/**
 * Marks a selector as cached.
 */
export const setCache = (rawClassName: string) =>
  rawClassCache.set(rawClassName, true);

/**
 * Inserts a CSS rule into the stylesheet with optional breakpoint/container support.
 */
export const insert = (
  rule: string,
  resolved?: { bp?: string; container?: string; mediaQuery?: string }
) => {
  try {
    const { bp, container, mediaQuery } = resolved || {};
    if (bp) {
      if (container) {
        findContainerOrInsert(bp, container, mediaQuery).insertRule(rule);
      } else {
        findMediaRuleOrInsert(bp, mediaQuery)?.insertRule(rule);
      }
    } else {
      baseRules?.insertRule(rule);
    }
  } catch (e) {
    // Fallback for environments where insertRule fails or during SSR hydration mismatches
    el?.appendChild(document.createTextNode(rule));
  }
};

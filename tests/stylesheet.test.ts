import { describe, expect, it } from 'vitest';
import { buildRule } from '../src/core/builder';
import { OPTIONS } from '../src/core/constants/config';
import { insert, insertRefVar } from '../src/core/stylesheet';

// Enable refs for testing
OPTIONS.refs = 1;

// CSSOM Helpers
function getSheet(): CSSStyleSheet | null {
  const el = document.getElementById('mapleStyles') as HTMLStyleElement | null;
  return el?.sheet ?? null;
}

function findRule(
  root: CSSStyleSheet | CSSGroupingRule,
  predicate: (rule: CSSRule) => boolean,
): CSSRule | undefined {
  for (const rule of root.cssRules) {
    if (predicate(rule)) return rule;
    if (
      rule instanceof CSSGroupingRule ||
      rule instanceof CSSMediaRule ||
      rule instanceof CSSLayerBlockRule
    ) {
      const found = findRule(rule, predicate);
      if (found) return found;
    }
  }
  return undefined;
}

function findLayer(
  root: CSSStyleSheet | CSSGroupingRule | undefined | null,
  name: string,
): CSSLayerBlockRule | undefined {
  if (!root) return undefined;

  return findRule(
    root,
    (r) => r instanceof CSSLayerBlockRule && r.name === name,
  ) as CSSLayerBlockRule | undefined;
}

function findStyleRule(
  root: CSSStyleSheet | CSSGroupingRule | undefined,
  selector: string,
): CSSStyleRule | undefined {
  if (!root) return undefined;

  return findRule(
    root,
    (r) => r instanceof CSSStyleRule && r.selectorText.includes(selector),
  ) as CSSStyleRule | undefined;
}

function findMediaRule(
  root: CSSStyleSheet | CSSGroupingRule | undefined | null,
  condition: string,
): CSSMediaRule | undefined {
  if (!root) return undefined;

  return findRule(
    root,
    (r) => r instanceof CSSMediaRule && r.conditionText === condition,
  ) as CSSMediaRule | undefined;
}

describe('Stylesheet', () => {
  it('inserts base rules into correct layers', () => {
    // d-block -> display: block (Type 0, Priority 0)
    const rule = buildRule('d-block');
    insert(rule);

    const sheet = getSheet();
    const utils = findLayer(sheet, 'utils');
    const t0 = findLayer(utils, 't0');
    const p0 = findLayer(t0, 'p0');
    const styleRule = findStyleRule(p0, '.d-block');

    expect(utils).toBeDefined();
    expect(t0).toBeDefined();
    expect(p0).toBeDefined();
    expect(styleRule?.style.display).toBe('var(--ref-d-block)');
  });

  it('layers margin (space) correctly (Type 1)', () => {
    // ml-4 -> margin-left: 1rem (Space Type 1, "margin-left" -> 1 dash -> Priority 1)
    const rule = buildRule('ml-4');
    insert(rule);

    const sheet = getSheet();
    const utils = findLayer(sheet, 'utils');
    const t1 = findLayer(utils, 't1');
    const p1 = findLayer(t1, 'p1');
    const styleRule = findStyleRule(p1, '.ml-4');

    expect(utils).toBeDefined();
    expect(t1).toBeDefined();
    expect(p1).toBeDefined();
    expect(styleRule?.style.marginLeft).toBe('var(--ref-ml-4)');
  });

  it('layers padding (space) correctly (Type 1, Priority 0)', () => {
    // p-4 -> padding: 1rem (Space Type 1, "padding" -> 0 dashes -> Priority 0)
    const rule = buildRule('p-4');
    insert(rule);

    const sheet = getSheet();
    const utils = findLayer(sheet, 'utils');
    const t1 = findLayer(utils, 't1');
    const p0 = findLayer(t1, 'p0');
    const styleRule = findStyleRule(p0, '.p-4');

    expect(utils).toBeDefined();
    expect(t1).toBeDefined();
    expect(p0).toBeDefined();
    expect(styleRule?.style.padding).toBe('var(--ref-p-4)');
  });

  it('flattens CSS variables to Priority 0', () => {
    // --custom-long-var-name=1 (Variable Type 3)
    // Should be Priority 0 forced
    const rule = buildRule('--custom-long-var-name=1');
    insert(rule);

    const sheet = getSheet();
    const utils = findLayer(sheet, 'utils');
    const t3 = findLayer(utils, 't3');
    const p0 = findLayer(t3, 'p0');
    const p3 = findLayer(t3, 'p3');
    const styleRule = findStyleRule(p0, '.--custom-long-var-name\\=1');

    expect(utils).toBeDefined();
    expect(t3).toBeDefined();
    expect(p0).toBeDefined();
    expect(p3).toBeUndefined(); // Should NOT exist
    expect(styleRule?.style.getPropertyValue('--custom-long-var-name')).toBe(
      '1',
    );
  });

  it('sorts media queries correctly in buckets', () => {
    // Insert @lg rule (global) - Should fail if sorting is wrong
    // Larger min-width should be AFTER smaller min-width for mobile-first
    const lgRule = buildRule('@lg:ml-8'); // ml-8 -> 2rem
    insert(lgRule);

    // Insert @md rule (global)
    const mdRule = buildRule('@md:ml-4'); // ml-4 -> 1rem
    insert(mdRule);

    const sheet = getSheet();
    // We need to look inside the correct bucket.
    // ml-8 is Space (Type 1), Priority 1 (margin-left).
    const utils = findLayer(sheet, 'utils');
    const t1 = findLayer(utils, 't1');
    const p1 = findLayer(t1, 'p1');

    let idxMd = -1;
    let idxLg = -1;

    if (p1) {
      for (let i = 0; i < p1.cssRules.length; i++) {
        const r = p1.cssRules[i];
        if (r instanceof CSSMediaRule) {
          if (r.conditionText === '(min-width: 768px)') idxMd = i;
          if (r.conditionText === '(min-width: 1024px)') idxLg = i;
        }
      }
    }

    expect(utils).toBeDefined();
    expect(t1).toBeDefined();
    expect(p1).toBeDefined();
    expect(idxMd).toBeGreaterThan(-1);
    expect(idxLg).toBeGreaterThan(-1);
    expect(idxMd).toBeLessThan(idxLg);
  });

  it('inserts ref variables', () => {
    insertRefVar('primary', 'blue', 'color');
    insertRefVar('spacing-4', '1rem', 'number');

    const sheet = getSheet();
    const refs = findLayer(sheet, 'refs');
    const colors = findLayer(refs, 'colors');
    const numbers = findLayer(refs, 'numbers');

    expect(refs).toBeDefined();
    expect(colors).toBeDefined();
    expect(numbers).toBeDefined();

    // Variables are set on :root inside these layers
    const colorRoot = colors?.cssRules[0] as CSSStyleRule | undefined;
    expect(colorRoot?.selectorText).toBe(':root');
    expect(colorRoot?.style.getPropertyValue('--ref-primary')).toBe('blue');

    const numberRoot = numbers?.cssRules[0] as CSSStyleRule | undefined;
    expect(numberRoot?.selectorText).toBe(':root');
    expect(numberRoot?.style.getPropertyValue('--ref-spacing-4')).toBe('1rem');
  });

  it('validates hybrid rules: @not-dark:o-0', () => {
    const rule = buildRule('@not-dark:o-0');
    insert(rule);

    const sheet = getSheet();
    const utils = findLayer(sheet, 'utils');
    const t0 = findLayer(utils, 't0');
    const p0 = findLayer(t0, 'p0');
    const base = findLayer(p0, 'base');
    const systemRule = findMediaRule(sheet, 'not (prefers-color-scheme: dark)');
    const manualRule = findStyleRule(base, ':root.light .\\@not-dark\\:o-0');

    expect(utils).toBeDefined();
    expect(t0).toBeDefined();
    expect(p0).toBeDefined();
    expect(base).toBeDefined();
    expect(systemRule?.cssRules[0].cssText).toContain(
      ':root:not(.dark) .\\@not-dark\\:o-0',
    );
    expect(manualRule).toBeDefined();
  });

  it('validates hybrid nested rules: @mnw!=600px:@dark:o-0', () => {
    const rule = buildRule('@mnw!=600px:@dark:o-0');
    insert(rule);

    const sheet = getSheet();
    const utils = findLayer(sheet, 'utils');
    const t0 = findLayer(utils, 't0');
    const p0 = findLayer(t0, 'p0');

    // System Rule: @media (prefers-color-scheme: dark)
    const outerMedia = findMediaRule(sheet, '(prefers-color-scheme: dark)');
    const innerMedia = findMediaRule(outerMedia, 'not (min-width: 600px)');
    const systemRule = findStyleRule(
      innerMedia,
      ':root:not(.light) .\\@mnw\\!\\=600px\\:\\@dark\\:o-0',
    );

    // Manual Rule: @media not (min-width: 600px)
    const manualMedia = findMediaRule(p0, 'not (min-width: 600px)');
    const manualRule = findStyleRule(
      manualMedia,
      ':root.dark .\\@mnw\\!\\=600px\\:\\@dark\\:o-0',
    );

    expect(outerMedia).toBeDefined();
    expect(innerMedia).toBeDefined();
    expect(systemRule).toBeDefined();
    expect(manualMedia).toBeDefined();
    expect(manualRule).toBeDefined();
  });
});

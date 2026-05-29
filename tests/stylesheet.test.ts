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

    expect(styleRule?.style.display).toBe('var(--ref-d-block)');
  });

  it('layers margin (space) correctly (Type 1)', () => {
    // ml-4 -> margin-left: 1rem (Space Type 1, "margin-left" -> 1 dash -> Priority 1)
    const rule = buildRule('ml-4');
    insert(rule);

    const sheet = getSheet();
    const utils = findLayer(sheet, 'utils');
    const t1 = findLayer(utils, 't1');
    const p2 = findLayer(t1, 'p2');
    const styleRule = findStyleRule(p2, '.ml-4');

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
    const p2 = findLayer(t1, 'p2');

    let idxMd = -1;
    let idxLg = -1;

    if (p2) {
      for (let i = 0; i < p2.cssRules.length; i++) {
        const r = p2.cssRules[i];
        if (r instanceof CSSMediaRule) {
          if (r.conditionText === '(min-width: 768px)') idxMd = i;
          if (r.conditionText === '(min-width: 1024px)') idxLg = i;
        }
      }
    }

    expect(utils).toBeDefined();
    expect(t1).toBeDefined();
    expect(p2).toBeDefined();
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
    const manualRule = findStyleRule(base, '.light .\\@not-dark\\:o-0');

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
      '.dark .\\@mnw\\!\\=600px\\:\\@dark\\:o-0',
    );

    expect(systemRule).toBeDefined();
    expect(manualRule).toBeDefined();
  });

  it('handles $$ prefix (Dynamic flag)', async () => {
    // $$w-100px -> width: 100px (No ref, direct value)
    const rule = buildRule('$$w-100px');
    insert(rule);

    // Dynamic rules are async, need to wait for microtask queue
    await new Promise<void>((resolve) => setTimeout(resolve, 0));

    const sheet = getSheet();
    const dynamic = findLayer(sheet, 'dynamic');
    const styleRule = findStyleRule(dynamic, '.\\$\\$w-100px');

    expect(styleRule?.style.width).toBe('100px');
  });

  it('handles equal sign syntax', () => {
    // w=100px -> width: 100px
    const rule = buildRule('w=100px');
    insert(rule);

    const sheet = getSheet();
    const utils = findLayer(sheet, 'utils');
    const t1 = findLayer(utils, 't1');
    const p0 = findLayer(t1, 'p0'); // w=... has 0 dashes in key -> Priority 0
    const styleRule = findStyleRule(p0, '.w\\=100px');

    expect(styleRule?.style.width).toBe('100px');
  });

  it('handles bracket syntax', () => {
    // w=[100px] -> width: 100px
    const rule = buildRule('w=[100px]');
    insert(rule);

    const sheet = getSheet();
    const utils = findLayer(sheet, 'utils');
    const t1 = findLayer(utils, 't1');
    const p0 = findLayer(t1, 'p0');
    const styleRule = findStyleRule(p0, '.w\\=\\[100px\\]');

    expect(styleRule?.style.width).toBe('100px');
  });

  it('handles underscores in dynamic values', () => {
    // br=1px_solid_black -> border: 1px solid black
    const rule = buildRule('br=1px_solid_black');
    insert(rule);

    const sheet = getSheet();
    const utils = findLayer(sheet, 'utils');
    const t1 = findLayer(utils, 't1'); // border is Type 1 (Space)
    const p0 = findLayer(t1, 'p0');
    const styleRule = findStyleRule(p0, '.br\\=1px_solid_black');

    expect(styleRule?.style.borderWidth).toBe('1px');
    expect(styleRule?.style.borderStyle).toBe('solid');
    expect(styleRule?.style.borderColor).toBe('black');
  });

  it('handles complex values with brackets and spaces', () => {
    const rule = buildRule('m-4_[calc(100%_-_20px)]');
    insert(rule);

    const sheet = getSheet();
    const utils = findLayer(sheet, 'utils');
    const t1 = findLayer(utils, 't1');
    const p0 = findLayer(t1, 'p0');
    const styleRule = findStyleRule(p0, '.m-4_\\[calc\\(100\\%_-_20px\\)\\]');

    expect(styleRule?.style.margin).toContain('calc(100% - 20px)');
  });

  describe('Peer Conflicts', () => {
    it('resolves Standard Hierarchy: margin < margin-inline < margin-left', () => {
      // m-4  -> margin (0 hyphens)
      // mx-4 -> margin-inline (1 hyphen, Demoted)
      // ml-4 -> margin-left (1 hyphen)

      const ruleM = buildRule('m-4');
      const ruleMX = buildRule('mx-4');
      const ruleML = buildRule('ml-4');

      insert(ruleML);
      insert(ruleMX);
      insert(ruleM);

      const sheet = getSheet();
      const utils = findLayer(sheet, 'utils');
      const t1 = findLayer(utils, 't1');
      const p0 = findLayer(t1, 'p0'); // m-4
      const p1 = findLayer(t1, 'p1'); // mx-4
      const p2 = findLayer(t1, 'p2'); // ml-4

      expect(findStyleRule(p0, '.m-4')).toBeDefined();
      expect(findStyleRule(p1, '.mx-4')).toBeDefined();
      expect(findStyleRule(p2, '.ml-4')).toBeDefined();
    });

    it('resolves Logical vs Physical: mx (margin-inline) vs mr (margin-right)', () => {
      // mx-4 (Demoted Priority 1)
      // mr-4 (Priority 2)
      // mr should be in a higher priority layer than mx
      const ruleMX = buildRule('mx-4');
      const ruleMR = buildRule('mr-4');

      insert(ruleMR);
      insert(ruleMX);

      const sheet = getSheet();
      const utils = findLayer(sheet, 'utils');
      const t1 = findLayer(utils, 't1');
      const p1 = findLayer(t1, 'p1'); // mx
      const p2 = findLayer(t1, 'p2'); // mr

      expect(findStyleRule(p1, '.mx-4')).toBeDefined();
      expect(findStyleRule(p2, '.mr-4')).toBeDefined();
    });

    it('resolves Positioning: inset < left', () => {
      // inset-0 (0 hyphens) -> Priority 0
      // left-0 (0 hyphens, Promoted) -> Priority 1
      const ruleInset = buildRule('inset-0');
      const ruleLeft = buildRule('left-0');

      insert(ruleLeft);
      insert(ruleInset);

      const sheet = getSheet();
      const utils = findLayer(sheet, 'utils');
      const t1 = findLayer(utils, 't1');
      const p0 = findLayer(t1, 'p0'); // inset
      const p1 = findLayer(t1, 'p1'); // left

      expect(findStyleRule(p0, '.inset-0')).toBeDefined();
      expect(findStyleRule(p1, '.left-0')).toBeDefined();
    });

    it('resolves Border Shorthands: brl < brw', () => {
      // brl -> border-left (1 hyphen)
      // brw -> border-width (1 hyphens -> Priority 2, Promoted -> Priority 3)

      const ruleBRW = buildRule('brw-2px');
      const ruleBRL = buildRule('brl-4px_solid');

      insert(ruleBRL);
      insert(ruleBRW);

      const sheet = getSheet();
      const utils = findLayer(sheet, 'utils');
      const t1 = findLayer(utils, 't1');
      const p2 = findLayer(t1, 'p2');
      const p3 = findLayer(t1, 'p3');

      expect(findStyleRule(p2, '.brl-4px_solid')).toBeDefined();
      expect(findStyleRule(p3, '.brw-2px')).toBeDefined();
    });
  });
});

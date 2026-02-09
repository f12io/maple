import { describe, expect, it } from 'vitest';
import { buildRule } from '../src/core/builder';
import {
  OPTIONS,
  PROP_TYPE_OTHER,
  PROP_TYPE_SPACE,
  PROP_TYPE_VARIABLE,
} from '../src/core/constants/config';
import { insert, insertRefVar } from '../src/core/stylesheet';
import { ParsedClass } from '../src/core/types';

// Enable refs for testing
OPTIONS.refs = 1;

// Helper to get raw CSS text from the injected stylesheet
function getSheetCSS(): string {
  const el = document.getElementById('mapleStyles') as HTMLStyleElement | null;
  if (!el?.sheet) return '';

  let css = '';
  // Root layers from initStyleSheet
  // 0: @layer refs
  // 1: @layer utils
  const sheet = el.sheet;

  for (const rule of sheet.cssRules) {
    if (rule instanceof CSSLayerBlockRule) {
      css += `@layer ${rule.name} {\n`;
      css += getLayerContent(rule, '  ');
      css += '}\n';
    } else {
      css += rule.cssText + '\n';
    }
  }
  return css;
}

function getLayerContent(layer: CSSGroupingRule, indent: string): string {
  let css = '';
  for (const rule of layer.cssRules) {
    if (rule instanceof CSSLayerBlockRule) {
      css += `${indent}@layer ${rule.name} {\n${getLayerContent(rule, indent + '  ')}${indent}}\n`;
    } else if (rule instanceof CSSMediaRule) {
      css += `${indent}@media ${rule.conditionText} {\n${getLayerContent(rule, indent + '  ')}${indent}}\n`;
    } else if (rule instanceof CSSContainerRule) {
      css += `${indent}@container ${rule.conditionText} {\n${getLayerContent(rule, indent + '  ')}${indent}}\n`;
    } else {
      css += `${indent}${rule.cssText}\n`;
    }
  }
  return css;
}

describe('Stylesheet', () => {
  // Reset DOM before tests? Singleton sheet persists, so we must be additive or check structure.
  // We'll rely on inspecting structure.

  it('inserts base rules into correct layers', () => {
    // Custom prop (Type 0, Priority 0)
    insert({
      content: '.custom-class { color: red; }',
      parsedMediaQuery: undefined,
      parsed: {
        propType: PROP_TYPE_OTHER,
        propKeyKebab: 'custom-class',
      } as unknown as ParsedClass,
    });

    const css = getSheetCSS();
    expect(css).toContain('@layer utils');
    // Expect Type 0 (t0), Priority 0 (p0)
    expect(css).toMatch(/@layer t0 {\s*[\s\S]*@layer p0/);
    expect(css).toContain('.custom-class { color: red; }');
  });

  it('layers margin (space) correctly (Type 1)', () => {
    // margin-left (Space Type 1, "margin-left" -> 1 dash -> Priority 1)
    insert({
      content: '.ml-4 { margin-left: 1rem; }',
      parsedMediaQuery: undefined,
      parsed: {
        propType: PROP_TYPE_SPACE,
        propKeyKebab: 'margin-left',
      } as unknown as ParsedClass,
    });

    const css = getSheetCSS();
    // Expect Type 1 (t1), Priority 1 (p1)
    expect(css).toMatch(/@layer t1 {\s*[\s\S]*@layer p1/);
    expect(css).toContain('.ml-4 { margin-left: 1rem; }');
  });

  it('layers padding (space) correctly (Type 1, Priority 0)', () => {
    // padding (Space Type 1, "padding" -> 0 dashes -> Priority 0)
    insert({
      content: '.p-4 { padding: 1rem; }',
      parsedMediaQuery: undefined,
      parsed: {
        propType: PROP_TYPE_SPACE,
        propKeyKebab: 'padding',
      } as unknown as ParsedClass,
    });

    const css = getSheetCSS();
    // Expect Type 1 (t1), Priority 0 (p0)
    expect(css).toMatch(/@layer t1 {\s*[\s\S]*@layer p0/);
    expect(css).toContain('.p-4 { padding: 1rem; }');
  });

  it('flattens CSS variables to Priority 0', () => {
    // --custom-long-var-name (Variable Type 3, many dashes)
    // Should be Priority 0 forced
    insert({
      content: '.var-test { --custom-long-var-name: 1; }',
      parsedMediaQuery: undefined,
      parsed: {
        propType: PROP_TYPE_VARIABLE,
        propKeyKebab: '--custom-long-var-name',
      } as unknown as ParsedClass,
    });

    const css = getSheetCSS();
    // If it obeyed dashes, it would be p3. We expect p0 for variables (Type 3)
    // Note: Type index for variables is PROP_TYPE_VARIABLE (3 in config)
    expect(css).toMatch(/@layer t3 {\s*[\s\S]*@layer p0/);
    expect(css).not.toMatch(/@layer t3 {\s*[\s\S]*@layer p3/);
  });

  it('sorts media queries correctly in buckets', () => {
    // Insert @lg rule (global) - Should fail if sorting is wrong
    // Larger min-width should be AFTER smaller min-width for mobile-first
    insert({
      content:
        '@media (min-width: 1024px) { .lg-class { margin-left: 2rem; } }',
      parsed: {
        propType: PROP_TYPE_SPACE,
        propKeyKebab: 'margin-left',
      } as unknown as ParsedClass,
      parsedMediaQuery: {
        bucketType: 'mnw',
        bucketVal: '1024px',
        bucketKey: '@lg',
        bucketQuery: '@media (min-width: 1024px)',
        prefix: '@media (min-width: 1024px)',
        suffix: '',
        rootSelector: '',
        overrideRootSelector: '',
      },
    });

    // Insert @md rule (global)
    insert({
      content: '@media (min-width: 768px) { .md-class { margin-left: 1rem; } }',
      parsed: {
        propType: PROP_TYPE_SPACE,
        propKeyKebab: 'margin-left',
      } as unknown as ParsedClass,
      parsedMediaQuery: {
        bucketType: 'mnw',
        bucketVal: '768px',
        bucketKey: '@md',
        bucketQuery: '@media (min-width: 768px)',
        prefix: '@media (min-width: 768px)',
        suffix: '',
        rootSelector: '',
        overrideRootSelector: '',
      },
    });

    const css = getSheetCSS();
    // Check order
    const idxMd = css.indexOf('@media (min-width: 768px)');
    const idxLg = css.indexOf('@media (min-width: 1024px)');
    expect(idxMd).toBeLessThan(idxLg);
  });

  it('inserts ref variables', () => {
    insertRefVar('primary', 'blue', 'color');
    insertRefVar('spacing-4', '1rem', 'number');

    const css = getSheetCSS();
    expect(css).toMatch(/@layer refs {\s*[\s\S]*@layer colors/);
    expect(css).toContain('--ref-primary: blue');

    expect(css).toMatch(/@layer refs {\s*[\s\S]*@layer numbers/);
    expect(css).toContain('--ref-spacing-4: 1rem');
  });

  it('validates hybrid rules: @not-dark:o-0', () => {
    const rule = buildRule('@not-dark:o-0');

    insert(rule);

    const css = getSheetCSS();

    /* System Rule: @media not (prefers-color-scheme: dark)
     * Should be in 'dark' bucket (Priority 100)
     */
    expect(css).toContain('@media not (prefers-color-scheme: dark)');
    expect(css).toContain(':root:not(.dark) .\\@not-dark\\:o-0');

    /* Manual Rule: .light (derived from not-dark)
     * Should be in 'base' bucket (no media query)
     */
    expect(css).toContain(':root.light .\\@not-dark\\:o-0');
  });

  it('validates hybrid nested rules: @mnw!=600px:@dark:o-0', () => {
    const rule = buildRule('@mnw!=600px:@dark:o-0');

    insert(rule);

    const css = getSheetCSS();

    /* System Rule: @media (prefers-color-scheme: dark)
     * Inside: @media not (min-width: 600px)
     */
    expect(css).toContain('@media (prefers-color-scheme: dark)');
    expect(css).toContain(
      ':root:not(.light) .\\@mnw\\!\\=600px\\:\\@dark\\:o-0',
    );

    /* Manual Override:
     * Regex removes @dark:. String becomes: @mnw!=600px:o-0
     * This has a media query: @media not (min-width: 600px).
     * So this should go into the 'mnw' bucket.
     */
    expect(css).toContain('@media not (min-width: 600px)');
    expect(css).toContain(':root.dark .\\@mnw\\!\\=600px\\:\\@dark\\:o-0');
  });
});

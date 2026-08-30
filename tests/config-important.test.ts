import { describe, expect, it } from 'vitest';
import { OPTIONS } from '../src/core/constants/config';
import { processClassList } from '../src/core/generator';
import { convert } from '../src/core/helpers/convert.helper';

// Enable the global important option for testing
OPTIONS.important = 1;

function testMerge(className: string, expected: string) {
  const el = document.createElement('div');
  el.className = className;
  processClassList(el);
  expect(el.className).toBe(expected);
}

function findStyleRule(
  root: CSSStyleSheet | CSSGroupingRule,
  selector: string,
): CSSStyleRule | undefined {
  for (const rule of root.cssRules) {
    if (rule instanceof CSSStyleRule && rule.selectorText === selector) {
      return rule;
    }
    if (
      rule instanceof CSSGroupingRule ||
      rule instanceof CSSMediaRule ||
      rule instanceof CSSLayerBlockRule
    ) {
      const found = findStyleRule(rule, selector);
      if (found) return found;
    }
  }
  return undefined;
}

describe('Global important option', () => {
  it('forces important on a plain utility', () => {
    expect(convert('o-0')).toBe('.o-0 { opacity: 0 !important; }');
  });

  it('forces important without shortcut', () => {
    expect(convert('opacity-0')).toBe('.opacity-0 { opacity: 0 !important; }');
  });

  it('keeps a single important with the ! prefix', () => {
    expect(convert('!o-5')).toBe('.\\!o-5 { opacity: 0.05 !important; }');
  });

  it('applies important to vendor-prefixed properties', () => {
    expect(convert('userSelect-none')).toBe(
      '.userSelect-none { -webkit-user-select: none !important;user-select: none !important; }',
    );
  });

  it('applies important to multi-declaration utilities', () => {
    expect(convert('px-4')).toContain('!important');
  });

  describe('Merge', () => {
    it('resolves same-property conflicts (later wins)', () => {
      testMerge('p-4 p-6', 'p-6');
      testMerge('m-4 m-8', 'm-8');
    });

    it('keeps non-conflicting utilities', () => {
      testMerge('p-4 m-4', 'p-4 m-4');
    });

    it('resolves shorthand/longhand conflicts', () => {
      testMerge('px-4 p-6', 'p-6');
      testMerge('p-3 px-5', 'p-3 px-5');
    });

    it('resolves media query conflicts within the same context only', () => {
      testMerge('@md:p-4 @md:p-6', '@md:p-6');
      testMerge('p-4 @md:p-4', 'p-4 @md:p-4');
    });

    it('deduplicates exact duplicates', () => {
      testMerge('p-6 p-6', 'p-6');
    });

    it('keeps the ! prefix merge semantics unchanged', () => {
      testMerge('!p-3 !p-4', '!p-4');
      testMerge('!p-3 p-4', '!p-3 p-4');
      testMerge('p-3 !p-4', '!p-4');
    });

    it('applies important to the surviving rule of a merge', () => {
      const el = document.createElement('div');
      el.className = 'pt-4 pt-6';
      document.body.append(el);
      processClassList(el);

      expect(el.className).toBe('pt-6');
      expect(getComputedStyle(el).paddingTop).toBe('24px');

      const sheet = (
        document.getElementById('mapleStyles') as HTMLStyleElement | null
      )?.sheet;
      const rule = sheet ? findStyleRule(sheet, '.pt-6') : undefined;

      expect(rule).toBeDefined();
      expect(rule?.style.getPropertyPriority('padding-top')).toBe('important');

      el.remove();
    });
  });
});

import { describe, expect, it } from 'vitest';
import { startRuntime } from '../src/core/bootstrap';

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
    (rule) => rule instanceof CSSLayerBlockRule && rule.name === name,
  ) as CSSLayerBlockRule | undefined;
}

function countStyleRules(
  root: CSSStyleSheet | CSSGroupingRule | undefined,
  predicate: (rule: CSSStyleRule) => boolean,
): number {
  if (!root) return 0;

  let count = 0;

  for (const rule of root.cssRules) {
    if (rule instanceof CSSStyleRule && predicate(rule)) {
      count++;
    } else if (
      rule instanceof CSSGroupingRule ||
      rule instanceof CSSMediaRule ||
      rule instanceof CSSLayerBlockRule
    ) {
      count += countStyleRules(rule, predicate);
    }
  }

  return count;
}

function waitForObserver() {
  return new Promise<void>((resolve) => setTimeout(resolve, 0));
}

describe('Runtime', () => {
  it('does not duplicate dynamic rules when started multiple times', async () => {
    const stopRuntime = startRuntime();

    expect(startRuntime()).toBe(stopRuntime);

    const el = document.createElement('div');
    el.className = '$$w=123px';

    try {
      document.body.append(el);

      await waitForObserver();
      await waitForObserver();

      const dynamic = findLayer(getSheet(), 'dynamic');
      const count = countStyleRules(
        dynamic,
        (rule) => rule.style.width === '123px',
      );

      expect(count).toBe(1);
    } finally {
      el.remove();
      stopRuntime?.();
    }
  });
});

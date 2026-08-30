import { describe, expect, it } from 'vitest';
import { collectAliases, expandAliasClass } from '../src/core/aliases';
import { startRuntime } from '../src/core/bootstrap';

function getSheet(): CSSStyleSheet | null {
  const el = document.getElementById('mapleStyles') as HTMLStyleElement | null;
  return el?.sheet ?? null;
}

function countStyleRules(
  root: CSSStyleSheet | CSSRule | undefined | null,
  predicate: (rule: CSSStyleRule) => boolean,
): number {
  if (!root) return 0;

  let count = 0;
  const rules =
    root instanceof CSSStyleSheet || root instanceof CSSGroupingRule
      ? root.cssRules
      : [];

  for (const rule of rules) {
    if (rule instanceof CSSStyleRule && predicate(rule)) {
      count++;
    } else {
      count += countStyleRules(rule, predicate);
    }
  }

  return count;
}

function countCardRules(): number {
  return countStyleRules(
    getSheet(),
    (rule) => rule.selectorText === '.\\@card',
  );
}

function waitForObserver() {
  return new Promise<void>((resolve) => setTimeout(resolve, 0));
}

/**
 * Aliases are locked when the runtime processes the root element on
 * startup. Later `--alias-*` changes on `<html>` must not alter alias
 * resolution: a redefinition would leave stale rules from the old
 * definition in the stylesheet, and clearing the alias cache without
 * removing those rules re-inserts duplicates on every re-render.
 */
describe('Alias locking', () => {
  it('ignores alias changes on <html> after the initial load', async () => {
    const initialRootClass = document.documentElement.className;

    document.documentElement.className = '--alias-card=p-2;rad-9';

    const stopRuntime = startRuntime();
    const box = document.createElement('div');

    box.className = '@card';

    try {
      document.body.append(box);

      await waitForObserver();

      // One padding rule and one border-radius rule
      expect(countCardRules()).toBe(2);
      expect(expandAliasClass('@card')).toEqual(['p-2', 'rad-9']);

      // Adding an unrelated alias and re-rendering must not re-insert rules
      document.documentElement.className =
        '--alias-card=p-2;rad-9 --alias-other=p-1';
      await waitForObserver();

      box.className = '';
      await waitForObserver();
      box.className = '@card';
      await waitForObserver();

      expect(countCardRules()).toBe(2);
      expect(expandAliasClass('@other')).toBeUndefined();

      // Redefining an alias after load is ignored entirely
      document.documentElement.className = '--alias-card=p-2';
      await waitForObserver();

      box.className = '';
      await waitForObserver();
      box.className = '@card';
      await waitForObserver();

      expect(countCardRules()).toBe(2);
      expect(expandAliasClass('@card')).toEqual(['p-2', 'rad-9']);
    } finally {
      box.remove();
      stopRuntime?.();
      document.documentElement.className = initialRootClass;
    }
  });

  it('keeps collectAliases inert once locked', () => {
    // The runtime test above already locked the alias set for this module
    collectAliases(['--alias-late=m-4']);

    expect(expandAliasClass('@late')).toBeUndefined();
    expect(expandAliasClass('@card')).toEqual(['p-2', 'rad-9']);
  });
});

import { describe, expect, it } from 'vitest';
import {
  CLASS_CACHE,
  SKIPPED_CLASS_CACHE,
} from '../src/core/constants/caches';
import { OPTIONS } from '../src/core/constants/config';
import { processClassList } from '../src/core/generator';

/**
 * Maple accepts any CSS selector after `&`, `^` and `/`, so a class can
 * carry a selector the browser refuses to parse — a vendor pseudo
 * element from another engine is the common case in shared component
 * markup. `CSSGroupingRule.insertRule` throws a SyntaxError on those,
 * and the engine must absorb it: the offending class gets no rule, and
 * everything else keeps working.
 *
 * Each test uses a distinct bad class and distinct utilities, because a
 * class that failed to insert is still cached and would otherwise make
 * a later test pass without exercising anything.
 */
describe('Unparsable selectors', () => {
  it('chrome rejects the selector maple emits for it', () => {
    const style = document.createElement('style');
    document.head.append(style);

    const sheet = style.sheet;

    expect(sheet).toBeTruthy();
    expect(() =>
      sheet?.insertRule('.x::-moz-progress-bar { color: red; }', 0),
    ).toThrow(/invalid|parse/i);

    style.remove();
  });

  it('keeps the other rules of the same element', () => {
    const el = document.createElement('div');
    el.className = 'p-8 &::-moz-progress-bar:bgc-red mt-5';
    document.body.append(el);

    expect(() => processClassList(el)).not.toThrow();

    expect(getComputedStyle(el).paddingTop).toBe('32px');
    expect(getComputedStyle(el).marginTop).toBe('20px');

    el.remove();
  });

  it('retracts the cache entry of a rule the browser rejected', () => {
    const bad = '&::-moz-range-track:bgc-green';
    const el = document.createElement('div');
    el.className = bad;
    document.body.append(el);
    processClassList(el);

    // the cache must not claim a rule the stylesheet never took
    expect(CLASS_CACHE.has(bad)).toBe(false);
    // and the rejection is final, so it is not rebuilt per element
    expect(SKIPPED_CLASS_CACHE.has(bad)).toBe(true);

    el.remove();
  });

  it('keeps batched inserts flowing after a rejected rule', async () => {
    OPTIONS.batching = 1;

    try {
      const bad = document.createElement('div');
      bad.className = '&::-moz-progress-bar:bgc-yellow pt-7';
      document.body.append(bad);
      processClassList(bad);

      await new Promise((resolve) => setTimeout(resolve, 20));

      expect(getComputedStyle(bad).paddingTop).toBe('28px');

      // a later element must still reach the stylesheet
      const after = document.createElement('div');
      after.className = 'pl-9';
      document.body.append(after);
      processClassList(after);

      await new Promise((resolve) => setTimeout(resolve, 20));

      expect(getComputedStyle(after).paddingLeft).toBe('36px');

      bad.remove();
      after.remove();
    } finally {
      OPTIONS.batching = 0;
    }
  });

  it('does not strand the same utilities on later elements', () => {
    const bad = document.createElement('div');
    bad.className = '&::-moz-range-thumb:bgc-blue mb-6';
    document.body.append(bad);

    try {
      processClassList(bad);
    } catch {
      // the throw is the bug under test; this test is about the fallout
    }

    bad.remove();

    const el = document.createElement('div');
    el.className = 'mb-6';
    document.body.append(el);
    processClassList(el);

    expect(getComputedStyle(el).marginBottom).toBe('24px');

    el.remove();
  });
});

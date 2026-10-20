import { describe, expect, it } from 'vitest';
import { collectAliases, expandAliasClass } from '../src/core/aliases';
import { startObserver } from '../src/core/observer';

/**
 * The root pass runs before `lockAliases()` and `observer.observe()`
 * (observer.ts), so an unparsable selector in the `<html>` class
 * attribute leaves the runtime unstarted: the alias set never freezes
 * and no element added afterwards is ever processed.
 *
 * This lives in its own file because a failed insert is still cached,
 * and a bad class already parsed by another test would never reach
 * `insertRule` again.
 */
describe('Unparsable selector on the root element', () => {
  it('still starts the runtime', async () => {
    const html = document.documentElement;
    const original = html.className;

    html.className = '&::-moz-progress-bar:bgc-red p-8';

    let stop: (() => void) | undefined;

    try {
      expect(() => {
        stop = startObserver();
      }).not.toThrow();

      // the alias set is frozen only if the root pass completed
      collectAliases(['--alias-zzz=p-4']);
      expect(expandAliasClass('@zzz')).toBeUndefined();

      const el = document.createElement('div');
      el.className = 'p-8';
      document.body.append(el);

      await new Promise((resolve) => setTimeout(resolve, 20));

      expect(getComputedStyle(el).paddingTop).toBe('32px');

      el.remove();
    } finally {
      html.className = original;
      stop?.();
    }
  });
});

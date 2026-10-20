import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type MockInstance,
  vi,
} from 'vitest';
import { collectAliases, expandAliasClass, lockAliases } from '../src/core/aliases';
import { CACHE_MAX_SIZE, OPTIONS } from '../src/core/constants/config';
import { processClassList } from '../src/core/generator';
import { setCacheItem } from '../src/core/helpers/cache.helper';
import { convert } from '../src/core/helpers/convert.helper';

// Enable the debug option for this module
OPTIONS.debug = 1;

let warnSpy: MockInstance<typeof console.warn>;

beforeEach(() => {
  warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
  warnSpy.mockRestore();
});

function warnings(): Array<string> {
  return warnSpy.mock.calls.map((call) => String(call[0]));
}

function testMerge(className: string, expected: string) {
  const el = document.createElement('div');
  el.className = className;
  processClassList(el);
  expect(el.className).toBe(expected);
}

describe('Debug mode', () => {
  describe('Skipped classes', () => {
    it('warns for an unknown utility with Maple syntax markers', () => {
      convert('!bogusprop-4');

      expect(warnings()).toContain(
        '[maple] skipped "!bogusprop-4": unknown utility',
      );
    });

    it('warns for a class with a context but no style declaration', () => {
      convert('&:hover:zzz');

      expect(
        warnings().some((message) =>
          message.includes('skipped "&:hover:zzz"'),
        ),
      ).toBe(true);
    });

    it('warns for a vendor prefixed property in token form', () => {
      convert('-webkit-line-clamp-3');

      expect(warnings()).toContain(
        '[maple] skipped "-webkit-line-clamp-3": unknown utility (a vendor prefixed property needs the assignment form, as in `-webkit-line-clamp=3`)',
      );
    });

    it('does not hint when the vendor prefixed property is assigned', () => {
      convert('-webkit-line-clamp=');

      expect(
        warnings().some(
          (message) =>
            message.includes('skipped "-webkit-line-clamp="') &&
            !message.includes('assignment form'),
        ),
      ).toBe(true);
    });

    it('does not treat a working vendor prefixed property as skipped', () => {
      expect(convert('-webkit-box-orient=vertical')).toBe(
        '.-webkit-box-orient\\=vertical { -webkit-box-orient: vertical; }',
      );
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('warns when layer order decides a shorthand/longhand pair', () => {
      const el = document.createElement('div');
      el.className = 'background=gray &.on:bgimg=[url(a.png)]';
      processClassList(el);

      expect(
        warnings().some(
          (message) =>
            message.includes('layer order decides') &&
            message.includes('background-image') &&
            message.includes('background'),
        ),
      ).toBe(true);
    });

    it('stays silent when the pair takes the same kind of value', () => {
      const el = document.createElement('div');
      el.className = 'background=white &.on:bgc=black';
      processClassList(el);

      expect(
        warnings().some((message) => message.includes('layer order decides')),
      ).toBe(false);
    });

    it('stays silent when the merge step already resolved the pair', () => {
      const el = document.createElement('div');
      el.className = 'background=silver bgimg=[url(b.png)]';
      processClassList(el);

      expect(
        warnings().some((message) => message.includes('layer order decides')),
      ).toBe(false);
    });

    it('stays silent for unrelated properties', () => {
      const el = document.createElement('div');
      el.className = 'p-4 &.on:bgc=teal';
      processClassList(el);

      expect(
        warnings().some((message) => message.includes('layer order decides')),
      ).toBe(false);
    });

    it('stays silent for plain CSS classes', () => {
      convert('btn-primary');
      convert('navitem');

      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('does not treat valid utilities as skipped', () => {
      convert('bgc-primary');

      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('warns for a known utility key that fails to build, even without syntax markers', () => {
      convert('bgc-');

      expect(warnings()).toContain(
        '[maple] skipped "bgc-": no style declaration',
      );
    });

    it('warns only once for the same class', () => {
      convert('!dedupeprop-1');
      convert('!dedupeprop-1');

      expect(
        warnings().filter((message) => message.includes('dedupeprop')).length,
      ).toBe(1);
    });

    it('attaches the processed element to skipped-class warnings', () => {
      const el = document.createElement('div');
      el.className = '!elemprop-9';
      processClassList(el);

      const call = warnSpy.mock.calls.find((args) =>
        String(args[0]).includes('elemprop'),
      );

      expect(call?.[1]).toBe(el);
    });

    it('stays silent when debug is off', () => {
      OPTIONS.debug = 0;
      convert('!offprop-1');
      OPTIONS.debug = 1;

      expect(warnSpy).not.toHaveBeenCalled();
    });
  });

  describe('Merge rewrites', () => {
    it('logs the class attribute rewrite when a conflict is resolved', () => {
      testMerge('pb-4 pb-6', 'pb-6');

      expect(warnings()).toContain('[maple] merged: "pb-4 pb-6" -> "pb-6"');
    });

    it('logs the rewrite when a shorthand covers a longhand', () => {
      testMerge('pt-2 p-8', 'p-8');

      expect(warnings()).toContain('[maple] merged: "pt-2 p-8" -> "p-8"');
    });

    it('passes the element so it can be inspected in DevTools', () => {
      const el = document.createElement('div');
      el.className = 'mr-2 mr-4';
      processClassList(el);

      const call = warnSpy.mock.calls.find((args) =>
        String(args[0]).includes('mr-2 mr-4'),
      );

      expect(call?.[1]).toBe(el);
    });

    it('stays silent for non-conflicting classes', () => {
      testMerge('mt-4 mb-4', 'mt-4 mb-4');

      expect(warnSpy).not.toHaveBeenCalled();
    });
  });

  describe('Aliases', () => {
    it('warns for an unknown alias', () => {
      expect(expandAliasClass('@doesnotexist')).toBeUndefined();

      expect(warnings()).toContain('[maple] unknown alias "@doesnotexist"');
    });

    it('warns when the expansion depth limit is reached', () => {
      collectAliases(['--alias-loopy=@loopy', '--alias-basic=p-2']);

      expandAliasClass('@loopy');

      expect(
        warnings().some(
          (message) =>
            message.includes('depth limit') && message.includes('@loopy'),
        ),
      ).toBe(true);
    });

    it('warns for a new alias definition arriving after the lock', () => {
      lockAliases();

      collectAliases(['--alias-late=m-4']);

      expect(expandAliasClass('@late')).toBeUndefined();
      expect(warnings()).toContain(
        '[maple] ignored alias definition after initial load "late"',
      );
    });

    it('stays silent for unchanged definitions after the lock', () => {
      collectAliases(['--alias-basic=p-2']);

      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('attaches the processed element to alias warnings', () => {
      const el = document.createElement('div');
      el.className = '@nosuchalias';
      processClassList(el);

      const call = warnSpy.mock.calls.find((args) =>
        String(args[0]).includes('nosuchalias'),
      );

      expect(call?.[1]).toBe(el);
    });

    it('warns for a changed definition after the lock', () => {
      collectAliases(['--alias-basic=p-4']);

      expect(expandAliasClass('@basic')).toEqual(['p-2']);
      expect(
        warnings().some((message) =>
          message.includes('ignored alias definition after initial load "basic"'),
        ),
      ).toBe(true);
    });
  });

  describe('Cache eviction', () => {
    it('warns when the cache evicts entries', () => {
      const cache = new Map<string, number>();

      for (let i = 0; i <= CACHE_MAX_SIZE; i++) {
        setCacheItem(cache, `key-${i}`, i);
      }

      expect(
        warnings().some((message) => message.includes('cache eviction #1')),
      ).toBe(true);
    });
  });
});

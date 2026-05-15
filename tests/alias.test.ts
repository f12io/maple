import { describe, expect, it } from 'vitest';
import { collectAliases } from '../src/core/aliases';
import { ALIAS_CLASS_CACHE, CLASS_CACHE } from '../src/core/constants/caches';
import { processClassList } from '../src/core/generator';
import { convert } from './helpers/convert.helper';

function rule(selector: string, content: string) {
  return `:where(${selector}) { ${content} }`;
}

function rules(selector: string, contents: Array<string>) {
  return contents.map((content) => rule(selector, content)).join(' ');
}

function mediaRule(media: string, selector: string, content: string) {
  return `${media} { ${rule(selector, content)} }`;
}

describe('User Defined Aliases', () => {
  it('collects user aliases from root definitions', () => {
    collectAliases(['--alias-card=p-4;bgc-red']);

    expect(convert('@card')).toBe(
      `${rule(
        '.\\@card',
        'padding: var(--p-4, var(--space-4, calc(4rem * var(--p-spacer, var(--spacer, 0.25)))));',
      )} ${rule(
        '.\\@card',
        'background-color: oklch(from var(--bgc-red, var(--color-red, var(--red, red))) calc(l * var(--bgc-red-l-scale, var(--red-l-scale, var(--bgc-l-scale, var(--l-scale, 1))))) calc(c * var(--bgc-red-c-scale, var(--red-c-scale, var(--bgc-c-scale, var(--c-scale, 1))))) calc(h + var(--bgc-red-h-rotate, var(--red-h-rotate, var(--bgc-h-rotate, var(--h-rotate, 0))))) / alpha);',
      )}`,
    );

    collectAliases([]);
  });

  it('lets user aliases override built-ins only when @ is used', () => {
    collectAliases(['--alias-fx=d-grid']);

    expect(convert('@fx')).toBe(
      rule('.\\@fx', 'display: var(--d-grid, var(--grid, grid));'),
    );

    expect(convert('fx')).toBe(rule('.fx', 'display: flex;'));

    collectAliases([]);
  });
});

describe('Built-in aliases', () => {
  it('flex', () => {
    expect(convert('fx')).toBe(rule('.fx', 'display: flex;'));
  });

  it('expands built-in aliases with @', () => {
    expect(convert('@fx')).toBe(rule('.\\@fx', 'display: flex;'));
  });

  it('md:flex', () => {
    expect(convert('md:fx')).toBe(
      mediaRule('@container (min-width: 768px)', '.md\\:fx', 'display: flex;'),
    );
  });

  it('md:&hover:flex', () => {
    expect(convert('md:&:hover:fx')).toBe(
      `@container (min-width: 768px) { :where(.md\\:\\&\\:hover\\:fx):hover { display: flex; } }`,
    );
  });

  it('d-flex', () => {
    expect(convert('d-flex')).toBe(
      `.d-flex { display: var(--d-flex, var(--flex, flex)); }`,
    );
  });

  it('d=flex', () => {
    expect(convert('d=flex')).toBe(`.d\\=flex { display: flex; }`);
  });

  it('flex important', () => {
    expect(convert('!fx')).toBe(rule('.\\!fx', 'display: flex !important;'));
  });

  it('grid', () => {
    expect(convert('gr')).toBe(rule('.gr', 'display: grid;'));
  });

  it('block', () => {
    expect(convert('block')).toBe(rule('.block', 'display: block;'));
  });

  it('none', () => {
    expect(convert('none')).toBe(rule('.none', 'display: none;'));
  });

  it('d-none', () => {
    expect(convert('d-none')).toBe(`.d-none { display: none; }`);
  });

  it('d=none', () => {
    expect(convert('d=none')).toBe(`.d\\=none { display: none; }`);
  });

  it('table', () => {
    expect(convert('table')).toBe(rule('.table', 'display: table;'));
  });

  it('inline', () => {
    expect(convert('inline')).toBe(rule('.inline', 'display: inline;'));
  });

  it('inline-block', () => {
    expect(convert('iblock')).toBe(rule('.iblock', 'display: inline-block;'));
  });

  it('inline-flex', () => {
    expect(convert('ifx')).toBe(rule('.ifx', 'display: inline-flex;'));
  });

  it('absolute', () => {
    expect(convert('abs')).toBe(rule('.abs', 'position: absolute;'));
  });

  it('absolute important', () => {
    expect(convert('!abs')).toBe(
      rule('.\\!abs', 'position: absolute !important;'),
    );
  });

  it('relative', () => {
    expect(convert('rel')).toBe(rule('.rel', 'position: relative;'));
  });

  it('sticky', () => {
    expect(convert('sticky')).toBe(rule('.sticky', 'position: sticky;'));
  });

  it('static', () => {
    expect(convert('static')).toBe(rule('.static', 'position: static;'));
  });

  it('visible', () => {
    expect(convert('visible')).toBe(rule('.visible', 'visibility: visible;'));
  });

  it('hidden', () => {
    expect(convert('hidden')).toBe(rule('.hidden', 'visibility: hidden;'));
  });

  it('border', () => {
    expect(convert('br')).toBe(
      rules('.br', ['border-width: 1px;', 'border-style: solid;']),
    );
  });

  it('border top', () => {
    expect(convert('brt')).toBe(
      rules('.brt', ['border-top-width: 1px;', 'border-top-style: solid;']),
    );
  });

  it('border right', () => {
    expect(convert('brr')).toBe(
      rules('.brr', ['border-right-width: 1px;', 'border-right-style: solid;']),
    );
  });

  it('border bottom', () => {
    expect(convert('brb')).toBe(
      rules('.brb', [
        'border-bottom-width: 1px;',
        'border-bottom-style: solid;',
      ]),
    );
  });

  it('border left', () => {
    expect(convert('brl')).toBe(
      rules('.brl', ['border-left-width: 1px;', 'border-left-style: solid;']),
    );
  });

  it('border inline', () => {
    expect(convert('brx')).toBe(
      rules('.brx', [
        'border-inline-width: 1px;',
        'border-inline-style: solid;',
      ]),
    );
  });

  it('border inline start', () => {
    expect(convert('brxs')).toBe(
      rules('.brxs', [
        'border-inline-start-width: 1px;',
        'border-inline-start-style: solid;',
      ]),
    );
  });

  it('border inline end', () => {
    expect(convert('brxe')).toBe(
      rules('.brxe', [
        'border-inline-end-width: 1px;',
        'border-inline-end-style: solid;',
      ]),
    );
  });

  it('border block', () => {
    expect(convert('bry')).toBe(
      rules('.bry', ['border-block-width: 1px;', 'border-block-style: solid;']),
    );
  });

  it('border block start', () => {
    expect(convert('brys')).toBe(
      rules('.brys', [
        'border-block-start-width: 1px;',
        'border-block-start-style: solid;',
      ]),
    );
  });

  it('border block end', () => {
    expect(convert('brye')).toBe(
      rules('.brye', [
        'border-block-end-width: 1px;',
        'border-block-end-style: solid;',
      ]),
    );
  });

  it('container', () => {
    expect(convert('cnt')).toBe(rule('.cnt', 'container-type: inline-size;'));
  });
});

describe('Alias Behavior Tests', () => {
  it('caches alias-expanded rules separately from normal utility rules', () => {
    ALIAS_CLASS_CACHE.clear();
    CLASS_CACHE.delete('p-4');
    collectAliases(['--alias-cached-card=p-4']);

    const aliasEl = document.createElement('div');
    aliasEl.className = '@cached-card';
    processClassList(aliasEl);

    expect(ALIAS_CLASS_CACHE.get('@cached-card=>p-4')).toBe('padding:');
    expect(CLASS_CACHE.has('p-4')).toBe(false);

    const utilityEl = document.createElement('div');
    utilityEl.className = 'p-4';
    processClassList(utilityEl);

    expect(CLASS_CACHE.get('p-4')).toBe('padding:');

    collectAliases([]);
  });

  it('clears alias-expanded cache when root aliases change', () => {
    ALIAS_CLASS_CACHE.clear();
    collectAliases(['--alias-cache-change=p-4']);

    const el = document.createElement('div');
    el.className = '@cache-change';
    processClassList(el);

    expect(ALIAS_CLASS_CACHE.has('@cache-change=>p-4')).toBe(true);

    collectAliases(['--alias-cache-change=p-8']);

    expect(ALIAS_CLASS_CACHE.has('@cache-change=>p-4')).toBe(false);

    collectAliases([]);
  });

  it('ignores alias definitions with media queries or selectors', () => {
    collectAliases(['md:--alias-card=p-4', '&:hover:--alias-card=p-4']);

    expect(convert('md:--alias-card=p-4')).toBe(
      `@container (min-width: 768px) { .md\\:--alias-card\\=p-4 { --alias-card: p-4; } }`,
    );

    expect(convert('&:hover:--alias-card=p-4')).toBe(
      `.\\&\\:hover\\:--alias-card\\=p-4:hover { --alias-card: p-4; }`,
    );

    expect(convert('@card')).toBeUndefined();

    collectAliases([]);
  });

  it('expands alias usage with media queries and selectors', () => {
    collectAliases(['--alias-card=p-4']);

    expect(convert('md:@card')).toBe(
      mediaRule(
        '@container (min-width: 768px)',
        '.md\\:\\@card',
        'padding: var(--p-4, var(--space-4, calc(4rem * var(--p-spacer, var(--spacer, 0.25)))));',
      ),
    );

    expect(convert('@md:@card')).toBe(
      mediaRule(
        '@media (min-width: 768px)',
        '.\\@md\\:\\@card',
        'padding: var(--p-4, var(--space-4, calc(4rem * var(--p-spacer, var(--spacer, 0.25)))));',
      ),
    );

    expect(convert('&:hover:@card')).toBe(
      `:where(.\\&\\:hover\\:\\@card):hover { padding: var(--p-4, var(--space-4, calc(4rem * var(--p-spacer, var(--spacer, 0.25))))); }`,
    );

    collectAliases([]);
  });
});

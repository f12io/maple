import { describe, expect, it } from 'vitest';
import { collectAliases, expandAliasClass } from '../src/core/aliases';
import { ALIAS_CLASS_CACHE, CLASS_CACHE } from '../src/core/constants/caches';
import { processClassList } from '../src/core/generator';
import { convert } from '../src/core/helpers/convert.helper';

describe('User Defined Aliases', () => {
  it('collects user aliases from root definitions', () => {
    collectAliases(['--alias-card=p-4;bgc-red']);

    expect(convert('@card')).toBe(
      `.\\@card { padding: var(--p-4, var(--space-4, calc(4rem * var(--p-spacer, var(--spacer, 0.25))))); } .\\@card { background-color: oklch(from var(--bgc-red, var(--color-red, var(--red, red))) calc(l * var(--bgc-red-l-scale, var(--red-l-scale, var(--bgc-l-scale, var(--l-scale, 1))))) calc(c * var(--bgc-red-c-scale, var(--red-c-scale, var(--bgc-c-scale, var(--c-scale, 1))))) calc(h + var(--bgc-red-h-rotate, var(--red-h-rotate, var(--bgc-h-rotate, var(--h-rotate, 0))))) / alpha); }`,
    );

    collectAliases([]);
  });

  it('lets user aliases override built-ins only when @ is used', () => {
    collectAliases(['--alias-fx=d-grid']);

    expect(convert('@fx')).toBe(
      '.\\@fx { display: var(--d-grid, var(--grid, grid)); }',
    );

    expect(convert('fx')).toBe('.fx { display: flex; }');

    collectAliases([]);
  });
});

describe('Parameterized aliases', () => {
  it('expands a single positional parameter', () => {
    collectAliases(['--alias-underline=brc-{color}-900;pb-2']);

    expect(expandAliasClass('@underline(primary)')).toEqual([
      'brc-primary-900',
      'pb-2',
    ]);

    collectAliases([]);
  });

  it('expands multiple named parameters', () => {
    collectAliases(['--alias-pill=bgc-{color};px-{space};content={label}']);

    expect(expandAliasClass('@pill(color:primary,space:3,label:New)')).toEqual([
      'bgc-primary',
      'px-3',
      'content=New',
    ]);

    collectAliases([]);
  });

  it('keeps bracketed commas inside parameter values', () => {
    collectAliases(['--alias-swatch=bgc={color};content={label}']);

    expect(
      expandAliasClass('@swatch(color:[rgba(0,0,0,1)],label:[Hello, world])'),
    ).toEqual(['bgc=rgba(0,0,0,1)', 'content=Hello, world']);

    collectAliases([]);
  });

  it('expands parameters with media queries, selectors, and bracketed commas', () => {
    collectAliases(['--alias-underline=brc={color};pb-{space,2}']);

    expect(
      expandAliasClass(
        '@dark:^.card:@underline(color:[rgba(0,0,0,1)],space:2)',
      ),
    ).toEqual([
      '@dark:^.card:brc=rgba(0,0,0,1)',
      '@dark:^.card:pb-2',
    ]);

    collectAliases([]);
  });

  it('expands parameters in media, selector, property, and value positions', () => {
    collectAliases([
      '--alias-complex={media,md}:@{orientation,landscape}:^{parentSelector,.card}:{property,fs}={value,2}',
    ]);

    expect(expandAliasClass('@complex')).toEqual([
      'md:@landscape:^.card:fs=2',
    ]);
    expect(
      expandAliasClass(
        '@complex(media:lg,orientation:portrait,parentSelector:[.panel.active],property:c,value:primary)',
      ),
    ).toEqual(['lg:@portrait:^.panel.active:c=primary']);

    collectAliases([]);
  });

  it('falls back to placeholder defaults for omitted parameters', () => {
    collectAliases(['--alias-underline=brc-{color,body}-900;pb-{space,2}']);

    expect(expandAliasClass('@underline')).toEqual(['brc-body-900', 'pb-2']);
    expect(expandAliasClass('@underline(color:primary)')).toEqual([
      'brc-primary-900',
      'pb-2',
    ]);

    collectAliases([]);
  });

  it('maps one positional parameter to the first placeholder and defaults the rest', () => {
    collectAliases(['--alias-card=bgc-{color,body};p-{space,2}']);

    expect(expandAliasClass('@card(primary)')).toEqual([
      'bgc-primary',
      'p-2',
    ]);

    collectAliases([]);
  });

  it('rejects multiple positional parameters', () => {
    collectAliases(['--alias-card=bgc-{color,body};p-{space,2}']);

    expect(expandAliasClass('@card(primary,3)')).toBeUndefined();

    collectAliases([]);
  });

  it('expands nested aliases with forwarded parameters', () => {
    collectAliases([
      '--alias-background=bgc-{color,body}',
      '--alias-card=@background({color});p-{space,2}',
    ]);

    expect(expandAliasClass('@card(primary)')).toEqual(['bgc-primary', 'p-2']);
    expect(expandAliasClass('@card(color:accent,space:4)')).toEqual([
      'bgc-accent',
      'p-4',
    ]);

    collectAliases([]);
  });

  it('generates CSS for parameterized aliases', () => {
    collectAliases(['--alias-space=p-{space,2}']);

    expect(convert('@space(4)')).toBe(
      '.\\@space\\(4\\) { padding: var(--p-4, var(--space-4, calc(4rem * var(--p-spacer, var(--spacer, 0.25))))); }',
    );

    collectAliases([]);
  });
});

describe('Built-in aliases', () => {
  it('flex', () => {
    expect(convert('fx')).toBe('.fx { display: flex; }');
  });

  it('expands built-in aliases with @', () => {
    expect(convert('@fx')).toBe('.\\@fx { display: flex; }');
  });

  it('md:flex', () => {
    expect(convert('md:fx')).toBe(
      '@container (min-width: 768px) { .md\\:fx { display: flex; } }',
    );
  });

  it('md:&hover:flex', () => {
    expect(convert('md:&:hover:fx')).toBe(
      `@container (min-width: 768px) { .md\\:\\&\\:hover\\:fx:hover { display: flex; } }`,
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
    expect(convert('!fx')).toBe('.\\!fx { display: flex !important; }');
  });

  it('grid', () => {
    expect(convert('gr')).toBe('.gr { display: grid; }');
  });

  it('block', () => {
    expect(convert('block')).toBe('.block { display: block; }');
  });

  it('none', () => {
    expect(convert('none')).toBe('.none { display: none; }');
  });

  it('d-none', () => {
    expect(convert('d-none')).toBe(`.d-none { display: none; }`);
  });

  it('d=none', () => {
    expect(convert('d=none')).toBe(`.d\\=none { display: none; }`);
  });

  it('table', () => {
    expect(convert('table')).toBe('.table { display: table; }');
  });

  it('inline', () => {
    expect(convert('inline')).toBe('.inline { display: inline; }');
  });

  it('inline-block', () => {
    expect(convert('iblock')).toBe('.iblock { display: inline-block; }');
  });

  it('inline-flex', () => {
    expect(convert('ifx')).toBe('.ifx { display: inline-flex; }');
  });

  it('absolute', () => {
    expect(convert('abs')).toBe('.abs { position: absolute; }');
  });

  it('absolute important', () => {
    expect(convert('!abs')).toBe('.\\!abs { position: absolute !important; }');
  });

  it('relative', () => {
    expect(convert('rel')).toBe('.rel { position: relative; }');
  });

  it('sticky', () => {
    expect(convert('sticky')).toBe('.sticky { position: sticky; }');
  });

  it('static', () => {
    expect(convert('static')).toBe('.static { position: static; }');
  });

  it('visible', () => {
    expect(convert('visible')).toBe('.visible { visibility: visible; }');
  });

  it('hidden', () => {
    expect(convert('hidden')).toBe('.hidden { visibility: hidden; }');
  });

  it('border', () => {
    expect(convert('br')).toBe(
      '.br { border-width: 1px; } .br { border-style: solid; }',
    );
  });

  it('border top', () => {
    expect(convert('brt')).toBe(
      '.brt { border-top-width: 1px; } .brt { border-top-style: solid; }',
    );
  });

  it('border right', () => {
    expect(convert('brr')).toBe(
      '.brr { border-right-width: 1px; } .brr { border-right-style: solid; }',
    );
  });

  it('border bottom', () => {
    expect(convert('brb')).toBe(
      '.brb { border-bottom-width: 1px; } .brb { border-bottom-style: solid; }',
    );
  });

  it('border left', () => {
    expect(convert('brl')).toBe(
      '.brl { border-left-width: 1px; } .brl { border-left-style: solid; }',
    );
  });

  it('border inline', () => {
    expect(convert('brx')).toBe(
      '.brx { border-inline-width: 1px; } .brx { border-inline-style: solid; }',
    );
  });

  it('border inline start', () => {
    expect(convert('brxs')).toBe(
      '.brxs { border-inline-start-width: 1px; } .brxs { border-inline-start-style: solid; }',
    );
  });

  it('border inline end', () => {
    expect(convert('brxe')).toBe(
      '.brxe { border-inline-end-width: 1px; } .brxe { border-inline-end-style: solid; }',
    );
  });

  it('border block', () => {
    expect(convert('bry')).toBe(
      '.bry { border-block-width: 1px; } .bry { border-block-style: solid; }',
    );
  });

  it('border block start', () => {
    expect(convert('brys')).toBe(
      '.brys { border-block-start-width: 1px; } .brys { border-block-start-style: solid; }',
    );
  });

  it('border block end', () => {
    expect(convert('brye')).toBe(
      '.brye { border-block-end-width: 1px; } .brye { border-block-end-style: solid; }',
    );
  });

  it('container', () => {
    expect(convert('cnt')).toBe('.cnt { container-type: inline-size; }');
  });

  it('truncate', () => {
    expect(convert('truncate')).toBe(
      '.truncate { overflow: hidden; } .truncate { text-overflow: ellipsis; } .truncate { white-space: nowrap; }',
    );
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
      '@container (min-width: 768px) { .md\\:\\@card { padding: var(--p-4, var(--space-4, calc(4rem * var(--p-spacer, var(--spacer, 0.25))))); } }',
    );

    expect(convert('@md:@card')).toBe(
      '@media (min-width: 768px) { .\\@md\\:\\@card { padding: var(--p-4, var(--space-4, calc(4rem * var(--p-spacer, var(--spacer, 0.25))))); } }',
    );

    expect(convert('&:hover:@card')).toBe(
      `.\\&\\:hover\\:\\@card:hover { padding: var(--p-4, var(--space-4, calc(4rem * var(--p-spacer, var(--spacer, 0.25))))); }`,
    );

    collectAliases([]);
  });

  it('define media queries and selectors in alias definition', () => {
    collectAliases(['--alias-card=@lg:p-4;&:hover:p-8']);

    expect(convert('@card')).toBe(
      [
        '@media (min-width: 1024px) { .\\@card { padding: var(--p-4, var(--space-4, calc(4rem * var(--p-spacer, var(--spacer, 0.25))))); } }',
        '.\\@card:hover { padding: var(--p-8, var(--space-8, calc(8rem * var(--p-spacer, var(--spacer, 0.25))))); }',
      ].join(' '),
    );

    expect(convert('@md:@card')).toBe(
      [
        '@media (min-width: 768px) { @media (min-width: 1024px) { .\\@md\\:\\@card { padding: var(--p-4, var(--space-4, calc(4rem * var(--p-spacer, var(--spacer, 0.25))))); } } }',
        '@media (min-width: 768px) { .\\@md\\:\\@card:hover { padding: var(--p-8, var(--space-8, calc(8rem * var(--p-spacer, var(--spacer, 0.25))))); } }',
      ].join(' '),
    );

    expect(convert('&:hover:@card')).toBe(
      [
        '@media (min-width: 1024px) { .\\&\\:hover\\:\\@card:hover { padding: var(--p-4, var(--space-4, calc(4rem * var(--p-spacer, var(--spacer, 0.25))))); } }',
        '.\\&\\:hover\\:\\@card:hover:hover { padding: var(--p-8, var(--space-8, calc(8rem * var(--p-spacer, var(--spacer, 0.25))))); }',
      ].join(' '),
    );

    expect(convert('&:before:@card')).toBe(
      [
        '@media (min-width: 1024px) { .\\&\\:before\\:\\@card:before { padding: var(--p-4, var(--space-4, calc(4rem * var(--p-spacer, var(--spacer, 0.25))))); } }',
        '.\\&\\:before\\:\\@card:hover:before { padding: var(--p-8, var(--space-8, calc(8rem * var(--p-spacer, var(--spacer, 0.25))))); }',
      ].join(' '),
    );

    collectAliases([]);
  });

  it('define multiple media queries', () => {
    collectAliases(['--alias-card=@lg:p-4;sm:&:hover:p-8']);

    expect(convert('@card')).toBe(
      [
        '@media (min-width: 1024px) { .\\@card { padding: var(--p-4, var(--space-4, calc(4rem * var(--p-spacer, var(--spacer, 0.25))))); } }',
        '@container (min-width: 640px) { .\\@card:hover { padding: var(--p-8, var(--space-8, calc(8rem * var(--p-spacer, var(--spacer, 0.25))))); } }',
      ].join(' '),
    );

    expect(convert('@md:@card')).toBe(
      [
        '@media (min-width: 768px) { @media (min-width: 1024px) { .\\@md\\:\\@card { padding: var(--p-4, var(--space-4, calc(4rem * var(--p-spacer, var(--spacer, 0.25))))); } } }',
        '@media (min-width: 768px) { @container (min-width: 640px) { .\\@md\\:\\@card:hover { padding: var(--p-8, var(--space-8, calc(8rem * var(--p-spacer, var(--spacer, 0.25))))); } } }',
      ].join(' '),
    );

    collectAliases([]);
  });
});

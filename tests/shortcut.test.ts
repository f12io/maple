import { describe, expect, it } from 'vitest';
import { convert } from './helpers/convert.helper';

describe('Shortcuts', () => {
  it('flex', () => {
    expect(convert('fx')).toBe(`.fx { display: flex; }`);
  });

  it('md:flex', () => {
    expect(convert('md:fx')).toBe(
      `@container (min-width: 768px) { .md\\:fx { display: flex; } }`,
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
    expect(convert('!fx')).toBe(`.\\!fx { display: flex !important; }`);
  });

  it('grid', () => {
    expect(convert('gr')).toBe(`.gr { display: grid; }`);
  });

  it('block', () => {
    expect(convert('block')).toBe(`.block { display: block; }`);
  });

  it('none', () => {
    expect(convert('none')).toBe(`.none { display: none; }`);
  });

  it('d-none', () => {
    expect(convert('d-none')).toBe(`.d-none { display: none; }`);
  });

  it('d=none', () => {
    expect(convert('d=none')).toBe(`.d\\=none { display: none; }`);
  });

  it('table', () => {
    expect(convert('table')).toBe(`.table { display: table; }`);
  });

  it('inline', () => {
    expect(convert('inline')).toBe(`.inline { display: inline; }`);
  });

  it('inline-block', () => {
    expect(convert('iblock')).toBe(`.iblock { display: inline-block; }`);
  });

  it('inline-flex', () => {
    expect(convert('ifx')).toBe(`.ifx { display: inline-flex; }`);
  });

  it('absolute', () => {
    expect(convert('abs')).toBe(`.abs { position: absolute; }`);
  });

  it('absolute important', () => {
    expect(convert('!abs')).toBe(`.\\!abs { position: absolute !important; }`);
  });

  it('relative', () => {
    expect(convert('rel')).toBe(`.rel { position: relative; }`);
  });

  it('sticky', () => {
    expect(convert('sticky')).toBe(`.sticky { position: sticky; }`);
  });

  it('static', () => {
    expect(convert('static')).toBe(`.static { position: static; }`);
  });

  it('visible', () => {
    expect(convert('visible')).toBe(`.visible { visibility: visible; }`);
  });

  it('hidden', () => {
    expect(convert('hidden')).toBe(`.hidden { visibility: hidden; }`);
  });

  it('border', () => {
    expect(convert('br')).toBe(
      `.br { border-width: 1px; border-style: solid; }`,
    );
  });

  it('border top', () => {
    expect(convert('brt')).toBe(
      `.brt { border-top-width: 1px; border-top-style: solid; }`,
    );
  });

  it('border right', () => {
    expect(convert('brr')).toBe(
      `.brr { border-right-width: 1px; border-right-style: solid; }`,
    );
  });

  it('border bottom', () => {
    expect(convert('brb')).toBe(
      `.brb { border-bottom-width: 1px; border-bottom-style: solid; }`,
    );
  });

  it('border left', () => {
    expect(convert('brl')).toBe(
      `.brl { border-left-width: 1px; border-left-style: solid; }`,
    );
  });

  it('border inline', () => {
    expect(convert('brx')).toBe(
      `.brx { border-inline-width: 1px; border-inline-style: solid; }`,
    );
  });

  it('border inline start', () => {
    expect(convert('brxs')).toBe(
      `.brxs { border-inline-start-width: 1px; border-inline-start-style: solid; }`,
    );
  });

  it('border inline end', () => {
    expect(convert('brxe')).toBe(
      `.brxe { border-inline-end-width: 1px; border-inline-end-style: solid; }`,
    );
  });

  it('border block', () => {
    expect(convert('bry')).toBe(
      `.bry { border-block-width: 1px; border-block-style: solid; }`,
    );
  });

  it('border block start', () => {
    expect(convert('brys')).toBe(
      `.brys { border-block-start-width: 1px; border-block-start-style: solid; }`,
    );
  });

  it('border block end', () => {
    expect(convert('brye')).toBe(
      `.brye { border-block-end-width: 1px; border-block-end-style: solid; }`,
    );
  });

  it('container', () => {
    expect(convert('cnt')).toBe(`.cnt { container-type: inline-size; }`);
  });
});

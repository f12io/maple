import { describe, expect, it } from 'vitest';
import { generateStylesFromClass as convert } from '../src/core/generator';

describe('Shortcuts', () => {
  it('flex', () => {
    expect(convert('flex')).toBe(`.flex { display: flex; }`);
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
    expect(convert('!flex')).toBe(`.\\!flex { display: flex !important; }`);
  });

  it('grid', () => {
    expect(convert('grid')).toBe(`.grid { display: grid; }`);
  });

  it('block', () => {
    expect(convert('block')).toBe(`.block { display: block; }`);
  });

  it('none', () => {
    expect(convert('none')).toBe(`.none { display: none; }`);
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
    expect(convert('iflex')).toBe(`.iflex { display: inline-flex; }`);
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
});

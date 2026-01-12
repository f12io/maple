import { describe, expect, it } from 'vitest';
import { generateStylesFromClass as convert } from '../src/core/generator';

describe('Container', () => {
  it('container with name and type', () => {
    expect(convert('cnt=card/inline-size')).toBe(
      '.cnt\\=card\\/inline-size { container: card/inline-size; }',
    );
  });

  it('container with name and type and important', () => {
    expect(convert('!cnt=card/inline-size')).toBe(
      '.\\!cnt\\=card\\/inline-size { container: card/inline-size !important; }',
    );
  });

  it('container without shortcut', () => {
    expect(convert('container=card/inline-size')).toBe(
      '.container\\=card\\/inline-size { container: card/inline-size; }',
    );
  });

  it('container without shortcut and with important', () => {
    expect(convert('!container=card/inline-size')).toBe(
      '.\\!container\\=card\\/inline-size { container: card/inline-size !important; }',
    );
  });

  it('container type', () => {
    expect(convert('cnt=inline-size')).toBe(
      '.cnt\\=inline-size { container-type: inline-size; }',
    );
  });

  it('container type without shortcut', () => {
    expect(convert('containerType=inline-size')).toBe(
      '.containerType\\=inline-size { container-type: inline-size; }',
    );
  });

  it('container name', () => {
    expect(convert('cnt=card')).toBe('.cnt\\=card { container-name: card; }');
  });

  it('container name without shortcut', () => {
    expect(convert('containerName=card')).toBe(
      '.containerName\\=card { container-name: card; }',
    );
  });

  it('container with predefined value', () => {
    expect(convert('cnt-card')).toBe(
      '.cnt-card { container: var(--cnt-card, var(--card, card)); }',
    );
  });

  /* it('container unsupported', () => {
    expect(convert('@container')).toBe(undefined);
  }); */
});

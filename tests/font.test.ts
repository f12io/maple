import { describe, expect, it } from 'vitest';
import { generateStylesFromClass as convert } from '../src/core/generator';

describe('Font', () => {
  it('font-family with variable', () => {
    expect(convert('ff-sans')).toBe(
      `.ff-sans { font-family: var(--ff-sans, var(--sans, sans)); }`,
    );
  });

  it('font-family with custom value', () => {
    expect(convert('ff="Arial",sans-serif')).toBe(
      `.ff\\=\\"Arial\\"\\,sans-serif { font-family: "Arial",sans-serif; }`,
    );
  });

  it('font-size with variable', () => {
    expect(convert('fs-lg')).toBe(
      `.fs-lg { font-size: var(--fs-lg, var(--space-lg, var(--lg, lg))); }`,
    );
  });

  it('font-size with predefined value', () => {
    expect(convert('fs-4')).toBe(
      `.fs-4 { font-size: var(--fs-4, var(--space-4, calc(4rem * var(--spacer, 0.25)))); }`,
    );
  });

  it('font-size with custom value', () => {
    expect(convert('fs=14px')).toBe(`.fs\\=14px { font-size: 14px; }`);
  });

  it('font-weight with variable', () => {
    expect(convert('fw-bold')).toBe(
      `.fw-bold { font-weight: var(--fw-bold, var(--bold, bold)); }`,
    );
  });

  it('font-weight with number', () => {
    expect(convert('fw-300')).toBe(
      `.fw-300 { font-weight: var(--fw-300, 300); }`,
    );
  });

  it('font-weight with custom value', () => {
    expect(convert('fw=300')).toBe(`.fw\\=300 { font-weight: 300; }`);
  });

  it('line-height with variable', () => {
    expect(convert('lh-tight')).toBe(
      `.lh-tight { line-height: var(--lh-tight, var(--space-tight, var(--tight, tight))); }`,
    );
  });

  it('line-height with number', () => {
    expect(convert('lh-4')).toBe(
      `.lh-4 { line-height: var(--lh-4, var(--space-4, calc(4rem * var(--spacer, 0.25)))); }`,
    );
  });

  it('line-height with custom value', () => {
    expect(convert('lh=1.25')).toBe(`.lh\\=1\\.25 { line-height: 1.25; }`);
  });
});

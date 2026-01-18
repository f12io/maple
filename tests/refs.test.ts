import { describe, expect, it } from 'vitest';
import { convertWithRefs } from './helpers/convert.helper';

describe('Ref Variables', () => {
  it('ref space with single value', () => {
    expect(convertWithRefs('p-2')).toBe('.p-2 { padding: var(--ref-p-2); }');
  });

  it('ref space with two values', () => {
    expect(convertWithRefs('p-2_4')).toBe(
      '.p-2_4 { padding: var(--ref-p-2) var(--ref-p-4); }',
    );
  });

  it('ref space with one predefined one custom value', () => {
    expect(convertWithRefs('p-2_2px')).toBe(
      '.p-2_2px { padding: var(--ref-p-2) 2px; }',
    );
  });

  it('ref color', () => {
    expect(convertWithRefs('bg-red')).toBe(
      '.bg-red { background: var(--ref-bgc-red); }',
    );
  });

  it('ref color with shade and alpha', () => {
    expect(convertWithRefs('c-red-400/50')).toBe(
      '.c-red-400\\/50 { color: var(--ref-c-red-400\\/50); }',
    );
  });

  it('ref for predefined variables', () => {
    expect(convertWithRefs('bgimg-logo')).toBe(
      '.bgimg-logo { background-image: var(--ref-bgimg-logo); }',
    );
  });
});

describe('NoRef Variables', () => {
  it('noref space with single value', () => {
    expect(convertWithRefs('$p-2')).toBe(
      '.\\$p-2 { padding: var(--p-2, var(--space-2, calc(2rem * var(--spacer, 0.25)))); }',
    );
  });

  it('noref space with two values', () => {
    expect(convertWithRefs('$p-2_4')).toBe(
      '.\\$p-2_4 { padding: var(--p-2, var(--space-2, calc(2rem * var(--spacer, 0.25)))) var(--p-4, var(--space-4, calc(4rem * var(--spacer, 0.25)))); }',
    );
  });

  it('noref space with one predefined one custom value', () => {
    expect(convertWithRefs('$p-2_2px')).toBe(
      '.\\$p-2_2px { padding: var(--p-2, var(--space-2, calc(2rem * var(--spacer, 0.25)))) 2px; }',
    );
  });

  it('noref color', () => {
    expect(convertWithRefs('$bg-red')).toBe(
      '.\\$bg-red { background: oklch(from var(--bgc-red, var(--color-red, var(--red, red))) calc(l * var(--bgc-red-lightness-factor, var(--red-lightness-factor, var(--bgc-lightness-factor, var(--lightness-factor, 1))))) calc(c * var(--bgc-red-chroma-factor, var(--red-chroma-factor, var(--bgc-chroma-factor, var(--chroma-factor, 1))))) calc(h + var(--bgc-red-hue-rotate, var(--red-hue-rotate, var(--bgc-hue-rotate, var(--hue-rotate, 0))))) / alpha); }',
    );
  });

  it('noref color with shade and alpha', () => {
    expect(convertWithRefs('$c-red-400/50')).toBe(
      '.\\$c-red-400\\/50 { color: oklch(from var(--c-red, var(--color-red, var(--red, red))) calc((l + (1 - l) * 0.2) * var(--c-red-lightness-factor, var(--red-lightness-factor, var(--c-lightness-factor, var(--lightness-factor, 1))))) calc(c * var(--c-red-chroma-factor, var(--red-chroma-factor, var(--c-chroma-factor, var(--chroma-factor, 1))))) calc(h + var(--c-red-hue-rotate, var(--red-hue-rotate, var(--c-hue-rotate, var(--hue-rotate, 0))))) / 50%); }',
    );
  });

  it('noref for predefined variables', () => {
    expect(convertWithRefs('$bgimg-logo')).toBe(
      '.\\$bgimg-logo { background-image: var(--bgimg-logo, var(--logo, logo)); }',
    );
  });
});

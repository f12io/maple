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
      '.\\$p-2 { padding: var(--p-2, var(--space-2, calc(2rem * var(--p-spacer, var(--spacer, 0.25))))); }',
    );
  });

  it('noref space with two values', () => {
    expect(convertWithRefs('$p-2_4')).toBe(
      '.\\$p-2_4 { padding: var(--p-2, var(--space-2, calc(2rem * var(--p-spacer, var(--spacer, 0.25))))) var(--p-4, var(--space-4, calc(4rem * var(--p-spacer, var(--spacer, 0.25))))); }',
    );
  });

  it('noref space with one predefined one custom value', () => {
    expect(convertWithRefs('$p-2_2px')).toBe(
      '.\\$p-2_2px { padding: var(--p-2, var(--space-2, calc(2rem * var(--p-spacer, var(--spacer, 0.25))))) 2px; }',
    );
  });

  it('noref color', () => {
    expect(convertWithRefs('$bg-red')).toBe(
      '.\\$bg-red { background: oklch(from var(--bgc-red, var(--color-red, var(--red, red))) calc(l * var(--bgc-red-l-scale, var(--red-l-scale, var(--bgc-l-scale, var(--l-scale, 1))))) calc(c * var(--bgc-red-c-scale, var(--red-c-scale, var(--bgc-c-scale, var(--c-scale, 1))))) calc(h + var(--bgc-red-h-rotate, var(--red-h-rotate, var(--bgc-h-rotate, var(--h-rotate, 0))))) / alpha); }',
    );
  });

  it('noref color with shade and alpha', () => {
    expect(convertWithRefs('$c-red-400/50')).toBe(
      '.\\$c-red-400\\/50 { color: oklch(from var(--c-red, var(--color-red, var(--red, red))) calc((l + (((var(--c-red-l-shift, var(--red-l-shift, var(--c-l-shift, var(--l-shift, 1)))) * (0.5 - 0.3889)) + (abs(var(--c-red-l-shift, var(--red-l-shift, var(--c-l-shift, var(--l-shift, 1))))) * (0.5 - l))) * calc(var(--l-edge-shift, 0.5) + ((1 - var(--l-edge-shift, 0.5)) * pow(abs(0.3889 - 0.5) * 2, 2))))) * var(--c-red-l-scale, var(--red-l-scale, var(--c-l-scale, var(--l-scale, 1))))) calc(c * calc(1 - (pow(abs(0.3889 - 0.5) * 2, 2) * var(--c-curve, 0.5))) * var(--c-red-c-scale, var(--red-c-scale, var(--c-c-scale, var(--c-scale, 1))))) calc(h + var(--c-red-h-rotate, var(--red-h-rotate, var(--c-h-rotate, var(--h-rotate, 0))))) / 50%); }',
    );
  });

  it('noref for predefined variables', () => {
    expect(convertWithRefs('$bgimg-logo')).toBe(
      '.\\$bgimg-logo { background-image: var(--bgimg-logo, var(--logo, logo)); }',
    );
  });
});

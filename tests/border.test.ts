import { describe, expect, it } from 'vitest';
import { convert } from './helpers/convert.helper';

describe('Border', () => {
  it('border with variable', () => {
    expect(convert('br-card')).toBe(
      `.br-card { border: var(--br-card, var(--card, card)); }`,
    );
  });

  it('border with variable', () => {
    expect(convert('br-xs_primary')).toBe(
      `.br-xs_primary { border: var(--br-xs, var(--xs, xs)) oklch(from var(--br-primary, var(--color-primary, var(--primary, primary))) calc(l * var(--br-primary-l-scale, var(--primary-l-scale, var(--br-l-scale, var(--l-scale, 1))))) calc(c * var(--br-primary-c-scale, var(--primary-c-scale, var(--br-c-scale, var(--c-scale, 1))))) calc(h + var(--br-primary-h-rotate, var(--primary-h-rotate, var(--br-h-rotate, var(--h-rotate, 0))))) / alpha); }`,
    );
  });

  it('border with variable', () => {
    expect(convert('br-px_solid')).toBe(`.br-px_solid { border: 1px solid; }`);
  });

  it('border-left with variable', () => {
    expect(convert('brl-px_solid')).toBe(
      `.brl-px_solid { border-left: 1px solid; }`,
    );
  });

  it('border-inline with variable', () => {
    expect(convert('brx-px_solid')).toBe(
      `.brx-px_solid { border-inline: 1px solid; }`,
    );
  });

  it('border-block with variable', () => {
    expect(convert('bry-px_solid')).toBe(
      `.bry-px_solid { border-block: 1px solid; }`,
    );
  });

  it('border with variable', () => {
    expect(convert('br-px_solid_primary')).toBe(
      `.br-px_solid_primary { border: 1px solid oklch(from var(--br-primary, var(--color-primary, var(--primary, primary))) calc(l * var(--br-primary-l-scale, var(--primary-l-scale, var(--br-l-scale, var(--l-scale, 1))))) calc(c * var(--br-primary-c-scale, var(--primary-c-scale, var(--br-c-scale, var(--c-scale, 1))))) calc(h + var(--br-primary-h-rotate, var(--primary-h-rotate, var(--br-h-rotate, var(--h-rotate, 0))))) / alpha); }`,
    );
  });

  it('outline with variable', () => {
    expect(convert('ol-thick_double_#32a1ce')).toBe(
      `.ol-thick_double_\\#32a1ce { outline: var(--ol-thick, var(--thick, thick)) double #32a1ce; }`,
    );
  });

  it('border with predefined value', () => {
    expect(convert('br-px')).toBe(`.br-px { border: 1px; }`);
  });

  it('border-style with variable', () => {
    expect(convert('brst-dashed')).toBe(
      `.brst-dashed { border-style: dashed; }`,
    );
  });

  it('border-color with variable', () => {
    expect(convert('brc-red-300/30')).toBe(
      `.brc-red-300\\/30 { border-color: oklch(from var(--brc-red, var(--color-red, var(--red, red))) calc((l + (((var(--brc-red-l-shift, var(--red-l-shift, var(--brc-l-shift, var(--l-shift, 1)))) * (0.5 - 0.2778)) + (abs(var(--brc-red-l-shift, var(--red-l-shift, var(--brc-l-shift, var(--l-shift, 1))))) * (0.5 - l))) * calc(var(--l-edge-shift, 0.5) + ((1 - var(--l-edge-shift, 0.5)) * pow(abs(0.2778 - 0.5) * 2, 2))))) * var(--brc-red-l-scale, var(--red-l-scale, var(--brc-l-scale, var(--l-scale, 1))))) calc(c * calc(1 - (pow(abs(0.2778 - 0.5) * 2, 2) * var(--c-curve, 0.5))) * var(--brc-red-c-scale, var(--red-c-scale, var(--brc-c-scale, var(--c-scale, 1))))) calc(h + var(--brc-red-h-rotate, var(--red-h-rotate, var(--brc-h-rotate, var(--h-rotate, 0))))) / 30%); }`,
    );
  });

  it('border width with predefined value', () => {
    expect(convert('brw-px')).toBe(`.brw-px { border-width: 1px; }`);
  });

  it('border-top with predefined value', () => {
    expect(convert('brt-px')).toBe(`.brt-px { border-top: 1px; }`);
  });

  it('border-top-width with predefined value', () => {
    expect(convert('brtw-px')).toBe(`.brtw-px { border-top-width: 1px; }`);
  });

  it('border-radius with variable', () => {
    expect(convert('rad-lg')).toBe(
      `.rad-lg { border-radius: var(--rad-lg, var(--space-lg, var(--lg, lg))); }`,
    );
  });

  it('border-radius with predefined value', () => {
    expect(convert('rad-4')).toBe(
      `.rad-4 { border-radius: var(--rad-4, var(--space-4, calc(4rem * var(--rad-spacer, var(--br-spacer, var(--spacer, 0.25)))))); }`,
    );
  });

  it('border with custom value', () => {
    expect(convert('br=1px_solid_black')).toBe(
      `.br\\=1px_solid_black { border: 1px solid black; }`,
    );
  });
});

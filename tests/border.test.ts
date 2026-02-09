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
      `.br-xs_primary { border: var(--br-xs, var(--xs, xs)) oklch(from var(--br-primary, var(--color-primary, var(--primary, primary))) calc(l * var(--br-primary-lightness-factor, var(--primary-lightness-factor, var(--br-lightness-factor, var(--lightness-factor, 1))))) calc(c * var(--br-primary-chroma-factor, var(--primary-chroma-factor, var(--br-chroma-factor, var(--chroma-factor, 1))))) calc(h + var(--br-primary-hue-rotate, var(--primary-hue-rotate, var(--br-hue-rotate, var(--hue-rotate, 0))))) / alpha); }`,
    );
  });

  it('border with variable', () => {
    expect(convert('br-px_solid')).toBe(`.br-px_solid { border: 1px solid; }`);
  });

  it('border with variable', () => {
    expect(convert('br-px_solid_primary')).toBe(
      `.br-px_solid_primary { border: 1px solid oklch(from var(--br-primary, var(--color-primary, var(--primary, primary))) calc(l * var(--br-primary-lightness-factor, var(--primary-lightness-factor, var(--br-lightness-factor, var(--lightness-factor, 1))))) calc(c * var(--br-primary-chroma-factor, var(--primary-chroma-factor, var(--br-chroma-factor, var(--chroma-factor, 1))))) calc(h + var(--br-primary-hue-rotate, var(--primary-hue-rotate, var(--br-hue-rotate, var(--hue-rotate, 0))))) / alpha); }`,
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
      `.brc-red-300\\/30 { border-color: oklch(from var(--brc-red, var(--color-red, var(--red, red))) calc((l + (1 - l) * (0.4 * var(--brc-red-tone-factor, var(--red-tone-factor, var(--brc-tone-factor, var(--tone-factor, 1)))))) * var(--brc-red-lightness-factor, var(--red-lightness-factor, var(--brc-lightness-factor, var(--lightness-factor, 1))))) calc(c * var(--brc-red-chroma-factor, var(--red-chroma-factor, var(--brc-chroma-factor, var(--chroma-factor, 1))))) calc(h + var(--brc-red-hue-rotate, var(--red-hue-rotate, var(--brc-hue-rotate, var(--hue-rotate, 0))))) / 30%); }`,
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

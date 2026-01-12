import { describe, expect, it } from 'vitest';
import { generateStylesFromClass as convert } from '../src/core/generator';

describe('Text Shadow', () => {
  it('text-shadow with variable', () => {
    expect(convert('tshadow-2xs')).toBe(
      `.tshadow-2xs { text-shadow: var(--tshadow-2xs, var(--shadow-2xs, var(--2xs, 2xs))); }`,
    );
  });

  it('text-shadow with multiple variables', () => {
    expect(convert('tshadow-2xs,light2xs')).toBe(
      `.tshadow-2xs\\,light2xs { text-shadow: var(--tshadow-2xs, var(--shadow-2xs, var(--2xs, 2xs))), var(--tshadow-light2xs, var(--shadow-light2xs, var(--light2xs, light2xs))); }`,
    );
  });

  it('text-shadow with multiple known variables', () => {
    expect(convert('tshadow-px_px')).toBe(
      `.tshadow-px_px { text-shadow: 1px 1px; }`,
    );
    expect(convert('tshadow-0px_1px')).toBe(
      `.tshadow-0px_1px { text-shadow: 0px 1px; }`,
    );
    expect(convert('tshadow-0px_-1px')).toBe(
      `.tshadow-0px_-1px { text-shadow: 0px -1px; }`,
    );
    expect(convert('tshadow-0px_-1')).toBe(
      `.tshadow-0px_-1 { text-shadow: 0px var(--tshadow--1, var(--space--1, calc(-1rem * var(--spacer, 0.25)))); }`,
    );
    expect(convert('tshadow-0px_1px_red')).toBe(
      `.tshadow-0px_1px_red { text-shadow: 0px 1px oklch(from var(--tshadow-red, var(--shadow-red, var(--color-red, var(--red, red)))) calc(l * var(--tshadow-red-lightness-factor, var(--red-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--tshadow-red-chroma-factor, var(--red-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--tshadow-red-hue-rotate, var(--red-hue-rotate, var(--hue-rotate, 0)))) / alpha); }`,
    );
    expect(convert('tshadow-0px_1px_0px_red')).toBe(
      `.tshadow-0px_1px_0px_red { text-shadow: 0px 1px 0px oklch(from var(--tshadow-red, var(--shadow-red, var(--color-red, var(--red, red)))) calc(l * var(--tshadow-red-lightness-factor, var(--red-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--tshadow-red-chroma-factor, var(--red-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--tshadow-red-hue-rotate, var(--red-hue-rotate, var(--hue-rotate, 0)))) / alpha); }`,
    );
    expect(convert('tshadow-0_1_0_red')).toBe(
      `.tshadow-0_1_0_red { text-shadow: 0 var(--tshadow-1, var(--space-1, calc(1rem * var(--spacer, 0.25)))) 0 oklch(from var(--tshadow-red, var(--shadow-red, var(--color-red, var(--red, red)))) calc(l * var(--tshadow-red-lightness-factor, var(--red-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--tshadow-red-chroma-factor, var(--red-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--tshadow-red-hue-rotate, var(--red-hue-rotate, var(--hue-rotate, 0)))) / alpha); }`,
    );
  });

  it('text-shadow known and unknown variables', () => {
    expect(convert('tshadow-2xs_red')).toBe(
      `.tshadow-2xs_red { text-shadow: var(--tshadow-2xs, var(--shadow-2xs, var(--2xs, 2xs))) oklch(from var(--tshadow-red, var(--shadow-red, var(--color-red, var(--red, red)))) calc(l * var(--tshadow-red-lightness-factor, var(--red-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--tshadow-red-chroma-factor, var(--red-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--tshadow-red-hue-rotate, var(--red-hue-rotate, var(--hue-rotate, 0)))) / alpha); }`,
    );

    expect(convert('tshadow-2xs_px_red')).toBe(
      `.tshadow-2xs_px_red { text-shadow: var(--tshadow-2xs, var(--shadow-2xs, var(--2xs, 2xs))) 1px oklch(from var(--tshadow-red, var(--shadow-red, var(--color-red, var(--red, red)))) calc(l * var(--tshadow-red-lightness-factor, var(--red-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--tshadow-red-chroma-factor, var(--red-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--tshadow-red-hue-rotate, var(--red-hue-rotate, var(--hue-rotate, 0)))) / alpha); }`,
    );
  });

  it('text-shadow with custom value', () => {
    expect(convert('tshadow=0px_1px_0px_rgb(0_0_0/0.15)')).toBe(
      `.tshadow\\=0px_1px_0px_rgb\\(0_0_0\\/0\\.15\\) { text-shadow: 0px 1px 0px rgb(0 0 0/0.15); }`,
    );
  });
});

describe('Box Shadow', () => {
  it('box-shadow with variable', () => {
    expect(convert('bshadow-2xs')).toBe(
      `.bshadow-2xs { box-shadow: var(--bshadow-2xs, var(--shadow-2xs, var(--2xs, 2xs))); }`,
    );
  });

  it('box-shadow with multiple variables', () => {
    expect(convert('bshadow-2xs,light2xs')).toBe(
      `.bshadow-2xs\\,light2xs { box-shadow: var(--bshadow-2xs, var(--shadow-2xs, var(--2xs, 2xs))), var(--bshadow-light2xs, var(--shadow-light2xs, var(--light2xs, light2xs))); }`,
    );
  });

  it('box-shadow with multiple known variables', () => {
    expect(convert('bshadow-px_px')).toBe(
      `.bshadow-px_px { box-shadow: 1px 1px; }`,
    );
    expect(convert('bshadow-0px_1px')).toBe(
      `.bshadow-0px_1px { box-shadow: 0px 1px; }`,
    );
    expect(convert('bshadow-0px_-1px')).toBe(
      `.bshadow-0px_-1px { box-shadow: 0px -1px; }`,
    );
    expect(convert('bshadow-0px_-1')).toBe(
      `.bshadow-0px_-1 { box-shadow: 0px var(--bshadow--1, var(--space--1, calc(-1rem * var(--spacer, 0.25)))); }`,
    );
    expect(convert('bshadow-0px_1px_inset')).toBe(
      `.bshadow-0px_1px_inset { box-shadow: 0px 1px inset; }`,
    );
    expect(convert('bshadow-0px_1px_red')).toBe(
      `.bshadow-0px_1px_red { box-shadow: 0px 1px oklch(from var(--bshadow-red, var(--shadow-red, var(--color-red, var(--red, red)))) calc(l * var(--bshadow-red-lightness-factor, var(--red-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bshadow-red-chroma-factor, var(--red-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bshadow-red-hue-rotate, var(--red-hue-rotate, var(--hue-rotate, 0)))) / alpha); }`,
    );
    expect(convert('bshadow-0px_1px_0px_inset_red')).toBe(
      `.bshadow-0px_1px_0px_inset_red { box-shadow: 0px 1px 0px inset oklch(from var(--bshadow-red, var(--shadow-red, var(--color-red, var(--red, red)))) calc(l * var(--bshadow-red-lightness-factor, var(--red-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bshadow-red-chroma-factor, var(--red-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bshadow-red-hue-rotate, var(--red-hue-rotate, var(--hue-rotate, 0)))) / alpha); }`,
    );
    expect(convert('bshadow-0_1_0_inset_red')).toBe(
      `.bshadow-0_1_0_inset_red { box-shadow: 0 var(--bshadow-1, var(--space-1, calc(1rem * var(--spacer, 0.25)))) 0 inset oklch(from var(--bshadow-red, var(--shadow-red, var(--color-red, var(--red, red)))) calc(l * var(--bshadow-red-lightness-factor, var(--red-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bshadow-red-chroma-factor, var(--red-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bshadow-red-hue-rotate, var(--red-hue-rotate, var(--hue-rotate, 0)))) / alpha); }`,
    );
  });

  it('box-shadow known and unknown variables', () => {
    expect(convert('bshadow-2xs_red')).toBe(
      `.bshadow-2xs_red { box-shadow: var(--bshadow-2xs, var(--shadow-2xs, var(--2xs, 2xs))) oklch(from var(--bshadow-red, var(--shadow-red, var(--color-red, var(--red, red)))) calc(l * var(--bshadow-red-lightness-factor, var(--red-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bshadow-red-chroma-factor, var(--red-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bshadow-red-hue-rotate, var(--red-hue-rotate, var(--hue-rotate, 0)))) / alpha); }`,
    );

    expect(convert('bshadow-2xs_-px_red')).toBe(
      `.bshadow-2xs_-px_red { box-shadow: var(--bshadow-2xs, var(--shadow-2xs, var(--2xs, 2xs))) -1px oklch(from var(--bshadow-red, var(--shadow-red, var(--color-red, var(--red, red)))) calc(l * var(--bshadow-red-lightness-factor, var(--red-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bshadow-red-chroma-factor, var(--red-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bshadow-red-hue-rotate, var(--red-hue-rotate, var(--hue-rotate, 0)))) / alpha); }`,
    );

    expect(convert('bshadow-2xs_px_red,light2xs')).toBe(
      `.bshadow-2xs_px_red\\,light2xs { box-shadow: var(--bshadow-2xs, var(--shadow-2xs, var(--2xs, 2xs))) 1px oklch(from var(--bshadow-red, var(--shadow-red, var(--color-red, var(--red, red)))) calc(l * var(--bshadow-red-lightness-factor, var(--red-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bshadow-red-chroma-factor, var(--red-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bshadow-red-hue-rotate, var(--red-hue-rotate, var(--hue-rotate, 0)))) / alpha), var(--bshadow-light2xs, var(--shadow-light2xs, var(--light2xs, light2xs))); }`,
    );
  });

  it('box-shadow with custom value', () => {
    expect(convert('bshadow=0px_1px_0px_rgb(0_0_0/0.15)')).toBe(
      `.bshadow\\=0px_1px_0px_rgb\\(0_0_0\\/0\\.15\\) { box-shadow: 0px 1px 0px rgb(0 0 0/0.15); }`,
    );
  });
});

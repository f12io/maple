import { describe, expect, it } from 'vitest';
import { convert } from './helpers/convert.helper';

describe('Color', () => {
  it('text color with custom variable', () => {
    expect(convert('c-primary')).toBe(
      '.c-primary { color: oklch(from var(--c-primary, var(--color-primary, var(--primary, primary))) calc(l * var(--c-primary-lightness-factor, var(--primary-lightness-factor, var(--c-lightness-factor, var(--lightness-factor, 1))))) calc(c * var(--c-primary-chroma-factor, var(--primary-chroma-factor, var(--c-chroma-factor, var(--chroma-factor, 1))))) calc(h + var(--c-primary-hue-rotate, var(--primary-hue-rotate, var(--c-hue-rotate, var(--hue-rotate, 0))))) / alpha); }',
    );
  });

  it('background color with custom variable', () => {
    expect(convert('bgc-primary')).toBe(
      '.bgc-primary { background-color: oklch(from var(--bgc-primary, var(--color-primary, var(--primary, primary))) calc(l * var(--bgc-primary-lightness-factor, var(--primary-lightness-factor, var(--bgc-lightness-factor, var(--lightness-factor, 1))))) calc(c * var(--bgc-primary-chroma-factor, var(--primary-chroma-factor, var(--bgc-chroma-factor, var(--chroma-factor, 1))))) calc(h + var(--bgc-primary-hue-rotate, var(--primary-hue-rotate, var(--bgc-hue-rotate, var(--hue-rotate, 0))))) / alpha); }',
    );
  });

  it('background with custom variable', () => {
    expect(convert('bg-primary')).toBe(
      '.bg-primary { background: oklch(from var(--bgc-primary, var(--color-primary, var(--primary, primary))) calc(l * var(--bgc-primary-lightness-factor, var(--primary-lightness-factor, var(--bgc-lightness-factor, var(--lightness-factor, 1))))) calc(c * var(--bgc-primary-chroma-factor, var(--primary-chroma-factor, var(--bgc-chroma-factor, var(--chroma-factor, 1))))) calc(h + var(--bgc-primary-hue-rotate, var(--primary-hue-rotate, var(--bgc-hue-rotate, var(--hue-rotate, 0))))) / alpha); }',
    );
  });

  it('text color', () => {
    expect(convert('c-red')).toBe(
      '.c-red { color: oklch(from var(--c-red, var(--color-red, var(--red, red))) calc(l * var(--c-red-lightness-factor, var(--red-lightness-factor, var(--c-lightness-factor, var(--lightness-factor, 1))))) calc(c * var(--c-red-chroma-factor, var(--red-chroma-factor, var(--c-chroma-factor, var(--chroma-factor, 1))))) calc(h + var(--c-red-hue-rotate, var(--red-hue-rotate, var(--c-hue-rotate, var(--hue-rotate, 0))))) / alpha); }',
    );
  });

  it('text color with alpha', () => {
    expect(convert('c-red/50')).toBe(
      '.c-red\\/50 { color: oklch(from var(--c-red, var(--color-red, var(--red, red))) calc(l * var(--c-red-lightness-factor, var(--red-lightness-factor, var(--c-lightness-factor, var(--lightness-factor, 1))))) calc(c * var(--c-red-chroma-factor, var(--red-chroma-factor, var(--c-chroma-factor, var(--chroma-factor, 1))))) calc(h + var(--c-red-hue-rotate, var(--red-hue-rotate, var(--c-hue-rotate, var(--hue-rotate, 0))))) / 50%); }',
    );
  });

  it('text color without shortcut', () => {
    expect(convert('color-red')).toBe(
      '.color-red { color: oklch(from var(--c-red, var(--color-red, var(--red, red))) calc(l * var(--c-red-lightness-factor, var(--red-lightness-factor, var(--c-lightness-factor, var(--lightness-factor, 1))))) calc(c * var(--c-red-chroma-factor, var(--red-chroma-factor, var(--c-chroma-factor, var(--chroma-factor, 1))))) calc(h + var(--c-red-hue-rotate, var(--red-hue-rotate, var(--c-hue-rotate, var(--hue-rotate, 0))))) / alpha); }',
    );
  });

  it('text color', () => {
    expect(convert('c-red-500')).toBe(
      '.c-red-500 { color: oklch(from var(--c-red, var(--color-red, var(--red, red))) calc(l * var(--c-red-lightness-factor, var(--red-lightness-factor, var(--c-lightness-factor, var(--lightness-factor, 1))))) calc(c * var(--c-red-chroma-factor, var(--red-chroma-factor, var(--c-chroma-factor, var(--chroma-factor, 1))))) calc(h + var(--c-red-hue-rotate, var(--red-hue-rotate, var(--c-hue-rotate, var(--hue-rotate, 0))))) / alpha); }',
    );
  });

  it('text color with dashed custom variable', () => {
    expect(convert('c-brand-blue')).toBe(
      '.c-brand-blue { color: oklch(from var(--c-brand-blue, var(--color-brand-blue, var(--brand-blue, brand-blue))) calc(l * var(--c-brand-blue-lightness-factor, var(--brand-blue-lightness-factor, var(--c-lightness-factor, var(--lightness-factor, 1))))) calc(c * var(--c-brand-blue-chroma-factor, var(--brand-blue-chroma-factor, var(--c-chroma-factor, var(--chroma-factor, 1))))) calc(h + var(--c-brand-blue-hue-rotate, var(--brand-blue-hue-rotate, var(--c-hue-rotate, var(--hue-rotate, 0))))) / alpha); }',
    );
  });

  it('text color with dashed custom variable and alpha', () => {
    expect(convert('c-brand-blue/50')).toBe(
      '.c-brand-blue\\/50 { color: oklch(from var(--c-brand-blue, var(--color-brand-blue, var(--brand-blue, brand-blue))) calc(l * var(--c-brand-blue-lightness-factor, var(--brand-blue-lightness-factor, var(--c-lightness-factor, var(--lightness-factor, 1))))) calc(c * var(--c-brand-blue-chroma-factor, var(--brand-blue-chroma-factor, var(--c-chroma-factor, var(--chroma-factor, 1))))) calc(h + var(--c-brand-blue-hue-rotate, var(--brand-blue-hue-rotate, var(--c-hue-rotate, var(--hue-rotate, 0))))) / 50%); }',
    );
  });

  it('text color with dashed custom variable and lightness', () => {
    expect(convert('c-brand-blue-600')).toBe(
      '.c-brand-blue-600 { color: oklch(from var(--c-brand-blue, var(--color-brand-blue, var(--brand-blue, brand-blue))) calc((l + l * (-0.2 * var(--c-brand-blue-tone-factor, var(--brand-blue-tone-factor, var(--c-tone-factor, var(--tone-factor, 1)))))) * var(--c-brand-blue-lightness-factor, var(--brand-blue-lightness-factor, var(--c-lightness-factor, var(--lightness-factor, 1))))) calc(c * var(--c-brand-blue-chroma-factor, var(--brand-blue-chroma-factor, var(--c-chroma-factor, var(--chroma-factor, 1))))) calc(h + var(--c-brand-blue-hue-rotate, var(--brand-blue-hue-rotate, var(--c-hue-rotate, var(--hue-rotate, 0))))) / alpha); }',
    );
  });

  it('text color with dashed custom variable, lightness and alpha', () => {
    expect(convert('c-brand-blue-600/50')).toBe(
      '.c-brand-blue-600\\/50 { color: oklch(from var(--c-brand-blue, var(--color-brand-blue, var(--brand-blue, brand-blue))) calc((l + l * (-0.2 * var(--c-brand-blue-tone-factor, var(--brand-blue-tone-factor, var(--c-tone-factor, var(--tone-factor, 1)))))) * var(--c-brand-blue-lightness-factor, var(--brand-blue-lightness-factor, var(--c-lightness-factor, var(--lightness-factor, 1))))) calc(c * var(--c-brand-blue-chroma-factor, var(--brand-blue-chroma-factor, var(--c-chroma-factor, var(--chroma-factor, 1))))) calc(h + var(--c-brand-blue-hue-rotate, var(--brand-blue-hue-rotate, var(--c-hue-rotate, var(--hue-rotate, 0))))) / 50%); }',
    );
  });

  it('text color with important', () => {
    expect(convert('!c-red-500')).toBe(
      '.\\!c-red-500 { color: oklch(from var(--c-red, var(--color-red, var(--red, red))) calc(l * var(--c-red-lightness-factor, var(--red-lightness-factor, var(--c-lightness-factor, var(--lightness-factor, 1))))) calc(c * var(--c-red-chroma-factor, var(--red-chroma-factor, var(--c-chroma-factor, var(--chroma-factor, 1))))) calc(h + var(--c-red-hue-rotate, var(--red-hue-rotate, var(--c-hue-rotate, var(--hue-rotate, 0))))) / alpha) !important; }',
    );
  });

  it('background color', () => {
    expect(convert('bgc-blue-600')).toBe(
      '.bgc-blue-600 { background-color: oklch(from var(--bgc-blue, var(--color-blue, var(--blue, blue))) calc((l + l * (-0.2 * var(--bgc-blue-tone-factor, var(--blue-tone-factor, var(--bgc-tone-factor, var(--tone-factor, 1)))))) * var(--bgc-blue-lightness-factor, var(--blue-lightness-factor, var(--bgc-lightness-factor, var(--lightness-factor, 1))))) calc(c * var(--bgc-blue-chroma-factor, var(--blue-chroma-factor, var(--bgc-chroma-factor, var(--chroma-factor, 1))))) calc(h + var(--bgc-blue-hue-rotate, var(--blue-hue-rotate, var(--bgc-hue-rotate, var(--hue-rotate, 0))))) / alpha); }',
    );
  });

  it('background', () => {
    expect(convert('bg-blue-600')).toBe(
      '.bg-blue-600 { background: oklch(from var(--bgc-blue, var(--color-blue, var(--blue, blue))) calc((l + l * (-0.2 * var(--bgc-blue-tone-factor, var(--blue-tone-factor, var(--bgc-tone-factor, var(--tone-factor, 1)))))) * var(--bgc-blue-lightness-factor, var(--blue-lightness-factor, var(--bgc-lightness-factor, var(--lightness-factor, 1))))) calc(c * var(--bgc-blue-chroma-factor, var(--blue-chroma-factor, var(--bgc-chroma-factor, var(--chroma-factor, 1))))) calc(h + var(--bgc-blue-hue-rotate, var(--blue-hue-rotate, var(--bgc-hue-rotate, var(--hue-rotate, 0))))) / alpha); }',
    );
  });

  it('background with extra params (no-repeat should be omitted)', () => {
    expect(convert('bg-blue-600__no-repeat')).toBe(
      '.bg-blue-600__no-repeat { background: oklch(from var(--bgc-blue, var(--color-blue, var(--blue, blue))) calc((l + l * (-0.2 * var(--bgc-blue-tone-factor, var(--blue-tone-factor, var(--bgc-tone-factor, var(--tone-factor, 1)))))) * var(--bgc-blue-lightness-factor, var(--blue-lightness-factor, var(--bgc-lightness-factor, var(--lightness-factor, 1))))) calc(c * var(--bgc-blue-chroma-factor, var(--blue-chroma-factor, var(--bgc-chroma-factor, var(--chroma-factor, 1))))) calc(h + var(--bgc-blue-hue-rotate, var(--blue-hue-rotate, var(--bgc-hue-rotate, var(--hue-rotate, 0))))) / alpha); }',
    );
  });

  it('border color', () => {
    expect(convert('brc-gray-300')).toBe(
      '.brc-gray-300 { border-color: oklch(from var(--brc-gray, var(--color-gray, var(--gray, gray))) calc((l + (1 - l) * (0.4 * var(--brc-gray-tone-factor, var(--gray-tone-factor, var(--brc-tone-factor, var(--tone-factor, 1)))))) * var(--brc-gray-lightness-factor, var(--gray-lightness-factor, var(--brc-lightness-factor, var(--lightness-factor, 1))))) calc(c * var(--brc-gray-chroma-factor, var(--gray-chroma-factor, var(--brc-chroma-factor, var(--chroma-factor, 1))))) calc(h + var(--brc-gray-hue-rotate, var(--gray-hue-rotate, var(--brc-hue-rotate, var(--hue-rotate, 0))))) / alpha); }',
    );
  });

  it('border color multiple values', () => {
    expect(convert('brc-gray-300_blue-200')).toBe(
      '.brc-gray-300_blue-200 { border-color: oklch(from var(--brc-gray, var(--color-gray, var(--gray, gray))) calc((l + (1 - l) * (0.4 * var(--brc-gray-tone-factor, var(--gray-tone-factor, var(--brc-tone-factor, var(--tone-factor, 1)))))) * var(--brc-gray-lightness-factor, var(--gray-lightness-factor, var(--brc-lightness-factor, var(--lightness-factor, 1))))) calc(c * var(--brc-gray-chroma-factor, var(--gray-chroma-factor, var(--brc-chroma-factor, var(--chroma-factor, 1))))) calc(h + var(--brc-gray-hue-rotate, var(--gray-hue-rotate, var(--brc-hue-rotate, var(--hue-rotate, 0))))) / alpha) oklch(from var(--brc-blue, var(--color-blue, var(--blue, blue))) calc((l + (1 - l) * (0.6 * var(--brc-blue-tone-factor, var(--blue-tone-factor, var(--brc-tone-factor, var(--tone-factor, 1)))))) * var(--brc-blue-lightness-factor, var(--blue-lightness-factor, var(--brc-lightness-factor, var(--lightness-factor, 1))))) calc(c * var(--brc-blue-chroma-factor, var(--blue-chroma-factor, var(--brc-chroma-factor, var(--chroma-factor, 1))))) calc(h + var(--brc-blue-hue-rotate, var(--blue-hue-rotate, var(--brc-hue-rotate, var(--hue-rotate, 0))))) / alpha); }',
    );
  });

  it('border color multiple values with custom value', () => {
    expect(convert('brc-gray-300_[red]')).toBe(
      '.brc-gray-300_\\[red\\] { border-color: oklch(from var(--brc-gray, var(--color-gray, var(--gray, gray))) calc((l + (1 - l) * (0.4 * var(--brc-gray-tone-factor, var(--gray-tone-factor, var(--brc-tone-factor, var(--tone-factor, 1)))))) * var(--brc-gray-lightness-factor, var(--gray-lightness-factor, var(--brc-lightness-factor, var(--lightness-factor, 1))))) calc(c * var(--brc-gray-chroma-factor, var(--gray-chroma-factor, var(--brc-chroma-factor, var(--chroma-factor, 1))))) calc(h + var(--brc-gray-hue-rotate, var(--gray-hue-rotate, var(--brc-hue-rotate, var(--hue-rotate, 0))))) / alpha) red; }',
    );
  });

  it('color hex', () => {
    expect(convert('c-#ff0000')).toBe('.c-\\#ff0000 { color: #ff0000; }');
  });

  it('color rgba', () => {
    expect(convert('c-rgba(255,0,0,1)')).toBe(
      '.c-rgba\\(255\\,0\\,0\\,1\\) { color: rgba(255,0,0,1); }',
    );
  });

  it('color custom hex in predefined syntax', () => {
    expect(convert('c-[#ff0000]')).toBe(
      '.c-\\[\\#ff0000\\] { color: #ff0000; }',
    );
  });

  it('color custom hex in predefined syntax', () => {
    expect(convert('c-[red]')).toBe('.c-\\[red\\] { color: red; }');
  });

  it('color custom hex value', () => {
    expect(convert('c=#ff0000')).toBe('.c\\=\\#ff0000 { color: #ff0000; }');
  });
});

import { describe, expect, it } from 'vitest';
import { convert } from '../src/core/helpers/convert.helper';

describe('Color', () => {
  it('text color with custom variable', () => {
    expect(convert('c-primary')).toBe(
      '.c-primary { color: oklch(from var(--c-primary, var(--color-primary, var(--primary, primary))) calc(l * var(--c-primary-l-scale, var(--primary-l-scale, var(--c-l-scale, var(--l-scale, 1))))) calc(c * var(--c-primary-c-scale, var(--primary-c-scale, var(--c-c-scale, var(--c-scale, 1))))) calc(h + var(--c-primary-h-rotate, var(--primary-h-rotate, var(--c-h-rotate, var(--h-rotate, 0))))) / alpha); }',
    );
  });

  it('background color with custom variable', () => {
    expect(convert('bgc-primary')).toBe(
      '.bgc-primary { background-color: oklch(from var(--bgc-primary, var(--color-primary, var(--primary, primary))) calc(l * var(--bgc-primary-l-scale, var(--primary-l-scale, var(--bgc-l-scale, var(--l-scale, 1))))) calc(c * var(--bgc-primary-c-scale, var(--primary-c-scale, var(--bgc-c-scale, var(--c-scale, 1))))) calc(h + var(--bgc-primary-h-rotate, var(--primary-h-rotate, var(--bgc-h-rotate, var(--h-rotate, 0))))) / alpha); }',
    );
  });

  it('background with custom variable', () => {
    expect(convert('bg-primary')).toBe(
      '.bg-primary { background: oklch(from var(--bgc-primary, var(--color-primary, var(--primary, primary))) calc(l * var(--bgc-primary-l-scale, var(--primary-l-scale, var(--bgc-l-scale, var(--l-scale, 1))))) calc(c * var(--bgc-primary-c-scale, var(--primary-c-scale, var(--bgc-c-scale, var(--c-scale, 1))))) calc(h + var(--bgc-primary-h-rotate, var(--primary-h-rotate, var(--bgc-h-rotate, var(--h-rotate, 0))))) / alpha); }',
    );
  });

  it('text color', () => {
    expect(convert('c-red')).toBe(
      '.c-red { color: oklch(from var(--c-red, var(--color-red, var(--red, red))) calc(l * var(--c-red-l-scale, var(--red-l-scale, var(--c-l-scale, var(--l-scale, 1))))) calc(c * var(--c-red-c-scale, var(--red-c-scale, var(--c-c-scale, var(--c-scale, 1))))) calc(h + var(--c-red-h-rotate, var(--red-h-rotate, var(--c-h-rotate, var(--h-rotate, 0))))) / alpha); }',
    );
  });

  it('text color with alpha', () => {
    expect(convert('c-red/50')).toBe(
      '.c-red\\/50 { color: oklch(from var(--c-red, var(--color-red, var(--red, red))) calc(l * var(--c-red-l-scale, var(--red-l-scale, var(--c-l-scale, var(--l-scale, 1))))) calc(c * var(--c-red-c-scale, var(--red-c-scale, var(--c-c-scale, var(--c-scale, 1))))) calc(h + var(--c-red-h-rotate, var(--red-h-rotate, var(--c-h-rotate, var(--h-rotate, 0))))) / 50%); }',
    );
  });

  it('text color without shortcut', () => {
    expect(convert('color-red')).toBe(
      '.color-red { color: oklch(from var(--c-red, var(--color-red, var(--red, red))) calc(l * var(--c-red-l-scale, var(--red-l-scale, var(--c-l-scale, var(--l-scale, 1))))) calc(c * var(--c-red-c-scale, var(--red-c-scale, var(--c-c-scale, var(--c-scale, 1))))) calc(h + var(--c-red-h-rotate, var(--red-h-rotate, var(--c-h-rotate, var(--h-rotate, 0))))) / alpha); }',
    );
  });

  it('text color', () => {
    expect(convert('c-red-500')).toBe(
      '.c-red-500 { color: oklch(from var(--c-red, var(--color-red, var(--red, red))) calc((l + (((var(--c-red-l-shift, var(--red-l-shift, var(--c-l-shift, var(--l-shift, 1)))) * (0.5 - 0.5)) + (abs(var(--c-red-l-shift, var(--red-l-shift, var(--c-l-shift, var(--l-shift, 1))))) * (0.5 - l))) * calc(var(--l-edge-shift, 0.5) + ((1 - var(--l-edge-shift, 0.5)) * pow(abs(0.5 - 0.5) * 2, 2))))) * var(--c-red-l-scale, var(--red-l-scale, var(--c-l-scale, var(--l-scale, 1))))) calc(c * calc(1 - (pow(abs(0.5 - 0.5) * 2, 2) * var(--c-curve, 0.5))) * var(--c-red-c-scale, var(--red-c-scale, var(--c-c-scale, var(--c-scale, 1))))) calc(h + var(--c-red-h-rotate, var(--red-h-rotate, var(--c-h-rotate, var(--h-rotate, 0))))) / alpha); }',
    );
  });

  it('text color with dashed custom variable', () => {
    expect(convert('c-brand-blue')).toBe(
      '.c-brand-blue { color: oklch(from var(--c-brand-blue, var(--color-brand-blue, var(--brand-blue, brand-blue))) calc(l * var(--c-brand-blue-l-scale, var(--brand-blue-l-scale, var(--c-l-scale, var(--l-scale, 1))))) calc(c * var(--c-brand-blue-c-scale, var(--brand-blue-c-scale, var(--c-c-scale, var(--c-scale, 1))))) calc(h + var(--c-brand-blue-h-rotate, var(--brand-blue-h-rotate, var(--c-h-rotate, var(--h-rotate, 0))))) / alpha); }',
    );
  });

  it('text color with dashed custom variable and alpha', () => {
    expect(convert('c-brand-blue/50')).toBe(
      '.c-brand-blue\\/50 { color: oklch(from var(--c-brand-blue, var(--color-brand-blue, var(--brand-blue, brand-blue))) calc(l * var(--c-brand-blue-l-scale, var(--brand-blue-l-scale, var(--c-l-scale, var(--l-scale, 1))))) calc(c * var(--c-brand-blue-c-scale, var(--brand-blue-c-scale, var(--c-c-scale, var(--c-scale, 1))))) calc(h + var(--c-brand-blue-h-rotate, var(--brand-blue-h-rotate, var(--c-h-rotate, var(--h-rotate, 0))))) / 50%); }',
    );
  });

  it('text color with dashed custom variable and lightness', () => {
    expect(convert('c-brand-blue-600')).toBe(
      '.c-brand-blue-600 { color: oklch(from var(--c-brand-blue, var(--color-brand-blue, var(--brand-blue, brand-blue))) calc((l + (((var(--c-brand-blue-l-shift, var(--brand-blue-l-shift, var(--c-l-shift, var(--l-shift, 1)))) * (0.5 - 0.6111)) + (abs(var(--c-brand-blue-l-shift, var(--brand-blue-l-shift, var(--c-l-shift, var(--l-shift, 1))))) * (0.5 - l))) * calc(var(--l-edge-shift, 0.5) + ((1 - var(--l-edge-shift, 0.5)) * pow(abs(0.6111 - 0.5) * 2, 2))))) * var(--c-brand-blue-l-scale, var(--brand-blue-l-scale, var(--c-l-scale, var(--l-scale, 1))))) calc(c * calc(1 - (pow(abs(0.6111 - 0.5) * 2, 2) * var(--c-curve, 0.5))) * var(--c-brand-blue-c-scale, var(--brand-blue-c-scale, var(--c-c-scale, var(--c-scale, 1))))) calc(h + var(--c-brand-blue-h-rotate, var(--brand-blue-h-rotate, var(--c-h-rotate, var(--h-rotate, 0))))) / alpha); }',
    );
  });

  it('text color with dashed custom variable, lightness and alpha', () => {
    expect(convert('c-brand-blue-600/50')).toBe(
      '.c-brand-blue-600\\/50 { color: oklch(from var(--c-brand-blue, var(--color-brand-blue, var(--brand-blue, brand-blue))) calc((l + (((var(--c-brand-blue-l-shift, var(--brand-blue-l-shift, var(--c-l-shift, var(--l-shift, 1)))) * (0.5 - 0.6111)) + (abs(var(--c-brand-blue-l-shift, var(--brand-blue-l-shift, var(--c-l-shift, var(--l-shift, 1))))) * (0.5 - l))) * calc(var(--l-edge-shift, 0.5) + ((1 - var(--l-edge-shift, 0.5)) * pow(abs(0.6111 - 0.5) * 2, 2))))) * var(--c-brand-blue-l-scale, var(--brand-blue-l-scale, var(--c-l-scale, var(--l-scale, 1))))) calc(c * calc(1 - (pow(abs(0.6111 - 0.5) * 2, 2) * var(--c-curve, 0.5))) * var(--c-brand-blue-c-scale, var(--brand-blue-c-scale, var(--c-c-scale, var(--c-scale, 1))))) calc(h + var(--c-brand-blue-h-rotate, var(--brand-blue-h-rotate, var(--c-h-rotate, var(--h-rotate, 0))))) / 50%); }',
    );
  });

  it('text color with important', () => {
    expect(convert('!c-red-500')).toBe(
      '.\\!c-red-500 { color: oklch(from var(--c-red, var(--color-red, var(--red, red))) calc((l + (((var(--c-red-l-shift, var(--red-l-shift, var(--c-l-shift, var(--l-shift, 1)))) * (0.5 - 0.5)) + (abs(var(--c-red-l-shift, var(--red-l-shift, var(--c-l-shift, var(--l-shift, 1))))) * (0.5 - l))) * calc(var(--l-edge-shift, 0.5) + ((1 - var(--l-edge-shift, 0.5)) * pow(abs(0.5 - 0.5) * 2, 2))))) * var(--c-red-l-scale, var(--red-l-scale, var(--c-l-scale, var(--l-scale, 1))))) calc(c * calc(1 - (pow(abs(0.5 - 0.5) * 2, 2) * var(--c-curve, 0.5))) * var(--c-red-c-scale, var(--red-c-scale, var(--c-c-scale, var(--c-scale, 1))))) calc(h + var(--c-red-h-rotate, var(--red-h-rotate, var(--c-h-rotate, var(--h-rotate, 0))))) / alpha) !important; }',
    );
  });

  it('background color', () => {
    expect(convert('bgc-blue-600')).toBe(
      '.bgc-blue-600 { background-color: oklch(from var(--bgc-blue, var(--color-blue, var(--blue, blue))) calc((l + (((var(--bgc-blue-l-shift, var(--blue-l-shift, var(--bgc-l-shift, var(--l-shift, 1)))) * (0.5 - 0.6111)) + (abs(var(--bgc-blue-l-shift, var(--blue-l-shift, var(--bgc-l-shift, var(--l-shift, 1))))) * (0.5 - l))) * calc(var(--l-edge-shift, 0.5) + ((1 - var(--l-edge-shift, 0.5)) * pow(abs(0.6111 - 0.5) * 2, 2))))) * var(--bgc-blue-l-scale, var(--blue-l-scale, var(--bgc-l-scale, var(--l-scale, 1))))) calc(c * calc(1 - (pow(abs(0.6111 - 0.5) * 2, 2) * var(--c-curve, 0.5))) * var(--bgc-blue-c-scale, var(--blue-c-scale, var(--bgc-c-scale, var(--c-scale, 1))))) calc(h + var(--bgc-blue-h-rotate, var(--blue-h-rotate, var(--bgc-h-rotate, var(--h-rotate, 0))))) / alpha); }',
    );
  });

  it('background color', () => {
    expect(convert('bgc-blue-600/0')).toBe(
      '.bgc-blue-600\\/0 { background-color: oklch(from var(--bgc-blue, var(--color-blue, var(--blue, blue))) calc((l + (((var(--bgc-blue-l-shift, var(--blue-l-shift, var(--bgc-l-shift, var(--l-shift, 1)))) * (0.5 - 0.6111)) + (abs(var(--bgc-blue-l-shift, var(--blue-l-shift, var(--bgc-l-shift, var(--l-shift, 1))))) * (0.5 - l))) * calc(var(--l-edge-shift, 0.5) + ((1 - var(--l-edge-shift, 0.5)) * pow(abs(0.6111 - 0.5) * 2, 2))))) * var(--bgc-blue-l-scale, var(--blue-l-scale, var(--bgc-l-scale, var(--l-scale, 1))))) calc(c * calc(1 - (pow(abs(0.6111 - 0.5) * 2, 2) * var(--c-curve, 0.5))) * var(--bgc-blue-c-scale, var(--blue-c-scale, var(--bgc-c-scale, var(--c-scale, 1))))) calc(h + var(--bgc-blue-h-rotate, var(--blue-h-rotate, var(--bgc-h-rotate, var(--h-rotate, 0))))) / 0%); }',
    );
  });

  it('background', () => {
    expect(convert('bg-blue-600')).toBe(
      '.bg-blue-600 { background: oklch(from var(--bgc-blue, var(--color-blue, var(--blue, blue))) calc((l + (((var(--bgc-blue-l-shift, var(--blue-l-shift, var(--bgc-l-shift, var(--l-shift, 1)))) * (0.5 - 0.6111)) + (abs(var(--bgc-blue-l-shift, var(--blue-l-shift, var(--bgc-l-shift, var(--l-shift, 1))))) * (0.5 - l))) * calc(var(--l-edge-shift, 0.5) + ((1 - var(--l-edge-shift, 0.5)) * pow(abs(0.6111 - 0.5) * 2, 2))))) * var(--bgc-blue-l-scale, var(--blue-l-scale, var(--bgc-l-scale, var(--l-scale, 1))))) calc(c * calc(1 - (pow(abs(0.6111 - 0.5) * 2, 2) * var(--c-curve, 0.5))) * var(--bgc-blue-c-scale, var(--blue-c-scale, var(--bgc-c-scale, var(--c-scale, 1))))) calc(h + var(--bgc-blue-h-rotate, var(--blue-h-rotate, var(--bgc-h-rotate, var(--h-rotate, 0))))) / alpha); }',
    );
  });

  it('background with extra params (no-repeat should be omitted)', () => {
    expect(convert('bg-blue-600__no-repeat')).toBe(
      '.bg-blue-600__no-repeat { background: oklch(from var(--bgc-blue, var(--color-blue, var(--blue, blue))) calc((l + (((var(--bgc-blue-l-shift, var(--blue-l-shift, var(--bgc-l-shift, var(--l-shift, 1)))) * (0.5 - 0.6111)) + (abs(var(--bgc-blue-l-shift, var(--blue-l-shift, var(--bgc-l-shift, var(--l-shift, 1))))) * (0.5 - l))) * calc(var(--l-edge-shift, 0.5) + ((1 - var(--l-edge-shift, 0.5)) * pow(abs(0.6111 - 0.5) * 2, 2))))) * var(--bgc-blue-l-scale, var(--blue-l-scale, var(--bgc-l-scale, var(--l-scale, 1))))) calc(c * calc(1 - (pow(abs(0.6111 - 0.5) * 2, 2) * var(--c-curve, 0.5))) * var(--bgc-blue-c-scale, var(--blue-c-scale, var(--bgc-c-scale, var(--c-scale, 1))))) calc(h + var(--bgc-blue-h-rotate, var(--blue-h-rotate, var(--bgc-h-rotate, var(--h-rotate, 0))))) / alpha); }',
    );
  });

  it('border color', () => {
    expect(convert('brc-gray-300')).toBe(
      '.brc-gray-300 { border-color: oklch(from var(--brc-gray, var(--color-gray, var(--gray, gray))) calc((l + (((var(--brc-gray-l-shift, var(--gray-l-shift, var(--brc-l-shift, var(--l-shift, 1)))) * (0.5 - 0.2778)) + (abs(var(--brc-gray-l-shift, var(--gray-l-shift, var(--brc-l-shift, var(--l-shift, 1))))) * (0.5 - l))) * calc(var(--l-edge-shift, 0.5) + ((1 - var(--l-edge-shift, 0.5)) * pow(abs(0.2778 - 0.5) * 2, 2))))) * var(--brc-gray-l-scale, var(--gray-l-scale, var(--brc-l-scale, var(--l-scale, 1))))) calc(c * calc(1 - (pow(abs(0.2778 - 0.5) * 2, 2) * var(--c-curve, 0.5))) * var(--brc-gray-c-scale, var(--gray-c-scale, var(--brc-c-scale, var(--c-scale, 1))))) calc(h + var(--brc-gray-h-rotate, var(--gray-h-rotate, var(--brc-h-rotate, var(--h-rotate, 0))))) / alpha); }',
    );
  });

  it('border color multiple values', () => {
    expect(convert('brc-gray-300_blue-200')).toBe(
      '.brc-gray-300_blue-200 { border-color: oklch(from var(--brc-gray, var(--color-gray, var(--gray, gray))) calc((l + (((var(--brc-gray-l-shift, var(--gray-l-shift, var(--brc-l-shift, var(--l-shift, 1)))) * (0.5 - 0.2778)) + (abs(var(--brc-gray-l-shift, var(--gray-l-shift, var(--brc-l-shift, var(--l-shift, 1))))) * (0.5 - l))) * calc(var(--l-edge-shift, 0.5) + ((1 - var(--l-edge-shift, 0.5)) * pow(abs(0.2778 - 0.5) * 2, 2))))) * var(--brc-gray-l-scale, var(--gray-l-scale, var(--brc-l-scale, var(--l-scale, 1))))) calc(c * calc(1 - (pow(abs(0.2778 - 0.5) * 2, 2) * var(--c-curve, 0.5))) * var(--brc-gray-c-scale, var(--gray-c-scale, var(--brc-c-scale, var(--c-scale, 1))))) calc(h + var(--brc-gray-h-rotate, var(--gray-h-rotate, var(--brc-h-rotate, var(--h-rotate, 0))))) / alpha) oklch(from var(--brc-blue, var(--color-blue, var(--blue, blue))) calc((l + (((var(--brc-blue-l-shift, var(--blue-l-shift, var(--brc-l-shift, var(--l-shift, 1)))) * (0.5 - 0.1667)) + (abs(var(--brc-blue-l-shift, var(--blue-l-shift, var(--brc-l-shift, var(--l-shift, 1))))) * (0.5 - l))) * calc(var(--l-edge-shift, 0.5) + ((1 - var(--l-edge-shift, 0.5)) * pow(abs(0.1667 - 0.5) * 2, 2))))) * var(--brc-blue-l-scale, var(--blue-l-scale, var(--brc-l-scale, var(--l-scale, 1))))) calc(c * calc(1 - (pow(abs(0.1667 - 0.5) * 2, 2) * var(--c-curve, 0.5))) * var(--brc-blue-c-scale, var(--blue-c-scale, var(--brc-c-scale, var(--c-scale, 1))))) calc(h + var(--brc-blue-h-rotate, var(--blue-h-rotate, var(--brc-h-rotate, var(--h-rotate, 0))))) / alpha); }',
    );
  });

  it('border color multiple values with custom value', () => {
    expect(convert('brc-gray-300_[red]')).toBe(
      '.brc-gray-300_\\[red\\] { border-color: oklch(from var(--brc-gray, var(--color-gray, var(--gray, gray))) calc((l + (((var(--brc-gray-l-shift, var(--gray-l-shift, var(--brc-l-shift, var(--l-shift, 1)))) * (0.5 - 0.2778)) + (abs(var(--brc-gray-l-shift, var(--gray-l-shift, var(--brc-l-shift, var(--l-shift, 1))))) * (0.5 - l))) * calc(var(--l-edge-shift, 0.5) + ((1 - var(--l-edge-shift, 0.5)) * pow(abs(0.2778 - 0.5) * 2, 2))))) * var(--brc-gray-l-scale, var(--gray-l-scale, var(--brc-l-scale, var(--l-scale, 1))))) calc(c * calc(1 - (pow(abs(0.2778 - 0.5) * 2, 2) * var(--c-curve, 0.5))) * var(--brc-gray-c-scale, var(--gray-c-scale, var(--brc-c-scale, var(--c-scale, 1))))) calc(h + var(--brc-gray-h-rotate, var(--gray-h-rotate, var(--brc-h-rotate, var(--h-rotate, 0))))) / alpha) red; }',
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

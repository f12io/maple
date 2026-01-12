import { describe, expect, it } from 'vitest';
import { generateStylesFromClass as convert } from '../src/core/generator';

describe('Opacity', () => {
  it('opacity 0', () => {
    expect(convert('o-0')).toBe('.o-0 { opacity: 0; }');
  });

  it('opacity 0 with important', () => {
    expect(convert('!o-0')).toBe('.\\!o-0 { opacity: 0 !important; }');
  });

  it('opacity 0 without shortcut', () => {
    expect(convert('opacity-0')).toBe('.opacity-0 { opacity: 0; }');
  });

  it('opacity 0 without shortcut and with important', () => {
    expect(convert('!opacity-0')).toBe(
      '.\\!opacity-0 { opacity: 0 !important; }',
    );
  });

  it('opacity 1', () => {
    expect(convert('o-1')).toBe('.o-1 { opacity: 0.01; }');
  });

  it('opacity 1 without shortcut', () => {
    expect(convert('opacity-1')).toBe('.opacity-1 { opacity: 0.01; }');
  });

  it('opacity 5', () => {
    expect(convert('o-5')).toBe('.o-5 { opacity: 0.05; }');
  });

  it('opacity 6', () => {
    expect(convert('o-6')).toBe('.o-6 { opacity: 0.06; }');
  });

  it('opacity 10', () => {
    expect(convert('o-10')).toBe('.o-10 { opacity: 0.1; }');
  });

  it('opacity 50', () => {
    expect(convert('o-50')).toBe('.o-50 { opacity: 0.5; }');
  });

  it('opacity 52', () => {
    expect(convert('o-52')).toBe('.o-52 { opacity: 0.52; }');
  });

  it('opacity 100', () => {
    expect(convert('o-100')).toBe('.o-100 { opacity: 1; }');
  });

  it('opacity with custom css variable', () => {
    expect(convert('o-half')).toBe(
      '.o-half { opacity: var(--o-half, var(--half, half)); }',
    );
  });

  it('opacity with custom css variable without shortcut', () => {
    expect(convert('opacity-half')).toBe(
      '.opacity-half { opacity: var(--o-half, var(--half, half)); }',
    );
  });

  it('opacity with custom value', () => {
    expect(convert('o=0.543')).toBe('.o\\=0\\.543 { opacity: 0.543; }');
  });

  it('opacity with custom value and important', () => {
    expect(convert('!o=0.5')).toBe(
      '.\\!o\\=0\\.5 { opacity: 0.5 !important; }',
    );
  });

  it('opacity with custom value and long important', () => {
    expect(convert('o=0.5_!important')).toBe(
      '.o\\=0\\.5_\\!important { opacity: 0.5 !important; }',
    );
  });

  it('opacity with custom value and without shortcut', () => {
    expect(convert('opacity=0.543')).toBe(
      '.opacity\\=0\\.543 { opacity: 0.543; }',
    );
  });

  it('opacity with custom value excluding leading zero', () => {
    expect(convert('o=.5')).toBe('.o\\=\\.5 { opacity: .5; }');
  });

  it('opacity with custom value excluding leading zero and without shortcut', () => {
    expect(convert('opacity=.5')).toBe('.opacity\\=\\.5 { opacity: .5; }');
  });
});

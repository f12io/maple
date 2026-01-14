import { describe, expect, it } from 'vitest';
import { generateStylesFromClass as convert } from '../src/core/generator';

describe('Variables', () => {
  it('utility only', () => {
    expect(convert('--bg=black')).toBe('.--bg\\=black { --bg: black; }');
  });

  it('utility only name with multiple dashes', () => {
    expect(convert('--bg-hero-gradient=linear-gradient(blue,red)')).toBe(
      '.--bg-hero-gradient\\=linear-gradient\\(blue\\,red\\) { --bg-hero-gradient: linear-gradient(blue,red); }',
    );
  });

  it('utility only name with another variable', () => {
    expect(convert('--bg-hero-gradient=var(--another-variable)')).toBe(
      '.--bg-hero-gradient\\=var\\(--another-variable\\) { --bg-hero-gradient: var(--another-variable); }',
    );
  });

  it('utility only with important', () => {
    expect(convert('!--bg=black')).toBe(
      '.\\!--bg\\=black { --bg: black !important; }',
    );
  });

  it('utility only with long important', () => {
    expect(convert('--bg=black_!important')).toBe(
      '.--bg\\=black_\\!important { --bg: black !important; }',
    );
  });

  it('utility with selector', () => {
    expect(convert('&[data-foo]:--bg=black')).toBe(
      '.\\&\\[data-foo\\]\\:--bg\\=black[data-foo] { --bg: black; }',
    );
  });

  it('utility with selector and long-name', () => {
    expect(
      convert('&[data-foo]:--bg-hero-gradient=linear-gradient(blue,red)'),
    ).toBe(
      '.\\&\\[data-foo\\]\\:--bg-hero-gradient\\=linear-gradient\\(blue\\,red\\)[data-foo] { --bg-hero-gradient: linear-gradient(blue,red); }',
    );
  });
});

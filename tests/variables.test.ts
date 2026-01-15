import { describe, expect, it } from 'vitest';
import { generateStylesFromClass as convert } from '../src/core/generator';

describe('Variables', () => {
  it('utility only', () => {
    expect(convert('--bg=black')).toBe('.--bg\\=black { --bg: black; }');
  });

  it('name with multiple dashes', () => {
    expect(convert('--bg-hero-gradient=linear-gradient(blue,red)')).toBe(
      '.--bg-hero-gradient\\=linear-gradient\\(blue\\,red\\) { --bg-hero-gradient: linear-gradient(blue,red); }',
    );
  });

  it('with another variable', () => {
    expect(convert('--bg-hero-gradient=var(--another-variable)')).toBe(
      '.--bg-hero-gradient\\=var\\(--another-variable\\) { --bg-hero-gradient: var(--another-variable); }',
    );
  });

  it('with spaces in value', () => {
    expect(convert('--bg-logo=url(/path/logo.png)_no-repeat')).toBe(
      '.--bg-logo\\=url\\(\\/path\\/logo\\.png\\)_no-repeat { --bg-logo: url(/path/logo.png) no-repeat; }',
    );
  });

  it('with important', () => {
    expect(convert('!--bg=black')).toBe(
      '.\\!--bg\\=black { --bg: black !important; }',
    );
  });

  it('with long important', () => {
    expect(convert('--bg=black_!important')).toBe(
      '.--bg\\=black_\\!important { --bg: black !important; }',
    );
  });

  it('with selector', () => {
    expect(convert('&[data-foo]:--bg=black')).toBe(
      '.\\&\\[data-foo\\]\\:--bg\\=black[data-foo] { --bg: black; }',
    );
  });

  it('with selector and dashed name', () => {
    expect(
      convert('&[data-foo]:--bg-hero-gradient=linear-gradient(blue,red)'),
    ).toBe(
      '.\\&\\[data-foo\\]\\:--bg-hero-gradient\\=linear-gradient\\(blue\\,red\\)[data-foo] { --bg-hero-gradient: linear-gradient(blue,red); }',
    );
  });
});

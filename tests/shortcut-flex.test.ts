import { describe, expect, it } from 'vitest';
import { convert } from './helpers/convert.helper';

describe('Flex Row Shortcuts', () => {
  it('fxrow-cc (center-center)', () => {
    expect(convert('fxrow-cc')).toBe(
      `.fxrow-cc { display: flex;flex-direction: row;justify-content: center;align-items: center; }`,
    );
  });

  it('fxrow-tl (top-left)', () => {
    expect(convert('fxrow-tl')).toBe(
      `.fxrow-tl { display: flex;flex-direction: row;justify-content: flex-start;align-items: flex-start; }`,
    );
  });

  it('fxrow-br (bottom-right)', () => {
    expect(convert('fxrow-br')).toBe(
      `.fxrow-br { display: flex;flex-direction: row;justify-content: flex-end;align-items: flex-end; }`,
    );
  });

  it('fxrow-cw (center-between)', () => {
    expect(convert('fxrow-cw')).toBe(
      `.fxrow-cw { display: flex;flex-direction: row;justify-content: space-between;align-items: center; }`,
    );
  });

  it('fxrow-sl (stretch-left)', () => {
    expect(convert('fxrow-sl')).toBe(
      `.fxrow-sl { display: flex;flex-direction: row;justify-content: flex-start;align-items: stretch; }`,
    );
  });

  it('fxrow-cc with important', () => {
    expect(convert('!fxrow-cc')).toBe(
      `.\\!fxrow-cc { display: flex !important;flex-direction: row !important;justify-content: center !important;align-items: center !important; }`,
    );
  });
});

describe('Flex Column Shortcuts', () => {
  it('fxcol-cc (center-center)', () => {
    expect(convert('fxcol-cc')).toBe(
      `.fxcol-cc { display: flex;flex-direction: column;justify-content: center;align-items: center; }`,
    );
  });

  it('fxcol-tl (top-left)', () => {
    expect(convert('fxcol-tl')).toBe(
      `.fxcol-tl { display: flex;flex-direction: column;justify-content: flex-start;align-items: flex-start; }`,
    );
  });

  it('fxcol-br (bottom-right)', () => {
    expect(convert('fxcol-br')).toBe(
      `.fxcol-br { display: flex;flex-direction: column;justify-content: flex-end;align-items: flex-end; }`,
    );
  });

  it('fxcol-wc (between-center)', () => {
    expect(convert('fxcol-wc')).toBe(
      `.fxcol-wc { display: flex;flex-direction: column;justify-content: space-between;align-items: center; }`,
    );
  });

  it('fxcol-cc with important', () => {
    expect(convert('!fxcol-cc')).toBe(
      `.\\!fxcol-cc { display: flex !important;flex-direction: column !important;justify-content: center !important;align-items: center !important; }`,
    );
  });
});

describe('Inline Flex Shortcuts', () => {
  it('ifxrow-cc', () => {
    expect(convert('ifxrow-cc')).toBe(
      `.ifxrow-cc { display: inline-flex;flex-direction: row;justify-content: center;align-items: center; }`,
    );
  });

  it('ifxcol-cc', () => {
    expect(convert('ifxcol-cc')).toBe(
      `.ifxcol-cc { display: inline-flex;flex-direction: column;justify-content: center;align-items: center; }`,
    );
  });
});

describe('Flex Self Shortcuts', () => {
  it('fxrowself-cc (center-center)', () => {
    expect(convert('fxrowself-cc')).toBe(
      `.fxrowself-cc { justify-self: center;align-self: center; }`,
    );
  });

  it('fxrowself-tl (top-left)', () => {
    expect(convert('fxrowself-tl')).toBe(
      `.fxrowself-tl { justify-self: flex-start;align-self: flex-start; }`,
    );
  });

  it('fxrowself-br (bottom-right)', () => {
    expect(convert('fxrowself-br')).toBe(
      `.fxrowself-br { justify-self: flex-end;align-self: flex-end; }`,
    );
  });

  it('fxcolself-cc (center-center)', () => {
    expect(convert('fxcolself-cc')).toBe(
      `.fxcolself-cc { justify-self: center;align-self: center; }`,
    );
  });

  it('fxcolself-tl (top-left)', () => {
    expect(convert('fxcolself-tl')).toBe(
      `.fxcolself-tl { justify-self: flex-start;align-self: flex-start; }`,
    );
  });

  it('fxrowself-cc with important', () => {
    expect(convert('!fxrowself-cc')).toBe(
      `.\\!fxrowself-cc { justify-self: center !important;align-self: center !important; }`,
    );
  });
});

describe('Flex Shortcuts with Media Queries', () => {
  it('md:fxrow-cc', () => {
    expect(convert('md:fxrow-cc')).toBe(
      `@container (min-width: 768px) { .md\\:fxrow-cc { display: flex;flex-direction: row;justify-content: center;align-items: center; } }`,
    );
  });

  it('@md:fxcol-cc (viewport)', () => {
    expect(convert('@md:fxcol-cc')).toBe(
      `@media (min-width: 768px) { .\\@md\\:fxcol-cc { display: flex;flex-direction: column;justify-content: center;align-items: center; } }`,
    );
  });
});

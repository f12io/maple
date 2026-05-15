import { describe, expect, it } from 'vitest';
import { convert } from './helpers/convert.helper';

function rule(selector: string, content: string) {
  return `:where(${selector}) { ${content} }`;
}

function rules(selector: string, contents: Array<string>) {
  return contents.map((content) => rule(selector, content)).join(' ');
}

function mediaRule(media: string, selector: string, content: string) {
  return `${media} { ${rule(selector, content)} }`;
}

function mediaRules(media: string, selector: string, contents: Array<string>) {
  return contents
    .map((content) => mediaRule(media, selector, content))
    .join(' ');
}

describe('Flex Row Shortcuts', () => {
  it('fxrow-cc (center-center)', () => {
    expect(convert('fxrow-cc')).toBe(
      rules('.fxrow-cc', [
        'display: flex;',
        'flex-direction: row;',
        'justify-content: center;',
        'align-items: center;',
      ]),
    );
  });

  it('fxrow-ss (top-left)', () => {
    expect(convert('fxrow-ss')).toBe(
      rules('.fxrow-ss', [
        'display: flex;',
        'flex-direction: row;',
        'justify-content: flex-start;',
        'align-items: flex-start;',
      ]),
    );
  });

  it('fxrow-ee (bottom-right)', () => {
    expect(convert('fxrow-ee')).toBe(
      rules('.fxrow-ee', [
        'display: flex;',
        'flex-direction: row;',
        'justify-content: flex-end;',
        'align-items: flex-end;',
      ]),
    );
  });

  it('fxrow-cw (center-between)', () => {
    expect(convert('fxrow-cw')).toBe(
      rules('.fxrow-cw', [
        'display: flex;',
        'flex-direction: row;',
        'justify-content: space-between;',
        'align-items: center;',
      ]),
    );
  });

  it('fxrow-hs (stretch-left)', () => {
    expect(convert('fxrow-hs')).toBe(
      rules('.fxrow-hs', [
        'display: flex;',
        'flex-direction: row;',
        'justify-content: flex-start;',
        'align-items: stretch;',
      ]),
    );
  });

  it('fxrow-cc with important', () => {
    expect(convert('!fxrow-cc')).toBe(
      rules('.\\!fxrow-cc', [
        'display: flex !important;',
        'flex-direction: row !important;',
        'justify-content: center !important;',
        'align-items: center !important;',
      ]),
    );
  });
});

describe('Flex Column Shortcuts', () => {
  it('fxcol-cc (center-center)', () => {
    expect(convert('fxcol-cc')).toBe(
      rules('.fxcol-cc', [
        'display: flex;',
        'flex-direction: column;',
        'justify-content: center;',
        'align-items: center;',
      ]),
    );
  });

  it('fxcol-ss (top-left)', () => {
    expect(convert('fxcol-ss')).toBe(
      rules('.fxcol-ss', [
        'display: flex;',
        'flex-direction: column;',
        'justify-content: flex-start;',
        'align-items: flex-start;',
      ]),
    );
  });

  it('fxcol-ee (bottom-right)', () => {
    expect(convert('fxcol-ee')).toBe(
      rules('.fxcol-ee', [
        'display: flex;',
        'flex-direction: column;',
        'justify-content: flex-end;',
        'align-items: flex-end;',
      ]),
    );
  });

  it('fxcol-wc (between-center)', () => {
    expect(convert('fxcol-wc')).toBe(
      rules('.fxcol-wc', [
        'display: flex;',
        'flex-direction: column;',
        'justify-content: space-between;',
        'align-items: center;',
      ]),
    );
  });

  it('fxcol-cc with important', () => {
    expect(convert('!fxcol-cc')).toBe(
      rules('.\\!fxcol-cc', [
        'display: flex !important;',
        'flex-direction: column !important;',
        'justify-content: center !important;',
        'align-items: center !important;',
      ]),
    );
  });
});

describe('Inline Flex Shortcuts', () => {
  it('ifxrow-cc', () => {
    expect(convert('ifxrow-cc')).toBe(
      rules('.ifxrow-cc', [
        'display: inline-flex;',
        'flex-direction: row;',
        'justify-content: center;',
        'align-items: center;',
      ]),
    );
  });

  it('ifxcol-cc', () => {
    expect(convert('ifxcol-cc')).toBe(
      rules('.ifxcol-cc', [
        'display: inline-flex;',
        'flex-direction: column;',
        'justify-content: center;',
        'align-items: center;',
      ]),
    );
  });
});

describe('Flex Self Shortcuts', () => {
  it('fxrowself-cc (center-center)', () => {
    expect(convert('fxrowself-cc')).toBe(
      rules('.fxrowself-cc', ['justify-self: center;', 'align-self: center;']),
    );
  });

  it('fxrowself-ss (top-left)', () => {
    expect(convert('fxrowself-ss')).toBe(
      rules('.fxrowself-ss', [
        'justify-self: flex-start;',
        'align-self: flex-start;',
      ]),
    );
  });

  it('fxrowself-ee (bottom-right)', () => {
    expect(convert('fxrowself-ee')).toBe(
      rules('.fxrowself-ee', [
        'justify-self: flex-end;',
        'align-self: flex-end;',
      ]),
    );
  });

  it('fxcolself-cc (center-center)', () => {
    expect(convert('fxcolself-cc')).toBe(
      rules('.fxcolself-cc', ['justify-self: center;', 'align-self: center;']),
    );
  });

  it('fxcolself-ss (top-left)', () => {
    expect(convert('fxcolself-ss')).toBe(
      rules('.fxcolself-ss', [
        'justify-self: flex-start;',
        'align-self: flex-start;',
      ]),
    );
  });

  it('fxrowself-cc with important', () => {
    expect(convert('!fxrowself-cc')).toBe(
      rules('.\\!fxrowself-cc', [
        'justify-self: center !important;',
        'align-self: center !important;',
      ]),
    );
  });
});

describe('Flex Shortcuts with Media Queries', () => {
  it('md:fxrow-cc', () => {
    expect(convert('md:fxrow-cc')).toBe(
      mediaRules('@container (min-width: 768px)', '.md\\:fxrow-cc', [
        'display: flex;',
        'flex-direction: row;',
        'justify-content: center;',
        'align-items: center;',
      ]),
    );
  });

  it('@md:fxcol-cc (viewport)', () => {
    expect(convert('@md:fxcol-cc')).toBe(
      mediaRules('@media (min-width: 768px)', '.\\@md\\:fxcol-cc', [
        'display: flex;',
        'flex-direction: column;',
        'justify-content: center;',
        'align-items: center;',
      ]),
    );
  });
});

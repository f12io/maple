import { describe, expect, it } from 'vitest';
import { convert } from './helpers/convert.helper';

describe('Flex Row Shortcuts', () => {
  it('fxrow-cc (center-center)', () => {
    expect(convert('fxrow-cc')).toBe(
      [
        '.fxrow-cc { display: flex; }',
        '.fxrow-cc { flex-direction: row; }',
        '.fxrow-cc { justify-content: center; }',
        '.fxrow-cc { align-items: center; }',
      ].join(' '),
    );
  });

  it('fxrow-ss (top-left)', () => {
    expect(convert('fxrow-ss')).toBe(
      [
        '.fxrow-ss { display: flex; }',
        '.fxrow-ss { flex-direction: row; }',
        '.fxrow-ss { justify-content: flex-start; }',
        '.fxrow-ss { align-items: flex-start; }',
      ].join(' '),
    );
  });

  it('fxrow-ee (bottom-right)', () => {
    expect(convert('fxrow-ee')).toBe(
      [
        '.fxrow-ee { display: flex; }',
        '.fxrow-ee { flex-direction: row; }',
        '.fxrow-ee { justify-content: flex-end; }',
        '.fxrow-ee { align-items: flex-end; }',
      ].join(' '),
    );
  });

  it('fxrow-cw (center-between)', () => {
    expect(convert('fxrow-cw')).toBe(
      [
        '.fxrow-cw { display: flex; }',
        '.fxrow-cw { flex-direction: row; }',
        '.fxrow-cw { justify-content: space-between; }',
        '.fxrow-cw { align-items: center; }',
      ].join(' '),
    );
  });

  it('fxrow-hs (stretch-left)', () => {
    expect(convert('fxrow-hs')).toBe(
      [
        '.fxrow-hs { display: flex; }',
        '.fxrow-hs { flex-direction: row; }',
        '.fxrow-hs { justify-content: flex-start; }',
        '.fxrow-hs { align-items: stretch; }',
      ].join(' '),
    );
  });

  it('fxrow-cc with important', () => {
    expect(convert('!fxrow-cc')).toBe(
      [
        '.\\!fxrow-cc { display: flex !important; }',
        '.\\!fxrow-cc { flex-direction: row !important; }',
        '.\\!fxrow-cc { justify-content: center !important; }',
        '.\\!fxrow-cc { align-items: center !important; }',
      ].join(' '),
    );
  });
});

describe('Flex Column Shortcuts', () => {
  it('fxcol-cc (center-center)', () => {
    expect(convert('fxcol-cc')).toBe(
      [
        '.fxcol-cc { display: flex; }',
        '.fxcol-cc { flex-direction: column; }',
        '.fxcol-cc { justify-content: center; }',
        '.fxcol-cc { align-items: center; }',
      ].join(' '),
    );
  });

  it('fxcol-ss (top-left)', () => {
    expect(convert('fxcol-ss')).toBe(
      [
        '.fxcol-ss { display: flex; }',
        '.fxcol-ss { flex-direction: column; }',
        '.fxcol-ss { justify-content: flex-start; }',
        '.fxcol-ss { align-items: flex-start; }',
      ].join(' '),
    );
  });

  it('fxcol-ee (bottom-right)', () => {
    expect(convert('fxcol-ee')).toBe(
      [
        '.fxcol-ee { display: flex; }',
        '.fxcol-ee { flex-direction: column; }',
        '.fxcol-ee { justify-content: flex-end; }',
        '.fxcol-ee { align-items: flex-end; }',
      ].join(' '),
    );
  });

  it('fxcol-wc (between-center)', () => {
    expect(convert('fxcol-wc')).toBe(
      [
        '.fxcol-wc { display: flex; }',
        '.fxcol-wc { flex-direction: column; }',
        '.fxcol-wc { justify-content: space-between; }',
        '.fxcol-wc { align-items: center; }',
      ].join(' '),
    );
  });

  it('fxcol-cc with important', () => {
    expect(convert('!fxcol-cc')).toBe(
      [
        '.\\!fxcol-cc { display: flex !important; }',
        '.\\!fxcol-cc { flex-direction: column !important; }',
        '.\\!fxcol-cc { justify-content: center !important; }',
        '.\\!fxcol-cc { align-items: center !important; }',
      ].join(' '),
    );
  });
});

describe('Inline Flex Shortcuts', () => {
  it('ifxrow-cc', () => {
    expect(convert('ifxrow-cc')).toBe(
      [
        '.ifxrow-cc { display: inline-flex; }',
        '.ifxrow-cc { flex-direction: row; }',
        '.ifxrow-cc { justify-content: center; }',
        '.ifxrow-cc { align-items: center; }',
      ].join(' '),
    );
  });

  it('ifxcol-cc', () => {
    expect(convert('ifxcol-cc')).toBe(
      [
        '.ifxcol-cc { display: inline-flex; }',
        '.ifxcol-cc { flex-direction: column; }',
        '.ifxcol-cc { justify-content: center; }',
        '.ifxcol-cc { align-items: center; }',
      ].join(' '),
    );
  });
});

describe('Flex Self Shortcuts', () => {
  it('fxrowself-cc (center-center)', () => {
    expect(convert('fxrowself-cc')).toBe(
      [
        '.fxrowself-cc { justify-self: center; }',
        '.fxrowself-cc { align-self: center; }',
      ].join(' '),
    );
  });

  it('fxrowself-ss (top-left)', () => {
    expect(convert('fxrowself-ss')).toBe(
      [
        '.fxrowself-ss { justify-self: flex-start; }',
        '.fxrowself-ss { align-self: flex-start; }',
      ].join(' '),
    );
  });

  it('fxrowself-ee (bottom-right)', () => {
    expect(convert('fxrowself-ee')).toBe(
      [
        '.fxrowself-ee { justify-self: flex-end; }',
        '.fxrowself-ee { align-self: flex-end; }',
      ].join(' '),
    );
  });

  it('fxcolself-cc (center-center)', () => {
    expect(convert('fxcolself-cc')).toBe(
      [
        '.fxcolself-cc { justify-self: center; }',
        '.fxcolself-cc { align-self: center; }',
      ].join(' '),
    );
  });

  it('fxcolself-ss (top-left)', () => {
    expect(convert('fxcolself-ss')).toBe(
      [
        '.fxcolself-ss { justify-self: flex-start; }',
        '.fxcolself-ss { align-self: flex-start; }',
      ].join(' '),
    );
  });

  it('fxrowself-cc with important', () => {
    expect(convert('!fxrowself-cc')).toBe(
      [
        '.\\!fxrowself-cc { justify-self: center !important; }',
        '.\\!fxrowself-cc { align-self: center !important; }',
      ].join(' '),
    );
  });
});

describe('Flex Shortcuts with Media Queries', () => {
  it('md:fxrow-cc', () => {
    expect(convert('md:fxrow-cc')).toBe(
      [
        '@container (min-width: 768px) { .md\\:fxrow-cc { display: flex; } }',
        '@container (min-width: 768px) { .md\\:fxrow-cc { flex-direction: row; } }',
        '@container (min-width: 768px) { .md\\:fxrow-cc { justify-content: center; } }',
        '@container (min-width: 768px) { .md\\:fxrow-cc { align-items: center; } }',
      ].join(' '),
    );
  });

  it('@md:fxcol-cc (viewport)', () => {
    expect(convert('@md:fxcol-cc')).toBe(
      [
        '@media (min-width: 768px) { .\\@md\\:fxcol-cc { display: flex; } }',
        '@media (min-width: 768px) { .\\@md\\:fxcol-cc { flex-direction: column; } }',
        '@media (min-width: 768px) { .\\@md\\:fxcol-cc { justify-content: center; } }',
        '@media (min-width: 768px) { .\\@md\\:fxcol-cc { align-items: center; } }',
      ].join(' '),
    );
  });
});

import { describe, expect, it } from 'vitest';
import { convertWithCache } from './helpers/convert.helper';

describe('Ref Variables', () => {
  it('ref space with single value', () => {
    expect(convertWithCache('p-2')).toBe('.p-2 { padding: var(--ref-p-2); }');
  });

  it('ref space with two values', () => {
    expect(convertWithCache('p-2_4')).toBe(
      '.p-2_4 { padding: var(--ref-p-2) var(--ref-p-4); }',
    );
  });

  it('ref space with one predefined one custom value', () => {
    expect(convertWithCache('p-2_2px')).toBe(
      '.p-2_2px { padding: var(--ref-p-2) 2px; }',
    );
  });

  it('ref color', () => {
    expect(convertWithCache('bg-red')).toBe(
      '.bg-red { background: var(--ref-bgc-red); }',
    );
  });

  it('ref color with shade and alpha', () => {
    expect(convertWithCache('c-red-400/50')).toBe(
      '.c-red-400\\/50 { color: var(--ref-c-red-400\\/50); }',
    );
  });

  it('ref for predefined variables', () => {
    expect(convertWithCache('bgimg-logo')).toBe(
      '.bgimg-logo { background-image: var(--ref-bgimg-logo); }',
    );
  });
});

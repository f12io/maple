import { describe, expect, it } from 'vitest';
import { convert } from '../src/core/helpers/convert.helper';

describe('Invalid', () => {
  it('drops invalid utility classes that are not known modifiers', () => {
    // invalid-example should be dropped
    expect(convert('invalid-example')).toBeUndefined();
  });

  it('allows explicit assignment of unknown CSS properties', () => {
    // invalid=10 -> invalid: 10
    expect(convert('invalid=10')).toBe('.invalid\\=10 { invalid: 10; }');
  });

  it('allows custom modifiers that do not map to known CSS properties', () => {
    // square is a custom modifier that expands to width and height
    expect(convert('square-10px')).toBe(
      '.square-10px { width: 10px;height: 10px; }',
    );
  });
});

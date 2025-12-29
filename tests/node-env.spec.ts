import { describe, it, expect } from 'vitest';
import { loadPrecalculatedProperties } from '../src/engines/maple/property-extraction';

describe('Maple Node.js Environment (SSR)', () => {
  it('should load pre-calculated properties in non-browser environment', async () => {
    const props = await loadPrecalculatedProperties();

    expect(props).toBeDefined();
    expect(props).not.toBeNull();

    expect(props?.shortMap).toBeDefined();
    expect(props?.utilityMap).toBeDefined();

    const shortMap = props!.shortMap;
    const utilityMap = props!.utilityMap;

    const bgKey = shortMap['bg'];
    expect(bgKey).toBeDefined();
    expect(utilityMap[bgKey].rel).toBe('c'); // 'c' for color

    const pKey = shortMap['p'];
    expect(pKey).toBeDefined();
    expect(utilityMap[pKey].rel).toBe('d'); // 'd' for dimension
  });
});

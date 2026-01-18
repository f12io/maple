import { copyFile } from 'fs/promises';
import { resolve } from 'path';

export function prepareExamples() {
  return {
    name: 'prepare-examples',
    closeBundle: async () => {
      try {
        const src = resolve(process.cwd(), 'dist/maple.js');
        const dest = resolve(process.cwd(), 'examples/maple.js');
        await copyFile(src, dest);
      } catch (e) {
        console.error(`[prepare-examples] Failed to copy file:`, e);
      }
    },
  };
}

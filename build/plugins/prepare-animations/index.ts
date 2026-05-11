import { copyFile } from 'fs/promises';
import { resolve } from 'path';

export function prepareAnimations() {
  return {
    name: 'prepare-animations',
    closeBundle: async () => {
      try {
        const src = resolve(process.cwd(), 'src/animations.css');
        const dest1 = resolve(process.cwd(), 'dist/animations.css');
        const dest2 = resolve(process.cwd(), 'examples/animations.css');
        await copyFile(src, dest1);
        await copyFile(src, dest2);
      } catch (e) {
        console.error(`[prepare-animations] Failed to copy file:`, e);
      }
    },
  };
}

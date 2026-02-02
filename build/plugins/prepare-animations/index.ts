import { copyFile } from 'fs/promises';
import { resolve } from 'path';

export function prepareAnimations() {
  return {
    name: 'prepare-animations',
    closeBundle: async () => {
      try {
        const src = resolve(process.cwd(), 'src/animations.css');
        const dest = resolve(process.cwd(), 'dist/animations.css');
        await copyFile(src, dest);
      } catch (e) {
        console.error(`[prepare-animations] Failed to copy file:`, e);
      }
    },
  };
}

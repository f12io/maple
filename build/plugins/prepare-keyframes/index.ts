import { copyFile } from 'fs/promises';
import { resolve } from 'path';

export function prepareKeyframes() {
  return {
    name: 'prepare-keyframes',
    closeBundle: async () => {
      try {
        const src = resolve(process.cwd(), 'src/keyframes.css');
        const dest1 = resolve(process.cwd(), 'dist/keyframes.css');
        const dest2 = resolve(process.cwd(), 'examples/keyframes.css');
        await copyFile(src, dest1);
        await copyFile(src, dest2);
      } catch (e) {
        console.error(`[prepare-keyframes] Failed to copy file:`, e);
      }
    },
  };
}

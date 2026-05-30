import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { transform } from 'esbuild';

export function prepareKeyframes() {
  return {
    name: 'prepare-keyframes',
    closeBundle: async () => {
      try {
        const src = resolve(process.cwd(), 'src/keyframes.css');
        const dest1 = resolve(process.cwd(), 'dist/keyframes.css');
        const dest2 = resolve(process.cwd(), 'examples/keyframes.css');
        
        const cssContent = await readFile(src, 'utf-8');
        const result = await transform(cssContent, {
          loader: 'css',
          minify: true,
        });

        await writeFile(dest1, result.code);
        await writeFile(dest2, result.code);
      } catch (e) {
        console.error(`[prepare-keyframes] Failed to process file:`, e);
      }
    },
  };
}

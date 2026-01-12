import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function copyDtsToDcts(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      copyDtsToDcts(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.d.ts')) {
      const dctsPath = fullPath.replace(/\.d\.ts$/, '.d.cts');
      fs.copyFileSync(fullPath, dctsPath);
    }
  }
}

const typesDir = path.resolve(__dirname, '../dist/module/types');

if (fs.existsSync(typesDir)) {
  copyDtsToDcts(typesDir);
  console.log('✅ .d.cts files created successfully.');
} else {
  console.warn('⚠️ Types directory not found, skipping .d.cts generation.');
}

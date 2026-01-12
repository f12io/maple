import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function writeFile(content: string, fileName: string) {
  const outFile = path.resolve(
    __dirname,
    `../../../src/generated/${fileName}.ts`,
  );

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, content);
}

export function prepareContent(content: string) {
  return `// ⚠️ AUTO-GENERATED — DO NOT EDIT
${content}`;
}

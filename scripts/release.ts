import { spawnSync } from 'node:child_process';

function run(command: string, args: Array<string>) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const versionArgs = process.argv.slice(2);

if (versionArgs.length === 0) {
  console.error('Usage: npm run release -- <version | major | minor | patch>');
  process.exit(1);
}

run('npm', ['version', ...versionArgs]);
run('git', ['push', 'origin', 'main', '--follow-tags']);

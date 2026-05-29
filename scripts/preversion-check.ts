import { execFileSync } from 'node:child_process';

function git(args: Array<string>, options: { stdio?: 'pipe' | 'ignore' } = {}) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', options.stdio ?? 'pipe', 'pipe'],
  }).trim();
}

function fail(message: string): never {
  console.error(`preversion check failed: ${message}`);
  process.exit(1);
}

const branch = git(['branch', '--show-current']);

if (branch !== 'main') {
  fail(
    `releases must be cut from main, but current branch is ${branch || 'detached HEAD'}`,
  );
}

const status = git(['status', '--porcelain']);

if (status) {
  fail('working tree must be clean before running npm version');
}

try {
  git(['fetch', 'origin', 'main'], { stdio: 'ignore' });
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  fail(`could not fetch origin/main: ${message}`);
}

const head = git(['rev-parse', 'HEAD']);
const originMain = git(['rev-parse', 'origin/main']);

if (head !== originMain) {
  fail('local main must match origin/main before running npm version');
}

console.log('preversion check passed');

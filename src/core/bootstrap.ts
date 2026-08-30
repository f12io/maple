import { OPTIONS } from './constants/config';
import { startObserver } from './observer';

export function startRuntime() {
  if (OPTIONS.debug) {
    console.info('[maple] debug mode on with options:', OPTIONS);
  }

  return startObserver();
}

export function prepareOptions() {
  const url = new URL(import.meta.url);

  for (const [key, value] of url.searchParams.entries()) {
    if (
      key === 'refs' ||
      key === 'nomerge' ||
      key === 'batching' ||
      key === 'nohybrid' ||
      key === 'important' ||
      key === 'debug'
    ) {
      OPTIONS[key] = 1;
      continue;
    }

    OPTIONS.breakpoints[key] = value;
  }
}

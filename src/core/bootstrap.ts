import { OPTIONS } from './constants/config';
import { startObserver } from './observer';

export function startRuntime() {
  prepareOptions();
  return startObserver();
}

function prepareOptions() {
  const url = new URL(import.meta.url);
  const config = Array.from(url.searchParams.entries());

  for (const [key, value] of config) {
    if (key === 'refs') {
      OPTIONS.refs = 1;
    }

    OPTIONS.breakpoints[key] = value;
  }
}

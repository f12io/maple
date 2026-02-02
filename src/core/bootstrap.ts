import { OPTIONS } from './constants/config';
import { startObserver } from './observer';

export function startRuntime() {
  prepareOptions();
  return startObserver();
}

function prepareOptions() {
  const url = new URL(import.meta.url);

  for (const [key, value] of url.searchParams.entries()) {
    if (key === 'refs') {
      OPTIONS.refs = 1;
    }

    OPTIONS.breakpoints[key] = value;
  }
}

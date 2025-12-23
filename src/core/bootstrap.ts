import { registerMaple } from '../engines/maple';
import { startObserver } from './observer';
import { init } from './stylesheet';

export function startRuntime() {
  init();
  registerMaple();
  return startObserver();
}

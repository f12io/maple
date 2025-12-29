import { stateVariant } from './selectors/state';
import { ariaVariant } from './selectors/aria';
import { dataVariant } from './selectors/data';
import { rtlVariant } from './selectors/rtl';
import { motionVariant } from './selectors/motion';
import { registerVariant } from '../../core/registry';
import { darkMode } from './selectors/dark';
import { containerVariant } from './selectors/container';
import { Variant } from '../../core/types';
import { getBreakpoints } from '../../helpers/breakpoint.helper';

// register built-in handlers (tree-shakable alternative: consumer registers only needed ones)
export function registerDefaultVariants() {
  // state pseudo-classes
  registerVariant('hover', stateVariant('hover'));
  registerVariant('focus', stateVariant('focus'));
  registerVariant('active', stateVariant('active'));
  registerVariant('visited', stateVariant('visited'));
  registerVariant('disabled', stateVariant('disabled'));
  registerVariant('checked', stateVariant('checked'));
  registerVariant('first', stateVariant('first'));
  registerVariant('last', stateVariant('last'));
  registerVariant('odd', stateVariant('odd'));
  registerVariant('even', stateVariant('even'));
  // dark
  registerVariant('dark', darkMode());
  registerVariant('aria', ariaVariant);
  registerVariant('data', dataVariant);
  registerVariant('rtl', rtlVariant);
  // motion
  registerVariant('motion-safe', motionVariant('safe'));
  registerVariant('motion-reduce', motionVariant('reduce'));
  // print
  registerVariant('print', (css: any) => ({
    wrap: `@media print { {{selector}} { ${Object.entries(css)
      .map(([k, v]) => `${k}: ${v};`)
      .join(' ')} } }`,
  }));
  registerVariant('container', containerVariant);
  // breakpoints (responsive)
  const breakpoints = getBreakpoints();
  for (const k of Object.keys(breakpoints)) {
    registerVariant(k, (css: any, cfg: any, variant?: Variant) => {
      if (!css) return false;
      return {
        bp: (variant as any)?.name || k,
        container: (variant as any)?.containerName,
        wrap: `{{selector}} { ${Object.entries(css)
          .map(([kk, v]) => `${kk}: ${v};`)
          .join(' ')} }`,
      };
    });
  }
  //custom breakpoints
  // min-width with arbitrary value
  registerVariant('min', (css: any, cfg: any, variant?: Variant) => {
    if (!css) return false;
    return {
      bp: '@min',
      container: (variant as any)?.containerName,
      mediaQuery: (variant as any)?.size,
      wrap: `{{selector}} { ${Object.entries(css)
        .map(([kk, v]) => `${kk}: ${v};`)
        .join(' ')} }`,
    };
  });
  //custom breakpoints
  // max-width with arbitrary value
  registerVariant('max', (css: any, cfg: any, variant?: Variant) => {
    if (!css) return false;
    return {
      bp: '@max',
      container: (variant as any)?.containerName,
      mediaQuery: (variant as any)?.size,
      wrap: `{{selector}} { ${Object.entries(css)
        .map(([kk, v]) => `${kk}: ${v};`)
        .join(' ')} }`,
    };
  });
}

import { Variant } from '../../../core/types';

export function dataVariant(css: any, cfg?: any, variantStr?: Variant) {
  if (!css) return false;
  if (!(variantStr as string) || !(variantStr as string).startsWith('data-['))
    return false;
  const inner = (variantStr as string).slice(5, -1);
  const [key, val] = inner.split('=');
  return {
    wrap: `[data-${key}="${val}"] {{selector}} { ${Object.entries(css)
      .map(([k, v]) => `${k}: ${v};`)
      .join(' ')} }`,
  };
}

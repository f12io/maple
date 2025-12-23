import { Variant } from '../../../core/types';

export function rtlVariant(css: any, cfg?: any, variantStr?: Variant) {
  if (!css) return false;
  if (variantStr === 'rtl')
    return {
      wrap: `[dir="rtl"] {{selector}} { ${Object.entries(css)
        .map(([k, v]) => `${k}: ${v};`)
        .join(' ')} }`,
    };
  if (variantStr === 'ltr')
    return {
      wrap: `[dir="ltr"] {{selector}} { ${Object.entries(css)
        .map(([k, v]) => `${k}: ${v};`)
        .join(' ')} }`,
    };
  return false;
}

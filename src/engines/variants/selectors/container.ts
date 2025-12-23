import { Variant } from '../../../core/types';

export const containerVariant = (css: any, cfg?: any, variant?: Variant) => {
  if (!css) return false;
  return {
    wrap: `@container ${
      (variant as Record<string, string>)?.containerName || ''
    } {{selector}} { ${Object.entries(css)
      .map(([k, v]) => `${k}: ${v};`)
      .join(' ')} }`,
  };
};

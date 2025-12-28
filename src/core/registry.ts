import type { Variant, VariantHandler } from './types';

const variantHandlers: Map<string, VariantHandler> = new Map();

export function registerVariant(
  name: string,
  h: (
    css: Record<string, string> | string,
    config?: any,
    variant?: Variant,
  ) => Record<string, any> | boolean,
) {
  variantHandlers.set(name, {
    name,
    apply: h,
  });
}

export function applyVariantChain(
  variants: Array<string | Record<string, string>>,
  cssObj: Record<string, string>,
  config: any,
) {
  let current: any = cssObj;

  for (const variant of variants) {
    const handler = variantHandlers.get(
      typeof variant === 'object' ? variant.name : variant,
    );
    if (!handler) continue;

    const result = handler.apply(current, config, variant);

    // Variant returned wrapper → replace current
    if (result && typeof result === 'object' && result.wrap) {
      current = { ...result };
    }
    // Variant transformed CSS → update CSS object
    else if (result && typeof result === 'object') {
      current = result;
    }
  }

  return current;
}

export type VariantMatcher = {
  pattern: RegExp;
  apply(groups: string[]): Record<string, string> | null;
};

export type VariantHandler = {
  name?: string;
  apply(
    css: Record<string, string> | string,
    config?: any,
    variant?: string | Record<string, string>,
  ): Record<string, any> | boolean | string;
};

export type Variant = string | Record<string, string>;

export type ParsedClass = {
  raw: string;
  variants: Variant[];
  parentSelector: string | null;
  childSelector: string | null;
  utility: string;
  important: boolean;
};

export type ParsedMediaQuery = {
  raw: string;
  min: number;
  max: number;
  type: 'min' | 'max' | 'other';
};

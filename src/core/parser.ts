// core/parser.ts

import { ParsedClass, Variant } from './types';

export function parseClass(input: string): ParsedClass | null {
  let raw = input.trim();
  let important = false;

  if (raw.endsWith('!')) {
    important = true;
    raw = raw.slice(0, -1);
  }

  let parentSelector: string | null = null;
  let childSelector: string | null = null;
  const variants: Variant[] = [];
  const lastColonIndex = input.lastIndexOf(':');
  let utilityPart = lastColonIndex !== -1 ? raw.slice(lastColonIndex + 1) : raw;
  let remainings = lastColonIndex !== -1 ? raw.slice(0, lastColonIndex) : '';
  // @TODO: .qwe:bg-blue-500 invalid syntax not generate styles
  // 1) detect parent selector
  if (utilityPart.startsWith('@container')) {
    utilityPart = `@container=${utilityPart.match(/\((.+)\)/)?.[1] || 'none'}`;
  }
  const parentMatch = remainings.match(/\^([^/]+)/);
  if (parentMatch) {
    parentSelector = parentMatch[1].replaceAll('>>', ' ').trim();
    remainings = remainings.replace(/\^[^/]+/, '');
  }
  const childMatch = remainings.match(/\/(.+)/);
  if (childMatch) {
    childSelector = `${childMatch[1]}`.trim().replaceAll('>>', ' ');
    remainings = remainings.replace(/\/.+/, '');
  }
  // 2) extract variants (one, for now)
  const splitted = remainings.split(':').filter(Boolean);
  if (splitted.length) {
    variants.push(
      ...splitted.map((variant) => {
        const canBeVariantContainer = variant.trim().startsWith('@');
        if (!canBeVariantContainer) {
          const customVariant = getCustomVariant(variant.trim());
          return customVariant || variant.trim();
        }
        variant = variant.replace('@', '');
        const containerName = variant.match(/\((.+)\)/)?.[1] || 'none';
        const name = variant.replace(/\(.+\)/, '');
        const customVariant = getCustomVariant(name);
        return {
          name,
          ...(customVariant || {}),
          containerName,
        };
      })
    );
  }
  return {
    raw,
    variants,
    parentSelector,
    childSelector,
    utility: utilityPart.replaceAll('_', ' ').trim(),
    important,
  };
}

const getCustomVariant = (variant: string): any | null => {
  const group = variant.match(/(min|max)[-=](.+)/);
  if (!group?.[1]) {
    return null;
  }
  return {
    name: group[1],
    size: group[2],
  };
};

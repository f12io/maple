import { mapleMatcher } from '../engines/maple/matcher';
import { parseClass } from './parser';
import { applyVariantChain } from './registry';
import { insert, hasCache, setCache } from './stylesheet';

export function generateForClass(rawClass: string, config: any = {}) {
  if (hasCache(rawClass)) {
    return null;
  }
  const parsed = parseClass(rawClass);
  if (!parsed) return null;
  // base rule
  let baseCss = mapleMatcher(parsed.utility);
  if (!baseCss) return null;

  // apply variants
  const resolved = applyVariantChain(parsed.variants, baseCss, config);

  const escaped = mapleEscape(rawClass);
  const classSelector = `.${escaped}`;
  // serialize base css
  const body =
    typeof resolved === 'object' && !resolved.wrap
      ? Object.entries(resolved)
          .map(
            ([k, v]) => `${k}: ${v}${parsed.important ? ' !important' : ''};`
          )
          .join(' ')
      : '';

  if (typeof resolved === 'object' && resolved.wrap) {
    const wrapped = resolved.wrap
      .replace(
        '{{selector}}',
        parsed.parentSelector
          ? `${parsed.parentSelector} ${classSelector}`
          : classSelector
      )
      .replace('{{childSelector}}', parsed.childSelector || '');
    const importantWrapped = parsed.important
      ? wrapped.replace(/;/g, ' !important;')
      : wrapped;
    insert(importantWrapped, resolved);
    setCache(rawClass);
    return rawClass;
  }

  // 3) normal rule
  const classSelctorWithChild = parsed.childSelector
    ? `${classSelector} ${parsed.childSelector}`
    : classSelector;
  insert(
    `${
      parsed.parentSelector ? parsed.parentSelector + ' ' : ''
    }${classSelctorWithChild} { ${body} }`
  );
  setCache(rawClass);
  return rawClass;
}

function mapleEscape(cls: string) {
  return typeof CSS !== 'undefined' && (CSS as any).escape
    ? (CSS as any).escape(cls).replace(/\s/g, '')
    : cls.replace(/([^a-zA-Z0-9_-])/g, '\\$1');
}

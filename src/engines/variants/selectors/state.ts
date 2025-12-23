import { ParsedClass } from '../../../core/types';

export function stateVariant(which: string) {
  const map: any = {
    hover: ':hover',
    focus: ':focus',
    active: ':active',
    visited: ':visited',
    disabled: ':disabled',
    checked: ':checked',
    first: ':first-child',
    last: ':last-child',
    odd: ':nth-child(odd)',
    even: ':nth-child(even)',
  };
  const sel = map[which];
  return (css: any, config: ParsedClass) => ({
    wrap: `{{selector}}${sel} {{childSelector}} { ${Object.entries(css)
      .map(([k, v]) => `${k}: ${v};`)
      .join(' ')} }`,
  });
}

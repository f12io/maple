import { escapeClass } from 'internal:escape-class';
import {
  CHAR_CLOSE_BRACKET,
  CHAR_DASH,
  CHAR_OPEN_BRACKET,
  REGEX_LOWERCASE_UPPERCASE,
} from '../constants';

export function toKebabCase(str: string | undefined) {
  return str?.replace(REGEX_LOWERCASE_UPPERCASE, '$1-$2').toLowerCase() ?? '';
}

export function toCamelCase(str: string | undefined) {
  return (
    str
      ?.toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr: string) =>
        chr.toUpperCase(),
      ) ?? ''
  );
}

export function escapeVariable(str: string) {
  return escapeClass(`--${str}`).replace('--', '');
}

export function startsWithNegative(value: string): boolean {
  return value.charCodeAt(0) === CHAR_DASH;
}

export function removeBrackets(value: string) {
  if (
    value.charCodeAt(0) === CHAR_OPEN_BRACKET &&
    value.charCodeAt(value.length - 1) === CHAR_CLOSE_BRACKET
  ) {
    value = value.slice(1).slice(0, -1);
  }
  return value;
}

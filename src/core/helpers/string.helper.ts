import { escapeClass } from 'internal:escape-class';
import {
  CHAR_CLOSE_BRACKET,
  CHAR_CLOSE_PAREN,
  CHAR_DASH,
  CHAR_DOUBLE_QUOTE,
  CHAR_OPEN_BRACKET,
  CHAR_OPEN_PAREN,
  CHAR_SINGLE_QUOTE,
  REGEX_LOWERCASE_UPPERCASE,
} from '../constants';

export function split(source: string, separator: string): Array<string> {
  const sepCode = separator.charCodeAt(0);
  const result: Array<string> = [];
  let depth = 0;
  let quote = 0;
  let lastIndex = source.length;
  let i = source.length;

  while (i--) {
    const code = source.charCodeAt(i);

    if (code === CHAR_SINGLE_QUOTE || code === CHAR_DOUBLE_QUOTE) {
      if (quote === code) {
        quote = 0;
      } else if (quote === 0) {
        quote = code;
      }
    } else if (quote === 0) {
      if (code === CHAR_CLOSE_PAREN || code === CHAR_CLOSE_BRACKET) {
        depth++;
      } else if (code === CHAR_OPEN_PAREN || code === CHAR_OPEN_BRACKET) {
        depth--;
      } else if (depth === 0 && code === sepCode) {
        result.unshift(source.slice(i + 1, lastIndex));
        lastIndex = i;
      }
    }
  }

  result.unshift(source.slice(0, lastIndex));

  return result;
}

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

export function splitAtFirstOccurrence(
  str: string,
  char: string,
): Array<string> {
  const index = str.indexOf(char);

  if (index === -1) {
    return [str];
  }

  return [str.slice(0, index), str.slice(index + 1)];
}

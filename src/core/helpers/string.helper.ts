import { escapeClass } from 'internal:escape-class';
import {
  CHAR_CLOSE_BRACKET,
  CHAR_CLOSE_PAREN,
  CHAR_DASH,
  CHAR_DOUBLE_QUOTE,
  CHAR_OPEN_BRACKET,
  CHAR_OPEN_PAREN,
  CHAR_SINGLE_QUOTE,
} from '../constants/chars';
import {
  REGEX_LOWERCASE_UPPERCASE,
  REGEX_TO_CAMEL_CASE,
} from '../constants/regex';

export function split(source: string, separator: string): Array<string> {
  const sepCode = separator.charCodeAt(0);
  const result: Array<string> = [];
  const len = source.length;

  let depth = 0;
  let quote = 0;
  let lastIndex = len;
  let i = len;

  while (i--) {
    const code = source.charCodeAt(i);

    // If we are inside a quote, we ONLY care about finding the matching quote.
    // We can skip all bracket and separator checks.
    if (quote !== 0) {
      if (code === quote) {
        quote = 0;
      }
      continue;
    }

    // If we are NOT inside a quote, check for structure.
    if (code === CHAR_SINGLE_QUOTE || code === CHAR_DOUBLE_QUOTE) {
      quote = code;
    } else if (code === CHAR_CLOSE_PAREN || code === CHAR_CLOSE_BRACKET) {
      depth++;
    } else if (code === CHAR_OPEN_PAREN || code === CHAR_OPEN_BRACKET) {
      depth--;
    } else if (depth === 0 && code === sepCode) {
      // We capture the segment to the right of the current separator
      result.push(source.slice(i + 1, lastIndex));
      lastIndex = i;
    }
  }

  // Push the final segment (the start of the string)
  result.push(source.slice(0, lastIndex));

  // Restore the correct order
  return result.reverse();
}

export function toKebabCase(str: string | undefined) {
  return str?.replace(REGEX_LOWERCASE_UPPERCASE, '$1-$2').toLowerCase() ?? '';
}

export function toCamelCase(str: string | undefined) {
  return (
    str
      ?.toLowerCase()
      .replace(REGEX_TO_CAMEL_CASE, (match, chr: string) =>
        chr.toUpperCase(),
      ) ?? ''
  );
}

export function escapeVariable(str: string) {
  return escapeClass(`--${str}`).replace('--', '');
}

export function startsWithNegative(value: string): 1 | 0 {
  return value.charCodeAt(0) === CHAR_DASH ? 1 : 0;
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

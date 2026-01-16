import { escapeClass } from 'internal:escape-class';
import { SELECTOR_CACHE } from './constants/caches';
import {
  CHAR_AMPERSAND,
  CHAR_CARET,
  CHAR_CLOSE_BRACKET,
  CHAR_CLOSE_PAREN,
  CHAR_COLON,
  CHAR_DOUBLE_QUOTE,
  CHAR_OPEN_BRACKET,
  CHAR_OPEN_PAREN,
  CHAR_SINGLE_QUOTE,
  CHAR_SLASH,
  REF_CHAR_CUSTOM,
  REF_CHAR_IMPORTANT,
  REF_CHAR_PREDEFINED,
  REF_CHAR_SPACE,
  REF_CHAR_UTILITY_DELIMITER,
} from './constants/chars';
import { ABBREVIATIONS, ABBREVIATIONS_REVERSE } from './constants/dictionaries';
import { setCacheItem } from './helpers/cache.helper';
import { resolveType } from './helpers/property.helper';
import {
  escapeVariable,
  removeBrackets,
  split,
  splitAtFirstOccurrence,
  startsWithNegative,
  toKebabCase,
} from './helpers/string.helper';
import { serializeValue } from './serializer';
import { ParsedClass, ParsedSelector } from './types';

export function parseClass(sourceClass: string): ParsedClass {
  const originalClass = sourceClass;

  // Handle "Important" flag
  let isImportant = false;
  if (sourceClass.startsWith(REF_CHAR_IMPORTANT)) {
    isImportant = true;
    sourceClass = sourceClass.slice(1);
  }

  const parts = split(sourceClass, REF_CHAR_UTILITY_DELIMITER);
  let contextRaw = '';
  let utilityRaw = '';

  if (parts.length > 1) {
    utilityRaw = parts.pop() ?? '';
    contextRaw = parts.join(REF_CHAR_UTILITY_DELIMITER);
  } else {
    utilityRaw = parts[0];
  }

  const parsed: ParsedClass = {
    ...parseSelectors(contextRaw),
    ...parseUtility(utilityRaw),
    sourceClass: originalClass,
    sourceSelector: '.' + escapeClass(originalClass),
    isImportant,
  };

  return parsed;
}

function parseUtility(utilityRaw: string): {
  utilityKey: string;
  utilityValue: string;
  utilityOperator: ParsedClass['utilityOperator'];
  isUtilityNegative: boolean;
  propKeyCamel: string;
  propKeyKebab: string;
  propType: number;
  propValue: string;
  validVariableValue: string;
} {
  let utilityKey = utilityRaw;
  let utilityValue = '';
  let utilityOperator: ParsedClass['utilityOperator'] = REF_CHAR_CUSTOM;
  let isUtilityNegative = false;

  const parts = split(utilityRaw, REF_CHAR_CUSTOM);

  if (parts.length > 1) {
    utilityKey = parts.shift() ?? '';
    utilityValue = parts.join(REF_CHAR_CUSTOM);
    utilityValue = removeBrackets(utilityValue);
  } else {
    isUtilityNegative = startsWithNegative(utilityRaw);
    utilityRaw = isUtilityNegative ? utilityRaw.slice(1) : utilityRaw;

    const splitted = splitAtFirstOccurrence(utilityRaw, REF_CHAR_PREDEFINED);

    if (splitted.length === 2) {
      utilityKey = splitted[0];
      utilityValue = splitted[1];
      utilityOperator = REF_CHAR_PREDEFINED;
    }
  }

  let propKeyCamel = ABBREVIATIONS[utilityKey];

  if (!propKeyCamel) {
    const abbrFromCamel = ABBREVIATIONS_REVERSE[utilityKey] ?? utilityKey;

    utilityKey = abbrFromCamel;
    propKeyCamel = ABBREVIATIONS[abbrFromCamel] ?? utilityKey;
  }

  const propKeyKebab = toKebabCase(propKeyCamel);

  return {
    utilityKey,
    utilityValue,
    utilityOperator,
    isUtilityNegative,
    propKeyCamel,
    propKeyKebab,
    propType: resolveType(propKeyKebab, propKeyCamel),
    propValue: serializeValue(utilityValue),
    validVariableValue: escapeVariable(utilityValue),
  };
}

export function parseSelectors(contextRaw: string): ParsedSelector | undefined {
  if (SELECTOR_CACHE.has(contextRaw)) {
    return SELECTOR_CACHE.get(contextRaw);
  }

  let mediaQuery: string | undefined;
  let parentSelector: string | undefined;
  let selfSelector: string | undefined;
  let childSelector: string | undefined;

  if (!contextRaw) {
    return;
  }

  let depth = 0;
  let quote = 0;
  let lastAnchorIndex = 0;
  let lastAnchorType = 0;

  const len = contextRaw.length;

  for (let i = 0; i <= len; i++) {
    const code = i < len ? contextRaw.charCodeAt(i) : 0;

    // Handle Quotes (Skip all logic inside quotes)
    if (code === CHAR_SINGLE_QUOTE || code === CHAR_DOUBLE_QUOTE) {
      if (quote === 0) quote = code;
      else if (quote === code) quote = 0;
      continue;
    }

    if (quote !== 0) continue;

    // Handle Brackets
    if (code === CHAR_OPEN_BRACKET || code === CHAR_OPEN_PAREN) {
      depth++;
      continue;
    }
    if (code === CHAR_CLOSE_BRACKET || code === CHAR_CLOSE_PAREN) {
      depth--;
      continue;
    }

    // Handle Anchors (Only at root depth)
    if (depth === 0) {
      const isAnchor =
        code === CHAR_CARET ||
        code === CHAR_AMPERSAND ||
        code === CHAR_SLASH ||
        code === 0;

      if (isAnchor) {
        // --- FLUSH SEGMENT ---
        if (lastAnchorType === 0) {
          // Parse Media Query (0 to i)
          if (i > 0) {
            const endIndex =
              contextRaw.charCodeAt(i - 1) === CHAR_COLON ? i - 1 : i;

            if (endIndex > 0) {
              mediaQuery = contextRaw.slice(0, endIndex);
            }
          }
        } else {
          // Parse Selectors (start + 1 to i)
          const start = lastAnchorIndex + 1;

          // Only slice if there is actual content
          if (i > start) {
            // We only allocate the string slice exactly when needed for assignment
            const value = contextRaw
              .slice(start, i)
              .replaceAll(REF_CHAR_SPACE, ' ');

            switch (lastAnchorType) {
              case CHAR_CARET:
                parentSelector = value;
                break;
              case CHAR_AMPERSAND:
                selfSelector = value;
                break;
              case CHAR_SLASH:
                childSelector = value;
                break;
            }
          }
        }

        // Update State
        lastAnchorType = code;
        lastAnchorIndex = i;
      }
    }
  }

  const parsedSelector: ParsedSelector = {
    mediaQuery,
    parentSelector,
    selfSelector,
    childSelector,
  };

  setCacheItem(SELECTOR_CACHE, contextRaw, parsedSelector);

  return parsedSelector;
}

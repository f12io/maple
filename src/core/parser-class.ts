import { escapeClass } from 'internal:escape-class';
import { SELECTOR_CACHE } from './constants/caches';
import {
  CHAR_AMPERSAND,
  CHAR_CARET,
  CHAR_CLOSE_BRACKET,
  CHAR_CLOSE_PAREN,
  CHAR_COLON,
  CHAR_DOLLAR,
  CHAR_DOUBLE_QUOTE,
  CHAR_EXCLAMATION_MARK,
  CHAR_OPEN_BRACKET,
  CHAR_OPEN_PAREN,
  CHAR_SINGLE_QUOTE,
  CHAR_SLASH,
  REF_CHAR_CUSTOM,
  REF_CHAR_PREDEFINED,
  REF_CHAR_SPACE,
  REF_CHAR_UTILITY_DELIMITER,
} from './constants/chars';
import { OPTIONS } from './constants/config';
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

export function parseClass(srcClass: string): ParsedClass {
  const originalClass = srcClass;

  // Handle "Important" flag
  let isImportant: 1 | 0 = 0;
  if (srcClass.charCodeAt(0) === CHAR_EXCLAMATION_MARK) {
    isImportant = 1;
    srcClass = srcClass.slice(1);
  }

  // Handle "No Ref" flag if refs are enabled
  let isNoRef: 1 | 0 = 1;
  if (OPTIONS.refs) {
    isNoRef = 0;

    if (srcClass.charCodeAt(0) === CHAR_DOLLAR) {
      isNoRef = 1;
      srcClass = srcClass.slice(1);
    }
  }

  const parts = split(srcClass, REF_CHAR_UTILITY_DELIMITER);
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
    srcClass: originalClass,
    srcSel: '.' + escapeClass(originalClass),
    isImportant,
    isNoRef,
  };

  return parsed;
}

function parseUtility(utilityRaw: string): {
  utilKey: string;
  utilVal: string;
  utilOp: ParsedClass['utilOp'];
  isUtilNegative: 1 | 0;
  propKeyCamel: string;
  propKeyKebab: string;
  propType: number;
  propVal: string;
  validVarVal: string;
} {
  let utilKey = utilityRaw;
  let utilVal = '';
  let utilOp: ParsedClass['utilOp'] = REF_CHAR_CUSTOM;
  let isUtilNegative: 1 | 0 = 0;

  const parts = split(utilityRaw, REF_CHAR_CUSTOM);

  if (parts.length > 1) {
    utilKey = parts.shift() ?? '';
    utilVal = parts.join(REF_CHAR_CUSTOM);
    utilVal = removeBrackets(utilVal);
  } else {
    isUtilNegative = startsWithNegative(utilityRaw);
    utilityRaw = isUtilNegative ? utilityRaw.slice(1) : utilityRaw;

    const splitted = splitAtFirstOccurrence(utilityRaw, REF_CHAR_PREDEFINED);

    if (splitted.length === 2) {
      utilKey = splitted[0];
      utilVal = splitted[1];
      utilOp = REF_CHAR_PREDEFINED;
    }
  }

  let propKeyCamel = ABBREVIATIONS[utilKey];

  if (!propKeyCamel) {
    const abbrFromCamel = ABBREVIATIONS_REVERSE[utilKey] ?? utilKey;

    utilKey = abbrFromCamel;
    propKeyCamel = ABBREVIATIONS[abbrFromCamel] ?? utilKey;
  }

  const propKeyKebab = escapeVariable(toKebabCase(propKeyCamel));

  return {
    utilKey,
    utilVal,
    utilOp,
    isUtilNegative,
    propKeyCamel,
    propKeyKebab,
    propType: resolveType(propKeyKebab, propKeyCamel),
    propVal: serializeValue(utilVal),
    validVarVal: escapeVariable(utilVal),
  };
}

export function parseSelectors(contextRaw: string): ParsedSelector | undefined {
  if (SELECTOR_CACHE.has(contextRaw)) {
    return SELECTOR_CACHE.get(contextRaw);
  }

  let mediaQuery: string | undefined;
  let parentSel: string | undefined;
  let selfSel: string | undefined;
  let childSel: string | undefined;

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

            if (lastAnchorType === CHAR_CARET) {
              parentSel = value;
            } else if (lastAnchorType === CHAR_AMPERSAND) {
              selfSel = value;
            } else if (lastAnchorType === CHAR_SLASH) {
              childSel = value;
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
    parentSel,
    selfSel,
    childSel,
  };

  setCacheItem(SELECTOR_CACHE, contextRaw, parsedSelector);

  return parsedSelector;
}

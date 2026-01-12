import { escapeClass } from 'internal:escape-class';
import { PRECALCULATED_PROP_ABBREVIATIONS } from '../generated/precalculated-prop-abbreviations';
import {
  CHAR_AMPERSAND,
  CHAR_CARET,
  CHAR_CLOSE_BRACKET,
  CHAR_CLOSE_PAREN,
  CHAR_COLON,
  CHAR_DOUBLE_QUOTE,
  CHAR_EQUAL,
  CHAR_OPEN_BRACKET,
  CHAR_OPEN_PAREN,
  CHAR_SINGLE_QUOTE,
  CHAR_SLASH,
  REF_CHAR_CUSTOM,
  REF_CHAR_IMPORTANT,
  REF_CHAR_PREDEFINED,
  REF_CHAR_SPACE,
  REF_CHAR_UTILITY_DELIMITER,
} from './constants';
import { resolveType } from './helpers/property.helper';
import {
  escapeVariable,
  removeBrackets,
  startsWithNegative,
  toKebabCase,
} from './helpers/string.helper';
import { serializeValue } from './serializer';
import { ParsedClass } from './types';

export const abbreviationMap: Record<string, string> =
  PRECALCULATED_PROP_ABBREVIATIONS;
export const abbreviationReverseMap: Record<string, string> = {};

Object.entries(PRECALCULATED_PROP_ABBREVIATIONS).forEach(([alias, prop]) => {
  abbreviationReverseMap[prop] = alias;
});

export function parseClass(sourceClass: string): ParsedClass {
  const originalClass = sourceClass;

  // Handle "Important" flag
  let isImportant = false;
  if (sourceClass.startsWith(REF_CHAR_IMPORTANT)) {
    isImportant = true;
    sourceClass = sourceClass.slice(1);
  }

  const { separatorIndex, assignmentIndex } =
    findUtilitySeparatorIndex(sourceClass);

  let contextRaw = '';
  let utilityRaw = sourceClass;

  if (separatorIndex !== -1) {
    contextRaw = sourceClass.slice(0, separatorIndex);
    utilityRaw = sourceClass.slice(separatorIndex + 1);
  }

  const parsed: ParsedClass = {
    ...parseSelectors(contextRaw),
    ...parseUtility({
      utilityRaw,
      separatorIndex,
      assignmentIndex,
    }),
    sourceClass: originalClass,
    sourceSelector: '.' + escapeClass(originalClass),
    isImportant,
  };

  return parsed;
}

function findUtilitySeparatorIndex(cls: string): {
  separatorIndex: number;
  assignmentIndex: number;
} {
  let depth = 0;
  let quote = 0;

  let separatorIndex = -1;
  let assignmentIndex = -1;

  let i = cls.length - 1;

  while (i >= 0) {
    const code = cls.charCodeAt(i);

    // Handle Quotes
    if (code === CHAR_SINGLE_QUOTE || code === CHAR_DOUBLE_QUOTE) {
      if (quote === 0) {
        quote = code;
      } else if (quote === code) {
        quote = 0;
      }

      i--;
      continue;
    }

    if (quote !== 0) {
      i--;
      continue;
    }

    // Handle Brackets
    if (code === CHAR_CLOSE_BRACKET || code === CHAR_CLOSE_PAREN) {
      depth++;
    } else if (code === CHAR_OPEN_BRACKET || code === CHAR_OPEN_PAREN) {
      depth--;
    }

    // Handle Context
    else if (depth === 0) {
      // Found the Separator?
      if (code === CHAR_COLON) {
        separatorIndex = i;
        // Any '=' found so far belongs to the Utility.
        // Any '=' found to the left belongs to the Context (we don't care).
        break;
      }

      // Found an Assignment?
      // We only care about the FIRST assignment we see from the right
      // (which corresponds to the key=value split).
      if (code === CHAR_EQUAL && assignmentIndex === -1) {
        assignmentIndex = i;
      }
    }

    i--;
  }

  return { separatorIndex, assignmentIndex };
}

function parseUtility({
  utilityRaw,
  separatorIndex,
  assignmentIndex,
}: {
  utilityRaw: string;
  separatorIndex: number;
  assignmentIndex: number;
}): {
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

  if (assignmentIndex === -1) {
    isUtilityNegative = startsWithNegative(utilityRaw);
    utilityRaw = isUtilityNegative ? utilityRaw.slice(1) : utilityRaw;

    const dashIndex = utilityRaw.indexOf(REF_CHAR_PREDEFINED);

    if (dashIndex !== -1) {
      utilityKey = utilityRaw.slice(0, dashIndex);
      utilityValue = utilityRaw.slice(dashIndex + 1);
      utilityOperator = REF_CHAR_PREDEFINED;
    }
  } else {
    // We have an exact split point for '='
    const relativeIndex = assignmentIndex - (separatorIndex + 1);
    utilityKey = utilityRaw.slice(0, relativeIndex);
    utilityValue = utilityRaw.slice(relativeIndex + 1);
  }

  utilityValue = removeBrackets(utilityValue);

  let propKeyCamel = abbreviationMap[utilityKey];

  if (!propKeyCamel) {
    const abbrFromCamel = abbreviationReverseMap[utilityKey] ?? utilityKey;

    utilityKey = abbrFromCamel;
    propKeyCamel = abbreviationMap[abbrFromCamel] ?? utilityKey;
  }

  const propKeyKebab = toKebabCase(propKeyCamel);
  const propType = resolveType(propKeyKebab, propKeyCamel);
  const propValue = serializeValue(utilityValue);
  const validVariableValue = escapeVariable(utilityValue);

  return {
    utilityKey,
    utilityValue,
    utilityOperator,
    isUtilityNegative,
    propKeyCamel,
    propKeyKebab,
    propType,
    propValue,
    validVariableValue,
  };
}

function parseSelectors(contextRaw: string): {
  mediaQuery?: string;
  parentSelector?: string;
  selfSelector?: string;
  childSelector?: string;
} {
  let mediaQuery: string | undefined;
  let parentSelector: string | undefined;
  let selfSelector: string | undefined;
  let childSelector: string | undefined;

  if (contextRaw) {
    let depth = 0;
    let quote = 0;
    let lastAnchorIndex = 0;
    let lastAnchorType: string | null = null;

    // If the string starts with ^, &, /, then breakpoint stays null/empty

    // Scan Left to Right
    for (let i = 0; i <= contextRaw.length; i++) {
      // Logic: We iterate up to length (inclusive) to handle the final flush
      const code = i < contextRaw.length ? contextRaw.charCodeAt(i) : NaN;

      // Handle Quotes
      if (code === CHAR_SINGLE_QUOTE || code === CHAR_DOUBLE_QUOTE) {
        if (quote === 0) {
          quote = code;
        } else if (quote === code) {
          quote = 0;
        }

        continue;
      }

      if (quote !== 0) continue;

      // Handle Brackets
      if (code === CHAR_OPEN_BRACKET || code === CHAR_OPEN_PAREN) {
        depth++;
      } else if (code === CHAR_CLOSE_BRACKET || code === CHAR_CLOSE_PAREN) {
        depth--;
      }

      // Handle Anchors
      const isAnchor =
        depth === 0 &&
        (code === CHAR_CARET || code === CHAR_AMPERSAND || code === CHAR_SLASH);

      if (isAnchor || Number.isNaN(code)) {
        // FLUSH PREVIOUS SEGMENT
        const segment = contextRaw.slice(lastAnchorIndex, i);

        if (lastAnchorType === null) {
          // Everything before the first anchor is the Breakpoint
          // e.g. "md:^..." -> segment="md:" -> trim colon
          if (segment.length > 0) {
            mediaQuery = segment.endsWith(REF_CHAR_UTILITY_DELIMITER)
              ? segment.slice(0, -1)
              : segment;
          }
        } else {
          const value = segment.slice(1).replaceAll(REF_CHAR_SPACE, ' ');
          const charCode = lastAnchorType.charCodeAt(0);

          if (charCode === CHAR_CARET) {
            parentSelector = value;
          } else if (charCode === CHAR_AMPERSAND) {
            selfSelector = value;
          } else if (charCode === CHAR_SLASH) {
            childSelector = value;
          }
        }

        // SET UP NEXT SEGMENT
        if (!Number.isNaN(code)) {
          lastAnchorType = String.fromCharCode(code);
          lastAnchorIndex = i; // The next segment starts HERE (including the anchor)
        }
      }
    }
  }

  return {
    mediaQuery,
    parentSelector,
    selfSelector,
    childSelector,
  };
}

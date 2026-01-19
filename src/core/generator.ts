import { CLASS_CACHE } from './constants/caches';
import {
  REF_CHAR_CUSTOM,
  REF_CHAR_SPACE,
  REF_CHAR_VALUE_PARTS,
} from './constants/chars';
import { SHORTCUTS } from './constants/dictionaries';
import { escapeVariable, split } from './helpers/string.helper';
import { parseClass } from './parser-class';
import { parseMediaQuery } from './parser-media-query';
import {
  applyModifier,
  PART_MODIFIERS,
  serializeProp,
  serializeSelector,
  TYPE_MODIFIERS,
  VALUE_MODIFIERS,
} from './serializer';
import { insert } from './stylesheet';
import { ParsedClass, ParsedMediaQuery } from './types';

export function generateStylesFromClass(srcClass: string): void {
  /**
   * The class cache should leave as long as the
   * application is running. This will prevent the
   * same class from being parsed and inserted multiple times.
   */
  if (CLASS_CACHE.has(srcClass)) return;

  CLASS_CACHE.add(srcClass);

  try {
    const result = buildRule(srcClass);

    if (result) {
      insert(result.rule, result.parsedMediaQuery);
    }
  } catch (error) {
    console.error(error);
  }
}

export function buildRule(
  srcClass: string,
):
  | { rule: string; parsedMediaQuery: ParsedMediaQuery | undefined }
  | undefined {
  const parsed = parseClass(srcClass);
  const styles = buildProp(parsed);

  if (!styles) return;

  const selector = buildSelector(parsed);

  if (!selector) return;

  const parsedMediaQuery = parseMediaQuery(parsed);
  const block = `${selector} { ${styles} }`;
  const rule = parsedMediaQuery
    ? `${parsedMediaQuery.prefix}${block} ${parsedMediaQuery.suffix}`.trim()
    : block;

  return { rule, parsedMediaQuery };
}

function buildProp(parsed: ParsedClass) {
  const { utilKey } = parsed;

  if (!utilKey) {
    return;
  }

  const { utilVal, isImportant } = parsed;

  if (!utilVal) {
    if (SHORTCUTS[utilKey]) {
      return `${SHORTCUTS[utilKey]}${isImportant ? ' !important' : ''};`;
    }
    return;
  }

  const mod = applyModifier(parsed);

  if (mod) return mod;

  const { propKeyKebab, propVal, utilOp, propType } = parsed;

  if (utilOp === REF_CHAR_CUSTOM) {
    return serializeProp(propKeyKebab, propVal, isImportant);
  }

  const serializedParts: Array<string> = [];
  const parts = split(utilVal, REF_CHAR_VALUE_PARTS);

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const modifierResult = PART_MODIFIERS[utilKey]?.(parsed, part, i, parts);

    if (modifierResult) {
      serializedParts.push(modifierResult);
      continue;
    }

    const valueItems = split(part, REF_CHAR_SPACE);
    const serializedValue = [];

    for (let j = 0; j < valueItems.length; j++) {
      const valueItem = valueItems[j];
      const value =
        VALUE_MODIFIERS[utilKey]?.(parsed, valueItem, j, valueItems) ??
        TYPE_MODIFIERS[propType]?.({
          ...parsed,
          utilVal: valueItem,
          propVal: valueItem,
          validVarVal: escapeVariable(valueItem),
        });

      if (value) {
        serializedValue.push(value);
      }
    }

    serializedParts.push(serializedValue.join(' '));
  }

  return serializeProp(
    propKeyKebab,
    serializedParts.join(REF_CHAR_VALUE_PARTS + ' '),
    isImportant,
  );
}

function buildSelector({
  srcSel,
  parentSel = '',
  selfSel = '',
  childSel = '',
}: ParsedClass) {
  return `${serializeSelector(parentSel)} ${srcSel}${serializeSelector(selfSel)} ${serializeSelector(childSel)}`.trim();
}

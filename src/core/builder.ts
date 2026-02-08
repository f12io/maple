import {
  REF_CHAR_CUSTOM,
  REF_CHAR_SPACE,
  REF_CHAR_VALUE_PARTS,
} from './constants/chars';
import { OPTIONS } from './constants/config';
import {
  BACKDROP_FILTER_KEYS,
  FILTER_KEYS,
  SHORTCUTS,
  TRANSFORM_KEYS,
} from './constants/dictionaries';
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
import { ParsedClass, ParsedMediaQuery, RuleData } from './types';

// Composable keys - these don't conflict with each other
const COMPOSABLE_KEYS = new Set([
  ...Object.keys(FILTER_KEYS),
  ...Object.keys(BACKDROP_FILTER_KEYS),
  ...Object.keys(TRANSFORM_KEYS),
]);

export function buildRule(srcClass: string): RuleData | undefined {
  const parsed = parseClass(srcClass);
  const styles = buildProp(parsed);

  if (!styles) return;

  const selector = buildSelector(parsed);

  if (!selector) return;

  const parsedMediaQuery = parseMediaQuery(parsed);
  const block = `${selector} { ${styles} }`;
  const style = parsedMediaQuery
    ? `${parsedMediaQuery.prefix}${parsedMediaQuery.rootSelector}${block} ${parsedMediaQuery.suffix}`.trim()
    : block;
  parsed.conflictKey = OPTIONS.nomerge
    ? '1'
    : buildConflictKey(styles, parsed, parsedMediaQuery);

  return { style, parsedMediaQuery, parsed };
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

function buildConflictKey(
  styles: string,
  {
    utilKey,
    propKeyKebab,
    parentSel = '',
    selfSel = '',
    childSel = '',
  }: ParsedClass,
  parsedMediaQuery: ParsedMediaQuery | undefined,
): string {
  let propKey;

  if (COMPOSABLE_KEYS.has(utilKey)) {
    propKey = utilKey;
  } else if (SHORTCUTS[utilKey]) {
    const colonIndex = styles.indexOf(':');
    propKey = colonIndex > -1 ? styles.slice(0, colonIndex) : styles;
  } else {
    propKey = propKeyKebab;
  }

  return `${propKey}:${childSel}${selfSel}${parentSel}${parsedMediaQuery?.prefix ?? ''}${parsedMediaQuery?.bucketQuery ?? ''}`;
}

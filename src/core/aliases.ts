import { ALIAS_CLASS_CACHE } from './constants/caches';
import {
  CHAR_DOLLAR,
  CHAR_EXCLAMATION_MARK,
  REF_CHAR_ALIAS_PARTS,
  REF_CHAR_ALIAS_PREFIX,
  REF_CHAR_CUSTOM,
  REF_CHAR_UTILITY_DELIMITER,
} from './constants/chars';
import { BUILTIN_ALIASES } from './constants/dictionaries';
import { removeBrackets, split } from './helpers/string.helper';

const ALIAS_DEFINITION_PREFIX = '--alias-';
const MAX_ALIAS_DEPTH = 5;
let USER_ALIASES: Record<string, string | undefined> = {};
let aliasSignature = '';

export function isAliasDefinition(srcClass: string): boolean {
  return srcClass.startsWith(ALIAS_DEFINITION_PREFIX);
}

export function collectAliases(srcClasses: Array<string>): void {
  const aliases: Record<string, string | undefined> = {};

  for (const srcClass of srcClasses) {
    if (!isAliasDefinition(srcClass)) continue;

    const eqIndex = srcClass.indexOf(REF_CHAR_CUSTOM);

    if (eqIndex === -1) continue;

    const key = srcClass.slice(ALIAS_DEFINITION_PREFIX.length, eqIndex);
    const value = removeBrackets(srcClass.slice(eqIndex + 1));

    if (key && value) {
      aliases[key] = value;
    }
  }

  const nextSignature = Object.keys(aliases)
    .sort()
    .map((key) => `${key}=${aliases[key]}`)
    .join(REF_CHAR_ALIAS_PARTS);

  if (nextSignature !== aliasSignature) {
    ALIAS_CLASS_CACHE.clear();
    aliasSignature = nextSignature;
  }

  USER_ALIASES = aliases;
}

export function expandAliasClass(srcClass: string): Array<string> | undefined {
  return expandAliasClassInternal(srcClass, 0);
}

function expandAliasClassInternal(
  srcClass: string,
  depth: number,
): Array<string> | undefined {
  if (depth >= MAX_ALIAS_DEPTH) return;

  const { prefix, context, utility } = splitClass(srcClass);
  const alias = resolveAlias(utility);

  if (!alias) return;

  const result: Array<string> = [];
  const aliasItems = split(alias, REF_CHAR_ALIAS_PARTS).filter(Boolean);

  for (const item of aliasItems) {
    const expandedClass =
      prefix +
      (context ? `${context}${REF_CHAR_UTILITY_DELIMITER}` : '') +
      item;
    const nested = expandAliasClassInternal(expandedClass, depth + 1);

    if (nested) {
      result.push(...nested);
    } else {
      result.push(expandedClass);
    }
  }

  return result.length ? result : undefined;
}

function resolveAlias(utility: string): string | undefined {
  if (utility.startsWith(REF_CHAR_ALIAS_PREFIX)) {
    const key = utility.slice(REF_CHAR_ALIAS_PREFIX.length);
    return USER_ALIASES[key] ?? BUILTIN_ALIASES[key];
  }

  return BUILTIN_ALIASES[utility];
}

function splitClass(srcClass: string) {
  let prefix = '';

  if (srcClass.charCodeAt(0) === CHAR_EXCLAMATION_MARK) {
    prefix += srcClass[0];
    srcClass = srcClass.slice(1);
  }

  if (
    srcClass.charCodeAt(0) === CHAR_DOLLAR &&
    srcClass.charCodeAt(1) === CHAR_DOLLAR
  ) {
    prefix += srcClass.slice(0, 2);
    srcClass = srcClass.slice(2);
  } else if (srcClass.charCodeAt(0) === CHAR_DOLLAR) {
    prefix += srcClass[0];
    srcClass = srcClass.slice(1);
  }

  const parts = split(srcClass, REF_CHAR_UTILITY_DELIMITER);
  const utility = parts.pop() ?? '';
  const context = parts.join(REF_CHAR_UTILITY_DELIMITER);

  return { prefix, context, utility };
}

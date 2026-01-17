import { CHAR_AT } from './constants/chars';
import { MEDIA_BUCKET_TYPE_ORDER, REM_SIZE } from './constants/config';
import { REGEX_NUMBER_WITH_UNIT } from './constants/regex';
import { Bucket, BucketType, ParsedMediaQuery } from './types';

const buckets: Array<Bucket> = [];
let sheet: CSSStyleSheet | null = null;
let refsLayer: CSSGroupingRule | null = null;
let utilsLayer: CSSGroupingRule | null = null;

export function insert(cssRule: string, parsedMediaQuery?: ParsedMediaQuery) {
  if (!sheet) initStyleSheet();
  if (!sheet) return;

  const targetKey = parsedMediaQuery?.bucketKey ?? 'base';
  let bucket = buckets.find((b) => b.key === targetKey);

  if (!bucket && parsedMediaQuery) {
    insertBucket(targetKey, parsedMediaQuery);
    bucket = buckets.find((b) => b.key === targetKey);
  }

  bucket?.rule.insertRule(cssRule, bucket.rule.cssRules.length);
}

export function insertRefVar(key: string, val: string) {
  if (!sheet) initStyleSheet();
  if (!sheet || !refsLayer) return;

  if (refsLayer.cssRules.length === 0) {
    refsLayer.insertRule(':root {}', 0);
  }

  (refsLayer.cssRules[0] as CSSStyleRule).style.setProperty(
    `--ref-${key}`,
    val,
  );
}

function parsePriority(parsedMediaQuery: ParsedMediaQuery): number {
  const match = REGEX_NUMBER_WITH_UNIT.exec(parsedMediaQuery.bucketVal);

  if (!match) return 0;

  const rawValue = parseFloat(match[1]);
  const unit = match[2];
  let normalized = rawValue;

  if (unit === 'rem' || unit === 'em') {
    normalized = rawValue * REM_SIZE;
  }

  return normalized;
}

function compareBuckets(
  a: { type: BucketType; val: number; key: string },
  b: { type: BucketType; val: number; key: string },
) {
  const orderA = MEDIA_BUCKET_TYPE_ORDER[a.type];
  const orderB = MEDIA_BUCKET_TYPE_ORDER[b.type];

  if (orderA !== orderB) return orderA - orderB;

  if (a.type === 'mnw' || a.type === 'mnh') {
    if (a.val !== b.val) return a.val - b.val;

    // '@' denotes Viewport (Media), and lack of '@' denotes Container
    const isAMedia = a.key.charCodeAt(0) === CHAR_AT;
    const isBMedia = b.key.charCodeAt(0) === CHAR_AT;

    if (isAMedia !== isBMedia) {
      // If A is Media (Global) and B is Container (Local),
      // A should come FIRST (smaller index) so B overrides it.
      return isAMedia ? -1 : 1;
    }
  }

  return b.val - a.val;
}

function insertBucket(key: string, parsedMediaQuery: ParsedMediaQuery) {
  if (!sheet || !utilsLayer) return;

  const val = parsePriority(parsedMediaQuery);
  const type = parsedMediaQuery.bucketType;
  const compareParam = { type, val, key };
  let insertIndex = 0;

  for (let i = 0; i < buckets.length; i++) {
    if (compareBuckets(compareParam, buckets[i]) < 0) {
      insertIndex = i;
      break;
    }
    insertIndex = i + 1;
  }

  try {
    utilsLayer.insertRule(`${parsedMediaQuery.bucketQuery} {}`, insertIndex);

    const rule = utilsLayer.cssRules[insertIndex] as CSSGroupingRule;

    buckets.splice(insertIndex, 0, {
      key,
      type,
      val,
      rule,
    });
  } catch (ignoreError) {
    console.error(ignoreError);
  }
}

function initStyleSheet() {
  // Do nothing if we're not in a browser
  if (typeof document === 'undefined') return;

  // Do nothing if we've already initialized
  if (sheet) return;

  const el =
    document.getElementById('mapleStyles') ?? document.createElement('style');

  if (!el.isConnected) {
    el.id = 'mapleStyles';
    document.head.appendChild(el);
  }

  sheet = (el as HTMLStyleElement).sheet;

  if (!sheet) return;

  sheet.insertRule('@layer refs {}', 0);
  sheet.insertRule('@layer utils {}', 1);

  refsLayer = sheet.cssRules[0] as CSSGroupingRule;
  utilsLayer = sheet.cssRules[1] as CSSGroupingRule;
  utilsLayer.insertRule('@layer base {}', 0);

  buckets.push({
    key: 'base',
    type: 'base',
    val: 0,
    rule: utilsLayer.cssRules[0] as CSSGroupingRule,
  });
}

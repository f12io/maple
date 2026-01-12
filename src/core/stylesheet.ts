import { MEDIA_BUCKET_TYPE_ORDER, REGEX_NUMBER_WITH_UNIT } from './constants';
import { Bucket, BucketType, ParsedMediaQuery } from './types';

const REM_SIZE = 16;
const buckets: Array<Bucket> = [];
let sheet: CSSStyleSheet | null = null;

function parsePriority(parsedMediaQuery: ParsedMediaQuery): number {
  const { bucketValue } = parsedMediaQuery;

  const match = REGEX_NUMBER_WITH_UNIT.exec(bucketValue);

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
  a: { type: BucketType; val: number },
  b: { type: BucketType; val: number },
) {
  const orderA = MEDIA_BUCKET_TYPE_ORDER[a.type];
  const orderB = MEDIA_BUCKET_TYPE_ORDER[b.type];

  if (orderA !== orderB) return orderA - orderB;
  if (a.type === 'mnw' || a.type === 'mnh') return a.val - b.val;

  return b.val - a.val;
}

function insertBucket(key: string, parsedMediaQuery: ParsedMediaQuery) {
  if (!sheet) return;

  const val = parsePriority(parsedMediaQuery);
  const type = parsedMediaQuery.bucketType;
  const compareParam = { type, val };
  let insertIndex = 0;

  for (let i = 0; i < buckets.length; i++) {
    if (compareBuckets(compareParam, buckets[i]) < 0) {
      insertIndex = i;
      break;
    }
    insertIndex = i + 1;
  }

  try {
    const utilsLayer = sheet.cssRules[0] as CSSGroupingRule;

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

  sheet.insertRule('@layer utils {}', 0);

  const utilsLayer = sheet.cssRules[0] as CSSGroupingRule;

  utilsLayer.insertRule('@layer base {}', 0);

  buckets.push({
    key: 'base',
    type: 'base',
    val: 0,
    rule: utilsLayer.cssRules[0] as CSSGroupingRule,
  });
}

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

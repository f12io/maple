import { CHAR_AT } from './constants/chars';
import { MEDIA_BUCKET_TYPE_ORDER, OPTIONS } from './constants/config';
import {
  REGEX_CSS_ESCAPED_CHARS,
  REGEX_NUMBER_WITH_UNIT,
} from './constants/regex';
import { Bucket, BucketType, ParsedMediaQuery, RuleData } from './types';

type Sheet = CSSStyleSheet | null;
type Layer = CSSLayerBlockRule | undefined;
type Group = CSSGroupingRule | undefined;

const buckets: Record<string, Array<Bucket> | undefined> = {};
const BASE_KEY = 'base';
let sheet: Sheet = null;
let refNumbersLayer: Group;
let refColorsLayer: Group;
let refCustomLayer: Group;
let utilsLayer: Group;

export function insert({ style, parsedMediaQuery, parsed }: RuleData) {
  if (!sheet) initStyleSheet();
  if (!sheet) return;

  const typeIndex = parsed.propType;
  const priorityIndex = parsed.propKeyKebab
    ? parsed.propKeyKebab.split('-').length - 1
    : 0;
  const layer = getOrInsertLayer(typeIndex, priorityIndex);

  if (!layer) return;

  const layerKey = getLayerKey(layer);
  const targetKey = parsedMediaQuery?.bucketKey ?? BASE_KEY;
  let bucket = buckets[layerKey]?.find((b) => b.key === targetKey);

  if (!bucket && parsedMediaQuery) {
    bucket = insertBucket(layer, targetKey, parsedMediaQuery);
  }

  bucket?.rule?.insertRule(style, bucket.rule.cssRules.length);
}

export function insertRefVar(
  key: string,
  val: string,
  type: 'number' | 'color' | 'custom',
) {
  if (!sheet) initStyleSheet();
  if (!sheet) return;

  const refsLayer =
    type === 'number'
      ? refNumbersLayer
      : type === 'color'
        ? refColorsLayer
        : refCustomLayer;

  if (!refsLayer) {
    return;
  }

  if (refsLayer.cssRules.length === 0) {
    refsLayer.insertRule(':root {}', 0);
  }

  key = key.replace(REGEX_CSS_ESCAPED_CHARS, '');

  (refsLayer.cssRules[0] as CSSStyleRule).style.setProperty(
    `--ref-${key}`,
    val,
  );
}

function getLayerKey(layer: Layer) {
  return `${(layer?.parentRule as Layer)?.name ?? ''}${layer?.name}`;
}

function getOrInsertLayer(typeIndex: number, priorityIndex: number) {
  let typeLayer = utilsLayer?.cssRules[typeIndex] as Layer;

  if (!typeLayer) {
    for (
      let index = utilsLayer?.cssRules.length ?? 0;
      index <= typeIndex;
      index++
    ) {
      utilsLayer?.insertRule(`@layer t${index} {}`, index);
    }
  }

  typeLayer = utilsLayer?.cssRules[typeIndex] as Layer;

  let priorityLayer = typeLayer?.cssRules[priorityIndex] as Layer;

  if (!priorityLayer) {
    for (
      let index = typeLayer?.cssRules.length ?? 0;
      index <= priorityIndex;
      index++
    ) {
      typeLayer?.insertRule(`@layer p${index} {}`, index);

      const layer = typeLayer?.cssRules[index] as Layer;

      layer?.insertRule('@layer base {}', 0);
      buckets[getLayerKey(layer)] ??= [];
      buckets[getLayerKey(layer)]?.push({
        key: BASE_KEY,
        type: BASE_KEY,
        val: 0,
        rule: layer?.cssRules[0] as CSSGroupingRule,
      });
    }
  }

  priorityLayer = typeLayer?.cssRules[priorityIndex] as Layer;

  return priorityLayer;
}

function parsePriority(parsedMediaQuery: ParsedMediaQuery): number {
  const match = REGEX_NUMBER_WITH_UNIT.exec(parsedMediaQuery.bucketVal);

  if (!match) {
    const numberValue = Number(parsedMediaQuery.bucketVal);
    return isNaN(numberValue) ? 0 : numberValue;
  }

  const rawValue = parseFloat(match[1]);
  const unit = match[2].toLowerCase();

  if (unit === 'px') return rawValue;
  if (unit === 'rem' || unit === 'em' || unit === 'pc') return rawValue * 16;
  if (unit === 'in') return rawValue * 96;
  if (unit === 'cm') return rawValue * (96 / 2.54);
  if (unit === 'mm') return rawValue * (96 / 25.4);
  if (unit === 'pt') return rawValue * (96 / 72);

  // For unconvertible units, result is raw value (best effort sort)
  return rawValue;
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

function insertBucket(
  layer: Layer,
  key: string,
  parsedMediaQuery: ParsedMediaQuery,
) {
  if (!sheet) return;

  const val = parsePriority(parsedMediaQuery);
  const type = parsedMediaQuery.bucketType;
  const compareParam = { type, val, key };
  const layerKey = getLayerKey(layer);
  const layerBuckets = buckets[layerKey] ?? [];
  let insertIndex = 0;

  for (let i = 0; i < layerBuckets.length; i++) {
    if (compareBuckets(compareParam, layerBuckets[i]) < 0) {
      insertIndex = i;
      break;
    }
    insertIndex = i + 1;
  }

  layer?.insertRule(`${parsedMediaQuery.bucketQuery} {}`, insertIndex);

  const rule = layer?.cssRules[insertIndex] as Group;
  const bucket = { key, type, val, rule };

  layerBuckets.splice(insertIndex, 0, bucket);
  buckets[layerKey] = layerBuckets;

  return bucket;
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

  if (OPTIONS.refs) {
    const refsLayer = sheet.cssRules[0] as CSSGroupingRule;
    refsLayer.insertRule('@layer colors {}', 0);
    refsLayer.insertRule('@layer numbers {}', 1);
    refsLayer.insertRule('@layer custom {}', 2);

    refColorsLayer = refsLayer.cssRules[0] as CSSGroupingRule;
    refNumbersLayer = refsLayer.cssRules[1] as CSSGroupingRule;
    refCustomLayer = refsLayer.cssRules[2] as CSSGroupingRule;
  }

  utilsLayer = sheet.cssRules[1] as CSSGroupingRule;
}

import { CHAR_AT } from './constants/chars';
import {
  MEDIA_BUCKET_TYPE_ORDER,
  OPTIONS,
  PROP_TYPE_VARIABLE,
} from './constants/config';
import {
  DEMOTED_PROPERTIES,
  PROMOTED_PROPERTIES,
} from './constants/dictionaries';
import {
  REGEX_CSS_ESCAPED_CHARS,
  REGEX_NUMBER_WITH_UNIT,
} from './constants/regex';
import { Bucket, BucketType, ParsedMediaQuery, RuleData } from './types';

type Sheet = CSSStyleSheet | null;
type Layer = CSSLayerBlockRule | undefined;
type Group = CSSGroupingRule | undefined;

const buckets = new Map<CSSGroupingRule, Array<Bucket>>();
const BASE_KEY = 'base';
let sheet: Sheet = null;
let refNumbersLayer: Group;
let refColorsLayer: Group;
let refCustomLayer: Group;
let aliasesLayer: Group;
let utilsLayer: Group;
let dynamicLayer: Group;

const pendingRules: Array<{
  rule: CSSGroupingRule | CSSStyleSheet;
  content: string;
}> = [];

const pendingVars: Array<{
  rule: CSSStyleRule;
  key: string;
  val: string;
}> = [];

let isScheduled = false;

export function flush() {
  if (dynamicLayer && dynamicLayer.cssRules.length > 0) {
    while (dynamicLayer.cssRules.length > 0) {
      dynamicLayer.deleteRule(0);
    }
  }

  for (const { rule, content } of pendingRules) {
    rule.insertRule(content, rule.cssRules.length);
  }

  for (const { rule, key, val } of pendingVars) {
    rule.style.setProperty(key, val);
  }

  pendingRules.length = 0;
  pendingVars.length = 0;
  isScheduled = false;
}

function scheduleFlush() {
  if (isScheduled) return;
  isScheduled = true;
  queueMicrotask(flush);
}

export function insert(rule: RuleData | undefined) {
  if (!rule) return;

  if (!sheet) initStyleSheet();
  if (!sheet) return;

  insertRule(rule);

  if (rule.overrideRule) {
    insertRule(rule.overrideRule);
  }
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

  if (OPTIONS.batching) {
    pendingVars.push({
      rule: refsLayer.cssRules[0] as CSSStyleRule,
      key: `--ref-${key}`,
      val,
    });
    scheduleFlush();
  } else {
    (refsLayer.cssRules[0] as CSSStyleRule).style.setProperty(
      `--ref-${key}`,
      val,
    );
  }
}

function insertRule({ content, isAlias, parsedMediaQuery, parsed }: RuleData) {
  if (!sheet) return;

  if (parsed.isDynamic) {
    if (dynamicLayer) {
      pendingRules.push({ rule: dynamicLayer, content });
      scheduleFlush();
    }
    return;
  }

  const typeIndex = parsed.propType;
  let priorityIndex = 0;

  if (parsed.propKeyKebab && parsed.propType !== PROP_TYPE_VARIABLE) {
    priorityIndex = countHyphens(parsed.propKeyKebab) * 2;

    if (DEMOTED_PROPERTIES.has(parsed.propKeyKebab)) {
      priorityIndex -= 1;
    } else if (PROMOTED_PROPERTIES.has(parsed.propKeyKebab)) {
      priorityIndex += 1;
    }
  }

  const layer = getOrInsertLayer(
    isAlias ? aliasesLayer : utilsLayer,
    typeIndex,
    priorityIndex,
  );

  if (!layer) return;

  const targetKey = parsedMediaQuery?.bucketKey ?? BASE_KEY;
  const layerBuckets = buckets.get(layer);
  let bucket = layerBuckets?.find((b) => b.key === targetKey);

  if (!bucket && parsedMediaQuery) {
    bucket = insertBucket(layer, targetKey, parsedMediaQuery);
  }

  if (OPTIONS.batching && bucket?.rule) {
    pendingRules.push({ rule: bucket.rule, content });
    scheduleFlush();
  } else {
    bucket?.rule?.insertRule(content, bucket.rule.cssRules.length);
  }
}

function countHyphens(value: string) {
  let count = 0;

  for (let i = 0; i < value.length; i++) {
    if (value.charCodeAt(i) === 45) {
      count++;
    }
  }

  return count;
}

function getOrInsertLayer(
  rootLayer: Group,
  typeIndex: number,
  priorityIndex: number,
) {
  let typeLayer = rootLayer?.cssRules[typeIndex] as Layer;

  if (!typeLayer) {
    for (
      let index = rootLayer?.cssRules.length ?? 0;
      index <= typeIndex;
      index++
    ) {
      rootLayer?.insertRule(`@layer t${index} {}`, index);
    }
  }

  typeLayer = rootLayer?.cssRules[typeIndex] as Layer;

  let priorityLayer = typeLayer?.cssRules[priorityIndex] as Layer;

  if (!priorityLayer) {
    for (
      let index = typeLayer?.cssRules.length ?? 0;
      index <= priorityIndex;
      index++
    ) {
      typeLayer?.insertRule(`@layer p${index} {}`, index);

      const layer = typeLayer?.cssRules[index] as Layer;

      if (layer) {
        layer.insertRule('@layer base {}', 0);
        buckets.set(layer, [
          {
            key: BASE_KEY,
            type: BASE_KEY,
            val: 0,
            rule: layer.cssRules[0] as CSSGroupingRule,
          },
        ]);
      }
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
  layer: CSSLayerBlockRule,
  key: string,
  parsedMediaQuery: ParsedMediaQuery,
) {
  if (!sheet) return;

  const val = parsePriority(parsedMediaQuery);
  const type = parsedMediaQuery.bucketType;
  const compareParam = { type, val, key };
  const layerBuckets = buckets.get(layer) ?? [];
  let insertIndex = 0;

  for (let i = 0; i < layerBuckets.length; i++) {
    if (compareBuckets(compareParam, layerBuckets[i]) < 0) {
      insertIndex = i;
      break;
    }
    insertIndex = i + 1;
  }

  layer.insertRule(`${parsedMediaQuery.bucketQuery} {}`, insertIndex);

  const rule = layer.cssRules[insertIndex] as Group;
  const bucket = { key, type, val, rule };

  layerBuckets.splice(insertIndex, 0, bucket);
  buckets.set(layer, layerBuckets);

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
  sheet.insertRule('@layer aliases {}', 1);
  sheet.insertRule('@layer utils {}', 2);
  sheet.insertRule('@layer dynamic {}', 3);

  if (OPTIONS.refs) {
    const refsLayer = sheet.cssRules[0] as CSSGroupingRule;
    refsLayer.insertRule('@layer colors {}', 0);
    refsLayer.insertRule('@layer numbers {}', 1);
    refsLayer.insertRule('@layer custom {}', 2);

    refColorsLayer = refsLayer.cssRules[0] as CSSGroupingRule;
    refNumbersLayer = refsLayer.cssRules[1] as CSSGroupingRule;
    refCustomLayer = refsLayer.cssRules[2] as CSSGroupingRule;
  }

  aliasesLayer = sheet.cssRules[1] as CSSGroupingRule;
  utilsLayer = sheet.cssRules[2] as CSSGroupingRule;
  dynamicLayer = sheet.cssRules[3] as CSSGroupingRule;
}

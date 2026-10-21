import { CLASS_CACHE, SKIPPED_CLASS_CACHE } from './constants/caches';
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
import { setCacheItem } from './helpers/cache.helper';
import { debugWarn } from './helpers/debug.helper';
import { Bucket, BucketType, ParsedMediaQuery, RuleData } from './types';

type Sheet = CSSStyleSheet | null;
type Layer = CSSLayerBlockRule | undefined;
type Group = CSSGroupingRule | undefined;

const buckets = new Map<CSSGroupingRule, Array<Bucket>>();
const BASE_KEY = 'base';
/**
 * Upper bound for the depth index, so it can be flipped for important
 * mode. `hyphens * 2` plus the promote adjustment reaches about 7 for
 * the deepest property names CSS has today, and the headroom costs only
 * the empty layers declared on the way to the index in use.
 */
const MAX_PRIORITY_INDEX = 16;
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
  cacheKey?: string;
  srcClass?: string;
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

  try {
    for (const { rule, content, cacheKey, srcClass } of pendingRules) {
      insertOrAbsorb(rule, content, cacheKey, srcClass);
    }

    for (const { rule, key, val } of pendingVars) {
      rule.style.setProperty(key, val);
    }
  } finally {
    // Reset even if something unforeseen throws.
    pendingRules.length = 0;
    pendingVars.length = 0;
    isScheduled = false;
  }
}

/**
 * Inserts a rule, absorbing the SyntaxError the browser throws for a
 * selector it cannot parse — a vendor pseudo element from another
 * engine is the common case, and Maple passes any selector through
 * untouched. Letting it escape would abandon the rest of the element's
 * rules and its pending class attribute update, and on the root pass it
 * would leave the runtime unstarted, since `startObserver` locks the
 * aliases and attaches the observer only after that pass returns.
 */
function insertOrAbsorb(
  target: CSSGroupingRule | CSSStyleSheet,
  content: string,
  cacheKey?: string,
  srcClass?: string,
): void {
  try {
    target.insertRule(content, target.cssRules.length);
  } catch (error) {
    if (cacheKey) {
      /**
       * The cache must not claim a rule the stylesheet never took. A
       * class always serializes to the same content, so the rejection
       * is final: record it as skipped instead of rebuilding and
       * refailing it for every element that carries it.
       */
      CLASS_CACHE.delete(cacheKey);
      setCacheItem(SKIPPED_CLASS_CACHE, cacheKey, 1);
    }

    if (OPTIONS.debug) {
      debugWarn(
        `skipped "${srcClass ?? content}": rejected by the browser — ${(error as Error).message}`,
      );
    }
  }
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

function insertRule({
  cacheKey,
  content,
  isAlias,
  parsedMediaQuery,
  parsed,
}: RuleData) {
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

  /**
   * Layer order reverses for important declarations, so when the
   * `important` flag makes every declaration important, the depth
   * ordering has to be laid out backwards to keep meaning the same
   * thing: a longhand still beats the shorthand that sets it, and a
   * physical property still beats its logical peer. The flag is read
   * once from the script URL, so a page never mixes the two orders.
   */
  const depthIndex = OPTIONS.important
    ? MAX_PRIORITY_INDEX - Math.min(priorityIndex, MAX_PRIORITY_INDEX)
    : priorityIndex;

  const layer = getOrInsertLayer(
    isAlias ? aliasesLayer : utilsLayer,
    depthIndex,
    typeIndex,
  );

  if (!layer) return;

  const targetKey = parsedMediaQuery?.bucketKey ?? BASE_KEY;
  const layerBuckets = buckets.get(layer);
  let bucket = layerBuckets?.find((b) => b.key === targetKey);

  if (!bucket && parsedMediaQuery) {
    bucket = insertBucket(layer, targetKey, parsedMediaQuery);
  }

  if (OPTIONS.batching && bucket?.rule) {
    pendingRules.push({
      rule: bucket.rule,
      content,
      cacheKey,
      srcClass: parsed.srcClass,
    });
    scheduleFlush();
  } else if (bucket?.rule) {
    insertOrAbsorb(bucket.rule, content, cacheKey, parsed.srcClass);
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

/**
 * Nests the property's shorthand depth outside its value kind, so a
 * longhand always outranks the shorthand that sets it. The two only
 * ever decide a competition between a shorthand and its own longhand —
 * rules for the same property share both indexes, and rules for
 * unrelated properties never compete — and with the kind outside, a
 * keyword longhand such as `background-image` would sit in an earlier
 * layer than its length- or colour-valued shorthand and lose to it
 * whatever the class order or specificity. Kind still orders two
 * properties of equal depth.
 */
function getOrInsertLayer(
  rootLayer: Group,
  priorityIndex: number,
  typeIndex: number,
) {
  let priorityLayer = rootLayer?.cssRules[priorityIndex] as Layer;

  if (!priorityLayer) {
    for (
      let index = rootLayer?.cssRules.length ?? 0;
      index <= priorityIndex;
      index++
    ) {
      rootLayer?.insertRule(`@layer p${index} {}`, index);
    }
  }

  priorityLayer = rootLayer?.cssRules[priorityIndex] as Layer;

  let typeLayer = priorityLayer?.cssRules[typeIndex] as Layer;

  if (!typeLayer) {
    for (
      let index = priorityLayer?.cssRules.length ?? 0;
      index <= typeIndex;
      index++
    ) {
      priorityLayer?.insertRule(`@layer t${index} {}`, index);

      const layer = priorityLayer?.cssRules[index] as Layer;

      if (layer) {
        /**
         * The base bucket is a nested layer while the media buckets
         * beside it are not, and unlayered declarations beat layered
         * ones: that is what makes a query variant outrank its base
         * whatever the selectors involved. Without it, precedence falls
         * to specificity, and anything carrying a selector — a state
         * variant, a parent selector, the combined selector an alias
         * override emits — jumps ahead of the query that should win.
         *
         * The cost is that the relationship inverts for `!important`
         * declarations, which read layer order backwards: a variant
         * loses to its own base when both are important, and so for
         * every declaration under the `important` flag. Removing the
         * asymmetry fixes that and breaks the common case instead, so
         * the asymmetry stays until precedence stops depending on two
         * mechanisms that disagree.
         */
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

  typeLayer = priorityLayer?.cssRules[typeIndex] as Layer;

  return typeLayer;
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

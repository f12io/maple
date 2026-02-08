import { MEDIA_QUERY_CACHE } from './constants/caches';
import {
  CHAR_AT,
  REF_CHAR_CUSTOM,
  REF_CHAR_CUSTOM_NOT,
  REF_CHAR_MEDIA_QUERY_DELIMITER,
  REF_CHAR_PREDEFINED,
} from './constants/chars';
import { MEDIA_BUCKET_TYPE_ORDER, OPTIONS } from './constants/config';
import { setCacheItem } from './helpers/cache.helper';
import { removeBrackets, split } from './helpers/string.helper';
import { serializeValue } from './serializer';
import { MediaQueryBucketParams, ParsedClass, ParsedMediaQuery } from './types';

const MEDIA_NOT = 'not-';

const MEDIA_SUPPORTS = 'supports';
const MEDIA_SUPPORTS_CUSTOM = 'supports' + REF_CHAR_CUSTOM;

const MEDIA_MIN_WIDTH_CUSTOM = 'mnw' + REF_CHAR_CUSTOM;
const MEDIA_MIN_HEIGHT_CUSTOM = 'mnh' + REF_CHAR_CUSTOM;

const MEDIA_MAX_WIDTH = 'mxw' + REF_CHAR_PREDEFINED;
const MEDIA_MAX_WIDTH_CUSTOM = 'mxw' + REF_CHAR_CUSTOM;

const MEDIA_MAX_HEIGHT = 'mxh' + REF_CHAR_PREDEFINED;
const MEDIA_MAX_HEIGHT_CUSTOM = 'mxh' + REF_CHAR_CUSTOM;

const MEDIA_STYLE_CUSTOM = 'style' + REF_CHAR_CUSTOM;
const MEDIA_STUCK_CUSTOM = 'stuck' + REF_CHAR_CUSTOM;
const MEDIA_SCROLLABLE_CUSTOM = 'scrollable' + REF_CHAR_CUSTOM;
const MEDIA_SNAPPED_CUSTOM = 'snapped' + REF_CHAR_CUSTOM;

export function parseMediaQuery({
  mediaQuery,
  propKeyKebab,
  propVal,
}: ParsedClass): ParsedMediaQuery | undefined {
  if (!mediaQuery) {
    return;
  }

  const prefixContainer = '@container';
  const prefixMedia = '@media';
  const collection: Array<MediaQueryBucketParams> = [];
  const mediaQueries = split(mediaQuery, REF_CHAR_MEDIA_QUERY_DELIMITER);

  const collect = (cacheKey: string, params: MediaQueryBucketParams) => {
    setCacheItem(MEDIA_QUERY_CACHE, cacheKey, params);
    collection.push(params);
  };

  for (let mq of mediaQueries) {
    const bucketKey = mq;
    const isViewportQuery = mq.charCodeAt(0) === CHAR_AT;
    const scope = isViewportQuery ? prefixMedia : prefixContainer;

    mq = isViewportQuery ? mq.slice(1) : mq;

    const cacheKey =
      isViewportQuery &&
      (mq === MEDIA_SUPPORTS || mq === MEDIA_NOT + MEDIA_SUPPORTS)
        ? bucketKey + propKeyKebab + propVal
        : bucketKey;

    if (MEDIA_QUERY_CACHE.has(cacheKey)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      collect(cacheKey, MEDIA_QUERY_CACHE.get(cacheKey)!);

      continue;
    }

    const isNotQuery = mq.startsWith(MEDIA_NOT);
    const isNotEqual = !isNotQuery && mq.includes(REF_CHAR_CUSTOM_NOT);
    const not = isNotEqual || isNotQuery ? 'not ' : '';
    mq = isNotQuery
      ? mq.slice(MEDIA_NOT.length)
      : isNotEqual
        ? mq.replace(REF_CHAR_CUSTOM_NOT, REF_CHAR_CUSTOM)
        : mq;

    let containerName = '';

    // Extract container name if it exists
    if (!isViewportQuery) {
      const openIdx = mq.indexOf('(');

      if (openIdx !== -1) {
        const closeIdx = mq.indexOf(')', openIdx);

        if (closeIdx !== -1) {
          // Check if parentheses are before any '=' (custom value indicator)
          const eqIdx = mq.indexOf(REF_CHAR_CUSTOM);

          if (eqIdx === -1 || openIdx < eqIdx) {
            containerName = mq.substring(openIdx + 1, closeIdx);
            mq = mq.substring(0, openIdx) + mq.substring(closeIdx + 1);
          }
        }
      }
    }

    const prefix = containerName ? `${scope} ${containerName}` : scope;
    const prefixWithNot = not ? `${prefix} ${not}` : `${prefix} `;

    if (OPTIONS.breakpoints[mq]) {
      collect(cacheKey, [
        'mnw',
        bucketKey,
        OPTIONS.breakpoints[mq],
        `${prefixWithNot}(min-width: ${OPTIONS.breakpoints[mq]})`,
      ]);

      continue;
    }

    if (mq.startsWith(MEDIA_MAX_WIDTH)) {
      const bpKey = mq.slice(MEDIA_MAX_WIDTH.length);
      const value = OPTIONS.breakpoints[bpKey];

      if (value) {
        if (not) {
          collect(cacheKey, [
            'mxw',
            bucketKey,
            value,
            `${prefix} (min-width: ${value})`,
          ]);
        } else {
          collect(cacheKey, [
            'mxw',
            bucketKey,
            value,
            `${prefix} not (min-width: ${value})`,
          ]);
        }
      }

      continue;
    }

    if (mq.startsWith(MEDIA_MAX_HEIGHT)) {
      const bpKey = mq.slice(MEDIA_MAX_HEIGHT.length);
      const value = OPTIONS.breakpoints[bpKey];

      if (value) {
        if (not) {
          collect(cacheKey, [
            'mnh',
            bucketKey,
            value,
            `${prefix} (min-height: ${value})`,
          ]);
        } else {
          collect(cacheKey, [
            'mxh',
            bucketKey,
            value,
            `${prefix} not (min-height: ${value})`,
          ]);
        }
      }

      continue;
    }

    if (mq.startsWith(MEDIA_MIN_WIDTH_CUSTOM)) {
      const value = mq.slice(MEDIA_MIN_WIDTH_CUSTOM.length);

      if (value) {
        collect(cacheKey, [
          'mnw',
          bucketKey,
          value,
          `${prefixWithNot}(min-width: ${value})`,
        ]);
      }

      continue;
    }

    if (mq.startsWith(MEDIA_MIN_HEIGHT_CUSTOM)) {
      const value = mq.slice(MEDIA_MIN_HEIGHT_CUSTOM.length);

      if (value) {
        collect(cacheKey, [
          'mnh',
          bucketKey,
          value,
          `${prefixWithNot}(min-height: ${value})`,
        ]);
      }

      continue;
    }

    if (mq.startsWith(MEDIA_MAX_WIDTH_CUSTOM)) {
      const value = mq.slice(MEDIA_MAX_WIDTH_CUSTOM.length);

      if (value) {
        collect(cacheKey, [
          'mxw',
          bucketKey,
          value,
          `${prefixWithNot}(max-width: ${value})`,
        ]);
      }

      continue;
    }

    if (mq.startsWith(MEDIA_MAX_HEIGHT_CUSTOM)) {
      const value = mq.slice(MEDIA_MAX_HEIGHT_CUSTOM.length);

      if (value) {
        collect(cacheKey, [
          'mxh',
          bucketKey,
          value,
          `${prefixWithNot}(max-height: ${value})`,
        ]);
      }

      continue;
    }

    if (mq === 'landscape' || mq === 'portrait') {
      collect(cacheKey, [
        'orientation',
        bucketKey,
        mq,
        `${prefixWithNot}(orientation: ${mq})`,
      ]);

      continue;
    }

    if (isViewportQuery) {
      if (mq === MEDIA_SUPPORTS) {
        propVal = serializeValue(propVal);

        collect(cacheKey, [
          'supports',
          bucketKey,
          propVal,
          `@supports ${not}(${propKeyKebab}:${propVal})`,
        ]);

        continue;
      }

      if (mq.startsWith(MEDIA_SUPPORTS_CUSTOM)) {
        const value = removeBrackets(
          serializeValue(mq.slice(MEDIA_SUPPORTS_CUSTOM.length)),
        );

        if (value) {
          collect(cacheKey, [
            'supports',
            bucketKey,
            value,
            `@supports ${not}(${value})`,
          ]);
        }

        continue;
      }

      if (mq === 'dark' || mq === 'light') {
        collect(cacheKey, [
          mq,
          bucketKey,
          mq,
          `${prefixWithNot}(prefers-color-scheme: ${mq})`,
        ]);

        continue;
      }

      if (mq === 'motion-reduce') {
        collect(cacheKey, [
          'prefers',
          bucketKey,
          'reduce',
          `${prefixWithNot}(prefers-reduced-motion: reduce)`,
        ]);

        continue;
      }

      if (mq === 'motion-safe') {
        collect(cacheKey, [
          'prefers',
          bucketKey,
          'no-preference',
          `${prefixWithNot}(prefers-reduced-motion: no-preference)`,
        ]);

        continue;
      }

      if (mq === 'browser') {
        collect(cacheKey, [
          'static',
          bucketKey,
          'browser',
          `${prefixWithNot}(display-mode: browser)`,
        ]);

        continue;
      }

      if (mq === 'standalone') {
        collect(cacheKey, [
          'static',
          bucketKey,
          'standalone',
          `${prefixWithNot}(display-mode: standalone)`,
        ]);

        continue;
      }

      if (mq === 'fullscreen') {
        collect(cacheKey, [
          'static',
          bucketKey,
          'fullscreen',
          `${prefixWithNot}(display-mode: fullscreen)`,
        ]);

        continue;
      }

      if (mq === 'pip') {
        collect(cacheKey, [
          'static',
          bucketKey,
          'picture-in-picture',
          `${prefixWithNot}(display-mode: picture-in-picture)`,
        ]);

        continue;
      }

      const [key, value] = split(mq, '=');

      if (value) {
        collect(cacheKey, [
          key.startsWith('prefers-') ? 'prefers' : 'static',
          bucketKey,
          value,
          `${prefixWithNot}(${key}: ${value})`,
        ]);

        continue;
      }
    } else {
      if (mq.startsWith(MEDIA_STYLE_CUSTOM)) {
        const value = removeBrackets(
          serializeValue(mq.slice(MEDIA_STYLE_CUSTOM.length)),
        );

        if (value) {
          collect(cacheKey, [
            'style',
            bucketKey,
            value,
            `${prefixWithNot}style(${value})`,
          ]);
        }

        continue;
      }

      if (mq.startsWith(MEDIA_STUCK_CUSTOM)) {
        const value = mq.slice(MEDIA_STUCK_CUSTOM.length);

        if (value) {
          collect(cacheKey, [
            'scroll',
            bucketKey,
            value,
            `${prefixWithNot}scroll-state(stuck: ${value})`,
          ]);
        }

        continue;
      }

      if (mq.startsWith(MEDIA_SCROLLABLE_CUSTOM)) {
        const value = mq.slice(MEDIA_SCROLLABLE_CUSTOM.length);

        if (value) {
          collect(cacheKey, [
            'scroll',
            bucketKey,
            value,
            `${prefixWithNot}scroll-state(scrollable: ${value})`,
          ]);
        }

        continue;
      }

      if (mq.startsWith(MEDIA_SNAPPED_CUSTOM)) {
        const value = mq.slice(MEDIA_SNAPPED_CUSTOM.length);

        if (value) {
          collect(cacheKey, [
            'scroll',
            bucketKey,
            value,
            `${prefixWithNot}scroll-state(snapped: ${value})`,
          ]);
        }

        continue;
      }
    }

    collect(cacheKey, ['static', bucketKey, mq, `${prefixMedia} ${not}${mq}`]);
  }

  // Find the highest priority query
  let winnerIndex = 0;
  let maxPriority = -1;

  for (let i = 0; i < collection.length; i++) {
    const [type, key] = collection[i];
    let priority = MEDIA_BUCKET_TYPE_ORDER[type] || 0;

    // Prefer viewport query (@media) over container query (@container)
    if (key.charCodeAt(0) === CHAR_AT) {
      priority += 0.5;
    }

    if (priority > maxPriority) {
      maxPriority = priority;
      winnerIndex = i;
    }
  }

  // Build the parsed media query
  const [bucketType, bucketKey, bucketVal, bucketQuery] =
    collection[winnerIndex];

  const parsedMediaQuery: ParsedMediaQuery = {
    bucketType,
    bucketKey,
    bucketVal,
    bucketQuery,
    prefix: '',
    suffix: '',
  };

  /**
   * Loop through everyone else to build the nested chain
   * We maintain the original order, just skipping the winner
   */
  for (let i = 0; i < collection.length; i++) {
    // Skip the winner (it's the wrapper bucket)
    if (i === winnerIndex) continue;

    // collection[i][3] is the query string
    parsedMediaQuery.prefix += collection[i][3] + ' { ';
    parsedMediaQuery.suffix += '} ';
  }

  return parsedMediaQuery;
}

import { BREAKPOINTS } from './constants/breakpoints';
import { MEDIA_QUERY_CACHE } from './constants/caches';
import {
  CHAR_AT,
  REF_CHAR_CUSTOM,
  REF_CHAR_CUSTOM_NOT,
  REF_CHAR_MEDIA_QUERY_DELIMITER,
  REF_CHAR_PREDEFINED,
} from './constants/chars';
import { MEDIA_BUCKET_TYPE_ORDER } from './constants/config';
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
  const mediaQueries = split(mediaQuery, REF_CHAR_MEDIA_QUERY_DELIMITER);

  const parsedMediaQuery: ParsedMediaQuery = {
    bucketKey: '',
    bucketQuery: '',
    bucketType: 'initial',
    bucketVal: '',
    innerBlockOpen: '',
    innerBlockClose: '',
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
      updateParsedMediaQuery(
        MEDIA_QUERY_CACHE.get(cacheKey),
        parsedMediaQuery,
        cacheKey,
      );

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

    if (BREAKPOINTS[mq]) {
      updateParsedMediaQuery(
        [
          'mnw',
          bucketKey,
          BREAKPOINTS[mq],
          `${prefixWithNot}(min-width: ${BREAKPOINTS[mq]})`,
        ],
        parsedMediaQuery,
        cacheKey,
      );

      continue;
    }

    if (mq.startsWith(MEDIA_MAX_WIDTH)) {
      const bpKey = mq.slice(MEDIA_MAX_WIDTH.length);
      const value = BREAKPOINTS[bpKey];

      if (value) {
        if (not) {
          updateParsedMediaQuery(
            ['mxw', bucketKey, value, `${prefix} (min-width: ${value})`],
            parsedMediaQuery,
            cacheKey,
          );
        } else {
          updateParsedMediaQuery(
            ['mxw', bucketKey, value, `${prefix} not (min-width: ${value})`],
            parsedMediaQuery,
            cacheKey,
          );
        }
      }

      continue;
    }

    if (mq.startsWith(MEDIA_MAX_HEIGHT)) {
      const bpKey = mq.slice(MEDIA_MAX_HEIGHT.length);
      const value = BREAKPOINTS[bpKey];

      if (value) {
        if (not) {
          updateParsedMediaQuery(
            ['mnh', bucketKey, value, `${prefix} (min-height: ${value})`],
            parsedMediaQuery,
            cacheKey,
          );
        } else {
          updateParsedMediaQuery(
            ['mxh', bucketKey, value, `${prefix} not (min-height: ${value})`],
            parsedMediaQuery,
            cacheKey,
          );
        }
      }

      continue;
    }

    if (mq.startsWith(MEDIA_MIN_WIDTH_CUSTOM)) {
      const value = mq.slice(MEDIA_MIN_WIDTH_CUSTOM.length);

      if (value) {
        updateParsedMediaQuery(
          ['mnw', bucketKey, value, `${prefixWithNot}(min-width: ${value})`],
          parsedMediaQuery,
          cacheKey,
        );
      }

      continue;
    }

    if (mq.startsWith(MEDIA_MIN_HEIGHT_CUSTOM)) {
      const value = mq.slice(MEDIA_MIN_HEIGHT_CUSTOM.length);

      if (value) {
        updateParsedMediaQuery(
          ['mnh', bucketKey, value, `${prefixWithNot}(min-height: ${value})`],
          parsedMediaQuery,
          cacheKey,
        );
      }

      continue;
    }

    if (mq.startsWith(MEDIA_MAX_WIDTH_CUSTOM)) {
      const value = mq.slice(MEDIA_MAX_WIDTH_CUSTOM.length);

      if (value) {
        updateParsedMediaQuery(
          ['mxw', bucketKey, value, `${prefixWithNot}(max-width: ${value})`],
          parsedMediaQuery,
          cacheKey,
        );
      }

      continue;
    }

    if (mq.startsWith(MEDIA_MAX_HEIGHT_CUSTOM)) {
      const value = mq.slice(MEDIA_MAX_HEIGHT_CUSTOM.length);

      if (value) {
        updateParsedMediaQuery(
          ['mxh', bucketKey, value, `${prefixWithNot}(max-height: ${value})`],
          parsedMediaQuery,
          cacheKey,
        );
      }

      continue;
    }

    if (mq === 'landscape' || mq === 'portrait') {
      updateParsedMediaQuery(
        ['orientation', bucketKey, mq, `${prefixWithNot}(orientation: ${mq})`],
        parsedMediaQuery,
        cacheKey,
      );

      continue;
    }

    if (isViewportQuery) {
      if (mq === MEDIA_SUPPORTS) {
        propVal = serializeValue(propVal);

        updateParsedMediaQuery(
          [
            'supports',
            bucketKey,
            propVal,
            `@supports ${not}(${propKeyKebab}:${propVal})`,
          ],
          parsedMediaQuery,
          cacheKey,
        );

        continue;
      }

      if (mq.startsWith(MEDIA_SUPPORTS_CUSTOM)) {
        const value = removeBrackets(
          serializeValue(mq.slice(MEDIA_SUPPORTS_CUSTOM.length)),
        );

        if (value) {
          updateParsedMediaQuery(
            ['supports', bucketKey, value, `@supports ${not}(${value})`],
            parsedMediaQuery,
            cacheKey,
          );
        }

        continue;
      }

      if (mq === 'dark' || mq === 'light') {
        updateParsedMediaQuery(
          [
            'prefers',
            bucketKey,
            mq,
            `${prefixWithNot}(prefers-color-scheme: ${mq})`,
          ],
          parsedMediaQuery,
          cacheKey,
        );

        continue;
      }

      if (mq === 'motion-reduce') {
        updateParsedMediaQuery(
          [
            'prefers',
            bucketKey,
            'reduce',
            `${prefixWithNot}(prefers-reduced-motion: reduce)`,
          ],
          parsedMediaQuery,
          cacheKey,
        );

        continue;
      }

      if (mq === 'motion-safe') {
        updateParsedMediaQuery(
          [
            'prefers',
            bucketKey,
            'no-preference',
            `${prefixWithNot}(prefers-reduced-motion: no-preference)`,
          ],
          parsedMediaQuery,
          cacheKey,
        );

        continue;
      }

      const [prefers, value] = split(mq, '=');

      if (value) {
        updateParsedMediaQuery(
          [
            'prefers',
            bucketKey,
            value,
            `${prefixWithNot}(prefers-${prefers}: ${value})`,
          ],
          parsedMediaQuery,
          cacheKey,
        );

        continue;
      }
    } else {
      if (mq.startsWith(MEDIA_STYLE_CUSTOM)) {
        const value = removeBrackets(
          serializeValue(mq.slice(MEDIA_STYLE_CUSTOM.length)),
        );

        if (value) {
          updateParsedMediaQuery(
            ['style', bucketKey, value, `${prefixWithNot}style(${value})`],
            parsedMediaQuery,
            cacheKey,
          );
        }

        continue;
      }

      if (mq.startsWith(MEDIA_STUCK_CUSTOM)) {
        const value = mq.slice(MEDIA_STUCK_CUSTOM.length);

        if (value) {
          updateParsedMediaQuery(
            [
              'stuck',
              bucketKey,
              value,
              `${prefixWithNot}scroll-state(stuck: ${value})`,
            ],
            parsedMediaQuery,
            cacheKey,
          );
        }

        continue;
      }

      if (mq.startsWith(MEDIA_SCROLLABLE_CUSTOM)) {
        const value = mq.slice(MEDIA_SCROLLABLE_CUSTOM.length);

        if (value) {
          updateParsedMediaQuery(
            [
              'scrollable',
              bucketKey,
              value,
              `${prefixWithNot}scroll-state(scrollable: ${value})`,
            ],
            parsedMediaQuery,
            cacheKey,
          );
        }

        continue;
      }

      if (mq.startsWith(MEDIA_SNAPPED_CUSTOM)) {
        const value = mq.slice(MEDIA_SNAPPED_CUSTOM.length);

        if (value) {
          updateParsedMediaQuery(
            [
              'snapped',
              bucketKey,
              value,
              `${prefixWithNot}scroll-state(snapped: ${value})`,
            ],
            parsedMediaQuery,
            cacheKey,
          );
        }

        continue;
      }
    }

    updateParsedMediaQuery(
      ['other', bucketKey, mq, `${prefixMedia} ${not}${mq}`],
      parsedMediaQuery,
      cacheKey,
    );
  }

  return parsedMediaQuery;
}

function updateParsedMediaQuery(
  params: MediaQueryBucketParams | undefined,
  parsedMediaQuery: ParsedMediaQuery,
  cacheKey: string,
) {
  if (!params) {
    return;
  }

  setCacheItem(MEDIA_QUERY_CACHE, cacheKey, params);

  const [bucketType, bucketKey, bucketVal, bucketQuery] = params;

  if (parsedMediaQuery.bucketKey === bucketKey) {
    return;
  }

  if (parsedMediaQuery.bucketType === 'initial') {
    parsedMediaQuery.bucketType = bucketType;
    parsedMediaQuery.bucketKey = bucketKey;
    parsedMediaQuery.bucketVal = bucketVal;
    parsedMediaQuery.bucketQuery = bucketQuery;
    return;
  }

  const isCurrentViewportQuery = bucketKey.charCodeAt(0) === CHAR_AT;
  const isParsedViewportQuery =
    parsedMediaQuery.bucketKey.charCodeAt(0) === CHAR_AT;
  const currentOrder = MEDIA_BUCKET_TYPE_ORDER[bucketType];
  const parsedOrder = MEDIA_BUCKET_TYPE_ORDER[parsedMediaQuery.bucketType];

  let shouldSwap = false;

  if (currentOrder !== parsedOrder) {
    // Rule 1: Lower Bucket Order wins (e.g. Base < MinWidth)
    shouldSwap = currentOrder < parsedOrder;
  } else if (isCurrentViewportQuery !== isParsedViewportQuery) {
    // Rule 2: If Bucket Orders are equal, Container wins over Viewport
    shouldSwap = !isCurrentViewportQuery;
  } else {
    // Rule 3: If Scope is the same, sort Alphabetically
    shouldSwap = bucketKey < parsedMediaQuery.bucketKey;
  }

  if (shouldSwap) {
    parsedMediaQuery.innerBlockOpen += parsedMediaQuery.bucketQuery + ' { ';
    parsedMediaQuery.innerBlockClose += '} ';

    parsedMediaQuery.bucketType = bucketType;
    parsedMediaQuery.bucketKey = bucketKey;
    parsedMediaQuery.bucketVal = bucketVal;
    parsedMediaQuery.bucketQuery = bucketQuery;
    return;
  }

  parsedMediaQuery.innerBlockOpen += bucketQuery + ' { ';
  parsedMediaQuery.innerBlockClose += '} ';
}

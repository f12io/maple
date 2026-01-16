import { BREAKPOINTS } from './breakpoint';
import {
  CHAR_AT,
  MEDIA_BUCKET_TYPE_ORDER,
  MEDIA_MAX_HEIGHT,
  MEDIA_MAX_HEIGHT_CUSTOM,
  MEDIA_MAX_WIDTH,
  MEDIA_MAX_WIDTH_CUSTOM,
  MEDIA_MIN_HEIGHT_CUSTOM,
  MEDIA_MIN_WIDTH_CUSTOM,
  MEDIA_NOT,
  MEDIA_SCROLLABLE_CUSTOM,
  MEDIA_SNAPPED_CUSTOM,
  MEDIA_STUCK_CUSTOM,
  MEDIA_STYLE_CUSTOM,
  MEDIA_SUPPORTS,
  MEDIA_SUPPORTS_CUSTOM,
  REF_CHAR_CUSTOM,
  REF_CHAR_CUSTOM_NOT,
  REF_CHAR_MEDIA_QUERY_DELIMITER,
} from './constants';
import { removeBrackets, split } from './helpers/string.helper';
import { serializeValue } from './serializer';
import { BucketType, ParsedClass, ParsedMediaQuery } from './types';

export function parseMediaQuery({
  mediaQuery,
  propKeyKebab,
  propValue,
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
    bucketValue: '',
    innerBlockOpen: '',
    innerBlockClose: '',
  };

  for (let mq of mediaQueries) {
    const bucketKey = mq;

    // Check if it's a viewport query, by default we use container queries
    const isViewportQuery = mq.charCodeAt(0) === CHAR_AT;
    const scope = isViewportQuery ? prefixMedia : prefixContainer;
    mq = isViewportQuery ? mq.slice(1) : mq;

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
        'mnw',
        bucketKey,
        BREAKPOINTS[mq],
        `${prefixWithNot}(min-width: ${BREAKPOINTS[mq]})`,
        parsedMediaQuery,
      );

      continue;
    }

    if (mq.startsWith(MEDIA_MAX_WIDTH)) {
      const bpKey = mq.slice(MEDIA_MAX_WIDTH.length);
      const value = BREAKPOINTS[bpKey];

      if (value) {
        if (not) {
          updateParsedMediaQuery(
            'mnw',
            bucketKey,
            value,
            `${prefix} (min-width: ${value})`,
            parsedMediaQuery,
          );
        } else {
          updateParsedMediaQuery(
            'mxw',
            bucketKey,
            value,
            `${prefix} not (min-width: ${value})`,
            parsedMediaQuery,
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
            'mnh',
            bucketKey,
            value,
            `${prefix} (min-height: ${value})`,
            parsedMediaQuery,
          );
        } else {
          updateParsedMediaQuery(
            'mxh',
            bucketKey,
            value,
            `${prefix} not (min-height: ${value})`,
            parsedMediaQuery,
          );
        }
      }

      continue;
    }

    if (mq.startsWith(MEDIA_MIN_WIDTH_CUSTOM)) {
      const value = mq.slice(MEDIA_MIN_WIDTH_CUSTOM.length);

      if (value) {
        updateParsedMediaQuery(
          'mnw',
          bucketKey,
          value,
          `${prefixWithNot}(min-width: ${value})`,
          parsedMediaQuery,
        );
      }

      continue;
    }

    if (mq.startsWith(MEDIA_MIN_HEIGHT_CUSTOM)) {
      const value = mq.slice(MEDIA_MIN_HEIGHT_CUSTOM.length);

      if (value) {
        updateParsedMediaQuery(
          'mnh',
          bucketKey,
          value,
          `${prefixWithNot}(min-height: ${value})`,
          parsedMediaQuery,
        );
      }

      continue;
    }

    if (mq.startsWith(MEDIA_MAX_WIDTH_CUSTOM)) {
      const value = mq.slice(MEDIA_MAX_WIDTH_CUSTOM.length);

      if (value) {
        updateParsedMediaQuery(
          'mxw',
          bucketKey,
          value,
          `${prefixWithNot}(max-width: ${value})`,
          parsedMediaQuery,
        );
      }

      continue;
    }

    if (mq.startsWith(MEDIA_MAX_HEIGHT_CUSTOM)) {
      const value = mq.slice(MEDIA_MAX_HEIGHT_CUSTOM.length);

      if (value) {
        updateParsedMediaQuery(
          'mxh',
          bucketKey,
          value,
          `${prefixWithNot}(max-height: ${value})`,
          parsedMediaQuery,
        );
      }

      continue;
    }

    if (mq === 'landscape' || mq === 'portrait') {
      updateParsedMediaQuery(
        'orientation',
        bucketKey,
        mq,
        `${prefixWithNot}(orientation: ${mq})`,
        parsedMediaQuery,
      );

      continue;
    }

    if (isViewportQuery) {
      if (mq === MEDIA_SUPPORTS) {
        propValue = serializeValue(propValue);

        updateParsedMediaQuery(
          'supports',
          bucketKey,
          propValue,
          `@supports ${not}(${propKeyKebab}:${propValue})`,
          parsedMediaQuery,
        );

        continue;
      }

      if (mq.startsWith(MEDIA_SUPPORTS_CUSTOM)) {
        const value = removeBrackets(
          serializeValue(mq.slice(MEDIA_SUPPORTS_CUSTOM.length)),
        );

        if (value) {
          updateParsedMediaQuery(
            'supports',
            bucketKey,
            value,
            `@supports ${not}(${value})`,
            parsedMediaQuery,
          );
        }

        continue;
      }

      if (mq === 'dark' || mq === 'light') {
        updateParsedMediaQuery(
          'prefers',
          bucketKey,
          mq,
          `${prefixWithNot}(prefers-color-scheme: ${mq})`,
          parsedMediaQuery,
        );

        continue;
      }

      if (mq === 'motion-reduce') {
        updateParsedMediaQuery(
          'prefers',
          bucketKey,
          'reduce',
          `${prefixWithNot}(prefers-reduced-motion: reduce)`,
          parsedMediaQuery,
        );

        continue;
      }

      if (mq === 'motion-safe') {
        updateParsedMediaQuery(
          'prefers',
          bucketKey,
          'no-preference',
          `${prefixWithNot}(prefers-reduced-motion: no-preference)`,
          parsedMediaQuery,
        );

        continue;
      }

      const [prefers, value] = split(mq, '=');

      if (value) {
        updateParsedMediaQuery(
          'prefers',
          bucketKey,
          value,
          `${prefixWithNot}(prefers-${prefers}: ${value})`,
          parsedMediaQuery,
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
            'style',
            bucketKey,
            value,
            `${prefixWithNot}style(${value})`,
            parsedMediaQuery,
          );
        }

        continue;
      }

      if (mq.startsWith(MEDIA_STUCK_CUSTOM)) {
        const value = mq.slice(MEDIA_STUCK_CUSTOM.length);

        if (value) {
          updateParsedMediaQuery(
            'stuck',
            bucketKey,
            value,
            `${prefixWithNot}scroll-state(stuck: ${value})`,
            parsedMediaQuery,
          );
        }

        continue;
      }

      if (mq.startsWith(MEDIA_SCROLLABLE_CUSTOM)) {
        const value = mq.slice(MEDIA_SCROLLABLE_CUSTOM.length);

        if (value) {
          updateParsedMediaQuery(
            'scrollable',
            bucketKey,
            value,
            `${prefixWithNot}scroll-state(scrollable: ${value})`,
            parsedMediaQuery,
          );
        }

        continue;
      }

      if (mq.startsWith(MEDIA_SNAPPED_CUSTOM)) {
        const value = mq.slice(MEDIA_SNAPPED_CUSTOM.length);

        if (value) {
          updateParsedMediaQuery(
            'snapped',
            bucketKey,
            value,
            `${prefixWithNot}scroll-state(snapped: ${value})`,
            parsedMediaQuery,
          );
        }

        continue;
      }
    }

    updateParsedMediaQuery(
      'other',
      bucketKey,
      mq,
      `${prefixMedia} ${not}${mq}`,
      parsedMediaQuery,
    );
  }

  return parsedMediaQuery;
}

function updateParsedMediaQuery(
  bucketType: BucketType,
  bucketKey: string,
  bucketValue: string,
  bucketQuery: string,
  parsedMediaQuery: ParsedMediaQuery,
) {
  if (parsedMediaQuery.bucketKey === bucketKey) {
    return;
  }

  if (parsedMediaQuery.bucketType === 'initial') {
    parsedMediaQuery.bucketType = bucketType;
    parsedMediaQuery.bucketKey = bucketKey;
    parsedMediaQuery.bucketValue = bucketValue;
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
    parsedMediaQuery.bucketValue = bucketValue;
    parsedMediaQuery.bucketQuery = bucketQuery;
    return;
  }

  parsedMediaQuery.innerBlockOpen += bucketQuery + ' { ';
  parsedMediaQuery.innerBlockClose += '} ';
}

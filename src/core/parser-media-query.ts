import { BREAKPOINTS } from './breakpoint';
import {
  CHAR_AT,
  MEDIA_BUCKET_TYPE_ORDER,
  MEDIA_MAX_HEIGHT,
  MEDIA_MAX_HEIGHT_CUSTOM,
  MEDIA_MAX_WIDTH_CUSTOM,
  MEDIA_MIN_HEIGHT_CUSTOM,
  MEDIA_MIN_WIDTH,
  MEDIA_MIN_WIDTH_CUSTOM,
  MEDIA_NOT,
  MEDIA_SCROLLABLE_CUSTOM,
  MEDIA_SNAPPED_CUSTOM,
  MEDIA_STUCK_CUSTOM,
  MEDIA_SUPPORTS,
  REF_CHAR_CUSTOM,
  REF_CHAR_CUSTOM_NOT,
  REF_CHAR_MEDIA_QUERY_DELIMITER,
  REF_CHAR_SPACE,
} from './constants';
import { BucketType, ParsedClass, ParsedMediaQuery } from './types';

export function parseMediaQuery({
  mediaQuery,
}: ParsedClass): ParsedMediaQuery | undefined {
  if (!mediaQuery) {
    return;
  }

  const prefixContainer = '@container';
  const prefixMedia = '@media';
  const mediaQueries = mediaQuery.split(REF_CHAR_MEDIA_QUERY_DELIMITER);

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
          containerName = mq.slice(openIdx + 1, closeIdx);
          mq = mq.slice(0, openIdx) + mq.slice(closeIdx + 1);
        }
      }
    }

    const prefix = containerName ? `${scope} ${containerName}` : scope;

    if (BREAKPOINTS[mq]) {
      updateParsedMediaQuery(
        'mnw',
        bucketKey,
        BREAKPOINTS[mq],
        `${prefix} ${not}(min-width: ${BREAKPOINTS[mq]})`,
        parsedMediaQuery,
      );

      continue;
    }

    if (mq.startsWith(MEDIA_MIN_WIDTH)) {
      const bpKey = mq.slice(MEDIA_MIN_WIDTH.length);
      const value = BREAKPOINTS[bpKey];

      if (value) {
        updateParsedMediaQuery(
          'mnw',
          bucketKey,
          value,
          `${prefix} not all and ${not}(min-width: ${value})`,
          parsedMediaQuery,
        );
      }

      continue;
    }

    if (mq.startsWith(MEDIA_MAX_HEIGHT)) {
      const bpKey = mq.slice(MEDIA_MAX_HEIGHT.length);
      const value = BREAKPOINTS[bpKey];

      if (value) {
        updateParsedMediaQuery(
          'mxh',
          bucketKey,
          value,
          `${prefix} not all and ${not}(min-height: ${value})`,
          parsedMediaQuery,
        );
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
          `${prefix} (min-width: ${value})`,
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
          `${prefix} (min-height: ${value})`,
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
          `${prefix} (max-width: ${value})`,
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
          `${prefix} (max-height: ${value})`,
          parsedMediaQuery,
        );
      }

      continue;
    }

    if (!isViewportQuery) {
      if (mq.startsWith(MEDIA_STUCK_CUSTOM)) {
        const value = mq.slice(MEDIA_STUCK_CUSTOM.length);

        if (value) {
          updateParsedMediaQuery(
            'stuck',
            bucketKey,
            value,
            `${prefix} ${not}scroll-state(stuck: ${value})`,
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
            `${prefix} ${not}scroll-state(scrollable: ${value})`,
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
            `${prefix} ${not}scroll-state(snapped: ${value})`,
            parsedMediaQuery,
          );
        }

        continue;
      }
    }

    if (mq.startsWith(MEDIA_SUPPORTS)) {
      const value = mq
        .slice(MEDIA_SUPPORTS.length)
        .replace(REF_CHAR_SPACE, ': ');

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

    if (mq === 'landscape' || mq === 'portrait') {
      updateParsedMediaQuery(
        'orientation',
        bucketKey,
        mq,
        `${prefix} ${not}(orientation: ${mq})`,
        parsedMediaQuery,
      );

      continue;
    }

    if (mq === 'dark' || mq === 'light') {
      updateParsedMediaQuery(
        'prefers',
        bucketKey,
        mq,
        `${prefixMedia} ${not}(prefers-color-scheme: ${mq})`,
        parsedMediaQuery,
      );

      continue;
    }

    if (mq === 'motion-reduce') {
      updateParsedMediaQuery(
        'prefers',
        bucketKey,
        'reduce',
        `${prefixMedia} ${not}(prefers-reduced-motion: reduce)`,
        parsedMediaQuery,
      );

      continue;
    }

    if (mq === 'motion-safe') {
      updateParsedMediaQuery(
        'prefers',
        bucketKey,
        'no-preference',
        `${prefixMedia} ${not}(prefers-reduced-motion: no-preference)`,
        parsedMediaQuery,
      );

      continue;
    }

    const [prefers, value] = mq.split('=');

    if (value) {
      updateParsedMediaQuery(
        'prefers',
        bucketKey,
        value,
        `${prefixMedia} ${not}(prefers-${prefers}: ${value})`,
        parsedMediaQuery,
      );

      continue;
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

  const currentOrder = MEDIA_BUCKET_TYPE_ORDER[bucketType];
  const parsedOrder = MEDIA_BUCKET_TYPE_ORDER[parsedMediaQuery.bucketType];

  if (
    currentOrder < parsedOrder ||
    (currentOrder === parsedOrder && bucketKey < parsedMediaQuery.bucketKey)
  ) {
    parsedMediaQuery.innerBlockOpen += parsedMediaQuery.bucketQuery + '{';
    parsedMediaQuery.innerBlockClose += '}';

    parsedMediaQuery.bucketType = bucketType;
    parsedMediaQuery.bucketKey = bucketKey;
    parsedMediaQuery.bucketValue = bucketValue;
    parsedMediaQuery.bucketQuery = bucketQuery;
    return;
  }

  parsedMediaQuery.innerBlockOpen += bucketQuery + '{';
  parsedMediaQuery.innerBlockClose += '}';
}

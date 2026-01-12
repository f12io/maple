import { BucketType } from './types';

export const DEFAULT_BREAKPOINTS: Record<string, string> = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const PROP_TYPE_OTHER = 0;
export const PROP_TYPE_SPACE = 1;
export const PROP_TYPE_COLOR = 2;

export const REF_CHAR_SPACE = '_';
export const REF_CHAR_IMPORTANT = '!';
export const REF_CHAR_UTILITY_DELIMITER = ':';
export const REF_CHAR_MEDIA_QUERY_DELIMITER = ':';
export const REF_CHAR_PREDEFINED = '-';
export const REF_CHAR_CUSTOM = '=';
export const REF_CHAR_CUSTOM_NOT = '!=';
export const REF_CHAR_VALUE_PARTS = ',';

export const CHAR_SINGLE_QUOTE = 39; // '
export const CHAR_DOUBLE_QUOTE = 34; // "
export const CHAR_OPEN_BRACKET = 91; // [
export const CHAR_CLOSE_BRACKET = 93; // ]
export const CHAR_OPEN_PAREN = 40; // (
export const CHAR_CLOSE_PAREN = 41; // )
export const CHAR_COLON = 58; // :
export const CHAR_EQUAL = 61; // =
export const CHAR_AT = 64; // @
export const CHAR_DASH = 45; // -
export const CHAR_CARET = 94; // ^ (Parent)
export const CHAR_AMPERSAND = 38; // & (Self)
export const CHAR_SLASH = 47; // / (Child)

export const REGEX_UNSAFE_CLASS_CHARS = /([^a-zA-Z0-9_-])/g;
export const REGEX_LOWERCASE_UPPERCASE = /([a-z])([A-Z])/g;
export const REGEX_COLOR_TOKEN = /^([a-z]+)-?(\d{1,3})?(?:\/(\d{1,3}))?$/i;
export const REGEX_NUMBER_WITH_UNIT = /^([\d.]+)([a-z]*)/;

export const MEDIA_NOT = 'not-';
export const MEDIA_SUPPORTS = 'supports-';

export const MEDIA_MIN_WIDTH = 'mnw' + REF_CHAR_PREDEFINED;
export const MEDIA_MIN_WIDTH_CUSTOM = 'mnw' + REF_CHAR_CUSTOM;

export const MEDIA_MAX_WIDTH = 'mxw' + REF_CHAR_PREDEFINED;
export const MEDIA_MAX_WIDTH_CUSTOM = 'mxw' + REF_CHAR_CUSTOM;

export const MEDIA_MIN_HEIGHT = 'mnh' + REF_CHAR_PREDEFINED;
export const MEDIA_MIN_HEIGHT_CUSTOM = 'mnh' + REF_CHAR_CUSTOM;

export const MEDIA_MAX_HEIGHT = 'mxh' + REF_CHAR_PREDEFINED;
export const MEDIA_MAX_HEIGHT_CUSTOM = 'mxh' + REF_CHAR_CUSTOM;

export const MEDIA_STUCK_CUSTOM = 'stuck' + REF_CHAR_CUSTOM;
export const MEDIA_SCROLLABLE_CUSTOM = 'scrollable' + REF_CHAR_CUSTOM;
export const MEDIA_SNAPPED_CUSTOM = 'snapped' + REF_CHAR_CUSTOM;

export const MEDIA_BUCKET_TYPE_ORDER: Record<BucketType, number> = {
  base: 1,
  supports: 10,
  mnw: 20,
  mxw: 30,
  mnh: 40,
  mxh: 50,
  orientation: 60,
  stuck: 70,
  scrollable: 80,
  snapped: 90,
  prefers: 100,
  other: 9998,
  initial: 9999,
};

export const SHORTCUTS: Record<string, string> = Object.entries({
  position: {
    abs: 'absolute',
    rel: 'relative',
    sticky: 1,
    static: 1,
  },
  display: {
    iblock: 'inline-block',
    iflex: 'inline-flex',
    flex: 1,
    grid: 1,
    block: 1,
    none: 1,
    table: 1,
    inline: 1,
  },
  visibility: {
    hidden: 1,
    visible: 1,
  },
}).reduce<Record<string, string>>((acc, [prop, values]) => {
  Object.entries(values).forEach(([key, value]) => {
    acc[key] = `${prop}: ${value === 1 ? key : value}`;
  });
  return acc;
}, {});

export const CONTAINER_TYPES = [
  'inline-size',
  'size',
  'scroll-state',
  'normal',
];

export const ANGLE_UNITS = ['deg', 'grad', 'rad', 'turn'];
export const TIME_UNITS = ['ms', 's'];
export const ABS_UNITS = ['px', 'cm', 'mm', 'in', 'pt', 'pc', 'Q'];
export const REL_UNITS = [
  'rem',
  'em',
  'ch',
  'ex',
  'cap',
  'ic',
  'lh',
  'rlh',
  'fr',
];
export const ONE_UNITS = [...ABS_UNITS, ...REL_UNITS];
export const COVER_UNITS = [
  '%',
  'vh',
  'vw',
  'vmin',
  'vmax',
  'vi',
  'vb',
  'dvh',
  'dvw',
  'dvmin',
  'dvmax',
  'svh',
  'svw',
  'svmin',
  'svmax',
  'lvh',
  'lvw',
  'lvmin',
  'lvmax',
  'cqw',
  'cqh',
  'cqi',
  'cqb',
  'cqmin',
  'cqmax',
];
export const DEFAULT_SPACE_UNIT = 'rem';
export const DEFAULT_TIME_UNIT = 'ms';
export const DEFAULT_ANGLE_UNIT = 'deg';

export const ALL_UNITS = [
  ...ANGLE_UNITS,
  ...TIME_UNITS,
  ...ABS_UNITS,
  ...REL_UNITS,
  ...COVER_UNITS,
].sort((a, b) => b.length - a.length);

// This creates a pattern like: /^([0-9]*\.?[0-9]+)?(px|rem|vmin|vmax|...)?$/i
export const REGEX_CSS_NUMBER_VALUE = new RegExp(
  `^([0-9]*\\.?[0-9]+)?(${ALL_UNITS.join('|')})?$`,
  'i',
);

export const SELECTOR_REPLACEMENTS: Record<string, string> = {
  odd: ':nth-child(odd)',
  even: ':nth-child(even)',
  rtl: '[dir="rtl"]',
};

export const REGEX_SELECTOR_REPLACEMENTS = new RegExp(
  `:(${Object.keys(SELECTOR_REPLACEMENTS)
    .sort((a, b) => b.length - a.length)
    .join('|')})(?![-\\w])`,
  'g',
);

export const CSS_VARIABLE_CATEGORY: Record<string, string> = {
  [DEFAULT_SPACE_UNIT]: 'space',
  [DEFAULT_TIME_UNIT]: 'time',
  [DEFAULT_ANGLE_UNIT]: 'angle',
  tshadow: 'shadow',
  bshadow: 'shadow',
  color: 'color',
  prop: 'prop',
};

export const TRANSFORM_KEYS: Record<string, string> = {
  tl: 'translate',
  tlx: 'translateX',
  tly: 'translateY',
  tlz: 'translateZ',
  tl3: 'translate3d',
  scale: 'scale',
  scalex: 'scaleX',
  scaley: 'scaleY',
  scalez: 'scaleZ',
  scale3: 'scale3d',
  rot: 'rotate',
  rotx: 'rotateX',
  roty: 'rotateY',
  rotz: 'rotateZ',
  rot3: 'rotate3d',
  skew: 'skew',
  skewx: 'skewX',
  skewy: 'skewY',
  mtx: 'matrix',
  mtx3: 'matrix3d',
};

export const PROP_UNIT_MAP: Record<string, string> = {
  animation: DEFAULT_TIME_UNIT,
  animationDelay: DEFAULT_TIME_UNIT,
  animationDuration: DEFAULT_TIME_UNIT,
  transition: DEFAULT_TIME_UNIT,
  transitionDelay: DEFAULT_TIME_UNIT,
  transitionDuration: DEFAULT_TIME_UNIT,
  interestDelay: DEFAULT_TIME_UNIT,
  interestDelayEnd: DEFAULT_TIME_UNIT,
  interestDelayStart: DEFAULT_TIME_UNIT,
  skew: DEFAULT_ANGLE_UNIT,
  skewX: DEFAULT_ANGLE_UNIT,
  skewY: DEFAULT_ANGLE_UNIT,
  offsetRotate: DEFAULT_ANGLE_UNIT,
  rotate: DEFAULT_ANGLE_UNIT,
  rotateX: DEFAULT_ANGLE_UNIT,
  rotateY: DEFAULT_ANGLE_UNIT,
  rotateZ: DEFAULT_ANGLE_UNIT,
  rotate3d: DEFAULT_ANGLE_UNIT,
  scale: '',
  scaleX: '',
  scaleY: '',
  scaleZ: '',
  scale3d: '',
  matrix: '',
  matrix3d: '',
};

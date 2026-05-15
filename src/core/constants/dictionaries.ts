import { PRECALCULATED_PROP_ABBREVIATIONS } from '../../generated/precalculated-prop-abbreviations';
import {
  DEFAULT_ANGLE_UNIT,
  DEFAULT_SPACE_UNIT,
  DEFAULT_TIME_UNIT,
} from './units';

export const ABBREVIATIONS: Record<string, string> =
  PRECALCULATED_PROP_ABBREVIATIONS;
export const ABBREVIATIONS_REVERSE: Record<string, string> = {};

Object.entries(PRECALCULATED_PROP_ABBREVIATIONS).forEach(([alias, prop]) => {
  ABBREVIATIONS_REVERSE[prop] = alias;
});

// Flex position value mappings (compact)
export const FLEX_POSITION: Record<string, string> = {
  s: 'flex-start',
  c: 'center',
  e: 'flex-end',
  h: 'stretch',
  w: 'space-between',
};

export const BUILTIN_ALIASES: Record<string, string> = {
  // position
  abs: 'pos=absolute',
  fixed: 'pos=fixed',
  rel: 'pos=relative',
  sticky: 'pos=sticky',
  static: 'pos=static',

  // display
  iblock: 'd=inline-block',
  ifx: 'd=inline-flex',
  fx: 'd=flex',
  gr: 'd=grid',
  block: 'd=block',
  none: 'd=none',
  table: 'd=table',
  inline: 'd=inline',

  // visibility
  hidden: 'v=hidden',
  visible: 'v=visible',

  // border
  br: 'brw-px;brst=solid',
  brt: 'brtw-px;brtst=solid',
  brr: 'brrw-px;brrst=solid',
  brb: 'brbw-px;brbst=solid',
  brl: 'brlw-px;brlst=solid',
  brx: 'borderInlineWidth-px;borderInlineStyle=solid',
  brxs: 'borderInlineStartWidth-px;borderInlineStartStyle=solid',
  brxe: 'borderInlineEndWidth-px;borderInlineEndStyle=solid',
  bry: 'borderBlockWidth-px;borderBlockStyle=solid',
  brys: 'borderBlockStartWidth-px;borderBlockStartStyle=solid',
  brye: 'borderBlockEndWidth-px;borderBlockEndStyle=solid',

  // container
  cnt: 'cnt=inline-size',

  // font smoothing
  antialiased: 'webkitFontSmoothing=antialiased;mozOsxFontSmoothing=grayscale',

  // animation
  spin: 'anim-spin_1000_linear_infinite',
  ping: 'anim-ping_1000_cubic-bezier(0,0,0.2,1)_infinite',
  pulse: 'anim-pulse_2000_cubic-bezier(0.4,0,0.6,1)_infinite',
  bounce: 'anim-bounce_1000_infinite',
  shake: 'anim-shake_300_ease-in-out',
  wiggle: 'anim-wiggle_300_ease-in-out',

  ...[
    'fade-in',
    'fade-out',
    'fade-in-up',
    'fade-in-down',
    'fade-in-left',
    'fade-in-right',
    'fade-out-up',
    'fade-out-down',
    'fade-out-left',
    'fade-out-right',
    'scale-in',
    'scale-out',
    'slide-in-up',
    'slide-in-down',
    'slide-in-left',
    'slide-in-right',
    'slide-out-up',
    'slide-out-down',
    'slide-out-left',
    'slide-out-right',
  ].reduce<Record<string, string>>(
    (acc, key) => ({
      ...acc,
      [key]: `anim-${key}_300_ease-out_forwards`,
    }),
    {},
  ),

  ...createFlexAliases(),
};

export const SELECTOR_REPLACEMENTS: Record<string, string> = {
  odd: ':nth-child(odd)',
  even: ':nth-child(even)',
  rtl: '[dir="rtl"]',
  ltr: '[dir="ltr"]',
};

export const CONTAINER_TYPES = [
  'inline-size',
  'size',
  'scroll-state',
  'normal',
];

export const CSS_VARIABLE_CATEGORY: Record<string, string> = {
  [DEFAULT_SPACE_UNIT]: 'space',
  [DEFAULT_TIME_UNIT]: 'time',
  [DEFAULT_ANGLE_UNIT]: 'angle',
  tshadow: 'shadow',
  bshadow: 'shadow',
  dshadow: 'shadow',
  bdshadow: 'shadow',
  blur: 'space',
  bdblur: 'space',
  hue: 'angle',
  bdhue: 'angle',
  color: 'color',
  gradient: 'gradient',
  prop: 'prop',
};

export const SPACER_CATEGORY: Record<string, string> = {
  lh: 'f',
  ls: 'f',
  cols: 'size',
  rows: 'size',
  col: 'size',
  row: 'size',
  mnh: 'size',
  mnw: 'size',
  mxh: 'size',
  mxw: 'size',
  square: 'size',
  h: 'size',
  w: 'size',
  tshadow: 'shadow',
  bshadow: 'shadow',
  dshadow: 'shadow',
  bdshadow: 'shadow',
};

export const FUNCTION_KEYS: Record<string, string> = {
  url: 'url',
  linear: 'linear-gradient',
  radial: 'radial-gradient',
  conic: 'conic-gradient',
  rlinear: 'repeating-linear-gradient',
  rradial: 'repeating-radial-gradient',
  rconic: 'repeating-conic-gradient',
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

export const FILTER_KEYS: Record<string, string> = {
  blur: 'blur',
  brightness: 'brightness',
  contrast: 'contrast',
  dshadow: 'drop-shadow',
  grayscale: 'grayscale',
  hue: 'hue-rotate',
  invert: 'invert',
  saturate: 'saturate',
  sepia: 'sepia',
};

export const BACKDROP_FILTER_KEYS: Record<string, string> = {
  bdblur: 'blur',
  bdbrightness: 'brightness',
  bdcontrast: 'contrast',
  bdshadow: 'drop-shadow',
  bdgrayscale: 'grayscale',
  bdhue: 'hue-rotate',
  bdinvert: 'invert',
  bdsaturate: 'saturate',
  bdsepia: 'sepia',
};

export const PROP_UNIT_MAP: Record<string, string> = {
  animation: DEFAULT_TIME_UNIT,
  animationDelay: DEFAULT_TIME_UNIT,
  animationDuration: DEFAULT_TIME_UNIT,
  transition: DEFAULT_TIME_UNIT,
  transitionDelay: DEFAULT_TIME_UNIT,
  transitionDuration: DEFAULT_TIME_UNIT,
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
  brightness: '',
  contrast: '',
  grayscale: '',
  invert: '',
  saturate: '',
  sepia: '',
  hue: DEFAULT_ANGLE_UNIT,
  bdbrightness: '',
  bdcontrast: '',
  bdgrayscale: '',
  bdinvert: '',
  bdsaturate: '',
  bdsepia: '',
  bdhue: DEFAULT_ANGLE_UNIT,
};

const webkit = '-webkit-';

export const VENDOR_PREFIXES: Record<string, Array<string> | undefined> = {
  appearance: [webkit],
  'user-select': [webkit],
  'print-color-adjust': [webkit],
  'text-size-adjust': [webkit],
};

// Properties that should be effectively 'demoted' in priority
// (Logical properties that overlap with physical peers)
export const DEMOTED_PROPERTIES = new Set([
  'margin-inline',
  'margin-block',
  'padding-inline',
  'padding-block',
  'inset-inline',
  'inset-block',
  'scroll-margin-inline',
  'scroll-margin-block',
  'scroll-padding-inline',
  'scroll-padding-block',
  'border-inline',
  'border-block',
]);

// Properties that should be effectively 'promoted' in priority
// (Physical properties that have 0 hyphens but should beat global/logical overlaps)
export const PROMOTED_PROPERTIES = new Set([
  'top',
  'right',
  'bottom',
  'left',
  'border-width',
  'border-style',
  'border-color',
]);

function createFlexAliases(): Record<string, string> {
  const aliases: Record<string, string> = {};

  for (const vKey of Object.keys(FLEX_POSITION)) {
    for (const hKey of Object.keys(FLEX_POSITION)) {
      const key = vKey + hKey;
      const v = FLEX_POSITION[vKey];
      const h = FLEX_POSITION[hKey];

      aliases[`fxrow-${key}`] = `d=flex;fxdir=row;jc=${h};ai=${v}`;
      aliases[`fxcol-${key}`] = `d=flex;fxdir=column;jc=${v};ai=${h}`;
      aliases[`ifxrow-${key}`] = `d=inline-flex;fxdir=row;jc=${h};ai=${v}`;
      aliases[`ifxcol-${key}`] = `d=inline-flex;fxdir=column;jc=${v};ai=${h}`;
      aliases[`fxrowself-${key}`] = `js=${h};as=${v}`;
      aliases[`fxcolself-${key}`] = `js=${v};as=${h}`;
    }
  }

  return aliases;
}

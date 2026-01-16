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

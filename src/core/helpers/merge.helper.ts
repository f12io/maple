import { REF_CHAR_VAR_PREFIX } from '../constants/chars';

export function isMergeException(key: string): boolean {
  // css variable exception
  if (key.startsWith(REF_CHAR_VAR_PREFIX)) {
    return true;
  }

  // border-* exceptions
  if (key.startsWith('border-')) {
    return (
      key.endsWith('-radius') ||
      key.endsWith('-image') ||
      key.endsWith('-collapse') ||
      key.endsWith('-spacing')
    );
  }

  // flex-* exceptions
  if (key.startsWith('flex-')) {
    return (
      key.endsWith('-direction') ||
      key.endsWith('-wrap') ||
      key.endsWith('-flow')
    );
  }

  // grid-* exceptions
  if (key.startsWith('grid-')) {
    // grid shorthand resets grid-template-*, but NOT grid-column/row/area (item props)
    // We must be specific to avoid catching grid-template-columns/rows/areas
    return (
      key.startsWith('grid-column') ||
      key.startsWith('grid-row') ||
      key.startsWith('grid-area')
    );
  }

  // transform-* exceptions
  if (key.startsWith('transform-')) {
    return (
      key.endsWith('-origin') || key.endsWith('-style') || key.endsWith('-box')
    );
  }

  // overflow-* exceptions
  if (key.startsWith('overflow-')) {
    return key.endsWith('-wrap') || key.endsWith('-anchor');
  }

  // outline-* exceptions
  if (key.startsWith('outline-')) {
    return key.endsWith('-offset');
  }

  return false;
}

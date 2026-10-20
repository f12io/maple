import {
  CHAR_DOLLAR,
  CHAR_EXCLAMATION_MARK,
  REF_CHAR_CUSTOM,
  REF_CHAR_UTILITY_DELIMITER,
} from '../constants/chars';
import { REGEX_VENDOR_PREFIXED } from '../constants/regex';

const warned = new Set<string>();

let contextElement: Element | undefined;

/**
 * Tracks the element whose class list is currently being processed so
 * warnings raised deep in the parse/build chain can attach the DOM node
 * without threading it through every signature. Class processing is
 * synchronous, so a module variable is safe.
 */
export function setDebugContext(element: Element): void {
  contextElement = element;
}

/**
 * Emits a `[maple]` console warning once per unique message, so debug
 * mode stays readable when the same element or class is reprocessed.
 * Callers must gate on `OPTIONS.debug` before building the message.
 */
export function debugWarn(message: string): void {
  if (warned.has(message)) return;

  warned.add(message);

  if (contextElement === undefined) {
    console.warn(`[maple] ${message}`);
  } else {
    console.warn(`[maple] ${message}`, contextElement);
  }
}

/**
 * Warns about a class that produced no rule, but only when the class
 * shows Maple intent: it resolved to a known utility key, or it carries
 * Maple-specific syntax (a context delimiter, a custom value operator,
 * or a flag prefix). Plain CSS classes such as `btn-primary` fail the
 * same parse paths and must stay silent.
 */
export function debugWarnSkippedClass(
  srcClass: string,
  reason: string,
  hasKnownUtility?: boolean,
): void {
  const isVendorPrefixed = REGEX_VENDOR_PREFIXED.test(srcClass);

  if (
    !hasKnownUtility &&
    !isVendorPrefixed &&
    !srcClass.includes(REF_CHAR_UTILITY_DELIMITER) &&
    !srcClass.includes(REF_CHAR_CUSTOM) &&
    srcClass.charCodeAt(0) !== CHAR_EXCLAMATION_MARK &&
    srcClass.charCodeAt(0) !== CHAR_DOLLAR
  ) {
    return;
  }

  /**
   * A vendor prefixed property written in token form cannot parse: the
   * leading dash reads as the negative marker and the key ends at the
   * next one, so `-webkit-line-clamp-3` asks for the `webkit`
   * property. Naming the assignment form is more use than the reason.
   */
  const hint =
    isVendorPrefixed && !srcClass.includes(REF_CHAR_CUSTOM)
      ? ' (a vendor prefixed property needs the assignment form, as in `-webkit-line-clamp=3`)'
      : '';

  debugWarn(`skipped "${srcClass}": ${reason}${hint}`);
}

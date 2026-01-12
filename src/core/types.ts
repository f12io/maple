export type Modifiers = Record<
  string,
  undefined | ((parsed: ParsedClass) => string | undefined)
>;
export type ValueModifiers = Record<
  string,
  | undefined
  | ((
      parsed: ParsedClass,
      valueItem: string,
      index: number,
      length: number,
    ) => string | undefined)
>;
export type ModifierType = 'custom' | 'predefined';

export type BucketType =
  | 'base'
  | 'supports'
  | 'mnw'
  | 'mxw'
  | 'mnh'
  | 'mxh'
  | 'orientation'
  | 'stuck'
  | 'scrollable'
  | 'snapped'
  | 'prefers'
  | 'initial'
  | 'other';

export interface Bucket {
  key: string;
  type: BucketType;
  val: number;
  rule: CSSGroupingRule;
}

export interface ParsedMediaQuery {
  bucketKey: string;
  bucketQuery: string;
  bucketType: BucketType;
  bucketValue: string;
  innerBlockOpen: string;
  innerBlockClose: string;
}

export interface ParsedClass {
  sourceClass: string;
  sourceSelector: string;
  isImportant: boolean;
  isUtilityNegative: boolean;
  mediaQuery?: string;
  parentSelector?: string;
  selfSelector?: string;
  childSelector?: string;
  utilityKey: string;
  utilityValue: string;
  utilityOperator: '-' | '=';
  propType: number;
  propValue: string;
  propKeyCamel: string;
  propKeyKebab: string;
  validVariableValue: string;
  variableCategory?: string;
}

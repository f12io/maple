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
      items: Array<string>,
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
  | 'style'
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

export type MediaQueryBucketParams = [
  bucketType: BucketType,
  bucketKey: string,
  bucketVal: string,
  bucketQuery: string,
];

export interface ParsedMediaQuery {
  bucketKey: string;
  bucketQuery: string;
  bucketType: BucketType;
  bucketVal: string;
  innerBlockOpen: string;
  innerBlockClose: string;
}

export interface ParsedSelector {
  mediaQuery?: string;
  parentSel?: string;
  selfSel?: string;
  childSel?: string;
}

export interface ParsedClass {
  srcClass: string;
  srcSel: string;
  isImportant: boolean;
  isUtilNegative: boolean;
  mediaQuery?: string;
  parentSel?: string;
  selfSel?: string;
  childSel?: string;
  utilKey: string;
  utilVal: string;
  utilOp: '-' | '=';
  propType: number;
  propVal: string;
  propKeyCamel: string;
  propKeyKebab: string;
  validVarVal: string;
  varCat?: string;
}

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
  | 'scroll'
  | 'light'
  | 'dark'
  | 'prefers'
  | 'static';

export interface Bucket {
  key: string;
  type: BucketType;
  val: number;
  rule?: CSSGroupingRule;
}

export type MediaQueryBucketParams = [
  bucketType: BucketType,
  bucketKey: string,
  bucketVal: string,
  bucketQuery: string,
  rootSelector?: string,
  overrideRootSelector?: string,
];

export interface ParsedMediaQuery {
  bucketKey: string;
  bucketQuery: string;
  bucketType: BucketType;
  bucketVal: string;
  prefix: string;
  suffix: string;
  rootSelector: string;
  overrideRootSelector: string;
}

export interface ParsedSelector {
  mediaQuery?: string;
  parentSel?: string;
  selfSel?: string;
  childSel?: string;
  isMultiSelector?: boolean;
}

export interface ParsedClass {
  srcClass: string;
  srcSel: string;
  isImportant: 1 | 0;
  isUtilNegative: 1 | 0;
  isNoRef: 1 | 0;
  isDynamic: 1 | 0;
  mediaQuery?: string;
  parentSel?: string;
  selfSel?: string;
  childSel?: string;
  isMultiSelector?: boolean;
  utilKey: string;
  utilVal: string;
  utilOp: '-' | '=';
  propType: number;
  propVal: string;
  propKeyCamel: string;
  propKeyKebab: string;
  validVarVal: string;
  conflictKey?: string;
  varCat?: string;
}

export interface RuleData {
  content: string;
  overrideRule?: RuleData;
  parsedMediaQuery: ParsedMediaQuery | undefined;
  parsed: ParsedClass;
}

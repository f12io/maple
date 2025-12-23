export const predefinedUtilityMap: Record<
  string,
  {
    key: string[] | string;
    rel?: 'c' | 'd' | 'o' | 'trnsf';
    apply?: (value: string) => Record<string, string>;
  }
> = {
  size: { key: ['width', 'height'], rel: 'd' },
  gapx: { key: 'column-gap', rel: 'd' },
  gapy: { key: 'row-gap', rel: 'd' },
  translate: { key: 'translate', rel: 'trnsf' },
  scale: { key: 'scale', rel: 'trnsf' },
  rotate: { key: 'transform', rel: 'trnsf' },
  skew: { key: 'transform', rel: 'trnsf' },
  '@container': {
    key: 'container',
    rel: 'o',
    apply: (value: string) => {
      return {
        container: `${value || 'none'} / inline-size`,
      };
    },
  },
};

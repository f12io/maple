import { CSS_PROP_MAP } from '../../generated/css-props';
import { predefinedUtilityMap } from './predefined-utility-map';
import { propertiesWordShortMap } from './properties-word-short-map';
import { propertiesShortMap } from '../../../build/properties-short-map';

type WordPart = {
  text: string; // actual text used in output
  fixed: boolean; // true if from shortMap
  original: string;
};

function getAllCssProperties() {
  const props = CSS_PROP_MAP;

  const result: {
    shortMap: Record<string, string>;
    utilityMap: Record<
      string,
      { key: string | string[]; rel?: 'c' | 'd' | 'o' | 'trnsf' }
    >;
  } = {
    shortMap: Object.fromEntries(
      Object.keys(predefinedUtilityMap).map((key) => [key, key])
    ),
    utilityMap: { ...predefinedUtilityMap },
  };

  for (const prop of props) {
    if (result.shortMap[prop]) {
      continue;
    }
    const rawWords = prop.match(/([A-Z]?[a-z]+|[XY])/g) || [];
    const words = normalizeWords(rawWords);
    if (propertiesShortMap[prop]) {
      result.shortMap[propertiesShortMap[prop]] = prop;
      result.utilityMap[prop] = findRelationAndKey(words);
      continue;
    }

    const maxLen = words.map((w) => w.text.length);
    const take = words.map((w) => (w.fixed ? w.text.length : 1));

    const initials = words
      .map((w, i) => (w.fixed ? w.text : w.text[0].toLowerCase()))
      .join('');

    if (!result.shortMap[initials]) {
      result.shortMap[initials] = prop;
      result.utilityMap[prop] = findRelationAndKey(words);
      continue;
    }

    // 2️⃣ progressive backward expansion
    let expandIndex = words.length - 1; // start from LAST word
    let found = null;

    while (expandIndex >= 0) {
      // try current expansion
      const candidate = words
        .map((w, i) => w.text.slice(0, take[i]))
        .join('')
        .toLowerCase();

      if (!result.shortMap[candidate]) {
        found = candidate.toLowerCase();
        break;
      }

      // expand this word more if possible
      if (take[expandIndex] < maxLen[expandIndex]) {
        take[expandIndex]++;
      } else {
        // this word fully expanded → move to previous
        expandIndex--;
      }
    }

    if (found) {
      result.shortMap[found] = prop;
      result.utilityMap[prop] = findRelationAndKey(words);
      continue;
    }
  }

  return result;
}

function normalizeWords(words: string[]): WordPart[] {
  return words.map((w) => {
    const key = w.toLowerCase();
    if ((propertiesWordShortMap as any)[key]) {
      return {
        text: (propertiesWordShortMap as any)[key],
        fixed: true,
        original: key,
      };
    }
    return { text: w, fixed: false, original: key };
  });
}

function mapleMatcher() {
  const properties = getAllCssProperties();
  const pattern = new RegExp(`(.*)`);
  return {
    pattern,
    properties,
  };
}

const element = document.createElement('div');

function findRelationAndKey(words: Array<string | WordPart>): {
  key: string;
  rel: 'd' | 'c' | 'o' | 'trnsf';
} {
  const key = words
    .map((w) => (typeof w === 'object' ? w.original : w))
    .join('-');

  (element.style as any)[key] = '#000000';
  (element.style as any)[key] = '1rem';

  const rel =
    (element.style as any)[key] === '1rem'
      ? 'd'
      : !!(element.style as any)[key]
      ? 'c'
      : 'o';
  (element.style as any)[key] = '';
  return { key, rel };
}
const maple = mapleMatcher();
export default maple;

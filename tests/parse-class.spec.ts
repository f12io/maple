import { describe, it, expect } from 'vitest';
import { parseClass } from '../src/core/parser';
import { ParsedClass } from '../src/core/types';

type Case = {
  name: string;
  input: string;
  expected: ParsedClass;
};

const cases: Case[] = [
  {
    name: 'simple utility dimension',
    input: 'p-4',
    expected: {
      raw: 'p-4',
      variants: [],
      parentSelector: null,
      childSelector: null,
      utility: 'p-4',
      important: false,
    },
  },
  {
    name: 'simple utility with equality',
    input: 'gtc=1fr_1fr_2fr_1fr',
    expected: {
      raw: 'gtc=1fr_1fr_2fr_1fr',
      variants: [],
      parentSelector: null,
      childSelector: null,
      utility: 'gtc=1fr 1fr 2fr 1fr',
      important: false,
    },
  },
  {
    name: 'trims whitespace',
    input: '  p-4  ',
    expected: {
      raw: 'p-4',
      variants: [],
      parentSelector: null,
      childSelector: null,
      utility: 'p-4',
      important: false,
    },
  },
  {
    name: 'important modifier',
    input: 'p-4!',
    expected: {
      raw: 'p-4',
      variants: [],
      parentSelector: null,
      childSelector: null,
      utility: 'p-4',
      important: true,
    },
  },
  {
    name: 'single variant',
    input: 'hover:bg-red',
    expected: {
      raw: 'hover:bg-red',
      variants: ['hover'],
      parentSelector: null,
      childSelector: null,
      utility: 'bg-red',
      important: false,
    },
  },
  {
    name: 'variant with important',
    input: 'hover:bg-red!',
    expected: {
      raw: 'hover:bg-red',
      variants: ['hover'],
      parentSelector: null,
      childSelector: null,
      utility: 'bg-red',
      important: true,
    },
  },
  {
    name: 'parent selector only',
    input: '^.dark:bg-black',
    expected: {
      raw: '^.dark:bg-black',
      variants: [],
      parentSelector: '.dark',
      childSelector: null,
      utility: 'bg-black',
      important: false,
    },
  },
  {
    name: 'parent selector + variant',
    input: '^.dark:hover:bg-black',
    expected: {
      raw: '^.dark:hover:bg-black',
      variants: [],
      parentSelector: '.dark:hover',
      childSelector: null,
      utility: 'bg-black',
      important: false,
    },
  },
  {
    name: 'variant + parent selector',
    input: 'hover:^.dark:bg-black',
    expected: {
      raw: 'hover:^.dark:bg-black',
      variants: ['hover'],
      parentSelector: '.dark',
      childSelector: null,
      utility: 'bg-black',
      important: false,
    },
  },
  {
    name: 'parent + variant + important',
    input: '^.dark:hover:bg-black!',
    expected: {
      raw: '^.dark:hover:bg-black',
      variants: [],
      parentSelector: '.dark:hover',
      childSelector: null,
      utility: 'bg-black',
      important: true,
    },
  },
  {
    name: 'complex parent selector',
    input: '^.dark>>.card:hover:c-white',
    expected: {
      raw: '^.dark>>.card:hover:c-white',
      variants: [],
      parentSelector: '.dark .card:hover',
      childSelector: null,
      utility: 'c-white',
      important: false,
    },
  },
  {
    name: 'complex parent with variant selector',
    input: 'md:^.dark>>.card:hover:c-white',
    expected: {
      raw: 'md:^.dark>>.card:hover:c-white',
      variants: ['md'],
      parentSelector: '.dark .card:hover',
      childSelector: null,
      utility: 'c-white',
      important: false,
    },
  },
  /* -------------------- CHILD SELECTOR -------------------- */
  {
    name: 'child selector',
    input: '/span:c-red',
    expected: {
      raw: '/span:c-red',
      variants: [],
      parentSelector: null,
      childSelector: 'span',
      utility: 'c-red',
      important: false,
    },
  },
  {
    name: 'one level child selector',
    input: '/>span:c-red',
    expected: {
      raw: '/>span:c-red',
      variants: [],
      parentSelector: null,
      childSelector: '>span',
      utility: 'c-red',
      important: false,
    },
  },
  {
    name: 'child selector with "+"',
    input: '/span+.title:c-red',
    expected: {
      raw: '/span+.title:c-red',
      variants: [],
      parentSelector: null,
      childSelector: 'span+.title',
      utility: 'c-red',
      important: false,
    },
  },
  {
    name: 'child selector with >> expansion',
    input: '/.card>>.title:text-lg',
    expected: {
      raw: '/.card>>.title:text-lg',
      variants: [],
      parentSelector: null,
      childSelector: '.card .title',
      utility: 'text-lg',
      important: false,
    },
  },
  {
    name: 'child selector with variant',
    input: 'md:/.card>>.title:fs-lg',
    expected: {
      raw: 'md:/.card>>.title:fs-lg',
      variants: ['md'],
      parentSelector: null,
      childSelector: '.card .title',
      utility: 'fs-lg',
      important: false,
    },
  },
  {
    name: 'child selector with multiple variant',
    input: 'md:hover:/.card>>.title:fs-lg',
    expected: {
      raw: 'md:hover:/.card>>.title:fs-lg',
      variants: ['md', 'hover'],
      parentSelector: null,
      childSelector: '.card .title',
      utility: 'fs-lg',
      important: false,
    },
  },
  /* -------------------- PARENT + CHILD -------------------- */
  {
    name: 'parent + child selector',
    input: '^.dark/span:c-white',
    expected: {
      raw: '^.dark/span:c-white',
      variants: [],
      parentSelector: '.dark',
      childSelector: 'span',
      utility: 'c-white',
      important: false,
    },
  },
  /* -------------------- FULL COMBINATION -------------------- */
  {
    name: 'variant + parent + child + important',
    input: 'hover:^.dark/span:c-white!',
    expected: {
      raw: 'hover:^.dark/span:c-white',
      variants: ['hover'],
      parentSelector: '.dark',
      childSelector: 'span',
      utility: 'c-white',
      important: true,
    },
  },
  /* -------------------- COMPLEX SELECTORS -------------------- */
  {
    name: 'complex parent and child selectors',
    input: '^.dark>>.card:hover/.title>>span:fs-xl',
    expected: {
      raw: '^.dark>>.card:hover/.title>>span:fs-xl',
      variants: [],
      parentSelector: '.dark .card:hover',
      childSelector: '.title span',
      utility: 'fs-xl',
      important: false,
    },
  },
  {
    name: 'complex parent and child selectors with variant and important',
    input: 'hover:^.dark/.title:bg-orange-500!',
    expected: {
      raw: 'hover:^.dark/.title:bg-orange-500',
      variants: ['hover'],
      parentSelector: '.dark',
      childSelector: '.title',
      utility: 'bg-orange-500',
      important: true,
    },
  },
  {
    name: 'complex parent and child selectors with multiple variant',
    input: 'md:hover:^.dark:hover/.title:focus:bg-orange-500!',
    expected: {
      raw: 'md:hover:^.dark:hover/.title:focus:bg-orange-500',
      variants: ['md', 'hover'],
      parentSelector: '.dark:hover',
      childSelector: '.title:focus',
      utility: 'bg-orange-500',
      important: true,
    },
  },
  /* -------------------- CONTAINER QUERIES -------------------- */
  {
    name: 'container utility',
    input: '@container',
    expected: {
      raw: '@container',
      variants: [],
      parentSelector: null,
      childSelector: null,
      utility: '@container=none',
      important: false,
    },
  },
  {
    name: 'container utility with name',
    input: '@container(card)',
    expected: {
      raw: '@container(card)',
      variants: [],
      parentSelector: null,
      childSelector: null,
      utility: '@container=card',
      important: false,
    },
  },
  {
    name: 'contained breakpoint',
    input: '@md:p-4',
    expected: {
      raw: '@md:p-4',
      variants: [{ name: 'md', containerName: 'none' }],
      parentSelector: null,
      childSelector: null,
      utility: 'p-4',
      important: false,
    },
  },
  {
    name: 'contained breakpoint',
    input: '@md(asd):p-4',
    expected: {
      raw: '@md(asd):p-4',
      variants: [{ name: 'md', containerName: 'asd' }],
      parentSelector: null,
      childSelector: null,
      utility: 'p-4',
      important: false,
    },
  },
  /* CUSTOM BREAKPOINTS */
  {
    name: 'custom breakpoint min-width',
    input: 'min=400px:p-4',
    expected: {
      raw: 'min=400px:p-4',
      variants: [{ name: 'min', size: '400px' }],
      parentSelector: null,
      childSelector: null,
      utility: 'p-4',
      important: false,
    },
  },
  {
    name: 'custom breakpoint max-width',
    input: 'max=800px:p-4',
    expected: {
      raw: 'max=800px:p-4',
      variants: [{ name: 'max', size: '800px' }],
      parentSelector: null,
      childSelector: null,
      utility: 'p-4',
      important: false,
    },
  },
  {
    name: 'default breakpoint convert to max-width',
    input: 'max-md:p-4',
    expected: {
      raw: 'max-md:p-4',
      variants: [{ name: 'max', size: 'md' }],
      parentSelector: null,
      childSelector: null,
      utility: 'p-4',
      important: false,
    },
  },
  {
    name: 'custom breakpoint min-width with container',
    input: '@min=400px:p-4',
    expected: {
      raw: '@min=400px:p-4',
      variants: [{ name: 'min', size: '400px', containerName: 'none' }],
      parentSelector: null,
      childSelector: null,
      utility: 'p-4',
      important: false,
    },
  },
  {
    name: 'custom breakpoint max-width with container',
    input: '@max=800px:p-4',
    expected: {
      raw: '@max=800px:p-4',
      variants: [{ name: 'max', size: '800px', containerName: 'none' }],
      parentSelector: null,
      childSelector: null,
      utility: 'p-4',
      important: false,
    },
  },
  {
    name: 'custom breakpoint min-width with container name',
    input: '@min=400px(test):p-4',
    expected: {
      raw: '@min=400px(test):p-4',
      variants: [{ name: 'min', size: '400px', containerName: 'test' }],
      parentSelector: null,
      childSelector: null,
      utility: 'p-4',
      important: false,
    },
  },
  {
    name: 'default breakpoint convert to max-width with container name',
    input: '@max-lg(test):p-4',
    expected: {
      raw: '@max-lg(test):p-4',
      variants: [{ name: 'max', size: 'lg', containerName: 'test' }],
      parentSelector: null,
      childSelector: null,
      utility: 'p-4',
      important: false,
    },
  },
];

describe('parseClass (table-driven)', () => {
  it.each(cases)('$name', ({ input, expected }) => {
    expect(parseClass(input)).toEqual(expected);
  });
});

import { batchConv } from '../lib/index';
import { getter } from './mediawiki-mock';


describe('batchConv', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('works', () => {
    test.each([
      { locale: 'zh', expected: { locale: 'zh', 'lovely-str': "I'm a lovely string", SearchHint: '搜索包含$1的页面' } },
      { locale: 'zh-hans', expected: { locale: 'hans', 'lovely-str': "I'm a lovely string", SearchHint: '搜索包含$1的页面' } },
      { locale: 'zh-hant', expected: { locale: 'hant', 'lovely-str': "I'm a lovely string", SearchHint: '搜尋包含$1的頁面' } },
      { locale: 'zh-cn', expected: { locale: 'cn', 'lovely-str': "I'm a lovely string", SearchHint: '搜索包含$1的页面' } },
      { locale: 'zh-sg', expected: { locale: 'sg', 'lovely-str': "I'm a lovely string", SearchHint: '搜索包含$1的页面' } },
      { locale: 'zh-my', expected: { locale: 'my', 'lovely-str': "I'm a lovely string", SearchHint: '搜索包含$1的页面' } },
      { locale: 'zh-mo', expected: { locale: 'mo', 'lovely-str': "I'm a lovely string", SearchHint: '搜尋包含$1的頁面' } },
      { locale: 'zh-hk', expected: { locale: 'hk', 'lovely-str': "I'm a lovely string", SearchHint: '搜尋包含$1的頁面' } },
      { locale: 'zh-tw', expected: { locale: 'tw', 'lovely-str': "I'm a lovely string", SearchHint: '搜尋包含$1的頁面' } },
      { locale: 'en', expected: { locale: 'other', 'lovely-str': "I'm a lovely string", SearchHint: '搜索包含$1的页面' } },
      { locale: 'fr', expected: { locale: 'other', 'lovely-str': "I'm a lovely string", SearchHint: '搜索包含$1的页面' } },
    ])('in $locale', ({ locale, expected }) => {
      getter.mockReturnValue(locale);

      expect(batchConv({
        locale: {
          zh: 'zh',
          hans: 'hans',
          hant: 'hant',
          cn: 'cn',
          tw: 'tw',
          hk: 'hk',
          mo: 'mo',
          my: 'my',
          sg: 'sg',
          other: 'other',
        },
        'lovely-str': "I'm a lovely string",
        SearchHint: { hans: '搜索包含$1的页面', hant: '搜尋包含$1的頁面' },
      })).toStrictEqual(expected);
    });
  });

  describe('returns string when erroneous inputs are given', () => {
    test.each([
      { locale: 'zh', expected: { notStr: '1', innerNotStr: '2', innerEmpty: '' } },
      { locale: 'zh-hans', expected: { notStr: '1', innerNotStr: '2', innerEmpty: '' } },
      { locale: 'zh-hant', expected: { notStr: '1', innerNotStr: '2', innerEmpty: '' } },
      { locale: 'zh-cn', expected: { notStr: '1', innerNotStr: '2', innerEmpty: '' } },
      { locale: 'zh-sg', expected: { notStr: '1', innerNotStr: '2', innerEmpty: '' } },
      { locale: 'zh-my', expected: { notStr: '1', innerNotStr: '2', innerEmpty: '' } },
      { locale: 'zh-mo', expected: { notStr: '1', innerNotStr: '2', innerEmpty: '' } },
      { locale: 'zh-hk', expected: { notStr: '1', innerNotStr: '2', innerEmpty: '' } },
      { locale: 'zh-tw', expected: { notStr: '1', innerNotStr: '2', innerEmpty: '' } },
      { locale: 'en', expected: { notStr: '1', innerNotStr: '2', innerEmpty: '' } },
      { locale: 'fr', expected: { notStr: '1', innerNotStr: '2', innerEmpty: '' } },
      { locale: null, expected: { notStr: '1', innerNotStr: '2', innerEmpty: '' } },
    ])('in $locale', ({ locale, expected }) => {
      getter.mockReturnValue(locale);

      expect(batchConv({
        /// @ts-expect-error For testing
        notStr: 1,
        /// @ts-expect-error For testing
        innerNotStr: { zh: 2 },
        innerEmpty: {},
      })).toStrictEqual(expected);
    });
  });

  test('return empty object when receiving one', () => {
    expect(batchConv({})).toStrictEqual({});
  });

  test('throws when receiving a non-object', () => {
    /// @ts-expect-error For testing
    expect(() => batchConv(1)).toThrow(TypeError);
  });
});

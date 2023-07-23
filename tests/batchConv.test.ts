import { batchConv } from '../lib/index';
import { getter } from './mediawiki-mock';


describe('batchConv', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('works', () => {
    const RAW_MSG = {
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
    };

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

      expect(batchConv(RAW_MSG)).toStrictEqual(expected);
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

import { HanAssist } from '../lib/HanAssist';
import { getter } from './mediawiki-mock';

/**
 * Remove prototype members of an object literal.
 * @param obj object
 * @return striped object
 */
function stripePrototype(obj: object): object {
  return Object.assign(Object.create(null), obj);
}

describe('HanAssist.parse', () => {
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
      { locale: 'zh', expected: stripePrototype({ locale: 'zh', 'lovely-str': "I'm a lovely string", SearchHint: '搜索包含$1的页面' }) },
      { locale: 'zh-hans', expected: stripePrototype({ locale: 'hans', 'lovely-str': "I'm a lovely string", SearchHint: '搜索包含$1的页面' }) },
      { locale: 'zh-hant', expected: stripePrototype({ locale: 'hant', 'lovely-str': "I'm a lovely string", SearchHint: '搜尋包含$1的頁面' }) },
      { locale: 'zh-cn', expected: stripePrototype({ locale: 'cn', 'lovely-str': "I'm a lovely string", SearchHint: '搜索包含$1的页面' }) },
      { locale: 'zh-sg', expected: stripePrototype({ locale: 'sg', 'lovely-str': "I'm a lovely string", SearchHint: '搜索包含$1的页面' }) },
      { locale: 'zh-my', expected: stripePrototype({ locale: 'my', 'lovely-str': "I'm a lovely string", SearchHint: '搜索包含$1的页面' }) },
      { locale: 'zh-mo', expected: stripePrototype({ locale: 'mo', 'lovely-str': "I'm a lovely string", SearchHint: '搜尋包含$1的頁面' }) },
      { locale: 'zh-hk', expected: stripePrototype({ locale: 'hk', 'lovely-str': "I'm a lovely string", SearchHint: '搜尋包含$1的頁面' }) },
      { locale: 'zh-tw', expected: stripePrototype({ locale: 'tw', 'lovely-str': "I'm a lovely string", SearchHint: '搜尋包含$1的頁面' }) },
      { locale: 'en', expected: stripePrototype({ locale: 'other', 'lovely-str': "I'm a lovely string", SearchHint: '搜索包含$1的页面' }) },
      { locale: 'fr', expected: stripePrototype({ locale: 'other', 'lovely-str': "I'm a lovely string", SearchHint: '搜索包含$1的页面' }) },
    ])('in $locale', ({ locale, expected }) => {
      getter.mockReturnValue(locale);

      expect(HanAssist.parse(RAW_MSG)).toStrictEqual(expected);
    });
  });

  test('return empty object when receiving one', () => {
    expect(HanAssist.parse({})).toStrictEqual(Object.create(null));
  });

  test('throws when receiving a non-object', () => {
    /// @ts-expect-error For testing
    expect(() => HanAssist.parse(1)).toThrow(TypeError);
  });
});

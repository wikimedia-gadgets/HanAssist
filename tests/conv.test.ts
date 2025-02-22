import { conv } from '../lib/index';
import { getter } from './mediawiki-mock';

describe('conv', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('handles full candidates', () => {
    const CANDIDATES = {
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
    };

    test.each([
      { locale: 'zh', expected: 'zh' },
      { locale: 'zh-hans', expected: 'hans' },
      { locale: 'zh-hant', expected: 'hant' },
      { locale: 'zh-cn', expected: 'cn' },
      { locale: 'zh-sg', expected: 'sg' },
      { locale: 'zh-my', expected: 'my' },
      { locale: 'zh-mo', expected: 'mo' },
      { locale: 'zh-hk', expected: 'hk' },
      { locale: 'zh-tw', expected: 'tw' },
      { locale: 'en', expected: 'other' },
      { locale: 'fr', expected: 'other' },
      { locale: null, expected: 'other' },
    ])('in $locale', ({ locale, expected }) => {
      getter.mockReturnValue(locale);

      expect(conv(CANDIDATES)).toBe(expected);
    });
  });

  describe('handles hans & hant only candidates', () => {
    const CANDIDATES = { hans: '一天一苹果，医生远离我。', hant: '一天一蘋果，醫生遠離我。' };

    test.each([
      { locale: 'zh', expected: '一天一苹果，医生远离我。' },
      { locale: 'zh-hans', expected: '一天一苹果，医生远离我。' },
      { locale: 'zh-hant', expected: '一天一蘋果，醫生遠離我。' },
      { locale: 'zh-cn', expected: '一天一苹果，医生远离我。' },
      { locale: 'zh-sg', expected: '一天一苹果，医生远离我。' },
      { locale: 'zh-my', expected: '一天一苹果，医生远离我。' },
      { locale: 'zh-mo', expected: '一天一蘋果，醫生遠離我。' },
      { locale: 'zh-hk', expected: '一天一蘋果，醫生遠離我。' },
      { locale: 'zh-tw', expected: '一天一蘋果，醫生遠離我。' },
      { locale: 'en', expected: '一天一苹果，医生远离我。' },
      { locale: 'fr', expected: '一天一苹果，医生远离我。' },
      { locale: null, expected: '一天一苹果，医生远离我。' },
    ])('in $locale', ({ locale, expected }) => {
      getter.mockReturnValue(locale);

      expect(conv(CANDIDATES)).toBe(expected);
    });
  });

  describe('handles partial candidates', () => {
    const CANDIDATES = { cn: 'IP用户', tw: 'IP使用者', hk: 'IP用戶' };

    test.each([
      { locale: 'zh', expected: 'IP用户' },
      { locale: 'zh-hans', expected: 'IP用户' },
      { locale: 'zh-hant', expected: 'IP使用者' },
      { locale: 'zh-cn', expected: 'IP用户' },
      { locale: 'zh-sg', expected: 'IP用户' },
      { locale: 'zh-my', expected: 'IP用户' },
      { locale: 'zh-mo', expected: 'IP用戶' },
      { locale: 'zh-hk', expected: 'IP用戶' },
      { locale: 'zh-tw', expected: 'IP使用者' },
      { locale: 'en', expected: 'IP用户' },
      { locale: 'fr', expected: 'IP用户' },
    ])('in $locale', ({ locale, expected }) => {
      getter.mockReturnValue(locale);

      expect(conv(CANDIDATES)).toBe(expected);
    });
  });

  describe('returns string when receiving malformed candidates', () => {
    const CANDIDATES = {
      zh: 123,
      hans: Symbol(),
      hant: () => { },
      cn: {
        toString() {
          return 123;
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      tw: Object.create(null),
      hk: Function,
      mo: {
        valueOf() {
          return 123;
        },
      },
      my: true,
      sg: BigInt(123),
    };

    test.each([
      { locale: 'zh', expected: '123' },
      { locale: 'zh-hans', expected: 'Symbol()' },
      { locale: 'zh-hant', expected: '() => { }' },
      { locale: 'zh-cn', expected: '123' },
      { locale: 'zh-sg', expected: '123' },
      { locale: 'zh-my', expected: 'true' },
      { locale: 'zh-mo', expected: '[object Object]' },
      { locale: 'zh-hk', expected: Function.toString() },
      { locale: 'zh-tw', expected: '[object Object]' },
    ])('in $locale', ({ locale, expected }) => {
      getter.mockReturnValue(locale);

      /// @ts-expect-error For testing
      expect(conv(CANDIDATES)).toBe(expected);
    });
  });

  test('throws when first parameter is not object', () => {
    /// @ts-expect-error For testing
    expect(() => conv(1)).toThrow(TypeError);
  });
});

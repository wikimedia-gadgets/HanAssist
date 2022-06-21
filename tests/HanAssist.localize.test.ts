import { HanAssist } from '../src/HanAssist';
import { getter } from './mediawiki-mock';

describe( 'HanAssist.localize', () => {
	afterEach( () => {
		jest.restoreAllMocks();
	} );

	describe( 'handles full candidates', () => {
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
			other: 'other'
		};

		test.each( [
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
			{ locale: 'fr', expected: 'other' }
		] )( 'return correct string in $locale', ( { locale, expected } ) => {
			getter.mockReturnValue( locale );

			expect( HanAssist.localize( CANDIDATES ) ).toBe( expected );
		} );
	} );

	describe( 'handles hans & hant only candidates', () => {
		const CANDIDATES = { hans: '一天一苹果，医生远离我。', hant: '一天一蘋果，醫生遠離我。' };

		test.each( [
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
			{ locale: 'fr', expected: '一天一苹果，医生远离我。' }
		] )( 'return correct string in $locale', ( { locale, expected } ) => {
			getter.mockReturnValue( locale );

			expect( HanAssist.localize( CANDIDATES ) ).toBe( expected );
		} );
	} );


	describe( 'handles partial candidates', () => {
		const CANDIDATES = { cn: 'IP用户', tw: 'IP使用者', hk: 'IP用戶' };

		test.each( [
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
			{ locale: 'fr', expected: 'IP用户' }
		] )( 'return correct string in $locale', ( { locale, expected } ) => {
			getter.mockReturnValue( locale );

			expect( HanAssist.localize( CANDIDATES ) ).toBe( expected );
		} );
	} );
} );

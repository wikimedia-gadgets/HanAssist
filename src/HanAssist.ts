/**
 * @file Provides a class to handle Chinese variant conversions.
 * For license information please see LICENSE.
 */

import { Candidates, safelyElect } from './elect';
import { safelyToString } from './utils';

/**
 * Helper to handle Chinese variant conversions.
 */
interface HanAssistStatic {
	/**
	 * Parse a list of candidate messages.
	 * @example Assuming `wgUserLanguage` is set to `zh-cn`:
```
HanAssist.parse( {
	apple: { hans: '苹果', hant: '蘋果', other: 'apple' },
	banana: { hans: '香蕉', hant: '香蕉', other: 'banana' }
} ); // => { apple: '苹果', banana: '香蕉' }

// Use with mw.messages is encouraged.
mw.messages.set( HanAssist.parse( {
	apple: { hans: '苹果', hant: '蘋果', other: 'apple' },
	banana: { hans: '香蕉', hant: '香蕉', other: 'banana' }
} ) );

mw.msg( 'apple' ); // => 苹果
```
	 * @param rawMsg raw messages
	 * @param options
	 * @param options.locale locale, default to `wgUserLanguage`
	 * @return transpiled messages
	 */
	parse: ( rawMsg: Record<string, Candidates | string>,
		options?: { locale?: string } ) => Record<string, string>,

	/**
	 * Return the string, if any, in the current user language.
	 * @example Assuming `wgUserLanguage` is set to `zh-cn`:
```
HanAssist.localize( { hans: '一天一苹果，医生远离我。', hant: '一天一蘋果，醫生遠離我。' } ); // => 一天一苹果，医生远离我。

HanAssist.localize( { cn: 'IP用户', tw: 'IP使用者', hk: 'IP用戶' } ); // ==> IP用户

// Advanced: custom locale
HanAssist.localize(
{ hans: '一天一苹果，医生远离我。', hant: '一天一蘋果，醫生遠離我。' },
{ locale: 'zh-tw' }
); // => 一天一蘋果，醫生遠離我。
```
	 * @param candidates candidate messages
	 * @param options
	 * @param options.locale locale, default to `wgUserLanguage`
	 * @return selected string
	 */
	localize: ( candidates: string | Candidates, options?: { locale?: string } ) => string,

	/**
	 * Return the string, if any, in the current user variant.
	 *
	 * If `wgUserVariant` is undefined, preferred variant in Special:Preference will be used.
	 * @example Assuming preferred variant is `zh-cn`:
	```
	HanAssist.vary( { hans: '一天一苹果，医生远离我。', hant: '一天一蘋果，醫生遠離我。' } ); // => 一天一苹果，医生远离我。
	```
	 * @param candidates candidate messages
	 * @return message in the current user variant
	 */
	vary: ( candidates: string | Candidates ) => string
}


const HanAssist: HanAssistStatic = {
	parse( rawMsg, { locale = mw.config.get( 'wgUserLanguage' ) } = {} ) {
		if ( typeof locale !== 'string' ) {
			locale = safelyToString( locale );
		}
		if ( !$.isPlainObject( rawMsg ) || $.isEmptyObject( rawMsg ) ) {
			return Object.create( null );
		}

		const transpiledMsg: Record<string, string> = Object.create( null );
		for ( const key in rawMsg ) {
			transpiledMsg[ key ] = safelyElect( rawMsg[ key ], locale );
		}
		return transpiledMsg;
	},

	localize( candidates, { locale = mw.config.get( 'wgUserLanguage' ) } = {} ) {
		return safelyElect( candidates, locale );
	},

	vary( candidates ) {
		return safelyElect(
			candidates,
			mw.config.get( 'wgUserVariant' ) || mw.user.options.get( 'variant' )
		);
	}
};

export { HanAssistStatic, HanAssist };

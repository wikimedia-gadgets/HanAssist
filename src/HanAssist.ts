/**
 * @file Provides a class to handle Chinese variant conversions.
 * For license information please see LICENSE.
 */

import { Candidates, safelyElect } from './elect';
import { raiseInvalidParamError } from './utils';

/**
 * Helper to handle Chinese variant conversions.
 */
abstract class HanAssist {
	/**
	 * Parse a list of candidate messages.
	 * @example Assuming `wgUserLanguage` is set to `zh-cn`:
```
HanAssist.parse( {
	apple: { hans: '苹果', hant: '蘋果', en: 'apple' },
	banana: { hans: '香蕉', hant: '香蕉', en: 'banana' }
} ); // => { apple: '苹果', banana: '香蕉' }

// Use with mw.messages is encouraged.
mw.messages.set( HanAssist.parse( {
	apple: { hans: '苹果', hant: '蘋果', en: 'apple' },
	banana: { hans: '香蕉', hant: '香蕉', en: 'banana' }
} ) );

mw.msg( 'apple' ); // => 苹果
```
	 * @param rawMsg raw messages
	 * @param [option]
	 * @param [option.locale] locale, default to `wgUserLanguage`
	 * @return transpiled messages
	 */
	static parse(
		rawMsg: Record<string, Candidates | string>,
		{ locale = mw.config.get( 'wgUserLanguage' ) } = {}
	): Record<string, string> {
		if ( typeof locale !== 'string' ) {
			raiseInvalidParamError( 'locale', 'string' );
		}
		if ( !$.isPlainObject( rawMsg ) || $.isEmptyObject( rawMsg ) ) {
			raiseInvalidParamError( 'rawMsg', 'RawMessages' );
		}

		const transpiledMsg: Record<string, string> = Object.create( null );
		for ( const key in rawMsg ) {
			transpiledMsg[ key ] = safelyElect( rawMsg[ key ], locale );
		}
		return transpiledMsg;
	}

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
	 * @param candidates
	 * @param [candidates.zh] message in `zh`
	 * @param [candidates.hans] message in `zh-hans`
	 * @param [candidates.hant] message in `zh-hant`
	 * @param [candidates.cn] message in `zh-cn`
	 * @param [candidates.tw] message in `zh-tw`
	 * @param [candidates.hk] message in `zh-hk`
	 * @param [candidates.sg] message in `zh-sg`
	 * @param [candidates.mo] message in `zh-mo`
	 * @param [candidates.my] message in `zh-my`
	 * @param [candidates.en] message in `en`
	 * @param [options]
	 * @param [options.locale] locale, default to `wgUserLanguage`
	 * @return selected string
	 */
	static localize(
		candidates: string | Candidates, { locale = mw.config.get( 'wgUserLanguage' ) } = {}
	): string {
		return safelyElect( candidates, locale );
	}

	/**
	 * Return the string, if any, in the current user variant.
	 *
	 * If `wgUserVariant` is undefined, preferred variant in Special:Preference will be used.
	 * @example Assuming preferred variant is `zh-cn`:
```
HanAssist.vary( { hans: '一天一苹果，医生远离我。', hant: '一天一蘋果，醫生遠離我。' } ); // => 一天一苹果，医生远离我。
```
	 * @param candidates
	 * @param [candidates.zh] message in `zh`
	 * @param [candidates.hans] message in `zh-hans`
	 * @param [candidates.hant] message in `zh-hant`
	 * @param [candidates.cn] message in `zh-cn`
	 * @param [candidates.tw] message in `zh-tw`
	 * @param [candidates.hk] message in `zh-hk`
	 * @param [candidates.sg] message in `zh-sg`
	 * @param [candidates.mo] message in `zh-mo`
	 * @param [candidates.my] message in `zh-my`
	 * @param [candidates.en] message in `en`
	 * @return message in the current user variant
	 */
	static vary( candidates: string | Candidates ): string {
		return safelyElect(
			candidates,
			mw.config.get( 'wgUserVariant' ) || mw.user.options.get( 'variant' )
		);
	}
}

export default HanAssist;

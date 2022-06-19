/**
 * @file Provides a class to handle Chinese variant conversions.
 * For license information please see LICENSE.
 */

import { Candidates, safelyElect } from './elect';

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
	parse( rawMsg: Record<string, Candidates | string>,
		options?: { locale?: string } ): Record<string, string>;

	/**
	 * Return the string, if any, in the current user language.
	 * @example Assuming `wgUserLanguage` is set to `zh-cn`:
```
HanAssist.localize( { hans: '一天一苹果，医生远离我。', hant: '一天一蘋果，醫生遠離我。' } ); // => 一天一苹果，医生远离我。

HanAssist.localize( { cn: 'IP用户', tw: 'IP使用者', hk: 'IP用戶' } ); // ==> IP用户
```
	 * @param candidates candidate messages
	 * @return selected string
	 */
	localize( candidates: Candidates ): string;

	/**
	 * Return the string, if any, in the current user language.
	 * @example Assuming `wgUserLanguage` is set to `zh-cn`:
```
HanAssist.localize( '一天一苹果，医生远离我。', '一天一蘋果，醫生遠離我。' ); // => 一天一苹果，医生远离我。
```
	 * @param hans message in `zh-hans`
	 * @param hant message in `zh-hant`
	 * @param cn message in `zh-cn`
	 * @param tw message in `zh-tw`
	 * @param hk message in `zh-hk`
	 * @param sg message in `zh-sg`
	 * @param zh message in `zh`
	 * @param mo message in `zh-mo`
	 * @param my message in `zh-my`
	 * @return selected string
	 */
	localize( hans?: string, hant?: string, cn?: string, tw?: string, hk?: string,
		sg?: string, zh?: string, mo?: string, my?: string ): string;

	/**
	 * Return the string, if any, in the current user variant.
	 *
	 * If `wgUserVariant` is undefined, preferred variant in Special:Preference will be used.
	 * @example Assuming preferred variant is `zh-cn`:
	```
HanAssist.vary( { hans: '一天一苹果，医生远离我。', hant: '一天一蘋果，醫生遠離我。' } ); // => 一天一苹果，医生远离我。

HanAssist.vary( { cn: 'IP用户', tw: 'IP使用者', hk: 'IP用戶' } ); // ==> IP用户
	```
	 * @param candidates candidate messages
	 * @return message in the current user variant
	 */
	vary( candidates: Candidates ): string;

	/**
	 * Return the string, if any, in the current user variant.
	 *
	 * If `wgUserVariant` is undefined, preferred variant in Special:Preference will be used.
	 * @example Assuming preferred variant is `zh-cn`:
```
HanAssist.vary( '一天一苹果，医生远离我。', '一天一蘋果，醫生遠離我。' ); // => 一天一苹果，医生远离我。
```
	 * @param hans message in `zh-hans`
	 * @param hant message in `zh-hant`
	 * @param cn message in `zh-cn`
	 * @param tw message in `zh-tw`
	 * @param hk message in `zh-hk`
	 * @param sg message in `zh-sg`
	 * @param zh message in `zh`
	 * @param mo message in `zh-mo`
	 * @param my message in `zh-my`
	 * @return selected string
	 */
	vary( hans?: string, hant?: string, cn?: string, tw?: string, hk?: string,
		sg?: string, zh?: string, mo?: string, my?: string ): string;
}

/**
 * Preprocess parameters from localize() and vary().
 * @private
 * @param locale locale
 * @param hansOrCandidates candidates or message in `zh-hans`
 * @param hant message in `zh-hant`
 * @param cn message in `zh-cn`
 * @param tw message in `zh-tw`
 * @param hk message in `zh-hk`
 * @param sg message in `zh-sg`
 * @param zh message in `zh`
 * @param mo message in `zh-mo`
 * @param my message in `zh-my`
 * @return selected entry
 */
function preprocess( locale: string, hansOrCandidates?: string | Candidates,
	hant?: string, cn?: string, tw?: string, hk?: string, sg?: string,
	zh?: string, mo?: string, my?: string ): string {
	let candidates: Candidates;
	// Only a loose type check since it has no effect in compiled js
	if ( $.isPlainObject( hansOrCandidates ) ) {
		candidates = hansOrCandidates as Candidates;
	} else {
		candidates = {
			hans: hansOrCandidates as string | undefined,
			hant, cn, tw, hk, sg, zh, mo, my
		};
	}
	return safelyElect( candidates, locale );
}

const HanAssist: HanAssistStatic = {
	parse( rawMsg, { locale = mw.config.get( 'wgUserLanguage' ) } = {} ) {
		if ( !$.isPlainObject( rawMsg ) ) {
			throw new TypeError( 'Required an object' );
		}

		const transpiledMsg: Record<string, string> = Object.create( null );
		for ( const key in rawMsg ) {
			transpiledMsg[ key ] = safelyElect( rawMsg[ key ], locale );
		}
		return transpiledMsg;
	},

	localize( hansOrCandidates?: string | Candidates, hant?: string,
		cn?: string, tw?: string, hk?: string, sg?: string, zh?: string,
		mo?: string, my?: string ): string {
		return preprocess(
			mw.config.get( 'wgUserLanguage' ),
			hansOrCandidates, hant, cn, tw, hk, sg, zh, mo, my
		);
	},


	vary( hansOrCandidates?: string | Candidates, hant?: string,
		cn?: string, tw?: string, hk?: string, sg?: string, zh?: string,
		mo?: string, my?: string ): string {
		return preprocess(
			mw.config.get( 'wgUserVariant' ) || mw.user.options.get( 'variant' ),
			hansOrCandidates, hant, cn, tw, hk, sg, zh, mo, my
		);
	}
};

export { HanAssistStatic, HanAssist };

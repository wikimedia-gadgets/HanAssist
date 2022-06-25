/**
 * @file TypeScript definitions for HanAssist.
 * For license information please see LICENSE.
 */

/* eslint-disable */

/**
 * Empty object for third-party libraries, for cases where you don't
 * want to add a new global, or the global is bad and needs containment
 * or wrapping.
 */
declare namespace mw.libs {
	type CandidateKeys = 'zh' | 'hans' | 'hant' | 'cn' | 'tw' | 'hk' | 'sg' | 'mo' | 'my' | 'other';

	type _RequireAtLeastOne<T> = {
		[ K in keyof T ]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
	}[ keyof T ];

	type Candidates = _RequireAtLeastOne<Record<CandidateKeys, string>>;

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

	const HanAssist: HanAssistStatic;
}

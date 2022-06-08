/**
 * @file Provides a class to handle Chinese variant conversions.
 * For license information please see LICENSE.
 */

import { batchElect, safelyElect } from './elect';
import { TranspiledMessages, SimilarityKeyPair, RawMessages, Candidates } from './types';
import { raiseInvalidParamError, similarity } from './utils';

/**
 * Helper class to handle Chinese variant conversions.
 */
export default class HanAssist {
	private _messages: TranspiledMessages;
	private _warnedBucket: Record<string, boolean>;

	/**
	 * Instantiate a new instance of {@link HanAssist}.
	 * @example Assume `wgUserLanguage` is set to `zh-cn`:
```
let ha = new HanAssist( {
	'article': { hans: '条目', hant: '條目' },
	'category': { hans: '分类', hant: '分類' },
	'categories': { hans: '分类', hant: '分類' },
	'image': { hans: '文件', hant: '檔案' },
	'images': { hans: '文件', hant: '檔案' },
	'minute': '分',
	'minutes': '分',
	'second': '秒',
	'seconds': '秒',
	'week': '周',
	'weeks': '周',
	'search': { hans: '搜索', hant: '搜尋' },
	'SearchHint': { hans: '搜索包含%s的页面', hant: '搜尋包含%s的頁面' },
	'web': { hans: '站点', hant: '站點' }
} );

ha.dump(); // => { 'article': '条目', 'category': '分类', 'categories': '分类', ... }

ha.attach( function( msg ) {
msg( 'image' ); // => '文件'
msg( 'image1' ); // => 'image1' (get a warning 'HanAssist: Key "image1" not found. Did you mean "image"?')
} );
```
	 * @param rawMsg raw messages
	 * @param [options] options
	 * @param [options.locale] locale, default to `wgUserLanguage`
	 */
	public constructor( rawMsg: RawMessages, { locale = mw.config.get( 'wgUserLanguage' ) } = {} ) {
		if ( typeof locale !== 'string' ) {
			raiseInvalidParamError( 'locale', 'string' );
		}

		if ( !$.isPlainObject( rawMsg ) || $.isEmptyObject( rawMsg ) ) {
			raiseInvalidParamError( 'rawMsg', 'RawMessages' );
		}

		this._messages = Object.freeze( batchElect( rawMsg, locale ) );
		this._warnedBucket = Object.create( null );
	}

	/**
	 * Show a warning message about missing keys and similar occurrences.
	 * @private
	 * @param key key missing
	 */
	private _missingKey( key: string ): void {
		const { elem: similar } = Object.keys( this._messages )
			.map( ( elem ): SimilarityKeyPair => ( { rating: similarity( elem, key ), elem } ) )
			.filter( ( { rating } ): boolean => rating >= 0.6 ) // Ignore dissimilar keys
			.reduce(
				( l: SimilarityKeyPair, r: SimilarityKeyPair ) => l.rating >= r.rating ? l : r,
				{ rating: 0, elem: '' }
			);

		this._warnedBucket[ key ] = true;
		mw.log.warn( mw.msg( 'ha-no-key', key, similar ? mw.msg( 'ha-similar', similar ) : '' ) );
	}

	/**
	 * Execute a function with a message getter as its first parameter.
	 * @param executor function to be executed
	 */
	public attach( executor: ( msg: ( key: string ) => string ) => void ): void {
		if ( typeof executor !== 'function' ) {
			raiseInvalidParamError( 'executor', '( msg: ( key: string ) => string ) => void' );
		}

		executor.call( this, ( key ) => {
			if ( !Object.prototype.hasOwnProperty.call( this._messages, key ) ) {
				if ( !this._warnedBucket[ key ] ) {
					setTimeout( () => this._missingKey( key ), 0 );
				}
				return key;
			}

			return this._messages[ key ];
		} );
	}

	/**
	 * Get the transpiled messages.
	 * @return messages
	 */
	public dump(): TranspiledMessages {
		return this._messages;
	}

	/**
	 * Return the string, if any, in the current user language.
	 * @example Assume `wgUserLanguage` is set to `zh-cn`:
```
HanAssist.localize( { hans: '一天一苹果，医生远离我。', hant: '一天一蘋果，醫生遠離我。' } ) // => '一天一苹果，医生远离我。'

// Advanced: custom locale
HanAssist.localize(
{ hans: '一天一苹果，医生远离我。', hant: '一天一蘋果，醫生遠離我。' },
{ locale: 'zh-tw' }
) // => '一天一蘋果，醫生遠離我。'
```
	 * @param candidates candidate strings
	 * @param [candidates.zh] string in `zh`
	 * @param [candidates.hans] string in `zh-hans`
	 * @param [candidates.hant] string in `zh-hant`
	 * @param [candidates.cn] string in `zh-cn`
	 * @param [candidates.tw] string in `zh-tw`
	 * @param [candidates.hk] string in `zh-hk`
	 * @param [candidates.sg] string in `zh-sg`
	 * @param [candidates.mo] string in `zh-mo`
	 * @param [candidates.my] string in `zh-my`
	 * @param [candidates.en] string in `en`
	 * @param [options] options
	 * @param [options.locale] locale, default to `wgUserLanguage`
	 * @return selected string
	 */
	public static localize( candidates: string | Candidates,
		{ locale = mw.config.get( 'wgUserLanguage' ) } = {}
	): string {
		return safelyElect( candidates, locale );
	}

	/**
	 * Return the string, if any, in the current user variant.
	 *
	 * If `wgUserVariant` is undefined, preferred variant in Special:Preference will be used.
	 * @example Assume preferred variant is `zh-cn`:
```
HanAssist.vary( { hans: '一天一苹果，医生远离我。', hant: '一天一蘋果，醫生遠離我。' } ) // => '一天一苹果，医生远离我。'
```
	 * @param candidates candidate strings
	 * @param [candidates.zh] string in `zh`
	 * @param [candidates.hans] string in `zh-hans`
	 * @param [candidates.hant] string in `zh-hant`
	 * @param [candidates.cn] string in `zh-cn`
	 * @param [candidates.tw] string in `zh-tw`
	 * @param [candidates.hk] string in `zh-hk`
	 * @param [candidates.sg] string in `zh-sg`
	 * @param [candidates.mo] string in `zh-mo`
	 * @param [candidates.my] string in `zh-my`
	 * @param [candidates.en] string in `en`
	 * @return selected string
	 */
	public static vary( candidates: string | Candidates ): string {
		return safelyElect(
			candidates,
			mw.config.get( 'wgUserVariant' ) || mw.user.options.get( 'variant' )
		);
	}
}

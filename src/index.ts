/**
 * HanAssist
 * ---------
 * Utilities to ease Chinese variant handling in user scripts and gadgets.
 * @author [[zh:User:Diskdance]]
 * @author [[zh:User:SunAfterRain]]
 * @license Unlicense
 */

( () => {
	'use strict';

	type CandidateKeys = 'zh' | 'hans' | 'hant' | 'cn' | 'hk' | 'mo' | 'my' | 'sg' | 'tw' | 'en';
	type RequireAtLeastOne<T> = {
		[ K in keyof T ]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
	}[ keyof T ];
	type Candidates = RequireAtLeastOne<{ [ K in CandidateKeys ]?: string }>;
	type RawMessages = Record<string, Candidates | string>;
	type TranspiledMessages = Record<string, string>;
	type SimilarityKeyPair = {
		rating: number,
		elem: string
	}

	const FALLBACK_TABLE: Record<string, readonly CandidateKeys[]> = {
		'zh': [ 'zh', 'hans', 'hant', 'cn', 'tw', 'hk', 'sg', 'mo', 'my', 'en' ],
		'zh-hans': [ 'hans', 'cn', 'sg', 'my', 'zh', 'hant', 'tw', 'hk', 'mo', 'en' ],
		'zh-hant': [ 'hant', 'tw', 'hk', 'mo', 'zh', 'hans', 'cn', 'sg', 'my', 'en' ],
		'zh-cn': [ 'cn', 'hans', 'sg', 'my', 'zh', 'hant', 'tw', 'hk', 'mo', 'en' ],
		'zh-sg': [ 'sg', 'hans', 'cn', 'my', 'zh', 'hant', 'tw', 'hk', 'mo', 'en' ],
		'zh-my': [ 'my', 'hans', 'cn', 'sg', 'zh', 'hant', 'tw', 'hk', 'mo', 'en' ],
		'zh-tw': [ 'tw', 'hant', 'hk', 'mo', 'zh', 'hans', 'cn', 'sg', 'my', 'en' ],
		'zh-hk': [ 'hk', 'hant', 'mo', 'tw', 'zh', 'hans', 'cn', 'sg', 'my', 'en' ],
		'zh-mo': [ 'mo', 'hant', 'hk', 'tw', 'zh', 'hans', 'cn', 'sg', 'my', 'en' ]
	}, DEF_FB: readonly CandidateKeys[] = [ 'en', 'zh', 'hans', 'hant', 'cn', 'tw', 'hk', 'sg', 'mo', 'my' ],
		MSG_STORE: RawMessages = {
			'ha-err': {
				hans: 'HanAssist 错误：$1。\n有关 HanAssist 的更多信息，请参见 https://example.com/。',
				hant: 'HanAssist 錯誤：$1。\n有關 HanAssist 的更多資訊，請參見 https://example.com/。',
				en: 'HanAssist error: $1.\nFor more information of HanAssist, see https://example.com/.'
			},
			'ha-inv-param': {
				hans: '无效参数“$1”$2', hant: '無效參數「$1」$2', en: 'Invalid parameter "$1"$2'
			},
			'ha-inv-param-detailed': {
				hans: '，应为“$1”，实为“$2”', hant: '，應為「$1」，實為「$2」', en: ', Expected $1 but got $2'
			},
			'ha-no-msg': {
				hans: '无法从“$1”中选择正确的消息，当前区域设置：$2', hant: '無法從「$1」中選擇正確的訊息，地區設定：$2', en: 'Failed to select message from "$1" in locale "$2"'
			},
			'ha-deprecated': {
				hans: '请使用 $1 作为替代。', hant: '請使用 $1 作為替代。', en: 'Use $1 instead.'
			},
			'ha-no-key': {
				hans: 'HanAssist：未找到键“$1”。$2', hant: 'HanAssist：未找到鍵「$1」。$2', en: 'HanAssist: Key "$1" not found. $2'
			},
			'ha-similar': {
				hans: '您是指“$1”吗？', hant: '您是指「$1」嗎？', en: 'Did you mean "$1"?'
			}
		},
		FB_SIMKEYPAIR_VAL: SimilarityKeyPair = { rating: 0, elem: '' };

	// #region Type guards

	/**
	 * Check if {@link val} is a plain object.
	 * @private
	 * @param val value
	 * @return return `true` if it is; return `false` otherwise
	 */
	function isPlainObject( val: unknown ): val is Record<string, unknown> {
		if ( val === null || typeof val !== 'object' || 'nodeType' in val || val === window ) {
			return false;
		}

		if ( val.constructor &&
			!Object.prototype.hasOwnProperty.call( val.constructor.prototype, 'isPrototypeOf' ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Check if object {@link val} is an empty object.
	 * @private
	 * @param val value
	 * @return return `true` if it is; return `false` otherwise
	 */
	function isEmptyObject( val: object ): val is Record<string, never> {
		return Object.keys( val ).length === 0;
	}

	/**
	 * Check if {@link val} is {@link CandidateKeys}.
	 * @private
	 * @param val value
	 * @return return `true` if it is; return `false` otherwise
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function isCandidateKey( val: any ): val is CandidateKeys {
		return DEF_FB.indexOf( val ) !== -1;
	}

	/**
	 * Check if {@link val} are valid candidates.
	 * @private
	 * @param val value
	 * @return return `true` if it is; return `false` otherwise
	 */
	function areCandidates( val: unknown ): val is Candidates {
		return isPlainObject( val ) && !isEmptyObject( val ) &&
			Object.keys( val ).every(
				( key ) => isCandidateKey( key ) && typeof val[ key ] === 'string'
			);
	}

	// #endregion
	// #region Utilities

	/**
	 * Throw `TypeError` with details about invalid parameters in its message.
	 * @param name parameter name
	 * @param [expected] expected value
	 * @param [actual] actual value
	 */
	function raiseInvalidParamError( name: string, expected?: string, actual?: string ): never {
		throw new TypeError( mw.msg( 'ha-err',
			mw.msg(
				'ha-inv-param',
				name,
				expected && actual ? mw.msg( 'ha-inv-param-detailed', expected, actual ) : ''
			)
		) );
	}

	/**
	 * Get the type of an object.
	 * @private
	 * @param obj object
	 * @return type
	 */
	function getType( obj: unknown ): string {
		return Object.prototype.toString.call( obj ).split( ' ' )[ 1 ].slice( 0, -1 ).toLowerCase();
	}

	/**
	 * Return a string representing types of values in an array, separated with commas.
	 * @private
	 * @param arr array
	 * @return types of values
	 */
	function arrayToStringOfTypes( arr: unknown[] ): string {
		return `[${arr.map( ( i ) => getType( i ) ).join( ',' )}]`;
	}

	/**
	 * Return the similarity of two strings, from 0.0 to 1.0
	 *
	 * From https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely
	 * @param s1 string 1
	 * @param s2 string 2
	 * @return similarity, from 0.0 to 1.0, the higher the more similar
	 */
	function similarity( s1: string, s2: string ): number {
		function editDistance( left: string, right: string ) {
			const l = left.toLowerCase();
			const r = right.toLowerCase();
			const costs = [];
			for ( let i = 0; i <= l.length; i++ ) {
				let lastVal = i;
				for ( let j = 0; j <= r.length; j++ ) {
					if ( i === 0 ) {
						costs[ j ] = j;
					} else if ( j > 0 ) {
						let newVal = costs[ j - 1 ];
						if ( l[ i - 1 ] !== r[ j - 1 ] ) {
							newVal = Math.min( newVal, lastVal, costs[ j ] ) + 1;
						}
						costs[ j - 1 ] = lastVal;
						lastVal = newVal;
					}
				}
				if ( i > 0 ) {
					costs[ r.length ] = lastVal;
				}
			}
			return costs[ r.length ];
		}

		const [ longer, shorter ] = s1.length > s2.length ? [ s1, s2 ] : [ s2, s1 ];
		if ( longer.length === 0 ) {
			return 1.0;
		}
		return ( longer.length - editDistance( longer, shorter ) ) / longer.length;
	}

	// #endregion
	// #region Election

	/**
	 * Select the target localized entry based on locale.
	 * @private
	 * @param candidates candidates
	 * @param locale locale
	 * @return selected entry
	 */
	function elect<T>( candidates: Partial<Record<CandidateKeys, T>>, locale: string ): T {
		const fallback: readonly CandidateKeys[] = FALLBACK_TABLE[ locale ] ?? DEF_FB;

		for ( const key of fallback ) {
			const winner = candidates[ key ];
			if ( winner !== undefined && winner !== null ) {
				return winner;
			}
		}

		let objDesc: string;
		try {
			objDesc = JSON.stringify( candidates );
		} catch {
			objDesc = Object.prototype.toString.call( candidates );
		}

		throw new Error( mw.msg( 'ha-err', mw.msg( 'ha-no-msg', objDesc, locale ) ) );
	}

	/**
	 * Check the type of {@link candidates} in runtime and call {@link elect()} respectively.
	 * @private
	 * @param candidates candidates
	 * @param locale locale
	 * @return selected entry
	 */
	function safelyElect( candidates: unknown, locale: string ): string {
		if ( typeof locale !== 'string' ) {
			raiseInvalidParamError( 'candidates' );
		}

		if ( typeof candidates === 'string' ) {
			return candidates;
		}
		if ( Array.isArray( candidates ) ) {
			if ( candidates.length === 1 && typeof candidates[ 0 ] === 'string' ) {
				return candidates[ 0 ];
			} else if ( candidates.length === 2 && candidates.every( ( i ) => typeof i === 'string' ) ) {
				return elect( { hans: candidates[ 0 ], hant: candidates[ 1 ] }, locale );
			} else {
				raiseInvalidParamError(
					'candidates',
					'string|[string]|[string,string]',
					arrayToStringOfTypes( candidates )
				);
			}
		}
		if ( !areCandidates( candidates ) ) {
			raiseInvalidParamError( 'candidates' );
		}
		return elect( candidates, locale );
	}

	/**
	 * Localize messages in batches. It turns an object like this
```
{
	apple: { hans: '苹果', hant: '蘋果', en: 'apple' },
	banana: { hans: '香蕉', hant: '香蕉', en: 'banana' }
}
```
into this
```
{ apple: '苹果', banana: '香蕉' }
```
	 * @private
	 * @param rawMsg raw messages
	 * @param locale locale
	 * @return transpiled messages
	 */
	function batchElect( rawMsg: Record<string, unknown>, locale: string ): TranspiledMessages {
		const transpiledMsg: TranspiledMessages = Object.create( null );
		for ( const key in rawMsg ) {
			const candidates = rawMsg[ key ];

			if ( typeof candidates === 'string' ) {
				// All locales share the same message
				transpiledMsg[ key ] = candidates;
			} else if ( areCandidates( candidates ) ) {
				transpiledMsg[ key ] = elect( candidates, locale );
			} else {
				raiseInvalidParamError(
					key.includes( ' ' ) ? `rawMsg['${key}']` :
						/^[0-9]/g.test( key ) ? `rawMsg[${key}]` :
							`rawMsg.${key}`,
					'string|Candidates',
					getType( candidates )
				);
			}
		}
		return transpiledMsg;
	}

	// #endregion

	mw.messages.set( batchElect( MSG_STORE, mw.config.get( 'wgUserLanguage' ) ) );

	/**
	 * Helper class to handle Chinese variant conversions.
	 */
	class HanAssist {
		#messages: TranspiledMessages;
		#warnedBucket: Record<string, boolean>;

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
		public constructor( rawMsg: unknown, { locale = mw.config.get( 'wgUserLanguage' ) } = {} ) {
			if ( typeof locale !== 'string' ) {
				raiseInvalidParamError( 'locale', 'string', getType( locale ) );
			}

			if ( !isPlainObject( rawMsg ) || isEmptyObject( rawMsg ) ) {
				raiseInvalidParamError( 'rawMsg' );
			}

			this.#messages = Object.freeze( batchElect( rawMsg, locale ) );
			this.#warnedBucket = Object.create( null );
		}

		/**
		 * Show a warning message about missing keys and similar occurrences.
		 * @param key key missing
		 */
		#missingKey( key: string ): void {
			const { elem: similar } = Object.keys( this.#messages )
				.map( ( elem ): SimilarityKeyPair => ( { rating: similarity( elem, key ), elem } ) )
				.filter( ( { rating } ): boolean => rating >= 0.6 ) // Ignore dissimilar keys
				.reduce(
					( l: SimilarityKeyPair, r: SimilarityKeyPair ) => l.rating >= r.rating ? l : r,
					FB_SIMKEYPAIR_VAL
				);

			this.#warnedBucket[ key ] = true;
			mw.log.warn( mw.msg( 'ha-no-key', key, similar ? mw.msg( 'ha-similar', similar ) : '' ) );
		}

		/**
		 * Execute a function with a message getter as its first parameter.
		 * @param executor function to be executed
		 */
		public attach( executor: ( msg: ( key: string ) => string ) => void ): void {
			if ( typeof executor !== 'function' ) {
				raiseInvalidParamError( 'executor' );
			}

			executor.call( this, ( key ) => {
				if ( !( key in this.#messages ) ) {
					if ( !this.#warnedBucket[ key ] ) {
						setTimeout( () => this.#missingKey( key ), 0 );
					}
					return key;
				}

				return this.#messages[ key ];
			} );
		}

		/**
		 * Get the transpiled messages.
		 * @return messages
		 */
		public dump(): TranspiledMessages {
			return this.#messages;
		}

		/**
		 * Return the string, if any, in the current user language.
		 * @example Assume `wgUserLanguage` is set to `zh-cn`:
```
HanAssist.localize( { hans: '一天一苹果，医生远离我。', hant: '一天一蘋果，醫生遠離我。' } ) // => '一天一苹果，医生远离我。'

// Shorthand syntax
HanAssist.localize( [ '一天一苹果，医生远离我。', '一天一蘋果，醫生遠離我。' ] ) // => '一天一苹果，医生远离我。'

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
		public static localize(
			candidates: unknown,
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

// Shorthand syntax
HanAssist.vary( [ '一天一苹果，医生远离我。', '一天一蘋果，醫生遠離我。' ] ) // => '一天一苹果，医生远离我。'
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
		public static vary( candidates: unknown ): string {
			return safelyElect(
				candidates,
				mw.config.get( 'wgUserVariant' ) || mw.user.options.get( 'variant' )
			);
		}
	}

	// #region Legacy function shims

	// wgULS
	function legacyULS(
		hans: unknown, hant: unknown, cn: unknown, tw: unknown, hk: unknown, sg: unknown,
		zh: unknown, mo: unknown, my: unknown
	): unknown {
		return legacyUXS( mw.config.get( 'wgUserLanguage' ), hans, hant, cn, tw, hk, sg, zh, mo, my );
	}

	// wgUVS
	function legacyUVS(
		hans: unknown, hant: unknown, cn: unknown, tw: unknown, hk: unknown, sg: unknown,
		zh: unknown, mo: unknown, my: unknown
	): unknown {
		return legacyUXS( mw.config.get( 'wgUserVariant' ), hans, hant, cn, tw, hk, sg, zh, mo, my );
	}

	// wgUXS
	function legacyUXS(
		wg: string, hans: unknown, hant: unknown, cn: unknown, tw: unknown, hk: unknown,
		sg: unknown, zh: unknown, mo: unknown, my: unknown
	): unknown {
		try {
			return elect( { hans, hant, cn, tw, hk, sg, zh, mo, my }, wg );
		} catch {
			return undefined;
		}

	}

	mw.log.deprecate( window, 'wgULS', legacyULS, mw.msg( 'ha-deprecated', 'HanAssist.localize()' ) );
	mw.log.deprecate( window, 'wgUVS', legacyUVS, mw.msg( 'ha-deprecated', 'HanAssist.vary()' ) );
	mw.log.deprecate( window, 'wgUXS', legacyUXS, mw.msg( 'ha-deprecated', 'HanAssist.localize()' ) );

	// #endregion

	// Expose to global scope
	window.HanAssist = HanAssist;
} )();

/**
 * @file Provides functions to select between candidate entries.
 * For license information please see LICENSE.
 */

import { CandidateKeys, Candidates, RawMessages, TranspiledMessages } from './types';
import { raiseInvalidParamError } from './utils';

const DEFAULT_FALLBACK = [ 'en', 'zh', 'hans', 'hant', 'cn', 'tw', 'hk', 'sg', 'mo', 'my' ] as const,
	FALLBACK_TABLE: Record<string, readonly CandidateKeys[]> = {
		'zh': [ 'zh', 'hans', 'hant', 'cn', 'tw', 'hk', 'sg', 'mo', 'my', 'en' ],
		'zh-hans': [ 'hans', 'cn', 'sg', 'my', 'zh', 'hant', 'tw', 'hk', 'mo', 'en' ],
		'zh-hant': [ 'hant', 'tw', 'hk', 'mo', 'zh', 'hans', 'cn', 'sg', 'my', 'en' ],
		'zh-cn': [ 'cn', 'hans', 'sg', 'my', 'zh', 'hant', 'tw', 'hk', 'mo', 'en' ],
		'zh-sg': [ 'sg', 'hans', 'cn', 'my', 'zh', 'hant', 'tw', 'hk', 'mo', 'en' ],
		'zh-my': [ 'my', 'hans', 'cn', 'sg', 'zh', 'hant', 'tw', 'hk', 'mo', 'en' ],
		'zh-tw': [ 'tw', 'hant', 'hk', 'mo', 'zh', 'hans', 'cn', 'sg', 'my', 'en' ],
		'zh-hk': [ 'hk', 'hant', 'mo', 'tw', 'zh', 'hans', 'cn', 'sg', 'my', 'en' ],
		'zh-mo': [ 'mo', 'hant', 'hk', 'tw', 'zh', 'hans', 'cn', 'sg', 'my', 'en' ]
	};

/**
 * Select the target localized entry based on locale.
 * @private
 * @param candidates candidates
 * @param locale locale
 * @return selected entry
 */
function elect<T>( candidates: Partial<Record<CandidateKeys, T>>, locale: string ): T {
	const fallback: readonly CandidateKeys[] = FALLBACK_TABLE[ locale ] || DEFAULT_FALLBACK;

	for ( const key of fallback ) {
		const winner = candidates[ key ];
		if ( winner !== undefined && winner !== null ) {
			return winner;
		}
	}

	throw new Error( mw.msg( 'ha-err', mw.msg( 'ha-no-msg' ) ) );
}

/**
 * Check the type of {@link candidates} in runtime and call {@link elect()} respectively.
 * @private
 * @param candidates candidates
 * @param locale locale
 * @return selected entry
 */
function safelyElect( candidates: string | Candidates, locale: string ): string {
	if ( typeof candidates === 'string' ) {
		return candidates;
	}
	if ( typeof locale !== 'string' ) {
		raiseInvalidParamError( 'locale', 'string' );
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
function batchElect( rawMsg: RawMessages, locale: string ): TranspiledMessages {
	if ( !$.isPlainObject( rawMsg ) ) {
		raiseInvalidParamError( 'rawMsg', 'RawMessages' );
	}

	const transpiledMsg: TranspiledMessages = Object.create( null );
	for ( const key in rawMsg ) {
		transpiledMsg[ key ] = safelyElect( rawMsg[ key ], locale );
	}
	return transpiledMsg;
}

export { elect, batchElect, safelyElect, DEFAULT_FALLBACK };

/**
 * @file Provides functions to select between candidate entries.
 * For license information please see LICENSE.
 */

import { FALLBACK_TABLE, DEF_FB } from './data';
import { areCandidates } from './type-guards';
import { CandidateKeys, Candidates, RawMessages, TranspiledMessages } from './types';
import { raiseInvalidParamError } from './utils';

/**
 * Select the target localized entry based on locale.
 * @private
 * @param candidates candidates
 * @param locale locale
 * @return selected entry
 */
export function elect<T>( candidates: Partial<Record<CandidateKeys, T>>, locale: string ): T {
	const fallback: readonly CandidateKeys[] = FALLBACK_TABLE[ locale ] ?? DEF_FB;

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
export function safelyElect( candidates: string | [ string ] | [ string, string ] | Candidates, locale: string ): string {
	if ( typeof locale !== 'string' ) {
		raiseInvalidParamError( 'locale', 'string' );
	}

	if ( typeof candidates === 'string' ) {
		return candidates;
	}
	if ( Array.isArray( candidates ) ) {
		if ( candidates.length === 1 && typeof candidates[ 0 ] === 'string' ) {
			return candidates[ 0 ];
		} else if ( candidates.length === 2 && candidates.every( ( i ) => typeof i === 'string' ) ) {
			return elect( { hans: candidates[ 0 ], hant: candidates[ 1 ] }, locale );
		}
	}
	if ( areCandidates( candidates ) ) {
		return elect( candidates, locale );
	}

	raiseInvalidParamError( 'candidates', 'string | [ string ] | [ string, string ] | Candidates' );
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
export function batchElect( rawMsg: RawMessages, locale: string ): TranspiledMessages {
	const transpiledMsg: TranspiledMessages = Object.create( null );
	for ( const key in rawMsg ) {
		const candidates = rawMsg[ key ];

		if ( typeof candidates === 'string' ) {
			// All locales share the same message
			transpiledMsg[ key ] = candidates;
		} else if ( areCandidates( candidates ) ) {
			transpiledMsg[ key ] = elect( candidates, locale );
		} else {
			raiseInvalidParamError( key.indexOf( ' ' ) !== -1 ? `rawMsg['${key}']` :
				/^\d/g.test( key ) ? `rawMsg[${key}]` :
					`rawMsg.${key}`, 'string | Candidates' );
		}
	}
	return transpiledMsg;
}

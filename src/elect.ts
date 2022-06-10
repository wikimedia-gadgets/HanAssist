/**
 * @file Provides functions to select between candidate entries.
 * For license information please see LICENSE.
 */

import { raiseInvalidParamError } from './utils';

type CandidateKeys = typeof DEFAULT_FALLBACK[ number ];

type RequireAtLeastOne<T> = {
	[ K in keyof T ]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[ keyof T ];

type Candidates = RequireAtLeastOne<{ [ K in CandidateKeys ]?: string }>;

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
 * Check the type of `candidates` at runtime and call `elect()` respectively.
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
	if ( !$.isPlainObject( candidates ) ) {
		raiseInvalidParamError( 'candidates', 'Candidates' );
	}

	const winner = elect( candidates, locale );
	if ( typeof winner !== 'string' ) {
		raiseInvalidParamError( 'candidates', 'Candidates' );
	}
	return winner;
}

export { elect, Candidates, safelyElect };

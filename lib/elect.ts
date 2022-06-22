/**
 * @file Provides functions to select between candidate entries.
 * For license information please see LICENSE.
 */

import { safelyToString } from './utils';

type CandidateKeys = typeof DEFAULT_FALLBACK[ number ];

type Candidates = Partial<Record<CandidateKeys, string>>;

const DEFAULT_FALLBACK = [ 'other', 'zh', 'hans', 'hant', 'cn', 'tw', 'hk', 'sg', 'mo', 'my' ] as const,
	FALLBACK_TABLE: Record<string, readonly CandidateKeys[]> = {
		'zh': [ 'zh', 'hans', 'hant', 'cn', 'tw', 'hk', 'sg', 'mo', 'my', 'other' ],
		'zh-hans': [ 'hans', 'cn', 'sg', 'my', 'zh', 'hant', 'tw', 'hk', 'mo', 'other' ],
		'zh-hant': [ 'hant', 'tw', 'hk', 'mo', 'zh', 'hans', 'cn', 'sg', 'my', 'other' ],
		'zh-cn': [ 'cn', 'hans', 'sg', 'my', 'zh', 'hant', 'tw', 'hk', 'mo', 'other' ],
		'zh-sg': [ 'sg', 'hans', 'cn', 'my', 'zh', 'hant', 'tw', 'hk', 'mo', 'other' ],
		'zh-my': [ 'my', 'hans', 'cn', 'sg', 'zh', 'hant', 'tw', 'hk', 'mo', 'other' ],
		'zh-tw': [ 'tw', 'hant', 'hk', 'mo', 'zh', 'hans', 'cn', 'sg', 'my', 'other' ],
		'zh-hk': [ 'hk', 'hant', 'mo', 'tw', 'zh', 'hans', 'cn', 'sg', 'my', 'other' ],
		'zh-mo': [ 'mo', 'hant', 'hk', 'tw', 'zh', 'hans', 'cn', 'sg', 'my', 'other' ]
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

	throw new Error( 'Cannot find message!' );
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

	if ( !$.isPlainObject( candidates ) ) {
		return safelyToString( candidates );
	}

	try {
		const winner = elect( candidates, locale );
		return safelyToString( winner );
	}
	catch {
		return '';
	}
}

export { elect, Candidates, safelyElect };

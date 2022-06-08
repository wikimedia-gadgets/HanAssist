/**
 * @file guards.
 * For license information please see LICENSE.
 */

import { DEF_FB } from './data';
import { CandidateKeys, Candidates } from './types';

/**
 * Check if {@link val} is {@link CandidateKeys}.
 * @private
 * @param val value
 * @return return `true` if it is; return `false` otherwise
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isCandidateKey( val: any ): val is CandidateKeys {
	return DEF_FB.indexOf( val ) !== -1;
}

/**
 * Check if {@link val} are valid candidates.
 * @private
 * @param val value
 * @return return `true` if it is; return `false` otherwise
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function areCandidates( val: any ): val is Candidates {
	return $.isPlainObject( val ) && !$.isEmptyObject( val ) &&
		Object.keys( val ).every(
			( key ) => isCandidateKey( key ) && typeof val[ key ] === 'string'
		);
}

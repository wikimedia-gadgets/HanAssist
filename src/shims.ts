/**
 * @file Provides fallbacks of legacy wgUXS-style helpers.
 * For license information please see LICENSE.
 */

import { elect } from './elect';

function generateLegacyHelper( config: 'wgUserLanguage' | 'wgUserVariant' ) {
	return (
		hans: unknown, hant: unknown, cn: unknown, tw: unknown, hk: unknown, sg: unknown,
		zh: unknown, mo: unknown, my: unknown
	) => legacyUXS( mw.config.get( config ), hans, hant, cn, tw, hk, sg, zh, mo, my );
}

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

/**
 * Add shim of `wgULS()`, `wgUVS()` and `wgUXS()` to the global scope.
 */
export default function shimLegacyHelpers() {
	mw.log.deprecate( window, 'wgULS',
		generateLegacyHelper( 'wgUserLanguage' ), 'Use HanAssist.localize() instead.' );
	mw.log.deprecate( window, 'wgUVS',
		generateLegacyHelper( 'wgUserVariant' ), 'Use HanAssist.vary() instead.' );
	mw.log.deprecate( window, 'wgUXS', legacyUXS, 'Use HanAssist.localize() instead.' );
}

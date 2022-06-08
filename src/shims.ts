/**
 * @file Provides fallbacks of legacy wgUXS-style helpers.
 * For license information please see LICENSE.
 */

import { elect } from './elect';

function legacyULS(
	hans: unknown, hant: unknown, cn: unknown, tw: unknown, hk: unknown, sg: unknown,
	zh: unknown, mo: unknown, my: unknown
): unknown {
	return legacyUXS( mw.config.get( 'wgUserLanguage' ), hans, hant, cn, tw, hk, sg, zh, mo, my );
}

function legacyUVS(
	hans: unknown, hant: unknown, cn: unknown, tw: unknown, hk: unknown, sg: unknown,
	zh: unknown, mo: unknown, my: unknown
): unknown {
	return legacyUXS( mw.config.get( 'wgUserVariant' ), hans, hant, cn, tw, hk, sg, zh, mo, my );
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
export default function shimUXS() {
	mw.log.deprecate( window, 'wgULS', legacyULS, mw.msg( 'ha-deprecated', 'HanAssist.localize()' ) );
	mw.log.deprecate( window, 'wgUVS', legacyUVS, mw.msg( 'ha-deprecated', 'HanAssist.vary()' ) );
	mw.log.deprecate( window, 'wgUXS', legacyUXS, mw.msg( 'ha-deprecated', 'HanAssist.localize()' ) );
}

/**
 * @file Provides fallbacks of legacy wgUXS-style helpers.
 * For license information please see LICENSE.
 */

import { elect } from './elect';

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

function generateLegacyHelper( configName: 'wgUserLanguage' | 'wgUserVariant' ) {
	return (
		hans: unknown, hant: unknown, cn: unknown, tw: unknown, hk: unknown, sg: unknown,
		zh: unknown, mo: unknown, my: unknown
	) => legacyUXS( mw.config.get( configName ), hans, hant, cn, tw, hk, sg, zh, mo, my );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function shim( name: string, func: ( ...args: any[] ) => unknown ) {
	mw.log.deprecate( window, name, func, `Use mw.libs.HanAssist instead.` );
}

shim( 'wgULS', generateLegacyHelper( 'wgUserLanguage' ) );
shim( 'wgUVS', generateLegacyHelper( 'wgUserVariant' ) );
shim( 'wgUXS', legacyUXS );

/**
 * @file Contains types necessary for development.
 * For license information please see LICENSE.
 */

export declare global {
	// FIXME: waiting for wikimedia-gadgets/types - mediawiki new release
	// https://github.com/wikimedia-gadgets/types-mediawiki/blob/666817d4d027771cdb0132c92a6aa7d6c5b394c0/mw/message.d.ts#L5
	namespace mw {
		const messages: mw.Map<{ [ key: string ]: string }>;
	}
}

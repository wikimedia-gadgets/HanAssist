/**
 * @file Utilities.
 * For license information please see LICENSE.
 */

/**
* Throw `TypeError` with details about invalid parameters in its message.
* @private
* @param name parameter name
* @param expected expected value
*/
function raiseInvalidParamError( name: string, expected: string ): never {
	throw new TypeError( mw.msg( 'ha-err', mw.msg( 'ha-inv-param', name, expected ) ) );
}

export { raiseInvalidParamError };

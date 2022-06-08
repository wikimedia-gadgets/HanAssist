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

function editDistance( left: string, right: string ) {
	const l = left.toLowerCase(), r = right.toLowerCase(), costs = [];
	for ( let i = 0; i <= l.length; i++ ) {
		let lastVal = i;
		for ( let j = 0; j <= r.length; j++ ) {
			if ( i === 0 ) {
				costs[ j ] = j;
			} else if ( j > 0 ) {
				let newVal = costs[ j - 1 ];
				if ( l[ i - 1 ] !== r[ j - 1 ] ) {
					newVal = Math.min( newVal, lastVal, costs[ j ] ) + 1;
				}
				costs[ j - 1 ] = lastVal;
				lastVal = newVal;
			}
		}
		if ( i > 0 ) {
			costs[ r.length ] = lastVal;
		}
	}
	return costs[ r.length ];
}

/**
 * Return the similarity of two strings, from 0.0 to 1.0
 *
 * From https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely
 * @private
 * @param s1 string 1
 * @param s2 string 2
 * @return similarity, from 0.0 to 1.0, the higher the more similar
 */
function similarity( s1: string, s2: string ): number {
	const [ longer, shorter ] = [ s1, s2 ].sort( ( a, b ) => b.length - a.length );
	if ( longer.length === 0 ) {
		return 1.0;
	}
	return ( longer.length - editDistance( longer, shorter ) ) / longer.length;
}

export { raiseInvalidParamError, similarity };

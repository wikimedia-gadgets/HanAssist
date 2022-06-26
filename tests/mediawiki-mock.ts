/**
 * Mock mw.config.get & mw.user.options.get.
 */

const getter = jest.fn<unknown, [ string ]>( () => 'zh' ),
	mockMW = new Proxy( {}, {
		get( _, prop, receiver ) {
			if ( prop === 'get' ) {
				return getter;
			}

			return receiver;
		}
	} );

export { getter, mockMW };

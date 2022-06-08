/**
 * @file Entry point of the program.
 * For license information please see LICENSE.
 */

'use strict';

import { MSG_STORE } from './data';
import { batchElect } from './elect';
import shimUXS from './shims';

// Initialization
mw.messages.set( batchElect( MSG_STORE, mw.config.get( 'wgUserLanguage' ) ) );

shimUXS();

export { default } from './HanAssist';

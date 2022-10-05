/**
 * @file Entry point of the program.
 * For license information please see LICENSE.
 */

import HanAssist, { HanAssistStatic } from './HanAssist';

if (__SHIM_UXS__) {
  import('./shims');
}

export default HanAssist;
export { HanAssistStatic }; // For typedoc

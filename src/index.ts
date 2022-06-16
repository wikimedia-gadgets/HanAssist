/**
 * @file Entry point of the program.
 * For license information please see LICENSE.
 */

'use strict';

import { HanAssist, HanAssistStatic } from './HanAssist';

// Set error messages.
mw.messages.set( HanAssist.parse( {
	'ha-err': {
		hans: 'HanAssist 错误：$1。\n有关 HanAssist 的更多信息，请参见 https://w.wiki/5FHQ',
		hant: 'HanAssist 錯誤：$1。\n有關 HanAssist 的更多資訊，請參見 https://w.wiki/5FHQ/',
		other: 'HanAssist error: $1.\nFor more information of HanAssist, see https://w.wiki/5FHQ'
	},
	'ha-inv-param': {
		hans: '无效参数“$1”，应为“$2”',
		hant: '無效參數「$1」，應為「$2」',
		other: 'Invalid parameter "$1", expect $2.'
	},
	'ha-no-msg': {
		hans: '无法选择消息，请检查代码是否包含错误',
		hant: '無法選擇訊息，請檢查程式碼是否包含錯誤',
		other: 'Cannot select message, please check your code for errors'
	}
} ) );

import './shims';

export { HanAssist, HanAssistStatic };

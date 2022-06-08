/**
 * @file Entry point of the program.
 * For license information please see LICENSE.
 */

'use strict';

import { batchElect } from './elect';
import shimLegacyHelpers from './shims';

// Set error messages.
mw.messages.set( batchElect( {
    'ha-err': {
        hans: 'HanAssist 错误：$1。\n有关 HanAssist 的更多信息，请参见 https://w.wiki/5FHQ',
        hant: 'HanAssist 錯誤：$1。\n有關 HanAssist 的更多資訊，請參見 https://w.wiki/5FHQ/',
        en: 'HanAssist error: $1.\nFor more information of HanAssist, see https://w.wiki/5FHQ'
    },
    'ha-inv-param': {
        hans: '无效参数“$1”，应为“$2”', hant: '無效參數「$1」，應為「$2」', en: 'Invalid parameter "$1", expect $2.'
    },
    'ha-no-msg': {
        hans: '无法选择消息，请检查代码是否包含错误', hant: '無法選擇訊息，請檢查程式碼是否包含錯誤', en: 'Cannot select message, please check your code for errors'
    },
    'ha-no-key': {
        hans: 'HanAssist：未找到键“$1”。$2', hant: 'HanAssist：未找到鍵「$1」。$2', en: 'HanAssist: Key "$1" not found. $2'
    },
    'ha-similar': {
        hans: '您是指“$1”吗？', hant: '您是指「$1」嗎？', en: 'Did you mean "$1"?'
    }
}, mw.config.get( 'wgUserLanguage' ) ) );

// Add shim for wgU?S().
shimLegacyHelpers();

export { default } from './HanAssist';

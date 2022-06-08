/**
 * @file Constants.
 * For license information please see LICENSE.
 */

import { CandidateKeys, RawMessages, SimilarityKeyPair } from './types';

export const DEF_FB = [ 'en', 'zh', 'hans', 'hant', 'cn', 'tw', 'hk', 'sg', 'mo', 'my' ] as const;

export const FALLBACK_TABLE: Record<string, readonly CandidateKeys[]> = {
	'zh': [ 'zh', 'hans', 'hant', 'cn', 'tw', 'hk', 'sg', 'mo', 'my', 'en' ],
	'zh-hans': [ 'hans', 'cn', 'sg', 'my', 'zh', 'hant', 'tw', 'hk', 'mo', 'en' ],
	'zh-hant': [ 'hant', 'tw', 'hk', 'mo', 'zh', 'hans', 'cn', 'sg', 'my', 'en' ],
	'zh-cn': [ 'cn', 'hans', 'sg', 'my', 'zh', 'hant', 'tw', 'hk', 'mo', 'en' ],
	'zh-sg': [ 'sg', 'hans', 'cn', 'my', 'zh', 'hant', 'tw', 'hk', 'mo', 'en' ],
	'zh-my': [ 'my', 'hans', 'cn', 'sg', 'zh', 'hant', 'tw', 'hk', 'mo', 'en' ],
	'zh-tw': [ 'tw', 'hant', 'hk', 'mo', 'zh', 'hans', 'cn', 'sg', 'my', 'en' ],
	'zh-hk': [ 'hk', 'hant', 'mo', 'tw', 'zh', 'hans', 'cn', 'sg', 'my', 'en' ],
	'zh-mo': [ 'mo', 'hant', 'hk', 'tw', 'zh', 'hans', 'cn', 'sg', 'my', 'en' ]
};

export const MSG_STORE: RawMessages = {
	'ha-err': {
		hans: 'HanAssist 错误：$1。\n有关 HanAssist 的更多信息，请参见 https://w.wiki/5FHQ',
		hant: 'HanAssist 錯誤：$1。\n有關 HanAssist 的更多資訊，請參見 https://w.wiki/5FHQ/',
		en: 'HanAssist error: $1.\nFor more information of HanAssist, see https://w.wiki/5FHQ'
	},
	'ha-inv-param': {
		hans: '无效参数“$1”，应为“$2”', hant: '無效參數「$1」，應為「$2」', en: 'Invalid parameter "$1", expect $2.'
	},
	'ha-no-msg': {
		hans: '无法从选择消息', hant: '無法選擇訊息', en: 'Cannot select message'
	},
	'ha-deprecated': {
		hans: '请使用 $1 作为替代。', hant: '請使用 $1 作為替代。', en: 'Use $1 instead.'
	},
	'ha-no-key': {
		hans: 'HanAssist：未找到键“$1”。$2', hant: 'HanAssist：未找到鍵「$1」。$2', en: 'HanAssist: Key "$1" not found. $2'
	},
	'ha-similar': {
		hans: '您是指“$1”吗？', hant: '您是指「$1」嗎？', en: 'Did you mean "$1"?'
	}
};

export const FB_SIMKEYPAIR_VAL: SimilarityKeyPair = { rating: 0, elem: '' };

import { isPlainObject, safelyToString } from './utils';

type CandidateKey = 'other' | 'zh' | 'hans' | 'hant' | 'cn' | 'tw' | 'hk' | 'sg' | 'mo' | 'my';
type Candidates = Partial<Record<CandidateKey, string>>;

const FALLBACK_LIST: Record<string, CandidateKey[]> = {
  zh: ['zh', 'hans', 'hant', 'cn', 'tw', 'hk', 'sg', 'mo', 'my', 'other'],
  'zh-hans': ['hans', 'cn', 'sg', 'my', 'zh', 'hant', 'tw', 'hk', 'mo', 'other'],
  'zh-hant': ['hant', 'tw', 'hk', 'mo', 'zh', 'hans', 'cn', 'sg', 'my', 'other'],
  'zh-cn': ['cn', 'hans', 'sg', 'my', 'zh', 'hant', 'tw', 'hk', 'mo', 'other'],
  'zh-sg': ['sg', 'hans', 'cn', 'my', 'zh', 'hant', 'tw', 'hk', 'mo', 'other'],
  'zh-my': ['my', 'hans', 'cn', 'sg', 'zh', 'hant', 'tw', 'hk', 'mo', 'other'],
  'zh-tw': ['tw', 'hant', 'hk', 'mo', 'zh', 'hans', 'cn', 'sg', 'my', 'other'],
  'zh-hk': ['hk', 'hant', 'mo', 'tw', 'zh', 'hans', 'cn', 'sg', 'my', 'other'],
  'zh-mo': ['mo', 'hant', 'hk', 'tw', 'zh', 'hans', 'cn', 'sg', 'my', 'other'],
};

const DEFAULT_FALLBACK = ['other', 'zh', 'hans', 'hant', 'cn', 'tw', 'hk', 'sg', 'mo', 'my'];

function elect<T>(candidates: Partial<Record<CandidateKey, T>>, locale: string): T | null {
  const fallback: CandidateKey[] = FALLBACK_LIST[locale] ?? DEFAULT_FALLBACK;

  // Try every locale sequently
  for (const key of fallback) {
    const value = candidates[key];
    // Return if the value is neither null nor undefined
    if (value != null) {
      return value;
    }
  }

  return null;
}

/**
 * A wrapper around `elect()` to ensure no non-string results are returned.
 */
function safeElect(candidates: Candidates, locale: string): string {
  // Guards to ensure types at runtime
  if (!isPlainObject(candidates)) {
    throw new TypeError('[HanAssist] Invalid parameter. Must be an object.');
  }
  if (typeof locale !== 'string') {
    mw.log.warn('[HanAssist] locale parameter must be a string. Please check your code.');
    locale = safelyToString(locale);
  }

  const result = elect(candidates, locale);

  if (typeof result !== 'string') {
    mw.log.warn('[HanAssist] Non-string conversion result detected. Please check your code.');
  }

  if (result === null) {
    return '';
  }

  // Wrap in another guard to ensure result is really string at runtime
  return safelyToString(result);
}

/**
 * Select between candidates based on user language.
 * @param candidates an object of candidates
 * @returns selected value
 */
function conv(candidates: Candidates): string {
  return safeElect(candidates, mw.config.get('wgUserLanguage'));
}

/**
 * Select between candidates based on user variant.
 * @param candidates an object of candidates
 * @returns selected value
 */
function convByVar(candidates: Candidates): string {
  return safeElect(candidates, mw.config.get('wgUserVariant') ?? mw.user.options.get('variant'));
}

/**
 * Perform selection for each item in a candidates dictionary.
 * @param candidatesDict the dictionary of candidates
 * @param locale locale, defaults to `wgUserLanguage`
 * @returns converted candidates dictionary
 */
function batchConv(
  candidatesDict: Record<string, string | Candidates>,
  locale = mw.config.get('wgUserLanguage')
): Record<string, string> {
  if (!isPlainObject(candidatesDict)) {
    throw new TypeError('[HanAssist] Invalid parameter. Must be an object.');
  }

  const result: Record<string, string> = {};

  for (const key in candidatesDict) {
    const candidates = candidatesDict[key];
    const electionResult = isPlainObject(candidates)
      ? safeElect(candidates, locale)
      : safelyToString(candidates);
    result[key] = electionResult;
  }

  return result;
}

export { Candidates, CandidateKey, elect, conv, convByVar, batchConv };

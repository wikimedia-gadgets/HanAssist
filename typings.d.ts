declare module 'ext.gadget.HanAssist' {
  export type CandidateKey = 'other' | 'zh' | 'hans' | 'hant' | 'cn' | 'tw' | 'hk' | 'sg' | 'mo' | 'my';
  export type Candidates = Partial<Record<CandidateKey, string>>;
  /**
   * Select between candidates based on user language.
   * @param candidates an object of candidates
   * @param locale locale, defaults to `wgUserLanguage`
   * @returns selected value
   */
  export function conv(candidates: Candidates, locale?: string): string;
  /**
   * Select between candidates based on user variant.
   * @param candidates an object of candidates
   * @returns selected value
   */
  export function convByVar(candidates: Candidates): string;
  /**
   * Perform selection for each item in a candidates dictionary.
   * @param candidatesDict the dictionary of candidates
   * @param locale locale, defaults to `wgUserLanguage`
   * @returns converted candidates dictionary
   */
  export function batchConv<T extends string>(
    candidatesDict: Record<T, string | Candidates>, locale?: string,
  ): Record<T, string>;

  global {
    /** @deprecated Use `HanAssist.conv` instead */
    function wgULS(
      hans?: string, hant?: string, cn?: string, tw?: string,
      hk?: string, sg?: string, zh?: string, mo?: string, my?: string,
    ): string;

    /** @deprecated Use `HanAssist.convByVar` instead */
    function wgUVS(
      hans?: string, hant?: string, cn?: string, tw?: string,
      hk?: string, sg?: string, zh?: string, mo?: string, my?: string,
    ): string;

    /** @deprecated Use `HanAssist` instead */
    function wgUXS(
      locale: string, hans?: string, hant?: string, cn?: string, tw?: string,
      hk?: string, sg?: string, zh?: string, mo?: string, my?: string,
    ): string;
  }
}

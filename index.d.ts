/**
 * HanAssist
 * ---------
 * Utilities to ease Chinese variant handling in user scripts and gadgets.
 * @author [[zh:User:Diskdance]]
 * @author [[zh:User:SunAfterRain]]
 * @license Unlicense
 */

declare namespace HanAssist {
    type CandidateKeys = 'zh' | 'hans' | 'hant' | 'cn' | 'hk' | 'mo' | 'my' | 'sg' | 'tw' | 'en';
    type RequireAtLeastOne<T> = {
        [ K in keyof T ]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
    }[ keyof T ];
    type Candidates = RequireAtLeastOne<{ [ K in CandidateKeys ]?: string }>;
    type RawMessages = Record<string, Candidates | string>;
    type TranspiledMessages = Record<string, string>;
    type Electable = string | [ string ] | [ string, string ] | Candidates;

    interface ConstructorOptions {
        locale?: string
    }
    interface LocalizationOptions {
        locale?: string
    }
}

/**
 * Helper class to handle Chinese variant conversions.
 */
declare class HanAssist {
    #private; // Indicates the class has private members


    /**
     * Instantiate a new instance of {@link HanAssist}.
     * @example Assume `wgUserLanguage` is set to `zh-cn`:
```
let ha = new HanAssist( {
    'article': { hans: '条目', hant: '條目' },
    'category': { hans: '分类', hant: '分類' },
    'categories': { hans: '分类', hant: '分類' },
    'image': { hans: '文件', hant: '檔案' },
    'images': { hans: '文件', hant: '檔案' },
    'minute': '分',
    'minutes': '分',
    'second': '秒',
    'seconds': '秒',
    'week': '周',
    'weeks': '周',
    'search': { hans: '搜索', hant: '搜尋' },
    'SearchHint': { hans: '搜索包含%s的页面', hant: '搜尋包含%s的頁面' },
    'web': { hans: '站点', hant: '站點' }
} );

ha.dump(); // => { 'article': '条目', 'category': '分类', 'categories': '分类', ... }

ha.attach( function( msg ) {
    msg( 'image' ); // => '文件'
    msg( 'image1' ); // => 'image1' (get a warning 'HanAssist: Key "image1" not found. Did you mean "image"?')
} );
```
     * @param rawMsg raw messages
     * @param [options] options
     * @param [options.locale] locale, default to `wgUserLanguage`
     */
    constructor( rawMsg: HanAssist.RawMessages, options: HanAssist.ConstructorOptions );


    /**
     * Execute a function with a message getter as its first parameter.
     * @param executor function to be executed
     */
    attach( executor: ( msg: ( key: string ) => string ) => void ): void;


    /**
     * Get the transpiled messages.
     * @return messages
     */
    dump(): HanAssist.TranspiledMessages;


    /**
     * Return the string, if any, in the current user language.
     * @example Assume `wgUserLanguage` is set to `zh-cn`:
```
HanAssist.localize( { hans: '一天一苹果，医生远离我。', hant: '一天一蘋果，醫生遠離我。' } ) // => '一天一苹果，医生远离我。'

// Shorthand syntax
HanAssist.localize( [ '一天一苹果，医生远离我。', '一天一蘋果，醫生遠離我。' ] ) // => '一天一苹果，医生远离我。'

// Advanced: custom locale
HanAssist.localize(
{ hans: '一天一苹果，医生远离我。', hant: '一天一蘋果，醫生遠離我。' },
{ locale: 'zh-tw' }
) // => '一天一蘋果，醫生遠離我。'
```
     * @param candidates candidate strings
     * @param [candidates.zh] string in `zh`
     * @param [candidates.hans] string in `zh-hans`
     * @param [candidates.hant] string in `zh-hant`
     * @param [candidates.cn] string in `zh-cn`
     * @param [candidates.tw] string in `zh-tw`
     * @param [candidates.hk] string in `zh-hk`
     * @param [candidates.sg] string in `zh-sg`
     * @param [candidates.mo] string in `zh-mo`
     * @param [candidates.my] string in `zh-my`
     * @param [candidates.en] string in `en`
     * @param [options] options
     * @param [options.locale] locale, default to `wgUserLanguage`
     * @return selected string
     */
    static localize( candidates: HanAssist.Electable, options: HanAssist.LocalizationOptions ): string;


    /**
     * Return the string, if any, in the current user variant.
     *
     * If `wgUserVariant` is undefined, preferred variant in Special:Preference will be used.
     * @example Assume preferred variant is `zh-cn`:
```
HanAssist.vary( { hans: '一天一苹果，医生远离我。', hant: '一天一蘋果，醫生遠離我。' } ) // => '一天一苹果，医生远离我。'

// Shorthand syntax
HanAssist.vary( [ '一天一苹果，医生远离我。', '一天一蘋果，醫生遠離我。' ] ) // => '一天一苹果，医生远离我。'
```
     * @param candidates candidate strings
     * @param [candidates.zh] string in `zh`
     * @param [candidates.hans] string in `zh-hans`
     * @param [candidates.hant] string in `zh-hant`
     * @param [candidates.cn] string in `zh-cn`
     * @param [candidates.tw] string in `zh-tw`
     * @param [candidates.hk] string in `zh-hk`
     * @param [candidates.sg] string in `zh-sg`
     * @param [candidates.mo] string in `zh-mo`
     * @param [candidates.my] string in `zh-my`
     * @param [candidates.en] string in `en`
     * @return selected string
     */
    static vary( candidates: HanAssist.Electable ): string;
}

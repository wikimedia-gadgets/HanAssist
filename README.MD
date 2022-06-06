# HanAssist
HanAssist 是帮助中文维基百科及其他 MediaWiki 网站上的用户脚本和小工具更优雅地处理中文变体消息的实用程序。

本程序用以取代先前的``wgULS()``和``wgUVS()``小工具。

```javascript
HanAssist.localize( { hans: '一天一苹果，医生远离我。', hant: '一天一蘋果，醫生遠離我。' } )
// => 界面语言为简中：“一天一苹果，医生远离我。”；繁中：“一天一蘋果，醫生遠離我。”

HanAssist.vary( { hans: '一天一苹果，医生远离我。', hant: '一天一蘋果，醫生遠離我。' } )
// => 页面变体为简中：“一天一苹果，医生远离我。”；繁中：“一天一蘋果，醫生遠離我。”
```

## 为什么要有 HanAssist？
``wgULS()``和``wgUVS()``几乎是中文维基百科每个用户脚本和小工具都要使用到的功能。它们极大方便了中文变体消息的处理，但随着 JavaScript 的发展，它们的问题也逐渐显现：

1. 仍然使用旧式的``wgXXX``类名称，污染全局空间。现今 MediaWiki 中的此类变量全部通过``mw.config.get()``获取，但这两个函数并未也无法跟进。
2. 参数列表过长，影响阅读。设计良好的 JavaScript 函数[最多仅应包含两个参数](https://github.com/ryanmcdermott/clean-code-javascript#function-arguments-2-or-fewer-ideally)。
   设想一下，如果像这样调用``wgULS()``：
   ```javascript
   wgULS( undefined, undefined, '显示%s的用户日志', '顯示%s的使用者日誌', '顯示%s的用戶日誌' )
   ```
   岂不是使代码变得非常难看，非常难以维护？
3. 并非类型安全。``wgULS()``和``wgUVS()``允许任何类型的参数传入，这可能会导致非预期的行为发生，并且使得代码难以维护。
4. 没有代码文档。这使得不了解这些函数的人必须通过直接阅读代码来确定它们的用法。

为了解决这些问题，我们制作了 HanAssist。它具有如下优点：

1. 仅占用 HanAssist 一个名称，提供原小工具的全部功能；
2. 采用命名参数语法，显著提升代码可读性；
3. 严格的类型检查，类型错误时会抛出异常并带有直观的错误信息；
4. 完善的代码文档及类型定义；
5. 支持批量转译消息，在代码大量依赖中文变体消息时可极大减少代码复杂程度。

## 用法
一般用法如下所示：

```javascript
// 等同于 wgULS( '一天一苹果，医生远离我。', '一天一蘋果，醫生遠離我。' )
HanAssist.localize( { hans: '一天一苹果，医生远离我。', hant: '一天一蘋果，醫生遠離我。' } )

// 等同于 wgULS( undefined, undefined, 'IP用户', 'IP使用者', 'IP用戶' )
HanAssist.localize( { cn: 'IP用户', tw: 'IP使用者', hk: 'IP用戶' } )

// 等同于 wgUVS( '一天一苹果，医生远离我。', '一天一蘋果，醫生遠離我。' )
HanAssist.vary( { hans: '一天一苹果，医生远离我。', hant: '一天一蘋果，醫生遠離我。' } )

// 配合占位符号使用
mw.format(
    HanAssist.localize( { hans: '页面$2的修订版本$1', hant: '頁面$2的修訂版本$1' } ),
    '123456',
    'Apple'
    ) // => 界面语言为简中：“页面Apple的修订版本123456”；繁中：“頁面Apple的修訂版本123456”

// 懒人写法（先简后繁）
HanAssist.localize( [ '一天一苹果，医生远离我。', '一天一蘋果，醫生遠離我。' ] )
// => 等同于 HanAssist.localize( { hans: '一天一苹果，医生远离我。', hant: '一天一蘋果，醫生遠離我。' } )
HanAssist.vary( [ '一天一苹果，医生远离我。', '一天一蘋果，醫生遠離我。' ] )
// => 等同于 HanAssist.vary( { hans: '一天一苹果，医生远离我。', hant: '一天一蘋果，醫生遠離我。' } )
```

批量转译消息：
```javascript
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
		'web': { hans: '站点', hant: '站點' },
	} );

ha.attach( function( msg ) { // 也可使用其他名称
	// 使用 msg() 获取消息
	msg( 'image' ); // => '文件'
	msg( 'image1' ); // => 'image1'（控制台输出警告消息“HanAssist：未找到键‘image1’。您是指‘image’吗？”）
	// 您的其他代码
} );
```

## 授权 & 致谢
本程序由 Diskdance 等制作，采用 [The Unlicense](./LICENSE) 授权协议。

特别感谢中文维基百科用户 [Роу Уилсон Фредериск Холм](https://zh.wikipedia.org/wiki/User:Роу_Уилсон_Фредериск_Холм) 和 [SunAfterRain](https://zh.wikipedia.org/wiki/User:SunAfterRain) 在制作过程中给予的支持，尤其是关于 TypeScript 方面问题的解答。
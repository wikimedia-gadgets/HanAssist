# HanAssist v4 ![Linter](https://github.com/diskdance/HanAssist/actions/workflows/lint.yml/badge.svg) ![Test status](https://github.com/diskdance/HanAssist/actions/workflows/test.yml/badge.svg)
[代码文档](https://diskdance.github.io/HanAssist/)

HanAssist v4 是帮助中文维基百科及其他 MediaWiki 网站上的用户脚本和小工具更优雅地处理中文变体消息的实用程序。

本程序的目标是取代 `wgULS()` 和 `wgUVS()`。

```javascript
// 小工具需要先添加对 ext.gadget.HanAssist 的依赖
const { conv, convByVar } = require( 'ext.gadget.HanAssist' );

// 也可动态加载
mw.loader.using( 'ext.gadget.HanAssist' ).then( ( require ) => {
	const { conv, convByVar } = require( 'ext.gadget.HanAssist' );
	// ...
} );

conv( { hans: '一天一苹果，医生远离我。', hant: '一天一蘋果，醫生遠離我。' } );
// => 界面语言为简中：“一天一苹果，医生远离我。”；繁中：“一天一蘋果，醫生遠離我。”

convByVar( { hans: '一天一苹果，医生远离我。', hant: '一天一蘋果，醫生遠離我。' } );
// => 页面变体为简中：“一天一苹果，医生远离我。”；繁中：“一天一蘋果，醫生遠離我。”

// 由于技术限制，如果 HanAssist 位于其他 wiki 上，那么函数将会导出到 mw.libs.HanAssist 全局空间
mw.loader.load( 'https://another.wiki/w/index.php?title=MediaWiki:Gadget-HanAssist.js&action=raw&ctype=text/javascript' );
// 按照如下方式使用：
// mw.libs.HanAssist.conv( ... );
// mw.libs.HanAssist.convByVar( ... );
```

## 为什么使用 HanAssist v4？
`wgULS()` 和 `wgUVS()` 几乎是中文维基百科每个用户脚本和小工具都要使用到的功能。它们极大方便了中文变体消息的处理，但随着 JavaScript 的发展，它们的问题也逐渐显现：

1. 仍然使用旧式的 `wgXXX` 类名称，污染全局空间。现今 MediaWiki 中的此类变量全部通过 `mw.config.get` 获取，但这两个函数并未也无法跟进。
2. 使用意义不明的缩写，影响代码可读性。
3. 参数列表过长，影响阅读。设计良好的 JavaScript 函数[最多仅应包含两个参数](https://github.com/ryanmcdermott/clean-code-javascript#function-arguments-2-or-fewer-ideally)。
   设想一下，如果像这样调用 `wgULS()`：
   ``javascript
   wgULS( undefined, undefined, '显示%s的用户日志', '顯示%s的使用者日誌', '顯示%s的用戶日誌' );
   ``
   难道不会使代码非常难以阅读及维护？
4. 并非类型安全。`wgULS()` 和 `wgUVS()` 允许任何类型的参数传入，这可能会导致非预期的行为发生，并且使得代码难以维护。
5. 没有代码文档。这使得不了解这些函数的人必须通过直接阅读代码来确定它们的用法。

为了解决这些问题，我们制作了 HanAssist v4。它具有如下优点：

1. 不占用全局空间，利用 ResourceLoader 模块系统实现按需导入；
2. 采用命名参数语法，显著提升代码可读性；
3. 完善的代码文档及类型定义；
4. 支持批量转译消息，在代码大量依赖中文变体消息时可极大减少代码复杂程度。

## 用法
### `conv()` 和 `convByVar()`
这两个函数分别替代 `wgULS()` 和 `wgUVS()`。它们的第一个参数为一个原型大致如下所示的对象：
```typescript
interface Candidates {
	zh?: string, // 中文（不转换）消息
	hans?: string, // 简体中文消息
	hant?: string, // 繁體中文消息
	cn?: string, // 大陆简体消息
	tw?: string, // 台灣正體消息
	hk?: string, // 香港繁體消息
	mo?: string, // 澳門繁體消息
	my?: string, // 大马简体消息
	sg?: string, // 新加坡简体消息
	other?: string // 非中文语言（如英语）消息
}
```

两者的用法则如下所示：
```javascript
const { conv, convByVar } = require( 'ext.gadget.HanAssist' );

// 等同于 wgULS( '一天一苹果，医生远离我。', '一天一蘋果，醫生遠離我。' );
conv( { hans: '一天一苹果，医生远离我。', hant: '一天一蘋果，醫生遠離我。' } );
// => 界面语言为简中：“一天一苹果，医生远离我。”；繁中：“一天一蘋果，醫生遠離我。”

// 等同于 wgULS( undefined, undefined, 'IP用户', 'IP使用者', 'IP用戶' );
conv( { cn: 'IP用户', tw: 'IP使用者', hk: 'IP用戶' } );
// => 界面语言为大陆简体：“一天一苹果，医生远离我。”；台灣正體：“一天一蘋果，醫生遠離我。”；香港繁體：“一天一蘋果，醫生遠離我。”

// 其他变体下则根据 fallback 链选择相应的消息
// 等同于 wgUVS( '一天一苹果，医生远离我。', '一天一蘋果，醫生遠離我。' );
convByVar( { hans: '一天一苹果，医生远离我。', hant: '一天一蘋果，醫生遠離我。' } );
// => 页面变体为简中：“一天一苹果，医生远离我。”；繁中：“一天一蘋果，醫生遠離我。”

// 配合占位符号使用。有关 mw.format 的用法详见 MediaWiki 文档
mw.format(
	conv( { hans: '页面$2的修订版本$1', hant: '頁面$2的修訂版本$1' } ),
	'123456',
	'Apple'
); // => 界面语言为简中：“页面Apple的修订版本123456”；繁中：“頁面Apple的修訂版本123456”
```

### `batchConv()`
这是一个提供批量转译消息功能的函数。

```javascript
const { batchConv } = require( 'ext.gadget.HanAssist' );

batchConv( {
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
	'SearchHint': { hans: '搜索包含$1的页面', hant: '搜尋包含$1的頁面' },
	'web': { hans: '站点', hant: '站點' },
} ); // => { 'article': '条目', 'category': '分类', 'categories': '分类', ... }
```

大多数情况下，推荐配合 `mw.messages` 使用。

```javascript
mw.messages.set( batchConv( {
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
	'SearchHint': { hans: '搜索包含$1的页面', hant: '搜尋包含$1的頁面' },
	'web': { hans: '站点', hant: '站點' },
} ) );

mw.msg( 'categories' ); // => 界面语言为简中：“分类”；繁中：“分類”
mw.msg( 'SearchHint', 'Apple' ); // => 界面语言为简中：“搜索包含Apple的页面”；繁中：“搜尋包含Apple的頁面”
// 其他用法详见 MediaWiki 文档
```

### 使用类型定义文件
本小工具[提供了类型定义文件](./typings.d.ts)，将其中的内容复制到您的项目中即可使用。

## 局限
在软件领域，[没有银弹](https://zh.wikipedia.org/wiki/%E6%B2%A1%E6%9C%89%E9%93%B6%E5%BC%B9)，因此 HanAssist 也并非完美。在一些使用场景下，您应该使用其他更合适的工具而非 HanAssist。

如果您的小工具或用户脚本需要多国语言支持，而非仅限于中文（汉语）一种，请考虑使用其他支持多语言处理的库，如 [`jQuery.i18n`](https://github.com/wikimedia/jquery.i18n)。

## 贡献
见 [CONTRIBUTING.MD](./CONTRIBUTING.MD)。

## 授权 & 致谢
本程序由 Diskdance 等制作，采用 [3-Clause BSD License](./LICENSE) 授权协议。

特别感谢中文维基百科用户 [Роу Уилсон Фредериск Холм](https://zh.wikipedia.org/wiki/User:Роу_Уилсон_Фредериск_Холм) 和 [SunAfterRain](https://zh.wikipedia.org/wiki/User:SunAfterRain) 在制作过程中给予的支持，尤其是关于 TypeScript 方面问题的解答。

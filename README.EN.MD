# HanAssist
[简体中文](./README.MD)

HanAssist is a helper gadget on Chinese Wikipedia to ease Chinese variant handling in user scripts and gadgets. It provides `conv`, `convByVar` and `batchConv` functions on the wiki.

```js
// For gadgets, add HanAssist as a dependency in the definition
const { conv, convByVar } = require( 'ext.gadget.HanAssist' );

// Also can be loaded dynamically
mw.loader.using( 'ext.gadget.HanAssist' ).then( ( require ) => {
	const { conv, convByVar } = require( 'ext.gadget.HanAssist' );
	// ...
} );

conv( { hans: 'Simplified Chinese content', hant: 'Traditional Chinese content' } );
// => If page language is zh-hans/zh-cn/zh-sg/zh-my: 'Simplified Chinese content'; zh-hant/zh-tw/zh-hk/zh-mo: 'Traditional Chinese content'

convByVar( { hans: 'Simplified Chinese content', hant: 'Traditional Chinese content' } );
// => If page variant is zh-hans/zh-cn/zh-sg/zh-my: 'Simplified Chinese content'; zh-hant/zh-tw/zh-hk/zh-mo: 'Traditional Chinese content'

// Due to technical limitations, if HanAssist is on another wiki, functions will be exported as members of mw.libs.HanAssist
mw.loader.load( 'https://another.wiki/w/index.php?title=MediaWiki:Gadget-HanAssist.js&action=raw&ctype=text/javascript' );
// Usage:
// mw.libs.HanAssist.conv( ... );
// mw.libs.HanAssist.convByVar( ... );
```

Since this gadget is mainly for Chinese users, most of its documentation is written in Chinese. For building instructions, see [CONTRIBUTING.MD](./CONTRIBUTING.MD). For TypeScript definitions, see [typings.d.ts](./typings.d.ts).

module.exports = {
    presets: [
        '@babel/typescript',
        [
            '@babel/preset-env',
            {
                targets: [
                    // See https://www.mediawiki.org/wiki/Compatibility#Browser_support_matrix
                    'ie 11',
                    'chrome >= 31',
                    'firefox >= 39',
                    'opera >= 18',
                    'edge >= 12',
                    'safari >= 9.1',
                    'android >= 5',
                    'ios >= 9'
                ],
                useBuiltIns: 'usage',
                corejs: {
                    version: 3
                }
            }
        ]
    ]
}
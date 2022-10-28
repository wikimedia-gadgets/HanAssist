import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { readFileSync } from 'fs';

export default defineConfig({
  input: 'lib/index.ts',
  output: {
    file: 'dist/index.min.js',
    format: 'iife',
    name: 'mw.libs.HanAssist',
    extend: false,
    generatedCode: 'es5',
    inlineDynamicImports: true,
    banner: readFileSync('./gadget-prepend.js').toString(),
    footer: readFileSync('./gadget-append.js').toString(),
  },
  plugins: [
    typescript(),
    terser({
      format: {
        comments: /((^\*!|nowiki))/i, // Preserve banners & nowiki guards
      },
      ecma: 5,
    }),
  ],
});

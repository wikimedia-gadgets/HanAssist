// @ts-check
import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import { readFileSync } from 'fs';
import mwGadget from 'rollup-plugin-mediawiki-gadget';
import replace from '@rollup/plugin-replace';

const compat = process.env.COMPAT !== undefined;

export default defineConfig({
  input: 'lib/index.ts',
  output: {
    file: 'dist/Gadget-HanAssist.js',
    format: 'umd', // Use UMD so the script works outside a module system
    name: 'mw.libs.HanAssist',
    amd: {
      id: 'HanAssist',
    },
    inlineDynamicImports: true,
    banner: readFileSync('./assets/intro.js').toString(),
    footer: readFileSync('./assets/outro.js').toString(),
  },
  plugins: [
    typescript({
      outputToFilesystem: true,
      compilerOptions: {
        // See https://www.mediawiki.org/wiki/Project:Tech_News#Tech_News:_2025-23, since 1.45.0-wmf.6
        target: 'ES2017',
      },
      declaration: true,
      include: ['lib/**/*.ts'],
    }),
    replace({
      preventAssignment: true,
      COMPAT: JSON.stringify(compat),
    }),
    mwGadget({
      gadgetDef: '.gadgetdefinition',
    }),
  ],
});

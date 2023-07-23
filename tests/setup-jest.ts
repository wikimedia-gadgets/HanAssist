import $ from 'jquery';
import { mockMW } from './mediawiki-mock';

Object.defineProperty(globalThis, '$', { value: $ });
Object.defineProperty(globalThis, 'mw', { value: mockMW });
Object.defineProperty(globalThis, '__SHIM_UXS__', { value: false }); // Shim is not tested

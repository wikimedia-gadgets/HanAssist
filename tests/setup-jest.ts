import $ from 'jquery';
import { mockMW } from './mediawiki-mock';

Object.defineProperty(globalThis, '$', { value: $ });
Object.defineProperty(globalThis, 'mw', { value: mockMW });
Object.defineProperty(globalThis, 'COMPAT', { value: false }); // Shim is not tested

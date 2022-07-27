import $ from 'jquery';
import { mockMW } from './mediawiki-mock';

Object.defineProperty(global, '$', { value: $ });
Object.defineProperty(global, 'mw', { value: mockMW });

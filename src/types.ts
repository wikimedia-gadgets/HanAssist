/**
 * @file Types & interfaces.
 * For license information please see LICENSE.
 */
import { DEFAULT_FALLBACK } from './elect';

type CandidateKeys = typeof DEFAULT_FALLBACK[ number ];

type RequireAtLeastOne<T> = {
	[ K in keyof T ]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[ keyof T ];

type Candidates = RequireAtLeastOne<{ [ K in CandidateKeys ]?: string }>;

type RawMessages = Record<string, Candidates | string>;

type TranspiledMessages = Record<string, string>;

export { RawMessages, TranspiledMessages, RequireAtLeastOne, Candidates, CandidateKeys };

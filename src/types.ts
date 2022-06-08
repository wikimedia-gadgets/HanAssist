/**
 * @file Types & interfaces.
 * For license information please see LICENSE.
 */
import { DEF_FB } from './data';

export type CandidateKeys = typeof DEF_FB[ number ];
export type RequireAtLeastOne<T> = {
	[ K in keyof T ]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[ keyof T ];
export type Candidates = RequireAtLeastOne<{ [ K in CandidateKeys ]?: string }>;
export type RawMessages = Record<string, Candidates | string>;
export type TranspiledMessages = Record<string, string>;
export type SimilarityKeyPair = {
	rating: number,
	elem: string
}

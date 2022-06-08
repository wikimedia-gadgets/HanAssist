/**
 * @file Types & interfaces.
 * For license information please see LICENSE.
 */
import { DEFAULT_FALLBACK } from './elect';

export type CandidateKeys = typeof DEFAULT_FALLBACK[ number ];

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

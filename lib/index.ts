if (COMPAT) {
  import('./shims');
}

export { Candidates, CandidateKey, conv, convByVar, batchConv } from './conversion';

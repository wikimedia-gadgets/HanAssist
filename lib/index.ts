if (COMPAT) {
  void import('./shims');
}

export { Candidates, CandidateKey, conv, convByVar, batchConv } from './conversion';

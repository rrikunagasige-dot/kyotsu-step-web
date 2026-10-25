# Foundation checks — 2026-10-25

P-001 approved by user「いいよ続けて」. Exact approval remains in APPROVAL.json and the event ledger.

- Existing workflow regressions plus initial six diagnostic/catalog tests: 126 passed.
- Actual N07 strict IR generation: passed, 41 nodes, unchanged 36 grading contracts, unchanged stages and revision4.
- Five Node tests: deterministic compilation; sentence slots; equality chains; nine first definitions; rejecting the original legacy artifact as production IR.
- Two additional binding tests: missing approval / unrelated commit rejected; approved attached design compiled and bound without changing the approval event or proposal hash.
- Model fallback remains unranked and modelRan=false; invalid corpus hash is a failure.

These checks do not certify learner UI, publication or user acceptance. Learner app is still unchanged at this foundation checkpoint.

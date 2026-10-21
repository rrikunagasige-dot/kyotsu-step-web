# W-MATH-015/P-001 — N14 Q08 independent source/math audit checkpoint
Status: IN-PROGRESS (static math PASS; whole exact-code CI running)
Date: 2026-10-21 JST
Primary Work: W-MATH-015/P-001 — only N14 Q08. User authorization: 「いいよ」 responding to Q07 Gate① and exact Q08 P-001. Review branch: work/W-MATH-015-n14-q08-outside-proof-20261021. Full HEAD under CI: 9bd7b347f9e9fd1a9a53fd6c0e5928fcdfda3beb. Parent pre-Q08 approved Q07 Gate① and review source SHA 0841561265b95576fcfc84570fea9eaf2ef24488. Main: 2f05c6b34e4853a76bc5b24b9eb0b0cee6ac3c79 (unchanged).

## CI checkpoint (source SHA must not be confused with branch moved later)
- Math textbook mode CI #39541910451: RUNNING at first and next meaningful independent-work boundary. Do not claim PASS before completion.
- Repository Governance Check #39541910596: SUCCESS at first checkpoint.
- Review Preview Code Check (not a deployment) #39541910526: SUCCESS after independent Q12 proposal block.
- Human Gate① Q08: PENDING; Q07 and previous N11 accepted states retained. Gate②: not CROSS-VERIFIED because N14 Q12 R1 unmodified. Gate③: NOT READY; main/hosting unpublished.

## Independent mathematical proof and option audit
Assume a>0, X real. For X>=0, |X|=X, so |X|>a iff X>a. For X<0, |X|=−X, and −X>a iff X<−a, by reversal on multiplying by −1. These signs partition R. Their union is X<−a OR X>a, not AND. Converse follows immediately by absolute value definition in each sign case. Strict endpoints ±a are excluded and X=0 is excluded. 42 distinct numeric boundary/inner/outer cases (a=0.1,0.5,1,2,3,100; seven X positions per a) tested directly in an independent tool computation: 0 discrepancies between |X|>a and union of sign branches; no simultaneous true branches.
- New positive correct X>a; wrong X>=a (extra endpoint), 0<=X<a (confused inner), X<−a (wrong branch).
- New negative correct X<−a; wrong X<=−a (extra endpoint), X>−a (forgot reversal), X>a (wrong branch).
- Original final correct X<−a または X>a; wrong −a<X<a (inner), X<=−a または X>=a (wrong endpoints), X<−a かつ X>a (impossible intersection).

## Static source, gates, scope
Current N14 lesson in isolated SHA was compared against exact Q07 accepted pre-Q08 source. Verified Q07 new items definition and entire Q07 flow retained verbatim, original Q08 raw source correct/3 authored wrong unchanged, original N14 Q12 source unchanged. Q08 source map adds two stable IDs to ORIGINAL N14-Q08 only, preserving 16 original source labels. Final n14-08 object reused, original after text retained, reverse proof only after original final. N14 revision5 migration has explicit v4 archive and separate historical v1–v3 normalization; 140-choice current test expected, CI not yet confirmed. Exact diff scope: four code/test files plus five W-MATH-015 records, no figure PNG, Word, global renderer/schema, other modes or main.

## §12C independent work while CI
At first CI check primary A source #39541910451 RUNNING. Safe independent P1 work: this exact math/source/cognitive-choice audit. Safe independent P2 secondary B: W-MATH-016/P-001 **proposal-only** N14 Q12 from prior approved review HEAD on its own branch, completed at b800caafcf73a914379a692a35d93eecc1a9be04. Q12 overlaps lesson/migration and is NOT permitted code. Returned once to A and observed CI still RUNNING. No tight status polling or unrelated work. Next: after meaningful block boundary inspect CI once, if SUCCESS link result to exact code SHA then proceed only to review-branch integration/screenshot evidence, preserving distinct user Gate①; if FAILURE inspect error and fix within unchanged exact proposal or stop for REVISE-PROPOSAL.

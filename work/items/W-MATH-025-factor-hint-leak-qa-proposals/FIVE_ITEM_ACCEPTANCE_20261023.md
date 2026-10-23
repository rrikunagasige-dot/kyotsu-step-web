
## 2026-10-23 — five accepted items now in one candidate
All five remain visually accepted. Q16 is reconciled into source fc27e7f5fbdc28345917276d43602ea4787537bd ([PR119](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/119));N13 migrations and all prior hint/choice fixes retained. All source-specific required CI PASS:250 math unit/257 browser;Q16 dedicated6 browser;Review41 unit;Math practice95 unit/72browser;Governance. [Current reconciliation and scoped audit](../W-MATH-022-n14-q16-endpoint-verification/RECONCILIATION_20261023.md). Older not-integrated/pending descriptions below are historical. W025 whole-chapter Gate② remains OPEN;Gate③ not ready;NE01/NE02 still25 originals. No repeat five-item acceptance required.

# Five-item acceptance and remaining work
Status: BLOCK-VISUAL-OK

## Authorization
2026-10-23 user verbatim: 「続けていいよ。5件承認。　後仕事はまたどれぐらい残っているのか私に状況説明」.
This accepts the five rendered items immediately preceding the reply. It closes their Gate① only. Preserve all previous source/evidence, IDs and history. Continue grouped reviews of about five items under the user's prior explicit instruction.

| Accepted item | Original source SHA | Immutable image SHA | IDs |
|---|---|---|---|
| W026/P001 N06 Q12 choices | d894e38820829c387386d207ff2d44d1ac95eebb | 113298ed523af9f3523aaa1f87469fc3aa737528 | n06-q12-choices; n06-12; n06-formula-12 |
| W025/P005 N05 Q06 hint | b1025cab41342b7648acb191abadfa8aaaa66e5c | 8a3cfc05d173a92386f5bf8244fa28a1d31fabd1 | n05-q06-hint; n05-06; n05-formula-06 |
| W025/P006 N07 Q09 hint | b1025cab41342b7648acb191abadfa8aaaa66e5c | 8a3cfc05d173a92386f5bf8244fa28a1d31fabd1 | n07-q09-hint; n07-09; n07-formula-09 |
| W025/P007 N08 Q05 hint | b1025cab41342b7648acb191abadfa8aaaa66e5c | 8a3cfc05d173a92386f5bf8244fa28a1d31fabd1 | n08-q05-hint; n08-05; n08-formula-05 |
| W022/P001 N14 Q16 five decisions | e64fd99b18ba167364c2dd6b108a6f7fef76f439 | f5b15694740325b56077fe64d740c7a7dc8fb22e | n14-wm022-q16-left-inner; n14-wm022-q16-left-abs; n14-wm022-q16-right-inner; n14-wm022-q16-right-abs; n14-16 |

## Acceptance-only implementation
Parent cda59460d333fad61c811298831c133019286180. Four present review targets become accepted; their original marker IDs remain stored but active markers become empty. The two accepted capture jobs are disabled. Existing boundary tests retain marker IDs while asserting no active marker. No learner content, answer, choice, renderer, schema or progress changes. N14 Q16 lives in separate PR111/rev10 and is not silently transplanted or claimed integrated here; its acceptance is recorded now and must be applied to its review target during candidate reconciliation.

## Verification evidence
Source b102: Math run39902361997 SUCCESS (240 unit tests;254 browser passes,9 explicit skips); Review run39902362044 SUCCESS (41 unit tests;18 dedicated browser passes,18 matrix skips); Governance39902362009 SUCCESS. Q12 source runs39900003882/39900003982/39900003884 SUCCESS. Q16 source Chrome run39752264290 SUCCESS. These are source-specific results, not a claim of Gate② complete or newly reconciled candidate success. Acceptance-only boundary/type/lint/build results are pending native CI for the new commit.

## Remaining work — corrections versus whole chapter
| Scope | Remaining |
|---|---|
| These five | No further Gate① response; implementation and original technical QA done, visual acceptance complete |
| Candidate reconciliation | Combine separately approved N14 rev10 with current rev9 candidate, preserving Q15 and all other accepted fixes/history; then relevant regressions |
| Cross audit Gate② | Complete all applicable current-SHA source/math/choice/hint/figure/shared-mode/mobile/persistence audit rows; keep unchecked rows UNVERIFIED |
| Whole-app Gate③ | Freeze the reconciled SHA and playable URL, then user's full agreed-scope playthrough; not yet ready |
| Remaining chapter creation | NE01:13 original questions; NE02:12. Two units /25 originals. N01–N14 code exists, but this is not a final completion percentage |

No main merge, deployment or publication is authorized by the five-item visual acceptance. No exact time estimate is evidenced; new audit findings can add corrections. Q16 full-page mobile evidence has a known screenshot-overlay limitation; retain it honestly and check actual viewport on the reconciled candidate.

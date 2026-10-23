
## Final source-SHA verification — 2026-10-23
Frozen runtime/review source: **fc27e7f5fbdc28345917276d43602ea4787537bd**, [PR119](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/119). **All required reconciliation CI succeeded.**

| Native run/job | Actual result |
|---|---|
| Math textbook39905633260 /120256818120 | SUCCESS:25 unit files250 tests;257 browser passes,12 explicit project-width skips;type/lint/build, math phone/desktop, source/figure/derivation/accepted repairs, physics textbook and math practice setup |
| Review39905633261 /120256818022 | SUCCESS:5 unit files41 tests,type/lint/build |
| Q16 viewport39905633261 /120256818263 | SUCCESS:6 real normal/review cases at320/390/1440;6 explicit project-width skips |
| Math practice39905633309 /120256818220 | SUCCESS:7 unit files95 tests;36 mobile+36 desktop browser passes |
| Governance39905633270 | SUCCESS |

[15 immutable, unmodified current-source images](./evidence/reconciled-20261023/README.md). Archive f9a764de2d0565c119ade4956fe9addaef2df695 contains images/README only; source PR119 remains frozen. Evidence updates stay on a separate branch so they do not cancel or redundantly rerun the completed source CI. [Scoped Q16 cross-audit](./CROSS_BLOCK_AUDIT_RECONCILED_20261023.md).

**Q16 Gate① remains accepted. Scoped Q16 reconciliation/related Gate② checks are CROSS-VERIFIED. Whole-chapter W025 Gate② remains OPEN** for its other UNVERIFIED root-cause/educational audit cells. Gate③ FINAL-REVIEW-NOT-READY. No user whole-app acceptance,main merge,hosting or deployment is claimed. NE01/NE02 still2 units/25 original questions.

This final checkpoint supersedes earlier pending CI/candidate statements below; older source/evidence remains history.


## 2026-10-23 — current accepted candidate reconciliation
User visually accepted all five items with 「続けていいよ。5件承認。　後仕事はまたどれぐらい残っているのか私に状況説明」, then authorized continuation 「おけいいよ。じゃ続けて」. **Q16 Gate① is BLOCK-VISUAL-OK; no repeat acceptance required.** Older pending statements below are historical.
This branch reconciles the exact accepted Q16 lesson from e64fd99b18ba167364c2dd6b108a6f7fef76f439 into PR118/e4f9cbe850379d0dd30d1a5c9484e8bdf606390d. Preserve current N13 rev3/rev4 migrations and all accepted hint/choice changes. Q16 original images remain immutable at f5b15694740325b56077fe64d740c7a7dc8fb22e; [original evidence](https://github.com/rrikunagasige-dot/kyotsu-step-web/tree/f5b15694740325b56077fe64d740c7a7dc8fb22e/work/items/W-MATH-022-n14-q16-endpoint-verification/evidence/gate1). New candidate QA is **PENDING**. [Reconciliation and audit](./RECONCILIATION_20261023.md). Gate② OPEN; Gate③ FINAL-REVIEW-NOT-READY; no main merge or deployment.

# W-MATH-022 — ACTION LOG
## 2026-10-22 JST — proposal-only recovery and diagnosis
- Loaded attached 37-file handoff ZIP, CRC PASS, teacher original DOCX SHA256 93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa.
- Re-read live repo identity ID 1391122224, main SHA 15ae503455bc6ae75b080caa1c4919cafb250027 and W-MATH-021 HEAD 1e3cb0dd3a6d1a86e856ea8cdf625feccdb985a8; PR#107–110 all DRAFT OPEN.
- Read root constitution, instruction dictionary, Work System §§12A/12B, math textbook SPEC/lessons; source n14Lesson.ts Q13–Q16, helper makeReviewSteps, Word Q16 text/preceding original OMML, W-MATH-021 F-021-02, W-MATH-020 accepted history and N14 progress normalization.
- Identified Q16 single bundled completed expression, wrong-state leak, and N14 rev9->10 archive risk. Scoped unrelated sibling effects UNVERIFIED rather than PASS.
- Created independent proposal branch from approved parent HEAD; wrote Work/FINDINGS/P-001. **No learner app source or history migration, tests, screen capture, PR merge, main/public app or deployment changed.**
- Current stop: USER REVIEW OF EXACT P-001; Q16 implementation permission NOT GRANTED. Gate②/③ not closed.

## 2026-10-22 JST — P-001 user approval and isolated implementation
- Exact proposal approved by direct 「いいよ。続けて」 immediately after the P-001 Q16 visual/5-decision proposal. Not main/host/release approval.
- Changed Q16 ONLY in n14Lesson.ts: left inner, left absolute, right inner, right absolute, final inclusion; preserving accepted Q10/Q14/Q15. Q16 CSS applies only to n14-q16-chain and <=430px.
- Added revision9→10 N14 archive with only active n14-16 invalidated. Previous revision history and approved items survive.
- Added wMath022P001 unit tests, imported into existing newBatchCoverage CI; updated narrow snapshot-dependent assertions and appended Q16 320/390/1440 Chromium wrong/hint/retry path to existing batch E2E.
- No PR merged and no Pages or external hosting, user visual Gate① still pending; test PASS not claimed until actual run succeeds.

## 2026-10-22 JST — Actual Q16 tests PASS, evidence and remaining gates
- Frozen learner code `e64fd99b18ba167364c2dd6b108a6f7fef76f439`; all 4 native workflows PASS: textbook #39752264193 attempt2, practice #39752264279, review #39752264290, governance #39752264397. Textbook first attempt was cancelled, retry SUCCESS.
- Dedicated Q16 320px/390px/1440px real Chrome numbered and normal route job PASS; 15 real PNG images uploaded into Work evidence, all sourced from frozen SHA.
- Subsequent evidence/review-sheet commits changed no learner/test/CI source. Q10/Q14/Q15 original parent code prefix compared byte-for-byte and protected.
- Gate① `BLOCK-CHECK-PENDING`, user `細部OK` still missing; Gate② not CROSS-VERIFIED, Gate③ FINAL-REVIEW-NOT-READY. PR #111 remains DRAFT, main still 15ae503455bc6ae75b080caa1c4919cafb250027.

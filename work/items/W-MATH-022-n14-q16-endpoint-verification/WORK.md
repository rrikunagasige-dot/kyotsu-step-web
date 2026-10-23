
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

# W-MATH-022 — N14 Q16 端点代入・絶対値による確認
Status: VERIFYING
Updated: 2026-10-22 JST
Command: CMD-WORK-001 — 修正

## Objective
原Word N14【16】「両端の値を元の絶対値に代入し、どちらも含めてよいことを確認しよう。」を、完成計算の一括選択から、生徒自身の端点代入・絶対値・境界包含の段階確認へ直す。P-001の承認によりQ16限定実装・技術検証済み。Gate①のユーザー画像確認待ち。

## Authority
- Repository: rrikunagasige-dot/kyotsu-step-web。repo ID 1391122224。
- Baseline main HEAD: 15ae503455bc6ae75b080caa1c4919cafb250027.
- Parent approved Q15 work HEAD: 1e3cb0dd3a6d1a86e856ea8cdf625feccdb985a8.
- teacher original: KYOTSU_MATH_N14_Q10_Q16_AUTHORITATIVE_HANDOFF_20261022(1).zip / SOURCE/teacher_N14_original_word_v2.docx, SHA256 93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa; N14 question【16】 (DOCX paragraph index 611, following N14 Q13–Q15).
- AGENTS.md, governance/CONSTITUTION.md, INSTRUCTION_DICTIONARY.md, WORK_SYSTEM.md §§12A/12B, subjects/mathematics/textbook/SPEC.md and docs/MASTER_APP_LESSONS.md.
- Earlier W-MATH-020 Q15 + W-MATH-021 4-stage hint accepted; W-MATH-021 FINDINGS F-021-02 confirms the Q16 sibling.

## Branch
work/W-MATH-022-n14-q16-endpoint-proposal-20261022; created from W-MATH-021 HEAD, now contains approved Q16 implementation, PASS-tested source SHA, genuine evidence and review records, Draft PR #111.

## Scope
Original N14 Q16; exact P-001 implemented (five distinct learning decisions), N14 v9→v10 selective archival, genuine phone/PC technical QA passed; user visual Gate① still pending.

## Do Not Touch
N14 Q10/Q14/Q15 approved mathematics, Q15 P-003 four-stage wrong hint, other N14 blocks, original Word and one canonical figure n14-f01; math practice/physics; main, production, Pages, Vercel, PR merges, costs. Previously approved learner blocks unchanged; only P-001's Q16 and minimum migration/test/review surfaces modified.

## Approved Proposal
P-001, 2026-10-22 JST: user's direct 「いいよ。続けて」 to the exact Q16 proposal. Not a visual Gate① acceptance or release authorization.

## Current Step
P-001 approved and technical-verification PASS on learner-source SHA e64fd99b18ba167364c2dd6b108a6f7fef76f439; Gate① BLOCK-CHECK-PENDING (no 細部OK), Gate② open, Gate③ not ready.

## Next Step
User visual review of actual numbered Gate① sheet and explicit 細部OK / 要修正. Then and only then continue §12A Gate② independent cross-block audit; whole-app Gate③ remains separately authorized.

## Dependencies
Q13→accepted Q14→accepted Q15 results → Q16. Q16 needs Q15 endpoints -2/3 and 2; Q16 new answers must not leak earlier holes.

## Completion Condition
Q16 technical implementation and verification are complete, not overall Work DONE. Gate① user visual acceptance is still required; Gate②/③ OPEN. Do not merge/release without separate approval.

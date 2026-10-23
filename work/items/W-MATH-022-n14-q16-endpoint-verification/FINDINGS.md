
## 2026-10-23 — current accepted candidate reconciliation
User visually accepted all five items with 「続けていいよ。5件承認。　後仕事はまたどれぐらい残っているのか私に状況説明」, then authorized continuation 「おけいいよ。じゃ続けて」. **Q16 Gate① is BLOCK-VISUAL-OK; no repeat acceptance required.** Older pending statements below are historical.
This branch reconciles the exact accepted Q16 lesson from e64fd99b18ba167364c2dd6b108a6f7fef76f439 into PR118/e4f9cbe850379d0dd30d1a5c9484e8bdf606390d. Preserve current N13 rev3/rev4 migrations and all accepted hint/choice changes. Q16 original images remain immutable at f5b15694740325b56077fe64d740c7a7dc8fb22e; [original evidence](https://github.com/rrikunagasige-dot/kyotsu-step-web/tree/f5b15694740325b56077fe64d740c7a7dc8fb22e/work/items/W-MATH-022-n14-q16-endpoint-verification/evidence/gate1). New candidate QA is **PENDING**. [Reconciliation and audit](./RECONCILIATION_20261023.md). Gate② OPEN; Gate③ FINAL-REVIEW-NOT-READY; no main merge or deployment.

# W-MATH-022 — Root-cause findings (2026-10-22)
Status: CONFIRMED primary / UNVERIFIED broad sweep

## Original source
Teacher original Word, N14 heading「距離の上限と下限から、残す範囲を決める」, Q13–16, N14 Q16:
「【16】両端の値を元の絶対値に代入し、どちらも含めてよいことを確認しよう。」
The Word question line contains no worked endpoint arithmetic, and no separate instructor answer key was provided. The Word's original OMML in the preceding setup is |3x−2|≤4, while Q16 instruction is text. Prior Q15 yields -2/3≤x≤2.

## Confirmed defects in current reviewed app at parent HEAD 1e3cb0dd3a6d...
F-022-01 — bundled decision: src/data/textbook/math/numbers/n14Lesson.ts, makeReviewSteps('n14',...) q:16 grades one item n14-16, prompt「両端の代入結果を選ぼう」, answer `|-4|=4,\\quad|4|=4`. The single choice supplies both completed inner calculations and both absolute values. This changes original learner action from doing substitution/verification to recognizing a finished pair.
F-022-02 — direct leakage after wrong: same q:16 hint reads 「x=−2/3では3x−2=−4、x=2では3x−2=4。距離はいずれも非負。」 It explicitly reveals the two inner-result values before the unresolved substitution answer. W-MATH-021 F-021-02 independently flagged this sibling.
F-022-03 — shared root cause (qualified): original generic authoring helper makeReviewSteps creates one `C(id)` per source marker, and q16 authored data combines distinct calculation/interpretation decisions in one answer+hint. The helper is capable of hosting local custom flow (as proven by already accepted Q10/Q14/Q15 branches); **do not** infer a generic renderer bug or authorize modifying shared helper.
F-022-04 — Q16 source dependencies: original Q13 absolute-removal; Q14 add2 and Q15 divide3 already accepted. Q16 must use Q15's two resulting endpoints. Showing the Q15 endpoints at Q16 start is prerequisite reuse, NOT a Q15 pre-answer.
F-022-05 — valid arithmetic for audit: x=-2/3 -> 3(-2/3)-2=-4 -> |-4|=4≤4; x=2 -> 3(2)-2=4 -> |4|=4≤4; both endpoints included. These are author/test keys, not pre-graded student display.

## §12B scoped impact ledger
- N14 Q16: CONFIRMED F-022-01/F-022-02; separate correction and approval mandatory.
- N14 Q15: historic direct-hint leak resolved under W-MATH-021 P-003; accepted 4-stage text and calculations PROTECTED, NOT-AFFECTED by proposed Q16-specific changes.
- N14 Q10/Q14: approved calculations PROTECTED; new Q16 layout must regression-test continuity, not re-request approval.
- New N14 reviewed family (Q01–Q13) and other source-derived units: UNVERIFIED for *similar* completed-answer hints unless independently audited; identifying a shared **symptom** alone is not proof of shared **root**. No blanket edit authorization.
- N14 historical N14-Q16 progress: CONFIRMED migration concern: `n14-16` already exists, cannot treat old combined answer as new final-boundary interpretation. Must archive/reopen old semantics with revision bump.
- 320/390/1440 app rendering, wrong/retry, cross-mode regressions: UNVERIFIED at proposal stage; no fabricated screenshot/CI result.
- Gate② system-wide and Gate③ full-app: OPEN.

## Corrective boundary
Do not re-open Q10/Q14/Q15; do not replace canonical small blue「選択」/red ×, black math, native source figure or logic across other modes; no proposed number of blanks automatically propagated elsewhere.

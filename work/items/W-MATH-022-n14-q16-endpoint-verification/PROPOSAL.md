
## 2026-10-23 — current accepted candidate reconciliation
User visually accepted all five items with 「続けていいよ。5件承認。　後仕事はまたどれぐらい残っているのか私に状況説明」, then authorized continuation 「おけいいよ。じゃ続けて」. **Q16 Gate① is BLOCK-VISUAL-OK; no repeat acceptance required.** Older pending statements below are historical.
This branch reconciles the exact accepted Q16 lesson from e64fd99b18ba167364c2dd6b108a6f7fef76f439 into PR118/e4f9cbe850379d0dd30d1a5c9484e8bdf606390d. Preserve current N13 rev3/rev4 migrations and all accepted hint/choice changes. Q16 original images remain immutable at f5b15694740325b56077fe64d740c7a7dc8fb22e; [original evidence](https://github.com/rrikunagasige-dot/kyotsu-step-web/tree/f5b15694740325b56077fe64d740c7a7dc8fb22e/work/items/W-MATH-022-n14-q16-endpoint-verification/evidence/gate1). New candidate QA is **PENDING**. [Reconciliation and audit](./RECONCILIATION_20261023.md). Gate② OPEN; Gate③ FINAL-REVIEW-NOT-READY; no main merge or deployment.

# W-MATH-022 — exact approved Q16 correction proposal
Status: APPROVED
Date: 2026-10-22 JST
Command: CMD-WORK-001 修正

## Authority and approval
- Full immutable proposal: [P-001](./PROPOSAL_P001.md).
- User response immediately after exact Q16 five-decision rendering: 「いいよ。続けて」. Scope Q16 learner behavior and QA only.
- Approval is for Q16 implementation; not Gate① visual sign-off, Gate②, Gate③, merge, hosting, production release or billing.

## Scope and invariants
1. One source Q16 becomes 5 graded decisions: left inner=-4, left abs=4, right inner=4, right abs=4, final text=両端とも含む.
2. Original 16 Word markers, canonical N14 figure and Q10/Q14/Q15 prior accepted content/4-step Q15 hint unchanged.
3. N14 revision9→10: archive former n14-16 and reopen it alone; preserve every other approved answer/progress and earlier version archive.
4. Q16-only phone line wrapping, native blue 選択/red × unchanged. Actual Chrome and independent regression evidence required.

## Do Not Touch
Other lessons/modes; main, Pages, Vercel/hosting; production learner progress; approved content outside Q16. No PR merge.

## Reviews
Status: EXACT-P001-APPROVED / GATE1-VISUAL-PENDING / GATE2-OPEN / GATE3-NOT-READY

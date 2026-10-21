# W-MATH-017 / P-008 — N11 Q13 分母を払う→右辺を展開する連続式
Status: PROPOSED — AWAITING EXACT USER APPROVAL; NO LEARNER CODE IMPLEMENTATION
Date: 2026-10-21 JST
Command: existing CMD-WORK-001「修正」 / §12B affected sibling in same original lesson
Current validated learner source SHA: `76ab0e708f0706fbbfa7df1109f19d5263c7db19` (Math CI [39598038354](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39598038354) PASS; real screenshot [39598038524](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39598038524) PASS)
Main remains `15ae503455bc6ae75b080caa1c4919cafb250027`, Draft PR #107 only.
Prior accepted: P-006 N11 Q05/Q06; P-007 N11 Q08/Q09 user 「いいよ」 Gate① at [P007_GATE1_REVIEW_SHEET.md](./P007_GATE1_REVIEW_SHEET.md). DO NOT ask to reapprove, retest/redraw unless exact changed dependency.

## Source and confirmed design defect
Current original teacher Word source marker **N11-Q13** (ref. v2 / page 29, mapped in live `src/data/textbook/math/numbers/n11Lesson.ts`):
`(x-2)/3 \le 2x+1`.
Current one-choice compound key: `\\text{両辺に正の}3\\text{を掛ける},\\quad x-2\\le6x+3`. It mixes **choosing the same valid positive operation on both sides**, **canceling denominator3**, and **distributing 3 to both terms**. Learner only recognizes a ready-made entire result; §12B same-root defect as approved P-005/P-007.
Q12 `-4x\ge-26\Rightarrow x\le13/2`, source Q14 and its already approved `n11-wm013-q14-xcoef` / `n11-wm013-q14-const` operations remain **unchanged** and must remain in original source order. Figure `n11-f02` and Q10/Q11 original gates remain unchanged.

## Exact proposed learner view — math first, one group
Existing renderer can group formula and paragraph by a shared `derivationId:'n11-q13-chain'`. Proposed **four formula rows** with **two explanatory paragraphs**, and **four individually graded decisions**:

```text
 (x-2)/3 ≤ 2x+1

 [3]·(x-2)/3 ≤ [3](2x+1)

 （3は正の数なので、不等号の向きは変わらない。
   左辺は分母の3と掛けた3が打ち消し合う。）

 x-2 ≤ 3(2x+1)

 （右辺では、かっこの中の二つの項それぞれに
   外側の3を掛けてから整理する。）

 x-2 ≤ [6]x+[3]
```
**Reasons are shown only after the preceding equation's decisions resolve**: explanation #1 appears after both multiplier holes, #2 after they are resolved and the cancellation row is displayed. No explanation should disclose `6` or the constant term `3` as finished answers before the student performs distribution. The two separate multiplier holes are justified by "same operation on both sides", as in previously user-approved Q05 and Q08. Do not invent an extra "3で掛ける" word-only quiz.
Q13 remains one original source label, with four authentic learner decisions; no extra pseudo-Q14 created. Preserve Q13 afterword outside derivation: `分母を払った後は通常の一次不等式として移項できる。` Keep Q14 math and prose untouched.

## Exact IDs, choices, grader and progress
| Original source | ID | Decision | Correct | Distractors |
|---|---|---|---|---|
| Q13 | `n11-p008-q13-mul-left` NEW | left multiplier | `3` | `-3`, `1`, `6` |
| Q13 | `n11-p008-q13-mul-right` NEW | same multiplier on right | `3` | `1`, `-3`, `6` |
| Q13 | `n11-13` EXISTING, CHANGED KEY | `3(2x+1)` coefficient of x | `6` | `2`, `3`, `9` |
| Q13 | `n11-p008-q13-constant` NEW | `3(2x+1)` constant | `3` | `1`, `-3`, `6` |

Unit N11 revision **9→10**, active decisions **28→31**. Original N11-Q01..Q14 map remains exactly **14 source markers**; N11-Q13's mapped IDs above change from one to four. The **existing stable `n11-13` answer semantics change** from entire operation+ready result to the coefficient `6`, so archive all v9 records including timestamps/completion into `archivedRevisions['9']`, delete only current `answers['n11-13']`, keep every other old answer (especially P-006 and P-007, Q11, Q14) and history. New three IDs start unanswered. Older v1..v8 migrate through existing v9 steps then v10, no retroactive data loss.
Proposed exact blocks:
- `n11-lead-13` becomes F1 formula premise.
- `n11-formula-13` becomes F2 with two distinct in-equation multiplier choices.
- `n11-p008-q13-positive-explain` NEW paragraph same derivation ID.
- `n11-p008-q13-cancel` NEW F3 formula, resolved after F2.
- `n11-p008-q13-distribute-explain` NEW paragraph same derivation ID.
- `n11-p008-q13-result` NEW F4 formula with existing `n11-13` coefficient choice + new constant choice.
- `n11-after-13` existing paragraph OUTSIDE the group, unchanged; source Q14 continues independently.

## Testable correct reasoning / never invent
Proof: multiplying both sides of `(x-2)/3≤2x+1` by positive3 gives `x-2≤3(2x+1)`; distributivity yields `x-2≤6x+3`. Neither inequality direction nor inclusive sign changes. Check equivalence at negative, zero and positive x. Do not collapse the last two decisions into an operation+final equation choice or create redundant unsupported symbols.

## Authorized *only after new exact P-008 approval*
- Edit only target source `n11Lesson.ts` Q13 blocks, Q13 mapped IDs and local `TextbookItem` keys, `src/domain/textbook.ts` v9→v10 safe migration; directly affected tests/ReviewTarget for Q13 only and evidence-route script. No shared generator/CSS/renderer modification, no new figure/Word change, no other N items.
- Existing P-007 Gate① mark state becomes `accepted` **in the next review build**, as §12A already requires; acceptance ledger and real images preserved. Q05/Q06 remain accepted; Q01/Q11/Q14 untouched.
- Gate① **authentic GitHub-viewable** reviewer sheet with only new Q13 blocks numbered, ordinary normal learner app 320/390/1440 screenshots and exact 40-hex tested source SHA, wrong/hint/retry and Q14 gating. User alone decides `細部OK/要修正`. No staged screenshot/prose mock.
- Focused invariant checks: four rows, two interstitial explanations, no premature complete answer/choice leak, four 4-option distractors, 31 decisions mapped to original 14 Word markers, preservation of all v9 stable history, all earlier archived revisions and previous P-005/P-006/P-007 checked without repeat visual approval.
- Cross-unit §12B sibling scan on N14 Q10/Q14/Q15 plus other candidates; independent Gate② not closed while known confirmed source defects or Word-fidelity cells are UNVERIFIED; Gate③ whole-app exact-SHA playable link/user `総チェックOK` is distinct. Do not merge main, deploy or consume new hosting/paid credits without separate release authorization.

## Scope and explicit approval requirement
Current user 「いいよ」 was an affirmative answer to **P-007 real screenshot Gate①**. It is NOT approval of this new P-008 proposal. No P-008 learner code may be changed until user directly approves this exact proposal. If user changes a block/text/choice/migration, revise the proposal and seek approval before implementation.
**Approval request: N11 Q13 four rows, four genuine holes, two explanations, and revision9→10 selective archival migration — approve as written?**

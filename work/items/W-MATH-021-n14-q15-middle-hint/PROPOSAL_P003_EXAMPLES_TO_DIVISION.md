# W-MATH-021/P-003 — N14 Q15 中央の誤答ヒントを「簡単な例→3xへの転用→割り算」に導く
Status: APPROVED — exact user 「承認お願いします。」, 2026-10-22 JST; implemented, real app tests pending
Date: 2026-10-22 JST
Command: CMD-WORK-001 修正; user feedback during Gate① → REVISE-PROPOSAL
Original reviewed draft SHA: `ae057b6075dc78ba7e905a4313df92393699d7f3`, Draft PR #110; main unchanged.
Stable learner item: `n14-wm020-q15-divide-center`

## User correction / diagnosis
The user rejected the previous P-002's two direct questions and gave a concrete alternative: starting from `2×?=1`, `3×?=1` and *using this progression* to reach the specific `3x` question. Therefore the root was **not** the lack of question marks; it was the lack of a worked *sequence of thought* linking the numerical reciprocal to the current coefficient and division.

The previously user-approved P-001 hint is still in code:
> 3xの係数を1にするには、どんな正の数で割ればよいか考えよう。正の数で割れば不等号の向きと等号は変わらない。

P-002's proposed (never implemented, NOT APPROVED) replacement was:
> 中央の3xをxにするには、どんな正の数で割ればよいだろう？ その数で三辺を割ると、不等号の向きはどうなるだろう？

Neither P-001's past exact implementation approval nor the current user feedback authorizes a new unreviewed change. Preserve both records.

## New exact proposed hint (P-003 — a *single* text field)
At `src/data/textbook/math/numbers/n14Lesson.ts`, change ONLY the existing Q15 center after-wrong `hints[0]` to this exact one-string copy:

> 係数を1にする方法を、まず小さい数で考えよう。① 2×□=1 の□には何が入る？ ② 3×□=1 では？ ③ 同じ考え方で、3x×□=x の□には何が入る？ ④ この掛け算を割り算に直すと、3x÷□=x の□には何が入る？

For human review, its pedagogical stages are presented legibly:
1. **Small numerical example:** `2×□=1` — find the missing reciprocal.
2. **Same pattern with actual coefficient:** `3×□=1` — find the missing reciprocal, without displaying `1/3`.
3. **Transfer to algebra:** `3x×□=x` — transfer the pattern to coefficient of `x`.
4. **Bridge to the real learner operation:** `3x÷□=x` — express the same transformation as division and infer the positive divisor `3`, *without printing `3x÷3=x` as the answer*.

Mathematical equivalence of stages 3 and 4: `3x×(1/3)=x` iff `3x÷3=x`, but **neither evaluated equality or filled value appears in the learner hint**. Unlike P-002, the hint does not merely ask the existing question again. The line `正の数で割れば不等号の向きと等号は変わらない` already exists in the approved Q15 *explanatory paragraph after the three divisor holes are solved*, and is not prematurely restated as a finished explanation inside this error hint.

The `□` here are only **noninteractive example blanks in one existing hint string**, never new app problems, graded nodes, additional answer IDs, or an invitation to insert arbitrary UI controls. The current hint renderer wraps plain text in a `span` and does not parse LaTeX; the proposed exact source string uses plain Unicode and fullwidth spacing to remain a one-field correction. Check genuine phone/PC layout before acceptance.

## Scope and Do Not Touch
- Change only one `hints[0]` string of `n14-wm020-q15-divide-center`, after new explicit P-003 approval.
- Preserve the previously accepted Q15 3 logical equations/one explanatory paragraph/5 original graded choice answers `3,3,3,-\frac23,2`, mobile two visual rows and original blue 「選択」/red 「×」, Q10/Q14/N11 acceptances, Q15 remaining hints, Q16 and original Word.
- No source marker or progress revision9 migration updates. No renderer, CSS, GitHub workflow restructuring or public Pages changes without a separate exact proposal. Existing P-001 proof/screenshots remain historical but cannot prove new wording.
- §12B impact: sibling old Q16 worked-value hint is confirmed separately but outside P-003; Q10/Q14 no-graded-answer hints were not affected by this specific change; broader units UNVERIFIED.

## After a new exact approval (not before)
- One-string replacement, one focused unit test asserting the four example expressions in order, no `3x÷3=x` evaluated answer, unchanged 5 graded answers and revision9.
- Real Chromium wrong→hint→retry at 320/390/1440, with line wrapping/scroll bounds and exact operated SHA. A changed-hint-only screenshot and visual review; never reapprove the prior Q15 mathematical Gate①.
- Full Math textbook/practice/review/governance regression; preserve evidence and report failures as failures. Gate② global not CROSS-VERIFIED and Gate③ user full-app `総チェックOK` not complete.

## Decision and STOP
Is this **four-stage small-example → reciprocal → 3x → division** one-hint P-003 text approved? The status is PROPOSED/REVISE-PROPOSAL and **no P-003 learner code change has been made**.

## User approval and scope
The user replied **「承認お願いします。」** directly after the P-003 four-example hint review. Implement only the one Q15 center after-wrong hint as given; P-002's rhetorical-question alternative never implemented. Focused tests and 320/390/1440 real screenshot recapture follow. Earlier P-001 genuine images are preserved by their original Git blobs in evidence/history/p001-before-example-first. No new choices, stage nodes, formula, CSS, Q16 edit, Gate② or Gate③ approval.

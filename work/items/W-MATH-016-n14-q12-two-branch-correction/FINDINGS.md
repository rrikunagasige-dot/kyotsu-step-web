# W-MATH-016 — FINDINGS
Status: CONFIRMED

F-016-01 / R1: Teacher N14 Q12 asks to separately solve the two inequalities from original Q11, yet current interface collapses two arithmetic transformations into a final four-choice answer. The current combined final answer and original three distractors are mathematically correct.
Proof: x+3≤−2 ⇒ x≤−5; x+3≥2 ⇒ x≥−1. Both subtract the same positive 3 from each side, preserving direction and equality. OR union is x≤−5 OR x≥−1, not an intersection. Two cognitive checkpoints are warranted, but no independent new original source questions are created.
Risk/independence: W-MATH-015 Q08 owns same N14 lesson and migration; THIS is source proof/proposal only, Q12 code implementation may only follow separate exact user approval and Q08 review baseline reconciliation. No master lesson defect is implied; §12B already covers R1.

## 2026-10-21 current source and approval checkpoint
- After user 「続けて」 directly following N14 Q08 authentic-image Gate①, Q08 **BLOCK-VISUAL-OK** was recorded on review-only PR #101 at full SHA `cf5b3285d01b958a3c6eea7c1e152320a9228bab`; Q07 and previous N11 Gate① remain accepted.
- Current reviewed N14 source blob `3463e44fd198e3cb2a1f1e3460e5e2d48417150d` is **revision 5** with 20 active N14 choices and original Q12 final answer/key still unchanged. Source CI #39541910451 SUCCESS on same code blobs, genuine Q08 screenshots #39543275894 SUCCESS. Independent review-merge CI #39543280746 was CANCELLED, not a PASS.
- N14 Q12 still requires student-observable left subtraction `x+3≤−2→x≤−5`, right subtraction `x+3≥2→x≥−1`, and original final OR. Original final key and all three distractors stay identical. Proposed N14 v5→v6 and 20→22 decisions plus math batch 140→142, selective history archive and 18 actual screenshots are **targets only**, not implemented.
- **NO Q12 IMPLEMENTATION APPROVAL** has been given. This is still P-001 PROPOSED; any future approved implementation should branch from the then-current PR #101 review SHA, not this old proposal branch's source. Q07/Q08 source and prior user acceptance, master lessons, main and publication stay protected.


## 2026-10-21 user authorization / implementation checkpoint
Approved Q12 R1 correction adds left x≤−5 and right x≥−1 as separate student-answer choices before the old final OR. Teacher original unchanged; the three original final distractors still distinguish inside vs outside, inclusive vs strict, and wrong shift. Q07/Q08 approvals stay accepted, no code changes there. Code and migration now implemented at `fb808f213154b66f51a471ce1bf8c80aae7ccab2`; no CI or real browser PASS until actual runs complete. All prior root findings kept, do not create a new lesson.

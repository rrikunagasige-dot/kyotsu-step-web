# W-MATH-016/P-001 — N14 Q12 二つの不等式を別々に解く
Status: APPROVED
Updated: 2026-10-21
Command: CMD-WORK-001「修正」
Implementation approval: APPROVED by user's exact 「承認」 in direct reply to the complete unchanged W-MATH-016/P-001; only Q12 source, progress and tests, no main/hosting.

## 1. 原典と修正理由
Teacher-edited original Word SHA256 93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa, N14-Q11 → Q12. Q11 has derived x+3≤−2 OR x+3≥2; source Q12 says「それぞれを解き、二つの範囲をまとめて答えよう」. Existing N14-Q12 asks only one final formula choice. W-MATH-011 independent Gate② marks root R1 CONFIRMED: the required two arithmetic steps are unobservable although the final key and old distractors are correct. Reuse existing canonical textbook/proof/holes lessons; no new rule/lesson.

## 2. Derivation (both branches)
For left: x+3≤−2 iff x+3−3≤−2−3 iff x≤−5.
For right: x+3≥2 iff x+3−3≥2−3 iff x≥−1.
Adding/subtracting the same real number on both sides never reverses inequality. The original connector is OR, so the answer is x≤−5 OR x≥−1. Endpoints −5 and −1 belong; the inner open interval does not.

## 3. One original Q12 with two new local holes
STEP① New n14-wm016-q12-left. Given x+3≤−2, learner chooses x\le-5. Wrong x<-5 (lost equality), x\ge-5 (reversed), x\le-1 (wrong constant). After answer show −2−3=−5, before answer only prompt to subtract 3 from both sides; no final result leak.
STEP② New n14-wm016-q12-right. Given x+3≥2, choose x\ge-1. Wrong x>-1 (lost equality), x\le-1 (reversed), x\ge1 (wrong constant). After answer show 2−3=−1; hint only prompts subtract 3.
STEP③ Original stable n14-12 with original correct x\le-5\;\text{または}\;x\ge-1 and original three incorrect alternatives EXACTLY preserved: -5\le x\le-1 / x<-5\;\text{または}\;x>-1 / x\le-1\;\text{または}\;x\ge5. Now the learner combines the two independently solved branches using OR. Only after final answer explain union, strictness and retained endpoints.
Fire diagram: N14 Q11 (two starting inequalities) → [left x≤−5 hole] → [right x≥−1 hole] → [original n14-12 OR final 4-choice] → Q13 original.
Keep same original source marker N14-Q12, compact formula-local choice without 320px clipping, no extra giant headings/new figures, black concept content.

## 4. Conditional implementation scope — AFTER separate approval only
Prerequisite Q08 P-001 has passed source CI, genuine screenshots and user Gate①; Q07 already user accepted. Q12 shares N14 lesson and revision migration so no overlapping source work until verified Q08 review branch SHA is frozen. Once approved, only replace the source Q12 lead/formula/after locally, add 2 reviewItems and N14-Q12 source map = [n14-wm016-q12-left, n14-wm016-q12-right, n14-12]. Keep 16 source Q markers and original Q12 final/key. Conditional if Q08 current rev5 is accepted unchanged, N14 revision5→6, items20→22, eight-unit decisions140→142 (targets only). N14-only v1–v5→v6 migration must archive v5, preserve all previous old Q07/Q08/Q12 answers, first/last answer times, completion history, older archives and idempotence. Only two new decision IDs unfilled.
Unit tests on source/math/new 6 wrongs/original 3 wrongs, answer gate and KaTeX; 320/390 wrong→hint→retry→right→reload with 18 genuine source-SHA images, all math/physics/practice regressions. Shared renderer/schema/styles/CI/figure/Word not in scope.
Gate① ONLY Q12 new visual human check; previously accepted N11/Q07 never re-opened. Gate② entire source/maths/regressions including Q08 and Q12 must pass; Gate③ real fully playable URL exact SHA needs separate release approval.

## 5. Do Not Touch & independence
N14 Q01–Q11, Q13–Q16, original PNG, original Word, accepted Q07 and Q08, N11, physics/practice, common code, master lessons, main, deployment and billing. An unapproved shared change or Q08 baseline deviation stops work and requires a revised P-001. The current W-MATH-016 branch is PROPOSAL-ONLY; Q12 code changes not authorized.
Historical drafting checkpoint: Q08 CI was pending when Q12 P-001 was first drafted, but is completed now. The latest reviewed source and Gate status are recorded below. No idle CI polling or overlapping Q08/Q12 source edits.

## 2026-10-21 current source and approval checkpoint
- After user 「続けて」 directly following N14 Q08 authentic-image Gate①, Q08 **BLOCK-VISUAL-OK** was recorded on review-only PR #101 at full SHA `cf5b3285d01b958a3c6eea7c1e152320a9228bab`; Q07 and previous N11 Gate① remain accepted.
- Current reviewed N14 source blob `3463e44fd198e3cb2a1f1e3460e5e2d48417150d` is **revision 5** with 20 active N14 choices and original Q12 final answer/key still unchanged. Source CI #39541910451 SUCCESS on same code blobs, genuine Q08 screenshots #39543275894 SUCCESS. Independent review-merge CI #39543280746 was CANCELLED, not a PASS.
- N14 Q12 still requires student-observable left subtraction `x+3≤−2→x≤−5`, right subtraction `x+3≥2→x≥−1`, and original final OR. Original final key and all three distractors stay identical. Proposed N14 v5→v6 and 20→22 decisions plus math batch 140→142, selective history archive and 18 actual screenshots are **targets only**, not implemented.
- **NO Q12 IMPLEMENTATION APPROVAL** has been given. This is still P-001 PROPOSED; any future approved implementation should branch from the then-current PR #101 review SHA, not this old proposal branch's source. Q07/Q08 source and prior user acceptance, master lessons, main and publication stay protected.


## 2026-10-21 user authorization / implementation checkpoint
Latest user **「承認」** gave exact P-001 learner implementation permission. It does not authorize Q07/Q08 rework, other Q12 design expansions, common renderer/styles/schema/workflow, PR #101→main merge, or deployment. The historical 'WAITING' and pending source baseline notes above predate approval. Implemented on an isolated review-parent branch at `fb808f213154b66f51a471ce1bf8c80aae7ccab2` (four bounded code/test files), pending actual CI, exact-SHA genuine screenshot evidence and separate human Q12 Gate① acceptance.

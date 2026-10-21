# W-MATH-014 / P-001 — N14 Q07 絶対値不等式の一般導出を復元
Status: PROPOSED
Updated: 2026-10-21
Command: CMD-WORK-001「修正」
Implementation approval: WAITING — source code must not be edited before this exact Proposal is approved.

## 1. What / why / original authority
Original teacher-edited 01_数と式_教科書モード_対話段階導入版_v2 Word, 212863 bytes, SHA256 93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa. Its N14 Q07 belongs to 導出 and asks to generalize for a>0 and real X. Current source: src/data/textbook/math/numbers/n14Lesson.ts, blob 15cfb7bb70153a9661a9377270ae090974d54c1b, original n14-07 answer −a<X<a, with three unchanged erroneous choices. Both mathematical answer and old distractors are correct as answer keys. Defect R2 from W-MATH-011: current text directly asserts “inside” without explaining WHY the two sign cases give the general formula, and lacks a complete proof of equivalence. This is not a confirmed exact-answer leak. Existing MASTER_APP_LESSONS and Mathematics Textbook SPEC §§5–8 already address explanation/proof/holes: do not add or alter a lesson.

## 2. Full mathematical derivation, including reverse
Assume a>0, X real.
Forward: if X≥0 then |X|=X, and |X|<a entails 0≤X<a. If X<0 then |X|=−X, and |X|<a means −X<a. Multiply by −1 (inequality flips) to obtain X>−a, so −a<X<0. Both cases are exhaustive; their union is −a<X<a.
Reverse: if −a<X<a, for X≥0, |X|=X<a; for X<0, X>−a implies −X<a and |X|=−X<a. Therefore |X|<a iff −a<X<a for a>0. Endpoints ±a are excluded; 0 is included.

## 3. Single original Q07, three thought operations
Use existing heading/marker 「距離の規則を一般化する / 導出」; no new decorative headings/cards or images.

**Step 1 NEW — nonnegative branch.** ID n14-wm014-q07-nonnegative. Show |X|<a, a>0, X≥0 and definition |X|=X; ask what interval this sign branch allows, with an equation-local formula choice in its own short container. CORRECT 0\le X<a. Wrong 0\le X\le a (includes endpoint), X>a (wrong direction), -a<X<0 (negative branch). After resolving, show X<a and combined 0≤X<a; before answering do not display that completed interval. Hint only to substitute |X|=X and remember X≥0.

**Step 2 NEW — negative branch.** ID n14-wm014-q07-negative. Show X<0, |X|=−X and −X<a; ask for the resulting interval after multiplying by −1, with the completed answer hidden in the formula-local choice. CORRECT -a<X<0. Wrong -a\le X<0 (endpoint error), X<-a (wrong reversal), 0\le X<a (wrong sign case). After answering show −X<a ↔ X>−a and −a<X<0. Hint reminds the learner only that multiplication by a negative reverses inequality.

**Step 3 EXISTING — original final expression.** Stable ID n14-07. Prompt learner to COMBINE two derived sign cases in one inequality. Preserve original four options exactly: CORRECT -a<X<a; three false X<-a\;\text{または}\;X>a, -a\le X\le a, a<X<-a. Revise original lead only to remove the premature verbal assertion of final interval; maintain original after-text and add the converse direction AFTER this final choice is resolved. No complete union formula before Step 3.

**Fire diagram / gate sequence**
N14 Q01–Q06 concrete distances and original figure → Q07 (a>0, |X|<a) → case X≥0 choose 0≤X<a → case X<0 choose −a<X<0 → original n14-07 choose their union −a<X<a → after original answer: prove converse → Q08 unchanged (separate R2 queue) → Q09–Q16 unchanged (Q12 separate R1).

Design must preserve black concept/proof prose, functional colors only, proof-vs-example distinction; no long concatenated math and choices inside a 320px formula box. Original source Q07 remains ONE original question, not three new source questions. Q01–Q06's numerical examples already give geometry; no extra figure needed.

## 4. Exact implementation after approval only
1. N14 lesson src/data/textbook/math/numbers/n14Lesson.ts: replace ONLY generated Q07 lead/formula/after sequence by 2 new guided items + unchanged original n14-07 + original after + reverse-proof paragraph; reuse established local insertion technique. Do not alter Q08/Q12. All existing figure bytes and position unchanged.
2. N14 source map ONLY N14-Q07 = [n14-wm014-q07-nonnegative, n14-wm014-q07-negative, n14-07]; keep exactly 16 original markers N14 Q01–Q16. Add 2 item decisions: N14 16→18, total current 8-unit decisions 136→138, original 123 source questions unchanged. Each new decision has exactly one correct authored choice + 3 genuinely incorrect authored choices.
3. N14 revision3→4 in src/domain/textbook.ts. First normalize old v1/v2 to approved v3 historical migrations, then new v3→v4 pure/idempotent snapshot: preserve active answers for ALL preexisting N14 IDs (including previously completed n14-07), archive exact v3 answers/completedAt/provenance as archivedRevisions['3'], preserve prior v1/v2 archives and previousRevisionCompletedAt. Current completedAt cleared until two new items answered; no unrelated progress reset and no re-approval of N11 Q01–Q04/Q11/Q14.
4. Related new tests in existing math numbers/newBatchCoverage.test.ts and e2e/new-batch-walkthrough.spec.ts (both already run in Math textbook CI and existing real screenshot capture workflow). No workflow, shared schema/renderer/UI/CSS change. Unexpected shared-data change → STOP/REVISE-PROPOSAL.

## 5. Exact verification and three Gates
Independent signs and endpoint math checks, all six new and three original wrong-answer classifications, KaTeX, lead/after answer-hiding, group proof/converse placement, source IDs/138 choices, figure hashes, v1–v3→v4 selective history and idempotence. Existing 320px/390px browser wrong→hint→retry→correct→reload for all 3 Q07 stages, 18 actual PNGs under exact checked code SHA, desktop view. CI for all 138 math operations + previously accepted N11 Q01–Q04/Q11/Q14, N12, other math and physical/maths-practice regressions on the precise new SHA; never invent a PASS before an actual run.
Gate①: user sees just N14 Q07's newly captured 18 images and explicitly accepts this small block. Do not repeat N11 accepted review.
Gate②: cross-audit R2's N14 Q08 and R1's N14 Q12 as separate required correction proposals; whole chapter not CROSS-VERIFIED yet.
Gate③: unchanged whole-app real hosted URL matched to final SHA and complete user-play, only after separately authorized main/publication; no deployment in this Proposal.

## 6. Do Not Touch
N14 Q08/Q12, every original Q01–Q06/Q09–Q16 final key, original n14-07 4 choices, original n14-f01 PNG, original Word, N11 previous acceptance/code/progress, global mode/generator/schema/CSS, math-practice, physics, master lessons, main and PR #101 main merge, Pages/Vercel/publication and credentials. Any source mismatch or scope change requires revised proposal and new approval.

## 7. Approval provenance / stop
User said 「おけ続けて」 in direct response to N11 Q14 image Gate①, so Q14 visual is accepted and next correction research/design may proceed. This message was NOT approval of as-yet-unshown N14 Q07 proposal. Current P-001 is PROPOSED and must be presented in full before independent implementation approval. On approval, process Q07 alone. Separate proposals needed for Q08 and Q12.

## 8. Existing and expected evidence
Live review branch base 5f5d92a1a798259dc6e947ff561065a4800850c6; original N14 blob 15cfb7bb70153a9661a9377270ae090974d54c1b; user Word SHA256 above; W-MATH-011 maths/source audit confirms R2. Counts, test ideas and screenshot count above are **targets, not completed tests**.

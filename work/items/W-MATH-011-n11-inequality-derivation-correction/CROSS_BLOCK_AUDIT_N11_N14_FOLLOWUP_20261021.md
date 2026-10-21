# W-MATH-011 / Gate② — N11 Q12/Q14 と N14 Q07/Q08/Q12 の原典横断監査
Status: IN-PROGRESS / NOT CROSS-VERIFIED (four confirmed pedagogical gaps)
Date: 2026-10-21 JST; operation: AUDIT/RECORD ONLY; no app modification
Source: original user-edited DOCX, 212863 bytes, SHA256 93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa, from supplied KYOTSU_N11_Q11_AUTHORITATIVE_HANDOFF_20261021 ZIP. Source/original_math_extracted.md in the same ZIP was inspected for all five original questions; official publisher answer booklet unavailable.
Current learner code audited: 74b73ad275b8aced7ccf99c3ef0ffc943f02d208; PR #101 review branch before records commit cb32e348ff492bdcba5352239ae35425e1a33a5f; main is a separate W-GOV-009 governance-only integration, not the PR #101 math code.
App files: src/data/textbook/math/numbers/n11Lesson.ts (blob 5afb6870054a69223e2eeddf976bd0d2114d58ce), n14Lesson.ts (blob 15cfb7bb70153a9661a9377270ae090974d54c1b); newBatchGuidedSteps.ts generates lead -> unanswered C(item) -> answer-gated after.

## Q11 Gate① visual approval (user evidence)
After the user was shown all three actual Q11 inline blanks and asked for Q11 visual approval, the immediate response was exactly 「じゃいいよ。続けて」 followed by instruction to audit these five questions. Record BLOCK-VISUAL-OK for *N11 Q11 alone*, tested code SHA 74b73ad275b8aced7ccf99c3ef0ffc943f02d208 and 18 genuine screenshots GATE1_N11_Q11_REVIEW_SHEET.md. Previous N11 Q01-Q04 approvals remain. Do not treat as Gate② PASS, full app acceptance, merge, deploy or sibling question approval. Historical PENDING text preserved; remove markers only in next NEW review output.

## Independent mathematical derivation, choice review, and source-to-cognition comparison
**N11 Q12 — NOT-AFFECTED by R1/R2**. Source asks for last negative division. -4x >= -26; divide by -4 (<0) and reverse inequality: x <= (-26)/(-4) = 13/2. Correct choice x<=13/2. Wrong >=13/2 reverses, <=-13/2 signs quotient wrong, <13/2 excludes valid boundary. This is one previously learned negative-divisor operation (N11 Q09), so reduced late-unit support is reasonable. No confirmed new defect.
**N11 Q14 — CONFIRMED R1 / missing three meaningful steps**. Word says solve x-2<=6x+3 by collecting like terms. Subtract x: -2<=5x+3. Subtract 3: -5<=5x. Divide by +5: -1<=x, thus x>=-1. Existing n11-14 asks only one complete answer; correct key and all three false alternatives are mathematically fine, but source-required calculations are unobservable. Distinguish reduced *hint* from absent algebra. Correction requires an exact new Proposal.
**N14 Q07 — CONFIRMED R2 / missing general-case proof, NOT confirmed answer leak**. Word labels this paragraph 導出 and asks absolute-value-free formula with a>0. For X>=0, |X|=X and |X|<a means 0<=X<a. For X<0, |X|=-X and -X<a means -a<X<0. Unite: -a<X<a. Current n14-07 merely says X lies inside -a,a and asks for completed interval; correct key and all distractors are mathematically valid as true/false alternatives but the proof bridge from a numerical example to arbitrary X,a is absent. 'Inside' contextual hint does not itself give completed symbolic answer.
**N14 Q08 — CONFIRMED R2 / missing general-case proof, NOT confirmed answer leak**. For X>=0, |X|>a iff X>a. For X<0, -X>a iff X<-a. The solution is (X<-a) OR (X>a); AND would demand being on both sides simultaneously. Current n14-08 asks only the two-range final expression after stating outside intuition, without general sign-case reasoning. Correct key and three wrong alternatives are mathematically distinct; proof/OR reasoning under-taught.
**N14 Q12 — CONFIRMED R1 / two independent branches collapsed**. Original Q11 established x+3<=-2 OR x+3>=2; Word Q12 explicitly asks to solve each branch before recombining. Subtract 3 separately: x<=-5 and x>=-1, then OR. Existing n14-12 asks only one joined answer. The correct answer and three wrong alternatives are mathematically sound, but neither branch is an answered learner node. Requires one-block correction plan, not an unauthorized edit.

## §12B impact and correction queue
R1 (nontrivial operation skipped in one final choice): Q11 was repaired and visually accepted; N11 Q14 and N14 Q12 newly CONFIRMED; N11 Q12 NOT-AFFECTED because one previously taught operation. R2 (generalized property without causal derivation): N14 Q07 and Q08 newly CONFIRMED in the marked proof section. R3 (pre-answer exact result leak): NO new confirmed instance among these five. Do not reopen earlier repaired N14 Q05/Q06/Q11 or N06 Q11 without evidence.
Visited (root,artifact,revision): (R1,N11-Q11,rev5) FIXED; (R1,N11-Q12,rev5) NOT-AFFECTED; (R1,N11-Q14,rev5) CONFIRMED; (R2,N14-Q07,rev3) CONFIRMED; (R2,N14-Q08,rev3) CONFIRMED; (R1,N14-Q12,rev3) CONFIRMED. Other 123 full original keys beyond this bounded audit remain UNVERIFIED. No duplication into MASTER_APP_LESSONS; already covered by §§7/8/11/12/18/20/51-53 and Math Textbook mode SPEC §§5-8.

## Gate② evidence ledger
| Surface | Scope verdict | Evidence/limitation |
| --- | --- | --- |
| Word provenance, five question labels and math statements | PASS | Original DOCX hash verified, independent extraction and current source map checked |
| Five true answers + 15 wrong alternatives | PASS (math) | Explicit derivations above; false options distinguish errors and loss of endpoint |
| Thinking-stage/source fidelity | FAIL | Four independently identified R1/R2 gaps; Q12 N11 NOT-AFFECTED |
| Premature exact result | PASS (static only) | Five leads do not print their final symbolic answer; generator places after after the choice |
| Choice format and continuity | PASS (static) | One 4-way choice per existing item; mathematical quality does not substitute for stage fidelity |
| Genuine figure/hash and known KaTeX regressions | PASS for previous CI scope | Existing assets unchanged; no new five-item screenshot claim |
| Five-specific wrong/hint/retry/correct | UNVERIFIED | Existing 134 correct-path CI, but no fresh five-item wrong-branch replay |
| Focused 320/390 and desktop | UNVERIFIED | Q11 18 actual 320/390 views exist; not five new targeted screenshots |
| Previous accepted corrections, progress and other modes | PASS within prior tested SHA | CI #39519336157, review state unchanged; source not modified in this audit |
| Human visual Q11 Gate① | PASS | User 「じゃいいよ。続けて」 on 2026-10-21, Q11 code and 18 screenshots; no approval inferred for other blocks |

## Stop and next work
All four newly confirmed pedagogical corrections require separately **explicitly approved**, bounded CMD-WORK-001 proposals and one-question/concept preflight. Candidate order: N11 Q14; N14 Q07; N14 Q08; N14 Q12. After each approved future repair: independently prove math; verify distractors, revised progress IDs and gating; capture authentic 320/390 wrong->hint->right->reload; rerun relevant previous-accepted and all-mode regressions; ask Gate① ONLY for amended block. No learner/source/figure/main/deploy/mode/master changes authorized by this audit.
Global Gate② remains FAIL / NOT CROSS-VERIFIED, even after Q11 visual OK. Original full 123-answer independent audit and focused five-item UX verification remain open. Gate③ FINAL-REVIEW-NOT-READY.

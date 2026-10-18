# W-MATH-004 — FINDINGS
Status: APPROVED CORRECTION CODE PREPARED / CI AND USER REVIEW PENDING
Date: 2026-10-18 JST

## F-001 — CONFIRMED / ERROR-REASONING-PEDAGOGY
Existing N12 `readingFlow` Q01/Q02 uses original inequality → one answer choice with fully solved bound without an intermediate visible transform. The source Word likewise asks “解こう” as one source marker, but app authoring must compensate with meaningful thinking nodes. Existing choices: Q01 x>-7/2, Q02 x≤1/2; mathematical answers are correct, scaffold density insufficient.

## F-002 — CONFIRMED / ERROR-REASONING-PEDAGOGY
N12 Q06 asks for the solved pair `x≤2, x≤5/3` as a single choice with no visible two-branch algebra. Q12 uses the simplified amount directly after the expression. Q13 jumps from 3200≤2650+50x<3300 to 11≤x<13 (subtract 2650 and divide 50 in one step). R1 signature = multi-operation hidden behind a single final-result choice, not just “too few holes”.

## F-003 — CONFIRMED / SCOPE-PROVENANCE
N11 14 + N13 9 + N14 16 = 39 original source markers in PR #73 draft P-003; not yet app code. Thus deficits there are design risks, not released UI defects. P-003 remains unapproved/paused. N12 contains 15 existing source markers and actual review-only app code; total inequality-related 54 markers.

## F-004 — CONFIRMED / MOTHER DOCUMENT
The 212863-byte 53-page Word was located as a Library file with the known filename; relevant document pages 36–47 show source N11–N14 numbered questions, prose, examples/proofs and figures. Extracted Word text omits OMML formula glyphs, so math exactitude uses independent GitHub source audit; no claim that publisher solutions were inspected. Do not overwrite the mother DOCX.

## F-005 — RISK / HYPOTHESIS NOT UNIVERSAL
The user observed first-section guidance quality degrading later. This is testable, not a law proven by N12 alone. Comparison on main: N01 Q09a/Q09b separates coefficient grouping/result; N03 Q09-Q11 separates distributive mapping/products/combine; N09 Q12-Q14 stages roots/sign/integer part; N10 Q17-Q21 stages conjugate selection, denominator and numerator. N03-Q13 / N02-Q09 are late transfers combining operations after previous worked examples; keep them for full assessment rather than label erroneous based on number of operations alone.

## F-006 — PROPOSED CAUSAL CRITERIA
R1: two or more not-yet-modelled nontrivial transformations hidden between visible input and answer. R2: no explanation linking transformation to its reason or meaning. Intentional fade is valid **if** the learner already built the same chain before and final explanation remains readable. One source marker ≠ one UI hole. Evaluate each unit beginning/middle/end, not total hole count.

## F-007 — CONSTRAINT / SHARED GOVERNANCE
WORK_SYSTEM §12B requires cross-approved-creation impact ledger and linked correction approvals, followed by deduplicated common lessons and a correction queue check before resuming P-003. Audit itself never approves mass repair or main/Pages merge.

## F-008 — OPEN-QUESTION / QA
Original author's answer booklet absent; actual browser/phone usability and the source figures after proposed N12 changes remain untested. N11-F02/N13-F02/N14-F01 timing specified in paused P-003 and must not become answer leaks in later implementation.

## F-009 — CONFIRMED / APPROVAL
The user explicitly approved exact P-001 on 2026-10-18 JST. It authorizes review-only N12 six additional stages, focused tests, sibling impact audit. Main merge/Pages publication remain unapproved.

## F-010 — SOURCE-LEVEL SIBLING IMPACT
All items and readingFlow in N01/N02/N03/N09/N10 inspected. No additional confirmed R1/R2 match; N02 Q09 and N03 Q13 intentionally combine previously modeled operations in late transfer exercises. Findings do not certify unrelated errors or live browser/mobile behavior. See ledger and blob SHA evidence.

## F-011 — OPEN / DELIVERY GATES
Static authoring review is separate from typecheck/Vitest/lint/build, mobile clickthrough, wrong-answer/reveal, persistence/restore, user acceptance and independent publish approval. Do not mark DONE until these gates close or are explicitly blocked with evidence.

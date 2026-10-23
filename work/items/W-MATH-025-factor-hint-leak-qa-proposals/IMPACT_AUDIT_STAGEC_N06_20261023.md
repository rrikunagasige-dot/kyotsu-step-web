# W-MATH-025 Stage C — N06 wrong-hint root-cause second pass
Status: OPEN — focused source audit, not overall Gate② clearance
Updated: 2026-10-23 JST

## Authority / visited root and artifact
- Primary approved correction P-003; `answer_preexposure_on_wrong_attempt`: before a question is correctly answered, a wrong-attempt hint gives the still-required numeric pair or completed factorization, rather than evidence/method. Already solved earlier results may be retrieved without being classified as unseen answers.
- Source under test `7bad9d800d143dcc99f52fecb96b867914ca09d7`; parent `9ef406823375a267d13d493c2a3c57af5e938beb`; N06 revision3, 16 markers/16 decisions. q3 hint is the only learner-source delta.
- Creation provenance: W-MATH-003/P-003-R1 approved eight-unit creation; later approved P-004-R2 protects N06 Q01/Q05 reasoning, P-004-R5 protects Q15's computed sum/decision and N06 revision3 history. Their existing acceptance is retained. Current Work/Proposal records were reread at this source.
- Teacher Word SHA256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`, N06 paragraphs248–278; current n06Lesson and makeReviewSteps gating inspected. This visited set is (root, N06 Q01–Q16, revision3, source SHA), not an unbounded all-questions rewrite.

| Artifact | Root applicability / required student act | Result / action |
| --- | --- | --- |
| Q01 | Hint locates a repeated expression, without supplying the whole substitution and transformed polynomial. | NOT-AFFECTED for this root |
| Q02 | Gives cross-products to add, leaving the coefficient and constant addition to the student. | NOT-AFFECTED |
| Q03 | Old hint supplied −3 and2. Exact P-003 removes those values and leaves sign + sum/product checks. | CONFIRMED old defect; IMPLEMENTED; real Chrome6 cases PASS, user Gate① pending |
| Q04 | Reminds replacing both occurrences of X; does not give the restored final product. | NOT-AFFECTED |
| Q05 | Points to exponent2 in the substituted quadratic, without the complete definition plus polynomial answer. | NOT-AFFECTED; P-004-R2 protected |
| Q06 | Current hint explicitly supplies T−1 and T−4 before the student's factorization. | CONFIRMED; exact P-004 APPROVED but deferred until Q03 Gate① |
| Q07 | General difference-of-squares identity, not the completed four-factor answer. | NOT-AFFECTED |
| Q08 | Requests separate degree counts from the original expression; does not give the final pair of degrees plus sorting choice. | NOT-AFFECTED |
| Q09 | Locates the original y-containing terms; does not supply the collected complete expression. | NOT-AFFECTED |
| Q10 | Indicates one common x, leaving the inner quadratic to the student. | NOT-AFFECTED |
| Q11 | Coefficients y andx are already visible in the question; hint asks to take their sum without the full new product. | NOT-AFFECTED for this root; existing source-order correction preserved |
| Q12 hint | Accepted P-002 uses signs and retention of x+y, with neither integers2/−1 nor a completed new factorization. | NOT-AFFECTED in the accepted repaired hint |
| Q13 | Points to original terms 3xy−x; student must compute the coefficient and collect the constant. | NOT-AFFECTED |
| Q14 | Provides first/last coefficient checks, not the two new factors. | NOT-AFFECTED |
| Q15 | Points to visible terms2y,y,1,−2; the sum3y−1 and compatibility decision still require the student's response. | NOT-AFFECTED; P-004-R5 protected |
| Q16 | Factors2y+1 andy−2 were obtained in Q14, then their sum was computed/checked in Q15. Retrieval of these gated prior results is allowed; full x-factorization remains the current choice. | NOT-AFFECTED for this root |

## Separate cause / scope still open
- Q12 two equivalent wrong choices remain CONFIRMED under `mathematically_duplicate_distractors`; [W-MATH-026/P-001](../W-MATH-026-n06-q12-distinct-distractor/PROPOSAL.md) is APPROVED and deferred after Q06 Gate①. They are not changed by P-003 or accepted merely because the Q12 hint passed.
- This focused static pass is not a new all-modes / all-keys acceptance. Authentic Q03 320/390/1440 verification SUCCESS (run39894543039, job120221810195, source7bad9d800d143dcc99f52fecb96b867914ca09d7, imaged889a22957362c50ef0cf88c3d023cf2e9b844c7); full-regression result and human Gate① remain separate. Related other-unit/shared-surface gates remain OPEN/UNVERIFIED until their required evidence; N14 Q16 separate branch is not reconciled.
- No new learner defect beyond the already queued Q06 and Q12 distractor was identified in this N06 root pass. No other learner strings or source files were edited.

## Sibling screening while primary CI ran — partial, not closure
Current source 7bad9d800d143dcc99f52fecb96b867914ca09d7, read-only hashes:
- N04 n04Lesson e7fad886acb80af3953ae06842b63dfb291506fb: older reading-flow structure / supplemental questions require their own context extraction; UNVERIFIED, never infer absence from a missing q-array pattern.
- N05 251c32cf3053a7a00c366b102a13eac750d952ab: accepted Q11/Q18 sign/counterexample hints retained. Q15's cross-sum7x is already obtained at Q14, so NOT-AFFECTED for unseen-result pre-exposure. Q06's supplied numerical square roots need a separate original-source/required-act boundary check (UNVERIFIED candidate, not an approved edit).
- N07 537a3ed8443f798fa905e72e0c544d22dfc4dfdd: Q03 repeats digits obtained at Q02, so not a new result. Existing Q13 sign/integer guidance remains distinct from giving the entire numeric answer. Q09's explicit multiplier100 in its hint needs focused reconciliation with the already repaired multiplier decision (UNVERIFIED candidate).
- N08 3d687f890c845c5bef3b2cbe5cfc226c7e4b5488: Q05's supplied squared values5/9 need original-source/required-act reconciliation (UNVERIFIED candidate). Q07/Q09 leave sign reversal/bracket removal to the student; not a completed transformed answer in the hint.
- These candidates are recorded for diagnosis; no additional confirmed correction, full proposal or implementation approval is inferred. Q03 review is not blocked by inventing a broader rewrite, while Gate② cannot close over these UNVERIFIED cells. Continue the already-approved Q06/Q12 sequence after each required visual gate, and investigate remaining cells before overall closure.

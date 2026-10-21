# Gate② original-source independent algebra: first reproducible checkpoint (2026-10-20)

Status: **PARTIAL PASS for 48 independently computed mathematical equalities/inequalities; NOT 123-question independent verification**
Audited app-code SHA: `2604589da22062cb67928ee5e1569a5de0338845` (app source files read on exact SHA, not the older inventory)
Original Word bytes: 212863; SHA-256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`
Method: Python/SymPy independent symbolic expand/simplify, polynomial identity, rational arithmetic, factorization inventory and solve_univariate_inequality/solveset over real numbers, not source code's hard-coded answer keys. The docx was extracted from the authoritative handoff ZIP and converted by Pandoc for the source questions. This is an **offline internal audit**, not GitHub CI execution; do not attribute these checks to Actions.

## Completed 48 independent computations

| Unit | independent computational checks PASS | check specification |
| --- | ---: | --- |
| N04 | 12 | Q01/Q03: (5x+4y)^2; Q04/Q05: (a+b)^2; Q06/Q07: (a−b)^2; Q08: (a+b)(a−b); Q10a: (2a−5)^2; Q10b: (3x−2)(3x+2); Q11/Q12: (ax+b)(cx+d); Q13: (3x+1)(x+2); Q14/Q15: (a+b+c)^2; Q16: (a+b−c)^2; Q17/Q19: (x²+x+1)(x²−x+1); Q20/Q22: four consecutive linear factors |
| N05 | 11 | Q02/Q03: (x−3)(y+5); Q05: common factor reversal; Q06/Q08: (4x+3y)^2; Q09: (a+r)(a+s); Q11: (a−8)(a+2); Q12/Q13: general (rx+s)(ax+b); Q14-A: (2x+1)(2x+3); Q14-B: (x+1)(4x+3); Q14-C: (x+3)(4x+1); Q18: (x−1)(5x+3); Q20: 3b(a−2b)(a+2b) |
| N06 | 4 | Q01/Q04: substitution and quadratic factorization; Q05/Q07: x⁴−5x²+4; Q08/Q12: (x+y)(x+2)(x−1); Q13/Q16: (x+2y+1)(x+y−2) |
| N07 | 5 | Q01: 3/4=0.75; Q02/Q03: 23/11=2.(09); Q06/Q08: 8/9; Q09/Q10: 69/99=23/33; Q11/Q12: exactly denominators 2,4,5,8,10,16,20 between 2 and 20 |
| N08 | 4 | Q05: 5<9 and sqrt(5)<3; Q07: |sqrt(5)−3|=3−sqrt(5); Q09: |3−π|=π−3; Q12: |a|²=a² for real a |
| N11 | 4 | Q05/Q06: 3x−2<5 ⇔ x<7/3; Q08/Q09: −2x+3≤5 ⇔ x≥−1; Q11/Q12: 3(2x+3)≥10x−17 ⇔ x≤13/2; Q13/Q14: (x−2)/3≤2x+1 ⇔ x≥−1 |
| N13 | 3 | Q02−04: |x−1|=4 gives −3,5; Q06−07: |x+2|=3 gives −5,1; Q08: |3x|=6 gives −2,2 |
| N14 | 5 | Q01−04: |x|<3 ⇔ −3<x<3; Q05−06: |x|≥4 ⇔ x≤−4 or x≥4; Q09−10: |x−3|<5 ⇔ −2<x<8; Q11−12: |x+3|≥2 ⇔ x≤−5 or x≥−1; Q13−16: |3x−2|≤4 ⇔ −2/3≤x≤2 |

**Count:** 12 + 11 + 4 + 5 + 4 + 4 + 3 + 5 = **48 PASS**.

These checks explicitly cover multiple adjacent original Qs in some rows; therefore 48 PASS is **not** 48 individually audited question-and-all-distractor certifications. The original separate publisher answer booklet is not available. The current app text contains human-written options, and some wrong alternatives are intentionally mathematically equal to an intermediate polynomial yet **do not fulfill the specified operation** (e.g. grouping to equal x coefficients). Accordingly, automated equivalence of final expressions cannot determine each distractor's educational wrongness.

## Gate② independent source-cognitive mismatch scan

The following **11 additional** independently confirmed items are **outside** the approved P-004 eight and P-004-R1 two; each relates to source-requested operations provided in pre-answer prose (root-cause B). Source and actual leads/keys compared on audited SHA. Full exact correction scope: `P-004-R2_PREANSWER_COGNITIVE_REPAIR_PROPOSAL.md`.

| Unit | confirmed new IDs | classification |
| --- | --- | --- |
| N06 | Q01, Q05 | source requests choice of substitution, but lead gives substitution |
| N07 | Q09 | source requests smallest multiplier, but lead states two-position shift |
| N08 | Q02 | source asks expression for nonnegative a's distance, but lead gives answer as prose |
| N11 | Q06, Q08, Q09, Q13 | source asks operation (and in Q06/Q09/Q13 direction or result); lead supplies operation; current correct choice sometimes only the resulting inequality |
| N14 | Q10, Q14, Q15 | source asks what transformation to perform; lead preselects +3, +2, ÷3 respectively |

**RISK (not confirmed without further cognitive judgment):** N08-Q03 is heavily scaffolded with subtraction order in its lead, but still requires simplification of the minus sign. Distinguish an intentionally taught distance rule from disclosing the entire decision before promoting to CONFIRMED. N14-Q07/Q08 remain intentional general-law scaffolds according to prior P-004 impact ledger and are **not** reclassified without evidence.

## Gate status and scope

- User reported having completed the revised ten-item visual check in this conversation, but no explicit `細部OK` phrase was supplied; preserve that wording in log rather than inventing a formal PASS.
- Prior P-004/P-004-R1 correction CI PASS and 60 real screenshots remain valid **for their tested code SHA only**.
- For Gate② **still UNVERIFIED**: 123 original question-by-question independent complete reasoning, **all 3 wrong options** for each of 127 app decisions, pre-answer/no-hint disclosure across untouched items, review progress isolation at the eventual fixed candidate, and no outstanding cognitive mismatch.
- This document creates no permission to edit. P-004-R2 = **PROPOSED / NOT APPROVED**; Gate② NOT CROSS-VERIFIED, Gate③ FINAL-REVIEW-NOT-READY.

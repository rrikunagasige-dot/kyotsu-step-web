# W-MATH-004 — 他の承認済み「作成」成果物への影響台帳
Status: PRELIMINARY SCREENING — full no-defect PASS has NOT been claimed
Date: 2026-10-18 JST
Origin: F-001/F-002; signature R1 multi-operation hidden, R2 cause/meaning bridge absent.

| Created artifact / version | Approval/condition | Evidence screened | Result | Next |
| --- | --- | --- | --- | --- |
| N01 main review-only `n01Lesson.ts` | W-MATH-003 P-001 accepted/pilot release | Q09a coefficient expression → Q09b simplification and Q10b “why degree” explicitly separated | UNVERIFIED for full-unit QA, no confirmed same defect | Full cognitive-transition pass before close; leave unchanged |
| N02 main review-only `n02Lesson.ts` | W-MATH-003 P-002 release | Q07 minus sign → Q08 addition; Q09 2A/-3B transfer groups arithmetic after previous model | UNVERIFIED, candidate legitimate fade | Audit whether Q09 makes an unjustified jump; no edit without linked proposal |
| N03 main review-only `n03Lesson.ts` | W-MATH-003 accepted learner copy | Q09 distribution → Q10 4 products → Q11 combination; Q13 final transfer uses earlier chain | UNVERIFIED for full-unit QA, no confirmed same defect | Verify last transfer meaning/feedback, leave code |
| N09 main review-only `n09Lesson.ts` | W-MATH-003 P-002 release | Q12 roots between integers → Q13 negative-sign reversal → Q14 two integer/fractional parts | UNVERIFIED for full-unit QA, no confirmed same defect | Check Q13 negative multiply reason and late feedback |
| N10 main review-only `n10Lesson.ts` | W-MATH-003 approved learner copy | Q17 conjugate choice → Q18 denominator → Q19 numerator → Q20/21 transfer | UNVERIFIED for full-unit QA, no confirmed same defect | Verify no leakage/line gaps, leave code |
| **N12 main review-only `n12Lesson.ts`** | W-MATH-003 approved learner copy | Q01,Q02,Q06,Q12,Q13 compressed | **CONFIRMED affected** | P-001 exact correction approval then verify |
| N11 draft `PR #73 P-003` | NOT APPROVED / NOT IMPLEMENTED | 14 source markers designed | OUTSIDE approved-creation sweep; design risk | Pass required checks into revised P-003 only after corrections |
| N13 draft `PR #73 P-003` | NOT APPROVED / NOT IMPLEMENTED | 9 source markers designed | OUTSIDE approved-creation sweep; design risk | Same |
| N14 draft `PR #73 P-003` | NOT APPROVED / NOT IMPLEMENTED | 16 source markers designed | OUTSIDE approved-creation sweep; design risk | Same |

No scope expansion to unrelated Mathematics Practice, Physics, or published Math sets is authorized. If screening shows R1/R2 is a shared authoring/presentation cause on such surfaces, add them with specific evidence and linked approval, rather than marking them universally PASS/FAIL. Use visited keys (signature, source unit, revision) to avoid rechecking identical items indefinitely.

**On correction completion**: perform second pass; upgrade each UNVERIFIED to CONFIRMED or NOT-AFFECTED with the cited source stage and regression evidence; enqueue separately approved linked repairs; merge lessons only once; then check correction queue and paused creation P-003.
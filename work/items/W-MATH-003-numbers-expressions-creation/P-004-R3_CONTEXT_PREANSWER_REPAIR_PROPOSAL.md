# W-MATH-003 / P-004-R3 — P-004-R2 residual cross-question advance-answer leaks

Status: **PROPOSED / NOT APPROVED / NOT IMPLEMENTED**
Date: 2026-10-20 JST
Command: CMD-WORK-001「修正」; separate scope from user-approved P-004 (8), P-004-R1 (2) and P-004-R2 (11).
Source of findings: read actual `makeReviewSteps` ordering and P-004-R2 source questions and cross-checked exact app review code on 2026-10-20. Source Word SHA-256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`.

## Reason R2 alone does not finish the requested source-cognitive repair

The 11 exact P-004-R2 answer leads/options were changed in approved scope. The reading renderer also displays **earlier non-choice paragraphs** from the *same or previous question*, before the learner chooses the new answer. Those were explicitly excluded from the narrowly approved `lead/answer/wrong/prompt` modification scope. Therefore removing preanswers in the affected `lead` alone does not fully close the defect.

| ID whose answer is spoiled | Specific earlier source in real readingFlow | Verified disclosure | Proposed exact smallest change |
| --- | --- | --- | --- |
| N06-Q05 | Second group's `intro` in `src/data/textbook/math/numbers/n06Lesson.ts`, shown before Q05 lead | `四次式でもx²が繰り返し使われていれば、そこをTと置くと次数が下がる。` tells `T=x²` which the learner must select | Replace group intro with `四次式でも、繰り返し現れる式のまとまりを見つければ、二次式として扱える場合がある。` |
| N14-Q10 | Q09 `after` in `src/data/textbook/math/numbers/n14Lesson.ts` shown after Q09 and before Q10 | `次は三辺に同じ3を足して、中央をxにする。` gives exactly the upcoming addition | Replace only that after text with `次は三辺に同じ操作をして、中央をxだけにする。` |
| N14-Q15 | Q14 `after` in `src/data/textbook/math/numbers/n14Lesson.ts` shown after Q14 and before Q15 | `正の3で三辺を割っても不等号の向きは変わらない。` gives upcoming divisor and inequality direction | Replace only that after text with `三辺に同じ変形を行い、中央のxの係数を1にする段階へ進もう。` |

These are independently confirmed cognitive-answer leaks, not mathematical false-key findings. Preserve intact all still-correct first-result operations and legitimate preceding concept instruction.

## Exact modification boundary after explicit approval

Only **3 strings** at the three specified earlier prose locations, preserving their IDs, block position, questions, formulas, correct answers, all three distractors, revision numbers, item count, question IDs, figure bytes, progress migrations and all other code. No general prose rewriting; no source Word changes; no math/physics practice or earlier accepted units. This proposal **does not approve itself**.

## Verification after any exact approval

1. Static readingFlow order test: preceding relevant intro/after paragraphs do not expose the next question's chosen substitute, integer addition or division; next question's answer still includes the chosen operation.
2. Original source Q05/Q10/Q15 meaning intact, previous question's after text retains a natural bridge, and algebra/distractors unchanged.
3. Full existing Math textbook CI, 123/127 source mapping, 9 original figure hashes, regression and 320/390px screenshots for those 3; user Gate① detailed visual confirmation. Do not merge/deploy.
4. Continue ongoing Gate② independent proof of all 123 original answers and every wrong option; until complete Gate② stays NOT CROSS-VERIFIED.

## Explicit stop

P-004-R2 was approved on 2026-10-20 and must not be implicitly expanded by this proposal. **Wait for explicit approval of P-004-R3 before touching the three surrounding prose strings.** Previous approved corrective code and its QA may continue in the meantime.

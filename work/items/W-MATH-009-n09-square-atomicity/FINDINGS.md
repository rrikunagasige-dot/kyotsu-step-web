# Findings — W-MATH-009

## F-001
Date: 2026-10-18
Type: CONFIRMED
Statement: N09-Q08 has one entire numeric inequality choice despite two independently computable squares and two separately decidable comparison signs.
Evidence: main `src/data/textbook/math/numbers/n09Lesson.ts` lines 115–124 and 190–194.
Impact: Learner can recognize the finished row without doing each arithmetic step.
Corrective rule / next action: Propose four local holes and preserve the original synthesis; require user approval first.
Promote to Decision: NO
Promote to Lesson: NO

## F-002
Date: 2026-10-18
Type: RESOLVED-ON-BRANCH
Statement: Four independent graded steps precede original n09-08. Sign choices contain no true distractors; result values appear after their own calculation step. Old v1 ledger archived, current Q01 restarted; final comparison displayed as three small math rows.
Evidence: N09 implementation, n09Atomicity.test.ts, Playwright test (CI pending).

# W-MATH-025/P-014 — N07 Q11 hint-only correction
Status: PROPOSED
Command: CMD-WORK-001 修正
Created: 2026-10-23 JST

## Problem and independent evidence
10^kを素因数の積で表す原問で、hintが必要な素因数2と5を直接示す。前問Q10の69/99の約分やQ09の倍率100とは別の判断であり、現在の原問の素因数分解は未解答。
Teacher Word SHA25693827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa body paragraph310. Native runtime export39908283290/job120265153221 loaded real Vite/Zod modules. Frozen learner source fc27e7f5fbdc28345917276d43602ea4787537bd;execution3cea41ef729ec21a6e0b6233346b677b0feffab5. Source file `src/data/textbook/math/numbers/n07Lesson.ts`,blob `b461265d233f47acba4cf7394661d23d5608d219`;actual target `n07-11`.

## Exact proposed hint
旧: `10=2×5なので、その積をk回掛ける。`
新: `10を素数の積に分け、同じ積をk回掛けた形を考えよう。それぞれの素数が何回ずつ掛かるかを数え、指数で表そう。`

## Scope and protected content
Only this hint string in `src/data/textbook/math/numbers/n07Lesson.ts`. N07 revision3,original14 questions,stable item IDs,grading key `2^k\cdot5^k`,all authored and actual visible choices,reading-flow math/paragraphs,figures,progress/migration semantics remain unchanged. Do not raise revision or reset saved attempts for a hint-only edit. All previous five accepted fixes and Q16 reconciliation remain intact. No blanket rewording,no other learner changes,no main merge/hosting/deployment.

## Block preflight and mathematical check
MASTER §§19/20/51–54 and WORK_SYSTEM §12A/B/C. Learn by deciding/calculating the current quantity;general methods and previously resolved values are allowed,explicit current output is not the hint. k≥1、10^k=(2×5)^k=2^k×5^k。指数法則は既習として使うが、具体的な素因数は自分で選ぶ。

## Verification plan after approval
Exact one-hint diff per target and unchanged other fields/source blobs. Ordinary/review320/390/1440 wrong→hint→retry and gated next step;completed/reload and prior firstValue/attemptCount/time preserve history. Actual getTextbookChoices controls visible option count (scaffold may yield2/3/4);do not falsely assert four everywhere. Existing math/review/shared-mode regression and scoped source/math audit. Group all approved items' genuine images for one user Gate① response;no per-item approval pauses. Gate②/③ remain distinct.

## Approval
Approved by user: NO
Status: PROPOSED
The prior「進めてくれ」authorized audit continuation,not these newly specified hints. No learner code has changed. Present this exact batch before implementation.

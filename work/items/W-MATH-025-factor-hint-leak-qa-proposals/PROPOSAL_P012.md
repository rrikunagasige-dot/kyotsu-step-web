# W-MATH-025/P-012 — N12 Q12 hint-only correction
Status: PROPOSED
Command: CMD-WORK-001 修正
Created: 2026-10-23 JST

## Problem and independent evidence
130(20−x)の符号付き係数を求める欄で、hintが−130xを示し、必要な係数−130を先出しする。直前の2600は定数項であり、この符号付き係数を求めた結果ではない。
Teacher Word SHA25693827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa body paragraph530. Native runtime export39908283290/job120265153221 loaded real Vite/Zod modules. Frozen learner source fc27e7f5fbdc28345917276d43602ea4787537bd;execution3cea41ef729ec21a6e0b6233346b677b0feffab5. Source file `src/data/textbook/math/numbers/n12Lesson.ts`,blob `b53fd3d1673b8475de666dae2c9e5158a939fd3d`;actual target `n12-p002-q12-signed-coef`.

## Exact proposed hint
旧: `130×(−x)=−130x。符号も答えに含める。`
新: `括弧の外の正の数を、括弧内の負の項にも掛けよう。係数の大きさと符号を別々に確かめ、文字xを除いた数を選ぼう。`

## Scope and protected content
Only this hint string in `src/data/textbook/math/numbers/n12Lesson.ts`. N12 revision3,original15 questions,stable item IDs,grading key `-130`,all authored and actual visible choices,reading-flow math/paragraphs,figures,progress/migration semantics remain unchanged. Do not raise revision or reset saved attempts for a hint-only edit. All previous five accepted fixes and Q16 reconciliation remain intact. No blanket rewording,no other learner changes,no main merge/hosting/deployment.

## Block preflight and mathematical check
MASTER §§19/20/51–54 and WORK_SYSTEM §12A/B/C. Learn by deciding/calculating the current quantity;general methods and previously resolved values are allowed,explicit current output is not the hint. 130(20−x)=2600−130x。符号付き係数は−130。後の2650/50/550/650/11≤x<13と金額計算は変更しない。

## Verification plan after approval
Exact one-hint diff per target and unchanged other fields/source blobs. Ordinary/review320/390/1440 wrong→hint→retry and gated next step;completed/reload and prior firstValue/attemptCount/time preserve history. Actual getTextbookChoices controls visible option count (scaffold may yield2/3/4);do not falsely assert four everywhere. Existing math/review/shared-mode regression and scoped source/math audit. Group all approved items' genuine images for one user Gate① response;no per-item approval pauses. Gate②/③ remain distinct.

## Approval
Approved by user: NO
Status: PROPOSED
The prior「進めてくれ」authorized audit continuation,not these newly specified hints. No learner code has changed. Present this exact batch before implementation.

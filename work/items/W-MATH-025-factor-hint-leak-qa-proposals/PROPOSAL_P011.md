# W-MATH-025/P-011 — N12 Q06 hint-only correction
Status: PROPOSED
Command: CMD-WORK-001 修正
Created: 2026-10-23 JST

## Problem and independent evidence
3x−2xの係数を入れる欄に、hintが採点値1を直接出す。前問Q05は二つの不等式への分割で、この係数計算は未解答。正答後の1x=xという本文説明は保持する。
Teacher Word SHA25693827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa body paragraph515. Native runtime export39908283290/job120265153221 loaded real Vite/Zod modules. Frozen learner source fc27e7f5fbdc28345917276d43602ea4787537bd;execution3cea41ef729ec21a6e0b6233346b677b0feffab5. Source file `src/data/textbook/math/numbers/n12Lesson.ts`,blob `b53fd3d1673b8475de666dae2c9e5158a939fd3d`;actual target `n12-p002-q06-left-coef`.

## Exact proposed hint
旧: `3−2=1。1xはxと同じ。`
新: `両辺から同じ文字の項を引くと、係数どうしの引き算になる。文字xを残したまま、係数だけを計算しよう。`

## Scope and protected content
Only this hint string in `src/data/textbook/math/numbers/n12Lesson.ts`. N12 revision3,original15 questions,stable item IDs,grading key `1`,all authored and actual visible choices,reading-flow math/paragraphs,figures,progress/migration semantics remain unchanged. Do not raise revision or reset saved attempts for a hint-only edit. All previous five accepted fixes and Q16 reconciliation remain intact. No blanket rewording,no other learner changes,no main merge/hosting/deployment.

## Block preflight and mathematical check
MASTER §§19/20/51–54 and WORK_SYSTEM §12A/B/C. Learn by deciding/calculating the current quantity;general methods and previously resolved values are allowed,explicit current output is not the hint. 3x−2x=(3−2)x=x。係数1を採点し、通常の式で1xをxと書く既承認設計は保持する。

## Verification plan after approval
Exact one-hint diff per target and unchanged other fields/source blobs. Ordinary/review320/390/1440 wrong→hint→retry and gated next step;completed/reload and prior firstValue/attemptCount/time preserve history. Actual getTextbookChoices controls visible option count (scaffold may yield2/3/4);do not falsely assert four everywhere. Existing math/review/shared-mode regression and scoped source/math audit. Group all approved items' genuine images for one user Gate① response;no per-item approval pauses. Gate②/③ remain distinct.

## Approval
Approved by user: NO
Status: PROPOSED
The prior「進めてくれ」authorized audit continuation,not these newly specified hints. No learner code has changed. Present this exact batch before implementation.

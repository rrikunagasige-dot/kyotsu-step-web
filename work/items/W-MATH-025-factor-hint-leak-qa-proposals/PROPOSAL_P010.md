# W-MATH-025/P-010 — N10 Q08 hint-only correction
Status: PROPOSED
Command: CMD-WORK-001 修正
Created: 2026-10-23 JST

## Problem and independent evidence
前問で16×3は求めるが、根号の外へ出す係数4はこの問の判断。hintが係数を直接答える。N09で√16=4を扱う既習事項と、現在のN10の解答欄へ具体的な係数を教えることを区別する。N10にはN09の保存済み正答を要求するゲートはない。
Teacher Word SHA25693827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa body paragraph420. Native runtime export39908283290/job120265153221 loaded real Vite/Zod modules. Frozen learner source fc27e7f5fbdc28345917276d43602ea4787537bd;execution3cea41ef729ec21a6e0b6233346b677b0feffab5. Source file `src/data/textbook/math/numbers/n10Lesson.ts`,blob `e7498844e3fa7dcc4f7862e5ad6b25abb92cae67`;actual target `n10-08`.

## Exact proposed hint
旧: `16の正の平方根は4になる。`
新: `前の式で見つけた平方数が、何を二乗した数か確かめよう。その平方根を根号の外へ出し、残りの因子は根号の中に残そう。`

## Scope and protected content
Only this hint string in `src/data/textbook/math/numbers/n10Lesson.ts`. N10 revision1,original21 questions,stable item IDs,grading key `4\sqrt3`,all authored and actual visible choices,reading-flow math/paragraphs,figures,progress/migration semantics remain unchanged. Do not raise revision or reset saved attempts for a hint-only edit. All previous five accepted fixes and Q16 reconciliation remain intact. No blanket rewording,no other learner changes,no main merge/hosting/deployment.

## Block preflight and mathematical check
MASTER §§19/20/51–54 and WORK_SYSTEM §12A/B/C. Learn by deciding/calculating the current quantity;general methods and previously resolved values are allowed,explicit current output is not the hint. 4²=16、(4√3)²=48、4√3>0なので√48=4√3。Q07で得る因子16は保持し、正の平方根は生徒が求める。

## Verification plan after approval
Exact one-hint diff per target and unchanged other fields/source blobs. Ordinary/review320/390/1440 wrong→hint→retry and gated next step;completed/reload and prior firstValue/attemptCount/time preserve history. Actual getTextbookChoices controls visible option count (scaffold may yield2/3/4);do not falsely assert four everywhere. Existing math/review/shared-mode regression and scoped source/math audit. Group all approved items' genuine images for one user Gate① response;no per-item approval pauses. Gate②/③ remain distinct.

## Approval
Approved by user: NO
Status: PROPOSED
The prior「進めてくれ」authorized audit continuation,not these newly specified hints. No learner code has changed. Present this exact batch before implementation.

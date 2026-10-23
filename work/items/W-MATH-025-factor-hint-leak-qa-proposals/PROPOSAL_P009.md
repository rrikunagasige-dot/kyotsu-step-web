# W-MATH-025/P-009 — N10 Q07 hint-only correction
Status: PROPOSED
Command: CMD-WORK-001 修正
Created: 2026-10-23 JST

## Problem and independent evidence
√6√8を根号一つにし、平方因子を探す問で、まだ求めていない平方因子16をhintが指定する。前問Q06は一般の平方根の商の証明で、48の分解はしていない。
Teacher Word SHA25693827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa body paragraph419. Native runtime export39908283290/job120265153221 loaded real Vite/Zod modules. Frozen learner source fc27e7f5fbdc28345917276d43602ea4787537bd;execution3cea41ef729ec21a6e0b6233346b677b0feffab5. Source file `src/data/textbook/math/numbers/n10Lesson.ts`,blob `e7498844e3fa7dcc4f7862e5ad6b25abb92cae67`;actual target `n10-07`.

## Exact proposed hint
旧: `平方数である16を因子として取り出す。`
新: `まず根号の中の数どうしを掛けよう。得られた数を、できるだけ大きい平方数と残りの因子の積に分けよう。`

## Scope and protected content
Only this hint string in `src/data/textbook/math/numbers/n10Lesson.ts`. N10 revision1,original21 questions,stable item IDs,grading key `\sqrt{48}=\sqrt{16\cdot3}`,all authored and actual visible choices,reading-flow math/paragraphs,figures,progress/migration semantics remain unchanged. Do not raise revision or reset saved attempts for a hint-only edit. All previous five accepted fixes and Q16 reconciliation remain intact. No blanket rewording,no other learner changes,no main merge/hosting/deployment.

## Block preflight and mathematical check
MASTER §§19/20/51–54 and WORK_SYSTEM §12A/B/C. Learn by deciding/calculating the current quantity;general methods and previously resolved values are allowed,explicit current output is not the hint. 6×8=48。48の1より大きい平方因子は4,16、最大は16で48=16×3。OMML radicalにより原Word418は√6√8であり68ではない。

## Verification plan after approval
Exact one-hint diff per target and unchanged other fields/source blobs. Ordinary/review320/390/1440 wrong→hint→retry and gated next step;completed/reload and prior firstValue/attemptCount/time preserve history. Actual getTextbookChoices controls visible option count (scaffold may yield2/3/4);do not falsely assert four everywhere. Existing math/review/shared-mode regression and scoped source/math audit. Group all approved items' genuine images for one user Gate① response;no per-item approval pauses. Gate②/③ remain distinct.

## Approval
Approved by user: NO
Status: PROPOSED
The prior「進めてくれ」authorized audit continuation,not these newly specified hints. No learner code has changed. Present this exact batch before implementation.

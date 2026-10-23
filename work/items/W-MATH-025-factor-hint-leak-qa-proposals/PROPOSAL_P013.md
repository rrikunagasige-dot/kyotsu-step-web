# W-MATH-025/P-013 — N04 Q22 hint-only correction
Status: PROPOSED
Command: CMD-WORK-001 修正
Created: 2026-10-23 JST

## Problem and independent evidence
Tを戻した平方の展開を生徒が行う段階で、hintがT²の三項を計算済みで示す。直前Q21のT²+10T+24はTの式であり、xの三次項10x³や25x²を求めた結果ではない。同じ数字10が既出でも、別の計算結果の先出しを正当化しない。
Teacher Word SHA25693827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa body paragraph188. Native runtime export39908283290/job120265153221 loaded real Vite/Zod modules. Frozen learner source fc27e7f5fbdc28345917276d43602ea4787537bd;execution3cea41ef729ec21a6e0b6233346b677b0feffab5. Source file `src/data/textbook/math/numbers/n04BatchSupplement.ts`,blob `d8cc8e96b7bcadba87969e16a5b9f71ad95659fc`;actual target `n04-22`.

## Exact proposed hint
旧: `T²ではx⁴、10x³、25x²が出る。さらに10Tを足す。`
新: `二乗の公式でT²を展開し、それから一次のTの項も元の式へ戻そう。同じ次数の項を集め、各係数を自分で計算しよう。`

## Scope and protected content
Only this hint string in `src/data/textbook/math/numbers/n04BatchSupplement.ts`. N04 revision2,original22 questions,stable item IDs,grading key `x^4+10x^3+35x^2+50x+24`,all authored and actual visible choices,reading-flow math/paragraphs,figures,progress/migration semantics remain unchanged. Do not raise revision or reset saved attempts for a hint-only edit. All previous five accepted fixes and Q16 reconciliation remain intact. No blanket rewording,no other learner changes,no main merge/hosting/deployment.

## Block preflight and mathematical check
MASTER §§19/20/51–54 and WORK_SYSTEM §12A/B/C. Learn by deciding/calculating the current quantity;general methods and previously resolved values are allowed,explicit current output is not the hint. (x²+5x)²=x⁴+10x³+25x²、10(x²+5x)=10x²+50x。和はx⁴+10x³+35x²+50x+24。

## Verification plan after approval
Exact one-hint diff per target and unchanged other fields/source blobs. Ordinary/review320/390/1440 wrong→hint→retry and gated next step;completed/reload and prior firstValue/attemptCount/time preserve history. Actual getTextbookChoices controls visible option count (scaffold may yield2/3/4);do not falsely assert four everywhere. Existing math/review/shared-mode regression and scoped source/math audit. Group all approved items' genuine images for one user Gate① response;no per-item approval pauses. Gate②/③ remain distinct.

## Approval
Approved by user: NO
Status: PROPOSED
The prior「進めてくれ」authorized audit continuation,not these newly specified hints. No learner code has changed. Present this exact batch before implementation.

## 2026-10-23 — current seven-hint implementation and native evidence

Latest source `22ccf559a70d758689b958c77d19f4c9cdd43b7e`,image child `97ed3d8e4a03ec4a6af8cc96987f79f5ba31aa3b`,Draft PR121. P008–P014 APPROVED by user「まとめて修正してくれ」and implemented exactly. Review39911476014 SUCCESS:48unit,42realbrowser/42explicitmatrixskips;Governance39911475938 SUCCESS. Math39911475985 SUCCESS:250unit/257browser/12explicit skips. [Current exact results/history/limits](./SEVEN_HINTS_EXECUTION_20261023.md),[all seven actual images](./GATE1_SEVEN_ITEM_REVIEW_20261023.md). No repeated implementation approval. New seven visual Gate① remains BLOCK-CHECK-PENDING;prior five accepted unchanged. Work VERIFYING;whole-chapterGate② OPEN;Gate③ FINAL-REVIEW-NOT-READY. Main unchanged;no merge/deploy. Older pending/proposed/test-failure status paragraphs below are retained history,not current outcome.


## 2026-10-23 — seven exact hints approved and implementation started
User direct response **「まとめて修正してくれ」** followed the seven exact proposed new hints/P008–P014 and the explicit grouped approval question. This approves precisely those seven hint strings;no repeated approval is required. Record parentd95dd283d204095bf58ece70faef9544abe1d42d/source runtimefc27e7f5fbdc28345917276d43602ea4787537bd;live main15ae503455bc6ae75b080caa1c4919cafb250027 unchanged;account/repo1391122224 verified.
Seven replacements in four files only. Keep keys,authored/visible choices,original208 markers/290 graded decisions,unit revisions,flow/math,text/figures,schema,renderer and progress semantics. Prior five accepted blocks and N13/Q16 migrations remain intact. Verification adds exact real review sections,seven boundary cases,and real normal/review Chromium320/390/1440 cases. N10Q08 includes its actual Q07 prerequisite in preview;N12 uses actual sub-item indices;N04Q22 correctly handles final-unit completion. Uses getTextbookChoices actual2/3/4 choices. Source CI and authentic images **PENDING** until actual native results. Evidence archived on a separate branch so source CI is not cancelled by image commits.
[P008–P014 approved batch](./BATCH_HINT_PROPOSALS_P008_P014.md). New seven human Gate① is pending after engineering QA;prior five remain accepted. Gate② OPEN;Gate③ FINAL-REVIEW-NOT-READY;no main merge/deploy or NE01/NE02 creation.

# W-MATH-025/P-013 — N04 Q22 hint-only correction
Status: APPROVED
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
Approved by user: YES
Status: APPROVED
User「まとめて修正してくれ」directly authorizes this exact hint and the other six listed proposals. Limited implementation and actual QA proceed together;visual acceptance is a separate pending step.

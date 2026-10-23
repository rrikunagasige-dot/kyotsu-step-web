# W-MATH-026 — N06 Q12 数学的重複誤答の限定修正
Status: VERIFYING
Updated: 2026-10-23 JST

## Objective / Approved Proposal
既承認P-001（直接「いいよ続けて」）のwrong[2]1選択肢だけを修正。P-001全文・exact承認を保持、再承認を求めない。
Q06は直接「承認！続けて…」でhint-only画像受入。ユーザーの最新指示により約5問を完成・技術確認して一度に提示し、1問ごとの人手待ちを繰り返さない。問別内部preflightと証拠は保持。

## Branch / Provenance
canonical `rrikunagasige-dot/kyotsu-step-web` (ID1391122224)、main `15ae503455bc6ae75b080caa1c4919cafb250027`。
起点PR115 HEAD44e42bf42d065057d54785d6bbe578ef9b4cbb5b。
独立した順次枝 `work/W-MATH-026-n06-q12-distinct-distractor-20261023`、Draft PR116、baseはW025枝。
修復source `d894e38820829c387386d207ff2d44d1ac95eebb`、原画像24枚だけの子 `113298ed523af9f3523aaa1f87469fc3aa737528`。
初回fe9a7301dbcd4d4c386418c9937c4da5effd537bの検証コード/状態名による失敗をACTION_LOG/VERIFICATIONに保持。

## Scope / Do Not Touch
q12wrong[2] `(x+y)(x+1)(x-2)` → `(x+y)(x+2)(x+1)` のみ。
正答、他2誤答、受入済みhint、他15問、原16問、stable ID、revision3、全履歴、renderer/CSS/schema、母本と図を保持。
Q06受入マーカーを隠し、Q12choicesを別targetへ。旧Q12hintのaccepted状態/原画像も保持。
W025/P005–007はPROPOSED・未実装。N14Q16はPR111の別SHA/別rev候補、main統合/公開を行わない。

## Current Step
専用Review39900003982/Governance39900003884 SUCCESS。5files/38unit、6real browser cases PASS/6matrix skips。旧wrong保存の無改変復元/初回履歴保全/retry/全16完了/preview無保存を確認し、320/390/1440原画像24枚を固定。全体Math39900003882もSUCCESS、25unit files/240testsと254browser cases PASS/9explicit skips。型/lint/build・物理教科書・数学演習setup回帰まで完了。
独立18因数分解段階72choicesと限定101record50純積候補のroot監査を記録。Q07は値が同じでも要求された完成形に未達の有効な途中形誤答。新修正対象は無し。ただし必須他面のUNVERIFIEDをPASS扱いしない。

## Next Step
全体CI完了を記録済み。新3hint案の変更前後/範囲/検証をBATCH_HINT_PROPOSALS_P005_P007.mdとして一括提示し、その3文だけの承認待ち。承認済みQ12は単独Gate①回答を求めず次5件に保持。新3文を承認後に限定実装・まとめQAし、Q12と既存Q16を合わせ5件提示する。
残数はREMAINING_WORK_20261023.mdで区別。現修正3件＋5件groupの視覚確認、横断監査/候補整合/全体通し確認。章全体にはNE01/NE02の2単元25原問が現候補に未実装。

## Completion Condition / Gates
Q12choicesは人手視覚受入待ち、Gate②OPEN、Gate③FINAL-REVIEW-NOT-READY。専用PASS・全体CIだけでWork DONE/総チェックOKとしない。

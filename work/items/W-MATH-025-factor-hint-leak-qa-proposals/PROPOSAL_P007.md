# W-MATH-025/P-007 — N08 Q05の誤答ヒントで要求数値を先出ししない

## CURRENT — 2026-10-23 P005/P006/P007 direct batch approval
ユーザーはf73122d82b45e4c9ff4b04348383f121126a8322の「ヒント3件の変更案・変更前後」をリンクし、一括実行可否を尋ねた直後に **「いいよ」** と直接回答。P-005 N05Q06 / P-006 N07Q09 / P-007 N08Q05のexact3hint literalを **APPROVED** と記録。以前のQ06画像了承を流用したものではない。変更後文・各範囲/リスク/検証は不変。直前の「5問ずつ修正・検証・実画面をまとめ提示」指示も保持。
起点はDraft PR116 HEAD f73122d82b45e4c9ff4b04348383f121126a8322。独立した順次枝 `work/W-MATH-025-hints-p005-p007-batch-20261023` を使い、同ref実行中CIをcancelしない。3sourcefileに各1hintだけ、版/キー/選択肢/ID/履歴/図/schema/rendererは保持。Q12choicesとQ16を含む5件groupを完成後、一度に提示する。Q16は別PR111のrev10固定sourceであり、未承認の候補統合はしない。

Status: APPROVED
Created: 2026-10-23 JST
Command: CMD-WORK-001 修正

### Problem / Need
原Word【5】は√5と3の大小を二乗した数の比較を添えて答える問い。現行leadも『二乗した値を自分で求めて比較』とする。現ヒントが比較に使う計算結果5と9の両方を先に与え、その計算を生徒から取り去る。原Wordの√はOMML radicalとして確認し、5と3そのものを比べる誤読を避けた。
根本原因は `answer_preexposure_on_wrong_attempt` の「今回の原問で求める新しい数値・数値成分を誤答ヒントが明示する」条件。既に答えた前問の数値の再利用や、答えそのものを出さない一般手順の案内とは区別する。元P-003/P-004とは別問であり既存承認を流用しない。
教師Word SHA256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa` paragraph345【5】と直前問を照合。対象 `98ffc53ca390ef4769a4800a58cf3436f87b2057`、`src/data/textbook/math/numbers/n08Lesson.ts`、blob `3d687f890c845c5bef3b2cbe5cfc226c7e4b5488`。このファイルは既存の差分連鎖で保存元と完全一致。

### Proposed Solution — exact hint literal only
対象q:5 / `n08-05` のhint1文字列。
- 旧: `√5を二乗すると5、3を二乗すると9。二つとも非負なので大小の向きは保たれる。`
- 新: `根号の付いた数は、二乗すると根号の中の数に戻る。もう一方も二乗し、二つの値を比べよう。両方とも非負なので大小の向きは保たれる。`

### Scope / Expected Affected Areas
変更する学習内容はこの1文字列だけ。承認後、一問ずつ限定実装し、その問だけの真正な番号付き実画像・exact source SHAでGate①を確認する。必要な既存review境界/実画面検証を拡張。現在進行中Q06や既承認Q12選択肢を同じ承認で変更しない。

### Out of Scope / Do Not Touch
Q05の他フィールド、他11問、数直線図、Q06以降の符号判定と絶対値計算を保持。
正答 `5<9,\quad\sqrt5<3`、選択肢・stable ID・原12問・revision3、全保存履歴と既存移行処理を保持。共有renderer/CSS/schema/採点/選択肢生成、原Word、他単元・モード、main統合・公開・課金は変更しない。ヒントのみで採点意味が同じためrevisionを上げず、旧回答を消さない。

### Preflight / Mathematical Evidence / Risks
この小問の診断前にMASTER §§19/20/21/23/51–54、WORK_SYSTEM §12B/12Cと原問・前問・現hintを照合。(√5)²=5、3²=9、5<9、両方非負より√5<3。新案は具体的な計算結果5/9や完成した不等号を示さず、二乗と比較の手順を案内する。
直接的な数値の補助を減らすため、新hintが手順を十分に案内するか、特に320pxで読めるか実画像確認が必要。既存の正しい式や既受入設計をまとめて書換えない。

### Verification Plan
承認後は一hintのsource diff、既存正答・全誤答・ID/版の不変、未回答時の先出し無し、誤答→hint→再回答→正答でのみ次問が解放されることを確認する。通常学習と限定previewの320/390/1440px実画像、旧進捗/firstValue/attemptCount/初回正誤/完了の保存・reload、既存数学/他モードの関連回帰を検証。元の症状と同根影響表を再確認し、この問だけGate①、全体Gate②/③・統合/公開は別に判断する。

### Approval
Status: APPROVED
Approved by user: YES
Approval date: 2026-10-23 JST
Approval evidence: ユーザーは、f73122d82b45e4c9ff4b04348383f121126a8322の新3案一括全文/変更前後への明示質問に直接 **「いいよ」** と回答。本P-007を含むP005/P006/P007の変更後hint literal各1文だけを承認。以前のQ03/Q06の回答とは別事象。

### Review History
- Review status: APPROVED
- User feedback: 直接「いいよ」。一括提示されたexact3案を承認。
- Supersedes: None.
- Superseded by: None.
- 全文提案の明示承認前に学習内容を実装しない。現時点は診断と提案だけ。

### HISTORICAL — 2026-10-23 grouped presentation before direct approval
ユーザーは今後約5問をまとめて完成・提示するよう指示。本案のhint literal/範囲/リスク/検証内容は変更せず、[新3案一括の変更前後](../W-MATH-026-n06-q12-distinct-distractor/BATCH_HINT_PROPOSALS_P005_P007.md)で一度に提示。**Status: WAITING / Approved by user: NO / 未実装**。Q06画像了承やQ12既存承認を新3案へ流用しない。承認後の一括実装/まとめQAと5件group提示は最新直接指示の運用に従う。

### Current execution scope
P-007は承認済み限定実装へ進行。sourcen08Lesson.ts q05 hintだけを変更。実装sourceb1025cab41342b7648acb191abadfa8aaaa66e5c、固定画像8a3cfc05d173a92386f5bf8244fa28a1d31fabd1。Review39902362044/Gov39902362009と専用18realケースPASS。全体Math39902361997もSUCCESS（240unit、254browser PASS/9skips）。5件まとめの細部受入待ち。

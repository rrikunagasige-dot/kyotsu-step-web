# W-MATH-025/P-007 — N08 Q05の誤答ヒントで要求数値を先出ししない
Status: PROPOSED
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
Status: WAITING
Approved by user: NO
Approval date:
Approval evidence: なし。今回の「ヒントならいいよじゃ続けて」はQ03のhint用途の受入と既承認Q06への継続であり、この新しいP-007を許可していない。

### Review History
- Review status: NOT-REVIEWED
- User feedback: 未提示。
- Supersedes: None.
- Superseded by: None.
- 全文提案の明示承認前に学習内容を実装しない。現時点は診断と提案だけ。

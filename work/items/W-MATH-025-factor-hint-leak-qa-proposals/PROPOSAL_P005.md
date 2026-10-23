# W-MATH-025/P-005 — N05 Q06の誤答ヒントで要求数値を先出ししない

## CURRENT — 2026-10-23 P005/P006/P007 direct batch approval
ユーザーはf73122d82b45e4c9ff4b04348383f121126a8322の「ヒント3件の変更案・変更前後」をリンクし、一括実行可否を尋ねた直後に **「いいよ」** と直接回答。P-005 N05Q06 / P-006 N07Q09 / P-007 N08Q05のexact3hint literalを **APPROVED** と記録。以前のQ06画像了承を流用したものではない。変更後文・各範囲/リスク/検証は不変。直前の「5問ずつ修正・検証・実画面をまとめ提示」指示も保持。
起点はDraft PR116 HEAD f73122d82b45e4c9ff4b04348383f121126a8322。独立した順次枝 `work/W-MATH-025-hints-p005-p007-batch-20261023` を使い、同ref実行中CIをcancelしない。3sourcefileに各1hintだけ、版/キー/選択肢/ID/履歴/図/schema/rendererは保持。Q12choicesとQ16を含む5件groupを完成後、一度に提示する。Q16は別PR111のrev10固定sourceであり、未承認の候補統合はしない。

Status: APPROVED
Created: 2026-10-23 JST
Command: CMD-WORK-001 修正

### Problem / Need
原Word【6】は両端の項を単項式の平方として書く問い。4と3は、それぞれ係数16と9から求める数値であり、この問題より前では未計算。現ヒントが両方を直接示し、求める平方根の係数を先出ししている。
根本原因は `answer_preexposure_on_wrong_attempt` の「今回の原問で求める新しい数値・数値成分を誤答ヒントが明示する」条件。既に答えた前問の数値の再利用や、答えそのものを出さない一般手順の案内とは区別する。元P-003/P-004とは別問であり既存承認を流用しない。
教師Word SHA256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa` paragraph209【6】と直前問を照合。対象 `98ffc53ca390ef4769a4800a58cf3436f87b2057`、`src/data/textbook/math/numbers/n05Lesson.ts`、blob `251c32cf3053a7a00c366b102a13eac750d952ab`。このファイルは既存の差分連鎖で保存元と完全一致。

### Proposed Solution — exact hint literal only
対象q:6 / `n05-06` のhint1文字列。
- 旧: `16は4の平方、9は3の平方。文字の指数にも注意する。`
- 新: `両端の係数と文字の指数を別々に見て、それぞれ何を二乗すると元の項に戻るか確かめよう。`

### Scope / Expected Affected Areas
変更する学習内容はこの1文字列だけ。承認後、一問ずつ限定実装し、その問だけの真正な番号付き実画像・exact source SHAでGate①を確認する。必要な既存review境界/実画面検証を拡張。現在進行中Q06や既承認Q12選択肢を同じ承認で変更しない。

### Out of Scope / Do Not Touch
Q06の他フィールド、他19問、全原図、既受入Q11/Q18のヒントを保持。
正答 `(4x)^2,\quad(3y)^2`、選択肢・stable ID・原20問・revision2、全保存履歴と既存移行処理を保持。共有renderer/CSS/schema/採点/選択肢生成、原Word、他単元・モード、main統合・公開・課金は変更しない。ヒントのみで採点意味が同じためrevisionを上げず、旧回答を消さない。

### Preflight / Mathematical Evidence / Risks
この小問の診断前にMASTER §§19/20/21/23/51–54、WORK_SYSTEM §12B/12Cと原問・前問・現hintを照合。16=4²、9=3²、16x²=(4x)²、9y²=(3y)²。新案は数値4/3を含まない。中央項の照合は後続Q07/Q08に残す。
直接的な数値の補助を減らすため、新hintが手順を十分に案内するか、特に320pxで読めるか実画像確認が必要。既存の正しい式や既受入設計をまとめて書換えない。

### Verification Plan
承認後は一hintのsource diff、既存正答・全誤答・ID/版の不変、未回答時の先出し無し、誤答→hint→再回答→正答でのみ次問が解放されることを確認する。通常学習と限定previewの320/390/1440px実画像、旧進捗/firstValue/attemptCount/初回正誤/完了の保存・reload、既存数学/他モードの関連回帰を検証。元の症状と同根影響表を再確認し、この問だけGate①、全体Gate②/③・統合/公開は別に判断する。

### Approval
Status: APPROVED
Approved by user: YES
Approval date:
Approval evidence: なし。今回の「ヒントならいいよじゃ続けて」はQ03のhint用途の受入と既承認Q06への継続であり、この新しいP-005を許可していない。

### Review History
- Review status: NOT-REVIEWED
- User feedback: 未提示。
- Supersedes: None.
- Superseded by: None.
- 全文提案の明示承認前に学習内容を実装しない。現時点は診断と提案だけ。

### 2026-10-23 grouped presentation
ユーザーは今後約5問をまとめて完成・提示するよう指示。本案のhint literal/範囲/リスク/検証内容は変更せず、[新3案一括の変更前後](../W-MATH-026-n06-q12-distinct-distractor/BATCH_HINT_PROPOSALS_P005_P007.md)で一度に提示。**Status: WAITING / Approved by user: NO / 未実装**。Q06画像了承やQ12既存承認を新3案へ流用しない。承認後の一括実装/まとめQAと5件group提示は最新直接指示の運用に従う。

### Current execution scope
P-005は承認済み限定実装へ進行。sourcen05Lesson.ts q06 hintだけを変更。現在sourceSHA/NativeCI/画像はcommit後確定でPENDING、未検証をPASSにしない。

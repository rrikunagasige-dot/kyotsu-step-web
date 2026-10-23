# W-MATH-025/P-006 — N07 Q09の誤答ヒントで要求数値を先出ししない
Status: PROPOSED
Created: 2026-10-23 JST
Command: CMD-WORK-001 修正

### Problem / Need
原Word【9】と現行問題は0.696969…について最小の倍率を選び、差の等式を作る。現ヒントの100xは、選ばせる10/100/1000の中から正しい倍率100を先に教える。前の例は一桁周期8なので100は既答の再利用ではない。
根本原因は `answer_preexposure_on_wrong_attempt` の「今回の原問で求める新しい数値・数値成分を誤答ヒントが明示する」条件。既に答えた前問の数値の再利用や、答えそのものを出さない一般手順の案内とは区別する。元P-003/P-004とは別問であり既存承認を流用しない。
教師Word SHA256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa` paragraph305【9】と直前問を照合。対象 `98ffc53ca390ef4769a4800a58cf3436f87b2057`、`src/data/textbook/math/numbers/n07Lesson.ts`、blob `537a3ed8443f798fa905e72e0c544d22dfc4dfdd`。このファイルは既存の差分連鎖で保存元と完全一致。

### Proposed Solution — exact hint literal only
対象q:9 / `n07-09` のhint1文字列。
- 旧: `100xとxの小数部分を揃え、左辺は100x−xにする。`
- 新: `繰り返す数字の一周期が何桁か数えよう。その桁数だけ小数点を右へ動かして元の小数部分と揃え、差をとろう。`

### Scope / Expected Affected Areas
変更する学習内容はこの1文字列だけ。承認後、一問ずつ限定実装し、その問だけの真正な番号付き実画像・exact source SHAでGate①を確認する。必要な既存review境界/実画面検証を拡張。現在進行中Q06や既承認Q12選択肢を同じ承認で変更しない。

### Out of Scope / Do Not Touch
Q09の原文・正答・全誤答・既承認の式の折返しを保持。Q10の23/33、他13問は変更しない。
正答 `\text{100倍},\;100x=69.\overline{69},\;99x=69`、選択肢・stable ID・原14問・revision3、全保存履歴と既存移行処理を保持。共有renderer/CSS/schema/採点/選択肢生成、原Word、他単元・モード、main統合・公開・課金は変更しない。ヒントのみで採点意味が同じためrevisionを上げず、旧回答を消さない。

### Preflight / Mathematical Evidence / Risks
この小問の診断前にMASTER §§19/20/21/23/51–54、WORK_SYSTEM §12B/12Cと原問・前問・現hintを照合。69は二桁の最小周期。10xの小数部分は.9696…で元と異なり、100xの小数部分は.6969…で一致。100x−x=69から99x=69。新案は100、完成した等式、最終分数を含まない。
直接的な数値の補助を減らすため、新hintが手順を十分に案内するか、特に320pxで読めるか実画像確認が必要。既存の正しい式や既受入設計をまとめて書換えない。

### Verification Plan
承認後は一hintのsource diff、既存正答・全誤答・ID/版の不変、未回答時の先出し無し、誤答→hint→再回答→正答でのみ次問が解放されることを確認する。通常学習と限定previewの320/390/1440px実画像、旧進捗/firstValue/attemptCount/初回正誤/完了の保存・reload、既存数学/他モードの関連回帰を検証。元の症状と同根影響表を再確認し、この問だけGate①、全体Gate②/③・統合/公開は別に判断する。

### Approval
Status: WAITING
Approved by user: NO
Approval date:
Approval evidence: なし。今回の「ヒントならいいよじゃ続けて」はQ03のhint用途の受入と既承認Q06への継続であり、この新しいP-006を許可していない。

### Review History
- Review status: NOT-REVIEWED
- User feedback: 未提示。
- Supersedes: None.
- Superseded by: None.
- 全文提案の明示承認前に学習内容を実装しない。現時点は診断と提案だけ。

### 2026-10-23 grouped presentation
ユーザーは今後約5問をまとめて完成・提示するよう指示。本案のhint literal/範囲/リスク/検証内容は変更せず、[新3案一括の変更前後](../W-MATH-026-n06-q12-distinct-distractor/BATCH_HINT_PROPOSALS_P005_P007.md)で一度に提示。**Status: WAITING / Approved by user: NO / 未実装**。Q06画像了承やQ12既存承認を新3案へ流用しない。承認後の一括実装/まとめQAと5件group提示は最新直接指示の運用に従う。

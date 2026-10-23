# W-MATH-026 — Findings
## F-001 — mathematically_duplicate_distractors / CONFIRMED
対象SHA b1dc7e2ce7542ea1b7dd244a9490dfd1d4c2bf10、N06 revision3、n06-12。
`(x+y)(x-2)(x+1)` と `(x+y)(x+1)(x-2)` が交換法則と全係数の一致により同じ。単なる文字列差を別の誤答とした原因。正答の誤採点やhint先出しとは別原因。
- 原典: 教師Word SHA256 93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa、paragraph271【12】。
- Origin: [W-MATH-025 impact audit](../W-MATH-025-factor-hint-leak-qa-proposals/IMPACT_AUDIT_STAGEB_PRECHECK_20261023.md)。
- Correction: [P-001](./PROPOSAL.md)、PROPOSED。W-MATH-025/P-002は選択肢の変更を許可しない。
- Same-root impact set: N06内の因数分解4択、関連N05/N04/N07等の積の順序違いを含む選択肢。ここでは未監査部分をUNVERIFIEDとし、承認後の限定修正に続いて監査する。一括変更しない。
- 新候補だけ独立検算済み。アプリ実装・Gate①・回帰のPASSとはしない。


## 2026-10-23 JST — exact P-001 approved, execution deferred
ユーザーは本チャットで、3案の全文リンクと変更内容を示し「この3案を承認し、Q03から1問ずつ進めてよいですか？」と明示した直後に **「いいよ続けて」** と回答（2026-10-23 JST）。対象は9ef406823375a267d13d493c2a3c57af5e938bebで固定したW-MATH-025/P-003、P-004、W-MATH-026/P-001の3案。これは前のQ12ヒントGate①への同文回答とは別の承認事象。各案のexact範囲を順番に許可し、一括実装・Gate①省略・main統合/公開は許可しない。
先行P-003 Q03、P-004 Q06の各Gate①を待つ。sourceと選択肢は未変更、W-MATH-026実装CI/画像は未取得。過去のPROPOSED記録は承認前の履歴。


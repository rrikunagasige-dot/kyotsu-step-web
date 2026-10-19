# PROGRESS — rriku（2026-10-19 追記）

## 2026-10-19 新しい作業位置 — W-MATH-003 / P-003-R1（独立ブランチ）

- ユーザーが最新指示で「N04〜N14をすべて先に実装、各Qでは止めず最後に一括確認」と再明示。旧 N04-Q01-only 承認待ち運用はこの作業に適用しない。こちらからの未承認提案はない。
- [ドラフト PR #101](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/101) で N04/N05/N06/N07/N08/N11/N13/N14 計8単元・原Word123マーカー・127選択段階・元図9点をレビュー専用として実装。旧6単元は変更せず、3教材テーマの並びと短い小見出しを保つ。
- [一括ギャラリー](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/work/W-MATH-003-p003-r1-n04-n14-batch-20261019/work/items/W-MATH-003-numbers-expressions-creation/evidence/n04-n14-gallery/README.md) に、スマホ/PC全単元実画面と元図の表示時点を集約。原問の数学監査・画像SHA/KaTeX/全127操作/既存回帰をGitHub CIで検証。
- `main` の基準HEAD `537c3cbf28d40f45228d8a0c4bdd20327136aa93` を変えない。Vercel・新ステージング・本番公開・課金・削除・統合は未承認。
- **残るゲート**：ユーザー一括細部チェック、修正があれば当該ブランチで再検証、別途の実働アプリ全体総チェックと明示的公開/統合承認。画像は実アプリの代わりの公開リンクではない。Work `DONE` / `FINAL-APP-ACCEPTED` と混同禁止。
- 詳細 Work 記録：`work/items/W-MATH-003-numbers-expressions-creation/P-003-R1_IMPLEMENTATION_RECORD.md`。この日付の段落より下の旧チェックポイントは履歴として保持する。



## Completed app release (separate PR #50)
- Main `6e398f923c45fe895e53bc1f0f055f038acc41b6`, Math Practice Q87–120, Math Textbook `math-sets` published, Physics textbook Ch1, Physics guided representative examples combined.
- [Math Practice CI](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38055477424) SUCCESS; [Math Textbook CI](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38055477427) SUCCESS; [Pages deployment](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38055876654) SUCCESS.
- Other Math textbook units remain review, not published or user hands-on accepted.

## W-GOV-005 — repository OS transfer
- Verified owner `rrikunagasige-dot/kyotsu-step-web`, repo ID 1391122224, public main release baseline.
- SHA-preserved upstream historical archive 113 files and draft Work evidence 11 records.
- Adapted root instruction router, Constitution, Work OS, 4 mode candidate specs and target QA merged in [PR #49](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/49) at `41a9ce05ed10ffc0ddcdc46a5de84086198ac4cf`.
- Current position/graph/state synced with PR #50; post-merge governance check [38057462564](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38057462564) SUCCESS. W-GOV-005 DONE.
- No app/data/Pages code changed by governance port. Target-main merge confirmed, archive 113/113 intact, protected app files 174/174 unchanged; memory close recorded.

## Durable errors
- ERROR-PROVENANCE: upstream `paulfields83` was mistaken for target.
- ERROR-PROCESS: avoid repeated idle CI polling; do independent work while CI runs. After disconnect resume from latest proven checkpoint.
- Each handoff must provide genuine review link, not prose only.

## Next stage
Four imported subject/mode SPECs remain candidate summaries, pending separate comparison with accepted lesson source and user permission. No universal claim of “all four finished”.

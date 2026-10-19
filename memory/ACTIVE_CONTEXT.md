# ACTIVE CONTEXT — target rriku
Updated 2026-10-19
Repository `rrikunagasige-dot/kyotsu-step-web`, ID 1391122224. App release PR #50 merged into main `6e398f923c45fe895e53bc1f0f055f038acc41b6`; [Pages run 38055876654](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38055876654) SUCCESS.
Last completed Work: `W-GOV-005`, [governance PR #49](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/49), merged at `41a9ce05ed10ffc0ddcdc46a5de84086198ac4cf`; post-merge governance CI 38057462564 SUCCESS, closure PR #51. Work DONE.
- 113 exact upstream original files + 11 draft Work records archived, historical only.
- Constitution, Work OS, instruction dictionary, four mode candidate specs, QA, navigation and memory are target-adapted on main.
- Public app status now combines latest Math Practice Q87–120, Math textbook published sets, Physics Chapter 1, Physics representative Practice. Other Math textbook units remain review. See `navigation/MODE_STATE_2026-10-10.md`.
- App source, Math/Physics pedagogy and Pages configuration are unchanged by governance PR (app release PR #50 was a separate Work).
- Upstream numeric Q95/Q98 have different content; no ID-only transfer.
- Check actual live repo + HEAD, exact approved Work and mode authority before each new task.

## 2026-10-19 新しい作業位置 — W-MATH-003 / P-003-R1（独立ブランチ）

- ユーザーが最新指示で「N04〜N14をすべて先に実装、各Qでは止めず最後に一括確認」と再明示。旧 N04-Q01-only 承認待ち運用はこの作業に適用しない。こちらからの未承認提案はない。
- [ドラフト PR #101](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/101) で N04/N05/N06/N07/N08/N11/N13/N14 計8単元・原Word123マーカー・127選択段階・元図9点をレビュー専用として実装。旧6単元は変更せず、3教材テーマの並びと短い小見出しを保つ。
- [一括ギャラリー](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/work/W-MATH-003-p003-r1-n04-n14-batch-20261019/work/items/W-MATH-003-numbers-expressions-creation/evidence/n04-n14-gallery/README.md) に、スマホ/PC全単元実画面と元図の表示時点を集約。原問の数学監査・画像SHA/KaTeX/全127操作/既存回帰をGitHub CIで検証。
- `main` の基準HEAD `537c3cbf28d40f45228d8a0c4bdd20327136aa93` を変えない。Vercel・新ステージング・本番公開・課金・削除・統合は未承認。
- **残るゲート**：ユーザー一括細部チェック、修正があれば当該ブランチで再検証、別途の実働アプリ全体総チェックと明示的公開/統合承認。画像は実アプリの代わりの公開リンクではない。Work `DONE` / `FINAL-APP-ACCEPTED` と混同禁止。
- 詳細 Work 記録：`work/items/W-MATH-003-numbers-expressions-creation/P-003-R1_IMPLEMENTATION_RECORD.md`。この日付の段落より下の旧チェックポイントは履歴として保持する。

## Next Work policy
The governance port is complete. Continue to verify the real live `main` HEAD on each new task; do not assume checkpoint HEAD is still current. Imported mode SPECs remain CANONICAL-CANDIDATE. Any content revision, example redesign, figure work, or cleanup requires a new approved Work. Avoid idle CI status polling and always include a real review link.

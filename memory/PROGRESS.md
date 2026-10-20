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

## 2026-10-20 W-MATH-003 progress — R5 fully tested, Gate① three new screens pending
- Completion: initial N04–N14 review batch (eight units, 123 original Q, 127 UI choices, nine original PNG), approved P-004 / R1 / R2 / R3 / R4 / R5 corrections, 3 last source-reasoning repairs N06-Q15/N08-Q10/N13-Q08 and selective progress history safe revisions. **Code SHA `ad77318b37e90b9c39150b14ee706283b3f59355`; [full CI #39419920062](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39419920062) SUCCESS; [real image workflow #39419915311](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39419915311) SUCCESS, 18 new R5 screenshots** at `0c8177880ee6d71a441d02da7655a04c8c5ce47c`.
- Independent original-source audit **123/123 prompts, all 381 wrong alternatives, 127 app decisions**; three previously flagged cognitive gaps rechecked post-R5 PASS. Earlier 48/53 symbolic checks overlap, never sum as distinct source proof.
- **Still OPEN:** user **Gate①** fine-review of only 3 newly revised R5 actual screens; formal Gate② paperwork after human gate; Gate③ real code-SHA-matching hosted playable URL with user full play and explicit `総チェックOK`. Draft PR #101 unmerged; protected main/Pages/Vercel and billing unchanged.

## 2026-10-20 final Gate② CROSS-VERIFIED / Gate③ unhosted
Gate① initial eight and prior review blocks already accepted; latest R5 N06-Q15/N08-Q10/N13-Q08 **BLOCK-VISUAL-OK** via user's 「ok続けて」 directly after request, 2026-10-20 22:32 JST頃. Gate② **CROSS-VERIFIED** on frozen app code `ad77318b37e90b9c39150b14ee706283b3f59355`: 123 original Q, 127 guided decisions, 381 authored wrong choices independently checked, 24 corrected error/retry scenarios, all CI and old subject-mode regressions PASS. [Formal Gate2 ledger](../work/items/W-MATH-003-numbers-expressions-creation/CROSS_BLOCK_AUDIT_FINAL_R5_20261020.md).
**Gate③ FINAL-REVIEW-NOT-READY**: PR #101 remains Draft; Pages production deploy at main `537c3cb...`, not reviewed R5. Do not fake a playable URL. Require separate user authorization for a cost-safe hosted candidate, verify SHA and real route on mobile/desktop, then user whole-app play and final `総チェックOK`. [Gate3 worksheet](../work/items/W-MATH-003-numbers-expressions-creation/FINAL_APP_WALKTHROUGH_PREP_R5_20261020.md). No main/public deployment or paid Vercel actions authorized.

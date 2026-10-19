# CURRENT POSITION — 塾 / rriku target
Status: ACTIVE
Updated: 2026-10-19
Repository: `rrikunagasige-dot/kyotsu-step-web` (ID `1391122224`)
Verified main at checkpoint: `6e398f923c45fe895e53bc1f0f055f038acc41b6` — app release PR #50, [Pages SUCCESS](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38055876654).
NOTE: This HEAD is a dated checkpoint, not a substitute for reading live main on every new task.

## 2026-10-19 新しい作業位置 — W-MATH-003 / P-003-R1（独立ブランチ）

- ユーザーが最新指示で「N04〜N14をすべて先に実装、各Qでは止めず最後に一括確認」と再明示。旧 N04-Q01-only 承認待ち運用はこの作業に適用しない。こちらからの未承認提案はない。
- [ドラフト PR #101](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/101) で N04/N05/N06/N07/N08/N11/N13/N14 計8単元・原Word123マーカー・127選択段階・元図9点をレビュー専用として実装。旧6単元は変更せず、3教材テーマの並びと短い小見出しを保つ。
- [一括ギャラリー](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/work/W-MATH-003-p003-r1-n04-n14-batch-20261019/work/items/W-MATH-003-numbers-expressions-creation/evidence/n04-n14-gallery/README.md) に、スマホ/PC全単元実画面と元図の表示時点を集約。原問の数学監査・画像SHA/KaTeX/全127操作/既存回帰をGitHub CIで検証。
- `main` の基準HEAD `537c3cbf28d40f45228d8a0c4bdd20327136aa93` を変えない。Vercel・新ステージング・本番公開・課金・削除・統合は未承認。
- **残るゲート**：ユーザー一括細部チェック、修正があれば当該ブランチで再検証、別途の実働アプリ全体総チェックと明示的公開/統合承認。画像は実アプリの代わりの公開リンクではない。Work `DONE` / `FINAL-APP-ACCEPTED` と混同禁止。
- 詳細 Work 記録：`work/items/W-MATH-003-numbers-expressions-creation/P-003-R1_IMPLEMENTATION_RECORD.md`。この日付の段落より下の旧チェックポイントは履歴として保持する。

## Current Node
T-GOV-PORT / W-GOV-005 — completed adoption of Constitution, instruction dictionary, Work OS, four-mode routes, QA and historical records from the separate upstream `paulfields83/kyotsu-step-web`.
Status: DONE — [PR #49](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/49) merged into correct main at `41a9ce05ed10ffc0ddcdc46a5de84086198ac4cf`, [post-merge governance CI](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38057462564) SUCCESS. Closure W-GOV-005 recorded in PR #51.

## Completed
- **Mathematics Practice** Q87–120 (34) with guided thinking nodes, prior-result compaction, complete QA ledger, on main.
- **Mathematics Textbook** published `math-sets` on main via [PR #50](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/50). Proposition reading/quantifiers/proof and function conditions remain `review` candidates; original source PR #31 is still an unmerged draft.
- **Physics Textbook** Chapter 1 seven stable units 1A–1G, three learner-facing chunks, on main.
- **Physics Practice** three authored guided representative questions and Chapter 1 adapter on main. Not a full published large Physics problem bank.
- Combined current GitHub Pages build+deploy succeeded on `6e398f923c45fe895e53bc1f0f055f038acc41b6`. Modes and paths: `navigation/MODE_STATE_2026-10-10.md`.

## Current Rule
Before action verify GitHub owner, ID, branch and **live** HEAD. Then read AGENTS → Constitution → this current position → master graph → memory → target mode's accepted original documents → Work approval. `paulfields83` is history/source, NEVER writable target.
Distinguish SOURCE SAVED / MAIN MERGED / PAGES DEPLOYED / USER HANDS-ON APPROVED.

## Protected Scope
No governance changes to `src/`, `public/`, `e2e/`, package/lockfile or Pages workflow. Do not copy upstream question IDs Q95/Q98 into local numbering, promote review units, delete branches, overwrite user Word mother, or demote approved pedagogy.
Imported four-mode `subjects/**/SPEC.md` are CANONICAL-CANDIDATE summaries, subordinate to target-approved lesson documents.

## Open issues
- Adopt/review PR #49 and record its verified main merge/memory close; no false DONE.
- Separately reconcile each imported mode spec with established target sources before declaring it canonical.
- Product release user hands-on QA and future pedagogy remain separate Works.

## Next Executable Work
1. Use the adopted Constitution and Work OS for each new task; recover exact approved Work before editing.
2. Scope a separate proposal to compare each imported mode candidate spec with the accepted target mode/source.
3. No automatic content/UI changes or destructive cleanup without explicit approval.

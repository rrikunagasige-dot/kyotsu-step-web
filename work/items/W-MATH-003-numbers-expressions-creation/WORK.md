# W-MATH-003 — 数学Ⅰ「数と式」教科書モードの作成
Status: IMPLEMENTING
Source gate: RECOVERED (原Word元バイト・397 OMML・14画像の直接読み取り成功)。レビュー前に教材本体の変更をしない。
Updated: 2026-10-17
Repo: `rrikunagasige-dot/kyotsu-step-web` (ID 1391122224)
Base main: `c184077a745c7d4bc077e0b5d0eaa70e9af2ddaf`
Branch: `work/W-MATH-003-numbers-expressions-creation-20261017`

## Objective
CMD-WORK-002「作成」初回実証: 既存の「数と式」Word教材案を一次資料として、数学・教科書モードの新章16単元（N01–N14, NE01–NE02）を過去の集合完成版と正本教訓に基づいて設計し、代表4単元N01/N03/N10/N12を経て学習アプリへ統合する。

## Authority
`AGENTS.md`; `governance/CONSTITUTION.md`; `governance/INSTRUCTION_DICTIONARY.md` CMD-WORK-002; `work/templates/CREATION_DESIGN.md`; `subjects/mathematics/textbook/SPEC.md` (CANONICAL-CANDIDATE); `docs/MASTER_APP_LESSONS.md`; `docs/INFORMATION_ARCHITECTURE_RULES.md`; `docs/MATH_RENDERING_RULES.md`; user-approved exemplar `集合_教科書モード_完成版_v1(1).docx`.

## Inputs & provenance
- Library: `01_数と式_教科書モード_対話段階導入版_v2.docx`, 212863 bytes, 53 pages, dated upload 2026-10-10. **Edited teaching draft**, not the original publisher textbook. Notes cite 啓林館 `深進数学Ⅰ` guide.
- Saved approved planning report `NUMBERS_AND_EXPRESSIONS_CMD_WORK_002_INVENTORY_PROPOSAL_20261017.md` (local proposal artifact; not textbook source itself).
- 16 units / 233 original question markers / **14** verified embedded figures. Raw input SHA-256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`. Original answer booklet remains absent; 59 pilot solutions independently checked.
- User-approved exemplar `集合_教科書モード_完成版_v1(1).docx` indexed in Library.

## Scope
P-001 as approved: all-source fidelity audit, concept/problem graph, complete reasoning, four pilots N01/N03/N10/N12, design+user review, then approved batch production, regression and eventual app handoff. Present work phase = source audit + design, **no guessing missing source formulas**.

## Do Not Touch
Existing textbook `math-sets`, proposition, functions (including review-only), Math Practice, Physics, learner IDs/progress, existing app UI or active CI, old source Word, `main` directly, canonical lessons.

## Approval
P-001 approved in conversation on 2026-10-17 by 「いいよ。こうやって作ろうか」 in direct answer to exact proposed workflow; no conditions added. **Approval of plan is NOT evidence that unverified source equations are valid or release approval.**

## Current Step
原Wordから397のOMML式と14枚の原図を復元し、全233問マーカー/16単元を再監査。過去の12図は間違い（N05-F01/F02を見落としていた）。代表4単元59問の原式と独立解法を監査。生徒用N01本文・数式内穴のレビュー案を作成済み。詳しくは `SOURCE_OMML_AUDIT.md` / `PILOT_SOLUTION_AUDIT.md` / `N01_LEARNER_PILOT_DRAFT.md`。

## Next Step
1. 具体的N01本文・UI設計をユーザーに提示してレビュー（教材本文は別冊解答未照合、数式は独立に検算）。
2. 代表4単元の初回レビュー後、承認済みの範囲でN01をアプリに実装、PC/スマホで実機QAとアプリリンク提示。
3. N03/N10/N12を設計→実装→実機ユーザーレビュー。元原図の配置/答え漏洩をチェック。
4. 残り174問は全数学式の解法を監査した後、段階展開。別冊解答は原稿同一性QAとして未取得と明記。
5. `main`マージとPages本番反映は別承認ゲート。

## Definition of Done
Source faithfulness + math proof QA + user textbook pedagogy acceptance + browser/mobile/e2e + PR/release gates and Work/Memory Close. Technical CI alone insufficient.

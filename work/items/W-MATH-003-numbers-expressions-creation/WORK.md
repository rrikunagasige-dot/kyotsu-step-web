# W-MATH-003 — 数学Ⅰ「数と式」教科書モードの作成
Status: VERIFYING
Source gate: RECOVERED (原Word元バイト・397 OMML・14原図を確認)。N01 v2はユーザーが実装を承認し、現在は実アプリのユーザーhands-on確認待ち。
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
P-001 as approved: all-source fidelity audit, concept/problem graph, complete reasoning, four pilots N01/N03/N10/N12, design+user review, then approved batch production, regression and eventual app handoff. Present work phase = N01 pilot implemented in review-only app + all PR CI PASS, **user visual acceptance and main release pending**.

## Do Not Touch
Existing textbook `math-sets`, proposition, functions (including review-only), Math Practice, Physics, learner IDs/progress, existing app UI or active CI, old source Word, `main` directly, canonical lessons.

## Approval
P-001 approved in conversation on 2026-10-17 by 「いいよ。こうやって作ろうか」 in direct answer to exact proposed workflow; no conditions added. **Approval of plan is NOT evidence that unverified source equations are valid or release approval.**

## Current Step
- 原Word（397数式オブジェクト、14図）から原式を復元。16単元233問を数え、代表4単元59問の解法を独立計算で確認。別冊の公式解答とは未照合。
- N01 v2の具体的本文と15個の段階的回答設計をユーザーに提示し、2026-10-17に「いいよ進めて」と実装承認を受けた。
- `src/data/textbook/math/numbers/n01Lesson.ts` を単一の正本として追加。独立unitId `math-numbers-expressions-n01`、status `review`。元の数学教材・物理・練習モード、progress schema は変更していない。偶発した並行重複moduleを除去。
- PR #66 HEAD `e9c36aad36d40d3a03c7da177978557aff99d601` で GitHub Actions [38989883731](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38989883731) **SUCCESS**。型/単体/ビルド/PC/スマホ/物理/数学練習回帰が成功。
- **まだmain未統合・Pages未公開。生徒としての見た目のレビューは未完了。**

## Next Step
1. ユーザーに PR #66・検証記録・実際のアプリへ反映するための別承認ゲートを示す（PR自体は公開アプリリンクではない）。
2. マージとPages公開が別途認められた後、`#/learning/textbook/math-numbers-expressions-n01` を実機で確認し、ユーザーhands-on評価を得る。
3. N01が不合格なら `CMD-WORK-001 — 修正`へ引き渡す。合格したら残りの代表3単元N03/N10/N12へ進む。
4. 全233問・14図の章全体の受入は本パイロットと分ける。未監査の174問を完了扱いにしない。

## Definition of Done
Source faithfulness + math proof QA + user textbook pedagogy acceptance + browser/mobile/e2e + PR/release gates and Work/Memory Close. Technical CI alone insufficient.

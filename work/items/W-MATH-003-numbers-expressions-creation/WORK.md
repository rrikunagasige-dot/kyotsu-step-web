# W-MATH-003 — 数学Ⅰ「数と式」教科書モードの作成
Status: BLOCKED (source fidelity gate); design work proceeds
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
- 16 units, 233 original question markers, 12 referenced figure IDs; counts are provisional structural evidence only.
- User-approved exemplar `集合_教科書モード_完成版_v1(1).docx` indexed in Library.

## Scope
P-001 as approved: all-source fidelity audit, concept/problem graph, complete reasoning, four pilots N01/N03/N10/N12, design+user review, then approved batch production, regression and eventual app handoff. Present work phase = source audit + design, **no guessing missing source formulas**.

## Do Not Touch
Existing textbook `math-sets`, proposition, functions (including review-only), Math Practice, Physics, learner IDs/progress, existing app UI or active CI, old source Word, `main` directly, canonical lessons.

## Approval
P-001 approved in conversation on 2026-10-17 by 「いいよ。こうやって作ろうか」 in direct answer to exact proposed workflow; no conditions added. **Approval of plan is NOT evidence that unverified source equations are valid or release approval.**

## Current Step
1–5 work stages: completed first source and unit coverage mapping; 4-pilot step design in progress. Raw Word source / exact equations and figure inspection unavailable via current Library. Mac Downloads/Documents filename search found no copy. Until raw access: mathematics problem creation / figure re-creation / app implementation = BLOCKED, planning and source manifest continue.

## Next Step
1. Obtain/render exact original .docx to inspect OMML/formula/images (request user reattach or verified authorized source).
2. Reconstruct full source equation/answer/figure mapping, validate 233 prompts and 12 figures.
3. Review 4-pilot detailed design before writing canonical teaching text/holes.
4. Implement pilots in independent PR and test app, send preview link.
5. Review pilot acceptance, then the remaining 12 units in approved dependency batches.

## Definition of Done
Source faithfulness + math proof QA + user textbook pedagogy acceptance + browser/mobile/e2e + PR/release gates and Work/Memory Close. Technical CI alone insufficient.

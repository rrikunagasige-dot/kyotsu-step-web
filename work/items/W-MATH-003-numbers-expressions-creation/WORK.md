# W-MATH-003 — 数学Ⅰ「数と式」教科書モードの作成
Status: VERIFYING
Source gate: RECOVERED (原Word元バイト・397 OMML・14原図を確認)。N01はPR #66/main/Pagesに統合・動作確認済みで、ユーザーから「今のでいいと思う」と肯定を受領。N03/N10/N12本文案はユーザー承認済みで、別draft PR #68にreview専用アプリを実装。[Math textbook CI 39008959818] SUCCESS・[Governance 39008959856] SUCCESS。実画面のユーザーレビュー待ち。
Updated: 2026-10-17
Repo: `rrikunagasige-dot/kyotsu-step-web` (ID 1391122224)
Previous N01 base main: `c184077a745c7d4bc077e0b5d0eaa70e9af2ddaf`; current reviewed main at start of next-pilot work: `1bd40d5790faeb28ccccfaa7add5090a715949a2`
Branch (source review): `work/W-MATH-003-next-pilots-review-20261017` (PR #67)
Branch (app implementation): `work/W-MATH-003-n03-n10-n12-app-20261017` (draft PR #68)

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
P-001 as approved: all-source fidelity audit, concept/problem graph, complete reasoning, four pilots N01/N03/N10/N12, design+user review, then approved batch production, regression and eventual app handoff. Present work phase = N01 review-only pilot main-merged and Pages-deployed with technical browser PASS and user positive acceptance; **N03/N10/N12 learner copy and figure positions accepted by the user 2026-10-17**; implemented in separate draft PR #68 for technical and hands-on review, not released.

## Do Not Touch
Existing textbook `math-sets`, proposition, functions (including review-only), Math Practice, Physics, learner IDs/progress, existing app UI or active CI, old source Word, `main` directly, canonical lessons.

## Approval
P-001 approved in conversation on 2026-10-17 by 「いいよ。こうやって作ろうか」 in direct answer to exact proposed workflow; no conditions added. N01 v2 later accepted for implementation with 「いいよ進めて」; PR #66 main merge/Pages authorized separately with 「よろしく」; N01 public pilot review received 「今のでいいと思う。続け」 in direct response to its live review link (2026-10-17). This is positive user acceptance of the pilot, **not proof of manual mobile-device testing, nor automatic authorization to publish later pilots**.

## Current Step
- User-supplied raw DOCX (SHA `93827322...`) has 397 OMML math nodes, 14 figures, 233 source question labels; 59 four-pilot original solutions independently verified, 174 other source markers remain unaudited.
- N01 source 10 → 15 interactive choices. PR #66 merged into main at `1bd40d5790faeb28ccccfaa7add5090a715949a2`. [Pages workflow 38994031060](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38994031060) SUCCESS. Actual public N01 deep link opened; Q1 -1 clicked correct, progress 0/15→1/15, next item unlocked. Prior CI covered all 15 choices on desktop/mobile. Current code remains `status:'review'`.
- Following the user's 「今のでいいと思う。続け」, treat N01 pilot copy/behavior as accepted at the conversational review gate, **without claiming the user personally tested every device**. W-MATH-003 stays VERIFYING for remainder of chapter.
- N03/N10/N12 drafts authored on independent source-review branch and now implemented in separate review-only PR #68, preserving source 13/21/15 markers and 1/0/3 original figures:
  - `N03_LEARNER_REVIEW_V1.md` — exponent laws, distributive expansion, no prefilled original 2×2 product cells.
  - `N10_LEARNER_REVIEW_V1.md` — root laws under the source's `a>0,b>0` conditions, proof distinct from examples, rationalization.
  - `N12_LEARNER_REVIEW_V1.md` — inequality intersections, integer money context, answer-filled figure F03 unlocked after Q15.

## Next Step
1. PR #68 final code QA completed: typecheck, math and image hash Vitest, production build, mobile/desktop browser, Physics and Math Practice regressions all SUCCESS on code SHA dc88a631d443cf9af08f1acc5d8a44b3656b1df6.
2. Obtain user hands-on feedback on the actual N03/N10/N12 app before release. PR #68 remains draft.
3. Ask separately before any main merge/Pages publication; then verify the actual deployed page and user hands-on. Failure enters CMD-WORK-001.
4. Entire 16-unit chapter and 174 unaudited source questions remain out of DONE until complete audit, design, QA and memory close. No mass autoproduction.

## Approval of exact N03/N10/N12 learner copy (2026-10-17)
Following presentation of all three exact student-facing draft reviews, user replied 「いいよ。よろしく」. This authorizes a separate review-only app PR under P-001, **not** main merge or Pages release. Draft PR #67 is the reviewed design source; draft PR #68 carries implementation and unchanged original PNGs.

## Definition of Done
Source faithfulness + math proof QA + user textbook pedagogy acceptance + browser/mobile/e2e + PR/release gates and Work/Memory Close. Technical CI alone insufficient.

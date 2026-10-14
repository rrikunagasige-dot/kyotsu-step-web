# W-MATH-002 — 数学学習モードの表示圧縮（教材本文不変）

Status: IMPLEMENTING
Approved Proposal: P-005 (active: revised subset diagram PNG; historical P-001–P-004)
Date: 2026-10-11
Canonical target: `rrikunagasige-dot/kyotsu-step-web` (ID `1391122224`)
Baseline main: `be98aa0dc2c4f29d5bfb33e2295bbb9063099e33`
Implementation branch: `work/W-MATH-002-textbook-ui-compression-implementation-20261011`

## Objective
既存の数学練習モードのcurrent-stage compressionを、教材本文の書換えではなく**表示・状態管理のアイデア**として参照し、数学教科書・学習モードの長い画面を短くする。内容、表現、語句、数式、図、穴、正解、順序は変更しない。

## Historical P-001 step (superseded 2026-10-14)
VERIFYING; exact P-001 implementation completed in Draft PR #57. Current code head 66a24ea passed original Repository Governance 38104661477, Math Practice pilot 38104661486 and Math Textbook 38104661479. Published math-sets original content unchanged, 451/455 initial Git blobs identical; the only four edited original files are approved UI/CSS/E2E. A third-party StackBlitz source-import URL for frozen code commit was prepared on 2026-10-13 (PREVIEW_ENTRY.md); its actual browser startup is **not verified**, and there is still no independent deployed app URL. Await user hands-on UI review and separate explicit merge approval. The new standalone presentation.test.ts is authored but NOT included in the existing explicit 11-file Vitest CI command; structural stage checks are exercised by passing browser tests and runtime validation. No DONE claim.

## Authority
- Direct user: まず練習モードのsoftware上の表示工夫を調査→学習モードへの適用分析→修正案。文章自体は変えない。
- `governance/INSTRUCTION_DICTIONARY.md`: `CMD-WORK-001` SIMILARをユーザーが明示確認した。
- `governance/CONSTITUTION.md`, `governance/WORK_SYSTEM.md`, target `subjects/mathematics/AGENTS.md`; accepted main `math-sets` takes priority over historical/upstream candidate.
- P-001 now specifically APPROVED for implementation only. Original draft is preserved in PR #56. Merge/Settings not authorized.

## Confirmed baseline
- Practice: `src/components/learning/MathPracticeReadingFlow.tsx` currentTarget + flow-index filtering, compact dependency results and click-to-expand, `src/data/mathPractice/presentation.ts` explicit target/dependsOn/result mapping.
- Textbook: `src/pages/TextbookUnitPage.tsx` already progressively reveals future blocks via firstIncompleteGroup/visibleBlocksInGroup but renders **all previously visible groups and sections**, without history compression. Continuous math `lesson` uses one section; heading groups are long.
- Target `math-sets` published; other four mathematics textbook units remain review-only.

## Do Not Touch (for proposed implementation)
Any textbook source content strings or mother Word, `src/data/textbook/math/**` existing lesson bodies, math practice code/content, physics textbook/practice, IDs/answers/figures/revisions, deployment/config, existing other draft PRs, upstream repository, original Constitution/Dictionary/Work System.
No main merge/Settings change without separate explicit approval.

## Current P-002 step (2026-10-14)
Exact P-002 approved for implementation; active branch `work/W-MATH-002-P-002-context-and-history-20261014` based on merged main PR #57. Source-safe UI/history and question-scoped prerequisites implemented; first P-002 QA found one outdated E2E history expectation (36/37 mobile passed), corrected on the branch; clean re-run pending. Do not merge without separate approval. Full scope/authorization recorded in `PROPOSAL_P-002.md` and `APPROVAL_P-002.md`.

## Current P-003 step (2026-10-14)
P-003 UI fidelity fix is implemented in independent Draft PR #60 from main 9ea189a. Four defects F01–F04 are covered. Latest code head `2f0c3216879969804e17f718a4d657e39f4e64c9` passed all three CI workflows: Governance 38491685479, math practice 38491685536, math textbook 38491685502 (40 mobile + 40 desktop + 13 physics + 36 math practice tests). Browser user-acceptance remains pending and there is no P-003 deployment/merge authorization. Source curriculum untouched. See PROPOSAL_P-003.md and APPROVAL_P-003.md.

## Current P-004 step (2026-10-14)
P-004 explicitly approved for implementing and releasing the figure-path fix into real Pages application after compiled-image CI. Work branch `work/W-MATH-002-P-004-published-figure-assets-20261014` based on `main` merge `7eaac5d`. Source lessons and 11 SVGs untouched; progress keys preserved. Investigation found risk in Vite production asset base expression and missing image decode QA. Exact code head `8fbecea83992fdffc0090e197cd21147ce4599ae` passed production-image and all regression gates in Math textbook CI 38496386685. PR release is authorized; main merge and Pages success still to verify. Do not mark user visually accepted. Exact proposal and approval in `PROPOSAL_P-004.md` / `APPROVAL_P-004.md`.

## Historical next step (P-001)
Present PR #57's StackBlitz GitHub-import browser launch route for user hands-on acceptance; explicitly distinguish this unverified import route from a verified deployed preview. No new Github Pages build/merge occurred. STOP before main merge, curriculum changes or GitHub Settings. Broader math-unit rollout requires another proposal.

## Active P-005 — approved subset PNG only (2026-10-14)
User-approved second drawing: B fully within A, C partially overlaps A and C remains readable. Revised PNG registered at `public/assets/math/textbook/sets/subset-after.png` and source `subset-after` points there. Existing app caption unchanged; old SVG preserved. Dedicated branch `work/W-MATH-002-P-005-subset-approved-png-20261014`, baseline main `a24a3b0`. Now verifying via CI and browser image decode. Do not reset progress or modify union/other figures. See PROPOSAL_P-005.md / APPROVAL_P-005.md.

# W-MATH-002 — 数学学習モードの表示圧縮（教材本文不変）

Status: VERIFYING
Approved Proposal: P-001
Date: 2026-10-11
Canonical target: `rrikunagasige-dot/kyotsu-step-web` (ID `1391122224`)
Baseline main: `be98aa0dc2c4f29d5bfb33e2295bbb9063099e33`
Implementation branch: `work/W-MATH-002-textbook-ui-compression-implementation-20261011`

## Objective
既存の数学練習モードのcurrent-stage compressionを、教材本文の書換えではなく**表示・状態管理のアイデア**として参照し、数学教科書・学習モードの長い画面を短くする。内容、表現、語句、数式、図、穴、正解、順序は変更しない。

## Current step
VERIFYING; exact P-001 implementation completed in Draft PR #57. Current code head 66a24ea passed original Repository Governance 38104661477, Math Practice pilot 38104661486 and Math Textbook 38104661479. Published math-sets original content unchanged, 451/455 initial Git blobs identical; the only four edited original files are approved UI/CSS/E2E. Await user hands-on UI review and separate explicit merge approval. The new standalone presentation.test.ts is authored but NOT included in the existing explicit 11-file Vitest CI command; structural stage checks are exercised by passing browser tests and runtime validation. No DONE claim.

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

## Next
Present exact Draft PR #57 and tests to user for hands-on acceptance; no published app preview exists because no merge/deploy occurred. STOP before main merge, curriculum changes or GitHub Settings. Broader math-unit rollout requires another proposal.

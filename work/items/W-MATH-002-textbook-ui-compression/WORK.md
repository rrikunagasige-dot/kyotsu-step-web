# W-MATH-002 — 数学学習モードの表示圧縮（教材本文不変）

Status: PROPOSED
Approved Proposal: NONE
Date: 2026-10-11
Canonical target: `rrikunagasige-dot/kyotsu-step-web` (ID `1391122224`)
Baseline main: `be98aa0dc2c4f29d5bfb33e2295bbb9063099e33`
Proposal branch: `proposal/W-MATH-002-textbook-ui-compression-20261011`

## Objective
既存の数学練習モードのcurrent-stage compressionを、教材本文の書換えではなく**表示・状態管理のアイデア**として参照し、数学教科書・学習モードの長い画面を短くする。内容、表現、語句、数式、図、穴、正解、順序は変更しない。

## Current step
ASSESS complete → proposal P-001 prepared → USER REVIEW / STOP. No implementation approval.

## Authority
- Direct user: まず練習モードのsoftware上の表示工夫を調査→学習モードへの適用分析→修正案。文章自体は変えない。
- `governance/INSTRUCTION_DICTIONARY.md`: `CMD-WORK-001` SIMILARをユーザーが明示確認した。
- `governance/CONSTITUTION.md`, `governance/WORK_SYSTEM.md`, target `subjects/mathematics/AGENTS.md`; accepted main `math-sets` takes priority over historical/upstream candidate.
- An unapproved correction proposal is NOT an implementation authorization.

## Confirmed baseline
- Practice: `src/components/learning/MathPracticeReadingFlow.tsx` currentTarget + flow-index filtering, compact dependency results and click-to-expand, `src/data/mathPractice/presentation.ts` explicit target/dependsOn/result mapping.
- Textbook: `src/pages/TextbookUnitPage.tsx` already progressively reveals future blocks via firstIncompleteGroup/visibleBlocksInGroup but renders **all previously visible groups and sections**, without history compression. Continuous math `lesson` uses one section; heading groups are long.
- Target `math-sets` published; other four mathematics textbook units remain review-only.

## Do Not Touch (for proposed implementation)
Any textbook source content strings or mother Word, `src/data/textbook/math/**` existing lesson bodies, math practice code/content, physics textbook/practice, IDs/answers/figures/revisions, deployment/config, existing other draft PRs, upstream repository, original Constitution/Dictionary/Work System.
No main merge/Settings change without separate explicit approval.

## Next
Show P-001 in full and stop. If changed, create P-002 revision; do not implement P-001 automatically. After explicit approval, implement isolated math-sets pilot and execute the tests described in PROPOSAL.md. Provide actual review URL.

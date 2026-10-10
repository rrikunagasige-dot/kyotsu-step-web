# W-GOV-007 — 旧Repository OSとの構造一致と実効運用

Status: IMPLEMENTING
Approved Proposal: P-001
Updated: 2026-10-11
Repository: `rrikunagasige-dot/kyotsu-step-web` (ID 1391122224)
Source reference (READ-ONLY): `paulfields83/kyotsu-step-web` at `b6687b571c8a292591e91cad84a452f180184ea1`
Baseline target main: `be98aa0dc2c4f29d5bfb33e2295bbb9063099e33`
Branch: `work/W-GOV-007-repository-os-parity-implementation-20261011`

## Objective
以前のpaulfields83の辞典・憲法・Work System・README・現在地・火柴図・記憶・テンプレートを、現在の対象repoで可能な限り同じ考え方と入口で使い、今後の作業で守れるようにする。新しいOSの発明や教材改修ではない。

## Authority
Direct user request (2026-10-11): 旧GitHubにできるだけ似せ、辞典・憲法・仕事流れ・READMEなど、前チャットで作った仕組みを現在のrepoで厳格に運用したい。その後「これでいいと思う。じゃよろしく。」＝調査と修正提案の整理を依頼。
`governance/WORK_SYSTEM.md` の承認ゲートに従う。具体的な実装箇所・検査の詳細が新たに確定したP-001は2026-10-11に「我觉得可以继续」でR0–R5実装のみ承認された。

## Current Step
IMPLEMENTING. 旧新版のGit差分照合を完了し、README入口と全PR advisory pilotを追加。GitHub Actionsの実測と復元テストは未確定。

## Approved Proposal
P-001 `PROPOSAL.md` APPROVED for R0–R5 implementation ONLY. `APPROVAL_P-001.md` anchors proposal and `SCOPE.json` Git blobs. Main merge/Settings NOT AUTHORIZED.

## Safety / Exclusions
- `main`、公開アプリ、既存教材の正本・母本、`src/` `public/` `e2e/` `docs/` `history/` `CHATGPT_README_FIRST.md` `WORKFLOW.md`、Pagesデプロイは変更しない。
- `governance/CONSTITUTION.md` `WORK_SYSTEM.md` `COMMAND_WORDS.md` の既存意味・原文は守る。
- W-GOV-006 Draft PR #53 は未統合で残し、このWorkの実装権限に使わない。
- GitHub branch protection / rulesets と PR統合は独立承認。

## Next Step
Run CI, verify tests/old source protection, perform an honest recovery drill, provide implementation review PR link, STOP before main merge or Settings.

## Completion Condition
P-001への別途明示承認後、旧OSの入口・構造・ルールの整合性を検証、既存成果の不変性を検証、通常PRと不正変更の正/負試験を示す。CI / user approval / merge / GitHub Settings are separate states; no unconditional DONE.

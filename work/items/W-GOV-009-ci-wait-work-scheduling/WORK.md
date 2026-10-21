# W-GOV-009 — CI待機中の安全な独立作業・復帰フロー
Status: VERIFYING
Review stage: approved isolated implementation; governance CI and review pending, main unmerged
Command: CMD-WORK-001「修正」; W-GOV-009/P-001 exact implementation approval recorded 2026-10-21.
Date: 2026-10-21 JST
Target: `rrikunagasige-dot/kyotsu-step-web`, repository ID 1391122224
Proposal branch: `proposal/W-GOV-009-ci-wait-independent-work-20261021`
Base live main at recovery: `537c3cbf28d40f45228d8a0c4bdd20327136aa93`

## Objective
既存の「CIは連続ポーリングせず独立タスクを進める」教訓を、承認・依存・競合・CI再確認・復帰を判定できる正式なWork OS運用規則へ具体化する。CIの待機時間に未承認変更を進める権限は与えない。

## User instruction and exact permission
User requested searching prior countermeasures and DESIGNING an improved workflow, including possible parallel creation/correction. Assistant asked whether to treat it as existing CMD-WORK-001 and proceed to a formal proposal recorded on GitHub. User replied exactly 「いいよ続けて」. This authorizes creation and GitHub recording of a proposal-only Work, NOT adoption of a normative rule, implementation of governance edits, main merge, or app publication.

## Current step
- Work recovered; Constitution/Dictionary/WORK_SYSTEM §§12A/12B and progress ERROR-PROCESS checked.
- Exact proposal drafted under `PROPOSAL.md`; waiting for user review and explicit approval of that exact proposal.
- This branch modifies only the five W-GOV-009 Work records. No current governance/routing, lesson, learner-code, CI, deployment, main or archived records changed.

## Next step
Present full P-001 proposal to user. STOP. Upon explicit P-001 approval, only then create separate exact-scope documentation implementation and verification; do not infer that approving proposal authoring approved the normative content. Preserve separate main merge authorization.

## Scope and protections
Allowed now: proposal, findings, planned tests and history logs. Do not touch Constitution, §12A/§12B meanings, existing Work states, existing approvals, original textbooks, MASTER lessons, source app, accepted screenshot reviews, main, deployment, paid hosts.

## 2026-10-21 P-001 approved implementation checkpoint
- User said 「いいよ」 immediately after the full P-001 authorization question; same exact scope, no additional conditions.
- Branch: `work/W-GOV-009-ci-wait-implementation-20261021` based on proposal commit `738b5ab584d8266d131eb152b89144ca81ed88e2`.
- Scope: WORK_SYSTEM §12C, AGENTS one pointer, dictionary two pointers, Work records. No learner or hosting changes. Earlier proposal-only checkpoint text above is historical.
- Next: verify actual diff, create Draft PR for governance checks, record CI run/SHA, obtain user review; merge into main requires separate permission.


## Latest authoritative handoff — 2026-10-21 technical CI success (pre-final-record commit)
- Exact W-GOV-009/P-001 implementation approved; main integration NOT authorized.
- Draft [PR #102](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/102) open, unmerged.
- Normative/docs tested SHA: `f5759ab8b1ffd87d7e4537081ecea97ff4ea9bb1`; §12C, AGENTS and dictionary approved changes verified.
- [Repository Governance Check #39526681491](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39526681491) SUCCESS and [Review Preview Code Check #39526681402](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39526681402) SUCCESS on that SHA.
- V01–V10 policy cases documented in VERIFICATION.md with **textual decision coverage**; not ten real parallel CI executions.
- Additional final Work-record documentation commit must be rechecked for its own HEAD; rule content unchanged by records update. Remain VERIFYING for user review and separate merge authorization. Do not merge, publish or make app/lesson changes.

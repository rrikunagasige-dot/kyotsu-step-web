# W-GOV-008 / P-003 — GitHub small blocks, cross audit and final app playthrough

Status: DONE
Updated: 2026-10-19 JST
Command: CMD-WORK-001「修正」 (exact user authorization)
Proposal: P-003 APPROVED
App-wide review label: FINAL-REVIEW-NOT-READY (separate from governance Work DONE)
Branch: `work/W-GOV-008-P003-github-review-final-check-20261019` based on P-001 head `80e6fdc2151c1b7ac4a2aea181f82bd3cad81b43`
Main source at approval: `154a16ff379321016f4692bb0ac6fe9a8a596214`; not modified.

## Objective

Replace user-confusing PR/per-block live-app acceptance with GitHub-visible small marked screenshots, agent-owned cross-block QA, and exactly one actual playable whole-app final gate. Preserve all proposal permissions and previous accepted evidence.

## Approval scope / do not touch

User on 2026-10-19 explicitly approved **the complete P-003 proposal**, as CMD-WORK-001, on an **independent branch**. May update governance, dictionary review handoffs, master lesson §54, review templates, protocol, evidence-only GitHub Action/validation, Work records, related memory. No pedagogical lesson source/answer/learner progress mutation.

**Not approved:** main integration, public production/GitHub Pages release, new public staging environment, Vercel deletion, billing, credential/card/bank input. Existing P-001 and P-002 history remains intact. A new real public final app environment requires separate explicit permission.

## Source authorities / dependency

- `AGENTS.md`, `governance/CONSTITUTION.md`, `governance/INSTRUCTION_DICTIONARY.md`, `governance/WORK_SYSTEM.md`, `governance/COMMAND_WORDS.md`
- `docs/MASTER_APP_LESSONS.md` §51–54, `work/items/W-GOV-008-direct-app-review/` on P-001 branch, P-002 markers in PR #95
- P-001 PR #93: governance base dependency, not merged; P-002 PR #95: separate app implementation, not copied. P-003 PR will target P-001 branch for intelligible diff and keep main untouched.

## Deliverables

1. Revised §12A, CMD-WORK-001/002 handoffs and §54 with explicit supersession/history and isolated release boundary
2. GitHub-ready small visual review sheet and simplified user handoff with accepted-marker-history rule
3. Cross-block impact audit ledger and final whole-app playthrough template
4. P-002 marker protocol adaptation without claiming P-002 app deployed
5. Manual/no-deploy screenshot evidence workflow, Playwright SHA gate and governance validator
6. These five Work files with technical verification and remaining final-app blocker

## Acceptance criteria for this governance Work

- Static validator and pull-request CI PASS on exact P-003 commit
- No main/production/public preview/write to learner state; no charge-bearing action
- Confirm review statuses distinguish `細部OK` from `総チェックOK`
- No fake screenshots, no fake final app link, no user final acceptance claimed
- Final product gate remains `FINAL-REVIEW-NOT-READY` until a separately authorized accessible candidate exists

## Closure for this governance-only Work

The documented P-003 rules and evidence helper passed repository governance check `39201150414` and code typecheck/build check `39201150420` on implementation SHA `3f0ba0ad82b28ffe6f0fa7288006ebbe2ac558da`. The app-wide Gate ③ is explicitly still `FINAL-REVIEW-NOT-READY` and P-002 interaction screenshots have not been collected on this branch. Work `DONE` **does not** assert user `総チェックOK`, product release readiness, or app changes.

## 2026-10-19 — separate later main-integration approval (postscript)

The earlier independent-branch-only approval above is preserved as historical evidence. After Gate ③ of the published app was accepted, the user separately replied 「この案はいいよ。認める。じゃやってくれ」 to the proposal to reconcile and integrate the *same approved* P-003 review rules into current target main. An independent integration branch from the then-live main is used; original P-001/P-002 records remain intact. This narrow governance integration does not touch math/physics lessons, runtime, deployment workflows, new public hosting, Vercel management or billing.

The release-specific Gate①/②/③ acceptance and successful existing GitHub Pages run are recorded in PR #98: https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/98#issuecomment-6262808123 . The user's clarification 「だから確認終わったよ。いいよって」 confirms that release's final acceptance; it is not a blanket future command alias. Integration SHA, CI and merge evidence must be recorded after they actually occur, not inferred from this postscript.

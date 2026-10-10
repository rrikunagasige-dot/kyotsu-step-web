# Action Log — W-GOV-007

## A-001 — Read-only repository comparison
Date: 2026-10-11
Related proposal: P-001 (created after this audit; not approved)
Action: Confirmed live target/main and upstream/main, read governance dictionary, constitution, Work System, command definitions, README, routers, checker and workflow. Compared root file path inventories and Git blob hashes.
Target / location: `paulfields83/kyotsu-step-web` read-only main `b6687b5`, `rrikunagasige-dot/kyotsu-step-web` main `be98aa0dc2c4f29d5bfb33e2295bbb9063099e33`.
Reason: User requested faithful old OS structure and actual enforcement, not an unrelated new system.
Result: Non-destructive assessment; see PARITY_AUDIT.md. No product or main changes.
Evidence: Official GitHub tree+contents data and preserved Paul import.

## A-002 — Proposal-only branch / review record
Date: 2026-10-11
Related proposal: P-001 PROPOSED
Action: Wrote exact R0–R5 plan, scope/STOP gates, comparative audit and operating graph in new W-GOV-007 Work records only. This is NOT implementation of R1–R5.
Target / location: `proposal/W-GOV-007-repository-os-parity-20261011`.
Reason: `governance/WORK_SYSTEM.md` prohibits new, unapproved scope implementation and forbids treating broad review feedback as exact approval.
Result: PROPOSED; user review required. No merge or Settings action.
Evidence: Proposal-only draft PR (URL to be provided after GitHub PR creation).


## A-003 — Specific P-001 implementation authorization
Date: 2026-10-11
Related proposal: P-001
Action: User answered 「我觉得可以继续」 directly to the explicit P-001 implementation question; preserved the proposal-only PR #54 unchanged. On an independent branch recorded the approved version and Git SHA anchors, with merge and Settings expressly unauthorized.
Target / location: `work/W-GOV-007-repository-os-parity-implementation-20261011`, `PROPOSAL.md`, `SCOPE.json`, `APPROVAL_P-001.md`.
Result: Specific implementation permission, not an implicit authorization for all future Works.

## A-004 — OS-first README and universal advisory
Date: 2026-10-11
Related proposal: P-001 (approved implementation scope)
Action: Added old-OS-style human entry/navigation above the preserved former README, narrowly enhanced AGENTS / technical/work router, corrected stale main-current PR #49 issue and recorded independent W-GOV-007 status. Introduced general PR Work-scope policy, negative/positive Node tests, and a non-required advisory job for all future pull requests.
Target / location: Only paths declared in P-001 and pinned `SCOPE.json`.
Result: Implementation staged; PR diff protection, fresh-agent drill and GitHub CI need observed verification.


## A-005 — Fix independent test harness before trusting CI
Date: 2026-10-11
Related proposal: approved P-001
Action: GitHub run 38072923508: original governance PASS; new independent policy test runner FAIL because test fixture `go()` accidentally referred to undefined `changes` rather than `changed`. Additionally removed literal backslash escapes from new README code spans; all legacy README original lines remain intact.
Result: First run honestly FAILED; corrected and new run required. No curriculum or original governance changes.
Evidence: https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38072923508


## A-006 — Correct positive-case fixture path
Date: 2026-10-11
Related proposal: P-001 implementation
Action: Run 38073007608 passed 20/21 tests; positive static case unexpectedly FAIL because the test fixture used `dir+'/**'` (double slash) instead of `dir+'**'`. Corrected only the fixture and retained old failure log.
Result: Rerun required; no change to Work-scoping implementation logic or the old curricula.
Evidence: https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38073007608


## A-007 — Confirm all-PR pilot and original code preservation
Date: 2026-10-11
Related proposal: approved P-001
Action: GitHub Actions 38073085840 completed success (existing governance and universal advisory). 21/21 Node tests PASS; the real PR #55 audit returned SCOPE_PASS_HUMAN_REVIEW_REQUIRED with zero errors and humanApprovalVerified=false. Compared recursive Git trees against original target main: 455 original files; 446 identical; 9 approved OS-router/README/CI/memory files modified; **406/406 protected original blobs identical**, zero unexpected additions, deletions, or changed files.
Result: Scope and static invariants PASS, human consent/merge not machine certified. Started independent published-mode targeted regression job and read-first recovery trace (fresh unrelated AI not yet executed).
Evidence: https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38073085840


## A-008 — Observe targeted full published-mode regression
Date: 2026-10-11
Related proposal: P-001 approved implementation
Action: Run 38073231132 completed all jobs SUCCESS; original governance 0 errors; new cross-Work tests 21/21 PASS; actual PR scope audit no violations and explicit humanReview flag; typecheck PASS, target Vitest 202/202 PASS, build PASS, mobile+desktop Playwright 12/12 plus Physics Practice 2/2 PASS. Compared tree after the regression/checkpoint: all 455 original files retained, exactly 9 approved original README/router/memory/workflow files changed, 406/406 protected original blobs identical.
Result: G0–G3/R0–R3/R5 static/targeted gates pass. R4 structural simulation PASS; truly unrelated fresh AI remains pending. No merge/Settings authority.
Evidence: https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38073231132

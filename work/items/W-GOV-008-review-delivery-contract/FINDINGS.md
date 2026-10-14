# W-GOV-008 Findings
## F-001 — ERROR-PROCESS
An earlier assistant substituted an unapproved Windows ZIP/PowerShell workflow for the user-required direct APP_UI link; it changed who must perform setup.
Evidence: user dialogue and W-MATH-002 PR #57.
Correction: typed review deliverable; no unauthorized medium conversion.

## F-002 — ERROR-SPEC
W-MATH-002 P-001 specified user UI review but did not specify executable hosting/preview tasks with permissions for an unmerged PR.
Evidence: W-MATH-002 P-001 and SCOPE; main-only Pages workflow.
Correction: delivery route must be fixed at planning time.

## F-003 — ERROR-QA
Code/test CI success was treated as sufficient progress while no running PR preview had been demonstrated. A new test in PR #57 was not in its fixed Vitest list.
Evidence: PR #57 verification and CI workflow.
Correction: separate proof of app URL/commit/asset checks; don't misreport tests.

## F-004 — CONFIRMED
Paul and target versions of WORK_SYSTEM, COMMAND_WORDS and CHANGE_PROTOCOL are SHA-identical at the compared main refs. Main Work OS was not simply lost in migration.
Evidence: GitHub blob comparisons on 2026-10-11.

## F-005 — RISK
W-GOV-007 PR #55 remains Draft and overlaps governance/CI files; no automatic merge or conflict reconciliation is authorized.
Evidence: live PR #55.

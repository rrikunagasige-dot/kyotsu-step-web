# VERIFICATION — W-GOV-006

Status: PENDING
Phase: VERIFYING G0–G4 (P-002 approved for implementation only; PR merge/settings NOT approved)
Baseline main: `be98aa0dc2c4f29d5bfb33e2295bbb9063099e33`

## Proposal-stage checks
- Target repo name/ID and live main verified.
- Owner `main` has no branch protection and repository rulesets count=0 (confirmed at assessment).
- Core Constitution / Work OS / command dictionary and current governance CI inspected.
- This proposal-only PR must change only six Work record files (five originals + P-002) under `work/items/W-GOV-006-workflow-integrity/`.
- All application, courseware, production workflow, existing governance code and main branch: UNMODIFIED by this proposal.

## Implementation acceptance (NOT YET RUN)
- Negative/positive approval and scope tests: PENDING.
- CI diffs checked against approval scope: PENDING.
- Navigation/current-work contradiction fixed: PENDING.
- Branch settings enforced, checked via live GitHub: PENDING, requires separate owner permission.
- Approval evidence for actual implementation: PENDING.
- Post-merge verification and memory close: PENDING.

This Work must NOT be declared PASS/DONE at proposal stage. P-001 was not approved; P-002 G0–G4 implementation was approved by user on 2026-10-10. PR merge and Settings remain NOT AUTHORIZED.


## P-002 preparation verification
Original `PROPOSAL.md` (P-001) remains byte-identical; P-002 is a separate revision file. Protection-first requirements are documented but have NOT been executed. Tests and rollback are FUTURE gates, not passed checks.


## G0–G4 implementation evidence (CI PENDING)
- **G0**: 395 protected original Git blob SHA entries recorded, no automated mutations to existing content.
- **G1**: isolated Node tests include positive and negative cases; CI run result not yet observed.
- **G2**: preserve existing governance check; independent PR scope-pilot job is not a required branch protection gate.
- **G3**: stale PR #49 pending-merge issue removed from live Current Position, while historical W-GOV-005 record remains.
- **G4**: compare manifest to PR head Git blobs; full product regression CI and browser gate must be observed before merge. This Work remains VERIFYING.
- **Human review and main merge**: PENDING separate explicit user instruction. No GitHub branch protection or Rulesets modified.


## G4 initial workflow evidence (FAILED checks retained)
- [Workflow run 38062252648](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38062252648): existing governance job PASS.
- Independent policy negative/positive tests PASS **15/15**.
- Pilot PR-scope job FAIL because of false-positive P-001 textual check (an implementation error, not an approval violation). Corrected with anchored status-line check; rerun required.
- Product `pnpm check` job FAIL at lint: **24 pre-existing lint errors in protected unchanged source files**. This Work cannot touch these files. Splitting the new *pilot-only* product job into typecheck, visible legacy lint diagnostic, unit test, build, and Playwright allows actual independent regression evidence without altering the old lint rule or the original app. Do NOT report `pnpm check` full PASS.
- Required post-correction tests and product verification: PENDING.

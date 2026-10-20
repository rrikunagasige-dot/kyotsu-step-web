# W-GOV-006 — Workflow integrity without loss of existing results
Status: VERIFYING
Updated: 2026-10-10
Repository: `rrikunagasige-dot/kyotsu-step-web` (ID 1391122224)
Approved Proposal: P-002
Implementation branch: `work/W-GOV-006-preservation-implementation-20261010`
Main baseline at start: `be98aa0dc2c4f29d5bfb33e2295bbb9063099e33`

## Objective
Keep all previously completed Math/Physics learning/practice, archives, user mother docs, GitHub Pages and original Constitution/Work System byte-for-byte unchanged while strengthening ONLY the separate Work approval and diff workflow.

## Authority / approval
P-001 not approved and preserved unchanged at `PROPOSAL.md`.
P-002 at `PROPOSAL_P-002.md`; implementation approved by user in this conversation: 「よし今は大丈夫じゃ修正よろしく。」
Scope/evidence and explicit exclusions recorded in `APPROVAL_P-002.md`.
**Not approved:** merging this implementation PR to main, changing GitHub Rulesets/Settings, editing app/data/docs/original Constitution or any other mode.

## Work and protections
G0: baseline inventory of 395 protected Git blobs in `BASELINE_MANIFEST.md`.
G1: independent Node negative/positive cases (including forged approval markers) in `tests/governance/`.
G2: additive pilot only; old governance checks intact, no required branch settings altered.
G3: remove contradictory stale PR #49 task from current position without changing historical evidence.
G4: compare exact SHA of all protected blobs, run workflow CI, and inspect actual results.

## Current Step
VERIFYING — approved P-002 G0–G4 implemented and narrow, source-preserving checks passed at [run 38064137763](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38064137763), 16/16 safety, 395/395 source SHA, 202/202 target units, 14/14 representative browser tests. Full historical suite failures are separately recorded: lint24, outdated count tests2, obsolete UI E2E4. Product and constitution unchanged.

## Next Step
Present [PR #53](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/53) and verification to user, STOP before merge. Merge of that PR is a separate exact approval gate (G5). GitHub Settings (G6) also require a separate user decision. Do not claim Work DONE while either remains unresolved.

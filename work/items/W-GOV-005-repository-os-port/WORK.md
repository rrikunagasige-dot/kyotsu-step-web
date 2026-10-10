# W-GOV-005 — Constitution / Repository OS migration
Status: DONE
Updated: 2026-10-10

## Objective and approval
Carry the user's designed Constitution / Work Operating System into the correct repository `rrikunagasige-dot/kyotsu-step-web`, with preserved provenance and zero modification of the four educational modes.
Approved proposal: P-001, recorded in `PROPOSAL.md`; user directly requested continuation after the successful app release.

## Implementation
- Source repository: `paulfields83/kyotsu-step-web`, preserved as archive only.
- Target repository: `rrikunagasige-dot/kyotsu-step-web`, ID `1391122224`.
- Work branch: `governance/port-repository-os-20261010`.
- Target merged PR: [#49](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/49), commit `41a9ce05ed10ffc0ddcdc46a5de84086198ac4cf`.
- Published baseline app before governance merge: [PR #50](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/50) at `6e398f923c45fe895e53bc1f0f055f038acc41b6`.
- Original upstream 113 Git blobs, 11 draft Work records, adapted `AGENTS.md`, Constitution, instruction dictionary, Work approval system, target-mode routers and governance validator.

## Verification
See `VERIFICATION.md` — Status PASS. Governance CI both on PR branch and post-merge main succeeded, and the protected 174 app/data/assets/deploy files were SHA-identical to pre-governance release.

## Scope limit
Imported mode specifications remain **CANONICAL-CANDIDATE**, not automatically promoted over accepted target-specific docs. The unmerged upstream lesson variants and Math textbook review units were not published by this Work. No app/UI/courseware change was made.

## Next Step
Work closed. A future new Work, with its own explicit proposal, may compare each imported candidate subject spec against the approved original materials and deal with uncovered Physics Practice / math-review lessons. Do not treat this Work's completion as approval for those changes.

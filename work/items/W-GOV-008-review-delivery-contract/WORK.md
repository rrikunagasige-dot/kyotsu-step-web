# W-GOV-008 — Reliable Review Delivery
Status: VERIFYING
Updated: 2026-10-11
Repository: `rrikunagasige-dot/kyotsu-step-web` / ID `1391122224`
Base: `be98aa0dc2c4f29d5bfb33e2295bbb9063099e33`
Branch: `work/W-GOV-008-review-delivery-contract-20261011`

## Objective
Enforce existing Constitution/Work OS in the face of an approved UI Work with no actionable user-review URL. Prevent the unapproved local ZIP substitution.

## Authority and approval
P-001 — direct user approval 「これでいいお思う。じゃ修正よろしく」 (2026-10-11), immediately after the complete proposal. Implementation is authorized only for governance rules/tests and preview-work design; no main merge, hosting provider connection, Settings or deployment approval.

## Scope
Instruction dictionary typed review semantics, Work System, Change Protocol, proposal/Work/verification templates, repository governance validator, independent record-audit tests, CI invocation, Work/Decision/Lesson records.

## Do Not Touch
`main`, original math/physics `src/`, `e2e/`, `public/`, content, Constitution, published Pages, existing PR #53–#57, old Paul repo, GitHub Settings.

## Review Delivery
Review Type: CODE
Required artifact: Draft PR with exact governance diff and CI evidence
Delivery route: isolated PR, not app URL
User review readiness: awaiting CI and scope audit

## Current Step
Implemented on isolated branch, VERIFYING (not DONE).
## Dependencies
PR #55 has overlapping governance files; merge order requires conflict audit and independent user approval. W-PREVIEW-001 remains PROPOSAL-ONLY.
## Next Step
Run CI and audit changed paths; provide PR link; STOP before merge or preview deployment.
## Completion Condition
Tests PASS, review records and errors preserved, original app untouched; review only via PR.

# W-GOV-008 Verification
Status: PARTIAL-PASS — HUMAN REVIEW / MERGE NOT AUTHORIZED

## V-001 — Diff / protected-source isolation
Result: PASS (2026-10-11).
Evidence: GitHub compare main be98aa0dc2c4f29d5bfb33e2295bbb9063099e33...W-GOV-008 branch; only original governance/work-template/workflow files and new specific policy/tests/Work/memory records. No `src/`, `e2e/` or `public/` paths. PR #55 overlap: only `.github/workflows/repository-governance.yml`; PR #57 overlap: zero. Future merge conflict review remains PENDING.

## V-002 — Existing governance check
First PR #58 run 38109985567: FAIL. Existing exact `Status:` parser rejected descriptive text in W-GOV-008 P-001 and W-PREVIEW-001 cover. Recorded; original validator remained unchanged.
Second run 38110031112: PASS after restoring canonical status syntax.
Third run 38110098436: PASS after separating recordComplete from userReviewReady.
The prior failures are not erased.
Run links:
https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38109985567
https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38110031112
https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38110098436

## V-003 — New positive/negative record policy
Result: PASS on 38110098436, 17/17 node:test.
Actual cases: missing URL, PR/ZIP/local-only substitution, unapproved means/scope, missing plan, SHA mismatch, browser evidence missing/wrong SHA/failed assets, missing target commit; valid CODE and DOCUMENT records.
Important: even a complete evidence *record* sets `userReviewReady: false` until independent real browser checks and human review. This test never asserts an actual preview URL exists or validates consent.

## V-004 — Approval boundaries
Result: PASS for PR state/scope at comparison checkpoint. main remains be98aa0dc2c4f29d5bfb33e2295bbb9063099e33; original PRs #55/#57 open/unmerged; PR #58 is Draft/unmerged. No provider account connected, GitHub Settings changed or published app edited.

## V-005 — PR-specific deployed APP_UI
Result: NOT RUN / NO URL. W-PREVIEW-001 remains proposal-only; W-MATH-002 still awaiting actual link and user hands-on review.

## Remaining
Final CI on latest doc-only commit, user CODE review of PR #58 and separate explicit merge approval. Independent agent protocol compliance test is separate W-GOV-007 pending Work; not falsely claimed here.

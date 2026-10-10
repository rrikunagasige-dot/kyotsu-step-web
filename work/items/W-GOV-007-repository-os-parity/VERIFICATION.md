# Verification — W-GOV-007

Status: NOT-RUN

## V-001 — Proposal-only scope
Date: 2026-10-11
Target: target main `be98aa0dc2c4f29d5bfb33e2295bbb9063099e33` and new proposal branch.
Check: Only new `work/items/W-GOV-007-repository-os-parity/**` documents differ; no app, curriculum, Constitution, Work System, PR #53, or `main` edits.
Expected: 0 unexpected changed paths, no protected Git SHA changes.
Result: PENDING branch diff check.
Evidence: GitHub compare API / draft proposal PR.

## V-002 — Upstream parity baseline
Date: 2026-10-11
Target: old and new repository git trees and selected blob SHA.
Check: Six governance paths, eight subject paths, five Work templates, two navigation paths; record historic archived ADR/technical work rather than overwrite.
Expected: Links and status accurately recorded.
Result: CONFIRMED by read-only tree and file comparisons, but automatic future-PR enforcement still NOT-RUN.
Evidence: `PARITY_AUDIT.md`.

## V-003 — Proposed implementation acceptance
Date: 2026-10-11
Target: R0–R5 in P-001.
Check: README entrypoint, unchanged protection, general PR pilot with negative and positive cases, fresh-agent recovery and QA.
Expected: All explicit acceptance criteria A–F, plus separate human merge approval.
Result: NOT-RUN — IMPLEMENTATION NOT APPROVED.

## V-004 — Separate irreversible gates
Date: 2026-10-11
Target: main merge, GitHub branch protection/rulesets.
Check: No action without separate exact user approvals.
Expected: Not touched.
Result: PENDING final PR/branch state confirmation.


## V-005 — Implementation preliminary checkpoint
Date: 2026-10-11
Target: Approved P-001 implementation feature branch.
Check: Existing root/subject app unchanged; approved proposal and scope blob identity preserved; independent new positive/negative tests pass; new PR advisory executes.
Expected: 0 out-of-scope changed files, original 455 tracked blobs preserved outside allowed list, no Constitution or curriculum changes.
Result: PENDING GitHub compare and CI.


## V-006 — First successful generic Work pilot
Date: 2026-10-11
Target: PR #55 head b144129394ff18e04bdc07dd0749b92436719eac, main be98aa0dc2c4f29d5bfb33e2295bbb9063099e33.
Check: Existing governance plus scope/approval tests and actual PR cross-Work audit.
Expected: No policy test failures, humanApprovalVerified=false, approved scope only.
Result: PASS for static PR checks. 21/21 tests PASS; real Work decision SCOPE_PASS_HUMAN_REVIEW_REQUIRED with zero errors.
Evidence: https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38073085840

## V-007 — Protected original Git blob comparison
Date: 2026-10-11
Target: original target main 455 blobs compared to PR #55 b144129394ff18e04bdc07dd0749b92436719eac.
Check: Zero unapproved deletions, no unexpected file edits/additions, 4 mode source unchanged.
Result: PASS. 455 originals all still present; 446 SHA-identical including all protected 406/406; only 9 OS routers/README/workflow/memory changes within approved P-001. New docs/tests are new approved paths.
Evidence: GitHub recursive tree comparison; compare API PR #55. Main remains original.

## V-008 — Fresh-agent drill limitations
Date: 2026-10-11
Result: Static recovery-route Node checks PASS 5/5; independent, context-free second AI has NOT been invoked. Do not claim a true live fresh-Agent read trace is proven. See `RECOVERY_DRILL.md`.

## V-009 — Product verification on exact feature head
Date: 2026-10-11
Result: PENDING new GitHub Actions full released-mode regression (target typecheck, targeted tests, build, representative mobile+desktop E2E). Original source unchanged; previous Work PR #53 does not alone substitute for PR #55 observed CI.


## V-010 — Published-mode regression succeeded on implementation checkpoint
Date: 2026-10-11
Target: PR #55 code/evidence checkpoint `0a7026ee0f7354af3aa34100d47df260073d793d`.
Check: Existing governance + universal Work advisory + published Math/Physics app smoke in separate CI jobs.
Result: **PASS for all 3 jobs**. Original governance 0 errors; Work policy / route **21/21 PASS**; actual PR diff decision `SCOPE_PASS_HUMAN_REVIEW_REQUIRED` and `humanApprovalVerified=false`. App original typecheck PASS; 18 targeted unit files **202/202 PASS**; original production build PASS; representative Math/Physics mobile/desktop E2E **12/12 PASS**; Physics practice original problem guided image E2E **2/2 PASS**.
Evidence: https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38073231132
Limitation: Full pre-existing lint/unit/E2E diagnostic debt was not rerun in this Work; old known lint 24 errors, full unit 2 failures, obsolete E2E 4 failures remain not fixed. No claims of global QA green. No user hands-on lesson acceptance implied.

## V-011 — Safety and authorization at handoff
Date: 2026-10-11
Target: main `be98aa0dc2c4f29d5bfb33e2295bbb9063099e33`, implementation feature branch PR #55.
Result: No protected content changes; 406/406 original protected Git blobs exact. P-001 and SCOPE blob hashes match approval record. Existing repo main unchanged. Proposal Draft PR #54 and prior Draft PR #53 both preserved. No merges, branch Settings changes, force pushes, or old app modifications.
Remains PENDING: an **independent context-free AI session** exercising full 「憲法から」 path; not provable by the included five static recovery-route tests. General all-PR pilot is advisory, not GitHub-enforced merge protection.

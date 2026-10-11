# W-MATH-002 — Verification

Status: CODE-QA-PASS / USER-REVIEW-PENDING
Date: 2026-10-11

## V-001 — Repo provenance
Check: target repo ID 1391122224, live main `be98aa0dc2c4f29d5bfb33e2295bbb9063099e33`, unrelated Paul repo read-only.
Result: PASS (actual GitHub metadata and branch API).

## V-002 — Evidence traceability
Check: practice renderer and explicit target/dependency registry; textbook grouping/reveal/rendering; math source and QA behavior; student-mode authority and difference between published and review.
Result: PASS for static read-only comparison. No runtime behavioral test newly executed; behaviors inferred from current implementation and existing cited tests.

## V-003 — No implementation
Check: new branch must add only `work/items/W-MATH-002-textbook-ui-compression/**` documents relative to main; no existing source / original mode / app changes.
Result: PASS on initial proposal PR #56 commit `510bfaa12f870aac04725ef91a22d7671fcd861a`: exactly five new Work files; no original file changes, no deletes. GitHub Repository Governance Check run 38103507520 SUCCESS. Follow-up records-only commit requires a fresh run before exact-head PASS.

## V-004 — Proposed implementation
Check: the seven QA areas in `PROPOSAL.md`.
Result: IMPLEMENTATION IN FEATURE BRANCH / TESTS PENDING. PR #56 remains a pure proposal. No main merge/Settings approval.

## V-005 — Authorization
Check: no approved math textbook compact UI proposal exists in current Work; user authorized analysis/proposal only.
Result: P-001 approved for implementation only via direct user reply 「いいと思う」. SHA anchors stored in `APPROVAL_P-001.md`. Main merge and Settings not authorized.

## V-006 — First implementation CI
Date: 2026-10-11
Commit: `05d61db9680490d77cba3c83a971b5fa5d3b3cc1`
Result: PARTIAL. Governance Check [38104372096](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38104372096) PASS; independent Math Practice pilot [38104372103](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38104372103) PASS; Math textbook CI [38104372113](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38104372113) **FAIL** at mobile Playwright (8 failed, 6 flaky, 17 passed) after its typecheck/unit/build steps succeeded. Root cause isolated to common E2E helper invoking math-sets-only next-stage control on review units or before the reader had mounted. Fix staged, repeat CI required.

## V-007 — Latest exact implementation code SHA (2026-10-11)
Code head: `66a24ea41951af99459435bc1198c256c360d0e7`
- **PASS** Repository Governance Check https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38104661477
- **PASS** Math Practice pilot https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38104661486 (36 mobile + 36 desktop).
- **PASS** Math Textbook https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38104661479 (11 explicit Vitest files, **110/110** cases; typecheck and production build; **31/31** mobile textbook, **31/31** desktop textbook; **13/13** Physics Chapter 1 regression; **36/36** Math Practice setup regression).
- Math-sets new stage progression/compact card/expand/cursor/keyboard assertions were in the complete textbook E2E file and passed in both browser projects.
- Standalone `presentation.test.ts` **not run by this workflow's enumerated Vitest command**, so do not label it Vitest PASS. Runtime partition coverage and E2E did run.
- Baseline Git diff: 455 original blobs, 451 unchanged; four allowed original UI/CSS/test files changed; no original source data/figures/canonical mother/Constitution changed. 162 original curriculum/governance protected blobs same Git SHA. Nine new files only within P-001 scope, zero unexpected deletions or additions.
- **PENDING** user's hands-on judgement and separately authorized merge/release. This Work stays VERIFYING; no public app is updated by the Draft PR.

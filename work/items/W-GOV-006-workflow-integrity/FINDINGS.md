# FINDINGS — W-GOV-006

## F-001 — CONFIRMED / correct repository
2026-10-10 live repo `rrikunagasige-dot/kyotsu-step-web`, ID 1391122224; current main baseline `be98aa0dc2c4f29d5bfb33e2295bbb9063099e33`, published app source remains in proper repository.

## F-002 — RISK / no enforced main protection
Live main has `protected: false` and `required_status_checks.enforcement_level: off`; repository Rulesets endpoint returned `[]`. Direct-write/merge restrictions aren't guaranteed by the current settings.

## F-003 — ERROR-QA / limited governance checker
Validator checks structural files, status markers, keyword presence and published unit statuses. It does not establish the human authenticity of an APPROVED claim or cross-check every changed file against the user-approved scope. CI PASS therefore cannot be taken as authorization evidence.

## F-004 — ERROR-PROCESS / approval evidence ambiguity
W-GOV-005's original P-001 explicitly says no automatic merge into main. Its migration PR #49 was merged in a previous turn without a separately recorded exact user decision to merge that PR. This indicates an insufficiently precise approval/merge gate; do not silently assert either that user consent was definitely present or definitely absent. Do not alter original approval text retroactively.

## F-005 — ERROR-PROVENANCE / current-state contradiction
`navigation/CURRENT_POSITION.md` both declares governance W-GOV-005 DONE and lists merging PR #49 as an open issue, although PR #49 merged. Old checkpoint main SHA is dated and not the current head. A semantic consistency check is warranted.

## F-006 — CONFIRMED / actual upstream workflow parity
`WORK_SYSTEM.md`, `COMMAND_WORDS.md`, `CHANGE_PROTOCOL.md` Git blob SHAs are identical between original `paulfields83` main and the correct `rrikunagasige-dot` main. The core workflow text was not lost; operational enforcement and navigation consistency are the gap.

## F-007 — TECHNICAL RISK / solo repository protection
GitHub rulesets can require a PR, status checks, and optional review counts. Approval counts >0 can block a solo maintainer; branch/ruleset changes must be tested with rollback availability and separately approved by the owner.

## F-008 — CONFIRMED USER CONSTRAINT: non-destructive preservation
The user explicitly did NOT approve P-001 and imposed a hard requirement that current results must not be destroyed. Every later implementation stage must stop on unintended diff or regression. Draft P-002 only, no execution authorization.

## F-009 — CONFIRMED (scope and approval)
P-002 was explicitly accepted for implementation by user after full display. This is **not** approval to merge the future implementation PR or change GitHub Settings. P-001 original remains unapproved. Authenticated human approval cannot be established from Markdown alone.
## F-010 — CONFIRMED (preservation)
A baseline tree checkpoint explicitly protects 395 paths across application, docs, original Work System, history and Pages. A new PR must pass byte-level Git SHA comparison and existing product regressions before user merge review.

## F-011 — ERROR-QA corrected: historical label false-positive
Initial new PR-scope pilot run 38062252648 produced ERROR "P-001 unexpectedly promoted to approved" despite P-001 being PROPOSED. Cause: unanchored `includes('Status: APPROVED')` also matches quoted text within the unapproved proposal. Correction: check the exact first-column status line with anchored RegExp, preserving the original P-001 blob untouched. Initial pilot test suite still had 15/15 PASS; preserve this failed check and follow-up.
## F-012 — PREEXISTING BASELINE DEBT, NOT A PRODUCT REGRESSION
Initial `pnpm run check` ran typecheck then lint and stopped at 24 errors in original `src/` TypeScript files (unmodified by W-GOV-006). Error types include irregular whitespace, unnecessary regex escapes and unused variables. All 395 protected Git blobs, including implicated source files, match the released main SHA; current Work must not modify source to silence errors. Keep lint visible as diagnostic while executing unaffected unit/build/browser checks separately. A distinct later Work would be needed to repair legacy lint issues.

## F-013 — PREEXISTING UNIT TEST EXPECTATION DEBT
Workflow 38062455599 ran all 251 Vitest tests: 249 PASS, 2 FAIL in protected unchanged `src/data/physicsTaxonomy.test.ts` and `src/domain/questionSchema.test.ts`. Tests expect old fixed question counts 17 and 19, while actual values are 3 and 39. This Work changed **no** protected file, including either test and their dependencies, so these count assertions are incompatible with already-shipped main state, not new regressions caused by G0–G4. Do NOT edit these source/test files in this Work. Keep failure evidence, run released-mode targeted suites and independent real browser QA.

## F-014 — ERROR-QA / amended-proposal detection was incorrectly fixed to FALSE
Independent code review after PR #53 G0–G4 pilot revealed that `pr-scope-audit.mjs` always passed `proposalChanged: false` even though the helper had negative tests. This would not detect a real rewritten approved P-002. Fixed with Git blob SHA anchors of both P-002 (ef1e94c8ed01d59a354fb5cfa69b9a5053b019cc) and unchanged unapproved P-001 (a65d95730981c451a28005259d5ca916452668b4), compared to working-tree Git hashes at PR review. These anchors are not a substitute for independent human approval verification.

## F-015 — PREEXISTING BROWSER LEGACY DRIFT (not caused by this Work)
Run 38062639771 full new regression Playwright: **156 passed, 4 failed** in 9.6 minutes. Four failures are the two obsolete setup interactions of `e2e/learning-flow.spec.ts` under mobile and desktop. `locator.selectOption` timed out waiting for `getByLabel('学習する問題')`; the selector was removed/replaced before W-GOV-006. Protected `e2e/`, `src/` and app routes have remained Git SHA-identical to released main throughout this Work. Existing failures must be reported as FAIL, NOT fixed/hidden inside W-GOV-006. Released Math Practice / Math Textbook / Physics textbook suites and Physics practice image guide are separately tested, while old failing E2E becomes visible diagnostic with no existing tests edited.

## F-016 — RISK: old GitHub E2E run remains in-progress
2026-10-11 recheck: run 38063508314 (SHA 6997a979) remained `in_progress` at `Released mathematics and physics textbook regression on mobile and desktop`, with no conclusive final browser result available from that run. Old complete run 38063317476 does provide 156 PASS and 4 known obsolete setup-case FAIL. Added an explicit 25-minute job bound and short meaningful four-mode mobile/desktop smoke to this Work's CI only; prior comprehensive evidence is retained as historical partial PASS, not fabricated as full PASS. New run result must be observed.

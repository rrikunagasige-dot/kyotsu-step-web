# Findings — W-GOV-008

## F-001 — 2026-10-19 JST
Type: ERROR-PROCESS
Statement: Giving only PR #92 or a Codespaces command sequence as user acceptance work contradicts the user's required one-tap app check. WORK_SYSTEM §12A allowed PR/branch fallbacks for acceptance.
Evidence: direct user feedback, old canonical §12A and command handoffs.
Impact: technical review link mistakenly treated as an adequate user interface.
Corrective rule: the app preview direct-link / verification gate is now canonical §12A.
Promote to Lesson: YES, docs/MASTER_APP_LESSONS.md §54.

## F-002 — 2026-10-19 JST
Type: ERROR-PROVENANCE / ERROR-QA
Statement: An existing GitHub Pages app from main cannot demonstrate the seven new PR #92 holes while its draft head is unmerged.
Evidence: PR #92 draft metadata (head cb726d843263c645bfa08891cc5cef7375a82f8d), current main 154a16ff379321016f4692bb0ac6fe9a8a596214, main-only Pages workflow.
Impact: misleading acceptance request if old app link is presented as changed app.
Corrective rule: check exact SHA and expected new IDs/revision before review readiness.

## F-003 — 2026-10-19 JST
Type: CONFIRMED
Statement: The actual app uses HashRouter, sequential TextbookReadingFlow, Zustand persisted progress and base /kyotsu-step-web/. A safe review route must be build-gated, reuse real renderer, and isolate answers.
Evidence: src/main.tsx, src/pages/TextbookUnitPage.tsx, src/domain/textbook.ts, src/stores/useAppStore.ts, vite.config.ts.
Impact: design uses an independent preview route, isolated React state and build base override.

## F-004 — impact set audit, 2026-10-19 JST
Origin: F-001; root cause: PR fallback without exact-app deep link.
- W-MATH-005/P-002 PR #92 N01 Q07 / N03 Q10: CONFIRMED; currently unreviewable via old Pages; first pilot.
- Existing N09 / N12 and N02 creation/correction handoffs: UNVERIFIED for same specific user navigation; no new learner-code defect inferred.
- All future approved Math/Physics Textbook/Practice creation and correction user-review handoffs: same common *process* risk; normative §12A applies uniformly. Individual deep links require later unit-specific evidence.
- No additional lesson source or unrelated student mode silently modified by this audit.

## F-005 — 2026-10-19 JST
Type: RISK
Statement: Hosting provider authorization, public exposure, privacy and potential cost have not been granted.
Impact: do not connect accounts/deploy; code-only branch is not USER-REVIEW-READY.
Corrective rule: ask separately, keep user acceptance pending.

## F-006 — 2026-10-19 JST
Type: ERROR-QA
Statement: Governance CI enforces literal legacy §12A headings/fallback phrases, so an approved policy correction legitimately failed the inherited validator until its checks are migrated.
Evidence: GitHub run 39190305363 (5 errors for old section strings and Work Status).
Impact: false CI failure from stale assertions, but it correctly exposed a malformed new Work status.
Corrective rule: change assertions to enforce stronger direct-app readiness contract and keep Status on its own canonical line; rerun.

## F-007 — 2026-10-19 JST
Type: ERROR-QA
Statement: The updated validator assumed plain literal PASS / 要修正, but the template correctly uses bold Markdown around the two reply words, producing one more false failure.
Evidence: governance run 39190577614, one error.
Corrective rule: check the two actual display phrases separately, not a non-rendered combined literal.

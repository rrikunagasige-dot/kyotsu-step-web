# Quality Gates — rriku Juku target

Status: CANONICAL-CANDIDATE
Updated: 2026-10-10

The original upstream gate is preserved under `history/imports/paulfields83-20261010/quality/QUALITY_GATES.md`. This target has **no upstream backend**, so do not run or require fictitious backend checks.

1. **Governance**: `node tools/repo-governance-check.mjs`; verify identity, mode authority, Work states, provenance, no overwritten existing files.
2. **Typecheck/lint/test/build**: `pnpm check` using the existing target package scripts.
3. **E2E/browser**: `pnpm test:e2e` and representative mobile/desktop checks; `pnpm check:all` as full regression where available.
4. **Math Practice**: source fidelity 87–120, existing `docs/MATH_PRACTICE_MASTER_LESSONS.md`, current-target, previous-result use, no answer/figure leakage, Japanese/Chinese parity.
5. **Physics Textbook**: Chapter 1 mother/source, meaningful formula holes, interactive figures, 3-chunk title mapping, stable IDs, mobile, prior sections visible.
6. **Math Textbook**: correct mother Word; published vs draft/review units separate; no accidental review-unit release.
7. **Work completion**: VERIFICATION including actual observed results and memory close, plus live app/PR/branch review link. No false PASS.

The imported workflow check must not mutate any app/runtime code and is executed independently of `pnpm` when dependencies aren't installed. QA not actually run is **PENDING**, not PASS.

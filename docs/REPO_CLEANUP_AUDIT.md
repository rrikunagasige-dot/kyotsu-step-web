# Repository Cleanup Audit

Status: **PHASE 1 APPLIED / PHASE 2 CANDIDATES RECORDED**

Date: 2026-10-01

Authority:
- `docs/REPO_CLEANUP_POLICY.md`
- `docs/MASTER_APP_LESSONS.md`
- `main`

---

## 1. Why cleanup was needed

Repository inspection found multiple generations of work living side by side:
- current main implementation,
- historical prototypes,
- old branch-specific CI,
- rejected generated figure guides,
- legacy per-unit textbook files,
- old version-labelled filenames,
- many backup/chatgpt branches,
- stale README status text.

This creates a real risk that a future AI selects the wrong implementation or resurrects a rejected design.

---

## 2. Phase 1 — safe deletions

Phase 1 only removes files whose status is already unambiguous.

### Obsolete branch-specific workflows removed from main

These workflows target historical `chatgpt/*` branches and are not current main CI:

- `.github/workflows/physics-ch01-ci.yml`
- `.github/workflows/physics-ch01-full-gate.yml`
- `.github/workflows/physics-ch01-questionbank-ci.yml`
- `.github/workflows/physics-taxonomy-ci.yml`
- `.github/workflows/physics-textbook-catalog-ci.yml`
- `.github/workflows/textbook-reader-repair-ci.yml`

Current Pages/main workflow remains:
- `.github/workflows/deploy-pages.yml`

### Rejected generated guide assets removed from main

Current Chapter-1 figure authority explicitly forbids synthetic guide/confirmation/graph replacements.

Removed:
- `public/assets/physics/textbook/ch01/guides/acceleration-trajectory-guide.svg`
- `drag-stages-guide.svg`
- `gravity-air-resistance-guide.svg`
- `position-displacement-guide.svg`
- `rain-bicycle-guide.svg`
- `relative-cars-guide.svg`
- `secant-to-tangent-guide.svg`
- `terminal-velocity-graph-guide.svg`
- `velocity-change-guide.svg`
- `velocity-components-confirmation.svg`
- `velocity-components-guide.svg`
- `vt-derivation-guide.svg`

Reason:
they are rejected/non-live derived artifacts, not canonical source.

Git history preserves recoverability.

---

## 3. Phase 1 documentation cleanup

Applied:
- created project-wide cleanup policy,
- created docs index,
- corrected README source-status language,
- corrected README_FIRST stale branch language,
- connected cleanup policy from master lessons/workflow.

---

## 4. Phase 2 candidates — DO NOT DELETE YET

These are suspicious/stale but require a focused reference audit before deletion/rename.

### Legacy code candidates
- `src/data/textbook/ch01/1a-displacement-velocity.ts`
- `1b-velocity-composition.ts`
- `1c-relative-velocity.ts`
- `1d-acceleration.ts`
- `1e-horizontal-projectile.ts`
- `1f-oblique-projectile.ts`
- `1g-gravity-drag-terminal-velocity.ts`

Current live index imports `v22Continuous.ts`, so these look legacy, but Phase 2 must verify no direct test/tool dependency.

### Legacy asset candidates
- `public/assets/physics/textbook/a-displacement/*`
- `public/assets/physics/textbook/ch01/1g/gravity-air-resistance.webp`
- `public/assets/velocity-graph.svg`

Need exact reference audit before removal.

### Rename candidates
- `src/data/textbook/ch01/v22Continuous.ts`
  → version-neutral current name
- `e2e/p39-v22-smoke.spec.ts`
  → version-neutral current name

These are live, so rename must be atomic with imports/workflows.

### Historical prototype organization
- `CH1_LEARNING_TEXT_V2.md`
- `CH1_LEARNING_TEXT_V2_1.md`
- current `CH1_LEARNING_TEXT_V2_2_FORMULA_HOLES.md`

Need separate decision:
- keep historical versions under `prototypes/archive/`
- rename current source to version-neutral authority only after content stabilizes.

### Branch cleanup candidates
Many `chatgpt/*` and `backup/*` branches remain.

Do not delete blindly.
First compare against main and preserve:
- source-archives
- necessary recovery snapshots
- any genuinely unmerged work

Then prune obsolete working branches.

---

## 5. Not part of cleanup

Cleanup must not change:
- learning content,
- hole placement,
- canonical figure meanings,
- pedagogy,
- answer logic,
- learner-visible behavior

unless the user separately requests such a change.

Repository hygiene and pedagogy changes should remain separable.

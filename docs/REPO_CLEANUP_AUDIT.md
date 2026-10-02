# Repository Cleanup Audit

Status: **PHASE 1 + PHASE 2 CONTENT CLEANUP APPLIED**

Date: 2026-10-02

Authority:
- `docs/REPO_CLEANUP_POLICY.md`
- `docs/MASTER_APP_LESSONS.md`
- `main`

## Phase 1

Previously completed:
- obsolete branch-specific workflows removed,
- rejected generated guide assets removed,
- cleanup policy and docs index established.

## Phase 2 — applied

### Dead Chapter-1 implementations removed

Removed legacy per-unit TypeScript implementations:
- `src/data/textbook/ch01/1a-displacement-velocity.ts`
- `1b-velocity-composition.ts`
- `1c-relative-velocity.ts`
- `1d-acceleration.ts`
- `1e-horizontal-projectile.ts`
- `1f-oblique-projectile.ts`
- `1g-gravity-drag-terminal-velocity.ts`

The live implementation is now only:
`src/data/textbook/ch01/chapter1Continuous.ts`

### Dead assets removed

Removed unreferenced legacy assets:
- `public/assets/physics/textbook/a-displacement/*`
- `public/assets/physics/textbook/ch01/1g/gravity-air-resistance.webp`
- `public/assets/velocity-graph.svg`

Canonical Chapter-1 assets under `public/assets/physics/textbook/ch01/` remain untouched.

### Version-neutral live names

Renamed:
- `v22Continuous.ts` → `chapter1Continuous.ts`
- `p39-v22-smoke.spec.ts` → `chapter1-learning-smoke.spec.ts`
- `CH1_LEARNING_TEXT_V2_2_FORMULA_HOLES.md` → `CH1_LEARNING_TEXT.md`

Live code/workflow/docs references were updated atomically.

### Historical prototype organization

Moved historical checkpoints to:
`docs/physics-ch01/prototypes/archive/`

Current prototype README now points only to the version-neutral live authority.

## Still intentionally deferred

Branch pruning remains a separate audit.

Do not delete `source-archives`, `backup/*`, or `chatgpt/*` blindly. First verify that no unmerged source/recovery value exists.

## Cleanup invariants

This cleanup must not change:
- learner-visible content,
- hole placement,
- answers,
- figure meanings,
- pedagogy,
- routes/progress IDs.

Required final gate:
typecheck → data/math tests → Chapter-1 browser smoke → production build → Pages deploy.


## Verification

Validated code/content HEAD:
`3c2af67c667b6b916790f3e9c8f34ecb4702ff36`

GitHub Actions:
- run 265
- conclusion: SUCCESS

PASS:
- Typecheck
- Chapter 1 audited data and math gate
- Chapter 1 audited browser smoke
- Production build
- GitHub Pages deploy

Repository state after Phase 2:
- live Chapter-1 parser has a version-neutral name,
- live Chapter-1 source has a version-neutral name,
- live Chapter-1 browser test has a version-neutral name,
- legacy per-unit Chapter-1 implementations are gone,
- unreferenced legacy assets are gone,
- historical text checkpoints are isolated under `prototypes/archive/`,
- current docs point to current authority,
- learner-visible content and stable unit/progress IDs were not changed.

Branch pruning is intentionally deferred to a separate merge/recovery audit.

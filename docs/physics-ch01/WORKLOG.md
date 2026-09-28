# Physics Chapter 1 Worklog

## 2026-09-28 — workspace migration

### Repository state

- upstream source: `paulfields83/kyotsu-step-web`
- working fork: `rrikunagasige-dot/kyotsu-step-web`
- working branch: `chatgpt/physics-ch01-textbook-v2`
- fork preserves upstream repository history and current main.

### Read before work

- README.md
- WORKFLOW.md
- docs/ARCHITECTURE.md
- src/domain/textbookSchema.ts
- src/pages/TextbookUnitPage.tsx
- src/pages/LearningSetupPage.tsx
- src/data/textbookUnits.ts
- src/data/textbookUnits.test.ts
- e2e/textbook-flow.spec.ts

### Source packet available in conversation

- current upstream repository ZIP
- 第1〜5章教材 mother-template ZIP
- figure.zip
- Chapter 1 figure set 1–17

### Current findings

- current app has one built-in textbook unit: `physics-a-displacement-velocity`
- current textbook schemaVersion is 1.0
- current UI already supports sequential sections and persisted progress
- current completion copy hard-codes `A 変位と速度` and `78`
- current figure rendering is plain image rendering with no answer-mask overlay
- current choice generation can fall back to answers from other items in the same unit
- current data is concentrated in `src/data/textbookUnits.ts`

### Decisions

- retain existing textbook state machine
- introduce schemaVersion 1.1 rather than silently changing 1.0 semantics
- 1A becomes the V2 golden unit before importing 1B–1G
- Figure V2 uses one source image plus percentage overlay metadata
- V2 published items use explicit distractors
- chapter 1 data will be split by unit

### Next

P01 implement Textbook Schema 1.1.


## 2026-09-28 — P00/P01 moved to GitHub

### P00

- fork created at `rrikunagasige-dot/kyotsu-step-web`
- working branch created: `chatgpt/physics-ch01-textbook-v2`
- `CHATGPT_README_FIRST.md` committed
- master fire diagram committed
- source manifest committed
- this worklog committed

### P01 implementation

Committed:
- `src/domain/textbookSchema.ts`
- `src/domain/textbookSchema.test.ts`

Added:
- schemaVersion `1.1`
- chapter metadata
- semantic section roles
- Figure V2 overlay metadata
- overlay reference/bounds validation
- explicit-choice requirement for published V2 items
- source-page ordering validation
- V2 schema tests

### Gate status

`P01 = IMPLEMENTED / UNVERIFIED`.

The current sandbox cannot download pnpm dependencies, so no PASS claim is recorded yet. The next validation opportunity must run typecheck/unit tests before P01 is promoted to PASS.

### Next node

P02: chapter/unit metadata and learning setup navigation.


## 2026-09-28 — P01 gate PASS

GitHub Actions run `36333501024` completed with conclusion `success`.

Passed:
- dependency install
- TypeScript typecheck
- ESLint
- Vitest unit tests
- production build

During the first CI attempt, ESLint exposed a pre-existing irregular full-width-space literal in `src/domain/textbook.ts` and the same pattern in the new schema. Both were normalized to `\u3000`, then CI passed.

P01 status is now `PASS`. Next node: P02.


## 2026-09-28 — P02/P03/P04 PASS

### P02 chapter/unit structure

Implemented:
- chapter metadata on current 1A without changing its stable `unitId`
- `groupTextbookUnitsByChapter()`
- chapter → unit card navigation on `LearningSetupPage`
- unit progress shown per card
- dynamic textbook page heading
- removed hard-coded completion text `A 変位と速度 / 78`
- section navigation wording corrected from "章" to "節"

### P03 Figure V2 renderer

Added:
- `src/components/textbook/TextbookFigure.tsx`
- percentage-coordinate overlays
- `mask` and `hotspot` rendering modes
- unresolved overlay opens the linked textbook item
- resolved overlay reveals the source image
- figure-overlay item IDs participate in subsection progression
- server-rendered component tests for unresolved/resolved mask state

The renderer is PASS. Actual Chapter 1 figure assets and 1A overlay coordinates are intentionally deferred to P05, where the real unit is migrated to schemaVersion 1.1.

### P04 data split

The old monolithic textbook data file was split into:

```text
src/data/textbook/
├─ index.ts
├─ chapterCatalog.ts
└─ ch01/
   └─ 1a-displacement-velocity.ts
```

`src/data/textbookUnits.ts` remains as a compatibility re-export, so existing repository imports do not break.

### CI / browser gate

Final passing run: `36334432650`.

PASS:
- dependency install
- TypeScript
- ESLint
- Vitest: 37 tests
- production build
- Playwright Chromium
- textbook E2E: 5 tests

Two issues were found by the newly enabled E2E gate before final PASS:

1. The app uses `HashRouter`, but textbook E2E still navigated to plain path routes. Tests now target `/kyotsu-step-web/#/...`.
2. Inline answer buttons exposed a combined accessible name containing their numeric index. `aria-label={choice}` now gives the answer choice a clean accessible name and restores exact accessible selection.

### Next

P05: migrate real 1A data to schemaVersion 1.1, add explicit pedagogical distractors, replace the old figures with the supplied Chapter 1 figures, and attach real Figure V2 masks.


## 2026-09-28 — P05/P06 1A golden unit PASS

### P05 — 1A migration

1A is now the Chapter-1 golden unit / 母版2.0.

Implemented:
- `schemaVersion: 1.1`
- revision bumped to 3
- stable unitId preserved: `physics-a-displacement-velocity`
- all 78 existing stable item IDs preserved
- semantic section roles attached
- explicit pedagogical distractors for every published item
- supplied Chapter-1 figures 1–4 converted to app WebP assets
- Figure V2 percentage masks attached to answer-bearing labels
- example-1 wording aligned to the supplied P/Q/R curve figure
- source/app asset mapping recorded in `SOURCE_MANIFEST.md`
- unused synthetic redraw assets removed once the supplied-source assets were available

App assets:
- `position-vector-displacement.webp`
- `average-instantaneous-velocity.webp`
- `curve-velocity-directions.webp`
- `displacement-components.webp`

### P06 — regression/browser audit

Final passing GitHub Actions run: `36335812301`.

PASS:
- TypeScript
- ESLint
- Vitest: 14 files / 37 tests
- production build
- Playwright Chromium
- textbook E2E: 6 tests

Browser coverage includes:
- chapter/unit hierarchy
- sequential subsection unlocking
- wrong first choice remains visible and correct answer is revealed
- inline choice panel behavior
- real 1A figure asset load
- figure overlay mask opens the linked item
- correct figure answer removes the mask
- persisted progress survives reload and keeps the answered mask resolved

### Failures caught before PASS

The work was not marked complete when intermediate CI failed.

1. A superseded choice table remained unused after distractor refactoring.
2. Concurrent migration edits briefly duplicated `role` keys and production build correctly rejected them.
3. The old wrong-choice E2E expected a distractor that had changed under the curated-choice design.
4. Seeding `localStorage` did not update the live Zustand store when navigation changed only the HashRouter fragment; the browser test now reloads once to rehydrate persisted progress.
5. A figure-overlay-only answer has no inline `resolved-*` element, so the browser test now verifies mask removal and persistence after reload instead.

### Status

`P05 = PASS`  
`P06 = PASS`  
Next: `P07 — 1B 速度の合成と分解`.


## 2026-09-28 — P07 1B 速度の合成と分解 PASS

### Source audit

Read and cross-checked:
- original textbook PDF p.14–15
- supplied unit Word: `第1章_1B_速度の合成と分解.docx`
- supplied figures 5 and 6

Physics source confirms:
- ground-observed boat velocity is the vector sum of the water velocity and boat-relative-to-water velocity
- this operation is velocity composition
- `v_x = v cos θ`
- `v_y = v sin θ`
- `v = sqrt(v_x^2 + v_y^2)`
- vector subtraction is addition of the opposite vector and leads naturally into 1C relative velocity

### Implementation

Added:
- `src/data/textbook/ch01/1b-velocity-composition.ts`
- unitId: `physics-1b-velocity-composition`
- `schemaVersion: 1.1`
- revision 1
- source pages 14–15
- five semantic sections
- 18 source-aligned items
- explicit choices for every published item
- chapter ordering: 1A → 1B

Real supplied figure assets:
- `public/assets/physics/textbook/ch01/1b/velocity-composition.webp`
- `public/assets/physics/textbook/ch01/1b/velocity-components.webp`

Figure V2:
- `hotspot-d-1` connects the resultant/parallelogram-diagonal region to D-1
- figure 6 is used inferentially; no label mask is required for D-2

### Gate

Final passing GitHub Actions run: `36336610820`.

PASS:
- TypeScript
- ESLint
- Vitest: 14 files / 38 tests
- production build
- Playwright Chromium
- textbook E2E: 7 tests

The browser gate verifies:
- 1B appears beside 1A in Chapter 1
- selecting 1B routes to the correct unit
- concept section starts at `b-1`
- figure section remains locked until concept completion
- seeded completion unlocks the figure section
- the supplied composition figure loads with nonzero natural width
- the D-1 Figure V2 hotspot is visible

### Intermediate correction

An intermediate CI run failed because the domain chapter-order test still expected only `['1A']`. This was updated to `['1A','1B']`; P07 was not marked PASS until the final full gate succeeded.

### Status

`P07 = PASS`  
Next: `P08 — 1C 相対速度`.


## 2026-09-28 — P07 1B 速度の合成と分解 PASS

### Source normalization

Authority checked before implementation:
- original textbook p.14–15
- supplied 1B Word pedagogical reconstruction
- supplied figure 5 and figure 6

The unit keeps the source's educational roles rather than forcing 1A's exact paragraph count.

### Implemented unit

Added:
- `src/data/textbook/ch01/1b-velocity-composition.ts`
- published catalog entry after 1A
- `schemaVersion: 1.1`
- `revision: 1`
- chapter metadata: 1B / order 2 / p.14–15
- 18 source-aligned items
- five semantic sections
- explicit per-item choices

Content:
- vector addition / velocity composition
- x/y decomposition
- `v_x=v cosθ`
- `v_y=v sinθ`
- `v=sqrt(v_x^2+v_y^2)`
- vector sum/difference bridge into 1C
- river-boat worked example
- 30 m/s, 30° component worked example
- final reconnection review

### Figures

Supplied source figures 5–6 are app assets:
- `public/assets/physics/textbook/ch01/1b/velocity-composition.webp`
- `public/assets/physics/textbook/ch01/1b/velocity-components.webp`

Figure 5 has a Figure V2 hotspot linked to `d-1`; figure 6 is a normal source figure because its current figure-reading question asks the geometric relation between the two component directions rather than a label already printed as the answer.

### Gate history

The first catalog commit correctly failed old tests that still assumed only one unit:
- built-in catalog length expected 1 but became 2
- chapter ordering expected only 1A

Those tests were updated to the intended authoritative state `['1A', '1B']` before PASS.

Intermediate unit/catalog gate `36336593147`: PASS.

Browser smoke gate `36336610820`: PASS.

A stronger mobile figure audit was then added. Final P07 gate:
`36336731539` — PASS.

Final evidence:
- TypeScript PASS
- ESLint PASS
- Vitest: 14 files / 38 tests PASS
- production build PASS
- Playwright Chromium PASS
- textbook E2E: 7 tests PASS

The final 1B browser test validates the supplied figure load, mobile hotspot bounds, D-1 answer flow, progression to figure 6, and persisted resolved state after reload.

### Status

`P07 = PASS`

Next node: `P08 — 1C 相対速度`.


## 2026-09-28 — P08 1C 相対速度 PASS

### Source audit

Checked against:
- original textbook p.16–17
- supplied `第1章_1C_相対速度.docx`
- supplied figures 7 and 8

Source-aligned core:
- relative velocity depends on the observer
- `v_{B/A}=v_B-v_A`
- same velocity / same direction gives relative velocity 0
- planar relative velocity is a vector difference
- bicycle/rain example uses `v_{R/C}=v_R-v_C`

### Implementation

Published:
- `src/data/textbook/ch01/1c-relative-velocity.ts`
- unitId: `physics-1c-relative-velocity`
- schemaVersion 1.1
- revision 1
- source pages 16–17
- orderInChapter 3
- 17 explicit-choice items

Source figures:
- `public/assets/physics/textbook/ch01/1c/relative-velocity-cars.webp`
- `public/assets/physics/textbook/ch01/1c/relative-rain-bicycle.webp`

Figure V2:
- figure 7 hotspot `hotspot-d-2` links the relative-velocity arrow to D-2
- figure 8 is used directly for the bicycle/rain worked example

### Catalog / navigation

Chapter order is now:
`1A → 1B → 1C`.

### CI strategy

P08 code, catalog, tests, CI policy, and both binary assets were committed as one checkpoint:
`d8c83b095de90f4606275c71d083b6a3ab1fee3f`.

The branch CI now ignores:
- `docs/**`
- `CHATGPT_README_FIRST.md`

This keeps docs-only bookkeeping from generating unnecessary CI emails.

### Gate

GitHub Actions run `36373169972`: PASS.

- TypeScript PASS
- ESLint PASS
- Vitest: 14 files / 39 tests PASS
- production build PASS
- textbook E2E: 8 tests PASS

### Status

`P08 = PASS`  
Next: `P09 — 1D 加速度`.

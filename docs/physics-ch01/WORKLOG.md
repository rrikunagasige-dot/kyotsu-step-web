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


## 2026-09-28 — P09 1D 加速度 PASS

### Source audit

Checked before implementation:
- original textbook p.18–19
- supplied `第1章_1D_加速度.docx`
- supplied figures 9 and 10

Source-aligned core:
- average acceleration is velocity-vector change per unit time
- `Δv = v₂−v₁`, `Δt=t₂−t₁`
- average acceleration points in the same direction as `Δv`
- instantaneous acceleration is obtained as the time interval tends to zero
- uniformly accelerated linear motion uses `v=v₀+at`, `x=v₀t+1/2at²`, `v²−v₀²=2ax`
- the equation of motion connects acceleration to resultant force through `m a⃗ = F⃗`

### Implementation

Published:
- `src/data/textbook/ch01/1d-acceleration.ts`
- unitId: `physics-1d-acceleration`
- schemaVersion 1.1
- revision 1
- source pages 18–19
- orderInChapter 4
- 17 explicit-choice items

Source figures:
- `public/assets/physics/textbook/ch01/1d/acceleration-trajectory.webp`
- `public/assets/physics/textbook/ch01/1d/velocity-change-acceleration.webp`

Figure V2:
- D-1 hotspot asks what the red `Δv` vector represents
- D-2 mask asks which vector determines the average-acceleration direction

### Gate and recovery

The already-complete P09 checkpoint `bd844d17775fb8f4dfd643735350c280d7cde4d8` passed GitHub Actions run `36373739501`.

A later redundant checkpoint accidentally changed the 1D asset naming while an older catalog assertion still expected the verified names. Run `36373943888` therefore failed one unit test. No 403 occurred.

The branch was restored with normal forward commit `10b48ecf138aeba7f4d97efea3632513ba324f7c`; no force push/history rewrite was used.

Final recovery gate `36374088777`: PASS.
- TypeScript PASS
- ESLint PASS
- Vitest: 14 files / 40 tests PASS
- production build PASS
- textbook E2E: 9 tests PASS

### Status

`P09 = PASS`
Next: `P10 — 1E 水平投射`.


## 2026-09-28 — P10 1E 水平投射 PASS

### Source audit

Checked before implementation:
- original textbook p.20–21
- supplied `第1章_1E_水平投射.docx`
- supplied figures 11 and 12

Source-aligned core:
- horizontal acceleration is 0
- `x=v₀t`
- vertical initial velocity is 0
- vertical motion is free fall / constant acceleration under g
- `y=1/2 gt²`
- `vₓ=v₀`, `vᵧ=gt`
- eliminating time gives `y=(g/2v₀²)x²`, so the trajectory is a parabola
- the worked example gives fall time 2.0 s from 19.6 m and horizontal range 29.4 m for 14.7 m/s

### Implementation

Published:
- `src/data/textbook/ch01/1e-horizontal-projectile.ts`
- unitId: `physics-1e-horizontal-projectile`
- schemaVersion 1.1
- revision 1
- source pages 20–21
- orderInChapter 5
- 16 explicit-choice items

Source figures:
- `public/assets/physics/textbook/ch01/1e/horizontal-projectile-strobe.webp`
- `public/assets/physics/textbook/ch01/1e/horizontal-projectile-velocity.webp`

Figure V2:
- D-1 hotspot reads the constant horizontal spacing
- D-2 hotspot reads the increasing vertical spacing
- figure 12 remains visible in the same reading subgroup, connecting the spacing observation to `vₓ=constant` and `vᵧ=gt`

### Gate history

Initial run `36374506994`:
- typecheck PASS
- lint PASS
- 41 unit tests PASS
- build PASS
- 9/10 textbook E2E PASS
- 1E E2E FAIL because figure 12 was structurally hidden by automatic section advancement after D-2 completion

Fix commit `f4adf0e9cde504be365746eee51c1764b4fe26be` kept figure 12 inside the same reading subgroup and audited it before completing D-2.

Final run `36374706122`: PASS.
- TypeScript PASS
- ESLint PASS
- Vitest: 14 files / 41 tests PASS
- production build PASS
- textbook E2E: 10 tests PASS

### Status

`P10 = PASS`
Next: `P11 — 1F 斜方投射`.


## 2026-09-28 — P11 1F 斜方投射 PASS

### Source audit

Checked before implementation:
- original textbook p.22–24
- supplied `第1章_1F_斜方投射.docx`
- supplied figures 13 and 14

Source-aligned core:
- `v₀x=v₀cosθ`, `v₀y=v₀sinθ`
- `x=v₀cosθ t`
- `y=v₀sinθ t−1/2gt²`
- highest point: `v_y=0`
- `t_H=v₀sinθ/g`
- same-height flight time `T=2v₀sinθ/g`
- range `D=v₀²sin2θ/g`
- maximum range at `θ=45°`

### Implementation

Published:
- `src/data/textbook/ch01/1f-oblique-projectile.ts`
- unitId: `physics-1f-oblique-projectile`
- schemaVersion 1.1
- revision 1
- source pages 22–24
- orderInChapter 6
- 19 explicit-choice items

Source figures:
- `public/assets/physics/textbook/ch01/1f/oblique-projectile-trajectory.webp`
- `public/assets/physics/textbook/ch01/1f/oblique-projectile-components.webp`

Figure V2:
- figure 14 prints the answer `v_y=0`, so `mask-d-1` hides it until D-1 is answered
- D-2 asks the inferred invariant `v_x` = constant rather than copying a printed label
- both supplied figures remain visible in the same reading subgroup before figure-reading completion

### Gate

Atomic checkpoint commit: `d42264ee3f34d83b782a7d780b4f570a035b0187`.

GitHub Actions run `36375222401`: PASS.
- TypeScript PASS
- ESLint PASS
- Vitest: 14 files / 42 tests PASS
- production build PASS
- textbook E2E: 11 tests PASS

### Status

`P11 = PASS`
Next: `P12 — 1G 重力加速度・空気抵抗・終端速度`.


## 2026-09-28 — P12 1G 重力加速度・空気抵抗・終端速度 PASS

### Source audit

Checked before implementation:
- original textbook p.25–27
- supplied `第1章_1G_重力加速度・空気抵抗・終端速度.docx`
- supplied `figure.zip` figures 15, 16 and 17
- supplied chapter package README and 1G source crop for cross-checking

Source-aligned core:
- gravity only: `m a⃗=m g⃗`, hence `a⃗=g⃗`
- low-speed proportional drag: `f=kv`
- downward-positive equation: `ma=mg-kv`
- `a=g-(k/m)v`
- air resistance grows with falling speed, so acceleration decreases
- terminal velocity occurs at `a=0`
- `mg=kv_t`, hence `v_t=mg/k`

### Implementation

Published:
- `src/data/textbook/ch01/1g-gravity-drag-terminal-velocity.ts`
- unitId: `physics-1g-gravity-drag-terminal-velocity`
- schemaVersion 1.1
- revision 1
- source pages 25–27
- orderInChapter 7
- 14 explicit-choice items
- five semantic sections matching the chapter's established learning flow

Source figures:
- `public/assets/physics/textbook/ch01/1g/gravity-air-resistance.webp`
- `public/assets/physics/textbook/ch01/1g/drag-force-stages.webp`
- `public/assets/physics/textbook/ch01/1g/terminal-velocity-graph.webp`

The three figures are all real supplied assets, not synthetic substitutes.

### Browser-gate correction

Initial implementation commit:
`1f633f56b13b9ee62149b9f5be10c17a3fd7e3cd`.

Run `36387765258`:
- typecheck PASS
- lint PASS
- 43 unit tests PASS
- build PASS
- 11/12 textbook E2E PASS
- 1G E2E FAIL

Cause:
figure 17 had been placed after a second reading heading, so the reading-state machine correctly hid that later subgroup until D-1 was resolved. The E2E exposed that the three comparison figures should stay together pedagogically.

Corrections:
- `320cd918ba6351b6ebad6992272ba9c33491c36a` adjusted the browser audit to the sequential reading behavior.
- `c3d73345b74bd4f54ad80a6fbc97783260b6ef81` kept figures 15–17 in one reading subgroup, matching the same presentation lesson learned in P10.
- run `36388027906` then passed all current gates.
- `5d3d92f03545a3291aab86ce4f45150844202a71` added a stronger start→finish test that answers all 14 1G items through the UI and verifies the unit-complete panel.

Final P12 gate: GitHub Actions run `36388191856` — PASS.
- TypeScript PASS
- ESLint PASS
- Vitest: 14 files / 43 tests PASS
- production build PASS
- Playwright Chromium PASS
- textbook E2E: 13 tests PASS
- dedicated 1G start→finish browser test PASS

### Status

`P12 = PASS`
Next: `P13 — Chapter 1 full gate (G11–G17)`.


## 2026-09-28 — P13 Chapter 1 full gate PASS / P14 finalization

### P13 — Chapter 1 full gate

Starting point:
- P12 1G was already PASS.
- Chapter 1 contained all seven units 1A–1G and supplied figures 1–17.
- P13 required the stronger chapter-wide gates G11–G17, including the repository's complete browser regression suite.

During the gate, several failures were caught rather than ignored:

1. The first 1G publication gate exposed an asset-name mismatch in static expectations.
2. A later 1G browser audit exposed a figure-visibility sequencing issue; figures 15–17 were kept together in the same reading subgroup.
3. The new full gate revealed that older E2E specs still navigated direct paths even though the application uses HashRouter with Vite base `/kyotsu-step-web/`.
4. Legacy learning E2E still assumed the removed guidance-level selector and the old self-check setup behavior.
5. Old admin and Chinese-locale assertions contained stale catalog counts/text.
6. The accessibility suite caught 42px mobile language/back controls; mobile controls were restored to the 44px minimum.
7. The language-switching test needed to close the active BottomSheet before clicking the header language switch.

The corrections were forward commits on `chatgpt/physics-ch01-textbook-v2`; no force-push was used.

Final verified code HEAD before docs-only P14:
`26e768ae9f314dba17121739179ea0c262c88845`

Final passing evidence:
- Physics Ch01 Full Gate `36408480283` — SUCCESS
- Physics Ch01 CI `36408480384` — SUCCESS
- TypeScript typecheck PASS
- ESLint PASS
- Vitest: 14 files / 44 tests PASS
- production build PASS
- Playwright: 42/42 tests PASS

Chapter-gate result:
- G11 PASS — 1A→1G order
- G12 PASS — chapter progress
- G13 PASS — all 17 figures
- G14 PASS — stable ID uniqueness/domain validation
- G15 PASS — `pnpm check`
- G16 PASS — complete Playwright suite
- G17 PASS — `pnpm check:all`

`P13 = PASS`

### P14 — control-document finalization

Updated:
- `CHATGPT_README_FIRST.md`
- `docs/physics-ch01/MASTER_FIRE_DIAGRAM.md`
- `docs/physics-ch01/WORKLOG.md`

No application behavior is changed by this node.

`P14 = PASS`

Chapter 1 V2 implementation is complete on `chatgpt/physics-ch01-textbook-v2`.

Next decision point:
- integrate/merge this completed branch according to the repository ownership policy, or
- start Chapter 2 with a fresh source audit and a new dependency/fire diagram before coding.


## 2026-09-28 — P15–P19 Chapter 1 question-bank import PASS

### Pre-work control audit

Before code changes, re-read:
- `CHATGPT_README_FIRST.md`
- `WORKFLOW.md`
- complete `docs/physics-ch01/MASTER_FIRE_DIAGRAM.md`
- current worklog
- `docs/taxonomy/PHYSICS_TITLE_GUIDE.md`

The import was added after the already-closed textbook P00–P14 line rather than rewriting those nodes.

### P15 — navigation correction

Previous taxonomy UI appeared directly on `ProblemsPage`, which inverted the intended hierarchy.

Corrected flow:

```text
問題
→ 学習設定
→ 問題を解く
→ 科目
→ 物理
→ 5領域 / 23分野
→ 問題
→ 学習開始
```

The taxonomy board now exists only inside physics practice setup. A physics topic must be selected before the question selector and start button become usable.

### P16 — common textbook → Question adapter

Added:
- `src/data/textbookPracticeQuestions.ts`

Rule:
- only `role='worked-example'` sections are imported,
- concept / figure-reading / review micro-items are not counted as separate question-bank questions,
- 2 examples per unit × 7 units = 14 questions.

Stable IDs:
- `physics-ch01-1a-example-q1` … `physics-ch01-1g-example-q2`.

Japanese questions reuse the source readingFlow where possible. Chinese questions keep the same grading identity while using Chinese guide text and translated answer labels. Both catalogs pass the existing bilingual parity gate.

### P17 — classification and dedup audit

All 14 imports:
- subject = physics
- majorUnit = mechanics
- minorUnit = motion
- status = published

The pre-existing `physics-motion-01` is a distinct v–t graph problem asking acceleration and displacement, so it was not superseded.

Resulting published physics catalog:
- motion = 15
- current = 1
- magnetic-field = 1
- total physics = 17
- plus 2 math = 19 built-in questions total.

### P18 — gate history

Dedicated CI workflow:
`.github/workflows/physics-ch01-questionbank-ci.yml`

Failures caught before PASS:
1. unused locale import / adapter variable,
2. Japanese kana accidentally left in a Chinese generic prompt,
3. old schema test fixed at 5 built-in questions,
4. missing simulation `tolerance`,
5. old physics learning E2E that selected a question before selecting the motion topic.

Final passing run:
`36436511183`

Evidence:
- TypeScript PASS
- ESLint PASS
- Vitest: 16 files / 50 tests PASS
- production build PASS
- Playwright: 44/44 PASS

Browser evidence includes:
- taxonomy absent from ProblemsPage,
- setup → practice → physics reveals 23 topic cards,
- motion card displays 15,
- 15 motion options are present,
- existing `physics-motion-01` remains first,
- `physics-ch01-1g-example-q1` can be selected and opened as a real learning session.

### P19 — docs/checkpoint

Updated:
- `CHATGPT_README_FIRST.md`
- `docs/physics-ch01/MASTER_FIRE_DIAGRAM.md`
- `docs/physics-ch01/WORKLOG.md`
- `docs/taxonomy/PHYSICS_TITLE_GUIDE.md`
- `docs/checkpoints/phase-14-review.md`

Status: **PASS**


## 2026-09-28 — P20–P25 full textbook catalog repair PASS

### Problem found from public UI review

The Chapter 1 implementation itself was present, but the textbook navigation shell was incomplete:

1. unit cards only changed a selected `unitId`; they did not open the unit,
2. an additional bottom “教科書モードを始める” button was required,
3. internal stable codes `1A〜1G` leaked into the learner-facing UI,
4. the chapter catalog contained only Chapter 1,
5. LearningSetup generated chapter groups only from published units, so chapters with zero units vanished entirely,
6. the textbook's five-part structure was absent from the UI.

### P20 — authoritative catalog

Expanded `src/data/textbook/chapterCatalog.ts` to:
- 5 parts,
- 15 chapters,
- unique part/chapter IDs,
- Chapter 1 retaining the existing 7 unit codes,
- all later chapters carrying no fabricated unit data.

### P21 — catalog-driven UI

LearningSetup now renders the catalog itself rather than deriving chapters from `published TextbookUnit[]`.

Behavior:
- implemented chapter: shows current unit links and progress,
- unimplemented chapter: remains visible with `準備中`.

### P22 — hide internal codes

`1A〜1G` remain internal stable metadata only.

Removed learner-facing code display from:
- textbook unit cards,
- textbook page H1,
- textbook completion copy.

### P23 — direct unit navigation

Unit cards are now links:
```text
変位と速度
  ↓ click
/learning/textbook/physics-a-displacement-velocity
```

Textbook mode no longer exposes the extra bottom start button.

### P24 — real browser audit

Playwright now verifies:
- all five parts are visible,
- all fifteen chapter titles are visible,
- Chapter 2 is visible as 準備中,
- Chapter 1 reports seven units,
- first unit contains `変位と速度` but not `1A`,
- clicking the first unit directly opens the textbook page,
- textbook H1 is `変位と速度`,
- readingFlow and inline blanks render,
- the existing 1A figure/mask and persistence regressions remain covered.

### P25 — full gate

Dedicated workflow:
`.github/workflows/physics-textbook-catalog-ci.yml`

Passing run:
`36440820115`

Evidence:
- TypeScript PASS
- ESLint PASS
- Vitest: 17 files / 53 tests PASS
- production build PASS
- Playwright: 44/44 PASS

Status: **P20–P25 PASS**


## 2026-09-29 — P26–P31 textbook reader root repair PASS

### Trigger

Public-page manual review found three independent visible failures:
- wrong choice expanded/revealed all options and polluted reading flow,
- formulas containing holes could display raw TeX,
- previous figure/content disappeared when advancing.

A later screenshot also showed figure 2 visually corrupted.

### Audit findings

The four screenshots exposed six coupled root causes:

1. **answer state defect**  
   `answerTextbookItem` wrote `resolved: true` even for incorrect values.  
   Consequences: wrong answers counted as completed, retries were blocked, masks could reveal.

2. **wrong-answer UX defect**  
   The panel intentionally kept all four choices disabled, highlighted wrong + correct, and printed the correct answer. This was unsuitable for article-style reading.

3. **formula architecture defect**  
   Mixed formula blocks compiled each math fragment separately. A structure such as
   `\\frac{` + hole + `}{` + hole + `}`
   is syntactically invalid when fragments are passed independently to KaTeX.

4. **reading state defect**  
   Only `currentSection` was rendered. Progress automatically changed `selectedSectionIndex`, so previous text/figures unmounted.

5. **asset defect**  
   7/17 deployed WebPs were truncated. Canonical PNGs in the supplied figure archive were intact.

6. **test defect**  
   Existing tests validated the old wrong-answer behavior and only checked that images had a non-zero natural width.

### P26 — state repair

- added `isTextbookItemResolved`,
- wrong answers remain unresolved,
- correct retry can resolve,
- section/unit progress counts only genuinely resolved items,
- legacy `isFirstCorrect=true` records remain compatible,
- legacy resolved-wrong records no longer count.

### P27 — math repair

Added:
- `src/domain/textbookFormula.ts`
- `src/components/textbook/TextbookFormula.tsx`
- `src/domain/textbookFormula.test.ts`

All formula parts are combined before rendering. Interactive holes use trusted KaTeX HTML metadata while stable item IDs remain available to tests/accessibility without displaying labels to learners.

### P28 — reading continuity

`TextbookUnitPage` now renders a section stack:
- once opened, a section remains visible,
- “次へ” appends the next section below,
- no progress-driven auto-unmount,
- persisted progress initializes at the first incomplete section.

### P29 — figure restoration

Canonical archive:
- supplied file: `figure(1).zip`
- size: 11,478,555 bytes
- SHA256: `e938a1be0470a87c429ee766c9f75163e9f0768470bb3e403449760b92622e58`

Restored from source PNG:
- 2 (2).png
- 3 (2).png
- 5.png
- 11.png
- 12.png
- 13.png
- 14.png

Repaired figure 2 was opened directly after conversion; labels, arrows and curve were visually intact.

### P30 — stronger regression gate

Added:
- wrong answer → completed count remains unchanged,
- retry → correct resolves,
- all Chapter-1 formulas compile both before/after resolution,
- no visible raw TeX leak,
- no learner-facing internal micro label,
- previous reading section remains visible,
- masks require true resolution,
- 17 unique figure references,
- RIFF declared size must equal actual file length,
- overlay bounds checked in one DOM evaluation to avoid scroll-coordinate races.

Final run:
`36455569868`

Evidence:
- TypeScript PASS
- ESLint PASS
- Vitest: 19 files / 58 tests PASS
- production build PASS
- Playwright: 46/46 PASS

Status: **P26–P31 PASS**

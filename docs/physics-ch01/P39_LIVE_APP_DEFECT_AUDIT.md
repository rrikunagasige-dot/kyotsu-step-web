# P39 Live App Defect Audit — Post User QA

Status: **AUTHORITATIVE REPAIR PLAN**

Date: 2026-09-29

This file freezes the defect list discovered after real App review.
Do not patch isolated symptoms out of order.
Repairs must follow the priority groups below.

---

## A. MUST FIX BEFORE NEXT USER RE-QA

These defects can directly damage correctness, legibility, learning quality, or deployment trust.

### A1. Math representation
- E01: combined subscripts such as v₀ₓ can become invalid LaTeX like v_0_x.
- E02: inline math and display math are parsed through different paths.
- E03: source math notation mixes Unicode, ASCII-ish and TeX-like forms.
- E04: clickable formula-hole rendering produces KaTeX strict-mode warnings.
- E22: formula typography is not consistently textbook-grade.
- E23: trig notation/spacing is inconsistent.
- E24: resolved formula holes do not always look like one natural completed formula.

Acceptance:
1. one normalization path for inline/display/choice/resolved math,
2. no KaTeX parse errors or strict warnings,
3. v₀ₓ, v₀ᵧ, r⃗₁, v⃗_A, t_H, v_t render correctly,
4. resolved formula reads exactly like ordinary math.

### A2. Derivation representation
- E05: multi-step derivations appear as several white cards.
- E06: the data model has no explicit derivation object.
- E07: grouping only consecutive formula lines breaks when prose exists between steps.
- E36: natural prose and one-question-at-a-time UI are still not fully integrated.

Acceptance:
- one derivation = one visual derivation block,
- prose cues may appear inside the derivation block,
- only the active reasoning point becomes interactive,
- completed steps remain visually part of one chain.

### A3. Hole quality
- E08: some holes ask only for the final algebraic step.
- E09: several remaining holes are still low-value.
- E10: repeated symmetric questions can become click repetition.
- E11: some answers are nearly stated immediately before the hole.
- E12: some holes only recall a formula derived one line earlier.
- E13: some questions reduce to trivial arithmetic.
- E14: some algebra-only holes have weak physics value.
- E15: pure numerical arithmetic holes may not justify interaction.
- E20: too few holes ask for parent relation / condition / elimination strategy.
- E21: physics-condition and algebra-operation holes currently look identical.
- E37: hole count itself must not be treated as a quality metric.
- E38: the pedagogical purpose taxonomy is not preserved in runtime data.
- E39: UI cannot distinguish question purposes.

Acceptance:
- each interactive hole has a declared pedagogical purpose,
- no hole exists only because a formula line has a convenient blank,
- derivation holes prioritize: parent relation, physical condition, substitution choice,
  elimination strategy, factorization/branch choice, meaningful representation link,
- mechanical end-steps remain visible rather than interactive.

### A4. Scaffolding and retry behavior
- E16: almost every interaction is the same four-choice scaffold.
- E17: scaffold fading from P35 is not implemented.
- E18: wrong-answer support is effectively only "もう一度".
- E19: brute-force selection is possible.

Acceptance:
- early concept formation may use strong choices,
- later derivation/transfer steps use weaker scaffolds,
- wrong attempts trigger staged hints tied to the question purpose,
- repeated guessing is not the default learning path.

### A5. Figure quality and timing
- E25: some remaining WebPs may still be too low resolution.
- E26: fig-6 is especially suspicious (~8 KB).
- E27: 1E/1F figures still need live quality review.
- E28: current asset tests validate bytes, not educational readability.

Acceptance:
- no blurred equation/label text,
- no answer-bearing figure shown before the corresponding reasoning point,
- concept-forming figure is visible when the prose/question needs it,
- figure QA includes rendered-size/readability checks, not only file validity.

### A6. State / CI / deployment integrity
- E41: latest main is not green.
- E42: current failure is a stale test referencing removed holes.
- E43: latest main therefore has not deployed.
- E44: public App and main currently differ.
- E45: the latest 59-hole branch state has no real-browser validation.
- E46: automated PASS must not be treated as pedagogical PASS.

Acceptance:
- main green,
- public Pages exactly matches tested main,
- real-browser smoke covers 1A–1G,
- user-facing QA remains a separate gate.

---

## B. SPEC DECISION REQUIRED BEFORE IMPLEMENTATION

These are not necessarily defects if kept internal, but their intended boundary must be explicit.

### B1. Internal unit codes
- E33: unitCode still uses 1A–1G internally.
- E34: route IDs still contain old unit structure, e.g. physics-1d-acceleration.

Decision rule:
- student-facing prose/UI must not expose 1A–1G,
- internal stable IDs may remain if they are implementation-only,
- do not rename routes/IDs unless there is a functional reason because migration can break saved links/progress.

Recommended default:
**keep internal IDs, remove them from all student-facing UI.**

### B2. Progressive reveal strictness
- E35: hiding everything after the unresolved block may be too strict for some explanatory sequences.

Decision rule:
- hide only content that would leak the answer or bypass the intended reasoning step,
- explanatory context that is required to understand the question may remain visible.

Recommended default:
**semantic reveal, not blanket reveal.**

---

## C. IMPORTANT BUT CAN FOLLOW THE NEXT RE-QA

These should be cleaned before scaling Chapter 2+, but need not block the next visual/user check.

- E29: teacher metadata and student prose share one source file.
- E30: source filename still says V2_2 while content has moved beyond it.
- E31: parser/module naming still says v22.
- E32: smoke-test filename still says v22.
- E40: full developer audit mode from P38 is not yet implemented.

Recommended follow-up:
1. split authoring metadata from student content,
2. rename source/parser/test after the learning model stabilizes,
3. implement full audit mode before batch-producing later chapters.

---

## Repair Order

    R0  freeze audit / no symptom patching
     ↓
    R1  restore green baseline (stale tests only)
     ↓
    R2  unify math representation
     ↓
    R3  introduce derivation-block data/UI
     ↓
    R4  reclassify every remaining hole by purpose
     ↓
    R5  implement scaffold fading + staged hints
     ↓
    R6  finish figure quality/timing audit
     ↓
    R7  semantic progressive reveal
     ↓
    R8  1A–1G browser QA + mobile viewport QA
     ↓
    R9  Pages deploy
     ↓
    USER RE-QA
     ↓
    only then close P39

---

## Current Important State

- Public Pages is still the previous successfully deployed version.
- Main contains partially applied post-review changes.
- Latest main CI is failing before browser smoke because a test still references holes
  intentionally removed during the mechanical-hole audit.
- Therefore **do not compare the public App to current main as if they are identical.**

No P39 PASS may be claimed until R0–R9 and user re-QA are complete.

---

## FINAL R0–R9 STATUS — 2026-09-30

This section supersedes the stale "Current Important State" snapshot above.

| Step | Status | Result |
|---|---|---|
| R0 | PASS | defect list frozen before repair |
| R1 | PASS | main restored to green baseline |
| R2 | PASS | combined-subscript/math rendering unified and regression-tested |
| R3 | PASS | 13 explicit multi-step derivation groups |
| R4 | PASS | 59 audited → 45 reasoning interactions |
| R5 | PASS | purpose metadata + 2/3/4-choice fading + two-stage hints |
| R6 | PASS | fig-6 SVG replacement; remaining live WebPs >=1000×700; visual raster QA |
| R7 | PASS by audit decision | strict reveal retained because required context is pre-question and post-question content is often answer-bearing |
| R8 | PASS | Pixel 7 + desktop Chromium; full 1F derivation QA |
| R9 | PASS | Pages run 213 deployed successfully |

Current public/main state:
- tested head: `5e852790b563717c5e732d0ccdd8380cbd47ae34`,
- workflow run 213: SUCCESS,
- Pages deployment: SUCCESS,
- public App and tested main are synchronized at this gate.

Remaining work before P39 closure:
**USER RE-QA only.**

Deferred cleanup from section C (source/parser/test naming and full developer audit mode) remains important before Chapter-2 batch production, but does not block the present Chapter-1 user review.

---

## USER FIGURE CORRECTION — 2026-09-30

The previous R6 implementation used several generated SVG guides and replaced Figure 6 with a newly drawn SVG. The user explicitly rejected that direction.

This section supersedes the earlier R6 figure decision while retaining it as historical evidence.

### Corrected acceptance rule

1. Live Chapter 1 contains exactly the 17 canonical figures from the verified Library `figure.zip`.
2. No `generated-guide`, `generated-confirmation`, or `generated-graph` figure is allowed in the live Chapter-1 source.
3. The original figure contents are preserved; high-resolution WebP export is allowed, semantic redrawing is not.
4. A textual reference such as `図N` must not precede the actual `fig-N` figure block.
5. Figure QA checks both asset integrity/resolution and source ordering.
6. The extra generated v-t graph is removed; the v-t reasoning remains in prose/formulas without pretending that an original canonical graph exists there.

### Result

- 17/17 original figures restored from archive identity SHA256 `b1d55eb94c13aa8ec91dbfd794dcbcbcec9c5a67ed8bdd692c397ad78d8b01e2`.
- all 17 canonical app assets re-exported from their original PNGs at source resolution,
- generated live figure directives: 0,
- canonical figure IDs: exactly `fig-1` ... `fig-17`,
- first-reference ordering gate: PASS for all 17,
- GitHub Actions run 222 / head `155a825f6058f06f42b9097e4e29092dad09818e`: typecheck PASS / audited data+math+figure PASS / mobile+desktop browser PASS / build PASS / Pages deploy PASS.

P39 remains open for user re-QA.



---

## POST-R9 USER CORRECTION — 1A AVERAGE-VELOCITY CHAIN — 2026-09-30

A new hands-on review of the first section found two local defects:
1. equations belonging to one worked-example calculation were still visually split into separate white formula cards;
2. the average-velocity notation stacked an average bar and vector arrow, producing an unpleasant double-mark appearance.

The user also specified the exact worked-example interaction style: keep the calculation continuous and place holes inside the chain at meaningful application/calculation checkpoints.

Applied correction:
- scope restricted to the 1A average-velocity worked example,
- new explicit derivation group `a-average-velocity-example`,
- nine displayed formula lines live inside one derivation container,
- four interactive formula holes: displacement result, elapsed-time result, displacement substitution into the numerator, final average-velocity result,
- individual formula-line borders inside the chain are forced by the existing derivation UI to 0; only the outer derivation frame remains,
- `v̄⃗` is normalized for learner rendering as `\\vec{v}_{\\mathrm{avg}}`, eliminating the stacked bar+arrow,
- 1A revision bumped to 7 to prevent stale answer records from being interpreted under the changed hole meanings.

Current live interaction count is now **47** (11/3/4/8/6/8/7), with **14** explicit derivation groups. This supersedes the numeric current-state snapshot of 45/13 while preserving the R4 audit as history.

Regression:
- source/data test requires the new four-hole derivation sequence,
- direct math-normalization test covers the average-velocity symbol,
- Playwright solves all 1A interactions on mobile and desktop and asserts one outer derivation frame with zero per-formula borders.

Validation: GitHub Actions run **225**, head `62ef643b4f582ed514c483fadc949b257bb2be90` — typecheck / audited data+math / mobile+desktop browser / build / Pages deploy all PASS.

P39 remains open for user re-QA.

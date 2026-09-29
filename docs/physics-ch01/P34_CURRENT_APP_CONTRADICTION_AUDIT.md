# P34 — Current App vs P33 Ideal Chapter-1 Contradiction Audit

Status: **P34 AUDIT COMPLETE — CURRENT APP REQUIRES REDESIGN**

Date: 2026-09-29

Authoritative ideal:
- `P33_REPRESENTATION_DEPENDENCY_MAP.md`
- `prototypes/CH1_LEARNING_TEXT_V2_1.md`
- 54 justified inline holes
- 17 canonical figures
- P33 PASS

Current app evidence:
- `src/data/textbook/ch01/1a-displacement-velocity.ts`
- `src/data/textbook/ch01/1b-velocity-composition.ts`
- `src/data/textbook/ch01/1c-relative-velocity.ts`
- `src/data/textbook/ch01/1d-acceleration.ts`
- `src/data/textbook/ch01/1e-horizontal-projectile.ts`
- `src/data/textbook/ch01/1f-oblique-projectile.ts`
- `src/data/textbook/ch01/1g-gravity-drag-terminal-velocity.ts`

P34 is an audit only. No application code is modified here.

---

## 1. Classification

P34 uses these contradiction classes:

- **MISSING** — ideal content / representation / derivation is absent.
- **WRONG** — content exists but its pedagogy conflicts with P33 rules.
- **WRONG_TIMING** — the right content appears before/after the point where it is needed.
- **SPLIT_ATTENTION** — mutually dependent text / figure / formula are separated into different learning blocks.
- **LEAKAGE** — title, heading, caption, alt text, figure label, or nearby prose exposes the answer before resolution.
- **UNNECESSARY** — a hole/item interrupts reading without enough conceptual or calculation value.
- **DUPLICATE** — the same knowledge is repeatedly asked without meaningful fading / transfer.
- **FRAGMENTATION** — the lesson is broken into many quiz fragments rather than continuous learning prose.

---

## 2. Current item density

> Direct source recount: the current 1A–1G TypeScript files contain 179 item definitions (78+18+17+17+16+19+14). Earlier draft audit counts that were one lower per unit are superseded.

Current app item counts:

| Unit | Current app items | P33-passed v2.1 holes |
|---|---:|---:|
| 1A | 78 | 10 |
| 1B | 18 | 6 |
| 1C | 17 | 4 |
| 1D | 17 | 9 |
| 1E | 16 | 7 |
| 1F | 19 | 10 |
| 1G | 14 | 8 |
| **Total** | **179** | **54** |

The numbers are not expected to match exactly; some app items may be transfer/review items. However, a 179-item chapter against a complete 54-hole continuous lesson is strong evidence that the current content has over-fragmented knowledge into micro-questions.

**Classification:** FRAGMENTATION / UNNECESSARY / DUPLICATE.

---

## 3. Global structural contradictions

### P34-G1 — Fixed five-section template still controls the lesson

1B–1G all use essentially:

    knowledge-check
    → figure-reading
    → example-q1
    → example-q2
    → final-review

1A is larger, but follows the same separation logic.

P33 explicitly supersedes a universal section order. A concept may need phenomenon + figure + prose + formula in the same learning event.

**Classification:** WRONG / SPLIT_ATTENTION.

### P34-G2 — Figures are separated from concept formation

In the current 1B–1G data, the concept section has `figures: []`; figures are deferred to the separate `figure-reading` section.

This means formulas or terminology are often introduced before the figure that should create their meaning.

Examples:
- 1B component formulas appear before figure 6.
- 1E horizontal / vertical equations appear before the strobe figure is read as the concept-forming evidence.
- 1F launch components and highest-point relations are introduced before the dedicated figure-reading block.

**Classification:** WRONG_TIMING / SPLIT_ATTENTION.

### P34-G3 — Item density is being used as structure

Current content frequently decomposes one relation into several independent micro-items:
- numerator and denominator separately,
- x and y components separately even after one pattern is established,
- repeated label-identification items,
- repeated final-review questions after already-complete examples.

P33 uses holes only when the interruption itself carries a useful H1–H6 reasoning action.

**Classification:** UNNECESSARY / DUPLICATE / FRAGMENTATION.

### P34-G4 — First-exposure terminology is still quizzed

Examples:
- 1A asks for `位置ベクトル` in the first conceptual block.
- 1C asks for `相対速度` the first time the name is introduced.
- 1D asks “単位時間あたりの速度の変化を何というか” → `加速度`.

P33 v2.1 rule:

    construct meaning
    → teach the new name
    → retrieve/use the name later

**Classification:** WRONG.

### P34-G5 — Titles / headings leak first-exposure terminology

Examples:
- unit title `C 相対速度` while C's first concept item asks for the term `相対速度`,
- unit title `D 加速度` while the concept item asks for `加速度`,
- 1A heading `1-1 位置と位置ベクトル` while item a-1 asks for `位置ベクトル`,
- 1A heading `1-2 変位` while a-4 asks what “位置の変化” is called,
- 1B title contains `合成と分解` while concept items ask for those names.

These questions can be answered by reading surrounding UI rather than reasoning.

**Classification:** LEAKAGE / WRONG.

### P34-G6 — Accessibility text can leak masked answers

Specific examples:
- 1A figure alt text names `r1`, `r2`, and `Δr` while masks ask learners to identify these labels.
- 1F figure 14 alt text explicitly says “最高点で v_y=0” while the masked figure task asks the highest-point vertical component.

Visual masks do not prevent answer leakage through alt/caption text.

**Classification:** LEAKAGE.

---

## 4. Unit-by-unit audit

### 1A — 変位と速度

Current: **78 items** vs ideal: **10 holes**.

Findings:
- first-exposure `位置ベクトル` and `変位` are quizzed rather than meaning-first,
- headings leak the same terminology,
- the concept section contains no integrated concept-forming figure,
- figure-reading later repeats r1/r2/Δr labels and the same vector relation,
- many micro-items split one idea into numerator / denominator / label / direction fragments,
- worked example contains far more arithmetic and intermediate micro-questions than the ideal mobile prose requires,
- canonical figures are being used, but their timing is wrong,
- alt text can expose masked labels.

**Classes:** WRONG, WRONG_TIMING, SPLIT_ATTENTION, LEAKAGE, UNNECESSARY, DUPLICATE, FRAGMENTATION.

### 1B — 速度の合成と分解

Current: **18 items** vs ideal: **6 holes**.

Findings:
- formula holes `v_x=v cosθ`, `v_y=v sinθ` are asked before showing the parent trigonometric relations `cosθ=v_x/v`, `sinθ=v_y/v`,
- figure 6 is deferred to figure-reading instead of being co-present with the projection relation,
- unit title already gives “合成 / 分解” while items ask for those terms,
- separate example and review blocks repeat already-established content.

**Classes:** MISSING derivation, WRONG_TIMING, SPLIT_ATTENTION, LEAKAGE, DUPLICATE.

### 1C — 相対速度

Current: **17 items** vs ideal: **4 holes**.

Findings:
- first-exposure `相対速度` is still a choice item,
- the unit title itself reveals that answer,
- observer phenomenon and figure 7 are separated,
- later items repeat the same “相手−観測者” relation and reference-selection idea more times than the ideal requires.

**Classes:** WRONG, LEAKAGE, SPLIT_ATTENTION, DUPLICATE.

### 1D — 加速度

Current: **17 items** vs ideal: **9 holes**.

Major missing representation:
- no `v-t` graph representation in the current unit,
- therefore no visual construction of “slope = acceleration” and “area = displacement”.

Current constant-acceleration equations are presented as formula holes:

    v = v0 + [ ]
    x = v0 t + [ ]
    v² - v0² = [ ]

without the P33 derivation chain:
- velocity change,
- v-t graph area,
- rectangle + triangle,
- substitution,
- time elimination.

The formulas are physically correct, but their learning architecture is wrong.

The first acceleration term is also a first-exposure terminology question and the title leaks it.

**Classes:** MISSING, WRONG, LEAKAGE, FORMULA-DERIVATION GAP.

### 1E — 水平投射

Current: **16 items** vs ideal: **7 holes**.

Findings:
- strobe figure 11 is not used first as the concept-forming evidence; equations are introduced in the concept block before the separate figure-reading block,
- `v_y²=2gy` is missing,
- total-speed formula is present, but the component-to-result chain is compressed,
- the trajectory formula is shown after the prose says time is eliminated, but the actual elimination
  `x=v0t → t=x/v0 → substitute into y`
  is not displayed,
- examples are separated from the continuous concept chain.

**Classes:** MISSING, WRONG_TIMING, SPLIT_ATTENTION, FORMULA-DERIVATION GAP.

### 1F — 斜方投射

Current: **19 items** vs ideal: **10 holes**.

Missing / compressed formula coverage:
- no explicit `v_y=v0 sinθ-gt` teaching formula in the main concept chain,
- no time-free vertical relation derivation,
- no maximum-height formula `H=v0²sin²θ/(2g)` or its derivation,
- no full trajectory equation derivation,
- flight time is stated as “twice the ascent time” rather than derived from `y=0`,
- range is presented as a final relation without the full `D=v_x T` derivation chain.

Timing / leakage:
- component formulas are asked before a visible trigonometric parent relation,
- figure 14 alt text says `v_y=0` while a mask asks that answer.

**Classes:** MISSING, WRONG_TIMING, SPLIT_ATTENTION, LEAKAGE, FORMULA-DERIVATION GAP.

### 1G — 重力加速度・空気抵抗・終端速度

Current: **14 items** vs ideal: **8 holes**.

Current unit is closer to the ideal than 1D–1F, but still has gaps:
- it says the drag is proportional to speed in a low-speed regime, but does not define `k>0` or explain what k represents at the concept-introduction point,
- `a=g-(k/m)v` is displayed, but the physical sign convention and derivation are compressed,
- terminal velocity is written directly as `mg=kv_t ⇒ v_t=...`; the ideal explicitly connects “constant velocity → a=0 → ma=mg-kv → force balance”,
- figures 15–17 are kept in a separate figure-reading section rather than interleaved with the force / graph reasoning.

**Classes:** MISSING model definition, SPLIT_ATTENTION, FORMULA-DERIVATION GAP, DUPLICATE.

---

## 5. What is already reusable

P34 does **not** conclude that the reader infrastructure should be discarded.

Reusable:
- chapter/unit routing,
- schema validation,
- canonical figure assets,
- figure overlay/mask mechanism,
- explicit choices,
- formula rendering,
- wrong-answer unresolved/retry behavior,
- per-unit data files,
- source provenance.

The main mismatch is the **content architecture inside those capabilities**.

---

## 6. P34 contradiction inventory

| ID | Scope | Class | Contradiction | Required later redesign |
|---|---|---|---|---|
| P34-C01 | global | WRONG | fixed 5-section pedagogy | concept-specific continuous flow |
| P34-C02 | global | SPLIT_ATTENTION | figures separated from concept sections | co-locate figure/text/formula when dependency requires |
| P34-C03 | global | FRAGMENTATION | 172 items vs 54 justified holes | rebuild from v2.1 hole map, not old item inventory |
| P34-C04 | global | WRONG | first-exposure terminology quizzes | meaning → name → later retrieval |
| P34-C05 | global | LEAKAGE | headings/titles reveal terminology answers | do not ask leaked item; revise surrounding text |
| P34-C06 | global | LEAKAGE | alt/caption text can reveal masked answers | leakage-aware alt/mask policy |
| P34-C07 | 1A | DUPLICATE | repeated label and relation micro-items | retain only H1–H6 justified decisions |
| P34-C08 | 1B | MISSING | component parent derivation absent | show trig parent relation before component holes |
| P34-C09 | 1C | WRONG | first-use relative-velocity term hole | teach term in prose |
| P34-C10 | 1D | MISSING | v-t graph absent | add graph as primary representation |
| P34-C11 | 1D | MISSING | kinematic equations not derived | graph/area/substitution/time-elimination chain |
| P34-C12 | 1E | WRONG_TIMING | strobe figure comes after formula concepts | strobe observation first |
| P34-C13 | 1E | MISSING | `v_y²=2gy` absent | add parent-equation derivation |
| P34-C14 | 1E | MISSING | trajectory time elimination compressed | show `t=x/v0` and substitution |
| P34-C15 | 1F | MISSING | vertical velocity/time-free/max-height/trajectory derivations incomplete | restore complete P33 formula chain |
| P34-C16 | 1F | LEAKAGE | figure-14 alt gives `v_y=0` before masked answer | redact answer-bearing alt before resolution |
| P34-C17 | 1G | MISSING | k/model definition incomplete | define `k>0` and linear model scope |
| P34-C18 | 1G | SPLIT_ATTENTION | force evolution and v-t graph separated from concept chain | integrate figures with equations/causal prose |

All identified contradiction classes are now tied to a P33 ideal requirement.

---

## 7. Gate judgment

### G56 — current-app contradictions fully classified
**PASS.**

The current Chapter-1 implementation has been compared against the P33-passed ideal using:
- missing representation,
- missing formula / derivation,
- wrong pedagogy,
- wrong timing,
- split attention,
- answer leakage,
- unnecessary / duplicate interaction,
- prose fragmentation.

This is a PASS for **audit completeness**, not a claim that the current app pedagogy passes.

## 8. P34 closeout

**P34 PASS — contradiction audit complete.**

Do not code yet.

Next authoritative node:

```text
P35 PEDAGOGY RULES
  one-step learnability
  question purpose
  scaffold fading
  wrong-answer hint progression
  transfer / retrieval
  + rules required to prevent P34-C01…C18
```

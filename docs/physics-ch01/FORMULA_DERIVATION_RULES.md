# Physics textbook mode — Formula derivation and hole-placement rules

Status: **CURRENT CHECKPOINT RULE — 2026-09-29**

This document supplements `LEARNING_TEXT_WRITING_RULES.md`.
The writing rule controls how the lesson reads; this file controls how equations are introduced, derived, and turned into inline holes.

The Chapter-1 formula-derivation-strengthened review version is the current reference artifact.

---

## 1. Mobile-first invariant

The learner may be reading only on a phone, without paper, pen, calculator notes, or a second screen.

Therefore:

> **The lesson must not require the learner to silently reconstruct two or more missing algebraic / physical reasoning steps in order to understand where a displayed formula came from.**

If a nontrivial final formula appears, the page must normally show:

1. the parent relation,
2. the physical condition or substitution being used,
3. the substitution itself,
4. intermediate algebra in readable steps,
5. the final formula,
6. the physical meaning of the result in ordinary language.

The learner should be able to follow the derivation by scrolling, not by reconstructing it on paper.

---

## 2. Derivation chain

For a nontrivial result, prefer this chain:

    need / physical question
    ↓
    parent equation(s)
    ↓
    condition / known relation
    ↓
    substitute
    ↓
    simplify one meaningful step at a time
    ↓
    final expression
    ↓
    translate the formula back into physical language

A final equation that appears without its parent relation is a warning sign.

---

## 3. One-screen reasoning principle

A learner should not have to remember a long derivation from several screens above.

When possible:

- keep the parent equation near the substitution,
- repeat the needed relation if the previous occurrence is far away,
- state what is being substituted before doing it,
- keep the key figure / graph near the equation it motivates,
- avoid references such as "as shown much earlier" when a short restatement would reduce cognitive load.

This is especially important on mobile because split attention is more costly.

---

## 4. The six justified hole types

A hole is allowed only when it creates useful thinking. Current Chapter-1 rules use six types.

### H1 — Meaning judgment

The learner reads what a figure, phenomenon, arrow, graph feature, or physical statement means.

Example:

    P1→P2 represents the object's 【change of position】.

Teacher reason: concept construction.

### H2 — Relation judgment

The learner identifies an important relation among physical quantities.

Example:

    initial position + 【displacement】 = final position

Teacher reason: relational understanding rather than vocabulary recall.

### H3 — Representation conversion

The learner translates between figure, prose, equation, or graph.

Example:

    r1 + 【Δr】 = r2

Teacher reason: bridge multiple representations of the same concept.

### H4 — Strategy / next-step judgment

The learner decides what should be found or used next.

Example:

    To find average velocity, first determine the 【displacement】.

Teacher reason: build solution planning rather than arithmetic fluency only.

### H5 — Physical boundary / condition judgment

The learner chooses a physically meaningful condition.

Examples:

    at the highest point: vy = 【0】
    at terminal velocity: a = 【0】

Teacher reason: connect mathematics to the physical state of the system.

### H6 — Meaningful mathematical operation

The learner performs a substitution, elimination, sign choice, or rearrangement that carries conceptual weight.

Examples:

    t = 【x/v0】

when eliminating time from projectile equations, or

    tH = 【v0 sinθ / g】

when solving the highest-point condition.

Teacher reason: make the derivation intelligible without turning every arithmetic line into a quiz.

---

## 5. What should NOT become a hole

Do not create a hole merely because a symbol or number is available to hide.

Normally keep these visible:

- routine arithmetic such as `5 - 2 = 3`,
- repeated calculations with exactly the same structure,
- algebraic simplification that contributes no new physical / mathematical decision,
- grammatical glue,
- a term that has not yet been taught and cannot be inferred from visible evidence,
- every line of a derivation,
- values that the learner would have to guess rather than reason toward.

A derivation can be long while still containing only one or two holes.

---

## 6. Hole placement test

Before cutting any formula hole, answer all of these:

1. **What reasoning action is this hole asking for?**
2. **Which of H1-H6 is it?**
3. **Is the needed evidence already visible or previously learned?**
4. **Would the learner understand more after answering it?**
5. **Is this step important enough to interrupt reading?**
6. **After filling the hole, does the equation / sentence read naturally?**
7. **Does the next step reuse the result?**
8. **Would keeping the expression visible actually teach better?** If yes, do not make it a hole.

If the designer cannot explain why a hole exists in teacher terms and calculation terms, remove it.

---

## 7. Derivation completeness gate

For every nontrivial final formula, record:

- target formula,
- parent formula(s),
- physical condition,
- substitution / elimination,
- intermediate equation(s),
- final simplification,
- physical interpretation,
- which step, if any, should contain a hole.

A formula fails the gate when the source effectively says:

    previous topic
    ↓
    [unshown reasoning]
    ↓
    final formula

and the missing reasoning is not truly trivial for the target beginner.

---

## 8. Examples from Chapter 1

### Constant-acceleration displacement

Do not jump directly from `v=v0+at` to `x=v0t+(1/2)at²`.

Show the `v-t` graph area:

    x = v0 t + (1/2)(v-v0)t

then use

    v-v0 = at

and substitute:

    x = v0 t + (1/2)(at)t
      = v0 t + (1/2)at²

A justified hole can be `v-v0 = 【at】` because that step connects the graph derivation to the acceleration relation.

### Horizontal-projectile trajectory

Show:

    x = v0 t
    t = x/v0

then

    y = (1/2)gt²
      = (1/2)g(x/v0)²
      = g x² / (2v0²)

A useful hole is `t = 【x/v0】` because eliminating time is the key strategy.

### Oblique-projectile highest point

Show the physical condition first:

    vy = 0

then

    0 = v0 sinθ - g tH
    g tH = v0 sinθ
    tH = v0 sinθ / g

If deriving maximum height, explicitly substitute this time into the vertical-position equation and simplify in visible steps.

### Terminal velocity

Show sign convention and force balance:

    ma = mg - kv

At terminal velocity the speed is constant, so:

    a = 0

therefore:

    0 = mg - k vt
    k vt = mg
    vt = mg/k

The best hole is usually the physical condition `a=【0】` or the meaningful relation `vt=【mg/k】`, not each algebraic rearrangement.

---

## 9. Interaction density rule

The goal is **more visible derivation, not more holes**.

When a derivation is expanded from 2 lines to 6 lines, the number of holes may remain unchanged.

Current Chapter-1 direction:

    derivation detail ↑
    cognitive jumps ↓
    hole density ≈ stable

This protects the continuous-reading quality of the approved prose.

---

## 10. Source of authority

For the current checkpoint:

1. Physics facts: textbook PDF, Chapter 1 pages 12-27.
2. Canonical figures: `figure.zip` / `SOURCE_MANIFEST.md` mapping.
3. Natural-prose rules: `LEARNING_TEXT_WRITING_RULES.md`.
4. Formula derivation + hole rules: this document.
5. Current Chapter-1 content source: `prototypes/CH1_LEARNING_TEXT_V2_1.md`.
6. Review artifact: formula-derivation-strengthened DOCX identified in `prototypes/README.md`.

The v2.1 prototype has passed the P33 source-alignment re-audit. P34-P38 remain open; P34 is the next audit.

---

## Formula-hole interaction amendment — 2026-09-29

User review found that visible derivation alone is not sufficient: if the learner only reads every intermediate formula, the derivation can become passive.

New hard rule:

> **For every nontrivial derivation of 2 or more meaningful steps, place at least one interactive formula hole inside the derivation itself.**

Prefer formula holes that ask for one of:

- **F1 Parent relation selection** — which established relation is used next.
- **F2 Physical-condition substitution** — e.g. `v_y=0`, `a=0`, initial component = 0.
- **F3 Variable elimination** — e.g. solve `t=x/v_0` so time can be removed.
- **F4 Meaningful algebraic transformation** — factorization, difference of squares, sign-sensitive simplification, or another step that produces the next physics relation.
- **F5 Final-form reconstruction** — turn the intermediate result into the reusable canonical formula.

Density guidance:
- 2–3 meaningful derivation lines: usually at least 1 formula hole.
- 4+ meaningful derivation lines: usually 1–2 formula holes.
- Do not hole every arithmetic operation or repeated mechanical manipulation.

This amendment refines the earlier statement “more derivation does not imply more holes”:

> More derivation does not imply holes on **every** line, but a nontrivial derivation should not remain entirely passive.

Current review candidate:
`prototypes/CH1_LEARNING_TEXT_V2_2_FORMULA_HOLES.md`
with 65 holes (54 previous justified holes + 11 derivation-formula holes).



---

## 11. Mandatory companion: real-App derivation lessons

Read `CH1_USER_QA_DESIGN_LESSONS.md` before changing formula-hole density or derivation UI.

Chapter-1 live QA refined the abstract F1–F5 rules with two additional requirements:
1. **semantic grouping** — one continuous derivation renders in one outer visual frame, not one card per equation;
2. **application can justify multiple checkpoints** — in a first worked example, recalling a known relation and then computing its numerical result may both be meaningful holes when they train different actions and feed the same chain.

This does not authorize mechanical holes globally. The designer must state what the learner practices at each hole.

---

## 12. Formula application gate — 2026-10-01

A formula passes the derivation gate only if it also has a meaningful later use.

For each important formula ask:
1. Where is its meaning/parent relation taught?
2. Where does the learner retrieve or select it later?
3. Where does the learner actually substitute concrete quantities or conditions?
4. What result follows from that application?
5. Is that result reused or interpreted?

A worked example fails this gate if the App precomputes the key formula application and asks only for the final arithmetic.

Example from 1B:
- insufficient: state combined velocity `(2.0,1.5)` and ask only for speed,
- acceptable: ask for `v1+v2`, then compute `(2.0,1.5)`, then select the magnitude formula, then compute the speed.

Likewise, a decomposition formula taught earlier should be applied at least once to a concrete `v, θ` pair if decomposition is a stated learning objective.

This is a later-use / transfer requirement, not a global instruction to turn every arithmetic line into a hole.


---

## 13. Active-derivation gate — intermediate physical reasoning can be a hole

The 1D review strengthens the earlier formula-hole rule.

For a genuine physics derivation, it is not enough to show all intermediate equations. If every important step is pre-filled, the learner is only watching the derivation.

A useful derivation hole may target the **physical identification that makes the next equation possible**.

Example for constant acceleration:

```text
a = Δv/Δt

Δv = [ v - v0 ]
Δt = [ t - 0 = t ]

a = (v-v0)/t

v-v0 = [ at ]

v = v0 + at
```

The two holes `Δv=v-v0` and `Δt=t` are not trivial bookkeeping in this context. They connect the abstract definition to the concrete motion being analyzed.

### Preferred hole targets in derivations

Prefer holes at:
- physical-quantity identification,
- initial/final-value substitution,
- condition application,
- representation conversion,
- parent-relation selection,
- reuse of an earlier derived relation,
- variable-elimination choice,
- meaningful graph/geometry interpretation,
- final-form reconstruction.

Usually leave visible:
- repetitive arithmetic,
- obvious multiplication/division already implied by the previous line,
- algebra that adds no new physical or strategic decision.

### Derivation UX rule

A long derivation should feel like:

```text
visible support
+ learner decisions
+ immediate continuation
```

not:

```text
wall of formulas
```

and not:

```text
quiz on every algebraic token
```.

---

## 14. Representation-completeness gate for derivations

Before approving a derivation, ask whether any step relies on an unseen diagram, graph, or geometric decomposition.

If yes, the derivation is incomplete.

For a `v-t`-area derivation, statements such as:
- “rectangle area”,
- “triangle height is v-v0”,
- “the area under the graph is displacement”

must be supported by an actual visible graph/decomposition if the learner is expected to reason from it.

A new derivation-specific educational figure may be designed only when:
- no canonical source figure already supplies the needed representation,
- the figure is additive rather than a silent replacement,
- its pedagogical role is explicit,
- the user has approved adding the new representation.

This rule preserves source fidelity while allowing genuinely necessary teaching representations.

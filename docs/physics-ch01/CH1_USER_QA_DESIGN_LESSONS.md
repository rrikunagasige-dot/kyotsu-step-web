# Chapter 1 User-QA Design Lessons — Future App Rules

Status: **MANDATORY DESIGN LESSONS FOR FUTURE TEXTBOOK-APP WORK**

Date frozen from Chapter-1 user QA: 2026-09-30 / 2026-10-01

Purpose:
This file is not merely a history of what was changed in Chapter 1.
It extracts the reasons behind those corrections and turns them into reusable design rules for future chapters and future App work.

Read this file before:
- redesigning textbook-mode UI,
- adding or moving figures,
- adding/removing formula holes,
- changing derivation layout,
- batch-producing later chapters,
- claiming that a deployed lesson is pedagogically finished.

---

## 1. The central lesson: correctness is not enough

A lesson can be mathematically correct and still be a bad learning experience.

Chapter-1 user QA exposed defects that ordinary data tests did not detect:
- formulas were correct but visually split into unrelated cards,
- figures existed but appeared too late, were blurred, or had been silently redrawn,
- holes existed but did not make the learner feel that they had learned a method,
- notation compiled but looked visually wrong,
- automated gates passed while the real mobile reading experience still felt wrong.

Therefore the acceptance question is not only:

> Is the content correct?

It is also:

> Can a beginner understand why each step exists, and does the screen visually preserve that reasoning?

**Automated PASS is necessary, not sufficient. Real deployed-App user QA remains a separate gate.**

---

## 2. One reasoning chain = one visual frame

### What went wrong

In the first-section average-velocity example, consecutive equations such as

`Δr = ...`

and

`Δt = ...`

were rendered as separate white cards.

The mathematics was correct, but the UI implied that each line was a separate object or separate problem. The learner lost the feeling of following one continuous calculation.

### Why this matters

Visual grouping is semantic.

A border/card says:
- "this is one unit",
- "this belongs together",
- "read this as one thought".

If every formula line gets its own card, a derivation becomes a list of disconnected answers.

### Future rule

For a continuous derivation:

```text
parent relation
  ↓
substitution
  ↓
calculation
  ↓
result
  ↓
reuse / interpretation
```

render **one outer derivation frame**.

Inside that frame:
- individual formula lines have no independent card border,
- vertical spacing may separate steps,
- prose cues may appear inside the same frame,
- the learner should be able to visually scan the whole chain as one object.

Do not use "one formula = one card" as a default layout rule.

---

## 3. Hole placement is about the learning action, not the hole count

### What went wrong

Earlier versions alternated between two bad extremes:
- too many trivial holes that felt like clicking through arithmetic,
- too few meaningful holes, so the learner only watched a derivation passively.

The user repeatedly evaluated holes with a simple criterion:

> After filling this hole, do I feel that I learned or applied something?

### Future rule

Every hole must have an explicit learning purpose. Typical useful purposes are:
- recall/apply a previously introduced relation,
- choose a parent formula,
- apply a physical condition,
- select a representation,
- eliminate a variable,
- perform a meaningful transformation,
- compute a result that will be reused,
- interpret the physical meaning of a result.

Do not add a hole merely because a formula contains a convenient blank.

Also do not remove a hole merely because it involves arithmetic.
The educational role of the arithmetic matters.

---

## 4. Chapter-1 worked-example pattern: relation → substitution → result → reuse

The final 1A average-velocity example is an important local template.

The user explicitly wanted:

```text
Δr = [hole: r2-r1]          ← apply previously learned relation
   = numerical substitution
   = [hole: (6,4)]          ← carry out the calculation

Δt = [hole: t2-t1]          ← apply previously learned relation
   = numerical substitution
   = [hole: 3]              ← carry out the calculation

v_avg = [existing hole: reuse the computed Δr] / 3
      = [existing hole: final velocity]
```

### Why both relation holes and result holes are useful here

The relation hole checks:
- does the learner know which relation to use?

The result hole checks:
- can the learner actually apply that relation to the supplied values?

These are different learning actions.

So a repeated concept can be justified when the second appearance is a **transfer/application step**, not a passive duplicate.

### Important scope restriction

This is a **local user-approved pattern for the first worked example**.

Do not infer:

> every numerical calculation in every chapter must become a hole.

Instead ask:
- Is this the learner's first meaningful application?
- Is the calculation itself part of the concept being learned?
- Will the result be reused in the same reasoning chain?

If not, leave routine arithmetic visible.

---

## 5. A hole must not destroy the derivation

The derivation must still be understandable as a whole.

Bad pattern:

```text
formula card
[choice UI]
new formula card
[choice UI]
new formula card
```

This turns the derivation into a quiz sequence.

Preferred pattern:

```text
ONE DERIVATION FRAME
  relation = [hole]
  substitution
  result   = [hole]

  next relation = [hole]
  substitution
  result        = [hole]

  final reuse / conclusion
END FRAME
```

The interaction belongs **inside** the explanation, not between disconnected explanation cards.

---

## 6. Figures are source material, not decoration

### What went wrong

Several newly generated guide/confirmation/graph images were introduced because they seemed pedagogically useful.

The user rejected that direction and required a return to the original Library figures.

### Why this matters

A textbook figure has three roles:
1. source fidelity,
2. learning reference,
3. stable correspondence with the prose/questions.

Silently redrawing it can change:
- visual emphasis,
- labels,
- geometry,
- the relationship between text and figure.

### Binding future rule

Unless the user explicitly authorizes a new figure:
- use the canonical source figure,
- do not silently create a replacement guide,
- do not replace it with a "cleaner" AI redraw,
- high-resolution re-export is allowed if content is unchanged.

If a canonical figure is insufficient:
1. first repair prose,
2. repair figure timing/order,
3. repair the question,
4. only then discuss whether a new figure is actually needed.

Do not solve a pedagogy problem by inventing a new diagram without an explicit decision.

---

## 7. A figure must exist before the lesson refers to it

### Defect found

The App sometimes said things such as:

> 図6を見ると…

before Figure 6 was actually visible.

### Why this fails

For a beginner, "look at Figure N" is an instruction.
If the figure is absent, the learning chain immediately breaks.

### Future rule

For every textual reference `図N`:
- the corresponding figure must already be visible,
- or it must be inserted immediately before the dependent sentence/question.

This should be testable:
- first textual mention of `図N` must occur after the `fig-N` block.

---

## 8. Figure quality is part of correctness

The user also caught blurred figures.

A technically loaded image is not enough.

Before acceptance:
- verify source resolution,
- do not upscale a low-resolution raster,
- check line and label readability at phone width,
- verify that no crop/mask hides required content,
- inspect the real rendered image, not only file dimensions.

For Chapter 1, canonical figures are preserved from the original archive and exported at high resolution without semantic redraw.

---

## 9. Concepts and figure reading should be interleaved when the concept is visual

An older rigid pattern was:

```text
knowledge check
→ figure reading
→ example
→ review
```

The user rejected this as a universal pedagogy sequence.

For concepts such as:
- vectors,
- displacement,
- velocity direction,
- graph interpretation,

the figure is part of the concept itself.

### Future rule

Choose representation order by concept dependency, not by schema section name.

A useful internal model is:

`P / V / Q / R / M / G / T`

Phenomenon / Visual / Quantity / Relation / Math / Graph / Transfer.

Different concepts may require different orders.

Schema labels may remain internally for compatibility, but the learner-facing flow should feel like one continuous lesson.

---

## 10. Math must look right, not merely compile

### Defects found

Examples included:
- raw/red uncompiled math,
- combined subscript problems,
- messy radicals,
- average velocity rendered with an average bar and vector arrow stacked awkwardly,
- duplicate/repeated formula presentation.

### Why this matters

Learners read notation visually.
A symbol that is mathematically interpretable but visually malformed still damages comprehension.

### Future rule

Math QA has three levels:

1. **semantic** — the equation is correct,
2. **compile** — KaTeX/renderer has zero errors,
3. **visual** — the rendered symbol is natural and readable.

For average velocity, the user preferred one clean vector mark with an avg label rather than stacked marks:
`\vec{v}_{\mathrm{avg}}`.

Do not assume "renderer accepted the LaTeX" means the notation is finished.

---

## 11. Avoid passive duplication, but allow purposeful retrieval

The user also caught repeated formulas.

The distinction is:

### Bad repetition
The same completed equation is shown again immediately with no new task or interpretation.

This wastes space and makes the lesson feel generated.

### Good repetition
A previously learned relation reappears as a deliberate recall/application step in a worked example.

For example:
- first teach `Δr=r2-r1`,
- later ask the learner to retrieve it when solving a real example.

That is transfer, not duplication.

### Future rule

When a formula repeats, ask:

> Is the learner doing something different with it this time?

If no, remove or merge it.
If yes, make that new learning purpose explicit.

---

## 12. Student UI must not expose authoring structure

Internal identifiers such as:
- 1A / 1D,
- A9 / D4,
- parser/version names,

are useful for development but are not teaching content.

The user noticed old internal labels appearing in the App.

### Future rule

Keep stable internal IDs for code/tests, but learner-facing:
- titles,
- prose,
- prompts,
- error states,
- choice panels

must not leak authoring metadata.

---

## 13. Mobile-first means no hidden paper calculation

The user repeatedly evaluated the lesson on a phone.

Therefore future derivations must assume:
- the learner may have no paper,
- no pen,
- no second screen,
- limited horizontal width.

The App itself must show enough intermediate reasoning to follow the derivation.

But:
- "show more steps" does not mean "make every step a question".

The target is:

```text
visible derivation detail ↑
unshown cognitive jumps ↓
interaction only at meaningful checkpoints
```

---

## 14. Scope control is a design rule

Another important lesson from the 1A correction was procedural.

When the user said:
- only this first section,
- only this derivation,
- keep the other holes,
- only add these two holes,

the correct engineering behavior is to freeze that scope.

### Future rule

Do not generalize a local user correction without approval.

Before editing, write the scope mentally as:

```text
CHANGE:
  exact region / exact behavior

KEEP:
  neighboring content
  existing accepted holes
  other derivations
  other chapters
```

If the user says "only these two places", changing a third place is a defect even if the third change seems reasonable.

---

## 15. Separate audit mode from repair mode

During Chapter-1 QA, the user repeatedly asked to first find all defects and only then repair them.

Future workflow must distinguish:

### Audit mode
- list defects,
- classify them,
- do not patch symptoms while the audit is still open.

### Repair mode
- freeze the accepted defect list,
- fix in controlled order,
- test after each logical group.

If the user explicitly wants one-by-one correction, keep a running defect ledger and do not silently expand the scope.

---

## 16. Real browser review is a mandatory final layer

Unit tests can verify:
- item counts,
- IDs,
- formulas,
- figure paths,
- metadata.

They cannot fully verify:
- whether two cards look fragmented,
- whether a symbol feels visually wrong,
- whether a figure appears at the right moment on a phone,
- whether the lesson feels like learning rather than clicking.

Therefore the release ladder is:

```text
source/data correct
  ↓
unit/data/math tests
  ↓
mobile browser
  ↓
desktop browser
  ↓
production build
  ↓
Pages deploy
  ↓
USER HANDS-ON QA
```

Do not collapse the final two states:
- "deployed successfully"
- "pedagogically approved by the user"

They are different.

---

## 17. Regression gates learned from Chapter 1

Future chapter work should keep or reproduce equivalent gates for:

### Figures
- canonical source mapping,
- no unauthorized generated replacement,
- adequate resolution,
- first textual mention after figure insertion.

### Math
- zero KaTeX errors,
- no raw LaTeX leakage,
- notation normalization regression tests,
- visual spot check for complex notation.

### Derivations
- one semantic derivation group,
- one outer visual frame,
- no per-line card borders inside a continuous derivation.

### Holes
- every hole has a purpose,
- every answer exists explicitly,
- every hole is actually referenced by the learner flow,
- no answer leakage immediately before the question,
- local user-approved interaction sequence is regression-tested.

### UI
- mobile and desktop browser tests,
- no internal authoring labels in student UI,
- wrong answer does not resolve the item,
- hints do not reveal the answer immediately.

---

## 18. Anti-patterns to reject before coding

Reject these patterns during design review:

- "There is a formula, so make part of it a hole."
- "The figure is unclear, so silently draw a new one."
- "Each equation deserves its own card."
- "The test passes, so the screen must be fine."
- "More holes means more learning."
- "Fewer holes means cleaner pedagogy."
- "A repeated formula is always redundant."
- "A repeated formula is always useful review."
- "The renderer compiled, so notation is acceptable."
- "This local correction should probably be applied everywhere."
- "The learner can fill the missing derivation on paper."

All of these ignore the actual learning action and context.

---

## 19. Pre-implementation checklist for future chapters

Before writing code, answer these questions:

1. What is the learner supposed to understand at this point?
2. What representation should come first: phenomenon, figure, quantity, relation, equation, graph, or transfer?
3. Is every needed figure visible before it is referenced?
4. Is the figure canonical and readable?
5. What is one complete reasoning chain here?
6. Does the UI preserve that chain as one visual object?
7. For every proposed hole, what exactly does the learner practice?
8. Is a repeated relation being reused intentionally, or merely duplicated?
9. Are enough intermediate steps visible for a phone-only learner?
10. Does any internal code/version label leak into student UI?
11. Does the math both compile and look natural?
12. Am I changing only the scope the user approved?
13. What automated regression can encode the accepted rule?
14. After deploy, what still needs human visual/pedagogical QA?

If these cannot be answered, do not batch-generate the chapter yet.

---

## 20. Chapter-1 concrete authority snapshot

Current user-approved lessons reflected in live Chapter 1 include:
- canonical original Figure 1–17 only,
- no unauthorized synthetic guide/confirmation/graph figures,
- figure-before-reference ordering,
- high-resolution source-preserving figure exports,
- one-frame average-velocity worked-example derivation,
- relation + calculation + reuse holes in the first worked example,
- visually cleaned average-velocity notation,
- no internal unit-code leakage,
- mobile + desktop browser regression,
- user re-QA kept separate from automated PASS.

The current 1A average-velocity sequence is:

`A9c relation(Δr)`
→ `A9 numerical result`
→ `A9d relation(Δt)`
→ `A9a numerical result`
→ `A9b velocity numerator reuse`
→ `A10 final velocity`.

This exact sequence is local authority for this worked example.
Its broader lesson is the **reasoning-pattern rule**, not the literal number of holes.

---

## 21. Relationship to other authority files

Use together with:
- `CHATGPT_README_FIRST.md` — project entry point and current authority/status,
- `MASTER_FIRE_DIAGRAM.md` — dependency/status graph,
- `LEARNING_TEXT_WRITING_RULES.md` — prose and learning-flow rules,
- `FORMULA_DERIVATION_RULES.md` — derivation and formula-hole rules,
- `P39_LIVE_APP_DEFECT_AUDIT.md` — concrete defect evidence,
- `WORKLOG.md` — chronological implementation record.

If an older historical snapshot conflicts with an explicit later user-QA correction, the later user-QA correction wins.

---

## 22. 1B correction — a formula must be used, not merely displayed

User QA of 1B found that the explanatory half was acceptable, but the worked example skipped the actual application of the formulas.

Before correction the App effectively did:

```text
teach vector addition
teach component decomposition
↓
worked example directly states (2.0,1.5)
↓
learner only computes 2.5
```

The learner therefore practiced a final Pythagorean calculation but did not practice velocity composition itself.

Corrected learning pattern:

```text
retrieve composition relation
↓
apply it to two concrete velocity vectors
↓
obtain the combined vector
↓
retrieve magnitude relation
↓
compute speed

then

retrieve decomposition relation
↓
substitute a concrete magnitude and angle
↓
compute x/y components
```

General lesson:
**A formula taught in the concept section needs a later learner action that selects/retrieves and applies it.**
Do not count “the App used the formula on behalf of the learner” as transfer.

The formulas may reappear because the later appearance is retrieval/application rather than passive duplication.

For the next unit, analysis/proposal precedes implementation and requires explicit user review.


---

## 23. 1C planning lesson — reuse 1B magnitude relation as retrieval

During the pre-implementation review of 1C, the user explicitly preferred making the relative-speed magnitude step interactive.

Reason:
the magnitude relation was already learned in 1B, so using it again in the rain/bicycle example is not redundant duplication. It is spaced retrieval across units.

Preferred 1C chain:

```text
choose observer/reference
↓
retrieve relative-velocity relation
↓
compute relative-velocity vector
↓
retrieve previous-unit magnitude relation
↓
compute |v_rel|
↓
interpret direction / physical meaning
```

This establishes an additional design rule:
**when a prior-unit formula is naturally required by a new problem, reuse it deliberately as review/transfer rather than automatically displaying the completed formula.**

The support should normally be weaker than at first introduction, because the goal is retrieval rather than concept construction.

---

## 24. 1C implementation — solution order + cross-unit retrieval

The approved 1C change implements two accumulated lessons at once:

1. **solution planning comes before calculation** — “who is the observer?” is decided before subtracting velocities;
2. **cross-unit retrieval is real review** — after obtaining the relative-velocity vector, the learner retrieves the magnitude relation from 1B instead of being handed 10√2.

The final rain/bicycle reasoning chain is:

```text
choose observer/reference
→ retrieve relative-velocity relation
→ substitute vector components
→ compute relative-velocity vector
→ retrieve previous-unit magnitude relation
→ compute relative speed
→ interpret direction with canonical Figure 8
```

This is preferable to asking only for the final vector or displaying the magnitude automatically, because both would let the App perform the central transfer step on the learner’s behalf.

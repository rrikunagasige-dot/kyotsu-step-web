# P35 — Physics Textbook Mode Pedagogy Rules

Status: **P35 PASS — AUTHORITATIVE PEDAGOGY RULESET**

Date: 2026-09-29

Inputs:
- P33 Chapter-1 representation/dependency map
- P33-passed Chapter-1 v2.1 learning text
- P34 current-app contradiction audit
- LEARNING_TEXT_WRITING_RULES.md
- FORMULA_DERIVATION_RULES.md

This document controls **learning architecture**.
It does not prescribe application implementation details.

---

## 1. Core invariant

A learning unit is not a list of questions.

It is a continuous teaching narrative in which some important reasoning steps are made interactive.

```text
natural lesson
   +
meaningful learner decisions
   =
textbook mode
```

If all holes are resolved, the unit must read as a coherent lesson without feeling like a stitched quiz bank.

---

## 2. One-step learnability

Every interactive step must be answerable from:

1. visible evidence on the current screen,
2. knowledge explicitly established earlier in the unit/chapter,
3. ordinary background mathematics that can reasonably be recalled or looked up on a phone.

A step fails if it requires:
- an unintroduced physics term,
- an unstated physical assumption,
- two or more hidden algebra/physics jumps,
- guessing what the author had in mind.

The question should ask for **one meaningful reasoning action at a time**.

---

## 3. Question-purpose gate

Every hole/item must have a declared purpose.

Allowed purposes are the H1–H6 set:

- H1 meaning judgment,
- H2 relation judgment,
- H3 representation conversion,
- H4 strategy / next-step judgment,
- H5 physical boundary / condition judgment,
- H6 meaningful mathematical operation.

If an item cannot be explained in teacher terms and calculation terms, remove it.

Do not create items to:
- increase item count,
- make every line clickable,
- split one already-understood relation into bookkeeping fragments,
- test vocabulary before teaching its meaning,
- ask the same thing in nearly identical form.

---

## 4. Meaning before terminology

For a new physics term:

```text
phenomenon / figure / relation
↓
construct meaning
↓
teach the name
↓
reuse the name later
```

Never use:

```text
unknown term appears in four choices
↓
learner guesses
```

as concept introduction.

A later retrieval question about the term is allowed after the meaning has been established.

---

## 5. Representation timing

Text, figure, formula, and graph are not separate mandatory sections.

Use the representation when the concept requires it.

Examples:
- displacement: figure and arrow relation during concept formation,
- velocity components: triangle/figure next to the projection relation,
- constant acceleration: v-t graph before deriving displacement formulas,
- horizontal projectile: strobe figure before concluding independent x/y motion,
- terminal velocity: force evolution and v-t graph inside the causal explanation.

Do not defer a concept-forming figure to a later generic “figure reading” section.

---

## 6. Mobile-first derivation

Assume the learner may have:
- only a phone,
- no paper,
- no pen,
- no second screen.

For every nontrivial formula, normally show:

```text
why the formula is needed
↓
parent relation
↓
physical condition / substitution
↓
substitution
↓
readable intermediate step(s)
↓
final expression
↓
physical meaning
```

More derivation does **not** imply more holes.

---

## 7. Interaction density

The current Chapter-1 v2.1 is the reference density:
- 1A–1G,
- 17 figures,
- 54 justified holes.

This is not a hard numerical quota.

The hard rule is:

> Every extra interaction must add a new reasoning function.

Do not preserve old item counts for compatibility.
Do not invent replacement holes when an unjustified hole is removed.

---

## 8. Scaffold levels

Use a fading scaffold rather than the same four-choice strength everywhere.

### S0 — teach/read

Use when:
- a new technical name must be introduced,
- the learner cannot infer it yet,
- explanation itself is the learning event.

### S1 — strong guided choice

Use when:
- the learner is constructing a new concept,
- evidence is directly visible,
- distractors separate fundamentally different meanings.

### S2 — relation/representation choice

Use after the concept exists:
- translate figure ↔ prose ↔ formula,
- choose an important relation,
- choose a physical condition.

### S3 — strategy / derivation decision

Use in worked reasoning:
- which quantity to find first,
- what condition to impose,
- what variable to eliminate,
- what relation to substitute.

### S4 — transfer with reduced support

Use the same concept in a changed context.
Choices may be closer, fewer cues may be repeated, and the learner must reconstruct more of the chain.

### S5 — self reconstruction

End-state goal:
- explain the relation,
- rebuild the solution path,
- solve with minimal or no choice support.

The current app may not implement every UI form yet; P35 defines the pedagogical target.

---

## 9. Scaffold fading rule

For one concept, do not repeatedly ask the same strong four-choice question.

Preferred path:

```text
meaning construction
→ name
→ representation relation
→ formula relation
→ strategy/application
→ transfer
→ minimal-support reconstruction
```

A repeated question is justified only if at least one changes:
- representation,
- context,
- required reasoning,
- retrieval interval,
- integration with another concept.

---

## 10. Wrong-answer progression

Wrong answers must remain unresolved.

Do not immediately reveal the correct answer.

Recommended progression:

### first wrong attempt

- keep the hole unresolved,
- no correct answer,
- give a short reasoning cue,
- point back to the relevant evidence.

### second wrong attempt

- highlight the exact figure / sentence / parent equation needed,
- give a more concrete hint,
- still do not auto-fill the correct answer.

### later repeated error

- reduce the problem by restoring a prerequisite,
- optionally remove one layer of reasoning,
- show a worked micro-step if necessary,
- preserve the learner's chance to make the final decision.

A separate explicit “show explanation / give up” action may reveal the result, but repeated clicking through choices must not be the intended learning strategy.

---

## 11. Retry must not become brute force

If four options can simply be clicked until one works, the interaction has failed pedagogically.

The system should treat errors as evidence about which prerequisite or representation needs support.

Future mastery/error tracking should distinguish:
- concept misunderstanding,
- sign error,
- representation mismatch,
- wrong strategy,
- algebra slip,
- vocabulary confusion.

Do not count a lucky final click as equivalent to first-try understanding.

---

## 12. Transfer / retrieval rule

New knowledge should normally be used soon after acquisition.

Preferred:

```text
learn meaning
↓
use it within the next few events
↓
use it again after a representation/context change
↓
later retrieve it with weaker support
```

Final review should recombine ideas, not replay the same item text.

Example:
- learn displacement from arrows,
- use displacement to build average velocity,
- later decide “find displacement first” in a numerical problem.

---

## 13. Leakage gate

Before an item is shown, inspect every channel:

- unit title,
- section title,
- heading,
- surrounding prose,
- formula before/after the hole,
- figure label,
- caption,
- alt text,
- note/callout,
- mask aria label,
- previously revealed answer.

The item fails if the answer is available by reading metadata rather than reasoning.

A visual mask does not solve leakage if alt/caption/ARIA exposes the answer.

---

## 14. Figure rule

Every figure must have one role:

- concept-forming,
- inference,
- explanatory / confirmation.

A figure can change role across stages, but the role must be intentional.

Do not ask the learner merely to transcribe printed labels unless label recognition itself is the learning goal.

When an answer-bearing label is masked:
- the visible figure must not reveal it elsewhere,
- caption/alt/ARIA must not reveal it,
- the mask must cover the complete answer glyph,
- resolution must map one-to-one to the intended item.

---

## 15. Formula rule

Every important formula should have:
- a role: concept-forming / representation / calculation / verification,
- a parent relation,
- an introduction point,
- a physical interpretation,
- a later use.

Do not treat a formula as complete pedagogy merely because it is mathematically correct.

A formula that appears as:

```text
formula = [hole]
```

without visible parent reasoning is normally insufficient for a beginner-facing lesson.

---

## 16. Worked-example rule

A worked example must preserve the reason for each step.

```text
target
↓
what to find first
↓
why
↓
equation
↓
substitution / transformation
↓
result
↓
meaning / check
```

Good holes:
- strategy,
- physical condition,
- key substitution,
- meaningful transformation,
- interpretation.

Bad holes:
- every arithmetic operation,
- repeated unit conversion,
- trivial copying of a number already visible.

---

## 17. Section metadata is not pedagogy order

Legacy roles may remain in the schema:

- concept,
- figure-reading,
- worked-example,
- review.

They must not force the learner to encounter content in that order.

A future data representation may keep those labels for compatibility, but the rendered learning flow must follow concept dependency.

---

## 18. Student mode vs audit mode

Student mode:
- natural progressive reveal,
- unresolved wrong answers,
- scaffold fading,
- no answer leakage.

Developer audit mode (specified fully in P38):
- jump to any node,
- reveal states,
- mask on/off,
- inspect alt/caption,
- inspect formula-only / figure-only views,
- do not save learner progress.

Do not weaken student pedagogy merely to make developer inspection easier.

---

## 19. Anti-regression mapping to P34

| P34 contradiction | P35 prevention rule |
|---|---|
| C01 fixed section template | §5, §17 |
| C02 figure separation | §5, §14 |
| C03 179-item fragmentation | §3, §7 |
| C04 first-exposure terminology | §4 |
| C05 title/heading leakage | §13 |
| C06 alt/caption leakage | §13, §14 |
| C07 duplicate 1A micro-items | §3, §9, §12 |
| C08 1B missing projection derivation | §6, §15 |
| C09 1C terminology hole | §4 |
| C10 1D missing v-t graph | §5, §14 |
| C11 1D missing derivations | §6, §15 |
| C12 1E strobe wrong timing | §5 |
| C13 1E missing formula | §15 |
| C14 1E compressed elimination | §6, §15 |
| C15 1F incomplete formula chain | §6, §15 |
| C16 1F alt leakage | §13, §14 |
| C17 1G model definition | §2, §15 |
| C18 1G split figures | §5, §14 |

---

## 20. P35 gate judgment

G57 requirements:
- one-step learnability,
- knowledge-generation purpose,
- question purpose,
- scaffold fading,
- wrong-answer hint progression,
- transfer / retrieval.

All are defined above.

**G57 PASS.**

**P35 PASS.**

Next:
`P36 REPRESENTATION INTEGRATION / MASK / LEAKAGE SPEC`

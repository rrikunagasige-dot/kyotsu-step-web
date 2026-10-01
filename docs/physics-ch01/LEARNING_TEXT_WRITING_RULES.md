
# Physics textbook mode — Learning-text writing rules

Status: **USER REVIEWED / ACCEPTED BASELINE — 2026-09-29**

This document records the writing lessons learned from the Chapter 1 rewrite.
It is authoritative for prose construction and hole placement in the physics textbook mode until explicitly superseded.

The accepted prototype is Chapter 1 (1A–1G), using the 17 canonical Chapter-1 figures and 53 inline holes.

---

## 1. Primary invariant

The most important invariant is:

> **If every hole is filled with the correct answer, the result must read as one natural, complete textbook lesson.**

The hole is not a detached quiz card inserted between paragraphs.
The missing part of the sentence or formula **is itself the question**.

Wrong model:

    Explanation.
    [Question card]
    Explanation.
    [Question card]

Target model:

    Natural prose before the missing idea【      】natural prose after it.
    ↓
    learner chooses / reasons
    ↓
    correct answer fills the sentence
    ↓
    the completed sentence remains readable
    ↓
    the lesson continues

Questions therefore belong to the learning narrative rather than interrupting it.

---

## 2. Write the complete lesson before cutting holes

Always work in this order:

    complete hole-free teaching prose
    ↓
    place figures where they are actually needed for understanding
    ↓
    check that concepts and formulas appear in a natural dependency order
    ↓
    identify the small number of important decisions
    ↓
    turn only those decisions into inline holes
    ↓
    place choices after the corresponding prose / equation
    ↓
    collect answers at the end
    ↓
    render the Word and visually audit every page

Do **not** start by making a list of questions and then try to connect them with filler prose.

---

## 3. Human prose rhythm

A good paragraph usually has a reason to exist.
The preferred teaching rhythm is:

    what the learner already knows
    ↓
    what is still missing
    ↓
    why the next idea is needed
    ↓
    observe a phenomenon / figure
    ↓
    read a meaning from it
    ↓
    give a new concept its name when necessary
    ↓
    express the same meaning mathematically
    ↓
    translate the formula back into ordinary language
    ↓
    reuse it in a slightly different situation
    ↓
    create the need for the next concept

Avoid encyclopedic sequences such as definition → definition → formula → formula → example without explaining why each new object is being introduced.

---

## 4. Unknown terminology: meaning before name

Never require the learner to guess an unknown physics term merely because it appears among four choices.

Bad:

    This change of position is called 【 ? 】
    A. displacement
    B. acceleration
    C. velocity
    D. force

when the learner has never been taught the word.

Preferred:

    P1→P2 represents the object's 【change of position】.
    ↓
    This change of position is called displacement, Δr.
    ↓
    Later:
    the quantity describing the change from the initial position to the final position is 【displacement】.

Formal rule:

    construct meaning
    → give the name
    → reuse / retrieve the name later

Choices are instructional scaffolds, not vocabulary lotteries.

---

## 5. Five useful hole types

Every hole should have a clear pedagogical reason.

### H1 — Meaning hole

The learner reads meaning from a phenomenon or figure.

Example:

    The arrow P1→P2 represents the object's 【change of position】.

### H2 — Relation hole

The learner identifies an important relation between quantities.

Example:

    initial position + 【displacement】 = final position

### H3 — Representation-conversion hole

The learner translates figure ↔ language ↔ equation ↔ graph.

Example:

    r1 + 【Δr】 = r2

The goal is not symbol recall; it is translating the arrow relation into mathematics.

### H4 — Strategy / solution-decision hole

The learner decides what must be found next.

Example:

    To calculate the average velocity, first determine the 【displacement】 from the two positions.

This is especially important in worked examples.

### H5 — Meaningful mathematical-step hole

Use a hole when an algebraic step represents an important physical relation.

Example:

    Δr = 【r2 − r1】

Do not fragment routine arithmetic into many holes.

---

## 6. Accepted hole density

The Chapter-1 prototype was explicitly reviewed by the user and the current density was judged appropriate.

Treat this as the default baseline.

A hole is justified when it asks for one of:

- an important conceptual judgment,
- information that must be read from a figure,
- an important relation between quantities,
- a representation conversion,
- a solution-strategy decision,
- an important formula-construction step,
- later retrieval / transfer of an earlier idea.

Do not create holes merely to increase interactivity.

Usually leave these as normal prose:

- conjunctions and grammatical glue,
- trivial arithmetic,
- a second component calculation that merely repeats an already-understood first component,
- the same definition repeated several times,
- obvious bookkeeping,
- every line of an algebra derivation.

The learner should feel that each hole is worth stopping for.

---

## 7. Figure placement

A figure is not a separate section type.
It belongs at the point where the learner needs it.

A figure may be:

1. **concept-forming** — the learner needs it to form the concept,
2. **inference** — the learner must read information from it,
3. **explanatory** — it confirms or summarizes something already understood.

If the figure contains the answer directly, do not show the revealing version before the hole.
Use one of:

- a masked version,
- a pre-label version,
- the figure after the answer as confirmation.

Text and figure should be spatially close enough that the learner does not need to remember one while searching for the other.

---

## 8. Formula writing

A formula should normally arise because the prose has created a need for it.

Preferred:

    Go from O to P1, then from P1 to P2.
    That reaches the same endpoint as O to P2.

    r1 + Δr = r2

    In words:
    initial position + change of position = final position.

After displaying a formula, return to ordinary language and state its physical meaning.

Classify formulas when designing:

- concept-forming,
- representation,
- calculation,
- verification.

Do not present a formula merely because it exists in the source textbook.

---

## 9. Choice placement

The prose must remain visually readable.

Current accepted pattern:

- the hole stays inside the sentence/equation,
- choices appear after the relevant sentence or short paragraph,
- choices do not replace the prose,
- the completed answer remains in the sentence after resolution,
- answer keys are collected separately at the end in the review Word.

In the application, equivalent UI may be used as long as the same reading continuity is preserved.

---

## 10. Wrong-answer compatibility

A wrong answer must not destroy the paragraph.

The target behavior remains:

    wrong
    → hole remains unresolved
    → correct answer is not immediately exposed
    → learner gets another reasoning opportunity / later hint progression
    → only correct resolution completes the sentence

The prose around the hole must therefore make sense both before and after resolution.

---

## 11. Continuous dependency

Each important hole should preferably produce knowledge that is used shortly afterward.

Example:

    figure → "change of position"
    ↓
    name it displacement
    ↓
    use Δr in the arrow relation
    ↓
    construct r1 + Δr = r2
    ↓
    derive Δr = r2 − r1
    ↓
    reuse displacement when constructing average velocity

Avoid isolated questions whose answers never matter again.

---

## 12. Worked examples

Worked examples must read like a real solution, not a bag of blanks.

Preferred flow:

    what is being asked
    ↓
    which known quantity / principle is needed first
    ↓
    why that step is appropriate
    ↓
    equation
    ↓
    necessary transformation
    ↓
    result
    ↓
    what the result means

Good holes focus on:

- the quantity to find first,
- principle selection,
- a key formula relation,
- a meaningful transformation,
- the final interpretation.

Do not turn every substitution or arithmetic operation into a separate question.

---

## 13. Final prose audit

Before accepting a unit, read it twice.

### Pass A — no-hole reading

Imagine every answer is already filled in.

Check:

- Does it read as ordinary human-written teaching prose?
- Does each paragraph create a reason for the next paragraph?
- Are transitions natural?
- Does the text explain why a formula appears?
- Are there unexplained terms?
- Does it sound like notes generated from a schema rather than a lesson?

If the prose is bad without holes, do not fix it by adding more holes.

### Pass B — learner reading

Now restore the holes.

For every hole ask:

1. What is the learner expected to think about?
2. Is the evidence needed to answer already available?
3. Is this knowledge genuinely worth stopping for?
4. Does the answer complete the sentence naturally?
5. Is the new knowledge used afterward?
6. Is the answer leaked by a title, figure, caption, formula, alt text, or nearby prose?
7. Would removing this hole make the lesson better? If yes, remove it.

---

## 14. Chapter-1 accepted prototype

The first 2026-09-29 prose review established the baseline:

- Chapter 1: 1A–1G
- 17 canonical figures
- 53 inline holes
- natural continuous prose
- unknown terminology taught meaning-first
- choices placed after the corresponding prose
- answers collected at the end
- full Word rendered to 25 pages and visually checked
- user feedback: prose quality is good and hole density is about right

Generator:

scripts/physics-textbook/build_ch1_learning_docx.py

The generator is a reproducibility artifact, not the pedagogical authority.
If generator behavior and this document disagree, fix the generator to follow this document.

---

## 15. Anti-regression rule

Future agents must not silently revert the textbook mode to a universal:

    knowledge check
    → separate figure-reading block
    → separate worked example
    → review

Those can remain schema labels for compatibility, but the actual learning text must follow conceptual dependency and natural prose.

---

## 16. Current formula-derivation-strengthened checkpoint — v2.1

The natural-prose rule above remains valid.

A later mobile-first review found that some formulas, especially in 1D–1G, still required too much unshown reconstruction. The current content checkpoint therefore strengthens derivation detail while keeping interaction density approximately stable.

Current checkpoint:

- `prototypes/CH1_LEARNING_TEXT_V2_1.md`
- 17 canonical figures
- 54 unique inline holes
- formula derivation strengthened mainly in 1D–1G

Read `FORMULA_DERIVATION_RULES.md` for the mandatory mobile/no-paper rule and H1–H6 hole-placement test.

Key distinction:

    derivation detail ↑
    cognitive jumps ↓
    hole density ≈ stable

Do not confuse “show more intermediate mathematics” with “turn more mathematics into holes.”



### v2.1 hole-density note

The old C1 first-exposure terminology hole was removed because the learner was being asked to guess a new physics name rather than construct meaning. No replacement hole was added merely to preserve count. The current 54-hole density remains the accepted baseline: interaction count is subordinate to teaching purpose.

---

## 17. P33-passed Chapter-1 v2.1

Current source:
`prototypes/CH1_LEARNING_TEXT_V2_1.md`

Current counts:
- 1A–1G
- 17 canonical figures
- 54 justified inline holes
- 26 rendered pages

The count decreased from 55 because the first-exposure C1 vocabulary lottery was removed rather than replaced artificially.

P33 source-alignment repairs are complete. The natural-prose invariant and moderate interaction-density rule remain unchanged.


---

## 18. Mandatory companion: Chapter-1 user-QA lessons

Before authoring or restructuring a future chapter, also read:

`CH1_USER_QA_DESIGN_LESSONS.md`

Especially binding:
- visual/figure reasoning may be interleaved with concept formation,
- one semantic derivation must remain one visual chain,
- a hole is justified by the learning action, not by a target count,
- repeated relations are allowed when they serve deliberate transfer/application,
- local user-approved patterns must not be generalized automatically.

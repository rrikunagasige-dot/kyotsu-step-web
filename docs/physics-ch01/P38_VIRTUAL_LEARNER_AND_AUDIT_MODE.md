# P38 — Virtual Learner Simulation + Developer Audit Mode Specification

Status: **P38 PASS — USER REVIEW REQUIRED BEFORE P39**

Date: 2026-09-29

Inputs:
- P33-passed Chapter-1 v2.1 source
- P35 pedagogy rules
- P36 representation integration spec
- P37 1A redesign data

P38 has two jobs:
1. simulate whether a learner can traverse the redesigned 1A without hidden physics jumps,
2. specify a developer-only audit mode that can inspect content states without damaging student learning behavior.

No application code is changed in P38.

---

## 1. Learner assumption

The simulation does not require a learner to derive the chapter from middle-school knowledge alone.

Assume:
- ordinary background knowledge is available,
- general mathematics may be recalled or looked up on a phone,
- the learner does not have to possess paper or a pen,
- new physics meaning must still be constructed by the lesson itself.

The simulation asks whether each next physics decision has sufficient evidence.

## 2. 1A happy-path simulation

| Node | What learner already knows | Visible evidence | Learner action | Knowledge after resolution | Result |
|---|---|---|---|---|---|
| A1 | a point can mark where an object is; an arrow connects O to P1 | setup + neutral fig-1 | choose that O→P1 represents position | an arrow from a reference point can represent position; then term position vector and r1 are taught | PASS |
| A2 | r1/r2 represent two positions | P1→P2 arrow in same semantic figure | identify it as position change | meaning of displacement is constructed; term displacement and Δr are then taught | PASS |
| A3 | meanings of r1, r2, Δr | three connected arrows O→P1, P1→P2, O→P2 | complete r1+[Δr]=r2 | visual arrow composition and formula are linked; Δr=r2-r1 follows visibly | PASS |
| A4 | displacement means later position minus earlier position; coordinate pairs | r1=(x1,y1), r2=(x2,y2) | apply later-minus-earlier to x component | Δx=x2-x1; full y component is then shown without repetitive extra question | PASS |
| A5 | two event times t1,t2 | prose asks for elapsed time between them | complete Δt=t2-t1 | elapsed time relation | PASS |
| A6 | displacement and elapsed time | motivation: same displacement can take different durations | choose Δr/Δt for unit-time position change | average velocity relation and meaning | PASS |
| A7 | average velocity over a finite interval | fig-2 shows shrinking interval on curve | identify limiting direction as tangent | instantaneous velocity is introduced with limit formula; fig-3 confirms tangent directions | PASS |
| A8 | velocity is a vector; speed is magnitude | explicit contrast v⃗ vs |v⃗| | choose which includes direction | stable distinction velocity vs speed | PASS |
| A9 | goal is numerical average velocity; earlier dependency chain | problem statement with two positions and two times | choose displacement as first quantity | solution planning: position → displacement → average velocity | PASS |
| A10 | Δr and Δt have been visibly calculated | completed intermediate calculations | select final average velocity | transfer of the whole chain into a numerical context | PASS |

Happy-path result: **10/10 PASS**.

## 3. Hidden-jump audit

### A1
No unknown physics word is required. 'Position vector' is taught after the meaning is constructed.

### A2
No vocabulary lottery. The learner answers 'position change', then receives 'displacement'.

### A3
The answer is in the geometry, not in a nearby printed formula. Figure labels/caption must be staged according to P36.

### A4
Only the x component is interactive. The y component repeats the same rule and remains visible, avoiding artificial repetition.

### A5–A6
Elapsed time is established before average velocity. Numerator/denominator are not split into extra micro-items.

### A7
The figure provides the geometric evidence. The limit notation is explained in prose and may be treated as ordinary mathematics.

### A8
The relation is semantic, not vocabulary-only: vector vs magnitude.

### A9–A10
The example asks first for strategy and then for transfer. Routine subtraction/division is visible rather than hidden behind multiple clicks.

Hidden-jump result: **PASS**.

## 4. Wrong-answer simulation

P38 also checks whether a wrong answer can generate support without revealing the result immediately.

### Case W1 — A3 vector relation

First wrong attempt:
- keep A3 unresolved,
- cue: 'Start at O. Which two arrows are traversed to reach P2?',
- visually emphasize O→P1 and P1→P2 without revealing the formula token.

Second wrong attempt:
- emphasize the endpoints of the two arrows,
- hint: 'The end of the first arrow is the start of the second.'

Later support:
- show the verbal relation 'initial position + position change = final position',
- learner still fills the symbol Δr.

Result: **PASS — support can increase without auto-answering.**

### Case W2 — A7 tangent direction

First wrong attempt:
- keep answer unresolved,
- animate/highlight the secant between two nearby curve points.

Second wrong attempt:
- move the second point visually closer to P1,
- hint: 'Watch which direction the connecting line approaches.'

Later support:
- show a faint tangent guide but keep the word answer unresolved.

Result: **PASS**.

### Case W3 — A9 solution strategy

First wrong attempt:
- cue: 'Average velocity needs a change in position and a change in time.'

Second wrong attempt:
- highlight the two coordinate positions,
- ask which quantity can be obtained from those two positions first.

Result: **PASS**.

## 5. External-lookup boundary

Phone lookup is allowed for ordinary background mathematics.

Examples that may be externally supported without failing the lesson:
- what a limit symbol means,
- coordinate subtraction reminder,
- basic vector/magnitude mathematics.

Examples that may **not** be outsourced by the 1A lesson:
- what physical quantity P1→P2 is meant to represent,
- why that becomes displacement,
- why displacement enters average velocity,
- why instantaneous velocity follows the tangent in the shrinking-interval picture.

Those are chapter-internal physics dependencies and are supplied by the lesson.

## 6. Mobile reading simulation

Pass conditions:
- every question is adjacent to its necessary evidence,
- no step requires paper reconstruction of two hidden equations,
- figures and formulas appear locally,
- routine derivation is visible,
- the learner need not jump to a separate figure-reading section.

1A P37 design: **PASS**.

## 7. Developer Audit Mode — purpose

Audit mode exists to inspect learning content quickly.

It is not student mode and must never change the student's pedagogy merely for developer convenience.

Primary use cases:
- inspect one event without completing previous events manually,
- test unresolved/wrong/resolved states,
- inspect masks and leakage,
- compare mobile and desktop layout,
- inspect representation links,
- verify hint stages.

## 8. Audit mode state isolation

Audit mode must:
- not write learner progress,
- not update mastery/BKT/IRT/CDM evidence,
- not count attempts,
- not update streaks or completion,
- not emit ordinary student analytics events,
- not modify saved hint level,
- not unlock/complete a real learner unit.

Audit state is ephemeral or developer-local.

## 9. Required audit controls

### Navigation
- jump directly to unit / concept / learning event / question ID,
- next/previous semantic event,
- show dependency parents and children.

### Answer state
- force unanswered,
- force wrong-attempt-1,
- force wrong-attempt-2,
- force resolved-correct,
- reset current node.

### Choice / answer inspection
- show/hide choices,
- reveal correct answer explicitly in audit mode,
- show accepted answers / answer type,
- show H1–H6 question purpose and S0–S5 scaffold level.

### Figure inspection
- mask ON/OFF,
- show mask bounds,
- show semantic target ID,
- show pre-answer caption/alt/ARIA,
- show post-answer caption/alt/ARIA,
- show figure role F-CONCEPT / F-INFERENCE / F-EXPLAIN.

### Representation inspection
- normal integrated view,
- text-only,
- figure-only,
- formula-only,
- graph-only when applicable,
- highlight representation links for one concept.

### Hint inspection
- no hint,
- first-error hint,
- second-error hint,
- restored-prerequisite state,
- explicit explanation/give-up state.

### Viewport
- phone narrow preset,
- phone landscape preset,
- tablet preset,
- desktop preset,
- optional custom width.

## 10. Leakage inspector

Audit mode should show a developer-only leakage panel for the active question:

    title
    section title
    heading
    preceding prose
    following prose
    formula
    figure pixels/masks
    caption
    alt
    ARIA/mask label
    note/callout
    already-resolved semantic facts

Each channel can be marked:
- PASS
- INTENTIONAL RETRIEVAL
- LEAK
- NOT APPLICABLE.

Audit mode should make answer-bearing strings easy to locate, but this metadata is never shown to students.

## 11. Representation inspector

For the active node show:
- conceptId,
- primary representation,
- supporting representation IDs,
- prerequisite concepts,
- visible evidence,
- knowledge gained,
- next dependencies,
- formula parent relation,
- figure role,
- synchronized reveal links.

This is the operational view of P33/P36 metadata.

## 12. Mask inspector

For every mask show:
- maskId,
- figureId,
- linked questionId,
- semantic answer ID,
- normalized x/y/width/height,
- pre-answer screenshot,
- post-answer screenshot,
- mobile/desktop coverage state.

Developer controls may outline the mask region, but student mode must not.

## 13. Audit-mode acceptance checks for 1A

| Check | Expected |
|---|---|
| Jump A1→A10 without completing prior nodes | allowed in audit only |
| Force wrong A3 | unresolved + hint stage visible |
| Force correct A3 | formula + linked representation reveal |
| Mask inspection | no title/caption/alt/ARIA leakage |
| Phone viewport | question/evidence locally co-present |
| Text-only view | natural prose remains understandable where figure is not essential; essential-figure dependency is flagged |
| Figure-only view | semantic role and linked question visible to developer |
| Student progress after audit | unchanged |

## 14. P38 gate judgment

G60 requires:
- virtual learner traversal under the corrected background-knowledge assumption,
- no hidden physics dependency,
- wrong-answer support path,
- mobile/no-paper viability,
- developer audit-mode specification.

Results:
- A1–A10 happy path: 10/10 PASS,
- hidden-jump audit: PASS,
- wrong-answer simulations: PASS,
- mobile reading simulation: PASS,
- audit-mode specification: COMPLETE.

**G60 PASS.**

**P38 PASS.**

## 15. Stop condition

The next node is **USER REVIEW**.

Do not start P39 implementation until the user explicitly approves moving from the paper/data/audit design into application code.

Current line:

    P33 PASS
      ↓
    P34 PASS
      ↓
    P35 PASS
      ↓
    P36 PASS
      ↓
    P37 PASS
      ↓
    P38 PASS
      ↓
    USER REVIEW  ← CURRENT
      ↓
    P39 CODE IMPLEMENTATION [BLOCKED]

# P39 Hole Quality Audit — Chapter 1

Status: **R4 PASS — 45 REASONING INTERACTIONS DEPLOYED**

Date: 2026-09-29

Purpose:
Every interactive blank must justify why the learner should stop and think.
Hole count is not a quality metric.

Judgment:
- KEEP = current learning purpose is meaningful.
- REWRITE = keep an interaction here, but ask a better question.
- REMOVE = show the step directly; interaction adds little learning value.

---

| ID | Judgment | Reason / replacement target |
|---|---|---|
| A1 | KEEP | concept formation: arrow from origin → position |
| A2 | KEEP | concept formation: position change before naming displacement |
| A3 | KEEP | figure ↔ vector relation |
| A4 | KEEP | first transfer from vector displacement to coordinate component |
| A5 | REMOVE | elapsed time t₂−t₁ is background arithmetic, not physics reasoning |
| A6 | KEEP | definition/meaning of average velocity |
| A7 | KEEP | geometry → instantaneous velocity tangent |
| A8 | REWRITE | current prose already states the answer; ask before the definition through direction-vs-magnitude contrast |
| A9 | KEEP | solution planning: displacement before average velocity |
| A10 | KEEP | final transfer; one numerical vector result is useful |
| B1 | KEEP | phenomenon → vector sum |
| B2 | REWRITE | combine B2+B3 into one component-pair decision |
| B3 | REMOVE | redundant once B2 is rewritten as the pair |
| B4 | REMOVE | Pythagorean magnitude reconstruction is ordinary mathematics and can be shown |
| B5 | REMOVE | prose already states “subtract = add opposite vector”; background vector algebra |
| B6 | KEEP | compact transfer example |
| C2 | KEEP | central relative-velocity relation |
| C3 | KEEP | conceptual consequence: same velocity → stationary relative motion |
| C4 | KEEP | two-dimensional transfer |
| C5 | KEEP | observer/reference-frame decision |
| D1 | KEEP | velocity-change relation |
| D2 | KEEP | acceleration meaning |
| D3 | KEEP | graph slope → acceleration |
| D4 | KEEP | graph area → displacement |
| D5 | REMOVE | immediately repeats the preceding Δv=at statement |
| D4a | KEEP | graph-area decomposition is a meaningful derivation step |
| D7 | REWRITE | replace algebraic rearrangement with parent-relation choice for eliminating t |
| D7b | REMOVE | current final quotient is mechanical once substitution/factorization is visible |
| D8 | KEEP | physical condition F=0 → a=0 |
| D9 | REWRITE | ask which motion relation should be used; show routine arithmetic afterward |
| E1 | KEEP | physical decomposition: no horizontal force → aₓ=0 |
| E2 | REMOVE | once vₓ=v₀ is established, x=v₀t is routine |
| E3 | KEEP | vertical motion relation from physical initial conditions |
| E3a | REWRITE | ask which parent relation gives a time-free vᵧ–y relation |
| E4 | REMOVE | square-root step after v² relation is mechanical |
| E5a | REWRITE | ask which variable must be eliminated / which horizontal relation enables elimination |
| E5 | KEEP | equation shape → parabola |
| E6 | REWRITE | ask which direction determines fall time; show arithmetic afterward |
| F1 | REWRITE | combine F1+F2 into one initial-velocity component-pair decision |
| F2 | REMOVE | redundant after pair question |
| F3 | KEEP | vertical velocity with gravity sign |
| F4 | KEEP | highest-point physical condition |
| F5a | KEEP | choose the parent vertical-position relation for height |
| F6a | REWRITE | replace t rearrangement with equation-pair / elimination decision |
| F6b | REMOVE | coefficient simplification is algebraic cleanup |
| F6 | KEEP | quadratic form → parabolic trajectory |
| F7 | KEEP | factorization + physical non-zero branch reasoning |
| F8a | REMOVE | merely recalls the flight-time result from immediately above |
| F8 | REMOVE | trig-identity cleanup; show it |
| F9 | REWRITE | if interactive, ask the maximizing condition before giving sin2θ=1; do not ask 90°/2 |
| G1 | REWRITE | ask mass-dependence of gravitational acceleration, not the final cancellation token |
| G2 | REWRITE | ask drag direction/model meaning before presenting f=kv |
| G3 | KEEP | force-balance sign is physical reasoning |
| G3a | REMOVE | dividing by m is routine algebra |
| G4 | KEEP | causal interpretation: speed ↑ → drag ↑ → acceleration ↓ |
| G5 | KEEP | transfer back to graph slope meaning |
| G6 | KEEP | terminal-velocity physical condition a=0 |
| G6a | KEEP | apply terminal condition to the force equation |
| G8 | REMOVE | routine calculator arithmetic; numerical value can be shown |

---

## Summary

Audited pre-rewrite interactions: 59

Judgment totals:
- KEEP: 33
- REWRITE: 12
- REMOVE: 14

Important:
REWRITE does **not** mean “make an easier multiple choice”.
It means move the question to a more meaningful reasoning point.

Target interaction count after rewrite is not fixed in advance.
If every REWRITE remains one interaction, the rough count is 45, but the final count may differ.

---

## Rewrite principles

1. Prefer **parent relation selection** over final algebra.
2. Prefer **physical condition selection** over substitution arithmetic.
3. Prefer **what to eliminate / what to hold fixed / which branch is physical** over copying a formula.
4. Repeated symmetric relations should usually be asked once as a pair.
5. Routine rearrangement and calculator arithmetic stay visible in the derivation.
6. A question must not have its answer stated in the immediately preceding sentence.
7. Later units should rely more on transfer and less on vocabulary recall.
8. Formula holes remain important, but only when the missing mathematics represents a real reasoning decision.

---

## Next content-rewrite order

1. 1A: A5 remove, A8 rewrite.
2. 1B: combine B2/B3; remove B4/B5.
3. 1D: remove D5/D7b; rewrite D7/D9.
4. 1E: remove E2/E4; rewrite E3a/E5a/E6.
5. 1F: combine F1/F2; remove F6b/F8a/F8; rewrite F6a/F9.
6. 1G: rewrite G1/G2; remove G3a/G8.
7. rebalance choices and regenerate explicit answer authority.
8. only then implement purpose/scaffold metadata.


## R4 Applied Result

The audit has now been applied to the Chapter-1 source.

Current source target:
- 45 interactive reasoning points,
- 45 explicit answers,
- per-unit counts: 1A=9 / 1B=3 / 1C=4 / 1D=8 / 1E=6 / 1F=8 / 1G=7,
- answer-position distribution: A12 / B11 / C11 / D11.

This status does not declare R4 PASS until the full data/math/browser/build/deploy gate succeeds.

---

## R4 Validation Result

R4 is now fully validated and deployed.

Final interactive count:
- total 45,
- 1A=9 / 1B=3 / 1C=4 / 1D=8 / 1E=6 / 1F=8 / 1G=7.

Every surviving interaction now also has external pedagogy metadata in:
`docs/physics-ch01/prototypes/CH1_INTERACTION_METADATA.tsv`

Runtime pedagogy metadata:
- purpose,
- scaffold level,
- two staged hints.

Scaffold distribution:
- strong: 6,
- medium: 16,
- light: 23.

Final R0–R9 validation:
workflow run 213 / head `5e852790b563717c5e732d0ccdd8380cbd47ae34` / SUCCESS.

The 45 count is a result of the audit, not a target quota.
Future edits must continue to justify each interaction by learning purpose rather than restoring density for its own sake.


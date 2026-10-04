# MATH LEARNING MODE — RESTORATION IMPLEMENTATION PLAN 2026-10-04

Status: **READY TO IMPLEMENT**

Scope:
- math learning mode only
- target review units:
  - math-propositions-reading
  - math-quantifiers-all-exists
  - math-propositions-proof

Out of scope:
- math practice
- physics
- function lesson
- published math-sets
- unrelated shared UI

---

# 1. Frozen master structure

Every concept cycle must read as:

```text
concrete example
→ focus
→ thinking node(s)
→ equation / derivation if needed
→ meaning
→ concept name / notation
→ generalization
→ immediate use
→ fade support
```

Not:

```text
choice
→ choice
→ choice
→ another mini-question
```

---

# 2. Unit restoration summary

## math-propositions-reading

Current:
- revision 1
- 18 interactions

Restored:
- 6 concept cycles
- 14 interactions

Disposition:
- KEEP / MOVE: 14
- MERGE into prose: 4
  - prop-a06
  - prop-a08
  - prop-b03
  - prop-b06

Concept cycles:
1. 命題と p⇒q
2. 反例
3. 必要条件・十分条件
4. 必要十分条件・同値
5. 条件の否定
6. 複合条件の否定 / ド・モルガン

Revision:
- 1 → 2

Reason:
- item topology changes
- learner flow changes
- old progress must be invalidated

## math-quantifiers-all-exists

Current:
- revision 3
- 13 interactions

Restored:
- 4 concept cycles
- 11 interactions

Disposition:
- KEEP / MOVE: 11
- MERGE into prose: 2
  - quant-a01
  - quant-c01

Critical sequence repairs:
- quant-a02 before existential rule
- quant-c02 before universal-counterexample rule

Concept cycles:
1. 「ある」/ witness
2. 「すべて」/ counterexample
3. ordinary sentence with hidden universal scope
4. final faded transfer

Revision:
- 3 → 4

Reason:
- item topology changes
- item order changes
- old progress must be invalidated

## math-propositions-proof

Current:
- revision 2
- 23 interactions

Restored:
- 5 concept cycles
- 23 interactions

Disposition:
- all 23 retained
- a01/a02/a03 moved/reframed
- c00 surrounding prose rewritten

Concept cycles:
1. concrete proposition → reverse/inverse/contrapositive
2. truth-value comparison
3. second example → truth-pair generalization
4. proof by contrapositive
5. contradiction proof → only then name 背理法

Revision:
- 2 → 3

Reason:
- first concept sequence changes
- prompts/flow change
- previous progress should not silently skip restored concept order

---

# 3. Total topology

Before:
- 54 interactions

After first restoration:
- 48 interactions

Removed as standalone panels:
- prop-a06
- prop-a08
- prop-b03
- prop-b06
- quant-a01
- quant-c01

No mathematical content is deleted.
Their conclusions/generalizations remain as textbook prose.

The 6 removed panels are exactly the places where:
- a result was already logically determined by the previous answer, or
- an abstract rule was being asked before the concrete experience.

---

# 4. Implementation order

## Pass A — proposition-reading

1. bump revision 1→2
2. reorganize readingFlow into 6 concept cycles
3. remove item definitions:
   - prop-a06
   - prop-a08
   - prop-b03
   - prop-b06
4. replace them with prose conclusions
5. keep source examples
6. add lightweight role markers only where needed:
   - 例題
   - 今の考え方を整理する
   - すぐ使ってみる
7. avoid excessive headings
8. update unit tests
9. update E2E answers / progression
10. run focused tests before moving to next unit

## Pass B — quantifier

1. bump revision 3→4
2. move quant-a02 before existential generalization
3. merge quant-a01 into prose
4. keep a03 after witness experience
5. move quant-c02 before universal generalization
6. merge quant-c01 into prose
7. keep d01/d02/d03 visually contiguous as one worked example
8. keep e01/e02 as final low-support transfer
9. update tests/E2E
10. run focused tests

## Pass C — proof

1. bump revision 2→3
2. move concrete x²=x⇒x=1 example before abstract p/q operation sequence
3. let a01/a02/a03 operate inside that concrete example
4. introduce reverse/inverse/contrapositive names after operations
5. generalize back to symbolic p/q
6. keep a04–a05 as one truth-comparison worked example
7. keep a06–a08 as immediate transfer
8. preserve B worked proof
9. rewrite contradiction intro so c00 is not pre-answered
10. preserve c00–c05 chain
11. name 背理法 only after the proof
12. update tests/E2E

---

# 5. UI policy during restoration

Do not redesign shared UI unless a content requirement cannot be represented.

Reuse:
- inline blank
- choice panel below current paragraph
- wrong-answer unresolved state
- progressive reveal
- stable choice order
- last wrong choice visible
- mobile one-column math choices
- direct review routes

The problem is primarily content macro-structure, not component architecture.

---

# 6. Test policy

For every unit:

1. concept names must not appear before the defining experience
2. merged items must no longer exist in section.items
3. readingFlow must not reference removed items
4. completed prose must read naturally with no doubled endings
5. first/second hints must not contain primary/accepted answer exactly
6. source example order must remain recognizable
7. unit revision must bump
8. old progress must invalidate via revision mismatch
9. review status remains review
10. direct route remains available
11. normal setup keeps review unit hidden
12. physics/practice regressions remain green

---

# 7. Hands-on target after implementation

The user should feel:

```text
I am following one mathematical idea unfolding.
I answer only when I actually need to think.
After I solve it, the book tells me what that idea is called.
Then I immediately use it once more.
```

The user should NOT feel:

```text
I am answering a sequence of short quiz cards.
```

---

# 8. Promotion gate

After implementation:

- focused unit tests
- full Math textbook CI
- Math practice pilot CI
- Pages QA deployment
- user hands-on QA

Only after user hands-on approval:
- review → published
- remove temporary QA deploy branch trigger
- update PR
- merge only if explicitly requested

# P-001 — Representative four-unit pilot design (conditional draft)
Date: 2026-10-17
Status: RAW-SOURCE-VERIFIED / PILOT-MATH-INDEPENDENTLY-CHECKED / N01-LEARNER-PROSE-IN-REVIEW
User approved: 2026-10-17, Work P-001, pilot IDs N01 N03 N10 N12.

## Zero-th invariant
**Historical note:** original indexed Word text had dropped OMML/graphics. The user reattached the raw .docx on 2026-10-17. Its 397 OMML math objects and 14 original PNGs were recovered; source Q statements for all four pilots and the independent 59-question solutions have now been inspected. Read `SOURCE_OMML_AUDIT.md` and `PILOT_SOLUTION_AUDIT.md`. Separate official answer booklet remains unavailable; learner-facing N01 text is in review. Preserve source provenance and do not claim a live app exists.

## Contract inherited from accepted 集合 textbook
One lesson is a coherent reading line, not a stack of quiz cards:
- Natural motivating example → learner's meaningful micro-decision in existing prose/math → reveal completed prose/formula → formalize **concept** → explain property → prove if necessary → clearly labeled example → use once.
- A question needs an epistemic basis already established; unknown terms are taught rather than guessed.
- First write *hole-free* mathematically complete narrative; only then choose cognitively valuable inline blanks.
- The formula and its derivation occupy **one visual frame**, not repeated boxed fragments. Correct answer auto-completes the original expression. No future explanation or figure reveals an unanswered blank.
- Concepts/definitions black, their names bold; colors reserved for controls/state/feedback. Concept / Proof / Example labels visually distinct, no enormous title stack.
- In mobile UI show current step and just the necessary earlier reasoning result; no massive answer-option lists blocking the text.

## Chapter information architecture
Student-facing H1 candidates: `多項式`, `実数`, `1次不等式`; optional separate `発展`. IDs N01... retained **internally**, not repeated as major learner heading. Bridges:
- N06→N07: "同じ値を保ったまま式の形を変えてきた。今度は数そのものの表し方を比べよう。"
- N10→N11: "これまでは等しい値への変形だった。今度は大小関係が変形でどう保たれるかを考えよう。"
- N14→次章: "展開・因数分解・平方根・不等式の見方は、次の二次関数の変化やグラフを読む道具になる。"
These are preliminary pedagogical bridge candidates from the edited Word (re-check against exact original before publishing).

## Pilot A — N01「係数・次数を読む」 (10 source markers)

### Goal
From concrete algebraic products, discover coefficient/degree as counting/structure; then distinguish an expression's **chosen variable** from the other fixed letters. Extend to like terms, cancellation, polynomial degree and constant term.
Prerequisites: signs, integer operations, products, middle-school variables. No formal "coefficient"/"degree" before need.

### Chain by original question markers
| Original Q | Cognitive operation (source text recovered) | Tentative stage and UI action |
| --- | --- | --- |
| 1 | rewrite a monomial as coefficient × individual factors | inline formula-completion after unpacking one worked example |
| 2 | identify coefficient and degree of three expressions | reasoning selection/short responses after formalization |
| 3 | rewrite expression viewed as polynomial in one chosen variable | inline expression, show other letters as parameters |
| 4 | compare coefficient/degree when focus changes | explanation in one prose+math chain; no memorized names |
| 5 | confirm coefficients under two different chosen variables | transfer/short check after example |
| 6 | group terms by identical literal part | classify into three groups, not three click-card questions |
| 7 | combine like terms from those groups | derived formula in same frame; reuse Q6 result |
| 8 | read degree and constant term after simplification | interpret formula; defer final until Q7 |
| 9 | combine terms of a further expression where higher terms may cancel | inline formula; no reveal of reduced degree |
| 10 | decide polynomial degree and give justification AFTER cancellation | textual reason, not bare number |

### Prior and output
N01/Q1 → formal monomial/coefficient/degree → Q2/Q3/Q4/Q5; Q6→Q7→Q8, Q9→Q10. Output `POLY-LIKE-TERMS` used by N02 and N03.
There is no approved new diagram requirement; compare algebraic products in aligned math not an invented graphic.

### Critical acceptance
Showing term groups or reduced expression before learner solves them is answer leakage. A coefficient changes with selected variable; don't silently conflate total degree and degree w.r.t. chosen variable. Source raw math pending.

## Pilot B — N03「指数・展開」 (13 source markers, N03-F01)

### Goal
Derive exponent laws from counting factors, distribute a monomial and then a binomial across the full expression, using a multiplication correspondence table.

### Chain
| Q(s) | Required reasoning | UI / display |
| --- | --- | --- |
| 1 | gather numeric factors and repeated literal factors | one inline formula chain |
| 2 | derive exponent count for product of equal bases | generalize from product count, explain domain |
| 3 | derive repeated powers by counting all copies | distinguish nested power from sum of exponents |
| 4 | split power of a product into individual powers | group factors using commutativity/associativity |
| 5–6 | transfer law to signed, multi-factor power | show powers before combining sign/exponents |
| 7–8 | monomial times 3-term sum then simplify | concept `展開` formalized only after operation |
| 9 | split binomial×binomial into two outer products | make target of next distribution explicit |
| 10 | expand to four pairwise products | align four contributions; do not prematurely combine |
| 11 | combine like terms into final polynomial | only reveal after Q10 |
| 12–13 | reuse on transfer example, first partial structure then result | keep one derivation frame |

### Figure ID N03-F01 (original must be inspected)
An **unfilled correspondence table** with 2×2 product slots, not an answer-filled multiplication table. Display before Q9/10 only if the original contains no computed products. After Q10 answer, progressive reveal four products and finally combined expression; figure captions never leak Q11. If original graph contains data numbers, assert exact text and layout only after image QA.

### Prior and output
N01/N02 literal parts → N03 powers → distribution → N04 multiplication identities. Align all equation steps in a single math pipeline / KaTeX token.

## Pilot C — N10「根号・証明・有理化」 (21 source markers, no current source figure ID)

### Goal
Use nonnegative principal-square-root meaning to show correctness of radical simplification; distinguish **proof of a general law** from examples and its non-applicability to addition. Apply conjugates and nonzero denominator conditions to rationalize.

### Chain
| Q(s) | Required reasoning | UI / proof handling |
| --- | --- | --- |
| 1–2 | square a candidate and verify nonnegativity before concluding a specific square root | example; no guessing sign from square alone |
| 3–4 | derive product rule: show candidate square then its nonnegativity | **Proof** block with assumptions (raw original conditions to verify) |
| 5–6 | quotient rule: compute square then sign/nonzero denominator | same **Proof** chain; (b\neq0) as precondition checked on original |
| 7–8 | apply product rule, extract square factor | after proof; one expression chain |
| 9–10 | simplify two radical addends independently and combine equal radicals | cannot combine sqrt(a)+sqrt(b) into sqrt(a+b) |
| 11–12 | apply earlier multiplication identity, then radicals/like terms | recall N04 result at moment needed |
| 13 | multiply sum and difference as conjugates | bridge to rationalization |
| 14 | explain multiplying numerator and denominator by same nonzero factor | invariant fraction value, not an answer-giveaway |
| 15–16 | choose factor making denominator a square and simplify | reveal intermediate then result |
| 17–19 | choose conjugate, simplify denominator, expand numerator | multi-step example; one frame, choices after target |
| 20–21 | select own nonzero factor and rationalize a fresh example | fading/self-check |

### Proof guard
For general `√a√b=√(ab)`, require `a ≥ 0, b ≥ 0`; for `√a/√b=√(a/b)`, require `a ≥ 0, b > 0`.  These are **mathematical guards**, not claims about what the lossy Word literally contains. Original symbol/assumption check required. Distinguish proof hypotheses from later computational conveniences. Do not hide sign/denominator checks under a generic "squaring proves equality" claim.
No figure proposed without a concrete pedagogical need; well-laid out formulas are preferable.

## Pilot D — N12「連立不等式と文章題」 (15 source markers, 3 figures)

### Goal
A system requires **both** constraints: solve individually, visualize on a common scale, retain their intersection; then transform monetary constraints into real interval and return to countable integers.

### Chain
| Original Q | Cognitive operation | UI and unlock conditions |
| --- | --- | --- |
| 1–2 | solve each original inequality separately | earlier results visible as narrow reminders |
| 3 | check a test number against **both** conditions | meaning of simultaneous; not a single-condition guess |
| 4 | intersection and endpoints written as one inequality | source figure N12-F01 shows two bands, NOT their intersection |
| 5 | split a three-part inequality into two compatible inequalities | inline conversion |
| 6 | solve both branches | two visual rows, same scale |
| 7 | compare tight upper bound and give final solution | N12-F02 shows two candidate bounds, no answer leak |
| 8 | write pudding count from total of 20 items | source plain-language task: pastry count x, pudding count 20−x |
| 9 | constrain x as integer count and range | store domain, do not lose it in algebra |
| 10 | total fee in x: box 50 yen + 180 yen each pastry + 130 yen each pudding | target formula from *verifiable known plain-text numbers* |
| 11 | encode 3200 yen <= total < 3300 yen | convert constraints without rounding early |
| 12–13 | algebraic simplification and solve interval for x | track sign and both bounds |
| 14 | intersect continuous inequality answer with original integer domain | answer is integer count(s), not real interval |
| 15 | substitute every integer candidate and verify actual price | after correct Q14, show N12-F03 candidate integer marks |

### Checkable example from source prose (NOT reconstruction of missing math)
The described shopping problem is unambiguous in ordinary text: box 50円, pastries 180円, puddings 130円, 20 pieces, total 3200円以上3300円未満. Conditional expression:
`50 + 180x + 130(20-x)` with integer `0<=x<=20`.
Simplifying gives `2650+50x`. Inequality `3200<=2650+50x<3300` → `11<=x<13` → counts `x=11,12`. Verification 3200 and 3250 yen. These computations are **independently derived from verified plain-language numbers**, not certified to match the Word's missing displayed formulas or original answer key. Must cross-check source before shipping and never place x=11,12 in learner-facing premature figure or caption.

### Figure constraints
- N12-F01: two separate aligned condition bands, common scale; before answer to Q4; intersection hidden.
- N12-F02: compare two upper limits without preselecting correct one; before Q7.
- N12-F03: integer solutions marked **only after** Q14 accepted (and Q15 when needed). Figure should not disclose candidate integers or cost before question answered.
- Endpoint circles (open/closed), negative/positive positions, fraction scaling and null intersection must be mathematically exact.

## Cross-pilot graph / 火柴図 (planning only)

```text
Source Word (16 units, OMML/figures pending)
    │
    ├── N01 term/degree/like term (10 markers) ──┬──> N02 ──> N03 (13)
    │                                            │             │
    │                                            │       [N03-F01] products only
    │                                            │             └──> N04 formulas
    │                                            │                       │
    │                                            └──> (reused algebra)   ├──────┐
    ├── N07 representations ──> N08 absolute ──> N09 square root       │      │
    │                                            │                      │      │
    │                                            └──────> N10 (21) <────┘      │
    │                                                      proof → example     │
    └── N11 inequality transform ──> N12 (15)                    original values │
                                             │                   known only in   │
                                 [N12-F01] two bands              plain prose   │
                                             ▼                                     │
                                 intersection & bound                            │
                                             ▼                                     │
                                 money → algebra → integer domain                │
                                             ▼                                     │
                                 [N12-F03] only AFTER user answer                │
```

Do not treat a visual arrow as established mathematical necessity without exact source conditions. A new question may be added only when a source gap/educational need is recorded and user-visible new authorship distinguished.

## Design acceptance / the next user checkpoint
Original Word recovered. Produce and review for each pilot:
1. **Source-verified** complete original question/formula/figure and author-permission notes.
2. Complete, checked solution/derivation with all assumptions.
3. Continuous, fully written hole-free passage, definition/property/proof/example distinction.
4. Per-step insertion proposal with no answer leakage and candidate choices/feedback.
5. Source comparison and actual figure placement/render specs.
6. Present exact user-viewable pilot content and Fire diagram for approval before mass production.

Raw input is now accessible in the 2026-10-17 conversation upload; this remains **reviewable design**, not yet a deployed student app.

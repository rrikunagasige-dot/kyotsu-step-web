# N01 / N03 / N10 / N12 pilot — 教材思考ノード設計（原式待ち）
Status: **STRUCTURAL DRAFT, NOT MATH-VALIDATED; USER PILOT REVIEW REQUIRED**
Authority: W-MATH-003 P-001 + `CMD-WORK-002`, `subjects/mathematics/textbook/SPEC.md`, `docs/MASTER_APP_LESSONS.md`, `docs/MATH_RENDERING_RULES.md`, `docs/INFORMATION_ARCHITECTURE_RULES.md`, prior accepted `集合` textbook version.

The exact Word has many equations absent from the text extraction. Do **not** treat placeholders below as the original exercises, or create graded answer keys without source recovery.

## Common instructional skeleton
Known concrete problem (original wording and exact formula) → point of focus (not an answer leak) → nontrivial decision/operation *inside continuous prose or formula* → feedback and resolved full sentence → concept name in bold black → properties in natural paragraph → **proof if necessary** (distinct header) → worked example (distinct from proof) → transfer/limited independent attempt.
No new title card per thought node, no one-equation-one-white-card; in each formula use one assembled TeX tree with unresolved/resolved hole states; options and feedback tied to misconception. Preserve previous useful result, hide future resolved answers.

### N01 — Concepts before names (10 source prompts; no referenced figure)
- N01-S01: ask learner to inspect concrete original expression and separate coefficient and multiplied symbols; answer is a meaningful factorization operation, not guess '単項式'.
- N01-S02: **after** student sees the operation, formally introduce **単項式**, **係数**, **次数** in black body; use paragraph continuous with resolved expression.
- N01-S03: change the selected variable while holding other symbols constant; ask *which part counts as coefficient* and how degree changes (not merely its printed glyph).
- N01-S04: use a multi-term expression; ask to classify **同類項**, combine correct signed groups; distinguish coefficient from variable-part equality.
- N01-S05: introduce **多項式**, **定数項** and degree *after simplification*; test cancellation with a new source-confirmed example, ensure no advance leak.
- After source restored: map original N01 【1】–【10】 to nodes and classify preserve/merge/split with every omitted source prompt justified.
- No numerical example can be asserted until original expressions are recovered.

### N03 — Distributivity and formula/table (13 prompts; N03-F01)
- N03-S01: expand original product into repeated factors; derive index rules as counts of factors (must distinguish powers of a product vs product of powers).
- N03-S02: start with original single term × bracket; choose which terms receive multiplication. Show complete one-chain expansion and subsequent collection, not isolated cards.
- N03-S03: BEFORE answering two-bracket expansion, show original **unfilled** four-cell multiplication grid N03-F01, names/positions only; do not reveal products.
- N03-S04: ask learner to select/derive four pairings and produce a symbolic product-sum.
- N03-S05: expand and combine like terms; show completed table **after** decision and resolved formula; verify against original.
- N03-S06: transfer to bracket with 3 terms. Ensure four-cell source table is suitable only for its original case.
- Formulas and table dimensions/cell labels **BLOCKED** until original source.

### N10 — Proof visibly separate from example (21 prompts; no referenced figure)
- N10-S01: introduce nonnegative principal-root meaning using original concrete simplification; recover right-hand restrictions.
- N10-S02: present named **性質/定理** for product and quotient of roots *with domain assumptions* from original.
- N10-S03 **証明**: calculate square of the candidate expression, then independently verify sign/nonnegativity and denominator ≠0; only then conclude equality of principal roots. Do not substitute example by 'proof'.
- N10-S04: example of extracting square factor and root simplification; a meaningful step distinguishes multiplicative rule from invalid additive rule.
- N10-S05: distinguish adding like radicals from radical multiplication, verify full formula and sign.
- N10-S06: denominator rationalization by conjugate where needed; previous N04 square identity is the basis, show why denominator loses radical.
- N10-S07: short independent transfer; source 【1】–【21】 map individually to these decisions and possible separate nodes after exact formula audit.
- Exact theorem statement, domain, original coefficients, sample answer **BLOCKED**.

### N12 — Number-line constraints + real-world amounts (15 prompts; N12-F01/F02/F03)
- N12-S01: solve first original inequality while keeping final combined answer hidden; same for second.
- N12-S02: show original two stacked number lines N12-F01 using identical horizontal scale and correct ○/●, **without** precomputed intersection.
- N12-S03: ask learner *why* 'simultaneously' means an intersection, then identify exact common interval including endpoints. Reveal final shading only after answer.
- N12-S04: translate original triple inequality to two inequalities; compare fractional endpoints with N12-F02 after individual solving.
- N12-S05: word problem (50-yen box; 180-yen and 130-yen pastries; 20 total; 3200≤amount<3300 in indexed prose). Distinguish counts of each type, total price, and **integrality**. Do not fill unknown source coefficients/number of valid solutions without recovered original.
- N12-S06: number line N12-F03 showing candidate integers and unit verification **after** answer, to avoid leaking which counts survive.
- Verify source numeric values and exact inequalities from original before using in any production lesson.

## Internal dependency / 火柴図
```text
Math Textbook existing accepted paragraph/hole/rendering contract
             │
N01 [expression/factors] → [coefficient/degree] → [like terms]
  │                │
  └────→ N02 → N03 [product ↔ repeated factors]
                      │
                      ├→ [distribute term] → [N03-F01 blank table]
                      │                         ↓
                      └─────────────────── [four products] → [combine] 
                                                     │
                                                     ▼
                             N04 square identities → N10 proof assumptions
                                                     │
                                      [square candidate] + [nonnegative]
                                                     ↓
                              N10 proof → worked example → rationalization
N08 abs/distance → N11 inequalities → N12 individual conditions
                                              ↓
                                      [number-line figures]
                                              ↓
                                    [intersection decision]
                                              ↓
                          [real-world: amounts + integer restriction]
                                              ↓
                                     [answer-after N12-F03]
```
Concept and problem dependencies are provisional until original formula/solutions verified; figures' placement must be visually audited.

## Pilot review deliverables after source restoration
For each pilot unit: exact original-source proposition/figure screenshot and ID, complete hole-free passage, thought node sheet with basis/action/purpose/feedback, proposed image placement and before/after state, original-vs-new comparison, runnable app preview only after pilot user review.
No main merge/Pages or unrelated lesson release in this phase.

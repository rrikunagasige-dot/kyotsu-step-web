# P-001 Pilot Design — N01 / N03 / N10 / N12

Status: DESIGN COMPLETE / FORMULA-SOURCE GATE OPEN
Date: 2026-10-17
Work: W-MATH-003 (P-001 approved 2026-10-17)
**This is a proposed teaching-node design, NOT reconstructed final Word content, not a working app.** An original source question is never silently replaced by an illustrative mathematical formula.

## A. Rules governing all pilots

Source must be checked against raw DOCX/fully rendered PDF before exact content entry. For every source question, record its original unit and local number, original expression, options/conditions, pedagogical role, target node ID, plus any merge/split and its reason. Preserve original IDs as stable provenance, not necessarily as student-facing headings.

Paragraph composition:
1. Start from a specific *known-to-learner* question, not a brand-new name/definition.
2. Learner performs one motivated inference. Make full complete text and formula first, then choose the *thinking step* to blank within the same paragraph or formula; don't interleave isolated \`[blank]\` cards.
3. Explain what the successful step means, formalize new concept/notation in black text with bold title only; separate Property, Proof and Example when they actually occur.
4. Present a new example (or short faded practice) and recycle earlier knowledge only when needed.
5. One complete derivation = one connected screen region, even when it has multiple progressive holes. At most the current decision is unresolved; no future answer leakage.
6. Every image has a purpose, an exact before/after insertion and constraints, and no accidental revealing of the selected solution.

### Learning chapter visual grouping (proposed)
- **多項式** (N01–N06). Internal IDs retained; source subsection titles mostly demoted to local explanation or narrative transition.
- **実数** (N07–N10).
- **1次不等式** (N11–N14).
- **参考・発展** (NE01 and NE02; optional, not inserted as a fourth equal-weight mandatory phase).
Do not show 16 primary cards. Transitions convey why polynomial algebra leads to numeric classifications and inequalities. Topic ID and route must be chosen after comparing existing curriculum index and progress schema.

### Preliminary lesson-stage contract
\`MOTIVATE → FOCUS → THINK → ANSWER-IN-TEXT → EXPLAIN → NAME → PROPERTY → [PROOF if needed] → EXAMPLE → SMALL TRANSFER\`.

### Machine/checkable acceptance
- Source unit coverage 16/16 (IDs and original question markers, no silent deletion).
- Formula and figure source fidelity 100% for published items; no source QC claim before original is available.
- All mathematically nontrivial transformations have their assumptions, sign/domain and intermediate reasoning.
- Each hole has \`what learner must decide\`, \`answer\`, \`plausible distractors\`, \`misconception-specific feedback\` and its reveal condition.
- PC/mobile readable formula, fraction/root, inline choices, caption and preserved learner progress; E2E and no unapproved change to other subjects.

## B. N01 — 単項式・係数・次数・多項式

**Original text confirmable**: existing N01 has local questions 【1】–【10】, examples about decomposing a term as coefficient × factors, looking at a specific variable, matching like terms, checking degree after simplification. **Exact original expressions and answer data are unavailable**; text index shows omissions.

**Main question**: Why must we decide *which letter to treat as varying* before reading coefficients and degree?

| Stage ID | Student action (not a final prompt yet) | Basis → consequence | Inline hole/reveal plan |
| --- | --- | --- | --- |
| N01-P01 | Split source expression into sign/number × individual letters | Previous multiplication and sign | In expression text, blank only the chosen factorization; after response expose coefficients |
| N01-P02 | Identify coefficient and number of letter factors | Factorization → concept of term/degree | Show source expression and factors; answer in a coherent sentence, then bold **単項式／係数／次数** |
| N01-P03 | Choose a focus variable and treat others as constants | Concept of variable vs constant | A local decision within the formula; wrongReason: counting every visible letter when degree is with respect to a named variable |
| N01-P04 | Compare two different focus-variable interpretations for one original source expression | Same expression → two descriptions | Blank two "coefficient/degree" outputs in connected prose |
| N01-P05 | Group terms with the same literal factor structure, including negative coefficients | Add/subtract compatible like terms only | Inline grouping blanks and algebra continuation; give **多項式／同類項** name only after learner sees structure |
| N01-P06 | Simplify before deciding polynomial degree | Cancellation can remove highest apparent term | Show source unsimplified and answer-after simplified text; prompt "highest remaining degree" and reason |
| N01-P07 | Transfer to original source check item(s) | Reuse concept with less prompting | Reduced hints, choices after target stage, caption/source preserved |

**Potential misconception probes**: signs aren't coefficient-free; if a variable is not the selected focus, it is part of the coefficient; degree for the simplified polynomial is not necessarily the largest degree visibly printed initially. Need original formula to write actual A/B/C choices and correct feedback.

**Figure**: None essential. Text/color/type choices; avoid decorative diagram.

**Proof**: Not necessary as a separate proof block; give definitions, properties and worked examples.

**Open source gate**: all N01 source expressions, variable names and 【1】–【10】 actual answers.

## C. N03 — 指数法則 → 展開 → 二項式の積の対応表

**Original text confirmable**: N03 【1】–【13】; it transitions from repeated multiplication, through algebraic exponent laws and a monomial×polynomial, to two binomials. Figure \`N03-F01\` is an **unfilled 2×2 multiplication correspondence grid**. Its numeric/variable labels must be recovered from original image.

**Main question**: Why does every term in one factor have to multiply *every* term in the other factor?

| Stage ID | Student action | Derivation link | Hole / visual plan |
| --- | --- | --- | --- |
| N03-P01 | Interpret positive-integer exponents as a number of factors, while collecting numeric sign separately | Multiplication → exponent syntax | Blank total repeated-factor count; no unexplained exponent formula |
| N03-P02 | Build the exponent rule by counting factors in \(a^m a^n\) | \(m+n\) factors → same base power, where \(m,n\in\mathbb{N}_{>0}\) | Ask what is counted, only then formal rule; illustrative symbolic form, **not assertion about an exact source equation** |
| N03-P03 | Examine a power of a power and product of powers, each by grouping and rearrangement | Associativity/commutativity → grouped power law | Only one conceptual leap per reveal |
| N03-P04 | Distribute one term to each part of a polynomial | Old distributive law → 2 or 3 products | Connected formula region with operand selection and results |
| N03-P05 | Use source diagram \`N03-F01\`: select all four ordered pairings in two binomials | Two term choices × two term choices = 4 products | Before answer show the two factor headings and 4 blank cells; no filled products yet |
| N03-P06 | Fill four products, then group like terms and identify final polynomial | N03-P05 pairing → calculated partial terms → N01 grouping | Entire derivation rendered as one progressive math block; don't duplicate completed equation below it |
| N03-P07 | Apply to a different source original "確認" expression | Test ability to generalize without heavy scaffolding | Progressive unlock, fewer choices |

**Proof/derivation classification**: Introduce exponent laws via explicit derivation, not a formal general proof card unless the source and teaching needs warrant it.

**Figure critical rules**:
- Before N03-P05: source diagram \`N03-F01\` with empty product cells; labels and relative table axes must match actual source.
- After N03-P05/P06: reveal completed products and finally consolidated polynomial.
- Do not mislabel the 2×2 table as a geometric area figure: it is a pairing matrix unless source expressly presents a length/area model.

**Open source gate**: all exact N03 expressions, original 2×2 grid labels/geometry, definitive expansions and conditions.

## D. N10 — 平方根の積・商の性質と証明

**Original text confirmable**: N10 【1】–【21】; a check by squaring and positivity, one \`証明\` block for product/quotient rules, another application in rationalization. No source figure ID. Exact source formula objects must be audited.

**Main question**: Why isn't verifying equal *squares* alone sufficient to identify a square root?

| Stage ID | Student action | Justification | Reveal |
| --- | --- | --- | --- |
| N10-P01 | Evaluate the square of an intended candidate expression | Definition of nonnegative square root | Ask for square comparison before selecting candidate |
| N10-P02 | Check candidate is nonnegative | \(\sqrt{u}\) is defined as the nonnegative root for \(u\ge 0\) | Name the root only after both conditions hold |
| N10-P03 | Prove product rule | \(a,b\ge 0\); \(s=\sqrt a\sqrt b\ge0\), and \(s^2=ab\) → \(s=\sqrt{ab}\) | **PROOF block**; explicitly label assumptions before equations and give each reason in sentence |
| N10-P04 | Prove quotient rule | \(a\ge0,b>0\); \(q=\sqrt a/\sqrt b\ge0\), \(q^2=a/b\) → \(q=\sqrt{a/b}\) | Connected proof continuation; denominator nonzero as mandatory |
| N10-P05 | Decide why the rule isn't transferable to sums in general | Compare square of sum, or single clear counterexample | Separate **PROPERTY/CHECK** from proof; no false \(\sqrt{a+b}=\sqrt a+\sqrt b\) |
| N10-P06 | Simplify separate radical terms before adding | N01 like terms + N10 product rule | Worked **EXAMPLE**, black concept/proof distinctions |
| N10-P07 | Select conjugate in the denominator | N04 \((u+v)(u-v)=u^2-v^2\) | Ask "what multiplication makes the denominator root-free?" before displaying answer |
| N10-P08 | Rationalize correctly | Nonzero denominator and same nonzero factor on top and bottom | One coherent derivation block, source expression pending |
| N10-P09 | Transfer to original check items | Reapply proof and conjugation without full hints | Test source exact results after raw recovery |

**Mathematical sample for QA** (generic independently verified rule, not claimed as an original source expression):
\[
(\sqrt a\sqrt b)^2=ab,\quad \sqrt a\sqrt b\ge0
\implies \sqrt a\sqrt b=\sqrt{ab}\quad(a,b\ge0).
\]
\[
(\sqrt a/\sqrt b)^2=a/b,\quad \sqrt a/\sqrt b\ge0
\implies \sqrt a/\sqrt b=\sqrt{a/b}\quad(a\ge0,b>0).
\]
Do not infer \(\sqrt{a+b}=\sqrt a+\sqrt b\). For example \(a=b=1\), LHS \(\sqrt2\), RHS \(2\).

**Open source gate**: exact N10 root expressions, teacher's answer key, formatting of all 21 prompt blanks.

## E. N12 — 連立不等式と個数・金額の現実問題

**Original text confirmable**: N12 【1】–【15】, number line figures \`N12-F01\`, \`N12-F02\`, \`N12-F03\`. The textual real-life question is fully readable: 50円箱 + 180円シュークリーム + 130円プリン、計20個、全体3200円以上3300円未満。Find the number of シュークリーム.

**Main question**: How do we keep only values satisfying *every* original restriction, not just the equation we happened to solve?

| Stage ID | Learner's current question | Evidence and outcome | Visual/unlock |
| --- | --- | --- | --- |
| N12-P01 | Solve source's first inequality | Algebraic solution candidate range | Source equation missing, BLOCKED until exact recovered |
| N12-P02 | Independently solve source's second inequality | Different range | Source equation missing, BLOCKED |
| N12-P03 | What does 「同時に」 mean? | A feasible value must be in both ranges | Show \`N12-F01\` as 2 scales with no combined answer shading |
| N12-P04 | Which endpoints and interval satisfy both? | Intersection and open/closed-end decision | Choose boundary then show source diagram result only after answer |
| N12-P05 | Split a chained inequality into its two bounds | Left and right constraints on same middle expression | Source exact triple chain required before publishing |
| N12-P06 | Compare two upper bounds on a shared scale | Only more restrictive upper bound remains | \`N12-F02\`, interval before answer, answer after |
| N12-P07 | Set a variable for number of cream puffs | \(x\in\mathbb Z,\ 0\le x\le20\) | Explicit "number" meaning first, before algebra |
| N12-P08 | Express the remaining number of puddings | \(20-x\) | Inline connected text: プリンは【\(20-x\)】個 |
| N12-P09 | Form price function, including box once | \(50+180x+130(20-x)\) | Student chooses contributions before answer becomes formula |
| N12-P10 | Expand/consolidate once to simplify inequality | \(50+180x+2600-130x=2650+50x\) | One continuous formula, no three standalone cards |
| N12-P11 | Translate textual cost bounds | \(3200\le2650+50x<3300\) | Identifies '以上' vs '未満', not assumed synonymous |
| N12-P12 | Remove constants from all three parts | \(550\le 50x<650\) | One formula row; motivate same subtraction everywhere |
| N12-P13 | Divide by positive 50, keeping inequality direction | \(11\le x<13\) | Explicit positivity, no sign flip |
| N12-P14 | Reapply *integer* and physical constraints | \(x\in\{11,12\}\) | \`N12-F03\` only after the learner selects integer points; don't leak counts |
| N12-P15 | Check original prices individually | x=11 → 3200円; x=12 → 3250円 | Reveal check and explain x=13 yields 3300円 and violates *strict* upper bound |

**Fully verified solution for this subproblem**, based on source text, not on guessed OMML:
\[
\begin{aligned}
&x\in\{0,1,\dots,20\},\quad \text{プリンの個数}=20-x,\\
&T=50+180x+130(20-x)=2650+50x,\\
&3200\le T<3300
 \iff 550\le50x<650
 \iff 11\le x<13,\\
&x\in\mathbb Z\implies x\in\{11,12\}.
\end{aligned}
\]
For x=11, T=3200. For x=12, T=3250. x=13 would be 3300 and is excluded; 10 is below lower bound at 3150.

**Important lesson**: Student should not solve the inequality and then forget the count is integral and nonnegative. Show count/domain immediately when defining x and return to it **after** algebra.

**Figures**:
- \`N12-F01\`: two independent ranges, same scale, final intersection initially hidden.
- \`N12-F02\`: two possible upper bounds and fractional endpoints; coordinate geometry and actual values pending raw figure review.
- \`N12-F03\`: figure showing permissible integer counts; reveal only after answer selection. No pre-filled ticks on the initial problem screen.

**Open source gate**: exact first inequality/triple inequality and three original figures. Only N12 money problem prose numbers have been independently checked.

## F. Fire graph and problem coverage

\`\`\`text
[Word N01 local Q1..10] → term-factorization → coefficient/degree
                              → choose focus variable → group like terms
                              → simplify → post-simplification degree
                                      │
                                      └──> N03 (terms/coefficients reused)

[Word N03 local Q1..13] → repeated product → exponent properties
                                      → distribution of monomial
                                      → 2×2 pairing grid (F01 empty)
                                      → 4 products → like terms → check
                                             │
                                             └──> N04 expansion pattern
                                                   │
                                                   └──> N10 rationalization

[Word N10 local Q1..21] → root definition + nonnegative check
                                     → proof: product → proof: quotient
                                     → root algebra → (conjugate) rationalization
                                     → check

[N11 inequality law] ────────────────> N12 two inequality results
                                          ↓
                                     same-scale figure F01
                                          ↓
                                     intersection / endpoints
                                          ↓
                                     chained inequalities / F02
                                          ↓
[N12 real word problem] → x domain → 20-x → price expression
                                          ↓
                                   cost bounds → 11≤x<13
                                          ↓
                                      integer 11,12
                                          ↓
                                     F03 revealed → verified prices
\`\`\`

Every arrow is provisional as a *student-facing dependency* until actual original question/figure review; general mathematics identities in section D and exact N12 word problem calculations are independently verifiable.

## G. Explicit source recovery checklist before PILOT IMPLEMENT

1. Original raw \`.docx\` or a **page-accurate PDF export preserving all equation objects and embedded diagrams** becomes accessible for inspection. The Library index alone is insufficient.
2. Produce a per-item source table for local 【1】…【n】 in N01/N03/N10/N12: original question expression, source answer, pedagogical rewrite disposition, derived correct answer/distractors, figures and reveal moment.
3. Render and inspect original pages for N01 (source pages 3–4), N03 (7–9), N10 (32–35), N12 (39–41) including math baseline, image geometry, line widths and caption labels.
4. Confirm the twelve figure IDs across 16 units: diagram missing/mislabeled cannot be marked PASS; no invented substitutions.
5. Only after complete exact source audit, turn this staged design into executable lesson text and application schema; then run full browser/mobile/CI verification.
6. User's P-001 approval already exists and is not asked again absent material changes. Actual preview and production release require separate verified handoff and release authority.

## H. Lessons already checked

- \`subjects/mathematics/textbook/SPEC.md\` — concept→property→required proof→example, black concept terms, useful holes, figure spec.
- \`docs/MASTER_APP_LESSONS.md\` — continuous text and short student UI, no blind bulk import.
- \`docs/MATH_RENDERING_RULES.md\` — inline/root, resolved holes, formula assembly.
- \`docs/INFORMATION_ARCHITECTURE_RULES.md\` — three conceptual chunks and bridge prose.
- \`集合_教科書モード_完成版_v1(1).docx\` — approved prototype for learner interaction; original file in Library.
- \`SCIENTIFIC_WRITING_MASTER_SKILL_2026-09-24.md\` — reader question→answer→consequence useful as a writing heuristic, not a replacement for math pedagogy; research-paper-specific rules not imported.
- Original \`MATHEMATICS_TEXTBOOK_MODE_MASTER_SKILL_v1\` not located as standalone original; imported candidate spec has a historical summary; no claim that original file was checked.

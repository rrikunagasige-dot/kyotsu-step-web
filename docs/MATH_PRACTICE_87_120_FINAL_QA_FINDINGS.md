# MATH PRACTICE 87–120 FINAL QA FINDINGS

Status: AUDIT IN PROGRESS  
Branch: `chatgpt/math-87-120-final-qa-audit`  
Baseline main: `1b9d86d1a9f37bb66b5279a1d68dac4f2dcaac6e`

Purpose:
- 87–120 を教材全体として最終監査する。
- 発見中は修正しない。
- 先に issue ledger を完成させ、その後まとめて修正する。
- CI / build / deploy success だけで教材品質を PASS にしない。

Authority:
- `docs/MATH_PRACTICE_MASTER_LESSONS.md`
- `docs/MATH_PRACTICE_87_120_STRUCTURE_MAP.md`
- `docs/MATH_PRACTICE_88_96_CONTENT_DESIGN.md`
- `docs/MATH_RENDERING_RULES.md`
- `docs/MATH_PRACTICE_87_120_FINAL_QA_PLAN.md`

---

## Audit block A — 87–97

### Scope
Theme: `集合を整理する`

Problems:
87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97

Reviewed:
- Japanese source
- Chinese-source construction strategy
- current-target / dependency metadata
- existing presentation tests
- rendering authority
- content-design authority

Browser visual QA and direct original-book recheck remain separate later gates.

---

## QAF-001 — CRITICAL — Chinese semantic parity is broken for 88–96

Files:
- `src/data/mathPractice/setsBatchA.zh.ts`
- `src/data/mathPractice/setsBatchA.ts`
- `src/data/mathPractice/adapter.test.ts`

Finding:
The Chinese batch is not authored as complete translations. It applies `looseText()` to Japanese strings. If Japanese kana remain after partial replacement, the learner-facing string is replaced by a generic fallback such as:

- prompt: `请选择符合当前条件的正确结论。`
- explanation: `根据题目条件与当前推理可得到这一结论。`
- choice: `候选 1`, `候选 2`, ...

This preserves IDs and removes kana, but can destroy the mathematical meaning of the question.

Static audit of 88–96:

| Problem | fallback prompts | fallback explanations | fallback choices |
|---|---:|---:|---:|
| 88 | 16/16 | 12/12 | 3/46 |
| 89 | 10/10 | 9/9 | 14/27 |
| 90 | 10/10 | 8/8 | 6/30 |
| 91 | 10/10 | 8/8 | 9/27 |
| 92 | 21/21 | 16/16 | 6/62 |
| 93 | 9/9 | 7/7 | 6/27 |
| 95 | 10/10 | 7/7 | 0/30 |
| 96 | 16/16 | 10/10 | 0/48 |

Examples of choice semantics that can collapse to generic labels:
- 89: `X のすべての要素が A に入る`
- 90: `A と B の要素を書き出す`
- 91: `選ぶ要素の個数で分ける`
- 92: `A と B の両方に入る要素`
- 93: `A,B,C の3つすべてに入る`

Why existing tests miss it:
- JA/ZH grading structure comparison checks IDs / structure, not semantic text equivalence.
- no-kana test passes because the fallback intentionally removes Japanese kana.
- therefore the current tests can be green while Chinese pedagogy is degraded.

Contrast:
- `pilot.zh.ts` for 87 / 94 / 97 uses strict explicit translation and throws on missing Japanese-kana translation.
- That strategy is materially safer than the generic fallback used for 88–96.

Acceptance for repair:
- no generic fallback for authored learning prompts / explanations / pedagogically meaningful choices,
- explicit or deterministic meaning-preserving translation,
- regression test that rejects placeholder prompts/choices in published Chinese questions.

---

## QAF-002 — HIGH — Problem 89 common prerequisite is not imported into candidate stages

Authority:
`MATH_PRACTICE_87_120_STRUCTURE_MAP.md` defines 89 as Type `C + I`.

Required:
- S0: `A={2,4,6,8,10}`
- S1–S4 depend on S0
- candidate judgments B/C/D/E are independent from each other
- common A / subset rule may stay as compact reference

Current `presentation.ts`:
- targets: `basis, b, c, d, e, final`
- `b/c/d/e` have no `dependsOn: ['basis']`
- `basis` does not expose a reusable result node for A / subset rule

Consequence:
With current-stage compression, the learner can move to B/C/D/E while the logically required common reference is not available as a compact dependency.

Additional review:
The final stage `Aの部分集合をまとめる` aggregates earlier candidate judgments but currently has no result dependency metadata either.

Acceptance for repair:
- preserve candidate independence,
- expose only the common prerequisite where needed,
- do not show previous candidate derivations,
- final stage should receive only the minimal logically required prior results.

---

## QAF-003 — HIGH — Problem 96-(4) skips two meaningful reasoning steps

Authority design for 96-(4):
1. candidate pool → B
2. remove elements that belong to A
3. remove elements that belong to C
4. result

Current source:
- `p4-candidates`: choose B
- immediately `p4-result`: choose `{5}`

From B=`{3,4,5,6}` to `{5}`, the learner must apply two independent filters:
- A condition removes 3,4
- C condition removes 6

This collapses two meaningful state updates into one final-answer blank and conflicts with the project's 1-step learnability / no-two-step-jump rule.

Acceptance for repair:
- restore the missing intermediate reasoning without turning every arithmetic token into a hole,
- keep one visual derivation group,
- preserve current-stage compression.

---

## QAF-004 — MEDIUM — Problem 92-(2) does not explicitly complete A∩B

Original task asks for both:
- `A∩B`
- `A∪B`

Authority content design for (2):
- common element exists? → none
- empty-set notation
- union result

Current source:
- `p2-common`: asks whether a common element exists
- then jumps directly to `p2-union`
- no explicit learner-facing conclusion `A∩B=∅` is authored in the guided flow

The learner can infer the result, but the guided solution does not explicitly finish one of the two requested outputs.

Acceptance for repair:
- make the intersection conclusion explicit,
- avoid a trivial duplicate hole if a resolved sentence can express `A∩B=∅` naturally.

---

## QAF-005 — REVIEW — Problem 88 hole strength

Potentially weak holes:
- `p2-step`: odd numbers increase by `2`
- `p4-pattern`: `1,4,7,10,...` increases by `3`

These are not automatically wrong merely because the answer is numeric; pattern recognition can be a real thinking node.

However:
- project-wide rule rejects isolated numeric guessing / artificial hole-count inflation,
- `p4-pattern` is especially close to redundancy after the learner has already generated `1,4,7,10`.

Status:
REVIEW, not yet FAIL.

Final decision should use learner-flow/browser QA:
- if the blank causes a genuine pattern decision, keep it;
- if it functions only as a trivial number token before an already-obvious final set, merge/remove it.

---

## First-pass PASS / no structural defect found yet

### 87
- independent membership stages preserved
- no false dependency links between 2 / 15 / 21 / 29
- current-target anchors match the approved design

### 90
- two subproblems independent
- no false previous-result dependency

### 91
- compressed into semantic groups
- no cross-subproblem dependency required
- no confirmed leakage found in source/presentation pass

### 93
- common A/B/C preparation is encoded as reusable result nodes
- both (1) and (2) import only that preparation
- (1) result is not incorrectly imported into (2)

### 94
- selective graph dependency matches authority:
  - (1) → (3),(5),(6)
  - (2) → (4),(5),(6)
  - (7),(8) compute their own inner sets
- MR14 raw `overline(...)` defect has a documented repair and browser regression

### 95
- three answers remain logically independent
- no future-answer dependency introduced
- first-pass source/presentation structure is acceptable

### 97
- linear chain is encoded:
  - solve a
  - verify A/B and intersection
  - compute union
- previous results are represented as compact reusable results

These are not final acceptance; mobile/browser/source-fidelity gates still remain.

---

## Rendering notes for block A

Known repaired defect:
- MR14: raw `overline(A) ∩ B` on prompt/choice/hint surfaces
- current rendering authority requires shared inline-math path

Known repaired authoring defect:
- MR15: single-backslash TypeScript TeX escape loss in 88–96

Existing browser coverage is strongest for:
- 88
- 93
- 94
- 96
- 97

Full 87–97 mobile/desktop visual sweep is still pending.

---

## Source fidelity note

A Library file named:
`数学I_普通練習_集合と命題_4STEP全問_引導版.docx`

was found, but its displayed problem numbering does not align directly with the current App numbering in this block. Therefore it is not being treated as the raw original-book authority for final source-fidelity decisions.

Do not mark source fidelity PASS from this derived file alone.

---

## Block A status

Confirmed / strong findings:
- QAF-001 CRITICAL
- QAF-002 HIGH
- QAF-003 HIGH
- QAF-004 MEDIUM

Review-only:
- QAF-005

Next:
- audit 98–109 without fixing the above findings,
- append findings to this ledger,
- only after discovery is complete begin repair work.


---

## Audit block B — 98–109

### Scope

Problems:
98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109

Theme placement:
- 98–107,109: `条件から命題を読む`
- 108: `命題を証明する`

Reviewed:
- content-design authority for each problem
- Japanese source
- Chinese source strategy / grading parity
- presentation target and dependency metadata
- browser regressions
- math-rendering assertions / page overflow assertions

### Chinese parity

Unlike 88–96, the 98–109 Chinese sources are explicitly authored rather than produced by a generic Japanese-string fallback.

Verified for 98–109:
- blank / option ID structure matches JA
- grading parity is covered by `adapter.test.ts`, including correct option IDs
- Chinese source has no Japanese kana
- no generic `请选择符合当前条件的正确结论。` / `候选 1`-style fallback mechanism is used for this block

Status:
PASS for first-pass structural/grading parity.
Semantic wording remains part of final human-language spot check.

---

## QAF-006 — REVIEW — 104 / 107 are intentionally classification-heavy

Problems:
- 104 必要条件・十分条件
- 107 必要・十分条件の判定

Current design:
- common basis fixes the mapping:
  - `p⇒q` true → p is sufficient for q
  - `q⇒p` true → p is necessary for q
- each subproblem's prose supplies the two-direction mathematical evidence
- the authored thinking node asks the learner to convert the two truth values into the final necessary/sufficient classification

This matches the dedicated content-design authority and therefore is **not a confirmed defect**.

Reason for manual review:
The interaction density is lower than in derivation-heavy problems. A learner may feel that most mathematical work has already been read rather than actively reconstructed.

Do not automatically add more holes.
Final learner-flow QA should ask:
- does the classification still require an actual direction-mapping decision?
- or does the prose + option wording make the answer effectively automatic?

Status:
REVIEW ONLY.

---

## First-pass PASS / no new structural defect found in block B

### 98
- common proposition criterion is a compact reusable basis
- (1),(2),(3) are independent after the basis
- false proposition vs non-proposition is explicitly distinguished
- counterexample is hidden before its thinking node
- browser regression checks current-stage compression, leakage, KaTeX, and overflow

### 99
- implication criterion `P⊆Q` is the reusable basis
- four subproblems remain independent
- counterexample appears only where logically needed
- (4) keeps its internal `Q` conversion before the final truth judgment
- browser regression checks display math, no KaTeX error, leakage, compression, overflow

### 100
- counterexample criterion is the only shared basis
- each false implication is handled independently
- concrete counterexamples are not leaked before selection
- browser regression covers all three cases

### 101
- negation is treated as complete complement, including boundary reversal
- all three subproblems depend only on the shared negation criterion
- no previous-answer carryover
- browser regression checks leakage and overflow

### 102
- AND/OR → intersection/union basis is reused correctly
- four subproblems remain independent even when base intervals repeat
- endpoint open/closed handling is explicitly tested
- no prior-result dependency is introduced

### 103
- De Morgan is built from meaning, not only formula naming
- five subproblems depend only on the common negation rule
- prior completed derivations are compressed
- browser regression checks answer leakage and math rendering

### 105
- true implication vs false implication proof responsibility is a shared basis
- concrete counterexamples are hidden before learner choice
- all four subproblems are independent
- browser regression checks the intended examples and overflow

### 106
- Japanese condition → intersection/complement mapping is a shared basis
- four subproblems depend only on that basis
- no previous answer is imported
- browser regression checks raw result leakage and compression

### 108
- proof is split into:
  - proof plan
  - `p⇒q`
  - `q⇒p`
  - final equivalence
- forward and reverse proof results are stored separately
- final stage imports only the two compact direction results
- full previous derivations are not re-shown
- browser regression checks the selective dependencies and overflow

### 109
- quantifier-negation rule is a shared basis
- each of the two subproblems has internal progressive reveal
- negation is answered before truth verification
- equation solving appears only when needed for the existential case
- no result from (1) is imported into (2)
- browser regression checks sequential reveal, leakage, compression, and overflow

---

## Block B browser/test coverage note

The Math-practice E2E spec contains dedicated learner-flow tests for every problem 98–109, including:
- current target
- hidden future blanks
- compression of completed stages
- selected answer-leakage guards
- KaTeX/no-error checks where math surfaces are relevant
- page-level horizontal overflow

Playwright configuration runs the suite in both:
- Pixel 7 mobile Chromium
- 1440×1000 desktop Chromium

This is strong regression coverage, but final acceptance still requires a fresh post-repair run after all audit findings are fixed.

---

## Block B status

Confirmed new FAIL:
- none

Review:
- QAF-006: 104 / 107 interaction density

Next:
- audit 110–120
- do not repair QAF-001–004 yet
- append all remaining findings first


---

## Audit block C — 110–120

### Scope

Problems:
110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120

Reviewed:
- proof/function content-design authority
- Japanese source
- Chinese source / grading structure
- current-stage dependency graph
- cross-problem theorem dependency 116→117
- browser learner-flow regressions
- mathematical recomputation of authored correct choices
- current-target heading leakage

### Mathematical recomputation

No authored correct-answer error was found in this pass.

Checked explicitly:
- 110: original / converse / contrapositive / inverse truth values
- 111: four contrapositive proofs
- 112: rationalization and contradiction through √3
- 113: rational square-root contradiction
- 114: residues mod 5 and mod 3
- 115: `r²=5-2√6`, hence `√6=(5-r²)/2`
- 116: `q≠0 ⇒ X=-p/q∈Q` contradiction, then `q=0 ⇒ p=0`
- 117:
  - (1) `(p+q-1)√2-(p+2)=0` → `p=-2,q=3`
  - (2) `(2p+q)√2+(2p-2)=0` → `p=1,q=-2`
- 118: uniqueness criterion for functionhood, including ± square-root ambiguity
- 119:
  - `f(a+1)=3a+1`
  - `g(-a)=2a²+3a+1`
  - `g(a-1)=2a²-7a+6`
- 120:
  - (1) `y=3x, x>0`
  - (2) `y=15-3x, 0≤x≤5`

---

## QAF-007 — HIGH — current-target headings leak answers

The final QA plan explicitly includes current-target labels in the answer-leakage audit.

A target heading may state the goal or operation, but it must not display the answer that the learner is about to select.

Confirmed examples:

### 106 — s2

Current target:
- `奇数を2の倍数の補集合として表す`

Current blank:
- asks how the odd natural numbers are represented using P,Q
- correct answer: `P̄`

Because P is already defined as the multiples of 2, the heading states the exact set operation before the learner resolves the thinking node.

### 108 — conclude

Current target:
- `2方向を合わせて同値を結論する`

Current blank:
- asks what follows after both directions have been proved
- correct answer: p and q are equivalent

The target label contains the conclusion itself.

### 111 — p4-form

Current target:
- `奇数を2k+1の形に直す`

Current blank:
- asks how to write odd n using an integer k
- correct answer: `n=2k+1`

The target label displays the exact representation being tested.

### 113 — assumption

Current target:
- `√xが有理数だと反対仮定する`

Current blank:
- asks for the contradiction assumption
- correct answer: assume `√x` is rational and write `√x=r`

The key answer is visible before selection.

### 116 — assumption

Current target:
- `q≠0と反対仮定する`

Current blank:
- asks for the opposite assumption used to prove `q=0)
- correct answer: `q≠0`

This is a direct literal answer leak.

### 118 — basis

Current target:
- `関数かどうかは「yがただ1つ決まるか」で判定する`

Current blank:
- asks for the function criterion
- correct answer: for each allowed x, y is uniquely determined

The heading gives the criterion before the learner constructs it.

Repair principle:
- rename target labels to describe the **task** without giving its resolved content
- examples:
  - 111 p4-form → `奇数を整数 k を使って表す`
  - 113 assumption → `背理法の反対仮定を置く`
  - 116 assumption → `q=0 を示すための反対仮定を置く`
  - 118 basis → `関数の判定基準を確認する`
- do not weaken or remove the actual thinking blank
- add regression assertions that the target heading does not contain the current answer

---

## QAF-008 — REVIEW — strongly suggestive target labels

These labels do not literally print the full answer, but may over-scaffold it:

- 110 p2-converse: `多項式が0でない条件からx≠2を確かめる`
- 112 p2-assumption: `有理化後の値を有理数rとおく`
- 114 p1-squares / p2-products: heading already says the residue list has no 0
- 115 assumption: `有理数だと反対仮定する`
- 119 basis: `すべてのxを同じ入力で置き換える`
- 120 model-stage labels describe the exact operation to perform

These may be legitimate scaffolding because the learner still has a nontrivial transformation to execute.

Status:
REVIEW ONLY.
Do not rewrite them mechanically; verify in learner-flow QA after the confirmed leaks are fixed.

---

## First-pass PASS / no additional structural defect found in block C

### 110
- original / converse / contrapositive / inverse are separate targets
- each relation uses only the common form basis
- summary imports exactly the four local results
- prior subproblem derivation disappears

### 111
- each proof is internally linear
- proof stage imports its own contrapositive/negation result
- no unrelated previous subproblem result
- strategy is source-given; the app does not add a fake strategy-choice hole

### 112
- the two irrationality proofs are independent
- rationalization is one meaningful step rather than several arithmetic-token holes
- only immediately required results are imported

### 113
- assumption → operation → squared result → contradiction is linear
- no future formula is exposed by dependency metadata

### 114
- two divisibility proofs are independent
- residue classes are grouped rather than exploded into arithmetic-only holes
- proof closes through exhaustive residues

### 115
- contradiction chain is linear
- `√6` is created, expanded, isolated, then contradicted
- future expressions are not imported early

### 116
- target → q≠0 assumption → isolate X → q=0 → p=0
- theorem result R116 is explicitly preserved for 117
- dependency graph is linear and minimal
- separate heading-leak issue recorded as QAF-007

### 117
- 116 theorem appears only on the coefficient-separation application stages
- external result is compact and expandable
- 116 full proof is not forced into the default view
- (1),(2) remain independent
- local derivation is linear inside each subproblem
- authored coefficient equations and final p,q values recompute correctly

### 118
- three cases share only the unique-output criterion
- previous case results do not carry over
- ± square-root ambiguity is mathematically correct
- separate heading-leak issue recorded as QAF-007

### 119
- ten requested function values are presented current-item-only
- simple substitutions stay one stage
- composite symbolic inputs split substitution / expansion / simplification only where meaningful
- no prior item result dependencies
- formulas recompute correctly

### 120
- formula branch and domain branch are intentionally separate
- p1 domain depends on variable meaning, not on the function formula merely for convenience
- p2 model uses distance traveled
- p2 domain imports only start and end time
- wrong answer is tested not to advance progress
- formulas and domains recompute correctly

---

## Chinese parity — block C

110–120 Chinese sources are explicitly authored.

First-pass checks:
- JA/ZH ID structure matches
- no Japanese kana in Chinese source
- grading parity is covered by the shared adapter parity test
- no 88–96-style generic fallback translation mechanism

Status:
PASS for structural/grading parity.

---

## Browser coverage — block C

Dedicated E2E learner-flow tests exist for every problem 110–120.

They cover, depending on the problem:
- current target
- hidden future blanks
- current-stage compression
- local dependency links
- external theorem link for 117
- KaTeX error absence
- answer-leak guards in solution content
- wrong-answer retry behavior in 120
- page-level horizontal overflow

Playwright runs the same suite in mobile and desktop projects.

Important:
Existing E2E does **not** sufficiently catch the QAF-007 target-heading leaks. Add focused assertions after repairing those labels.

---

# Global source-fidelity gate — OPEN

The app structure authority states that 87–120 follows the 4STEP original wording / subproblem order.

A derived Library Word document was found during audit, but its displayed numbering does not align directly with the current app numbering for this range.

Therefore:
- do not use that derived document alone as proof of raw-source fidelity
- do not mark the source-fidelity gate PASS yet
- final acceptance still requires re-check against the actual original source / authoritative scans for:
  - numbers
  - signs
  - inequalities
  - radicals
  - subproblem order
  - domain conditions
  - wording that changes mathematical meaning

---

# Discovery-pass summary

Confirmed / strong findings:

1. **QAF-001 CRITICAL**
   - 88–96 Chinese generic fallback destroys learner-facing mathematical meaning.

2. **QAF-002 HIGH**
   - 89 common prerequisite is not represented as the required reusable dependency.

3. **QAF-003 HIGH**
   - 96-(4) jumps from candidate set B directly to final {5}, skipping two meaningful filters.

4. **QAF-004 MEDIUM**
   - 92-(2) never explicitly completes `A∩B=∅` in the guided flow.

5. **QAF-007 HIGH**
   - current-target headings leak current answers in multiple problems.

Review-only:
- QAF-005: 88 pattern/step hole strength
- QAF-006: 104/107 interaction density
- QAF-008: strongly suggestive but not literal target labels

Open final gate:
- raw original source fidelity

No repair has been applied yet.

---

# Next execution order

Now that 87–120 discovery is complete:

1. re-check QAF-001–004 and QAF-007 once against the authority docs
2. freeze the issue list
3. repair in small independent commits, highest severity first:
   - Chinese semantic parity 88–96
   - current-target answer leakage
   - 89 dependency
   - 96-(4) missing reasoning stages
   - 92-(2) explicit intersection conclusion
4. run focused source / parity / presentation tests
5. run build
6. run mobile + desktop E2E
7. deploy
8. final learner-flow QA
9. raw-source fidelity re-check
10. update authority/worklog and mark 87–120 complete only after every gate passes

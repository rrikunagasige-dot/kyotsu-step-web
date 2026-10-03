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

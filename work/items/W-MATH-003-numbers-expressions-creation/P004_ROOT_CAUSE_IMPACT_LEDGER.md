# W-MATH-003/P-004 — Root-cause impact audit (CMD-WORK-001 修正優先)

**Scope:** original teacher-edited Word 123 Qs across N04/N05/N06/N07/N08/N11/N13/N14, plus the six accepted creation units N01/N02/N03/N09/N10/N12. Original Word: SHA-256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`; source audit: `N04_N14_SOURCE_SOLUTION_AUDIT.md`. Comparison made against review-only PR #101; no original Word, source PNG, existing accepted curricula or main changes.

**Two defect classes:** A: the Word asks for both an intermediate reason and a result but the app choice only checks the result; B: the lead gives away the same judgement that the learner is asked to make. Prior-to-answer instructional scaffolding is **not automatically** a defect: check what remains for the learner to infer. This ledger separates confirmed source-fidelity problems from heuristic suspicions and UNVERIFIED coverage; none is quietly marked PASS.

| Unit | Mechanism A — compound source question | Mechanism B — exact learner decision leaked | Work scope / audit verdict |
|---|---|---|---|
| N04 | **CONFIRMED, repaired Q13:** now checks `3x·2=6x`, `1·x=x` and full expansion | No separately confirmed B in checked Q02–Q22 | P-004 correction, full CI passed; comprehensive entire-unit independent official-key derivation still UNVERIFIED |
| N05 | **CONFIRMED, repaired Q17:** requires opposite signs **because** `rs=-3<0` | No separately confirmed B in checked Q01–Q20 | P-004 correction, full CI passed; other source questions beyond the verified audit not independently proven with official answer booklet |
| N06 | No separate confirmed A in checked Q01–Q16 | **CONFIRMED, repaired Q08**; **new CONFIRMED N06-Q11** lead currently says `(y+x)T`, with `T=x²+x−2` already given, effectively answering the source's request to factor a common bracket | Q08 repaired; Q11 OUTSIDE P-004 approval, proposed separately, **NOT FIXED** |
| N07 | No separate confirmed A in checked Q01–Q14 | **CONFIRMED, repaired Q06:** no longer states 10× before the choice | P-004 correction passed; rest of overall independent key audit UNVERIFIED |
| N08 | **CONFIRMED, repaired Q05:** requires `5<9` and `√5<3` | No separate confirmed B in Q01–Q12 scan | P-004 correction passed; rest of all source/distractor proof UNVERIFIED |
| N11 | No separately confirmed A in Q01–Q14 scan | **CONFIRMED, repaired Q05:** operation/inequality now chosen as pair; prompts that explain the **method** without furnishing the final interval (e.g. Q09) are not automatically identical | P-004 correction passed, potential other scaffolds require careful distinction |
| N13 | No compound truncation confirmed in inspected nine Q items | No identical pre-answer result confirmed for the specific two mechanisms in nine-Q scan | **NOT-AFFECTED for inspected A/B patterns**, not a claim of exhaustive official-authority mathematical verification |
| N14 | No additional confirmed A in Q01–Q16 scan | **CONFIRMED, repaired Q06 and Q11**; **new CONFIRMED Q05** lead explicitly tells learner '外側' and '等号も許す' although the original source asks learner to choose both | Q06,Q11 repaired; Q05 OUTSIDE P-004 approval, **NOT FIXED** |
| N01 | Existing compound Q09/Q10 have decomposed reasoning items | Scoped lead/read-flow regression passed, but original source not re-proven end to end in this P-004 sweep | **UNVERIFIED full independent original cross-check**; original accepted code untouched |
| N02 | Existing compound Q09 represented by a paired result; original local steps still separately gate thoughts | No positive new match found in representative check | **UNVERIFIED comprehensive audit**; accepted code untouched and regression passed |
| N03 | Original Q10 four local products are answered separately; Q11 then combines like terms | No direct new leak confirmed in sampled flow | **UNVERIFIED comprehensive audit**; accepted code untouched and regression passed |
| N09 | Q08 originally augmented with four independent square/sign/interval reasoning holes | Existing answer-gating independently regression tested | **UNVERIFIED comprehensive audit**; accepted code untouched and regression passed |
| N10 | Separate proof nodes distinguish square-value from nonnegative-sign condition | No direct new leak confirmed in sampled flow | **UNVERIFIED comprehensive audit**; accepted code untouched and regression passed |
| N12 | 26-stage original derivation, wrong feedback and figure gate regression passed | No direct new leak confirmed in sampled flow | **UNVERIFIED comprehensive audit**; accepted code untouched and regression passed |

## Exact additional source facts and protection

- N06 original Word page 20, `【11】前後に共通するまとまりをくくり、二つの因子の積にしよう。` Current app `src/data/textbook/math/numbers/n06Lesson.ts` Q11 lead itself says `同じ括弧をTと置けば(y+x)Tである`. This conveys the algebraic factorization before the student's decision. Do not touch until a separately approved exact revision.
- N14 original Word page 45, `【5】境界を求め、間と外側のどちらを残すか、等号も含めて判断しよう。` Current app `src/data/textbook/math/numbers/n14Lesson.ts` Q05 lead says `原点から離れた点を残し、等号も許す`, telling two of the required judgements before the answer. Do not touch until a separately approved exact revision.
- N14 Q07/Q08 teach earlier-established general in/out rule and still ask for symbolic inequalities; those **have not been confirmed** as the same defect. Hints after incorrect attempt are not the same as pre-answer leakage. Avoid inflating issue count.

## Verification and stop

- [Full Math CI 39343256282](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39343256282): **success** at source head `7fce8fa93511df5406602d1a3e0d3c6e1f3dfdf9`. Includes 127 progression actions, 16 P-004 320/390px correction interactions, restored math/physics/practice, type/lint/build, image-byte assertions and unit tests.
- 48 real screenshot files committed at `d74b210187d90c98628271f173ed5cf795c3f964`; [one-link image check](./evidence/n04-n14-gallery/README.md). Visual acceptance of revised P-004 screenshots remains **PENDING**.
- **Gate② status: NOT CROSS-VERIFIED**; two new confirmed B defects N06-Q11 / N14-Q05 unresolved, complete independent proof of all 123 answer/distractor mathematical equivalences (official key absent) remains marked separately UNVERIFIED. Gate③ FINAL-REVIEW-NOT-READY.
- W-GOV-008 and P-004 prohibit unauthorized expansion. Do not alter Q11/Q05, main, deploy, status acceptance, other lessons or learner history without exact user permission.

# W-MATH-003 / P-003 — N04〜N14・8単元123原問の一括作成 提案（要明示承認）
Status: **PROPOSED — NOT APPROVED / DESIGN REVIEW ONLY**
Date: 2026-10-18 JST
Working main at proposal start: b8e7f087756a0d819abe65f69ca13d03a9fb47fb
Command: CMD-WORK-002「作成」, mathematics/textbook.

## The decision proposed to the user

**May we create eight review-only learner modules in one approved P-003 scope after a N04/N05 pilot check, based on the accompanying complete 123-source-marker audit and 39-block learning design, preserving the nine original figures with answer-gated placement, and submit the finished implementation on a separate PR for testing?** No merging into main or Pages publication is included in this approval.

User said 「一気にN04からN14までやろう」 on 2026-10-18, which authorizes doing the design review for this scope but is not taken as approval of this unseen exact P-003. Await their response to this document.

## Source and scope lock

- Original input: teacher-edited Word 01_数と式_教科書モード_対話段階導入版_v2(1).docx, 212863 bytes, SHA-256 93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa.
- Eight **new** units: N04 (22), N05 (20), N06 (16), N07 (14), N08 (12), N11 (14), N13 (9), N14 (16) = 123 source question markers. Each has independently derived provisional solution and thinking-operation mapping.
- Already-live N01/N02/N03/N09/N10/N12 = 85 markers, 90 interactive choices, untouched. These must NOT be counted as 123 new app problems.
- Nine images exactly as original bytes: N04 1; N05 2; N08 1; N11 2; N13 2; N14 1. N05-F02 after Q15, N11-F02 after Q10, N13-F02 after Q01, N14-F01 after Q06; other placement in detailed design.
- Exclude NE01/NE02 (25 original markers), all old math-sets/proposition/functions/practice/physics/Chapter3, previous source Word and existing accepted responses.
- Original author official answers, source publication rights and original publisher textbook have not been supplied. Our independently derived answer table is **not** represented as authoritative answer booklet.

## Proposed 3-topic / 2–3-heading information architecture

| Topic card (existing) | Learner section headings | Source lessons after the batch |
| --- | --- | --- |
| 式を整える | 多項式の基本；乗法公式と因数分解 | N01–N06 |
| 実数を扱う | 小数と有理数；絶対値の意味；根号と実数 | N07–N10 |
| 不等式を使う | 一次不等式；絶対値の方程式と不等式 | N11–N14 |

Use one main unit title plus compact subsection labels; don't introduce more large cards. N13 remains correctly named 絶対値方程式 even inside the third topic. A one-line root reminder bridges N08 → N09. Existing routes and 90 stages remain stable.

## Source-to-learner design coverage

- N04: 6 segments; multiplication grid → square/square difference → compound expression.
- N05: 7 segments; common factor → square factorization → sum/product factors → cross diagram → repeated application.
- N06: 4 segments; choice of substitution and letter order, double-difference-of-squares.
- N07: 4 segments; division and remainder → recurring decimals and fractions → denominator 2/5 criteria.
- N08: 4 segments; distance → sign case → √5/π comparisons → properties.
- N11: 5 segments; inequality difference/sign proof → positive/negative coefficient → included endpoint → fraction.
- N13: 4 segments; distance to the center → shifted equation → signed branches → degenerate case.
- N14: 5 segments; inside/outside number line → strict/non-strict endpoints → general formulas → absolute-value compound interval.
- **Total: 39 reasoning segments spanning all 123 original source markers.** Original problems may yield multiple thinking/choice steps; number of source questions and number of UI choices must not be conflated. Full individualized learner copy/choices are an implementation deliverable after authorization, not something falsely declared completed at design review.

## Implementation method to approve (not executed yet)

1. N04 and N05 representative authoring on a new implementation branch. Write hole-free prose first, then cognitive decision nodes, teacher/peer dialogue only at meaningful moments, individualized wrong-reason feedback, exact source question IDs and figure answer gates.
2. Run math validation, source coverage, original-image hash/visual fidelity, answer leakage, schema, KaTeX, desktop/mobile click-through and regression for N04/N05. If material conflict emerges, stop and return for revised proposal, not mass-propagate a flawed pattern.
3. Apply validated pattern in scope to N06, N07, N08, N11, N13, N14, with per-unit QA; no unreviewed bulk templating, and do not auto-derive misleading distractors.
4. Keep all eight **review-only** and implement 3 topic page navigation with 2–3 section headings per theme, preserving existing data/progress IDs and learner-first navigation.
5. Open **separate implementation PR**; require complete 123/123 original markers mapped with independently checked worked solutions and meaningful thinking choices, QA gate checks, no regressions. Send actual app-preview link if available. If only PR is available, say so explicitly.
6. Obtain separate explicit release authorization prior to merging to main/Pages; then verify live working app routes. User hands-on acceptance before Work marked DONE.

## Acceptance checklist

- [x] Original Word source SHA/byte size reverified for design; source markers 123/123 mapped and 9 candidate original diagram assets hashed.
- [x] Independent teacher-side answers 123/123 recorded; status provisional pending second QA, no official answer booklet.
- [x] All 39 logical teaching segments, 8 representative interaction models, dependency paths, 2–3 heading layout, diagram gates, and known pitfalls documented.
- [ ] User explicitly approves exact P-003 proposal (not yet).
- [ ] Complete student-facing copy and candidate choices for every interaction; pilot/whole-batch proof, diagram and no-leak QA.
- [ ] Implementation PR and CI/desktop-mobile E2E run, accessible app/preview link.
- [ ] Separate merge/Pages authorization; live release verification and user acceptance.

## Primary review artifacts

1. N04_N14_SOURCE_SOLUTION_AUDIT.md — all 123 questions, derived answers and target cognitive operations.
2. N04_N14_LEARNER_DESIGN_MAP.md — all 39 thinking groups and 123 one-to-one source-node maps, 9-figure gates and test plan.
3. This document — exact authorization boundary and status.

## Current decision

**STOP at design review.** A draft PR containing these docs has no learner app changes and is not a replacement for the working Pages URL. Await explicit user response to this precise scope before creating the eight new modules. If the scope is adjusted, produce revised full P-003 for approval before implementation.

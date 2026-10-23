# W-MATH-025 / P017 — N12 remaining four mathematical groups

Status: PROPOSED
Command: CMD-WORK-001
Date: 2026-10-23 JST
Approval: NOT YET RECEIVED

## Evidence / cause

Frozen source91f7b2df72d5403931e0a0df0b656627516116d8; actual run39919622149; [impact audit](./P016_IMPACT_AUDIT_20261023.md). Eleven pairs tested at320/390/1440 before/wrong/correct. Four other320px defects are confirmed;390/1440 pairs stayed on one row. Independent React fragments permit a line break between a coefficient/constant choice and its following expression. Correct source mathematics and KaTeX parsing do not fix CSS line binding.

## Exact four-block display proposal

□ denotes the EXISTING interactive choice, not a literal pasted square. Preserve existing click/wrong/hint/correct behavior.

1. `formula-q02-coef` / `n12-p002-q02-coef`: mobile≤430px shows \(x+4\\le5-x\), then ↓, then whole \(\\square x+4\\le5\) on one row. Desktop one line with ⇒.
2. `formula-q06-right-coef` / `n12-p002-q06-right-coef`: mobile≤430px shows \(2x+4\\le9-x\), then ↓, then whole \(\\square x+4\\le9\) on one row. Desktop one line with ⇒.
3. `formula-cost-pudding` / `n12-p003-q10-pudding-coef`: mobile≤430px shows \(130\\times(20-x)\), then whole \(=\\square(20-x)\) on one row. Desktop one equation line. Keep coefficient and complete parentheses bound in before/wrong/correct states.
4. `formula-q13-lower` / `n12-p002-q13-lower`: mobile≤430px keeps \(\\square\\le50x\) on the first visual row and \(<3300-2650\) as the continuation row, with relation signs aligned. This is the SAME chained inequality read across two visual rows; no duplicated middle term, changed inequality direction, simplified arithmetic, extra question or answer exposure. Desktop retains \(\\square\\le50x<3300-2650\) in one row. Preserve hole+≤50x as an indivisible group.

## Scope and protections

Only these four exact N12 block/item identities receive semantic layout wrappers and narrowly scoped CSS. Main app files: TextbookFormula.tsx/global.css. Tests and four review-only targets may be added; set the two accepted P016 targets to accepted/hide their old markers according to P016 acceptance, preserving all earlier seven/five acceptances. No other formula gets this layout automatically. Preserve all lesson data, mathematical terms/order, keys, distractors, hints, source Word/figures, IDs/revisions and storage/history. No font/button shrinking, schema/storage migration, global redesign, main merge or hosting.

## Verification / stopping conditions

Operate all four at320/390/1440 in ordinary and review routes: initial/wrong/hint/retry/correct/reload; assert group row binding, parentheses, arrow/order, no horizontal clipping and unchanged saved answer metadata. Q13 must preserve exact term sequence on two logical continuation rows, including correct state. Inspect original native screenshots, not only numerical bounds. Recheck accepted P016 two-block layouts; accepted old markers absent; all35N12 items still complete/restore,32normal formulas and untouched routes regress. Run appropriate unit/type/lint/build/full math/review/governance checks. Repeat bounded same-root11-pair audit and record PASS/FAIL/UNVERIFIED honestly. Save four genuine image groups together for user Gate①. If any proposed group still fails at320 without resizing, stop as FAILED-VERIFICATION and revise the proposal rather than changing mathematical content silently.

This is one batch of FOUR confirmed defects; do not invent a fifth. No implementation before exact proposal approval per Work OS §12B. Approval of P016 visual acceptance does not approve this new P017 scope. Chapter Gate② OPEN / Gate③ NOT-READY.

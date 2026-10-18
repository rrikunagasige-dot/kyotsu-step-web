# W-MATH-007 / P-001 — 正答1を式中の係数として埋めるとき「x」と表示する修正案
Status: PROPOSED
Date: 2026-10-18 JST
Command: CMD-WORK-001「修正」
Target repo: rrikunagasige-dot/kyotsu-step-web / main 066e0da905bf4948e25ec200fe1b46e34d6ed573
Approval: NOT YET. User has requested the correction but has not yet reviewed and approved this exact implementation proposal. No learner code change on this branch.

## 1. 現在の症状・原因
N12 Q06 左側の導出において、
- before choosing: `3x+2\\le2x+4\\Longrightarrow [選択]x+2\\le4`
- the local answer ID `n12-p002-q06-left-coef` stores the mathematically correct answer string `"1"` (formula type).
- `TextbookFormula.tsx` renders the resolved answer as its own `InlineMath("1")` followed by the next authored math part `InlineMath("x+2\\le4")`. Adjacent spans visually produce `1x+2\\le4`.
- Existing N12 teaching text already states `1x=x`; the final in-equation result itself should follow that convention.

## 2. Exact intended learner behavior
| Stage | Display |
| --- | --- |
| Before selecting the local coefficient | `3x+2≤2x+4 ⇒ [選択]x+2≤4` |
| Student selects answer **1** | `3x+2≤2x+4 ⇒ x+2≤4` |
| Saved answer, grading, explanation | Keep **1** as the coefficient answer and in progress history; wrong answer still × and blocks downstream stages. |

Implement a **display-only, context-aware normalization at the formula part boundary**:
1. When a formula-type local choice is resolved to exactly numeric answer `1` **and the immediately following formula-math part starts with a standalone variable `x` that the coefficient multiplies**, render the resolved span as `x` and remove exactly that one prefixed `x` from the next rendered span. This preserves the visible resolved element and avoids a `1x` glyph, phantom gap, duplicated x, or broken resolved-testid.
2. If an answer `1` is a **constant, exponent, endpoint, equality value**, or the following part does not clearly begin a variable factor, retain `1`. E.g. `x=1`, `x≤1`, `1+2`, `x^1` remain untouched.
3. No global regex replacement of all `1x`, no math rewriting of full formulas, no altering `normalizeTextbookMath` behavior across subjects. Keep the current readable explanation `1x=x`; it explains the convention.
4. For this P-001 the confirmed expression is simple `x+2\\le4`. Do not automatically rewrite `-1x`, powers/subscripts, non-x variables or uncertain boundary cases without a separate audit/revision.
5. Preserve visibility/accessibility of the resolved x and the original answer-1 semantics (e.g. accessible label "係数は1"). The legacy 「選択」 rectangle before answering and ≥44px interaction area remain unchanged.

## 3. Scope, impact and exclusions
- The **one source-confirmed affected active case** is N12 Q06-left coefficient `n12-p002-q06-left-coef`; exact renderer boundary is `TextbookFormula.tsx`. The other N12 adjacent coefficient cases are answers 2,2,3; N12 constant answer 1 must remain 1.
- Read-only audit of approved N01, N02, N03, N09, N10 and N12 current main source found the next-part-starting-with-variable signature only in four N12 coefficient positions; only one has answer 1. Unmerged draft #80's N01/N03/N09 local choices do not have the same 1-before-x case (negative coefficients and evaluated products instead).
- Do not modify W-MATH-005 draft #80, physics/other modes, other units, N12 teaching text, source documents/figures, mathematics, IDs, answers, unitRevision, v1-to-v2 migration, or publish W-MATH-007 without its own release approval.
- Secondary cross-approved-unit audit before closure is required; if a sibling approved lesson has a distinct same-defect signature, record and request separate exact correction approval.

## 4. Verification gates
1. Source diff: N12 all 26 active stages and 15+11 original answer IDs/values, metadata, hints, source mappings, figure IDs and migration logic unchanged bit-for-bit.
2. Mobile 320px and desktop E2E: before choice the familiar [選択] x position appears; choosing 1 makes `x+2≤4` without `1x` or duplicated `xx`. Solved element stays visible and can be found via `resolved-n12-p002-q06-left-coef`. Wrong answer still blocks progression.
3. Neighbor invariants: answer 2 before x => `2x`; answer 3 => `3x`; a bare numerical answer 1 stays `1` (including N12 q02 constant). The textual `1x=x` explanation remains.
4. Rerun N12 entire 26-step + old v1 restore, N02/N09 figure gate, draft W-MATH-005 unchanged regression/source scan, mobile overflow, math textbook/physics/practice CI, governance. Record every failure and fix.
5. Isolated implementation PR and visual review; no main merge / Pages release before **separate** user authorization. After acceptance, deduplicate the lesson with existing shared math/design rules and resume paused creation queue.

## 5. Explicit approval question
「**W-MATH-007/P-001を承認する**」 means approval to implement/test only the above display-only coefficient-one correction, beginning with N12 Q06-left, with targeted cross-unit QA on an isolated branch. It is **not** permission to change answer 1, create more questions, change other math or publish to main/Pages.

### Review History
- Review status: WAITING EXACT USER APPROVAL
- User feedback: wants expression x after selecting coefficient 1 rather than 1x.
- Prior W-MATH-006/P-001: separately approved, PR #83 merged and Pages deploy triggered.
- This proposal: new scope not covered by prior release approval; learner changes blocked until approved.

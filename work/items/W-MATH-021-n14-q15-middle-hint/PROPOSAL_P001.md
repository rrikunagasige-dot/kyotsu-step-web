# W-MATH-021/P-001 — Remove direct answer from Q15 middle's error hint
Status: APPROVED — direct user 「承認」, 2026-10-22 JST; one-hint replacement implemented; verification ongoing
Date: 2026-10-22 JST

## Confirmed behavior and reason
The correct but still unanswered Q15 middle choice is divisor 3. After a wrong answer, its hint reads exactly:
> 3x÷3=x。正の数で割ると不等号の向きと等号は保たれる。
The first equality directly gives the answer 3, instead of guiding the student to determine it. This is after wrong input, not before the first choice. It conflicts with Mathematics Textbook SPEC §8 / MASTER lessons against prematurely completing unresolved thinking nodes.

## Exactly one permitted string substitution after approval
File: src/data/textbook/math/numbers/n14Lesson.ts
Item ID: n14-wm020-q15-divide-center
Replace only the on-error hint:
> 3x÷3=x。正の数で割ると不等号の向きと等号は保たれる。
with:
> 3xの係数を1にするには、どんな正の数で割ればよいか考えよう。正の数で割れば不等号の向きと等号は変わらない。

Preserve three original logical equations, two mobile visual lines, five holes and answer keys, canonical 選択/× control size, Q10/Q14/Q16, progress revision9/history, accepted Gate① states, figures, CSS, other modes and release state. No answer/option/meaning change and no revision bump required.

## Exact test/verification once approved
Verify hints on a wrong middle answer do not include the completed formula 3x÷3=x, yet still guide sign-preserving positive division. Run focused unit and real Chromium wrong/hint/retry/5-step stage tests at 320/390/1440, plus Math textbook, practice, governance and review checks. Capture real wrong-state screenshot with the target code SHA; do not repeat user approval of already accepted Q15 equations.
Same-root scan: Q10/Q14 local hints do not contain direct completed unresolved divisor identity (NOT-AFFECTED by this literal). Old Q16 after-wrong hint contains both substituted outputs (CONFIRMED separate candidate; do not modify now). Other units' hints UNVERIFIED.
If any unexpected source or display change occurs, stop and propose a new exact scope. Main, Pages and deployment remain forbidden.

## Approval boundary
Only an explicit separate user approval of this one Q15 center-hint sentence permits changing learner code. This proposal does not close independent Gate② or whole-app Gate③.

## Explicit exact approval and implementation — 2026-10-22
After being shown the full one-hint substitution and asked 「この1文の修正を承認しますか？」, the user replied **「承認」** without changes. On isolated W-MATH-021 branch, changed exactly the Q15 center item on-error `hints` literal in `src/data/textbook/math/numbers/n14Lesson.ts`. Did NOT change answers, formulas, accepted Q15 visuals, Q10/Q14/Q16, revision9, math renderer, main or public application. Focused Vitest assertion and dedicated authentic 320/390/1440 ordinary-app wrong/hint/retry screenshot capture added; no Gate① changed-hint user acceptance until actual tests/screenshots succeed. Full independent Gate② and Gate③ remain open.

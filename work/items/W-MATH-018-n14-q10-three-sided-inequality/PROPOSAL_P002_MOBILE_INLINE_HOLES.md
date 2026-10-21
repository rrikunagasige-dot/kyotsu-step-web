# W-MATH-018/P-002 — N14 Q10の三辺にある選択穴をスマホで見切れなくする
Status: APPROVED — user direct 「続けて」 on 2026-10-22 JST, exact P-002 scope only
Date: 2026-10-22 JST
Command: CMD-WORK-001「修正」 §12B, material visual repair to approved P-001. Reason: actual user-visible defect shown in [P001_GATE1_VISUAL_DEFECT.md](./P001_GATE1_VISUAL_DEFECT.md).

## Source evidence
N14 Q10 approved 3-line, 5-choice, 1-reason equation `-5+□<x-3+□<5+□`.
True browser screenshots on source SHA `e1e913f2230c42175bc5e67a53e726d030752634` show at **320px** the full `5+□` absent, at **390px** right-most “選択” partly clipped. After all three holes fill with `3`, the equation fits. `overflow-x:auto` in `.reading-formula-line` with `.reading-formula-expression { min-width:max-content }` hides the missing part in an **inner scroll area** despite document-level no-overflow E2E passing.

## Exact proposed visual repair — no mathematical redesign
Retain P-001 exactly: original three maths rows, the same single explanation at same time, five independent graded choices with keys `3,3,3,-2,8`, revision7 archived history, original Q09/Q11 and old N14 Q07/Q08/Q12/figure. Change **only the mobile (width <= 430px) presentation** inside `[data-derivation-id="n14-q10-chain"]`:
1. Replace the displayed full-width “選択” text in **unanswered inline gaps inside Q10** visually with a boxed **`□`** using a scoped CSS `strong::after` label. On a wrong answer, display **`↻`** instead of full “もう一度”, retaining the existing red wrong indicator. Underlying button, item.prompt `aria-label`, keyboard activation, saved values, error/hint/retry and answer options remain unchanged; no JS/renderer semantic change. At widths above 430px retain the original “選択/もう一度”.
2. In `src/styles/global.css` only, inside a dedicated `@media (max-width:430px)` rule scoped to `.reading-derivation-chain[data-derivation-id="n14-q10-chain"]`, reduce this derivation's equation horizontal padding to `.12rem` and formula font size to approximately `.90rem`; set internal flex gap to zero, and unfinished button `margin-inline:0`, `padding-inline:.1rem`, `min-width:2rem`, preserving its focus ring, clickable height >=34px and visible border.
3. **Do not** change `src/pages/TextbookUnitPage.tsx`, other derivations, shared selector defaults, the normal mobile toolbar, the maths source/sequence, or any output for other N units. The Q10-only CSS descendant styling must be side-effect-free for accepted N11 and N14 Q07/Q08/Q12.
4. Textbook visual unit remains one continuous Q10 derivation; no fourth equation, no unapproved additional maths blocks, no horizontal swiping required to see an operand. If the screen cannot fit without reducing accessible button width below 2rem or maths below .9rem, STOP and return to revised exact proposal rather than silently clipping or wrapping algebra.

The rule's purpose is precisely to remove `選択` label width, **not** to give away the numeric answer: do not print `3` in an unopened gap. `□` is clickable and has a visible blue outline; screen readers use the existing item prompt.

## Tests and scope
- Extend existing W-MATH-018/P001 Playwright on 320/390px **at each of five decision states**, including all three unanswered, wrong/retry and later numeric holes: assert Q10 second formula `.reading-formula-line.scrollWidth <= clientWidth+1` and that all three gaps' bounding rectangles lie inside the formula content rectangle. The old E2E only checked document overflow; this is the specific missing assertion.
- Verify 1440px layout unchanged, KaTeX no errors, normal lesson Q01→Q11 and Q10 numbered review, hint/retry and the original solved 3-line chain. Screenreader/button aria-label and keyboard events remain.
- Protect old accepted Q07/Q08/Q12, N11 P006/P007/P008 and N14 figures; rerun unit schema, 154 graded operations/source map, progress revision1–6→7 archives, full Math textbook CI and Physics/Math Practice regressions.
- Repair the obsolete v6 browser-test expectation independently as a **test-only correction already made in `0b63f8a1fc9b6d70d8ce6c0f90732345d431e8a9`**, not an invitation to modify old problems. Full CI retest to be confirmed.
- New genuine Q10 image sheet must refer to the **new matched learner source SHA**; old clipped screenshots remain logged as pre-fix evidence. Gate① user approval limited to the changed Q10 mobile/normal screenshot; Gate② and Gate③ separate.

## Scope and approval boundary
P-001's pedagogy and source code remain approved. The discovered 320/390 layout defect does NOT permit automatic CSS change: the user's prior 「続けて」 approved P-001, not this material responsive design. No N14 Q14/Q15 content, global CSS defaults, new host, main merge, or unrelated chapter edits.
Status: APPROVED, bounded scoped CSS/test implementation authorized by direct user reply 「続けて」. Not approval of screenshots, main merge or release.
**承認確認：スマホ430px以下のN14 Q10の穴だけを `□`（誤答後は `↻`）にコンパクト化し、数学の3行・5操作を保持したまま式全体を見えるようにしてよいか？**

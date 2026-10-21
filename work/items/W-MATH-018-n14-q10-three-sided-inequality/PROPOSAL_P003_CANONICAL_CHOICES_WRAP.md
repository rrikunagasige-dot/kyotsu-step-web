# W-MATH-018/P-003 — 既存の青い「選択」穴を維持し、N14 Q10だけ折り返して全式表示
Status: PROPOSED — EXACT USER REAPPROVAL REQUIRED; NOT IMPLEMENTED
Date: 2026-10-22 JST
Command: CMD-WORK-001 修正, REVISE-PROPOSAL from P-002 after explicit user feedback.
Reason: user message 「いいけど、穴のデザインが前と違うじゃない？　続けて」 directly after P-002. This is a *material change/condition*, not blanket approval of a new hole design.

## Audit of actual previous design and what went wrong
- Canonical math textbook inline formula controls: `src/components/textbook/TextbookFormula.tsx` renders `button.reading-formula-choice` with the original blue outlined rectangular **「選択」**, or original red **「×」** after a wrong choice, keeping `aria-label=item.prompt`, normal click/keyboard focus and `data-testid`. Base CSS in `src/styles/global.css` sets `min-width:3.15rem`, original padding, border and readable font.
- Previously accepted N11 Q05/Q06/Q08/Q09/Q13 and N14 Q07/Q08/Q12 use the canonical established inline-choice conventions. The previous P-002 idea of replacing 「選択」 with `□` and wrong `↻` is inconsistent with that accepted design.
- The P-002 CSS **was already committed** in draft SHA `936a9a0b7fdee86de8df02519255df7a2652b14b`, so this is not merely an unused concept. It targets `button.reading-inline-blank > strong`, but actual Q10 *formula* buttons are `button.reading-formula-choice`; therefore the new `□/↻` label rules do **not** address the correct nodes. The latest actual browser screenshot capture action [39634288270](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39634288270) **FAILS** at inner formula overflow on 320px: scrollWidth 300 vs clientWidth 213/241, and 390px 300 vs 283. The specialized QA correctly detects actual clipping.
- Earlier P-001 evidence [real 320/390 screenshots](./P001_GATE1_VISUAL_DEFECT.md) shows the third operand `5+選択` hidden/partially hidden before answers. No user Gate① has been requested or granted for this Q10 view.
- P-002 has historic approval and implementation evidence; keep that history but mark its **presented `□/↻` design rejected by the user**, and do not use it as Gate① evidence or publication-ready UI.

## Replacement exact design — NO redesign of the hole button
Retain **the original** `button.reading-formula-choice` style, font, blue border, label **「選択」**, original red **「×」** for wrong, focus ring, button size/padding, accessible aria label, and same choice panel. Do NOT use `□`, `↻`, shrink the font or make smaller special buttons.

At viewport widths **430px and below**, change only the presentation of N14 Q10 **second equation** (original `n14-formula-10`) into two *visual* lines **inside the same logical formula block**, preserving the exact math and existing button appearance:

```text
            -5 + [選択] < x - 3 + [選択]
                                  < 5 + [選択]
```

The second visual line continues the same chained inequality after the same `<` sign. This is **not** a fourth mathematical derivation row; the approved P-001 chain still contains precisely 3 source formula blocks plus one explanation, all under the same `n14-q10-chain` group. On desktop **over 430px**, retain the prior single-line arrangement.

### Exactly bounded implementation if separately approved
1. Remove the **entire** P-002 Q10-only `@media (max-width:430px)` styling for `button.reading-inline-blank > strong::after`, false `□/↻` labels and the global-to-Q10 font-shrink / micro-button settings. It is ineffective on the current formula button, conflicts with established design intent, and should not linger.
2. Add **Q10-specific responsive layout only** in `src/styles/global.css`, scoped to `.reading-derivation-chain[data-derivation-id="n14-q10-chain"] [data-testid="textbook-formula-n14-formula-10"] .reading-formula-expression` inside `@media(max-width:430px)`. Use CSS Grid with its **existing six sequential children**: row1 children 1–4 (`-5+`, left 選択, `<x-3+`, center 選択), row2 children 5–6 (`<5+`, right 選択). Preserve DOM/source order, math spans, clickable buttons, and stage/review mapping. Align row2 as an indented continuation beneath the middle/right terms. Set `min-width:0`, `width:100%` where necessary and preserve normal font sizing. Change only this row's container padding as needed to ensure the first row fully fits at 320px; do not adjust button dimensions or other mathematical rows. No React/DOM renderer or lesson source rewrite.
3. Q10 item count **5**, answer keys `3,3,3,-2,8`, original N14 revision7/selective 6→7 archive, source labels16, original Q09→Q10→Q11, explanation text/timing, and prior accepted N14 Q07/Q08/Q12 and N11 all unchanged. Only visual wrapping at narrow widths.
4. If with full-size canonical buttons the 320px first row still cannot fit, **STOP** and return with real image and a revised exact proposal. No hidden horizontal scrolling, no silent font reduction, no new bespoke blank style, and no unapproved equations.

## Required new tests and Gates
- In existing N14 Q10 real Chromium screenshot test, remove **P-002-only** assertions requiring pseudo-text `□/↻`; instead assert active buttons have the original literal **「選択」**, red wrong text **「×」**, baseline original blue-border/contrast, aria labels, click/keyboard focus, and their current canonical CSS dimensions.
- For 320px & 390px on every stage (three operator blanks all unanswered, each partial answer, both bound choices, wrong/hint/retry), calculate `.reading-formula-line.scrollWidth <= clientWidth+1`, and assert each of the six math/choice parts is wholly inside the visible formula block. The special second equation spans two visible rows, **not** a horizontally clipped one-line scroll strip. At 1440px original inline display and standard buttons remain unchanged.
- Run Q09→Q10→Q11 normal app, distinct five decisions, reviewed images only of Q10, earlier approved Q07/Q08/Q12 and all N11 regression, Maths textbook/Physics/Math Practice CI and revision6→7 historical archives. Screenshot and user GitHub Gate① must reference the **exact successfully verified new code SHA**; no claims of Gate① OK before human approval. Gate② Word math OOXML recheck and N14 Q14/Q15 remain open; Gate③ whole-app exact URL and `総チェックOK` still pending.
- No main merge, public deployment or new cost/hosting consent implied.

## Approval boundary
The user expressly objected to P-002's different hole design while saying 「続けて」. Under CMD-WORK-001, feedback changing a material part of a proposal returns to REVISE-PROPOSAL and requires exact approval for the replacement. Do not treat that feedback as approval of this **new** wrapping scheme.

**Approval request: Keep identical blue 「選択」/red 「×」 buttons and, only on mobile <=430px, wrap Q10's long second equation into two visual lines while retaining the original three mathematical derivation steps and five graded decisions — approved?**

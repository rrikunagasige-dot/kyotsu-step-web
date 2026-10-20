# P-004-R4 — Narrow display-only split for long *resolved* operation-plus-result answers

Status: **PROPOSED / NOT APPROVED / NO CODE CHANGE**
Date: 2026-10-20 JST
Work: W-MATH-003, CMD-WORK-001「修正」, correction-first, prior P-004/R1/R2/R3 boundaries retained.
Audited actual app-code SHA: `06b1e0e217fc0933d203192ea0b2e11337bcee83`; screenshots commit `ad78002113827ac78b2d832bd1292c9308b32e47`. [Full approved P-004-R3 CI #39372583858](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39372583858) PASS; [real-image capture #39372579155](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39372579155) PASS.

## Confirmed visual failure; not a mathematical error

Original Word reasoning remains faithfully represented in the already approved R2 correct answer keys. But the new compound answer is rendered on **one line** in the **already-correct resolved inline formula**, so the fixed-width 320px white result box clips the right-hand part or requires unnoticed horizontal scrolling. This survives whole-document overflow checks and is not fully addressed by R3's `n07-09` three-line helper. Confirmed from genuine corrected **320px resolved screens**:

| Item | Screenshot | Affected operation-plus-result answer |
| --- | --- | --- |
| N11-Q13 | `evidence/n04-n14-gallery/p004-r2-n11-13-320-resolved.png` | `\\text{両辺に正の}3\\text{を掛ける},\\quad x-2\\le6x+3` |
| N14-Q14 | `evidence/n04-n14-gallery/p004-r2-n14-14-320-resolved.png` | `\\text{三辺に}2\\text{を足す},\\quad-2\\le3x\\le6` |
| N14-Q15 | `evidence/n04-n14-gallery/p004-r2-n14-15-320-resolved.png` | `\\text{三辺を正の}3\\text{で割る},\\quad-\\frac23\\le x\\le2` |

The earlier screenshot/choice audit additionally sampled N11-Q06/Q08/Q09 and N14-Q10; do not generalize to all seven without real measurement. Their answer strings are preserved. The root cause is `TextbookFormula.tsx` calling `textbookDisplayLines(id, value)` and leaving all three specified IDs as a single long answer row.

## Exactly proposed patch — only after explicit user approval

- Update **only** `src/domain/textbookDisplayLines.ts`: for `itemId` exactly in `['n11-13', 'n14-14', 'n14-15']`, return `value.split(',\\quad')` with two lines: the operation and the resulting inequality. Current R3 `n07-09` three-line rule and N09/N12 math line rules remain byte-equivalent in behavior.
- Change **no** answer/distractor value, explanation copy, Word source, lesson section, original 123 marker IDs / 127 items, nine PNGs, `revision`, progress archive or grading code. No CSS change, no global regex or new shared UI component.
- Add narrow formatter tests: all four choices at each of these three IDs can split to exactly two KaTeX-valid visible lines, recombining exactly to the unchanged canonical choice. Assert other IDs' display unchanged.
- Add 320px/390px real E2E checks for **resolved state** at these three IDs: two `reading-formula-n12-answer-lines` children and all rows with `scrollWidth <= clientWidth+1`; retain existing wrong→hint→retry→correct/reload coverage.
- Re-run existing Math CI (type/lint/unit/build, 127 operations, original source figure bytes, math/physics/practice regressions), genuine screenshot workflow. Review exactly affected screenshots, not all prior accepted pieces. Record full code SHA and image commit.
- Continue Gate② original-source independent math/distractor proof. Gate① for these newly affected displays must be reviewed in the next **single consolidated** batch alongside R3; no extra duplicate approval for earlier completed Gate① reviews.

## Stop/go

No approval of R4 has been given; user-approved R3 only covered five different preceding prose texts and the `n07-09` item-specific display split. **Do not implement R4 until the user explicitly approves this exact scope.** R3 technical work and its verified evidence are complete; R4 is another issue discovered by visual cross-audit. Main merge, Pages/Vercel publication and billing remain prohibited without separate authorization.

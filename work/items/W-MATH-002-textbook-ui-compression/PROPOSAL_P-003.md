# W-MATH-002 / P-003 — 数学学習モード・表示忠実性の補修
Status: APPROVED for implementation / NO main merge approval
Date: 2026-10-14
Target: rriku/kyotsu-step-web authoritative repo `rrikunagasige-dot/kyotsu-step-web` ID 1391122224
Base main: `9ea189a92c24e36b3274d00645a96f35e433b9bc`.
User approval evidence: after receiving the full P-003 proposal with F01–F04 and the scope/table, user answered 「よろしく」 with no changes requested.

## Objective
Fix the four concrete live screenshot failures in the published math-set learning textbook, without changing source curriculum text, formula choices, answers, original figures, order, or mode IDs.

## Approved F01–F04; exact locations
- **F01** formatting mismatch for A and complement A: `src/data/textbook/math/set/setOutsideSlice.ts` formula-d-a (lines 78–81), formula-d-abar (103–106), `src/pages/TextbookUnitPage.tsx` reference block and `src/styles/global.css` formula styling. Both are original formula blocks; harmonize math typography only, no source formulas.
- **F02** complement image hidden in compressed history: source block `figure-d-complement` at `setOutsideSlice.ts:107`, existing public SVG `public/assets/math/textbook/sets/complement-after.svg`; add existing source figure to active `set-d08/d09/d10` prerequisite references and show by default. No new SVG, no incorrect B-only diagram reuse, no answer-forward figure.
- **F03** set expression `\\overline{A}\\cap\\overline{B}` displayed as `\\overline\\{A\\}\\cap\\overline\\{B\\}`. Source correct in existing item choices for e03/e05/e07/e08/f12. Fault in `src/domain/textbookMath.ts` finite-set brace regex transforming LaTeX command grouping. Protect TeX grouping while retaining plain literal set conversion; regress vectors/radicals/physics.
- **F04** `set-f11` double equation forced into 2 tiny option cards, arbitrary math wrap: `src/pages/TextbookUnitPage.tsx` math choice renderer and `src/styles/global.css:389-394` grid. For long math choices use full-width cards; split at original source `\\quad` *for display only*, keeping a single choice/answer; short choices keep existing layout. Verify 320px and desktop.

## Allowed files
`src/domain/textbookMath.ts` and tests; `src/data/textbook/math/presentation.ts`, `src/pages/TextbookUnitPage.tsx`, `src/styles/global.css`, scoped `e2e/math-textbook-set-smoke.spec.ts`, math set unit test, this Work record. No new figure asset, lesson source, CSS-wide physics regressions, other modes, infrastructure or main merge/deploy.

## Verification gate
Typecheck, original and added normalization tests, source-identity and order, all 15-stage guards, math textbook mobile+desktop E2E, physics and math-practice regressions, browser compare against the four screenshots; GitHub CI and actual user's visual review are independent. Do not mark release user-accepted based only on CI.

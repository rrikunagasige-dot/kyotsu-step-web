# Findings — W-GOV-008/P-003 Gate ②

## F-201 — CONFIRMED math chain (source code inspection)
N01 from `3x²−5x+6−5x²+2x−3` groups into `(3−5)x²+(−5+2)x+(6−3)` then `−2x²−3x+3`; the three target item answers and final item match. N03 `(2x+1)(3x+4)` has four products `6x²,8x,3x,4`, before combining to `6x²+11x+4`. No mismatch in targeted answer literals.

## F-202 — CONFIRMED isolation by code construction
Review route is gated by `VITE_REVIEW_PREVIEW`; ordinary `TextbookReadingFlow` receives no `reviewMarks`. Review answers use `onReviewAnswer` + local React state rather than store action. Existing E2E asserted storage unchanged; new regression pending.

## F-203 — OPEN / visual limitation
The authentic N01 long formula in screenshot spans more width than one viewport. Its marker and intended choice were readable, but the complete expression could not fit in a single frame. This matches P-003 pilot F-005. Do not claim visual fit fully cleared or edit the lesson automatically. If user reports a usability defect, create exact CMD-WORK-001 correction proposal and audit other affected math textbook long derivations.

## F-204 — OPEN / human acceptance semantics
User's `大丈夫だよ。そのまま続けて` is general positive feedback after the two sheets. Exact `細部OK` for each block/SHA has not yet been independently recorded; this audit cannot promote `BLOCK-VISUAL-OK` for both without clear mapping. This is distinct from the technical verification.

## F-205 — PENDING new CI coverage
Expanded math source/static and Playwright 320px/wrong/retry tests require a new successful GitHub Actions run; failure is not yet observed.

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

## F-206 — CONFIRMED test-only assumption error, not an app defect
Expanded CI at `637132fb9fa0772b8a721bfdfa9a154ac5aecaad` / run `39206109937` failed because test demanded visible option `6x` without checking `getTextbookChoices` desired medium count 3. The learner source defines three distractors but presents two after stable shuffle; `6x` may be omitted. The corrected test selects an actually rendered wrong choice by its aria-label and then verifies the error state/retry. No lesson/state change authorized or made. Retest pending.

## F-207 — CONFIRMED expanded cross-block technical pass
At `9a379173ffc91e92b2c5014b1013b7299f68fce9`, run `39206502799` passed the full approved verification workflow: 27 scoped Vitest, typecheck, lint, build, existing interactive E2E, six new cross-block E2E executions across mobile/desktop, and seven screenshots captured at two viewports. N03 actually chosen visible incorrect option stays unresolved, reveals hint only after wrong answer, and requires a correct retry to unlock future product; regular /problems route has no marker. No saved learner progress changed.

## F-208 — UNVERIFIED related long-formula surface outside seven targets
Repository-only scan inspected N02/N09/N10/N12 math textbook review lesson formula fragments. These can contain wider derivations (notably N02 grouped polynomials, N10 radicals, N12 inequalities), but no equivalent actual mobile capture was made; no confirmed same-root defect or license to mass-repair. Track for future creation/repair preflight, with Master §§16/21/26 and Math Rendering §13 as existing deduplicated authority.

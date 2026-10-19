# Findings — W-GOV-008/P-003 Gate ②

## F-201 — CONFIRMED math chain (source code inspection)
N01 from `3x²−5x+6−5x²+2x−3` groups into `(3−5)x²+(−5+2)x+(6−3)` then `−2x²−3x+3`; the three target item answers and final item match. N03 `(2x+1)(3x+4)` has four products `6x²,8x,3x,4`, before combining to `6x²+11x+4`. No mismatch in targeted answer literals.

## F-202 — CONFIRMED isolation by code construction
Review route is gated by `VITE_REVIEW_PREVIEW`; ordinary `TextbookReadingFlow` receives no `reviewMarks`. Review answers use `onReviewAnswer` + local React state rather than store action. Existing E2E asserted storage unchanged; new regression pending.

## F-203 — OPEN / visual limitation
The authentic N01 long formula in screenshot spans more width than one viewport. Its marker and intended choice were readable, but the complete expression could not fit in a single frame. This matches P-003 pilot F-005. Do not claim visual fit fully cleared or edit the lesson automatically. If user reports a usability defect, create exact CMD-WORK-001 correction proposal and audit other affected math textbook long derivations.

## F-204 — CONFIRMED two per-block human visual acceptances
Previously `大丈夫だよ。そのまま続けて` was continuation only. User's 2026-10-19 14:55 JST exact message names both `細部OK N01 Q07` and `細部OK N03 Q10` and says both actual screens were seen. Gate ① acceptance now applies to precisely those seven marks, captured in pilot `ACCEPTANCE_LOG.md` with original screenshot SHA. It does not clear Gate ② independent audit or Gate ③ app-wide playthrough.

## F-205 — PENDING new CI coverage
Expanded math source/static and Playwright 320px/wrong/retry tests require a new successful GitHub Actions run; failure is not yet observed.

## F-206 — CONFIRMED test-only assumption error, not an app defect
Expanded CI at `637132fb9fa0772b8a721bfdfa9a154ac5aecaad` / run `39206109937` failed because test demanded visible option `6x` without checking `getTextbookChoices` desired medium count 3. The learner source defines three distractors but presents two after stable shuffle; `6x` may be omitted. The corrected test selects an actually rendered wrong choice by its aria-label and then verifies the error state/retry. No lesson/state change authorized or made. Retest pending.

## F-207 — CONFIRMED expanded cross-block technical pass
At `9a379173ffc91e92b2c5014b1013b7299f68fce9`, run `39206502799` passed the full approved verification workflow: 27 scoped Vitest, typecheck, lint, build, existing interactive E2E, six new cross-block E2E executions across mobile/desktop, and seven screenshots captured at two viewports. N03 actually chosen visible incorrect option stays unresolved, reveals hint only after wrong answer, and requires a correct retry to unlock future product; regular /problems route has no marker. No saved learner progress changed.

## F-208 — UNVERIFIED related long-formula surface outside seven targets
Repository-only scan inspected N02/N09/N10/N12 math textbook review lesson formula fragments. These can contain wider derivations (notably N02 grouped polynomials, N10 radicals, N12 inequalities), but no equivalent actual mobile capture was made; no confirmed same-root defect or license to mass-repair. Track for future creation/repair preflight, with Master §§16/21/26 and Math Rendering §13 as existing deduplicated authority.

## F-209 — UNVERIFIED new direct source comparison; historical raw audit retained
Library title lookup found two native v2 Word files, each 212,863 bytes. N01 Q7 appears on indexed page 4, N03 Q10 on page 8, but the Library text extraction loses the math. Page-image read to inspect the actual embedded equation returned 403 Forbidden. No new raw/OMML byte check performed. Prior W-MATH-003 `SOURCE_OMML_AUDIT.md` and `PILOT_SOLUTION_AUDIT.md` evidence (input SHA-256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`) remains provenance and is not a newly repeated independent check.

## F-210 — CONFIRMED N01 long-derivation right end reachable at 320/390px
At exact audit SHA `2249e8a66aab6519f83e5b74f144e6566d455d04`, GitHub Actions app run `39207997970` PASSED the new Playwright rightmost-element visibility and inner `scrollLeft` checks for actual long `formula-r3-q07-x2coef` at both widths on mobile and desktop Chromium. Root scroll width stayed within 1px. The entire equation is still not visible in one noninteractive screenshot; normal deliberate sideways scrolling accesses the right end. This supports PASS for actual target-route accessible rendering, not for untested N02/N09/N10/N12 long expressions.

## F-211 — CONFIRMED test-only target mistake and governance metadata mismatch, not a learner defect
At SHA `165468e3fc920dd5254ebd8e5968928a396e7981`, governance run `39207719786` failed because accepted narrow Work `Status: DONE` paired with noncanonical verification status; corrected to exact `Status: PASS`. Code check run `39207719880` passed TS, lint, 27 Vitest, build and prior interaction test, but failed the newly added scroll test in two browser projects because it targeted short `formula-like-original` (no horizontal overflow), not the longer coefficient derivation `formula-r3-q07-x2coef`. Original learner source proves the distinction. Fix only test locator; keep failed runs in the audit history and wait for exact new CI before declaring pass.

## F-212 — VERIFIED final post-acceptance test set
At `2249e8a66aab6519f83e5b74f144e6566d455d04`, governance run `39207997979` and app run `39207997970` both SUCCESS. Source data, answer keys, shared UI and learner progress unchanged; no public host or main write. Failed predecessor metadata/test locator in F-211 remains retained to prevent repeating the audit-misidentification mistake.

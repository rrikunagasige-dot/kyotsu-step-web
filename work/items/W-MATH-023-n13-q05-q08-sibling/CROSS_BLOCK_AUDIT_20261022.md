# W-MATH-023/P-002 — Gate② 独立横断監査（2026-10-22）
Status: IN-PROGRESS / **BLOCKED by confirmed linked W-MATH-024 correction**; NOT CROSS-VERIFIED
Work: W-MATH-023; P-002 approved; source of truth `rrikunagasige-dot/kyotsu-step-web` (repo ID 1391122224)
- Fully successful tested source SHA: `9816954b94593389fd6e92bed47dede35621eee2`
- Q08 actual browser source SHA: `f5c0b2934ae1682a63f36401386d4bb24084c06a`, immutable 15 photos `43fb15e835c008d69cc5606612dbd26bbbc28185` (byte-identical N13 lesson/progress/review/CSS to all-green source)
- Original teacher Word SHA256: `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`
- Auditor: independent source × math × screenshot × native GitHub Actions inspection, 2026-10-22 JST
- Q05 visually user accepted (verbatim 「いいよ続けて。因みに今どこまで進んでいる？」); Q08 visually user accepted (verbatim 「いいよ続けて」 **directly to Q08 Gate① sheet**). **These are BLOCK-VISUAL-OK ONLY**.
- Work source Q05 `n13-wm023-q05-right`/`n13-05`, Q08 `n13-wm023-q08-branches`/`n13-wm023-q08-positive-root`/`n13-08`; N13 rev4 = 9 original teacher markers, 12 graded choices, N13 original images n13-f01/f02.

## Evidence ledger
| Required surface | Result for scoped N13 Q05/Q08 | Reproducible evidence / boundary |
| --- | --- | --- |
| Source fidelity and original question IDs | **PASS** | Original Word paragraphs 557 (Q05 two positions), 566 (Q08 remove absolute value and solve). N13 mapped N13-Q05→2 IDs and Q08→3 IDs; 9 original Word labels retained; source `n13Lesson.ts` rev4. |
| Mathematics / connected reasoning | **PASS** | If x≥1 then |x−1|=x−1≥0; if x<1 then |x−1|=1−x>0. For |3x|=6 the alternatives 3x=6 or 3x=−6 yield x=2 or x=−2, both verified by substitution. Both involve correct `または`, not `かつ`. Specific StageA/B Vitest math assertions. |
| Answer, choice type, distractors | **PASS** | Exactly 5 new relevant decision nodes across two original source questions; native formula type and one correct per four stored candidates; KaTeX parsing and accepted IDs verified in `wMath023StageA/B.test.ts`, 229/229 unit tests at all-green SHA. |
| Hint leakage / feedback | **PASS for Q05/Q08**, sibling issue below | Two Q05 wrong-only hints use x=3 and x=0, not target expressions. Q08 wrong-only hints use analogous |y|=3 or 2u=6/−6, not the still-unsolved branch/root answer. Native wrong→hint→retry Chrome test 320/390/1440 pass. |
| Figure, data and 320/390/1440 screenshot fit | **PASS** | N13 original n13-f01 and n13-f02 hashes untouched relative to W-MATH-021; N13 real Chromium source-SHA screenshots for Q05 (15 PNG at `913a7b0...`) and Q08 (15 PNG at `43fb15e...`); Noto Japanese glyphs readable, 320px Q05 two-visual-line without horizontal overflow. |
| Progressive gate and chapter navigation | **PASS** | Q05 case2 shown after case1, Q08 branch→positive→negative order and normal lesson through Q09; review before/wrong/complete + ordinary full Q08 progression via Playwright. Accepted Q05 markers were already hidden and Q08 will be hidden after user visual acceptance, with focused reviewTargets test. |
| Shared UI and other modes | **PASS for actual impacted regression scope** | Full math textbook CI #39786779525 and separate math practice #39786779552 / Review #39786779528 / Governance #39786779527 all SUCCESS on exact `981695...` source; N04–N14 134 interactions, N11 prior authorized stages, math sets keyboard history mobile/desktop and physics textbooks succeed; do not interpret this as conceptual acceptance of all app units. |
| Persistence / reset / old history | **PASS** | Revision1→2 historical R5, v2→3 Q05-only old answer archive, v3→4 Q08-only archive, untouched other answers, previousCompletion, idempotent. Dedicated Vitest. Actual browser correct/wrong/reload in normal route and preview localStorage isolation pass. |
| Previously accepted blocks, figure and approval state | **PASS scoped** | Byte compare old approved Q05 authored block and original teacher Q01–04/Q06–07/Q09; N14 Q10/Q14/Q15 protected; no image asset code touched. Exact post visual Q08 state hides next marker without changing math. |
| Final integrated single-branch candidate and host URL | **UNVERIFIED / excluded from scoped Gate② close** | N14 Q16 is on a separate draft branch, Q16 Gate① still pending. W-MATH-023 main unmerged, no consent for conflict-aware integration or hosting. Thus Gate③ remains FINAL-REVIEW-NOT-READY. |
| §12B linked same-root approved-creation impact | **FAIL — confirmed unresolved** | N05 Q18 teacher paragraph240 asks the student to choose the pair satisfying both product and coefficient constraints. Existing hint reveals `r=−1,s=3`, exactly the sought pair and the answer `(x−1)(5x+3)`. [W-MATH-024/P-001](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/work/W-MATH-024-n05-q18-hint-leak-proposal-20261022/work/items/W-MATH-024-n05-q18-hint-leak/PROPOSAL_P001.md) exists **proposal-only, user authorization pending**. |

## Root-cause impact sweep / §12B correction queue
- Root `answer_preexposure_on_wrong_attempt`: authoring a source Word task as a single bundled complete answer and/or after-wrong hint discloses exact unresolved answer. Shared makeReviewSteps renderer **not inherently broken**, so do not mass-change.
- Visited (root, unit, version): (bundle+hint, N13, rev2) repaired P-002→rev4; (same, N14, rev9) repaired in independent W-MATH-022 rev10 but separate user Gate① still outstanding; (direct hint, N05, rev2) **CONFIRMED** unresolved; (square-comparison partial hint, N08, rev3) **NOT-AFFECTED for exact result leakage**, since its hint gives square operands 5 and 9 but not the final inequalities and Word originally asks a comparison with its squared justification; other pedagogical refinements not asserted. Prior W-MATH-022 impact pre-screen scanned N04/N05/N06/N07/N08/N11/N13/N14 (123 original Word markers), leaving no permission to mass-edit; no new confirmed identical cases in the inspected other units. Broader unrelated pedagogy/out-of-scope items are not claimed fully audited.
- N05 independent Work P-001 offers a single hint-only correction and preserves 20 source markers, revision2, all accepted prior progress; **unapproved and not implemented**. No duplicate W-MATH-023 edit. Its exact approval is required before any change.
- Historical W-MATH-022 Q16 correctness and user Gate① remain independent. W-MATH-024 P-001 cannot be auto-approved by Q08 user reply. Main has not been merged or deployed.
- Lesson dedup: existing `docs/MASTER_APP_LESSONS.md` and applicable feedback/no-answer leakage guidance take priority; revisit only after linked correction is approved and verified. No unapproved shared lesson rewrite.
- **Second pass NOT PERFORMED**: awaits outcome of W-MATH-024 correction and follow-on impact audit. Gate② cannot be CROSS-VERIFIED with this FAIL row. Gate③ cannot be prepared as full-app user acceptance now.

## Close checklist
- [x] User Q05/Q08 image acceptance verbatim recorded and frozen screenshot refs preserved
- [x] N13 exact teacher/keys/math/hints/figures/persistence and phone+desktop audited at all-green SHA
- [x] N05 sibling root cause independently found and linked to separate proposal-only CMD-WORK-001 Work
- [ ] W-MATH-024 exact user authorization → implement/verify its correction, re-audit impact signature
- [ ] Second pass §12B, memory dedup and scoped Gate② CROSS-VERIFIED
- [ ] Separate final candidate/permission, true tested hosted SHA and whole-app user's `総チェックOK`

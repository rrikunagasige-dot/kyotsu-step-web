# W-MATH-018 — FINDINGS
Status: SOURCE-STRUCTURE-CONFIRMED / P-001 IMPLEMENTING

## F-018-01 Ready-made operation + completed bounds in N14 Q10
- Existing N14 Q09 `|x-3|<5`→`-5<x-3<5`, original Q10 asks "各辺に同じ操作"; prior graded one compound "三辺に3を足す、-2<x<8". Students did not separately decide three matching additions and two endpoint calculations.
- Exact approval of 3 math rows + 1 short explanation + 5 in-equation holes: `-5<x-3<5`→`-5+[3]<x-3+[3]<5+[3]`→`[-2]<x<[8]`.
- Original teacher Word v2 indexed text was read; its embedded math source not directly verified because the original raw bytes were not accessible. UNVERIFIED full original source fidelity.
- N14 original 16 question marker map maintained, N14 revision6→7 selective archive required. Original Q07 Q08 Q12, Figure F01 and Q14/Q15 unchanged.
- A screenshot's width 320px must not be assumed fitting before actual Chromium runs. An overflow requiring redesign triggers revised proposal approval.
- Other same-root open: N14 Q14/Q15 and N01-N14 screened candidates, each needs separate source proposal approval.

## F-018-02 Governance metadata failure
New Work folder initially had only WORK and PROPOSAL files and a status line with suffix; repository-governance-check.mjs requires ACTION_LOG.md, FINDINGS.md, VERIFICATION.md and a standalone `Status: APPROVED` line for executable Work. This is a record/template error, not learner-app source defect.


## F-018-03 — gate1 evidence discovers inner Q10 formula clipping at 320px AND 390px
Full real screenshots on exact SHA e1e913f2230c42175bc5e67a53e726d030752634: 320 pre-Q10 third 5+□ hidden; 390 initial third 選択 partly hidden. After all 3 are resolved, numeric 3 fits. Because global formula line overflow-x:auto hides excess inside the row, the existing E2E document-width test passed, **false positive**. See P001_GATE1_VISUAL_DEFECT.md. No user visual check yet. P002 local responsive CSS change is proposed only.

## F-018-04 — historical E2E rev6/Q12 offsets obsolete, original contents protected
Full math CI 39629959584 reached N04–N14 batch then six N14 Q07/Q08/Q12 cases failed on expecting revision6 while actual rev7; Q12 also tests old source offset slice15:18. Corrected only their test expectations in 0b63f8a1fc9b6d70d8ce6c0f90732345d431e8a9, preserving Q07/08/12 earlier user-approved content and historic v6 migration tests. Other tests still need rerun; do not declare overall PASS.


## F-018-05 / P002 wrong-button-selector and hole-style inconsistency — CONFIRMED, NOT FIXED
- P002 intended custom `□`/wrong `↻` display only on N14 Q10 at mobile widths; user identifies that this looks different from previously accepted math problems.
- Actual React formula renderer `TextbookFormula.tsx` renders `button.reading-formula-choice` with canonical 「選択」 and wrong 「×」, not `reading-inline-blank > strong`. This mismatch means P002 CSS pseudo labels never apply to its formula holes. P002 shrinking the formula outer padding/font does NOT fix clipped horizontal content.
- GitHub authentic preview #39634288270: FAIL (300px internal scrollwidth >213/241 320 clientwidth and >283 390). The prior ordinary screenshot only checked document-level width; new stronger internal assertion reveals persisting bug.
- Response is separate revised P003 proposal: restore original button design exactly, wrap only the second equation at 320/390 on mobile into two *visual* continuation lines with original source/decision progression. No learner source alteration or CSS remediation before P003 explicit approval. This is the existing §12B correction-first rule, not a new global lesson.

## F-018-06 — P-003 two-row full-size buttons fit normal 320 but NOT numbered-review 320 (CONFIRMED)
- Real 320px normal N14 Q01→Q11 and corresponding 390px flow pass with P-003, as do 390px marked review and desktop 1440px review+normal.
- Marked Q10 reviewer 320 retains one ~216px minimum first row while available inner formula client width is 213px. Both .12rem and zero horizontal formula padding attempts yield 216/213, so no further equation-only padding can solve it. Repeated attempts all fail; actual Chrome #39642196191.
- `src/review/review.css` sets `.review-preview .review-marked-block {padding:.65rem; border:2px solid; border-inline-start-width:5px}`. `TextbookUnitPage.tsx` wraps the affected formula block in `data-testid="review-mark-n14-formula-10"` only for numbered reviewer view. This extra review-only inset explains why normal learner 320 passes and reviewer 320 fails. Do not mistake this for a mathematical/answer failure.
- P-003 expressly forbids downsizing buttons/letters or silently altering extra wrappers. Remedy requires separate approval of a review-only exact CSS scope; candidate P-004 reduces **only** Q10 numbered-review wrapper padding-inline from .65rem to .4rem at <=430px, adding 8px potential content width (to approximately 221px). The estimated fit must be verified with actual Chromium, not assumed PASS.
- 320 marked-review failing screenshot is not GitHub-embedded because capture asserts before saving; actual successful-state 320 screenshots and test failure log are in linked Action/artifact. Gate① BLOCK-CHECK-PENDING, Gate② OPEN, Gate③ FINAL-REVIEW-NOT-READY.

## F-018-07 — P-004 320px reviewer-only inset corrected; affected surface audit (CONFIRMED)
- Root signature: `review-preview` numbered `review-marked-block` uses .65rem horizontal padding and extra left-border; only under narrow yellow confirmation layer did Q10 long first visual row clip. P-004 `.4rem` padding-inline is scoped to exact `review-mark-n14-formula-10` data-testid and <=430px; established formula font/button dimensions unchanged. Actual selected Chromium six-case PASS on source `f058ec38a6e21f2925fc4535c34d0c741f356046`.
- Impact ledger (origin W-MATH-018 / F-018-06, version P004):
  - N14 Q10 yellow reviewer 320/390 + desktop1440, 5 before/wrong/resolved: **CONFIRMED FIXED / PASS**, actual Chrome #39643764980.
  - N14 Q10 ordinary route Q01→Q11 at 320/390/1440: **NOT-AFFECTED / PASS**, no review-only wrapper; real Chrome #39643764980.
  - Previously accepted N14 Q07/Q08/Q12 and N11 Q05/Q06/Q08/Q09/Q13: **NOT-AFFECTED by P004 selector**, unchanged learner source/IDs, full existing Math CI #39643764939 SUCCESS; do not infer new user acceptance.
  - Other N01/N03/N04 review marks and all other modes: selector does not match their stable IDs (**NOT-AFFECTED by CSS**); cross-mode regressions run successfully but a dedicated viewport-by-viewport review of every other marked formula was not performed (**UNVERIFIED for distinct independent clipping defects**).
  - Original teacher Word N14 Q10 embedded OMML mathematical glyphs **UNVERIFIED** (indexed text only); separate N14 Q14/Q15 cognitive concerns **OPEN**, not addressed by P004.
- Gate① human N14 Q10 `細部OK` still pending, §12B global defect queue not closed. No new reusable lesson added: existing MASTER mobile formula inner-overflow and visual QA rules already cover this; specific evidence remains in Work instead of duplicate governance edits.

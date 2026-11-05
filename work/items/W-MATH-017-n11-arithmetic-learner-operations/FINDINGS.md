# W-MATH-017 — source-backed failure ledger
Status: CONFIRMED
Date: 2026-10-21

F-017-01 / N11 Q01 / R-display: user live screenshot and current source confirm `M('-2;?;-5'),C('n11-01')` on one formula row. This leaves an unanswered placeholder beside the selected finished formula and makes signs visually hard to parse. Source answer `-2>-5` mathematically correct, but displayed interaction is defective. Suggest inline `(-2) [relation] (-5)`, then replace with solved equation.

F-017-02 / N11 Q05 / R1-cognitive: user live screenshot and source `makeReviewSteps` confirm full `operation + 3x<7` as one choice. No student calculation at the meaningful `−2+2` and `5+2` transformations; finished-answer recognition is substituted for mathematical doing. Note the original Q05 correct option itself is mathematically sound. Current Gate② falsely accepted this cognitive quality; reopen impacted Gate② and downstream user Gate③.

F-017-03 / siblings pending block-specific correction audit under §12B: same exact combined answer-and-operation pattern in **N11 Q05, Q06, Q08, Q09, Q13 (5 originals)** and **N14 Q10, Q14, Q15 (3 originals)**, confirmed by read-only source scan. These are same-root **R1 candidates**, not eight separate implementation approvals nor eight proven independent errors. Q07 and Q10 boundary questions were NOT within exact phrase pattern; check for answer leakage under separately bounded audit if warranted. No mass fixing without one-block preflight/authorization.

F-017-04 / prior skill comparison: published Set chapter `setLesson.ts` embeds one meaningful learner choice in concrete prompts, discusses meaning after answer, then introduces formal relation and subsequent transfer; use as writing/pedagogy reference, **not identical formula formatting copied blindly**. `subjects/mathematics/textbook/SPEC.md` §§5–8 and `docs/MASTER_APP_LESSONS.md` §§8–11,20,53 already demand learner-originated transformation and local answer visibility. Do NOT revise MASTER because the rule was already present. Failure occurred in N11 generated `makeReviewSteps` content and insufficient cognitive Gate② check, not primarily in missing general governance.

Previously published public main `15ae503455bc6ae75b080caa1c4919cafb250027` remains unchanged. Gate③ whole app not accepted due confirmed live user finding. Preserve historical CI/Gate② reports as historical evidence, but they do NOT clear the new failures. Scope next: P-001 Q01 and P-002 Q05 separate exact user decisions, then audit analogous questions in §12B before resuming unrelated creation.


## F-017-05 / ERROR-SPEC+ERROR-IMPLEMENTATION+ERROR-QA (P-003 confirmed)
Original W-MATH-003/P-001 already specifically approved naturally linked prose with inline choices. The actual `makeReviewSteps` generator emits a uniform separate formula-choice block after the lead paragraph. This differs from satisfied Set-mode inline pedagogy and was not rejected by the old Gate②. Root cause exists at the source authoring/presentation design, not a lack of a new MASTER rule. The source-structure audit marks 123 original markers for per-block **review**; it does not establish 123 defects.

## F-017-06 / CONFIRMED (Q01 and Q05 limited correction)
Existing `TextbookReadingFlow` supports inline paragraph decisions, and existing v6 revision migration precedent supports selective reopen. Approved implementation uses no global renderer change and keeps original teacher Word and figures intact. Visual Gate① and all CI at new SHA remain UNVERIFIED until actual evidence.


## F-017-07 / CONFIRMED / genuine display difference between review and learner surfaces
Review-only targets show yellow numbered boxes around approved learner blocks; this wrapper is **not a learner UI formula card**. The normal app snapshots from source SHA `0a5d695ec5622519a5398274b7b14bbecb2fb587` show N11 Q01 and Q05 as prose-integrated choices; old standalone formula rows from other questions still exist and are covered by the broader 123-marker preflight, not by approval of these two screens.

## F-017-08 / SOURCE-VERIFIED (N11/N14 Word)
Source Word chapter N11 original Q06/Q09/Q13 requires a transformation with result; Q08 demands remove constant. N14 Q10/Q14 demands apply a shared operation to all three inequality members; Q15 demands coefficient division and resulting range. Code currently grades each as a single option bundling operation and completed result. Whether and how to add an independent operation/calculation action must be decided per original marker after confirming the actual predecessor/next relation; it is not approval for all seven edits. Existing prior Gate① approvals remain protected.


## F-017-09 / ERROR-IMPLEMENTATION+ERROR-QA / user-review feedback
Latest user response: 「いや確認というのはいやだな。だって文章として取り入れていないというか。そもそもさ最初の集合だって確認とかなかったよ」. Distinct causal surfaces: (1) normal N11 `n11-marker-2/3` `確認` inserted by `makeReviewSteps` default, (2) yellow numbered `確認①` wrapper only in Gate① image; they are not synonymous. Approved Set authoring uses `例題` marker and coherent prose/inline choices, no global auto check markers. N11 passing mathematical correctness/browser tests did NOT establish matching Set's pedagogical flow. §12B sibling exposure spans other `makeReviewSteps` units; no global deletion authorized. Exact new proposal P-004 is pending.


## F-017-10 / CONFIRMED (P-005 math-primary design)
After user rejected both generic `確認` and prose-first P-004, the exact direct user approval was to first lay out 4 equations vertically and open blanks within those lines. Correct resolution is `3x-2<5` → `3x-2+2<5+2` → `3x<7` → `x<7/3`. Each step now progresses only when required choice resolves. Actual Chromium normal-route captures show one grouped mathematical derivation and no generic learner `確認` before Q05. Independent GitHub review-only `確認①` images are not a learner label. All other lesson styles are unchanged pending separate §12B checks; no global "formula everywhere" rule invented.


## F-017-11 / confirmed new user review feedback + scoped analysis
The revised four-line equation chain is the user's requested primary form, but for certain nontrivial transformations the missing **interstitial explanation** is an actual learning-design weakness. Compare N12 where paragraphs and formulas deliberately share one `derivationId`: the renderer supports this already, so a shared rendering change is unnecessary. Candidate N11 row2→row3 explain cancellation & same operation; row3→row4 explain positive division & unchanged direction, without revealing the holes. Broader N01–N14 candidates (and preserved blocks) are listed in `N01_N14_INTERSTITIAL_EXPLANATION_ANALYSIS_20261021.md`. A source-structure candidate is not a verified visual defect in every student-facing question. Additional exact proposal approval required to implement.


## F-017-12 / CONFIRMED integration mechanism; no implementation authorization
In math N12 authored source and `TextbookReadingFlow.renderVisibleBlocks`, continuous formula and prose blocks sharing the same `derivationId` are grouped into one mathematical visual chain; `visibleBlocksInGroup` cuts off before the first unanswered choice-bearing block. N11 P-005 lacks explanation between its four rows but already uses the grouping mechanism. P-006 proposes prose IDs to bridge row2→3 and row3→4 while preserving 25 learner decisions and revision8; exact paragraphs are not approved. Other N source-level candidates are listed separately as not-yet-confirmed defects.


## F-017-13 — review-marker test repair (confirmed and repaired)
The initial P-006 screenshot test expected a yellow marker on an original formula even though P-006 requires review markers only around the two new explanatory paragraphs. First real capture FAIL was a test expectation defect (job 39592697619), not a learner-equation defect. Normal learner flow 320/390/1440 PASS in the same job. The expected marker scope was corrected without changing student content. Subsequent real review capture PASS: workflow 39593071069. This is already covered by existing §12A lesson about marking only changed blocks; do not duplicate global lessons.


## F-017-14 / QA IMPACT STATUS (2026-10-21)
P-006 implementation and Gate①: direct positive user reply to P-006 real 2-paragraph image sheet now recorded as BLOCK-VISUAL-OK. Full math CI on matching source SHA finalized SUCCESS; previous running interim status in older records is superseded, not erased. Independent Gate② remains blocked by confirmed ready-made operation+result choices for N11-Q08/Q09, Q13 and N14 Q10/Q14/Q15, as previously listed in P003_SIBLING_COGNITIVE_LEDGER; fresh teacher DOCX line-by-line verification not available this session. Next distinct P-007 is proposed only. Old P-006 acceptance preserved; no mass conversion of all units authorized.

## F-017-15 / CONFIRMED P-007 same-root repair and historical test updates
Q08/Q09 formerly graded premade operation+completed-result in one choice; exactly approved P-007 now assigns left/right shared subtraction, RHS arithmetic, sign-direction reversal, negative quotient to separate in-equation holes. Previously live accepted P-006 equation chain protected, no repeated user approval requested.
Legacy test failures after new semantic grading are not mathematical regressions: they expected revision8/count25 and looked for detached Q08→Q09 prose, including a false text-substring check where correct answer '2' occurs as the coefficient in '-2x'. The test now checks complete expression answer leakage rather than raw single-character existence, retains original v8 behavior via explicit revision8 fixture, and tests v9 migrations separately.
Actual screenshots at all widths show math-first chain; user P-007 visual review still pending. Sibling N11-Q13/N14-Q10/Q14/Q15 and other units not automatically fixed.


## F-017-16 / P-008 E2E grouping false-negative / FIXED
On the first real normal lesson capture, our test assumed `n11-p008-q13-constant` would have zero visible placeholders until the coefficient `n11-13` is answered. P-008's exact approved 4th equation explicitly has **two side-by-side blanks**; both placeholders should show together and be solved sequentially. The E2E was over-constraining the grouped formula and failed at 320/390/1440, while Q13 dedicated review tests passed. Updated one Playwright assertion to expect the second placeholder visible, while verifying Q14 still blocked until both completed. Re-run [39608141779](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39608141779) PASS. Do not rewrite already approved flow or invent global "hide next blank in same formula" rule.

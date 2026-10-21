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

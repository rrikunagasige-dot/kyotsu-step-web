# W-MATH-017 — source-backed failure ledger
Status: CONFIRMED
Date: 2026-10-21

F-017-01 / N11 Q01 / R-display: user live screenshot and current source confirm `M('-2;?;-5'),C('n11-01')` on one formula row. This leaves an unanswered placeholder beside the selected finished formula and makes signs visually hard to parse. Source answer `-2>-5` mathematically correct, but displayed interaction is defective. Suggest inline `(-2) [relation] (-5)`, then replace with solved equation.

F-017-02 / N11 Q05 / R1-cognitive: user live screenshot and source `makeReviewSteps` confirm full `operation + 3x<7` as one choice. No student calculation at the meaningful `−2+2` and `5+2` transformations; finished-answer recognition is substituted for mathematical doing. Note the original Q05 correct option itself is mathematically sound. Current Gate② falsely accepted this cognitive quality; reopen impacted Gate② and downstream user Gate③.

F-017-03 / siblings pending block-specific correction audit under §12B: same exact combined answer-and-operation pattern in **N11 Q05, Q06, Q08, Q09, Q13 (5 originals)** and **N14 Q10, Q14, Q15 (3 originals)**, confirmed by read-only source scan. These are same-root **R1 candidates**, not eight separate implementation approvals nor eight proven independent errors. Q07 and Q10 boundary questions were NOT within exact phrase pattern; check for answer leakage under separately bounded audit if warranted. No mass fixing without one-block preflight/authorization.

F-017-04 / prior skill comparison: published Set chapter `setLesson.ts` embeds one meaningful learner choice in concrete prompts, discusses meaning after answer, then introduces formal relation and subsequent transfer; use as writing/pedagogy reference, **not identical formula formatting copied blindly**. `subjects/mathematics/textbook/SPEC.md` §§5–8 and `docs/MASTER_APP_LESSONS.md` §§8–11,20,53 already demand learner-originated transformation and local answer visibility. Do NOT revise MASTER because the rule was already present. Failure occurred in N11 generated `makeReviewSteps` content and insufficient cognitive Gate② check, not primarily in missing general governance.

Previously published public main `15ae503455bc6ae75b080caa1c4919cafb250027` remains unchanged. Gate③ whole app not accepted due confirmed live user finding. Preserve historical CI/Gate② reports as historical evidence, but they do NOT clear the new failures. Scope next: P-001 Q01 and P-002 Q05 separate exact user decisions, then audit analogous questions in §12B before resuming unrelated creation.

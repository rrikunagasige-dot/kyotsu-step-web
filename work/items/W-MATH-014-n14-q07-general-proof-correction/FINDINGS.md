# W-MATH-014 — FINDINGS
Status: CONFIRMED

## F-014-01 / R2 general-case proof omission (N14-Q07)
- Teacher original source Q07 is under 導出; mathematics assumes a>0 and X real. Present app n14-07 key −a<X<a and its original three wrong candidates are algebraically correct for an inner strict bound, but the lesson jumps from “inside” intuition to final choice without proving both sign cases. This is a pedagogical proof omission, not a confirmed early exact symbolic answer leak.
- Proof forward: X≥0 implies |X|=X, so |X|<a ⇒ 0≤X<a. X<0 implies |X|=−X<a ⇒ X>−a, thus −a<X<0. Union yields −a<X<a. Reverse: within that interval, the positive/nonnegative sign means |X|=X<a, and negative X means |X|=−X<a. Strict boundary ±a excluded, 0 allowed. Hence iff.
- Proposed Q07 local repairs only: student chooses 0≤X<a; then −a<X<0; then original final −a<X<a. Existing final 4 answer options intact; first two formula-local choices each one correct and three independent plausible errors; converse proof shown after original final.
- Source applicability: root R2 affects N14 Q08 separately, not automatically approved. N14 Q12 (two missing branch computations) is distinct root R1. Visited (R2,N14-Q07,rev3) CONFIRMED, (R2,N14-Q08,rev3) CONFIRMED and pending; (R1,N14-Q12,rev3) CONFIRMED and pending. N11 Q14 R1 fixed and Gate① accepted. No canonical lesson duplication.
- Data risk: N14 old progress revisions1,2,3 require ordered migration and preserving all v3 answers including n14-07; new Q07 2 nodes only unresolved. Revision4 must not accidentally reopen earlier P-004 changes.

## W-MATH-014/P-001 approved local implementation hypothesis (not yet CI-verified)
- Implemented approved sign-case interval decisions before the original `n14-07` final choice; original Q07 final wrong-key discrimination retained, converse proof after final answer. No new figure or new source question.
- Q07 two new IDs are scoped as source map N14-Q07 only; N14 original 16 source questions unchanged, expected 18 learning decisions. Existing Q08 and Q12 gaps remain separate findings and must not be automatically modified.
- N14 rev3→4 migration implemented as archive+preserve, including historical v1/v2→v3 normalization; independent runtime assertion still pending CI.


## Operational finding — §12C C2/C5 execution failure
- Observation: user attached activity log showing the assistant repeatedly waiting 12/18/30 seconds and checking GitHub CI with no meaningful independent approved work between polls.
- Cause in execution: the assistant prioritized eager repeated status checks over the already approved CI wait scheduling policy. Rule §12C already explicitly prohibits this pattern; it is **not** a missing lesson or reason to add a new command.
- Corrective practice: preserve exact tested code SHA and active CI run ID at launch, select P1 source-provenance/math audit and P2 linked Q08 proof/proposal-only study when genuinely independent, record Work A/B boundaries; one check at a work boundary, then return to A. No unsanctioned implementation, no double-branch conflict, no extra user approval for an unchanged exact proposal.

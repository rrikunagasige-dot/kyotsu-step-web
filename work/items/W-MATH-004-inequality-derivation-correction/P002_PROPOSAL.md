# W-MATH-004 / P-002 — N12「式の中の係数・定数・符号」局所穴への修正案
Status: PROPOSED
Date: 2026-10-18 JST
Command: CMD-WORK-001「修正」 / REVISE-PROPOSAL
Baseline: main f4d3ab40a27808a3ecb56c379efbe16a3fe19be4, P-001 merged through PR #76 and published. N12 review lesson revision 1.
Authority gate: learner-visible design direction accepted in conversation; **exact P-002 implementation, merge and Pages release NOT YET APPROVED.**

## 1. What the feedback changes
User feedback after observing the N12 derivation: intermediate transformations should themselves contain the answer holes. Typical answer slots are the coefficient of x, a changed constant, a negative coefficient/sign, and the endpoints of a transformed inequality. The user affirmed an illustrative in-equation token-blank design. The remaining P-001 whole-expression multiple-choice stages do not meet that interaction design, even though their mathematics was correct.

P-001 remains historically approved and implemented; P-002 is a new material correction proposal. Do not rewrite P-001 provenance or treat direction-only assent as the exact P-002 approval. Paused W-MATH-003/P-003 creation remains paused.

## 2. Exact content contract: 15 original + 11 localized = 26 response stages
- Preserve all original source markers N12-Q01 through N12-Q15, their mapping to response IDs n12-01 ... n12-15, their **current answer strings and order**. These are 15 source questions, not 26 original questions.
- Replace the six P-001 supplementary whole-expression *active* items (n12-01a, n12-02a, n12-06a, n12-06b, n12-12a, n12-13a) with 11 new **locally inserted, distinctly identified** token decisions. The old six IDs are archived, not reused for new answer values.
- The exact 11 new IDs, displayed math gaps and answers, in order:

| Q / new ID | Visible formula at the active step: □ is the only unresolved token | Answer | Cognitive operation and plausible wrong choice |
| --- | --- | --- | --- |
| Q01 n12-p002-q01-coef | x−2<3x+5 ⇒ −2<□x+5 | 2 | subtract x, not 3 or −2 |
| Q01 n12-p002-q01-const | −2<2x+5 ⇒ □<2x | −7 | subtract 5 from both sides, not +7 |
| Q02 n12-p002-q02-coef | x+4≤5−x ⇒ □x+4≤5 | 2 | add x to both sides, not 0 |
| Q02 n12-p002-q02-const | 2x+4≤5 ⇒ 2x≤□ | 1 | subtract 4, preserve ≤ |
| Q06 left n12-p002-q06-left-coef | 3x+2≤2x+4 ⇒ □x+2≤4 | 1 | 3x−2x=1x; after answer explain 1x=x |
| Q06 left n12-p002-q06-left-const | x+2≤4 ⇒ x≤□ | 2 | subtract 2, not 6 |
| Q06 right n12-p002-q06-right-coef | 2x+4≤9−x ⇒ □x+4≤9 | 3 | move −x left, not −3 |
| Q06 right n12-p002-q06-right-const | 3x+4≤9 ⇒ 3x≤□ | 5 | subtract 4, preserve ≤ |
| Q12 n12-p002-q12-signed-coef | 50+180x+130(20−x) ⇒ 50+180x+2600+(□)x | −130 | distributivity to −x; signed coefficient, not +130 |
| Q13 n12-p002-q13-lower | 3200−2650≤50x<3300−2650 ⇒ □≤50x<3300−2650 | 550 | transform lower bound; upper still unevaluated |
| Q13 n12-p002-q13-upper | 550≤50x<3300−2650 ⇒ 550≤50x<□ | 650 | transform upper bound, preserve strict < |

Each row is an individually gated choice, **not 11 boxes exposed together**. The completed value renders in that exact formula location, not as a detached line containing only the whole final expression. Q12 writes +(−130)x deliberately to expose the signed coefficient; the next retained original Q12 result can use conventional −130x. Do not expose the later answer in a preceding caption, prose, hint, alt text or image.

## 3. Original 15 stage disposition (audited end to end)
| Original active ID | Treatment in P-002 | Why |
| --- | --- | --- |
| n12-01, n12-02 | KEEP whole final solved inequality | Final synthesis after local coefficient/constant transformation; correct sign/division |
| n12-03, n12-04 | KEEP test x=1 and intersection range | Causality / common-set choice, not missing algebra token |
| n12-05 | KEEP splitting triple inequality into two comparisons | Tests logical conjunction |
| n12-06, n12-07 | KEEP pair of solutions and stricter common upper bound | Pairwise summary followed by interpretation |
| n12-08, n12-09 | KEEP pudding count and valid integer domain | Mathematical modeling / discrete constraint |
| n12-10, n12-11 | KEEP full price model and lower-inclusive/upper-exclusive bound | Translation from words, not automatic transform |
| n12-12 | KEEP collected cost inequality | Combine like terms after signed-coefficient hole |
| n12-13 | KEEP final 11≤x<13 | Divide three sides by positive 50, keep inequality directions |
| n12-14, n12-15 | KEEP allowable integers and exact two-cost check | Return to original discrete setting and verify |

Thus all 21 existing stages have an explicit disposition: 15 original stages unchanged in answer/ID, six supplemental stages replaced by 11 more precise in-situ mathematical tokens. Final mathematical answers are unchanged: x>−7/2; x≤1/2; −7/2<x≤1/2; x≤5/3; 11≤x<13; x=11 or 12; totals 3200 and 3250 yen.

## 4. Concrete learner interaction
1. Display a short equation line and one □ where only the *coefficient / constant / signed coefficient* is missing. Example: x−2<3x+5 → −2<□x+5; select 2 and immediately see −2<2x+5.
2. Next line in the **same visually continuous derivation chain** asks −2<2x+5 → □<2x; select −7 and see −7<2x.
3. Only then show existing original Q01 x>−7/2 final-answer choice. Repeat the pattern in Q02, both sides of Q06, and Q12/Q13 with meaning-specific hints.
4. Incorrect choice stays at current stage, displays the existing retry feedback, and never unlocks the next line or source figure. After correction, the coefficient replaces □ in the original formula at the exact position, with KaTeX and normal algebra spacing.
5. Preserve N12's two existing section headings, three existing source figures and their timing: F01 after solved Q02, F02 after solved Q06, F03 only after the final Q15 cost check. No revealing any future answer image.
6. A formula token blank should be visually a compact □ (not the bulky generic 「選択」), have an accessible meaning-specific label and an adequately large touch target (at least 44×44 CSS pixels), support keyboard focus, screen reader and mobile, and produce no page-width overflow. Prefer a targeted N12/token-ID presentation branch, no unexpected changes to general math textbook lessons.
7. One token choice per formula block because the current reading-flow gate stops at the first unresolved block, not at individual tokens. Use math/choice/math parts and the existing derivationId grouping; split long transformations into readable adjacent lines on narrow viewports.

## 5. Progress and revision safety (mandatory, not optional)
The current persisted progress is keyed by unitRevision and item ID, and a resolved record with a reused ID can appear incorrectly complete even when the answer's meaning changes. Therefore:
- Bump **N12 alone from revision 1 to revision 2**. Do not silently reset its previously answered **15 source questions**.
- Introduce **all 11 token IDs as new strings** shown above. Do not reuse six retired supplemental IDs for new answer values or accidentally count old answers as new token completions.
- Implement a narrowly guarded, deterministic **N12 v1→v2 progress conversion**. Preserve all old answer records (source 15 and historical supplemental six) and their attempts/times in storage; count only current 26 active IDs. Validate each carried source answer against its unchanged original key/answer, and prevent any stale record from resolving a token choice. Show previously completed source items as completed, while new token items await response.
- Archive old v1 completedAt separately, if present, and clear v2 completedAt until all active 26 items are correct; preserve startedAt. Migration must be idempotent over load, refresh and additional answers. Do not drop unrelated unit progress, reset all textbooks or rewrite the global state without a test.
- Include a short learner-visible explanation that original question responses are preserved but the newly introduced derivation holes must be completed.
- If a safe targeted migration cannot be implemented within this contract, stop and propose a separate revision; never deploy a silent full reset.

## 6. Implementation scope after exact approval only
Allowed after approval: N12 lesson source; N12 targeted inline formula blank styling/render behavior, if technically required; a small strictly-N12 revision conversion helper and its call sites; N12 integrity tests and existing math-textbook E2E/scripts affected by new stage count; work evidence and cross-creation impact ledger. The responsive label/blank treatment may modify common formula component but **must be gated to N12 new IDs**; other units' behavior must be regression-tested. No broad schema refactor requested.

Out of scope: modifying the 15 existing source answer strings; source Word/figures or chapter/unit identity, existing accepted N01/N02/N03/N09/N10 content, published math sets, Math Practice, physics; implementing pending N11/N13/N14 or merging paused P-003; publishing main/Pages without independent authorization.

## 7. Verification and quality gates
- Static source proof: exact original 15 mapping keys and answer strings unchanged; 26 active choices = 15 original + 11 local; six retired old supplemental IDs absent from current active items, distinct archived progress, stable two headings, 3 figure paths.
- Math hand audit: every coefficient/constant/sign and distractor checked for correctness; no answer leakage or false-positive normalized option; sign of inequality unchanged when dividing by +2, +3, +50; correct domain/yen math.
- Prove each token is embedded *between* math spans and reveal occurs in place; avoid full-expression-answer camouflage and adjacent choice components breaking KaTeX. One active stage at a time. Wrong feedback does not unlock any next stage/figure.
- N12 desktop and mobile complete traversal, first/middle/end, old original 15 choice reachability, 26 steps in sequence, figures F01/F02/F03, screen width, tap/keyboard access, status review, refreshed persistence.
- Targeted old-v1 progress test matrix: never started / midway through Q01 / completed 15 original with some supplements / fully completed 21 / intentionally wrong intermediate / reload twice. Verify original history preserved, new slots uncompleted, 26-step completion recalculated. Isolate all other units.
- CI: schema/typecheck, Vitest, build, Playwright Chromium desktop+mobile, old N12 smoke updates, existing N02/N09 and approved-unit regressions. Record failures and rerun; no claim of verified/published merely on code creation.
- Cross-creation R3 second-pass: inspect approved/review-visible N01/N02/N03/N09/N10 for stages where a whole-expression answer masks an unlearned *local calculation*. Record CONFIRMED / NOT-AFFECTED / UNVERIFIED and source SHA in linked impact ledger. Do not classify valid final transfer/synthesis choices as errors. If an additional fault is confirmed, submit a **separate correction proposal** before editing the affected unit. P-003 creation stays paused.
- After implementation/test/user QA and any linked corrections: reconcile and deduplicate common rules in docs/MASTER_APP_LESSONS.md and appropriate mode-specific lessons, then recheck correction queue before resuming creation. No lesson promotion now.

## 8. Release and explicit approval gates
Current artifact is **proposal/documentation only**. No N12 code, release configuration, deployment, or live application changes in this branch. P-001's prior release remains live until a separately authorized P-002 release.

**Approval requested:** 「P-002を承認する」 means implement exactly the N12 15+11=26 locally embedded answer stages, targeted N12 revision-2 progress-safe migration, scoped UI, regressions and second-pass R3 audit above **on a separate implementation branch/PR**. Approval does **not** include automatic main merge, Pages publishing, changing other accepted units, or restarting N11/N13/N14 creation. After a reviewed implementation PR, ask separately for main/Pages authorization.

# Findings — W-MATH-003

## F-001 — CONFIRMED: Source draft and mode
Indexed original Word `01_数と式_教科書モード_対話段階導入版_v2.docx`, 53 pages, authored pedagogical draft, lists publisher textbook guide as its upstream. Target mode is `数学 × 教科書`; draft != publisher canonical original.

## F-002 — CONFIRMED: Coverage and pilot rationale
16 internal units / 233 question markers / 12 named figure IDs (structural count). Pilot N01 (terms and coefficients), N03 (exponent/distributive table), N10 (square root product/quotient proof), N12 (inequality overlap, integer context). N01 10, N03 13, N10 21, N12 15 original question markers.

## F-003 — RISK/BLOCKED: Source math unrecoverable from indexed text
Numerous original math glyphs/OMML expressions missing, figure graphics unavailable. Files raw-byte materialization rejected; mounted files and connected Mac Downloads/Documents searches found no matching original. DO NOT invent original equations/numerical results or claim complete content QA. User re-upload or another verified raw source required for source-dependent implementation.

## F-004 — CONFIRMED: Required authority
Imported mathematical textbook SPEC is CANONICAL-CANDIDATE subordinate to target-approved original. User-approved `集合` example emphasizes in-prose inline cognitive holes, natural teaching flow, concept→property→proof if needed→example. Common masters govern rendering, technical QA and title compression.

## F-005 — ERROR-PROCESS: Work Status line violates validator
CI run [38985852212](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38985852212) failed `WORK.md missing Status`. Root cause: used `Status: BLOCKED (source fidelity gate); design work proceeds` instead of the exact registered value `Status: BLOCKED` demanded by repository OS. Corrected to `Status: BLOCKED` on its own line with a separate `Blocker` description. The raw Word fidelity gate remains genuinely BLOCKED.

## F-006 — RESOLVED: Original Word source recovered
The user reattached original raw DOCX on 2026-10-17, 212863 bytes SHA-256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`. XML directly contains 397 `m:oMath` and 14 embedded PNG. Pandoc translated original OMML to mathematical expressions; previous Library text gaps were an indexing artifact, not necessarily missing Word math. F-003 source-byte blocker RESOLVED, do not delete original history.

## F-007 — ERROR-ANALYSIS: Previous count 12 diagrams was false
Correct figure inventory is **14** original diagrams, including overlooked **N05-F01** (coefficient arrows for たすき掛け) and **N05-F02** (example completed after explanation). All image1..image14 recovered and visually inspected. Correspondence and source-file ids in `SOURCE_OMML_AUDIT.md`.

## F-008 — OPEN-QUESTION: Answer booklet not attached
Word explicitly says `解答は別冊`. Teacher answer booklet not provided, so 59 pilot original question answers were derived independently and basic formulas cross-checked with SymPy. Do not misrepresent these as matched to an official answer key. Remaining 174 markers require independent full math/source audit before bulk deployment.

## F-009 — RECOMMENDATION: N01 variable-vs-parameter caveat
In source Q3/Q4, `5x³y` is regarded as an x-polynomial with coefficient `5y` and degree 3. Strictly this is valid in formal `R[y][x]` or generic y ≠ 0 numeric specialization; setting y=0 yields zero polynomial, whose degree is not 3. Clarify pedagogical scope without silently rewriting original problem. New N01 learner review draft includes a caveat.

## F-010 — EDITORIAL-QA: N01 prior-answer leakage fixed before user review
First `N01_LEARNER_PILOT_DRAFT.md` draft explicitly stated the cancellation/remaining highest term immediately before N01-Q10; this reduced Q10 to trivial retrieval. Replaced with a genuinely open demand to identify the resulting degree **and justify** from the Q9 expression, and made Q9 group-and-result holes explicit. This is a pilot-specific demonstration of CMD-WORK-002 leakage inspection. Original source/answers unaffected.

## F-011 — EDITORIAL/UX: Initial N01 draft not yet directly app-ready
- First review draft placed six separate numeric placeholders in one coefficients-and-degree table for original Q2, which would encourage excessive micro-answers; v2 uses one compact **pair** choice per row (three rows).
- The original Q3 already determines x-coefficient of `5x³y`; repeating it in Q4 as a separate click creates redundant work. v2 reuses previous result, tests only change of viewpoint to y, but still maintains Q4's source scope.
- Student narrative introduced high-level zero-specialization/formal-variable caveat at Q4, although the source only says y is temporarily constant. Move advanced caveat to teacher-side QA; keep student exposition source-level.
- Q6 grouping and Q9 grouping→simplification are genuinely separate reasoning operations; v2 stages them while maintaining 10 source question IDs, and ensures Q10 degree not revealed before answering.
- Existing `TextbookReadingPartSchema` supports `choice` per item, with `TextbookItemSchema` explicit choices for published units; v2 defines **15** independent internal item IDs but requires hiding options until current question and grouping them into 10 natural source tasks.
These are design adjustments **inside already approved P-001**; user-facing review is still required before implementing this specific copy.

## F-012 — ERROR-CONCURRENCY: Duplicate review-only unit in shared PR branch
A separate concurrent change inserted a second `mathNumbersN01Unit` import and duplicate registration, plus a variant `numbersN01Lesson.ts` representing the same unit ID and contradictory E2E answer wording. This is a real Work OS collision, not a new curricular unit. The previously user-approved `N01_LEARNER_REVIEW_V2.md` and its matching `n01Lesson.ts` were treated as current authoritative intent. Reconciled the index and catalog tests, aligned additional browser test, removed the *new duplicate unused module* from the Work branch. No legacy source deleted. Recommendation: independent PR branches when parallel authoring.

## F-013 — ERROR-TEST-CODE: TS2367 in production build
CI 38989444753: 126 unit tests passed, but production `tsc -b` rejected a redundant discriminant test in `n01Lesson.test.ts` after narrowing through `filter`. Fixed without changing source problem/lesson copy.


## F-014 — CONFIRMED: N01 released review-only and user positive acceptance
Date: 2026-10-17
After distinct user release assent, PR #66 merged at `1bd40d5790faeb28ccccfaa7add5090a715949a2`. Pages workflow `38994031060` SUCCESS; browser direct link shows N01 with in-prose choice and progress advance. User responded 「今のでいいと思う。続け」 after the live page link and request to review. Treat this as acceptance of the N01 pilot at this review checkpoint; do not infer actual manual mobile-device coverage. The code's `review` status is preserved pending any later explicit catalog promotion.

## F-015 — CONFIRMED: Three remaining pilots can be authored from exact recovered original
Date: 2026-10-17
N03 Q1–Q13, N10 Q1–Q21, N12 Q1–Q15 all have original mathematical expressions and independently derived solutions. N03-F01 is an unanswered four-cell correspondence table; N10 proof is under `a>0,b>0` and has no figure; N12-F01/F02 show original condition ranges while N12-F03 contains answer integers 11 and 12. These roles are fixed in the proposed v1 learner drafts. The original answer booklet remains unavailable and all other 174 chapter markers remain unaudited.

## F-016 — RISK: Source marker count differs from appropriate UI interaction count
Date: 2026-10-17
N03 13/N10 21/N12 15 **source questions** are traceability obligations, not a rule to create exactly the same number of visually separate cards. Proposed internal thinking slots should be checked for genuine distinct operations, grouped into continuous prose/formula, and reduced where a user judges a stage redundant. N03 dependency on unimplemented N02 must not be misstated as pre-taught when direct pilot testing. Any material user copy change requires a revised exact review before implementation.

## F-017 — CONFIRMED: Separate release permission does not promote review pilots
Date: 2026-10-17
User said 「いいよ」 in direct reply to the explicit question whether PR #68 could be merged into main and published via GitHub Pages. With final CI and governance PASS, PR #68 was merged at `1e7a5d77e5f741d77afc7c0fe124cf978e45993e`, [Pages run 39015513835](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39015513835) deployed successfully and real Chrome verified N03/N10/N12 stage progression and N12-F01 after Q2. Their `status:'review'` and exclusion from the normal selector persist. This is release approval and technical live-spot verification, not user hands-on acceptance of all three lessons, not permission to promote to the ordinary catalog and not completion of the remaining 174 unaudited source markers.

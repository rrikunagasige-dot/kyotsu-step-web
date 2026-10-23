## 2026-10-23 — confirmed fraction semantic display repair (P-005 + continuing chapter correction scope)

Latest user「続けて」approved full NE01/NE02 implementation. Earlier direct「残りの仕事全部まとめて修正して、章全体確認まで止まないでよ」continues to authorize remaining confirmed existing-chapter layout repairs. No repeated per-question permission is required for these display-only cases. Exact new impact: NE02-Q10/Q12 and existing N07-Q08/N10-Q16, **six authored candidate strings across four items**. All16 units/all authored fraction choices audited:74 strings. Legacy generic finite-set normalization mistakes a fraction's numeric second group for a literal set when the first argument is nested or bare. Three old bad candidates exist; only N07's8/10 is currently visible, N10's3/6 is hidden by existing scaffolding. Keys, choices, hints, revisions and persisted values remain byte-for-byte unchanged.

Scoped textbook display adapter protects only those four IDs by expressing a numeric denominator as mathord (same mathematical value). Generic normalizer and other modes are unchanged. Local actual-runtime/actual-normalizer audit:74 fraction alternatives checked, remaining bad0. New unit regression checks normalized KaTeX/MathML, not just parse success; browser tests assert no literal braces in real fraction denominators. Added two related review groups and copied the successful real tall-viewport capture strategy into the main native test so all27 groups have unobstructed images.

Historical source3cb825ba100a5bd8bef7a14e6c00f411c637e914 had CI/native PASS and no horizontal overflow, but direct image inspection found this semantic rendering FAIL; those results are not final visual acceptance. Its full native archive12494288620 and recapture12495780427 are historical evidence only. First native archive footer overlap was separately corrected by recapture; no DOM/CSS hiding or image reconstruction. Frozen-source recapture harness9cd545a12c216bdad9d5ea1c95d91425b0f2de3b remains unmerged. Current repaired source needs fresh final CI and all affected real images before handoff.

## 2026-10-23 — P-005 exact approval and full-batch implementation

User replied **「続けて」** directly to the question asking permission to implement the complete, already presented NE01/NE02 25-question P-005 design. This is exact review-only implementation approval for both units together, not an acceptance of yet-unseen rendered images or main/hosting permission. No question-by-question permission pause.

Implemented stable new units NE01/NE02 revision1/review with 13+12 source-mapped operations; optional 参考・発展 theme; exact per-distractor feedback without schema change; scoped display rows for long compound formulas; 25 real-data review slices. Original N01–N14 source data/answers/revisions/progress untouched. Formula wrapping only adds opt-in new-unit block IDs. Full source CI and actual 320/390/1440px all-25-question and 16-unit chapter tests are prepared, results PENDING. Work stays VERIFYING; Gate① PENDING, no formal Gate② closure/Gate③ user play.

Source Word hash unchanged. Current LibreOffice regeneration produces **40 pages**, with NE01 on37–38 and NE02 on39–40. New units explicitly label these sourcePages as regenerated rendition; historical Library 53-page indexing is not claimed identical. Paragraph mappings remain canonical for question provenance.

## 2026-10-23 — P-005 NE01/NE02 remaining 25-question batch design

User latest directive: 「続けて」. Continue source audit/design under approved creation P-001; do not manufacture acceptance of previously pending screenshots or approval of an unseen exact design.

[Complete two-unit / 25-question proposal](./NE01_NE02/P005_NE01_NE02_BATCH_REVIEW.md), [NE01 full learner draft](./NE01_NE02/NE01_LEARNER_REVIEW_V1.md), [NE02 full learner draft](./NE01_NE02/NE02_LEARNER_REVIEW_V1.md). Source Word hash reverified, direct paragraphs 618–668, 25 original markers, 28 OMML math objects, zero figures. All 25 completions and 50 distractors authored and semantically reviewed; 30 exact identity/condition/sign checks PASS in reproducible audit. This is same-assistant verification, not an independent-agent audit or browser proof. New app data/code not implemented; P-005 exact review-only implementation approval PENDING. Review both units together, then implement/verify as one batch after approval, never one question at a time.

Existing chapter correction engineering remains at frozen code SHA `68338688f22ffb3acaa7074b5c0c0f79584604c5`: 46 layout repairs, existing 14 units/208 originals/290 decisions/926 visible choices/256 formula blocks; final-source CI successful. [Authoritative correction report](../W-MATH-025-factor-hint-leak-qa-proposals/P017_P018_CHAPTER_AUDIT_FINAL_20261023.md), [46 real-image gallery](../W-MATH-025-factor-hint-leak-qa-proposals/GATE1_P017_P018_ALL_LAYOUTS.md). User visual acceptance of those new repairs is still pending; no remaining confirmed unfixed defect in that final tested engineering scope. New-creation research/design is independent and does not waive correction acceptance. Gate② formal closure and Gate③ user entire-app play not granted.

Work stays VERIFYING. Current branch main observed `15ae503455bc6ae75b080caa1c4919cafb250027`; no main/deploy/publication, billing, existing learner IDs/history, source Word or figures changed. Next: one consolidated decision on exact P-005 design, then review-only implementation plus real 320/390/1440px testing, source audit and chapter regression; preserve pending human gates.

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


## F-018 — CONFIRMED: N02/N09 primary question and OMML coverage
Date: 2026-10-17
Source SHA: 93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa.
N02 has original Q1–12, 34 OMML equations/math nodes, no embedded drawing. N09 has original Q1–14, 37 OMML and one original embedded number-line drawing; all 26 original markers found in raw DOCX. Exact math and independent solutions documented in N02_N09_SOURCE_SOLUTION_AUDIT.md.

## F-019 — RISK / SOURCE-LEAK: Original N09-F01 diagram reveals Q10 neighboring integers
Original image6.png marks -4,-3,-2,-1 and a black point -2.1 located between -3 and -2. In the original Word, the figure appears before Q10 asking which integer n satisfies n<=-2.1<n+1. This makes the correct integer n=-3 visually apparent. Proposed **timing** change only: reveal unchanged original figure after correct Q10 response, before Q11. Must be accepted during exact learner design review; do not silently modify source image.

## F-020 — CONFIRMED: Floor-definition fractional part must stay nonnegative for negatives
For -2.1: integer part -3 and fractional part 0.9. For sqrt(10): integer 3 and fractional sqrt(10)-3. For -sqrt(10): integer -4 and fractional 4-sqrt(10). All follow n<=x<n+1 and 0<=x-n<1. Truncation toward zero is mathematically wrong.

## F-021 — PEDAGOGY: Source markers and cognitive steps need one-to-one bookkeeping, not redundant UI cards
N02-Q03/Q09 and N09-Q02/Q04/Q08/Q14 request pairs or linked comparisons. Represent each as one progression stage with a compound response and populate multiple mathematical locations in one response. Do not turn 26 markers into an arbitrary higher progress total without explicit design change.

## F-022 — OPEN-QUESTION: Teacher-edited Word source is not the publisher's official answer authority
Independent solutions 26/26 derive from recovered original Word; separate answer booklet and direct publisher textbook cross-check remain unavailable. This caveat is inherited from F-008 and does not block user review of independently verified calculations.

## F-023 — CONFIRMED: N09 sample target inequality can spoil an identical Q09 choice
The original edited Word and design prose introduce the aim 1.41<sqrt(2)<1.42 before asking the learner to derive it. In the interactive student renderer, the Q09 exact formula would then be visually pre-answered. The implementation retains the mathematical goal but opens with “is sqrt(2) between 1.41 and 1.42?” and asks the learner to complete the strict inequality only after checking squares. No source numbers changed.

## F-024 — CONFIRMED: Original N09-F01 binary has stable SHA
The unchanged source figure image6.png (negative decimal -2.1 at left of -2) has SHA-256 24dd29dcaacd371ddfab4c8fefbccd84933fd0f1a27ed5f167372f74ca4a9cfd. The new app asset is byte-for-byte identical, with placement after Q10 in readingFlow. Alt and caption are not mounted before the figure block is unlocked.

## F-025 — ERROR-IMPLEMENTATION: learner path missing despite implemented lessons
The earlier N02/N09 draft PR had source-audited content and passing E2E but no public Pages merge. Math learner setup included only Chapter3, and repository.listPublished hid existing six numbers review units. P-002 addresses actual discoverability, not just a GitHub PR URL, while excluding unrelated review candidates.

## F-026 — ERROR-PROCESS corrected: route work belongs to CMD-WORK-002 作成
The user established that source→concept→lesson→app placement→user access belongs to ongoing 作成, not a standalone 修正. P-002 separately authorizes the enlarged chapter-1 catalog/Pages review scope without retroactively expanding P-001 or claiming final learner acceptance.

## F-027 — ERROR-EVIDENCE / UNVERIFIED: automated 123/127 checks do not substitute for source-to-answer audit (2026-10-19)
Gate② inspection confirms exact original-marker ID coverage and 127 correct-path browser actions; however the existing assertions do not independently re-read all 123 original Word equations or derive every answer. The batch implementation record mentions `N04_N14_SOURCE_SOLUTION_AUDIT.md` and `N04_N14_LEARNER_DESIGN_MAP.md`, which are absent from the current Work directory. This is a **documentation/evidence gap**, not a proven wrong answer in the app. The original Word's Library content request returned **403 Forbidden**; no unauthorized access workaround was attempted. Official separate answer booklet remains unavailable. Record every affected Gate② row as UNVERIFIED, not PASS. Exact evidence: `CROSS_BLOCK_AUDIT_P-003-R1.md`.



## F-028 — CONFIRMED-REPAIRED in P-004 scope; test failures were not silently suppressed
Teacher Word/interactive source comparison identified eight reasoning/answer-gating failures, all exactly enumerated in P-004. The eight learner answers and pre-answer leads were repaired on independent PR #101. Old incorrect-key success is archived; other answer attempts are preserved. Failed CI episodes were caused first by trailing commas omitted in seven edited TS arrays, next by original N04-Q01 review target still expecting v1, and finally by two mistaken assumptions in the newly added E2E about when a hint appears and whether a math blank shows literal 「もう一度」 versus `×`. The tests were corrected to match actual UI: after a wrong choice the panel closes, the wrong blank displays `×` or text, reopening reveals the hint. Original UI behavior was left intact. Full Math CI 39343256282 PASS. This does not imply final Gate② PASS.

## F-029 — TWO NEW CONFIRMED pre-answer disclosures OUTSIDE P-004 scope
**N06-Q11 (Word p.20):** original prompts the learner to factor the common bracket. App lead says `同じ括弧をTと置けば(y+x)Tである` with `T=x²+x−2` from the previous step, essentially furnishing the requested factorization. **N14-Q05 (Word p.45):** original asks learner to determine the boundary, inside/outside, and whether equality is included. App lead explicitly says `原点から離れた点を残し、等号も許す`, disclosing two requested judgements. These are **CONFIRMED not fixed**, not evidence of wrong final mathematical keys. Check against intentional teaching scaffolds before extending this diagnosis to other questions. P-004-R1 records the exact minimal corrections and is **UNAPPROVED**. No unauthorized code edit.


## F-030 — P-004-R1 二つの先出し不具合を修正（2026-10-20）
N06-Q11とN14-Q05で、質問前に生徒の判断結果を示していた説明を、それぞれ1行だけ修正した。問題ID・正答・誤答選択肢・図・教材revisionは不変。変更前の発見履歴F-029は保存し、現在の判定だけを「修正実施・検証合格」へ更新する。修正後の教材SHAは `2604589da22062cb67928ee5e1569a5de0338845`。数学の全CI [#39346035269](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39346035269) 合格。10問60枚の[実画面一覧](./evidence/n04-n14-gallery/README.md)はユーザー細部確認待ち。Gate②の123問独立監査はなお未完了。

## F-029 — ERROR-ANALYSIS / CONFIRMED: 11 more pre-answer cognitive-operation leaks (2026-10-20)
Source: author-edited original Word SHA-256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa` vs review app code SHA `2604589da22062cb67928ee5e1569a5de0338845`.
Independent pass over Word Q-instructions and app leads/keys confirmed **11 additional IDs outside approved P-004/P-004-R1 ten**: N06-Q01/Q05; N07-Q09; N08-Q02; N11-Q06/Q08/Q09/Q13; N14-Q10/Q14/Q15. These are missing learner operations in the cognition flow, not demonstrated false final algebra results. Five related groups, exact before/after boundaries and three-unit progress preservation are specified in `P-004-R2_PREANSWER_COGNITIVE_REPAIR_PROPOSAL.md` (**PROPOSED, NOT APPROVED**). N08-Q03 remains RISK until source-pedagogy intent independently assessed, not silently elevated to confirmed.
Correction-first applies: no learner code edits outside already approved scopes, no merge/publication or Gate② PASS claim. Earlier statement in P004 impact ledger “no new confirmed defects” was true at its recorded checkpoint but **is superseded for current status**.

## F-030 — ERROR-ANALYSIS / CONFIRMED: residual next-question answer leaks (2026-10-20)
N06-Q05 group `intro` explicitly supplies `T=x²` before learner selects that same substitution; N14-Q09 `after` directly tells upcoming N14-Q10 to add 3 to three sides; N14-Q14 `after` directly tells upcoming N14-Q15 to divide three sides by positive 3. `makeReviewSteps` presents all of these **before** the target choice in its sequential `readingFlow`. Unlike the approved 11 entries' `lead/answer/wrong/prompt`, those other source strings are **outside P-004-R2 approved edit boundary**. Therefore P-004-R2 code correction cannot be declared educationally cross-audit complete despite passing automated current-question lead checks. Exact smallest proposed further repair: `P-004-R3_CONTEXT_PREANSWER_REPAIR_PROPOSAL.md`. Status: CONFIRMED UNFIXED, separate approval required, no affected-source code edited.

## F-031 — ERROR-IMPLEMENTATION / CONFIRMED: N07-Q09 320px selection option visual truncation (2026-10-20)

Actual screenshot `evidence/n04-n14-gallery/p004-r2-n07-09-320-before.png` from approved implementation code SHA `f48509b7fca51c758c644d5274551bb2804e20df` shows the correct and wrong compound option string (minimum multiplier + multiplied equality + subtraction equality) as a single long KaTeX row inside narrow choice cards. CSS `.reading-choice-formula-line` uses `overflow-x:auto;white-space:nowrap`, so the global page overflow test does not certify full answer visibility. Original answer/math remains correct; this is visual legibility / interaction feedback quality, **not a request to change the official key**. Existing `textbookDisplayLines` already supports item-specific purely presentational formula line breaks. Proposed precise `n07-09`-only three-line splitter is part of unapproved P-004-R3. Do not automatically change CSS/shared UI or mark visual Gate① PASS because screenshot capture succeeded.

## F-032 — ERROR-ANALYSIS / CONFIRMED: prior prose leak sweep expanded to five (2026-10-20)

F-030 identified 3 preceding paragraphs. Full same-target predecessor readingFlow pass identified **two more**: N11-Q08 after states the next question requires negative-number division before N11-Q09 learner chooses divisor/sign; N14-Q13 after directs elimination of the constant before N14-Q14 must choose transformation. Together five exact preceding paragraphs are now specified in the still unapproved `P-004-R3_CONTEXT_PREANSWER_REPAIR_PROPOSAL.md`. Historical F-030 remains and is **superseded in scope**. No unapproved prose edits performed.

## F-033 — ERROR-IMPLEMENTATION / CONFIRMED: residual narrow 320px resolved math rows (2026-10-20)

R3 actual code SHA `06b1e0e217fc0933d203192ea0b2e11337bcee83`, screenshots commit `ad78002113827ac78b2d832bd1292c9308b32e47`. Direct visual review of `p004-r2-n11-13-320-resolved.png`, `p004-r2-n14-14-320-resolved.png`, and `p004-r2-n14-15-320-resolved.png` confirms the **right-hand component of an already-correct operation-plus-result answer appears cut off within the fixed-width white answer row**. The original answer key itself is mathematically valid and remains unchanged. Different from R3 N07-Q09 choice-row clipping, this occurs in `TextbookFormula.tsx` resolved values, which already call `textbookDisplayLines`. R3 targeted formatter only `n07-09`; remaining IDs cannot be edited under that approval. Full impact includes N11-Q06/Q08/Q09 and N14-Q10 as related items to check, but do not assert these four also fail without direct measurement. Exact proposed three-ID display-only splitter and tests recorded as **P-004-R4 PROPOSED / NOT APPROVED**.

## F-034 — CONFIRMED: R3 fixes five preceding prose leaks and N07 option line clipping (2026-10-20)

Five exact changed group/after strings no longer give the upcoming operation before the learner selects it. `n07-09` now uses three math display rows for **all four options** while preserving original canonical combined answer strings and existing progress. New source-order and formatter unit tests PASS with 320/390px visual assertion in [CI #39372583858](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39372583858). Root-causes F-030/F-032 and N07 part of F-031 are fixed at that code SHA. R4 visual residual is separate, not a regression to these six approved changes.

## F-035 — P-004-R4 VISUAL DEFECT RESOLVED in exact approved scope (2026-10-20)
The three genuine 320px resolved-screen clipping defects F-033 (N11-Q13, N14-Q14, N14-Q15) were fixed by the previously proposed three ID-only `textbookDisplayLines` two-row splits. Full [Math CI #39374550368](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39374550368) PASS, authentic image-save [#39374547022](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39374547022) PASS. Reviewed actual 320px resolved screenshots after fix, all visible; remaining four related R2 compound responses N11-Q06/Q08/Q09/N14-Q10 also show visible rightmost content without needing another correction. R4 pass is not user Gate① approval and does not substitute for independent 123-answer-all-distractors source audit.

## F-036 — ERROR-EDUCATION / CONFIRMED: 3 additional lost original-source learner decisions (2026-10-20)
New evidence: cross-read **all 123 Word question markers** against `61498366f2bed5324326e55d09b8f5c984a1a714` actual answer+prompt+3 wrong options and source context; complete per-ID independent 51+72 row audits in Phase-2 and Phase-3 docs. **120 original-source response decisions PASS; 3 confirmed cognitive omissions despite true final values**, no false full algebraic key.
- **F-036-A N08-Q10:** Word asks not merely `a=0` but why `|a|=0` means original point at the origin. Current correct choice only `a=0`; post-error/after explanation does not mean learner responded to the requested reason.
- **F-036-B N13-Q08:** Word demands remove absolute value into both equations `3x=6` OR `3x=-6` **and** solve x=±2; only final x values presently selectable.
- **F-036-C N06-Q15:** Word demands checking whether candidate factor sum matches target linear x coefficient and therefore enables whole factorization. Current key only `3y−1`, without matching/useful conclusion.
These are the same two historical root-cause classes of lost cognition; newly found outside previously approved scope. Exact proposed new paired choices and one-question-per-unit selective progress-history safe migration: `P-004-R5_SOURCE_COGNITIVE_3ITEM_PROPOSAL.md`. **Not approved**. No code or progress altered. Existing visual correction P-004/R1/R2/R3/R4 completion evidence unaffected.

## F-037 — P-004-R5 fixed three source cognition losses (2026-10-20)
The independent Gate② pre-R5 source review F-036 had three correct-final-number / incomplete-student-reasoning failures N06-Q15, N08-Q10, N13-Q08. **All three fixed at tested code SHA `ad77318b37e90b9c39150b14ee706283b3f59355`**, with exact per-candidate independent truth/falsehood reasons in `GATE2_P004_R5_POST_REPAIR_INDEPENDENT_AUDIT_20261020.md`. No independent arithmetic/distractor defect found after patch. `P-004-R5_SOURCE_COGNITIVE_3ITEM_PROPOSAL.md` now APPROVED+IMPLEMENTED. Math CI #39419920062 PASS; image run #39419915311 PASS; 18 genuine screenshots saved and matched. These findings supersede the unfixed status of F-036 **only for current source SHA**, preserve historical evidence. Remaining closure issue is newly amended 3-item Gate① human screenshot check; complete live link Gate③ and explicit release authorization still outstanding.

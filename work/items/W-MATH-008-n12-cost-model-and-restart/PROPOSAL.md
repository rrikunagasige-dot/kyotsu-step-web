# W-MATH-008 / P-001 — N12: T(x)の導出・局所穴・最初から再挑戦

Status: **PROPOSED / USER APPROVAL REQUIRED**
Date: 2026-10-18 JST
Command: CMD-WORK-001「修正」
Baseline: main 4cd7665a4b5bde8c8d23ddfddf803d6833458856
Branch: proposal/w-math-008-n12-cost-derivation
**No learner source code has changed. No release is authorized.**

## 1. Verified faults and root cause

- **D1: T(x) jumps over its own model.** Current N12 shows given prices, Q08 pudding count 20−x, and Q09 integer domain. Immediately after 「箱代と二種類の菓子代を足す」, Q10 asks for the *entire* expression 50+180x+130(20−x). The meaning of T(x), unit price × count for each item, and fixed box price have no preceding learner derivation or independent meaningful holes.
- **D2: Q11 conflates two logical translations.** The entire bound 3200≤50+180x+130(20−x)<3300 appears as a single decision. The separate inclusive lower/strict upper conditions are not learner-built.
- **D3: Q12 computes for the learner.** P-002 inserted the signed coefficient −130, yet shows 2600 before the learner calculates 130×20; likewise 2650 and 50 lack local calculation holes.
- **D4: Internal horizontal scroll.** N12 strings with multi-arrow transformations are displayed under .reading-formula-line white-space:nowrap / overflow-x:auto and .reading-formula-expression min-width:max-content. Existing E2E only detects document overflow, not the inner formula scrollers.
- **D5: Not genuinely restarted.** Existing resetTextbookUnit action clears one unit, but its button exists only at the bottom; saved N12 progress still resolves early holes after a deployment. A reset must return the learner to Q01 with every active N12 answer unanswered.
- **Why old lessons did not prevent D1:** W-MATH-004/P-002 explicitly says Q10/Q11 are to be kept whole because they are “translation from words, not automatic transform.” This was an incorrect exemption of multi-step *model construction* from already existing SPEC §§2,5,7,8 and MASTER §§7,8,10–12,50. Rechecking was too coarse and QA counted holes without verifying each cognitive step.

## 2. Exact change to N12 learner sequence

**Preserve all 15 original Q01–Q15 IDs, their exact answer strings and ordering, all 11 P-002 localized token IDs and correct values, original figures and two headings.** Nine new localized response stages, each with its own stable ID, specific reasoning task and plausible distractors:

| New ID | Visible active question / math slot | Answer | Why meaningful |
| --- | --- | --- | --- |
| n12-p003-q10-meaning | T(x) が表すのは【選択】 | 箱と20個の菓子の合計金額 | Understand the new function before using it |
| n12-p003-q10-cream-coef | シュークリーム x 個 × 180円 ⇒ □x 円 | 180 | Unit price × quantity |
| n12-p003-q10-pudding-coef | プリン (20−x) 個 × 130円 ⇒ □(20−x) 円 | 130 | Connect remainder count to correct unit price |
| n12-p003-q10-box-fee | さらに加える箱の固定代金は □ 円 | 50 | Do not omit fixed cost |
| n12-p003-q11-lower-sign | 3200 □ T(x) | \le | “以上” includes equality |
| n12-p003-q11-upper-sign | T(x) □ 3300 | < | “未満” excludes equality |
| n12-p003-q12-product-constant | 130×20=□ | 2600 | Compute expansion constant yourself |
| n12-p003-q12-total-constant | 50+2600=□ | 2650 | Add fixed cost and expansion constant |
| n12-p003-q12-x-coef | 180−130=□ | 50 | Combine the two x coefficients |

**Pedagogical order:**
1. Retain Q08 20−x and Q09 integer condition.
2. Ask what T(x) means, then separately derive the price of x cream puffs, of 20−x puddings, and the box fee (four slots).
3. **Then** original Q10 synthesizes the full cost formula, with its source answer unchanged: T(x)=50+180x+130(20−x). Do not print that answer beforehand.
4. Ask two inequality-sign slots based on T(x); **then** original Q11 tests the full bound with unchanged source answer.
5. Compute 2600, then existing P-002 negative coefficient −130, then 2650 and 50. **Then** original Q12 synthesizes 3200≤2650+50x<3300.
6. Retain Q13's 550, 650, and final 11≤x<13 steps; retain Q14 x=11 or 12. Just before Q15, show unsubstituted calculations T(11)=2650+50×11 and T(12)=2650+50×12 but **do not show 3200 or 3250 until Q15 is solved**. Retain source F03 only after Q15.
7. Every in-equation hole is unlocked one at a time; no already answered token, hint, visible figure, alt text, or neighboring sentence may reveal the current answer in advance.

Stage arithmetic: **15 original source questions + 11 existing P-002 gaps + 9 P-003 gaps = 35 active answer stages**. This is not 35 original questions. All incorrect responses stay on the same slot, with useful feedback.

## 3. Math content, visual and technical contract

- Correct underlying model: T(x)=50+180x+130(20−x)=2650+50x.
- Complete inequalities: 3200≤T(x)<3300, hence 550≤50x<650, hence 11≤x<13; integer x permits 11 and 12; T(11)=3200 and T(12)=3250.
- Visually use the **already approved N02/N12 rectangular「選択」hole**, not a novel hole style; 44px minimum touch target, keyboard/focus, correct x instead of 1x after coefficient-one resolution.
- Each meaningful transformation uses a short, separate visual line within **one continuous derivation group**. For the longer original Q10/Q11 choice answers, use a scoped N12-only mobile multiline presentation without changing their canonical answer strings or grading.
- Test 320px, 375px and 390px phone width and desktop. Both document and **each formula's internal scrollWidth** must fit; no sideways scrolling, clipped KaTeX, empty choice control, or font too tiny to read. Other units preserve their current layout.
- Preserve original Q01–Q15 mapping, Q01/Q02/Q06 inequality math, the fixed figures F01–F03 and their unlocking times, title hierarchy and source Word.

## 4. Revision 3 and actual start-over

- Bump **N12 only** from revision 2 to 3. A returning v2 learner, even with fully completed v2 answers, starts with Q01 / first token unanswered. Reloading is not itself a reset action; **the new unit revision** starts a fresh active N12 run on first opening after the correction release.
- Safely archive the previous N12 v1/v2 answer records, values, attempts/timestamps and completion marker. The v2→v3 conversion must be repeatable/idempotent without double clearing newly entered v3 answers. Retired or prior resolved IDs must not be treated as current answers. No reset of any other unit or app setting.
- Add a visible **top-of-lesson** 「この単元を最初から」 control. Confirmed manual reset clears all current N12 answers, closes active panels, resets the lesson cursor and returns focus/scroll to the first reading node. Keep historical archived attempts recoverable.
- If this safe archive/reset design cannot be implemented within a small N12-scoped helper, STOP and submit REVISE-PROPOSAL; do not silently discard history.

## 5. Scoped execution and QA (after exact approval only)

Allowed: N12 readingFlow/items; narrow N12-only formula/choice presentation; N12 revision and safe conversion; targeted reset UI; related N12 tests, source integrity, E2E, mobile/browser and Work logs. **Forbidden:** any other accepted units' learner content, mother Word and figures, Constitution, Math Practice/physics, broad state reset or global CSS refactor, unapproved merge and Pages release.

Checks before review:
1. Exact source 15 IDs/answer strings + existing 11 ID/answer strings retained, 9 new stable IDs, 35 active stages, correct order and first-block gating.
2. Learner must *create* cream, pudding, box, inequalities and calculation parts rather than merely see them. Verify hints and choice panels do not leak future answers. Audit every distractor mathematically.
3. CSS/layout: internal and outer overflow, KaTeX errors, input/hit target, previously approved N02 visual parity.
4. N12 revision cases: new learner, partially answered v1/v2, completed v2, refresh twice before and after first v3 response, explicit reset, other unit history unchanged, previous N12 records archived.
5. Run relevant typecheck, unit, build, Playwright Chromium mobile+desktop, source mapping, figure gating and sibling regressions.
6. Cross-audit approved created content (including review-only N01/N02/N03/N09/N10) for the **same incorrect atomic-model classification** and internal formula overflow. Record CONFIRMED / NOT-AFFECTED / UNVERIFIED with source/version. If a confirmed defect requires more work, create a linked correction Proposal and wait for approval before editing it.

## 6. Lesson checks, correction closure and release

- During implementation **before each small design activity**—one concept, one problem, one formula transformation/hole or UI unit—check the applicable previously approved lessons. This is **in addition to** the check before the major project begins. The latest user clarification explicitly rejected a merely after-the-block check.
- Following verified fixes and required user acceptance, compare the finding with existing lessons, identify why they were not followed, merge/deduplicate relevant project-wide and math textbook rules, and integrate this **two-level pre-task lesson gate** into non-Constitution workflow. Constitution itself remains unchanged.
- Paused N11/N13/N14 creation resumes only after outstanding linked corrections, lesson reconciliation and creation-entry checks. An approved creation plan is not implicit correction permission.
- Implementation must be on **a separate feature branch and PR**. Even when its QA passes, main merge/Pages/public release require a **separate explicit user authorization**, followed by review link and hands-on acceptance.

## 7. Exact approval question

「**W-MATH-008/P-001を承認する**」 authorizes implementation and verification of this exact N12 35-stage scoped correction, vertical formula layout, revision-3 archived restart and the associated cross-creation *audit* on a separate PR. It authorizes neither editing other units nor merging/deploying without later approval.

If you wish to change part of the above, that is proposal feedback: issue P-002 and wait for its explicit approval before code changes.

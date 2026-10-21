# W-MATH-003 / P-004-R3 — 残存する先出し5箇所とN07長文選択肢の改行1件

Status: **APPROVED 2026-10-20 (user's explicit 「承認」), IMPLEMENTING**
Date: 2026-10-20 JST
Command: CMD-WORK-001「修正」; this revision supersedes the initial unapproved R3 draft (3 paragraphs) after authentic browser screenshot and pre-answer-order audit. It is **not** covered by prior explicit P-004, P-004-R1, or P-004-R2 approvals.
Audited lesson-code SHA: `f48509b7fca51c758c644d5274551bb2804e20df`.
Genuine screenshot evidence from the exact code SHA: `work/items/W-MATH-003-numbers-expressions-creation/evidence/n04-n14-gallery/p004-r2-*` committed by Actions at `8ea2b1e331f4e64e3976ef8860fbe1ebdd1b7193`.
Original Word SHA-256: `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`.

## Root cause: a lead-only fix is insufficient

The approved eleven questions now ask for the original Word's reasoning decision. But `makeReviewSteps` emits group `intro` and each earlier question's `after` as **visible paragraphs** in readingFlow. A prior visible paragraph can disclose the next question's exact operation even if its own `lead` no longer does. A cross-question source-order audit confirmed **five** such paragraphs. No approved user-visible choice answers or IDs need changing further.

| Future question | Existing preceding prose containing source decision | Exact proposed replacement **after approval** |
| --- | --- | --- |
| N06-Q05 | Second group's `intro`: `四次式でもx²が繰り返し使われていれば、そこをTと置くと次数が下がる。` | `四次式でも、繰り返し現れる式のまとまりを見つければ、二次式として扱える場合がある。` |
| N11-Q09 | N11-Q08 `after`: `次は負の数で割るので、先ほどとは向きの扱いが異なる。` | `次はxの係数を1にする操作を選び、不等号の向きを確かめる。` |
| N14-Q10 | N14-Q09 `after`: `次は三辺に同じ3を足して、中央をxにする。` | `次は三辺に同じ操作をして、中央をxだけにする。` |
| N14-Q14 | N14-Q13 `after`: `まず定数−2を消す操作を三辺すべてに行う。` | `次は三辺に共通する操作を考え、中央の定数を整理する。` |
| N14-Q15 | N14-Q14 `after`: `正の3で三辺を割っても不等号の向きは変わらない。` | `三辺に同じ変形を行い、中央のxの係数を1にする段階へ進もう。` |

Only these **five precise prose fields**, without altering original problem, mathematical choice, explanation after its *own* answer, section order or source IDs, are requested.

## Display-only defect confirmed on an actual 320px screenshot (sixth change)

- Image: `p004-r2-n07-09-320-before.png`, exact code SHA above. Newly approved N07-Q09 compound answer (three mathematical facts separated by `,\\;`) appears as a single long overflowing line in the 320px option card. Existing `.reading-choice-formula-line` uses inner horizontal scrolling, so overall-page overflow E2E can PASS even while not all of the choice is visible at once. This is a **visual readability**, not mathematical grading, failure.
- **Narrowest existing helper**: `src/domain/textbookDisplayLines.ts`, which already splits designated answer strings into layout-only rows (e.g. N09) and is consumed by `TextbookUnitPage.tsx`.
- Proposed for `itemId === 'n07-09'` only: return `value.split(',\\;')` to display each of the three decision clauses as a separate line for the correct answer **and all three distractors**. No change to the stored answer string, matching, distractors, item ID, user progress, formula semantics, fonts, CSS or other textbook items. Preserve `textbookDisplayLines` behavior unchanged for all other IDs. Do not make a general renderer/CSS/schema edit.
- Add an explicit formatter test verifying all 4 option texts split into 3 exact clauses and recombine into the untouched original answer with `,\\;`. Add browser screenshot and assertion that all three visible KaTeX lines in the N07-Q09 choice card fit at 320px and 390px without **inner horizontal clipping/scrolling**, not merely whole-page overflow.

## Protected areas and progress

CHANGE only those five prose strings and the one item-specific display-only split plus minimal associated unit/formatter/E2E tests and review screenshots. KEEP untouched: the eleven P-004-R2 `lead`/choice keys/prompts, other Word problem text, figures (nine PNG), all original source marker IDs 123 / app item IDs 127, answer grading, `revision` (N07/N11/N14 already 3), v1→v2→v3 archive/reopen, CSS, shared display behavior for any other item, existing six accepted units, physics/practice, `main`, Pages/Vercel deployment, billing.

No new progress revision is necessary because the five paragraph changes and one rendering-only change **do not alter the accepted answer or question**. If inspection finds a new material change, stop and issue a further exact proposal; do not silently expand this one.

## Verification once explicitly approved

1. Source-ordered readingFlow inspection: all five future choices remain genuinely unanswered before engagement, with source cognitive operation preserved; inspect prose/figures preceding the other 11 R2 questions too.
2. Unit tests for 5 intro/after replacements and N07 four 3-row display-only options, KaTeX math, full answer-key identity and unchanged item IDs/revisions.
3. 123-marker / 127-item, nine original PNG SHA integrity; v1/v2/v3 progress preservation; existing math/physics/practice regression.
4. Real 320px and 390px browser wrong→retry→hint→correct→reload for affected items and screenshots with full code SHA. Confirm N07 three separate visible lines and no inner horizontal scroll or clipping.
5. Record failures/retests; user Gate① genuine actual screenshot review for current corrections, then continue Gate② independent mathematical proof of all 123 original questions and every distractor. No Gate② final PASS or Gate③ until those independent checks and user stages are satisfied.

## Approval gate

**Approval received:** The user replied 「承認」 directly to this exact six-change P-004-R3, followed by 「いいよ」 to proceed. Authorized only five specified prose fields and the N07-Q09 layout-only splitter plus scoped tests/evidence, without main merge/publication.

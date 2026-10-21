# W-MATH-017 / P-007 — N11 Q08–Q09: 引き算と負数除算を式中の判断へ分ける
Status: APPROVED — EXACT USER APPROVAL: 「いいね承認」 in direct reply to full P-007 (2026-10-21 JST). No other unit or main approval.
Date: 2026-10-21 JST
Command: CMD-WORK-001「修正」, §12B same-root sibling of accepted P-005/P-006.
Target: N11 ORIGINAL source Q08 and Q09 **only** (both are adjacent and mathematically dependent). Do not change Q01–Q07, Q10–Q14, other N units or original source Word.
Current code branch: `fedcc0a8bbd8e5ea9391ee46babf305a565865bc`; last fully tested learner source SHA `2c568703cb3e56b5ef4ab119b411bdb89e674cc6`.
P-006 exact learner layout approved at Gate①: [record](./P006_GATE1_VISUAL_ACCEPTANCE.md). No need to reconfirm.

## Existing confirmed defect and student goal
Current `src/data/textbook/math/numbers/n11Lesson.ts` `makeReviewSteps` source markers:
- Q08 `-2x+3\le5`: one graded whole choice `\\text{両辺から}3\\text{を引く},\\quad-2x\\le2`. This reveals both subtraction decision and arithmetic outcome at once.
- Q09 `-2x\le2`: one graded whole choice `\\text{両辺を}-2\\text{で割る},\\quad x\\ge-1`. It likewise skips testing sign reversal and quotient separately.
- Q10 already checks that boundary `x=-1` satisfies `-2x+3\le5`; KEEP it completely unchanged and gated until Q09 resolves.
Existing math SPEC 'blank=thinking node', MASTER §§7–12/20/52 and sibling ledger already demand separating actual learner reasoning; do not generate generic “確認” marker or add detached finished-expression choice boxes.

## Exact proposed learner derivation (math lines FIRST)
All rows and inserted explanatory prose share new local `derivationId:'n11-q08-q09-chain'`, using the **existing** grouped renderer (N11 Q05/Q06 P-005/006 and N12 as reference).

```text
  -2x + 3 ≤ 5

  -2x + 3 - [3] ≤ 5 - [3]

  （両辺から同じ数を引いても、不等号の向きは変わらない。
    左辺の +3 と -3 を打ち消す。）

  -2x ≤ [2]

  （x の係数は負の数。両辺をその係数で割ると、
    不等号の向きが逆になる。）

  x [≥] [-1]
```

Explanation #1 appears ONLY after **both** 3 decisions resolve; it does not give away the later `2`.
Explanation #2 appears ONLY after the `2` result resolves; it states the **rule** but does not itself print `≥` or `-1` before the separate choice holes.
This is one 4-formula/2-paragraph derivation, not six cards. Q08 and Q09 remain two original Word source labels, each source contains its own student decisions. Final Q10 starts only after both Q09 last-line decisions resolve.

## Distinct learner decisions and exact keys
| Original source | Stable proposed item ID | Student action | Answer | Deliberately plausible wrong choices |
| --- | --- | --- | --- | --- |
| N11-Q08 | `n11-p007-q08-subtract-left` (new) | choose cancellation on LHS `+3-□` | `3` | `-3`, `2`, `5` |
| N11-Q08 | `n11-p007-q08-subtract-right` (new) | choose matching subtraction on RHS `5-□` | `3` | `-3`, `5`, `2` |
| N11-Q08 | `n11-08` (existing ID but new grading meaning) | calculate `5-3` in `-2x≤□` | `2` | `8`, `-2`, `5` |
| N11-Q09 | `n11-p007-q09-direction` (new) | choose inequality direction after division by a negative coefficient in `x □ □` | `\\ge` | `\\le`, `>`, `<` |
| N11-Q09 | `n11-09` (existing ID but new grading meaning) | calculate quotient `2/(-2)` in final RHS | `-1` | `1`, `-2`, `2` |

N11 source mappings become `N11-Q08`→3 actions and `N11-Q09`→2 actions, with **3 newly added** IDs; current N11 25 decisions → expected 28. The existing 14 original Q labels remain, and no new graded question belongs to Q10. Original source Q08 and Q09 remain separately enumerable.

**Why no separate divisor □?** The coefficient `-2` and the need to divide by it are already explicit in Q09's starting equation; an extra repeated divisor blank would test copying `-2` rather than a distinct mathematical decision. Student instead independently performs the nontrivial sign-direction and numeric quotient. This deliberately obeys the user's preference against trivial/redundant blanks. If the user prefers an explicit divisor hole, revise proposal and reapprove before coding.

## Exact authoring/progress scope
- Local source file `src/data/textbook/math/numbers/n11Lesson.ts` ONLY: replace generated Q08–Q09 *reading* blocks and their two original compound grader keys; add three meaningful local decisions and source mapping. Preserve existing Q05/P-006 blocks, Q07/Q10 narrative/figure Q10, Q11/Q14 approved flow. Do NOT rewrite `newBatchGuidedSteps.ts`, shared renderer/CSS or page, original Word, images, Math Practice or Physics.
- Progress **revision8→9** is mandatory because stable `n11-08` and `n11-09` change from complete-operation choice to numeric result. Copy/archive all old revision8 answer records, history, completion timestamps. **Reopen only old `n11-08` and `n11-09`**, add three fresh IDs unanswered. Leave all P-006 Q05/Q06 values and prior Q01/Q11/Q14 untouched; older v1–v7 must migrate in order via existing history preservation.
- Flow renderer: 4 formula + 2 explanatory `paragraph` blocks under exact same `derivationId`, ordered. Preserve `n11-lead-08`, `n11-formula-08`, `n11-after-08`, `n11-lead-09`, `n11-formula-09`, `n11-after-09` only where they still carry same approved meaning; retire no ID outside Q08/09, and record exact replacements in the implementation diff.
- Use source explanation **after** decision, never prefill the answer; hints must not disclose `2`, `\\ge` or `-1` before corresponding choice. Local incorrect/distractor examples remain mathematically checked for each item.
- Tests: source 14, active N11 28, 320/390/1440 screenshots, error/hint/retry, mobile no overflow/KaTeX errors, Q10 boundary after Q09, migration rev8→9 with full history, unchanged N11 P-006 Gate① and Q01/Q11/Q14 other accepted gates, N14 and practice/physics regressions, Math CI.
- Gate① user must inspect **only new Q08 and Q09 math/short-explanation blocks**, separately number-mapped and screenshot-proven at exact code SHA. P-006 accepted marks disappear from next output; no repeated Gate① demand on Q05/Q06.
- Gate② independent post-change §12B audit remains open until all affected siblings assessed. Gate③ frozen SHA real app total-play user `総チェックOK`; old Pages and GitHub PR are not the candidate app. No main merge, Pages/deployment, new host, cost, or repo cleanup in this proposal.

## Exclusions and approval
This P-007 is the **next exact correction proposal**, not an automatic entitlement from the user's “继续” or P-006 small-block acceptance. P-007 was approved unchanged by the user's direct 「いいね承認」. Enter `APPROVED/IMPLEMENTING` and perform per-Q08 then per-Q09 preflight and bounded implementation. If user requests changes, remain `REVISE-PROPOSAL` and present revised exact proposal before implementing.

**Approval result: APPROVED unchanged (user 「いいね承認」). Gate① actual screenshot acceptance and Gate②/③ remain independent.**

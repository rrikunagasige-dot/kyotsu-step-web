# W-MATH-021/P-002 — N14 Q15 中央の誤答後ヒントを「問いかけによる誘導」に修正
Status: PROPOSED — user exact approval REQUIRED; not implemented
Date: 2026-10-22 JST
Command: CMD-WORK-001 修正, user review feedback → REVISE-PROPOSAL
Current code reference: `98b7513d34914213b76a70746a6905a4cd87a9df` (draft PR #110, main unaffected)
Stable item ID: `n14-wm020-q15-divide-center`

## 1. User feedback and root diagnosis
The user reviewed the **actual P-001 after-wrong hint screenshot** and replied verbatim **「不有问句是引导」**. Interpret this as a correction request for **direct question-form scaffolding**, rather than an explanation/instruction that closes with 「考えよう」 and gives away the inequality-direction conclusion. The screenshot itself is authentic and its technical browser test PASS remains valid for the *historical P-001 SHA*, but it is **NOT user visual approval** of the P-001 wording.

P-001 currently deployed only on draft branch (not main) and previously approved separately:
> 3xの係数を1にするには、どんな正の数で割ればよいか考えよう。正の数で割れば不等号の向きと等号は変わらない。

The original already removes the explicit operand `3x÷3=x`, but does not actually ask the learner a direct question and states the sign rule as a finished conclusion. Therefore the review style remains a confirmed correction target, with the mathematics and UI unchanged.

## 2. Full exact revised learner-visible text (P-002)
Replace **only** the string in the existing item `n14-wm020-q15-divide-center` in `src/data/textbook/math/numbers/n14Lesson.ts`.

**Before (P-001 currently in draft):**
> 3xの係数を1にするには、どんな正の数で割ればよいか考えよう。正の数で割れば不等号の向きと等号は変わらない。

**After (proposed P-002, NOT YET IN CODE):**
> 中央の3xをxにするには、どんな正の数で割ればよいだろう？ その数で三辺を割ると、不等号の向きはどうなるだろう？

Both sentences are **genuine interrogative guidance** rather than a worked arithmetic identity or a finished explanation. First asks the learner to infer the unknown positive divisor from `3x→x` without printing the answer number as `3x÷3=x`. Second asks them to recall the positive-division inequality direction. This changes only the after-wrong hint, never the initial mathematical question or the choices.

## 3. Exact boundaries and §12B sibling impact
- **Only this one item hint string** changes after new explicit P-002 approval. Same 5 answers (`3,3,3,-\frac23,2`), same Q15 three logical equations, mobile two visual rows, original full-sized blue「選択」 / red「×」, same choices, progression, Q14→Q15→Q16, N14 revision9 and archived prior answers; identical CSS, DOM, React and approved math Gate①.
- Prior P-001 user `承認` authorized the then-proposed statement, **not** this new question-shaped wording. Do not use that approval for P-002 implementation. P-001 branch code and real 320/390/1440 screenshots remain historical evidence, not user approval of the rejected hint.
- Q10/Q14 previously accepted and not affected by Q15-item-only scope; Q15 left/right and bound hints not changed. Q16's separately confirmed after-wrong worked-endpoint hint remains out of scope; other same-cause items UNVERIFIED, requires separately authorized correction.
- No revision bump; no main merge, publication, hosting, deployment, billing or new user request for approval of earlier accepted mathematical expressions.

## 4. Verification after separate approval
- Focused unit test asserts exact NEW text, excludes old P-001 text and forbidden completed `3x÷3=x`, preserves item IDs/answer and revision9/34 count.
- Native real-app Chrome at widths 320/390/1440: center wrong→reopen→**interrogative hint** visible without clipping→correct→remaining Q15 choices→Q16→reload persistence; preserve actual screenshots and complete source SHA in same canonical Work evidence path, never claim old P-001 images validate new text.
- Full Mathematics textbook, Practice, Review, Governance and Physics regression as prescribed; no weakened assertions to force green. If a new error appears, log root/cause and return to the existing correction flow.
- Gate① of **changed hint only** requires new screenshot and user's `細部OK`; previous math/other Gate① acceptances are not reopened. Overall Gate② still not cross-verified and Gate③ `総チェックOK` absent.

## 5. Decision
**Does the user approve replacing ONLY the existing Q15 center wrong-state hint with exactly the two question-form sentences above?**

No code has been altered for P-002. Stop here until new direct approval.

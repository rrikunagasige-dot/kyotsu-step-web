# W-MATH-003 / P-004-R2 — 原問の思考操作を先出しする11件の追加修正案

Status: PROPOSED / NOT APPROVED / NO IMPLEMENTATION
Date: 2026-10-20 JST
Command: CMD-WORK-001「修正」 / correction-first (§12B)
Parent: approved P-004 (8 cases), approved P-004-R1 (2 cases), both implemented and CI PASS
Review branch: `work/W-MATH-003-p003-r1-n04-n14-batch-20261019`
Audited **app-code SHA**: `2604589da22062cb67928ee5e1569a5de0338845`
Source Word SHA-256: `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`
Evidence: original Word questions vs the actual `lead`, `prompt`, `answer`, `wrong` in the 8 new lesson files. The original 10 repaired questions are excluded.

## Problem and exact source-cognitive requirements

The same root-cause B from P-004 persists outside the previous ten approved questions: a pre-answer lead gives the cognitive operation the original Word asks the student to choose. In some questions the answer merely gives the result, not the requested operation (root-cause A). The final numeric/algebraic answer can still be correct. Neither a successful 127-click E2E nor a correct final algebraic key proves cognitive fidelity.

| ID | Word demands (literal task meaning) | App pre-answer issue | Required repair scope |
| --- | --- | --- | --- |
| N06-Q01 | select repeated part, define X, rewrite original | `lead` explicitly states `x+2y` is the repeated part | Rewrite lead to ask student to discover it; preserve paired answer `X=x+2y,(X+1)(X-2)-4` |
| N06-Q05 | select substitution making quartic quadratic | `lead` explicitly says `x²` becomes `T` | Rewrite lead without specifying x²; preserve substitution + polynomial answer |
| N07-Q09 | find **minimum** decimal multiplier and subtraction equation | `lead` explicitly says to move decimal two places | Ask student to compare powers of 10; answer must include 100倍, `100x=69.\overline{69}`, `99x=69` as one choice; update other choices accordingly |
| N08-Q02 | infer `|a|` for `a≥0` | `lead` states distance equals coordinate, the answer itself | Rewrite lead as an open comparison of location and origin; retain `|a|=a` answer |
| N11-Q06 | choose coefficient-normalization operation **and** inequality direction/result | `lead` gives division by positive 3; choice only checks result | Rewrite lead; make one compound selectable response with operation `÷3` + `x<7/3` |
| N11-Q08 | choose first transformation of `-2x+3≤5` | `lead` tells student to add −3 to both sides | Ask for the operation; select operation `−3` together with `-2x≤2` |
| N11-Q09 | choose division and direction when solving `-2x≤2` | `lead` tells division by −2 and reversal before answer | Ask for divisor/sign/direction; select operation `÷(−2)` together with `x≥−1` |
| N11-Q13 | select operation clearing fraction and immediate inequality | `lead` already orders multiplication by 3; choice only checks result | Rewrite lead; pair multiplication by positive 3 with `x−2≤6x+3` |
| N14-Q10 | choose same operation on all three members of `−5<x−3<5` | `lead` specifies adding 3 | Ask student to decide operation; pair `三辺に3を足す` with `−2<x<8` |
| N14-Q14 | choose transformation removing constant from `−4≤3x−2≤4` | `lead` specifies adding 2 | Ask for operation; pair `三辺に2を足す` with `−2≤3x≤6` |
| N14-Q15 | choose coefficient-normalization and final range | `lead` specifies division by positive 3 | Ask for divisor and final interval; pair `三辺を正の3で割る` with `−2/3≤x≤2` |

## Exact before/after boundaries (no unintended rewriting)

- In each of these **11** entries, only the matching `lead` and, where indicated, `answer` and three `wrong` strings are eligible for amendment. The `prompt` may be minimally aligned to compound response wording only where needed.
- Proposed new lead meaning, by question order:
  - N06-Q01: 「二つの括弧に繰り返し現れる式のまとまりを見つけ、それをXと置いてみよう。」
  - N06-Q05: 「四次式を見て、一文字に置き換えると二次式として扱える部分を探そう。」
  - N07-Q09: 「循環する部分を元のxとそろえるには、10・100・1000倍のどれが最小か考えよう。」
  - N08-Q02: 「aが0以上の位置にある。原点との距離を、座標aだけでどう表せるか考えよう。」
  - N11-Q06: 「3x<7から係数を1にする操作と、不等号の向きを考えよう。」
  - N11-Q08: 「−2x+3≤5で左辺の定数を消すには、両辺に何をすればよいだろう。」
  - N11-Q09: 「−2x≤2から係数を1にする。割る数の符号と不等号の向きを判断しよう。」
  - N11-Q13: 「(x−2)/3≤2x+1の分母をなくす操作と、その直後の不等式を考えよう。」
  - N14-Q10: 「−5<x−3<5の中央をxだけにするには、三辺にどの操作を行えばよいだろう。」
  - N14-Q14: 「−4≤3x−2≤4の定数を消す、三辺共通の操作を考えよう。」
  - N14-Q15: 「−2≤3x≤6の中央の係数を1にする操作と、得られる範囲を考えよう。」
- For 7 compound-operation choices (N07-Q09, N11-Q06/Q08/Q09/Q13, N14-Q10/Q14/Q15 = **8** items), retain the **mathematical final expressions unchanged** while adding the source-requested operation to the correct answer. Regenerate exactly three distinct **plausible incorrect** paired alternatives per item. Preserve uniqueness and valid LaTeX. (8 = 1 + 4 + 3.)
- N06-Q01/Q05, N08-Q02 keep their mathematical choice keys and distractors unchanged.
- Recheck question text, supporting explanation and **pre-answer accessibility** in the actual `readingFlow`: no completed answer in preceding prose, figures, accessible alt or hint. Hints may appear only after a wrong choice.

## Do not touch

Teacher original DOCX, the nine byte-identical original diagrams, source marker IDs 123/123, app operation IDs 127/127, unrelated question answers, other lessons N01/N02/N03/N09/N10/N12, published math-sets, physics and practice, existing learner progress/revision migration, catalog publication, main, Pages, Vercel, permissions, billing.

No extra learner items, unit revision bump, shared helper changes, schema migration or figure edits are authorized by this *proposal*. If any of those become necessary, return to REVISE-PROPOSAL before changing them.

## Independent verification to perform **after explicit approval**

1. Word source cognitive request vs 11 revised leads/prompts/choices, independently solve every changed item and all three new distractors.
2. Test all 11 wrong → panel closed → reopen → hint → correct, at 320px and 390px, plus no prior disclosure and persistence.
3. Full 123 original marker → 127 fixed item mapping; all 127 correct paths on desktop and mobile; original nine diagrams SHA and gated timing.
4. TypeScript, ESLint, textbook tests, production build, all accepted earlier math units, Math Practice, Physics Textbook and related regression.
5. Real app screenshots at answer-before, wrong/hint and after for all **11** changed entries (two widths), tied to a single code SHA; existing Gate① procedure.
6. Continue Gate② independent mathematical audit of all 123 original answers and *every* distractor. A successful repair test does not close the remaining UNVERIFIED rows.

## Review/approval boundary

**STOP before code changes.** The user's 「続けて」 authorizes continuing the already-approved audit, not approval of this new exact corrective scope. Present this whole P-004-R2 for explicit approval. Preserve P-004 / P-004-R1 approval and earlier Gate① visual history; do not reinterpret them as P-004-R2 approval. Gate② NOT CROSS-VERIFIED; Gate③ NOT READY.
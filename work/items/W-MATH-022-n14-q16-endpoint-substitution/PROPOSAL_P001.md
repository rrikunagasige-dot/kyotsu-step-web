# W-MATH-022/P-001 — N14 Q16 両端を元の絶対値式へ代入する6つの局所判断
Status: PROPOSED — USER EXACT APPROVAL REQUIRED; NO IMPLEMENTATION
Date: 2026-10-22 JST
Command: CMD-WORK-001 修正 (WORK_SYSTEM §§12A/B, small block and Gate①→②→③)
Source: live `src/data/textbook/math/numbers/n14Lesson.ts` at `1e3cb0dd3a6d1a86e856ea8cdf625feccdb985a8`, original Q16 teacher Word already reconciled in earlier N14 audit.

## Confirmed original question, root cause and predecessor
- Previous N14 Q13: `|3x-2|\le4\iff-4\le3x-2\le4`, Q14 accepted `-2\le3x\le6`, Q15 accepted `-\frac23\le x\le2`. Keep all Q13/Q14/Q15 equations and Q15 newly accepted example-first four-stage hint exactly as-is.
- Original teacher Q16: "左端 x=−2/3 と右端 x=2 をそれぞれ 3x−2 へ代入し、絶対値が4になるか確かめる". Original N14 final #16 has only one choice, answer `|-4|=4,\quad|4|=4`. In the current application the student merely recognizes BOTH finished endpoint results together, rather than executing either substitution (CONFIRMED root: bundled result card).
- Q16 after-wrong `hint` currently evaluates BOTH unresolved results: `x=−2/3では3x−2=−4、x=2では3x−2=4。距離はいずれも非負。` (CONFIRMED separate but *same Q16 small block* defect). Fix both source design and its own hint system in ONE separately approved Q16 small-block plan, not a global rework.
- Do not label preceding Q15 changed-hint Gate① as incomplete: it has direct user acceptance. No Q16 code, selector, answer, CSS, old history or browser E2E has been modified by this P-001.

## Proposed exact student math — 3 logical formula blocks, two endpoint calculations

Given condition and *previously obtained* endpoints, no Q16 result disclosed:
```latex
|3x-2|\le4,\qquad x=-\frac23,\ 2
```

Evaluate the left endpoint, 3 separate formula-choice blanks in original order:
```latex
\left|3\left(-\frac23\right)-2\right|
=\left|\boxed{\phantom{-2}}-2\right|
=\left|\boxed{\phantom{-4}}\right|
=\boxed{\phantom{4}}
```
Answers (first multiplication, then subtraction, then absolute-value): `-2`, `-4`, `4`.

Evaluate the right endpoint, also 3 independent answer blanks:
```latex
\left|3(2)-2\right|
=\left|\boxed{\phantom{6}}-2\right|
=\left|\boxed{\phantom{4}}\right|
=\boxed{\phantom{4}}
```
Answers: `6`, `4`, `4`.

After **all six** choices are resolved, show only the existing Q16-after explanation, or a logically equivalent short sentence if the existing source requires local split (no extra unrelated section heading):
> 両端とも元の条件を等号で満たすため含める。これで絶対値不等式の範囲が完成した。

Crucial: these are 3 *logical* formulas (given, left branch, right branch), but each long branch may need **two or more VISUAL rows at 320px**, determined by genuine Chromium and approved exact CSS if necessary. Do not shrink blue 「選択」 or red 「×」 buttons, change font or use hidden answer placeholders. All six answers are local, not a bundled final expression.

## Q16 after-wrong question-led hints — proposed 6 distinct strings, no result leakage
1. Left multiply `3(-2/3)`, key `-2`: 「まず3×(−1/3)を考えると、3×(−2/3)ではどう変わる？」.
2. Left subtract, key `-4`: 「負の数からさらに2を引くと、数直線のどちらへ進む？ 直前の値で計算すると？」.
3. Left absolute value, key `4`: 「|−1| はいくつ？ 同じ『0からの距離』の考え方を直前の数に使うと？」.
4. Right multiply, key `6`: 「3×1はいくつ？ では3×2はその何倍になる？」.
5. Right subtract, key `4`: 「今求めた数から2を引くといくつ？ まず1だけ引く場合と比べると？」.
6. Right absolute value, key `4`: 「正の数の絶対値はどうなる？ ひとつ前に計算した数は正か負か？」.

These *after-error only* prompts require the student to calculate the requested hole. None prints its own completed `|-4|=4`, `|4|=4`, `3x-2=-4` or `3x-2=4`. Student-visible operation text can be refined only by a NEW exact proposal if the user rejects it, not silently.

## Exact bounded implementation after user approval
- Source mapping `n14SourceToItemIds['N14-Q16']` → `[n14-wm022-q16-left-mul,n14-wm022-q16-left-sub,n14-wm022-q16-left-abs,n14-wm022-q16-right-mul,n14-wm022-q16-right-sub,n14-16]`; **stable existing `n14-16` now grades only right final absolute value `4`** and does not falsely retain the old combined answer.
- N14 source original 16 question markers, original one figure `n14-f01`, accepted Q07/Q08/Q10/Q12/Q14/Q15 and prior Q15 four-stage hint untouched. Existing Q16 `lead-16` and `after-16` IDs retained; add scoped formula and item IDs under one Q16 chain, with no new major section title.
- Current N14 revision9 with **34** decisions → revision10 with **39** (replace one original combined Q16 choice with six decisions). Archive revision9 old Q16 answer and all previous archives, reopening `n14-16` only. Unchanged answers and progress for approved Q10/Q14/Q15 and other problems persist, never revive old combined Q14/Q15 keys.
- All six choices must have four distinct plausible values, exact answer values and guard against guessing by visible completed final result. Sequential activation, wrong/hint/retry, keyboard and persistence. Test `3(-2/3)-2=-4` and `3(2)-2=4`, then `|-4|=4`, `|4|=4`; both satisfy `\le4` inclusively. Test original 16 source marker ordering and Q15→Q16 closure.
- Use existing design and authentic same-source-SHA numbered review at 320,390,1440, and ordinary N14 path. Define a Q16-only mobile VISUAL wrap after genuine geometry measurement. Reviewer yellow frame at 320 requires independent measured PASS: avoid repeating Q10/Q14 padding fixes blindly or introducing unrelated CSS. If the proposed exact rendering cannot fit original controls, **STOP and propose a separate exact layout correction**, no unapproved tuning.
- Full textbook CI and existing math practice/physics, review/governance, raw Word OMML and history audits; keep original images and new SHA-bound screenshot evidence. Gate① user sees only concise equation representation, not a wall of screenshot links; any previously accepted block is NEVER submitted again. Independent broad Gate② and full SHA-matched live playable Gate③ with user `総チェックOK` are still separate.

## §12B impact ledger (candidate, not an assertion of exhaustive audit)
- CONFIRMED root at Q16 only: bundled choice and directly evaluated after-wrong hint.
- NOT-AFFECTED by this proposed Q16-only change: approved Q10/Q14/Q15 source/hints/math/buttons/review states, N11, and original source-marker/figure IDs (must be regression-verified after implementation).
- UNVERIFIED: all other chapters' bundled endpoint checks, all 123 distractors/raw answer-key fidelity, full independent cross-mode human audit.
- No changes to main, Pages, release, public app, paid accounts or unrelated repository files.

## Decision
Await the user's **new explicit approval** for this Q16-only six-hole substitution and hints design before writing any learner, stylesheet, schema, tests or preview code. This proposal is **not** a code change and cannot itself mark Gate①, Gate② or Gate③ complete.

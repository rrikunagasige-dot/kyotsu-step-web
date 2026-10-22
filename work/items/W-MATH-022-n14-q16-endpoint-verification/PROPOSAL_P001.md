# W-MATH-022/P-001 — N14 Q16 代入と絶対値による両端の検算を、計算過程ごとに穴埋めする
Status: PROPOSED — new explicit user approval REQUIRED, NO LEARNER CODE IMPLEMENTATION
Date: 2026-10-22 JST
Command: CMD-WORK-001 修正; governance/INSTRUCTION_DICTIONARY.md, WORK_SYSTEM §§12A/12B, mathematics/textbook SPEC, MASTER small-block lessons.
Authority: current reviewed source SHA `1e3cb0dd3a6d1a86e856ea8cdf625feccdb985a8`, isolated proposal branch `work/W-MATH-022-n14-q16-endpoint-verification-proposal-20261022`. Existing Q10/Q14/Q15 and Q15 center P-003 already visually accepted. Neither user “続けて” nor their earlier narrow approvals permit implementing Q16.

## Original source / reason to correct
Teacher's N14 Q16 (original Word v2 as quoted in the canonical n14Lesson.ts) is: 「左端x=−2/3と右端x=2をそれぞれ3x−2へ代入し、絶対値が4になるか確かめる。」 It follows the already accepted Q15 solution `−2/3≤x≤2` and the source inequality `|3x−2|≤4`.

Current source stable original key `n14-16` grades only ONE bundled ready-completed pair:
`|-4|=4,\quad|4|=4`.
Its after-wrong hint currently directly reveals:
`x=−2/3では3x−2=−4、x=2では3x−2=4。距離はいずれも非負。`
Both intermediate results are given rather than computed by the learner. Mathematical answer itself is **correct**; this is a pedagogy/answer-disclosure correction, not a change to the theorem. Do not alter the teacher original, or ask to reapprove the accepted Q15 endpoint values.

## Exact proposed learner-visible progression (P-001)
Given from already solved Q15, show `−2/3≤x≤2` and the *original check* `|3x−2|≤4` without revealing the endpoint evaluations.

A. Left endpoint `x=−2/3`:
```tex
3\left(-\frac23\right)-2=\boxed{\phantom{-2}}-2=\boxed{\phantom{-4}}
\left|-4\right|=\boxed{\phantom{4}}
```
Corresponding three **independent** answers: `-2`, `-4`, `4`.
Use the previous left computed value `-4` as an *already resolved* literal in the following absolute-value line, not an additional repeated hole. Do not show this next line until both prior holes are resolved.

Short transition when left endpoint verified: 「左端では絶対値が4になった。次に右端も元の式に代入する。」 This sentence appears only after the left endpoint absolute value has been resolved; it contains no *unanswered* right-end value.

B. Right endpoint `x=2`:
```tex
3(2)-2=\boxed{\phantom{6}}-2=\boxed{\phantom{4}}
\left|4\right|=\boxed{\phantom{4}}
```
Corresponding three **independent** answers: `6`, `4`, `4`. The last (4) is the actual absolute-value check and is not exposed before the learner computes the right interior (4).

C. Retain the original post-Q16 explanatory note, shown only after all six holes: 「両端とも元の条件を等号で満たすため含める。これで絶対値不等式の範囲が完成した。」
Reason: each endpoint gives `|3x−2|=4`, so both satisfy `≤4`. Preserve equality and sign handling. No extra vague summary or decorative figure.

For narrow phones, either computation equation may be visually continued onto 2 lines if real 320px overflow requires it, **without splitting its logical step, shrinking the canonical blue『選択』/red『×』, or exposing downstream steps early**. The above mathematics is the canonical content; exact formula-part grid/wrap CSS must be restricted to `n14-q16-chain`, confirmed with a real GitHub Chromium screenshot, and stopped for a revised proposal if approved scope is insufficient.

## Item IDs and backward compatibility (specific engineering plan, only after approval)
- Preserve all 16 teacher question markers, their source ordering and the original Q16 bridge. Under `N14-Q16`, map six local decisions in source order:
  `n14-wm022-q16-left-multiply` → `-2`,
  `n14-wm022-q16-left-interior` → `-4`,
  `n14-wm022-q16-left-abs` → `4`,
  `n14-wm022-q16-right-multiply` → `6`,
  `n14-wm022-q16-right-interior` → `4`,
  `n14-16` → `4` (existing stable ID re-keyed **only** to last right abs result).
- Proposed N14 `revision:9→10`, `34→39` total items (one old bundled Q16 becomes six), with selective active reopening of only the re-keyed `n14-16`. Archive the old combined Q16 answer in revision9 verbatim and retain all historical revision1–9 archives plus every unaffected Q10/Q14/Q15 answer and acceptance. Full same-revision idempotence.
- Each hole is a 4-choice, one-answer question with meaningful wrong choices and a **progressive hint** that prompts arithmetic or absolute-value reasoning without directly disclosing its missing numeric result. Examples of allowed hint direction: “3と分母3の関係は？” for left multiplication, “掛けた結果から2を引くと？” for interiors, “絶対値は原点までの距離。負の値の距離は？” for left absolute; no completed hidden answer.
- The Q16 preview is a new `n14-q16` target, `awaiting-user`, with source and SHA-bound authentic screen shots. Q10/Q14/Q15 existing targets remain `accepted` and their updated revision/total-item metadata matches N14 rev10/39 without resubmitting any accepted block to the user.
- Preserve original figure `n14-f01`, four-mode contracts, CSS source isolation, progress/reset behavior and existing already-published main unmodified. No figure regeneration, broad refactor, permission to merge, publish or deploy.

## Scope / independent verification and §12B impact
- After separate user approval only, implement Q16 limited source mapping/flow/answer + required revision/archive/test + if actually necessary Q16-specific mobile layout. No changes to Q15 hint P-003, accepted Q10/Q14/Q15 maths, other N14 questions, Q16 original mathematical fact, source Word or modes.
- Independent arithmetic check: `3(-2/3)-2=-2-2=-4`, `|-4|=4`; `3(2)-2=6-2=4`, `|4|=4`; both satisfy `|3x-2|≤4`. Check in the QA suite without leaking evaluated results in the learner's unanswered state.
- Native real Chromiums for 320/390/1440 (normal N14 and marked Q16 review) must verify all 6 selections, no premature answer/hint, wrong→hint→retry, keyboard, section Q15→Q16 progression, no Katex error/clipping and reload history. Preserve real screenshots bound to the exact source SHA; show user only the concise mathematical arrangement they prefer. User Gate① review of **Q16 only** is required before visual acceptance.
- §12B root labels: Q10/Q14/Q15 bundled operation/reasoning **previously corrected & visually approved (NOT-AFFECTED)**; Q16 bundled two endpoint results and directly worked after-wrong hint **CONFIRMED** and targeted here; unseen N01–N13 similar root **UNVERIFIED**, not permission to mass-change. Gate② independent all-question/source/key audit still incomplete, Gate③ exact SHA complete playable full-app/user `総チェックOK` absent.
- STOP and return to REVISE-PROPOSAL if original formula segment, user-facing math, historical migration, or real viewport evidence requires a material change beyond P-001. No unapproved code or Pages/main/hosting work.

## User decision required
Approve **only this N14 Q16 original endpoint-substitution problem broken into six learner-computed values, with the two endpoint checks and progressive guidance**, preserving all prior acceptances? **NO IMPLEMENTATION BEFORE AN EXPLICIT APPROVAL OF P-001.**

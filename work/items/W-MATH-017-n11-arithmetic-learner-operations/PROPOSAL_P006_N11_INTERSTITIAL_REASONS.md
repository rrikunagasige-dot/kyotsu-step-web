# W-MATH-017 / P-006 — 式のまとまりの中へ必要な説明を挿入する
Status: PROPOSED — AWAITING USER'S EXACT APPROVAL
Command: CMD-WORK-001 修正 / Work state: REVISE-PROPOSAL
Date: 2026-10-21 JST
Branch: `work/W-MATH-017-p003-inline-prose-correction-20261021`
App source baseline: `c12c84dce3570c2c4e98dadff93a0ee0aeb57440` (Math textbook CI [39589056130](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39589056130) PASS)
Current PR: [#107](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/107), draft, not merged
User review trigger: user approved P-005 4-line equations, but observed that **some meaningful reasoning needs short prose BETWEEN equation rows**; then requested analysis of all N01–N14 and continuation. This is review feedback, **not exact P-006 approval**. P-005 retains original APPROVED status and code.

## Explicit goal and current problem
Preserve a **single mathematical derivation** in this exact row order, with no detached answer-choice formula cards:
```
(1) 3x-2 < 5
(2) 3x-2 + [2] < 5 + [2]
(3) 3x < [7]
(4) x < [7/3]
```
Math-first, not text-first. Current code puts all four formula rows in one `derivationId:'n11-q05-q06-chain'` group and gives reasons **only in a paragraph after row (4)**. Learners may not understand the transition to (3) or preservation of inequality direction on (4). User explicitly wants reasoning sentences only **where needed**, not after every equation.

## Exact learner-facing edit: N11-Q05→Q06 ONLY
Do not alter the four equations, math choices, answers, numbering, grading or source labels. Add exactly **two** short paragraph blocks inside the existing derivation group.

```text
  3x-2 < 5

  3x-2 + [2] < 5 + [2]

  両辺に同じ数を足しても、不等号の向きは変わらない。
  左辺では −2 と +2 が打ち消し合う。

  3x < [7]

  x の係数は正の3なので、両辺を3で割っても
  不等号の向きは変わらない。

  x < [7/3]
```

- First explanation block id `n11-p006-q05-cancel-explain`, `type:'paragraph'`, `derivationId:'n11-q05-q06-chain'`, parts exactly `T('両辺に同じ数を足しても、不等号の向きは変わらない。左辺では−2と＋2が打ち消し合う。')`. Insert **after** `n11-formula-05` only, **before** `n11-after-05`.
- Second explanation block id `n11-p006-q06-positive-explain`, same `type` and `derivationId`, parts exactly `T('xの係数は正の3なので、両辺を3で割っても不等号の向きは変わらない。')`. Insert **after** `n11-after-05` and **before** `n11-formula-06`.
- The after-proof paragraph `n11-after-06` remains **outside** the 4-line derivation; narrow its repeat: replace only its current duplicated sign/cancellation explanation by `T('求めたのは一つの値ではなく、不等式を満たす実数の範囲である。境界の値を元の式に代入して、含まれるか確かめよう。')`. This preserves Q07's reasoning without saying whether the boundary is included.
- The learning sequence shows first explanation only after BOTH additions in row (2) are answered, and second only after row (3)'s 7 is calculated. The second paragraph **must not** reveal `7/3`. No `確認` learner marker inserted.
- Do **not** add a new hole in explanatory prose; its sole purpose is explaining the already-completed transformation. Original item IDs remain `n11-wm017-q05-operation`, `n11-wm017-q05-balance`, `n11-05`, `n11-06`.
- Original "Q05 + Q06" as two Word source markers and 25 learner decisions in N11, 144 in 8-unit count unchanged. Since NO question/answer identity/choices or order changes, continue N11 revision8; preserve all revision1→8 migration and existing progress. Test as no-graded-semantic-change **and record a fresh exact source SHA for affected visual acceptance**. If later revision policy or a genuinely changed graded meaning requires revision9, treat that as a materially new proposal; do not sneak in a new progress migration.

## Technical scope and dependencies
Allowed only after explicit P-006 approval:
- `src/data/textbook/math/numbers/n11Lesson.ts`, specifically `q05Flow` 2 explanatory paragraphs + existing final paragraph string.
- Focused N11 `wMath017ProseIntegration.test.ts` assertions for ID, order, shared derivationId and no early revelation; existing review target tests/proofs only if newly required by these blocks (never rewrite unrelated accepted assertions).
- Existing GitHub Actions real-app screenshots at mobile 320/390 and desktop 1440; update **only** affected Gate① P-006 marks and image sheet after code commit; document the exact tested 40-hex SHA.
- Keep common renderer `TextbookUnitPage.tsx`, `newBatchGuidedSteps.ts`, global CSS, chapter assets/original figures/teacher Word, other N01–N14 lessons, N11 Q01/Q02-Q04/Q07–Q14, Math Practice and Physics untouched. No revision/ID/answer migration changes.
- `docs/MASTER_APP_LESSONS.md` already contains "one derivation, one visual group" and "blank must represent real thinking"; do not duplicate a universal rule before comparing overlaps and receiving approval for lesson updates.

## Required proofs and release gate
1. Golden code source: exactly four `formula` blocks and two interleaved `paragraph` blocks share `n11-q05-q06-chain`. First two explanation IDs unique.
2. Normal actual-app screenshot/Playwright: 320/390/1440, no horizontal overflow, one continuous chain, correct first/wrong/hint/retry, both 2 holes before 7, 7 before 7/3. After row2 is resolved the first explanation appears, after 7 is resolved second explanation appears. Wrong attempts do not progress. No answer leak in titles/hints/visible future rows.
3. Before/after progress: revision8 student histories and old rev1–7 archives remain byte-equivalent for question records; no accidental re-answer on a prose-only change.
4. Existing unaffected N11 previous accepted Q01/Q11/Q14 and original N14, math practice, physics modes regression unchanged. Real screenshots + numbered GitHub visual sheet to the user **only** for newly changed N11-Q05/Q06 block (§12A Gate①).
5. Independent Gate② source/maths/UX cross-audit of impacted lessons; new same-root suspects handled in separately exact-proposed Work. Gate③ frozen SHA **playable application link** and user's explicit end-to-end `総チェックOK` before completion/merge/publication. These gates cannot be skipped because technical CI passes.

## Risks, limits, and rollback
- Text before row2 could give away 2; therefore both reasons appear strictly *after* the prior answer. Wording avoids `7` and `7/3` before those holes.
- A paragraph with a different `derivationId` would split the frame. A paragraph without `derivationId` is rejected. No new global renderer behavior.
- Narrow code revert restores prior P-005 chain intact without affecting learner records; preserve previous screenshots and provenance.
- This **does not** authorize changes to all other N units, even though the user requested their analysis. Their exact candidate ledger is recorded separately.
- User has said “統合しよう”, recorded as future merge authorization intent, but current §12A Gate② and Gate③ remain unclosed. No premature GitHub merge.

Approval question: **Do you approve P-006 exact text/placement and limited N11 code changes above?** Upon approval continue without re-asking for previously accepted P-005 rows.

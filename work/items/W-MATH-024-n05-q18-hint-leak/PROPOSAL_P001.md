# W-MATH-024 / P-001 — N05 Q18 ヒントだけを修正する exact Proposal
Status: PROPOSED — USER APPROVAL REQUIRED
Date: 2026-10-22 JST
Command: CMD-WORK-001 修正

## 1. Original task and cause
Teacher Word N05 Q18: 「二つの条件を満たす組を選び、積を完成させよう。」 Starting expression `5x²−2x−3` and candidate factorization `(x+r)(5x+s)`. The existing erroneous hint tells a struggling student `r=−1、s=3`, the precise still-unanswered pair. The correct answer `(x−1)(5x+3)` itself is mathematically sound and must not change.

## 2. Exact one-line learner-visible correction (and nothing else)
Keep Q18 statement, lead, expression, four options, answer, feedback, layout and after-success text **byte-identical**.

**Old after-wrong hint** (replace):
> r=−1、s=3ならs+5rを計算して確認できる。

**New after-wrong hint** (proposed exact string):
> 例えば r=1、s=−3 なら、積は−3でも s+5r=2 となり、−2には一致しない。候補は積だけでなく、一次の係数も計算して選ぼう。

The example explicitly **rejects an incorrect pair**, showing how to test both constraints without stating the still-unanswered correct pair.

## 3. Exact scope and technical contract
- Allowed file: `src/data/textbook/math/numbers/n05Lesson.ts` **q:18 hint only**; keep all other data and original images byte-for-byte.
- Original N05 source marker count 20 and current N05 graded count/revision2 remain unchanged; existing valid completion/progress is preserved (hint copy does not change graded semantics). No schema, helper, CSS, migration, history erase, public app, main or other Work content edits.
- Dedicated focused Vitest: new hint exact text; no correct pair r=−1,s=3 revealed by hint; math: wrong example r=1,s=−3 has rs=−3, 5r+s=2, target 5r+s=−2; correct factor expansion yields 5x²−2x−3; all 20 stable IDs and choices unchanged. Add review-only target/screenshot harness **only if required** for existing §12A genuine numbered 320/390/1440 Gate①, with no changes to shared UI or other accepted markers; confirm precise supplemental evidence before choosing those minimal instrumentation files.
- Execute native CI at frozen SHA, capture authentic numbered N05 Q18 on phone and desktop including after-wrong hint and no premature answer, user Gate① `細部OK` / `要修正`. Subsequently revisit Gate② sibling impact and memory dedup. No Stage implementation until exact approval of this P-001.

## 4. Approval boundary
**No approval exists for W-MATH-024/P-001.** User's previous 「いいよ続けて」 was a Q08 image acceptance and Gate② audit continuation only; this new correction is uncovered by audit and requires its own affirmative response to the precise proposal. Alterations to suggested hint text => REVISE-PROPOSAL. A successful N13 CI/acceptance or user viewing the record cannot authorize N05 changes, merge, hosting or costs.

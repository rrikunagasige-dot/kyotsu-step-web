# Gate② P-004-R5: three revised learner operations independently reverified

Status: **3/3 repaired source cognitive tasks PASS, 12/12 current correct/wrong choices independently checked; all 123 source questions / 381 authored distractors now audited with no remaining known source-cognitive FAIL.** The previously pending R5 Gate① visual acknowledgement has since been received as user's 「ok続けて」 (2026-10-20 22:32 JST頃). Formal Gate② is now CROSS-VERIFIED in the new same-SHA `CROSS_BLOCK_AUDIT_FINAL_R5_20261020.md`; historical preacceptance text below is superseded by this note.
Date: 2026-10-20 JST.
Canonical original teacher Word 212,863 B SHA-256 \`93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa\`.
**Exact R5 code SHA**: \`ad77318b37e90b9c39150b14ee706283b3f59355\`. **NOT** the documentation/image commit SHA. [Full Math CI #39419920062](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39419920062) **SUCCESS**. [Real app 320/390 screenshot workflow #39419915311](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39419915311) **SUCCESS**; 18 complete R5-before/wrong/resolved files saved by commit \`0c8177880ee6d71a441d02da7655a04c8c5ce47c\` bearing exact test code SHA in message.

## Proof each changed response and 3 distractors

| ID | Original source mathematical and cognitive request | Independently checked new answer | Wrong #1 | Wrong #2 | Wrong #3 |
| --- | --- | --- | --- | --- | --- |
| N06-Q15 | Sum \`(2y+1)+(y−2)\`, compare x-coefficient in \`x²+(3y−1)x+(2y²−3y−2)\`, decide if factor-pair supports factoring | \`(2y+1)+(y−2)=3y−1\` **identically**; matches x coefficient 3y−1, so usable | \`3y+3\` is wrong sum and its matching conclusion false | \`3y−1\` correct sum but “does not match/cannot use” false | \`2y²−3y−2\` is factor product, not factor sum; “does not match/cannot use” does not satisfy requested computed sum |
| N08-Q10 | Interpret \`|a|=0\` as distance to origin and specify point location | By definition distance is nonnegative; 0 only if the point equals origin, \`a=0\` and located exactly at origin | \`a=0\` together with “away from origin” contradicts zero distance | \`a>0\` is strictly to the right, cannot occupy origin | \`a<0\` is strictly to the left, cannot occupy origin |
| N13-Q08 | Remove absolute value from \`|3x|=6\` into **two equations**, then solve both | Since 6>0, \`3x=6 OR 3x=−6\`; dividing by 3 gives \`x=2 OR x=−2\`. Each root substituted gives \`|3x|=6\` | Correct equations, wrong final \`x=±6\` (missing ÷3) | Uses AND, which asks \`3x=6\` and \`3x=−6\` simultaneously, impossible, despite listing roots | Correct disjunctive equations but omits negative root |

The three modified choice sets each consist of 1 uniquely correct two-clause choice + 3 distinct task-false distractors. These are **source-asked operations**, not merely computational equivalence. All original \`lead\`, \`expr\`, wrong-feedback \`hint\`, \`after\` and question IDs preserved, only \`prompt\`/\`answer\`/\`wrong\` changed. Final values agree with earlier code; no publisher answer booklet was provided.

## Progress + layout regression

- R5 N06 rev2→3: v1 history first respects old P004 reopening of n06-08, then v2→v3 archives v2 and reopens **n06-15 only**. Existing unaffected responses remain, old completions retained historically.
- R5 N08 rev2→3: same, old P004 n08-05 then new n08-10 only.
- R5 N13 rev1→2: archives historical v1 and reopens **n13-08 only**.
- \`effectiveTextbookProgress\` migration idempotent on already-current records, stable previous answered IDs, prior archives retained. Targeted unit tests and full CI PASS.
- \`textbookDisplayLines\`: n06-15, n08-10, n13-08 split answer and all 3 wrong candidates *for display only* on \`,\\quad\`; raw grading strings are unchanged by rendering. Unit KaTeX and browser Playwright 320px/390px tests enforce two non-clipped rows both in choice panel and resolved answer.
- All 127 source-guided operations, 24 repaired wrong→hint→retry→right→reload scenarios for 320/390px and existing math/physics/practice regression **PASS** on exact code SHA. 18 new screenshot filenames=3 IDs×2 widths×3 states. Directly inspected three 320px before and three resolved screenshots; pair of key equations was visible.
- The older original-source full audits [51 prompts/153 wrong](./GATE2_PHASE2_INDEPENDENT_KEY_DISTRACTOR_AUDIT_20261020.md) and [72 prompts/228 wrong](./GATE2_PHASE3_REMAINING_SOURCE_DISTRACTOR_AUDIT_20261020.md) remain immutable **pre-correction** evidence with 3 FAIL-C rows. This addendum changes *only* their three formerly failing corrected entries to PASS at current code SHA; every previously inspected unaffected option is unchanged.
- Total at current SHA: **123/123 source prompts mathematically/source-operationally PASS, 127/127 selectable tasks, 381/381 wrong-choice candidate entries inspected** (nine new distractors were independently reaudited). 53 separate algebra claims from Phase-2 and earlier 48 overlapping claims remain reference checks, not to be summed as 101 distinct unique original questions.

## Gates and prohibition

**Gate①**: Earlier eight-unit initial and ten-repair reviews remain accepted. Consolidated original 11 screenshots (P004-R2/R3/R4) and **three NEW R5 screenshot triptychs** are present in same gallery. The user's R5 specific new screen sign-off **not yet obtained**, so do not falsely mark Gate① fully closed. **Gate② mathematical content and cross-mode code verification PASS on current SHA**, but work's formal 3-gate sequence not advanced to Gate③ until the user approves the updated visual review and Work records close. **Gate③ not ready**: no source-SHA-verified playable real app URL + user's all-through play. Do not merge Draft PR #101, update public Pages/Vercel, change any billing or imply deployment permission.

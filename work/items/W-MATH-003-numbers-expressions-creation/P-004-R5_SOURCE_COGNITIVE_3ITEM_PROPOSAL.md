# W-MATH-003 / P-004-R5 — Original-Word cognitive fidelity on exactly three items

Status: **APPROVED / IMPLEMENTED / FULL CI PASS / REAL IMAGE EVIDENCE SAVED**
Date: 2026-10-20 JST
Command: CMD-WORK-001「修正」, correction-first §12B, under existing accepted Gate①→Gate②→Gate③. Preserve all separately completed P-004 / R1 / R2 / R3 / R4 approvals and regression.
Source: teacher Word 212863 B SHA-256 \`93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa\`. Audited code SHA: \`61498366f2bed5324326e55d09b8f5c984a1a714\`, Draft PR #101. Independent full row-by-row evidence: \`GATE2_PHASE2_INDEPENDENT_KEY_DISTRACTOR_AUDIT_20261020.md\` (N08/N11/N13/N14 51 markers/153 wrong options) + \`GATE2_PHASE3_REMAINING_SOURCE_DISTRACTOR_AUDIT_20261020.md\` (N04/N05/N06/N07 72 markers/228 wrong options, including N04-Q01's 5 local interactions). All **123 source question markers, 127 decisions, 381 wrong candidates** have been inspected, with **three** confirmed final-value-correct but source-cognitive-incomplete rows. 53 new SymPy independent claims PASS; previous 48 claims overlap and are not additive.

## Root cause A — complete mathematical answers do not prove source-requested reasoning

| ID | Exact Word-demanded learner operation | Current app confirmed deficiency | Required response |
| --- | --- | --- | --- |
| N06-Q15 | 「得られた二因子の和を調べ、**全体の因数分解に使えるか確かめよう。**」 | \`prompt\` asks whether the sum matches but \`answer\` only \`3y-1\`. After-answer prose says it matches, but learner need never select the judgment | Pair the computed sum **and** matching/usefulness conclusion |
| N08-Q10 | 「\`|a|=0\` になるのはどんなときか。**数直線上の意味で説明しよう。**」 | \`prompt\` and \`answer\` check only \`a=0\`; origin-based explanation appears only in hint/after prose | Pair \`a=0\` **and** point-at-origin reasoning |
| N13-Q08 | 「\`|3x|=6\` を**絶対値を使わない条件にし、解を求めよう。**」 | Only final roots \`x=±2\` selectable. Lead instructs splitting but learner never chooses the two equations \`3x=±6\` | Pair both intermediate equations **and** final solutions |

All three existing final numerical answers are **true**, not arithmetic faults. Change only the pedagogical response slots specified below.

## Exact per-item before→after answer, prompt, and three distractors (proposed)

The \`\\quad\` separator is a **display delimiter only**, allowing the already existing \`textbookDisplayLines\` to present the two decisions in two fully visible math rows at 320/390px. Raw option strings remain the matching/grading authority.

### N06-Q15 — file \`src/data/textbook/math/numbers/n06Lesson.ts\`
Keep current lead, original expression \`(2y+1)+(y-2)\`, original wrong-feedback hint and after explanation.
- New prompt: \`和を計算し、元のxの係数に一致して因数分解に使えるか判断しよう。\`
- Correct: \`3y-1,\\quad\\text{一致する（使える）}\`
- Wrong 1: \`3y+3,\\quad\\text{一致する（使える）}\` — arithmetic and matching error
- Wrong 2: \`3y-1,\\quad\\text{一致しない（使えない）}\` — correct value, false cognitive conclusion
- Wrong 3: \`2y^2-3y-2,\\quad\\text{一致しない（使えない）}\` — swaps the two factors' product for their sum, false conclusion

### N08-Q10 — file \`src/data/textbook/math/numbers/n08Lesson.ts\`
Keep current lead \`原点との距離が0になる点は数直線のどこにあるだろう。\`, original \`|a|=0\` expression, hint and after explanation.
- New prompt: \`aの値と、数直線上で距離が0になる理由を組にして選ぼう。\`
- Correct: \`a=0,\\quad\\text{原点と同じ位置にある}\`
- Wrong 1: \`a=0,\\quad\\text{原点から離れている}\` — numeric value true, reason false
- Wrong 2: \`a>0,\\quad\\text{原点と同じ位置にある}\` — strictly right of origin, reason false
- Wrong 3: \`a<0,\\quad\\text{原点と同じ位置にある}\` — strictly left of origin, reason false

### N13-Q08 — file \`src/data/textbook/math/numbers/n13Lesson.ts\`
Keep current lead \`|3x|=6の中身は3x全体。正と負の二つの等式へ分け、3で割ろう。\`, original expression/hint/after.
- New prompt: \`絶対値を外した二つの方程式と、得られた解を組にして選ぼう。\`
- Correct: \`3x=6\\;\\text{または}\\;3x=-6,\\quad x=2\\;\\text{または}\\;x=-2\`
- Wrong 1: \`3x=6\\;\\text{または}\\;3x=-6,\\quad x=6\\;\\text{または}\\;x=-6\` — forgets divide by 3
- Wrong 2: \`3x=6\\;\\text{かつ}\\;3x=-6,\\quad x=2\\;\\text{または}\\;x=-2\` — incorrectly uses AND for incompatible equations
- Wrong 3: \`3x=6\\;\\text{または}\\;3x=-6,\\quad x=2\` — drops the negative root

**Approval boundary**: only these **3 \`prompt\` + 3 \`answer\` + 9 \`wrong\` strings** and the three unit \`revision\` fields plus the narrow progress-migration and display-only \`textbookDisplayLines\` cases/tests explicitly listed below. No changes to \`lead\`/original expressions/hint/after/figure or other question text, no new learner question ID. If deeper source text change is necessary, REVISE-PROPOSAL before proceeding.

## Exact progress-history preservation

Changing the accepted answer key means previously "correct" saved decisions are **not proof of the new two-part reasoning**, so a selective review version bump is required:
- N06 \`revision 2→3\`: archive **all** prior v2 attempts; reopen exactly \`n06-15\`, retain all unchanged answers. For a saved v1 record, first apply the **already approved P-004 v1→v2** transition that reopens \`n06-08\`, then the new v2→v3 transition; retain both historical archives.
- N08 \`revision 2→3\`: likewise reopen exactly \`n08-10\` and preserve the earlier P-004 v1→v2 \`n08-05\` correction history for v1 users.
- N13 \`revision 1→2\`: preserve v1 archive, reopen exactly \`n13-08\`, retain all unrelated answered items, \`completedAt\` removed from active current version while retaining historical completion.
- Reuse **existing** \`src/domain/textbook.ts::effectiveTextbookProgress\` archive/reopen pattern. No storage schema/API rewrite, no other mode migrations, no user data loss, no global reset. Check v1→v3 and v2→v3 (N06/N08), v1→v2 (N13), idempotent repeated reload, unchanged correct answers unaffected.

## Display-only math and verification (prevent repeating earlier P-004-R2 layout faults)

- Only for \`n06-15\`, \`n08-10\`, \`n13-08\` in existing \`src/domain/textbookDisplayLines.ts\`, split on the **literal \`,\\quad\` delimiter** to show two distinct complete KaTeX lines; do not change canonical answer stored value or use a global CSS/display helper rewrite. Keep R3 N07-Q09 and R4 N11-Q13/N14-Q14/N14-Q15 formatter behavior unchanged.
- Unit tests: independently verify final key and each three wrong replies for all three original source operations, all 4×3 choice strings are distinct, KaTeX-valid and losslessly reassembled. Confirm original 123 question markers→127 operations, nine original figure PNG hashes and all older corrected choices unchanged.
- Real browser E2E at 320px/390px for **each new three**: 2 distinct entire math rows in panel and in resolved card with per-row \`scrollWidth <= clientWidth+1\`; wrong→close→reopen→hint→right answer→reload; progress upgrade preservation.
- Whole existing Math Textbook CI + 127 source-guided interactions + Math Practice / Physics Textbook regressions, then genuine screenshots (3 items×2 phone widths×3 states) anchored to one exact implementation SHA, and **one consolidated Gate① user visual review**; never automatically declare Gate① user PASS or Gate② global PASS because CI succeeded.

## Protected and remaining steps

No touch to original teacher Word/DOCX, other modes, math sets, physics, practice, existing original question ID/figure binaries, prior accepted initial eight-unit Gate①, PR #101 merge, \`main\`, public Pages, Vercel or billing. No invented deployment mechanism. For remaining Gate②, replay source-to-key/cognitive audit for the three amended answers and verify 381 alternatives still all pedagogically false under the **current amended option list**, plus source-order/no-premature-revelation cross-audit at tested SHA.

**Approval update 2026-10-20:** Earlier 「おけ続」 was Gate②-only, but the subsequent user message 「続けて」 was given **directly in response to the explicit approval question naming this exact P-004-R5 three-item proposal**. It authorizes the exact displayed three-item R5 repair, no additional scope. Main/public deployment remains separate. Existing P-004/R1/R2/R3/R4 approvals remain valid.

## Verified completion on approved source (2026-10-20)
- Exact source SHA `ad77318b37e90b9c39150b14ee706283b3f59355`: all 3 compound choices/prompts, 9 wrong alternatives, three narrow revision changes and lossless selective history migration implemented. No extra learner blocks changed.
- [Full Math CI #39419920062](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39419920062) **SUCCESS**; [real 320/390 screenshot #39419915311](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39419915311) **SUCCESS**; 18 genuine screenshots committed at `0c8177880ee6d71a441d02da7655a04c8c5ce47c`.
- Independent postrepair Word math/reason/distractor result: [3 repaired questions + 9 wrong choices rechecked](./GATE2_P004_R5_POST_REPAIR_INDEPENDENT_AUDIT_20261020.md) PASS, combined unchanged original 123/381 full inventory PASS. Human Gate① three new screens still await explicit fine-review acknowledgment; Gate③ not ready; do not merge/deploy.

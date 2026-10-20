# W-MATH-011 / P-001 — N11「不等号の性質を導く」Q01〜Q04 詳細修正案

**Status: PROPOSED / DESIGN ONLY / NOT YET APPROVED FOR IMPLEMENTATION**
**Date:** 2026-10-20 (JST)
**Command:** CMD-WORK-001「修正」, governance/INSTRUCTION_DICTIONARY.md / WORK_SYSTEM.md §§12A–12B and docs/MASTER_APP_LESSONS.md §52 small-block preflight.
**Target:** rrikunagasige-dot/kyotsu-step-web, Draft PR #101, work/W-MATH-003-p003-r1-n04-n14-batch-20261019. Observed current documentation HEAD 71b226846484624dfc59657f23b9ccda3c03d1ae. **Frozen learner code** ad77318b37e90b9c39150b14ee706283b3f59355 (N11 revision 3). Main 537c3cbf28d40f45228d8a0c4bdd20327136aa93. No learner code changes in this proposal.
**Source:** Teacher's \`01_数と式_教科書モード_対話段階導入版_v2(3).docx\`, 212863 B, verified previously source SHA-256 \`93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa\`; N11 original markers Q01–Q04, numbered publication pp. 27–28 / doc pages 36–37. Source OMML math is not completely represented in extracted paragraphs; formula details independently compared with original-preserving N11 app code; publisher solution book not supplied.

## 0. Existing rules, not new lessons

Actual original \`MATHEMATICS_TEXTBOOK_MODE_MASTER_SKILL_v1(3).md\` retrieved from authorized Library, read: §§1–5 (natural question/prose), §§7–9 (thinking nodes), §§10–13 (derivation, symbol meaning, answer leakage), §§15–16 (fading and natural transitions), §§18–19 (production/final audit); approved \`subjects/mathematics/textbook/SPEC.md\` used as candidate summary only, \`docs/MASTER_APP_LESSONS.md\` §§7,8,11,18,43,51,52,53,54; historical \`W-MATH-004/INEQUALITY_COGNITIVE_AUDIT.md\` and its approved P-002 targeted N12 **in-equation token decisions**. No amendment to any of these lessons is needed.
**Pedagogical standard**: concrete problem → observation → derive meaning → property/proof → another example, with coherent black-body textbook prose and meaningful formula-local student operations. No formula just because “another hole is needed”.

## 1. Root cause and exact frozen symptom

| Existing source question | Current code / verified defect | Existing lesson signature | Result |
| --- | --- | --- | --- |
| N11-Q01 | Before asking \`-2>-5\`, lead literally declares that number-line positions “逆転する”; introductory prose states preserving/reversing operation categories. | Answer leakage, unknown property before evidence | **CONFIRMED**; actual canonical N11-F01 is legitimate number-line observation (2,5 and -2,-5), no “>” answer is printed in image |
| N11-Q02 | App choice is \`b-a\`, after text declares add-invariance. Original asks calculate \`(b+c)-(a+c)\` **and compare it to the original difference**. No separately active interpretation of positivity before entering general law. | Missing reasoning/meaning operation | **CONFIRMED COGNITIVE GAP**; arithmetic value itself true |
| N11-Q03 | The lead itself supplies \`bc-ac=c(b-a)\`. Single text choice presents all cases \`c>0,c<0,c=0\` at once, so learner does not construct distributive factor or separately infer sign. | Full completed law selected in place of proof | **CONFIRMED COGNITIVE GAP** |
| N11-Q04 | Lead describes “multiply both sides by −1/5, *then* add 3”; selected pair \`-a/5>-b/5\` AND \`3-a>3-b\` actually belongs to **two distinct branches**. Truly sequential operations would produce \`3-a/5>3-b/5\`. | **CONFIRMED CAUSAL/MATH EXPOSITION ERROR**; both selected comparisons are individually true, but wrongly related to the lead operation |

Earlier Gate② math-key PASS was correct about truth of final strings, but not complete proof of initial explanation. This new user-reported defect returns the affected N11 educational area to correction status and suspends its Gate③. No silent changes to N12/N14 or other modules.

## 2. Proposed source/interaction coverage

Preserve original **four source markers Q01–Q04 and four stable IDs** \`n11-01…n11-04\`. Add exactly **five meaningfully distinct local decisions**, not new original questions:

| Source | Stable new/reused item ID | Learner's independent action | Original source treatment |
| --- | --- | --- | --- |
| Q01 | \`n11-01\` (RETAIN answer) | Observe positions −2,−5 on the original N11-F01 and choose comparison | Keep Q01 one stage |
| Q02 | \`n11-02\` (RETAIN answer) | Expand/cancel \`(b+c)-(a+c)\` to \`b-a\` | Existing computational stage remains |
| Q02 | \`n11-wm011-q02-compare\` **NEW** | Infer from the positive unchanged difference the comparison \`a+c<b+c\` and its *reason* | New conclusion after the source Q02 calculation |
| Q03 | \`n11-wm011-q03-factor\` **NEW** | Distributively factor \`bc-ac\` into \`c(b-a)\` inside the formula | Restore proof prerequisite |
| Q03 | \`n11-wm011-q03-positive\` **NEW** | From c>0 and b−a>0 infer positive product and \`ac<bc\` | First sign case |
| Q03 | \`n11-03\` (REUSE ID, **REVISE answer meaning**) | From c<0 infer negative product and \`ac>bc\` | Second sign case |
| Q03 | \`n11-wm011-q03-zero\` **NEW** | Determine what multiplying by 0 does and why it is no longer strict | Third sign case and 0-divisor exclusion |
| Q04 | \`n11-wm011-q04-fraction\` **NEW** | First **independent branch**: apply negative 1/5 and explain flip | First half of original Q04 |
| Q04 | \`n11-04\` (REUSE ID, **REVISE answer meaning**) | Second independent branch: apply -1 then +3 to obtain \`3-a>3-b\` | Second half of original Q04 |

So **9 learner choices for 4 source questions** (up from 4); N11 total 14 original labels → **19 active decisions** (up from 14); full eight-unit guided total **127→132**, 123 original source labels unchanged, 9 original PNGs unchanged. Add no meaningless confirmation choice after the theorem has already been proved.

## 3. Student-facing exposition and staged teaching script (proposed)

### 3.1 Q01: concrete counterintuition; original N11-F01 BEFORE first question

**導入本文:** 
「\`2<5\` の両辺から同じ2を引けば \`0<3\`、4倍すれば \`8<20\` となる。では、両方に負の数を掛けても、左と右の並びは同じだろうか。数直線上の位置から調べよう。」

**Keep original N11-F01** (unchanged bytes, displayed before Q01; it shows the points but does not write \`-2>-5\`). **花子 (optional one sentence)**:「符号を変えたあとの二つは、数直線のどちら側に並ぶだろう。」

\`n11-01\` must visibly ask comparison of \`-2\` and \`-5\`, **not announce “逆転” in the lead**.
- Candidate \`-2>-5\` **correct** (same previous answer value);
- \`-2<-5\` wrong order, \`-2=-5\` false equality, \`2>-5\` answers different pair.
- Only **AFTER answer**: \`-2\` is to the right of \`-5\`; this observed reverse order motivates general \`a<b\` proof, but do **not** state the full general negative-multiplier theorem before Q02/03.

### 3.2 Q02: additive preservation from **difference**, not memorized rule

**本文:** 「\`a<b\` とは、右側の数のほうが大きく、差 \`b-a>0\` ということだ。両辺に同じ \`c\` を足したら、差はどうなるだろう。」
- Keep \`n11-02\` formula-local response: \`(b+c)-(a+c)=\boxed{b-a}\` (exact choice string unchanged \`b-a\`). Other original wrong candidates retained if safe.
- After compute: 「\`c\` と \`-c\` が消える。差が元の正の値と等しいとき、大小はどうなる？」
- **New \`n11-wm011-q02-compare\`** choose \`a+c<b+c\` *because* unchanged difference \`b-a>0\`; response must include both conclusion and reason in one coherent option, not a separate “yes” answer.
- Then formalize proved addition/subtraction property in **black normal prose**: 「同じ数を足しても引いても、差は変わらず不等号の向きも保たれる。」

### 3.3 Q03: multiplier sign, derive every case (no circular proof)

**本文:** 「掛け算の場合も左右の『差』を見る。掛けたあとの右−左は \`bc-ac\` である。分配法則を使って共通の \`c\` をくくろう。」
- **New local factor slot** \`n11-wm011-q03-factor\`: \`bc-ac=\boxed{c}(b-a)\`, choices represent symbolic factor, don't display completed \`c(b-a)\` before answer. After slot \`bc-ac=c(b-a)\`. Already learned **sign of product** and \`b-a>0\`, not the inequality multiplier theorem itself, justify each case:
- **New positive branch** \`n11-wm011-q03-positive\`: if \`c>0\`, product \`c(b-a)>0\`, so \`ac<bc\`.
- **Existing \`n11-03\` changed to negative branch**: if \`c<0\`, product \`c(b-a)<0\`, so \`ac>bc\`; the causal chain explicitly shows that \`bc-ac<0\` means the right side is **smaller**.
- **New zero branch** \`n11-wm011-q03-zero\`: if \`c=0\`, \`ac=bc=0\`. The strict difference disappears and multiplying by zero does not preserve a strict inequality.
- **Only once all 3 branches are done**, write mathematical theorem (visible black body, not another passive selection):
  \`\`\`
  a<b, c>0  => ac<bc
  a<b, c<0  => ac>bc
  a<b, c=0  => ac=bc
  \`\`\`
  Distinguish division by nonzero c from multiplication: \`c=0\` cannot be a divisor. **Proof uses sign-of-product and distributivity as previously learned facts**, not the property being proved.

### 3.4 Q04: independent transfer, not incorrect sequential operations

**本文:** 「証明した性質を、\`a<b\` から作れる二つの式で使おう。次の二つは**別々の変形**である。」
- Independent branch A: \`a<b \Rightarrow a/5<b/5 \Rightarrow -a/5>-b/5\`.
  **New \`n11-wm011-q04-fraction\`** gated inequality/why decision: negative \`1/5\` flips direction. Do not pre-print \`-a/5>-b/5\` before its active decision.
- Independent branch B: \`a<b \Rightarrow -a>-b \Rightarrow 3-a>3-b\`.
  **Existing \`n11-04\` changed** to select \`3-a>3-b\` only, from the already visible intermediate \`-a>-b\`; this is a positive-3 addition after independent negative-1 multiplication, NOT after the negative-fifth branch.
- After both: 「\`-\frac15\` を掛ける変形と、\`-1\` を掛けて3を足す変形は独立。もし本当に前者に3を足すなら、\`3-a/5>3-b/5\` であり、現在の誤った連続説明とは異なる。」
- Use a compact two-branch proof layout; **no extra heading stack**, distinguish its “確認” from Q02/03 “導出/証明” visually.

## 4. Exact authored response choices, error diagnosis and display type

Each *active* choice has three distinct distractors. Formula/text type may be locally chosen to meet 320px; raw answer string fixed only after proposal approved. All “wrong” alternatives below are under original assumption \`a<b\` and appropriate c sign; no mathematically true weaker conclusion is used as a distractor.

| Stage | Correct content that must be selectable | Three deliberately wrong contents (why wrong) |
| --- | --- | --- |
| n11-01 | \`-2>-5\` | \`-2<-5\` (reversed); \`-2=-5\` (not equal); \`2>-5\` (answers a different question) |
| n11-02 | \`b-a\` | \`b-a+2c\` (fails cancellation); \`b-a-c\` (c remains); \`a-b\` (reversed subtraction) |
| NEW q02-compare | \`a+c<b+c; 差は正のまま\` | \`a+c>b+c; 差は負になる\`; \`a+c=b+c; 差は0\`; \`a+c>b+c; 差は正のまま\` (inconsistent relation) |
| NEW q03-factor | \`c\` in \`bc-ac=□(b-a)\` | \`-c\` (sign error); \`c^2\` (extra c); \`1\` (missing c) |
| NEW q03-positive | \`ac<bc; bc-ac>0\` | \`ac>bc; bc-ac<0\`; \`ac=bc; bc-ac=0\`; \`ac<bc; bc-ac<0\` (contradictory reason) |
| n11-03 REVISED | \`ac>bc; bc-ac<0\` for \`c<0\` | \`ac<bc; bc-ac>0\`; \`ac=bc; bc-ac=0\`; \`ac>bc; bc-ac>0\` (wrong sign reason) |
| NEW q03-zero | \`ac=bc=0; 元の厳密な大小は失われる\` | \`ac<bc; そのまま\`; \`ac>bc; 反転\`; \`ac=bc=0; 元の不等号を保つ\` (wrong interpretation) |
| NEW q04-fraction | \`-a/5>-b/5; 負数倍なので反転\` | \`-a/5<-b/5; 保存\`; \`-a/5=-b/5; 等号になる\`; \`-a/5>-b/5; 正数倍なので反転\` (result true, reasoning false) |
| n11-04 REVISED | \`3-a>3-b\` | \`3-a<3-b\`; \`3-a=3-b\`; \`3+a>3+b\` (the last contradicts \`a<b\`) |

**Canonical accepted answer strings / wrong alternatives are fixed below**, not invented during implementation; these are raw LaTeX/UI values *before TypeScript source escaping*. The original \`n11-01\` and \`n11-02\` correct/wrong value strings are unchanged from the frozen app. If a mathematical answer is paired with a reason, \`,\quad\` is a losslessly split, two-line **display** delimiter only. The raw entire string remains the scoring authority. Do not edit any choice value without a revised exact proposal.

\`\`\`text
id = n11-wm011-q02-compare
answer = a+c<b+c,\quad\text{差は正のまま}
wrong1 = a+c>b+c,\quad\text{差は負になる}
wrong2 = a+c=b+c,\quad\text{差は0}
wrong3 = a+c>b+c,\quad\text{差は正のまま}

id = n11-wm011-q03-factor
answer = c
wrong1 = -c
wrong2 = c^2
wrong3 = 1

id = n11-wm011-q03-positive
answer = ac<bc,\quad bc-ac>0
wrong1 = ac>bc,\quad bc-ac<0
wrong2 = ac=bc,\quad bc-ac=0
wrong3 = ac<bc,\quad bc-ac<0

id = n11-03  [REVISE old key semantics; reopen this old completion]
answer = ac>bc,\quad bc-ac<0
wrong1 = ac<bc,\quad bc-ac>0
wrong2 = ac=bc,\quad bc-ac=0
wrong3 = ac>bc,\quad bc-ac>0

id = n11-wm011-q03-zero
answer = ac=bc=0,\quad\text{元の厳密な大小は失われる}
wrong1 = ac<bc,\quad\text{そのまま保つ}
wrong2 = ac>bc,\quad\text{逆転する}
wrong3 = ac=bc=0,\quad\text{元の不等号を保つ}

id = n11-wm011-q04-fraction
answer = -\frac a5>-\frac b5,\quad\text{負数倍なので反転}
wrong1 = -\frac a5<-\frac b5,\quad\text{向きを保つ}
wrong2 = -\frac a5=-\frac b5,\quad\text{等号になる}
wrong3 = -\frac a5>-\frac b5,\quad\text{正数倍なので反転}

id = n11-04 [REVISE old key semantics; reopen this old completion]
answer = 3-a>3-b
wrong1 = 3-a<3-b
wrong2 = 3-a=3-b
wrong3 = 3+a>3+b
\`\`\`

**Answer leak and exact visual preflight:** \`n11-wm011-q02-compare\` is AFTER the arithmetic \`n11-02\`, not before; \`bc-ac=c(b-a)\` is AFTER \`q03-factor\`; never render \`bc-ac>0\` or \`ac<bc\` until the positive branch is answered, never \`bc-ac<0\` or \`ac>bc\` until the negative branch, and never \`3-a>3-b\` until \`n11-04\` is completed. Only the current unresolved choice and previously solved line(s) are visible. Recheck every answer/three negatives with KaTeX, real \`getTextbookChoices\` strong/medium/light choice-count policy and mobile 320px screenshots.

## 5. Fire diagram / order / answer and figure gate

\`\`\`
Current original N11-F01 (number line: 2,5,-2,-5; NO > answer printed)
    ↓
Q01 [-2 ? -5] (original n11-01) → show case-specific observed ordering
    ↓
Q02 a<b ⇒ b-a>0 → [(b+c)-(a+c)=□] (original n11-02)
    ↓
Q02 [a+c ? b+c, and why] (NEW) → prove additive invariance
    ↓
Q03 factor [bc-ac=□(b-a)] (NEW, prerequisite distributivity)
    ↓
Q03 [c>0 ⇒ sign and inequality] (NEW)
    ↓
Q03 [c<0 ⇒ sign and inequality] (original n11-03 REVISED)
    ↓
Q03 [c=0 ⇒ equality; cannot divide by 0] (NEW)
    ↓
Formal property paragraph/proof closes (not prematurely before nodes)
    ↓
Q04 BRANCH A a<b → a/5<b/5 → [-a/5 ? -b/5] (NEW)
    ↓
Q04 BRANCH B a<b → -a>-b → [3-a ? 3-b] (original n11-04 REVISED)
    ↓
Existing N11 Q05–Q14 untouched (new cross-unit proof result usable later)
    ↓
Existing original N11-F02 remains after Q10, NOT before Q05–10
\`\`\`

- N11-F01 original **two number lines** were independently visually inspected: top x=0,2,5; bottom x=−5,−2,0. It provides the observation, not the completed inequality. Keep before Q01; its accessibility text must NOT supply \`-2>-5\`.
- N11-F02 original summary drawing reveals endpoint x=7/3 and x=−1, so keep *only* after Q10. No new figures in P-001.
- First section retains **one natural title/intro**, not nine headings; show tiny consistent "例題→導出→確認" distinctions, maintaining black concept text.

## 6. Version-safe implementation impact (on approval only)

- **Only modify N11 Q01–Q04 first-group text/readingFlow/choices + targeted test and migration code**. Keep existing source-to-item map for all 14 original Word markers, and stable source Q05–Q14 active item ID, wording, answer/wrong list, figure image SHA/timing, other 7 newly created units, existing N12 26-stage inline design, N13/N14, Math Practice/Physics, original Word, build/deployment configuration untouched.
- The current \`makeReviewSteps('n11',...)\` automatically assumes one original marker = one answer; adding five gated local nodes without global helper changes requires a **strictly scoped N11-local first-group readingFlow composition** with exactly these five new \`reviewItem\` IDs. Keep Q05–Q14 generator output byte-identical in item meanings and heading hierarchy; no global content-generation refactor. If this cannot be achieved within bounded N11, stop and request revised implementation scope.
- **N11 revision 3→4**. \`n11-01\` and \`n11-02\` answers unchanged; preserve valid old completion records while new local nodes await answers. Existing \`n11-03\` and \`n11-04\` have new answer meanings, so selectively reopen these two in active v4 progress; archive all prior v3 attempts/resolution/completedAt, retain unaffected Q05–Q14 and prior archives. For v1 and v2 learners: sequentially honor existing **v1→v2 n11-05** and **v2→v3 n11-06/08/09/13** selective reopen migrations *before* v3→v4; never mark new nodes complete from reused old answers, never global-reset. Record old historical completion separately, active v4 completedAt only after all 19 items resolved, migration idempotent and safe after reload. Migration logic MUST be unit tested before browser rollout.
- Add direct tests for all original 14 source markers → 19 N11 decisions, preserving preexisting all-seven-other units sum 127→132, validated error feedback, unique normalized choices, formula-token display, source-figure gating, 320/390 width/keyboard, existing N11 answer history and cross-mode regressions.
- Apply approved §12B impact sweep **only for this root cause** to N12/N13/N14 (same inequality chain), mark CONFIRMED/NOT-AFFECTED/UNVERIFIED per exact code SHA, propose separate fixes if confirmed. P-001 does **not** authorize editing Q05–Q14/N12/N13/N14.
- Because user returned from previous Gate②/③ state citing inadequate pedagogy, **invalidate only affected N11/Q01–04 prior cross-audit/visual acceptance at new SHA**, preserve unrelated PASS evidence with explicit version provenance. Perform existing Gate① new changed screenshot review for this small block, then Gate② relevant cross-block audit and Gate③ verified live matching build + user whole-play (currently on hold). No merge, hosting, release or paid Vercel without separate explicit approval.

## 7. Acceptance/Stop

This is **a design document only**. No course content or grading/progress code changed, no lesson canon altered. Implementation is separately authorized only by the user's direct explicit acceptance of **this exact P-001**, including 5 meaningful local decisions and safe revision 4 migration. Before each original Q01/Q02/Q03/Q04 change, re-run approved small-block preflight, anchor source, purpose, older approvals and phone display; report any materially changed scope with \`REVISE-PROPOSAL\` and STOP.

**User gate:** 「N11-Q01〜Q04のP-001修正案を承認する」 or concrete revisions. A general request to continue investigation is not merge/publication permission. This proposal does not include any extra lessons and does not weaken earlier governance rules.

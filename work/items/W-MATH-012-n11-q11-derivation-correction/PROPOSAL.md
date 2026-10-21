# W-MATH-012 / P-001 — N11-Q11「展開→移項→整理」の導き修正案
Status: APPROVED
Approval evidence: user replied 「続けて」 directly to the exact W-MATH-012/P-001 single-question approval request. Approved exact implementation succeeded on tested code SHA 74b73ad275b8aced7ccf99c3ef0ffc943f02d208; Q11 visual Gate① human acceptance still pending.
Date: 2026-10-21 JST; linked to W-MATH-011 Gate② root-cause impact [ledger](../W-MATH-011-n11-inequality-derivation-correction/CROSS_BLOCK_AUDIT_N11_P001_20261021.md), CMD-WORK-001 and existing §12B.
Frozen code SHA `2ebdf7fbb0c7387ae05753c286b3c457da74e17c`; N11 revision 4. Draft PR #101 only. Source: original teacher Word, N11-Q11, equation `3(2x+3)\ge10x-17`. Its single current learner choice directly answers `-4x\ge-26` after **three hidden nontrivial operations**; current formula, keys and distractors mathematically valid but insufficiently taught for first expanded complex inequality. No changes to canonical lessons necessary.

## Exact objective and smallest correction block

**ONE original N11-Q11**, preserve source question label and stable existing item `n11-11`. Teach three separate justified stages; add **two** new item IDs locally inside Q11 before the original `n11-11`:
1. `n11-wm012-q11-expand`: given `3(2x+3)\ge10x-17`, distribute 3; show `[choice]\ge10x-17`. Correct choice `6x+9`; authored wrong `6x+3` (3 not multiplied into 3), `2x+9` (3 not multiplied into 2x), `6x+6` (constant wrong).
2. `n11-wm012-q11-xcoef`: from the *already solved* `6x+9\ge10x-17`, subtract 10x on **both** sides; display `[choice]x+9\ge-17`. Correct choice `-4` because 6−10=−4; wrong `4` (difference sign), `-10` (lost initial 6), `16` (adds instead of subtracts).
3. Existing `n11-11`: from visible `-4x+9\ge-17`, subtract 9 from both sides; select `-4x\ge-26`. Preserve original exact key and all 3 original distractors unchanged; existing record of `n11-11` retains its correctness while new source-work operations start unanswered. Explain `-17-9=-26` **after** this answer, not before.

Reading text is continuous, textbook-style black body prose; no long series of separate card headings. At each stage the teacher explains the already resolved operation in two short sentences, then the relevant formula-local blank, not a giant full-formula multiple-choice. If adding syntax/panels requires a global helper rewrite, STOP and revise proposal before coding. Source Q12 will still receive `-4x\ge-26` as its input.

## Formula/decision order (source-based fire diagram)

```
Q10 last endpoint check and original completed number-line figure
  ↓ existing title "括弧・分数があっても同じ規則"
Q11: 3(2x+3)≥10x-17
  ↓ [NEW n11-wm012-q11-expand] = 6x+9
6x+9≥10x−17
  ↓ [NEW n11-wm012-q11-xcoef] = −4
−4x+9≥−17
  ↓ [EXISTING n11-11, same key]
−4x≥−26
  ↓ existing Q12 −4x≥−26, from which division gives x≤13/2
  ↓ unchanged Q13–Q14
```

No answer or subsequent complete derived line is displayed before the learner fills its prerequisite blank.

## Code, progress, counts and verification boundaries

- App authoring **only** N11 Q11 local `readingFlow`, two new `reviewItem` nodes and source map `N11-Q11` → `[expand,xcoef,n11-11]`. Preserve 14 original source labels, existing nine N11 Q01–Q04 improvements, N11 Q05–Q10 and Q12–Q14 wording/answers/order, original two PNGs, other seven unit code and all modes.
- N11 revision **4→5** because five previous learner new-proof decisions are unaffected and two entirely new decisions are added. Preserve **all previous answers**, including unchanged `n11-11`, in active rev5; archive prior rev4 including completedAt before reopening the new two stages, retain older archives. v1/v2/v3 users traverse existing approved migrations through v4 before v5. Re-running progress normalization is idempotent; no global reset or loss of previous completedAt history.
- N11 active 19→**21**; eight new Math Textbook unit guided decisions 132→**134**; unchanged 123 teacher-source question labels. Current 396 candidate wrong-choice entries → **402**, the six newly authored wrong alternatives must be independently classified alongside original existing `n11-11` three wrong alternatives.
- Unit tests independently prove three expressions, four unique answer choices for both new nodes, 14→21 source map, exact source and no premature next answer in lead, v1/v2/v3/v4→v5 archives and unaffected key preservation. Original figures unchanged byte-for-byte.
- Browser E2E at 320px/390px real wrong→hint→retry→right→reload for both new nodes and unchanged original `n11-11`; all **134** guided decisions on mobile and desktop, prior 24 repaired problems, N12 26 in-equation, Physics Textbook, Math Practice regressions. Capture **2 new nodes × 2 widths × 3 states = 12 authentic screenshots**, plus original `n11-11` if its visual scaffolding changes, freeze code SHA.
- User Gate① only on newly amended **Q11 one source-group** after approved implementation. Earlier Q01–Q04 Gate① 「いいよ」 remains accepted and never requested again. Gate② source/impact replay and Gate③ exact hosted app/full user play follow the already approved process; GitHub main/Pages/Vercel/public/billing are not authorized.

## Before-implementation stop

**Approval recorded 2026-10-21:** User replied 「続けて」 immediately following the explicit invitation to approve this exact single-Q11 plan. This authorizes the bounded two new steps and rev4→5 archival migration, **not** another question, source lesson or deployment. Implementation/technical QA remain pending. Q12/Q14 and N14 linked risks remain independent future decisions; do not silently bundle them. No modification to project lessons or source Word; no new workflows or gate definitions.

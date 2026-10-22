# W-MATH-020/P-001 — N14 Q15 positive three-member division as five local learner decisions
Status: PROPOSED — EXACT USER APPROVAL REQUIRED; NO CODE CHANGE
Date: 2026-10-22 JST
Command: CMD-WORK-001 修正. Existing correction-first, one-block preflight and Gate①→②→③ apply.

## Proven original Q15 and dependency
- Original N14 Q13: `|3x-2|\le4\iff-4\le3x-2\le4`.
- **Previously accepted** W-MATH-019 Q14: add 2 on all members, `-2\le3x\le6`, all five Q14 operation/result holes and one explanation accepted by user. Do NOT change or re-review it.
- Original Q15: `−2≤3x≤6`, '中央の係数を1にする操作と得られる範囲を考えよう' (currently one choice grading both positive-3 division and final `-2/3≤x≤2`). This is F-017-08 same-root but a separate small-block approval.
- Q16 independently verifies the two final endpoints in `|3x-2|\le4`; keep Q16 unchanged and do not pre-expose Q15 answers.

## Proposed exact student-visible 3-equation layout
1. Original given (one formula): `-2\le3x\le6`.
2. Second *logical* formula with 3 individual inline choice blanks, visually two lines at <=430px:
   `-2\div[選択]\le3x\div[選択]`
   `\le6\div[選択]`
   Three independent positive divisor answers **3,3,3**. For implementation, do not attempt to place HTML choice nodes inside KaTeX `\frac{}{ }`: use separate KaTeX fragments for `\div` with the original `C(itemId)` choice buttons. No ready-completed range appears before the learner chooses.
3. After all 3 divisors resolved, one short interposed paragraph:
   `三辺を正の3で割っても、不等号の向きと等号は変わらない。中央の3xを3で割ると、xだけが残る。`
4. Third formula with two separate computed endpoint holes: `[選択]\le x\le[選択]`, answer `-\frac23` and `2`. The first result requires `-2\div3=-2/3`; the second `6\div3=2`. Exactly five graded decisions (3,3,3,-2/3,2), three logical equations and one explanation. Must preserve upper/lower inequality inclusive signs.
5. Q16's original given `|3x-2|` with endpoints from resolved Q15 follows after Q15. No extra summary blocks or generic headings in the learner application.

## Scoped implementation *only after* new approval
- N14 source to item key `n14SourceToItemIds['N14-Q15']`: new IDs `n14-wm020-q15-divide-left`, `n14-wm020-q15-divide-center`, `n14-wm020-q15-divide-right`, preserve `n14-15` as computed left endpoint (semantic rekey old combined choice), new `n14-wm020-q15-bound-right`. Five items in source order.
- N14 Q15 derivation ID `n14-q15-chain`, three formula blocks and one paragraph. Exact Q14 `n14-after-14`→Q15→`n14-after-15`→Q16 markers unchanged. Existing Q14 5 answers and Q10/reviewState accepted unchanged.
- Unit current N14 revision 8, 30 items; proposed revision 9, 34 items. Archival migration 8→9 preserves every prior answer and prior revision archive; ONLY active old `n14-15` semantic key reopens plus four new ungraded IDs. All previously accepted N11/N14 Q07/Q08/Q10/Q12/Q14 unaffected. Explicit tests on legacy revision 1–8 histories, progress, shared preview metadata and source 16 original markers required.
- Four distinct options per blank, value/type consistent (positive dividing number and numeric endpoints), no duplicates, no answer leakage; wrong/hint/retry/keyboard and all 5 staged unlocks. Correct arithmetic, including `3x\div3=x` and sign preservation, separately audited.
- Q15-only mobile two-*visual*-row CSS; canonical blue 「選択」 and red 「×」 dimensions unchanged. Numbered Q15 review-only wrapper on 320px must fit all fragments; 320,390,1440 live Chromium normal+numbered review tests before user Gate①. Do not blindly copy former Q14 320px padding or iterate unapproved CSS guesses if it clips. Scope permission or STOP new exact proposal.
- Use existing math textbook CI, review check, governance, practice/physics regression. Keep an exact source SHA and genuine GitHub image evidence; after PASS show user ONLY their chosen concise math sketch, not an extensive photo gallery. N14 Q14 accepted marker stays hidden.
- Gate② broader audit and Gate③ real full-app play remain separate. No main, Pages or public changes without distinct permission.

## Approval boundary
This file is only a *proposal*. Await explicit user `いいよ` / `承認` **to the N14 Q15 layout** before any learner-code implementation. Existing N14 Q14 acceptance is NOT Q15 consent.

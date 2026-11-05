# W-MATH-017/P-003 — Q01・Q05 小ブロック詳細設計

Scope: only math/textbook N11 original source markers Q01 and Q05; original Word and two figure binaries remain protected. Baseline main `15ae503455bc6ae75b080caa1c4919cafb250027`. This is the **approved design implementation checkpoint**, not the user Gate① screenshot itself.

## Preflight authority
Existing accepted Set `setLesson.ts` paragraph containing inline choice, math textbook SPEC §§3–6, MASTER §§8–11/20/52–54, genuine user's public Q01/Q05 screenshots, §12B impact record. Existing renderer `TextbookReadingFlow` already supports choice inside paragraph; no common renderer edit is justified.

## Q01 comparison (original N11-Q01; preserve number-line figure n11-f01)
- Learner action: locate −2 and −5 on real original number line; insert a single relation between `(-2)` and `(-5)` in the same **prose** paragraph.
- Before answer: "符号を変えた二つの数を比べると、(-2) [relationship] (-5) となる。" No second completed formula, no raw '?' alongside chosen full expression.
- Four authored choices: `>` correct; `<`, `=`, `\\le` wrong (distinct and false). Learner selects relation only; after answer completes the inline statement and receives explanatory next sentence.
- Stable original item ID `n11-01` remains source-bound but the answer type's *meaning* changes from whole comparison to relation; v6 answer is archived and selectively reopened in v7.
- Gate① screen checks: 320/390px before/wrong/hint/after/reload: one legible comparison, no repeated formula, full figure visible, next Q02 unaffected.

## Q05 cancellation and calculation (original N11-Q05)
- Prerequisite: previous sections show adding/subtracting same number preserves orientation; original `3x-2<5` is preserved.
- First prose node `n11-wm017-q05-operation`: "両辺に [2] を加える"; wrong `-2`, `3`, `0`. Only after the **first** correct choice, the next paragraph with `3x-2+2<5+2` becomes visible under the existing first-unresolved-item gating.
- Second prose node `n11-05`: "右辺を計算すると 3x<[7] となる"; wrong `3`, `5`, `9`. The full correct result `3x<7` appears **after** the numeric choice; Q06 remains a separate next operation dividing by positive three.
- No extra disconnected complete-formula selection box; the only displayed standalone mathematical relation is the original/context math if pedagogically necessary.
- Stable Word source mapping `N11-Q05 -> [n11-wm017-q05-operation, n11-05]` distinguishes *one original source question* from *two learner decisions*.
- Rev6 progress: archive entire old answer ledger, reopen old Q01 and Q05 only, add Q05-operation as blank. All other old answers/revision chains and attempt/timestamps survive.
- Gate①: 320/390px wrong/hint/retry/correct for **both** decisions; check no premature `3x<7`, no unexpected horizontal scrolling, after Q05 correctly hands off to Q06.

## Exit and dependencies
No Gate① `細部OK` can be requested until authentic screenshots tied to the exact learner SHA exist in a GitHub viewable sheet. Gate② entire relevant math/source/choice/old progress regressions must pass independently. Gate③ remains failed/open until new approved release build and real user playthrough; CI cannot substitute for human acceptance.

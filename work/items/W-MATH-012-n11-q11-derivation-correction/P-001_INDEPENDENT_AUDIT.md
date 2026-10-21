# W-MATH-012/P-001 — 最終独立数学・技術監査
Status: **TARGET Q11 MATH PASS / TECHNICAL QA PASS; HUMAN GATE① PENDING**.
Code `74b73ad275b8aced7ccf99c3ef0ffc943f02d208`; [Full CI #39519336157](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39519336157) SUCCESS; [browser-image run #39519331072](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39519331072) SUCCESS; 18 genuine screen images at screenshot commit `d44ddcca3ae6bbe20cb11fb369d4ccec3764cda4`.

## Source-grounded independent algebra
Teacher-original N11-Q11:
```
3(2x+3) ≥ 10x−17
        ↓ distribute 3
6x+9 ≥ 10x−17
        ↓ subtract 10x from BOTH sides
−4x+9 ≥ −17
        ↓ subtract 9 from BOTH sides
−4x ≥ −26
```
The first formula-local blank `n11-wm012-q11-expand` selects the new left-hand side `6x+9`; three wrong choices `6x+3`, `2x+9`, `6x+6` each violate distribution of 3. The second `n11-wm012-q11-xcoef` selects `-4` from `6-10`; `4`, `-10`, `16` each incorrectly combine signed coefficients. Original `n11-11` selects `-4x\\ge-26` from the source, with unchanged three distractors `-4x\\le-26`, `4x\\ge-26`, `-4x\\ge26`. `\ge` direction never flips in Q11 because only addition/subtraction is performed. Q12 independently teaches negative-coefficient division and remains unchanged. Do not conflate this Q11 derivation with a proof of Q12.
**Choice count** N11 14 teacher source labels→21 active choices, eight newly authored source units original123→134 choices; all four keyed choices and KaTeX parse through unit tests, no duplicate normalized options, 2 additional local decisions×3 incorrect options = 6 new wrong choices. Existing original figures and accepted nine-stage N11 Q01–Q04 retained unchanged.

## Sequence & layout
Real rendering flow locks each later result until prior response. The first completed `6x+9` is after first blank; `-4x+9\ge-17` after second. Existing Q11 final answer shown only after original response and prior premise remains in a paragraph. **Detected and corrected clipping**: the first screenshot attempt at old candidate SHA displayed `-4x+9≥-17 \Rightarrow -4x≥-26` in one narrow box, truncating on 320px. Frozen final SHA `74b73ad275b8aced7ccf99c3ef0ffc943f02d208` displays the original answer by itself and has explicit 320px answer right-edge test. 18 final screenshots checked (incl. old final 320 and 390), no cropping of final expression seen. Do not reuse earlier pre-fix images.

## Persistence, gated scope & regression
- Rev4→rev5 archives source-revision4 progress `archivedRevisions['4']`, retains all answered IDs including unchanged old key `n11-11`. New two item IDs unanswered. v1, v2, v3 traverse previous approved steps sequentially; past completions maintained in archives; new rev5 `completedAt` only when all 21 active items answered. Tests on v1/v2/v3/v4 plus idempotent saved rev5 PASS.
- 14 original source markers / 21 N11 decisions / 134 current batch decisions and nine original PNG preserved. Original source question Q05–Q10 and Q12–Q14 and Q01–Q04 wording/answer meanings protected, no modification to Math Practice/Physics Textbook/lesson canon or original Word.
- Full CI #39519336157 **SUCCESS** Typecheck, Lint, unit, build, genuine browser 134 decisions on desktop/mobile, dedicated N11 Q01–04 nine steps and Q11 three steps (including wrong→hint→retry→resolved), previous corrected 24 decisions, N12 26 stages, Physics textbook and Math Practice regression.
- W-MATH-011 Q01–04 Gate① earlier accepted; W-MATH-012 Q11 human Gate① **PENDING**; whole inequality Gate② not yet CROSS-VERIFIED because Q12/Q14/N14 remaining pedagogy risk checks still open; Gate③ hosted SHA-matching full-app user play NOT READY, draft PR #101 not merged or released.

[18-shot real-app Gate① worksheet](./GATE1_N11_Q11_REVIEW_SHEET.md).

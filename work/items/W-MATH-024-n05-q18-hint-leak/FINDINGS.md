# W-MATH-024 — original Word × live source confirmation
Status: CONFIRMED (code read; intervention NOT APPROVED)

- Original teacher Word N05 Q16–18 (paragraphs 237–240) derives two expansion constraints and asks the student to select a coefficient pair satisfying both, then complete the factored product.
- Live source `n05Lesson.ts` rev2 `q:18`: `lead:'符号の異なる因子のうち、s+5r=−2も満たす組を探す。'`; answer `(x-1)(5x+3)`; the wrong-only hint `r=−1、s=3ならs+5rを計算して確認できる。` directly supplies the answer's r/s values.
- With `(x+r)(5x+s)=5x²+(5r+s)x+rs`, target requires `rs=-3` and `5r+s=-2`. For `r=-1,s=3`, `rs=-3`, `5r+s=-2`: these are exactly the correct, still-unanswered coefficients. This matches original W-MATH-022 F-022-02 and W-MATH-023 F-023-01/F-023-02 same-root signature: target answer is pre-exposed on an incorrect attempt.
- By contrast N08 Q05's existing hint computes square operands 5 and 9 for a comparison but does **not** disclose the target inequalities; that is a related review candidate, not a proven identical answer-leak defect. Do not mass-edit.
- Scope: N05 Q18's single hint only. New answer/revision/figure/migration edits are unnecessary and unapproved. Future formal implementation, tests, Gate① and wider audit all pending.

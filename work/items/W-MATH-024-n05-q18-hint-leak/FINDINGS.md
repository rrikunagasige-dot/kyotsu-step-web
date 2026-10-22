# W-MATH-024 — original Word × live source confirmation
Status: CONFIRMED (code read; intervention NOT APPROVED)

- Original teacher Word N05 Q16–18 (paragraphs 237–240) derives two expansion constraints and asks the student to select a coefficient pair satisfying both, then complete the factored product.
- Live source `n05Lesson.ts` rev2 `q:18`: `lead:'符号の異なる因子のうち、s+5r=−2も満たす組を探す。'`; answer `(x-1)(5x+3)`; the wrong-only hint `r=−1、s=3ならs+5rを計算して確認できる。` directly supplies the answer's r/s values.
- With `(x+r)(5x+s)=5x²+(5r+s)x+rs`, target requires `rs=-3` and `5r+s=-2`. For `r=-1,s=3`, `rs=-3`, `5r+s=-2`: these are exactly the correct, still-unanswered coefficients. This matches original W-MATH-022 F-022-02 and W-MATH-023 F-023-01/F-023-02 same-root signature: target answer is pre-exposed on an incorrect attempt.
- By contrast N08 Q05's existing hint computes square operands 5 and 9 for a comparison but does **not** disclose the target inequalities; that is a related review candidate, not a proven identical answer-leak defect. Do not mass-edit.
- Scope: N05 Q18's single hint only. New answer/revision/figure/migration edits are unnecessary and unapproved. Future formal implementation, tests, Gate① and wider audit all pending.

## Implementation successor branch notice
2026-10-22 JST: The user's immediate 「可以」 directly answered the explicit question 「N05のP-001を承認しますか？」 after displaying the unchanged exact proposal. **P-001 is APPROVED for N05 Q18 hint-only implementation**, not for extra lesson edits, N13/Q16 changes, Gate① or merges. This implementation branch starts from W-MATH-023 accepted Q05/Q08 branch SHA 4502f92bc25abddaa90b8e6673d990c7a4a17867; older proposal-only branch is retained as archival history. Only the Q18 hint text was modified in learner source (original N05 rev2, 20 IDs and two images intact). Tests and genuine Chrome capture pending.

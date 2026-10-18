# W-MATH-009 — Proposal P-001: N09 Q08 計算を穴へ

Status: PROPOSED
Created: 2026-10-18

### Problem / Need
N09 review-only source `src/data/textbook/math/numbers/n09Lesson.ts` at main SHA 07b8523 contains Q08 as one final answer `1.41^2=1.9881<2<2.0164=1.42^2`. Lines 115–124/190–194: there are no prior separate learner choices for 1.41², 1.42², their comparisons with 2. Q09 then infers the root range, but it does not check the Q08 arithmetic. This repeats N12's "final expression as one hole" reasoning failure.

### Proposed Solution
Preserve original N09-Q01–Q14 source IDs, correct answers, source order, titles, figures, and status=review. At Q08 insert four stage-gated rectangular localized N02-style 「選択」 math holes:
1. `1.41^2=□`, answer 1.9881.
2. `1.42^2=□`, answer 2.0164.
3. `1.9881 □ 2`, answer <.
4. `2 □ 2.0164`, answer <.
Then ask the original N09-Q08 whole comparison as synthesis, with exact answer key unchanged; no future-value leakage. Q09 and later remain unchanged.

Show short separate math rows at 320px rather than one unbroken 90-character formula. If a saved N09 run must be invalidated by revision 2, safely archive prior answer records and start from first question; no silent deletion. Add integrity, incorrect-choice, reload and reset tests; include 320/375/390px and sibling N09 math QA.

### Scope
N09 Q08 readingFlow/locally added items, N09-specific display/revision migration only if required, targeted tests and work records.

### Out of Scope
N02, N12 or other accepted units, original source Word/images, Constitution, other modes, main/Pages/public release, and generic CSS refactor.

### Expected Affected Areas
`src/data/textbook/math/numbers/n09Lesson.ts`, N09 integrity/E2E; narrow shared view helper only if strictly required.

### Risks
Potential answer leakage if comparison values appear before their holes; saved review progress; long math overflow. Resolve within proposed scope or return REVISE-PROPOSAL.

### Verification Plan
Original 14 source ID/answers unchanged; four new slots precisely ordered; right/wrong gating, numerator math, display at mobile widths, old N09 progress safe, other units unchanged, CI pass, user review.

### Approval
Status: WAITING
Approved by user: NO
Approval date:
Approval evidence:
Exact approval phrase: 「W-MATH-009/P-001を承認する」. Approval authorizes only branch implementation and verification, not main merge/Pages release.

### Review History
- Review status: NOT-REVIEWED
- User feedback:
- Supersedes:
- Superseded by:

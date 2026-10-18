# W-MATH-010 — Proposal P-001: N02 Q05「係数0」と「項0x」の混同

Status: PROPOSED
Created: 2026-10-18

### Problem / Need
N02-Q05 source asks 「Bにないxの項の係数は？」 but the actual embedded choice in `B=-x^3+2x^2+【選択】+2` has correct answer `0x`. A coefficient itself is **0**, while **0x** is the whole missing term. The formula is mathematically valid as a zero placeholder, but the question's grammatical target and expected answer differ. Source SHA 47a0a7508f2ff4fa6599497d2a92ef59046e41af, lines 84–90/158–159.

### Proposed Solution
Keep original N02-Q01–Q12 IDs, source math, answer strings and figure timing. Change only the learner Q05 prompt and adjacent sentence to explicitly ask for the *missing term* with coefficient 0, e.g. 「係数が0の一次項を、Bの式中に補おう。」 Keep the in-formula answer `0x` as a temporary alignment marker, not a coefficient value. Add a compact sentence: 「係数は0。列をそろえるときだけ0xと書いても値は変わらない。」 Show the explanation **after** resolution so it does not disclose the choice; never turn genuine coefficient-1 answers into 1x. Preserve existing rectangular hole style, review-only status, and saved answer correctness.

### Scope
N02 Q05 prompt/readingFlow adjacent bridge and targeted source/choice integrity tests.

### Out of Scope
N02 answers and other problems, broad coefficient formatting rules, N09/N12 or shared data reset, Constitution, main/Pages release.

### Expected Affected Areas
`src/data/textbook/math/numbers/n02Lesson.ts`, N02 unit tests.

### Risks
Explanations may leak `0x` before the choice; the final wording must be checked for ordering, math clarity and exact original Word provenance. If it needs a new local coefficient hole or revision, issue REVISE-PROPOSAL for approval.

### Verification Plan
Original source IDs and answer key unchanged; zero coefficient mathematically correct; no early reveal; no accidental 1x regression; 320px visual and N01/N03 sibling regression, CI.

### Approval
Status: WAITING
Approved by user: NO
Approval date:
Approval evidence:
Exact approval phrase: 「W-MATH-010/P-001を承認する」. Approval allows implementation on a separate review PR, not merge/Pages release.

### Review History
- Review status: NOT-REVIEWED
- User feedback:
- Supersedes:
- Superseded by:

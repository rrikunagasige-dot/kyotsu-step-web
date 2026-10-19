# 関連作成物のスマホ数式影響確認 — Gate ②

Status: IN-PROGRESS / four related review units UNVERIFIED pending exact GitHub Actions result.
Approved scope: W-GOV-008/P-003 Gate ② cross-artifact impact of N01 long inline formula. Prior math lesson authoring is W-MATH-003/P-001; do not re-author it.
Candidate before this verification-only change: `2c3f1716947315f64ba8d438eaea7b0b38944bbc`.

| Unit | Test scope | Initial evidence | Result |
| --- | --- | --- | --- |
| N02 | All learner decisions and formula/choice horizontal ends at 320px; completed 390px | Static source review, long grouped-polynomial terms | UNVERIFIED (CI pending) |
| N09 | Same, including actual N09 image/answer flow | Static source review, long radical/negative-number expressions | UNVERIFIED (CI pending) |
| N10 | Same, including rationalization and multi-line choices | Static source review, long conjugate/radical expressions | UNVERIFIED (CI pending) |
| N12 | Same, including all conditional inequalities and money formulas | Static source review, long expressions and original source figures | UNVERIFIED (CI pending) |

## Method and interpretation
- Browser automation visits ordinary `/#/learning/textbook/math-numbers-expressions-nXX` routes, clears only ephemeral test browser localStorage, answers all items using existing repository answer values solely to reveal every later screen, and does not assert independent mathematical correctness.
- At each stage it inspects *rendered* formula/choice spans: document overflow, KaTeX error, inner scroll to rightmost visible fragment at a 320px viewport. After completion it rechecks every source formula at 390px. This does not test Word OMML provenance or prove all content mathematically correct.
- If a test fails, check selectors/assumptions before calling it an app defect. Preserve failed-run evidence and re-run corrected verifier without lesson edits. If a genuine lesson/layout bug is established, log the exact reproduction and request a new CMD-WORK-001 approval before changing learner UI/source.
- No `src/` edits, original source edits, deploy, Vercel, merge, production/public environment or billable action in this evidence run.
- The independent fresh original DOCX math/OMML comparison is still UNVERIFIED after a 403 source-page read. Do not bypass permission or promote Gate ②/③ based on these tests.

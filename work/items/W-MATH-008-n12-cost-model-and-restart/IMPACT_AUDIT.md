# W-MATH-008/P-001 — Cross-unit impact audit (2026-10-18)

## Scope and source
Read-only comparison against **main 4cd7665a4b5bde8c8d23ddfddf803d6833458856** and `src/data/textbook/math/numbers/` directory listing. Nothing in another unit has been edited. Screen sizes and browser rendering remain separate verification; a static code check cannot certify overflow absence.

The N12 root-cause question used for each unit: **Does a one-step gap ask for the final result of multiple learner-performable calculations, or does a formula render as a long unbroken row that may scroll internally?** It is not enough that the item contains a `C(...)` hole.

| Existing created/review lesson | Source SHA | Atomic derivation audit | Display / progress audit | Follow-up |
| --- | --- | --- | --- | --- |
| N01 | `0bb6f7f24cfeeed74a101aa00e39445afa6e3e00` | NOT-AFFECTED by T(x)-type model omission in inspected stages: coefficient identification and collecting like terms have separate Q06a/Q06b/Q07 holes. | Browser overflow UNVERIFIED | Retain learner data |
| N02 | `47a0a7508f2ff4fa6599497d2a92ef59046e41af` | **CONFIRMED** distinct but related gap/prompt mismatch: N02-Q05 asks for the *coefficient* of the missing x term, but the in-formula correct answer is the *term* `0x`; lines 84–90, 158–159. Mathematically correct as a term, not literally the coefficient 0. | Internal overflow UNVERIFIED | Separate correction Proposal required before content edit |
| N03 | `2f3c57434a4c30e5cfbe61349278afe224899e83` | NOT-AFFECTED by exact T(x) model-root: Q07/Q08, Q09–Q11, Q12/Q13 distinguish distribution and collection steps. | **RISK/UNVERIFIED**: long underbrace expansion within one M(...) math run, potentially wider than a 320px formula. | Test mobile width, then propose if confirmed |
| N09 | `07b8523e7b64b5c72d525fa0805d4e211cfb3e00` | **CONFIRMED** same atomicity omission: N09-Q08 presents `1.41²=1.9881<2<2.0164=1.42²` as **one** choice. The learner does not separately calculate 1.41², calculate 1.42², and choose the two comparisons. Lines 115–124 and 190–194. Q09 then handles a separate next inference but cannot repair missing Q08 computations. | Internal formula scroll UNVERIFIED | Separate correction Proposal required before content edit |
| N10 | `e7498844e3fa7dcc4f7862e5ad6b25abb92cae67` | Formula steps visibly separated for many proofs, rationalizations (Q20 setup, Q21 result); exact N12 T(x)-omission not confirmed. | **RISK/UNVERIFIED**: several long fraction answers and `\\Longrightarrow` in math runs. | Browser 320/375/390px audit needed |

Main has **N01, N02, N03, N09, N10 and N12** lesson source files; it has no `n04Lesson.ts`–`n08Lesson.ts`, `n11Lesson.ts`, `n13Lesson.ts` or `n14Lesson.ts`. These absent units are **UNVERIFIED/NOT IMPLEMENTED** in this directory and cannot be given a QA-pass label.

## Enforcement boundary
- Existing N01/N02/N03/N09/N10 `status: review`, not published. Do not silently modify them under the N12 P-001 approval.
- For **N09 Q08 and N02 Q05**, prepare linked **proposal-only** correction(s); implement only after specific user approval, before resuming outstanding creation. Other browser-only risks remain UNVERIFIED until a real visual check.
- This audit does not itself approve edits, publication, or a project-wide lesson rewrite. Common-lesson deduplication follows accepted corrections, per the existing rule; meanwhile recheck lessons **before each concept/problem/formula/UI unit**, not just before a large project.

## Post-correction impact closure checkpoint (2026-10-18)

The table above is the **historical read-only pre-correction finding**, not a current defect claim. The linked correction branches have now been approved, tested and merged:

- N09-Q08: W-MATH-009/P-001, PR #89, main 9cdc86b2f5b76e8c6363bcdd6dd434e385a013c5. Four independently graded square/comparison holes precede original synthesis; original 14 source IDs and answers retained, progress v1 archived. CI #39117627867 PASS, Pages #39119290710 PASS. The originally CONFIRMED atomicity defect is resolved in code; user hands-on QA still pending.
- N02-Q05: W-MATH-010/P-001, PR #90, main 1f3ea4d18d3f13b9ee0e2125e2d26190e5a5e2ec. Gap prompt now asks for a missing *term* rather than its coefficient; answer 0x and delayed explanation retained; original 12 source IDs/answers unchanged. Combined math CI #39119434629 PASS. The originally CONFIRMED mismatch is resolved in code; Pages/user QA pending.
- N01 remains NOT-AFFECTED by the inspected root cause. N03 and N10 still have **UNVERIFIED mobile-overflow risks**, not confirmed defects or implicit clearance; investigate with actual narrow-viewport evidence before proposing additional corrections. Missing N04–N08/N11/N13/N14 sources stay UNVERIFIED/NOT IMPLEMENTED in the audited directory.

This is the second-pass disposition of known confirmed issues, not a claim that every unit has full user QA. Per governance §12B, recheck the correction queue and §52 small-block preflight before resuming creation; if either remaining visual risk becomes CONFIRMED, create a separately approved correction Work.

## Acceptance and lesson close (2026-10-18)

- User directly assented 「いいよ」 to the explicit published N02/N09 hands-on review acceptance request. This records **user-reported acceptance**, not independently observed browser interactions.
- Pages #39119290710 (N09) and #39119967626 (N02+N09) both PASS; linked Work records W-MATH-009/010 are DONE on merge of shared lesson PR #91.
- The common rule is consolidated once in `docs/MASTER_APP_LESSONS.md` §§52–53, cross-referencing existing §§7–12/20/51. No historical table rows were erased.
- N03 and N10 narrow-mobile display risks remain UNVERIFIED, not confirmed repairs or false PASS; they belong to the next targeted evidence-gathering sweep, with a new correction proposal only if confirmed.

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

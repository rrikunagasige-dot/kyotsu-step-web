# Findings — W-MATH-005
## F-001 — CONFIRMED / R3 N01
N01 Q07 local values −2, −3, +3 hidden behind entire polynomial choice at n01-07. Source blob 0bb6f7f24cfeeed74a101aa00e39445afa6e3e00.
## F-002 — CONFIRMED / R3 N03
N03 Q10 four products are taught with a grid but only entire expression is chosen at n03-10; values 6x², 8x, 3x, 4 need local holes. Blob 2f3c57434a4c30e5cfbe61349278afe224899e83.
## F-003 — CONFIRMED / R3 N09
N09 Q08 exact squares 1.9881 and 2.0164 hidden within compound inequality choice. Blob 07b8523e7b64b5c72d525fa0805d4e211cfb3e00.
## F-004 — NOT-AFFECTED WITH LIMIT / N02,N10
Both model comparable operations before later transfer. Source-only R3 assessment; browser QA unverified. See W-MATH-004 ledger.
## F-005 — RISK / DATA MIGRATION
New token IDs without per-unit revision-safe conversion may hide old completion history. Separate approval and tests required.

## F-006 — CONFIRMED / RELEASE DEPENDENCY SATISFIED
N12 P-002 PR #78 merged to authoritative main 51c184286e5207b189dd7b412643e99c426bc884 on the user's separate release authorization. Reuse of N12 token UI is permitted only for the three newly approved W-MATH-005 prefixes, not all math textbooks.

## F-007 — VERIFIED / ALL 42 ORIGINAL ANSWERS INVARIANT
Compared original lesson item identifiers and exact answer strings on merged N12 main 51c184286e5207b189dd7b412643e99c426bc884 with W-MATH-005 draft branch: 15/15 N01, 13/13 N03, 14/14 N09 IDs and answer values identical; the nine newly scoped IDs alone added. Original source-to-interaction map declarations and original figure ID, image URL and figure references are byte-for-byte unchanged. N03-F01 and N09-F01 reveal locations preserved.
## F-008 — VERIFICATION LESSON / TEST BUILD-TIME NARROWING
CI's first `tsc -b` build checks test files more comprehensively than a passing Vitest run; source-ID mapped literal tuples and discriminated `readingFlow` blocks require explicit TypeScript narrowing. Never treat a green unit-test phase as an entire-build green verdict; retain first failing run and retest. This is a test-authoring finding for this work item, not a new general R3 math lesson.
## F-009 — CATALOG AGGREGATE / EXPECTED DERIVED COUNT SHIFT
N09's +2 authentic local answer stages correctly change the real-number topic's aggregate catalog progress 35→37, with old progress `1/37 完了`. Existing E2E froze `1/35 完了`, so after the R3 E2E passed on both devices the later catalog test failed in CI 39100947795 on both devices. Update only the assertion to the new denominator; never change the catalog to falsely display stale counts. Future local-stage changes must audit chapter/topic aggregates and their UI test expectations.


## F-010 — ERROR-PROVENANCE PREVENTED / stale #80 incompatible with live main
The old draft #80 shared domain/renderer/page code was authored before accepted N09 #89, N12 revision-3 and W-GOV #91 updates. Wholesale merge would change N09 history semantics and remove later UI token handling. For P-002, use latest main and narrowly transpose only N01/N03 changes; N09 P-001 four-hole solution is already confirmed released.

## F-011 — CONFIRMED / N01/N03 still require seven calculations on live main
At `154a16ff379321016f4692bb0ac6fe9a8a596214`, N01 source blob `0bb6f7f24cfeeed74a101aa00e39445afa6e3e00` and N03 `2f3c57434a4c30e5cfbe61349278afe224899e83` match P-001 originals. Their 28 original source answer IDs and values can be preserved exactly while adding seven already independently checked local operations.

## F-012 — UNVERIFIED / N03 narrow mobile preflight
N03 320px page containment was previously unverified. Added direct tests at 320/375/390px before and after answers. A CI failure, if any, must be recorded and investigated; this finding is NOT a PASS.

## F-013 — SECOND-PASS R3 IMPACT LEDGER (scope-limited, 2026-10-18)
| Root cause | Unit/version | Result | Evidence/next action |
| --- | --- | --- | --- |
| R3 whole-expression answer hides local signed calculation | N01 rev1 | CONFIRMED | Q07 three calculations; P-002 scoped fix |
| R3 whole-expression answer hides local distributed products | N03 rev1 | CONFIRMED | Q10 four products; P-002 scoped fix |
| R3 decimal-square/comparison chain | N09 rev2 | NOT-AFFECTED (already fixed) | #89 four approved holes, preserve history restart |
| R3 previously approved derivation fixes | N12 rev3 | NOT-AFFECTED (already fixed) | #87 35 stages and archive/restart |
| same-named R3 applied to other concepts without local-operation requirement | N02/N10 | NOT-AFFECTED WITH LIMIT | Previous W-MATH-005 F-004 source-only audit; narrow browser QA pending, no edits |
| original other-unit creation drafts | N04–N14 | UNVERIFIED | do not implement, creation remains paused |

After P-002 CI, repeat root-cause/signature check only for any newly observed defect and record it before further changes.

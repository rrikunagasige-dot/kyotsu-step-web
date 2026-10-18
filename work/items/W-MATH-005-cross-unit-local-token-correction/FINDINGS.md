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

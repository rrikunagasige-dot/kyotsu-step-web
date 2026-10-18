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

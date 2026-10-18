# Verification — W-MATH-007
Status: IMPLEMENTING / P-001 APPROVED / CI PENDING

## V-001 — PASS read-only root-cause inspection (2026-10-18 JST)
Main commit 066e0da905bf4948e25ec200fe1b46e34d6ed573: src/components/textbook/TextbookFormula.tsx builds one InlineMath for the stored answer 1, another for the authored next part x+2\\le4. The approved desired display x+2\\le4 is not currently produced by that code.

## V-002 — PASS focused approved-number-unit source scan
Fetched current main source N01, N02, N03, N09, N10 and N12. Matching adjacent-choice-next-x cases are four N12 coefficient slots only (answers 2, 2, 1, 3). Draft W-MATH-005 source N01/N03/N09 new local answers contain no numeric-one-before-variable candidate.

## V-003 — PENDING implementation verification
User approved P-001 with 「いいよ続けて」. Implementation branch changes formula display at the coefficient-one-before-simple-x+ boundary only and adds N12 Playwright assertions. Required gates: all 26 N12 choices, visible x+2 not 1x, persisted answer value 1, neighboring 2x/3x, constant 1, reload/v1 history, N02/N09/other-unit tests, desktop/mobile, governance checks. CI results and cross-unit impact audit are not yet complete. No main merge or Pages deploy authorized.

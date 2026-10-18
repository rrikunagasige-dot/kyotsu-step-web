# Verification — W-MATH-007
Status: VERIFYING / INITIAL FULL CI PASS / PUBLICATION NOT AUTHORIZED

## V-001 — PASS read-only root-cause inspection (2026-10-18 JST)
Main commit 066e0da905bf4948e25ec200fe1b46e34d6ed573: src/components/textbook/TextbookFormula.tsx builds one InlineMath for the stored answer 1, another for the authored next part x+2\\le4. The approved desired display x+2\\le4 is not currently produced by that code.

## V-002 — PASS focused approved-number-unit source scan
Fetched current main source N01, N02, N03, N09, N10 and N12. Matching adjacent-choice-next-x cases are four N12 coefficient slots only (answers 2, 2, 1, 3). Draft W-MATH-005 source N01/N03/N09 new local answers contain no numeric-one-before-variable candidate.

## V-003 — PENDING implementation verification
User approved P-001 with 「いいよ続けて」. Implementation branch changes formula display at the coefficient-one-before-simple-x+ boundary only and adds N12 Playwright assertions. Required gates: all 26 N12 choices, visible x+2 not 1x, persisted answer value 1, neighboring 2x/3x, constant 1, reload/v1 history, N02/N09/other-unit tests, desktop/mobile, governance checks. CI results and cross-unit impact audit are not yet complete. No main merge or Pages deploy authorized.

## V-004 — PASS first complete implementation CI, PR #85 at 2ea75125 (2026-10-18 JST)
- Repository Governance Check #39105405170 — success.
- Math textbook mode CI #39105405248 — success, including typecheck, math schema/unit tests, build, figure decoding, N12 all 26 progressive derivation decisions + wrong/reload/v1 migration + mobile/desktop overflow, textbook mobile/desktop smoke, N02/N09 all 26 choices and image gate, chapter-1 catalog/routes, physics textbook and math-practice regression.
- N12 regression verifies resolved coefficient renders x, joined visible formula contains x+2 and not 1x/xx+2, accessible label records coefficient 1, progress JSON saves "1", numeric N12 q02 constant remains 1, q06-right coefficient 3 remains explicit, reload still shows x.

## V-005 — PENDING final CI after additional non-one coefficient assertion
Latest QA-only change explicitly verifies N12 q01 and q02 coefficient 2 solved slots remain 2 (as well as right-side 3 and numeric constant 1). Same implementation logic and no authoring-source modifications. Confirm latest PR checks pass, then request separate approval before main/Pages publication. No release authorized by current instruction.

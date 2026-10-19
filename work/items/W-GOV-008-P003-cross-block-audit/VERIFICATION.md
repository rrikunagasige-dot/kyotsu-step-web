# Verification — W-GOV-008/P-003 Gate ②

Status: TECHNICAL-PASS / CROSS-AUDIT-IN-PROGRESS
Visual Gate ①: BOTH-NAMED-BLOCKS-OK; final overall review: NOT-READY

- Audit source commit: `ec8b97653fd65c134a31d05dbd008dd1bfbf476e` before adding verification-only tests.
- Prior technical PASS on `ec8b97653fd65c134a31d05dbd008dd1bfbf476e`: code check run 39204753356, governance run 39204753376.
- Expanded cross-block verification exists and has passed on the exact SHA below. Do not label `CROSS-VERIFIED` until remaining UNVERIFIED audit cells are resolved.
- Exact user `細部OK N01 Q07` and `細部OK N03 Q10` recorded 2026-10-19 14:55 JST in pilot `ACCEPTANCE_LOG.md` (visual only); no full-app `総チェックOK`.
- No hosting/main/deploy/fees action.

- First expanded run `39206109937`: **FAIL** specifically in new N03 wrong-choice test at option `6x` (not always visible); governance `39206109936` PASS; scoped 27 Vitest tests and preexisting preview E2E PASS. Failed evidence retained. Test locator corrected in subsequent commit; final gate remains pending.

- **Latest verified build/test SHA `9a379173ffc91e92b2c5014b1013b7299f68fce9`**: governance run `39206502728` PASS and expanded code run `39206502799` PASS. 27 scoped Vitest PASS; typecheck, ESLint, build, existing N01/N03 320/desktop Playwright, new wrong/hint/retry/route-isolation Playwright and refreshed visual captures PASS. This supersedes the failed new-test *execution* as current green evidence, but does not delete its historical cause F-206.
- No newly confirmed wrong arithmetic or learner-progress corruption in target blocks. N01 equation still requires horizontal scroll but both ends now tested reachable; wider approved-creation screens and independently repeated original OMML comparison remain UNVERIFIED. **Not `CROSS-VERIFIED`; not final playable app approval.**

- Initial post-visual-acceptance commit `165468e3fc920dd5254ebd8e5968928a396e7981`: governance `39207719786` FAILED because DONE Work used noncanonical verification status, and code check `39207719880` FAILED only the newly added scroll test: it wrongly targeted a short original formula with zero overflow. Historical intermediate failures kept as F-211; neither failure identified a learner-source fault.
- **Latest exact QA commit `2249e8a66aab6519f83e5b74f144e6566d455d04`**: governance `39207997979` PASS; code `39207997970` PASS (typecheck, scoped ESLint, 27 Vitest, build, preexisting real route/interaction E2E, new N01 derivation 320/390 horizontal scroll to right edge and no root overflow on mobile/desktop, other cross-block tests, 390/1440 image capture). Only test locator and Work metadata changed; no source lessons/IDs/answers or learner record touched. Gate ② required full-source repeated direct OMML and other approved creation long-line screen impact remain UNVERIFIED by explicit ledger.

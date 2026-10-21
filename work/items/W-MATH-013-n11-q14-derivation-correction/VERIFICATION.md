# W-MATH-013 — Verification
Status: PENDING

## Proposal-only preflight
- User authorized drafting this exact bounded proposal, but has **not approved implementing P-001**.
- Source: teacher-edited Word 212863 bytes/ SHA256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`; five-item audit W-MATH-011 established N11 Q14 as confirmed R1.
- Proposal branch base SHA `763c751af79f366b0b34af944444d8be8f482151` from PR #101 Draft, main unaffected by this Work. Q11 approved images/code separate. No new app code edited, no future CI/math regression claim.
- Static design checks: 1 original source Q14, 2 new explicit inline-choice nodes, 1 unchanged existing original `n11-14`, old 14 source labels; predicted N11 21→23, batch134→136; rev5→6 archive; proper answer order and no next-answer leakage.
- Expected direct UI behavior: 320/390 genuine before/wrong/resolved for 3 states × 3 nodes × 2 widths = 18 screenshots, plus wrong/retry/persistence regression; **NOT RUN until implementation approval**.
- Stop: Only proposal Markdown records may be committed now. Other source/lessons/workflows/main must remain unchanged.

## Required after-approval verification plan
V01—source/answer; V02—6 new wrong alternatives independently false; V03—source map 14→23/N11 and 123→136 batch; V04—rev1–5 migration to v6 archive/history/old answer; V05—no pre-answer leakage and correctly gated after text; V06—320px,390px and desktop actual app screenshot/KaTeX; V07—wrong→hint→retry→correct→reload for Q14 three stages; V08—N11 Q01–Q04/Q11 and N12/other mode regressions; V09—allowed diff/CI tested SHA exact and real CI SUCCESS; V10—new Q14 only Gate① visual acceptance, Gate② separate and Gate③ NOT READY.

**Do not mark these future checks PASS until independently verified evidence exists.**

## Post-approval implementation preliminary checklist — 2026-10-21
- User approval for the complete exact P-001 recorded: 「承認します。」; main merge and hosting not authorized.
- Initial source/test commit `b22db8b3f5cf08bca1c2f48d0d086c5ae41dad47` includes N11 Q14 only, N11 rev6 migration, related coverage and Playwright checks.
- Predicted active counts: N11 23/14 source, total eight-unit 136/123 source. Tests for 2 new nodes, original key unchanged, all rev1–5→6 preservation, and 320/390 browser wrong→hint→retry→correct→reload added; **CI not yet claimed**.
- Real 18 screenshots and GitHub Gate① user visual review: **PENDING**. Gate② N14 Q07/Q08/Q12 remain independently open; entire app Gate③ NOT READY.

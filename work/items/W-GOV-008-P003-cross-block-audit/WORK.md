# W-GOV-008/P-003 Gate ② — N01/N03 Cross-block audit

Status: VERIFYING
Review status: IN-PROGRESS (Gate ① N01+N03 accepted; Gate ② N01/N03 + N02/N09/N10/N12 phone-screen technical tests PASS; independent fresh Word/OMML source comparison UNVERIFIED after 403)
Updated: 2026-10-19 JST
Branch: `work/W-GOV-008-P003-pilot-visual-sheets-20261019` (independent; draft PR #97)

## Authority
Existing expressly approved W-GOV-008/P-003 Gate ②, CMD-WORK-001 review/rule improvement. No new application/lesson-design authority. P-002 original seven marks and screenshots remain unchanged. Math textbook review candidates N01 Q07 and N03 Q10 only.

## Scope and tests
1. Audit two original review lessons, stable IDs, mathematical chain, choice/key and original figure.
2. Inspect stage locking and leakage between seven marks, invalid review route, and unaffected ordinary route.
3. Run TypeScript, expanded scoped Vitest, and Playwright for wrong/retry/correct, 320px mobile and desktop, learner storage isolation.
4. Fill the cross-block ledger with exact observed evidence and UNVERIFIED for gaps; do not infer user acceptance.
5. Any confirmed actual UI defect needs CMD-WORK-001 proposal and user authorization before code repair.

## Technical source anchor
- Seven actual images captured against application code SHA `3ffe0bab97da9a509d7fe21ce7aa9dd78b52b141`; docs-only additions after that.
- Starting audit PR #97 branch SHA `ec8b97653fd65c134a31d05dbd008dd1bfbf476e` (source/data shared with P-002, no learner-source changes).
- The current GitHub source/docs are a candidate, never a published app.
- Links: [N01 visible review](../../../docs/reviews/W-GOV-008-P003/N01-Q07.md), [N03 visible review](../../../docs/reviews/W-GOV-008-P003/N03-Q10.md).

## Do not touch
No main integration, production/Pages/new public staging, Vercel deletion, billing, original Word, lesson text/answers, true learner progress or historical Work.

## 2026-10-19 exact latest verification checkpoint
- Scope remains the approved verification-only P-003 Gate ②. Current audit source HEAD is `8a0ba5063d2dd31dbde235009d9ccdaca1880b17` before this metadata synchronization, app Actions [39209911335](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39209911335) SUCCESS and governance [39209911210](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39209911210) SUCCESS.
- Original N01/N03 320px/390px mobile/desktop, interaction, wrong/retry, storage, existing 27 Vitest PASS. Related math normal-route N02 r1/N09 r2/N10 r1/N12 r3 rendered mobile full interactions 4/4 PASS, 86 decisions and 84 formula blocks. Status **not** `CROSS-VERIFIED` because independent Word/OMML fresh byte comparison is missing.
- Original native Word v2 source retrieval returned 403 on direct page-render. No permission circumvention, alternative credential or source substitution permitted. To finish, request user-provided authorized DOCX attachment/source access; independently hash and inspect the source then compare the same N01 Q07 / N03 Q10 math and figure references. Gate ③ remains NOT-READY until Gate ② passes; no new public preview, main merge or payment.

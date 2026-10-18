# W-MATH-004 — 不等式の導出不足・後半品質低下の修正
Status: IMPLEMENTING
Release gate: exact P-001 approved; main and Pages NOT authorized.
Updated: 2026-10-18 JST
Command: CMD-WORK-001「修正」
Proposal: P-001 — APPROVED on 2026-10-18 JST (verbatim user approval in PROPOSAL.md)
Branch: work/W-MATH-004-inequality-derivation-impl-20261018 (implementation; starts from audit branch)
Repo: rrikunagasige-dot/kyotsu-step-web, authoritative main 023bec8219fbb44194e7f69bed306af44e7e235f.

## Objective
Correct confirmed pedagogical compression in review-visible Mathematics Textbook N12; audit all 54 original N11–N14 inequality/absolute-value source markers; assess whether a common quality-drift root cause affects other approved creation outputs; then propose exact repairs and lesson deduplication before resuming creation.

## Authority / input
AGENTS.md, governance/CONSTITUTION.md, governance/INSTRUCTION_DICTIONARY.md CMD-WORK-001 and CMD-WORK-002, governance/WORK_SYSTEM.md §12B, subjects/mathematics/textbook/SPEC.md (candidate subordinated to user-approved target examples), docs/MASTER_APP_LESSONS.md, current N12 app code, N01/N02/N03/N09/N10 source, W-MATH-003 P-003 PR #73 draft, original user DOCX stored in Library and source mapping.

## Current factual state
- Original 53-page 212863-byte Word was resolved and pages 36–47 examined; embedded OMML formulas not fully represented in extracted text, compensated for by independent PR #73 source-answer tables, not claimed byte-reverified in this Work.
- N12 is `status:'review'`, visible via public learning setup; 15 source markers. Five underguided stages confirmed.
- N11/N13/N14 = 39 original markers, only unapproved design review PR #73, no app implementation.
- Preliminary six-unit impact scan: N12 confirmed; other five screened and remain UNVERIFIED for full no-defect assertion. A universal monotonic decline is not established.
- Previous W-MATH-003 P-003 creation remains PAUSED and NOT APPROVED; no scope leakage.

## Scope
Assessment, creation of source/cognitive audit and impact ledger, complete P-001 proposal; subsequent N12 implementation only after exact P-001 approval. Do Not Touch: N11/N13/N14 new app code, original Word, existing accepted other units, other modes, progress state, main/Pages, PR #73.

## Next step
1. Commit N12 21-stage correction and focused integrity tests on a separate implementation branch; audit five other accepted units under shared R1/R2 failure signatures.
2. Run CI, inspect math/unit typecheck, browser/mobile and progression gates; leave unknown checks explicitly unverified.
3. Present implementation PR and review link. Await user hands-on acceptance and distinct main/Pages authorization; reconcile reusable lesson only after verification and all linked corrections close. PR #73 P-003 remains paused.

Related links: [app](https://rrikunagasige-dot.github.io/kyotsu-step-web/#/learning/setup?subject=math-1a); [PR #73](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/73).
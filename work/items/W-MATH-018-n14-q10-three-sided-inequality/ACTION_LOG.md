# W-MATH-018 — ACTION LOG
Status: VERIFYING

## 2026-10-22 Approved correction preflight
- User direct response 「続けて」 in immediate reply to full W-MATH-018/P-001 was treated as approval of the unchanged exact design only, not main/release/Gate acceptance.
- Inspected live main 15ae503455bc6ae75b080caa1c4919cafb250027, branch 1581b651e39bc32e83bc8703b2f71ebde17facf6, Constitution, dictionary CMD-WORK-001, WORK_SYSTEM §12A/B and §12B sibling queue, applicable math SPEC/MASTER, accepted N14 Q07/Q08/Q12 and W-MATH-017 P-008 history.
- Scoped source implementation 988542626526ba84963b5927ce46ef6e00c80406: only N14 Q10 reading blocks (3 math rows + 1 reason + 5 holes) and N14-only v6→v7 selective archive, original figure and other source untouched.
- Current test updates 7dc56d392757b54f043a973426d3828b06da00c8 (N14 revision7, 26 choices) and focused independent maths/history test e8e28f869924de0789859830c78c3ce48315cf0d.
- First governance check failed missing ACTION_LOG/FINDINGS/VERIFICATION and exact single-line Proposal `Status: APPROVED`; corrected as missing workflow records, NOT changes to math lesson.
- Old W-MATH-017 P008 screenshot workflow attempted already accepted Q13; must change preview capture to new N14 Q10 review target and preserve P008 original images.
- Word v2 indexed Q10 question text source accessible; OMML original raw DOCX could not be materialized. Direct formula glyph fidelity still UNVERIFIED.
- Gate① new screenshot / Gate② independent cross-check / Gate③ public app and `総チェックOK` not yet done.


## 2026-10-22 — actual 320/390 rendered overflow, stop at visual gate
- Exact screenshot code SHA e1e913f2230c42175bc5e67a53e726d030752634, image bot commit 06643939685a06f6d3c23046b3b85730a5cc4244, run 39629959612 capture SUCCESS. Human visual audit sees initial three-hole formula is clipped at 320 (last 5+□ entirely invisible) and 390 (rightmost full 選択 partly hidden). The document-level scrollWidth check wrongly treated an inner formula's horizontal overflow as PASS. Mark Gate① NEEDS-FIX, not ready for user visual acceptance.
- Root CSS: .reading-formula-line overflow-x:auto and white-space:nowrap, expression min-width:max-content; wide unfilled button label 選択 occupies much more width than numeric 3. Other maths steps and historic progression unaffected.
- Prepared new P002 exact scoped mobile <=430px compact □/↻ and local CSS proposed ONLY; no CSS code change without user signoff. Prior visual image kept as defect evidence.
- Independent old N14 Q07/Q08/Q12 E2E regression from CI 39629959584 failed due revision6 vs7 and Q12 offset15→19; corrected only tests in 0b63f8a... and need full rerun. Gate②/③ remain open.


## 2026-10-22 — P002 approved scoped responsive patch
- Exact user 「続けて」 authorizes P002 N14-Q10 only. CSS-only change in `src/styles/global.css` scoped to derivationId n14-q10-chain under 430px, 2rem accessible button min width and 34px min height, compact visual square/↻ with aria-label preserved. No renderer, item, math, source, progress, main or other approved blocks changed.
- Added actual inner formula overflow and hole visibility checks at 320/390 in `e2e/wmath018-n14-q10-gate1.spec.ts`; validates normal Q01→Q11 and Q10-only marked actual review with wrong/hint/retry. Exact-SHA screenshot capture creates independent `p002-gate1` directory, preserving P001 clipped evidence and old P008 image snapshots.
- CI, screenshots and visual audit still PENDING. No Gate① acceptance inferred.


## 2026-10-22 — P002 display divergence diagnosis / revised proposal only
- User rejected newly proposed Q10 hole appearance: 「穴のデザインが前と違うじゃない？」. Confirmed canonical formula input component `src/components/textbook/TextbookFormula.tsx` renders `reading-formula-choice` labels `選択`/wrong `×`, existing blue border and aria prompt. P002 CSS on `reading-inline-blank > strong::after` can never affect these Q10 formula choice buttons. No actual source/persisted answer defect, but user-visible clipping remains.
- Review capture #39634288270 FAILED with Q10 internal 300px content against client 213/241 at viewport320 and 283 at viewport390. Build/gov pass is not actual Gate① screenshot pass.
- Created exact revised [P003](./PROPOSAL_P003_CANONICAL_CHOICES_WRAP.md), retaining established button appearance and wrapping only the 2nd Q10 formula line at <=430 CSS px. No CSS write beyond already implemented P002; previous P002 approval and failed screenshots retained. Wait for P003 explicit approval, then implement scoped replace and re-test.

## 2026-10-22 — P-003 approved execution, measured failure, correction stop
- A-P003-01: exact user reply 「承認する。」 recorded in P-003 proposal; only mobile N14 Q10 second logical formula wrap authorized.
- A-P003-02: CSS `b893eb39e2ac9e27c713cc7ef6a14243bbc3d24f` removed the P-002 invalid formula-button selectors and introduced narrow two-visual-line CSS grid. No learner React, source/data/answers, progress, existing N11/N14, main, host edits.
- A-P003-03: focused Playwright `89bc465b2fa990d97e070ca92cc7c4d7e2187ff9` now verifies actual six formula parts, the canonical full-size blue/red choice buttons, mobile grid/desktop flex, aria/focus/keyboard, wrong/hint/retry and normal Q09→Q10→Q11. Existing screenshot copy names `p002-*` remain workflow-compatible transport labels; they do not imply visual approval.
- A-P003-04: initial approved formula-row padding .12rem failed at 320 marked review (216px vs 213px); P-003 allowed container-only padding adjustment to zero in `98de588ec8950b62b745aa397bc7d94a3276799e`.
- A-P003-05: [real Chrome review run #39642196191](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39642196191) **still FAIL** at marked 320; other five selected genuine route/width tests passed. [Raw actual screenshot artifact](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39642196191/artifacts/12364463820) retains successful-state images; the failing 320 marked screenshot itself is not in that artifact, so do not claim otherwise. The failed Playwright assertion/log is the numeric proof.
- A-P003-06: no further learner-code/CSS changes authorized after P-003 stop rule. Diagnosed `review.css` review-only padding and prepared **unimplemented** exact P-004 proposal. No Gate① human acceptance or main merge.

## 2026-10-22 — P-004 approved CSS-only implementation and actual evidence
- A-P004-01 USER APPROVAL: direct unqualified 「承認」 responding to exact P-004 proposal. Previous P-003 execution approval preserved; no release rights.
- A-P004-02 IMPL: `f058ec38a6e21f2925fc4535c34d0c741f356046`, exactly `src/review/review.css` adds at widths <=430px `.review-preview [data-testid="review-mark-n14-formula-10"] { padding-inline:.4rem; }`; same commit records Approval and Work scope. Compare commit with prior head `666a7c5b9d5ec79e0ec798c82b081a8170ce4220`; no common formula/button/lesson data changed.
- A-P004-03 TEST: [real Chromium #39643764980](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39643764980) PASS 6/6 selected width×normal/review cases. Bot screenshot commit `044525020a58394361f2fb0a3be711b617b781a5`, images [GitHub path](./evidence/p002-gate1/README.md) (old filename/description P002 is historical workflow copy; do not rely on caption for actual source version). Verified image blobs of 320 normal, 320 review before/wrong/final, 390 and desktop. [P-004 corrected Gate① sheet](./GATE1_P004_N14_Q10_REVIEW_SHEET.md) binds them to tested `f058ec38a6e21f2925fc4535c34d0c741f356046`.
- A-P004-04 FULL REGRESSION: [Math Textbook CI #39643764939](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39643764939) SUCCESS at exactly `f058ec38a6e21f2925fc4535c34d0c741f356046` including N04–N14, N11, N12, Physics textbook and Maths Practice setup. [Math practice pilot #39643765326](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39643765326) SUCCESS; [Governance #39643764970](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39643764970) SUCCESS; [PR #107](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/107) still Draft.
- A-P004-05 USER HANDOFF: [GitHub-image review comment](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/107#issuecomment-6322494573) and Work review sheet. **Await N14 Q10 Gate① `細部OK` or `要修正` only**. Do not mark block visual acceptance, overall Gate② or Gate③ DONE.

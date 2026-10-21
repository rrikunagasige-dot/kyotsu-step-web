# W-MATH-018 — ACTION LOG
Status: IMPLEMENTING

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

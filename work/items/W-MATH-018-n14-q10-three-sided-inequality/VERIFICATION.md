# W-MATH-018 — VERIFICATION
Status: NEEDS-FIX
Updated: 2026-10-22 JST

| Check | Status |
| --- | --- |
| P-001 exact execution approval by user | APPROVED: direct 「続けて」 |
| Scoped N14 Q10 implementation | IMPLEMENTED IN DRAFT PR ONLY |
| Original 16 N14 Word source marker IDs retained | SELF-CHECKED; automated verification pending |
| Three formula rows, one explanation, five independent holes | IMPLEMENTED; real screenshots pending |
| Correct numeric answers and sign | Static maths checked; separate focused unit test awaiting CI |
| N14 revision6→7 selective archive | IMPLEMENTED; focused source and history tests awaiting CI |
| Previously approved Q07/Q08/Q12 and F01 unchanged | Diff scope confirmed; automated regression pending |
| Original Word embedded equation glyphs | UNVERIFIED: Library indexed text yes, raw OOXML no |
| Gate① exact-SHA live Chromium + user `細部OK` | NOT READY / PENDING |
| Gate② independent audits and other affected N14 Q14/Q15 | NOT CROSS-VERIFIED |
| Gate③ full SHA-matched playable app + user `総チェックOK` | FINAL-REVIEW-NOT-READY |
| main/public app | NO MERGE / NO PUBLICATION |

Do not mark a CI PASS or user acceptance until results obtained. Keep older accepted P-008 screenshot SHA and approval records protected.


## 2026-10-22 P001 actual image audit and CI result
- Real Chromium Gate① capture #39629959612 successfully stored genuine 320/390/1440 screenshots. Source SHA e1e913f2230c42175bc5e67a53e726d030752634, evidence commit 06643939685a06f6d3c23046b3b85730a5cc4244. VISUAL FAIL/NEEDS-FIX at 320 and 390: Q10 formula row's last incomplete operand clipped. Full screenshot defect proof P001_GATE1_VISUAL_DEFECT.md; Gate① cannot be offered.
- Math CI #39629959584 overall FAIL: original Q07/Q08/Q12 E2E revision6 expectations obsolete under Q10 revision7, six mobile cases; the source/maths/unit schema, build and smaller E2Es passed prior stage. Test-only correction 0b63f8a1fc9b6d70d8ce6c0f90732345d431e8a9 must be rerun. No P002 CSS changes implemented.
- Need new P002 exact responsive CSS proposal approval and 320/390 real screenshot no *inner* scroll/clipping before human Gate①. Gate② open, full Word OMML still UNVERIFIED, sibling Q14/Q15 open; Gate③ FINAL-REVIEW-NOT-READY.

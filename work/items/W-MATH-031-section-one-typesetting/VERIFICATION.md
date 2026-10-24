# N01 local checkpoint — 2026-10-24

- Build/type compilation PASS.
- Changed TS/TSX ESLint PASS. Whole-repository lint still has24 pre-existing errors in untouched files; not reported as passing.
- Lesson/history/shared-formula tests:43 files,471 tests PASS.
- Protected math practice, physics/domain/figure tests:11 files,120 tests PASS.
- Canonical author generator reproducible; no generated lesson/ledger diff.
- Independent polynomial132 + written141 checks PASS; current408 equations and668 distractors PASS.
- Data/domain/figures unchanged from published53216a82; canonical lesson SHA256012a17753605a42c51428f6075eb5d59a5724af0c762e0e9b598c82ad7cb871b.
- Existing legacy-layout regression:414 seeded views,2184 formula groups,21 interactions PASS.
- New N01 actual-layout audit:104 seeded views,360 formula groups,4 wrong/hint/correct interactions PASS at320/360/390/1440px. Within-block and authored cross-block relation alignment, actual glyph/control bounds, centering, short equation rows and label collision checked. Max center delta0.0078125px.
- Actual390px stage10 screenshot visually inspected: short equalities on one line, equations29–31 share relation position; no large blank gaps.

Seeded geometry is not a learner playthrough or user acceptance. CI must play the compiled and hosted N01, verify exact source manifest/routes/reload/history, then audit hosted geometry. Publication pending at this checkpoint.

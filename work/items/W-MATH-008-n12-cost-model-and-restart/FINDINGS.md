# FINDINGS — W-MATH-008 / P-001
Status: OPEN

- F-001 | ERROR-SPEC / ERROR-QA: Old P-002 exempted Q10–Q11 as "word-to-expression" even though constructing T(x) itself has independently meaningful operations. A count of answer stages alone missed the gap.
- F-002 | CONFIRMED: Baseline N12 had 15 source questions plus 11 P-002 localized stages. New data has 9 additional meaningful stages, 35 total, with all prior IDs/answer values retained by static read-only comparison.
- F-003 | CONFIRMED: Previously stored revision-1/2 answers must be archived before starting revision-3, and manual reset must clear active N12 answers and UI cursor—not merely navigate back.
- F-004 | ERROR-QA: First CI run reported governance failure because proposal-only W-MATH-008 dir lacked ACTION_LOG.md, FINDINGS.md, VERIFICATION.md and executable proposal status. Follow-up Work record repair, not a Constitution change.
- F-005 | RISK: Long math answers can overflow **inside** formulas without overflowing document; dedicated internal scrollWidth checks added, requires browser CI confirmation.
- F-006 | CONFIRMED sibling-content issue to triage separately: N02-Q05 labels the gap "係数" but expects formula term "0x" (src/data/textbook/math/numbers/n02Lesson.ts revision 1, lines 84–90 and 158–159). No N02 learner change authorized under P-001; separate correction proposal required.

# Authoritative 4-mode location and release-state checkpoint
Status: ACTIVE SNAPSHOT | Date: 2026-10-10
Repo: `rrikunagasige-dot/kyotsu-step-web`; ID `1391122224`
Verified app-main commit: `6e398f923c45fe895e53bc1f0f055f038acc41b6`
[Main release PR #50](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/50) | [GitHub Pages SUCCESS](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38055876654)
Refetch the live HEAD before each future task.

| Subject / mode | Published result in main | Canonical implementation | QA boundary |
| --- | --- | --- | --- |
| Math / Practice | 87–120 all 34 guided questions | `src/data/mathPractice/`, `src/components/learning/MathPracticeReadingFlow.tsx`, `docs/MATH_PRACTICE_87_120_FINAL_QA_FINDINGS.md` | prior-result compaction; release QA + CI |
| Math / Textbook | `math-sets` published; 4 other units are `review` and hidden | `src/data/textbook/math/`, original Word mother, `src/pages/TextbookUnitPage.tsx` | Math textbook mobile+desktop CI PASS; user hands-on review still separate |
| Physics / Textbook | Chapter1 1A–1G seven internal units, three visible chunks | `src/data/textbook/ch01/chapter1Continuous.ts`, `docs/physics-ch01/` | chapter1 regression and Pages build PASS |
| Physics / Practice | 3 standalone guided questions plus textbook worked-example adapter | `src/data/questions.ts`, `src/data/textbookPracticeQuestions.ts`, `src/pages/LearningSessionPage.tsx` | not a full published Physics practice bank |

## Provenance / source divergence
Before PR #50, Pages pinned old `2127c3d4...`, which had Math textbook `math-sets` but not the latest main Math Practice 87–120. The math textbook candidate `chatgpt/math-textbook-sets-v1` was selectively integrated into the existing main in PR #50, preserving Physics and Maths Practice. PR #31 itself remains an unmerged draft, and its review units were NOT promoted. Pages workflow now uses the triggering main commit.

`paulfields83/kyotsu-step-web` is a separate upstream source for historical Work OS and different subject data; it is not the app target. The upstream and target numbered practice questions are NOT interchangeable.

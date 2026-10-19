# 関連作成物のスマホ数式影響確認 — Gate ②

Status: PASS (scoped rendered-browser right-end accessibility of four related review lessons); fresh N01/N03 Word OMML source match is now separately PASS in `SOURCE_DIRECT_RECHECK.md`. Final app Gate ③ remains NOT-REVIEWED.
Exact tested candidate SHA: `4212ee2a851e8eaa6fb34ac390f9b6e7a9026f50`.
GitHub Actions: app [39209590187](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39209590187) SUCCESS; governance [39209590046](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39209590046) SUCCESS.
Approved scope: W-GOV-008/P-003 Gate ② cross-artifact impact of N01 long inline formula. Prior math lesson authoring is W-MATH-003/P-001; do not re-author it.
Candidate before this verification-only change: `2c3f1716947315f64ba8d438eaea7b0b38944bbc`.

| Unit | Test scope | Initial evidence | Result |
| --- | --- | --- | --- |
| N02 r1 | 12 decisions; 13 source formula blocks; 51 visible formula/choice spans inspected at 320px, 13 at completed 390px | Actual ordinary route, rendered inner scroll and root-width checks | PASS (scoped) |
| N09 r2 | 18 decisions; 19 source formula blocks; 80 visible formula/choice spans at 320px, 19 at completed 390px | Actual ordinary route, radical/negative terms; figure fidelity excluded | PASS (scoped) |
| N10 r1 | 21 decisions; 20 source formula blocks; 84 visible formula/choice spans at 320px, 20 at completed 390px | Actual ordinary route, long radical and conjugate choices | PASS (scoped) |
| N12 r3 | 35 decisions; 32 source formula blocks; 139 visible formula/choice spans at 320px, 32 at completed 390px | Actual ordinary route, long inequality and money formulas; figure fidelity excluded | PASS (scoped) |

## Method and interpretation
- Browser automation visits ordinary `/#/learning/textbook/math-numbers-expressions-nXX` routes, clears only ephemeral test browser localStorage, answers all items using existing repository answer values solely to reveal every later screen, and does not assert independent mathematical correctness.
- At each stage it inspects *rendered* formula/choice spans: document overflow, KaTeX error, inner scroll to rightmost visible fragment at a 320px viewport. After completion it rechecks every source formula at 390px. This does not test Word OMML provenance or prove all content mathematically correct.
- If a test fails, check selectors/assumptions before calling it an app defect. Preserve failed-run evidence and re-run corrected verifier without lesson edits. If a genuine lesson/layout bug is established, log the exact reproduction and request a new CMD-WORK-001 approval before changing learner UI/source.
- No `src/` edits, original source edits, deploy, Vercel, merge, production/public environment or billable action in this evidence run.
- At this test-run SHA, original DOCX/OMML was still UNVERIFIED after 403. The subsequent explicit new user attachment now resolves source identity/maths for the two Gate ② targets; see `SOURCE_DIRECT_RECHECK.md`. These phone tests alone never authorized Gate ③, publication or a merge.

## Exact CI outcome / classification
- `e2e/review-p003-related-mobile.spec.ts` mobile Chromium **4/4 PASS (17.7 s)**; all 86 decisions unlocked with existing keys; 84/84 source formula blocks observed by the end at both 320px and 390px; each visible formula/choice line scrolled to its rightmost bound, with endpoint visibility, root-width <= 1px, and no `.katex-error`.
- Existing N01/N03 review interaction and cross-block E2E, 27 scoped Vitest, typecheck, eslint, build and authentic screen capture steps all PASS in same run. No learner UI/source changes were introduced.
- This is **NOT proof of one-frame full expression fit, visual non-overlap in every animation, independent answer correctness, or exact Word OMML fidelity**. On narrow phones some equations require their intended inner horizontal scrolling; their right ends were accessible. No confirmed new cross-artifact regression in these tested surfaces.
- `main` rechecked unchanged at `154a16ff379321016f4692bb0ac6fe9a8a596214`. No merge, production release, new hosting, Vercel action or payment.

Version provenance for this impact ledger: `src/data/textbook/math/numbers/n02Lesson.ts` revision 1, `n09Lesson.ts` revision 2, `n10Lesson.ts` revision 1, `n12Lesson.ts` revision 3, all status `review` and originally prepared under approved `W-MATH-003/P-001`. These revisions were read from the exact P-003 candidate, not inferred from filenames.

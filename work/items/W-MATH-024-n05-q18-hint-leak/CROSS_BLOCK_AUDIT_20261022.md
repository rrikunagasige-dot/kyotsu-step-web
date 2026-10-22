# W-MATH-024/P-001 — N05 Q18 post-correction §12B independent impact audit
Status: **IN-PROGRESS / CONFIRMED SIBLINGS NOT YET FIXED / NOT CROSS-VERIFIED**
As of: 2026-10-22 JST
Origin: N05-Q18 hint before fix directly gave \(r=-1,s=3\). Approved user 「可以」 and exact one-text-line change.

## Scope & evidence
- P-001 approved: one hint change in `src/data/textbook/math/numbers/n05Lesson.ts`, student item `n05-18`, original unit revision2, 20 question markers and figures `n05-f01/f02` unchanged.
- Real browser testing of source SHA `7112121f1976c5d3ddb10e32c81ced665c9bd958` produced 18 genuine Noto CJK JP screenshots at 320,390,1440 in immutable image commit `3728e9a3cdd23f360bec9f2205a150c62bae285b`, [#39796060750](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39796060750) **SUCCESS**; screenshot [Gate① sheet](./GATE1_N05_Q18_REVIEW_SHEET.md) is prepared but explicit user `細部OK` / `要修正` **not received**.
- Full math textbook workflow [#39797852305](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39797852305) **SUCCESS** at exact `5d9be0e0ba53a3d29cecb37b4c377a57a3acc28a`. Governance [#39797851985](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39797851985) and Review [#39797852142](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39797852142) **SUCCESS** at same SHA.
- Compare source screenshot SHA → tested SHA: only evidence PNGs/README and Work docs; learner lesson, review IDs, CSS and test code unchanged. In comparison to accepted N13-Q05/Q08 base `4502f92bc25abddaa90b8e6673d990c7a4a17867`, N05 lesson change is exactly the Q18 wrong-only hint; revision, answers/distractors and old history untouched.

## Scoped verification grid
| Surface | Status | Evidence / precise limit |
| --- | --- | --- |
| N05 Q18 original task, source IDs, correct result | PASS | `(x-1)(5x+3)=5x²-2x-3`; Q18 remains one original marker / one graded choice; total N05 20/rev2. |
| Hint no longer leaks the sought pair | PASS | New hint uses explicitly **wrong** pair r=1,s=-3, rs=-3 yet s+5r=2≠-2; correct pair is not in the after-wrong hint. Four focused N05 Vitest cases and actual browser Q18 wrong-hint preview verified. |
| 320/390/1440 Japanese + actual wrong/retry | PASS (technical) | Native Chrome photos at `3728e9a3cdd23f360bec9f2205a150c62bae285b`, one numbered `確認①` for Q18, normal/review before/wrong/complete; typecheck/build and screenshot action successful. |
| Learner progress / previously accepted N13 | PASS within regression scope | No change to unit revision, item IDs, grading options, saved progress; accepted N13 Q05/Q08 review marker states were inherited as 'accepted' and source untouched. |
| Math/physics and phone/desktop regression | PASS (technical) | Full textbook CI #39797852305, 27 recorded successful steps including dedicated tests, N04–N14 and physics regression. |
| N05 Q18 user small-block Gate① | **UNVERIFIED** | User replied `继续` to progress, not a direct `細部OK`/clear acceptance of image. Preserve `BLOCK-CHECK-PENDING` pending explicit confirmation; never infer whole-app approval. |
| §12B same-root impact — N05 Q11 | **FAIL/confirmed not corrected** | `q:11` asks for integer pair with product -16, sum -6. Wrong-only hint still gives `−8と2` = target pair. [W-MATH-025/P-001](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/work/W-MATH-025-factor-hint-leak-qa-proposals-20261022/work/items/W-MATH-025-factor-hint-leak-qa-proposals/PROPOSAL_P001.md) exists as proposal only; user approval pending. |
| §12B same-root impact — N06 Q12 | **FAIL/confirmed not corrected** | `q:12` asks for last factorization of `(x+y)(x²+x−2)`. Wrong-only hint gives `2と−1` = correct factor pair. [W-MATH-025/P-002](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/work/W-MATH-025-factor-hint-leak-qa-proposals-20261022/work/items/W-MATH-025-factor-hint-leak-qa-proposals/PROPOSAL_P002.md) exists as proposal only; approval pending. |
| Broader original Word / unsupported parallels | UNVERIFIED outside scanned scope | Source authoring of N04–N14 and key root-relevant snippets examined, but limited heuristic exact-answer comparisons cannot establish full exhaustive pedagogy. N05 Q17 and N07 Q13 not counted as proven exact answer leaks. No blind bulk edit. |
| Gate② final CROSS-VERIFIED | **BLOCKED** | N05 Q11 and N06 Q12 confirmed unresolved; user Gate① Q18 also open. Re-run §12B second pass after separately approved fixes. |
| Gate③ playable full app / production | NOT READY | Draft PR #113 not merged; no SHA-matched authorized deployed app URL or user `総チェックOK`. N14 Q16 Gate① separately pending. |

## Next sequence
- Preserve Q18 authentic photo and human Gate① review sheet; do not mark accepted or remove its marker until user explicitly approves the image.
- The two new proposals are *separately approvable*: W-MATH-025 P-001 N05-Q11 and P-002 N06-Q12, each hint one line only. Neither has source code changes; both need exact user approval before edits. Original Q18 approval does not automatically apply.
- Finish linked corrections, document unique root-lesson without duplication in canonical `docs/MASTER_APP_LESSONS.md`, repeat relevant audits, only then consider Gate②. Gate③ requires separate authorized SHA-matched playable app and full user playthrough.

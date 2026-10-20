# W-MATH-003｜Gate② 最終横断監査（W-GOV-008/P-003 既存様式）

Status: **CROSS-VERIFIED (bounded N04–N14 creation+corrections; Gate③ is NOT an app release acceptance)**
Date: 2026-10-20 JST / Auditor: ChatGPT, independently evaluated original-source Word and real app CI/screenshots.
Work/approved proposals: W-MATH-003 / P-003-R1 + exact P-004, P-004-R1, R2, R3, R4, R5.
**Frozen candidate learner app / CI SHA (40 hex):** `ad77318b37e90b9c39150b14ee706283b3f59355`.
Image evidence commit: `0c8177880ee6d71a441d02da7655a04c8c5ce47c` (18 new R5 images), plus 66 previously accepted R2–R4 images.
At gate close, branch `work/W-MATH-003-p003-r1-n04-n14-batch-20261019` head `66fbad544d1fa6e358f588b8d141d9f3591b9507` (documentation + image commits after frozen code SHA); GitHub compare `ad77318...`→`66fbad...`: **36 paths, all .md or .png**, no newer learner code modifications. Future branch documentation commits require repeating this no-code-diff check.
Original source: teacher Word 212,863 bytes, SHA-256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa` (teacher-edited text, not independent publisher solution booklet).
Scope: newly produced MathⅠ「数と式」N04,N05,N06,N07,N08,N11,N13,N14 (123 source question labels, 127 interactive choices including N04-Q01 decomposition, 9 exact original PNG diagrams), with regression on older approved math textbook N01/N02/N03/N09/N10/N12, Maths Practice, Physics Textbook; Physics Practice data and deployment outside change scope.

## Existing Gate① source acceptance and review history

- Initial eight-unit consolidated original gallery: user 「結構いいぞ。承認する！」, historical Gate① visual approval.
- P-004/R1 first 10 corrected items user acceptance already recorded; R2/R3/R4 next eleven screenshot batches accepted in subsequent user progression. All historical screenshots/approvals are retained, not renewed here.
- **Newest P-004-R5 three new problem screenshots**: user replied **「ok続けて」** directly to 「R5の3問、細部OK と伝えてくれれば…」 on 2026-10-20 around 22:32 JST. Interpretation: **R5 3 screenshots (N06-Q15, N08-Q10, N13-Q08) accepted for Gate① visual check**, rather than pretending exact literal 「細部OK」 was typed. [R5 18 genuine browser images + earlier 66](./evidence/n04-n14-gallery/README.md); tested SHA and state/width links visible. This is `BLOCK-VISUAL-OK` **only**, not app play or permission to publish.
- No additional correction requested in user's acceptance message.

## Audit ledger (template §12A; all applicable surfaces)

| Surface | Target | Status | Exact evidence / observation | Applicable exceptions |
| --- | --- | --- | --- | --- |
| Original Word/IDs/wording fidelity | 8 new Math Textbook lessons; 123→127 | **PASS** | [Phase2 51-source-question source/distractor ledger](./GATE2_PHASE2_INDEPENDENT_KEY_DISTRACTOR_AUDIT_20261020.md), [Phase3 72-source-question ledger](./GATE2_PHASE3_REMAINING_SOURCE_DISTRACTOR_AUDIT_20261020.md), [R5 independent 3-item corrected addendum](./GATE2_P004_R5_POST_REPAIR_INDEPENDENT_AUDIT_20261020.md), source Word SHA and `src/data/textbook/math/numbers/newBatchCoverage.test.ts` | Publisher's separate official solution book was not provided: pass means independently derived verification against supplied teacher Word, not publisher cross-confirmation |
| Algebraic reasoning, dependencies and answer values | All 123 original and 127 app decisions | **PASS** | 51+72 original questions independently checked; 53 SymPy cases and prior 48 overlapping independent claims supplementary; each of three R5 changed responses explicitly derived and checked | Do not add 48+53 as distinct complete original questions |
| Correct answers and distractor types | Every guided item, 381 current wrong candidates | **PASS** | Per-ID source-to-app problem audit, 381/381 authored wrong candidates checked; three R5 question keys + nine changed false alternatives independently recomputed; four choices unique and KaTeX-valid in exact candidate CI | Mathematically equivalent partial intermediate answers rejected only when the original source demands completion or minimum operations; documented in phase ledgers |
| Premature answers, hints and next-question leaks | Original stage leads, preceding after/intro, gated figures | **PASS** | Approved P-004/R1/R2/R3 first-answer repairs + 5 prior-prose leak fixes, source-order and no-preanswer unit tests; post-repair source-to-learner audit and original screenshot check | No known confirmed open related defect in this frozen source |
| Figures, equation layout and correct source assets | Nine PNG plus SVG/KaTeX, R2–R5 states | **PASS** | Original figure byte SHA/position test, `textbookDisplayLines` lossless three/two-line tests, production SVG decode, 320/390px screenshots, image SHA `0c817788...` | R5 three revised questions now two complete visible lines; old R3/R4 visual fixes preserved |
| Wrong→retry→hint→correct and chapter navigation | 24 repaired question groups × 320/390; all 127 correct operations × mobile/desktop | **PASS** | [Full Math CI #39419920062](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39419920062) **SUCCESS** at frozen SHA; E2E wrong/hint/retry/resolved/reload, all 127 correct-path actions, chapter catalog/review checks | Automated browser pass != user Gate③ playthrough |
| Shared UI + affected cross-mode regression | Existing six Math Textbook units, Physics Textbook, Math Practice | **PASS** | Same [full CI](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39419920062): typecheck, ESLint, Vitest, build, original N01/N02/N03/N09/N12, physics textbook and math practice smoke | Physics Practice question bank itself unchanged and not targeted by the source diff; no new physics-practice material tested |
| 320/390 phone and desktop; scroll/overflow | Changed 24 Q, full original workflow | **PASS** | Playwright 24 repaired wrong/right at explicit 320 & 390, N07/N11/N14/R5 per-formula `scrollWidth≤clientWidth+1`, 127-item Pixel7/desktop path, genuine R5 18 screenshots inspected | This is representative responsive QA for unmodified text blocks; not manual checks of every old cell at every phone width |
| Learner progress persistence/reset; review-only isolation | N06/N08 R5 v1→v2→v3, N13 v1→v2; N07/N11/N14 R2 v1→v3; all old units | **PASS** | `effectiveTextbookProgress` targeted archive and selective reopen unit tests, E2E actual persisted correctly resolved after reload / localStorage isolation, `status:review` unaffected | User's production data never migrated in public main; evidence from isolated browser/local tests |
| Previous approved blocks and corrections | P-004/R1/R2/R3/R4 and six old Math Textbook units | **PASS** | Historical Work + screenshots; source-code diff from `ad77318...` to evidence branch only docs/PNG; same full CI regressions and old acceptance history preserved | Older global app-wide hands-on acceptance never claimed |
| Unchanged Physics Practice source & deploy pipelines | No change requested | **NOT-APPLICABLE** | No Physics Practice file edits under W-MATH-003; source branch Draft/unmerged; production/Pages and Vercel untouched | Cross-mode smoke only for affected existing Math/Physics Textbook/Math Practice; separate app-wide Gate③ still includes user accessible UI |

## Correction-first impact sweep

Root causes investigated and resolved: premature lead answers, preceding prose leakage, wrong task cognition even when final number correct, compound formula clipping, preserving revision-specific learner outcomes. Reviewed current new eight plus existing six Math Textbook units, affected shared math UI, and relevant math/physics/practice regressions.
- Previously confirmed F-030/031/032/033/036 and P-004→R5 are now corrected at frozen source SHA, based on R5 post-repair + CI + screenshot acceptance. Old snapshots with FAIL remain **historical** at their earlier code SHA.
- New confirmed material defect at freeze: **none recorded**. No unapproved pending learner-data edit inferred; future discoveries must return to CMD-WORK-001 with exact proposal.
- Visit/revision record: original full source and 381 wrong candidates at R4, three corrected cases/nine changed wrong candidates rechecked at R5; technical regressions all rerun on final code.
- Lesson dedup: existing `docs/MASTER_APP_LESSONS.md`, `docs/MATH_RENDERING_RULES.md`, applicable mode SPECs and P-004–R5 recorded fixes remain the operative authorities. Do not invent extra canonical rules solely to close this gate.

## Cross-verification close checklist

- [x] Each required audit surface is PASS or documented NOT-APPLICABLE, no required FAIL/UNVERIFIED for **bounded W-MATH-003 source/content/review scope**.
- [x] Real screenshot and CI exact code SHA `ad77318...` grounded and GitHub-reachable.
- [x] All discovered corrections P-004 through R5 authorized and re-verified in their exact scope.
- [x] Gate① `BLOCK-VISUAL-OK` on all changed blocks based on user's review responses, including R5's 「ok続けて」; does NOT mean final entire app accepted.
- [x] Final candidate scope recorded below. This Gate② audit is **CROSS-VERIFIED**.
- [ ] Gate③ playable real app URL matching candidate SHA **NOT VERIFIED** (expected: current main Pages SHA differs).
- [ ] Gate③ user entire-app beginning-to-end `総チェックOK` **NOT RECEIVED**.

**Final status**: Gate① `BLOCK-VISUAL-OK` (for accepted changed blocks) / Gate② **`CROSS-VERIFIED`** / Gate③ **`FINAL-REVIEW-NOT-READY`**.
Draft PR #101 remains unmerged; **no authorization to publish, merge or create new hosting** inferred from any Gate①/② acceptance. A separate release/deployment approval is required to present a real tested Gate③ URL. The Work is `VERIFYING`, not `DONE` or `FINAL-APP-ACCEPTED`.

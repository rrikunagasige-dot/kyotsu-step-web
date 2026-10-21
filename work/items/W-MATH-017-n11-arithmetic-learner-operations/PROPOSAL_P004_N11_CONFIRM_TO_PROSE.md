# W-MATH-017 / P-004 — 「確認」の自動区切りをやめ、集合に準じた文章接続へ
Status: PROPOSED — USER REVIEW, NOT IMPLEMENTATION AUTHORITY
Date: 2026-10-21 (JST)
Work command: CMD-WORK-001「修正」
Superseding scope: P-003 is still historically approved and its Q01/Q05 code is preserved; P-004 is an additional **material pedagogical layout/flow revision**, not silently included in the earlier approval.
Main baseline: `15ae503455bc6ae75b080caa1c4919cafb250027`
Current PR: [#107](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/107)

## User's latest review feedback
The lesson should read as a coherent mathematical text. A separate generic "確認" label feels like the start of an unrelated quiz; the original accepted 集合 lesson did not do this. Criticism concerns the actual learner lesson, not a failure to add enough interactive blanks. Any yellow `確認①` frame in GitHub **review-only evidence** is an annotation and must not be confused with actual learner `確認` marker.

## Root cause established by exact source comparison
- `src/data/textbook/math/set/setLesson.ts` uses `example` markers named `例題` with following natural paragraph/inline choice. No learner `check` marker found in the approved Set source.
- `src/data/textbook/math/numbers/newBatchGuidedSteps.ts` automatically emits a `marker` for **every** authored group; unless explicitly proof/override, later groups receive `kind:'check'` / text `確認`. It then emits a new group-intro paragraph and separated per-question lead/formula/after.
- `n11Lesson.ts` reuses generated groups 2/3: `n11-marker-2`, `n11-marker-3` automatically say `確認`. This labels genuine new mathematical development as repetitive practice and breaks prose continuity. By contrast `n11-marker-1` `導出` legitimately distinguishes proof from example.
- Multiple other numbered-expression units also call this helper, so changing helper globally affects previously approved material. The old P-003 focuses on inline thinking; it did not explicitly approve a changed `例題/導出/確認` section hierarchy.

## Exact proposed correction (first affected, reviewable N11 small blocks)
1. **Transition Q04→Q05, group 2:** In N11's assembled readingFlow only, omit generated `n11-marker-2` (`確認`). Retain the meaningful existing heading `変形して解の範囲を残す` and stable group/choice IDs. Revise `n11-group-2` introductory prose from an isolated definition into a natural consequence of the preceding proof, e.g. 「不等号の向きを保つ操作と逆転させる操作が分かった。次はその規則を使って、不等式を解こう。不等式を解くとは、一つの数を当てることではなく、成り立つすべての実数の範囲を求めることだ。」 Then Q05 prose should continue directly with `3x-2<5` and inline operation/actual right-side arithmetic. Delete redundant “次は” phrases only if they repeat the same transition; do not leak the answers.
2. **Transition Q10→Q11, group 3:** Omit generated `n11-marker-3` (`確認`). Retain meaningful heading `括弧・分数があっても同じ規則`. Replace `n11-group-3` with a transitional paragraph, e.g. 「これまでの不等式と同じ考え方は、括弧や分数がある場合にも使える。まず式を展開・整理し、どの操作で不等号の向きが変わるかを確かめよう。」 Then retain approved Q11/Q14 derivation/hole arrangement and avoid answer disclosure.
3. **No global generator patch yet:** inspect every automatically inserted `確認` across N04/05/06/07/08/11/13/14, compare each with the accepted Set lesson, classify `KEEP-AS-MEANINGFUL-SECTION / OMIT-GENERIC-LABEL+CONNECT-PROSE / UNVERIFIED`. Do not delete `例題` or `導出` or mass-transform previous accepted blocks. Any additional content-bearing block modification outside the two N11 transitions requires its own exact proposal/approval before implementation.

## Exact code scope
Allowed upon new explicit approval: `src/data/textbook/math/numbers/n11Lesson.ts` readingFlow N11 group 2/3 transitions and local paragraph text; focused source/order/leakage tests and existing real-browser evidence for those transitions. Do not alter common `newBatchGuidedSteps.ts`, `TextbookUnitPage.tsx`, `src/review/review.css`, shared generator, original Word/math figure bytes, Q01/Q05 or other stable graded answers, progress archive/revision 7, or main/Pages.

## Distinction between learner labels and Gate① review annotations
- The learner-facing generic `確認` marker is the subject of this proposal.
- Yellow `確認①` is **only** a marker on the existing GitHub Gate① screenshot and is required by `WORK_SYSTEM §12A`; it must never be embedded into the actual app.
- Existing normal-app screenshots are used for **reading-flow** assessment, not the yellow frame. This proposal does not invent/rewrite Gate①.

## Acceptance tests
- Original accepted Set source still unchanged. N11 has no learner `n11-marker-2` or `n11-marker-3`, but keeps `n11-marker-1` `導出` and all meaningful section headings.
- Q04→Q05 and Q10→Q11 read as connected math prose, not a quiz card; Q05 still grades +2 and 5+2 separately without premature `3x<7`, and Q11/Q14 proof decisions remain untouched.
- Stable 123 original Word mapping, N11 24 interaction IDs, old revision-6 archived progress and unaffected N01–N14/math practice/physics unchanged.
- QA: TS/lint, source integrity, failure/retry, 320/390/1440 normal learner screenshots, independent cross-audit §12B. Gate① new affected transitions must have real screenshots + user `細部OK`. Existing accepted blocks are not reaccepted. Gate③ remains whole real app play by user after separate merge/publication authorization.

## Risks / rejection
- Removing all markers or headings blindly may erase real proof/example distinctions; prohibited.
- The word '確認' inside an ordinary explanatory sentence is not by itself forbidden. The defect is an independent generic **status label**, which breaks the lesson sequence.
- Prior P-003 Gate① Q01/Q05 screenshot evidence remains an authentic earlier candidate, but **does not automatically accept** a newly modified transition.

## Approval
Await explicit approval of **this P-004 as written**. No code changes under P-004 until then. Upon any modification request, revise P-004 and present it again.

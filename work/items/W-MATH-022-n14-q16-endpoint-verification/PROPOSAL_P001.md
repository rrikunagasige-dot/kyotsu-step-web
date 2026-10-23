
## 2026-10-23 — current accepted candidate reconciliation
User visually accepted all five items with 「続けていいよ。5件承認。　後仕事はまたどれぐらい残っているのか私に状況説明」, then authorized continuation 「おけいいよ。じゃ続けて」. **Q16 Gate① is BLOCK-VISUAL-OK; no repeat acceptance required.** Older pending statements below are historical.
This branch reconciles the exact accepted Q16 lesson from e64fd99b18ba167364c2dd6b108a6f7fef76f439 into PR118/e4f9cbe850379d0dd30d1a5c9484e8bdf606390d. Preserve current N13 rev3/rev4 migrations and all accepted hint/choice changes. Q16 original images remain immutable at f5b15694740325b56077fe64d740c7a7dc8fb22e; [original evidence](https://github.com/rrikunagasige-dot/kyotsu-step-web/tree/f5b15694740325b56077fe64d740c7a7dc8fb22e/work/items/W-MATH-022-n14-q16-endpoint-verification/evidence/gate1). New candidate QA is **PENDING**. [Reconciliation and audit](./RECONCILIATION_20261023.md). Gate② OPEN; Gate③ FINAL-REVIEW-NOT-READY; no main merge or deployment.

# W-MATH-022 / P-001 — N14 Q16 端点の代入・絶対値・境界判定を一つの導出で可視化
Status: APPROVED — scoped Q16 implementation on isolated branch; QA in progress
Date: 2026-10-22 JST
Command: CMD-WORK-001 修正. Canon: WORK_SYSTEM §§12A/12B.

## Purpose and exact scope
N14 Q16原Wordの学習行為: 「前問で得た両端の値を元の絶対値へ代入し、両方を含められると確認する」。現行アプリ q16 は `|-4|=4,\\quad|4|=4` 全体を一括選択し、誤答ヒントも代入結果を先出し。直すのは **N14 Q16だけ**。Q10/Q14/Q15とその既承認表示・4段階Q15 hintは変更禁止。Q16の穴数は原問の学習判断から導き、機械的なQ15の5穴模倣ではない。

## Student-facing content — one semantic derivation group
At the moment Q16 unlocks, the previous completed Q15 range has already supplied endpoints; never show these values before Q15 resolves. Q16 introductory text:
「前問で求めた左端 x=−2/3 と右端 x=2 を、元の |3x−2|≤4 に戻して確かめよう。まず絶対値の中身を計算し、次に絶対値を求める。」

Display original condition with black math:
`|3x-2|\\le4`.

First two formula rows (in ONE derivationId `n14-q16-chain`; native choice C nodes, not dummy static □ in app):
- 左端 `x=-\\frac23:\\quad|3(-\\frac23)-2|=|[C(LEFT_INNER)]|=[C(LEFT_ABS)]`
- 右端 `x=2:\\quad|3\\cdot2-2|=|[C(RIGHT_INNER)]|=[C(RIGHT_ABS)]`

One short prose bridge after BOTH substitution rows, not before either learner calculation:
「元の条件は絶対値が4以下であること。左右とも、その条件を満たすか考えよう。」
Then native text-choice final decision `[C(n14-16)]`, answering 「両端とも含む」. This is the fifth learning action (boundary interpretation), not an extra numeric copy. Following correct final choice, preserve the original end explanation intent, replacing any duplicate premature calculation with:
「左端も右端も絶対値が4となり、4≤4を満たす。もとの不等号には等号があるので、両端とも解に含まれる。」

Before/after ordering: unchanged `n14-after-15` → new Q16 introduction / same derivation frame → original `n14-after-16` role. No new figure, header, lesson section, card or end-of-chapter change. Q16 original source marker remains `N14-Q16`.

## Five graded decisions in reading order (exact keys, types, choices and post-wrong hints)
| Stable ID / role | Type | Exact answer | Three nonduplicate alternatives | Hint visible ONLY after wrong (no target completed answer) |
| --- | --- | --- | --- | --- |
| `n14-wm022-q16-left-inner` — compute 3(−2/3)−2 | formula | `-4` | `4`, `-2`, `0` | 「まず3×(−1/3)=−1を考えよう。今度は−2/3を掛ける。その積を求めた後で2を引こう。」 |
| `n14-wm022-q16-left-abs` — absolute value of negative inside | formula | `4` | `-4`, `2`, `0` | 「たとえば|−3|=3。絶対値は0からの距離だよ。直前に求めた負の数にも同じ規則を使おう。」 |
| `n14-wm022-q16-right-inner` — compute 3×2−2 | formula | `4` | `-4`, `2`, `6` | 「たとえばx=1なら3×1−2を計算する。同じ順序で、今回はx=2を入れよう。」 |
| `n14-wm022-q16-right-abs` — absolute value of nonnegative inside | formula | `4` | `-4`, `2`, `0` | 「たとえば|2|=2。中身が0以上のときは、その値がそのまま距離になる。直前の結果に当てはめよう。」 |
| `n14-16` — decide both endpoints included | text | `両端とも含む` | `左端だけ含む`, `右端だけ含む`, `両端とも含まない` | 「たとえば|−2|≤2は、等号でも成り立つ。左右の絶対値と元の上限4を一つずつ比べよう。」 |

All 5 are locally meaningful: two substitutions, two sign-sensitive absolute values, and final interpretation. The choice/hint presentation must preserve full-size native blue「選択」 and red「×」, wrong state unresolved, replay/keyboard semantics and sequential unlocking; hints are after wrong, not new graded subquestions. Render text/maths as black normal content; never use a static □ to substitute for real interactive choices.

## Planned exact technical change set (not yet authorized)
1. `src/data/textbook/math/numbers/n14Lesson.ts`: replace only original Q16 readingFlow section with a custom 2-substitution-row derivation and final text choice. Keep Q13→Q14→Q15 boundaries/other item arrays unchanged; replace only original Q16 one-item placement with Q16 5-item placement, and map `n14SourceToItemIds['N14-Q16']` to these ordered 5 IDs. `n14-16` is explicitly re-keyed from completed-pair latex to inclusion verdict, so cannot inherit old resolved answer.
2. `rawN14.revision`: 9→10; original source markers 16, active interactions 34→38, canonical figure `n14-f01` still one; no new figure.
3. `src/domain/textbook.ts` progress normalization: new N14 revision9→10 stage first brings versions 1–8 through existing revision9 normalizer; snapshots ALL old revision9 answers/metadata into `archivedRevisions['9']` while preserving pre-existing v1–v8 archive; remove **only active `n14-16`** (old combined semantic) and retain every other previously accepted answer, including all 5 Q15 IDs. New 4 IDs start unanswered and `n14-16` reopens. Invalidate current `completedAt`, preserve it as prior completion metadata; idempotent migration, no duplicate archive mutation on repeat reads.
4. New dedicated math textbook unit tests for 5 answers/options/IDs/flow and source marker count, black maths fragments, no completed-answer leak before resolution, 34→38 actions, sign/endpoint arithmetic, old v1–v9 migration, approved Q10/Q14/Q15 unchanged. Amend any Q15 regression test with hardcoded N14 34/rev9 counts only after inspecting the exact affected assertion; do NOT rewrite Q15 approval logic.
5. Browser QA only after approval: real Chromium 320/390/1440 (both normal and numbered reviewer), no clipped formula/button or horizontal overflow, all five correct and wrong/hint/retry sequences, Q15→Q16 dependency, keyboard and save/refresh/reset; full textbook CI, governance/review CI, and physics/math-practice regression. Record tested learner source SHA and actual GitHub screenshots; then Gate① Q16 only, Gate② independent cross-block audit, Gate③ exact-SHA playable full-app user 「総チェックOK」 after separate readiness.

## Risk controls and independent impact
- `n14-16` semantic rekey without explicit reopen would silently credit a previous bundled answer; therefore revision10 migration is mandatory, not optional.
- Current `makeReviewSteps` is a broad common helper. Its design enables one answer/source marker but is not proven broken; do not edit it. Insert Q16-specific overrides as previously done for Q14/Q15.
- Q16's left/right expressions contain inline C nodes. Render all ordinary KaTeX fragments separately; avoid split unmatched KaTeX `\\left/\\right`; inspect real UI at 320px before claiming visual success.
- Potential sibling issues in other generated blocks are §12B AUDIT/UNVERIFIED, not authorization for edits or evidence of systemic completion.
- Parent branch chain PR#107–110 remain DRAFT; new Work must not merge/publish/host or incur charges. Q10/Q14/Q15 already accepted and never need renewed fine approval for this change.

## Approval boundary
**Q16 implementation approved on 2026-10-22 JST by user's direct 「いいよ。続けて」 to the exact P-001; this is NOT Gate① human visual approval, release, merge or hosting consent.** This is P-001 only. Show exact student text, formula blanks, chosen hints and five answer semantics to user. Approval to implement requires the user's explicit acceptance of this precise P-001. Any changed content requires REVISE-PROPOSAL, fully re-presented and separately accepted. CI passing or "続けて" addressed to another Work is not Q16 authorization.


## Explicit approval record — 2026-10-22 JST
- User immediately replied 「いいよ。続けて」 to the displayed P-001 Q16 design and confirmation request. Exact P-001 authorized for implementation, existing Q10/Q14/Q15 remain protected.
- Work proceeds in isolation; native screenshot review, Gate② and Gate③ remain separate.

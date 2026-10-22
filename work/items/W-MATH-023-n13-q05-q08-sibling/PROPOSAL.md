# W-MATH-023 / P-002 — N13 Q05→Q08 sequential correction and history-safe migration
Status: APPROVED — only scoped Stage A Q05 implementation; Q08 gated by Q05 user visual approval
Date: 2026-10-22 JST
Command: CMD-WORK-001 修正
Historical original P-001 (not approved): PROPOSAL_P001_HISTORICAL.md

## Change in P-002
P-001 improperly combined N13 revision2→3 (9→12 choices at once) with a strict requirement to complete Q05 and obtain its genuine user Gate① before starting Q08. A separately playable Q05-only candidate has 10 choices, and a later Q08 edit on the same revision could silently carry an old completed Q08 answer. Therefore: first Q05 v2→v3 (9→10); after Q05 user's 細部OK, Q08 v3→v4 (10→12). Original Word markers remain nine, and old answers are archived selectively at each transition. This is a material change requiring explicit approval of this complete P-002. The recent generic 「いいよ続けて」 is not approval of an unseen revised proposal or any Gate①.

## Authority, protection and preflight
- Teacher original Word SHA256 93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa, N13 Q05 paragraph 557: 「…それぞれで、二点間の距離を式で書こう。」 x≥1 and x<1 cases, N13-F01 diagram. Q08 paragraph 566: 「絶対値を使わない条件にし、解を求めよう。」 preceding |3x|=6.
- Existing N13 source blob 58d1f6d1172dc216dd6417adf2a276b40163423e, revision2 with 9 original markers, 9 graded choices, N13-F01/F02 unchanged. Prior approved R5 N13 revision1→2 archival migration is mandatory.
- Protect N13 Q01–Q04, Q06–07, Q09; figure asset files/hashes; already approved N14 Q10/Q14/Q15 and Q16 scope, 4-stage Q15 wrong hint; all other math/physics/practice lessons, common helper, main, release and hosting. Q16 own Gate① remains BLOCK-CHECK-PENDING independently.
- Use original black mathematical content and native choice widgets, meaningful holes, no dummy placeholders, preserve original formula and after-wrong feedback controls.

## Stage A: N13 Q05 ONLY — original source question 5, TWO real student decisions
Original N13 figure N13-F01 appears before the target exactly as now. Existing heading unchanged.
Intro: 「|x−1| は点 x と点 1 の距離。数直線でどちらが右にあるかを先に見て、右の座標から左の座標を引こう。」

One derivation group with two independently graded formula choices:
1. When x≥1: |x-1| = [C(n13-wm023-q05-right)].
   - Prompt: 「x≥1 のとき、距離を式で表そう。」
   - Correct answer x-1; wrong 1-x / x+1 / -1-x.
   - Wrong-only hint (not answer): 「たとえば x=3 のときは点3が点1より右。2点の距離はどちらの座標からどちらを引くだろう。」
2. When x<1: |x-1| = [C(n13-05)].
   - Prompt: 「x<1 のとき、距離を式で表そう。」
   - Correct answer 1-x; wrong x-1 / 1+x / -1-x.
   - Wrong-only hint: 「たとえば x=0 のときは点1が点0より右。右側から左側を引く順番を、文字 x に戻そう。」
Only after both are answered: 「x≥1ならx−1≥0、x<1なら1−x>0。どちらも二点間の距離として負にならない。」
Map original N13-Q05 to [n13-wm023-q05-right, n13-05]; all other source markers and original figure unchanged.

### Stage A migration and technical gate
- N13 revision2→3, 9 source markers, 9→10 graded decisions. Q08 remains EXACTLY its existing revision2 bundled question, its item ID, text, distractors, answer and hint unchanged at this stage.
- If old user progress revision1, apply existing accepted v1→v2 migration before this new one. For rev2→rev3 archive the entire rev2 progress under archivedRevisions 2; retain archive1 and original answer history. Delete ONLY active former n13-05 (because its semantics change), leave existing n13-08 and other seven IDs/records unchanged, add new Q05-right unanswered. Old completedAt preserved in archive and previousRevisionCompletedAt; current completion deferred until all now 10 answers resolved. Must be idempotent.
- Add dedicated Q05 source/choice/hint/figure/migration unit tests, update only dependent N13 count/revision snapshots. Real Chromium at widths 320/390/1440: Q01–Q04→Q05 first and second step, wrong/hint/retry/red ×/blue 選択, save/reload, no clipping, original two figure hashes and unrelated regressions. Run all normal CI.
- Generate one actual source-SHA GitHub visual sheet with 2–4 numbered checks for **Q05 only**, then STOP for user's distinct 「細部OK」 or 「要修正」. No Q08 implementation before Q05 human Gate①.

## Stage B: N13 Q08 ONLY — after Q05 user Gate①
Intro: 「|3x|=6 では、はじめに絶対値の中身がとり得る二通りの等式を作り、それぞれを x について解こう。」

One derivation group with three independently graded decisions:
1. From |3x|=6, select BOTH sign branches [C(n13-wm023-q08-branches)].
   - Correct formula: 3x=6\;\text{または}\;3x=-6.
   - Wrong: 3x=6\;\text{かつ}\;3x=-6 / 3x=6 / 3x=-6.
   - Prompt: 「中身3xがとり得る二つの等式を選ぼう。」
   - Wrong-only hint: 「|y|=3なら、正の位置と負の位置の両方がある。その2通りを今の中身3xに当てはめよう。」
2. Positive branch: 3x=6 ⇒ x=[C(n13-wm023-q08-positive-root)].
   - Correct 2; wrong -2 / 6 / \frac12.
   - Prompt: 「3x=6 の解を求めよう。」
   - Hint: 「たとえば2u=6なら両辺を2で割ってu=3。ここでは係数3を使おう。」
3. Negative branch: 3x=-6 ⇒ x=[C(n13-08)].
   - Correct -2; wrong 2 / -6 / -\frac12.
   - Prompt: 「3x=−6 の解を求めよう。」
   - Hint: 「たとえば2u=−6ならu=−3。負の方も同じ正の係数3で割ろう。」
Only after the third answer, show x=2 または x=-2, explaining that they are alternative roots, not simultaneously required. Map source N13-Q08 to [n13-wm023-q08-branches, n13-wm023-q08-positive-root, n13-08].

### Stage B migration and technical gate
- N13 revision3→4, nine teacher source markers, 10→12 graded decisions. Archive whole revision3 progress as archive3 preserving archives1/2. In active progress, clear ONLY old bundled n13-08 record and add the two new Q08 answers empty; keep both already approved Q05 Stage A records and all other seven original answers. Prior completion preserved in archive and previousRevisionCompletedAt; current completedAt deferred. v1/v2 historical progress migrates chained v1→v2→v3→v4, never jumps with missing historical steps. Tests for idempotence and no accidental old Q08 resolved state.
- Add dedicated Q08/hint/KaTeX/progress/revision tests; run native CI and real 320/390/1440 Chromium with wrong-hint-retry, persistence, figure hashes, Q05 regression and accepted review-marker suppression.
- Produce separate Q08 numbered genuine SHA-matched visual GitHub sheet; STOP for user's explicit Q08 「細部OK」 or 「要修正」. Later Gate② independent cross-block math, hint and progress audit; Gate③ needs separately approved verified full-app playable SHA and user 総チェックOK.

## Approval and STOP
**P-002 received implementation approval 2026-10-22 JST:** the user's direct 「いいよ続けて」 immediately answered the preceding exact P-002 approval question, with no changes requested. Scope is Stage A Q05 now; Stage B contingent on separately explicit Q05 「細部OK」. This is NOT Q05 Gate① itself nor N14 Q16 Gate①. Short vague continuation, viewing the links or approval of N14 Q16 cannot count. If the user requests different copy, keys, revisions or scope, REVISE-PROPOSAL and ask again before any code edits. No merge, public hosting, billing or deployment permission requested.

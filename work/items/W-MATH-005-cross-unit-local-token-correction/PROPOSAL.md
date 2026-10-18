# W-MATH-005 / P-001 — 承認済み作成単元の式内計算穴（R3）修正案

Status: APPROVED
Created: 2026-10-18 JST
Command: CMD-WORK-001「修正」
Origin: W-MATH-004/P-002 F-012 and P002_R3_IMPACT_LEDGER.md; WORK_SYSTEM §12B
Approved by user: YES — exact direct message 2026-10-18 JST: 「N12の公開とW-MATH-005/P-001を承認する」
Implementation: AUTHORIZED on isolated W-MATH-005 branch; app main/Pages NOT AUTHORIZED

## 1. 問題と原因
N12で指摘されたのと同じR3問題――計算すべき係数・積・中間値がすべて完成した状態で出る、あるいは式全体の選択肢に隠れる――が、承認済み作成のN01/N03/N09の特定箇所で確認された。数学的な最終結果の正誤ではなく「その計算を生徒自身が式中で埋めていない」という学習操作の欠落。N02/N10では同じR3条件に当たる未訓練の局所操作を確認できず、既習後の全式選択は保持する。

Source evidence on main f4d3ab40a27808a3ecb56c379efbe16a3fe19be4:
- N01 / n01Lesson.ts blob 0bb6f7f24cfeeed74a101aa00e39445afa6e3e00 / Q07: (3−5), (−5+2), (6−3) are printed, but n01-07 selects the entire -2x²-3x+3; three evaluated coefficients/constants are not local answers.
- N03 / n03Lesson.ts blob 2f3c57434a4c30e5cfbe61349278afe224899e83 / Q10: the four product grid is followed by one whole-expression answer 6x²+8x+3x+4 at n03-10; the four separate multiplications are not filled in.
- N09 / n09Lesson.ts blob 07b8523e7b64b5c72d525fa0805d4e211cfb3e00 / Q08: n09-08 chooses the complete 1.41²=1.9881<2<2.0164=1.42² compound inequality; the two exact squared values have no individual holes.

## 2. 修正する学習操作
各候補を**式の中にある1か所の穴**として逐次提示し、誤答で次の穴・図・まとめを開かない。穴で計算した内容はその場に反映し、その後に元のソース問題IDを用いたまとめの選択も残す。見た目はP-002で導入する小型□/局所トークンUIに合わせる。すでに練習済みの末尾の総合問題を無差別に穴だらけにしない。

| Unit / original | 追加する式内局所穴（正答） | 最後に残す原問題 | 現行→提案する回答段階 |
| --- | --- | --- | --- |
| N01 Q07 | (3−5)x² の係数 **−2**、(−5+2)x の係数 **−3**、6−3 の定数 **3**、各1穴 | n01-07 の完成式 −2x²−3x+3 | 15→18 |
| N03 Q10 | 2x×3x=□ **6x²**、2x×4=□ **8x**、1×3x=□ **3x**、1×4=□ **4**。四マス対応を明示 | n03-10 の 6x²+8x+3x+4 | 13→17 |
| N09 Q08 | 1.41²=□ **1.9881**、1.42²=□ **2.0164**、各1穴 | n09-08 の厳密平方から挟む複合不等式 | 14→16 |

Adding 3+4+2 = **9 new local token stages**, preserving **all 42** original answer IDs (N01 15 + N03 13 + N09 14), original answer strings, source marker mappings and reviews. Correct distractors must have exactly one true answer and be independently checked for accuracy.

## 3. 技術と履歴の契約
- Unique noncolliding IDs scoped to these 9 new holes, e.g. n01-r3-q07-x2coef, n03-r3-q10-p1, n09-r3-q08-square141. Do not reuse any original or N12 P-002 answer IDs.
- Each edited unit has its own **revision 1→2** transition; preserve existing solved original IDs, attempts, wrong answers and history. New token IDs begin unanswered. No stale whole-expression answer can count as new token. Archive old completedAt; recompute current completion from 18/17/16 stages. Never blanket-reset other units.
- Reuse proven N12 token styling only via a narrow extension to these prefixes. If N12 P-002 is not merged, treat it as a dependency; do not merge conflicting code or publish implicitly.
- Keep N03-F01 and N09-F01 after Q10, exact source expressions, headings, review status, chapter order and original source-to-item mappings. Do not reveal answers ahead of their holes.

## 4. In scope after exact user approval
Only N01/N03/N09 three cited flows and nine token items; minimally shared token presentation; narrowly targeted progress restoration; focused static/math/domain tests and desktop/mobile E2E; R3 second-pass and work evidence. Create a distinct implementation PR. Do not alter N12 P-002 content by this proposal.

## 5. Out of scope
No N02/N10 changes based on this narrow audit; no unapproved N11/N13/N14 creation, physics, practice mode, source image/Word replacement, unrelated schema refactor, automatic filling of all end-of-lesson choices, or main/Pages merge/publish. Existing N12 P-002 remains a separate verification/release queue.

## 6. Acceptance criteria and verification gates
1. Before/after original answer IDs/strings, maps, image paths/appearance gates identical; 18/17/16 active stages, exact 9 new IDs and correct choices.
2. In-equation math/□/math continuity: computed local value is the actual blank; completion reveals in place. Wrong answers block next step; KaTeX valid, mobile width, touch area ≥44px and keyboard focus.
3. Independent calculation and distractor review, no earlier answer leak.
4. Progress test matrix per unit (new / partially done / originally complete / wrong / reload twice) and unaffected N02/N10/N12, physics and math-practice regressions.
5. All relevant CI: typecheck, schema/Vitest/build, Chromium desktop/mobile first-middle-last, image gate and restored state. Record failed initial attempts.
6. User hands-on acceptance and release/merge require **separate authorization**. Afterwards deduplicate R3 with R1/R2 in docs/MASTER_APP_LESSONS.md; reconcile correction queue, then reconsider paused creation P-003.

## 7. Proposed sequence
P-002 N12 verification and review → exact W-MATH-005/P-001 approval → isolated three-unit implementation → CI/visual QA → user acceptance → independently approved releases → shared lesson deduplication → creation queue review. New user constraints require revised proposal P-002 before implementation.

## 8. Exact approval — granted for isolated implementation only
**「W-MATH-005 / P-001を承認する」** approved only 3+4+2=9 local blanks, original-answer preservation, targeted per-unit safe revision migration, scoped UI, tests, and second-pass audit on a separate branch/PR. It does **not** approve main merge, Pages release, N11/N13/N14 creation or an unlimited sweep.

Approval evidence: user explicitly named W-MATH-005/P-001 and N12 release in one message, without amendments. The N12 dependency was satisfied by merged PR #78 (main 51c184286e5207b189dd7b412643e99c426bc884). No future W-MATH-005 merge or publish authority follows.

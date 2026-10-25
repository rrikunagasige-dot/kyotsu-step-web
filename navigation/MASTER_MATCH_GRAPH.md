## CURRENT — W-MATH-032 / N07修正（2026-10-25）

P-001はユーザー「いいよ続けて」で承認済み。旧N07の六指摘と同型箇所を全41nodeで修正し、本文・選択肢・ヒント・前結果・履歴へ意味属性を接続した。36回答・14段階・revision4・既存storage namespace・第一タイトル受入22bc43baと他モードを保持。

コード正本は `46ea59be61a177bf98edc9f6d26eb6fa7e52b0a6`。CI [40154122715](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/40154122715) SUCCESS：129 workflow、620 applicable learner、39 authoring、6 repair Node、320/390/430/1440pxの全回答・全誤答・前結果・履歴・再開/移行・描画を検証。二件の既知のカタログ不整合は別記録。コード＋同じAIによる実画像監査であり、独立した別AI監査とは呼ばない。

旧形式の診断、モデル不在時の版付きcatalog参照、工程状態、承認された添付設計からIRへの結び付け、JSONキー順に依存しないIR hashを改善。入口は既存の修正/CMD-WORK-001・作成/CMD-WORK-002、production/2。モデルはOFFLINE_ONLY、今回fit・昇格なし。設計承認や内部QAを人間の肯定例へ変換しない。

[Work記録](https://github.com/rrikunagasige-dot/kyotsu-step-web/tree/work/n07-semantic-repair-proposal-20261025/work/items/W-MATH-032-n07-semantic-repair) / [工程ごとのcode・AIの配置](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/work/n07-semantic-repair-proposal-20261025/work/items/W-MATH-032-n07-semantic-repair/WORKFLOW_INTEGRATION_RESULT.md)。

公開は [N07の直接URL](https://rrikunagasige-dot.github.io/kyotsu-step-web/?v=46ea59be#/learning/textbook/math-numbers-expressions-n07)。既存Pagesの公開run [40154568134](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/40154568134) SUCCESS。配信source46ea59be、IR hash、保存namespace、第一タイトルを実HTTPSと公開後操作で照合済み。WorkはVERIFYING、次はG3_FINAL@n07の範囲付きユーザー受入。その後に事後影響sweep/R08/L01を行う。設計承認を教材受入へ転用せず、旧画像票・総チェックの定型句・同じ公開許可の再要求へ戻らない。

以下の旧CURRENT・旧公開承認/画像票手順は、履歴として保持する。現在の具体的な受入・公開方針は上記とWORK_SYSTEM §12Aを優先。

---

## CURRENT — P-004 作成・修正への統合（2026-10-24）

実行入口は既存の作成/CMD-WORK-002と修正/CMD-WORK-001。新規数学教材Workはproduction/2。canonicalな実行codeは `190941bc9d65fb3ed2fa6b52ba90196addf19e33`。CI [40116299835](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/40116299835) SUCCESS。

[実行手順](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/190941bc9d65fb3ed2fa6b52ba90196addf19e33/workflow/INTEGRATION_RUNBOOK.md) / [作成の火柴図](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/190941bc9d65fb3ed2fa6b52ba90196addf19e33/work/items/W-GOV-010-learning-production-workflow/integration/evidence/creation/FIRE_DIAGRAM.md) / [修正の火柴図](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/190941bc9d65fb3ed2fa6b52ba90196addf19e33/work/items/W-GOV-010-learning-production-workflow/integration/evidence/correction/FIRE_DIAGRAM.md)。図の模擬受入を実教材の受入と混同しない。

C/R別・block別の主工程から、既存のsource/solver/教える順/穴/本文/図/IR/compiler/原資料監査/初学者監査/事例/MLを呼ぶ。approval bundleとrelease unitを分け、同じ承認を聞き直さず、完成単元を先に公開・実物確認する。表示変更は解法を保持し、数学変更はfact依存先へ再検査する。Store外の六指摘も修正優先queueへ入る。検証済み子修正は親の不変承認と差分承認を合成して取り込む。旧台帳は明示移行し、旧S工程PASSをR02原因/R03影響へ読み替えない。

workflow120（追加42）・既存learner620・authoring39・production Node19・source/corpus/ML8・legacy27・build・四幅320/390/430/1440のUIを検証。明示的な学習根拠を版付きcatalogへ集め、学習例をそこから生成する。モデルはOFFLINE_ONLY、P-004で再fitや本番昇格をしていない。

P-004は基盤統合の完了。N07の六指摘はOPENで、次に扱う場合もR01/R02→R03→R04の具体案へ進む。教材修正の包括承認へ転用しない。公開app source4fb7a98e、第一タイトル受入22bc43ba、他モード・保存進捗を保持。mainへは実行codeのpinと現在地の5文書だけを反映し、全branch mergeと公開変更は行わない。

tool pinは実行実装の版。教材の最新版はモード正本と実配信sourceから別に固定し、source_sha/source_manifestで対応させる。古いtool checkoutの教材で最新版を置換しない。

以下は過去の記録。現在の制作入口はこのP-004 pinとgovernance/PRODUCTION_WORKFLOW.jsonを参照する。

---

# MASTER MATCH GRAPH — target rriku

## Current — P-003 production workflow implemented

Approved workflow tools are pinned by `governance/PRODUCTION_WORKFLOW.json` to sourcebba4df75 on work/production-workflow-p003-20261024. Read that source’s `tools/textbook/PRODUCTION_README.md` and Work redesign/implementation/RESULT.md before new math-textbook creation/correction.25-node code＋AI＋ML framework; CI40109892971 PASS including four-width browser checks. Use production/1 rather than restoring old screenshot/publication-approval gates. One classifier head was actually fitted but remainsOFFLINE_ONLY; new lesson quality/acceptance is separate. Public learner source4fb7a98e and accepted first-title22bc43ba remain protected. Other mode adoption is not implied. Older entries below retain historical scope.

Status: ACTIVE — governance transfer nodes T00–T06 verified and complete
Updated: 2026-10-10

## Upstream R00–R08 (HISTORICAL; not completed target nodes)
R00 INVENTORY → R01 AUTHORITY → R02 REPOSITORY OS → R03 MODE CANON → R04 BRANCH SALVAGE → R05 MIGRATION → R06 VALIDATORS → R07 CLEANUP → R08 FINAL AUDIT.
These source milestones describe `paulfields83`, not this repository, and grant NO target cleanup authorization.

## Current target graph

```text
[T00 correct repo/owner/id] ──► [T01 upstream 113-file SHA archive]
                                          │
                                          ▼
                                 [T02 Constitution + Work OS]
                                          │
                                          ▼
                                 [T03 four-mode source authority]
                                          │
                                          ▼
                                 [T04 QA + PR #49 SUCCESS]
                                          │
                                          ▼
                                 [T05 main 41a9ce0 ADOPTED]
                                          │
                                          ▼
                                 [T06 W-GOV-005 DONE]

[release PR #50, main 6e398f9, Pages SUCCESS]
                   │
             ┌─────┴────────────────────┐
             │                          │
       [MATHEMATICS]                 [PHYSICS]
       /          \                 /           \
[M-TEXTBOOK] [M-PRACTICE]     [P-TEXTBOOK]  [P-PRACTICE]
 set live     87–120 live     Ch1 1A–1G    3 guided examples
 review:      compact past    3 chunks     + Ch1 adapter
 unpub.       results                     NOT full bank
```

Source map: `navigation/MODE_STATE_2026-10-10.md`.
Math Practice: `docs/MATH_PRACTICE_MASTER_LESSONS.md`, `src/data/mathPractice/`.
Math Textbook: `src/data/textbook/math/`, original mother Word, Math textbook PR #31.
Physics Textbook: `CHATGPT_README_FIRST.md`, `docs/physics-ch01/MASTER_FIRE_DIAGRAM.md`.
Physics Practice: `src/data/questions.ts`, `src/data/textbookPracticeQuestions.ts`.

Always separate Math/Physics, Textbook/Practice, upstream/target. Never infer publication or user approval from folder existence or old statuses.


## Main adoption evidence (2026-10-10)
PR #49 merged to `41a9ce05ed10ffc0ddcdc46a5de84086198ac4cf`. Governance workflows on branch 38057390142 and main 38057462564 both SUCCESS. No product source differences in 174 protected app/deploy files. Mode-specific candidate specs remain proposals, not accepted curriculum changes.

## W-MATH-003 live dependency graph — 2026-10-20 (supplements historical T00–T06 graph)
```
Teacher Word (exact SHA; 123 Q, 9 original figures)
   ↓
W-MATH-003 creation: N04/05/06/07/08/11/13/14 → 127 guided items, Draft PR #101
   ↓
P-004 (8) → R1 (2) → R2 (11) → R3 (5 prose + 1 layout) → R4 (3 layout) → R5 (3 source reasoning)
   ↓
Code SHA ad77318b37e90b9c39150b14ee706283b3f59355
   ├─ Technical CI #39419920062 PASS (127 items, 24 repaired scenarios, math/physics/practice regression)
   ├─ Actual UI screenshots #39419915311 PASS (3 R5 × 2 widths × 3 states = 18; +66 preserved)
   └─ Independent source/distractor audit 123 original Q / 381 wrong choices rechecked PASS
   ↓
Gate① user fine-review (ONLY newly changed R5 three screenshot groups)  ← CURRENT WAIT
   ↓
Gate② independent cross-audit formal acceptance (current math/technical subtasks PASS)
   ↓
Gate③ existing real playable-app URL exact source SHA + user full play + 総チェックOK
   ↓
Separate main merge/public release authorization (not granted)
```
Unapproved global cleanup, Vercel/Pages publishing, source Word changes, physics/practice modifications and billing remain prohibited. Other project nodes retain their earlier status; this graph does not rewrite them.

## W-MATH-003 final Gate status 2026-10-20 (supersedes prior R5 pending visual node)

```
N04–N14 (8 units, 123 Word Q, 127 choices)
   → P-004 through R5 all approved+corrected
   → frozen learner SHA ad77318b37e90b9c39150b14ee706283b3f59355
   ├─ Gate① BLOCK-VISUAL-OK (latest user "ok続けて" for R5 3 screens)
   ├─ Gate② CROSS-VERIFIED (123 keys / 381 wrong, CI/real screens)
   └─ Gate③ FINAL-REVIEW-NOT-READY
              ↓ REQUIRES distinct hosting/publication authorization
       Actual reachable SHA-matching review app URL (NONE VERIFIED)
              ↓
       User beginning-to-end app play + explicit "総チェックOK"
              ↓
       FINAL-APP-ACCEPTED (NOT YET)
```
Latest main GitHub Pages at `537c3cb...` ≠ frozen R5 SHA; Draft PR #101 not merged; GitHub screenshot/PR links are not app URLs. [Cross audit](../work/items/W-MATH-003-numbers-expressions-creation/CROSS_BLOCK_AUDIT_FINAL_R5_20261020.md) / [Gate3 prep](../work/items/W-MATH-003-numbers-expressions-creation/FINAL_APP_WALKTHROUGH_PREP_R5_20261020.md). Do not modify main/hosting/billing without separate explicit permission.

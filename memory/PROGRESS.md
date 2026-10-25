## CURRENT — W-MATH-033 / N08公開・実物確認待ち（2026-10-25）

P-001はユーザー「可以可以按照这个做吧」で承認済み。凍結設計83ea55bcの36node・31回答・12段階を実装し、公開sourceは `ea47dd97f7d323267281915e8d9a7bb92a8e7c03`。内部CI [40162373237](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/40162373237)、既存Pages公開run [40162687421](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/40162687421) SUCCESS。公開workflow commit493b62a866873febc6c46572a29c1b0654f12abb。実HTTPSのrelease.json、source/IR/namespaceと公開後操作を照合した。

[N08を開く](https://rrikunagasige-dot.github.io/kyotsu-step-web/?v=ea47dd97#/learning/textbook/math-numbers-expressions-n08)。320/390/430/1440pxの全31正答・全74誤答・条件付き前結果・履歴・再読込・v1/v2/v3移行・廃止誤答からの再開を実ブラウザで確認。620 applicable learner回帰、N08専用7、authoring39とbuildがPASS。旧版の回答契約変更を先に適用し、元履歴はarchiveへ保存、新しい途中回答を未回答に保つ。初回表示/移行検査の不足と実失敗はFINDINGSと台帳へ残した。

共有Store `work/items/W-MATH-032-n07-semantic-repair/runtime` のR06/R07/G2/G3_HOSTを実行。Workは **VERIFYING / G3_FINAL@n08**。次はユーザーによる公開N08の実物評価。その後、必要な修正または事後影響sweep/R08/L01へ進む。今回の設計承認・内部PASS・公開成功を教材受入や学習の肯定例に変換していない。同じ公開許可・画像票は要求しない。

受入済みN07 source46ea59beと第一タイトル22bc43baの内容・既存storage namespace・他モードを保持。tool pin058c4eaは変更なし。モデルは **OFFLINE_ONLY**、既存の評価済み10件（否定7/肯定3）とfit結果を保持し、N08の新fit/昇格なし。意味/画像監査は同じassistantであり独立した別AI監査とは呼ばない。全repo旧Markdownメタデータ検査の完全PASSは主張しない。以下の旧「未承認/未実装/未配信」は履歴。

---

## CURRENT — W-MATH-033 / N08具体設計（2026-10-25）

ユーザー「行那你继续做N08」を受け、CMD-WORK-001・production/2でN08の修正を開始。[具体案P-001](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/work/n08-absolute-value-design-20261025/work/items/W-MATH-033-n08-absolute-value/PROPOSAL.md) と [全36node](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/work/n08-absolute-value-design-20261025/work/items/W-MATH-033-n08-absolute-value/NODE_DESIGN.md) を作成した。原Word35block/30数式/12問/原図1点を照合し、36思考node・31穴・12段階へ設計。原12採点IDと正答は保持、19新中間回答を追加する案。

共有Store W-MATH-032/runtimeの実台帳でR01→R02→R03→R04を実行し、現在 **R05_APPROVAL@n08 / PROPOSED**。最終意味監査でQ10の答え先出しを発見し、未承認案をreviseしてR04を再検査した。続行依頼を具体設計承認やN08のGold肯定評価へ変換していない。次は現行P-001への具体設計承認→N08限定実装・進捗移行・四幅QA→既存公開アプリの直接URL。同じ公開許可や画像票の承認は要求しない。

候補IR/coverage/compile、12正答契約、元図byte一致、SymPy9恒等式を検証。版付き教訓10件の適用理由を記録。実装・ブラウザ・移行・配信は未実施で、教材全体のPASSではない。N07限定materializerをN08へ偽装利用しない。tool pin058c4ea、N07受入済み公開source46ea59be、第一タイトル22bc43ba、OFFLINE_ONLYモデルは保持。src/public/tools/workflowに今回差分なし。

---

## CURRENT — N07受入完了・担当付き火柴図・実学習（2026-10-25）

ユーザーの「我觉得这部分做的很好了。可以」を、公開済みN07 source `46ea59be61a177bf98edc9f6d26eb6fa7e52b0a6` の範囲付き受入として記録。W-MATH-032 runtimeは事後R03・R08・L01・Z01まで実行済みで **DONE**。六つの元否定例は、同じ公開source・実修正証拠・閉鎖Workに結び付けてVERIFIED_FIXED。再受入・再公開許可を要求しない。

実行tool pinは `058c4ea32474b563487292b583f7a01df4f9c4f1`。CI [40157340081](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/40157340081) SUCCESS：workflow131、corpus/ML等11、既存learner620 applicable、authoring39、build、四幅検証、担当図5画面のタブ・文字切れ検査。肯定評価は修正R01を再開せずL01へ流し、学習特徴から内部ID・証跡文字列を除去。全repo旧Markdownメタデータ検査の完全PASSは引き続き主張しない。

学習データは評価済み10件（否定7・肯定3）。今回追加はN07全体に対する真正な肯定 **1件**。六観点それぞれの肯定を捏造しない。固定済みmultilingual-e5-small encoderとLogisticRegressionを使い、既存layout_discomfort headを2例で実fit。新overall_material_acceptanceは肯定1/否定0のためhead作成保留。2独立family、未知holdoutなし、精度推定不可。モデルは **OFFLINE_ONLY**・advisoryEligible=false、本番昇格なし。legacy modelDisposition=NOT_TRAINABLEは非advisoryを示す旧adapter値であり、trainingRun=true・実fit結果とは分けて読む。

入口は従来の「修正」「作成」。次のWorkでも `work/items/W-MATH-032-n07-semantic-repair/runtime` の共有Storeと履歴を保持して閉鎖根拠を参照する。空台帳へ置換してregistryの閉鎖フラグだけで未処理判定しない。catalog `W-MATH-032/LEARNING_CORPUS.json`、model `W-MATH-032/MODEL_RESULT.json` は上記tool pinに存在。

紹介用の全体・共通・作成・修正・学習の5図は、[presentation](https://github.com/rrikunagasige-dot/kyotsu-step-web/tree/work/n07-semantic-repair-proposal-20261025/work/items/W-MATH-032-n07-semantic-repair/presentation) にHTML/SVG/PNG/Mermaid/担当表として保存。全C/R18工程でAI・CODE・USERの役割と成果物を明示。AIのコード執筆と既存CODEの実行を区別し、同じAIの監査を独立別AI監査と呼ばない。

公開appは上記46ea59beのまま、公開run40154568134 SUCCESS。第一タイトル受入22bc43ba、他モード・保存進捗も保持。今回の作業は学習・担当図・実行基盤の改善であり教材の再配信は行っていない。以下は履歴であり、旧「受入待ち」「fitなし」は現在状態を示さない。

---

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

# PROGRESS — rriku（2026-10-19 追記）

## Current — P-003 production workflow implemented

Approved workflow tools are pinned by `governance/PRODUCTION_WORKFLOW.json` to sourcebba4df75 on work/production-workflow-p003-20261024. Read that source’s `tools/textbook/PRODUCTION_README.md` and Work redesign/implementation/RESULT.md before new math-textbook creation/correction.25-node code＋AI＋ML framework; CI40109892971 PASS including four-width browser checks. Use production/1 rather than restoring old screenshot/publication-approval gates. One classifier head was actually fitted but remainsOFFLINE_ONLY; new lesson quality/acceptance is separate. Public learner source4fb7a98e and accepted first-title22bc43ba remain protected. Other mode adoption is not implied. Older entries below retain historical scope.


## 2026-10-21 W-MATH-012 Q11 accepted implementation and technical gate
**Latest authoritative status:** user 「続けて」 accepted exact W-MATH-012/P-001 one-question Q11 repair. New frozen learner-code SHA `74b73ad275b8aced7ccf99c3ef0ffc943f02d208`; screenshot-only commit `d44ddcca3ae6bbe20cb11fb369d4ccec3764cda4`; [full CI #39519336157](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39519336157) **SUCCESS**, [real screenshots #39519331072](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39519331072) **SUCCESS** with 18 images. Q11 one source question expanded to 3 pedagogical stages (2 added nodes), N11 21 active/14 source markers, new units 134 decisions/123 source labels, original `n11-11` answer/distractors preserved, rev4→5 migrations verified. 320px clipped final formula was independently found and **corrected in the tested code**. [User Gate① Q11 one-source-group review](../work/items/W-MATH-012-n11-q11-derivation-correction/GATE1_N11_Q11_REVIEW_SHEET.md) **PENDING**. N11 Q01–04 prior Gate① **ACCEPTED** and must not be re-requested. Q12/Q14/N14 original-Word pedagogical risks still **UNVERIFIED**, Gate② overall OPEN, Gate③ full app hosted SHA match and user's end-to-end run NOT READY. PR #101 Draft/unmerged; no main/host/release/paid changes. Earlier `W-MATH-012` proposal-only entries below are historical and superseded by this record.

## 2026-10-21 newest authoritative N11 gate status: Gate① ACCEPTED, Gate② §12B BLOCKED
User's direct latest 「いいよ」 = **N11 Q01–Q04 Gate① BLOCK-VISUAL-OK**, actual 54 R4 screenshot views at learner SHA `2ebdf7fbb0c7387ae05753c286b3c457da74e17c`; technical math regression [#39442017686](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39442017686) SUCCESS. Independent Gate② finds **one new confirmed same-root issue N11-Q11** (expansion→x-transposition→constant step collapsed). [W-MATH-011 Gate② impact ledger](../work/items/W-MATH-011-n11-inequality-derivation-correction/CROSS_BLOCK_AUDIT_N11_P001_20261021.md) **BLOCKED for entire inequality scope**, [W-MATH-012 exact single-Q11 proposal](../work/items/W-MATH-012-n11-q11-derivation-correction/PROPOSAL.md) **PROPOSED, unapproved**. Q12/Q14/N14 some derivation risks are not proven defects and have no code approval. Earlier Gate① accepted Q01–04 stays valid; no global Gate② pass, no app Gate③ acceptance/merge/hosting. Master lessons/source Word/learner code unchanged by this audit.

## 2026-10-21 W-MATH-011 Q01〜Q04 実装・技術監査成功
- 承認済みP-001、N11の4原問を9思考操作に分解し、本体修正を完了（教材SHA `2ebdf7fbb0c7387ae05753c286b3c457da74e17c`）。N11全19操作、8新単元計132操作。元の教訓・Word・N11-Q05〜14・画像9点・他モード変更なし。
- [CI 39442017686](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39442017686) SUCCESS；[54枚の実画像 39440719673](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39440719673) SUCCESS。旧rev1/2/3の履歴を保持し、N11-Q03とQ04のみ再回答。旧24修正問、N12、物理、数学練習の回帰PASS。
- **次は新N11 Q01〜Q04の既存Gate①細部チェック**。[4問の実画面確認票](../work/items/W-MATH-011-n11-inequality-derivation-correction/GATE1_N11_Q01_Q04_REVIEW_SHEET.md)。人間レビュー未完了・Gate②該当箇所再監査とGate③実働URL全体チェック未完了、Draft PR #101未統合。

## 2026-10-19 新しい作業位置 — W-MATH-003 / P-003-R1（独立ブランチ）

- ユーザーが最新指示で「N04〜N14をすべて先に実装、各Qでは止めず最後に一括確認」と再明示。旧 N04-Q01-only 承認待ち運用はこの作業に適用しない。こちらからの未承認提案はない。
- [ドラフト PR #101](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/101) で N04/N05/N06/N07/N08/N11/N13/N14 計8単元・原Word123マーカー・127選択段階・元図9点をレビュー専用として実装。旧6単元は変更せず、3教材テーマの並びと短い小見出しを保つ。
- [一括ギャラリー](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/work/W-MATH-003-p003-r1-n04-n14-batch-20261019/work/items/W-MATH-003-numbers-expressions-creation/evidence/n04-n14-gallery/README.md) に、スマホ/PC全単元実画面と元図の表示時点を集約。原問の数学監査・画像SHA/KaTeX/全127操作/既存回帰をGitHub CIで検証。
- `main` の基準HEAD `537c3cbf28d40f45228d8a0c4bdd20327136aa93` を変えない。Vercel・新ステージング・本番公開・課金・削除・統合は未承認。
- **残るゲート**：ユーザー一括細部チェック、修正があれば当該ブランチで再検証、別途の実働アプリ全体総チェックと明示的公開/統合承認。画像は実アプリの代わりの公開リンクではない。Work `DONE` / `FINAL-APP-ACCEPTED` と混同禁止。
- 詳細 Work 記録：`work/items/W-MATH-003-numbers-expressions-creation/P-003-R1_IMPLEMENTATION_RECORD.md`。この日付の段落より下の旧チェックポイントは履歴として保持する。



## Completed app release (separate PR #50)
- Main `6e398f923c45fe895e53bc1f0f055f038acc41b6`, Math Practice Q87–120, Math Textbook `math-sets` published, Physics textbook Ch1, Physics guided representative examples combined.
- [Math Practice CI](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38055477424) SUCCESS; [Math Textbook CI](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38055477427) SUCCESS; [Pages deployment](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38055876654) SUCCESS.
- Other Math textbook units remain review, not published or user hands-on accepted.

## W-GOV-005 — repository OS transfer
- Verified owner `rrikunagasige-dot/kyotsu-step-web`, repo ID 1391122224, public main release baseline.
- SHA-preserved upstream historical archive 113 files and draft Work evidence 11 records.
- Adapted root instruction router, Constitution, Work OS, 4 mode candidate specs and target QA merged in [PR #49](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/49) at `41a9ce05ed10ffc0ddcdc46a5de84086198ac4cf`.
- Current position/graph/state synced with PR #50; post-merge governance check [38057462564](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38057462564) SUCCESS. W-GOV-005 DONE.
- No app/data/Pages code changed by governance port. Target-main merge confirmed, archive 113/113 intact, protected app files 174/174 unchanged; memory close recorded.

## Durable errors
- ERROR-PROVENANCE: upstream `paulfields83` was mistaken for target.
- ERROR-PROCESS: avoid repeated idle CI polling; do independent work while CI runs. After disconnect resume from latest proven checkpoint.
- Each handoff must provide genuine review link, not prose only.

## Next stage
Four imported subject/mode SPECs remain candidate summaries, pending separate comparison with accepted lesson source and user permission. No universal claim of “all four finished”.

## 2026-10-20 W-MATH-003 progress — R5 fully tested, Gate① three new screens pending
- Completion: initial N04–N14 review batch (eight units, 123 original Q, 127 UI choices, nine original PNG), approved P-004 / R1 / R2 / R3 / R4 / R5 corrections, 3 last source-reasoning repairs N06-Q15/N08-Q10/N13-Q08 and selective progress history safe revisions. **Code SHA `ad77318b37e90b9c39150b14ee706283b3f59355`; [full CI #39419920062](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39419920062) SUCCESS; [real image workflow #39419915311](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39419915311) SUCCESS, 18 new R5 screenshots** at `0c8177880ee6d71a441d02da7655a04c8c5ce47c`.
- Independent original-source audit **123/123 prompts, all 381 wrong alternatives, 127 app decisions**; three previously flagged cognitive gaps rechecked post-R5 PASS. Earlier 48/53 symbolic checks overlap, never sum as distinct source proof.
- **Still OPEN:** user **Gate①** fine-review of only 3 newly revised R5 actual screens; formal Gate② paperwork after human gate; Gate③ real code-SHA-matching hosted playable URL with user full play and explicit `総チェックOK`. Draft PR #101 unmerged; protected main/Pages/Vercel and billing unchanged.

## 2026-10-20 final Gate② CROSS-VERIFIED / Gate③ unhosted
Gate① initial eight and prior review blocks already accepted; latest R5 N06-Q15/N08-Q10/N13-Q08 **BLOCK-VISUAL-OK** via user's 「ok続けて」 directly after request, 2026-10-20 22:32 JST頃. Gate② **CROSS-VERIFIED** on frozen app code `ad77318b37e90b9c39150b14ee706283b3f59355`: 123 original Q, 127 guided decisions, 381 authored wrong choices independently checked, 24 corrected error/retry scenarios, all CI and old subject-mode regressions PASS. [Formal Gate2 ledger](../work/items/W-MATH-003-numbers-expressions-creation/CROSS_BLOCK_AUDIT_FINAL_R5_20261020.md).
**Gate③ FINAL-REVIEW-NOT-READY**: PR #101 remains Draft; Pages production deploy at main `537c3cb...`, not reviewed R5. Do not fake a playable URL. Require separate user authorization for a cost-safe hosted candidate, verify SHA and real route on mobile/desktop, then user whole-app play and final `総チェックOK`. [Gate3 worksheet](../work/items/W-MATH-003-numbers-expressions-creation/FINAL_APP_WALKTHROUGH_PREP_R5_20261020.md). No main/public deployment or paid Vercel actions authorized.

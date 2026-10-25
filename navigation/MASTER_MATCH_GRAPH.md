## CURRENT — N09/N10の選択肢順序・因子範囲、全件監査後の修正案（2026-10-25）

公開cb7d30bfへの本人指摘を受け、**W-MATH-035 / CMD-WORK-001 / P-001 / PROPOSED / R05_APPROVAL@n09**。①は単なる整列ではなく「左平方→右平方→比較」の順序、②は和/差全体を掛ける括弧。本人は先に全ミスを調べ、最後に提案書と指示。実装・公開は未変更。

N09/N10の全86node・81回答・282選択肢をsourceと描画経路で監査。確定7群：n09-08の順序、n10-07/15/20の候補の表示段階、n10-q17-factor/q20-factorの括弧、表に隠れたn09-14 afterの不正改行。全node判定と、全4候補の具体表示を含む[修正案](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/work/n0910-choice-order-factor-audit-20261025/work/items/W-MATH-035-choice-order-factor-audit/PROPOSAL.md)、[監査表](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/work/n0910-choice-order-factor-audit-20261025/work/items/W-MATH-035-choice-order-factor-audit/NODE_AUDIT.md)。他14単元は限定同型検索のみで全教育内容の合格とはしない。

提案はID/正答81とchoiceキー282、既存保存を維持。提案IRの構文0エラー、現行潜在エラー1、表示変形8組と括弧2反例を実検算。R01–R04を同じ共有Storeで実行し、USER設計判断待ち。Work内監査コードの必須math.solve入力・影響inventory全block・既存claim再開を修正した履歴を保存し、中央のvalidatorを弱めていない。

W034に版付きの本人否定2件と今回の修正依頼を記録し、W035へ親子接続。W034のG3実物受入は未取得のまま。AI発見5件を本人Gold否定へ水増ししない。学習catalog11件とOFFLINE_ONLYモデルe9dcf354・tool pin058c4eaは不変、今回fitなし。次はこの具体案への判断→限定実装・全経路/四幅/保存/保護検査→同じ公開appへ直接配信。以下の旧「実物評価待ちだけ」は今回の修正提案より前の履歴。

---

## CURRENT — N09・N10実装・公開、実物評価待ち（2026-10-25）

ユーザー「ok。いいよ」で凍結P-001（a442cbe9）の両単元設計を承認。N09 **41node・36回答・11段階**、N10 **45node・45回答・12段階**を実装した。共通readerの条件付き前結果、段階的な穴、等式記録・番号、数式の文中描画、履歴と旧保存移行を含む。承認済み5入力はbyte不変。

公開source `cb7d30bfe666b9123ea51e1fad7e36268507b674`。内部CI [40168250606](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/40168250606)、既存Pages公開run [40168673785](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/40168673785) SUCCESS。workflow `c422776a3db277ea5bb3e5166ec290df191fa6b8`。公開release.jsonのsource/2 IR hash/16units/storage namespaceを実HTTPSで照合し、公開後も両単元を4幅で最後まで操作した。

[N09を開く](https://rrikunagasige-dot.github.io/kyotsu-step-web/?v=cb7d30bf#/learning/textbook/math-numbers-expressions-n09) ／ [N10を開く](https://rrikunagasige-dot.github.io/kyotsu-step-web/?v=cb7d30bf#/learning/textbook/math-numbers-expressions-n10)。320/390/430/1440pxで全81回答と各幅201誤答、履歴・再読込・実保存移行がPASS。N09 v1→既存v2退避→v3、v2→v3、N10 v1→v2を検証。620 applicable learner、専用9、authoring39、build PASS。受入済みN08 ea47dd97・N07 46ea59be・第一タイトル22bc43baと原図を保護。全repo旧Markdownメタデータ検査の完全PASSは主張しない。

共有Runtime W032内でW034両R05/R06/R07/G2/G3_HOSTを実行。優先順を依存関係と誤読した説明を訂正し、Work内直列ready dispatchがnative DAG・承認・receipt検査をそのまま使って両単元を進めた。中央workflow/toolsの変更や品質gateの代行なし。式番号の実glyph重なり、長い選択肢、根号slotの実失敗と修正証拠はW034に保存。画像・意味監査は同じassistantであり独立AI監査とは呼ばない。

**現在 W-MATH-034 / VERIFYING / G3_FINAL@n09・G3_FINAL@n10。次は公開両単元への本人の実物評価。** 設計承認・CI成功・配信成功を教材受入やGold肯定に変換しない。両単元への再設計承認・公開許可・画像票は要求しない。品質評価後は対象単元の修正、またはfresh事後影響sweep/R08/L01へ進む。

N08受入と実学習はW033 DONEのまま。学習は11例（否定7/肯定4）、model e9dcf354、固定encoder、OFFLINE_ONLY、advisoryEligible=false。今回N09/N10の肯定例追加・再fitなし。tool pin058c4eaは不変。詳細 [W034記録](https://github.com/rrikunagasige-dot/kyotsu-step-web/tree/work/n09-n10-guided-design-20261025/work/items/W-MATH-034-n09-n10-guided-design)。以下の「P001未承認・N09/N10未実装」は履歴。

---

## CURRENT — N08受入・実学習完了 / N09・N10具体案（2026-10-25）

ユーザー「我觉得可以.然后机械学习。那下面直接N09，N10。」を、公開N08 source `ea47dd97f7d323267281915e8d9a7bb92a8e7c03` の範囲付き受入と学習依頼として記録。W-MATH-033は同じ共有RuntimeでG3_FINAL→fresh事後sweep→R08→L01実fit→Z01を完了して **DONE**。N08全体肯定1件だけを追加し、個別修正の肯定を捏造していない。

学習は評価済み11件（否定7/肯定4）、3family、固定multilingual-e5-small encoder。全11例の特徴入力hashと全token処理を確認し、既存layout_discomfort headを2例で再fit。overall_material_acceptanceは肯定2/否定0のため作成保留。未知holdoutなし、精度推定不可。モデルは **OFFLINE_ONLY / advisoryEligible=false**。catalog/model/feature receiptは [W033](https://github.com/rrikunagasige-dot/kyotsu-step-web/tree/a442cbe966c074f122907bb7366b1ceb6634ca95/work/items/W-MATH-033-n08-absolute-value)。tool pin058c4eaは変更なし。

次Work **W-MATH-034 / CMD-WORK-001 / PROPOSED / R05_APPROVAL@n09**。[共通P-001](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/a442cbe966c074f122907bb7366b1ceb6634ca95/work/items/W-MATH-034-n09-n10-guided-design/PROPOSAL.md)、[N09全node](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/a442cbe966c074f122907bb7366b1ceb6634ca95/work/items/W-MATH-034-n09-n10-guided-design/N09_NODE_DESIGN.md)、[N10全node](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/a442cbe966c074f122907bb7366b1ceb6634ca95/work/items/W-MATH-034-n09-n10-guided-design/N10_NODE_DESIGN.md)。N09は41node/36回答/11段階、N10は45node/45回答/12段階。既存39採点ID・正答とN09 Q08の4既存途中回答を保持し、42途中回答を追加する具体案。原96block・62数式、19恒等式、coverage/IR/compile、元図byteを確認。共有production/2で両blockのR01–R04を実行した。

N09は条件表→正負の根号→近似→負の整数部分を導き、原図はQ10後。N10は証明前の公式を循環利用せず、平方と符号/非零→公式→有理化の因子→分母→分子を分ける。前結果の本文に条件を残す。N09 v1→v2の既存全退避を先に適用する移行設計。N09/N10用の共通readerを新設し、受入済みreaderを保護する案。

**次はこの新しい具体案への判断。** 今回のN09/N10着手依頼やN08受入を、まだ示していないP-001の承認へ変換しない。具体承認後、限定実装・4幅・全正誤答/移行/保護検査を通した単元から既存公開appへ直接配信。同じ公開許可や画像票の再承認は要求しない。今回learner source/中央tools/workflow/公開版は未変更。公開N08は [こちら](https://rrikunagasige-dot.github.io/kyotsu-step-web/?v=ea47dd97#/learning/textbook/math-numbers-expressions-n08)。N07受入46ea59be・第一タイトル22bc43baも保持。

同じassistantの意味・反証監査であり、独立した別AI監査ではない。全repo旧Markdownメタデータ検査の完全PASSは主張しない。以下のN08未受入/学習未実施、N09/N10未着手の旧記録は履歴。

---

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

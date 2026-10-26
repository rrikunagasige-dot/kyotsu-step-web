<!-- W041_CURRENT -->
## CURRENT — N08は本人未承認、修正具体案W041/P001（2026-10-26）

公開r6 source `e7320590d4af51b7cc0d9faa918485467092a3c0`。本人は改善を認めつつ未承認と明示し、途中穴の不足と入力中の不整列を指摘。W040の技術検査PASSを品質受入へ転用しない。元の受入・画像・指摘・sourceは保持。

- [今回の正式提案書](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/main/work/items/W-MATH-041-n08-inline-derivation-alignment/PROPOSAL.md)
- [全39node/全部品契約](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/main/work/items/W-MATH-041-n08-inline-derivation-alignment/NODE_DESIGN.json)
- [実装/保存/排版/CODE・AI契約](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/main/work/items/W-MATH-041-n08-inline-derivation-alignment/IMPLEMENTATION_CONTRACT.json)

提案：原39node/12段階を保持、重複まとめ3親を自動記録にし、必須30親42決定（construction20親32部品＋局所10回答）。現37決定から5増。完成式の選択を途中へ移し、Q07/Q09は4部品/3段階で前提正答まで後行を出さない。数式baseline/axis・共通frame・番号・44px操作を分離。16親18決定のみ意味同一保存、14親24部品は新ID。r4/r5/r6比較を保持する案。

提案整合の39node/依存/IDと変更14親114候補をCODE検算。Q08の真だが指定計算結果でない不等式の反例を、前行の計算根拠で修正。最小排版機構5caseも確認したが、いずれもr7の本番QAではない。M+A+Bの実担当と相互反証を記録、同一モデル/履歴共有を独立モデル監査と呼ばない。

Status: PROPOSED。今回の依頼は提案書作成。app/CSS/採点/保存/配信/fitは未変更。次はこの固定案の判断。承認後は既存修正工程で実装し公開appへ反映する。画像票承認や公開許可の再質問を足さない。既存modelはOFFLINE_ONLY。返答は日本語。

以下は以前の履歴。
<!-- W041_CURRENT_END -->

<!-- W040_CURRENT -->
## CURRENT — N08 r6 公開・配信検証完了、本人評価待ち

固定コードsourceは `e7320590d4af51b7cc0d9faa918485467092a3c0`（`work/n08-construction-application-20261026`）。共通基盤31b87bd3上にW040のr6を適用。mainは現在地の正本、実装取得はこの固定sourceを使い、main内の古い物理workflow/appコードを一括mergeで上書きしない。

39node/38segmentを保持し、22旧回答＋11新親＝33親、15式中部品。18px/KaTeX1、共通列、現在見える末行の番号、三状態、旧r4/r5比較と保存移行。既存namespaceを維持。旧受入をr6の受入へ転用しない。

CI [40296848940](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/40296848940) SUCCESS。learner637、workflow190、corpus31、production59、math/source88、authoring35+4、比較route4、lint/build。N08全22scalar＋15part/69誤答候補×4幅、132親画像/48配置値。旧r5全34/80誤答、N11全39/109誤答×4幅と旧保存1〜10もPASS。群間の重複を除いた合計とは呼ばない。

Mは統合/Store/公開、Aはdata/math/save、BはUI。BがAの保存を、AがB UI/M routesを実画像で反証。原報告・作者履歴・CI artifactへ束縛。fork-all/同一モデルで盲検やモデル独立ではない。登録捕捉は承認後の準備より後という実順序も保持。

公開run [40299824089](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/40299824089) SUCCESS。publisher `cfd0ff8f`、配信manifestのsource `e7320590`・r6・namespaceを実HTTPで照合。公開版N08全操作・途中保存・旧r5全34/80・N09/N10表示・N11全39/109×4幅もPASS。正式RuntimeのG3_HOSTまでPASS。現在はG3_FINAL@n08で本人の実アプリ評価待ち。公開後artifact sha256はb6b0a05694c8e514f58b16c1d5942e30e9120f62c7adbfcf5493f52bf11b3a8e。記録補完後のRepository Governance Check40300779836もSUCCESS。

- 対象: https://rrikunagasige-dot.github.io/kyotsu-step-web/?v=e7320590#/learning/textbook/math-numbers-expressions-n08
- 比較: 同routeの `?version=5`、`?version=5&layout=original`、`?version=4`。既存 `?layout=original` は旧r5へのalias。
- [実装/39node対応](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/main/work/items/W-MATH-040-n08-construction-layout/IMPLEMENTATION.md) / [検証](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/main/work/items/W-MATH-040-n08-construction-layout/VERIFICATION.md) / [担当火柴図](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/main/work/items/W-MATH-040-n08-construction-layout/IMPLEMENTED_FIRE_DIAGRAM.md)

本人の実アプリ評価はG3_FINALで待つ。既存catalog/modelはOFFLINE_ONLY、今回追加fit/Goldなし。新しい画像票承認や公開の再許可は挟まない。返答は日本語。

以下は旧履歴。

<!-- W_GOV_012_CURRENT -->
## CURRENT — 作成／修正の共通基盤：CODE＋AI＋主担当と2子agent

実装コードは `31b87bd37c2f4837e57c5d6b6c88241ec2a44f04`（`work/workflow-team-construction-20261026`）。mainは現在地の正本で、実装の取得はこの固定sourceを使う。main内の旧workflowコードを新機能の実装済みコードと取り違え、一括mergeで置換しない。

[実行仕様](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/31b87bd37c2f4837e57c5d6b6c88241ec2a44f04/workflow/TEAM_PROTOCOL.md) ／ [C/R工程への配置](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/31b87bd37c2f4837e57c5d6b6c88241ec2a44f04/workflow/INTEGRATION_RUNBOOK.md) ／ [実装記録](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/31b87bd37c2f4837e57c5d6b6c88241ec2a44f04/work/items/W-GOV-012-three-agent-orchestration/IMPLEMENTATION.md)。

- 新規教材Workはproduction/2＋team/1。入口は既存「修正」「作成」。Mが範囲・正式claim・Store・統合を持ち、2子agentが工程別に作者／非作者審査者を交代する。Mの統合も審査する。
- 実task／原報告／作者／対象hashを結合。改名・別block・旧target・未完了resolver・未解決省略によるPASSを拒否。実画像承認の別gateは追加しない。
- construction-layout/1は型付き式中部品・有限候補検算・三状態・実測・意味審査を既存工程へ追加。AIが教え方を決め、CODEが型・数学・描画契約を検査する。
- ローカルNode111、workflow190、corpus31、authoring35+4、build、最終境界51を確認。固定sourceの主要CI [40289658345](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/40289658345) SUCCESS。追加のN08/N11回帰は同jsonの個別状態を参照。相互レビューも実施したがモデル独立性・盲検・OS分離を保証しない。
- N08のactive教材／公開appはc4e7133aのまま。c4への範囲付き否定指摘は未解決で、W040のr6教材・reader・保存移行・公開への適用は次の段階。基盤の完成を教材品質の受入へ変えない。
- 旧版、他単元、既存catalog/modelのOFFLINE_ONLYを保持。本番追加fit・新Goldなし。
- このプロジェクトの返答は日本語。中国語は本人が明示的に許可したときのみ。

[実装済みの役割火柴図](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/main/work/items/W-GOV-012-three-agent-orchestration/IMPLEMENTED_FIRE_DIAGRAM.md)。

以下は以前の履歴。

<!-- W039_CURRENT_START -->
## CURRENT — N08の通常変形を実装・公開（2026-10-26）

本人「いいよまず実装してくれ」で、0aa633dcのW039/P001を承認。原提案SHA256 `c27fd866666af45d35893bac52747ea33b710a4ea4a040ac82be90afacb491ee`を保持。実装source `c4e7133a4fd3def11771077379aacc6e19d3445b`、publisher `65ff3f5f730b8f62bf0e35dfe87101a631dc4ae4`。正本はこのmain metadataと具体Work記録。コードの固定SHAと記録commitを区別する。

N08 stage06〜09の4式列、11既存の数学上の穴、2意味nodeの説明override。34採点ID/revision5/12stageと原r5 leafを保持。r4、変更前r5、以前の保存を維持。原問題・前結果・番号alias・手本の分配行・意味と規則の境界を保持する。NumberedEquationの任意anchorは変形groupのみ使用し、選択肢の数式へ番号が寄る不具合を防ぐ。

CI40272765258 SUCCESS：88数学/反証、139workflow、21source/context、620learner、7newUI、5applicable N11UI、7save、19prior-three-unit、39authoring。N08は34correct/80wrong×4幅、N11は39/109×4幅。旧W038の「N08 readerを永遠に固定」assertionだけは今回の承認済みreader改修で明示的に代替し、6状態の旧fallback一致とprojection parityを必須とした。旧test自体は保持する。公開run40273405766 SUCCESS；同じ4幅のN08/N11実操作、N09/N10表示、実manifest/source/plan/旧leaf hashを照合。

- [N08公開](https://rrikunagasige-dot.github.io/kyotsu-step-web/?v=c4e7133a#/learning/textbook/math-numbers-expressions-n08) / [変更前r5](https://rrikunagasige-dot.github.io/kyotsu-step-web/?v=c4e7133a#/learning/textbook/math-numbers-expressions-n08?layout=original) / [以前r4](https://rrikunagasige-dot.github.io/kyotsu-step-web/?v=c4e7133a#/learning/textbook/math-numbers-expressions-n08?version=4)
- [具体Work記録](https://github.com/rrikunagasige-dot/kyotsu-step-web/tree/0401a9241671011c415f91f7f429368e80438037/work/items/W-MATH-039-n08-grouped-transformations)
- 既存共有RuntimeはR01〜R06/R07/G2/G3_HOST@n08まで実receipt PASS。次はG3_FINAL@n08の本人実物評価。本人の今回の承認は設計・実装承認であり、肯定品質labelではない。
- MLは既存15件/9negative/6positive、以前のfitとOFFLINE_ONLYを維持。W039の新fit/新labelなし。同じAIの別passを独立AI監査と呼ばない。
- 受入済み第一タイトル/N07、旧N08の範囲付き受入、W038/N11など他Workの未済評価を勝手に書き換えない。入口は修正/作成の既存二つ、確認面は既存公開app。画像票承認や同じ公開許可は再要求しない。

<!-- W039_CURRENT_END -->

<!-- W038_PREVIOUS_START -->
## PREVIOUS — 通常変形の基盤とN11を公開、次はN08具体案（2026-10-26）

本人「いいよ。じゃこれで続けて。そして終わったら次はもう一回N08の修正じゃ」でW038/P001/I01〜I11を承認。source `aef34919e630c3772c8ad4329f0aa01dec63e6fe` に通常変形の表示plan・穴契約・source/AST対応・可視projection・同じIR/表示hashの承認照合を実装。入口は既存CMD-WORK-001修正／002作成、production/2。明示planのあるN11 stage05〜06だけopt-inし、39採点ID/revision11を保持。概念・証明・場合分けを一律に圧縮しない。

[公開N11](https://rrikunagasige-dot.github.io/kyotsu-step-web/?v=aef34919#/learning/textbook/math-numbers-expressions-n11) ／ [元のN11表示](https://rrikunagasige-dot.github.io/kyotsu-step-web/?v=aef34919#/learning/textbook/math-numbers-expressions-n11?layout=original)。同じ保存を保つ。確認対象は第5・6段階、境界を読む第7段階は維持。

exact CI40268196468/40268196421 SUCCESS：69数理/反証、139workflow、21source/context、620app、6新UI、7N08保護、19既存3unit、39authoring、4幅の全39正答/109誤答、32描画fixture。公開publisher d3eb6d75のdeploy step成功後、全体run40269350862は図の即時ready判定でFAIL。原図2枚はHTTP200・byte/hash一致。decode待機だけを直した読取専用run40270029827 SUCCESSで同じ公開sourceを4幅全問操作。失敗runを成功とは記録しない。manifestのsource/plan/IR/保存namespaceと実配信を照合し、共有Runtime R01〜R07/G2/G3_HOST PASS。**G3_FINAL@n11はUSERの実物評価待ち。**

旧N08 r4/r5、第一タイトル22bc43ba、N09/N10、他モードと保存を保護。15事例（否定9/肯定6）と既存model0fdba96eはOFFLINE_ONLY/advisoryEligible=false。今回の承認・再開を品質labelにせず、新fitなし。新しい独自フローや画像票承認へ戻らない。

[W038記録・生成火柴図](https://github.com/rrikunagasige-dot/kyotsu-step-web/tree/0aa633dcf6c1acc6e8df718e907cbaae0e8961f9/work/items/W-MATH-038-transformation-groups)。次のN08は全39nodeを監査し、4式列（数学11node＋意味の文2node）/残る26node保持の[W039/P001具体案](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/0aa633dcf6c1acc6e8df718e907cbaae0e8961f9/work/items/W-MATH-039-n08-grouped-transformations/PROPOSAL.md)と全node表を作成済み。N08の教材・公開版は未変更。N11承認をこの未提示のN08具体案へ転用しない。先にこの案の確認から、既存R04/R05へ進む。以下は以前の履歴。
<!-- W038_PREVIOUS_END -->

## CURRENT — N09/N10受入・訂正済み実学習完了、NE02/N11/N12の具体設計（2026-10-25）

本人の「私が言っているのはN09,N10承認の意味」を公開fa0eff27の両単元受入として記録。W035はG3_FINAL両unit→fresh事後sweep→R08/L01実fit→Z01を完了。W034の依頼は子修正完了でresolveし、旧cb7版の受入は捏造しない。

学習は15例（否定9/肯定6）。否定2件の初回metadata-only snapshotを最終監査で検出し、元のsemantic本文/数式/選択肢へ訂正。初回fitは履歴として退避し、同じcase.finalize→ml.trainサービスで実再fitしたsupplemental receiptsを保存した。現役はW035/MODEL_RESULT_CORRECTED.json、model0fdba96e・catalogb1e33add。15入力すべて空でなく全token処理、5family group。実fit可能なのはlayout_discomfort2件のみ。新しい順序/因子観点は否定だけなので分類器未学習、事例検索とルール適用で利用。OFFLINE_ONLY/advisoryEligible=false・未知holdoutなし。tool pin058c4ea不変。

次の依頼「まずN09,N10の機械学習そして次はNE02,N11,N12」を受け、W-MATH-036 / CMD-WORK-001 / production/2 / P-001 / PROPOSED。原108block・50数式、既存78回答/300choiceキーを保持した129node・115回答・41段階の全文設計。全411選択肢の具体表示、前結果/履歴、元図5点のgate、旧版移行を指定。3IR/coverage/compile、16恒等式/6不等式、KaTeX1016件がPASS。実ブラウザ・教材src変更・今回3単元の公開はまだ行っていない。

訂正catalog/modelを同じ共有Runtimeのproduction_contextへ反映し、失効したR02–R04を全3unitで再実行。現在はR05_APPROVAL@ne02（3unit bundleの具体設計承認）。本人の着手依頼をこの新P001の実装承認と同一視しない。次は具体設計への判断→NE02、N11、N12の順に完成単位ごと既存appへ直接compile/公開。N13/N14は範囲外。

提案書と全node: [W036](https://github.com/rrikunagasige-dot/kyotsu-step-web/tree/work/ne02-n11-n12-guided-design-20261025/work/items/W-MATH-036-ne02-n11-n12-guided-design)。学習の訂正経緯・実証拠: [W035](https://github.com/rrikunagasige-dot/kyotsu-step-web/tree/work/ne02-n11-n12-guided-design-20261025/work/items/W-MATH-035-choice-order-factor-audit)。以下は過去のcheckpoint。

---

## CURRENT — N09/N10の7項目を修正・公開、実物評価待ち（2026-10-25）

W-MATH-035/P-001は「おけこれでいいよ。じゃ続けてよろしく」で承認済み。公開source `fa0eff271a97940fad08d83960ae50faeabc81b9`。N09-08は左平方→右平方→比較、N10-07/15/20は候補の表示段階を統一、q17/q20-factorは穴の前後・完成・前結果・履歴で因子全体を括弧へ、N09-14の表に隠れたafter数式も修正した。元の81正答・282choiceキーとrevision、保存履歴は維持。

内部CI [40172128752](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/40172128752)、既存Pages公開run [40172534338](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/40172534338) SUCCESS。workflow `3630df565c0f30f770af2238fa34841ca0528df6`。専用8・learner620・authoring39、build/lint、320/390/430/1440pxで表示順・括弧・全81正答/各幅201誤答・前結果/履歴・reload/resize・旧保存移行を検査。実画像7点を同じassistantが確認。公開後も対象表示と両単元の全操作を実行し、release.jsonの2 IR/既存namespace/受入済み単元をHTTPS照合した。全repo旧メタデータ検査の完全PASSとは混同しない。

[N09](https://rrikunagasige-dot.github.io/kyotsu-step-web/?v=fa0eff27#/learning/textbook/math-numbers-expressions-n09) ／ [N10](https://rrikunagasige-dot.github.io/kyotsu-step-web/?v=fa0eff27#/learning/textbook/math-numbers-expressions-n10)。同じ共有Runtimeで両R05/R06/R07/G2/G3_HOSTを実行。最初のR06で両単元のbundleをatomicにemitし、各R06は自単元のnative compileと照合を実行。**現在 VERIFYING / USER G3_FINAL@n09・G3_FINAL@n10**。技術合格や配信成功を本人の受入・Gold肯定にしない。次はこの公開版への本人評価、対象修正またはfresh事後sweep/R08/L01。

N08/N07/最初のタイトルの既承認・元図・storageを保護。W034凍結5入力とその承認は保持。W034に記録した2つの否定はcb7d30bfの順序/因子範囲に限定し、今回の修正証拠に接続する。W034の旧版を受入済みとせず、W035が現行評価対象。AI追加発見5件を本人の否定へ水増ししない。学習catalog11（否定7/肯定4）、モデルe9dcf354・OFFLINE_ONLY、中央tool pin058c4eaは不変。今回の新fitなし。

詳細 [W035](https://github.com/rrikunagasige-dot/kyotsu-step-web/tree/work/n0910-choice-order-factor-audit-20261025/work/items/W-MATH-035-choice-order-factor-audit)。以下のP001未承認・実装未着手は履歴。

---

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

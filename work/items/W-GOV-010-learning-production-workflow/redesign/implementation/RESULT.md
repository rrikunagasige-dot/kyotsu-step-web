# P-003 ワークフロー基盤・実装結果

コード版: bba4df752bf4f9ad8a4972f57ca303b3f304ea45
ブランチ: work/production-workflow-p003-20261024
実行入口: tools/textbook/PRODUCTION_README.md

## 実装したもの

| 対象 | 実装内容 |
|---|---|
| 工程管理 | 既存Runtime/Storeに25工程を追加。入力・依存・版・claim・再開・差戻し付き火柴図。旧履歴を保持 |
| コードとAI | コード実行artifactとAI request/responseを分離。別工程/古い版/コード失敗をAIのPASSで上書きできない |
| 数学 | 旧多項式検証器とN07厳密分数処理をadapter化。一般論証のAI監査と機械証明済みを区別 |
| 意味と表示 | 本文math・用語・文中の穴・等式等の接続・番号・前結果をtypedIRで保持。元資料の両方向coverage |
| 教える順 | 解法の依存・目的・操作・根拠・局所から全体への復帰を扱う候補生成と監査入力 |
| 穴 | 結果以外のtyped target、判断/関係/選別等の候補、同値誤答・形式・先出し・挿入位置の検査 |
| 過去事例 | Work/chat観測の収集、版・範囲・観点の整理、重複/矛盾/未知label、修正前後のgroup分割 |
| 学習 | e5実モデルの取得・hash固定、特徴生成、実fit、group評価、SetFit実験経路、推論棄権・registry |
| 実消費 | 事例検索から実際の生成/AI監査bundleへ接続。全caseの適用/非適用/未解決の記録を要求 |
| 公開確認 | 承認済みIRのhash、実UI/配信証拠、既存アプリへの公開権限を接続。新規数学教材Workの旧Gate使用を拒否 |

## 実際の学習結果

145件は重複・未確認を含む観測であり、145教師例ではない。現在の明示評価から9件の観点別caseを作った。N07全体のstyleへの称賛は、特定の式変形の表示への否定と別観点にした。承認済み等のmetadata、ID、評価発言を学習入力から除外し、実教材の表示構造と本文を使用した。

実際に学習したのは `layout_discomfort` head。事前学習済みe5の埋め込みからLogisticRegression.fitを実行し、係数・データhash・分割・評価を保存した。過去の『学習しないcatalog』とは異なり、trainingRunはtrueになっている。

ただし、groupを分けた未知評価は成立しないためOFFLINE_ONLY。7観点は片側labelのみで保留。SetFitは完全な文脈が最大長に収まり両classを持つデータが不足し、NOT_TRAINABLE。Qwen比較と候補順位モデルの学習は未実施。実装経路と、現在使えるモデルを区別している。

現段階で制作に使うのは事例検索・規則・コード検証・AI監査。学習済みheadは本番推論でABSTAINを返し、勝手に合格判定へ使われない。良否データが増えた後に評価・shadowを経て昇格する。

## 確認できたこと

- 適用範囲のlearner620、既存authoring39、新Node19、拡張workflow78、Python source/corpus/ML8、旧数学engine27の試験を実施。
- 型、変更したReact/schemaのlint、ビルド、N07の承認済み生成との一致を確認。
- 実モデルのsafetensors・tokenizer・pooling/configをSHA256で固定。
- 25工程は契約fixtureで一巡を確認。実際の非模擬runではS00/S01、版移行、入力変更による失効・再実行を確認。新教材を全工程で制作・受入したという意味ではない。
- F03/F04の実評価が検索からAUTHORING_REQUESTの必須監査へ渡ることを確認。本文修正済みとは扱っていない。
- CIの実行結果はVERIFICATION.jsonを正本とする。以前からのphysicsTaxonomy/questionSchemaの2失敗は除外理由を保持し、合格に数えない。

## 保護と残る適用作業

既存教材データ・元図・ID・進捗・公開教材を変更していない。新しいinline rendererはopt-inで、現N07には登録していない。N07の六指摘はOPENのまま。

次の教材では、この基盤から原本→完全解法→具体設計→実装→実UI→公開を行う。そこで新しいtypedIRを実教材へ適用する。内容の具体設計承認を保持し、旧スクショ票の承認待ちや公開再許可は復活させない。

FIRE_DIAGRAMは実制作runの状態図、IMPLEMENTATION_MATRIXは基盤の実装状況。両者のPENDINGを混同しない。

## 正式な次回入口

main f75bfe73のnavigation/memoryとgovernance/PRODUCTION_WORKFLOW.jsonから、検査済みコードbba4df75を参照する。これは入口と版の登録のみであり、feature全体のmergeや公開教材の切替ではない。CI40109892971 SUCCESS。

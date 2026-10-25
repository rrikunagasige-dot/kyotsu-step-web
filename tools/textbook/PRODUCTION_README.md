# P-004 作成・修正への統合入口

現行の実行手順は [workflow/INTEGRATION_RUNBOOK.md](../../workflow/INTEGRATION_RUNBOOK.md)。入口は作成/CMD-WORK-002と修正/CMD-WORK-001。ブロック、承認bundle、release unitを分け、既存code/AI/MLを各C/R工程から使う。以下は共通サービスと旧版互換の説明。

工程と権限の正本は `workflow/Runtime` とそのStore。Node jobやMLはその課題に接続する制作側ツールであり、学習者の進捗・回答を学習へ自動収集しない。

## 現在使えるもの

- C/R別のブロックDAG、版・claim・属性別hash失効、修正queueと復帰、単元ごとの公開・受入、三階層の火柴図。旧25工程は履歴として保存。
- 旧多項式検証器とN07分数/循環小数の対応範囲付きadapter。未対応はUNSUPPORTED。
- typedIR: 本文/数式/概念/文中の穴、等式等の関係、式番号、前結果、source coverage、未知前提・先出し等の検査。
- 既存組版へ渡すcompilerとopt-in inline renderer。既存N07本文を自動修正しない。
- 過去記録の収集・観点別ラベル・重複/矛盾・group分割、事例検索、実学習、推論の棄権、registry。
- 取得した事例を実際の生成・AI監査bundleへ渡し、全caseの適用/非適用/未解決を要求する接続。

## 実行

Nodeは既存pnpm環境。Pythonの基本検査はlxml、NumPy、scikit-learnを使用する。

```sh
pnpm run test:production-workflow
pnpm run test:textbook-authoring
python workflow/cli.py --help
```

工程の台帳を開くplanには既存のsource/rules/proposal/scope/blocksと `workflow_version:"production/2"` を含める。教材compileには各blockの `content_design_hash` またはapproval bundleの `content_hash` と実IRのhashの一致が必要。旧production/1はproposalの `contentDesignHash` を使用する。基盤設計への承認を、新しい教材内容の承認へ転用できない。

```sh
python workflow/cli.py --root . --store /tmp/production-ledger open --json plan.json
python workflow/cli.py --root . --store /tmp/production-ledger next --work WORK_ID
python workflow/cli.py --root . --store /tmp/production-ledger production-run --work WORK_ID --json stage-input.json
python workflow/cli.py --root . --store /tmp/production-ledger production-ai --work WORK_ID
python workflow/cli.py --root . --store /tmp/production-ledger production-diagram --work WORK_ID
```

`production-run` は実code operationの結果とAI requestを返し、意味監査を勝手にPASSにしない。AI結果を `submit`（AI工程）又は `production-result`（code＋AI工程）へ渡す。claim token、入力hash、検査項目、成果物、根拠、request hashが必要。原資料・文章監査は現アシスタントが実施してimportする既存方式。自動外部LLM呼出しや別agentの起動を行う仕組みではない。

既存N07を起点に生成・監査bundleを作る例:

```sh
pnpm run production --operation prepare --source tools/textbook/fixtures/n07-source-index.json --context context.json --out /tmp/request.json
pnpm run production --operation import-ai --request /tmp/request.json --response response.json --out /tmp/reviewed.json
pnpm run production --operation verify --input ir.json --out /tmp/check.json
pnpm run production --operation compile --input ir.json --out /tmp/compiled.json
```

requestに入った事例すべてに `caseDispositions[{caseId,status,evidence}]` が必要。入力hash/原本hash/単元/原ブロックが変わったresponseは拒否する。IRのmath/term/slot IDはDOM側まで保持し、未描画/未解放の対応を別途検査する。

## ML

専用venvにCPU版torch2.6.0を入れた後、`ml/requirements.txt` を導入する。完全な実験環境の版はrequirements.lock。model weightsをapp/Gitに入れない。取得したe5のrevision・safetensors/tokenizer/poolingの実hashはWorkのENCODER_MANIFEST.jsonへ保存している。

```sh
python tools/textbook/production_cli.py seed < seed-request.json > dataset.json
python tools/textbook/production_cli.py prefetch < encoder-request.json > encoder-manifest.json
python tools/textbook/production_cli.py train --out /tmp/model.json < training-request.json
python tools/textbook/production_cli.py retrieve < retrieval-request.json > retrieval.json
python tools/textbook/production_cli.py predict < prediction-request.json > prediction.json
```

`seed-request` は `{root:repoRoot}`。`training-request` は `{cache:cacheDirectory,examples:examples(curatedCorpus)}`。examplesはcaseの明示labelがある観点だけを抽出する。`TRAINING_EXAMPLES.json` は重複保存を減らす索引であり、textはCURATED_CASESから再生成する。

現実験は9観点別case、実フィットしたheadはlayout_discomfortのみ。7観点は片側labelしかなく保留。family/episodeを結ぶと評価groupが不足するため、学習済みheadもOFFLINE_ONLYで、本番predictはABSTAINになる。追加学習と本採用は別である。SetFitは全文が最大長に収まり両classを持つデータが不足するため実験を保留し、Qwen比較も未実施。未評価を正例にして補わない。

## 公開と次の制作

具体教材の設計承認→内部QA→既存release経路→実配信source確認→直接URL。旧画像票の承認待ち・公開再許可は復活させない。公開操作が未実施ならNEEDS_EXTERNAL_OPERATIONとして止まり、URL queryだけで配信版を判定しない。

P-004の統合実装は教材本文・元図・ID・進捗を変更せず、N07の六指摘もOPEN。次の教材制作では、この基盤から具体設計・実修正・実UI検査・公開へ進む。

## solution/1 の追加

作成・修正の入口は変えず、新形式をplanでopt-inする。具体的なCODE/AI/USER分担、工程配置、実行契約、厳密計算の範囲、任意抽出器、学習と棄権、fixture検査は [SOLUTION_PIPELINE.md](SOLUTION_PIPELINE.md)。旧IR・教材データ・受入状態は自動変換しない。

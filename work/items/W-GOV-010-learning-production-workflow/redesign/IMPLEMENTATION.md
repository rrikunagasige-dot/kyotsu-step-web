# P-003付属書 — 実装計画・移行・試験

Status: PROPOSED。以下の新規module/CLI/testはまだ作成・実行していない。

## 1. 着手順と移行の原則

先に基盤・意味IR・事例接続を作り、次に学習を接続し、最後に教材制作の一巡で検証する。N07の六件をその場で修正して『基盤が完成』としない。六件はまず凍結した回帰fixtureとして使う。

現mainは旧workflow/旧engineを持ち、現featureはN07実装を持つ。**repo全体をmergeして揃えない。** 最初にlive sourceを再照合し、manifestに指定した旧工程ファイルだけをreviewして独立featureへ取り込む。mainのhosting pointerと教材sourceを混同しない。旧ファイルのhash・適用policy・テスト結果を記録し、移植後の実装hashを新規に付ける。

現在の公開source4fb7a98e、第一タイトル受入source22bc43baをbaselineとして保持する。今回の設計文書作成ではreleaseも教材修正もしない。

## 2. 作業項目と具体的な改修先

新規のファイル名は実装予定。既存ファイルはその機能を維持して変更する。

| ID | 作業・改修先 | 入力→成果物 | 主な検査・完了条件 | 依存 |
|---|---|---|---|---|
| T01 | `research/SOURCE_MANIFEST.json`を起点にsource reconciliation | main/feature/live→取り込み差分manifest | owner/ID/HEAD、旧ファイルblob、公開sourceと別であること | なし |
| T02 | `workflow/`を限定移植、`definitions.py`等のpolicy v2 adapter | 旧graph＋review policy→新definition version | 旧イベントreplay、旧G1/G3再許可待ちを復活させない、ユーザー承認を偽造しない | T01 |
| T03 | `workflow/adapters.py`へtextbook job adapter、`jobs.mjs`へ親run参照 | workflow task→既存CLI job＋receipt | 中断・二重claim・hash変更・同一job再利用、工程正本が一つ | T02 |
| T04 | `tools/textbook/ir/`、`schema.mjs`、app schema adapter | 既存plan→共通typedIR | rich token round-trip、relation/term/slot/source保存 | T01 |
| T05 | `source/import-word.py`拡張、`source/coverage.mjs`新設 | 原本→全block対応＋未対応一覧 | 無番号・図注・表・目次・OMML例、逆coverage | T04 |
| T06 | `solver/legacy-polynomial.py`と`solver/n07.mjs`adapter | problem contract→solution graph | capability/domain、旧数式の独立検算、N07の既存39試験を保持 | T03,T04 |
| T07 | `complete-solutions.mjs`を計算/論証receiptへ分離 | solution→検証済/監査待ちの根拠 | 固定証明文を機械証明済みにしない、条件・一般性の反例 | T06 |
| T08 | `planner/candidates.mjs`をprofileと候補比較へ拡張 | graph＋既習→最大3候補 | DAG、局所→全体、次数順の適否、初回/反復の使い分け | T07 |
| T09 | `interaction/`新設、旧bind_blanksのtarget contract改修 | 候補→判断/関係/式生成/計算等の穴 | `.result`以外、typed path、形式・誤答・ヒント・漏洩、4→3ヒント対応 | T08 |
| T10 | `prose/`・`context/`新設 | candidate→全文token＋必要な前結果 | 複数記号scope、元問・表の必要範囲、操作の文接続 | T09 |
| T11 | `compile-lesson.mjs`、`integrate-n07.mjs`汎用adapter化 | approved IR→既存app schema | exact content hash、semantic receipt、非対象差分ゼロ | T04,T10 |
| T12 | 共通inline renderer adapter、`N07ReadingFlow.tsx` opt-in | app tokens→本文/前結果/履歴 | term黒太字・本文math・slot挿入・旧表示保持、共有部分の影響 | T11 |
| T13 | `TypesetFormula.tsx`等にsemantic group adapter | relation group→既存組版 | 等号・番号・折返し・幅、独立式の非連結、受入済みlayout回帰 | T11 |
| T14 | `verify.mjs`分割拡張、`ai/CONTRACTS.md`更新 | IR/visible state→指摘・AIbundle | 事実と自己評価を分離、原資料/初学者監査、根拠と差戻し先 | T08–T13 |
| T15 | `corpus/collect.py`、`normalize.py`、`episodes.py`新設 | 旧36/Work/chat/画像→observation/episode/case | 取得範囲、原文vs要約、版、重複、旧/新Workキー衝突 | T01,T04 |
| T16 | `corpus/labels.py`、`split.py`、export schema | case→curated dataset＋group split | unknown mask、partial praise、修正前後分離禁止、撤回履歴 | T15 |
| T17 | `ml/prefetch.py`、`encode.py`、環境lock | model candidate→hash固定済encoder＋特徴cache | license・safetensors・prefix・長文・CPU実測、model取得失敗fallback | T16 |
| T18 | `ml/train.py`、`evaluate.py`、`registry.py` | dataset→固定head/SetFit候補＋評価 | 実fit、単一class保留、group評価、既知例をholdout扱いしない | T17 |
| T19 | `ml/rank.py`、`predict.py`、`retrieve.py` | 有効候補/文脈→順位/リスク/関連例 | 有効性gate、ABSTAIN、モデル失効・version、pair不足fallback | T18 |
| T20 | S04/08/12/14/16のCLI入力とAI exportを接続 | corpus/model/rules→生成・監査bundle | consumed case IDs、hash、未使用理由。保存だけで終わらない | T14,T19 |
| T21 | authoring/browser CI、旧runtimeテストの統合 | 一巡のrun→source/数学/意味/描画/進捗証拠 | 六反例＋例外、全表示状態、320/390/430/1440、第一タイトル保護 | T03,T12,T13,T20 |
| T22 | 既存release adapter＋hand-off receipt | approved source＋QA→実配信照合・直接URL | screenshot承認待ちなし、URL queryと実source混同なし、中断再公開防止 | T21 |
| T23 | feedback→regression→curation→retrain接続 | 実評価→次run入力 | 一件の評価が次回生成/監査で実消費された証拠、rollback | T20,T22 |
| T24 | 既存memory/Workへの統合、運用ガイド | 実測・残件→正式runbook | mode混同なし、旧記録を消さず現行入口を一本化、未実装を明示 | T23 |

`corpus/`と`ml/`は `tools/textbook/` 配下を第一案とする。旧Work内engineはadapterで利用し、汎用コードを新しいWorkフォルダへ際限なく複製しない。旧engineを共通パッケージへ移す場合はT06内でimport互換とsnapshotを用意する。

## 3. 小さな完成単位に分ける

| Milestone | 対応項目 | 完成時に実際に見せられるもの |
|---|---|---|
| M0 正本・工程接続 | T01–T03 | 旧runを復元でき、新policyでcompile/public reviewへ進めるdry-run |
| M1 意味と検証 | T04–T07,T11のadapter骨格 | 原資料→計算/論証→意味token→app schemaのround-trip |
| M2 教え方・穴・本文 | T08–T14 | 設計案の全文と可視状態、六反例の再現/修正fixture/例外fixture |
| M3 事例回収 | T15–T16 | 重複を除いた実例、正負/未確認、観点mask、版・groupの一覧 |
| M4 実学習 | T17–T19 | 少なくとも成立するheadの学習artifactと比較評価、成立しないものの理由 |
| M5 実消費・一巡 | T20–T23 | 事例・学習結果を使った設計/監査のreceipt、実UI/公開までの接続 |
| M6 運用固定 | T24 | 再開・再学習・rollback・次単元制作のrunbookと実測 |

M3が完了する前に教師例数や学習効果を断言しない。M4の一部headがデータ不足でも、M2の意味検査とM3の検索を先に使用できる。M5の教材適用対象は基盤確認後にその具体設計・範囲で定め、今回の文書承認だけをN07本文修正の包括許可へ変えない。

## 4. 提案するCLIとartifact配置

現在存在するCLIはauthor/verify/compile/export/import-ai/inspect/resume等。以下のworkflow/corpus/mlサブコマンドは新設案で、現在実行できるとの主張ではない。

```text
production workflow inspect --work <path>
production workflow run --manifest <run.json> --until S17
production ai export --run <id> --stage S16
production ai import --request <hash> --response <file>
production corpus collect --sources <sources.json>
production corpus curate --observations <snapshot> --decisions <file>
production ml prepare --dataset <hash> --split <hash>
production ml train --experiment <experiment.json>
production ml evaluate --model <candidate> --split <hash>
production ml shadow --run <id> --model <candidate>
production workflow resume --run <id>
```

全コマンドに `--dry-run`、JSON結果、終了コード、input manifestを用意する。実装時のentrypointは既存CLIから呼ぶ薄いadapterとし、状態はworkflowへ集約する。

```text
Work/redesign                     今回の設計・調査・回収索引
work/<work>/runs/<run>/            工程入力、参照、出力manifest、監査receipt
corpus/snapshots/<hash>/           curated records、labelmask、split manifest
models/<version>/manifest.json    encoder/head/data/split/featureのhash、評価、status
artifacts/<content-hash>          大きい画像・原本・model weights（参照で接続）
```

公開Gitへ必要のない原会話全量・個人情報を大量に転載しない。教材関連の必要抜粋と参照を収録し、取得元と利用範囲を保持する。既存のユーザー添付原本を勝手に外部訓練サービスへ送る前提にはしない。

## 5. 実装する試験

| 試験群 | 必須ケースと期待 |
|---|---|
| source | 無番号定義、図注、表、数式、目次、同じ番号の別章、未読ブロックが見える |
| solution | 対応範囲の厳密正誤、符号・条件、分母0、unsupported、別検算、一般証明の未監査 |
| teaching | 未学習前提、未来結果、A→B→途中A、局所計算後の全体復帰、初回と反復の差 |
| holes | 判断/関係/式生成/計算のtarget、正解先出し、同値誤答、答え形式、文/式内の挿入 |
| semantics | 10の意味、引く対象・向き、relation chain、term初出、math描画予定↔実描画 |
| exceptions | 数字単独が正しい課題、独立式を等号で結ばない、既習参照は漏洩扱いしない、穴なし説明 |
| corpus | 部分称賛、続行のみ、同じ評価の複数観測、後続否定、要約のみ、版不明、Work ID衝突 |
| ML | unknown除外、片側class、group重複、feedback文の入力混入、長文欠落、未取得/未学習ABSTAIN |
| runtime | cache失効、同時claim、AI古入力、途中失敗、resume、公開intent後の中断、モデル昇格の原子性 |
| UI | 未解答/全誤答/全ヒント/正解/compact/history、各幅、長い式・番号、本文math・term・選択肢 |
| progress | 既存解答保持、semantic変更だけ限定移行、reload、旧版保存、未解答の正解化なし |
| release | frozen source、配信manifest、route、asset、第一タイトル、旧スクショgateが新規に挟まらない |

固定fixtureは六指摘の失敗版と想定改善版、例外版を揃える。UI向けの改善fixtureを作ることと、N07本番データを修正することを区別する。新規テストは意味のある失敗・例外・境界を検証し、実装の値をそのまま写したassertだけを増やさない。

## 6. 現在の試験結果との区別

既存N07の適用範囲619 learner tests・39 authoring tests、既存公開/ブラウザ検査は、以前のsourceに対する証拠である。このP-003の新機能が動いた証拠には使わない。全体テストには既存のphysicsTaxonomy/questionSchemaの失敗、governanceには旧4 error/2 warningがある。改修時はbaseとcandidateを比較し、新規退行と既存問題を分ける。

今回の設計作業で確認するのは、文書リンク、JSON構造、sourceの版、工程と作業の対応、事例件数・重複注意、app/runtime未変更である。新しいモデルの学習や新workflowの試験はまだ行っていない。

## 7. 失敗時の戻り方

- 読めない原本: S01/S02へ。未読箇所を推測で生成しない。
- solver未対応: capability=UNSUPPORTED、AI解法＋対応した独立検査/監査へ。機械検証済みと表示しない。
- 教え方の監査不合格: 原因が前提・順序・穴・文章のどれかをfindingで示して当該stageへ戻す。
- AI importが古い: inputHash相違で拒否。旧出力を新入力への合格に流用しない。
- 画像/ブラウザ取得失敗: 実表示未確認を明示し、CI artifact等の既存経路を使う。DOM成功だけで視覚合格にしない。
- データ不足: その学習headを保留、検索/規則/AIへ。架空の正例で埋めない。
- モデル改善なし: 旧版又はcode＋AIへ。学習実施と採用判断を分離する。
- 公開失敗/切断: intentと実配信sourceを照合して再開。二重公開・誤った完了報告を避ける。

## 8. 効率を測る場所

runで `extract_time / math_time / ai_edit_time / audit_time / render_time / release_time / retrain_time / reused_artifacts / invalidated_nodes / feedback_recurrence` を保存する。AI回数だけでなく、人が同じ指摘を繰り返した回数を測る。

最初は小さい候補集合・必要scopeの事例・hash再利用を使う。モデルを大きくした分だけ遅くなる可能性も比較し、設計品質が同じなら費用・確認負担の小さい構成を採る。工期と改善率はT01/M3/M4の実測前に数字を確約しない。

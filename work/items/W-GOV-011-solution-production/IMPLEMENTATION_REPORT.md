# 実装結果 — solution/1

Status: IMPLEMENTED_BOUNDED_RELEASE。既存「作成」「修正」の技術拡張。教材受入・新単元の公開とは別。
承認原文はAPPROVAL.json。具体設計と制約はtools/textbook/SOLUTION_PIPELINE.md。

## どこからどこへ変えたか

| 対象 | 変更前 | 今回の変更・実ファイル | 検査 |
|---|---|---|---|
| T01 資料 | 原本取込と教材対応が中心 | research/manifest.mjs/extract.py/patterns.mjs。参考先の用途、位置、観察と補完、型の前提と除外条件を別管理 | HTML無番号説明・図、WordのOMMLと図だけの段落、hash/許諾の否定試験 |
| T02 解法 | 既存nodeごとの途中操作 | solution/graph.mjs。全体state/from/to/既習/根拠/変数役割を明示 | 孤立・循環・重複fact・未来前提・根以外からの開始を拒否 |
| T03 検算 | N07等の個別検算 | solver/solution.py、solution/verify.mjsへ共通化。提案時の二つのpyを一adapterへ統合 | 符号、不等号、恒等式、代入根拠、開区間、達成点、指定形、区間の穴/重複 |
| T04 穴 | slotごとの設計が中心 | interaction/plan.mjsとIR v2。state時点の前提で候補を絞り、全採否を記録。同一回答を両辺の複数slotへ束縛 | 未来事実をknownFactsに注入しても拒否。値と誤答同値・重複、関係式を含む選択肢row |
| T05 IR | production-ir/1 | ir/v2.mjsと既存dispatch。新reader向けコンパイル、既存v1維持 | 元資料の逆対応、全transitionの被覆、local計算の復帰先、可視状態、対象path、過深入力 |
| T06 本文・審査 | 制作理由と監査の切分けが不十分 | ai/solution-review.mjs、CONTRACTS.md。読者が見た状態を先に渡す | phase/要求hash/出典/事例消化、候補・hint・補助計算の開閉別snapshot。本文の良し悪しはAI判断 |
| T07 UI | 既存reader | SolutionReadingFlow/QuadraticPlot、domain/solutionReading.ts、namespaced CSS。GuidedMathReadingFlowで明示dispatch | 三型×四幅、誤答/正答/hint/再読込/resize、番号衝突、KaTeX、全visible semantic IDs |
| T08 C/R | 既存capability方式 | capabilities/runner/operations、productionのAI要求、graphsのopt-in検証。C/Rへ必須receiptを追加 | 実serviceをnative capabilityから呼出、phaseと実行環境を変えるとcache失効。第三入口なし |
| T09 学習 | 既存観点別head・元評価照合 | corpus/solution_context.py/core.py、production_cli.py、learning.py。可視の一問を既存curation→examples→trainへ接続 | 正答/評価混入拒否、元承認をUNKNOWN、family/episode/inputの分離。新head学習・昇格なし |
| T10 運用 | 既存runbook | SOLUTION_PIPELINE/INTEGRATION_RUNBOOK/PRODUCTION_README/THIRD_PARTY_REFERENCES、Work記録 | 再現コマンド・AI/CODE/USER分担・実行済みと未採用の区別 |

## 実行結果

- 新解法/IRのNode試験：23件PASS。
- 既存を含むworkflow Python試験：134件PASS。実serviceとcacheの新試験3件を含む。
- corpus/ML/source等Python試験：17件PASS。
- 既存教材reader・数学表示・第一タイトル関連：38ファイル、372件PASS。
- 既存authoringとproductionの試験：verification/legacy-authoring.log、legacy-production.logを参照。
- 実ブラウザ：三つの自作例題×320/390/430/1440px＝12シナリオPASS。最後まで操作し、意味IDの描画欠落・横はみ出し・式番号衝突なし。
- 変更したTS/TSXのlint：PASS。TypeScriptと本番build：PASS。
- リポジトリ全体lint：既存の変更外ファイルに25エラー。PASSとは記録しない。既存教材本文や他Workをこの技術改修で修正しない。
- 全repoの全テスト実行は主張しない。今回の関連領域と既存実行器を検証した。

全ログはverification/。画像はscreenshots.tar.gz.base64に全12点を可逆保存し、screenshots.jsonでhashを照合できる。base64をdecodeしgzip/tarを展開するとPNGになる。
最初のブラウザCDN取得失敗は、別途取得したChromium 138で検証を完了した。Playwright/ブラウザの版はscreenshots.json。日本語・式を同じassistantが画像でも確認した。独立モデル審査とは呼ばない。
全体lintは変更外の既存エラーを含む。workflow試験内のfatal git-path出力は、歴史commitに存在しないファイルを探す否定経路の出力であり、最終unittest結果はOK。

## 保護したもの

src/dataとpublicは差分なし。既存の教材本文、元図、回答ID、進捗namespace、NE02/N11/N12の未受入状態を変えていない。
既存IRの実行経路を維持した。新readerを実際の教材で使うには、その教材を具体的に設計し、新IRと既存interaction IDの対応を作る。

## この版でできることと、未採用のもの

この版は一次不等式の直線的な導出、平方完成、数値定義域の二次極値を共通IRで扱う。一般分岐のreader・文字係数の極値全場合分け・根号一般変形は対応外として止める。区間partitionの検査を用意したことと、一般分岐教材を自動制作できることを区別する。
Docling/PyMuPDFの任意adapterは用意したが、日本語原式の精度比較・依存licenseの選定は未実施で、既定採用していない。REFERENCE_MANIFESTは参照先候補であり、原本hashと位置が未固定の項目をREVIEWEDへ偽装していない。
新しい品質観点の元評価と表示版の対応が不足している。CONVERSATION_REQUIREMENTSは要件・UNKNOWNとして保存し、既存W035の検証済みcatalog/modelはそのまま再利用する。新しいfitや性能改善、教育効果を主張しない。

## 技術Workの記録について

今回のローカル実装と試験の後、実成果物を既存共有Runtimeへ復旧登録する。登録時刻以前からnative claimが各編集を指揮していたかのような記録は作らない。承認は会話の元発言を転記し、技術検証・品質評価・教材受入を別に残す。

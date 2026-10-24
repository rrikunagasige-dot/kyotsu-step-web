# P-003付属書 — 既存実装・参考コード・モデルの調査

調査日: 2026-10-24 UTC。一次資料を優先。採用案と実装済みを分ける。

## 1. 既存コードは二系統とも確認した

旧workflowとcoded-authoringはmain `618e2be2a0a4dab9fd853288148829a11b3b0b70` のtreeで存在を確認。前回確認した旧基準 `c4a7aca0e72f15896a54d6753197fca196702aa4` とengine/math_coreが同一内容であることも確認している。mainのファイルが現featureにもあると推測せず、限定移植を実装計画へ入れた。

今回追加で読んだもの:

| ファイル | 確認した内容 | 設計への反映 |
|---|---|---|
| 旧corpus/cases.json | 36件、出所・版・label・family/episode・split・除外理由 | observation/case/exampleを分離、旧labelを保存して回復 |
| 旧corpus/LABEL_POLICY.md | 承認≠品質、UNKNOWN、版/観点、修正前後のsplit禁止 | ML付属書のラベル・分割契約を継承 |
| 旧engine/evaluate.py | 既知拒否の構造再現、合成試験、training false/heldout false | 回帰検出と未知の教育効果を区別 |
| workflow/store.py | 追記イベント、CAS、破損検出 | 工程の正本として再利用 |
| workflow/adapters.py | patch intent/backup、外部操作、authoring、capture、app probe | 既存job/公開接続を拡張し二重オーケストレーションを防ぐ |
| 現行tools/textbook/ai/CONTRACTS.md | 現アシスタントによるexport/import、原資料/初学者監査 | 新規API契約なしでも実行可能なAI providerを維持 |
| N07六反例/analysis | feedbackが生成入力にもcache keyにも入っていない | T20で消費receiptとcache接続を必須化 |
| W028/029/030 findings | recursive insertionの順序失敗、先出し、symbol scope、前結果 | graph/visibility/reassembly/記号scopeに反映 |
| W031と過去acceptance記録 | 強い正式受入と、小範囲のvisual許可の違い | 82観測索引、部分評価と品質ラベルの分離 |

ファイルblobは [SOURCE_MANIFEST.json](research/SOURCE_MANIFEST.json) へ保存した。旧corpusのコピーは調査スナップショットであり、新catalogへの昇格や学習実行ではない。

## 2. 前回の10repo調査を、今回どこへ使うか

元の固定commit・読んだファイル・licenseは [既存調査manifest](../REFERENCE_CODE_SOURCES.json) にある。今回すべてを最新版として調べ直したという意味ではない。採用時は固定版と互換性を再確認する。

| 資産 | 今回の具体的な使用先 | 採用方法／減らす自作 |
|---|---|---|
| Pandoc＋texmath | S02/T05、Word→位置付き数式抽出 | 既に導入した制作時CLIを再利用。OMML変換器を再自作しない |
| Fraction.js | S06/07/T06、分数・循環小数 | 既存N07実装を継続。独立筆算検証は残す |
| Mathsteps | S06/08、operation/substep/全体式復帰 | trace設計と試験の参考。archive済み旧依存一式は導入しない |
| Numbas | S10、穴の位置・補助段階・回答後説明 | gap/partの責務分離をtyped targetへ反映。採点・保存runtimeは交換しない |
| STACK | S07/10、同値・形式・課題要求の別判定 | 既約/式形式などの契約設計・fixture分類。Moodle/Maximaの全面導入はしない |
| PreTeXt | S03/11/12、definition/property/proof/example/task | roleと本文・hint・solutionの境界を参考に既存schemaへ対応 |
| DoenetML | S14/19、条件表示とhint/reveal | state依存・未解放内容の検査を参考。worker/renderer一式は移植しない |
| mathjs | solver拡張の比較対象 | N07はFraction.jsで足りるため新規全面依存を増やさない |
| fast-check | S07/19/T21、境界/状態遷移/失敗最小化 | dev-time property/model test。学習アプリbundleに含めない |

GPL/AGPL等のsourceは、今回そのままコードを持ち込む案ではない。構造を参考にする場合と、ライブラリを組み込む場合を分け、組込みを選ぶ作業で個別license/NOTICEを確認する。参考先の一覧だけ作り、どの工程にも使わない状態を避ける。

## 3. 今回の機械学習の一次資料と実コード

### SetFit — trainerを自作しない

- [公式v1.1.3の解説](https://huggingface.co/docs/setfit/v1.1.3/en/conceptual_guides/setfit)
- [公式multi-label](https://huggingface.co/docs/setfit/v1.1.3/en/how_to/multilabel)
- [公式quickstart](https://huggingface.co/docs/setfit/v1.1.3/en/quickstart)
- [modeling.py](https://github.com/huggingface/setfit/blob/fc2ff4df0eb409724b7caef2126e628a23a5e5ba/src/setfit/modeling.py)
- [trainer.py](https://github.com/huggingface/setfit/blob/fc2ff4df0eb409724b7caef2126e628a23a5e5ba/src/setfit/trainer.py)
- [LICENSE](https://github.com/huggingface/setfit/blob/fc2ff4df0eb409724b7caef2126e628a23a5e5ba/LICENSE)

GitHub connectorでtag v1.1.3→commit fc2ff4dを確認し、modeling.py 40,383文字、trainer.py 39,632文字、LICENSEを取得して読んだ。modelingはLogisticRegression、OneVsRestClassifier、MultiOutputClassifier等を使い、body.encodeからheadへ学習する実装を持つ。公式解説の二段階学習と対応する。

この実装をT17–19へ接続する。標準multi-outputが欠損ラベルを解決してくれるとは考えず、初期は観点別の明示ラベル行のみを使う。SetFitは枠組みであり、日本語教材の良否を学習済みの専用モデルではない。

### multilingual-e5-small — 固定headと転移学習の基盤候補

- [公式model card原文](https://huggingface.co/intfloat/multilingual-e5-small/raw/main/README.md)
- [MicrosoftのE5実装説明](https://github.com/microsoft/unilm/blob/master/e5/README.md)
- [候補revisionのcommit](https://huggingface.co/intfloat/multilingual-e5-small/commit/fd1525a9fd15316a2d503bf26ab031a61d056e98)

公式仕様の12層・384次元、512token、prefix、pooling・正規化を確認した。分類と検索でprefixを変える箇所をadapter仕様へ入れ、長文を黙って切り捨てない条件を追加した。重み取得・当環境での推論・学習は未実施。

### Qwen3-Embedding-0.6B — 長文・強い基盤との比較

- [公式model card](https://huggingface.co/Qwen/Qwen3-Embedding-0.6B)
- [公式モデルmetadata](https://huggingface.co/api/models/Qwen/Qwen3-Embedding-0.6B)
- [著者の技術報告](https://arxiv.org/abs/2506.05176)

公式cardで0.6B・最大32k・最大1024次元・多言語・Apache-2.0を確認した。metadataはrevision 97b0c614…を返した。強い比較候補として残すが、長い文脈が入ることだけで今回の分類に優れると決めない。まず固定埋め込みで比較し、初手から大きいモデルを全fine-tuneしない。

### scikit-learn — 学習・分割・漏洩対策

- [GroupKFold](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GroupKFold.html)
- [common pitfalls](https://scikit-learn.org/stable/common_pitfalls.html)

修正前後・同じ原問・同じepisodeをgroupで分ける設計に利用する。特徴抽出のfit、閾値選択、モデル選択がtestへ漏れない順序にする。今回閲覧したstable docsの版表記を、未検証のPython依存lockと同一視しない。

## 4. 数式の排版研究を意味表現へ反映する

- [amsmath公式guide](https://www.latex-project.org/help/documentation/amsldoc.pdf): 単一式、split、align、独立式groupの役割を区別する。T13はこの区別をrelationとlayout profileに持つ。全出力を同じ独立式にする現在の問題を避ける。
- [KaTeX公式auto-render](https://katex.org/docs/autorender): delimiterを持つtext nodeを探索する仕組みであり、何が数式かを意味で自動判定する機能ではない。T04/11/12でmath tokenを明示し、token→描画の照合を行う。本文全体を後から正規表現で変換することを本命にしない。

これらは紙面をスマホにそのまま持ち込む根拠ではない。受入済みの幅計測・DP・番号衝突処理を維持し、意味グループと実画面を合わせて検証する。

## 5. 取得の限界と未実施

e5のcard通常ページは大きすぎて取得失敗し、raw READMEを読んだ。固定revisionのconfig/modulesも今回の検索経路では取得できなかった。モデルrevisionページの実在確認と、重み一式の完全固定は別である。T17はprefetch・SHA256・pooling・tokenizerの確認まで完了条件に含める。

外部モデルの実力・速度・必要メモリ、学習の改善率は測っていない。今回の提案は調査した実装に基づく実験設計である。取得・訓練・評価を済ませたかのように報告しない。

# AI工程の入出力契約

Status: ACTIVE

実行方法：現行アシスタントが保存された入力と規則に沿って出力し、CLI import-aiで取り込む。新API・別agent自動起動は前提にしない。

## 原資料読解

入力：正本hash/範囲、原本、位置付き抽出、未対応一覧。
出力：原問・無番号定義・性質・図説明の全対応、条件、矛盾、原式の確認。目次を本文と誤認しない。未知語を先に学習済み扱いしない。

## 完全解法と教材編集

入力：problem contract、コード生成trace・候補、既習台帳、適用範囲付き受入/失敗例。
出力：schema適合candidate plan。全nodeに対象/目的/操作/根拠/結果/用途/本人の行為/穴採否/前後の本文/誤答理由/ヒント/図表時点を記録。一般論証は例の計算で代用せず、元条件を落とさない。AIはstateをapprovedへ変えない。

## source/novice監査

入力：原本・要求・候補教材・全表示状態。制作時の自己評価は合格根拠として使わない。
出力：node/state別の指摘、該当文/式、根拠・反例、影響先、修正または未解決。未来結果、未知名称、別例の混入、推導の代行、答えの先出し、説明不足、局所計算後に全体へ戻らない箇所を探す。正常な既習参照を一律漏洩としない。

同じAIが別のpassで実施しても、別モデルによる独立性を主張しない。コードの検算・原本照合・実表示を別経路の証拠にする。本文の監査記録とユーザーの最終受入を混同しない。

## solution/1 の可視先行監査

`solution-review.mjs` を既存C05/R04、C09/R07へ接続する。入力は `visibleFromCompiledV2` の当該状態と原資料参照、phase、適用事例IDである。正答・採点feedback・未来行・未開封hint・制作側の現在行の根拠を先に渡さない。既に読んだ前行の説明は学習者も知る情報として残す。
候補を開く前、開いた後、hint各段、補助計算を開いた後のsnapshotを別に生成する。currentに正答欄がなくても、文章から判断を代行していないかはAIが読む。

出力はlearnerDecision、availableInformation、reasonToProceed、nextWholeState、misconception、reducedSupportVariantとfindings。findingsはproblemId/stepId/state/quoteOrMathRef/reason/affectedRefs/resolutionを持つ。適用事例の全IDへAPPLIED/NOT_APPLICABLE/UNRESOLVEDと根拠を記録する。requestHashとphaseが違えば取り込まない。契約合格は説明の教育的妥当性を自動証明しない。

作成者と同じアシスタントの別passは独立モデル審査と呼ばない。原式照合、厳密計算、実DOM、原評価を別種の証拠として記録する。未対応の数学、一般分岐、Doclingの抽出精度を審査文でPASSへ塗り替えない。

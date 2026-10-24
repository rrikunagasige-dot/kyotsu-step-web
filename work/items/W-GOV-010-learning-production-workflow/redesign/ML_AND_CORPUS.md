# P-003付属書 — 過去事例、機械学習、モデルの実運用

Status: PROPOSED / training_run=false

## 1. 学習を何に使うか

| 用途 | 入力→学習/推論出力 | 制作への戻し先 | 使わない判断 |
|---|---|---|---|
| 類似事例検索 | 今回の問題/設計＋適用scope→似た成功・失敗例 | S04でAIと生成器へ、適用条件・例外付きで渡す | 検索だけを追加学習と呼ばない |
| 観点別の問題検出 | 問題・既習・可視本文・意味IR→各観点の問題リスク | S08候補比較、S14警告、S16監査順 | 数学の真偽・利用権限・ユーザー受入 |
| 候補順位付け | 同じ問題の有効候補A/B＋文脈→好まれる候補の順 | S08/10/11でAIの比較順へ反映 | 高得点だからコードERRORを無視すること |
| 監査の重点選定 | リスク、不確実性、過去再発→優先node | S15/16で深く確認する箇所を提案 | 低得点のnodeの必須監査を省略すること |
| 任意の組版候補比較 | コード制約を満たす複数レイアウト＋実測特徴→順位 | 将来の組版profile比較 | 現在受入済みの組版を初期から学習モデルで置換 |

最初に実装する学習は観点別の分類である。候補順位は同一課題の比較データが回復できた観点から追加する。組版の学習は後段に置く。現段階でコードの等号揃え・幅計測・DPをやめる理由はない。

## 2. 今回回収できたものと、まだできていないこと

[RECOVERED_CASE_INDEX.json](RECOVERED_CASE_INDEX.json) は82の**観測索引**である。

| 出所 | 観測数 | 現在の扱い |
|---|---:|---|
| 旧catalogの原レコード | 36 | NEGATIVE10、UNKNOWN26をそのまま保持 |
| N07の版・node・画像付き否定記録 | 6 | 既知の回帰事例。修正成功・未使用評価ではない |
| 今回の会話文脈にある本人の発言抜粋 | 20 | 正式受入、layout称賛、具体指摘、scope指示を分離 |
| 実ファイルを読んだ過去Work記録 | 8 | 受入対象版・範囲、修正原因、旧承認の解釈を回復 |
| 過去チャット検索の候補 | 12 | 要約のみ。原発言・対象版を回復するまでUNKNOWN |

これは「独立した82事例」「32負例・3正例で直ちに学習できる」という意味ではない。例えば、今回の会話の『10が唐突』とN07-F02は同じ評価の二観測である。第一タイトルの正式受入は会話とWorkの双方にある。重複を統合し、評価された版から学習入力を抽出する工程が残る。82件を36件へ上書きして数を増やすだけの処理はしない。

旧36件のスナップショットは `research/legacy-cases.json`、既存の慎重なラベル方針は `research/legacy-policy.md` に保存した。旧記録が「初回は学習しない」と定めていたことは保持する。P-003では、適格データを回復し、評価条件を満たした対象から**実際のfitを行う新工程を追加する**。

今回、全チャットの完全エクスポートや全Work本文を取得したわけではない。検索で出なかったものを不存在にしない。既に見つけた候補から原文・当時の提示物をたどり、収集可能範囲と取得失敗をmanifestへ残す。無関係な過去会話を教材学習へ混ぜない。

## 3. 回収を実行する手順

### 3.1 収集源と取り出し方

1. **repo**: 対象repoのmain/feature/既知の修正枝から、USER_ACCEPTANCE、FINDINGS、ACTION_LOG、VERIFICATION、各review sheet、既存corpusをpath inventory化する。文書SHAと、その文書が論じる教材SHAを別々に記録する。
2. **チャット**: 個人文脈検索で「集合・前結果」「N01・順序」「N11・式中の穴」「組版・式番号」等の問題群を絞る。返った原文と要約を区別し、原文を取得できない候補は保留する。検索結果が全チャットそのものだと扱わない。
3. **画像**: 元発言に添付された画像をそのまま保存しhashを持つ。OCRは補助とし、画面の対象node/stateを実データ又は当時の証拠で照合する。
4. **版の復元**: 関連する教材JSON・図・rendererと評価画面を取得し、問題、本文、穴、選択肢、前結果の可視snapshotを作る。当時の進捗条件が不明なら可視状態を推測しない。
5. **エピソードの接続**: 『提示→否定→提案→実装→再提示→評価』をevent IDで結ぶ。同じ案が承認されたから修正版への品質評価まであったとはしない。
6. **追加調査**: UNKNOWN26と検索候補12を優先して元記録へ戻る。取得済みのhashを使い、同じ検索・読み込みを繰り返さない。

### 3.2 一件の定義

一件は「ある版のある範囲に対する、ある観点の評価」である。主キーは `repository + artifactVersion + scope + dimension + feedbackEvent`。Work IDだけでは旧/新W-GOV-010が衝突するので、repo/pathも必須とする。

`observation` は出所ごとの記録、`episode` は修正の経緯、`case` は版・範囲・観点の教師候補、`example` は実際のモデル入力とlabel、`pair` は同一条件下の比較であり、別テーブルに分ける。観測数を教師例数へそのまま数え替えない。

### 3.3 ラベルの決め方

| 状態 | 意味 | 学習への扱い |
|---|---|---|
| USER_GOLD | 本人の具体評価と対象版・観点が直接対応 | 対応観点のみ教師候補。artifact抽出と重複確認後に採用 |
| REPO_ATTESTED | repoに原発言引用と対象版があるが、原会話を直接回復していない | 出所を明示。高確度候補だがgoldと混ぜず比較を分ける |
| AI_SILVER | AIが本文とrubricから付けた観点ラベル | 実験用の別dataset。本人の好み・受入の代替にしない |
| RULE_CERTIFIED | 数理・構造検査が成立した技術ラベル | 技術検出器の教師には使える。教育的に良い例とはしない |
| UNKNOWN | 対象不明、要約のみ、続行・許可だけ、評価なし | 教師損失から除外。検索・回収候補として保持 |

本人の肯定が少ない場合、無評価の文を『問題なし』へ変えない。監査AIがrubricに照らして作るsilverの実験は可能だが、gold評価での改善が確認できるまで本採用しない。ユーザーへ大量の再承認作業を投げることを前提にしない。

## 4. 観点と欠損ラベル

初期観点は以下。`present / absent / unknown` を別々に持つ。

- prerequisite_missing：必要な条件・前結果・用語が足りない。
- unmotivated_operation：操作目的・対象・向きが読めない。
- broken_derivation：局所式の前後関係又は全体への復帰が欠ける。
- shallow_blank：新たな判断を要求せず写しになっている。
- answer_leakage：同じ完成答えが未解答時に見えている。
- orphan_output：値・動詞が役割なしで孤立している。
- term_semantics_missing：概念の意味・名称・初出の扱いが抜ける。
- math_render_omission：数式意味tokenが描画へ届いていない。
- layout_discomfort：受入済みprofileから外れる空白・行・番号・選択肢配置。

単に『layoutが良い』ならlayout観点のabsent候補であり、broken_derivationや漏洩のabsentにはしない。指摘されなかった八観点を0に埋めることは禁止する。

この欠損があるため、初期は**観点ごとの二値headを、当該観点の明示ラベルがある行だけで学習**する。完全に注釈済みのpanelが揃った実験だけSetFitのmulti-outputを使う。SetFit標準の多ラベルAPIにunknown maskが自動で適切に扱われるとは仮定しない。

## 5. 転用するモデルとコードの選定

### 5.1 選ぶ構成

**第一実験: intfloat/multilingual-e5-small の固定埋め込み＋観点別LogisticRegression。第二実験: 同じ基盤をSetFitでfine-tuneし、分類headも学習。比較対象: Qwen3-Embedding-0.6Bの固定埋め込み。**

大きいモデルを選ぶことを目標にせず、私たちの日本語本文・中国語評価・数式入り文脈で漏れと誤警告を実測する。e5は12層・384次元、入力は最大512token。Qwen候補は0.6B、最大32k、最大1024次元で、長文入力を比較する候補となる。ただし公開ベンチマークでの能力が、私たちの『教え方が良い』の分類精度を保証するわけではない。

| 候補 | 転用する実装 | 採用理由 | 検証が必要な点 |
|---|---|---|---|
| multilingual-e5-small / MIT | SentenceTransformer、平均pool、正規化、公式prefix | 多言語、軽い埋め込みheadの基準を作れる | 数式混在、512制限、今回の観点の分離 |
| SetFit v1.1.3 / Apache-2.0 | embedding微調整＋classifier学習、学習/保存/load、評価用構造 | 既存の少量データ分類訓練を転用し、独自trainerを作らない | 欠損ラベル、観点別データ不足、過適合、e5prefixの一貫性 |
| Qwen3-Embedding-0.6B / Apache-2.0 | 公式SentenceTransformers使用例、instruction/pooling | より長い文脈を扱う比較候補 | CPU/GPU費用、速度、安定性、実際の優位性 |
| scikit-learn | LogisticRegression、group分割、指標・校正 | 凍結埋め込みの学習と評価を再実装しない | 使う版のAPI互換、少数class、校正データ不足 |

SetFitの `modeling.py` と `trainer.py` の実コードを読んだ。`model_body.encode` による埋め込みからheadをfitし、LogisticRegressionやmulti-outputを利用する。概念説明だけを参考にしているのではない。今回sourceを丸ごとコピーせず、ライセンス・版を固定したライブラリとして利用する案である。

### 5.2 版と環境を固定する

- SetFit v1.1.3: commit `fc2ff4df0eb409724b7caef2126e628a23a5e5ba` を確認。
- e5候補revision: `fd1525a9fd15316a2d503bf26ab031a61d056e98` の実在をHF commitページで確認。ただし今回固定revisionのconfig/modules取得は失敗し、重みを取得していない。実装時のprefetchでtokenizer/config/pooling/weightsを取得してSHA256を確定するまでLOCKEDにしない。
- Qwen比較候補: HF model APIのrevision `97b0c614be4d77ee51c0cef4e5f07c00f9eb65b3` を確認。これも重み未取得。
- Python専用環境を制作ツール用に用意する。SetFit、sentence-transformers、torch、transformers、scikit-learnは、最初の互換probeで解決した版をlockし、CPU実行を基準にする。古いmodel cardのpip例を現在のlockへ無検証で転記しない。
- safetensors、取得hash、license/NOTICEを保存する。モデルの独自remote code実行を必要条件にしない。
- weightsはGitの本文やapp bundleに入れず、artifact registryへ置く。Gitにはmanifest、checksum、評価、選択版を残す。

## 6. 学習入力をどう作るか

予測時のモデルは、評価発言をまだ知らない。したがって学習入力に『これは突然引くので悪い』等のユーザーコメントや採点結果を入れない。コメントはlabelと根拠にのみ使う。

入力は当該nodeの `problem/context/knownFacts/purpose/before/interaction/mathRelation/after/visibleRefs` と必要な直前node。afterの良否を予測する課題では正解後snapshotを使い、未解答時の漏洩検査はbefore snapshotを別exampleにする。DOM class名やWork番号が品質の近道にならないよう、IDは参照一貫性だけ保って匿名化する。

数式はAST構造を保持したcanonical表現と表示LaTeXの双方を残す。ASTを捨てて数式を自然文へ自由翻訳しない。構造特徴は `reference_depth / unresolved_refs / relation_kind / local_to_global / token_counts / first_use / state / scope` 等。コードで確定したERRORはそのまま規則で扱い、分類器の高得点で消さない。

e5の分類入力には公式仕様どおり `query: `、非対称検索では検索側queryと事例側passageを使用する。学習・推論・cacheで同じprefixを使う。最大長はtokenizerで測り、原問・条件・当前nodeを優先し、長い文は段落・数式group境界でchunkする。切り落とした範囲をreceiptに残す。答えに関わる前提が入らなければABSTAINへ回す。全教材を先頭512tokenだけで判定しない。

## 7. 実際の学習処理

### 7.1 凍結埋め込みの基準学習

1. curated snapshotを固定し、case→exampleを生成する。
2. splitを先に確定する。特徴の標準化・特徴選択・重み・閾値を評価側から学ばない。
3. pretrained encoderで入力を埋め込み、cacheする。
4. 観点ごとに明示ラベルだけを取り出し、`LogisticRegression.fit(X_train,y_train)` を実行する。必要なclassが片側しかないheadは `NOT_TRAINABLE_SINGLE_CLASS` とする。
5. validationで正則化、class weight、警告閾値、棄権条件を比較する。少数データで自動探索を大量に回さない。
6. 観点別の係数・切片・encoder manifest・入力schema・評価を保存する。

これにより、基盤モデルを転用しつつ私たちの事例から新しい分類パラメータを学習する。『学習』の実体はこのfitと保存されたパラメータである。

### 7.2 SetFitによる転移学習

1. 観点別の明示ラベルがあるtrainだけから対照ペアを作る。修正版や同じ原問をvalidation側からペアへ入れない。
2. encoderの微調整を行い、次にheadを学習する。初期budgetは1候補encoder、seed3通り、最大3epochの小規模比較とし、実測で調整する。
3. 欠損ラベルがある行はその観点の訓練から外す。異なる観点を一つの良い/悪いへ潰さない。
4. 同じsplit上で、固定埋め込みheadと比較する。fine-tuneが悪化した場合は固定headを採る。
5. データを少し増やしたときのlearning curveを作り、追加回収先を決める。『一class8件で十分』という他datasetの宣伝値は採用条件にしない。

### 7.3 候補順位モデル

同一問題・同一学習目標・同じ既習条件で比較可能な候補A/Bを作る。本人がAを否定し、修正版Bを対応観点で明確に肯定した場合のみgold pairとする。単にBの実装を許可した場合はgold pairではない。

初期は候補ごとの埋め込み・構造特徴を `φ` とし、`φ(A)-φ(B)` に対するLogisticRegressionでpair preferenceを学習する。逆向きpairは同一groupに入れ、独立教師例として件数を倍に見せない。順位逆転率、同点・不確実時の棄権、既存AI選択との比較を行う。pair不足では学習せず、AIの根拠付き比較と既存規則へ戻す。

LLMの大規模追加訓練を初手にしない。必要な分類と順位を小さい学習器で実装し、問題が具体化してから別案を検討する。

## 8. 評価分割と昇格

同じ原問、修正前後、同じ会話episode、共通テンプレート由来の類題をgroupで結ぶ。union-findで連結成分を作り、分割をまたがないようにする。Workが違っても同じ式・画像・近似文なら同じgroup候補へ入れる。GroupKFoldの仕組みを再利用し、group数が足りなければfold数を減らし、それでも成立しない観点は評価不能と記録する。

既知の旧10否定＋N07六反例は、すでに規則設計へ見せた回帰集合である。これを後から未使用testと呼ばない。今回回収済みのデータはdevelopment側として明記し、最終holdoutはその後の未使用episodeを固定する。時系列の将来データでも確認する。

| 比較 | 調べること |
|---|---|
| code＋AIのみ | 必須の基準。同じ問題・同じ予算・同じ監査範囲 |
| ＋未学習検索 | 類似事例を渡す効果 |
| ＋学習分類 | 追加でどの問題を見つけたか、誤警告・見落とし |
| ＋fine-tune | 固定head以上の効果と費用 |
| ＋学習順位 | 有効候補の選択が改善したか、悪化したか |

指標は観点別precision/recall、重大な見逃し、誤警告、棄権率、group単位の信頼区間、候補pair正解率、再発件数、AI確認時間、推論/学習時間、実メモリ、費用。全体accuracyだけでは判定しない。

初期の運用条件は次の**提案上の基準**とする。達成済みの数値ではない。

- class両側が存在し、train/validation/testのgroupが分離していること。ごく少数ならoffline実験に限り、運用性能を主張しない。
- 各使用headはvalidationで基準以上の有用性を示し、未知groupでの見逃し・誤警告・棄権を開示できること。
- 最初の2制作単位はshadow動作とし、AIの確認順も変えずに予測を記録する。
- その後も**助言用途のみ**。数理ERROR、必須監査、原本、受入・承認を自動合格させない。
- 品質headが不十分でも、取得できた事例の検索・規則・回帰試験は使用できる。全基盤の完成を無期限に止めない。

少数例で確率を精密な信頼度と呼ばない。校正用groupが足りなければuncalibrated scoreとして出し、未知mode・入力欠落・入力schema違い・モデル未取得はABSTAINにする。

## 9. 本番で実際に使う接続

S04では `retrieve(context,scope,corpusVersion)` を呼び、関連例の出所・版・観点・適用条件をgenerator bundleへ入れる。S08/S14では `predict(candidate,snapshot,modelVersion)` が `dimensionScores, abstentions, retrievedEvidence, manifestHash` を返す。AIは得点だけでなく対象本文と根拠例を見て選ぶ。

CLI receiptに次を必須とする。

- 参照したcase IDs、規則IDs、corpus hash。
- 学習したdataset hash、encoder/head hash、feature schema、split manifest。
- モデルを使った工程と候補、使わなかった理由。
- 生成・監査に渡した実bundle hash。
- 使用結果が再発や見逃しに結びついたかを追跡するrun ID。

`feedback registered` だけでcloseしない。S23でregression/ruleの状態、S24でdatasetへの採否、次runで消費されたreceiptまで追う。学習がまだなら `trainingRun:false` を維持し、fit後のartifactがある対象のみtrueにする。

## 10. 再学習・運用・撤回

新評価ごとに即モデルを書き換えず、curated data snapshot単位で候補版を作る。初期は新たに判定可能なepisodeが10件増えた場合、または重大な見逃しが見つかった場合に再評価jobを起こす案とする。件数は運用開始後に調整する。重大指摘は学習完了を待たず、対応する既知回帰・規則候補へ先に入れる。

registryの `active` は検証済みmanifestへのポインタとし、旧版を保存する。昇格はモデル・データ・評価のhashを一緒に切り替える。入力schema変更でcacheを破棄し、実行途中のrunは旧model snapshotを固定する。性能低下・復元不能・破損時は前版かcode＋AIへ戻す。教材の公開版をモデル学習だけで書き換えない。

運用環境は制作側のCPUを基準にprobeする。GPUは使用可能な環境が実際に確認できた場合の比較手段とし、ユーザーの別プロジェクトの機材を暗黙に使う前提にしない。学習時間・必要VRAM・費用は初回probe結果を記録してから決める。

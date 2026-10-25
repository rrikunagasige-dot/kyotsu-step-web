# 承認済み提案 P001

数学教材制作ワークフロー改修正式提案書

資料の分析から教材設計 検証 公開 学習まで

提案版 1.0    2026年10月25日    宛先 陸永茂氏

提案する変更

既存の作成と修正を入口として維持し、参考資料の構造分析、一問全体の解法モデル、目的を持った穴、累積する解答表示を追加する。数学的に検証できる処理をコードへ移し、教える順序や説明の適切さはAIが根拠付きで判断する。現在使えるコードと受入済み教材を保護し、段階的に拡張する。

目標は、EJU等にある解法のつながりを保ちながら、試験では省略される判断・計算・根拠を小さく教えることである。同時に、一つの問題を解いている感覚を保ち、細分化を独立した小質問の羅列にしない。

今回の範囲

本書は、これまでの指摘を統合した基盤改修案である。既存コードの改修点、外部資産の利用方法、工程への接続、実装タスクと受入条件を定める。二次関数と一次不等式は具体的な設計例として用いる。各Nの教材全文を一括承認したものにはしない。

| 区分 | 本書で定める内容 |
| 維持 | CMD-WORK-001 修正、CMD-WORK-002 作成、production/2、同じRuntime台帳と既存公開先 |
| 変更 | 資料分析、解法と穴の構造、検算、組版部品、AI監査、事例検索と学習の接続 |
| 実装後の確認 | 完成した公開単元の直接URLを提示し、実物評価を受ける。廃止済み画像票の再承認を復活させない |
| 現在の状態 | 提案書作成のみ。アプリ、既存教材、workflow、モデルの更新は未実施 |

読み方

第2〜3章は要望と変更先、第4〜11章は設計と実装、第12〜14章は工程と学習、第15〜16章は教材例、第17〜19章は改修単位と検証、第20〜21章は参照資料、第22〜24章は実装用付表とする。新設名は既存実装との接続時に固定する。

2 教え方に関する要望と変更先

要望をREQ番号で管理する。各要望は、具体設計・改修箇所・検証証拠へ追跡できるようにする。既に実装された機能の存在と、教材として十分かどうかの評価は分ける。

| 要望 | 現状または問題 | 変更後と確認方法 |
| REQ01 誘導 | 順序があっても中間結果の必要性が見えない | 各小目標に次の用途を持たせ、依存する結果と使用先を検査する |
| REQ02 導出 | 結論や操作が突然出る | 目的・対象・操作・根拠・結果・次の用途を明記し、初学者監査する |
| REQ03 細分化 | 試験で省略する計算や判断も必要 | 意味のある操作に分解。計算も本人の課題として残し、全体の式へ戻す |
| REQ04 一問の流れ | 小質問を順に押す教材に見える | problem単位の解法状態を持ち、完成した行を累積表示する |
| REQ05 学年相当の順序 | 項をまとめる順序や説明が不自然 | 操作ごとの教え方パターンを蓄積。対象の項→操作→まとめた式へ進める |
| REQ06 穴の設計 | 計算穴に偏る、または考える前に説明が答える | 判断・式生成・導出・計算・意味を区別し、穴ごとの本人の行為を記録する |
| REQ07 計算穴 | 判断穴を重視し過ぎても解く練習にならない | 計算穴を正当に採用する。数や比率を固定せず、次の解法行への寄与を確認 |
| REQ08 同じ回答 | 両辺の同じ数が別の回答に見える | 一interactionから複数slotへ同期。一試行として記録する |
| REQ09 教える文章 | 式や説明が積まれているだけに見える | 操作の前に目的、後に意味・用途。各行への短い見出しの乱用を避ける |
| REQ10 前の結論 | 別ページの結果を使いにくい | 必要な条件・既知結果を参照できる表示と全解法履歴を維持 |
| REQ11 学習の移行 | 穴を埋めただけで理解したと扱う | 同じ解法から支援量の異なる問題を作り、低支援の類題は別に評価 |
| REQ12 問題型の違い | 概念と計算が同じテンプレートになる | 概念説明、性質の導出、計算例題、場合分け、文章題の表示型を分ける |

本書は機械的に全行へ穴を作る案ではない。空けない箇所にも理由を残し、説明として与える部分と、本人に任せる部分を設計する。

3 表示と運用に関する要望と変更先

| 要望 | 変更前の問題 | 変更後と確認方法 |
| REQ13 文章構造 | 問題と解説の境目が曖昧 | 問題・条件・方針・解法・結論を役割で区別。教科書の概念説明も保持 |
| REQ14 長さ | 詳細化すると長い文章が続く | 解法本体を維持し、補助計算を必要時に展開。分割時も前提と前結果を保持 |
| REQ15 式の位置 | 左寄り、過大な空白、番号が孤立 | 式群内の等号軸と番号欄を共通化。高さは内容から決める |
| REQ16 選択肢 | 複数計算が横に詰まる | 計算を意味の順に縦配置。全候補の段階・情報量を揃える |
| REQ17 括弧 | 根号の差など因子全体の括弧が欠ける | 式の構造から括弧を出力。候補・回答後・履歴も同じ構造を使う |
| REQ18 文中数式 | 数式だけ本文フォント、未compile | textとmathを型分け。文中も数式レンダラーを通し、描画漏れを検査 |
| REQ19 概念 | 定義語が目立たない、概念に不要な色 | 初出の概念語を黒字太字。色は穴・状態等の機能表示へ用いる |
| REQ20 図表 | 必要な時点や式との対応が弱い | 図の表示条件・参照step・同じ関数データを指定。原図を無断置換しない |
| REQ21 全件監査 | 指摘された場所だけ直す | 原症状と同型原因を全対象inventoryで調査。未確認を合格にしない |
| REQ22 詳細案 | 何をどう直すか不明なまま変更 | 各unit・problem・stepの前後、穴、文章、表示、影響先を設計してから改修 |
| REQ23 直接確認 | 公開前の確認が使いにくい | 承認済み範囲のQA後に既存appへ公開。source照合済み直接URLを提示 |
| REQ24 AIとコード | 主観判断も機械処理もAIへ集中 | 決定的検査はcode、意味判断はAI。両者の証拠をworkflowで要求 |
| REQ25 外部資産 | 既存研究やコードが活用されない | 参照先・対象ファイル・使い方・制約・採否を記録して接続 |
| REQ26 学習 | 否定例や肯定例が利用されにくい | 過去評価を対象と版付きで回収。検索・規則・分類学習を区別する |
| REQ27 工程説明 | 誰の仕事か紹介しにくい | 同じ工程データからAI・CODE・USERを明示した三階層の火柴図を生成 |

4 既存コードの基準版と変更方針

調査時点のmainは4e5ce9e751aa7e7d3c4b1d1cda250dd2fc2ccbcb。教材実装の調査基準は公開source 397788f1715b96459032a6647d6fbe772004a7b3とする。mainの管理記録と公開教材sourceを混同しない。実装着手時には再度live版と対象Workを照合する。[R01]

| 既存箇所 | 現在の機能 | 変更方針 |
| tools/textbook/ir/index.mjs | 型付き本文・式・穴、前提と結果、coverage、式番号 | 旧production-ir/1を保持し、新形式のproblem状態・変形edge・複数slotを追加 |
| interaction/index.mjs | 操作対象等から穴候補を列挙しAIへ渡す | 候補の適格条件、本人の判断、使用可能情報、次状態への反映を追加 |
| prose/index.mjs | 目的や操作対象等の属性を要求 | 本文の対象step、説明の前後位置、用語初出、式との対応を検査 |
| solver/n07.mjs | 循環小数等の限定domainとUNSUPPORTED | 既存を維持。一次不等式・二次関数用の別adapterを登録 |
| planner/candidates.mjs | 主にN07用の生成パターン | 全数学対応と見なさず、型ごとの解法と支援パターンへ拡張 |
| GuidedMathReadingFlow.tsx | 段階表示、前結果、履歴、数式と選択肢 | problemごとに解法を積み上げるopt-in表示を追加 |
| ml/train.py と predict.py | 観点別fit、group評価、棄権 | 品質観点と入力文脈を拡張。現モデルの本番棄権は維持 |
| workflow と AI契約 | C/R工程、hash、receipt、監査要求 | 各工程に新capabilityを接続。新しい第三の入口は作らない |

現状を過小評価しない

既存教材には前結果・履歴・整列・式番号があり、W036にはSymPyによる個別の恒等式・不等式検算もある。問題は機能が一切ないことではなく、一問の途中状態を共通モデルとして扱う仕組みと、全変形への適用が不足していることにある。

現状を過大評価しない

whyHereが埋まっていることは教育的妥当性の証明ではない。現IRのANSWER_LEAKAGEは主に数式文字列との一致検査で、文章が考える内容を先に説明してしまう問題までは解決していない。

5 外部コードの採用計画

| 資産と参照 | 参考にする場所 | 採用方法と制約 |
| Docling [R02] | README、enrichments、PDF変換出力 | 制作環境の任意adapterとして試す。codeはMIT、model条件は別途固定。日本語の式と図の抽出を評価後に採否決定 |
| OATutor [R03] | src/components/problem-layout/Problem.js と HintSystem.js | step別の回答・ヒント・補助質問を参考に新IRへ変換。MIT codeと教材contentの条件は別。Firebase等は移植しない |
| OATutor Tooling [R04] | READMEの制作・検証フロー | 生成とブラウザ検証の接続を参考。今回はREADME確認範囲で、内部実装の流用は追加調査後 |
| CTAT [R05] | 公式example-tracing tutorialとLICENSE | 複数正解経路・誤り経路・文脈支援を設計参考にする。利用制約があるためcode移植は初期案に含めない |
| Mathsteps [R06] | READMEのoldNode/newNode/changeType/substeps | 変形履歴の構造を参考。archive済み。不等式や二次関数全体を任せるengineとして採用しない |
| SymPy [R07] | 式操作、inequalities、calculus文書 | Python検証adapterに利用。対応外とtimeoutを明示し、サンプル値の一致を証明と呼ばない |
| STACK [R08] | Equivalence と Algebraic Formの判定設計 | 数学的同値と要求形式を分ける。GPL系runtimeの移植は行わず、既存環境で独自adapterを設計 |
| pyBKT [R09] | READMEのfit・predictとskill単位モデル | 学習者の習得推定の後期候補。教材品質分類や穴の正しさの判定器として代用しない |
| 既存e5等 [R10] | encoder manifest、train.py、SetFit入口 | 固定encoder検索と分類学習を継続。SetFit比較は全文入力と評価条件が揃ってから |

各採用PRには外部資産名、commitまたはversion、対象ファイル、license、利用形態、adapter契約、検証結果を残す。初期段階での新依存は抽出・検算に必要な制作側だけとし、学習アプリへ大きなモデルを同梱しない。

6 資料収集から再利用パターンまで

資料の役割を分ける

編集対象の原資料と、教え方を参考にする資料を別に管理する。前者の条件や無番号説明はcoverageで保持し、後者は根拠箇所と採否を残す。参考先の省略を、そのまま私たちの省略へ持ち込まない。

| 工程 | CODEの処理 | AIの処理と成果物 |
| 範囲表 | シラバス項目・problem型と資料の対応 | 必要な論点、例外、前提知識を指定 |
| 収集 | URL、版、hash、重複、取得状態を保存 | 一次資料・教材・研究の役割を区別 |
| 抽出 | Word/HTMLを優先。PDFは位置付き抽出 | 原画像と照合し、式・条件・図の読取誤りを報告 |
| 数学化 | 記号・式・条件の型と参照を検査 | 省略された判断、別解、場合分けを構造化 |
| 教授分析 | 必要属性・前後参照の整合を検査 | どこで何を考えさせ、なぜ次へ進めるか分析 |
| パターン化 | 型、適用条件、source位置を登録 | 採用理由・不適用条件・補足すべき段階を記述 |
| 利用 | 今回の問題と過去事例を検索 | 適用・非適用・未解決を全取得事例について返す |

二次関数の調査範囲

前提の展開と平方根、平方完成、軸と頂点、関数決定、全実数と区間の最大最小、文字を含む軸や定義域、二次方程式と不等式、複合問題を範囲表に並べる。全インターネットの網羅ではなく、対象教材に必要な論点と境界事例の網羅を完了基準にする。[R11〜R13]

抽出失敗の扱い

OCR信頼度だけで原式を確定しない。負号、分数、根号、指数、不等号、括弧、軸と点のラベルは原本と照合する。曖昧な箇所はNEEDS_SOURCE_REVIEWとして止め、推測で式を補わない。抽出modelの出力は観測データであり正解ラベルではない。

再利用パターンに保存する項目

patternId、problemFamily、learningGoal、prerequisites、steps、blankRoles、figureTiming、layoutType、applicability、exclusions、sourceLocations、reviewStatusを持つ。参考文章をまとめ直しただけでは登録完了にしない。

7 解法モデルとIRの拡張仕様

問題内の数学状態と、その状態を変える操作を分離する。式の中の等号・不等号と、式から次の式への変形関係を混同しない。二つの不等式を等号で結ばない。

| 構造 | 必須の主な属性 | 実装する検査 |
| ProblemContract | id、givens、domain、goal、allowedKnowledge、sourceRefs | 条件・定義域・対象変数・最終目標が明確か |
| SolutionState | id、problemId、statements、facts、activeVariable、fixedParameters | 前提と結果、変数役割、参照の整合 |
| Transition | from、to、operation、operands、assumptions、ruleId | 操作前後の数理、条件、符号、branch参照 |
| TeachingStep | stateRef、transitionRef、goal、before/after、requires、nextUse | 解法との接続、本人の行為、文章の対象 |
| BlankPlan | decision、availableFacts、target、expected、feedback、support | 未習・未来情報、重複、解法状態への反映 |
| AnswerBinding | interactionId、slotIds、valueType | 全slotが同じ決定を表し、採点は一回か |
| Presentation | role、groupId、numberId、contextRefs、detailRefs、figureRefs | 整列・式番号・履歴・図と解法の対応 |

互換性と境界

production-ir/1のparse・compileを残し、新形式はproduction-ir/2として明示する案とする。旧answerInsertionは単一slotのbindingへ読み替え可能にする。新規複数slotではslotのIDを別にし、interaction IDのみ共通化する。既存の採点ID、choice ID、履歴IDの意味を変更しない。

別解はgraphの別経路として表す。数学的に正しい近道と、今回学ばせたい操作を省略した解答を別判定にする。未登録の経路を即座に数学的誤答と扱わず、判定可能範囲外として残す。

再生成の原則

同じ確定解法から、完全表示、途中補充、低支援問題を生成する。別ファイルに手書きして解法がずれないよう、共通stateとtransitionを参照する。生成物にはsource・solution・design・rulesのhashを付ける。

8 数理検証の実装仕様

| 検証adapter | 検査内容 | 失敗例 |
| linear_inequality | 定数の加減、既知符号の乗除、解集合 | 負数除法で向きが逆転しない、両辺の操作が違う |
| quadratic_identity | 代入、展開、整理、平方完成、係数対応 | 外の係数の掛け忘れ、平方完成の補正定数違い |
| quadratic_extrema | 軸、頂点、定義域、候補、達成点 | 範囲外の頂点を採用、最大値とそのときの変数を混同 |
| quadratic_parameter | 条件付き係数、枝、境界、退化 | 二次係数ゼロ、場合分けの穴、境界の二重扱い |
| quadratic_inequality | 実根、符号、端点、定義域との共通部分 | 重解時の符号、端点の等号、定義域の欠落 |
| expression_form | 同値性とは別の要求形式 | 平方完成を求める箇所に展開形、因子の括弧漏れ |

判定契約

入力は構造化された式、変数、定義域、仮定、操作と要求形式。出力はstatus、checks、assumptionsUsed、counterexample、unsupportedReason、engineVersion、inputHash、proofStatus。PASSは対応する検査命題に限る。教材全体の教育的合格へ拡張しない。

定数・有理数を中心とする限定範囲から開始する。符号不明の量による除法は分岐または追加仮定を要求する。開区間では上限と最大値を区別し、数値だけでなく達成する点が存在するか確認する。

計算だけで済まない論証

一般論証は、特定の数値例で代用しない。コード未対応の一般証明は、既存のargument経路へ仮定・主張・各段階の根拠を渡し、AI_ARGUMENT_REVIEWEDとformalProof:falseを記録する。UNSUPPORTEDを機械検証PASSへ書き換えない。

意味のあるテスト

正解文字列をもう一度計算するだけの試験を避ける。誤った符号反転、片辺だけの操作、抜けた境界、別の定義域、同値な複数選択肢を混ぜ、検出できるか試す。小さい係数の体系的な組合せと数理的な不変条件で退行を調べる。

9 穴と支援の設計仕様

穴候補を列挙する既存blankCandidatesを拡張し、候補生成、機械的適格判定、AI採否、実表示監査の四段階にする。候補の数や種類の比率を目標にしない。

| 段階 | CODE | AI |
| 候補生成 | 操作、対象式、部分式、条件、結果から候補を作る | 必要ならコードにない候補を根拠付きで追加 |
| 適格判定 | 前提、target参照、回答反映、同値候補、slot結合を検査 | 今の段階で任せる難しさか判断 |
| 採否 | 採用・不採用理由と必要属性を検査 | 本人に考えさせる内容と解法への役割を決める |
| 監査 | 回答前snapshot、hint後状態、回答後状態を作る | 先出し、意味のない穴、唐突な操作、負担を確認 |

同じ決定と異なる決定

両辺に同じ数を足す穴は一回答・二表示とする。一方、二つの端点の関数値は別計算なので、同じ番号や同じ穴へ統合しない。意味上の同一性をAnswerBindingとsemanticRefで表し、見た目が似ているだけで結合しない。

選択肢と誤答

全候補が同じ課題段階を表すようにする。正答だけ途中式付き、誤答は数値だけという不揃いを避ける。数学的に複数正答になる候補は修正する。誤答feedbackは、間違った対象・操作・符号・条件を示し、必要に応じて同じ式へ戻す。

ヒントと段階的な自立

既存ヒント上限等の契約は保持し、目的の再確認、関連性質、局所補助計算を設計する。将来の問題で支援を減らす場合はsupportPolicyへ記録する。最初から全段階の理由選択を強制しない。低支援の類題は学習確認として別に扱い、穴の連続正解から理解を断定しない。[R14、R15]

穴を空けない箇所

問題条件の提示、未習性質の導入、全体方針を渡す箇所などは説明として与えられる。noBlankReasonに理由を残す。穴の直前で問う内容を解き切っていないかは、文字一致だけでなくAIが可視情報を読んで監査する。

10 文章と数式組版の変更仕様

| 対象 | 変更後の仕様 | 実装と検査 |
| 文章の順序 | 目的→対象→操作→結果→意味と用途。不要な繰返しは削る | 各文が指すstep/stateを保持。AIは実際の文章のつながりを監査 |
| 問題と解法 | 役割で区別。小操作ごとに大きな題名を付けない | problem/definition/solution等のpresentation role |
| 式の整列 | 一つの変形群は等号軸を揃える | 共通式groupとalignment anchor。独立計算は別row |
| 式番号 | 参照する式群に安定IDを持たせる | 表示番号とstable IDを分離。履歴・参照先も一致 |
| 長い式 | 数学的なまとまりで折返す | layout variantを幅で選択。本文全体の横スクロールを回避 |
| 番号欄 | 式と番号の占有幅を分ける | bounding boxで重なり・右端はみ出しを検査 |
| 選択肢 | 一計算一行、最後に比較または結論 | optionRowsを意味付きで持つ。式順序も照合 |
| 括弧と数式 | ASTと意味属性から生成 | 和・差全体を掛ける場面を保持。文中もmath token |
| 概念 | 初出の概念語を黒字太字 | term usageとDOM描画を照合 |
| 長さと前結果 | 補助説明の展開と前結果の参照を両立 | 解法本体・detail・known factsを分離 |
| 図と表 | 問題状態に対応した時点で表示 | figure gate、座標、端点、式のdata参照を検査 |

大きな上下余白で式を中央へ置く実装をやめ、groupの内容高と共通spacing tokenで管理する。正確な余白値は既存の受入済み表示を実測して初期値を定め、320・390・430・1440pxで調整する。今回の文書上の推測値を本番の固定寸法にはしない。

一問の解法は完成済みrow、現在row、必要な補助計算、最終全解法として扱う。ページ分割を禁止せず、分割前後の条件と式の連続性を維持する。操作後に小計算だけが残り、元の式が消える状態を検出対象にする。

11 AIの入出力と反証監査

主観性の高い仕事も自由記述だけにせず、対象と根拠を持つ出力契約へ変える。ただし、属性が埋まったことを意味判断の正しさと同一視しない。

| AI工程 | 渡す入力 | 必要な出力 |
| 資料分析 | 原本、抽出位置、対象論点、利用範囲 | 条件、無番号説明、式・図、教授構造、読取の不確かさ |
| 完全解法 | 問題契約、既習、検算、必要な参考例 | 省略のない操作と判断、根拠、分岐、別解、結論 |
| 具体設計 | 解法、対象学習者、過去評価、表示部品 | stepごとの全文、穴、選択肢、ヒント、前結果、図の時点 |
| 原資料監査 | 原本と候補教材、coverage | 欠落・条件変更・原図の不整合を対象位置付きで指摘 |
| 初学者監査 | 回答前の可視snapshotと既習のみ | 次に決める内容、根拠、不足情報、先出し、負担 |
| 実装後監査 | 実DOM・表示状態と設計 | 設計との差、説明と式の不連続、履歴や回答後の問題 |

監査手順

初学者監査は、最初に正答と将来結果を隠した可視状態を読む。どこまで推論可能かを記録してから、完全解法と照合する。作成者のwhyHereをそのまま合格理由に引用せず、実際の文章・式・既習から説明できるかを確認する。

findingにはruleId、problemId、stepId、state、quoteまたはmathRef、reason、counterexample、affectedRefs、severity、resolutionを持たせる。同じAIが別passで監査する場合も、独立した別モデルの監査とは称さない。

AIとコードの食い違い

数学検査FAILをAIの自然文で覆さない。検査の対象や前提が間違っている場合は、検査仕様と入力を修正して再実行する。コードの構造PASSでもAIが具体的な飛躍を見つけた場合は、その箇所を未解決として戻す。

実行方式

既存方式の現アシスタントによる生成・監査とCLI importを維持する。新APIや別agentの自動起動を導入の前提にしない。将来別モデル比較を追加する場合は、費用・入力・評価方法を別に設計する。

12 作成工程への組み込み

| 既存工程 | 追加または拡張する処理 | 担当と完了証拠 |
| S00 S01 | 版、既存Work、未完修正、対象モードを復元 | CODE照合＋AI確認。現在地とscope |
| C01 原資料 | 資料台帳、位置付き抽出、原資料coverage、参考範囲表 | CODE取込＋AI照合。未確認箇所一覧 |
| C02 概念 | 定義、既習、記号と変数の役割、問題型 | CODE参照検査＋AI順序。knowledge ledger |
| C03 型と事例 | 参考patternと過去評価を検索 | CODE検索＋AI採否。全caseのdisposition |
| C04 完全解法 | solution graph、各transitionの検算 | CODE数理＋AI根拠。解法と検証receipt |
| C05 具体設計 | 全文、全step、穴、図、表示、事前監査 | AI設計＋CODE IR。対象別の具体案 |
| C06 承認照合 | 具体案のhash、対象、既承認との一致 | USER判断をCODE照合。基盤承認を教材承認へ流用しない |
| C07 生成 | 承認済みIRからcompile、限定差分 | CODE生成。入力と出力hash、安定ID照合 |
| C08 検証 | 数理、schema、四幅UI、保存、保護対象 | CODE実行＋必要AI receipt。原症状も確認 |
| C09 意味監査 | 実装後の原本・初学者・全解法監査 | AI監査。C05時点の記録を代用しない |
| G2 G3 | 横断QA、既存公開先へ配信、直接URL | CODE公開版照合。USERは公開教材を確認 |
| L01 Z01 | 評価の事例化、回帰、必要な学習、閉鎖 | CODE＋AI。教材受入とmodel採用を分離 |

blockは概念・例題・導出等の制作単位、release unitはN等の公開単位、approval bundleは承認対象であり、同一ではない。小さく設計しても毎操作のユーザー承認を増やすことはしない。

各unitの具体案にはproblemとstepの一覧を付ける。既存Nへ適用する際には全対象をinventory化し、修正不要・修正必要・未確認を明記する。本書だけで全Nを調査済みまたは改修承認済みにはしない。

13 修正工程と担当を示す火柴図

| 既存工程 | 今回の拡張 | 担当 |
| R01 再現 | 元発言、公開版、回答前後、全体解法を復元 | CODE取得とAI症状整理 |
| R02 原因 | 数学、教授順、穴、本文、組版、状態保存を分離 | CODE検査＋AI根本原因 |
| R03 事前影響 | 同じpattern、component、operation、slot型の全対象を列挙 | CODE検索＋AI同型判定 |
| R04 具体案 | どこを何へ変更するか、全影響先、step全文、検証を提示 | AI設計＋CODE事前検査 |
| R05 R06 | 既承認照合後、必要な属性と範囲のみ修正 | USER判断の照合＋CODE差分 |
| R07 G2 G3 | 原症状・同型・回帰・意味監査後、既存appへ公開 | CODE＋AI、その後USER実物評価 |
| 事後R03 R08 L01 | 新しい版と実差分で再調査し、修正証拠と評価を登録 | CODE＋AI。Goldは元評価イベントが必要 |

火柴図は以下の関係を基準とし、実装時は既存のFIRE_DIAGRAM、BLOCK_FIRE_DIAGRAM、CAPABILITY_FIRE_DIAGRAMを同じ台帳snapshotから生成する。文書の図は設計図であり、実行完了を表さない。

14 事例の回収と機械学習

現在の学習を正確に扱う

確認済みの訂正後記録は15事例で、否定9・肯定6。観点別に使えるラベルは異なる。layout_discomfortの2行で実fitされたheadはあるが、未知holdoutによる精度評価はなく、OFFLINE_ONLYかつadvisoryEligible=falseである。教材全般の教え方を学習済みとは扱わない。[R10]

過去の会話を教材へ生かす流れ

元発言、対象unit・problem・step、評価対象の版、当時の本文・式・選択肢・可視状態、修正後の証拠を結ぶ。元会話や対応版を取得できないものは部分記録として残す。未評価を肯定にせず、AI発見を本人の否定に変換しない。

| 使い方 | 入力と出力 | 採用条件 |
| 事例検索 | 問題型と現在の設計→関連する評価例 | ラベルが片側だけでも参考事例として使える。適用理由を残す |
| 決定的ルール | 原因→構造や数理の検査 | 括弧、slot、描画漏れ、符号、参照等は回帰検査へ |
| 品質分類 | 可視文脈＋解法構造＋評価→問題候補 | 観点別に正負の独立事例が必要。未評価はmask |
| 学習者モデル | 将来のskillと回答履歴→支援候補 | 別の収集・評価設計が必要。今回は自動収集しない |

追加する観点

solution_flow_broken、local_calculation_not_rejoined、prerequisite_gap、answer_decision_leaked、variable_role_confusion、choice_sequence_discomfort等を候補とする。名称だけ増やさず、元評価と対象の意味が一致する観点だけラベル化する。

学習と評価の手順

固定e5検索を基準に、既存のLogisticRegressionを再利用する。SetFitは完全な入力が収まり正負が揃う場合に比較する。長文は無断切捨てせず、step文脈とproblem文脈を区別する。problem familyと修正episodeを結んで分割し、同型の修正前後が評価へ漏れないようにする。

未使用の保留集合、誤警報と見逃し、観点別件数、棄権率を記録する。少数例で高精度を主張しない。品質modelは確認箇所を提案する役割とし、教材承認や数理FAILを自動で覆す権限を与えない。

15 二次関数での具体的な変換例

以下は基盤を検証する説明用fixtureであり、既存Nの番号ではない。与えられた条件から係数を整理し、実数全体における最小値を係数の関数として比較する。最後に使う範囲と式を、別々に求めて合流させる。

| step | 本人に任せる内容と前後の説明 | 次への役割 |
| Q01〜Q03 | 最終目標と条件を示す。代入する変数を確認し、条件を式にする | 係数の関係を作る |
| Q04〜Q06 | 平方の計算、定数の整理、係数間の関係を一行ずつ成立させる | 一つの係数で表す |
| Q07〜Q09 | bを表し、元の関数のbへ代入して関数全体を再表示 | 残る条件へ代入できる |
| Q10〜Q12 | fの負の入力を計算。三重不等式を同じ操作で整理する | aの範囲を得る |
| Q13〜Q15 | aを固定してxについて平方完成。二乗の非負性を使う | 最小値mと達成するxを区別 |
| Q16〜Q18 | mをaの式として平方完成。先に求めた範囲と比較する | 最大1と最小0、そのときのaを結論へ |

変数の役割はstateに保存する。Q13ではactiveVariable=x、fixedParameters=[a]、Q16ではactiveVariable=aとする。数学の式が同値でも、この役割変更を説明しなければ初学者には唐突になる。

詳細設計では各Qについて本文全文、穴の位置、回答前後の式、選択肢、誤答、ヒント、既知結果、図の状態まで埋める。fixtureが通ったことを実教材全体の設計完了にはしない。

16 一次不等式と選択肢の具体例

不等式では操作を教えながら、同じ問題の全体の式を残す。補助計算だけを別の小問として解かせ、元の不等式へ戻らない構成を改める。

| 回答 | 本人がすること | 表示と記録 |
| A | 左辺の定数項をなくす数を選ぶ | 同じAを両辺へ反映。回答と試行は一回 |
| B | 右辺の和を計算する | 不等式全体を更新。単独の6だけを残さない |
| C | 正の係数で割り、係数を1にする | 正数なので向きが変わらない根拠を接続 |
| D | 商を計算して結論を得る | 元の問題に対する解の範囲として示す |

上記は初期の強い支援例である。次の類題ではBやDを一つの変形へまとめたり、操作の選択から任せたりする。まとめ方は既習と学習目標に応じて設計する。

比較の選択肢

このように左の平方、右の平方、比較、根号の範囲を意味の順で縦に並べる。選択肢①だけこの流れで、②は別順になる状態を防ぐ。候補内の一行ごとにもsemantic IDを持たせ、回答後と履歴でも同じ順序を保つ。

17 改修ファイルと実装タスク

以下は改修先の正式な配置案である。新設名は既存treeと重複確認後に固定する。既存ファイルへ全機能を詰め込まず、CLIとworkflowから共通serviceを呼ぶ。

| タスク | 変更先 | 変更内容と成果物 |
| T01 資料 | 新 research/manifest.mjs、extract.py、patterns.mjs | 資料と位置schema、Docling等adapter、範囲表、重複・抽出失敗処理 |
| T02 解法 | 新 solution/graph.mjs と contracts | problem/state/transition、分岐、変数役割、検査結果の契約 |
| T03 検算 | 新 solver/linear_inequality.py、quadratic.py | 既存math.solve/verifyへdispatch。対応範囲manifestと誤りfixture |
| T04 穴 | interaction/index.mjs、新 plan.mjs | 候補適格判定、採否、複数slot、誤答と支援policy |
| T05 IR | ir/index.mjs とcompiler adapter | version別parser、legacy読取、stateと表示参照、描画ID検査 |
| T06 本文 | prose/index.mjs、ai/CONTRACTS.md | 説明対象・位置・初出語・可視状態、監査契約 |
| T07 UI | GuidedMathReadingFlow.tsxと新solution部品 | 累積行、前提、補助計算、全解法、整列と式番号、選択肢row |
| T08 工程 | workflow/capabilities.py、operations.mjs等 | 新serviceをC/R各工程へ登録。hash失効とreceiptを接続 |
| T09 事例 | 既存corpus、ml、registry | 元評価の回収、観点、文脈入力、group分割、学習と棄権 |
| T10 文書 | INTEGRATION_RUNBOOK、PRODUCTION_README、THIRD_PARTY_REFERENCES | 仕様、利用範囲、既存と新機能、実行と復帰手順を更新 |

実行インターフェース

research.ingest、research.analyze、solution.validate、interaction.plan、render.solutionを新capability候補とし、既存prepare/import-ai/verify/compileから呼べるようにする。名前を確定する前にcapabilitiesの現行schemaと衝突を調べる。

各serviceはschemaVersion、inputHashes、implementationVersion、status、findings、artifactsを返す。AI要求にはrequestHashと対象scopeを付け、別node・別phase・古い版の回答を拒否する。成果物の存在だけでは工程を完了させない。

18 検証と変更影響の管理

| 試験ID | 検証対象 | 合格条件 |
| V01 原本 | 条件、無番号説明、式、図 | 原本位置と対応し、未確認を明示 |
| V02 数理 | 全対象transitionと最終結論 | 対応範囲内の検算PASS。未対応論証は別の明示receipt |
| V03 構造 | state、前提、branch、slot、参照 | 未来参照、孤立結果、重複採点、枝の参照抜けがない |
| V04 文章 | 目的、操作、根拠、用途、既習 | AIが実際の可視状態で飛躍と先出しを監査 |
| V05 数式 | 文中、独立式、括弧、番号 | KaTeXエラー・未描画ID・範囲欠落がない |
| V06 UI | 320/390/430/1440pxの前後全状態 | 式と番号の重なり、選択肢詰まり、切れ、操作不能がない |
| V07 状態 | 正答、誤答、hint、reload、戻る、resize | 複数slotの同期、全解法、前結果、保存復元が成立 |
| V08 移行 | 旧保存と安定ID | 元履歴を保持し、新しい途中課題を勝手に完了しない |
| V09 回帰 | 受入済み単元と共有readerの利用先 | 影響inventoryの全対象を実施。無関係な全repo PASSを主張しない |
| V10 配信 | commit、manifest、route、操作 | 実際の配信sourceと対象unitを照合。v queryだけで判定しない |
| V11 学習 | ラベル、本文snapshot、group、model | 捏造・漏洩・無断切捨てなし。精度不明なら棄権 |

差分と再検査

資料変更はcoverageと依存解法、数学変更は依存する穴と説明、表示変更は描画と操作へ失効を伝播する。model変更だけで既承認教材を自動再生成しない。case変更は次の生成・監査へ適用し、影響がある既存教材は修正queueへ登録する。

回帰例の具体化

平方完成の補正定数をわざと変える、負数除法の向きを保持する、範囲外の頂点を候補へ戻す、同値な選択肢を二つ置く、複数slotを別採点にする、式番号を削る等の誤りfixtureを作る。テストが実際の誤りを検出することを確かめる。

19 実装順序と公開への移行

| 段階 | 実装する範囲 | 完了時に提示するもの |
| P1 基盤 | T01〜T03の最小範囲。資料取込と解法・検算 | 資料から状態・変形・検査まで追跡できるfixture |
| P2 教材設計 | T04〜T06。穴、文章、IR、AI監査 | 各stepの具体案と、回答前後の全状態 |
| P3 表示 | T07。累積解法と組版 | 既存表示を保護したopt-in reader、四幅操作証拠 |
| P4 工程統合 | T08とT10。既存作成・修正へ接続 | 同じ台帳からの火柴図、receipt、再開と失効試験 |
| P5 事例学習 | T09。検索と回帰を先に接続 | 元評価に追跡できるcatalog、学習可能性と棄権の記録 |
| P6 実教材 | 承認済みの代表unitへ限定適用 | 内部QA後、既存公開先の直接URLとsource照合結果 |

代表例の選定

一次不等式の一問、平方完成、区間の最大最小、係数条件を使う複合問題で、必要な構造の違いを確認する。全章を先に一括生成しない。実教材の対象Nと全文は、それぞれの具体設計に記載して承認範囲を明らかにする。

移行と復帰

旧IRとreaderは保持し、対象unitだけ新方式へ切り替える。新規保存データには版を付け、旧履歴を読み戻せるようにする。UIだけ戻す場合でも新保存を消さない。問題の意味が変わる場合は安定IDを使い回さず、対応表と退避を用意する。

公開は既存release経路を使い、unitとsourceを固定する。具体案の既承認とQAが揃った範囲では同じ公開許可を聞き直さない。公開後の教材受入、修正、事後sweep、L01は既存工程へ戻す。

本提案の判断対象

本書の判断対象は、基盤の変更方針・責任分担・配置・実装順序・検証条件である。既存NE02/N11/N12の実物受入や、未作成の二次関数教材全文の承認を含めない。廃止済み確認方式を復活させず、具体的な公開教材で確認する方針を維持する。

工数削減は、再利用したpattern数だけでは測らない。資料照合の手戻り、AI監査の修正回数、検出漏れ、再検査範囲、公開後の指摘を記録する。基準作業との比較ができるまで削減率は約束しない。

20 参照資料と確認範囲

参照日 2026年10月25日。URLは原著・公式文書・実リポジトリを用いる。以下は本提案の根拠と実装参考であり、対象単元の全資料を収集完了した一覧ではない。

R01 既存実装と運用

調査基準source 397788f1。ir、interaction、prose、solver、AI契約、PRODUCTION_README、workflow/INTEGRATION_RUNBOOKを確認。main現在地は4e5ce9e7。

https://github.com/rrikunagasige-dot/kyotsu-step-web/tree/397788f1715b96459032a6647d6fbe772004a7b3

R02 Docling

READMEのcode/model license区別と数式enrichment文書を確認。日本語数学への精度は未評価。

https://github.com/docling-project/docling

https://docling-project.github.io/docling/usage/enrichments/

R03 OATutor

README、MIT license、Problem.js、HintSystem.jsの構造を確認。contentの利用条件は別。

https://github.com/CAHLR/OATutor

https://github.com/CAHLR/OATutor/tree/main/src/components/problem-layout

R04 OATutor Tooling

READMEによる制作と検証の構成を参照。内部codeの適用可否は未監査。

https://github.com/CAHLR/OATutor-Tooling

R05 CTAT

公式example-tracingとlicense。複数経路・誤り経路を参考。研究・非商用等の制約により初期は設計参照。

https://tat.pact.cs.cmu.edu/CMUCTAT/CTAT/docs/tutorial-example-tracing.html

https://github.com/CMUCTAT/CTAT/blob/master/LICENSE.md

R06 Mathsteps

READMEの変形前後・操作・substepsを確認。archive済み。二次関数全般のengineとしての採用ではない。

https://github.com/google/mathsteps

R07 SymPy

不等式solverとcalculusの公式文書。対応範囲付きの検証adapterへ利用。

https://docs.sympy.org/latest/modules/solvers/inequalities.html

https://docs.sympy.org/latest/modules/calculus/index.html

R08 STACK

同値性と要求形式を分ける判定設計を参照。SysEquivを一般不等式判定へ流用しない。

https://docs.stack-assessment.org/en/Authoring/Answer_Tests/Equivalence/

21 研究と資料の利用方針

R09 pyBKT

学習者のskill習得推定の候補。教材品質の判断器とは区別。

https://github.com/CAHLR/pyBKT

R10 既存品質学習

W035 MODEL_RESULT_CORRECTED、train.py、predict.py、外部資産表。15例のうち観点別に利用可能な行数は異なる。

GitHub 参照先 ml

GitHub 参照先 W-MATH-035-choice-order-factor-audit

R11 JASSO EJU

2026年度適用数学シラバスを調査範囲の基準にする。過去問は公式掲載資料から位置を確認して参照。

https://www.jasso.go.jp/ryugaku/eju/examinee/syllabus/mathematics.html

https://www.jasso.go.jp/ryugaku/eju/examinee/pastpaper_sample/index.html

R12 同志社大学公開教材

平方完成の操作説明、例題と空欄、定義域付き最大最小の候補比較を参照。

https://opencourse.doshisha.ac.jp/opc/bj01/math-intro/PC/quad_f1.html

R13 OpenStax

二次関数の式、グラフ、最大最小、応用の構成を比較する参考。

https://openstax.org/books/algebra-and-trigonometry-2e/pages/5-1-quadratic-functions

R14 河﨑 白水 益川 2019

センター数学2題・高校生17名の思考発話研究。設問順の解答と全体方略の理解が一致しない事例を示す。穴埋め一般の因果効果を証明した研究とは扱わない。

https://www.jstage.jst.go.jp/article/jart/15/1/15_149/_article/-char/ja

R15 Atkinson Renkl Merrill 2003

解法提示の漸減と原理に関する自己説明promptの組合せを検討。対象課題での結果を、私たちの不等式教材の効果保証へ拡張しない。

https://doi.org/10.1037/0022-0663.95.4.774

研究紹介ページを開く asu.elsevierpure.com

参考資料の文章・図・問題の転載、構造の参考、機械学習への利用は用途別に記録する。codeのlicense、model weights、教材contentの条件を一つにまとめない。利用条件と版を確認してから採用manifestへ固定する。

22 要望から実装と検証への追跡表

REQは第2〜3章、Tは第17章、Vは第18章に対応する。工程欄は作成時と修正時の主な接続先を示す。実装時には各行へcommit、検証receipt、対象unitを追加する。

| 要望 | 実装タスク | 検証 | 主な工程 |
| REQ01 誘導 | T02 T06 | V03 V04 | C04 C05／R04 |
| REQ02 導出 | T02 T03 T06 | V02 V04 | C04 C05／R04 |
| REQ03 細分化 | T02 T04 T07 | V03 V04 V07 | C05／R04 |
| REQ04 一問の流れ | T02 T07 | V03 V04 V07 | C05 C09／R07 |
| REQ05 解く順序 | T01 T02 T06 | V01 V04 | C03 C05／R02 R04 |
| REQ06 穴の役割 | T04 T06 | V03 V04 | C05／R04 |
| REQ07 計算穴 | T03 T04 | V02 V04 | C04 C05／R04 |
| REQ08 同じ回答 | T04 T05 T07 | V03 V07 V08 | C07 C08／R06 R07 |
| REQ09 教える文章 | T06 | V04 | C05 C09／R04 R07 |
| REQ10 前の結論 | T05 T07 | V03 V07 | C05 C08／R07 |
| REQ11 自立への移行 | T02 T04 T09 | V04 V11 | C05／R04 L01 |
| REQ12 問題型 | T01 T02 T07 | V03 V04 | C02 C05／R04 |
| REQ13 文章構造 | T05 T06 T07 | V04 V06 | C05 C08／R07 |
| REQ14 長さ | T05 T07 | V04 V06 V07 | C05 C08／R07 |
| REQ15 式の位置 | T05 T07 | V05 V06 | C08／R07 |
| REQ16 選択肢 | T04 T07 | V02 V04 V06 | C05 C08／R04 R07 |
| REQ17 括弧 | T03 T05 T07 | V02 V05 V07 | C08／R07 |
| REQ18 文中数式 | T05 T06 T07 | V05 V06 | C08／R07 |
| REQ19 概念 | T05 T06 T07 | V03 V05 | C02 C08／R07 |
| REQ20 図表 | T02 T05 T07 | V01 V03 V06 | C05 C08／R07 |
| REQ21 全件監査 | T08 | V09 | G2／R03 R07 |
| REQ22 詳細案 | T08 T10 | V01 V03 V04 | C05 C06／R04 R05 |
| REQ23 直接確認 | T08 T10 | V10 | G3_HOST G3_FINAL |
| REQ24 AIとCODE | T03 T06 T08 | V02 V04 | C04〜C09／R02〜R07 |
| REQ25 外部資産 | T01 T10 | V01 V11 | C01 C03／R02 |
| REQ26 学習 | T09 | V11 | L01 |
| REQ27 火柴図 | T08 T10 | V03 | 既存三階層diagram生成 |

23 解法データと回答接続の具体契約

以下は新形式の最小データ例である。既存実装で動作する入力ではなく、T02・T04・T05でschemaとmigrationを実装する対象である。数学式は許可したASTとして保持し、表示LaTeXはcompiler側で生成する。

{

  "schemaVersion": "production-ir/2",

  "problem": {

    "id": "linear-demo", "domain": "real",

    "variable": "x", "goal": "solution-set"

  },

  "states": [

    {"id":"S0", "statementRef":"ineq-original"},

    {"id":"S1", "statementRef":"ineq-added"},

    {"id":"S2", "statementRef":"ineq-simplified"}

  ],

  "transitions": [

    {"id":"E1", "from":"S0", "to":"S1",

     "ruleId":"add-both-sides", "operand":{"rational":[4,1]}},

    {"id":"E2", "from":"S1", "to":"S2",

     "ruleId":"simplify-arithmetic"}

  ],

  "answerBindings": [

    {"interactionId":"A", "slotIds":["left-A","right-A"],

     "valueType":"rational", "transitionRef":"E1"}

  ]

}

解答イベントの反映

recordAnswerはinteractionIdと初回回答を記録し、bindingに含まれるslotへ同じ値を描画する。renderを二回呼んでもattemptを二件作らない。誤答時の正答表示と、本人の回答履歴を別に保存する。次stateを開く条件は既存の学習モード規則へ従う。

可視状態と支援

buildVisibleStateはproblem条件、既習facts、完成済みstate、現在のstep、開いたhintだけから構成する。将来のstateと正答は監査の最初の入力へ含めない。補助計算の結果はrejoinStateRefで全体の式へ接続し、detailを閉じても完成済みの解法行は残す。

資料分析の出力

analysisはsourceId、pageまたはblock、observedSteps、inferredMissingSteps、blankRoles、figureTiming、applicablePattern、uncertaintiesを返す。観察した記述とAIが補った説明を区別する。コードは位置と参照を検査し、AIが原本との意味の一致を確認する。

24 検証処理と実装の完了条件

validateTransitionの処理順序

1 入力ASTと許可演算を検査し、変数と仮定を登録する。2 ruleIdの対応範囲を確認する。3 指定操作をbeforeへ適用し、期待するafterを計算する。4 提案afterとの同値性、解集合、要求形式を必要に応じて別々に比較する。5 原仮定を落としていないかを確認し、対象命題と結果を返す。

validateTransition(edge, context):

  parsed = parseAllowedAst(edge, context)

  adapter = resolveAdapter(parsed.domain, edge.ruleId)

  if adapter is None: return UNSUPPORTED

  expected = adapter.apply(parsed.before, edge.operation)

  checks = adapter.compare(expected, parsed.after)

  return receipt(inputHashes, adapterVersion, checks)

| 状態 | 意味 | workflowでの扱い |
| PASS | 指定した検査命題が成立 | 対象checkの証拠として使用。教育評価は別 |
| FAIL | 反例または不一致を確認 | C04/C05またはR04等、原因属性の工程へ戻す |
| UNSUPPORTED | adapterの対応範囲外 | 既存argument経路で明示監査、または対応を追加 |
| NEEDS_SOURCE_ / REVIEW | 原本の条件や数式が未確定 | C01または修正のR01/R02へ戻す |
| NEEDS_AI_REVIEW | 構造だけ確認済みで意味判断が残る | 対象phaseのAI receiptを要求 |
| ABSTAIN | 品質modelに判定根拠が足りない | 自動合格にせず、事例とAI監査を用いる |

実装時に必ず残す成果物

改修差分、schemaと互換表、代表fixture、誤りfixture、数理receipt、可視状態一覧、四幅UI結果、保存移行結果、保護対象inventory、外部資産manifest、AI監査、公開source照合を残す。文書のタスク一覧を実装済みチェックへ手書きで変えるだけでは完了にしない。

全体の受入条件

元資料の根拠へ戻れる。全体の問題と小段階がつながる。本人の回答が解法の次行を成立させる。数理検査の対応範囲と未対応が明示される。説明・式・図・番号・選択肢が実画面で成立する。既存履歴と受入済み教材が保護される。最後に公開教材の直接URLで実物を確認できる。この条件を満たした単元から既存作成・修正の運用へ戻す。

# P-002 技術設計付録 — 何をどう実装するか

Status: PROPOSED
Work: W-GOV-010
Parent: [PROPOSAL.md](PROPOSAL.md)

この付録の型・コマンド・ファイルは実装仕様案。コード断片は契約とアルゴリズムを示す擬似コードで、実行可能な実装・試験完了の主張ではない。既存資産は実パスを記載し、新設予定と区別する。

## 1. 実装構成・依存方向

制作コードはtools/textbook以下、採用教材planはsrc/data/textbook/math/lessonPlans以下を候補とする。AI出力・検査証拠はruntime bundleに入れない。原資料本体は現在の正本の場所を参照し、新たに公開しない。

| 予定ファイル・場所 | 担当する処理 | 入力→出力 |
|---|---|---|
| cli.mjs | 範囲指定、各工程起動、dry-run、再開 | command/manifest→job record |
| schemas/*.schema.json | データの必須項目・相互参照の入口 | source/problem/trace/lesson/audit/release |
| source/import-word.py | OOXML/OMML/画像対応の抽出 | 原本→位置付きblocks/unsupported |
| source/coverage.mjs | 全原問と無番号説明の対応 | blocks/plan→対応・未処理台帳 |
| rules/registry.mjs | 規則ID/版、適用条件、依存知識、未対応 | problem→候補規則と理由 |
| rules/exact-rational.mjs | BigIntの分数・gcd・比較 | 有理数入力→正確な値と演算trace |
| rules/long-division.mjs | 商・余り・循環検出 | 正規化分数→位ごとの状態 |
| rules/repeating-decimal.mjs | 最短周期・倍率・差・約分 | 循環入力→完全解法trace |
| rules/finite-decimal.mjs | 既約分母・2/5因子・構成 | 分数→有限条件・10の累乗への変形 |
| rules/classification.mjs | 定義照合・閉性の反例 | 定義/具体値→分類・根拠 |
| planner/expand.mjs | 解法段階を教育段階へ展開 | trace/既習/規則profile→候補 |
| planner/select.mjs | 前提・分岐・結果利用の制約 | 候補→可否・違反・順位の内訳 |
| prose/ja-templates.json | 対象・目的・操作・条件・結果の文型 | 意味slots→日本語骨格 |
| prose/compose.mjs | 文型・式参照の組立とclaim索引 | plan→本文骨格・数式claim一覧 |
| interactions/propose.mjs | 8分類の穴候補と採否項目 | trace/plan/既習→穴候補 |
| interactions/distractors.mjs | 誤操作モデル・同値検査 | 操作→候補・誤り理由 |
| figures/propose.mjs | 関係から図表の候補 | 値/関係/目的→図表plan |
| figures/render.mjs | 表・SVG等の生成 | 採用図表plan→asset＋値対応 |
| ai/contracts/*.md | AI工程別の入力と提出形式 | source/context/draft→規定形式のJSON/全文 |
| ai/import-result.mjs | AI出力のschema・出典・版照合 | 保存出力→承認待ち候補 |
| benchmarks/ | 受入・拒否・境界・故障の固定例 | source付きfixture、期待検出・非検出 |
| compile-lesson.mjs | 確定plan→既存TextbookUnit | plan→runtime/番号/参照/source map |
| verify/{source,math,plan,visibility,render,app}.mjs | 分離検証 | 固定入力→範囲付きreport |
| jobs/*.json / reports/ | 採用出力、指摘、hash、再開点 | 実行証拠。生徒bundleから除外 |
| src/data/textbook/math/lessonPlans/*.json | 確定した制作plan | 候補の自動公開先にしない |

最初から全ファイルを細かく分けること自体を目的にしない。M1–M3で必要なものを実装し、同責務は小さくまとめられる。依存方向はsource→problem→trace→teaching/prose/interactions/figures→lesson→runtime。rendererが学習の意味を逆推測しない。

Nodeのbuild経路へPythonを必須化しない。Pythonは原本取り込みだけに使える。SymPyを採用する場合も、まず必要な検証の可否と導入コストを確認し、生成側Node整数演算と分離した補助validatorとして固定版を使う案。新しいライブラリの全面導入やモデルAPI契約を前提にしない。

## 2. 最小データ契約

### 2.1 sourceとproblem

source blockはblockId、documentHash、locator、kind、rawStructureRef、normalizedContent、extractionStatusを持つ。locatorは段落・表セル・画像relationship等から元位置を追えるもの。編集で段落位置が変わる改訂では新旧対応を明示し、出現順だけで同じIDとしない。

problem contractはproblemId、sourceRefs、scope、symbols、assumptions、givens、goal、answerContract、requiredConceptsを持つ。answerContractは数式として等しいかと、最小・既約・全解等の要求を別々に表す。

```json
{
  "problemId": "N07-Q09",
  "sourceRefs": ["word-n07-q09"],
  "scope": "math-numbers-expressions-n07/N07-Q09",
  "symbols": [{"name":"x","domain":"real"}],
  "givens": [{"kind":"pureRepeatingDecimal","symbol":"x","integer":"0","repeat":"69"}],
  "goal": "convertToRational",
  "answerContract": {"reduced":true,"scaleBase":"10","requireMinimumScale":true}
}
```

これは現行値に基づく例。source locatorや最終の要求範囲は原本と具体設計で確定し、上記をそのまま入力済みとはしない。

### 2.2 数式構造

最小の式型はInteger、Symbol、Add、Multiply、Power、Fraction、Equality、Inequality、RepeatingDecimal、Absolute、Sqrtを段階的に対応させる。分数・根号・指数は対象ノードを明示する。入力構造を保つ形式と値の正規化を分け、0x等の教学上必要な形を自動削除しない。

未知の式型はraw参照付きunsupportedとする。LaTeX文字列の置換で未知構造を補わない。自由なプログラム文字列として数式を実行せず、許可した式ノードを評価・表示する。

### 2.3 完全解法trace

各stepはstepId、inputRefs、ruleId/version、requiredAssumptions、appliedOperation、outputExpressionRefs、claims、evidenceStatusを持つ。規則で生成した式と、AI補完の論証は由来を分ける。

同値変形、含意、例、反例、定義、一般主張を区別する。例えば平方して得た式は、元の条件なしに同値とは記録しない。解集合を保持し、途中の条件追加・枝の消失を検査する。

### 2.4 teaching node

各nodeは次を必須とする。

| 項目 | 意味 |
|---|---|
| id/problemId/sourceRefs/traceRefs | 問題・原本・完全解法との接続 |
| role | definition/property/proof/example/application/interpretation等 |
| goal/purpose/target | 今何を、なぜ、何に対して行うか |
| knownRefs/requiresConcepts | 直前に使える確定結果と導入済み知識 |
| operation/reason/conditions | 操作・根拠・成立条件 |
| learnerAction/blankDecision | 本人の行為、穴の採否と理由 |
| before/after | 回答前後の本文・式・図表・claim参照 |
| produces/reusedBy | 得られる結果と使う先 |
| stageId/visibility | 段階境界と解放条件 |
| provenance | 規則生成・AI編集・設計承認の由来 |

必須項目があるだけでは教育上の合格にしない。値が空疎なら監査対象。orderedNodeIdsが採用順序の正本。候補生成時の依存DAGと採用順を分ける。

### 2.5 interaction・図表・組版

interactionは既存8分類、操作subtype、回答型、対象式範囲、正答、accepted variants、誤答理由、ヒント段階、開示方針を持つ。初回導出と既知結果利用を区別し、既習公式の表示まで一律「漏洩」としない。

figure/tableはpurpose、source/value refs、unresolved cells、before/after、caption/alt refs、原図hashまたは生成器版を持つ。

render planはequationId、logicalRows、relation/continuation区別、alignmentGroup、numberAnchor、不可分の項/因子境界、優先折返候補を持つ。幅は物理行だけを変え、数学node順・式ID・番号の意味を変えない。

## 3. 規則一つの設計例

規則PURE_REPEAT_TO_FRACTION@1の初期対応を「非負の純循環小数、整数部分あり、最短周期を計算可能」とする。負数と混循環は別profileまたは未対応を明示。未対応入力を切り落として計算しない。

| 規則の項目 | 内容 |
|---|---|
| 入力 | 整数部分I、繰返し文字列R、文字x、答え方 |
| 適用条件 | 数字列が空でない、整数と循環部の構造確認、初期対応範囲 |
| 依存知識 | 位取り、10の累乗、等式の性質、分数・約分 |
| 数学手順 | Rを最短周期へ→k桁をそろえる10^k→二式の差→係数で割る→既約化 |
| 教育段階profile | 周期を見る、そろえる目的、倍率選択、式生成、対応、操作、左右の差、分数、意味 |
| 穴候補 | 周期・倍率・式・操作・係数生成・約分・解釈 |
| 文型 | 対応部分を見る、操作対象、結果の用途、前方法との差 |
| 図表候補 | 二式の桁そろえ、周期対応、係数計算 |
| 誤答モデル | 一桁ずらし、係数で1を引き忘れる、分子分母逆、片側約分 |
| oracle | 出力分数の交差乗算・独立整数除算、既知境界例 |
| 不確定 | 0/9循環の扱いが未定なら正規化方針を決めるまで保留 |

数学trace擬似コード：

```text
require supported(problem)
period = shortestPeriod(problem.repeat)
k = period.length
scale = exactPower(10, k)
before = sourceDecimalExpression(problem)
scaled = shiftDecimalExactly(before, k)
trace += multiplyBothSides(before, scale)
trace += subtractEquations(scaled, before)
trace += collectCoefficient(scale - 1)
trace += divideBothSides(scale - 1)
trace += reduceRational()
return trace + assumptions + answerContractChecks
```

ただしshiftDecimalExactlyとsubtractEquationsを同じ正解文字列の挿入にしない。数の構造から生成し、出力分数を別の整数除算で検証する。一般の無限小数への操作の根拠は、有限の小数桁を機械的に並べたことだけでは証明できない。N07で既に教える小数・等式の扱いに沿う説明を用意し、その論証をAIが点検する。

## 4. 候補生成・選択・穴決定の手順

### 4.1 順序と分割

```text
trace = verified complete solution
profiles = registry.match(problem, trace, learnerContract)
for profile in profiles:
    nodes = expandSemanticStages(profile, trace)
    nodes = proposeNeededDefinitions(nodes, priorKnowledge)
    candidates = proposeSplits(nodes, explicitOperationComplexity)
    reject candidates with missing prerequisite, wrong scope,
        uncovered branch, invalid dependency, unused unexplained detour
    rank remaining candidates using reported criteria
AI selects/edits a candidate with source/trace-linked reasons
validate selected order and save orderedNodeIds
```

rankは選びやすくする情報であって自動合格点ではない。最初は少数のprofileと限定分割候補で始め、全ての並べ方を列挙する探索や重い最適化を作らない。ルールにない分岐の理由はAIの根拠付き設計として残す。

### 4.2 穴候補

規則にisNewDecision、requiresConcepts、operationKind、candidateBlankSpans、dependentResultsを持つ。既習台帳と対照し、以下を実行する。

1. 未導入名称の当て物候補はrejectし、定義の説明候補を戻す。
2. 重要な新判断には方針・式生成・理由・解釈の候補を出す。
3. 一候補が複数未習判断を代行するなら分割案を出す。
4. 直接答え・同値答えが早期表示される候補はvisibilityへ差し戻す。
5. 同じ判断を見本→練習→適用とする場合、前例と何が変わったか示す。
6. AIは採用・非採用と理由、支援量、先に示す内容を確定する。

支援量を決める既習台帳にはconcept introduced、method demonstrated、practice offered等の教材上の状態を持つ。回答正解をlearner masteredへ自動変換しない。適応学習で個人に合わせる仕組みは今回の対象外。

### 4.3 文章骨格の生成

文型は条件付きで選ぶ。例えばfactor-commonの場合、target=一次項、shared=x、remaining=[2y,-3]、nextUse=一次係数を渡す。

- 前段が対象をまだ示していない→「まず、{targetExpression}に注目します。」
- 共通部分の説明が必要→「どちらの項にも{shared}が掛かっています。」
- 操作を見本として教える→「そこで、{shared}をくくり出し、残る係数を括弧にまとめます。」
- 操作を本人が選ぶ→上の具体操作文は回答後へ置き、回答前には比較対象と目的を示す。
- 結果後→「この括弧全体を{variable}の係数として読めます。」

操作を教える文型と操作を答えさせる穴を同時に回答前へ置かない。AI編集後もclaimとvisibilityを再検査する。文体・接続をコードだけで完全採点しない。

## 5. N07-Q09の画面状態例

この表は設計方法の実例で、最終穴数・全文の承認要求ではない。前例の既習状態を含むN07全設計で採否を決める。

| 状態 | 回答前に見せる情報・誘導 | 本人の操作候補 | 回答後・残す結果 |
|---|---|---|---|
| A 周期 | x=0.696969…、同じ数字列へ着目 | 必要なら周期69の認識 | 周期2桁。新記号は説明してから利用 |
| B 倍率 | 元の数と小数部分が同じになるよう小数点を動かす。前例との桁数の違いへ着目 | 最小倍率100を選ぶ | 確定した倍率だけを保持。次の式を先に完成表示しない |
| C 式生成 | xの定義と選んだ倍率100 | 倍率後の式100x=69.6969…を作る | 二式を同じ桁で並べ、同じ部分を確認 |
| D 操作 | 二式の同じ小数部分を比べ、その部分を消す目的を示す | 二式を引く操作を選ぶ | 選んだ操作を説明し、差の入力へ |
| E 左右の差 | 二式と操作。対象を左右に分ける | (100−1)xの係数や右辺69を構成 | 99x=69を保持 |
| F 分数 | 確定した99x=69、既習の等式操作 | 両辺除算・分数化 | x=69/99 |
| G 約分 | 分子分母をそろえて表示 | 両方を3で割る | x=23/33、最終結果をQ14用に保持 |
| H 意味 | 定義と確定した分数 | 有理数という解釈候補 | 無限に続くことと有理数であることを区別 |

状態ごとに正答前・誤答後・ヒント・正答後・次段階・履歴・再読込を確認。前段階の結論が次の本人の判断を丸ごと答えてしまう場合は、穴の目的か解放を変える。

## 6. AIの入出力契約と監査方法

最初は既存アシスタントと保存ファイルで運用する。APIの存在・認証・料金を仮定した自動呼出し基盤を新設しない。将来API化しても同じ入出力契約を使える設計にする。

| AI工程 | 渡すもの | 提出を求めるもの | 渡さない合格根拠 |
|---|---|---|---|
| source reviewer | 元資料参照・抽出blocks・未対応・範囲 | 対応・矛盾・重要無番号説明 | 「抽出率100%だから完全」という自己評価 |
| solution editor | problem contract・規則trace・既習範囲 | 不足論証・別解・条件・claim | 現行アプリの正答だけ |
| teaching editor | 検証済みtrace・候補・失敗/受入例 | 採用順と理由、全文、穴・図採否 | 長さ・穴数だけの品質点 |
| adversarial reviewer | 元資料・要求・教材・表示状態・基準 | node別の欠陥・根拠・反例・戻り先 | 制作AIの「良くできた」という合格理由 |
| patch editor | 確定findings・許可範囲・対象plan | 最小修正・影響先・未解決 | finding削除による問題隠し |

入力にはscope ID、対象hash、必要な規則/教訓、期待出力schemaを含める。出力にAI-generated provenanceを残し、schemaが通っても採用・承認は別。古い入力版の出力は取り込まない。

監査findingの項目：findingId、severity、category、problem/node/state、引用する該当文または式ID、原資料/規則根拠、問題の具体説明、反例または再現、修正案、invalidate工程、status。重大欠陥の総合点による相殺は禁止。

## 7. CLI・compile・実行台帳

予定するコマンド形。実装時にpackage scriptsとの整合を確認する。

```bash
node tools/textbook/cli.mjs inspect --unit n07 --source-manifest <path>
node tools/textbook/cli.mjs propose --unit n07 --stage solution
node tools/textbook/cli.mjs propose --unit n07 --stage teaching
node tools/textbook/cli.mjs import-ai --unit n07 --input <result.json>
node tools/textbook/cli.mjs verify --unit n07 --layer design
node tools/textbook/cli.mjs export-proposal --unit n07
node tools/textbook/cli.mjs compile --unit n07 --plan <approved-plan.json> --check
node tools/textbook/cli.mjs verify --unit n07 --layer app --artifact <path>
node tools/textbook/cli.mjs resume --job <job-id>
```

proposeは候補保存のみ。compileは承認・範囲を持つ確定planだけをruntimeへ書ける。--checkは生成差分を検出して書き換えない。公開操作は上記生成コマンドへ暗黙に含めず、既存deploy経路へ渡す明示工程とする。ただし承認済み単元の公開でユーザーへ再許可を求めない。

compileの処理順：schema検証→source/trace参照→採用順/解放→ID/revision→runtime変換→番号/参照生成→既存validateTextbookUnits→正規化出力hash→保護範囲差分。時刻やランダムIDをruntime生成に混ぜない。AI出力は生成時に保存済みの採用版を使い、compile中にAIを呼ばない。

job recordには工程状態、inputs/outputs hash、rule/schema/template版、accepted plan参照、executor環境、started/ended、結果、findings、retryCount、invalidatedBy、resumeStage、必要な次操作を持つ。Workの承認状態とは別管理し、job成功をWork承認に読み替えない。

## 8. 実装タスクと依存

| Task | 段階 | 作業・成果物 | Depends on | そのタスクの検証 |
|---|---|---|---|---|
| T00 | M0 | P-002承認・範囲・公開方式を記録 | ユーザー承認 | P-001と承認範囲を混同しない |
| T01 | M0 | 旧確認義務・現役規則・governance validatorを整合 | T00 | 辞書/Work/MASTER/テンプレート横断、新方針を旧文字列必須でrejectしない |
| T02 | M1 | 最小source/problem/trace/lesson schemaとfixture | T00 | 欠損・重複・範囲違反をreject |
| T03 | M1 | 原本取り込み・未対応・無番号coverage | T02、原本 | 分母・根号・画像位置の固定例、全N07対応 |
| T04 | M1 | 既存schema adapter・plan lookup入口 | T02 | 既承認データ不変、対象N0件失敗 |
| T05 | M2 | exact rational・除算trace | T02 | 正負・整数・循環前置・0・非零分母 |
| T06 | M2 | 循環小数→分数・最短周期 | T05 | 一桁/二桁/非最短文字列、別除算oracle |
| T07 | M2 | 有限分母・列挙・分類・一般論証の契約 | T03/05 | 既約性・分母1・全候補・反例と証明区別 |
| T08 | M3 | 教育段階profile・前提台帳・候補生成 | T06/07 | 定義前使用、往復、範囲混入の故障例 |
| T09 | M3 | 文章骨格・8分類穴・誤答・図候補 | T08 | 操作を先に露出しない、真偽と最小を区別 |
| T10 | M3 | AI契約・結果取込・反証提出・限定修正 | T08/09 | 古いhash・欠損根拠・未解決を取り込まない |
| T11 | M3 | 結果参照・履歴・番号・組版plan | T04/09 | 解放・参照・安定番号、数学token保持 |
| T12 | M3 | 小例のcompile・verify縦断、job再開 | T10/11 | 同入力一致、中断出力不採用、故障検出 |
| T13 | M4 | N07全14原問＋無番号説明の全設計 | T03/07/12 | 全文・全判断・図表・進捗・QAを提示 |
| T14 | M5 | 承認済みN07組込・必要ID移行 | N07具体設計承認 | 旧/途中/完了進捗、保護単元 |
| T15 | M5 | scoped QAと共有変更の回帰 | T14 | 対象全件、4幅、全履歴、誤答・hint |
| T16 | M5 | live設定確認・artifact/manifest公開 | T15 | expected HEAD、配信source・資産一致 |
| T17 | M5 | 公開全対象操作・直接URL | T16 | 実配信route、全回答到達、保存/reload |
| T18 | M6 | 指摘修正・受入・規則反映 | 公開レビュー | 差し戻し・失効・再発例と人間受入を記録 |
| T19 | M7 | N08以降の規則を必要順に追加 | N07評価・次範囲 | 各Nの原本・全設計・公開・受入 |

T03とT04、入力が確定した固定検算等は独立に進められる。T13は基盤が完全完成するまで全読解を待つ必要はないが、確定設計の提出は縦断結果と整合させる。教材を先に大量改稿して後から基盤を合わせない。

## 9. 検査器を検証する固定例

以下は実装予定の評価例。成功/失敗を事前に固定し、生成器自身の正解だけをoracleにしない。

| Fixture | 入力・変異 | 期待する検出／通過 |
|---|---|---|
| F01 | 3/4 | 正確に0.75、余り0。有限小数 |
| F02 | 23/11 | 整数2、余り1→10→1、周期09 |
| F03 | 0.overline(8) | 最小10倍、8/9。100倍等式は真だが最小回答不適合 |
| F04 | 0.overline(69) | 最小100倍、23/33 |
| F05 | repeat=6969 | 最短周期69。10000倍を最小としない |
| F06 | 分母0 | 数式評価前にFAIL |
| F07 | 6/15 | 既約2/5。元分母の3だけを見て循環と判定しない |
| F08 | 分母1、負の有理数 | 整数・符号を正しく扱うか未対応を明示 |
| F09 | 正の分母qの余り遷移 | 余り範囲、10r=q×桁+次余りが各段成立 |
| F10 | 2≤a≤20 | 2,4,5,8,10,16,20を全件確認。12/15混入・16欠落を検出 |
| F11 | 有理数定義が初分類の後 | 定義前使用を検出。名称を見た事実で導入済みにしない |
| F12 | 次例のx結果を参照 | problem scope違反 |
| F13 | 倍率穴の前に100倍と完成式 | 直接/同値の露出を検出。意味的露出はAIも監査 |
| F14 | 既習定義の参照 | 有理数定義を示すだけで全て漏洩としない |
| F15 | 分数の分母が集合ノードへ変化 | MathML意味構造でFAIL。幅PASSで相殺不可 |
| F16 | 短い2xy=(2y)xを4行に分断 | token保持だけでPASSにせず組版規則・実画面へ指摘 |
| F17 | 候補ボタン内だけoverflow | 親ページ幅が正常でもFAIL |
| F18 | 指定Nの検査0件 | 失敗。空集合の成功を禁止 |
| F19 | 古いSHAのQAを新sourceへ添付 | 証拠不一致。再利用なら元hashと根拠を明示 |
| F20 | √(a²)=aをa<0でも適用 | 条件違反。N09以降の規則導入で有効化 |
| F21 | 平方一致だけで負の候補を主平方根へ採用 | 非負条件欠落。N09/NE02追加時 |
| F22 | 受入第一タイトルの本文・ID・進捗変更 | 保護差分FAIL |
| F23 | 新しい穴へ旧複合回答を全件引継ぎ | 移行意味の違反 |
| F24 | docs-only更新で自動配信 | 本文改修用の公開工程に進まない |

既知の「難しくても正しい」例も置き、過剰分割・正しい参照の漏洩誤判定を検出する。故障例は最初から全分野分を実装せず、規則導入に合わせて有効化し、未実行を明記する。

## 10. 変更・キャッシュ・保護範囲

依存索引はsource block→problem→rule/trace→node→interaction/figure/equation→runtime asset→QA caseを結ぶ。変更時に到達範囲を計算し、削除やID意味変更を黙って新規としない。

cache keyには実際の依存hash、規則/schema/compiler/template版、AI出力採用版、必要ならrenderer/browser/font版を含める。条件が不明なら再利用しない。AIの再実行結果を同設定だけで同じと扱わない。

保護基準は第一タイトル22bc43baのデータ・図・ID・revisionと既承認集合。共有renderer変更時は表示基準も確認。無関係モードは差分保護と必要な共有回帰を実施し、毎回全科目の重い試験を機械的に走らせない。

## 11. 公開・失敗・復旧の詳細

既存公開アプリとPages以外は使わない。実装時にlive mainのworkflow/pointerを再取得し、ローカルfeatureの旧workflowと差分を確認する。

release recordの最小項目：unitIds、Work/proposal/plan承認参照、sourceCommit、hostingCommit、artifactId/hash、manifest/assets hash、テスト環境・範囲・結果、Actions run、公開実物確認時刻、実配信source、対象URL、previousRelease。

公開前に期待HEAD付き更新と単一公開列を使う。途中の別Nで公開対象を上書きしない。キャンセルされたrunの部分成果物を完成扱いしない。CI待機中は承認済み独立作業を進め、記録したrunの安全な区切りで戻る。

失敗状態は、生成失敗、検査不合格、build失敗、公開未反映、公開不整合、実操作破損を分ける。前四者を「ネット切れ」と決めつけない。どこまで確定したかをjobとWorkに残して再開する。

復旧候補は前の受入sourceと成果物。新revisionを既に使った利用者の回答を退避・保持できることを確認し、必要なら新bundleによる互換修正を選ぶ。復旧後も実配信と対象操作を確認し、古いrelease記録だけを添えない。

## 12. N07具体設計として次に提出する形式

N07設計は以下を全14原問と無番号説明について埋める。省略した雛形だけを提出しない。

| 項目 | 必要な具体内容 |
|---|---|
| 原資料対応 | source位置、元式・条件・要求、採用先、無番号定義・性質 |
| 完全解法 | 省略なしの操作、適用条件、一般主張の論証、最終結論 |
| 読者前提 | 説明済みの定義・方法、必要な復習、未導入項目 |
| 採用順序 | 小目標・前結果・操作・根拠・結果利用を全nodeで記載 |
| 本文 | 回答前・正答後の実際の全文、必要な会話、式の間の説明 |
| 穴・選択肢 | 位置・型・本人の思考・正答・全誤答と理由・支援採否 |
| 図表 | 原図/新作の目的、値、配置、表示時点、前後の文章 |
| 画面 | 段階境界、前結果欄、結論記録、履歴、問題/解説の役割 |
| 組版 | 全式の論理行・整列群・番号・折返し方針 |
| 互換 | 保持/新規/退役item ID、意味変更、revision、旧回答保存 |
| 検証 | 原資料・数学・教育・露出・実操作・画面・回帰の対象 |
| 未解決 | 断定できない点と実装前に解く必要性 |

この形式を満たしてからN07教材変更へ進む。ユーザーが全体または一部を承認した範囲を記録し、その完成単位を直接既存公開アプリで届ける。

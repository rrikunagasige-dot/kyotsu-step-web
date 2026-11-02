<!-- W046_LATEST_PROPOSAL_START -->
## 現在の修正提案：P-W046-UX-06（2026-11-03 JST）

[本人確認用の案](evidence/ux06-proposal/README.md)。最新指摘へのR04案。旧UX05の承認を新案へ流用しない。以下は既存提案の履歴として保持する。
<!-- W046_LATEST_PROPOSAL_END -->

# Proposals — W-MATH-046-n0910-approved-nine-continuation

## P-W046-UX-05 — 主判断を生徒に残し、確定後は自然な数式へ戻す

Status: PROPOSED
Created: 2026-11-02
Approved by user: NO
Implementation started: NO
Baseline: candidate source `66c8007b37cc12391c9df574b8ebbb1b95cf26f5` / feedback record `32139fa41e6632c1e95bf5147af9c030e7d4fed8`
N09 r6 compiled `470f137102936e6bb73ca3df835e8c9b27d19c5ce53a40879fe9c2dfa8499a3d` / N10 r4 compiled `3cfe95380892a1d7a34fdc3fa142448a9f953ddc983427c9626b4fbdd8b0b895`
Target: N09第7版（第6版から）／N10第5版（第4版から）

本書はUX04への本人要修正を受けた新しい具体案。UX04の承認は[その設計と承認記録](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/66c8007b37cc12391c9df574b8ebbb1b95cf26f5/work/items/W-MATH-046-n0910-approved-nine-continuation/PROPOSAL.md)として保持し、本案へ流用しない。現在の公開中教材はdb99a485（N09r5/N10r4）のまま。本案作成中の製品・main・公開変更はない。

## Problem / Need

本人は、正答後の第二因子(x＋4)だけが大きく空く表示と、中高生に基本的な＋4/−4の逆演算を別問として繰り返す設計を要修正とした。中心となる推論は、積が0である式から、各因子が0となる二条件を生徒が作ることだった。UX04はその条件を自動表示してorだけ問い、周辺の易しい操作を増やしていた。

原因は二つに分ける。教育面では、異なる演算を列挙することを、学年・既習事項・当該概念の主判断を評価する代わりにした。表示面では、正答済み数式にも44pxの操作用phantomを残し、括弧や分数等の構造寸法へ入れていた。旧技術PASSはこの二つの受入を証明していなかった。

## 既存基準と本案の判断基準

正本main `6bc54447ef015a2a579a56a5966ceb58a0600d3a` の [MASTER§8](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/6bc54447ef015a2a579a56a5966ceb58a0600d3a/docs/MASTER_APP_LESSONS.md#L251)、[§11](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/6bc54447ef015a2a579a56a5966ceb58a0600d3a/docs/MASTER_APP_LESSONS.md#L339)、[§§52–53](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/6bc54447ef015a2a579a56a5966ceb58a0600d3a/docs/MASTER_APP_LESSONS.md#L1240)を適用する。[数学SPEC§2/5](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/6bc54447ef015a2a579a56a5966ceb58a0600d3a/subjects/mathematics/textbook/SPEC.md#L49)の高校初学・習得直後/非自明という要約は、元の承認・MASTERを上書きしない。

1. 当該概念で初めて判断すること、既習事項を使って主要な式/条件を作ること、その理解を確かめる必要な計算/比較を採点対象とする。
2. 必要な途中式と根拠は示す。既習の逆演算・符号を全て独立穴にする必要はない。
3. 主判断の答えを前文・後続式・候補説明で先出ししない。未知の法則は教え、具体例への適用を生徒に残す。
4. N09Q08の平方計算/比較はMASTER§53の明示例として保持する。新しい関係を使う計算を、arithmeticだからと全てAUTOへ戻さない。
5. 正しい同値表現・因子順の交換を誤答にしない。一つの推論の結果である条件の組を問うことと、複数の独立推論を含む完成解法全体を当てさせることを区別する。
6. 穴の増減を品質目標にしない。主判断を奪わず、支援は既習内容・初回適用・転移によって変える。

[既存の18群/全86node監査](evidence/ux05-feedback/PEDAGOGY_AUDIT.md)から、以下の単元別契約で変更/維持を確定する。監査候補を全て機械的に実装する案ではない。

## 公式問題との照合

rootが実取得・レンダリングして確認した [EJU2021第1回C1 I問1](https://www.jasso.go.jp/ryugaku/eju/examinee/pastpaper_sample/__icsFiles/afieldfile/2022/01/28/2021_1question_math.pdf)（冊子数学−2）と [2025共通数学I,A第1問〔1〕](https://www.dnc.ac.jp/albums/abm.php?d=771&f=abm00005956.pdf&n=2025_op_26_sugaku1A.pdf)（冊子4–5頁）を、条件→式形成/因数分解→解/条件の判断という認知単位の参考にする。本教材の原問題を過去問へ置換しない。[出所/実見範囲](evidence/ux05-feedback/SOURCES.json)を保持し、子担当による原典の独立実見を捏造しない。

## Scope / Out of Scope

N09全41/N10全45nodeを、単元別詳細でKEEP/CHANGEへ対応する。各CHANGEの最初に表示する情報・完成解法・全候補/誤答理由・row/partの解放・旧part対応を確定する。KEEPは固定source66c8007bの同じIDの問い/型/正答/全候補/学習行為を保持する参照契約とし、無意味な再転記を避ける。

共有の正答後数式表示と状態別group計画は、N09/N10の現行/保管native版を影響対象に含める。教材の採点・意味を変えるのは各新revisionの承認対象だけ。保管教材の原データと記録は不変とし、共通rendererによる自然組版の修正を受けることは明示して検査する。

原問題/数値/図/source Word、N08の教材内容、他単元/他モードの設問、共通header・現在stage・番号付き選択肢・左下reset・連続した本文を保護する。新しいカードUI・初等計算ドリル群・別学力モード・依存/lock更新・governance改変を追加しない。main反映/公開/本人総合受入/Gold/fitは本案の承認範囲へ含めない。

## Proposed Solution — 単元別具体契約

次の二単元設計は本案の一部。完成解法は設計審査用であり、未回答の生徒へ初期表示する全文ではない。全候補表の正答印も制作資料のみで、生徒画面へ出さない。


## 修正の要点と適用順

全86ブロックを監査し、N09は16変更/25維持、N10は9変更/36維持とする。変更は25ブロック。全ての穴を増やす・減らすという方針にはしない。

|対象|旧設計の問題|今回の具体的な修正|
|---|---|---|
|N09 負数の平方・全解|零条件を先に表示し「または」だけ採点。基本逆演算を別問化|因数分解の式を作り、次に積から「x−4=0 または x＋4=0」という条件の組を選ぶ。逆演算は必要な途中式として表示|
|N09 平方根・絶対値|確定済み平方の再入力、−aの符号やscopeの写し|確定値を参照し、非負の平方根の選択、差の符号、絶対値の具体適用、負号を含む式の整理に判断を置く|
|N09 小数平方|公式の適用が自動、周辺の基本操作が細分化|和の平方の中項を作る判断を追加。既存の1.41²/1.42²の必要計算6問と大小比較を保持|
|N09 整数部分・小数部分|符号/括弧/0の入力に分割|負数の候補が0≤r<1を満たすか、確定整数部分を使ってrの式を作れるかを問う|
|N10 根号の和|共通因子をくくる主判断を自動表示|2√2＋5√2から(2＋5)√2を作る判断を先に置く。係数7の計算はその後|
|N10 平方・和と差の積|−一字だけの選択、または分配の過剰細分化|平方の中項を符号込みで作る。和と差の積では相殺する具体的な交差項の組を作る|
|N10 有理化|分子/分母の写し、演算記号や同じ平方値の再入力|分子全体の分配式・分数全体への公式適用・中項生成を問う。既に確定した値は参照し、初めて必要な平方計算/正性/非零判断は保持|
|共有数式表示|正答済みでも44px操作領域が括弧等を引き伸ばす|正答済み部分は通常の数式構造へ戻す。未回答部分の操作領域を保ち、部分正答ごとに幅と改行を再計画|

変更する各ブロックの下記詳細には、完成解法、初期に見せる条件、設問、全候補・誤答理由、正答後の解放順、旧回答の処遇を記載する。設計資料の正答・完成解法を生徒画面へ初期表示する意味ではない。

承認後は、まず写真のN09代表と共有表示修正を実装・実画像検証する。本人の代表細部確認後に残りへ適用する。旧回答は同じ意味の記録を保持し、廃止設問は旧版へ保存、新しい判断は未回答として扱う。

|設計集計（品質目標ではない）|N09|N10|計|
|---|---:|---:|---:|
|対象ブロック|41|45|86|
|変更|16|9|25|
|維持|25|36|61|
|旧回答契約|52|63|115|
|同一意味で保持|32|52|84|
|旧版に保存し新問へ流用しない|20|11|31|
|新しい判断|11|8|19|
|新版の回答契約|43|60|103|

詳細の機械可読版：[N09](evidence/ux05-proposal/N09_DESIGN.json) / [N10](evidence/ux05-proposal/N10_DESIGN.json)。集計は提案の構造照合であり、未実装の製品検査や学習効果の実証ではない。


## P-W046-UX-05 N09 完成修正案
基準66c8007b・N09r6 compiled470f。N09r7案。製品変更なし。全41nodeを対応し、KEEP契約は基準の同IDを正本参照する。
```json
{
  "nodes": 41,
  "changeNodes": 16,
  "keepNodes": 25,
  "oldParts": 52,
  "keptParts": 32,
  "retiredParts": 20,
  "newParts": 11,
  "targetParts": 43
}
```
### 判断の単位
零条件の組は法則を具体的な二因子へ適用する一つの推論。移項・因数分解・零条件・解を一括選択させる全解法丸当てではない。因数分解は独立判断、基本逆演算は必要な途中式。因子順を交換した正しい式を誤答にしない。
### 表示と保存
{
  "wholeCondition": "factorZeroConditionUX05はenum値で採点。本文のtext足場は「条件の組：{slot}」という短い選択ラベルだけを表示し、長い条件latexをslot内部へ詰めない。",
  "mathLines": "閉じたLaTeX配列を一候補の一ボタン内で行ごとに描画。採点値は一つ。候補の式はまたは/かつという意味境界で改行。正答後は通常math二行へ置換。共通UI内、card追加なし。",
  "narrow": "320/390/430/1440（768は追加任意）で単一長式slot・ボタンoverflow・不自然な等号折返しを実装時に検査。現時点で描画PASSは未主張。"
}
{
  "sourceRevision": 6,
  "targetRevision": 7,
  "snapshot": "r6のcompiled470fを不変snapshotとして保存。r5/r4/pilot/legacyの認識・鎖・旧版route・履歴/resetを保持。",
  "keep": "同ID契約一致32件。旧正答を再入力要求せず、NEW前提より後の記録は正答保存のままpending。",
  "retire": "20件は出所付き保存。NEW11件を旧記録やterminal完成で代用しない。",
  "nativeHash": "未知native hashで破壊・上書きしない。新hash厳密edgeを追加する。",
  "n10": "r4を無断改訂しない。別N10案の改訂は別明示契約で統合。"
}
### 全node対応
|node|判断|保持/廃止/新規|
|---|---|---|
|n09-q01-positive|KEEP|0/0/0|
|n09-q01-negative|CHANGE|2/1/0|
|n09-01|CHANGE|0/5/2|
|n09-definition|KEEP|0/0/0|
|n09-q02-root|KEEP|1/0/0|
|n09-q02-negative-square|CHANGE|0/2/1|
|n09-02|KEEP|0/0/0|
|n09-boundary|KEEP|0/0/0|
|n09-q03-inside|CHANGE|0/1/0|
|n09-03|KEEP|1/0/0|
|n09-q04-nonnegative|KEEP|1/0/0|
|n09-q04-negative|CHANGE|1/1/0|
|n09-04|KEEP|0/0/0|
|n09-05|KEEP|1/0/0|
|n09-q06-squares|KEEP|1/0/0|
|n09-q06-order|KEEP|1/0/0|
|n09-06|CHANGE|0/2/1|
|n09-q07-negation|CHANGE|0/1/1|
|n09-07|CHANGE|0/4/1|
|n09-decimal-method|CHANGE|0/0/0|
|n09-p001-q08-left-square|CHANGE|3/0/1|
|n09-p001-q08-right-square|CHANGE|3/0/1|
|n09-p001-q08-lower-sign|KEEP|1/0/0|
|n09-p001-q08-upper-sign|KEEP|1/0/0|
|n09-08|KEEP|0/0/0|
|n09-09|KEEP|2/0/0|
|n09-parts-target|KEEP|0/0/0|
|n09-q10-reject-truncation|CHANGE|1/0/1|
|n09-10|KEEP|1/0/0|
|n09-q11-remainder|CHANGE|1/1/0|
|n09-11|KEEP|0/0/0|
|n09-q12-lower|KEEP|1/0/0|
|n09-q12-upper|KEEP|1/0/0|
|n09-12|KEEP|2/0/0|
|n09-q13-reverse|CHANGE|2/0/0|
|n09-13|KEEP|2/0/0|
|n09-q14-positive-integer|KEEP|1/0/0|
|n09-q14-positive-remainder|CHANGE|0/1/1|
|n09-q14-negative-integer|KEEP|1/0/0|
|n09-q14-negative-remainder|CHANGE|0/1/1|
|n09-14|KEEP|0/0/0|

### n09-q01-positive — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-q01-positive

### n09-q01-negative — CHANGE
括弧を含む平方の作用と計算は残し、独立した積の符号小問を減らす。
完成解法：(−4)²=(−4)×(−4)=16。括弧内全体が二つの因子になる。
最初の本文：負の候補も確かめます。括弧と指数に注意しましょう。
条件：["x∈ℝ、x²=16を満たすすべての実数を求める。"]
教える一般則／参照：[]
前提node：["n09-q01-positive"]
前提result：["n09-q01-positive-result"]
#### 穴と全選択肢

- n09-q01-negative::powerAction / KEEP / text / 正答 `repeat-whole-base`
  問い：(-4)²で、指数2が指定している操作を選びます。
  回答前提：[]
  全選択肢・誤答理由：基準同IDの厳密契約参照 66c8007b:n09-q01-negative::powerAction

- n09-q01-negative::value / KEEP / math / 正答 `16`
  問い：負の候補を2回掛けた値を計算します。
  回答前提：["powerAction"]
  全選択肢・誤答理由：基準同IDの厳密契約参照 66c8007b:n09-q01-negative::value

#### 正確な行・解放条件
```json
[
  {
    "kind": "text",
    "template": "2乗の操作は、{powerAction}。",
    "partKeys": [
      "powerAction"
    ],
    "requiresCorrectKeys": [],
    "id": "n09-q01-negative::ux05-row-01"
  },
  {
    "kind": "math",
    "template": "(-4)^2=(-4)\\times(-4)={value}",
    "partKeys": [
      "value"
    ],
    "requiresCorrectKeys": [
      "powerAction"
    ],
    "id": "n09-q01-negative::ux05-row-02",
    "mathGroupId": "n09-q01-negative-ux05-math-02"
  }
]
```
各行はrequiresCorrectKeysが全て順序整合した正答の時のみ表示。part自体もdependsOnKeys全成立時のみ回答可。誤答・未回答・旧RETIRE記録で解放しない。terminalと次nodeは全必須part＋全result前提成立時のみ。
初期lead/条件には具体的な新part正答を先書きしない。givenRulesは一般則または既認定事実。後続完成式と候補別正答解説は当該part正答後のみ。候補として並ぶ式は未認定。
terminal：{"resultId": "n09-q01-negative-result", "formulas": ["(-4)^2=16"], "conditions": ["x∈ℝ、x²=16を満たすすべての実数を求める。"], "requiresCorrectKeys": ["powerAction", "value"], "certifiedFrom": ["n09-q01-positive-result"]}
#### 旧新mapping
```json
[
  {
    "oldPartId": "n09-q01-negative::powerAction",
    "decision": "KEEP",
    "newPartId": "n09-q01-negative::powerAction",
    "recordPolicy": "同ID数学契約が一致する記録のみ保持。新gate成立までは保留。"
  },
  {
    "oldPartId": "n09-q01-negative::productSign",
    "decision": "RETIRE",
    "newPartId": null,
    "recordPolicy": "原記録は出所付きARCHIVE_ONLY。新keyへのalias・正答扱い・新課題の解放は禁止。"
  },
  {
    "oldPartId": "n09-q01-negative::value",
    "decision": "KEEP",
    "newPartId": "n09-q01-negative::value",
    "recordPolicy": "同ID数学契約が一致する記録のみ保持。新gate成立までは保留。"
  }
]
```
新ID：[]

### n09-01 — CHANGE
零条件の式を先に与えてorだけを選ばせる構造を廃止。因数分解と具体的な零条件の組を主判断とする。基本逆演算は途中式に戻す。
完成解法：x²=16 ⇔ x²−16=0 ⇔ x²−4²=0 ⇔ (x−4)(x＋4)=0 ⇔ x−4=0 または x＋4=0 ⇔ x=4 または x=−4。全変形が同値なので全解を尽くす。
最初の本文：候補を確かめるだけでなく、他に解がないことも調べます。
条件：["x∈ℝ。"]
教える一般則／参照：["既習公式：(A-B)(A+B)=A^2-B^2。", "実数の零積の法則：AB=0 ⇔ A=0 または B=0。一方が0なら積は0、どちらも0でなければ積は0にならない。"]
前提node：["n09-q01-negative", "n09-q01-positive"]
前提result：["n09-q01-negative-result", "n09-q01-positive-result"]
#### 穴と全選択肢

- n09-01::factorisedFormUX05 / NEW / math / 正答 `(x-4)(x+4)`
  問い：左辺x²−4²に恒等的に等しい因数分解を選びます。
  回答前提：[]
  思考操作：平方差の構造を因数分解へ適用する。第一因子の写し穴ではない。
  - 正答：`(x-4)(x+4)` / (x-4)(x+4) / 中間項が相殺し、x²−16になります。
  - 誤答：`(x-4)^2` / (x-4)^2 / 展開すると−8xという中間項が残ります。
  - 誤答：`(x+4)^2` / (x+4)^2 / 展開すると＋8xという中間項が残ります。
  - 誤答：`x(x-16)` / x(x-16) / 展開するとx²−16xとなり、定数項−16になりません。

- n09-01::factorZeroConditionUX05 / NEW / text / 正答 `either-factor-zero`
  問い：確定した積が0になる条件を、因子についての式で表した組を選びます。
  回答前提：["factorisedFormUX05"]
  思考操作：AB=0の法則を具体的な二因子へ適用し、必要十分な零条件全体を構成する。
  - 正答：`either-factor-zero` / 第一因子が0、または第二因子が0 / どちらか一方が0なら積は0であり、実数ではこれで全ての場合を尽くします。 / mathLines=["x-4=0", "\\text{または}\\quad x+4=0"]
  - 誤答：`both-factors-zero` / 両因子が同時に0 / 零積は同時に0である必要がありません。一方が0なら積は0です。 / mathLines=["x-4=0", "\\text{かつ}\\quad x+4=0"]
  - 誤答：`equal-factors` / 二つの因子が等しい / 因子が等しいだけでは、その積が0とは限りません。 / mathLines=["x-4=x+4"]
  - 誤答：`variable-zero` / 変数が0 / 積を作っている因子はxそのものではありません。 / mathLines=["x=0"]

#### 正確な行・解放条件
```json
[
  {
    "kind": "math",
    "template": "x^2=16",
    "partKeys": [],
    "requiresCorrectKeys": [],
    "id": "n09-01::ux05-row-01",
    "mathGroupId": "n09-01-ux05-math-01"
  },
  {
    "kind": "math",
    "template": "x^2-16=16-16=0",
    "partKeys": [],
    "requiresCorrectKeys": [],
    "id": "n09-01::ux05-row-02",
    "mathGroupId": "n09-01-ux05-math-02"
  },
  {
    "kind": "math",
    "template": "x^2-4^2=0",
    "partKeys": [],
    "requiresCorrectKeys": [],
    "id": "n09-01::ux05-row-03",
    "mathGroupId": "n09-01-ux05-math-03"
  },
  {
    "kind": "math",
    "template": "{factorisedFormUX05}=0",
    "partKeys": [
      "factorisedFormUX05"
    ],
    "requiresCorrectKeys": [],
    "id": "n09-01::ux05-row-04",
    "mathGroupId": "n09-01-ux05-math-04"
  },
  {
    "kind": "text",
    "template": "因子についての零条件の組：{factorZeroConditionUX05}",
    "partKeys": [
      "factorZeroConditionUX05"
    ],
    "requiresCorrectKeys": [
      "factorisedFormUX05"
    ],
    "hideAfterCorrectKeys": [
      "factorZeroConditionUX05"
    ],
    "id": "n09-01::ux05-row-05"
  },
  {
    "kind": "math",
    "template": "x-4=0",
    "partKeys": [],
    "requiresCorrectKeys": [
      "factorisedFormUX05",
      "factorZeroConditionUX05"
    ],
    "id": "n09-01::ux05-row-06",
    "mathGroupId": "n09-01-ux05-math-06"
  },
  {
    "kind": "math",
    "template": "\\text{または}\\quad x+4=0",
    "partKeys": [],
    "requiresCorrectKeys": [
      "factorisedFormUX05",
      "factorZeroConditionUX05"
    ],
    "id": "n09-01::ux05-row-07",
    "mathGroupId": "n09-01-ux05-math-07"
  },
  {
    "kind": "math",
    "template": "x-4=0\\ \\Rightarrow\\ x=4",
    "partKeys": [],
    "requiresCorrectKeys": [
      "factorisedFormUX05",
      "factorZeroConditionUX05"
    ],
    "id": "n09-01::ux05-row-08",
    "mathGroupId": "n09-01-ux05-math-08"
  },
  {
    "kind": "math",
    "template": "x+4=0\\ \\Rightarrow\\ x=-4",
    "partKeys": [],
    "requiresCorrectKeys": [
      "factorisedFormUX05",
      "factorZeroConditionUX05"
    ],
    "id": "n09-01::ux05-row-09",
    "mathGroupId": "n09-01-ux05-math-09"
  },
  {
    "kind": "text",
    "template": "同値変形で場合を尽くしたため、4と−4が全ての解です。",
    "partKeys": [],
    "requiresCorrectKeys": [
      "factorisedFormUX05",
      "factorZeroConditionUX05"
    ],
    "id": "n09-01::ux05-row-10"
  }
]
```
各行はrequiresCorrectKeysが全て順序整合した正答の時のみ表示。part自体もdependsOnKeys全成立時のみ回答可。誤答・未回答・旧RETIRE記録で解放しない。terminalと次nodeは全必須part＋全result前提成立時のみ。
初期lead/条件には具体的な新part正答を先書きしない。givenRulesは一般則または既認定事実。後続完成式と候補別正答解説は当該part正答後のみ。候補として並ぶ式は未認定。
terminal：{"resultId": "n09-01-result", "formulas": ["x=4\\quad\\text{または}\\quad x=-4"], "conditions": ["x∈ℝ。"], "requiresCorrectKeys": ["factorisedFormUX05", "factorZeroConditionUX05"], "certifiedFrom": ["n09-q01-negative-result", "n09-q01-positive-result"]}
#### 旧新mapping
```json
[
  {
    "oldPartId": "n09-01::balanceOperation",
    "decision": "RETIRE",
    "newPartId": null,
    "recordPolicy": "原記録は出所付きARCHIVE_ONLY。新keyへのalias・正答扱い・新課題の解放は禁止。"
  },
  {
    "oldPartId": "n09-01::factorSign",
    "decision": "RETIRE",
    "newPartId": null,
    "recordPolicy": "原記録は出所付きARCHIVE_ONLY。新keyへのalias・正答扱い・新課題の解放は禁止。"
  },
  {
    "oldPartId": "n09-01::zeroLogic",
    "decision": "RETIRE",
    "newPartId": null,
    "recordPolicy": "原記録は出所付きARCHIVE_ONLY。新keyへのalias・正答扱い・新課題の解放は禁止。"
  },
  {
    "oldPartId": "n09-01::leftInverseOperation",
    "decision": "RETIRE",
    "newPartId": null,
    "recordPolicy": "原記録は出所付きARCHIVE_ONLY。新keyへのalias・正答扱い・新課題の解放は禁止。"
  },
  {
    "oldPartId": "n09-01::rightInverseOperation",
    "decision": "RETIRE",
    "newPartId": null,
    "recordPolicy": "原記録は出所付きARCHIVE_ONLY。新keyへのalias・正答扱い・新課題の解放は禁止。"
  }
]
```
新ID：["n09-01::factorisedFormUX05", "n09-01::factorZeroConditionUX05"]

### n09-definition — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-definition

### n09-q02-root — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-q02-root

### n09-q02-negative-square — CHANGE
1×5と(−1)²の分割をやめ、元の平方の一計算へ統合。旧valueは1×5なので別ID。
完成解法：(−√5)²=(−1)²(√5)²=1×5=5。
最初の本文：平方根の前に負号があるときも、括弧全体の平方を計算します。
条件：["根号は非負の一つの値。√16と(−√5)²を元の順で求める。"]
教える一般則／参照：["(uv)^2=u^2v^2、(√a)^2=a (a≥0)。"]
前提node：["n09-q02-root"]
前提result：["n09-q02-root-result"]
#### 穴と全選択肢

- n09-q02-negative-square::signedRootSquareUX05 / NEW / math / 正答 `5`
  問い：負号を含む括弧全体の平方(−√5)²を求めます。
  回答前提：[]
  思考操作：負の平方根の平方を、指数の作用範囲と平方根の定義で計算する。
  - 正答：`5` / 5 / 括弧内全体を二乗するので負号も二乗され、(√5)²=5です。
  - 誤答：`-5` / -5 / 負号を括弧の外へ残していませんか。
  - 誤答：`25` / 25 / 二乗されるのは5ではなく√5です。
  - 誤答：`\sqrt5` / \sqrt5 / 二乗によって元の根号の大きさをそのまま残すのではありません。

#### 正確な行・解放条件
```json
[
  {
    "kind": "math",
    "template": "(-\\sqrt5)^2={signedRootSquareUX05}",
    "partKeys": [
      "signedRootSquareUX05"
    ],
    "requiresCorrectKeys": [],
    "hideAfterCorrectKeys": [
      "signedRootSquareUX05"
    ],
    "id": "n09-q02-negative-square::ux05-row-01",
    "mathGroupId": "n09-q02-negative-square-ux05-math-01"
  },
  {
    "kind": "math",
    "template": "(-\\sqrt5)^2=(-1)^2(\\sqrt5)^2=1\\times5=5",
    "partKeys": [],
    "requiresCorrectKeys": [
      "signedRootSquareUX05"
    ],
    "id": "n09-q02-negative-square::ux05-row-02",
    "mathGroupId": "n09-q02-negative-square-ux05-math-02"
  }
]
```
各行はrequiresCorrectKeysが全て順序整合した正答の時のみ表示。part自体もdependsOnKeys全成立時のみ回答可。誤答・未回答・旧RETIRE記録で解放しない。terminalと次nodeは全必須part＋全result前提成立時のみ。
初期lead/条件には具体的な新part正答を先書きしない。givenRulesは一般則または既認定事実。後続完成式と候補別正答解説は当該part正答後のみ。候補として並ぶ式は未認定。
terminal：{"resultId": "n09-q02-negative-square-result", "formulas": ["(-\\sqrt5)^2=5"], "conditions": ["根号は非負の一つの値。√16と(−√5)²を元の順で求める。"], "requiresCorrectKeys": ["signedRootSquareUX05"], "certifiedFrom": ["n09-q02-root-result"]}
#### 旧新mapping
```json
[
  {
    "oldPartId": "n09-q02-negative-square::signFactor",
    "decision": "RETIRE",
    "newPartId": null,
    "recordPolicy": "原記録は出所付きARCHIVE_ONLY。新keyへのalias・正答扱い・新課題の解放は禁止。"
  },
  {
    "oldPartId": "n09-q02-negative-square::value",
    "decision": "RETIRE",
    "newPartId": null,
    "recordPolicy": "原記録は出所付きARCHIVE_ONLY。新keyへのalias・正答扱い・新課題の解放は禁止。"
  }
]
```
新ID：["n09-q02-negative-square::signedRootSquareUX05"]

### n09-02 — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-02

### n09-boundary — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-boundary

### n09-q03-inside — CHANGE
初出平方の再入力を参照へ変更し、次nodeの非負の平方根選択は保護する。
完成解法：既に確定した(−4)²=16を使う。√((−4)²)=√16、非負の平方根は次nodeで選ぶ。
最初の本文：確定済みの平方を使い、平方根を調べます。
条件：["実数の範囲で√((−4)²)を求める。根号の中と値は非負。"]
教える一般則／参照：[]
前提node：["n09-boundary", "n09-q01-negative"]
前提result：["n09-boundary-result", "n09-q01-negative-result"]
#### 穴と全選択肢

#### 正確な行・解放条件
```json
[
  {
    "kind": "math",
    "template": "(-4)^2=16",
    "partKeys": [],
    "requiresCorrectKeys": [],
    "id": "n09-q03-inside::ux05-row-01",
    "mathGroupId": "n09-q03-inside-ux05-math-01"
  },
  {
    "kind": "math",
    "template": "\\sqrt{(-4)^2}=\\sqrt{16}",
    "partKeys": [],
    "requiresCorrectKeys": [],
    "id": "n09-q03-inside::ux05-row-02",
    "mathGroupId": "n09-q03-inside-ux05-math-02"
  }
]
```
各行はrequiresCorrectKeysが全て順序整合した正答の時のみ表示。part自体もdependsOnKeys全成立時のみ回答可。誤答・未回答・旧RETIRE記録で解放しない。terminalと次nodeは全必須part＋全result前提成立時のみ。
初期lead/条件には具体的な新part正答を先書きしない。givenRulesは一般則または既認定事実。後続完成式と候補別正答解説は当該part正答後のみ。候補として並ぶ式は未認定。
terminal：{"resultId": "n09-q03-inside-result", "formulas": ["(-4)^2=16"], "conditions": ["実数の範囲で√((−4)²)を求める。根号の中と値は非負。"], "requiresCorrectKeys": [], "certifiedFrom": ["n09-boundary-result", "n09-q01-negative-result"]}
#### 旧新mapping
```json
[
  {
    "oldPartId": "n09-q03-inside::value",
    "decision": "RETIRE",
    "newPartId": null,
    "recordPolicy": "原記録は出所付きARCHIVE_ONLY。新keyへのalias・正答扱い・新課題の解放は禁止。"
  }
]
```
新ID：[]

### n09-03 — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-03

### n09-q04-nonnegative — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-q04-nonnegative

### n09-q04-negative — CHANGE
−aの符号を独立小問にせず、非負の平方根を選ぶ本来の判断と根拠を保持。
完成解法：a<0なので−a>0、(−a)²=a²。よって√a²=−a。
最初の本文：aが負の場合、a²の非負の平方根を選びます。
条件：["a∈ℝ、a<0。"]
教える一般則／参照：["平方根記号√は非負の平方根を表す。"]
前提node：["n09-q04-nonnegative"]
前提result：["n09-q04-nonnegative-result"]
#### 穴と全選択肢

- n09-q04-negative::value / KEEP / math / 正答 `-a`
  問い：負のaの平方について、非負の方を選びます。
  回答前提：[]
  全選択肢・誤答理由：基準同IDの厳密契約参照 66c8007b:n09-q04-negative::value

#### 正確な行・解放条件
```json
[
  {
    "kind": "math",
    "template": "\\sqrt{a^2}={value}",
    "partKeys": [
      "value"
    ],
    "requiresCorrectKeys": [],
    "hideAfterCorrectKeys": [
      "value"
    ],
    "id": "n09-q04-negative::ux05-row-01",
    "mathGroupId": "n09-q04-negative-ux05-math-01"
  },
  {
    "kind": "math",
    "template": "a<0\\ \\Rightarrow\\ -a>0",
    "partKeys": [],
    "requiresCorrectKeys": [
      "value"
    ],
    "id": "n09-q04-negative::ux05-row-02",
    "mathGroupId": "n09-q04-negative-ux05-math-02"
  },
  {
    "kind": "math",
    "template": "(-a)^2=a^2",
    "partKeys": [],
    "requiresCorrectKeys": [
      "value"
    ],
    "id": "n09-q04-negative::ux05-row-03",
    "mathGroupId": "n09-q04-negative-ux05-math-03"
  },
  {
    "kind": "math",
    "template": "\\sqrt{a^2}=-a",
    "partKeys": [],
    "requiresCorrectKeys": [
      "value"
    ],
    "id": "n09-q04-negative::ux05-row-04",
    "mathGroupId": "n09-q04-negative-ux05-math-04"
  }
]
```
各行はrequiresCorrectKeysが全て順序整合した正答の時のみ表示。part自体もdependsOnKeys全成立時のみ回答可。誤答・未回答・旧RETIRE記録で解放しない。terminalと次nodeは全必須part＋全result前提成立時のみ。
初期lead/条件には具体的な新part正答を先書きしない。givenRulesは一般則または既認定事実。後続完成式と候補別正答解説は当該part正答後のみ。候補として並ぶ式は未認定。
terminal：{"resultId": "n09-q04-negative-result", "formulas": ["\\sqrt{a^2}=-a\\quad(a<0)"], "conditions": ["a∈ℝ、a<0。"], "requiresCorrectKeys": ["value"], "certifiedFrom": ["n09-q04-nonnegative-result"]}
#### 旧新mapping
```json
[
  {
    "oldPartId": "n09-q04-negative::oppositeSign",
    "decision": "RETIRE",
    "newPartId": null,
    "recordPolicy": "原記録は出所付きARCHIVE_ONLY。新keyへのalias・正答扱い・新課題の解放は禁止。"
  },
  {
    "oldPartId": "n09-q04-negative::value",
    "decision": "KEEP",
    "newPartId": "n09-q04-negative::value",
    "recordPolicy": "同ID数学契約が一致する記録のみ保持。新gate成立までは保留。"
  }
]
```
新ID：[]

### n09-04 — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-04

### n09-05 — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-05

### n09-q06-squares — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-q06-squares

### n09-q06-order — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-q06-order

### n09-06 — CHANGE
加える数の写しと0の入力を、必要な差の符号判断へ置換。
完成解法：2<√5の両辺から√5を引くと2−√5<√5−√5=0。
最初の本文：確定済みの比較を使い、差の符号を決めます。
条件：["同じ実数を両辺へ加えても不等号の向きは変わらない。"]
教える一般則／参照：[]
前提node：["n09-05", "n09-q06-order"]
前提result：["n09-05-result", "n09-q06-order-result"]
#### 穴と全選択肢

- n09-06::differenceRelationUX05 / NEW / math / 正答 `<`
  問い：確定済みの2と√5の大小から、差2−√5と0の大小を決めます。
  回答前提：[]
  思考操作：大小関係から差の符号を判断し絶対値の場合分けに使う。
  - 正答：`<` / < / 小さい数から大きい数を引くので差は負です。
  - 誤答：`>` / > / 2と√5のどちらが大きいか、確定済みの比較へ戻ってください。
  - 誤答：`=` / = / 二つの数は等しくありません。

#### 正確な行・解放条件
```json
[
  {
    "kind": "math",
    "template": "2-\\sqrt5\\ {differenceRelationUX05}\\ 0",
    "partKeys": [
      "differenceRelationUX05"
    ],
    "requiresCorrectKeys": [],
    "hideAfterCorrectKeys": [
      "differenceRelationUX05"
    ],
    "id": "n09-06::ux05-row-01",
    "mathGroupId": "n09-06-ux05-math-01"
  },
  {
    "kind": "math",
    "template": "2-\\sqrt5<\\sqrt5-\\sqrt5=0",
    "partKeys": [],
    "requiresCorrectKeys": [
      "differenceRelationUX05"
    ],
    "id": "n09-06::ux05-row-02",
    "mathGroupId": "n09-06-ux05-math-02"
  }
]
```
各行はrequiresCorrectKeysが全て順序整合した正答の時のみ表示。part自体もdependsOnKeys全成立時のみ回答可。誤答・未回答・旧RETIRE記録で解放しない。terminalと次nodeは全必須part＋全result前提成立時のみ。
初期lead/条件には具体的な新part正答を先書きしない。givenRulesは一般則または既認定事実。後続完成式と候補別正答解説は当該part正答後のみ。候補として並ぶ式は未認定。
terminal：{"resultId": "n09-06-result", "formulas": ["2-\\sqrt5<0"], "conditions": ["同じ実数を両辺へ加えても不等号の向きは変わらない。"], "requiresCorrectKeys": ["differenceRelationUX05"], "certifiedFrom": ["n09-05-result", "n09-q06-order-result"]}
#### 旧新mapping
```json
[
  {
    "oldPartId": "n09-06::addend",
    "decision": "RETIRE",
    "newPartId": null,
    "recordPolicy": "原記録は出所付きARCHIVE_ONLY。新keyへのalias・正答扱い・新課題の解放は禁止。"
  },
  {
    "oldPartId": "n09-06::zero",
    "decision": "RETIRE",
    "newPartId": null,
    "recordPolicy": "原記録は出所付きARCHIVE_ONLY。新keyへのalias・正答扱い・新課題の解放は禁止。"
  }
]
```
新ID：["n09-06::differenceRelationUX05"]

### n09-q07-negation — CHANGE
印刷された式のscope写しを、絶対値の定義の具体適用へ置換。
完成解法：√((2−√5)²)=|2−√5|。中身が負なので|2−√5|=−(2−√5)。
最初の本文：平方の平方根を絶対値へ直し、中身の符号に応じて外します。
条件：["2−√5<0。u<0なら|u|=−u。"]
教える一般則／参照：["|u|はu≥0ならu、u<0なら−u。"]
前提node：["n09-05", "n09-06"]
前提result：["n09-05-result", "n09-06-result"]
#### 穴と全選択肢

- n09-q07-negation::absoluteExpressionUX05 / NEW / math / 正答 `-(2-\sqrt5)`
  問い：2−√5<0を使い、絶対値を外します。まだ外側の負号は分配せず、括弧を残した形を選びます。
  回答前提：[]
  思考操作：負と確定した二項式全体へ絶対値の定義を適用する。
  - 正答：`-(2-\sqrt5)` / -(2-\sqrt5) / 負の中身は、全体の符号を反転すると非負になります。
  - 誤答：`2-\sqrt5` / 2-\sqrt5 / 確定済みの中身は負なので、そのままでは絶対値になりません。
  - 誤答：`-2-\sqrt5` / -2-\sqrt5 / 中身全体の符号を反転する必要があります。
  - 誤答：`2+\sqrt5` / 2+\sqrt5 / 二項の和を作る操作ではありません。

#### 正確な行・解放条件
```json
[
  {
    "kind": "math",
    "template": "\\sqrt{(2-\\sqrt5)^2}=|2-\\sqrt5|",
    "partKeys": [],
    "requiresCorrectKeys": [],
    "id": "n09-q07-negation::ux05-row-01",
    "mathGroupId": "n09-q07-negation-ux05-math-01"
  },
  {
    "kind": "math",
    "template": "|2-\\sqrt5|={absoluteExpressionUX05}",
    "partKeys": [
      "absoluteExpressionUX05"
    ],
    "requiresCorrectKeys": [],
    "id": "n09-q07-negation::ux05-row-02",
    "mathGroupId": "n09-q07-negation-ux05-math-02"
  }
]
```
各行はrequiresCorrectKeysが全て順序整合した正答の時のみ表示。part自体もdependsOnKeys全成立時のみ回答可。誤答・未回答・旧RETIRE記録で解放しない。terminalと次nodeは全必須part＋全result前提成立時のみ。
初期lead/条件には具体的な新part正答を先書きしない。givenRulesは一般則または既認定事実。後続完成式と候補別正答解説は当該part正答後のみ。候補として並ぶ式は未認定。
terminal：{"resultId": "n09-q07-negation-result", "formulas": ["|2-\\sqrt5|=-(2-\\sqrt5)"], "conditions": ["2−√5<0。u<0なら|u|=−u。"], "requiresCorrectKeys": ["absoluteExpressionUX05"], "certifiedFrom": ["n09-05-result", "n09-06-result"]}
#### 旧新mapping
```json
[
  {
    "oldPartId": "n09-q07-negation::scope",
    "decision": "RETIRE",
    "newPartId": null,
    "recordPolicy": "原記録は出所付きARCHIVE_ONLY。新keyへのalias・正答扱い・新課題の解放は禁止。"
  }
]
```
新ID：["n09-q07-negation::absoluteExpressionUX05"]

### n09-07 — CHANGE
−1・加数・個々の符号の小問を、負号を分配した式全体の計算へ統合。
完成解法：−(2−√5)=−2＋√5=√5−2。従って√((2−√5)²)=√5−2。
最初の本文：確定した式を整理して、平方の平方根の値を仕上げます。
条件：["2−√5<0。√(u²)=|u|、u<0なら|u|=−u。"]
教える一般則／参照：[]
前提node：["n09-05", "n09-q07-negation", "n09-06"]
前提result：["n09-05-result", "n09-q07-negation-result", "n09-06-result"]
#### 穴と全選択肢

- n09-07::expandedExpressionUX05 / NEW / math / 正答 `\sqrt5-2`
  問い：確定した−(2−√5)の括弧を外して整理します。根号を含む項が先の形を選びます。
  回答前提：[]
  思考操作：二項式全体への負号の分配を一つの式として実行する。
  - 正答：`\sqrt5-2` / \sqrt5-2 / 二項とも符号が反転し、−2＋√5=√5−2です。
  - 誤答：`2-\sqrt5` / 2-\sqrt5 / 外側の負号を作用させていません。
  - 誤答：`-2-\sqrt5` / -2-\sqrt5 / 第二項の負号も反転させてください。
  - 誤答：`2+\sqrt5` / 2+\sqrt5 / 第一項2の符号も反転します。

#### 正確な行・解放条件
```json
[
  {
    "kind": "math",
    "template": "-(2-\\sqrt5)={expandedExpressionUX05}",
    "partKeys": [
      "expandedExpressionUX05"
    ],
    "requiresCorrectKeys": [],
    "hideAfterCorrectKeys": [
      "expandedExpressionUX05"
    ],
    "id": "n09-07::ux05-row-01",
    "mathGroupId": "n09-07-ux05-math-01"
  },
  {
    "kind": "math",
    "template": "-(2-\\sqrt5)=-2+\\sqrt5=\\sqrt5-2",
    "partKeys": [],
    "requiresCorrectKeys": [
      "expandedExpressionUX05"
    ],
    "id": "n09-07::ux05-row-02",
    "mathGroupId": "n09-07-ux05-math-02"
  }
]
```
各行はrequiresCorrectKeysが全て順序整合した正答の時のみ表示。part自体もdependsOnKeys全成立時のみ回答可。誤答・未回答・旧RETIRE記録で解放しない。terminalと次nodeは全必須part＋全result前提成立時のみ。
初期lead/条件には具体的な新part正答を先書きしない。givenRulesは一般則または既認定事実。後続完成式と候補別正答解説は当該part正答後のみ。候補として並ぶ式は未認定。
terminal：{"resultId": "n09-07-result", "formulas": ["\\sqrt{(2-\\sqrt5)^2}=\\sqrt5-2"], "conditions": ["2−√5<0。√(u²)=|u|、u<0なら|u|=−u。"], "requiresCorrectKeys": ["expandedExpressionUX05"], "certifiedFrom": ["n09-05-result", "n09-q07-negation-result", "n09-06-result"]}
#### 旧新mapping
```json
[
  {
    "oldPartId": "n09-07::outsideFactor",
    "decision": "RETIRE",
    "newPartId": null,
    "recordPolicy": "原記録は出所付きARCHIVE_ONLY。新keyへのalias・正答扱い・新課題の解放は禁止。"
  },
  {
    "oldPartId": "n09-07::secondOperand",
    "decision": "RETIRE",
    "newPartId": null,
    "recordPolicy": "原記録は出所付きARCHIVE_ONLY。新keyへのalias・正答扱い・新課題の解放は禁止。"
  },
  {
    "oldPartId": "n09-07::left",
    "decision": "RETIRE",
    "newPartId": null,
    "recordPolicy": "原記録は出所付きARCHIVE_ONLY。新keyへのalias・正答扱い・新課題の解放は禁止。"
  },
  {
    "oldPartId": "n09-07::sign",
    "decision": "RETIRE",
    "newPartId": null,
    "recordPolicy": "原記録は出所付きARCHIVE_ONLY。新keyへのalias・正答扱い・新課題の解放は禁止。"
  }
]
```
新ID：["n09-07::expandedExpressionUX05"]

### n09-decimal-method — CHANGE
後続の中項構成を未知の公式名当てにしない参照説明を補足。数値の計算は後続で保持。
完成解法：1.41=141/100、1.42=142/100。平方の分子を140＋1または140＋2として、和の平方の公式を適用する。
最初の本文：分数に直し、分子の平方を計算する方法を使います。
条件：["1.41=141/100、1.42=142/100。平方の公式(A+B)²=A²+2AB+B²を使う。"]
教える一般則／参照：["(A+B)^2=A^2+AB+BA+B^2=A^2+2AB+B^2。中項は異なる項どうしの積が二つ分。", "(p/q)^2=p^2/q^2 (q≠0)。"]
前提node：["n09-07"]
前提result：["n09-07-result"]
#### 穴と全選択肢

#### 正確な行・解放条件
```json
[
  {
    "kind": "math",
    "template": "1.41=\\frac{141}{100},\\quad1.42=\\frac{142}{100}",
    "partKeys": [],
    "requiresCorrectKeys": [],
    "id": "n09-decimal-method::ux05-row-01",
    "mathGroupId": "n09-decimal-method-ux05-math-01"
  },
  {
    "kind": "math",
    "template": "140^2=14^2\\times100=196\\times100=19600",
    "partKeys": [],
    "requiresCorrectKeys": [],
    "id": "n09-decimal-method::ux05-row-02",
    "mathGroupId": "n09-decimal-method-ux05-math-02"
  },
  {
    "kind": "math",
    "template": "1^2=1,\\quad2^2=4,\\quad100^2=10000",
    "partKeys": [],
    "requiresCorrectKeys": [],
    "id": "n09-decimal-method::ux05-row-03",
    "mathGroupId": "n09-decimal-method-ux05-math-03"
  }
]
```
各行はrequiresCorrectKeysが全て順序整合した正答の時のみ表示。part自体もdependsOnKeys全成立時のみ回答可。誤答・未回答・旧RETIRE記録で解放しない。terminalと次nodeは全必須part＋全result前提成立時のみ。
初期lead/条件には具体的な新part正答を先書きしない。givenRulesは一般則または既認定事実。後続完成式と候補別正答解説は当該part正答後のみ。候補として並ぶ式は未認定。
terminal：{"resultId": "n09-decimal-method-result", "formulas": ["1.41=\\frac{141}{100},\\quad1.42=\\frac{142}{100}", "140^2=19600,\\quad100^2=10000"], "conditions": ["1.41=141/100、1.42=142/100。平方の公式(A+B)²=A²+2AB+B²を使う。"], "requiresCorrectKeys": [], "certifiedFrom": ["n09-07-result"]}
#### 旧新mapping
```json
[]
```
新ID：[]

### n09-p001-q08-left-square — CHANGE
MASTER§53の既存計算3件を厳密保持。公式の具体適用である中項の構成を計算の直前へ置く。
完成解法：1.41²=(141/100)²。(140＋1)²=19600＋280＋1=19881。分母10000で割ると1.9881。
最初の本文：直前の参照公式を、この分子の二項へ適用します。
条件：["候補1.41と1.42は正。√2を挟むため両候補の平方を2と比べる。"]
教える一般則／参照：[]
前提node：["n09-decimal-method"]
前提result：["n09-decimal-method-result"]
#### 穴と全選択肢

- n09-p001-q08-left-square::middleTermUX05 / NEW / math / 正答 `2\times140\times1`
  問い：(140＋1)²を和の平方の公式で展開します。中項を作る因子の組を選びます。
  回答前提：[]
  思考操作：和の平方の中項を二つの項から具体的に構成する。既存の積・和・小数化は別に保持する。
  - 正答：`2\times140\times1` / 2\times140\times1 / 異なる二項の積が二つ分なので2×140×1です。
  - 誤答：`140\times1` / 140\times1 / 交差する積は二つあります。一つ分だけではありません。
  - 誤答：`2\times140^2` / 2\times140^2 / 二項のうち一方を二乗するのではなく、異なる二項を掛けます。
  - 誤答：`140+1` / 140+1 / 中項は元の二項の和ではありません。

- n09-p001-q08-left-square::L1 / KEEP / math / 正答 `280`
  問い：中項2×140×1を計算します。
  回答前提：["middleTermUX05"]
  全選択肢・誤答理由：基準同IDの厳密契約参照 66c8007b:n09-p001-q08-left-square::L1

- n09-p001-q08-left-square::L2 / KEEP / math / 正答 `19881`
  問い：三つの項を合計します。
  回答前提：["middleTermUX05", "L1"]
  全選択肢・誤答理由：基準同IDの厳密契約参照 66c8007b:n09-p001-q08-left-square::L2

- n09-p001-q08-left-square::L3 / KEEP / math / 正答 `1.9881`
  問い：整数の平方を10000で割って小数に戻します。
  回答前提：["middleTermUX05", "L1", "L2"]
  全選択肢・誤答理由：基準同IDの厳密契約参照 66c8007b:n09-p001-q08-left-square::L3

#### 正確な行・解放条件
```json
[
  {
    "kind": "math",
    "template": "1.41^2=\\left(\\frac{141}{100}\\right)^2",
    "partKeys": [],
    "requiresCorrectKeys": [],
    "id": "n09-p001-q08-left-square::ux05-row-01",
    "mathGroupId": "n09-p001-q08-left-square-ux05-math-01"
  },
  {
    "kind": "math",
    "template": "(140+1)^2=140^2+{middleTermUX05}+1^2",
    "partKeys": [
      "middleTermUX05"
    ],
    "requiresCorrectKeys": [],
    "id": "n09-p001-q08-left-square::ux05-row-02",
    "mathGroupId": "n09-p001-q08-left-square-ux05-math-02"
  },
  {
    "kind": "math",
    "template": "=19600+{L1}+1",
    "partKeys": [
      "L1"
    ],
    "requiresCorrectKeys": [
      "middleTermUX05"
    ],
    "id": "n09-p001-q08-left-square::ux05-row-03",
    "mathGroupId": "n09-p001-q08-left-square-ux05-math-02"
  },
  {
    "kind": "math",
    "template": "=19600+{mirror:L1}+1={L2}",
    "partKeys": [
      "L2"
    ],
    "requiresCorrectKeys": [
      "middleTermUX05",
      "L1"
    ],
    "id": "n09-p001-q08-left-square::ux05-row-04",
    "mathGroupId": "n09-p001-q08-left-square-ux05-math-02"
  },
  {
    "kind": "math",
    "template": "1.41^2=\\frac{{mirror:L2}}{10000}={L3}",
    "partKeys": [
      "L3"
    ],
    "requiresCorrectKeys": [
      "middleTermUX05",
      "L1",
      "L2"
    ],
    "id": "n09-p001-q08-left-square::ux05-row-05",
    "mathGroupId": "n09-p001-q08-left-square-ux05-math-05"
  }
]
```
各行はrequiresCorrectKeysが全て順序整合した正答の時のみ表示。part自体もdependsOnKeys全成立時のみ回答可。誤答・未回答・旧RETIRE記録で解放しない。terminalと次nodeは全必須part＋全result前提成立時のみ。
初期lead/条件には具体的な新part正答を先書きしない。givenRulesは一般則または既認定事実。後続完成式と候補別正答解説は当該part正答後のみ。候補として並ぶ式は未認定。
terminal：{"resultId": "n09-p001-q08-left-square-result", "formulas": ["141^2=19881", "1.41^2=1.9881"], "conditions": ["候補1.41と1.42は正。√2を挟むため両候補の平方を2と比べる。"], "requiresCorrectKeys": ["middleTermUX05", "L1", "L2", "L3"], "certifiedFrom": ["n09-decimal-method-result"]}
#### 旧新mapping
```json
[
  {
    "oldPartId": "n09-p001-q08-left-square::L1",
    "decision": "KEEP",
    "newPartId": "n09-p001-q08-left-square::L1",
    "recordPolicy": "同ID数学契約が一致する記録のみ保持。新gate成立までは保留。"
  },
  {
    "oldPartId": "n09-p001-q08-left-square::L2",
    "decision": "KEEP",
    "newPartId": "n09-p001-q08-left-square::L2",
    "recordPolicy": "同ID数学契約が一致する記録のみ保持。新gate成立までは保留。"
  },
  {
    "oldPartId": "n09-p001-q08-left-square::L3",
    "decision": "KEEP",
    "newPartId": "n09-p001-q08-left-square::L3",
    "recordPolicy": "同ID数学契約が一致する記録のみ保持。新gate成立までは保留。"
  }
]
```
新ID：["n09-p001-q08-left-square::middleTermUX05"]

### n09-p001-q08-right-square — CHANGE
MASTER§53の既存計算3件を厳密保持。公式の具体適用である中項の構成を計算の直前へ置く。
完成解法：1.42²=(142/100)²。(140＋2)²=19600＋560＋4=20164。分母10000で割ると2.0164。
最初の本文：直前の参照公式を、この分子の二項へ適用します。
条件：["候補1.41と1.42は正。√2を挟むため両候補の平方を2と比べる。"]
教える一般則／参照：[]
前提node：["n09-p001-q08-left-square"]
前提result：["n09-p001-q08-left-square-result"]
#### 穴と全選択肢

- n09-p001-q08-right-square::middleTermUX05 / NEW / math / 正答 `2\times140\times2`
  問い：(140＋2)²を和の平方の公式で展開します。中項を作る因子の組を選びます。
  回答前提：[]
  思考操作：和の平方の中項を二つの項から具体的に構成する。既存の積・和・小数化は別に保持する。
  - 正答：`2\times140\times2` / 2\times140\times2 / 異なる二項の積が二つ分なので2×140×2です。
  - 誤答：`140\times2` / 140\times2 / 交差する積は二つあります。一つ分だけではありません。
  - 誤答：`2\times140^2` / 2\times140^2 / 二項のうち一方を二乗するのではなく、異なる二項を掛けます。
  - 誤答：`140+2` / 140+2 / 中項は元の二項の和ではありません。

- n09-p001-q08-right-square::R1 / KEEP / math / 正答 `560`
  問い：中項2×140×2を計算します。
  回答前提：["middleTermUX05"]
  全選択肢・誤答理由：基準同IDの厳密契約参照 66c8007b:n09-p001-q08-right-square::R1

- n09-p001-q08-right-square::R2 / KEEP / math / 正答 `20164`
  問い：三つの項を合計します。
  回答前提：["middleTermUX05", "R1"]
  全選択肢・誤答理由：基準同IDの厳密契約参照 66c8007b:n09-p001-q08-right-square::R2

- n09-p001-q08-right-square::R3 / KEEP / math / 正答 `2.0164`
  問い：整数の平方を小数に戻します。
  回答前提：["middleTermUX05", "R1", "R2"]
  全選択肢・誤答理由：基準同IDの厳密契約参照 66c8007b:n09-p001-q08-right-square::R3

#### 正確な行・解放条件
```json
[
  {
    "kind": "math",
    "template": "1.42^2=\\left(\\frac{142}{100}\\right)^2",
    "partKeys": [],
    "requiresCorrectKeys": [],
    "id": "n09-p001-q08-right-square::ux05-row-01",
    "mathGroupId": "n09-p001-q08-right-square-ux05-math-01"
  },
  {
    "kind": "math",
    "template": "(140+2)^2=140^2+{middleTermUX05}+2^2",
    "partKeys": [
      "middleTermUX05"
    ],
    "requiresCorrectKeys": [],
    "id": "n09-p001-q08-right-square::ux05-row-02",
    "mathGroupId": "n09-p001-q08-right-square-ux05-math-02"
  },
  {
    "kind": "math",
    "template": "=19600+{R1}+4",
    "partKeys": [
      "R1"
    ],
    "requiresCorrectKeys": [
      "middleTermUX05"
    ],
    "id": "n09-p001-q08-right-square::ux05-row-03",
    "mathGroupId": "n09-p001-q08-right-square-ux05-math-02"
  },
  {
    "kind": "math",
    "template": "=19600+{mirror:R1}+4={R2}",
    "partKeys": [
      "R2"
    ],
    "requiresCorrectKeys": [
      "middleTermUX05",
      "R1"
    ],
    "id": "n09-p001-q08-right-square::ux05-row-04",
    "mathGroupId": "n09-p001-q08-right-square-ux05-math-02"
  },
  {
    "kind": "math",
    "template": "1.42^2=\\frac{{mirror:R2}}{10000}={R3}",
    "partKeys": [
      "R3"
    ],
    "requiresCorrectKeys": [
      "middleTermUX05",
      "R1",
      "R2"
    ],
    "id": "n09-p001-q08-right-square::ux05-row-05",
    "mathGroupId": "n09-p001-q08-right-square-ux05-math-05"
  }
]
```
各行はrequiresCorrectKeysが全て順序整合した正答の時のみ表示。part自体もdependsOnKeys全成立時のみ回答可。誤答・未回答・旧RETIRE記録で解放しない。terminalと次nodeは全必須part＋全result前提成立時のみ。
初期lead/条件には具体的な新part正答を先書きしない。givenRulesは一般則または既認定事実。後続完成式と候補別正答解説は当該part正答後のみ。候補として並ぶ式は未認定。
terminal：{"resultId": "n09-p001-q08-right-square-result", "formulas": ["142^2=20164", "1.42^2=2.0164"], "conditions": ["候補1.41と1.42は正。√2を挟むため両候補の平方を2と比べる。"], "requiresCorrectKeys": ["middleTermUX05", "R1", "R2", "R3"], "certifiedFrom": ["n09-p001-q08-left-square-result"]}
#### 旧新mapping
```json
[
  {
    "oldPartId": "n09-p001-q08-right-square::R1",
    "decision": "KEEP",
    "newPartId": "n09-p001-q08-right-square::R1",
    "recordPolicy": "同ID数学契約が一致する記録のみ保持。新gate成立までは保留。"
  },
  {
    "oldPartId": "n09-p001-q08-right-square::R2",
    "decision": "KEEP",
    "newPartId": "n09-p001-q08-right-square::R2",
    "recordPolicy": "同ID数学契約が一致する記録のみ保持。新gate成立までは保留。"
  },
  {
    "oldPartId": "n09-p001-q08-right-square::R3",
    "decision": "KEEP",
    "newPartId": "n09-p001-q08-right-square::R3",
    "recordPolicy": "同ID数学契約が一致する記録のみ保持。新gate成立までは保留。"
  }
]
```
新ID：["n09-p001-q08-right-square::middleTermUX05"]

### n09-p001-q08-lower-sign — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-p001-q08-lower-sign

### n09-p001-q08-upper-sign — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-p001-q08-upper-sign

### n09-08 — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-08

### n09-09 — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-09

### n09-parts-target — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-parts-target

### n09-q10-reject-truncation — CHANGE
元の剰余計算を残し、定義により候補を棄却する判断を本人が行う。
完成解法：n=−2ならr=−2.1−(−2)=−2.1＋2=−0.1。0≤r<1に反するのでn=−2は採用できない。
最初の本文：−2.1の整数部分を−2と仮定した候補を検査します。
条件：["残りは0≤r<1でなければならない。"]
教える一般則／参照：["x=n+r、nは整数、0≤r<1。"]
前提node：["n09-parts-target"]
前提result：["n09-parts-target-result"]
#### 穴と全選択肢

- n09-q10-reject-truncation::value / KEEP / math / 正答 `-0.1`
  問い：候補n=−2の残りを計算します。
  回答前提：[]
  全選択肢・誤答理由：基準同IDの厳密契約参照 66c8007b:n09-q10-reject-truncation::value

- n09-q10-reject-truncation::candidateValidityUX05 / NEW / text / 正答 `reject-range`
  問い：n=−2とした候補を、rの条件に照らしてどう判断しますか。
  回答前提：["value"]
  思考操作：候補を整数部分・小数部分の定義に照らして棄却する。
  - 正答：`reject-range` / rが許される範囲にないため不採用 / r=−0.1は0≤r<1を満たしません。
  - 誤答：`accept-integer` / nが整数なので採用 / nが整数であることに加えて、rの範囲も必要です。
  - 誤答：`accept-truncation` / 小数を切り捨てた形なので採用 / 見た目ではなく、定義の条件を満たすかを確認します。
  - 誤答：`reject-negative-integer` / nが負なので不採用 / 整数部分は負でも構いません。条件はrの範囲です。

#### 正確な行・解放条件
```json
[
  {
    "kind": "math",
    "template": "-2.1-(-2)=-2.1+2={value}",
    "partKeys": [
      "value"
    ],
    "requiresCorrectKeys": [],
    "id": "n09-q10-reject-truncation::ux05-row-01",
    "mathGroupId": "n09-q10-reject-truncation-ux05-math-01"
  },
  {
    "kind": "text",
    "template": "候補の判断：{candidateValidityUX05}",
    "partKeys": [
      "candidateValidityUX05"
    ],
    "requiresCorrectKeys": [
      "value"
    ],
    "id": "n09-q10-reject-truncation::ux05-row-02"
  }
]
```
各行はrequiresCorrectKeysが全て順序整合した正答の時のみ表示。part自体もdependsOnKeys全成立時のみ回答可。誤答・未回答・旧RETIRE記録で解放しない。terminalと次nodeは全必須part＋全result前提成立時のみ。
初期lead/条件には具体的な新part正答を先書きしない。givenRulesは一般則または既認定事実。後続完成式と候補別正答解説は当該part正答後のみ。候補として並ぶ式は未認定。
terminal：{"resultId": "n09-q10-reject-truncation-result", "formulas": ["-2.1-(-2)=-0.1<0"], "conditions": ["残りは0≤r<1でなければならない。"], "requiresCorrectKeys": ["value", "candidateValidityUX05"], "certifiedFrom": ["n09-parts-target-result"]}
#### 旧新mapping
```json
[
  {
    "oldPartId": "n09-q10-reject-truncation::value",
    "decision": "KEEP",
    "newPartId": "n09-q10-reject-truncation::value",
    "recordPolicy": "同ID数学契約が一致する記録のみ保持。新gate成立までは保留。"
  }
]
```
新ID：["n09-q10-reject-truncation::candidateValidityUX05"]

### n09-10 — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-10

### n09-q11-remainder — CHANGE
負数を引く演算子だけの小問を外し、既存の初出剰余計算は維持。
完成解法：r=−2.1−(−3)=−2.1＋3=0.9。
最初の本文：確定した整数部分n=−3を使い、rを計算します。
条件：["x=−2.1、n=−3、r=x−n、0≤r<1。"]
教える一般則／参照：[]
前提node：["n09-parts-target", "n09-10"]
前提result：["n09-parts-target-result", "n09-10-result"]
#### 穴と全選択肢

- n09-q11-remainder::value / KEEP / math / 正答 `0.9`
  問い：残りの値を計算します。
  回答前提：[]
  全選択肢・誤答理由：基準同IDの厳密契約参照 66c8007b:n09-q11-remainder::value

#### 正確な行・解放条件
```json
[
  {
    "kind": "math",
    "template": "r=-2.1-(-3)=-2.1+3={value}",
    "partKeys": [
      "value"
    ],
    "requiresCorrectKeys": [],
    "id": "n09-q11-remainder::ux05-row-01",
    "mathGroupId": "n09-q11-remainder-ux05-math-01"
  }
]
```
各行はrequiresCorrectKeysが全て順序整合した正答の時のみ表示。part自体もdependsOnKeys全成立時のみ回答可。誤答・未回答・旧RETIRE記録で解放しない。terminalと次nodeは全必須part＋全result前提成立時のみ。
初期lead/条件には具体的な新part正答を先書きしない。givenRulesは一般則または既認定事実。後続完成式と候補別正答解説は当該part正答後のみ。候補として並ぶ式は未認定。
terminal：{"resultId": "n09-q11-remainder-result", "formulas": ["r=0.9", "0\\le0.9<1"], "conditions": ["x=−2.1、n=−3、r=x−n、0≤r<1。"], "requiresCorrectKeys": ["value"], "certifiedFrom": ["n09-parts-target-result", "n09-10-result"]}
#### 旧新mapping
```json
[
  {
    "oldPartId": "n09-q11-remainder::sign",
    "decision": "RETIRE",
    "newPartId": null,
    "recordPolicy": "原記録は出所付きARCHIVE_ONLY。新keyへのalias・正答扱い・新課題の解放は禁止。"
  },
  {
    "oldPartId": "n09-q11-remainder::value",
    "decision": "KEEP",
    "newPartId": "n09-q11-remainder::value",
    "recordPolicy": "同ID数学契約が一致する記録のみ保持。新gate成立までは保留。"
  }
]
```
新ID：[]

### n09-11 — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-11

### n09-q12-lower — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-q12-lower

### n09-q12-upper — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-q12-upper

### n09-12 — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-12

### n09-q13-reverse — CHANGE
負数倍した不等号の向きをleadで先答えしない。両境界の向きを決める既存の適用は残す。
完成解法：3<√10<4の各辺を−1倍すると−3>−√10>−4。
最初の本文：確定した比較の各辺を−1倍し、−√10の範囲を表します。
条件：["各辺へ同じ負数−1を掛ける。"]
教える一般則／参照：["負の数を掛けると大小の向きが変わる。一般則を教え、具体的な二境界へ適用する。"]
前提node：["n09-12"]
前提result：["n09-12-result"]
#### 穴と全選択肢

- n09-q13-reverse::S1 / KEEP / math / 正答 `>`
  問い：左側の関係を負の乗算後へ移します。
  回答前提：[]
  全選択肢・誤答理由：基準同IDの厳密契約参照 66c8007b:n09-q13-reverse::S1

- n09-q13-reverse::S2 / KEEP / math / 正答 `>`
  問い：右側の関係も負の乗算後へ移します。
  回答前提：["S1"]
  全選択肢・誤答理由：基準同IDの厳密契約参照 66c8007b:n09-q13-reverse::S2

#### 正確な行・解放条件
```json
[
  {
    "kind": "math",
    "template": "3<\\sqrt{10}<4",
    "partKeys": [],
    "requiresCorrectKeys": [],
    "id": "n09-q13-reverse::ux05-row-01",
    "mathGroupId": "n09-q13-reverse-ux05-math-01"
  },
  {
    "kind": "math",
    "template": "-3\\ {S1}\\ -\\sqrt{10}\\ {S2}\\ -4",
    "partKeys": [
      "S1",
      "S2"
    ],
    "requiresCorrectKeys": [],
    "id": "n09-q13-reverse::ux05-row-02",
    "mathGroupId": "n09-q13-reverse-ux05-math-02"
  }
]
```
各行はrequiresCorrectKeysが全て順序整合した正答の時のみ表示。part自体もdependsOnKeys全成立時のみ回答可。誤答・未回答・旧RETIRE記録で解放しない。terminalと次nodeは全必須part＋全result前提成立時のみ。
初期lead/条件には具体的な新part正答を先書きしない。givenRulesは一般則または既認定事実。後続完成式と候補別正答解説は当該part正答後のみ。候補として並ぶ式は未認定。
terminal：{"resultId": "n09-q13-reverse-result", "formulas": ["-3>-\\sqrt{10}>-4"], "conditions": ["各辺へ同じ負数−1を掛ける。"], "requiresCorrectKeys": ["S1", "S2"], "certifiedFrom": ["n09-12-result"]}
#### 旧新mapping
```json
[
  {
    "oldPartId": "n09-q13-reverse::S1",
    "decision": "KEEP",
    "newPartId": "n09-q13-reverse::S1",
    "recordPolicy": "同ID数学契約が一致する記録のみ保持。新gate成立までは保留。"
  },
  {
    "oldPartId": "n09-q13-reverse::S2",
    "decision": "KEEP",
    "newPartId": "n09-q13-reverse::S2",
    "recordPolicy": "同ID数学契約が一致する記録のみ保持。新gate成立までは保留。"
  }
]
```
新ID：[]

### n09-13 — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-13

### n09-q14-positive-integer — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-q14-positive-integer

### n09-q14-positive-remainder — CHANGE
演算子一字から、定義に基づく小数部分の式全体へ置換。範囲の確かめは必要な途中式として見せる。
完成解法：r=√10−3、3<√10<4の各辺から3を引くと0<r<1。
最初の本文：既に確定した整数部分を用いて、小数部分を求めます。
条件：["整数部分n∈ℤ、n≤x<n+1、小数部分r=x−n、0≤r<1。対象は√10と−√10。"]
教える一般則／参照：["x=n+r、nは整数、0≤r<1。従ってr=x−n。"]
前提node：["n09-11", "n09-12", "n09-13", "n09-q14-positive-integer"]
前提result：["n09-11-result", "n09-12-result", "n09-13-result", "n09-q14-positive-integer-result"]
#### 穴と全選択肢

- n09-q14-positive-remainder::remainderExpressionUX05 / NEW / math / 正答 `\sqrt{10}-3`
  問い：定義r=x−nを使い、確定した整数部分を除いた小数部分の式を選びます。
  回答前提：[]
  思考操作：実数と整数部分の符号を合わせて、剰余の式全体を構成する。
  - 正答：`\sqrt{10}-3` / \sqrt{10}-3 / r=x−nに確定した値を代入した式です。
  - 誤答：`\sqrt{10}+3` / \sqrt{10}+3 / 正の整数部分3は足すのではなく引きます。
  - 誤答：`3-\sqrt{10}` / 3-\sqrt{10} / 引く順序が逆です。小数部分の非負条件も確認してください。
  - 誤答：`\sqrt{10}/3` / \sqrt{10}/3 / 整数部分を除く操作は割り算ではありません。

#### 正確な行・解放条件
```json
[
  {
    "kind": "math",
    "template": "r={remainderExpressionUX05}",
    "partKeys": [
      "remainderExpressionUX05"
    ],
    "requiresCorrectKeys": [],
    "hideAfterCorrectKeys": [
      "remainderExpressionUX05"
    ],
    "id": "n09-q14-positive-remainder::ux05-row-01",
    "mathGroupId": "n09-q14-positive-remainder-ux05-math-01"
  },
  {
    "kind": "math",
    "template": "r=\\sqrt{10}-3",
    "partKeys": [],
    "requiresCorrectKeys": [
      "remainderExpressionUX05"
    ],
    "id": "n09-q14-positive-remainder::ux05-row-02",
    "mathGroupId": "n09-q14-positive-remainder-ux05-math-02"
  },
  {
    "kind": "math",
    "template": "3<\\sqrt{10}<4\\ \\Rightarrow\\ 0<\\sqrt{10}-3<1",
    "partKeys": [],
    "requiresCorrectKeys": [
      "remainderExpressionUX05"
    ],
    "id": "n09-q14-positive-remainder::ux05-row-03",
    "mathGroupId": "n09-q14-positive-remainder-ux05-math-03"
  }
]
```
各行はrequiresCorrectKeysが全て順序整合した正答の時のみ表示。part自体もdependsOnKeys全成立時のみ回答可。誤答・未回答・旧RETIRE記録で解放しない。terminalと次nodeは全必須part＋全result前提成立時のみ。
初期lead/条件には具体的な新part正答を先書きしない。givenRulesは一般則または既認定事実。後続完成式と候補別正答解説は当該part正答後のみ。候補として並ぶ式は未認定。
terminal：{"resultId": "n09-q14-positive-remainder-result", "formulas": ["r=\\sqrt{10}-3", "0<\\sqrt{10}-3<1"], "conditions": ["整数部分n∈ℤ、n≤x<n+1、小数部分r=x−n、0≤r<1。対象は√10と−√10。"], "requiresCorrectKeys": ["remainderExpressionUX05"], "certifiedFrom": ["n09-11-result", "n09-12-result", "n09-13-result", "n09-q14-positive-integer-result"]}
#### 旧新mapping
```json
[
  {
    "oldPartId": "n09-q14-positive-remainder::remainderOperation",
    "decision": "RETIRE",
    "newPartId": null,
    "recordPolicy": "原記録は出所付きARCHIVE_ONLY。新keyへのalias・正答扱い・新課題の解放は禁止。"
  }
]
```
新ID：["n09-q14-positive-remainder::remainderExpressionUX05"]

### n09-q14-negative-integer — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-q14-negative-integer

### n09-q14-negative-remainder — CHANGE
演算子一字から、定義に基づく小数部分の式全体へ置換。範囲の確かめは必要な途中式として見せる。
完成解法：r=−√10−(−4)=−√10＋4=4−√10。−4<−√10<−3の各辺に4を加えると0<r<1。
最初の本文：既に確定した整数部分を用いて、小数部分を求めます。
条件：["整数部分n∈ℤ、n≤x<n+1、小数部分r=x−n、0≤r<1。対象は√10と−√10。"]
教える一般則／参照：["x=n+r、nは整数、0≤r<1。従ってr=x−n。"]
前提node：["n09-11", "n09-12", "n09-13", "n09-q14-negative-integer"]
前提result：["n09-11-result", "n09-12-result", "n09-13-result", "n09-q14-negative-integer-result"]
#### 穴と全選択肢

- n09-q14-negative-remainder::remainderExpressionUX05 / NEW / math / 正答 `4-\sqrt{10}`
  問い：定義r=x−nを使い、確定した整数部分を除いた小数部分の式を選びます。
  回答前提：[]
  思考操作：実数と整数部分の符号を合わせて、剰余の式全体を構成する。
  - 正答：`4-\sqrt{10}` / 4-\sqrt{10} / r=x−nに確定した値を代入した式です。
  - 誤答：`-\sqrt{10}-4` / -\sqrt{10}-4 / 引く整数部分は−4です。−4を引く操作を確かめてください。
  - 誤答：`\sqrt{10}-4` / \sqrt{10}-4 / 対象の実数は−√10です。
  - 誤答：`4+\sqrt{10}` / 4+\sqrt{10} / 対象の−√10の符号を保持してください。

#### 正確な行・解放条件
```json
[
  {
    "kind": "math",
    "template": "r={remainderExpressionUX05}",
    "partKeys": [
      "remainderExpressionUX05"
    ],
    "requiresCorrectKeys": [],
    "hideAfterCorrectKeys": [
      "remainderExpressionUX05"
    ],
    "id": "n09-q14-negative-remainder::ux05-row-01",
    "mathGroupId": "n09-q14-negative-remainder-ux05-math-01"
  },
  {
    "kind": "math",
    "template": "r=-\\sqrt{10}-(-4)=-\\sqrt{10}+4=4-\\sqrt{10}",
    "partKeys": [],
    "requiresCorrectKeys": [
      "remainderExpressionUX05"
    ],
    "id": "n09-q14-negative-remainder::ux05-row-02",
    "mathGroupId": "n09-q14-negative-remainder-ux05-math-02"
  },
  {
    "kind": "math",
    "template": "-4<-\\sqrt{10}<-3",
    "partKeys": [],
    "requiresCorrectKeys": [
      "remainderExpressionUX05"
    ],
    "id": "n09-q14-negative-remainder::ux05-row-03",
    "mathGroupId": "n09-q14-negative-remainder-ux05-math-03"
  },
  {
    "kind": "math",
    "template": "0<4-\\sqrt{10}<1",
    "partKeys": [],
    "requiresCorrectKeys": [
      "remainderExpressionUX05"
    ],
    "id": "n09-q14-negative-remainder::ux05-row-04",
    "mathGroupId": "n09-q14-negative-remainder-ux05-math-04"
  }
]
```
各行はrequiresCorrectKeysが全て順序整合した正答の時のみ表示。part自体もdependsOnKeys全成立時のみ回答可。誤答・未回答・旧RETIRE記録で解放しない。terminalと次nodeは全必須part＋全result前提成立時のみ。
初期lead/条件には具体的な新part正答を先書きしない。givenRulesは一般則または既認定事実。後続完成式と候補別正答解説は当該part正答後のみ。候補として並ぶ式は未認定。
terminal：{"resultId": "n09-q14-negative-remainder-result", "formulas": ["r=4-\\sqrt{10}", "0<4-\\sqrt{10}<1"], "conditions": ["整数部分n∈ℤ、n≤x<n+1、小数部分r=x−n、0≤r<1。対象は√10と−√10。"], "requiresCorrectKeys": ["remainderExpressionUX05"], "certifiedFrom": ["n09-11-result", "n09-12-result", "n09-13-result", "n09-q14-negative-integer-result"]}
#### 旧新mapping
```json
[
  {
    "oldPartId": "n09-q14-negative-remainder::sign",
    "decision": "RETIRE",
    "newPartId": null,
    "recordPolicy": "原記録は出所付きARCHIVE_ONLY。新keyへのalias・正答扱い・新課題の解放は禁止。"
  }
]
```
新ID：["n09-q14-negative-remainder::remainderExpressionUX05"]

### n09-14 — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-14

設計構造の集計のみ。製品コード・新テスト・描画QAは未実施。


## P-W046-UX-05 N10完成具体案（設計資料・未実装）

基準code `66c8007b37cc12391c9df574b8ebbb1b95cf26f5` / compiled `3cfe95380892a1d7a34fdc3fa142448a9f953ddc983427c9626b4fbdd8b0b895`。N10r4→r5。N09/共有renderer/移行実装はroot担当。

### 共通契約

- 新設問を増やす数ノルマなし。既習公式の具体適用/必要計算/定義域/正性/非零/同定を主単位とし、t²・5で割る操作・分母の写し・毎回の符号再証明を追加しない。
- KEEPは固定commitのnode/part本文・問い・全候補・正答・誤答説明を維持。変更node内KEEPもpart契約は同一だが新しい未解決前提を飛ばして解放しない。
- 全rows.requiresCorrectKeysはANDかつpartOrderのordered-correct。前提nodeがcompleteとなり当該nodeへ到達した時だけ初期rowsを表示。誤答はその値と理由を表示して後続を止める。
- 完成解法は設計資料であり初期全文表示ではない。初期画面はlearnerLead/assumptionsとrequiresCorrectKeysが空の行だけ。候補に正答印を出さず既存安定シャッフル。
- 初期assumptionsは当該問いへの既知条件のみ。未来nodeの答えを逆流させない。定理の一般公式を既習参照として出すことと具体対象の完成形を与えることは区別する。
- 数学的に正しい因子順・項順の交換は誤りとしない。選択式では等価な正答を複数候補に置かず、別の書き方はfeedbackで承認。候補外の正しい数学を不可能と断言しない。
- 正答表示はroot共有renderer改訂で自然な数式へ戻す。各nodeで44px phantomを避ける専用回避策/固定括弧/薄い空白は増やさない。
- RETIREはr4 archiveへ原recordを保持し新意味にaliasしない。NEWは未回答。現nodeの全解放状態は新版の未解決前提を含め再評価し、全回答リセットは行わない。
- cross-nodeの確定値は該当result参照で投影し、別nodeのキーをmirrorと偽装しない。変更のない別問題での転移計算まで一律に削除しない。

### 全45node判定

|node|判定|理由|
|---|---|---|
|n10-q01-square|KEEP|候補平方へ平方根の定義を使う必要計算rootSquareを保持。t×tの新しい別穴なし。|
|n10-01|KEEP|必要なt²=25の算出を保持。5で割る演算記号を追加しない。|
|n10-q02-sign|KEEP|t>0から±5の正の候補を選ぶ条件判断。|
|n10-02|KEEP|本人承認の正性→平方125→同定理由を厳密保持。|
|n10-q03-expand|KEEP|既存の平方作用の二因子構成を保持。新たな基本累乗の小問を増やさない。指数の組を新しい二概念と称さない。|
|n10-03|KEEP|積の証明で平方根定義を各パラメータへ適用しabを作る必要計算。|
|n10-q04-sign|KEEP|積が正である証拠を保持。|
|n10-04|KEEP|正性と平方の両方から平方根を同定する理由を保持。|
|n10-q05-denominator|KEEP|分母非零は商の存在の核心なので保持。|
|n10-q05-square|KEEP|既存の上下への平方の作用を保持。scope写し/指数の新しい反復小問は加えない。|
|n10-05|KEEP|商の平方a/bを自ら作る必要な定義適用を保持。|
|n10-q06-sign|KEEP|商の正性は平方根の同定に必要。|
|n10-06|KEEP|商の存在と正の平方根の同定理由を保持。|
|n10-q07-product|KEEP|証明した積の性質の初回適用と内積48を保持。|
|n10-07|KEEP|最大平方因子16と残因子3の方針/必要計算。4という別の正しい途中分解を偽としない最大指定。|
|n10-q08-factor|KEEP|平方因子を根号外へ出す係数4の初回具体適用。|
|n10-08|KEEP|確定結果を元問題へ接続するAUTO。既回答を再採点せず現行結果を保持。|
|n10-q09-left|KEEP|局所の根号簡単化の方針と係数を保持。残因子や基本指数の新しい別問は足さない。|
|n10-q09-right|KEEP|右項への転移。既存方針と係数5を保持し基本手順を追加分割しない。|
|n10-09|KEEP|確定した二項を元の和へ戻すAUTO。次nodeの係数和の式は先に出さない。|
|n10-q10-coefficients|CHANGE|√2を先にくくってから7だけ問うAUTO主判断を、係数和の式の構成へ置換。追加の平方因子/係数の基本小問は作らない。|
|n10-10|KEEP|確定結果を元問題へ接続するAUTO。既回答を再採点せず現行結果を保持。|
|n10-q11-formula|CHANGE|−一字だけの公式当てとUX04六段階の分配再証明をともに避ける。|
|n10-11|KEEP|具体的な二根号の平方2/3を計算。新しい中項構成の次なので先出しではない。|
|n10-q12-product|KEEP|新しい中項の根号の積6は必要計算。|
|n10-12|KEEP|定数和5の必要整理。見えている2/3の組を写す新小問は足さない。|
|n10-q13-identity|CHANGE|−一字で平方差を与えず、かつ−B→二積→二符号→0の小問連鎖へしない。|
|n10-13|KEEP|相殺を確定した後の平方7/2と差5を具体計算。|
|n10-14|KEEP|同一の非零因子を上下へ掛ける値保持の根拠。|
|n10-q15-factor|KEEP|最初の有理化で正の因子√3を選ぶ方針。|
|n10-15|KEEP|分子も同じ因子で変わることを最初の有理化で確認。1×√3を主たる難問とせず必要な局所計算として保持しscopeコピー小問は足さない。|
|n10-q16-denominator|KEEP|係数2を含む分母全体の平方/6を求める必要計算。|
|n10-16|KEEP|確定結果を元問題へ接続するAUTO。既回答を再採点せず現行結果を保持。|
|n10-q17-factor|KEEP|共役因子の方針を保持。|
|n10-q17-nonzero|KEEP|c/cを掛ける前提の非零性を正性で証明。|
|n10-17|CHANGE|元分子/分母の写しや×記号単独の採点をしない。非零を確認したc/cによる値保持と分数全体の束縛は式で明示。|
|n10-18|KEEP|この有理化で最初に必要になる平方3/2と分母1の計算。結果を次の分子計算でも参照。|
|n10-q19-distribute|CHANGE|−√2の写しと次の−符号を再度採点する二段階を、一つの必要な分子展開へまとめる。|
|n10-19|CHANGE|この有理化の分母で確定した(√3)²=3を分子で再入力しない。異なる根号の積√6は必要計算として保つ。|
|n10-q20-factor|CHANGE|4/3を先出しして後段P/Qで再採点せず、平方比較に初めて必要なここで計算。方針/正性/同一非零因子の根拠は保持。|
|n10-20|CHANGE|指数2と−一字を別採点せず、平方/平方差を分数全体へ適用する一つの変形へ統合。|
|n10-q21-denominator|KEEP|分母1の必要計算。主要な新概念と誇張せず追加の4−3の操作小問なし。|
|n10-q21-expand|CHANGE|旧P/Qの4/3は前段resultを参照して再入力しない。旧K=4を符号込み中項の正答へaliasせず、新しい一つの公式適用を問う。|
|n10-q21-constants|KEEP|中項を保った定数和7。4/3の写しを新しい別問にしない。|
|n10-21|KEEP|確定結果を元問題へ接続するAUTO。既回答を再採点せず現行結果を保持。|

### n10-q10-coefficients

√2を先にくくってから7だけ問うAUTO主判断を、係数和の式の構成へ置換。追加の平方因子/係数の基本小問は作らない。

**完成した穴なし解法（初期表示ではない）**

`2\sqrt2+5\sqrt2=(2+5)\sqrt2=7\sqrt2`

**初期本文** 二つの項を、共通する根号の何個分かという形でまとめます。

**条件** 直前で√8=2√2、√50=5√2を確定済み。

partOrder: collectedExpressionUX05 → coefficient

**正確な行とgate**

|id|kind/template|partKeys|requiresCorrectKeys|certifiedFrom|
|---|---|---|---|---|
|n10-q10-coefficients::ux05-collect|math: `2\sqrt2+5\sqrt2={collectedExpressionUX05}`|collectedExpressionUX05|||
|n10-q10-coefficients::ux05-sum|math: `=(2+5)\sqrt2={coefficient}\sqrt2`|coefficient|collectedExpressionUX05||

**設問の全契約**

- `n10-q10-coefficients::collectedExpressionUX05` NEW / math / expression。問い：共通する根号を保ち、二つの項の和を係数の和で表した式を選びます。。正答：`(2+5)\sqrt2`。
  操作：同類の根号項を分配法則の逆で集める。。旧回答：NEW_UNANSWERED_NO_ALIAS。
  - 候補 `(2+5)\sqrt2` 正答：共通因子√2を保ち、係数を足す分配法則の逆です。 / 表示=(2+5)\sqrt2
  - 候補 `\sqrt{2+5}` 誤答：係数を根号内へ入れる変形はできません。元の二項はいずれも√2の倍数です。 / 表示=\sqrt{2+5}
  - 候補 `(2+5)\sqrt{2+2}` 誤答：同じ√2をくくる操作です。根号内の2を足して変えてはいけません。 / 表示=(2+5)\sqrt{2+2}
  - 候補 `(2\times5)\sqrt2` 誤答：元は和です。係数を掛けるのでなく足してまとめます。 / 表示=(2\times5)\sqrt2
- `n10-q10-coefficients::coefficient` KEEP / math / coefficient。問い：係数2+5を計算します。。正答：`7`。
  操作：固定sourceと同じ局所操作。旧回答：SAME_ID_CONTRACT_KEEP_WITH_NEW_GATES。
  - 候補 `7` 正答：確定した結果を次の計算へ使います。 / 表示=7
  - 候補 `10` 誤答：係数を掛けずに足します。 / 表示=10
  - 候補 `3` 誤答：二つの項は加算されています。 / 表示=3



**達成/依存契約**

`{"classification": "NEW_CONSTRUCTION", "prerequisiteNodeIds": ["n10-04", "n10-09"], "requiredResultRefs": ["n10-04-result", "n10-09-result"], "terminalRecord": {"id": "n10-q10-coefficients::terminal", "formulas": ["2\\sqrt2+5\\sqrt2=7\\sqrt2"], "conditions": ["共通因子√2をくくる分配法則。"], "prose": "係数の合計は7です。元の二つの根号の和の結論になります。", "requiresCorrectKeys": ["collectedExpressionUX05", "coefficient"], "certifiedFrom": ["n10-04-result", "n10-09-result"], "proseParts": [{"type": "text", "text": "係数の合計は"}, {"type": "math", "latex": "7"}, {"type": "text", "text": "です。元の二つの根号の和の結論になります。"}], "conditionParts": [[{"type": "text", "text": "共通因子"}, {"type": "math", "latex": "\\sqrt{2}"}, {"type": "text", "text": "をくくる分配法則。"}]]}}`

**既存part対応**

- `n10-q10-coefficients::coefficient` → KEEP。同じ対象/操作/候補/正答の契約を維持。新版のgateは再評価する。

初期はinitialRowsのみ。後続結果は全gate成立後。一般公式以外の新part期待値をlead/条件へ書かない。正答は共有rendererで自然式、回答欄/候補は現在式の直後。

原問題/stage/resultId/式番号は固定sourceを継承。prerequisiteNodeIds/requiredResultRefs/terminalRecordは本案の明記値を用いる。

因子・項の交換等の数学的同値を否定しない。指定された式の形を選ぶ問いであり、同値な正答候補は重複掲載しない。

### n10-q11-formula

−一字だけの公式当てとUX04六段階の分配再証明をともに避ける。

**完成した穴なし解法（初期表示ではない）**

`(\sqrt2-\sqrt3)^2=(\sqrt2)^2-2\sqrt2\sqrt3+(\sqrt3)^2`

**初期本文** 既習の差の平方を、二つの根号を含む式に適用します。中項を自分で作りましょう。

**条件** 既習公式：(A-B)^2=A^2-2AB+B^2。

partOrder: signedMiddleTermUX05

**正確な行とgate**

|id|kind/template|partKeys|requiresCorrectKeys|certifiedFrom|
|---|---|---|---|---|
|n10-q11-formula::ux05-middle|math: `(\sqrt2-\sqrt3)^2=(\sqrt2)^2{signedMiddleTermUX05}+(\sqrt3)^2`|signedMiddleTermUX05|||

**設問の全契約**

- `n10-q11-formula::signedMiddleTermUX05` NEW / math / expression。問い：差の平方の公式をこの根号式へ適用し、中項全体を符号込みで作ります。。正答：`-2\sqrt2\sqrt3`。
  操作：差平方公式の2ABを具体的な二根号へ対応し、符号と係数を含む中項を構成。。旧回答：NEW_UNANSWERED_NO_ALIAS。
  - 候補 `-2\sqrt2\sqrt3` 正答：二つの異なる項の積が2個あり、差の平方では符号は負です。 / 表示=-2\sqrt2\sqrt3
  - 候補 `-\sqrt2\sqrt3` 誤答：中項の係数2が不足しています。既習公式の2ABをこの二項へ対応させます。 / 表示=-\sqrt2\sqrt3
  - 候補 `+2\sqrt2\sqrt3` 誤答：和でなく差の平方なので中項は負です。 / 表示=+2\sqrt2\sqrt3
  - 候補 `-2\sqrt{2+3}` 誤答：積ABに対応する根号の積です。根号の中を足すことはできません。 / 表示=-2\sqrt{2+3}



**達成/依存契約**

`{"classification": "NEW_CONSTRUCTION", "prerequisiteNodeIds": ["n10-04", "n10-10"], "requiredResultRefs": ["n10-04-result", "n10-10-result"], "terminalRecord": {"id": "n10-q11-formula::terminal", "formulas": ["(\\sqrt2-\\sqrt3)^2=(\\sqrt2)^2-2\\sqrt2\\sqrt3+(\\sqrt3)^2"], "conditions": ["既習の乗法公式。A=√2、B=√3。"], "prose": "差の平方の中項は引く項です。根号を含む本題へ公式を適用します。", "requiresCorrectKeys": ["signedMiddleTermUX05"], "certifiedFrom": ["n10-04-result", "n10-10-result"], "proseParts": [{"type": "text", "text": "差の平方の中項は引く項です。根号を含む本題へ公式を適用します。"}], "conditionParts": [[{"type": "text", "text": "既習の乗法公式。"}, {"type": "math", "latex": "A=\\sqrt{2}"}, {"type": "text", "text": "、"}, {"type": "math", "latex": "B=\\sqrt{3}"}, {"type": "text", "text": "。"}]]}}`

**既存part対応**

- `n10-q11-formula::middleSign` → RETIRE_ARCHIVE_ONLY。一般公式の符号−から具体式の符号込み中項へ対象/操作/候補が変わるためaliasしない。

初期はinitialRowsのみ。後続結果は全gate成立後。一般公式以外の新part期待値をlead/条件へ書かない。正答は共有rendererで自然式、回答欄/候補は現在式の直後。

原問題/stage/resultId/式番号は固定sourceを継承。prerequisiteNodeIds/requiredResultRefs/terminalRecordは本案の明記値を用いる。

因子・項の交換等の数学的同値を否定しない。指定された式の形を選ぶ問いであり、同値な正答候補は重複掲載しない。

### n10-q13-identity

−一字で平方差を与えず、かつ−B→二積→二符号→0の小問連鎖へしない。

**完成した穴なし解法（初期表示ではない）**

`(\sqrt7+\sqrt2)(\sqrt7-\sqrt2)=(\sqrt7)^2-\sqrt7\sqrt2+\sqrt2\sqrt7-(\sqrt2)^2=(\sqrt7)^2-(\sqrt2)^2`

**初期本文** 和と差の積で、消える交差項を確かめます。残る平方の項を次に計算します。

**条件** 既習の分配法則と和と差の積を使う。

partOrder: cancellingPairUX05

**正確な行とgate**

|id|kind/template|partKeys|requiresCorrectKeys|certifiedFrom|
|---|---|---|---|---|
|n10-q13-identity::ux05-problem|math: `(\sqrt7+\sqrt2)(\sqrt7-\sqrt2)`||||
|n10-q13-identity::ux05-pair|text: `相殺する交差項の組：{cancellingPairUX05}`|cancellingPairUX05|||
|n10-q13-identity::ux05-expand|math: `(\sqrt7+\sqrt2)(\sqrt7-\sqrt2)=(\sqrt7)^2-\sqrt7\sqrt2+\sqrt2\sqrt7-(\sqrt2)^2`||cancellingPairUX05||
|n10-q13-identity::ux05-cancel|math: `=(\sqrt7)^2-(\sqrt2)^2`||cancellingPairUX05||

**設問の全契約**

- `n10-q13-identity::cancellingPairUX05` NEW / text / meaning。問い：この積を分配したとき、互いに打ち消し合う交差項の組を選びます。組の順序は問いません。。正答：`opposite-cross-products`。
  操作：和差積の具体的な交差項を同定し、相殺する構造を把握。。旧回答：NEW_UNANSWERED_NO_ALIAS。
  - 候補 `opposite-cross-products` 正答：交差項は同じ大きさで逆符号なので和が0です。順を交換しても同じ組です。 / 表示=['-\\sqrt7\\sqrt2', '\\text{と}\\quad+\\sqrt2\\sqrt7']
  - 候補 `both-positive` 誤答：二つとも正なら打ち消し合いません。第二因子の−√2を掛ける項を確認します。 / 表示=['+\\sqrt7\\sqrt2', '\\text{と}\\quad+\\sqrt2\\sqrt7']
  - 候補 `both-negative` 誤答：二つとも負ではありません。第一因子の＋√2と第二因子の√7の積は正です。 / 表示=['-\\sqrt7\\sqrt2', '\\text{と}\\quad-\\sqrt2\\sqrt7']
  - 候補 `square-terms` 誤答：これらは交差項の組ではありません。異なる根号どうしを掛ける項を対応させます。 / 表示=['-\\sqrt7\\sqrt7', '\\text{と}\\quad+\\sqrt2\\sqrt2']

採点値はtext enum一つ。候補mathLinesは二項の境界で同じbutton内を2行にし、displayは読み上げ可能な組全体。本文は短いtext選択足場で単一の長いmath slotにしない。正答後は足場を消し、gate付きの具体展開/相殺結果を通常mathASTへする。順序交換は同値。

**達成/依存契約**

`{"classification": "NEW_CONSTRUCTION", "prerequisiteNodeIds": ["n10-04", "n10-12"], "requiredResultRefs": ["n10-04-result", "n10-12-result"], "terminalRecord": {"id": "n10-q13-identity::terminal", "formulas": ["(\\sqrt7+\\sqrt2)(\\sqrt7-\\sqrt2)=(\\sqrt7)^2-(\\sqrt2)^2"], "conditions": ["既習の和と差の積。A=√7、B=√2。"], "prose": "積を二つの平方の差へ直せます。次に各平方と差を計算します。", "requiresCorrectKeys": ["cancellingPairUX05"], "certifiedFrom": ["n10-04-result", "n10-12-result"], "proseParts": [{"type": "text", "text": "積を二つの平方の差へ直せます。次に各平方と差を計算します。"}], "conditionParts": [[{"type": "text", "text": "既習の和と差の積。"}, {"type": "math", "latex": "A=\\sqrt{7}"}, {"type": "text", "text": "、"}, {"type": "math", "latex": "B=\\sqrt{2}"}, {"type": "text", "text": "。"}]]}}`

**既存part対応**

- `n10-q13-identity::operation` → RETIRE_ARCHIVE_ONLY。一般公式の−と、具体的な相殺項の組を同定する新操作は非同値。

初期はinitialRowsのみ。後続結果は全gate成立後。一般公式以外の新part期待値をlead/条件へ書かない。正答は共有rendererで自然式、回答欄/候補は現在式の直後。

原問題/stage/resultId/式番号は固定sourceを継承。prerequisiteNodeIds/requiredResultRefs/terminalRecordは本案の明記値を用いる。

因子・項の交換等の数学的同値を否定しない。指定された式の形を選ぶ問いであり、同値な正答候補は重複掲載しない。

### n10-17

元分子/分母の写しや×記号単独の採点をしない。非零を確認したc/cによる値保持と分数全体の束縛は式で明示。

**完成した穴なし解法（初期表示ではない）**

`\frac{\sqrt3}{\sqrt3+\sqrt2}\frac{\sqrt3-\sqrt2}{\sqrt3-\sqrt2}=\frac{\sqrt3(\sqrt3-\sqrt2)}{(\sqrt3+\sqrt2)(\sqrt3-\sqrt2)}`

**初期本文** 非零と確認した同じ因子を、分子と分母の両方へ掛けます。

**条件** c=√3−√2≠0、元分母√3+√2>0。

partOrder: なし（AUTO）

**正確な行とgate**

|id|kind/template|partKeys|requiresCorrectKeys|certifiedFrom|
|---|---|---|---|---|
|n10-17::ux05-fraction|math: `\frac{\sqrt3}{\sqrt3+\sqrt2}\frac{\sqrt3-\sqrt2}{\sqrt3-\sqrt2}=\frac{\sqrt3(\sqrt3-\sqrt2)}{(\sqrt3+\sqrt2)(\sqrt3-\sqrt2)}`||||

**設問の全契約**




**達成/依存契約**

`{"classification": "AUTO_RECORDED_CONCLUSION", "prerequisiteNodeIds": ["n10-13", "n10-14", "n10-q17-nonzero"], "requiredResultRefs": ["n10-13-result", "n10-14-result", "n10-q17-nonzero-result"], "terminalRecord": {"id": "n10-17::terminal", "formulas": ["\\frac{\\sqrt3}{\\sqrt3+\\sqrt2}=\\frac{\\sqrt3(\\sqrt3-\\sqrt2)}{(\\sqrt3+\\sqrt2)(\\sqrt3-\\sqrt2)}"], "conditions": ["元分母√3+√2>0、掛ける因子√3−√2≠0。"], "prose": "値を保ったまま分母を和と差の積へ変えました。先に分母、次に分子を計算します。", "requiresCorrectKeys": [], "certifiedFrom": ["n10-13-result", "n10-14-result", "n10-q17-nonzero-result"], "proseParts": [{"type": "text", "text": "値を保ったまま分母を和と差の積へ変えました。先に分母、次に分子を計算します。"}], "conditionParts": [[{"type": "text", "text": "元分母"}, {"type": "math", "latex": "\\sqrt{3}+\\sqrt{2}>0"}, {"type": "text", "text": "、掛ける因子"}, {"type": "math", "latex": "\\sqrt{3}-\\sqrt{2}\\ne 0"}, {"type": "text", "text": "。"}]]}}`

**既存part対応**

- `n10-17::productOperation` → RETIRE_ARCHIVE_ONLY。分数の積の×一字は標準経路の独立主判断にせず、途中式へ統合。記録はarchive保持。

初期はinitialRowsのみ。後続結果は全gate成立後。一般公式以外の新part期待値をlead/条件へ書かない。正答は共有rendererで自然式、回答欄/候補は現在式の直後。

原問題/stage/resultId/式番号は固定sourceを継承。prerequisiteNodeIds/requiredResultRefs/terminalRecordは本案の明記値を用いる。

因子・項の交換等の数学的同値を否定しない。指定された式の形を選ぶ問いであり、同値な正答候補は重複掲載しない。

### n10-q19-distribute

−√2の写しと次の−符号を再度採点する二段階を、一つの必要な分子展開へまとめる。

**完成した穴なし解法（初期表示ではない）**

`\sqrt3(\sqrt3-\sqrt2)=\sqrt3\times\sqrt3-\sqrt3\times\sqrt2`

**初期本文** 分母は確定しました。次は分子の差全体へ分配法則を適用します。

**条件** 対象は分子√3(√3−√2)。

partOrder: distributedNumeratorUX05

**正確な行とgate**

|id|kind/template|partKeys|requiresCorrectKeys|certifiedFrom|
|---|---|---|---|---|
|n10-q19-distribute::ux05-distribute|math: `\sqrt3(\sqrt3-\sqrt2)={distributedNumeratorUX05}`|distributedNumeratorUX05|||

**設問の全契約**

- `n10-q19-distribute::distributedNumeratorUX05` NEW / math / expression。問い：分子の括弧全体へ分配法則を適用した式を選びます。。正答：`\sqrt3\times\sqrt3-\sqrt3\times\sqrt2`。
  操作：根号を含む分子全体へ分配法則を適用し、両項への作用を構成。。旧回答：NEW_UNANSWERED_NO_ALIAS。
  - 候補 `\sqrt3\times\sqrt3-\sqrt3\times\sqrt2` 正答：外の√3を括弧内の両項へ掛け、差の演算を保っています。 / 表示=\sqrt3\times\sqrt3-\sqrt3\times\sqrt2
  - 候補 `\sqrt3\times\sqrt3-\sqrt2` 誤答：括弧の第二項にも外の√3を掛けます。 / 表示=\sqrt3\times\sqrt3-\sqrt2
  - 候補 `\sqrt3\times\sqrt3+\sqrt3\times\sqrt2` 誤答：元の差を和へ変えてはいけません。 / 表示=\sqrt3\times\sqrt3+\sqrt3\times\sqrt2
  - 候補 `\sqrt3\times\sqrt3-\sqrt3` 誤答：第二項は√3と√2の積です。√2を落とさずに対応させます。 / 表示=\sqrt3\times\sqrt3-\sqrt3



**達成/依存契約**

`{"classification": "NEW_CONSTRUCTION", "prerequisiteNodeIds": ["n10-17", "n10-18"], "requiredResultRefs": ["n10-17-result", "n10-18-result"], "terminalRecord": {"id": "n10-q19-distribute::terminal", "formulas": ["\\sqrt3(\\sqrt3-\\sqrt2)=\\sqrt3\\times\\sqrt3-\\sqrt3\\times\\sqrt2"], "conditions": ["分配する対象は差の全体。"], "prose": "両項へ掛ける形になりました。各積を計算して分母1と合わせます。", "requiresCorrectKeys": ["distributedNumeratorUX05"], "certifiedFrom": ["n10-17-result", "n10-18-result"], "proseParts": [{"type": "text", "text": "両項へ掛ける形になりました。各積を計算して分母"}, {"type": "math", "latex": "1"}, {"type": "text", "text": "と合わせます。"}], "conditionParts": [[{"type": "text", "text": "分配する対象は差の全体。"}]]}}`

**既存part対応**

- `n10-q19-distribute::secondOperand` → RETIRE_ARCHIVE_ONLY。符号付き項の写しから両項への分配式の構成へ変更。
- `n10-q19-distribute::productSign` → RETIRE_ARCHIVE_ONLY。単独符号の再入力は新しい分配適用に統合。

初期はinitialRowsのみ。後続結果は全gate成立後。一般公式以外の新part期待値をlead/条件へ書かない。正答は共有rendererで自然式、回答欄/候補は現在式の直後。

原問題/stage/resultId/式番号は固定sourceを継承。prerequisiteNodeIds/requiredResultRefs/terminalRecordは本案の明記値を用いる。

因子・項の交換等の数学的同値を否定しない。指定された式の形を選ぶ問いであり、同値な正答候補は重複掲載しない。

### n10-19

この有理化の分母で確定した(√3)²=3を分子で再入力しない。異なる根号の積√6は必要計算として保つ。

**完成した穴なし解法（初期表示ではない）**

`\sqrt3\sqrt3-\sqrt3\sqrt2=3-\sqrt{3\times2}=3-\sqrt6`
`\frac{\sqrt3}{\sqrt3+\sqrt2}=\frac{3-\sqrt6}{1}=3-\sqrt6`

**初期本文** 分子の最初の積には、分母計算で確定した平方の値を使います。異なる根号どうしの積を計算しましょう。

**条件** n10-18で(√3)²=3、分母=1を確定済み。

partOrder: inside

**正確な行とgate**

|id|kind/template|partKeys|requiresCorrectKeys|certifiedFrom|
|---|---|---|---|---|
|n10-19::ux05-product|math: `\sqrt3\sqrt3-\sqrt3\sqrt2=3-\sqrt{ {inside} }`|inside||n10-18-result|
|n10-19::ux05-return|math: `\frac{\sqrt3}{\sqrt3+\sqrt2}=\frac{3-\sqrt6}{1}=3-\sqrt6`||inside|n10-18-result|

**設問の全契約**

- `n10-19::inside` KEEP / math / rational。問い：第二項の根号内の積を計算します。。正答：`6`。
  操作：固定sourceと同じ局所操作。旧回答：SAME_ID_CONTRACT_KEEP_WITH_NEW_GATES。
  - 候補 `6` 正答：確定した結果を次の計算へ使います。 / 表示=6
  - 候補 `5` 誤答：根号の中の積を計算します。 / 表示=5
  - 候補 `3` 誤答：第二因子2も積へ含めます。 / 表示=3



**達成/依存契約**

`{"classification": "NEW_CONSTRUCTION", "prerequisiteNodeIds": ["n10-17", "n10-q19-distribute", "n10-18"], "requiredResultRefs": ["n10-17-result", "n10-q19-distribute-result", "n10-18-result"], "terminalRecord": {"id": "n10-19::terminal", "formulas": ["\\frac{\\sqrt3}{\\sqrt3+\\sqrt2}=3-\\sqrt6"], "conditions": ["分母=1を認定済み。元分母と因子は非零。"], "prose": "分子まで計算して元の分数を整理できました。次は支援を減らして因子を選びます。", "requiresCorrectKeys": ["inside"], "certifiedFrom": ["n10-17-result", "n10-q19-distribute-result", "n10-18-result"], "proseParts": [{"type": "text", "text": "分子まで計算して元の分数を整理できました。次は支援を減らして因子を選びます。"}], "conditionParts": [[{"type": "text", "text": "分母"}, {"type": "math", "latex": "=1"}, {"type": "text", "text": "を認定済み。元分母と因子は非零。"}]]}}`

**既存part対応**

- `n10-19::left` → RETIRE_ARCHIVE_ONLY。同じ有理化内で確定済みの平方3はresult参照。r4記録はarchiveのみ。
- `n10-19::inside` → KEEP。同じ対象/操作/候補/正答の契約を維持。新版のgateは再評価する。

初期はinitialRowsのみ。後続結果は全gate成立後。一般公式以外の新part期待値をlead/条件へ書かない。正答は共有rendererで自然式、回答欄/候補は現在式の直後。

原問題/stage/resultId/式番号は固定sourceを継承。prerequisiteNodeIds/requiredResultRefs/terminalRecordは本案の明記値を用いる。

因子・項の交換等の数学的同値を否定しない。指定された式の形を選ぶ問いであり、同値な正答候補は重複掲載しない。

### n10-q20-factor

4/3を先出しして後段P/Qで再採点せず、平方比較に初めて必要なここで計算。方針/正性/同一非零因子の根拠は保持。

**完成した穴なし解法（初期表示ではない）**

`c=2-\sqrt3`
`2^2=4>3=(\sqrt3)^2,\quad2>0,\ \sqrt3>0\Rightarrow2-\sqrt3>0`
`(2+\sqrt3)(2-\sqrt3)=4-3=1\in\mathbb Q`
`c\ne0\Rightarrow c/c=1`

**初期本文** この手順では正の因子を使い、分母の積を有理数にします。選んだ因子が0でないことも確かめましょう。

**条件** 元分母2+√3>0。この手順の指定はc>0。逆符号の有効な別解を数学的に不可能とはしない。

partOrder: factor → positiveComparisonLeftSquareUX05 → positiveComparisonRootSquareUX05 → factorSign → reason

**正確な行とgate**

|id|kind/template|partKeys|requiresCorrectKeys|certifiedFrom|
|---|---|---|---|---|
|n10-q20-factor::ux05-factor|math: `(2+\sqrt3)\bigl({factor}\bigr)`|factor|||
|n10-q20-factor::ux05-square-left|math: `2^2={positiveComparisonLeftSquareUX05}`|positiveComparisonLeftSquareUX05|factor||
|n10-q20-factor::ux05-square-root|math: `(\sqrt3)^2={positiveComparisonRootSquareUX05}`|positiveComparisonRootSquareUX05|factor,positiveComparisonLeftSquareUX05||
|n10-q20-factor::ux05-compare|math: `2^2={mirror:positiveComparisonLeftSquareUX05}>{mirror:positiveComparisonRootSquareUX05}=(\sqrt3)^2,\quad2>0,\ \sqrt3>0`||factor,positiveComparisonLeftSquareUX05,positiveComparisonRootSquareUX05||
|n10-q20-factor::ux05-sign|math: `2-\sqrt3{factorSign}0`|factorSign|factor,positiveComparisonLeftSquareUX05,positiveComparisonRootSquareUX05||
|n10-q20-factor::ux05-nonzero|math: `c\ne0`||factor,positiveComparisonLeftSquareUX05,positiveComparisonRootSquareUX05,factorSign||
|n10-q20-factor::ux05-reason|text: `この変形で式の値を保って有理化できるのは、{reason}。`|reason|factor,positiveComparisonLeftSquareUX05,positiveComparisonRootSquareUX05,factorSign||

**設問の全契約**

- `n10-q20-factor::factor` KEEP / math / operand。問い：平方差に対応する因子を選びます。。正答：`2-\sqrt3`。
  操作：固定sourceと同じ局所操作。旧回答：SAME_ID_CONTRACT_KEEP_WITH_NEW_GATES。
  - 候補 `2-\sqrt3` 正答：確定した結果を次の計算へ使います。 / 表示=2-\sqrt3
  - 候補 `2+\sqrt3` 誤答：同じ和では平方差を作れません。 / 表示=2+\sqrt3
  - 候補 `\sqrt3-2` 誤答：その因子でも分母を−1にできます。ただし、この手順では正の因子cを選ぶ指定があります。指定と因子の符号を照合してください。 / 表示=\sqrt3-2
- `n10-q20-factor::positiveComparisonLeftSquareUX05` NEW / math / rational。問い：選んだ因子が0でないことを比較で確かめます。まず2の平方を求めます。。正答：`4`。
  操作：正数2と√3の大小比較に初めて必要な平方を計算。。旧回答：NEW_UNANSWERED_NO_ALIAS。
  - 候補 `4` 正答：2の平方は4です。正の数どうしの平方比較へ使います。 / 表示=4
  - 候補 `2` 誤答：平方は同じ数を二回掛けます。2をそのまま残しません。 / 表示=2
  - 候補 `8` 誤答：2を三回掛ける計算ではありません。 / 表示=8
- `n10-q20-factor::positiveComparisonRootSquareUX05` NEW / math / rational。問い：比較するもう一方、√3の平方を求めます。。正答：`3`。
  操作：非零の根拠を作るため根号の平方を定義で計算。。旧回答：NEW_UNANSWERED_NO_ALIAS。
  - 候補 `3` 正答：平方根の定義で(√3)²=3です。 / 表示=3
  - 候補 `9` 誤答：根号の中の3をさらに平方しません。 / 表示=9
  - 候補 `\sqrt3` 誤答：平方の作用を反映して根号を外します。 / 表示=\sqrt3
- `n10-q20-factor::factorSign` KEEP / math / relation。問い：正の数の平方比較を使い、差と0を比べます。。正答：`>`。
  操作：固定sourceと同じ局所操作。旧回答：SAME_ID_CONTRACT_KEEP_WITH_NEW_GATES。
  - 候補 `>` 正答：この判断を確定し、次へ進みます。 / 表示=>
  - 候補 `<` 誤答：2と√3の平方の大小を、元の正の数の大小へ戻してください。 / 表示=<
  - 候補 `=` 誤答：4と3は一致していません。 / 表示==
- `n10-q20-factor::reason` KEEP / text / equivalent-operation-reason。問い：選んだ因子で、式の値を保ったまま有理化できる理由を選びます。。正答：`nonzero-and-rational-product`。
  操作：固定sourceと同じ局所操作。旧回答：SAME_ID_CONTRACT_KEEP_WITH_NEW_GATES。
  - 候補 `nonzero-and-rational-product` 正答：因子が零でないことと、分母の積が有理数になることを合わせて確認できました。 / 表示=非零の因子で上下を同じように変え、分母の積を有理数にできるから
  - 候補 `same-factor-even-zero` 誤答：因子を上下へ掛けた式を比として見たとき、因子が零だと分母がどうなるか確かめてください。 / 表示=上下へ同じ因子を掛けさえすれば、その因子が零でも値を保てるから
  - 候補 `different-factors` 誤答：分母だけが有理数になっても、元の分数と同じ値になるとは限りません。上下へ掛けた比が何になるかを確かめてください。 / 表示=分母の積が有理数なら、分子に掛ける因子は別の数でもよいから



**達成/依存契約**

`{"classification": "NEW_CONSTRUCTION", "prerequisiteNodeIds": ["n10-13", "n10-14", "n10-19"], "requiredResultRefs": ["n10-13-result", "n10-14-result", "n10-19-result"], "terminalRecord": {"id": "n10-q20-factor::terminal", "formulas": ["c=2-\\sqrt3", "2-\\sqrt3>0", "2^2=4", "(\\sqrt3)^2=3"], "conditions": ["元分母2+√3>0。認定した因子2−√3>0、したがって非零。"], "prose": "選んだ因子は非零です。同じ因子を上下へ掛け、分子と分母の構造を確かめます。", "requiresCorrectKeys": ["factor", "positiveComparisonLeftSquareUX05", "positiveComparisonRootSquareUX05", "factorSign", "reason"], "certifiedFrom": ["n10-13-result", "n10-14-result", "n10-19-result"], "proseParts": [{"type": "text", "text": "選んだ因子は非零です。同じ因子を上下へ掛け、分子と分母の構造を確かめます。"}], "conditionParts": [[{"type": "text", "text": "元分母"}, {"type": "math", "latex": "2+\\sqrt{3}>0"}, {"type": "text", "text": "。認定した因子"}, {"type": "math", "latex": "2-\\sqrt{3}>0"}, {"type": "text", "text": "、したがって非零。"}]]}}`

**既存part対応**

- `n10-q20-factor::factor` → KEEP。同じ対象/操作/候補/正答の契約を維持。新版のgateは再評価する。
- `n10-q20-factor::factorSign` → KEEP。同じ対象/操作/候補/正答の契約を維持。新版のgateは再評価する。
- `n10-q20-factor::reason` → KEEP。同じ対象/操作/候補/正答の契約を維持。新版のgateは再評価する。

初期はinitialRowsのみ。後続結果は全gate成立後。一般公式以外の新part期待値をlead/条件へ書かない。正答は共有rendererで自然式、回答欄/候補は現在式の直後。

原問題/stage/resultId/式番号は固定sourceを継承。prerequisiteNodeIds/requiredResultRefs/terminalRecordは本案の明記値を用いる。

因子・項の交換等の数学的同値を否定しない。指定された式の形を選ぶ問いであり、同値な正答候補は重複掲載しない。

### n10-20

指数2と−一字を別採点せず、平方/平方差を分数全体へ適用する一つの変形へ統合。

**完成した穴なし解法（初期表示ではない）**

`\frac{2-\sqrt3}{2+\sqrt3}\frac{2-\sqrt3}{2-\sqrt3}=\frac{(2-\sqrt3)^2}{2^2-(\sqrt3)^2}=\frac{(2-\sqrt3)^2}{4-3}`

**初期本文** 非零と確認した同じ因子を上下へ掛けます。分子と分母に適用する公式の違いに注意しましょう。

**条件** c=2−√3≠0を確定済み。比較で2²=4、(√3)²=3も確定済み。

partOrder: rationalisedFractionUX05

**正確な行とgate**

|id|kind/template|partKeys|requiresCorrectKeys|certifiedFrom|
|---|---|---|---|---|
|n10-20::ux05-start|math: `\frac{2-\sqrt3}{2+\sqrt3}\frac{2-\sqrt3}{2-\sqrt3}`||||
|n10-20::ux05-form|math: `={rationalisedFractionUX05}`|rationalisedFractionUX05|||
|n10-20::ux05-known-squares|math: `=\frac{(2-\sqrt3)^2}{4-3}`||rationalisedFractionUX05|n10-q20-factor-result|

**設問の全契約**

- `n10-20::rationalisedFractionUX05` NEW / math / expression。問い：同じ非零因子を上下へ掛けた式で、分子全体の積を平方、分母の和と差の積を平方差で表します。。正答：`\frac{(2-\sqrt3)^2}{2^2-(\sqrt3)^2}`。
  操作：有理化の分数全体で二つの既習公式を対応させ、値保持した式を構成。。旧回答：NEW_UNANSWERED_NO_ALIAS。
  - 候補 `\frac{(2-\sqrt3)^2}{2^2-(\sqrt3)^2}` 正答：分子は差全体の平方、分母は和と差の積の公式です。 / 表示=\frac{(2-\sqrt3)^2}{2^2-(\sqrt3)^2}
  - 候補 `\frac{2^2-(\sqrt3)^2}{2^2-(\sqrt3)^2}` 誤答：分子は差どうしの積です。和と差の積ではないので平方差にはなりません。 / 表示=\frac{2^2-(\sqrt3)^2}{2^2-(\sqrt3)^2}
  - 候補 `\frac{(2-\sqrt3)^2}{2^2+(\sqrt3)^2}` 誤答：分母は和と差の積なので、残るのは平方の差です。 / 表示=\frac{(2-\sqrt3)^2}{2^2+(\sqrt3)^2}
  - 候補 `\frac{2-\sqrt3}{2^2-(\sqrt3)^2}` 誤答：分子にも同じ因子を掛けています。分子全体のもう一つの因子を落とさないでください。 / 表示=\frac{2-\sqrt3}{2^2-(\sqrt3)^2}



**達成/依存契約**

`{"classification": "NEW_CONSTRUCTION", "prerequisiteNodeIds": ["n10-13", "n10-14", "n10-q20-factor"], "requiredResultRefs": ["n10-13-result", "n10-14-result", "n10-q20-factor-result"], "terminalRecord": {"id": "n10-20::terminal", "formulas": ["\\frac{2-\\sqrt3}{2+\\sqrt3}=\\frac{(2-\\sqrt3)^2}{4-3}"], "conditions": ["元分母と掛ける因子は非零。"], "prose": "分母と分子を計算できる形へ直せました。まず分母4−3を計算します。", "requiresCorrectKeys": ["rationalisedFractionUX05"], "certifiedFrom": ["n10-13-result", "n10-14-result", "n10-q20-factor-result"], "proseParts": [{"type": "text", "text": "分母と分子を計算できる形へ直せました。まず分母"}, {"type": "math", "latex": "4-3"}, {"type": "text", "text": "を計算します。"}], "conditionParts": [[{"type": "text", "text": "元分母と掛ける因子は非零。"}]]}}`

**既存part対応**

- `n10-20::power` → RETIRE_ARCHIVE_ONLY。同じ因子数の指数を単独採点せず、分数全体の公式適用へ統合。
- `n10-20::denominatorOperation` → RETIRE_ARCHIVE_ONLY。−単独から分数全体の式構成へ対象/候補/操作変更。

初期はinitialRowsのみ。後続結果は全gate成立後。一般公式以外の新part期待値をlead/条件へ書かない。正答は共有rendererで自然式、回答欄/候補は現在式の直後。

原問題/stage/resultId/式番号は固定sourceを継承。prerequisiteNodeIds/requiredResultRefs/terminalRecordは本案の明記値を用いる。

因子・項の交換等の数学的同値を否定しない。指定された式の形を選ぶ問いであり、同値な正答候補は重複掲載しない。

### n10-q21-expand

旧P/Qの4/3は前段resultを参照して再入力しない。旧K=4を符号込み中項の正答へaliasせず、新しい一つの公式適用を問う。

**完成した穴なし解法（初期表示ではない）**

`(2-\sqrt3)^2=2^2-2\times2\times\sqrt3+(\sqrt3)^2=4-4\sqrt3+3`

**初期本文** 分子の差の平方を展開します。二つの平方は前段の確定値を使い、中項を符号込みで作りましょう。

**条件** 既習公式(A−B)²=A²−2AB+B²。2²=4、(√3)²=3はn10-q20-factorで確定済み。

partOrder: signedMiddleTermUX05

**正確な行とgate**

|id|kind/template|partKeys|requiresCorrectKeys|certifiedFrom|
|---|---|---|---|---|
|n10-q21-expand::ux05-middle|math: `(2-\sqrt3)^2=4{signedMiddleTermUX05}+3`|signedMiddleTermUX05||n10-q20-factor-result|

**設問の全契約**

- `n10-q21-expand::signedMiddleTermUX05` NEW / math / expression。問い：既習の差の平方の公式を分子へ適用し、中項全体を符号込みで求めます。。正答：`-4\sqrt3`。
  操作：差平方を新しい二項へ適用し、根号を含む符号込み中項を構成。。旧回答：NEW_UNANSWERED_NO_ALIAS。
  - 候補 `-4\sqrt3` 正答：中項は−2×2×√3=−4√3です。平方4/3は前段の確定値を使います。 / 表示=-4\sqrt3
  - 候補 `-2\sqrt3` 誤答：公式の2ABではA=2です。その2をもう一つ掛けます。 / 表示=-2\sqrt3
  - 候補 `+4\sqrt3` 誤答：差の平方では中項が負です。 / 表示=+4\sqrt3
  - 候補 `-12` 誤答：中項は2と√3の積の倍数です。√3を3へ取り替えません。 / 表示=-12



**達成/依存契約**

`{"classification": "NEW_CONSTRUCTION", "prerequisiteNodeIds": ["n10-20", "n10-q21-denominator", "n10-q11-formula", "n10-q20-factor"], "requiredResultRefs": ["n10-20-result", "n10-q21-denominator-result", "n10-q11-formula-result", "n10-q20-factor-result"], "terminalRecord": {"id": "n10-q21-expand::terminal", "formulas": ["(2-\\sqrt3)^2=4-4\\sqrt3+3"], "conditions": ["A=2、B=√3。(A−B)²の公式を用いて分子(2−√3)²を展開する。"], "prose": "平方の三項が4−4√3+3と求まりました。普通の数の項をまとめます。", "requiresCorrectKeys": ["signedMiddleTermUX05"], "certifiedFrom": ["n10-20-result", "n10-q21-denominator-result", "n10-q11-formula-result", "n10-q20-factor-result"], "proseParts": [{"type": "text", "text": "平方の三項が"}, {"type": "math", "latex": "4-4\\sqrt{3}+3"}, {"type": "text", "text": "と求まりました。普通の数の項をまとめます。"}], "conditionParts": [[{"type": "math", "latex": "A=2"}, {"type": "text", "text": "、"}, {"type": "math", "latex": "B=\\sqrt3"}, {"type": "text", "text": "。"}, {"type": "math", "latex": "(A-B)^2"}, {"type": "text", "text": "の公式を用いて分子"}, {"type": "math", "latex": "(2-\\sqrt3)^2"}, {"type": "text", "text": "を展開する。"}]]}}`

**既存part対応**

- `n10-q21-expand::P` → RETIRE_ARCHIVE_ONLY。平方4は比較nodeへ問いを移したが、問い/前提/順序が異なり旧Pを新keyへaliasしない。ARCHIVE_ONLY。
- `n10-q21-expand::K` → RETIRE_ARCHIVE_ONLY。旧正の係数4と符号込み中項−4√3は非同値。ARCHIVE_ONLY。
- `n10-q21-expand::Q` → RETIRE_ARCHIVE_ONLY。平方3は比較nodeへ問いを移したが、問い/前提/順序が異なり旧Qを新keyへaliasしない。ARCHIVE_ONLY。

初期はinitialRowsのみ。後続結果は全gate成立後。一般公式以外の新part期待値をlead/条件へ書かない。正答は共有rendererで自然式、回答欄/候補は現在式の直後。

原問題/stage/resultId/式番号は固定sourceを継承。prerequisiteNodeIds/requiredResultRefs/terminalRecordは本案の明記値を用いる。

因子・項の交換等の数学的同値を否定しない。指定された式の形を選ぶ問いであり、同値な正答候補は重複掲載しない。

### 全旧part対応

KEEPは同一ID。RETIREは旧版保存のみでaliasなし。

|oldId|action|newId|
|---|---|---|
|n10-q01-square::rootSquare|KEEP|n10-q01-square::rootSquare|
|n10-01::value|KEEP|n10-01::value|
|n10-q02-sign::value|KEEP|n10-q02-sign::value|
|n10-02::candidateSign|KEEP|n10-02::candidateSign|
|n10-02::squareValue|KEEP|n10-02::squareValue|
|n10-02::identificationReason|KEEP|n10-02::identificationReason|
|n10-q03-expand::powerA|KEEP|n10-q03-expand::powerA|
|n10-q03-expand::powerB|KEEP|n10-q03-expand::powerB|
|n10-03::aValue|KEEP|n10-03::aValue|
|n10-03::bValue|KEEP|n10-03::bValue|
|n10-q04-sign::relation|KEEP|n10-q04-sign::relation|
|n10-04::rootReason|KEEP|n10-04::rootReason|
|n10-q05-denominator::relation|KEEP|n10-q05-denominator::relation|
|n10-q05-square::numPower|KEEP|n10-q05-square::numPower|
|n10-q05-square::denPower|KEEP|n10-q05-square::denPower|
|n10-05::numerator|KEEP|n10-05::numerator|
|n10-05::denominator|KEEP|n10-05::denominator|
|n10-q06-sign::relation|KEEP|n10-q06-sign::relation|
|n10-06::quotientReason|KEEP|n10-06::quotientReason|
|n10-q07-product::insideOperation|KEEP|n10-q07-product::insideOperation|
|n10-q07-product::inside|KEEP|n10-q07-product::inside|
|n10-07::squareFactor|KEEP|n10-07::squareFactor|
|n10-07::factor|KEEP|n10-07::factor|
|n10-q08-factor::coefficient|KEEP|n10-q08-factor::coefficient|
|n10-q09-left::squareFactor|KEEP|n10-q09-left::squareFactor|
|n10-q09-left::coefficient|KEEP|n10-q09-left::coefficient|
|n10-q09-right::squareFactor|KEEP|n10-q09-right::squareFactor|
|n10-q09-right::coefficient|KEEP|n10-q09-right::coefficient|
|n10-q10-coefficients::coefficient|KEEP|n10-q10-coefficients::coefficient|
|n10-q11-formula::middleSign|RETIRE_ARCHIVE_ONLY|なし|
|n10-11::leftSquare|KEEP|n10-11::leftSquare|
|n10-11::rightSquare|KEEP|n10-11::rightSquare|
|n10-q12-product::inside|KEEP|n10-q12-product::inside|
|n10-12::constant|KEEP|n10-12::constant|
|n10-q13-identity::operation|RETIRE_ARCHIVE_ONLY|なし|
|n10-13::left|KEEP|n10-13::left|
|n10-13::right|KEEP|n10-13::right|
|n10-13::difference|KEEP|n10-13::difference|
|n10-14::operation|KEEP|n10-14::operation|
|n10-q15-factor::factor|KEEP|n10-q15-factor::factor|
|n10-15::numerator|KEEP|n10-15::numerator|
|n10-q16-denominator::square|KEEP|n10-q16-denominator::square|
|n10-q16-denominator::denominator|KEEP|n10-q16-denominator::denominator|
|n10-q17-factor::factor|KEEP|n10-q17-factor::factor|
|n10-q17-nonzero::relation|KEEP|n10-q17-nonzero::relation|
|n10-17::productOperation|RETIRE_ARCHIVE_ONLY|なし|
|n10-18::A|KEEP|n10-18::A|
|n10-18::B|KEEP|n10-18::B|
|n10-18::C|KEEP|n10-18::C|
|n10-q19-distribute::secondOperand|RETIRE_ARCHIVE_ONLY|なし|
|n10-q19-distribute::productSign|RETIRE_ARCHIVE_ONLY|なし|
|n10-19::left|RETIRE_ARCHIVE_ONLY|なし|
|n10-19::inside|KEEP|n10-19::inside|
|n10-q20-factor::factor|KEEP|n10-q20-factor::factor|
|n10-q20-factor::factorSign|KEEP|n10-q20-factor::factorSign|
|n10-q20-factor::reason|KEEP|n10-q20-factor::reason|
|n10-20::power|RETIRE_ARCHIVE_ONLY|なし|
|n10-20::denominatorOperation|RETIRE_ARCHIVE_ONLY|なし|
|n10-q21-denominator::D|KEEP|n10-q21-denominator::D|
|n10-q21-expand::P|RETIRE_ARCHIVE_ONLY|なし|
|n10-q21-expand::K|RETIRE_ARCHIVE_ONLY|なし|
|n10-q21-expand::Q|RETIRE_ARCHIVE_ONLY|なし|
|n10-q21-constants::C|KEEP|n10-q21-constants::C|

### 集計（穴数は結果）

{"allNodes": 45, "changedNodes": 9, "keptNodes": 36, "baselineParts": 63, "keepParts": 52, "retiredParts": 11, "newParts": 8, "proposedParts": 60}

実装承認/正常フォント実画像/移行QAは未実施。本案の構造と数学の非作者審査を依頼する。


## 共通表示の具体的修正

### 正答した穴を通常の数式へ戻す

対象はN09/N10の数学行内の直接slot。同型経路は現基準で94行/106slot出現だが、これは静的inventoryであり全件の画像破綻実見数ではない。text slot・mirror・回答後に消える足場と分けて扱う。

| 状態 | 数式の出力 | 操作・寸法の契約 |
|---|---|---|
| 未回答 | 未確定slot。後続の答えは出さない | 有効な操作域44px以上、全候補からの中立予約。keyboard/誤答gate維持。 |
| 誤答 | 選択値と対応する説明。未確定のまま | 正答を使って幅を計画しない。同じ未確定状態で予約を保持。 |
| 正答済みのpart | 確定した候補を閉じたASTの通常数式として出す | 操作button/透明span/44pxphantomを残さない。＋/−/関係記号のTeX種別、単項符号、根号/分数/累乗の束縛を保つ。 |
| 一行で正答と未回答が混在 | 正答部分は自然な文字、未回答部分だけslot | node全体を早期readonlyにしない。未回答の操作を消さない。 |
| 完了/履歴/旧版比較 | 通常の数学組版 | 原教材/原回答は保管し、採点・時刻・回数を変えない。 |

`compileNestedMathTemplate`は、certifiedの候補存在/値/参照の証明を通した後、interactiveでも通常の確定subtreeを出力する。確定値を操作slot一覧から除き、`resolvedParts`等の表示根拠metadata（key/path/value）で未回答slotと区別する。正答の無い値や任意の未証明mirrorを確定扱いにしない。閉じた数式文法、trust:false、候補allowlist、root relation markerを維持する。

確定した式には自然な演算子間隔を使う。単に＋をmordの箱へ押し込み、見た目だけ枠を消す方法は採用しない。受入基準の例は、正答後の`(x-4)(x+4)=0`が同じfontの通常描画と同じ括弧高さ/内部間隔になること。44pxは未回答の操作域へ適用し、確定した＋や指数2の文字寸法へ適用しない。

### group計画を公開状態へ追従させる

`NeutralNestedGroupRow`へ、すでに公開・正答認定された`values`/`certifiedKeys`を渡せるようにする。未解放row/未認定partの答えは入力しない。`NodeRows`は可視row・正答状態・group幅・実fontから計画する。通常表示と履歴で同じ出所のrender/planner契約を使う。

- 未回答partは従来どおり全候補中立幅、確定partは選択された通常式の幅で計測する。mirrorは参照元の正答が証明された場合だけ自然式へする。
- 正答公開時にはgroupを再計画してよい。旧「正答後も全候補の中立frame固定」を、未回答/誤答中の安定性と混同しない。根号や分数の内部を勝手に分断しない。
- cache/signatureには可視rowと認定済み値・certified集合・width/fontを含める。同じwidth/fontでも正答状態が変われば再計画する。
- 多項式変形/因数分解/論理/別の補助量は意味groupを分ける。補助量から本体へ戻るときは完全な左辺または明確な数学対象を示し、偽の等式鎖を作らない。
- slot/control必須の検査は未確定slotに適用する。確定部の正しい通常表示の検査を追加し、単に検査対象から消して合格にしない。
- DOM計測のWeakMap登録・本体compilerへの出所検証を維持する。別bundleの近似DOMを本体の証拠と呼ばない。

### 複数条件を一つの判断として答える表示

零積や相殺項の組など、意味上ひとまとまりの回答は一つの選択肢/buttonで扱う。320pxで長い式全体を一つの巨大slotへ押し込まない。単元別案の指定に従い、条件の接続語・二項の境界で行を分ける。

零条件や相殺交差項の組など、必要な候補に限って表示専用`mathLines?: string[]`を追加できる。各lineは閉じたLaTeX、`value`は一つ、`display`は全条件の読み上げ用ラベル、各lineを同じ候補button内で縦に描画する。複数buttonへ分割して別問にはしない。純粋なmeaning型のenumを採点値とし、数式表示を別に持つ場合も型を明記する。`mathLines`は入力値の意味や誤答フィードバックを変えるフィールドではない。

画面の足場がtext行の場合も、正答後は足場を消して具体的な条件を通常のmath行へ置換する。未回答の条件を先に完成印字し「または」だけ問う形へ戻さない。複数条件の順序交換が同値であることは設問・候補・説明に明示し、同じ正答の順序違いを誤答候補にしない。

## 旧回答・新版・保存の具体契約

| 項目 | 本案の処理 |
|---|---|
| 新revision | N09r6→r7、N10r4→r5。unit/node/resultの同一性は保ち、対象partだけを個別対応する。 |
| 不変snapshot | 現N09 compiled470fを`n09ConstructionCompiledR6.json`、現N10 compiled3cfeを`n10ConstructionCompiledR4.json`へ保存する。既存R5/R4/R3・N10 pilotR4別hashもそのまま保管。 |
| KEEP | 単元別表で同じ対象・学習行為・問い・型・正答・全候補・数学上の対象条件を維持すると指定したpartだけ。前提node・解放gateは単元別新版の指定で再評価する。文言だけの整備も個別に意味一致を審査し、数値一致を十分条件にしない。 |
| RETIRE | 現行達成数の分母から外すが、元のsource/hashに結び付けた旧記録/履歴を保存。現行へ原recordをコピーしない。 |
| NEW | 新key/id、未回答から開始。旧or→零条件全体、旧符号→中項全体、後段平方→前段初回平方等は同値の数値/語でも継承しない。 |
| 旧回答が未来の段階にある場合 | recordを保持しても、新しい前提を飛ばしてdraftや親完了へ復活させない。最初の未解決の新判断から再開。 |
| 保管単位 | 旧revision番号だけでなくunit/compiledHash/source bindingで識別する。archive内の余分な旧partを現行ledgerへ残してparseを壊さない。 |

N09の公開r5→既存r6→r7、旧r4→r5→r6→r7は、各段の実snapshotと検証済みadapterを使う。N10旧r3→既存fullr4→r5、pilot r4別hash→fullr4→r5も同じ。legacy r2由来の7件は、そのときの原design/analysisとr3 snapshotを使う既存の鎖を保護する。新designで旧`priorReviewedDesignRaw`を上書きしない。

new edgeはsource/targetの正確なhashとfrom/to revisionのallowlistで登録する。未知のnative main/hashを、古い版や空の新版へ黙って丸めない。復元済みの正当な現行記録と無関係な古いarchiveは、保存したままにする。

専用keyとmain-onlyの両方がある場合、同一hashの新しいreset markerを優先し、そのreset後の回答も含めたledger全体を保持する。新resetを見つけたからと空ledgerに置き換えない。古い完了回答をreset後へ復活させない。改訂後のresetは現在単元の現在版だけ。取消は無変更、他unit/保管版を巻き込まない。

firstValue・選択回数・初回/最終時刻・過去event IDを保つ。新しい正答イベントを作らず、旧親が完了済みでも新partが必要なら完了と数えない。既に受けた旧回答を、新しい問いの初回正答率の加点へ偽装しない。表示専用のcompact化だけでは採点値/保存を一切変えない。

## Expected Affected Areas / 実装順

| 領域 | 変更の役割 |
|---|---|
| `work/items/W-MATH-043-n0910-restart/NODE_DESIGN.json` | 本案の新学習契約をsource-boundで記述。元Word/原問題/図のbindingを維持。 |
| `tools/textbook/transformation/nested-lesson.mjs` / `apply-n0910-construction.mjs` | reviewed design pinと新版生成。全生成物が同じ設計から再現できることを確認。 |
| `src/data/textbook/math/numbers/` のcompiled/pins/revision/lesson | N09r7/N10r5を登録し、現在版/過去版snapshotを不変保管。 |
| `src/domain/textbookSchema.ts`、`nestedMigration.ts`、`nestedLessonStorage.ts`、revision/archive pageとroute | 新版・明示対応・厳密hash鎖・main/reset/旧版隔離の保護。必要なパスだけ変更。 |
| `nestedMathTemplate.ts` / `NestedConstructionMath.tsx` / `nestedMathGeometry.ts` / `ConstructionLessonReadingFlow.tsx` | 正答後の自然AST出力、未確定44px操作との分離、認定状態でのgroup再計画、必要な複数条件候補の表示。 |
| `nestedLesson.ts` 等のchoice型/公開projection | 使用する場合だけmathLines表示フィールドをwhitelist。expected/正答印/誤答説明の先出しをしない。 |
| 既存compiler/renderer/geometry/unit/migration/bridge/archive/generator検査 | 今回の実欠陥と学習単位/保存に対応する意味のある回帰。旧数値だけの期待更新で不具合を消さない。 |

共有rendererの直接利用先はN09/N10のconstruction readerと関連tools/tests。N08は同じrendererを直接使わないが、表示基準・共通header/resetと既存版routeを影響確認する。共有static compilerを使う変換toolも生成/grammarを検査する。他教材の設問を無断で変更しない。

## Risks

| リスク | 防止・確認 |
|---|---|
| 穴を減らす反動で主判断までAUTOになる | 完成解法の主要推論と生徒回答を対応させる。各rowの「提示/新判断/確定結果」を審査する。 |
| 高校生だから計算は不要と決めつける | §53の必要計算比較、新しい公式の初回適用と転移、非零/正性/定義域を保護する。 |
| 条件の組が単なるor当て/因子の写しになる | 二因子の零条件全体を作る契約と誤答候補を審査し、未知法則の説明と具体適用を区別する。 |
| 受理済みの正答が新版の別意味へ移る | 全旧partのKEEP/RETIRE/NEW対応を検査。旧or/P/Q/K等は新意味へaliasしない。 |
| compact化で未回答のhit域/根号/分数が壊れる | 混在状態、正答後の通常数式との比較、未回答44px/衝突/axisを別々に測定する。 |
| plannerが未回答正答値を知って先出しする | 正答済み値だけを状態入力にし、未回答は全候補中立予約。cacheと可視rowに状態を結び付ける。 |
| 画面が正答後も昔の幅/改行を保持する | 正答状態で再計画し、自然な括弧・根号・指数・分数の高さと余白を通常描画と比較する。 |
| 有効な旧試験/承認を全部やり直す | 対象SHAと変更依存を記録し、未変更の有効結果を継承。未解決/新変更のある部分だけ必要に再検査。 |

## Verification Plan

1. **具体案の非作者審査**：N09作者A/N10作者B、相互に相手の数学・主判断・選択肢・誤答説明・先出し・移行を審査。rootの共通renderer/migration/統合も審査対象にする。全86nodeの一致、旧全partの処遇、新keyと解放を構造照合する。これは製品試験ではない。
2. **本案の明示承認**：[main WORK_SYSTEM§11](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/6bc54447ef015a2a579a56a5966ceb58a0600d3a/governance/WORK_SYSTEM.md#L246)の「The revised proposal must be shown before implementation.」に従う。今回の「修正方案を作れ」はこの具体案の作成指示であり、まだ提示していなかった設問やrenderer契約の承認に転用しない。
3. **代表の実装**：承認後、写真のN09負数の平方→全解と、その自然組版に必要な共有rendererを隔離候補へ実装。正答が普通の式へ戻り、主たる零条件生成を生徒が行い、未回答は操作できることを確認する。
4. **代表の実SHA/実画像確認**：[main WORK_SYSTEM§12A](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/6bc54447ef015a2a579a56a5966ceb58a0600d3a/governance/WORK_SYSTEM.md#L291)に従い、固定候補/正確な出所の原画像をGitHub確認票へ結び付け、本人の細部OK/要修正を受ける。未確認の方式を残りへ量産しない。この確認を本案の再承認や全体受入へ読み替えない。
5. **残りの限定適用**：代表の確認後、単元別表のCHANGEだけを適用。KEEPの学習契約と原問題/図を差分比較。意味を変える追加指摘は本案を改訂し、承認を無断拡張しない。
6. **CODE/数学/学習単位**：source-bound生成一致、part/row/候補一意性、先行gate・循環なし・mirror証明・足場消去、型/変更lint/build、関連回帰。完成解法の主判断が生徒回答に残っているかを非作者意味審査する。有限数学のunsupportedは必要な意味審査へ渡し、無条件PASSにしない。
7. **保存/移行**：各既知native revision/hash、legacy r2の7記録、現行・旧版main-only、部分/誤答/全完了、新旧keyとreset marker不整合/後続KEEP済み＋新前提未回答、未知hash拒否を確認。全旧recordの原値/時刻/回数/event、保管記録/他unit保存を照合する。旧版試し解答の保存隔離、reset取消/確定/reloadを実操作する。
8. **表示**：320/390/430/1440pxで初期・全誤答候補・部分正答・全正答・次stage・履歴・旧版の指定範囲を操作。Main/Math-Italic等の実loaded faceとHTTP成功、同じ本体compiler/DOM出所を必須にし、fonts.readyだけのPASSを禁止する。正答済みの括弧/根号/分数/指数/関係記号を通常描画と比較し、未回答の44px・keyboard・衝突/overflow/式番号を別に確認。正答後に自然寸法へ変わることを、旧frame固定検査で誤ってFAILにしない。
9. **G2横断・公開・本人総チェック**：対象86nodeと保管N09/N10native版、保持N08各版/N11、共有toolへの実影響をPASS/FAIL/UNVERIFIEDで記録する。必要なblockerが残れば公開へ進まない。候補manifestを固定し、公開用の具体的差分を別に承認対象にする。認可された実働URLで配信byte/操作を照合後、本人が合意範囲を総チェックする。CODE・画像・公開成功を本人合格/Gold/fitへ転用しない。

最新Storeの欠落26イベントに対するW046継続の本人特例を保持し、旧台帳へ戻って同じ検査/受理を再要求したり、receiptを創作したりしない。全体governanceの既存38件は別Workの同一ERROR集合として記録し、本Work追加0/全体FAILと分ける。今回の具体案作成で全体governanceや製品QAが成功したとは記さない。

## Approval

Status: WAITING
Approved by user: NO
Approval date: —
Approval evidence: 未受領。本人の依頼は本具体案の作成。
Scope: 本書の限定教材改訂・自然組版・保存保護の実装と候補検証。既存の代表細部確認・横断監査・別公開承認・本人総チェックを保持。

## Review History

- Supersedes: UX04の今後の修正内容。UX04の実承認・実装・実行結果は固定commitで履歴として保管する。
- 原因/全86node監査/公式例：record32139fa4、evidence/ux05-feedback。
- 本案の担当・対象hash・初回所見・補修・最終非作者審査は `evidence/ux05-proposal/REVIEW.md` へ保存。
- 同じmodel/履歴共有の2担当であり、盲検・model独立性を主張しない。正式Storeの新受理receiptは作らない。
- User detailed acceptance / final acceptance / Gold / fit: 未成立。


# P-W046-UX-05 N09 完成修正案
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
## 判断の単位
零条件の組は法則を具体的な二因子へ適用する一つの推論。移項・因数分解・零条件・解を一括選択させる全解法丸当てではない。因数分解は独立判断、基本逆演算は必要な途中式。因子順を交換した正しい式を誤答にしない。
## 表示と保存
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
## 全node対応
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

## n09-q01-positive — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-q01-positive

## n09-q01-negative — CHANGE
括弧を含む平方の作用と計算は残し、独立した積の符号小問を減らす。
完成解法：(−4)²=(−4)×(−4)=16。括弧内全体が二つの因子になる。
最初の本文：負の候補も確かめます。括弧と指数に注意しましょう。
条件：["x∈ℝ、x²=16を満たすすべての実数を求める。"]
教える一般則／参照：[]
前提node：["n09-q01-positive"]
前提result：["n09-q01-positive-result"]
### 穴と全選択肢

- n09-q01-negative::powerAction / KEEP / text / 正答 `repeat-whole-base`
  問い：(-4)²で、指数2が指定している操作を選びます。
  回答前提：[]
  全選択肢・誤答理由：基準同IDの厳密契約参照 66c8007b:n09-q01-negative::powerAction

- n09-q01-negative::value / KEEP / math / 正答 `16`
  問い：負の候補を2回掛けた値を計算します。
  回答前提：["powerAction"]
  全選択肢・誤答理由：基準同IDの厳密契約参照 66c8007b:n09-q01-negative::value

### 正確な行・解放条件
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
### 旧新mapping
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

## n09-01 — CHANGE
零条件の式を先に与えてorだけを選ばせる構造を廃止。因数分解と具体的な零条件の組を主判断とする。基本逆演算は途中式に戻す。
完成解法：x²=16 ⇔ x²−16=0 ⇔ x²−4²=0 ⇔ (x−4)(x＋4)=0 ⇔ x−4=0 または x＋4=0 ⇔ x=4 または x=−4。全変形が同値なので全解を尽くす。
最初の本文：候補を確かめるだけでなく、他に解がないことも調べます。
条件：["x∈ℝ。"]
教える一般則／参照：["既習公式：(A-B)(A+B)=A^2-B^2。", "実数の零積の法則：AB=0 ⇔ A=0 または B=0。一方が0なら積は0、どちらも0でなければ積は0にならない。"]
前提node：["n09-q01-negative", "n09-q01-positive"]
前提result：["n09-q01-negative-result", "n09-q01-positive-result"]
### 穴と全選択肢

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

### 正確な行・解放条件
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
### 旧新mapping
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

## n09-definition — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-definition

## n09-q02-root — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-q02-root

## n09-q02-negative-square — CHANGE
1×5と(−1)²の分割をやめ、元の平方の一計算へ統合。旧valueは1×5なので別ID。
完成解法：(−√5)²=(−1)²(√5)²=1×5=5。
最初の本文：平方根の前に負号があるときも、括弧全体の平方を計算します。
条件：["根号は非負の一つの値。√16と(−√5)²を元の順で求める。"]
教える一般則／参照：["(uv)^2=u^2v^2、(√a)^2=a (a≥0)。"]
前提node：["n09-q02-root"]
前提result：["n09-q02-root-result"]
### 穴と全選択肢

- n09-q02-negative-square::signedRootSquareUX05 / NEW / math / 正答 `5`
  問い：負号を含む括弧全体の平方(−√5)²を求めます。
  回答前提：[]
  思考操作：負の平方根の平方を、指数の作用範囲と平方根の定義で計算する。
  - 正答：`5` / 5 / 括弧内全体を二乗するので負号も二乗され、(√5)²=5です。
  - 誤答：`-5` / -5 / 負号を括弧の外へ残していませんか。
  - 誤答：`25` / 25 / 二乗されるのは5ではなく√5です。
  - 誤答：`\sqrt5` / \sqrt5 / 二乗によって元の根号の大きさをそのまま残すのではありません。

### 正確な行・解放条件
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
### 旧新mapping
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

## n09-02 — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-02

## n09-boundary — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-boundary

## n09-q03-inside — CHANGE
初出平方の再入力を参照へ変更し、次nodeの非負の平方根選択は保護する。
完成解法：既に確定した(−4)²=16を使う。√((−4)²)=√16、非負の平方根は次nodeで選ぶ。
最初の本文：確定済みの平方を使い、平方根を調べます。
条件：["実数の範囲で√((−4)²)を求める。根号の中と値は非負。"]
教える一般則／参照：[]
前提node：["n09-boundary", "n09-q01-negative"]
前提result：["n09-boundary-result", "n09-q01-negative-result"]
### 穴と全選択肢

### 正確な行・解放条件
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
### 旧新mapping
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

## n09-03 — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-03

## n09-q04-nonnegative — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-q04-nonnegative

## n09-q04-negative — CHANGE
−aの符号を独立小問にせず、非負の平方根を選ぶ本来の判断と根拠を保持。
完成解法：a<0なので−a>0、(−a)²=a²。よって√a²=−a。
最初の本文：aが負の場合、a²の非負の平方根を選びます。
条件：["a∈ℝ、a<0。"]
教える一般則／参照：["平方根記号√は非負の平方根を表す。"]
前提node：["n09-q04-nonnegative"]
前提result：["n09-q04-nonnegative-result"]
### 穴と全選択肢

- n09-q04-negative::value / KEEP / math / 正答 `-a`
  問い：負のaの平方について、非負の方を選びます。
  回答前提：[]
  全選択肢・誤答理由：基準同IDの厳密契約参照 66c8007b:n09-q04-negative::value

### 正確な行・解放条件
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
### 旧新mapping
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

## n09-04 — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-04

## n09-05 — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-05

## n09-q06-squares — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-q06-squares

## n09-q06-order — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-q06-order

## n09-06 — CHANGE
加える数の写しと0の入力を、必要な差の符号判断へ置換。
完成解法：2<√5の両辺から√5を引くと2−√5<√5−√5=0。
最初の本文：確定済みの比較を使い、差の符号を決めます。
条件：["同じ実数を両辺へ加えても不等号の向きは変わらない。"]
教える一般則／参照：[]
前提node：["n09-05", "n09-q06-order"]
前提result：["n09-05-result", "n09-q06-order-result"]
### 穴と全選択肢

- n09-06::differenceRelationUX05 / NEW / math / 正答 `<`
  問い：確定済みの2と√5の大小から、差2−√5と0の大小を決めます。
  回答前提：[]
  思考操作：大小関係から差の符号を判断し絶対値の場合分けに使う。
  - 正答：`<` / < / 小さい数から大きい数を引くので差は負です。
  - 誤答：`>` / > / 2と√5のどちらが大きいか、確定済みの比較へ戻ってください。
  - 誤答：`=` / = / 二つの数は等しくありません。

### 正確な行・解放条件
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
### 旧新mapping
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

## n09-q07-negation — CHANGE
印刷された式のscope写しを、絶対値の定義の具体適用へ置換。
完成解法：√((2−√5)²)=|2−√5|。中身が負なので|2−√5|=−(2−√5)。
最初の本文：平方の平方根を絶対値へ直し、中身の符号に応じて外します。
条件：["2−√5<0。u<0なら|u|=−u。"]
教える一般則／参照：["|u|はu≥0ならu、u<0なら−u。"]
前提node：["n09-05", "n09-06"]
前提result：["n09-05-result", "n09-06-result"]
### 穴と全選択肢

- n09-q07-negation::absoluteExpressionUX05 / NEW / math / 正答 `-(2-\sqrt5)`
  問い：2−√5<0を使い、絶対値を外します。まだ外側の負号は分配せず、括弧を残した形を選びます。
  回答前提：[]
  思考操作：負と確定した二項式全体へ絶対値の定義を適用する。
  - 正答：`-(2-\sqrt5)` / -(2-\sqrt5) / 負の中身は、全体の符号を反転すると非負になります。
  - 誤答：`2-\sqrt5` / 2-\sqrt5 / 確定済みの中身は負なので、そのままでは絶対値になりません。
  - 誤答：`-2-\sqrt5` / -2-\sqrt5 / 中身全体の符号を反転する必要があります。
  - 誤答：`2+\sqrt5` / 2+\sqrt5 / 二項の和を作る操作ではありません。

### 正確な行・解放条件
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
### 旧新mapping
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

## n09-07 — CHANGE
−1・加数・個々の符号の小問を、負号を分配した式全体の計算へ統合。
完成解法：−(2−√5)=−2＋√5=√5−2。従って√((2−√5)²)=√5−2。
最初の本文：確定した式を整理して、平方の平方根の値を仕上げます。
条件：["2−√5<0。√(u²)=|u|、u<0なら|u|=−u。"]
教える一般則／参照：[]
前提node：["n09-05", "n09-q07-negation", "n09-06"]
前提result：["n09-05-result", "n09-q07-negation-result", "n09-06-result"]
### 穴と全選択肢

- n09-07::expandedExpressionUX05 / NEW / math / 正答 `\sqrt5-2`
  問い：確定した−(2−√5)の括弧を外して整理します。根号を含む項が先の形を選びます。
  回答前提：[]
  思考操作：二項式全体への負号の分配を一つの式として実行する。
  - 正答：`\sqrt5-2` / \sqrt5-2 / 二項とも符号が反転し、−2＋√5=√5−2です。
  - 誤答：`2-\sqrt5` / 2-\sqrt5 / 外側の負号を作用させていません。
  - 誤答：`-2-\sqrt5` / -2-\sqrt5 / 第二項の負号も反転させてください。
  - 誤答：`2+\sqrt5` / 2+\sqrt5 / 第一項2の符号も反転します。

### 正確な行・解放条件
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
### 旧新mapping
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

## n09-decimal-method — CHANGE
後続の中項構成を未知の公式名当てにしない参照説明を補足。数値の計算は後続で保持。
完成解法：1.41=141/100、1.42=142/100。平方の分子を140＋1または140＋2として、和の平方の公式を適用する。
最初の本文：分数に直し、分子の平方を計算する方法を使います。
条件：["1.41=141/100、1.42=142/100。平方の公式(A+B)²=A²+2AB+B²を使う。"]
教える一般則／参照：["(A+B)^2=A^2+AB+BA+B^2=A^2+2AB+B^2。中項は異なる項どうしの積が二つ分。", "(p/q)^2=p^2/q^2 (q≠0)。"]
前提node：["n09-07"]
前提result：["n09-07-result"]
### 穴と全選択肢

### 正確な行・解放条件
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
### 旧新mapping
```json
[]
```
新ID：[]

## n09-p001-q08-left-square — CHANGE
MASTER§53の既存計算3件を厳密保持。公式の具体適用である中項の構成を計算の直前へ置く。
完成解法：1.41²=(141/100)²。(140＋1)²=19600＋280＋1=19881。分母10000で割ると1.9881。
最初の本文：直前の参照公式を、この分子の二項へ適用します。
条件：["候補1.41と1.42は正。√2を挟むため両候補の平方を2と比べる。"]
教える一般則／参照：[]
前提node：["n09-decimal-method"]
前提result：["n09-decimal-method-result"]
### 穴と全選択肢

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

### 正確な行・解放条件
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
### 旧新mapping
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

## n09-p001-q08-right-square — CHANGE
MASTER§53の既存計算3件を厳密保持。公式の具体適用である中項の構成を計算の直前へ置く。
完成解法：1.42²=(142/100)²。(140＋2)²=19600＋560＋4=20164。分母10000で割ると2.0164。
最初の本文：直前の参照公式を、この分子の二項へ適用します。
条件：["候補1.41と1.42は正。√2を挟むため両候補の平方を2と比べる。"]
教える一般則／参照：[]
前提node：["n09-p001-q08-left-square"]
前提result：["n09-p001-q08-left-square-result"]
### 穴と全選択肢

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

### 正確な行・解放条件
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
### 旧新mapping
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

## n09-p001-q08-lower-sign — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-p001-q08-lower-sign

## n09-p001-q08-upper-sign — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-p001-q08-upper-sign

## n09-08 — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-08

## n09-09 — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-09

## n09-parts-target — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-parts-target

## n09-q10-reject-truncation — CHANGE
元の剰余計算を残し、定義により候補を棄却する判断を本人が行う。
完成解法：n=−2ならr=−2.1−(−2)=−2.1＋2=−0.1。0≤r<1に反するのでn=−2は採用できない。
最初の本文：−2.1の整数部分を−2と仮定した候補を検査します。
条件：["残りは0≤r<1でなければならない。"]
教える一般則／参照：["x=n+r、nは整数、0≤r<1。"]
前提node：["n09-parts-target"]
前提result：["n09-parts-target-result"]
### 穴と全選択肢

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

### 正確な行・解放条件
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
### 旧新mapping
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

## n09-10 — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-10

## n09-q11-remainder — CHANGE
負数を引く演算子だけの小問を外し、既存の初出剰余計算は維持。
完成解法：r=−2.1−(−3)=−2.1＋3=0.9。
最初の本文：確定した整数部分n=−3を使い、rを計算します。
条件：["x=−2.1、n=−3、r=x−n、0≤r<1。"]
教える一般則／参照：[]
前提node：["n09-parts-target", "n09-10"]
前提result：["n09-parts-target-result", "n09-10-result"]
### 穴と全選択肢

- n09-q11-remainder::value / KEEP / math / 正答 `0.9`
  問い：残りの値を計算します。
  回答前提：[]
  全選択肢・誤答理由：基準同IDの厳密契約参照 66c8007b:n09-q11-remainder::value

### 正確な行・解放条件
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
### 旧新mapping
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

## n09-11 — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-11

## n09-q12-lower — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-q12-lower

## n09-q12-upper — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-q12-upper

## n09-12 — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-12

## n09-q13-reverse — CHANGE
負数倍した不等号の向きをleadで先答えしない。両境界の向きを決める既存の適用は残す。
完成解法：3<√10<4の各辺を−1倍すると−3>−√10>−4。
最初の本文：確定した比較の各辺を−1倍し、−√10の範囲を表します。
条件：["各辺へ同じ負数−1を掛ける。"]
教える一般則／参照：["負の数を掛けると大小の向きが変わる。一般則を教え、具体的な二境界へ適用する。"]
前提node：["n09-12"]
前提result：["n09-12-result"]
### 穴と全選択肢

- n09-q13-reverse::S1 / KEEP / math / 正答 `>`
  問い：左側の関係を負の乗算後へ移します。
  回答前提：[]
  全選択肢・誤答理由：基準同IDの厳密契約参照 66c8007b:n09-q13-reverse::S1

- n09-q13-reverse::S2 / KEEP / math / 正答 `>`
  問い：右側の関係も負の乗算後へ移します。
  回答前提：["S1"]
  全選択肢・誤答理由：基準同IDの厳密契約参照 66c8007b:n09-q13-reverse::S2

### 正確な行・解放条件
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
### 旧新mapping
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

## n09-13 — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-13

## n09-q14-positive-integer — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-q14-positive-integer

## n09-q14-positive-remainder — CHANGE
演算子一字から、定義に基づく小数部分の式全体へ置換。範囲の確かめは必要な途中式として見せる。
完成解法：r=√10−3、3<√10<4の各辺から3を引くと0<r<1。
最初の本文：既に確定した整数部分を用いて、小数部分を求めます。
条件：["整数部分n∈ℤ、n≤x<n+1、小数部分r=x−n、0≤r<1。対象は√10と−√10。"]
教える一般則／参照：["x=n+r、nは整数、0≤r<1。従ってr=x−n。"]
前提node：["n09-11", "n09-12", "n09-13", "n09-q14-positive-integer"]
前提result：["n09-11-result", "n09-12-result", "n09-13-result", "n09-q14-positive-integer-result"]
### 穴と全選択肢

- n09-q14-positive-remainder::remainderExpressionUX05 / NEW / math / 正答 `\sqrt{10}-3`
  問い：定義r=x−nを使い、確定した整数部分を除いた小数部分の式を選びます。
  回答前提：[]
  思考操作：実数と整数部分の符号を合わせて、剰余の式全体を構成する。
  - 正答：`\sqrt{10}-3` / \sqrt{10}-3 / r=x−nに確定した値を代入した式です。
  - 誤答：`\sqrt{10}+3` / \sqrt{10}+3 / 正の整数部分3は足すのではなく引きます。
  - 誤答：`3-\sqrt{10}` / 3-\sqrt{10} / 引く順序が逆です。小数部分の非負条件も確認してください。
  - 誤答：`\sqrt{10}/3` / \sqrt{10}/3 / 整数部分を除く操作は割り算ではありません。

### 正確な行・解放条件
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
### 旧新mapping
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

## n09-q14-negative-integer — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-q14-negative-integer

## n09-q14-negative-remainder — CHANGE
演算子一字から、定義に基づく小数部分の式全体へ置換。範囲の確かめは必要な途中式として見せる。
完成解法：r=−√10−(−4)=−√10＋4=4−√10。−4<−√10<−3の各辺に4を加えると0<r<1。
最初の本文：既に確定した整数部分を用いて、小数部分を求めます。
条件：["整数部分n∈ℤ、n≤x<n+1、小数部分r=x−n、0≤r<1。対象は√10と−√10。"]
教える一般則／参照：["x=n+r、nは整数、0≤r<1。従ってr=x−n。"]
前提node：["n09-11", "n09-12", "n09-13", "n09-q14-negative-integer"]
前提result：["n09-11-result", "n09-12-result", "n09-13-result", "n09-q14-negative-integer-result"]
### 穴と全選択肢

- n09-q14-negative-remainder::remainderExpressionUX05 / NEW / math / 正答 `4-\sqrt{10}`
  問い：定義r=x−nを使い、確定した整数部分を除いた小数部分の式を選びます。
  回答前提：[]
  思考操作：実数と整数部分の符号を合わせて、剰余の式全体を構成する。
  - 正答：`4-\sqrt{10}` / 4-\sqrt{10} / r=x−nに確定した値を代入した式です。
  - 誤答：`-\sqrt{10}-4` / -\sqrt{10}-4 / 引く整数部分は−4です。−4を引く操作を確かめてください。
  - 誤答：`\sqrt{10}-4` / \sqrt{10}-4 / 対象の実数は−√10です。
  - 誤答：`4+\sqrt{10}` / 4+\sqrt{10} / 対象の−√10の符号を保持してください。

### 正確な行・解放条件
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
### 旧新mapping
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

## n09-14 — KEEP
学習目的と数学対象を保持。定義・参照・必要な初出計算・大小比較・整数部分判断を機械的に減らさない。
基準同nodeのlead・条件・rows・候補・terminal・前提を全保持。参照：66c8007b:n09-14

設計構造の集計のみ。製品コード・新テスト・描画QAは未実施。

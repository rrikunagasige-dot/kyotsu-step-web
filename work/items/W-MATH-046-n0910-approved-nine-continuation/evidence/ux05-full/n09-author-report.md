# UX05 N09 残14node native materialization

元root: w046-ux05-full。AGENTS/工程入口/承認N09_DESIGNを読取。代表2nodeは通常公式表示補修済みの実byte契約を全保持。KEEP25も全object一致。残14CHANGEだけをnative units[0]へ適用。

N09 from7→to8。R7 snapshotはrootが不変保存し、過去履歴のsourceとして使う。公開は別承認。

```json

{
  "nodes": 41,
  "pilotUnchanged": 2,
  "keepNodesUnchanged": 25,
  "changedNodes": 14,
  "oldParts": 48,
  "keepParts": 34,
  "retireParts": 14,
  "newParts": 9,
  "targetParts": 43
}

```

## 変更と意味根拠



### n09-q02-negative-square

1×5と(−1)²の分割をやめ、元の平方の一計算へ統合。旧valueは1×5なので別ID。

完成解法：(−√5)²=(−1)²(√5)²=1×5=5。

初期本文：平方根の前に負号があるときも、括弧全体の平方を計算します。

知識/result前提：["n09-q02-root-result"]

主判断：[{"id": "n09-q02-negative-square::signedRootSquareUX05", "operation": "負の平方根の平方を、指数の作用範囲と平方根の定義で計算する。"}]

具体rows/全候補/誤答理由はn09-unit.jsonの当nodeを正本参照。



### n09-q03-inside

初出平方の再入力を参照へ変更し、次nodeの非負の平方根選択は保護する。

完成解法：既に確定した(−4)²=16を使う。√((−4)²)=√16、非負の平方根は次nodeで選ぶ。

初期本文：確定済みの平方を使い、平方根を調べます。

知識/result前提：["n09-boundary-result", "n09-q01-negative-result"]

主判断：[]

具体rows/全候補/誤答理由はn09-unit.jsonの当nodeを正本参照。



### n09-q04-negative

−aの符号を独立小問にせず、非負の平方根を選ぶ本来の判断と根拠を保持。

完成解法：a<0なので−a>0、(−a)²=a²。よって√a²=−a。

初期本文：aが負の場合、a²の非負の平方根を選びます。

知識/result前提：["n09-q04-nonnegative-result"]

主判断：[{"id": "n09-q04-negative::value", "operation": "負のaの平方について、非負の方を選びます。"}]

具体rows/全候補/誤答理由はn09-unit.jsonの当nodeを正本参照。



### n09-06

加える数の写しと0の入力を、必要な差の符号判断へ置換。

完成解法：2<√5の両辺から√5を引くと2−√5<√5−√5=0。

初期本文：確定済みの比較を使い、差の符号を決めます。

知識/result前提：["n09-05-result", "n09-q06-order-result"]

主判断：[{"id": "n09-06::differenceRelationUX05", "operation": "大小関係から差の符号を判断し絶対値の場合分けに使う。"}]

具体rows/全候補/誤答理由はn09-unit.jsonの当nodeを正本参照。



### n09-q07-negation

印刷された式のscope写しを、絶対値の定義の具体適用へ置換。

完成解法：√((2−√5)²)=|2−√5|。中身が負なので|2−√5|=−(2−√5)。

初期本文：平方の平方根を絶対値へ直し、中身の符号に応じて外します。

知識/result前提：["n09-05-result", "n09-06-result"]

主判断：[{"id": "n09-q07-negation::absoluteExpressionUX05", "operation": "負と確定した二項式全体へ絶対値の定義を適用する。"}]

具体rows/全候補/誤答理由はn09-unit.jsonの当nodeを正本参照。



### n09-07

−1・加数・個々の符号の小問を、負号を分配した式全体の計算へ統合。

完成解法：−(2−√5)=−2＋√5=√5−2。従って√((2−√5)²)=√5−2。

初期本文：確定した式を整理して、平方の平方根の値を仕上げます。

知識/result前提：["n09-05-result", "n09-q07-negation-result", "n09-06-result"]

主判断：[{"id": "n09-07::expandedExpressionUX05", "operation": "二項式全体への負号の分配を一つの式として実行する。"}]

具体rows/全候補/誤答理由はn09-unit.jsonの当nodeを正本参照。



### n09-decimal-method

後続の中項構成を未知の公式名当てにしない参照説明を補足。数値の計算は後続で保持。

完成解法：1.41=141/100、1.42=142/100。平方の分子を140＋1または140＋2として、和の平方の公式を適用する。

初期本文：分数に直し、分子の平方を計算する方法を使います。

知識/result前提：["n09-07-result"]

主判断：[]

具体rows/全候補/誤答理由はn09-unit.jsonの当nodeを正本参照。



### n09-p001-q08-left-square

MASTER§53の既存計算3件を厳密保持。公式の具体適用である中項の構成を計算の直前へ置く。

完成解法：1.41²=(141/100)²。(140＋1)²=19600＋280＋1=19881。分母10000で割ると1.9881。

初期本文：直前の参照公式を、この分子の二項へ適用します。

知識/result前提：["n09-decimal-method-result"]

主判断：[{"id": "n09-p001-q08-left-square::middleTermUX05", "operation": "和の平方の中項を二つの項から具体的に構成する。既存の積・和・小数化は別に保持する。"}, {"id": "n09-p001-q08-left-square::L1", "operation": "指定した演算の結果を計算する"}, {"id": "n09-p001-q08-left-square::L2", "operation": "指定した演算の結果を計算する"}, {"id": "n09-p001-q08-left-square::L3", "operation": "指定した演算の結果を計算する"}]

具体rows/全候補/誤答理由はn09-unit.jsonの当nodeを正本参照。



### n09-p001-q08-right-square

MASTER§53の既存計算3件を厳密保持。公式の具体適用である中項の構成を計算の直前へ置く。

完成解法：1.42²=(142/100)²。(140＋2)²=19600＋560＋4=20164。分母10000で割ると2.0164。

初期本文：直前の参照公式を、この分子の二項へ適用します。

知識/result前提：["n09-p001-q08-left-square-result"]

主判断：[{"id": "n09-p001-q08-right-square::middleTermUX05", "operation": "和の平方の中項を二つの項から具体的に構成する。既存の積・和・小数化は別に保持する。"}, {"id": "n09-p001-q08-right-square::R1", "operation": "指定した演算の結果を計算する"}, {"id": "n09-p001-q08-right-square::R2", "operation": "指定した演算の結果を計算する"}, {"id": "n09-p001-q08-right-square::R3", "operation": "指定した演算の結果を計算する"}]

具体rows/全候補/誤答理由はn09-unit.jsonの当nodeを正本参照。



### n09-q10-reject-truncation

元の剰余計算を残し、定義により候補を棄却する判断を本人が行う。

完成解法：n=−2ならr=−2.1−(−2)=−2.1＋2=−0.1。0≤r<1に反するのでn=−2は採用できない。

初期本文：−2.1の整数部分を−2と仮定した候補を検査します。

知識/result前提：["n09-parts-target-result"]

主判断：[{"id": "n09-q10-reject-truncation::value", "operation": "指定した演算の結果を計算する"}, {"id": "n09-q10-reject-truncation::candidateValidityUX05", "operation": "候補を整数部分・小数部分の定義に照らして棄却する。"}]

具体rows/全候補/誤答理由はn09-unit.jsonの当nodeを正本参照。



### n09-q11-remainder

負数を引く演算子だけの小問を外し、既存の初出剰余計算は維持。

完成解法：r=−2.1−(−3)=−2.1＋3=0.9。

初期本文：確定した整数部分n=−3を使い、rを計算します。

知識/result前提：["n09-parts-target-result", "n09-10-result"]

主判断：[{"id": "n09-q11-remainder::value", "operation": "指定した演算の結果を計算する"}]

具体rows/全候補/誤答理由はn09-unit.jsonの当nodeを正本参照。



### n09-q13-reverse

負数倍した不等号の向きをleadで先答えしない。両境界の向きを決める既存の適用は残す。

完成解法：3<√10<4の各辺を−1倍すると−3>−√10>−4。

初期本文：確定した比較の各辺を−1倍し、−√10の範囲を表します。

知識/result前提：["n09-12-result"]

主判断：[{"id": "n09-q13-reverse::S1", "operation": "左側の関係を負の乗算後へ移します。"}, {"id": "n09-q13-reverse::S2", "operation": "右側の関係も負の乗算後へ移します。"}]

具体rows/全候補/誤答理由はn09-unit.jsonの当nodeを正本参照。



### n09-q14-positive-remainder

演算子一字から、定義に基づく小数部分の式全体へ置換。範囲の確かめは必要な途中式として見せる。

完成解法：r=√10−3、3<√10<4の各辺から3を引くと0<r<1。

初期本文：既に確定した整数部分を用いて、小数部分を求めます。

知識/result前提：["n09-11-result", "n09-12-result", "n09-13-result", "n09-q14-positive-integer-result"]

主判断：[{"id": "n09-q14-positive-remainder::remainderExpressionUX05", "operation": "実数と整数部分の符号を合わせて、剰余の式全体を構成する。"}]

具体rows/全候補/誤答理由はn09-unit.jsonの当nodeを正本参照。



### n09-q14-negative-remainder

演算子一字から、定義に基づく小数部分の式全体へ置換。範囲の確かめは必要な途中式として見せる。

完成解法：r=−√10−(−4)=−√10＋4=4−√10。−4<−√10<−3の各辺に4を加えると0<r<1。

初期本文：既に確定した整数部分を用いて、小数部分を求めます。

知識/result前提：["n09-11-result", "n09-12-result", "n09-13-result", "n09-q14-negative-integer-result"]

主判断：[{"id": "n09-q14-negative-remainder::remainderExpressionUX05", "operation": "実数と整数部分の符号を合わせて、剰余の式全体を構成する。"}]

具体rows/全候補/誤答理由はn09-unit.jsonの当nodeを正本参照。



## 保存・原資料・表示の境界

R7の48part全件をキーとnative契約で照合し34KEEP/14RETIREを確定、9NEWは未回答・aliasなし。KEEP34のpart objectは元R7と厳密一致。pilotのfactorisedFormUX05/factorZeroConditionUX05もKEEPへ含む。

sourcePath/sourceSha256/sourceBaseCommit、原Word対応sourceBlockId/sourceMeaning/sourcePhase、extra/図の原データを保持。変更nodeのsourceCoverage.targetRefsだけを新行へ再対応。Q08補助表は既存のn09-08完了後gateを保持し、認定part数に依存する古い理由文だけ修正。

一般公式はmath型と説明textへ明示し、raw TeXを本文へ置かない。新しいdifferenceRelationUX05のnative roleはrelationとし、既存compilerが不等号軸を認識する型へ束縛（設問/値/候補は同じ）。Q08は整数平方の式から継続=を使い、小数平方へ戻る行は完全左辺を持つ。mirrorは同nodeのL1/L2またはR1/R2が認定済みの行だけ。q03の既認定16参照は明示result/prerequisiteを追加し、他nodeの値をmirrorに偽装しない。

Q08 L1/L2/L3/R1/R2/R3の全数学契約objectを保持し、比較C/D・root境界node等KEEP25は全object一致。

これは私が作者の候補であり独立数学PASSを主張しない。B非作者の原資料/数学/先出し/型/主語とroot統合審査を受ける。

## R7全part対応

```json

[
  {
    "oldPartId": "n09-q01-negative::powerAction",
    "decision": "KEEP",
    "newPartId": "n09-q01-negative::powerAction",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-q01-negative::value",
    "decision": "KEEP",
    "newPartId": "n09-q01-negative::value",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-01::factorisedFormUX05",
    "decision": "KEEP",
    "newPartId": "n09-01::factorisedFormUX05",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-01::factorZeroConditionUX05",
    "decision": "KEEP",
    "newPartId": "n09-01::factorZeroConditionUX05",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-q02-root::value",
    "decision": "KEEP",
    "newPartId": "n09-q02-root::value",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-q02-negative-square::signFactor",
    "decision": "RETIRE",
    "newPartId": null,
    "meaning": "旧R7snapshot/出所付きarchiveへ原recordを保管。新しい意味へaliasしない。"
  },
  {
    "oldPartId": "n09-q02-negative-square::value",
    "decision": "RETIRE",
    "newPartId": null,
    "meaning": "旧R7snapshot/出所付きarchiveへ原recordを保管。新しい意味へaliasしない。"
  },
  {
    "oldPartId": "n09-q03-inside::value",
    "decision": "RETIRE",
    "newPartId": null,
    "meaning": "旧R7snapshot/出所付きarchiveへ原recordを保管。新しい意味へaliasしない。"
  },
  {
    "oldPartId": "n09-03::value",
    "decision": "KEEP",
    "newPartId": "n09-03::value",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-q04-nonnegative::value",
    "decision": "KEEP",
    "newPartId": "n09-q04-nonnegative::value",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-q04-negative::oppositeSign",
    "decision": "RETIRE",
    "newPartId": null,
    "meaning": "旧R7snapshot/出所付きarchiveへ原recordを保管。新しい意味へaliasしない。"
  },
  {
    "oldPartId": "n09-q04-negative::value",
    "decision": "KEEP",
    "newPartId": "n09-q04-negative::value",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-05::value",
    "decision": "KEEP",
    "newPartId": "n09-05::value",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-q06-squares::value",
    "decision": "KEEP",
    "newPartId": "n09-q06-squares::value",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-q06-order::relation",
    "decision": "KEEP",
    "newPartId": "n09-q06-order::relation",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-06::addend",
    "decision": "RETIRE",
    "newPartId": null,
    "meaning": "旧R7snapshot/出所付きarchiveへ原recordを保管。新しい意味へaliasしない。"
  },
  {
    "oldPartId": "n09-06::zero",
    "decision": "RETIRE",
    "newPartId": null,
    "meaning": "旧R7snapshot/出所付きarchiveへ原recordを保管。新しい意味へaliasしない。"
  },
  {
    "oldPartId": "n09-q07-negation::scope",
    "decision": "RETIRE",
    "newPartId": null,
    "meaning": "旧R7snapshot/出所付きarchiveへ原recordを保管。新しい意味へaliasしない。"
  },
  {
    "oldPartId": "n09-07::outsideFactor",
    "decision": "RETIRE",
    "newPartId": null,
    "meaning": "旧R7snapshot/出所付きarchiveへ原recordを保管。新しい意味へaliasしない。"
  },
  {
    "oldPartId": "n09-07::secondOperand",
    "decision": "RETIRE",
    "newPartId": null,
    "meaning": "旧R7snapshot/出所付きarchiveへ原recordを保管。新しい意味へaliasしない。"
  },
  {
    "oldPartId": "n09-07::left",
    "decision": "RETIRE",
    "newPartId": null,
    "meaning": "旧R7snapshot/出所付きarchiveへ原recordを保管。新しい意味へaliasしない。"
  },
  {
    "oldPartId": "n09-07::sign",
    "decision": "RETIRE",
    "newPartId": null,
    "meaning": "旧R7snapshot/出所付きarchiveへ原recordを保管。新しい意味へaliasしない。"
  },
  {
    "oldPartId": "n09-p001-q08-left-square::L1",
    "decision": "KEEP",
    "newPartId": "n09-p001-q08-left-square::L1",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-p001-q08-left-square::L2",
    "decision": "KEEP",
    "newPartId": "n09-p001-q08-left-square::L2",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-p001-q08-left-square::L3",
    "decision": "KEEP",
    "newPartId": "n09-p001-q08-left-square::L3",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-p001-q08-right-square::R1",
    "decision": "KEEP",
    "newPartId": "n09-p001-q08-right-square::R1",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-p001-q08-right-square::R2",
    "decision": "KEEP",
    "newPartId": "n09-p001-q08-right-square::R2",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-p001-q08-right-square::R3",
    "decision": "KEEP",
    "newPartId": "n09-p001-q08-right-square::R3",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-p001-q08-lower-sign::C",
    "decision": "KEEP",
    "newPartId": "n09-p001-q08-lower-sign::C",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-p001-q08-upper-sign::D",
    "decision": "KEEP",
    "newPartId": "n09-p001-q08-upper-sign::D",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-09::lowerRelation",
    "decision": "KEEP",
    "newPartId": "n09-09::lowerRelation",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-09::upperRelation",
    "decision": "KEEP",
    "newPartId": "n09-09::upperRelation",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-q10-reject-truncation::value",
    "decision": "KEEP",
    "newPartId": "n09-q10-reject-truncation::value",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-10::n",
    "decision": "KEEP",
    "newPartId": "n09-10::n",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-q11-remainder::sign",
    "decision": "RETIRE",
    "newPartId": null,
    "meaning": "旧R7snapshot/出所付きarchiveへ原recordを保管。新しい意味へaliasしない。"
  },
  {
    "oldPartId": "n09-q11-remainder::value",
    "decision": "KEEP",
    "newPartId": "n09-q11-remainder::value",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-q12-lower::value",
    "decision": "KEEP",
    "newPartId": "n09-q12-lower::value",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-q12-upper::value",
    "decision": "KEEP",
    "newPartId": "n09-q12-upper::value",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-12::lower",
    "decision": "KEEP",
    "newPartId": "n09-12::lower",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-12::upper",
    "decision": "KEEP",
    "newPartId": "n09-12::upper",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-q13-reverse::S1",
    "decision": "KEEP",
    "newPartId": "n09-q13-reverse::S1",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-q13-reverse::S2",
    "decision": "KEEP",
    "newPartId": "n09-q13-reverse::S2",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-13::left",
    "decision": "KEEP",
    "newPartId": "n09-13::left",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-13::right",
    "decision": "KEEP",
    "newPartId": "n09-13::right",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-q14-positive-integer::value",
    "decision": "KEEP",
    "newPartId": "n09-q14-positive-integer::value",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-q14-positive-remainder::remainderOperation",
    "decision": "RETIRE",
    "newPartId": null,
    "meaning": "旧R7snapshot/出所付きarchiveへ原recordを保管。新しい意味へaliasしない。"
  },
  {
    "oldPartId": "n09-q14-negative-integer::value",
    "decision": "KEEP",
    "newPartId": "n09-q14-negative-integer::value",
    "meaning": "同じ型/問い/全候補/正答/根拠の対象。新版未解決gateより先では保留。"
  },
  {
    "oldPartId": "n09-q14-negative-remainder::sign",
    "decision": "RETIRE",
    "newPartId": null,
    "meaning": "旧R7snapshot/出所付きarchiveへ原recordを保管。新しい意味へaliasしない。"
  }
]

```

NEW：["n09-q02-negative-square::signedRootSquareUX05", "n09-06::differenceRelationUX05", "n09-q07-negation::absoluteExpressionUX05", "n09-07::expandedExpressionUX05", "n09-p001-q08-left-square::middleTermUX05", "n09-p001-q08-right-square::middleTermUX05", "n09-q10-reject-truncation::candidateValidityUX05", "n09-q14-positive-remainder::remainderExpressionUX05", "n09-q14-negative-remainder::remainderExpressionUX05"]

unit SHA256 d3399d5ab2a376c7fa3593fdd1743fa31fcdc8276298fc60a9fa744378d497ef

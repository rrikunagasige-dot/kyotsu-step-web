# MATH PRACTICE 87–120 STRUCTURE MAP
## 4STEP原本準拠・実装前の論理設計図

Status: DESIGN AUTHORITY BEFORE IMPLEMENTATION

Source basis:
- 『改訂版 教科書傍用 4STEP数学 1+A』
- 対象: 問題87〜120
- 原本の問題文・小問構成・順序を維持する
- 118〜120は原本では第3章「2次関数」冒頭だが、アプリではユーザー指定により3テーマのいずれかへ分類する

Mandatory companion:
- docs/MATH_PRACTICE_MASTER_LESSONS.md

Hard rule:
- ここではまだ実装しない
- 先に論理構造を固定する
- current subproblem only + required previous results
- previous resultは本当に必要な時だけimportする
- 文章・穴・UIはこの構造図の後に作る

---

# 0. Theme classification

## 集合を整理する
87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97

## 条件から命題を読む
98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 109, 118, 119, 120

## 命題を証明する
108, 110, 111, 112, 113, 114, 115, 116, 117

---

# 1. Structure type legend

- **I: Independent subproblems**
  - 各小問が独立
  - 過去result link不要

- **C: Common prerequisite + independent branches**
  - 共通の準備resultを作り、各小問がそれを使う

- **L: Linear dependency**
  - 前stage結果が次stageに必要
  - compact result linkで受け渡す

- **G: Graph dependency**
  - 複数stage間で選択的にresultを再利用

- **P: Proof chain**
  - 仮定 → 方針 → 導出 → 結論
  - 証明の戦略自体をthinking nodeにする

- **X: Cross-problem dependency**
  - 前問題で証明した性質を次問題が使う

---

# 2. 集合を整理する

## 87 — 素数と集合
Type: C + I
Status: USER-APPROVED / IMPLEMENTED

Goal:
集合Aの条件を読み、2, 15, 21, 29がAに属するか判断する。

Stages:
- S0: Aに入る条件を確認
- S1: 2
- S2: 15
- S3: 21
- S4: 29

depends_on:
- S1〜S4はS0の定義理解のみ
- 数値間の依存なし

result node:
- 各membership判定は次stageへimportしない

feeds:
- なし

Hole focus:
- 条件理解
- 素数判定
- membership interpretation

UI note:
- S1に入ったらS0長文は圧縮
- 2を終えたら15だけ表示
- false dependency linkを作らない

---

## 88 — 集合を要素で表す
Type: I

Goal:
条件で定義された集合を、要素を列挙する形へ変換する。

Subproblems:
- (1) 36の正の約数
- (2) 100以下の正の奇数
- (3) -3≤x<4 の整数
- (4) 3n-2, n=1,2,3,...

各小問stage:
- target条件を読む
- 候補生成ルールを決める
- 境界・順序を確認
- 要素列挙
- 最終集合

depends_on:
- 小問間の依存なし

result node:
- 各集合結果は次小問へimportしない

Hole focus:
- 条件→具体要素への変換
- 境界条件
- 一般項から初項列生成

Risk:
- (4)を有限集合のように終わらせない
- 「…」の意味を明確にする

---

## 89 — 部分集合
Type: C + I

Goal:
B,C,D,EのうちAの部分集合を判定する。

Common prerequisite:
- A={2,4,6,8,10}

Stages:
- S0: Aを具体化
- S1: B⊆A?
- S2: C⊆A?
- S3: D⊆A?
- S4: E⊆A?

depends_on:
- S1〜S4 → S0
- 候補同士は独立

result node:
- S0のAのみ再利用可能
- 各candidate判定は次candidateへimport不要

Hole focus:
- 「すべての要素がAに入る」が部分集合条件
- 1つでも外れれば部分集合でない

---

## 90 — 集合の包含・一致
Type: I

Goal:
2集合を具体化し、⊂または=で関係を表す。

Subproblems:
- (1)
- (2)

各小問stage:
- Aを列挙
- Bを列挙
- 要素比較
- A⊂B / B⊂A / A=B を決定

depends_on:
- (1),(2)独立

result node:
- なし

Hole focus:
- 集合生成
- 双方向包含の確認
- 「同じ要素なら=」

---

## 91 — 部分集合をすべて求める
Type: I

Goal:
与えられた有限集合の部分集合を漏れなく列挙する。

Subproblems:
- (1) {a,b}
- (2) {1,2,3,4}

各小問stage:
- 要素数確認
- 空集合を含むことを確認
- 要素数0個/1個/2個/...で整理
- 重複・漏れ確認
- 一覧完成

depends_on:
- (2)は(1)の結果そのものには依存しない
- method reuseはあるがresult link不要

Hole focus:
- 空集合
- 元集合自身
- 系統的列挙方法

Risk:
- 単なる暗記「2^n個」で終わらせない
- まず列挙の構造を理解させる

---

## 92 — 共通部分と和集合
Type: I

Goal:
各組についてA∩BとA∪Bを求める。

Subproblems:
- (1)〜(5)

各小問stage:
- A,Bの意味を具体化
- 共通要素を抽出 → A∩B
- 少なくとも一方の要素を統合 → A∪B
- 重複除去
- final

depends_on:
- 小問間は独立

result node:
- なし

Hole focus:
- ∩ = 両方
- ∪ = 少なくとも一方
- 実数区間ではinterval intersection/union
- 約数・数列型集合ではまず要素化

Risk:
- (3) interval notation rendering
- (5) 生成式の具体化

---

## 93 — 3つの集合
Type: C + I

Goal:
A,B,Cを具体化し、3集合の共通部分・和集合を求める。

Common prerequisite:
- A = 16の正の約数
- B = 24の正の約数
- C = 8以下の自然数

Stages:
- S0: A,B,Cを列挙
- S1: A∩B∩C
- S2: A∪B∪C

depends_on:
- S1,S2 → S0
- S1とS2は独立

result node:
- S0のA,B,Cは両方へimport可

Hole focus:
- 3集合でも∩/∪の意味は同じ
- intersectionは全てに入る
- unionはどれか1つ以上

---

## 94 — 補集合
Type: G
Status: USER-APPROVED / IMPLEMENTED

Goal:
補集合と集合演算を組み合わせる。

Approved dependency graph:
- (1) Ā → (3),(5),(6)
- (2) B̄ → (4),(5),(6)
- (7),(8)は内側集合をその場で求める

UI:
- current subproblem only
- required previous resultのみcompact import
- full derivationはtap展開

---

## 95 — 与えられた領域から集合を復元
Type: I with shared givens

Goal:
U内の既知3領域から、各指定集合を求める。

Given regions:
- A∩B={2}
- Ā∩B={4,6,8}
- Ā∩B̄={1,9}

Subproblems:
- (1) A∪B
- (2) B
- (3) A∩B̄

Structure:
(1)
- A∪Bの補集合がĀ∩B̄であることに気づく
- Uから{1,9}を除く

(2)
- B = (A∩B) ∪ (Ā∩B)
- 2つの既知領域を合成

(3)
- Uは4領域に分かれる
- 既知3領域をUから除く
- 残りがA∩B̄

depends_on:
- 小問間resultは不要
- givensのみ共有

Hole focus:
- Venn領域の意味
- complement利用
- 4領域partition

Risk:
- (3)の答えを(1)の途中で先に計算しない

---

## 96 — 3集合の複合演算
Type: I

Goal:
3集合と補集合を含む6種類の集合演算を求める。

Subproblems:
- (1)〜(6)

各stage:
- 必要な集合/補集合だけ準備
- 演算順序を読む
- intersection/union実行
- result

depends_on:
- 小問間なし

result node:
- なし

Hole focus:
- 演算の内側から処理
- 補集合の基準U
- 複数条件の同時充足

Risk:
- 先の小問結果を機械的に再利用しない
- raw overline禁止

---

## 97 — 共通部分から定数を決める
Type: L
Status: USER-APPROVED / IMPLEMENTED

Approved stages:
- S1: A∩B条件からaを求める
- S2: aを戻してA,B,A∩Bを確認
- S3: A∪B

dependencies:
- S2 ← result a=2 from S1
- S3 ← verified A,B from S2

UI:
- previous full derivationは圧縮
- S3ではa=2ではなくA,B結果をimport

---

# 3. 条件から命題を読む

## 98 — 命題か・真偽
Type: I

Goal:
各文について
1) 命題か
2) 命題なら真偽
を判定する。

Subproblems:
- (1) 23を3で割ると2余る
- (2) 二等辺三角形は正三角形
- (3) 3.14はπのよい近似値

各stage:
- 真偽が客観的に決まる文か
- 命題なら事実検証
- final classification

depends_on:
- 独立

Hole focus:
- 命題の定義
- 主観表現「よい」の扱い
- false statementとnon-propositionの区別

---

## 99 — 含意の真偽を集合で見る
Type: I

Goal:
p⇒qを集合包含として調べる。

Subproblems:
- (1)〜(4)

各stage:
- pを満たす集合P
- qを満たす集合Q
- P⊆Qか確認
- true/false
- falseなら反例1つ

depends_on:
- 独立

Hole focus:
- p⇒q ⇔ P⊆Q
- inequality / absolute valueの集合化

Risk:
- 真偽だけ当てさせない
- inclusion reasoningを必ず通す

---

## 100 — 反例で偽を示す
Type: I

Goal:
各命題が偽であることを、具体的反例で示す。

Subproblems:
- (1)〜(3)

各stage:
- 前件を満たす必要
- 後件を破る必要
- 候補を探す
- 反例確認
- 「よって偽」

depends_on:
- 独立

Hole focus:
- 反例の条件
- 前件true / 後件false

---

## 101 — 条件の否定
Type: I

Goal:
単純条件の否定を正確に述べる。

Subproblems:
- (1)〜(3)

各stage:
- 元条件が表す範囲/性質
- その補集合を考える
- 否定表現

depends_on:
- 独立

Hole focus:
- > と ≤
- ≠ と =
- 有理数 ↔ 無理数（実数の範囲）

---

## 102 — 「かつ」「または」
Type: I

Goal:
複合条件を満たす実数集合を求める。

Subproblems:
- (1)〜(4)

各stage:
- 各条件を区間化
- 「かつ」→ intersection
- 「または」→ union
- 境界の開閉確認
- result

depends_on:
- 独立
- (1),(2)は同じbase intervalsだがresult link不要
- (3),(4)も同様

Hole focus:
- logical AND/OR ↔ set operation
- endpoint inclusion

---

## 103 — 複合条件の否定
Type: I

Goal:
AND/ORや範囲を含む条件を否定する。

Subproblems:
- (1)〜(5)

各stage:
- 原条件の論理構造を分解
- De Morgan
- 各原子条件を否定
- 日本語として再構成

depends_on:
- 独立

Hole focus:
- not(P and Q)=notP or notQ
- not(P or Q)=notP and notQ
- 「少なくとも一方」の否定

Risk:
- 公式名だけ覚えさせず意味で考えさせる

---

## 104 — 必要条件・十分条件
Type: I

Goal:
pがqのための何条件か判定する。

Subproblems:
- (1)〜(6)

各stage:
- p,qを明示
- p⇒q?
- q⇒p?
- 2方向の真偽から分類

depends_on:
- 独立

result node:
- 各小問で2方向判定を最後の分類に再利用

Hole focus:
- 方向を混同しない
- 必要/十分の言葉を最後に付ける

---

## 105 — 命題の真偽
Type: I

Goal:
4つの命題の真偽を調べる。

各stage:
- 前件を満たす一般/具体ケース確認
- trueなら理由
- falseなら反例
- final

depends_on:
- 独立

Hole focus:
- 反例
- ±の見落とし
- 有理数×無理数等の扱い

---

## 106 — 条件を集合演算で表す
Type: C + I

Goal:
自然数条件をP,Qと補集合・共通部分で表す。

Common definitions:
- P: 2の倍数
- Q: 3の倍数

Subproblems:
- (1) 6の倍数
- (2) 奇数
- (3) 3の倍数で奇数
- (4) 3の倍数でない奇数

depends_on:
- 各小問はcommon definitionsのみ
- 小問間result link不要

Hole focus:
- 6の倍数 = P∩Q
- 奇数 = P̄
- 日本語条件→intersection/complement

---

## 107 — 必要十分条件の判定
Type: I

Goal:
複雑な条件対について必要・十分関係を判定する。

Subproblems:
- (1)〜(5)

各stage:
- p,qを分離
- p⇒q
- q⇒p
- counterexample / proof
- classification

depends_on:
- 独立

Hole focus:
- 104の方法を再利用
- geometry条件も2方向で考える

---

## 109 — 「すべて」「ある」の否定
Type: I with internal linear stages

Goal:
各命題について
1) 否定を述べる
2) 元命題の真偽
3) 否定の真偽
を調べる。

Subproblem (1):
- all real x: (x-1)^2 ≠ 0

Subproblem (2):
- exists natural n: n^2=5n

Per-subproblem stages:
- S1: quantifier structureを読む
- S2: 否定を書く
- S3: 元命題を検証
- S4: 否定の真偽を確認

depends_on:
- S2 ← S1
- S3 independent after statement understanding
- S4 ← S2 and S3

result node:
- 否定文はtruth checkへreuse

Hole focus:
- not(for all)=exists counterexample
- not(exists)=for all not

---

## 118 — 関数であるか
Type: C + I
App classification note:
原本では第3章「2次関数」。ユーザー指定により「条件から命題を読む」に配置。

Goal:
各状況で「xを決めるとyがただ1つ決まるか」を判定する。

Common prerequisite:
- 関数の判定基準: 各xに対しyがただ1つ

Subproblems:
- (1) 円周→半径
- (2) 正数xの平方根y
- (3) 面積1長方形の縦x→横y

depends_on:
- 各小問→common rule
- 小問間なし

Hole focus:
- unique output
- 平方根の± ambiguity

---

## 119 — 関数の値
Type: C + I

Goal:
f,gへ指定入力を代入し値を求める。

Common prerequisite:
- f(x)=3x-2
- g(x)=2x^2-3x+1
- xを入力式で置換する

Clusters:
- F1: f(0), f(2), f(-1), f(a), f(a+1)
- G1: g(0), g(3), g(-2), g(-a), g(a-1)

Each item stage:
- 対象関数選択
- xの置換
- 括弧を保って式生成
- 整理
- result

depends_on:
- 各itemはcommon ruleのみ
- 前item result不要

Hole focus:
- substitution
- negative / expression inputで括弧
- 展開

UI:
- 10小問なのでcurrent item onlyを厳守

---

## 120 — 文章から関数式と変域
Type: I with internal linear stages
App classification note:
原本では第3章「2次関数」。アプリでは「条件から命題を読む」。

Goal:
文章条件からyをxで表し、xの変域を決める。

Subproblem (1):
- base=6, height=x, area=y
Stages:
- 何が変数か
- 面積公式
- y式
- 現実条件からxの変域

Subproblem (2):
- distance=15km, speed=3km/h, elapsed=x, remaining=y
Stages:
- x時間で進む距離=3x
- remaining=15-3x
- start/end条件からx range

depends_on:
- (1),(2)独立

result node:
- 各小問内部で式→変域へreuse

Hole focus:
- physical verbal condition→formula
- domain is part of model

---

# 4. 命題を証明する

## 108 — 同値の証明
Type: P + G

Goal:
pとqが同値であることを証明する。

p:
a>1 and b>1

q:
a+b>2 and (a-1)(b-1)>0

Stages:
- S1: p⇒q
- S2: q⇒p
- S3: 両方向成立からp⇔q

depends_on:
- S1,S2 independent
- S3 ← S1,S2

result nodes:
- R1: p⇒q
- R2: q⇒p

Hole focus:
- 同値には2方向必要
- q⇒pで積が正→同符号、和条件で負側を排除

Risk:
- 最初から証明方針を全部言わない
- 重要分岐「両方>1側か両方<1側か」をthinking nodeにする

---

## 110 — 逆・対偶・裏
Type: I with internal graph

Goal:
各命題について
- 元命題
- 逆
- 対偶
- 裏
を作り、真偽を調べる。

Subproblems:
- (1)〜(3)

Per-subproblem:
- S0: p,qを特定
- S1: original p⇒q
- S2: converse q⇒p
- S3: contrapositive notq⇒notp
- S4: inverse notp⇒notq
- S5: truth summary

depends_on:
- S1〜S4 → S0
- contrapositive truth is logically tied to original, but answerを自動表示しない
- converse and inverseも対応関係あり

result node:
- p,q representation
- truth table summary

Hole focus:
- 4命題の方向
- 否定
- truth by proof/counterexample

---

## 111 — 対偶による証明
Type: P

Goal:
指定命題を対偶で証明する。

Subproblems:
- (1)〜(4)

Per-subproblem stages:
- p,qを読む
- 対偶を正しく作る
- 対偶を証明
- 元命題成立を結論

depends_on:
- linear within each subproblem
- subproblems independent

result node:
- proven contrapositive → original

Hole focus:
- strategy is given by source, so「対偶を使うか」は穴にしない
- ただし「対偶は何か」はthinking node
- algebra / parity / divisibility proof details

---

## 112 — √3を用いた無理数証明
Type: I + P

Goal:
既知「√3は無理数」を使い、2つの数が無理数と証明する。

(1) 1+√3
Stages:
- rationalと仮定
- 1を引く
- √3 rationalになる
- contradiction

(2) 1/(2+√3)
Stages:
- 対象を変形（例: 2-√3）
- rationalと仮定
- √3 rationalを導く
- contradiction

depends_on:
- (1),(2)独立
- common known theorem: √3 irrational

Hole focus:
- contradiction target
- rational operations preserve rationality

---

## 113 — √xの無理性
Type: P

Goal:
xが正の無理数なら√xは無理数と証明する。

Stages:
- √xが有理数と仮定
- 2乗
- xが有理数になる
- x無理数と矛盾
- conclusion

depends_on:
- linear

Hole focus:
- contradiction assumption
- square of rational is rational

---

## 114 — 倍数命題
Type: I + P

Goal:
整数の倍数に関する2命題を証明する。

(1) n² divisible by 5 ⇒ n divisible by5
Preferred structure:
- 対偶: n not divisible by5
- residue classes mod5
- square residues not0
- conclude

(2) mn divisible by3 ⇒ m or n divisible by3
Preferred structure:
- 対偶: neither divisible by3
- residues ±1 mod3
- product not divisible by3
- conclude

depends_on:
- (1),(2)独立

Hole focus:
- proof strategy
- residue classification
- contrapositive conclusion

---

## 115 — √3-√2の無理性
Type: P + L

Goal:
√6の無理性を用いて√3-√2が無理数と証明する。

Stages:
- S1: r=√3-√2 が有理数と仮定
- S2: r²を計算
- S3: √6=(5-r²)/2 を得る
- S4: RHS rational → √6 rational
- S5: contradiction → irrational

depends_on:
- linear

result nodes:
- r rational
- expression for √6

Hole focus:
- square expansion
- contradiction target

---

## 116 — p+qX=0
Type: P + L

Goal:
p,q rational, X irrational, p+qX=0 ⇒ p=q=0 を証明する。

Stages:
- S1: q≠0と仮定
- S2: X=-p/q
- S3: RHS rational
- S4: X irrationalと矛盾 → q=0
- S5: original equationへ戻る → p=0
- S6: conclusion

depends_on:
- linear

result node:
- THEOREM R116:
  rational p,q and irrational X with p+qX=0 ⇒ p=q=0

feeds:
- Problem 117

Hole focus:
- q=0 / q≠0 split
- rational quotient
- contradiction

---

## 117 — 無理数を含む等式
Type: X + I + L

Goal:
有理数p,qを求める。

Cross-problem dependency:
- Problem 116 theorem is directly useful
- compact link:
  「116の結果: A+B√2=0, A,B∈Q ⇒ A=B=0」

Subproblem (1):
(√2-1)p + q√2 = 2+√2

Stages:
- 全項を一方へ
- rational part と √2 coefficientに整理
- form: A + B√2 = 0
- 116 theorem適用
- 連立方程式
- p,q

Subproblem (2):
p/(√2-1)+q/√2=1

Stages:
- 分母有理化 / 共通整理
- rational + √2 coefficient形
- 116 theorem
- p,q

depends_on:
- each subproblem ← R116
- (1),(2) independent

Hole focus:
- coefficient grouping
- theorem application
- equation solving

UI:
- cross-problem result linkをsmall linkで出す価値が高い
- 116 full derivationはtapで確認可能

---

# 5. Cross-problem concept links

このsectionは「問題間の答え依存」ではなく、後続問題で前概念をretrievalする候補。

- 92 → 93,94,96 : ∩ / ∪
- 94 → 95,96 : complement / Venn-region reading
- 99 → 104,107 : implication as directional relation
- 101,103 → 109,110,111 : negation
- 104 → 107 : necessary / sufficient classification
- 110 → 111 : contrapositive form
- 111 → 114 : contrapositive proof method
- 112 → 113,115 : irrationality proof pattern
- 116 → 117 : **direct theorem dependency (strongest cross-problem link)**

Rule:
- concept retrievalはshort hintとして使ってよい
- previous full solutionを常時表示しない
- 直接結果が必要な116→117だけはcompact result link候補

---

# 6. Implementation order after user approval

Phase A — already approved anchors
- 87, 94, 97

Phase B — 集合を整理する
- 88,89,90,91,92,93,95,96

Phase C — 条件から命題を読む
- 98,99,100,101,102,103,104,105,106,107,109,118,119,120

Phase D — 命題を証明する
- 108,110,111,112,113,114,115,116,117

For each problem:
1. original source re-check
2. this structure map re-check
3. complete no-blank prose
4. thinking-node extraction
5. dependency/result node metadata
6. rendering risk audit
7. answer-leakage audit
8. implementation
9. unit/browser QA
10. user hands-on QA at batch boundaries

---

# 7. Stop conditions

Stop and re-review before implementation if:
- source wording is uncertain
- a problem seems to require a fourth theme
- dependency cannot be represented without showing future answers
- an imported result is convenient but not logically required
- proof strategy is being handed to the learner when source does not hand it over
- math rendering needs a new syntax not covered by current renderer
- mobile current-stage content becomes too long

---

# 8. Core reminder

> 先に問題の論理構造を作る。UIはその後。

> 現在の小問だけを見せる。過去は必要な結論だけ再利用する。

> 前に解いたから見せるのではなく、今の推論に必要だから見せる。

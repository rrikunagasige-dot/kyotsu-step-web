# MATH PRACTICE 88–96 CONTENT DESIGN
## 「集合を整理する」第2段階：完成文章 → thinking-node穴設計

Status: PRE-IMPLEMENTATION CONTENT AUTHORITY

Source:
- 『改訂版 教科書傍用 4STEP数学 1+A』
- 問題88, 89, 90, 91, 92, 93, 95, 96
- 問題87, 94, 97は既にuser-approved pilotとして実装済み

Mandatory read before using this file:
1. docs/MATH_PRACTICE_MASTER_LESSONS.md
2. docs/MATH_PRACTICE_87_120_STRUCTURE_MAP.md
3. このfile

Hard rules:
- 原問題の順番・条件・数学内容を変えない
- まず穴なしで自然な解説を完成させる
- 穴はthinking nodeだけ
- current subproblem only
- 前小問resultは論理的に必要な時だけcompact import
- 数式はshared math renderer
- 以下はまだapp codeではない

---

# 88 — 集合を要素で表す

## Source goal

次の集合を、要素を書き並べて表す。

1. 36の正の約数全体
2. 100以下の正の奇数全体
3. (-3le x<4) を満たす整数
4. (3n-2), (n=1,2,3,ldots)

Structure: Independent subproblems

---

## 88-(1) 完成文章

**今の問い｜(1)　36の正の約数を漏れなく並べる**

36の正の約数を思いついた順に探すと、抜けが出やすい。そこで、積が36になる正の整数の組を、小さい方から順に探す。

[
1	imes36,qquad
2	imes18,qquad
3	imes12,qquad
4	imes9,qquad
6	imes6
]

まで調べればよい。6を超える側は、ここまでに出た組を左右逆にしたものになるからである。

したがって、36の正の約数は

[
{1,2,3,4,6,9,12,18,36}
]

である。

### Thinking nodes

| Node | 考えさせること | Correct | Wrong-option idea |
|---|---|---|---|
| 88-1-strategy | 漏れなく探す方法 | 積が36になる整数の組を順に探す | 1から36まで全部36で割る / 思いついた順に書く |
| 88-1-stop | どこで組探索を止めるか | (6	imes6) まで | (4	imes9)まで / (18	imes2)まで |
| 88-1-result | 完成した集合 | ({1,2,3,4,6,9,12,18,36}) | 6や9を落とす候補 |

Hole policy:
- 2×18, 3×12の数字穴を細かく大量に作らない
- 「系統的に漏れなく探す」が主要thinking node

---

## 88-(2) 完成文章

**今の問い｜(2)　100以下の正の奇数を並べる**

正の奇数は

[
1,3,5,7,ldots
]

のように2ずつ増える。

100は偶数なので、100以下で最後の正の奇数は99である。

したがって、

[
{1,3,5,ldots,99}
]

となる。

### Thinking nodes

| Node | Focus | Correct |
|---|---|---|
| 88-2-step | 奇数列の増え方 | 2ずつ |
| 88-2-last | 100以下の最後の正の奇数 | 99 |
| 88-2-result | 集合表示 | ({1,3,5,ldots,99}) |

---

## 88-(3) 完成文章

**今の問い｜(3)　範囲に入る整数だけを並べる**

条件は

[
-3le x<4
]

である。

左側には等号があるので、(-3) は含まれる。一方、右側には等号がないので、4は含まれない。

さらに (x) は整数だから、その間にある整数を順に並べればよい。

[
{-3,-2,-1,0,1,2,3}
]

となる。

### Thinking nodes

| Node | Focus | Correct |
|---|---|---|
| 88-3-left | (-3)を含むか | 含む |
| 88-3-right | 4を含むか | 含まない |
| 88-3-result | 条件を満たす整数集合 | ({-3,-2,-1,0,1,2,3}) |

---

## 88-(4) 完成文章

**今の問い｜(4)　式から現れる要素を読む**

(n) は (1,2,3,ldots) と変わるので、最初のいくつかを (3n-2) に代入する。

[
n=1Rightarrow1,qquad
n=2Rightarrow4,qquad
n=3Rightarrow7,qquad
n=4Rightarrow10
]

となる。

現れる数は3ずつ増え、そのまま続く。

したがって、

[
{1,4,7,10,ldots}
]

である。

### Thinking nodes

| Node | Focus | Correct |
|---|---|---|
| 88-4-sample | 最初の4要素 | (1,4,7,10) |
| 88-4-pattern | 増え方 | 3ずつ |
| 88-4-result | 集合表示 | ({1,4,7,10,ldots}) |

### 88 UI compression

- (1)完了後、その長い約数説明は消す
- (2),(3),(4)は(1)resultを使わない
- dependency linkなし
- current subproblemのみ

---

# 89 — 部分集合

## Source goal

[
A={xmid1le xle10, x	ext{は偶数}}
]

に対して、

[
B={1,2,3},quad
C={2,4,6},quad
D={10,12},quad
E={8}
]

のうち、Aの部分集合であるものを求める。

Structure:
- common prerequisite: Aを具体化
- B,C,D,E判定は独立

---

## 89-S0 完成文章

**まず確認　集合Aを具体的にする**

1以上10以下の偶数を並べると、

[
A={2,4,6,8,10}
]

である。

ある集合XがAの部分集合であるためには、Xの**すべての要素**がAに入っていなければならない。

この基準を使ってB,C,D,Eを一つずつ調べる。

### Thinking nodes

| Node | Focus | Correct |
|---|---|---|
| 89-a-set | Aの具体化 | ({2,4,6,8,10}) |
| 89-subset-rule | 部分集合の条件 | Xのすべての要素がAに入る |

Result node:
- compact common ruleとして各candidate stageへ渡してよい
- 大きいS0 derivationは残さない

---

## 89-B 完成文章

**今の問い　BはAの部分集合か**

[
B={1,2,3}
]

を見ると、1はAに入らない。

部分集合であるにはすべての要素がAに入る必要があるので、1つ反例が見つかった時点で

[
B
otsubset A
]

である。

### Thinking nodes

- 89-b-counterexample: Aに入らないBの要素 → 1
- 89-b-judgment: BはAの部分集合ではない

---

## 89-C 完成文章

**今の問い　CはAの部分集合か**

[
C={2,4,6}
]

の2,4,6はいずれもAに入る。

したがって、

[
Csubset A
]

である。

### Thinking nodes

- 89-c-all-in: 2,4,6はすべてAに入る
- 89-c-judgment: (Csubset A)

---

## 89-D 完成文章

**今の問い　DはAの部分集合か**

[
D={10,12}
]

では10はAに入るが、12はAに入らない。

部分集合でないことを示すには、Aに入らない要素を1つ見つければ十分である。

したがって、

[
D
otsubset A
]

である。

### Thinking nodes

- 89-d-counterexample: 12
- 89-d-why-one: 反例1つで十分
- 89-d-judgment

---

## 89-E 完成文章

**今の問い　EはAの部分集合か**

[
E={8}
]

であり、8はAに入る。

Eには8しか要素がないので、その唯一の要素がAに入ることから

[
Esubset A
]

である。

---

## 89 conclusion

したがって、Aの部分集合であるものは

[
C, E
]

である。

UI:
- common prerequisite (A={2,4,6,8,10}) と subset ruleだけをsmall referenceとして残してよい
- Bの判定結果をCへ渡さない
- candidateごとにcurrent stage only

---

# 90 — 集合の包含・一致

Structure: (1),(2) independent

## 90-(1) 完成文章

**今の問い｜(1)　AとBの包含関係を決める**

式の形のまま比べるより、まず各集合の要素を具体的にする。

Aでは (n=1,2,3,4,5) なので、

[
A={2,5,8,11,14}
]

となる。

Bでは (n=0,1,2) なので、

[
B={2,8,14}
]

となる。

Bの要素2,8,14はすべてAに入っている。一方、Aには5や11のようにBに入らない要素がある。

したがって、

[
Bsubset A
]

である。

### Thinking nodes

| Node | Focus | Correct |
|---|---|---|
| 90-1-method | 比較前に何をするか | 要素を書き出す |
| 90-1-a | Aの具体化 | ({2,5,8,11,14}) |
| 90-1-b | Bの具体化 | ({2,8,14}) |
| 90-1-direction | 包含方向 | (Bsubset A) |

---

## 90-(2) 完成文章

**今の問い｜(2)　AとBが同じ集合か確かめる**

Aでは (n=1,2) だから、

[
A={2,5}
]

である。

Bは

[
(x-2)(x-5)=0
]

を満たす整数xの集合である。

積が0になるためには、少なくとも一方の因数が0であればよい。

したがって、

[
x=2quad	ext{または}quad x=5
]

であり、

[
B={2,5}
]

となる。

AとBはまったく同じ要素をもつので、

[
A=B
]

である。

### Thinking nodes

- 90-2-a: (A={2,5})
- 90-2-zero-product: 少なくとも一方の因数が0
- 90-2-b: (B={2,5})
- 90-2-relation: (A=B)

UI:
- (1)resultを(2)へimportしない

---

# 91 — 部分集合をすべて求める

Structure: independent subproblems
Main pedagogy: 「要素数ごとに整理して漏れを防ぐ」

## 91-(1) 完成文章

**今の問い｜(1)　({a,b}) の部分集合を漏れなく列挙する**

思いついた順に書くのではなく、選ぶ要素の個数で分ける。

0個選ぶと空集合

[
arnothing
]

である。

1個選ぶ場合は

[
{a},quad{b}
]

である。

2個とも選ぶ場合は

[
{a,b}
]

である。

したがって、すべての部分集合は

[
arnothing, {a}, {b}, {a,b}
]

である。

### Thinking nodes

- 91-1-organize: 選ぶ要素数で整理
- 91-1-zero: (arnothing)
- 91-1-one: ({a},{b})
- 91-1-two: ({a,b})

---

## 91-(2) 完成文章

**今の問い｜(2)　({1,2,3,4}) の部分集合を漏れなく列挙する**

4個の要素から、0個,1個,2個,3個,4個を選ぶ場合に分ける。

0個:

[
arnothing
]

1個:

[
{1},{2},{3},{4}
]

2個:

[
{1,2},{1,3},{1,4},{2,3},{2,4},{3,4}
]

3個:

[
{1,2,3},{1,2,4},{1,3,4},{2,3,4}
]

4個:

[
{1,2,3,4}
]

となる。

これで0個から4個までの場合をすべて調べたので、漏れはない。

### Thinking nodes

| Node | Focus | Correct |
|---|---|---|
| 91-2-range | 何個選ぶ場合まで見るか | 0個〜4個 |
| 91-2-pairs | 2個選ぶ全組 | 6組の正しい一覧 |
| 91-2-triples | 3個選ぶ全組 | 4組の正しい一覧 |
| 91-2-check | 漏れ確認の根拠 | 0〜4個を全部調べた |

Optional non-hole check:
- 合計16個であることは最後の自己確認として表示可
- (2^4) を先に教えて列挙を省略しない

UI:
- (1)完了後は(2)だけ
- (2)内部は「0/1個 → 2個 → 3/4個」の短いsemantic groupsにしてよい

---

# 92 — 共通部分と和集合

Structure:
- common meaning stage
- (1)〜(5) independent

## 92-S0 共通基準

[
Acap B
]

はAとBの**両方**に入る要素の集合である。

[
Acup B
]

はAとBの**少なくとも一方**に入る要素の集合である。

この基準だけを各小問で使う。

Thinking nodes:
- 92-intersection-meaning → 両方
- 92-union-meaning → 少なくとも一方

S0長文は圧縮し、必要なら小さい基準表示だけ残す。

---

## 92-(1) 完成文章

AとBの両方にあるのは1と3なので、

[
Acap B={1,3}
]

である。

どちらか一方に現れる数を重複なく集めると、

[
Acup B={0,1,2,3,5,7}
]

となる。

Thinking nodes:
- intersection result
- unionは重複を1回だけ
- union result

---

## 92-(2) 完成文章

AとBに共通する要素はない。

したがって、

[
Acap B=arnothing
]

である。

両集合の要素を重複なく合わせると、

[
Acup B={1,2,3,4,5,6,8}
]

となる。

Thinking nodes:
- common element exists? → ない
- empty set notation
- union result

---

## 92-(3) 完成文章

Aは

[
-3le xle2
]

Bは

[
-1<x<4
]

を満たす実数の集合である。

共通部分では両方の条件を同時に満たす必要がある。

左端は (-1) より大きく、右端は2以下なので、

[
Acap B={xmid-1<xle2}
]

となる。

和集合ではどちらか一方に入ればよい。2つの区間は重なっているので、全体をつなげると

[
Acup B={xmid-3le x<4}
]

となる。

Thinking nodes:
- intersection lower boundary
- intersection upper boundary
- union left/right endpoints
- endpoint equality

Rendering:
- inequalities must stay math
- mobileで長いset-builderを横overflowさせない

---

## 92-(4) 完成文章

18の正の約数は

[
A={1,2,3,6,9,18}
]

である。

27の正の約数は

[
B={1,3,9,27}
]

である。

両方に現れる要素は1,3,9だから、

[
Acap B={1,3,9}
]

である。

すべての要素を重複なく集めると、

[
Acup B={1,2,3,6,9,18,27}
]

となる。

Thinking nodes:
- divisor set A
- divisor set B
- intersection
- union

---

## 92-(5) 完成文章

Aでは (n=0,1,ldots,6) を (2n+1) に代入するので、

[
A={1,3,5,7,9,11,13}
]

である。

Bでは (n=0,1,ldots,4) を (3n+1) に代入するので、

[
B={1,4,7,10,13}
]

である。

両方にある要素は1,7,13だから、

[
Acap B={1,7,13}
]

である。

重複を除いてすべて集めると、

[
Acup B={1,3,4,5,7,9,10,11,13}
]

となる。

Thinking nodes:
- generate A
- generate B
- intersection
- union

UI:
- (1)〜(5)間にresult dependencyなし
- 過去小問の集合を残さない

---

# 93 — 3つの集合

Structure:
- S0: A,B,Cを具体化
- (1),(2) both depend on S0

## 93-S0 完成文章

**まず準備　A,B,Cを具体的にする**

16の正の約数は

[
A={1,2,4,8,16}
]

である。

24の正の約数は

[
B={1,2,3,4,6,8,12,24}
]

である。

8以下の自然数は

[
C={1,2,3,4,5,6,7,8}
]

である。

この3つを小さいresult blockとして(1),(2)へ渡す。

Thinking nodes:
- 93-a
- 93-b
- 93-c

Result node:
[
A={1,2,4,8,16},quad
B={1,2,3,4,6,8,12,24},quad
C={1,2,3,4,5,6,7,8}
]

---

## 93-(1) 完成文章

**今の問い｜(1)　(Acap Bcap C)**

3つの集合の共通部分に入るには、A,B,Cの3つすべてに入らなければならない。

準備で求めた3集合を比べると、1,2,4,8がすべてに共通している。

したがって、

[
Acap Bcap C={1,2,4,8}
]

である。

Thinking nodes:
- 3集合intersection meaning → 3つすべて
- result

Dependency:
- import S0 result only

---

## 93-(2) 完成文章

**今の問い｜(2)　(Acup Bcup C)**

3つの集合の和集合では、A,B,Cの少なくとも1つに入る要素をすべて集める。

重複を1回だけ書くと、

[
Acup Bcup C
=
{1,2,3,4,5,6,7,8,12,16,24}
]

である。

Thinking nodes:
- union meaning → 少なくとも1つ
- result

Dependency:
- import S0 result
- (1)resultは不要

---

# 95 — 領域情報から集合を求める

Important correction from old draft:
- 原問題順は (1) A∪B, (2) B, (3) A∩B̄
- (3)を先に求めてfuture answerを漏らさない
- 3小問はgiven regionsを共有するが、互いのanswerを必須としない

Given:

[
U={1,2,3,4,5,6,7,8,9}
]

[
Acap B={2}
]

[
overline Acap B={4,6,8}
]

[
overline Acapoverline B={1,9}
]

---

## 95-(1) 完成文章

**今の問い｜(1)　(Acup B)**

(Acup B) に入らないのは、AにもBにも入らない要素である。

その領域は

[
overline Acapoverline B
]

であり、問題文から

[
overline Acapoverline B={1,9}
]

と分かっている。

したがって、全体集合Uから1と9を除けばよい。

[
Acup B={2,3,4,5,6,7,8}
]

である。

Thinking nodes:
- 95-1-outside: A∪Bに入らない領域 → (overline Acapoverline B)
- 95-1-operation: Uから{1,9}を除く
- 95-1-result

No dependency on future (3).

---

## 95-(2) 完成文章

**今の問い｜(2)　B**

Bの中は、
- Aにも入る部分 (Acap B)
- Aには入らない部分 (overline Acap B)

の2つに分かれる。

したがって、

[
B=(Acap B)cup(overline Acap B)
]

である。

問題文の値を代入すると、

[
B={2}cup{4,6,8}
={2,4,6,8}
]

となる。

Thinking nodes:
- 95-2-decompose: Bを2領域へ分解
- 95-2-union
- 95-2-result

No need to import (1).

---

## 95-(3) 完成文章

**今の問い｜(3)　(Acapoverline B)**

Uの各要素は、Aに入るか入らないか、Bに入るか入らないかによって、4つの領域のどれか1つに入る。

4領域は

[
Acap B,quad
Acapoverline B,quad
overline Acap B,quad
overline Acapoverline B
]

である。

問題文ではこのうち

[
Acap B={2},quad
overline Acap B={4,6,8},quad
overline Acapoverline B={1,9}
]

の3領域が分かっている。

この3領域に現れる要素をUから除くと、残るのは

[
{3,5,7}
]

である。

したがって、

[
Acapoverline B={3,5,7}
]

となる。

Thinking nodes:
- 95-3-four-regions: 4領域の構造
- 95-3-missing-region: missing region name → (Acapoverline B)
- 95-3-remove-known: known 3 regionsをUから除く
- 95-3-result

UI:
- (1),(2)のresult link不要
- 問題文のgivensだけをcompact common contextとして利用

---

# 96 — 3集合の複合演算

Important dependency correction:
- (5) (overline{Acap Bcap C}) は(1)のresult (Acap Bcap C) を直接利用できる
- よって (1) → (5) はreal dependency
- その他は原則独立

Given:

[
U={1,2,3,4,5,6,7,8,9,10}
]

[
A={1,2,3,4,8},quad
B={3,4,5,6},quad
C={2,3,6,7}
]

---

## 96-(1) 完成文章

**今の問い｜(1)　(Acap Bcap C)**

まずAとBの共通要素を探す。

[
Acap B={3,4}
]

である。

この中でさらにCにも入るのは3だけなので、

[
Acap Bcap C={3}
]

となる。

Thinking nodes:
- 96-1-ab
- 96-1-filter-c
- 96-1-result

Result node:
[
Acap Bcap C={3}
]

feeds:
- (5)

---

## 96-(2) 完成文章

**今の問い｜(2)　(Acup Bcup C)**

和集合では、A,B,Cの少なくとも1つに入る要素をすべて集める。

重複を除くと、

[
Acup Bcup C
=
{1,2,3,4,5,6,7,8}
]

である。

Thinking nodes:
- union meaning
- result

---

## 96-(3) 完成文章

**今の問い｜(3)　(Acap Bcapoverline C)**

AにもBにも入り、Cには入らない要素を探す。

まず、

[
Acap B={3,4}
]

である。

このうち3はCに入るが、4はCに入らない。

したがって、

[
Acap Bcapoverline C={4}
]

である。

Thinking nodes:
- conditions in/in/not-in
- (Acap B)
- filter by not C
- result

No import from (1):
- (1)final {3}では足りず、中間A∩Bを再度求めた方が自然
- convenience dependencyを作らない

---

## 96-(4) 完成文章

**今の問い｜(4)　(overline Acap Bcapoverline C)**

この集合に入る要素は、
- Aには入らない
- Bには入る
- Cには入らない

の3条件を同時に満たす。

Bに入ることは必須なので、最初からBの要素

[
{3,4,5,6}
]

だけを候補にすればよい。

その中でAに入らないのは5,6であり、さらにCにも入らないのは5だけである。

したがって、

[
overline Acap Bcapoverline C={5}
]

である。

Thinking nodes:
- candidate pool → B
- remove A-members
- remove C-members
- result

---

## 96-(5) 完成文章

**今の問い｜(5)　(overline{Acap Bcap C})**

括弧の中

[
Acap Bcap C
]

は(1)で

[
{3}
]

と求めた。

したがって、その補集合は全体集合Uから3を除けばよい。

[
overline{Acap Bcap C}
=
{1,2,4,5,6,7,8,9,10}
]

である。

Dependency import:
- compact link: 「(1)の結果 (Acap Bcap C={3})」
- full (1) derivationはcollapsed

Thinking nodes:
- complement基準U
- remove {3}
- result

---

## 96-(6) 完成文章

**今の問い｜(6)　((Acup C)capoverline B)**

括弧があるので、まず

[
Acup C
]

を求める。

AまたはCに入る要素を集めると、

[
Acup C={1,2,3,4,6,7,8}
]

である。

次に、Bに入らない要素だけを残す。

Bは

[
{3,4,5,6}
]

なので、A∪Cから3,4,6を除く。

したがって、

[
(Acup C)capoverline B
=
{1,2,7,8}
]

である。

Thinking nodes:
- parentheses first
- A∪C
- (overline B) condition
- result

---

# Cross-problem implementation notes for 88–96

## 1. No result-link by default

Previous result is shown only if logically required.

Examples:
- 88: none
- 89: common A/rule only
- 90: none
- 91: none
- 92: common operation meaning only
- 93: S0 A,B,C → (1),(2)
- 95: givens only; no previous answer
- 96: (1) → (5) only

## 2. Current-stage compression

At any moment:
- current subproblem derivation only
- common prerequisite/result if needed
- unrelated past derivation hidden
- future reasoning hidden

## 3. Hole quality

Do not convert every computed number into a hole.

Prefer:
- strategy
- set meaning
- boundary inclusion
- candidate reduction
- containment direction
- decomposition
- result after meaningful reasoning

## 4. Rendering audit

Required syntax:
- (subset), (=)
- (cap,cup)
- (overline A), (overline B)
- set-builder notation
- interval inequalities
- (arnothing)
- ellipsis in infinite set
- braces

No raw authoring syntax.

## 5. Batch stop point

After implementing these 8 problems:
- run unit/math renderer tests
- mobile + desktop Playwright
- compare with user-approved 87/94/97
- user hands-on QA
- only then continue to 98–109

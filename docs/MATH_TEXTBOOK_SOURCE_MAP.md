# MATH_TEXTBOOK_SOURCE_MAP

数学・学習モードの source → unit → learner flow 対応表。

## 1. 集合を整理する

### math-sets
- revision: 2
- status: published
- source: 深進数学I p.86〜91 相当
- practice topic: organize-sets
- practice questions: 87〜97
- flow:
  1. 集合を表す
  2. 共通部分・和集合
  3. 部分集合
  4. 全体集合・補集合
  5. ド・モルガン
  6. 実数集合・数直線
- note:
  - user-approved `集合_教科書モード_完成版_v1` を母版とし、Part 2 は「共通部分・和集合 → 部分集合」の順を守る。
  - 概念名は具体的判断の後に出す。
  - 補集合・ド・モルガンでは answer-bearing figure を判断後に表示する。

## 2. 条件から命題を読む

### math-propositions-reading
- revision: 3
- status: review（MASTER復元＋golden textbook role反映済み / automated CI PASS。quantifier unitと同じread-propositions topicとしてuser hands-on QA待ち）
- source: 深進数学I p.92〜95 相当
- practice topic: read-propositions
- practice questions: 98〜107
- flow:
  1. -2≤x≤1⇒x<3 を具体的に確認
  2. p⇒q と集合包含
  3. x<2⇒x>0 の反例
  4. x²=9⇒x=3 の反例
  5. 二等辺三角形⇒正三角形 の反例
  6. 必要条件・十分条件・必要十分条件
  7. 条件の否定
- source-backed principle:
  - 問8のsource例から始め、practice由来の別導入例を混ぜない。
  - 最初の具体的判断の後に「命題」と p⇒q を導入する。
  - 偽は反例を先に見つけ、その後で「反例」という言葉を出す。
  - item prompt / aria-label も概念導入順を守り、「反例」「否定」を概念化より前に出さない。
  - 反例選択肢は「前件○・後件× / 前件○・後件○ / 前件×」を区別できるよう、意味重複を置かない。
  - 反例の具体値は唯一解のように読ませず、「一例」として書く。
  - 各小節末は strong → medium → light へ支援を落とし、最後は transfer として閉じる。

## 3. 命題を証明する

### math-propositions-proof
- revision: 4
- status: review（MASTER復元＋例題/証明/確認/まとめのrole反映済み / automated CI PASS。user hands-on QA待ち）
- source: 深進数学I p.96〜98 相当
- practice topic: prove-propositions
- practice questions: 108, 110〜117
- flow:
  1. 逆・裏・対偶
  2. 元命題と対偶、逆と裏の真偽関係
  3. 証明しやすい向きを選ぶ
  4. 対偶による3の倍数の証明
  5. 矛盾を使う証明
- source-backed principle:
  - 前unitで扱った同値を重複して教え直さない。
  - 対偶は名前を知るだけで終わらず、実際に証明の入口として選ばせる。
  - 背理法は「否定を仮定 → 矛盾 → 仮定を退ける」の因果順を崩さない。
  - 逆・裏・対偶の名称は操作を経験した後に出し、item prompt / aria-label でも先出ししない。
  - 対偶証明の式変形は、見えている余りを選ぶ穴ではなく、3の倍数+1の形を自分で作る thinking node にする。

## 3A. 参考「すべて」と「ある」

### math-quantifiers-all-exists
- revision: 5
- status: review（MASTER復元＋golden textbook role反映済み / automated CI PASS。math-propositions-readingと同じread-propositions topicとしてuser hands-on QA待ち）
- source: 深進数学I p.100〜101 相当
- learner topic: read-propositions
- practice overlap: read-propositions / 109
- flow:
  1. 「ある」の主張を具体例で成立させる
  2. 「ある」の否定
  3. 「すべて」の主張を反例で崩す
  4. 「すべて」の否定
  5. 無理数・図形の元命題と否定を確認
- source-backed principle:
  - learner-facing topicは練習モードの「条件から命題を読む」と対応させる。
  - source page orderは chapter metadata（orderInChapter=4）で保持する。
  - 量化の規則を先に暗記させず、反例 / witness を先に経験させる。
  - 暗黙の「すべて」は完成本文として自然な日本語（「どの2つの無理数を選んでも」）で読ませる。
  - sentence-like answer を本文へ埋め込んだとき、二重「である」などの接続事故を残さない。

## 4. 第2章・関数（将来の章として review）

### math-functions-conditions
- status: review
- source: 深進数学I 第2章 p.46〜47 相当
- current learner topic: 未接続
- flow:
  1. y=4x−6 の具体例から「xを決めるとyがただ1つ決まる」を確認
  2. f(−1), f(2), f(a−1)
  3. f(x)=x²−1 でも同じ読み方を使う
  4. 周40 cmの長方形から y=20−x
  5. 定義域・値域
- note:
  - 第3章「条件から命題を読む」には含めない。
  - 練習モードとの同期は内部metadata/testだけで扱う。
  - 第2章を学習モードへ実装するときに chapter-aware setup へ接続する。

## Promotion

review unit は以下が揃うまで published にしない:
- source audit
- unit pedagogy tests
- browser smoke
- mobile / desktop
- physics regression
- math practice regression
- setup curriculum order
- user hands-on QA


## 2026-10-04 MASTER restoration note

The review units were restored from the frozen mathematics textbook-mode MASTER after hands-on inspection showed excessive mini-question rhythm.

- proposition-reading: 18 → 14 interactions; redundant conclusion/name-recall panels merged into prose
- quantifier: 13 → 11 interactions; concrete witness/counterexample moved before abstract rule
- proof: 23 interactions retained; concrete source proposition now precedes reverse/inverse/contrapositive naming; contradiction method name remains after the worked proof
- current revisions: reading 3 / quantifier 5 / proof 4
- all remain review pending user hands-on QA

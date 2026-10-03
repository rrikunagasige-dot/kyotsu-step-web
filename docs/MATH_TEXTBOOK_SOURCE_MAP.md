# MATH_TEXTBOOK_SOURCE_MAP

数学・学習モードの source → unit → learner flow 対応表。

## 1. 集合を整理する

### math-sets
- status: published
- source: 深進数学I p.86〜91 相当
- practice topic: organize-sets
- practice questions: 87〜97
- flow:
  1. 集合を表す
  2. 部分集合
  3. 共通部分・和集合
  4. 全体集合・補集合
  5. ド・モルガン
  6. 実数集合・数直線
- note:
  - 練習モード順に合わせ、部分集合を共通部分・和集合より先に置く。
  - 概念名は具体的判断の後に出す。
  - 補集合・ド・モルガンでは answer-bearing figure を判断後に表示する。

## 2. 条件から命題を読む

### math-propositions-reading
- status: review
- source: 深進数学I p.92〜95 相当
- practice topic: read-propositions
- practice questions: 98〜107, 109, 118〜120
- flow:
  1. 具体的な条件 p, q の真偽
  2. p⇒q と集合包含
  3. 反例
  4. 必要条件・十分条件
  5. 必要十分条件
  6. 条件の否定
- source-backed principle:
  - 先に「必ず成り立つか」を判断し、その後で p⇒q を命名する。
  - 偽は反例を先に見つけ、その後で「反例」という言葉を出す。

### math-quantifiers-all-exists
- status: review
- source: 深進数学I p.100〜101 相当
- practice topic: read-propositions
- flow:
  1. 「すべて」の主張を反例で崩す
  2. 「すべて」の否定
  3. 「ある」の主張を具体例で成立させる
  4. 「ある」の否定
- source-backed principle:
  - 量化の規則を先に暗記させず、反例 / witness を先に経験させる。

### math-functions-conditions
- status: review
- source: 深進数学I 第2章 p.46〜49 相当
- practice topic: read-propositions
- flow:
  1. xを決めるとyがどう決まるか
  2. f(x)
  3. 長方形条件から y=20-x
  4. 実際の長さ条件から入力範囲を決める
  5. 対応する出力範囲を読む
- note:
  - 練習モードの「関数の条件」と同期するため、章番号ではなく curriculum topic で束ねる。
  - 教科書上の章位置は source metadata に残す。

## 3. 命題を証明する

### math-propositions-proof
- status: review
- source: 深進数学I p.96〜98 相当
- practice topic: prove-propositions
- practice questions: 108, 110〜117
- flow:
  1. 同値を具体例で確認
  2. 逆・裏・対偶
  3. 元命題と対偶の真偽関係
  4. 対偶による3の倍数の証明
  5. 矛盾を使う証明
- source-backed principle:
  - practice taxonomy に合わせて「同値」を先に置く。
  - 対偶は名前を知るだけで終わらず、実際に証明の入口として選ばせる。
  - 背理法は「否定を仮定 → 矛盾 → 仮定を退ける」の因果順を崩さない。

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

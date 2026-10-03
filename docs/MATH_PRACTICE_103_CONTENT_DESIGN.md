# MATH PRACTICE 103 CONTENT DESIGN
## 「条件から命題を読む」第6問

Status: PRE-IMPLEMENTATION CONTENT AUTHORITY

Source problem:
x,y は実数、n は自然数とする。次の条件の否定を述べよ。

(1) \(x=2\) かつ \(y\ne-1\)

(2) \(x>8\) または \(x=3\)

(3) \(5<x\le10\)

(4) n は偶数または5の倍数

(5) x,y の少なくとも一方は無理数である

Theme:
- 条件から命題を読む

Core idea:
- 「かつ」全体が成り立たないとは、少なくとも一方の条件が成り立たないこと。
- 「または」全体が成り立たないとは、両方の条件が成り立たないこと。
- したがって、複合条件の否定では接続語を入れ替えるだけでなく、各原子条件もそれぞれ否定する。
- (1)〜(5) は独立。

---

# 0. 共通準備 — De Morgan を意味から作る

## 穴なし完成文章

「p かつ q」が成り立つには、p と q が両方とも成り立つ必要がある。

したがって、その全体が成り立たないのは、p と q の少なくとも一方が成り立たない場合である。

よって、

\[
\neg(p\land q)\iff(\neg p)\lor(\neg q)
\]

である。

一方、「p または q」が成り立つには、少なくとも一方が成り立てばよい。

その全体が成り立たないためには、p と q が両方とも成り立たない必要がある。

よって、

\[
\neg(p\lor q)\iff(\neg p)\land(\neg q)
\]

である。

## Thinking node

- 103-rule
  - correct: 「かつの否定→各否定を『または』で結ぶ／またはの否定→各否定を『かつ』で結ぶ」
  - purpose: 公式暗記ではなく、全体が失敗する条件から De Morgan を再構成する

Result node:
- label: 複合条件の否定
- result: AND→OR、OR→AND（各原子条件も否定）

---

# 1. (1)

元の条件は

\[
x=2 \quad\text{かつ}\quad y\ne-1
\]

である。

全体を否定すると、少なくとも一方が失敗すればよい。

\(x=2\) の否定は \(x\ne2\)、\(y\ne-1\) の否定は \(y=-1\)。

したがって、

\[
x\ne2 \quad\text{または}\quad y=-1
\]

である。

Thinking node:
- 103-p1-result
  - correct: \(x\ne2\) または \(y=-1\)
  - purpose: AND の否定

---

# 2. (2)

元の条件は

\[
x>8 \quad\text{または}\quad x=3
\]

である。

「または」全体を否定するには、両方を否定する。

\(x>8\) の否定は \(x\le8\)、\(x=3\) の否定は \(x\ne3\)。

したがって、

\[
x\le8 \quad\text{かつ}\quad x\ne3
\]

である。

Thinking node:
- 103-p2-result
  - correct: \(x\le8\) かつ \(x\ne3\)
  - purpose: OR の否定

---

# 3. (3)

\[
5<x\le10
\]

は

\[
x>5 \quad\text{かつ}\quad x\le10
\]

と同じである。

この AND 条件を否定すると、

\[
x\le5 \quad\text{または}\quad x>10
\]

となる。

Thinking node:
- 103-p3-result
  - correct: \(x\le5\) または \(x>10\)
  - purpose: 区間の補集合を De Morgan と端点条件から作る

---

# 4. (4)

元の条件は

「n は偶数 または 5の倍数」

である。

全体を否定するには両方を否定する。

偶数の否定は奇数、5の倍数の否定は5の倍数でないこと。

したがって、

「n は奇数 かつ 5の倍数でない」

である。

Thinking node:
- 103-p4-result
  - correct: 「奇数かつ5の倍数でない」
  - purpose: 数の性質を表す OR 条件の否定

---

# 5. (5)

「x,y の少なくとも一方は無理数」は、

「x は無理数 または y は無理数」

と同じである。

この条件が成り立たないのは、x も y も無理数ではない場合である。

x,y は実数なので、「無理数ではない」は「有理数である」。

したがって、

「x,y はともに有理数である」

が否定である。

Thinking node:
- 103-p5-result
  - correct: 「x,y はともに有理数」
  - purpose: 「少なくとも一方」の否定を「両方とも〜でない」へ変換する

---

# 6. Current-stage compression

Target order:
1. basis
2. s1
3. s2
4. s3
5. s4
6. s5

Rules:
- s1〜s5 は basis だけに依存
- 前の小問の完成結果を次へ見せない
- basis は compact dependency chip
- future subproblem は隠す
- completed full derivation は畳む

---

# 7. Hole quality audit

Keep:
- De Morgan の意味に基づく共通規則
- 各小問の完成した否定条件
- 区間端点の否定
- 「少なくとも一方」の否定

Do not create:
- 接続語だけを単独で当てる穴の連打
- 各原子条件を別々に答えさせたあと同じ完成式をもう一度聞く重複
- 公式名そのものを答えさせる穴

---

# 8. Rendering / mobile audit

Required:
- \(\ne,\le,\land,\lor,\neg\) のTeXバックスラッシュ保持
- raw TeX command wordsを表示しない
- 数式重複なし
- horizontal overflowなし
- Japanese/Chinese grading parity
- Chinese sourceに日本語かなを残さない
- mobile/desktop smoke

---

# 9. Acceptance gate before 104

103 must pass:
1. typecheck
2. source/catalog/parity tests
3. build
4. mobile smoke
5. desktop smoke
6. deploy

Only after this gate may problem 104 be enabled.

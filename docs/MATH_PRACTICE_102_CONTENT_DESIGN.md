# MATH PRACTICE 102 CONTENT DESIGN
## 「条件から命題を読む」第5問

Status: PRE-IMPLEMENTATION CONTENT AUTHORITY

Source problem:
次の条件を満たす実数 x 全体の集合を求めよ。

(1) \(0<x<3\) かつ \(-2<x<2\)

(2) \(0<x<3\) または \(-2<x<2\)

(3) \(-1\le x<2\) かつ \(-1<x\le4\)

(4) \(-1\le x<2\) または \(-1<x\le4\)

Theme:
- 条件から命題を読む

Core idea:
- 「かつ」は2条件を同時に満たす範囲なので共通部分。
- 「または」は少なくとも一方を満たす範囲なので和集合。
- 端点は各条件が含むかどうかを見て、共通部分では両方が許す端点だけを残し、和集合ではどちらかが許せば残す。
- (1)〜(4) は独立。前の小問の完成結果を次へ再利用しない。

---

# 0. 共通準備 — AND / OR と集合演算

## 穴なし完成文章

2つの条件を満たす集合をそれぞれ \(A,B\) とする。

「条件A かつ 条件B」を満たすには両方を同時に満たす必要があるので、求める集合は

\[
A\cap B
\]

である。

「条件A または 条件B」を満たすには少なくとも一方を満たせばよいので、求める集合は

\[
A\cup B
\]

である。

## Thinking node

- 102-rule
  - correct: 「かつ→共通部分、または→和集合」
  - purpose: 論理接続語を集合演算へ変換する共通基準を作る

Result node:
- label: 集合演算の対応
- result: かつ→∩、または→∪

---

# 1. (1)

\[
A=(0,3),\qquad B=(-2,2)
\]

「かつ」なので共通部分を取る。

両方に入るのは

\[
0<x<2
\]

である。

Thinking node:
- 102-p1-result
  - correct: \(0<x<2\)
  - distractors: \(-2<x<3\), \(0\le x\le2\)
  - purpose: intersection の基本

---

# 2. (2)

同じ2区間を使うが、今度は「または」なので和集合を取る。

\[
(0,3)\cup(-2,2)=(-2,3)
\]

したがって、

\[
-2<x<3
\]

である。

Thinking node:
- 102-p2-result
  - correct: \(-2<x<3\)
  - purpose: union の基本

Important:
- (1)の結果を依存として表示しない
- 同じ base intervals でも current subproblem だけで完結させる

---

# 3. (3)

\[
A=[-1,2),\qquad B=(-1,4]
\]

「かつ」なので共通部分。

左端 \(-1\) は A には入るが B には入らないため除く。

右端 \(2\) は B には入るが A には入らないため除く。

したがって、

\[
-1<x<2
\]

である。

Thinking node:
- 102-p3-result
  - correct: \(-1<x<2\)
  - distractors include wrong endpoint closures
  - purpose: intersection で厳しい端点条件を選ぶ

---

# 4. (4)

同じ2区間で「または」なので和集合。

左端 \(-1\) は A が含むので和集合に残る。

右端 \(4\) は B が含むので和集合に残る。

したがって、

\[
-1\le x\le4
\]

である。

Thinking node:
- 102-p4-result
  - correct: \(-1\le x\le4\)
  - purpose: union ではどちらかが含む端点を残す

---

# 5. Current-stage compression

Target order:
1. basis
2. s1
3. s2
4. s3
5. s4

Rules:
- s1〜s4 は basis のみに依存
- s1結果をs2へ見せない
- s3結果をs4へ見せない
- base intervals が同じでも result link は作らない
- basis は compact dependency chip
- future subproblem は隠す
- past full derivation は畳む

---

# 6. Hole quality audit

Keep:
- AND/OR ↔ intersection/union
- 各小問の最終区間
- endpoint closure の判断を含む結果選択

Do not create:
- 左端・右端の数字を1つずつ当てる大量穴
- 「両方／片方」のあと同じ結論をもう一度聞く重複穴
- 前問の答えのコピー

---

# 7. Rendering / mobile audit

Required:
- \(\cap,\cup,\le\) のTeXバックスラッシュ保持
- 区間記法が崩れない
- raw TeX command wordsを表示しない
- 数式重複なし
- horizontal overflowなし
- Japanese/Chinese grading parity
- Chinese sourceに日本語かなを残さない
- mobile/desktop smoke

---

# 8. Acceptance gate before 103

102 must pass:
1. typecheck
2. source/catalog/parity tests
3. build
4. mobile smoke
5. desktop smoke
6. deploy

Only after this gate may problem 103 be enabled.

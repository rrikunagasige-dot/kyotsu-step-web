# MATH PRACTICE 105 CONTENT DESIGN
## 「条件から命題を読む」第8問

Status: PRE-IMPLEMENTATION CONTENT AUTHORITY

Source problem:
a,b は実数とする。次の命題の真偽を調べよ。

(1) \(ab=0\Rightarrow a^2+b^2=0\)

(2) \(a^2=4\Rightarrow |a+1|\ge1\)

(3) ab が有理数 \(\Rightarrow\) a,b はともに有理数

(4) a+b, ab がともに有理数 \(\Rightarrow\) a,b はともに有理数

Theme:
- 条件から命題を読む

Core idea:
- 含意を真とするには、前件を満たすすべての場合で後件が成り立つ必要がある。
- 偽を示すには、前件を満たして後件を破る反例を1つ示せばよい。
- 「真らしそう」ではなく、全ケース確認または反例で判定する。
- (1)〜(4) は独立。

---

# 0. 共通準備 — 真の証明と偽の証明

命題 \(p\Rightarrow q\) を判定するとき、

- 真を示す: p を満たすすべてのケースで q が成り立つことを示す。
- 偽を示す: p は満たすが q は満たさない反例を1つ示す。

Thinking node:
- 105-rule
  - correct: 「真なら全ケース、偽なら反例1つ」
  - purpose: true/false の証明責任を固定する

Result node:
- label: 真偽判定の基準
- result: 真→すべて確認、偽→反例

---

# 1. (1)

前件 \(ab=0\) から分かるのは、a,b の少なくとも一方が0であること。

両方が0とは限らない。

たとえば

\[
a=0,\qquad b=1
\]

なら \(ab=0\) だが、

\[
a^2+b^2=1\ne0
\]

なので反例。

したがって (1) は偽。

Thinking node:
- 105-p1-result
  - correct: 「a=0,b=1 が反例 → 偽」
  - purpose: “少なくとも一方が0” と “両方0” の混同を防ぐ
  - leakage guard: 正答前に具体的反例を本文へ出さない

---

# 2. (2)

前件

\[
a^2=4
\]

から

\[
a=2\quad\text{または}\quad a=-2
\]

の2ケースを両方確認する。

\[
a=2:\ |a+1|=3\ge1
\]

\[
a=-2:\ |a+1|=1\ge1
\]

どちらでも後件が成り立つので (2) は真。

Thinking node:
- 105-p2-result
  - correct: 「a=±2 の両方で後件成立 → 真」
  - risk: a=2 だけ見て終わらない

---

# 3. (3)

「積が有理数」から各因子まで有理数とは限らない。

たとえば

\[
a=b=\sqrt2
\]

なら a,b は無理数だが、

\[
ab=2
\]

は有理数。

したがって反例があり、(3) は偽。

Thinking node:
- 105-p3-result
  - correct: 「a=b=√2 が反例 → 偽」
  - leakage guard: 正答前に √2 の反例を出さない

---

# 4. (4)

和と積の両方が有理数でも、a,b 自体が有理数とは限らない。

\[
a=\sqrt2,\qquad b=-\sqrt2
\]

なら

\[
a+b=0,\qquad ab=-2
\]

はいずれも有理数だが、a,b はともに無理数。

したがって (4) は偽。

Thinking node:
- 105-p4-result
  - correct: 「a=√2,b=-√2 が反例 → 偽」
  - purpose: 和と積を同時に満たす反例を作る
  - leakage guard: 正答前に具体的反例を出さない

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
- 前小問の反例・結論は次へ表示しない
- basis は compact dependency chip
- future subproblem reasoning は隠す
- completed full derivation は畳む

---

# 6. Hole quality audit

Keep:
- 真/偽の証明責任
- false case: 反例 + 真偽を一体で判断
- true case: 全ケース確認 + 真を一体で判断

Do not create:
- a,b の値を別々に細切れ穴
- 計算結果 1,2,3 だけの穴
- 反例を示した後に「偽」をもう一度単独で聞く重複穴

---

# 7. Rendering / mobile audit

Required:
- \(\Rightarrow,\ge,\ne,\sqrt{}\) のTeXバックスラッシュ保持
- ±ケースの見落としなし
- raw TeX command wordsを表示しない
- 数式重複なし
- horizontal overflowなし
- Japanese/Chinese grading parity
- Chinese sourceに日本語かなを残さない
- mobile/desktop smoke

---

# 8. Acceptance gate before 106

105 must pass:
1. typecheck
2. source/catalog/parity tests
3. build
4. mobile smoke
5. desktop smoke
6. deploy

Only after this gate may problem 106 be enabled.

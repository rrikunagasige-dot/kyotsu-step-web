# MATH PRACTICE 106 CONTENT DESIGN
## 「条件から命題を読む」第9問

Status: PRE-IMPLEMENTATION CONTENT AUTHORITY

Source problem:
自然数全体を全体集合とし、

- p: 2の倍数
- q: 3の倍数

を満たす自然数全体の集合を、それぞれ \(P,Q\) とする。次の条件を満たす自然数全体の集合を \(P,Q\) を用いて表せ。

(1) 6の倍数

(2) 奇数

(3) 3の倍数で奇数

(4) 3の倍数でない奇数

Theme:
- 条件から命題を読む

Core idea:
- 「AでありB」は共通部分 \(A\cap B\)。
- 「Aでない」は全体集合に対する補集合。
- 各日本語条件を、まず P/Q またはその補集合へ分解してから集合演算へ直す。
- (1)〜(4) は common definitions だけを共有し、互いの答えを再利用しない。

---

# 0. 共通準備 — 日本語条件を集合演算へ直す

\(P\): 2の倍数、\(Q\): 3の倍数。

集合で条件を書くとき、

- 「AでありB」→ \(A\cap B\)
- 「Aでない」→ \(\overline A\)

と読む。

Thinking node:
- 106-rule
  - correct: 「かつ/であり→共通部分、でない→補集合」
  - purpose: 日本語条件を集合演算へ翻訳する基準

Result node:
- label: 集合表現の規則
- result: AND→∩、NOT→補集合

---

# 1. (1) 6の倍数

6の倍数は、必ず2の倍数であり、3の倍数でもある。

したがって「P と Q の両方に入る自然数」を表せばよい。

Thinking node:
- 106-p1-result
  - correct: \(P\cap Q\)
  - purpose: 6の倍数を共通部分として読む

---

# 2. (2) 奇数

自然数の中で奇数とは、2の倍数でない数である。

P が2の倍数全体なので、その外側を取る。

Thinking node:
- 106-p2-result
  - correct: \(\overline P\)
  - purpose: “2の倍数でない”を補集合へ直す

---

# 3. (3) 3の倍数で奇数

「3の倍数」は Q。

「奇数」は P の補集合。

「で」は2条件を同時に満たす意味なので、両方の共通部分を取る。

Thinking node:
- 106-p3-result
  - correct: \(Q\cap\overline P\)
  - purpose: 原子条件→集合→AND の順で組み立てる

---

# 4. (4) 3の倍数でない奇数

「3の倍数でない」は Q の補集合。

「奇数」は P の補集合。

この2条件を同時に満たすので共通部分を取る。

Thinking node:
- 106-p4-result
  - correct: \(\overline Q\cap\overline P\)
  - purpose: 2つの否定条件をそれぞれ補集合にしてからANDする

---

# 5. Current-stage compression

Target order:
1. basis
2. s1
3. s2
4. s3
5. s4

Rules:
- 各小問は basis のみに依存
- common definitions \(P,Q\) は常に前提として利用
- 前小問の result は次の小問へ表示しない
- basis は compact dependency chip
- future subproblem reasoning は隠す
- completed full derivation は畳む

---

# 6. Hole quality audit

Keep:
- 日本語条件→集合演算の対応
- 各小問の最終集合式

Do not create:
- 「Pは2の倍数」のコピー穴
- ∩ 記号だけを文脈なしで当てる穴
- 前小問結果をコピーする穴

---

# 7. Rendering / mobile audit

Required:
- \(\cap,\overline{}\) のTeXバックスラッシュ保持
- 補集合バーが崩れない
- raw TeX command wordsを表示しない
- 数式重複なし
- horizontal overflowなし
- Japanese/Chinese grading parity
- Chinese sourceに日本語かなを残さない
- mobile/desktop smoke

---

# 8. Acceptance gate before 107

106 must pass:
1. typecheck
2. source/catalog/parity tests
3. build
4. mobile smoke
5. desktop smoke
6. deploy

Only after this gate may problem 107 be enabled.

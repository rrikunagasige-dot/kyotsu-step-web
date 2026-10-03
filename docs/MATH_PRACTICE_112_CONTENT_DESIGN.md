# MATH PRACTICE 112 CONTENT DESIGN
## 「命題を証明する」第4問

Status: PRE-IMPLEMENTATION CONTENT AUTHORITY

Source scope fixed by structure map:
既知「√3 は無理数」を用いて、次の2つの数が無理数であることを証明する。

(1) \(1+\sqrt3\)

(2) \(\dfrac{1}{2+\sqrt3}\)

Theme:
- 命題を証明する

Core idea:
- ゴールは「対象が無理数」で終わらず、既知の事実「√3 は無理数」と矛盾する形まで戻すこと。
- 対象を有理数と仮定し、有理数の加減・乗除で √3 まで取り出せれば、「√3 が有理数」となって矛盾する。
- (1),(2) は独立。共通して使うのは「√3 は無理数」と有理数の基本演算の閉性だけ。
- (2) は先に有理化して \(2-\sqrt3\) へ直すことで、(1)と同じ論理構造へ近づける。

---

# 0. 共通準備 — 何を矛盾させるか

既知:
\[
\sqrt3\notin\mathbb Q
\]

証明したい数をいったん有理数と仮定し、その仮定から
\[
\sqrt3\in\mathbb Q
\]
を導けば、既知の事実と矛盾する。

Thinking node:
- 112-rule
  - correct: 「対象を有理数と仮定し、√3 が有理数になることを導いて矛盾させる」
  - purpose: contradiction target を固定する
  - avoid: “背理法”という用語だけを名前当てさせる

Result node:
- label: 矛盾の目標
- result: √3 が有理数になれば矛盾

---

# 1. (1) \(1+\sqrt3\)

\(r=1+\sqrt3\) が有理数だと仮定する。

1 は有理数なので、有理数 r から1を引いた
\[
r-1
\]
も有理数である。

しかし、
\[
r-1=\sqrt3
\]
だから、√3 が有理数になってしまう。

これは「√3 は無理数」に矛盾。

したがって、
\[
1+\sqrt3
\]
は無理数である。

Thinking nodes:
- 112-p1-operation
  - correct: 「r=1+√3 とおけば √3=r-1。r,1 が有理数なら r-1 も有理数」
  - purpose: rational closure を使って √3 を取り出す
- 112-p1-conclusion
  - correct: 「√3 が有理数となり既知事実と矛盾 → 1+√3 は無理数」
  - purpose: contradiction を元の主張へ戻す

Leakage guard:
- p1-operation前に \(\sqrt3=r-1\) を結論として表示しない
- p1-conclusion前に「矛盾だから無理数」を本文に書き切らない

---

# 2. (2) \(\dfrac1{2+\sqrt3}\)

まず対象を扱いやすい形へ変形する。

\[
\frac1{2+\sqrt3}
=
\frac{2-\sqrt3}{(2+\sqrt3)(2-\sqrt3)}
=
2-\sqrt3
\]

ここで
\[
s=2-\sqrt3
\]
が有理数だと仮定する。

2 は有理数なので、
\[
\sqrt3=2-s
\]
も有理数になってしまう。

これは「√3 は無理数」に矛盾。

したがって、
\[
\frac1{2+\sqrt3}
\]
は無理数である。

Thinking nodes:
- 112-p2-transform
  - correct: \(\frac1{2+\sqrt3}=2-\sqrt3\)
  - purpose: 共役を使って分母を有理化し、√3 を取り出せる形にする
- 112-p2-operation
  - correct: 「s=2-√3 が有理数なら √3=2-s も有理数」
  - purpose: rational closure + contradiction target
- 112-p2-conclusion
  - correct: 「√3 の無理性と矛盾 → 元の数は無理数」
  - purpose: transformed expression から original target へ戻す

---

# 3. Current-stage compression

Target order:
1. basis
2. p1-operation
3. p1-conclusion
4. p2-transform
5. p2-operation
6. p2-conclusion

Rules:
- p1,p2 are independent after basis
- p1 details disappear when p2 begins
- p2-operation imports only the transform result \(1/(2+\sqrt3)=2-\sqrt3\)
- p2-conclusion imports only the immediately required contradiction result
- future steps hidden
- no repeated full derivation

---

# 4. Hole quality audit

Keep:
- contradiction target
- rational closure operation that isolates √3
- rationalization in (2)
- contradiction → original irrational conclusion

Do not create:
- “1” or “2” number-only holes
- “有理数/無理数” labels with no reasoning
- numerator/denominator micro-holes during rationalization
- separate holes for every algebraic symbol

---

# 5. Rendering / mobile audit

Required:
- \(\sqrt3\)
- \(\mathbb Q\)
- fraction \(\frac1{2+\sqrt3}\)
- conjugate product \((2+\sqrt3)(2-\sqrt3)\)
- no raw sqrt / frac / mathbb
- rationalization does not overflow mobile
- Japanese/Chinese grading parity
- Chinese source has no Japanese kana
- mobile/desktop smoke

---

# 6. Acceptance gate before 113

112 must pass:
1. typecheck
2. source/catalog/parity tests
3. build
4. mobile smoke
5. desktop smoke
6. deploy

Only after this gate may problem 113 be enabled.

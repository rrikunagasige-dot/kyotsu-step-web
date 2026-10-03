# MATH PRACTICE 112 CONTENT DESIGN
## 「命題を証明する」第4問

Status: PRE-IMPLEMENTATION CONTENT AUTHORITY

Source problem:
\(\sqrt3\) が無理数であることを用いて、次の数が無理数であることを証明せよ。

(1) \(1+\sqrt3\)

(2) \(\dfrac{1}{2+\sqrt3}\)

Theme:
- 命題を証明する

Core idea:
- 既知の事実「\(\sqrt3\) は無理数」を contradiction target として使う。
- 無理数であることを直接示すのではなく、対象が有理数だと仮定し、四則演算によって \(\sqrt3\) が有理数になってしまう矛盾を作る。
- (1),(2) は独立。
- 共通 prerequisite は「有理数どうしの和・差・積・0でない有理数による商は有理数」と「\(\sqrt3\) は無理数」。

---

# 0. 共通準備 — 背理法のゴール

対象の数が無理数であることを示したい。

そこで対象が有理数だと仮定し、既知の無理数 \(\sqrt3\) を
「有理数だけから作れる式」
として表せれば、

\[
\sqrt3\in\mathbb Q
\]

となって既知の事実と矛盾する。

Thinking node:
- 112-rule
  - correct: 「対象を有理数と仮定し、\(\sqrt3\) が有理数になる矛盾を作る」
  - purpose: 背理法の contradiction target を固定

Result node:
- label: 背理法の方針
- result: 対象 rational assumption → \(\sqrt3\) rational contradiction

---

# 1. (1) \(1+\sqrt3\)

## 穴なし完成文章

\(1+\sqrt3\) が有理数だと仮定する。

ある有理数 \(r\) を用いて、

\[
1+\sqrt3=r
\]

と書ける。

両辺から1を引けば、

\[
\sqrt3=r-1
\]

である。

\(r\) と1は有理数なので \(r-1\) も有理数。

したがって \(\sqrt3\) が有理数になってしまう。

しかし \(\sqrt3\) は無理数であることが既知なので矛盾。

よって \(1+\sqrt3\) は無理数である。

Thinking nodes:
- 112-p1-assumption
  - correct: 「\(1+\sqrt3\) は有理数」と仮定
  - purpose: 背理法の反対仮定を正しく作る
- 112-p1-isolate
  - correct: \(\sqrt3=r-1\)
  - purpose: contradiction target を単独にする
- 112-p1-contradiction
  - correct: 「右辺は有理数 → \(\sqrt3\) が有理数になり矛盾 → 元の数は無理数」
  - purpose: rational-closureと既知事実をつなぐ

Leakage guard:
- isolate before answer: do not show \(r-1\)
- contradiction before answer: do not state final irrational conclusion

---

# 2. (2) \(\dfrac1{2+\sqrt3}\)

## 穴なし完成文章

そのままでは \(\sqrt3\) が分母にあるので、まず分母を有理化する。

\[
\frac1{2+\sqrt3}
\cdot
\frac{2-\sqrt3}{2-\sqrt3}
=
\frac{2-\sqrt3}{4-3}
=
2-\sqrt3
\]

したがって、

\[
\frac1{2+\sqrt3}=2-\sqrt3
\]

である。

ここで \(\dfrac1{2+\sqrt3}\) が有理数だと仮定し、その値を有理数 \(r\) とする。

すると、

\[
2-\sqrt3=r
\]

なので、

\[
\sqrt3=2-r
\]

となる。

\(2\) と \(r\) は有理数なので \(2-r\) も有理数。

したがって \(\sqrt3\) が有理数になり、既知の事実と矛盾する。

よって \(\dfrac1{2+\sqrt3}\) は無理数である。

Thinking nodes:
- 112-p2-rationalize
  - correct: \(\frac{2-\sqrt3}{2-\sqrt3}\) を掛けて \(2-\sqrt3\)
  - purpose: conjugate choice + rationalization as one meaningful step
- 112-p2-assumption
  - correct: 「値を有理数 \(r\) と仮定し、\(2-\sqrt3=r\)」
  - purpose: rationalized expressionへ背理法仮定を接続
- 112-p2-isolate
  - correct: \(\sqrt3=2-r\)
  - purpose: known irrationalを単独化
- 112-p2-contradiction
  - correct: 「右辺は有理数 → contradiction → original is irrational」
  - purpose: proof closure

Important:
- rationalization itself is not the proof goal; it is a representation change that makes the contradiction accessible.
- do not ask separately for numerator \(2-\sqrt3\), denominator \(4-3\), and final \(2-\sqrt3\) as three trivial holes.

---

# 3. Current-stage compression

Target order:
1. basis
2. p1-assumption
3. p1-isolate
4. p1-contradiction
5. p2-rationalize
6. p2-assumption
7. p2-isolate
8. p2-contradiction

Rules:
- (1),(2) both depend on basis only.
- within each subproblem, later stage may import only the immediately required result.
- after (1) completes, its derivation disappears from default view.
- (2) does not import the result of (1).
- future proof steps stay hidden.
- compact result link only when current reasoning explicitly needs the prior result.

---

# 4. Hole quality audit

Keep:
- contradiction target
- rational assumption
- isolate \(\sqrt3\)
- conjugate rationalization
- rational-closure contradiction

Do not create:
- “有理数/無理数” after the conclusion has already been shown
- denominator \(4-3=1\) as a standalone arithmetic hole
- the “1” or “2” constants as isolated number holes
- final “無理数” as a duplicate label-only hole

---

# 5. Rendering / mobile audit

Required:
- \(\sqrt3\)
- \(\frac1{2+\sqrt3}\)
- \(\frac{2-\sqrt3}{2-\sqrt3}\)
- \(\sqrt3=r-1\)
- \(\sqrt3=2-r\)

Required QA:
- radicals and fractions render through the same KaTeX path
- no raw \texttt{sqrt}, \texttt{frac}
- no duplicate fraction rendering
- long rationalization line must not overflow mobile
- Japanese/Chinese grading parity
- Chinese source contains no Japanese kana
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

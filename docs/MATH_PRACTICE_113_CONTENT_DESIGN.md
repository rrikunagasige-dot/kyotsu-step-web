# MATH PRACTICE 113 CONTENT DESIGN
## 「命題を証明する」第5問

Status: PRE-IMPLEMENTATION CONTENT AUTHORITY

Source problem:
実数 \(x\) が正の無理数であるとき、\(\sqrt{x}\) は無理数であることを証明せよ。

Theme:
- 命題を証明する

Core idea:
- 背理法で \(\sqrt{x}\) が有理数だと仮定する。
- ある有理数 \(r\) を用いて \(\sqrt{x}=r\) と置く。
- 両辺を2乗して \(x=r^2\)。
- 有理数の平方は有理数なので \(x\) が有理数になってしまう。
- しかし仮定では \(x\) は無理数。矛盾。
- よって \(\sqrt{x}\) は無理数。
- 問題の「\(x>0\)」は実数平方根 \(\sqrt{x}\) を扱う前提として重要だが、矛盾そのものは \(x\) の無理性と衝突することで生じる。

---

# 0. 共通準備 — contradiction target

示したい結論は、
\[
\sqrt{x}\text{ は無理数}
\]

背理法では反対に、
\[
\sqrt{x}\text{ は有理数}
\]
と仮定する。

ここから元の \(x\) が有理数になれば、
「\(x\) は無理数」という問題の条件と矛盾する。

Thinking node:
- 113-assumption
  - correct: 「\(\sqrt{x}\) は有理数」と仮定
  - purpose: 背理法の反対仮定と contradiction target を明確にする

Result node:
- label: 反対仮定

---

# 1. 有理数 r で表す

\(\sqrt{x}\) が有理数なら、ある有理数 \(r\) を使って

\[
\sqrt{x}=r
\]

と書ける。

この式から元の \(x\) を取り戻すには、両辺を2乗する。

Thinking node:
- 113-operation
  - correct: 両辺を2乗
  - purpose: root expressionからoriginal variableへ戻す操作選択

---

# 2. x を取り出す

両辺を2乗すると、

\[
x=r^2
\]

である。

\(r\) は有理数なので、\(r^2\) も有理数。

したがって \(x\) は有理数になってしまう。

Thinking node:
- 113-square-result
  - correct: \(x=r^2\), \(r^2\) is rational
  - purpose: rational closure under multiplicationを証明の核心へつなぐ

Result node:
- label: 2乗して得た式
- result: \(x=r^2\)

---

# 3. 矛盾と結論

問題の仮定では \(x\) は無理数である。

しかし背理法の仮定から \(x\) は有理数と導かれた。

これは矛盾。

したがって反対仮定
「\(\sqrt{x}\) は有理数」
は誤りであり、

\[
\sqrt{x}\text{ は無理数}
\]

である。

Thinking node:
- 113-contradiction
  - correct: rational x contradicts given irrational x → \(\sqrt{x}\) irrational
  - purpose: proof closure

Leakage guard:
- contradiction node前に最終結論を本文で確定させない
- \(x=r^2\) をoperation node前に出さない

---

# 4. Current-stage compression

Target order:
1. assumption
2. operation
3. square-result
4. contradiction

Dependencies:
- operation ← assumption
- square-result ← operation
- contradiction ← square-result

Rules:
- linear proof chain
- only immediately required previous result appears as compact dependency
- completed full derivation collapses
- future result remains hidden
- no repeated final-answer hole

---

# 5. Hole quality audit

Keep:
- contradiction assumption
- operation “square both sides”
- \(x=r^2\) + rational closure
- final contradiction

Do not create:
- “有理数/無理数” as repeated isolated vocabulary holes after meaning is already fixed
- exponent 2 as a number-only hole
- \(r\) naming itself as a separate low-value hole
- final “無理数” duplicate after the contradiction is already written

---

# 6. Rendering / mobile audit

Required:
- \(\sqrt{x}\)
- \(\sqrt{x}=r\)
- \(x=r^2\)

Required QA:
- radical and superscript rendered by KaTeX
- no raw sqrt command
- no duplicate formula
- mobile no horizontal overflow
- Japanese/Chinese grading parity
- Chinese source contains no Japanese kana
- mobile/desktop smoke

---

# 7. Acceptance gate before 114

113 must pass:
1. typecheck
2. source/catalog/parity tests
3. build
4. mobile smoke
5. desktop smoke
6. deploy

Only after this gate may problem 114 be enabled.

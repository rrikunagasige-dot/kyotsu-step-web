# MATH PRACTICE 109 CONTENT DESIGN
## 「条件から命題を読む」第11問

Status: PRE-IMPLEMENTATION CONTENT AUTHORITY

Source problem:
次の命題の否定を述べよ。また、もとの命題とその否定の真偽を調べよ。

(1) すべての実数 \(x\) について \((x-1)^2\ne0\)

(2) ある自然数 \(n\) について \(n^2=5n\)

Theme:
- 条件から命題を読む

Core idea:
- 「すべて〜」の否定は「ある〜で成り立たない」。
- 「ある〜」の否定は「すべて〜で成り立たない」。
- 量化語だけでなく、内部条件も同時に否定する。
- 元命題と否定は必ず真偽が反対になるが、答えを先にそれだけで決めず、具体的な検証を行う。
- (1),(2) は common quantifier rule だけを共有し、互いの計算結果は持ち越さない。

---

# 0. 共通準備 — 量化命題の否定

\[
\neg(\forall x,\ P(x))
\iff
\exists x,\ \neg P(x)
\]

\[
\neg(\exists x,\ P(x))
\iff
\forall x,\ \neg P(x)
\]

Thinking node:
- 109-rule
  - correct:
    - すべて → ある + 条件の否定
    - ある → すべて + 条件の否定
  - purpose: quantifier と内部条件を同時に反転する基準を作る

Result node:
- label: 量化命題の否定規則

---

# 1. (1)

元命題:
\[
\forall x\in\mathbb R,\ (x-1)^2\ne0
\]

その否定は、
\[
\exists x\in\mathbb R,\ (x-1)^2=0
\]
である。

実際、
\[
x=1
\]
なら
\[
(x-1)^2=0
\]
となる。

したがって、
- 元命題: 偽
- 否定: 真

Thinking nodes:
- 109-p1-negation
  - correct: 「ある実数 x について \((x-1)^2=0\)」
  - purpose: forall + ≠ を exists + = へ同時に否定
- 109-p1-truth
  - correct: 「x=1 が否定を満たすので、元は偽・否定は真」
  - purpose: counterexample と truth pair を一体で判断
  - leakage guard: truth node前に x=1 を正答として本文へ出さない

---

# 2. (2)

元命題:
\[
\exists n\in\mathbb N,\ n^2=5n
\]

否定は、
\[
\forall n\in\mathbb N,\ n^2\ne5n
\]
である。

元命題を調べるため、
\[
n^2-5n=0
\]
を解く。

\[
n(n-5)=0
\]

より、
\[
n=0,\quad 5
\]

となる。

このうち \(n=5\) は自然数なので、条件を満たす自然数が実際に存在する。

したがって、
- 元命題: 真
- 否定: 偽

Thinking nodes:
- 109-p2-negation
  - correct: 「すべての自然数 n について \(n^2\ne5n\)」
  - purpose: exists + = を forall + ≠ へ否定
- 109-p2-solve
  - correct: \(n(n-5)=0\Rightarrow n=0,5\)
  - purpose: existence check の候補を計算で出す
- 109-p2-truth
  - correct: 「n=5 が自然数として使えるので元は真・否定は偽」
  - purpose: 候補と定義域を照合してtruth pairを決める

---

# 3. Current-stage compression

Target order:
1. basis
2. s1
3. s2

Rules:
- s1,s2 は basis のみに依存
- (1) の x=1 や真偽を (2) に持ち越さない
- basis は compact dependency chip
- 各小問内では否定 → 検証 → 真偽の順にprogressive reveal
- future reasoningは隠す
- completed subproblem full derivationは畳む

---

# 4. Hole quality audit

Keep:
- quantifier negation rule
- completed negation statement
- counterexample + truth pair
- factorization + solution candidates
- natural-number domain check + truth pair

Do not create:
- 「ある/すべて」だけの単語穴を量産
- 「=/≠」だけを単独で選ばせる穴
- x=1 の数字だけを当てる穴
- 元命題の真偽と否定の真偽を別々のコピー穴にする

---

# 5. Rendering / mobile audit

Required:
- \(\forall,\exists,\ne,\mathbb R,\mathbb N\) のTeX保持
- raw forall / exists / ne / mathbb を表示しない
- quantifier式がmobileで横にはみ出さない
- 数式重複なし
- Japanese/Chinese grading parity
- Chinese sourceに日本語かなを残さない
- mobile/desktop smoke

---

# 6. Acceptance gate before 110

109 must pass:
1. typecheck
2. source/catalog/parity tests
3. build
4. mobile smoke
5. desktop smoke
6. deploy

Only after this gate may problem 110 be enabled.

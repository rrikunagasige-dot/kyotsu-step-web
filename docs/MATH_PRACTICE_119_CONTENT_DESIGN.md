# MATH PRACTICE 119 CONTENT DESIGN
## 「条件から命題を読む」第13問

Status: PRE-IMPLEMENTATION PREP ONLY
Do not enable 119 until 118 passes its gate.

Source:
\[
f(x)=3x-2,\qquad g(x)=2x^2-3x+1
\]

Find:
\[
f(0),f(2),f(-1),f(a),f(a+1),
\]
\[
g(0),g(3),g(-2),g(-a),g(a-1).
\]

Theme:
- 条件から命題を読む

Type:
- C + I

Core rule:
- 指定された入力を、式中のすべての \(x\) に置き換える。
- 負数や式を入れるときは括弧を保つ。
- 前の小問の結果は次の小問に不要。

Correct values:
\[
f(0)=-2,\quad f(2)=4,\quad f(-1)=-5,
\]
\[
f(a)=3a-2,\quad f(a+1)=3a+1.
\]

\[
g(0)=1,\quad g(3)=10,\quad g(-2)=15,
\]
\[
g(-a)=2a^2+3a+1,
\]
\[
g(a-1)=2a^2-7a+6.
\]

Recommended current-stage order:
1. basis — substitution rule
2. f0
3. f2
4. f-minus1
5. fa
6. fa1-substitute
7. fa1-simplify
8. g0
9. g3
10. g-minus2
11. g-minus-a-substitute
12. g-minus-a-simplify
13. g-a-minus1-substitute
14. g-a-minus1-expand
15. g-a-minus1-simplify

Detailed no-blank derivations:

## f(0)
\[
f(0)=3\cdot0-2=-2
\]

## f(2)
\[
f(2)=3\cdot2-2=4
\]

## f(-1)
\[
f(-1)=3(-1)-2=-5
\]

## f(a)
\[
f(a)=3a-2
\]

## f(a+1)
First preserve the input:
\[
f(a+1)=3(a+1)-2
\]
Then simplify:
\[
f(a+1)=3a+1.
\]

## g(0)
\[
g(0)=2\cdot0^2-3\cdot0+1=1
\]

## g(3)
\[
g(3)=2\cdot3^2-3\cdot3+1=10
\]

## g(-2)
Parentheses matter:
\[
g(-2)=2(-2)^2-3(-2)+1=15
\]

## g(-a)
Replace both occurrences of x:
\[
g(-a)=2(-a)^2-3(-a)+1
\]
Use
\[
(-a)^2=a^2
\]
to get
\[
g(-a)=2a^2+3a+1.
\]

## g(a-1)
Replace both x's:
\[
g(a-1)=2(a-1)^2-3(a-1)+1.
\]
Expand:
\[
(a-1)^2=a^2-2a+1
\]
so
\[
2(a^2-2a+1)-3a+3+1
\]
and finally
\[
g(a-1)=2a^2-7a+6.
\]

Hole-quality rules:
- Simple numeric items may use one meaningful chain hole: substitution + result.
- Expression inputs should separate “substitute with parentheses” from “expand/simplify”.
- Do not make isolated holes for only a minus sign, exponent 2, or final number after the whole calculation is already shown.
- 10 items means current-item-only display is mandatory.

Rendering risks:
- \(g(-2)\), \(g(-a)\), \(g(a-1)\): parentheses must survive.
- superscript \(2\)
- multiline expansion for \(g(a-1)\)
- no mobile overflow.

Acceptance gate before 120:
- typecheck
- source/parity tests
- build
- mobile/desktop smoke
- deploy


---

# Implementation-ready thinking nodes

Common basis:
- 119-rule
  - correct: 「指定された入力で、式中のすべての x を置き換える。負数や式は括弧を保つ。」
  - distractors:
    - 最初の x だけ置き換える
    - 計算結果だけを暗記する

Numeric items:
- 119-f0
  - correct chain: \(3(0)-2=-2\)
- 119-f2
  - correct chain: \(3(2)-2=4\)
- 119-fm1
  - correct chain: \(3(-1)-2=-5\)
- 119-g0
  - correct chain: \(2(0)^2-3(0)+1=1\)
- 119-g3
  - correct chain: \(2(3)^2-3(3)+1=10\)
- 119-gm2
  - correct chain: \(2(-2)^2-3(-2)+1=15\)

Symbolic items:
- 119-fa
  - correct: \(3a-2\)
- 119-fa1-substitute
  - correct: \(3(a+1)-2\)
- 119-fa1-simplify
  - correct: \(3a+1\)
- 119-gma-substitute
  - correct: \(2(-a)^2-3(-a)+1\)
- 119-gma-square
  - correct: \((-a)^2=a^2\)
- 119-gma-simplify
  - correct: \(2a^2+3a+1\)
- 119-ga1-substitute
  - correct: \(2(a-1)^2-3(a-1)+1\)
- 119-ga1-expand
  - correct: \((a-1)^2=a^2-2a+1\)
- 119-ga1-simplify
  - correct: \(2a^2-7a+6\)

Recommended grouping:
- numeric function values: one blank each, because substitution and arithmetic are one coherent action
- symbolic composite inputs: substitution and simplification are separate stages
- never carry f(0) etc. as dependency results into later items

Leakage checks:
- do not show simplified \(3a+1\) while asking for substitution \(3(a+1)-2\)
- do not show \(2a^2+3a+1\) before learner handles \((-a)^2\)
- do not show expansion \(a^2-2a+1\) before the \(g(a-1)\) substitution stage is resolved

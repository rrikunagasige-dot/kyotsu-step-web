# MATH PRACTICE 114 CONTENT DESIGN
## 「命題を証明する」第6問

Status: PRE-IMPLEMENTATION CONTENT AUTHORITY

Source problem:
m,n は整数とする。次の命題を証明せよ。

(1) \(n^2\) が5の倍数ならば、n は5の倍数である。

(2) \(mn\) が3の倍数ならば、m,n の少なくとも一方は3の倍数である。

Theme:
- 命題を証明する

Core idea:
- 直接「平方や積が倍数なら因子も倍数」をほどくより、対偶にして「倍数でない整数の余り」を調べる。
- (1) は mod 5 で非0余り \(1,2,3,4\) の平方が0にならないことを示す。
- (2) は mod 3 で非0余り \(1,2\) の積が0にならないことを示す。
- (1),(2) は独立。
- 余りを1個ずつ穴にするのではなく、分類→全ケース検証→対偶結論を意味単位で扱う。

---

# 1. (1) — \(n^2\) が5の倍数なら n は5の倍数

## 証明方針

直接証明より、対偶

「n が5の倍数でないならば、\(n^2\) は5の倍数でない」

を示す。

Thinking node:
- 114-p1-plan
  - correct: 上記の対偶
  - purpose: direct claim を residue check に変換する

Result node:
- label: (1) の対偶

## 余りの分類

n が5の倍数でない整数なら、5で割った余りは

\[
1,\ 2,\ 3,\ 4
\]

のいずれか。

Thinking node:
- 114-p1-residues
  - correct: 1,2,3,4
  - purpose: nonmultiple-of-5 conditionを有限ケースへ変換

## 平方を全部確認

\[
1^2\equiv1\pmod5
\]

\[
2^2\equiv4\pmod5
\]

\[
3^2\equiv4\pmod5
\]

\[
4^2\equiv1\pmod5
\]

どの場合も余り0にならない。

よって n が5の倍数でないなら \(n^2\) も5の倍数でない。

対偶が真なので元命題も真。

Thinking node:
- 114-p1-squares
  - correct: square residues \(1,4,4,1\), none 0 → contrapositive true
  - purpose: exhaustive residue proof
  - do not split into four arithmetic holes

---

# 2. (2) — \(mn\) が3の倍数なら m,n の少なくとも一方は3の倍数

## 証明方針

後件
「m,n の少なくとも一方は3の倍数」
の否定は、

「m,n はどちらも3の倍数でない」。

したがって対偶は、

「m,n がどちらも3の倍数でないならば、mn は3の倍数でない」。

Thinking node:
- 114-p2-plan
  - correct: 上記対偶
  - purpose: “少なくとも一方”の否定を AND に正しく変える

Result node:
- label: (2) の対偶

## 余りの分類

3の倍数でない整数を3で割った余りは、

\[
1,\ 2
\]

のいずれか。

したがって m,n の余りの組は

\[
(1,1),(1,2),(2,1),(2,2)
\]

の4通り。

Thinking node:
- 114-p2-residues
  - correct: each residue is 1 or2
  - purpose: two-variable conditionを有限ケースへ変換

## 積を全部確認

各組で mn の余りは、

\[
1\cdot1\equiv1,\quad
1\cdot2\equiv2,\quad
2\cdot1\equiv2,\quad
2\cdot2\equiv1
\pmod3
\]

となる。

どの場合も0ではないので mn は3の倍数でない。

対偶が真なので、元命題も真。

Thinking node:
- 114-p2-products
  - correct: product residues \(1,2,2,1\), none0 → contrapositive true
  - purpose: all residue combinationsを一度に検証
  - do not split four products into four trivial holes

---

# 3. Current-stage compression

Target order:
1. p1-plan
2. p1-residues
3. p1-squares
4. p2-plan
5. p2-residues
6. p2-products

Dependencies:
- p1-residues ← p1-plan
- p1-squares ← p1-residues
- p2-residues ← p2-plan
- p2-products ← p2-residues

Rules:
- (1) completion after p1-squares; full derivation collapses before (2).
- (2) does not import (1) results.
- only current subproblem + required prior result is visible.
- future residue/product conclusions stay hidden.

---

# 4. Hole quality audit

Keep:
- choosing/constructing the useful contrapositive
- residue-class classification
- all-case modular conclusion

Do not create:
- each residue 1,2,3,4 as separate holes
- each square/product arithmetic result as separate holes
- “0になる/ならない” after the full residue table is already shown
- strategy hole with no mathematical consequence

---

# 5. Rendering / mobile audit

Required:
- \(n^2\), \(mn\)
- congruences mod5 / mod3
- four residue cases
- no raw TeX commands
- modular row must wrap/stack safely on mobile
- Japanese/Chinese grading parity
- Chinese source contains no Japanese kana
- mobile/desktop smoke

---

# 6. Acceptance gate before 115

114 must pass:
1. typecheck
2. source/catalog/parity tests
3. build
4. mobile smoke
5. desktop smoke
6. deploy

Only after this gate may problem 115 be enabled.

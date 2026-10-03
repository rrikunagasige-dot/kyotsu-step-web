# MATH PRACTICE 101 CONTENT DESIGN
## 「条件から命題を読む」第4問

Status: PRE-IMPLEMENTATION CONTENT AUTHORITY

Source problem:
x,y は実数とする。次の条件の否定を述べよ。

(1) \(x>-5\)

(2) \(x+y\ne0\)

(3) x は有理数である

Theme:
- 条件から命題を読む

Core idea:
- 条件の否定は、「元の条件が成り立たないすべての場合」を表す。
- 実数全体を考えるとき、条件が表す集合の補集合として読める。
- (1)〜(3) は独立。
- 完了した小問の答えを次の小問へ持ち越さない。

---

# 0. 共通準備 — 否定とは何か

## 穴なし完成文章

条件 \(p\) の否定とは、\(p\) が成り立たない場合をすべて表す条件である。

条件 \(p\) を満たす実数全体の集合を \(P\) とすれば、否定を満たす集合はその補集合になる。

したがって、不等号や等号の記号だけを機械的に変えるのではなく、「元の条件が成り立たない範囲を漏れなく表しているか」を確認する。

## Thinking node

- 101-rule
  - prompt: 「条件 p の否定が表すのは」
  - correct: 「p が成り立たないすべての場合」
  - purpose: 単純条件の否定を補集合として読む共通基準を作る

Result node:
- label: 否定の基準
- result: 元の条件が成り立たないすべての場合

---

# 1. (1) \(x>-5\)

## 穴なし完成文章

\(x>-5\) が成り立たないのは、\(-5\) より小さい場合だけではない。

境界の \(x=-5\) も元の条件 \(x>-5\) を満たさない。

したがって、否定は

\[
x\le -5
\]

である。

## Thinking node

- 101-p1-result
  - prompt: 「\(x>-5\) の否定は」
  - correct: \(x\le -5\)
  - distractor focus:
    - \(x<-5\): 境界 \(-5\) を落とす
    - \(x\ge -5\): 向きが逆
  - purpose: 厳密不等号の否定では境界を含めることを理解する

Do not create:
- 「-5は入る／入らない」だけの別穴
- 記号をコピーするだけの重複穴

---

# 2. (2) \(x+y\ne0\)

## 穴なし完成文章

\(x+y\ne0\) は、「\(x+y\) が0ではない」という条件である。

この条件が成り立たないのは、ちょうど

\[
x+y=0
\]

の場合である。

したがって、否定は \(x+y=0\) である。

## Thinking node

- 101-p2-result
  - prompt: 「\(x+y\ne0\) の否定は」
  - correct: \(x+y=0\)
  - purpose: “not equal” の否定を等号へ戻す

---

# 3. (3) x は有理数である

## 穴なし完成文章

\(x\) は実数なので、\(x\) は有理数か無理数のどちらか一方である。

したがって、「\(x\) は有理数である」が成り立たない場合は、

「\(x\) は無理数である」

である。

## Thinking node

- 101-p3-result
  - prompt: 「実数 x が有理数であることの否定は」
  - correct: 「x は無理数である」
  - purpose: 実数全体で有理数の補集合を無理数として読む

Important:
- 定義域が実数であることを前提にする
- 「整数ではない」など、より広い集合へ誤って飛ばさない

---

# 4. Current-stage compression

Target order:

1. basis — 否定の基準
2. s1 — (1)
3. s2 — (2)
4. s3 — (3)

Rules:
- s1〜s3 は basis だけに依存
- 前の小問の答えは次の小問へ表示しない
- basis は compact dependency chip として残す
- 完了済みの長い説明は畳む
- future subproblem は隠す

---

# 5. Hole quality audit

Keep:
- 否定の意味
- 境界を含む不等号の否定
- \(\ne\) と \(=\) の反転
- 有理数の補集合

Do not create:
- 同じ結論を2回聞く穴
- 「≤ の記号だけ選ぶ」ような文脈のない穴
- 結論後のコピー穴

---

# 6. Rendering / mobile audit

Math surfaces:
- \(x>-5\)
- \(x\le-5\)
- \(x+y\ne0\)
- \(x+y=0\)

Required:
- TypeScript sourceのTeXバックスラッシュを保持
- raw TeX command wordsが学習者画面へ漏れない
- 数式の重複表示なし
- horizontal overflowなし
- Japanese/Chinese grading parity
- Chinese sourceに日本語かなを残さない
- mobile/desktop smoke

---

# 7. Acceptance gate before 102

101 must pass:
1. typecheck
2. source/catalog/parity tests
3. build
4. mobile browser smoke
5. desktop browser smoke
6. deploy

Only after this gate may problem 102 be enabled.

# MATH PRACTICE 115 CONTENT DESIGN
## 「命題を証明する」第7問

Status: PRE-IMPLEMENTATION CONTENT AUTHORITY

Source problem:
\(\sqrt6\) が無理数であることを用いて、
\[
\sqrt3-\sqrt2
\]
は無理数であることを証明せよ。

Theme:
- 命題を証明する

Type:
- P + L

Core idea:
- 既知の無理数 \(\sqrt6\) を contradiction target にする。
- \(\sqrt3-\sqrt2\) が有理数だと仮定し、その値を \(r\in\mathbb Q\) とおく。
- \(\sqrt3\sqrt2=\sqrt6\) を出すために両辺を2乗する。
- 2乗後、
  \[
  r^2 = 5-2\sqrt6
  \]
  から
  \[
  \sqrt6=\frac{5-r^2}{2}
  \]
  を得る。
- \(r\) が有理数なら右辺は有理数なので、\(\sqrt6\) が有理数となって既知事実と矛盾する。
- よって \(\sqrt3-\sqrt2\) は無理数。

Important:
- 112と同じ「既知の無理数へ矛盾を戻す」型だが、今回は contradiction target \(\sqrt6\) を式中に作るために「2乗」が本質。
- 2乗操作を「数字の2を埋める穴」にせず、「なぜ2乗するのか」という学習行為として扱う。
- 途中式を飛ばさず、\((\sqrt3-\sqrt2)^2\) の展開を自然な1つの導出として見せる。

---

# 0. S0 — 反対仮定

## 穴なし完成文章

示したいのは
\[
\sqrt3-\sqrt2
\]
が無理数であること。

背理法を使い、反対にこの数が有理数だと仮定する。

ある有理数 \(r\) を用いて
\[
\sqrt3-\sqrt2=r
\]
とおく。

Thinking node:
- 115-assumption
  - correct: 「\(\sqrt3-\sqrt2\) は有理数」と仮定し \(=\;r\) とおく
  - purpose: contradiction assumptionを具体化する

Result node:
- label: 反対仮定
- result: \(\sqrt3-\sqrt2=r,\ r\in\mathbb Q\)

---

# 1. S1 — \(\sqrt6\) を作る操作

既知の無理数は \(\sqrt6\)。

左辺には
\[
\sqrt3\sqrt2=\sqrt6
\]
という積が隠れている。

差 \(\sqrt3-\sqrt2\) から積 \(\sqrt3\sqrt2\) を作るには、
両辺を2乗するのが自然。

Thinking node:
- 115-operation
  - correct: 両辺を2乗
  - purpose: known irrational target \(\sqrt6\) を出すための操作選択
  - wrong choices: 3乗、逆数

Result node:
- label: \(\sqrt6\) を出す操作
- result: 両辺を2乗

---

# 2. S2 — 2乗して整理する

\[
(\sqrt3-\sqrt2)^2=r^2
\]

左辺を展開すると、
\[
3+2-2\sqrt6=r^2
\]

したがって、
\[
5-2\sqrt6=r^2
\]

ここから \(\sqrt6\) を単独にする。

Thinking node:
- 115-expand
  - correct: \(r^2=5-2\sqrt6\) または同値な \(5-2\sqrt6=r^2\)
  - purpose: 展開を飛ばさず known irrational targetを含む式まで到達する

Result node:
- label: 2乗後の式
- result: \(r^2=5-2\sqrt6\)

---

# 3. S3 — \(\sqrt6\) を単独にする

\[
r^2=5-2\sqrt6
\]

より、
\[
2\sqrt6=5-r^2
\]

したがって、
\[
\sqrt6=\frac{5-r^2}{2}
\]

Thinking node:
- 115-isolate
  - correct: \(\sqrt6=(5-r^2)/2\)
  - purpose: contradiction targetを有理数だけからなる式として表す

Result node:
- label: \(\sqrt6\) の式
- result: \(\sqrt6=(5-r^2)/2\)

---

# 4. S4 — 矛盾と結論

\(r\) は有理数。

したがって \(r^2\) も有理数であり、
\[
\frac{5-r^2}{2}
\]
も有理数。

よって \(\sqrt6\) が有理数になってしまう。

しかし \(\sqrt6\) は無理数であることが既知。

これは矛盾。

したがって反対仮定が誤りで、
\[
\sqrt3-\sqrt2
\]
は無理数である。

Thinking node:
- 115-contradiction
  - correct: RHS rational → \(\sqrt6\) rational contradiction → original irrational
  - purpose: rational closureと既知事実をつないでproofを閉じる

---

# 5. Current-stage compression

Target order:
1. assumption
2. operation
3. expand
4. isolate
5. contradiction

Dependencies:
- operation ← assumption
- expand ← operation
- isolate ← expand
- contradiction ← isolate

Rules:
- linear chain
- current stage only
- compact linkは直前に必要な結果だけ
- completed long derivationはdefaultで閉じる
- future expression \(\sqrt6=(5-r^2)/2\) をexpand stage前に見せない
- final conclusionをcontradiction stage前に確定表示しない

---

# 6. Hole quality audit

Keep:
- rational contradiction assumption
- why square
- full expansion result
- isolate \(\sqrt6\)
- rational-closure contradiction

Do not create:
- 「2」を単独で選ばせる穴
- \(3+2=5\) だけの算数穴
- \(-2\sqrt6\) の符号だけを当てる穴
- final “無理数”だけを選ぶ穴

---

# 7. Rendering / mobile audit

Required:
- \(\sqrt3-\sqrt2\)
- \((\sqrt3-\sqrt2)^2\)
- \(\sqrt3\sqrt2=\sqrt6\)
- \(r^2=5-2\sqrt6\)
- \(\sqrt6=(5-r^2)/2\)

Required QA:
- radicals and superscripts render correctly
- no raw sqrt / frac commands
- expansion line should wrap/stack safely on mobile
- no duplicate formula fragments
- Japanese/Chinese grading parity
- Chinese source contains no Japanese kana
- mobile/desktop smoke

---

# 8. Acceptance gate before 116

115 must pass:
1. typecheck
2. source/catalog/parity tests
3. build
4. mobile smoke
5. desktop smoke
6. deploy

Only after this gate may problem 116 be enabled.

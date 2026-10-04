# MATH LEARNING MODE — RESTORE BLUEPRINT 2026-10-04

Status: **DESIGN COMPLETE / IMPLEMENTATION NOT STARTED**

Scope:
- 数学・学習モードのみ
- review 3 unitのみ
- Math practice / Physics / Function / published math-sets は触らない

Authority:
1. MATHEMATICS_TEXTBOOK_MODE_MASTER_SKILL_v1
2. 2026-10-03 Math Learning Mode Recovery / Freeze contract
3. user-reviewed mathematics textbook-mode mother examples
4. current review implementation

This file is the implementation blueprint for restoring the current review units to the already-frozen mathematics learning-mode design.

---

# 1. Action vocabulary

## KEEP
thinking nodeとして正しい。概念サイクル内の位置も基本維持する。

## MOVE
thinking node自体は有効だが、導入例・概念化・即時例題の順序に合わせて位置を動かす。
必要ならpromptは「用語当て」から「数学的判断」へ直す。

## MERGE
数学的内容は残すが、独立した選択問題にはしない。
直前の回答後本文・意味説明へ吸収する。

## REMOVE
学習価値がなく、本文にも残す必要がない場合のみ使用する。

## ADD
現在ないthinking nodeまたは構造ブロックを追加する。
新しいsource内容を勝手に発明する意味ではない。

---

# 2. Master hole taxonomy

- A = 問題理解
- B = 復習
- C = 状態更新
- D = 方針選択
- E = 式生成
- F = 導出
- G = 理由
- H = 意味・解釈

名称・定義そのものを当てる穴は原則作らない。
概念名は具体例を解いた後に本文で教える。

---

# 3. math-propositions-reading

Current: 18 holes  
Restored target: **14 interactive thinking nodes**
- KEEP / MOVE: 14
- MERGE: 4
- REMOVE: 0

## Cycle R1 — 「pならばq」と命題

Natural question:
> 条件pを満たすとき、本当に必ずqも成り立つとはどういうことか。

Flow:
1. concrete source example: -2≤x≤1 → x<3
2. pを満たす範囲からqも必ず満たすか判断
3. 解けた後で「命題」「p⇒q」を導入
4. 集合P,Qで同じ関係を見る
5. P⊂Qとの対応を一般化

| id | master type | action | restored role |
|---|---|---|---|
| prop-a01 | A/H | KEEP | 最初の具体例で「pの全要素がqを満たすか」を判断。導入例題の中心thinking node。 |
| prop-a02 | H / representation | KEEP | 命題導入後、同じ内容を集合包含として読み替える。一般化への橋。 |

Structural ADD:
- a01回答後に concept block相当の明確な区切り:
  - 「今の文を命題という」
  - p⇒q
  - 真/偽の意味
- a02回答後:
  - p⇒q が真 ↔ P⊂Q
  - 図で確認

Do not add another quiz for the terminology.

## Cycle R2 — 反例

Natural question:
> 「すべてのpがqを満たす」という主張を、どうすれば一度で崩せるか。

Introduction:
x<2 ⇒ x>0

| id | master type | action | restored role |
|---|---|---|---|
| prop-a03 | A/G | KEEP | 前件○・後件×になる具体例を探す。反例概念導入前の核心。 |
| prop-a04 | H | KEEP | 見つけた1例が命題全体の真偽をどう変えるか解釈する。 |
| prop-a05 | A/G | KEEP | 概念化直後の即時例題。x²=9⇒x=3で自力で反例を探す。 |
| prop-a06 | H | MERGE into a05 post-answer prose | -3が見つかったため命題は偽、を本文で確認。独立choiceにしない。 |
| prop-a07 | A/G | KEEP | 支援を減らしたtransfer。図形へ表現領域を変える。 |
| prop-a08 | H | MERGE into a07 post-answer prose | 反例があるので偽、を回答後本文で確認。独立choiceにしない。 |

Concept placement:
- a03→a04 を解いた後に初めて
  > pを満たすのにqを満たさない例を反例という。
- figure-counterexample は concept explanation直後。

Restored rhythm:
```text
x<2⇒x>0
→ 反例を探す
→ その1例で偽と判断
→ 「反例」と命名
→ x²=9⇒x=3 で即時利用
→ 図形例でlight transfer
```

## Cycle R3 — 必要条件・十分条件

Natural question:
> p⇒qが真でも、q⇒pも真とは限らない。そのときpとqはどんな関係か。

Introduction:
長方形 → 対角線が等しい

| id | master type | action | restored role |
|---|---|---|---|
| prop-b01 | B/H | KEEP | 長方形の性質を使いp⇒qを確かめる。 |
| prop-b02 | G/H | KEEP | 逆向きq⇒pは成立しないことを図で判断。 |
| prop-b03 | terminology retrieval | MERGE into concept prose | 「AC=BDは必要条件」という同じ例の名称再回答はしない。定義説明の中で明示する。 |
| prop-b04 | D/H | MOVE + REWRITE | 即時例題として x²>0 と x>0 の「どちら向きが真か」を判断させる。回答後に「したがってpはqの必要条件」と本文で意味づけ。 |

Concept placement:
b01+b02回答後:
- p⇒qが真なら pはqの十分条件
- qはpの必要条件
- 今の長方形例では AC=BD は必要条件
- 用語を当てさせない

Then b04:
- terminology retrievalではなく、方向関係を自分で判断するtransferへ変える。

## Cycle R4 — 必要十分条件・同値

Natural question:
> 両方向が成り立つとき、二つの条件はどこまで同じと言えるか。

Introduction:
p: x=0
q: x(x²+1)=0

| id | master type | action | restored role |
|---|---|---|---|
| prop-b05 | G/H | KEEP | p⇒q と q⇒p の両方向を確認するconcept-formation node。 |
| prop-b06 | terminology retrieval | MERGE into concept prose | 「必要十分条件」をもう一度選ばせず、b05後に名称・p⇔qを本文で導入。 |

Concept placement:
b05回答後:
- 両方向が真
- 必要でも十分でもある
- 必要十分条件
- 同値
- p⇔q

No separate terminology quiz.

## Cycle R5 — 条件の否定

Natural question:
> 条件が「成り立たない」とは、元の条件のどの範囲を表すか。

| id | master type | action | restored role |
|---|---|---|---|
| prop-c01 | A/H | KEEP | n<2の外側を具体的に作る導入例。 |
| prop-c02 | H | KEEP | 「文そのものの否定」をすぐ使う単純例。 |
| prop-c03 | F/G | KEEP | 複合条件「かつ」の否定を一段考えるconcept-formation node。 |
| prop-c04 | F / transfer | KEEP | ド・モルガン導入直後、「または」の否定へlight transfer。 |

Concept placement:
- c01後: 「否定」= 条件の外側 / 補集合
- c03後: 条件版ド・モルガン
- c04: immediate transfer

This cycle is already close to MASTER and should be minimally changed.

---

# 4. math-quantifiers-all-exists

Current: 13 holes  
Restored target: **12 interactive thinking nodes**
- KEEP / MOVE: 12
- MERGE: 1
- REMOVE: 0

The main problem is ordering, not individual hole quality.

## Cycle Q1 — 「ある」と存在例

Natural question:
> 「ある〜」という主張は、何を1つ見つければ確かめられるか。

Introduction source example:
「ある素数の組(a,b)に対してabは偶数」

Current implementation starts with abstract rule a01.
MASTER requires concrete example first.

| id | master type | action | restored role |
|---|---|---|---|
| quant-a02 | A/G | MOVE before a01 | まず具体的な witness (2,3) を探す。導入例題の最初のthinking node。 |
| quant-a01 | H | MOVE after a02 + REWRITE | 「この1組が見つかっただけで『ある』命題を真と言えるか」の意味判断へ変更。抽象的に“何個必要か”から始めない。 |
| quant-a03 | F/H | KEEP | witnessを経験した後、「ある」の否定を作る。 |

Concept placement:
a02→a01後:
- 「ある」は存在する例が1つあれば成立
- witnessという英語名称をlearnerに新規導入する必要はない
- 「あるxに対してp」の意味を本文で整理

a03後:
- 否定すると「すべてのxに対してpでない」

Immediate example:
source ②へ。

## Cycle Q2 — 「ある」の否定を使う

Source example:
「ある実数xに対してx²=-1」

| id | master type | action | restored role |
|---|---|---|---|
| quant-b01 | G/H | KEEP | 実数の平方の性質から存在しないと判断。 |
| quant-b02 | F/H | KEEP | 学んだ「ある」の否定を即時適用。 |

This is a good immediate-example pair and should remain compact.

## Cycle Q3 — 「すべて」と反例

Natural question:
> 「すべて成り立つ」という主張は、何が1つ見つかれば崩れるか。

Introduction source example:
「すべての素数は奇数」

Current implementation starts with abstract c01.
Restore concrete-first.

| id | master type | action | restored role |
|---|---|---|---|
| quant-c02 | A/G | MOVE before c01 | まず具体的反例2を探す。 |
| quant-c01 | H | MOVE after c02 + REWRITE | 「反例2が1つあるだけで“すべて”命題は偽と言えるか」の意味判断へ変更。 |
| quant-c03 | F/H | KEEP | 具体的反例から否定文「ある素数は偶数」を作る。 |

Concept placement:
c02→c01後:
- 「すべて」は例外が1つでもあれば崩れる
- 反例との関係を本文で一般化

c03後:
- 「すべてxでp」の否定 = 「あるxでpでない」

## Cycle Q4 — 暗黙の「すべて」を読む

Source example:
「2つの無理数の積は無理数」

| id | master type | action | restored role |
|---|---|---|---|
| quant-d01 | A/H | KEEP | 文章に省略されたquantifierを読み取る。 |
| quant-d02 | E/F | KEEP | √2×√8 を計算して反例を具体化。 |
| quant-d03 | H / transfer | KEEP | 反例から否定文を作る。 |

This is a strong worked example.
Do not split further.
Do not add terminology quiz.

## Cycle Q5 — 最終light transfer

Source example:
「ひし形は平行四辺形」

| id | master type | action | restored role |
|---|---|---|---|
| quant-e01 | H / transfer | KEEP | 暗黙の「すべて」を理解した上で真偽判断。 |
| quant-e02 | H | MERGE into e01 post-answer prose | 元が真なので否定は偽、を独立choiceにしない。 |

End summary:
- 「ある」= 1つの成立例
- 「すべて」= 1つの反例で崩れる
- 否定で量化が入れ替わり、中の条件も否定される

No extra final quiz.

---

# 5. math-propositions-proof

Current: 23 holes  
Restored target: **20 interactive thinking nodes**
- KEEP / MOVE: 20
- MERGE: 3
- REMOVE: 0

This unit already contains strong worked-example chains.
Main repair is section A and explicit concept-cycle boundaries.

## Cycle P1 — 逆・裏・対偶を具体命題から作る

MASTER rule:
abstract p⇒q dictionary first is not ideal.
Start from one concrete proposition, then abstract.

Concrete source example:
x²=x ⇒ x=1

Restored introduction:
1. identify p and q in this concrete proposition
2. change the direction / negate conditions
3. after each operation, give the formal name
4. then generalize to p,q notation

| id | master type | action | restored role |
|---|---|---|---|
| proof-a01 | E / representation | MOVE + REWRITE | Generic q⇒pではなく、concrete reverse「x=1⇒x²=x」をまず作る。回答後「これを逆という」。 |
| proof-a02 | E / representation | MOVE + REWRITE | concrete inverse「x²≠x⇒x≠1」を作る。回答後「これを裏という」。 |
| proof-a03 | E / representation | MOVE + REWRITE | concrete contrapositive「x≠1⇒x²≠x」を作る。回答後「これを対偶という」。 |

After the concrete three:
ADD structural generalization block only, not a new hole:
- p⇒q
- 逆 q⇒p
- 裏 p̄⇒q̄
- 対偶 q̄⇒p̄

## Cycle P2 — 真偽関係を発見する

Use same concrete x-example first.

| id | master type | action | restored role |
|---|---|---|---|
| proof-a04 | G/H | KEEP | 元命題はx=0の反例で偽。 |
| proof-a04r | low-value repeated truth click | MERGE into explanation/table | 逆はx=1代入で真、と本文で整理。独立choiceをやめる。 |
| proof-a04i | low-value repeated truth click | MERGE into explanation/table | 裏も真、と本文で整理。独立choiceをやめる。 |
| proof-a05 | G/H | KEEP | 対偶もx=0で偽。元命題と同じ真偽を意識させる。 |

Then immediate source transfer:
12の倍数⇒6の倍数

| id | master type | action | restored role |
|---|---|---|---|
| proof-a06 | H / transfer | KEEP | 元命題の真偽を確認。 |
| proof-a07 | G / transfer | KEEP | 同じn=6で逆と裏を崩す。 |
| proof-a08 | H / transfer | KEEP | 対偶が真であることを確認。 |

After a06-a08:
ADD structural generalization, not hole:
- 元命題と対偶は真偽一致
- 逆と裏は真偽一致
- 証明で対偶を使ってよい理由

## Cycle P3 — 対偶を使って証明する

Source worked example:
n²が3の倍数 ⇒ nが3の倍数

This is already strongly aligned to MASTER.

| id | master type | action | restored role |
|---|---|---|---|
| proof-b00 | D | KEEP | 元命題と対偶のどちらが証明しやすいか選ぶ。 |
| proof-b01 | E | KEEP | 対偶を自分で作る。 |
| proof-b02 | B/C | KEEP | 3の倍数でない整数の余りを場合分け。 |
| proof-b03 | F | KEEP | 9k²+6k+1を3(…)+1へ変形。 |
| proof-b04 | H / transfer | KEEP | 2つ目の場合で3の倍数にならないことを読む。 |
| proof-b05 | H | KEEP | 2場合を尽くしたので対偶が真、と結論づける。 |

No extra quiz needed.
After b05:
- 元命題も真
- 「対偶で証明する」とは何をしたかを短く一般化

## Cycle P4 — 矛盾を作って証明する

Source worked example:
√2x+√3y=0, x,y∈Q ⇒ x=y=0

This is also strongly aligned to MASTER.

| id | master type | action | restored role |
|---|---|---|---|
| proof-c00 | D | KEEP | x=0の否定x≠0を仮定。 |
| proof-c01 | F | KEEP | xで割る。 |
| proof-c01b | F | KEEP | √3を掛けて√6を作る。 |
| proof-c02 | B/H | KEEP | 有理数の四則演算の閉性を呼び戻す。 |
| proof-c03 | G/H | KEEP | √6が有理数という結論と既知事実の矛盾を認識。 |
| proof-c04 | H | KEEP | 仮定x≠0を退けてx=0へ戻る。 |
| proof-c05 | C/F | KEEP | 元の式へ戻してy=0を得る。 |

After c05:
- ここまで解いてから「背理法」と命名
- 仮定→矛盾→仮定を退ける、の一般構造を明示

### Source-dependent ADD candidate

MASTERでは概念化直後に別例題で再使用する。
Current source scope p.96–98 に、背理法の直後に適切な別例題が存在するなら:
- ADD 1 light transfer:
  「次の命題を背理法で示すなら、最初に何を仮定するか」
のような D-type thinking nodeを置く。

**Source確認なしに新規問題を発明しない。**
適切なsource exampleがなければ、このADDは保留し、現worked exampleを完成形として閉じる。

---

# 6. Structural blocks to ADD

These are not extra quizzes.

For every concept cycle, learner-facing structure must distinguish:

1. 例題
2. thinking flow
3. 回答後の意味
4. 「今の考え方に名前をつける」concept block
5. 一般化
6. 「すぐ使ってみる」immediate example

Current paragraph-only implementation hides these roles.

Required content/schema strategy:
- existing headingを増やしすぎない
- visual sublabels or concept/note role can mark:
  - 今の考え方
  - すぐ使ってみる
- every concept does not need a large card
- concept prose remains black; UI color is not semantic color-coding

---

# 7. Hole count after restore

| unit | current | KEEP/MOVE interactive | MERGE to prose | REMOVE |
|---|---:|---:|---:|---:|
| propositions-reading | 18 | 14 | 4 | 0 |
| quantifiers-all-exists | 13 | 12 | 1 | 0 |
| propositions-proof | 23 | 20 | 3 | 0 |
| **total** | **54** | **46** | **8** | **0** |

The target is not “46 is the correct number”.
The target is that all 46 remaining interactions correspond to real thinking nodes.

---

# 8. Why this is not deleting learning

The 8 MERGE items are mostly:
- a mathematical consequence already determined by the immediately preceding answer, or
- terminology retrieval immediately after the definition, or
- repeated true/false clicking where the mathematical reasoning has already happened.

Their mathematical content remains visible in prose after the relevant thinking node.

Examples:
- find counterexample -3 → “therefore false” becomes explanation, not another quiz
- learn necessary condition → same rectangle example does not immediately ask the name again
- verify one rhombus theorem → its negation’s truth value is explained instead of another click

This restores:
```text
think
→ answer
→ understand what the answer means
→ continue
```

instead of:
```text
answer
→ answer the consequence
→ answer the terminology
→ next mini-question
```

---

# 9. Implementation order after user review

Do not repair all three units in one giant commit.

## Phase 1
`math-propositions-reading`
- restructure cycles R1-R5
- merge 4 redundant interactions
- repurpose b04
- preserve source examples
- bump revision because answer contract / progress structure changes
- unit tests
- mobile/desktop smoke

## Phase 2
`math-quantifiers-all-exists`
- concrete-first reorder for existential/universal
- rewrite a01/c01 as meaning judgments after witness/counterexample
- merge e02
- bump revision
- tests / smoke

## Phase 3
`math-propositions-proof`
- make a01-a03 concrete-first
- merge a04r/a04i into explanation/table
- keep B/C worked proofs
- check source for immediate post-背理法 transfer
- bump revision
- tests / smoke

After every phase:
- source fidelity
- answer leakage
- completed prose
- mobile
- regression
- user hands-on

---

# 10. Freeze

Until this blueprint is explicitly approved:
- do not publish review units
- do not merge PR
- do not modify practice
- do not modify physics
- do not modify function
- do not modify published math-sets
- do not treat current 54-hole layout as authoritative

The authoritative target is the already-frozen mathematics learning-mode architecture.

# MATH LEARNING MODE — MASTER DIFF AUDIT 2026-10-04

Status: **RESTORATION IMPLEMENTED / AUTOMATED VALIDATION PASS / USER HANDS-ON PENDING**

Scope:
- 数学・学習モードのみ
- 練習モードは対象外
- 物理は対象外
- 現在の3 review unitを、2026-10-03に固定した数学学習モード設計へ照合する

## 1. Authority order

1. `MATHEMATICS_TEXTBOOK_MODE_MASTER_SKILL_v1`
2. 2026-10-03 `MATH_LEARNING_MODE_RECOVERY_2026-10-03.zip` / Freeze Plan で固定した実装契約
3. `場合の数と確率_教科書モード_厳密再作成版` など user-reviewed mathematics textbook-mode mother examples
4. 現在の branch implementation

現在実装が上位authorityと衝突する場合、現在実装を基準に再設計しない。
上位authorityへ復元する。

## 2. Frozen mathematics learning-mode architecture

新概念1つの標準サイクル:

```text
具体的な例題
↓
何を求めるか・何を見るかを焦点化
↓
既習事項が必要なら、その瞬間に復習穴
↓
数学的判断 / 状態更新 / 方針選択
↓
式生成
↓
必要なら一段ずつ導出
↓
結果の意味を確認
↓
ここまで解いてから概念名・記号を導入
↓
具体例と対応させて一般化
↓
直後の別例題で即時使用
↓
支援を少し減らす
```

これを単なる「穴→穴→穴」の列へ置き換えない。

## 3. Hole contract

穴は削除語ではなく thinking node。

A. 問題理解
B. 復習
C. 状態更新
D. 方針選択
E. 式生成
F. 導出
G. 理由
H. 意味・解釈

Hard rules:
- 非自明な推論を2段以上飛ばさない
- 未知の用語を当てさせない
- 主要thinking nodeは止める
- 穴数ではなくthinking-node coverageを見る
- 復習穴は独立クイズにせず、今の問題で必要になった瞬間だけ使う
- 数式は「必要性→式→意味」の順
- 新概念は具体例を解いたあとで命名
- 定義後はすぐ別例題で使う

## 4. Mother-example evidence

`場合の数と確率_教科書モード_厳密再作成版` では、たとえば順列を:

```text
委員長・副委員長の具体問題
↓
役割を入れ替えると同じか
↓
委員長の選択数
↓
1人選んだ後の残り人数
↓
積の法則を復習
↓
5×4=20
↓
20が何を数えているか確認
↓
「今の数え方を順列という」
↓
5P2の記号意味
↓
nPrへ一般化
↓
次の例題で再使用
```

としている。

確率でも:

```text
さいころの具体問題
↓
U/Aを実際に作る
↓
場合の数を数える
↓
比を作る
↓
ここまで解いてから
試行 / 全事象 / 事象 / 確率 を命名
↓
P(A)=n(A)/n(U)
↓
次のカード例題で即時利用
```

となっている。

このmacro cycleが数学学習モードのbaseline。

## 5. Current implementation — global mismatch

現在の3 review unit:
- `math-propositions-reading`: 18 holes
- `math-quantifiers-all-exists`: 13 holes
- `math-propositions-proof`: 23 holes

計54 holes。

しかし3 unitとも schema上の `concept` block は0。
実際の概念説明は通常paragraphへ埋め込まれている。

局所的には meaning-before-name を守る箇所があるが、
画面体験としては:

```text
短い本文
→ 選択
→ 短い本文
→ 選択
→ 別の例
→ 選択
→ 別の例
→ 選択
```

が長く続きやすい。

これはMASTERの anti-pattern:
- 一問一答の短文が連続する
- 穴埋め問題集化する
- 概念化 / 一般化 / 即時例題の役割が曖昧になる

に接近している。

## 6. Unit audit — math-propositions-reading

### Good / reusable

- 最初の具体例の判断後に「命題」「p⇒q」を説明している
- 反例は、反例そのものを先に見つけた後で名称を導入している
- 必要条件 / 十分条件も、長方形の両方向を見た後で名称を出している
- 否定も具体的な条件操作から入っている
- progressive reveal / answer leakage / wrong-answer UIなどの技術基盤は再利用可能

### Mismatch

1. 「命題」という最初のconcept cycleの後、
   `x<2⇒x>0` → `x²=9⇒x=3` → 二等辺三角形
   と transfer mini-problem が連続し、
   **反例という概念を使う即時例題**というより「真偽クイズ列」に見えやすい。

2. `prop-a05→a06`, `a07→a08` は
   「反例を選ぶ→偽を選ぶ」の同型2段が繰り返される。
   transferとして数学的意味はあるが、MASTER上は
   **一つの例題を自然な本文として解く**必要がある。
   現状はitem境界の方が目立つ。

3. 必要条件 / 十分条件では、
   concept説明直後の `prop-b03` が名称分類そのもの。
   定義確認としては成立するが、
   MASTERの「定義後すぐ別の具体例で使う」より
   **用語retrieval quiz**に近い。

4. 「概念化した区切り」「一般化した区切り」「すぐ使ってみる」が learner-facing structureとして弱い。

### Required restoration direction

- 命題
- 反例
- 必要/十分
- 必要十分/同値
- 否定

をそれぞれ
**導入例題→概念化→一般化→即時例題**
のcycleとして見直す。

現在のsource examples自体は可能な限り再利用し、
問題を増やすのではなく役割を再配置する。

## 7. Unit audit — math-quantifiers-all-exists

### Good / reusable

- witness / counterexampleを具体例から考える方針
- strong→medium→lightのsupport fading
- 文の否定を具体例で扱う
- source exampleの順序は保持されている

### Mismatch — strongest

1. learner-facing major headingが実質1つだけで、
   5つのsource exampleが13 holesとして連続する。

2. 「ある」を理解する導入例
   → existentialの意味を言語化
   → 否定規則を一般化
   → 即時例題

   「すべて」を理解する導入例
   → universalの意味
   → counterexampleとの関係
   → 否定規則
   → 即時例題

   という**concept cycleが画面上で形成されていない**。

3. source exampleを守ることが、
   source exampleをすべて同じ「問題カード」にすることへ変質している。

4. MASTERの「新概念1つ=自然な問い」に対し、
   現状は「source example1→2→3→4→5」の列が教材構造そのものになっている。

### Required restoration direction

少なくとも:
- 「ある」/ witness
- 「すべて」/ counterexample
- 量化文の否定

を概念cycleとして分ける。

各cycle内で:
導入例 → 意味 → 名称/一般則 → 即時例
に戻す。

## 8. Unit audit — math-propositions-proof

### Good / reusable

3 unit中、MASTERへ最も近い。

- 対偶による証明は、方法選択→対偶作成→場合分け→式変形→結論のworked-example chainを持つ
- 背理法は仮定→式変形→矛盾→仮定を退ける、という一つのworked proofになっている
- 背理法の名称は実際に矛盾を経験した後で導入している
- formula thinking nodeも一部実装済み

### Mismatch

1. 逆・裏・対偶の導入部Aは、
   3つの操作を作る穴＋真偽判定穴が連続し、
   worked exampleより「操作クイズ→真偽クイズ」に見えやすい。

2. 「逆/裏/対偶を一つの具体命題から組み替える」
   → 名称と記号
   → 真偽関係を一つの例で確認
   → 一般関係
   → すぐ別例で使用

   というMASTER型cycleへ整理余地がある。

3. B/Cはworked exampleとして良いが、
   learner-facing上で「今学んだ証明法」「一般化」「次の例」の役割境界が弱い。

### Required restoration direction

- Aは「一つの命題を変形して3関係を作る」一つの導入例としてまとめる
- 解いた後に逆/裏/対偶を概念化
- 次の命題を即時例題として真偽関係確認
- B/Cのworked proofは基本骨格を保持する
- interaction数を増やさず、意味のあるthinking nodeへ寄せる

## 9. UI contract audit

Current UI:
- holeは本文中にinline buttonとして存在
- choice panelは該当paragraph直後
- resolved answerは本文へ戻る
- wrong answerはunresolvedのまま
- progressive revealあり

この点はMASTERの
「本文中の穴＋該当文章直後のchoices」
と大きく矛盾しない。

したがって主因は、
**UI componentそのものより、教材macro structureとitem配置**。

ただし一つの概念cycle内のhole数が多く、
各holeを開くたびchoice panelが現れるため、
content側がmini-question列だとUIでも問題集感が増幅される。

## 10. Repair policy — freeze before code

現時点ではcontent repairを始めない。

次工程:
1. 3 unitそれぞれの概念cycleを確定
2. 現在のsource exampleを各cycleへ割り当てる
3. 各cycleに
   - 導入例題
   - A〜H thinking nodes
   - 概念化
   - 一般化
   - 即時例題
   - support fading
   を明記
4. 現在54 holesを
   - KEEP
   - MOVE
   - MERGE
   - REMOVE
   - ADD
   に分類
5. user review
6. approval後に初めてimplementation

No-touch:
- Math practice
- Physics
- Function lesson
- Published math-sets
- unrelated shared UI

## 11. Core conclusion

今回の問題は「数学学習モード設計が未完成」ではない。

**設計は2026-10-03にかなり細かく完成していた。**

現在の3 review unitは、
answer leakage、progressive reveal、wrong-answer、mobile、CIなどの
技術的品質は高い一方、

```text
具体例題
→ 一段ずつ解く
→ 解けてから概念化
→ 一般化
→ 直後の例題
```

という数学学習モードのmacro architectureを十分に再現していない。

次の修正は「新しく設計する」のではなく、
**既存MASTERへの復元**として行う。


---

## 12. Restoration implementation result

The audit above records the pre-restoration mismatch. The restoration has now been implemented against the frozen mathematics learning-mode MASTER.

Validated code head: `9ef3111792d5660931b4b2b35ffb89281a92c7ad`

Current review units:
- `math-propositions-reading`: revision 2 / 14 interactions
- `math-quantifiers-all-exists`: revision 4 / 11 interactions
- `math-propositions-proof`: revision 3 / 23 interactions
- total: **48 interactions**

Merged from standalone choice panels back into textbook prose:
- `prop-a06`
- `prop-a08`
- `prop-b03`
- `prop-b06`
- `quant-a01`
- `quant-c01`

Restored macro-order checks:
- proposition reading: concrete judgment → concept name → generalization → immediate use
- quantifier: witness/counterexample first → rule second
- proof: concrete proposition → transformations → reverse/inverse/contrapositive names
- contradiction proof: worked proof first → name 背理法 after completion

Automated validation:
- Math textbook mode CI: PASS
- Math practice pilot CI: PASS
- Typecheck / unit tests / build / mobile / desktop / Physics regression / Math practice setup regression: PASS

Remaining gate:
- user hands-on QA of the restored learner rhythm
- all 3 units remain `status: review`
- do not merge PR #31 before user confirmation


---

## 13. Golden textbook presentation result

After the first MASTER restoration, the user identified a second mismatch: the app still flattened textbook roles that were explicit in the approved `集合_教科書モード_完成版_v1`.

The shared representation was minimally extended with:
- `term`: formal concept term rendered black + bold
- `marker`: 例題 / 証明 / 確認 / まとめ
- `dialogue`: selective 花子 / 太郎 / 先生

These roles were then applied to the 3 review units without changing source examples or interaction count.

Current validated state:
- reading revision 3 / 14 interactions
- quantifier revision 5 / 11 interactions
- proof revision 4 / 23 interactions
- validated head `2127c3d4d35793546228ac2fe2a9d38e8a9f97be`
- Math textbook CI PASS
- Math practice pilot CI PASS
- all 3 units remain review pending user hands-on QA

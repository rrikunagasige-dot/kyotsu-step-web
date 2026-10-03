# MATH_TEXTBOOK_MODE_WORKLOG

## 2026-10-03 — 数学・学習モード移植

対象 branch:
`chatgpt/math-textbook-sets-v1`

原則:
- 物理・学習モードで確立した continuous readingFlow を再利用する。
- 問題カードを本文の外に置かず、本文中の判断として穴を置く。
- 具体例 → 1判断 → 概念化 → 即時使用 → 支援減衰。
- 未知語を先に当てさせない。
- 誤答は unresolved のまま staged hint → retry。
- 答えを含む図は判断前に見せない。
- 概念本文は ordinary paragraph。派手な概念boxを作らない。
- 数学練習モードの実装ファイルは変更しない。
- CI待機中は、source audit・教材設計・テスト設計など独立仕事を進め、定期的にCIへ戻る。

## Curriculum contract

練習モードと同じ3テーマを独立catalogで固定:

1. `organize-sets`
   - 練習 87〜97
   - 集合の表し方 → 部分集合 → 共通部分・和集合 → 補集合 → 集合の条件
2. `read-propositions`
   - 練習 98〜120
   - 真偽 → 条件の否定 → 必要条件・十分条件 → 「すべて」と「ある」 → 関数の条件
3. `prove-propositions`
   - 練習 108〜117
   - 同値 → 逆・裏・対偶 → 対偶による証明 → 無理数 → 背理法

runtimeでは練習モードをimportしない。同期はmetadataとtestで固定する。

## Published

### math-sets
Source:
- 啓林館版 深進数学I 教科書 p.86〜91 相当
- guide p.109〜114 付近

内容:
- 集合・要素
- ∈ / ∉
- 2つの表し方
- 有限 / 無限
- 部分集合 / 空集合 / 相等
- 共通部分 / 和集合
- 全体集合 / 補集合
- ド・モルガン
- 実数集合 / 数直線 / 端点

Setup:
- 数学I+A → 第3章「集合と命題」→「集合を整理する」
- topic cardから直接lessonへ入る
- 戻る導線でも `?subject=math-1a` を保持

## Review only / hidden from normal setup

以下は source-backed に作成したが、user-facing setupにはまだ出さない。

### math-propositions-reading
Source:
- p.92〜95 相当
- 命題かどうかの判定 / 命題の真偽 / 反例 / 条件の否定 / 必要・十分 / 必要十分
Checkpoint:
- SOURCE AUDIT: PASS（問8の4例、問10、問11、問9の必要条件表現まで反映）
- UNIT TEST: source例固定test追加済み
- STATUS: review

### math-quantifiers-all-exists
Source:
- p.100〜101 相当
- 「すべて」と「ある」の真偽・否定
- 反例と存在例

### math-functions-conditions
Source:
- 第2章 p.46〜47 相当 + 練習118 content authority
- 関数の判定基準
- 円周x → 半径y
- 正の数x → 平方根y
- 面積1の長方形で縦x → 横y
Checkpoint:
- 118の3例へ同期済み
- 119/120の内容を先回りして混ぜない
- STATUS: review

### math-propositions-proof
Source:
- p.96〜98 相当
- 同値
- 逆・裏・対偶
- x²=x⇒x=1 と 12の倍数⇒6の倍数 の2例
- 元命題と対偶、逆と裏の真偽対応
- 3の倍数の対偶証明
- √6の無理性を使う背理法
Checkpoint:
- SOURCE AUDIT: PASS（問12(1)(2)、問13、問14を反映）
- UNIT TEST: 12倍数例を固定済み
- STATUS: review

これらは `status: review` のため `textbookRepository.listPublished()` には出ず、通常setupでは「準備中」を維持する。

## 追加監査メモ

- proposition proof は practice taxonomy と同期し、同値 → 逆・裏・対偶 → 対偶証明 → 矛盾の順へ整理。
- review unit の subtitle / objectives から、後で学ぶ用語や結論を先に見せる answer leakage を削除。
- frontmatter leakage test を追加し、本文に入る前に概念名を先取りしないことを自動監査。
- source → unit → learner flow の対応は `docs/MATH_TEXTBOOK_SOURCE_MAP.md` に分離して記録。

- quantifier lesson は教科書 p.100〜101 の問1 (1)〜(5) の順序へ戻し、存在例 → 否定、反例 → 否定の順で概念化。
- proposition-reading lesson は practice taxonomy に合わせ、真偽 → 条件の否定 → 必要条件・十分条件 の順へ修正。
- practice 98 の authority に合わせ、命題の判定基準（真偽が客観的に一意に定まるか）を implication より前へ追加し、偽の文と非命題を区別。
- practice 98 の leakage guard を再監査し、頂角40°の反例を穴より前に表示していた箇所を修正。現在は 判定基準 → (1)分類 → (2)反例選択→分類 → (3)客観性→非命題 の順。
- function lesson は main の `MATH_PRACTICE_118_CONTENT_DESIGN.md` を authority として、判定基準 → 円周/半径 → 平方根 → 面積1長方形へ同期。119/120 は authority が main に入るまで先回りしない。
- review integrity test で、choices の実質重複・answer の一意性・inline item の1回使用・support fading を監査。
- exact practice membership を 87〜120 の各問題番号レベルでcatalogに固定し、3テーマ間の重複/欠落を禁止。

## CI strategy

Math textbook dedicated CI:
- typecheck
- textbook schema tests
- curriculum catalog tests
- math unit pedagogy tests
- build
- mobile / desktop textbook smoke
- Physics Chapter 1 regression
- Math practice setup regression

さらに PR 上で既存 Math practice pilot CI も通す。

FAIL時:
1. 依存する後続作業だけ停止
2. 独立して進められるsource audit / design / testsは続ける
3. 2〜3作業ごとにCIを再確認
4. FAIL原因だけを局所修正
5. 回帰testを追加してから先へ進む

## No-touch zones

数学・学習モード側から原則変更しない:
- `MathPracticeReadingFlow.tsx`
- `MathPracticeRichText.tsx`
- `src/data/mathPractice/**`
- `mathPracticeTaxonomy.ts`
- `docs/MATH_PRACTICE_*`
- practice workflow
- Physics Chapter 1 lesson data / assets

共有画面 `LearningSetupPage.tsx` は数学 textbook entry の最小差分だけを入れ、practice regressionで守る。

## Promotion gate for review units

review → published に上げる条件:
1. source audit PASS
2. unit pedagogy test PASS
3. direct-route browser smoke PASS
4. mobile / desktop visual QA PASS
5. Math practice regression PASS
6. Physics textbook regression PASS
7. setup topic flowが練習モード順と一致
8. user hands-on QA で本文・穴・図・黒字概念の感触を確認

自動PASSだけで published にしない。

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
- 命題の真偽 / 反例 / 必要・十分 / 必要十分 / 条件の否定

### math-quantifiers-all-exists
Source:
- p.100〜101 相当
- 「すべて」と「ある」の真偽・否定
- 反例と存在例

### math-functions-conditions
Source:
- 第2章 p.46〜49 相当
- 関数の定義
- f(x)
- 定義域 / 値域
- 長方形モデル
- 定義域から値域を読む

### math-propositions-proof
Source:
- p.96〜98 相当
- 逆・裏・対偶
- 元命題と対偶の真偽一致
- 3の倍数の対偶証明
- √6の無理性を使う背理法

これらは `status: review` のため `textbookRepository.listPublished()` には出ず、通常setupでは「準備中」を維持する。

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

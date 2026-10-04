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

learner-facing の章構造は教科書をauthorityにする。練習モードとの対応は、内容が実際に重なる範囲だけを内部metadataで持つ。

1. `organize-sets`
   - source: 第3章 p.86〜91
   - practice overlap: 87〜97
   - 集合の表し方 → 部分集合 → 共通部分・和集合 → 補集合 → 集合の条件
2. `read-propositions`
   - source: 第3章 p.92〜95
   - practice overlap: 98〜107
   - 真偽 → 必要条件・十分条件 → 条件の否定
3. `prove-propositions`
   - source: 第3章 p.96〜98 + 参考 p.100〜101
   - practice overlap: 108〜117（109は参考「すべて」と「ある」に対応）
   - 逆・裏・対偶 → 証明しやすい向き → 対偶による証明 → 矛盾を使う証明 → 「すべて」と「ある」

第2章 p.46〜47 の `math-functions-conditions` はこの3テーマへ入れない。
runtimeでは練習モードをimportせず、同期はmetadataとtestだけで確認する。

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
- 問8の4命題、p⇒q と集合包含、反例
- 必要条件・十分条件・必要十分条件
- 条件の否定
Checkpoint:
- SOURCE AUDIT: PASS（問8〜問11の教科書例へ限定）
- 練習モード由来だった「23÷3」「頂角40°」「3.14とπ」の導入例は削除
- 問8(4)の反例はsource通り「直角二等辺三角形」
- 最初のsource判断後に「命題」と p⇒q を概念化
- UNIT TEST / E2E: source例とprogressive revealを固定済み
- STATUS: review

### math-quantifiers-all-exists
Source:
- p.100〜101 相当
- 「すべて」と「ある」の真偽・否定
- 反例と存在例

### math-functions-conditions
Source:
- 第2章 p.46〜47 相当
- y=4x−6 から関数の意味を作る
- f(−1), f(2), f(a−1)
- f(x)=x²−1 の代入
- 周40 cmの長方形 → y=20−x → 定義域・値域
Checkpoint:
- 第3章 learner topic から分離
- 第2章を実装するときに接続する将来unit
- STATUS: review

### math-propositions-proof
Source:
- p.96〜98 相当
- 逆・裏・対偶
- x²=x⇒x=1 と 12の倍数⇒6の倍数 の2例
- 元命題と対偶、逆と裏の真偽対応
- 証明しやすい向きの選択
- 3の倍数の対偶証明
- √6の無理性を使う背理法
Checkpoint:
- SOURCE AUDIT: PASS（p.96〜98 の順へ整理）
- 前unitで扱った同値の重複再学習を削除
- UNIT TEST: 2つのsource例とstrategy nodeを固定済み
- STATUS: review

これらは `status: review` のため `textbookRepository.listPublished()` には出ず、通常setupでは「準備中」を維持する。

## 追加監査メモ

- proposition proof は教科書 p.96〜98 の順に合わせ、逆・裏・対偶 → 対偶証明 → 矛盾の順へ整理。
- review unit の subtitle / objectives から、後で学ぶ用語や結論を先に見せる answer leakage を削除。
- frontmatter leakage test を追加し、本文に入る前に概念名を先取りしないことを自動監査。
- source → unit → learner flow の対応は `docs/MATH_TEXTBOOK_SOURCE_MAP.md` に分離して記録。

- quantifier lesson は教科書 p.100〜101 の問1 (1)〜(5) の順序へ戻し、存在例 → 否定、反例 → 否定の順で概念化。
- proposition-reading は教科書問8のsource例だけで導入し、practice由来の別例を混ぜない。
- function lesson は教科書 p.46〜47 の本文・問1・問2へ戻し、関数の定義 → f(a) → 2つの関数の代入 → 長方形から定義域・値域、の順に再構成。
- review integrity test で、choices の実質重複・answer の一意性・inline item の1回使用・support fading を監査。
- 練習モードとの同期は内部 catalog/test に限定し、learner-facing 本文では問題番号を使わない。

## 2026-10-04 checkpoint
- `math-propositions-reading`: source p.92〜95 を再監査し、真偽 → 必要条件・十分条件 → 条件の否定 の教科書順へ戻した。
- `math-quantifiers-all-exists`: 教科書 p.100〜101 の5例と否定を固定testで監査済み。
- `math-functions-conditions`: 教科書 p.46〜47 から再構築。長方形図を追加し、図には定義域・値域の答えを載せない。
- `math-propositions-proof`: 対偶を使うか・矛盾の仮定をどう置くかを thinking node 化。見出しから戦略の答えが漏れないよう修正。

- 作業対象は数学・学習モードのみ。
- `math-propositions-reading`: 問8の具体例 → 判断 → 「命題」概念化。必要・十分も両方向を判断してから名称を導入。
- `math-propositions-proof`: 背理法という名称は実例を完了した後に提示するよう修正。
- 練習モード本体・Desktop / Remote Desktop は触らない。

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

## Promotion blocker: 関数unitの章配置

- `math-functions-conditions` のsourceは第2章 p.46〜47。
- 現在の数学textbook setupは第3章「集合と命題」を固定表示しているため、このunitをそのままpublishedにすると章表示が不正になる。
- 内容監査は続けるが、数学setupをchapter-awareにするまでは `math-functions-conditions` をpublishedへ上げない。
- このunitは第3章topicへ接続せず、第2章を実装するときまで review のまま保持する。

## Promotion gate for review units

review → published に上げる条件:
1. source audit PASS
2. unit pedagogy test PASS
3. direct-route browser smoke PASS
4. mobile / desktop visual QA PASS
5. Math practice regression PASS
6. Physics textbook regression PASS
7. setup topic flowが教科書順と一致し、practice overlap metadataと矛盾しない
8. user hands-on QA で本文・穴・図・黒字概念の感触を確認

自動PASSだけで published にしない。

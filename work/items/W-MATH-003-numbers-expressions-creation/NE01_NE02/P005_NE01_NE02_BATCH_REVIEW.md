## 2026-10-23 — P-005 exact approval and full-batch implementation

User replied **「続けて」** directly to the question asking permission to implement the complete, already presented NE01/NE02 25-question P-005 design. This is exact review-only implementation approval for both units together, not an acceptance of yet-unseen rendered images or main/hosting permission. No question-by-question permission pause.

Implemented stable new units NE01/NE02 revision1/review with 13+12 source-mapped operations; optional 参考・発展 theme; exact per-distractor feedback without schema change; scoped display rows for long compound formulas; 25 real-data review slices. Original N01–N14 source data/answers/revisions/progress untouched. Formula wrapping only adds opt-in new-unit block IDs. Full source CI and actual 320/390/1440px all-25-question and 16-unit chapter tests are prepared, results PENDING. Work stays VERIFYING; Gate① PENDING, no formal Gate② closure/Gate③ user play.

Source Word hash unchanged. Current LibreOffice regeneration produces **40 pages**, with NE01 on37–38 and NE02 on39–40. New units explicitly label these sourcePages as regenerated rendition; historical Library 53-page indexing is not claimed identical. Paragraph mappings remain canonical for question provenance.

# W-MATH-003 / P-005 — 残りNE01・NE02の25問を一括作成する設計案

Status: PROPOSED — 設計・原資料監査は作成承認P-001の範囲内。下記の具体的な学習本文・回答設計は今回初めて提示するもので、レビュー用アプリ実装の個別承認はまだ記録しない。
Date: 2026-10-23

## まとめて見る入口

- [NE01：3次の展開と因数分解 — 本文と全13問](./NE01_LEARNER_REVIEW_V1.md)
- [NE02：二重根号 — 本文と全12問](./NE02_LEARNER_REVIEW_V1.md)
- [25問の機械可読設計](./items.json)、[原Word抽出](./source.json)、[計算検査](./audit-results.json)

## 作る範囲

原Wordの最後の2単元、NE01【1】〜【13】とNE02【1】〜【12】の25問すべて。既存14単元の後に読む任意の「参考・発展」とする。公開教材への昇格は含めない。

「数式＋その式を作る理由＋意味ある穴」を一続きにする。NE01は具体的三乗→一般の和・差の導出→三乗の和・差の因数分解→二つの確認式。NE02は平方の展開→和と積の条件→二数の探索→主平方根の非負性→差の例→係数をそろえる応用の順。元Wordにない追加の採点問題を増やさず、25元問を25個の複合回答を含む操作として設計する。

各問の正答1・誤答2・個別誤答説明・ヒントを全問提示済み。式生成の結果だけでなく、NE01【4】の六つの分配項、【12・13】の二つの式、NE02【4・8】の符号、【7・11】の条件から結果までを回答へ含める。新しい名称を推測させない。公式・説明・ヒントを混同しない。

## 原資料と前提

原Word SHA-256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa` を再照合。直接body段落0始まり618〜668にNE2単元、25問、28個のOMML数式、図0。根号・分数・指数・括弧をXMLの構造から保持して読み直した。公式の数値や問題を補作していない。別冊公式解答は未提供。

前提：NE01は分配法則・平方公式・共通因数。NE02は平方根の積と商・非負性・和と差の平方・有理化。既存N01〜N14のうち該当する知識を必要時に呼び戻す。発展同士の順番を前提にしない。

## UIと回答前の表示

完成本文は設計者・ユーザーの確認用。実装では設計済みの完成部分を数式の中の選択穴へ置換し、正答した同じ行へ戻す。後ろの完成式・まとめ・符号の結論は該当操作の正答後にのみ解放する。例えばNE02【6】より前に `ab=20` や `2√20` を表示しない。

選択肢は構造化された数式として描画し、説明文で代用しない。長い二式対応は式の境目、長い多項式は最上位の加減の境目で折り返し、分数・根号・括弧付き因子を途中で切らない。既存P017/P018の最終レンダラーを基礎とし、短い正答は不要に分割しない。概念本文は黒字、操作と状態に機能色を使う。

## 実装予定

承認後、最終修正コードSHA `68338688f22ffb3acaa7074b5c0c0f79584604c5` を継承する独立ブランチでレビュー用2単元を追加する。予定ID `math-numbers-expressions-ne01` / `math-numbers-expressions-ne02` と項目ID `ne01-01`〜`ne01-13` / `ne02-01`〜`ne02-12` は実装前に衝突を再確認する。既存教材のID・回答・履歴・revisionは変えない。新2単元はrevision1のreview扱い。新単元の列挙・章内ルートは既存のレビュー機構へ限定して追加し、一般公開へ昇格しない。

想定変更箇所：`src/data/textbook/math/` の新2単元と既存登録箇所、単元一覧・章のレビュー専用登録が必要な箇所、関連するデータ・ブラウザ検証、既存のレビュー画像取得経路、W-MATH-003の記録。実装前に実ファイルの登録方式を確認し、既存データ契約を維持する。スキーマ変更・共有UIの新設はこの案へ含めない。

## 検証とまとめて見せる単位

1. 原問25件の出典対応と全75候補の正誤を確認する。現段階は30件の厳密計算がPASS、25正答・50誤答を同一担当者が意味確認済み。独立した人・agentの監査やアプリ実行済みとは言わない。
2. 承認後は25操作の誤答→ヒント→再回答→正答、未来の答えの非表示、進捗・再読込を320/390/1440pxで実ブラウザ検査する。
3. 実コードSHAに対応する本物の画像で全25問を一括提示する。設計文書だけを「実画面の細部確認」やGate①通過としない。
4. 新2単元＋既存14単元を章全体として再検査し、数学・物理・練習の必要な回帰を実行する。
5. 既存46箇所の画像確認、新2単元の画像確認、Gate②、同一SHAの実働アプリでのユーザー総チェックを区別して残す。

## 境界・リスク

原Word・元図・既存14単元の内容・他教科モード・保存済み学習履歴を変更しない。main統合、デプロイ、新しいホスティング、費用の発生は含めない。平方の一致だけで主平方根の値を決めない。式の形を答える問題は数学的同値だけで正答へしない。長い複合回答のスマホ表示は実装後の検証が必要であり、設計段階ではPASSとしない。

## 承認の扱い

作成P-001は16単元の設計・段階的制作を承認済み。今回の25問案の個別実装承認はPENDING。ユーザーの「続けて」を、まだ提示していない具体的本文の承認や既存46画面の受入として記録しない。2単元25問を一括して提示し、その同じ案の承認後は問ごとの許可を取り直さず実装・検証まで進める。

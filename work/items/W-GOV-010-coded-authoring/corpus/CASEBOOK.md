# 事例台帳 — 初回収集

成功例の数を増やすために肯定を補っていない。UNKNOWNは失敗を意味しない。
出典文書の収録版と、評価対象の教材版は別。過去会話検索の要約は原文ではない。

| ID | 対象 | 評価の証拠 | 品質ラベル | 採用状態 |
|---|---|---|---|---|
| P01 | 平均速度の式を別々の白枠に分断 | REJECTION_REPORTED | UNKNOWN | 保留 |
| P02 | 平均速度の記号が二重に重なる | REJECTION_REPORTED | UNKNOWN | 保留 |
| P03 | 穴が最後の整理だけを要求する | REJECTION_REPORTED | UNKNOWN | 保留 |
| P04 | 図の参照時に図がない | REJECTION_REPORTED | UNKNOWN | 保留 |
| P05 | 元図を未承認の生成図で置換 | REJECTION_REPORTED | UNKNOWN | 保留 |
| P06 | 概念と図の読み取りを一律に分離 | REJECTION_REPORTED | UNKNOWN | 保留 |
| P07 | 図がぼやける・必要箇所が隠れる | REJECTION_REPORTED | UNKNOWN | 保留 |
| P08 | 合成速度の例題が関係式を使わせない | REJECTION_REPORTED | UNKNOWN | 保留 |
| P09 | 相対速度が用語当てになっている | REJECTION_REPORTED | UNKNOWN | 保留 |
| P10 | 水平投射の修正完了を早く宣言 | REJECTION_REPORTED | UNKNOWN | 保留 |
| P11 | 七つの内部単元を大見出しとして露出 | REJECTION_REPORTED | UNKNOWN | 保留 |
| P12 | 力と運動が題名だけ変わり本文が追随しない | REJECTION_REPORTED | UNKNOWN | 保留 |
| P13 | 平均速度の最初の例で関係と結果を別々に穴にする | DESIGN_APPROVAL_OR_TECHNICAL_PASS_ONLY | UNKNOWN | 保留 |
| P14 | 合成・分解の公式を例題で実際に使う | DESIGN_APPROVAL_OR_TECHNICAL_PASS_ONLY | UNKNOWN | 保留 |
| P15 | 雨と自転車の相対速度 | DESIGN_APPROVAL_OR_TECHNICAL_PASS_ONLY | UNKNOWN | 保留 |
| P16 | 加速度から運動公式を導く | DESIGN_APPROVAL_OR_TECHNICAL_PASS_ONLY | UNKNOWN | 保留 |
| P17 | 水平投射で共通の時間を再利用 | DESIGN_APPROVAL_OR_TECHNICAL_PASS_ONLY | UNKNOWN | 保留 |
| P18 | 斜方投射の修正版 | DESIGN_APPROVAL_OR_TECHNICAL_PASS_ONLY | UNKNOWN | 保留 |
| P19 | 力と抵抗から終端速度へ | DESIGN_APPROVAL_OR_TECHNICAL_PASS_ONLY | UNKNOWN | 保留 |
| S01 | 集合が概念説明書になっている | REJECTION_REPORTED | UNKNOWN | 保留 |
| S02 | 集合学習が単なる問題列になっている | REJECTION_REPORTED | UNKNOWN | 保留 |
| S03 | 集合previewへの強い肯定の候補 | STRONG_PRAISE_REPORTED | UNKNOWN | 保留 |
| S04 | 約数を集めてから集合を名付ける | NO_TARGETED_EVALUATION | UNKNOWN | 保留 |
| S05 | ド・モルガンを図の一致から導く | NO_TARGETED_EVALUATION | UNKNOWN | 保留 |
| R01 | 現在の小問と必要な過去結果だけを示す | STRONG_PRAISE_REPORTED | UNKNOWN | 保留 |
| R02 | 問題と解説・穴埋めを分ける | STRONG_PRAISE_REPORTED | UNKNOWN | 保留 |
| N01 | 第四の大見出し | EXPLICIT_REJECTION | NEGATIVE | 直接対応あり・既知の回帰例 |
| N02 | 2A−3Bの計算 | EXPLICIT_REJECTION | NEGATIVE | 直接対応あり・既知の回帰例 |
| N03 | 二項式と三項式の積 | EXPLICIT_REJECTION | NEGATIVE | 直接対応あり・既知の回帰例 |
| N04 | 掛算表の役割 | EXPLICIT_REJECTION | NEGATIVE | 直接対応あり・既知の回帰例 |
| N05 | 和と差の積 | EXPLICIT_REJECTION | NEGATIVE | 直接対応あり・既知の回帰例 |
| N06 | 公式と展開の選択 | EXPLICIT_REJECTION | NEGATIVE | 直接対応あり・既知の回帰例 |
| N07 | 複数行を束ねた選択肢 | EXPLICIT_REJECTION | NEGATIVE | 直接対応あり・既知の回帰例 |
| N08 | 置換後の展開 | EXPLICIT_REJECTION | NEGATIVE | 直接対応あり・既知の回帰例 |
| N09 | 文章として読めない | EXPLICIT_REJECTION | NEGATIVE | 直接対応あり・既知の回帰例 |
| N10 | 四因子の組合せ | EXPLICIT_REJECTION | NEGATIVE | 直接対応あり・既知の回帰例 |

## 各事例の内容と出典

### P01 平均速度の式を別々の白枠に分断

元の状態：一つの計算が複数の独立カードに見える

修正・型の候補：途中の文章も含めて一つの導出枠にする

抽出する条件付き規則：導出グループIDと表示コンテナを対応付ける

出典：[docs/physics-ch01/CH1_USER_QA_DESIGN_LESSONS.md](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/e907bf5fc22025fbd74127b9b72176b90aaeb36e/docs/physics-ch01/CH1_USER_QA_DESIGN_LESSONS.md) / ## 2.

採用除外理由：品質ラベル未確定／ユーザー発言原典と対象成果物の直接対応が未回復／評価対象の版が未確定

### P02 平均速度の記号が二重に重なる

元の状態：平均の上線とベクトル矢印が重なり読みにくい

修正・型の候補：avg添字と一つのベクトル記号で表示する

抽出する条件付き規則：数式コンパイル合格と記号の視認性を別に検査する

出典：[docs/physics-ch01/CH1_USER_QA_DESIGN_LESSONS.md](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/e907bf5fc22025fbd74127b9b72176b90aaeb36e/docs/physics-ch01/CH1_USER_QA_DESIGN_LESSONS.md) / ## 10.

採用除外理由：品質ラベル未確定／ユーザー発言原典と対象成果物の直接対応が未回復／評価対象の版が未確定

### P03 穴が最後の整理だけを要求する

元の状態：物理的判断を提示済みにして最後の代数だけ選ばせる

修正・型の候補：親の関係・条件・消去する変数を考える位置へ移す

抽出する条件付き規則：穴は学習行為と必要な証拠へ結び付ける

出典：[docs/physics-ch01/P39_HOLE_QUALITY_AUDIT.md](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/e907bf5fc22025fbd74127b9b72176b90aaeb36e/docs/physics-ch01/P39_HOLE_QUALITY_AUDIT.md) / ## Rewrite principles

採用除外理由：品質ラベル未確定／ユーザー発言原典と対象成果物の直接対応が未回復／評価対象の版が未確定

### P04 図の参照時に図がない

元の状態：図Nを見るという文が対応図より先にある

修正・型の候補：必要な図を先に表示する

抽出する条件付き規則：図参照の依存辺と表示順を検査する

出典：[docs/physics-ch01/CH1_USER_QA_DESIGN_LESSONS.md](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/e907bf5fc22025fbd74127b9b72176b90aaeb36e/docs/physics-ch01/CH1_USER_QA_DESIGN_LESSONS.md) / ## 7.

採用除外理由：品質ラベル未確定／ユーザー発言原典と対象成果物の直接対応が未回復／評価対象の版が未確定

### P05 元図を未承認の生成図で置換

元の状態：見やすいという判断で元図の内容を変える

修正・型の候補：指定された元図へ戻し、必要なら承認された補助図を追加する

抽出する条件付き規則：図の由来と置換／追加の承認範囲を保持する

出典：[docs/physics-ch01/P39_LIVE_APP_DEFECT_AUDIT.md](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/e907bf5fc22025fbd74127b9b72176b90aaeb36e/docs/physics-ch01/P39_LIVE_APP_DEFECT_AUDIT.md) / ## USER FIGURE CORRECTION

採用除外理由：品質ラベル未確定／ユーザー発言原典と対象成果物の直接対応が未回復／評価対象の版が未確定

### P06 概念と図の読み取りを一律に分離

元の状態：知識チェック後に図の読み取りをまとめる

修正・型の候補：ベクトルなど視覚に依存する概念は図と交互に導く

抽出する条件付き規則：表現の順序は概念依存で決める

出典：[docs/physics-ch01/CH1_USER_QA_DESIGN_LESSONS.md](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/e907bf5fc22025fbd74127b9b72176b90aaeb36e/docs/physics-ch01/CH1_USER_QA_DESIGN_LESSONS.md) / ## 9.

採用除外理由：品質ラベル未確定／ユーザー発言原典と対象成果物の直接対応が未回復／評価対象の版が未確定

### P07 図がぼやける・必要箇所が隠れる

元の状態：画像の存在とサイズだけで合格にする

修正・型の候補：実際のスマホ幅で線・文字・切れを確認する

抽出する条件付き規則：画像の技術検査と実表示の読取り検査を分ける

出典：[docs/physics-ch01/CH1_USER_QA_DESIGN_LESSONS.md](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/e907bf5fc22025fbd74127b9b72176b90aaeb36e/docs/physics-ch01/CH1_USER_QA_DESIGN_LESSONS.md) / ## 8.

採用除外理由：品質ラベル未確定／ユーザー発言原典と対象成果物の直接対応が未回復／評価対象の版が未確定

### P08 合成速度の例題が関係式を使わせない

元の状態：合成ベクトル(2.0,1.5)を先に与え、最後の大きさだけ求める

修正・型の候補：合成式の想起→成分計算→大きさ→数値結果をつなぐ

抽出する条件付き規則：公式が説明にあることと学習者が適用することを区別する

出典：[docs/physics-ch01/WORKLOG.md](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/e907bf5fc22025fbd74127b9b72176b90aaeb36e/docs/physics-ch01/WORKLOG.md) / ## 2026-10-01 — User QA: 1B

採用除外理由：品質ラベル未確定／ユーザー発言原典と対象成果物の直接対応が未回復／評価対象の版が未確定

### P09 相対速度が用語当てになっている

元の状態：観測者を選ぶ代わりに基準という語を選ばせる

修正・型の候補：誰から見た運動か→相対速度式→ベクトル→大きさ

抽出する条件付き規則：用語の当て推量より観測者と関係式の判断を設計する

出典：[docs/physics-ch01/WORKLOG.md](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/e907bf5fc22025fbd74127b9b72176b90aaeb36e/docs/physics-ch01/WORKLOG.md) / ## 2026-10-01 — User QA: 1C

採用除外理由：品質ラベル未確定／ユーザー発言原典と対象成果物の直接対応が未回復／評価対象の版が未確定

### P10 水平投射の修正完了を早く宣言

元の状態：根号表示だけ直して教育上の未修正を忘れる

修正・型の候補：元の混在した不具合一覧を維持し全項目を追う

抽出する条件付き規則：技術修正と教育上の修正の完了状態を分ける

出典：[docs/physics-ch01/WORKLOG.md](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/e907bf5fc22025fbd74127b9b72176b90aaeb36e/docs/physics-ch01/WORKLOG.md) / ## 2026-10-02 — 1E full repair

採用除外理由：品質ラベル未確定／ユーザー発言原典と対象成果物の直接対応が未回復／評価対象の版が未確定

### P11 七つの内部単元を大見出しとして露出

元の状態：1A〜1Gがそのまま学習者向け大見出しになる

修正・型の候補：三つの概念テーマにまとめ、内部IDは維持する

抽出する条件付き規則：大見出し数と内部単元数の制約を分ける

出典：[docs/physics-ch01/WORKLOG.md](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/e907bf5fc22025fbd74127b9b72176b90aaeb36e/docs/physics-ch01/WORKLOG.md) / ## 2026-10-02 — Chapter 1 title hierarchy

採用除外理由：品質ラベル未確定／ユーザー発言原典と対象成果物の直接対応が未回復／評価対象の版が未確定

### P12 力と運動が題名だけ変わり本文が追随しない

元の状態：新しい題名に対して古い空気抵抗中心の流れが残る

修正・型の候補：力→加速度→重力と抵抗→終端速度へ導く

抽出する条件付き規則：題名と本文の意味の対応は意味の審査として残す

出典：[docs/physics-ch01/WORKLOG.md](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/e907bf5fc22025fbd74127b9b72176b90aaeb36e/docs/physics-ch01/WORKLOG.md) / ## 2026-10-02 — User QA: 「力と運動」

採用除外理由：品質ラベル未確定／ユーザー発言原典と対象成果物の直接対応が未回復／評価対象の版が未確定

### P13 平均速度の最初の例で関係と結果を別々に穴にする

元の状態：明確な修正前の対照は未回復。

修正・型の候補：Δr関係→(6,4)→Δt関係→3→分子で再利用→最終速度

抽出する条件付き規則：関係を使うことと計算することは別の学習行為。初回例の局所指定であり全算術へ拡張しない

出典：[docs/physics-ch01/WORKLOG.md](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/e907bf5fc22025fbd74127b9b72176b90aaeb36e/docs/physics-ch01/WORKLOG.md) / ## 2026-09-30 USER MICRO-CORRECTION

採用除外理由：品質ラベル未確定／ユーザー発言原典と対象成果物の直接対応が未回復／評価対象の版が未確定

### P14 合成・分解の公式を例題で実際に使う

元の状態：明確な修正前の対照は未回復。

修正・型の候補：B3→B4→B5→B6 と B7→B8

抽出する条件付き規則：説明済み公式の検索と数値適用を結ぶ

出典：[docs/physics-ch01/WORKLOG.md](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/e907bf5fc22025fbd74127b9b72176b90aaeb36e/docs/physics-ch01/WORKLOG.md) / ## 2026-10-01 — User QA: 1B

採用除外理由：品質ラベル未確定／ユーザー発言原典と対象成果物の直接対応が未回復／評価対象の版が未確定

### P15 雨と自転車の相対速度

元の状態：明確な修正前の対照は未回復。

修正・型の候補：観測者→関係式→成分→大きさ→確認図

抽出する条件付き規則：既習の大きさの公式を再利用する

出典：[docs/physics-ch01/WORKLOG.md](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/e907bf5fc22025fbd74127b9b72176b90aaeb36e/docs/physics-ch01/WORKLOG.md) / ## 2026-10-01 — User QA: 1C

採用除外理由：品質ラベル未確定／ユーザー発言原典と対象成果物の直接対応が未回復／評価対象の版が未確定

### P16 加速度から運動公式を導く

元の状態：明確な修正前の対照は未回復。

修正・型の候補：ΔvとΔtの具体化→速度式→v-t面積→変位→時間消去

抽出する条件付き規則：最初に導出する公式では式の出所を示す

出典：[docs/physics-ch01/WORKLOG.md](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/e907bf5fc22025fbd74127b9b72176b90aaeb36e/docs/physics-ch01/WORKLOG.md) / ## 2026-10-02 — User QA: 1D

採用除外理由：品質ラベル未確定／ユーザー発言原典と対象成果物の直接対応が未回復／評価対象の版が未確定

### P17 水平投射で共通の時間を再利用

元の状態：明確な修正前の対照は未回復。

修正・型の候補：方向分解→鉛直から落下時間→同じ時間で水平距離

抽出する条件付き規則：同一事象の時間の依存辺を保持する

出典：[docs/physics-ch01/WORKLOG.md](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/e907bf5fc22025fbd74127b9b72176b90aaeb36e/docs/physics-ch01/WORKLOG.md) / ## 2026-10-02 — 1E full repair

採用除外理由：品質ラベル未確定／ユーザー発言原典と対象成果物の直接対応が未回復／評価対象の版が未確定

### P18 斜方投射の修正版

元の状態：明確な修正前の対照は未回復。

修正・型の候補：標準公式の適用・時間消去・分岐を通した修正候補

抽出する条件付き規則：検証済みという作業記録だけで肯定を補わない

出典：[docs/physics-ch01/WORKLOG.md](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/e907bf5fc22025fbd74127b9b72176b90aaeb36e/docs/physics-ch01/WORKLOG.md) / ## 2026-10-02 — 1F full repair VERIFIED

採用除外理由：品質ラベル未確定／ユーザー発言原典と対象成果物の直接対応が未回復／評価対象の版が未確定

### P19 力と抵抗から終端速度へ

元の状態：明確な修正前の対照は未回復。

修正・型の候補：ma=Fnet→mg-kv→a→a=0→Fnet=0→vt

抽出する条件付き規則：因果の向きと終端条件を中間段階に置く

出典：[docs/physics-ch01/WORKLOG.md](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/e907bf5fc22025fbd74127b9b72176b90aaeb36e/docs/physics-ch01/WORKLOG.md) / ## 2026-10-02 — User QA: 「力と運動」

採用除外理由：品質ラベル未確定／ユーザー発言原典と対象成果物の直接対応が未回復／評価対象の版が未確定

### S01 集合が概念説明書になっている

元の状態：具体的な小問題から概念へ進まず定義を説明する

修正・型の候補：具体的な整理→一段の判断→意味→命名→使用

抽出する条件付き規則：概念名の前に理解に必要な判断を置く

出典：過去会話の検索要約。原文と成果物の対応は追加回復が必要。

採用除外理由：品質ラベル未確定／ユーザー発言原典と対象成果物の直接対応が未回復／評価対象の版が未確定／原成果物への固定参照が未確定

### S02 集合学習が単なる問題列になっている

元の状態：問題番号と回答列が主体

修正・型の候補：具体例と文章をつないで概念形成する

抽出する条件付き規則：教科書テンプレートを練習テンプレートと区別する

出典：過去会話の検索要約。原文と成果物の対応は追加回復が必要。

採用除外理由：品質ラベル未確定／ユーザー発言原典と対象成果物の直接対応が未回復／評価対象の版が未確定／原成果物への固定参照が未確定

### S03 集合previewへの強い肯定の候補

元の状態：過去会話の検索では公開previewへの強い肯定と再現用資料の要望が報告された

修正・型の候補：発言原文・提示URL・当時の版の対応を回復するまで正例には入れない

抽出する条件付き規則：強い肯定でも対象版が未確定なら学習ラベルを留保する

出典：過去会話の検索要約。原文と成果物の対応は追加回復が必要。

採用除外理由：品質ラベル未確定／ユーザー発言原典と対象成果物の直接対応が未回復／評価対象の版が未確定／原成果物への固定参照が未確定

### S04 約数を集めてから集合を名付ける

元の状態：24の正の約数を列挙する

修正・型の候補：共通条件を説明→集合と要素を命名→所属判断へ

抽出する条件付き規則：具体的操作→意味→名称→使用の候補

出典：[src/data/textbook/math/set/setLesson.ts](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/e907bf5fc22025fbd74127b9b72176b90aaeb36e/src/data/textbook/math/set/setLesson.ts) / id: 'paragraph-a01'

採用除外理由：品質ラベル未確定／ユーザー発言原典と対象成果物の直接対応が未回復

### S05 ド・モルガンを図の一致から導く

元の状態：A∩B→その補集合という領域を作る

修正・型の候補：別に補集合の和を作る→領域を比較→公式化

抽出する条件付き規則：二つの構成→比較→関係の命名の候補

出典：[src/data/textbook/math/set/setOutsideSlice.ts](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/e907bf5fc22025fbd74127b9b72176b90aaeb36e/src/data/textbook/math/set/setOutsideSlice.ts) / id: 'marker-example-demorgan'

採用除外理由：品質ラベル未確定／ユーザー発言原典と対象成果物の直接対応が未回復

### R01 現在の小問と必要な過去結果だけを示す

元の状態：長い過去の小問が画面を占める

修正・型の候補：現在の小問と必要な結果を残す

抽出する条件付き規則：練習モードの圧縮は依存結果を保持する

出典：過去会話の検索要約。原文と成果物の対応は追加回復が必要。

採用除外理由：品質ラベル未確定／ユーザー発言原典と対象成果物の直接対応が未回復／評価対象の版が未確定／原成果物への固定参照が未確定

### R02 問題と解説・穴埋めを分ける

元の状態：元問題と解く過程が混ざる

修正・型の候補：元問題を独立に提示し解説で推論する

抽出する条件付き規則：練習の元問題を保持する

出典：過去会話の検索要約。原文と成果物の対応は追加回復が必要。

採用除外理由：品質ラベル未確定／ユーザー発言原典と対象成果物の直接対応が未回復／評価対象の版が未確定／原成果物への固定参照が未確定

### N01 第四の大見出し

元の状態：三つの指定に対して参考・発展が同格で追加された

修正・型の候補：指定した三つに所属させる

抽出する条件付き規則：トップレベルの同格カード数を検査する

出典：[work/items/W-MATH-027-three-theme-pedagogy-repair/evidence/user-01.png](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/aadab755adc6d38fa2d348e060dec193bea7a68b/work/items/W-MATH-027-three-theme-pedagogy-repair/evidence/user-01.png) / ユーザーの番号付き指摘 1

採用除外理由：なし。ただし既知の回帰例であり、未使用評価例には使わない。

### N02 2A−3Bの計算

元の状態：分配と係数計算を飛ばす

修正・型の候補：分配→各項の計算→同類項の整理を表示する

抽出する条件付き規則：導出パターンの必要段階を検査する

出典：[work/items/W-MATH-027-three-theme-pedagogy-repair/evidence/user-02.png](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/aadab755adc6d38fa2d348e060dec193bea7a68b/work/items/W-MATH-027-three-theme-pedagogy-repair/evidence/user-02.png) / ユーザーの番号付き指摘 2

採用除外理由：なし。ただし既知の回帰例であり、未使用評価例には使わない。

### N03 二項式と三項式の積

元の状態：完成した多項式へ飛ぶ

修正・型の候補：各項の積→計算→整理を示す

抽出する条件付き規則：積の生成と同類項整理を分ける

出典：[work/items/W-MATH-027-three-theme-pedagogy-repair/evidence/user-03.png](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/aadab755adc6d38fa2d348e060dec193bea7a68b/work/items/W-MATH-027-three-theme-pedagogy-repair/evidence/user-03.png) / ユーザーの番号付き指摘 3

採用除外理由：なし。ただし既知の回帰例であり、未使用評価例には使わない。

### N04 掛算表の役割

元の状態：図の読み方と方法が説明されない

修正・型の候補：行と列→一つの積→全ての積→式へつなぐ

抽出する条件付き規則：図の読取対象・操作・結果への対応を持つ

出典：[work/items/W-MATH-027-three-theme-pedagogy-repair/evidence/user-04.png](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/aadab755adc6d38fa2d348e060dec193bea7a68b/work/items/W-MATH-027-three-theme-pedagogy-repair/evidence/user-04.png) / ユーザーの番号付き指摘 4

採用除外理由：なし。ただし既知の回帰例であり、未使用評価例には使わない。

### N05 和と差の積

元の状態：四つの積と打消しを一選択で処理する

修正・型の候補：積→符号→相殺→結論を示す

抽出する条件付き規則：独立した推論を完成式の選択に束ねない

出典：[work/items/W-MATH-027-three-theme-pedagogy-repair/evidence/user-05.png](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/aadab755adc6d38fa2d348e060dec193bea7a68b/work/items/W-MATH-027-three-theme-pedagogy-repair/evidence/user-05.png) / ユーザーの番号付き指摘 5

採用除外理由：なし。ただし既知の回帰例であり、未使用評価例には使わない。

### N06 公式と展開の選択

元の状態：何のための操作か分からない

修正・型の候補：操作の目的と使う場面を明示する

抽出する条件付き規則：学習目標と操作の対応を意味の審査で確認する

出典：[work/items/W-MATH-027-three-theme-pedagogy-repair/evidence/user-06.png](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/aadab755adc6d38fa2d348e060dec193bea7a68b/work/items/W-MATH-027-three-theme-pedagogy-repair/evidence/user-06.png) / ユーザーの番号付き指摘 6

採用除外理由：なし。ただし既知の回帰例であり、未使用評価例には使わない。

### N07 複数行を束ねた選択肢

元の状態：三つの計算・完成式をまとめて選ばせる

修正・型の候補：考える対象に合わせて判断を分ける

抽出する条件付き規則：自然な組を除き独立操作の束ねを拒否する

出典：[work/items/W-MATH-027-three-theme-pedagogy-repair/evidence/user-07.png](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/aadab755adc6d38fa2d348e060dec193bea7a68b/work/items/W-MATH-027-three-theme-pedagogy-repair/evidence/user-07.png) / ユーザーの番号付き指摘 7

採用除外理由：なし。ただし既知の回帰例であり、未使用評価例には使わない。

### N08 置換後の展開

元の状態：置換してから積・整理へ飛ぶ

修正・型の候補：置換→展開→整理→戻す手順を示す

抽出する条件付き規則：置換前後の依存と必要途中式を保持する

出典：[work/items/W-MATH-027-three-theme-pedagogy-repair/evidence/user-08.png](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/aadab755adc6d38fa2d348e060dec193bea7a68b/work/items/W-MATH-027-three-theme-pedagogy-repair/evidence/user-08.png) / ユーザーの番号付き指摘 8

採用除外理由：なし。ただし既知の回帰例であり、未使用評価例には使わない。

### N09 文章として読めない

元の状態：指示が断片化し段階の関係が分からない

修正・型の候補：何を受けて次へ進むか接続文を置く

抽出する条件付き規則：文章の意味と読書体験の審査を残す

出典：[work/items/W-MATH-027-three-theme-pedagogy-repair/evidence/user-09.png](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/aadab755adc6d38fa2d348e060dec193bea7a68b/work/items/W-MATH-027-three-theme-pedagogy-repair/evidence/user-09.png) / ユーザーの番号付き指摘 9

採用除外理由：なし。ただし既知の回帰例であり、未使用評価例には使わない。

### N10 四因子の組合せ

元の状態：組を選ぶ時点で展開済み二次式が提示される

修正・型の候補：組の意図→二因子の積→置換等の手順を示す

抽出する条件付き規則：学習者がまだ行っていない処理を解答候補で先取りしない

出典：[work/items/W-MATH-027-three-theme-pedagogy-repair/evidence/user-10.png](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/aadab755adc6d38fa2d348e060dec193bea7a68b/work/items/W-MATH-027-three-theme-pedagogy-repair/evidence/user-10.png) / ユーザーの番号付き指摘 10

採用除外理由：なし。ただし既知の回帰例であり、未使用評価例には使わない。


# W-MATH-003 / P-003 — N04〜N14 新規8単元の学習設計・依存グラフ（承認待ち）
Date: 2026-10-18 JST
Status: PROPOSED / DESIGN ONLY / NO IMPLEMENTATION AUTHORIZED
Repository: rrikunagasige-dot/kyotsu-step-web; reviewed base main b8e7f087756a0d819abe65f69ca13d03a9fb47fb
Subject/mode: 数学Ⅰ／教科書・学習モード；原Word既存問題の guided 教材化
Source: 01_数と式_教科書モード_対話段階導入版_v2(1).docx; 212863 bytes; SHA-256 93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa
Scope: 新規 N04(22), N05(20), N06(16), N07(14), N08(12), N11(14), N13(9), N14(16) = 123原問。
Related: N04_N14_SOURCE_SOLUTION_AUDIT.md（123原問ごとの独立導出、正解と認知操作）、P-003_N04_N14_BATCH_CREATION_REVIEW.md（exact Proposal）。

## 0. Authority, current state and source integrity

- Source type is teacher-edited Word draft based on a teaching textbook approach, not the original publisher's book. Original author/publisher answer booklet and redistribution clearance have not been produced. Independent solutions are marked provisional pending domain QA; no published answer authority is claimed.
- Keep original question wording, data, diagrams, order, cross-question dependencies; derived feedback/exposition is newly authored and attributed to this W-MATH-003 effort. Do not modify original DOCX.
- Reviewed already and excluded from this creation diff: N01, N02, N03, N09, N10, N12 (85 original markers, 90 existing interactions). No mixing with practice mode.
- User requested a broad eight-unit batch; pilot-first mathematical and browser QA still applies. Source text and original figures are distinct from newly authored connective paragraphs and thinking choices.
- Governing route: governance/INSTRUCTION_DICTIONARY.md CMD-WORK-002, work/templates/CREATION_DESIGN.md, subjects/mathematics/textbook/SPEC.md, docs/MASTER_APP_LESSONS.md, docs/MATH_RENDERING_RULES.md, docs/INFORMATION_ARCHITECTURE_RULES.md, earlier approved P-001/P-002.
- Original mathematics textbook master skill and original publisher source are not independently re-certified here; this file relies on accessible canonical-candidate spec and user-approved existing chapter pattern.

## 1. Learner-facing information architecture — 1節2〜3個のタイトル

| Existing topic card | Suggested visible subheadings (2–3 per topic) | Lesson order | Original source |
| --- | --- | --- | ---: |
| 式を整える | 多項式の基本／乗法公式と因数分解 | N01→N02→N03→N04→N05→N06 | 既存＋58 |
| 実数を扱う | 小数と有理数／絶対値の意味／根号と実数 | N07→N08→N09→N10 | 既存＋26 |
| 不等式を使う | 一次不等式／絶対値の方程式と不等式 | N11→N12→N13→N14 | 既存＋39 |

- Keep exactly 3 existing top-level topic cards and add 2–3 short subheadings inside each theme; do not flood the setup page with 14 equal-weight cards. One learner unit page has a main title and restrained section labels, consistent with the user's two-to-three-title preference.
- N13 treats an absolute-value **equation**, not an inequality; the subheading must say 方程式と不等式 and its concept type remains accurately labeled.
- N08 compares √5 with 3 before formal N09 roots; supply a small prerequisite reminder of √5 as the positive number whose square is 5, without front-running N09's full proof.
- The concrete status of existing six stays unchanged; new eight are review status initially. No automatic catalog elevation, state ID renumbering, or changes to Chapter 3, physics, mathematics practice, or existing learner-progress keys.

## 2. Concept dependency graph (arrows mean this knowledge is reused; not additional questions)

1. N01–N03: terms/polynomial addition/distribution → N04 multiplication formulas → N05 reverse distributive factoring → N06 grouping, substitution, and deliberate variable choice.
2. N07 rational/irrational & finite/recurring decimal → N08 distance/absolute value → N09–N10 root operations and properties. N08 makes only the tiny √5 known-number reminder noted above.
3. N11 strict/non-strict inequalities and sign reversal → N12 compound/word inequality → N13 absolute-value equation as an alternate distance branch → N14 absolute-value inequality and endpoint inclusion.
4. Within each unit Q01→... is the default unlock dependency **only when the next Q genuinely uses the answer**; conceptual subsegments may restart with a new motivating example. The implementation must explicitly declare dependencies, never infer transitive mathematical dependence just because UI order is adjacent.

## 3. Thirty-nine reasoning segments with explicit error focus

Each table row is a group of source marker nodes, not a single proposed student screen. There is at least one meaningful answer/checkpoint per original marker; exact UI interaction counts and literal four distractors are produced and reviewed with the learner prose during the implementation-authoring phase. No premature answer-filled figure.

### N04 — 展開の公式をつくる（原問22）

| 原問/ノード帯 | 動機・概念 | 文章→穴→フィードバック→解放 | 誤答診断（選択肢作成ルール） |
| --- | --- | --- | --- |
| N04-Q01–03 | 同じ括弧を2個掛けると4組の積になる | (5x+4y)²の4項→欠けた項→整理 | 25x²と16y²だけでは20xyを2回落とす |
| N04-Q04–05 | 具体例と記号 a,b の対応を取る | 原表N04-F01の4積→(a+b)² | a²+b²では交差積が不足 |
| N04-Q06–08 | bの符号だけを変え、同じ4積を追う | 差の平方と和差積の相殺 | (a-b)²の最後の+b²を負にしない |
| N04-Q09–13 | 公式を選ぶ基準は数値ではなく二つの塊 | (2a-5)²、(3x-2)(3x+2)、(ax+b)(cx+d) | 形の対応と係数ad+bcを明示 |
| N04-Q14–19 | 式の一部分をTと見ると既知公式で進める | (a+b±c)²、(x²+x+1)(x²-x+1) | Tを戻す前にTの意味を説明 |
| N04-Q20–22 | 4因子を一次係数が揃う2組に束ねる | 2組→T=x²+5x→4次多項式 | 最終展開式はQ22後だけ |

この帯の各問は `N04-Qxx` を原問IDとして保持し、アプリの選択段階IDとは別にsourceIdを持つ。数学上の正解・式・操作は監査表に全件記載。前の空欄が未回答の間はこの帯の末尾の完成式を隠す。

### N05 — 因数分解を見つける（原問20）

| 原問/ノード帯 | 動機・概念 | 文章→穴→フィードバック→解放 | 誤答診断（選択肢作成ルール） |
| --- | --- | --- | --- |
| N05-Q01–05 | 同じ括弧を見つけ、分配法則を逆向きに使う | 共通因数・逆展開・符号反転 | b-a=-(a-b)の負号を忘れない |
| N05-Q06–08 | 最初と最後が平方でも中央項で候補を検証する | 4x、3y、中央24xy→平方 | 外側の平方だけでは確定できない |
| N05-Q09–11 | (a+r)(a+s)の和と積を同時に合わせる | r+s=-6、rs=-16→積 | 候補を積だけで確定しない |
| N05-Q12–13 | 2次・1次・定数の係数から逆算 | pr、ps+qr、qs の3条件 | たすき掛けは独立の魔法でなく展開の逆 |
| N05-Q14–15 | N05-F01で候補A/B/Cの中間係数を比較 | 8/7/13→Bを選ぶ | N05-F02完成図はQ15まで非表示 |
| N05-Q16–18 | 新しい5x²の例に和積法則を移す | rsの符号→r,s決定→積 | 候補の両条件を確かめる |
| N05-Q19–20 | 共通因数を取り出してから平方差 | 3b→(a-2b)(a+2b) | 最初から差の平方とはしない |

この帯の各問は `N05-Qxx` を原問IDとして保持し、アプリの選択段階IDとは別にsourceIdを持つ。数学上の正解・式・操作は監査表に全件記載。前の空欄が未回答の間はこの帯の末尾の完成式を隠す。

### N06 — 式のまとまりを選ぶ（原問16）

| 原問/ノード帯 | 動機・概念 | 文章→穴→フィードバック→解放 | 誤答診断（選択肢作成ルール） |
| --- | --- | --- | --- |
| N06-Q01–04 | 共通部分x+2yをXと置いて簡単な二次式に戻す | Xを定義→整理→因数分解→戻す | Xの定義を忘れて展開終わりにしない |
| N06-Q05–07 | x⁴を(x²)²として二次式を作る | T=x²→二次式→平方差2回 | (x²-1)(x²-4)で因数分解停止しない |
| N06-Q08–12 | xより次数が低いyで整理すると共通因数が現れる | 次数比較→y項とそれ以外→共通塊 | 先に最終積を表示せず段階解放 |
| N06-Q13–16 | xで整理し、定数項の因数と一次係数を照合 | 2y²-3y-2の因数→和→全体 | 定数項の因数が必ず正しいx因数とは限らない |

この帯の各問は `N06-Qxx` を原問IDとして保持し、アプリの選択段階IDとは別にsourceIdを持つ。数学上の正解・式・操作は監査表に全件記載。前の空欄が未回答の間はこの帯の末尾の完成式を隠す。

### N07 — 有理数と実数を分類する（原問14）

| 原問/ノード帯 | 動機・概念 | 文章→穴→フィードバック→解放 | 誤答診断（選択肢作成ルール） |
| --- | --- | --- | --- |
| N07-Q01–05 | 割り算の余りに注目し、有限/周期の区別を理由づける | 3/4と23/11、余り周期の必然性 | 無限小数=無理数という誤解を修正 |
| N07-Q06–10 | 繰り返す部分を10または100倍で揃えて引く | 0.888…と0.6969…を分数に戻す | 繰り返し桁を有限桁の0.69と取り違えない |
| N07-Q11–12 | 分母10^kの素因数から有限小数を判定 | 2/5のみ→2〜20を列挙 | 2,5以外の因子があれば除外 |
| N07-Q13–14 | 自然数→整数→有理数→実数の拡張を理解 | a-b,a/bの例と有理数判定 | 循環小数は有理数として閉じる |

この帯の各問は `N07-Qxx` を原問IDとして保持し、アプリの選択段階IDとは別にsourceIdを持つ。数学上の正解・式・操作は監査表に全件記載。前の空欄が未回答の間はこの帯の末尾の完成式を隠す。

### N08 — 絶対値を距離として読む（原問12）

| 原問/ノード帯 | 動機・概念 | 文章→穴→フィードバック→解放 | 誤答診断（選択肢作成ルール） |
| --- | --- | --- | --- |
| N08-Q01–04 | 座標の負号と距離の正負を区別する | 原図N08-F01→非負/負の場合分け | 負の座標を負の距離にしない |
| N08-Q05–07 | √5と3の大小を平方で確かめてから絶対値を外す | 比較→正負→括弧を外す | 負符号は式全体に作用する |
| N08-Q08–09 | 同じ処理をπのある式へ転用 | 3-πの符号→π-3 | πの近似は原資料が許可 |
| N08-Q10–12 | 距離の意味から基本性質を帰結する | 零/対称/二乗 | 符号の2場合を飛ばさない |

この帯の各問は `N08-Qxx` を原問IDとして保持し、アプリの選択段階IDとは別にsourceIdを持つ。数学上の正解・式・操作は監査表に全件記載。前の空欄が未回答の間はこの帯の末尾の完成式を隠す。

### N11 — 不等式の変形を理解する（原問14）

| 原問/ノード帯 | 動機・概念 | 文章→穴→フィードバック→解放 | 誤答診断（選択肢作成ルール） |
| --- | --- | --- | --- |
| N11-Q01–04 | 負数倍で大小の向きが逆転する理由を差で示す | N11-F01の左右→c(b-a)の符号 | 0での乗除は別扱い |
| N11-Q05–07 | 正の係数で解き、境界が含まれない意味を見る | 3x<7→x<7/3→端点検算 | 1値ではなく全範囲が解 |
| N11-Q08–10 | 負の係数で解き、等号が残る意味を確認 | -2x≤2→x≥-1→端点 | 完成図N11-F02はQ10回答後 |
| N11-Q11–12 | 括弧のある不等式に応用する | -4x≥-26→x≤13/2 | 負の4で割る場面を穴に |
| N11-Q13–14 | 分母を消す操作は正の3倍から始める | x-2≤6x+3→x≥-1 | 分母3の符号を確認 |

この帯の各問は `N11-Qxx` を原問IDとして保持し、アプリの選択段階IDとは別にsourceIdを持つ。数学上の正解・式・操作は監査表に全件記載。前の空欄が未回答の間はこの帯の末尾の完成式を隠す。

### N13 — 距離から絶対値方程式を解く（原問9）

| 原問/ノード帯 | 動機・概念 | 文章→穴→フィードバック→解放 | 誤答診断（選択肢作成ルール） |
| --- | --- | --- | --- |
| N13-Q01 | \|x\|=5は左右2点、答えの後にN13-F02 | 正負の2候補 | 「または」と「かつ」を混同しない |
| N13-Q02–05 | x-1全体をXと置き、二つの解と距離を結ぶ | X=±4→x=5,-3→N13-F01の場合分け | 具体値が先に元図にないことを確認 |
| N13-Q06–08 | 符号分岐をx+2、3xの例で再利用 | 二つの方程式→各解 | X一塊を忘れてxだけに±を付けない |
| N13-Q09 | 絶対値の右辺が0/負の場合を整理 | 解1点または解なし | a>0の2点ルールを無条件で使わない |

この帯の各問は `N13-Qxx` を原問IDとして保持し、アプリの選択段階IDとは別にsourceIdを持つ。数学上の正解・式・操作は監査表に全件記載。前の空欄が未回答の間はこの帯の末尾の完成式を隠す。

### N14 — 絶対値の範囲を求める（原問16）

| 原問/ノード帯 | 動機・概念 | 文章→穴→フィードバック→解放 | 誤答診断（選択肢作成ルール） |
| --- | --- | --- | --- |
| N14-Q01–04 | 原点から近い点＝境界の内側 | -3,3→端点除外→範囲 | 厳密不等号の○ |
| N14-Q05–06 | 遠い点＝外側2本の範囲 | -4,4→端点含む→または | 一つの連続区間にしない |
| N14-Q07–08 | a>0の条件を明示し、一般式へ拡張 | \|X\|<a,\|X\|>aの2通り | 完成図N14-F01はQ6の後 |
| N14-Q09–12 | x-3とx+3を中身全体として扱う | 3辺加減／外側の二分岐 | 中の定数だけに条件を掛けない |
| N14-Q13–16 | \|3x-2\|≤4を3辺同時に整理し端点代入 | -4≤3x-2≤4→-2/3≤x≤2 | 端点両方で等号が成り立つ |

この帯の各問は `N14-Qxx` を原問IDとして保持し、アプリの選択段階IDとは別にsourceIdを持つ。数学上の正解・式・操作は監査表に全件記載。前の空欄が未回答の間はこの帯の末尾の完成式を隠す。

## 4. One-to-one source-marker → thinking node map (all 123)

| Source ID → candidate reasoning node | Answer sought / independently derived solution (author-only) | Cognitive action | Unlock/dependency |
| --- | --- | --- | --- |
| N04-Q01 → N04-Q01-think | (5x+4y)(5x+4y)=25x²+20xy+20xy+16y² | 4積を列挙 | unit intro → N04-Q01 → next only after validation |
| N04-Q02 → N04-Q02-think | 欠ける項は20xy+20xy=40xy | 中間項を発見 | N04-Q01 → N04-Q02 → next only after validation |
| N04-Q03 → N04-Q03-think | 25x²+40xy+16y² | 同類項の整理 | N04-Q02 → N04-Q03 → next only after validation |
| N04-Q04 → N04-Q04-think | (a+b)(a+b)=a²+ab+ba+b² | 対応表の4積 | N04-Q03 → N04-Q04 → next only after validation |
| N04-Q05 → N04-Q05-think | (a+b)²=a²+2ab+b² | 交換法則と一般化 | N04-Q04 → N04-Q05 → next only after validation |
| N04-Q06 → N04-Q06-think | (a-b)²=a²-ab-ba+b² | 符号を保って展開 | N04-Q05 → N04-Q06 → next only after validation |
| N04-Q07 → N04-Q07-think | (a-b)²=a²-2ab+b² | 中間項の符号確認 | N04-Q06 → N04-Q07 → next only after validation |
| N04-Q08 → N04-Q08-think | (a+b)(a-b)=a²-ab+ab-b²=a²-b² | 相殺の理由 | N04-Q07 → N04-Q08 → next only after validation |
| N04-Q09 → N04-Q09-think | (2a-5)²は差の平方 (2a,5)、(3x-2)(3x+2)は和と差 (3x,2) | 公式と塊の対応 | N04-Q08 → N04-Q09 → next only after validation |
| N04-Q10 → N04-Q10-think | (2a-5)²=4a²-20a+25；(3x-2)(3x+2)=9x²-4 | 2式の展開 | N04-Q09 → N04-Q10 → next only after validation |
| N04-Q11 → N04-Q11-think | (ax+b)(cx+d)=acx²+adx+bcx+bd | 4つの積 | N04-Q10 → N04-Q11 → next only after validation |
| N04-Q12 → N04-Q12-think | acx²+(ad+bc)x+bd | 一次係数の和 | N04-Q11 → N04-Q12 → next only after validation |
| N04-Q13 → N04-Q13-think | (3x+1)(x+2)=3x²+7x+2；一次は3x·2と1·x | 係数の由来 | N04-Q12 → N04-Q13 → next only after validation |
| N04-Q14 → N04-Q14-think | (T+c)²=T²+2Tc+c² | 塊を1文字化 | N04-Q13 → N04-Q14 → next only after validation |
| N04-Q15 → N04-Q15-think | (a+b+c)²=a²+b²+c²+2ab+2ac+2bc | T=a+bの復元 | N04-Q14 → N04-Q15 → next only after validation |
| N04-Q16 → N04-Q16-think | (a+b-c)²=a²+b²+c²+2ab-2ac-2bc | c→-cの置換 | N04-Q15 → N04-Q16 → next only after validation |
| N04-Q17 → N04-Q17-think | 共通の塊はx²+1、符号反転の塊はx | 和差の対応 | N04-Q16 → N04-Q17 → next only after validation |
| N04-Q18 → N04-Q18-think | (x²+1)²-x² | 平方差へ変換 | N04-Q17 → N04-Q18 → next only after validation |
| N04-Q19 → N04-Q19-think | x⁴+x²+1 | 展開して整理 | N04-Q18 → N04-Q19 → next only after validation |
| N04-Q20 → N04-Q20-think | (x+1)(x+4)=x²+5x+4、(x+2)(x+3)=x²+5x+6 | 一次係数を揃えた組 | N04-Q19 → N04-Q20 → next only after validation |
| N04-Q21 → N04-Q21-think | T=x²+5xとすると(T+4)(T+6)=T²+10T+24 | 共通の塊で圧縮 | N04-Q20 → N04-Q21 → next only after validation |
| N04-Q22 → N04-Q22-think | x⁴+10x³+35x²+50x+24 | Tの復元・係数整理 | N04-Q21 → N04-Q22 → next only after validation |
| N05-Q01 → N05-Q01-think | 共通の括弧はy+5 | 共通因数発見 | unit intro → N05-Q01 → next only after validation |
| N05-Q02 → N05-Q02-think | xT-3T=(x-3)T=(x-3)(y+5) | 分配法則の逆 | N05-Q01 → N05-Q02 → next only after validation |
| N05-Q03 → N05-Q03-think | (x-3)(y+5)=xy+5x-3y-15 | 逆展開で同値確認 | N05-Q02 → N05-Q03 → next only after validation |
| N05-Q04 → N05-Q04-think | b-a=-(a-b) | 引き算の符号反転 | N05-Q03 → N05-Q04 → next only after validation |
| N05-Q05 → N05-Q05-think | (a-b)x+(b-a)y=(a-b)(x-y) | 共通因数を揃える | N05-Q04 → N05-Q05 → next only after validation |
| N05-Q06 → N05-Q06-think | 16x²=(4x)²、9y²=(3y)² | 平方の候補 | N05-Q05 → N05-Q06 → next only after validation |
| N05-Q07 → N05-Q07-think | 2·4x·3y=24xy | 中央項の照合 | N05-Q06 → N05-Q07 → next only after validation |
| N05-Q08 → N05-Q08-think | 16x²+24xy+9y²=(4x+3y)² | 3項の符号・一致確認 | N05-Q07 → N05-Q08 → next only after validation |
| N05-Q09 → N05-Q09-think | (a+r)(a+s)=a²+(r+s)a+rs | 逆向き係数対応 | N05-Q08 → N05-Q09 → next only after validation |
| N05-Q10 → N05-Q10-think | r+s=-6、rs=-16 | 和・積の二条件 | N05-Q09 → N05-Q10 → next only after validation |
| N05-Q11 → N05-Q11-think | (r,s)=(-8,2)または(2,-8)；(a-8)(a+2) | 条件の同時充足 | N05-Q10 → N05-Q11 → next only after validation |
| N05-Q12 → N05-Q12-think | (px+q)(rx+s)=pr x²+(ps+qr)x+qs | たすきの一次係数の由来 | N05-Q11 → N05-Q12 → next only after validation |
| N05-Q13 → N05-Q13-think | pr=4、ps+qr=7、qs=3 | 三係数の一致 | N05-Q12 → N05-Q13 → next only after validation |
| N05-Q14 → N05-Q14-think | A:8、B:7、C:13（1次係数） | 全候補の比較 | N05-Q13 → N05-Q14 → next only after validation |
| N05-Q15 → N05-Q15-think | B：(x+1)(4x+3) | 三係数を満たす選択 | N05-Q14 → N05-Q15 → next only after validation |
| N05-Q16 → N05-Q16-think | (x+r)(5x+s)=5x²+(s+5r)x+rs；s+5r=-2、rs=-3 | 一般展開から条件へ | N05-Q15 → N05-Q16 → next only after validation |
| N05-Q17 → N05-Q17-think | rs=-3<0よりr,sは異符号 | 符号推論 | N05-Q16 → N05-Q17 → next only after validation |
| N05-Q18 → N05-Q18-think | r=-1、s=3；(x-1)(5x+3) | 和積条件を満たす | N05-Q17 → N05-Q18 → next only after validation |
| N05-Q19 → N05-Q19-think | 3a²b-12b³=3b(a²-4b²) | 最大共通因数 | N05-Q18 → N05-Q19 → next only after validation |
| N05-Q20 → N05-Q20-think | 3b(a-2b)(a+2b) | 平方差を再利用 | N05-Q19 → N05-Q20 → next only after validation |
| N06-Q01 → N06-Q01-think | X=x+2y；(X+1)(X-2)-4 | 共通塊の命名 | unit intro → N06-Q01 → next only after validation |
| N06-Q02 → N06-Q02-think | X²-X-6 | 二次式へ整理 | N06-Q01 → N06-Q02 → next only after validation |
| N06-Q03 → N06-Q03-think | (X-3)(X+2) | 二次式の因数分解 | N06-Q02 → N06-Q03 → next only after validation |
| N06-Q04 → N06-Q04-think | (x+2y-3)(x+2y+2) | 元の文字へ復元 | N06-Q03 → N06-Q04 → next only after validation |
| N06-Q05 → N06-Q05-think | T=x²；T²-5T+4 | 偶数次を二次式へ | N06-Q04 → N06-Q05 → next only after validation |
| N06-Q06 → N06-Q06-think | (T-1)(T-4)=(x²-1)(x²-4) | 置換した式の逆変換 | N06-Q05 → N06-Q06 → next only after validation |
| N06-Q07 → N06-Q07-think | (x-1)(x+1)(x-2)(x+2) | 平方差を最後まで | N06-Q06 → N06-Q07 → next only after validation |
| N06-Q08 → N06-Q08-think | xの最高次数3、yは1：yについて整理 | 低次の文字を選択 | N06-Q07 → N06-Q08 → next only after validation |
| N06-Q09 → N06-Q09-think | y(x²+x-2)+(x³+x²-2x) | y項と非y項の分離 | N06-Q08 → N06-Q09 → next only after validation |
| N06-Q10 → N06-Q10-think | x³+x²-2x=x(x²+x-2) | 後半からxをくくる | N06-Q09 → N06-Q10 → next only after validation |
| N06-Q11 → N06-Q11-think | (x+y)(x²+x-2) | 共通する括弧を発見 | N06-Q10 → N06-Q11 → next only after validation |
| N06-Q12 → N06-Q12-think | (x+y)(x+2)(x-1) | 二次式をさらに因数分解 | N06-Q11 → N06-Q12 → next only after validation |
| N06-Q13 → N06-Q13-think | x²+(3y-1)x+(2y²-3y-2) | xの降べき順 | N06-Q12 → N06-Q13 → next only after validation |
| N06-Q14 → N06-Q14-think | 2y²-3y-2=(2y+1)(y-2) | 定数項の和積 | N06-Q13 → N06-Q14 → next only after validation |
| N06-Q15 → N06-Q15-think | (2y+1)+(y-2)=3y-1 | xの一次係数と照合 | N06-Q14 → N06-Q15 → next only after validation |
| N06-Q16 → N06-Q16-think | (x+2y+1)(x+y-2) | 完全な積 | N06-Q15 → N06-Q16 → next only after validation |
| N07-Q01 → N07-Q01-think | 3/4=0.75；小数第2位で終了 | 割り算と有限小数 | unit intro → N07-Q01 → next only after validation |
| N07-Q02 → N07-Q02-think | 23÷11の余り1→(商0,余り10)→(商9,余り1) | 余りの再帰 | N07-Q01 → N07-Q02 → next only after validation |
| N07-Q03 → N07-Q03-think | 23/11=2.090909…=2.\overline{09} | 周期の記述 | N07-Q02 → N07-Q03 → next only after validation |
| N07-Q04 → N07-Q04-think | 0.75は有限小数、2.\overline{09}は循環小数；両者とも有理数 | 分類の区別 | N07-Q03 → N07-Q04 → next only after validation |
| N07-Q05 → N07-Q05-think | 0以外の余りは1,…,n-1の有限種類で、同一余りが必ず再出現（鳩の巣原理） | 循環の理由 | N07-Q04 → N07-Q05 → next only after validation |
| N07-Q06 → N07-Q06-think | 10x=8.8888…（最小倍率10） | 反復部分を一致させる | N07-Q05 → N07-Q06 → next only after validation |
| N07-Q07 → N07-Q07-think | 10x-x=8 → 9x=8 | 無限小数部分を差で消す | N07-Q06 → N07-Q07 → next only after validation |
| N07-Q08 → N07-Q08-think | x=8/9 | 循環小数→有理数 | N07-Q07 → N07-Q08 → next only after validation |
| N07-Q09 → N07-Q09-think | 100x=69.696969…；99x=69 | 2桁周期を合わせる | N07-Q08 → N07-Q09 → next only after validation |
| N07-Q10 → N07-Q10-think | 69/99=23/33 | 既約分数化 | N07-Q09 → N07-Q10 → next only after validation |
| N07-Q11 → N07-Q11-think | 10^k=2^k·5^k（kは正整数） | 有限小数の分母の素因数 | N07-Q10 → N07-Q11 → next only after validation |
| N07-Q12 → N07-Q12-think | a∈{2,4,5,8,10,16,20}（2≤a≤20） | 分母2と5だけを列挙 | N07-Q11 → N07-Q12 → next only after validation |
| N07-Q13 → N07-Q13-think | a=2,b=3：a-b=-1、a/b=2/3；どちらも自然数ではない | 数の拡張の動機 | N07-Q12 → N07-Q13 → next only after validation |
| N07-Q14 → N07-Q14-think | 0.696969…=23/33ゆえ有理数 | 循環しても有理数 | N07-Q13 → N07-Q14 → next only after validation |
| N08-Q01 → N08-Q01-think | 2.3と-5の原点からの距離は順に2.3,5 | 符号と距離の区別 | unit intro → N08-Q01 → next only after validation |
| N08-Q02 → N08-Q02-think | a≥0なら\|a\|=a | 右側の距離 | N08-Q01 → N08-Q02 → next only after validation |
| N08-Q03 → N08-Q03-think | a<0なら0-a=-a | 左側の距離 | N08-Q02 → N08-Q03 → next only after validation |
| N08-Q04 → N08-Q04-think | a=-5を代入すると-a=5>0 | 場合分けの検算 | N08-Q03 → N08-Q04 → next only after validation |
| N08-Q05 → N08-Q05-think | (√5)²=5<9=3²、両者非負より√5<3 | 比較の根拠 | N08-Q04 → N08-Q05 → next only after validation |
| N08-Q06 → N08-Q06-think | √5-3<0 | 符号判定 | N08-Q05 → N08-Q06 → next only after validation |
| N08-Q07 → N08-Q07-think | \|√5-3\|=-(√5-3)=3-√5 | 絶対値の除去 | N08-Q06 → N08-Q07 → next only after validation |
| N08-Q08 → N08-Q08-think | 3-π<0（π>3） | 根拠付き符号判定 | N08-Q07 → N08-Q08 → next only after validation |
| N08-Q09 → N08-Q09-think | \|3-π\|=π-3 | 符号に合わせて反転 | N08-Q08 → N08-Q09 → next only after validation |
| N08-Q10 → N08-Q10-think | \|a\|=0 ⇔ a=0（距離が0） | 定義から零の特徴づけ | N08-Q09 → N08-Q10 → next only after validation |
| N08-Q11 → N08-Q11-think | \|a\|=\|-a\| | 左右対称な距離 | N08-Q10 → N08-Q11 → next only after validation |
| N08-Q12 → N08-Q12-think | \|a\|²=a²（a∈R） | 2場合の統合 | N08-Q11 → N08-Q12 → next only after validation |
| N11-Q01 → N11-Q01-think | 2<5に-1を掛けると-2>-5 | 不等号の反転 | unit intro → N11-Q01 → next only after validation |
| N11-Q02 → N11-Q02-think | (b+c)-(a+c)=b-a>0 | 同じ加法で差が不変 | N11-Q01 → N11-Q02 → next only after validation |
| N11-Q03 → N11-Q03-think | bc-ac=c(b-a)：c>0ならac<bc、c<0ならac>bc；c=0は等号 | 符号による場合分け | N11-Q02 → N11-Q03 → next only after validation |
| N11-Q04 → N11-Q04-think | a<b ⇒ -a/5>-b/5、3-a>3-b | 負倍率と加法 | N11-Q03 → N11-Q04 → next only after validation |
| N11-Q05 → N11-Q05-think | 3x-2<5 → 3x<7 | 両辺に2を加える | N11-Q04 → N11-Q05 → next only after validation |
| N11-Q06 → N11-Q06-think | x<7/3 | 正の3で割る | N11-Q05 → N11-Q06 → next only after validation |
| N11-Q07 → N11-Q07-think | x=7/3を代入すると等号になり、厳密不等号は成立しない | 開いた端点 | N11-Q06 → N11-Q07 → next only after validation |
| N11-Q08 → N11-Q08-think | -2x+3≤5 → -2x≤2 | 両辺から3を引く | N11-Q07 → N11-Q08 → next only after validation |
| N11-Q09 → N11-Q09-think | 負の-2で割り x≥-1 | 反転の理由 | N11-Q08 → N11-Q09 → next only after validation |
| N11-Q10 → N11-Q10-think | x=-1は等号が成立するので解に含む | 閉じた端点 | N11-Q09 → N11-Q10 → next only after validation |
| N11-Q11 → N11-Q11-think | 6x+9≥10x-17 → -4x≥-26 | 展開と移項 | N11-Q10 → N11-Q11 → next only after validation |
| N11-Q12 → N11-Q12-think | x≤13/2（-4で割るため反転） | 負数除算 | N11-Q11 → N11-Q12 → next only after validation |
| N11-Q13 → N11-Q13-think | (x-2)/3≤2x+1 → x-2≤6x+3 | 正の3を両辺へ掛ける | N11-Q12 → N11-Q13 → next only after validation |
| N11-Q14 → N11-Q14-think | -5≤5x → x≥-1 | 同類項の整理 | N11-Q13 → N11-Q14 → next only after validation |
| N13-Q01 → N13-Q01-think | \|x\|=5 ⇒ x=5またはx=-5 | 原点から左右に等距離 | unit intro → N13-Q01 → next only after validation |
| N13-Q02 → N13-Q02-think | X=x-1と置き、X=4またはX=-4 | 中身全体を1変数化 | N13-Q01 → N13-Q02 → next only after validation |
| N13-Q03 → N13-Q03-think | x-1=4またはx-1=-4 | 元の文字へ復元 | N13-Q02 → N13-Q03 → next only after validation |
| N13-Q04 → N13-Q04-think | x=5またはx=-3 | 2分岐の解 | N13-Q03 → N13-Q04 → next only after validation |
| N13-Q05 → N13-Q05-think | x≥1なら\|x-1\|=x-1、x<1なら\|x-1\|=1-x | 左右の距離場合分け | N13-Q04 → N13-Q05 → next only after validation |
| N13-Q06 → N13-Q06-think | x+2=3またはx+2=-3 | 絶対値方程式への変換 | N13-Q05 → N13-Q06 → next only after validation |
| N13-Q07 → N13-Q07-think | x=1またはx=-5 | 2解の確認 | N13-Q06 → N13-Q07 → next only after validation |
| N13-Q08 → N13-Q08-think | 3x=6または3x=-6 ⇒ x=2,-2 | 係数付き式の変換 | N13-Q07 → N13-Q08 → next only after validation |
| N13-Q09 → N13-Q09-think | \|x\|=0の解はx=0；\|x\|=負の値は実数解なし | 距離の非負性 | N13-Q08 → N13-Q09 → next only after validation |
| N14-Q01 → N14-Q01-think | \|x\|<3：原点からの距離が3より小さい | 数直線の意味 | unit intro → N14-Q01 → next only after validation |
| N14-Q02 → N14-Q02-think | 境界は-3と3 | 等距離の2位置 | N14-Q01 → N14-Q02 → next only after validation |
| N14-Q03 → N14-Q03-think | 間を残し端点は除く（厳密不等号） | 内外と端点 | N14-Q02 → N14-Q03 → next only after validation |
| N14-Q04 → N14-Q04-think | -3<x<3 | 二重不等式 | N14-Q03 → N14-Q04 → next only after validation |
| N14-Q05 → N14-Q05-think | \|x\|≥4：境界-4,4；外側・端点を含む | 内外と等号 | N14-Q04 → N14-Q05 → next only after validation |
| N14-Q06 → N14-Q06-think | x≤-4またはx≥4 | 論理「または」 | N14-Q05 → N14-Q06 → next only after validation |
| N14-Q07 → N14-Q07-think | a>0なら\|X\|<a ⇔ -a<X<a | 一般化（内側） | N14-Q06 → N14-Q07 → next only after validation |
| N14-Q08 → N14-Q08-think | a>0なら\|X\|>a ⇔ X<-a または X>a | 一般化（外側） | N14-Q07 → N14-Q08 → next only after validation |
| N14-Q09 → N14-Q09-think | \|x-3\|<5 ⇔ -5<x-3<5 | 中身を一つの数とする | N14-Q08 → N14-Q09 → next only after validation |
| N14-Q10 → N14-Q10-think | -2<x<8 | 3辺すべてに3を加える | N14-Q09 → N14-Q10 → next only after validation |
| N14-Q11 → N14-Q11-think | \|x+3\|≥2 ⇔ x+3≤-2 または x+3≥2 | 外側・等号込み | N14-Q10 → N14-Q11 → next only after validation |
| N14-Q12 → N14-Q12-think | x≤-5 または x≥-1 | 各分岐を解く | N14-Q11 → N14-Q12 → next only after validation |
| N14-Q13 → N14-Q13-think | \|3x-2\|≤4 ⇔ -4≤3x-2≤4 | 閉じた内側 | N14-Q12 → N14-Q13 → next only after validation |
| N14-Q14 → N14-Q14-think | -2≤3x≤6 | 3辺に2を加える | N14-Q13 → N14-Q14 → next only after validation |
| N14-Q15 → N14-Q15-think | -2/3≤x≤2 | 3辺を正の3で割る | N14-Q14 → N14-Q15 → next only after validation |
| N14-Q16 → N14-Q16-think | x=-2/3とx=2でそれぞれ\|3x-2\|=4；両端を含む | 原式で端点検算 | N14-Q15 → N14-Q16 → next only after validation |

**Design status of choices:** above maps every source marker to a candidate meaningful thought operation; it is not an assertion that all 123 finalized four-choice screens or complete student-facing paragraphs already exist. In implementation, split compound two-step reasoning into multiple distinct stable choice IDs where warranted; use sourceId to keep one-to-many coverage transparent. Never auto-generate distractors by naive expression substitution; analyze the actual source's common errors and include short explanation per wrong answer.

## 5. Eight representative detailed thinking nodes (interaction design contract)

| Candidate node | Problem focus and moment | Learner action / correct class | Distractor misconceptions to write explicitly | After-correct unlock |
| --- | --- | --- | --- |
| N04-Q02-think | Just after four products of (5x+4y)², before simplification | Identify the **two** middle 20xy terms and total 40xy | Drop both; count only one; confuse 5x×4y with 5x×5x | Group four products and formalize square formula |
| N05-Q15-think | With original unfilled cross-diagram N05-F01, before answer-filled N05-F02 | Select candidate matching both leading/trailing coefficients and middle sum | Product matches but sum wrong; sign swapped; factor 5 ignored | Reveal original completed diagram F02 and reverse-expand |
| N06-Q04-think | T=x+2y after quadratic is factored | Substitute T back inside both factors | Leave abstract T; substitute only one factor; expand and lose structure | Next x² substitution problem |
| N07-Q10-think | 100z-z for 0.696969… | Distinguish 69/99 = 23/33 from 69/100 | Treat repeating as terminating; use factor 10 instead of 100; forget z subtraction | Fractional-decimal equivalence conclusion |
| N08-Q07-think | After comparing √5<3 | Remove absolute-value brackets while preserving whole-expression sign | Negate only √5; assume √5>3; preserve brackets | Show a two-case property in prose |
| N11-Q12-think | From -4x ≥ -26 | Divide by negative 4 **and reverse** direction | Retain ≥; calculate 26/4 wrong; use > rather than inclusive | Check x=13/2 equality then new fraction case |
| N13-Q04-think | From \|x−1\|=4, two signed equations ready | Give both x=5 and x=−3 as an OR pair | One solution only; sign on x rather than x−1; pair as simultaneous AND | Display distance interpretation on number line |
| N14-Q16-think | After solving -2/3≤x≤2 | Substitute **both** endpoints back in | Exclude endpoints; check just one; forget entire expression 3x−2 | Reveal inclusive segment explanation and next independent application |

## 6. Figure manifest and leakage timing: source PNG bytes must remain identical

| Figure ID (Word asset) | SHA-256 / source role | On-screen placement / unlock | Answer leak risk and QA |
| --- | --- | --- | --- |
| N04-F01 (image2.png) | 30473a1bc46c5826264f1bfd69ffd66927b1041694bf2f9f2b8fbb81ab2e6f6e / product grid | Prior to Q04; blank grid only | No prefilled four-cell answers before Q04–05 |
| N05-F01 (image3.png) | 0047c6f0a594d278d985fbeba0693e0ec6adff89330c55c86564e470cbcc5ea2 / cross-coefficient | Before Q14–15 | Verify label positions and arithmetic choices at mobile width |
| N05-F02 (image4.png) | 3d3340a879baf5b9cf7854e6caaf7b49479435be5a79b68b1552c634839a64bb / answer-filled cross | **Only after Q15 correct** | Full completed product is a hidden answer until then |
| N08-F01 (image5.png) | 817ab6ad3afb71b009cc95796e267d0818a104ecf19864c55c2ba0afbf29da73 / ± positions | Before Q01 | 2.3 and -5 distances must read correctly |
| N11-F01 (image7.png) | f0c384f8773369152c3f60dc1ab7aaa4504d7cfc8d2957df1b22bb9abe739d2e / inequality orientation | Before Q01 | Source diagram expresses sign reversal, no future Q answer |
| N11-F02 (image8.png) | 13690a1f2f310049cd25125603b26923cc9bce0818ad720d35e77e07f58d1677 / completed interval | **Only after Q10 correct** | Endpoint inclusion and direction previously hidden |
| N13-F02 (image12.png) | f6da628bb27b8214bb3c4492fa66de4775aadbcde2b7ea427536dde68272e8bc / ±5 solution | **Only after Q01 correct** | Would reveal Q01 two answers if shown earlier |
| N13-F01 (image13.png) | 1552aee535bfb4996da4a10c61927c466fc09f9b3b607ad9f0bd1efe42dbe3df / x relative to 1 | After Q04 and before Q05 (subject to image QA) | Do not front-run x=5,−3 or case sign before related response |
| N14-F01 (image14.png) | 0f4423c1134a92824bb75226d3dd0307449871f45a4063fbfd5e23a0ba7f1195 / inner/outer completed range | **Only after Q06 correct** | Completed boundary diagram would reveal the inequality region |

Figure byte checks prove original provenance, **not** on-device legibility or original pedagogical correctness. During implementation check images visually and preserve their internal mathematics; do not redraw or crop in a way that changes meaning. Accessible alt text must not itself reveal an answer before its gate.

## 7. Student reading flow and visual hierarchy

1. Intro motivating expression/distance/inequality and define the learner's immediate objective in a black-text explanation.
2. Recall one needed earlier law only at the exact transition (distributive law; fraction long-division remainder; coordinate distance; inequality reversal).
3. Prompt one meaningful decision inline within an intact paragraph and equation grouping; present accessible choices and wrong-reason feedback. Hide derivation after the hole until correct.
4. After correct response, reveal the completed local expression/semantic explanation; introduce **definition** in its own typographical treatment. Only then show a **proof** if it supports a property (N04 distribution derivation; N07 repeating-decimal algebra; N11 difference sign; N14 interval equivalence).
5. Separate **example** label and worked use from proof label; transfer to another source marker and gradually reduce hints. Maintain only 2–3 visible subheadings per topic; no nested-card overload.
6. Present original source figures where mapped above. Keep an image byte-faithful and use staged rendering rather than prefilled diagrams.

### Per-unit prose strategy

- N04: begin with distributive four-part product, derive general formulas and then let the learner choose formula/compound expression. Proof by expansion is intrinsic; no separate decorative proof heading necessary.
- N05: reverse the same multiplication to build factoring, then explain cross multiplication by expansion. N05-F02 is confirmation, not prior hint.
- N06: motivate substitution as conservation of repeated structure, not a new identity. Show both substitution and inverse substitution.
- N07: compare 3/4 with 23/11 by remainder, establish finite/recurring facts with an actual argument, use 0.696969…→23/33 to prove rationality.
- N08: number-line distance first, then case distinction, include √5 reminder and sign comparison before absolute-value transformation.
- N11: explain sign reversal via c(b−a), identify c=0 separately, prove inequality rules before solving. Show inclusive vs open endpoint explicitly.
- N13: distance from center, two mutually exclusive positions, then offset/scale; negative right-side impossible due nonnegative distance.
- N14: distance inside vs outside, strict vs inclusive endpoints and two-branch OR, then compound inequality algebra with endpoint substitution.

## 8. Draft implementation and verification — not yet authorized

- Pilot order: N04 (four products/formula diagram) and N05 (cross diagram + answer gate) first, QA on desktop/mobile and source fidelity; then N06/N07/N08/N11/N13/N14 on the same approved source/design, with regression at each batch. All eight sit in a single P-003 authorization scope only if explicitly approved after exact review.
- Code paths likely affected: backend/data/textbooks/math-1a new numbers-expressions lesson modules, source index/manifest, matching stable math-numbers-expressions-nxx IDs, learner-topic catalog setup and next-unit navigation, original-image assets and manifests, focused schema/lesson/browser tests; locate exact code paths from current HEAD before any edits.
- Keep already approved six lesson IDs, their wording/questions/figures and progress keys byte/semantic stable. New lessons start status=review; visibility in existing review-only catalog needs separate user-reviewed release and testing.
- Technical gates: 123 original markers with explicit source IDs; all mathematical solutions/conditions/signs/edge cases rechecked independently; zero omissions/false dependencies; math rendering compile; KaTeX; diagram leakage gates; full 123+ decisions progression; 320px/mobile and desktop browser; accessibility; lint/typecheck/unit/build/governance; no physics/practice/Chapter3 regression.
- Publish sequence only after authorized app phase: independent implementation PR → green tests and real preview → user review → separate merge/Pages authorization → verify actual working chapter-1 deep links. Design-only PR is not an app URL.
- Open questions: author answer book absent; educational work permissions not attested; verify N13-F01 illustration timing and √5 prerequisite wording during pilot; 123 markers need exact polished learner prose and individualized choice feedback before production. None is grounds to silently invent source equations.

## 9. Approval gate and review status

This design plus the 123-row solution audit is a **proposed** exact P-003. Existing approvals of P-001/P-002 do not by themselves authorize publishing these eight new learner modules. On user's explicit approval, begin the implementation branch and pilot; without it, stop at documentation review. Separate explicit consent before merging to main/Pages. Work remains VERIFYING, not DONE.

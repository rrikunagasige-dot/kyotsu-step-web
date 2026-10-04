# MATH PRACTICE MASTER LESSONS — 数学・練習モード必読

Status: MANDATORY FIRST-READ FOR EVERY MATH PRACTICE CHANGE

対象:
- Math I・A 基礎演習 / 4STEP 系練習モード
- 現在の pilot: 87 / 94 / 97
- 今後の 88–120 展開

Purpose:
このファイルは、数学練習モードを作る過程で、物理教科書モードの成功・失敗、数学pilotのuser QA、数式rendering、タイトル/階層、穴埋め、subproblem設計、依存関係、mobile UI、修正workflowから得た教訓を一つに統合する。

数学練習モードを変更・追加する前に、毎回このファイルを読む。

このファイルを読まずに、問題追加、穴変更、UI変更、章/テーマ構造変更、renderer変更、batch import、87/94/97の一般化、88–120展開を始めない。

87〜120を扱う場合は、このMASTERを読んだ直後に必ず次も読む:

- docs/MATH_PRACTICE_87_120_STRUCTURE_MAP.md

このSTRUCTURE MAPは、4STEP原本87〜120を読み直して固定したテーマ分類、stage、depends_on、result node、feeds、cross-problem dependencyの実装前設計図である。本文・穴・UIを先に作らない。

---

# 0. Authority / precedence

競合時の優先順位:

1. 最新の明示的なユーザー判断
2. この MATH_PRACTICE_MASTER_LESSONS.md
3. docs/MASTER_APP_LESSONS.md
4. docs/MATH_RENDERING_RULES.md
5. docs/math-practice-87-120-pilot-findings.md
6. 物理Chapter 1の詳細rules / audit / user-QA lessons
7. old prototypes / stale branches / historical snapshots

後のuser QAが古い設計と衝突した場合、後のuser QAを優先する。

---

# 1. 絶対に守る作業順

数学練習モードでは、いきなりコードを書かない。

要求を読む
→ このMASTERを読む
→ 関連authorityを読む
→ 現在実装を監査
→ 問題を列挙
→ scopeを固定
→ 必要なら依存関係図を作る
→ 修正案を言語化
→ user approval
→ 小さく実装
→ unit tests
→ mobile browser
→ desktop browser
→ build
→ deploy
→ user hands-on QA

ユーザーが「まず分析」「まだ直すな」と言ったらコード変更禁止。

---

# 2. Scope control

「87だけ」「94だけ」「タイトルだけ」「表示だけ」は変更境界。

実装前に常に明確化する:

CHANGE:
- exact problem / exact UI behavior

KEEP:
- mathematical content
- already approved blanks
- neighboring problems
- physics files
- Common-Test flow
- stable IDs
- unrelated renderer behavior

数学の修正中に物理ファイルがdiffへ入ったら停止して確認する。

---

# 3. 情報設計 — まず問題番号を見せない

初期失敗:
87｜素数と集合、94｜補集合、97｜共通部分から定数を決める、をトップlevelのdropdownへ直接並べた。

これは物理で成功した「章 → 少数テーマ → 学習」の構造と違った。

現行原則:

数学 I・A
→ 演習タイプ
  → 基礎演習 / 共通テスト演習
→ 章
→ テーマ
→ 問題

基礎演習では現在:

集合と命題
- 集合を整理する
- 条件から命題を読む
- 命題を証明する

関数
- 関数を表す

問題番号は学習テーマではなく教材identity。

---

# 4. テーマを押したら、すぐ問題へ入る

重要なuser-approved rule:

テーマカード → 余計な選択画面なし → 最初の問題へ直行

禁止:
- 「選択中のテーマ」巨大summary
- 問題番号dropdown
- もう一度「この設定で問題を解く」
- テーマを押した後の中間確認画面

問題番号カードは問題画面の中に置く。

pilot:
1 = source 87
2 = source 94
3 = source 97

今後問題が増えたらtopic内でsource番号順に自動配置する。

---

# 5. 問題本文と解説は明確に分ける

画面は原則:

問題
---
元問題

考えながら解く
---
guided reasoning / holes

元問題には解法、ヒント、中間式、正解を漏らさない。
元問題は「何を求めるか」を明確にする。

---

# 6. 数学の内容は自然な文章として完成していなければならない

物理で得た最重要writing ruleを数学にも適用する:

まず穴なしでも成立する自然な解説を書く
→ その解法の中の重要判断を特定
→ そこだけ穴にする
→ 正解すると元の自然な文章へ戻る
→ 完成した解説をそのまま読み続ける

Bad:
説明カード → 問題カード → 説明カード → 問題カード、の断片列。

Preferred:
一続きの解法文章の中にinteractive holeがある。

---

# 7. 穴は「消した単語」ではなく thinking node

有効な穴:
- 問題理解
- 条件整理
- 既習事項retrieval
- state update
- strategy choice
- relation selection
- equation generation
- meaningful transformation
- reason
- interpretation
- intermediate-result reuse

避ける:
- 接続詞
- 数字だけの当て物
- すぐ上に書いてあるもののコピー
- 最終答だけ
- 未習概念の名前当て
- 問題数稼ぎ

「なぜここを穴にするのか」を説明できない穴は削る。

---

# 8. 2段飛ばしをしない

非自明な推論を2段以上飛ばさない。

何を求める？
→ まず何を確認する？
→ なぜ必要？
→ 条件 / relation
→ 式
→ 変形
→ 結果
→ 意味 / 次に何へ使う？

formula contract:
why needed → symbols / meaning → equation → what it means → what it enables

---

# 9. 物理から持ってきたinline interaction design

user-approved Math 87 design:

- 本文中に小さい「選択」
- 押すとその直下に選択肢
- Bottom Sheetへ飛ばさない
- 正解後は答えが文章へ自然に埋め込まれる
- 間違いは赤い「もう一度」
- 再open時に短いhint
- 正答するまで unresolved
- 正答後に次のthinking nodeを出す

このinteraction languageを基本とする。

---

# 10. 一つの推導 = 一つの視覚的まとまり

連続式を別々の大きい白カードへ分割しない。

一つの導出frameの中で:
親relation
→ 代入
→ 変形
→ 結果

「途中式を増やす」と「穴を増やす」は別。

---

# 11. 数式は全surfaceで同じrendererを使う

実際に出たbug:
overline(A) ∩ B がraw textのまま表示された。

現行hard rule:
問題文 / prompt / choice / hint / resolved answer / target label で、同じ数学表現は同じ数学rendererを通す。

集合記号:
- overline(A)
- ∩
- ∪
- ∈
- ∉
- finite set literals
- grouped complements

をplain proseへ放置しない。

数式QA:
1. semantic correctness
2. compile correctness
3. visual correctness
4. mobile overflow
5. no raw authoring syntax

---

# 12. progressive reveal は「未来を隠す」だけでは不十分

初期pilotではfuture contentを隠せても、過去の完成済み推導を圧縮できなかった。

長い94で文章が上へ蓄積し、「今何を解いているのか分からない」問題が起きた。

今後の原則:

current subproblem only + required previous results

---

# 13. 「今の問い」を常に明確にする

target anchorは必要。

87:
今の問い  2 □ A

94:
今の問い｜(3)
Ā ∩ B

97:
まずの目標  aを求める
次の目標    条件を確認する
最後の目標  A∪B

ただしtarget anchorだけ置いて、過去の推導を全部残してはいけない。

---

# 14. 最重要 — subproblem compression

user-approved 94の設計。

現在の小問以外の長い推導は常時表示しない。

(1)を解いている時:
- (1)の文章
- (1)の穴
- (1)の式
だけ。

(2)へ進んだら:
- (1)の長い推導は消える
- (2)だけ表示

(3)が(1)の結論を使うなら:

← (1) の結果   Ā = {...}

というcompact result linkだけ表示。

linkを押した時だけ(1)の推導を展開できる。
defaultは閉じる。

---

# 15. 先に依存関係図を作る

長いmulti-part問題は、本文を書き始める前に論理関係を定義する。

最低metadata:

subproblem
- own_steps
- depends_on
- imported_results
- result
- feeds

昔の式関係図で使った:
- depends_on
- basis
- operation
- purpose
- feeds

を再利用する。

表示順だけを見て依存関係を決めない。

---

# 16. 94のcurrent approved dependency graph

現在の解法に基づく:

(1) Ā → (3), (5), (6)
(2) B̄ → (4), (5), (6)
(7) A∩B → その補集合
(8) A∪B → その補集合

(7)(8)は現在のguided solutionでは内側集合をその場で求めるので、(1)(2)resultを機械的にimportしない。

前に解いたから出すのではなく、今必要だから出す。

---

# 17. result node は再利用可能な小さいknowledge object

小問が終わったら、UI上では長い推導を残さず:

RESULT:
(1) Ā = {...}

のようなcompact result nodeへ圧縮する。

後の小問はresultをimportする。

result linkは:
- 何番の結果か
- 結論
- 必要なら数学表現

だけを常時表示。

full derivationはclick-to-expand。

---

# 18. semantic reveal, not blanket reveal

「未解決穴より後ろを全部隠す」だけでは不十分。

必要なcontextは見せる。
答え漏れになるfuture reasoningだけ隠す。

current subproblemでは:
- target
- 必要な元条件
- imported previous result
- current reasoning

を見せてよい。

不要なpast derivationは隠す。

---

# 19. 87 / 94 / 97 は同じ形に無理にしない

共通UI思想は持つが、論理構造は問題ごとに違う。

87:
- common rule
- 2 / 15 / 21 / 29 の独立membership判断
- previous number resultは通常次へ不要
- 不要なresult linkを作らない

94:
- multi-subproblem dependency graph
- 以前のresultのselective importが必要

97:
- linear dependency
  aを求める
  → aを代入してA,Bを確認
  → A∪B
- 前段resultを次段へ明示的に渡す

UI templateではなくlogical structureを先に決める。

---

# 20. 問題終了後は流れを切らない

user-approved behavior:

問題完了後:
- 次がある → 「次の問題を解く」
- topic最後 → 「テーマ選択へ戻る」

不要:
- completion専用の大げさな別画面
- 再び問題選択画面を経由

テーマ内学習を連続させる。

---

# 21. 長い問題ほど「一度に短く見せる」

phone-first rule。

理想:
- current subproblemの文章は短い
- current derivationだけ
- imported resultsは1〜2行
- 過去詳細はtapで展開
- future stepsはまだ表示しない

一画面に全部読めることを目標にしない。
今やることが明確であることを目標にする。

---

# 22. source fidelity を壊さない

内容が十分良いとuserが判断した場合、design修正のために数学内容を書き換えない。

特に:
- original problem
- blank order
- correct answer
- meaningful reasoning chain

をUI都合で変更しない。

sourceに不確かな問題はimport前に再確認する。

---

# 23. Physicsを参考にする時の注意

参考にする:
- reasoning-flow design
- inline hole
- retry behavior
- formula rendering
- one derivation frame
- mobile readability
- semantic grouping
- audit / repair process

そのまま持ってこない:
- textbook-specific progress panels
- chapter reader state
- figure-heavy learning-mode affordances
- physics-only section structure

数学は練習問題なので必要最小限にする。

---

# 24. 問題追加前の必須設計表

88–120を1問追加する前に最低限これを作る:

Problem:
Goal:

Subproblems / stages:
1.
2.
3.

For each stage:
- target
- prerequisite
- own reasoning steps
- depends_on
- imported result
- result node
- feeds
- hole purpose
- math rendering risk
- leakage risk

この表なしで長い問題をlinear blanksへ直書きしない。

---

# 25. user-approved behaviorはtestへ固定する

testはexecutable memory。

必須gate候補:
- theme click opens first problem directly
- problem nav is inside problem page
- problem vs guide separation
- first unresolved node only
- wrong answer stays unresolved
- correct answer becomes inline completed prose
- no raw overline(
- no horizontal overflow mobile
- current target visible
- finished subproblem derivation disappears
- dependency result appears only when required
- unrelated result does not appear
- dependency detail collapsed by default
- click expands prior derivation
- mobile + desktop both PASS

---

# 26. Automated PASS と pedagogical PASS を分ける

typecheck
→ unit tests
→ catalog parity
→ math renderer tests
→ mobile Playwright
→ desktop Playwright
→ production build
→ Pages deploy
→ USER HANDS-ON QA

最後のuser QAまで「完成」と断定しない。

---

# 27. 一度に全部へ一般化しない

今回の94で成功した方法:

1 problem
→ user QA
→ accept
→ generalize

長い新機構は:
- まずstress case
- user確認
- その後87/97
- さらに88–120

にする。

---

# 28. 現在のaccepted Math practice design

数学 I・A
→ 基礎演習
→ 章
→ テーマカード
→ テーマを押す
→ 問題1へ直行
→ [1][2][3] ... 問題内navigation
→ 問題
→ 考えながら解く
  - current target
  - required previous-result links
  - current subproblem only
  - inline holes
  - inline choices
  - retry / hint
→ 問題完了
→ 次の問題を解く

---

# 29. 作業開始前チェックリスト

毎回、次にYesと言えるまで実装開始しない。

- [ ] 最新user requestを読み直した
- [ ] このMASTERを読んだ
- [ ] current main HEADを確認した
- [ ] scopeを1文で言える
- [ ] 変更しない範囲を言える
- [ ] 問題内容を変えるのか、表示だけ変えるのか区別した
- [ ] 長い問題ならdependency graphを作った
- [ ] current targetを定義した
- [ ] subproblem result nodeを定義した
- [ ] previous resultを本当に使うか確認した
- [ ] 不要なpast derivationを画面に残さない
- [ ] formula surfaceを確認した
- [ ] answer leakageを確認した
- [ ] mobileで一度に見える量を確認した
- [ ] testへuser-approved behaviorを追加する計画がある

---

# 30. 修正中チェックリスト

- [ ] 一つのdefect classだけ直している
- [ ] mathematical contentを意図せず変更していない
- [ ] stable IDsを壊していない
- [ ] Physics filesがdiffに入っていない
- [ ] Common-Test Mathへ影響していない
- [ ] current subproblem以外の文章を積み上げていない
- [ ] dependency resultを必要な時だけ表示している
- [ ] raw math authoring syntaxが見えていない
- [ ] wrong answerをprogress扱いしていない

---

# 31. 完了前チェックリスト

- [ ] unit tests PASS
- [ ] math rendering tests PASS
- [ ] mobile browser PASS
- [ ] desktop browser PASS
- [ ] no page horizontal overflow
- [ ] production build PASS
- [ ] Pages deploy PASS
- [ ] userが実機確認できる
- [ ] docsに新しいreusable lessonが必要なら追記した

---

# 32. 最重要まとめ

数学練習モードで一番大事なのは:

一度に大量の解説を見せることではない。
今何を解いているかを明確にし、必要な推論だけ見せ、過去の結果は必要な時だけ小さく再利用する。

そして:

UIを先に作るのではなく、問題の論理関係を先に作る。

さらに:

穴は文章を壊すものではなく、完成した解法の中のthinking nodeである。

最後に:

user-approved behaviorをdocumentとtestの両方へ残し、次のAIが毎回最初から同じ失敗をしないようにする。


---

# 33. 図も answer leakage になる

2026-10-04 release QA で追加された重要ルール。

答え漏れは文章だけではない。

図の次の要素も、learner-owned thinking node の答えを先に示し得る:
- ○ / ● の端点
- 矢印の向き
- 区間の塗り
- 完成済みの式
- branch の完成形
- 数値ラベル
- right-angle / equal-side marks
- summary 状態

実例:
- 99-(4): `P=[-2,2]`, `Q=(-2,4)` の○/●が、次の「-2はどちらに入るか」を先に答えた。
- 110: `q⇒p`, `¬q⇒¬p`, `¬p⇒¬q` を途中図へ出すと、form blank を解く前に答えが見える。

原則:

```
figure state
→ 今のthinking nodeに必要な情報だけ
→ learnerが判断
→ その結果を使う次のfigure state
```

図を置く前に必ず聞く:
1. この図は問題文の情報だけを可視化しているか
2. それとも次のblankの答えを視覚的に確定していないか
3. ○/●、角印、辺印、矢印、数値まで含めて確認したか

「文字で答えを書いていないから安全」は禁止。

---

# 34. 数学図は semantic correctness まで監査する

図は decorative illustration ではない。

必須確認:
- 有界 / 無界
- 開区間 / 閉区間
- 数直線がどちらへ続くか
- 辺・角・頂点の対応
- 変数が何を表すか
- 現在の推論段階で見せてよい情報か

実例:
- `(-∞,1)` を有限線分のように描かない。
- 実数全体の数直線を片側矢印だけにしない。

semantic bug は見た目の微調整ではなく、教材内容のbugとして扱う。

---

# 35. CI待ち時間を空費しない

user-approved workflow rule:

長いCI / Pages / browser smoke の待ち時間は、ただstatusをpollし続けない。

独立して進められる作業を並行する:
- 次の問題群の静的監査
- answer leakage review
- figure timing review
- presentation label review
- E2E coverage gap review
- docs / worklog 更新
- source / implementation diff確認

ただし:
- 同じfile / 同じbranchを複数chatで同時編集しない
- mainが別chatで進んだら、merge前に必ずHEADを再確認する
- 重複修正を見つけたら既存mainを優先し、自分のPRを最小差分へ縮める

今回の実例:
- PR #45 が同系統の99/101/110修正を先にmainへ入れたため、
- 後続PRは重複を捨て、
- 99-(4) timing だけの2-file minimal PR #47へ縮小した。

高効率とは「同時にたくさん触る」ことではない。
**待ち時間に独立作業を進め、merge時は差分を最小化すること。**

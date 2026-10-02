# CHATGPT README FIRST — 物理教科書モード 第1章

対象: `rrikunagasige-dot/kyotsu-step-web`  
基準 branch / current implementation authority: `main`

このファイルは、物理教科書モード第1章の作業入口。
大きな作業の前に必ず次を読む:

1. `docs/MASTER_APP_LESSONS.md`
2. `docs/REPO_CLEANUP_POLICY.md`
3. このファイル
4. `docs/physics-ch01/MASTER_FIRE_DIAGRAM.md`

古い `chatgpt/*` / `backup/*` branch はcurrent authorityとして使わない。

## 目的

第1章「物体の運動」を 1A〜1G の7単元として安全に導入する。既存の教科書モードの状態機械は維持し、次だけを一般化する。

1. 章 → 単元の階層
2. 単元ごとの本文構造差を吸収する semantic section
3. 図中ラベルを隠して答えさせる Figure V2
4. 自動生成ではなく明示的な選択肢
5. 1単元1ファイルへのデータ分割
6. 原教科書・旧母版・新figureの出典追跡
7. worked-example を題庫 Question へ安全に再利用する共通 adapter
8. 問題 → 学習設定 → 問題を解く → 科目 → 分野 → 問題 の導線

## Authority order

内容が衝突した場合は次の順で確認する。

```text
原教科書 PDF p.12–27
        ↓ 内容・物理事実
旧 1A 母版 + 1B〜1G Word
        ↓ 教育的な穴埋め構成
figure.zip / latest supplied `figure(1).zip`
        ↓ 第1章のcanonical図版
現在の GitHub 実装
        ↓ 実行可能な状態機械・UI制約
```

Word は原文そのものではなく学習用再構成案として扱う。段落番号や Word の見た目をそのまま Schema に固定しない。

## 第1章

| code | title | source pages | figures |
|---|---|---:|---|
| 1A | 変位と速度 | 12–13 | 1–4 |
| 1B | 速度の合成と分解 | 14–15 | 5–6 |
| 1C | 相対速度 | 16–17 | 7–8 |
| 1D | 加速度 | 18–19 | 9–10 |
| 1E | 水平投射 | 20–21 | 11–12 |
| 1F | 斜方投射 | 22–24 | 13–14 |
| 1G | 重力加速度・空気抵抗・終端速度 | 25–27 | 15–17 |

## 教育フローに関する現行原則

旧V2では次の流れを事実上の共通templateとして使っていた。

```text
概念を読む
→ 重要判断を答える
→ 図・式と対応づける
→ 例題で使う
→ 単元全体を再接続する
```

**この順序は P33 以降では固定教育フローとして扱わない。SUPERSEDED / LEGACY である。**
schema上の `concept / figure-reading / worked-example / review` role は既存データ互換のmetadataとして残り得るが、学習順序を決めるtemplateではない。

現行原則:

- 物理概念ごとに最適な representation path を決める。
- `P/V/Q/R/M/G/T`（Phenomenon / Visual / Quantity / Relation / Math / Graph / Transfer）を必要に応じて往復する。
- 「文章→図→式」など一つの順番を全概念へ強制しない。
- 図・文章・式・グラフは、概念形成に必要なら同じlearning step内で統合する。
- 各questionは one-step learnability を満たし、直前までの知識から根拠を持って答えられるようにする。
- 公式は「存在する式を穴埋めする」だけでなく、必要な公式が揃っているか、いつ導入すべきかまで監査する。
- scaffold は後半ほど弱め、最終的に選択肢なしでも意味を再構成できることを目標にする。
- P33〜P38では教育設計を先に確定し、P39まではコードを変更しない。

固定しないもの: representation順序、知識点数、例題数、図数、段落数、式数、section数。

## 変更ルール

1. stable ID を安易に変更しない。
2. 図に答えが見えている場合は Figure V2 overlay で隠す。
3. 第1章V2の公開 item は意味のある選択肢を明示的に持つ。
4. 誤答候補は典型的な物理的誤解から作る。
5. 1AをSchema 1.1へ移行し通しテストした後に1B〜1Gへ広げる。
6. schema/state/routing/figure rendererを変更したら火柴図も同じ作業で更新する。
7. PASSは実際にテストした場合だけ記録する。
8. upstream `paulfields83/kyotsu-step-web` の `main` を勝手に上書きしない。
9. 題庫化は worked-example 単位で行い、教科書の micro blank 数を「問題数」と数えない。
10. 第1章の題庫 primary taxonomy は `mechanics / motion`。1Gの重力・空気抵抗は secondary knowledge として扱う。
11. 題庫importは手書き14問コピーではなく `textbookPracticeQuestions.ts` の adapter を正とする。
12. PASSは unit / typecheck / lint / build / full Playwright が実際に通った場合だけ記録する。
13. 誤答は完了扱いにしない。正答した時点で初めて textbook item を resolved とする。
14. formula hole は LaTeX を断片compileせず、式全体を1本のLaTeXとして構築してからKaTeXへ渡す。
15. 読解では一度開いた前sectionの本文・図を消さない。次sectionは下へ追加する。
16. learner-facing UI に `A-15` / `D-1` 等の内部micro labelを出さない。
17. WebP source asset は RIFF宣言サイズと実バイト長の一致をCIで検証する。

## 実行順

```text
P00 source packet + control docs
P01 Textbook Schema 1.1
P02 chapter/unit metadata + navigation
P03 Figure V2 renderer
P04 textbook data split
P05 1A migrate
P06 1A regression/browser audit
P07 1B
P08 1C
P09 1D
P10 1E
P11 1F
P12 1G
P13 Chapter 1 full gate
P14 docs/worklog update
P15 setup-first navigation
P16 textbook worked-example → Question adapter
P17 Chapter 1 question-bank publish + dedup audit
P18 full browser/regression gate
P19 docs/fire/worklog/checkpoint update
P20 full textbook catalog (5 parts / 15 chapters)
P21 catalog-driven textbook setup + pending chapters
P22 hide internal unit codes from learner UI
P23 direct-open textbook unit cards
P24 1A browser audit after direct navigation
P25 full catalog/regression gate + docs finalization
P26 textbook answer-state / progress repair
P27 complete-formula interactive KaTeX renderer
P28 continuous reading-section stack
P29 restore corrupted Chapter-1 figures from canonical PNGs
P30 reader regression / asset-integrity full gate
P31 docs / source manifest / checkpoint finalization
P32 persistent source archive index
P33 ideal physics-learning representation map + formula coverage [OPEN]
P34 current-app contradiction audit against P33 map [OPEN]
P35 pedagogy rules: one-step learnability / question purpose / scaffold fading / retry hints [OPEN]
P36 representation integration: text↔figure↔formula↔graph + leakage/mask gates [OPEN]
P37 1A redesign on paper/data only [OPEN]
P38 virtual beginner simulation + developer audit-mode specification [OPEN]
P39 implementation only after P33-P38 + USER REVIEW approval [OPEN]
```

## 現在の状態

```text
P00 DONE
P01 PASS
P02 PASS
P03 PASS
P04 PASS
P05 PASS
P06 PASS
P07 PASS
P08 PASS
P09 PASS
P10 PASS
P11 PASS
P12 PASS
P13 PASS
P14 PASS
P15 PASS
P16 PASS
P17 PASS
P18 PASS
P19 PASS
P20 PASS
P21 PASS
P22 PASS
P23 PASS
P24 PASS
P25 PASS
P26 PASS
P27 PASS
P28 PASS
P29 PASS
P30 PASS
P31 PASS
P32 PASS
```

最新の総合gate: GitHub Actions `36455569868` — typecheck / lint / Vitest 19 files・58 tests / production build / Playwright 46 tests すべて PASS。検証対象HEADは `a68f03ebf9f076343f9ed4a903c597f182028eb9`。

P05で1Aを母版2.0として schemaVersion 1.1 へ移行した。78個のstable item IDを維持し、全itemに明示的な誤答候補を与え、 supplied Chapter-1 figures 1〜4 を app asset 化し、Figure V2 maskを実データへ接続した。

P06では当時の実ブラウザ仕様を確認したが、当時の「誤答をresolved扱い＋正解即表示」はP26でSUPERSEDED。現在は誤答では進捗せず、簡潔なretry表示のみとする。

P07で1B「速度の合成と分解」を追加した。原教科書 p.14–15 と supplied Word を照合し、figure 5–6 を実asset化、18個の確認itemをSchema 1.1へ投入し、chapter内順序を 1A→1B とした。

P08で1C「相対速度」を追加した。原教科書 p.16–17 と supplied Word を照合し、figure 7–8 を実asset化、17個の確認itemをSchema 1.1へ投入し、chapter内順序を 1A→1B→1C とした。

figure 7 は A を観測者とする相対速度の hotspot を持ち、figure 8 は自転車から見た雨のベクトル差を実図で確認する。

P09で1D「加速度」を追加した。原教科書 p.18–19 と supplied Word を照合し、figure 9–10 を実asset化、17個の確認itemをSchema 1.1へ投入した。

P10で1E「水平投射」を追加した。原教科書 p.20–21 と supplied Word を照合し、figure 11–12 を実asset化、16個の確認itemをSchema 1.1へ投入した。

P11で1F「斜方投射」を追加した。原教科書 p.22–24 と supplied Word を照合し、figure 13–14 を実asset化、19個の確認itemをSchema 1.1へ投入した。

P12で1G「重力加速度・空気抵抗・終端速度」を追加した。原教科書 p.25–27、supplied Word、figure 15–17 を照合し、3図を実asset化、14個の確認itemをSchema 1.1へ投入した。図15〜17は同一reading subgroupで保持し、1Gは14項目すべてをUI経由でstart→finish完走するE2EまでPASSした。

P13ではChapter 1 full gate（G11〜G17）を完走した。1A〜1G順序、chapter progress、17図、stable ID uniqueness、`pnpm check`、Playwright、`pnpm check:all` をすべてPASSした。

P14で教科書モード第1章V2を閉じた。

P15では導線を「問題 → 学習設定 → 問題を解く → 科目 → 分野 → 問題」に修正し、物理23分類を ProblemsPage から LearningSetupPage の物理practice内へ移した。

P16では 1A〜1G の `role=worked-example` だけを抽出する共通 adapter `src/data/textbookPracticeQuestions.ts` を追加した。2例題×7単元=14問を Question schema 1.0 へ変換し、stable ID・学習blank・simulation採点構造を生成する。日本語版は元readingFlowを活用し、中国語版は同一 grading identity を維持した中国語ガイドを生成する。

P17では既存 `physics-motion-01` を重複ではない独立v–tグラフ問題として保持し、第1章14問を追加した。公開後の物理題庫は17問、うち primary=`motion` は15問、`current` 1問、`magnetic-field` 1問。第1章14問はすべて primary=`mechanics / motion`。

P18では setup-first の実ブラウザ導線、23カード、運動15問、1G import問題の開始までをE2Eで検証し、全回帰gateを通過した。

P19でREADME・火柴図・WORKLOG・taxonomy guide・phase-14 checkpointを更新した。


## P20〜P25 教科書全体catalog補修

教科書モード第1章の中身は保持したまま、外側の教科書navigationを補修した。

- 物理教科書の5部・15章を `src/data/textbook/chapterCatalog.ts` のauthorityとして登録。
- published unitから章を逆算する方式をやめ、catalogをUIの正とする。
- 未実装章は消さず「準備中」として表示。
- 第1章のみ現在の7単元を表示。
- `1A〜1G` はstable metadataとして保持するが、学習者UIには表示しない。
- 単元カードは選択用radioではなく、教材本文へ直接遷移するlinkとする。
- textbook modeでは旧「教科書モードを始める」ボタンを廃止。
- 1A direct-open後の本文、inline blank、図、進捗、既存Figure V2回帰をPlaywrightで確認。

全15章:
- 第1部 様々な運動: 物体の運動 / 剛体のつり合い / 運動量と力積 / 円運動と単振動 / 万有引力
- 第2部 熱: 気体分子の運動
- 第3部 波: 波の性質 / 音 / 光
- 第4部 電気と磁気: 電界と電位 / 電流 / 電流と磁界 / 電磁誘導と電磁波
- 第5部 原子・分子の世界: 電子と光 / 原子・原子核・素粒子

P20〜P25は GitHub Actions run `36440820115` で full gate PASS。


## P26〜P31 教科書reader根本修復

公開版の実目視から、CIが見逃していた複数のreader欠陥をまとめて修復した。

### P26 — answer state / progress

旧実装は誤答でも `resolved: true` を保存していたため、誤答が進捗に加算され、再回答もできなかった。

現在:
- 誤答 → `resolved: false`
- 誤答後は4択を閉じ、文章中には「もう一度」だけ表示
- 正解を即revealingしない
- 正答retry後に初めてresolved
- legacy progressは、`isFirstCorrect=true` の既存正常recordを保持し、resolved-wrong recordだけ拒否

### P27 — formula renderer

LaTeX断片の途中にchoice holeを挟んで個別compileする方式を廃止した。
`src/domain/textbookFormula.ts` で式全体を1つのLaTeXへ組み立て、`TextbookFormula.tsx` で一括KaTeX renderする。

これにより `\\frac{...}{...}` / `\\sqrt{...}` をholeが横断しても崩れない。
第1章の全formulaを未回答状態・全正答状態の両方でcompileするunit gateを追加した。

### P28 — continuous reading

1 sectionだけを差し替える方式を廃止。
一度開いたsectionはDOM上に残し、次sectionを下へ追加する。

- 前の文章が消えない
- 前の図が消えない
- auto-jumpを廃止
- 「次へ」は明示操作
- persisted progressから開始時のみ最初の未完了sectionまで開く

### P29 — source figure repair

canonical `figure(1).zip` の正常PNGから、破損していた7 WebPを再生成して置換:

- figure 2 — average-instantaneous-velocity
- figure 3 — curve-velocity-directions
- figure 5 — velocity-composition
- figure 11 — horizontal-projectile-strobe
- figure 12 — horizontal-projectile-velocity
- figure 13 — oblique-projectile-trajectory
- figure 14 — oblique-projectile-components

図2は再生成後に直接目視し、日本語文字・曲線・矢印が正常であることを確認した。

### P30 — regression gates

新規gate:
- wrong answer does not advance progress
- correct retry resolves
- all Chapter-1 formulas compile unresolved/resolved
- visible raw TeX does not leak
- internal micro labels do not leak
- completed prior sections remain visible
- figure masks reveal only after correct answer
- all 17 WebPs have complete RIFF payloads
- overlay-bound tests are scroll-independent

P26〜P30 final gate: GitHub Actions `36455569868` SUCCESS。


## P32 source archive persistence

Canonical source ZIPs are now persisted in ChatGPT Library and indexed from GitHub.

Before asking the user to re-upload or searching Desktop:
1. read `docs/source_archives/README.md`,
2. read `docs/physics-ch01/SOURCE_MANIFEST.md`,
3. search Library path `/塾/kyotsu-step-web/source_archives`,
4. verify exact byte size + SHA256 + ZIP integrity.

Canonical identities:
- `figure.zip`: 12,078,342 bytes, SHA256 `b1d55eb94c13aa8ec91dbfd794dcbcbcec9c5a67ed8bdd692c397ad78d8b01e2`
- `物理教科書モード_第1-5章_母版準拠_完全版.zip`: 50,419,544 bytes, SHA256 `df1194b491d362c569018da15bc31e3583926a863af1f74b4842b033240e8eff`

Do not claim these ZIP binaries are committed to GitHub: the current GitHub connector cannot safely upload 12/50 MB local binary archives. GitHub stores the authoritative index and identity bridge; the actual ZIP bytes are persistent in Library.


# 次chat必読 — 物理学習設計の再構築 handoff（P33以降 OPEN）

この節は **bug修正ではなく、教科書モードの教育設計を再構築するための引き継ぎ** である。

P26〜P32まででreaderの技術的bugは修復したが、現在の第1章には教育設計上の矛盾が残っている。  
次chatでは **いきなりコードを書かない**。まず P33〜P38 の設計監査を行い、1A〜1G全体の矛盾を洗い出してから実装へ進む。

## 1. 想定する学習者モデル

今後の教科書モードは、次の仮想学習者を基準に設計・監査する。

- 日本の高校生だが、高校物理はまだほぼ知らない。
- 出発点は中学校理科・中学校数学レベル。
- 偏差値は高すぎない。初見の専門語・数式を自力で補完できる前提を置かない。
- ただし「知らないから答えられない」で終わらせない。
- **選択肢を使いながら、前の一歩で得た知識から次の概念を作っていく**ことを狙う。
- 穴埋めは確認テストではなく、scaffold / learning step として使う。
- 最終的には選択肢なしでも概念の意味をある程度再構成できる状態を目標とする。

重要な設計原則:

> 学習者が Q_n を答える時、必要な知識は Q_1〜Q_{n-1} までの学習で既に獲得できていなければならない。

これを仮に **one-step learnability** と呼ぶ。

初見概念を何の足場もなく4択で当てさせるだけならFAIL。  
前の図・文章・選択結果から合理的に次を選べるならPASS。

## 2. 物理学習を抽象化する表現モデル

物理は「文章→公式→問題」の一方向ではない。  
概念ごとに、現象・図・物理量・関係・数式・グラフを行き来する。

今後は各概念について次の表現を必要に応じて組み合わせる。

```text
P = Phenomenon
    何が起きているか

V = Visual
    図・写真・軌跡・矢印としてどう見えるか

Q = Quantity
    何という物理量で表すか

R = Relation
    物理量同士がどう関係するか

M = Math
    数式でどう圧縮して表すか

G = Graph
    時間変化・関数関係をどう読むか

T = Transfer
    別の状況へ同じ考えを使えるか
```

全概念を同じ順序に押し込まない。

例:

```text
位置ベクトル
P → V → Q → M → T

変位
V → Q → R → M → T

加速度
P → Q → G → R → M → T

斜方投射
P → V → Q → M
        ↓
       vx, vy
        ↓
        M → T

終端速度
P → V(force) → R → M → G → T
```

## 3. 現在のappとの主要矛盾

### contradiction A — 全単元を同じsection templateへ押し込んでいる

現在1A〜1Gはすべて、

```text
concept
→ figure-reading
→ worked-example
→ worked-example
→ review
```

の5section構造。

これは実装・量産には便利だが、物理概念の学び方とは一致しない。

- ベクトルは図と文章を同時に扱う方が自然。
- 加速度は数値変化・v-tグラフ・式の連携が重要。
- 投射運動は軌跡図と成分分解を同時に扱う必要がある。
- 終端速度は力の関係とv-tグラフを往復する必要がある。

**representation type を section type と同一視しないこと。**

### contradiction B — 「知識点チェック」と「図の読み取り」が分離しすぎている

現在は概念を文章で学んだ後、別sectionで図を見る構造が多い。

しかし、位置・ベクトル・変位・速度成分などは、

```text
文章
→ 図
→ 選択
→ 新しい意味
→ 式
→ 再び図
```

を一続きにした方が自然。

今後は原則として **図を文章の一部として扱う**。

独立した「図の読み取り」sectionを機械的に置かない。

### contradiction C — 図を置くことと、図で学ばせることを混同している

図には最低3種類ある。

1. **concept-forming figure**  
   図そのものから新概念を作る。  
   例: 位置ベクトル、変位、速度の合成。

2. **inference figure**  
   図・グラフを証拠として判断する。  
   例: v-tグラフから加速度を読む。

3. **explanatory figure**  
   理解補助として見るだけ。  
   無理にmaskや問題を付ける必要はない。

「図がある → maskを置く → figure-reading questionを作る」という機械的設計は禁止。

### contradiction D — mask と文章中questionの意味的接続が弱い

現在、maskを置いても「なぜそこを隠したか」が学習者に明確でない箇所がある。

新原則:

> mask は、それと1対1に対応する文章中の判断・選択問題がある場合にだけ使う。

例:

```text
[図14: v_y = 0 の 0 をmask]

最高点では鉛直速度成分 v_y は【選択】である。
  0 / v0 sinθ / v0 cosθ / gt

正答
↓
文章が完成
↓
図のmaskも同時に解除
```

mask単体で存在させない。

### contradiction E — 「完全に隠す」の定義がまだ曖昧

今後のmask completeness定義:

1. 答えとなる文字・数式・記号を全部覆う。
2. glyphの一部、添字、符号、矢印先端などを覗かせない。
3. mask周囲にpaddingを持たせる。
4. title / heading / note / caption / alt / surrounding prose からも答えを漏らさない。
5. desktop / mobile 両方でtargetを完全に覆う。
6. 正答するまで解除しない。
7. mask対象とquestionを1対1で追跡できる。

### contradiction F — title / heading / note / caption が答えを先に言うことがある

既知の例:

斜方投射で、

```text
最高点では鉛直成分だけが0になる
```

と先に書いた後、

```text
最高点で v_y はいくらか？
```

と問うような構造はFAIL。

見出しも、

```text
STEP 1 最高点では v_y = 0
```

ではなく、

```text
STEP 1 最高点の条件を考える
```

にする。

回答前に見える範囲を **pre-answer context** と呼び、以下を全部監査する:

- section title
- heading
- description
- note
- paragraph
- formula
- figure label
- caption
- alt text
- previous answer reveal

pre-answer context 内に正答そのもの・同義表現・一意に正答を確定する強すぎるヒントがあればFAIL。

### contradiction G — 数式の役割を区別していない

第1章にはformula blockが多数あるが、数が多いこと自体が問題ではない。

今後は各式を最低でも次に分類する:

1. concept-forming formula  
   概念を作るための式。

2. representation formula  
   既に理解した概念を記号化する式。

3. calculation formula  
   数値計算のための式。

4. verification formula  
   結果確認の式。

例:

```text
r1 + Δr = r2
```

は単なる計算式ではなく、変位を理解する concept-forming formula として使える。

だから「概念説明が全部終わってから公式を置く」と固定しない。

### contradiction H — 表現間の対応を学習者に任せすぎている

図の `Δr`、文章の「変位」、式の `Δr` を別々に見せるだけでは足りない。

今後は必要に応じて、

```text
図中の Δr
   ↕
文章の「変位」
   ↕
式中の Δr
```

を同時に強調・revealingする。

一つの選択で複数表現がつながるUIを検討する。

### contradiction I — 穴が「知識生成」より「クリック作業」になりうる

現在はmicro itemが多く、穴密度が高い。

穴を増やすこと自体を目的にしない。

各穴は次のどれかに該当する必要がある:

- 新概念を作る重要判断
- 図から読む重要情報
- 物理量同士の重要関係
- 式を構成する重要ステップ
- 例題の重要な方針判断
- 少し後で再利用するretrieval

接続詞、明らかな語句、単なる作業確認まで穴にしない。

### contradiction J — scaffolding fading が弱い

同じ概念に対して最後まで同じ強さの4択を出し続けると、選択肢依存になる。

理想:

```text
初回
図＋強い4択＋誘導
↓
2回目
弱い4択
↓
3回目
式中の小さな穴
↓
例題
重要判断だけ
↓
最後
最小限の支援 / 自力再構成
```

「知らない学生が選択しながら学ぶ」思想は維持するが、最後まで同じscaffoldにはしない。

### contradiction K — 誤答retryが単なる総当たりになる可能性

P26で「誤答→正解即表示」は廃止したが、4択を何回も押せば最終的に当たる問題は残る。

将来検討:

```text
1回目誤答
→ 正解非表示
→ 1行ヒント

2回目誤答
→ より具体的なヒント
→ 関連図や直前説明を強調

その後
→ 必要ならscaffoldを追加
```

正解をすぐ見せるのではなく、次の推論材料を与える。

### contradiction L — 学習者向けmodeと開発監査modeが分離されていない

教材を直すたびに179個のitemを人間が順番に答えて確認するのは非現実的。

P33以降で **audit mode** を設計する。

audit mode候補:

- progressを保存しない
- 全sectionを最初から展開
- 任意sectionへ即jump
- unanswered / wrong / resolved を切替
- mask ON / OFF
- all answers reveal
- figure-only / formula-only inspection
- mobile / desktop visual audit
- leakage inspection

これは学生向け機能ではなく教材開発用。

## 4. 重要: 「知らない」ことはFAILではない

次chatで絶対に取り違えないこと。

このappは、

```text
先に全部説明
→ 理解確認問題
```

だけを目指していない。

むしろ、

```text
知らない
↓
図・状況を見る
↓
簡単な判断を選ぶ
↓
その結果から新しい意味を知る
↓
同じ概念をもう一度使う
↓
式・グラフへ接続
↓
別の状況で再利用
```

を中心にする。

選択肢は **assessment only** ではなく **instructional scaffold**。

したがって、

> 「中学生にはこの用語を知らないから問題を出せない」

とは判断しない。

正しくは、

> 「知らなくても、直前の情報から意味を構築して選べるか？」

で評価する。

## 5. 1Aの理想例

位置ベクトル・変位では、知識点チェックと図の読み取りを分けない。

例:

```text
物体が点P1にある。

[図: O→P1 の矢印]

OからP1へ向かうこの矢印は、物体の何を表している？
【位置 / 速さ / 時間 / 力】

正答
↓
「位置」を表す矢印であることを文章化
↓
高校物理ではこれを「位置ベクトル」と呼ぶ

[同じ図]
O→P1 = r1
O→P2 = r2
P1→P2 = mask

最初の位置を表すのは【r1 / r2 / Δr / v】
↓
後の位置を表すのは【...】
↓
P1からP2への変化を表す矢印は【...】

正答
↓
これを「変位 Δr」と呼ぶ

さらに図を使って

r1 + 【選択】 = r2

を完成

↓

Δr = r2 - r1
```

このように **図→選択→名称→式** が一つの概念ストーリーになる。

## 6. 第1章のrepresentation mapを次chatで最初に作る

次chatでまず1A〜1Gについて、各概念を次の形式で全部mappingする。

```text
concept
├─ prerequisite knowledge
├─ best primary representation
│    phenomenon / visual / quantity / relation / math / graph
├─ first learnable question
├─ knowledge gained by that question
├─ next question dependency
├─ figure needed?
├─ required formula set
│    ├─ formula itself
│    ├─ role = concept-forming / representation / calculation / verification
│    ├─ introduction timing
│    ├─ prerequisite for introducing it
│    └─ link to figure / text / graph / quantity
├─ graph needed?
├─ representation links that must be explicit
├─ mask needed?
├─ answer leakage risk
├─ scaffold level
├─ scaffold fading plan
└─ transfer / review point
```

最低対象:

### 1A
- 位置
- 位置ベクトル
- 変位
- 平均速度
- 瞬間速度
- 速度の向き / 接線

### 1B
- 速度の合成
- ベクトル和
- 速度の分解
- x/y成分

### 1C
- 観測者
- 相対速度
- ベクトル差

### 1D
- 速度変化
- 加速度
- 符号
- v-tグラフ

### 1E
- 水平 / 鉛直の独立性
- 水平投射
- 時間
- 軌跡

### 1F
- 初速度の分解
- 最高点
- 上昇 / 下降
- 飛行時間
- 水平到達距離

### 1G
- 重力加速度
- 空気抵抗
- 速度依存
- 力のつり合い
- 終端速度
- v-tグラフ

## 7. P33開始点と P33〜P39 の一本化した作業順

P33は **現在のAppを直す作業ではない**。まずAppから独立して「初心者が物理をどう理解するのが自然か」という理想側のrepresentation mapを作る。

P33の最初の正式作業は:

```text
P33-A1  1A「位置 → 位置ベクトル → 変位」
        │
        ├─ 中学知識からのprerequisiteを確定
        ├─ 最初に見せる現象/図を決める
        ├─ first learnable questionを作る
        ├─ 正答で得る新知識を定義
        ├─ 次questionへのdependencyを定義
        ├─ 必要な図・式・graphを列挙
        ├─ Formula Coverageを確定
        └─ 図↔言葉↔式の明示的対応を設計
```

P33では「今のAppにその図・式があるか」は判定しない。必要なら `required = YES` と記録するだけで、現在実装との不足比較はP34で行う。

```text
P33 IDEAL REPRESENTATION MAP
  1A: 位置→位置ベクトル→変位→平均速度→瞬間速度→接線方向
  1B〜1G: 同じformatで理想mapを完成
  + Formula Coverage
  ↓
P34 CURRENT-APP CONTRADICTION AUDIT
  ideal map vs current 1A〜1G
  missing / wrong / wrong timing / split-attention / leakage
  ↓
P35 PEDAGOGY RULES
  one-step learnability
  knowledge generation
  question purpose
  scaffold fading
  wrong-answer hint progression
  transfer / retrieval
  ↓
P36 REPRESENTATION INTEGRATION
  text ↔ figure ↔ formula ↔ graph
  synchronized reveal
  figure type
  mask necessity / completeness
  pre-answer leakage
  ↓
P37 1A REDESIGN — PAPER/DATA ONLY
  ↓
P38 VIRTUAL BEGINNER SIMULATION + AUDIT MODE SPEC
  中学知識のみで最初から最後まで辿れるか
  ↓
USER REVIEW
  ↓
P39 CODE IMPLEMENTATION
```

**P39まではコードを書かない。P33の理想mapを現在のschema/UI制約へ合わせて弱めない。**

まず1Aを完成テンプレートにしてから1B〜1Gへ展開する。

## 8. 次chatでの最重要質問

次のAIは以下を一問ずつ検証すること。

1. この瞬間の生徒は何を知っている？
2. この選択肢を選ぶ根拠は既に画面内にある？
3. 正解すると何という新しい知識を得る？
4. その新知識は次のquestionで使われる？
5. 図・文章・式・グラフのどれがこの概念の主役？
6. 別表現との対応をappが明示している？
7. title / heading / note / caption / alt が答えを漏らしていない？
8. maskは本当に必要？
9. maskは答えを完全に隠している？
10. 穴を消しても学習ストーリーは自然に読める？
11. 後半ではscaffoldが減っている？
12. 最後に学生は選択肢なしでも意味を説明できそう？

## 9. 現時点の結論

現在のappは、

- source material
- figure assets
- formula support
- interactive holes
- reader infrastructure

はかなり揃っている。

次のボトルネックは **素材量ではなく教育設計**。

特に、

```text
固定section template
知識と図の分離
図とquestionの弱い接続
answer leakage
mask定義不足
formula roleの未分類
representation間の接続不足
穴密度
scaffold fading不足
開発audit mode不足
```

が主要OPEN課題。

これらを解かずに第2章以降を量産しないこと。

## 10. USER-APPROVED learning-text writing rule — 2026-09-29

Chapter 1 の再構成Wordをユーザー確認し、**文章らしさと現在の穴密度は適切**と評価された。
今後の物理・教科書モード本文は、詳細版
docs/physics-ch01/LEARNING_TEXT_WRITING_RULES.md
を必ず先に読むこと。

最重要ルール:

    まず穴なしでも成立する自然な教材本文を書く
            ↓
    現象・図・既知事項から意味を作る
            ↓
    本文中の重要な語句・関係・式そのものを穴にする
            ↓
    その穴を埋める行為そのものが問いになる
            ↓
    正解すると元の自然な文章が完成する
            ↓
    完成した文章をそのまま読み続ける

したがって、教材を「説明 → 別枠問題 → 説明 → 別枠問題」の断片へ戻してはいけない。

### accepted hole density

今回のChapter 1 prototypeの穴密度を今後のdefault baselineとする。

穴にしてよい中心対象:

- 図・現象から意味を読む重要判断
- 物理量どうしの重要関係
- 図 / 言葉 / 式のrepresentation変換
- 解法の方針判断
- 意味のある式構成・式変形
- 少し後での重要retrieval / transfer

原則として穴にしない:

- 接続詞
- 既に十分確認した同一知識の機械的反復
- 単純算術だけの細切れ
- 未習用語を根拠なく当てる問題
- 「問題数を増やすため」の穴

### unknown-term rule

    意味を先に作る
    ↓
    名称を普通に教える
    ↓
    後の文章・式・別状況で名称を再利用させる

未習の専門用語を初出時に4択で当てさせない。

### writing rhythm

教材本文は原則として、

    前に分かったこと
    ↓
    まだ分からないこと / 新しい必要性
    ↓
    だから今これを考える
    ↓
    現象・図を見る
    ↓
    意味を読む
    ↓
    必要なら名称を与える
    ↓
    式で表す
    ↓
    式の意味を文章へ戻す
    ↓
    少し違う状況で再利用する
    ↓
    次の疑問へつなぐ

という人間の授業に近い呼吸で書く。

Chapter 1 accepted prose baseline:
- 1A〜1G
- 17 canonical figures
- initial approved prose prototype: 53 holes
- current P33-passed v2.1: 54 justified holes
- choices are placed after the corresponding prose
- answer key is collected at the end
- generated Word was visually rendered and reviewed

Generator source is kept in:
scripts/physics-textbook/build_ch1_learning_docx.py

**この承認済み文章prototypeを壊して旧section templateへ戻さないこと。**

## 11. PREVIOUS Chapter-1 checkpoint — formula derivation strengthened v2

The earlier 53-hole prototype established the natural-prose / moderate-hole-density baseline.
After mobile-first review, formula derivations were strengthened without reverting to a high-hole-density worksheet.

**Current content checkpoint:**

- source: `docs/physics-ch01/prototypes/CH1_LEARNING_TEXT_V2.md`
- detailed formula rule: `docs/physics-ch01/FORMULA_DERIVATION_RULES.md`
- generator: `scripts/physics-textbook/build_ch1_learning_docx.py`
- 1A–1G
- 17 canonical figures
- 55 unique inline holes
- user-reviewed Word persisted in Library; exact identity is recorded in `docs/physics-ch01/prototypes/README.md`

New hard rule:

> **The learner may be using only a phone. Do not assume paper, pen, or silent reconstruction of multiple missing derivation steps.**

For a nontrivial formula, normally show:

    physical need
    → parent equation
    → physical condition / substitution
    → substitution
    → readable intermediate algebra
    → final formula
    → physical meaning in prose

The goal is **more visible derivation, not more holes**.

Hole reasons are now explicitly classified:

- H1 meaning judgment
- H2 relation judgment
- H3 representation conversion
- H4 strategy / next-step judgment
- H5 physical boundary / condition judgment
- H6 meaningful mathematical operation

If a designer cannot explain why a hole is needed in both educational and calculation terms, remove it.

This v2 checkpoint is now the concrete input for P33.
P33–P38 remain OPEN; do not change application code yet.

## 12. P33 prerequisite baseline clarification — 2026-09-29

P33では **「中学知識だけで完全に自力解決できるか」** を硬いgateにしない。

Learner assumption:
- 普通の中学レベルの知識は利用可能とみなす。
- スマートフォンがあり、一般数学用語・既習事項は必要なら検索・AI質問で補える。
- `sin/cos`、極限記号、基本的な三角恒等式などを「未習かもしれない」という理由だけで教材欠陥にしない。
- ただし、教材内部で初めて導入する**新しい物理概念・物理用語・重要な推論依存**は、外部検索に丸投げしてはいけない。

Therefore P33 prerequisite audit distinguishes:

    ordinary background / searchable math support
        → not a hard contradiction

    chapter-internal new physics meaning / dependency
        → must be taught or inferable in the learning text

External lookup is a convenience, not a substitute for the chapter's own conceptual chain.

## 13. CURRENT Chapter-1 checkpoint — v2.1 / P33 PASS

Current authoritative source:
`docs/physics-ch01/prototypes/CH1_LEARNING_TEXT_V2_1.md`

Current review artifact:
- 1A–1G
- 17 canonical figures
- 54 justified inline holes
- 26 rendered pages
- phone-only / no-paper derivation assumption
- exact DOCX identity in `docs/physics-ch01/prototypes/README.md`

Why 54 rather than 55:
the old C1 first-exposure `相対速度` vocabulary hole was pedagogically unjustified, so it was removed and not replaced merely to preserve a count.

P33 source repairs completed:
1. teach `相対速度` after constructing its meaning,
2. show `cosθ=vₓ/v`, `sinθ=vᵧ/v` before component-formula holes,
3. derive `vᵧ²=2gy`,
4. derive the oblique-projectile time-free vertical relation,
5. define the linear-drag model and `k>0`.

P33 gate status:
- G52 PASS
- G52a PASS
- G52b PASS
- G53 PASS
- G54 PASS
- G55 PASS

**Next authoritative node: P34 current-app contradiction audit.**
P34 is analysis first; do not change app code yet.

## 16. P37 PASS — 1A target paper/data design

Authoritative 1A redesign:
`docs/physics-ch01/P37_1A_REDESIGN.md`

The target learner path is now concrete:
- A1–A10 only,
- fig1 staged during position/displacement learning,
- fig4 at coordinate components,
- fig2 before A7 tangent inference,
- fig3 after A7 as confirmation,
- ten answer-dependent reveal boundaries,
- no old label-copy / numerator-denominator / arithmetic micro-item preservation,
- scaffold fades S1 → S2 → S3 → S4.

This is still paper/data design. No TypeScript has been changed.

G59 PASS / P37 PASS.

Next: **P38 virtual learner simulation + developer audit-mode specification.**
## 14. CURRENT WORK LINE — USER REVIEW before P39

Authoritative status after the 2026-09-29 pedagogy reconstruction:

- P33 PASS — ideal representation/dependency map and Formula Coverage
- P34 PASS — current-app contradiction audit
- P35 PASS — pedagogy rules
- P36 PASS — representation / mask / leakage specification
- P37 PASS — 1A paper/data redesign
- P38 PASS — virtual learner simulation + developer audit-mode specification
- **USER REVIEW — CURRENT STOP**
- P39 application-code implementation — **BLOCKED until explicit user approval**

Key current files:
- `docs/physics-ch01/prototypes/CH1_LEARNING_TEXT_V2_1.md` — current Chapter-1 learning text
- `docs/physics-ch01/P33_REPRESENTATION_DEPENDENCY_MAP.md`
- `docs/physics-ch01/P34_CURRENT_APP_CONTRADICTION_AUDIT.md`
- `docs/physics-ch01/P35_PEDAGOGY_RULES.md`
- `docs/physics-ch01/P36_REPRESENTATION_INTEGRATION_SPEC.md`
- `docs/physics-ch01/P37_1A_REDESIGN.md`
- `docs/physics-ch01/P38_VIRTUAL_LEARNER_AND_AUDIT_MODE.md`

P37 target for 1A:
- current app: 78 items
- redesigned target: 10 meaningful holes across 10 representation events
- figures/formulas integrated where concept formation needs them
- routine algebra remains visible
- no label-transcription drill

P38 result:
- A1–A10 virtual learner path: 10/10 PASS
- hidden physics-dependency audit: PASS
- wrong-answer support paths: PASS
- mobile/no-paper reading: PASS
- developer audit-mode spec: COMPLETE

Do not start coding from this README alone. The user must explicitly approve moving into P39 after reviewing the design.



### Final pre-review consistency note

Current app recount: 179 Chapter-1 item definitions = 78 + 18 + 17 + 17 + 16 + 19 + 14.
P37 authoritative file: `docs/physics-ch01/P37_1A_REDESIGN.md`.
The older `P37_1A_REDESIGN_DATA.md` is compatibility-only and must not be treated as a second authority.

## 15. USER REVIEW CORRECTION — formula holes were insufficient

The v2.1 content was **not approved for implementation** at USER REVIEW.

User feedback:
- prose quality remains acceptable,
- visible derivation remains necessary,
- but derivations must also contain interactive formula holes,
- final-form holes alone are insufficient.

New review candidate:
`docs/physics-ch01/prototypes/CH1_LEARNING_TEXT_V2_2_FORMULA_HOLES.md`

Candidate facts:
- 1A–1G
- 17 canonical figures
- 65 inline holes
- +11 new formula-derivation holes relative to v2.1
- 27 rendered pages
- formula-hole rule added to `FORMULA_DERIVATION_RULES.md`
- user review still pending

Added derivation holes:
`D4a, D7b, D7c, E3a, E5b, F3a, F5a, F6b, F8a, G3a, G6a`.

**P39 remains BLOCKED. Do not treat v2.1 USER REVIEW as approval.**

## 15. P39 APP PREVIEW — DEPLOYED / USER QA OPEN

The user explicitly approved moving from paper design into application installation so the learning experience can be judged in the real UI.

Current App content authority:
`docs/physics-ch01/prototypes/CH1_LEARNING_TEXT_V2_2_FORMULA_HOLES.md`

P39 preview implementation:
- v2.2 source is imported directly with Vite raw import,
- source is parsed into seven Chapter-1 textbook units,
- all 65 reviewed holes are preserved:
  - 1A 10
  - 1B 6
  - 1C 4
  - 1D 12
  - 1E 9
  - 1F 14
  - 1G 10
- all 17 canonical figures are preserved,
- each unit renders as one continuous lesson instead of the legacy five-section pedagogy,
- unresolved holes block later blocks inside the same subsection so completed formulas do not leak answers,
- continuous lessons hide legacy section navigation/header,
- fig-1 Δr label is passively masked until A3 resolves,
- neutral pre-answer figure captions/alts are generated to reduce leakage.

Implementation files:
- `src/data/textbook/ch01/v22Continuous.ts`
- `src/data/textbook/index.ts`
- `src/pages/TextbookUnitPage.tsx`
- `src/domain/textbookSchema.ts`
- `src/components/textbook/TextbookFigure.tsx`
- `src/data/textbookUnits.test.ts`

Deployment gate:
- GitHub Pages final validation run 100
- deployed code includes parser fix `e8b4af262913b082b01a6afe8697b8f75c39f8d5`
- typecheck PASS
- Chapter 1 v2.2 runtime data gate PASS
  - 7 units
  - 65 holes
  - 17 figures
  - explicit-choice / answer consistency
  - reading-flow reference completeness
  - passive A3 mask
- production build PASS
- Pages deploy PASS
- environment URL: `https://rrikunagasige-dot.github.io/kyotsu-step-web/`

**P39 is NOT PASS yet.**
Current state is:
`P39 IMPLEMENTATION PREVIEW DEPLOYED → USER APP QA OPEN`.

Do not optimize the UI from imagination now. Collect problems from actual phone/app use first, then patch them against the v2.2 source and pedagogy rules.

## 16. P39 BOOT FAILURE ROOT CAUSE + FIX — 2026-09-29

Observed real-browser symptom:
- GitHub Pages loaded HTML/CSS but React content was blank.

Root cause:
- Chapter 1 v2.2 uses one continuous `lesson` section per unit.
- legacy `textbookPracticeQuestions.ts` searched only `worked-example` sections.
- zero worked-example sections produced an empty generated question array.
- `validateQuestionCatalog([])` failed its min-length Zod gate during module import.
- the exception occurred before normal React rendering, causing the blank page.

Fix:
- continuous textbook units are allowed to produce zero auto-generated practice questions.
- standalone practice question bank remains available.
- bootstrap now shows visible diagnostics instead of a silent blank screen.
- Pages deploy gate now includes a real Playwright Chromium smoke test.

Verified browser path:
- open learning setup,
- open 1A,
- render A1 inline hole,
- open A1 choices,
- confirm "位置" choice visible.

Final validation:
- workflow run 110
- typecheck PASS
- Chapter-1 v2.2 data gate PASS
- Playwright browser smoke PASS
- production build PASS
- GitHub Pages deploy PASS

P39 remains USER QA OPEN for pedagogy/layout review; boot/runtime availability is now verified.

## 17. P39 AUDIT-DRIVEN REPAIR — DEPLOYED / USER RE-QA

After the first real App review exposed multiple issues, the implementation was frozen, audited end-to-end, and repaired as one batch.

Resolved source/data issues:
- explicit answer key: 65/65,
- correct-option distribution: A17 / B16 / C16 / D16,
- no parser fallback to "choice A" for missing answers,
- student prose no longer says "1Aでは" / "1Dで..." / "1Dの式",
- exact post-hole formula duplication removed,
- chapter summary is retained in the App flow,
- v-t graph restored for the 1D acceleration derivation.

Resolved representation/UI issues:
- prose-level symbols such as r-vector, v_x, v_y, Δr are parsed as inline KaTeX,
- formula choices are rendered as KaTeX,
- resolved formula holes return to normal completed math rather than boxed fragments,
- student prompt no longer exposes A1/D7b-style internal IDs,
- continuous lesson hides developer revision labels,
- no question-mark masks remain in the audited Chapter-1 lesson,
- concept-forming non-leaking guides are used before A1, A7, B2/B3,
- low-resolution 1C/1D/1G WebPs were replaced with vector SVG diagrams,
- figure width is capped to avoid raster upscaling,
- stale saved progress is ignored when textbook revision changes.

Live figure set:
- 17 canonical/semantic textbook figures,
- 4 additional non-leaking guides/graphs,
- total 21 figure assets in the live Chapter-1 flow.

Final automated validation:
- GitHub Pages workflow run 154,
- head commit `9bca1897d8866533ad5c398ab4ed3f69a4fc7d47`,
- typecheck PASS,
- audited data/math/asset/state gate: 32/32 tests PASS,
- Playwright Chromium:
  - learning setup PASS,
  - 1A–1G all boot to first meaningful hole PASS,
  - no student-facing version/internal hole ID leakage PASS,
  - A1 choice panel PASS,
  - concept-guide image sizing check PASS,
- production build PASS,
- GitHub Pages deploy PASS.

**P39 remains USER RE-QA OPEN.**
Automated implementation gates pass, but the user must review the actual learning experience again before P39 is closed.

## 18. P39 SECOND LIVE-APP AUDIT — R0–R9 COMPLETE / USER RE-QA

This section is the current authoritative P39 status and supersedes earlier numeric/status snapshots above while preserving them as history.

After the second real-App review, the repair sequence was frozen as R0–R9 and completed in order.

R0–R9 result:
- **R0 audit freeze**: all observed live-App defects were inventoried before further patching.
- **R1 green baseline**: stale tests were removed and main was restored to a reproducible green state.
- **R2 math representation**:
  - combined subscripts such as `v₀ₓ`, `v₀ᵧ`, `r⃗₁` are normalized by one tested math path,
  - formula holes are rendered as React math/choice parts instead of KaTeX HTML-extension commands,
  - inline/display/choice/resolved formula rendering is tested for parse safety.
- **R3 derivation model**:
  - 13 explicit derivation groups are encoded in source,
  - prose may sit inside the same derivation group,
  - multi-line derivations render as one continuous visual chain rather than stacked white formula cards.
- **R4 hole-quality rewrite**:
  - 59 audited interactions were classified as KEEP / REWRITE / REMOVE,
  - current live target is **45 reasoning interactions**,
  - per-unit counts: **9 / 3 / 4 / 8 / 6 / 8 / 7**,
  - routine final division, copy-back, trivial arithmetic, and redundant symmetric prompts were removed,
  - rewritten questions target parent relation, physical condition, elimination, factorization, representation, or causal reasoning.
- **R5 scaffold fading + hints**:
  - all 45 items have explicit `purpose`, `scaffoldLevel`, and two staged hints,
  - scaffold distribution: strong=6 / medium=16 / light=23,
  - visible choice count fades from 2 → 3 → 4 as support is reduced,
  - wrong answers remain unresolved and reveal staged hints rather than the correct answer.
- **R6 figure QA**:
  - low-resolution fig-6 (620×465) was replaced by a crisp SVG confirmation figure,
  - every remaining live WebP is gated at >=1000×700,
  - fig-5 and all live 1E/1F raster figures were manually inspected for readable lines and labels,
  - raster display remains capped to avoid upscaling.
- **R7 reveal policy**:
  - the current strict reveal is intentionally retained for this source because necessary context is placed before each question and post-question content frequently contains the answer,
  - do not loosen reveal globally unless a concrete item needs hidden explanatory context; leakage prevention remains the higher-priority gate.
- **R8 real-browser QA**:
  - Playwright now runs on **Pixel 7 mobile and 1440×1000 desktop Chromium**,
  - all Chapter-1 units boot to their first meaningful interaction,
  - 1F is solved through all eight interactions in-browser,
  - `v_0_x` / `v_0_y` raw-text leakage is forbidden,
  - `.katex-error` must remain zero,
  - the highest-point three-line derivation is verified inside one derivation chain with no per-line card border.
- **R9 Pages deployment**:
  - final workflow **run 213**,
  - head **`5e852790b563717c5e732d0ccdd8380cbd47ae34`**,
  - typecheck PASS,
  - Chapter-1 data/math/asset/pedagogy gates PASS,
  - mobile + desktop browser smoke PASS,
  - production build PASS,
  - GitHub Pages deploy PASS.

Current public implementation authority remains:
`docs/physics-ch01/prototypes/CH1_LEARNING_TEXT_V2_2_FORMULA_HOLES.md`
plus
`docs/physics-ch01/prototypes/CH1_INTERACTION_METADATA.tsv`.

**P39 / G61 is still not PASS.**
Current state:
`R0–R9 AUTOMATED + BROWSER GATES PASS → USER RE-QA OPEN`.

Do not begin Chapter 2 batch production or close P39 until the user has reviewed the deployed Chapter-1 learning experience again.

## 19. 2026-09-30 USER FIGURE CORRECTION — CURRENT FIGURE AUTHORITY

This section **supersedes the figure-specific parts of the earlier R6 notes**. The earlier record is kept only as history.

The user rejected newly drawn guide/confirmation/graph figures and required the live Chapter-1 lesson to return to the original Library figure set.

Current binding rules:
- Chapter 1 uses **exactly the 17 canonical figures** from the verified `figure.zip`.
- Live lesson may not add `generated-guide`, `generated-confirmation`, or `generated-graph` figures.
- The synthetic position guide, secant/tangent guide, velocity-component guide/confirmation, and extra generated v-t graph were removed from the live source.
- Figure 1–17 are the original Library/source-archive drawings, re-exported as high-resolution WebP without redrawing their contents.
- The canonical archive identity is SHA256 `b1d55eb94c13aa8ec91dbfd794dcbcbcec9c5a67ed8bdd692c397ad78d8b01e2`.
- Every live canonical WebP is gated at width >= 1000 and height >= 700.
- The source/test gate requires exactly `fig-1` through `fig-17`, forbids generated figure directives, and fails if prose first mentions `図N` before the corresponding figure directive exists.
- In particular, text such as “図6を見ると” must never appear before Figure 6 has actually been inserted into the reading flow.

Validation authority for this correction:
- GitHub Actions run **222**
- tested head `155a825f6058f06f42b9097e4e29092dad09818e`
- typecheck PASS
- Chapter-1 audited data/math/figure gate PASS
- mobile + desktop browser smoke PASS
- production build PASS
- GitHub Pages deploy PASS

**Do not restore the superseded synthetic SVG/graph policy in future repairs.**

P39/G61 remains open for user re-QA; this figure repair is not itself permission to close P39.



## 20. 2026-09-30 USER 1A DERIVATION CORRECTION — CURRENT INTERACTION AUTHORITY

This section supersedes only the current-count / 1A-average-velocity parts of the R3–R5 snapshot above. The original R4 audit remains historical evidence.

User review of the deployed first section established a more precise local rule:
- the worked-example calculation for average velocity is one continuous derivation and must render inside **one outer frame**,
- consecutive equations inside that derivation must not each receive a separate white formula-card border,
- the four calculation holes are intentionally placed at the computed displacement, computed elapsed time, substitution of the computed displacement into the numerator, and final average-velocity vector,
- these holes are explicit user-approved reinforcement of previously learned relations; they are not a new global policy to add arithmetic holes elsewhere,
- the stacked average-bar + vector-arrow rendering on velocity is replaced in learner UI by a single vector arrow with an `avg` subscript: `\\vec{v}_{\\mathrm{avg}}`,
- no other Chapter-1 derivation content was redesigned by this correction.

Current live counts after this local correction:
- total interactions: **47**,
- per internal unit: **11 / 3 / 4 / 8 / 6 / 8 / 7**,
- explicit derivation groups: **14**,
- scaffold distribution: **strong=6 / medium=18 / light=23**.

Regression authority:
- derivation id: `a-average-velocity-example`,
- browser gate asserts exactly one derivation container and zero borders on its individual formula lines,
- mobile + desktop browser progression through all 1A interactions PASS,
- average-velocity math normalization has a direct unit test.

Validation:
- GitHub Actions run **225**
- tested head `62ef643b4f582ed514c483fadc949b257bb2be90`
- typecheck PASS
- Chapter-1 audited data/math gate PASS
- mobile + desktop P39 browser smoke PASS
- production build PASS
- GitHub Pages deploy PASS.

**P39/G61 remains USER RE-QA OPEN.**


## 2026-09-30 USER MICRO-CORRECTION — ADD ONLY TWO RELATION HOLES

This supersedes only the immediately previous statement that the 1A average-velocity chain had four holes.

The user clarified the exact live behavior:
- keep every existing hole in the worked example unchanged,
- add one new hole at `Δr = r₂-r₁`,
- add one new hole at `Δt = t₂-t₁`,
- preserve the existing holes for `(6.0,4.0)`, `3.0`, velocity-numerator substitution, and the final velocity result,
- keep the full calculation inside one derivation frame.

Current worked-example order:
`A9c: Δr relation` → `A9: (6,4)` → `A9d: Δt relation` → `A9a: 3` → `A9b: velocity numerator` → `A10: final velocity`.

Current counts:
- 1A = 13 interactions,
- Chapter 1 = 49 interactions,
- explicit derivation groups remain 14,
- scaffold distribution = strong 6 / medium 20 / light 23.

This is a local user-approved first-example design decision, not a chapter-wide instruction to add relation-recall holes everywhere.

P39/G61 remains USER RE-QA OPEN.


## 21. MANDATORY FUTURE-APP LESSONS FROM CHAPTER 1 USER QA

Before changing textbook-mode pedagogy/UI or batch-producing later chapters, read:

`docs/physics-ch01/CH1_USER_QA_DESIGN_LESSONS.md`

This is not a historical log. It converts Chapter-1 user corrections into reusable App-design rules: one reasoning chain = one visual frame, hole purpose over hole count, canonical-figure authority and timing, visual math QA, mobile-first derivations, strict scope control, and separation of automated PASS from user pedagogical approval.

Where an older snapshot conflicts with a later explicit user-QA rule, the later user-QA rule is authoritative.


## PROJECT-WIDE MASTER LESSONS — MANDATORY FIRST READ

Before any substantial App/content work, read:

`docs/MASTER_APP_LESSONS.md`

This is the single project-wide consolidation of lessons learned across workflow, pedagogy, figures, formula derivations, holes, UI, mobile behavior, source authority, testing, deployment, and user QA.

Detailed files remain authoritative evidence, but this master is the first decision checklist. If an older document conflicts with a later explicit user-QA correction, the later correction wins.

## 2026-10-01 USER 1B WORKED-EXAMPLE CORRECTION — FORMULA APPLICATION

User QA found that 1B explained velocity composition/decomposition correctly but the worked example skipped the formula application and gave the combined vector directly.

Correction scope:
- 1B worked examples only,
- explanatory concept sections remain unchanged,
- 1A and 1C–1G remain unchanged.

New 1B transfer chain:
- B3 retrieve composition relation,
- B4 compute combined velocity vector,
- B5 retrieve vector-magnitude relation,
- B6 compute speed (existing hole retained),
- B7 retrieve decomposition relation in a numerical example,
- B8 compute the decomposed components.

Both worked examples are explicit derivation groups with one visual frame each.

Current interaction counts after this correction:
- 1A=13 / 1B=8 / 1C=4 / 1D=8 / 1E=6 / 1F=8 / 1G=7,
- Chapter 1 total = 54,
- explicit derivation groups = 16,
- scaffold distribution = strong 6 / medium 23 / light 25.

1B revision is bumped 4 → 5.

Next review gate:
**1C must not be edited immediately. First read the project lessons/rules, inspect the current 1C learning path, propose a correction plan, and wait for user approval.**

P39/G61 remains USER RE-QA OPEN.

## 2026-10-01 USER 1C CORRECTION — RELATIVE-VELOCITY APPLICATION + CROSS-UNIT REVIEW

User approved the 1C proposal after reviewing the accumulated pedagogy/formula lessons first.

Scope:
- keep the 1C meaning construction, C2 relation, and C3 zero-relative-speed interpretation,
- rebuild only the rain/bicycle application sequence.

New learner sequence:
- C5: identify the bicycle as the observer/reference,
- C4a: retrieve the relative-velocity relation,
- C4: compute the relative-velocity vector,
- C4b: retrieve the vector-magnitude relation learned in 1B,
- C4c: compute the relative speed,
- then use Figure 8 to confirm direction/meaning.

The rain calculation is one explicit derivation frame.

Current counts:
- 1A=13 / 1B=8 / 1C=7 / 1D=8 / 1E=6 / 1F=8 / 1G=7,
- Chapter 1 total = 57,
- explicit derivation groups = 17,
- scaffold distribution = strong 6 / medium 23 / light 28.

1C revision: 4 → 5.

P39/G61 remains USER RE-QA OPEN.


## 2026-10-02 USER 1D REDESIGN — ACTIVE PHONE-FIRST DERIVATION

User approved the full 1D redesign after first approving a dedicated v-t rectangle/triangle educational graph.

Scope:
- 1D only,
- 1E–1G unchanged,
- canonical Figures 9 and 10 preserved,
- one additive educational v-t graph added; it is not a canonical replacement.

New 1D learning architecture:
- D1/D2: velocity change and acceleration meaning,
- D3/D4: v-t slope and area,
- D5a/D5b: concretize Δv=v−v₀ and Δt=t−0=t,
- D5c: derive v−v₀=at,
- use the approved v-t graph to understand rectangle + triangle area,
- D4b/D4c: reuse v−v₀=at and derive x=v₀t+(1/2)at²,
- D7a/D7/D7b/D7c/D7d: construct average velocity, eliminate t, use difference of squares, and obtain the time-free relation,
- D8: retain force/acceleration condition,
- D9a/D9b/D9/D9c: choose and apply the derived formulas in the numerical example.

Current counts:
- 1D = 19 interactions,
- Chapter 1 total = 68,
- derivation groups = 18,
- scaffold distribution = strong 6 / medium 27 / light 35,
- 1D revision 4 → 5.

P39/G61 remains USER RE-QA OPEN.


## 2026-10-02 USER 1E FULL REPAIR — TECHNICAL + PEDAGOGICAL SCOPE

Important workflow correction:
MR11 radical rendering was only one part of the already-audited 1E repair. The remaining pedagogical items were restored to the active checklist instead of being forgotten.

1E now requires the learner to:
- apply the 1D velocity/position formulas to the horizontal component,
- apply the same 1D formulas to the vertical component,
- correctly derive the time-free vertical relation from v²−v₀²=2ax,
- retrieve the 1B vector-magnitude relation to reconstruct total speed,
- solve x=v₀t for t and substitute it into y=(1/2)gt²,
- derive the parabolic trajectory,
- solve the worked example by finding time vertically and carrying that same time into the horizontal distance calculation.

MR11 remains protected by the same browser test.

Current counts after the full 1E repair:
- 1E = 22 interactions,
- Chapter 1 = 84,
- derivation groups = 22,
- scaffold distribution = strong 6 / medium 34 / light 44,
- correct-option positions = 21 / 21 / 21 / 21,
- 1E revision 4 → 5.

P39/G61 remains USER RE-QA OPEN.


## 2026-10-02 USER 1F FULL REPAIR — PEDAGOGY + MATH RENDERING

Active repair scope:
- fix coordinate/sign convention clarity,
- replace vague “no horizontal force” wording with zero horizontal force component/resultant,
- keep F1 decomposition retrieval,
- actively retrieve horizontal position with reduced support,
- actively reconstruct vertical position and time-free relation,
- make highest-point time and height derivations interactive,
- keep trajectory relation selection inside the same derivation frame and make t elimination active,
- make the nonzero flight-time root a physical decision,
- reuse flight time in horizontal range,
- retrieve the double-angle identity,
- state the conditions behind the 45-degree maximum-range conclusion,
- harden theta / degree / trig inline math rendering,
- expand the 1F browser gate to all major derivations and page-level mobile overflow.

Target counts:
- 1F = 20 interactions,
- Chapter 1 = 96,
- correct choices = 24 / 24 / 24 / 24,
- scaffold = strong 6 / medium 34 / light 56,
- 1F revision 4 → 5.

P39/G61 remains USER RE-QA OPEN.


## 2026-10-02 1F FULL REPAIR — VERIFIED

Exact validated code HEAD:
`48e9454fb0b4fd95702bfaf7a5a3fdc65e3510ef`

GitHub Actions:
- run 256
- attempt 2
- conclusion SUCCESS

PASS:
- Typecheck
- Chapter 1 audited data and math gate
- P39 audited browser smoke
- Build
- Pages deploy

Current live counts:
- 1F = 20 interactions
- Chapter 1 = 96 interactions
- correct choice positions = 24 / 24 / 24 / 24
- scaffold = strong 6 / medium 34 / light 56
- 1F revision = 5

MR13 theta/degree/trig rendering is CLOSED.
P39/G61 user pedagogical re-QA remains OPEN.

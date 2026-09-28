# CHATGPT README FIRST — 物理教科書モード 第1章

対象: `rrikunagasige-dot/kyotsu-step-web`  
基準 branch: `main`  
今回の最終検証 branch: `chatgpt/textbook-reader-repair-v1`

このファイルは、物理教科書モード第1章を導入する作業の入口。作業前に必ずこのファイルと `docs/physics-ch01/MASTER_FIRE_DIAGRAM.md` を読む。

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

## 固定する教育フロー

```text
概念を読む
→ 重要判断を答える
→ 図・式と対応づける
→ 例題で使う
→ 単元全体を再接続する
```

固定しないもの: 知識点数、例題数、図数、段落数、式数、section数。

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

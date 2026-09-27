# CHATGPT README FIRST — 物理教科書モード 第1章

対象: `rrikunagasige-dot/kyotsu-step-web`  
作業 branch: `chatgpt/physics-ch01-textbook-v2`

このファイルは、物理教科書モード第1章を導入する作業の入口。作業前に必ずこのファイルと `docs/physics-ch01/MASTER_FIRE_DIAGRAM.md` を読む。

## 目的

第1章「物体の運動」を 1A〜1G の7単元として安全に導入する。既存の教科書モードの状態機械は維持し、次だけを一般化する。

1. 章 → 単元の階層
2. 単元ごとの本文構造差を吸収する semantic section
3. 図中ラベルを隠して答えさせる Figure V2
4. 自動生成ではなく明示的な選択肢
5. 1単元1ファイルへのデータ分割
6. 原教科書・旧母版・新figureの出典追跡

## Authority order

内容が衝突した場合は次の順で確認する。

```text
原教科書 PDF p.12–27
        ↓ 内容・物理事実
旧 1A 母版 + 1B〜1G Word
        ↓ 教育的な穴埋め構成
figure.zip
        ↓ 第1章の新しい図版
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
8. upstream `paulfields83/kyotsu-step-web` の `main` を勝手に上書きしない。完成作業はこのbranchで行う。

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
P07 NEXT
```

最新の総合gate: GitHub Actions `36335812301` — typecheck / lint / 37 unit tests / build / textbook E2E 6 tests PASS。

P05で1Aを母版2.0として schemaVersion 1.1 へ移行した。78個のstable item IDを維持し、全itemに明示的な誤答候補を与え、 supplied Chapter-1 figures 1〜4 を app asset 化し、Figure V2 maskを実データへ接続した。

P06では実ブラウザで、chapter/unit navigation、順次unlock、誤答保持＋正解表示、inline choice、実figure読み込み、figure maskからの回答、回答後のmask解除とpersist後の再読み込みを確認した。

次は P07。1B「速度の合成と分解」を同じ導入ルールで作る。

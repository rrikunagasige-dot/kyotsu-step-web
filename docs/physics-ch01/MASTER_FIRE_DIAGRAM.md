# 物理・教科書モード 第1章 MASTER FIRE DIAGRAM

## 1. Source → App

```text
S00 原教科書 PDF p.12–27
│
├───────────────┐
│               │
▼               ▼
S01 教材Word     S02 新figure.zip
1A〜1G           1.png〜17.png
│               │
└───────┬───────┘
        ▼
P00 SOURCE AUDIT
        │
        ├─ unit/page mapping
        ├─ figure/unit mapping
        ├─ answer audit
        └─ provenance
        │
        ▼
P01 SEMANTIC NORMALIZATION
        │
        ├─ concept / definition
        ├─ relation / formula
        ├─ causal explanation
        ├─ figure reading
        ├─ worked example
        └─ review
        │
        ▼
P02 BLANK BLUEPRINT
        │
        ├─ concept
        ├─ formula
        ├─ direction
        ├─ figure-label
        ├─ reasoning
        └─ conclusion
        │
        ▼
P03 EXPLICIT DISTRACTORS
        │
        ▼
P04 TEXTBOOK UNIT V2
        │
        ├─ chapter metadata
        ├─ semantic sections
        ├─ figures + overlays
        ├─ readingFlow
        └─ items
        │
        ▼
P05 validateTextbookUnits()
        ↓
P06 textbookRepository
        ↓
P07 LearningSetupPage
        ↓
P08 TextbookUnitPage + TextbookFigure
        ↓
P09 answerTextbookItem()
        ↓
P10 textbookProgress
        ↓
P11 localStorage
```

## 2. Chapter dependency

```text
CH01 物体の運動
│
├─ 1A 変位と速度
├─ 1B 速度の合成と分解
├─ 1C 相対速度
├─ 1D 加速度
├─ 1E 水平投射
├─ 1F 斜方投射
└─ 1G 重力加速度・空気抵抗・終端速度
```

推奨学習順序は 1A→1B→1C→1D→1E→1F→1G。最初のV2ではunit間の完全lockは別ノード扱いとする。

## 3. Section role

```text
concept
  定義・法則・因果

figure-reading
  図と本文・式の対応

worked-example
  何を求めるか→原理→式→計算→結論

review
  新規知識なし。単元の依存関係を再接続
```

同じroleは複数回存在してよい。表示構造は似ても内容の段落数・式・穴数は固定しない。

## 4. Figure V2

```text
original figure
      │
      ▼
TextbookFigure
      │
      ├─ src
      ├─ alt
      ├─ caption
      └─ overlays[]
            ├─ id
            ├─ itemId
            ├─ x/y/width/height (%)
            ├─ mode = mask
            └─ reveal = after-answer
                  │
                  ▼
         TextbookFigure renderer
            ├─ unanswered: mask
            └─ resolved: reveal
```

同じ図を「通常版」「穴埋め版」に二重保存しない。一枚の原図 + overlay metadata で扱う。

## 5. Figure mapping

```text
1A: 1, 2, 3, 4
1B: 5, 6
1C: 7, 8
1D: 9, 10
1E: 11, 12
1F: 13, 14
1G: 15, 16, 17
```

## 6. Schema 1.1 impact

```text
TextbookUnit
├─ schemaVersion: 1.0 | 1.1
├─ chapter metadata (1.1)
└─ sections
    ├─ role (1.1)
    └─ figures
        └─ overlays[]
```

Validation:
- overlay id unique
- overlay itemId exists in same section
- overlay bounds inside 0..100
- item referenced by readingFlow or overlay
- published V2 item has explicit choices
- correct answer appears in choices
- sourcePages ordered/unique

## 7. UI changes

```text
LearningSetupPage
  current: flat unit select
  V2: chapter → unit cards + progress

TextbookUnitPage
  remove hard-coded "A 変位と速度 / 78"
  use unit.title + summary.total

TextbookFigure.tsx
  own image + overlay rendering
```

## 8. Target data layout

```text
src/data/textbook/
├─ index.ts
├─ chapterCatalog.ts
└─ ch01/
   ├─ 1a-displacement-velocity.ts
   ├─ 1b-velocity-composition.ts
   ├─ 1c-relative-velocity.ts
   ├─ 1d-acceleration.ts
   ├─ 1e-horizontal-projectile.ts
   ├─ 1f-oblique-projectile.ts
   └─ 1g-terminal-velocity.ts

public/assets/physics/textbook/ch01/
├─ 1a/
├─ 1b/
├─ 1c/
├─ 1d/
├─ 1e/
├─ 1f/
└─ 1g/
```

## 9. Unit gates

```text
G0 source page mapped
G1 physics content checked
G2 every blank has educational reason
G3 explicit choices checked
G4 figure has no answer leak
G5 references valid
G6 unit completes start→finish
G7 wrong-answer behavior verified
G8 refresh/resume verified
G9 mobile overlay alignment verified
G10 regression test PASS
```

Chapter gate:
```text
G11 1A〜1G order
G12 chapter progress
G13 all 17 figures
G14 stable ID uniqueness
G15 pnpm check
G16 relevant Playwright
G17 pnpm check:all before merge
```

## 10. Current status

```text
P00  DONE — control docs + source manifest on GitHub
P01  IMPLEMENTED / UNVERIFIED — schemaVersion 1.1 + validation tests committed
P02  NEXT — chapter/unit metadata + navigation
P03  WAIT
P04  WAIT
P05  WAIT
P06  WAIT
P07–P14 WAIT
```

P01 is not PASS yet because the full TypeScript/Vitest gate has not been executed on this branch.

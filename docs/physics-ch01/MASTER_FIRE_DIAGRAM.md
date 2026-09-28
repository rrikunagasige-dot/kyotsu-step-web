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
P01  PASS — schemaVersion 1.1 + validation tests
P02  PASS — chapter metadata + chapter/unit navigation + dynamic completion copy
P03  PASS — Figure V2 renderer + percentage overlay masks + overlay unit tests
P04  PASS — textbook data split by chapter/unit + compatibility entry point
P05  PASS — 1A migrated to schemaVersion 1.1 + explicit distractors + supplied figures 1–4 + real overlays
P06  PASS — 1A regression/browser audit including persisted figure-mask flow
P07  PASS — 1B 速度の合成と分解 + supplied figures 5–6 + browser smoke
P08  PASS — 1C 相対速度 + supplied figures 7–8 + browser audit
P09  NEXT — import 1D 加速度
P10–P14 WAIT
```

P01 PASS evidence: GitHub Actions run `36333501024`.

P02–P04 PASS evidence: GitHub Actions run `36334432650`.

P05–P06 final gate evidence: GitHub Actions run `36335812301`:
- TypeScript typecheck PASS
- ESLint PASS
- Vitest: 14 files / 37 tests PASS
- production build PASS
- Playwright Chromium install PASS
- textbook E2E: 6 tests PASS

### P05 implementation summary

```text
1A
├─ schemaVersion 1.1
├─ revision 3
├─ 78 stable item IDs preserved
├─ semantic roles
├─ explicit per-item pedagogical distractors
├─ figure 1 → position-vector-displacement.webp
├─ figure 2 → average-instantaneous-velocity.webp
├─ figure 3 → curve-velocity-directions.webp
└─ figure 4 → displacement-components.webp
```

Figure-mask links currently verified for `d-11`, `d-16`, `d-17`, `d-18`, `d-19`, `q1-4`, `q1-5`, `q1-7`.

During P05/P06 the gates caught and corrected:
1. superseded/duplicate choice-table code,
2. duplicate semantic role fields,
3. an E2E distractor expectation that no longer matched the curated choices,
4. Zustand persistence not rehydrating when only the HashRouter fragment changed,
5. an invalid expectation for a resolved inline element when the answer existed only as a figure overlay.

These were fixed before P05/P06 were marked PASS.


### P07 implementation summary

```text
1B 速度の合成と分解
├─ schemaVersion 1.1
├─ revision 1
├─ sourcePages 14–15
├─ 18 source-aligned items
├─ explicit choices on every item
├─ figure 5 → velocity-composition.webp
├─ figure 6 → velocity-components.webp
└─ Figure V2 hotspot → D-1 (resultant / parallelogram diagonal)
```

P07 final gate evidence: GitHub Actions run `36336610820`:
- TypeScript typecheck PASS
- ESLint PASS
- Vitest: 14 files / 38 tests PASS
- production build PASS
- Playwright Chromium install PASS
- textbook E2E: 7 tests PASS

An intermediate catalog test failed only because the domain ordering assertion still expected `['1A']` after 1B was already published. The test was updated to `['1A','1B']` before P07 was marked PASS.


## 12. P07 1B 速度の合成と分解

```text
1B / physics-1b-velocity-composition
├─ schemaVersion 1.1
├─ revision 1
├─ sourcePages 14–15
├─ 18 source-aligned items
├─ semantic sections
│  ├─ concept
│  ├─ figure-reading
│  ├─ worked-example: 川を横切る船
│  ├─ worked-example: 速度の分解
│  └─ review
├─ explicit 4-choice distractors
├─ figure 5 → velocity-composition.webp
└─ figure 6 → velocity-components.webp
```

1B connects the textbook relations

```text
v_B/ground = v_A/ground + v_B/A
v_x = v cos θ
v_y = v sin θ
v = sqrt(v_x^2 + v_y^2)
```

to the supplied figures and then to two worked examples.

Figure 5 uses a Figure V2 hotspot for `d-1`: the resultant/composition direction is answered from the supplied figure rather than by duplicating a masked image.

Final P07 gate: GitHub Actions run `36336731539`.

PASS:
- TypeScript typecheck
- ESLint
- Vitest: 14 files / 38 tests
- production build
- Playwright Chromium
- textbook E2E: 7 tests

The 1B E2E verifies:
- 1B appears after 1A in Chapter 1
- first concept blank is reachable
- future sections remain locked
- supplied composition figure loads
- hotspot stays within the mobile figure bounds
- the hotspot opens D-1
- correct answer removes the hotspot
- figure 6 becomes visible after D-1 resolution
- resolved hotspot remains removed after reload


### P08 implementation summary

```text
1C 相対速度
├─ schemaVersion 1.1
├─ revision 1
├─ sourcePages 16–17
├─ 17 source-aligned items
├─ explicit choices on every item
├─ figure 7 → relative-velocity-cars.webp
├─ figure 8 → relative-rain-bicycle.webp
└─ Figure V2 hotspot → D-2 (Aから見たBの相対速度)
```

P08 final gate evidence: GitHub Actions run `36373169972`:
- TypeScript typecheck PASS
- ESLint PASS
- Vitest: 14 files / 39 tests PASS
- production build PASS
- Playwright Chromium install PASS
- textbook E2E: 8 tests PASS

The browser gate verifies:
- Chapter 1 lists 1A → 1B → 1C
- 1C starts with its concept section and keeps later sections locked
- figure 7 loads from the supplied source asset
- the D-2 hotspot stays inside the mobile figure bounds
- the hotspot opens the linked relative-velocity item and disappears after a correct answer
- progress can be seeded through example 1
- figure 8 loads in example 2 with nonzero natural width

The P08 checkpoint was batched into one code/assets commit so CI ran once instead of on every micro-change. The workflow now ignores docs-only pushes to reduce notification noise.

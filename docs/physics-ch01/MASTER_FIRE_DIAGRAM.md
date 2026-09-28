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
   └─ 1g-gravity-drag-terminal-velocity.ts

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
G11 PASS — 1A〜1G order
G12 PASS — chapter progress
G13 PASS — all 17 figures
G14 PASS — stable ID uniqueness
G15 PASS — pnpm check
G16 PASS — full Playwright suite
G17 PASS — pnpm check:all before merge
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
P09  PASS — 1D 加速度 + supplied figures 9–10 + browser audit
P10  PASS — 1E 水平投射 + supplied figures 11–12 + browser audit
P11  PASS — 1F 斜方投射 + supplied figures 13–14 + browser audit
P12  PASS — 1G 重力加速度・空気抵抗・終端速度 + supplied figures 15–17 + start→finish browser gate
P13  PASS — Chapter 1 full gate (G11–G17)
P14  PASS — README / fire diagram / worklog finalization
P15  PASS — setup-first navigation: 問題→学習設定→問題を解く→科目→分野→問題
P16  PASS — worked-example adapter: 1A〜1G × 2 = 14 Question
P17  PASS — Chapter 1 publish + dedup audit: motion 15 / physics total 17
P18  PASS — full browser/regression gate
P19  PASS — README / fire diagram / worklog / checkpoint finalization
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


### P09 implementation summary

```text
1D 加速度
├─ schemaVersion 1.1
├─ revision 1
├─ sourcePages 18–19
├─ 17 source-aligned items
├─ explicit choices on every item
├─ figure 9 → acceleration-trajectory.webp
├─ figure 10 → velocity-change-acceleration.webp
└─ Figure V2 → D-1 hotspot + D-2 mask
```

P09 final gate evidence: GitHub Actions run `36374088777`:
- TypeScript typecheck PASS
- ESLint PASS
- Vitest: 14 files / 40 tests PASS
- production build PASS
- Playwright Chromium install PASS
- textbook E2E: 9 tests PASS

A redundant follow-up checkpoint briefly replaced the already-passing 1D asset names and caused one catalog assertion failure. The branch was restored with a normal forward commit (no force push) to the previously verified P09 implementation, then the full gate passed again. P09 was marked PASS only after this recovery run.


### P10 implementation summary

```text
1E 水平投射
├─ schemaVersion 1.1
├─ revision 1
├─ sourcePages 20–21
├─ 16 source-aligned items
├─ explicit choices on every item
├─ figure 11 → horizontal-projectile-strobe.webp
├─ figure 12 → horizontal-projectile-velocity.webp
└─ Figure V2 hotspots → D-1 / D-2 on the strobe figure
```

P10 final gate evidence: GitHub Actions run `36374706122`:
- TypeScript typecheck PASS
- ESLint PASS
- Vitest: 14 files / 41 tests PASS
- production build PASS
- Playwright Chromium install PASS
- textbook E2E: 10 tests PASS

The first P10 browser gate (`36374506994`) caught a real presentation-flow problem: figure 12 was placed in a later reading subgroup, but resolving D-2 completed the whole figure-reading section and the page automatically advanced to the worked example before figure 12 could be seen. The data flow was corrected so figures 11 and 12 remain in the same visible reading subgroup while D-1/D-2 are answered. The final gate then passed.


### P11 implementation summary

```text
1F 斜方投射
├─ schemaVersion 1.1
├─ revision 1
├─ sourcePages 22–24
├─ 19 source-aligned items
├─ explicit choices on every item
├─ figure 13 → oblique-projectile-trajectory.webp
├─ figure 14 → oblique-projectile-components.webp
└─ Figure V2 mask → D-1 (最高点 v_y=0)
```

P11 final gate evidence: GitHub Actions run `36375222401`:
- TypeScript typecheck PASS
- ESLint PASS
- Vitest: 14 files / 42 tests PASS
- production build PASS
- Playwright Chromium install PASS
- textbook E2E: 11 tests PASS

The figure-reading layout deliberately keeps figures 13 and 14 in the same reading subgroup. Figure 14 prints `v_y=0`, so that answer-bearing label is masked and connected to D-1; D-2 asks inferentially why `v_x` remains constant.


### P12 implementation summary

```text
1G 重力加速度・空気抵抗・終端速度
├─ schemaVersion 1.1
├─ revision 1
├─ sourcePages 25–27
├─ 14 source-aligned items
├─ explicit choices on every item
├─ figure 15 → gravity-air-resistance.webp
├─ figure 16 → drag-force-stages.webp
├─ figure 17 → terminal-velocity-graph.webp
└─ full UI start→finish completion audit
```

Source authority checked:
- original textbook p.25–27
- supplied `第1章_1G_重力加速度・空気抵抗・終端速度.docx`
- supplied `figure.zip` figures 15–17

Core physics:
- `m a⃗ = m g⃗` → `a⃗ = g⃗`
- `f=kv`
- `ma=mg-kv`
- `a=g-(k/m)v`
- terminal condition `mg=kv_t`
- `v_t=mg/k`

Gate history:
- run `36387765258`: typecheck/lint/unit/build PASS, textbook E2E FAIL because figure 17 lived in a later reading subgroup and was not visible during the figure-reading audit.
- commit `c3d73345b74bd4f54ad80a6fbc97783260b6ef81`: figures 15–17 were kept in the same reading subgroup.
- run `36388027906`: all current CI gates PASS.
- commit `5d3d92f03545a3291aab86ce4f45150844202a71`: added a true 1G start→finish browser test over all 14 items.
- final P12 run `36388191856`: PASS.
  - TypeScript PASS
  - ESLint PASS
  - Vitest: 14 files / 43 tests PASS
  - production build PASS
  - Playwright Chromium install PASS
  - textbook E2E: 13 tests PASS

P12 gate notes:
- G0–G5: source/physics/item/choice/figure/reference audit complete.
- G6: 1G start→finish E2E PASS.
- G7–G8: shared textbook wrong-answer and persistence behavior remain covered by browser regression tests.
- G9: 1G has no answer-bearing overlay; mobile figure rendering is exercised by the mobile textbook suite.
- G10: final regression run `36388191856` PASS.


## 14. P13/P14 Chapter 1 final gate

Verified HEAD before docs-only finalization:

`26e768ae9f314dba17121739179ea0c262c88845`

Passing evidence:
- Physics Ch01 Full Gate run `36408480283`: SUCCESS
- Physics Ch01 CI run `36408480384`: SUCCESS
- TypeScript typecheck PASS
- ESLint PASS
- Vitest: 14 files / 44 tests PASS
- production build PASS
- Playwright: 42 tests PASS

Chapter gates:
- G11 PASS: chapter setup exposes and preserves order 1A→1B→1C→1D→1E→1F→1G.
- G12 PASS: chapter/unit progress and persisted per-unit progress are verified in browser E2E.
- G13 PASS: figures 1–17 are present in Chapter 1 data/assets; all unit figure browser audits including 1G pass.
- G14 PASS: stable item/figure IDs and chapter/unit identities satisfy the static/domain validation tests.
- G15 PASS: `pnpm check` succeeds inside the final full gate.
- G16 PASS: full Playwright suite, 42/42 tests.
- G17 PASS: `pnpm check:all` succeeds in run `36408480283`.

P13 also exposed stale legacy E2E assumptions that pre-dated textbook-mode routing:
- direct path navigation was migrated to the app's HashRouter/base-path form;
- practice-mode tests were aligned with the current fixed detailed-guidance flow;
- stale catalog counts/text expectations were removed;
- mobile header controls were restored to the 44px accessibility gate;
- Chinese locale assertions were aligned with the authoritative localized catalog;
- language switching now explicitly closes/reopens the active BottomSheet around header interaction.

These were treated as regression-gate defects, not hidden by weakening the Chapter 1 tests. P13 was marked PASS only after the complete CI and full gate were green.

P14 finalizes the authoritative control documents. No source/schema/state change is made by P14.


## 15. P15–P19 Chapter 1 → Question Bank

```text
TextbookUnit 1A〜1G
      │
      ├─ concept
      ├─ figure-reading
      ├─ worked-example  ← only this role
      └─ review
              │
              ▼
P16 textbookPracticeQuestions adapter
              │
              ├─ 2 worked examples / unit
              ├─ stable Question IDs
              ├─ learning blanks
              ├─ simulation final choice
              ├─ source provenance
              └─ JA/ZH grading parity
              │
              ▼
14 imported Questions
              │
              ├─ majorUnit = mechanics
              └─ minorUnit = motion
              │
              ▼
existing physics-motion-01
              │  independent v–t graph sample
              └──────────────┐
                             ▼
                    motion = 15 Questions
                             │
                             ▼
P15 LearningSetup hierarchy
問題 → 学習設定 → 問題を解く → 物理 → 分野 → 問題
                             │
                             ▼
P18 browser/full regression gate
```

### Import gates

- G18 PASS — exactly 14 worked-example Questions, 2 from each 1A〜1G.
- G19 PASS — all 14 imported Questions use primary taxonomy `mechanics / motion`.
- G20 PASS — Japanese/Chinese catalogs preserve identical grading IDs and contain no Japanese-kana fallback in Chinese imports.
- G21 PASS — existing `physics-motion-01` audited as non-duplicate and retained.
- G22 PASS — ProblemsPage no longer exposes physics taxonomy before LearningSetup.
- G23 PASS — LearningSetup practice→physics shows 5 domains / 23 cards; motion count is 15.
- G24 PASS — browser can select `physics-ch01-1g-example-q1` from motion and start a real learning session.
- G25 PASS — full `pnpm check:all`: typecheck, lint, Vitest, production build, Playwright.

Verified code HEAD before docs-only P19:
`e79f636e0ae347d5845916743f60f88dcfc63f6c`

Final gate:
- GitHub Actions run `36436511183`: SUCCESS
- TypeScript typecheck PASS
- ESLint PASS
- Vitest: 16 files / 50 tests PASS
- production build PASS
- Playwright: 44/44 PASS

Gate history caught and fixed:
1. locale-specific unused imports in JA/ZH catalogs,
2. one unused adapter variable,
3. Chinese imported prompt accidentally containing Japanese kana,
4. legacy fixed catalog-size assertion (5 → 19),
5. missing `tolerance: 0` required by the simulation type,
6. legacy physics-learning E2E that skipped the new topic-selection step.

No test was weakened to hide these failures.


## 16. P20–P25 Full Textbook Catalog Repair

```text
authoritative physics textbook TOC
        │
        ├─ Part 1 様々な運動
        │    ├─ Chapter 1 物体の運動 ← implemented
        │    ├─ Chapter 2 剛体のつり合い
        │    ├─ Chapter 3 運動量と力積
        │    ├─ Chapter 4 円運動と単振動
        │    └─ Chapter 5 万有引力
        │
        ├─ Part 2 熱
        │    └─ Chapter 1 気体分子の運動
        │
        ├─ Part 3 波
        │    ├─ Chapter 1 波の性質
        │    ├─ Chapter 2 音
        │    └─ Chapter 3 光
        │
        ├─ Part 4 電気と磁気
        │    ├─ Chapter 1 電界と電位
        │    ├─ Chapter 2 電流
        │    ├─ Chapter 3 電流と磁界
        │    └─ Chapter 4 電磁誘導と電磁波
        │
        └─ Part 5 原子・分子の世界
             ├─ Chapter 1 電子と光
             └─ Chapter 2 原子・原子核・素粒子

catalog authority
      │
      ▼
LearningSetup textbook mode
      │
      ├─ implemented chapter → unit links
      └─ unimplemented chapter → 準備中
                                   │
                                   ▼
implemented unit title click
      │
      └─ direct route /learning/textbook/:unitId
                                   │
                                   ▼
TextbookUnitPage
  title without internal 1A〜1G code
  readingFlow / Figure V2 / blanks / examples / progress
```

### P20–P25 status

- P20 PASS — full 5-part / 15-chapter catalog established.
- P21 PASS — LearningSetup uses catalog as authority; 14 unimplemented chapters remain visible as 準備中.
- P22 PASS — internal unit codes 1A〜1G removed from learner-facing setup and textbook H1/completion copy.
- P23 PASS — implemented unit cards navigate directly to the textbook unit page; no extra textbook start button.
- P24 PASS — direct-open 1A browser path renders heading, readingFlow, inline blanks; existing 1A figure/mask/progress regression tests remain green.
- P25 PASS — full regression gate and control-doc finalization.

### Catalog gates

- G26 PASS — exactly 5 textbook parts.
- G27 PASS — exactly 15 textbook chapter titles.
- G28 PASS — Chapter 1 keeps 7 implemented units; remaining 14 chapters have no fabricated unit data.
- G29 PASS — unimplemented chapters stay visible as 準備中 rather than disappearing.
- G30 PASS — learner UI does not display `1A` for the first unit.
- G31 PASS — first-unit card click immediately navigates to `/learning/textbook/physics-a-displacement-velocity`.
- G32 PASS — direct-open 1A exposes textbook reading content and keeps the existing Figure V2/blank/progress gates.
- G33 PASS — `pnpm check:all` succeeds.

Verified code HEAD before docs-only finalization:
`46018ed2d22e46bc8a174a705d7f62ffa6b933c2`

Final gate:
- GitHub Actions run `36440820115`: SUCCESS
- TypeScript typecheck PASS
- ESLint PASS
- Vitest: 17 files / 53 tests PASS
- production build PASS
- Playwright: 44/44 PASS


## 17. P26–P31 Textbook Reader Repair

```text
wrong choice
   │
   ├─ resolved = false
   ├─ progress += 0
   └─ panel closes → 「もう一度」
                     │
                     └─ correct retry → resolved

reading sections
   section 1 ──kept──┐
   section 2 ──kept──┼─→ continuous reading stack
   section 3 ──kept──┘

formula(parts + holes)
   ↓ assemble complete LaTeX first
KaTeX render once
   ↓
interactive hole without raw TeX leakage

canonical uploaded figures
   ↓ regenerate WebP
7 corrupted assets replaced
   ↓
17/17 RIFF integrity gate
```

- G34 PASS — wrong answers do not advance progress.
- G35 PASS — wrong choice panel closes; retry remains inline; correct retry resolves.
- G36 PASS — completed sections remain visible when the next section opens.
- G37 PASS — Chapter 1 formula blocks compile with unresolved and resolved holes.
- G38 PASS — raw TeX and micro internal labels do not leak to visible learner text.
- G39 PASS — figure masks remain until the underlying item is correctly resolved.
- G40 PASS — figures 2/3/5/11/12/13/14 replaced from canonical uploaded figures.
- G41 PASS — exactly 17 unique figures and every WebP has complete RIFF payload.
- G42 PASS — full `pnpm check:all`.

Final gate: `36455569868` SUCCESS — Vitest 19/58, Playwright 46/46, typecheck/lint/build PASS.

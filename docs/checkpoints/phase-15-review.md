# Phase 15 Review — Full Physics Textbook Catalog Repair

## Goal

Chapter 1 content already existed, but the learner-facing textbook shell was incomplete. Repair the outer textbook navigation before implementing Chapter 2 content.

## Result

**PASS**

## Fixed

- 5 parts displayed.
- 15 chapter titles displayed.
- Chapter 1 keeps seven implemented units.
- Remaining 14 chapters stay visible as `準備中`.
- Unit codes `1A〜1G` are no longer learner-facing.
- Unit title click directly opens the textbook unit.
- Removed the extra textbook-mode start button.
- Textbook page title and completion copy use the semantic unit title only.

## Catalog

### 第1部 様々な運動
1. 物体の運動
2. 剛体のつり合い
3. 運動量と力積
4. 円運動と単振動
5. 万有引力

### 第2部 熱
1. 気体分子の運動

### 第3部 波
1. 波の性質
2. 音
3. 光

### 第4部 電気と磁気
1. 電界と電位
2. 電流
3. 電流と磁界
4. 電磁誘導と電磁波

### 第5部 原子・分子の世界
1. 電子と光
2. 原子・原子核・素粒子

## Validation

Code HEAD:
`46018ed2d22e46bc8a174a705d7f62ffa6b933c2`

GitHub Actions:
`36440820115` — SUCCESS

- TypeScript PASS
- ESLint PASS
- Vitest 17 files / 53 tests PASS
- production build PASS
- Playwright 44/44 PASS

## Next

Only after this shell is stable should Chapter 2 content be implemented. Chapter 2 currently remains a catalog placeholder; no synthetic textbook content was created.

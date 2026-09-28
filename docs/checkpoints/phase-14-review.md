# Phase 14 Review — Physics Chapter 1 Question Bank Import

## Goal

第1章 1A〜1G の教科書データを再利用し、worked-example 単位で物理題庫へ導入する。同時に物理分類UIの導線を「学習設定の内側」へ修正する。

## Result

**PASS**

## Completed

- ProblemsPage から物理taxonomy boardを除去。
- LearningSetupPage で practice → physics の後に5領域・23カードを表示。
- topic未選択では物理question selector / startを有効化しない。
- `TextbookUnit.sections(role=worked-example)` → `Question` 共通adapterを追加。
- 1A〜1Gから14問を自動生成・公開。
- 第1章14問を `mechanics / motion` へ分類。
- 既存 `physics-motion-01` は非重複として保持。
- 運動15問、物理17問、全built-in 19問。
- 日本語/中国語で同一 grading identity を維持。
- 中国語importに日本語かなfallbackなし。
- 1G import問題をUIから実際に開始するE2Eを追加。

## Main files

- `src/data/textbookPracticeQuestions.ts`
- `src/data/questions.ts`
- `src/data/questions.zh.ts`
- `src/pages/ProblemsPage.tsx`
- `src/pages/LearningSetupPage.tsx`
- `src/data/textbookPracticeQuestions.test.ts`
- `src/data/physicsTaxonomy.test.ts`
- `e2e/physics-taxonomy.spec.ts`
- `e2e/learning-flow.spec.ts`

## Validation

GitHub Actions run: `36436511183`

- TypeScript: PASS
- ESLint: PASS
- Vitest: 16 files / 50 tests PASS
- Production build: PASS
- Playwright: 44/44 PASS

## Browser flow verified

```text
問題
→ 学習を始める
→ 問題を解く
→ 物理
→ 運動 (15)
→ physics-ch01-1g-example-q1
→ 学習session開始
```

## Fixed during gate

- unused imports / unused variable
- Chinese prompt kana leak
- stale fixed catalog size
- missing simulation tolerance
- legacy E2E missing topic selection

## Remaining risk

- 中国語importは grading identity を厳密に共有する簡潔ガイド版で、原教科書readingFlowの完全な逐語翻訳ではない。
- 第2章以降を導入する際は、同じadapterを再利用できるかsource role差を先にauditする。

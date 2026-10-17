# P-002 — 数と式3テーマの公開レビュー導線（CMD-WORK-002「作成」）
Work: W-MATH-003
Status: APPROVED / IMPLEMENTING
Date: 2026-10-17 JST

## Approval evidence
The user corrected the command from 修正 to 作成 (this is the ongoing creation work), then replied 「いいよ続け」 directly to the full P-002 proposal: 3 math concept topics, 6 existing authored units, setup navigation, published Pages review link and verification. Original P-001 remains active; P-002 adds public hands-on review and catalog structure.

## Problem
N02/N09 26 stages are present only in draft PR #71; the existing learner setup hardcodes Chapter 3 and repository.listPublished excludes review units. A PR or test success is not a discoverable app URL.

## Approved chapter-1 arrangement
Math -> textbook -> Chapter 1 数と式 -> exactly three theme cards:
1. 式を整える: N01 -> N02 -> N03.
2. 実数を扱う: N09 -> N10.
3. 不等式を使う: N12.
Internal unit ids and all 90 existing choices remain stable; chapter card opens earliest unfinished lesson, next-unit navigation continues only inside its topic. Chapter 3 sets and the physics textbook remain unchanged. Chapter-1 page H1 uses the theme, previous unit title is a smaller current-topic label.

## Publication and review guardrails
Only the six source-audited numbers lesson IDs become learner-visible via an explicit allowlist in setup. They retain status review, with レビュー公開中 labeling. Other review-only proposition/functions units remain hidden. No publisher answer booklet or redistribution permission is claimed. Source Word remains immutable; N09 original figure must remain byte-identical and appear only after correct Q10.
Approved: isolate code+tests in branch/PR, pass TypeScript/unit/build/browser/governance checks, merge on green and Pages-deploy, verify working public routes, deliver actual learner link. This is user review access, not final textbook acceptance. Do not touch physics/practice/other pedagogy, source/IDs or unpublished original units.

## Verification
3 exact topic cards, 6 review lessons, Chapter3 unchanged, correct next-unit flow; N02/N09 26 answer E2E mobile/desktop and image gate; math proof/schema/KaTeX and SVG build; N01/N03/N10/N12 + physics/practice regression, no 320px overflow, browser persistence; CI+Pages result. W-MATH-003 remains VERIFYING after handoff, 148 original source markers still unaudited.

# Chapter 1 learning-text prototype checkpoint

## Current checkpoint — v2.1

- checkpoint date: `2026-09-29`
- chapter: `physics-ch01-motion`
- prototype: **formula-derivation-strengthened v2.1**
- status: **P33 SOURCE-ALIGNED / READY FOR P34**
- units: 1A–1G
- canonical figures: 17
- inline hole IDs: 54
- rendered review pages: 26
- target device assumption: phone-only use must be possible; paper/pen is not assumed

## Authoritative text source

`CH1_LEARNING_TEXT_V2_1.md`

Final source identity:

- bytes: `38,531`
- SHA256: `a3a8848257140b53487428a35c8882a7214a2ad5a8c7876a13a55c1916b6f2a3`

The Markdown source records:
- natural continuous prose,
- 54 justified inline holes,
- choices,
- figure identity and app-asset mapping,
- complete answer key,
- mobile-first formula derivations,
- the five P33 source-alignment repairs.

The source, not the DOCX layout, is the machine-readable content authority for the current checkpoint.

## v2.1 changes from v2

P33 found five source-level issues and v2.1 resolves all five:

1. removed the first-exposure C1 vocabulary lottery; `相対速度` is now taught in prose,
2. added `cosθ=vₓ/v` and `sinθ=vᵧ/v` before the component-formula holes,
3. derived `vᵧ²=2gy` from the general constant-acceleration relation,
4. derived the oblique-projectile time-free vertical relation from the same parent equation,
5. defined the linear-drag model, `k>0`, and its approximation scope.

No replacement hole was invented for C1. Hole count therefore moves from 55 to 54 by design.

## Rules

Read both before editing the source:

1. `../LEARNING_TEXT_WRITING_RULES.md`
2. `../FORMULA_DERIVATION_RULES.md`

Ordinary mathematical background may be recalled through search/AI on a phone. The chapter itself must still construct new physics meanings, modeling assumptions, conditions, and dependency logic.

## Reproducible generator

`../../../scripts/physics-textbook/build_ch1_learning_docx.py`

Final generator identity:

- bytes: `8,800`
- SHA256: `0fd914a92bd51f8654bef0a4ba7d9370bc7511ed3228e1acfc1e2c1b51c4420c`

Usage:

    python scripts/physics-textbook/build_ch1_learning_docx.py \
      --source docs/physics-ch01/prototypes/CH1_LEARNING_TEXT_V2_1.md \
      --figure-dir <directory containing canonical 1.png ... 17.png> \
      --output /tmp/ch1-review.docx

Validation:
- 54/54 unique inline hole IDs parsed,
- C1 is not a hole,
- 17/17 canonical figures inserted,
- choice tables are non-splitting,
- hole sentence and choice table are kept together when possible,
- Markdown bold markers render as Word emphasis rather than literal asterisks,
- generated document rendered to 26 pages,
- all pages visually inspected,
- final two micro-edits were isolated by image diff and rechecked.

## Reviewed Word artifact

The final v2.1 review Word is persisted in ChatGPT Library:

- path: `/塾/kyotsu-step-web/prototypes/第1章_物体の運動_文章内穴埋め_数式導出強化版_v2.1_20260929.docx`
- library_file_id: `libfile_646f9a1da760819180156735b3bb3383`
- bytes: `12,130,769`
- SHA256: `69d22ab962f5fb25f6af9e78f3fe7ace82381d5c253a9f2812a85846510cf573`
- reviewed render: 26 pages
- canonical figures: 17
- holes: 54

The GitHub connector does not provide a safe local-file upload path for the 12 MB DOCX. Therefore the exact DOCX bytes live in Library while GitHub stores the authoritative text source, generator, rules, and binary identity.

## Previous checkpoint — v2

`CH1_LEARNING_TEXT_V2.md` remains as historical evidence of the 55-hole pre-P33-repair checkpoint. It is **not current**.

## Relationship to P33 / P34

v2.1 closes the P33 source-alignment issues.

    CURRENT Chapter-1 v2.1
            ↓
    P33 re-audit: PASS
            ↓
    P34 CURRENT APP vs IDEAL
            ↓
    missing / wrong / wrong timing / split-attention / leakage

Do not alter application code merely because P34 begins. P34 is an audit first.

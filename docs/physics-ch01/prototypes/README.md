# Chapter 1 learning-text prototype checkpoint

## Current checkpoint

- checkpoint date: `2026-09-29`
- chapter: `physics-ch01-motion`
- prototype: **formula-derivation-strengthened v2**
- status: **CURRENT P33 INPUT — not a P33/P34 PASS**
- units: 1A–1G
- canonical figures: 17
- inline hole IDs: 55
- target device assumption: phone-only use must be possible; paper/pen is not assumed

## Authoritative text source

`CH1_LEARNING_TEXT_V2.md`

Identity of the checkpoint source extracted from the reviewed Word:

- SHA256: `c97f191bc694cabd8351b616dad77eabf6a80251cf28f048e0b5562d8ca735ef`

The Markdown source records:
- natural continuous prose,
- inline holes,
- choices,
- figure identity and app-asset mapping,
- complete answer key,
- the strengthened derivation text.

The source, not the DOCX layout, is the machine-readable content authority for this checkpoint.

## Rules

Read both before editing the source:

1. `../LEARNING_TEXT_WRITING_RULES.md`
2. `../FORMULA_DERIVATION_RULES.md`

The first controls prose/learning-story construction.
The second controls equation derivation, mobile-first reasoning, and H1–H6 hole placement.

## Reproducible generator

`../../../scripts/physics-textbook/build_ch1_learning_docx.py`

Current source-driven generator identity at checkpoint preparation:

- local validated SHA256: `ef27c388de5020c22f614f2962b2c9551313a7ca6f855b94467f1093ef025e49`

Usage:

    python scripts/physics-textbook/build_ch1_learning_docx.py \
      --source docs/physics-ch01/prototypes/CH1_LEARNING_TEXT_V2.md \
      --figure-dir <directory containing canonical 1.png ... 17.png> \
      --output /tmp/ch1-review.docx

The canonical PNG directory is obtained from the persisted `figure.zip`; see `../SOURCE_MANIFEST.md`.

Validation performed before checkpoint:
- 55/55 unique inline hole IDs parsed,
- 17/17 canonical figures inserted,
- generator output rendered successfully,
- regenerated document visually inspected as a full contact sheet.

## Reviewed Word artifact

The user-reviewed formula-derivation-strengthened Word is persisted in ChatGPT Library:

- path: `/塾/kyotsu-step-web/prototypes/第1章_物体の運動_文章内穴埋め_数式導出強化版_20260929.docx`
- library_file_id: `libfile_4b3267e913d48191a43e666da1a57329`
- bytes: `12,133,046`
- SHA256: `bfd461cbfbe1710a5bf15f9ecf16572e10824e794157c650b0ebf536f223fbe4`
- reviewed render: 27 pages
- canonical figures: 17
- holes: 55

The available GitHub connector does not accept a local binary file reference for a 12 MB DOCX upload. Therefore the DOCX bytes are persisted in Library while GitHub stores the exact identity, authoritative text source, rules, and generator. Do not claim that the DOCX binary itself is committed to GitHub.

## Relationship to P33

This checkpoint gives P33 a concrete object to analyze.

Next edge:

    CURRENT Chapter-1 v2 source
            ↓
    extract representation / knowledge / formula dependencies
            ↓
    P33 G52-G54 audit
            ↓
    P34 current-app contradiction audit

Do not alter application code during this checkpoint.

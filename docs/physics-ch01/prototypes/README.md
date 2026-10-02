# Chapter 1 learning-text source

Status: **CURRENT LIVE AUTHORITY**

Current source:
`CH1_LEARNING_TEXT.md`

Current app parser:
`../../../src/data/textbook/ch01/chapter1Continuous.ts`

Current state:
- units: 1A–1G internally
- canonical figures: 17
- interactions: 100
- correct-choice positions: 25 / 25 / 25 / 25
- phone-only / no-paper learning path
- deployed through the main GitHub Pages workflow

Rules to read before editing:
1. `../LEARNING_TEXT_WRITING_RULES.md`
2. `../FORMULA_DERIVATION_RULES.md`
3. `../../INFORMATION_ARCHITECTURE_RULES.md`
4. `../../MATH_RENDERING_RULES.md`

The Markdown source is the machine-readable content authority. The App imports it directly; do not maintain a second prose copy in TypeScript.

## Historical checkpoints

Older pre-live learning-text checkpoints are preserved under:

`archive/`

- `archive/CH1_LEARNING_TEXT_V2.md` — historical 55-hole checkpoint
- `archive/CH1_LEARNING_TEXT_V2_1.md` — historical 54-hole P33-aligned checkpoint

These are evidence only and are not current authority.

## Review-document generator

`../../../scripts/physics-textbook/build_ch1_learning_docx.py`

Example:

    python scripts/physics-textbook/build_ch1_learning_docx.py \
      --source docs/physics-ch01/prototypes/CH1_LEARNING_TEXT.md \
      --figure-dir <directory containing canonical 1.png ... 17.png> \
      --output /tmp/ch1-review.docx

Historical reviewed DOCX identities remain in Git history / Library records. Do not use old hole counts as current status.

# Phase 16 Review — Textbook Reader Root Repair

## Result

**PASS**

## Why this phase existed

Manual public-page review exposed defects that earlier green CI did not cover:

- wrong answers were treated as completed,
- wrong-answer UI dominated the article,
- split LaTeX could leak raw TeX,
- moving forward removed previous text/figures,
- seven Chapter-1 WebPs were truncated.

## Final behavior

### Answers

```text
wrong choice
  ↓
panel closes
  ↓
inline “もう一度”
  ↓
progress unchanged
  ↓
retry
  ↓ correct
resolved + progress advances
```

No immediate correct-answer reveal after a wrong choice.

### Formulas

Formula reading parts are assembled into one complete LaTeX expression and rendered once with KaTeX. Interactive holes retain stable IDs without displaying internal labels.

### Reading continuity

```text
section 1 remains visible
       ↓
     次へ
       ↓
section 2 opens below
       ↓
section 1 text/figures remain
```

### Figures

Seven corrupt WebPs were regenerated from the canonical supplied PNG archive:
2, 3, 5, 11, 12, 13, 14.

Figure 2 was directly inspected after repair and is visually intact.

## Validation

Repair HEAD:
`a68f03ebf9f076343f9ed4a903c597f182028eb9`

GitHub Actions:
`36455569868` — SUCCESS

- TypeScript PASS
- ESLint PASS
- Vitest 19 files / 58 tests PASS
- production build PASS
- Playwright 46/46 PASS

## New permanent gates

- wrong answer cannot complete an item,
- correct retry is supported,
- legacy valid progress remains readable,
- every Chapter-1 formula compiles unresolved/resolved,
- visible raw TeX/internal labels are rejected,
- previous sections remain visible,
- figure masks require true resolution,
- 17 figure references are unique,
- truncated RIFF/WebP assets fail unit tests,
- long-page overlay bounds use scroll-independent DOM comparison.

## Source archive identity

- `figure(1).zip`
  - 11,478,555 bytes
  - SHA256 `e938a1be0470a87c429ee766c9f75163e9f0768470bb3e403449760b92622e58`
- `物理教科書モード_第1-5章_母版準拠_完全版(2).zip`
  - 48,113,309 bytes
  - SHA256 `4b55b4bce84b2330033c2829cd29106cc6448900b189308f4e7f42594624e33e`

The repository records the archive identities and extracted canonical assets. The current GitHub connector cannot safely upload these complete large ZIP archives as release assets, so the ZIP bytes are not falsely marked as committed.

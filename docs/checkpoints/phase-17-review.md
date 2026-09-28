# Phase 17 Review — Persistent Source Archives

## Result

**PASS**

## Purpose

Stop repeatedly searching local/Desktop machines for source ZIPs that had already been uploaded.

## Canonical archives

### Chapter 1 figures

- canonical name: `figure.zip`
- bytes: 12,078,342
- SHA256: `b1d55eb94c13aa8ec91dbfd794dcbcbcec9c5a67ed8bdd692c397ad78d8b01e2`
- entries: 17 PNG files
- ZIP integrity: PASS
- Library: `/塾/kyotsu-step-web/source_archives/figure.zip`
- library_file_id: `libfile_f62fe4c165d481919f798f2394918071`

### Physics Chapter 1–5 mother/source packet

- canonical name: `物理教科書モード_第1-5章_母版準拠_完全版.zip`
- bytes: 50,419,544
- SHA256: `df1194b491d362c569018da15bc31e3583926a863af1f74b4842b033240e8eff`
- entries: 72
- ZIP integrity: PASS
- Library: `/塾/kyotsu-step-web/source_archives/物理教科書モード_第1-5章_母版準拠_完全版.zip`
- library_file_id: `libfile_14988b216fa48191beeff635f7c4c1f2`

## GitHub index

- `docs/source_archives/README.md`
- `docs/physics-ch01/SOURCE_MANIFEST.md`

## Retrieval order

```text
README_FIRST
  ↓
GitHub source archive index
  ↓
ChatGPT Library persistent path
  ↓
size + SHA256 + ZIP integrity
  ↓
use source
```

Only request another upload if the persistent source is missing or fails identity/integrity checks.

## Binary-storage boundary

The current GitHub connector does not provide a local-file / Release-asset upload action. The source ZIP bytes are therefore in persistent Library, not falsely claimed as repository blobs.

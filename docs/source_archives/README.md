# Source Archives

This directory is the GitHub-side index for the large original source ZIPs used by the physics textbook project.

The ZIP bytes are persisted in ChatGPT Library because the GitHub connector used by this project has no local-file or Release-asset binary upload action for large archives.

## Canonical archives

| archive | bytes | SHA256 | persistent Library path |
|---|---:|---|---|
| `figure.zip` | 12,078,342 | `b1d55eb94c13aa8ec91dbfd794dcbcbcec9c5a67ed8bdd692c397ad78d8b01e2` | `/塾/kyotsu-step-web/source_archives/figure.zip` |
| `物理教科書モード_第1-5章_母版準拠_完全版.zip` | 50,419,544 | `df1194b491d362c569018da15bc31e3583926a863af1f74b4842b033240e8eff` | `/塾/kyotsu-step-web/source_archives/物理教科書モード_第1-5章_母版準拠_完全版.zip` |

Library IDs:
- figure archive: `libfile_f62fe4c165d481919f798f2394918071`
- mother/source packet: `libfile_14988b216fa48191beeff635f7c4c1f2`

## Retrieval rule

Before asking the user for a ZIP:
1. search ChatGPT Library under `/塾/kyotsu-step-web/source_archives`,
2. retrieve the canonical file,
3. verify size and SHA256,
4. inspect ZIP integrity,
5. only request a re-upload if those checks fail or the persistent file is unavailable.

Do not use Desktop as the default retrieval path.

## Integrity notes

`figure.zip` contains exactly 17 PNG source figures for Chapter 1.

The complete mother/source packet contains 72 ZIP entries, including:
- `README_FIRST.md`
- per-unit Word files
- chapter Word files
- source PDF
- source figures
- internal `SHA256SUMS.txt`

See `docs/physics-ch01/SOURCE_MANIFEST.md` for the detailed source-to-app mapping.

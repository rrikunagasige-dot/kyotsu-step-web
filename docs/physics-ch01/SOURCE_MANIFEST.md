# Physics Chapter 1 Source Manifest

## Chapter

- chapterId: `physics-ch01-motion`
- chapterNumber: `1`
- chapterTitle: `物体の運動`
- source pages: 12–27
- recommended order: 1A → 1B → 1C → 1D → 1E → 1F → 1G

## Unit mapping

| code | proposed unitId | title | pages | figures |
|---|---|---|---:|---|
| 1A | physics-1a-displacement-velocity | 変位と速度 | 12–13 | 1–4 |
| 1B | physics-1b-velocity-composition | 速度の合成と分解 | 14–15 | 5–6 |
| 1C | physics-1c-relative-velocity | 相対速度 | 16–17 | 7–8 |
| 1D | physics-1d-acceleration | 加速度 | 18–19 | 9–10 |
| 1E | physics-1e-horizontal-projectile | 水平投射 | 20–21 | 11–12 |
| 1F | physics-1f-oblique-projectile | 斜方投射 | 22–24 | 13–14 |
| 1G | physics-1g-gravity-drag-terminal-velocity | 重力加速度・空気抵抗・終端速度 | 25–27 | 15–17 |

## Figure mapping

- 1.png — 1A: position vector / displacement
- 2 (2).png — 1A: average velocity → instantaneous velocity
- 3 (2).png — 1A: tangent direction along a curved path
- 4.png — 1A: x/y components of displacement
- 5.png, 6.png — 1B
- 7.png, 8.png — 1C
- 9.png, 10.png — 1D
- 11.png, 12.png — 1E
- 13.png, 14.png — 1F
- 15.png, 16.png, 17.png — 1G

## Policy

- source physics: textbook PDF is authoritative
- historical pedagogical reference: supplied Word files
- current Chapter-1 reconstructed learning-text authority: `prototypes/CH1_LEARNING_TEXT_V2_1.md`
- prose construction rule: `LEARNING_TEXT_WRITING_RULES.md`
- formula derivation / hole-placement rule: `FORMULA_DERIVATION_RULES.md`
- chapter figures: supplied `figure.zip`
- application state/UI constraints: executable repository
- review DOCX identity: `prototypes/README.md`
- no synthetic substitute data when source content is available

The supplied Word files are no longer treated as an immutable final pedagogy layout. They remain reconstruction/reference sources. User-reviewed current pedagogy rules and the current prototype source take precedence for learning architecture.


## 1A app assets

The supplied 1A figures are represented in the app as optimized WebP assets:

| source figure | app asset | use |
|---|---|---|
| 1.png | `public/assets/physics/textbook/ch01/1a/position-vector-displacement.webp` | position vectors and displacement |
| 2 (2).png | `public/assets/physics/textbook/ch01/1a/average-instantaneous-velocity.webp` | average vs instantaneous velocity direction |
| 3 (2).png | `public/assets/physics/textbook/ch01/1a/curve-velocity-directions.webp` | tangent velocity along a curved path |
| 4.png | `public/assets/physics/textbook/ch01/1a/displacement-components.webp` | displacement components |

Figure V2 masks are metadata, not separate image copies. Current 1A masks link figure labels to:
- `d-11`
- `d-16`
- `d-17`
- `d-18`
- `d-19`
- `q1-4`
- `q1-5`
- `q1-7`

Unreferenced synthetic redraw assets are not kept when the supplied source figure is available.


## 1B app assets

The supplied 1B figures are represented in the app as optimized WebP assets:

| source figure | app asset | use |
|---|---|---|
| 5.png | `public/assets/physics/textbook/ch01/1b/velocity-composition.webp` | boat/water/ground velocity composition |
| 6.png | `public/assets/physics/textbook/ch01/1b/velocity-components.webp` | x/y decomposition of velocity |

Figure 5 uses Figure V2 hotspot metadata linked to `d-1`.
Figure 6 is displayed without a mask for the current D-2 task because D-2 asks the geometric relation between x and y component directions, so the printed `v_x` / `v_y` labels do not reveal the answer “垂直”.

Unit data:
- `src/data/textbook/ch01/1b-velocity-composition.ts`
- `unitId: physics-1b-velocity-composition`
- `schemaVersion: 1.1`
- `sourcePages: [14, 15]`


## 1C app assets

The supplied 1C figures are represented in the app as optimized WebP assets:

| source figure | app asset | use |
|---|---|---|
| 7.png | `public/assets/physics/textbook/ch01/1c/relative-velocity-cars.webp` | same/opposite-direction cars and A-observed relative velocity |
| 8.png | `public/assets/physics/textbook/ch01/1c/relative-rain-bicycle.webp` | rain minus bicycle velocity construction |

Figure V2:
- figure 7 uses `hotspot-d-2` linked to item `d-2` for the relative-velocity arrow.
- figure 8 is displayed without a mask because the worked example asks for vector components, magnitude, and inferred angle rather than copying a printed label.

Unit data:
- `src/data/textbook/ch01/1c-relative-velocity.ts`
- `unitId: physics-1c-relative-velocity`
- `schemaVersion: 1.1`
- `sourcePages: [16, 17]`


## 1D app assets

The supplied 1D figures are represented in the app as optimized WebP assets:

| source figure | app asset | use |
|---|---|---|
| 9.png | `public/assets/physics/textbook/ch01/1d/acceleration-trajectory.webp` | curved trajectory with v1, v2 and Δt |
| 10.png | `public/assets/physics/textbook/ch01/1d/velocity-change-acceleration.webp` | vector construction Δv=v2−v1 and average acceleration |
| user-approved educational support figure (2026-10-02) | `public/assets/physics/textbook/ch01/1d/vt-area-derivation.svg` | v-t area decomposition into rectangle + triangle for the constant-acceleration derivation |

Figure V2:
- figure 10 uses `hotspot-d-1` linked to item `d-1` for the meaning of `Δv`.
- figure 10 also uses `mask-d-2` linked to item `d-2` for the vector that determines the average-acceleration direction.

Unit data:
- `src/data/textbook/ch01/1d-acceleration.ts`
- `unitId: physics-1d-acceleration`
- `schemaVersion: 1.1`
- `sourcePages: [18, 19]`


## 1E app assets

| source figure | app asset | use |
|---|---|---|
| 11.png | `public/assets/physics/textbook/ch01/1e/horizontal-projectile-strobe.webp` | equal-time horizontal spacing and increasing vertical drop |
| 12.png | `public/assets/physics/textbook/ch01/1e/horizontal-projectile-velocity.webp` | velocity decomposition at a point on the projectile path |

Figure V2:
- figure 11 uses `hotspot-d-1` for horizontal spacing = constant.
- figure 11 uses `hotspot-d-2` for vertical spacing = increasing.
- figure 12 is inferential/explanatory and is not masked; it remains visible while the two figure questions are answered.

Unit data:
- `src/data/textbook/ch01/1e-horizontal-projectile.ts`
- `unitId: physics-1e-horizontal-projectile`
- `schemaVersion: 1.1`
- `sourcePages: [20, 21]`


## 1F app assets

| source figure | app asset | use |
|---|---|---|
| 13.png | `public/assets/physics/textbook/ch01/1f/oblique-projectile-trajectory.webp` | parabolic trajectory and velocity direction along the path |
| 14.png | `public/assets/physics/textbook/ch01/1f/oblique-projectile-components.webp` | horizontal/vertical velocity components and highest-point condition |

Figure V2:
- figure 14 uses `mask-d-1` linked to D-1 because the source image explicitly prints `v_y=0`.
- D-2 is an inline inferential question: horizontal velocity remains `一定のまま`.

Unit data:
- `src/data/textbook/ch01/1f-oblique-projectile.ts`
- `unitId: physics-1f-oblique-projectile`
- `schemaVersion: 1.1`
- `sourcePages: [22, 23, 24]`


## 1G app assets

| source figure | app asset | use |
|---|---|---|
| 15.png | `public/assets/physics/textbook/ch01/1g/gravity-vs-air-resistance.webp` | compare gravity-only fall with fall under upward air resistance |
| 16.png | `public/assets/physics/textbook/ch01/1g/drag-force-stages.webp` | force balance from initial fall through the approach to terminal velocity |
| 17.png | `public/assets/physics/textbook/ch01/1g/terminal-velocity-graph.webp` | velocity-time curve approaching terminal velocity |

Figure policy:
- no Figure V2 mask is required for the current 1G questions because D-1 and D-2 are inferential questions, not direct transcription of a printed answer label.
- figures 15–17 are deliberately kept in one reading subgroup so the learner can compare force evolution and the terminal-velocity graph without the UI hiding figure 17 after an intermediate answer.

Unit data:
- `src/data/textbook/ch01/1g-gravity-drag-terminal-velocity.ts`
- `unitId: physics-1g-gravity-drag-terminal-velocity`
- `schemaVersion: 1.1`
- `sourcePages: [25, 26, 27]`


## 2026-09-29 canonical archive identities

The source archives were re-verified from the actual uploaded ZIP bytes before P32. The earlier draft hashes were incorrect and are superseded by the values below.

| canonical archive | size | SHA256 | role |
|---|---:|---|---|
| `figure.zip` | 12,078,342 bytes | `b1d55eb94c13aa8ec91dbfd794dcbcbcec9c5a67ed8bdd692c397ad78d8b01e2` | canonical Chapter-1 figure PNGs (17 files) |
| `物理教科書モード_第1-5章_母版準拠_完全版.zip` | 50,419,544 bytes | `df1194b491d362c569018da15bc31e3583926a863af1f74b4842b033240e8eff` | mother-template/source packet (72 ZIP entries) |

Both archives passed ZIP integrity checks (`ZipFile.testzip() == None`).

### Persistent source location

The binary archives are persisted in the ChatGPT Library so future project sessions do not need to search Desktop machines or request re-upload first.

| archive | Library path | library_file_id |
|---|---|---|
| `figure.zip` | `/塾/kyotsu-step-web/source_archives/figure.zip` | `libfile_f62fe4c165d481919f798f2394918071` |
| `物理教科書モード_第1-5章_母版準拠_完全版.zip` | `/塾/kyotsu-step-web/source_archives/物理教科書モード_第1-5章_母版準拠_完全版.zip` | `libfile_14988b216fa48191beeff635f7c4c1f2` |

Future-agent rule:
1. read `CHATGPT_README_FIRST.md`,
2. read this manifest,
3. search the Library path above,
4. verify the exact size + SHA256 before use,
5. ask the user to upload again only if the persistent copy is genuinely unavailable or fails identity/integrity checks.

Do **not** search Desktop/Mac/Windows for these archives as the first step.

### Repaired asset provenance

The following app assets were regenerated from the canonical figure archive because the deployed WebPs were binary-truncated:

| source PNG | repaired app asset |
|---|---|
| `2 (2).png` | `1a/average-instantaneous-velocity.webp` |
| `3 (2).png` | `1a/curve-velocity-directions.webp` |
| `5.png` | `1b/velocity-composition.webp` |
| `11.png` | `1e/horizontal-projectile-strobe.webp` |
| `12.png` | `1e/horizontal-projectile-velocity.webp` |
| `13.png` | `1f/oblique-projectile-trajectory.webp` |
| `14.png` | `1f/oblique-projectile-components.webp` |

The canonical PNGs decoded normally. The repaired WebPs were decoded after conversion and are checked in CI for RIFF/WEBP header and declared payload-length integrity.

### GitHub binary-storage note

The GitHub connector available in this chat does not expose a local-file / Release-asset binary upload path. It can create Git blobs only when the full file bytes are provided as a text/base64 argument, which is not safe or practical for 12 MB and 50 MB ZIPs.

Therefore:
- the **app assets and source manifest are in GitHub**,
- the **canonical ZIP bytes are persisted in ChatGPT Library**,
- the exact identity bridge is the SHA256/size table above.

This limitation must not be misrepresented as “the ZIP binaries are committed to GitHub”.

## 2026-09-30 canonical live-figure restoration

The user explicitly required the live App to return to the original Library figures and rejected newly drawn substitute graphs/guides.

Canonical source authority remains:
- archive: `figure.zip`
- Library path: `/塾/kyotsu-step-web/source_archives/figure.zip`
- SHA256: `b1d55eb94c13aa8ec91dbfd794dcbcbcec9c5a67ed8bdd692c397ad78d8b01e2`
- figure count: 17

For this restoration the same archive was reconstructed from the persistent `source-archives` branch, its SHA256 was verified, and all 17 original PNGs were re-exported to the canonical App WebP paths. This is format conversion only; no diagram content was redrawn.

Source dimensions are preserved from the canonical PNGs (1448×1086 for most figures; Figures 5 and 7 are 1672×941).

Current live policy:
- exactly Figure 1–17,
- no additional generated guide/confirmation/graph in Chapter 1,
- every referenced live WebP must be >=1000×700 and structurally valid,
- prototype must contain no `source="generated-..."` figure directive,
- first textual `図N` reference must occur after the corresponding `fig-N` directive.

The one-time restoration workflow was removed after use. Permanent CI tests, not the restoration workflow, enforce the policy.

Validation: GitHub Actions run 222 / tested head `155a825f6058f06f42b9097e4e29092dad09818e` / SUCCESS through Pages deploy.



## 2026-10-02 approved educational figure exception — 1D v-t area derivation

The user explicitly approved adding one new educational representation because the canonical Chapter-1 archive does not contain the v-t graph required to understand the rectangle + triangle displacement derivation.

This asset is **not** a canonical textbook figure and does not replace Figures 9 or 10.

Identity:
- app asset: `public/assets/physics/textbook/ch01/1d/vt-area-derivation.svg`
- canvas: 1200 × 900
- format: SVG, so lines/text remain crisp on phone screens
- semantic content: user-approved v-t graph with rectangle + triangle area decomposition
- role: additive teaching representation for 1D constant-acceleration derivation
- approval: explicit user approval in live App review, 2026-10-02

Current figure policy is therefore:
- preserve all 17 canonical Library-derived figures unchanged in meaning,
- allow this one explicitly approved additive 1D educational graph,
- never silently replace a canonical source figure with a generated/redrawn image,
- any future non-canonical educational figure requires its own explicit pedagogical reason + user approval + provenance entry,
- all live figures remain subject to mobile readability and asset-integrity gates.

This section supersedes the older temporary rule “exactly Figure 1–17 and no additional graph” only with respect to this single approved additive representation.

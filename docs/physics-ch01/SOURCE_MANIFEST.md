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
| 1G | physics-1g-terminal-velocity | 重力加速度・空気抵抗・終端速度 | 25–27 | 15–17 |

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
- pedagogical reconstruction: supplied Word files
- chapter figures: supplied figure.zip
- application state/UI constraints: executable repository
- no synthetic substitute data when source content is available


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

Figure V2:
- figure 10 uses `hotspot-d-1` linked to item `d-1` for the meaning of `Δv`.
- figure 10 also uses `mask-d-2` linked to item `d-2` for the vector that determines the average-acceleration direction.

Unit data:
- `src/data/textbook/ch01/1d-acceleration.ts`
- `unitId: physics-1d-acceleration`
- `schemaVersion: 1.1`
- `sourcePages: [18, 19]`

# MATH PRACTICE 120 E2E PLAN

Status: PRE-IMPLEMENTATION

Goal:
120 の browser test を教材設計と同時に固定し、実装後に UI へ合わせてテストを弱めない。

## Entry

1. 基礎演習
2. 「条件から命題を読む」
3. 問題14を選択
4. heading = 「120｜文章から関数を作る」
5. nav = 1..14
6. current = 14

Problem stem checks:
- 「y を x の式で表せ」
- 「x の変域」
- 「底辺が 6 cm」
- 「15 km」
- 「時速 3 km」
- no KaTeX error

## (1) triangle

Stage p1-formula:
- current target says 「三角形の面積公式」
- future p1-model blank absent
- choose area-formula

Stage p1-model:
- compact dependency result = 三角形の面積公式
- before answer, flow must not contain final domain x>0
- choose three-x

Stage p1-domain-meaning:
- previous model derivation not shown by default
- learner identifies x as positive height and excludes zero
- choose positive-height

Stage p1-domain:
- dependency result = x の意味と境界
- before answer, no final interval text
- choose x-positive

Transition to (2):
- (1) long derivation disappears
- no convenience link to y=3x unless logically required

## (2) walk

Stage p2-distance-rule:
- current target asks distance relation
- no 3x / 15-3x / 5 leakage
- choose speed-times-time

Stage p2-traveled:
- dependency = 距離の関係
- choose three-x

Stage p2-model:
- dependency = x時間で進む距離
- choose fifteen-minus-three-x

Stage p2-start:
- no dependency on p2-model
- choose zero

Stage p2-end:
- must calculate finish time from 15/3
- choose five

Stage p2-domain:
- exactly two compact dependencies:
  - 始点
  - 終点
- choose zero-to-five-closed

Completion:
- 「この問題は完了です」
- page scrollWidth <= viewport + 1

## Leakage assertions

Before p1-domain:
- no x>0 final inequality

Before p2-model:
- no y=15-3x

Before p2-end:
- no final finish time 5 in active solution flow

Before p2-domain:
- no 0≤x≤5 final interval

## Mobile-specific

- no page-level horizontal overflow
- formula and units remain readable
- dependency list with two results at p2-domain fits without horizontal scroll
- no three consecutive large white cards for the short domain derivation

## Wrong-answer spot check

At least one browser path should intentionally choose a wrong option:
- p2-model: choose 15+3x
- assert no stage advance
- assert retry/hint appears
- retry correct fifteen-minus-three-x
- then stage advances

This spot check protects the rule:
wrong answer is not progress.

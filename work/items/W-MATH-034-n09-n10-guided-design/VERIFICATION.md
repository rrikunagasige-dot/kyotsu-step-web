## 2026-10-25 — implemented exact-source verification

Source `cb7d30bfe666b9123ea51e1fad7e36268507b674`, CI [40168250606](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/40168250606) SUCCESS. Both full four-width plays PASS (320/390/430/1440): N09 36 answers, 90 wrong options per width; N10 45 answers, 111 wrong options per width. Geometry, conditional prior results, all formulas, history/reload and actual legacy saves verified. N09 migrations v1/v2; N10 v1. Applicable learner620, dedicated9, authoring39 and build PASS. Frozen P001 inputs unchanged. Same-assistant actual image audit, not independent AI. Native R07/G2 passed for both. Existing Pages publication40168673785 is running; hosted success and user acceptance are not yet claimed. No new quality label or model fit.

---

# 設計検証

Status: PASS_BOUNDED / PROPOSED

| 対象 | 結果 | 証拠 |
|---|---|---|
| 原Word | N09 41block/37数式、N10 55block/25数式 | evidence/*_SOURCE_INDEX.json |
| 無番号説明を含むcoverage | 96/96、逆参照一致 | *_SOURCE_COVERAGE.json / evidence/*_COVERAGE_CHECK.json |
| 元図 | Word画像とbyte一致・実見 | evidence/FIGURE_PROVENANCE.json |
| 採点契約 | N09既存18・N10既存21のID/正答不変 | evidence/*_CURRENT.json / evidence/PROPOSAL_CHECKS.json |
| 本文/穴/依存 | N09 41node/36回答/11段階、N10 45node/45回答/12段階 | *_NODE_DESIGN.md/json |
| strict IR/compile | PASS、現行hashの構造検証 | evidence/*_VERIFY-IR.json / *_COMPILE-IR.json |
| 数理 | 19恒等式、厳密小数、floorと0<残り<1 | evidence/MATH_CHECK.json |
| 旧採点投影 | 部分診断として検査。旧本文の合格を主張しない | evidence/*_LEGACY_PROJECTION.json |
| 実工程 | production/2 R01–R04。生成火柴図は実台帳から | generated/ / evidence/*_RESULT.json |
| learner実装/実画面/配信 | NOT_RUN、未承認具体案の範囲 | PROPOSAL.md |
| N09/N10本人受入/学習 | NOT_RUN | 設計承認と品質評価を分離 |

N08の今回の本人受入・実学習はW033/LEARNING_RESULT.jsonおよび同じRuntimeの閉鎖記録に保存。N09/N10の品質判定へ流用していない。

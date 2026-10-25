# 作成・修正の配置図（実装定義から生成）

これは工程配置の投影であり、教材Workの実行済み証拠ではない。技術Workの実行はgenerated/snapshot.json。

## 作成

```mermaid
flowchart TD
  N0["S00_RECOVER / CODE"]
  N1["S01_ROUTE / CODE"]
  N2["C01_SOURCE / AI"]
  N3["C02_CONCEPT / AI"]
  N4["C03_PATTERN / AI"]
  N5["C04_SOLUTION / AI"]
  N6["C05_DESIGN / AI"]
  N7["C06_APPROVAL / USER"]
  N8["C07_BUILD / TOOL"]
  N9["C08_VERIFY / TOOL"]
  N10["C09_SEMANTIC / AI"]
  N11["G2_AUDIT / AI"]
  N12["G3_HOST / TOOL"]
  N13["G3_FINAL / USER"]
  N14["L01_LEARNING / AI"]
  N15["Z01_CLOSE / CODE"]
  N0 --> N1
  N1 --> N2
  N2 --> N3
  N3 --> N4
  N4 --> N5
  N5 --> N6
  N4 --> N6
  N2 --> N6
  N6 --> N7
  N7 --> N8
  N8 --> N9
  N9 --> N10
  N10 --> N11
  N11 --> N12
  N12 --> N13
  N13 --> N14
  N14 --> N15
```

| 工程 | 主担当 | 工程内のCODE機能 |
|---|---|---|
| S00_RECOVER | CODE | — |
| S01_ROUTE | CODE | — |
| C01_SOURCE | AI | source.fixed, source.import, source.coverage, research.ingest, research.analyze |
| C02_CONCEPT | AI | source.coverage, knowledge.ledger |
| C03_PATTERN | AI | case.retrieve, research.patterns |
| C04_SOLUTION | AI | math.solve, math.verify, solution.validate |
| C05_DESIGN | AI | teaching.plan, step.plan, blank.plan, prose.compose, text.verify, figure.verify, ir.verify, source.audit, novice.audit, interaction.plan, solution.review |
| C06_APPROVAL | USER | — |
| C07_BUILD | TOOL | ir.compile, render.solution |
| C08_VERIFY | TOOL | math.verify, ir.verify, browser.verify, protected.verify, solution.validate |
| C09_SEMANTIC | AI | source.audit, novice.audit, solution.review |
| G2_AUDIT | AI | protected.verify, impact.inventory |
| G3_HOST | TOOL | release.verify |
| G3_FINAL | USER | — |
| L01_LEARNING | AI | case.finalize, ml.train |
| Z01_CLOSE | CODE | — |

AIが主担当の工程でもCODE receiptを先に取り込み、意味の判断は根拠付きで別提出する。USERは依頼・既承認・実物評価。TOOLは既存実装/公開操作で、CODEによる意味の自動合格ではない。

## 修正

```mermaid
flowchart TD
  N0["S00_RECOVER / CODE"]
  N1["S01_ROUTE / CODE"]
  N2["R01_CAPTURE / AI"]
  N3["R02_CAUSE / AI"]
  N4["R03_IMPACT / AI"]
  N5["R04_PROPOSAL / AI"]
  N6["R05_APPROVAL / USER"]
  N7["R06_PATCH / TOOL"]
  N8["R07_VERIFY / TOOL"]
  N9["R07_SEMANTIC / AI"]
  N10["G2_AUDIT / AI"]
  N11["G3_HOST / TOOL"]
  N12["G3_FINAL / USER"]
  N13["R03_IMPACT_SWEEP / AI"]
  N14["R08_CAPTURE_LEARNING / AI"]
  N15["L01_LEARNING / AI"]
  N16["Z01_CLOSE / CODE"]
  N0 --> N1
  N1 --> N2
  N2 --> N3
  N3 --> N4
  N4 --> N5
  N5 --> N6
  N6 --> N7
  N7 --> N8
  N8 --> N9
  N9 --> N10
  N10 --> N11
  N11 --> N12
  N12 --> N13
  N4 --> N13
  N13 --> N14
  N9 --> N14
  N14 --> N15
  N15 --> N16
```

| 工程 | 主担当 | 工程内のCODE機能 |
|---|---|---|
| S00_RECOVER | CODE | — |
| S01_ROUTE | CODE | — |
| R01_CAPTURE | AI | source.fixed, feedback.capture |
| R02_CAUSE | AI | case.retrieve, knowledge.ledger, math.verify, ir.verify, source.audit, novice.audit, math.solve, solution.validate |
| R03_IMPACT | AI | impact.inventory |
| R04_PROPOSAL | AI | math.solve, math.verify, teaching.plan, step.plan, blank.plan, prose.compose, text.verify, figure.verify, ir.verify, source.audit, novice.audit, solution.validate, interaction.plan, solution.review |
| R05_APPROVAL | USER | — |
| R06_PATCH | TOOL | ir.compile, render.solution |
| R07_VERIFY | TOOL | math.verify, ir.verify, browser.verify, protected.verify, solution.validate |
| R07_SEMANTIC | AI | source.audit, novice.audit, solution.review |
| G2_AUDIT | AI | protected.verify, impact.inventory |
| G3_HOST | TOOL | release.verify |
| G3_FINAL | USER | — |
| R03_IMPACT_SWEEP | AI | impact.inventory |
| R08_CAPTURE_LEARNING | AI | case.finalize |
| L01_LEARNING | AI | case.finalize, ml.train |
| Z01_CLOSE | CODE | — |

AIが主担当の工程でもCODE receiptを先に取り込み、意味の判断は根拠付きで別提出する。USERは依頼・既承認・実物評価。TOOLは既存実装/公開操作で、CODEによる意味の自動合格ではない。

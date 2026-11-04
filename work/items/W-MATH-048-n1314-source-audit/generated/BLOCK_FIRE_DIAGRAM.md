# ブロック火柴図（GENERATED）

台帳HEAD: `e816a11b8ecc2cef3964663e682060c045f4a462394c71ac010c2b5a355d2571`

```mermaid
flowchart TD
  N0["S00_RECOVER / CODE / PASSED"]
  N1["S01_ROUTE / CODE / PASSED"]
  N2["R01_CAPTURE@n13 / AI / PASSED"]
  N3["R02_CAUSE@n13 / AI / PASSED"]
  N4["R03_IMPACT@n13 / AI / PASSED"]
  N5["R04_PROPOSAL@n13 / AI / PENDING"]
  N6["R05_APPROVAL@n13 / USER / PENDING"]
  N7["R06_PATCH@n13 / TOOL / PENDING"]
  N8["R07_VERIFY@n13 / TOOL / PENDING"]
  N9["R07_SEMANTIC@n13 / AI / PENDING"]
  N10["R01_CAPTURE@n14 / AI / PENDING"]
  N11["R02_CAUSE@n14 / AI / PENDING"]
  N12["R03_IMPACT@n14 / AI / PENDING"]
  N13["R04_PROPOSAL@n14 / AI / PENDING"]
  N14["R05_APPROVAL@n14 / USER / PENDING"]
  N15["R06_PATCH@n14 / TOOL / PENDING"]
  N16["R07_VERIFY@n14 / TOOL / PENDING"]
  N17["R07_SEMANTIC@n14 / AI / PENDING"]
  N18["G2_AUDIT@n13 / AI / PENDING"]
  N19["G3_HOST@n13 / TOOL / PENDING"]
  N20["G3_FINAL@n13 / USER / PENDING"]
  N21["R03_IMPACT_SWEEP@n13 / AI / PENDING"]
  N22["R08_CAPTURE_LEARNING@n13 / AI / PENDING"]
  N23["L01_LEARNING@n13 / AI / PENDING"]
  N24["G2_AUDIT@n14 / AI / PENDING"]
  N25["G3_HOST@n14 / TOOL / PENDING"]
  N26["G3_FINAL@n14 / USER / PENDING"]
  N27["R03_IMPACT_SWEEP@n14 / AI / PENDING"]
  N28["R08_CAPTURE_LEARNING@n14 / AI / PENDING"]
  N29["L01_LEARNING@n14 / AI / PENDING"]
  N30["Z01_CLOSE / CODE / PENDING"]
  N18 --> N19
  N24 --> N25
  N20 --> N21
  N26 --> N27
  N19 --> N20
  N25 --> N26
  N23 --> N30
  N29 --> N30
  N2 --> N3
  N10 --> N11
  N3 --> N4
  N11 --> N12
  N4 --> N21
  N4 --> N5
  N12 --> N27
  N12 --> N13
  N21 --> N22
  N27 --> N28
  N5 --> N13
  N5 --> N6
  N5 --> N14
  N13 --> N6
  N13 --> N14
  N6 --> N7
  N14 --> N15
  N7 --> N8
  N15 --> N16
  N9 --> N18
  N9 --> N22
  N17 --> N24
  N17 --> N28
  N8 --> N9
  N16 --> N17
  N22 --> N23
  N28 --> N29
  N0 --> N1
  N1 --> N2
  N1 --> N10
```

現在: R04_PROPOSAL@n13 / READY

## 主担当と2 subagent（同じsnapshot）

| node | 担当 | 役割 | 対象 | 状態 |
|---|---|---|---|---|
| — | M / A / B | 未割当 | 必須scopeは各nodeのteam_requirementsを参照 | 未実行 |

CODE: 担当・packet・対象hash・非作者・未解決を検査。AI: 原資料・数学・教え方・実表示を審査。USER: 具体案承認と実アプリ評価。
役割交代は作者履歴を消さない。差戻しは元工程への改訂taskとして記録。

finding記録: 0

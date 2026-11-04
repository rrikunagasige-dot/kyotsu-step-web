# 全体火柴図（GENERATED）

台帳HEAD: `e816a11b8ecc2cef3964663e682060c045f4a462394c71ac010c2b5a355d2571`

```mermaid
flowchart TD
  N0["S00_RECOVER 1/1"]
  N1["S01_ROUTE 1/1"]
  N2["n13:design 3/5"]
  N3["APPROVAL:proposal 0/2"]
  N4["n13:release 0/5"]
  N5["n14:design 0/5"]
  N6["n14:release 0/5"]
  N7["n13:learning 0/3"]
  N8["n14:learning 0/3"]
  N9["Z01_CLOSE 0/1"]
  N3 --> N2
  N3 --> N5
  N0 --> N1
  N1 --> N2
  N1 --> N5
  N2 --> N3
  N2 --> N7
  N2 --> N4
  N2 --> N5
  N7 --> N9
  N4 --> N7
  N5 --> N3
  N5 --> N8
  N5 --> N6
  N8 --> N9
  N6 --> N8
```

現在: R04_PROPOSAL@n13 / READY
保留・修正queue: 9
関連修正Work: —
差戻しは再分析・失効・子Workの台帳イベントで記録し、実行依存へ循環を入れない。

## 主担当と2 subagent（同じsnapshot）

| node | 担当 | 役割 | 対象 | 状態 |
|---|---|---|---|---|
| — | M / A / B | 未割当 | 必須scopeは各nodeのteam_requirementsを参照 | 未実行 |

CODE: 担当・packet・対象hash・非作者・未解決を検査。AI: 原資料・数学・教え方・実表示を審査。USER: 具体案承認と実アプリ評価。
役割交代は作者履歴を消さない。差戻しは元工程への改訂taskとして記録。

finding記録: 0

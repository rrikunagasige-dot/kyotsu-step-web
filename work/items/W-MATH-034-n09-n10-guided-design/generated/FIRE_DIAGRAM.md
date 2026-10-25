# 全体火柴図（GENERATED）

台帳HEAD: `8e97767feb584e39604aff63bf75c9174f36cecf31cdc1d4b85ac1342af203d5`

```mermaid
flowchart TD
  N0["S00_RECOVER 1/1"]
  N1["S01_ROUTE 1/1"]
  N2["n09:design 5/5"]
  N3["APPROVAL:proposal 2/2"]
  N4["n09:release 4/5"]
  N5["n10:design 5/5"]
  N6["n10:release 4/5"]
  N7["n09:learning 0/3"]
  N8["n10:learning 0/3"]
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

現在: G3_FINAL@n09 / WAITING
保留・修正queue: 1
関連修正Work: —
差戻しは再分析・失効・子Workの台帳イベントで記録し、実行依存へ循環を入れない。

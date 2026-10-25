# 全体火柴図（GENERATED）

台帳HEAD: `922e6099790070520b72960e2058854b0cbf55f64d74f5edeeb6a402f92bb1cd`

```mermaid
flowchart TD
  N0["S00_RECOVER 1/1"]
  N1["S01_ROUTE 1/1"]
  N2["ne02:design 5/5"]
  N3["APPROVAL:proposal 3/3"]
  N4["ne02:release 0/5"]
  N5["n11:design 5/5"]
  N6["n11:release 0/5"]
  N7["n12:design 4/5"]
  N8["n12:release 0/5"]
  N9["ne02:learning 0/3"]
  N10["n11:learning 0/3"]
  N11["n12:learning 0/3"]
  N12["Z01_CLOSE 0/1"]
  N3 --> N5
  N3 --> N7
  N3 --> N2
  N0 --> N1
  N1 --> N5
  N1 --> N7
  N1 --> N2
  N5 --> N3
  N5 --> N10
  N5 --> N6
  N5 --> N7
  N10 --> N12
  N6 --> N10
  N7 --> N3
  N7 --> N11
  N7 --> N8
  N11 --> N12
  N8 --> N11
  N2 --> N3
  N2 --> N5
  N2 --> N9
  N2 --> N4
  N9 --> N12
  N4 --> N9
```

現在: — / BLOCKED
保留・修正queue: 4
関連修正Work: —
差戻しは再分析・失効・子Workの台帳イベントで記録し、実行依存へ循環を入れない。

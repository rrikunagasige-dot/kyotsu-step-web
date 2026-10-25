# 全体火柴図（GENERATED）

台帳HEAD: `f7e1319745ec85a9704e5df897248c93fe95b38325a2d02e7176ffb5e3b4b29e`

```mermaid
flowchart TD
  N0["S00_RECOVER 1/1"]
  N1["S01_ROUTE 1/1"]
  N2["n09:design 5/5"]
  N3["APPROVAL:proposal 2/2"]
  N4["n09:release 3/5"]
  N5["n10:design 5/5"]
  N6["n10:release 3/5"]
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

現在: — / BLOCKED
保留・修正queue: 5
関連修正Work: —
差戻しは再分析・失効・子Workの台帳イベントで記録し、実行依存へ循環を入れない。

# 全体火柴図（GENERATED）

台帳HEAD: `0d104d0b2bef18d1f51d65851951b1959bf25d8601dcb5d16ab6a08a5f66eadf`

```mermaid
flowchart TD
  N0["S00_RECOVER 1/1"]
  N1["S01_ROUTE 1/1"]
  N2["n07:design 5/5"]
  N3["APPROVAL:proposal 1/1"]
  N4["n07:release 5/5"]
  N5["n07:learning 3/3"]
  N6["Z01_CLOSE 1/1"]
  N3 --> N2
  N0 --> N1
  N1 --> N2
  N2 --> N3
  N2 --> N5
  N2 --> N4
  N5 --> N6
  N4 --> N5
```

現在: — / DONE
保留・修正queue: 0
関連修正Work: —
差戻しは再分析・失効・子Workの台帳イベントで記録し、実行依存へ循環を入れない。

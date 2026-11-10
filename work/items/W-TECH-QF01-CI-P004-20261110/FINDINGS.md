# Findings
F-001 CONFIRMED: 実CIの旧test期待値が既承認現データと不一致。旧版を既存fixtureに保持し、現行版も検査する具体案にした。
F-002 CONFIRMED: namespace固定testが実CIのVITE_STORAGE_NAMESPACE設定に追従していない。実storeの保存先を検査に用いる。
F-003 CONFIRMED: firstSection旧597段落のうち288は分割/mathtype変更、269は連結同内容、19は受入済み文面差。19を逐対literal限定し、未listed309段落と旧mathpartsを厳密保持。
F-004 CONFIRMED: P001注記済みN07提案は元whole-file approval guardを通らない。既承認envelope/full/prefix/bodyのみ認識して原照合を維持する。
F-005 OBSERVED: N12 v1短caseは実CI合計30秒切れ。準備2行案の実ブラウザ効果はUNVERIFIED。旧35穴/現46判断の両幅は実CI成功。
F-006 LIMIT: local browser install/launch失敗を保存。実CIと同一OSや最終CI成功を主張しない。
F-007 AUTHORITY: P003は固定16patch、P004は固定7patch。元adapter/Work OSは正確承認を要求する。現在P004未承認・native未open。
F-008 CONTINUATION: 新P004が全検証後DONEなら既存rootrequest/原issueを原APIで解決可能。旧P003を再bindせずFAILEDを保持。旧P002別requestは未解決記録のまま。

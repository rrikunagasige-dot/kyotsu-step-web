# W047 工程入口

着手・完了時は [生成現在地](generated/CURRENT_POSITION.md) → [実行火柴図](generated/FIRE_DIAGRAM.md) → [機能配置図](generated/CAPABILITY_FIRE_DIAGRAM.md) の順で確認。図の出所は既存W032 shared StoreとW047固定plan。別Storeや模擬状態図を作らない。

R01再現→R02原因→R03事前影響→R04具体案→R05本人承認→R06限定修正→R07検証・非作者意味審査→G2横断→G3既存Pages/本人実物→事後影響/事例→終了照合。main WORK_SYSTEM§11/12Aの具体案承認・細部確認・公開権限を保持する。実行器のWork版P004をmain採用済みとは記さない。

詳細はworkflow/INTEGRATION_RUNBOOK.md、team/1受渡しはworkflow/TEAM_PROTOCOL.md。既存CODE位置はworkflow/capabilities.py。今回の実入力adapterはadvance_review.py、承認前の非製品候補入力はprepare_candidates.py、stateless検査はcheck_candidates.mjs。これらは既存engineを呼ぶ入力接続で、新しいworkflow engineではない。

R04の現候補では、Mが各本文・操作境界を統合、A/Bが自分の作者箇所以外を審査し、team transportのpacket→assignment→原報告→collectionを既存CODEで照合する。CODE FAIL・未知・未提出をPASSにせず、課題発行を完了としない。

次は実台帳のnextを優先。具体案の承認前にはsrcを変更しない。


2026-11-04 G3 checkpoint：技術W-TECH-052はT04/L01/Z01 DONE、親nextはG3_HOST@n11。生成図の同じ台帳HEADをAが監視。具体main反映・既存Pages公開はG3_PUBLICATION_REQUEST.mdで次の許可を確認する段階。実公開・本人最終受入は未記録。

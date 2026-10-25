# Verification

Status: ANALYSIS_VERIFIED / learner correction unimplemented

- source4fb7a98eのN07 bytesと現在のartifact: 一致。
- 原Word SHA93827322、44 paragraph索引: 一致。OMMLはXMLを保持し、平文の34/2311等を分数そのものと誤認しない。
- 六画像: 既存登録のhashと一致、全て視覚確認。
- 全41node/36item/14stage、原問14件と無番号説明のsource coverage: 現行codeでPASS。
- (10−1)x=9xと(100−1)x=99x: 既存bounded solverでPASS。誤った係数10/100を入れた対照はFAIL。
- 倍率: Q06では10/100/1000がいずれも整列し、定義域内の最小は10。Q09では10不整列、100整列、1000不整列。
- 41nodeのbefore/after partsは元のsourceTextを復元できる。Q06/Q09のbeforeだけは原Wordの条件を復元した改訂案。正式な定義位置9箇所。
- legacy artifact→production IR検査はSCHEMA FAIL。これを新形式への移行済みや教材の数学不正とは報告しない。

未実施: 修正候補の正式IR compile、アプリ実装、修正後のDOM/UI QA、回帰・公開、ユーザー受入、事後impact sweep、モデルの再fit。

# P004-QUEUE-PROBE — 現在地（GENERATED）

状態: PROPOSED / 内部: BLOCKED / 次: —

台帳HEAD: `741856ad951dd9a7db691d15086ebc18045dbcc5b0ff404a767c7f4c76b50fcb`
候補SHA: `78986acf513f7b68424a9805babbd802ec97f40b`

模擬実行: False。アプリ受入: False。技術試験合格だけで教材の品質は確定しない。

| Node | 担当 | 状態 | 依存 |
|---|---|---|---|
| S00_RECOVER | CODE | PENDING |  |
| S01_ROUTE | CODE | PENDING | S00_RECOVER |
| C01_SOURCE@metadata | AI | PENDING | S01_ROUTE |
| C02_CONCEPT@metadata | AI | PENDING | C01_SOURCE@metadata |
| C03_PATTERN@metadata | AI | PENDING | C02_CONCEPT@metadata |
| C04_SOLUTION@metadata | AI | PENDING | C03_PATTERN@metadata |
| C05_DESIGN@metadata | AI | PENDING | C04_SOLUTION@metadata, C03_PATTERN@metadata, C01_SOURCE@metadata |
| C06_APPROVAL@metadata | USER | PENDING | C05_DESIGN@metadata |
| C07_BUILD@metadata | TOOL | PENDING | C06_APPROVAL@metadata |
| C08_VERIFY@metadata | TOOL | PENDING | C07_BUILD@metadata |
| C09_SEMANTIC@metadata | AI | PENDING | C08_VERIFY@metadata |
| G2_AUDIT@probe | AI | PENDING | C09_SEMANTIC@metadata |
| G3_HOST@probe | TOOL | PENDING | G2_AUDIT@probe |
| G3_FINAL@probe | USER | PENDING | G3_HOST@probe |
| L01_LEARNING@probe | AI | PENDING | G3_FINAL@probe |
| Z01_CLOSE | CODE | PENDING | L01_LEARNING@probe |

待機理由: CORRECTION_FIRST

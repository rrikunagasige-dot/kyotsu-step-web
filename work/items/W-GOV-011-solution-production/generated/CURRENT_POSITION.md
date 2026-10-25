# W-GOV-011 — 現在地（GENERATED）

状態: DONE / 内部: DONE / 次: —

台帳HEAD: `d8ea12e8c6563435da5e8bb71d72b11b27b39c116a0ae82a2cc7cf1ae29bdcd8`
候補SHA: `c4eff5a295c88b28c4147a72648f877c65a05da1`

模擬実行: False。アプリ受入: False。技術試験合格だけで教材の品質は確定しない。

| Node | 担当 | 状態 | 依存 |
|---|---|---|---|
| S00_RECOVER | CODE | PASSED |  |
| S01_ROUTE | CODE | PASSED | S00_RECOVER |
| T01_ANALYSIS | AI | PASSED | S01_ROUTE |
| T02_APPROVAL | USER | PASSED | T01_ANALYSIS |
| T03_BUILD | TOOL | PASSED | T02_APPROVAL |
| T04_VERIFY | TOOL | PASSED | T03_BUILD |
| L01_LEARNING | AI | PASSED | T04_VERIFY |
| Z01_CLOSE | CODE | PASSED | L01_LEARNING |

待機理由: 全工程の有効な証拠を照合

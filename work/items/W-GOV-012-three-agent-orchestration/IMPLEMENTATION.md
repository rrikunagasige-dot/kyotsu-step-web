# W-GOV-012 — 作成／修正の共通基盤を実装

状態: IMPLEMENTED / LOCAL_VERIFIED。新規教材Workはproduction/2＋team/1。既存Workは承認付きpolicy移行で履歴を保持する。N08のactive教材・保存・公開版は変更していない。

## 実装した機能

- M＋2子agentのtask、原harness報告、担当、作者履歴、現target、review、完了照合を同じStoreへ結合。
- claim改名・役割交代・G2への移動で作者履歴を消さず、自己審査を独立PASSにしない。
- 古い対象hash、別blockの指摘解決、未完了／取消resolver、未解決省略を拒否。late findingで既存PASSを再開。
- authorはincoming原資料から着手し、reviewerは生成後の固定targetを審査。相互待ちの循環を作らない。
- 型付き式中部品、部分回答、親単位の採点、入力に従う残り項の導出。実行時に有限候補をSymPyで検算。対応外・予算超過はUNSUPPORTED。
- layoutの三状態、文章role、字号・等号・中心・余白・番号・操作領域・切れと重なりの測定契約。
- IR／construction／layout／learnerCopyを同じcompiled成果物へ束縛。必須hashの省略を拒否。
- 行・部品・状態・画像・寸法に対応するAI意味審査。CODE PASSだけで教材品質を確定しない。
- 可視学習入力v3は実寸法を保持し、未来答えと評価を拒否。agent合意の自動Gold化、新schemaの旧model混入を防止。
- 三階層の火柴図を同じsnapshotから生成し、担当・役割・状態・finding履歴を付記。

運用仕様: workflow/TEAM_PROTOCOL.md、workflow/INTEGRATION_RUNBOOK.md。標準方針: governance/TEAM_POLICY.json。

## 適用境界

既存の作成／修正入口とUSERの具体案承認／実アプリ評価を保持。画像票承認や第三の制作入口は追加していない。

N08の39node・33親・15部品・元38segmentを扱う設計materializerは検査・生成用に実装したが、r6教材・新reader・保存移行・公開への適用は後段。5つの非group親はstandaloneとして明示し、group-only previewを全単元の実UI検査と呼ばない。

harness記録は追跡可能な転記・構造照合であり、OS権限分離・暗号学的実行証明・モデル独立性ではない。ML本番採用・既存catalog/weightsの変更・本番の追加fitは行っていない。

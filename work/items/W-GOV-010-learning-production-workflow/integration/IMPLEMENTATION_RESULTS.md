# P-004 作成・修正への統合結果

Status: LOCAL_VERIFIED / 初回CI40114657817は成功。追加の原資料再取込・ML失敗処理・route照合を含む最終固定SHAのCI待ち。

ユーザーの「可以可以那就来做做看把」を、P-004具体設計への実装承認として記録した。P-003の既存機能を、作成・修正のそれぞれの工程へ組み込んだ。

## 実装したこと

| 工程 | 結果 | 主な実装 |
|---|---|---|
| I01 | C/R別・block別のDAG、bundleとrelease unitの分離、旧版保持 | `workflow/graphs.py`、definitions |
| I02 | 既存取込・solver・IR・組版・図表・監査・事例・MLをcapabilityとして共用。phase/input/実装hash付きreceiptとAI契約 | capabilities、integration、runner、contracts |
| I03 | Store外の六指摘、未完了Work、未Work化依頼もqueueへ。事前/事後impact、子Work対応、同一原因・対象・版の重複停止 | requests、impact、Runtime |
| I04 | 表示属性だけの変更で解法・意味の設計・承認を保持。数学変更はfact依存先へ。共有bundleでも設計が詰まらず、承認を再利用 | Runtime、integration。既存Node jobsを保持し、主工程をまたぐ再利用は同じStoreのcapability cacheで管理 |
| I05 | unit別QA・既存公開先・exact SHAの実物受入、一次公開可否と関連修正完了を分離。親承認＋検証済み子差分の合成。自Work内issueの検証付き閉鎖 | Runtime、adapters、integration |
| I06 | 全体・block・機能の三階層火柴図を同じsnapshot/台帳HEADから生成 | views、CLI |
| I07 | 明示移行、旧成果物を再利用候補として提示、完全一致する旧承認の引継ぎ。旧S工程PASSをR02/R03へ転用しない | migrations、runbook、canonical pointerはCI成功後に更新 |

実行入口とJSON属性・受入・再開の手順は [INTEGRATION_RUNBOOK.md](../../../../workflow/INTEGRATION_RUNBOOK.md)。

## 火柴図

| 対象 | 全体 | ブロック | 内部機能 |
|---|---|---|---|
| 作成の模擬実行 | [全体](evidence/creation/FIRE_DIAGRAM.md) | [block](evidence/creation/BLOCK_FIRE_DIAGRAM.md) | [capability](evidence/creation/CAPABILITY_FIRE_DIAGRAM.md) |
| 修正の模擬実行 | [全体](evidence/correction/FIRE_DIAGRAM.md) | [block](evidence/correction/BLOCK_FIRE_DIAGRAM.md) | [capability](evidence/correction/CAPABILITY_FIRE_DIAGRAM.md) |
| 実registryとのqueue照合 | [全体](evidence/actual-queue/FIRE_DIAGRAM.md) | [block](evidence/actual-queue/BLOCK_FIRE_DIAGRAM.md) | [capability](evidence/actual-queue/CAPABILITY_FIRE_DIAGRAM.md) |

作成・修正とも二block、二release unit、一つの承認で最後まで模擬実行できた。両blockの設計後に承認を照合し、最初のunitの実物確認を、次unitの実装より前に置けた。この模擬承認・模擬app受入を、実教材の受入とは扱っていない。

実registry照合ではN07のF01–F06をすべて検出し、作成に`CORRECTION_FIRST`を返した。実行途中の承認と成果物を消さずに保留する。

## 学習の接続

受信した指摘は即時保存し、R08で修正と回帰へ、L01で重複を除いたcatalogへ対応させる。curation入力があれば既存の観点別corpusコードを実行し、training examplesは実際に確定したcatalogから再生成する。任意のlabel配列への差替えは拒否する。新しいGold labelには元評価の根拠を要求する。

データが未指定・不足ならNOT_TRAINABLEを記録できる。学習ジョブの実行失敗は、生の失敗を保存してREJECTEDとし、学習成功とは呼ばない。学習成功を教材閉鎖の条件にしない。今回、モデルの再フィット・本番採用は行っておらず、既存モデルはOFFLINE_ONLYのまま。

## 検証の区別

1. 自動試験: 既存78件＋追加41件、合計119 workflow試験。 C/Rの違い、承認待ちの詰まり、属性別失効、事例・版・phase、子修正と復帰、旧版移行、偽receipt、受入と品質評価の分離を検証。
2. 模擬フロー: 既存サービスの一部をfixtureで置換した制御試験。教育上の正しさや実教材受入は証明しない。
3. 実adapter: 実際の元資料manifest、`(10−1)x=9x`の検証、誤等式のFAIL、既存IR compilerを読取専用で実行。工程の承認や公開とは別のisolated probe。
4. アプリ回帰: 既存learner試験・ビルドと、CIでの四幅操作検査。

局所的なsource/compile実行記録は [READ_ONLY_PROBE.json](evidence/READ_ONLY_PROBE.json)、フローの順序とqueue結果は [INTEGRATION_RECEIPTS.json](evidence/INTEGRATION_RECEIPTS.json)。ローカルprobeのsource SHAは原資料を固定した開始commit、実装の版は各receiptのimplementation hashを参照する。CIは保存した実装commitに対して再実行する。

共有する一つのファイル内に複数blockがある場合、ファイル差分の影響は保守的に全該当blockへ扱う。意味的なJSON部分一致を推測して承認を拡大しない。初学者にとって説明が通じるか、穴が何を考えさせるかは、原資料と可視状態に基づくAI審査を続ける。

公開教材・第一タイトル・N07本文・回答ID・保存進捗・他モードを編集していない。公開先は引き続き4fb7a98e版。今回の成果物は教材変更ではなく、次の作成・修正を実行する基盤と入口である。

最終照合で、source属性の修正時のR01再取込・coverage、R02で必要な完全解法、宣言外sourceの拒否、ML失敗モデルの棄却と再試行、unitの確認routeとURLの一致を補い、回帰試験へ追加した。

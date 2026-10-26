# W-MATH-040 — N08 r6への適用

Status: VERIFYING

承認済みP001を共通基盤へ適用。固定source e7320590d4af51b7cc0d9faa918485467092a3c0、branch work/n08-construction-application-20261026。CMD-WORK-001、production/2、team/1、construction-layout/1。Mは統合/Store/公開、Aはmath/data/save、BはUI、A/B相互に非作者審査。

原39node/38segment、旧22回答を保持し、11親15部品へ変更。33親完了判定、三状態・18px整列・現末行番号・旧4/5比較・旧保存を検証。R01〜R06/R07/G2 PASS。既存Pages publisher cfd0ff8fで反映し、public release.jsonの同source/revision6/namespaceを確認。公開後全操作・旧版・保護対象を検証しG3_HOST PASS。現在G3_FINAL@n08で本人評価待ち。

Do Not Touch: 旧r4/r5 leaf/reader/CSS、N11 leaf/表示plan、他科目、既存namespace、既存モデルのOFFLINE_ONLY。原提案全文と原評価をこの公開要約で置き換えない。


## 2026-10-26 公開後の実検証

公開run40299824089 SUCCESS（publisher cfd0ff8f、アプリsource e7320590）。実HTTPのrelease.jsonと公開入口200を照合。公開N08は320/390/430/1440で22旧回答＋11親15部品、69誤答候補、途中保存・再読込・履歴・旧34記録保全・旧版比較・配置PASS。旧r5全34/80、N09/N10表示、N11全39/109×4幅・旧保存1〜10もPASS。実artifact12640421671 sha256 b6b0a05694c8e514f58b16c1d5942e30e9120f62c7adbfcf5493f52bf11b3a8eを取得・照合。正式G3_HOST PASS、G3_FINALの本人評価待ち。本人受入・Gold・追加fitは生成していない。記録欠落10件は補完しRepository Governance Check40300779836 SUCCESS。以前の失敗を成功へ書き換えていない。

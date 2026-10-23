# 2単元25問と章全体 — 最終技術検査

Status: CROSS-VERIFIED / 新規25問のユーザー視覚確認待ち。
固定教材SHA: `3055ed71b25057b80b85d46b1d219f1005d0a35d`。PR #127。

## 完了した作業
承認済みP005の三次式13問・二重根号12問を実装し、途中説明・全選択肢・誤答理由・ヒント・正答後の完成式を検査。既存14単元の実行時教材データ（正答・選択肢を含む）は直前版と完全一致。

分数の数値分母が旧集合正規化で括弧へ変わる不具合はN07 Q08、N10 Q16、NE02 Q10/Q12に限定して修正。16単元の分数選択肢74件を照合。さらに実画像で単一行の完成式だけ修正済み値を迂回する不具合を発見し、TextbookFormulaで整形済みlines[0]を描画するよう修正した。元回答・採点文字列を保持。完成式コンポーネントの実MathMLと実ブラウザの分母検査を追加。初回画像の不具合は最終画像と区別し、旧PASSを視覚PASSへ読み替えない。

## 最終SHAの検証

| 検査 | 結果・根拠 |
|---|---|
| 教材全体回帰 | 単体255件・実ブラウザ257件 SUCCESS。[run](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39941458484) |
| 新規25問＋全16単元専用 | 単体138件・実ブラウザ85件 SUCCESS。[run](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39941458834)。85 skippedは画面幅ごとの重複防止で成功件数に含めない。単体件数は全回帰と重なるため足し合わせない。 |
| 練習モード | 単体95件・実ブラウザ72件 SUCCESS。[run](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39941458486) |
| 全章対応 | 16単元・原問233問・315操作・999選択肢・298数式。[対応集計](evidence/3055/coverage-summary.json) |
| 表示寸法 | 320/390/1440px ×16単元、945操作幅ケース、誤答時と正答後の1728寸法チェックで横見切れ0。[集計](evidence/3055/geometry-summary.json) |
| 誤答の数学 | 三次式26候補・二重根号24候補を厳密計算・条件・符号で反証。既存形指定も保持。 |
| 画像 | 新規25問×誤答時/正答後=50枚。全画像を目視点検、元PNGと保存Git blobのSHA1一致50/50。教材DOM/CSSの改変なし、固定ナビがかぶらない実viewportで撮影。[撮影run](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39941479789)、[出所](evidence/3055/capture-source.json) |

## 確認票と残り
[全25問の実画像・確認①](GATE1_ALL25_AUTHENTIC_REVIEW.md)。既存14単元の承認を取り直さない。今回の25問はユーザー視覚確認前なのでBLOCK-CHECK-PENDING。技術検査をユーザー受入と混同しない。

最終の実アプリ通し確認は未完。mainの公開版SHA `15ae503455bc6ae75b080caa1c4919cafb250027` は今回の教材SHAと異なり、既存Pagesを今回の総チェック用URLとして渡してはならない。既定WORK_SYSTEM §12A Gate③の通り、Gate①受入後に公開権限を確認し、一致する候補版の実働URLを検証して提示する。新たなmain統合・公開は未実施。現時点のGate③はFINAL-REVIEW-NOT-READY、総チェックOKは未取得。

FRACTION_REPAIR_CONTINUATION_20261023.mdの実行中記録は履歴として保存。この最終SHA・実結果を現在地として優先する。MR17に追加される再利用教訓は、選択肢の表示関数だけでなく単一行完成式の実コンポーネントまで検査すること。既存「全表示面」「完成式」規則の具体化であり、新しい作業フローは作らない。

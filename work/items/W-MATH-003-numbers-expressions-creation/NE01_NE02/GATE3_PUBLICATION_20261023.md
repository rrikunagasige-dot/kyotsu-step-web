# 総チェック用候補版の公開

Status: VERIFYING / FINAL-REVIEW-NOT-READY（実URL検証前）

## 公開許可
ユーザーへ「検証済み候補版を既存のGitHub Pagesへ公開してよいですか。現在の公開アプリを候補版へ置き換える」と具体的に質問し、2026-10-23 JSTに「いいよ」を受領。今回の候補版の公開許可として記録。最終の総チェックOKとは別。

## 固定対象
- 視覚承認・全章検査済み教材: `3055ed71b25057b80b85d46b1d219f1005d0a35d`
- 配信するアプリソース: `171c04781f32c1286a0762905891b582714834f9`
- 差分: useAppStoreの保存キーをビルド環境から任意指定可能にする変更だけ。通常ビルドは元のkyotsu-step-storeを保持。公開候補版はkyotsu-step-gate3-math-20261023を使用。教材・説明・答え・選択肢・ヒント・16単元構成は3055と完全一致することを配信前に検査。
- mainの変更: 配信workflowのみ。教材ソースをmainへまとめてmergeする操作は実施しない。
- 公開workflow commit: `e907bf5fc22025fbd74127b9b72176b90aaeb36e`
- 実run: https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39946760582
- 公開後検証harness: `cf64754827b93dad017b6cbd609e4036e220a573`

既定のPages配信workflowの実行対象を今回の固定候補に限定。以前の配信設定はmain `15ae503455bc6ae75b080caa1c4919cafb250027`の同じパスから復元可能。候補版はVITE_REVIEW_PREVIEW=trueで全16単元を表示し、release.jsonにソースSHA・教材基準SHA・全操作ID・保存キー・workflow SHAを添える。

## 公開後の合格条件
実URLのrelease.jsonが配信ソースSHAに一致。320/1440pxで全16単元のルートへ実アクセスし、各単元最初の操作で誤答→ヒント→再回答→正答→再読込。公開学習用キーに保存され、従来kyotsu-step-storeのsentinelがバイト単位で不変。数式構文エラー・ページ横見切れなし。実画面を保存。

この検証が成功した後だけ実URLをユーザーへ渡し、数学・学習「数と式」全16単元・315操作の本人通しプレイを依頼する。他モードの未訪問まで最終受入扱いにしない。

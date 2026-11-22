# QF01 checkpointによる正規再開の技術案

状態: APPROVED_FOR_IMPLEMENTATION。正式Store/Runtime/core/publisherへは承認時点で未適用。元の公開同意を取り直すWorkではない。

対象: W-MATH-QF01-FULL-RELEASE-P035-20261115 / QF01 P046-R3のみ。既存継続WorkはW-MATH-QF01-P046-R3-continuation-20261122。元ZIPは回収候補だが必須のファイル名ではない。

現時点の製品修復は291fc142、core9ee19f65、publisher55d844f2。現main494b6b0とcanonical account/repository ID1391122224は2026-11-22に読取再確認済み。GitHub/main/正式台帳/公開先への変更なし。

主担当が設計検証用のcheckpoint_view.py/checkpoint_tail.pyをworkspaceのqf-audit-helpers/checkpoint-prototypeへ作成。axis_reviewが別ファイルの回帰を制作、authority_reviewがコードと影響範囲を読取審査。同一モデル・非盲検。正式team receiptを生成していない。

本人は現存資料による新ZIP代替の検討・作成を指示し、その後goalを再開した。さらに本案への明示質問へ「この限定案を採用して進める」と回答した。対象はP-QF01-CHECKPOINT-RECOVERY-01、PROPOSAL.md SHA256 1d167fe02fa7e6fa8480f45e5c0bb02d5d401f869e82952940311103284ee86b、保存commit61ccdefc。出所は現チャットのrequest_user_input_async/call_d1c88a5dde794be288a201a5ea8de0ccへの本人回答。これを本限定案の採用承認として保存する。旧goal再開だけを新API承認としたものではない。既承認教材の内容・判断・ID・保存・旧承認は維持する。

現在資料: 新handoff v2、固定seed299objects、原team135件、feedback payload1件、既知prefix envelopes138件。原2sourceをGitから別途回収し、source_manifestと各Git blobを照合済み。旧openedイベント、全prefix、版移行archive、元受付snapshotは未回復。

目的は「同じZIPを探し続ける」ことではなく、確認済み状態を正規に読み込み、新しい実作業を記録し、現在版の必要な工程を完了すること。欠落を埋めたことにしたり、単なるhash鎖の正しさを意味的承認としたりしない。

現在地: 承認後の隔離実装を work/qf01-checkpoint-recovery-core-20261122（元core9ee19f65）で進行中。workflow変更、現candidate同期、正式adapter検査を実施中。正式checkpoint初期化・新T工程・公開は未実施。上記の承認時点の状態を履歴として残す。

実装候補の検査現在地: 凍結版92件は88PASS/4SKIP、後続の2補修は最終焦点6/6PASS。非作者レビューを実施し、原compiler出力も再現した。次はsource/treeをGitHub実commitへ固定してから、正式専用checkpointを一度だけ初期化し、原承認保持と全旧結果失効を記録する。新CIと公開はまだ未実施。

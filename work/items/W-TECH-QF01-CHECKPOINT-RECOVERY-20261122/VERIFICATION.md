# 設計検証

固定actual checkpoint: 299objects、17nodes、team原135件、既知原envelope138件、feedback payload1件、anchor13742/head586be1a3…を厳密照合した。

試作コードとtestsはworkspace/qf-audit-helpers/checkpoint-prototype。read33件＋tail32件、61PASS/4SKIP/失敗0。主担当とaxis_reviewが別実行、試験前後の元contract/blobと対象source/test hashes不変。二人とも同一モデル・非盲検。

actual NTFSのtemp namespaceだけで追記・再読込・CAS・実二process競合・junction差替え・既存lock・サイズ境界・原Work再open拒否を確認。読取はstrict JSON/原hash/全suffix鎖/既知ID/不明context/deepcopyを確認。symlink4件は権限不足のため未検証。

元2source: Guided blob472d5306…/37428bytes/SHA25683d1462a…、test blobe668d363…/33315bytes/SHA256f39f1a99…がseed source_manifestと一致。Git由来snapshot candidateは141670bytes、digest08d0e50a4a8bf7c7f823f016a7389b02815285334902da09d037e7ad98e88b2a。旧opened eventや原snapshot参照を回復したとは呼ばない。

証拠はworkspace/qf_audit_download/recovered-origin-source/RECOVERY_PROOF.jsonとprototypeの実行報告。現app/正式Store/Runtime/core/publisherは不変。

正式Runtimeのbootstrap・全API互換・専用定義移行・現在版CI・R07/SEMANTIC/G2・公開・本人受入は未検証。本案採用後の実装・検査として残す。

凍結後の記録: workspace/qf_audit_download/checkpoint-prototype/FINAL_DIAGNOSTICS.jsonとUNITTEST_RAW.txt。65tests/61PASS/4SKIP/失敗0、元core/contract/blobと試作source/testの前後hash一致。実probeのTEST_FIXTUREは終了時に一時領域を破棄し、正式台帳の操作としてexportしていない。

authority_reviewは改訂具体案を読取レビューし、現在の実T04/R06再結合・元owner非創作・技術Work2件限定・未知依存時の停止・path上限を確認した。本人への限定採用確認に提示可能、追加修正必須事項なし。これは正式実装/Gate受理の審査ではない。

## 承認後の正式adapter候補検査（2026-11-23 JST）

- 移植済みcodec/tail65件: 61PASS/4SKIP/FAIL0。実2subprocessの同HEAD競合、NTFS junctionのroot/child交換はPASS。4件はWindows symlink特権不足で未検証。
- 新Runtime10件＋定義移行8件: 18/18 PASS、約80.6秒。seed＋実suffix、原users不変、旧結果のinput失効、改変proof、HEAD変更、rule変更、pause/claim拒否、予約pathのcase差、実stalePYC拒否を検査。実装8pyと元入力5ファイルの前後hash不変。
- 最小fixtureの初回FAILは採用proposalではなく継続Work proposalを指定したfixture誤り。固定期待SHAは緩めず、正しい技術Work proposal SHA1d167…へ修正してPASS。旧opened/prefixを生成した結果ではない。
- 実compiler補助診断: 正式Storeを作らず、固定seedのcanonical compileInputRef `390944d565c853b6c5e53eb72a386aaa8965194926ca05268ebbe9404d5b0772` を現在Node compilerで実行。output digest `47a16be5777dc7bc6e544857eca78f58ca969bb066baef8703c369d93ab4377a` は原derivationのcompiledResultRefと完全一致。実行時definition `b2da1a5e5dd5929a5588d47997c36970be807522202c1d55e9f1bcae68fde868`。
- compiler初回はkatex不足、既存依存接続後はfraction.js不足でFAIL。指定fraction.js5.3.4をworkspace内の隔離した検査依存へ導入・接続して再試行PASS。既存package.json/lockfileは変更していない。ローカルNode24/npm環境の診断であり、固定Node22/pnpm11.9/Linux CIやR06 PASSではない。

現在83件中79PASS/4SKIP。追加R06 proof回帰と非作者レビューは進行中。正式checkpoint初期化、現在T01〜T04、immutable CI、公開、本人受入は未実施。


追加R06を含む凍結版92件の直接capture: 88PASS/4SKIP/FAIL0、269.876秒。実source8py・tests3py・固定入力5fileの全16file前後hash一致。raw logはworkspace `qf_audit_download/checkpoint-native-tests/native-92-run-1.log`、SHA256 `1b1cd24ef966535d0cabbf934a3614655c57a8de817049667f8e9f87edde2457`。R06の外部Git/実compile境界は明示mock、実suffix/current状態・claim/owner/input/approval/順序/拒否はtempで検査。無関係なteam collectionのstubを使うfocused result guardは意味審査・独立性の認定ではない。実Node compilerの別検査と混同しない。

このrun後、レビューで2点を限定補修: 全Git差分のscope上限（tools等の未承認混入拒否）と、CLIの最初のlocal import前のSourceOnly loader。92件の結果は補修前版を指し、これから行うscope/CLI/R06の焦点回帰と後続immutable CIで現在版を確認する。stalePYCの旧検査はcaller definitions hashの不一致検出であり、通常import済みの全caller bytecodeを証明したものではない。


最終focused run2: scope4＋CLI direct-script stale-runtime.pyc1＋R06 positive1の6/6 PASS、SKIP0、44.080秒。source/tests/input16fileの前後hash一致。raw log `native-focused-run-2.log` SHA256 `649e6bb5d9389d3350f5cc47a9bf6d9bcf60f8f5327a81bb5dde86ba69b05049`、JSON reportと共に上記workspace directoryへ保存。focused run1の不正event filename許可とエラー分類差のFAILも保持し、修復後のrun2と区別する。旧92件と最終6件は重複するR06 positiveを含む別runであり、最終sourceの全97件PASSとは加算しない。

Git差分検査はCRLFを保存するためcommand-local `core.whitespace=cr-at-eol`で実施し、実trailing whitespaceなし。初回plain diff --checkは新CRLFファイルのCRをtrailing whitespaceとして報告した。承認済みPROPOSALのraw bytesは変更していない。

Status: APPROVED

本人「ネットが切れた続けて」を、直前の本P003続行承認質問への回答として2026-11-10 JSTに記録。原文HTML hash63a751a3c94f5d9ddf5ee68eff20ea5bf548053a9d3720da953999c880f4f53a、固定16path patch2465ecb764c82deb6730d78549b6c205a4ad762a33d98cb2b30d98c27e600023。品質受入・main/本番承認ではない。以下は提示時点PROPOSEDの全文を履歴として保持。

# P-QF01-COMMON-CI-20261109-003 — 共通CIの版整合・修正版

状態：PROPOSED。今回承認を求めるのは、固定した16パスの技術補修です。二次関数QF01の作成は承認を維持して待機中です。

## 問題と今回の修正

P002で承認された15パスは、実適用前に停止しました。旧W038の生成記録2件では、IDの集合が同じでも走査順が変わります。元の適用ガードはIDと順序の一致を要求します。Mが最初に比較したbeforeはパッチ済みscratchで、正確なGit原本との順序比較が不足していました。この確認漏れと拒否証拠を保存しました。P002の実Work開始・正式patch適用はありません。

今回、その旧JSON2件の更新を撤回し、元のバイト列を保存します。旧生成器を「現行データの検査専用」に変更し、現在の生成結果を新Workの別の証拠として照合します。加えて、後続で確認したシミュレーションfixtureの旧保護値と、N08画面検査の旧版固定を修正します。承認済みの残り13パスは同じ差分を引き継ぎます。合計は既存14＋新規fixture2＝16パスです。

## 承認範囲

対象はrrikunagasige-dot/kyotsu-step-web、repository ID1391122224、source cd64eea4c5edb15f0f0cb4d43c89a4795e192ab0。既存の独立補修branch work/qf01-common-ci-repair-20261109、draft PR141で実施します。新Work W-TECH-QF01-CI-EDITION-P003-20261109はtechnical/CMD-WORK-001、実在する親W-MATH-QF01-BUILD-20261109へ接続し、既存CI補修issueを関連付けます。未開始P002 Workをnative親にしません。

この承認は以下の固定16パス、専用Work記録、原APIによる入力登録・claim・適用・CI・draft更新を対象とします。共通CIがすべて成功した場合だけ、既承認のQF feature branchへCAS照合のうえ統合し、新しいsourceに対する四幅検査・C09・G2へ進みます。main統合・本番公開・本人受入を、この技術補修の承認から推定しません。

製品src332ファイルは現在の原本と全件一致しています。製品UI・教材・進捗保存・stable ID・原文PDFを変更しません。元Runtime/adapter・定義・保護ガード・CI YAML・依存は変更しません。workflow/test_legacy_diagnostics.pyはテストファイルだけです。旧承認・旧PLAN・旧FAILも保存します。

## 13パスの引継ぎ

9つのE2Eと2つのテスト専用入口・データを版に結び付けます。歴史的Pageと依存はcommit171c04781f32c1286a0762905891b582714834f9の原本を機械的にbundleし、現在の製品へprivate exportやtestidを追加しません。旧16-unit、カタログ4項目・65判断は凍結fixtureで検証し、通常の製品入口は現行3項目・168判断を別に検証します。途中の138という誤った推定は修正済みで、旧記録も残しています。NE01/NE02を省いて旧版を装いません。

元の775 expect呼出し・callback・timeoutと136個の固定解答tupleを保持します。skipや成功条件の削減はしません。通常入口には誤答→正答・reload・reset・SET/物理への移動などの現行動作検査を追加します。残り2パスは旧N11保護値を版で照合するtool testとW039 release manifestです。W039は旧N11の組又は既承認の現行組だけを認め、混在は拒否します。無制限のhash更新を許しません。

新規JSONの適用前入力は同一payloadでfixtureStatusだけUNCONNECTED_INPUTとする宣言済み未接続入力です。接続後FROZEN_TEST_FIXTUREへ変わります。歴史的な製品ファイルだったとは記録しません。新規HTMLも未接続の明示入力から原adapterで接続します。

## 追加する既存3パス

1. W038 materialize.mjs：旧PLAN/MATH_CHECKの2hashを厳密に保持し、既承認の現行N11 IR、派生PLAN・数学検査・実製品JSONを厳密に照合します。通常の書込みは停止します。--proofのときだけ新Work/activation/W038_CURRENT_DERIVATION.jsonへ決定的な証拠を書きます。未知の入力、混在版、生成内容の差、引数なし・未知flagを拒否します。旧原本の再演を現行生成器で合格扱いにはしません。

2. workflow/test_legacy_diagnostics.py：シミュレーション内の計画コピーについて、従来のsource_manifestと同様にprotected_manifestを現行fixture入力へ固定します。歴史的な承認や本番保護値は変更しません。元の古い保護値を戻す負例では、元Runtimeが開始前に拒否し台帳イベント0件となることも検証します。

3. W039 verify_app.mjs：active N08が正確なr5なら元の画面検査本文をバイト単位で保持して実行します。正確なr7なら既存W041のr7用完全検査を使います。active pointer・データ・実行driver・geometry helperの全hashを照合し、未知版や改変は拒否します。CLIのcwdと実行ファイルのrepo rootのrealpath一致を必須にし、別のrootを照合して他の検査器を実行する経路も拒否します。r7に対し旧r5が成功したという証拠は作りません。

## 実施済みの限定検証と未完了

元adapterで旧2JSONの案は、ID順序不一致を適用前に拒否し、patch intent/appliedと実ファイル変更は0件でした。修正版16パスは、隔離シミュレーションで原adapterによる一度の適用が成功し、読み取り専用の旧2JSONも不変でした。正式Storeと製品には適用していません。

materializerは正常1・異常13ケースが期待どおり。fixtureは元3件の保護値エラーを確認後、修正案4件が成功。既存9検査メソッドのASTは維持。画面検査の版選択・改変拒否・root不一致拒否は9件成功しました。

現行N08は320幅、修正dispatcherのroot guard追加前のhash1f7a6c9fffbe189829052a47ba1132ebcf982ec54a56046394e2a167a69f44e8、同一root条件で既存r7 driverを実行し、30親・42判断・70誤選択、部分保存/reload・履歴・5比較route・次N09・進捗分離・984geometry測定を確認しました。最終hashではroot guardの検査だけを追加実行し、全browserを再実行していません。これを最終commitのCI成功や四幅成功とは扱いません。

引継ぎE2Eは型検査・lint・旧assertion保持と代表動作を確認。通常カタログ最終1件と旧カタログ等5件、現行N01–N11/N13/N14の代表操作、既存N12のmobile/desktop46判断・15段階等の証拠があります。298件の収集は実行件数ではありません。最終9suite全件、新commitの全CI、最終resetを含むN12追加検査、新QF四幅は未実行です。途中の失敗と環境不足は残しています。

現在のcd64実CIはPreview・governance成功、Mathは259 unit成功後に旧画面E2E失敗、他の旧W038/N11検査も失敗しています。全CI緑ではありません。QF featureは84f90ba9d6c7fea8ebbaed976fc0de68aaa0c91b、mainは最後に確認した1efb90d5cc1303500efa220ab9fe91985776f0dbのままです。旧source84の四幅516状態成功を新sourceへ転用しません。

## 承認後の手順と停止条件

Mだけが正式Store/Git writerです。A・Bの2名は担当制作と非作者レビュー、孫なし。実承認文・本HTML hash・固定patch digestを記録し、接続先本人/owner/repo/branch/live HEADを再照合します。入力18件（変更16＋保存旧記録2）を正確に固定し、原APIで新Workを開きます。既存ファイルは実Git-before、新2fixtureは明示した未接続入力を登録します。旧2JSONは読み取り専用です。現在のNative台帳9591/head d05dc6fb659e9f7f08ab341e53a588f006b84b5cde512ad94e2eb9a3ca2d67eeから復旧し、未開始P002を開始済みと扱いません。

原adapterで固定16パスを一度適用し、差分・原本不変・CODE・対象検査と全該当CIを実行します。残る失敗は原因と版を保存し、同一範囲なら修正・再検査、新範囲なら修正提案へ戻します。FAILを解消済みにせず、対象から検査を落としません。

定義hash72a038fcc11618df7c2b7c202662026170e6770a485afae18c5cd6c2425c89e5は不変です。388ファイルservice集合では残すtool testの1件が変わるためimplementation hashはe217377eeb2be44ce6b5e4918a321a836193f4cc5ba36261dd1d740587775231→876805bc43096df2b6a32ab26d9c559ef07a121d461a8fc2baf927a525fadbe5となり、新CODEが必要です。今回の新3ファイルもWork入力・対象hashへ固定します。

親QF保護373件のうち、前案P001で承認適用された旧test8件の差分を元guardが検出しています。残365件は不変です。親へ進む時は元のbundle/source/rulesを維持して、その8件だけを正式reviseし、再fingerprint・新CODE/C08/C09/G2を通します。旧失敗をPASSに書き換えません。

承認が必要なのは、旧2JSON更新から検査専用方式への変更と既存3対象の追加です。WORK_SYSTEM §11・§12Bに従い、本P003全文提示後に明示承認を待ちます。P002の既承認13パスは撤回せず保持します。本案は品質合格・公開・本人受入の宣言ではありません。

## 固定差分と証拠

以下の16パスを変更対象の全件とします。専用Work配下の記録・証拠のみ別途保存します。ZIP内proposal/PROPOSED16_PATCH.jsonには全after文面、DECLARED_INPUTS.jsonには全before文面、UNCHANGED_LEGACY_RECORDS.jsonには保存旧記録2件のhashがあります。本HTML末尾にも差分全文を含みます。両者が不一致なら適用を停止します。

| path | before SHA-256（新規は宣言入力） | after SHA-256 |
|---|---|---|
| `e2e/n12-derivation.spec.ts` | `a39a7afa8fbf44a0bec04b9fec0546932626fc9f9c5f32d2fdcf07d497933761` | `46e6be9d25745248b6f7c326dfa3dfc81e7cc3b6ac10b133b1ca02d621fa3782` |
| `e2e/math-textbook-set-smoke.spec.ts` | `9abd80c0f276f6d1ffb438bd770d7358ce08c321f05f57e417ddaee9450e0d0e` | `587572b62dde94e7eee9d17aca7b16a2190323dada7895830292fb9540295571` |
| `e2e/numbers-next-batch.spec.ts` | `200b15bcb8a5cc4ec044a3ab6e73831328a5081ff44d5f230664fc1162b9ed7a` | `5d566092be71137c2d674713ae20918c711fe24cd9540a94c338a0837279e6c2` |
| `e2e/r3-local-token.spec.ts` | `f3b1ab4f537a33273c01577790548e13485b01ae4753b1450aeba26b6b0e4cd7` | `53c19fda268a3db1dee028fa55cdfaf415e7979b9787478953c889e788191b2a` |
| `e2e/numbers-catalog-publish.spec.ts` | `011c099a1fbeac6142972d0602f44356bf732b747321b29327ac7141611a5718` | `63f032c81426861a36c7dcf9f7e37581e3c51314450de949032932ac9ccc7533` |
| `e2e/new-batch-walkthrough.spec.ts` | `b3bd1e115e17bb6c24f4c143f8294504a09712e99b14b86efcb7aaae6a57cc34` | `0ab09f8209b708f260fc0e3d71ef9fd1cd262c5e117137d60d96e918789366b7` |
| `e2e/wmath011-n11-proof.spec.ts` | `1f7c9f3707059a550b7f9f07a2d846d4404819ed89d144bd4cc9ef4e36df5fcc` | `2d734a392f94e30f23523719b8dcecc6b21e045489f17e3cb346da155cf1f807` |
| `e2e/wmath012-n11-q11.spec.ts` | `ac145688ded0ab9b347154d8b243ae1b94887fa207fdd174472a209186062fa7` | `927f5f6fc55e1b379987aef006ec5014efa00f1cc62b3ac2c231de1a6094d2c3` |
| `e2e/p004-repair-interactions.spec.ts` | `12a0c66b8b500587b0ab87cc51bfd65adef642c5802713b4ec03c3078e30807b` | `df6efed14b6b249693327410454e7a9244c1996e25fa924fe53fe210ccd0a63d` |
| `e2e/fixtures/historical-math.html` | `8aab5dc086a6df5869f514e20c46badd0902b4d677cb82fe6275ac1f215e6212` | `0820668c3aea5549ace79456851b7bdb59a729782ac169e9843906d0bdf0c9ff` |
| `e2e/fixtures/historical-math-data.json` | `7c1dbe02217504c0e59e446b7125df4e886ea5bfbf7eac30cf0f4968b7d52998` | `e461df893d86b93486f77c7bfae1b739598af7fef73d84c173fe1b472f83d7c3` |
| `tools/textbook/tests/n08-transformation.test.mjs` | `a05723b543090afffadede2ae0fac1f7736f323920ac5a32a9e657d7ae6025a6` | `5f007f561ad6a6f63caf99a47f68a4ea996c81403ebe62e9eba997c28451a5cc` |
| `work/items/W-MATH-039-n08-grouped-transformations/release_manifest.mjs` | `af4f8e38b4049070a9e1d9ffb13fb456f7133f27e210a421178c4b303dad5d90` | `67c966ae2cda5c2aa3581f548a56335d0e9921f320e4f0632ee4558dda890edb` |
| `work/items/W-MATH-038-transformation-groups/materialize.mjs` | `95644832d260084af7801084fbe2ae21d20cb7ff3b5a29d3642bf33b8419d7ad` | `0181a0130702e35377a78e20137f254f3c1d5ff9e3bf7eb18f7c18fa426bca7e` |
| `workflow/test_legacy_diagnostics.py` | `8105ee190598fca6b59d3f3024466ee4c19659840728eb72b145bc938ea6b725` | `c27c8ce997c218e57f8ff09d14a70277f531e1c64fa936015bfcdd4d4667688c` |
| `work/items/W-MATH-039-n08-grouped-transformations/verify_app.mjs` | `f76507a5964e2fbb041a4abbea163707ddfac3709ef0e19fd0d31a278041c4b1` | `fb0b3b0a972754fe7672401e3ec23603f569834bcec975faa897fa7881f9f964` |

固定patch SHA-256：2465ecb764c82deb6730d78549b6c205a4ad762a33d98cb2b30d98c27e600023。native digest：c2b3f8b8f6ac97356de5cbcdc275c432c6b10ff34dc887621e5a4fc85f223ee4。

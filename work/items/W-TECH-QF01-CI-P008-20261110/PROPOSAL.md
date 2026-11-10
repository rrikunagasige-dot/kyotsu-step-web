Status: APPROVED

2026-11-10 JST 本人の直接回答「承認」をexactP008へ原文記録。HTML1fb1fce1b5a878e635bbeae1d8471ef3a701274468326851582897bb6edcda59、patch2973d7029bdfe2350e030fc6b84a8b835ed96814b1f41ece4dba5f017ed17d34。品質受入/main公開は含まない。以下は提示時原文。

Status: PROPOSED

# P-QF01-COMMON-CI-20261110-008 — 旧N14の証明検査を対応する旧版入口へ揃える

未承認・未適用。P007は本人「承認」を原APIで記録し、Array.fromの一行を一度適用済みです。source fad1e6626578a240d51e9667d27bcc791ccb2169 / tree97ab3cae678abbc911b1f5e7806302a94e160e79、draft PR141。全CIは7成功・1失敗・1skipでした。失敗を原T04 FAILEDに照合し、claimなしで保存しています。

## 通過した検査と残った失敗

P007によりCIのビルド型エラーは解消しました。Mathの図読込6件、N12六ケース、数学教材の主要51ケース×スマホ/PC、N02/N09四ケース、N01/N03四ケース、catalog34ケースは成功しています。別CIの問題練習36mobile＋36desktop、N08/N11全操作・全誤答・4幅・保存/履歴/幾何と共通code検査も成功しました。

new-batch suiteは22成功・6失敗・既存12skip。失敗はW-MATH-014 N14 Q07、W-MATH-015 Q08、W-MATH-016 Q12の3種類×320/390pxだけです。18試行とも初期readerと先頭2問を通過した後、n14-03の表示待ち5秒で止まりました。後続W011/W012/P004/Physics/Practiceの5 namedstepsは未実行であり、全体合格とは扱いません。

## 原因

これら3種類は、明示的に凍結N14 revision10・38項目のデータと答案列を検査しています。しかし移動先3か所だけが通常Appの現行N14 revision11・41項目でした。現行版にはn14-w048-q03-regionが追加され、その判断を終えるまで次のn14-03を出さない正常な段階ロックがあります。旧データ列でその判断を飛ばしたため、次の要素が見つかりません。起動待ちの時間を延ばす問題とは分けます。

同じファイルの他の旧版N14検査は、すでに既存route('14')で正しい歴史版入口を使用しています。凍結r10/38の問題・表示・答案へ検査の入口を一致させる具体案です。

## 固定差分：既存一ファイル・3引数

e2e/new-batch-walkthrough.spec.tsの3つのgotoReady引数を、通常版の直書きURLから既存route('14')へ置き換えます。その他の全文は完全同一です。3引数を逆変換すると変更前全文へ完全一致します。

既存の全assert、答案、誤答/ヒント/再試行、保存/履歴、図、revision10 pin、38項目、320/390px、240秒等の時間枠、skip条件を保持します。現行N14の通常入口を使う別のcatalog guardはそのままで、sourcefadの実CIで成功済みです。現行版の中間判断や安定ID、学習者の進捗を変更しません。新fixture・新入口・新YAML・依存・設定の変更も加えません。

## 影響調査と限定検証

同じ検査補助を使う10specについて、凍結データの版と移動先を照合します。特に未実行5 namedstepsの入口を確認し、現行データを現行入口で検査するものはその目的を保持します。分類と根拠は同梱impact inventoryへ記録し、未確認を合格にしません。

sourcefadのsrc332/e2e55/config9＝396 Git blobと入力を照合し、候補の変更はこの3引数だけです。元tsc -b＋viteのfull buildはexit0、変更ファイルlintはexit0、before/afterの40テスト収集は同一です。全条件・答案・時間枠等の不変を原文/静的照合し、非作者レビューを固定全文hashへ結び付けます。ローカル実行環境とCIの差は原報告に明記します。修正後ブラウザと新source実CIは未検証です。

## 承認後の工程

新technical Work W-TECH-QF01-CI-P008-20261110を原APIで開始し、固定95入力と一ファイルpatchを照合して一度適用します。対象はrrikunagasige-dot/kyotsu-step-web（ID1391122224）、repair branch work/qf01-common-ci-repair-20261109、sourcefad/tree97ab、draft PR141です。実親W-MATH-QF01-BUILD-20261109と、既存QF01-CI-P003-CORRECTION-20261110/原CIRepair issueへの正規接続を維持します。旧FAILED・旧P002別未解決の履歴を保存し、P007等の差分を再適用しません。

新commitの全該当CIを確認します。push filterで対象外となる共通suiteは、既承認祖先から同一newsourceへ新CI専用refをCAS FFして起動し、既存refを巻戻しません。全成功後だけ原T04/L01/Z01と対応依頼を閉鎖し、既承認QF featureへ同じ検証版をCAS統合します。親の承認済み保護12例外（P0018＋P0044）を原reviseで照合し、元数学/設計facetと実旧USER承認を保持して失効C01〜C09/G2を原順で再検証します。四幅320/390/430/1440を確認します。main統合・本番公開・本人受入・全章61問完成は含みません。

全332src、原core/guard/定義、P007helper、残る9spec、元PDF/設計/承認/proof、tsconfig/YAML/依存/public/保存形式を保護します。P008で親の保護例外を追加しません。検査を削って成功にする変更ではなく、旧版の期待値へ旧版の入口を対応させます。

## 新しい承認が必要な理由

今回の3引数はP007の固定helper一行と別の差分です。WORK_SYSTEM §11・§12Bと原adapterのexact patch承認照合に従い、この変更後全文への明示承認を待ちます。旧本人発言を新hashの承認として記録せず、guardを変更しません。P008はnative未open・正本未適用です。

実施済み影響確認：Aがhelper＋10spec、Bが10specを独立読取し、既知3引数以外の同原因所見はありません。後続W011/W012/P004は歴史データと歴史入口が一致、Physics/Practiceは現行データと通常入口が一致しています。未実行の後続browser成功を保証するものではありません。

固定patch SHA-256：2973d7029bdfe2350e030fc6b84a8b835ed96814b1f41ece4dba5f017ed17d34

native digest：1485b815aa4574a68d292f58dc5d80786c9bc8a4ce95ae407ab7afe5dee8d584

固定95before全文はproposal/DECLARED_INPUTS.json、変更対象の完全before/afterは以下。

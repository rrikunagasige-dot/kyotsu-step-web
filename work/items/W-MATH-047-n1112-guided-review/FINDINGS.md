# Findings

- 判断結果を本文で先に説明する箇所：N11の03/07/10/12、N12の01/07。必須の条件や操作理由を教えることと、今回の答えを代わりに出すことを区別。
- N11のq11-constantは局所計算と次の本体再構成の役割が重複。定数計算だけを先に認定し、その後に不等式全体を組み立てる。
- N11のfraction-problemは分母を消す操作の選択前に3倍を指定。目的と元式を残し、掛ける数の判断を本人へ。
- N12のq13-operationは単独2650−□=0から、三辺へ同じ数を引く一つの操作パラメータの選択へ。新engineや同じ数を3回写す穴は不要。
- 一次監査でKEEPとした境界2件もsource-firstの非作者審査で反証された。多数決や既承認を理由に新指摘を閉じず、本文だけを改訂する。
- 基準の回答済み表示と未回答表示は別。resetは本人端末を実操作した場合だけ実施済みとする。今回の検証contextは独立。

## R06 technical dependency
既存n11-source-binding.mjsはW038範囲だけでなくAuthored全体をpinする。承認範囲外6nodeの本文変更でも既存validateTransformationPlanはTG03で停止。これを事前R04で候補Authoredへのcompileまで実行せず発見できていなかった。旧pin維持＋新exact source/3graph mappingを追加する未適用案を準備。未知source拒否や数学・保存ガードは外さない。TECHNICAL_SCOPE_ADDENDUM.mdと隔離7case検証を参照。

## CI-V06 — 解決済み
初回CIの長大なstage写真で固定ヘッダが文脈を覆いUNVERIFIEDとなった。実UIの恒常欠陥とは断定せず、UI/CSSを変えない390×1200通常viewportを追加した。成功CI41620137341の2枚で(26)の局所結果→(27)の未回答主式を同時に視認でき、非作者がVERIFIED_FIXEDと確認。原OPEN、原画像、修正後画像、対象hash、解決出力を保存。

## 2026-11-03 G2再開

G2-A01/G2-B-L01: 保持W038の未回答商7/3先出しを確認しG2 FAIL、issue W047-G2-L01を正式登録。必須初見を満たさないfirstPass=falseを保存し、PASSに変換していない。原報告と未確認面はCROSS_BLOCK_AUDIT_N11.md/evidence/N11_G2_*参照。G2結果初回提出はaudit_rows version欠落で拒否され、全行に正しいrelease SHAを付与して再提出。CODEの拒否条件は変更していない。未適用修正案の初回compileは数学依存不足、PYTHONPATH=/tmp/w046-sympyで再実行し静的PASS。製品ファイルはこの再開中に未変更。次はG2_CORRECTION_PROPOSAL.mdの具体案承認と修正工程。

## 2026-11-03 W047/G2-R1 承認・限定適用

8faa9b19の実発言をR1へ記録。R1承認planのsource coverage/aliasを生成器が追従しない原FAILを検出し、承認planの完全一致を保つため限定技術patchを既存adapterで適用（W-TECH-050初回→W-TECH-051整合補修、初回を成功へ書換えない）。汎用JSON ID順guardは変更せず実拒否を保存。Work専用のexact移行CODEは17動的/負例/復旧検査とA/B審査を経て使用。新実render初回所見は旧IRの初見再利用と区別。R04では旧finding解決の現在入力版への束縛不足、同taskの報告変更、figure.verify空入力をCODEが拒否し、改訂assignment/実画像確認/原図2件検査で補修、原拒否を保持した。R06適用後の入力失効はclaim照合→R01〜R06再結合で修復し、同じpatchを再適用していない。現在R06受理/R07待ち。独立CODE検証はevidence/r1-independent-codeへ保存、実CI未取得と区別する。

## 2026-11-03 R1固定sourceのR07完了

source 2b7780b97bf8c3bde463742e71bf3e816ea8b562、実CI41635935097成功、artifact13231101167/ZIP0876cff…/raw112件を照合。74PNGを既存capture経路で登録。残留lockを原session終了・PID開始時刻・台帳連鎖で照合して復旧し、既登録capture再利用のidempotent取込で完了。A実CI初回・B非初回補足を保持。R07技術/意味PASS、CI-V06 VERIFIED_FIXED。G2-L01は実症状修正を確認し統合閉鎖は次G2へ留保。修正版Gate①シート作成。旧固定CI二本FAIL原ログ保持。未公開・N12未適用・最終受入未実施。

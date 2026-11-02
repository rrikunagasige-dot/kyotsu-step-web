# UX05全適用 native移行adapter 非作者読取レビュー A

担当 /root/w046_source_review。rootのadapter/manifest/routeを非作者として読取。N09教材設計は私の作者範囲なので、その学習内容自体の独立合格はBの審査を用いる。

|対象|SHA256|
|---|---|
|src/domain/nestedMigration.ts|3c56c6fc4362b68e64629c2729666cc23d2a12f6eb3e7952472e10f583ad5a09|
|src/data/textbook/math/numbers/n0910Ux05Migration.json|87b845986a50202926dfe5ce94b08d17539df57809090dd6bce455282824034a|
|src/pages/N0910RevisionPage.tsx|547e81a490a736cba6af8a3b5cf4b766f9be61b667ba8c3af0ca64ea69f8ad49|

**SCOPED_MIGRATION_SOURCE_REVIEW_PASS。読取範囲のblockerなし。**

manifestのsource/targetを実snapshotとactive compiledへ照合した。N09r7 dedfd→r8 39634b3cの34KEEP/14RETIRE/9NEW、N10r4 3cfe→r5 6f86b3d2の52KEEP/11RETIRE/8NEWは、旧新part集合の交差/差と完全一致する。全KEEPのpart objectもsnapshotと全体一致し、値一致だけのaliasではない。retired/newの重複や旧IDの意味差替えはない。

新edgeはunit、source revision/hash、target from/to/hashの全一致を要求する。既存旧edgeを汎用拡張せず、source ledgerのvalidity/timeとtarget unitも検査する。KEEPの親node identity/result/stage/qおよび全part objectを検査してから、manifestのKEEPに限定してrecordをcloneする。新しい問い・旧RETIRE・AUTO結論をrecordへ変換しない。approved node条件/解放gateの変更はこの固定edgeの範囲で認め、一般のcopy-only例外へ拡張していない。

旧recordのfirstValue/選択回数/時刻/既存event IDsは変更せず、後続KEEP recordはrecordsに残してactivateRetainedNativeRecordsの実前提が解放した時だけdraftへ出す。新parent projectionも実part historiesから作り、旧完了parentだけで新前提を飛ばさない。RETIRE原recordの保管は元snapshotに結ぶ旧ledger/main archive側で行い、現行ledgerに未知partを混入させない。

routeはN09 r4→r5→r6→r7→r8、N10r3→fullr4→r5を各snapshotの厳密edgeで通す。N10pilot r4別hashはまずfullr4へ明示移行し、同revisionだからと本適用r5へ直行しない。N10 legacy r2の7件は旧reviewed designを使いR3へ投影した後、既存native鎖へ渡す。旧native/main-only/dedicatedの選択、同hashの新reset markerとその後回答のledger全体優先、未知native revision/hash非破壊拒否は維持されている。

比較routeは新snapshot N09r7/N10r4を選べ、以前のr6/r5/r4/r3/r2も保持する。旧版はreadonly復元＋session内trialで、現在/他unit/旧保管記録を書かない。

これはコード/固定mappingの読取審査。root担当の保存/移行実回帰、実browser全native/未知hash/reset、source freezeとG2の結果は別に必要であり、本報告で実行PASSや公開許可を作らない。

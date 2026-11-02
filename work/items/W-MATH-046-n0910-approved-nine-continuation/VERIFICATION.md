# W046 Verification

Status: PARTIAL
Scope: P-W046-UX-03 / H07代表実装。Work全体・本人受入・公開の合格ではない。

## V-UX03-01 — 固定sourceと保持
source `830b620b343112e4f8c4e3d00b51461dc8ecc098`、N10 r4 compiledHash `5f42dba655ce6dad1348dcf6cce705138fc7c266240277ad769d22be82f24f2b`。N09 compiledは修正前とbyte一致、N10 r3 snapshotも元compiledとbyte一致。既存49partとH07以外44nodeのpartsを維持。原Wordを再読したとは扱わない。

## V-UX03-02 — CODE
120/120の既存+追加回帰、8/8のsource-bound生成器検査、typecheck、変更TS lint、build PASS。途中の型2箇所/旧fixture55件/schema版未登録の失敗はWORK履歴に保持。package/lockは不変。全体governanceはFAILで、源candidate42件=修正前42件、追加0。rawログはevidence/ux03-pilot/。

## V-UX03-03 — 数学と意味
SymPy1.14.0のfinite-math：90parts/候補179、失敗0、unsupported31でPARTIAL。H07の25×5=125と候補gradingはCODE PASS。新しい正性と同定理由はA非作者の意味審査PASS。既存unsupportedの無条件合格や形式証明を主張しない。

## V-UX03-04 — 実browser
320/390/430/1440px、全52parts・各102誤答、828状態/3528幾何でPASS。式の軸、hit area/衝突/overflow、H07先出し防止、完了reload、readonly履歴、旧版試し解答でstorage byte不変、reset取消/確定/reloadを確認。N08初期UIとresetを四幅で保持。r3 main-only救済は追加3回答後36/36、r2由来の7保留継承は45回答後36/36。原イベントを増やさず保存。詳細rawはBROWSER_RESULTS.json。

N09の共通shell/最初の誤答・正答/reloadとN11初期表示も四幅smoke PASS（shared-smoke.log）。N09全41node/N11全体の新しい全状態試験と全17node完成は未認定。未変更の過去有効検証を保持。

## V-UX03-05 — 実画像と非作者
source固定後に全20PNGを再撮影。PROVENANCE.jsonのsource SHA・compiledHash・各画像hash一致。確認①は撮影DOMの注記のみ。Bは四幅H07全16枚+全体/N08比較4枚を実見し、番号枠/余白/条件/小ラベル、段階帯/reset、式group、結論一度だけを限定PASS。A/Bの画像・意味審査と主担当の試験実行を混同しない。

## V-UX03-06 — 未完了
本人の細部OKは未受領、残り16nodeの教材変更は未実施。全体governance未合格。正式台帳の新receiptなし。本番main/Pages未変更。後続の横断監査・公開ゲート・実働URLでの本人総チェックまでWork全体は未完了。

記録整備後の再検査：このWorkの不足3記録とStatus書式を整備して自身の4件を解消。残存38件は基準にもあった他Workの不整合で、新しい違反なし。全体governanceをPASSにはしていない（governance-records.log）。

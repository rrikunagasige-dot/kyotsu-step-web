# W046 UX-03 — 最新検証

Status: PARTIAL / 製品候補の限定検査合格、公開承認前

- 固定製品GitHub source：db99a485f857b1aefa7fb738456f36a830514158。試験source1151305432ce2ebdd3a878718458d1c4f0701dc9とtree06f5da34c349b23dec9327da4c616980c4e7f670が完全一致。commit metadata差をsource差と取り違えない。
- N09r5は41node/46parts、N10r4は45node/63parts。対象17node、保護69nodeのpart契約一致。原Word再読や全教材の新規受入は主張しない。
- 133回帰/生成器8、型/変更lint/build PASS。69nodeはpilotからwhole nodeも不変。新規22part、既存87partの値/候補/型/学習意味を保持。
- 全二単元四幅1732状態、9692幾何、464PNG。N09各46正答/88誤答候補、N10各63正答/123誤答候補。式group軸/番号ink/44px/neutral配置/漏洩防止/keyboard/完了reload/履歴/旧版/resetとN08/N11smoke PASS。pageerror/network failure0。
- 非作者Bが17node完成状態を四幅、各最初の穴の初期/誤答を320pxで実見。H01/H03/H11-H14/タグの原欠陥を補修後に再検査。sourceAは行hideと意味の審査、主担当/BはAの移行コードを審査。
- 旧版移行7ケース：N09r4二方式（38保持+8新回答）、N10r3二方式（49保持+14新回答）、pilotN10r4二方式（52保持+11新回答）、legacyr2（既存7保持+56新回答）。現行main-only復旧は2unit×部分回答/リセットの4ケース。記録のfirstValue/時刻/回数/eventと既存key byteを保持。
- 有限数学は109parts/179候補、失敗0・unsupported50のPARTIAL。新しい意味判断とコードで計算した数値検算を混同しない。
- 配信用buildの新checkerは二単元四幅8ケースPASS。25source hash、HTTP全asset、固定namespace、native旧版trial全storage不変、reset時の他unit/旧版valid ledger保持を確認。保持N08r7/r6/legacy/N11の追加公開前検査も全件PASS（PUBLICATION_PREFLIGHT.jsonと各prepublish log）。
- 候補全体governanceは他Workの既存38件でFAIL。本Work追加0。main起点の公開PR #134のgovernanceは別run41388747203でSUCCESS。
- main merge/Pages公開/本人総チェック/Gold/fitなし。正式Storeの新receiptなし。一回限り特例を保持し、正式工程受理を創作しない。

証拠：[W046_UX03_Review_Evidence_20261102.zip](https://chatgpt.com/library?file_id=libfile_5f3990a90e00819188f0cb550e908fff&account_id=personal)。36,237,029 bytes、SHA256 d47dea711822ebb4802e6857c79c34d65021962cad546660d36fff791ab4ff3b。600原file（464補修後PNGに原FAIL画像/実測/移行/runner等を含む）、内包manifestで個別hashを照合できる。stage-completedという画像接尾辞は対象node回答後を意味し、stage全体完了の証明に使わない。

詳細JSON/log：[evidence/ux03-full/](evidence/ux03-full/)。

---

## 以前の代表ブロック限定検査（履歴）

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

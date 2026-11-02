# UX-03 実配信検証 — 最新状態

Status: PARTIAL / 技術検査PASSを保持、本人評価は導出参加度の要修正

- 本人公開承認：直前のPR134公開質問への「いいよ」。PR #134 merged、publisher6bc54447ef015a2a579a56a5966ceb58a0600d3a、製品source db99a485f857b1aefa7fb738456f36a830514158。
- [公開run41389935781](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/41389935781)はSUCCESS。公開前5群、deploy、実配信N09/N10四幅、保持N08各版/N11と証拠uploadまでSUCCESS。121asset byte/実namespace/完了reload/履歴/native旧版trial全storage/reset取消・確定/他unit・旧版ledger保持を確認。
- root通常TLSのHTTP200：w046-release.json SHA256217e7789946de81303d1a51372b9a1730281adce03f9a6ae61c360f31ff7ce5f、release.json SHA256ab55ad84424ba880eb9d5d1a06e087328d3b0db8ef0691d37eba4739c4914542。source/publisher・25source hash一致。asset全byte照合はActions checkerによる。
- 非作者Bの実public origin対象審査：N09/390 r5 compiled8de81d5c…、N10/320 r4 compiled3cfe9538…。15原PNGを実見しH01/H03/H07/H14、タグ(16)/(33)、共通shell/resetを確認。新規確定欠陥なし。本人受入は別。
- 撮影用fresh Chromiumは環境proxy CAによりTLS例外が必要だった。これはTLS合格ではない。通常TLSのurllibとActions通常browserの配信検証を別根拠として保持。未公開のlocal画像や旧配信を新公開画像へ転用していない。
- Actions artifact w046-publication-evidence ID13117672439、API宣言size288617953/digest sha256:58492507c93c00887a1439b32e0fa1339e56aee0c928486d15cf7d620de6df8d。全288MBを再downloadして同じ検査を反復していない。実配信target PNG/result/manifestをこのWorkのevidence/ux03-fullへ保存。
- 次は[N09第5版](https://rrikunagasige-dot.github.io/kyotsu-step-web/?v=db99a485#/learning/textbook/math-numbers-expressions-n09)/[N10第4版](https://rrikunagasige-dot.github.io/kyotsu-step-web/?v=db99a485#/learning/textbook/math-numbers-expressions-n10)の本人総チェック。WorkをDONE、Gold/fit、正式台帳受理へ変更しない。下記の数学unsupported50/既存他Workgovernance38は保持。

---

## 公開前の検証記録（有効な履歴）

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

## 本人評価の更新
排版の改善は評価されたが、導出の各変形を生徒が行う穴が不足として要修正。既存の1732状態/9692幾何/公開検証は実装された設計の操作・描画を確認したもので、必要な思考操作の網羅を証明していなかった。再設計では完成解法の非自明操作と問いを対応づけ、漏れている変形を検査対象に含める。穴の総数だけを合格基準にしない。本人受入をPASSへ変更しない。

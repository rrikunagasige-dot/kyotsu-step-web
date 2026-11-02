<!-- W046_CURRENT_START -->
# W046 — 現在地
Status: VERIFYING
Review: UX05-REPRESENTATIVE-VERIFIED / BLOCK-CHECK-PENDING
- 再開入口：[工程図・現在地・次手](WORKFLOW_CURRENT.md)。①R04既存CODE接続/意味応答import、②R05承認照合/R06代表実装、③R07限定検証/非作者実画像審査まで完了。現在は④本人の代表細部確認。依頼どおり④より前の進捗報告は行わず、実確認票を準備した。
- [確認票](REVIEW_SHEET.md)。固定source `a39bdb8c9d064e6d90c8352020824bb5be4f931f`、N09r7 compiled `dedfd7c553c2c0186bf7bdbc881bba51649741dbe330e0c854c11dce7822a813`。N10r4/data不変。代表2node以外の39node教材契約を保持、残り23CHANGEは未展開。
- 既存CODEで解法/教授順・段階/穴候補・採否・source-bound IR/組立/配置/compile・可視state・review prepare/importを実行。CODEの未対応OR等を機械証明へ変換せず、非作者数学審査を明示接続した。
- 固定sourceの別clean worktreeでN09/N10×320/390/430/1440、各48/63回答・各95/123誤答候補、1776状態/10020幾何を確認。正常KaTeX Main/Math-Italic loaded、HTTP/page error0、再読込/履歴/旧版trial/keyboard/reset取消・確定/他unit・旧版archive/dedicated保存がPASS。普通式とのfactor実寸145.9375×21は全四幅一致、認定slot0。
- 移行の実browser13ケースPASSは先行source33d06bd8、最終差分が共有compilerとそのtestだけで保存コード/compiled不変のため継承。最終sourceでは四幅の旧版trial/reset保存を別に実操作。全体G2・本人細部OK・公開・総合受入・Gold/fitは未成立。
- R07実寸比較でroot marker内部glue5pxを検出し、通常markerなしKaTeXとの直接回帰と最小補修で解消。harnessのprobe字号差/検査不足/旧試験stale期待等の原FAILも区別して保持。[実績/限界](evidence/ux05-pilot/SUMMARY.json)・原証拠ZIP・担当別審査を保存。
- 次：本人『細部OK』なら承認済み残り23CHANGEの限定適用→R07/G2。『要修正』なら指摘を記録し図の原因/具体案へ戻る。未公開pilot r7と将来の同revision別artifactを黙って上書き/aliasせず厳密な版・hash保存を検討する。
- UX05承認はevidence/ux05-proposal/APPROVAL.jsonで保持し同じ案を再承認要求しない。公開中source db99a485/publisher6bc54447不変。最新Store欠落26イベントの本人特例・別Work既存governance38件を保持。正式Store receiptを創作しない。
<!-- W046_CURRENT_END -->

## 詳細履歴（保存済み記録を保持）

## 公開承認受領・実行中（2026-11-02 JST）
- 本人「可以，继续」によりPR #133のmain反映・既存Pages公開を承認。PR初回governance FAIL（run41331893422）はutilityをwork/itemsに置いたため5記録不足を検知したもの。validatorは維持し、同じscript byteをtools/releaseへ移し参照だけ変更。固定候補・公開先・検査内容不変、PR差分は公開設定とutilityの2パスのまま。改訂head92b9fceのgovernance/checkはSUCCESS。
- PR #133をexpected head92b9fceでmergeし、main publisherはe49486d13119058ff063e75ef84d60660210bd41。公開app sourceは94dfd300固定。アプリ候補branch全体のmergeはしていない。
- 実公開run [41332741779](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/41332741779) がRUNNING。初回確認ではcheckout／固定依存installまでSUCCESS、Word adapter依存取得中、公開前検査／deploy／配信検査は未完了。RUNNINGをPASS／公開済みと呼ばない。
- 次：同runの公開前検査を確認→成功時のみ既存Pagesへ公開→実HTTP byte／N09/N10操作／保持N08・N11を確認。失敗時は原FAILと実配信状態を照合し、承認済み範囲の原因補修・影響再検査へ戻る。未知結果を盲目的に再実行しない。本人実物評価・Gold/fitは未実施。

## 公開承認待ち — P-W046-PUBLISH-01（2026-11-02 JST）
- 本人の「本人承認が必要な地点以外は報告せず仕事フローに沿って続行」に従い、公開用の具体案を準備した。[Draft PR #133](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/133)、head `9b40a7ffd027ec87b354a6223124cc118812aa61`、base main `cce7ba7d28812dede85e2d61c082873fc1b9b864`。未merge・未公開。
- 候補sourceは94dfd300固定。既存候補branchはmainと431 ahead／78 behindのため一括mergeせず、main起点のpublisher branchに公開設定と検証scriptの2パスだけを提示した。mainの教材・governance・他Workを置換しない。
- 既存Pages／namespace／N08 r7/r6/r5/r4・N11を維持。公開前にN09/N10×4幅のbyte／正誤操作／reload／readonly／実保存namespace／旧版試し解答の保存不変を確認し、成功した場合だけupload/deploy。公開後は実配信を再確認する。
- 新publisherのコードをA/Bが審査。初回の保存隔離／実namespace確認不足を修正し、旧版実回答＋保存値byte比較、実key/schema/revision/compiledHash、requestfailed／KaTeX load／page overflow、URL正規化／通信timeoutを追加。改訂版の両担当コード審査PASS。Node構文／YAML／公開前順序／固定source拒否を確認、候補のVite製品buildは成功。新G3配信工程の実行成功は未認定。
- 次の本人承認対象は、このPR2ファイルのmain反映と固定候補の既存Pagesへの公開。P-LAYOUT-01のcopy-only承認に公開は含まれないため、この地点で停止する。承認後は同じ試験のやり直しや再承認へ戻らず、公開前検査→公開→実配信検査→本人実物評価へ進む。本人受入・Gold・fitは自動認定しない。台帳欠落の今回限りの特例は維持する。

## 対象実画像審査・横断監査完了（2026-11-02 JST）
- 今回限りの本人特例を維持し、非作者A/Bによる対象実画像の表示・意味審査、同じ候補のG2担当別横断監査まで実施。新しい未解決の確定欠陥なし。native最新Store受理receiptの再現や創作は行っていない。
- 取得環境：既存artifact13078837969を再利用、ZIP SHA256 `67ef7ec05167203f727ab02fc3146fe6c22bf7e07e3262a445bf930138f8898d` と内包tarを照合し固定依存物を復元。package/lockは不変。Node24.22.1／同梱Chromium151.0.7922.34 headless shell／Droid Sans Fallback Regularを使用。Droidは実CJK font（SHA256 `ee38813ea00c3e32add4268fff7fff9e39417b4913cb13be2415164a47807cc2`）で、旧Noto環境と同一とはしない。
- 実取得：N09/N10×320/1440pxの4ケースを正答操作で完了し、F01符号穴、N10中項符号・P/K/Q、関連readonly履歴の24画像を取得。全4件でpage error0／network failure0／document.fonts.status loaded。過去117・型・buildや8ケース全状態の再試験ではなく、未済だった非作者実見へ渡す対象画像の取得である。
- A/Bが元PNGまたは元hashを保持した一時cropを実見。N09はrと最初の等号が同一行、不等号鎖を途中分断せず含意境界で改行、符号穴と回答後＋の位置、式番号35を確認。N10は差の平方の−、係数4、末項3、式番号42、履歴最終値7−4√3の対応を確認。構造左辺(2−√3)²の単独行は承認案の例外で、単純r孤立と区別。観察範囲でF01原症状は解消、新しい欠陥なし。
- G2：Aは教材／数学／保存／他unit影響、Bはrender／UI影響について担当範囲PASS。541path中4承認差分以外の537byte一致・欠落0、教材正答／選択肢／安定ID／保存移行／図の不変、旧版routeと他単元への非直接使用を照合。267式AST/manual候補不変、既存117／型／build／8ケース報告を対象版に対応する既存証拠として継承。全旧版・他単元の新規全操作、全267式全状態の新規意味受入とは呼ばない。
- 証拠：[W046_Targeted_Review_Evidence_20261102.zip](https://chatgpt.com/library?file_id=libfile_5b282f7b1e80819195f549b13a4e6c40&account_id=personal)、4,214,591 bytes、SHA256 `b7c501d0412ca2705e9c06e1e7aea099b2612a17dab1d7028be4fcba067fc79a`。内包capture.json、24原PNGの個別hash、manifest、使用script、失敗履歴を保存。候補541pathの正本GitHub sourceは94dfd300098484473211c22f5de73139b9002717。
- 失敗保持：full ChromiumはUnix singleton socket EPERMで起動失敗。同梱の通常headless shellは実行mode復元後に起動。初回の別processサーバーは接続不能で4取得失敗。同一実行内でViteを起動して再取得し成功。依存物・製品・validatorの書換え、代替版インストール、旧FAILの削除はしていない。これらは今回環境の障害であり、前チャットClientErrorの原因特定ではない。
- 到達点：本人特例下で承認候補の対象審査・G2担当範囲監査を完了し、公開前で保持。main統合／公開／実配信検証G3_HOST／本人受入G3_FINAL／Gold／fitは未実施、今回の承認範囲外。native台帳上のlast recorded nextは以前のR03のままで、実作業の完了と区別する。以後、同じ承認／117／8ケースの無条件再要求・再実行をしない。

## 非作者審査と候補ソース同期（2026-11-02 JST）
- 今回の実審査担当：A `/root/w046_source_review`、B `/root/w046_render_review`。2名を実harnessで起動し、製品・Store・GitHubを変更しない読取審査を依頼。過去担当者の実行IDと同一とは称さず、同一モデル／履歴共有のため盲検・モデル独立性も主張しない。以下は実担当の原回答を主担当が転記した要約であり、native team receiptへの登録ではない。
- Aの初回所見：承認4パスhash一致、単式／group両方のsemantic候補への接続、manual候補の維持、回答／採点／保存に変更なしを確認。267式（通常160・履歴105・追加2）について抽出したparser／候補選択部分を変更前後で比較し、AST差0・manual候補差0・parse error0。自動候補変化はN09通常53／履歴34／追加2、N10通常29／履歴17。限定ソース範囲PASS、新規確定欠陥なし。
- Aの補助分析の限界：Node24組込TS除去をソース抽出だけに使用。製品の固定依存物を代用せず、KaTeX／DOM／コンパイラ全体／117回帰を実行していない。初回probeは抽出境界指定誤りでSyntaxError、指定修正後の2回目で上記結果。製品コードに修正なし。
- Bの初回所見：N09 `n09-q14-negative-remainder` のr直後の等号と不等号連鎖の実教材rowを確認。単式／中立group計測／readonly memo・追加式への接続を確認。分数・根号・累乗内部を改行しない構造、18px・44px維持を確認。今回のソース審査で新規render欠陥は未確定。
- Bの実画像審査：UNVERIFIED。復元資料には教材asset以外の画像がなく、retained learner packetは変更前79fcを示すJSON。過去6ケース合格報告は継承するが、今回の非作者による現候補画面の直接観察／F01正式解消へは置換しない。後続の実画像意味審査を未済として保持。
- 候補同期：79fc基準＋承認4差分の541 source manifestをGitHub検証ブランチと比較し、不足／相違72パスのみを同じbyteで同期する。残る469パスはGit blob一致。既承認9パスの保存や共有基盤の既存ソースを含む転送差分であり、新規72件の修正ではない。manifest外を削除しない。package.json／pnpm-lock.yamlは既にGitHubと一致し変更しない。今回の同期commitを過去117／型／build実行のcommitと称さない。
- 非作者ソース確認は完了。表示の意味審査／G2／公開／本人受入は未完了。候補ソース保存が完了した後、現候補の画像を対象へ結び付けて残る審査を進める。本人特例と既存合格結果は維持する。

## 今回限りの本人特例と続行（2026-11-02 JST）
- 本人の明示指示：「那就这次先过了就继续工作好吗？后面的作业我们都做，可能这次没有做，就这次当有了先。继续做可以吗？这次是特例」。
- 今回の特例は、最新2,919イベント版Store本体／R03受理receiptが取得できないために後続作業を止める条件を、W046の今回の継続に限り解除するものとして記録する。実施していない検査を実施済みと記載せず、失われた26イベントを創作せず、旧2,893イベント鎖を最新へ書き換えない。後続の検査・実担当の非作者審査は省略しない。main統合・公開・本人受入・Gold・fitへの許可拡張はない。
- これにより、保存済みR03調査と過去の検証報告を引き継ぎ、R04の具体案確認を実施した。ネイティブ受理PASSではなく「本人特例による続行／主担当による具体案照合」として扱う。
- R04 before_after：旧版はrootの関係記号／演算子を幅最小化候補にし、r直後の等号や不等号連鎖の途中でも改行し得る。承認版は自動用semanticRootBreakPathsを二つの使用先（単式・group計測）へ渡す。単純左辺と最初の関係記号、単項符号、不等号連鎖を保持し、後続等号・含意・完結したカンマ境界を候補にする。既存manual APIの候補は維持。
- R04 protected_scope／patch_plan：既承認P-LAYOUT-01の4パス、変更前79fc＋承認後hashを実ファイルで照合し一致。原案HTML hash `8545224726003eb3a683bf3f879c5272826dcc71b989d62699b2945fa0754cb5`、差分hash `de8d4a454d036eaeaea9425fb5a0b97818963b63ebeea6fdb95b499f9bbbd556`。追加の製品コード修正なし。既承認9パス・他537パスの不変確認を再利用する。
- R04 verification_plan：既存117回帰／型検査／buildおよび8表示ケースの報告は対象版を伴う既存証拠として維持し、意味審査と区別する。通常160行・履歴105式・追加2式を影響範囲として、実担当の非作者審査でF01の解消・対象外保護・readonlyを確認する。主担当の本照合を非作者審査と呼ばない。
- R05：既承認P-LAYOUT-01はそのまま有効。再承認を要求しない。R06：隔離候補の承認4差分は既に存在しhash一致、再適用・正式source変更は今回していない。
- 現在：特例を記録しR04主担当照合まで進行。次は実担当の非作者によるR04意味審査と、候補ソース一式の既許可GitHub同期。最新Store未取得だけを理由にこの次工程を再び止めない。今回の特例は将来Workへの一般規則変更ではない。

## 続行指示とR03影響調査（2026-11-02 JST）
- 本人「でも合格したよ。まえのチャット見ればわかると思うよ。進めていいと思うよ。」を受領。前チャットの6ケース合格報告を継承し、同じ試験・承認・添付依頼で作業を止めず、台帳追記を伴わないR03のソース影響調査を先行した。以下は実ソース読取りと、出所を区別した前チャット報告の記録である。
- 前チャット検索で、2026-11-01T14:44:13Zの助手報告「N09 390/430/1440px各149状態、N10 320/390/430px各194状態、合計1,029状態・6ケース合格」を再確認。報告の存在を保持し、旧VERIFICATION_STATUS.jsonの未完了6ケースは「その記録時点」と扱う。今回の新規実行・最新Storeへの正式登録・非作者意味審査の完了とは区別する。証拠ファイル名は提示されているが、取得できた記録には原文リンクがない。
- R03実ソース調査：TextbookUnitPage.tsxはN09/N10の現行版をN0910RevisionPage→ConstructionLessonReadingFlowへ渡す。同readerがNestedConstructionMath／measureNeutralNestedGroupを使用。N09旧r3／N10旧r2はN0910ArchivePage→GuidedMathReadingFlowへ分岐し、追加4パスのrendererの直接使用先ではない。
- 対象inventory：N09は41node・79 math rows・terminalRecord.formulas 57件・displayExtrasのmath 2件。N10は45node・81 math rows・terminalRecord.formulas 48件・math extras 0件。合計160 math rowsのほか、readonly履歴105式・追加2式も同rendererの影響範囲である。件数はcoverage合格数ではない。
- ソース根拠：ConstructionLessonReadingFlow.tsxのgroup描画（103/122行）、readonly履歴（146行）、追加数式（162行）。nestedMathTemplate.tsの同じcompile関数を使うため、interactiveだけでなくreadonlyにも自動改行候補の影響がある。対象データSHA256：N09 `b36753fa12a5aca2523f510075918694db8b0afc1aa35bad646477f45f9015bb`、N10 `b271f90586aa4c5e83dc9bcdc9e3752a5cb244c62a064d4aa2a713760293f94d`。
- 保護対象：教材データ、正答・ID・保存移行等は承認4差分に含まず、取得候補では原manifestと一致。非使用routeに対する読取上の非影響と、ブラウザ回帰PASSは混同しない。
- 次：この影響調査を同じWorkのR03提出材料として保持。2,919イベント版が取得できるまでは2,893版へ受理済みR02を再構成せず、正式claim／receipt／PASSを捏造しない。取得不足を理由に本項の読取調査や既存合格報告の継承を取り消さない。新しいWork・復旧ZIP・独自Gateは作らない。

# W046 — N09/N10 承認済み修正の継続

Status: VERIFYING / 本人特例下の対象実画像審査・G2担当別監査完了、公開前で保持。native last recorded next `R03_IMPACT@N09` は履歴であり、実作業現在地とは区別。

## 差分確認（2026-11-02 JST、継続チャット）
- 憲法等の再読込み・既存PASSの反復実行を避け、前回確認済み正本と個別Workの差分のみ参照する。現在地は取得済み台帳のnextで判定し、GitHub記録を一本化する。
- 現在取得できた W046_LAYOUT_CONTINUATION.zip（23,284,584 bytes、SHA256 `ee3d5315d87103ade6285f94d5e803b81cd221a5f10bcb6928e7b7182c27a015`）を新規隔離領域へ復元。内包manifest、イベント鎖、CASをrestore.pyで照合した。候補541パスは承認済み4パスのみ相違、他537パスは不変。
- この取得パックの台帳は2,893イベント、HEAD `337d4f45879575bfdc619723ece0b0ccdd10d097f1363bac088c921c44d43c65`。補足パックも同時点で、上記保存記録の2,919イベントとの差26件のイベント・対応artifact実体は未取得。旧台帳を最新へ上書きせず、R02を再提出せず、R03もclaimしていない。
- 前チャット検索には別GPTによる残り6ケース・1,029状態のPASS報告があるが、W046_PEER_VERIFICATION_EVIDENCE_20261101.zip / W046_PEER_VERIFICATION_JA.md の証拠本体は今回取得できなかった。報告を正式PASS・登録済み非作者審査・こちらのClientError復旧証拠へ転用しない。
- GitHub候補ツリーと取得パックの541 source manifestを比較すると72パスに不足または相違がある。これはGitHubの18839基準と候補79fc＋4差分の差であり、今回の新規修正72件を意味しない。候補全体の同期完了は引き続き未認定。
- 次の必須入力：2,919イベント版Store（少なくとも2,894〜2,919イベントと対応CAS artifact）および上記6ケースの証拠本体。取得後、既存鎖・HEAD・入力hashへ照合して同じWorkのR03から進む。承認・117件回帰・型検査・buildの有効結果を理由なく再実行しない。
- 今回の実行経路でシェル／Python／ZIP復元は成功した。別チャットの実行障害の原因特定や継続復旧を証明するものではない。今回、依存物再取得・アプリテスト・正式台帳追記・製品コード変更・公開は行っていない。

## 実行環境の障害記録
`ClientError`の経緯・入力記録の確度・サポート対応は [EXECUTION_INCIDENT_20261101.md](EXECUTION_INCIDENT_20261101.md) に集約する。サポート文面は作成済み／未送信。今回の文書更新では実行テスト・正式工程を進めていない。
以下の「続行確認」は過去の時点の記録として保持し、以後の障害詳細は上記ファイルだけへ追記する。

## 承認と範囲
P-G3-03の既承認9ファイルを保持し、明示承認されたP-LAYOUT-01の追加4ファイルを検証する。GitHubへの検証用保存と検証実行は、その後の本人の実行指示に基づく。main統合・アプリ公開・本人受入・Gold/fitは行わない。工程を新しく作り直さない。

## 前回保存済みの実行結果
- GitHub Actions `41294706620` はSUCCESS。固定package/lockを照合して依存物とChromiumを取得。これは環境取得のrunであり、修正版の117件をGitHub上で実行したrunではない。
- 取得artifactのhashを確認した作業コピーで、117/117回帰・型検査・ビルドがPASS。ソース541ファイル中、承認済み4ファイル以外の537は不変。
- 正式台帳コピーのR02は、現在の入力・実receipt・原因分析を提出して受理済み。次はR03。未完了claimなし。2,919イベント、HEAD `291a57b6f2e26b9d32d1b4218b6f5e978e8b434c8a350688aaf8e9f4b4f5eeee`。
- 実ブラウザ8ケースを実行。N09/320pxの149状態とN10/1440pxの194状態は、正常フォント・幾何・操作・完了・再読込・readonly履歴・リセット再読込までPASS。
- 他6ケースはタイムアウト又はローカルサーバー到達不能によるフォント取得失敗が残る。PASSに変更せず再確認が必要。
- N09/320の元指摘箇所ではrの孤立と不等式途中の分断が解消した画像を主担当が確認。ただし正式な非作者審査及びF01解消認定は未完了。

## 続行確認（2026-11-01、上記結果の再実行ではない）
- branch HEAD `6274dca1f9a8dcc98918446af0595d5eb7a5c258` の実在と、上記実行結果・承認差分の保存をGitHubから確認した。
- 既存の環境artifact `13078837969` をdownload_workflow_artifactで取得した。再度npmインストールを試す作業ではない。今回のローカル展開・hash再検証は未完了。
- 続行中にcontainer/Python実行ツールが `ClientError` を返すようになり、単純なファイル操作も実行できなかった。残り6描画ケース、R03提出、候補ソース一式のGitHub同期は今回実施できていない。このツール障害をnpm不足や製品テストFAILとは扱わない。
- 添付済みのN09/320 `packet-0148.png` とN10/320 `failure.png` はFilesの画像読取で確認した。前者ではrと最初の等号、各不等式の連鎖が同じ行に保たれている。後者には最初の穴と選択肢が表示されているが、タイムアウトの原因特定や操作成功を画像だけから認定しない。いずれも新しい実描画や登録済み非作者審査ではない。
- 古い2,893イベントの再開パックを最新2,919イベントの台帳として扱わない。最新Store実体を取得・照合するまで正式工程へ追記せず、R02を無条件に再実行しない。
- 今回は製品コード・正式台帳・検査結果を変更せず、既存のこの作業記録だけ更新した。完了済み確認を最初からやり直す許可を追加していない。

## 次の作業
1. 79fc基準＋承認済み4差分の実ソースと、2,919イベントの最新Store実体を照合する。4ファイルのdiffだけを実行可能な候補一式と扱わない。
2. 既に許可された検証用ブランチへ不足する候補ソースを同期し、対象版を固定して残り6描画ケースを再検証する。依存artifactは既存取得済みを使用でき、取得工程を理由なくやり直さない。
3. 同じWorkのR03以降へ進み、必要な実担当の非作者審査を保持する。同じ承認を取り直さない。

## GitHub保存の境界
このブランチには固定依存環境のworkflow、原案とbyte一致する `P-LAYOUT-01_EXACT.diff`、前回の `VERIFICATION_STATUS.json` を保存済み。基準18839以降の全候補ソースツリーの同期は未完了であり、このブランチを完成した実行候補や公開候補と呼ばない。ローカルの79fc＋承認済み4差分と、GitHubの18839基準を混同しない。

詳細の版・hash・実行場所・失敗は [VERIFICATION_STATUS.json](VERIFICATION_STATUS.json) を参照する。古いFAIL、承認、作者履歴は保持し、既存main・公開アプリ・本番Storeには書き込んでいない。

## 公開操作の確定チェックポイント（2026-11-02 JST）
run41332741779のstep18（公開前byte・N09/N10操作）SUCCESS、step19（artifact upload）SUCCESS、step20（Pages deploy）SUCCESSを直接確認。step21（実配信N09/N10 byte・操作）はRUNNING。この時点ではrun全体・G3_HOST・本人受入をPASSとしていない。上の短い現在地を更新し、既存詳細履歴は削除していない。

## 公開・実配信検証完了（2026-11-02 JST）
- run41332741779（publisher e49486d13119058ff063e75ef84d60660210bd41）のjob124926078853／全体SUCCESSを直接確認。初回gov失敗と配置補正の履歴は維持し、公開再実行はしていない。
- ログで公開前17:50:25 UTC／公開後17:58:04 UTCの `W046_HOSTED_BYTES_AND_OPERATIONS_PASS` を確認。固定source94dfd300、package/lock・承認4パス・compiled2パスhash、w046-release.json・配信全file hashが照合され、N09/N10×320/390/430/1440の正答・各部品の代表誤答・完了reload・readonly・実保存namespace/schema/版/compiledHash・旧版試し解答の保存byte不変まで通過。全誤答候補の新規網羅や全267式全状態の意味受入へは拡張しない。
- 保持検査：N08 r7は四幅で30親42判断／各70誤答、途中保存・履歴・比較route・次単元・進捗分離・geometry PASS。r6は33親37判断／69誤答、旧r5は34回答／80誤答PASS。N11は四幅で39回答／109誤答、14stage／原図2点、履歴・reload・resize・旧版1〜10移行・geometry PASS。これは今回の実配信確認であり、他Workの本人評価を代行しない。
- GitHub成果物：github-pages artifact13094510662（3,173,461 bytes、digest sha256:71907fae51a71a570e07668b5487536942075a58ee36e348a12c555b737044b6）、publication evidence artifact13094392919（184,512,579 bytes、digest sha256:f07a97d256031e804b5b0f0af59f09f3be5c3a6fe9b6b8c036dac196f2cad685）。各artifactの公開metadataを確認。証拠ZIPを今回再ダウンロード・再検査したという意味ではない。
- 現在はG3_FINALの本人実物評価待ち。公開前固定app sourceとpublisherを区別し、学習記録namespaceを維持。本人の肯定／否定評価後に該当する事例更新・教訓重複確認とWork closeへ進む。公開の成功や「続けて」だけを肯定品質labelとしない。Gold／fitなし。

## 本人G3_FINAL要修正の受領（2026-11-02 JST）
当該チャットの本人発言を日本語で要約：N08の従来の排版／選択肢／左下resetを基準にすべきで、今回の大見出し・操作形式の変更、穴不足、計算を示しただけで解かせない箇所、式の不揃いを指摘。根号a／根号bを公式選択にせず構成した一部は肯定。全体の受入ではない。
- [本人添付image(5).png](https://chatgpt.com/library?file_id=libfile_cc4af2b82b7c8191a6282fc7aa34bf74&account_id=personal)を主担当／A／Bが実見。N10 n10-q02-signのt=5とn10-02の√125=5√5が、通常rowsとterminalRecord memoで重複することを確認。
- N08基準はsource94dfd300内の既存r7実装と、公開run41332741779 artifact13094392919の原画像を使用。artifact ZIP hash f07a97d256031e804b5b0f0af59f09f3be5c3a6fe9b6b8c036dac196f2cad685を照合。N08の320/1440 active-pointer画像を主担当／Bが実見し、現在段階帯・穴直後の選択肢panel・例題/導出の小ラベルを確認。resetの位置はその画像に写っておらず、共通footerコードを根拠とする。
- W046-UQA-01：N09/N10だけTextbookUnitPageの共通shellを迂回し、既存の左下「この単元を最初から」を独自reader最下端のresetへ置換。独自h1／全stage h2積み上げ／常時末尾choice panelもN08と異なる。
- W046-UQA-02：resolved時にmemoを無条件追加し、同じ式・条件・説明を直後へ再掲する。
- W046-UQA-03：途中の計算・理由判断をAUTO nodeで完了させ、独立した学習行為が欠落。N09は41node/38parts、N10は45node/49partsだが総数を品質指標としない。全86nodeのA監査で17nodeを追加/再構成候補、69nodeは穴設計維持。
- W046-UQA-04：整列planがnode単位で、memo/extraはgroupAlignmentのない別中央配置。局所の幾何PASSは同じ導出全体の軸を保証しなかった。
- 主担当／非作者審査の不足：従来の検査は型・数学/AST・幅・穴サイズ・衝突・F01などに偏り、N08とのUI整合、重複の教育的意味、学習行為の被覆、別group間の連続性を受入条件へ十分反映していなかった。以前の限定PASSを教材全体の品質保証としない。

## P-W046-UX-02 — N08基準の表示・操作復元と学習行為の穴補修案
Status: PROPOSED / NOT APPROVED / NOT IMPLEMENTED
基準：公開app source94dfd300098484473211c22f5de73139b9002717。今回の具体案承認を旧13パス承認から推測しない。正本規則はMASTER_APP_LESSONS §7〜12/16/20/51〜54、MATH_RENDERING_RULES、WORK_SYSTEMの修正優先・改訂承認・検証／本人評価の分離。既存教訓へ対応付け、新しい一般ルールを重複作成しない。

### 1. 表示・操作
1. N09/N10側をN08の既存構成へ合わせる。現在の問題＋現在stage中心、過去stageは履歴で開く。小さな段階帯（左青線／段階名／進捗）、例題/導出の小ラベル、既存の見出し階層を使用し、内部コード・版を独自大見出しへ混ぜない。
2. 選択肢は現在の穴／導出groupの直後へ表示し、N08の番号付き白い縦並びボタン・青枠／薄灰色panel・active/誤答feedbackに合わせる。穴activateを単なる末尾focusへ置換しない。
3. 左下の共通「この単元を最初から」を復元。確認dialog、対象単元だけのreset、stage/cursor初期化、冒頭scroll/focusをN08と同じ操作にする。旧archiveと他単元の記録を保持。
4. 表示済み結論・条件・説明を通常導出の直後へ再掲しない。terminalRecordは前段参照・履歴の用途へ整理し、意味のある再利用は残す。文字列だけで式を一括削除しない。
5. 同一の意味を持つ連続導出groupへ共通のleft/relation/right軸とneutral envelopeを渡す。node境界・memo/extraを跨ぐ表示用途を明示し、条件式や別問題を無条件に同じ軸へ揃えない。18px数式・44px操作、根号／分数／累乗内部を壊さない改行を保持。

### 2. 穴の修正対象（17node）
| node | 修正する学習行為 |
|---|---|
| `n09-01` | 零積から全解を尽くす「または」の論理接続。既出±4の再入力だけにはしない。 |
| `n09-q04-negative` | a<0から−a>0の関係判断→既存√(a²)=−aへ接続。 |
| `n09-06` | 2<√5の両辺へ加える−√5を構成→既存の差0の計算へ接続。 |
| `n09-07` | 外側−1と符号込みの第二項−√5を構成→既存−2／＋へ接続。N08分配の粒度を基準。 |
| `n09-09` | 平方比較から1.41<√2<1.42の不等号を判断。 |
| `n09-q14-positive-remainder` | r=x−nの適用として√10−3の減算を構成。認定済み3は参照。 |
| `n10-02` | 5√5>0の関係、25×5=125の計算、平方と正性から正の平方根と同定する理由を確認。 |
| `n10-04` | 積の証明で平方だけでなく符号条件も必要な理由を確認。公式丸ごと選択へ戻さない。 |
| `n10-06` | 商の構成・分母非零・平方・符号から結論を同定する理由を確認。 |
| `n10-q07-product` | √6√8の根号内の×を構成→既存の48の計算へ接続。 |
| `n10-07` | 48から取り出す最大の平方因子16を選ぶ→既存の残り3へ接続。問いの一意性を明示。 |
| `n10-q09-left` | 8から平方因子4を選ぶ→既存√4=2へ接続。 |
| `n10-q09-right` | 50から平方因子25を選ぶ→既存√25=5へ接続。支援を減らしたtransfer。 |
| `n10-17` | 共役因子を上下へ掛けた式を積へまとめる構成。認定済み因子は参照し、同一の×判断や因子を写す穴は重複させない。 |
| `n10-q19-distribute` | √3(√3−√2)の第二項の符号とscope、結合符号を構成→既存の積3／根号内6へ接続。 |
| `n10-q20-factor` | 2>√3から2−√3>0という非零性の根拠を判断→既存の有理積・値1の理由へ接続。 |
| `n10-20` | 分母を2²−(√3)²へ構成する減算判断→既存の分母1の計算へ接続。 |

- 残る69nodeは穴設計を維持。最初の手本・定義・既出結果の記録を、ゼロ穴だからという理由だけで変更しない。表示の重複／整列修正は69nodeにも適用。
- 全途中式を機械的に穴にせず、「何を使う／どの符号・演算を選ぶ／何を計算・比較する／何を意味する」の独立操作を前提付きで定義。認定済み結果はmirror／参照で再利用し、同じ値を写す穴を増やさない。未知用語の当て物、完成公式一式だけの選択へ戻さない。
- 肯定部分：根号a/bの非零・平方・符号を構成する流れ、N09-Q08の途中計算と二つの比較、N10-q21のP/K/Q構成等を維持。新規partの問い・型・正答・誤答根拠・前提・見える情報を17nodeごとに契約化し、後続完成式／lead／memoによる答え漏れを検査する。

### 3. 版・保存
N09 r5／N10 r4を作り、現r4/r3を比較用に残す。原r3/r2も保持。新compiledHashへ無条件に旧完了を転用しない。
- 問い・対象・型・正答・候補・前提の意味が一致する旧partだけ出所付きで継承。追加の判断・計算は未回答へ戻す。旧AUTO結論は新しい穴の回答済み証拠にしない。
- 現r4/r3のcompiled snapshot／表示／履歴を保持し、新しい必須課題がある場合は最初の未解決へ復帰。未変更の全回答を消さない。同じ保存namespaceを維持。

### 4. 実装範囲
- 設計／生成：W043のNODE_DESIGN.json、nested-lesson生成器とapply-n0910-construction、対応するlayout group・表示用途・数学／設計validator。
- データ：N09/N10 active compiled／candidate pins／unit entry、新revisionのn09Revision5／n10Revision4、現compiled r4/r3の比較snapshot。関連migration-analysis／意味対応表。
- UI：ConstructionLessonReadingFlowとscoped CSS、N0910RevisionPage／N0910ArchivePage、TextbookUnitPageの共通shell接続。必要なnested template／geometry／compiled契約の受渡し。N08の教材データと専用readerを修正対象にしない。
- 保存：nestedMigration／nestedLessonStorageと必要なbridge。上記の版・意味対応に必要な範囲だけ。既存IDを別の学習行為へすり替えない。
- 検査：対応する既存test／measurement／design／finite-math／captureを改訂し、旧版fixtureを残す。旧期待値を一括置換してPASSにしない。
- 公開：検査済み新candidateをfreeze後、既存publisherのsource/hash／新旧route検査だけ更新し、同じ既存Pagesへ反映する。公開前にN09/N10とN08/旧版/他の影響対象を確認し、失敗時は公開しない。公開後は実配信byte・操作を検証。別サービス・料金・権限追加・他教科の改修・Gold／fitは含めない。
範囲のmaterialな追加や数学・学習目的の変更が必要になれば、黙って拡張せずこの案を改訂する。

### 5. 合格条件と順序
1. 17nodeの新旧学習行為表と69node維持表、part契約、表示group／用途、保存意味対応を固定。
2. AIが穴の学習目的・導出境界・説明と操作の順序を審査し、CODEが型・唯一正答・前提・依存・回答前後の表示を検査。
3. 実装後、320/390/430/1440で空欄／選択中／誤答／正答／履歴／reset／旧版比較を採取。node内だけでなく同一導出全体の式軸・番号・穴位置を実測。N08とのUI位置・見出し階層・選択肢・resetの比較も検査対象にする。
4. 本人添付のN10 sqrt125の前後を必須回帰点とし、t=5／√125=5√5の無意味な直後重複をなくす。新しい正性・平方・理由の穴が回答前に漏れていないことを実見。
5. 非作者A/Bが全86nodeの設計／表示への適用と、対象実画像・保護対象を確認。既存有効PASSは未変更の範囲で再利用し、変更した入力と依存先は再検査。
6. 検査・審査後に新sourceを固定して同じPagesへ更新、実配信を確認し、本人G3_FINALへ再提出。公開や実装承認を本人受入へ変換しない。

今回の変更：上の要修正・原因・提案を既存WORKへ記録。製品コード／公開版／学習Storeは未変更。


## 修正案の書式不足と新版作成（2026-11-02 JST）
- ERROR-PROCESS / ERROR-SPEC: 前案P-W046-UX-02は、穴の詳しい修正方法と排版の設計が足りず、正本の提案書式を満たす前に承認待ちと表示した。本人の指摘により未完成と確認。旧本文と旧評価は削除しない。
- CONFIRMED: mainの `work/templates/PROPOSAL.md`、`governance/INSTRUCTION_DICTIONARY.md` CMD-WORK-001、`governance/WORK_SYSTEM.md` §§7/11、`governance/CHANGE_PROTOCOL.md` を照合。`CREATION_DESIGN.md` §§4/5は作成用の詳細設計参考として区別した。
- 本人「じゃ作り直そう」は設計作成の指示として記録。新版P-W046-UX-03を[PROPOSAL.md](PROPOSAL.md)へ保存。SHA-256 `4409a8d83f709ca9b9d9976774f81115929c1cde84b717a7e8d523029706afe5`。旧13パス承認や旧公開承認から新版実装・公開の許可を推測しない。
- 文書検査: 正式提案の必須項目、17nodeの詳細、基準compiledから抽出した全86node（変更17/維持69）、数式区切りを確認。これは製品の数学検査・描画・操作・非作者審査のPASSではない。
- 今回の変更は提案書と既存Workの現在地・検証状態のみ。製品ソース・学習記録・公開版・正式工程Storeを変更していない。次は本案そのものの明示承認。


## P-W046-UX-03 明示承認受領（2026-11-02 JST）
- 本人発言（原文）：「まあこれでいいでしょう。承認」。直前のexact Proposalへの実装承認質問に対する変更条件のない回答。
- 承認対象：commit85a53672826fb204a7e182f56b975d80b4727747のPROPOSAL.md、SHA-256 4409a8d83f709ca9b9d9976774f81115929c1cde84b717a7e8d523029706afe5。承認した本文byteは変更せず、このWORKと状態JSONへ承認証拠を記録する。
- 限定実装・検証用候補の保存を開始。まずn10-q02-sign→n10-02（√125）とN08基準の表示・操作の代表ブロック。本人の小ブロック確認前に他16nodeの教材を一括変更しない。本番main/Pagesは別の公開ゲート。
- 本発言は品質合格・正式台帳受理・公開許可には転用しない。


## P-W046-UX-03 代表実装と確認票（2026-11-02 JST）
- 実装source `830b620b343112e4f8c4e3d00b51461dc8ecc098`（承認記録adbbc230の後続、独立検証branchのみ）。H07の3part、nodeをまたぐ式group/意味別group、現在stage/履歴、重複memo抑制、既存共通shellと左下resetを実装。
- 検証途中のFAILを消さない：型2箇所、旧版固定fixtureを現designへ取り違えたmigration55件、N10 r4のschema literal未登録を検知して補修。旧fixtureはpriorReviewedDesignRawの元byte/hashへ固定し、版3を4へ一括置換しなかった。
- A非作者審査で、r2由来の保留回答の親記録欠落、mainだけに残るr3を旧版比較が読まない問題を発見し補修。初回値・回数・時刻・初回正誤とread-only fallbackを保持。再読確認済み。
- B予備実画像審査で番号枠・同一導出内余白・小ラベルの横並び・条件再掲を指摘し補修。撮影時のsticky header重なりはviewport高の調整で除去し、製品の式/本文を画像加工しなかった。
- Source固定後に撮影した全20PNGのhashと出所はevidence/ux03-pilot/PROVENANCE.json。確認①は撮影DOMへの注記であり製品内容ではない。Bは全20枚を実見し、固定SHAに対して限定PASS。AはH07の正性・同定理由の意味審査を明示PASS。誰の試験実行かを混同しない。
- [VERIFICATION.md](VERIFICATION.md)と[実browser結果](evidence/ux03-pilot/BROWSER_RESULTS.json)に実行結果・保護対象・未検証範囲を記録。公開・本人受入・全17node完成は未認定。
- 記録形式：このWork内のACTION_LOG/FINDINGS/VERIFICATIONを正規ファイルへ整備。歴史のWORK本文・旧失敗・旧承認は保持。PROPOSAL.mdは承認/実装状態欄のみ更新し、現文書hash `e5964b58fd3ebb7099856a9760bf04e503b6069f939493f1bf3d880b653a6fe2`、承認対象設計本文hash4409a8d8…とは役割を区別する。

## 公開具体案 — P-W046-PUBLISH-UX03

Status: APPROVED / 本人「いいよ」で公開承認、実行完了

### Problem / Need
公開中の旧N09/N10は本人要修正。承認済みUX03の修正版は候補で実装・検証済みだが、UX03の承認scopeは候補保存までなので、本番反映はここで分ける。

### Proposed Solution
[Draft PR #134](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/134)、head fc961f58c22f0cc3505f27aff2dec344a52ac660、base main e49486d13119058ff063e75ef84d60660210bd41の2filesをmainへ反映する。既存Pagesの公開workflowが固定製品source db99a485f857b1aefa7fb738456f36a830514158をcheckoutして検査し、合格時だけ配信する。

### Scope / Out of Scope
変更は `.github/workflows/deploy-pages.yml` と `tools/release/w046-publish-check.mjs` の2files。既存Pages/公開namespaceを保持。N09r5/N10r4とN08各保持版/N11を同じ固定候補から配信する。source branch全体のmain merge、追加教材編集、本人受入、Gold/fitは含まない。

### Expected Affected Areas
公開sourceの固定SHA、manifest、HTTP全asset byte照合、UI stage/履歴/native旧版/resetへ検査器を対応。新規修正はpublisher内だけで、検査済み製品sourceを変更しない。現在の公開namespaceの旧r4/r3回答はsource内の限定hash移行adapterで保持し、22新規partのみ未回答となる。

### Risks / Rollback
font/環境差、配信cache差、保存移行を公開前と実配信の双方で確認する。公開前FAILならupload/deployへ進まない。公開後FAILは実配信SHA/原FAIL/旧新版記録を保持し原因補修へ戻る。main/旧固定source94dfd300と旧版native snapshotを保持し、ロールバック時にも新版回答を旧版へ逆流させない。実配信検証を本人受入へ転用しない。

### Verification Plan
候補133回帰/8生成器/型lintbuild、二単元四幅1732状態/9692幾何と非作者画像審査を継承。publisherは25path hash、同一実namespace、HTTP全asset、N09/N10四幅の正誤/完了reload/履歴/旧版trial全storage不変/reset取消/確定/他unitと旧版ledger保護を検査する。N08r7/r6/legacy/N11の既存実操作もupload前に検査し、deploy後は再度実配信source/全byte/操作を照合。main起点PRのgovernance/code checkは両方SUCCESS（41388747203/41388747220）。local同等公開前検査の結果は最新VERIFICATIONへ追記する。

### Review / Approval / Revision History
主担当がpublisher作者。非作者sourceAが初回審査で保持教材のupload前検査/追加bytehash/reset他unit保存の不足を指摘し、補修後の2filesを限定PASS。実行PASSはコード審査と別記。作成時点の本人公開承認は未受領。本人「那继续做」はUX03の続行であり、この未提示だった公開案の承認へ転用しない。

### 公開前検査の確定（本人承認前）
固定db99a485の配信用buildで、N09/N10八ケース、保持N08r7/r6/legacy/N11の5検証群が全てPASS。HTTP全asset、25source bytehash、実namespace、native旧版trial全storage、resetでの他unit/旧版ledger不変を含む。N11のdecode待機は既存publisherと同じ検証専用shimで、実行後は元byteへ復元した。原環境エラー（別実行contextのpreviewへ到達不能）は /tmp/w046-ux03-prepublish-n08.log に保持し、同一実行context内serverで検査を実行した。製品欠陥やCODE PASSへ転用しない。
結果は[evidence/ux03-full/PUBLICATION_PREFLIGHT.json](evidence/ux03-full/PUBLICATION_PREFLIGHT.json)と各prepublish log。main側governance/code checkの両SUCCESSを確認。PR #134はdraftのまま、公開承認待ち。

## P-W046-PUBLISH-UX03 公開承認受領（2026-11-02 JST）
本人「いいよ」を、直前に提示したPR #134の2filesのmain反映・既存Pages再公開への明示承認として記録。承認head fc961f58c22f0cc3505f27aff2dec344a52ac660、base e49486d13119058ff063e75ef84d60660210bd41、製品source db99a485f857b1aefa7fb738456f36a830514158。main側両CI SUCCESSとlive identity/HEAD一致を再確認した。同じ承認/133回帰/ローカル全状態を理由なく反復せず、公開前CI→deploy→実配信byte/操作の未済工程へ進む。本人最終受入・Gold/fitの承認には転用しない。

## P-W046-PUBLISH-UX03 main反映・公開工程実行中
PR #134はexpected head fc961f58でmerge成功。main publisher SHAは6bc54447ef015a2a579a56a5966ceb58a0600d3a。製品source db99a485は不変。公開run [41389935781](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/41389935781)、job125098872112を開始。初回観察ではcheckout/固定依存installがSUCCESS、Word依存取得中。非作者sourceAがmerged publisher2filesと審査済み版のbyte一致、source/namespace固定と公開前FAIL停止の維持を一回照合した。RUNNINGを公開成功へ変更しない。同じローカル検査は再実行しない。

## UX03 公開・実配信検証完了（2026-11-02 JST）
公開run41389935781/job125098872112は全step SUCCESSで終了。公開前検査を省略せず、実deploy後の121asset byte/二単元四幅の全part正誤・履歴・旧版全storage・reset/保持N08r7/r6/legacy/N11検査も成功。rootの通常TLS HTTP取得でもsource db99/publisher6bc/N09r5/N10r4と25source hashが一致した。非作者Bの実配信対象画像審査はTARGETED_HOSTED_VISUAL_PASS。15PNGを固定hashで保存し、公開前全状態検証とは別記する。正式Store receipt/本人受入/Gold/fitは創作せず、本人総チェック待ちへ移る。

## 本人指摘 — 導出の参加度不足（2026-11-02 JST）
本人は排版を「前より大きく改善」と評価した一方、公式の導出で穴が少なく、一穴を答えると他の変形まで自動で出るため「自分で導出する」活動が不足すると指摘。これは以前からの要求の適用不足で、新しい穴数ノルマの要望として扱わない。指摘には原因分析・同型箇所の横断監査・GitHub既存基準との照合が含まれる。既存規則がある場合は新教訓を重複追加せず、どの規則の適用を落としたか記録する。
- 添付2件は同一SHA256 `1ae83424956f7ef23344f870c417e81d84c9791ff5b0a5e90c1bcec817e5e92b`、同じ一画面。原写真は添付のまま保持し、公的GitHubへ転記しない。
- 実source db99のn09-01はzeroLogic一穴のみ。移項/平方差の因数分解/各一次式からxを取り出す操作が自動。直前のn09-q01-negativeも累乗→積/符号が自動でvalue16だけが穴。数学的正しさや描画PASSだけでは、この導出活動の不足を検出できない。
- 正本 [MASTER_APP_LESSONS §8](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/6bc54447ef015a2a579a56a5966ceb58a0600d3a/docs/MASTER_APP_LESSONS.md#L251)、[§§52-53](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/6bc54447ef015a2a579a56a5966ceb58a0600d3a/docs/MASTER_APP_LESSONS.md#L1240)は有意味な変形を生徒から奪わず、一穴で別推論を飛ばさないことを要求。§11は「途中式を見せる」と「判断を学習者へ残す」を分ける規則であり、穴を最小化する理由にはしない。[数学教科書SPEC §5](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/6bc54447ef015a2a579a56a5966ceb58a0600d3a/subjects/mathematics/textbook/SPEC.md#L109)のTwo-step、[CMD-WORK-001横断監査](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/6bc54447ef015a2a579a56a5966ceb58a0600d3a/governance/INSTRUCTION_DICTIONARY.md#L234)とも照合した。数学SPECは候補要約で、正本の既承認教訓を上書きしない。
- 非作者A/BがN09全41/N10全45nodeを読取監査。N09は優先8nodeと追加確認6node、N10は9つの同型群を列挙（evidence/ux03-full/DERIVATION_PARTICIPATION_AUDIT.json）。既に段階構成できている積/商証明・H07・分配の良い部分と、既確定結果のまとめAUTOは維持する。
- 写真のn09-01の具体例：①右辺を0にする演算→②中項が相殺する二因子の符号→③零積の「または」→④x−4=0での逆演算→⑤x+4=0での逆演算。各操作の正答後だけ次の行を開く。±4の既知値を写す穴だけ増やさない。これは再設計の具体例で、未承認の実装済み扱いにはしない。
- 次は修正案の改訂。完成解法の各一手を、提示する定義/既知事項、学習者が行う新しい計算・比較・変形、確定済みのまとめへ分け、各穴の問い/位置/全候補/誤答理由/解放と旧版移行を定める。既承認UX03を今後の意味変更への承認に転用しない。今回コード/公開は変更せず、合格済み技術試験も反復していない。

## P-W046-UX-04 詳細案の完成（2026-11-02 JST）

本人の「那来吧」を具体案作成の指示として受領。写真だけを局所修正せず、保存済み原因/同型監査とGitHub mainの既存基準に従い、完成解法から各学習操作を割り当てた。正式案は[PROPOSAL.md](PROPOSAL.md)、SHA256 `3b79d7d8859c04945b35b2a695bf69304c3c92046960374c4f950f99da7d3201`。UX03承認案は固定commit85a5367で参照し、今のPROPOSALをUX04 PROPOSED/承認NOへ切り替える。

写真は累乗scope・積の符号・両辺への操作・因子の符号・零積・左右の一次式の逆演算。N10の差の平方/和差の積/最後の展開は、signedSecond一穴から四積全文が自動生成される草案不足も相互審査で発見し、交差積二つの因子対応を追加した。足場の偽等式、hide集合不一致も案の段階で補修。初回所見と再審査を[審査記録](evidence/ux04-proposal/REVIEW.md)に保存。

N09はNEW25/KEEP43/旧版保管3で予定68parts、N10はNEW31/KEEP58/旧版保管5で予定89parts。これは設計の照合値でノルマではない。P/Qの旧後段回答を新しい前段平方へ移さず、K=4を符号付き和−4へ流用しない。旧版hash・pilot・legacy移行の保護は詳細案に明記。

現段階は修正案の非作者審査まで。main正本WORK_SYSTEM §11の改訂案提示/明示承認後実装、§12Aの小ブロック実画像・横断監査・本人総チェックを維持する。製品実装/新規製品QA/新公開/本人受入の完了とはしない。最新Store欠落の本人特例を維持し、失われたイベントや受理receiptを創作しない。

## UX04実装承認・N09代表の限定実装

本人「可以来来来做给我做」をUX04の具体案への明示承認として記録。新しい6判断だけを追加し、N09第6版pilotは41node/52parts、旧46partは同じ意味のまま保持。N10第4版の教材・生成結果はbyte不変。現N09r5 compiledをR5 snapshotへ保管し、r5→r6の厳密hash、r4→r5→r6の鎖、旧版5/4/3の比較routeを追加。

非作者コード審査で、未知hashから旧版/空へのfallback、source/current専用keyより新しいmain reset後回答の保全を指摘。mainの未知hashはcommit前に拒否、新resetのmain ledger全体を採用するよう補修した。136回帰・型/変更lint/buildは合格。browser移行10ケースで旧46保持＋新6のみ/旧r4全38保持＋14追加/新reset優先と回答保持/未知hash保存不変/旧誤答/N10legacy7を確認。旧r4追加9という初回test期待は旧parts数38の照合誤りで、14へ訂正し原FAILを保持。

表示初回320ではfactorSign左italic xのinkがhit域へ入るFAILを検出。左右thinspaceのみ追加して解消。四幅128状態/1192幾何はその版でPASS。その後、通常等号と先頭iffを一groupにした320の不要な細分化を非作者Bが指摘し、因数分解行だけ別semantic groupへ分離した。数学・問い・候補・解放に変更なし。この最終版の必要表示検査・再撮影を実施中。

検査範囲拡張で旧2testfileの5失敗も観測。db99と同じ製品bytesの既存checkoutでも同じ5失敗を確認（古いparent数28/35・r4固定resetkey・旧reader controls/履歴期待）。これを新規FAILとして隠したり、無関係の期待を黙って更新したりしない。既存133scope＋新migration1＋新導出gate2＝136のPASSと分離する。

最終pilot compiledHash `470f137102936e6bb73ca3df835e8c9b27d19c5ce53a40879fe9c2dfa8499a3d`。group分離後の関連76test・型/buildもPASS。routeコードは移行10ケース成功版から不変で、最終migratorは生成後の厳密targetHashだけ追従。四幅の最終画像/幾何と非作者表示審査を次の確認票へ固定する。

表示の証拠を訂正：Bのfont/abort所見から、dev環境のKaTeX font403とfallbackをphase付きprobeで確定。上記のdev四幅128/1192は最終描画の合格根拠として採用しない。製品config/FS guardを変更せず、470fの本番dist previewでfont各faceの読み込みとHTTPを厳密確認して再取得中。操作/保存PASSは別の根拠として維持する。

## UX04 N09代表 — 検査・非作者審査完了／本人の細部確認待ち

固定候補[66c8007b37cc12391c9df574b8ebbb1b95cf26f5](https://github.com/rrikunagasige-dot/kyotsu-step-web/commit/66c8007b37cc12391c9df574b8ebbb1b95cf26f5)、N09r6 compiled470f1371。[確認票](REVIEW_SHEET.md)へ正常フォントの原画像を固定した。撮影working tree基準HEAD778と未commit変更はrawに保持し、候補の変更20blobの同一byte照合で結び付ける。全source manifest505件も前後・現checkout一致。

最終環境は固定依存treeをworktree内へ同一byteのhardlinkで置き、dev FS guardを維持。Main/Math-Italic loadedを各撮影/計測前に276回確認しAMSもloaded、HTTP0/network0。元のshared moduleによる四幅128状態・1192幾何、各幅52正答・代表8part全14誤答、履歴/旧版/reset/N08/N11の指定lifecycleがPASS。非作者Bは正常フォント四幅の数学・先出し・左右枝・番号・N08系統を原PNGで限定PASS。Aは移行/schema/codeと原結果/505manifestを限定確認。両rawreviewをevidence/ux04-pilotへ保存した。

全108PNG/原計測はFULL_SCREENSHOTS.zip（7,145,892bytes、SHA256763ecc172cc2f5531237f4f095c0ead9add231f4aac61aec7907e2f4fe6cb549）、直接確認16PNGと原log/FAIL/403/provenanceを保存。preview別bundleはWeakMap不一致でSOURCE_UNVERIFIEDを正しく拒否し、最終計測へ使わない。旧fallbackの計測PASSも最終合格へ転用しない。

到達点は代表2nodeの検証と非作者審査まで。承認済みUX04のVerification Plan3に従い本人の細部OK/要修正を待つ。これは同じUX04の実装再承認ではない。細部OK後に残り24nodeへ限定適用し、横断/別公開/実働本人総チェックへ進む。公開中のdb99/出版社6bcは今回不変、正式Store受理receipt・本人総合受入・Gold/fitを作らない。

最終の記録governance再検査はFAIL/既存38件。前回governance-records.logのERROR集合38件と完全一致（追加0/解消0）、W046を指すERRORなし。全体PASSへ転用しない。原logはevidence/ux04-pilot/governance.log。

## 本人細部レビュー — 学年相応の推論と正答後組版（2026-11-02）

「x plus4が走形」「中高生にx＋4=0の逆演算を問う粒度ではない」「積からx−4=0またはx＋4=0を導く方が重要」との指摘。これは細部OKではない。原添付はhashだけSOURCESへ記録し公開GitHubへ複写しない。

MASTER§11の必要な途中式/学習価値あるinteractiveの区別を適用できず、「異なる操作の存在」を穴の十分条件とした点をERROR-SPEC/ERROR-QAとして認める。基礎計算を一律削除する反動も避け、MASTER§53のN09Q08の計算/比較、新しい公式を使う計算、絶対値/負数の整数部分/不等号反転等は保護する。

rootが公式EJU2021第1回C1 I問1と2025共通数IA第1問〔1〕のPDFを実取得・レンダリングして確認。条件→式形成→解・条件の判断という単位を参考にする。過去問の転載・原教材の入試問題への置換はしない。Aは全86nodeと未実装UX04の粒度、Bはrendererの全同型経路を読取監査。root統合の技術部分もBが限定確認。各原報告と根拠はevidence/ux05-feedbackへ一本化。

具体例は、積から各因子の零条件全体を生徒に作らせ、x=4/−4への一次処理は続く式で示す。単語「または」だけの穴では主判断を評価できない。異なる意味の新しい条件生成へ旧zeroLogicの回答をaliasせず、削減partを含め旧回答の保存を改訂案で定める。新版番号/最終穴数はまだ確定しない。

今の代表確認票は要修正として履歴保存し、旧UX04を新しい学習設計の承認へ拡張しない。今回の段階は分析と修正設計への入力までで、製品/採点/保存/rendererに新規変更なし。新製品試験の実行もない。

同型監査は全86nodeを18群で対応し、優先候補9群を抽出。N09の符号/逆演算/区間の数値移動、N10の除数選択/差平方の基礎手順の再演/分母scopeの写しを見直し候補へ。N09-Q08の必要計算比較、根号積商の構成・定義域/非零・正性・同定理由、必要な有理化計算はKEEP境界を明記。原sourceと未実装案の変更候補を区別し、候補をそのまま一括実装しない。

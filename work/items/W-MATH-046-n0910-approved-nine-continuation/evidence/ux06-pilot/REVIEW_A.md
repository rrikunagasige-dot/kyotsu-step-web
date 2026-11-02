# UX06 decimal-method代表 実装候補 非作者読取審査 A

対象 `/workspace/scratch/6ff917b2ec4a/w046-ux06-pilot`、source691dからの作業差分。主担当が実装、Aは読取審査のみ。Aは旧N09教材の作者、UX06では主担当具体案のレビュー/CODE入力アダプタを担当したが、この代表製品実装の作者ではない。完全な盲検・モデル独立性は主張しない。

結論：現在の対象hashについて停止を要する確定欠陥は見つけていない。数学/前提・source境界・strict保存接続は下記の範囲で整合。R07の実状態/移行/ブラウザ/字体・本人細部OKは未判定であり、この読取を実検査合格にしない。製品・Store・Git変更、新試験実行なし。

## 承認と未承認混入の境界

- NODE_DESIGNのux06Approvalはproposal hash `a604ffa8f14499973ab5a3799bc1d4d3d605111883ba6046966d812fbacf3840`、本人page818ccd59-f1f5-4505-8e5d-55826804a47a「可以来吧」、代表＋native font/残りは代表細部OK後、r9固定→fullr10/N10r6を記録する。
- source691d原designをgit showで読取りJSON比較。N09 node objectの変更は `n09-decimal-method` 一件のみ、他40node exact。N10unit全体はmetadata/nodeともexact。N09unit metadata変更はfromRevision7→8/toRevision8→9のみ。
- 新decimal-method objectは承認案scratch `CANDIDATE_NODE_DESIGN.json` の同nodeと完全一致。単なるpartID照合ではなくrows/parts/条件/前提/partOrder/terminal等の全objectを比較した。
- 他のUX06対象（負候補・負の平方根平方・負のa・parts-target・N10追加導出等）や3本文変更は混入していない。代表本人細部OK前に本適用を済ませたとは扱わない。

## 数学と生徒の導出

1. `(A+B)^2=(A+B)(□)`で同じ二項式を第二因子へ構成する。
2. 後ろの各項へ前の括弧を掛ける説明の後、`(A+B)□+(A+B)□`へA/Bを構文位置に対応させる。
3. 分配で四項へ展開し、`A^2+□+AB+□`のBA/B²を作る。旧初稿の「BAはABと書ける」を未回答introへ先出しする表現はない。
4. BA/B²が認定されてから交換法則で二つの交差項を同じ順へ揃えた通常式を表示し、ABの係数2を本人が作る。
5. 全6partが正答して初めて、小数候補を分数へ直すこと、分数の平方、共通の平方数の参照値、元の141²/142²計算への橋渡しを表示する。

この順の等式は正答値を入れれば全て成立する。BAとABは可換で同値だが、両方を同時選択肢に出して片方を誤答にはしていない。分配位置のA/Bは第一/第二項という指定と一致する。指数2・文字A/B・係数2の小さな穴に変形の対象と理由があり、文字数だけで浅いと判定しない。一般式を毎行丸当てする形ではない。

初期条件はA/B実数と今回の比較目的だけで、旧assumptionsの完成平方公式は除かれている。`terminalRecord.conditions/conditionParts`には完成式が残るが、domain `projectNestedLesson` はresolved時だけterminalRecordをpublicへ付けるので、これを初期漏洩と誤認しない。初期/部分正答の全publicチャネルを実R07で再確認する必要はある。

introは対応する数式rowと同じrequiresCorrectKeysを持つ実text row。誤答で未来intro/完成公式/141²・142²計算へ進めない設計。afterVisibleTextも全6gateの実text rowであり、非表示metadataだけではない。既存Q08の中項構成・必要6計算・大小比較はnodeごと不変で、代表の結果認定後の使用先として保つ。

## generated/保持境界

- 新activeはN09 from8/to9、compiledHash `de799a4d1ab2db03d204e5024f33aab67cf36d6f8b217a28cdd2a959ebef10d4`。design hash `a962a38671a482d6c5df413573b0b3022c21c4a296f81a5bcc31efc6effae525`。revision9 catalogは31parents/49parts、同じcompiledHashへ束縛される。
- source691dのactive compiledと新R8snapshotはbyte完全一致。新/旧compiledのnode object差はdecimal-methodだけ。旧43partは新activeで全object一致。
- priorUx05DesignRawはsource691dのNODE_DESIGN生bytesと完全一致。builderの新代表designはhash whitelistへ束縛し、N10だけ旧rawへ委譲する。旧475035b4等のhash whitelistと旧pilot分岐を保持し、未認定rawを受け入れる一般迂回はない。
- N10 active compiled、revision5、lesson module、candidatePins.n10はsource691dとbyte/値完全一致。数学上の積/商証明9nodeもそのまま。font変更の表示影響はこのデータ不変とは別に確認する。
- 新schema許可はN09 revision9の明示追加だけ。10/N10r6や任意版へ広げていない。新catalog/active lessonはrevision9へ一致。

## strict移行と旧版

- 新UX06 manifestはr8/hash39634…からr9/from8/hashde799…への完全一致edge一つ。KEEP集合はsourceの全43part集合と一致、NEW集合はtargetとの差分6part集合と一致、RETIREは空。source/targetpart全体が漏れなく分割され、旧43part objectは全てexact。
- `migrateNativeRevisionLedger` は旧UX05 edgesと新UX06 edgesを同じexact照合へ連結しただけ。KEEP stable検査・source ledger検査・records clone・eventID保持・activateRetainedNativeRecordsの実到達gateは変更していない。旧AUTO結論を新6回答へ変換する処理はない。
- RevisionPageはsourceの先頭へR8を追加、中間chainの昇順にもR8を追加。R7以前からR8→R9のstrict chainを通し、旧source既知集合/unknown-native拒否もR8を認識する。最新既知R8の空resetを見つけた後に古いR7へ戻る変更はない。
- version8をsnapshot読取専用へ明示追加。既存readonly局所state、保存なし・新しいmain resetを優先する挙動は変更していない。legacy/N10旧pilot/7件移行の既存経路も変更なし。
- storage key/namespace/reset選択ロジックは変更していない。新r9/hashのkeyへ分離し、r8/他unitの保存をそのまま守る接続である。ただし実ブラウザでの非破壊をまだ確認したとは言わない。

## UX05Full二つのtestのR8固定

`nestedLesson.ux05Full.test.ts` と `nestedMigration.ux05Full.test.ts` の変更は、N09 active importをR8snapshotへ変える各一行だけ。全assertとケースをgit diffで照合し保持を確認した。前者は旧UX05承認設計/代表R7からの残14と43partsの意味回帰、後者は厳密R7→R8 mappingの34KEEP/14RETIRE/9NEWそのものを試す。今のR9へ追従させると別の契約を旧件数で試すことになるため、歴史的なR8 fixtureへ固定することは妥当。

ただしこれを現R9代表の検証に数えない。別のUX06 current testで6NEWの前提順/誤答gate/43保持/将来Q08解放を検査する必要がある。既存testをfrozenにして新currentの空白を隠してはならない。この読取時点では新UX06回帰の実行結果をAは確認していない。

## native fontの限定

CSS差分はconstruction-lesson-reading配下のchoice strongにfont-size:1emを追加する3行のみ。global.cssやKaTeX内部の指数/分数・別readerのselectorを変更しない。N09/N10/同renderer archive/historyへ影響するため、四幅・通常式との実寸・候補の枠/括弧/フォント・旧版をB/rootのR07で確認する。Aのscope/math審査は実font合格を代行しない。

## R07へ残す実検査

- 43完了からの移行で最初の新未回答がdecimal基底となる。新6の各誤答/正答/途中reloadと、旧futureQ08を6完了前に認定しないこと。
- records/firstValue/選択数/timestamp/processedEventIDs、旧part・新parentの組立を保護。旧AUTOや数値一致から新6を埋めない。
- sourceR8/currentR9のstale dedicated＋新main reset（空/1回答）、未知native revision/hashの非破壊、旧chain・N10legacy7・readonly version8・他unit/archives保護。
- compiled/pin/catalogの実validator、targeted tests/type/build、固定sourceの実public/全候補/通常数式・font・四幅画像。本人細部OKをCODE成功から推定しない。
- 後日の全適用はr9を固定snapshotとしてr10/from9（N10r6/from5）。同じr9の別hashへ上書きせず、残り適用を先行させない。

SymPy1.14.0のimport成功と実案graphの検証は主担当が別途実行中と受領した。Aはこの読取でそれを再実行/合格認定していない。

## 初回読取対象ファイルSHA256（最終差分は末尾参照）

|path|sha256|
|---|---|
|work/items/W-MATH-043-n0910-restart/NODE_DESIGN.json|a962a38671a482d6c5df413573b0b3022c21c4a296f81a5bcc31efc6effae525|
|tools/textbook/transformation/nested-lesson.mjs|c41a0efe788d83a9c6a637c4ee2d59dfb7426e0e00f30d152e0b06e5b0d07129|
|src/data/textbook/math/numbers/n09ConstructionCompiled.json|02f91d500fe6dd11f4299f48da288027929eb6ee4ba9f2bc5d3bf57bd5d6d3b6|
|src/data/textbook/math/numbers/n09ConstructionCompiledR8.json|d0820e4d7d795d9c16bde659fe1b58105f0cb364760d5352dd1e87f654a4dcb3|
|src/data/textbook/math/numbers/n09Revision9.json|5623ac05cad9902b7079a3295fa9e1c2a0369f252886b37ece35b3be6783b90a|
|src/data/textbook/math/numbers/n0910CandidatePins.json|cc2a8b67614f9854b00cd43dfd6939ccc4a378052d3c8383e7e02cce71ef0e88|
|src/data/textbook/math/numbers/n0910Ux06Migration.json|e1ebc05e8349c542b0ac954daee3a296b418a394c3da3c074b8f82662b870b1d|
|src/data/textbook/math/numbers/n09Lesson.ts|50beaaad2ac09155122ec587a5e820c97c98cb961f3948e507c27c45d43b815f|
|src/domain/textbookSchema.ts|eb2b3b016e1e43b2f5648f0bb9ff1c39225fb3d4824bd266ee09e6ee412aa5ce|
|src/domain/nestedMigration.ts|724acc2a1dfce7e3c2372b316071f9e77aba6e107a7d1284344d7ac13d36c5f4|
|src/pages/N0910RevisionPage.tsx|22dba711e249a1983342c4d6e84dfa80c1449cb50831d2885de69c61c2e5a5e1|
|src/pages/N0910ArchivePage.tsx|ea8c6d23acdb746845a3077b21f41ed3b59e09867d0c563e2612498cdb28f601|
|src/pages/TextbookUnitPage.tsx|270703c9c3b5b6c10cfd354d5d7fa276f5aaea0a360f59bc92eb25c3f3f4d371|
|src/components/textbook/construction-lesson-reading.css|0668a2795f12df1852678f4926bb17e9141a572c2cfa39600333f03660eb409e|
|src/domain/nestedLesson.ux05Full.test.ts|30ee88133dce82d36a888c69f6034e58bfa78cd1c08ce793069bf065e4dd14a5|
|src/domain/nestedMigration.ux05Full.test.ts|bb6c522edb8b89a0d347530eefd449c897c7a819a8bd48324d53688e19283244|

## 最終source a98640fd の追記確認

最終sourceは `a98640fd2757b2b9766cbbd085d16ea37ec437ad`。数学design a962a386…／compiled de799a4d…は初回読取から不変。残り10導出＋3本文変更は未適用、main未変更、代表の本人細部OKは未受領として扱う。以下は既存の実検査成果物の読取であり、Aが再試験・新たな画像目視を行った記録ではない。画像の見た目の非作者審査はBが担当する。

### 最終CSSとsource同一性

Bの実画像でlead本文だけ16pxが残ることを検出し、既存のchoice strong 1emに加えて `.construction-lesson-reading .reading-paragraph { font-size: inherit; }` を追加した最終差分を直接読取した。native内の本文にも親の18pxを継承させる限定規則であり、global全readerやKaTeX内部の指数・分数を一律拡大する変更ではない。初回の小さいleadと補修前のbrowser/capture記録は `before-lead-font-fix/` に残っている。

`APP_SOURCE_IDENTITY.json` は最終commitのremote tree/blobと隔離appのsrc/public/4entryの一致を記録している。Aも現在のtracked src/public全fileからGit blob/tree hashをメモリ内で独立再計算（Git書込なし）し、src=`ae483ff06ffd0304fa61c952f3ef31c045a66ac0`、public=`f6369a54f998012513d969f83989026cfb78c729` と一致した。package.json/pnpm-lock.yaml/vite.config.ts/index.htmlのblob hashも同記録のlocal/remote値へ一致した。remote再取得はAでは重複実行していない。

### 四幅browser rawの限定確認

`browser/RESULT.json` はPASS、compiled de799a4d…、320/390/430/1440の各22packet（計88）、各errors=[]。RESULTに記録されたCSS/compiled/RevisionPage/migrationの前後4hashが一致し、Aが現在の実file SHA256を再計算しても同じだった。

全packetのleadFont/leadMathFonts/introFonts/conditionFonts/choiceFont/choiceMathFontの実記録を集計し、存在する各roleは全幅18px。指数等の内部glyphを18pxに固定したという意味ではない。各幅のlifecycleはpartialReload、onlySixNewAnswered、old43HistoriesPreserved、completionReload、archiveReadonly、resetReloadがtrue。6part各誤答・正答、履歴、R8読取、resetの実assertをbrowser.mjsの処理と照合した。これは今回の代表の実測範囲の合格であり、全N10画面や残り10導出の実画像検査を行ったことにはならない。

### 回帰と数理の原結果

- `baseline-tests.log` の旧UX05意味/移行/renderer18件PASS、`meaning-migration-tests.log` のdesign13＋既存migration63件PASS、`corrected-tests.log` のUX06新3＋current schema18件PASSを読取。重複を除いた組合せで115件＝新3/既存112。単一runで115件を実行したと書き換えない。
- 初回の新testのfixture part検索ミス1件、current revision/件数/reset keyの旧期待値2件は原FAILログに残る。最終の新3testを直接読み、43record保持/6NEW各誤答gate/新6だけの完了/初期完成式非公開/他40object不変/unknown source-target hash/altered KEEP拒否をassertしていることを確認した。
- `textbookNestedContract.test.ts` は現revision9/31parents/49parts、reset archive key9へ意味を保って更新し、assert削除なし。前述のUX05二fileのR8固定と役割を分けている。
- native-tests.logは9/9 PASS。build.logはbuild完了を記録する。typecheck/lintのログは空で、主担当の正常終了報告を受領しているが、空ログ単独を成功の証明とはしない。Aは再実行していない。
- restored SymPyの `math/CODE_OUTPUTS.json` を直接読み、実案の一般平方graph5transition全てidentity PASS、engineVersion1.14.0、formalProof=false、EXACT_SYMBOLIC_CHECKSを確認。graph teachingはNEEDS_AI_REVIEW。以前のdependency不足UNSUPPORTEDは、既存環境復元後のこの実行成功と区別する。全11blockの数学機械証明を意味しない。
- math/CODE_SUMMARYのraw採否NEEDS_AI_REVIEW、proseIR NOT_RUN、meaningImport NOT_RUN、formalStoreReceipt=falseはそのまま。成功したgraphだけで未実行範囲を埋めない。

### 残る境界

今回のbrowserは43完了→6NEW、途中/完成reload、R8閲覧、current resetという範囲。sourceR8/currentR9のstale dedicated＋新main reset各空/1回答、全旧chain、全旧版の試し解答、別unit/未知nativeの全browser組合せをこの88packetで網羅したとは言わない。既存厳密ロジックの読取・関連unit回帰と、今回実browser範囲を分ける。本人代表細部OKの前に残りを適用せず、本適用でR9 snapshot→R10/R6を使う条件は継続する。

### 最終差分・実結果SHA256

|file|sha256|
|---|---|
|src/components/textbook/construction-lesson-reading.css|00aa7db228b56f768dfc9050e382b0effbe24f501979d236457b8a11c8458254|
|src/domain/nestedLesson.ux06Pilot.test.ts|aec8f30d5497eab780bc4eb6d3d56b7a8e21ce8c7a98c3bec253917d76f98f72|
|src/domain/textbookNestedContract.test.ts|602ce098699789ff44233677c008a855049f4d6af54ebcc80a6260103dd59e20|
|APP_SOURCE_IDENTITY.json|eadda64898c563ca6461c362a054feb8ca159a5e27808a0fbe1744503b3066ff|
|browser/RESULT.json|8c1d045a0aa3437f1b51d0988bdecc8469aff9c497731afdd19cdbf4619096e2|
|math/CODE_OUTPUTS.json|7bf66984bd7b3eb67d5c61ea2f3d8514591cfd000dd4ae9091fec0ac16ace7a4|
|math/CODE_SUMMARY.json|a86c6ff5ac7e81a43172ce6115b20b317a29a1058db45f349f0aa5f73c585d38|
|baseline-tests.log|ee923ce9c66e9dd8cf94fdc0b1d758ec1d51c3ed6e2cd7874655e00da00cf860|
|meaning-migration-tests.log|3a606ceaeb6fdca88cb8ab450b9c46626b5e5d8bea20604ab8fd3c970024e50d|
|corrected-tests.log|515e952d934e5ff84d8da2fd288f4a9df58b79f6a41362067423a2204c65cdce|
|native-tests.log|2d0c4c3a0c982f2cc719bc14fb51f67c007f6f51a30616dce9ffc98685ea2924|
|build.log|d7c5b4e49dbf26c65a4e18e785322d96d82d4023c6479752055e91453153a4e9|
|typecheck.log|e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855|
|lint.log|e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855|

## 実fontロード検査後の訂正・最終追記（source a986不変）

**前節で読取確認した旧 `browser/RESULT.json` の88packet PASSを、現在のfont/表示合格根拠として撤回する。** 旧harnessはdocument.fonts.readyだけを待ち、外部node_modules symlink先のfont403を検出していなかった。computed font-size=18pxというCSS値だけでは指定KaTeX fontのロード・実寸を証明できない。旧記録は `before-real-font-check/` へ退避し、消去しない。Aも旧結果を実font確認済み相当へ広げた点を訂正する。

環境修復は既存依存をpilot内へhardlinkコピーしてfont配信可能な配置へ戻したもの。ソース・assetの改変やfs許容緩和、新installではない。`FONT_DEPENDENCIES.json` のMain-Regular/Math-Italic woff2のSHA256を実fileから再計算し一致した。製品source a986、design a962、compiled de799は不変。

### 今回のfont検証を含む現在の88packet

`BROWSER_VERIFICATION.json` は新しい二つの実行を集約し、各widthをその生RESULT path/hashへ束縛する。Aが生JSONのSHA256を直接再計算して対応を確認した。

|生batch|対象|実結果|
|---|---|---|
|browser-diagnostic/RESULT.json|320|22packet、12誤答状態＋6正答状態ほか、errors=[]、全lifecycle true|
|browser-remaining/RESULT.json|390/430/1440|各22packet、各12誤答状態＋6正答状態ほか、errors=[]、全lifecycle true|

両harnessは各capture時に `document.fonts.load('18px KaTeX_Main')` と `document.fonts.load('italic 18px KaTeX_Math')` を実行し、loaded Main/Math italicとerror0をassertする。HTTP400以上をrun.errorsへ追加し、各run末尾にerrors空を要求する。生runのfontStatusに両font loaded/error0、88packetの存在するlead/lead-math/intro/condition/choice/choice-mathの各roleに18pxが記録されていることを読取集計した。両RESULTは前後4source hash一致、現在のCSS/compiled/RevisionPage/migrationとも一致。

今回は新font版がpartialReload、43旧履歴保持、6新穴のみ回答、completionReload、履歴、R8 readonly、resetReloadまで完了している。旧font版のgeometryや見た目合格を流用したのではない。各画像の内容・見た目の最終審査はBの担当で、Aはこの追記で画像目視を行っていない。

### timeout原記録の扱い

`REALFONT_RELOAD_TIMEOUT.json` と旧固定port実行の原ログを保持する。これをPASSへ書き換えず、server生存guardを加えた診断serverで完了した新実行と分ける。後の実行成功だけで、元timeoutの原因がport競合や環境だったと断定しない。font403の検出/修復という確認済み原因と、reload timeoutの未確定原因は別である。

### reset/unknownの新6ケース

`reset-unknown/RESULT.json` はexpectedScopedCaseCount=6/caseCount=6、6件全てPASS、errors/failures/httpErrors/networkFailures/abortedRequestsは空。各fontChecksはMain/Math italic loaded/error0。次の範囲を直接読取確認した。

- R8→R9 source復元で新しいmain resetを優先：reset後0回答、reset後1回答を各保持。
- currentR9復元で新しいmain resetを優先：reset後0回答、reset後1回答を各保持。
- unknown current main hash、unknown future revisionを拒否し保存非破壊。

RESULTの前後sourceManifestは521files全一致。Aが現在の隔離コピーの全521file hashを再計算して不一致0、現在の実script hashもRESULT.scriptHashと一致を確認した。RESULT.sourceSHAはローカルcheckout baseの691dを記録しているため、これをa986と書き換えない。実候補a986との対応は当該manifestと `APP_SOURCE_IDENTITY.json` のapp tree一致による束縛として区別する。テストはsynthetic ledgerで、実利用者記録や正式Storeイベントを作成していない。

この6件は旧24ケーススイートの再実行ではなく、今回追加したR8/R9 reset・unknown範囲の検査である。前節の当該4reset/2unknownは、この実結果の読取により確認済みへ更新する。旧chain全列挙・N10全保存・全旧版操作まで網羅したとはしない。

残り10導出＋3本文は未適用、main未変更。formalStoreReceipt=false、本人代表細部OK待ち、将来のr9固定→r10/N10r6という境界を保持する。

### 新font版・追加保存検査の証拠SHA256

|file|sha256|
|---|---|
|BROWSER_VERIFICATION.json|9494692b12e5315100225e6684d7bb7cd45c73c00b6195d10bc8a7763f0c8e65|
|FONT_DEPENDENCIES.json|37148da1bb3059e791c286ba559dd34747185088b79b95af68e2c25bb4b32237|
|browser-diagnostic/RESULT.json|4a4e8a132808b2722f31ceacafaa133980f463ffb0f70ca4584cfcf02b0a66ed|
|browser-remaining/RESULT.json|015a864e7cecbe940e3cf15046e8d198ad61122ff3b18272a93c66e92211967d|
|browser-diagnostic.mjs|111ecf6605d3c14927dd029cc43f3b6f407c1802cfc9891da7632b85aa4ff555|
|browser-remaining.mjs|3e1c5049b5cd0697956e4ee47dc44ac6b2a4f5d203d92f28f8fe043e076add59|
|reset-unknown/RESULT.json|8473dd3898db4a1cba3a2da73941d49b867a335e6120118c75a63135656e5a03|
|reset-unknown-browser.mjs|4b332dc6e78cc6ba9db38bb1e5f01bb7406cba61572b43eac301a3a788aab43c|
|REALFONT_RELOAD_TIMEOUT.json|93ed108dde0415fe530fb55f8d1d2a5cf2b0b9d93904eeb1f5070cbb5f76acc0|

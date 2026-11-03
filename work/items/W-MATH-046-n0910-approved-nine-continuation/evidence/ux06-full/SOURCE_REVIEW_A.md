# UX06 full N09r10/N10r6 — 数学・保存・scope非作者読取審査 A

初回対象：N09 compiled `72481c4a87aa2bb824596399c25ee8360c60b43c7895f7524496300b913df845`、N10 compiled `28345b47de2d82a7382666f337f106000f6cd59eab67aadcaf58abb03392a37e`、design `f4d5a008aebaf44ff5c28f62854b39cb79bb78c9db9dca75318d8aea40bd4ae9`。

最新読取判定：source `5e83a17ba73c39f855384b31fc51488028b96a09` でA-01/A-02を解消。数学/保存/scopeの読取に未解決の修正必須指摘なし。R07/G2実結果・本人全体受入を代行しない。

作成者はroot。Aは今回full製品を編集していない。以前のN09教材/UX06 CODE入力アダプタの作者履歴を保ち、今回の数学・前提・保存・scopeの非作者読取と、過去の自分の判断の自己点検を分ける。独立モデル/盲検は主張しない。製品/Store/Git編集・新テスト実行なし。本書だけを許可された監査文書として保存する。

**初回判定：REVISE（下記2件／最新補修で解消、末尾参照）。** 保存・限定scopeの接続は整合しているが、本人が代表で指摘した具体問題→一般文字の唐突な移行がN10の2nodeにも残る。候補ID/承認表との一致をこの点の理念適合の代わりにしない。

## 修正が必要な具体所見

### A-01：n10-q11-formula、n10-q13-identity の一般化の橋渡し

q11のleadは具体的 `(√2−√3)²` を示した後、初期の式が `(A−B)²` へ移る。条件はA/B実数・具体例だけで、A/Bを何の二項として置くのか、なぜ一度一般式を作るのかを初期の文章が説明していない。具体的根号への対応は最後のintroに初めて現れる。

q13も具体的 `(√7+√2)(√7−√2)` の直後に `(A+B)(A−B)` が出るが、一般の二項と具体の対応は初期に説明していない。q11で同じ記号を使った経験はあるとしても、今回どの二つの数かを読者の推測だけに委ねる必要はない。

本人が代表で求めた同じ原則として、両nodeの初期本文へ「二つの項をA/Bと表して共通の仕組みを調べ、その結果を元の根号へ使う」という目的と対応を短く示す。q11はA=√2/B=√3、q13はA=√7/B=√2。新しい穴・完成中項・交差項の正答を先に言う必要はない。既存の式内符号/係数/pairの活動を残す。

### A-02：q13初期条件の既習根拠

q13のassumptionPartsは依然「既習の分配法則と和と差の積を使う。」である。承認案はN04q8資産の存在と本人の受講完了を区別し、今回のnode内で和差積の根拠を可視化する方針だった。使う既習の分配/交換法則と、いま確かめる和差積の性質を分けた条件へ改める。

N04に導出がないという指摘ではない。資産は存在するが、それを本人の既習認定として自動利用しないという境界である。この変更で旧KEEPの問い/数学対象が変わる場合は新keyへ再判定するが、単なる根拠説明の是正から無関係な穴の増殖はしない。

## 読取で確認できた整合

### scopeと承認案への対応

- 原Work head da02285のdesignと現fullを独立JSON比較。N09変更8node、N10変更6node、計14nodeで、UX06の11再設計＋3本文の集合と完全一致。集合外のnode変更0。
- 代表decimal-methodを除く残り13nodeは、承認proposalのnative candidate objectと全体一致（partIDだけでなく本文/条件/row/gate/terminal/sourceCoverage等を含む）。代表は今回の条件付き本人フィードバックの2点修正を保持する。
- apply-full.pyはproposal hash a604…を照合し、gzip native候補から代表以外の承認集合だけを移す。integrate-full.pyはr9/R5の実sourceからKEEP/RETIRE/NEWを完全分割し、同IDでpart objectが異なるケースをassertで止める。旧R9/R5snapshotはda02285の各active compiled生bytesとexact一致。
- full designのux06Pilot=falseなのでN10を旧rawへ戻すpilot分岐は発動せず、N10r6の承認内容が有効になる。旧raw/hash allowlistは保存されている。

### 数学と段階の配置

- n09-q01-negative：基底−4を因子へ作る→平方値16。powerActionの文章選択へ新しい意味を流用しない。
- n09-q02-negative-square：−√5をもう一因子へ→負号の積1→根号定義の5。intro/完成後文は対応する前提正答後に開く。
- n09-q04-negative：a<0から−aの正性>、平方a²を本人が確かめた後に√(a²)=−a。候補を検証する目的と二条件が一致する。
- decimal-method：本人が肯定した6穴を保持し、具体の平方目的/140+1・140+2/A・B/具体適用へ戻す本文と、主導出5行共有/補助別groupの2点修正を保持。
- parts-target：定義と0≤r<1から0≤x−n<1へ、その各辺へnを加えた区間の両端n/n+1を本人が作る。易しい逆演算は説明として示し、そこだけを小問へ増やさない。
- n10-q01-square：基底t√5、指数2、根号平方5。未証明の根号積公式を使わない。既存t²=25等の適用計算は不変。
- q11：同じ差の積→分配→最後の＋→交差項の係数2→根号への具体中項。数式は正しく、A-01の文脈改善が必要。
- q13：交差項の−→和0→平方差→具体根号のpair。数式とgateは正しく、A-01/A-02の本文/前提改善が必要。
- n10-15：上下同じ因子を式内で構成→分母の指数2。1×√3だけの旧partは退役し、新操作へ同key流用しない。
- n10-17：分子√3cと掛ける分母全体√3+√2を構成後、認定したcを具体値へ代入。単なる値の写しに留まらず分数の作用範囲を扱う。
- n10-20：分子の平方指数2と分母の平方差の−を別々に作る。4/3は比較で確定済みの実前提から再利用し、前に戻って再計算させない。

各式に正答値を入れた関係は数学的に成立する。これはAの読取による意味判断で、全125partの実操作・機械証明・実画像合格とは別である。条件/本文に見える候補自体と、候補が定義を満たすことを本人が判断する活動を混同して先出し扱いしない。

### 保存と旧版の鎖

- N09 r9→r10は48KEEP/1RETIRE/7NEW→55parts。48は旧基礎42＋代表6であり、43基礎全部保持という誤った表現をしない。
- N10 r5→r6は58KEEP/2RETIRE/12NEW→70parts。
- 両manifestのKEEP/RETIRE/NEWをsource/target全part集合と独立に照合し、分割完全・交差なし・全KEEP part object exactを確認。3退役を別の新操作へaliasしない。
- N09既存r8→旧r9の43KEEP6NEW edgeは残り、r8利用者はr9→r10を通る。旧AUTOから新しい回答を生成しない。records保持と現在到達可能なdraft認定を分けるactivate処理は変更していない。
- RevisionPageはsource最新版R9/R5を先頭、intermediatesへR9/R5を昇順追加。unknown-native guardのknown集合にも入る。空resetを見つけた後で古い版へ戻す変更なし。旧N10pilot同rev→R4→R5→R6、legacy7件の既存経路を残す。
- catalog/pin/active lesson/schemaはN09r10/from9・N10r6/from5へ一致。version9/version5を不変snapshotへ向ける明示archive routeを追加。readonly/namespace/resetロジックは変更していない。
- 上記はsource読取で、r9/r5の部分/誤答/未来record、新reset後0/1回答、未知hash、旧chain全列挙、readonly試し解答/他unit非破壊の実検査はG2証拠で別に確認が必要。

### 保護と既存回帰の扱い

- 積/商証明の9nodeは旧N10R5 compiledと全object完全一致。指数/文字/符号の有効な小穴と証明順を保持。
- Q08左右の新leadは一般式の具体適用を説明する本文変更のみ。既存4partずつ・必要6数値計算・大小比較は保持し、未来結果を先に出さない。
- old UX05 N10・UX05 migration・UX06 pilotのtestsを各R5/R9 snapshotへ固定するimport変更は、その歴史的な厳密契約を試す範囲として妥当。全assertを残し、現fullの125part検証の代わりにはしない。新current full回帰が別途必要。
- nested-run-measurementsの4行は、同じALIGNED group/mode/layoutStateの局所columnだけでなく絶対relationX一致を追加検査する強化。数式意味や採点を変えない。対応回帰/幅ごとのstate bindingはB/rootが確認し、Aはこの読取だけで新checkerの実試験成功を主張しない。

## G2に残る条件

A-01/A-02の是正後、最終compiledHash・manifest targetHash・pins/catalog・CODE/意味/実画像を同じ最終sourceへ束縛して再確認する。3de5a6代表限定28状態や旧pilot88packetをfullr10/r6の実検査へ流用しない。4幅、全new/wrong/KEEP解放、history/reload/reset/旧版の同じ公知状態を理念監視者が反証する。

本人の条件付き続行権限により、適用前提を満たせば再質問せず進めるが、公開/main/全体受入/正式Store PASSEDへ拡張しない。26欠落特例を保ち、空Store/架空receiptで工程を補わない。

## 初回読取対象SHA256

|path|sha256|
|---|---|
|work/items/W-MATH-043-n0910-restart/NODE_DESIGN.json|c96418c7aa41e30270ddce68e684fd98d1fed3224bf84a495ff9ff6a31fce1e4|
|src/data/textbook/math/numbers/n09ConstructionCompiled.json|62babe0c9bfc4e47d920fbd6abe09f55d7b0b9b5bd51afdfd9f8a0dd5e0a106d|
|src/data/textbook/math/numbers/n10ConstructionCompiled.json|facd768ca7aa6df88ef98288838bb9e1e2e9b2eedc0a991a4c1a252ed9bc643b|
|src/data/textbook/math/numbers/n09ConstructionCompiledR9.json|02f91d500fe6dd11f4299f48da288027929eb6ee4ba9f2bc5d3bf57bd5d6d3b6|
|src/data/textbook/math/numbers/n10ConstructionCompiledR5.json|ec66a8247aeeab32684e92868db78a2fff346fb286669a974646c76c0ad75f71|
|src/data/textbook/math/numbers/n0910Ux06Migration.json|07fb35c0a53b78dd7e922eb18eff2bf146e47b08e7f9d9ce5442fd24208677f9|
|src/data/textbook/math/numbers/n0910CandidatePins.json|0677fcfcaabde5b4efb55ec51945377dd8b76f0fdeb6e101330454036ac345a2|
|src/pages/N0910RevisionPage.tsx|6753ea46ed117c6229c69a1751f301c3096275e24c912b98cadb8e7aed98f8f8|
|src/pages/N0910ArchivePage.tsx|321b2b864c22a96eb842ab5dd9fccd60ec2bbde1a52e341678aaf6669e331d61|
|src/pages/TextbookUnitPage.tsx|28560905206edb08a1cf1460692e9ccda9d7857d9b884af56dafa1ff42b9ed5f|
|src/domain/nestedMigration.ts|724acc2a1dfce7e3c2372b316071f9e77aba6e107a7d1284344d7ac13d36c5f4|
|src/domain/textbookSchema.ts|f6156ad017672b66b0dc5b01926240efe038a215e755799c2491425ac423c246|
|tools/textbook/transformation/nested-lesson.mjs|ce6207cd726e29edea8d4383e35a06386b07e0aeae3fd3ae37dbcf60bd6811d1|
|tools/textbook/layout/nested-run-measurements.mjs|ab9fae2dec770a410dd82cf65e4e157a6174cfd2e227be20629aaed25af9e079|

## 指摘是正後の最終source照合（A-01/A-02解消）

source `5e83a17ba73c39f855384b31fc51488028b96a09`、design `c96418c7aa41e30270ddce68e684fd98d1fed3224bf84a495ff9ff6a31fce1e4`、N09r10 compiled `7ccea0daae7cc9fa65ccf36ab0b0f8680a17116d633da65a405338ba086f340b`、N10r6 compiled `6ecda0e4bb4458f4d8876a8fe0cf4b8deb10aafda96ce76e0926f4dd18403879` を直接読取した。旧724/283/f4d版の指摘を消さず履歴として保存する。

- q11初期leadは二つの数をA/Bと表す目的、差の平方の仕組みを調べること、分配で確かめてからA=√2/B=√3として元へ戻る対応を明示する。A/B実数・分配法則を使う条件で、完成中項や係数2の具体正答を前出ししない。
- q13初期leadも一般A/Bで和差積を調べてからA=√7/B=√2へ戻る対応を説明する。条件は実数・分配/交換法則だけで、これから導く和差積を既習と推定していない。交差項−/和0/pairの具体答えを初期説明が済ませない。
- したがってA-01/A-02は解消。今回本人指示に基づく本文の意味接続の是正であり、採点対象を別課題へ変える変更は確認されない。
- N09もglobal designRaw更新によりcompiledHashが変わったので、N10だけでなくN09のstrict edge・pinを新artifactへ追従する必要がある。現manifest target hashを両新compiledへ一致確認した。旧r9/r5 snapshotは固定されたまま。
- 48/1/7、58/2/12のpartitionを実source/target部品集合から再照合。KEEP全part object exact、集合交差なし、漏れなし。旧N10R5との積/商証明9node全object不変も再確認した。

現在の読取で未解決の修正必須指摘はない。数学的同値・課題の意味・新旧ID・保存のsource接続の監査結果であり、4幅全public/全125part/旧chain/保存reset/実画像の実検査や、最終アプリ受入を自動合格にしない。現在の実browser進行中結果をPASSとして記載していない。Store26欠落特例、公開別権限の境界は不変。

### 最新読取対象SHA256

|path|sha256|
|---|---|
|work/items/W-MATH-043-n0910-restart/NODE_DESIGN.json|c96418c7aa41e30270ddce68e684fd98d1fed3224bf84a495ff9ff6a31fce1e4|
|src/data/textbook/math/numbers/n09ConstructionCompiled.json|62babe0c9bfc4e47d920fbd6abe09f55d7b0b9b5bd51afdfd9f8a0dd5e0a106d|
|src/data/textbook/math/numbers/n10ConstructionCompiled.json|facd768ca7aa6df88ef98288838bb9e1e2e9b2eedc0a991a4c1a252ed9bc643b|
|src/data/textbook/math/numbers/n0910Ux06Migration.json|07fb35c0a53b78dd7e922eb18eff2bf146e47b08e7f9d9ce5442fd24208677f9|
|src/data/textbook/math/numbers/n0910CandidatePins.json|0677fcfcaabde5b4efb55ec51945377dd8b76f0fdeb6e101330454036ac345a2|
|src/pages/N0910RevisionPage.tsx|6753ea46ed117c6229c69a1751f301c3096275e24c912b98cadb8e7aed98f8f8|
|src/pages/N0910ArchivePage.tsx|321b2b864c22a96eb842ab5dd9fccd60ec2bbde1a52e341678aaf6669e331d61|
|src/pages/TextbookUnitPage.tsx|28560905206edb08a1cf1460692e9ccda9d7857d9b884af56dafa1ff42b9ed5f|
|src/domain/nestedMigration.ts|724acc2a1dfce7e3c2372b316071f9e77aba6e107a7d1284344d7ac13d36c5f4|
|src/domain/textbookSchema.ts|f6156ad017672b66b0dc5b01926240efe038a215e755799c2491425ac423c246|
|tools/textbook/transformation/nested-lesson.mjs|ce6207cd726e29edea8d4383e35a06386b07e0aeae3fd3ae37dbcf60bd6811d1|
|tools/textbook/layout/nested-run-measurements.mjs|ab9fae2dec770a410dd82cf65e4e157a6174cfd2e227be20629aaed25af9e079|

## migrationbrowserのRETIRE期待値訂正の非作者確認

`/tmp/ux06-migration-retired-expectation-failure.json` と修正後の `/tmp/ux06-migration.mjs` を読取。これは製品の保存ロジック変更ではなく、テストfixtureの期待を承認済みKEEP/RETIREへ合わせる是正で、妥当である。

原FAILは `reset-stale-math-numbers-expressions-n09-r9-to-10-1` で、source r9のreset後最初の1回答 `n09-q01-negative::powerAction` がtarget recordsにも残ると期待したことにより生じた。現manifestはそのpartを唯一のRETIREに指定する。製品がtarget recordsへ入れず、旧main ledgerをarchiveへ保存する挙動はこの契約と一致する。原FAILはcase7/expected18で中断し、実行未完をcoverage FAILとして残しているので、そのrunを18件成功とは呼ばない。

修正後fixtureは、source recordsとtarget part集合の交差だけをretainedへ入れる。Aは現manifestのKEEP集合＝source/target交差、RETIRE＝powerActionのみを既に独立照合済みなので、このfixture選択は現在のKEEPに一致する。

- r9 reset後1回答：その1件はRETIRE。target record数0が正しく、旧ledger全体はarchiveに残る。元のprocessedEventIdsは由来として保存される。
- 新設r9 reset後2回答：RETIRE powerAction＋KEEP `n09-q01-negative::value`（16）。targetへ残すのはvalue16の1件だけ。新しいux06RepeatedBaseが未回答なら、その後続の旧valueは保持recordでも未到達のままにする。
- reset後0回答、source/current両unitの0/1回答、未知native hash/future版等の他ケースを残し、予定総数を19へ増やした。count19未達ならFAIL、filter実行はDEBUG_ONLYとする契約も確認した。

期待を弱めてall records保持を捨てただけではない。現scriptは旧main ledger archiveのdeepEqual、KEEPのrecord field一致、resetAt、onlyInitialのtarget record件数、processedEventIds、旧専用keyのbyte不変、未知版時の保存非破壊のassertを保持する。RETIREした解答を新しい課題へaliasする期待を取り除き、KEEPの回答保持を2回答fixtureでより直接に検査する変更である。

この追記時点では19ケースの実完了をAは確認していない。原FAILと期待訂正の妥当性を審査した記録であり、実行中をPASSへ変換しない。

証拠SHA256：

- /tmp/ux06-migration-retired-expectation-failure.json：`b665dd98a1662a308e7883f2c573d8a5a7cb62ce345d1a722518d6eae7340b25`
- /tmp/ux06-migration.mjs：`e33d222b6252c2a4e5fd9da8ed8d1af6d9452fb4b19e526fdb3deeb6dc1b595b`

## G3前：本文CODEの実利用・互換範囲の追加監査

読取時HEAD `3633eb2139a3ba1217c5308fda7c905445a7e9d8`。現在はG2の限定監査統合後、G3の準備/既存公開経路へ進む段階で、公開/本人総チェック受入は未実施。最新本人の日本語統一と「火柴図→詳細手順→root/A/B/CODE分担」の順を工程入口へ反映し、本文CODEの未実施を過去の合格へ紛れ込ませない。今回も空Store/Runtime初期化・製品変更・独自checker作成はしていない。

### 実記録への反証

`ux06-proposal/run-code.mjs` はsummaryへproseIR NOT_RUN/meaningImport NOT_RUNを明示する。`ux06-full/native-ops.mjs` が明示呼出するoperationはconstruction-validate/blank-candidates/interaction-planだけ。したがって「S11 prose.compose/S12 text.verifyを個別に実行した」「本文IR生成までCODEが完了した」とは言えない。以前のNOT_RUNは履歴として維持する。

一方、construction-validateはnative枝でvalidateNestedTransformationPlanを呼ぶ。同じ関数はoperate('verify-ir',{ir,transformationPlan})のnative枝にも使われ、source/planの完全対応、validateDesign、layout契約、math rowの閉じた文法を検査する。よって「本文を含むnative構造のCODE検査が全くなかった」も誤り。**同じ下位構造検査を通った事実と、本文機能として実入力/実出力を明示した記録の不足を分ける。**

### 既存本文実装ができること

|処理|入力/実装/出力|保証しないこと|
|---|---|---|
|S11 prose.compose/S12 text.verify|workflow/runner.pyでは両方とも既存verify-irへ対応。nativeの{ir,transformationPlan}ならoperationsがvalidateTransformationPlan→validateNestedTransformationPlanへ渡す。nativeの各本文/条件/行/gate/sourceを含む構造出力。|日本語の因果説明を自動執筆する処理ではない。PASSでも文章の論理/読みやすさはAI審査が必要。|
|operationSentence|prose/index.mjs。AIが渡したsubjectPartsとpurposePartsの間へanswerSlotを挿入し、operation.targets、subtractのdirection等を束縛したproduction-ir/1形式paragraphを返す。|新しい教授内容や理由文を発見しない。入力した文の意味の正しさも証明しない。|
|quantity|value/semanticRole/appliesToと単位/表示方針を持つ数量objectを返す。|日本語本文生成やnativeの数学条件・保存意味の証明ではない。|
|native教材生成|既存NODE_DESIGNのleadParts/assumptionParts/text/math rows/terminalをsource-bound planへmaterializeしcompiledへ組み立て、rendererが可視gateに沿って表示。|元の言葉・式の段階はAI作者の設計。CODEが自発的に全本文/思考分解を生成したとは言わない。|

operationSentenceのanswerSlot/paragraphは旧production-ir/1のpart契約で、今のn0910はmath slot＋gate付きtext rowが中心。これはそのまま同じJSON型ではない。手元の本文に合わないhelperを呼び、slotを捨てる/出力を使わないだけで「本文生成CODE利用」と数えるのは不適切。helperに合わせて新しい本文穴・二重slot・UIを追加することも今回の承認範囲から必要とは言えない。

production-ir/2はpurpose/reason/afterTextとgraph/state/slotTargets等を要求し、n0910 Authoredをそのまま渡せば適合しない。一般根号やOR論理等にも対応境界がある。G3直前に全教材を別IRへ再設計したり、正解/私有rationaleを可視本文へ写して形式だけ通したりしない。

### G3前に補う最小の実施事項

1. **既存S11/S12相当のoperationを実際に直接実行する。** 現候補の各unitで、sourceRaw/承認済designRaw/asset hashから既存buildNestedTransformationPlanを使い、実際の{ir:JSON.parse(sourceRaw),transformationPlan:plan}をoperate('verify-ir',input)へ渡す。現在compiledとplanHash/source/design hashが一致することを記録する。入力/実装hash/出力/対象unitを保存し、正式Store receiptとは呼ばない。新しいcheckerは不要。
2. **判定範囲を明記する。** native構造・本文配置/gate/source対応の既存CODE結果であり、自動執筆/因果意味/全数理証明ではない。旧NOT_RUNを後日成功で書き換えず、今回実行分を追記する。CODE FAILならG3へ進めず入力/実装の該当箇所へ戻す。
3. **既存の実publicの意味審査へ結ぶ。** Aの数学/前提/保存のSOURCE_REVIEWとBの理念/文章/実画像RENDER_REVIEWのうち、今回14nodeの目的→使う対象/規則→式内操作→正答後意味→元問題復帰を照合した箇所を索引化する。A/Bの私有理由欄や「本文がある」というだけを根拠にしない。これが既に同じ最終sourceで確認済みなら、新しい全再審査を義務化せず、その実根拠を対応させる。
4. **本人へ分担を日本語で正確に示す。** rootは要求/本文設計統合/公開判断、Aは数学・既習・保存とroot実装の反証、Bは理念/文章の接続/実画像/工程の監視、CODEは既存の組立・構造検証・候補等。本文の言葉をAIが作ったこと、CODEが組立/検証した範囲、未対応を分ける。火柴図の工程→詳細操作→この分担の順で説明する。

この不足は、現在の製品に新しい数学欠陥があると確認したものではない。本文機能の実施記録と主張範囲を正すためのG3前補完である。本人の既承認を聞き直す条件ではなく、現在の続行権限内で既存関数の直接実行と証拠整理を完了できる。本文の自動生成器が存在しない範囲を、名前prose.composeから存在すると推定してはならない。

### 本追加監査の読取実装SHA256

|path|sha256|
|---|---|
|workflow/runner.py|f4e09bd4811c1816e655d9d30de9c2e078b7202a59498ae7bdef0718fbea169c|
|tools/textbook/operations.mjs|14141b312ae939405285ca8bb0c5e24e78cc5c9a56d12413a00a8de10a4f8530|
|tools/textbook/prose/index.mjs|3236e9fac02347e8c50ec468aacba02ab1c0c836a94e78ccba47eaacefbd951b|
|tools/textbook/transformation/nested-lesson.mjs|ce6207cd726e29edea8d4383e35a06386b07e0aeae3fd3ae37dbcf60bd6811d1|
|tools/textbook/ir/index.mjs|f4dc507498c31c5135f4e7623916683b3b544513ca7105fbd45b895a86cd53f8|
|work/items/W-MATH-046-n0910-approved-nine-continuation/evidence/ux06-full/native-ops.mjs|e007308e1143d9a272972112e00992dca91e22718d2af7f3dcd24f85a5800e37|
|work/items/W-MATH-046-n0910-approved-nine-continuation/evidence/ux06-proposal/run-code.mjs|cb2a866a217ba8237b137abf3b0db22da86a0912e1a6dfe10d506cf7d3e36908|

## 既存S11/S12直接実行後の確認とU07本文意味応答 A

主担当が提案した最小補完を実施し、PROSE_CODE_CHECK.jsonへ両unitのverify-ir直接実行を保存した。Aはその実入力binding/actual dispatch/result/coverageを読取。N09/N10ともPASS、meaningAuditRequired=true/automaticAcceptance=false。明示実行の不足はこの実行で補われた。過去のproseIR NOT_RUNを遡って成功へ改記しない。

coverageはN09 41node・26text row、N10 45node・25text row、合計86node/51text rowで、lead/条件/assumptionParts/text row gate/terminal等がcompiledと一致することを表す。これは文字列・構造のbindingであり、51行が文章として十分、86nodeが全て因果的に教えられる、あるいは自然な日本語をCODEが自動作成したという証明ではない。terminalRecordがsourceに束縛されることと、それを新しい可視memoとして表示することも別。独自の日本語validatorが追加された事実はない。

続いて既存U07 ordinary-transformationの14変更nodeについて、initial/current/part毎initial・wrong・filledのpublic投影を読み、目的→対象/規則→式内の判断→正答後の意味→元問題復帰を個別の日本語で応答した。所見欄はこの限定範囲に新しい欠陥なしとしてfindings=[]。CODEの構造PASSを因果の合格理由には使っていない。数学の前提・保存の旧SOURCE_REVIEWと、今回可視文章の審査は分ける。

初回requestではknownResultRefsが生成元の誤参照で全て空だったためAが指摘し、rootがcertifiedResultIdsへ訂正して、resolvedなrequiredResultRefsに対応するcertifiedPrerequisiteContextを追加した。Aは更新requestの14件を再読した。具体例には、q01の正候補4²、n09-02の根号値/平方値、Q08の導出済み一般公式と共通平方値、n10-15の因子、n10-17/20の値保存・非零認定が含まれる。前のa≥0の場合をa<0へ無条件に流用するなどの誤った条件跨ぎはしていない。

requestHashが全件変わったので初回応答はstaleとして別保存し、最新requestHash/phaseへ応答を再生成した。旧応答は取込不可。現在の応答は `/tmp/w046-prose-responses-A.json` のJSON配列14件、reviewer=/root/w046_source_review、request.required全欄/caseDispositions=[]/findings=[]を持つ。既存import実行結果はrootが別途記録するもので、この追記はimport成功を先取りしない。

実publicデータによる本文接続のAI判断であり、新しい画像/日本語font/幾何の再測定やG3配信検証は実施していない。追加の自由入力/本文穴/新checker/製品変更は行っていない。

証拠SHA256：

- PROSE_CODE_CHECK.json：`c6f05068514a693d4f79a5bb2a6c16a216c918dfd38104b6bd8c18e65242570a`
- 最新U07 requests：`4ea83720ac488557879b4a42685b34fc541e8b0377d9b8eac4273f97aa1e66ae`
- 最新A responses：`8b25233aba70469797a959d773f98a925a7f7e475ccae33b1a482b425afffb12`
- 取込不可の旧A responses：`1a38428ea2d4b846408ce32d8978bb3bc8aed70b88f10dd8fea89040a19eaf37`

## G3公開承認後：publisher案の事前独立照合 A

本人page `ec054575-1bcf-436c-bbeb-053e3fff50ca`「いいよつづけて」は、直前の固定source d588・既存Pages公開・main2file限定案への承認としてrootから受領した。N09r10/N10r6の意味審査・代表細部承認とは別の公開権限であり、本人の最終アプリ全体受入にはしない。main反映対象はpublisher2fileで、製品コード全体をmainへ一括混入する案ではない。公開後の実配信検証・本人総チェックは未完了である。

対象案：g3-deploy-pages.yml と g3-publish-check.mjs。Aは公開操作・製品/Git/Store操作を行わず、固定案を読取した。

- source定数、workflow CANDIDATE_SHA/VITE_PREVIEW_COMMIT、actions checkout refは全て `d588d1c395de3132805395f2708bed7535c1767d`。publisher utilityだけgithub.shaの別checkoutから使い、sourceとpublisherを混同しない。
- requiredSourceHashesは46path。Aが全46の現在file SHA256および固定d588のgit blobから得たSHA256を独立計算し、どちらも不一致0。renderer/CSS、active compiled/catalog/pin、旧snapshot、migration/storage/schema、route、W043設計等のsourceを固定する。これは46fileだけで全appを検査したという意味ではなく、immutable checkoutと公開全dist byte検証を併用する。
- 保存namespaceは既存 `kyotsu-step-gate3-math-20261023`。main storeと専用nested keyを同namespaceへ固定し、旧 `kyotsu-step-store` や非scope nested keyの生成を拒否する。N09r10/N10r6の実compiledHashをpageとledgerで一致させる。
- manifestはuserAcceptance/Gold/fit=false。URL queryだけからsourceを推定せず、生成済w046-release.jsonの生byteと実HTTP応答のhashを比較し、manifestに含む全dist fileのbyteを検査する。
- 公開前にbuilt appのN09/N10全4幅の全正答/誤答/保存/reload/history/旧版/resetと、N08r7/r6/legacy・N11の既存実操作を実行し、その後にのみPages artifact upload/deployへ進む。shellのset -eと通常step依存で公開前FAILはdeploy前に停止する。if:alwaysは証拠保存のためでありdeployを強制しない。
- 公開後は同じcheckerでmanifest/全assetbyte/実操作を再検査し、保持N08/N11も再確認する。公開step成功を配信byte成功と読み替えない。公開後検査FAILはそのまま失敗として残し、本人受入で隠さない。
- namespaceを持つ他unit currentと当unit旧版のvalid ledgerをseedし、reset後のbyte不変を検査する。旧版trialは全localStorageが不変、戻ったcurrent完了が保持されることを確認する。これらは隔離browser contextのテストであり、実利用者の保存を書き換える操作ではない。

今後のA確認：PRが承認時main f4c基底か、差分が `.github/workflows/deploy-pages.yml` と `tools/release/w046-publish-check.mjs` の2fileだけか、review済案と一致するかをPR確定後一回照合する。公開後の実run/HTTP証拠は届く前にPASSとしない。rootの通常pollを重複実行せず固定版/実結果だけを独立確認する。

事前案SHA256：

- g3-deploy-pages.yml：`c14f11a4a647def0d5f8e6a9fa9f300da2610c6aa1e1b7bafd167c1baed96891`
- g3-publish-check.mjs：`6bc1cb3402eb0fb9b8723452d3bf5dddfbd4afdbedaa6783f7dbdcfa2bf56139`

## PR136 限定差分の独立確認 A

GitHubのPR136を直接読取した時点でopen/mergeable、base=`main` / `f4c50963e26d3d4f9b33c3ca9f43e91e57dbdb75`、head=`c6201114d3b8a1bb0d4b8402694f81e9138dc9dd`、head repo1391122224を確認。changed_files=2で、取得済みraw diffの対象も `.github/workflows/deploy-pages.yml` と `tools/release/w046-publish-check.mjs` の2fileだけだった。

PR head両fileをGitHubからfetchしblob SHAを取得した。審査済み案の生bytesからAがGit blob hashを独立計算し、workflow `45d403691d06702dc96c199c33f4d112900d655a`、checker `68e4bf022f1a700fe1d1a96f35a550e6ac8c396a`へ完全一致した。固定d588・46source hash・namespace・旧版保護・公開前後検証に新たな差分はない。mergeを止める所見なし。expected-head mergeの実操作はrootのみ。

CI rawは同headに束縛されたcheck/governance SUCCESS、N04対象外job SKIPPED。Vercel Preview Commentsのsuccessは公開・配信byteの証拠として用いない。CI成功はUX06の本人全体受入でもない。この追記時点の公開結果は未確認であり、merge/run開始を公開検査PASSへ読み替えない。

証拠SHA256：

- /tmp/w046-ux06-publisher-pr136.diff：`58b83e13b60ed57614bf8a782a5e8a13511f0de74d3806b7d4dd5d2785a595dd`
- /tmp/w046-ux06-publisher-checks.json：`2f8c1197a48ef611e5d04d0bae59ca98e61194faad1207db641ec944b59ae40d`

## G3実配信HTTP証拠の独立整合読取（全run完了前）

rootが取得した `/tmp/w046-ux06-hosted/HTTP.json` と同directoryの実HTTP生 `w046-release.json` / `release.json` を独立に読取照合した。ここはrootのHTTP取得とAの整合監査を分離し、Aが121fileを再downloadした記録とはしない。

- source=`d588d1c395de3132805395f2708bed7535c1767d`、publisher=`e734337f1e18dd285f04f1b8ed63532ceff3b72f`。両manifestとHTTP記録で一致。製品sourceとmainのpublisher commitを同じSHAとして扱わない。
- raw w046 manifestの生byte SHA256がHTTP.manifest.sha256と一致。raw retained releaseの生byte SHA256もHTTP.retainedReleaseとmanifest.files.release.jsonへ一致した。
- manifestの全121file集合とHTTP.filesの集合が完全一致し、重複なし、全HTTP200、全sha256一致。filesVerified=121。source query文字列や単なるHTTP200だけで新版と推定していない。
- 46requiredSourceHashesを現在の固定製品fileから独立に再計算し不一致0。N09r10/previous9/hash7ccea0da…、N10r6/previous5/hash6ecda0e4…は審査済compiledと一致。
- storageKeyは両manifestで従来 `kyotsu-step-gate3-math-20261023` のまま。旧namespaceからの変更を導入していない。旧版snapshotや実ledger保護の操作検査はこのHTTP byte照合とは別。
- retainedN08Revision/activeN08Revision=7。N11 retained planHashは両manifestと固定sourceのn11Transformation.planHashに一致。これは保持metadataの一致で、N08/N11の全実操作成功を意味しない。
- userAcceptance/Gold/fitはfalse。公開許可・配信byte確認を本人のアプリ全体受入へ読み替えない。

rootからdeploy stepおよび「Verify published N09/N10 bytes and operations」成功の報告を受領したが、この追記は公開workflow全step完了・保持N08/N11実操作の合格を先取りしない。run41569692346の後続検査が進行中であることを維持する。現在このHTTP/source/namespace/版/保持metadataの範囲に所見なし。通常pollはrootに任せ、Aは最終証拠が揃ってから追加確認する。

実HTTP証拠SHA256：

- HTTP.json：`efcf609339c9cb04b8f392b9342763a1eff4863ccb0b421c0a20eca6cb57449f`
- w046-release.json：`4160b28ef542942302e68882f39a4ebb9c2a2d9037f7d402627590db4230a524`
- release.json：`da673848cf5b1f8125407cc88ad6bd02996e4bac867562cdbf4adcd1c689d5d7`

## G3最終run・CI原artifactから実配信までの照合 A

`/tmp/w046-ux06-finished-run.json` と `/tmp/w046-ux06-hosted/CI_ARTIFACT_MATCH.json` を読取。run41569692346はpublisher head e734337f…、completed/success。公開前のcandidate byte/操作検査、Pages deploy、公開後N09/N10 byte/操作、公開source/N08各旧版、保持N11のstepが全てsuccessで完了している。前節の「まだrun進行中」はその時点の履歴であり、現在は完了として更新する。

Aは取得済みGitHub Pages原artifact ZIP `/tmp/w046-ux06-ci-pages.zip` を直接開き、唯一のartifact.tarをメモリ内で順に読取した（filesystemへ展開・製品変更なし）。

- artifact ID13200882841/name github-pages/4294231bytesは最終run要約と一致。ZIP SHA256は `68d69ba124ec7e9cf70993ef7c6ceb1f16a105eb739e2b9a1423ab4808d6e364` でCI_ARTIFACT_MATCHへ一致。
- tar内w046-release.jsonとrelease.jsonの実bytesは、root保存の各実HTTP body、およびci-*.jsonへそれぞれ完全一致。単なるmanifest内source文字列の一致ではない。
- 加えてAがtar内全fileのSHA256を独立計算し、公開manifest.filesの全121fileでCI tar hash＝manifest hash＝rootのHTTP取得報告hashを確認。欠落0・集合内全121一致。前節で全HTTP200も確認済み。
- このbyte結合により、公開前のCI build artifact、実配信manifest、実配信121fileが同一内容と追跡できる。Aが実HTTPを再downloadしたという記録ではなく、rootのHTTP取得とAの原artifact/整合監査を分ける。

最終sourceはd588d1c395de3132805395f2708bed7535c1767d、publisherはe734337f1e18dd285f04f1b8ed63532ceff3b72f。保存namespaceは従来kyotsu-step-gate3-math-20261023。N09r10/previous9/hash7ccea0da…、N10r6/previous5/hash6ecda0e4…、46requiredSourceHashes、保持N08r7/N11 planHashは前節の審査済みmanifestそのものとCI/HTTPのbyte一致で結合された。公開後の保持unit操作stepも完了しており、この公開検証の範囲に未解決所見はない。

G3の公開/配信検証完了と、本人が合意範囲を最初から最後まで評価する最終アプリ受入は別。本人G3最終受入はPENDING、userAcceptance=false、Gold/fit未実施。R03事後sweep/R08/L01/Z01や他Workの受入、正式Store26欠落の復元成功へ拡張しない。rootだけが公開操作を行い、Aの本作業は独立読取・監査文書追記のみである。

最終証拠SHA256：

- /tmp/w046-ux06-finished-run.json：`5718a1b9de47830dc17df78bd0a9fe05cebfee9fc821655f79e05c578b5ea17a`
- /tmp/w046-ux06-hosted/CI_ARTIFACT_MATCH.json：`4b78a24512bc32fc749aa11a1ea0ad34e341dbeedfacd7f73d52a87a0a2a6bdc`
- /tmp/w046-ux06-ci-pages.zip：`68d69ba124ec7e9cf70993ef7c6ceb1f16a105eb739e2b9a1423ab4808d6e364`
- /tmp/w046-ux06-hosted/ci-w046-release.json：`4160b28ef542942302e68882f39a4ebb9c2a2d9037f7d402627590db4230a524`
- /tmp/w046-ux06-hosted/ci-release.json：`da673848cf5b1f8125407cc88ad6bd02996e4bac867562cdbf4adcd1c689d5d7`


### 段落区切り修正の限定impact監査 A（PR137）

本人はreset後に穴が復帰することを確認し、先の空欄なし画面を回答済み表示だったと訂正した。今回の要求はN09/N10の段落区切りと本人端末での各教材reset。段落修正後なら全体を通せるという条件付き発言であり、本節時点の最終受入を先取りしない。

Aは固定source `d588d1c395de3132805395f2708bed7535c1767d` と `6b439d0d31fcd46708c256ed23a391009ab73164` のGit tree差分を直接読み、変更pathが次の2つだけであることを確認した。

- `src/components/textbook/ConstructionLessonReadingFlow.tsx`：SHA256 `736befadae05761100e62a24d644cb36b6d949f989c19f162b0c49b844abce0a`
- `src/components/textbook/construction-lesson-reading.css`：SHA256 `0e056d35bc72192258605ab5bbf7a69a14f53074dac20a0372c4a571c821b9d8`

LeadCopyはdecimalの『まず二つの数を』前・definitionの『根号』前だけをp分割し、既存Copyへ元のmath/term/textを順序通り渡す。明示6text境界とafter-text、lead間、node間に余白を付ける。本文文字列、数式、part、採点値、前提、gate、同じ導出のmathgroupと等号列は変更していない。共用rendererのため該当する旧版表示の余白にも及ぶが、旧版データや保存契約の変更ではない。

2path以外のtreeが完全一致するため、NODE_DESIGN、N09/N10 compiledと旧snapshot、保護する積・商証明9node、N08/N11教材、保存・移行・reset実装は同一byte。さらにAはN09/N10 compiled、nestedLesson、nestedMigration、nestedLessonStorage、useAppStore、textbook、N0910RevisionPageをgit showで個別byte比較し一致を確認した。N09r10のcompiledHash `7ccea0daae7cc9fa65ccf36ab0b0f8680a17116d633da65a405338ba086f340b`、N10r6のcompiledHash `6ecda0e4bb4458f4d8876a8fe0cf4b8deb10aafda96ce76e0926f4dd18403879` は据え置き。教材revision・保存key/hash・namespaceを変える必要はなく、表示更新で自動初期化もしない。

既回答を通常式として表示する既存動作は正常。本人端末resetは既存教材別操作で、直前ledgerをreset archiveへ保護し、新しい空ledgerとresetAtを作る。検証環境のresetは本人端末へのreset実施を意味しない。本節は保存処理と契約の不変を読取確認したもので、本人端末localStorageの実byteを取得・比較したとの主張ではない。

PR137について、接続profile rrikunagasige-dot、対象repo1391122224、base e734337f1e18dd285f04f1b8ed63532ceff3b72f／head2a47e5cbb916bd9a95146733106bd17798109a75を照合済み。GitHubからbase/head完全fileを取得して全体比較し、main変更は `.github/workflows/deploy-pages.yml` のsource SHA三置換と `tools/release/w046-publish-check.mjs` のSOURCE／上記二hash三置換だけ。required46paths・namespace・公開前後検査・失敗時deploy停止・N08旧版/N11保護は同一内容を維持。full Work mergeは含まれない。

rootからmerge後publisher `04b823259a0873235e39099864d454330eed5d81`、run41582855292が公開前操作検査中との連絡を受領。本節では新run成功や新source実配信を未確認のまま保持し、旧d588の配信証拠を6b439の公開証拠へ流用しない。新配信byte／CI artifact照合はrootの実行後に別途監査する。正式Store化、Gold/fit、本人最終受入は行っていない。Aの今回範囲は読取監査と本書追記のみ。

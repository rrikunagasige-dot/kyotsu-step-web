# P-W046-UX-06 具体案 非作者審査 A

対象は主担当作成案。Aの作者範囲は以前のN09教材/保存実装・今回R03監査とCODE入力アダプタであり、今回の提案本文/設問の作者ではない。今回の非作者範囲は11再設計、3本文変更、全86処遇、既習根拠、保存条件の数学/学習契約。自作のCODE入力を自分の独立審査合格とは呼ばない。組織的独立/盲検は主張しない。

現行具体案の内容上、下記是正後に修正必須の未解決指摘は見つけていない。ただしR05承認、製品反映、実画像、最終移行の成功、全数理機械証明を意味しない。CODEの未対応/未実行は後述のまま保持する。

- PROPOSAL.json SHA256 `a604ffa8f14499973ab5a3799bc1d4d3d605111883ba6046966d812fbacf3840`
- PROPOSAL.md SHA256 `385f5d8763081ca318e24bc0ef6e98e096d056d3512c45c4ad2f0ac8db14f358`
- root scratch CANDIDATE_NODE_DESIGN.json SHA256 `0c21be3cfd750097bea0c81f45fbd37fd866368d18871c6537d65c9bc219e92a`
- 固定製品source691d、現N09r8/N10r5→提案N09r9/N10r6。製品pin/compiled/Store/Gitは本審査で変更していない。

## 原典と最初の指摘・是正

main MASTER§4–5/7–12/20/38/43/52/53と本人最新の「式内の文字・数字・符号を埋めて導出を実感」を基準にする。文字一個の穴を一律削除せず、全変形に穴を要求する過剰基準にも戻らない。N04に和/差の平方・和差積の既存導出はあるが、N09/N10の受講者が既習と推定しない。

1. A初回指摘：decimal-methodのcrossProduct=ABを問う同row introが「BAは…ABと書けます」と先に答えていた。rootがexpected BAへ変更し、分配でBAを構成した後に通常行でBA=ABを教える順へ是正した。初稿問題を撤回してなかったことにはせず、この履歴を保持する。
2. Bの独立した理念監視が、旧assumptionsの和/差の完成公式が初期に残ることを発見した。rootがdecimal-method/q11のassumptionOverrideとassumptionPartsOverrideを実数条件・具体課題へ置換した。Aも最終案の両overrideを直接再読した。Aが先にcrossProductだけを見て旧条件チャネルを見落としたことは、私有説明と全可視チャネルの監視不足として残す。
3. 初稿の一律「最初の行だけ」と、q11/parts-targetに未回答前から見せる複数の説明行との不整合は、block別initialVisiblePrefixへ具体化されて解消した。intro/afterは実text rowに変換し同じgateを持つと明記。terminalの非表示metadataだけで説明を済ませない。
4. n09-02のassumptions削除案はschema要件と原条件保持のため撤回し、assumptionsDisplay in-contextによる重複表示抑制へ訂正。これは条件そのものの削除ではない。

## 11設計の個別照合

|node|数学・生徒の活動・本文の評価|
|---|---|
|n09-q01-negative|括弧内の負号を含む二つ目の基底−4を式内で作り、その後に既存の平方値16を計算する。旧powerActionの文章選択を廃止し、異なる新操作へ旧keyを流用しない。新因子は2倍の−8や正の4と区別する。|
|n09-q02-negative-square|二つ目の因子−√5→符号部分の積1→根号定義による値5の連続導出。符号1の算術を全課題へ増殖させる案ではなく、この初回の負の根号全体の平方を可視の積として確かめる役割がある。既知の根号定義と今回の具体適用を区別。|
|n09-q04-negative|候補−aを与えたうえで正性>と平方a²を本人が式内で作ってから根号値を同定する。候補を先に与えることは候補の検証を問う目的と整合し、定義適合の二条件を省略しない。|
|n09-decimal-method|和の平方を同じ和の二因子へ戻し、A/Bを分配位置へ入れ、BAとB²を構成、正答後の交換でABへ直し、係数2を作る。単一文字を浅いとして全式選択へ置換しない。Q08の計算へ戻す本文がある。後述の初稿先出し是正を確認。|
|n09-parts-target|定義x=n+rと0≤r<1からr=x−nを可視で得て代入し、各辺+nの結果n≤x<n+1の両端を本人が作る。既習の逆演算を小問へ増やさず、新たな幅1区間の導出を式内の文字へ割り当てる。|
|n10-q01-square|同じ基底t√5を掛ける因子とtの指数2を本人が作り、その後√5の平方5を求める。未証明の根号積公式は使わない。次の既存t²=25の計算を保持し、÷5を別穴にする要求はない。|
|n10-q11-formula|N04受講完了を仮定せず、同じ差の積→分配の説明→末項の＋→交差項係数2→根号式の中項という導出/転用。最初の積への書換えは和平方で本人が既に構成する形の再利用として提示できる。未知の名称を当てさせない。初期の完成公式条件を除いたことを確認。|
|n10-q13-identity|一般の和差積で交差項の−、和0を式内で構成し、その後具体根号の相殺pairへ移る。N04q8という資産の存在だけで受講済みとせず、このblock内で残る平方差の根拠を教える。全四項を毎回独立穴にする機械基準ではない。|
|n10-15|分母側に選んだ√3を掛ける際の分子側の補償因子を本人が置き、分母の√3二因子を指数2へまとめる。旧1×√3だけのnumerator回答を退役させ、同じ期待値√3へ旧keyを流用しない。|
|n10-17|非零のcを一般記号として、分子√3cと掛ける対象の分母全体√3+√2を構成する。選んだcを具体値へ戻す行はその後の正当な代入。値保存の一般文だけで具体分数を済ませない。|
|n10-20|分子の同じ二因子を指数2へまとめる活動と、分母の和差積を平方差の−へ直す活動を分離。平方値4/3は比較で本人が確定済みの結果を参照し、再計算の穴を増やさない。旧一括分数選択を退役。|

全31partの正答値を各式へ入れた関係は数学的に成立する。候補の符号/基底/指数/対象範囲の誤りも各問いと対応する。これはAの読取による数学判断であり、後述のsolver実行成功とは区別する。AB/BAは等価として扱い、選択肢へ両方を並べ片方を誤答にしない。分配A/Bは指定された構文位置の対応として区別される。

## 3本文変更・全86処遇・保護範囲

- n09-02は既認定の(4,5)と元問いを保持し、同じ目標文の反復表示だけを抑制。q02-rootへ元問題が残る条件を実装/R07で確認する。
- Q08左右のleadは、導いた一般式へA=140/B=1または2を対応させる理由・次の計算を示す。既存の中項構成、必要6計算、大小比較を保持し、導出済み公式の具体転用を再証明へ置き換えない。
- source compiledのnode集合と全86処遇のkey集合を独立に比較し一致。11 REDESIGN、3 PROSE_ONLY、72 KEEP_REVIEWED。KEEP不変/ID一致を理念適合の根拠にはせず、R03個別判断・上流修正後の前提/共通font/実画像検証を条件とする。
- 積/商の褒められた9nodeは全てKEEP_REVIEWEDで、blocks/proseOnlyに含まれない。指数2、a/b、符号・非零の段階を新しい全式選択へ変えない。n10-01のt²=25を含む既習操作と今回計算も保持。
- font案はglobal.css全体を編集せずnative読取componentへ限定。baseline69→target72対話nodeと同renderer旧版/history/archiveが対象。KaTeX内部の指数/分数を一律18pxへしない。非nativeのN07/N08/Guided/Practiceは保持検査対象。実computed値/四幅画像は未確認。

## 保存・学習契約

- 6 KEEP_EXACT_GRADING_CONTRACT のoldContractを現source691d compiledの同ID part全体へ比較し、すべてexact一致した。expectedだけでなくprompt/choices表示・feedback/mathAssertion/sourceRefs等を含む。top-levelのexpected/kind/prompt/choicesもoldContractと一致。
- このbyte比較は将来実装の保持証明ではない。行/前提追加で数学上の対象・問い・思考操作が変われば、KEEPを撤回してNEWへ戻すというmigration条件が必要で、現案に明記されている。新parts正答前に保存済み旧後続を解放せず、未解決gateをpendingとして再評価する。
- 現案は25NEW、3RETIRE、6ブロック内KEEP。全体では現103partsのうち100を保持する計画で、N09は43−1+13=55、N10は60−2+12=70、計125（実装前予定）。意味差でKEEP→NEWになればこの数を再計算する。
- 退役はn09-q01-negative::powerAction、n10-15::numerator、n10-20::rationalisedFractionUX05。新しい基底構成/補償因子/分子分母別操作へ旧keyをaliasしない。
- r8/r5を固定snapshotへ追加し、旧chain/unknown native拒否/reset/namespace/readonly/旧版を保持する方針は妥当。新compiledHashはまだ存在せず、実装時に厳密edgeを束縛する。旧完成nodeからNEWを埋めないこと、旧回答のtimestamp/reset後回答・他unitを守ることは実装非作者審査と移行実検査で確認が必要。

## この実案を既存CODEへ渡した結果

`run-code.mjs` はPROPOSAL.jsonのhashを実行前後で照合している。AIが作った式・文章・意味分解を薄く入力へ写したもので、CODEがその分解を自発生成したとは言わない。N04資産の存在や今回の目標をknowledgeから除外し、宣言された数学前提・上流resultを渡す。個人の習熟測定ではない。

最終実行proposal hashは `02452736c8d731b001ac386a7991da1d3d800e0c8c47915ee175bb003849b700`。

|処理|実結果と限界|
|---|---|
|teaching-candidates raw|11blockをAI作成の55意味段階へ写したsolution、knowledge36。既存CODEが前提順へ整列してfirst_application1候補を返した。外側PASSだが候補はNEEDS_AI_REVIEW。内部分解の十分性を証明しない。|
|blank-candidates raw|31partsを対象に93候補を列挙。AIがslot対象31をADOPT、produced fact/operation kindのmetadata62をREJECTと理由付き記録。raw APIにはeligibilityがないので、CODEの採否照合へは全93をUNRESOLVEDとして返しNEEDS_AI_REVIEWを保持。AI採否をCODE eligibilityへ偽装していない。|
|代表decimal-methodのinteraction-plan|実案の(A+B)²→積→分配→BAを含む四項→交換→同類項という閉じたgraphへ実6partを束縛。既存CODEの前提eligibility PASS、全6ADOPTの採否照合PASS。これは構造/採否完全性であって教育自動承認ではない。|
|math.solve/graph teaching|実案の一般式graphを実行したがdefault PythonのSymPy不足でUNSUPPORTED/MATH_DEPENDENCY_MISSING。原出力を保持。数理検査PASSとは記載しない。|
|本文IR／solution-review import|このA scriptではNOT_RUN。候補の本文は読取審査したがproduction-ir/2全step検査やpublic-only request/importを実行したとは言わない。rootのnative preflightもその代替ではない。|
|root native preflight読取|現proposal hashに束縛した既存validateDesign PASS、数式compilerの78状態PASSを原出力で確認。Longrightarrow非対応の原FAIL→Rightarrow是正履歴も保持。これは構造/閉じた式の描画文法検査で意味/実画像/保存移行の合格ではない。|

`CODE_INPUTS.json`、`CODE_OUTPUTS.json`、`raw-blank-ai-decisions.json`、`CODE_SUMMARY.json`を保存した。formalStoreReceiptはfalse。Store26欠落を空台帳や架空receiptで埋めていない。

## 残す条件・未実施

1. R05は本最終案の具体hash/範囲に対する本人承認。UX05承認・今回の案作成指示を実装承認へ読み替えない。
2. 新native materialization後の6KEEP意味・gate・未知hash・reset・旧chainの実検査が必要。現在の旧part exact一致だけで移行合格とはしない。
3. 初期→部分正答→通常数式→履歴を同じ最終sourceで実見し、全可視チャネルの完成公式/具体解漏れを再確認する。Bの条件チャネル指摘をregressionへ結ぶ。
4. 意味候補の全段階を既存CODEへ渡したことと、完全な本文IR/数理/実画像が検証済みであることは分離する。unsupported/not runは未完のまま報告する。
5. 根号積/商9node・Q08の必要計算比較・他unit保持、旧アーカイブのfont影響はR07/G2で確かめる。

## この審査の成果物SHA256

|file|sha256|
|---|---|
|run-code.mjs|cb2a866a217ba8237b137abf3b0db22da86a0912e1a6dfe10d506cf7d3e36908|
|CODE_INPUTS.json|22353a3da0d42a382d65ff4a5579c3d919142e09e1ad5ccd159c51ddb1fe5835|
|CODE_OUTPUTS.json|c922ba14615546e192b0ffae531f9a87d1067d94e870b3b3b18c1dc4f72d1755|
|CODE_SUMMARY.json|cb42c707fc5e0da50a223d8b3c0c119a3983ec8a057c48be881fbf785d2eb31e|
|raw-blank-ai-decisions.json|a766d3765fa0066e41ce5131cc84a9edfa899a38f2b39d88c3707f43d088b32c|
|NATIVE_PREFLIGHT.json|8ad1abb19876e13958f1f4722e6b70b965dc634e75f6058613d0945edf3ede5a|

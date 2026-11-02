# W046 再修正R04：既存CODEの呼出契約・利用範囲 A

対象source：`691d3d160493bf684ca8a31a22476d31d98caeec`。調査は実装読取と後述の隔離した契約probeのみ。製品・Git・Storeを変更せず、Runtime/CLIを初期化していない。Store26イベント欠落特例を継続する。正式receiptや工程PASSEDは作っていない。

## 実際の入口と呼出条件

- 登録：`workflow/capabilities.py` の `REGISTRY` / `requests_for`。R04はmath.solve/math.verifyとDESIGN（teaching.plan/step.plan/blank.plan/prose.compose等）を要求する。修正blockにmath facetがなければmath.solve/verifyを除外し、math/designのどちらもなければteaching/step/blankを除外する。
- `solution_pipeline == 'solution/1'` の場合にR04へsolution.validate/interaction.plan/solution.reviewが追加される。construction-layout/1ならconstruction.validate/layout.validateも追加。既存n0910教材であることからRuntime planのopt-inを推測しない。
- Runtime経由の `run_stage` / `run_capability` は、state、claim、Store cache/put/appendを伴う。今回これらは呼ばない。純関数入口は `tools/textbook/operations.mjs` の `operate(name,input)` または各export関数。CLI `node tools/textbook/operations.mjs <operation>` もJSON stdin→JSON stdoutで、Storeへは書かない（当該処理内の数学Python subprocessなどは実行する）。
- capability名とoperation名は異なる。特に**S08/S09は同一候補関数、S11は本文自動生成器ではない**。この対応を下表で固定する。

## capabilityから実処理への対応

|capability／旧service|実入口と正確な入力|出力|制約・今回の利用|
|---|---|---|---|
|math.solve / S06|`operate('solve',input)`。`schemaVersion:'solution-graph/1'`のgraphを直接、または`{kind:'solution',graph}`。`solution-bundle/1`も分岐。その他のkindはN07 solverの`long-division`（numerator/denominator）、`recurring-to-fraction`（repeat）、`finite-decimal`（value）だけ。|graphは構造→厳密数理検査、graphHash/checks/proofStatus等。N07はpayload/COMPUTED、未知kindはUNSUPPORTED。|自由文から解法を発見する汎用solverではない。今回の平方公式・具体平方・分数変形は後述graph/ASTを渡し検証できる範囲を使う。AI作成の解法をCODEが自発生成したとは書かない。|
|math.verify / S07|`workflow/runner.py:47`：`{kind:'solution',graph}`またはbundle→solution-validate。`{kind:'polynomial',left,right}`→legacy-polynomial.py。`{kind:'n07',problem}`→N07 solve。`{kind:'argument',claim,assumptions,sourceRefs,steps:[{statement,basisRefs,dependsOn}]}`→引数完全性検査。|solutionはチェックreceipt。legacyはequivalent/independent等。argumentは構造が揃えばNEEDS_AI_REVIEW、proofStatus UNVERIFIED、formalProof false。不完全はFAIL、未知domainはUNSUPPORTED。|S07は`operate('verify')`という一般名では呼べない。argumentを数理証明PASSにしない。Runtimeのmath.solveでもkind:argumentはS07へ特別分岐し、solutionOrigin AI_ARGUMENT/formalProof falseを付す。Storeなしでは同処理を読取し、AI論証として明示する。|
|teaching.plan / S08、step.plan / S09|どちらも`operate('teaching-candidates',{graph,options:{budget:1..3}})`。graph無しなら`{solution:[step...],knowledge:[factId...],options}`。stepはid/inputFacts/outputFacts/goal/operation:{kind,targets}/basisRefs、任意nextUseIds/repeated/knownRule/figureRef。|前提の順に並べたfirst_application、該当条件がある時practice/figure_supported。各候補id/hash、steps、status NEEDS_AI_REVIEW。graph枝の外側statusもNEEDS_AI_REVIEW。raw solution枝の外側PASSでも候補はNEEDS_AI_REVIEW。|前提不足/循環、不完全operation、未消費のnextUseを拒否。**与えたstep内を新しく分解しない**。graph枝は先にverifySolutionを行い、graph.initialFacts＋givens IDsをknowledgeにする。raw枝のknowledge=[]を個人習熟・既習認定と見なさない。今回、native1node=1stepで不足を固定せず、完全解法の意味ある操作を先に入力する。|
|blank.plan / S10（旧raw候補）|`operate('blank-candidates',{nodes:[...]})`。nodeはid/operation:{kind,targets,direction?}/produces。|operation.targets、direction、produces、operation.kindからtargetPath/value/learningActionを列挙。decision NEEDS_AI_SELECTION、whyHere null。|対象を列挙するだけで教授価値も未分解step内部も発見しない。whole-resultしか入力しなければwhole-result候補に偏る。graph/planがある時は下記へ分岐する。|
|blank.plan / interaction.plan / U05（graph）|`operate('interaction-plan',{graph,candidates})`、または同じ内容のblank-candidates。候補は`{id,stateId,availableFacts,learnerDecision,nextUse,target}`。bundle枝は`{bundle,candidates:[{id,segmentId,nodeId,availableFacts,learnerDecision,nextUse,target}]}`。|eligible/ineligible、reasons/missingFacts、adoption NEEDS_AI_SELECTION、planHash。構造が成立してもmeaningAuditRequired true。|graphのstateで届く事実を追跡する。targetはこの段階では非空かを確認するだけで、ASTの実slotや正答との対応までは保証しない。今回、独立した文字/数/符号の候補とAUTO/再利用の理由を別に提出し、候補総数を評価基準にしない。|
|interaction.plan 採否照合|`operate('interaction-plan',{plan,decisions:[{candidateId,decision:'ADOPT'|'REJECT'|'UNRESOLVED',reason,evidence}]})`。|全候補の一対一対応、理由証拠、eligibleのみADOPTを検査。未解決はNEEDS_AI_REVIEW、aiApproval false。|全ADOPTのcoverage PASSは教育適合ではない。本人の操作、本文、初回/再利用を非作者が各候補に反証する。|
|prose.compose / S11|実runnerは`operate('verify-ir',IR)`。production-ir/1またはproduction-ir/2の既存validatorへ。operationにtransformationPlanがある場合は`{ir,transformationPlan}`のvalidateTransformationPlanへ先に分岐。|IRの構造・source逆対応・全transition被覆・slot/選択肢・漏洩等のfindings、hash、meaningAuditRequired。|**文章の自動執筆はしない。** AIが目的→次の変形理由→穴→認定後意味→元問題復帰を実本文として書き、CODEは構造を検査する。文字列の内容があるだけでは因果の十分性を保証しない。|
|本文の既存小関数（capability直接対応ではない）|`prose/index.mjs` の`operationSentence({id,operation,subjectParts,slotId,interactionId,purposeParts})`、`quantity(value,semanticRole,appliesTo,{unit,standalone})`。|与えたsubject/slot/purposeを一つのparagraphへ連結、数量に役割/対象を束縛。|対象・目的が非空、subtractなら対象2つ＋direction等を検査する小関数。導出理由や自然な説明文を生成しない。新版IRのpart型との接続も要確認。利用した場合だけ補助利用と記録する。|
|solution.review / U07|`operate('solution-review',{visible,context})`でrequest生成。`visible`は少なくともcurrent/initial、contextはphase/sourceRefs、任意caseIds/profile/reviewScope/evidenceManifest/teamBinding。返ったrequestへ`{request,response}`を再入力。batchは`{reviews:[{id,visible,context}]}`またはrequest/response。|NEEDS_AI_REVIEW＋requestHash/required/constraints。importはphase/hash/reviewer/全required/findings/caseDispositions等を検査、未解決はNEEDS_AI_REVIEW、automaticAcceptance false。|visibleにexpected/correctValue/feedback/graph等のprivate keyがあれば拒否。一般profileは意味の判断を自動採点しない。ordinary-transformationなら本文配置・穴・group・terminal・可視進行の追加欄。construction-layoutは実image/geometry hashとrow/state全scopeの根拠を要求するので、未撮影の提案を実画像審査済みとしない。|

## 数学graphの最小契約と今回の分解

実schema：`solution/graph.mjs`、`solution/expression.mjs`。

```json
{
  "schemaVersion":"solution-graph/1", "id":"proposal-graph",
  "variable":"A", "parameters":["B"], "initialFacts":["square-definition","distributive-law"],
  "givens":[{"id":"given","statement":{"kind":"expression","expression":{"kind":"power","base":{"kind":"add","args":[{"kind":"symbol","name":"A"},{"kind":"symbol","name":"B"}]},"exponent":2}}}],
  "rootStateId":"s0", "goalStateIds":["sN"],
  "states":[{"id":"s0","statement":"ここは実際には閉じたstatement AST","activeVariable":"A","fixedParameters":["B"],"facts":[]}],
  "transitions":[{"id":"e0","from":"s0","to":"s1","ruleId":"rewrite","requires":[],"produces":["square-as-product"],"basisRefs":["square-definition"]}]
}
```

上は説明用shape（statement説明用文字列等があるため、そのまま実行する入力ではない）。実行可能な全5states/4transitionsの例は `r04-contract-probes.mjs` と `R04_CODE_PROBES.json.graph` に保存した。

今回の完全解法には少なくとも、`(A+B)^2`→`(A+B)(A+B)`→`(A+B)A+(A+B)B`→四項→同類項、の意味境界を記録する。どこを穴にするかは後のAI採否で決め、全transitionを必ず独立小問にする規則にはしない。未知の法則は教え、式内の因子・文字・数・符号として具体適用を作らせる。例としてN04の既存四積→一般化→差の平方導出は資料・既習根拠として照合できるが、N10へ既習接続済みと推定しない。

- ASTはrational（n/dの整数文字列、正の分母）、symbol、add/multiply（2..12項）、power（指数0..4）、divide、absolute、非負有理数のsqrt、pi。任意LaTeXを自動パースしない。
- graphのruleはrewrite/substitute/add-both-sides/divide-both-sides/multiply-both-sides/extrema。端点・事実・根拠・前提・順序を検査する。merge/OR分岐を一般に持てない。
- 数理は最大3実変数・次数4以内の多項式恒等式、符号が分かる定数での両辺操作、一変数関係の解集合、数値二次極値等の閉じた範囲。rewriteの数理成功は、宣言した分配/交換という教授上の理由が本当に適切かの証明ではない。
- `sqrt(a)`のような記号被開平数、一般の記号分母の除外条件、零条件のORや一般の平方根同定の論証を、このgraphの成功で済ませない。具体根号（sqrt(3)等）の式値と、正性・非零・同定の論理を分け、未対応論理は根拠付きAI_ARGUMENTへ渡す。
- S07 polynomial旧入口は有理係数一変数の制限があるため、A/Bの公式へ無理に流用しない。上のgraphのexpression identityを用いる。

## 本文と穴をbindingするIR

production-ir/2では、problemにprompt/conditions/goal/graph/stepsを置く。stepはtransitionId/sourceRefs/purpose/reason/afterText/promptParts/detail/numberId/slotTargetsと、interactionまたはnoBlankReasonが必要。interactionはlearnerDecision/availableFacts/withheldKnowledge/nextUse/expected/choices（feedback、誤答misconception）/hints（最大3）/supportPolicyを持つ。slotTargetsは`{id,interactionId,label,path}`で実ASTの出力stateに束縛する。

既存verify-irは全transitionをstepsが覆うこと、state順、local detailのrejoin、slot pathの値とexpected、選択肢の等価重複、source双方向被覆などを検査する。ただし本文purpose/reasonが非空でもその数学的接続はAI確認が必要。今回、一般則・前結果を実参照したうえで何をなぜ作るかを一段ずつ書く。候補作者のrationale/learningAction名を可視本文と取り違えない。

n0910 native枝へ接続する場合：`{ir,transformationPlan}`をinteraction-plan/blank-candidatesへ渡すと、既存nodeDesignのpartsを候補として列挙しNEEDS_AI_REVIEWを返す。**既存partsの列挙であり不足穴の自動発見ではない。** AUTO nodeは候補0になるので別に全node監査を残す。候補rawを承認前にnative builderへ通すため製品pinを更新してはいけない。既存 `validateDesign(design, sourceByUnit)` へ、原資料bytes/dataを伴うcandidateを直接渡してsource/order/row/gate/part等の構造を確認できる。native buildNestedTransformationPlanはreview済designHashと原資料pinに一致しない案を拒否するため、R04 draftとR06製品反映を区別する。

## 今回の推奨する接続順と採否責任

1. 固定source691d・本人NG・原資料/N04等・今回の各nodeの目的と既習根拠を束縛する。UNKNOWNな習熟を空knowledgeで既習扱いしない。
2. 穴なし完全解法を数学上の意味単位へ展開する。既存solve/solution-validateで対応範囲を検査し、argumentは未機械証明を明記。原式→局所計算→元式復帰を保持する。
3. teaching-candidatesへ全操作・既習facts・次使用を渡す。CODEの並べ替え/候補と、AIが書いた分解を別成果物として記録する。
4. 式内の文字/数/符号の候補を独立して書き、graph/bundleのinteraction-planで利用可能前提を検査。AIがADOPT/REJECT/UNRESOLVEDと個別根拠を書き、verifyBlankDecisionsへ全候補を戻す。AUTOにもnoBlank理由が必要。
5. 本文を実際の文として作成し、verify-ir等で構造・bindingを検査。本文生成をS11実装の成果と偽らない。
6. 期待値/私有解答を除いた初期・部分・認定後のpublicを作りsolution-review requestを発行。A/Bが作者を避け、具体的式と文章で反証し、existing importで戻す。候補のID一致/coverageだけを意味PASSにしない。
7. 主担当が承認済み案と保存移行を統合する。旧keyは式の値だけでなく問い/対象/条件/思考操作の意味一致時のみ保持。新しい導出操作は新key、廃止は旧版保存。r8/r5の回答を別課題へ自動流用しない。これは候補生成CODEが保証する機能ではなく別の保存契約審査が必要。

## 実際に行った契約probe（提案の合格ではない）

`node /tmp/w046-re-audit/r04-contract-probes.mjs` を1回実行。Store/Runtimeなし。本文・候補は契約説明用の小さな入力であり、今回の修正案の採用結果とは呼ばない。

- solution graphのshapeと前提からblank eligibility PASS、adoption NEEDS_AI_SELECTION。採否をUNRESOLVEDで戻すとNEEDS_AI_REVIEW。
- publicのみのordinary-transformation solution-review request生成はNEEDS_AI_REVIEW。operationSentenceは渡した本文部品を連結しただけ。
- default Pythonでmath.solve/graph teachingは `UNSUPPORTED / MATH_DEPENDENCY_MISSING`。SymPy未導入を原出力に保存した。環境未設定を数理PASSにしない。既存の適切なKYOTSU_MATH_PYTHONがある場合だけそれへ明示束縛し、実行版/依存版を記録する。今回新環境を作っていない。
- raw出力：`/tmp/w046-re-audit/R04_CODE_PROBES.json`。このprobeは工程receiptではなくAPI挙動の確認であり、正式Storeの欠落を埋めない。

## 読取対象のSHA256

|file|sha256|
|---|---|
|workflow/capabilities.py|74d0988ef64336e62cd42f26ecbe8d507119d01255e61960952e5446f4d1e849|
|workflow/runner.py|f4e09bd4811c1816e655d9d30de9c2e078b7202a59498ae7bdef0718fbea169c|
|tools/textbook/operations.mjs|14141b312ae939405285ca8bb0c5e24e78cc5c9a56d12413a00a8de10a4f8530|
|tools/textbook/planner/graph.mjs|be874377718e0fe1506bef4d8158b084353e0dea0cd1c0aefeac491150277cb8|
|tools/textbook/interaction/index.mjs|d623b513a593f8e1ad91d800aa246d947f68ed9b9686a6b572fb9e8bfe26a86f|
|tools/textbook/interaction/plan.mjs|0abe35387e1f2119eaf3c04dc6883362aff101abb21035f90e7f61378c6241b4|
|tools/textbook/prose/index.mjs|3236e9fac02347e8c50ec468aacba02ab1c0c836a94e78ccba47eaacefbd951b|
|tools/textbook/ai/solution-review.mjs|86f6c02e6c74b3546d583bad01c05823a6c1bf496d793dd5dd7468e1df78b336|
|tools/textbook/solution/graph.mjs|84bc025fe8cbf81653ac0e990d9ce87c30af30aff592a2f6919f39d9fa7a614d|
|tools/textbook/solution/verify.mjs|43fcf4d2fe43c10d222a874ec886d5c49b2fb1fb83e9d7d4627ee3cca03b5d9a|
|tools/textbook/solution/expression.mjs|a0fa6e20d7127c2198e9bf26dee86af007f26b4769247fd169aa121832ae8e1d|
|tools/textbook/ir/v2.mjs|c3835c6b8302ddeab7a5af050a4caeedd6150b9fb328125d05ab76ce3253828d|
|tools/textbook/transformation/plan.mjs|f3f6d743410fa3c8c8b7fd41ecf215211c4615a2e48593cd2d5ed0eba1854cac|

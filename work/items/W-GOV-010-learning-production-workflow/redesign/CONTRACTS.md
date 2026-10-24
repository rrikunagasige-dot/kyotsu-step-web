# P-003付属書 — 意味IR・API・検査契約

以下は実装時にschema/testへ落とす仕様例。新API・schemaはまだ実装されていない。例の数式は設計説明用であり、N07教材の修正成果ではない。

## 1. 全工程の共通envelope

```json
{
  "schemaVersion": "production/1",
  "runId": "run-...",
  "workKey": "rrikunagasige-dot/kyotsu-step-web:work/items/...",
  "stageId": "S11",
  "inputHash": "sha256:...",
  "sourceRefs": [{"artifact": "source-...", "blockId": "b-..."}],
  "versions": {
    "workflow": "...", "rules": "...", "compiler": "...",
    "corpus": "...", "model": null, "policy": "..."
  },
  "dependencies": ["artifact:..."],
  "status": "NEEDS_REVIEW",
  "payloadRef": "artifact:...",
  "findings": [],
  "producer": {"kind": "code", "implementationHash": "..."}
}
```

`status` は PASS / FAIL / UNSUPPORTED / NEEDS_REVIEW / ABSTAIN / BLOCKED に限定する。PASSには適用領域・検査種別・根拠が必要。数理PASS、描画PASS、AI監査PASS、ユーザー受入は独立receipt。AIがユーザー承認イベントを書ける字段を作らない。

## 2. 問題契約・完全解法

```text
ProblemContract {
 id, subject, mode, sourceBlocks[], role,
 givens[], domain[], symbols[], requestedResult,
 expectedForm, dependencies[], originalFigureRefs[],
 originalOrAuthored, coverageDisposition
}
SolutionNode {
 id, problemId, inputFactIds[], assumptionIds[], goal,
 operation:{kind, targets[], direction?, parameters},
 outputFacts[], basisRefs[], nextUseIds[],
 verifier:{adapter, supportedDomain, receipt},
 proofStatus, sourceRefs[]
}
```

`proofStatus` は COMPUTED / SYMBOLIC_VERIFIED / AI_ARGUMENT_REVIEWED / UNVERIFIED 等を区別する。AI_ARGUMENT_REVIEWEDは機械証明済みではない。異なる方法の数値検算も、その適用領域を超える一般証明にはならない。

一操作は「両辺から3aを引く」「xを含む一次項を選ぶ」等、対象と意図を持つ。`operation_count=1` の自己申告だけで分解を確認した扱いにしない。利用するsolver adapterは同じoperation kindを実際の式差分と照合する。

## 3. 教材nodeと小目標

```text
TeachingNode {
 id, problemId, sourceRefs[], solutionNodeRefs[],
 role: definition|property|proof|example|substep|check|summary,
 goal, purpose, knownFactIds[], requiredConceptIds[],
 operationRef, outputFactIds[], nextUseIds[],
 granularityProfile: first_application|practice|recap,
 before: RichBlock[], interaction?, after: RichBlock[],
 contextNeed[], figureRefs[], equationRefs[],
 noBlankReason?, auditRequirements[]
}
```

role=exampleは元例題の単位に付け、小段階すべてに同じ例題見出しを付けない。purposeとnextUseは参照先が存在するだけでなく、対応する出力が次の操作の入力として使われることを検査する。

## 4. rich textと描画保証

```text
InlinePart =
 Text{id,text} |
 Math{id,latex,mathRole,semanticRef} |
 Term{id,termId,text,usage:first_definition|recall|ordinary} |
 Ref{id,targetId,label,visibleWhen} |
 AnswerSlot{id,interactionId,renderAs,semanticRef}
RichBlock = Paragraph{id,parts[]} | EquationGroup{...} |
 Figure{...} | Table{...} | Callout{...}
```

- Textに式らしい文字列がある場合は `TEXT_MAY_CONTAIN_MATH` 警告を出す。自動修正で境界を決めず、原本とAIでmath tokenか判断する。
- termは定義位置の黒太字を表す。強調の有無と概念が定義されているかは別検査にする。
- paragraph/前結果/historyを同じinline rendererへ接続し、片方だけtextへ戻る実装を防ぐ。
- compile receiptに全semantic math/term/slot IDの写像を持つ。DOM側に `data-semantic-id` を付け、**表示されるべきID集合**と描画済みID集合を比較する。未解放tokenが存在しないことも別に検査する。
- MathはKaTeX描画、termは指定style、slotは文又は式内の位置を確認する。全tokenを強制的にKaTeXにする方式ではない。

## 5. 等式の接続と式番号

```json
{
  "kind": "relationChain",
  "id": "derive-coefficient",
  "relation": "equality",
  "expressions": [
    {"id":"e-input", "latex":"(10-1)x", "factRef":"f-input"},
    {"id":"e-output", "parts":[
      {"kind":"answerSlot", "id":"slot-coef", "interactionId":"coef"},
      {"kind":"math", "id":"mx", "latex":"x", "mathRole":"factor"}
    ], "factRef":"f-output"}
  ],
  "transformRef": "subtract-coefficients",
  "layoutProfile": "aligned-transform",
  "numbering": {"stableId":"eq-coef", "mode":"group-end"}
}
```

未解答では `(10-1)x=□x`、正答後は `(10-1)x=9x` という同じ関係の表現になる。穴は既存の集合方式の回答部品に接続し、独立した別問題枠へ変えない。実際の表示番号は章内の参照順に決めるが、stableIdで参照を保つ。

`relation` は equality / inequality / implication / equivalence / independent を識別する。compilerはindependentを等号で繋がない。数理adapterはequalityの前後が同値か確認する。式を折り返す場合もrelationと操作の境界を保持し、数字一個ごとに自動採番しない。

## 6. 操作の穴と意味のある値

```text
OperationAnswer {
 kind:"subtract", targetEquationIds:["eq-upper","eq-lower"],
 direction:"upper-minus-lower", purposeFactId:"cancel-repeating-part"
}
QuantityAnswer {
 value:10, semanticRole:"scale-factor", unit:"times",
 appliesTo:"x", nextOperationRef:"scale-equation"
}
```

『上の式から下の式を［引く］と、同じ小数部分が消える。』のように、操作は文中のslotへ戻す。次に表示する式はその操作の出力であり、slotの答えだけを独立paragraphにしない。数値回答は意味・単位・適用先を持つ。単独表示が適切な問題では許し、重複・孤立の検査対象を回答契約から判断する。

## 7. 穴・選択肢・ヒント

```text
Interaction {
 id, targetPath, learningAction, whyHere, prerequisiteIds[],
 expected:{valueOrAST, form, semanticType, domain},
 choices:[{id,content,misconception,feedback,basis}],
 hints:[{level,content,revealsFactIds[]}],
 revealPolicy, visibleBefore[], visibleAfter[],
 answerInsertion:{paragraphOrEquationId,slotId}
}
```

コードはtargetPathの存在/型、正答数、値と形式、選択肢の同値、ヒントと後続の漏洩、回答挿入位置を検査する。原選択肢がある問題と、補助的に新規作成した選択肢を区別する。旧engineの4ヒントと現appの上限3の差はadapterで明示する。黙って切り落とさず、教育的内容が落ちるならAIが再構成し再検査する。

## 8. 前結果と状態機械

```text
ContextNeed {
 id, problemId, factIds[], sourceQuestionRef?,
 tableSelection?:{tableId,rows[],columns[]},
 reason, availableAfter, display:inline|summary|expandable
}
```

状態は `locked → question → hint1/2/3 → retry → solved → compact/history`。誤答で後続を解放しない。hint順序は現appの受入仕様に合わせる。前結果は解放済みのfactのみ表示し、同名の別例のx/T/rを混ぜない。`problemId + symbolScope` によって記号を分離する。

進捗は既存namespaceとstable item IDsを保持する。UIラベル変更と問題の意味変更を区別し、semantic fingerprintが一致する回答は保持、意味が変わるものだけscoped migrationへ送る。移行では未解答を正解化せず、完了済み第一タイトルをリセットしない。

## 9. コード・AI・学習サービスの境界

提案する制作側API:

```text
source.import(inputManifest) -> SourceIndex
solver.capabilities(problem) -> supported|unsupported + domain
solver.solve(problem) -> SolutionGraph
solver.verify(problem, solution) -> MathReceipts
planner.enumerate(solution, knowledge, rules, budget) -> Candidate[]
validator.check(candidate, state, policy) -> Finding[]
ai.export(stage, contextRefs, evidenceRefs) -> RequestBundle
ai.import(response, expectedInputHash) -> ValidatedArtifact
corpus.curate(observations, decisions) -> CuratedSnapshot
ml.retrieve(context, scope, corpusVersion) -> EvidenceHits
ml.predict(candidate, state, modelVersion) -> RiskReceipt
ml.rank(validCandidates, context, modelVersion) -> RankReceipt
compiler.compile(approvedDesign, targetSchemaVersion) -> AppArtifact
release.verify(sourceSHA, route, receipt) -> LiveReceipt
```

API呼出しの実装はNode/PythonのJSONファイル又は標準入出力でよい。初期からHTTPサーバー・ベクトルDB・専用GPUサービスを増やさない。小さい事例集合では正規化埋め込み行列とscope filterで検索し、必要性を測ってからDBを検討する。

AI bundleは原本・既習・候補・必須規則・関連例・可視状態を含む。responseは本文と根拠箇所、反例探索、未解決を返す。作成時の長い自己評価・非公開の思考過程を収集する設計にはしない。必要なのはレビューできる解法と根拠である。

ML receiptは `modelVersion, inputHash, featureSchema, dimensionScores, abstentions, usedCaseIds, decisionUse`。model未学習なら `modelVersion:null, abstentions:[NOT_TRAINED]` を返す。空の予測を『問題なし』へ変換しない。

## 10. 指摘の共通形式

```text
Finding {
 id, ruleId, severity, stageId, nodeId, state,
 observed:{artifactRef,partId,quoteOrLatex},
 expected, basisRefs[], counterexample?,
 causeStage, impactedRefs[], disposition,
 resolvedByArtifact?, verificationRef?
}
```

文章警告は単語の禁止辞書だけでERRORにしない。例えば『同様に』を使ったから失格ではなく、その先に未学習の操作が隠れているかを検証する。規則は適用条件と例外fixtureを持つ。AIの判断にも根拠となる箇所・不足情報・差戻し先を必須とする。

## 11. cache・失効・再開

stage keyは入力artifact hashes、source、schema、実装、規則、policy、AI契約/response、corpus selection、model version、依存stageを含む。全repoの無関係な変更で全jobを再実行するのではなく、消費した集合とそのhashを使う。

- 原条件変更: S03以降の依存部分を失効。
- 完全解法変更: 対応するS07以降を失効。
- 本文のみ変更: S12以降の対象node監査・compile・表示検査を失効。
- 生成に使う事例変更: 当該事例を消費するS04/08/12/16を再評価。
- モデル変更: 推論/候補選択以降を再評価。公開教材を自動変更しない。
- 組版変更: 内容hashを維持しつつ関連layoutと履歴の実画面を再検査。

新規の重大反例が追加された場合は既存runで未消費だったとしても、scopeを照合して `review_required` を立てる。activeモデル変更や新評価の到着を、進行中runの入力へ黙って混ぜない。

副作用は旧workflowのintent/outcomeを使い、公開直前の中断では先に配信状態を照会する。model fitはstaging artifactへ書き、完了・検証後にmanifestを原子的に確定する。失敗jobをactive modelへ昇格しない。

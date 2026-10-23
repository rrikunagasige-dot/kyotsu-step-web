# P017/P018 — 既存14単元の修正・章内確認結果

Status: VERIFYING
Date: 2026-10-23 JST
Command: CMD-WORK-001

## 結果

承認されたN12の4件と、章全体を調べて追加で確認した42数式ブロック、合計46ブロックの表示修正を完了。最終コードで既存14単元を最初から最後まで操作し、誤答時・正答後の横はみ出しは0件。下括弧の個数ラベルと次行ボタンの重なりも解消した。

固定コードSHA：`68338688f22ffb3acaa7074b5c0c0f79584604c5`。Draft PR [#126](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/126)。原画像コミット：`f51852465fdad67d4a49357138b88e278df4f997`。正答・選択肢・ヒント・教師Word・図・ID・版番号・保存形式は変更していない。承認済みP016の2マークを非表示にし、従来の承認は保持。

[全46ブロックの一括画像確認票](./GATE1_P017_P018_ALL_LAYOUTS.md)。4件は説明・ヒントも含む画面、追加42件は誤答時44枚＋正答後42枚の原数式画像。すべて最終ソースの実Chrome画像を直接点検し、保存した90枚のGit blob SHAをローカル原画像と照合済み。

## 実施した章内確認

| 項目 | 結果・範囲 |
|---|---|
| 原問との対応 | PASS：教師Word SHA256 93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa、14単元・原問208件のID/個数と該当原問を照合。承認済みの学習用再構成を逐語一致とは扱わない。 |
| 正答・推論 | PASS：290操作を元の条件・必要な式の形と照合。138操作/156恒等式を多変数有理係数計算で独立検算し、別の19操作/23検算を厳密な平方根・分数計算で確認。残りは正値条件、指数法則、距離、場合分け、端点を意味で照合。公式別冊解答は未提供のため教師Wordからの独立検算。 |
| 選択肢 | PASS：実際に生成される290組・926選択肢を点検。値が同じでも降べき順・未整理の四項・完全因数分解・小数部分[0,1)・有理化因子の条件が異なるものは区別。厳密スカラー文法で74組も検算。未対応文法を機械的PASSにしていない。 |
| ヒント・前提の再利用 | PASS：現在の290操作を点検し、既知の7件と以前の5件の修正を保持。前問で確定した結果・問題で既に与えられた値と、新しく求める答えの先出しを区別。 |
| 誤答→ヒント→再回答→正答 | PASS：14単元の全290操作を320/390/1440で実行、870シナリオ。各操作は誤答1回＋正答1回。 |
| 保存・復元 | PASS：全操作のattemptCount=2、初回誤答記録、正答状態と単元完了を確認し、再読込後も一致。N12専用検査はfirstValue/firstAnsweredAt、以前の回答、レビュー保存隔離も確認。版番号・保存コード変更なし。 |
| 数式・スマホ・PC | PASS：全256完成数式×3幅=768幅ケース、全操作の誤答時を点検。横はみ出し0。N12関連11組の前/誤/正状態、意味のある行分け、係数と括弧、矢印を確認。下括弧ラベルのボタン衝突も検査。 |
| 図・遷移・未変更モード | PASS（既存範囲）：最終ソースの教材全回帰、N12図の解答後表示、既存の原図/段階導出/数学・物理・演習の回帰を通過。図アセットと各表示条件は変更なし。 |
| 既承認修正 | PASS：P016の2件、既承認ヒント群、N14 Q16等を保持。影響する表示のみ今回の新しい画像対象に含め、以前のヒント承認は取り直さない。 |

これは一つのエージェントによる実コード・原典・独立計算・実ブラウザの横断確認であり、別エージェントの検査やユーザーのプレイを捏造していない。

## 最終SHAのCI証拠

| Workflow | Run | 実結果 |
|---|---|---|
| Math textbook mode CI | [39929067911](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39929067911) | SUCCESS：単体250件/25ファイル、実ブラウザ257件、明示行列skip12件。型・lint・build・物理/演習回帰を含む。 |
| P017/P018専用 | [39929067924](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39929067924) | SUCCESS：単体73件/3ファイル、実ブラウザ63件、明示行列skip63件。 |
| Math practice pilot CI | [39929067929](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39929067929) | SUCCESS：単体95件/7ファイル、実ブラウザ72件。 |
| Review Preview Code Check | [39929067958](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39929067958) | SUCCESS：単体48件/5ファイル、型・lint・build。このブランチに該当しない撮影ジョブはskip、ブラウザ成功件数には加算しない。 |
| Governance | [39929067945](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39929067945) | SUCCESS。 |

専用原artifact12491281053：18,149,158 bytes、SHA256 `37096d1de946c680a09e6a22e4034e5e5bb6cbc9fda7ae46332ae962511008a4`。原ZIP268ファイル＝176PNG＋78JSON＋14TSV。[原画像・監査・検算データ](./evidence/p017-p018-final/README.md)。失敗を発見した途中段階も独立した原ZIPと履歴を保持し、そのPASSを最終ソースの証明に流用していない。

## 承認・残る工程

ユーザー原文「いいよ。残りの仕事全部まとめて修正して、章全体確認まで止まないでよ」に基づき、残る既存章の修正と再監査を途中の個別承認で止めず実施した。

- エージェント側：既存N01〜N14の修正と上記章内検査は完了、今回の範囲に新たな確定未修正不具合は残っていない。
- 人による新しい表示確認：未取得。今回の46ブロックは一括確認票でまとめて見る。P016等の承認済み部分は保持。
- 全16単元が完成したという意味ではない。未作成NE01（原問13）・NE02（原問12）の計25問は作成工程として残る。今回の既存14単元の修正は新単元を作成したことにはならない。
- 既存WORK_SYSTEMの正式なGate②/③、SHA一致の実働アプリURLとユーザーの最初から最後までのプレイ・「総チェックOK」はまだ完了していない。画像/PRを実働アプリURLとは呼ばない。Gate③ FINAL-REVIEW-NOT-READY。
- mainは15ae503455bc6ae75b080caa1c4919cafb250027のまま。merge・公開・deployなし。

既存MASTER_APP_LESSONS §§16/51–54とMATH_RENDERING_RULESのvisual/mobile/resolved規則を再利用し、同じ規則を重複登録せず、新しい具体的不具合MR16の証拠だけを追記する。


---

Historical checkpoints (not current findings):

## 2026-10-23 — P015 implemented; automated regression PASS; semantic layout FAIL; P016 PROPOSED

P015 was explicitly approved by「いいよ続けて」and implemented on944dcbdf5687a52789ae5baf55b1193537267837. FullMath39916191960SUCCESS250unit/257browser/12skip;Review39916192203/Gov39916191961SUCCESS;frozen-sourcecapture39916932746SUCCESS25unit/6browser/6matrixskip. [Exact execution evidence and infra history](./P015_EXECUTION_20261023.md).

**FAILED-VERIFICATION / REVISE-PROPOSAL for overall layout.** Actual screenshots show Q06choice detached fromfollowingx at320/390,andQ12closingparenthesis)x detached at390 (openingparenthesisseparatedat320). P015 restores existingN12wrapping;it doesnotprotect mathematicalgroups. Nativegeometry/functionalityPASSdoesnotclosevisualgroupingFAIL. Do NOT ask human acceptance of these knownbadnew2layouts. [Actual visual failures](./P015_VISUAL_FAILURE_20261023.md),[P016 exact next proposal](./PROPOSAL_P016.md) PROPOSED/NOTIMPLEMENTED. Priorsevenacceptedhintsremainacceptedandhidden;no repetition. New11same-patternN12sourcecandidatesremainUNVERIFIEDuntilnativegroupaudit. WholechapterGate②OPEN/Gate③NOTREADY;mainunchanged,nodeploy. Olderpending/implementedclaimsbelow are source-specifichistory.

## 2026-10-23 — seven accepted; N12 display diagnosis complete; P015 PROPOSED

User「じゃ続けて」is recorded as visual acceptance of P008–P014 on source22cc/images97ed3d8. All prior accepted items remain accepted. [Exact acceptance](./SEVEN_ITEM_ACCEPTANCE_20261023.md). No repeat seven-item acceptance request.

Separate display diagnosis on2bc979a20ea914e895f351a97b5129a763da5fed is complete;learner code equals22cc. Native39914505047 SUCCESS:6actual cases/6explicit matrix skips;Review39914505142/Gov39914505041 SUCCESS. All29review targets inspected:only N12Q06/Q12 lose their normal N12 classification after extracting item subsets. Normal N12 has32formula blocks. Root cause uses presence of n12-01 instead of stable unitId. [Native metrics/images/ZIP/failure history](./evidence/n12-display-diagnosis-20261023/README.md).

[P015 exact limited two-file renderer proposal](./PROPOSAL_P015.md),[proposed patch text only](./P015_RENDERER_PATCH_PROPOSED.diff),NOT APPROVED/NOT IMPLEMENTED. The existing CSSclass was temporarily added only in a browser-session diagnostic;this proves CSS geometry,not the final JSX-rendered fix or its visual acceptance. No learner/app source changes during diagnosis. Whole-chapterGate② OPEN;Gate③ FINAL-REVIEW-NOT-READY. Main/production unchanged. Older statuses below remain historical.

## 2026-10-23 — seven-item visual acceptance and next bounded audit

User「じゃ続けて」after seven real images: P008–P014 BLOCK-VISUAL-OK on source22cc/images97ed3d8. [Acceptance and exact scope](./SEVEN_ITEM_ACCEPTANCE_20261023.md). Previous five remain accepted;do not ask again. N12 mobile review formula-layout finding remains OPEN;read-only diagnosis and exact next proposal,not broad renderer implementation. Whole-chapterGate② OPEN/Gate③ NOT-READY. Historical pending descriptions below are superseded for these seven visual acceptances only.

## 2026-10-23 — current seven-hint implementation and native evidence

Latest source `22ccf559a70d758689b958c77d19f4c9cdd43b7e`,image child `97ed3d8e4a03ec4a6af8cc96987f79f5ba31aa3b`,Draft PR121. P008–P014 APPROVED by user「まとめて修正してくれ」and implemented exactly. Review39911476014 SUCCESS:48unit,42realbrowser/42explicitmatrixskips;Governance39911475938 SUCCESS. Math39911475985 SUCCESS:250unit/257browser/12explicit skips. [Current exact results/history/limits](./SEVEN_HINTS_EXECUTION_20261023.md),[all seven actual images](./GATE1_SEVEN_ITEM_REVIEW_20261023.md). No repeated implementation approval. New seven visual Gate① remains BLOCK-CHECK-PENDING;prior five accepted unchanged. Work VERIFYING;whole-chapterGate② OPEN;Gate③ FINAL-REVIEW-NOT-READY. Main unchanged;no merge/deploy. Older pending/proposed/test-failure status paragraphs below are retained history,not current outcome.


## 2026-10-23 — seven exact hints approved and implementation started
User direct response **「まとめて修正してくれ」** followed the seven exact proposed new hints/P008–P014 and the explicit grouped approval question. This approves precisely those seven hint strings;no repeated approval is required. Record parentd95dd283d204095bf58ece70faef9544abe1d42d/source runtimefc27e7f5fbdc28345917276d43602ea4787537bd;live main15ae503455bc6ae75b080caa1c4919cafb250027 unchanged;account/repo1391122224 verified.
Seven replacements in four files only. Keep keys,authored/visible choices,original208 markers/290 graded decisions,unit revisions,flow/math,text/figures,schema,renderer and progress semantics. Prior five accepted blocks and N13/Q16 migrations remain intact. Verification adds exact real review sections,seven boundary cases,and real normal/review Chromium320/390/1440 cases. N10Q08 includes its actual Q07 prerequisite in preview;N12 uses actual sub-item indices;N04Q22 correctly handles final-unit completion. Uses getTextbookChoices actual2/3/4 choices. Source CI and authentic images **PENDING** until actual native results. Evidence archived on a separate branch so source CI is not cancelled by image commits.
[P008–P014 approved batch](./BATCH_HINT_PROPOSALS_P008_P014.md). New seven human Gate① is pending after engineering QA;prior five remain accepted. Gate② OPEN;Gate③ FINAL-REVIEW-NOT-READY;no main merge/deploy or NE01/NE02 creation.

# W025 current chapter audit — 2026-10-23
Status: IN-PROGRESS
Command: CMD-WORK-001 修正
Frozen learner source: fc27e7f5fbdc28345917276d43602ea4787537bd

## Current result
Real runtime export confirms14 units/208 original Word questions/290 graded decisions. Every original marker ID/count matches the Word body. The290 ordered hints were triaged in actual generated form;not stale original definitions. **Seven newly confirmed hint pre-exposures** have exact [P008–P014 proposals](./BATCH_HINT_PROPOSALS_P008_P014.md),all PROPOSED/unimplemented. The seven are four direct current numeric answer/component cases,two expansion/factor tasks and the grouping decision specified below;do not claim that the whole chapter is pedagogically clean.

Existing five-item user acceptance remains closed. Q16 and all accepted fixes already coexist in sourcePR119,with250 math unit/257browser,Review41unit+Q16sixbrowser,practice95unit/72browser andGov PASS. New audit code changes no learner source. Audit-only execution3cea41ef729ec21a6e0b6233346b677b0feffab5:Snapshot39908283290,Review39908283307,Governance39908283211 all SUCCESS. [Frozen actual export/provenance](./evidence/chapter-audit-20261023/README.md).

## Findings and exact proposals
| Proposal | Target/current item | Confirmed output supplied before current calculation | Proposal status |
|---|---|---|---|
| [P-008](./PROPOSAL_P008.md) |N04Q20 / n04-20|1と4を組にし、2と3を組にすると和が揃う。|PROPOSED;not implemented|
| [P-009](./PROPOSAL_P009.md) |N10Q7 / n10-07|平方数である16を因子として取り出す。|PROPOSED;not implemented|
| [P-010](./PROPOSAL_P010.md) |N10Q8 / n10-08|16の正の平方根は4になる。|PROPOSED;not implemented|
| [P-011](./PROPOSAL_P011.md) |N12Q6 / n12-p002-q06-left-coef|3−2=1。1xはxと同じ。|PROPOSED;not implemented|
| [P-012](./PROPOSAL_P012.md) |N12Q12 / n12-p002-q12-signed-coef|130×(−x)=−130x。符号も答えに含める。|PROPOSED;not implemented|
| [P-013](./PROPOSAL_P013.md) |N04Q22 / n04-22|T²ではx⁴、10x³、25x²が出る。さらに10Tを足す。|PROPOSED;not implemented|
| [P-014](./PROPOSAL_P014.md) |N07Q11 / n07-11|10=2×5なので、その積をk回掛ける。|PROPOSED;not implemented|

Each proposed edit is one hint string;seven strings in four authoring files. Preserve all Word IDs,original counts,unit revisions,keys,authored and visible options,flow text/math,figures and saved progress. Seven immutable before/after strings are reviewable now. Their implementation approval has not been obtained. Present together as requested,then implement and QA the approved batch together,not question-by-question user pauses.

## Bounded non-defects and unresolved interpretation
- N05Q15,N06Q16,N07Q03 reuse results actually resolved in prior gated questions;not new numeric-answer revelation.
- N09Q08's original whole expression follows its newly introduced four local calculations;previous accepted repair is preserved.
- N09Q12's3²=9 and4²=16 already appear in the current given paragraph;its hint does not newly expose those inputs. Source applicability is checked before flagging repeated numbers.
- N05Q02/N05Q19 identify a factor from visible inputs while leaving later expression calculations;N09Q06 supplies intermediate square values but current graded response is a sign. These are retained for separate pedagogical interpretation,not silently given an overall hint-quality PASS or automatically changed by the seven proposals.
- N10Q08 has value-equivalent authored distractors but only one is currently visible. See actual-generator evidence;no visible duplicate defect is claimed.
- Other grammar in answer equivalence,all unreviewed wording/figure educational conditions and other modes' pedagogical root sweep remain UNVERIFIED. Export/schema PASS is not a maths/pedagogy PASS.

## Required cross-audit ledger
| Required surface | Status | Current evidence and limitation |
|---|---|---|
| Original source/IDs/wording fidelity |UNVERIFIED|All208 IDs/counts PASS;seven selected original Word prompts and OMML checked;whole wording not certified|
| Maths/physics chain and dependencies |UNVERIFIED|Seven target calculations independently checked;Q16 scoped certificate retained;not all chapter proofs certified here|
| Keys/choice types/missing-term representation |UNVERIFIED|Current250unit/257browser regression;actual290 option lists exported;56 simple-radical/constant choice sets exact-checked;other grammar remains|
| Premature answers/hints |FAIL|Seven confirmed findings,seven exact unapproved proposals;290-source triage does not close every pedagogical interpretation|
| Figure/cell/KaTeX/mobile visual fit |UNVERIFIED|Existing exact-source runtime/figures QA retained;new hints not implemented or visually accepted|
| Wrong/retry/correct/navigation |PASS covered runtime|Source39905633260 and Q16 capture39905633261;no runtime changes by audit|
| Shared UI/all affected subjects/modes |UNVERIFIED|Renderer/schema untouched;physics andpractice regression PASS covered routes;other-mode educational audit not implied|
| Phone320/390/desktop overflow |PASS covered runtime|Exact-source regression and original Q16 viewport evidence;proposed new strings will require new actual captures|
| Persistence/reset/review isolation |PASS covered runtime|Domain source unchanged;existing current-source tests and Q16 scoped archive/isolation QA retained|
| Prior approved corrections |PASS preservation|Eighteen source blobs and actual transformed data preserved;five old accepted items not reopened|

## Mathematical evidence and source proof
N04Q20 has three pairings with coefficient sums(3,7),(4,6),(5,5);last gives(x²+5x+4)(x²+5x+6). N04Q22:(x²+5x)²+10(x²+5x)+24=x⁴+10x³+35x²+50x+24. N10:6×8=48=16×3 and√48=4√3 with positive sign. N07:10^k=(2×5)^k=2^k5^k,k≥1. N12:3x−2x=x and130(20−x)=2600−130x. These are independent arithmetic/source checks,not approval to implement.

Teacher Word SHA25693827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa. Relevant body paragraphs186,188,310,419,420,515,530. No separate official answer booklet supplied. No copy/source rewrite.

## Next permitted action and gate
Existing WORK_SYSTEM §2: **An unapproved proposal must not silently become implementation.** Therefore request one grouped decision for the concrete new seven exact hints. This is not reapproval of old five. After approval,only those hints and necessary real QA/review surfaces;then grouped visual acceptance. ChapterGate② remains OPEN withFAIL/UNVERIFIED cells. Gate③ FINAL-REVIEW-NOT-READY;no app-wide acceptance/main merge/deployment. NE01/NE02 creation remains2 units/25 original questions,deferred by correction-first rule.

Existing MASTER §§19/20/51–54 already express the lesson;no duplicate rule added. The run/queue/source evidence lives in existing Work records rather than an invented workflow state.

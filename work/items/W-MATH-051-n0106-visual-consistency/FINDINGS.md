# Current record reconciliation — W-MATH-051 / FINDINGS.md

Status: RECORDED
Record-Scope: Metadata/provenance restoration only; no product or Store mutation.
Fixed-Candidate: 84f90ba9d6c7fea8ebbaed976fc0de68aaa0c91b
Work-State: BLOCKED

Historical record recovery remains blocked: exact current scope/approval/verification mapping is incomplete; no approval, completion, or learner acceptance is inferred. Only P005 is closed; parent W051/P004 and separate N04/N06/function findings stay open.

Evidence:
- Store approval event 816e1846-7b33-416f-b7eb-7a36d1a1fce2, proposal_hash=fd5524d507112335ade94247c1c61c487bf488b8f8c4a5b97e983b03a38359e9 (historical, no new quote)
- Store approval event c97a1175-3e3a-4a39-8da2-74b9cf371ca8, proposal_hash=7de678681b12b5c53cdb2d37863455aa380ce2fe312b948aee9927ae12f0ced0 (historical, no new quote)

Original-Body-Source: existing untracked physical recovery record
Original-Git-Body-SHA256: ABSENT
Original-Physical-Body-SHA256: 6858c23dd8825b5277e6eb4d6723c366a2bdad4e64942cb5d9a4e6277634596d

<!-- HISTORICAL ORIGINAL BODY START — bytes below preserved exactly; current metadata is above -->
# 所見

原因と表示差の正本は親Workの `feedback-layout-draft/reaudit/REAUDIT_JA.md`。

追加した修正対象：問いの縮小、本文外の数学、参照/結果の寸法、例題以外の役割ラベル。

提案中に見つけた漏れ：÷を日本語textに残す分割、問いの親spanだけ18pxにしても内側spanが旧CSSで縮むこと。今回の固定候補で静的補修済み。実画面合格とは区別する。

関連修正候補：N06の置換定義式の連続重複。後半の一部readerにも残る通常文字の問い。N07以降や他モードを一括変更する根拠にせず、修正queueへ保持。

実検証で追加検出：react-katexの外側spanを静的見本/QA getter/CSSが想定していなかった。getterを補修して故障分離し、見出しの数式20.328px対親16.8pxが実在すると確認。css-repair-draft/P-W051-003.mdへ最小1セレクタ補修を固定。一時CSS注入で16.8pxに一致し指数0.7を保持。製品未補修・R07 FAILを保持。

休眠表示の照合：presentation.tsの旧completedLabelには4x/−2x²等があるが、現N01の該当4段階にはresultBlockIdsがあり、Pageはstage.label側を表示する。現行経路で未解決の数学表示として件数に加算しない。


## 2026-11-08 公開経路の訂正

接続GitHubで従来のmain push自動公開が可能である一方、Rootがmain統合を避けてmanual dispatchへ迂回し、不要なブラウザー認証/ユーザー手動操作を依頼した。元経路の実run/eventを確認し、今回の完遂指示を正しく対応付けてPR139経由へ戻した。既存の「機械的実装選択で再承認を増やさない」「同じ公開許可を聞き直さない」「外部操作と受入を分ける」を参照し、新規の規則を増やさない。

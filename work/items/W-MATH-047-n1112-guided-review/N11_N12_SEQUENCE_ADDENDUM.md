# W047/S1 — N12の実装・検証を先に進める工程設定

Status: PROPOSED。設定未適用・未公開。教材内容は既承認P006/R1を維持。

## 現在位置と目的

N11 source `2b7780b97bf8c3bde463742e71bf3e816ea8b562` はR07、修正版Gate①、G2まで完了。G2-B-L01は現sourceの統合監査でVERIFIED_FIXED。N12のP006五箇所は承認済み・未適用。

現在の火柴図は `G3_HOST@n11` を次に出す。N11/N12を完成させてから一つのアプリで最終確認する進め方に合わせ、既存CODEにある公開保留時の優先順を使用する。

## 承認する設定

`WORKFLOW_PLAN.json` の `scope.prohibit` に `G3_HOST` だけを追加する。既存 `workflow/graphs.py` の優先制御が、全unitの実装・検証を公開工程より先に扱う。共有workflowコードは変更しない。このflag自体は公開権限のhard guardではなく、公開には従来どおり別の実承認が必要。

| 範囲 | 使用する既承認内容 |
|---|---|
| N11 | P006六箇所＋R1の商の空と完成式の解放順。現authored/compiled/graph/採点/保存を保持 |
| N12 | P006の五箇所そのまま。内容IR `770b485ccabe431dbeba424c1c6a64f563f226111851c80a6cbeb67b19524840`、46回答の契約を保持 |
| 書込範囲・保護範囲 | 現Workのpaths/preserveを変更しない。新しい製品pathを追加しない |
| 元資料・規則・担当 | source_manifest/rules/agent_teamを保持。M＋A/B二人。過去の承認と原報告は保存 |

具体的な設定後planは `S1_WORKFLOW_PLAN.json`、差分検査は `evidence/S1_SEQUENCE_CHECK.json`。変更はscopeの公開保留指定、提案版の識別、当該文書のdesign-input対応だけに限定する。block/IR/patch/採点/保存・source graph・旧検査の内容は変えない。

## このscopeに対応する承認を記録する理由

既存 `workflow/integration.py` の `approval()` は、実user recordのscopeと現plan scopeの完全一致を要求する。`approval_coverage_migrated`はbundle指紋だけを扱い、旧user scopeは変更しない。したがって旧userのscopeを書き換えたり、承認を生成して通したりしない。この提案への実際の返信を、新scopeに対する承認として記録する。

承認対象はこの工程設定と、上表の既承認内容を同じ書込範囲で継続すること。N12の内容はP006どおりで、穴や問を新たに設計し直す承認要求ではない。

## 承認後の実行

1. 元承認・source・旧検査結果を保持して、既存Runtimeの正式な提案改訂と実承認記録を行う。scope変更で入力が失効した結果は必要な再検査・再結合を行い、旧PASSを新PASSへ書き換えない。
2. N11の不変範囲を保護し、N12のP006案を既存生成・変換CODEで適用。Aが理念・文章接続、Bが非作者の実表示を監査。全46正答/127誤答候補、四幅、再読込・保存移行・reset・前後単元を検証する。
3. N12の実画像確認と影響範囲のG2を行う。追加欠陥があれば修正工程へ戻す。
4. N11/N12をそろえた固定候補と公開前資料を用意し、別途公開権限を確認。実際のアプリURLを検証してから、本人の最終確認は合意したN11/N12範囲をまとめて一回行う。

### 最終確認一回と単元別台帳記録

既存CODEでは `G3_FINAL@n11` が `G3_HOST@n12` より先に並び、`accept_app`の`release_unit`は一つの単元と一致する必要がある。この順序と記録単位はそのまま明記し、一件のuser eventを両nodeへ直接流用しない。

実公開は一つの固定SHA・同じアプリとし、本人へ渡す前にN11/N12両routeの実HOST証拠（到達性・source SHA・操作/進捗分離）を取得する。未到達のHOST nodeをPASSにはしない。全範囲を明示した最終確認依頼に対する、同じ実際の発言がN11/N12両方を覆う場合だけ、その原文・出所・確認セッションを維持した単元別の二記録を作り、既存CODEのnode順で受理する。各記録のreply_toは同じ候補の当該単元の実HOST証拠へ対応付ける。N12 HOST nodeは、既に検証した同じ固定buildと実証拠を正式nodeへ結び、再公開や二回目の本人確認を要求しない。

二記録は同じ本人確認一回の転記であり、別の独立評価二回・追加の品質学習labelとは数えない。発言が片方しか覆わない場合や候補SHA/URLが変わった場合は、この共通確認の扱いを適用しない。

G3を実行済みにする、公開許可・main merge許可・最終受入・品質学習labelを付与することは含めない。既存二本の旧版固定CI FAILは原ログのまま保持し、専用CI成功と全repository greenを区別する。

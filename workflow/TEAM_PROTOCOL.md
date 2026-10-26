# team/1 の実行契約

現行CODE: `team.py`、`team_transport.py`、`team_migration.py`。入口は既存の作成／修正。新規教材Workの標準方針は `governance/TEAM_POLICY.json`。

## 開始と受渡し

1. Mが正本、Work、node、block、scopeを固定し正式claimを取る。A/Bを現harnessで起動・再利用する。独立な仕事だけを並列化する。
2. `team-capture`で原tool結果を同じStoreへ保存する。`harness-tool-result`か`transcribed-tool-result`を区別する。CLI自体はLLMを起動しない。
3. 作者／調査者にはincoming packetを渡す。`sourceManifest/sourceSHA/blockContext/nativeEvidenceRefs`を現入力と照合する。まだ存在しない作者成果物は要求しない。
4. 作者が成果物を返し、原報告とstructured outputを対応付ける。CODEを実行し、現在nodeのreceipt／実作者出力を基に、Mが`team-bind-target`で審査対象を固定する。
5. reviewerのassignmentに`targetManifestRef`を指定する。表示の実装後レビューには現sourceのnative screenshot/captureが必要。任意の古いhashを宣言するだけでは登録できない。
6. `team-record-output`で原子報告、担当、assignment/packet/hashを照合し、`team-reconcile`で実taskの完了を確認する。
7. Mが既存nodeの結果に`teamCollection`を添付し、既存`submit`／`production-result`へ提出する。必要scopeの全審査と未解決の不存在をCODEが検査する。

CLIの保守操作:

```text
team-policy / team-capture / team-bind-target / team-register
team-record-output / team-reconcile / adopt-team-policy
```

これらはC/R内部の操作であり、別の制作入口や承認gateではない。

## 固定するもの

- 基礎node入力 → packet → assignment → 原報告 → collectionの一方向hash。
- 実担当、論理役割、提出者を区別。Mが転記しても実担当を書き換えない。
- 同じclaimの作者履歴は改名・役割交代・版変更でも残す。post-implementation／G2では元blockのrender作者も継承する。
- 審査の初回所見、見せた資料、作者の説明への露出を明示。別threadだけで盲検やモデル独立性とは呼ばない。
- 共有Store・Git indexへの書込みはM。A/Bの所有pathは分ける。read-only指示はOSの権限制限ではない。

## 指摘と復帰

同じblock/claim/facetに対する元findingと修正確認を対応付ける。解決報告はresolverが完了し、現assignment・入力・source・targetに一致して初めて有効。取消・未照合・古いresolverでは閉じない。入力hashが変わっただけで未解決を消さない。

完了済みnodeへの新しい未解決は、検証済み出力から`result_reopened`を追記し、下流を再検査する。多数決で閉じず、原資料・再現・反例で判断する。snapshotのfinding一覧は履歴を含み、`VERIFIED_FIXED`文字列だけを有効な解決と判断しない。

## 組立・配置のCODE／AI分担

`construction-layout/1`は既存`solution/1`へ接続する。部品型、組立、有限候補検算、三状態の配置、実測値をCODEへ、穴の教育的意味、既習から次へ進めるか、文章と式の流れをAIへ置く。

construction/layout/learnerCopyのhashをblockへ明示し、IRとともに同じcompiled成果物で照合する。CODEがPASSしても意味審査は省略しない。対応外／予算超過はUNSUPPORTEDで止める。

N08の39node・33親・15部品を扱う設計materializerは生成・検査用であり、active教材は切り替えていない。適用時は承認済み単元設計と保存・表示の実装を別途結び付ける。

## 検査

- `pnpm run test:production-workflow`
- `node --test tools/textbook/tests/transformation.test.mjs tools/textbook/tests/n08-transformation.test.mjs`
- `pnpm run test:textbook-authoring`

数学adapterには既存 `tools/textbook/research/requirements-solution.txt`、学習fixtureにはnumpy/scikit-learn等の既存依存を使う。端末のPythonにSymPyがない場合、`KYOTSU_MATH_PYTHON`へ依存導入済みPythonを指定する。検査fixtureを実教材の品質承認や実agentの教材審査済み証拠へ転用しない。

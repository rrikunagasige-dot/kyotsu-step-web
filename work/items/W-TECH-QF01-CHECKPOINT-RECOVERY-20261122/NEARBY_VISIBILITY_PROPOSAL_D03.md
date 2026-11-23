# P-QF01-NEARBY-VISIBILITY-D-03

状態: 追加具体案V2・未採用・製品未修復。原V1を保存し、未mountと公開原文の扱いを具体化した別版。既存RECOVERY/PUBLISHERの2技術Workだけを使用する。原1d案とD02案は変更しない。

## 問題と今回変更する制約

現在B `247cb09b1d852d4e4fa469b3d74fb29bee053c53` のn19正答後、次のendpoints判断で、定義域説明p06が完全に見えているのにp07の前へ同文を再掲する。四幅320/390/430/1440で原画像・DOM・hashを確認した。固定metadataは「指定sourceが画面内なら元本文を使い、必要なのに画面外の場合だけslot/panel前へreadonly再掲」と定める。実装がtop参照container一個の画面外判定を、個々のsourceの判定へ代用していることが原因である。

根拠は同じ監査directoryの `D02_NEARBY_REFERENCE_BOUNDARY_AUTHORITY_REVIEW_20261123.md` と `D02_NEARBY_REFERENCE_BOUNDARY_AUTHORITY_EVIDENCE_20261123.json`。元のFAIL・四幅093証拠・追加採取の失敗と再採取経緯を保存する。これは実配信QAや独立した非作者審査の証明ではない。

原D02の「製品修復5ファイルはAと同一bytesを維持」を、この不具合に必要なrenderer/testの2pathに限って変更する。残り3path、教材本文・固定metadata・35判断・134本文block・数学AST・ID・採点・学習保存・既存受入は変更しない。既知の規則へ表示を合わせる修復で、教材の教え方や審査基準の再設計ではない。

## 製品の具体的な差分

1. QF01 revision3のnearby表示だけ、現在判断とsourceBlockId別の実可視状態で決める。top containerのbooleanを各sourceへ流用しない。R2/Numbersの実装は維持する。
2. 正本のcanonical sourceだけを測り、再掲コピーやhistoryの別viewを代用しない。既存の固定header/footerを除いたviewportと実rectを使う。全文・全幅が読み取れるsourceは再掲0件。部分clipを含め全体を読めないsourceは、registry成立・正本projectionを確認したreadonly sourceだけ一度再掲する。registryと正本projectionが成立し、sourceが前段階に属して現段階のprelude/bodyに配置されないことを固定metadataで確認できる場合は、NOT_MOUNTED_BY_DESIGNとして記録済み正本のreadonly再掲を許可する。現固定metadataの該当8参照はtop/preludeとの同source重複0件と確認済み。同段階に存在すべきcanonicalの欠落・複数存在・零寸法・測定失敗はUNVERIFIEDで停止し、画面外として通さない。現段階のprelude/bodyにあるcanonicalは同じ表示面として測る（nearby56参照のうちpreludeとの同source11件を含む）。近傍コピー自身やhistoryを正本へ呼び替えない。
3. 複数sourceは個別に判定し、同じsourceを複数recordが指しても再掲は一件。元図が見えている場合も同じ既存規則を守る。コピーに新しい解答button・新しい式番号を追加しない。
4. current/stage/sourceの切替、scroll/resize/font準備後に再測定する。古い判断の状態を流用せず、同じ測定値でstateを更新し続けない。手動scrollに勝手なfocus・回答・追加scrollを発生させない。再掲で配置が変わる場合も同じ実状態へ収束することを検査し、収束しなければ停止する。

製品の変更許可pathは次の2件だけ。

- `src/components/textbook/GuidedMathReadingFlow.tsx`
- `src/components/textbook/QF01ReadingRevision3.test.tsx`

## 固定回復proofへの接続と失効

現在のguardは原5修復の固定bytesを検査するため、単に新しいafter hashへ書き換えて旧承認を流用しない。原A/Bの5修復proofは不変に保存し、本D03の実採用・before B・2pathの実Git差分・実検査後のafter manifestを結ぶ限定追加proofを作る。候補SHAやafter hashは実Git確定前は未確定とし、予想値を使わない。

必要なcore接続は、実D03採用を原1d/D02とは別の追加権限として検証すること、2path以外の製品差分を拒否すること、現在source/definition/service/authority/input/targetに結ぶことに限る。通常Store、他Work、一般team/1、旧prefix回復の保証を緩めない。旧固定hashや旧イベントを上書きしない。

coreで変更できるpathの上限は以下。不要なpathは変更しない。

- `workflow/checkpoint.py`, `workflow/adapters.py`, `workflow/runtime.py`
- `workflow/team.py`, `workflow/cli.py`, `workflow/integration.py`, `workflow/definitions.py`
- `workflow/test_checkpoint.py`, `workflow/test_checkpoint_runtime.py`, `workflow/test_checkpoint_definition.py`
- `workflow/INTEGRATION_RUNBOOK.md`

publisherは既存7pathの範囲で、新しい追加proof・実export・実sourceへ検査を接続する。

- `.github/workflows/qf01-publisher-g3.yml`
- `tools/release/qf01-publish-contract.json`
- `tools/release/qf01-publish-check.mjs`, `tools/release/qf01-publish-check.test.mjs`
- `tools/release/qf01-retained-adapters.mjs`, `tools/release/qf01-retained-adapters.test.mjs`
- `tools/release/qf01-browser.mjs`

原bootstrap A、原移行、B移行、原承認・原seal、現在Bの結果とP6のCI成功は保存する。新sourceのapp/service hashを実導出し、coreを変更した場合のdefinitionも実導出する。正規preflight・移行・候補再結合を行い、入力が変わるS/T/R工程・compile/R06 proof・両担当の報告・publisher・R07/G2を再検査する。旧PASSは新しい入力の合格へ転記しない。既存のRECOVERY/PUBLISHER内で必要な提案改訂と実T01〜T04を記録し、第三の技術Workは作らない。

## 必須検査と公開範囲

表示中0コピー/画面外1コピー、scroll双方向、複数sourceの一部だけ画面外、未成立/測定不能、固定帯・部分clip・図・式番号、wrong/正答後の次slot・history・reset/reload・保存隔離を確認する。原093境界と四幅×35判断×未回答/誤選択/正答後を実測し、既存の数学・番号/基線/枠・焦点・共有回帰を保持する。Nodeの模擬DOMだけで実描画合格にしない。

既存の同じ2名を維持し、D02の寄与開示方式、independent/sourceFirst/firstPass=false、実作者履歴と原first-pass sealを保持する。両名の現在報告・現在CODE・真正な実測でfinding解消を確認し、OPEN/CODE FAIL/未確認があれば停止する。

公開原文は `work/items/W-TECH-QF01-CHECKPOINT-RECOVERY-20261122/NEARBY_VISIBILITY_PROPOSAL_D03.md` の1pathに限り、採用後に本V2と同一bytesを配置する。これはCIが原案hashを検証するための原文であり、実本人回答・実台帳を含む採用payloadとは別である。

本追加案の採用は、上記20コードpathのうち実際に必要になった検査済み差分とこの原文1path（上限計21path）を、公開GitHub `rrikunagasige-dot/kyotsu-step-web` の既存core/publisher作業ブランチへ反映し、必要なCIを実行することを含む。送信前に対象path・bytes・SHA256を一覧へ固定し、その範囲を超えるコードや実台帳・学習保存・認証情報は含めない。記録文書と専用台帳は既存2技術Work・既存継続Work・専用checkpoint namespace・workspace監査資料だけに保存する。

コードと案原文の送信許可を、実台帳を含む公開payloadの送信許可へ流用しない。必要な場合は実payloadを検査して別途判断する。main変更や配信をこのコード反映操作と同時に行わず、公開前の全必須依存と既存の実CAS/DEPLOY権限を個別に検証する。原受付・完全prefix・global queueはUNKNOWNのまま。必要な依存が不足すればそこで止める。

現在の目標は引き続き実アプリの公開後確認と本人に提示できるURLであり、本追加案だけで公開成功・本人受入を保証しない。最終 `G3_FINAL@qf01-p035` の本人実物受入は別途必要で、D03採用・継続指示・技術成功を受入へ変換しない。

採用を求める内容: 上記の限定再掲修復、追加権限に基づく正規再結合・失効・再検査、および列記20コードpath内の検査済み差分と原文1path（上限計21path）の既存公開作業ブランチ反映とCI実行。

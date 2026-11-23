# 追加D06案：狭幅R3の二重余白を調整し、数式と候補を親枠内へ収める

Proposal ID: `P-QF01-MIXED-INLINE-LAYOUT-D06`。状態は**未採用・製品へ未実装**。D05 V2の再採用確認ではない。

## 確認した問題と、追加判断が必要な理由

D05 V2（固定SHA256 `68fe1a1431a1ac915bab6f4cbf7225aa380448cbbb611e2a68dc1cfe6de03000`）は実採用済み。実採用file SHA256は `474e62a3fa2fce89bb65c2efea8b486cfc4896c7a1a05de5fe23ea01bdb9f4cb`、正式台帳seq14190/head `5b7bb8c88e8a8588370b9c5bf44c17c3ed9426dbf728d158ff2a77ada36d94c7` に保存した。正式candidateはD3 `249cc8ee4648bc86897e66e3c9b5847e5592e5c1` のままで、新candidate・D05正式migration・現在版の全体合格はまだ作っていない。

D05作業版の320幅で、意味問 `qf01-r3-n04-value-meaning-answer` を別候補で2回誤答すると、第2hintの `f(入力)=対応する値` が実幅211.5px、内側の利用幅が約184.66pxとなった。asideが最小内容幅へ膨張し、候補の右辺も親panelの枠外へ出る。Rootとaxis_reviewが実PNGを閲覧し、新しい全親content包含の観測はUNVERIFIEDへ停止した。元の20観測の機械PASSは祖先の枠幅を見落としており、その原記録も保存する。

原所見は `D05_WORKING_SECOND_HINT_OVERFLOW_FINDING_20261123.json`、SHA256 `a60d25d638afddfc8f0782f559fec63f05774af743e8601830765adcc42df718`。これはactual native candidateがD3、新Gitがnull、作業renderer/testが後記b891…/f62b…という資格の所見であり、正式D05 sourceの検査だったことに付け替えない。D06の原所見guardでも、このraw/hashと作業版という資格を固定する。

初期の191式隔離診断は18pxだったが、実アプリは `TypesetInlineMath > react-katex中間span > KaTeX` によって21.78pxとなる。実階層でV2の191式を測り直した最大自然幅は218.515625px（`(A+B)C=AC+BC`）。元のAST・可視innerHTML・spacing・1baseを全件維持して確認した。前の18px診断を実画面の証拠へ付け替えない。実font隔離JSONのtemplate由来 `proposalAdopted:false` はD05の採用事実と異なるため、採用状態の根拠には用いず、正本の実採用file/seq14190を優先する。原rawを保全し、数値検査の資格と採用事実を分ける。

採用済みD05原文51行は「**helpのpとその枠・CSSは維持**」と定めている。211.5pxを184.66pxへ収めるには、最小幅の指定だけでは足りない。以下の左右余白変更はその固定条件を超えるため、`governance/WORK_SYSTEM.md` §11に基づく追加案とする。文字縮小・式切断・隠蔽で通さない。

## 製品の具体変更

製品pathは引き続き次の2件だけ。

- `src/components/textbook/GuidedMathReadingFlow.tsx`
- `src/components/textbook/QF01ReadingRevision3.test.tsx`

D05作業版の比較用SHA256は順に `b891ae407065fbedc4631b5eb949e9568a298ec8a026162f9caf495dff665126`、`f62b79a47e859d4b7ce64bca5544df1e58f92f849a43de21eaeba8364ebba270`。これは正式Git source/afterではない。正式beforeはD3の2hash（renderer `a6cdaeff9ab4e1b7b8e78006475a9ef19ce1b1bdb57546ccff7c8dad1980ee6c`、test `c72637c2de40e5fab336f9eba896862d74dda11a4477036b4236c345acb1cebe`）とし、正式afterは採用後の実装・検査・実Git取得後に確定する。

renderer内のR3専用styleへ、viewport **360px以下だけ**次の規則を限定して加える。共有CSSファイルは変更しない。

| R3内の対象 | 設定 |
|---|---|
| `.reading-inline-choice-panel` | 左右paddingを2px |
| そのpanel内の `aside.reading-choice-hint` | 左右paddingを0px、min-widthを0 |
| 同aside内のp | min-widthを0 |

selectorはR3の `data-qf01-revision="3"` へ閉じ、通常の優先度を使う。単独の第1hint p自体のpaddingは変えない。縦の余白・枠の線幅と色・外側panelの横位置と幅・p/aside/frameのDOM・読み順・候補順序を維持する。ボタン固有style・元の最小操作領域・非重複・到達性も維持する。panel内の余白減少に伴うボタンの座標や幅の変化は、親枠内包含と操作性を実検査する。390/430/1440幅の左右余白は既存値を使う。

承認後、全状態で同じ包含条件を満たすために必要な限定再修復は、上記panelの左右paddingを0〜2pxの範囲で調整する差分と、その再検査に限って含む。対象外のmargin/border/フォント/共有style/構造移動へ拡大しない。D05の単一inline-flow wrapper、全191 typed境界、本文140区間＋原math22、汎用helper、原134本文・35判断・ID・正誤・保存は保持する。説明用の日本語placeholderも原文のままで、文字・式・spacing・数学単位を変更しない。

## 成立性の実証と、その限界

私的Edgeだけで一時styleを入れ、元のstyle属性へ完全に戻した。製品2pathとapp401ファイルのbytes、学習保存は不変。既存の微小transitionの収束を2実requestAnimationFrameで待ち、PNG前後の計測も一致させた。

固定証拠は `axis_D05_LOCAL_PADDING_CANDIDATE_PROOF_20261123.json`、12,743 bytes、SHA256 `beef413bff6c70a9757c6e4adfdd4ad7aceabbffd5bd3fd513045f52ecc2692f`。対象4幅の候補は親枠内包含PASS、Rootとaxis_reviewが全4PNGを実閲覧した。320幅のhint利用幅は220.625pxで、191式最大幅との差は2.109375px。字体21.78px・問題の式幅211.5px・外側panelの横位置と幅は不変だった。

- 320候補PNG：`browser-review/d05-working-ui-padding-candidate-ninth/320-qf01-r3-n04-value-meaning-answer-second-hint.CANDIDATE.png`、SHA256 `d8aa4fbae7b618be2c2ab050de4c7d71e1be77854b6c5a884615fd0184de097c`
- 390候補PNG SHA256 `ddb22b9faa6d3c3e1de35e56a61dd6e4e54bb1bace527e6d44832456be02007c`
- 430候補PNG SHA256 `d0a8e108d070771ddaa031040e8b340386f0bdc3dca519c6f3763b9744486bc4`
- 1440候補PNG SHA256 `2dc5cbedebd224b4e15013165dbac199ce3bbf2016286a1946ca01c406d4398c`

これは5判断・原20観測と対象4候補の成立性診断である。全420/280/140、全47source、現在版の全画像審査、固定Linux CI、正式受入の代わりにはしない。2px程度の余裕なので、実装後に全幅・全状態で改めて計測する。

## 正式工程への結合

D05の実採用、固定原文、exact20field `mixedInlineRepair` と全先行履歴を維持する。D05が正式移行済みだったことにする中間event/PASS/T02は作らない。D05とD06の両実採用file evidenceが先行した、一回の真正D3→新source移行として扱う。

preflight/migrationへ別field `inlineLayoutRepair` を追加する。schema `qf01-mixed-inline-layout-supplement/1` のexact10fieldsは `schemaVersion / proposalSHA256 / evidenceRef / transcriptionSHA256 / quote / source_ref / verification_level / mixedInlineRepairSHA256 / checkpointEpoch / allowedProductPaths`。D06の実採用と固定原文・Git entry/blob/raw/workingの一致を要求し、`mixedInlineRepairSHA256` は同じevent内の実D05補足のcanonical digestへ一致させる。これでbefore/current after2/candidate/full manifest/definition/implementation/epochを一方向に束縛し、循環参照や二つのcurrentを作らない。

D06を使用する現在sourceでは当補足を必須とし、削除・別採用への置換・異なるD05 record参照・旧afterへの巻戻しを拒否する。後続更新は実直前candidate/manifestから結び、同じafterでのcore-only継続は検査後に許す。D05単独・D04単独・D03単独・通常経路の既存guardとfixtureは保持する。Python/native/Git/team/Nodeで同条件を検査する。

既存RECOVERY/PUBLISHERの2技術Workを使い、ownerの現在案は共同適用D06へ正規改訂する。原A22 source/rules/scope/snapshot、418 protected keys/許可2以外416、原1d〜D05の実採用を保存する。現在T02は実際の共同案D06の本人回答へ結ぶ。未実施のD05 T02を捏造せず、patch/filewriteも再実行したことにしない。

入力変更による失効を記録し、S/T/R・current proof/CODE・compile/R06・両報告・publisher/R07/G2を現在sourceで再検査する。元6aのIR/内容が同一ならR05は真正な既承認へ照合する。生産PINは実R06/export後だけ。旧D3/D05作業版の検査を新版の合格へ移さない。

## 必須再検査と停止条件

四幅のmain420・help開閉280・実際に別候補を再誤答したsecondHint140を分離し、全行を覆う新tileを取得する。追加規則の境界360/361pxでも対象secondHintと実最大幅の数式を確認する。marker23・semantic choice24の実mount coverage、hint70/非null理由70、非可視null35、191数学区間、原D04本文、nearby境界、原C093/旧D1007、図/slot/番号/軸・基線・候補envelopeを維持する。

全840観測について、当該可視flow/math baseに適用する、実在のp/aside/panel/source/frame/root祖先それぞれのcontent内幅へ照合する。実mount条件で存在しない祖先はNOT_APPLICABLEとして区別し、閲覧済みや0へ変換しない。可視かつ適用する祖先の欠測はUNVERIFIEDへ停止する。0.05pxの既存矩形精度を広げない。画像前後の測定一致と実font/自然幅/利用幅を保存し、単に1baseだっただけで親枠内PASSにしない。新しい枠外所見も両current render報告が、原所見・現在計測・現在CODEに結んで再検査する。

同じ2名の制作寄与・理由既読を開示したD02方式を継続し、independent/sourceFirst/firstPass=false。独立審査の保証はない。両名は全原画像と191境界を実際に確認する。固定Linuxでcheckpoint全207件を含む既存全テストと追加分、通常workflow267件、publisher/app/build/lintを実行する。旧179 IDs・修正済み3負例を保持し、全体lintの既知baseline FAILは同一性を別に検証する。

2製品path内の上記局所規則で安全に達成できない、原文/数学/正誤/保存/フォント/共有CSS/構造を変更する必要がある、測定・原採用・実直前履歴が不足する場合は変更部分を停止し、具体化して追加判断へ戻す。未見・未確認・CODE FAILを合意でPASSにしない。

## 公開コードとCIの許可範囲

採用には、D05と同じ列記20コードpath内の必要な検査済み差分、原D05原文1path、本D06原文1pathの**最大22path**を、公開GitHub `rrikunagasige-dot/kyotsu-step-web` の既存core/publisher作業ブランチへ反映しCIを実行する許可を含む。不要なpathは変更せず、実path/bytes/SHA256を送信前に固定する。上記限定内の必要な再修復・再結合も同じ許可で検査し記録する。

製品2pathに加えるcore上限11path：`workflow/checkpoint.py`、`workflow/adapters.py`、`workflow/runtime.py`、`workflow/team.py`、`workflow/cli.py`、`workflow/integration.py`、`workflow/definitions.py`、`workflow/test_checkpoint.py`、`workflow/test_checkpoint_runtime.py`、`workflow/test_checkpoint_definition.py`、`workflow/INTEGRATION_RUNBOOK.md`。

publisher上限7path：`.github/workflows/qf01-publisher-g3.yml`、`tools/release/qf01-publish-contract.json`、`tools/release/qf01-publish-check.mjs`、`tools/release/qf01-publish-check.test.mjs`、`tools/release/qf01-retained-adapters.mjs`、`tools/release/qf01-retained-adapters.test.mjs`、`tools/release/qf01-browser.mjs`。

原D05原文は同一bytesの `work/items/W-TECH-QF01-CHECKPOINT-RECOVERY-20261122/MIXED_INLINE_SURFACES_PROPOSAL_D05.md`。本D06原文の公開pathは `work/items/W-TECH-QF01-CHECKPOINT-RECOVERY-20261122/INLINE_LAYOUT_WIDTH_PROPOSAL_D06.md`。原D04原文も変更しない。

実台帳・実本人回答の採用payload・学習保存・認証情報はコード送信対象外。これらの公開が必要なら実payloadを先に具体化し別に判断する。main変更・配信はこのコード送信操作では行わず、既存実CAS/MERGE/DEPLOYを確認する。最終G3は公開後の本人実物受入で、本案採用やCI成功から作らない。

原version91 ZIP・完全prefix・元受付・global queueは未回復/UNKNOWNを維持する。目標は正規工程を経た現在sourceに一致する実アプリURLと、公開後の本人確認である。

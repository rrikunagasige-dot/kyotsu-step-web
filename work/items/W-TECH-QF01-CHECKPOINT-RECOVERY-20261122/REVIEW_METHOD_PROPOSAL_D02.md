# P-QF01-REVIEW-METHOD-D-02

状態：未採用・未実装。2026-11-23。D01の読取レビュー補足を反映した別版。D01とその未採用状態は保存する。現在の2名を維持して審査方法を見直すという本人指示に対する、追加の具体的な基準変更案。

## 変更する基準

QF01 P046-R3の専用checkpointと、教材Work `W-MATH-QF01-FULL-RELEASE-P035-20261115` の `R04_PROPOSAL@qf01-full-lesson`、`R07_SEMANTIC@qf01-full-lesson`、`G2_AUDIT@qf01-p035` だけについて、保存済みの真正な原初回所見と、現在の2名による制作寄与・理由露出を開示した実再検査を、明示的な代替基準として使用する。

**この案では、現在の描画修復を作者から独立した審査者が評価したという保証を得られない。** 現在の2名は設計理由を読み、描画修復の検討にも寄与している。共通の前提や見落としを引き継ぐ可能性がある。現在の再検査は `independent=false`、`sourceFirst=false`、`firstPass=false` のまま記録する。作者寄与がある範囲の `authorSeparation` もfalseのままにする。

本案を採用した場合だけ、この代替基準を公開前の上記Gateへ使用できる。採用がなければ既存の厳格な判定を維持し、不足する審査で停止する。これは教材内容の同じ案への再承認でも、現在の2名を新しい初回審査者へ呼び替える操作でもない。

## 固定範囲と保存する原記録

- rootは `/root`、子担当は既存の `/root/authority_review` と `/root/axis_review`。新規・交代agent、孫agent、別モデル独立性の主張を追加しない。
- 原contract raw SHA256は `b5f49f53b3895a8169f817a91efd376b4e73b17526d5b08bcb77e2b7fa4aee30`、原anchorは13742/head `586be1a3dfeb92e9699cc82ef330131d10b22a78353c165d5610f181d6201106`。
- 原plan digest `2766347faad23825bd2ea75af142159c3c14e1d4484e88c1dac8f8d09c0bd954` と原users集合digest `9277907e5ef037553b4c979647ee90da0d6a495256974401f53954f815baaf92` を保持する。後から加える実本人発言は原集合とは別に記録する。
- 原教材案 `6a5f65e4a2129d55bbcf0e65e59c3c8ea6ad83db78e67661f0b4ebda398d9078`、checkpoint採用案 `1d167fe02fa7e6fa8480f45e5c0bb02d5d401f869e82952940311103284ee86b` とそれぞれの実採用発言を保持する。どちらも本D案の採用へ流用しない。
- 原first-pass sealは teaching `47f83f587abc5c97f4bc3b35cd7cc742a1aaf8b1390f5960d04daa32b1d6f660`、layout `edf10aa967a23b94e68e96f7975a322e31886f16fc8ebcf3144d32043e72fff3`。原performer・assignment・packet・capture・当時の閲覧範囲と制限を保ち、現在2名へ付け替えない。原file bytes未取得の部分を回収済みとはしない。
- 現時点のsource/core Aは `abe5ff1385cb141bb2d01e34f6512eb50e9ca9da`。本案による新しいcore commitは実装後の実Gitから固定し、予想SHAを使わない。製品の修復5ファイルはAと同一bytesを維持し、教材本文・35判断・134本文block・数学表記・ID・保存契約・既存受入を本案で変更しない。

## 実装と採用の方法

原material planのteam policyを直接書き換えず、plan外の `qf01-informed-rereview/1` method receiptを新たな実イベントとして採用する。receiptには本具体案の正確なhash、実本人採用の原文と出所、expected HEAD、対象Work/epoch、原plan/承認、現在source/definition/service/input/target、現在2名と寄与行列を束縛する。

入力hashの循環を避けるため、採用権限と段階別の審査結果は二段階に分ける。先に本案hash・実採用・epoch・現在core/source・固定2名・基準を持つmethod authorityを固定し、段階のinput hashにはそのauthority refを含める。後のreview receiptがこのauthority refと計算済みの段階input/target hashを参照する。receipt自身を自身のinputへ含めない。対象source/定義が未確定なら確定前の値で認定しない。

原bootstrap core Aと実装後の現在coreを区別する。元の実bootstrap/最初の定義移行を不変保存し、Dを伴う後続の正規定義移行を追加する。R06 proofとpublisherは原1d採用・D追加採用・原A core・現在実core・各移行のfrom/to/preflight HEAD/epoch/全旧結果dispositionをそれぞれ検証する。A用の固定値を現在coreへ名前だけ付け替えたり、旧1dの技術T02をDへ流用したりしない。

新しいnative技術Workを増やさず、既存 `W-TECH-QF01-CHECKPOINT-RECOVERY-20261122` の追加技術提案として本案の実採用を別記録する。必要な技術plan改訂とT01〜T04では本D案を追加権限として検査し、旧1dのT02だけでD実装を許可済みとしない。旧plan/結果/承認を履歴として保存し、改訂前のT01〜T04を現在版合格として転記しない。publisher側も既存 `W-TECH-QF01-CHECKPOINT-PUBLISHER-20261122` を使用する。

現在の各担当は、実assignment/packet/targetに対して自身の報告を返す。実harness capture、原報告、構造化出力hash、具体的根拠と制限、作者寄与と露出を保存する。rootが子の報告を代筆して作らず、単なる合意や過去のPASSで充足としない。必須claim/facetを両名の報告と現在版の証拠に対応させ、足りない範囲はUNVERIFIEDで停止する。

既知findingの解消もDの限定基準を明示する。作者本人の宣言だけでは閉じず、現在targetに束縛した両名の実再検査、対応するCODE/実測、具体的な解消根拠を全て要求する。この条件を満たす場合だけ、作者寄与を開示した解消記録として受理できるようにする。独立した非作者による解消とは表示しない。根拠不足、OPEN/UNRESOLVED、CODE FAIL、別target、報告欠落は引き続き停止する。この限定条件外のfinding解消guardは既存のままにする。

通常Store、一般team/1、新教材、他Work、別の教材案には適用しない。欠落する完全prefix・旧owner・元受付・global queueはUNKNOWNのまま。Dはそれらを要する別工程のguard、公開先の実CAS/DEPLOY、公開後検査、機密送信の許可を解除しない。

## 許可する変更path

coreの変更は `workflow/team.py`、`integration.py`、`runtime.py`、`checkpoint.py`、`cli.py`、`adapters.py`、必要な場合の `team_transport.py`、`definitions.py` に限定する。目的はD専用の採用・実担当/原報告・finding解消条件・入力/失効・現在R06 proofへの束縛であり、一般経路を緩める変更には使わない。

回帰は既存 `workflow/test_checkpoint.py`、`test_checkpoint_runtime.py`、`test_checkpoint_definition.py`、手順は `workflow/INTEGRATION_RUNBOOK.md`。publisherは既承認7path、すなわち `.github/workflows/qf01-publisher-g3.yml` と `tools/release/{qf01-publish-contract.json,qf01-publish-check.mjs,qf01-publish-check.test.mjs,qf01-retained-adapters.mjs,qf01-retained-adapters.test.mjs,qf01-browser.mjs}` の範囲で、同一D基準と実export/現在sourceに接続する。不要なpathは変更しない。必要な追加pathが判明した場合は、変更前に具体的差分を提示する。

記録先は上記2技術Workと既存継続Workの文書、本D具体案、専用 `work/recovery-checkpoints/qf01-p046-r3/{events,artifacts,preflight,reports}`、workspace診断資料に限る。原origin・元proposal・原eventsを上書きしない。

## 失効と必要な検証

core変更でdefinition/serviceが変わる。新しい実source commitを固定し、fresh preflightと全結果dispositionを保存して現在定義へ正規移行する。現在までのR01〜R03等は元入力の実記録として保存するが、新入力のPASSには移植しない。必要な現在S00以降、技術T01〜T04、教材R04/R06/R07/G2とpublisherを再検証する。新source/target/epoch/method/作者集合の変更・採用取消で対応receiptと下流を失効させる。

最低限、採用なし/別Work/別epoch/旧HEAD/別proposal/旧target拒否、現在2名の両報告必須、独立性falseの保持、原plan/users/原seal不変、初回所見の付替え拒否、作者単独の解消拒否、未解決/CODE FAIL拒否、失効、通常team/1非回帰、coreとpublisherの同一判定を検査する。現在97件と必要な追加回帰、通常workflow、固定Node22/pnpm11.9/Python環境、保護範囲、四幅/実保存/現在実物の必要な再検査を行う。旧ローカルv5や別sourceの成功を新source CIの代用にしない。

## 公開と本人確認

全ての公開前必須依存が揃い、採用済みDの限定基準を満たした場合だけ、既承認の公開方向へ進む。実公開・公開後のbytes/四幅/保存/実働URL確認を終えて本人へ提示する。独立審査済み・本人受入済みとは表示しない。

最終の `G3_FINAL@qf01-p035` は本人の実物に対する明示 `accept_app` を待つ。D採用、継続指示、無応答、技術試験成功を実物受入へ変換しない。それ以前に受入/学習更新/閉鎖を完了したことにしない。元受付など別の必須依存が不足する場合は、その工程は未完了のままにする。

## 採用を求める事項

失う独立審査の保証を開示した上で、上記QF01/3段階だけに、真正な原初回所見と現2名の寄与開示再検査を限定代替基準として採用し、記載scopeの実装・正規失効・再検証を進めること。本人の最終実物受入は別途必要である。本案は公開成功を保証せず、未確認のPASS化を許可しない。

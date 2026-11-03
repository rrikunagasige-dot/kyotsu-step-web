# P-W047-G3-01 — 公開設定4ファイルと非公開dry-runの提案

状態：未適用・承認待ち。教材内容の再承認ではありません。main/Pagesは未変更。

## 現在地

N12本人画像確認①はuser ed7d140b「いいよ続けて」で了承。固定教材source `f129ba78e496f0ccbce917c762357a81b92b0a2c` のN11/N12 R07とG2は正式PASS。火柴図の次はG3_HOST@n11です。

main `04b823259a0873235e39099864d454330eed5d81` の公開workflowは旧source6b439を固定し、旧W041公開契約がN11二ファイルを旧hashへ固定しています。現sourceで旧検査の停止を再現しました。N08の他18protected項目とN09/N10の46required項目は全byte一致しています。

## 今回承認を求める範囲

main起点の `work/w047-publisher-g3-20261104` ブランチに、下記4ファイルだけを適用し、公開なしの実dry-run CIまで行うことです。教材sourceは上記f129のまま、P006/R1の本文・採点・保存・UIは変更しません。

| main上のpath | 操作 | after SHA256 |
|---|---|---|
| .github/workflows/deploy-pages.yml | 更新 | `57ca24abe22b553a11386f9fdcdbee43f5467604488af3259c42227cc6f147e7` |
| tools/release/w046-publish-check.mjs | 更新 | `e5b47e807e8cdceac463084cc907299d363a6587624026ae0a0562563a5ac6b7` |
| tools/release/w047-publish-check.mjs | 追加 | `5f6381fb3261d35ed7465ff98153da833edefb318d011ec7a3dd4ed27bc7fad1` |
| tools/release/w047-release-contract.json | 追加 | `710ad686343f89e751e1dadb72ddc01de9a8b0db7a75b5aa1e423c08842981e0` |

実ファイルは `G3_PUBLISHER_DRAFT/`、mainのbefore/after対応は `G3_PUBLISHER_PATCH.json`。main baseが変わっていた場合は再照合し、無条件に上書きしません。W047作業branch全体をmainへmergeしません。

- workflow：固定sourceをf129へ更新。mainと指定publisher branchだけを対象にし、publisher branch初回pushで非公開dry-runを自動実行します。
- 配送境界：configure/upload/deployと実公開後の検証6stepは、main push、または明示manual dry_run=falseの場合だけ動きます。今回の範囲ではpublisher branch pushのdry-runだけを実行します。
- 旧W046 checker：source定数一箇所だけを更新。N09/N10の46byte guard・保存/移行/全操作・archive検査を保持します。
- 新W047 checkerと契約：元W041の全検査statementとN08 manifest構造を保持し、旧contractのN11二hashだけを既承認版へ明示移行。全69required pathを固定し、N11/N12の全正答/誤答・四幅・focus/reset/境界、配信asset byte/manifestを厳密に照合します。

## 完了した限定検査

A/Bの静的非作者レビュー、両mjs構文、全69byte/元W041検査、未知N11 hashの拒否、local metadata HEADを本番sourceと偽れない拒否、YAML/配送6step/4case真偽表の検査はPASSです。旧検査と失敗ログは保持しています。

これは未適用draftの限定検査です。本物のpublisher dry-run CI、そこでのbuild/browser/環境制約、main公開・配信成功はまだ検証していません。承認後にその実証を取得します。Pages write権限と既存Pages environmentの実branch制約もdry-runで確認します。

## 承認後の手順と停止点

1. 親W-MATH-047の教材plan/承認は保持し、公開設定の技術作業だけを別Workで記録します。
2. mainの期待SHAを再確認してpublisher branchへ4pathのみ適用。実pushによるdry-runが配信6stepをskipしていること、全前検査・build・操作・manifest・保存と既承認N08/N09/N10の保持を確認します。
3. A/Bが実dry-run証拠と固定publisher SHAを照合。失敗ならその原因を修正工程へ戻し、未確認をPASSにしません。
4. 実証をそろえた後、具体的なmain統合・Pages公開への許可を別途確認します。今回の承認だけでmerge・公開・manual dry_run=falseは実行しません。
5. 公開後は同じ固定buildのN11/N12両route実証を取得し、合意した全範囲の本人アプリ確認は一回です。単元別二台帳記録は同じ原発言の転記で、別の独立評価二回にはしません。

今回の教材S1 scopeはmain publisher4pathを覆っていないため、新scopeへの実承認が必要です。N12画像確認①や旧P006/R1の了承を、この追加設定・公開許可へ読み替えません。

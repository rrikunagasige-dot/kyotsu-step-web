# P-W047-G3-PUBLISH-01 — 検証済み4ファイルのmain反映と既存Pages公開

状態：実証完了・公開許可待ち。未公開。これは教材内容の再承認や本人最終アプリ受入ではありません。

## 対象と具体的な操作

main期待SHA `04b823259a0873235e39099864d454330eed5d81` を、検証済みmain起点publisher commit `6cd11dc1e65810281ed897f865eed3e52b974992` へforceなし・期待SHA付きで進めます。mainとの差分は下の4ファイルだけです。W047作業branch全体はmainへ統合しません。main pushによって既存GitHub Pages公開workflowが起動し、固定教材source `f129ba78e496f0ccbce917c762357a81b92b0a2c` をbuild・再検証して既存Pagesへ公開します。

| 対象path | 最終SHA256 |
|---|---|
| .github/workflows/deploy-pages.yml | 9b2274fc5e1c634923145bb8a908e3bc6fd00ee3c06799ceaa39afe1d5553a96 |
| tools/release/w046-publish-check.mjs | e5b47e807e8cdceac463084cc907299d363a6587624026ae0a0562563a5ac6b7 |
| tools/release/w047-publish-check.mjs | 5f6381fb3261d35ed7465ff98153da833edefb318d011ec7a3dd4ed27bc7fad1 |
| tools/release/w047-release-contract.json | 710ad686343f89e751e1dadb72ddc01de9a8b0db7a75b5aa1e423c08842981e0 |

教材・採点・既存保存仕様は固定sourceのままです。公開jobのgithub-pages環境保護を維持し、検証専用jobは環境なし/read-onlyに分離済みです。mainが期待SHAから変わっていれば上書きせず再照合します。

## 揃った実証

最終run `41754189894` はpublisher6cd11でcompleted/success。verify job成功、publish jobと配信6stepはskipped。artifact13287912706は172663175bytes、ZIP SHA256 `b7a02a577a8c7bd7c8791cc2b05d38dd8fb2554c3b75869270439b3550f60793`。実原3manifest、全2665file原hash、1212JSON原bytesを照合し、A/B実成果物監査が揃いました。3manifest不足G3-B-EVIDENCE-01はVERIFIED_FIXEDです。

N11全39回答/109誤答候補、N12全46回答/127誤答候補を320/390/430/1440で確認。履歴・再読込・resize・旧版移行を含みます。focus/reset・単元往復の境界検査は390pxです。N08保持版とN09/N10の全8case・原byte契約も合格。実checkerによるlocalhost asset byte照合は121/122件で、公開host到達の証拠ではありません。

原metadata188/教材f129/publisher6cd11/CIrunを区別した複合checkを既存Runtimeが受理。W-TECH-052のT04→L01→Z01はDONE、親W047はG3_HOST@n11待ちです。初回環境拒否と先行c133run、結果形式のCODE拒否は履歴に残しています。技術合格を教材品質label/本人受入へ転用していません。

## 承認後の火柴図

main反映・既存Pages公開 → 実配信manifest/source/publisher・assetとN11/N12両routeの操作照合 → 両単元をそろえた本人アプリ確認一回 → 本人の受入/修正に応じた既存事後工程。

今回の既承認P-W047-G3-01は非公開dry-runまでで、main merge/manualfalse/Pages公開を含めない停止点でした。今回は上記の具体main反映と既存Pages公開を対象に許可を確認します。本人端末をreset済みとは記録していません。

## 原証拠

- G3_FINAL_APPLIED.json / G3_FINAL_CI.json / G3_FINAL_CI_JOB.log
- G3_FINAL_TECHNICAL_CHECK.json / G3_TECH_DONE.json
- G3_ACTUAL_REVIEW_A.json / G3_ACTUAL_REVIEW_B.json
- g3-final-ci/ARTIFACT_INDEX.json / RAW_JSON_ARCHIVE.json / RAW_JSON.tar.gz
- G3_REPRESENTATIVE_IMAGES.json（実原画像7件）
- generated/ と generated-publisher/ の現在地・火柴図

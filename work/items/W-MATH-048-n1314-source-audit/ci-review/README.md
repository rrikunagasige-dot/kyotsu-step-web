# P-W048-CI-001 — CI一ファイル追加の具体案

状態: REVIEW_ONLY。前チャットで準備したCIファイルとR07画像はGit全refsから回収できなかったため、既存W047 CIと現在のP003固定差分を起点に再構成した案。前案と同一とは称さない。active `.github`、Git、native台帳は変更していない。

追加製品外scopeはactive `.github/workflows/w048-n1314-verification.yml` 一ファイルと、このWork内の二つのportable検査スクリプト。ここに置いたYAMLを有効化する場合も具体差分を照合する。教材四ファイルの変更は含まない。workflow作成者Bによるこの説明は非作者レビューではない。

手動実行を含め対象branchをjob条件でも固定する。権限はcontents:read、checkoutの資格情報は保持しない。Git保存、merge、公開、サービス追加、baseline更新は行わない。原PNGとJSONを別artifactへ保存し、Git source SHA、実ファイルhash、画像hashを残す。

N13は実checkoutがP003固定after hashであることを必須にする。N14がbefore hashならNOT_APPLIEDを明記し、その隔離コピーを現在sourceの実画面証拠へ混ぜない。N14が正式にafter hashへ適用された後の新CIでのみN14を測定する。未知のbyteは拒否する。

検査候補は実build上の四幅320/390/430/1440、全問の正答・実表示される全誤答・ヒント、内部数式の横スクロール両端到達、履歴・再読込、直前版保存の追加判断への再開を扱う。旧版chainはactual domainによるsynthetic検査。既存prototypeのhardcoded scratch pathは使わない。

これはR07全体の完了条件を縮小しない。複数slot44状態、reset操作、原図の解放順、章間移動、旧版画像比較、等号軸/18px/式番号の状態別計測、他モードの回帰と非作者意味審査は、別の正式R07/G2証拠が必要。CI成功を本人受入や全Work PASSへ変換しない。現在のverify_current.mjsは17e39f0aで限定契約検査PASS（N13 18回答・旧r1〜r4 synthetic保存移行、N14 NOT_APPLIED）。両mjs構文検査PASS。build PASS（N14未適用export/既存bundle警告）。capture_current.mjsの実画面検査とCIは未実行。Chromium取得失敗を記録している。

## 非作者確認と承認対象

Bがこの候補を作成し、Aがrepo/branch制限・PNG/JSON分離・実SHA/hash対応・N14対象分離・残条件の明示を読取審査した。限定経路の設計としてPASS。実行合格、blindやモデル独立ではない。選択肢はDOM clickを使い、pointer/keyboard actionabilityは別検査。

追加承認対象は、このYAMLと同一byteを `.github/workflows/w048-n1314-verification.yml` へ有効化し、記載の作業branchでCIを動かすこと。Work内二scriptは検査準備として用意済み。教材P003を再承認する案ではない。既存Pages公開・main・guard・課金・別サービスの変更は含まない。

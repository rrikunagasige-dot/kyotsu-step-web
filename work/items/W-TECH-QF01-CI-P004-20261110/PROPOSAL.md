Status: APPROVED

2026-11-10 JST 本人「ネットが切れた続けて」を直前のP004明示承認質問への直接回答として記録。原提示HTML672b1050f6b42296642dc757520948dd4f50c82b12364b590d1d962010346469、patch5ec7946a636af3a6ca8b09dc239da400cc7ac8585530d60dec78884b23e92e6a。品質受入・main公開は含まない。以下は提示時点の原文。

# P-QF01-COMMON-CI-20261110-004 — 共通CIの追加補修

状態：PROPOSED／未承認・未適用。二次関数QF01の作成命令とP003の承認は保持しています。本案は今回の実CIで初めて判明した7ファイルの追加差分です。

## 実CIで判明した問題

598c854の6失敗はGitHubの注記で全てInternal server errorと確認しました。同一treeの空commit860cebbで再検査し、4成功・3失敗・1skipとなりました。Mathは型・lint・259単体・build・画像6検査が成功し、N12旧版35穴と現行46判断の全経路も両幅で成功しました。残る短いv1移行検査は30秒の合計時間切れです。N08とOrdinaryはそれぞれ858中850成功・8失敗で、下記の旧版固定・保存先固定・既承認記録の照合に不一致がありました。P003 T04はFAILEDとして照合済みで、成功へ書き換えていません。

## 固定7ファイルの変更

1. textbookNestedContract.test.ts：旧N09r9/N10r5と現N09r10/N10r6の両方で、元の契約・負例・進捗・reset検査全体を実行します。旧版の値を現行値に置換して隠しません。
2. N0910ArchivePage.test.tsx：実storeの設定された保存先名を使い、archiveの保存と隔離を元どおり確認します。
3. qf01Lesson.test.tsx：実storeの保存先名を使い、QF01進捗の永続化を確認します。
4. firstSectionRefinements.test.tsx：文字列の厳密一致、旧math部分の保持、math型化を検査します。既承認W050/W051の文面差19件は旧/現のliteral対として限定し、任意の文面変更を許容しません。承認済み現データは原native snapshotとaccept_app/closedを照合済みです。
5. firstSectionTeaching.test.tsx：旧W029保護の範囲を既存の旧N13r4/N14r10 fixtureに固定し、現N13r5/N14r11の独立検査は維持します。
6. e2e/n12-derivation.spec.ts：v1移行検査の準備2行を修正します。同一originの静的JSONでlocalStorageを準備した後に本来の履歴画面を開きます。移行注記以降の検査・再読み込み・reset・30秒制限を維持します。ローカルはブラウザ起動制約で実行できず、改善効果は未検証です。
7. tools/textbook/integrate-n07.mjs：P001で既承認の注記付き原提案だけをfull/prefix/bodyの3つの厳密hashで認識します。その後、元の承認hash・不変Git設計・生成物一致を検査します。旧APPROVAL/PLAN/原文の更新や未知の注記の許容はありません。

## 実施範囲と手順

対象はrrikunagasige-dot/kyotsu-step-web（repository ID1391122224）、source860cebb5e093dc8130e2aa8dfaa70c98ee0e210f、tree8f5f9a365defda8e70f6374c616bc2556629624dです。既存の独立補修branch work/qf01-common-ci-repair-20261109とdraft PR141を継続します。7件は既存ファイルで、src配下5件はテストだけです。製品の教材JSON・画面実装・進捗処理・stable ID・元資料・core・定義・CI YAML・依存を変更しません。

承認後に新technical Work W-TECH-QF01-CI-P004-20261110を原APIで開始し、固定24入力、固定7差分を原adapterで一度適用します。24は既存18と今回7の和集合（N12重複）です。P003のFAILED履歴と旧P002未解決依頼を保持し、P003への再適用・偽の再承認をしません。親は実在するW-MATH-QF01-BUILD-20261109、既存の同親依頼QF01-CI-P003-CORRECTION-20261110と原CIRepair issueへ正規接続し、新Workが全検証後DONEとなった場合だけ原APIで解決します。

新CODE、型/lint/単体/build・全該当実CIを新commitで実行します。失敗は保存し、範囲追加は再提案します。全CI成功時だけ既承認QF featureへCAS照合して統合し、元source/bundle/rulesを維持して親保護373件の既承認差8＋本案追加4＝12例外を正式reviseします。残361件を保持し、新sourceの四幅320/390/430/1440・C09・G2を再検査します。本案固有の記録・証拠保存とdraft PR更新を含みます。main統合・本番公開・本人受入の承認は含みません。

## 承認が必要な理由

WORK_SYSTEM §11・§12Bと正確なpatch hashを照合する原adapterにより、P003の承認は固定16差分に結び付いています。今回の7差分は新しい内容です。旧承認hashを流用せず、以下の全文・before/after hashを提示して明示承認を待ちます。native Work未open・正本差分未適用です。

固定patch SHA-256：5ec7946a636af3a6ca8b09dc239da400cc7ac8585530d60dec78884b23e92e6a

native patch digest：6ac64bd6d6171b041a2656cf1e387c249a3b80cb7d3e92d477581b72b5b6be56

## 検証と限界

局所検証は実CIと同じ保存先・同じ広域選択で877/877成功（元858＋旧現保護19）、default/custom保存先の対象94/94ずつ成功、app型検査・変更5件lint成功です。N07は正例2・負例6と元検査3が成功し、原Runtime/adapterの隔離simulationは24入力・7差分一度適用、未知patch/再適用/過大src保護の拒否も確認しました。非作者の対象hash付き審査を保存しています。準備時の資料不足・型不備・ブラウザ起動失敗も保存しています。詳細は同梱VERIFICATION.mdとevidenceに記録します。局所PASSを全CI合格へ拡大しません。N12の新準備方法の実ブラウザ効果、最終commit全CI、QF四幅、C09/G2は未検証です。

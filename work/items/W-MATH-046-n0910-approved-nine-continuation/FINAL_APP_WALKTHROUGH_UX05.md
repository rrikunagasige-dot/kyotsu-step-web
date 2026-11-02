# W046 UX05 公開アプリ・本人総チェック票

状態：FINAL-REVIEW-READY。公開・実配信検証済み／本人総チェック未受入。既存 `work/templates/FINAL_APP_WALKTHROUGH.md` の記録項目に対応する。承認権限は main `WORK_SYSTEM` §11/12A とW046の明示承認を優先し、他Workの公開方針を移植しない。

## 確認する版と合意範囲

本人の公開承認：2026-11-02「いいよ」（page `6b2c4854-bf87-40b8-b3f4-87b3ca4d30dc`）。PR135 head `900644e0663e8e5f027d2a7827e030182ea2da8c`、承認時main `6bc54447ef015a2a579a56a5966ceb58a0600d3a` のpublisher 2files反映と、既存Pagesへの下記製品source公開が対象。これは公開後のアプリ全体評価を受領した記録ではない。

- 製品source：`691d3d160493bf684ca8a31a22476d31d98caeec`。
- N09r8「平方根の符号と数直線」：41node・43回答・11stage。compiled `39634b3ca00c89f85a23137a32dd664f074a947cc4a98da505fc079813d44c33`。
- N10r5「平方根の証明と有理化」：45node・60回答・12stage。compiled `6f86b3d250ca9bae45698aab208126031a7b9ea0a453a9772c7d2c848cac9b1c`。
- 本人細部確認済みの代表2nodeを含むUX05全体が総チェック対象。残23CHANGEだけ、またはN09の一部サンプルだけで全体受入とはしない。86node中63nodeのobjectは保持されている。
- 既受入N08/N11は従来内容・操作の保持確認対象。受入範囲を他単元・全科目・他Workへ拡張しない。

[全node・stage・回答IDの固定対象manifest](evidence/ux05-publication/UNIT_MANIFEST.json)。本人評価は全対象PENDING、制作者の自動検査とは別。

## 実配信の記録（主担当が公開後に実確認して記入）

|項目|確認値|
|---|---|
|hosting main SHA／公開run／完了時刻|f4c50963e26d3d4f9b33c3ca9f43e91e57dbdb75 / run41454830219 SUCCESS / 2026-11-02T13:59:22Z|
|配信artifact hash／deployed manifest／source照合|GitHub artifact API digest3270878f8636999b607d484c25f72a68b782cc6d837fe2d192acdff6a9adb273（API公表値）/ w046-release.json実HTTP SHA256 e61db3988d0011a1a0df85f960d141b25e5d1a28a21ac9bad97f9eccc3efc579 / source691d・publisherf4c・32source/121assets独立一致|
|N09 実確認済み直接URL|[N09](https://rrikunagasige-dot.github.io/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n09)|
|N10 実確認済み直接URL|[N10](https://rrikunagasige-dot.github.io/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n10)|
|N08 保持確認用直接URL|[N08](https://rrikunagasige-dot.github.io/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n08)（GH既存検証で全幅確認）|
|N11 保持確認用直接URL|[N11](https://rrikunagasige-dot.github.io/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n11)（GH既存検証で全幅確認）|
|実配信byte・font・HTTP・実操作確認の証拠|evidence/ux05-publication。GH公開前・後N0910/N08/旧版/N11 PASS、独立HTTP121/Chrome4ケースPASS。管理proxyのChrome CA補助と原transport FAILは別記録。|

公開runの成功に加え、上記2manifest/全121assetsの独立HTTPと実URLの320/1440ブラウザー操作も確認した。本人にはN09→N10の合意範囲全体を最初から確認してもらう。問題なければ「総チェックOK」、問題があれば「要修正：単元・箇所・症状」と返信いただく。受入欄は本人の実評価まで未受領のまま保持する。

## 本人に確認してもらう内容

N09/N10の合意範囲全体を実アプリで見てもらい、学習の流れ・必要な判断・表示・操作について評価を記録する。全誤答候補の機械検査を本人に再実行してもらう票ではない。

|対象|全体の確認範囲と観点|
|---|---|
|N09 前半|二つの平方根、平方根と根号、負数の平方、実数の正負、根号内の符号。因数分解後の零条件を生徒自身が組として判断でき、重要な導出が先に自動提示されないか。|
|N09 後半|小数の平方による挟み込み、整数部分・小数部分、正負の根号の位置と区間。Q08の必要な6計算と比較、平方公式の中項構成、差の符号・絶対値・残りの条件などの判断を保ち、易しい逆演算だけを過剰に細分化していないか。|
|N10 前半|平方と符号による確認、積・商の性質の証明、平方数の因子、和の各項の変形。必要な正性・非零条件や既習事項の説明があり、初めての関係式適用を生徒が判断できるか。|
|N10 後半|差の平方、和と差の積、有理化、分母と分子の計算、分子の平方。符号込み中項・相殺する交差項の組・分子の分配を自分で導け、原式から完成式への接続が追えるか。|
|N09/N10 共通操作・表示|誤答→ヒント→再試行、正答後の通常数式、次の判断の解放、再読込、進捗・履歴・旧版比較、リセット。スマートフォン幅で根号・括弧・式番号・選択肢・改行が読みやすいか。|
|保持N08/N11|従来の教材と操作が保たれているか。今回の共有変更で既受入内容が壊れていないか。|

既知の非阻害観察として、320幅のN09 q07に句読点だけの行が残る。本人評価で問題とされた場合は指摘として保存し、受入文言で消さない。

## 制作者側の検証記録

以下は固定製品sourceに対する公開前候補の検証であり、上の実配信確認とは別である。

- 320/390/430/1440幅の全回答・全誤答候補・未回答／部分正答／完成／履歴等の実状態を検査。回答状態1712、数式実測4228、全行検査11008。全103回答を含む。通常KaTeXとの実寸・根号／括弧、タグなし行の不要余白も検査した。
- 関連Vitest148、native/layout CODE26、型・lint・build、保存移行24ケース、protected340filesが成功。N09/N10の公開用build四幅・121assetsとN08/N11の320幅既存操作検査も成功。これらを公開済みの証拠へ読み替えない。
- 数理CODEは未対応46を含むPARTIAL（不一致0）。未対応の論理は根拠付き非作者審査へ接続し、全数理の機械証明とはしない。変更23nodeの実可視状態の非作者審査を実施した。
- 初回の40px余白不具合とimport FAILの原記録を保持し、修正sourceでの確認結果を分けている。未解決FAIL／UNVERIFIEDを本人受入で覆わない。

## 本人の実評価（受領後に記録）

|項目|記録|
|---|---|
|評価の原文・日時・参照page|未受領|
|実際に確認したURL／source／unit・範囲|未受領|
|端末・表示幅（分かる範囲）|未受領|
|受入／要修正／未確認の範囲|未受領|
|新しい指摘と対応するissue・復帰工程|未受領|

自然な言葉の評価を原文で保存し、確認した版と範囲へ対応させる。公開許可「いいよ」、代表の細部OK、単なる好意的評価を今回の全体受入に代用しない。本人評価がまだの現在は `FINAL-APP-ACCEPTED` としない。

## 受入後の既存工程との対応

|工程|必要条件／記録|
|---|---|
|G3_HOST|承認済み公開を完了し、実配信byte・manifest・操作・保持unitを照合。上記の実URL欄を埋める。|
|G3_FINAL|本人が合意範囲の実物を評価。原文・版・範囲・app証拠を対応させる。要修正なら該当する原因／具体案／実装／検証へ戻し、未確認範囲を受入扱いしない。|
|R03事後sweep|受入後の実差分と現在版の同型箇所を再確認。事前inventoryの流用だけで完了にしない。関連欠陥があれば根拠と追跡先を残す。|
|R08／L01|修正証拠・回帰・規則・原評価を版付き事例へ結ぶ。本人承認だけでGoldにせず、適用条件を満たさない学習はNOT_TRAINABLE等を記録。OFFLINE_ONLY／ABSTAINを保持し、モデル本番採用を意味しない。|
|Z01|本人受入・必要な事後影響確認・修正事例・適用される完了条件の証拠が揃った時のみ判断。未解決の必要な関連修正を隠して閉じない。|

正式Storeの既存26イベント欠落について本人の例外継続を維持する。空Store・架空receipt・旧工程の再合格による穴埋めをしない。現在の実証拠と、正式台帳上のPASSED／next-node未認定を区別する。他Work38件は今回受入対象ではなく、解決済み・全体合格としない。

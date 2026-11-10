Status: APPROVED

2026-11-10 JST 本人の直接回答「承認」を原文記録。exactHTML6b17ffc5b896fcf9e6d3164132289ec1e4ad89b4b5e60c46e8bd75fd93e2b8ae、onepath patch e7b01793330a57ff8f6a583e9cae55a1666788f4fe9c0ecbbb3d1e96c276a504。品質受入/main公開は含まない。以下は提示時原文。

Status: PROPOSED

# P-QF01-COMMON-CI-20261110-007 — 表示待ち補助の一行を元ビルド設定へ適合させる

未承認・未適用。P006は本人「承認」を原APIに記録し、固定11ファイルを一度適用済みです。source52a49986ee525a9f77c14985122ff4398260e3ee/tree6dc3e65c38df775feaf1e3e82889f6eb86f7220c、draft PR141。T03完了後の実CIは2成功・3失敗・1skipでした。

Math・Review・MathPracticeの3本すべてがe2e/helpers.tsの33行、NodeListの配列展開でTS2488になりました。Math259、Review48、MathPractice95のunitは成功、typecheck/lintも成功していますが、buildで止まったため新しい画面待ちの実効果はまだ未検証です。P006の失敗を消さず原T04 FAILED、claimなしとして記録しています。N08/Ordinary等のpush専用suiteは新sourceで未起動であり、成功扱いしません。

## 原因と事前検査の不足

実buildはtsc -bでapp/node両projectを検査します。tsconfig.nodeはlib=[ES2023,DOM]、e2e全体をincludeします。このlibにはDOM.Iterableがありません。事前に使った別指定のCLI型検査は標準DOM.Iterableを含み、この違いを再現できていませんでした。私たちの検査不足です。targetが低いことが原因ではありません。

## 固定差分は既存一ファイル・一行

e2e/helpers.tsでNodeListを配列にする方法だけを、配列展開からArray.fromへ置き換えます。配列化後のsome判定、visibleな実reader条件、設定画面との区別、30秒待ち、Response/optionsの保持、失敗診断、保存準備SVG、既存11ファイルの操作・1,392の検査・答え・時間枠はすべて保持します。

DOM.Iterableの追加やtsconfig/YAML/依存/教材/画面実装の変更は行いません。新しいfixtureや通常Appからの迂回も加えません。元のNodeListの要素順と参照を保って配列にする一行です。本文の完全before/afterとhashを末尾に収録します。

## 今回の限定検証

元build設定を保ったscratchコピーで、source52のsrc/e2e/config入力をGit blobと照合します。同一設定の変更前tsc -bで同じTS2488を再現し、一行変更後のtsc -b＋vite buildを通常設定・レビュー設定の両方で検査します。設定や未存在のe2eを省いた検査でPASSにしません。非作者レビューは固定patchとこの全文のhashへ結び付けます。実コマンド・入力閉包・ログを同梱します。

この検証はビルド互換性の確認です。新sourceの実CI/browserの成功や二次関数の完成はまだ主張しません。元P006の表示待ちによる解決効果と、その後のmobile/desktop/後半suiteは新commitで確認します。

## 承認後の工程と保護

新technical Work W-TECH-QF01-CI-P007-20261110を原APIで開始し、固定95入力と一行patchを照合して一度適用します。対象rrikunagasige-dot/kyotsu-step-web（ID1391122224）、repair branch work/qf01-common-ci-repair-20261109、source52/tree6dc3とdraft PR141です。実親W-MATH-QF01-BUILD-20261109、既存QF01-CI-P003-CORRECTION-20261110/原CIRepair issueへ正規接続します。P006その他の旧承認・FAILED・未解決履歴を保持し、11差分を再適用しません。

変更はhelper一行とP007自身の記録だけです。全332src、原core/guard/定義hash72a038、旧承認/設計/proof、元資料、N12、残る10spec、元tsconfig/YAML/依存/public/図/保存形式/安定IDを保持します。原adapterのexact patch照合を維持します。

新commitの全該当CIを実行します。push filterに合わない検査は、既承認祖先から同じnewsourceへ新CI専用refをCAS FFして起動し、旧refを巻戻しません。全成功後だけ既承認QF featureへ同じ検証版をCAS統合し、親保護12例外（P0018＋P0044）の正式revise、失効C01〜C09/G2の新CODEを原順で検査します。四幅320/390/430/1440、C09/G2を確認します。main統合・本番公開・本人受入・全章61問完成は含みません。

## 新しい承認が必要な理由

修正の目的と対象はP006の内側ですが、P006では全after文面とhashを固定して提示しました。原APIのtechnical reviseは新proposal hashと対応するUSERを要求し、同じ旧承認hashへ別patchを差し替える経路はありません。WORK_SYSTEM §11・§12Bと元adapterに従い、この一行の具体案を提示して新承認を待ちます。旧本人発言を新hashへの承認として再記録せず、guardを変更しません。P007はnative未open・正本未適用です。

実行済み限定検証：変更前の元pnpm run buildは同TS2488でexit2。候補の通常buildはexit0（28.78秒）、レビューbuildはexit0（23.182秒）、helper lintはexit0。入力396 Git blob一致・helper一行以外不変を照合済み。ローカルNode24.22.1/pnpm11.25.0はCIのNode22/pnpm11.9.0と異なるため、CIでの最終合否は別途確認します。ブラウザは起動していません。

固定patch SHA-256：e7b01793330a57ff8f6a583e9cae55a1666788f4fe9c0ecbbb3d1e96c276a504

native digest：e1de806a2bcb2c578a20d3c7084d90db3247789dffd2905509338cf3928e554e

固定before入力95件、全文はproposal/DECLARED_INPUTS.json。

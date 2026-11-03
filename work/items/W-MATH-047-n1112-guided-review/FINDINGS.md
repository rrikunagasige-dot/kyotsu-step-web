# Findings

- 判断結果を本文で先に説明する箇所：N11の03/07/10/12、N12の01/07。必須の条件や操作理由を教えることと、今回の答えを代わりに出すことを区別。
- N11のq11-constantは局所計算と次の本体再構成の役割が重複。定数計算だけを先に認定し、その後に不等式全体を組み立てる。
- N11のfraction-problemは分母を消す操作の選択前に3倍を指定。目的と元式を残し、掛ける数の判断を本人へ。
- N12のq13-operationは単独2650−□=0から、三辺へ同じ数を引く一つの操作パラメータの選択へ。新engineや同じ数を3回写す穴は不要。
- 一次監査でKEEPとした境界2件もsource-firstの非作者審査で反証された。多数決や既承認を理由に新指摘を閉じず、本文だけを改訂する。
- 基準の回答済み表示と未回答表示は別。resetは本人端末を実操作した場合だけ実施済みとする。今回の検証contextは独立。

## R06 technical dependency
既存n11-source-binding.mjsはW038範囲だけでなくAuthored全体をpinする。承認範囲外6nodeの本文変更でも既存validateTransformationPlanはTG03で停止。これを事前R04で候補Authoredへのcompileまで実行せず発見できていなかった。旧pin維持＋新exact source/3graph mappingを追加する未適用案を準備。未知source拒否や数学・保存ガードは外さない。TECHNICAL_SCOPE_ADDENDUM.mdと隔離7case検証を参照。

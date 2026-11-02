# N10 R04 native teaching / interaction候補 採否 A

対象は承認済みUX05のN10r4→r5。私はN10教材の非作者。実public initial/currentの意味応答9件はn10-responses-a.jsonへ別記録し、以下は既存CODE候補の採否を承認契約へ照合したものである。

## 出所

|入力/出力|SHA256|

|---|---|

|n10-teaching-input.json|ec4a95b83843a92d029f18d070f6215ae8c5691bca417211560650367dfb8c43|

|n10-teaching-candidates.json|52338d178a8af7044080f1114fe64cd94c1ddedd2a1b442c7eec0a04ea961f4d|

|n10-interaction-plan.json|647bf79c509fb8f731aeb4089271b8468b3ebc3b948b2951de06b058a8131157|

|n10-meaning-requests.json|92292f2c50722d9a6d2cc3cdafc5bacee003307999cab258920e43742e0ac1af|



## teaching候補一件：first_application — ADOPT（native前提順へ限定）

既存teaching-candidatesがnative 45nodeから生成した一候補を、既習/前結果を確認しながら進む順序案として採用する。全45stepのinputFactsは実native.requiredResultRefs、outputFactsは実resultId、targetsは回答nodeでは実part IDs、0part参照nodeでは実resultIdと一致する（参照resultを新しい回答にはしない）。架空の前結果や別nodeのmirrorを作らない。

この入力のknowledge=[]は、全生徒/全nodeが未習だと診断した結果ではない。candidateのexplainInput/explainReason=trueを全45nodeへ機械的に新文章/新小問として追加する採用はしない。既存の条件・一般公式・承認済み本文/必要途中式の範囲へ投影する。reassemble=falseも一問への復帰を省く許可ではなく、nativeの完全左辺・終結式を維持する。

初めての具体適用として、係数和の式、具体中項、相殺交差項の組、分子全体の分配、分数全体への公式対応を本人に残す。q20の正性/非零に初めて必要な平方4/3は保持し、q21では実認定resultから再利用する。既習の符号・×/指数一字・分母写しを新穴へ増やさない。

KEEP36nodeとKEEP52partの既存教授契約はこの候補で上書きしない。特に√125の正性→平方→平方根同定、積/商の定義域・正性・非零/根拠を保護する。0partのn10-17は前に認定した非零因子による値保持の途中式として採用し、新しい生徒回答として数えない。

CODEのstatus PASSは候補生成の構造成功であり、全根号式/法則の機械証明ではない。相殺の論理対応・教える判断・誤概念の区別は、実public stateからの非作者の根拠付きAI審査へ接続する。

## native interaction全60候補の採否

52KEEP/8NEWの全候補を承認JSONと実compiledへ対応し、全件ADOPT。RETIRE11は候補に出ておらず、新IDへaliasしない。順序・prerequisiteNodeIds・次のresult使用先はnative sourceへ結ぶ。採用は既承認60判断だけであり、自動候補の追加採用は0件。

|candidate ID|承認対応|採否|現在の学習行為|次の使用先|

|---|---|---|---|---|

|n10-q01-square::rootSquare|KEEP|ADOPT|√5の平方を計算します。|n10-q01-square-result|

|n10-01::value|KEEP|ADOPT|125÷5を計算します。|n10-01-result|

|n10-q02-sign::value|KEEP|ADOPT|正の候補tを選びます。|n10-q02-sign-result|

|n10-02::candidateSign|KEEP|ADOPT|5と√5の符号から、積と0を比べます。|n10-02-result|

|n10-02::squareValue|KEEP|ADOPT|候補の平方の最後の積を計算します。|n10-02-result|

|n10-02::identificationReason|KEEP|ADOPT|この候補を√125と断定できる根拠はどれですか。|n10-02-result|

|n10-q03-expand::powerA|KEEP|ADOPT|√aの指数を置きます。|n10-q03-expand-result|

|n10-q03-expand::powerB|KEEP|ADOPT|√bの指数を置きます。|n10-q03-expand-result|

|n10-03::aValue|KEEP|ADOPT|第一因子の平方を求めます。|n10-03-result|

|n10-03::bValue|KEEP|ADOPT|第二因子の平方を求めます。|n10-03-result|

|n10-q04-sign::relation|KEEP|ADOPT|積の符号を判断します。|n10-q04-sign-result|

|n10-04::rootReason|KEEP|ADOPT|確認した結果のうち、正の平方根を特定するのに必要なのはどれですか。|n10-04-result|

|n10-q05-denominator::relation|KEEP|ADOPT|商を定義するための分母の条件を選びます。|n10-q05-denominator-result|

|n10-q05-square::numPower|KEEP|ADOPT|分子の指数を置きます。|n10-q05-square-result|

|n10-q05-square::denPower|KEEP|ADOPT|分母の指数を置きます。|n10-q05-square-result|

|n10-05::numerator|KEEP|ADOPT|分子の平方を求めます。|n10-05-result|

|n10-05::denominator|KEEP|ADOPT|分母の平方を求めます。|n10-05-result|

|n10-q06-sign::relation|KEEP|ADOPT|商の符号を判断します。|n10-q06-sign-result|

|n10-06::quotientReason|KEEP|ADOPT|商を作る条件と、根号一つにまとめる根拠の組はどれですか。|n10-06-result|

|n10-q07-product::insideOperation|KEEP|ADOPT|根号の外の積に対応して、中の二数をどう結びますか。|n10-q07-product-result|

|n10-q07-product::inside|KEEP|ADOPT|根号内の積を計算します。|n10-q07-product-result|

|n10-07::squareFactor|KEEP|ADOPT|48を割り切る正の平方数のうち、最大のものはどれですか。|n10-07-result|

|n10-07::factor|KEEP|ADOPT|残りの因子を求めます。|n10-07-result|

|n10-q08-factor::coefficient|KEEP|ADOPT|√16を計算します。|n10-q08-factor-result|

|n10-q09-left::squareFactor|KEEP|ADOPT|8を割り切る最大の平方数を選びます。|n10-q09-left-result|

|n10-q09-left::coefficient|KEEP|ADOPT|左の項の係数√4を求めます。|n10-q09-left-result|

|n10-q09-right::squareFactor|KEEP|ADOPT|今度は右項を簡単にする平方因子を選びます。|n10-q09-right-result|

|n10-q09-right::coefficient|KEEP|ADOPT|右の項の係数√25を求めます。|n10-q09-right-result|

|n10-q10-coefficients::collectedExpressionUX05|NEW|ADOPT|共通する根号を保ち、二つの項の和を係数の和で表した式を選びます。|n10-q10-coefficients-result|

|n10-q10-coefficients::coefficient|KEEP|ADOPT|係数2+5を計算します。|n10-q10-coefficients-result|

|n10-q11-formula::signedMiddleTermUX05|NEW|ADOPT|差の平方の公式をこの根号式へ適用し、中項全体を符号込みで作ります。|n10-q11-formula-result|

|n10-11::leftSquare|KEEP|ADOPT|最初の平方を求めます。|n10-11-result|

|n10-11::rightSquare|KEEP|ADOPT|最後の平方を求めます。|n10-11-result|

|n10-q12-product::inside|KEEP|ADOPT|中項の根号内の積を計算します。|n10-q12-product-result|

|n10-12::constant|KEEP|ADOPT|普通の数2+3を計算します。|n10-12-result|

|n10-q13-identity::cancellingPairUX05|NEW|ADOPT|この積を分配したとき、互いに打ち消し合う交差項の組を選びます。組の順序は問いません。|n10-q13-identity-result|

|n10-13::left|KEEP|ADOPT|左の平方を求めます。|n10-13-result|

|n10-13::right|KEEP|ADOPT|右の平方を求めます。|n10-13-result|

|n10-13::difference|KEEP|ADOPT|7−2を計算します。|n10-13-result|

|n10-14::operation|KEEP|ADOPT|分数の値を保つ操作を選びます。|n10-14-result|

|n10-q15-factor::factor|KEEP|ADOPT|分母へ掛けた積が有理数になる正の因子を選びます。|n10-q15-factor-result|

|n10-15::numerator|KEEP|ADOPT|分子1×√3を計算します。|n10-15-result|

|n10-q16-denominator::square|KEEP|ADOPT|√3の平方を求めます。|n10-q16-denominator-result|

|n10-q16-denominator::denominator|KEEP|ADOPT|分母全体2×3を計算します。|n10-q16-denominator-result|

|n10-q17-factor::factor|KEEP|ADOPT|A+Bへ対応するA−Bを選びます。|n10-q17-factor-result|

|n10-q17-nonzero::relation|KEEP|ADOPT|同じ数を引いた後の差の符号を判断します。|n10-q17-nonzero-result|

|n10-18::A|KEEP|ADOPT|左の平方を求めます。|n10-18-result|

|n10-18::B|KEEP|ADOPT|右の平方を求めます。|n10-18-result|

|n10-18::C|KEEP|ADOPT|3−2を計算します。|n10-18-result|

|n10-q19-distribute::distributedNumeratorUX05|NEW|ADOPT|分子の括弧全体へ分配法則を適用した式を選びます。|n10-q19-distribute-result|

|n10-19::inside|KEEP|ADOPT|第二項の根号内の積を計算します。|n10-19-result|

|n10-q20-factor::factor|KEEP|ADOPT|平方差に対応する因子を選びます。|n10-q20-factor-result|

|n10-q20-factor::positiveComparisonLeftSquareUX05|NEW|ADOPT|選んだ因子が0でないことを比較で確かめます。まず2の平方を求めます。|n10-q20-factor-result|

|n10-q20-factor::positiveComparisonRootSquareUX05|NEW|ADOPT|比較するもう一方、√3の平方を求めます。|n10-q20-factor-result|

|n10-q20-factor::factorSign|KEEP|ADOPT|正の数の平方比較を使い、差と0を比べます。|n10-q20-factor-result|

|n10-q20-factor::reason|KEEP|ADOPT|選んだ因子で、式の値を保ったまま有理化できる理由を選びます。|n10-q20-factor-result|

|n10-20::rationalisedFractionUX05|NEW|ADOPT|同じ非零因子を上下へ掛けた式で、分子全体の積を平方、分母の和と差の積を平方差で表します。|n10-20-result|

|n10-q21-denominator::D|KEEP|ADOPT|分母4−3を計算します。|n10-q21-denominator-result|

|n10-q21-expand::signedMiddleTermUX05|NEW|ADOPT|既習の差の平方の公式を分子へ適用し、中項全体を符号込みで求めます。|n10-q21-expand-result|

|n10-q21-constants::C|KEEP|ADOPT|普通の数4+3を計算します。|n10-q21-constants-result|



## 不採用/非該当

承認JSONでRETIREとした次の11件は新版候補として不採用。原記録は出所付き旧版へ保管し、値や符号が一致しても別の意味の新問いへ継承しない。

- n10-17::productOperation
- n10-19::left
- n10-20::denominatorOperation
- n10-20::power
- n10-q11-formula::middleSign
- n10-q13-identity::operation
- n10-q19-distribute::productSign
- n10-q19-distribute::secondOperand
- n10-q21-expand::K
- n10-q21-expand::P
- n10-q21-expand::Q



解法の別支援profileや新しい小問群はこの一候補の出力にないため追加採用しない。resolved-math caseはpre-design非該当で、R07の同一source実画像/幾何へ渡す。本人受入・公開・Gold/fitは本採否から作らない。

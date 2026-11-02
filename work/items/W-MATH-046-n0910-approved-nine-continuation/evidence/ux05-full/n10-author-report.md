# UX05 N10全適用 作者報告

{"sourceNodes": 45, "constructionParents": 39, "parts": 60, "automaticNodes": 6}

9CHANGE/36KEEP、旧63=52KEEP/11RETIRE＋8NEW→60parts。from4→to5。共有source/Store/Git未編集。

- **keepBoundary**: 36KEEP nodeと52KEEP partはbaseline native object完全一致。H07正性→平方→同定、積商の証明、原値/図/収録順/既存source refsを保護。
- **q20q21**: 初回平方2²=4/(√3)²=3をq20で問い、terminal resultへ記録。n10-20/q21にはq20 resultの実requiredResultRefsとprerequisiteNodeIdsを付与。旧P/Q/KはARCHIVE_ONLY、新平方と符号込み中項へaliasしない。
- **cancellation**: 相殺組はtext enum一値、候補mathLinesで二項の境界を表示、足場ownkey hide後に具体展開と平方差を通常mathASTへする。
- **formulaAndGrouping**: 一般公式と確定済み数式条件はassumptionPartsのtyped mathへ。完全左辺は別group、先頭=だけ継続。
- **finite**: 7新math partは既存exact closed評価へ接続、相殺enumはrequires-semantic-review。数値候補PASSと学習意味のPASSを区別。
- **migrationCaution**: 新gate/数学条件の文言変更があるKEEP partも、局所の問い/型/全候補/対象演算は完全同一。rootの明示mappingにより保持し、NEW前提を飛ばさない。
- **normalDisplay**: 共有rendererは本人確認済みのまま使用し、各node専用の44px回避策を増やさない。

## 変更と適用

|node|主判断/適用|
|---|---|
|n10-q10-coefficients|√2を先にくくってから7だけ問うAUTO主判断を、係数和の式の構成へ置換。追加の平方因子/係数の基本小問は作らない。|
|n10-q11-formula|−一字だけの公式当てとUX04六段階の分配再証明をともに避ける。|
|n10-q13-identity|−一字で平方差を与えず、かつ−B→二積→二符号→0の小問連鎖へしない。|
|n10-17|元分子/分母の写しや×記号単独の採点をしない。非零を確認したc/cによる値保持と分数全体の束縛は式で明示。|
|n10-q19-distribute|−√2の写しと次の−符号を再度採点する二段階を、一つの必要な分子展開へまとめる。|
|n10-19|この有理化の分母で確定した(√3)²=3を分子で再入力しない。異なる根号の積√6は必要計算として保つ。|
|n10-q20-factor|4/3を先出しして後段P/Qで再採点せず、平方比較に初めて必要なここで計算。方針/正性/同一非零因子の根拠は保持。|
|n10-20|指数2と−一字を別採点せず、平方/平方差を分数全体へ適用する一つの変形へ統合。|
|n10-q21-expand|旧P/Qの4/3は前段resultを参照して再入力しない。旧K=4を符号込み中項の正答へaliasせず、新しい一つの公式適用を問う。|

## 全旧part対応

|旧id|処理|新版id|
|---|---|---|
|n10-q01-square::rootSquare|KEEP|n10-q01-square::rootSquare|
|n10-01::value|KEEP|n10-01::value|
|n10-q02-sign::value|KEEP|n10-q02-sign::value|
|n10-02::candidateSign|KEEP|n10-02::candidateSign|
|n10-02::squareValue|KEEP|n10-02::squareValue|
|n10-02::identificationReason|KEEP|n10-02::identificationReason|
|n10-q03-expand::powerA|KEEP|n10-q03-expand::powerA|
|n10-q03-expand::powerB|KEEP|n10-q03-expand::powerB|
|n10-03::aValue|KEEP|n10-03::aValue|
|n10-03::bValue|KEEP|n10-03::bValue|
|n10-q04-sign::relation|KEEP|n10-q04-sign::relation|
|n10-04::rootReason|KEEP|n10-04::rootReason|
|n10-q05-denominator::relation|KEEP|n10-q05-denominator::relation|
|n10-q05-square::numPower|KEEP|n10-q05-square::numPower|
|n10-q05-square::denPower|KEEP|n10-q05-square::denPower|
|n10-05::numerator|KEEP|n10-05::numerator|
|n10-05::denominator|KEEP|n10-05::denominator|
|n10-q06-sign::relation|KEEP|n10-q06-sign::relation|
|n10-06::quotientReason|KEEP|n10-06::quotientReason|
|n10-q07-product::insideOperation|KEEP|n10-q07-product::insideOperation|
|n10-q07-product::inside|KEEP|n10-q07-product::inside|
|n10-07::squareFactor|KEEP|n10-07::squareFactor|
|n10-07::factor|KEEP|n10-07::factor|
|n10-q08-factor::coefficient|KEEP|n10-q08-factor::coefficient|
|n10-q09-left::squareFactor|KEEP|n10-q09-left::squareFactor|
|n10-q09-left::coefficient|KEEP|n10-q09-left::coefficient|
|n10-q09-right::squareFactor|KEEP|n10-q09-right::squareFactor|
|n10-q09-right::coefficient|KEEP|n10-q09-right::coefficient|
|n10-q10-coefficients::coefficient|KEEP|n10-q10-coefficients::coefficient|
|n10-q11-formula::middleSign|RETIRE_ARCHIVE_ONLY|なし（旧版保存）|
|n10-11::leftSquare|KEEP|n10-11::leftSquare|
|n10-11::rightSquare|KEEP|n10-11::rightSquare|
|n10-q12-product::inside|KEEP|n10-q12-product::inside|
|n10-12::constant|KEEP|n10-12::constant|
|n10-q13-identity::operation|RETIRE_ARCHIVE_ONLY|なし（旧版保存）|
|n10-13::left|KEEP|n10-13::left|
|n10-13::right|KEEP|n10-13::right|
|n10-13::difference|KEEP|n10-13::difference|
|n10-14::operation|KEEP|n10-14::operation|
|n10-q15-factor::factor|KEEP|n10-q15-factor::factor|
|n10-15::numerator|KEEP|n10-15::numerator|
|n10-q16-denominator::square|KEEP|n10-q16-denominator::square|
|n10-q16-denominator::denominator|KEEP|n10-q16-denominator::denominator|
|n10-q17-factor::factor|KEEP|n10-q17-factor::factor|
|n10-q17-nonzero::relation|KEEP|n10-q17-nonzero::relation|
|n10-17::productOperation|RETIRE_ARCHIVE_ONLY|なし（旧版保存）|
|n10-18::A|KEEP|n10-18::A|
|n10-18::B|KEEP|n10-18::B|
|n10-18::C|KEEP|n10-18::C|
|n10-q19-distribute::secondOperand|RETIRE_ARCHIVE_ONLY|なし（旧版保存）|
|n10-q19-distribute::productSign|RETIRE_ARCHIVE_ONLY|なし（旧版保存）|
|n10-19::left|RETIRE_ARCHIVE_ONLY|なし（旧版保存）|
|n10-19::inside|KEEP|n10-19::inside|
|n10-q20-factor::factor|KEEP|n10-q20-factor::factor|
|n10-q20-factor::factorSign|KEEP|n10-q20-factor::factorSign|
|n10-q20-factor::reason|KEEP|n10-q20-factor::reason|
|n10-20::power|RETIRE_ARCHIVE_ONLY|なし（旧版保存）|
|n10-20::denominatorOperation|RETIRE_ARCHIVE_ONLY|なし（旧版保存）|
|n10-q21-denominator::D|KEEP|n10-q21-denominator::D|
|n10-q21-expand::P|RETIRE_ARCHIVE_ONLY|なし（旧版保存）|
|n10-q21-expand::K|RETIRE_ARCHIVE_ONLY|なし（旧版保存）|
|n10-q21-expand::Q|RETIRE_ARCHIVE_ONLY|なし（旧版保存）|
|n10-q21-constants::C|KEEP|n10-q21-constants::C|

既存CODEの実行/非作者意味審査/実browser/厳密移行はroot統合で別途確認。上の作者整合assertは製品テストPASSの代用ではない。

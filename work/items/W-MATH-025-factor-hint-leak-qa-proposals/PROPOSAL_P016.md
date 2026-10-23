# P016 — N12 Q06/Q12の式のまとまりを保つ改行

Status: PROPOSED / NOT APPROVED / NOT IMPLEMENTED
Command: CMD-WORK-001 修正
Parent executed source:944dcbdf5687a52789ae5baf55b1193537267837;P015実装は保持。

## 症状と新たな根本原因

P015の単元ID判定修正で専用折り返しは復帰し、操作/保存/横超過のテストは通過した。しかし実画像の目視とDOMのy座標で、Q06の係数欄と直後のxが別行、Q12の係数欄と閉じ括弧)xが別行になることを確認。既存flex-wrapはmath断片/choiceボタンを独立したflex子として折り返すため、数式の意味上のまとまりを保護しない。N12通常320pxにも一部同根の分離が既存のまま残る。「通常学習と同じ表示」や「横超過0px」だけでは十分でなかった。テストの不足も記録し、P015を視覚合格やDONEとしない。

P015 sourceの元の文字列:
- Q06:M('3x+2\\le2x+4\\quad\\Longrightarrow\\quad'),C('n12-p002-q06-left-coef'),M('x+2\\le4')。
- Q12:M('130(20-x)=2600+('),C('n12-p002-q12-signed-coef'),M(')x')。

## exact修正対象と表示案

対象はunitId math-numbers-expressions-n12内のformula-q06-left-coefとformula-q12-signed-coefの2ブロックのみ。通常学習と新しい2確認画面の両方に同じ表示を適用する。

### Q06

狭幅では、最初の不等式、下向き矢印、変形後の式の3視覚行。

$
\begin{gathered}
3x+2\le2x+4\\
\Downarrow\\
\boxed{\text{選択}}\,x+2\le4
\end{gathered}
$

最終行の係数欄とx+2≤4は一つの折り返さないまとまり。PCでは同じ左右の式を「⇒」で一行に並べる。解答後の係数1は既存表示規則どおりxとし、1xへ戻さない。

### Q12

狭幅では等号の直前を区切りにした2視覚行。

$
\begin{gathered}
130(20-x)\\
=2600+(\boxed{\text{選択}})x
\end{gathered}
$

第二行全体を折り返さないまとまりにし、開き括弧・係数欄・閉じ括弧・xを離さない。PCでは一行で表示。原データのM/C/M、採点値−130、ヒントは維持。

## 変更するもの

- TextbookFormula.tsx:unitIdと上記2blockIDに限定した表示用の式グループを作る。元のmath partを表示上だけ矢印/等号位置で分け、既存の選択ボタンと正答表示を再利用する。
- global.css:2ブロック専用classだけに、式グループのnowrap、430px以下の段組、PCの一行表示を適用。本文フォント・選択/×ボタンのサイズ・余白の全体規則を一括変更しない。
- tests:横超過/部品boundsに加え、係数欄と直後のx/閉じ括弧が同じ視覚行にあることをy座標の重なりで検査する。括弧を含む右辺グループ全体、矢印の順序、未回答/誤答/正答後/再読込の全状態を確認。
- 新2表示targetはpending/needs-fixのまま引き継ぎ、修正後の実画像2件を一括提示。以前に受入済み7ヒントのマーカーは再表示しない。

## 維持するもの

教材本文・式の数学的内容・ヒント・正答・選択肢・ID・revision・履歴・保存仕様・図は変更しない。P015の安定unitId判定は戻さない。残り30個のN12formulaや、N14の既承認折り返し、他単元へ新しい段組を一括適用しない。

## 影響範囲とverification

N12全32formulaを源流照合すると、choice直後にmath部品が続く候補は11block（source候補であり全件の実画面不具合確定ではない）:formula-q01-coef/q01-const/q02-coef/q06-left-coef/q06-right-coef/cost-cream/cost-pudding/cost-lower-bound/cost-upper-bound/q12-signed-coef/q13-lower。候補11件も通常画面の320/390/1440で未回答/誤答/正答を横断確認する。新たな同根不具合を確定した場合、勝手にP016の2block以外へ修正を広げず、各exact提案を提示する。その他の候補の視覚状態は現時点UNVERIFIED。

2対象はnormal/review320/390/1440、4状態とwrong→hint→retry、保存済み記録再読込、全35採点欄の完了、通常32formula、旧7marker非表示を検証。共通renderer/CSSのため数学/物理回帰も実行。新しいexactSHAの原画像を提示するまで視覚受入を求めない。P015の機能/横超過PASSを意味上のまとまりPASSへ読み替えない。全章Gate②OPEN、Gate③NOTREADY。main統合/公開は含まない。

## Evidence and approval boundary

[P015実画像・全原ZIP・DOM実測](./evidence/gate1-p015/README.md)。FullMath39916191960SUCCESS250unit/257browser/12skip;frozen-source capture39916932746SUCCESS25unit/6browser/6matrixskip。目視groupingFAILはこれらと別に記録。画像はソース944d、保存79d4c0b542a3f69968d760d919ec9058e3c50ff3。

ユーザー「いいよ続けて」はP015の単元判定2file変更への承認であり、今回の新しい式グループ/局所CSS変更への承認ではない。指示辞書CMD-WORK-001「修正中にmaterialな変更が必要になった場合もREVISE-PROPOSALへ戻り、修正版提示→再承認」に従い、このP016全文を先に提示し、明示承認後に実装する。

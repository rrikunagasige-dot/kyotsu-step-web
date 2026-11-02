# P-W046-UX-05 N10完成具体案（設計資料・未実装）

基準code `66c8007b37cc12391c9df574b8ebbb1b95cf26f5` / compiled `3cfe95380892a1d7a34fdc3fa142448a9f953ddc983427c9626b4fbdd8b0b895`。N10r4→r5。N09/共有renderer/移行実装はroot担当。

## 共通契約

- 新設問を増やす数ノルマなし。既習公式の具体適用/必要計算/定義域/正性/非零/同定を主単位とし、t²・5で割る操作・分母の写し・毎回の符号再証明を追加しない。
- KEEPは固定commitのnode/part本文・問い・全候補・正答・誤答説明を維持。変更node内KEEPもpart契約は同一だが新しい未解決前提を飛ばして解放しない。
- 全rows.requiresCorrectKeysはANDかつpartOrderのordered-correct。前提nodeがcompleteとなり当該nodeへ到達した時だけ初期rowsを表示。誤答はその値と理由を表示して後続を止める。
- 完成解法は設計資料であり初期全文表示ではない。初期画面はlearnerLead/assumptionsとrequiresCorrectKeysが空の行だけ。候補に正答印を出さず既存安定シャッフル。
- 初期assumptionsは当該問いへの既知条件のみ。未来nodeの答えを逆流させない。定理の一般公式を既習参照として出すことと具体対象の完成形を与えることは区別する。
- 数学的に正しい因子順・項順の交換は誤りとしない。選択式では等価な正答を複数候補に置かず、別の書き方はfeedbackで承認。候補外の正しい数学を不可能と断言しない。
- 正答表示はroot共有renderer改訂で自然な数式へ戻す。各nodeで44px phantomを避ける専用回避策/固定括弧/薄い空白は増やさない。
- RETIREはr4 archiveへ原recordを保持し新意味にaliasしない。NEWは未回答。現nodeの全解放状態は新版の未解決前提を含め再評価し、全回答リセットは行わない。
- cross-nodeの確定値は該当result参照で投影し、別nodeのキーをmirrorと偽装しない。変更のない別問題での転移計算まで一律に削除しない。

## 全45node判定

|node|判定|理由|
|---|---|---|
|n10-q01-square|KEEP|候補平方へ平方根の定義を使う必要計算rootSquareを保持。t×tの新しい別穴なし。|
|n10-01|KEEP|必要なt²=25の算出を保持。5で割る演算記号を追加しない。|
|n10-q02-sign|KEEP|t>0から±5の正の候補を選ぶ条件判断。|
|n10-02|KEEP|本人承認の正性→平方125→同定理由を厳密保持。|
|n10-q03-expand|KEEP|既存の平方作用の二因子構成を保持。新たな基本累乗の小問を増やさない。指数の組を新しい二概念と称さない。|
|n10-03|KEEP|積の証明で平方根定義を各パラメータへ適用しabを作る必要計算。|
|n10-q04-sign|KEEP|積が正である証拠を保持。|
|n10-04|KEEP|正性と平方の両方から平方根を同定する理由を保持。|
|n10-q05-denominator|KEEP|分母非零は商の存在の核心なので保持。|
|n10-q05-square|KEEP|既存の上下への平方の作用を保持。scope写し/指数の新しい反復小問は加えない。|
|n10-05|KEEP|商の平方a/bを自ら作る必要な定義適用を保持。|
|n10-q06-sign|KEEP|商の正性は平方根の同定に必要。|
|n10-06|KEEP|商の存在と正の平方根の同定理由を保持。|
|n10-q07-product|KEEP|証明した積の性質の初回適用と内積48を保持。|
|n10-07|KEEP|最大平方因子16と残因子3の方針/必要計算。4という別の正しい途中分解を偽としない最大指定。|
|n10-q08-factor|KEEP|平方因子を根号外へ出す係数4の初回具体適用。|
|n10-08|KEEP|確定結果を元問題へ接続するAUTO。既回答を再採点せず現行結果を保持。|
|n10-q09-left|KEEP|局所の根号簡単化の方針と係数を保持。残因子や基本指数の新しい別問は足さない。|
|n10-q09-right|KEEP|右項への転移。既存方針と係数5を保持し基本手順を追加分割しない。|
|n10-09|KEEP|確定した二項を元の和へ戻すAUTO。次nodeの係数和の式は先に出さない。|
|n10-q10-coefficients|CHANGE|√2を先にくくってから7だけ問うAUTO主判断を、係数和の式の構成へ置換。追加の平方因子/係数の基本小問は作らない。|
|n10-10|KEEP|確定結果を元問題へ接続するAUTO。既回答を再採点せず現行結果を保持。|
|n10-q11-formula|CHANGE|−一字だけの公式当てとUX04六段階の分配再証明をともに避ける。|
|n10-11|KEEP|具体的な二根号の平方2/3を計算。新しい中項構成の次なので先出しではない。|
|n10-q12-product|KEEP|新しい中項の根号の積6は必要計算。|
|n10-12|KEEP|定数和5の必要整理。見えている2/3の組を写す新小問は足さない。|
|n10-q13-identity|CHANGE|−一字で平方差を与えず、かつ−B→二積→二符号→0の小問連鎖へしない。|
|n10-13|KEEP|相殺を確定した後の平方7/2と差5を具体計算。|
|n10-14|KEEP|同一の非零因子を上下へ掛ける値保持の根拠。|
|n10-q15-factor|KEEP|最初の有理化で正の因子√3を選ぶ方針。|
|n10-15|KEEP|分子も同じ因子で変わることを最初の有理化で確認。1×√3を主たる難問とせず必要な局所計算として保持しscopeコピー小問は足さない。|
|n10-q16-denominator|KEEP|係数2を含む分母全体の平方/6を求める必要計算。|
|n10-16|KEEP|確定結果を元問題へ接続するAUTO。既回答を再採点せず現行結果を保持。|
|n10-q17-factor|KEEP|共役因子の方針を保持。|
|n10-q17-nonzero|KEEP|c/cを掛ける前提の非零性を正性で証明。|
|n10-17|CHANGE|元分子/分母の写しや×記号単独の採点をしない。非零を確認したc/cによる値保持と分数全体の束縛は式で明示。|
|n10-18|KEEP|この有理化で最初に必要になる平方3/2と分母1の計算。結果を次の分子計算でも参照。|
|n10-q19-distribute|CHANGE|−√2の写しと次の−符号を再度採点する二段階を、一つの必要な分子展開へまとめる。|
|n10-19|CHANGE|この有理化の分母で確定した(√3)²=3を分子で再入力しない。異なる根号の積√6は必要計算として保つ。|
|n10-q20-factor|CHANGE|4/3を先出しして後段P/Qで再採点せず、平方比較に初めて必要なここで計算。方針/正性/同一非零因子の根拠は保持。|
|n10-20|CHANGE|指数2と−一字を別採点せず、平方/平方差を分数全体へ適用する一つの変形へ統合。|
|n10-q21-denominator|KEEP|分母1の必要計算。主要な新概念と誇張せず追加の4−3の操作小問なし。|
|n10-q21-expand|CHANGE|旧P/Qの4/3は前段resultを参照して再入力しない。旧K=4を符号込み中項の正答へaliasせず、新しい一つの公式適用を問う。|
|n10-q21-constants|KEEP|中項を保った定数和7。4/3の写しを新しい別問にしない。|
|n10-21|KEEP|確定結果を元問題へ接続するAUTO。既回答を再採点せず現行結果を保持。|

## n10-q10-coefficients

√2を先にくくってから7だけ問うAUTO主判断を、係数和の式の構成へ置換。追加の平方因子/係数の基本小問は作らない。

**完成した穴なし解法（初期表示ではない）**

`2\sqrt2+5\sqrt2=(2+5)\sqrt2=7\sqrt2`

**初期本文** 二つの項を、共通する根号の何個分かという形でまとめます。

**条件** 直前で√8=2√2、√50=5√2を確定済み。

partOrder: collectedExpressionUX05 → coefficient

**正確な行とgate**

|id|kind/template|partKeys|requiresCorrectKeys|certifiedFrom|
|---|---|---|---|---|
|n10-q10-coefficients::ux05-collect|math: `2\sqrt2+5\sqrt2={collectedExpressionUX05}`|collectedExpressionUX05|||
|n10-q10-coefficients::ux05-sum|math: `=(2+5)\sqrt2={coefficient}\sqrt2`|coefficient|collectedExpressionUX05||

**設問の全契約**

- `n10-q10-coefficients::collectedExpressionUX05` NEW / math / expression。問い：共通する根号を保ち、二つの項の和を係数の和で表した式を選びます。。正答：`(2+5)\sqrt2`。
  操作：同類の根号項を分配法則の逆で集める。。旧回答：NEW_UNANSWERED_NO_ALIAS。
  - 候補 `(2+5)\sqrt2` 正答：共通因子√2を保ち、係数を足す分配法則の逆です。 / 表示=(2+5)\sqrt2
  - 候補 `\sqrt{2+5}` 誤答：係数を根号内へ入れる変形はできません。元の二項はいずれも√2の倍数です。 / 表示=\sqrt{2+5}
  - 候補 `(2+5)\sqrt{2+2}` 誤答：同じ√2をくくる操作です。根号内の2を足して変えてはいけません。 / 表示=(2+5)\sqrt{2+2}
  - 候補 `(2\times5)\sqrt2` 誤答：元は和です。係数を掛けるのでなく足してまとめます。 / 表示=(2\times5)\sqrt2
- `n10-q10-coefficients::coefficient` KEEP / math / coefficient。問い：係数2+5を計算します。。正答：`7`。
  操作：固定sourceと同じ局所操作。旧回答：SAME_ID_CONTRACT_KEEP_WITH_NEW_GATES。
  - 候補 `7` 正答：確定した結果を次の計算へ使います。 / 表示=7
  - 候補 `10` 誤答：係数を掛けずに足します。 / 表示=10
  - 候補 `3` 誤答：二つの項は加算されています。 / 表示=3



**達成/依存契約**

`{"classification": "NEW_CONSTRUCTION", "prerequisiteNodeIds": ["n10-04", "n10-09"], "requiredResultRefs": ["n10-04-result", "n10-09-result"], "terminalRecord": {"id": "n10-q10-coefficients::terminal", "formulas": ["2\\sqrt2+5\\sqrt2=7\\sqrt2"], "conditions": ["共通因子√2をくくる分配法則。"], "prose": "係数の合計は7です。元の二つの根号の和の結論になります。", "requiresCorrectKeys": ["collectedExpressionUX05", "coefficient"], "certifiedFrom": ["n10-04-result", "n10-09-result"], "proseParts": [{"type": "text", "text": "係数の合計は"}, {"type": "math", "latex": "7"}, {"type": "text", "text": "です。元の二つの根号の和の結論になります。"}], "conditionParts": [[{"type": "text", "text": "共通因子"}, {"type": "math", "latex": "\\sqrt{2}"}, {"type": "text", "text": "をくくる分配法則。"}]]}}`

**既存part対応**

- `n10-q10-coefficients::coefficient` → KEEP。同じ対象/操作/候補/正答の契約を維持。新版のgateは再評価する。

初期はinitialRowsのみ。後続結果は全gate成立後。一般公式以外の新part期待値をlead/条件へ書かない。正答は共有rendererで自然式、回答欄/候補は現在式の直後。

原問題/stage/resultId/式番号は固定sourceを継承。prerequisiteNodeIds/requiredResultRefs/terminalRecordは本案の明記値を用いる。

因子・項の交換等の数学的同値を否定しない。指定された式の形を選ぶ問いであり、同値な正答候補は重複掲載しない。

## n10-q11-formula

−一字だけの公式当てとUX04六段階の分配再証明をともに避ける。

**完成した穴なし解法（初期表示ではない）**

`(\sqrt2-\sqrt3)^2=(\sqrt2)^2-2\sqrt2\sqrt3+(\sqrt3)^2`

**初期本文** 既習の差の平方を、二つの根号を含む式に適用します。中項を自分で作りましょう。

**条件** 既習公式：(A-B)^2=A^2-2AB+B^2。

partOrder: signedMiddleTermUX05

**正確な行とgate**

|id|kind/template|partKeys|requiresCorrectKeys|certifiedFrom|
|---|---|---|---|---|
|n10-q11-formula::ux05-middle|math: `(\sqrt2-\sqrt3)^2=(\sqrt2)^2{signedMiddleTermUX05}+(\sqrt3)^2`|signedMiddleTermUX05|||

**設問の全契約**

- `n10-q11-formula::signedMiddleTermUX05` NEW / math / expression。問い：差の平方の公式をこの根号式へ適用し、中項全体を符号込みで作ります。。正答：`-2\sqrt2\sqrt3`。
  操作：差平方公式の2ABを具体的な二根号へ対応し、符号と係数を含む中項を構成。。旧回答：NEW_UNANSWERED_NO_ALIAS。
  - 候補 `-2\sqrt2\sqrt3` 正答：二つの異なる項の積が2個あり、差の平方では符号は負です。 / 表示=-2\sqrt2\sqrt3
  - 候補 `-\sqrt2\sqrt3` 誤答：中項の係数2が不足しています。既習公式の2ABをこの二項へ対応させます。 / 表示=-\sqrt2\sqrt3
  - 候補 `+2\sqrt2\sqrt3` 誤答：和でなく差の平方なので中項は負です。 / 表示=+2\sqrt2\sqrt3
  - 候補 `-2\sqrt{2+3}` 誤答：積ABに対応する根号の積です。根号の中を足すことはできません。 / 表示=-2\sqrt{2+3}



**達成/依存契約**

`{"classification": "NEW_CONSTRUCTION", "prerequisiteNodeIds": ["n10-04", "n10-10"], "requiredResultRefs": ["n10-04-result", "n10-10-result"], "terminalRecord": {"id": "n10-q11-formula::terminal", "formulas": ["(\\sqrt2-\\sqrt3)^2=(\\sqrt2)^2-2\\sqrt2\\sqrt3+(\\sqrt3)^2"], "conditions": ["既習の乗法公式。A=√2、B=√3。"], "prose": "差の平方の中項は引く項です。根号を含む本題へ公式を適用します。", "requiresCorrectKeys": ["signedMiddleTermUX05"], "certifiedFrom": ["n10-04-result", "n10-10-result"], "proseParts": [{"type": "text", "text": "差の平方の中項は引く項です。根号を含む本題へ公式を適用します。"}], "conditionParts": [[{"type": "text", "text": "既習の乗法公式。"}, {"type": "math", "latex": "A=\\sqrt{2}"}, {"type": "text", "text": "、"}, {"type": "math", "latex": "B=\\sqrt{3}"}, {"type": "text", "text": "。"}]]}}`

**既存part対応**

- `n10-q11-formula::middleSign` → RETIRE_ARCHIVE_ONLY。一般公式の符号−から具体式の符号込み中項へ対象/操作/候補が変わるためaliasしない。

初期はinitialRowsのみ。後続結果は全gate成立後。一般公式以外の新part期待値をlead/条件へ書かない。正答は共有rendererで自然式、回答欄/候補は現在式の直後。

原問題/stage/resultId/式番号は固定sourceを継承。prerequisiteNodeIds/requiredResultRefs/terminalRecordは本案の明記値を用いる。

因子・項の交換等の数学的同値を否定しない。指定された式の形を選ぶ問いであり、同値な正答候補は重複掲載しない。

## n10-q13-identity

−一字で平方差を与えず、かつ−B→二積→二符号→0の小問連鎖へしない。

**完成した穴なし解法（初期表示ではない）**

`(\sqrt7+\sqrt2)(\sqrt7-\sqrt2)=(\sqrt7)^2-\sqrt7\sqrt2+\sqrt2\sqrt7-(\sqrt2)^2=(\sqrt7)^2-(\sqrt2)^2`

**初期本文** 和と差の積で、消える交差項を確かめます。残る平方の項を次に計算します。

**条件** 既習の分配法則と和と差の積を使う。

partOrder: cancellingPairUX05

**正確な行とgate**

|id|kind/template|partKeys|requiresCorrectKeys|certifiedFrom|
|---|---|---|---|---|
|n10-q13-identity::ux05-problem|math: `(\sqrt7+\sqrt2)(\sqrt7-\sqrt2)`||||
|n10-q13-identity::ux05-pair|text: `相殺する交差項の組：{cancellingPairUX05}`|cancellingPairUX05|||
|n10-q13-identity::ux05-expand|math: `(\sqrt7+\sqrt2)(\sqrt7-\sqrt2)=(\sqrt7)^2-\sqrt7\sqrt2+\sqrt2\sqrt7-(\sqrt2)^2`||cancellingPairUX05||
|n10-q13-identity::ux05-cancel|math: `=(\sqrt7)^2-(\sqrt2)^2`||cancellingPairUX05||

**設問の全契約**

- `n10-q13-identity::cancellingPairUX05` NEW / text / meaning。問い：この積を分配したとき、互いに打ち消し合う交差項の組を選びます。組の順序は問いません。。正答：`opposite-cross-products`。
  操作：和差積の具体的な交差項を同定し、相殺する構造を把握。。旧回答：NEW_UNANSWERED_NO_ALIAS。
  - 候補 `opposite-cross-products` 正答：交差項は同じ大きさで逆符号なので和が0です。順を交換しても同じ組です。 / 表示=['-\\sqrt7\\sqrt2', '\\text{と}\\quad+\\sqrt2\\sqrt7']
  - 候補 `both-positive` 誤答：二つとも正なら打ち消し合いません。第二因子の−√2を掛ける項を確認します。 / 表示=['+\\sqrt7\\sqrt2', '\\text{と}\\quad+\\sqrt2\\sqrt7']
  - 候補 `both-negative` 誤答：二つとも負ではありません。第一因子の＋√2と第二因子の√7の積は正です。 / 表示=['-\\sqrt7\\sqrt2', '\\text{と}\\quad-\\sqrt2\\sqrt7']
  - 候補 `square-terms` 誤答：これらは交差項の組ではありません。異なる根号どうしを掛ける項を対応させます。 / 表示=['-\\sqrt7\\sqrt7', '\\text{と}\\quad+\\sqrt2\\sqrt2']

採点値はtext enum一つ。候補mathLinesは二項の境界で同じbutton内を2行にし、displayは読み上げ可能な組全体。本文は短いtext選択足場で単一の長いmath slotにしない。正答後は足場を消し、gate付きの具体展開/相殺結果を通常mathASTへする。順序交換は同値。

**達成/依存契約**

`{"classification": "NEW_CONSTRUCTION", "prerequisiteNodeIds": ["n10-04", "n10-12"], "requiredResultRefs": ["n10-04-result", "n10-12-result"], "terminalRecord": {"id": "n10-q13-identity::terminal", "formulas": ["(\\sqrt7+\\sqrt2)(\\sqrt7-\\sqrt2)=(\\sqrt7)^2-(\\sqrt2)^2"], "conditions": ["既習の和と差の積。A=√7、B=√2。"], "prose": "積を二つの平方の差へ直せます。次に各平方と差を計算します。", "requiresCorrectKeys": ["cancellingPairUX05"], "certifiedFrom": ["n10-04-result", "n10-12-result"], "proseParts": [{"type": "text", "text": "積を二つの平方の差へ直せます。次に各平方と差を計算します。"}], "conditionParts": [[{"type": "text", "text": "既習の和と差の積。"}, {"type": "math", "latex": "A=\\sqrt{7}"}, {"type": "text", "text": "、"}, {"type": "math", "latex": "B=\\sqrt{2}"}, {"type": "text", "text": "。"}]]}}`

**既存part対応**

- `n10-q13-identity::operation` → RETIRE_ARCHIVE_ONLY。一般公式の−と、具体的な相殺項の組を同定する新操作は非同値。

初期はinitialRowsのみ。後続結果は全gate成立後。一般公式以外の新part期待値をlead/条件へ書かない。正答は共有rendererで自然式、回答欄/候補は現在式の直後。

原問題/stage/resultId/式番号は固定sourceを継承。prerequisiteNodeIds/requiredResultRefs/terminalRecordは本案の明記値を用いる。

因子・項の交換等の数学的同値を否定しない。指定された式の形を選ぶ問いであり、同値な正答候補は重複掲載しない。

## n10-17

元分子/分母の写しや×記号単独の採点をしない。非零を確認したc/cによる値保持と分数全体の束縛は式で明示。

**完成した穴なし解法（初期表示ではない）**

`\frac{\sqrt3}{\sqrt3+\sqrt2}\frac{\sqrt3-\sqrt2}{\sqrt3-\sqrt2}=\frac{\sqrt3(\sqrt3-\sqrt2)}{(\sqrt3+\sqrt2)(\sqrt3-\sqrt2)}`

**初期本文** 非零と確認した同じ因子を、分子と分母の両方へ掛けます。

**条件** c=√3−√2≠0、元分母√3+√2>0。

partOrder: なし（AUTO）

**正確な行とgate**

|id|kind/template|partKeys|requiresCorrectKeys|certifiedFrom|
|---|---|---|---|---|
|n10-17::ux05-fraction|math: `\frac{\sqrt3}{\sqrt3+\sqrt2}\frac{\sqrt3-\sqrt2}{\sqrt3-\sqrt2}=\frac{\sqrt3(\sqrt3-\sqrt2)}{(\sqrt3+\sqrt2)(\sqrt3-\sqrt2)}`||||

**設問の全契約**




**達成/依存契約**

`{"classification": "AUTO_RECORDED_CONCLUSION", "prerequisiteNodeIds": ["n10-13", "n10-14", "n10-q17-nonzero"], "requiredResultRefs": ["n10-13-result", "n10-14-result", "n10-q17-nonzero-result"], "terminalRecord": {"id": "n10-17::terminal", "formulas": ["\\frac{\\sqrt3}{\\sqrt3+\\sqrt2}=\\frac{\\sqrt3(\\sqrt3-\\sqrt2)}{(\\sqrt3+\\sqrt2)(\\sqrt3-\\sqrt2)}"], "conditions": ["元分母√3+√2>0、掛ける因子√3−√2≠0。"], "prose": "値を保ったまま分母を和と差の積へ変えました。先に分母、次に分子を計算します。", "requiresCorrectKeys": [], "certifiedFrom": ["n10-13-result", "n10-14-result", "n10-q17-nonzero-result"], "proseParts": [{"type": "text", "text": "値を保ったまま分母を和と差の積へ変えました。先に分母、次に分子を計算します。"}], "conditionParts": [[{"type": "text", "text": "元分母"}, {"type": "math", "latex": "\\sqrt{3}+\\sqrt{2}>0"}, {"type": "text", "text": "、掛ける因子"}, {"type": "math", "latex": "\\sqrt{3}-\\sqrt{2}\\ne 0"}, {"type": "text", "text": "。"}]]}}`

**既存part対応**

- `n10-17::productOperation` → RETIRE_ARCHIVE_ONLY。分数の積の×一字は標準経路の独立主判断にせず、途中式へ統合。記録はarchive保持。

初期はinitialRowsのみ。後続結果は全gate成立後。一般公式以外の新part期待値をlead/条件へ書かない。正答は共有rendererで自然式、回答欄/候補は現在式の直後。

原問題/stage/resultId/式番号は固定sourceを継承。prerequisiteNodeIds/requiredResultRefs/terminalRecordは本案の明記値を用いる。

因子・項の交換等の数学的同値を否定しない。指定された式の形を選ぶ問いであり、同値な正答候補は重複掲載しない。

## n10-q19-distribute

−√2の写しと次の−符号を再度採点する二段階を、一つの必要な分子展開へまとめる。

**完成した穴なし解法（初期表示ではない）**

`\sqrt3(\sqrt3-\sqrt2)=\sqrt3\times\sqrt3-\sqrt3\times\sqrt2`

**初期本文** 分母は確定しました。次は分子の差全体へ分配法則を適用します。

**条件** 対象は分子√3(√3−√2)。

partOrder: distributedNumeratorUX05

**正確な行とgate**

|id|kind/template|partKeys|requiresCorrectKeys|certifiedFrom|
|---|---|---|---|---|
|n10-q19-distribute::ux05-distribute|math: `\sqrt3(\sqrt3-\sqrt2)={distributedNumeratorUX05}`|distributedNumeratorUX05|||

**設問の全契約**

- `n10-q19-distribute::distributedNumeratorUX05` NEW / math / expression。問い：分子の括弧全体へ分配法則を適用した式を選びます。。正答：`\sqrt3\times\sqrt3-\sqrt3\times\sqrt2`。
  操作：根号を含む分子全体へ分配法則を適用し、両項への作用を構成。。旧回答：NEW_UNANSWERED_NO_ALIAS。
  - 候補 `\sqrt3\times\sqrt3-\sqrt3\times\sqrt2` 正答：外の√3を括弧内の両項へ掛け、差の演算を保っています。 / 表示=\sqrt3\times\sqrt3-\sqrt3\times\sqrt2
  - 候補 `\sqrt3\times\sqrt3-\sqrt2` 誤答：括弧の第二項にも外の√3を掛けます。 / 表示=\sqrt3\times\sqrt3-\sqrt2
  - 候補 `\sqrt3\times\sqrt3+\sqrt3\times\sqrt2` 誤答：元の差を和へ変えてはいけません。 / 表示=\sqrt3\times\sqrt3+\sqrt3\times\sqrt2
  - 候補 `\sqrt3\times\sqrt3-\sqrt3` 誤答：第二項は√3と√2の積です。√2を落とさずに対応させます。 / 表示=\sqrt3\times\sqrt3-\sqrt3



**達成/依存契約**

`{"classification": "NEW_CONSTRUCTION", "prerequisiteNodeIds": ["n10-17", "n10-18"], "requiredResultRefs": ["n10-17-result", "n10-18-result"], "terminalRecord": {"id": "n10-q19-distribute::terminal", "formulas": ["\\sqrt3(\\sqrt3-\\sqrt2)=\\sqrt3\\times\\sqrt3-\\sqrt3\\times\\sqrt2"], "conditions": ["分配する対象は差の全体。"], "prose": "両項へ掛ける形になりました。各積を計算して分母1と合わせます。", "requiresCorrectKeys": ["distributedNumeratorUX05"], "certifiedFrom": ["n10-17-result", "n10-18-result"], "proseParts": [{"type": "text", "text": "両項へ掛ける形になりました。各積を計算して分母"}, {"type": "math", "latex": "1"}, {"type": "text", "text": "と合わせます。"}], "conditionParts": [[{"type": "text", "text": "分配する対象は差の全体。"}]]}}`

**既存part対応**

- `n10-q19-distribute::secondOperand` → RETIRE_ARCHIVE_ONLY。符号付き項の写しから両項への分配式の構成へ変更。
- `n10-q19-distribute::productSign` → RETIRE_ARCHIVE_ONLY。単独符号の再入力は新しい分配適用に統合。

初期はinitialRowsのみ。後続結果は全gate成立後。一般公式以外の新part期待値をlead/条件へ書かない。正答は共有rendererで自然式、回答欄/候補は現在式の直後。

原問題/stage/resultId/式番号は固定sourceを継承。prerequisiteNodeIds/requiredResultRefs/terminalRecordは本案の明記値を用いる。

因子・項の交換等の数学的同値を否定しない。指定された式の形を選ぶ問いであり、同値な正答候補は重複掲載しない。

## n10-19

この有理化の分母で確定した(√3)²=3を分子で再入力しない。異なる根号の積√6は必要計算として保つ。

**完成した穴なし解法（初期表示ではない）**

`\sqrt3\sqrt3-\sqrt3\sqrt2=3-\sqrt{3\times2}=3-\sqrt6`
`\frac{\sqrt3}{\sqrt3+\sqrt2}=\frac{3-\sqrt6}{1}=3-\sqrt6`

**初期本文** 分子の最初の積には、分母計算で確定した平方の値を使います。異なる根号どうしの積を計算しましょう。

**条件** n10-18で(√3)²=3、分母=1を確定済み。

partOrder: inside

**正確な行とgate**

|id|kind/template|partKeys|requiresCorrectKeys|certifiedFrom|
|---|---|---|---|---|
|n10-19::ux05-product|math: `\sqrt3\sqrt3-\sqrt3\sqrt2=3-\sqrt{ {inside} }`|inside||n10-18-result|
|n10-19::ux05-return|math: `\frac{\sqrt3}{\sqrt3+\sqrt2}=\frac{3-\sqrt6}{1}=3-\sqrt6`||inside|n10-18-result|

**設問の全契約**

- `n10-19::inside` KEEP / math / rational。問い：第二項の根号内の積を計算します。。正答：`6`。
  操作：固定sourceと同じ局所操作。旧回答：SAME_ID_CONTRACT_KEEP_WITH_NEW_GATES。
  - 候補 `6` 正答：確定した結果を次の計算へ使います。 / 表示=6
  - 候補 `5` 誤答：根号の中の積を計算します。 / 表示=5
  - 候補 `3` 誤答：第二因子2も積へ含めます。 / 表示=3



**達成/依存契約**

`{"classification": "NEW_CONSTRUCTION", "prerequisiteNodeIds": ["n10-17", "n10-q19-distribute", "n10-18"], "requiredResultRefs": ["n10-17-result", "n10-q19-distribute-result", "n10-18-result"], "terminalRecord": {"id": "n10-19::terminal", "formulas": ["\\frac{\\sqrt3}{\\sqrt3+\\sqrt2}=3-\\sqrt6"], "conditions": ["分母=1を認定済み。元分母と因子は非零。"], "prose": "分子まで計算して元の分数を整理できました。次は支援を減らして因子を選びます。", "requiresCorrectKeys": ["inside"], "certifiedFrom": ["n10-17-result", "n10-q19-distribute-result", "n10-18-result"], "proseParts": [{"type": "text", "text": "分子まで計算して元の分数を整理できました。次は支援を減らして因子を選びます。"}], "conditionParts": [[{"type": "text", "text": "分母"}, {"type": "math", "latex": "=1"}, {"type": "text", "text": "を認定済み。元分母と因子は非零。"}]]}}`

**既存part対応**

- `n10-19::left` → RETIRE_ARCHIVE_ONLY。同じ有理化内で確定済みの平方3はresult参照。r4記録はarchiveのみ。
- `n10-19::inside` → KEEP。同じ対象/操作/候補/正答の契約を維持。新版のgateは再評価する。

初期はinitialRowsのみ。後続結果は全gate成立後。一般公式以外の新part期待値をlead/条件へ書かない。正答は共有rendererで自然式、回答欄/候補は現在式の直後。

原問題/stage/resultId/式番号は固定sourceを継承。prerequisiteNodeIds/requiredResultRefs/terminalRecordは本案の明記値を用いる。

因子・項の交換等の数学的同値を否定しない。指定された式の形を選ぶ問いであり、同値な正答候補は重複掲載しない。

## n10-q20-factor

4/3を先出しして後段P/Qで再採点せず、平方比較に初めて必要なここで計算。方針/正性/同一非零因子の根拠は保持。

**完成した穴なし解法（初期表示ではない）**

`c=2-\sqrt3`
`2^2=4>3=(\sqrt3)^2,\quad2>0,\ \sqrt3>0\Rightarrow2-\sqrt3>0`
`(2+\sqrt3)(2-\sqrt3)=4-3=1\in\mathbb Q`
`c\ne0\Rightarrow c/c=1`

**初期本文** この手順では正の因子を使い、分母の積を有理数にします。選んだ因子が0でないことも確かめましょう。

**条件** 元分母2+√3>0。この手順の指定はc>0。逆符号の有効な別解を数学的に不可能とはしない。

partOrder: factor → positiveComparisonLeftSquareUX05 → positiveComparisonRootSquareUX05 → factorSign → reason

**正確な行とgate**

|id|kind/template|partKeys|requiresCorrectKeys|certifiedFrom|
|---|---|---|---|---|
|n10-q20-factor::ux05-factor|math: `(2+\sqrt3)\bigl({factor}\bigr)`|factor|||
|n10-q20-factor::ux05-square-left|math: `2^2={positiveComparisonLeftSquareUX05}`|positiveComparisonLeftSquareUX05|factor||
|n10-q20-factor::ux05-square-root|math: `(\sqrt3)^2={positiveComparisonRootSquareUX05}`|positiveComparisonRootSquareUX05|factor,positiveComparisonLeftSquareUX05||
|n10-q20-factor::ux05-compare|math: `2^2={mirror:positiveComparisonLeftSquareUX05}>{mirror:positiveComparisonRootSquareUX05}=(\sqrt3)^2,\quad2>0,\ \sqrt3>0`||factor,positiveComparisonLeftSquareUX05,positiveComparisonRootSquareUX05||
|n10-q20-factor::ux05-sign|math: `2-\sqrt3{factorSign}0`|factorSign|factor,positiveComparisonLeftSquareUX05,positiveComparisonRootSquareUX05||
|n10-q20-factor::ux05-nonzero|math: `c\ne0`||factor,positiveComparisonLeftSquareUX05,positiveComparisonRootSquareUX05,factorSign||
|n10-q20-factor::ux05-reason|text: `この変形で式の値を保って有理化できるのは、{reason}。`|reason|factor,positiveComparisonLeftSquareUX05,positiveComparisonRootSquareUX05,factorSign||

**設問の全契約**

- `n10-q20-factor::factor` KEEP / math / operand。問い：平方差に対応する因子を選びます。。正答：`2-\sqrt3`。
  操作：固定sourceと同じ局所操作。旧回答：SAME_ID_CONTRACT_KEEP_WITH_NEW_GATES。
  - 候補 `2-\sqrt3` 正答：確定した結果を次の計算へ使います。 / 表示=2-\sqrt3
  - 候補 `2+\sqrt3` 誤答：同じ和では平方差を作れません。 / 表示=2+\sqrt3
  - 候補 `\sqrt3-2` 誤答：その因子でも分母を−1にできます。ただし、この手順では正の因子cを選ぶ指定があります。指定と因子の符号を照合してください。 / 表示=\sqrt3-2
- `n10-q20-factor::positiveComparisonLeftSquareUX05` NEW / math / rational。問い：選んだ因子が0でないことを比較で確かめます。まず2の平方を求めます。。正答：`4`。
  操作：正数2と√3の大小比較に初めて必要な平方を計算。。旧回答：NEW_UNANSWERED_NO_ALIAS。
  - 候補 `4` 正答：2の平方は4です。正の数どうしの平方比較へ使います。 / 表示=4
  - 候補 `2` 誤答：平方は同じ数を二回掛けます。2をそのまま残しません。 / 表示=2
  - 候補 `8` 誤答：2を三回掛ける計算ではありません。 / 表示=8
- `n10-q20-factor::positiveComparisonRootSquareUX05` NEW / math / rational。問い：比較するもう一方、√3の平方を求めます。。正答：`3`。
  操作：非零の根拠を作るため根号の平方を定義で計算。。旧回答：NEW_UNANSWERED_NO_ALIAS。
  - 候補 `3` 正答：平方根の定義で(√3)²=3です。 / 表示=3
  - 候補 `9` 誤答：根号の中の3をさらに平方しません。 / 表示=9
  - 候補 `\sqrt3` 誤答：平方の作用を反映して根号を外します。 / 表示=\sqrt3
- `n10-q20-factor::factorSign` KEEP / math / relation。問い：正の数の平方比較を使い、差と0を比べます。。正答：`>`。
  操作：固定sourceと同じ局所操作。旧回答：SAME_ID_CONTRACT_KEEP_WITH_NEW_GATES。
  - 候補 `>` 正答：この判断を確定し、次へ進みます。 / 表示=>
  - 候補 `<` 誤答：2と√3の平方の大小を、元の正の数の大小へ戻してください。 / 表示=<
  - 候補 `=` 誤答：4と3は一致していません。 / 表示==
- `n10-q20-factor::reason` KEEP / text / equivalent-operation-reason。問い：選んだ因子で、式の値を保ったまま有理化できる理由を選びます。。正答：`nonzero-and-rational-product`。
  操作：固定sourceと同じ局所操作。旧回答：SAME_ID_CONTRACT_KEEP_WITH_NEW_GATES。
  - 候補 `nonzero-and-rational-product` 正答：因子が零でないことと、分母の積が有理数になることを合わせて確認できました。 / 表示=非零の因子で上下を同じように変え、分母の積を有理数にできるから
  - 候補 `same-factor-even-zero` 誤答：因子を上下へ掛けた式を比として見たとき、因子が零だと分母がどうなるか確かめてください。 / 表示=上下へ同じ因子を掛けさえすれば、その因子が零でも値を保てるから
  - 候補 `different-factors` 誤答：分母だけが有理数になっても、元の分数と同じ値になるとは限りません。上下へ掛けた比が何になるかを確かめてください。 / 表示=分母の積が有理数なら、分子に掛ける因子は別の数でもよいから



**達成/依存契約**

`{"classification": "NEW_CONSTRUCTION", "prerequisiteNodeIds": ["n10-13", "n10-14", "n10-19"], "requiredResultRefs": ["n10-13-result", "n10-14-result", "n10-19-result"], "terminalRecord": {"id": "n10-q20-factor::terminal", "formulas": ["c=2-\\sqrt3", "2-\\sqrt3>0", "2^2=4", "(\\sqrt3)^2=3"], "conditions": ["元分母2+√3>0。認定した因子2−√3>0、したがって非零。"], "prose": "選んだ因子は非零です。同じ因子を上下へ掛け、分子と分母の構造を確かめます。", "requiresCorrectKeys": ["factor", "positiveComparisonLeftSquareUX05", "positiveComparisonRootSquareUX05", "factorSign", "reason"], "certifiedFrom": ["n10-13-result", "n10-14-result", "n10-19-result"], "proseParts": [{"type": "text", "text": "選んだ因子は非零です。同じ因子を上下へ掛け、分子と分母の構造を確かめます。"}], "conditionParts": [[{"type": "text", "text": "元分母"}, {"type": "math", "latex": "2+\\sqrt{3}>0"}, {"type": "text", "text": "。認定した因子"}, {"type": "math", "latex": "2-\\sqrt{3}>0"}, {"type": "text", "text": "、したがって非零。"}]]}}`

**既存part対応**

- `n10-q20-factor::factor` → KEEP。同じ対象/操作/候補/正答の契約を維持。新版のgateは再評価する。
- `n10-q20-factor::factorSign` → KEEP。同じ対象/操作/候補/正答の契約を維持。新版のgateは再評価する。
- `n10-q20-factor::reason` → KEEP。同じ対象/操作/候補/正答の契約を維持。新版のgateは再評価する。

初期はinitialRowsのみ。後続結果は全gate成立後。一般公式以外の新part期待値をlead/条件へ書かない。正答は共有rendererで自然式、回答欄/候補は現在式の直後。

原問題/stage/resultId/式番号は固定sourceを継承。prerequisiteNodeIds/requiredResultRefs/terminalRecordは本案の明記値を用いる。

因子・項の交換等の数学的同値を否定しない。指定された式の形を選ぶ問いであり、同値な正答候補は重複掲載しない。

## n10-20

指数2と−一字を別採点せず、平方/平方差を分数全体へ適用する一つの変形へ統合。

**完成した穴なし解法（初期表示ではない）**

`\frac{2-\sqrt3}{2+\sqrt3}\frac{2-\sqrt3}{2-\sqrt3}=\frac{(2-\sqrt3)^2}{2^2-(\sqrt3)^2}=\frac{(2-\sqrt3)^2}{4-3}`

**初期本文** 非零と確認した同じ因子を上下へ掛けます。分子と分母に適用する公式の違いに注意しましょう。

**条件** c=2−√3≠0を確定済み。比較で2²=4、(√3)²=3も確定済み。

partOrder: rationalisedFractionUX05

**正確な行とgate**

|id|kind/template|partKeys|requiresCorrectKeys|certifiedFrom|
|---|---|---|---|---|
|n10-20::ux05-start|math: `\frac{2-\sqrt3}{2+\sqrt3}\frac{2-\sqrt3}{2-\sqrt3}`||||
|n10-20::ux05-form|math: `={rationalisedFractionUX05}`|rationalisedFractionUX05|||
|n10-20::ux05-known-squares|math: `=\frac{(2-\sqrt3)^2}{4-3}`||rationalisedFractionUX05|n10-q20-factor-result|

**設問の全契約**

- `n10-20::rationalisedFractionUX05` NEW / math / expression。問い：同じ非零因子を上下へ掛けた式で、分子全体の積を平方、分母の和と差の積を平方差で表します。。正答：`\frac{(2-\sqrt3)^2}{2^2-(\sqrt3)^2}`。
  操作：有理化の分数全体で二つの既習公式を対応させ、値保持した式を構成。。旧回答：NEW_UNANSWERED_NO_ALIAS。
  - 候補 `\frac{(2-\sqrt3)^2}{2^2-(\sqrt3)^2}` 正答：分子は差全体の平方、分母は和と差の積の公式です。 / 表示=\frac{(2-\sqrt3)^2}{2^2-(\sqrt3)^2}
  - 候補 `\frac{2^2-(\sqrt3)^2}{2^2-(\sqrt3)^2}` 誤答：分子は差どうしの積です。和と差の積ではないので平方差にはなりません。 / 表示=\frac{2^2-(\sqrt3)^2}{2^2-(\sqrt3)^2}
  - 候補 `\frac{(2-\sqrt3)^2}{2^2+(\sqrt3)^2}` 誤答：分母は和と差の積なので、残るのは平方の差です。 / 表示=\frac{(2-\sqrt3)^2}{2^2+(\sqrt3)^2}
  - 候補 `\frac{2-\sqrt3}{2^2-(\sqrt3)^2}` 誤答：分子にも同じ因子を掛けています。分子全体のもう一つの因子を落とさないでください。 / 表示=\frac{2-\sqrt3}{2^2-(\sqrt3)^2}



**達成/依存契約**

`{"classification": "NEW_CONSTRUCTION", "prerequisiteNodeIds": ["n10-13", "n10-14", "n10-q20-factor"], "requiredResultRefs": ["n10-13-result", "n10-14-result", "n10-q20-factor-result"], "terminalRecord": {"id": "n10-20::terminal", "formulas": ["\\frac{2-\\sqrt3}{2+\\sqrt3}=\\frac{(2-\\sqrt3)^2}{4-3}"], "conditions": ["元分母と掛ける因子は非零。"], "prose": "分母と分子を計算できる形へ直せました。まず分母4−3を計算します。", "requiresCorrectKeys": ["rationalisedFractionUX05"], "certifiedFrom": ["n10-13-result", "n10-14-result", "n10-q20-factor-result"], "proseParts": [{"type": "text", "text": "分母と分子を計算できる形へ直せました。まず分母"}, {"type": "math", "latex": "4-3"}, {"type": "text", "text": "を計算します。"}], "conditionParts": [[{"type": "text", "text": "元分母と掛ける因子は非零。"}]]}}`

**既存part対応**

- `n10-20::power` → RETIRE_ARCHIVE_ONLY。同じ因子数の指数を単独採点せず、分数全体の公式適用へ統合。
- `n10-20::denominatorOperation` → RETIRE_ARCHIVE_ONLY。−単独から分数全体の式構成へ対象/候補/操作変更。

初期はinitialRowsのみ。後続結果は全gate成立後。一般公式以外の新part期待値をlead/条件へ書かない。正答は共有rendererで自然式、回答欄/候補は現在式の直後。

原問題/stage/resultId/式番号は固定sourceを継承。prerequisiteNodeIds/requiredResultRefs/terminalRecordは本案の明記値を用いる。

因子・項の交換等の数学的同値を否定しない。指定された式の形を選ぶ問いであり、同値な正答候補は重複掲載しない。

## n10-q21-expand

旧P/Qの4/3は前段resultを参照して再入力しない。旧K=4を符号込み中項の正答へaliasせず、新しい一つの公式適用を問う。

**完成した穴なし解法（初期表示ではない）**

`(2-\sqrt3)^2=2^2-2\times2\times\sqrt3+(\sqrt3)^2=4-4\sqrt3+3`

**初期本文** 分子の差の平方を展開します。二つの平方は前段の確定値を使い、中項を符号込みで作りましょう。

**条件** 既習公式(A−B)²=A²−2AB+B²。2²=4、(√3)²=3はn10-q20-factorで確定済み。

partOrder: signedMiddleTermUX05

**正確な行とgate**

|id|kind/template|partKeys|requiresCorrectKeys|certifiedFrom|
|---|---|---|---|---|
|n10-q21-expand::ux05-middle|math: `(2-\sqrt3)^2=4{signedMiddleTermUX05}+3`|signedMiddleTermUX05||n10-q20-factor-result|

**設問の全契約**

- `n10-q21-expand::signedMiddleTermUX05` NEW / math / expression。問い：既習の差の平方の公式を分子へ適用し、中項全体を符号込みで求めます。。正答：`-4\sqrt3`。
  操作：差平方を新しい二項へ適用し、根号を含む符号込み中項を構成。。旧回答：NEW_UNANSWERED_NO_ALIAS。
  - 候補 `-4\sqrt3` 正答：中項は−2×2×√3=−4√3です。平方4/3は前段の確定値を使います。 / 表示=-4\sqrt3
  - 候補 `-2\sqrt3` 誤答：公式の2ABではA=2です。その2をもう一つ掛けます。 / 表示=-2\sqrt3
  - 候補 `+4\sqrt3` 誤答：差の平方では中項が負です。 / 表示=+4\sqrt3
  - 候補 `-12` 誤答：中項は2と√3の積の倍数です。√3を3へ取り替えません。 / 表示=-12



**達成/依存契約**

`{"classification": "NEW_CONSTRUCTION", "prerequisiteNodeIds": ["n10-20", "n10-q21-denominator", "n10-q11-formula", "n10-q20-factor"], "requiredResultRefs": ["n10-20-result", "n10-q21-denominator-result", "n10-q11-formula-result", "n10-q20-factor-result"], "terminalRecord": {"id": "n10-q21-expand::terminal", "formulas": ["(2-\\sqrt3)^2=4-4\\sqrt3+3"], "conditions": ["A=2、B=√3。(A−B)²の公式を用いて分子(2−√3)²を展開する。"], "prose": "平方の三項が4−4√3+3と求まりました。普通の数の項をまとめます。", "requiresCorrectKeys": ["signedMiddleTermUX05"], "certifiedFrom": ["n10-20-result", "n10-q21-denominator-result", "n10-q11-formula-result", "n10-q20-factor-result"], "proseParts": [{"type": "text", "text": "平方の三項が"}, {"type": "math", "latex": "4-4\\sqrt{3}+3"}, {"type": "text", "text": "と求まりました。普通の数の項をまとめます。"}], "conditionParts": [[{"type": "math", "latex": "A=2"}, {"type": "text", "text": "、"}, {"type": "math", "latex": "B=\\sqrt3"}, {"type": "text", "text": "。"}, {"type": "math", "latex": "(A-B)^2"}, {"type": "text", "text": "の公式を用いて分子"}, {"type": "math", "latex": "(2-\\sqrt3)^2"}, {"type": "text", "text": "を展開する。"}]]}}`

**既存part対応**

- `n10-q21-expand::P` → RETIRE_ARCHIVE_ONLY。平方4は比較nodeへ問いを移したが、問い/前提/順序が異なり旧Pを新keyへaliasしない。ARCHIVE_ONLY。
- `n10-q21-expand::K` → RETIRE_ARCHIVE_ONLY。旧正の係数4と符号込み中項−4√3は非同値。ARCHIVE_ONLY。
- `n10-q21-expand::Q` → RETIRE_ARCHIVE_ONLY。平方3は比較nodeへ問いを移したが、問い/前提/順序が異なり旧Qを新keyへaliasしない。ARCHIVE_ONLY。

初期はinitialRowsのみ。後続結果は全gate成立後。一般公式以外の新part期待値をlead/条件へ書かない。正答は共有rendererで自然式、回答欄/候補は現在式の直後。

原問題/stage/resultId/式番号は固定sourceを継承。prerequisiteNodeIds/requiredResultRefs/terminalRecordは本案の明記値を用いる。

因子・項の交換等の数学的同値を否定しない。指定された式の形を選ぶ問いであり、同値な正答候補は重複掲載しない。

## 全旧part対応

KEEPは同一ID。RETIREは旧版保存のみでaliasなし。

|oldId|action|newId|
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
|n10-q11-formula::middleSign|RETIRE_ARCHIVE_ONLY|なし|
|n10-11::leftSquare|KEEP|n10-11::leftSquare|
|n10-11::rightSquare|KEEP|n10-11::rightSquare|
|n10-q12-product::inside|KEEP|n10-q12-product::inside|
|n10-12::constant|KEEP|n10-12::constant|
|n10-q13-identity::operation|RETIRE_ARCHIVE_ONLY|なし|
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
|n10-17::productOperation|RETIRE_ARCHIVE_ONLY|なし|
|n10-18::A|KEEP|n10-18::A|
|n10-18::B|KEEP|n10-18::B|
|n10-18::C|KEEP|n10-18::C|
|n10-q19-distribute::secondOperand|RETIRE_ARCHIVE_ONLY|なし|
|n10-q19-distribute::productSign|RETIRE_ARCHIVE_ONLY|なし|
|n10-19::left|RETIRE_ARCHIVE_ONLY|なし|
|n10-19::inside|KEEP|n10-19::inside|
|n10-q20-factor::factor|KEEP|n10-q20-factor::factor|
|n10-q20-factor::factorSign|KEEP|n10-q20-factor::factorSign|
|n10-q20-factor::reason|KEEP|n10-q20-factor::reason|
|n10-20::power|RETIRE_ARCHIVE_ONLY|なし|
|n10-20::denominatorOperation|RETIRE_ARCHIVE_ONLY|なし|
|n10-q21-denominator::D|KEEP|n10-q21-denominator::D|
|n10-q21-expand::P|RETIRE_ARCHIVE_ONLY|なし|
|n10-q21-expand::K|RETIRE_ARCHIVE_ONLY|なし|
|n10-q21-expand::Q|RETIRE_ARCHIVE_ONLY|なし|
|n10-q21-constants::C|KEEP|n10-q21-constants::C|

## 集計（穴数は結果）

{"allNodes": 45, "changedNodes": 9, "keptNodes": 36, "baselineParts": 63, "keepParts": 52, "retiredParts": 11, "newParts": 8, "proposedParts": 60}

実装承認/正常フォント実画像/移行QAは未実施。本案の構造と数学の非作者審査を依頼する。

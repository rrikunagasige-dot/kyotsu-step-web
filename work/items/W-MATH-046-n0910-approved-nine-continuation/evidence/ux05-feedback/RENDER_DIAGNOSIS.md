# W046 UX05 — 正答後の数式走形の読取診断

担当: /root/w046_render_review。範囲は技術診断/方式助言のみ。製品・正式文書・Git・Storeの変更、browser/新テスト実行なし。添付 `upload/image(6).png` を実見し、既存source/compiledを読取した。

## 結論

本人の指摘は妥当。第二因子(x＋4)の巨大括弧と符号前後の不自然な空きは、通常の数式へ戻るべき正答を、まだ44px中立slotに入れて表示する実装から発生する。フォント欠落ではない。薄い空白を追加した数学データだけでは根治せず、前回の非作者SCOPED PASSはこの組版欠陥を見逃したため、本人の細部受入を満たす根拠にはできない。

## 出所を区別

- 読取worktree: `/workspace/scratch/6ff917b2ec4a/w046-ux04-pilot`。現在のraw基準HEADは `778a6c3acb18765d99f3ebaf922457326af536f1`。
- 主担当の候補code保存commit: `66c8007b37cc12391c9df574b8ebbb1b95cf26f5`。主担当は変更20blob一致を確認済み。
- source保存70…の識別子は親担当側のsource記録であり、本診断でその完全SHAやcode commitとの同一性を追加認定していない。
- 読取compiledはN09r6 `470f137102936e6bb73ca3df835e8c9b27d19c5ce53a40879fe9c2dfa8499a3d`、N10r4。下記inventoryはこの実データ全体。

## 原因の連鎖

1. `ConstructionLessonReadingFlow.tsx:126` は通常教材表示を、partの正答状態にかかわらず `interactive` で渡す。`readonly` は履歴等の別用途。
2. `NestedConstructionMath.tsx:54` は候補実測から最低44.1×44.1pxのenvelopeを作る。正答でも同じ候補最大値を維持する。propsコメントにも「Current stage keeps its neutral reservation, even when complete」とある。
3. `nestedMathTemplate.ts:205-214` はreadonlyのときだけ自然なLaTeXへ戻す。interactiveのcertifiedは正しい候補の存在確認とslot metadataにしか作用せず、正答も `mathrlap`で候補を中央に重ね、`phantom{rule[...]{width}{height}}`を残す。
4. 同compilerのgroup出力（約230行）は丸括弧を常に `\left(…\right)`へする。第一因子(x−4)にはslotがない一方、第二因子の正答＋には44pxの高さを持つphantomがあり、右側の括弧だけが伸長する。＋の文字幅は小さくても44px幅が残るので横空きも大きい。
5. `.nested-slot-readonly`はborderだけ0にする透明なabsolute spanであり、数式側のphantomを消さない。CSSでこのspanを非表示にするだけでは原因は残る。
6. group plannerも `measureNeutralNestedGroup`で全候補の44px中立式からbody幅/関係記号列/折返しを作り、`NodeRows`の計画依存にvalues/certifiedがない。正答glyphだけcompact化しても、中立groupの横余白や折返しは別途残り得る。履歴readonlyも自然なglyphにはなるが、中立group計画をそのまま使うので単純な全体readonly切替だけでは全問題を解決しない。

## 同型の範囲

全てのmath行内の直接slotが同じcompiler経路を通る。N09r6は31node/44行/48直接slot出現、N10r4は37node/50行/58出現。これは静的な経路対象数であり、全箇所の画像破綻を新たに実見した件数ではない。text slotは正答後にplain spanへ戻り、このphantom問題とは異なる。mirrorは通常表示で自然な式を返すため直接slotと区別する。ただしneutral group計画はmirrorにも中立枠を置くので、その計画余白の波及はあり得る。

最も近い括弧内slotは、N09 n09-01::factorSign、n09-06::addend、n09-q07-negation::scope、n09-07::secondOperand、N10 n10-q10-coefficients::coefficient（括弧外なので直接括弧伸長はしない）、n10-q17-factor::factor、n10-q19-distribute::secondOperand、n10-q20-factor::factor。最後のfactor群は共役式自体も幅がある。指数slot（n10-q03-expand/n10-q05-square/n10-20）、根号内slot（n10-q07-product/n10-q12-product/n10-19）、分数slot（n10-05/n10-15）はphantomが構造の高さ/幅に入る別の強い波及候補。残りの数値/符号/不等号も正答後の不要な44px空きという意味では同型。

正答後消える既存math足場4行（N09 n09-06のaddend、N10 n10-07/n10-q09-left/n10-q09-rightのsquareFactor）はその行の完成後残留対象から除外する。誤答/未回答時の数式構造には依然同じ中立枠を使う。

## 修正方式の助言（未実装）

まず正答済みpartを、答えのLaTeXそのものへ戻すcompiler分岐を導入する。正答済みslotにhit target/44pxphantomを残す必要はない。未回答/誤答partには44pxの操作域とkeyboardを保持し、正答部分と未回答部分を混在できることが必要なのでnode全体を早期readonlyにしない。mirrorは今の証明済み値契約を維持する。

それと同時に表示用の自然な式/構造寸法と、操作用hit target/衝突回避を区別する。44px操作域をphantomの垂直寸法として括弧・根号・指数に食わせない方針が根治。単に全括弧を固定サイズにする/44pxを縮める/CSS枠だけ消す/追加thinspaceで押し出す方法は、fractionやsqrtもある横断問題を隠すに留まる。

group計画は正答部分の自然幅と、未回答部分の全候補中立幅を混ぜた状態へ更新する必要がある。未回答の正答値を使って計画しない。renderとplannerの出所を一致させ、正答確定という公開状態を入力にする。geometry collectorも現在「compiledの全slotにcontrol必須」なので、compact正答はslot/control検査の対象外または明確なcertified glyph evidenceへ変更し、未回答44pxの検査は維持する。テストを緩めず、正答後に通常の数式へ戻ったことを見る追加の受入観点が必要。

この技術修正と、一次式の＋4/−4穴が過剰という教育粒度の変更は別の判断軸。符号穴を消すだけでは他の同型正答slotの走形が残る。教育粒度はA/rootの審査へ委ね、本診断から新設問を追加しない。

## 全経路inventory

各行は `node / partKeys / template`。`HIDE`は当該part正答後に行自体を隠す既存契約。未実見候補と確定した添付の欠陥を混同しない。

### N09 r6

|node|直接slot|template|正答後行|
|---|---|---|---|
|n09-q01-negative|productSign|`={productSign}(4\times4)`|残る|
|n09-q01-negative|value|`={value}`|残る|
|n09-01|factorSign|`\iff(x-4)(x\,{factorSign}\,4)=0`|残る|
|n09-01|zeroLogic|`x-4=0\quad{zeroLogic}\quad x+4=0`|残る|
|n09-q02-root|value|`\sqrt{16}={value}`|残る|
|n09-q02-negative-square|signFactor|`={signFactor}\times5`|残る|
|n09-q02-negative-square|value|`={value}`|残る|
|n09-q03-inside|value|`(-4)^2=(-4)\times(-4)={value}`|残る|
|n09-03|value|`\sqrt{(-4)^2}=\sqrt{16}={value}`|残る|
|n09-q04-nonnegative|value|`\sqrt{a^2}={value}\quad(a\ge0)`|残る|
|n09-q04-negative|oppositeSign|`-a{oppositeSign}0`|残る|
|n09-q04-negative|value|`\sqrt{a^2}={value}`|残る|
|n09-05|value|`\sqrt{a^2}={value}`|残る|
|n09-q06-squares|value|`2^2=2\times2={value}`|残る|
|n09-q06-order|relation|`4<5\Rightarrow 2\ {relation}\ \sqrt5`|残る|
|n09-06|addend|`2+({addend})<\sqrt5+\text{…}`|HIDE|
|n09-06|zero|`2-\sqrt5<{zero}`|残る|
|n09-q07-negation|scope|`\|2-\sqrt5\|=-(\,{scope}\,)`|残る|
|n09-07|outsideFactor|`-(2-\sqrt5)={outsideFactor}\times(2-\sqrt5)`|残る|
|n09-07|secondOperand|`=(-1)(2+({secondOperand}))`|残る|
|n09-07|left, sign|`={left}\ {sign}\ \sqrt5`|残る|
|n09-p001-q08-left-square|L1|`=19600+{L1}+1`|残る|
|n09-p001-q08-left-square|L2|`=19600+{mirror:L1}+1={L2}`|残る|
|n09-p001-q08-left-square|L3|`1.41^2=\frac{ {mirror:L2} }{10000}={L3}`|残る|
|n09-p001-q08-right-square|R1|`=19600+{R1}+4`|残る|
|n09-p001-q08-right-square|R2|`=19600+{mirror:R1}+4={R2}`|残る|
|n09-p001-q08-right-square|R3|`1.42^2=\frac{ {mirror:R2} }{10000}={R3}`|残る|
|n09-p001-q08-lower-sign|C|`1.9881\ {C}\ 2`|残る|
|n09-p001-q08-upper-sign|D|`2\ {D}\ 2.0164`|残る|
|n09-09|lowerRelation|`1.41{lowerRelation}\sqrt2`|残る|
|n09-09|upperRelation|`\sqrt2{upperRelation}1.42`|残る|
|n09-q10-reject-truncation|value|`-2.1-(-2)=-2.1+2={value}`|残る|
|n09-10|n|`n={n}`|残る|
|n09-q11-remainder|sign|`r=-2.1-(-3)=-2.1\ {sign}\ 3`|残る|
|n09-q11-remainder|value|`={value}`|残る|
|n09-q12-lower|value|`3^2=3\times3={value}`|残る|
|n09-q12-upper|value|`4^2=4\times4={value}`|残る|
|n09-12|lower, upper|`3\ {lower}\ \sqrt{10}\ {upper}\ 4`|残る|
|n09-q13-reverse|S1, S2|`-3\ {S1}\ -\sqrt{10}\ {S2}\ -4`|残る|
|n09-13|left, right|`{left}<-\sqrt{10}<{right}`|残る|
|n09-q14-positive-integer|value|`n={value}`|残る|
|n09-q14-positive-remainder|remainderOperation|`r=\sqrt{10}{remainderOperation}3`|残る|
|n09-q14-negative-integer|value|`n={value}`|残る|
|n09-q14-negative-remainder|sign|`r=-\sqrt{10}-(-4)=-\sqrt{10}\ {sign}\ 4`|残る|

### N10 r4

|node|直接slot|template|正答後行|
|---|---|---|---|
|n10-q01-square|rootSquare|`={rootSquare}t^2`|残る|
|n10-01|value|`t^2={value}`|残る|
|n10-q02-sign|value|`t={value}`|残る|
|n10-02|candidateSign|`5\sqrt5{candidateSign}0`|残る|
|n10-02|squareValue|`={squareValue}`|残る|
|n10-q03-expand|powerA, powerB|`=(\sqrt a)^{powerA}(\sqrt b)^{powerB}`|残る|
|n10-03|aValue, bValue|`={aValue}\,{bValue}`|残る|
|n10-q04-sign|relation|`\sqrt a\sqrt b\ {relation}\ 0`|残る|
|n10-q05-denominator|relation|`\sqrt b\ {relation}\ 0`|残る|
|n10-q05-square|numPower, denPower|`=\frac{(\sqrt a)^{numPower}}{(\sqrt b)^{denPower}}`|残る|
|n10-05|numerator, denominator|`\left(\frac{\sqrt a}{\sqrt b}\right)^2=\frac{ {numerator} }{ {denominator} }`|残る|
|n10-q06-sign|relation|`\frac{\sqrt a}{\sqrt b}\ {relation}\ 0`|残る|
|n10-q07-product|insideOperation|`\sqrt6\sqrt8=\sqrt{6{insideOperation}8}`|残る|
|n10-q07-product|inside|`=\sqrt{ {inside} }`|残る|
|n10-07|squareFactor|`48={squareFactor}\times\text{…}`|HIDE|
|n10-07|factor|`48=16\times{factor}`|残る|
|n10-q08-factor|coefficient|`\sqrt{16\times3}=\sqrt{16}\sqrt3={coefficient}\sqrt3`|残る|
|n10-q09-left|squareFactor|`8={squareFactor}\times\text{…}`|HIDE|
|n10-q09-left|coefficient|`\sqrt{8}=\sqrt{4}\sqrt2={coefficient}\sqrt2`|残る|
|n10-q09-right|squareFactor|`50={squareFactor}\times\text{…}`|HIDE|
|n10-q09-right|coefficient|`\sqrt{50}=\sqrt{25}\sqrt2={coefficient}\sqrt2`|残る|
|n10-q10-coefficients|coefficient|`2\sqrt2+5\sqrt2=(2+5)\sqrt2={coefficient}\sqrt2`|残る|
|n10-q11-formula|middleSign|`(A-B)^2=A^2\ {middleSign}\ 2AB+B^2`|残る|
|n10-11|leftSquare, rightSquare|`={leftSquare}-2\sqrt2\sqrt3+{rightSquare}`|残る|
|n10-q12-product|inside|`\sqrt2\sqrt3=\sqrt{2\times3}=\sqrt{ {inside} }`|残る|
|n10-12|constant|`=(2+3)-2\sqrt6={constant}-2\sqrt6`|残る|
|n10-q13-identity|operation|`(A+B)(A-B)=A^2\ {operation}\ B^2`|残る|
|n10-13|left, right|`={left}-{right}`|残る|
|n10-13|difference|`={difference}`|残る|
|n10-q15-factor|factor|`c={factor}`|残る|
|n10-15|numerator|`=\frac{ {numerator} }{2(\sqrt3)^2}`|残る|
|n10-q16-denominator|square|`2(\sqrt3)^2=2\times{square}`|残る|
|n10-q16-denominator|denominator|`=2\times{mirror:square}={denominator}`|残る|
|n10-q17-factor|factor|`(\sqrt3+\sqrt2)\bigl({factor}\bigr)`|残る|
|n10-q17-nonzero|relation|`\sqrt3-\sqrt2\ {relation}\ \sqrt2-\sqrt2`|残る|
|n10-17|productOperation|`\sqrt3{productOperation}c`|残る|
|n10-18|A, B|`={A}-{B}`|残る|
|n10-18|C|`={C}`|残る|
|n10-q19-distribute|secondOperand|`\sqrt3(\sqrt3-\sqrt2)=\sqrt3\times\sqrt3+\sqrt3\times({secondOperand})`|残る|
|n10-q19-distribute|productSign|`=\sqrt3\sqrt3{productSign}\sqrt3\sqrt2`|残る|
|n10-19|left, inside|`\sqrt3\sqrt3-\sqrt3\sqrt2={left}-\sqrt{ {inside} }`|残る|
|n10-q20-factor|factor|`(2+\sqrt3)\bigl({factor}\bigr)`|残る|
|n10-q20-factor|factorSign|`2-\sqrt3{factorSign}0`|残る|
|n10-20|power|`=\frac{(2-\sqrt3)^{power}}{(2+\sqrt3)(2-\sqrt3)}`|残る|
|n10-20|denominatorOperation|`=\frac{(2-\sqrt3)^2}{2^2{denominatorOperation}(\sqrt3)^2}`|残る|
|n10-q21-denominator|D|`4-3={D}`|残る|
|n10-q21-expand|P|`={P}-2\times2\times\sqrt3+(\sqrt3)^2`|残る|
|n10-q21-expand|K|`={mirror:P}-{K}\sqrt3+(\sqrt3)^2`|残る|
|n10-q21-expand|Q|`={mirror:P}-{mirror:K}\sqrt3+{Q}`|残る|
|n10-q21-constants|C|`={C}-4\sqrt3`|残る|

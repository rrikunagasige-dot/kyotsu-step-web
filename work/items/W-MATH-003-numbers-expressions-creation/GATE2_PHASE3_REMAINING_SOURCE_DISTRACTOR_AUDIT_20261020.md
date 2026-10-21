# W-MATH-003 Gate② Phase-3 — 原Word N04/N05/N06/N07 72問・228誤答候補の独立照合

Date: 2026-10-20 JST. **Status: 72 original markers cross-read (71 source-response PASS, 1 new cognitive FAIL); 228 wrong-choice options inspected, including 15 from original N04-Q01's five interactive local decisions. Gate② overall NOT CROSS-VERIFIED.**
Original source: teacher-edited Word 212,863 B SHA-256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa` and Pandoc-extracted source questions with surrounding instructions.
**Actual app source SHA** `61498366f2bed5324326e55d09b8f5c984a1a714` (P-004-R4 current, 8 review units; Draft PR #101). Every correctness/misconception reason below is an independent mathematics/source operation judgment against the original Word, **not a mechanical transcription of its coded answer**. Original separate publisher answer booklet unavailable.

## Cognitive-identity check for each original source prompt

The original Q01 in N04 is author-decomposed into **5** staged app decisions, each with one correct and three independently checked wrong alternatives. Every other original marker has one decision and three distractors. Therefore this matrix covers **72 source questions, 76 UI decisions and 228 wrong options**. Cases like `N04-Q04`, `N04-Q20`, `N06-Q07` and `N07-Q06` have some *mathematically equivalent or numerically true wrong answers* that fail because the **source explicitly demands an uncombined expansion, matched x-coefficient pairing, fully linear factorization, or minimum multiplier**. Never use pure expression equality to misclassify these as bad distractors.

| 原Word ID | Independently derived correct result/operation | Three authored wrong-choice failures in exact code order (N04-Q01: 5×3) | Finding |
| --- | --- | --- | --- |
| N04-Q01 | (5x+4y)²の四積は25x²,20xy,20xy,16y²。整理前は5組の個別判断 | 5個の操作それぞれ誤答3個（計15個）：係数積の誤り、x/yの次数誤り、交差積欠落、同類項の早すぎる統合。Q01最後の正しい整理前和は25x²+20xy+20xy+16y² | PASS |
| N04-Q02 | 20xy+20xy=40xy | 20xyは片側のみ／25xyは和の誤り／80xyは倍の倍数え | PASS |
| N04-Q03 | (5x+4y)²=25x²+40xy+16y² | 交差積半分／交差積無し／交差積符号逆 | PASS |
| N04-Q04 | (a+b)(a+b)=a²+ab+ba+b²、まだ4項で保持 | 交差積一組欠落／a²+2ab+b²は数値同値だが原問の「整理前の四項」を満たさない／交差積両方欠落 | PASS |
| N04-Q05 | a²+ab+ba+b²=a²+2ab+b² | ab片方欠落／交差の変数次数を壊す／平方差へのすり替え | PASS |
| N04-Q06 | (a−b)²=a²−ab−ba+b²（整理前） | baおよびb²符号逆／差を和へ／b²符号逆 | PASS |
| N04-Q07 | (a−b)²=a²−2ab+b² | 交差積符号逆／b²符号逆／交差積一組欠落 | PASS |
| N04-Q08 | (a+b)(a−b)=a²−ab+ab−b²=a²−b² | 交差積を足し合わせる／b²符号逆／相殺しない | PASS |
| N04-Q09 | (2a−5)²は差の平方(2a,5)、(3x−2)(3x+2)は和差の積(3x,2) | 第一公式の種類違い／第二公式の種類違い／両方の分離単位違い | PASS |
| N04-Q10 | (2a−5)²=4a²−20a+25、(3x−2)(3x+2)=9x²−4 | 中項半分／平方末項符号逆／中項符号逆 | PASS |
| N04-Q11 | (ax+b)(cx+d)=acx²+adx+bcx+bdの四項 | adxからx脱落／bcx項欠落／交差積係数をab,cdと誤る | PASS |
| N04-Q12 | acx²+(ad+bc)x+bd | 一次係数の積と和の混同／交差の組間違い／差へ変更 | PASS |
| N04-Q13 | 3x·2=6x、1·x=x、(3x+1)(x+2)=3x²+7x+2 | 一項を足さない／交差積一組を3xと誤る／交差積一組を2xと誤る | PASS |
| N04-Q14 | (T+c)²=T²+2Tc+c² | 中央係数不足／中央のc因子欠落／平方差へ | PASS |
| N04-Q15 | (a+b+c)²=a²+b²+c²+2ab+2ac+2bc | 二つの交差積欠落／交差積係数半分／2ab符号違い | PASS |
| N04-Q16 | (a+b−c)²=a²+b²+c²+2ab−2ac−2bc | c²符号逆／ab交差符号逆／ac交差符号逆 | PASS |
| N04-Q17 | 共通部分x²+1、逆符号部分x | 共通と逆符号部分が不一致／符号反転部分は1でない／逆符号部分は−1でない | PASS |
| N04-Q18 | (x²+1+x)(x²+1−x)=(x²+1)²−x² | 平方差を平方和へ／−x²を−xに／平方を未展開のまま扱わない | PASS |
| N04-Q19 | (x²+1)²−x²=x⁴+x²+1 | −x²を忘れる／中項計算誤り／定数符号逆 | PASS |
| N04-Q20 | (x+1)(x+4)=x²+5x+4、(x+2)(x+3)=x²+5x+6；一次係数5で一致 | (x+1)(x+2)等は全体積には同値だが一次係数3と7で一致しない／もう一つの組でも4と6に分かれ一致しない／定数項5は誤計算 | PASS |
| N04-Q21 | (T+4)(T+6)=T²+10T+24 | 10と24の位置交換／4×6を10と誤る／一次係数を2と誤る | PASS |
| N04-Q22 | T=x²+5xよりT²+10T+24=x⁴+10x³+35x²+50x+24 | 10T中の10x²欠落／交差項10x³を5x³と誤る／50xを欠落 | PASS |
| N05-Q01 | x(y+5)−3(y+5)の共通因数y+5 | x−3は共通でない／xy+5は共通でない／符号逆 | PASS |
| N05-Q02 | xT−3T=(x−3)(y+5) | −3を+3へ／y+5をy−5へ／xTのTを落とす | PASS |
| N05-Q03 | (x−3)(y+5)=xy+5x−3y−15 | −3y符号違い／定数−15の符号違い／定数−15欠落 | PASS |
| N05-Q04 | b−a=−(a−b) | 符号反転しない／和に変える／−a−bは違う | PASS |
| N05-Q05 | (a−b)x+(b−a)y=(a−b)(x−y) | 和x+yに誤る／a+bを因数とする／x−yの向き逆 | PASS |
| N05-Q06 | 16x²=(4x)²、9y²=(3y)² | 8xの平方は64x²／9yの平方は81y²／−3yは平方でない | PASS |
| N05-Q07 | (4x+3y)²中央=2×4x×3y=24xy | 交差積片側のみ／係数単純加算／文字まで平方扱い | PASS |
| N05-Q08 | 16x²+24xy+9y²=(4x+3y)² | 中央の符号逆／平方差／平方の底が16x+9yになる | PASS |
| N05-Q09 | (a+r)(a+s)=a²+(r+s)a+rs | 和と積を交換／差を採用／定数項rsをr+sと誤る | PASS |
| N05-Q10 | a²−6a−16：r+s=−6、rs=−16 | 和と積の交換／和の符号逆／積の符号逆 | PASS |
| N05-Q11 | −8+2=−6、−8·2=−16：(a−8)(a+2) | 0×?の積が合わない／和が+6／積が+16 | PASS |
| N05-Q12 | (px+q)(rx+s)=prx²+(ps+qr)x+qs | 交差係数pq+rsは違う／中央の差符号は違う／qr項欠落 | PASS |
| N05-Q13 | 元式4x²+7x+3と係数比較pr=4,ps+qr=7,qs=3 | 7と3の交換／交差積組を誤る／4と7の交換 | PASS |
| N05-Q14 | 候補A,B,Cの一次係数は順に8,7,13 | A/B順序逆／B/C順序逆／Cの交差積13→12 | PASS |
| N05-Q15 | (x+1)(4x+3)=4x²+7x+3 | 一次係数13／一次係数8／符号が不一致 | PASS |
| N05-Q16 | (5x+r)(x+s)の係数比較でs+5r=−2、rs=−3 | 和と積の目標を交換／5r因子欠落／積符号逆 | PASS |
| N05-Q17 | rs=−3<0だからr,s異符号 | 異符号なのに同符号とする／和−2だけから異符号とは決められない／両負なら積は正 | PASS |
| N05-Q18 | (x−1)(5x+3)=5x²−2x−3 | 一次係数と定数不一致／一次係数不一致／定数符号不一致 | PASS |
| N05-Q19 | 3a²b−12b³=3b(a²−4b²) | 共通のbを落とす／b³の次数を誤る／符号逆 | PASS |
| N05-Q20 | 3b(a²−4b²)=3b(a−2b)(a+2b) | 4bを2bに直さない／平方和に等しくならない／一因子をa²−2bと誤る | PASS |
| N06-Q01 | X=x+2yで(X+1)(X−2)−4 | 置換にyの符号違い／第二因子の符号違い／定数−4の符号違い | PASS |
| N06-Q02 | (X+1)(X−2)−4=X²−X−6 | X一次項の符号逆／定数項−6→+2／一次係数−1→−2 | PASS |
| N06-Q03 | X²−X−6=(X−3)(X+2) | 一次係数が+1／一次係数−5・定数−6／定数+6 | PASS |
| N06-Q04 | X=x+2yを両方に戻し(x+2y−3)(x+2y+2) | 一方にXが残る／符号変換の誤り／yの係数符号逆 | PASS |
| N06-Q05 | T=x²、x⁴−5x²+4=T²−5T+4 | T=xでは次数が違う／T⁴は元のx⁸／一次T項の符号逆 | PASS |
| N06-Q06 | T²−5T+4=(T−1)(T−4)→(x²−1)(x²−4) | 両因子の定数符号逆／積の係数がずれる／第二因子符号逆 | PASS |
| N06-Q07 | (x²−1)(x²−4)=(x−1)(x+1)(x−2)(x+2) | 二乗因子は原積と違う／(x−1)(x+1)(x²−4)は数値同値だが「一次式の積まで」が未完了／最後の因子がx²−2で不一致 | PASS |
| N06-Q08 | x次数3、y次数1、整理に選ぶ文字y | 次数は正しくても整理文字をxと誤る／次数を入れ替える／両方2次と誤る | PASS |
| N06-Q09 | 原式をy(x²+x−2)+(x³+x²−2x)へ | 末尾−2x欠落／y括弧中の符号逆／x²項の符号逆 | PASS |
| N06-Q10 | x³+x²−2x=x(x²+x−2) | 定数部分の符号逆／x次数を誤る／x一次項係数誤り | PASS |
| N06-Q11 | 共通因子x²+x−2を抽出：(x+y)(x²+x−2) | x−yは符号逆／共通二次式の一次符号逆／xy積は元の和に不一致 | PASS |
| N06-Q12 | x²+x−2=(x+2)(x−1)、全積(x+y)(x+2)(x−1) | 二次式の交差係数の符号逆／x+yをx−yへ／一次係数−1の因子 | PASS |
| N06-Q13 | x降べき順：x²+(3y−1)x+(2y²−3y−2) | 一次係数の符号違い／定数項の符号違い／次数順を崩し係数不一致 | PASS |
| N06-Q14 | 2y²−3y−2=(2y+1)(y−2) | 交差積符号不一致／定数符号不一致／係数不一致 | PASS |
| N06-Q15 | (2y+1)+(y−2)=3y−1＝原式のx係数3y−1 | 単純和3y+3は違う／誤って積を答える／yの係数不足。ただし選択する回答は3y−1のみで、係数が一致し因数分解に使えるという結論を選ばせていない | FAIL-C2 |
| N06-Q16 | (x+2y+1)(x+y−2)=x²+(3y−1)x+(2y²−3y−2) | 定数とx係数の符号不一致／定数不一致／xの一次係数を誤る | PASS |
| N07-Q01 | 3/4=0.75、百位で余り0になり有限 | 商の数字が不足／有限なのに無限循環と判定／桁位置を10分の1にずらす | PASS |
| N07-Q02 | 23÷11=2余り1；10÷11=0余り10、100÷11=9余り1 | 商と余りの順逆／余りの取り違え／次の商を0のまま | PASS |
| N07-Q03 | 23/11=2.090909…=2.\overline{09} | 0を落として2.999…へ／有限小数として終える／0と9の循環順が逆 | PASS |
| N07-Q04 | 0.75有限小数、2.\overline{09}循環小数、共に有理数 | 後者を無理数と誤る／後者を有限扱い／前者を循環と誤る | PASS |
| N07-Q05 | 整数の割算の非零余りはn−1種類、無限なら同じ余り再出現 | 商の数字が0/1に限るという虚偽／余りの有限性無視／無限循環を無理数と誤る | PASS |
| N07-Q06 | x=0.\overline8、最小倍率10で10x=8.\overline8 | 100倍の等式自体は真でも「最小倍率10」の要求と不一致／10倍しても数字を動かさない／無限小数を有限8.8と誤る | PASS |
| N07-Q07 | 10x−x=8→9x=8 | 小数部分を消せない／左辺差を10xのまま／右辺8を88と誤る | PASS |
| N07-Q08 | 9x=8→x=8/9 | 逆数9/8／8/10と誤る／88/9と誤る | PASS |
| N07-Q09 | x=0.\overline{69}は周期2、最小倍率100：100x=69.\overline{69}、99x=69 | 10倍は小数が揃わず9x=6も誤り／100x=69とし100x−xを忘れる／1000倍は最小でなく999x=696も誤り | PASS |
| N07-Q10 | 69/99=23/33（3で約分） | 69/100は元の循環と違う／23/99は約分違い／33/23は逆数 | PASS |
| N07-Q11 | 10^k=(2×5)^k=2^k5^k、kは正整数 | 積を和と混同／10kは累乗でない／2の指数2kは違う | PASS |
| N07-Q12 | 2≤a≤20で1/a有限小数⇔a=2^p5^q、列挙2,4,5,8,10,16,20 | 12には因子3を含む／15には因子3を含む（16欠落）／20を欠落 | PASS |
| N07-Q13 | a=2,b=3でa−b=−1、a/b=2/3、いずれも自然数でない | 差を+1と誤る／負数と非整数を自然数と誤る／商を3/2と誤る | PASS |
| N07-Q14 | 0.\overline{69}=23/33だから有理数 | 無限なら無理数と誤る／整数でなければ無理数と誤る／第2位で終わる有限小数ではない | PASS |

## F-036-C — confirmed new source-cognitive omission, no code edit approved

Original Word N06-Q15: “`得られた二因子の和を調べ、全体の因数分解に使えるか確かめよう。`” (from `2y²−3y−2=(2y+1)(y−2)`, target x-coefficient `3y−1`). Code's lead/prompt ask whether the sum matches: `二つの因子を足し、求めたい係数に一致するか答えよう。`; the **only selectable correct key is `3y−1`**, which does not require deciding *yes, matching target x coefficient*. Post-answer prose says “和も積も一致したので...” but the source requests this as an actual learner operation. Numerical math key valid; student decision omission **FAIL-C2**.

Combined with Phase-2 findings **F-036-A N08-Q10** (explain `|a|=0` by origin location) and **F-036-B N13-Q08** (write the two intermediate nonabsolute equations before final solutions), this gives **three confirmed cognitive omissions** after the previously approved P-004/R1/R2/R3/R4 repairs. These are new scope: only create exact correction proposal, do not silently change source lesson, distractors, progress, main or deployed app.

## Gate② cross-audit totals and limits

- Phase-2 51 original questions, 153 wrong alternatives; Phase-3 72 original questions and 228 wrong alternatives; **123/123 original prompts and 381/381 authored distractor entries inspected**. All **127** actual UI operations accounted for. **120 original question rows source-response PASS, 3 rows FAIL-COGNITIVE**, with all existing mathematical key values consistent with independently derived mathematics. This is a *candidate independent full-pass ledger*, not a Gate② PASS until the three corrective omissions receive approval, are fixed, their new correct+3 wrong strings independently checked, full real app+legacy regressions repeated, and no remaining cross-mode/preceding-text defect remains.
- 53 newly computed SymPy cases for N08/N11/N13/N14 and historical 48 independent math claims across units overlap the same question set; **do not count 53+48 as unique questions or as a full distinct 101 proofs**. The row-by-row original Word and 381 wrong-option inspection is the stronger source-cognitive evidence.
- Entire work Gate② **NOT CROSS-VERIFIED** until corrections and renewed cross-audit; Gate③ **NOT READY**, Draft PR #101 unmerged. Correction-first §12B: exact P-004-R5 proposal must be user-approved prior to learner code edits. Earlier approvals/Gate① review are preserved, no repeated one-by-one visual gates.

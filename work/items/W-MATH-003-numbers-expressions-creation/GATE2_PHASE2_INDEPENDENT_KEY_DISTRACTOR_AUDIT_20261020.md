# W-MATH-003 / Gate② Phase-2 — N08・N11・N13・N14 原Wordの原問対独立数学・全誤答監査

Status: **51 original question markers inspected; 49 SOURCE-RESPONSE PASS, 2 SOURCE-COGNITIVE FAIL; 153 authored wrong choices each independently considered. NOT a Gate② global PASS.**
Date: 2026-10-20 JST.
Original source: teacher-edited Word `/mnt/data/original_math.docx` (212,863 B, known SHA-256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`), cross-read with Pandoc source markdown. Exact audited **R4 app lesson code** SHA `61498366f2bed5324326e55d09b8f5c984a1a714`, Draft PR #101 feature branch. App `answer`, `wrong` and `prompt` read *fresh* from eight TypeScript modules, rather than relying on the earlier obsolete v1 answer inventory.
Method: (1) read each original `【Q】` prompt and surrounding expression/distance/infinity assumptions; (2) independently solve or prove from its original expression; (3) check the **author's one correct choice plus all 3 authored wrong options**, including composite responses that are wrong because of the *other* clause; (4) check that the learner answer itself actually performs the mathematical/cognitive operation demanded by the original; (5) distinguish math-key truth from source reasoning fidelity.
Calculational second opinion: Python/SymPy executed **53 independent named symbolic/real-set verification cases PASS=53/53** spanning N08/N11/N13/N14. Examples: solve `3(2x+3)≥10x−17`, `(x−2)/3≤2x+1`, `|x−1|=4`, `|3x−2|≤4`; boundary substitutions and alternative domain cases. **53 checks ≠ 53 complete question certificates.** The 51-row table below is separately Word-vs-current-code + each three distractors. No publisher's separate official solution booklet was supplied, so these are independent derivations, not publisher verification.

## Original problem × all 3 wrong-choice audit matrix

The '誤答1/2/3' column corresponds **in order** to the three current `wrong` array entries in app code on the frozen SHA. The correct mathematical computation appears separately, not inferred from the app's answer key. `FAIL-C` means correct numeric result but a demanded *student reasoning operation* is not selectable in the answer; these are **newly detected** and remain unfixed pending the ordinary CMD-WORK-001 correction approval.

| Source Q | Independently derived correct result or principle | Wrong choice 1 / 2 / 3 independent defect reason | Status |
| --- | --- | --- | --- |
| N08-Q01 | 原点との距離：\|2.3\|=2.3、\|−5\|=5 | 負距離／負距離／−5.0も負距離 | PASS |
| N08-Q02 | a≥0なら\|a\|=a | −aは一般には不一致／0はa>0で不一致／a²は一般に不一致 | PASS |
| N08-Q03 | a<0なら0−a=−a>0 | 符号誤り／a−0は負／0+aは負 | PASS |
| N08-Q04 | a=−5より−(−5)=5 | −5を答える／−5=5は偽／0を答える | PASS |
| N08-Q05 | 5<9、非負なので√5<3 | 5>9が偽／比較方向逆／5=9が偽 | PASS |
| N08-Q06 | √5−3<0 | 正は逆／0ではない／数の大小は判定可能 | PASS |
| N08-Q07 | \|√5−3\|=3−√5 | 負のまま／余分な負号／絶対値で和にはならない | PASS |
| N08-Q08 | π>3なので3−π<0 | πとの大小逆／同値扱い／大小比較可能 | PASS |
| N08-Q09 | \|3−π\|=π−3 | 負のまま／符号過剰／和へ変わらない | PASS |
| N08-Q10 | \|a\|=0 ⇔ a=0、数直線では原点にある | a>0は距離正／a<0は距離正／a=1は距離1。ただし選択正答に「原点」の説明がない | FAIL-C0 |
| N08-Q11 | ∀a、\|a\|=\|−a\| | 負号付けは一般に偽／厳密な>は偽／距離和=0は一般に偽 | PASS |
| N08-Q12 | ∀a∈R、\|a\|²=a² | \|a\|は一般にa²と異なる／−a²は一般に負／2aは恒等式でない | PASS |
| N11-Q01 | −1倍した2と5は−2>−5 | 方向逆／非等号を等号化／2を−2に変えていない | PASS |
| N11-Q02 | (b+c)−(a+c)=b−a：元の差と一致 | cが二重加算／−cが残る／差の順序逆 | PASS |
| N11-Q03 | b−a>0。c>0ならac<bc、c<0ならac>bc、c=0なら等号 | cの正負を逆扱い／cの符号に依存しないと主張／0倍で厳密不等号を残す | PASS |
| N11-Q04 | a<bを負の1/5倍→−a/5>−b/5、3−a>3−b | 両向き逆／後者逆／前者逆 | PASS |
| N11-Q05 | 3x−2<5の両辺に2を足すと3x<7 | −2を加える／方向逆／3を消去してしまう | PASS |
| N11-Q06 | 3x<7を正の3で割るとx<7/3 | −3で割りながら−xを失う／方向逆／厳密記号を≤にする | PASS |
| N11-Q07 | x=7/3では3x−2=5で5<5は偽 | 等号だから含むとする／3の正負は境界採否の根拠でない／実際に代入可能 | PASS |
| N11-Q08 | −2x+3≤5→両辺から3→−2x≤2 | +3なら左側も変化／不等号逆／−2xを+2xと誤記 | PASS |
| N11-Q09 | −2x≤2→負の2で割るとx≥−1 | 反転忘れ／正の2で割った式が不一致／閉境界を開境界へ | PASS |
| N11-Q10 | x=−1を元の式に代入すると5≤5で含む | 負数だから除くは誤り／5<5を混同／方向反転が不要という理由は不正確 | PASS |
| N11-Q11 | 3(2x+3)≥10x−17→−4x≥−26 | 方向逆／x係数の符号逆／右辺−26の符号逆 | PASS |
| N11-Q12 | −4x≥−26 ⇒ x≤13/2 | 向き逆／閾値の符号逆／境界を開く | PASS |
| N11-Q13 | (x−2)/3≤2x+1の両辺を正の3倍→x−2≤6x+3 | 方向逆／2xを6xにしない／負の3倍なのに反転なし・左側未変形 | PASS |
| N11-Q14 | x−2≤6x+3 ⇒ −5≤5x ⇒ x≥−1 | 向き逆／境界+1の誤り／境界を開く | PASS |
| N13-Q01 | \|x\|=5→x=5 または −5 | 片側だけ／反対片側だけ／両方を同時に満たすANDは不可 | PASS |
| N13-Q02 | \|X\|=4→X=4または−4 | 片側欠落／ANDで両値同時要求／4を±1と取り違え | PASS |
| N13-Q03 | \|x−1\|=4→x−1=4または−4 | x−1の1を早々に除く／符号をx+1へ変更／ORをANDに変更 | PASS |
| N13-Q04 | x−1=±4→x=5または−3 | 片側欠落／両値符号位置誤り／1の移項忘れ | PASS |
| N13-Q05 | \|x−1\|=x−1(x≥1)、1−x(x<1) | 左側でも負距離／左右の差を逆扱い／中心位置を−1と誤る | PASS |
| N13-Q06 | \|x+2\|=3→x+2=3または−3 | 2を移項せずx=±3／ANDで同時成立要求／中身をx−2へ改変 | PASS |
| N13-Q07 | x+2=±3→x=1または−5 | 片側欠落／平行移動の向き逆／片側解−1の誤り | PASS |
| N13-Q08 | \|3x\|=6→3x=6または−6→x=2または−2 | 6と−6は割る3前の値／解の片側欠落／係数3の消去誤り。ただし原問が求める「二つの等式」は選択回答にない | FAIL-C1 |
| N13-Q09 | \|x\|=0→x=0、\|x\|=負の数→実数解∅ | ±0は0と同値だが「負なら±2」が誤り／両分岐を逆／負の絶対値に解なし | PASS |
| N14-Q01 | \|x\|<3：原点との距離が3未満 | 上限を下限に逆転／座標xと距離\|x\|の混同／境界を含める | PASS |
| N14-Q02 | \|x\|=3となる境界は−3と3 | 左境界0が誤り／右境界0が誤り／両端3と6は距離不一致 | PASS |
| N14-Q03 | \|x\|<3：二点間・境界を除く | 外側を選ぶ／境界を含む／両方誤り | PASS |
| N14-Q04 | −3<x<3 | 内外逆／境界等号を含む／逆順の連立範囲は空 | PASS |
| N14-Q05 | \|x\|≥4：境界±4、外側、両端を含む | 内側誤り／等号を落とす／境界の片側が0に変化 | PASS |
| N14-Q06 | x≤−4またはx≥4 | 内側集合／端点を除外／ANDでは同時成立不可 | PASS |
| N14-Q07 | a>0で\|X\|<a ⇔ −a<X<a | 外側集合／非厳密境界／a>0で上下が逆 | PASS |
| N14-Q08 | a>0で\|X\|>a ⇔ X<−a または X>a | 内側集合／等号を付ける／ANDでは同時成立不可 | PASS |
| N14-Q09 | \|x−3\|<5 ⇒ −5<x−3<5 | 外側集合／等号が増える／x−3の3を先に誤削除 | PASS |
| N14-Q10 | 三辺に3を足して−2<x<8 | −3は逆操作／境界等号の付与／左境界−5のまま | PASS |
| N14-Q11 | \|x+3\|≥2 ⇒ x+3≤−2 または x+3≥2 | 内側集合／等号欠落／ORをANDに変更 | PASS |
| N14-Q12 | x≤−5 または x≥−1 | 内側集合／等号欠落／+3の移項符号誤り | PASS |
| N14-Q13 | \|3x−2\|≤4 ⇒ −4≤3x−2≤4 | 外側集合／厳密境界へ変更／−2を先に消す | PASS |
| N14-Q14 | 三辺に2を足して−2≤3x≤6 | −2を加える／境界等号を落とす／右端+2を忘れる | PASS |
| N14-Q15 | 三辺を正の3で割って−2/3≤x≤2 | 境界を開く／両端の÷3を忘れる／負の3で割ると言いながら符号処理が不一致 | PASS |
| N14-Q16 | x=−2/3で\|−4\|=4、x=2で\|4\|=4：両端とも含む | \|−4\|を−4とする／左端代入が元の式と不一致／右端代入が元の式と不一致（各単純恒等式は真でもこの問いへの解答ではない） | PASS |

## Confirmed outside-prior-approved-scope findings

**F-036-A / N08-Q10**: Source literally requires “`|a|=0になるのはどんなときか。数直線上の意味で説明しよう。`”. Current learner prompt only `aの値の条件を選ぼう。`, key only `a=0`. Pre-answer lead asks the location but does not make the learner choose/write that reasoning; origin explanation appears only as a post-error hint / post-answer prose. The original asks for **both value and location-based why**. Mathematical key PASS, source-cognitive selection FAIL.

**F-036-B / N13-Q08**: Source explicitly “`絶対値を使わない条件にし、解を求めよう。`” for `|3x|=6`. Current lead tells learner to split into two positive/negative equations; prompt `二つの解を選ぼう。`, correct response only `x=2 または x=−2`. **No student selection/derivation of `3x=6 または 3x=−6`**. This collapses source-requested intermediate reasoning while the final solutions remain correct. Source-cognitive selection FAIL.

The two fails are from four audited units; a separate full Word comparison of the other four units flagged **N06-Q15** as the same missing-verification cognitive pattern (`(2y+1)+(y−2)=3y−1`, but source requires checking that it matches the target x-coefficient and whether it can be used). That **third** out-of-batch finding must be recorded as F-036-C and treated within the same complete impact-sweep before repair; not included in 51 status count.

**RISK, not elevated to FAIL without context:** N11-Q02 key `b−a` itself expresses unchanged difference, whereas original additionally asks to compare to the prior difference. Previous paragraph clearly establishes original `b−a`, and after-answer text states invariance. Treat sufficient mathematically pending pedagogy review, do not inflate confirmed defect count.

## Gate state and protection

- Independently audited **51 of 123** original question markers here, and **153 of 381** authored wrong choice entries corresponding to their three `wrong` options. N04-Q01 contributes four extra local choices and has its own historic staged questions, so app has 127 decisions rather than 123. Remaining source units N04/N05/N06/N07 = 72 source markers not counted as complete source-response-and-all-distractor passes in this matrix.
- The previous independent 48 SymPy checks in `GATE2_INDEPENDENT_ALGEBRA_CHECKPOINT_20261020.md` are retained separately; their coverage overlaps Phase-2 and **must not be summed** as distinct certified questions.
- Findings are **not** a license to edit the source or learner code. No feature files, original Word, figures, progress migration, main, PR publish state changed in this audit. Existing approvals P-004/R1/R2/R3/R4 and user review of visual snapshots remain preserved.
- **Gate② NOT CROSS-VERIFIED** due confirmed source-cognitive discrepancies and 72 remaining source markers plus every remaining distractor; **Gate③ NOT READY**. Follow existing fix-first §12B: finish impact sweep → exact correction proposal → separate user approval → narrowly repair / regress → resume the remaining independent audit.

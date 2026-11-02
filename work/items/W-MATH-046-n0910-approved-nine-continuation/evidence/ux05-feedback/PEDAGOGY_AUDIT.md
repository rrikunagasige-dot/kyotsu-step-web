# W046 — 学習水準と主判断の再監査

**分析のみ。新しい巨大な実装提案書ではない。** N09全41/N10全45nodeと未実装UX04詳細案を読取確認した。製品・正本文書・Git・Storeの変更、新テストは行っていない。

## 結論

主たる概念判断を既に完成してから易しい操作を細分化する逆転がある。零積の因子条件を中心に再検討する。一方、必要な計算・比較・定義域・正性・非零・値保持・既習関係の初回適用を一律に削除しない。

写真のn09-01で不足しているのは、(x−4)(x＋4)=0から「どちらの因子が0になる条件か」を生徒が導く活動である。既にx−4=0とx＋4=0を印字してorだけを問うのでは足りない。一方、そこからx=±4を得る基本的な加減の符号を個別に選ばせる必要は薄い。主判断の弱さを、小さな穴の数で埋めてしまった。

## 根拠と境界

- MASTER§8：単純な数字当ては不適切。ただし、初めて関係式を使う計算をarithmeticだからと消さない。
- MASTER§11：必要な途中式は見せ、学習価値のある判断だけinteractiveにする。見える途中式の数と穴の数を連動させない。
- MASTER§52–53／数学SPEC§5：非自明な学習操作が単位。高校初学・習得直後であることを考慮し、既習の加減・累乗・分配を毎例題で初等クイズへ戻さない。
- **N09-Q08の平方計算・比較はMASTER§53の具体的な既存要件として保持する。** 難易度への指摘を理由に既存の正しい計算を機械的にREMOVEしない。
- 公式過去問との照合は親担当の実見結果。ここでは認知単位の参考とし、例題を入試問題へ置き換えたり、単純に難化したりしない。
- 定義、最初の手本、確定後のまとめは穴が無くてもよい。計算行を残すことと、一つずつ選択させることは別である。

## 同型候補とKEEP境界

### N09-A — REPLACE_WITH_MAIN_JUDGMENT

対象：`n09-01`

- 主判断：零積から二つの一次式の条件を生徒が導く。さらにその場合分けが全解を尽くすことを理解する。
- 不足／過細分化：現行zeroLogicはx−4=0とx＋4=0を先に完成表示し、「または」だけを選ばせる。本来の主判断の大半をシステムが既に行っている。一方、両辺に16/4を加減する操作が独立穴となり、主判断より重い。
- 維持する境界：因数分解自体の適用と零積の論理を残す。x²−16=(x−4)(x＋4)を使う根拠と、各一次式から得る±4は途中式として見せる。
- 避けること：易しい逆演算を消す代わりに零積の式までAUTOにしない。±4は既出だから書かせない、という理由で「全解を尽くす推論」まで省略しない。
- 未実装UX04案：balanceOperation・leftInverseOperation・rightInverseOperationは非採点の途中式へ。factorSignは補助の因数分解適用として残せるが主眼ではない。zeroLogicは新しい因子条件の構成へ置換候補。

| node / key | 監査候補 | 理由 |
|---|---|---|
| `n09-01` / `balanceOperation`, `leftInverseOperation`, `rightInverseOperation` | REDUCE_TO_WORKED_STEPS | 中高生が既習の等式の加減。3つの記号を別の主判断にしない。 |
| `n09-01` / `factorSign` | KEEP_SUPPORTING_APPLICATION_OR_COMBINE | 平方差の因数分解は必要。符号1文字の容易さを教材の核心と取り違えない。 |
| `n09-01` / `zeroLogic` | REPLACE_MAIN_CONDITION_WITH_NEW_KEY | 二因子が0になる条件全体、例「x−4=0 または x＋4=0」を積から生成/選択させる。現行のorだけの記録を新しい判断へ流用しない。 |

### N09-B — COMPRESS_EASY_SUPPORT

対象：`n09-q01-negative`, `n09-q02-negative-square`, `n09-q03-inside`, `n09-03`

- 主判断：負号を含む基底と累乗の範囲、平方根の非負性を区別して計算する。
- 不足／過細分化：powerAction→積の符号＋→値16という三つを同等の導出として数えると、基本的な符号演算へ偏る。同じ(-4)²=16の再入力もある。
- 維持する境界：(-4)²と−4²の混同、(-√5)²の平方根定義の適用、√((-4)²)=4で−4を採らない判断は残す。必要な計算まで一律に消さない。
- 避けること：高校生だから負号・根号の誤解が無いと決めつけない。初回の作用範囲確認と、その後の同一計算の写し直しを区別。
- 未実装UX04案：signMultiplier=-1、productSign=+、squaringRule、同じ因子を2回掛ける説明は、基礎補助として統合/参照候補。rootFactorSquareやfirstOperationは実際に新しい定義適用/入れ子解釈を問う場合に残し、既存結果の再入力にしない。

| node / key | 監査候補 | 理由 |
|---|---|---|
| `n09-q01-negative` / `productSign` | REDUCE_SEPARATE_BASIC_SIGN | 同じ問題での負×負の＋だけを独立した主判断にしない。 |
| `n09-q01-negative` / `powerAction`, `value` | KEEP_SCOPE_AND_REQUIRED_RESULT_WITH_OPTION_TO_COMBINE | 作用範囲と必要な平方値。両者を残すなら異なる誤解を診断する理由を明記し、定義の言い換えだけを重ねない。 |
| `n09-q02-negative-square` / `signFactor`, `value` | REVIEW_AS_WHOLE_SIGNED_ROOT_APPLICATION | (-1)²=1と1×5を別々の主判断にするより、負号込みの平方と(√5)²=5を使う計算へ焦点。問いを変えるなら旧keyを転用しない。 |
| `n09-q03-inside` / `value` | REDUCE_REPEATED_16_TO_REFERENCE | 同じ(-4)²は同じ解法内の確定結果として再利用。 |
| `n09-03` / `value` | KEEP_NONNEGATIVE_ROOT_JUDGMENT | 平方が16でも根号の値は4であり−4ではない。これは基本的だが本単元の概念である。 |

### N09-C — REPLACE_FRAGMENTED_SUPPORT_WITH_ABSOLUTE_VALUE_CASE

対象：`n09-q04-nonnegative`, `n09-q04-negative`, `n09-04`, `n09-05`, `n09-q06-squares`, `n09-q06-order`, `n09-06`, `n09-q07-negation`, `n09-07`

- 主判断：√(a²)=|a|の条件付きの使い分け。2−√5の符号を判断し、絶対値を外すとき差全体をどう扱うか。
- 不足／過細分化：-a>0、両辺に加える−√5、右辺0、負号の乗数−1、第二項−√5、第一項−2、第二項の＋を全て別々に問うと、核心の条件判断より既習の記号操作が大きい。scopeはleadが「差全体」と答えているため写しにもなる。
- 維持する境界：非負/負の場合分け、負のとき√(a²)=−a、非負範囲で平方比較して2<√5とする根拠、2−√5<0から差全体の符号を反転する判断を保持。
- 避けること：平方比較を省き根号式の符号を断定しない。必要な分配式・計算行は残す。
- 未実装UX04案：新signedSquareMethod・outsideFactor・secondOperand等の基礎分配の細分化は抑え、nonnegativeActionのような絶対値の主判断と必要な式整理へ集約候補。

| node / key | 監査候補 | 理由 |
|---|---|---|
| `n09-q04-nonnegative` / `value` | KEEP_CASE_CONDITION | a≥0の範囲全体で根号を評価する主判断。 |
| `n09-q04-negative` / `oppositeSign` | REDUCE_IF_USED_AS_ROUTINE_EVIDENCE | a<0から−a>0は必要な根拠として提示できる。主判断は非負の平方根の選択。 |
| `n09-q04-negative` / `value` | KEEP_NEGATIVE_CASE | aではなく−aとなる理由が本単元の重要点。 |
| `n09-05` / `value` | KEEP_ABSOLUTE_VALUE_GENERALISATION | 二つの場合を|a|に統一する表現。 |
| `n09-q06-squares` / `value` | KEEP_NECESSARY_COMPARISON_WORKING_NOT_MULTIPLY_MICRODRILLS | 4と5の比較の入力となる平方値は必要。ただし2×2のような補助を別の連続クイズに増やさない。 |
| `n09-q06-order` / `relation` | KEEP_NONNEGATIVE_SQUARE_COMPARISON | 平方の大小を元の正の数へ戻す根拠を使う。 |
| `n09-06` / `addend`, `zero` | REPLACE_WITH_DIFFERENCE_SIGN_OR_WORKED_SUPPORT | 主結果2−√5<0を導かせる。足す数と同数差0は途中式へ残し、単独加点を重ねない。 |
| `n09-q07-negation` / `scope` | REPLACE_ABSOLUTE_VALUE_CASE_WITH_NEW_KEY | 差を写すより、符号に基づき差全体を反転する判断。 |
| `n09-07` / `outsideFactor`, `secondOperand`, `left`, `sign` | CONSOLIDATE_EXISTING_DISTRIBUTION_INTO_REQUIRED_SIMPLIFICATION | N08の既習分配を必要な途中式で示し、外の負号が全体に作用した正しい整理結果を問う。全ての易しい符号を独立穴にしない。 |

### N09-D — KEEP_ACCEPTED_CALCULATION_COMPARISON_COMPRESS_NEW_MICROSTEPS

対象：`n09-decimal-method`, `n09-p001-q08-left-square`, `n09-p001-q08-right-square`, `n09-p001-q08-lower-sign`, `n09-p001-q08-upper-sign`, `n09-08`, `n09-09`

- 主判断：1.41²と1.42²を計算し、平方2を挟んだ結果を√2の範囲へ戻す。
- 不足／過細分化：未実装UX04の分数平方の作用、分配の＋、交差積一つ、交差項の個数2を逐一追加すると、N08既習の式展開が改めて初等クイズ化する。
- 維持する境界：MASTER§53がN09-Q08の平方計算と1.9881<2、2<2.0164の比較を明示する。L1/L2/L3、R1/R2/R3、C/Dと元の根号への大小判断を機械的に削除しない。補助値は参照。
- 避けること：易しいという一語で既承認の数値計算と比較をAUTOに戻さない。入試問題へ置換しない。
- 未実装UX04案：fractionSquareAction・outerJoinの＋・crossCoefficientの2を全部追加する案は圧縮。平方公式の実際の適用として中項の因子構成を問う場合は残し、右側では支援を減らす。

| node / key | 監査候補 | 理由 |
|---|---|---|
| `n09-p001-q08-left-square` / `L1`, `L2`, `L3` | KEEP_REQUIRED_CALCULATION_AND_DECIMAL_CONVERSION | 既存§53の具体的対象。導出の骨格を与える/適用させることと、必要な数値計算を残すことを区別。 |
| `n09-p001-q08-right-square` / `R1`, `R2`, `R3` | KEEP_CALCULATION_TRANSFER | 同じ方法の数値の異なる転移。左と同じ補助説明を全再演しない。 |
| `n09-p001-q08-lower-sign` / `C` | KEEP_EXPLICIT_COMPARISON | §53で左の平方と2の比較を明示。 |
| `n09-p001-q08-upper-sign` / `D` | KEEP_EXPLICIT_COMPARISON | §53で2と右の平方の比較を明示。 |
| `n09-09` / `lowerRelation`, `upperRelation` | KEEP_ROOT_INTERVAL_INFERENCE | 数値比較とは別に、非負性を用いて元の根号の範囲へ戻す。二つを一連の判断として提示できる。 |

### N09-E — FOCUS_ON_FLOOR_DEFINITION_AND_NEGATIVE_COUNTEREXAMPLE

対象：`n09-parts-target`, `n09-q10-reject-truncation`, `n09-10`, `n09-q11-remainder`, `n09-11`

- 主判断：整数部分は桁の切取りではなくn≤x<n＋1。負の数ではn=−2が不適合で、n=−3、r=0.9となる理由。
- 不足／過細分化：x=n+rから両辺へ−n、範囲へ+n、−(−2)の＋だけをそれぞれ独立採点しても主概念には近づかない。
- 維持する境界：定義と等価な条件、誤候補の残り−0.1、0≤r<1の照合、正しいnと残りの必要計算を保持。
- 避けること：定義そのものを未知語クイズにしない。rの範囲の根拠まで無くさない。
- 未実装UX04案：isolateOperation・intervalShift・removeBracketsOperationは非採点の途中式へ。admissibilityのような定義への適合は主判断候補として残す。

| node / key | 監査候補 | 理由 |
|---|---|---|
| `n09-q10-reject-truncation` / `value` | KEEP_COUNTEREXAMPLE_CALCULATION | −0.1は誤った切取りを棄却する根拠。易しい計算でもここで意味を持つ。 |
| `n09-10` / `n` | KEEP_INTEGER_PART_DEFINITION_APPLICATION | 負の数で−3を選ぶ主概念。 |
| `n09-q11-remainder` / `sign` | REDUCE_BASIC_MINUS_NEGATIVE_SUPPORT | 必要な符号処理は見せるが、単独＋穴を主判断として数えない。 |
| `n09-q11-remainder` / `value` | KEEP_REMAINDER_APPLICATION | r=0.9を求め、0≤r<1に合うか確かめる。 |

### N09-F — KEEP_INTERVAL_REASONING_NO_EXTRA_BASIC_MULTIPLIER

対象：`n09-q12-lower`, `n09-q12-upper`, `n09-12`, `n09-q13-reverse`, `n09-13`

- 主判断：√10を隣接整数で挟み、負号で区間の順序が逆になることを使う。
- 不足／過細分化：未実装commonMultiplier=−1を追加し、さらに両不等号と両端を全て独立した新判断に数えるのは過剰。
- 維持する境界：平方値9/16という必要計算、非負の平方比較、負の乗法での不等号方向、増加順の区間を保持。
- 避けること：負号を付けるだけで端点の大小を変えない誤解を放置しない。
- 未実装UX04案：commonMultiplierは与えた目標に必要な基本操作として参照。既存S1/S2とleft/rightは一連の区間変換として扱い、二つの境界を別の対象として問う意味がある場合だけ分割。

| node / key | 監査候補 | 理由 |
|---|---|---|
| `n09-q12-lower` / `value` | KEEP_NECESSARY_BOUND_CALCULATION | 3²=9は根号10を挟む根拠。 |
| `n09-q12-upper` / `value` | KEEP_NECESSARY_BOUND_CALCULATION | 4²=16はもう一方の根拠。余計な3×3/4×4の操作選択を増やさない。 |
| `n09-12` / `lower`, `upper` | KEEP_NONNEGATIVE_INTERVAL_INFERENCE | 平方比較から√10の範囲を導く。 |
| `n09-q13-reverse` / `S1`, `S2` | KEEP_NEGATIVE_INEQUALITY_RULE_AS_LINKED_TASK | 二つの境界を反転させる主規則。leadに答えを先書きしない。 |
| `n09-13` / `left`, `right` | KEEP_OR_COMBINE_INCREASING_INTERVAL_REPRESENTATION | 負の大小の並びを正しく表す。端点の単なる写しにならない問いにする。 |

### N09-G — REPLACE_OPERATOR_ONLY_WITH_SYMBOLIC_REMAINDER_APPLICATION

対象：`n09-q14-positive-integer`, `n09-q14-positive-remainder`, `n09-q14-negative-integer`, `n09-q14-negative-remainder`, `n09-14`

- 主判断：±√10の整数部分と小数部分を定義から構成し、残りが0以上1未満である理由を示す。
- 不足／過細分化：残りの式の−/＋だけ、各辺への−3/＋4、二項の順交換の説明を全て独立採点すると、条件に基づく整数・小数部分の理解より基本操作へ偏る。
- 維持する境界：正の整数部分3と負の整数部分−4の違い、r=√10−3とr=4−√10、残りの範囲の根拠は保持。
- 避けること：負の整数部分を正の整数部分の単なる符号反転にしない。区間での保証を省かない。
- 未実装UX04案：intervalTranslationとreorderActionの個別穴は圧縮。remainderOperation/signは完成した残りの式を自力で作る主判断へ置換候補。

| node / key | 監査候補 | 理由 |
|---|---|---|
| `n09-q14-positive-integer` / `value` | KEEP_FLOOR_APPLICATION | 定義から整数部分を選ぶ。 |
| `n09-q14-negative-integer` / `value` | KEEP_NEGATIVE_FLOOR_APPLICATION | −3でなく−4となる本質的判断。 |
| `n09-q14-positive-remainder` / `remainderOperation` | REPLACE_WITH_REMAINDER_EXPRESSION_NEW_KEY | −記号だけではなく、定義と認定整数部分からrの式を構成させる。 |
| `n09-q14-negative-remainder` / `sign` | REPLACE_WITH_SIGNED_REMAINDER_EXPRESSION_NEW_KEY | ＋記号だけでなく、負の整数部分を引く意味を含むr=4−√10という式へ。新しい学習行為へ旧＋回答をaliasしない。 |

### N09-H — KEEP_DEFINITION_REFERENCE_AND_SUMMARY

対象：`n09-q01-positive`, `n09-definition`, `n09-q02-root`, `n09-02`, `n09-boundary`

- 主判断：平方根の定義、根号が非負の一数を表すこと、境界0/負数の扱いを導入する。
- 不足／過細分化：AUTO nodeがあること自体を不足と判定しない。最初の手本・定義・前段のまとめを全部穴にする理由はない。
- 維持する境界：最初の正の平方の手本、定義・境界、√16=4で正の根号を選ぶ判断、前段の確定結果のまとめ。
- 避けること：未習の語を当てさせたり、定義を発見問題のふりで隠さない。
- 未実装UX04案：対象外の問いと数学を維持。過剰な穴を追加しない。

| node / key | 監査候補 | 理由 |
|---|---|---|
| `n09-q02-root` / `value` | KEEP_ROOT_DEFINITION_APPLICATION | ±4のうち根号の非負の値4を選ぶ。 |

### N10-A — KEEP_ROOT_IDENTIFICATION_COMPRESS_ROUTINE_ISOLATION

対象：`n10-q01-square`, `n10-01`, `n10-q02-sign`, `n10-02`

- 主判断：候補t√5の平方を用い、t>0から値を選び、正性と平方値の両方で√125と同定する。
- 不足／過細分化：未実装tSquareFactor=t²やisolationDivisor=5を追加しても、既習の累乗や係数除去の細分化になりやすい。
- 維持する境界：√5の平方5、125÷5=25、t²=25とt>0からt=5、候補の正性・平方125・同定理由は維持。
- 避けること：本人が肯定した√125の正性→平方→同定理由を全て消して完成公式の選択へ戻さない。
- 未実装UX04案：isolationDivisorはx+4=0の逆演算と同型の削減候補。t²の指数化は途中式で参照し、必要な平方計算や根の符号選択を残す。

| node / key | 監査候補 | 理由 |
|---|---|---|
| `n10-q01-square` / `rootSquare` | KEEP_ROOT_DEFINITION_CALCULATION | 候補の平方値へ根号の定義を適用する。 |
| `n10-01` / `value` | KEEP_NECESSARY_EQUATION_RESULT | t²=25を得る必要計算。5で割る記号をさらに別の主判断にしない。 |
| `n10-q02-sign` / `value` | KEEP_POSITIVE_CANDIDATE_CHOICE | t²=25だけでは±5。t>0を使う条件判断。 |
| `n10-02` / `candidateSign`, `squareValue`, `identificationReason` | KEEP_ACCEPTED_EVIDENCE_AND_IDENTIFICATION | 正性だけ/平方値だけでは足りないことを含む本単元の核心。これ以上因子の基本計算へ細分化しない。 |

### N10-B — KEEP_PRODUCT_PROPERTY_CONSTRUCTION

対象：`n10-q03-expand`, `n10-03`, `n10-q04-sign`, `n10-04`

- 主判断：候補√a√bの平方と正性から、積の性質を定義で構成する。
- 不足／過細分化：指数2を二か所別々に埋める基本的支援は主判断より補助。さらに単一の因子の読取りや2回掛ける操作まで分けると過剰。
- 維持する境界：平方ab、候補の正性、正の平方根の一意性という本人が肯定した構成を保護。公式そのものの選択だけにしない。
- 避けること：難度調整を理由に平方・符号の根拠をAUTO化して完成式だけ問わない。
- 未実装UX04案：protected KEEP群。powerA/powerBを一組の構成として圧縮する余地はあるが、根号因子a/bの定義適用とrootReasonは保持。

| node / key | 監査候補 | 理由 |
|---|---|---|
| `n10-q03-expand` / `powerA`, `powerB` | KEEP_AS_CONSTRUCTION_PAIR_OR_COMPRESS_ROUTINE_EXPONENTS | 二因子に平方が作用する組立て。指数2の反復を二つの別概念とは数えない。 |
| `n10-03` / `aValue`, `bValue` | KEEP_DEFINITION_APPLIED_TO_TWO_PARAMETERS | 候補の平方がabになる根拠を作る。 |
| `n10-q04-sign` / `relation` | KEEP_NEEDED_POSITIVITY_CONDITION | 平方の一致だけでなく正の候補である証拠。 |
| `n10-04` / `rootReason` | KEEP_MAIN_IDENTIFICATION_REASON | 正性と平方の一致が両方必要。 |

### N10-C — KEEP_QUOTIENT_DOMAIN_AND_CONSTRUCTION

対象：`n10-q05-denominator`, `n10-q05-square`, `n10-05`, `n10-q06-sign`, `n10-06`

- 主判断：分母非零で商が定義できること、商の平方a/bと正性から正の平方根を同定する。
- 不足／過細分化：numPower/denPowerの二つの指数2を増やし続けるのは不要だが、分母に平方が作用することと分母0の禁止は同じではない。
- 維持する境界：分母非零、平方a/b、正性、同定理由。必要な上下の計算を保護。
- 避けること：分母非零を単なる簡単な≠0だからという理由で捨てない。これは定義域の核心。
- 未実装UX04案：protected KEEP群。既存の商の構成を維持し、基本累乗操作の新たな重複穴だけを避ける。

| node / key | 監査候補 | 理由 |
|---|---|---|
| `n10-q05-denominator` / `relation` | KEEP_DOMAIN_CONDITION | 商を作れる前提が必要。 |
| `n10-q05-square` / `numPower`, `denPower` | KEEP_OR_COMBINE_FRACTION_SQUARE_CONSTRUCTION | 上下への平方の作用。二つの2という数の記憶を別採点目的にしない。 |
| `n10-05` / `numerator`, `denominator` | KEEP_NEEDED_DEFINITION_CALCULATION | 平方a/bを自分で確定する。 |
| `n10-q06-sign` / `relation` | KEEP_POSITIVITY_EVIDENCE | 正の平方根の同定に必要。 |
| `n10-06` / `quotientReason` | KEEP_MAIN_DOMAIN_AND_ROOT_REASON | 商の存在と正の平方根であることを区別する。 |

### N10-D — KEEP_FIRST_USE_STRATEGY_AND_CALCULATION

対象：`n10-q07-product`, `n10-07`, `n10-q08-factor`, `n10-08`

- 主判断：証明した積の性質を初めて具体的計算へ使い、最大の平方因子で根号を簡単にする。
- 不足／過細分化：×の穴という形だけで初等的と判定すると、直前に学んだ関係式の初回適用を消してしまう。
- 維持する境界：insideOperation/inside、最大平方因子16、残り3、外の係数4と確定後のまとめを保持。
- 避けること：平方因子4も有効な途中分解であることを認め、最大という指定と数学的正しさを区別。
- 未実装UX04案：新たな手数を増やさず現行の主判断と必要計算を維持。

| node / key | 監査候補 | 理由 |
|---|---|---|
| `n10-q07-product` / `insideOperation`, `inside` | KEEP_FIRST_USE_OF_PROVED_RELATION | MASTER§8の「初めて関係式を使う計算」。単なる掛け算記号当てと同一視しない。 |
| `n10-07` / `squareFactor`, `factor` | KEEP_FACTORISATION_STRATEGY_AND_COMPLETION | 最大平方因子の選択と残りの因子の算出。 |
| `n10-q08-factor` / `coefficient` | KEEP_RADICAL_SIMPLIFICATION | 平方因子を根号の外へ出す実際の適用。 |

### N10-E — KEEP_LIKE_RADICALS_CONSOLIDATE_LOCAL_FACTOR_WORK

対象：`n10-q09-left`, `n10-q09-right`, `n10-09`, `n10-q10-coefficients`, `n10-10`

- 主判断：各項を同じ根号へ直し、共通因子を持つ項として加算する。
- 不足／過細分化：4→残り2→係数2、25→残り2→係数5の全てを等しく独立した主要判断とすると基本小問が連続する。
- 維持する境界：平方因子での分解と係数算出は必要。残り因子と係数が偶然同じ2でも別の数学的役割。共通する√2を見抜く主判断と係数7の計算は保持。
- 避けること：根号内を足して√58とする誤解を見落とさない。必要計算を一律削除せず、局所的な分解の一課題へまとめる。
- 未実装UX04案：remainingFactorUX04は数学的に必要な計算だが、独立大問化の必要性を再判定。commonFactorUX04は根号の和の主判断として残す候補。

| node / key | 監査候補 | 理由 |
|---|---|---|
| `n10-q09-left` / `squareFactor`, `coefficient` | KEEP_LOCAL_SIMPLIFICATION_OR_COMBINE_PARTS | 根号の簡単化の方針と係数。 |
| `n10-q09-right` / `squareFactor`, `coefficient` | KEEP_TRANSFER_WITH_LESS_SUPPORT | 左と同じ手順を右へ適用。全ての基本手順の説明を繰り返さない。 |
| `n10-q10-coefficients` / `coefficient` | KEEP_REQUIRED_LIKE_TERM_SUM | 共通の√2を保った加法の値を求める。 |

### N10-F — REPLACE_OVERBUILT_REPROOF_WITH_IDENTITY_APPLICATION

対象：`n10-q11-formula`, `n10-11`, `n10-q12-product`, `n10-12`

- 主判断：既習の差の平方を根号の式へ適用し、中項の符号・係数と根号の積を正しく処理する。
- 不足／過細分化：UX04のsignedSecond、二つのcrossProduct、crossSign、lastSign、crossMultiplicityの六段階は、N08既習の分配をこの例題で初学同様に再教授する形。四積を見せることと六つ全てを採点することは別。
- 維持する境界：差の平方の中項を正しく構成する判断、(√2)²/(√3)²の値、√2√3の計算、定数部分の整理を残す。
- 避けること：完成公式の文字列当てだけへ戻さない。A/Bの対応と中項の符号込みの係数など、実際の適用を本人に行わせる。
- 未実装UX04案：六つの新partは一つ/少数の中項構成へ集約候補。rootFreePairのような見えている2と3の読取りを追加するより、必要な式全体の整理へ焦点。

| node / key | 監査候補 | 理由 |
|---|---|---|
| `n10-q11-formula` / `middleSign` | REPLACE_WITH_MAIN_SIGNED_CROSS_TERM_APPLICATION | −だけで2ABの対応を全て与えるのも弱い。例えば符号込みの中項係数−2と根号因子対応を問う。意味が変われば別key。 |
| `n10-11` / `leftSquare`, `rightSquare` | KEEP_REQUIRED_ROOT_SQUARE_CALCULATION | 具体的な根号式に平方根の定義を適用。必要な数値を消さない。 |
| `n10-q12-product` / `inside` | KEEP_NEEDED_RADICAL_PRODUCT | 中項の√6を実際に求める。 |
| `n10-12` / `constant` | KEEP_REQUIRED_SIMPLIFICATION_WITHOUT_EXTRA_PAIR_QUIZ | 2＋3は必要な最終整理。新しいrootFreePairを独立した主要判断に数えない。 |

### N10-G — REPLACE_OPERATOR_ONLY_WITH_CANCELLING_TERMS_JUDGMENT

対象：`n10-q13-identity`, `n10-13`

- 主判断：和と差の積でどの交差項が打ち消され、平方差だけが残るかを把握して具体的に計算する。
- 不足／過細分化：−一文字だけでは平方差を既に与えている。一方、−Bの写し→交差積二つ→各符号→0という全手順の再試問も中高生向けには過剰になりやすい。
- 維持する境界：互いに逆符号の交差項を同定する概念と、7−2=5という具体計算を保持。
- 避けること：−AB＋ABを全て先書きして0だけを埋めることを、相殺する項を生徒が導いた証拠にしない。
- 未実装UX04案：R03の「全自動四積」は避けるが、UX04六穴が唯一の解決ではない。消える項の組と残る二項を主判断へ。

| node / key | 監査候補 | 理由 |
|---|---|---|
| `n10-q13-identity` / `operation` | REPLACE_MAIN_CANCELLATION_JUDGMENT_NEW_KEY | 平方差の−だけでなく、どの二項が相殺するか。旧−記録を新しい判断へaliasしない。 |
| `n10-13` / `left`, `right`, `difference` | KEEP_NEEDED_NUMERICAL_EVALUATION_OR_ONE_LOCAL_CALCULATION | 平方7/2と差5は新しい根号計算の具体適用。過度な別画面分割はしない。 |

### N10-H — KEEP_EQUIVALENCE_AND_RATIONALISATION_STRATEGY

対象：`n10-14`, `n10-q15-factor`, `n10-15`, `n10-q16-denominator`, `n10-16`

- 主判断：非零のc/c=1を上下へ掛けて値を保ち、分母を有理数へする因子を選んで計算する。
- 不足／過細分化：UX04のdenominatorScope=2√3は見えている分母の写しで、denominatorPower=2は基本累乗の反復。これらを自動で主要穴へ加える理由は弱い。
- 維持する境界：同じ非零因子を上下に掛ける理由、因子√3の選択、分子/分母の必要計算は保持。
- 避けること：分母全体の束縛はrenderer/式の構成として必須。生徒に式のASTを読ませる穴を作らないことと、係数2を落としてよいことは別。
- 未実装UX04案：分母scope/指数の新小問を圧縮し、値の保持と有理化の方針を中心にする。

| node / key | 監査候補 | 理由 |
|---|---|---|
| `n10-14` / `operation` | KEEP_EQUIVALENT_TRANSFORMATION_REASON | 上下へ同一非零因子を掛けることで値を保つことは数学的根拠。 |
| `n10-q15-factor` / `factor` | KEEP_RATIONALISING_FACTOR_STRATEGY | 根号を消す因子の選択は主判断。 |
| `n10-15` / `numerator` | KEEP_REQUIRED_NUMERATOR_CALCULATION_OR_COMBINE | 分子も同じ因子で変えることを確認する。1×√3の算術自体を難問扱いしない。 |
| `n10-q16-denominator` / `square`, `denominator` | KEEP_REQUIRED_DENOMINATOR_EVALUATION | 平方と分母6を計算する。これ以上同じ因子数を問う穴を足さない。 |

### N10-I — KEEP_CONJUGATE_AND_NONZERO_COMPRESS_SCOPE_COPIES

対象：`n10-q17-factor`, `n10-q17-nonzero`, `n10-17`, `n10-18`, `n10-q19-distribute`, `n10-19`

- 主判断：共役因子を選び、その非零性と値の保持を確認し、分母と分子を正しく計算する。
- 不足／過細分化：productOperation=×だけ、UX04の元分子√3・元分母√3＋√2の読取りを別々に採点すると、分数の見方の初等練習へ偏る。
- 維持する境界：共役因子、非零性、分母の平方差、分子の符号を含む分配と必要な根号積を保持。
- 避けること：必要な括弧・分母全体の束縛はコード上で維持。表示を短くするために式を偽の等号でつながない。
- 未実装UX04案：numeratorBase/denominatorBaseの新コピー穴は削減候補。既存の符号付き分配も、単純符号の復習だけへ増殖させず必要な分子計算としてまとめる。

| node / key | 監査候補 | 理由 |
|---|---|---|
| `n10-q17-factor` / `factor` | KEEP_CONJUGATE_STRATEGY | 分母が平方差になる方針。 |
| `n10-q17-nonzero` / `relation` | KEEP_NONZERO_JUSTIFICATION | c/cが使える前提。 |
| `n10-17` / `productOperation` | REDUCE_BASIC_FRACTION_MULTIPLICATION_WITH_EQUIVALENCE_KEPT | ×か＋かだけの主判断より、同じc/cで値を保持することと分母の有理化。 |
| `n10-18` / `A`, `B`, `C` | KEEP_DENOMINATOR_CALCULATION_AS_ONE_LOCAL_TASK | 根号の平方と差1は有理化の計算内容。 |
| `n10-q19-distribute` / `secondOperand`, `productSign` | KEEP_SIGNED_DISTRIBUTION_OR_CONSOLIDATE_ALREADY_LEARNED_RULE | 負の第二項を落とさず分子を展開する。二つの符号を別の新概念と数えない。 |
| `n10-19` / `left`, `inside` | KEEP_REQUIRED_NUMERATOR_RADICAL_CALCULATION | 分子3−√6を実際に求める。 |

### N10-J — KEEP_NONZERO_AND_SQUARE_APPLICATION_REDUCE_REPEATED_ELEMENTARY_STEPS

対象：`n10-q20-factor`, `n10-20`, `n10-q21-denominator`, `n10-q21-expand`, `n10-q21-constants`, `n10-21`

- 主判断：因子2−√3の非零性を根拠に同値な有理化を行い、既習の差の平方を分子へ適用する。
- 不足／過細分化：UX04で交差積二つや単独符号を再び六段階にすること、見えている4と3のpair選択を追加することは、前例からの転移より復習の分解が大きい。
- 維持する境界：factorの方針、非零/同一因子での値保持、分子中項の符号込みの係数、必要な平方・根号・定数の計算を保持。
- 避けること：逆符号√3−2も有理化できることは正しく認め、手順の正のc指定と区別。P/Q/Kの旧記録を異なる判断へ自動aliasしない。
- 未実装UX04案：前段で初めて必要になる4/3の計算をどこで行うかは整理可。ただし同じ原問題内で二度採点しない。signedCrossSumの−4という意味は保持し、六つの基礎分配小問を必須にしない。

| node / key | 監査候補 | 理由 |
|---|---|---|
| `n10-q20-factor` / `factor`, `factorSign`, `reason` | KEEP_STRATEGY_NONZERO_AND_EQUIVALENCE | 主たる数学的な条件と根拠。 |
| `n10-20` / `power` | REDUCE_ROUTINE_REPEATED_FACTOR_COUNT | 同じ因子二回の指数2は既習。分子全体に平方が作用する表示は必須。 |
| `n10-20` / `denominatorOperation` | KEEP_OR_INTEGRATE_CONJUGATE_IDENTITY_APPLICATION | 分母の和と差の積を正しく平方差へ。−一文字を新しい法則の発見とは数えない。 |
| `n10-q21-denominator` / `D` | KEEP_REQUIRED_VALUE_WITHOUT_MICROQUIZ_WEIGHT | 分母1を求める必要計算だが4−3を教材の核心としない。 |
| `n10-q21-expand` / `P`, `K`, `Q` | REVIEW_PLACEMENT_AND_MAIN_SIGNED_CROSS_TERM | 必要な平方4/3と中項係数は残す。同じ平方を前段で既に求めたなら参照し、符号込みの−4を求める判断を主にする。意味の異なる旧K=4を新−4へ転用しない。 |
| `n10-q21-constants` / `C` | KEEP_REQUIRED_FINAL_SIMPLIFICATION_NO_EXTRA_PAIR_COPY | 定数和7は必要な整理。新rootFreePair=4,3を別の主要判断として加えない。 |

## 全86nodeの対応（監査漏れ防止）

以下はどの群で読取確認したかの一覧であり、全てを変更する表ではない。KEEP境界は上の各群に記載。

| unit | node | 現行part key | 監査群 |
|---|---|---|---|
| n09 | `n09-q01-positive` | なし | N09-H |
| n09 | `n09-q01-negative` | powerAction, productSign, value | N09-B |
| n09 | `n09-01` | balanceOperation, factorSign, zeroLogic, leftInverseOperation, rightInverseOperation | N09-A |
| n09 | `n09-definition` | なし | N09-H |
| n09 | `n09-q02-root` | value | N09-H |
| n09 | `n09-q02-negative-square` | signFactor, value | N09-B |
| n09 | `n09-02` | なし | N09-H |
| n09 | `n09-boundary` | なし | N09-H |
| n09 | `n09-q03-inside` | value | N09-B |
| n09 | `n09-03` | value | N09-B |
| n09 | `n09-q04-nonnegative` | value | N09-C |
| n09 | `n09-q04-negative` | oppositeSign, value | N09-C |
| n09 | `n09-04` | なし | N09-C |
| n09 | `n09-05` | value | N09-C |
| n09 | `n09-q06-squares` | value | N09-C |
| n09 | `n09-q06-order` | relation | N09-C |
| n09 | `n09-06` | addend, zero | N09-C |
| n09 | `n09-q07-negation` | scope | N09-C |
| n09 | `n09-07` | outsideFactor, secondOperand, left, sign | N09-C |
| n09 | `n09-decimal-method` | なし | N09-D |
| n09 | `n09-p001-q08-left-square` | L1, L2, L3 | N09-D |
| n09 | `n09-p001-q08-right-square` | R1, R2, R3 | N09-D |
| n09 | `n09-p001-q08-lower-sign` | C | N09-D |
| n09 | `n09-p001-q08-upper-sign` | D | N09-D |
| n09 | `n09-08` | なし | N09-D |
| n09 | `n09-09` | lowerRelation, upperRelation | N09-D |
| n09 | `n09-parts-target` | なし | N09-E |
| n09 | `n09-q10-reject-truncation` | value | N09-E |
| n09 | `n09-10` | n | N09-E |
| n09 | `n09-q11-remainder` | sign, value | N09-E |
| n09 | `n09-11` | なし | N09-E |
| n09 | `n09-q12-lower` | value | N09-F |
| n09 | `n09-q12-upper` | value | N09-F |
| n09 | `n09-12` | lower, upper | N09-F |
| n09 | `n09-q13-reverse` | S1, S2 | N09-F |
| n09 | `n09-13` | left, right | N09-F |
| n09 | `n09-q14-positive-integer` | value | N09-G |
| n09 | `n09-q14-positive-remainder` | remainderOperation | N09-G |
| n09 | `n09-q14-negative-integer` | value | N09-G |
| n09 | `n09-q14-negative-remainder` | sign | N09-G |
| n09 | `n09-14` | なし | N09-G |
| n10 | `n10-q01-square` | rootSquare | N10-A |
| n10 | `n10-01` | value | N10-A |
| n10 | `n10-q02-sign` | value | N10-A |
| n10 | `n10-02` | candidateSign, squareValue, identificationReason | N10-A |
| n10 | `n10-q03-expand` | powerA, powerB | N10-B |
| n10 | `n10-03` | aValue, bValue | N10-B |
| n10 | `n10-q04-sign` | relation | N10-B |
| n10 | `n10-04` | rootReason | N10-B |
| n10 | `n10-q05-denominator` | relation | N10-C |
| n10 | `n10-q05-square` | numPower, denPower | N10-C |
| n10 | `n10-05` | numerator, denominator | N10-C |
| n10 | `n10-q06-sign` | relation | N10-C |
| n10 | `n10-06` | quotientReason | N10-C |
| n10 | `n10-q07-product` | insideOperation, inside | N10-D |
| n10 | `n10-07` | squareFactor, factor | N10-D |
| n10 | `n10-q08-factor` | coefficient | N10-D |
| n10 | `n10-08` | なし | N10-D |
| n10 | `n10-q09-left` | squareFactor, coefficient | N10-E |
| n10 | `n10-q09-right` | squareFactor, coefficient | N10-E |
| n10 | `n10-09` | なし | N10-E |
| n10 | `n10-q10-coefficients` | coefficient | N10-E |
| n10 | `n10-10` | なし | N10-E |
| n10 | `n10-q11-formula` | middleSign | N10-F |
| n10 | `n10-11` | leftSquare, rightSquare | N10-F |
| n10 | `n10-q12-product` | inside | N10-F |
| n10 | `n10-12` | constant | N10-F |
| n10 | `n10-q13-identity` | operation | N10-G |
| n10 | `n10-13` | left, right, difference | N10-G |
| n10 | `n10-14` | operation | N10-H |
| n10 | `n10-q15-factor` | factor | N10-H |
| n10 | `n10-15` | numerator | N10-H |
| n10 | `n10-q16-denominator` | square, denominator | N10-H |
| n10 | `n10-16` | なし | N10-H |
| n10 | `n10-q17-factor` | factor | N10-I |
| n10 | `n10-q17-nonzero` | relation | N10-I |
| n10 | `n10-17` | productOperation | N10-I |
| n10 | `n10-18` | A, B, C | N10-I |
| n10 | `n10-q19-distribute` | secondOperand, productSign | N10-I |
| n10 | `n10-19` | left, inside | N10-I |
| n10 | `n10-q20-factor` | factor, factorSign, reason | N10-J |
| n10 | `n10-20` | power, denominatorOperation | N10-J |
| n10 | `n10-q21-denominator` | D | N10-J |
| n10 | `n10-q21-expand` | P, K, Q | N10-J |
| n10 | `n10-q21-constants` | C | N10-J |
| n10 | `n10-21` | なし | N10-J |

## 記録と承認の扱い

- 数学/問いの意味を変える置換は新keyで設計し、旧recordを数値一致でaliasしない。削減を採用する場合も旧版/履歴へ保存し、今ここで削除しない。
- 今回の監査は修正案の反省・分析候補。各群の判断をそのまま一括実装する承認ではない。
- 既に改善評価された排版・共通UIは保護し、穴数や単なる難化を目標にしない。
- 既存CODE/保存/描画の成功を取り消さないが、本人が求める主概念の適切さのPASSへ読み替えない。
- 次は親が分析と既存WorkのREVISE状態を整理する。ここでUX05の全選択肢・実装・公開を先行しない。

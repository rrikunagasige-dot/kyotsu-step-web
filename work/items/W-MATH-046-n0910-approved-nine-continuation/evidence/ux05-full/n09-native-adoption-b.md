# UX05 full N09 — 既存teaching/native interactionの非作者採否B

Reviewer: /root/w046_render_review（N09設計/教材の非作者）。
判定: ADOPT_PROFILE_WITH_APPROVED_NATIVE_SCOPE。採用は承認済みの具体設計に束縛し、CODE候補生成を本人承認や製品受入に読み替えない。

## 教授profileの採否

既存teaching-candidatesはfirst_applicationという1候補を返す。これを一般則/条件/進む理由を先に示して具体例へ適用する基調として採用する。候補のsteps41はnative nodes41の前提/結果へ対応する。inputのknowledgeは空であり、個人の習熟状態を測定した結果ではない。既習の乗法公式などのカリキュラム前提は承認設計から与え、学習者が全て未習であると推定しない。

explainInput/explainReasonは、一般の平方根/絶対値/整数部分の定義、比較に必要な条件を示す意味で適用する。候補にreassemble=falseがあることを、承認済みのAUTOまとめ/元問題への復帰や全解の結論を削除する許可にはしない。学習者の回答単位は別の承認native契約で確定しており、profileから全基礎操作へ穴を増やす/旧全解法をAUTOにする変更は採用しない。

teaching-candidatesのwrapper status=PASSは候補生成の機械処理のみ。候補自身のNEEDS_AI_REVIEW、interaction-planのNEEDS_AI_REVIEW/SEPARATE_SOURCE_BOUND_REVIEW_REQUIREDは原結果として保持し、本採否/意味応答importを別に対応する。

## native interaction全43件

43候補はID一意でactive N09r8の全43partに過不足なく対応する。承認N09詳細との照合は32KEEP/11NEW。うちNEW2件の因数分解/零条件は本人確認済み代表で、今回残適用のNEWは9件。基準を明確に分ける：original R6（旧52part）基準では32KEEP＋2 accepted-pilot NEW＋9 remaining NEW＝43、直前R7 pilot（48part）基準では34KEEP＋9NEW＝43で、廃止14件は旧版保管。今回の版更新はR7→R8である。各候補のlearnerDecisionは承認されたpromptと一致し、型/正答もactiveと一致。KEEPを新しい問いに流用せず、RETIRE20件の旧idは候補へ混ざらない。各NEWの数学的操作/誤答候補/次の使用は別の14意味応答に具体的に記録する。

|候補id|承認判断|採用根拠/範囲|
|---|---|---|
|`n09-q01-negative::powerAction`|KEEP / ADOPT|固定66c8007bの同ID契約（対象/問い/型/全候補/正答）を保持。新版gateを再評価。|
|`n09-q01-negative::value`|KEEP / ADOPT|固定66c8007bの同ID契約（対象/問い/型/全候補/正答）を保持。新版gateを再評価。|
|`n09-01::factorisedFormUX05`|NEW / ADOPT|平方差の構造を因数分解へ適用する。第一因子の写し穴ではない。 本人確認済み代表の契約を保持。|
|`n09-01::factorZeroConditionUX05`|NEW / ADOPT|AB=0の法則を具体的な二因子へ適用し、必要十分な零条件全体を構成する。 本人確認済み代表の契約を保持。|
|`n09-q02-root::value`|KEEP / ADOPT|固定66c8007bの同ID契約（対象/問い/型/全候補/正答）を保持。新版gateを再評価。|
|`n09-q02-negative-square::signedRootSquareUX05`|NEW / ADOPT|負の平方根の平方を、指数の作用範囲と平方根の定義で計算する。|
|`n09-03::value`|KEEP / ADOPT|固定66c8007bの同ID契約（対象/問い/型/全候補/正答）を保持。新版gateを再評価。|
|`n09-q04-nonnegative::value`|KEEP / ADOPT|固定66c8007bの同ID契約（対象/問い/型/全候補/正答）を保持。新版gateを再評価。|
|`n09-q04-negative::value`|KEEP / ADOPT|固定66c8007bの同ID契約（対象/問い/型/全候補/正答）を保持。新版gateを再評価。|
|`n09-05::value`|KEEP / ADOPT|固定66c8007bの同ID契約（対象/問い/型/全候補/正答）を保持。新版gateを再評価。|
|`n09-q06-squares::value`|KEEP / ADOPT|固定66c8007bの同ID契約（対象/問い/型/全候補/正答）を保持。新版gateを再評価。|
|`n09-q06-order::relation`|KEEP / ADOPT|固定66c8007bの同ID契約（対象/問い/型/全候補/正答）を保持。新版gateを再評価。|
|`n09-06::differenceRelationUX05`|NEW / ADOPT|大小関係から差の符号を判断し絶対値の場合分けに使う。|
|`n09-q07-negation::absoluteExpressionUX05`|NEW / ADOPT|負と確定した二項式全体へ絶対値の定義を適用する。|
|`n09-07::expandedExpressionUX05`|NEW / ADOPT|二項式全体への負号の分配を一つの式として実行する。|
|`n09-p001-q08-left-square::middleTermUX05`|NEW / ADOPT|和の平方の中項を二つの項から具体的に構成する。既存の積・和・小数化は別に保持する。|
|`n09-p001-q08-left-square::L1`|KEEP / ADOPT|固定66c8007bの同ID契約（対象/問い/型/全候補/正答）を保持。新版gateを再評価。|
|`n09-p001-q08-left-square::L2`|KEEP / ADOPT|固定66c8007bの同ID契約（対象/問い/型/全候補/正答）を保持。新版gateを再評価。|
|`n09-p001-q08-left-square::L3`|KEEP / ADOPT|固定66c8007bの同ID契約（対象/問い/型/全候補/正答）を保持。新版gateを再評価。|
|`n09-p001-q08-right-square::middleTermUX05`|NEW / ADOPT|和の平方の中項を二つの項から具体的に構成する。既存の積・和・小数化は別に保持する。|
|`n09-p001-q08-right-square::R1`|KEEP / ADOPT|固定66c8007bの同ID契約（対象/問い/型/全候補/正答）を保持。新版gateを再評価。|
|`n09-p001-q08-right-square::R2`|KEEP / ADOPT|固定66c8007bの同ID契約（対象/問い/型/全候補/正答）を保持。新版gateを再評価。|
|`n09-p001-q08-right-square::R3`|KEEP / ADOPT|固定66c8007bの同ID契約（対象/問い/型/全候補/正答）を保持。新版gateを再評価。|
|`n09-p001-q08-lower-sign::C`|KEEP / ADOPT|固定66c8007bの同ID契約（対象/問い/型/全候補/正答）を保持。新版gateを再評価。|
|`n09-p001-q08-upper-sign::D`|KEEP / ADOPT|固定66c8007bの同ID契約（対象/問い/型/全候補/正答）を保持。新版gateを再評価。|
|`n09-09::lowerRelation`|KEEP / ADOPT|固定66c8007bの同ID契約（対象/問い/型/全候補/正答）を保持。新版gateを再評価。|
|`n09-09::upperRelation`|KEEP / ADOPT|固定66c8007bの同ID契約（対象/問い/型/全候補/正答）を保持。新版gateを再評価。|
|`n09-q10-reject-truncation::value`|KEEP / ADOPT|固定66c8007bの同ID契約（対象/問い/型/全候補/正答）を保持。新版gateを再評価。|
|`n09-q10-reject-truncation::candidateValidityUX05`|NEW / ADOPT|候補を整数部分・小数部分の定義に照らして棄却する。|
|`n09-10::n`|KEEP / ADOPT|固定66c8007bの同ID契約（対象/問い/型/全候補/正答）を保持。新版gateを再評価。|
|`n09-q11-remainder::value`|KEEP / ADOPT|固定66c8007bの同ID契約（対象/問い/型/全候補/正答）を保持。新版gateを再評価。|
|`n09-q12-lower::value`|KEEP / ADOPT|固定66c8007bの同ID契約（対象/問い/型/全候補/正答）を保持。新版gateを再評価。|
|`n09-q12-upper::value`|KEEP / ADOPT|固定66c8007bの同ID契約（対象/問い/型/全候補/正答）を保持。新版gateを再評価。|
|`n09-12::lower`|KEEP / ADOPT|固定66c8007bの同ID契約（対象/問い/型/全候補/正答）を保持。新版gateを再評価。|
|`n09-12::upper`|KEEP / ADOPT|固定66c8007bの同ID契約（対象/問い/型/全候補/正答）を保持。新版gateを再評価。|
|`n09-q13-reverse::S1`|KEEP / ADOPT|固定66c8007bの同ID契約（対象/問い/型/全候補/正答）を保持。新版gateを再評価。|
|`n09-q13-reverse::S2`|KEEP / ADOPT|固定66c8007bの同ID契約（対象/問い/型/全候補/正答）を保持。新版gateを再評価。|
|`n09-13::left`|KEEP / ADOPT|固定66c8007bの同ID契約（対象/問い/型/全候補/正答）を保持。新版gateを再評価。|
|`n09-13::right`|KEEP / ADOPT|固定66c8007bの同ID契約（対象/問い/型/全候補/正答）を保持。新版gateを再評価。|
|`n09-q14-positive-integer::value`|KEEP / ADOPT|固定66c8007bの同ID契約（対象/問い/型/全候補/正答）を保持。新版gateを再評価。|
|`n09-q14-positive-remainder::remainderExpressionUX05`|NEW / ADOPT|実数と整数部分の符号を合わせて、剰余の式全体を構成する。|
|`n09-q14-negative-integer::value`|KEEP / ADOPT|固定66c8007bの同ID契約（対象/問い/型/全候補/正答）を保持。新版gateを再評価。|
|`n09-q14-negative-remainder::remainderExpressionUX05`|NEW / ADOPT|実数と整数部分の符号を合わせて、剰余の式全体を構成する。|

## 主要な非作者意味判定と保護

負の平方の作用/必要計算、零積の具体条件生成、a<0の非負平方根、差の符号、絶対値の具体適用、不等号反転、整数/小数部分の定義適用を採点対象へ残す。AUTOの既出平方参照や計算準備を、新しく本人が回答した判断と数えない。Q08のL1/L2/L3/R1/R2/R3と大小比較を保持し、中項は一般公式の具体的因子対応を一判断として追加する。

実public full snapshotsから、同stageの2<√5や整数部分3/−4、Q08の先行計算などを認定済みとして確認した。node抜粋にない事実を私有expectedから作っていない。abs/一般aの条件/因子順等の限定CODE未対応は意味根拠で審査し、機械証明と区別する。通常AST/44px/実寸/画像はactualDOMMeasurements:falseのR04でPASSにせずR07へ繰り越す。

## 出所SHA256

- `/workspace/scratch/6ff917b2ec4a/w046-ux05-full/work/items/W-MATH-046-n0910-approved-nine-continuation/evidence/ux05-proposal/N09_DESIGN.json` `8be141bd7783666b782f2dbdb7ba076b5ef996e99ffabc3418bd2b420b80a912`
- `/tmp/w046-ux05-full/r04/n09-teaching-input.json` `6f416528091665ca5cb3613651f3ebfde6dcbb3f9b3f7a3406a2c344821afb97`
- `/tmp/w046-ux05-full/r04/n09-teaching-candidates.json` `64c2f1af8ee8fd2337a812b39a92aa080948005839c64ad8dc8825810678d23a`
- `/tmp/w046-ux05-full/r04/n09-interaction-plan.json` `a586e14d149904fc7ab735b905c31a28a9ec13839e73bbcf1f456e47264f9b49`
- `/tmp/w046-ux05-full/r04/n09-meaning-requests.json` `f3d0a0c4630de468876c6fa5380a1f3a0e1e509b0303bf47d53ea1fdb5775d52`
- `/tmp/w046-ux05-full/r04/n09-responses-b.json` `59a2196980cb44658c5bb2886b8e7cc1ddee9a0c4008623b0f3cdf5effe21174`
- `/tmp/w046-ux05-full/r04/n09-visible-snapshots.json.gz` `b2c40429de6cd6466b1a409711d8b5e31cf02154984c1af6250b7fbed9f1454b`

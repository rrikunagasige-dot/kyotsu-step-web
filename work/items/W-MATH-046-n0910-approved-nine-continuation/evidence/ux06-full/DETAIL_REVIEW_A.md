# UX06 代表2点修正の非作者照合 A

対象は未凍結N09r10/from9候補 `3de5a6b3ad5d7f03c4381ca92faef4d57306f03c35b0b1de5e03b42d1535e306`。製品修正はroot、Aは数学・前提・保存の読取と実画像確認。ここでは残り10導出/3本文が実装済みとは扱わず、全体受入も主張しない。

**本人が指定した2点はこの候補で満たされている。残りの承認済み適用を止める指摘はない。** 本人の条件付き指示に従い、改めて同じ承認を質問する必要はない。

## 数学の文脈

leadPartsは、√2の位置のため1.41/1.42の平方を2と比較すること、分数の分子141/142を140+1/140+2に分けること、そこから二つの数を一般にA/Bと表して和の平方を作ることを実本文でつないでいる。assumptionPartsはA/Bが実数で、この後A=140/B=1または2として具体候補に使うことを述べる。

row06introは全6正答の後、同じ対応を分子へ使い、分母の平方で割って小数候補へ戻す流れを説明する。一般式を突然独立問題として置く構成から、具体問題のための一般化→具体適用へ変わった。

この対応説明は今後の目的/記号の意味であり、中項2×140×1/2×140×2、平方19881/20164、小数1.9881/2.0164、比較の<・>は初期に示していない。未回答の公式完成2ABも旧条件から先出ししない。sourceのlead/assumption/各gateを直接読取し、初期と完成時のpublic本文を生RESULTでも確認した。

旧r9 snapshot de799…と新候補のdecimal-methodのparts全6object/partOrder/prerequisiteNodeIds/requiredResultRefsは完全一致。基底→分配のA/B→BA/B²→係数2という本人が肯定した操作を保持している。保存時のKEEPはこの契約一致に基づき、単に正答値が同じという判定ではない。

## 等号・実font

主導出01〜05は共有group、補助06〜08はそれぞれ別group。`detail-fixed/RESULT.json` の320/390/430/1440各7状態（計28）を読取り、各時点で同時可視の主導出rowのgroup relationXとrootRelationProofの実rect.xを比較した。全28状態で行間の差0px。詳細をDETAIL_FIX_ALIGNMENT_A.jsonへ保存した。状態間の再計画による全体の移動とは区別し、異なる幅の絶対xを一致条件にはしていない。

各run errors=[]、partialReload/captureOnlyFromSameCompiledSource=true。KaTeX_Main/KaTeX_Math italic loaded、font error0。sourceHashesとsourceHashesAfterが一致し、現在4対象file hashへも一致した。これは前回のfont未ロード版の流用ではない。

Aが直接目視した画像は `390-correct-ux06CrossProduct.png` と `320-correct-ux06DistributeA.png`。文脈の橋渡しを読め、同じ画面の積行/分配行の等号が揃っている。320では分配式の後半を＋で継続する改行となり、第一/第二の積の数学的意味を変えていない。4幅全画像の見た目審査をAが行ったとは言わず、他状態は実DOM数値での照合範囲とする。

## 次工程の境界

旧r9 de799はsnapshotとして固定されている。この修正版r10は未凍結の作業候補であり、今から同候補へ承認済み残り10導出/3本文を適用し、最終fullr10/N10r6で再度コード/数学/保存/全public/実画像を確認する。3de5a6の限定検査をfull完成後の検査へ転用しない。新しい内容範囲や公開/main権限へ承認を拡張しない。

証拠SHA256：

- detail-fixed/RESULT.json：`0a902997b3c766636e9805cecbc660459021a57652c0e61e9fe83b84fb5ba263`
- detail-fixed/390-correct-ux06CrossProduct.png：`784fdb6897a99d5ed5eca4af5d35e93376ac3b2cfbfb787e4bdf69879fccb43f`
- detail-fixed/320-correct-ux06DistributeA.png：`855990fcaa15a8731fd21f18bdf64f32ba17ad90e7c70cc1348f6edf51e9c882`
- DETAIL_FIX_ALIGNMENT_A.json：`7d479d3e6e1c2633f63e7478a03fa31407a940efbbcf6961d7426b2173e05ad7`

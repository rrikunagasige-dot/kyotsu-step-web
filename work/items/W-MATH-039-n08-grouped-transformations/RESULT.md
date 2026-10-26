# W039 — N08実装・公開結果

Status: VERIFYING / G3_HOST@n08 PASS / G3_FINAL@n08 WAITING_USER。本人評価・受入はまだない。

- 原提案0aa633dc/P001を「いいよまず実装してくれ」で承認。原PROPOSAL.md/APPROVAL.json保持。
- 実装source c4e7133a4fd3def11771077379aacc6e19d3445b。CI40272765258 SUCCESS。publisher65ff3f5f730b8f62bf0e35dfe87101a631dc4ae4、公開run40273405766 SUCCESS。
- N08のstage06/07/08/09に4連続式。11既存数学上の穴、2意味nodeのafter文章、元の問題・条件・前結果・式番号/aliasを対応。分配の手本と計算穴を分け、同じ結論の重複カードを省く。
- 全39node/34採点ID/revision5/12stage/原図と旧r4/r5 leafを保護。旧r5は?layout=original、旧r4は?version=4。同じ保存namespaceと回答/attempt/日時/完了を維持。
- NumberedEquationの任意anchorSelectorを新groupだけで使い、式番号が選択肢へ寄らないことを検査。
- 数学88、workflow139、source21、learner620、新UI7、適用N11UI5、保存7、以前3単元19、authoring39 PASS。旧W038のN08-reader固定assertionを承認済み改修に合わせて明示的に代替し、原testを保持、新旧fallbackの6状態一致とprojection parityで補う。
- 実公開N08:34correct/80wrong×320/390/430/1440；履歴/再読込/resize/旧表示/旧保存/二枠一回答/番号位置PASS。実公開N11:39/109×4幅、14stage、2原図、旧保存1〜10と表示切替PASS。N09/N10の表示・括弧・順序・記録・resizeも4幅PASS。
- 既存の共有Runtimeを実行し、R01〜R06/R07/G2/G3_HOSTまでactual receipts。準備後の記録捕捉は明示。実装準備を過去へ遡らせず、同じAIの別passを独立AI監査と呼ばない。
- モデルの新fit・新品質labelなし。以前の15件/9否定/6肯定とOFFLINE_ONLYを維持。

公開：https://rrikunagasige-dot.github.io/kyotsu-step-web/?v=c4e7133a#/learning/textbook/math-numbers-expressions-n08
変更前r5：https://rrikunagasige-dot.github.io/kyotsu-step-web/?v=c4e7133a#/learning/textbook/math-numbers-expressions-n08?layout=original
以前r4：https://rrikunagasige-dot.github.io/kyotsu-step-web/?v=c4e7133a#/learning/textbook/math-numbers-expressions-n08?version=4

次は本人がこの新表示を実際に見た評価。今回の設計承認やネット再開を品質受入へ変えない。不満の場合は原leaf/記録を残して表示policyをoriginalへ戻せる。

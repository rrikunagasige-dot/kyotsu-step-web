# Findings
F-001 ERROR-QA/IMPLEMENTATION: P006事前検査は元tsc -b設定を再現していなかった。DOM.Iterableなしのnodeprojectで新NodeList spreadがTS2488。
F-002 CONFIRMED: 修正は同じNodeListをArray.fromで配列にする一行。設定/時間枠/元検査/意味条件は維持。
F-003 OPEN-QUESTION: 元P006ready/SVGの実効果と後続browserは未確認。build互換性PASSをbrowserPASSと扱わない。

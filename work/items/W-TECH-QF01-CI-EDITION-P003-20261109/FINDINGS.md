# Findings
F-001 ERROR-QA: Mの最初のbefore比較がpatch済scratchを参照し、実GitbeforeのID順変更を見逃した。P002を適用前停止し、拒否証拠を保存。
F-002 CONFIRMED: 旧JSONはID集合一致でも順序が違い原adapterが拒否。guard変更ではなく記録保存＋現行別証拠で対応する案。
F-003 CONFIRMED: 既存MaterializationBindingの旧protected値、W039のr5固定はcd64に実在する後続障害。
F-004 CONFIRMED: 現行catalog168、旧65。途中138は誤りとして履歴保持。
F-005 RISK: 最終16全CI/9suite/新QF4幅は未実行。限定PASSを全合格へ拡大しない。

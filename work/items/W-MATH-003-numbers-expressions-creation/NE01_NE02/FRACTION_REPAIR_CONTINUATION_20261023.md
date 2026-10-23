# 分数表示修正と検証の再開記録

Status: VERIFYING（完了・ユーザー受入ではない）

## 指示と対象
ユーザー「残りの仕事全部まとめて修正して、章全体確認まで止まないでよ」、P005設計提示後の「続けて」、最新「続けてやりなさい」に基づく継続。既存の承認を再要求せず、修正・全章検証を続行する。

固定教材SHA: `f8ff1d0c7e82e1a2dee57bb07b3c53c17ec52ec0`。PR #127。mainは別の公開版であり、この教材の実働確認先として扱わない。

## 原因・影響・限定修正
旧finite-set normalizerが数値分母を集合として解釈。対象はN07 Q08、N10 Q16、NE02 Q10/Q12。4 item IDに限る表示境界で数値分母を数学的に同値なmathordで保護。採点文字列・選択肢文字列・stable ID・既存14単元の教材原文は維持。

16単元の分数選択肢74件を監査し、修正後の実表示→既存正規化経路で余分な集合括弧は0。実ブラウザではMathMLの分母を検査し、構文成功と横幅だけでは見つからない誤表示も検出する。

三次式の誤答26候補、二重根号の誤答24候補も厳密計算で再確認済み。

## 実行中の正確な復帰先
- 全16単元・新規25問の表示/操作: https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39940593428
- 数学/物理教材の全回帰: https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39940593468
- 練習側回帰: https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39940593600 （SUCCESS）
- 固定教材SHAの全25問を遮蔽なしで再撮影: https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39941055264

復帰順: 成否確認→固定SHA付きartifact取得→全画像目視→25問確認票と全章検査結果の保存→ユーザーへ提示。失敗・残存欠陥があれば同じ承認範囲で原因調査・修正・再検証。古い画像の括弧不具合やナビ重なりを新画像として提示しない。

Gate①新規25問のユーザー視覚確認とGate③全体プレイは未完。実装承認やCI成功をその受入と混同しない。main merge/公開はこの記録で実施しない。

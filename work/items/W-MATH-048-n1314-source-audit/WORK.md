# W-MATH-048 — N13/N14 原資料・推導・可視順の修正

Status: PROPOSED / R01→R02→R03@n13正式記録済み / 次R04_PROPOSAL@n13 / 最終具体案は未凍結

Command: CMD-WORK-001 / production/2 / team/1。入力は本人d1dfd1d9の続行指示。N11/N12の本人受入・W047 DONEを保持し、新しい実装承認へ転用しない。

Branch: work/n1314-source-audit-20261104。
Source: 教材f129ba78、publisher/main6cd11。母Word SHA93827322、N13 33/N14 46段落。既存129表示block/50回答/25原問/3原図を照合。

成果物：PROPOSAL.mdは素案、N13_CANDIDATE.json/N14_CANDIDATE.jsonは正答入りの確認用全文データ。ADDED_DECISIONS.jsonに追加8判断。SOURCE_PROVENANCE.jsonとevidenceの原抽出・現稿・A/B原報告を参照。

保護：旧50採点ID・正答・200選択肢キー、既承認のN13Q05/Q08、N14Q07/Q08/Q10/Q12/Q14/Q15/Q16、原図3点、既受入単元・他mode・保存履歴。現src/public/.githubは未変更。

現在地と次工程の正本は、共有Runtimeから生成するgenerated/CURRENT_POSITION.md。正式記録の前に完了と称さない。R04では全文IR・同じ論理行の複数slot・番号・旧保存の可視順を確定し、診断IRを全文合格へ転用しない。最終案の承認依頼はその後。

R02で既存15事例を実SCOPED_CATALOGとして取得し、適用/範囲外を個別に記録した。モデル推論・学習は実行していない。正式工程はN13を先行し、N14のR01〜R04は既存graph順に進める。N14の原資料・現稿・候補データの監査済みと、正式node完了を分ける。

Mが唯一のStore/Git writer。A=/root/w047_review_design、B=/root/w047_layout_sourcefirst。二人を再利用し、追加agentなし。

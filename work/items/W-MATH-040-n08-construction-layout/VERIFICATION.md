# W040 検証

固定教材source: `e7320590d4af51b7cc0d9faa918485467092a3c0`。主要CI [40296848940](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/40296848940) SUCCESS。実artifact12639585127を取得し、ZIP digest `8c9190d7b27ed3abf7bec6b1011030dc16cabd7de519a4a177d345672b71854a`をAPIと照合。

- learner637、独立した比較route4、workflow190、corpus31、production59、source/math88、authoring35＋4、lint、TypeScript/build。群間の重複を除いた総数とは呼ばない。
- N08:22 scalar＋11 construction parents/15 parts、69種類の誤答候補を320/390/430/1440で操作。初期・途中・完成の132親画像と48group配置計測。部品一回の入力ごとではなく、全必須部品がそろった親だけ採点。
- 18px/KaTeX1、関係記号列、数式行4px/注6px/段落8px、44px hit、番号は現在の最終行。隣接行/注がない状態の間隔はcomputed tokenと明記し、存在しない物理間隔を測ったとはしない。
- 旧34回答をarchive、同義22のみ引継ぎ、11新親は未回答。途中reload、mirror、指定順、r4/r5/r6往復、reset後の空保存、preview非書込。
- 比較用r5全34正答/80誤答、現在Storeを書き換えず両表示を操作。
- N11全39正答/109誤答×4幅、旧revision1〜10、原図2、履歴/resize/reloadを同SHAのクリーンCIで確認。

Aは132個のCI PNGとgeometry JSONの実hash、48配置値、代表原寸と390px本文を再確認。BのUIとMのroute表示を非作者として審査した。A自身のmath/domainはBの実再現・追加回帰で別に審査した。同じモデルと共有履歴であり、モデル独立・盲検・OS sandboxとは呼ばない。

旧CI失敗とローカル環境失敗も保持する。c479: Wordテスト依存pandoc不足。2293:一sourceNodeに手本行と判断行がある場合の画像採取対象が曖昧。e732で依存導入/判断row IDへの束縛を修正した。ローカルsymlink worktreeのN11font403/番号衝突は成功に数えず、クリーンCIの同SHA N11結果を根拠とする。

このファイルのCI成功は、本人のアプリ受入や品質Goldを意味しない。実公開manifestと配信操作の確認後、公開結果を追記する。

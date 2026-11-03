# 原FAILと範囲

- detail候補撮影前に日本語font欠落を検出。Noto Sans CJK JPを環境へ復旧し、その欠落画像は受入へ使わずdetail4幅を取り直した。KaTeX実loadも別途検証した。
- ab3f0daの初回full browserはAがq11/q13の同型文脈欠陥を発見したため中断。修正後5e83a17bで全4幅を最初から撮り直した。中断版は利用版/承認済みrevisionとして凍結しない。
- full browserのelement.screenshotはsticky headerが本文上部を覆う採取不備。2060状態のDOM/geometryと画像受入は分離。scroll0 fullpage→bboxで44cropを取り直し、元の全ページも保存。x+4の追加2cropも同方式。
- migrationの初回は複数browser/server並列時に接続拒否。原因未確定のまま原log `raw/ux06-migration.log` を保持し、PASSに読み替えない。後続を一台の移行検査で再取得した。
- 次の移行試験はRETIRE対象powerActionをtargetへ保持すると誤期待してFAIL。原JSON `raw/ux06-migration-retired-expectation-failure.json.gz` とlogを保持。Aがscope/採点契約から訂正を独立確認。KEEPだけを期待し、旧archiveの全保存、KEEP value16保持、resetAt/processedEventIds/旧key保護のassertを残し19caseを実行し直した。製品側の保存条件は緩めていない。
- repo全体lintは既存25error/1warningでFAIL。指摘ファイルの着手baseとのbyte一致をLINT_BASELINE.jsonへ保存。変更source lint、型/build、関連回帰の成功と混同しない。
- finite-mathは70parts未対応のPARTIAL、construction/blank/interactionはNEEDS_AI_REVIEW。CODEの未対応を消さず、A/Bの根拠付き意味審査へ接続する。正式Store receiptや本人受入は作らない。

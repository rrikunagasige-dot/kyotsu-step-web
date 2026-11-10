# Findings

F-001 CONFIRMED: 現行と旧版fixtureの混在が18失敗の根拠。旧unitだけの差替えは共有mapの新ID混入で不十分。旧map literalを独立固定し原assertionを保持する。
F-002 CONFIRMED: 53診断の直接対象47pathだけでは状態連動を満たせず55pathが必要。実4閉鎖と未済親を分け、旧W051部分完了を親全体DONEへ広げない。
F-003 ERROR-QA_HISTORY: sparse baseline198/proposed145、authority欠落によるerrors0/exit1を検出。原出力を保持し、必要な固定blob取得後に原53/exit1→0/exit0を最終確認した。
F-004 CONFIRMED: 新pathの収録は同Work.reviseでsource_manifestを拡張できない。承認後の固定入力準備と新規native実装Workの正規openを具体案へ明示した。
F-005 OPEN: 正式適用、実CI、新sourceのC09/G2、本番公開、本人受入は未実施。

F-006 CONFIRMED: F-005は提示時のcheckpoint。承認後に64path適用済み。実CI/G2/本番/本人受入は引き続き未完了。

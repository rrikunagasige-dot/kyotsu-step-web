# W-MATH-033 — N08 絶対値の段階的な導出

Status: PROPOSED
Command: CMD-WORK-001
Proposal: P-001 / PROPOSAL.md
Branch: work/n08-absolute-value-design-20261025
Entry main: 3c1cd665a0f20b916b3ad03c5cc6451fab5b9ff7
Tool pin: 058c4ea32474b563487292b583f7a01df4f9c4f1
Learner source: 46ea59be61a177bf98edc9f6d26eb6fa7e52b0a6

Input: ユーザー「行那你继续做N08」。受入済みN07、原Word、旧N08、現在のproduction/2と10件の版付き教訓。
Output: 原35blockの対応、原12問の完全解法、36node/31穴/12段階の具体案、事前影響表、既存台帳のR01–R04実行記録。
Verification: strictIR/coverage/compile、原12ID正答不変、図byte一致、9恒等式と全場合の意味監査。
Current: R05_APPROVAL@n08。未承認の具体設計を実装・配信へ進めない。N07の受入とモデル学習はDONEのまま保持。
Next: このP-001とNODE_DESIGNへのユーザー承認→N08限定実装→四幅と移行・回帰検査→既存公開アプリURL。画像票・同じ公開許可の再要求へ戻らない。

共有StoreはW-MATH-032/runtimeを保持。新しい空台帳へ原否定例の閉鎖フラグだけを移していない。N07専用のmaterialization関数をN08へ偽装して呼び出さず、承認済みIRを通常compilerへ渡すWork内スクリプトを使う予定。

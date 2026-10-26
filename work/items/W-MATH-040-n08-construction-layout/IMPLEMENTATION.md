# N08 r6 — 実装記録

固定source: `e7320590d4af51b7cc0d9faa918485467092a3c0`。共通基盤31b87bd3へ承認済みW040を適用。39node/38segmentを保持し、22従来回答＋11新親＝33親、15部品。本人の実物評価は別に記録する。

Mが統合・正式Store・公開、Aが型/式/保存/data、Bがr6 UIを担当。AがB UI/M routes、BがA data/saveを反証した。同じモデル・共有履歴であり盲検やモデル独立性は主張しない。正式receiptと作者登録の捕捉は承認後の実装準備より後であり、事前実行へ偽装していない。

| source node | r6 の処理 | 現在の回答ID |
|---|---|---|
| n08-q01-right | retain-no-answer | 手本・本文 |
| n08-q01-left | retain-interaction | n08-q01-left-answer |
| n08-01 | retain-interaction | n08-01 |
| n08-definition | retain-no-answer | 手本・本文 |
| n08-r5-q02-distance | construction | n08-r5-q02-distance-build-r6 |
| n08-02 | retain-interaction | n08-02 |
| n08-q03-order | construction | n08-q03-order-build-r6 |
| n08-03 | construction | n08-03-build-r6 |
| n08-q04-substitute | worked-substitution | 手本・本文 |
| n08-04 | construction | n08-04-build-r6 |
| n08-cases | retain-no-answer | 手本・本文 |
| n08-q05-square | retain-interaction | n08-q05-square-answer |
| n08-q05-compare | retain-interaction | n08-q05-compare-answer |
| n08-05 | retain-interaction | n08-05 |
| n08-r5-q06-operation | retain-interaction | n08-r5-q06-operation-answer |
| n08-q06-subtract | retain-interaction | n08-q06-subtract-answer |
| n08-06 | retain-interaction | n08-06 |
| n08-q07-rule | retain-interaction | n08-q07-rule-answer |
| n08-q07-bracket | construction | n08-q07-bracket-build-r6 |
| n08-q07-distribute | construction | n08-q07-distribute-build-r6 |
| n08-07 | construction | n08-07-build-r6 |
| n08-q08-order | retain-interaction | n08-q08-order-answer |
| n08-r5-q08-operation | retain-interaction | n08-r5-q08-operation-answer |
| n08-q08-difference | retain-interaction | n08-q08-difference-answer |
| n08-08 | retain-interaction | n08-08 |
| n08-q09-bracket | construction | n08-q09-bracket-build-r6 |
| n08-q09-distribute | construction | n08-q09-distribute-build-r6 |
| n08-09 | construction | n08-09-build-r6 |
| n08-q10-forward | retain-interaction | n08-q10-forward-answer |
| n08-q10-reverse | retain-interaction | n08-q10-reverse-answer |
| n08-10 | retain-interaction | n08-10 |
| n08-q11-positive | retain-interaction | n08-q11-positive-answer |
| n08-q11-negative | retain-interaction | n08-q11-negative-answer |
| n08-q11-zero | retain-no-answer | 手本・本文 |
| n08-11 | retain-interaction | n08-11 |
| n08-q12-nonnegative | retain-interaction | n08-q12-nonnegative-answer |
| n08-q12-negative | construction | n08-q12-negative-build-r6 |
| n08-12 | retain-interaction | n08-12 |
| n08-closing | retain-no-answer | 手本・本文 |

旧r4/r5 leafとreader/CSS、N11 leaf/表示planはbyte一致。既存namespaceを継承。旧34回答・試行・日時をarchiveし、22同義回答だけを初回引継ぎ、新しい部品の正答履歴は作らない。r6をreset後は空回答もr6正本として復元する。

修正中に実際に見つけた不具合: 負数因子の括弧、選択済み部品の再編集、代入手本の重複、preview保存分離、ResizeObserver同期ループ、Q09注の狭い改行、reset後の旧22回答復活。有限候補/保存テスト/実操作/相互画像レビューで直した。

CIの旧失敗を成功へ上書きしない。c479の失敗は既存Wordテスト依存pandoc不足、2293は同一sourceNodeに手本行と判断行がある画像採取の対象曖昧。現e732では依存導入とrowID束縛を修正しCI40296848940成功。ローカルworktreeのN11 font403/番号衝突は成功扱いせず、同SHAクリーンCIの全39/109×4幅が代替確認。

既存catalog/modelはOFFLINE_ONLY。今回の承認・agent同意を品質Goldにせず、追加fitなし。受入後の事後sweep/R08/L01は既存C/R工程で行う。

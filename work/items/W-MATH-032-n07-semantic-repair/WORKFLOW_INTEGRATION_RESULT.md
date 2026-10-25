# 今回の実運用で改善した工程

入口は既存の「修正」「作成」の二つ。新しい主工程や承認ゲートは増やしていない。

| 工程 | コードの実装 | AIの仕事・限界 |
|---|---|---|
| 正本固定 | `runner.py`が開始時snapshotのhashと、記録済み候補のhashを分けて照合 | 参照する原資料・対象版を選ぶ。候補の変更を原資料の変更へ読み替えない |
| 修正R02 | `legacy_diagnostics.py`が登録された旧N07だけを照合・診断。新候補にはstrict IRを要求 | 六症状の用途・文法・解法接続を判定。診断完了と教材合格を区別する |
| 事例取得 | `scoped_catalog.py`で版・科目・modeを確認。モデル不在時は全該当事例を順位なしで渡す | 各事例の適用・保護・適用外の理由を記録。モデル実行や学習を偽らない |
| R04/C05の設計検査 | production IRの条件・依存・穴・定義語・等式group・可視状態を検査 | 必要な判断を選び、誘導文・穴・式・参照を設計する |
| 承認から生成へ | `materialization.py`が原版提案と添付設計をGit commitで照合し、同一承認へ生成IRと差分を結ぶ | 生成結果が承認案の実現かを確認。追加内容を承認扱いにしない |
| R06/C07 | strict IRを既存compileIRで生成。保存時のJSONキー順が変わっても同じIR hash。N07では生成artifact・採点・段階・revisionを保護 | 実装の範囲を確認。元の教材本文を勝手に増やさない |
| R07/G2 | 実reader全41nodeの前後描画、四幅の全36正答・全誤答、前結果・履歴・移行・数式描画・番号衝突を実行 | 原症状・原資料・実画像を照合する。同じAIの再確認を独立AI監査とは呼ばない |
| G3 | 検証済みsourceを既存Pagesへ固定し、release.jsonと実配信を照合 | ユーザーへ直接URLを渡す。内部検査をユーザー受入へ変換しない |
| 受入後のR08/L01 | 元の否定例へ修正証拠・回帰規則を結ぶ | 評価の対象と観点を判定する。設計承認・fixtureを肯定学習例にしない |

N07の変換器は旧教材の限定adapterであり、全教材を自動移行したものではない。新規作成には既存のproduction IR工程を使う。モデルはOFFLINE_ONLYのまま、今回fit・昇格はしていない。

検証済みcode: `46ea59be61a177bf98edc9f6d26eb6fa7e52b0a6`、CI `40154122715` SUCCESS。129 workflow、620 applicable learner、39 authoring、6 repair Node checks。公開と受入の実際の状態はPUBLICATION_CHECKPOINT.jsonとgenerated/CURRENT_POSITION.mdを見る。

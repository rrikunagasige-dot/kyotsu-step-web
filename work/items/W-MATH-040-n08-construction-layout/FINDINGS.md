# W040 Findings

FIXED: 完成式選択のみだった11か所へ15の型付き式中部品を適用。与値を書き写すだけの代入は手本化。元問題・規則・符号・場合の境界を保持。

FIXED: 負数因子の括弧、途中部品の再編集、手本重複、preview保存、ResizeObserver同期ループ、Q09注の孤立改行、reset後の旧22回答復活。否定テスト・実操作・相互画像確認を対応させた。

RETAINED_FAILURES: c479のCIはpandoc不足、2293は採取対象rowの曖昧さで失敗。e732で修正。ローカルN11 symlink-font403を成功に数えず、クリーンCIの全4幅結果で照合。

OPEN_USER_EVALUATION: 内部合格と公開は本人のr6受入ではない。追加fit/Goldなし。公開後確認と本人評価、その後の事後sweep/R08/L01を既存工程で扱う。

# 調査資料と採用範囲

調査日：2026-10-26。外部資料は分析・構造の参考。新しい教材本文の大量転載・モデル学習への投入はしていない。

## R1 — mathstepsの実際の構造

- https://github.com/google/mathsteps
- https://github.com/google/mathsteps/wiki/How-to-use-mathsteps
- https://github.com/google/mathsteps/blob/master/lib/node/Status.js
- https://github.com/google/mathsteps/blob/master/lib/equation/Status.js

GitHub connectorで実コードを取得した。node StatusはchangeType/oldNode/newNode/substepsを持ち、局所変更を親の式へ戻す処理がある。equation StatusはoldEquation/newEquation/substepsを持ち、左右の局所計算を式全体へ投影する。この構造を「内部操作と表示まとまりを分離する」参考とする。

公式repoとmetadataでarchive状態を確認。owner archive日2024-08-29、metadata上のpushed_at2023-06-26。ライセンスはApache-2.0。MITと推測しない。今回はコードそのものを転用・依存導入していない。転用時には固定commitとライセンス/NOTICEを記録する。WikiのNodeStatus名と現在の実ファイルパスを混同しない。

## R2 — KaTeXの公式機能

https://katex.org/docs/supported.html

Environments/Other KaTeX Environments、Line Breaks、Unicodeの記述を確認。aligned/alignedatの複数行配置を参考にする。静的な式列の機能であり、Reactの対話slotや教育上のグループ境界を自動設計する機能ではない。現appの実際のTypesetFormula/行parserも別途読んでいる。

## R3 — MathLiveの識別子付き穴

https://mathlive.io/mathfield/guides/fill-in-the-blank/

readonlyの式の中に識別子付きpromptを置き、個別の値と状態を扱う公式例を確認。穴のIDと周辺の数式の分離を参考にする。既存の選択式UIを手入力MathLiveへ移行する提案ではない。

## R4 — SymPyの解集合と制限

https://docs.sympy.org/latest/guides/solving/reduce-inequalities-algebraically.html

ExamplesとLimitationsを確認。一変数の不等式の組合せを扱える一方、変数や式の種類に制限があり、解析的に処理できない場合がある。現プロジェクトはSymPy1.14.0で閉じたASTと対応範囲を固定している。公式CAS機能が存在するだけで現adapterが全機能対応済みとはしない。

## R5 — worked exampleから不完全例への移行

Renkl, A., Atkinson, R. K., Maier, U. H. (2000), From Example Study to Problem Solving: Smooth Transitions Help Learning.

https://psycharchives.org/en/item/869bfeac-4b1c-4114-9d44-bb61a198cfbe

著者・書誌と要旨を確認した。完成例から問題を自力で解く形へ、問題解決要素を徐々に増やす方法を検討しており、要旨では少なくとも近転移での学習結果が報告される。今回読んだ範囲は要旨で、全文の詳細実験条件まで読了したとは言わない。

採用：完全解法を保ち、支援・穴・提示単位を別に設計する考え方。非採用：一律の最適穴数、最適な空欄位置、本appの効果・自動適応が実証されたという主張。

関連書誌としてRenkl/Atkinson (2003) Structuring the Transition...とAtkinson/Renkl/Merrill (2003) Transitioning from Studying Examples...も検索で確認したが、読了していない全文の内容を根拠へ増やさない。

## R6 — 日本語の実際の解答の配置

- https://math.nakaken88.com/textbook/basic-linear-inequality-solution/
- https://www.geisya.or.jp/~mwm48961/kou3/ueq201.htm

直前の調査で、複数の変形を一つの式列へまとめる例と、説明が必要な箇所で文章を挟む例を確認済み。今回は「どの教科書でも同じ規則」と一般化せず、配置の実例として参照する。

今回のグループ種別・TG規則・blankRole・初回N11適用範囲は、本プロジェクトへの設計提案。上記文献の記述そのものや学習効果の保証ではない。

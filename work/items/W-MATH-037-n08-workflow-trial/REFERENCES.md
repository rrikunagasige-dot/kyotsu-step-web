# 今回照合した原典

2026年10月26日（日本時間）。第三者の本文・図をアプリや訓練集合へ転載しない。以下は設計の分析参照。

| 原典 | 確認位置・範囲 | 今回使う判断 | 制約 |
|---|---|---|---|
| 栃木県総合教育センター「絶対値の理解を深め、納得を促す指導の工夫」 | PDF p1概要、p2指導計画、p3以降ワークシートのテキスト層 | 定義を振り返り、言葉・数直線・式の意味をつなぐ | webのテキストを確認。原PDFの追加取得は502、画像取得はtimeout。図や空欄の視覚配置は確認できていない。特定校の実践であり効果を一般化しない |
| FTEXT 数学I「いろいろな数」 | 絶対値、定義3、定理4、問題4。取得HTMLのftext-b148/155/162/190以降 | 意味→符号→記号を外す→計算、条件別の性質 | text抽出は絶対値の縦線を失う箇所あり。原data-latexと照合した箇所だけを式の参考にする |
| OpenStax Intermediate Algebra 2e 1.2 | Absolute Value、Example1.12 | 距離と反対の数を区別し、手本と適用を分ける | 数値・本文は移植しない |
| Penn State MATH004 Lesson1 p7 | Real Number Line and Absolute Value | 記号の内側の計算と外側の負号を区別する | 内容利用は分析のみ |
| SymPy1.14.0公式Refine | refine_abs、refine_Pow | 条件を与えて初めて成り立つ変形を実装する | SymPyの簡約成功と教材の学習順序の妥当性は別検査 |

原典URL：

- https://www.tochigi-edu.ed.jp/center/cyosa/cyosakenkyu/kyokasido_h22/pdf/sugaku_01.pdf
- https://ftext.org/mathI/01-%E6%95%B0%E3%81%A8%E5%BC%8F/01-%E3%81%84%E3%82%8D%E3%81%84%E3%82%8D%E3%81%AA%E6%95%B0
- https://openstax.org/books/intermediate-algebra-2e/pages/1-2-integers
- https://courses.worldcampus.psu.edu/welcome/math004/001/content/lesson01/lesson01_07.html
- https://docs.sympy.org/latest/modules/assumptions/refine.html

取得HTMLのbyte hashはSOURCE_FETCH.json。全文HTMLと機械抽出の中間データは分析用cacheに置き、第三者本文をこの公開repositoryへ複製しない。数学の検証では、今回自身で記述した17の式・主張を使う。原資料の無許可転載や訓練利用を行わない。

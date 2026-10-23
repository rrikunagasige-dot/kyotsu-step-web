# 教材制作パイプラインの試作

W-GOV-010 / 0.1.0。六工程を、入力JSON→完全解法→穴と選択肢→HTML→検査結果として接続する。公開アプリとは独立し、本番の教材・履歴を変更しない。

## 実装した工程

| 工程 | 実行するコード | 機械の保証 | 残る意味の判断 |
|---|---|---|---|
| 構成 | engine.structure | 三つの大見出し、名称・順序、対象教材の収録、所属の重複・欠落 | 概念のまとまりと流れ |
| 解法 | engine.solve / verify_solution、math_core | 登録手順の必須段階、依存順、途中計算、原式と結論の一致 | パターンの適切さ、未登録解法、適用条件 |
| 空欄 | engine.bind_blanks | キーワードではなくstep.resultへ結合、単一対象、学習行為の指定 | 何を考えさせるか、支援量 |
| 選択肢 | engine.choices_for / verify_choices | 一つの誤操作から候補を作り、数学的重複・複数正答・表示不一致を拒否 | 誤答が理解の違いを捉えるか |
| 文章・図 | verify_prose_figures / template.html | 必須説明、図の目的・読み方・接続先・由来・表示順。式の結果を先出ししない表 | 自然な文章、図を使う必然性、読みやすさ |
| 最終確認 | test_engine.py / evaluate.py / browser_check.cjs | 数学、拒否動作、実画面の操作・幅・復元・履歴分離 | 独立した横断監査と既存のユーザー受入 |

単一AIの意味の審査は入力のsemantic_reviewに、設計ハッシュ・審査観点・注記を付けて保存する。設計が変わると審査はPENDINGへ戻る。これはユーザーの教材承認や独立審査を代行しない。

## 対応する範囲

二つのパターンをpatterns.jsonへ登録した。

1. (ax+b)(cx+d)：四つの積→各積の計算→xの項の整理→完成式。
2. m(ax+b)+n(cx+d)：各項へ分配→四つの計算→xの項と定数項の整理→完成式。

この初回パターンの入力係数は全て非零整数、絶対値100以下。結果としての相殺・ゼロは対応する。入力にゼロ係数を含む退化形は、学習行為と選択肢を別に設計する必要があるため未対応として止める。最初の追加試験でゼロ係数のケースに選択肢が不足することが判明し、無意味な誤答を足す代わりに、この適用条件を明示した。

数式検算器自体は、有理係数一変数多項式・次数8以下・非零定数での除算に限定する。三項式を含む積、置換、四因子、根号、変数を含む分母、多変数、証明、物理の一般解法は、この試作の生成パターンには未登録。推測して通さない。

教科書と練習は別入力・別の表示分岐を持つ。練習の試作1問は検証用の新規例であり、別チャットが担当する既存練習教材には適用していない。

## 入力の要点

- policy：大見出し数と承認済みの名称・順序。
- scope.expected_units：今回作る教材だけの完全リスト。章全体を覆うとは主張しない。
- themes：各教材の所属。
- lessons：元資料ID、元問題、original_expression、パターン名・版・パラメータ、本文、図。
- blank_targets：product1.result等。式の結果の一箇所を指定する。文字列の一括置換はしない。
- allowed_learning_actions：穴にすることを認める学習行為。
- semantic_review：AIによる意味の審査記録。承認済みの教材・正例ラベルとは別。

出力はcompiled.json、機械検査のreport.json、外部サービスなしで開くpreview.html。未対応または失敗ならプレイ可能な出力を作らず、前回の出力がある場合も.staleへ退避する。未生成の教材を黙って落としたプレビューにはしない。

## 実行

Python 3の標準ライブラリのみ。

```bash
python3 -m unittest discover -p 'test_engine.py' -v
python3 evaluate.py
python3 make_examples.py
python3 engine.py example_textbook.json --out output/textbook
python3 engine.py example_practice.json --out output/practice
```

実画面の試験は、リポジトリの固定ロックファイルに従って依存を導入した環境で実行する。

```bash
node work/items/W-GOV-010-coded-authoring/engine/browser_check.cjs
```

専用CI .github/workflows/coded-authoring-prototype.ymlはこの作業ブランチだけで実行し、ブラウザ証拠を保存する。公開処理、書込権限、シークレットの追加はない。既存のPages workflowを変更しない。

## 効果の読み方

今回の十件は、旧画面を自動解析したのではなく、指摘を構造化して再現した試験である。機械的拒否5、未登録3、意味の審査待ち2となる。自動拒否できる欠落と、AIの判断が残る問題を分離できたことを確認する。

追加合成問題120例と、故意に壊した途中式20例を別に測定する。これらは開発に使った技術試験であり、独立した未使用教材での品質評価ではない。過去36件のうち確認待ちの正例は学習に使わない。誤り削減率や学習効果は未測定。

詳しい結果と検証SHAは、同Work直下のIMPLEMENTATION_RESULTS.md / VERIFICATION.mdを参照する。

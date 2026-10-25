# N08の分析結果

Status: SOURCE_AND_BASELINE_CONFIRMED / 修正案あり・実装前。

## 保持すべき既存の良さ

36node/31回答、距離の定義、符号からの規則選択、括弧の全体、前結果と全文履歴、条件付きの場合分け、元図は既に存在する。W033での本人の単元全体受入を保持する。過去の旧版への否定を、この現行版に再適用しない。
旧CANDIDATE_IRを現compilerで再生成し、authored.semanticと完全一致、irHash32f20c55も一致した。単にJSON文字列をhashするとschema既定値の正規化前後で異なるため、実compilerのirHashと出力で結んだ。

| ID | 確認したこと | 根拠 | 判断 |
|---|---|---|---|
| F01 | 同じ例題Q05〜07のsource questionが途中で√5−3の符号判定へ置き換わる | stage06の実DOM・320/390画像 | 原問を保持するproblem contextを追加する |
| F02 | Q08〜09も中身3−πと絶対値の問が別ページ扱い | stage08実DOM | 原問|3−π|と与条件を共通にする |
| F03 | 制作方針の文が学習本文として出る | n08-definitionのafter「未知の名前を当てさせず、ここで定義します」、実画像 | 学習者向けの意味の説明へ置換 |
| F04 | 各項への分配を式として書かず、全体の計算結果の穴へ進む | n08-q07-distribute/q09-distribute before/after | 未計算の分配式を1段加え、既存の穴を保つ |
| F05 | Q06/Q08は同じ数を両辺から引く途中式を作る回答がない | node inventory | 共有穴の式生成を各1回答追加 |
| F06 | 別の例の具体的な答えが前提欄に入る参照がある | n08-q08-order→n08-07-result、q10-forward→n08-09-result等 | 手順の再利用と数値結果の依存を分ける |
| F07 | Q03には等式自体は真だが目的の入力式と異なる選択肢がある | a−0=a、0+a=a。旧feedbackはこれを区別できている | 誤答としての扱いは正しい。新code側も目的/形を検査する必要 |
| F08 | 新graphのASTにAbs/根号/πがない | ENGINE_SCOPE_CHECK、3つの表現canary | N08数学の誤りではなく制作側の未対応 |
| F09 | N08の一般性質は条件別の証明と境界を扱う | Q10〜12 | 一般分岐を直線的な式変形へ潰さない。限定caseJoinを設計 |
| F10 | 参照HTMLのtext抽出で絶対値の縦線が消える | FTEXT原TeXと通常textの不一致、HTML_MATH_LOSS.json | aria-labelだけで復元しない。根mathノードのTeXと原位置を保持する |
| F11 | research importで穴の役割と図の時点が戻り値から消える | RESEARCH_CONTRACT_GAP.json | 元reviewを保持し、共通codeの返却契約を修正対象に含める |

F01〜06は今回の目標から見た改善箇所、F07は保持すべき既存設計、F08〜11は新制作基盤の適用上の不足である。すべてを誤答や本人Gold否定と呼ばない。

## 実行と未実行

- 現行N08の320/390px全正答62操作・24stageを確認。改修後のQAではない。
- 現行production graphで表現できる部分計算3件PASS。
- 別のSymPy実験17件PASS。production adapterの接続済み証拠ではない。
- 原PDFの取得失敗と最初のローカルserver待機失敗を残した。serverは検査scriptと同じprocess treeで起動・終了する方式で再現を完了。
- 教材、共通コード、進捗、図のbyteは変更していない。新案の公開・受入・ML学習は未実施。

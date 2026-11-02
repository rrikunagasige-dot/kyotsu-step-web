# Proposals — W-MATH-046-n0910-approved-nine-continuation

## P-W046-UX-05 — 主判断を生徒に残し、確定後は自然な数式へ戻す

Status: PROPOSED
Created: 2026-11-02
Approved by user: NO
Implementation started: NO
Baseline: candidate source `66c8007b37cc12391c9df574b8ebbb1b95cf26f5` / feedback record `32139fa41e6632c1e95bf5147af9c030e7d4fed8`
N09 r6 compiled `470f137102936e6bb73ca3df835e8c9b27d19c5ce53a40879fe9c2dfa8499a3d` / N10 r4 compiled `3cfe95380892a1d7a34fdc3fa142448a9f953ddc983427c9626b4fbdd8b0b895`
Target: N09第7版（第6版から）／N10第5版（第4版から）

本書はUX04への本人要修正を受けた新しい具体案。UX04の承認は[その設計と承認記録](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/66c8007b37cc12391c9df574b8ebbb1b95cf26f5/work/items/W-MATH-046-n0910-approved-nine-continuation/PROPOSAL.md)として保持し、本案へ流用しない。現在の公開中教材はdb99a485（N09r5/N10r4）のまま。本案作成中の製品・main・公開変更はない。

## Problem / Need

本人は、正答後の第二因子(x＋4)だけが大きく空く表示と、中高生に基本的な＋4/−4の逆演算を別問として繰り返す設計を要修正とした。中心となる推論は、積が0である式から、各因子が0となる二条件を生徒が作ることだった。UX04はその条件を自動表示してorだけ問い、周辺の易しい操作を増やしていた。

原因は二つに分ける。教育面では、異なる演算を列挙することを、学年・既習事項・当該概念の主判断を評価する代わりにした。表示面では、正答済み数式にも44pxの操作用phantomを残し、括弧や分数等の構造寸法へ入れていた。旧技術PASSはこの二つの受入を証明していなかった。

## 既存基準と本案の判断基準

正本main `6bc54447ef015a2a579a56a5966ceb58a0600d3a` の [MASTER§8](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/6bc54447ef015a2a579a56a5966ceb58a0600d3a/docs/MASTER_APP_LESSONS.md#L251)、[§11](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/6bc54447ef015a2a579a56a5966ceb58a0600d3a/docs/MASTER_APP_LESSONS.md#L339)、[§§52–53](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/6bc54447ef015a2a579a56a5966ceb58a0600d3a/docs/MASTER_APP_LESSONS.md#L1240)を適用する。[数学SPEC§2/5](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/6bc54447ef015a2a579a56a5966ceb58a0600d3a/subjects/mathematics/textbook/SPEC.md#L49)の高校初学・習得直後/非自明という要約は、元の承認・MASTERを上書きしない。

1. 当該概念で初めて判断すること、既習事項を使って主要な式/条件を作ること、その理解を確かめる必要な計算/比較を採点対象とする。
2. 必要な途中式と根拠は示す。既習の逆演算・符号を全て独立穴にする必要はない。
3. 主判断の答えを前文・後続式・候補説明で先出ししない。未知の法則は教え、具体例への適用を生徒に残す。
4. N09Q08の平方計算/比較はMASTER§53の明示例として保持する。新しい関係を使う計算を、arithmeticだからと全てAUTOへ戻さない。
5. 正しい同値表現・因子順の交換を誤答にしない。一つの推論の結果である条件の組を問うことと、複数の独立推論を含む完成解法全体を当てさせることを区別する。
6. 穴の増減を品質目標にしない。主判断を奪わず、支援は既習内容・初回適用・転移によって変える。

[既存の18群/全86node監査](evidence/ux05-feedback/PEDAGOGY_AUDIT.md)から、以下の単元別契約で変更/維持を確定する。監査候補を全て機械的に実装する案ではない。

## 公式問題との照合

rootが実取得・レンダリングして確認した [EJU2021第1回C1 I問1](https://www.jasso.go.jp/ryugaku/eju/examinee/pastpaper_sample/__icsFiles/afieldfile/2022/01/28/2021_1question_math.pdf)（冊子数学−2）と [2025共通数学I,A第1問〔1〕](https://www.dnc.ac.jp/albums/abm.php?d=771&f=abm00005956.pdf&n=2025_op_26_sugaku1A.pdf)（冊子4–5頁）を、条件→式形成/因数分解→解/条件の判断という認知単位の参考にする。本教材の原問題を過去問へ置換しない。[出所/実見範囲](evidence/ux05-feedback/SOURCES.json)を保持し、子担当による原典の独立実見を捏造しない。

## Scope / Out of Scope

N09全41/N10全45nodeを、単元別詳細でKEEP/CHANGEへ対応する。各CHANGEの最初に表示する情報・完成解法・全候補/誤答理由・row/partの解放・旧part対応を確定する。KEEPは固定source66c8007bの同じIDの問い/型/正答/全候補/学習行為を保持する参照契約とし、無意味な再転記を避ける。

共有の正答後数式表示と状態別group計画は、N09/N10の現行/保管native版を影響対象に含める。教材の採点・意味を変えるのは各新revisionの承認対象だけ。保管教材の原データと記録は不変とし、共通rendererによる自然組版の修正を受けることは明示して検査する。

原問題/数値/図/source Word、N08の教材内容、他単元/他モードの設問、共通header・現在stage・番号付き選択肢・左下reset・連続した本文を保護する。新しいカードUI・初等計算ドリル群・別学力モード・依存/lock更新・governance改変を追加しない。main反映/公開/本人総合受入/Gold/fitは本案の承認範囲へ含めない。

## Proposed Solution — 単元別具体契約

次の二単元設計は本案の一部。完成解法は設計審査用であり、未回答の生徒へ初期表示する全文ではない。全候補表の正答印も制作資料のみで、生徒画面へ出さない。

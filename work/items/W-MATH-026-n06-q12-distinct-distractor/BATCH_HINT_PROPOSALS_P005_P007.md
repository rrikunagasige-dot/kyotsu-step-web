
## 2026-10-23 — latest authoritative five-item acceptance
User: **「続けていいよ。5件承認。　後仕事はまたどれぐらい残っているのか私に状況説明」**.
All five items in the [review sheet](../W-MATH-025-factor-hint-leak-qa-proposals/GATE1_FIVE_ITEM_REVIEW_20261023.md) are BLOCK-VISUAL-OK. This supersedes older pending/next-user-review statements below. No reapproval of these five is required. [Acceptance, evidence and remaining work](../W-MATH-025-factor-hint-leak-qa-proposals/FIVE_ITEM_ACCEPTANCE_20261023.md). Gate② remains OPEN; Gate③ is not ready.

# 次の5件へ進むための新3ヒント案
Status: APPROVED / exact3hint実装・専用QA済み / grouped visual pending
提示単位: 3案を一括で承認→3修正をまとめて技術確認→既存Q12choices/N14Q16と合わせ5件の実画面を一度に提示。
ユーザーの約5問まとめ提示指示は記録済み。Q12とQ16の実装承認は再要求しない。

## CURRENT — 2026-10-23 P005/P006/P007 direct batch approval
ユーザーはf73122d82b45e4c9ff4b04348383f121126a8322の「ヒント3件の変更案・変更前後」をリンクし、一括実行可否を尋ねた直後に **「いいよ」** と直接回答。P-005 N05Q06 / P-006 N07Q09 / P-007 N08Q05のexact3hint literalを **APPROVED** と記録。以前のQ06画像了承を流用したものではない。変更後文・各範囲/リスク/検証は不変。直前の「5問ずつ修正・検証・実画面をまとめ提示」指示も保持。
起点はDraft PR116 HEAD f73122d82b45e4c9ff4b04348383f121126a8322。独立した順次枝 `work/W-MATH-025-hints-p005-p007-batch-20261023` を使い、同ref実行中CIをcancelしない。3sourcefileに各1hintだけ、版/キー/選択肢/ID/履歴/図/schema/rendererは保持。Q12choicesとQ16を含む5件groupを完成後、一度に提示する。Q16は別PR111のrev10固定sourceであり、未承認の候補統合はしない。

共通範囲: 各指定qのhint literal1文のみ。問題文・数式・正答・全選択肢・他問・revision・ID・全進捗・図・renderer/CSS/schema・元Wordを変更しない。誤答後だけ表示されるヒントであり、問題本文や数式説明を置換しない。
教師Word SHA25693827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaaとOMMLを照合済み。具体的結果を与える旧hintを、計算/判断方法を案内する文へ変える。

## N05 Q06 / W025 P-005
問題: 原Word【6】は両端の項を単項式の平方として書く問い。4と3は、それぞれ係数16と9から求める数値であり、この問題より前では未計算。現ヒントが両方を直接示し、求める平方根の係数を先出ししている。

**変更前**
> 16は4の平方、9は3の平方。文字の指数にも注意する。

**変更後（この文だけ）**
> 両端の係数と文字の指数を別々に見て、それぞれ何を二乗すると元の項に戻るか確かめよう。

16=4²、9=3²、16x²=(4x)²、9y²=(3y)²。新案は数値4/3を含まない。中央項の照合は後続Q07/Q08に残す。
Q06の他フィールド、他19問、全原図、既受入Q11/Q18のヒントを保持。
revision2 / 原20問。元Word body paragraph209。リスク: 数値を教えなくなるため生徒自身の計算が必要になる。wrong→hint→retry/次問gate、通常保存とpreview無保存、320/390/1440、関連回帰を確認。
[各案全文](../W-MATH-025-factor-hint-leak-qa-proposals/PROPOSAL_P005.md)

## N07 Q09 / W025 P-006
問題: 原Word【9】と現行問題は0.696969…について最小の倍率を選び、差の等式を作る。現ヒントの100xは、選ばせる10/100/1000の中から正しい倍率100を先に教える。前の例は一桁周期8なので100は既答の再利用ではない。

**変更前**
> 100xとxの小数部分を揃え、左辺は100x−xにする。

**変更後（この文だけ）**
> 繰り返す数字の一周期が何桁か数えよう。その桁数だけ小数点を右へ動かして元の小数部分と揃え、差をとろう。

69は二桁の最小周期。10xの小数部分は.9696…で元と異なり、100xの小数部分は.6969…で一致。100x−x=69から99x=69。新案は100、完成した等式、最終分数を含まない。
Q09の原文・正答・全誤答・既承認の式の折返しを保持。Q10の23/33、他13問は変更しない。
revision3 / 原14問。元Word body paragraph305。リスク: 数値を教えなくなるため生徒自身の計算が必要になる。wrong→hint→retry/次問gate、通常保存とpreview無保存、320/390/1440、関連回帰を確認。
[各案全文](../W-MATH-025-factor-hint-leak-qa-proposals/PROPOSAL_P006.md)

## N08 Q05 / W025 P-007
問題: 原Word【5】は√5と3の大小を二乗した数の比較を添えて答える問い。現行leadも『二乗した値を自分で求めて比較』とする。現ヒントが比較に使う計算結果5と9の両方を先に与え、その計算を生徒から取り去る。原Wordの√はOMML radicalとして確認し、5と3そのものを比べる誤読を避けた。

**変更前**
> √5を二乗すると5、3を二乗すると9。二つとも非負なので大小の向きは保たれる。

**変更後（この文だけ）**
> 根号の付いた数は、二乗すると根号の中の数に戻る。もう一方も二乗し、二つの値を比べよう。両方とも非負なので大小の向きは保たれる。

(√5)²=5、3²=9、5<9、両方非負より√5<3。新案は具体的な計算結果5/9や完成した不等号を示さず、二乗と比較の手順を案内する。
Q05の他フィールド、他11問、数直線図、Q06以降の符号判定と絶対値計算を保持。
revision3 / 原12問。元Word body paragraph345。リスク: 数値を教えなくなるため生徒自身の計算が必要になる。wrong→hint→retry/次問gate、通常保存とpreview無保存、320/390/1440、関連回帰を確認。
[各案全文](../W-MATH-025-factor-hint-leak-qa-proposals/PROPOSAL_P007.md)

## 承認範囲
上記P-005/P-006/P-007の3文だけをまとめて承認するか確認する。新3案はこれまでユーザーへ全文リンクの存在だけを記録しており、Q06実画像への今回の了承は流用していない。
承認後に3件を実装・検証し、Q12choicesと別SHAのN14Q16を含む5件をまとめ提示する。各問の内部QAは省略しない。全体監査/通し確認とmain統合/公開は別に残る。

根拠: [WORK_SYSTEM §12B Gate2.4](../../../governance/WORK_SYSTEM.md)「Existing exact approval applies only if it genuinely covers that artifact and fix; otherwise submit a new or revised full proposal and await its explicit approval.」

### Latest implementation evidence
sourceb1025cab41342b7648acb191abadfa8aaaa66e5c、Review39902362044/Gov39902362009SUCCESS、72原画像8a3cfc05d173a92386f5bf8244fa28a1d31fabd1。全体Math39902361997もSUCCESS（240unit/254browser PASS、9explicit skips）。[5件の実画面を一括確認](../W-MATH-025-factor-hint-leak-qa-proposals/GATE1_FIVE_ITEM_REVIEW_20261023.md)。今回承認が必要なのは実装案ではなく、この5件の視覚受入。新規同根不具合は別exactscopeに従い、未検証をPASSにしない。

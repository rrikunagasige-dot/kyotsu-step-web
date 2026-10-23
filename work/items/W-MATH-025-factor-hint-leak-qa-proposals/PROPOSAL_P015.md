# P015 — N12確認画面の単元判定を安定させる

Status: PROPOSED / NOT APPROVED / NOT IMPLEMENTED
Command: CMD-WORK-001 修正
Parent learner source:22ccf559a70d758689b958c77d19f4c9cdd43b7e.

## 現象と原因
通常学習ではN12用の改行処理が有効、確認用の抜粋では無効になる。TextbookFormulaが`section.items.some(item=>item.id==='n12-01')`でN12を判定するため。extractReviewSectionは選んだ問題だけにitemsを絞り、Q06/Q12にはn12-01が入らない。unit.unitIdは抜粋後も保持されるため、これを表示判定に使う。

既存確認対象29件を、実検証済み14単元のruntimeと現在のextractReviewSectionで走査し、判定不一致はN12Q06係数欄とN12Q12符号付き係数欄の2件のみ。これは全モバイル画面の正しさを示す監査ではない。N12通常の32formulaブロックは現在すべてN12クラスあり。

実ブラウザ診断: source2bc979a20ea914e895f351a97b5129a763da5fed（教材コードは22ccと同一）、run39914505047/job120284878293 SUCCESS。2件×320/390/1440＝6実ケースPASS/6明示matrix skip。通常ではN12classあり、両確認抜粋ではなし、再読込後も同じ。CSSclassのみを一時適用する診断実験で、Q06の横超過は320px146px/390px76px→0px、Q12は320px68px→0px。Q12の390pxと両問1440pxはもともと横超過0px。320pxで穴へ移動後のscrollLeftはQ06 138px/Q12 42px、scrollLeftを0へ戻すと左側は戻る代わりに右側が画面外となる。欠落データではなく、N12専用表示が外れたことによる横スクロール。通常側の測定横超過は全6ケース0px。

この一時class実験はCSS機序の診断で、提案後の完成画面ではない。Q06のJSX上の矢印分割はclass追加だけでは再構成されず、320pxの実験画像では式が途中で分かれる。unitIdを使う実装後にJSXの分割も含めて改めて確認する。CSSclassの一時実験を最終UIの承認画像として扱わない。前後18原PNG＋6計測JSONのartifact12484555949/sha25624c5de021c860a5914290abc1a5c0518b4e86ee369f78251c64ae089c6063b62を原ZIPのまま保存。

[診断原画像と計測](./evidence/n12-display-diagnosis-20261023/README.md) / [全29対象の判定走査](./evidence/n12-display-diagnosis-20261023/source-impact.json)

## exact変更案

1. `src/components/textbook/TextbookFormula.tsx`:
   - Propsへ`unitId: string`を追加。
   - TextbookFormulaの引数にunitIdを受ける。
   - `const n12Formula = section.items.some((item) => item.id === 'n12-01')`を`const n12Formula = unitId === 'math-numbers-expressions-n12'`へ置き換える。
2. `src/pages/TextbookUnitPage.tsx`:
   - 既存TextbookFormula呼び出しに`unitId={unit.unitId}`を渡す。
3. meaningful regression test:
   - n12-01を含まない実N12抜粋でも専用classと既存矢印分割が保たれる。
   - 通常N12全32formulaの意味/部品とclassは不変。
   - 他単元はN12表示へ変わらない。review/normal320/390/1440、誤答前後/再読込/正答/保存を再確認。
4. すでに受入済み7件のreviewStateをacceptedへ反映し、次のレビューで旧7マーカーを外す（受入記録に基づく通常の後処理、再承認不要）。新たな表示修正の確認マーカーは該当2件だけ別途表示する。

CSSの新規一括変更や、式/ヒント/正答/選択肢/ID/revision/履歴/本文/図の変更は含まない。既存N12用表示を、通常と抜粋で同じ単元IDに基づいて適用する限定修正。N14Q10/Q14/Q15等の個別折り返しは触らない。

## 期待結果と範囲の限界

N12の確認画面でも、通常学習と同じN12専用折り返しを使える。これだけで狭幅の全数式の適切さを保証しない。既存式の分割位置/矢印配置など別の問題を見つけた場合は、この承認に追加せず別finding/exact提案に戻す。

## 検証と完了条件

exact source/原画像/DOM計測、N12通常32formula、29確認target分類、他数学・物理表示回帰、保存不変、既承認7マーカー非表示。個別2件はまとめて新実画面を提示する。全章Gate②は他のFAIL/UNVERIFIEDが閉じるまでOPEN。main統合/公開は含まない。

## Authorization

今回の「じゃ続けて」は直前7ヒントの視覚受入と次の監査継続。P015のrenderer書換えは新scopeであり、指示辞書CMD-WORK-001の「承認済み修正案が存在しない場合、実装してはならない」に従い、提案と証拠を先に提示する。P015への明示承認後に限定実装。

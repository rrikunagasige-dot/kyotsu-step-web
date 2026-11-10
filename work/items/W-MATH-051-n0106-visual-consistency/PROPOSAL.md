# Current record reconciliation — W-MATH-051 / PROPOSAL.md

Status: BLOCKED
Record-Scope: Metadata/provenance restoration only; no product or Store mutation.
Fixed-Candidate: 84f90ba9d6c7fea8ebbaed976fc0de68aaa0c91b
Work-State: BLOCKED

Historical record recovery remains blocked: exact current scope/approval/verification mapping is incomplete; no approval, completion, or learner acceptance is inferred. Only P005 is closed; parent W051/P004 and separate N04/N06/function findings stay open.

Evidence:
- Store approval event 816e1846-7b33-416f-b7eb-7a36d1a1fce2, proposal_hash=fd5524d507112335ade94247c1c61c487bf488b8f8c4a5b97e983b03a38359e9 (historical, no new quote)
- Store approval event c97a1175-3e3a-4a39-8da2-74b9cf371ca8, proposal_hash=7de678681b12b5c53cdb2d37863455aa380ce2fe312b948aee9927ae12f0ced0 (historical, no new quote)

Original-Body-Source: existing untracked physical recovery record
Original-Git-Body-SHA256: ABSENT
Original-Physical-Body-SHA256: fd5524d507112335ade94247c1c61c487bf488b8f8c4a5b97e983b03a38359e9

<!-- HISTORICAL ORIGINAL BODY START — bytes below preserved exactly; current metadata is above -->
# P-W051-002：前半教材の表示を、本文から回答後まで揃える

状態：改訂した具体案。未承認・製品未適用・未公開。

対象Work：`W-MATH-051-n0106-visual-consistency`。前案P-W051-001は履歴として保持し、今回の承認対象へ流用しない。説明は日本語で行う。

## 何を直すか

N01–N06の現行6版・62段階を対象とする。見出しの左詰まり、導出枠の消失、数学字体の混在に加え、問いだけの縮小、参照・確定結果の文字寸法、役割ラベルの漏れを修正する。N07以降をそのままコピーせず、役割が同じ部分の読みやすさを合わせる。

| 対象 | 固定する変更 |
|---|---|
| 段階見出し | 青い左線から文字まで左右12pxの余白を戻す。文言と段階数を維持 |
| 本文中の数学 | 前案の279個のparts配列・575数学片を明示math partsへ。日本語、元のmath/choice/term partsと並びを保持 |
| 本文外の数学 | 354表示文脈・319種類の原文を固定辞書へ。問い156、元ヒント166、小見出し4、段階名12、文字列型の候補・完成回答10文脈（4判断）、回答別説明6。数学片528個を明示して表示 |
| 問い・ヒント | 主たる文を18px・行高1.8へ。回答別説明と元ヒントは個別に数式化してから連結。短い「ヒント」ラベルは拡大しない |
| 確定結果・前段参照・展開履歴 | 読み直す主本文を18px・行高1.8へ。同じ説明が表示場所によって16pxや13.76pxへ縮む経路を補修 |
| 役割ラベル | 例題・導出・確認を後半にある小枠ラベルの寸法へ統一。まとめは上位見出しとして維持 |
| 導出群 | 既存の連続derivationIdごとに細枠・青い左線・12pxの内側余白を戻す。式ごとに新しい枠を増やさない |

例：問いの「−2xの数の部分を、符号も含めて入れます。」は、語句を変えずに「−2x」のみKaTeXへ渡す。数式用フォントを日本語全体へ当てる方法や、実行時の無差別な正規表現置換は使わない。

型がtextの理由選択も採点用の文字列をそのまま保持し、選択肢・正答後・参照の表示だけを対応させる。意図的な誤答候補の式を正しい式へ書き換えない。

## 対象版と適用範囲

| 単元 | 保存revision | 段階数 |
|---|---:|---:|
| N01 | 7 | 15 |
| N02 | 6 | 9 |
| N03 | 7 | 7 |
| N04 | 7 | 12 |
| N05 | 7 | 9 |
| N06 | 8 | 10 |

PageはunitIdとrevisionが上表に完全一致する場合だけ表示契約を有効にする。閉じた過去段階の確定結果にも届くよう、現在段階だけの属性ではなく、同じ単元のarticleに専用属性を付ける。

具体的な製品差分は、次の7ファイルに固定する。

1. `src/data/textbook/math/numbers/firstSectionTeaching.json`
2. `src/data/textbook/math/numbers/n0106SemanticDisplay.json`（新規・表示専用辞書）
3. `src/components/textbook/N0106SemanticText.tsx`（新規・対象版の明示表示）
4. `src/pages/TextbookUnitPage.tsx`
5. `src/components/textbook/TextbookFormula.tsx`
6. `src/components/textbook/n0106-reading-layout.css`
7. `src/components/textbook/n04-sample-reading.css`

固定差分は親Workの `feedback-layout-draft/revised-proposal/PATCH.json`。SHA256：`f9d8332d1a0caefcebf725b85d62c895f839daba7fccd2f9bd94f9be4ce64e6a`。完全なbefore/afterと各ファイルのhashを含み、人が読む差分を`PATCH.diff`、after原文を`candidate/`に置く。

## 保持するもの

- 全251判断のID、正答、誤答候補、提示順、解放条件、保存revision、進捗・保存namespace・リセット。
- 元の式と数学的意味、既存の式番号・等号列・typesetting group・前提参照・結果参照。
- N07の専用表示と根号の代表ブロック、N08以降の承認済み表示、他教科・他モード。
- 既存の12/24/8pxのブロック間隔規則。ただし枠の12px内側余白が加わるため、群境界をまたぐ物理距離まで従来と同一とは主張しない。
- 現在の公開版。承認前には製品ファイルや公開先へ適用しない。

N06の定義式`X=x+2y`の連続表示は別の修正候補として残す。両式の番号1/2と後続の参照があるため、本案で片方を削除・非表示にはしない。同様に、後半にも残る通常文字の問いは関連修正一覧に残し、前半の具体案の承認を後半へ広げない。

## 提案段階で確認したこと

1. 本文279配列について、元のpointer・原文・既存partsとの対応を保持。本文外319原文も、元の日本語と数学の原substringへ可逆復元できることを確認。
2. 現行normalizerとロック済みKaTeX 0.16.47で、本文575片・本文外528片・数式内に入る混成回答10文を厳密解析。エラー0。
3. TSX候補3ファイルの構文検査でエラー0。これは型検査やアプリのbuildではない。
4. Aが表示データ、BがCSS、主担当が描画接続と統合を担当し、非作者による相互確認を実施。数学の除算記号が通常文字へ残る漏れと、既存CSSが問いの内側のspanを縮める漏れを発見し、候補を補修した。
5. 問いの子孫spanの補修は、KaTeXの指数・添字の縮尺を壊す高い詳細度での全体上書きを避けた。実寸は実装後に検査する。
6. 対象外のsrcファイル320個の保護manifestを固定。製品srcは今回未変更。

日本語の比較HTMLを用意する。実データ・候補CSS・KaTeXによる説明用の見本であり、複数の表示状態を並べたもの。実アプリの操作や自動改行を検証した結果ではない。

## 承認後に行うことと合格条件

R05で今回の案・hash・6単元の範囲を承認と照合し、独立した教材ブランチでR06の限定修正へ進む。既存の実行環境・正式記録を復元し、別版や過去の承認に付け替えない。

R07では次を実施する。

- **数理・保持検査**：全判断の採点値・順序・gate、式番号・参照・保存の一致。対象外の6単元以外と他モードを回帰確認。
- **4幅の実画面**：320/390/430/1440px。62段階の未回答、開いた選択肢、誤答とヒント、正答後、前段参照、履歴の要約と展開、単元完了を対象にする。
- **寸法**：見出し左右12px、主本文・問い・ヒント本文18px/1.8、役割別ラベル、未回答箇所と回答選択肢の操作領域44px以上。KaTeX根と内部の指数・添字の寸法を区別して検査する。
- **配置**：枠の内側余白を戻した後の長式、句読点、inline数式の別行化、式番号と等号列、画面外へのはみ出し、必要な局所スクロール。
- **回答と保存**：正答・誤答・再試行・再読込・履歴・リセット。表示用partsを採点値や保存値へ混ぜない。
- **見本との照合**：後半N09/N10の役割ラベルと主本文、N13/N14の導出群を同じ役割として比較する。CSSの値どおりかだけで合格にしない。

G2の横断確認後、既存の公開方法で反映し、実配信source・対象route・配信ファイルを照合して実アプリのURLを提示する。既存の公開許可は取り直さず、本人の実物受入と機械検査の合格は分けて記録する。

今回の承認対象は本書と固定7ファイル差分・保持条件・検証条件。実装中に意味や範囲が変わる必要が出た場合は、変更部分の具体案を示してから進める。

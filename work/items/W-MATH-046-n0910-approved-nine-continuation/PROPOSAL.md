# Proposals — W-MATH-046-n0910-approved-nine-continuation

## P-W046-UX-04 — 導出の各判断を生徒が組み立てる

Status: PROPOSED
Created: 2026-11-02
Baseline: app source `db99a485f857b1aefa7fb738456f36a830514158`（公開中N09第5版・N10第4版）
Target: N09第6版・N10第5版
Approved by user: NO
Implementation started: NO

読み順：変更の見取り図 → N09/N10の各詳細（写真はn09-01）→ 全86node表 → 保存移行・実装順・検証・Approval。

## Problem / Need

本人は排版を高く評価した一方、写真の場面では一つの穴の回答後に、別の判断を必要とする式変形まで自動表示されると指摘した。現行n09-01は零積の「または」だけが穴で、移項・因数分解・二つの一次式の処理は生徒が行わない。直前の負数の平方も、累乗を積に直す操作と符号の処理を自動化していた。

原因は「式が段階表示されること」を「生徒が導出すること」の代わりに評価し、完成解法に含まれる非自明な操作と各問いの対応を検査しなかったこと。穴の総数の不足という数値問題ではない。既存の描画・操作・保存の技術PASSを維持するが、導出参加度の合格根拠にはしない。

[UX03承認設計](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/85a53672826fb204a7e182f56b975d80b4727747/work/items/W-MATH-046-n0910-approved-nine-continuation/PROPOSAL.md)と[実装・公開後の記録](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/6fd8083b01759ecbeeed8c2f37b38e447638a659/work/items/W-MATH-046-n0910-approved-nine-continuation/WORK.md)は履歴として保存する。UX03の承認は今回の新しい意味変更への承認に転用しない。

## 既存基準との照合

正本はmain `6bc54447ef015a2a579a56a5966ceb58a0600d3a`。候補branchにある別版のgovernanceを正本として置換しない。

| 既存の規則 | 今回の適用 |
|---|---|
| [MASTER §8](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/6bc54447ef015a2a579a56a5966ceb58a0600d3a/docs/MASTER_APP_LESSONS.md#L251) | 穴を学習行為で評価する。既知の値の写し直しや任意の穴増量を避ける。 |
| [MASTER §11](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/6bc54447ef015a2a579a56a5966ceb58a0600d3a/docs/MASTER_APP_LESSONS.md#L339) | 途中式の提示と、変形を学習者に行わせることを区別する。 |
| [MASTER §§52–53](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/6bc54447ef015a2a579a56a5966ceb58a0600d3a/docs/MASTER_APP_LESSONS.md#L1240) | 完成解法の計算・比較・変形を飛ばさず、問い・型・答えの整合、答えの先出し、旧進捗、前後の密度を小ブロックで検査する。 |
| [数学SPEC §5](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/6bc54447ef015a2a579a56a5966ceb58a0600d3a/subjects/mathematics/textbook/SPEC.md#L109) | 複数の非自明な変形を一つの回答で飛ばさない。これは候補要約であり、上記の正本を上書きしない。 |
| [CMD-WORK-001](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/6bc54447ef015a2a579a56a5966ceb58a0600d3a/governance/INSTRUCTION_DICTIONARY.md#L234) | 写真の箇所の原因からN09全41・N10全45nodeへ同型監査を広げ、確定対象を以下で限定する。他教材を無承認で一括変更しない。 |

新しい教訓を重複追加するのでなく、既存規則の適用漏れとしてF-UX03-11を修正する。

## Proposed Solution

完成した正しい導出を先に定め、その各操作を「提示してよい定義・既知の結果」「生徒が今行う組立て・計算・比較」「確定後のまとめ」に対応づける。新しい操作はその直前までの情報だけで解ける問いにし、正答後にその結果を用いて次の操作へ進む。未回答の後続変形は見せない。既知の定義や正答済み結果を写す穴は増やさない。

写真の場面では、右辺を0にする演算、中項が相殺する因数の符号、零積の論理、二つの一次式の逆演算を別々に行わせる。因数や数値が既に与えられていることと、どの操作で式を変えるかを区別する。以下の単元別詳細は完成本文・全候補・誤答理由・解放条件まで含む本案の一部である。JSONは同じ設計の照合用とし、実装データそのものではない。

## Scope / Out of Scope

対象は以下の全86node表で明示する。N09の優先8＋追加確認6、N10の9群13nodeを検討し、各項目で変更または理由付き維持を確定する。変更対象以外の問い・型・正答・候補・学習行為を維持する。既に良い積・商の証明、√125の三判断、符号付き分配、既確定のまとめは保護する。

N08に揃えた共通画面、選択肢の番号・配置、左下リセット、原問題・原数値・図・source Word、他単元・他モード、依存package/lockの更新、governance改変は対象外。共有rendererの修正は既存行契約で表せない確定理由がある場合だけとし、別の表示方式を新設しない。今回は提案書の作成と審査で、製品・main・公開内容は変更しない。

## 表示・解放の共通契約

- 各node内のpart順、rowの前提、node間の結果依存を明記する。前の問いの正答だけで別の未回答操作を解決済みにしない。
- lead・assumptions・extras・選択肢フィードバック・履歴にも未回答の答えを先出ししない。誤答時はその操作の理由だけを説明する。
- 定義や利用可能な既知結果を明示してよい。今回問う変形の答えを前置きで説明しない。
- 正答後は同じ導出の途中式として結果を残し、末尾の重複表示を避ける。足場行は全対象partが正答した場合だけ消す。既存`hideAfterCorrectKeys`の非空・重複なし・行part全体一致条件を維持する。mirrorの参照を失わない。
- 未回答の「…」行が完了後に残らず、異なる量を偽の等号でつながない。式の分子と分数全体、積の因子と指数の作用範囲を区別する。
- 18px数式・44px操作域・中立幅の計測とsemantic groupを維持する。分数・根号・累乗・単項符号・最初の等号・不等号鎖の途中を恣意的に切らず、式番号と括弧の衝突も検査する。
- 選択肢は現在の計算の直後。連続した紙面の導出として読める配置を維持し、説明のカード増設や小問画面の分断で解決しない。

## 変更の見取り図

| 場面 | 現行の不足 | 本案で生徒が行うこと |
|---|---|---|
| N09：負数の平方・全解（写真） | 積・符号・移項・因数分解・一次式処理が自動 | 累乗の対象→積の符号→右辺を0にする共通演算→因子の符号→零積→左右それぞれの逆演算。 |
| N09：負の根号の平方・√(−4)²・a<0 | 公式の適用や作用範囲を説明だけで済ませる | 負号を因子にする→積の各因子を平方する。既出16の再計算は作用範囲の判断へ変更。文字式へ同じ操作を移す。 |
| N09：差の全体の符号 | 本文が「差の全体」と答えている | 中身の符号から非負にする操作を選び、確定後に括弧付きの負号を示す。 |
| N09：1.41²・1.42² | 分数の平方と中項の構成が自動 | 分子/分母への平方→分配した交差項→二つの同類項をまとめる。右側では足場を減らし中項を構成する。補助値は参照する。 |
| N09：整数部分・小数部分 | 定義からrや区間を取り出す操作が自動 | rを孤立させる共通演算→区間への加算、負数の括弧処理→定義適合、負の乗算→不等号反転。 |
| N09：±√10の小数部分 | 残りの式一穴で、残りの範囲まで自動 | 残りの式の操作→符号付き項の整理→区間全体への共通移動。整数3/−4の写し直しはしない。 |
| N10：t√5の平方・t²の取り出し | tの二因子のまとめと「5で割る」を先書き | 同じtの積を指数へ→両辺の除数を判断→商を計算。 |
| N10：√8・√50 | 平方因子の選択後、残りの因子2が自動 | 平方因子→残りの因子→根号外の係数。因子2と係数2を別の意味として扱う。 |
| N10：2√2＋5√2 | 共通因子の括り出しが自動 | 共通する√2を括り出す→係数を加算。 |
| N10：差の平方・定数の整理 | 中項の公式やまとめる項を与える | 符号付き第二項→交差積→負×負→二つの交差項をまとめる。根号を含まない二項の選択後に加算する。 |
| N10：和と差の積 | 中項の相殺を見せず「−」だけ問う | 二つの交差項の符号→その和0→平方差へ。既出となる旧「−」は問わない。 |
| N10：二つの有理化 | 分母全体への掛け算の組立てが自動 | 元の分子と分母全体を別々に束縛して積を作る。既に選んだ因子を再び当てさせない。 |
| N10：2−√3の非零確認と展開 | 4/3を先に示して後でまた問う | 平方は初めて必要な非零確認で計算。後の展開で参照し、符号込みの交差項の和−4を生徒が求める。 |

# P-W046-UX-04 — N09 14nodeの詳細設計（作者案）

**提案のみ・実装未承認。** source db99a485、N09 r5 → r6予定。

## 方針

- 穴数を合格基準にしない。各新しい変形を操作・作用範囲・因子・符号・条件確認のどれとして本人が行うかを先に決める。
- 既出値・確定済み同一計算は参照とする。定義・与える方針と、本人に求める判断を区別する。
- 同じ学習行為の既存partはKEEP。思考操作が変われば別keyでNEW、旧partはRETIREとして記録保存。
- rowsは候補表示の正確template。正答前にdependsOnKeysが不足したrow・完成条件・terminalRecordを出さない。
- text rowsへ数学の新しい記法を無理に埋め込まない。本文inline数式は既存MathCopyを使い、正確な式はmath rowで保持。
- 同じUI/排版、現在stage、直後選択肢、左下reset、neutral envelope、軸groupを維持する。新UIは作らない。
- hideAfterCorrectKeysは足場行の全partKeysと集合一致する場合のみ。初期・誤答は保持し、正答後に完成行へ置換する。
- 提案書上のcorrectInProposalOnlyは学習画面へ出さない。数学的別解を不当に誤りとしない。

## n09-q01-negative — CHANGE

末尾16だけの穴を、操作・符号・値に分ける。

### 穴なしの完成解法

(−4)²は−4全体を二回掛ける操作である。(−4)²=(−4)×(−4)=+(4×4)=16。

### 最初に提示する本文・条件

正の候補に続き、負の候補も調べます。括弧と指数の作用を先に決めましょう。

条件：追加の完成条件を先書きしない。既存の必要な前提だけを参照。

### 正確な表示行と解放

| 行ID | 種別 | template | 正答前提 | 正答後に置換する足場 |
|---|---|---|---|---|
| n09-q01-negative::ux04-row-01 | text | `2乗の操作は、{powerAction}。` | 初期 | なし |
| n09-q01-negative::ux04-row-02 | math | `(-4)^2=(-4)\times(-4)` | powerAction | なし |
| n09-q01-negative::ux04-row-03 | math | `={productSign}(4\times4)` | powerAction | なし |
| n09-q01-negative::ux04-row-04 | math | `={value}` | powerAction, productSign | なし |

### 穴ごとの詳細


#### n09-q01-negative::powerAction — NEW

- 問い：(-4)²で、指数2が指定している操作を選びます。
- 種別・役割：text / power-scope-action
- 思考操作：累乗の作用範囲と反復乗算を選ぶ
- 根拠：直前の4²という手本と既習の累乗の定義。負号を含む括弧が対象。
- 位置：n09-q01-negative::ux04-row-01
- 前提：このnodeまでの既存前提
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-q01-negative::ux04-row-02, n09-q01-negative::ux04-row-03, n09-q01-negative::ux04-row-04
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `repeat-whole-base` | 負号を含む−4全体を、同じ二因子の積にする | 正答 | 2乗の基底は括弧内全体です。 |
| `leave-minus-outside` | 負号を外に残し、4だけを2乗する | 誤答 | 括弧の中に負号があります。−(4²)と(−4)²を区別してください。 |
| `multiply-by-two` | −4全体へ2を掛ける | 誤答 | 指数2は2倍ではありません。同じ基底を何因子掛けるかを表します。 |

#### n09-q01-negative::productSign — NEW

- 問い：二つの負の因子の積を、正の大きさ4×4と符号に分けます。
- 種別・役割：math / unary-sign
- 思考操作：二つの負の因子から積の符号を決定する
- 根拠：符号の乗法。既出16の記憶ではなく、その前の符号操作。
- 位置：n09-q01-negative::ux04-row-03
- 前提：powerAction
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-q01-negative::ux04-row-04
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `+` | + | 正答 | 負の因子が二つなので、積は正です。 |
| `-` | - | 誤答 | 負号の数を因子として確かめてください。負×負は負のままではありません。 |

#### n09-q01-negative::value — KEEP

- 問い：負の候補を2回掛けた値を計算します。
- 種別・役割：math / rational
- 思考操作：符号を含む平方値を計算する
- 根拠：元と同じ(−4)²の値。新しい操作を確定してから回答する。
- 位置：n09-q01-negative::ux04-row-04
- 前提：powerAction, productSign
- 後続候補（各行の前提が全て満たされた時のみ表示）：後続nodeの全解放条件成立後に進む
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `16` | 16 | 正答 | この結果を確定し、次の計算へ使います。 |
| `-16` | -16 | 誤答 | 負と負の積は正です。符号を積として扱います。 |
| `-8` | -8 | 誤答 | 2乗と2倍は別の操作です。 |

### 既存回答の意味対応

| ID | 判断 | 理由 |
|---|---|---|
| n09-q01-negative::value | KEEP | 問いの対象・型・正答・全候補・思考操作を保持。新しい前提の正答までは保留する。 |
| n09-q01-negative::powerAction | NEW | 新しい思考操作。既存IDの意味差替えをしない。 |
| n09-q01-negative::productSign | NEW | 新しい思考操作。既存IDの意味差替えをしない。 |

### 答え漏れ・接続の管理

- leadで「負号を含む全体を二回」と先に答えない。
- 積の符号はpowerActionだけでは埋めない。
- 既出の正の候補4・値16を未知の候補探しとして再提示しない。
- このnodeの全必須part正答後のみ。terminalRecord・履歴の完成解も同じgateを使う。

## n09-01 — CHANGE

zeroLogic一穴の前後で移項・因数分解・二つの一次式の処理まで自動実行していた。

### 穴なしの完成解法

x²=16 ⇔ x²−16=16−16=0 ⇔ x²−4²=0 ⇔ (x−4)(x＋4)=0。実数の零積よりx−4=0またはx＋4=0。前者の両辺に4を加えるとx=4、後者の両辺から4を引くとx=−4。各変形が同値で、零積で場合を尽くしたので、この二つが全解である。

### 最初に提示する本文・条件

候補を確かめるだけでは、他に解がないとはまだ言えません。方程式を同値に変形し、全ての場合を調べます。

条件：x\in\mathbb R

### 正確な表示行と解放

| 行ID | 種別 | template | 正答前提 | 正答後に置換する足場 |
|---|---|---|---|---|
| n09-01::ux04-row-01 | math | `x^2=16` | 初期 | なし |
| n09-01::ux04-row-02 | text | `両辺に行う演算：{balanceOperation}16` | 初期 | balanceOperation |
| n09-01::ux04-row-03 | math | `x^2{mirror:balanceOperation}16=16{mirror:balanceOperation}16=0` | balanceOperation | なし |
| n09-01::ux04-row-04 | text | `確定済みの平方を使って書き換えます。` | balanceOperation | なし |
| n09-01::ux04-row-05 | math | `x^2-4^2=0` | balanceOperation | なし |
| n09-01::ux04-row-06 | math | `\iff(x-4)(x{factorSign}4)=0` | balanceOperation | なし |
| n09-01::ux04-row-07 | math | `x-4=0\quad{zeroLogic}\quad x+4=0` | balanceOperation, factorSign | なし |
| n09-01::ux04-row-08 | text | `まず、第一因子が0になる場合を解きます。` | balanceOperation, factorSign, zeroLogic | なし |
| n09-01::ux04-row-09 | text | `両辺に行う演算：{leftInverseOperation}4` | balanceOperation, factorSign, zeroLogic | leftInverseOperation |
| n09-01::ux04-row-10 | math | `x-4+4=0+4\quad\Rightarrow\quad x=4` | balanceOperation, factorSign, zeroLogic, leftInverseOperation | なし |
| n09-01::ux04-row-11 | text | `次に、第二因子が0になる場合を解きます。` | balanceOperation, factorSign, zeroLogic, leftInverseOperation | なし |
| n09-01::ux04-row-12 | text | `両辺に行う演算：{rightInverseOperation}4` | balanceOperation, factorSign, zeroLogic, leftInverseOperation | rightInverseOperation |
| n09-01::ux04-row-13 | math | `x+4-4=0-4\quad\Rightarrow\quad x=-4` | balanceOperation, factorSign, zeroLogic, leftInverseOperation, rightInverseOperation | なし |
| n09-01::ux04-row-14 | text | `同値変形と零積の二つの場合で、他の解がないことまで確かめました。` | balanceOperation, factorSign, zeroLogic, leftInverseOperation, rightInverseOperation | なし |

### 穴ごとの詳細


#### n09-01::balanceOperation — NEW

- 問い：x²=16の両辺へ同じ数16をどう作用させれば、右辺を0にできますか。
- 種別・役割：math / equation-operation
- 思考操作：両辺に行う共通の逆演算を決める
- 根拠：等式の両辺に同じ数を加減しても同値であること。
- 位置：n09-01::ux04-row-02
- 前提：このnodeまでの既存前提
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-01::ux04-row-03, n09-01::ux04-row-04, n09-01::ux04-row-05, n09-01::ux04-row-06, n09-01::ux04-row-07, n09-01::ux04-row-08, n09-01::ux04-row-09, n09-01::ux04-row-10, n09-01::ux04-row-11, n09-01::ux04-row-12, n09-01::ux04-row-13, n09-01::ux04-row-14
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `-` | - | 正答 | 両辺から同じ16を引くと、同値な方程式になります。 |
| `+` | + | 誤答 | 右辺が32になり、0にする目的を満たしません。 |
| `\div` | ÷ | 誤答 | 右辺は1になります。ここでは0と等しい形を作ります。 |

#### n09-01::factorSign — NEW

- 問い：第一因子を(x−4)に固定します。x²−4²に戻るよう、第二因子(x□4)の演算を選びます。
- 種別・役割：math / difference-of-squares-factor-sign
- 思考操作：一方の因子を固定し、他方の因子の符号を式内で構成する
- 根拠：4²=16は確定済み。分配して中間項が相殺し、定数項の積が−16となる条件。第一因子固定は設問上の指定であり、逆順の因数分解を数学的に誤りとする意味ではない。
- 位置：n09-01::ux04-row-06
- 前提：balanceOperation
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-01::ux04-row-07, n09-01::ux04-row-08, n09-01::ux04-row-09, n09-01::ux04-row-10, n09-01::ux04-row-11, n09-01::ux04-row-12, n09-01::ux04-row-13, n09-01::ux04-row-14
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `+` | + | 正答 | (x−4)(x＋4)では二つの中間項が打ち消し合い、定数項の積が−16になります。 |
| `-` | - | 誤答 | (x−4)²では中間に−8xが残り、x²−16になりません。 |
| `\times` | × | 誤答 | 第二因子が4xでは、定数項−16を作れません。第一因子との積を確かめてください。 |

#### n09-01::zeroLogic — KEEP

- 問い：積が0になるには、二つの因子の条件をどう結びますか。
- 種別・役割：text / zero-product-logic
- 思考操作：零積の条件を「または」で結ぶ
- 根拠：元と同じ実数の零積。新しい因数分解完了後に利用。
- 位置：n09-01::ux04-row-07
- 前提：balanceOperation, factorSign
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-01::ux04-row-08, n09-01::ux04-row-09, n09-01::ux04-row-10, n09-01::ux04-row-11, n09-01::ux04-row-12, n09-01::ux04-row-13, n09-01::ux04-row-14
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `or` | または | 正答 | 一方の因子が0なら積は0です。 |
| `and` | かつ | 誤答 | 両方が同時に0である必要はありません。一方だけ0の積も調べてください。 |

#### n09-01::leftInverseOperation — NEW

- 問い：x−4=0の両辺へ4をどう作用させれば、左辺をxだけにできますか。
- 種別・役割：math / linear-equation-inverse-operation
- 思考操作：一次式からxを取り出す逆演算を選ぶ
- 根拠：等式の両辺への同じ加算。解4そのものは既出で写させない。
- 位置：n09-01::ux04-row-09
- 前提：balanceOperation, factorSign, zeroLogic
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-01::ux04-row-10, n09-01::ux04-row-11, n09-01::ux04-row-12, n09-01::ux04-row-13, n09-01::ux04-row-14
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `+` | + | 正答 | −4と＋4を相殺します。 |
| `-` | - | 誤答 | −4がさらに減り、x−8になります。 |
| `\times` | × | 誤答 | 式全体を4倍しても、定数項は消えません。 |

#### n09-01::rightInverseOperation — NEW

- 問い：x＋4=0の両辺へ4をどう作用させれば、左辺をxだけにできますか。
- 種別・役割：math / linear-equation-inverse-operation
- 思考操作：もう一方の一次式で逆向きの操作を選ぶ
- 根拠：左の枝と同じ等式の性質を、定数項＋4へ適用。
- 位置：n09-01::ux04-row-12
- 前提：balanceOperation, factorSign, zeroLogic, leftInverseOperation
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-01::ux04-row-13, n09-01::ux04-row-14
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `-` | - | 正答 | ＋4と−4を相殺します。 |
| `+` | + | 誤答 | 定数項が＋8となり、xだけになりません。 |
| `\div` | ÷ | 誤答 | 式全体を4で割っても、加えられている4を消す操作にはなりません。 |

### 既存回答の意味対応

| ID | 判断 | 理由 |
|---|---|---|
| n09-01::zeroLogic | KEEP | 問いの対象・型・正答・全候補・思考操作を保持。新しい前提の正答までは保留する。 |
| n09-01::balanceOperation | NEW | 新しい思考操作。既存IDの意味差替えをしない。 |
| n09-01::factorSign | NEW | 新しい思考操作。既存IDの意味差替えをしない。 |
| n09-01::leftInverseOperation | NEW | 新しい思考操作。既存IDの意味差替えをしない。 |
| n09-01::rightInverseOperation | NEW | 新しい思考操作。既存IDの意味差替えをしない。 |

### 答え漏れ・接続の管理

- 因数分解の完成式はfactorSign正答前に出さない。
- zeroLogic正答だけで二つの一次式の計算を完成させない。
- 「または」「両辺から16を引く」「一方は差で一方は和」をlead/条件で先書きしない。
- 設問で第一因子を(x−4)へ固定してから第二因子を構成する。逆順の正しい因数分解全体を候補から除いて誤り扱いする課題にはしない。
- 4と−4の再入力穴は作らない。新partは変形の選択を要求する。
- このnodeの全必須part正答後のみ。terminalRecord・履歴の完成解も同じgateを使う。

## n09-q02-negative-square — CHANGE

符号因子への分解と積の平方が無条件表示されていた。

### 穴なしの完成解法

−√5=(−1)√5。(−√5)²=(−1)²(√5)²。最初の因子の平方は1、根号因子の平方は5なので、全体は1×5=5。

### 最初に提示する本文・条件

根号の値を取る計算と、負号を含む数全体を2乗する計算を区別します。先に負号を因子として表し、平方の作用を決めます。

条件：追加の完成条件を先書きしない。既存の必要な前提だけを参照。

### 正確な表示行と解放

| 行ID | 種別 | template | 正答前提 | 正答後に置換する足場 |
|---|---|---|---|---|
| n09-q02-negative-square::ux04-row-01 | math | `-\sqrt5={signMultiplier}\times\sqrt5` | 初期 | なし |
| n09-q02-negative-square::ux04-row-02 | text | `積を2乗する操作は、{squaringRule}。` | signMultiplier | なし |
| n09-q02-negative-square::ux04-row-03 | math | `(-\sqrt5)^2=(-1)^2(\sqrt5)^2` | signMultiplier, squaringRule | なし |
| n09-q02-negative-square::ux04-row-04 | math | `(-1)^2={signFactor}` | signMultiplier, squaringRule | なし |
| n09-q02-negative-square::ux04-row-05 | math | `(\sqrt5)^2={rootFactorSquare}` | signMultiplier, squaringRule, signFactor | なし |
| n09-q02-negative-square::ux04-row-06 | math | `(-\sqrt5)^2=1\times5=5` | signMultiplier, squaringRule, signFactor, rootFactorSquare | なし |

### 穴ごとの詳細


#### n09-q02-negative-square::signMultiplier — NEW

- 問い：−√5を「ある数×√5」と書きます。符号を担う乗数を選びます。
- 種別・役割：math / unary-negation-factor
- 思考操作：負号を乗法の因子として構成する
- 根拠：−u=(−1)uという既習の負号の意味。
- 位置：n09-q02-negative-square::ux04-row-01
- 前提：このnodeまでの既存前提
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-q02-negative-square::ux04-row-02, n09-q02-negative-square::ux04-row-03, n09-q02-negative-square::ux04-row-04, n09-q02-negative-square::ux04-row-05, n09-q02-negative-square::ux04-row-06
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `-1` | -1 | 正答 | −1倍で√5の符号を反転します。 |
| `1` | 1 | 誤答 | 1倍では正の√5のままです。 |
| `-5` | -5 | 誤答 | √5の大きさまで5倍に変えてしまいます。 |

#### n09-q02-negative-square::squaringRule — NEW

- 問い：二つの因子の積全体を2乗するとき、どの操作をしますか。
- 種別・役割：text / product-square-action
- 思考操作：積の平方を二因子へ作用させる
- 根拠：実数の乗法の結合・交換と平方の定義。
- 位置：n09-q02-negative-square::ux04-row-02
- 前提：signMultiplier
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-q02-negative-square::ux04-row-03, n09-q02-negative-square::ux04-row-04, n09-q02-negative-square::ux04-row-05, n09-q02-negative-square::ux04-row-06
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `square-both-factors` | 各因子をそれぞれ2乗し、その二つを掛ける | 正答 | 積を二回掛け、因子をまとめると各因子の平方になります。 |
| `square-first-only` | 最初の因子だけを2乗する | 誤答 | 元の積は全体を二回掛けています。√5の因子も二回現れます。 |
| `double-both` | 各因子を2倍して掛ける | 誤答 | 2乗と2倍を区別してください。指数は同じ因子の反復です。 |

#### n09-q02-negative-square::signFactor — KEEP

- 問い：(-1)²を計算します。
- 種別・役割：math / rational
- 思考操作：符号を担う−1の平方を計算する
- 根拠：元と同じ(−1)²。
- 位置：n09-q02-negative-square::ux04-row-04
- 前提：signMultiplier, squaringRule
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-q02-negative-square::ux04-row-05, n09-q02-negative-square::ux04-row-06
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `1` | 1 | 正答 | この結果を確定し、次の計算へ使います。 |
| `-1` | -1 | 誤答 | 負号も2乗するので、−1を二回掛けます。 |
| `2` | 2 | 誤答 | 2乗と2倍を区別します。 |

#### n09-q02-negative-square::rootFactorSquare — NEW

- 問い：残る(√5)²を、平方根の定義から求めます。
- 種別・役割：math / root-definition-square
- 思考操作：根号因子の平方を定義から評価する
- 根拠：平方根の定義。旧valueは1×5の計算だったため意味を転用しない。
- 位置：n09-q02-negative-square::ux04-row-05
- 前提：signMultiplier, squaringRule, signFactor
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-q02-negative-square::ux04-row-06
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `5` | 5 | 正答 | √5は平方すると5になる非負の数です。 |
| `25` | 25 | 誤答 | √5の平方と、5の平方を混同しないでください。 |
| `\sqrt5` | √5 | 誤答 | 同じ数をそのまま残すのではなく、その平方を求めています。 |

### 既存回答の意味対応

| ID | 判断 | 理由 |
|---|---|---|
| n09-q02-negative-square::signFactor | KEEP | 問いの対象・型・正答・全候補・思考操作を保持。新しい前提の正答までは保留する。 |
| n09-q02-negative-square::value | RETIRE | 要求する判断を変更するため旧回答を新判断へ移さない。旧記録は出所付きで保存。 |
| n09-q02-negative-square::signMultiplier | NEW | 新しい思考操作。既存IDの意味差替えをしない。 |
| n09-q02-negative-square::squaringRule | NEW | 新しい思考操作。既存IDの意味差替えをしない。 |
| n09-q02-negative-square::rootFactorSquare | NEW | 新しい思考操作。既存IDの意味差替えをしない。 |

### 答え漏れ・接続の管理

- 旧valueの正答5をrootFactorSquareへ流用しない。
- (√5)²=5を新しい根号因子の問いより前にlead/条件/行へ出さない。
- 最終1×5は確定値の単純接続であり、新たな未知の計算として穴を増やさない。
- このnodeの全必須part正答後のみ。terminalRecord・履歴の完成解も同じgateを使う。

## n09-q03-inside — CHANGE

同じ16の再入力より、根号内外の処理順を転移課題にする。

### 穴なしの完成解法

√((−4)²)では、まず内側の(−4)²を評価する。既出の符号込みの平方計算により16なので、残る計算は√16である。非負の値の判断は次nodeで行う。

### 最初に提示する本文・条件

今度は平方の外側に根号があります。括弧・指数・根号の作用範囲を見て、先に行う操作を決めます。

条件：追加の完成条件を先書きしない。既存の必要な前提だけを参照。

### 正確な表示行と解放

| 行ID | 種別 | template | 正答前提 | 正答後に置換する足場 |
|---|---|---|---|---|
| n09-q03-inside::ux04-row-01 | text | `最初に処理するのは、{firstOperation}。` | 初期 | なし |
| n09-q03-inside::ux04-row-02 | math | `(-4)^2=16` | firstOperation | なし |
| n09-q03-inside::ux04-row-03 | math | `\sqrt{(-4)^2}=\sqrt{16}` | firstOperation | なし |

### 穴ごとの詳細


#### n09-q03-inside::firstOperation — NEW

- 問い：√((−4)²)の処理で、最初に評価する対象はどれですか。
- 種別・役割：text / nested-operation-order
- 思考操作：入れ子の作用範囲と先に処理する演算を選ぶ
- 根拠：既に自分で確定した(−4)²=16を、根号の内側へ使う。
- 位置：n09-q03-inside::ux04-row-01
- 前提：このnodeまでの既存前提
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-q03-inside::ux04-row-02, n09-q03-inside::ux04-row-03
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `inner-whole-square` | 根号の内側の、負号を含む(−4)全体の平方 | 正答 | 入れ子の内側の値を先に定めます。 |
| `take-root-of-negative` | 先に−4の平方根を取る | 誤答 | 根号の中身は−4ではなく(−4)²です。実数で√(−4)を作る計算ではありません。 |
| `double-negative` | −4を2倍する | 誤答 | 指数2は2倍ではありません。 |

### 既存回答の意味対応

| ID | 判断 | 理由 |
|---|---|---|
| n09-q03-inside::value | RETIRE | 要求する判断を変更するため旧回答を新判断へ移さない。旧記録は出所付きで保存。 |
| n09-q03-inside::firstOperation | NEW | 新しい思考操作。既存IDの意味差替えをしない。 |

### 答え漏れ・接続の管理

- 16はn09-q01-negativeで確定した結果として参照する。別の新しい平方計算を実施したと数えない。
- 次nodeの√16=4はまだ表示しない。
- このnodeの全必須part正答後のみ。terminalRecord・履歴の完成解も同じgateを使う。

## n09-q04-negative — CHANGE

符号一穴の正答で平方同一性まで自動実行していたため、一般化する操作を判断させる。

### 穴なしの完成解法

a<0より−a>0。−a=(−1)aに対し、(−a)²=(−1)²a²=1a²=a²。非負で平方がa²になる候補は−aなので、√(a²)=−a。

### 最初に提示する本文・条件

a<0のときの非負の候補を、符号と平方の両方から確かめます。

条件：a∈ℝ、a<0。

### 正確な表示行と解放

| 行ID | 種別 | template | 正答前提 | 正答後に置換する足場 |
|---|---|---|---|---|
| n09-q04-negative::ux04-row-01 | math | `-a{oppositeSign}0` | 初期 | なし |
| n09-q04-negative::ux04-row-02 | text | `平方を確かめる操作は、{signedSquareMethod}。` | oppositeSign | なし |
| n09-q04-negative::ux04-row-03 | math | `(-a)^2=(-1)^2a^2=a^2` | oppositeSign, signedSquareMethod | なし |
| n09-q04-negative::ux04-row-04 | math | `\sqrt{a^2}={value}` | oppositeSign, signedSquareMethod | なし |

### 穴ごとの詳細


#### n09-q04-negative::oppositeSign — KEEP

- 問い：a<0の両辺に−1を掛けると、−aと0の大小はどうなりますか。
- 種別・役割：math / relation
- 思考操作：負の乗法後の符号を判断する
- 根拠：元と同じa<0から−aと0の比較。
- 位置：n09-q04-negative::ux04-row-01
- 前提：このnodeまでの既存前提
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-q04-negative::ux04-row-02, n09-q04-negative::ux04-row-03, n09-q04-negative::ux04-row-04
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `>` | > | 正答 | この判断を確定し、次へ進みます。 |
| `<` | < | 誤答 | 負の数を掛けると不等号の向きが変わります。 |
| `=` | = | 誤答 | a<0なのでaは0ではありません。 |

#### n09-q04-negative::signedSquareMethod — NEW

- 問い：候補−aの平方を、先ほどの負号の因子の方法で確かめます。どの操作を使いますか。
- 種別・役割：text / signed-product-square-action
- 思考操作：数値例で確かめた負号因子の方法を文字へ転移する
- 根拠：−u=(−1)u、積の平方と(−1)²=1は前段で本人が確定。a<0では−a自体は正なので「−aと−aは負×負」と説明しない。
- 位置：n09-q04-negative::ux04-row-02
- 前提：oppositeSign
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-q04-negative::ux04-row-03, n09-q04-negative::ux04-row-04
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `factor-minus-one-and-square` | −aを(−1)aとみて、二つの因子それぞれに平方を作用させる | 正答 | 平方の外に負号を一つ残すのではなく、−1の因子も平方します。 |
| `keep-one-minus` | 平方の外へ負号を一つ残す | 誤答 | −a全体を二回掛けるので、−1の因子も二回あります。 |
| `negative-square-is-negative` | a<0なのでa²も負になるとする | 誤答 | 実数の平方は非負です。aの符号とa²の符号を混同しないでください。 |

#### n09-q04-negative::value — KEEP

- 問い：負のaの平方について、非負の方を選びます。
- 種別・役割：math / operand
- 思考操作：非負性と平方を満たす候補を同定する
- 根拠：元と同じ√(a²)の非負の値。
- 位置：n09-q04-negative::ux04-row-04
- 前提：oppositeSign, signedSquareMethod
- 後続候補（各行の前提が全て満たされた時のみ表示）：後続nodeの全解放条件成立後に進む
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `-a` | -a | 正答 | この結果を確定し、次の計算へ使います。 |
| `a` | a | 誤答 | a<0なのでa自身は根号の非負の値ではありません。 |
| `a^2` | a^2 | 誤答 | 元の平方と平方根を区別します。 |

### 既存回答の意味対応

| ID | 判断 | 理由 |
|---|---|---|
| n09-q04-negative::oppositeSign | KEEP | 問いの対象・型・正答・全候補・思考操作を保持。新しい前提の正答までは保留する。 |
| n09-q04-negative::value | KEEP | 問いの対象・型・正答・全候補・思考操作を保持。新しい前提の正答までは保留する。 |
| n09-q04-negative::signedSquareMethod | NEW | 新しい思考操作。既存IDの意味差替えをしない。 |

### 答え漏れ・接続の管理

- 平方同一性はsignedSquareMethodの正答前に表示しない。
- 新partを既存valueやoppositeSignへ置換しない。既存二partはKEEP。
- このnodeの全必須part正答後のみ。terminalRecord・履歴の完成解も同じgateを使う。

## n09-q07-negation — CHANGE

旧scopeはleadに書かれた差全体の写しになっていた。式を写す穴から、符号に応じた操作を選ぶ穴へ変更する。

### 穴なしの完成解法

√((2−√5)²)=|2−√5|。中身2−√5は負なので、差全体の符号を反転し、|2−√5|=−(2−√5)とする。分配と項の計算は次nodeで行う。

### 最初に提示する本文・条件

平方根と平方の関係を使って絶対値へ直します。確定した中身の符号から、必要な操作を決めます。

条件：2−√5<0。

### 正確な表示行と解放

| 行ID | 種別 | template | 正答前提 | 正答後に置換する足場 |
|---|---|---|---|---|
| n09-q07-negation::ux04-row-01 | math | `\sqrt{(2-\sqrt5)^2}=\|2-\sqrt5\|` | 初期 | なし |
| n09-q07-negation::ux04-row-02 | text | `非負の値にする操作は、{nonnegativeAction}。` | 初期 | なし |
| n09-q07-negation::ux04-row-03 | math | `\|2-\sqrt5\|=-(2-\sqrt5)` | nonnegativeAction | なし |

### 穴ごとの詳細


#### n09-q07-negation::nonnegativeAction — NEW

- 問い：中身2−√5<0と確定しています。|2−√5|を非負の数にするため、どの操作をしますか。
- 種別・役割：text / absolute-value-case-action
- 思考操作：中身の確定した符号から絶対値に行う操作を選ぶ
- 根拠：√(u²)=|u|と絶対値の非負性。
- 位置：n09-q07-negation::ux04-row-02
- 前提：このnodeまでの既存前提
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-q07-negation::ux04-row-03
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `negate-whole-difference` | 差全体の符号を反転する | 正答 | 負の数の符号を全体として反転すると、非負の絶対値になります。 |
| `keep-negative-difference` | 負の差をそのまま使う | 誤答 | 絶対値は非負です。確定した中身の符号と照合してください。 |
| `make-each-term-positive` | 二つの項を別々に正にして足す | 誤答 | 絶対値は差全体への作用です。\|2−√5\|と\|2\|＋\|−√5\|を同じにしてはいけません。 |

### 既存回答の意味対応

| ID | 判断 | 理由 |
|---|---|---|
| n09-q07-negation::scope | RETIRE | 要求する判断を変更するため旧回答を新判断へ移さない。旧記録は出所付きで保存。 |
| n09-q07-negation::nonnegativeAction | NEW | 新しい思考操作。既存IDの意味差替えをしない。 |

### 答え漏れ・接続の管理

- leadの「外の負号を掛ける対象は差全体」「u<0なら|u|=−u」をこの問いの直前の答えとして再掲しない。
- 次nodeの−1という乗数、分配後の−2＋√5、最終√5−2は表示しない。
- 旧scopeの式選択回答を、新しい操作選択の証拠へ流用しない。
- このnodeの全必須part正答後のみ。terminalRecord・履歴の完成解も同じgateを使う。

## n09-decimal-method — KEEP_REFERENCE_ONLY

このnodeの140²・1²・2²・100²は桁の大きい整数計算の補助値であり、和の平方の項構成という主目的ではない。値を写す穴は増やさない。次の左右nodeで分数平方・分配・中項構成を本人に行わせる。

### 穴なしの完成解法

1.41=141/100、1.42=142/100。補助値として140²=14²×100=19600、1²=1、2²=4、100²=10000を参照する。これらを使って次の左・右の平方を組み立てる。

### 最初に提示する本文・条件

小数を分数に直して平方を計算します。ここでは計算に使う補助値を参照用に示します。平方の項をどう作るかは、次で組み立てます。

条件：追加の完成条件を先書きしない。既存の必要な前提だけを参照。

### 正確な表示行と解放

| 行ID | 種別 | template | 正答前提 | 正答後に置換する足場 |
|---|---|---|---|---|
| n09-decimal-method::ux04-row-01 | math | `1.41=\frac{141}{100},\quad1.42=\frac{142}{100}` | 初期 | なし |
| n09-decimal-method::ux04-row-02 | math | `140^2=14^2\times100=19600` | 初期 | なし |
| n09-decimal-method::ux04-row-03 | math | `1^2=1,\quad2^2=4,\quad100^2=10000` | 初期 | なし |

### 穴ごとの詳細

新規・既存の採点穴を追加しない。上記理由で参照専用として維持する。

### 既存回答の意味対応

| ID | 判断 | 理由 |
|---|---|---|

### 答え漏れ・接続の管理

- 参照用の補助値を「本人が導出した」と記録しない。
- (140＋1)²や(140＋2)²の展開式はここで先出ししない。
- 参照専用node。新しい計算の本人実施済みとは数えない。

## n09-p001-q08-left-square — CHANGE

数値三穴はあるが、分数平方・分配・中項という計算の骨格が先に完成していた。

### 穴なしの完成解法

1.41²=(141/100)²=141²/100²。141=140＋1より、(140＋1)(140＋1)=140(140＋1)＋1(140＋1)=140²＋140×1＋1×140＋1²=140²＋2×140×1＋1²=19600＋280＋1=19881。したがって1.41²=19881/10000=1.9881。

### 最初に提示する本文・条件

左の1.41²を先に求めます。分子141を140＋1と分ける方針と補助値を使い、平方の各項を組み立てます。

条件：追加の完成条件を先書きしない。既存の必要な前提だけを参照。

### 正確な表示行と解放

| 行ID | 種別 | template | 正答前提 | 正答後に置換する足場 |
|---|---|---|---|---|
| n09-p001-q08-left-square::ux04-row-01 | math | `1.41^2=\left(\frac{141}{100}\right)^2` | 初期 | なし |
| n09-p001-q08-left-square::ux04-row-02 | text | `分数の平方では、{fractionSquareAction}。` | 初期 | なし |
| n09-p001-q08-left-square::ux04-row-03 | math | `1.41^2=\frac{141^2}{100^2}` | fractionSquareAction | なし |
| n09-p001-q08-left-square::ux04-row-04 | text | `ここからは分子の平方を計算します。141=140＋1です。` | fractionSquareAction | なし |
| n09-p001-q08-left-square::ux04-row-05 | math | `(140+1)^2=(140+1)(140+1)` | fractionSquareAction | なし |
| n09-p001-q08-left-square::ux04-row-06 | math | `=140(140+1){outerJoin}1(140+1)` | fractionSquareAction | なし |
| n09-p001-q08-left-square::ux04-row-07 | math | `=140^2+{crossProduct}+1\times140+1^2` | fractionSquareAction, outerJoin | なし |
| n09-p001-q08-left-square::ux04-row-08 | math | `=140^2+{crossCoefficient}\times140\times1+1^2` | fractionSquareAction, outerJoin, crossProduct | なし |
| n09-p001-q08-left-square::ux04-row-09 | math | `=19600+{L1}+1` | fractionSquareAction, outerJoin, crossProduct, crossCoefficient | なし |
| n09-p001-q08-left-square::ux04-row-10 | math | `=19600+{mirror:L1}+1={L2}` | fractionSquareAction, outerJoin, crossProduct, crossCoefficient, L1 | なし |
| n09-p001-q08-left-square::ux04-row-11 | text | `分子の計算が終わったので、元の分数全体へ戻します。` | fractionSquareAction, outerJoin, crossProduct, crossCoefficient, L1, L2 | なし |
| n09-p001-q08-left-square::ux04-row-12 | math | `1.41^2=\frac{ {mirror:L2} }{10000}={L3}` | fractionSquareAction, outerJoin, crossProduct, crossCoefficient, L1, L2 | なし |

### 穴ごとの詳細


#### n09-p001-q08-left-square::fractionSquareAction — NEW

- 問い：(141/100)²で、平方をどこへ作用させますか。
- 種別・役割：text / fraction-square-action
- 思考操作：分数全体の平方を上下の因子へ作用させる
- 根拠：分数の積と平方の定義。100²の値を写す質問ではない。
- 位置：n09-p001-q08-left-square::ux04-row-02
- 前提：このnodeまでの既存前提
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-p001-q08-left-square::ux04-row-03, n09-p001-q08-left-square::ux04-row-04, n09-p001-q08-left-square::ux04-row-05, n09-p001-q08-left-square::ux04-row-06, n09-p001-q08-left-square::ux04-row-07, n09-p001-q08-left-square::ux04-row-08, n09-p001-q08-left-square::ux04-row-09, n09-p001-q08-left-square::ux04-row-10, n09-p001-q08-left-square::ux04-row-11, n09-p001-q08-left-square::ux04-row-12
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `square-numerator-and-denominator` | 分子と分母の両方を2乗する | 正答 | 同じ分数を二回掛けると、上下とも同じ因子の二回の積になります。 |
| `square-numerator-only` | 分子だけを2乗し、分母は100のままにする | 誤答 | 分母の100も二因子掛けられています。 |
| `double-denominator` | 分子を2乗し、分母は2倍する | 誤答 | 分母に対しても2乗と2倍を区別してください。 |

#### n09-p001-q08-left-square::outerJoin — NEW

- 問い：(140＋1)(140＋1)を、最初の括弧の二項ごとに分けます。二つの積をどの演算で結びますか。
- 種別・役割：math / distribution-join
- 思考操作：括弧の和へ分配するときの演算を構成する
- 根拠：分配法則。完成公式全体を候補選択にしない。
- 位置：n09-p001-q08-left-square::ux04-row-06
- 前提：fractionSquareAction
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-p001-q08-left-square::ux04-row-07, n09-p001-q08-left-square::ux04-row-08, n09-p001-q08-left-square::ux04-row-09, n09-p001-q08-left-square::ux04-row-10, n09-p001-q08-left-square::ux04-row-11, n09-p001-q08-left-square::ux04-row-12
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `+` | + | 正答 | 最初の括弧の二項の和を、同じ後ろの因子へ分配します。 |
| `-` | - | 誤答 | 元の最初の括弧は和です。符号を変えないでください。 |
| `\times` | × | 誤答 | 二つの項へ分けた後まで掛けると、元の和を保持できません。 |

#### n09-p001-q08-left-square::crossProduct — NEW

- 問い：展開で140²のほかに、最初の括弧の140から生じる項を、まだ計算しない積の形で選びます。
- 種別・役割：math / distribution-cross-factor
- 思考操作：分配の相手となる項を対応させて交差積を構成する
- 根拠：二つの和の積を各項へ分配する既習の操作。
- 位置：n09-p001-q08-left-square::ux04-row-07
- 前提：fractionSquareAction, outerJoin
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-p001-q08-left-square::ux04-row-08, n09-p001-q08-left-square::ux04-row-09, n09-p001-q08-left-square::ux04-row-10, n09-p001-q08-left-square::ux04-row-11, n09-p001-q08-left-square::ux04-row-12
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `140\times1` | 140×1 | 正答 | 最初の140を、後ろの括弧のもう一方の項1へ掛けた積です。 |
| `140+1` | 140+1 | 誤答 | 括弧内の和をそのまま書くのでなく、外の140を掛ける対象を追ってください。 |
| `140^2` | 140^2 | 誤答 | 140×140は既に第一項にあります。もう一方の項から生じる積を調べてください。 |

#### n09-p001-q08-left-square::crossCoefficient — NEW

- 問い：140×1と1×140は同じ値です。二つをまとめた積の先頭の係数を選びます。
- 種別・役割：math / equal-cross-products-count
- 思考操作：同じ二つの交差積をまとめて中項を構成する
- 根拠：乗法の交換法則と同類項の加法。
- 位置：n09-p001-q08-left-square::ux04-row-08
- 前提：fractionSquareAction, outerJoin, crossProduct
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-p001-q08-left-square::ux04-row-09, n09-p001-q08-left-square::ux04-row-10, n09-p001-q08-left-square::ux04-row-11, n09-p001-q08-left-square::ux04-row-12
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `2` | 2 | 正答 | 同じ積が二つあります。 |
| `1` | 1 | 誤答 | 二つの交差積のうち一つを落としていませんか。 |
| `4` | 4 | 誤答 | 展開全体の項数と、同じ交差積の個数を区別してください。 |

#### n09-p001-q08-left-square::L1 — KEEP

- 問い：中項2×140×1を計算します。
- 種別・役割：math / rational
- 思考操作：自分で組み立てた中項を数値計算する
- 根拠：元と同じ2×140×1。
- 位置：n09-p001-q08-left-square::ux04-row-09
- 前提：fractionSquareAction, outerJoin, crossProduct, crossCoefficient
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-p001-q08-left-square::ux04-row-10, n09-p001-q08-left-square::ux04-row-11, n09-p001-q08-left-square::ux04-row-12
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `280` | 280 | 正答 | この結果を確定し、次の計算へ使います。 |
| `140` | 140 | 誤答 | 中項には2を掛けます。 |
| `2800` | 2800 | 誤答 | 位取りを確かめ、140に掛ける因子を数えます。 |

#### n09-p001-q08-left-square::L2 — KEEP

- 問い：三つの項を合計します。
- 種別・役割：math / rational
- 思考操作：三項の合計を計算する
- 根拠：元と同じ19600＋280＋1。
- 位置：n09-p001-q08-left-square::ux04-row-10
- 前提：fractionSquareAction, outerJoin, crossProduct, crossCoefficient, L1
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-p001-q08-left-square::ux04-row-11, n09-p001-q08-left-square::ux04-row-12
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `19881` | 19881 | 正答 | この結果を確定し、次の計算へ使います。 |
| `19880` | 19880 | 誤答 | 最後の1²の値も合計します。 |
| `19601` | 19601 | 誤答 | 中項も合計に含めます。 |

#### n09-p001-q08-left-square::L3 — KEEP

- 問い：整数の平方を10000で割って小数に戻します。
- 種別・役割：math / rational
- 思考操作：分数の値を小数へ戻す
- 根拠：元と同じ19881/10000。
- 位置：n09-p001-q08-left-square::ux04-row-12
- 前提：fractionSquareAction, outerJoin, crossProduct, crossCoefficient, L1, L2
- 後続候補（各行の前提が全て満たされた時のみ表示）：後続nodeの全解放条件成立後に進む
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `1.9881` | 1.9881 | 正答 | この結果を確定し、次の計算へ使います。 |
| `19.881` | 19.881 | 誤答 | 分母10000に対応する小数の桁数を確認します。 |
| `0.19881` | 0.19881 | 誤答 | 整数部分がいくつになるかも確認します。 |

### 既存回答の意味対応

| ID | 判断 | 理由 |
|---|---|---|
| n09-p001-q08-left-square::L1 | KEEP | 問いの対象・型・正答・全候補・思考操作を保持。新しい前提の正答までは保留する。 |
| n09-p001-q08-left-square::L2 | KEEP | 問いの対象・型・正答・全候補・思考操作を保持。新しい前提の正答までは保留する。 |
| n09-p001-q08-left-square::L3 | KEEP | 問いの対象・型・正答・全候補・思考操作を保持。新しい前提の正答までは保留する。 |
| n09-p001-q08-left-square::fractionSquareAction | NEW | 新しい思考操作。既存IDの意味差替えをしない。 |
| n09-p001-q08-left-square::outerJoin | NEW | 新しい思考操作。既存IDの意味差替えをしない。 |
| n09-p001-q08-left-square::crossProduct | NEW | 新しい思考操作。既存IDの意味差替えをしない。 |
| n09-p001-q08-left-square::crossCoefficient | NEW | 新しい思考操作。既存IDの意味差替えをしない。 |

### 答え漏れ・接続の管理

- L1 promptの2×140×1はL1解放後のみ表示。中項構成の問いより前へ出さない。
- lead/条件へ完成公式140²＋2×140×1＋1²を出さない。
- 分子だけの計算と元の分数全体を、本文と式groupで分けて偽の等式鎖を作らない。
- 同じ交差積をまとめる前の四項はcrossProduct正答の前には完成表示しない。
- このnodeの全必須part正答後のみ。terminalRecord・履歴の完成解も同じgateを使う。

## n09-p001-q08-right-square — CHANGE

左と同じ展開を全文自動表示せず、支援を減らして変わる中項を構成させる。

### 穴なしの完成解法

1.42²=142²/10000、142=140＋2。(140＋2)²=140²＋2×140×2＋2²=19600＋560＋4=20164。したがって1.42²=20164/10000=2.0164。

### 最初に提示する本文・条件

右の1.42²にも、左で組み立てた方法を使います。142を140＋2と置き、変わる中項を自分で構成します。

条件：追加の完成条件を先書きしない。既存の必要な前提だけを参照。

### 正確な表示行と解放

| 行ID | 種別 | template | 正答前提 | 正答後に置換する足場 |
|---|---|---|---|---|
| n09-p001-q08-right-square::ux04-row-01 | math | `1.42^2=\frac{142^2}{10000}` | 初期 | なし |
| n09-p001-q08-right-square::ux04-row-02 | text | `ここからは分子の平方を計算します。` | 初期 | なし |
| n09-p001-q08-right-square::ux04-row-03 | math | `(140+2)^2=140^2+{middleStructure}+2^2` | 初期 | なし |
| n09-p001-q08-right-square::ux04-row-04 | math | `=19600+{R1}+4` | middleStructure | なし |
| n09-p001-q08-right-square::ux04-row-05 | math | `=19600+{mirror:R1}+4={R2}` | middleStructure, R1 | なし |
| n09-p001-q08-right-square::ux04-row-06 | text | `元の分数全体へ戻します。` | middleStructure, R1, R2 | なし |
| n09-p001-q08-right-square::ux04-row-07 | math | `1.42^2=\frac{ {mirror:R2} }{10000}={R3}` | middleStructure, R1, R2 | なし |

### 穴ごとの詳細


#### n09-p001-q08-right-square::middleStructure — NEW

- 問い：142=140＋2に左の方法を使います。和の平方の中項を、数値計算前の因子の形で組み立てます。
- 種別・役割：math / square-cross-term-factors
- 思考操作：同じ方法を数値の異なる右側へ適用し中項の因子を構成する
- 根拠：本人が左で構成した分配と二つの交差積。全文公式を選ぶ問いではない。
- 位置：n09-p001-q08-right-square::ux04-row-03
- 前提：このnodeまでの既存前提
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-p001-q08-right-square::ux04-row-04, n09-p001-q08-right-square::ux04-row-05, n09-p001-q08-right-square::ux04-row-06, n09-p001-q08-right-square::ux04-row-07
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `2\times140\times2` | 2×140×2 | 正答 | 二つの交差積をまとめた係数2と、二つの異なる項140・2を掛けます。 |
| `140\times2` | 140×2 | 誤答 | 交差積は一つだけでしょうか。左の展開で同じ積が二つ現れたことを使ってください。 |
| `2\times140^2` | 2×140^2 | 誤答 | 中項には二つの異なる項が一つずつ入ります。140だけの平方と区別してください。 |

#### n09-p001-q08-right-square::R1 — KEEP

- 問い：中項2×140×2を計算します。
- 種別・役割：math / rational
- 思考操作：構成済み中項の数値計算
- 根拠：元と同じ2×140×2。
- 位置：n09-p001-q08-right-square::ux04-row-04
- 前提：middleStructure
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-p001-q08-right-square::ux04-row-05, n09-p001-q08-right-square::ux04-row-06, n09-p001-q08-right-square::ux04-row-07
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `560` | 560 | 正答 | この結果を確定し、次の計算へ使います。 |
| `280` | 280 | 誤答 | 今回は最後の因子も2です。 |
| `5600` | 5600 | 誤答 | 位取りを確かめます。 |

#### n09-p001-q08-right-square::R2 — KEEP

- 問い：三つの項を合計します。
- 種別・役割：math / rational
- 思考操作：三項の合計
- 根拠：元と同じ19600＋560＋4。
- 位置：n09-p001-q08-right-square::ux04-row-05
- 前提：middleStructure, R1
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-p001-q08-right-square::ux04-row-06, n09-p001-q08-right-square::ux04-row-07
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `20164` | 20164 | 正答 | この結果を確定し、次の計算へ使います。 |
| `20160` | 20160 | 誤答 | 2²の値も合計します。 |
| `19884` | 19884 | 誤答 | 中項の因子2をもう一度確認します。 |

#### n09-p001-q08-right-square::R3 — KEEP

- 問い：整数の平方を小数に戻します。
- 種別・役割：math / rational
- 思考操作：小数への変換
- 根拠：元と同じ20164/10000。
- 位置：n09-p001-q08-right-square::ux04-row-07
- 前提：middleStructure, R1, R2
- 後続候補（各行の前提が全て満たされた時のみ表示）：後続nodeの全解放条件成立後に進む
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `2.0164` | 2.0164 | 正答 | この結果を確定し、次の計算へ使います。 |
| `20.164` | 20.164 | 誤答 | 10000で割る小数の桁数を確認します。 |
| `0.20164` | 0.20164 | 誤答 | 整数部分を含めて大きさを確認します。 |

### 既存回答の意味対応

| ID | 判断 | 理由 |
|---|---|---|
| n09-p001-q08-right-square::R1 | KEEP | 問いの対象・型・正答・全候補・思考操作を保持。新しい前提の正答までは保留する。 |
| n09-p001-q08-right-square::R2 | KEEP | 問いの対象・型・正答・全候補・思考操作を保持。新しい前提の正答までは保留する。 |
| n09-p001-q08-right-square::R3 | KEEP | 問いの対象・型・正答・全候補・思考操作を保持。新しい前提の正答までは保留する。 |
| n09-p001-q08-right-square::middleStructure | NEW | 新しい思考操作。既存IDの意味差替えをしない。 |

### 答え漏れ・接続の管理

- 左で本人が確定した分数平方・分母10000を参照し、その同じ数を再入力させない。
- R1 promptの完成中項はmiddleStructure正答後のみ表示する。
- このnodeの全必須part正答後のみ。terminalRecord・履歴の完成解も同じgateを使う。

## n09-parts-target — CHANGE

x=n＋r等は定義として提示するが、rの取り出しと整数区間への変形は結果を先書きしない。

### 穴なしの完成解法

実数xをx=n＋r、n∈ℤ、0≤r<1と表したとき、nを整数部分、rを小数部分と定義する。両辺からnを引けばr=x−n。0≤r<1の各辺へnを加えるとn≤n＋r<n＋1、中央をxへ戻してn≤x<n＋1。

### 最初に提示する本文・条件

−2.1を整数部分と小数部分に分けます。まず次の定義を使います。実数x=n＋r、n∈ℤ、0≤r<1のとき、nを整数部分、rを小数部分と呼びます。

条件：x=n＋r、n∈ℤ、0≤r<1はここで与える定義。

### 正確な表示行と解放

| 行ID | 種別 | template | 正答前提 | 正答後に置換する足場 |
|---|---|---|---|---|
| n09-parts-target::ux04-row-01 | math | `x=n+r,\quad n\in\mathbb Z,\quad0\le r<1` | 初期 | なし |
| n09-parts-target::ux04-row-02 | text | `両辺に行う演算：{isolateOperation}n` | 初期 | isolateOperation |
| n09-parts-target::ux04-row-03 | math | `x-n=n+r-n\quad\Rightarrow\quad r=x-n` | isolateOperation | なし |
| n09-parts-target::ux04-row-04 | text | `各辺に加える式：{intervalShift}` | isolateOperation | intervalShift |
| n09-parts-target::ux04-row-05 | math | `0+{mirror:intervalShift}\le r+{mirror:intervalShift}<1+{mirror:intervalShift}` | isolateOperation, intervalShift | なし |
| n09-parts-target::ux04-row-06 | math | `n\le x<n+1` | isolateOperation, intervalShift | なし |

### 穴ごとの詳細


#### n09-parts-target::isolateOperation — NEW

- 問い：定義x=n＋rの両辺へnをどう作用させれば、rを取り出せますか。
- 種別・役割：math / equation-isolate-remainder
- 思考操作：定義式からrを取り出す共通逆演算
- 根拠：等式の両辺に同じ数を加減する性質。定義自体を当てさせない。
- 位置：n09-parts-target::ux04-row-02
- 前提：このnodeまでの既存前提
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-parts-target::ux04-row-03, n09-parts-target::ux04-row-04, n09-parts-target::ux04-row-05, n09-parts-target::ux04-row-06
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `-` | - | 正答 | 両辺のnを同じように引いて整理します。 |
| `+` | + | 誤答 | 右辺のnが増え、rだけになりません。 |
| `\div` | ÷ | 誤答 | 右辺は和です。全体をnで割ってもnの加算を消せません。またn=0もあり得ます。 |

#### n09-parts-target::intervalShift — NEW

- 問い：0≤r<1の各辺へ同じ式を足し、中央をx=n＋rにします。足す式を選びます。
- 種別・役割：math / inequality-common-addend
- 思考操作：残りの範囲を元の数の区間へ変換する共通加数を選ぶ
- 根拠：不等式全辺への同じ加算と定義x=n＋r。
- 位置：n09-parts-target::ux04-row-04
- 前提：isolateOperation
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-parts-target::ux04-row-05, n09-parts-target::ux04-row-06
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `n` | n | 正答 | 三辺にnを加えると、中央はn＋r=xになります。 |
| `-n` | -n | 誤答 | 中央がr−nとなり、定義のx=n＋rと一致しません。 |
| `r` | r | 誤答 | 中央が2rとなり、xを含む整数の区間になりません。 |

### 既存回答の意味対応

| ID | 判断 | 理由 |
|---|---|---|
| n09-parts-target::isolateOperation | NEW | 新しい思考操作。既存IDの意味差替えをしない。 |
| n09-parts-target::intervalShift | NEW | 新しい思考操作。既存IDの意味差替えをしない。 |

### 答え漏れ・接続の管理

- 派生式r=x−nとn≤x<n＋1をlead/条件へ先に出さない。
- 定義する語の名前を選択させる未知語当ては行わない。
- 整数nは負・0も含む。割り算の候補を一律可能な同値変形として扱わない。
- このnodeの全必須part正答後のみ。terminalRecord・履歴の完成解も同じgateを使う。

## n09-q10-reject-truncation — CHANGE

負数減法の変形が自動で、値を入れた後の棄却理由も自動だった。

### 穴なしの完成解法

n=−2という候補ではr=−2.1−(−2)=−2.1＋2=−0.1。これは0≤r<1に反するので、n=−2は整数部分ではない。適切な整数の選択は次nodeで行う。

### 最初に提示する本文・条件

見た目から整数部分を−2とする候補を、定義で検査します。

条件：追加の完成条件を先書きしない。既存の必要な前提だけを参照。

### 正確な表示行と解放

| 行ID | 種別 | template | 正答前提 | 正答後に置換する足場 |
|---|---|---|---|---|
| n09-q10-reject-truncation::ux04-row-01 | math | `r=-2.1-(-2)=-2.1{removeBracketsOperation}2` | 初期 | なし |
| n09-q10-reject-truncation::ux04-row-02 | math | `={value}` | removeBracketsOperation | なし |
| n09-q10-reject-truncation::ux04-row-03 | text | `候補n=−2は、{admissibility}。` | removeBracketsOperation, value | なし |

### 穴ごとの詳細


#### n09-q10-reject-truncation::removeBracketsOperation — NEW

- 問い：候補n=−2を使ったr=−2.1−(−2)で、括弧を外した後の演算を選びます。
- 種別・役割：math / subtract-negative-operation
- 思考操作：負の整数を引く操作を加法へ変える
- 根拠：r=x−nと負数の減法。
- 位置：n09-q10-reject-truncation::ux04-row-01
- 前提：このnodeまでの既存前提
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-q10-reject-truncation::ux04-row-02, n09-q10-reject-truncation::ux04-row-03
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `+` | + | 正答 | 負の数を引くので、その反対数を足します。 |
| `-` | - | 誤答 | 括弧の前の引き算と、中の負号を別々に見てください。 |

#### n09-q10-reject-truncation::value — KEEP

- 問い：候補n=−2の残りを計算します。
- 種別・役割：math / rational
- 思考操作：候補の残りを計算する
- 根拠：元と同じ−2.1−(−2)。
- 位置：n09-q10-reject-truncation::ux04-row-02
- 前提：removeBracketsOperation
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-q10-reject-truncation::ux04-row-03
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `-0.1` | -0.1 | 正答 | この結果を確定し、次の計算へ使います。 |
| `0.1` | 0.1 | 誤答 | 元の数の方が小さいので、差の符号を確認します。 |
| `-4.1` | -4.1 | 誤答 | 負の数を引く操作は反対符号を足します。 |

#### n09-q10-reject-truncation::admissibility — NEW

- 問い：計算した残りから、候補n=−2を整数部分として採用できますか。
- 種別・役割：text / remainder-definition-check
- 思考操作：残りの定義条件に照らして候補を棄却する
- 根拠：直前に構成したr=x−nと定義0≤r<1。
- 位置：n09-q10-reject-truncation::ux04-row-03
- 前提：removeBracketsOperation, value
- 後続候補（各行の前提が全て満たされた時のみ表示）：後続nodeの全解放条件成立後に進む
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `reject-negative-remainder` | 採用できない。残りが負で、0≤r<1を満たさない | 正答 | 整数であるだけでは足りません。残りの範囲も必要です。 |
| `accept-integer-only` | 採用できる。nが整数なら残りの符号は問わない | 誤答 | 整数部分の定義には残り0≤r<1も含まれています。 |
| `accept-truncation` | 採用できる。小数点より左が−2だから | 誤答 | 見た目の桁の切取りではなく、与えられた定義で判定します。 |

### 既存回答の意味対応

| ID | 判断 | 理由 |
|---|---|---|
| n09-q10-reject-truncation::value | KEEP | 問いの対象・型・正答・全候補・思考操作を保持。新しい前提の正答までは保留する。 |
| n09-q10-reject-truncation::removeBracketsOperation | NEW | 新しい思考操作。既存IDの意味差替えをしない。 |
| n09-q10-reject-truncation::admissibility | NEW | 新しい思考操作。既存IDの意味差替えをしない。 |

### 答え漏れ・接続の管理

- leadで「負の数を引くので加算」「残りが負だから不適合」を先に述べない。
- 次の正しいn=−3をこのnodeの誤答feedbackから直接教えない。
- このnodeの全必須part正答後のみ。terminalRecord・履歴の完成解も同じgateを使う。

## n09-q13-reverse — CHANGE

既存二つの関係穴は維持するが、どの共通操作をするかと規則の答えをleadで先に与えない。

### 穴なしの完成解法

3<√10<4の各辺へ−1を掛ける。負数の乗法により各関係は向きを変えるので、−3>−√10>−4。小さい順への並べ替えは次nodeで行う。

### 最初に提示する本文・条件

確定した正の根号の区間を使い、中央が−√10になる区間を作ります。

条件：追加の完成条件を先書きしない。既存の必要な前提だけを参照。

### 正確な表示行と解放

| 行ID | 種別 | template | 正答前提 | 正答後に置換する足場 |
|---|---|---|---|---|
| n09-q13-reverse::ux04-row-01 | math | `3<\sqrt{10}<4` | 初期 | なし |
| n09-q13-reverse::ux04-row-02 | math | `\sqrt{10}\times{commonMultiplier}=-\sqrt{10}` | 初期 | なし |
| n09-q13-reverse::ux04-row-03 | math | `-3\ {S1}\ -\sqrt{10}\ {S2}\ -4` | commonMultiplier | なし |

### 穴ごとの詳細


#### n09-q13-reverse::commonMultiplier — NEW

- 問い：3<√10<4の中央を−√10へ変えるため、各辺へ同じ何を掛けますか。
- 種別・役割：math / inequality-common-multiplier
- 思考操作：区間を負の根号へ移す共通乗数を選ぶ
- 根拠：実数の乗法。係数−1を掛けることと、根号値そのものを掛けることを区別。
- 位置：n09-q13-reverse::ux04-row-02
- 前提：このnodeまでの既存前提
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-q13-reverse::ux04-row-03
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `-1` | -1 | 正答 | 中央の√10の符号だけを反転する共通乗数です。 |
| `1` | 1 | 誤答 | 中央の符号が変わりません。 |
| `-\sqrt{10}` | -√10 | 誤答 | 中央は−10となり、目標の−√10と違います。 |

#### n09-q13-reverse::S1 — KEEP

- 問い：左側の関係を負の乗算後へ移します。
- 種別・役割：math / relation
- 思考操作：左側の不等号を負数乗法後に判断する
- 根拠：元と同じ−3と−√10の比較。
- 位置：n09-q13-reverse::ux04-row-03
- 前提：commonMultiplier
- 後続候補（各行の前提が全て満たされた時のみ表示）：後続nodeの全解放条件成立後に進む
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `>` | > | 正答 | この結果を確定し、次の計算へ使います。 |
| `=` | = | 誤答 | 等号にできる条件を満たすか確認します。 |
| `<` | < | 誤答 | 負数を掛けたときは不等号の向きが逆になります。 |

#### n09-q13-reverse::S2 — KEEP

- 問い：右側の関係も負の乗算後へ移します。
- 種別・役割：math / relation
- 思考操作：右側の不等号を負数乗法後に判断する
- 根拠：元と同じ−√10と−4の比較。
- 位置：n09-q13-reverse::ux04-row-03
- 前提：commonMultiplier, S1
- 後続候補（各行の前提が全て満たされた時のみ表示）：後続nodeの全解放条件成立後に進む
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `>` | > | 正答 | この結果を確定し、次の計算へ使います。 |
| `=` | = | 誤答 | 等号にできる条件を満たすか確認します。 |
| `<` | < | 誤答 | 負数を掛けたときは不等号の向きが逆になります。 |

### 既存回答の意味対応

| ID | 判断 | 理由 |
|---|---|---|
| n09-q13-reverse::S1 | KEEP | 問いの対象・型・正答・全候補・思考操作を保持。新しい前提の正答までは保留する。 |
| n09-q13-reverse::S2 | KEEP | 問いの対象・型・正答・全候補・思考操作を保持。新しい前提の正答までは保留する。 |
| n09-q13-reverse::commonMultiplier | NEW | 新しい思考操作。既存IDの意味差替えをしない。 |

### 答え漏れ・接続の管理

- lead/条件の「−1を掛けます」「不等号を反転します」を削る。
- 旧S1/S2のpromptはcommonMultiplier正答後にだけ公開する。
- 正答前に完成した−3>−√10>−4や、次nodeの並べ替え済み区間を参照欄へ出さない。
- このnodeの全必須part正答後のみ。terminalRecord・履歴の完成解も同じgateを使う。

## n09-q14-positive-remainder — CHANGE

減算一穴の後に範囲確認全体が自動展開されていた。

### 穴なしの完成解法

整数部分は3。r=√10−3。3<√10<4の三辺へ−3を加えると3−3<√10−3<4−3、従って0<r<1。小数部分の定義にも合う。

### 最初に提示する本文・条件

√10の整数部分は3と確定しました。定義から残りを構成し、区間全体への操作で範囲も確かめます。

条件：追加の完成条件を先書きしない。既存の必要な前提だけを参照。

### 正確な表示行と解放

| 行ID | 種別 | template | 正答前提 | 正答後に置換する足場 |
|---|---|---|---|---|
| n09-q14-positive-remainder::ux04-row-01 | math | `r=\sqrt{10}{remainderOperation}3` | 初期 | なし |
| n09-q14-positive-remainder::ux04-row-02 | math | `3<\sqrt{10}<4` | remainderOperation | なし |
| n09-q14-positive-remainder::ux04-row-03 | text | `各辺に加える数：{intervalTranslation}` | remainderOperation | intervalTranslation |
| n09-q14-positive-remainder::ux04-row-04 | math | `3+({mirror:intervalTranslation})<\sqrt{10}+({mirror:intervalTranslation})<4+({mirror:intervalTranslation})` | remainderOperation, intervalTranslation | なし |
| n09-q14-positive-remainder::ux04-row-05 | math | `0<r<1` | remainderOperation, intervalTranslation | なし |

### 穴ごとの詳細


#### n09-q14-positive-remainder::remainderOperation — KEEP

- 問い：元の数xから整数部分nを取り除くには、どの演算をしますか。
- 種別・役割：math / binary-operation
- 思考操作：元の数から整数部分を除く演算を選ぶ
- 根拠：元と同じ√10と認定済み整数部分3。
- 位置：n09-q14-positive-remainder::ux04-row-01
- 前提：このnodeまでの既存前提
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-q14-positive-remainder::ux04-row-02, n09-q14-positive-remainder::ux04-row-03, n09-q14-positive-remainder::ux04-row-04, n09-q14-positive-remainder::ux04-row-05
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `-` | - | 正答 | この判断を確定し、次へ進みます。 |
| `+` | + | 誤答 | x=n+rをrについて整理してください。 |
| `\div` | \div | 誤答 | 整数部分と残りの関係は積ではなく和です。 |

#### n09-q14-positive-remainder::intervalTranslation — NEW

- 問い：3<√10<4の各辺へ同じ数を足し、中央を求めたr=√10−3にします。足す数を選びます。
- 種別・役割：math / inequality-common-addend
- 思考操作：一つの式の構成から区間全体へ同じ操作を適用する
- 根拠：不等式全辺への同じ加算。整数部分3の再記入ではなく、操作の向きと対象を判断。
- 位置：n09-q14-positive-remainder::ux04-row-03
- 前提：remainderOperation
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-q14-positive-remainder::ux04-row-04, n09-q14-positive-remainder::ux04-row-05
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `-3` | -3 | 正答 | 全ての辺から同じ整数部分3を引く操作になります。 |
| `3` | 3 | 誤答 | 中央が√10＋3となり、求めた残りと一致しません。 |
| `-\sqrt{10}` | -√10 | 誤答 | 中央が0になり、残りrの区間を調べる式ではなくなります。 |

### 既存回答の意味対応

| ID | 判断 | 理由 |
|---|---|---|
| n09-q14-positive-remainder::remainderOperation | KEEP | 問いの対象・型・正答・全候補・思考操作を保持。新しい前提の正答までは保留する。 |
| n09-q14-positive-remainder::intervalTranslation | NEW | 新しい思考操作。既存IDの意味差替えをしない。 |

### 答え漏れ・接続の管理

- 区間変形の全文と0<r<1はintervalTranslation正答前に表示しない。
- 追加判断を既存remainderOperationへ統合して既存回答だけで完了させない。
- このnodeの全必須part正答後のみ。terminalRecord・履歴の完成解も同じgateを使う。

## n09-q14-negative-remainder — CHANGE

符号一穴の正答で項の整理と範囲確認まで自動化されていた。

### 穴なしの完成解法

整数部分は−4。r=−√10−(−4)=−√10＋4。これは符号付きの項−√10と＋4の和なので、順序を替えて4−√10。−4<−√10<−3の各辺へ4を足すと0<−√10＋4<1、従って0<r<1。

### 最初に提示する本文・条件

−√10の整数部分は−4と確定しました。残りの式を作り、符号込みの項を保って整理し、範囲も別に確かめます。

条件：追加の完成条件を先書きしない。既存の必要な前提だけを参照。

### 正確な表示行と解放

| 行ID | 種別 | template | 正答前提 | 正答後に置換する足場 |
|---|---|---|---|---|
| n09-q14-negative-remainder::ux04-row-01 | math | `r=-\sqrt{10}-(-4)=-\sqrt{10}\ {sign}\ 4` | 初期 | なし |
| n09-q14-negative-remainder::ux04-row-02 | text | `項の並べ替えは、{reorderAction}。` | sign | なし |
| n09-q14-negative-remainder::ux04-row-03 | math | `r=4-\sqrt{10}` | sign, reorderAction | なし |
| n09-q14-negative-remainder::ux04-row-04 | math | `-4<-\sqrt{10}<-3` | sign, reorderAction | なし |
| n09-q14-negative-remainder::ux04-row-05 | text | `各辺に加える数：{intervalTranslation}` | sign, reorderAction | intervalTranslation |
| n09-q14-negative-remainder::ux04-row-06 | math | `-4+{mirror:intervalTranslation}<-\sqrt{10}+{mirror:intervalTranslation}<-3+{mirror:intervalTranslation}` | sign, reorderAction, intervalTranslation | なし |
| n09-q14-negative-remainder::ux04-row-07 | math | `0<r<1` | sign, reorderAction, intervalTranslation | なし |

### 穴ごとの詳細


#### n09-q14-negative-remainder::sign — KEEP

- 問い：括弧付きの整数を引いた式を見て、括弧を外した後の演算を選びます。
- 種別・役割：math / binary-operation
- 思考操作：負の整数部分を引く演算の符号を判断する
- 根拠：元と同じ−√10−(−4)。
- 位置：n09-q14-negative-remainder::ux04-row-01
- 前提：このnodeまでの既存前提
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-q14-negative-remainder::ux04-row-02, n09-q14-negative-remainder::ux04-row-03, n09-q14-negative-remainder::ux04-row-04, n09-q14-negative-remainder::ux04-row-05, n09-q14-negative-remainder::ux04-row-06, n09-q14-negative-remainder::ux04-row-07
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `+` | + | 正答 | 対応する項の符号を保持して進みます。 |
| `-` | - | 誤答 | r=x−nへ負の整数部分を括弧付きで代入し、括弧の前後の負号がそれぞれ何を表すか確かめてください。 |

#### n09-q14-negative-remainder::reorderAction — NEW

- 問い：整数の項を先に書くには、どのように二項を並べ替えますか。
- 種別・役割：text / signed-terms-order-action
- 思考操作：差の見た目でなく符号付き加法の項として順序を整理する
- 根拠：加法の交換。法則名を知らないと選べない未知語当てにしない。
- 位置：n09-q14-negative-remainder::ux04-row-02
- 前提：sign
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-q14-negative-remainder::ux04-row-03, n09-q14-negative-remainder::ux04-row-04, n09-q14-negative-remainder::ux04-row-05, n09-q14-negative-remainder::ux04-row-06, n09-q14-negative-remainder::ux04-row-07
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `keep-signed-terms` | 符号込みの各項を保ち、和の二項の順序だけを替える | 正答 | −√10と＋4を、それぞれ一つの項として保ちます。 |
| `reverse-subtraction` | 引かれる数と引く数を、そのまま逆順にする | 誤答 | 減法の順序を交換すると、一般に値が変わります。まず符号込みの和として見てください。 |
| `change-both-signs` | 二つの項の符号も同時に反転する | 誤答 | 順序を替えるだけの変形で、各項の符号まで変えてはいけません。 |

#### n09-q14-negative-remainder::intervalTranslation — NEW

- 問い：−4<−√10<−3の各辺へ何を足せば、中央が求めた残りrになりますか。
- 種別・役割：math / inequality-common-addend
- 思考操作：負の根号の残りを検証するため区間全体の共通加数を選ぶ
- 根拠：不等式全辺への同じ加算と先に構成したr=4−√10。
- 位置：n09-q14-negative-remainder::ux04-row-05
- 前提：sign, reorderAction
- 後続候補（各行の前提が全て満たされた時のみ表示）：n09-q14-negative-remainder::ux04-row-06, n09-q14-negative-remainder::ux04-row-07
- 誤答時：現在の穴・足場・誤答説明を保持。次のpart/行/nodeを解放しない。

| 候補value | 表示 | 案上の正答 | 回答後説明 |
|---|---|---|---|
| `4` | 4 | 正答 | 中央は−√10＋4、端は0と1になります。 |
| `-4` | -4 | 誤答 | 中央は−√10−4となり、求めた残りと違います。 |
| `\sqrt{10}` | √10 | 誤答 | 中央が0となり、残りrの区間ではなくなります。 |

### 既存回答の意味対応

| ID | 判断 | 理由 |
|---|---|---|
| n09-q14-negative-remainder::sign | KEEP | 問いの対象・型・正答・全候補・思考操作を保持。新しい前提の正答までは保留する。 |
| n09-q14-negative-remainder::reorderAction | NEW | 新しい思考操作。既存IDの意味差替えをしない。 |
| n09-q14-negative-remainder::intervalTranslation | NEW | 新しい思考操作。既存IDの意味差替えをしない。 |

### 答え漏れ・接続の管理

- r=4−√10はreorderAction正答後のみ。
- 0<4−√10<1という完成した範囲はintervalTranslation正答前に表示しない。
- 旧signの正答を二つの追加判断へ転用しない。
- このnodeの全必須part正答後のみ。terminalRecord・履歴の完成解も同じgateを使う。

## 分担の限界

この資料はN09 14nodeの設計作者案であり、相互非作者審査・正式提案書の統合・本人承認は未実施。製品コード・正本WORK・Git・正式Storeは変更していない。sourceのr5回答をr6で解放する条件や全体QAは、主担当が正式提案へ統合する。

# P-W046-UX-04 — N10詳細設計草案

**Status: DRAFT / 未承認・未実装・cross review前**

作者：/root/w046_render_review。source `db99a485f857b1aefa7fb738456f36a830514158`、N10 r4 compiledHash `3cfe95380892a1d7a34fdc3fa142448a9f953ddc983427c9626b4fbdd8b0b895`。次版はN10 r5を提案。原Wordを新たに読んだとは扱わず、現sourceの問題/条件/範囲を維持。

## 目的と保護境界

N10監査9群・13unique nodeの導出の学習操作。穴数は設計結果であり目標にしない。

- N10 H07の正性→平方→同定理由
- 第2・3段階の積/商の定義・非零・符号からの構成
- n10-q19-distributeの符号込みの項と積の符号
- 確定済み結果を元の問いへ接続するAUTO n10-08/n10-09/n10-10/n10-16/n10-21
- 本案対象外32nodeの本文・問い・候補・正答・学習行為
- 元問題・値・条件・収録範囲・図・既存履歴、N08/N09/N11・他モード

## 全体契約

- 全ての完成解法は設計資料であり初期画面へ全文を出さない。
- 新しい意味に旧keyを流用しない。NEWは未回答、RETIREはr4 archiveに保存し、同じ数値だけでaliasしない。KEEP記録は残し、新たな未解決の前提がある間は解放へ使わない。
- 全候補の順は提案書用。製品では既存の安定シャッフルを使う。正答印を製品へ出さない。
- 式中のmirrorは参照part正答後だけ表示。初期の…足場は指定hideAfterCorrectKeysで消し、回答後に未完行を残さない。
- 正答していない対象/符号/数値をlead・assumptions・既出結果・ヒント・履歴・番号行の別表示へ先出ししない。
- 同じ原問題の解法内で一度計算した値を後で再入力させない。別例題の転移練習を一律に削除するルールではない。
- 文章・式・穴・選択肢を一つの導出順に置く。現在の穴の直後へ選択肢を置き、未解決の後続式は解放しない。
- 各rowは全requiresCorrectKeysが順番どおり正答したときだけ解放。hideAfterCorrectKeysは非空・unique・その行自身のpartKeys集合と一致し、その行の穴が全て順番どおり正答したときだけ足場を消す。node全keyの別契約を追加しない。
- 式groupは同じ変形系列に限定。補助の符号計算・項選択・本体の等式鎖を無理に一軸へ接続しない。
- 数式はKaTeX、選択肢はN08基準。完成式・条件・説明の無意味な直後再掲はしない。

## 旧回答の扱い

- **KEEP**：旧partの対象・操作・型・正答・候補・前提が同値である場合だけsource-boundで継承。本文改訂/新しい前提の追加を理由に全記録を消さない。
- **RETIRE**：旧r4の記録/初回値/時刻/回数/eventと教材をarchiveへ保持。新partの回答には使わない。
- **NEW**：新key/id。旧AUTO完了・旧parent完了・同じ数値の別partの回答から埋めない。
- **MOVE**：本案は旧recordの意味aliasによるMOVEを一件も提案しない。q21 P/QはARCHIVE_ONLY＋q20新key未回答。

設計結果（穴数のノルマではない）：{"unitNodes": 45, "targetNodes": 13, "protectedNodes": 32, "oldTotalParts": 63, "oldTargetParts": 19, "keptOldParts": 58, "retiredOldParts": 5, "newParts": 31, "proposedTotalParts": 89}

旧P/Qは新q20平方へaliasしない。旧Kも新しい符号付き交差項の和へ流用しない。意味不変の他58partは保持し、新前提の未解決中だけ解放を止める。

## 1. n10-q01-square — n10-stage-01

**現状**：平方の組立てが自動で、√5の平方5だけを回答。

### 穴のない完成解法

t>0として候補t√5を調べる。平方を二回の積へ戻し、同じ因子をまとめる。

\[(t\sqrt5)^2=(t\sqrt5)(t\sqrt5)=(t\times t)(\sqrt5\times\sqrt5)=t^2(\sqrt5)^2=5t^2\]

### 学習者への導入・前提

候補の平方を二回の掛け算へ戻します。同じ因子を対応づけ、指数の形と平方の値を順に決めましょう。

- t>0。待証の根号の積の公式は使わない。

### 穴と全選択肢

#### n10-q01-square::tSquareFactorUX04 — NEW

**問い**：同じ因子tを二回掛けた部分を、すべてのt>0で成り立つ指数の形に直します。

**思考操作**：四因子からtとtを対応づけ、その積をt²へまとめる。

**根拠**：平方の定義と実数乗法の交換・結合。

**正確な穴位置**：`={tSquareFactorUX04}(\sqrt5)^2`（`n10-q01-square::ux04-t-square`）

**先行必須**：なし

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `t^2` | `t^2` | 正答 | この操作を確定し、次の計算へ進みます。 |
| `2t` | `2t` | 誤答 | 2tはtを二つ足した形です。tを二回掛けた積を、すべてのt>0で表す形を考えてください。 |
| `t` | `t` | 誤答 | 同じtが二つの因子としてあります。一つを落とさないでください。 |

**正答後の解放候補row**：`n10-q01-square::ux04-root-square`, `n10-q01-square::ux04-normal`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：現在の穴・選択値・誤答説明を保持し、後続を解放しない。

#### n10-q01-square::rootSquare — KEEP

**問い**：√5の平方を計算します。

**思考操作**：指定した演算の結果を計算する

**根拠**：source db99の同一原問題・同一の局所操作。

**正確な穴位置**：`={mirror:tSquareFactorUX04}\times{rootSquare}`（`n10-q01-square::ux04-root-square`）

**先行必須**：`tSquareFactorUX04`

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `5` | `5` | 正答 | 確定した結果を次の計算へ使います。 |
| `25` | `25` | 誤答 | 根号全体の平方は中の数へ戻ります。中の数を再び平方しません。 |
| `\sqrt5` | `\sqrt5` | 誤答 | 平方の操作を定義に従って行います。 |

**正答後の解放候補row**：`n10-q01-square::ux04-normal`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：既存の誤答説明を表示し、後続を解放しない。

**KEEP理由**：√5を平方する対象・操作・候補・正答は不変。新しいtの積の判断を未解決のまま飛ばさない。

### 表示・解放の正確な順序

| row ID / 用途 | template | 全gate正答で解放 | 当該行の全穴正答で消す足場 |
|---|---|---|---|
| `n10-q01-square::ux04-repeat` / n10-q01-square-ux04-main | `(t\sqrt5)^2=(t\sqrt5)(t\sqrt5)` | 初期 | 保持 |
| `n10-q01-square::ux04-t-square` / n10-q01-square-ux04-main | `={tSquareFactorUX04}(\sqrt5)^2` | 初期 | 保持 |
| `n10-q01-square::ux04-root-square` / n10-q01-square-ux04-main | `={mirror:tSquareFactorUX04}\times{rootSquare}` | tSquareFactorUX04 | 保持 |
| `n10-q01-square::ux04-normal` / n10-q01-square-ux04-main | `=5t^2` | tSquareFactorUX04, rootSquare | 保持 |

### 答え漏洩・既出値・配置

- 初期lead/assumptionsへt²や5t²を先書きしない。
- tSquareFactorUX04はt×tという意味の式片。√a√bの構成証明は変更しない。

補助計算のgroupと本体等式鎖のgroupを区別。正答後に補助足場を閉じ、本体に確定した導出を一度残す。N08基準の段階帯/本文/番号付き縦選択肢/左下resetは維持。

### 既存partの処遇

| oldId | 判断 | targetId / 保存 | 理由 |
|---|---|---|---|
| `n10-q01-square::rootSquare` | KEEP | `n10-q01-square::rootSquare` | √5を平方する対象・操作・候補・正答は不変。新しいtの積の判断を未解決のまま飛ばさない。 |

**node依存の変更案**：`{"addPrerequisiteNodeIds": [], "addRequiredResultRefs": []}`

**terminal**：元resultIdを維持し、当node全必須part正答後だけ成立させる。後続nodeで未回答の計算結果を先出ししない。

## 2. n10-01 — n10-stage-01

**現状**：「両辺を同じ5で割る」が本文で実行済み。穴は125÷5のみ。

### 穴のない完成解法

\[5t^2=125\Rightarrow\frac{5t^2}{5}=\frac{125}{5}\Rightarrow t^2=25\]

### 学習者への導入・前提

候補の平方が125になる条件を使います。まずt²の係数を1にする操作を決め、その後に右辺を計算しましょう。

- 5t²=125。両辺を同じ非零の数で割ってよい。

### 穴と全選択肢

#### n10-01::isolationDivisorUX04 — NEW

**問い**：t²の係数を一度の除算で1にするには、両辺を何で割りますか。

**思考操作**：係数5に着目して、等式の両辺への同一非零除算を選ぶ。

**根拠**：等式の性質。5/d=1を満たすdを選ぶ。

**正確な穴位置**：`\text{両辺を割る数：}\quad{isolationDivisorUX04}`（`n10-01::ux04-divisor`）

**先行必須**：なし

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `5` | `5` | 正答 | この操作を確定し、次の計算へ進みます。 |
| `125` | `125` | 誤答 | 125で割っても等式は保てますが、左辺のt²の係数は1になりません。今回の一度の除算の目標を確かめてください。 |
| `25` | `25` | 誤答 | 25で割っても等式は保てますが、5/25は1ではありません。係数を1にする数を選んでください。 |

**正答後の解放候補row**：`n10-01::ux04-divide-both`, `n10-01::ux04-value`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：現在の穴・選択値・誤答説明を保持し、後続を解放しない。

#### n10-01::value — KEEP

**問い**：125÷5を計算します。

**思考操作**：指定した演算の結果を計算する

**根拠**：source db99の同一原問題・同一の局所操作。

**正確な穴位置**：`t^2={value}`（`n10-01::ux04-value`）

**先行必須**：`isolationDivisorUX04`

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `25` | `25` | 正答 | 確定した結果を次の計算へ使います。 |
| `120` | `120` | 誤答 | 両辺を5で割るのであり、5を引く操作ではありません。 |
| `625` | `625` | 誤答 | 係数を除くために5で割ります。 |

**正答後の解放候補row**：
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：既存の誤答説明を表示し、後続を解放しない。

**KEEP理由**：125÷5の計算は同じ対象・演算・全候補・正答25のまま。

### 表示・解放の正確な順序

| row ID / 用途 | template | 全gate正答で解放 | 当該行の全穴正答で消す足場 |
|---|---|---|---|
| `n10-01::ux04-source` / n10-01-ux04-main | `5t^2=125` | 初期 | 保持 |
| `n10-01::ux04-divisor` / n10-01-ux04-operation | `\text{両辺を割る数：}\quad{isolationDivisorUX04}` | 初期 | isolationDivisorUX04 |
| `n10-01::ux04-divide-both` / n10-01-ux04-main | `\frac{5t^2}{ {mirror:isolationDivisorUX04} }=\frac{125}{ {mirror:isolationDivisorUX04} }` | isolationDivisorUX04 | 保持 |
| `n10-01::ux04-value` / n10-01-ux04-main | `t^2={value}` | isolationDivisorUX04 | 保持 |

### 答え漏洩・既出値・配置

- leadに「5で割る」を先書きしない。
- divisorの同一操作を右辺へ使うmirrorは正答後だけ表示。選択用の操作行はその穴の確定後に消し、正答済み両辺除算の式へ接続する。
- 他の非零除数による等価変形を数学的誤りとは説明せず、係数を一度で1にする指定に合わないと説明する。

補助計算のgroupと本体等式鎖のgroupを区別。正答後に補助足場を閉じ、本体に確定した導出を一度残す。N08基準の段階帯/本文/番号付き縦選択肢/左下resetは維持。

### 既存partの処遇

| oldId | 判断 | targetId / 保存 | 理由 |
|---|---|---|---|
| `n10-01::value` | KEEP | `n10-01::value` | 125÷5の計算は同じ対象・演算・全候補・正答25のまま。 |

**node依存の変更案**：`{"addPrerequisiteNodeIds": [], "addRequiredResultRefs": []}`

**terminal**：元resultIdを維持し、当node全必須part正答後だけ成立させる。後続nodeで未回答の計算結果を先出ししない。

## 3. n10-q09-left — n10-stage-05

**現状**：平方因子を選ぶと残りの因子2が自動表示される。

### 穴のない完成解法

\[8=4\times2\]

\[\sqrt{8}=\sqrt{4}\sqrt2=2\sqrt2\]

### 学習者への導入・前提

√8+√50は、二つの数を足した式です。このような式を和といいます。各項を別々に変形し、まず左の項の平方因子・残りの因子・根号外の係数を順に求めましょう。

- 8は正の整数。最大の平方因子を使う。積の性質は証明済み。

既存の「和」の初出定義・黒太字・semanticIdは保持。上の文字列は可読表現で、製品ではbaselineのmath/text/term分割と定義metadataを維持する。

### 穴と全選択肢

#### n10-q09-left::squareFactor — KEEP

**問い**：8を割り切る最大の平方数を選びます。

**思考操作**：8を割り切る最大の平方数を選びます。

**根拠**：source db99の同一原問題・同一の局所操作。

**正確な穴位置**：`\text{8の最大の平方因子：}\quad{squareFactor}`（`n10-q09-left::ux04-square-factor`）

**先行必須**：なし

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `4` | `4` | 正答 | この判断を確定し、次へ進みます。 |
| `8` | `8` | 誤答 | 元の8が整数の平方か確認してください。 |
| `2` | `2` | 誤答 | 取り出す因子自身が平方数である必要があります。 |

**正答後の解放候補row**：`n10-q09-left::ux04-remaining`, `n10-q09-left::ux04-coefficient`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：既存の誤答説明を表示し、後続を解放しない。

**KEEP理由**：最大の平方因子を選ぶ学習行為・候補・正答は不変。

#### n10-q09-left::remainingFactorUX04 — NEW

**問い**：8を、選んだ平方因子4と残りの因子の積にします。残りの因子を計算します。

**思考操作**：8÷4を計算し、積へ戻して確かめる。

**根拠**：既存squareFactorの正答結果と整数の乗除。

**正確な穴位置**：`8=4\times{remainingFactorUX04}`（`n10-q09-left::ux04-remaining`）

**先行必須**：`squareFactor`

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `2` | `2` | 正答 | この操作を確定し、次の計算へ進みます。 |
| `4` | `4` | 誤答 | 4との積が元の8へ戻るか確かめてください。平方因子をそのまま残りの因子へ写しません。 |
| `8` | `8` | 誤答 | 選んだ平方因子4と掛け合わせ、元の8に一致するかを確認してください。 |

**正答後の解放候補row**：`n10-q09-left::ux04-coefficient`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：現在の穴・選択値・誤答説明を保持し、後続を解放しない。

#### n10-q09-left::coefficient — KEEP

**問い**：左の項の係数√4を求めます。

**思考操作**：指定した演算の結果を計算する

**根拠**：source db99の同一原問題・同一の局所操作。

**正確な穴位置**：`\sqrt{8}=\sqrt{4}\sqrt{ {mirror:remainingFactorUX04} }={coefficient}\sqrt{ {mirror:remainingFactorUX04} }`（`n10-q09-left::ux04-coefficient`）

**先行必須**：`squareFactor`, `remainingFactorUX04`

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `2` | `2` | 正答 | 確定した結果を次の計算へ使います。 |
| `4` | `4` | 誤答 | 平方数をその平方根へ直します。 |
| `8` | `8` | 誤答 | 元の根号内の数をそのまま外へ出しません。 |

**正答後の解放候補row**：
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：既存の誤答説明を表示し、後続を解放しない。

**KEEP理由**：√4の非負の値2を求める操作は不変。残りの因子2の新回答と意味が違うのでaliasしない。

### 表示・解放の正確な順序

| row ID / 用途 | template | 全gate正答で解放 | 当該行の全穴正答で消す足場 |
|---|---|---|---|
| `n10-q09-left::ux04-square-factor` / n10-q09-left-ux04-factor-selection | `\text{8の最大の平方因子：}\quad{squareFactor}` | 初期 | squareFactor |
| `n10-q09-left::ux04-remaining` / n10-q09-left-ux04-main | `8=4\times{remainingFactorUX04}` | squareFactor | 保持 |
| `n10-q09-left::ux04-coefficient` / n10-q09-left-ux04-main | `\sqrt{8}=\sqrt{4}\sqrt{ {mirror:remainingFactorUX04} }={coefficient}\sqrt{ {mirror:remainingFactorUX04} }` | squareFactor, remainingFactorUX04 | 保持 |

### 答え漏洩・既出値・配置

- remainingFactorUX04の回答前に完成分解や根号内の2を見せない。
- coefficientの期待値と同じ数になっても、割算と平方根の別操作であり、同一回答のmirrorにはしない。
- 左で説明した手順は右で長く繰り返さず、転移として同じ三操作を実行する。

補助計算のgroupと本体等式鎖のgroupを区別。正答後に補助足場を閉じ、本体に確定した導出を一度残す。N08基準の段階帯/本文/番号付き縦選択肢/左下resetは維持。

### 既存partの処遇

| oldId | 判断 | targetId / 保存 | 理由 |
|---|---|---|---|
| `n10-q09-left::squareFactor` | KEEP | `n10-q09-left::squareFactor` | 最大の平方因子を選ぶ学習行為・候補・正答は不変。 |
| `n10-q09-left::coefficient` | KEEP | `n10-q09-left::coefficient` | √4の非負の値2を求める操作は不変。残りの因子2の新回答と意味が違うのでaliasしない。 |

**node依存の変更案**：`{"addPrerequisiteNodeIds": [], "addRequiredResultRefs": []}`

**terminal**：元resultIdを維持し、当node全必須part正答後だけ成立させる。後続nodeで未回答の計算結果を先出ししない。

## 4. n10-q09-right — n10-stage-05

**現状**：平方因子を選ぶと残りの因子2が自動表示される。

### 穴のない完成解法

\[50=25\times2\]

\[\sqrt{50}=\sqrt{25}\sqrt2=5\sqrt2\]

### 学習者への導入・前提

右の項にも同じ方法を使います。平方因子、残りの因子、根号の外の係数を順に求めましょう。

- 50は正の整数。最大の平方因子を使う。積の性質は証明済み。

### 穴と全選択肢

#### n10-q09-right::squareFactor — KEEP

**問い**：今度は右項を簡単にする平方因子を選びます。

**思考操作**：今度は右項を簡単にする平方因子を選びます。

**根拠**：source db99の同一原問題・同一の局所操作。

**正確な穴位置**：`\text{50の最大の平方因子：}\quad{squareFactor}`（`n10-q09-right::ux04-square-factor`）

**先行必須**：なし

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `25` | `25` | 正答 | この判断を確定し、次へ進みます。 |
| `5` | `5` | 誤答 | 5は整数の平方数ではありません。 |
| `10` | `10` | 誤答 | 50の因子でも、平方数とは限りません。 |

**正答後の解放候補row**：`n10-q09-right::ux04-remaining`, `n10-q09-right::ux04-coefficient`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：既存の誤答説明を表示し、後続を解放しない。

**KEEP理由**：最大の平方因子を選ぶ学習行為・候補・正答は不変。

#### n10-q09-right::remainingFactorUX04 — NEW

**問い**：50を、選んだ平方因子25と残りの因子の積にします。残りの因子を計算します。

**思考操作**：50÷25を計算し、積へ戻して確かめる。

**根拠**：既存squareFactorの正答結果と整数の乗除。

**正確な穴位置**：`50=25\times{remainingFactorUX04}`（`n10-q09-right::ux04-remaining`）

**先行必須**：`squareFactor`

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `2` | `2` | 正答 | この操作を確定し、次の計算へ進みます。 |
| `25` | `25` | 誤答 | 25との積が元の50へ戻るか確かめてください。平方因子をそのまま残りの因子へ写しません。 |
| `5` | `5` | 誤答 | 選んだ平方因子25と掛け合わせ、元の50に一致するかを確認してください。 |

**正答後の解放候補row**：`n10-q09-right::ux04-coefficient`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：現在の穴・選択値・誤答説明を保持し、後続を解放しない。

#### n10-q09-right::coefficient — KEEP

**問い**：右の項の係数√25を求めます。

**思考操作**：指定した演算の結果を計算する

**根拠**：source db99の同一原問題・同一の局所操作。

**正確な穴位置**：`\sqrt{50}=\sqrt{25}\sqrt{ {mirror:remainingFactorUX04} }={coefficient}\sqrt{ {mirror:remainingFactorUX04} }`（`n10-q09-right::ux04-coefficient`）

**先行必須**：`squareFactor`, `remainingFactorUX04`

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `5` | `5` | 正答 | 確定した結果を次の計算へ使います。 |
| `25` | `25` | 誤答 | 平方数とその平方根を区別します。 |
| `10` | `10` | 誤答 | 平方して25になる非負の数を求めます。 |

**正答後の解放候補row**：
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：既存の誤答説明を表示し、後続を解放しない。

**KEEP理由**：√25の非負の値5を求める操作は不変。残りの因子2の新回答と意味が違うのでaliasしない。

### 表示・解放の正確な順序

| row ID / 用途 | template | 全gate正答で解放 | 当該行の全穴正答で消す足場 |
|---|---|---|---|
| `n10-q09-right::ux04-square-factor` / n10-q09-right-ux04-factor-selection | `\text{50の最大の平方因子：}\quad{squareFactor}` | 初期 | squareFactor |
| `n10-q09-right::ux04-remaining` / n10-q09-right-ux04-main | `50=25\times{remainingFactorUX04}` | squareFactor | 保持 |
| `n10-q09-right::ux04-coefficient` / n10-q09-right-ux04-main | `\sqrt{50}=\sqrt{25}\sqrt{ {mirror:remainingFactorUX04} }={coefficient}\sqrt{ {mirror:remainingFactorUX04} }` | squareFactor, remainingFactorUX04 | 保持 |

### 答え漏洩・既出値・配置

- remainingFactorUX04の回答前に完成分解や根号内の2を見せない。
- coefficientの期待値と同じ数になっても、割算と平方根の別操作であり、同一回答のmirrorにはしない。
- 左で説明した手順は右で長く繰り返さず、転移として同じ三操作を実行する。

補助計算のgroupと本体等式鎖のgroupを区別。正答後に補助足場を閉じ、本体に確定した導出を一度残す。N08基準の段階帯/本文/番号付き縦選択肢/左下resetは維持。

### 既存partの処遇

| oldId | 判断 | targetId / 保存 | 理由 |
|---|---|---|---|
| `n10-q09-right::squareFactor` | KEEP | `n10-q09-right::squareFactor` | 最大の平方因子を選ぶ学習行為・候補・正答は不変。 |
| `n10-q09-right::coefficient` | KEEP | `n10-q09-right::coefficient` | √25の非負の値5を求める操作は不変。残りの因子2の新回答と意味が違うのでaliasしない。 |

**node依存の変更案**：`{"addPrerequisiteNodeIds": [], "addRequiredResultRefs": []}`

**terminal**：元resultIdを維持し、当node全必須part正答後だけ成立させる。後続nodeで未回答の計算結果を先出ししない。

## 5. n10-q10-coefficients — n10-stage-05

**現状**：くくる変形は自動で、係数の和7だけを回答。

### 穴のない完成解法

\[2\sqrt2+5\sqrt2=(2+5)\sqrt2=7\sqrt2\]

### 学習者への導入・前提

二つの項に共通する因子を見つけ、係数を残してくくります。その後、何個分になるかを計算しましょう。

- 前段で左項2√2、右項5√2を確定。分配法則を逆に使ってよい。

### 穴と全選択肢

#### n10-q10-coefficients::commonFactorUX04 — NEW

**問い**：係数2と5をそのまま残してくくるとき、共通の因子は何ですか。

**思考操作**：二項の共通因子を対応づけ、分配法則の逆でくくる。

**根拠**：2√2と5√2の確定結果、分配法則。

**正確な穴位置**：`2\sqrt2+5\sqrt2=(2+5){commonFactorUX04}`（`n10-q10-coefficients::ux04-factor`）

**先行必須**：なし

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `\sqrt2` | `\sqrt2` | 正答 | この操作を確定し、次の計算へ進みます。 |
| `2` | `2` | 誤答 | 括弧の中を2+5のままにしたとき、その因子を配り戻して元の各項になるかを確認してください。 |
| `\sqrt7` | `\sqrt7` | 誤答 | 根号内を足す変形はしていません。二つの項に共通して掛かっている因子を見てください。 |

**正答後の解放候補row**：`n10-q10-coefficients::ux04-coefficient`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：現在の穴・選択値・誤答説明を保持し、後続を解放しない。

#### n10-q10-coefficients::coefficient — KEEP

**問い**：係数2+5を計算します。

**思考操作**：指定した演算の結果を計算する

**根拠**：source db99の同一原問題・同一の局所操作。

**正確な穴位置**：`={coefficient}{mirror:commonFactorUX04}`（`n10-q10-coefficients::ux04-coefficient`）

**先行必須**：`commonFactorUX04`

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `7` | `7` | 正答 | 確定した結果を次の計算へ使います。 |
| `10` | `10` | 誤答 | 係数を掛けずに足します。 |
| `3` | `3` | 誤答 | 二つの項は加算されています。 |

**正答後の解放候補row**：
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：既存の誤答説明を表示し、後続を解放しない。

**KEEP理由**：2+5という係数の和の計算・候補・正答7は不変。

### 表示・解放の正確な順序

| row ID / 用途 | template | 全gate正答で解放 | 当該行の全穴正答で消す足場 |
|---|---|---|---|
| `n10-q10-coefficients::ux04-factor` / n10-q10-coefficients-ux04-main | `2\sqrt2+5\sqrt2=(2+5){commonFactorUX04}` | 初期 | 保持 |
| `n10-q10-coefficients::ux04-coefficient` / n10-q10-coefficients-ux04-main | `={coefficient}{mirror:commonFactorUX04}` | commonFactorUX04 | 保持 |

### 答え漏洩・既出値・配置

- leadで「共通の√2」「係数だけを足す」と答えを先書きしない。
- 係数2と5をそのまま残す指定により、別の因子をくくる一般的な別解を否定しない。

補助計算のgroupと本体等式鎖のgroupを区別。正答後に補助足場を閉じ、本体に確定した導出を一度残す。N08基準の段階帯/本文/番号付き縦選択肢/左下resetは維持。

### 既存partの処遇

| oldId | 判断 | targetId / 保存 | 理由 |
|---|---|---|---|
| `n10-q10-coefficients::coefficient` | KEEP | `n10-q10-coefficients::coefficient` | 2+5という係数の和の計算・候補・正答7は不変。 |

**node依存の変更案**：`{"addPrerequisiteNodeIds": [], "addRequiredResultRefs": []}`

**terminal**：元resultIdを維持し、当node全必須part正答後だけ成立させる。後続nodeで未回答の計算結果を先出ししない。

## 6. n10-q11-formula — n10-stage-06

**現状**：公式A²−2AB+B²は既に用意され、中項の−だけを選ぶ。

### 穴のない完成解法

A=√2、B=√3と置く。差を符号込みの和として、二つの括弧を分配する。

\[(A-B)^2=(A-B)(A-B)=A^2+A(-B)+(-B)A+(-B)(-B)=A^2-AB-AB+B^2=A^2-2AB+B^2\]

### 学習者への導入・前提

二つの括弧を二項の和として読みます。前の括弧の各項を後の括弧の各項へ掛け、同じ交差項をまとめましょう。

- A=√2>0、B=√3>0。平方は同じ式の二回の積。分配法則と乗法の交換・結合を使う。

### 穴と全選択肢

#### n10-q11-formula::signedSecondUX04 — NEW

**問い**：A−Bを二項の和として読むと、第二項は何ですか。

**思考操作**：差の第二項を負号込みで取り出し、二つの括弧の分配対象を構成する。

**根拠**：差は負の数の加法として扱える。A=√2、B=√3。

**正確な穴位置**：`A-B=A+({signedSecondUX04})`（`n10-q11-formula::ux04-signed-second`）

**先行必須**：なし

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `-B` | `-B` | 正答 | この操作を確定し、次の計算へ進みます。 |
| `B` | `B` | 誤答 | 元の括弧はAとBの差です。第二項の符号を含めてください。 |
| `-A` | `-A` | 誤答 | 負号が付く元の第二項はBです。AとBの対応を入れ替えないでください。 |

**正答後の解放候補row**：`n10-q11-formula::ux04-cross-construction`, `n10-q11-formula::ux04-four-products`, `n10-q11-formula::ux04-cross-sign`, `n10-q11-formula::ux04-last-sign`, `n10-q11-formula::ux04-cross-count`, `n10-q11-formula::ux04-signed-products`, `n10-q11-formula::ux04-combined`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：現在の穴・選択値・誤答説明を保持し、後続を解放しない。

#### n10-q11-formula::firstCrossProductUX04 — NEW

**問い**：前の括弧の第一項と、後ろの括弧の第二項からできる交差積を選びます。

**思考操作**：二つの括弧の異なる位置の項を対応づけ、符号込みの因子二つから一方の交差積を構成する。

**根拠**：既習の分配法則。完成公式ではなく、二つの括弧の項の組合せを用いる。

**正確な穴位置**：`(A-B)^2=A^2+{firstCrossProductUX04}+{secondCrossProductUX04}+(-B)(-B)`（`n10-q11-formula::ux04-cross-construction`）

**先行必須**：`signedSecondUX04`

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `A(-B)` | `A(-B)` | 正答 | この操作を確定し、次の計算へ進みます。 |
| `A^2` | `A^2` | 誤答 | それは第一項どうしの積です。前括弧の第一項と後括弧の第二項という交差する組を選びます。 |
| `(-B)(-B)` | `(-B)(-B)` | 誤答 | それは第二項どうしの積です。式の中の別の積としては現れますが、指定した交差積ではありません。 |

**正答後の解放候補row**：`n10-q11-formula::ux04-four-products`, `n10-q11-formula::ux04-cross-sign`, `n10-q11-formula::ux04-last-sign`, `n10-q11-formula::ux04-cross-count`, `n10-q11-formula::ux04-signed-products`, `n10-q11-formula::ux04-combined`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：現在の穴・選択値・誤答説明を保持し、後続を解放しない。

#### n10-q11-formula::secondCrossProductUX04 — NEW

**問い**：前の括弧の第二項と、後ろの括弧の第一項からできる、もう一方の交差積を選びます。

**思考操作**：もう一方の交差する因子の組を構成し、片方の交差積を落とさない。

**根拠**：既習の分配法則。前後の括弧の項を符号込みで対応づける。

**正確な穴位置**：`(A-B)^2=A^2+{firstCrossProductUX04}+{secondCrossProductUX04}+(-B)(-B)`（`n10-q11-formula::ux04-cross-construction`）

**先行必須**：`signedSecondUX04`, `firstCrossProductUX04`

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `(-B)A` | `(-B)A` | 正答 | この操作を確定し、次の計算へ進みます。 |
| `BA` | `BA` | 誤答 | 元の二つの括弧で、指定された位置の二項を符号込みで確かめてください。 |
| `(-B)(-B)` | `(-B)(-B)` | 誤答 | それは第二項どうしの積です。前の第二項と後ろの第一項という組に合わせます。 |

**正答後の解放候補row**：`n10-q11-formula::ux04-four-products`, `n10-q11-formula::ux04-cross-sign`, `n10-q11-formula::ux04-last-sign`, `n10-q11-formula::ux04-cross-count`, `n10-q11-formula::ux04-signed-products`, `n10-q11-formula::ux04-combined`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：現在の穴・選択値・誤答説明を保持し、後続を解放しない。

#### n10-q11-formula::crossProductSignUX04 — NEW

**問い**：Aと−Bの積をABの符号付きの形にします。符号を決めます。

**思考操作**：正のAと負の−Bの積の符号を決め、交差積を構成する。

**根拠**：A=√2>0、B=√3>0。

**正確な穴位置**：`A(-B)={crossProductSignUX04}AB`（`n10-q11-formula::ux04-cross-sign`）

**先行必須**：`signedSecondUX04`, `firstCrossProductUX04`, `secondCrossProductUX04`

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `-` | `-` | 正答 | この操作を確定し、次の計算へ進みます。 |
| `+` | `+` | 誤答 | 正の数Aと負の数−Bを掛けています。積の符号を確かめてください。 |

**正答後の解放候補row**：`n10-q11-formula::ux04-last-sign`, `n10-q11-formula::ux04-cross-count`, `n10-q11-formula::ux04-signed-products`, `n10-q11-formula::ux04-combined`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：現在の穴・選択値・誤答説明を保持し、後続を解放しない。

#### n10-q11-formula::lastProductSignUX04 — NEW

**問い**：二つの−Bの積を、B²の符号付きの形にします。

**思考操作**：負数二つの積から最後の平方項の符号を決める。

**根拠**：負×負は正、B×B=B²。

**正確な穴位置**：`(-B)(-B)={lastProductSignUX04}B^2`（`n10-q11-formula::ux04-last-sign`）

**先行必須**：`signedSecondUX04`, `firstCrossProductUX04`, `secondCrossProductUX04`, `crossProductSignUX04`

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `+` | `+` | 正答 | この操作を確定し、次の計算へ進みます。 |
| `-` | `-` | 誤答 | 二つの因子の両方に負号があります。一つだけの負号として扱わないでください。 |

**正答後の解放候補row**：`n10-q11-formula::ux04-cross-count`, `n10-q11-formula::ux04-signed-products`, `n10-q11-formula::ux04-combined`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：現在の穴・選択値・誤答説明を保持し、後続を解放しない。

#### n10-q11-formula::crossMultiplicityUX04 — NEW

**問い**：同じABの負の項を二つ合わせます。−ABの何個分ですか。

**思考操作**：二つの同類の交差項を合成し、係数2を自分で作る。

**根拠**：−AB−AB=−(1+1)AB。

**正確な穴位置**：`-AB-AB=-{crossMultiplicityUX04}AB`（`n10-q11-formula::ux04-cross-count`）

**先行必須**：`signedSecondUX04`, `firstCrossProductUX04`, `secondCrossProductUX04`, `crossProductSignUX04`, `lastProductSignUX04`

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `2` | `2` | 正答 | この操作を確定し、次の計算へ進みます。 |
| `1` | `1` | 誤答 | 交差する積は二つあります。一方を落とさないでください。 |
| `4` | `4` | 誤答 | 四つの積全部が交差項ではありません。今まとめる二つの−ABだけを見てください。 |

**正答後の解放候補row**：`n10-q11-formula::ux04-signed-products`, `n10-q11-formula::ux04-combined`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：現在の穴・選択値・誤答説明を保持し、後続を解放しない。

### 表示・解放の正確な順序

| row ID / 用途 | template | 全gate正答で解放 | 当該行の全穴正答で消す足場 |
|---|---|---|---|
| `n10-q11-formula::ux04-repeat` / n10-q11-formula-ux04-main | `(A-B)^2=(A-B)(A-B)` | 初期 | 保持 |
| `n10-q11-formula::ux04-signed-second` / n10-q11-formula-ux04-operand | `A-B=A+({signedSecondUX04})` | 初期 | signedSecondUX04 |
| `n10-q11-formula::ux04-cross-construction` / n10-q11-formula-ux04-main | `(A-B)^2=A^2+{firstCrossProductUX04}+{secondCrossProductUX04}+(-B)(-B)` | signedSecondUX04 | firstCrossProductUX04, secondCrossProductUX04 |
| `n10-q11-formula::ux04-four-products` / n10-q11-formula-ux04-main | `(A-B)^2=A^2+{mirror:firstCrossProductUX04}+{mirror:secondCrossProductUX04}+(-B)(-B)` | signedSecondUX04, firstCrossProductUX04, secondCrossProductUX04 | 保持 |
| `n10-q11-formula::ux04-cross-sign` / n10-q11-formula-ux04-cross-sign | `A(-B)={crossProductSignUX04}AB` | signedSecondUX04, firstCrossProductUX04, secondCrossProductUX04 | crossProductSignUX04 |
| `n10-q11-formula::ux04-last-sign` / n10-q11-formula-ux04-last-sign | `(-B)(-B)={lastProductSignUX04}B^2` | signedSecondUX04, firstCrossProductUX04, secondCrossProductUX04, crossProductSignUX04 | lastProductSignUX04 |
| `n10-q11-formula::ux04-cross-count` / n10-q11-formula-ux04-cross-sum | `-AB-AB=-{crossMultiplicityUX04}AB` | signedSecondUX04, firstCrossProductUX04, secondCrossProductUX04, crossProductSignUX04, lastProductSignUX04 | crossMultiplicityUX04 |
| `n10-q11-formula::ux04-signed-products` / n10-q11-formula-ux04-main | `(A-B)^2=A^2-AB-AB+B^2` | signedSecondUX04, firstCrossProductUX04, secondCrossProductUX04, crossProductSignUX04, lastProductSignUX04, crossMultiplicityUX04 | 保持 |
| `n10-q11-formula::ux04-combined` / n10-q11-formula-ux04-main | `=A^2-2AB+B^2` | signedSecondUX04, firstCrossProductUX04, secondCrossProductUX04, crossProductSignUX04, lastProductSignUX04, crossMultiplicityUX04 | 保持 |

### 答え漏洩・既出値・配置

- 完成公式A²−2AB+B²を初期lead/assumptions/ヒントで見せない。
- 四つの積はsignedSecond正答後だけ作る。交差積の符号、最後の平方の符号、交差項の合成は別判断として解放する。
- 旧middleSignは完成公式の符号当て。新crossProductSignの同じ−へ意味aliasしない。
- 数値の平方2/3は次node n10-11の既存穴に残す。このnodeでは先に計算しない。
- signedSecondの一穴後に四つの積を全自動で完成させない。交差する二組の因子をNEWで構成してから、符号計算と同類項の合成へ進む。
- 正しい可換順の積を誤答候補には入れない。候補中の別の正しい展開項は、数学的誤りではなく指定した位置の組に合わないと説明する。
- 補助計算後に本体へ戻る行には元式を完全な左辺として明示。直前の補助量へ=で分数/別の式をつなげない。

補助計算のgroupと本体等式鎖のgroupを区別。正答後に補助足場を閉じ、本体に確定した導出を一度残す。N08基準の段階帯/本文/番号付き縦選択肢/左下resetは維持。

### 既存partの処遇

| oldId | 判断 | targetId / 保存 | 理由 |
|---|---|---|---|
| `n10-q11-formula::middleSign` | RETIRE | r4 archiveのみ、新partへaliasなし | 問いの対象/要求する操作/判断位置を変更するため、新partへ旧recordを流用しない。 |

**node依存の変更案**：`{"addPrerequisiteNodeIds": [], "addRequiredResultRefs": []}`

**terminal**：元resultIdを維持し、当node全必須part正答後だけ成立させる。後続nodeで未回答の計算結果を先出ししない。

## 7. n10-12 — n10-stage-06

**現状**：項を選別して移す過程は自動、穴は2+3の5だけ。

### 穴のない完成解法

\[2-2\sqrt6+3=(2+3)-2\sqrt6=5-2\sqrt6\]

### 学習者への導入・前提

中項の計算結果を保ち、先にまとめる二項を選びます。符号も含めて項を見ましょう。

- 前段で中項の根号を√6と確定。加法の交換・結合を使ってよい。

### 穴と全選択肢

#### n10-12::rootFreePairUX04 — NEW

**問い**：この式で先にまとめる、根号を含まない二項を選びます。

**思考操作**：符号付きの項を識別し、根号を含む項を保って根号のない二項を取り出す。

**根拠**：2−2√6+3の項の構造、加法の交換・結合。

**正確な穴位置**：`\text{先にまとめる二項：}\quad{rootFreePairUX04}`（`n10-12::ux04-pair`）

**先行必須**：なし

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `2,3` | `2,3` | 正答 | この操作を確定し、次の計算へ進みます。 |
| `2,-2\sqrt6` | `2,-2\sqrt6` | 誤答 | その組には根号を含む項があります。今回は根号を含まない二項をまとめる指定です。 |
| `-2\sqrt6,3` | `-2\sqrt6,3` | 誤答 | −2√6は残す項です。根号を含まない二項の組を選んでください。 |

**正答後の解放候補row**：`n10-12::ux04-regroup`, `n10-12::ux04-sum`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：現在の穴・選択値・誤答説明を保持し、後続を解放しない。

#### n10-12::constant — KEEP

**問い**：普通の数2+3を計算します。

**思考操作**：指定した演算の結果を計算する

**根拠**：source db99の同一原問題・同一の局所操作。

**正確な穴位置**：`={constant}-2\sqrt6`（`n10-12::ux04-sum`）

**先行必須**：`rootFreePairUX04`

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `5` | `5` | 正答 | 確定した結果を次の計算へ使います。 |
| `-1` | `-1` | 誤答 | 普通の数は2と+3です。 |
| `6` | `6` | 誤答 | 足し算を掛け算へ変えません。 |

**正答後の解放候補row**：
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：既存の誤答説明を表示し、後続を解放しない。

**KEEP理由**：2と+3の和を計算する操作・全候補・正答5は不変。

### 表示・解放の正確な順序

| row ID / 用途 | template | 全gate正答で解放 | 当該行の全穴正答で消す足場 |
|---|---|---|---|
| `n10-12::ux04-source` / n10-12-ux04-main | `2-2\sqrt6+3` | 初期 | 保持 |
| `n10-12::ux04-pair` / n10-12-ux04-term-selection | `\text{先にまとめる二項：}\quad{rootFreePairUX04}` | 初期 | rootFreePairUX04 |
| `n10-12::ux04-regroup` / n10-12-ux04-main | `=(2+3)-2\sqrt6` | rootFreePairUX04 | 保持 |
| `n10-12::ux04-sum` / n10-12-ux04-main | `={constant}-2\sqrt6` | rootFreePairUX04 | 保持 |

### 答え漏洩・既出値・配置

- leadで「普通の数2と3を集める」を先書きしない。
- √6を含む数も数学的には定数であるため、「定数項だけ」という不正確な分類名を使わず「根号を含まない二項」と指定する。
- 部分式の組という回答であり、完成した変形公式一式を選ばせる問いにしない。

補助計算のgroupと本体等式鎖のgroupを区別。正答後に補助足場を閉じ、本体に確定した導出を一度残す。N08基準の段階帯/本文/番号付き縦選択肢/左下resetは維持。

### 既存partの処遇

| oldId | 判断 | targetId / 保存 | 理由 |
|---|---|---|---|
| `n10-12::constant` | KEEP | `n10-12::constant` | 2と+3の和を計算する操作・全候補・正答5は不変。 |

**node依存の変更案**：`{"addPrerequisiteNodeIds": [], "addRequiredResultRefs": []}`

**terminal**：元resultIdを維持し、当node全必須part正答後だけ成立させる。後続nodeで未回答の計算結果を先出ししない。

## 8. n10-q13-identity — n10-stage-07

**現状**：中項が相殺される過程が省かれ、公式の−だけを選ぶ。

### 穴のない完成解法

A=√7、B=√2として、右の差をA+(−B)と読む。

\[(A+B)(A-B)=A^2+A(-B)+BA+B(-B)=A^2-AB+AB-B^2=A^2+0-B^2=A^2-B^2\]

### 学習者への導入・前提

右の括弧を二項の和として読み、二つの括弧を分配します。四つの積のうち、交差する二つの項がどうまとまるかを調べましょう。

- A=√7>0、B=√2>0。分配法則と乗法の交換・結合を使う。

### 穴と全選択肢

#### n10-q13-identity::signedSecondUX04 — NEW

**問い**：右の括弧A−Bを二項の和として読むと、第二項は何ですか。

**思考操作**：右括弧の差の第二項を負号込みで取り出し、分配する対象を構成する。

**根拠**：A=√7、B=√2、差を負数の和として読む。

**正確な穴位置**：`A-B=A+({signedSecondUX04})`（`n10-q13-identity::ux04-signed-second`）

**先行必須**：なし

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `-B` | `-B` | 正答 | この操作を確定し、次の計算へ進みます。 |
| `B` | `B` | 誤答 | 右の括弧はA+BではなくA−Bです。第二項の負号を含めてください。 |
| `-A` | `-A` | 誤答 | 負号の付く第二項はBです。左の項Aと入れ替えないでください。 |

**正答後の解放候補row**：`n10-q13-identity::ux04-cross-construction`, `n10-q13-identity::ux04-four-products`, `n10-q13-identity::ux04-cross-sign`, `n10-q13-identity::ux04-last-sign`, `n10-q13-identity::ux04-cancel`, `n10-q13-identity::ux04-signed-sum`, `n10-q13-identity::ux04-zero`, `n10-q13-identity::ux04-difference`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：現在の穴・選択値・誤答説明を保持し、後続を解放しない。

#### n10-q13-identity::firstCrossProductUX04 — NEW

**問い**：前の括弧の第一項と、後ろの括弧の第二項からできる交差積を選びます。

**思考操作**：二つの括弧の異なる位置の項を対応づけ、符号込みの因子二つから一方の交差積を構成する。

**根拠**：既習の分配法則。完成公式ではなく、二つの括弧の項の組合せを用いる。

**正確な穴位置**：`(A+B)(A-B)=A^2+{firstCrossProductUX04}+{secondCrossProductUX04}+B(-B)`（`n10-q13-identity::ux04-cross-construction`）

**先行必須**：`signedSecondUX04`

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `A(-B)` | `A(-B)` | 正答 | この操作を確定し、次の計算へ進みます。 |
| `A^2` | `A^2` | 誤答 | それは第一項どうしの積です。前括弧の第一項と後括弧の第二項という交差する組を選びます。 |
| `B(-B)` | `B(-B)` | 誤答 | それは第二項どうしの積です。式の中の別の積としては現れますが、指定した交差積ではありません。 |

**正答後の解放候補row**：`n10-q13-identity::ux04-four-products`, `n10-q13-identity::ux04-cross-sign`, `n10-q13-identity::ux04-last-sign`, `n10-q13-identity::ux04-cancel`, `n10-q13-identity::ux04-signed-sum`, `n10-q13-identity::ux04-zero`, `n10-q13-identity::ux04-difference`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：現在の穴・選択値・誤答説明を保持し、後続を解放しない。

#### n10-q13-identity::secondCrossProductUX04 — NEW

**問い**：前の括弧の第二項と、後ろの括弧の第一項からできる、もう一方の交差積を選びます。

**思考操作**：もう一方の交差する因子の組を構成し、片方の交差積を落とさない。

**根拠**：既習の分配法則。前後の括弧の項を符号込みで対応づける。

**正確な穴位置**：`(A+B)(A-B)=A^2+{firstCrossProductUX04}+{secondCrossProductUX04}+B(-B)`（`n10-q13-identity::ux04-cross-construction`）

**先行必須**：`signedSecondUX04`, `firstCrossProductUX04`

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `BA` | `BA` | 正答 | この操作を確定し、次の計算へ進みます。 |
| `A^2` | `A^2` | 誤答 | 元の二つの括弧で、指定された位置の二項を符号込みで確かめてください。 |
| `B(-B)` | `B(-B)` | 誤答 | それは第二項どうしの積です。前の第二項と後ろの第一項という組に合わせます。 |

**正答後の解放候補row**：`n10-q13-identity::ux04-four-products`, `n10-q13-identity::ux04-cross-sign`, `n10-q13-identity::ux04-last-sign`, `n10-q13-identity::ux04-cancel`, `n10-q13-identity::ux04-signed-sum`, `n10-q13-identity::ux04-zero`, `n10-q13-identity::ux04-difference`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：現在の穴・選択値・誤答説明を保持し、後続を解放しない。

#### n10-q13-identity::crossProductSignUX04 — NEW

**問い**：A×(−B)をABの符号付きの形にします。

**思考操作**：正のAと負の−Bから交差積の符号を決める。

**根拠**：A>0、B>0と乗法の符号。

**正確な穴位置**：`A(-B)={crossProductSignUX04}AB`（`n10-q13-identity::ux04-cross-sign`）

**先行必須**：`signedSecondUX04`, `firstCrossProductUX04`, `secondCrossProductUX04`

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `-` | `-` | 正答 | この操作を確定し、次の計算へ進みます。 |
| `+` | `+` | 誤答 | Aは正、−Bは負です。積の符号を確かめてください。 |

**正答後の解放候補row**：`n10-q13-identity::ux04-last-sign`, `n10-q13-identity::ux04-cancel`, `n10-q13-identity::ux04-signed-sum`, `n10-q13-identity::ux04-zero`, `n10-q13-identity::ux04-difference`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：現在の穴・選択値・誤答説明を保持し、後続を解放しない。

#### n10-q13-identity::lastSquareSignUX04 — NEW

**問い**：B×(−B)をB²の符号付きの形にします。

**思考操作**：最後の積が負の平方項になることを構成する。

**根拠**：B>0、−B<0、B×B=B²。

**正確な穴位置**：`B(-B)={lastSquareSignUX04}B^2`（`n10-q13-identity::ux04-last-sign`）

**先行必須**：`signedSecondUX04`, `firstCrossProductUX04`, `secondCrossProductUX04`, `crossProductSignUX04`

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `-` | `-` | 正答 | この操作を確定し、次の計算へ進みます。 |
| `+` | `+` | 誤答 | 最後の二つの因子はBと−Bです。両方が負の場合と区別してください。 |

**正答後の解放候補row**：`n10-q13-identity::ux04-cancel`, `n10-q13-identity::ux04-signed-sum`, `n10-q13-identity::ux04-zero`, `n10-q13-identity::ux04-difference`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：現在の穴・選択値・誤答説明を保持し、後続を解放しない。

#### n10-q13-identity::crossCancellationUX04 — NEW

**問い**：二つの交差項−ABと+ABを足した結果を求めます。

**思考操作**：反対の符号を持つ同じ大きさの項を相殺する。

**根拠**：−u+u=0。ここではu=AB、A=√7>0、B=√2>0。

**正確な穴位置**：`-AB+AB={crossCancellationUX04}`（`n10-q13-identity::ux04-cancel`）

**先行必須**：`signedSecondUX04`, `firstCrossProductUX04`, `secondCrossProductUX04`, `crossProductSignUX04`, `lastSquareSignUX04`

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `0` | `0` | 正答 | この操作を確定し、次の計算へ進みます。 |
| `2AB` | `2AB` | 誤答 | 同じ符号のABを二つ足した式ではありません。一方は−ABです。 |
| `-2AB` | `-2AB` | 誤答 | 二つとも−ABではありません。第二の交差項の+を保ってください。 |

**正答後の解放候補row**：`n10-q13-identity::ux04-signed-sum`, `n10-q13-identity::ux04-zero`, `n10-q13-identity::ux04-difference`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：現在の穴・選択値・誤答説明を保持し、後続を解放しない。

### 表示・解放の正確な順序

| row ID / 用途 | template | 全gate正答で解放 | 当該行の全穴正答で消す足場 |
|---|---|---|---|
| `n10-q13-identity::ux04-source` / n10-q13-identity-ux04-main | `(A+B)(A-B)` | 初期 | 保持 |
| `n10-q13-identity::ux04-signed-second` / n10-q13-identity-ux04-operand | `A-B=A+({signedSecondUX04})` | 初期 | signedSecondUX04 |
| `n10-q13-identity::ux04-cross-construction` / n10-q13-identity-ux04-main | `(A+B)(A-B)=A^2+{firstCrossProductUX04}+{secondCrossProductUX04}+B(-B)` | signedSecondUX04 | firstCrossProductUX04, secondCrossProductUX04 |
| `n10-q13-identity::ux04-four-products` / n10-q13-identity-ux04-main | `(A+B)(A-B)=A^2+{mirror:firstCrossProductUX04}+{mirror:secondCrossProductUX04}+B(-B)` | signedSecondUX04, firstCrossProductUX04, secondCrossProductUX04 | 保持 |
| `n10-q13-identity::ux04-cross-sign` / n10-q13-identity-ux04-cross-sign | `A(-B)={crossProductSignUX04}AB` | signedSecondUX04, firstCrossProductUX04, secondCrossProductUX04 | crossProductSignUX04 |
| `n10-q13-identity::ux04-last-sign` / n10-q13-identity-ux04-last-sign | `B(-B)={lastSquareSignUX04}B^2` | signedSecondUX04, firstCrossProductUX04, secondCrossProductUX04, crossProductSignUX04 | lastSquareSignUX04 |
| `n10-q13-identity::ux04-cancel` / n10-q13-identity-ux04-cross-cancel | `-AB+AB={crossCancellationUX04}` | signedSecondUX04, firstCrossProductUX04, secondCrossProductUX04, crossProductSignUX04, lastSquareSignUX04 | crossCancellationUX04 |
| `n10-q13-identity::ux04-signed-sum` / n10-q13-identity-ux04-main | `(A+B)(A-B)=A^2-AB+AB-B^2` | signedSecondUX04, firstCrossProductUX04, secondCrossProductUX04, crossProductSignUX04, lastSquareSignUX04, crossCancellationUX04 | 保持 |
| `n10-q13-identity::ux04-zero` / n10-q13-identity-ux04-main | `=A^2+0-B^2` | signedSecondUX04, firstCrossProductUX04, secondCrossProductUX04, crossProductSignUX04, lastSquareSignUX04, crossCancellationUX04 | 保持 |
| `n10-q13-identity::ux04-difference` / n10-q13-identity-ux04-main | `=A^2-B^2` | signedSecondUX04, firstCrossProductUX04, secondCrossProductUX04, crossProductSignUX04, lastSquareSignUX04, crossCancellationUX04 | 保持 |

### 答え漏洩・既出値・配置

- 最初に「中項が打ち消される」「平方差になる」と完成結論を言わない。目標は二つの交差項を自ら相殺すること。
- 旧operationは完成した恒等式へ演算子を対応させる問い。新しいlastSquareSignUX04の同じ−へ流用しない。
- A²とB²の具体値7/2と差5は次node n10-13の既存三穴に保持し、このnodeで先出ししない。
- signedSecondの一穴後に四つの積を全自動で完成させない。交差する二組の因子をNEWで構成してから、符号計算と同類項の合成へ進む。
- 正しい可換順の積を誤答候補には入れない。候補中の別の正しい展開項は、数学的誤りではなく指定した位置の組に合わないと説明する。
- 補助計算後に本体へ戻る行には元式を完全な左辺として明示。直前の補助量へ=で分数/別の式をつなげない。

補助計算のgroupと本体等式鎖のgroupを区別。正答後に補助足場を閉じ、本体に確定した導出を一度残す。N08基準の段階帯/本文/番号付き縦選択肢/左下resetは維持。

### 既存partの処遇

| oldId | 判断 | targetId / 保存 | 理由 |
|---|---|---|---|
| `n10-q13-identity::operation` | RETIRE | r4 archiveのみ、新partへaliasなし | 問いの対象/要求する操作/判断位置を変更するため、新partへ旧recordを流用しない。 |

**node依存の変更案**：`{"addPrerequisiteNodeIds": [], "addRequiredResultRefs": []}`

**terminal**：元resultIdを維持し、当node全必須part正答後だけ成立させる。後続nodeで未回答の計算結果を先出ししない。

## 9. n10-15 — n10-stage-08

**現状**：分数の積の分子/分母の対応と、分母を平方にする変形は自動。分子√3だけを回答。

### 穴のない完成解法

\[\frac1{2\sqrt3}\frac{\sqrt3}{\sqrt3}=\frac{1\times\sqrt3}{(2\sqrt3)\times\sqrt3}=\frac{1\times\sqrt3}{2(\sqrt3)^2}=\frac{\sqrt3}{2(\sqrt3)^2}\]

### 学習者への導入・前提

前段で選んだ因子√3を上下へ掛けます。元の分母全体を保ち、分母の同じ因子をまとめてから、分子を計算しましょう。

- 元の分母2√3は非零。前段で選んだc=√3は非零で、c/c=1。

### 穴と全選択肢

#### n10-15::denominatorScopeUX04 — NEW

**問い**：元の分数の分母全体を、一つの因子として選びます。

**思考操作**：根号の部分だけに限定せず、元分母2√3全体へ同じ因子を掛ける対応を構成する。

**根拠**：分数の積は分子どうし・分母どうしの積。既にc=√3を選択済み。

**正確な穴位置**：`\text{元の分母全体：}\quad{denominatorScopeUX04}`（`n10-15::ux04-scope`）

**先行必須**：なし

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `2\sqrt3` | `2\sqrt3` | 正答 | この操作を確定し、次の計算へ進みます。 |
| `\sqrt3` | `\sqrt3` | 誤答 | 根号だけを元の分母とみると、係数2が落ちます。分数線の下全体を見てください。 |
| `2` | `2` | 誤答 | 元の分母は2だけではありません。根号を含む因子も一緒に残します。 |

**正答後の解放候補row**：`n10-15::ux04-fraction-product`, `n10-15::ux04-power`, `n10-15::ux04-numerator`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：現在の穴・選択値・誤答説明を保持し、後続を解放しない。

#### n10-15::denominatorPowerUX04 — NEW

**問い**：分母側の√3×√3を、同じ因子の累乗で表します。指数はいくつですか。

**思考操作**：分母の繰返し因子を平方へまとめ、係数2を外側に保つ。

**根拠**：平方は同じ数を二回掛けた積。

**正確な穴位置**：`(2\sqrt3)\sqrt3=2(\sqrt3)^{denominatorPowerUX04}`（`n10-15::ux04-power`）

**先行必須**：`denominatorScopeUX04`

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `2` | `2` | 正答 | この操作を確定し、次の計算へ進みます。 |
| `1` | `1` | 誤答 | √3の因子が二つあります。一つを落としていませんか。 |
| `3` | `3` | 誤答 | √3は二つの因子です。根号の中の3と指数を区別してください。 |

**正答後の解放候補row**：`n10-15::ux04-numerator`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：現在の穴・選択値・誤答説明を保持し、後続を解放しない。

#### n10-15::numerator — KEEP

**問い**：分子1×√3を計算します。

**思考操作**：指定した演算の結果を計算する

**根拠**：source db99の同一原問題・同一の局所操作。

**正確な穴位置**：`\frac1{2\sqrt3}\frac{\sqrt3}{\sqrt3}=\frac{ {numerator} }{2(\sqrt3)^{mirror:denominatorPowerUX04}}`（`n10-15::ux04-numerator`）

**先行必須**：`denominatorScopeUX04`, `denominatorPowerUX04`

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `\sqrt3` | `\sqrt3` | 正答 | 確定した結果を次の計算へ使います。 |
| `1` | `1` | 誤答 | 分子にも選んだ因子を掛けます。 |
| `3` | `3` | 誤答 | 分子は根号同士の平方ではなく1×√3です。 |

**正答後の解放候補row**：
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：既存の誤答説明を表示し、後続を解放しない。

**KEEP理由**：分子1×√3の計算は同じ対象・演算・全候補・正答√3のまま。分母全体選択と混同しない。

### 表示・解放の正確な順序

| row ID / 用途 | template | 全gate正答で解放 | 当該行の全穴正答で消す足場 |
|---|---|---|---|
| `n10-15::ux04-source` / n10-15-ux04-main | `\frac1{2\sqrt3}\frac{\sqrt3}{\sqrt3}` | 初期 | 保持 |
| `n10-15::ux04-scope` / n10-15-ux04-scope | `\text{元の分母全体：}\quad{denominatorScopeUX04}` | 初期 | denominatorScopeUX04 |
| `n10-15::ux04-fraction-product` / n10-15-ux04-main | `=\frac{1\times\sqrt3}{({mirror:denominatorScopeUX04})\times\sqrt3}` | denominatorScopeUX04 | 保持 |
| `n10-15::ux04-power` / n10-15-ux04-denominator | `(2\sqrt3)\sqrt3=2(\sqrt3)^{denominatorPowerUX04}` | denominatorScopeUX04 | denominatorPowerUX04 |
| `n10-15::ux04-numerator` / n10-15-ux04-main | `\frac1{2\sqrt3}\frac{\sqrt3}{\sqrt3}=\frac{ {numerator} }{2(\sqrt3)^{mirror:denominatorPowerUX04}}` | denominatorScopeUX04, denominatorPowerUX04 | 保持 |

### 答え漏洩・既出値・配置

- 前段で選んだc=√3を再回答させない。今回の新scopeは掛ける因子ではなく「元の分母全体」。
- (√3)²=3と分母6は次node n10-q16-denominatorで初めて回答するため先出ししない。
- 分母を2と根号に分けても、2を落とす誤答を数学的に正しい別表現として許可しない。一方、等しい並べ替えを候補にして誤答扱いしない。
- 分母の平方を調べる補助式の後、分数の本体へ戻る行は元の分数積を完全左辺に明記する。

補助計算のgroupと本体等式鎖のgroupを区別。正答後に補助足場を閉じ、本体に確定した導出を一度残す。N08基準の段階帯/本文/番号付き縦選択肢/左下resetは維持。

### 既存partの処遇

| oldId | 判断 | targetId / 保存 | 理由 |
|---|---|---|---|
| `n10-15::numerator` | KEEP | `n10-15::numerator` | 分子1×√3の計算は同じ対象・演算・全候補・正答√3のまま。分母全体選択と混同しない。 |

**node依存の変更案**：`{"addPrerequisiteNodeIds": [], "addRequiredResultRefs": []}`

**terminal**：元resultIdを維持し、当node全必須part正答後だけ成立させる。後続nodeで未回答の計算結果を先出ししない。

## 10. n10-17 — n10-stage-09

**現状**：×を一度選ぶだけで、元の分子/分母の対応とcの代入まで完成。

### 穴のない完成解法

\[\frac{\sqrt3}{\sqrt3+\sqrt2}\frac c c=\frac{\sqrt3\times c}{(\sqrt3+\sqrt2)\times c}=\frac{\sqrt3(\sqrt3-\sqrt2)}{(\sqrt3+\sqrt2)(\sqrt3-\sqrt2)},\quad c=\sqrt3-\sqrt2\ne0\]

### 学習者への導入・前提

認定済みの非零の因子cを上下へ掛けます。元の分子と分母全体を別々に対応づけ、積の分数を組み立てましょう。

- 前段でc=√3−√2≠0を確認。c/c=1。元の分母√3+√2は非零。

### 穴と全選択肢

#### n10-17::numeratorBaseUX04 — NEW

**問い**：掛け算をする前の元の分子を選びます。

**思考操作**：元の分子を、掛ける因子や分母と区別して積の上側へ対応づける。

**根拠**：元の分数√3/(√3+√2)、既に選んだ非零c=√3−√2。

**正確な穴位置**：`\text{元の分子：}\quad{numeratorBaseUX04}`（`n10-17::ux04-numerator-scope`）

**先行必須**：なし

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `\sqrt3` | `\sqrt3` | 正答 | この操作を確定し、次の計算へ進みます。 |
| `\sqrt3+\sqrt2` | `\sqrt3+\sqrt2` | 誤答 | その和は元の分母です。分数線の上の対象を選びます。 |
| `1` | `1` | 誤答 | 今回の元の分子は1ではありません。前の例題の分子と取り違えないでください。 |

**正答後の解放候補row**：`n10-17::ux04-denominator-scope`, `n10-17::ux04-operation`, `n10-17::ux04-assembled`, `n10-17::ux04-substitution`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：現在の穴・選択値・誤答説明を保持し、後続を解放しない。

#### n10-17::denominatorBaseUX04 — NEW

**問い**：元の分母全体を、一つの因子として選びます。

**思考操作**：和の二項を含む分母全体へcを掛けるscopeを構成する。

**根拠**：分数線の下の全体は√3+√2。

**正確な穴位置**：`\text{元の分母全体：}\quad{denominatorBaseUX04}`（`n10-17::ux04-denominator-scope`）

**先行必須**：`numeratorBaseUX04`

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `\sqrt3+\sqrt2` | `\sqrt3+\sqrt2` | 正答 | この操作を確定し、次の計算へ進みます。 |
| `\sqrt3` | `\sqrt3` | 誤答 | 分母の和の一項だけが選ばれています。分母全体を残します。 |
| `\sqrt2` | `\sqrt2` | 誤答 | 元の分母にはもう一方の根号の項もあります。和の全体を選びます。 |

**正答後の解放候補row**：`n10-17::ux04-operation`, `n10-17::ux04-assembled`, `n10-17::ux04-substitution`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：現在の穴・選択値・誤答説明を保持し、後続を解放しない。

#### n10-17::productOperation — KEEP

**問い**：二つの分数の積では、分子どうしと分母どうしをどの演算でまとめますか。

**思考操作**：二つの分数の積では、分子どうしと分母どうしをどの演算でまとめますか。

**根拠**：source db99の同一原問題・同一の局所操作。

**正確な穴位置**：`\text{上下の積を作る演算：}\quad{productOperation}`（`n10-17::ux04-operation`）

**先行必須**：`numeratorBaseUX04`, `denominatorBaseUX04`

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `\times` | `\times` | 正答 | この判断を確定し、次へ進みます。 |
| `+` | `+` | 誤答 | 分数の積であり、分子・分母に加える変形ではありません。 |
| `\div` | `\div` | 誤答 | 掛ける因子c/cとの積を作っています。 |

**正答後の解放候補row**：`n10-17::ux04-assembled`, `n10-17::ux04-substitution`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：既存の誤答説明を表示し、後続を解放しない。

**KEEP理由**：分数の積で上下をそれぞれ乗算にする判断・全候補・正答×は不変。元の対象を選ぶ二つの前提を新規追加する。

### 表示・解放の正確な順序

| row ID / 用途 | template | 全gate正答で解放 | 当該行の全穴正答で消す足場 |
|---|---|---|---|
| `n10-17::ux04-source` / n10-17-ux04-main | `\frac{\sqrt3}{\sqrt3+\sqrt2}\frac c c` | 初期 | 保持 |
| `n10-17::ux04-numerator-scope` / n10-17-ux04-numerator-scope | `\text{元の分子：}\quad{numeratorBaseUX04}` | 初期 | numeratorBaseUX04 |
| `n10-17::ux04-denominator-scope` / n10-17-ux04-denominator-scope | `\text{元の分母全体：}\quad{denominatorBaseUX04}` | numeratorBaseUX04 | denominatorBaseUX04 |
| `n10-17::ux04-operation` / n10-17-ux04-assembly | `\text{上下の積を作る演算：}\quad{productOperation}` | numeratorBaseUX04, denominatorBaseUX04 | productOperation |
| `n10-17::ux04-assembled` / n10-17-ux04-main | `\frac{\sqrt3}{\sqrt3+\sqrt2}\frac c c=\frac{({mirror:numeratorBaseUX04})\times c}{({mirror:denominatorBaseUX04})\times c}` | numeratorBaseUX04, denominatorBaseUX04, productOperation | 保持 |
| `n10-17::ux04-substitution` / n10-17-ux04-main | `=\frac{\sqrt3(\sqrt3-\sqrt2)}{(\sqrt3+\sqrt2)(\sqrt3-\sqrt2)}` | numeratorBaseUX04, denominatorBaseUX04, productOperation | 保持 |

### 答え漏洩・既出値・配置

- cの同一性を確認済みとして参照し、既確定の共役因子を再選択させない。
- 分母の掛け算記号を未回答のproductOperationと同時に完成値で出さない。正答後は上下へ同じ×を用いる。
- 単独の分子積を表示し、その直後に=分数としてつなげない。本体の等号の左辺は必ず元の分数積。
- 分母の差1、分子3−√6は後続n10-18/n10-q19-distribute/n10-19の学習行為に残す。

補助計算のgroupと本体等式鎖のgroupを区別。正答後に補助足場を閉じ、本体に確定した導出を一度残す。N08基準の段階帯/本文/番号付き縦選択肢/左下resetは維持。

### 既存partの処遇

| oldId | 判断 | targetId / 保存 | 理由 |
|---|---|---|---|
| `n10-17::productOperation` | KEEP | `n10-17::productOperation` | 分数の積で上下をそれぞれ乗算にする判断・全候補・正答×は不変。元の対象を選ぶ二つの前提を新規追加する。 |

**node依存の変更案**：`{"addPrerequisiteNodeIds": [], "addRequiredResultRefs": []}`

**terminal**：元resultIdを維持し、当node全必須part正答後だけ成立させる。後続nodeで未回答の計算結果を先出ししない。

## 11. n10-q20-factor — n10-stage-11

**現状**：平方4/3は自動表示され、後の分子展開でP/Qとして再入力している。

### 穴のない完成解法

この手順では正の因子c=2−√3を使う。逆符号の因子も有理化には使えるが、今回の正性の指定とは分ける。

\[2^2=4,\quad(\sqrt3)^2=3,\quad4>3\Rightarrow2>\sqrt3\Rightarrow2-\sqrt3>0\Rightarrow c\ne0\]

非零の同じ因子を上下に掛けて値を保ち、分母を和と差の積にできる。

### 学習者への導入・前提

この手順では正の因子cを使って有理化します。因子を選んだら、平方を計算して符号を確かめ、値を保つ理由まで確認しましょう。

- 元の分母2+√3>0。2>0、√3>0。同じ原問題(2−√3)/(2+√3)内で初めて必要になる平方の値を、ここで確定する。

### 穴と全選択肢

#### n10-q20-factor::factor — KEEP

**問い**：平方差に対応する因子を選びます。

**思考操作**：平方差に対応する因子を選びます。

**根拠**：source db99の同一原問題・同一の局所操作。

**正確な穴位置**：`(2+\sqrt3)\bigl({factor}\bigr)`（`n10-q20-factor::ux04-factor`）

**先行必須**：なし

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `2-\sqrt3` | `2-\sqrt3` | 正答 | 確定した結果を次の計算へ使います。 |
| `2+\sqrt3` | `2+\sqrt3` | 誤答 | 同じ和では平方差を作れません。 |
| `\sqrt3-2` | `\sqrt3-2` | 誤答 | その因子でも分母を−1にできます。ただし、この手順では正の因子cを選ぶ指定があります。指定と因子の符号を照合してください。 |

**正答後の解放候補row**：`n10-q20-factor::ux04-square-left`, `n10-q20-factor::ux04-square-right`, `n10-q20-factor::ux04-compare`, `n10-q20-factor::ux04-difference-sign`, `n10-q20-factor::ux04-nonzero`, `n10-q20-factor::ux04-reason`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：既存の誤答説明を表示し、後続を解放しない。

**KEEP理由**：この手順で正の因子cを選ぶ元の対象/候補/正答は維持。逆符号による有効別解の説明も保持。

#### n10-q20-factor::comparisonIntegerSquareUX04 — NEW

**問い**：2と√3を比べる準備として、2²を計算します。

**思考操作**：候補の非零性を判定するため、比較の一方の平方を初回計算する。

**根拠**：正の数の大小は平方の大小と対応する。

**正確な穴位置**：`2^2={comparisonIntegerSquareUX04}`（`n10-q20-factor::ux04-square-left`）

**先行必須**：`factor`

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `4` | `4` | 正答 | この操作を確定し、次の計算へ進みます。 |
| `2` | `2` | 誤答 | 2を同じ数と二回掛けた値を求めます。元の2をそのまま写しません。 |
| `8` | `8` | 誤答 | 2乗と3乗を区別してください。 |

**正答後の解放候補row**：`n10-q20-factor::ux04-square-right`, `n10-q20-factor::ux04-compare`, `n10-q20-factor::ux04-difference-sign`, `n10-q20-factor::ux04-nonzero`, `n10-q20-factor::ux04-reason`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：現在の穴・選択値・誤答説明を保持し、後続を解放しない。

#### n10-q20-factor::comparisonRootSquareUX04 — NEW

**問い**：比較のもう一方として、(√3)²を計算します。

**思考操作**：正の平方根の定義を使い、比較のもう一方の平方を初回計算する。

**根拠**：正の平方根の定義。

**正確な穴位置**：`(\sqrt3)^2={comparisonRootSquareUX04}`（`n10-q20-factor::ux04-square-right`）

**先行必須**：`factor`, `comparisonIntegerSquareUX04`

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `3` | `3` | 正答 | この操作を確定し、次の計算へ進みます。 |
| `9` | `9` | 誤答 | 根号全体を平方します。中の3をさらに平方する操作ではありません。 |
| `\sqrt3` | `\sqrt3` | 誤答 | 平方の操作を行っていない値になっています。 |

**正答後の解放候補row**：`n10-q20-factor::ux04-compare`, `n10-q20-factor::ux04-difference-sign`, `n10-q20-factor::ux04-nonzero`, `n10-q20-factor::ux04-reason`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：現在の穴・選択値・誤答説明を保持し、後続を解放しない。

#### n10-q20-factor::factorSign — KEEP

**問い**：正の数の平方比較を使い、差と0を比べます。

**思考操作**：正の数の平方比較を使い、差と0を比べます。

**根拠**：source db99の同一原問題・同一の局所操作。

**正確な穴位置**：`2-\sqrt3{factorSign}0`（`n10-q20-factor::ux04-difference-sign`）

**先行必須**：`factor`, `comparisonIntegerSquareUX04`, `comparisonRootSquareUX04`

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `>` | `>` | 正答 | この判断を確定し、次へ進みます。 |
| `<` | `<` | 誤答 | 2と√3の平方の大小を、元の正の数の大小へ戻してください。 |
| `=` | `=` | 誤答 | 4と3は一致していません。 |

**正答後の解放候補row**：`n10-q20-factor::ux04-nonzero`, `n10-q20-factor::ux04-reason`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：既存の誤答説明を表示し、後続を解放しない。

**KEEP理由**：正の数の平方比較から2−√3と0の関係を判定する対象/候補/正答は維持。計算前提の4/3を新たに本人が確定する。

#### n10-q20-factor::reason — KEEP

**問い**：選んだ因子で、式の値を保ったまま有理化できる理由を選びます。

**思考操作**：非零・同一因子を上下へ掛ける操作・分母の有理化を一組として判断する

**根拠**：source db99の同一原問題・同一の局所操作。

**正確な穴位置**：`この因子で値を保って有理化できるのは、{reason}。`（`n10-q20-factor::ux04-reason`）

**先行必須**：`factor`, `comparisonIntegerSquareUX04`, `comparisonRootSquareUX04`, `factorSign`

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `nonzero-and-rational-product` | `非零の因子で上下を同じように変え、分母の積を有理数にできるから` | 正答 | 因子が零でないことと、分母の積が有理数になることを合わせて確認できました。 |
| `same-factor-even-zero` | `上下へ同じ因子を掛けさえすれば、その因子が零でも値を保てるから` | 誤答 | 因子を上下へ掛けた式を比として見たとき、因子が零だと分母がどうなるか確かめてください。 |
| `different-factors` | `分母の積が有理数なら、分子に掛ける因子は別の数でもよいから` | 誤答 | 分母だけが有理数になっても、元の分数と同じ値になるとは限りません。上下へ掛けた比が何になるかを確かめてください。 |

**正答後の解放候補row**：
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：既存の誤答説明を表示し、後続を解放しない。

**KEEP理由**：非零・上下同一因子・分母の有理化を関連づける既存の理由判断は維持。

### 表示・解放の正確な順序

| row ID / 用途 | template | 全gate正答で解放 | 当該行の全穴正答で消す足場 |
|---|---|---|---|
| `n10-q20-factor::ux04-factor` / n10-q20-factor-ux04-main | `(2+\sqrt3)\bigl({factor}\bigr)` | 初期 | 保持 |
| `n10-q20-factor::ux04-square-left` / n10-q20-factor-ux04-comparison | `2^2={comparisonIntegerSquareUX04}` | factor | 保持 |
| `n10-q20-factor::ux04-square-right` / n10-q20-factor-ux04-comparison | `(\sqrt3)^2={comparisonRootSquareUX04}` | factor, comparisonIntegerSquareUX04 | 保持 |
| `n10-q20-factor::ux04-compare` / n10-q20-factor-ux04-comparison | `2^2={mirror:comparisonIntegerSquareUX04}>{mirror:comparisonRootSquareUX04}=(\sqrt3)^2` | factor, comparisonIntegerSquareUX04, comparisonRootSquareUX04 | 保持 |
| `n10-q20-factor::ux04-difference-sign` / n10-q20-factor-ux04-factor-sign | `2-\sqrt3{factorSign}0` | factor, comparisonIntegerSquareUX04, comparisonRootSquareUX04 | 保持 |
| `n10-q20-factor::ux04-nonzero` / n10-q20-factor-ux04-factor-sign | `c\ne0` | factor, comparisonIntegerSquareUX04, comparisonRootSquareUX04, factorSign | 保持 |
| `n10-q20-factor::ux04-reason` / n10-q20-factor-ux04-main | `この因子で値を保って有理化できるのは、{reason}。` | factor, comparisonIntegerSquareUX04, comparisonRootSquareUX04, factorSign | 保持 |

### 答え漏洩・既出値・配置

- 平方4/3を当該part回答前にlead/assumptions/完成比較式へ出さない。
- 旧q21 P/Qは後段の別の前提/判断位置で回答したrecordであり、新しい初回比較の平方へ無条件aliasしない。両新partは未回答。
- この二つの確定平方は後の同じ原問題の分子展開で参照し、再び数値を穴にしない。
- 逆符号√3−2も分母を−1へ有理化できる。正のcというこの手順の指定と数学的可能性を区別した既存feedbackを保持。

補助計算のgroupと本体等式鎖のgroupを区別。正答後に補助足場を閉じ、本体に確定した導出を一度残す。N08基準の段階帯/本文/番号付き縦選択肢/左下resetは維持。

### 既存partの処遇

| oldId | 判断 | targetId / 保存 | 理由 |
|---|---|---|---|
| `n10-q20-factor::factor` | KEEP | `n10-q20-factor::factor` | この手順で正の因子cを選ぶ元の対象/候補/正答は維持。逆符号による有効別解の説明も保持。 |
| `n10-q20-factor::factorSign` | KEEP | `n10-q20-factor::factorSign` | 正の数の平方比較から2−√3と0の関係を判定する対象/候補/正答は維持。計算前提の4/3を新たに本人が確定する。 |
| `n10-q20-factor::reason` | KEEP | `n10-q20-factor::reason` | 非零・上下同一因子・分母の有理化を関連づける既存の理由判断は維持。 |

**node依存の変更案**：`{"addPrerequisiteNodeIds": [], "addRequiredResultRefs": []}`

**terminal**：元resultIdを維持し、当node全必須part正答後だけ成立させる。後続nodeで未回答の計算結果を先出ししない。

## 12. n10-q21-expand — n10-stage-12

**現状**：公式への対応と符号を全て与え、既出の平方4/3と公式由来の係数4を埋める。

### 穴のない完成解法

同じ原問題の前段で確定した2²=4、(√3)²=3を参照する。再入力しない。

\[(2-\sqrt3)^2=(2-\sqrt3)(2-\sqrt3)=2\times2+2(-\sqrt3)+(-\sqrt3)2+(-\sqrt3)(-\sqrt3)=4-2\sqrt3-2\sqrt3+3=4-4\sqrt3+3\]

### 学習者への導入・前提

分子の同じ差を二回掛け、符号込みの二項から四つの積を作ります。前段で求めた平方は使い、交差する二つの項を自分でまとめましょう。

- 前段の同じ原問題で2²=4、(√3)²=3を本人が確定済み。
- 第6段階で符号込みの分配を実行済み。完成公式を当てる問いには戻さない。

### 穴と全選択肢

#### n10-q21-expand::signedSecondUX04 — NEW

**問い**：2−√3を二項の和として読むと、第二項は何ですか。

**思考操作**：差の第二項を負号と根号のscope込みで取り出す。

**根拠**：差を負の数の和として読む。

**正確な穴位置**：`2-\sqrt3=2+({signedSecondUX04})`（`n10-q21-expand::ux04-signed-second`）

**先行必須**：なし

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `-\sqrt3` | `-\sqrt3` | 正答 | この操作を確定し、次の計算へ進みます。 |
| `\sqrt3` | `\sqrt3` | 誤答 | 差の第二項の負号を含めてください。 |
| `-3` | `-3` | 誤答 | 第二項は3ではなく√3です。根号を保ちます。 |

**正答後の解放候補row**：`n10-q21-expand::ux04-cross-construction`, `n10-q21-expand::ux04-four-products`, `n10-q21-expand::ux04-single-cross`, `n10-q21-expand::ux04-last-sign`, `n10-q21-expand::ux04-cross-sum`, `n10-q21-expand::ux04-signed-products`, `n10-q21-expand::ux04-combined`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：現在の穴・選択値・誤答説明を保持し、後続を解放しない。

#### n10-q21-expand::firstCrossProductUX04 — NEW

**問い**：前の括弧の第一項と、後ろの括弧の第二項からできる交差積を選びます。

**思考操作**：二つの括弧の異なる位置の項を対応づけ、符号込みの因子二つから一方の交差積を構成する。

**根拠**：既習の分配法則。完成公式ではなく、二つの括弧の項の組合せを用いる。

**正確な穴位置**：`(2-\sqrt3)^2=2\times2+{firstCrossProductUX04}+{secondCrossProductUX04}+(-\sqrt3)(-\sqrt3)`（`n10-q21-expand::ux04-cross-construction`）

**先行必須**：`signedSecondUX04`

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `2(-\sqrt3)` | `2(-\sqrt3)` | 正答 | この操作を確定し、次の計算へ進みます。 |
| `2\times2` | `2\times2` | 誤答 | それは第一項どうしの積です。指定した第一項と第二項の交差する組を見てください。 |
| `(-\sqrt3)(-\sqrt3)` | `(-\sqrt3)(-\sqrt3)` | 誤答 | それは第二項どうしの積です。交差する位置の二項を組にします。 |

**正答後の解放候補row**：`n10-q21-expand::ux04-four-products`, `n10-q21-expand::ux04-single-cross`, `n10-q21-expand::ux04-last-sign`, `n10-q21-expand::ux04-cross-sum`, `n10-q21-expand::ux04-signed-products`, `n10-q21-expand::ux04-combined`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：現在の穴・選択値・誤答説明を保持し、後続を解放しない。

#### n10-q21-expand::secondCrossProductUX04 — NEW

**問い**：前の括弧の第二項と、後ろの括弧の第一項からできる、もう一方の交差積を選びます。

**思考操作**：もう一方の交差する因子の組を構成し、片方の交差積を落とさない。

**根拠**：既習の分配法則。前後の括弧の項を符号込みで対応づける。

**正確な穴位置**：`(2-\sqrt3)^2=2\times2+{firstCrossProductUX04}+{secondCrossProductUX04}+(-\sqrt3)(-\sqrt3)`（`n10-q21-expand::ux04-cross-construction`）

**先行必須**：`signedSecondUX04`, `firstCrossProductUX04`

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `(-\sqrt3)2` | `(-\sqrt3)2` | 正答 | この操作を確定し、次の計算へ進みます。 |
| `\sqrt3\times2` | `\sqrt3\times2` | 誤答 | 元の第二項の負号が落ちています。符号込みの項を因子にしてください。 |
| `(-\sqrt3)(-\sqrt3)` | `(-\sqrt3)(-\sqrt3)` | 誤答 | それは最後の平方になる積です。指定した交差する組と区別してください。 |

**正答後の解放候補row**：`n10-q21-expand::ux04-four-products`, `n10-q21-expand::ux04-single-cross`, `n10-q21-expand::ux04-last-sign`, `n10-q21-expand::ux04-cross-sum`, `n10-q21-expand::ux04-signed-products`, `n10-q21-expand::ux04-combined`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：現在の穴・選択値・誤答説明を保持し、後続を解放しない。

#### n10-q21-expand::singleCrossCoefficientUX04 — NEW

**問い**：交差する積2×(−√3)を、√3の符号付き係数で表します。

**思考操作**：正負の乗法と係数2を一つの交差項へ反映する。

**根拠**：2は正、−√3は負。

**正確な穴位置**：`2(-\sqrt3)={singleCrossCoefficientUX04}\sqrt3`（`n10-q21-expand::ux04-single-cross`）

**先行必須**：`signedSecondUX04`, `firstCrossProductUX04`, `secondCrossProductUX04`

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `-2` | `-2` | 正答 | この操作を確定し、次の計算へ進みます。 |
| `2` | `2` | 誤答 | 負の第二項を掛けた符号が落ちています。 |
| `-1` | `-1` | 誤答 | 符号だけでなく、元の係数2も保ってください。 |

**正答後の解放候補row**：`n10-q21-expand::ux04-last-sign`, `n10-q21-expand::ux04-cross-sum`, `n10-q21-expand::ux04-signed-products`, `n10-q21-expand::ux04-combined`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：現在の穴・選択値・誤答説明を保持し、後続を解放しない。

#### n10-q21-expand::lastProductSignUX04 — NEW

**問い**：最後の積(−√3)×(−√3)を、(√3)²の符号付きの形にします。

**思考操作**：二つの負号から、最後の平方項の符号を構成する。

**根拠**：負×負は正。

**正確な穴位置**：`(-\sqrt3)(-\sqrt3)={lastProductSignUX04}(\sqrt3)^2`（`n10-q21-expand::ux04-last-sign`）

**先行必須**：`signedSecondUX04`, `firstCrossProductUX04`, `secondCrossProductUX04`, `singleCrossCoefficientUX04`

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `+` | `+` | 正答 | この操作を確定し、次の計算へ進みます。 |
| `-` | `-` | 誤答 | 二つとも負の因子です。一方だけが負の場合と区別してください。 |

**正答後の解放候補row**：`n10-q21-expand::ux04-cross-sum`, `n10-q21-expand::ux04-signed-products`, `n10-q21-expand::ux04-combined`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：現在の穴・選択値・誤答説明を保持し、後続を解放しない。

#### n10-q21-expand::signedCrossSumUX04 — NEW

**問い**：二つの交差項を合わせた、√3の符号付き係数を計算します。

**思考操作**：同類の二項−2√3と−2√3の係数を加え、中項−4√3を作る。

**根拠**：−2+(−2)=−4。

**正確な穴位置**：`({mirror:singleCrossCoefficientUX04})\sqrt3+({mirror:singleCrossCoefficientUX04})\sqrt3={signedCrossSumUX04}\sqrt3`（`n10-q21-expand::ux04-cross-sum`）

**先行必須**：`signedSecondUX04`, `firstCrossProductUX04`, `secondCrossProductUX04`, `singleCrossCoefficientUX04`, `lastProductSignUX04`

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `-4` | `-4` | 正答 | この操作を確定し、次の計算へ進みます。 |
| `4` | `4` | 誤答 | 二つの交差項はどちらも負です。大きさだけでなく符号を保ちます。 |
| `-2` | `-2` | 誤答 | 同じ交差項が二つあります。一方を落とさず係数を合わせてください。 |

**正答後の解放候補row**：`n10-q21-expand::ux04-signed-products`, `n10-q21-expand::ux04-combined`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：現在の穴・選択値・誤答説明を保持し、後続を解放しない。

### 表示・解放の正確な順序

| row ID / 用途 | template | 全gate正答で解放 | 当該行の全穴正答で消す足場 |
|---|---|---|---|
| `n10-q21-expand::ux04-repeat` / n10-q21-expand-ux04-main | `(2-\sqrt3)^2=(2-\sqrt3)(2-\sqrt3)` | 初期 | 保持 |
| `n10-q21-expand::ux04-signed-second` / n10-q21-expand-ux04-operand | `2-\sqrt3=2+({signedSecondUX04})` | 初期 | signedSecondUX04 |
| `n10-q21-expand::ux04-cross-construction` / n10-q21-expand-ux04-main | `(2-\sqrt3)^2=2\times2+{firstCrossProductUX04}+{secondCrossProductUX04}+(-\sqrt3)(-\sqrt3)` | signedSecondUX04 | firstCrossProductUX04, secondCrossProductUX04 |
| `n10-q21-expand::ux04-four-products` / n10-q21-expand-ux04-main | `(2-\sqrt3)^2=2\times2+{mirror:firstCrossProductUX04}+{mirror:secondCrossProductUX04}+(-\sqrt3)(-\sqrt3)` | signedSecondUX04, firstCrossProductUX04, secondCrossProductUX04 | 保持 |
| `n10-q21-expand::ux04-single-cross` / n10-q21-expand-ux04-single-cross | `2(-\sqrt3)={singleCrossCoefficientUX04}\sqrt3` | signedSecondUX04, firstCrossProductUX04, secondCrossProductUX04 | singleCrossCoefficientUX04 |
| `n10-q21-expand::ux04-last-sign` / n10-q21-expand-ux04-last-sign | `(-\sqrt3)(-\sqrt3)={lastProductSignUX04}(\sqrt3)^2` | signedSecondUX04, firstCrossProductUX04, secondCrossProductUX04, singleCrossCoefficientUX04 | lastProductSignUX04 |
| `n10-q21-expand::ux04-cross-sum` / n10-q21-expand-ux04-cross-sum | `({mirror:singleCrossCoefficientUX04})\sqrt3+({mirror:singleCrossCoefficientUX04})\sqrt3={signedCrossSumUX04}\sqrt3` | signedSecondUX04, firstCrossProductUX04, secondCrossProductUX04, singleCrossCoefficientUX04, lastProductSignUX04 | signedCrossSumUX04 |
| `n10-q21-expand::ux04-signed-products` / n10-q21-expand-ux04-main | `(2-\sqrt3)^2=4-2\sqrt3-2\sqrt3+3` | signedSecondUX04, firstCrossProductUX04, secondCrossProductUX04, singleCrossCoefficientUX04, lastProductSignUX04, signedCrossSumUX04 | 保持 |
| `n10-q21-expand::ux04-combined` / n10-q21-expand-ux04-main | `=4-4\sqrt3+3` | signedSecondUX04, firstCrossProductUX04, secondCrossProductUX04, singleCrossCoefficientUX04, lastProductSignUX04, signedCrossSumUX04 | 保持 |

### 答え漏洩・既出値・配置

- 旧P/QはARCHIVE_ONLY。新q20初回平方の回答へ移動/aliasしない。
- 旧Kは公式の2×Aの係数計算。新signedCrossSumは−2+(−2)という符号付き同類項の合成なので、新key/idを使い旧4を流用しない。
- 前段の4/3はq20の新平方partが確定した記録だけを根拠に参照する。旧r4 AUTOや旧P/Qの回答を、その確定証拠にしない。
- 第二の交差項(−√3)×2は乗法の交換で第一の交差項と同じと示す。同じ−2を二回回答させない。
- −4√3と+3を、signedCrossSum/lastProductSignの回答前に完成式や候補外の文章で先書きしない。
- 有理数4と3の和7は次node n10-q21-constantsの既存Cへ残す。
- signedSecondの一穴後に四つの積を全自動で完成させない。交差する二組の因子をNEWで構成してから、符号計算と同類項の合成へ進む。
- 正しい可換順の積を誤答候補には入れない。候補中の別の正しい展開項は、数学的誤りではなく指定した位置の組に合わないと説明する。
- 補助計算後に本体へ戻る行には元式を完全な左辺として明示。直前の補助量へ=で分数/別の式をつなげない。

補助計算のgroupと本体等式鎖のgroupを区別。正答後に補助足場を閉じ、本体に確定した導出を一度残す。N08基準の段階帯/本文/番号付き縦選択肢/左下resetは維持。

**既出値の参照（再回答しない）**：

- n10-q20-factor::comparisonIntegerSquareUX04 → `4`。元part/元resultが確定している場合のみ表示。
- n10-q20-factor::comparisonRootSquareUX04 → `3`。元part/元resultが確定している場合のみ表示。

### 既存partの処遇

| oldId | 判断 | targetId / 保存 | 理由 |
|---|---|---|---|
| `n10-q21-expand::P` | RETIRE | r4 archiveのみ、新partへaliasなし | 問いの対象/要求する操作/判断位置を変更するため、新partへ旧recordを流用しない。 |
| `n10-q21-expand::K` | RETIRE | r4 archiveのみ、新partへaliasなし | 問いの対象/要求する操作/判断位置を変更するため、新partへ旧recordを流用しない。 |
| `n10-q21-expand::Q` | RETIRE | r4 archiveのみ、新partへaliasなし | 問いの対象/要求する操作/判断位置を変更するため、新partへ旧recordを流用しない。 |

**node依存の変更案**：`{"addPrerequisiteNodeIds": ["n10-q20-factor"], "addRequiredResultRefs": ["n10-q20-factor-result"], "rationale": "新しい初回平方の確定証拠を明示的に参照する。既存経路でも先行するnodeであり順序を逆転させない。未確定の旧AUTOは参照証拠にしない。"}`

**terminal**：元resultIdを維持し、当node全必須part正答後だけ成立させる。後続nodeで未回答の計算結果を先出ししない。

## 13. n10-q21-constants — n10-stage-12

**現状**：項の選別と組直しは自動で、最後の和7だけを回答。

### 穴のない完成解法

\[4-4\sqrt3+3=(4+3)-4\sqrt3=7-4\sqrt3\]

### 学習者への導入・前提

三つの項を符号込みで見ます。先にまとめる二項を選び、その和を計算しましょう。

- 前nodeで4−4√3+3を本人の交差項の合成から確定。加法の交換・結合を使ってよい。

### 穴と全選択肢

#### n10-q21-constants::rootFreePairUX04 — NEW

**問い**：先にまとめる、根号を含まない二項を選びます。

**思考操作**：符号付きの三項から4と+3を選び、−4√3を保ったまま組み直す。

**根拠**：前nodeの4−4√3+3、加法の交換・結合。

**正確な穴位置**：`\text{先にまとめる二項：}\quad{rootFreePairUX04}`（`n10-q21-constants::ux04-pair`）

**先行必須**：なし

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `4,3` | `4,3` | 正答 | この操作を確定し、次の計算へ進みます。 |
| `4,-4\sqrt3` | `4,-4\sqrt3` | 誤答 | その組には根号を含む項があります。根号を含まない二項を選ぶ指定です。 |
| `-4\sqrt3,3` | `-4\sqrt3,3` | 誤答 | −4√3は残す項です。根号を含まない二項の組を選びます。 |

**正答後の解放候補row**：`n10-q21-constants::ux04-regroup`, `n10-q21-constants::ux04-sum`
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：現在の穴・選択値・誤答説明を保持し、後続を解放しない。

#### n10-q21-constants::C — KEEP

**問い**：普通の数4+3を計算します。

**思考操作**：指定した演算の結果を計算する

**根拠**：source db99の同一原問題・同一の局所操作。

**正確な穴位置**：`={C}-4\sqrt3`（`n10-q21-constants::ux04-sum`）

**先行必須**：`rootFreePairUX04`

| 候補value | 表示/LaTeX | 正誤 | 回答時の説明 |
|---|---|---|---|
| `7` | `7` | 正答 | 確定した結果を次の計算へ使います。 |
| `1` | `1` | 誤答 | 普通の数は4と+3です。 |
| `12` | `12` | 誤答 | 足し算を掛け算にしません。 |

**正答後の解放候補row**：
**解放条件**：下のrow一覧はこのkeyを前提に含む候補。各rowの全requiresCorrectKeysがordered-correctのときだけ解放し、このkeyの正答だけで全descendantを即時表示しない。
**誤答時**：既存の誤答説明を表示し、後続を解放しない。

**KEEP理由**：4と+3の和を計算する対象・演算・候補・正答7は不変。前段で平方4/3を求めても、和7まではまだ確定していない。

### 表示・解放の正確な順序

| row ID / 用途 | template | 全gate正答で解放 | 当該行の全穴正答で消す足場 |
|---|---|---|---|
| `n10-q21-constants::ux04-source` / n10-q21-constants-ux04-main | `4-4\sqrt3+3` | 初期 | 保持 |
| `n10-q21-constants::ux04-pair` / n10-q21-constants-ux04-term-selection | `\text{先にまとめる二項：}\quad{rootFreePairUX04}` | 初期 | rootFreePairUX04 |
| `n10-q21-constants::ux04-regroup` / n10-q21-constants-ux04-main | `=(4+3)-4\sqrt3` | rootFreePairUX04 | 保持 |
| `n10-q21-constants::ux04-sum` / n10-q21-constants-ux04-main | `={C}-4\sqrt3` | rootFreePairUX04 | 保持 |

### 答え漏洩・既出値・配置

- leadに「4と3を加える」を先書きしない。
- −4√3の負号を保つ。「定数項」ではなく「根号を含まない二項」と指定。
- 元の分数へ戻す最後のn10-21は、確定した分子と分母を接続するAUTOとして維持。

補助計算のgroupと本体等式鎖のgroupを区別。正答後に補助足場を閉じ、本体に確定した導出を一度残す。N08基準の段階帯/本文/番号付き縦選択肢/左下resetは維持。

### 既存partの処遇

| oldId | 判断 | targetId / 保存 | 理由 |
|---|---|---|---|
| `n10-q21-constants::C` | KEEP | `n10-q21-constants::C` | 4と+3の和を計算する対象・演算・候補・正答7は不変。前段で平方4/3を求めても、和7まではまだ確定していない。 |

**node依存の変更案**：`{"addPrerequisiteNodeIds": [], "addRequiredResultRefs": []}`

**terminal**：元resultIdを維持し、当node全必須part正答後だけ成立させる。後続nodeで未回答の計算結果を先出ししない。

## 対象外32nodeの保持表

| node | 保持する既存part |
|---|---|
| `n10-q02-sign` | `n10-q02-sign::value` |
| `n10-02` | `n10-02::candidateSign`, `n10-02::squareValue`, `n10-02::identificationReason` |
| `n10-q03-expand` | `n10-q03-expand::powerA`, `n10-q03-expand::powerB` |
| `n10-03` | `n10-03::aValue`, `n10-03::bValue` |
| `n10-q04-sign` | `n10-q04-sign::relation` |
| `n10-04` | `n10-04::rootReason` |
| `n10-q05-denominator` | `n10-q05-denominator::relation` |
| `n10-q05-square` | `n10-q05-square::numPower`, `n10-q05-square::denPower` |
| `n10-05` | `n10-05::numerator`, `n10-05::denominator` |
| `n10-q06-sign` | `n10-q06-sign::relation` |
| `n10-06` | `n10-06::quotientReason` |
| `n10-q07-product` | `n10-q07-product::insideOperation`, `n10-q07-product::inside` |
| `n10-07` | `n10-07::squareFactor`, `n10-07::factor` |
| `n10-q08-factor` | `n10-q08-factor::coefficient` |
| `n10-08` | AUTOの確定結果接続を保持 |
| `n10-09` | AUTOの確定結果接続を保持 |
| `n10-10` | AUTOの確定結果接続を保持 |
| `n10-11` | `n10-11::leftSquare`, `n10-11::rightSquare` |
| `n10-q12-product` | `n10-q12-product::inside` |
| `n10-13` | `n10-13::left`, `n10-13::right`, `n10-13::difference` |
| `n10-14` | `n10-14::operation` |
| `n10-q15-factor` | `n10-q15-factor::factor` |
| `n10-q16-denominator` | `n10-q16-denominator::square`, `n10-q16-denominator::denominator` |
| `n10-16` | AUTOの確定結果接続を保持 |
| `n10-q17-factor` | `n10-q17-factor::factor` |
| `n10-q17-nonzero` | `n10-q17-nonzero::relation` |
| `n10-18` | `n10-18::A`, `n10-18::B`, `n10-18::C` |
| `n10-q19-distribute` | `n10-q19-distribute::secondOperand`, `n10-q19-distribute::productSign` |
| `n10-19` | `n10-19::left`, `n10-19::inside` |
| `n10-20` | `n10-20::power`, `n10-20::denominatorOperation` |
| `n10-q21-denominator` | `n10-q21-denominator::D` |
| `n10-21` | AUTOの確定結果接続を保持 |

## 全63旧partの移行判断

| oldId | 判断 | targetId / 処遇 |
|---|---|---|
| `n10-q01-square::rootSquare` | KEEP | `n10-q01-square::rootSquare` |
| `n10-01::value` | KEEP | `n10-01::value` |
| `n10-q09-left::squareFactor` | KEEP | `n10-q09-left::squareFactor` |
| `n10-q09-left::coefficient` | KEEP | `n10-q09-left::coefficient` |
| `n10-q09-right::squareFactor` | KEEP | `n10-q09-right::squareFactor` |
| `n10-q09-right::coefficient` | KEEP | `n10-q09-right::coefficient` |
| `n10-q10-coefficients::coefficient` | KEEP | `n10-q10-coefficients::coefficient` |
| `n10-q11-formula::middleSign` | RETIRE | ARCHIVE_ONLY・新key未回答 |
| `n10-12::constant` | KEEP | `n10-12::constant` |
| `n10-q13-identity::operation` | RETIRE | ARCHIVE_ONLY・新key未回答 |
| `n10-15::numerator` | KEEP | `n10-15::numerator` |
| `n10-17::productOperation` | KEEP | `n10-17::productOperation` |
| `n10-q20-factor::factor` | KEEP | `n10-q20-factor::factor` |
| `n10-q20-factor::factorSign` | KEEP | `n10-q20-factor::factorSign` |
| `n10-q20-factor::reason` | KEEP | `n10-q20-factor::reason` |
| `n10-q21-expand::P` | RETIRE | ARCHIVE_ONLY・新key未回答 |
| `n10-q21-expand::K` | RETIRE | ARCHIVE_ONLY・新key未回答 |
| `n10-q21-expand::Q` | RETIRE | ARCHIVE_ONLY・新key未回答 |
| `n10-q21-constants::C` | KEEP | `n10-q21-constants::C` |
| `n10-q02-sign::value` | KEEP | `n10-q02-sign::value` |
| `n10-02::candidateSign` | KEEP | `n10-02::candidateSign` |
| `n10-02::squareValue` | KEEP | `n10-02::squareValue` |
| `n10-02::identificationReason` | KEEP | `n10-02::identificationReason` |
| `n10-q03-expand::powerA` | KEEP | `n10-q03-expand::powerA` |
| `n10-q03-expand::powerB` | KEEP | `n10-q03-expand::powerB` |
| `n10-03::aValue` | KEEP | `n10-03::aValue` |
| `n10-03::bValue` | KEEP | `n10-03::bValue` |
| `n10-q04-sign::relation` | KEEP | `n10-q04-sign::relation` |
| `n10-04::rootReason` | KEEP | `n10-04::rootReason` |
| `n10-q05-denominator::relation` | KEEP | `n10-q05-denominator::relation` |
| `n10-q05-square::numPower` | KEEP | `n10-q05-square::numPower` |
| `n10-q05-square::denPower` | KEEP | `n10-q05-square::denPower` |
| `n10-05::numerator` | KEEP | `n10-05::numerator` |
| `n10-05::denominator` | KEEP | `n10-05::denominator` |
| `n10-q06-sign::relation` | KEEP | `n10-q06-sign::relation` |
| `n10-06::quotientReason` | KEEP | `n10-06::quotientReason` |
| `n10-q07-product::insideOperation` | KEEP | `n10-q07-product::insideOperation` |
| `n10-q07-product::inside` | KEEP | `n10-q07-product::inside` |
| `n10-07::squareFactor` | KEEP | `n10-07::squareFactor` |
| `n10-07::factor` | KEEP | `n10-07::factor` |
| `n10-q08-factor::coefficient` | KEEP | `n10-q08-factor::coefficient` |
| `n10-11::leftSquare` | KEEP | `n10-11::leftSquare` |
| `n10-11::rightSquare` | KEEP | `n10-11::rightSquare` |
| `n10-q12-product::inside` | KEEP | `n10-q12-product::inside` |
| `n10-13::left` | KEEP | `n10-13::left` |
| `n10-13::right` | KEEP | `n10-13::right` |
| `n10-13::difference` | KEEP | `n10-13::difference` |
| `n10-14::operation` | KEEP | `n10-14::operation` |
| `n10-q15-factor::factor` | KEEP | `n10-q15-factor::factor` |
| `n10-q16-denominator::square` | KEEP | `n10-q16-denominator::square` |
| `n10-q16-denominator::denominator` | KEEP | `n10-q16-denominator::denominator` |
| `n10-q17-factor::factor` | KEEP | `n10-q17-factor::factor` |
| `n10-q17-nonzero::relation` | KEEP | `n10-q17-nonzero::relation` |
| `n10-18::A` | KEEP | `n10-18::A` |
| `n10-18::B` | KEEP | `n10-18::B` |
| `n10-18::C` | KEEP | `n10-18::C` |
| `n10-q19-distribute::secondOperand` | KEEP | `n10-q19-distribute::secondOperand` |
| `n10-q19-distribute::productSign` | KEEP | `n10-q19-distribute::productSign` |
| `n10-19::left` | KEEP | `n10-19::left` |
| `n10-19::inside` | KEEP | `n10-19::inside` |
| `n10-20::power` | KEEP | `n10-20::power` |
| `n10-20::denominatorOperation` | KEEP | `n10-20::denominatorOperation` |
| `n10-q21-denominator::D` | KEEP | `n10-q21-denominator::D` |

## 未実施・統合待ち

- 正式なPROPOSAL書式、scope/hash固定、影響調査、保存移行の根拠とQA計画は主担当が統合する。
- 本草案は自己整合の参照/一意性確認だけ。製品コード変更、正式Work/Git/Store編集、数学の新自動検証、実画像検証、公開はしていない。
- 本文・式・穴・選択肢の排版は新しい意味group/可視行/足場消去に影響するため、承認後に実測と非作者の実画像審査が必要。既存PASSを新版の合格へ読み替えない。
- 誤答の数学的同値性・正しい別解の扱い、および既存part KEEPの意味同値はcross reviewで確認する。

## 全86nodeの変更・維持対応

基準source db99のcompiledから列挙。CHANGEは上の詳細設計、KEEPは同じ問い・型・正答・全候補・学習行為を保持する。共通の版移行以外で対象外教材の意味を変えない。KEEPに含まれるまとめは、前段で実際に確定した結果に依存して表示する。

| 単元 / stage | node | 旧part | 判断・理由 |
|---|---|---|---|
| n09-stage-01 | `n09-q01-positive` | なし | KEEP：定義・境界の説明・最初の手本。後続の転移を生徒が行う。 |
| n09-stage-01 | `n09-q01-negative` | value | CHANGE：個別設計参照 |
| n09-stage-01 | `n09-01` | zeroLogic | CHANGE：個別設計参照 |
| n09-stage-02 | `n09-definition` | なし | KEEP：定義・境界の説明・最初の手本。後続の転移を生徒が行う。 |
| n09-stage-02 | `n09-q02-root` | value | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n09-stage-02 | `n09-q02-negative-square` | signFactor, value | CHANGE：個別設計参照 |
| n09-stage-02 | `n09-02` | なし | KEEP：前段の確定結果を結ぶ説明・結論。新しい未回答操作を代行しない。 |
| n09-stage-02 | `n09-boundary` | なし | KEEP：定義・境界の説明・最初の手本。後続の転移を生徒が行う。 |
| n09-stage-03 | `n09-q03-inside` | value | CHANGE：個別設計参照 |
| n09-stage-03 | `n09-03` | value | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n09-stage-04 | `n09-q04-nonnegative` | value | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n09-stage-04 | `n09-q04-negative` | oppositeSign, value | CHANGE：個別設計参照 |
| n09-stage-04 | `n09-04` | なし | KEEP：前段の確定結果を結ぶ説明・結論。新しい未回答操作を代行しない。 |
| n09-stage-04 | `n09-05` | value | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n09-stage-05 | `n09-q06-squares` | value | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n09-stage-05 | `n09-q06-order` | relation | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n09-stage-05 | `n09-06` | addend, zero | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n09-stage-05 | `n09-q07-negation` | scope | CHANGE：個別設計参照 |
| n09-stage-05 | `n09-07` | outsideFactor, secondOperand, left, sign | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n09-stage-06 | `n09-decimal-method` | なし | KEEP：小数の分数化方針・補助値の参照。続く平方の組立てを問うため、同じ補助計算を写す穴にしない。 |
| n09-stage-06 | `n09-p001-q08-left-square` | L1, L2, L3 | CHANGE：個別設計参照 |
| n09-stage-06 | `n09-p001-q08-right-square` | R1, R2, R3 | CHANGE：個別設計参照 |
| n09-stage-06 | `n09-p001-q08-lower-sign` | C | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n09-stage-06 | `n09-p001-q08-upper-sign` | D | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n09-stage-06 | `n09-08` | なし | KEEP：前段の確定結果を結ぶ説明・結論。新しい未回答操作を代行しない。 |
| n09-stage-06 | `n09-09` | lowerRelation, upperRelation | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n09-stage-07 | `n09-parts-target` | なし | CHANGE：個別設計参照 |
| n09-stage-07 | `n09-q10-reject-truncation` | value | CHANGE：個別設計参照 |
| n09-stage-07 | `n09-10` | n | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n09-stage-08 | `n09-q11-remainder` | sign, value | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n09-stage-08 | `n09-11` | なし | KEEP：前段の確定結果を結ぶ説明・結論。新しい未回答操作を代行しない。 |
| n09-stage-09 | `n09-q12-lower` | value | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n09-stage-09 | `n09-q12-upper` | value | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n09-stage-09 | `n09-12` | lower, upper | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n09-stage-10 | `n09-q13-reverse` | S1, S2 | CHANGE：個別設計参照 |
| n09-stage-10 | `n09-13` | left, right | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n09-stage-11 | `n09-q14-positive-integer` | value | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n09-stage-11 | `n09-q14-positive-remainder` | remainderOperation | CHANGE：個別設計参照 |
| n09-stage-11 | `n09-q14-negative-integer` | value | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n09-stage-11 | `n09-q14-negative-remainder` | sign | CHANGE：個別設計参照 |
| n09-stage-11 | `n09-14` | なし | KEEP：前段の確定結果を結ぶ説明・結論。新しい未回答操作を代行しない。 |
| n10-stage-01 | `n10-q01-square` | rootSquare | CHANGE：個別設計参照 |
| n10-stage-01 | `n10-01` | value | CHANGE：個別設計参照 |
| n10-stage-01 | `n10-q02-sign` | value | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n10-stage-01 | `n10-02` | candidateSign, squareValue, identificationReason | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n10-stage-02 | `n10-q03-expand` | powerA, powerB | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n10-stage-02 | `n10-03` | aValue, bValue | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n10-stage-02 | `n10-q04-sign` | relation | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n10-stage-02 | `n10-04` | rootReason | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n10-stage-03 | `n10-q05-denominator` | relation | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n10-stage-03 | `n10-q05-square` | numPower, denPower | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n10-stage-03 | `n10-05` | numerator, denominator | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n10-stage-03 | `n10-q06-sign` | relation | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n10-stage-03 | `n10-06` | quotientReason | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n10-stage-04 | `n10-q07-product` | insideOperation, inside | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n10-stage-04 | `n10-07` | squareFactor, factor | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n10-stage-04 | `n10-q08-factor` | coefficient | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n10-stage-04 | `n10-08` | なし | KEEP：前段の確定結果を結ぶ説明・結論。新しい未回答操作を代行しない。 |
| n10-stage-05 | `n10-q09-left` | squareFactor, coefficient | CHANGE：個別設計参照 |
| n10-stage-05 | `n10-q09-right` | squareFactor, coefficient | CHANGE：個別設計参照 |
| n10-stage-05 | `n10-09` | なし | KEEP：前段の確定結果を結ぶ説明・結論。新しい未回答操作を代行しない。 |
| n10-stage-05 | `n10-q10-coefficients` | coefficient | CHANGE：個別設計参照 |
| n10-stage-05 | `n10-10` | なし | KEEP：前段の確定結果を結ぶ説明・結論。新しい未回答操作を代行しない。 |
| n10-stage-06 | `n10-q11-formula` | middleSign | CHANGE：個別設計参照 |
| n10-stage-06 | `n10-11` | leftSquare, rightSquare | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n10-stage-06 | `n10-q12-product` | inside | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n10-stage-06 | `n10-12` | constant | CHANGE：個別設計参照 |
| n10-stage-07 | `n10-q13-identity` | operation | CHANGE：個別設計参照 |
| n10-stage-07 | `n10-13` | left, right, difference | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n10-stage-08 | `n10-14` | operation | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n10-stage-08 | `n10-q15-factor` | factor | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n10-stage-08 | `n10-15` | numerator | CHANGE：個別設計参照 |
| n10-stage-08 | `n10-q16-denominator` | square, denominator | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n10-stage-08 | `n10-16` | なし | KEEP：前段の確定結果を結ぶ説明・結論。新しい未回答操作を代行しない。 |
| n10-stage-09 | `n10-q17-factor` | factor | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n10-stage-09 | `n10-q17-nonzero` | relation | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n10-stage-09 | `n10-17` | productOperation | CHANGE：個別設計参照 |
| n10-stage-10 | `n10-18` | A, B, C | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n10-stage-10 | `n10-q19-distribute` | secondOperand, productSign | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n10-stage-10 | `n10-19` | left, inside | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n10-stage-11 | `n10-q20-factor` | factor, factorSign, reason | CHANGE：個別設計参照 |
| n10-stage-11 | `n10-20` | power, denominatorOperation | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n10-stage-11 | `n10-q21-denominator` | D | KEEP：独立した計算・比較・組立ての既存判断を維持。 |
| n10-stage-12 | `n10-q21-expand` | P, K, Q | CHANGE：個別設計参照 |
| n10-stage-12 | `n10-q21-constants` | C | CHANGE：個別設計参照 |
| n10-stage-12 | `n10-21` | なし | KEEP：前段の確定結果を結ぶ説明・結論。新しい未回答操作を代行しない。 |

対応数：N09 41node＝変更13＋維持28、N10 45node＝変更13＋維持32。全86＝変更26＋維持60。数は監査範囲の照合に使い、穴の多さを合格基準にしない。

## 保存・旧回答の移行

N09第5版→第6版、N10第4版→第5版を新revisionとして追加する。現行のcompiledは不変snapshot `n09ConstructionCompiledR5.json` / `n10ConstructionCompiledR4.json`として保管する。既存R4/R3 snapshotとN10 pilot R4 snapshotも保護し、同じrevision番号でもcompiledHashの異なる版を混同しない。

| 回答の種類 | 移行方針 |
|---|---|
| 同じ対象・問いの意味・型・正答・全候補・前提を維持するKEEP | 同じ学習行為として既存回答を継承。文言のみの整備も意味不変を個別照合する。 |
| 新しい変形・計算・比較、旧valueと同値でも別の判断 | 新key/part IDで未回答。数値一致だけで旧回答をaliasしない。 |
| 廃止する旧part | 原記録と履歴を旧版に保管し、現行の分母や達成数から外す。削除した回答を消去しない。 |
| q21の旧P=4/Q=3 → q20の非零証明で初めて問う平方 | 問う時点・前提が変わるためARCHIVE_ONLY。新しい平方keyは未回答。後の展開では確定値4/3を参照する。 |
| q21旧K=4 → 符号込みの交差項の和−4 | 型/意味が変わるためARCHIVE_ONLY。新signedCrossSumの未回答を維持し、4→−4の自動変換をしない。 |
| 新しい前提より後のKEEP回答が旧版で済んでいる場合 | 記録は保持するが、新しい前提の解放を飛ばさない。最初の未解決の新しい判断から再開する。 |

移行元はrevision番号だけで判定せず、unit/schema/source/compiledHashの正確なallowlistで照合する。旧native版は既存の検証済みadapterとsnapshotの段階的な鎖を介して対象版へ移す。既にlegacy N10第2版から移行された7件の保留記録も、旧第3版snapshotを介する意味対応を保持する。古い版を最新へ直接丸めない。

既存のfirstValue・回数・時刻・履歴・原回答を保存し、新しい正答イベントを作らない。main-only保存の救済、既存namespaceを維持する。旧版試し解答・read-only比較は現行の保存byteを書き換えない。リセット取消は無変更、確定は現在単元の現在版だけを対象とし、他単元・旧snapshotを巻き込まない。全リセットを移行の代わりに使わない。

## Expected Affected Areas / Patch Plan

| パス・領域 | 役割 |
|---|---|
| `work/items/W-MATH-043-n0910-restart/NODE_DESIGN.json` | source-boundな導出設計・新しい各操作を追加。原問題とsource bindingは維持。 |
| `tools/textbook/transformation/nested-lesson.mjs` / `apply-n0910-construction.mjs` | 詳細設計からの行・穴・解放契約の生成、必要なrevision登録。既存契約で足りる場合は生成基盤を変更しない。 |
| `src/data/textbook/math/numbers/`内active compiled・pins・lesson | N09第6版/N10第5版、現在版の不変snapshot、関連hashを生成。手作業でcompiledだけ変更しない。 |
| `src/domain/textbookSchema.ts`および既存migration/storage/progress | 新版識別、意味に基づくKEEP/ARCHIVE/新規、厳密なhash照合。 |
| 既存N09/N10 revision/archive route・`TextbookUnitPage` | 最新版と保管版の表示、旧版比較・保存隔離。 |
| 既存design/schema/generator/unit/migration検査、finite-math・app/layout検証器 | 今回の操作漏れ・解放漏れ・保存不整合を検出する期待値と検査を追加する。 |

実装前に上の役割から実際の変更ファイルを確定する。承認範囲外の内容変更が必要なら本案を改訂する。既存の技術PASSを無効化したり、全期待値を機械的に更新してFAILを消したりしない。

## Risks

| リスク | 防止・確認 |
|---|---|
| 穴を増やしても単なる写しになる | 完成解法の操作との一対一対応、既知結果の参照、右側の転移問題の足場を減らす理由を審査する。 |
| 一つの大きな式の選択が複数操作を隠す | 分配する各交差項と符号付き和、分子/分母の束縛を別判断として確認する。 |
| 短い符号穴が本文から漏れる | 回答前の実表示にlead/前提/候補説明も含めて確認する。 |
| 後続KEEP回答が新しい問いを飛ばす | 新前提を未解決のまま保存したケースで再開位置と段階解放を検査する。 |
| 同じ数値の旧回答を別の意味へ誤継承 | 全旧partのKEEP/ARCHIVE対応、各版hash、P/Q/Kの明示的な非継承を審査する。 |
| 連続導出が長くなり携帯で崩れる | 320/390/430/1440pxで未回答・誤答・途中・完了と履歴の配置を確認する。 |
| 技術PASSを教材の参加度PASSと誤る | CODE/描画/非作者の数学意味審査/本人確認を別々に記録する。 |

## Verification Plan / 修正ワークフロー

1. **案の審査**：本書の完成解法と全候補を数学・意味で照合し、全86nodeの変更/維持理由、各穴の独立した学習行為、先出し、旧回答対応、解放順を非作者が審査する。構造検査は提案書の整合確認であり製品テストのPASSと呼ばない。
2. **本案の明示承認**：[正本WORK_SYSTEM §11](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/6bc54447ef015a2a579a56a5966ceb58a0600d3a/governance/WORK_SYSTEM.md#L246)の「The revised proposal must be shown before implementation.」に従う。この具体案を承認対象にする。本人の「那来吧」は具体案作成の指示として記録し、未提示の新しい設計の実装承認へ転用しない。
3. **代表ブロック**：承認後、写真のN09最初の場面（負数の平方→全解の導出）を隔離候補で実装・検証する。[正本WORK_SYSTEM §12A](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/6bc54447ef015a2a579a56a5966ceb58a0600d3a/governance/WORK_SYSTEM.md#L270)に従い、実SHA・実画像をGitHub確認票へ固定し本人の細部OK/要修正を受ける。確認前に未確認の設計を残りへ一括量産しない。
4. **限定適用とCODE検査**：確認済みの方式で残りの承認対象へ進む。生成一致、ID/part参照、依存循環、唯一正答、型/回答形式、mirror、hide、KaTeX、数学、関連単元・移行回帰、型/lint/buildを検査する。複数操作を一回答で飛ばす欠陥を検出する検査を追加する。有限数学のunsupportedは意味審査へ渡し、無条件PASSにしない。
5. **移行・保存**：現行全回答/一部回答/main-only、保管native各版、legacy第2版由来、同revision別hash、旧版比較、reset取消/確定、後続KEEP済み＋新前提未回答を検査する。問う意味が変わったpartに旧回答が入らないこと、旧回答数/時刻/履歴が保持されることを確認する。
6. **実画面と非作者審査**：四幅で新partの全正答/全誤答候補、行の解放・足場消去・完了・reload・履歴・旧版・resetを操作する。特に回答前後の連続導出と学習操作の網羅を目視する。N08の共通画面基準、番号枠、選択肢位置、式番号、根号/分数/括弧を比較する。小ブロックの画像確認と横断監査を正本の手順で記録する。
7. **G2横断監査**：N09全41/N10全45node、保持N08各版/N11、共有部分への影響を実差分に応じて検査し、PASS/FAIL/UNVERIFIEDを対象SHAとともに分ける。既存有効試験を継承し、変更や未解決理由なく同じ検査を繰り返さない。
8. **公開・本人総チェック**：候補hashとmanifestを固定してから、公開用の具体的差分を別の公開ゲートへ渡す。本案にmain反映・公開の承認は含めない。認可された実働URLで配信byte/操作を照合後、本人が合意範囲を実際に確認する。小ブロックOK・CI・公開成功を本人総合受入、Gold、fitへ読み替えない。

正式Storeの欠落26イベントについては、W046継続に対する本人の一回限りの特例を維持する。古い台帳へ戻って停止したり、receiptやイベントを創作したりしない。全体governanceの他Work既存38件は保持し、本Work追加0と区別する。他Workの承認を補完して全体PASSとはしない。

## Approval

Status: WAITING
Approved by user: NO
Approval evidence: 未受領。今回の「那来吧」は詳細修正案の作成指示。
Approval scope: 本書の限定設計の実装・候補検証。代表ブロックの実画像確認、横断監査、別の公開承認、実働アプリでの本人総チェックは既存手順のまま。

## Review History

- UX03：承認・実装・公開の履歴を上記固定commitで保持。本人は排版改善を評価し、導出参加度は要修正とした。
- UX04：原因→同型監査→正本基準照合→完成解法・各操作・移行の詳細案。単元別著者と相互非作者審査を分け、審査記録は `evidence/ux04-proposal/REVIEW.md` に保存する。
- Supersedes: UX03の今後の修正方針。既承認版の履歴・技術PASS・旧回答を取り消さない。
- User acceptance / Gold / fit: 未成立。

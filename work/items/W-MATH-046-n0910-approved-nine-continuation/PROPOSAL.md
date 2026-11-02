# W046 修正提案 — P-W046-UX-03

Status: APPROVED
Implementation: H01-H17 IMPLEMENTED / FULL REVIEW PASS / PUBLICATION AND HOSTED VERIFICATION PASS / USER FINAL CHECK PENDING
Created: 2026-11-02  
Supersedes: P-W046-UX-02（問題一覧と方針までの未完成案。旧本文・レビュー履歴はWORK.mdへ保存）

## Problem / Need — 何を直すか

本人のG3_FINAL評価は「要修正」。N09/N10は、N08で使っていた排版・選択肢・リセット操作から逸脱した。途中計算を自動表示して終える箇所があり、学習者が判断する穴が不足する。通常導出の直後に同じ式・条件・説明を再掲し、別nodeの中央配置も同じ導出の整列を壊している。

排版の修正は、等号の位置だけでなく、本文と数式の順序、まとまり、行間・段落間、見出し階層、選択肢と操作位置を含む。穴の数自体を目標にしない。本人が肯定した、平方根の積・商を完成公式の選択にせず、平方・符号・非零条件から構成する方法を保つ。

### 基準と出所

- 対象repo: `rrikunagasige-dot/kyotsu-step-web`、ID `1391122224`。確認したmain HEAD: `e49486d13119058ff063e75ef84d60660210bd41`。
- 修正元アプリ: `94dfd300098484473211c22f5de73139b9002717`。mainのpublisher SHAとは区別する。
- N09現行r4・N10現行r3のcompiled/nodeDesignと実装を修正元とする。今回、原Wordを新たに読んだとは扱わない。元問題・数値・条件・収録範囲・図を変更しない。
- 見た目の基準: 同じsourceのN08 r7 reader/CSSと、公開run41332741779のN08原画像。既存N08を変更する指示ではない。
- 原症状: 本人添付image(5).pngの `n10-q02-sign → n10-02`。`t=5`と`√125=5√5`の直後重複など。
- 手順・書式: `governance/INSTRUCTION_DICTIONARY.md` CMD-WORK-001、`governance/WORK_SYSTEM.md` §§7/11/12A/12B、`governance/CHANGE_PROTOCOL.md`、`work/templates/PROPOSAL.md`。
- 詳細設計の参考書式: `work/templates/CREATION_DESIGN.md` §§2/4/5/6/7。これは作成用テンプレートであり、修正の手順正本と取り違えない。
- 内容・表示: `docs/MASTER_APP_LESSONS.md`（特に§§10/11/17/52）、`docs/MATH_RENDERING_RULES.md`、`docs/INFORMATION_ARCHITECTURE_RULES.md`。数学教科書SPECは候補要約として参照し、既承認教材を上書きする根拠にしない。物理Chapter 1固有のタイトル数を数学へ移植しない。

## Proposed Solution — 表示と操作の具体案

### 1. 画面の構成

| 場所 | 現状の問題 | 修正後 |
|---|---|---|
| ページ外枠 | N09/N10の早期returnで共通shellを迂回 | 共通の単元ヘッダー・本文領域・フッターへreaderを接続する。独自の大見出し・内部コード・版の大表示を追加しない |
| 現在地 | 解答済みの全stageとh2を積み上げる | N08同様、現在stageの小さな段階帯（左青線、段階名、右に現在数/総数）を1個表示。既存stage ID・順序・総数を維持 |
| 本文冒頭 | 大見出しの下に同じ原問題・条件が重なる | 現在の原問題を一度だけ置く。続いて「例題」「導出」等の小ラベルと本文サイズの短い小見出し。証明は「導出」側として例題と区別 |
| 導出 | nodeごとに式が孤立し結論memoが重複 | 一つの推論を一つの連続領域にする。nodeは内部IDとして保ち、白カードや見出しをnodeごとに増やさない |
| 選択肢 | 全stageの末尾に1個あり、穴を押しても末尾へfocusする | 現在の穴を含む導出まとまりの直後に1個。番号付き白い全幅ボタンを縦並び、青枠・薄灰色panel、N08と同じ選択中/誤答の表現にする |
| 過去段階 | 常に本文へ展開 | 閉じた「確定した計算の履歴」から閲覧。現在の推論に必要な既出結果だけは本文中の参照として残す |
| リセット | reader末尾の「この版をやり直す」へ置換 | 共通フッター左下のRotateCcw付き「この単元を最初から」。固定overlayは作らない。確認文は「この単元の進捗を最初からやり直しますか？」 |

リセットの取消は保存も画面も変えない。確定時だけ現在単元の有効版の回答・カーソル・対応bridge/compact cursorを整合して初期化し、冒頭へscroll/focusする。他単元・旧版archive・比較記録は消さない。共通既存処理へ接続し、画面だけ初期化して完了記録を残す状態を作らない。

現在stageでは必要な前段の結果→短い問い→式中の穴→選択肢→回答に応じた続き、の順に読む。回答後は同じ式の穴が通常の数式へ戻る。次の計算は、その前提となる全partが正答してから出す。誤答では現在の穴と説明を保ち、先を開かない。自動スクロールは必要なときだけ行い、途中の計算から突然画面末尾へ移動させない。keyboardでは穴→その選択肢、正答後→次の問いへ自然に移れるようにする。

### 2. 余白・文字・整列

- N08の共通本文幅・段階帯・選択肢panelの既存スタイル値を基準とし、N09/N10側だけにscopeする。N08専用CSSや全体の基本文字サイズは変更しない。
- 小ラベル+小見出しは同一行を基本とし、狭い画面で自然に折り返す。N08のcaption（ラベル .8rem／小見出し1rem）、本文行高1.8、式前後 .65rem、選択肢間 .75rem・ボタンpadding .85remを対応する役割へ使う。段落を全て枠付きにしない。
- 連続式の行間4px、注記間6px、本文段落間8pxという現行数式group tokenは維持し、導出の始終と別例への切替にはN08のまとまりの余白を使う。式が連続するだけの場所と、話題が切り替わる場所を区別する。
- 数式18px、KaTeX scale1、操作領域44px以上を保つ。文章を横へ詰めるために数式を縮めない。数式は本文inline・式・選択肢・正答後で同じ数学表現として描画する。
- 同じ対象を変形する連続行には、node境界を越えた共通の式group IDを与え、左辺・関係記号・右辺の軸を共有する。短い続行は左辺を繰り返さず `=…` を同じ関係軸から始める。
- 正性の確認、不等式による比較、等式による変形は意味の別groupとする。例えば `5√5>0` と平方の計算を、見た目だけで同一等式鎖にしない。数式番号はその導出の最後の数式のbaselineに置く。
- 最大候補幅からneutral envelopeを計算し、空欄→誤答→正答で等号や根号が跳ねないようにする。320pxで収まらない場合は許可された演算・関係の境界で改行し、根号内部、分数、累乗の底と指数、括弧内の符号付き項を分断しない。
- 複数nodeの計算をまとめても、無条件に全ページの等号を同じx座標にしない。文中参照と履歴の式は、それぞれの用途・groupに応じて整列する。

### 3. 重複と履歴

`terminalRecord`のデータは保持するが、resolvedの全nodeに無条件でmemoを付ける描画をやめる。同じ場面ですでに読める完成式・条件・説明は再掲しない。後の推論で必要になる結果は、理由を伴う短い参照として一度表示する。文字列一致による一括削除はしない。履歴には確定した導出を一度と、必要な結論・条件だけを表示し、履歴内でも通常rowsと同じ結論memoを重ねない。

## Proposed Solution — 穴の詳細

### 共通の読み方と契約

以下の「完成本文」は全て正答した後に成立する、穴のない文章・式である。初期画面でその全文を見せる意味ではない。`【key】`は設計上の穴位置で、製品では既存の操作可能な穴として描く。

各表のkeyは対象node内で一意とし、実part IDは `nodeId::key`。既存keyは同じ学習行為のときだけ保持し、新規keyは旧partを転用しない。選択肢欄の✓は設計資料のみ。製品の候補に正答印を出さない。既存の安定シャッフルを使い、常に最初のボタンが正答にならないようにする。

各nodeの根拠は、以下に明記した既習知識と現行compiledの同名node・prerequisite/result参照。新しいnode間依存を推測して増やさない。追加partの順序依存を明示し、nodeの既存後続はそのnodeの全必須partの正答後にだけ解放する。

### H01 — n09-01：二つの候補で解を尽くす

現状は因数分解から全解の結論まで自動。目的は候補の再入力でなく、零積からの論理接続。

完成本文：「二つの候補の平方を確かめただけでは、他に解がないとはまだ言えません。実数の積が0になる条件を使います。」

\[x^2=16\iff x^2-16=0\iff(x-4)(x+4)=0\]
\[x-4=0\ \text{または}\ x+4=0\quad\Rightarrow\quad x=4\ \text{または}\ x=-4.\]

| key / 種別 | 問い・穴位置 | 全候補と誤答時の説明 | 解放 |
|---|---|---|---|
| zeroLogic / text | 「積が0になるには、二つの因子の条件をどう結びますか。」`x−4=0【zeroLogic】x+4=0` | ✓または／かつ→「両方が同時に0である必要はありません。一方だけ0の積も調べてください。」 | 正答後、既出候補4と−4を参照した全解を一度表示 |

根拠：実数の零積。未回答のleadに「少なくとも一方」と結論を先書きしない。±4の値は既出であり再度穴にしない。

### H02 — n09-q04-negative：負数の符号を反転する

完成本文：「a<0のとき、平方根にできる非負の候補を調べます。−a>0で、(−a)²=a²です。したがって√(a²)=−aです。」

| key / 種別 | 問い・穴位置 | 全候補と誤答時の説明 | 解放 |
|---|---|---|---|
| oppositeSign / relation | 「a<0の両辺に−1を掛けると、−aと0の大小はどうなりますか。」`−a【oppositeSign】0` | ✓>／<→「負の数を掛けると不等号の向きが変わります。」／=→「a<0なのでaは0ではありません。」 | `(−a)²=a²`と既存valueの問い |
| value / math（維持） | `√(a²)=【value】` | ✓−a／a→「条件a<0と平方根の非負性を照合してください。」／a²→「平方の値と、その平方根を区別してください。」 | 結論を完成 |

根拠：不等式への負数の乗法、非負の平方根。順序を `oppositeSign → value` に直す。旧valueの回答だけでは追加partを解答済みにしない。

### H03 — n09-06：差の符号を判断できる形へ変える

完成本文：「2−√5を0と比べるため、確定した2<√5の両辺へ同じ数−√5を加えます。2−√5<√5−√5=0なので、2−√5<0です。」

| key / 種別 | 問い・穴位置 | 全候補と誤答時の説明 | 解放 |
|---|---|---|---|
| addend / math | 「右辺を0にするには、両辺へ何を加えますか。」`2+【addend】<√5+【mirror:addend】` | ✓−√5／√5→「右辺が同じ数二つの和になります。0を作る操作を考えてください。」／−2→「右辺√5を0にする数を選んでください。」 | `2−√5<√5−√5`と既存zero |
| zero / math（維持） | 「右辺を計算します。」`2−√5<【zero】` | ✓0／5→「同じ数どうしの差を計算してください。」／√5→「右辺にも引き算が作用しています。」 | 差が負と確定 |

最初の問い前にleadで「√5を引く」と言わない。mirrorは正答後だけ埋め、同じ加数を二度回答させない。

### H04 — n09-07：外の負号を各項へ作用させる

完成本文：「2−√5<0より、√((2−√5)²)=−(2−√5)です。外の負号を−1の乗法とみて、符号込みの二項へ分配します。」

\[-(2-\sqrt5)=(-1)\{2+(-\sqrt5)\}=(-1)\times2+(-1)\times(-\sqrt5)=-2+\sqrt5=\sqrt5-2.\]

| key / 種別 | 問い・穴位置 | 全候補と誤答時の説明 | 解放 |
|---|---|---|---|
| outsideFactor / math | 「括弧全体の符号を反転する乗数は何ですか。」`−(2−√5)=【outsideFactor】×(2−√5)` | ✓−1／1→「1倍では符号が変わりません。」／−2→「括弧内の2と、全体の符号を反転する乗数を区別してください。」 | 和としての分配対象 |
| secondOperand / math | 「2−√5を二項の和とみたとき、第二項は何ですか。」`2+【secondOperand】` | ✓−√5／√5→「元の差の符号を含めた項を取ってください。」／−5→「根号を含む数全体が項です。」 | 分配した二つの積 |
| left / math（維持） | `=【left】 【sign】 √5`の第一項 | ✓−2／2→「第一項にも−1を掛けます。」／−1→「乗数だけでなく2との積を求めます。」 | sign |
| sign / math（維持） | 「第二項の積の符号を決めます。」 | ✓+／−→「第二項の積に含まれる二つの負号を確認してください。」 | 元の平方根の結論 |

前二partの確定値は分配式にmirror表示する。完成分配式を未回答時のleadやassumptionsへ出さない。

### H05 — n09-09：平方の挟みを元の大小へ戻す

完成本文：「1.41²=1.9881<2<2.0164=1.42²であり、三つの数は正です。非負の範囲で平方の大小と元の大小が対応するので、1.41<√2<1.42です。」

| key / 種別 | 問い・穴位置 | 全候補と誤答時の説明 | 解放 |
|---|---|---|---|
| lowerRelation / relation | 「左の平方比較から、1.41と√2を比べます。」`1.41【lowerRelation】√2` | ✓<／>→「正の数では平方の大小と同じ向きです。」／=→「計算済みの平方の値は2と一致していますか。」 | upperRelation |
| upperRelation / relation | 「右の平方比較から上限を決めます。」`√2【upperRelation】1.42` | ✓<／>→「2と1.42²の大小へ戻ってください。」／=→「平方の値が異なるので等号ではありません。」 | 二つを連結した挟みと概数の意味 |

根拠はn09-08の確定計算。二つの比較は対象の異なる判断として扱い、最初の正答後も右の完成不等号は見せない。

### H06 — n09-q14-positive-remainder：整数部分から小数部分を構成する

完成本文：「√10の整数部分は3と確定しました。定義x=n+rからr=x−nなので、r=√10−3です。3<√10<4の各辺から3を引くと0<r<1となり、小数部分の範囲にも合います。」

| key / 種別 | 問い・穴位置 | 全候補と誤答時の説明 | 解放 |
|---|---|---|---|
| remainderOperation / math | 「元の数xから整数部分nを取り除くには、どの演算をしますか。」`r=√10【remainderOperation】3` | ✓−／+→「x=n+rをrについて整理してください。」／÷→「整数部分と残りの関係は積ではなく和です。」 | `0<√10−3<1`の確認 |

根拠：既習の定義r=x−nと認定済み整数部分3。定義を必要な場面で使わせ、3を写す穴は作らない。直前本文を「3を引きます」とする答え漏れを除く。

### H07 — n10-02：候補の正性・平方・同定

完成本文：「t=5を候補t√5へ戻すと5√5です。この候補を、正性と平方の値の両方から確かめます。5√5>0、(5√5)²=5²(√5)²=25×5=125です。正で平方が125になる数は一つなので、√125=5√5です。」

| key / 種別 | 問い・穴位置 | 全候補と誤答時の説明 | 解放 |
|---|---|---|---|
| candidateSign / relation | 「5と√5の符号から、積と0を比べます。」`5√5【candidateSign】0` | ✓>／<→「正の数どうしの積の符号を確認してください。」／=→「どちらの因子も0ではありません。」 | 平方の計算 |
| squareValue / math | 「候補の平方の最後の積を計算します。」`(5√5)²=25×5=【squareValue】` | ✓125／25→「√5の平方による因子5を落としていませんか。」／625→「25×5を計算します。25を平方する場面ではありません。」 | identificationReason |
| identificationReason / text | 「この候補を√125と断定できる根拠はどれですか。」 | ✓正で、平方が125になるから／平方が125になるだけでよい→「平方が同じ負の候補も区別できるか考えてください。」／正であるだけでよい→「正の数の中で125の平方根を特定する条件も必要です。」 | `√125=5√5`と短い結論を一度 |

根拠：正の平方根の定義、n10-q02-signのt=5、n10-q01-squareの既出結果。t=5や25を再回答させない。上の完成本文の末尾を未回答時に露出しない。前nodeのt=5とこのnodeの最終式をmemoで直後再掲しない。

### H08 — n10-04：積の証明を平方だけで終えない

完成本文：「a>0、b>0のもとで、前段により候補√a√bは正で、平方はabです。ab>0であり、正で平方がabになる数の一意性から、√a√b=√(ab)です。」

| key / 種別 | 問い・穴位置 | 全候補と誤答時の説明 | 解放 |
|---|---|---|---|
| rootReason / text | 「確認した結果のうち、正の平方根を特定するのに必要なのはどれですか。」 | ✓候補が正で、平方がabになることの両方／平方がabになることだけ→「負の候補を除けるか確認してください。」／候補が正であることだけ→「どの正の数かを定める平方の値も必要です。」 | 積の性質の結論 |

平方・符号そのものは前nodeの構成を参照し、同じ計算を繰り返さない。公式一式を選ばせる穴には戻さない。

### H09 — n10-06：商を定義できる条件と正の平方根の同定

完成本文：「b>0なので√b≠0で、商を作れます。前段で(√a/√b)²=a/bと商の正性を確認しました。したがって、正で平方がa/bとなる数として√a/√b=√(a/b)です。」

| key / 種別 | 問い・穴位置 | 全候補と誤答時の説明 | 解放 |
|---|---|---|---|
| quotientReason / text | 「商を作る条件と、根号一つにまとめる根拠の組はどれですか。」 | ✓分母が非零で、商が正、平方がa/b／分母が0でも、平方がa/bならよい→「分母0の商が定義できるか確認してください。」／分母が非零なら平方や符号は不要→「商の存在と、正の平方根であることは別の確認です。」 | 商の性質の結論 |

前段の非零・平方・符号を新しい完成公式の候補選択へ置換しない。候補は根拠の組合せで、未知の定理名当てにしない。

### H10 — n10-q07-product：性質を使う演算と実際の計算

完成本文：「√6と√8の積には、証明済みの積の性質を使えます。√6√8=√(6×8)=√48です。」

| key / 種別 | 問い・穴位置 | 全候補と誤答時の説明 | 解放 |
|---|---|---|---|
| insideOperation / math | 「根号の外の積に対応して、中の二数をどう結びますか。」`√6√8=√(6【insideOperation】8)` | ✓×／+→「元の式は二つの平方根の和ですか、積ですか。」／−→「証明した積の性質と対応させてください。」 | inside |
| inside / math（維持） | `=√【inside】`（穴全体を根号内に置く） | ✓48／14→「根号内の演算は加法ではありません。」／24→「6×8をもう一度計算してください。」 | 次の因数分解 |

完成中間式を先に表示せず、選んだ演算→計算の順。正答後の48は次nodeへ参照する。

### H11 — n10-07：平方因子を自分で選ぶ

完成本文：「48を割り切る最大の平方数は16です。48=16×3、16=4²より、√48=√(16×3)です。ここから平方因子を根号の外へ出します。」

| key / 種別 | 問い・穴位置 | 全候補と誤答時の説明 | 解放 |
|---|---|---|---|
| squareFactor / math | 「48を割り切る正の平方数のうち、最大のものはどれですか。」`48=【squareFactor】×…` | ✓16／4→「4も平方因子ですが、今回は最大のものを選びます。残りにも平方因子がないか見てください。」／8→「8は整数の平方になっていますか。」 | factor |
| factor / math（維持） | 「残りの因子を計算します。」`48=16×【factor】` | ✓3／2→「16との積が48に戻るか確認してください。」／4→「同じく元の48へ戻して確認してください。」 | `√48=√(16×3)`と既存後続 |

問いに「最大」を入れ、4という有効な途中分解を数学的誤りとしない。16=4²は選択後に確認表示。先にassumptionsへ48=16×3を出さない。

### H12 — n10-q09-left：和の左項を簡単にする

完成本文：「√8+√50は各項を別々に変形します。8を割り切る最大の平方数は4です。8=4×2より√8=√4√2=2√2です。」

| key / 種別 | 問い・穴位置 | 全候補と誤答時の説明 | 解放 |
|---|---|---|---|
| squareFactor / math | 「8を割り切る最大の平方数を選びます。」`8=【squareFactor】×2`の右の2も回答前は隠す | ✓4／8→「元の8が整数の平方か確認してください。」／2→「取り出す因子自身が平方数である必要があります。」 | `8=4×2`、coefficient |
| coefficient / math（維持） | `√8=√4√2=【coefficient】√2` | ✓2／4→「4の平方根を求めます。」／8→「元の数をそのまま外へ出しません。」 | 左項の確定値、右項 |

根拠：積の性質と平方因子。既存の「和」の導入は維持。assumptionsの8=4×2は選択後へ移す。

### H13 — n10-q09-right：支援を減らして右項へ適用する

完成本文：「右の√50も同じ方法で変形します。50=25×2より、√50=√25√2=5√2です。これで二項を同じ√2の項として扱えます。」

| key / 種別 | 問い・穴位置 | 全候補と誤答時の説明 | 解放 |
|---|---|---|---|
| squareFactor / math | 「今度は右項を簡単にする平方因子を選びます。」`50=【squareFactor】×…` | ✓25／5→「5は整数の平方数ではありません。」／10→「50の因子でも、平方数とは限りません。」 | `50=25×2`、coefficient |
| coefficient / math（維持） | `√50=√25√2=【coefficient】√2` | ✓5／25→「25とその平方根を区別してください。」／10→「平方して25になる非負の数を求めます。」 | 和をまとめる既存後続 |

左項で使った手順を長く再説明せず、転移課題とする。平方因子と根号外の係数を別の操作として残す。assumptionsの完成分解は未回答時に見せない。

### H14 — n10-17：上下の積を分数として構成する

完成本文：「認定済みの因子c=√3−√2は非零です。c/c=1を掛けて値を保ち、分子どうし、分母どうしをそれぞれ掛けます。」

\[\frac{\sqrt3}{\sqrt3+\sqrt2}\times\frac c c=\frac{\sqrt3\times c}{(\sqrt3+\sqrt2)\times c},\qquad c=\sqrt3-\sqrt2.\]

| key / 種別 | 問い・穴位置 | 全候補と誤答時の説明 | 解放 |
|---|---|---|---|
| productOperation / math | 「二つの分数の積では、分子どうしと分母どうしをどの演算でまとめますか。」`(√3【productOperation】c)/((√3+√2)【mirror:productOperation】c)` | ✓×／+→「分数の積であり、分子・分母に加える変形ではありません。」／÷→「掛ける因子c/cとの積を作っています。」 | cを代入した括弧付きの積、既存後続 |

乗算の判断は一度。分子・分母の同じ演算はmirrorで連動する。認定済み共役因子を再選択させない。最初の積の式は元の変形対象として示すが、まとめた完成分数は未回答時には出さない。

### H15 — n10-q19-distribute：符号込みの項と積の符号

完成本文：「分子の√3(√3−√2)へ分配法則を使います。括弧内の第二項は−√2です。√3×√3+√3×(−√2)=√3√3−√3√2となり、その後で各積を計算します。」

| key / 種別 | 問い・穴位置 | 全候補と誤答時の説明 | 解放 |
|---|---|---|---|
| secondOperand / math | 「和として分配するときの第二項を、符号込みで選びます。」`√3×√3+√3×【secondOperand】` | ✓−√2／√2→「元の括弧は差です。第二項の符号を含めてください。」／−2→「元の第二項には根号があります。」 | 展開した積を加減の標準形へ |
| productSign / math | 「√3×(−√2)の符号を反映します。」`=√3√3【productSign】√3√2` | ✓−／+→「正の数と負の数の積の符号を確認してください。」 | 次nodeの既存積3・根号内6の計算 |

根拠：N08からの分配・符号の既習。第一の穴は項のscope、第二は積の符号という別操作。√3√3=3と√3√2=√6の計算は既存後続で扱い、先に完成答え3−√6を出さない。

### H16 — n10-q20-factor：有理化に使う因子の非零性

完成本文：「正の因子cで有理化する方針で、c=2−√3を選びます。2と√3は正で、2²=4>3=(√3)²なので2>√3、従って2−√3>0です。非零の同一因子を上下に掛ければ値を保ち、分母の和と差の積を有理数にできます。」

| key / 種別 | 問い・穴位置 | 全候補と誤答時の説明 | 解放 |
|---|---|---|---|
| factor / math（維持） | 「この手順で使う正の因子cを選びます。」`(2+√3)【factor】` | ✓2−√3／2+√3→「同じ和では和と差の積になりません。」／√3−2→「その因子でも有理化できますが、今回は正のcという指定に合わせてください。」 | 平方比較2²> (√3)² |
| factorSign / relation | 「正の数の平方比較を使い、差と0を比べます。」`2−√3【factorSign】0` | ✓>／<→「2と√3の平方の大小を、元の正の数の大小へ戻してください。」／=→「4と3は一致していません。」 | c≠0の確定、reason |
| reason / text（維持） | 「値を保って有理化できる理由を選びます。」 | ✓非零の因子で上下を同じように変え、分母の積を有理数にできるから／同じ因子なら零でもよい→「因子が零なら新しい分母はどうなりますか。」／分母が有理数なら分子は別の因子でよい→「上下で掛けた比が1になるか確認してください。」 | 既存後続の有理化 |

順序は `factor → factorSign → reason`。理由の正答を数学的計算の自動検算と称さない。逆符号の有効な別解を不可能と表示しない。

### H17 — n10-20：同じ因子の積と平方差の対応

完成本文：「(2−√3)/(2+√3)の上下に2−√3を掛けます。分子は同じ因子の二乗、分母は和と差の積なので、(2−√3)²/{2²−(√3)²}=(2−√3)²/(4−3)です。分子の展開と最後の値は次の既存計算へ渡します。」

| key / 種別 | 問い・穴位置 | 全候補と誤答時の説明 | 解放 |
|---|---|---|---|
| power / math（維持） | 「分子全体の積を指数で表します。」`(2−√3)^【power】` | ✓2／1→「同じ差を二回掛けています。」／4→「項の数でなく因子の個数を数えてください。」 | denominatorOperation |
| denominatorOperation / math | 「和と差の積を二つの平方で表す演算を選びます。」分母`2²【denominatorOperation】(√3)²` | ✓−／+→「(A+B)(A−B)を展開したとき、中間の積が打ち消し合うことを確かめてください。」／×→「平方どうしの積へ置き換える公式ではありません。」 | 分母4−3、既存後続の値1・分子計算 |

既存powerの回答と追加判断を混同しない。未回答時は後の4−3や分母1を本文・memo・履歴・ヒントへ先出ししない。

## Scope / Out of Scope

- 内容変更は上記17nodeの学習行為追加・順序・答え漏れ防止に限る。他69nodeの問い・候補・正答・学習行為は維持し、末尾の全件対応表で確認する。
- 86node全体へ、N08基準の共通shell・選択肢・現在stage・履歴・重複抑制・意味group整列を適用する。17nodeだけ表示を直して同じ欠陥を残さない。
- N08の本文・データ・専用reader、N11や他科目・他モード、元問題・図・収録範囲、既存評価履歴、workflow/governanceの規則を変更しない。
- 新図・新単元・新しい大見出し・新サービス・課金・Gold/fitを含めない。図不要の今回17nodeへ飾りの図は作らない。
- この提案の承認は、限定実装と検証用候補の保存まで。本番main反映・Pages更新は、差分と固定候補がそろった時点の公開ゲートで別途扱う。旧案中の公開まで含む記述を本案へ自動継承しない。

## Expected Affected Areas — ファイルと役割

基準source94dfd300の実在パスで特定。以下の許可範囲から実差分のpath/hashを実装前計画へ固定し、使わないパスは変更しない。

| ファイル | 変更内容 |
|---|---|
| `work/items/W-MATH-043-n0910-restart/NODE_DESIGN.json` | 17nodeのpart・順序・表示条件・導出group/用途。旧版の設計根拠を保存して新案との対応を残す |
| `tools/textbook/transformation/nested-lesson.mjs`、`apply-n0910-construction.mjs` | 設計からの生成、part依存・mirror・表示group/用途の受渡し。生成JSONだけの手修正にしない |
| `src/data/textbook/math/numbers/n09ConstructionCompiled.json`、`n10ConstructionCompiled.json`、`n0910CandidatePins.json` | 新しいactive候補と固定hash |
| 同ディレクトリの新規`n09Revision5.json`、`n10Revision4.json` | 新版登録。現`n09Revision4.json`、`n10Revision3.json`を過去の比較定義として保持 |
| 同ディレクトリの新規`n09ConstructionCompiledR4.json`、`n10ConstructionCompiledR3.json` | 基準source94dfd300の現compiledをbyte一致で保存する旧版snapshot。archive側の版対応を明示して読取専用で使用 |
| 同ディレクトリの`n09Lesson.ts`、`n10Lesson.ts` | 新revisionとactive compiledの単元登録を一致させる。旧版定義は保持 |
| `src/components/textbook/ConstructionLessonReadingFlow.tsx`、`construction-lesson-reading.css` | 表示順・小見出し・選択肢位置・現在stage・memo・履歴・reset接続 |
| `src/components/textbook/NestedConstructionMath.tsx`、`nestedMathGeometry.ts`、`nestedMathTemplate.ts` | nodeをまたぐ意味group・軸・neutral幅・折返し。既存式全体compileの原則を維持 |
| `src/domain/compiledNestedLesson.ts`、`nestedLesson.ts` | 必要なgroup/用途・part依存契約、投影時の未回答漏洩防止 |
| `src/pages/TextbookUnitPage.tsx`、`N0910RevisionPage.tsx`、`N0910ArchivePage.tsx` | 共通shell復帰、reset、現行/旧版route対応。N08/N11分岐の意味は維持 |
| `src/domain/nestedMigration.ts`、`nestedLessonStorage.ts` | 新版の意味対応・保存・旧版読み取り、対象単元resetの整合 |
| `work/items/W-MATH-043-n0910-restart/evidence/migration-analysis.json` | 引き継ぐ既存partと、新規未回答partの根拠 |
| 対応する既存`nestedLesson*.test.ts`、`nestedMigration.test.ts`、`nestedLessonStorage.test.ts`、`compiledNestedLesson`関連検査、`N0910ArchivePage.test.tsx`、`nestedProgressBridge.test.ts` | 意味対応、依存、履歴/旧版、保存/resetの回帰 |
| `tools/textbook/n0910/validate-design.mjs`・対応test、`finite-math.py`・対応test、`check-app.mjs`、`tools/textbook/transformation/nested-snapshots.mjs`、`tools/textbook/layout/nested-measurements.mjs`・runnerと対応test | 新契約の一意性・数学、全状態、導出全体の配置と操作を検査 |

新しい版・snapshot・partは本案に明示した追加であり、旧IDの意味を差し替える操作ではない。現行workflow実行器が新規path/ID移行で停止を要求する場合は、その機構を迂回せず、上の明示scope・path・hashを具体案の固定計画として照合する。対応に工程コード改修が必要なら本案の実装に混ぜず別途提案する。

## 保存・移行・保護

N09をr5、N10をr4とする。現r4/r3と従来r3/r2の比較・readonlyを保持し、namespaceを勝手に変えない。移行は旧・新partの「問いの対象、要求する判断、型、正答、全候補、前提」の意味が一致するものだけ出所付きで引き継ぐ。文章の説明改善だけで同一性を失わせないが、意味を変えたpartは引き継がない。

追加partは未回答。旧AUTO結論や単元完了は追加の判断を回答済みにする証拠ではない。未変更の回答を全消去せず、最初の未解決必須partへ復帰する。保持した後続回答があっても、新しい前提が未解決の間は画面や進捗の解放へ使わない。新しいcompiledHashとの不一致を無視しない。

旧版の試し解答とreadonly閲覧は現行の保存byteを変えない。reset取消・他単元・旧版閲覧を含めて保存前後を比較する。復旧用の元記録を保持し、ロールバックで新版の回答を旧版へ逆流させない。

## Risks / Rollback

| リスク | 防ぎ方・失敗時の扱い |
|---|---|
| 穴を追加したのにlead/assumptions/後続式が答えを示す | 各partの回答前後を投影・実描画で検査。完成本文は設計用として扱い、無条件表示しない |
| 平方因子4や逆符号因子を不当に誤りとする | 問いの「最大」「正の因子」を明記し、数学的に可能な別解をfeedbackで認める |
| stageを閉じることで必要な結果まで見えなくなる | current stageに必要な既出結果だけを参照表示し、元の因果接続を保つ |
| 全式を同じ軸にして意味や折返しを壊す | 等式変形・符号・比較を別の意味groupへ分け、四幅・全回答状態で実測 |
| 共通shell接続によりN08/N11やresetが変わる | N09/N10のadapterに限定。共通pageの他分岐と保存前後を回帰 |
| 新版へ旧完了を流用し穴を飛ばす／全回答を消す | part単位の意味対応表と初回未解決への復帰、旧版保存の不変検査 |

候補は独立branchで作り、元source94dfd300と現保存を保持する。検査失敗なら候補を公開せず原因箇所へ戻る。候補の表示切替を戻す場合も旧版データと回答を上書きしない。教材の学習目的や対象17nodeを実質変更する必要が生じた場合は改訂提案へ戻す。

## Verification Plan — 順序と合格条件

1. **設計固定**：本案の17nodeと末尾69node維持表を、生成元・part契約・意味group・移行対応へ照合。各穴の根拠、唯一正答、誤答理由、前提、解放先が埋まっていることを確認する。数式の厳密計算と意味審査を区別する。
2. **代表ブロック**：最初はH07の√125場面と共通shell/選択肢/resetを候補で実装・検査する。`t=5 → 候補の正性 → 平方計算 → 同定理由 → √125=5√5`が一続きに読め、直後重複がなく、未回答の答えが見えないことを確認する。実SHA・実画像のGitHub確認票で本人の`細部OK / 要修正`を受け、確認前に残りの教材変更を一括量産しない。
3. **残りの限定適用**：代表の確認後、承認済みの他16nodeへ適用する。意味が変わる追加指摘は修正案を改訂し、元の承認を拡張しない。69nodeの穴契約を差分比較し、表示修正の結果を全86nodeへ確認する。
4. **CODE検査**：型・生成一致・KaTeX/AST・part参照/依存・唯一正答・mirror・有限数学の検査、該当unit/schema test・typecheck・build・governance checkを通す。旧期待値を丸ごと更新して不具合を消さない。必要な追加テストは今回の実欠陥を検出するものに限る。
5. **実画面検査**：320/390/430/1440pxで、空欄・穴選択・全誤答候補・正答・段階遷移・完了・reload・readonly履歴・旧版比較・reset取消/確定を確認。全対象導出の軸、空欄位置、番号、根号/分数、overflow/衝突と余白を測り、画面全体も目視する。
6. **N08比較**：同じ幅で、現在stage帯・原問題・小ラベル/小見出し・本文幅・選択肢番号/縦並び/位置・左下resetを横に比較する。N08の教材内容を変更せず、N09/N10が同じ操作形式になったことを確認する。
7. **横断監査**：新旧N09/N10、保持N08各版、N11、共通ページの影響箇所についてPASS/FAIL/UNVERIFIEDと対象SHA・証拠を記録。元の技術PASSを無効化せず、変更入力と依存先を再検査する。同型不具合が他教材にも確定したら影響を記録し、無承認の一括修正はしない。
8. **受入・公開の区別**：各小ブロックの実画像確認と横断監査後、候補SHAとmanifestを固定する。公開が必要な段階で具体的差分を提示し、既存の公開ゲートへ進む。認可された実働URLが用意でき、配信byteと操作を照合した候補だけ本人総チェックへ渡す。実装・CI・公開成功を本人合格と扱わない。

非作者審査が必要な工程は実担当と実対象を記録する。本案を書いた担当者による再読を非作者審査済みとは呼ばない。既存担当方針を無断で増員しない。

### R04への対応と台帳

| 必須項目 | 本案の対応 |
|---|---|
| before_after | 画面比較表、H01〜H17の現状・完成本文・穴契約 |
| protected_scope | Scope / Out of Scope、69node維持表、保存・移行 |
| patch_plan | ファイル/役割表、代表ブロック→残りの順序 |
| verification_plan | 上の検証1〜8とリスク表 |
| proposal_hash | 保存した本PROPOSAL.mdのUTF-8 byteのSHA-256をWORK.mdへ固定する（自己参照hashを本文に埋め込まない） |

本案の保存は正式台帳のR04受理を意味しない。前回の最新Store欠落に対する本人の一回限りの特例を保持し、欠けたreceipt・イベント・合格を作らない。現在の具体案と承認証拠はGitHubで追跡し、実際に提出できた工程だけを受理済みとする。

## Approval

Status: APPROVED
Approved by user: YES
Approval date: 2026-11-02 JST
Approval evidence: 本人「まあこれでいいでしょう。承認」。承認した設計本文はcommit85a53672826fb204a7e182f56b975d80b4727747、SHA-256 `4409a8d83f709ca9b9d9976774f81115929c1cde84b717a7e8d523029706afe5`。現ファイルは承認・実装状態の欄だけ更新し、設計本文は変更しない。

今回の「じゃ作り直そう」は本案の作成指示であり、まだ提示していなかった本案の実装承認には転用しない。本案そのものの明示承認後に、記載した限定実装へ進む。

## Review History

- P-W046-UX-02：本人より、排版の理解・穴の具体的な直し方・提案書式の不足を指摘。未完成案として旧WORK本文を保持。
- P-W046-UX-03：正本の修正手順と提案書式へ合わせ、穴のない完成本文、全候補と誤答説明、前提と解放、N08基準の配置、移行・保護・検査を追記。未実装・未承認。
- User feedback: 未受領。
- Supersedes: P-W046-UX-02。
- Superseded by: —。

## Appendix — 全86nodeの対象/維持対応表

以下は基準source94dfd300のcompiledから抽出した全件表。17nodeは上記の個別契約を適用する。残る69nodeの既存partは問い・型・正答・全候補・学習行為を維持する。ゼロ穴でも定義・手本・記録として妥当なものを機械的に穴へ変えない。共通の表示・重複・整列修正は両方に適用する。

| 単元 / stage | node ID | 現行partキー | 本案の内容 |
|---|---|---|---|
| n09-stage-01 | n09-q01-positive | なし | 穴設計維持 |
| n09-stage-01 | n09-q01-negative | value | 穴設計維持 |
| n09-stage-01 | n09-01 | なし | H01 |
| n09-stage-02 | n09-definition | なし | 穴設計維持 |
| n09-stage-02 | n09-q02-root | value | 穴設計維持 |
| n09-stage-02 | n09-q02-negative-square | signFactor, value | 穴設計維持 |
| n09-stage-02 | n09-02 | なし | 穴設計維持 |
| n09-stage-02 | n09-boundary | なし | 穴設計維持 |
| n09-stage-03 | n09-q03-inside | value | 穴設計維持 |
| n09-stage-03 | n09-03 | value | 穴設計維持 |
| n09-stage-04 | n09-q04-nonnegative | value | 穴設計維持 |
| n09-stage-04 | n09-q04-negative | value | H02 |
| n09-stage-04 | n09-04 | なし | 穴設計維持 |
| n09-stage-04 | n09-05 | value | 穴設計維持 |
| n09-stage-05 | n09-q06-squares | value | 穴設計維持 |
| n09-stage-05 | n09-q06-order | relation | 穴設計維持 |
| n09-stage-05 | n09-06 | zero | H03 |
| n09-stage-05 | n09-q07-negation | scope | 穴設計維持 |
| n09-stage-05 | n09-07 | left, sign | H04 |
| n09-stage-06 | n09-decimal-method | なし | 穴設計維持 |
| n09-stage-06 | n09-p001-q08-left-square | L1, L2, L3 | 穴設計維持 |
| n09-stage-06 | n09-p001-q08-right-square | R1, R2, R3 | 穴設計維持 |
| n09-stage-06 | n09-p001-q08-lower-sign | C | 穴設計維持 |
| n09-stage-06 | n09-p001-q08-upper-sign | D | 穴設計維持 |
| n09-stage-06 | n09-08 | なし | 穴設計維持 |
| n09-stage-06 | n09-09 | なし | H05 |
| n09-stage-07 | n09-parts-target | なし | 穴設計維持 |
| n09-stage-07 | n09-q10-reject-truncation | value | 穴設計維持 |
| n09-stage-07 | n09-10 | n | 穴設計維持 |
| n09-stage-08 | n09-q11-remainder | sign, value | 穴設計維持 |
| n09-stage-08 | n09-11 | なし | 穴設計維持 |
| n09-stage-09 | n09-q12-lower | value | 穴設計維持 |
| n09-stage-09 | n09-q12-upper | value | 穴設計維持 |
| n09-stage-09 | n09-12 | lower, upper | 穴設計維持 |
| n09-stage-10 | n09-q13-reverse | S1, S2 | 穴設計維持 |
| n09-stage-10 | n09-13 | left, right | 穴設計維持 |
| n09-stage-11 | n09-q14-positive-integer | value | 穴設計維持 |
| n09-stage-11 | n09-q14-positive-remainder | なし | H06 |
| n09-stage-11 | n09-q14-negative-integer | value | 穴設計維持 |
| n09-stage-11 | n09-q14-negative-remainder | sign | 穴設計維持 |
| n09-stage-11 | n09-14 | なし | 穴設計維持 |
| n10-stage-01 | n10-q01-square | rootSquare | 穴設計維持 |
| n10-stage-01 | n10-01 | value | 穴設計維持 |
| n10-stage-01 | n10-q02-sign | value | 穴設計維持 |
| n10-stage-01 | n10-02 | なし | H07 |
| n10-stage-02 | n10-q03-expand | powerA, powerB | 穴設計維持 |
| n10-stage-02 | n10-03 | aValue, bValue | 穴設計維持 |
| n10-stage-02 | n10-q04-sign | relation | 穴設計維持 |
| n10-stage-02 | n10-04 | なし | H08 |
| n10-stage-03 | n10-q05-denominator | relation | 穴設計維持 |
| n10-stage-03 | n10-q05-square | numPower, denPower | 穴設計維持 |
| n10-stage-03 | n10-05 | numerator, denominator | 穴設計維持 |
| n10-stage-03 | n10-q06-sign | relation | 穴設計維持 |
| n10-stage-03 | n10-06 | なし | H09 |
| n10-stage-04 | n10-q07-product | inside | H10 |
| n10-stage-04 | n10-07 | factor | H11 |
| n10-stage-04 | n10-q08-factor | coefficient | 穴設計維持 |
| n10-stage-04 | n10-08 | なし | 穴設計維持 |
| n10-stage-05 | n10-q09-left | coefficient | H12 |
| n10-stage-05 | n10-q09-right | coefficient | H13 |
| n10-stage-05 | n10-09 | なし | 穴設計維持 |
| n10-stage-05 | n10-q10-coefficients | coefficient | 穴設計維持 |
| n10-stage-05 | n10-10 | なし | 穴設計維持 |
| n10-stage-06 | n10-q11-formula | middleSign | 穴設計維持 |
| n10-stage-06 | n10-11 | leftSquare, rightSquare | 穴設計維持 |
| n10-stage-06 | n10-q12-product | inside | 穴設計維持 |
| n10-stage-06 | n10-12 | constant | 穴設計維持 |
| n10-stage-07 | n10-q13-identity | operation | 穴設計維持 |
| n10-stage-07 | n10-13 | left, right, difference | 穴設計維持 |
| n10-stage-08 | n10-14 | operation | 穴設計維持 |
| n10-stage-08 | n10-q15-factor | factor | 穴設計維持 |
| n10-stage-08 | n10-15 | numerator | 穴設計維持 |
| n10-stage-08 | n10-q16-denominator | square, denominator | 穴設計維持 |
| n10-stage-08 | n10-16 | なし | 穴設計維持 |
| n10-stage-09 | n10-q17-factor | factor | 穴設計維持 |
| n10-stage-09 | n10-q17-nonzero | relation | 穴設計維持 |
| n10-stage-09 | n10-17 | なし | H14 |
| n10-stage-10 | n10-18 | A, B, C | 穴設計維持 |
| n10-stage-10 | n10-q19-distribute | なし | H15 |
| n10-stage-10 | n10-19 | left, inside | 穴設計維持 |
| n10-stage-11 | n10-q20-factor | factor, reason | H16 |
| n10-stage-11 | n10-20 | power | H17 |
| n10-stage-11 | n10-q21-denominator | D | 穴設計維持 |
| n10-stage-12 | n10-q21-expand | P, K, Q | 穴設計維持 |
| n10-stage-12 | n10-q21-constants | C | 穴設計維持 |
| n10-stage-12 | n10-21 | なし | 穴設計維持 |

維持対象は86−17=69node。parts数の増減を合格指標にしない。

### 維持69nodeの既存穴契約（基準から抽出）

ここにある問い・全候補・正答を変更しない。無穴nodeは上の表に含む。候補表示順は既存の安定シャッフルによる。

| node::key | 問い | 種別 / role | 正答 | 全候補 |
|---|---|---|---|---|
| n09-q01-negative::value | 負の候補を2回掛けた値を計算します。 | math / rational | 16 | 16 ／ -16 ／ -8 |
| n09-q02-root::value | 平方が16で非負の数を選びます。 | math / rational | 4 | 4 ／ -4 ／ \pm4 |
| n09-q02-negative-square::signFactor | (-1)²を計算します。 | math / rational | 1 | 1 ／ -1 ／ 2 |
| n09-q02-negative-square::value | 確定した因子と5を掛けます。 | math / rational | 5 | 5 ／ -5 ／ 25 |
| n09-q03-inside::value | 根号の中の平方を計算します。 | math / rational | 16 | 16 ／ -16 ／ -8 |
| n09-03::value | 平方が16になる非負の数を選びます。 | math / rational | 4 | 4 ／ -4 ／ 16 |
| n09-q04-nonnegative::value | a≥0全体で根号の値を表す式を選びます。 | math / operand | a | a ／ -a ／ a^2 |
| n09-05::value | 二つの符号の場合を一つに表す式を選びます。 | math / meaning | &#124;a&#124; | &#124;a&#124; ／ a ／ -a |
| n09-q06-squares::value | 2の平方を計算します。 | math / rational | 4 | 4 ／ 2 ／ 8 |
| n09-q06-order::relation | 元の二数を左2、右√5の順に比較します。 | math / relation | < | < ／ = ／ > |
| n09-q07-negation::scope | 外の負号を掛ける元の中身全体を選びます。 | math / bound-subtree-reference | 2-\sqrt5 | 2-\sqrt5 ／ 2 ／ \sqrt5 |
| n09-p001-q08-left-square::L1 | 中項2×140×1を計算します。 | math / rational | 280 | 280 ／ 140 ／ 2800 |
| n09-p001-q08-left-square::L2 | 三つの項を合計します。 | math / rational | 19881 | 19881 ／ 19880 ／ 19601 |
| n09-p001-q08-left-square::L3 | 整数の平方を10000で割って小数に戻します。 | math / rational | 1.9881 | 1.9881 ／ 19.881 ／ 0.19881 |
| n09-p001-q08-right-square::R1 | 中項2×140×2を計算します。 | math / rational | 560 | 560 ／ 280 ／ 5600 |
| n09-p001-q08-right-square::R2 | 三つの項を合計します。 | math / rational | 20164 | 20164 ／ 20160 ／ 19884 |
| n09-p001-q08-right-square::R3 | 整数の平方を小数に戻します。 | math / rational | 2.0164 | 2.0164 ／ 20.164 ／ 0.20164 |
| n09-p001-q08-lower-sign::C | 左の平方と2を比較します。 | math / relation | < | < ／ = ／ > |
| n09-p001-q08-upper-sign::D | 2と右の平方を比較します。 | math / relation | < | < ／ = ／ > |
| n09-q10-reject-truncation::value | 候補n=−2の残りを計算します。 | math / rational | -0.1 | -0.1 ／ 0.1 ／ -4.1 |
| n09-10::n | −2.1を含む単位区間の左端の整数を選びます。 | math / coordinate | -3 | -3 ／ -2 ／ -4 |
| n09-q11-remainder::sign | 括弧付きの整数を引いた式を見て、括弧を外した後の演算を選びます。 | math / binary-operation | + | + ／ - |
| n09-q11-remainder::value | 残りの値を計算します。 | math / rational | 0.9 | 0.9 ／ -0.9 ／ -5.1 |
| n09-q12-lower::value | 左の整数3の平方を計算します。 | math / rational | 9 | 9 ／ 6 ／ 3 |
| n09-q12-upper::value | 右の整数4の平方を計算します。 | math / rational | 16 | 16 ／ 8 ／ 4 |
| n09-12::lower | 左端3と√10を比較します。 | math / relation | < | < ／ = ／ > |
| n09-12::upper | √10と右端4を比較します。 | math / relation | < | < ／ = ／ > |
| n09-q13-reverse::S1 | 左側の関係を負の乗算後へ移します。 | math / relation | > | > ／ = ／ < |
| n09-q13-reverse::S2 | 右側の関係も負の乗算後へ移します。 | math / relation | > | > ／ = ／ < |
| n09-13::left | 小さい順の左端を置きます。 | math / coordinate | -4 | -4 ／ -3 ／ 4 |
| n09-13::right | 小さい順の右端を置きます。 | math / coordinate | -3 | -3 ／ -4 ／ 3 |
| n09-q14-positive-integer::value | √10の整数部分を選びます。 | math / coordinate | 3 | 3 ／ 4 ／ 10 |
| n09-q14-negative-integer::value | −√10の整数部分を選びます。 | math / coordinate | -4 | -4 ／ -3 ／ 4 |
| n09-q14-negative-remainder::sign | 括弧付きの整数を引いた式を見て、括弧を外した後の演算を選びます。 | math / binary-operation | + | + ／ - |
| n10-q01-square::rootSquare | √5の平方を計算します。 | math / rational | 5 | 5 ／ 25 ／ \sqrt5 |
| n10-01::value | 125÷5を計算します。 | math / rational | 25 | 25 ／ 120 ／ 625 |
| n10-q02-sign::value | 正の候補tを選びます。 | math / rational | 5 | 5 ／ -5 ／ 25 |
| n10-q03-expand::powerA | √aの指数を置きます。 | math / coefficient | 2 | 2 ／ 1 ／ 4 |
| n10-q03-expand::powerB | √bの指数を置きます。 | math / coefficient | 2 | 2 ／ 1 ／ 4 |
| n10-03::aValue | 第一因子の平方を求めます。 | math / operand | a | a ／ a^2 ／ \sqrt a |
| n10-03::bValue | 第二因子の平方を求めます。 | math / operand | b | b ／ b^2 ／ \sqrt b |
| n10-q04-sign::relation | 積の符号を判断します。 | math / relation | > | > ／ < ／ = |
| n10-q05-denominator::relation | 商を定義するための分母の条件を選びます。 | math / relation | \ne | \ne ／ = ／ < |
| n10-q05-square::numPower | 分子の指数を置きます。 | math / coefficient | 2 | 2 ／ 1 ／ 4 |
| n10-q05-square::denPower | 分母の指数を置きます。 | math / coefficient | 2 | 2 ／ 1 ／ 4 |
| n10-05::numerator | 分子の平方を求めます。 | math / operand | a | a ／ b ／ a^2 |
| n10-05::denominator | 分母の平方を求めます。 | math / operand | b | b ／ a ／ b^2 |
| n10-q06-sign::relation | 商の符号を判断します。 | math / relation | > | > ／ < ／ = |
| n10-q08-factor::coefficient | √16を計算します。 | math / coefficient | 4 | 4 ／ 16 ／ -4 |
| n10-q10-coefficients::coefficient | 係数2+5を計算します。 | math / coefficient | 7 | 7 ／ 10 ／ 3 |
| n10-q11-formula::middleSign | 差の平方の中項を結ぶ符号を選びます。 | math / binary-operation | - | - ／ + |
| n10-11::leftSquare | 最初の平方を求めます。 | math / rational | 2 | 2 ／ 4 ／ \sqrt2 |
| n10-11::rightSquare | 最後の平方を求めます。 | math / rational | 3 | 3 ／ 9 ／ \sqrt3 |
| n10-q12-product::inside | 中項の根号内の積を計算します。 | math / rational | 6 | 6 ／ 5 ／ 12 |
| n10-12::constant | 普通の数2+3を計算します。 | math / rational | 5 | 5 ／ -1 ／ 6 |
| n10-q13-identity::operation | 和と差の積を平方差へ対応させます。 | math / binary-operation | - | - ／ + |
| n10-13::left | 左の平方を求めます。 | math / rational | 7 | 7 ／ 49 ／ \sqrt7 |
| n10-13::right | 右の平方を求めます。 | math / rational | 2 | 2 ／ 4 ／ \sqrt2 |
| n10-13::difference | 7−2を計算します。 | math / rational | 5 | 5 ／ 9 ／ -5 |
| n10-14::operation | 分数の値を保つ操作を選びます。 | text / meaning | 分子と分母に同じ0でない数を掛ける | 分子と分母に同じ0でない数を掛ける ／ 分母だけに同じ数を掛ける ／ 分子と分母に0を掛ける |
| n10-q15-factor::factor | 分母へ掛けた積が有理数になる正の因子を選びます。 | math / operand | \sqrt3 | \sqrt3 ／ 3 ／ -\sqrt3 |
| n10-15::numerator | 分子1×√3を計算します。 | math / operand | \sqrt3 | \sqrt3 ／ 1 ／ 3 |
| n10-q16-denominator::square | √3の平方を求めます。 | math / rational | 3 | 3 ／ 9 ／ \sqrt3 |
| n10-q16-denominator::denominator | 分母全体2×3を計算します。 | math / rational | 6 | 6 ／ 5 ／ 3 |
| n10-q17-factor::factor | A+Bへ対応するA−Bを選びます。 | math / operand | \sqrt3-\sqrt2 | \sqrt3-\sqrt2 ／ \sqrt3+\sqrt2 ／ \sqrt2-\sqrt3 |
| n10-q17-nonzero::relation | 同じ数を引いた後の差の符号を判断します。 | math / relation | > | > ／ < ／ = |
| n10-18::A | 左の平方を求めます。 | math / rational | 3 | 3 ／ 9 ／ \sqrt3 |
| n10-18::B | 右の平方を求めます。 | math / rational | 2 | 2 ／ 4 ／ \sqrt2 |
| n10-18::C | 3−2を計算します。 | math / rational | 1 | 1 ／ 5 ／ -1 |
| n10-19::left | 第一項の積を計算します。 | math / rational | 3 | 3 ／ 9 ／ \sqrt3 |
| n10-19::inside | 第二項の根号内の積を計算します。 | math / rational | 6 | 6 ／ 5 ／ 3 |
| n10-q21-denominator::D | 分母4−3を計算します。 | math / rational | 1 | 1 ／ 7 ／ -1 |
| n10-q21-expand::P | 最初の項2²を計算します。 | math / rational | 4 | 4 ／ 2 ／ 8 |
| n10-q21-expand::K | 中項の係数を計算します。 | math / coefficient | 4 | 4 ／ 2 ／ 6 |
| n10-q21-expand::Q | 最後の平方を定義で計算します。 | math / rational | 3 | 3 ／ 9 ／ \sqrt3 |
| n10-q21-constants::C | 普通の数4+3を計算します。 | math / rational | 7 | 7 ／ 1 ／ 12 |

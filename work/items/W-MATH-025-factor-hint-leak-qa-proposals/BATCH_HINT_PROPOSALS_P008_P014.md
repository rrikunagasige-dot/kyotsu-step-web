## 2026-10-23 — current seven-hint implementation and native evidence

Latest source `22ccf559a70d758689b958c77d19f4c9cdd43b7e`,image child `97ed3d8e4a03ec4a6af8cc96987f79f5ba31aa3b`,Draft PR121. P008–P014 APPROVED by user「まとめて修正してくれ」and implemented exactly. Review39911476014 SUCCESS:48unit,42realbrowser/42explicitmatrixskips;Governance39911475938 SUCCESS. Math39911475985 SUCCESS:250unit/257browser/12explicit skips. [Current exact results/history/limits](./SEVEN_HINTS_EXECUTION_20261023.md),[all seven actual images](./GATE1_SEVEN_ITEM_REVIEW_20261023.md). No repeated implementation approval. New seven visual Gate① remains BLOCK-CHECK-PENDING;prior five accepted unchanged. Work VERIFYING;whole-chapterGate② OPEN;Gate③ FINAL-REVIEW-NOT-READY. Main unchanged;no merge/deploy. Older pending/proposed/test-failure status paragraphs below are retained history,not current outcome.


## 2026-10-23 — seven exact hints approved and implementation started
User direct response **「まとめて修正してくれ」** followed the seven exact proposed new hints/P008–P014 and the explicit grouped approval question. This approves precisely those seven hint strings;no repeated approval is required. Record parentd95dd283d204095bf58ece70faef9544abe1d42d/source runtimefc27e7f5fbdc28345917276d43602ea4787537bd;live main15ae503455bc6ae75b080caa1c4919cafb250027 unchanged;account/repo1391122224 verified.
Seven replacements in four files only. Keep keys,authored/visible choices,original208 markers/290 graded decisions,unit revisions,flow/math,text/figures,schema,renderer and progress semantics. Prior five accepted blocks and N13/Q16 migrations remain intact. Verification adds exact real review sections,seven boundary cases,and real normal/review Chromium320/390/1440 cases. N10Q08 includes its actual Q07 prerequisite in preview;N12 uses actual sub-item indices;N04Q22 correctly handles final-unit completion. Uses getTextbookChoices actual2/3/4 choices. Source CI and authentic images **PENDING** until actual native results. Evidence archived on a separate branch so source CI is not cancelled by image commits.
[P008–P014 approved batch](./BATCH_HINT_PROPOSALS_P008_P014.md). New seven human Gate① is pending after engineering QA;prior five remain accepted. Gate② OPEN;Gate③ FINAL-REVIEW-NOT-READY;no main merge/deploy or NE01/NE02 creation.

# 次のヒント修正案 — 7件一括
Status: APPROVED
Frozen learner source: fc27e7f5fbdc28345917276d43602ea4787537bd

横断監査で、現在の計算・組合せを誤答hintが直接教える7件を確認した。5件を調べた際に同じ原因の隣接2件も確認したため、約5件ずつまとめる指示に従って一括提示する。先に承認された5件は受入済みのままで再承認しない。この新7件は未実装。

## 1. N04 Q20 — P-008
- 問題: Wordは先に掛ける二組を自分で選ばせるが、hintが正しい二組(1,4)/(2,3)を直接指定する。Q19は別の三項式の展開で、この組合せを求めていない。
- 旧hint: **1と4を組にし、2と3を組にすると和が揃う。**
- 新hint全文: **二つずつ組にして展開したとき、xの係数が何の和になるか考えよう。その和が同じになる組合せを探そう。**
- 保護: 正答 `(x^2+5x+4)(x^2+5x+6)`、元の式・本文・全選択肢・ID・版・図・履歴を保持。
- [個別exact提案](./PROPOSAL_P008.md)

## 2. N10 Q07 — P-009
- 問題: √6√8を根号一つにし、平方因子を探す問で、まだ求めていない平方因子16をhintが指定する。前問Q06は一般の平方根の商の証明で、48の分解はしていない。
- 旧hint: **平方数である16を因子として取り出す。**
- 新hint全文: **まず根号の中の数どうしを掛けよう。得られた数を、できるだけ大きい平方数と残りの因子の積に分けよう。**
- 保護: 正答 `\sqrt{48}=\sqrt{16\cdot3}`、元の式・本文・全選択肢・ID・版・図・履歴を保持。
- [個別exact提案](./PROPOSAL_P009.md)

## 3. N10 Q08 — P-010
- 問題: 前問で16×3は求めるが、根号の外へ出す係数4はこの問の判断。hintが係数を直接答える。N09で√16=4を扱う既習事項と、現在のN10の解答欄へ具体的な係数を教えることを区別する。N10にはN09の保存済み正答を要求するゲートはない。
- 旧hint: **16の正の平方根は4になる。**
- 新hint全文: **前の式で見つけた平方数が、何を二乗した数か確かめよう。その平方根を根号の外へ出し、残りの因子は根号の中に残そう。**
- 保護: 正答 `4\sqrt3`、元の式・本文・全選択肢・ID・版・図・履歴を保持。
- [個別exact提案](./PROPOSAL_P010.md)

## 4. N12 Q06 — P-011
- 問題: 3x−2xの係数を入れる欄に、hintが採点値1を直接出す。前問Q05は二つの不等式への分割で、この係数計算は未解答。正答後の1x=xという本文説明は保持する。
- 旧hint: **3−2=1。1xはxと同じ。**
- 新hint全文: **両辺から同じ文字の項を引くと、係数どうしの引き算になる。文字xを残したまま、係数だけを計算しよう。**
- 保護: 正答 `1`、元の式・本文・全選択肢・ID・版・図・履歴を保持。
- [個別exact提案](./PROPOSAL_P011.md)

## 5. N12 Q12 — P-012
- 問題: 130(20−x)の符号付き係数を求める欄で、hintが−130xを示し、必要な係数−130を先出しする。直前の2600は定数項であり、この符号付き係数を求めた結果ではない。
- 旧hint: **130×(−x)=−130x。符号も答えに含める。**
- 新hint全文: **括弧の外の正の数を、括弧内の負の項にも掛けよう。係数の大きさと符号を別々に確かめ、文字xを除いた数を選ぼう。**
- 保護: 正答 `-130`、元の式・本文・全選択肢・ID・版・図・履歴を保持。
- [個別exact提案](./PROPOSAL_P012.md)

## 6. N04 Q22 — P-013
- 問題: Tを戻した平方の展開を生徒が行う段階で、hintがT²の三項を計算済みで示す。直前Q21のT²+10T+24はTの式であり、xの三次項10x³や25x²を求めた結果ではない。同じ数字10が既出でも、別の計算結果の先出しを正当化しない。
- 旧hint: **T²ではx⁴、10x³、25x²が出る。さらに10Tを足す。**
- 新hint全文: **二乗の公式でT²を展開し、それから一次のTの項も元の式へ戻そう。同じ次数の項を集め、各係数を自分で計算しよう。**
- 保護: 正答 `x^4+10x^3+35x^2+50x+24`、元の式・本文・全選択肢・ID・版・図・履歴を保持。
- [個別exact提案](./PROPOSAL_P013.md)

## 7. N07 Q11 — P-014
- 問題: 10^kを素因数の積で表す原問で、hintが必要な素因数2と5を直接示す。前問Q10の69/99の約分やQ09の倍率100とは別の判断であり、現在の原問の素因数分解は未解答。
- 旧hint: **10=2×5なので、その積をk回掛ける。**
- 新hint全文: **10を素数の積に分け、同じ積をk回掛けた形を考えよう。それぞれの素数が何回ずつ掛かるかを数え、指数で表そう。**
- 保護: 正答 `2^k\cdot5^k`、元の式・本文・全選択肢・ID・版・図・履歴を保持。
- [個別exact提案](./PROPOSAL_P014.md)


## 承認範囲
この7文字列だけの限定実装と必要な問別QAを、ひとまとまりで行う案。実装後に7件の実画面をまとめて提示する。現在は診断・提案のみ。WORK_SYSTEM §2の「An unapproved proposal must not silently become implementation.」に従い、この新7件の承認前に学習内容は変更しない。Gate③/公開の承認とは別。

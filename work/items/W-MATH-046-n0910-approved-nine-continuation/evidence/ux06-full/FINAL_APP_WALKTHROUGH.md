# アプリ全体・最終総チェック票 — W-GOV-008/P-003

> **最後にユーザー本人が最初から最後までplayするゲート**。小ブロックの `細部OK` やエージェントの自動テストでは代替できない。

Status: FINAL-REVIEW-READY（実施上の公開・技術確認済み／本人評価PENDING／正式Store受理ではない）  
Work / proposal lineage: W-MATH-046 / P-W046-UX-06 / PUBLICATION_APPROVAL.json  
Frozen release-candidate full 40-character SHA: d588d1c395de3132805395f2708bed7535c1767d  
Full product in-scope manifest: [RELEASE_SCOPE.jsonのlearnerFinalScope](RELEASE_SCOPE.json)。数学1A・教科書N09全14問/55回答、N10全21問/70回答。全node/part IDも収録。  
Explicit exclusions: 上記以外の教科/モード/単元を新規の本人受入へ拡張しない。サンプル確認による全体受入の例外なし。  
Verified live start URL: https://rrikunagasige-dot.github.io/kyotsu-step-web/?release=d588d1c3#/learning/textbook/math-numbers-expressions-n09  
Provider: existing GitHub Pages / [明示公開承認](PUBLICATION_APPROVAL.json)。publisher e734337f1e18dd285f04f1b8ed63532ceff3b72f。  
URL verification: 2026-11-03 JST、開始HTML HTTP200/hash一致。公開CIの新N09/N10四幅のpage.goto/compiledHash/全正誤操作成功によりauth wallなし。source d588/publisher e734、CI Pages artifactと実配信両manifest・全121files一致。  
Phone/desktop + progress: [run41569692346](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/41569692346)、実N09/N10四幅・正誤/保存/旧版/リセット成功。公開後N08/旧r6/旧版/N11を含めrun全32step success。    
Gate①: 本人の条件付き代表細部承認を補修・検査で充足、[DETAIL_ACCEPTANCE.json](DETAIL_ACCEPTANCE.json)。同じ代表を再承認待ちへ戻さない。  
Gate②: [本文CODE補完](PROSE_CODE_CHECK.json)・[A](SOURCE_REVIEW_A.md)・[B](RENDER_REVIEW_B.md)・[技術結果](VERIFICATION.json)。正式Store受理とは別の限定実施記録。  

## ユーザーへ送る短い案内（READYで実URLを貼れるときだけ）

**アプリ全体をここから最初から最後まで確認してね：** [N09から開始](https://rrikunagasige-dot.github.io/kyotsu-step-web/?release=d588d1c3#/learning/textbook/math-numbers-expressions-n09) ／ [N10](https://rrikunagasige-dot.github.io/kyotsu-step-web/?release=d588d1c3#/learning/textbook/math-numbers-expressions-n10)

今回の対象は 数学1Aの教科書N09（全14問）とN10（全21問）。次を一通り試してください。

1. 最初から順番にすべての章/問題へ進める。
2. 各問題で間違えたときやり直せて、正答すると次へ進む。
3. 式、図、ヒント、解説が自然で、次の答えが先に見えない。
4. 戻る・再読み込み・保存・初期化の挙動が意図どおり。
5. スマホとPCで対象のN09/N10が読める。対象外の教科/モードまで今回の新規本人受入へ広げない。

対象2単元を通して確認した結果を、自然な言葉で返してください。問題があれば、単元・問・症状を教えてください。

## Full playthrough ledger — unvisited = pending

| Subject/mode | All chapter/question IDs or checklist link | Wrong & correct interactions | Progress/refresh | Phone/desktop | User's result / date |
| --- | --- | --- | --- | --- | --- |
| 数学1A/教科書 N09 | N09-Q01〜Q14・55回答。全IDはscope参照 | PENDING | PENDING | PENDING | PENDING |
| 数学1A/教科書 N10 | N10-Q01〜Q21・70回答。全IDはscope参照 | PENDING | PENDING | PENDING | PENDING |

## Final gate rules

- [x] このWorkの代表本人条件付き承認を充足、同案の残り限定適用は既承認範囲。個別履歴を保持し、これを本人全体受入とはしない
- [x] 影響横断の限定技術・意味審査と本文CODE補完を統合、未解消の適用内確定欠陥なし。正式Storeの状態を捏造しない
- [x] 実公開URL・固定source/route/manifest/CIartifactと121filesのbyte一致を確認
- [x] 明示公開承認に基づく既存Pages公開。CI fresh contextでnamespace/保存/旧版/別unit保護を確認
- [ ] User has played *every* agreed unit/question/interaction, or supplied explicit different-scope approval
- [ ] 本人がこのSHA/scopeを通して確認した明示的評価を返した（自然な言葉で可）。原文/日付/証拠を記録
- [ ] On any NG: return to CMD-WORK-001, repeat relevant cross-audit and full/affected walkthrough, replace SHA

If any gate fails, remain `FINAL-REVIEW-NOT-READY` or `NEEDS-FIX`, **never** `FINAL-APP-ACCEPTED`. This final acceptance does **not** authorize main merge, public production release, GitHub Pages publish, Vercel deletion, or payment.

原本：actual main e734のP003 template（blob86f0b8cb94b268f32afefe5e59d789deb7a3e391）。Work側の未採用W-GOV-010 templateへ置換していない。URLのrelease queryはcache対策で、別版を固定する仕組みではない。本人の自然な明示評価を原文とsource/scopeへ対応し、合言葉や自動テストから受入を推定しない。

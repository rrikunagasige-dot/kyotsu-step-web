# Current record reconciliation — W-MATH-051 / VERIFICATION.md

Status: UNVERIFIED
Record-Scope: Metadata/provenance restoration only; no product or Store mutation.
Fixed-Candidate: 84f90ba9d6c7fea8ebbaed976fc0de68aaa0c91b
Work-State: BLOCKED

Historical record recovery remains blocked: exact current scope/approval/verification mapping is incomplete; no approval, completion, or learner acceptance is inferred. Only P005 is closed; parent W051/P004 and separate N04/N06/function findings stay open.

Evidence:
- Store approval event 816e1846-7b33-416f-b7eb-7a36d1a1fce2, proposal_hash=fd5524d507112335ade94247c1c61c487bf488b8f8c4a5b97e983b03a38359e9 (historical, no new quote)
- Store approval event c97a1175-3e3a-4a39-8da2-74b9cf371ca8, proposal_hash=7de678681b12b5c53cdb2d37863455aa380ce2fe312b948aee9927ae12f0ced0 (historical, no new quote)

Original-Body-Source: existing untracked physical recovery record
Original-Git-Body-SHA256: ABSENT
Original-Physical-Body-SHA256: d60beae6c6a8927a61c944ba4561ab3f9e561786abae0840a4046b2f537beeb3

<!-- HISTORICAL ORIGINAL BODY START — bytes below preserved exactly; current metadata is above -->
# 検証状態

提案段階の確認：原文可逆復元、parts対応、528本文外数学片＋575本文数学片の正規化・厳密KaTeX解析、数式内混成回答10、TSX3ファイルの構文、候補hash・7path範囲・対象外320ファイルのmanifest。

構文検査はTypeScript5.8.3、KaTeXは0.16.47。取得した検査用資材のSHA512を現行pnpm-lockと照合した。主担当のM_PREFLIGHT.jsonが実実行結果。A/Bの原文検査と相互審査は各作者が実施した範囲として記録する。

提案作成時点の未実施：候補を実アプリへ適用した型検査、build、単体/UIテスト、4幅の実画面、正誤操作、保存・再読込・リセット、公開・実配信検査。承認後のR07/G2/G3で実施する。

続行後の実績：承認7afterの仮想型検査PASS。隔離した承認済み候補9c5c7253の実build PASS。単体テストはbaseline/候補とも859中828成功・31失敗で同一集合、新規失敗0。全件成功ではない。

320px診断は初問正答後に失敗。QAの直下KaTeX getter誤りを補修し、製品の親16.8px対数式20.328pxも実在と分離確認。一時style注入の追加案で数式16.8px/指数倍率0.7を観測。CSS追加補修の製品適用と四幅全状態検査は未実施。

旧公開版の検査成功を、新候補の実画面検査成功へ転用しない。比較HTMLは説明用であり操作・測定の検証結果ではない。

P003承認後：QA専用copy34e321d4の7after正確一致・build成功。N01 320診断は15段階/27判断・誤答54・保存等に成功。第1回四幅はraw textContentがKaTeX内部表現を重複採取してFAIL。旧FAILを保存し、元paragraph partIndexと実DOM直下childを原日本語/数学annotation/順序で完全対応するgetterに補修（正例5・負例7）。測定側だけ変更した371c368dをbuildし、四幅全251判断を新規再走中。

目視で追加不備2点：N01 320pxの式直後句点が行頭へ分離、N05 320pxの短式−3(y+5)が括弧内部で改行。A/B原画像23枚の限定視認とRoot再視認・元stateで確認。automation PASSだけで全排版合格とはしない。N01の単純1em予約は句点行頭を解消するが29.86pxの離隔が残る。container解除による自然幅案はResizeObserver guardを発火したため不採用、原失敗を保持。

最終P004候補Source81b21924：型検査/build成功、関連101件成功、四幅各62段階/251判断/509誤答候補・計180case成功。N01 320の正答reload失敗は、原da745候補で再現して保持し、現6版の2observer callbackだけrAFへまとめる実修正後に再検証。Aがnative通常操作reload/保存/3時点geometryと正Noto字体を独立確認し、Root/Bは原PNG限定視認。8after/4QA/dist120のbyte照合成功。これは承認前のcandidate preflightであり正式R07/G3/本人受入へ読み替えない。


## 2026-11-08 P005 main公開経路の継続

PR139を7pathだけでmerge、main M=1efb90d5cc1303500efa220ab9fe91985776f0db。treeは審査済みP474dと完全同一。正式13結果/60行を再利用し、元Native MERGE実outcome SUCCESS。main push Pages run42441545470は実行中、公開前検査→deploy→public4幅/6routeの元工程を省略しない。旧dispatch未実行をNOT_EXECUTEDとして新DEPLOYへ対応。実公開・G3_HOST・本人受入は未完。原API・役割審査・台帳回収の根拠はp005-activationの20261108/MAIN各原JSONを参照。


2026-11-08 12:44 JST: Rootの独立HTTPS検査で全126応答（125files＋最終manifest）が実Pages artifact/原120buildと完全一致。全最終応答URLもHTTPSで同host/base。sourceD、producerM、contract/nativeProof/namespace/8製品hashを照合。実公開同期は確認。main CIの公開後操作検査・四幅・正式G3_HOSTと本人受入は未完。


## 2026-11-08T04:19:13.233272+00:00 — P005 実公開検証と元G3_HOST完了

main Mの実公開run42441545470 completed/success。原公開8ZIP digestと8444状態/172画像hash、4幅180case/248段階/1004正答/2036誤答を照合。実HTTPS全126byteと原D120build/実Pages一致。A初期12画像/Root4画像を実表示し範囲限定確認。元DEPLOY SUCCESS→release.verify CODE→G3_HOST PASS、台帳8712/headbc4e892712a6d5d68acaf40f0bdaf39bd5d8151ee54711e71f24c57920fc5012。実next WAITING/USER_DECISION/G3_FINAL@n0106-display-cohort。本人受入/Gold/品質肯定/学習/close未実施。N04 gap/N06説明重複・原診断限定・既存二CI失敗を保持。詳細原記録はp005-activationとnative-p005-d/G3_HOST--n0106-display-cohort。

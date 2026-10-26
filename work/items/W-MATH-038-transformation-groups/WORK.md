# W-MATH-038 — 通常式変形の表示・穴設計の基盤改修

Status: PROPOSED / USER_REVIEW。対象：数学・教科書／学習モード。
入口：既存CMD-WORK-001修正。solution/1を既存production/2のC/Rに追加する設計であり、新入口ではない。
現在の依頼：通常の数式変形で、内部の小段階を保ちながら表示を一続きへまとめる。穴・書き方・CODE/AIの役割を実装まで提案する。
承認：この新P001への実装承認は未受領。今回許可されたのは調査と提案書の作成。
正本基点：1d543b43e0b7bf5b05eae20d2a159c339facbdc8。公開app source1e8d2ae4、main publisher5142b598。
成果物：PROPOSAL.md、REFERENCE_NOTES.md、SOURCE_AUDIT.json、DESIGN_EXAMPLE.json。
実装：なし。公開変更：なし。新規fit：なし。
関係：W037のN08公開・旧r4保護を維持。今回の発言をN08全体受入や個別品質Goldへ転用しない。
次：この具体的なP001へのユーザー判断。承認後の実装はI01〜I11。N11一単元を完成後に既存appへ直接反映し、新旧表示を比較できるリンクを渡す。

## 2026-10-26 実装承認・再開

上記PROPOSEDは提案時の履歴。本人「いいよ。じゃこれで続けて。そして終わったら次はもう一回N08の修正じゃ」でP001/I01〜I11を承認。APPROVAL.jsonへexact提案hashと発言を固定。Status: IMPLEMENTING。独立branch work/transformation-groups-implementation-20261026。N08の再修正はこの実装完了後、原因・影響・具体案の順で開始し、現行r5と旧r4を保護する。設計承認を教材受入やGoldにしない。

## Implementation checkpoint

Source aef34919, exact CI40268196468/40268196421 success; native R01–R07/G2 passed. First publisher metadata format was corrected; publisher d3eb6d75 deployed successfully but overall run40269350862 failed at an asynchronous original-image assertion. Exact image bytes pass; read-only verification40270029827 checks the same hosted app after decode. See RESULT.md and subsequent PUBLICATION_CHECKPOINT.json. G3_FINAL is USER, not automatically completed. New N08 P001 is proposed separately; no N08 edit or ML fit.

## Current — hosted verification complete

Native G3_HOST@n11 PASS. App source aef34919, publisher d3eb6d75, public read-only verification40270029827 SUCCESS. Work VERIFYING / WAITING_USER at G3_FINAL@n11. Actual failed publisher run is retained with its successful deployment step and the repaired-harness verification as separate evidence. No user acceptance, quality label or fit inferred. N08 all39-node concrete proposal is ready under W039; not implemented.

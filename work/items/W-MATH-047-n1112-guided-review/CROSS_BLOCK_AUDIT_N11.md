# N11 G2 横断監査

Status: BLOCKED / G2 FAIL / 未公開

Source: `4a09de7a0f910669946466daf918ab28c820a5f2`。A/B原報告は evidence/N11_G2_A_RAW.json / N11_G2_B_RAW.json。

| Surface | 判定 | 観察 |
|---|---|---|
| Original source/IDs/wording fidelity | PASS | 43block原問と現47node/39回答を再照合。6node限定修正、確認区分、独立なq04二比較、境界検証、括弧/分数問題を保持。entryはauthored.unitを採用。 |
| Mathematics chain/dependencies | PASS | 全導出を再読。加減の差、正負0、逆数除法、一次不等式/括弧/分数の数式は整合。W038の3graph/7rowは数学的同一を保持。ただし学習行為/漏洩は別行FAIL。 |
| Answers/choice types/missing-term representation | PASS | 39正答/109誤答を四幅で実行したCI結果。局所計算と主不等式選択を別穴として実画像で確認。 |
| Premature answers/hints/leakage | FAIL | G2-B-L01：除数3回答後、非穴の3x/3<7/3と右辺商だけを選ぶx<□が同時表示。7/3は未回答の商の正答そのものであり、主式の他要素は固定済み。MASTER8/17/20に反する先出し。 |
| Figure values/KaTeX/mobile fit | PASS | 原図2点のgate/decode、KaTeX/geometry検査PASS。代表画像でF02の端点○/●と結果整合。五原図のprotected hash一致も独立確認。 |
| Wrong/retry/correct sequencing and navigation | PASS | CIは全誤答hint/未解答継続、正解後置換、全14stage次へ/完了を検査。単元内前後履歴とoriginal layout往復を確認。章単位のN10→N11→N12連続実操作は別途未実施。 |
| Shared UI/protected accepted blocks | PASS | target protectedManifestの全16pathのSHA256をローカル実bytesと独立比較し全一致。N09/N10 authored/compiled、N08、共通UI/CSS/domainを保護。N12はBASELINEを確認し新版実装済みとは扱わない。 |
| Other subjects/modes actual operation | UNVERIFIED | 保護path一致とN11限定routeから静的な非影響は支持されるが、物理・普通練習・simulationを当該releaseで実操作した証拠はこの入力にない。 |
| Phone320/390/430 and desktop1440 overflow | PASS | 四幅全nodeの式/番号/選択肢overflow検査PASS。代表focusで番号26/27と本文・数式の非衝突を実見。 |
| Persistence/history/migration/review isolation | PASS | reload/全履歴/resize、旧revision1〜10からarchiveとfirstValue/attemptCountを含む回答保持、他unit非変更、original/new layout往復の保存不変をCIで確認。namespace/ID/revision維持。 |
| Explicit reset and chapter-boundary transition actual operation | UNVERIFIED | reset処理とcursor除去を静的確認したが既存CI harnessにはconfirm→reset→先頭再開の実検査がない。N10→N11→N12連続ナビゲーションの実証もない。FAILを隠すためPASSへ補わない。 |
| Prior corrections/W038/old CI failures | FAIL | 旧CI41608964412のW038 plan DRIFTと41608964415の旧source byte固定FAILは承認済みsource更新による歴史的assertで、現runの数学/保存失敗ではない。旧assertは未緩和で証拠保持。W038数学・採点・番号保持はPASSだが、旧由来のG2-B-L01が統合releaseの学習行為/漏洩を阻害する。 |

OPEN: G2-B-L01。商7/3の先出し。具体案: [G2_CORRECTION_PROPOSAL.md](G2_CORRECTION_PROPOSAL.md)。

今回の監査はfirstPass=falseをそのまま保存。新しい統合release単位では初回だが、既視の教材/画像を新たな盲検としない。正式必須scopeのPASSに転用せず、FAILと未確認を保存した。

次: 火柴図はissue追加によりR01_CAPTURE@n11。修正案承認→正式修正工程→再画像確認→G2再監査。

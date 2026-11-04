# CURRENT — 2026-11-04 継続復元

P-W048-003の承認は保持。保存済みsource `17e39f0a` のN13 leaf/domain/Pageはr3 after hashと一致し、N14 leafはbefore hash。前チャットの実画面・CI案本体は今回取得したGit全refsから回収できなかった。過去のローカルPASS報告は会話上の報告として保持し、今回の検証証拠へ代用しない。

元snapshotの隔離コピーで既存RuntimeのR05とR06固定patchを実行し、現src三ファイルとbyte一致を確認。過去の実行イベントは捏造せず、今回の復元イベントとして共有Storeへ追加した。実srcへ同じpatchを二重適用していない。guard変更なし。

生成現在地は共有source変更により失効した `R01_CAPTURE@n13` の再検証。R06 claimも保存済みであり、無条件再patch禁止。次は現sourceに対する必要な結果の再検証・既承認照合とR06完了記録、同版CI、R07非作者審査。N14の正式適用、G2、公開・配信確認、本人受入、事後sweep/R08/L01/Z01は未完了。

火柴図の再生成は `PYTHONHASHSEED=0` で行い、同じ台帳からの一致を確認。初回の不一致は未完了queueの集合列挙順だけで、ノード状態・台帳HEAD・次課題は一致。engine/guardは変更しない。

検査: 共有表示・保存の回帰26件PASS。数理解集合13件PASS。build PASS（N14未適用export/既存bundle警告あり）。現在契約・旧採点保持・N13 r1〜r4のsynthetic移行 PASS。ブラウザ取得失敗につき今回DOM/画像はUNVERIFIED。

CI具体案は `ci-review/README.md` と同directoryのYAML・二script。前案とは同一と称さずREVIEW_ONLY。active .githubへは未適用。Work内の検査準備と、範囲外workflow一ファイルの有効化を分離する。

今回のMとA/Bは新チャットの実担当。前回と同名でも同一セッションの継続実体とは扱わない。CODEはhash/compile/型/build/採点保存の契約検査、AIは意味と工程の審査、USERは具体案と実物受入を担う。子二人、孫なし、MのみStore/Git writer。

以下は保存済みR04時点の履歴。

---

# W-MATH-048 — N13/N14 修正具体案

Status: PROPOSED / N13・N14のR01〜R04正式PASS / 次R05_APPROVAL@n13（両unit共通bundleの本人判断待ち）。製品未適用・未公開。

現在の承認対象は **P-W048-003 / P003_FINAL.md + r3/DESIGN_INPUTS.json**。PROPOSAL.md/P001_FINAL.md/P002_FINAL.md、元のFINDINGS.md、旧CODE/レビュー結果は履歴証拠として保持。古い素案へ戻らない。

CMD-WORK-001 / production/2 / team/1。本人2f33f70aおよび06b23101の続行は調査・具体案作成の継続。新P003の実装承認・教材受入・品質labelへ転用しない。W047 N11/N12 DONEを保持。

Branch: work/n1314-source-audit-20261104。正本教材source f129ba78、main/publisher6cd11。母Word SHA93827322、N13原33/N14原46block、全25原問と原図3点を照合。N13 r4→r5/12→18回答、N14 r10→r11/38→41回答。追加9判断、計59。旧50回答/200choice/acceptedAnswersを保護。

全文IRはN13_FULL_IR/N14_FULL_IR、既存CODEで検証・compile。明示ROW_PROJECTIONで同じ物理行の独立slotを戻し、候補全文との完全一致を検査。r3の具体patchはN13 leaf+domain+Page、N14 leafの計4file。実src/public/.githubは未変更。新共通rendererやguard変更なし。

Mは唯一Store/Git writer。実子agentはA=/root/w048_review_a、B=/root/w048_review_bの二人、孫なし。旧WORKにあったw047の担当名は今回の実taskではない。原資料初回観察と現在target観察を分離し、N14理由の既露出を正直に記録。blind/model独立は主張しない。

初回Bの中央配置FAIL、二回目Bの狭幅specificity FAILをnative保持。P003の実consumer selector(0,5,0)で両出力の同findingをVERIFIED_FIXEDに結び、静的32条件とB独立78条件を確認。最終A/Bは両unitの静的設計PASS。実DOM0件（Chromium起動/取得不可）を実UIのPASSにしない。

限定検証：schema/choice/KaTeX307、全文警告0/物理160block復元、59正答順/177誤答候補/44部分slot、数理解集合・端点13、実候補domainの旧保存28条件、隔離tsc、保護hash。詳細はVERIFICATION.mdとFINDINGS_R04.md。

現在地の正本はgenerated/CURRENT_POSITION.md、三つの火柴図は同じ台帳HEADから生成。次はR05でP003の本人承認。承認後R06に同じIR/固定patchを適用し、R07で四幅の全正誤答・ヒント・履歴・再読込・旧保存・reset・段落・文字・等号軸・番号・原図を実画面検証。その後G2→G3。別の具体技術差分が必要ならG3前に分離照合。本人端末のresetは行っていない。

再開前に `python work/items/W-MATH-048-n1314-source-audit/restore_w048_snapshots.py` を実行すると、W047とW048のnative大容量JSONを検証して完全復元できる。共有Store/guardは変更しない。record_investigation.pyは旧段階用、再実行しない。凍結patchはr3/だけを使用し、旧DRAFTやr1/r2へ戻さない。

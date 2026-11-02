# UX05 browser harness 非作者レビュー A

担当 /root/w046_source_review。既存UX04測定harnessを再利用した今回の差分を読取審査。新しいbrowser runは実行していない。

## 初回対象と結論

- browser.mjs SHA256 `9507c5726665f56d6d5685f0039339718b4666e969730fa65e27b88b2f1daca2`
- migration-browser.mjs SHA256 `4bc1d2137328660342263d7661346313f9912bb9771aa83c554e48485f75361b`

初回は下記の検査上の欠落を主担当へ報告した。製品欠陥の実見ではなく、harnessが欠陥を見逃し得る点。補修確認前のharness PASSは出さない。

1. **initial↔wrongの固定比較が迂回され得る。** browserのneutralStates keyにgroup neutralLayoutKeyを含めるため、wrongで不正な再計画が起きkeyが変わると比較先まで新entryになる。認定resolvedPartsが同じstateを比較単位とし、neutralLayoutKeyも別assertで一致を要求する。正答で認定stateが変わった時は別frameを許す。
2. **migration結果の実行版/環境bindingが不足。** migration scriptはsourceSHA/expectedSHA・前後manifest・scriptHashをRESULTへ保存せず、HTTP/network/fontのエラー拘束もない。主browserと同等に固定版と実環境を記録し、CODEの合格をどの版へ付けたか検証できるようにする。
3. **別Vite serverへ接続する余地。** 両scriptはspawn後fetch200だけでreadyとし、自身の子serverの早期終了・port占有を検査しない。既存portの別sourceへ接続して、disk manifestをその表示の出所と誤って結び付け得る。空きport確認・自身serverの起動成功/生存を要求する。
4. **reset確定の他記録保存を検査しない。** browserはcancel byte不変と、reset後の先頭editable/reloadを検査するが、確定時の他unit current・当unit旧版archive/dedicatedの不変を検査しない。valid ledgerをseedし、reset対象以外の保存byte/意味を確認する。
5. **main-only移行でRETIRE原記録が失われても通り得る。** migrationのr6-full-mainは現行KEEP46を検査するが、RETIRE6を含む旧R6 ledger全体がmain archiveへ保存されたことを検査しない。dedicatedなしの場合もrecords/parents/eventsの元ledgerをarchiveへ全照合する。

## 有効な検査範囲

- 主browserは四幅で各partのinitial・全wrong候補・correctを操作し、wrongで進まない、feedback、keyboard、44px、幾何、式番号、overflowを確認する。全node/元stage/前提/既存part契約の保護も持つ。
- 正答の再計画を認めつつ、通常KaTeXの `(x-4)(x+4)=0` と実寸/括弧高さを比較し、resolved proofと残存slot0を確認する。これは任意の全数式の自然寸法一致まで拡張しない。
- 実fontはdocument.fonts.readyだけでなくMain/Math italicのloaded face、エラーなし、HTTP/networkを主browserで照合する。同じserved moduleからDOM測定をimportしてWeakMap出所を使う。ただし上記server bindingを補う必要がある。
- 移行13ケースはr6 main/dedicated、r5/r4鎖、r6 reset空/回答後、r7 reset回答後、未知r5/r6/r7 hash、未知future r8、保持wrong、N10 legacy7件。未知nativeでは全storage不変を要求する。
- native旧版6/5/4の試し解答はkey新設も含め全storage不変を要求し、legacy3は既存cursor生成の違いを明示して元key不変を確認する。

## 留意

sourceManifestは起動時の列挙path集合であり、HEAD文字列だけではdirty treeとcommit byte一致を保証しない。主担当が実際に固定SHA別worktreeを用意し、manifestをcommit blobへ照合した根拠と組み合わせて使用する。test fixturesはsyntheticであり、実学習記録や正式Store eventの復元ではない。

## 補修版の再レビュー（初回）

browser `bd098877ccf600abe03c80b9814ab0beb323c1bd90b53c4c216414b1b54330fb`、migration `b35e4517b06db1e7a3622540af2364ba9ab5123387a3a638fce323e8f3360c61`を読取確認。

- migration版根拠・HTTP/network/実font・served compiled、両serverの空port/自身起動生存/timeout、旧main ledger全体のarchive照合の追加を確認。初回2/3/5は解決した。
- initial/wrongでneutralLayoutKeyが違えば独立assertするよう改善され、初回1の直接のkey迂回は解消。ただし、visible row/認定集合まで誤って変わるとcertification keyも変わるため、partごとのinitial certification自体とwrongの同一性を別assertする補足を依頼した。
- 有効な旧版/別unitの一回答ledger seedを実domain APIで作る点は適切。ただしreset後のarchivedRevisions全体deepEqualは、仕様どおり追加される現在版reset履歴まで禁止してfalse FAILになる。既存archive entryは全不変、新設reset entryは直前current ledgerと一致、という二つに分ける補修を依頼した。初回4はこの補修後に解決確認する。

固定source別worktree33d06bd8のclean保証は主担当報告であり、私がGit操作や新runを実行して確認したとは主張しない。最新補修の再確認待ち。

## 最終補修確認

browser最終SHA256 `38404d40a0273a0b349abbedd4126963cac6f075d473b28e5723b4296482e190`、migration SHA256 `b35e4517b06db1e7a3622540af2364ba9ab5123387a3a638fce323e8f3360c61`。

残2点を直接確認し解決とした。各part initialContextsはtext/math双方のvisibleRowsと全認定resolvedParts/filled textを保存し、wrongではcertificationそのものの同一性をassertしてからframe/slot/neutralLayoutKeyを照合する。wrongが未来行や認定を変えて比較対象を逃す経路を塞いでいる。正答で認定stateが変わることは許す。

resetでは旧archiveをentry毎に全照合し、他unit・dedicatedの不変も照合する。正当な現在版reset履歴の新設は一件だけ許し、そのkey版とnestedProgressが直前currentLedger全体に一致することを別assertする。履歴の正当な追加を不変比較で拒否するfalse FAILは解消した。

結論：**HARNESS_SCOPED_REVIEW_PASS**。報告した検査上の欠落は解決。これは主browserの実行結果PASSではない。

実結果の読取も限定確認した：`/tmp/w046-ux05-migration-initial/RESULT.json`はsource `33d06bd8df991d7a1549a5ddcfebea919ad90e3f`、script hash b35e4517で13ケースPASS、failures/errors/httpErrors/networkFailures全空、sourceManifest前後一致を記録している。私による新規実行ではなく、主担当の実出力の確認である。

通常KaTeX寸法probeの倍率/5px差については主担当・Bが診断中であり、主browserの原FAILを保持する。単にharnessが了承されたことで自然寸法・本人細部受入が合格したとは扱わない。

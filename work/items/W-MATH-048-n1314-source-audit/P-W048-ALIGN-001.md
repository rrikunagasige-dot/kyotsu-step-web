# P-W048-ALIGN-001 — N14同一導出の狭幅左端統一

状態：具体案・未承認・未適用。原P003／SCROLL承認は保持する。今回の追加固定差分と検査補完だけを対象とする。実ブラウザで候補を動かしておらず、公開・本人受入ではない。

現source f752c34e、CI42003044835は機械検査SUCCESS。一方、同じ原JSONでN14 Q10/Q14/Q15の同一derivation groupについて、320/390/430pxの導入・結論expression.left=48.375、操作行41.1875、差7.1875pxを確認した。1440pxは全行436.375で一致。前run42000682233にも同値があり、前runの遷移FAILと今回の意味的な整列不適合を分けて保存する。

firstMathは最初のKaTeX HTML要素の矩形で、glyphの画素や文字Rangeではない。expression自体にも同差があるため、字体の左余白だけによる差ではない。原global.cssとTextbookFormulaは元source f129と完全同byte。旧r10の導入・操作・結果の式parts／derivationIdも保持されている。旧版の狭幅padding非対称を新しい左寄せ契約で解消し切れていなかった。旧r10 DOM座標、glyph Range、root computed fontの実測は未取得。

| 候補 | 固定する表示 | 操作部品・幅への影響 | 判定 |
|---|---|---|---|
| A | W048新revisionの≤430px、Q10/Q14/Q15各groupの全formula行をpadding-inline:0へ統一 | 既存の操作行幅・三slot・grid折返しを維持。導入・結果の式開始を約7px左へ移す | 採用候補 |
| B | 同じ操作三行だけpadding-inline:.45remへ戻す | 操作行の有効幅が約14px減るため、既存の大きい選択buttonと二行gridの収まりへ追加影響 | 不採用 |

Aは同一導出の左端一致を回復しながら、狭い画面で意図的に確保した操作行の幅を変えない。学生が途中の三辺操作を読み、各slotを選ぶ既存契約を優先する。導入・結果も同じ式groupの内側に残し、本文、段落、元図、行順、採点、保存を変えない。字号を縮めて合わせない。

製品差分はTextbookUnitPage.tsxのw048ScopedStyleへmedia ruleを追加する一件。対象はW048 classがあるN14r11の三groupに含まれるformula行だけ。r10・他unit・N14の他group・431px以上・desktopは変更しない。各selectorの詳細度(0,4,0)は既存の狭幅操作行(0,3,0)と通常導出行(0,2,0)より強い。grid、choice、KaTeXの指定は追加しない。

検査候補はverify_n14_extended.proposed.mjs。四幅で三groupの現在可視なexpression.left群を比較し、delta≤1pxを要求する。未回答・途中・完了をpending/resolved markerで記録し、各groupの三状態coverageを要求する。既存の41判断、全実表示誤答を含む基本検査経路、44二値mask、r1〜r10×未完／完了20保存、18px／20式番号、scroll／図／reset／実遷移の判定を保持する。root computed font／padding／式行矩形も追加記録し、firstMathやglyphと混同しない。

原JSONはgzipからbyte完全復元できる形で保存した。PROVENANCE.jsonにrun/source・原report/image ZIP digest・原JSON SHA256・抽出SHA256を結合し、MEASUREMENTS各gzipに四幅の全関連state formula objectを欠落なく抽出した。旧runのFAILも消していない。

PATCH.jsonとDIFF.patchが具体差分、STATIC_CHECK.jsonがモデル祖先でのCSS cascade／構文／範囲検査。静的PASSは実DOMや実寸PASSではない。候補適用後には四幅の未回答・誤答・途中・完成、44mask、字サイズ／番号／欠け／button操作領域と旧revision非適用を実画面で再検証し、非作者審査を取り直す必要がある。

適用は二経路に分ける。PRODUCT_PATCH.jsonはPage一fileだけで、既存native限定patch adapterへ渡す。VERIFICATION_PATCH.jsonはWork内検査script一fileだけで、既承認CI検証code更新経路へ渡す。full PATCH.jsonの二つのafter_textからbyte完全一致で派生し、対応hashはPATCH_LINKS.jsonへ固定した。Work scriptをnativeのproduct patch hashへ黙って追加しない。いずれも未適用。

Pageはサービスimport closureに含まれるため、適用時のnative receipt失効を正規に処理する。台帳やguardを変えて既存PASSを維持しない。公開技術binding草案のsource／Page／検査hashも、補修後の同じ実sourceへ別途結合する。

## 今回の承認対象と再開手順

固定教材案P003／SCROLLの内容承認を保持したまま、次の追加差分への承認を求める。

| 適用区分 | path | before SHA256 | after SHA256 |
|---|---|---|---|
| native製品patch | `src/pages/TextbookUnitPage.tsx` | `0a0e628e2c0ce1dbb1d87304d264e8772da2c9ac0184be89959585e2309c7af1` | `77d52186d55c949a088f5629dcfb8f5bb93e033f04a7748f6d9c21fd8c72b2b7` |
| CI検証code | `work/items/W-MATH-048-n1314-source-audit/ci-review/verify_n14_extended.mjs` | `8544a3d3f871eb1904bac43f8b901cd0d30c829d20d9c6b8abf632f2fb21b9b0` | `3fbe3cdb9c8a058f8f96364b3c0a7237e117f747779f5dfc1be0e19390d1c41c` |

PRODUCT_PATCH.jsonのSHA256は `5d0169f7cc58d4ed3f4dee8e7b41ffc5bfb3b312035b87f5103e37af34ad149d`、VERIFICATION_PATCH.jsonは `1e15e5b437cf9b253c848df1be706d2fba1ff8f5acc897ae4cc19ecbf352ecc1`。二afterの全文とfull patchの対応はalignment-review/PATCH_LINKS.jsonに固定。

1. 新しい固定差分を原P003／SCROLLの保持範囲と区別してnativeに登録し、新指摘・原因・影響・具体案を照合する。同じ承認の再要求、guardの緩和、適用済み差分の二重適用を行わない。
2. 二人の必要な再審査と承認hash照合を通した後、Pageの固定差分をnative限定patch adapterで適用。検証scriptは既承認CI経路で更新する。
3. 既存公開GitHub作業branch `work/n1314-source-audit-20261104` へこの二つのコードだけを保存し、同じ実sourceの四幅・未／誤／途中／完成、44mask、全旧保存、原図、18px、式番号、scroll、reset、実遷移、保護範囲を再検査する。台帳・会話・原証拠一式の公開送信はこのコード二file保存に含めない。
4. Pageの共有import closure変更で失効する検査・審査を正規に取り直す。A/Bの実画像・教材審査とG2へ進む。公開設定の草案は補修後sourceへ再結合し、後続の具体技術範囲として判断する。

固定after hashが現在の承認済みPage差分から変わるため、未承認のまま製品へ適用しない。今回の承認は補修の実装・検証を対象とし、本人アプリ受入・教材の品質肯定・公開完了の記録は後続の実証に基づく。

Aの非作者静的審査はalignment-review/REVIEW_A.jsonに保存。132ケースはCSS cascadeのモデル検査であり、実画面の改善成功を先取りしない。

補修候補の表示コード作者はB。適用後は作者履歴を保持し、Aを非作者の表示審査へ、Bを変更していない本文・数理等の審査へ割り当てる。主担当Mの統合も審査対象とし、同じ二人の役割交代を新しい独立モデルとは称さない。

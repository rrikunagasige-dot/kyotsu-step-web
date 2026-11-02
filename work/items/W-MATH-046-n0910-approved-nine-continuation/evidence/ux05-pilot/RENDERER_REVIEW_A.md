# UX05 共有renderer 非作者コード審査 A
担当 /root/w046_source_review。Bの共有rendererを非作者として読取審査。私の教材/保存実装の自己PASSではない。
## 固定対象
|path|SHA256|
|---|---|
|src/components/textbook/nestedMathTemplate.ts|e6f9c21d31ad2dc0192ccead526359011079b3864be6d9e4f1810a4b4e42bf77|
|src/components/textbook/NestedConstructionMath.tsx|1bd91a39e382fe73fffd67170fb3fc7be8beec4e36f53002f3f6f14baf6dce9e|
|src/components/textbook/nestedMathGeometry.ts|bd1eab249c57ac8308327b1cacc27e928a94b2dcf29d56087d53de12c5c12256|
|src/components/textbook/ConstructionLessonReadingFlow.tsx|1ef02e85a6547f055dbbf0626b604e1e0193313d742f527ae50ed7503fdd2128|
|src/domain/nestedLesson.ts|090c6c7dd9a24173f5accb9aee48b8786e344933fc8555fe791494af5b919f09|
|src/domain/compiledNestedLesson.ts|a2c64fef736e78e0f12df3c50fe2d8c710b83e0b9cfa96f6f1f8d819a453054d|
|src/components/textbook/construction-lesson-reading.css|c0580689710aebdd458fdef015b70fbc563372f6da6622da4d1bc78cd76f53a0|

## 結論
SCOPED_SOURCE_REVIEW_PASS。読取範囲でblockerなし。新たなbrowser検証・通常KaTeX実寸一致を私が実行したとは主張しない。
- compileNestedMathTemplateは候補存在/認定値/mirror証明の検査後に、certifiedのslotとmirrorを閉じた通常ASTへ戻す。resolvedPartsはkey/path/value/sourceを保存。認定済みには44pxのslotを作らず、未確定・誤答だけが全候補中立frameを保持する。単独＋/−をmord箱へ押し込まず、周囲のTeX文脈へ入れる。
- readonlyが未証明partを受け取れば拒否し、interactiveの混在行は未確定だけ操作を残す。根号・分数・累乗のAST束縛を維持する。WeakMapで本体compiler/DOMを照合し、別bundleの似たDOMを根拠にしない。
- NodeRowsのplanning入力は実可視public rows/partsだけ。expectedと未来の答えを渡さず、認定値だけvalues/certifiedKeysへ渡す。neutral helperは未認定valuesを除外。全候補の中立予約と、認定値の自然幅を状態ごとに再計画する。
- signatureは可視rows・認定values・certified集合・幅・envelope・break・実font/loadedFacesを含む。font ready/loadingdone、resize、状態変更で再計測。root semantic break以外へ無断分断しない。
- mathLinesは一候補一採点値を保つ表示専用配列。compiled loaderで非空・文字列・読み上げdisplay・閉じたLaTeX文法を検査。public projectionは明示whitelistし配列を複製、正答印/feedback/misconceptionは公開候補へ漏らさない。choice buttonは単一で、式の二行を内部表示しaria-labelで全条件を読む。
- TextRowの正答/誤答とfooting消去は既存ordered-correct projection契約を使う。授業や保存の改訂IDを勝手に増やさない。

## 小所見の処理
NodeRowsがNestedMathPart.kindへprompt文字列を渡す既存実装をBへ照会。これは既存ariaラベル（kind＋の空欄）の用途で、採点用domain/choice kindは別保持。今回の自然AST/enum表示へ影響なしと確認し、命名整理を本scopeへ追加しなかった。

## 残る実証
正答後の通常KaTeX実寸/括弧比較、四幅、全誤答、実font/HTTP、保存・旧版/resetのruntime実証は主担当の固定SHA別worktree browser検査へ渡す。CODE sourceの了承を本人細部受入・公開・Goldへ読み替えない。

## 実browser原FAILを受けたroot relation marker補修

旧sourceの読取PASSと主担当の通常数式寸法FAILは履歴として保持する。通常probeの文脈を揃えた後にも残った約5px差を、Bはroot relation内のmrel→ordinary phantom間のTeX glueと診断した。以下の最小補修を非作者として直接確認した。

|対象|補修後SHA256|
|---|---|
|src/components/textbook/nestedMathTemplate.ts|446db868ff28c0036cb9c0ec1b3954c82fbe495510e418876f28693ab9042633|
|src/components/textbook/nestedMathTemplate.test.ts|39d773d4e3326e0e24d559bd23133b8a7998a26dca94cdaa578eba7597bb56ba|

root markerは一つの外側mrel内に、実関係記号/slotのmrelとゼロ寸法markerのmrelを兄弟として置く。ordinary phantomを実記号の直後へ置かず、関係記号同士の内部glueを作らない。外側は従来どおり関係記号のTeX種別を保持し、認定slotの自然AST・未確定44px・mirror証明・閉文法の契約を変えない。

binderはmarker直近のmrelではなく、その共通親mrelを返す。兄弟二要素、前が実mrel、末尾がmarker mrel、root内所属を検査し、前段のbindNestedMathSlotsでcompiled DOM全体の一致も検証する。実記号/slotとゼロmarkerの共通親を測るため、markerだけの中心を等号軸と誤認しない。

新回帰は同じmarked compiler同士の比較に留めず、markerなしrenderClosedMathのmspace profileと比較している。因数分解の確定式、未回答/誤答/認定済みのrelation slot、certified mirrorで、余分な内部mspaceがないこととbinderの実記号・marker所属を確認する。B報告の関連40unit PASSは作者の実行結果として扱い、私が重複実行したとは記さない。

**SCOPED_SOURCE_REVIEW_PASS（補修後）**。読取範囲のblockerなし。最終Git source固定と四幅の実寸/括弧・幾何・操作の再実行が必要であり、5px原FAILをこのコードレビューだけで実行PASSへ変更しない。

## 最終test型注釈へのhash追従

最終test SHA256 `89c52bfb4eab341a2db262e5aa839b0725a6f739c01db365d79bf47a7fc72703` を直接読取確認。initial/wrong/resolvedの三状態配列を `const states: { values: Record<string, string>; certifiedKeys: string[] }[]` と明示し、その同じ三状態をfor-ofへ渡す型注釈の追補である。markerなしordinaryとのmspace比較、slots0、resolvedParts、実関係記号、共通親marker所属、内部mspaceなし、mirror比較の全assertは保持されている。

runtime `nestedMathTemplate.ts` SHA256は `446db868ff28c0036cb9c0ec1b3954c82fbe495510e418876f28693ab9042633` のまま。旧test39dのレビューと原FAIL履歴を消さず、この最終test hashを追加する。新しい製品編集・試験の再実行は行っていない。

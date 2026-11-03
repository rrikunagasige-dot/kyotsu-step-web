# P-006 承認後の限定実装・検査手順

この文書はHowの詳細。内容の固定案はPROPOSAL.mdと2candidate IR。本文・穴の設計を追加しない。

1. 現N11/N12 artifactと85回答契約を固定保存。candidate IRを既存compileIRへ渡し、現在のpost-compile整列を再生成で消さない。before/afterの必要差分だけを現presentationへ合成。元のW036 materializerの承認チェックは変更しない。
2. N11 authoredのbytesが変わるので、既存n11TransformationPlan/compileTransformationPresentationでbindingを更新。第5・6段階の数学・row/slot・番号は完全同一、gradingHashは同一でなければ停止。単なるhash文字列差替えは禁止。
3. N11の局所計算→全式合成とN12三辺の単一paragraph slotを代表に限定実装し、未回答/誤答/部分正答/完成/履歴の四幅を測定。承認済み範囲内で全11nodeへ適用する。
4. 関連型/strict KaTeX/学習表示/全85回答と全誤答/保存・再読込・履歴・旧版移行を新固定sourceへ結ぶ。採点契約が一致しない場合は版据置を強行しない。原図5点とN09/N10ほか保護manifestを照合。

## 凍結済み旧Workの検査と現版の検査

W036のimplementation.test.tsx内のmaterialize --checkは、旧W036承認済みleafと現在のactive authoredのbyte一致を検査する。新しい承認済み本文へ置き換えた後まで同一byteを要求するテストではない。

- 旧W036の生成器・承認・IR・テストを変更せず、exact旧基準6b439 worktreeで凍結再現を実行して保持する。
- 新版ではW047内の現在candidate→compile→限定合成の対応、安定採点・保存/旧履歴、実表示を検査し、旧byte固定assertionだけを「現leafの内容承認」の証拠へ流用しない。必要な現在版の回帰はW047のscope内へ置く。
- テストの実行対象と原FAILを明記する。旧テストを削除・弱体化して全体PASSへ見せない。もし実際の挙動上の回帰なら修正へ戻す。

## 工程と外部操作

main WORK_SYSTEM§11/12A、固定案の範囲、非作者のR07/G2を照合して既存公開経路へ進む。Work版P004の公開規則をmainに採用した扱いにしない。本人の実物評価とCODEの技術成功を分ける。新しい本文自動生成engine・原Word改変・全ユーザーreset・モデル学習は行わない。

N12のn12-06/n12-15はKEEP。既存materialize.mjsのindependentFunctionRows（comma+\\spaceも区切る）とafterの独立行後処理、番号一つを保持する。後処理前compiledを最終Authoredへ全面置換しない。n12-15はT(11)=3200円 / T(12)=3250円の二行のまま。

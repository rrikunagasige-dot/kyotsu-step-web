# UX05 自然式幅5px差 — root identity marker診断・補修

担当: /root/w046_render_review（共有compiler作者）。原実browser FAILはrootの固定source `33d06bd8df991d7a1549a5ddcfebea919ad90e3f`、compiled `dedfd7c553c2c0186bf7bdbc881bba51649741dbe330e0c854c11dce7822a813`。
原RESULT: `/tmp/w046-ux05-browser-probe-fixed/RESULT.json` SHA256 `44e8d1b59948a631f65aa9423e87a25a1bc1e47a686aeb3b20c105e5d4143607`。

## 原因の区別

最初のnormal probeがKaTeXの1.21倍font-sizeを受けた比較はharness文脈の不一致。rootがprobeをnested-math-shellの同じ18px文脈にして原結果を別保持した。その補修後もactual150.9375×21px、marker-free通常145.9375×21pxの5px幅差が残った。括弧4個は両方7×21px、slots0、resolvedPartsは正常。今回の残差は44px slotやフォント未ロードの症状ではない。

Node24で同じKaTeXのHTMLを比較し、通常にあるmspace6個に対し、旧compilerは7個であることを確認した。markRootの内部は`\mathrel{=\phantom{...}}`であり、relationの直後にordinary atomであるphantomを置くため0.2778emの内部glueを発生させる。18px×5mu=5px。identity marker本体はzero幅でも、その前に自動挿入される関係記号間隔が数式幅を変えていた。

これは製品側のmarker注入の実欠陥。従来のunitが比較したordinary compileにも同じmarkerがあるため、同じ不具合同士のHTML一致では検出できなかった。原技術PASSはこの通常描画との幅一致を証明していない。

## 最小補修

root relationの本体とzero markerをそれぞれmrel種別の兄弟として同一のmrelへ入れ、内部の余分なrelation→ordinary glueを作らない。root binderはmarkerを含むzero mrel自体ではなく、その兄弟として本体を持つ共通mrel親を返す。全DOM exact bindingに加えて、親がmrel/子2個/最後がmarker側/最初がmrelという生成構造も検証する。marker/WeakMap/AST出所の証明を削らない。

製品変更は`src/components/textbook/nestedMathTemplate.ts`のmarkRootとbindNestedRootRelationだけ。教材/正答/採点/保存/compiledHash/依存/lock/geometry validatorの許容値は変更しない。source変更には新しいGit候補SHAとその実browser証拠が必要で、33d06の旧FAILを上書きしない。

## 検証と失敗保持

- unitはmarker-free `renderClosedMath`とmspace profileを直接比較し、普通の因数分解で通常6/旧7/補修6を確認。root carrierの本体＝とmarkerの共通親、未回答/誤答/正答のrelation slot、認定mirrorを検査する。
- `/tmp/w046-ux05-root-marker-tests-v2.log`: 関連3file40unit PASS。
- `/tmp/w046-ux05-root-marker-native.log`: native7 PASS。
- `/tmp/w046-ux05-root-marker-lint.log`: 変更lint PASS。
- `/tmp/w046-ux05-root-marker-types-v2.log`: tsc-b PASS。
- `/tmp/w046-ux05-root-marker-tests.log`は初稿の閉じ括弧過剰による原FAILとして保持し、v2で構文補修済み。
- 新しい回帰の空object union型は`types.log`へ原FAILを残し、明示Record型へ補修。製品sourceとは別のtest型修正である。

最終実寸/四幅の合格はrootの新source実browserで確認する。本文書はsource診断と単体回帰の作者報告で、非作者表示審査・本人細部受入ではない。

## 補修file hash

- `src/components/textbook/nestedMathTemplate.ts` SHA256 `446db868ff28c0036cb9c0ec1b3954c82fbe495510e418876f28693ab9042633`
- `src/components/textbook/nestedMathTemplate.test.ts` SHA256 `89c52bfb4eab341a2db262e5aa839b0725a6f739c01db365d79bf47a7fc72703`

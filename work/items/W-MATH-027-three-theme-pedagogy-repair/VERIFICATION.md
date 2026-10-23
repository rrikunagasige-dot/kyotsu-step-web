# W-MATH-027 verification

Status: VERIFYING. Gate① pending. No Gate②/③ acceptance or main/public release.

The fixed student patch is checked by SHA256 against PATCH_P001_R1.json. Vite loads actual validated data and compares both development units with the frozen baseline: all content except two existing intro prefixes, revisions, unit/item IDs, answers, hints and figures stay identical. Result:16 units,233 original questions,315 operations; groups122/77/116. Fourth card removed without content loss.

Dedicated CI39984857012 at9266dcbed105658592411741f753814a337dc681:33 unit checks and11 browser checks passed,3 intentional project/viewport skips. Initial catalog PNG rejected because of navigation overlap. These are historical results, not final unobstructed Gate① evidence.

Current checks include actual320/390/1440 viewports, three complete unobscured cards, both H1/bridge paragraphs, saved current-revision answers, resumption at NE01/NE02, N06→NE01/N10→NE02, original unit URLs and topic-end return. Existing full math CI also checks schema, source questions, old accepted blocks, physics and math-practice regression.

Final tested SHA/run IDs and original PNG hashes will be archived separately so the tested source stays frozen. Technical PASS never substitutes for the user's Gate① or Gate③.

## Final verified checkpoint — 2026-10-24 JST

最終固定SHA f3c69618d5f97cf235d2f0d0d9256f33056e9525: dedicated39986137882、governance39986143584、preview39986143461、Math39986143673はいずれもSUCCESS。専用33単体/11ブラウザ合格、3件は意図的端末条件除外。原PNG9枚・SHA256・CI参照はevidence/gate1-p001-r1に保存。履歴の失敗は削除せず保持。Gate①/②/③の受入は未完。

## Gate② and first body proposal — 2026-10-24 JST

Gate①視覚確認を記録。Gate②は章本文の既知欠陥と未検証面があるため未合格。今回の原差分再取得でsrc/public変更4件を確認。P-002-N02-R1は提案のみ。20本の恒等式を整数係数で厳密照合し、10穴の正答・誤答型/重複を検査。修正後の履歴移行・実UI・318操作は未実装のため検証済みとはしない。

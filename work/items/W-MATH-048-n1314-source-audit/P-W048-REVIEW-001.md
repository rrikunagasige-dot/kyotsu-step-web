# P-W048-REVIEW-001 — 情報露出を明記した非作者再審査

状態：未承認・未適用。教材P-W048-003とCI承認は保持。

R03影響確認は完了し、次はR04_PROPOSAL@n13。現在のA/B二人は設計理由を既に読んでいる。workflow/team.pyはsourceFirstで露出false、firstPassで同一assignment/packetの所見を要求するため、旧所見を現在版の未露出初回審査へ付け替えられない。

## 固定変更
W-MATH-048のteam policyだけを変更する。R04_PROPOSALのteaching/layout、R07_SEMANTICのimplemented-visible、G2_AUDITのintegrated-releaseの計四scopeでsourceFirst/firstPassのみtrueからfalseへ変更。正確なJSONはREVIEW_POLICY_PROPOSED.json、照合結果はevidence/REVIEW_POLICY_CHECK.json。C05/C09、他Work、共通engineは変更しない。

## 維持条件
A/B二人、孫禁止、M単一writer、非作者独立審査を維持。情報露出はtrueと記録し、現在のsource/input/対象/証拠に結び付けた所見を各自固定する。Aは原典・数学・推導、Bは表示・保存・実画面、CODEはハッシュ・数式・移行・幅・CIの定型検査、Mは統合と登録を担当。各回、原典から現在の教材本文・判断順へ直接照合し、P003説明文だけで合格を決めない。R07/G2でもAの数学・教材意味所見を現在版へ固定し、BやCODEで代用しない。旧初回所見は歴史証拠として保持し、今回の盲検・初回審査とは称さない。未解決指摘や証拠不足を合格にしない。

## 承認後の適用
既存adopt-team-policy経路で専用承認とpolicy hashを登録。残claim/subtaskを実態に従って整理し、失効対象を再検証する。教材差分の再承認・N13再patchは不要。R04、既承認照合、R06記録、R07、N14正式適用と検査、G2以降へ進む。公開・本人受入は各工程を満たしてから。

承認対象は上記四scopeに限り、未露出初回審査の要求を情報露出を明記した現在版の非作者再審査へ変更すること。承認までは正式R04以降の合格登録を行わない。

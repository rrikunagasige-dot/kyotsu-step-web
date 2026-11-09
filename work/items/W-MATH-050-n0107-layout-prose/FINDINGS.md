# Current record reconciliation — W-MATH-050 / FINDINGS.md

Status: RECORDED
Record-Scope: Metadata/provenance restoration only; no product or Store mutation.
Fixed-Candidate: 84f90ba9d6c7fea8ebbaed976fc0de68aaa0c91b
Work-State: BLOCKED

Historical record recovery remains blocked: exact current scope/approval/verification mapping is incomplete; no approval, completion, or learner acceptance is inferred. Parent W050 gap marker is not closure; REVALIDATION/ROLLOUT sources are distinct related evidence.

Evidence: existing fixed-candidate historical text below where present. Missing exact approval/closure provenance remains unresolved; do not substitute filename or informal positive wording.

Original-Body-Source: existing untracked physical recovery record
Original-Git-Body-SHA256: ABSENT
Original-Physical-Body-SHA256: 196ae1af42411a8ea6f1133b2c675cc19dafd5af2fa28b9e62110fdb1295d814

<!-- HISTORICAL ORIGINAL BODY START — bytes below preserved exactly; current metadata is above -->
# W050 findings — current and retained evidence

| ID | 判定 | 内容・根拠 |
|---|---|---|
| F01 | CONFIRMED | N01〜N06はcompact62stage、N07は専用14stage/41node。INVENTORY.jsonとLAYOUT_B.jsonへ固定。全287判断。 |
| F02 | CONFIRMED | N02の定数項に文字部分を残す指示があり、和・差で不適合。対応promptも同文。TEACHING_A A002/A003。 |
| F03 | CONFIRMED_SOURCE | N04の中央係数2・最後の組み方の一致を先に本文が供給。A007/A008で問いを中立化する案。候補実ブラウザは承認後。 |
| F04 | KEEP | N04pilot21blocks/5判断とN07受入済み専用readerを保持。N07へcompact CSSを適用しない。 |
| F05 | ERROR_FIXED_IN_PROPOSAL | JSON registry分離時のTS2352を実仮想noEmitで検出。runtime型検証へ修正し最終候補は診断0。_02_FAILと_03_PASSを保持。 |
| F06 | ERROR_FIXED_IN_PROPOSAL | Aが旧CSSspecificity不足を検出。限定selectorと後置のmargin規則へ修正。LAYOUT_REVIEW_Aに履歴。 |
| F07 | METADATA_CORRECTED | A001は判断なし、A014は先行3判断後に結果文可視。共通の未回答state説明をMが訂正し旧文を保持。学生向け19pointerは不変。 |
| F08 | PREVIOUS_PUBLIC_CONFIRMED | 元mainFAILを保持した別QAでW048/N04 PASS。N14新390/430記録では読み込み途中0bboxからreadyを観測。元FAIL時の正確なタイミングは推定。既存hosted証拠を参照。 |

提案のsource確認・CODE整合性検査と、実装後の実表示／本人受入を区別する。


## 2026-11-06 — 解決した実行記録の不整合

共有CLIが既存compileIRのwarningResolutionsを渡せない不具合をP003の承認2fileだけで補修した。元compiler警告guardは不変、37実WARNの個別source/gate確認を根拠にする。

準備側のsorted canonicalと既存compilerのJSON/schema key順hashが混在していた。全6IRの値/キー集合に差がないことを実証し、原承認bundle/IRbyte/製品を変えず、既存APIでderived compiler bindingのみ修正した。

6release単位の優先順だとn01 HOST/FINALが他5のG2より先になり、全6検証後に同じappへ公開する条件と両立しなかった。元6block/client factsを保つ単一運用cohortで整合。実13artifact/42pair/公開後6URL/fullscope受入を明示し、原guard・旧原承認・保護対象は保持した。

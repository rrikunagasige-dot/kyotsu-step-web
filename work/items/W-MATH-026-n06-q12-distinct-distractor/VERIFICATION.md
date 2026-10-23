# W-MATH-026 — Verification
Status: APPROVED

## 2026-10-23 JST — exact P-001 approved, execution deferred
ユーザーは本チャットで、3案の全文リンクと変更内容を示し「この3案を承認し、Q03から1問ずつ進めてよいですか？」と明示した直後に **「いいよ続けて」** と回答（2026-10-23 JST）。対象は9ef406823375a267d13d493c2a3c57af5e938bebで固定したW-MATH-025/P-003、P-004、W-MATH-026/P-001の3案。これは前のQ12ヒントGate①への同文回答とは別の承認事象。各案のexact範囲を順番に許可し、一括実装・Gate①省略・main統合/公開は許可しない。
先行P-003 Q03、P-004 Q06の各Gate①を待つ。sourceと選択肢は未変更、W-MATH-026実装CI/画像は未取得。過去のPROPOSED記録は承認前の履歴。

| Surface | Result | Evidence / limit |
| --- | --- | --- |
| Current Q12 original-source boundary | PASS (read-only) | Word paragraph271、protected source SHA/hash in P-001 |
| Old wrong[0] == old wrong[2] | CONFIRMED | Commutativity + exact integer x,y coefficient multiplication |
| Proposed four distinct polynomials | PASS (proposal math only) | correct / existing wrong0 / existing wrong1 / proposed wrong2 pairwise coefficient dictionaries differ |
| History/revision design | INSPECTED | Same-revision effectiveTextbookProgress retains ledger; removed old wrong value remains historical; implementation verification pending |
| Implementation / schema / actual Chrome / 320-390-1440 / restore / regression | UNVERIFIED | Proposal unapproved; no learner code edits, CI or images from this new fix |
| Same-root other artifacts | UNVERIFIED | Impact set in FINDINGS; no blanket clearance |
| User Gate① / overall Gate② / Gate③ | PENDING / OPEN / FINAL-REVIEW-NOT-READY | Prior Q12 acceptance covers its hint only, not this proposal |

## 2026-10-23 exact-source verification plan/checkpoint
Primary W026/P001, approved one-string correction. Source SHA/CI run PENDING until commit. Branch `work/W-MATH-026-n06-q12-distinct-distractor-20261023` from44e42bf42d065057d54785d6bbe578ef9b4cbb5b; main remains15ae503455bc6ae75b080caa1c4919cafb250027.
- Learner diff: q12 wrong[2] only; all other source fields, key, hints, revision3 protected. Local audit PENDING.
- Integer coefficient comparison: old pair equivalent; new 4choices distinct; source polynomial x³+x²y+x²+xy−2x−2y matches exactly one. Local audit/Native unit PENDING.
- Browser: 320/390/1440 × normal/review. Choice display/new wrong/retry, old removedwrong ledger restore/firstValue and attempt retention, previous11 unchanged, Q13 gate, full16 completion/reload, no preview persistence. PENDING.
- Type/lint/build, review boundary, math/physics-textbook/math-practice regression: PENDING native CI. Prior W025 PASS is historical only.
- Q06 hint human Gate①: BLOCK-VISUAL-OK by latest direct approval; frozen evidence retained.
- Q12 choices Gate①: BLOCK-CHECK-PENDING, wait for approximately5-item delivery, no per-question human interruption.
- Cross-block Gate②: OPEN (three new unapproved hints + required UNVERIFIED surfaces). Gate③ FINAL-REVIEW-NOT-READY.
Return on SUCCESS: inspect actual images/logs and record exactSHA/runs, keep grouped human review pending. FAILURE: diagnose primary, repair only approved scope; CANCEL/TIMEOUT is unverified, 403 stops/report. No independent learner edits while CI.

### Local pre-commit result
PASS: Node24 syntax checks for new TS unit/E2E; exact source diff is one wrong[2] string; 16 original items and revision3 retained; both workflow YAML files parse, new capture is branch-limited and accepted Q06 capture disabled. Independent Python integer-coefficient expansion reproduces old duplicate and confirms four new choices pairwise distinct with exactly the source polynomial as key. Native runtime/UI CI remains PENDING.

### FAILED initial native run — retained, not erased
Source fe9a7301dbcd4d4c386418c9937c4da5effd537b:
Governance39899834019 FAIL (status string), Review39899834095 FAIL (new test syntax; existing35 tests PASS), Math39899834012 FAIL (same test lint). Captures not executed, so no visual or full-regression PASS.
Corrections: canonical VERIFYING status; remove extra closing parenthesis by naming answerSignature. Learner-source, renderer, schema/history unchanged from first W026 commit. Prior local Node --check syntax PASS was insufficient and is superseded by the native failure. Revised native results PENDING.

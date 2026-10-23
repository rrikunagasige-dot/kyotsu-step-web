# W-MATH-025 — 因数分解ヒントの同根先出し残留
Status: VERIFYING

## 2026-10-23 JST — authoritative Q11 visual acceptance and Stage B checkpoint
- Direct user response **「続けていいよ」** immediately followed this chat's Q11 確認① real-image review and explicit request for `細部OK / 要修正`. This is **Q11 BLOCK-VISUAL-OK**, not a fabricated literal `細部OK` quote, not Gate②/③ or release permission.
- Accepted original Q11 IDs: `n05-11`, `n05-formula-11`, review target `n05-q11`; original screenshot source `26c6e82130e52ff89a7bec352ec785aed2a062ad`, immutable images `eb7d99d0901562b7909e89903af01483f6aa23c1`. Reviewed current predecessor `aa6758fa8a8a8656a9c10860bd3815e4c51de57c`; all three source-head CI successes independently rechecked. Retain old evidence/history; hide only Q11's accepted marker and stop its recapture job.
- Stage B uses existing exact **W-MATH-025/P-002** approval (prior verbatim 「承認続けて」 for both proposals). Sole learner source mutation: `src/data/textbook/math/numbers/n06Lesson.ts` q:12 hint `2と−1なら和は1、積は−2。` → `積が負なので二数は異符号。和が正なので、絶対値の大きい方が正になる。元の因子(x+y)も残そう。`.
- Word source SHA256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`: N06 heading paragraph 248, Q12 paragraph 271, original Q01–Q16 confirmed including OMML. Actual N06 revision3 has **16 original questions / 16 graded items**, not the stale handoff shorthand 15; no source/revision/IDs/options/answers/progress edits.
- Existing same Work feature branch / Draft PR #115 retained; parent `aa6758fa8a8a8656a9c10860bd3815e4c51de57c`; base PR remains accepted W-MATH-024 branch. Preserve N05 Q11/Q18, N13 Q05/Q08 and all other learner code. Separate W-MATH-022 N14 Q16 Gate① remains pending.
- Verification-only surfaces: one N06 review target, review boundary assertions, actual Chrome test and Q12 capture in its own `evidence/gate1-q12/` folder at 320/390/1440. CI source/run IDs initially **PENDING**, to be recorded from actual GitHub results; no invented PASS.
- **Next:** obtain actual CI and original Q12 images; inspect Japanese/formula/hint; present only Q12 確認① for user Gate①. Same-root second pass / Gate② OPEN, Gate③ FINAL-REVIEW-NOT-READY; main/hosting unchanged. Sections below retain historical snapshots and are superseded by this checkpoint on current state.

Command: CMD-WORK-001 修正
Date: 2026-10-23 JST

§12B correction-first。N05 Q11 と N06 Q12 に、誤答後ヒントがまだ求める整数組を直接教える同根問題を確認した。**このWorkは調査・exact提案書のみ**で、source、review marker、figure、schema、progress、CI、公開環境は一切変更していない。

[独立原因記録](./FINDINGS.md)、[P-001](./PROPOSAL_P001.md)、[P-002](./PROPOSAL_P002.md)、[正規Proposal](./PROPOSAL.md)。両Pは別個の修正範囲で、片方の承認は他方の実装許可ではない。W-MATH-024 Q18のGate①、N13 Q05/Q08 Gate①は再承認しない。先にW-MATH-024とN13の正確な現在地を再確認した上で個別に実装する。

## 2026-10-23 JST — both exact original proposals approved, staged sequentially
- The user replied **「承認続けて」** directly to the explicit question confirming **both** W-MATH-025/P-001 (N05-Q11) and P-002 (N06-Q12). This approves the existing exact one-hint-only scope of each proposal, **not** mass changes, merging or release.
- User later replied **「继续」** to continuation. Canonical Work §12A stages each small question independently: **N05 Q11 implementation and real numbered Gate① first**. N06 Q12 P-002 approval is preserved, its learner code remains untouched until Q11 visual Gate① is explicitly accepted; do not ask for P-002 reapproval.
- Implementation branch `work/W-MATH-025-n05-q11-hint-approved-20261023` forked from W-MATH-024 Q18 approved Gate① HEAD `524a26ea9d765d166a42d8324d2f2bead493e4b1`, not from stale W-MATH-025 proposal-only branch. In this Stage A, **the sole learner code change is N05-Q11 wrong-only hint**: `積が負なので二数の符号は異なる。和が負になるには、絶対値の大きい方が負になる。積が−16、和が−6の両方に合うか確かめよう。`.
- New focused N05-Q11 Vitest, a single preview-native `n05-q11` review marker, 320/390/1440 exact-SHA Playwright wrong/hint/retry and normal-mode regression, and GitHub capture CI are verification-only additions. N05 revision2, 20 original source questions and choice keys, original figures and historic progress unchanged. Protected accepted N05 Q18 and N13 Q05/Q08; N14 Q16 separate Gate① pending.
- **Q11 Gate① BLOCK-CHECK-PENDING** until real screenshots pass and user reviews numbered authentic sheet. **Q12 approved but not implemented**. Gate② open for both; Gate③/not yet hosted; no main merge, release or fee.

## 2026-10-23 JST — authentic Q11 Stage A evidence and technical CI reconciliation
- **Approval:** User answered 「承認続けて」 to explicit both P-001 (N05 Q11) / P-002 (N06 Q12) approval request. This authorizes precisely one wrong-only hint sentence per question; Stage A only Q11 is implemented. P-002 Q12 approval reserved and learner code untouched until Q11 human visual Gate①.
- **Q11 frozen real screenshot source SHA:** `26c6e82130e52ff89a7bec352ec785aed2a062ad`; **immutable image commit** `eb7d99d0901562b7909e89903af01483f6aa23c1` (18 original PNGs and README only); [actual Noto CJK Chrome job #39881650791](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39881650791) **SUCCESS** with 320/390/1440px preview+normal, wrong hint/retry and persistence; [single-block Gate① review sheet](./GATE1_N05_Q11_REVIEW_SHEET.md).
- Exactly one original student-visible N05-Q11 hint changed; N05 revision2, 20 original teacher questions, figures and options stay the same, Q18 accepted hint preserved. Review-only target `n05-q11` adds one `確認①`; accepted Q18 and N13 remain without old markers.
- Initial full math CI at source SHA failed due a **Vitest JavaScript -0 vs +0** comparison in the new dedicated polynomial expansion assertion, not lesson data; fixed by numeric difference. Initial governance failed because Work and Proposal status fields were not machine-readable standalone lines; now changed to `Status: VERIFYING` and `Status: APPROVED` respectively. Latest all-suite native CI running; do not claim final PASS before verification.
- **Q11 Gate① BLOCK-CHECK-PENDING**. N06 Q12 P-002 not implemented, Gate② pending, separate N14 Q16 Gate① pending, Gate③ unavailable. Draft PR #115 only, main and published app untouched.

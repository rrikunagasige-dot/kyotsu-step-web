# W-MATH-007 — 式内係数1の正答表示を x にする
Status: IMPLEMENTING
Updated: 2026-10-18 JST
Command: CMD-WORK-001「修正」
Mode: 数学 / 教科書・学習モード
Observed feedback: 「時々1とか代入する場合とかもあるじゃん。これもね1代入したら出てくるのは1xではなくxにしてくれ。時々これじゃ違和感があるんだよ」
Repository: rrikunagasige-dot/kyotsu-step-web, repo ID 1391122224
Baseline: main 066e0da905bf4948e25ec200fe1b46e34d6ed573; N12 W-MATH-006/P-001 visual design merged PR #83; Pages deploy pending at proposal creation.
Scope: N12 / n12-p002-q06-left-coef visible coefficient-one substitution and narrowly shared formula renderer context; impact scan only for other approved math textbook units.
Protected: N12 26 original+local answers/IDs/choice values, figures, mathematical text, derivation sequence, history, titles and acceptance. W-MATH-005 PR #80 draft nine holes and its old 42 answers; unrelated lessons, physics and math-practice.
Approval: P-001 approved by user's 「いいよ続けて」 on 2026-10-18 JST for isolated implementation/tests only; **main merge and Pages deployment are not authorized** for W-MATH-007.
Current: Source review identifies that renderer renders a resolved choice value 1 as its own math span immediately before a following math span x+2\\le4. Result visually reads 1x+2\\le4.
Next: Implement isolated coefficient-one rendering and N12 E2E, verify QA and secondary cross-approved-unit impact, then stop for separate release authorization. Creation and lesson updates stay paused.

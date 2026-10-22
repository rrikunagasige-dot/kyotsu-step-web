# W-MATH-020 — N14 Q15 positive-coefficient division in three-member inequality
Status: PROPOSED
Date: 2026-10-22 JST
Command: CMD-WORK-001 修正, governance/WORK_SYSTEM.md §§12A and 12B.

## Origin and preflight
- Current correction-first queue W-MATH-017/F-017-08: teacher original N14 Q15 requires '係数を1にする操作と得られる範囲'; current N14 Q15 single choice bundles '三辺を正の3で割る' with completed '-2/3≤x≤2', replacing learner transformation with recognition. Source read in live `src/data/textbook/math/numbers/n14Lesson.ts` original Q13→Q14→Q15→Q16. Q14 predecessor is accepted five-hole W-MATH-019/P-001~P-003, target branch Q14 human Gate① accepted with exact 「いいよ」.
- User prefers short ChatGPT inline equation-only visual approval, consistent Q10 and Q14 (one intermediate visual 2-row equation, one explanation, total five graded holes). Teacher source original Q15 and Q16 are separate markers, and source Word raw embedded equation comparison remains an independent audit issue.
- Original N14 Q15 source: `-2\le3x\le6`, source step '三辺を正の3で割る', result `-\frac23\le x\le2`, followed by Q16 substituting x=-2/3 and x=2 back into `|3x-2|\le4`.
- Exact bounded [P-001](./PROPOSAL_P001.md) written only. No source CSS, answers, Q15 code or migration implemented; no PR merge, Pages/public hosting or costs. Do not equate prior Q14 visual acceptance with Q15 proposal authorization.
- Next: display only concise three-equation Q15 sketch in ChatGPT, request the user's approval before one-block code changes. Previously accepted N11/N14 never require reapproval. Gate② cross-unit independent audit and Gate③ exact-SHA playable whole-app user total check remain OPEN.

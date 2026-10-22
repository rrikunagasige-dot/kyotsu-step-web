# W-MATH-022 — N14 Q16 endpoint substitution & absolute-value check
Status: PROPOSED
Date: 2026-10-22 JST
Command: CMD-WORK-001 修正
Source branch: `work/W-MATH-022-n14-q16-endpoint-verification-proposal-20261022`, parent reviewed source SHA `1e3cb0dd3a6d1a86e856ea8cdf625feccdb985a8`.

## Preflight / why Q16 next
Current Gate① N14 Q10/Q14/Q15 mathematics and W-MATH-021 Q15 center-example hint are already accepted and must not be rechecked. Latest parent CI on SHA `1e3cb0dd3a6d1a86e856ea8cdf625feccdb985a8`: Math textbook #39739484503 SUCCESS, governance #39739484494 SUCCESS, review code #39739484449 SUCCESS. Parent draft PR #110 remains not merged, main `15ae503455bc6ae75b080caa1c4919cafb250027` unchanged.

Gate② / §12B previously identified **N14 Q16** as the next confirmed same-root: original one-answer `n14-16` gives both evaluated endpoints at once, and its after-wrong hint directly states both intermediate results. Source Q16 asks students to substitute the endpoints found in Q15 and check `|3x−2|=4`. Mathematical answer itself correct.

## Current action
[Exact unimplemented Q16 P-001](./PROPOSAL_P001.md): two separate endpoint substitution-and-absolute-value checks (six local computations, no already known endpoints re-asked), progressive solution, source mapping/revision plan, and native mobile/desktop and historical persistence gates.

**PROPOSED ONLY. No Q16 code/CSS/test/revision changes in this branch, no PR, no merge or public app changes.** Await new explicit Q16 P-001 user approval. Existing Gate② remains NOT CROSS-VERIFIED until Q16 and other surfaced issues resolve; Gate③ NOT READY, `総チェックOK` not given.

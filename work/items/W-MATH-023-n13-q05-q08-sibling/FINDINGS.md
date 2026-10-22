# W-MATH-023 — confirmed linked findings and source
Status: CONFIRMED OBSERVATION / IMPLEMENTATION NOT APPROVED

## Root signature from W-MATH-022 F-022-01/F-022-02
`makeReviewSteps` uses a single correct-option per authored source question; some independently meaningful teacher steps have been bundled as one completed expression, and after-wrong hints give exactly the expressions still to be selected. This is an authoring decision problem, not evidence of a broken shared renderer.

### F-023-01 N13 Q05
Original teacher Word paragraph 557: two cases to express the distance between x and 1 as formulas (right/left diagrams N13-F01). Current N13 `{q:5}`: one answer `x-1\;(x\ge1),\quad1-x\;(x<1)`, wrong hint states `右側ではx−1、左側では1−x`. These are precisely the two expressions the learner was asked to derive. Conceptually separate judgments are the two side-specific subtractions.

### F-023-02 N13 Q08
Original Word paragraph 566: `絶対値を使わない条件にし、解を求めよう。` Current source `{q:8}` chooses one combined answer `3x=6 または 3x=-6, x=2 または x=-2`; after-wrong hint explicitly says `3x=6か3x=−6かを解く。` It gives away the required sign-split, leaving no graded branch-to-root derivation.

## Prior user approvals and migration safety
N13 revision2 already contains a historical R5 correction/migration that archives revision1 and reopens n13-08. That approved source state is the starting point, never erased. Future v2→v3 migration must archive entire v2 answers, reopen old n13-05 and n13-08 because semantics change, preserve all unrelated items and v1 archives. P-001's one-step 9→12 proposal conflicts with its own required sequential Gate①. Revised P-002 proposes **Q05-only 9→10 at revision3**, followed only after Q05 user Gate① by **Q08 10→12 at revision4**. Preserve existing v1→v2 R5 archival migration; at v2→v3 rekey only n13-05, at v3→v4 rekey only n13-08; preserve older archives and unrelated answers. Both stages unapproved and unimplemented. Actual implementation and technical QA: NOT STARTED.

## Open impact and uncertain siblings
N08 Q05 after-wrong hint gives squared operands but may be a legitimate prerequisite, so UNVERIFIED as a defect. N05 Q18 gives candidate factor values but needs a separate source/context judgment. No blanket authorization to modify them. N14 Q16 source technical-pass and Gate① pending; N14 Q10/Q14/Q15 protected.

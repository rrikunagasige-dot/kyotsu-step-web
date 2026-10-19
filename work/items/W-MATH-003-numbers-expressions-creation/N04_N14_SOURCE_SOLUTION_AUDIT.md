# N04–N14 original Word vs app keys — Gate② source comparison (2026-10-19)

Status: **SOURCE-REACQUIRED / SOURCE-COMPARISON FAIL**. Evidence-only audit on approved independent branch, not approval to correct, merge or deploy.

- Original teacher-edited `01_数と式_教科書モード_対話段階導入版_v2(3).docx`, 212,863 bytes, SHA-256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`; matches historical source.
- Re-read eight entire original unit bodies N04,N05,N06,N07,N08,N11,N13,N14, including the 123 Word Q markers, comparing each requested answer/cognitive operation with the pre-answer app lead, prompt and key at code SHA `aa1c6a748665f34462a08c2b4a1641d5164d5e92`.
- 123 original Word markers and 127 authored app choices (N04-Q01 = five local choices); original separate answer booklet remains unavailable. The inventory below **transcribes** actual app keys and is not an official-answer proof or a substitute for independent algebra derivation.
- All nine original embedded PNG bytes independently SHA-256-checked against `newBatchCoverage.test.ts` asserts: Word `image2,3,4,5,7,8,12,13,14.png` → app N04-F01, N05-F01/F02, N08-F01, N11-F01/F02, N13-F02/F01, N14-F01, respectively.

## Per-question actual app-key inventory

Key cells are learner-selectable app keys, not complete independently worked proofs. The source fidelity assessment follows the inventory.

### N04 — 22 source questions / 26 choices

| Word ID | App-authored key |
| --- | --- |
| N04-Q01 | 5 sequential choices: `25x^2`, `20xy`, `20xy`, `16y^2`, `25x^2+20xy+20xy+16y^2` |
| N04-Q02 | `40xy` |
| N04-Q03 | `25x^2+40xy+16y^2` |
| N04-Q04 | `a^2+ab+ba+b^2` |
| N04-Q05 | `a^2+2ab+b^2` |
| N04-Q06 | `a^2-ab-ba+b^2` |
| N04-Q07 | `a^2-2ab+b^2` |
| N04-Q08 | `a^2-ab+ab-b^2=a^2-b^2` |
| N04-Q09 | `差の平方：2aと5／和差の積：3xと2` |
| N04-Q10 | `4a^2-20a+25,\\quad9x^2-4` |
| N04-Q11 | `acx^2+adx+bcx+bd` |
| N04-Q12 | `acx^2+(ad+bc)x+bd` |
| N04-Q13 | `3x^2+7x+2` |
| N04-Q14 | `T^2+2Tc+c^2` |
| N04-Q15 | `a^2+b^2+c^2+2ab+2ac+2bc` |
| N04-Q16 | `a^2+b^2+c^2+2ab-2ac-2bc` |
| N04-Q17 | `x^2+1,\\quad x` |
| N04-Q18 | `(x^2+1)^2-x^2` |
| N04-Q19 | `x^4+x^2+1` |
| N04-Q20 | `(x^2+5x+4)(x^2+5x+6)` |
| N04-Q21 | `T^2+10T+24` |
| N04-Q22 | `x^4+10x^3+35x^2+50x+24` |

### N05 — 20 source questions / 20 choices

| Word ID | App-authored key |
| --- | --- |
| N05-Q01 | `y+5` |
| N05-Q02 | `(x-3)(y+5)` |
| N05-Q03 | `xy+5x-3y-15` |
| N05-Q04 | `-(a-b)` |
| N05-Q05 | `(a-b)(x-y)` |
| N05-Q06 | `(4x)^2,\\quad(3y)^2` |
| N05-Q07 | `24xy` |
| N05-Q08 | `(4x+3y)^2` |
| N05-Q09 | `a^2+(r+s)a+rs` |
| N05-Q10 | `r+s=-6,\\quad rs=-16` |
| N05-Q11 | `(a-8)(a+2)` |
| N05-Q12 | `prx^2+(ps+qr)x+qs` |
| N05-Q13 | `pr=4,\\quad ps+qr=7,\\quad qs=3` |
| N05-Q14 | `8,\\quad 7,\\quad 13` |
| N05-Q15 | `(x+1)(4x+3)` |
| N05-Q16 | `s+5r=-2,\\quad rs=-3` |
| N05-Q17 | `rとsは異符号` |
| N05-Q18 | `(x-1)(5x+3)` |
| N05-Q19 | `3b(a^2-4b^2)` |
| N05-Q20 | `3b(a-2b)(a+2b)` |

### N06 — 16 source questions / 16 choices

| Word ID | App-authored key |
| --- | --- |
| N06-Q01 | `X=x+2y,\\quad(X+1)(X-2)-4` |
| N06-Q02 | `X^2-X-6` |
| N06-Q03 | `(X-3)(X+2)` |
| N06-Q04 | `(x+2y-3)(x+2y+2)` |
| N06-Q05 | `T=x^2,\\quad T^2-5T+4` |
| N06-Q06 | `(x^2-1)(x^2-4)` |
| N06-Q07 | `(x-1)(x+1)(x-2)(x+2)` |
| N06-Q08 | `yに注目する（yは1次まで）` |
| N06-Q09 | `y(x^2+x-2)+(x^3+x^2-2x)` |
| N06-Q10 | `x(x^2+x-2)` |
| N06-Q11 | `(x+y)(x^2+x-2)` |
| N06-Q12 | `(x+y)(x+2)(x-1)` |
| N06-Q13 | `x^2+(3y-1)x+(2y^2-3y-2)` |
| N06-Q14 | `(2y+1)(y-2)` |
| N06-Q15 | `3y-1` |
| N06-Q16 | `(x+2y+1)(x+y-2)` |

### N07 — 14 source questions / 14 choices

| Word ID | App-authored key |
| --- | --- |
| N07-Q01 | `0.75（小数第2位で終了）` |
| N07-Q02 | `（0・余り10）→（9・余り1）` |
| N07-Q03 | `2.\\overline{09}` |
| N07-Q04 | `有限小数／循環小数、どちらも有理数` |
| N07-Q05 | `0以外の余りは有限種類なので同じ余りが再び現れる` |
| N07-Q06 | `10x=8.\\overline8` |
| N07-Q07 | `9x=8` |
| N07-Q08 | `x=\\frac89` |
| N07-Q09 | `100x=69.\\overline{69},\\quad99x=69` |
| N07-Q10 | `\\frac{23}{33}` |
| N07-Q11 | `2^k\\cdot5^k` |
| N07-Q12 | `2,4,5,8,10,16,20` |
| N07-Q13 | `−1と2/3、どちらも自然数でない` |
| N07-Q14 | `有理数（23/33と表せる）` |

### N08 — 12 source questions / 12 choices

| Word ID | App-authored key |
| --- | --- |
| N08-Q01 | `2.3,\\quad5` |
| N08-Q02 | `\|a\|=a` |
| N08-Q03 | `0-a=-a` |
| N08-Q04 | `-(-5)=5` |
| N08-Q05 | `\\sqrt5<3` |
| N08-Q06 | `負` |
| N08-Q07 | `3-\\sqrt5` |
| N08-Q08 | `負（πは3より大きい）` |
| N08-Q09 | `\\pi-3` |
| N08-Q10 | `a=0` |
| N08-Q11 | `\|a\|=\|-a\|` |
| N08-Q12 | `a^2` |

### N11 — 14 source questions / 14 choices

| Word ID | App-authored key |
| --- | --- |
| N11-Q01 | `-2>-5` |
| N11-Q02 | `b-a` |
| N11-Q03 | `c>0ならac<bc、c<0ならac>bc、c=0なら等しい` |
| N11-Q04 | `-\\frac a5>-\\frac b5,\\quad3-a>3-b` |
| N11-Q05 | `3x<7` |
| N11-Q06 | `x<\\frac73` |
| N11-Q07 | `含まれない（等号となり<を満たさない）` |
| N11-Q08 | `-2x\\le2` |
| N11-Q09 | `x\\ge-1` |
| N11-Q10 | `含む（代入すると5≤5）` |
| N11-Q11 | `-4x\\ge-26` |
| N11-Q12 | `x\\le\\frac{13}{2}` |
| N11-Q13 | `x-2\\le6x+3` |
| N11-Q14 | `x\\ge-1` |

### N13 — 9 source questions / 9 choices

| Word ID | App-authored key |
| --- | --- |
| N13-Q01 | `x=5\\;\\text{または}\\;x=-5` |
| N13-Q02 | `X=4\\;\\text{または}\\;X=-4` |
| N13-Q03 | `x-1=4\\;\\text{または}\\;x-1=-4` |
| N13-Q04 | `x=5\\;\\text{または}\\;x=-3` |
| N13-Q05 | `x-1\\;(x\\ge1),\\quad1-x\\;(x<1)` |
| N13-Q06 | `x+2=3\\;\\text{または}\\;x+2=-3` |
| N13-Q07 | `x=1\\;\\text{または}\\;x=-5` |
| N13-Q08 | `x=2\\;\\text{または}\\;x=-2` |
| N13-Q09 | `0ならx=0、負なら実数解なし` |

### N14 — 16 source questions / 16 choices

| Word ID | App-authored key |
| --- | --- |
| N14-Q01 | `原点からの距離が3より小さい` |
| N14-Q02 | `x=-3,\\quad x=3` |
| N14-Q03 | `二点の間、両端を含まない` |
| N14-Q04 | `-3<x<3` |
| N14-Q05 | `境界−4と4、外側、端点を含む` |
| N14-Q06 | `x\\le-4\\;\\text{または}\\;x\\ge4` |
| N14-Q07 | `-a<X<a` |
| N14-Q08 | `X<-a\\;\\text{または}\\;X>a` |
| N14-Q09 | `-5<x-3<5` |
| N14-Q10 | `-2<x<8` |
| N14-Q11 | `x+3\\le-2\\;\\text{または}\\;x+3\\ge2` |
| N14-Q12 | `x\\le-5\\;\\text{または}\\;x\\ge-1` |
| N14-Q13 | `-4\\le3x-2\\le4` |
| N14-Q14 | `-2\\le3x\\le6` |
| N14-Q15 | `-\\frac23\\le x\\le2` |
| N14-Q16 | `\|-4\|=4,\\quad\|4\|=4` |

## Confirmed mismatches with original student tasks

| ID | Word requires | App's omission or premature hint | Classification |
| --- | --- | --- | --- |
| F-028-A N04-Q13 | Expand `(3x+1)(x+2)` **and** identify the two products yielding the linear coefficient | Only `3x^2+7x+2` is selectable; `3x×2`, `1×x` occur in wrong-answer hint, not the required answer | **FAIL — truncated compound response** |
| F-028-B N05-Q17 | Judge sign match/opposition **and name the condition giving the reason** | Key states only `rとsは異符号`; `rs=-3` not required in accepted response | **FAIL — truncated reason** |
| F-028-C N06-Q08 | Compare degrees of x and y, then choose focus | Lead says `xは三次、yは一次までしか現れない` before learner can compare | **FAIL — pre-revealed decision** |
| F-028-D N07-Q06 | Find smallest multiplier from 10/100/1000 by aligning repeating part | Lead says `10倍すると小数部分の並びが揃う` before asking smallest multiplier | **FAIL — pre-revealed multiplier** |
| F-028-E N08-Q05 | Compare sqrt(5) and 3 **with squared values as justification** | Accepted key is only `sqrt(5)<3`, omitting `5<9`; lead supplies 5 and 9 | **FAIL — missing mathematical reason** |
| F-028-F N11-Q05 | Decide what operation eliminates constant, then write transformed inequality | Lead states `両辺に2を足す` before question | **FAIL — pre-revealed operation** |
| F-028-G N14-Q06 | Construct left/right exterior ranges and select their connective | Lead gives `−4以下か4以上` and `「かつ」ではなく「または」` before choice | **FAIL — pre-revealed final choice** |
| F-028-H N14-Q11 | Decide inside vs outside, then remove absolute value | Lead says `外側の二領域を境界込みで残す` before selection | **FAIL — pre-revealed decision** |

Impact-sweep candidate (RISK, not confirmed defect): N14-Q05 lead states the distant/outside/equality concept before the question, but the Word dialogue itself also explains the distant point; compare whether a genuinely separate expected decision is suppressed.

## Verification scope & limitations

- **PASS:** original byte identity, exact source label totals, all nine original PNG byte hashes, unchanged image staging markers. Existing CI evidenced 127 correct paths on Pixel 7 and desktop, figures and KaTeX; no fresh live re-run claimed in this session.
- **Math-key sanity:** all original formulas and their app key expressions were read across eight units; no demonstrably false final algebraic key identified. This is not official-booklet proof or a full independent equation/distractor certification.
- **FAIL:** source cognitive fidelity and pre-answer content for eight enumerated IDs; screenshot Gate① cannot waive that correctness issue.
- **UNVERIFIED:** new batch wrong-choice/hint/retry/correct E2E, explicit 320 px and 390 px screens, independent learner progress/reset/isolation, hosted app URL tied to exact verified code SHA. The existing 127-correct-path E2E does not cover these.
- Next authority gate: `CMD-WORK-001 修正`, `WORK_SYSTEM.md` §12A/12B, mathematics textbook `SPEC.md` §§2,5,8. Linked proposal approval is required before learner source modifications. Original Word, all stable IDs/127 choices, nine original image bytes, main, publication, Vercel and billing remain untouched.

**Gate② not CROSS-VERIFIED; Gate③ FINAL-REVIEW-NOT-READY.**

# MATH TEXTBOOK MODE — FUNCTIONS 119–120 DESIGN

Status: DESIGN ONLY  
Do not implement until the current review-unit CI is green.

## Authority

Read together:
1. 啓林館版 深進数学I 第2章 第1節「関数とグラフ」教科書 p.46〜49 相当
2. `docs/MATH_PRACTICE_118_CONTENT_DESIGN.md`
3. `docs/MATH_PRACTICE_119_CONTENT_DESIGN.md`
4. `docs/MATH_PRACTICE_120_CONTENT_DESIGN.md`
5. `MATHEMATICS_TEXTBOOK_MODE_MASTER_SKILL`

Curriculum topic:
- `read-propositions`
- practice 118 → 関数かどうか
- practice 119 → 関数の値
- practice 120 → 文章から関数式 + 変域

## Existing unit

### math-functions-conditions
Already implemented in review.

Role:
- common concept basis for 118
- one input x → one output y
- circle circumference → radius
- positive x → square roots
- area-1 rectangle

Do not put 119/120 calculations back into this unit.

---

## Proposed next unit A

### unitId
`math-function-values`

### source
- textbook p.46〜47: (y=f(x)), (f(a)), concrete substitution examples
- practice 119: (f(x)=3x-2), (g(x)=2x^2-3x+1)

### learner-facing title
`関数の値を求める`

### learning line

1. Small source example:
   - (f(x)=4x-6)
   - ask what (f(-1)) means: replace x by -1
2. Concept:
   - (f(a)) is the value corresponding to input a
3. Immediate numeric practice:
   - one simple f-value
4. Expression input:
   - (f(a+1))
   - substitution and simplification are separate thought nodes
5. Quadratic input:
   - (g(-a))
   - preserve parentheses
   - handle ((-a)^2)
6. Hardest transfer:
   - (g(a-1))
   - substitution → expansion → simplification

### hole policy

Keep:
- whole substitution chain for simple numeric input
- parentheses-preserving substitution for negative/expression input
- expansion only when it changes reasoning

Do not create:
- isolated number holes
- isolated minus-sign holes
- final answer after the whole calculation is already visible
- previous f-value as a dependency for the next f-value

### progressive reveal

- only current input visible as unresolved work
- solved numeric examples collapse
- (g(a-1)) must not reveal (a^2-2a+1) before substitution is resolved
- final simplified result remains hidden until the simplification node

---

## Proposed next unit B

### unitId
`math-function-models`

### source
- textbook function/domain concept from p.47
- practice 120 application authority

### learner-facing title
`文章から関数を作る`

### learning line — example 1

Triangle:
1. retrieve area relation
2. map base 6 / height x / area y
3. obtain (y=3x)
4. interpret x as height
5. decide whether 0 is allowed
6. obtain (x>0)

Important:
- formula branch and domain branch are independent until final interpretation
- do not show (x>0) while asking what x means

### learning line — example 2

Walking:
1. distance = speed × time
2. traveled distance = (3x)
3. remaining distance = (15-3x)
4. start time (x=0)
5. finish time (15/3=5)
6. domain (0\le x\le5)

Important:
- p2-end does not depend on solved p2-model
- domain uses start/end meaning, not convenience links
- example 1 derivation disappears when example 2 begins

### hole policy

Keep:
- quantity relation
- prose → formula mapping
- physical meaning of x
- boundary inclusion/exclusion

Avoid:
- unit blanks
- isolated arithmetic numbers
- asking "height" after already stating it unless needed for the domain decision
- showing final formula + domain while either branch is unresolved

---

## Integration plan

After current CI becomes green:

1. implement `math-function-values` data only → commit
2. unit test only → commit
3. implement `math-function-models` data only → commit
4. unit test only → commit
5. register both review units in math index/catalog → commit
6. E2E smoke for each unit → commit
7. CI
8. source / leakage / mobile audit
9. keep status `review` until user hands-on QA

No Desktop / Remote Desktop.

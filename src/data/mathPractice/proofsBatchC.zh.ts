import type { MathPracticeSourceQuestion } from './source'

const choice = (id: string, label: string, correct = false, wrongReason?: string) => ({
  id,
  label,
  correct,
  ...(wrongReason ? { wrongReason } : {}),
})

export const mathPracticeProofsBatchCSourceZh: MathPracticeSourceQuestion[] = [
  {
    problemNo: 108,
    section: 'proofs',
    sectionTitle: '命题与证明',
    title: '证明等价',
    estimatedSeconds: 420,
    knowledgeTags: ['equivalence', 'implication', 'inequality', 'sign'],
    skillTags: ['proof-planning', 'case-classification', 'conclusion'],
    problem: [
      { type: 'text', text: '设 a、b 为实数。证明下列两个条件 p、q 等价。' },
      { type: 'latex', latex: 'p:\\ a>1\\;\\text{且}\\;b>1' },
      { type: 'latex', latex: 'q:\\ a+b>2\\;\\text{且}\\;(a-1)(b-1)>0' },
    ],
    guide: [
      {
        type: 'content',
        blocks: [{ type: 'text', text: '先确认：要证明 p 与 q 等价，需要证明哪两个方向。' }],
      },
      { type: 'blank', blankId: 'rule' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '先证明一个方向，假设 p 成立。' },
          { type: 'latex', latex: 'a>1,\\qquad b>1' },
          { type: 'text', text: '由这两个不等式同时建立 q 所要求的“和”与“积”两个条件。' },
        ],
      },
      { type: 'blank', blankId: 'forward' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '再证明反方向，假设 q 成立。' },
          { type: 'latex', latex: 'a+b>2,\\qquad (a-1)(b-1)>0' },
          { type: 'text', text: '先只利用乘积为正，整理两个因子的符号关系。' },
        ],
      },
      { type: 'blank', blankId: 'reverse-sign' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '在得到的两个符号情况中，再利用 a+b>2 排除不可能的一支。' }],
      },
      { type: 'blank', blankId: 'reverse-eliminate' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '两个方向都已经证明。最后把它们合并为 p 与 q 的关系。' }],
      },
      { type: 'blank', blankId: 'equivalence' },
    ],
    blanks: [
      {
        id: 'rule',
        prompt: '证明 p 与 q 等价需要',
        choices: [
          choice('both-directions', '同时证明 p⇒q 和 q⇒p。', true),
          choice('forward-only', '只证明 p⇒q。'),
          choice('one-example', '举一个同时满足 p、q 的例子。'),
        ],
        skillTag: 'law-selection',
        knowledgeTags: ['equivalence', 'implication'],
        explanation: '等价意味着两个方向的蕴含都成立，因此必须分别证明 p⇒q 和 q⇒p。',
      },
      {
        id: 'forward',
        prompt: '由 p 推出 q 的正确推理是',
        choices: [
          choice('sum-and-product', 'a+b>2；并且 a-1>0、b-1>0，所以 (a-1)(b-1)>0。因此 p⇒q。', true),
          choice('sum-only', '只要得到 a+b>2，就已经能推出 q。'),
          choice('wrong-product', 'a-1>0、b-1>0，所以 (a-1)(b-1)<0。'),
        ],
        skillTag: 'law-selection',
        knowledgeTags: ['equivalence', 'implication', 'inequality', 'sign'],
        explanation: 'q 有两个条件，都必须由 p 推出：和大于2，并且两个正因子的乘积为正。',
      },
      {
        id: 'reverse-sign',
        prompt: '由 (a-1)(b-1)>0 可知两个因子的符号',
        choices: [
          choice('same-sign', '相同：要么都为正，要么都为负。', true),
          choice('opposite-sign', '相反。'),
          choice('both-positive-only', '一定都为正。'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['sign', 'inequality'],
        explanation: '乘积为正表示两个因子同号，因此要分“都正”和“都负”两种情况。',
      },
      {
        id: 'reverse-eliminate',
        prompt: '再利用 a+b>2 后，哪一种情况保留下来',
        choices: [
          choice('positive-remains', '若都为负，则 a<1、b<1，从而 a+b<2，矛盾。因此只能都为正，于是 a>1、b>1，得到 q⇒p。', true),
          choice('negative-remains', '都为正与 a+b>2 矛盾，因此只能都为负。'),
          choice('cannot-decide', 'a+b>2 不能区分这两个符号情况。'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['equivalence', 'implication', 'inequality', 'sign'],
        explanation: '负号分支会推出 a+b<2，与 q 中的 a+b>2 冲突，所以只剩正号分支。',
      },
      {
        id: 'equivalence',
        prompt: '由两个方向的证明可得',
        choices: [
          choice('equivalent', 'p⇒q 与 q⇒p 都成立，因此 p 与 q 等价。', true),
          choice('one-way', '只有 p⇒q 成立，因此 p 与 q 不等价。'),
          choice('undecided', '即使两个方向都成立，也不能判断是否等价。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['equivalence', 'implication'],
        explanation: '两个方向的蕴含都成立，所以 p⇔q，即 p 与 q 等价。',
      },
    ],
    simulation: [
      {
        id: 's1',
        label: '证明方针',
        prompt: '证明 p 与 q 等价需要什么？',
        answerType: 'single-choice',
        choices: [choice('both-directions', 'p⇒q 与 q⇒p', true), choice('forward-only', '只有 p⇒q'), choice('example', '一个具体例子')],
        score: 2,
        estimatedSeconds: 25,
        knowledgeTags: ['equivalence', 'implication'],
        skillTags: ['proof-planning'],
      },
      {
        id: 's2',
        label: '反方向',
        prompt: '由 (a-1)(b-1)>0 首先可以得到什么？',
        answerType: 'single-choice',
        choices: [choice('same-sign', '两个因子同号', true), choice('opposite-sign', '两个因子异号'), choice('both-positive', '一定都为正')],
        score: 2,
        estimatedSeconds: 25,
        knowledgeTags: ['sign'],
        skillTags: ['case-classification'],
      },
      {
        id: 's3',
        label: '结论',
        prompt: '当 p⇒q 与 q⇒p 都已证明时，结论是',
        answerType: 'single-choice',
        choices: [choice('equivalent', 'p 与 q 等价', true), choice('not-equivalent', 'p 与 q 不等价')],
        score: 2,
        estimatedSeconds: 20,
        knowledgeTags: ['equivalence'],
        skillTags: ['conclusion'],
      },
    ],
    fullExplanation: '证明等价必须证明两个方向。p⇒q 可由 a>1、b>1 直接得到和条件与积条件。q⇒p 中，乘积为正先给出同号的两种可能，再用 a+b>2 排除都为负的情况，得到 a>1、b>1。两个方向都成立，因此 p 与 q 等价。',
  },  {
    problemNo: 110,
    section: 'proofs',
    sectionTitle: '命题与证明',
    title: '逆命题、逆否命题与否命题',
    estimatedSeconds: 720,
    knowledgeTags: ['implication', 'converse', 'contrapositive', 'inverse', 'counterexample'],
    skillTags: ['condition-reading', 'law-selection', 'calculation', 'conclusion'],
    problem: [
      { type: 'text', text: '设 n 为自然数、x 为实数。判断下列命题的真假，并写出其逆命题、逆否命题和否命题，再分别判断真假。' },
      { type: 'text', text: '(1) n 是9的倍数 ⇒ n 是3的倍数。' },
      { type: 'latex', latex: '(2)\\;x\\ne2\\Rightarrow x^2-3x+2\\ne0' },
      { type: 'latex', latex: '(3)\\;x^2-x=0\\Rightarrow (x=0\\;\\text{或}\\;x=1)' },
    ],
    guide: [
      {
        type: 'content',
        blocks: [{ type: 'text', text: '把原命题记为 p⇒q，先整理逆命题、逆否命题、否命题分别如何改变方向与否定。' }],
      },
      { type: 'blank', blankId: 'rule' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(1) 先判断原命题。若 n 是9的倍数，可写成 n=9k，再改写为 3×整数。' },
          { type: 'latex', latex: 'n=9k=3(3k)' },
        ],
      },
      { type: 'blank', blankId: 'p1-original' },
      { type: 'content', blocks: [{ type: 'text', text: '(1) 再写出逆命题 q⇒p，并寻找满足前件却不满足后件的自然数。' }] },
      { type: 'blank', blankId: 'p1-converse' },
      { type: 'content', blocks: [{ type: 'text', text: '(1) 逆否命题要分别否定 q 与 p，组成 ¬q⇒¬p。' }] },
      { type: 'blank', blankId: 'p1-contrapositive' },
      { type: 'content', blocks: [{ type: 'text', text: '(1) 否命题是 ¬p⇒¬q。先写出句子，再检查是否有反例。' }] },
      { type: 'blank', blankId: 'p1-inverse' },
      { type: 'content', blocks: [{ type: 'text', text: '(1) 最后把四个命题整理成一张真假表。' }] },
      { type: 'blank', blankId: 'p1-summary' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(2) 为了判断原命题，先因式分解多项式，寻找使后件失败的值。' },
          { type: 'latex', latex: 'x^2-3x+2=(x-1)(x-2)' },
        ],
      },
      { type: 'blank', blankId: 'p2-original' },
      { type: 'content', blocks: [{ type: 'text', text: '(2) 逆命题是“多项式不为0 ⇒ x≠2”。利用 x=2 时多项式的值判断。' }] },
      { type: 'blank', blankId: 'p2-converse' },
      { type: 'content', blocks: [{ type: 'text', text: '(2) 逆否命题是“多项式=0 ⇒ x=2”。利用因式分解得到的两个根判断。' }] },
      { type: 'blank', blankId: 'p2-contrapositive' },
      { type: 'content', blocks: [{ type: 'text', text: '(2) 否命题是“x=2 ⇒ 多项式=0”。直接代入判断。' }] },
      { type: 'blank', blankId: 'p2-inverse' },
      { type: 'content', blocks: [{ type: 'text', text: '(2) 汇总四个命题的真假。' }] },
      { type: 'blank', blankId: 'p2-summary' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(3) 先因式分解左边，利用乘积为0的条件判断原命题。' },
          { type: 'latex', latex: 'x^2-x=x(x-1)' },
        ],
      },
      { type: 'blank', blankId: 'p3-original' },
      { type: 'content', blocks: [{ type: 'text', text: '(3) 逆命题以“x=0 或 x=1”为前件，检查原来的式子是否为0。' }] },
      { type: 'blank', blankId: 'p3-converse' },
      { type: 'content', blocks: [{ type: 'text', text: '(3) 写逆否命题时，要先否定“x=0 或 x=1”整个条件，注意“或”的否定。' }] },
      { type: 'blank', blankId: 'p3-contrapositive' },
      { type: 'content', blocks: [{ type: 'text', text: '(3) 否命题从原前件的否定出发，检查能否推出后件的否定。' }] },
      { type: 'blank', blankId: 'p3-inverse' },
      { type: 'content', blocks: [{ type: 'text', text: '(3) 最后汇总四个真假。' }] },
      { type: 'blank', blankId: 'p3-summary' },
    ],
    blanks: [
      {
        id: 'rule',
        prompt: '若原命题为 p⇒q，逆命题、逆否命题、否命题的正确形式是',
        choices: [
          choice('correct', '逆命题 q⇒p，逆否命题 ¬q⇒¬p，否命题 ¬p⇒¬q。', true),
          choice('swap-contrapositive', '逆命题 q⇒p，逆否命题 ¬p⇒¬q，否命题 ¬q⇒¬p。'),
          choice('negate-only', '逆命题 ¬p⇒¬q，逆否命题 q⇒p，否命题 p⇒q。'),
        ],
        skillTag: 'law-selection',
        knowledgeTags: ['implication', 'converse', 'contrapositive', 'inverse'],
        explanation: '逆命题只反转方向；逆否命题反转方向并否定两边；否命题保持方向但否定两边。',
      },
      {
        id: 'p1-original',
        prompt: '(1) 原命题的真假是',
        choices: [
          choice('true', 'n=9k=3(3k)，所以为真。', true),
          choice('false-three', 'n=3 是反例，所以为假。'),
          choice('false-nine', 'n=9 是反例，所以为假。'),
        ],
        skillTag: 'calculation',
        knowledgeTags: ['implication', 'divisibility'],
        explanation: '9的倍数一定可写成 3×整数，所以原命题为真。',
      },
      {
        id: 'p1-converse',
        prompt: '(1) 的逆命题与真假是',
        choices: [
          choice('false-three', '“3的倍数 ⇒ 9的倍数”。n=3 是反例，所以为假。', true),
          choice('true', '“3的倍数 ⇒ 9的倍数”。总是成立，所以为真。'),
          choice('wrong-form', '“不是3的倍数 ⇒ 不是9的倍数”。为真。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['converse', 'counterexample', 'divisibility'],
        explanation: '逆命题是 q⇒p；n=3 能满足前件但不能满足后件。',
      },
      {
        id: 'p1-contrapositive',
        prompt: '(1) 的逆否命题与真假是',
        choices: [
          choice('true', '“不是3的倍数 ⇒ 不是9的倍数”。为真。', true),
          choice('inverse-false', '“不是9的倍数 ⇒ 不是3的倍数”。为假。'),
          choice('wrong-negation', '“3的倍数 ⇒ 不是9的倍数”。为真。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['contrapositive', 'negation', 'divisibility'],
        explanation: '9的倍数一定也是3的倍数，因此不是3的倍数不可能是9的倍数。',
      },
      {
        id: 'p1-inverse',
        prompt: '(1) 的否命题与真假是',
        choices: [
          choice('false-three', '“不是9的倍数 ⇒ 不是3的倍数”。n=3 是反例，所以为假。', true),
          choice('true', '“不是9的倍数 ⇒ 不是3的倍数”。为真。'),
          choice('wrong-form', '“不是3的倍数 ⇒ 不是9的倍数”。为真。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['inverse', 'counterexample', 'divisibility'],
        explanation: '否命题是 ¬p⇒¬q；n=3 不是9的倍数，但仍是3的倍数。',
      },
      {
        id: 'p1-summary',
        prompt: '(1) 四个命题的真假汇总为',
        choices: [
          choice('tftf', '原：真，逆：假，逆否：真，否：假。', true),
          choice('ttff', '原：真，逆：真，逆否：假，否：假。'),
          choice('ftft', '原：假，逆：真，逆否：假，否：真。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['implication', 'converse', 'contrapositive', 'inverse'],
        explanation: '(1) 的顺序是真、假、真、假。',
      },

      {
        id: 'p2-original',
        prompt: '(2) 原命题的真假是',
        choices: [
          choice('false-one', 'x=1 时 x≠2，但多项式为0，因此有反例，命题为假。', true),
          choice('true-factor', '只要能因式分解就一定为真。'),
          choice('false-two', 'x=2 满足前件，是反例，所以为假。'),
        ],
        skillTag: 'calculation',
        knowledgeTags: ['implication', 'counterexample', 'factorization'],
        explanation: 'x=1 满足前件 x≠2，却使 (x-1)(x-2)=0，所以原命题为假。',
      },
      {
        id: 'p2-converse',
        prompt: '(2) 的逆命题与真假是',
        choices: [
          choice('true', '“x²-3x+2≠0 ⇒ x≠2”。若 x=2 多项式会等于0，因此为真。', true),
          choice('false-one', '该命题在 x=1 时失败，所以为假。'),
          choice('wrong-form', '“x²-3x+2=0 ⇒ x=2”。为真。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['converse', 'factorization'],
        explanation: '多项式不为0时，x 不可能等于2，因此逆命题为真。',
      },
      {
        id: 'p2-contrapositive',
        prompt: '(2) 的逆否命题与真假是',
        choices: [
          choice('false-one', '“x²-3x+2=0 ⇒ x=2”。x=1 是反例，所以为假。', true),
          choice('true', '“x²-3x+2=0 ⇒ x=2”。为真。'),
          choice('wrong-form', '“x=2 ⇒ x²-3x+2=0”。为真。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['contrapositive', 'counterexample', 'factorization'],
        explanation: '多项式为0时 x 可以是1或2，因此 x=1 是反例。',
      },
      {
        id: 'p2-inverse',
        prompt: '(2) 的否命题与真假是',
        choices: [
          choice('true', '“x=2 ⇒ x²-3x+2=0”。代入可得0，所以为真。', true),
          choice('false-one', '该命题在 x=1 时失败，所以为假。'),
          choice('wrong-form', '“x²-3x+2=0 ⇒ x=2”。为假。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['inverse', 'calculation'],
        explanation: '把 x=2 代入得 4-6+2=0，所以否命题为真。',
      },
      {
        id: 'p2-summary',
        prompt: '(2) 四个命题的真假汇总为',
        choices: [
          choice('ftft', '原：假，逆：真，逆否：假，否：真。', true),
          choice('tftf', '原：真，逆：假，逆否：真，否：假。'),
          choice('tttt', '四个都为真。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['implication', 'converse', 'contrapositive', 'inverse'],
        explanation: '(2) 的顺序是假、真、假、真。',
      },

      {
        id: 'p3-original',
        prompt: '(3) 原命题的真假是',
        choices: [
          choice('true-zero-product', 'x(x-1)=0 时 x=0 或 x=1，所以为真。', true),
          choice('false-half', 'x=1/2 是反例，所以为假。'),
          choice('false-one', 'x=1 是反例，所以为假。'),
        ],
        skillTag: 'calculation',
        knowledgeTags: ['implication', 'factorization', 'zero-product'],
        explanation: '乘积为0时至少一个因子为0，所以 x=0 或 x=1。',
      },
      {
        id: 'p3-converse',
        prompt: '(3) 的逆命题与真假是',
        choices: [
          choice('true', '“x=0 或 x=1 ⇒ x²-x=0”。两种代入都为0，所以为真。', true),
          choice('false-half', 'x=1/2 是反例，所以为假。'),
          choice('wrong-form', '“x≠0 且 x≠1 ⇒ x²-x≠0”。为真。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['converse', 'calculation'],
        explanation: 'x=0 和 x=1 两种情况都使 x²-x=0，因此逆命题为真。',
      },
      {
        id: 'p3-contrapositive',
        prompt: '(3) 的逆否命题与真假是',
        choices: [
          choice('true', '“x≠0 且 x≠1 ⇒ x²-x≠0”。两个因子都不为0，所以为真。', true),
          choice('or-negation', '“x≠0 或 x≠1 ⇒ x²-x≠0”。为真。'),
          choice('inverse', '“x²-x≠0 ⇒ x≠0 且 x≠1”。为真。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['contrapositive', 'negation', 'de-morgan'],
        explanation: '“x=0 或 x=1”的否定是“x≠0 且 x≠1”。此时 x 与 x-1 都不为0，所以乘积不为0。',
      },
      {
        id: 'p3-inverse',
        prompt: '(3) 的否命题与真假是',
        choices: [
          choice('true', '“x²-x≠0 ⇒ x≠0 且 x≠1”。为真。', true),
          choice('false-half', '该命题在 x=1/2 时为假。'),
          choice('wrong-form', '“x≠0 且 x≠1 ⇒ x²-x≠0”。为真。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['inverse', 'factorization'],
        explanation: '若 x²-x 不为0，则 x 不可能是0或1，因此否命题为真。',
      },
      {
        id: 'p3-summary',
        prompt: '(3) 四个命题的真假汇总为',
        choices: [
          choice('tttt', '原：真，逆：真，逆否：真，否：真。', true),
          choice('tftf', '原：真，逆：假，逆否：真，否：假。'),
          choice('ftft', '原：假，逆：真，逆否：假，否：真。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['implication', 'converse', 'contrapositive', 'inverse'],
        explanation: '(3) 四个命题都为真。',
      },
    ],
    simulation: [
      {
        id: 's1', label: '(1)', prompt: '选择 (1) 原、逆、逆否、否命题的真假。', answerType: 'single-choice',
        choices: [choice('tftf', '真・假・真・假', true), choice('ftft', '假・真・假・真'), choice('tttt', '真・真・真・真')],
        score: 2, estimatedSeconds: 35, knowledgeTags: ['converse', 'contrapositive', 'inverse'], skillTags: ['conclusion'],
      },
      {
        id: 's2', label: '(2)', prompt: '选择 (2) 原、逆、逆否、否命题的真假。', answerType: 'single-choice',
        choices: [choice('ftft', '假・真・假・真', true), choice('tftf', '真・假・真・假'), choice('tttt', '真・真・真・真')],
        score: 2, estimatedSeconds: 35, knowledgeTags: ['converse', 'contrapositive', 'inverse'], skillTags: ['conclusion'],
      },
      {
        id: 's3', label: '(3)', prompt: '选择 (3) 原、逆、逆否、否命题的真假。', answerType: 'single-choice',
        choices: [choice('tttt', '真・真・真・真', true), choice('tftf', '真・假・真・假'), choice('ftft', '假・真・假・真')],
        score: 2, estimatedSeconds: 35, knowledgeTags: ['converse', 'contrapositive', 'inverse'], skillTags: ['conclusion'],
      },
    ],
    fullExplanation: '若原命题为 p⇒q，则逆命题是 q⇒p，逆否命题是 ¬q⇒¬p，否命题是 ¬p⇒¬q。(1) 的真假依次为真、假、真、假；(2) 为假、真、假、真；(3) 四个都为真。每个判断都通过倍数定义、因式分解、反例与正确的否定形式进行验证。',
  },

]

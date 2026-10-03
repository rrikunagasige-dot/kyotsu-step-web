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
        skillTag: 'proof-planning',
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
        skillTag: 'proof-planning',
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
  },
]

import type { MathPracticeSourceQuestion } from './source'

const choice = (id: string, label: string, correct = false, wrongReason?: string) => ({
  id,
  label,
  correct,
  ...(wrongReason ? { wrongReason } : {}),
})

export const mathPracticeFunctionsBatchDSourceZh: MathPracticeSourceQuestion[] = [
  {
    problemNo: 118,
    section: 'functions',
    sectionTitle: '函数',
    title: '什么是函数',
    estimatedSeconds: 300,
    knowledgeTags: ['function', 'unique-output', 'square-root', 'geometry'],
    skillTags: ['condition-reading', 'equation-building', 'conclusion'],
    problem: [
      { type: 'text', text: '下列哪些情形中，可以说“y 是 x 的函数”？' },
      { type: 'text', text: '(1) 周长为 x 的圆的半径 y' },
      { type: 'text', text: '(2) 正数 x 的平方根 y' },
      { type: 'text', text: '(3) 面积为1的长方形，竖边长 x 与横边长 y' },
    ],
    guide: [
      { type: 'content', blocks: [{ type: 'text', text: '先整理判断函数时真正要检查的条件。' }] },
      { type: 'blank', blankId: 'rule' },
      { type: 'content', blocks: [{ type: 'text', text: '(1) 把圆周长 x 与半径 y 写成关系式，再看一个 x 能确定几个 y。' }] },
      { type: 'blank', blankId: 'p1' },
      { type: 'content', blocks: [{ type: 'text', text: '(2) 若要说明不是函数，只需找到一个 x 对应两个不同 y 的例子。' }] },
      { type: 'blank', blankId: 'p2' },
      { type: 'content', blocks: [{ type: 'text', text: '(3) 先写面积条件，并利用边长为正这一取值条件来判断 y 是否唯一。' }] },
      { type: 'blank', blankId: 'p3' },
    ],
    blanks: [
      {
        id: 'rule',
        prompt: 'y 是 x 的函数的判定标准是',
        choices: [
          choice('unique', '对每个允许的 x，都恰好确定一个 y。', true),
          choice('many', '一个 x 对应多少个 y 都可以。'),
          choice('formula-only', '只要能写出一个含 x、y 的式子，就一定是函数。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['function', 'unique-output'],
        explanation: '函数要求定义域中的每个输入 x 都恰好对应一个输出 y。',
      },
      {
        id: 'p1',
        prompt: '(1) 由圆周长与半径的关系判断',
        choices: [
          choice('function', 'x=2πy，所以 y=x/(2π)。每个 x 只确定一个 y，因此是函数。', true),
          choice('not-function', '即使 x=2πy，一个 x 也会有两个半径，所以不是函数。'),
          choice('wrong-formula', 'y=2πx，所以是函数。'),
        ],
        skillTag: 'equation-building',
        knowledgeTags: ['function', 'unique-output', 'circle'],
        explanation: '由 x=2πy 得 y=x/(2π)，一个周长只对应一个半径。',
      },
      {
        id: 'p2',
        prompt: '(2) 用同一个 x 对应两个平方根的例子判断',
        choices: [
          choice('counterexample', 'x=4 时平方根为 y=2 与 y=-2，所以一个 x 对应两个 y，不是函数。', true),
          choice('principal-only', 'x=4 时只有 y=2，所以是函数。'),
          choice('zero', '取 x=0 时只有 y=0，所以是函数。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['function', 'unique-output', 'square-root'],
        explanation: '“4的平方根”包括2和-2。同一个输入4有两个不同输出，因此不是函数。',
      },
      {
        id: 'p3',
        prompt: '(3) 由面积为1的条件判断',
        choices: [
          choice('function', 'xy=1，所以 y=1/x。边长满足 x>0，每个 x 只对应一个 y，因此是函数。', true),
          choice('not-function', 'xy=1 时一个 x 会对应正负两个 y，所以不是函数。'),
          choice('wrong-relation', 'x+y=1，所以 y=1-x。'),
        ],
        skillTag: 'equation-building',
        knowledgeTags: ['function', 'unique-output', 'rectangle'],
        explanation: '面积条件为 xy=1，且边长 x>0，所以 y=1/x 对每个 x 都唯一。',
      },
    ],
    simulation: [
      {
        id: 's1',
        label: '判断',
        prompt: '选择三个情形中属于函数的项目。',
        answerType: 'multi-choice',
        choices: [
          choice('p1', '(1) 圆周长 x → 半径 y', true),
          choice('p2', '(2) 正数 x → 它的平方根 y'),
          choice('p3', '(3) 面积为1的长方形：竖边 x → 横边 y', true),
        ],
        score: 3,
        estimatedSeconds: 30,
        knowledgeTags: ['function', 'unique-output'],
        skillTags: ['conclusion'],
      },
    ],
    fullExplanation: '函数要求每个 x 恰好对应一个 y。(1) y=x/(2π)，所以是函数；(2) 例如 x=4 有 y=2 和 y=-2 两个平方根，所以不是函数；(3) xy=1 且 x>0，因此 y=1/x 唯一确定，所以是函数。',
  },
]

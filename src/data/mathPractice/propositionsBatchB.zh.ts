import type { MathPracticeSourceQuestion } from './source'

const choice = (id: string, label: string, correct = false, wrongReason?: string) => ({
  id,
  label,
  correct,
  ...(wrongReason ? { wrongReason } : {}),
})

export const mathPracticePropositionsBatchBSourceZh: MathPracticeSourceQuestion[] = [
  {
    problemNo: 98,
    section: 'propositions',
    sectionTitle: '命题与条件',
    title: '命题与真假',
    estimatedSeconds: 360,
    knowledgeTags: ['proposition', 'truth-value', 'counterexample', 'objectivity'],
    skillTags: ['condition-reading', 'case-classification', 'conclusion'],
    problem: [
      { type: 'text', text: '判断下列语句是否为命题；若是命题，再判断真假。' },
      { type: 'text', text: '(1) 23 除以 3 的余数是 2。' },
      { type: 'text', text: '(2) 等腰三角形是等边三角形。' },
      { type: 'text', text: '(3) 3.14 是圆周率 π 的良好近似值。' },
    ],
    guide: [
      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: '先建立判断一个语句是否为命题的共同标准。关键不是“多数人是否认为正确”，而是能否客观地确定真假。',
        }],
      },
      { type: 'blank', blankId: 'definition' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(1) 实际做除法来检查语句内容。' },
          { type: 'latex', latex: '23=3\\times7+2' },
        ],
      },
      { type: 'blank', blankId: 'p1-result' },

      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: '(2) 检查是否存在一个具体例子，可以推翻“所有等腰三角形都是等边三角形”这一说法。',
        }],
      },
      { type: 'blank', blankId: 'p2-counterexample' },
      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: '只要找到一个反例，“所有都是等边三角形”的说法就不能成立。',
        }],
      },
      { type: 'blank', blankId: 'p2-result' },

      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: '(3) 思考“良好近似值”这一表述本身是否给出了能够客观决定真假的标准。',
        }],
      },
      { type: 'blank', blankId: 'p3-objectivity' },
      { type: 'blank', blankId: 'p3-result' },
    ],
    blanks: [
      {
        id: 'definition',
        prompt: '命题是指内容能够客观地',
        choices: [
          choice('truth-or-false', '确定为真、假其中之一的语句。', true),
          choice('majority', '被多数人认为正确的语句。'),
          choice('has-formula', '含有数学公式的语句。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['proposition'],
        explanation: '判断是否为命题，要看内容能否客观地确定为真、假其中之一。',
      },
      {
        id: 'p1-result',
        prompt: '因为 23=3×7+2，所以 (1)',
        choices: [
          choice('true-proposition', '是命题，并且为真。', true),
          choice('false-proposition', '是命题，但为假。'),
          choice('not-proposition', '不是命题。'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['proposition', 'truth-value'],
        explanation: '计算可确认余数确实为2，而且真假能够客观确定，因此它是真命题。',
      },
      {
        id: 'p2-counterexample',
        prompt: '能够作为 (2) 的反例的是',
        choices: [
          choice('forty-degree', '存在顶角为40°的等腰三角形。', true),
          choice('equilateral', '存在等边三角形。'),
          choice('sixty-degree', '存在顶角为60°的等腰三角形。'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['counterexample', 'truth-value'],
        explanation: '顶角为40°的等腰三角形另外两个角各为70°，因此不是等边三角形。',
      },
      {
        id: 'p2-result',
        prompt: '由于存在这个反例，所以 (2)',
        choices: [
          choice('false-proposition', '是命题，但为假。', true),
          choice('true-proposition', '是命题，并且为真。'),
          choice('not-proposition', '不是命题。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['proposition', 'truth-value', 'counterexample'],
        explanation: '反例说明内容为假；但真假本身可以客观确定，所以它仍然是命题。',
      },
      {
        id: 'p3-objectivity',
        prompt: '对于“良好近似值”，能够唯一决定真假的客观标准',
        choices: [
          choice('not-fixed', '并没有被确定。', true),
          choice('fixed', '在数学上必然唯一确定。'),
          choice('number-is-enough', '只要出现3.14这个数就会自动确定。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['objectivity', 'proposition'],
        explanation: '题目没有规定“接近到什么程度才算良好”，因此无法唯一确定真假。',
      },
      {
        id: 'p3-result',
        prompt: '因此，(3)',
        choices: [
          choice('not-proposition', '不是命题。', true),
          choice('true-proposition', '是命题，并且为真。'),
          choice('false-proposition', '是命题，但为假。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['proposition', 'objectivity'],
        explanation: '不能客观、唯一确定真假的语句不是命题。',
      },
    ],
    simulation: [
      {
        id: 's1',
        label: '(1)',
        prompt: '判断“23除以3的余数是2”。',
        answerType: 'single-choice',
        choices: [
          choice('true-proposition', '是命题，并且为真。', true),
          choice('false-proposition', '是命题，但为假。'),
          choice('not-proposition', '不是命题。'),
        ],
        score: 2,
        estimatedSeconds: 30,
        knowledgeTags: ['proposition', 'truth-value'],
        skillTags: ['case-classification'],
      },
      {
        id: 's2',
        label: '(2)',
        prompt: '判断“等腰三角形是等边三角形”。',
        answerType: 'single-choice',
        choices: [
          choice('false-proposition', '是命题，但为假。', true),
          choice('true-proposition', '是命题，并且为真。'),
          choice('not-proposition', '不是命题。'),
        ],
        score: 2,
        estimatedSeconds: 30,
        knowledgeTags: ['proposition', 'truth-value'],
        skillTags: ['case-classification'],
      },
      {
        id: 's3',
        label: '(3)',
        prompt: '判断“3.14是π的良好近似值”。',
        answerType: 'single-choice',
        choices: [
          choice('not-proposition', '不是命题。', true),
          choice('true-proposition', '是命题，并且为真。'),
          choice('false-proposition', '是命题，但为假。'),
        ],
        score: 2,
        estimatedSeconds: 30,
        knowledgeTags: ['proposition', 'objectivity'],
        skillTags: ['case-classification'],
      },
    ],
    fullExplanation: '判断一个语句是否为命题，要看其内容能否客观地确定为真、假其中之一。一个语句即使为假，只要真假可以客观确定，它仍然是命题；而“良好”这类没有给出客观标准的表述不能唯一确定真假，因此不是命题。',
  },
]

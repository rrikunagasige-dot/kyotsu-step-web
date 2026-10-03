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
        prompt: '由这个计算可知，(1)',
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
  {
    problemNo: 99,
    section: 'propositions',
    sectionTitle: '命题与条件',
    title: '蕴含命题的真假',
    estimatedSeconds: 480,
    knowledgeTags: ['implication', 'set-inclusion', 'counterexample', 'absolute-value', 'interval'],
    skillTags: ['condition-reading', 'case-classification', 'conclusion'],
    problem: [
      { type: 'text', text: '设 x 为实数。利用满足条件的集合之间的包含关系，判断下列命题的真假。' },
      { type: 'latex', latex: '(1)\\;1<x<2\\Rightarrow 1<x<3' },
      { type: 'latex', latex: '(2)\\;x<1\\Rightarrow 0<x<1' },
      { type: 'latex', latex: '(3)\\;x>3\\Rightarrow |x+1|>2' },
      { type: 'latex', latex: '(4)\\;|x|\\le 2\\Rightarrow |x-1|<3' },
    ],
    guide: [
      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: '先建立共同规则：把满足前件的实数集合记为 P，把满足后件的实数集合记为 Q，再用集合包含关系判断蕴含命题。',
        }],
      },
      { type: 'blank', blankId: 'rule' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(1) 把前件和后件分别写成区间并比较。' },
          { type: 'latex', latex: 'P=(1,2),\\qquad Q=(1,3)' },
        ],
      },
      { type: 'blank', blankId: 'p1-result' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(2) 中，满足前件的集合比满足后件的集合更大。找一个属于 P 但不属于 Q 的值。' },
          { type: 'latex', latex: 'P=(-\\infty,1),\\qquad Q=(0,1)' },
        ],
      },
      { type: 'blank', blankId: 'p2-counterexample' },
      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: '检查所选的值是否满足前件但不满足后件，再据此判断真假。',
        }],
      },
      { type: 'blank', blankId: 'p2-result' },

      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: '(3) 从 x>3 判断 x+1 的符号与大小，检查绝对值形式的后件是否必然成立。',
        }],
      },
      { type: 'blank', blankId: 'p3-result' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(4) 满足前件的集合如下。把后件也改写成区间再比较。' },
          { type: 'latex', latex: 'P=[-2,2]' },
        ],
      },
      { type: 'blank', blankId: 'p4-q-set' },
      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: '比较 P 和 Q 的端点，检查是否存在只属于 P 的值。',
        }],
      },
      { type: 'blank', blankId: 'p4-counterexample-result' },
    ],
    blanks: [
      {
        id: 'rule',
        prompt: '命题 p⇒q 为真时应满足的集合关系是',
        choices: [
          choice('p-subset-q', 'P⊆Q。', true),
          choice('q-subset-p', 'Q⊆P。'),
          choice('disjoint', 'P∩Q=∅。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['implication', 'set-inclusion'],
        explanation: '“满足 p 的所有值也满足 q”用集合关系表示就是 P⊆Q。',
      },
      {
        id: 'p1-result',
        prompt: '比较 P=(1,2) 与 Q=(1,3)，可知 (1)',
        choices: [
          choice('subset-true', '因为 P⊆Q，所以为真。', true),
          choice('reverse-false', '因为 Q⊆P，所以为假。'),
          choice('not-comparable', '因为没有包含关系，所以为假。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['implication', 'set-inclusion', 'interval'],
        explanation: '(1,2) 中的所有实数都属于 (1,3)，因此 P⊆Q，命题为真。',
      },
      {
        id: 'p2-counterexample',
        prompt: '可以作为“属于 P 但不属于 Q”的反例的是',
        choices: [
          choice('minus-one', 'x=-1', true),
          choice('half', 'x=1/2'),
          choice('two', 'x=2'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['counterexample', 'set-inclusion', 'interval'],
        explanation: 'x=-1 满足 x<1，但不满足 0<x<1。',
      },
      {
        id: 'p2-result',
        prompt: '由于存在这个反例，所以 (2)',
        choices: [
          choice('false', 'P⊆Q 不成立，因此为假。', true),
          choice('true', 'P⊆Q 成立，因此为真。'),
          choice('not-proposition', '无法判断真假。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['implication', 'counterexample'],
        explanation: '只要存在一个满足前件但不满足后件的值，蕴含命题就是假的。',
      },
      {
        id: 'p3-result',
        prompt: '由 x>3 推出后件必然成立的正确推理是',
        choices: [
          choice('positive-bound', 'x+1>4，所以 |x+1|=x+1>4>2，因此为真。', true),
          choice('wrong-sign', 'x+1>4，所以 |x+1|<2，因此为假。'),
          choice('unknown-sign', 'x+1 的正负无法确定，因此无法判断真假。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['implication', 'absolute-value'],
        explanation: 'x>3 时 x+1>4>0，因此可以去掉绝对值，并且一定有 |x+1|>2。',
      },
      {
        id: 'p4-q-set',
        prompt: '把 |x-1|<3 改写成区间条件，得到',
        choices: [
          choice('correct', '-2<x<4', true),
          choice('shift-left', '-4<x<2'),
          choice('closed', '-2≤x≤4'),
        ],
        skillTag: 'calculation',
        knowledgeTags: ['absolute-value', 'interval'],
        explanation: '|x-1|<3 等价于 -3<x-1<3，再同时加1得到 -2<x<4。',
      },
      {
        id: 'p4-counterexample-result',
        prompt: '比较 P=[-2,2] 与 Q=(-2,4)，可知 (4)',
        choices: [
          choice('minus-two-false', 'x=-2 属于 P 但不属于 Q，因此为假。', true),
          choice('two-true', 'x=2 同时属于 P 和 Q，因此为真。'),
          choice('minus-three-false', 'x=-3 不属于 Q，因此为假。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['implication', 'counterexample', 'set-inclusion', 'interval'],
        explanation: 'x=-2 时 |x|=2≤2，但 |x-1|=3，不满足后件的 <3，因此它是反例。',
      },
    ],
    simulation: [
      {
        id: 's1',
        label: '(1)',
        prompt: '判断 1<x<2 ⇒ 1<x<3 的真假。',
        answerType: 'single-choice',
        choices: [choice('true', '真', true), choice('false', '假')],
        score: 2,
        estimatedSeconds: 30,
        knowledgeTags: ['implication', 'set-inclusion'],
        skillTags: ['conclusion'],
      },
      {
        id: 's2',
        label: '(2)',
        prompt: '判断 x<1 ⇒ 0<x<1 的真假。',
        answerType: 'single-choice',
        choices: [choice('false', '假', true), choice('true', '真')],
        score: 2,
        estimatedSeconds: 30,
        knowledgeTags: ['implication', 'counterexample'],
        skillTags: ['conclusion'],
      },
      {
        id: 's3',
        label: '(3)',
        prompt: '判断 x>3 ⇒ |x+1|>2 的真假。',
        answerType: 'single-choice',
        choices: [choice('true', '真', true), choice('false', '假')],
        score: 2,
        estimatedSeconds: 30,
        knowledgeTags: ['implication', 'absolute-value'],
        skillTags: ['conclusion'],
      },
      {
        id: 's4',
        label: '(4)',
        prompt: '判断 |x|≤2 ⇒ |x-1|<3 的真假。',
        answerType: 'single-choice',
        choices: [choice('false', '假', true), choice('true', '真')],
        score: 2,
        estimatedSeconds: 30,
        knowledgeTags: ['implication', 'counterexample', 'absolute-value'],
        skillTags: ['conclusion'],
      },
    ],
    fullExplanation: '判断 p⇒q 的真假，可以比较前件条件集合 P 和后件条件集合 Q。若 P⊆Q，则命题为真；若不包含，只要找出一个属于 P 但不属于 Q 的值即可作为反例。含绝对值的条件先改写成区间后，更容易比较包含关系。',
  },

  {
    problemNo: 100,
    section: 'propositions',
    sectionTitle: '命题与条件',
    title: '反例',
    estimatedSeconds: 360,
    knowledgeTags: ['counterexample', 'implication', 'absolute-value', 'prime-number'],
    skillTags: ['condition-reading', 'case-classification', 'conclusion'],
    problem: [
      { type: 'text', text: '设 x、y 为实数，n 为自然数。用反例说明下列命题为假。' },
      { type: 'latex', latex: '(1)\\;x^2=3\\Rightarrow x=\\sqrt{3}' },
      { type: 'latex', latex: '(2)\\;|x|>|y|\\Rightarrow x>y' },
      { type: 'latex', latex: '(3)\\;n\\text{ 为奇数}\\Rightarrow 10n+1\\text{ 为素数}' },
    ],
    guide: [
      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: '先确认：要用一个具体例子说明蕴含命题为假，这个例子必须满足什么条件。',
        }],
      },
      { type: 'blank', blankId: 'rule' },

      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: '(1) 注意平方会消去正负号。选择一个满足前件、但与后件给出的值不同的解。',
        }],
      },
      { type: 'blank', blankId: 'p1-counterexample' },

      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: '(2) 构造一个“绝对值较大，但原数反而较小”的例子。固定 y=1 来思考。',
        }],
      },
      { type: 'blank', blankId: 'p2-counterexample' },

      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: '(3) 在奇数 n 中寻找一个使 10n+1 成为合数的值。',
        }],
      },
      { type: 'blank', blankId: 'p3-counterexample' },
      {
        type: 'content',
        blocks: [{ type: 'latex', latex: '10\\cdot5+1=51=3\\times17' }],
      },
    ],
    blanks: [
      {
        id: 'rule',
        prompt: '能够说明蕴含命题为假的反例必须',
        choices: [
          choice('antecedent-true-consequent-false', '满足前件，但不满足后件。', true),
          choice('both-true', '同时满足前件和后件。'),
          choice('antecedent-false', '只要不满足前件即可。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['counterexample', 'implication'],
        explanation: '要使 p⇒q 为假，只需要一个 p 为真而 q 为假的具体例子。',
      },
      {
        id: 'p1-counterexample',
        prompt: '可以作为 (1) 的反例的是',
        choices: [
          choice('negative-root', 'x=-√3', true),
          choice('positive-root', 'x=√3'),
          choice('zero', 'x=0'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['counterexample', 'implication'],
        explanation: 'x=-√3 满足 x²=3，但不满足 x=√3，因此是反例。',
      },
      {
        id: 'p2-counterexample',
        prompt: '令 y=1 时，能够作为 (2) 反例的 x 是',
        choices: [
          choice('minus-two', 'x=-2', true),
          choice('two', 'x=2'),
          choice('half', 'x=1/2'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['counterexample', 'absolute-value'],
        explanation: 'x=-2,y=1 时 |x|=2>|y|=1，但 -2>1 不成立。',
      },
      {
        id: 'p3-counterexample',
        prompt: '在奇数 n 中，能够作为 (3) 反例的是',
        choices: [
          choice('five', 'n=5', true),
          choice('one', 'n=1'),
          choice('three', 'n=3'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['counterexample', 'prime-number'],
        explanation: 'n=5 是奇数，但 10n+1=51=3×17 是合数，因此是反例。',
      },
    ],
    simulation: [
      {
        id: 's1',
        label: '(1)',
        prompt: '选择一个能说明 x²=3 ⇒ x=√3 为假的反例。',
        answerType: 'single-choice',
        choices: [
          choice('negative-root', 'x=-√3', true),
          choice('positive-root', 'x=√3'),
          choice('zero', 'x=0'),
        ],
        score: 2,
        estimatedSeconds: 30,
        knowledgeTags: ['counterexample', 'implication'],
        skillTags: ['case-classification'],
      },
      {
        id: 's2',
        label: '(2)',
        prompt: '选择一个能说明 |x|>|y| ⇒ x>y 为假的反例。',
        answerType: 'single-choice',
        choices: [
          choice('minus-two-one', 'x=-2, y=1', true),
          choice('two-one', 'x=2, y=1'),
          choice('half-one', 'x=1/2, y=1'),
        ],
        score: 2,
        estimatedSeconds: 30,
        knowledgeTags: ['counterexample', 'absolute-value'],
        skillTags: ['case-classification'],
      },
      {
        id: 's3',
        label: '(3)',
        prompt: '选择一个能说明“n 为奇数 ⇒ 10n+1 为素数”为假的反例。',
        answerType: 'single-choice',
        choices: [
          choice('five', 'n=5', true),
          choice('one', 'n=1'),
          choice('three', 'n=3'),
        ],
        score: 2,
        estimatedSeconds: 30,
        knowledgeTags: ['counterexample', 'prime-number'],
        skillTags: ['case-classification'],
      },
    ],
    fullExplanation: '要说明蕴含命题 p⇒q 为假，只需给出一个满足前件 p 但不满足后件 q 的反例。平方问题注意正负号，绝对值问题注意绝对值大小与原数大小可能不同，素数问题则可寻找使表达式成为合数的具体奇数。',
  },
  {
    problemNo: 101,
    section: 'propositions',
    sectionTitle: '命题与条件',
    title: '条件的否定',
    estimatedSeconds: 300,
    knowledgeTags: ['negation', 'complement', 'inequality', 'rational-number'],
    skillTags: ['condition-reading', 'case-classification', 'conclusion'],
    problem: [
      { type: 'text', text: '设 x、y 为实数。写出下列条件的否定。' },
      { type: 'latex', latex: '(1)\\;x>-5' },
      { type: 'latex', latex: '(2)\\;x+y\\ne0' },
      { type: 'text', text: '(3) x 是有理数。' },
    ],
    guide: [
      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: '先确认条件的否定表示什么。不能只机械地更换符号，而要把原条件不成立的所有情况完整表示出来。',
        }],
      },
      { type: 'blank', blankId: 'rule' },

      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: '(1) 要把边界 -5 本身是否满足原条件也一起考虑。',
        }],
      },
      { type: 'blank', blankId: 'p1-result' },

      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: '(2) 把“不是0”这一条件不成立的情况直接写成等式。',
        }],
      },
      { type: 'blank', blankId: 'p2-result' },

      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: '(3) 利用 x 是实数这一前提，思考有理数在实数范围内的补集。',
        }],
      },
      { type: 'blank', blankId: 'p3-result' },
    ],
    blanks: [
      {
        id: 'rule',
        prompt: '条件 p 的否定表示',
        choices: [
          choice('all-not-p', 'p 不成立的所有情况。', true),
          choice('opposite-looking', '写一个看起来相反的式子即可。'),
          choice('some-not-p', '只要举出一个 p 不成立的例子即可。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['negation', 'complement'],
        explanation: '条件的否定必须覆盖原条件不成立的所有情况。',
      },
      {
        id: 'p1-result',
        prompt: 'x>-5 的否定是',
        choices: [
          choice('le-minus-five', 'x≤-5', true),
          choice('lt-minus-five', 'x<-5'),
          choice('ge-minus-five', 'x≥-5'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['negation', 'inequality', 'complement'],
        explanation: 'x=-5 不满足 x>-5，因此必须把边界包含进来，得到 x≤-5。',
      },
      {
        id: 'p2-result',
        prompt: 'x+y≠0 的否定是',
        choices: [
          choice('equals-zero', 'x+y=0', true),
          choice('greater-zero', 'x+y>0'),
          choice('less-equal-zero', 'x+y≤0'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['negation'],
        explanation: '“不等于0”不成立，恰好就是“等于0”。',
      },
      {
        id: 'p3-result',
        prompt: '实数 x 是有理数这一条件的否定是',
        choices: [
          choice('irrational', 'x 是无理数。', true),
          choice('not-integer', 'x 不是整数。'),
          choice('negative', 'x 是负数。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['negation', 'rational-number', 'complement'],
        explanation: '实数分为有理数和无理数，因此不是有理数的实数就是无理数。',
      },
    ],
    simulation: [
      {
        id: 's1',
        label: '(1)',
        prompt: '选择 x>-5 的否定。',
        answerType: 'single-choice',
        choices: [
          choice('le-minus-five', 'x≤-5', true),
          choice('lt-minus-five', 'x<-5'),
          choice('ge-minus-five', 'x≥-5'),
        ],
        score: 2,
        estimatedSeconds: 25,
        knowledgeTags: ['negation', 'inequality'],
        skillTags: ['case-classification'],
      },
      {
        id: 's2',
        label: '(2)',
        prompt: '选择 x+y≠0 的否定。',
        answerType: 'single-choice',
        choices: [
          choice('equals-zero', 'x+y=0', true),
          choice('greater-zero', 'x+y>0'),
          choice('less-equal-zero', 'x+y≤0'),
        ],
        score: 2,
        estimatedSeconds: 25,
        knowledgeTags: ['negation'],
        skillTags: ['case-classification'],
      },
      {
        id: 's3',
        label: '(3)',
        prompt: '选择“实数 x 是有理数”的否定。',
        answerType: 'single-choice',
        choices: [
          choice('irrational', 'x 是无理数。', true),
          choice('not-integer', 'x 不是整数。'),
          choice('negative', 'x 是负数。'),
        ],
        score: 2,
        estimatedSeconds: 25,
        knowledgeTags: ['negation', 'rational-number'],
        skillTags: ['conclusion'],
      },
    ],
    fullExplanation: '条件的否定表示原条件不成立的所有情况。不等式否定时要注意边界，≠ 的否定是 =；在实数范围内，有理数的补集是无理数。',
  },
  {
    problemNo: 102,
    section: 'propositions',
    sectionTitle: '命题与条件',
    title: '“且”与“或”',
    estimatedSeconds: 360,
    knowledgeTags: ['logical-and-or', 'intersection', 'union', 'interval'],
    skillTags: ['condition-reading', 'case-classification', 'conclusion'],
    problem: [
      { type: 'text', text: '求满足下列条件的全体实数 x 所组成的集合。' },
      { type: 'latex', latex: '(1)\\;0<x<3\\;\\text{且}\\;-2<x<2' },
      { type: 'latex', latex: '(2)\\;0<x<3\\;\\text{或}\\;-2<x<2' },
      { type: 'latex', latex: '(3)\\;-1\\le x<2\\;\\text{且}\\;-1<x\\le4' },
      { type: 'latex', latex: '(4)\\;-1\\le x<2\\;\\text{或}\\;-1<x\\le4' },
    ],
    guide: [
      {
        type: 'content',
        blocks: [{ type: 'text', text: '先确认“且”“或”与集合运算之间的共同对应关系。' }],
      },
      { type: 'blank', blankId: 'rule' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(1) 保留同时属于两个区间的范围。' },
          { type: 'latex', latex: 'A=(0,3),\\qquad B=(-2,2)' },
        ],
      },
      { type: 'blank', blankId: 'p1-result' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(2) 对同样的两个区间，合并属于至少一个区间的范围。' },
          { type: 'latex', latex: 'A=(0,3),\\qquad B=(-2,2)' },
        ],
      },
      { type: 'blank', blankId: 'p2-result' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(3) 取交集，并检查左右端点是否同时被两个条件允许。' },
          { type: 'latex', latex: 'A=[-1,2),\\qquad B=(-1,4]' },
        ],
      },
      { type: 'blank', blankId: 'p3-result' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(4) 取并集，只要有一个区间包含某个端点，就把该端点保留下来。' },
          { type: 'latex', latex: 'A=[-1,2),\\qquad B=(-1,4]' },
        ],
      },
      { type: 'blank', blankId: 'p4-result' },
    ],
    blanks: [
      {
        id: 'rule',
        prompt: '“且”“或”与集合运算的对应关系是',
        choices: [
          choice('and-intersection-or-union', '且→交集，或→并集', true),
          choice('and-union-or-intersection', '且→并集，或→交集'),
          choice('both-intersection', '两者都对应交集'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['logical-and-or', 'intersection', 'union'],
        explanation: '“且”要求两个条件同时成立，对应交集；“或”要求至少一个成立，对应并集。',
      },
      {
        id: 'p1-result',
        prompt: '(1) 的两个区间的交集是',
        choices: [
          choice('zero-two-open', '0<x<2', true),
          choice('minus-two-three', '-2<x<3'),
          choice('zero-two-closed', '0≤x≤2'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['intersection', 'interval'],
        explanation: '(0,3) 与 (-2,2) 同时包含的范围是 0<x<2。',
      },
      {
        id: 'p2-result',
        prompt: '(2) 的两个区间的并集是',
        choices: [
          choice('minus-two-three', '-2<x<3', true),
          choice('zero-two-open', '0<x<2'),
          choice('minus-two-three-closed', '-2≤x≤3'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['union', 'interval'],
        explanation: '两个区间有重叠，合并后得到 -2<x<3。',
      },
      {
        id: 'p3-result',
        prompt: '(3) 的交集是',
        choices: [
          choice('minus-one-two-open', '-1<x<2', true),
          choice('left-closed', '-1≤x<2'),
          choice('both-closed', '-1≤x≤2'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['intersection', 'interval'],
        explanation: '-1 不属于 B，2 不属于 A，所以交集两端都不包含，得到 -1<x<2。',
      },
      {
        id: 'p4-result',
        prompt: '(4) 的并集是',
        choices: [
          choice('minus-one-four-closed', '-1≤x≤4', true),
          choice('minus-one-four-open', '-1<x<4'),
          choice('minus-one-two-open', '-1<x<2'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['union', 'interval'],
        explanation: '-1 被 A 包含，4 被 B 包含，所以并集保留两个端点，得到 -1≤x≤4。',
      },
    ],
    simulation: [
      {
        id: 's1',
        label: '(1)',
        prompt: '选择满足 0<x<3 且 -2<x<2 的范围。',
        answerType: 'single-choice',
        choices: [choice('zero-two-open', '0<x<2', true), choice('minus-two-three', '-2<x<3'), choice('zero-two-closed', '0≤x≤2')],
        score: 2,
        estimatedSeconds: 25,
        knowledgeTags: ['intersection', 'interval'],
        skillTags: ['case-classification'],
      },
      {
        id: 's2',
        label: '(2)',
        prompt: '选择满足 0<x<3 或 -2<x<2 的范围。',
        answerType: 'single-choice',
        choices: [choice('minus-two-three', '-2<x<3', true), choice('zero-two-open', '0<x<2'), choice('minus-two-three-closed', '-2≤x≤3')],
        score: 2,
        estimatedSeconds: 25,
        knowledgeTags: ['union', 'interval'],
        skillTags: ['case-classification'],
      },
      {
        id: 's3',
        label: '(3)',
        prompt: '选择满足 -1≤x<2 且 -1<x≤4 的范围。',
        answerType: 'single-choice',
        choices: [choice('minus-one-two-open', '-1<x<2', true), choice('left-closed', '-1≤x<2'), choice('both-closed', '-1≤x≤2')],
        score: 2,
        estimatedSeconds: 25,
        knowledgeTags: ['intersection', 'interval'],
        skillTags: ['case-classification'],
      },
      {
        id: 's4',
        label: '(4)',
        prompt: '选择满足 -1≤x<2 或 -1<x≤4 的范围。',
        answerType: 'single-choice',
        choices: [choice('minus-one-four-closed', '-1≤x≤4', true), choice('minus-one-four-open', '-1<x<4'), choice('minus-one-two-open', '-1<x<2')],
        score: 2,
        estimatedSeconds: 25,
        knowledgeTags: ['union', 'interval'],
        skillTags: ['conclusion'],
      },
    ],
    fullExplanation: '“且”对应交集，“或”对应并集。处理端点时，交集只有在两个条件都包含端点时才保留；并集只要其中一个条件包含端点就保留。',
  },
  {
    problemNo: 103,
    section: 'propositions',
    sectionTitle: '命题与条件',
    title: '复合条件的否定',
    estimatedSeconds: 420,
    knowledgeTags: ['negation', 'de-morgan', 'logical-and-or', 'inequality', 'rational-number'],
    skillTags: ['condition-reading', 'case-classification', 'conclusion'],
    problem: [
      { type: 'text', text: '设 x、y 为实数，n 为自然数。写出下列条件的否定。' },
      { type: 'latex', latex: '(1)\\;x=2\\;\\text{且}\\;y\\ne-1' },
      { type: 'latex', latex: '(2)\\;x>8\\;\\text{或}\\;x=3' },
      { type: 'latex', latex: '(3)\\;5<x\\le10' },
      { type: 'text', text: '(4) n 是偶数或 5 的倍数。' },
      { type: 'text', text: '(5) x、y 中至少一个是无理数。' },
    ],
    guide: [
      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: '要使“且”整体不成立，只需至少一个条件失败；要使“或”整体不成立，则两个条件都必须失败。由这个意义建立复合条件的否定规则。',
        }],
      },
      { type: 'blank', blankId: 'rule' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(1) 是“且”条件。分别否定两个基本条件，再按照整体失败的方式重新连接。' }],
      },
      { type: 'blank', blankId: 'p1-result' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(2) 是“或”条件。要让整体不成立，原来的两个条件必须都不成立。' }],
      },
      { type: 'blank', blankId: 'p2-result' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(3) 先把连续不等式看成两个条件的“且”。' },
          { type: 'latex', latex: 'x>5\\;\\text{且}\\;x\\le10' },
        ],
      },
      { type: 'blank', blankId: 'p3-result' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(4) 原条件要求“偶数”和“5的倍数”中至少一个成立。否定整体时，要把两个性质都否定。' }],
      },
      { type: 'blank', blankId: 'p4-result' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(5) “至少一个是无理数”等价于“x是无理数或y是无理数”。思考这个条件完全不成立时的情况。' }],
      },
      { type: 'blank', blankId: 'p5-result' },
    ],
    blanks: [
      {
        id: 'rule',
        prompt: '否定复合条件时，正确的对应关系是',
        choices: [
          choice('de-morgan', '且→用“或”连接各自的否定；或→用“且”连接各自的否定', true),
          choice('keep-connective', '且→仍用“且”连接否定；或→仍用“或”连接否定'),
          choice('swap-only', '只交换连接词，各基本条件不需要否定'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['negation', 'de-morgan', 'logical-and-or'],
        explanation: '使“且”失败只需至少一个失败，使“或”失败必须两个都失败，因此既要否定各基本条件，也要交换连接方式。',
      },
      {
        id: 'p1-result',
        prompt: '(1) 的否定是',
        choices: [
          choice('correct', 'x≠2 或 y=-1', true),
          choice('and', 'x≠2 且 y=-1'),
          choice('wrong-y', 'x≠2 或 y≠-1'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['negation', 'de-morgan'],
        explanation: 'x=2 的否定是 x≠2，y≠-1 的否定是 y=-1；原来是“且”，所以否定后用“或”连接。',
      },
      {
        id: 'p2-result',
        prompt: '(2) 的否定是',
        choices: [
          choice('correct', 'x≤8 且 x≠3', true),
          choice('or', 'x≤8 或 x≠3'),
          choice('boundary-loss', 'x<8 且 x≠3'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['negation', 'de-morgan', 'inequality'],
        explanation: 'x>8 的否定是包含边界的 x≤8，x=3 的否定是 x≠3；原来是“或”，否定后用“且”连接。',
      },
      {
        id: 'p3-result',
        prompt: '(3) 的否定是',
        choices: [
          choice('correct', 'x≤5 或 x>10', true),
          choice('boundary-wrong', 'x<5 或 x≥10'),
          choice('inside', '5≤x<10'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['negation', 'de-morgan', 'inequality'],
        explanation: '5<x≤10 等价于 x>5 且 x≤10。分别否定得到 x≤5 与 x>10，再用“或”连接。',
      },
      {
        id: 'p4-result',
        prompt: '(4) 的否定是',
        choices: [
          choice('correct', 'n 是奇数且不是 5 的倍数。', true),
          choice('or', 'n 是奇数或不是 5 的倍数。'),
          choice('even-not-five', 'n 是偶数且不是 5 的倍数。'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['negation', 'de-morgan'],
        explanation: '偶数的否定是奇数，“5的倍数”的否定是“不是5的倍数”；原条件是“或”，因此否定后两者要同时成立。',
      },
      {
        id: 'p5-result',
        prompt: '(5) 的否定是',
        choices: [
          choice('both-rational', 'x、y 都是有理数。', true),
          choice('both-irrational', 'x、y 都是无理数。'),
          choice('at-least-rational', 'x、y 中至少一个是有理数。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['negation', 'de-morgan', 'rational-number'],
        explanation: '“至少一个是无理数”的否定是“两个都不是无理数”。x、y 是实数，所以两者都必须是有理数。',
      },
    ],
    simulation: [
      {
        id: 's1',
        label: '(1)',
        prompt: '选择 x=2 且 y≠-1 的否定。',
        answerType: 'single-choice',
        choices: [choice('correct', 'x≠2 或 y=-1', true), choice('and', 'x≠2 且 y=-1'), choice('wrong-y', 'x≠2 或 y≠-1')],
        score: 2,
        estimatedSeconds: 25,
        knowledgeTags: ['negation', 'de-morgan'],
        skillTags: ['case-classification'],
      },
      {
        id: 's2',
        label: '(2)',
        prompt: '选择 x>8 或 x=3 的否定。',
        answerType: 'single-choice',
        choices: [choice('correct', 'x≤8 且 x≠3', true), choice('or', 'x≤8 或 x≠3'), choice('boundary-loss', 'x<8 且 x≠3')],
        score: 2,
        estimatedSeconds: 25,
        knowledgeTags: ['negation', 'de-morgan', 'inequality'],
        skillTags: ['case-classification'],
      },
      {
        id: 's3',
        label: '(3)',
        prompt: '选择 5<x≤10 的否定。',
        answerType: 'single-choice',
        choices: [choice('correct', 'x≤5 或 x>10', true), choice('boundary-wrong', 'x<5 或 x≥10'), choice('inside', '5≤x<10')],
        score: 2,
        estimatedSeconds: 25,
        knowledgeTags: ['negation', 'de-morgan', 'inequality'],
        skillTags: ['case-classification'],
      },
      {
        id: 's4',
        label: '(4)',
        prompt: '选择“n 是偶数或5的倍数”的否定。',
        answerType: 'single-choice',
        choices: [choice('correct', 'n 是奇数且不是 5 的倍数。', true), choice('or', 'n 是奇数或不是 5 的倍数。'), choice('even-not-five', 'n 是偶数且不是 5 的倍数。')],
        score: 2,
        estimatedSeconds: 25,
        knowledgeTags: ['negation', 'de-morgan'],
        skillTags: ['case-classification'],
      },
      {
        id: 's5',
        label: '(5)',
        prompt: '选择“x、y 中至少一个是无理数”的否定。',
        answerType: 'single-choice',
        choices: [choice('both-rational', 'x、y 都是有理数。', true), choice('both-irrational', 'x、y 都是无理数。'), choice('at-least-rational', 'x、y 中至少一个是有理数。')],
        score: 2,
        estimatedSeconds: 25,
        knowledgeTags: ['negation', 'de-morgan', 'rational-number'],
        skillTags: ['conclusion'],
      },
    ],
    fullExplanation: '复合条件的否定需要先否定每个基本条件，再使用 De Morgan 对应：“且”的否定用“或”连接，“或”的否定用“且”连接。“至少一个”的否定就是“两个都不”。',
  },
  {
    problemNo: 104,
    section: 'propositions',
    sectionTitle: '命题与条件',
    title: '必要条件与充分条件',
    estimatedSeconds: 600,
    knowledgeTags: ['necessary-condition', 'sufficient-condition', 'implication', 'equivalence'],
    skillTags: ['condition-reading', 'case-classification', 'conclusion'],
    problem: [
      { type: 'text', text: '设 x、y 为实数。在□中，从“必要但不充分”“充分但不必要”“充要条件”“既不必要也不充分”中选择合适的分类。' },
      { type: 'latex', latex: '(1)\\;x=2\\;\\text{ 是 }\\;x^2-5x+6=0\\;\\text{ 的□}' },
      { type: 'latex', latex: '(2)\\;x\\ne0\\;\\text{ 是 }\\;(x-1)(x-2)=0\\;\\text{ 的□}' },
      { type: 'latex', latex: '(3)\\;xy=1\\;\\text{ 是 }\\;x=1\\;\\text{ 的□}' },
      { type: 'latex', latex: '(4)\\;|x|=0\\;\\text{ 是 }\\;x=0\\;\\text{ 的□}' },
      { type: 'latex', latex: '(5)\\;x=y=2\\;\\text{ 是 }\\;2x-y=2y-2=2\\;\\text{ 的□}' },
      { type: 'text', text: '(6) 四边形ABCD是菱形，是四边形ABCD为正方形的□。' },
    ],
    guide: [
      {
        type: 'content',
        blocks: [{ type: 'text', text: '先固定判断方向：要判断 p 是 q 的什么条件，必须分别检查 p⇒q 与 q⇒p。' }],
      },
      { type: 'blank', blankId: 'rule' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(1) 令 p:x=2，q:x²-5x+6=0。p 到 q 可直接代入，反方向要看方程的全部解。' },
          { type: 'latex', latex: '2^2-5\\cdot2+6=0' },
          { type: 'latex', latex: 'x^2-5x+6=(x-2)(x-3)=0\\Rightarrow x=2,3' },
          { type: 'text', text: '所以 p⇒q 为真，但 q⇒p 因为还有 x=3 而为假。' },
        ],
      },
      { type: 'blank', blankId: 'p1-classification' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(2) 令 p:x≠0，q:(x-1)(x-2)=0。q 的解为 x=1,2，所以 q⇒p 为真；但 x=3 满足 p 而不满足 q，所以 p⇒q 为假。' }],
      },
      { type: 'blank', blankId: 'p2-classification' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(3) 令 p:xy=1，q:x=1。x=2,y=1/2 满足 p 但不满足 q；x=1,y=0 满足 q 但不满足 p。' }],
      },
      { type: 'blank', blankId: 'p3-classification' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(4) 令 p:|x|=0，q:x=0。绝对值等于0时只能有 x=0，反过来 x=0 时 |x|=0 也成立。' }],
      },
      { type: 'blank', blankId: 'p4-classification' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(5) 令 p:x=y=2。代入可确认 p⇒q。反方向则从右侧条件直接解出 x,y。' },
          { type: 'latex', latex: '2y-2=2\\Rightarrow y=2' },
          { type: 'latex', latex: '2x-y=2,\\;y=2\\Rightarrow x=2' },
          { type: 'text', text: '因此两个方向都成立。' },
        ],
      },
      { type: 'blank', blankId: 'p5-classification' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(6) 令 p:菱形，q:正方形。正方形四边相等，所以 q⇒p 为真；但存在不是正方形的菱形，因此 p⇒q 为假。' }],
      },
      { type: 'blank', blankId: 'p6-classification' },
    ],
    blanks: [
      {
        id: 'rule',
        prompt: '判断 p 是 q 的什么条件时，正确的方向对应是',
        choices: [
          choice('direction-map', 'p⇒q 为真，则 p 是充分条件；q⇒p 为真，则 p 是必要条件。', true),
          choice('reversed-map', 'p⇒q 为真，则 p 是必要条件；q⇒p 为真，则 p 是充分条件。'),
          choice('both-needed', '只有两个方向都为真时，才能称为必要条件或充分条件。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['necessary-condition', 'sufficient-condition', 'implication'],
        explanation: 'p⇒q 表示 p 足以保证 q，因此 p 是充分条件；q⇒p 表示 q 成立时 p 必须成立，因此 p 是必要条件。',
      },
      {
        id: 'p1-classification',
        prompt: '根据 (1) 两个方向的真假，p 应分类为',
        choices: [
          choice('sufficient-only', 'p⇒q:真，q⇒p:假 → 充分但不必要。', true),
          choice('necessary-only', 'p⇒q:假，q⇒p:真 → 必要但不充分。'),
          choice('iff', '两个方向都真 → 充要条件。'),
          choice('neither', '两个方向都假 → 既不必要也不充分。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['necessary-condition', 'sufficient-condition'],
        explanation: '只有 p⇒q 成立，所以 p 是充分条件，但不是必要条件。',
      },
      {
        id: 'p2-classification',
        prompt: '根据 (2) 两个方向的真假，p 应分类为',
        choices: [
          choice('necessary-only', 'p⇒q:假，q⇒p:真 → 必要但不充分。', true),
          choice('sufficient-only', 'p⇒q:真，q⇒p:假 → 充分但不必要。'),
          choice('iff', '两个方向都真 → 充要条件。'),
          choice('neither', '两个方向都假 → 既不必要也不充分。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['necessary-condition', 'sufficient-condition'],
        explanation: '只有 q⇒p 成立，所以 p 是必要条件，但不是充分条件。',
      },
      {
        id: 'p3-classification',
        prompt: '根据 (3) 两个方向的真假，p 应分类为',
        choices: [
          choice('neither', '两个方向都假 → 既不必要也不充分。', true),
          choice('sufficient-only', 'p⇒q:真，q⇒p:假 → 充分但不必要。'),
          choice('necessary-only', 'p⇒q:假，q⇒p:真 → 必要但不充分。'),
          choice('iff', '两个方向都真 → 充要条件。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['necessary-condition', 'sufficient-condition', 'counterexample'],
        explanation: '两个方向都有反例，因此 p 既不是必要条件，也不是充分条件。',
      },
      {
        id: 'p4-classification',
        prompt: '根据 (4) 两个方向的真假，p 应分类为',
        choices: [
          choice('iff', '两个方向都真 → 充要条件。', true),
          choice('sufficient-only', 'p⇒q:真，q⇒p:假 → 充分但不必要。'),
          choice('necessary-only', 'p⇒q:假，q⇒p:真 → 必要但不充分。'),
          choice('neither', '两个方向都假 → 既不必要也不充分。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['necessary-condition', 'sufficient-condition', 'equivalence'],
        explanation: '|x|=0 与 x=0 能互相推出，因此是充要条件。',
      },
      {
        id: 'p5-classification',
        prompt: '根据 (5) 两个方向的真假，p 应分类为',
        choices: [
          choice('iff', '两个方向都真 → 充要条件。', true),
          choice('necessary-only', 'p⇒q:假，q⇒p:真 → 必要但不充分。'),
          choice('sufficient-only', 'p⇒q:真，q⇒p:假 → 充分但不必要。'),
          choice('neither', '两个方向都假 → 既不必要也不充分。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['necessary-condition', 'sufficient-condition', 'equivalence'],
        explanation: '代入可确认 p⇒q；从右侧联立条件又唯一得到 x=y=2，因此 q⇒p 也成立。',
      },
      {
        id: 'p6-classification',
        prompt: '根据 (6) 两个方向的真假，p 应分类为',
        choices: [
          choice('necessary-only', 'p⇒q:假，q⇒p:真 → 必要但不充分。', true),
          choice('sufficient-only', 'p⇒q:真，q⇒p:假 → 充分但不必要。'),
          choice('iff', '两个方向都真 → 充要条件。'),
          choice('neither', '两个方向都假 → 既不必要也不充分。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['necessary-condition', 'sufficient-condition'],
        explanation: '正方形一定是菱形，但菱形不一定是正方形，因此 p 是必要条件但不充分。',
      },
    ],
    simulation: [
      {
        id: 's1',
        label: '(1)',
        prompt: 'x=2 是 x²-5x+6=0 的什么条件？',
        answerType: 'single-choice',
        choices: [choice('sufficient-only', '充分但不必要。', true), choice('necessary-only', '必要但不充分。'), choice('iff', '充要条件。'), choice('neither', '既不必要也不充分。')],
        score: 2, estimatedSeconds: 30,
        knowledgeTags: ['necessary-condition', 'sufficient-condition'], skillTags: ['conclusion'],
      },
      {
        id: 's2',
        label: '(2)',
        prompt: 'x≠0 是 (x-1)(x-2)=0 的什么条件？',
        answerType: 'single-choice',
        choices: [choice('necessary-only', '必要但不充分。', true), choice('sufficient-only', '充分但不必要。'), choice('iff', '充要条件。'), choice('neither', '既不必要也不充分。')],
        score: 2, estimatedSeconds: 30,
        knowledgeTags: ['necessary-condition', 'sufficient-condition'], skillTags: ['conclusion'],
      },
      {
        id: 's3',
        label: '(3)',
        prompt: 'xy=1 是 x=1 的什么条件？',
        answerType: 'single-choice',
        choices: [choice('neither', '既不必要也不充分。', true), choice('sufficient-only', '充分但不必要。'), choice('necessary-only', '必要但不充分。'), choice('iff', '充要条件。')],
        score: 2, estimatedSeconds: 30,
        knowledgeTags: ['necessary-condition', 'sufficient-condition'], skillTags: ['conclusion'],
      },
      {
        id: 's4',
        label: '(4)',
        prompt: '|x|=0 是 x=0 的什么条件？',
        answerType: 'single-choice',
        choices: [choice('iff', '充要条件。', true), choice('sufficient-only', '充分但不必要。'), choice('necessary-only', '必要但不充分。'), choice('neither', '既不必要也不充分。')],
        score: 2, estimatedSeconds: 30,
        knowledgeTags: ['necessary-condition', 'sufficient-condition', 'equivalence'], skillTags: ['conclusion'],
      },
      {
        id: 's5',
        label: '(5)',
        prompt: 'x=y=2 是 2x-y=2y-2=2 的什么条件？',
        answerType: 'single-choice',
        choices: [choice('iff', '充要条件。', true), choice('necessary-only', '必要但不充分。'), choice('sufficient-only', '充分但不必要。'), choice('neither', '既不必要也不充分。')],
        score: 2, estimatedSeconds: 30,
        knowledgeTags: ['necessary-condition', 'sufficient-condition', 'equivalence'], skillTags: ['conclusion'],
      },
      {
        id: 's6',
        label: '(6)',
        prompt: '“是菱形”是“是正方形”的什么条件？',
        answerType: 'single-choice',
        choices: [choice('necessary-only', '必要但不充分。', true), choice('sufficient-only', '充分但不必要。'), choice('iff', '充要条件。'), choice('neither', '既不必要也不充分。')],
        score: 2, estimatedSeconds: 30,
        knowledgeTags: ['necessary-condition', 'sufficient-condition'], skillTags: ['conclusion'],
      },
    ],
    fullExplanation: '判断 p 是 q 的什么条件时，要分别检查 p⇒q 和 q⇒p。p⇒q 为真说明 p 是充分条件；q⇒p 为真说明 p 是必要条件；两个方向都真则为充要条件，两个方向都假则两者都不是。',
  },
  {
    problemNo: 105,
    section: 'propositions',
    sectionTitle: '命题与条件',
    title: '命题的真假',
    estimatedSeconds: 420,
    knowledgeTags: ['truth-value', 'implication', 'counterexample', 'rational-number'],
    skillTags: ['condition-reading', 'case-classification', 'conclusion'],
    problem: [
      { type: 'text', text: '设 a、b 为实数。判断下列命题的真假。' },
      { type: 'latex', latex: '(1)\\;ab=0\\Rightarrow a^2+b^2=0' },
      { type: 'latex', latex: '(2)\\;a^2=4\\Rightarrow |a+1|\\ge1' },
      { type: 'text', text: '(3) 若 ab 是有理数，则 a、b 都是有理数。' },
      { type: 'text', text: '(4) 若 a+b 与 ab 都是有理数，则 a、b 都是有理数。' },
    ],
    guide: [
      {
        type: 'content',
        blocks: [{ type: 'text', text: '先区分：证明蕴含命题为真和证明它为假，各自需要检查什么。' }],
      },
      { type: 'blank', blankId: 'rule' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(1) 从 ab=0 只能得到“至少一个为0”，并不能直接得到两个都为0。寻找一个满足前件但破坏后件的具体例子。' }],
      },
      { type: 'blank', blankId: 'p1-result' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(2) 先列出前件允许的全部 a，再逐一检查后件。' },
          { type: 'latex', latex: 'a^2=4\\Rightarrow a=2\\;\\text{或}\\;a=-2' },
          { type: 'latex', latex: 'a=2:\\ |a+1|=3\\ge1' },
          { type: 'latex', latex: 'a=-2:\\ |a+1|=1\\ge1' },
        ],
      },
      { type: 'blank', blankId: 'p2-result' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(3) 注意“乘积是有理数”并不保证每个因子都是有理数。寻找两个无理数相乘得到有理数的例子。' }],
      },
      { type: 'blank', blankId: 'p3-result' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(4) 要同时让和与积都是有理数，同时保持 a、b 本身为无理数。寻找满足这两个要求的一组数。' }],
      },
      { type: 'blank', blankId: 'p4-result' },
    ],
    blanks: [
      {
        id: 'rule',
        prompt: '判断命题 p⇒q 的真假时，正确的证明要求是',
        choices: [
          choice('all-vs-counterexample', '要证明为真，需对所有满足 p 的情况证明 q；要证明为假，只需一个满足 p 但不满足 q 的反例。', true),
          choice('one-example-both', '无论证明真还是假，只检查一个具体例子即可。'),
          choice('counterexample-for-true', '证明为真时只需找到一个反例。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['truth-value', 'implication', 'counterexample'],
        explanation: '蕴含为真要求所有前件成立的情况都满足后件；蕴含为假只需要一个“前件真、后件假”的反例。',
      },
      {
        id: 'p1-result',
        prompt: '能够判断 (1) 的反例与结论是',
        choices: [
          choice('counterexample-false', 'a=0,b=1 时 ab=0，但 a²+b²=1≠0，所以为假。', true),
          choice('zero-zero-true', 'a=0,b=0 时后件成立，所以为真。'),
          choice('one-one-false', 'a=1,b=1 是反例，所以为假。'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['truth-value', 'counterexample'],
        explanation: 'a=0,b=1 满足前件，却不满足后件，因此是有效反例。',
      },
      {
        id: 'p2-result',
        prompt: '由 (2) 的全部情况可知',
        choices: [
          choice('both-cases-true', 'a=2 与 a=-2 时 |a+1|≥1 都成立，所以为真。', true),
          choice('positive-only', '只检查 a=2 就可以判定为真。'),
          choice('negative-false', 'a=-2 时 |a+1|<1，所以为假。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['truth-value', 'implication'],
        explanation: 'a²=4 只有 ±2 两种可能，两种都满足后件，因此命题为真。',
      },
      {
        id: 'p3-result',
        prompt: '能够判断 (3) 的反例与结论是',
        choices: [
          choice('sqrt-two-false', 'a=b=√2 时 ab=2 是有理数，但 a,b 都是无理数，所以为假。', true),
          choice('rational-example-true', 'a=b=1 时前后件都成立，所以为真。'),
          choice('mixed-counterexample', 'a=√2,b=1 是反例，所以为假。'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['truth-value', 'counterexample', 'rational-number'],
        explanation: '√2×√2=2 是有理数，而两个因子本身都是无理数。',
      },
      {
        id: 'p4-result',
        prompt: '能够判断 (4) 的反例与结论是',
        choices: [
          choice('conjugate-false', 'a=√2,b=-√2 时 a+b=0、ab=-2 都是有理数，但 a,b 是无理数，所以为假。', true),
          choice('same-root-false', 'a=b=√2 时和与积都为有理数，所以为假。'),
          choice('rational-example-true', 'a=b=1 时和与积都是有理数，所以为真。'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['truth-value', 'counterexample', 'rational-number'],
        explanation: '√2 与 -√2 的和为0、积为-2，前件成立，但两数都不是有理数，因此是反例。',
      },
    ],
    simulation: [
      {
        id: 's1', label: '(1)', prompt: '判断 ab=0 ⇒ a²+b²=0 的真假。', answerType: 'single-choice',
        choices: [choice('false', '假', true), choice('true', '真')],
        score: 2, estimatedSeconds: 25, knowledgeTags: ['truth-value', 'counterexample'], skillTags: ['conclusion'],
      },
      {
        id: 's2', label: '(2)', prompt: '判断 a²=4 ⇒ |a+1|≥1 的真假。', answerType: 'single-choice',
        choices: [choice('true', '真', true), choice('false', '假')],
        score: 2, estimatedSeconds: 25, knowledgeTags: ['truth-value', 'implication'], skillTags: ['conclusion'],
      },
      {
        id: 's3', label: '(3)', prompt: '判断“ab 是有理数 ⇒ a、b 都是有理数”的真假。', answerType: 'single-choice',
        choices: [choice('false', '假', true), choice('true', '真')],
        score: 2, estimatedSeconds: 25, knowledgeTags: ['truth-value', 'counterexample', 'rational-number'], skillTags: ['conclusion'],
      },
      {
        id: 's4', label: '(4)', prompt: '判断“a+b、ab 都是有理数 ⇒ a、b 都是有理数”的真假。', answerType: 'single-choice',
        choices: [choice('false', '假', true), choice('true', '真')],
        score: 2, estimatedSeconds: 25, knowledgeTags: ['truth-value', 'counterexample', 'rational-number'], skillTags: ['conclusion'],
      },
    ],
    fullExplanation: '证明蕴含为真需要覆盖前件成立的全部情况；证明为假只需一个反例。(2) 要完整检查 a=±2；(1)(3)(4) 都可由明确反例判为假。',
  },
  {
    problemNo: 106,
    section: 'propositions',
    sectionTitle: '命题与条件',
    title: '用集合表示条件',
    estimatedSeconds: 360,
    knowledgeTags: ['set-expression', 'intersection', 'complement', 'divisibility'],
    skillTags: ['condition-reading', 'case-classification', 'conclusion'],
    problem: [
      { type: 'text', text: '以全体自然数为全集。设 P 为2的倍数组成的集合，Q 为3的倍数组成的集合。用 P、Q 表示满足下列条件的自然数集合。' },
      { type: 'text', text: '(1) 6的倍数' },
      { type: 'text', text: '(2) 奇数' },
      { type: 'text', text: '(3) 3的倍数且为奇数' },
      { type: 'text', text: '(4) 不是3的倍数的奇数' },
    ],
    guide: [
      {
        type: 'content',
        blocks: [{ type: 'text', text: '先确认把“且”和“不是”翻译成集合运算的共同规则。P 表示2的倍数，Q 表示3的倍数。' }],
      },
      { type: 'blank', blankId: 'rule' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(1) 6的倍数既是2的倍数，也是3的倍数，因此要取同时属于 P 和 Q 的自然数。' }],
      },
      { type: 'blank', blankId: 'p1-result' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(2) 奇数就是自然数中不是2的倍数的数，因此要看 P 的外部。' }],
      },
      { type: 'blank', blankId: 'p2-result' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(3) “3的倍数”对应 Q，“奇数”对应不是2的倍数，再把这两个条件同时满足。' }],
      },
      { type: 'blank', blankId: 'p3-result' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(4) 分别把“不是3的倍数”和“奇数”翻译为 Q、P 的相应部分，再取同时满足两者的集合。' }],
      },
      { type: 'blank', blankId: 'p4-result' },
    ],
    blanks: [
      {
        id: 'rule',
        prompt: '语言条件与集合运算的正确对应是',
        choices: [
          choice('and-complement', '“且”→交集，“不是”→补集', true),
          choice('union-complement', '“且”→并集，“不是”→补集'),
          choice('and-union', '“且”→交集，“不是”→并集'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['set-expression', 'intersection', 'complement'],
        explanation: '两个条件同时满足对应交集；不属于某集合对应补集。',
      },
      {
        id: 'p1-result',
        prompt: '6的倍数全体用 P、Q 表示为',
        choices: [
          choice('p-inter-q', 'P∩Q', true),
          choice('p-union-q', 'P∪Q'),
          choice('p-complement', 'P̄'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['intersection', 'divisibility'],
        explanation: '6的倍数同时是2和3的倍数，所以是 P 与 Q 的交集。',
      },
      {
        id: 'p2-result',
        prompt: '奇数全体用 P、Q 表示为',
        choices: [
          choice('p-complement', 'P̄', true),
          choice('p', 'P'),
          choice('q-complement', 'Q̄'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['complement', 'divisibility'],
        explanation: '自然数中的奇数就是不是2的倍数的数，所以是 P 的补集。',
      },
      {
        id: 'p3-result',
        prompt: '3的倍数且为奇数的自然数全体是',
        choices: [
          choice('q-inter-pbar', 'Q∩P̄', true),
          choice('q-union-pbar', 'Q∪P̄'),
          choice('p-inter-qbar', 'P∩Q̄'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['intersection', 'complement', 'divisibility'],
        explanation: '3的倍数属于 Q，奇数属于 P 的补集，同时满足两者得到 Q∩P̄。',
      },
      {
        id: 'p4-result',
        prompt: '不是3的倍数的奇数全体是',
        choices: [
          choice('qbar-inter-pbar', 'Q̄∩P̄', true),
          choice('qbar-union-pbar', 'Q̄∪P̄'),
          choice('q-inter-pbar', 'Q∩P̄'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['intersection', 'complement', 'divisibility'],
        explanation: '不是3的倍数属于 Q̄，奇数属于 P̄，同时满足两者得到 Q̄∩P̄。',
      },
    ],
    simulation: [
      {
        id: 's1', label: '(1)', prompt: '用 P、Q 表示6的倍数全体。', answerType: 'single-choice',
        choices: [choice('p-inter-q', 'P∩Q', true), choice('p-union-q', 'P∪Q'), choice('p-complement', 'P̄')],
        score: 2, estimatedSeconds: 25, knowledgeTags: ['intersection', 'divisibility'], skillTags: ['case-classification'],
      },
      {
        id: 's2', label: '(2)', prompt: '用 P、Q 表示奇数全体。', answerType: 'single-choice',
        choices: [choice('p-complement', 'P̄', true), choice('p', 'P'), choice('q-complement', 'Q̄')],
        score: 2, estimatedSeconds: 25, knowledgeTags: ['complement', 'divisibility'], skillTags: ['case-classification'],
      },
      {
        id: 's3', label: '(3)', prompt: '表示3的倍数且为奇数的自然数全体。', answerType: 'single-choice',
        choices: [choice('q-inter-pbar', 'Q∩P̄', true), choice('q-union-pbar', 'Q∪P̄'), choice('p-inter-qbar', 'P∩Q̄')],
        score: 2, estimatedSeconds: 25, knowledgeTags: ['intersection', 'complement'], skillTags: ['conclusion'],
      },
      {
        id: 's4', label: '(4)', prompt: '表示不是3的倍数的奇数全体。', answerType: 'single-choice',
        choices: [choice('qbar-inter-pbar', 'Q̄∩P̄', true), choice('qbar-union-pbar', 'Q̄∪P̄'), choice('q-inter-pbar', 'Q∩P̄')],
        score: 2, estimatedSeconds: 25, knowledgeTags: ['intersection', 'complement'], skillTags: ['conclusion'],
      },
    ],
    fullExplanation: 'P 表示2的倍数，Q 表示3的倍数。“且”对应交集，“不是”对应补集。因此6的倍数是 P∩Q，奇数是 P̄，3的倍数且为奇数是 Q∩P̄，不是3的倍数的奇数是 Q̄∩P̄。',
  },
  {
    problemNo: 107,
    section: 'propositions',
    sectionTitle: '命题与条件',
    title: '必要与充分条件的判断',
    estimatedSeconds: 600,
    knowledgeTags: ['necessary-condition', 'sufficient-condition', 'implication', 'counterexample', 'geometry'],
    skillTags: ['condition-reading', 'case-classification', 'conclusion'],
    problem: [
      { type: 'text', text: '设 x、y、z 为实数。判断左侧条件是右侧条件的什么条件。' },
      { type: 'latex', latex: '(1)\\;(x-y)(y-z)=0\\quad/\\quad x=y=z' },
      { type: 'latex', latex: '(2)\\;x>0\\;\\text{且}\\;y<0\\quad/\\quad xy<0' },
      { type: 'latex', latex: '(3)\\;x=y=0\\quad/\\quad xy=0\\;\\text{且}\\;x+y=0' },
      { type: 'text', text: '(4) ∠A<90° ／ △ABC 为锐角三角形' },
      { type: 'text', text: '(5) 设 △ABC 的边 BC、CA、AB 长分别为 a、b、c。(a-b)(a²+b²-c²)=0 ／ △ABC 为直角等腰三角形' },
    ],
    guide: [
      {
        type: 'content',
        blocks: [{ type: 'text', text: '沿用104的方法：把左侧记为 p、右侧记为 q，分别判断 p⇒q 和 q⇒p，再分类必要与充分关系。' }],
      },
      { type: 'blank', blankId: 'rule' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(1) 从 p 只能知道 x=y 或 y=z 至少一个成立。取 x=0,y=0,z=1 时 p 成立而 q 不成立；反过来 q 成立时两个因子都为0。' }],
      },
      { type: 'blank', blankId: 'p1-classification' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(2) p 成立时正数乘负数，所以 xy<0；但 xy<0 时也可能出现 x=-1,y=1 这种符号顺序相反的情况。' }],
      },
      { type: 'blank', blankId: 'p2-classification' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(3) x=y=0 时右侧两条件成立。反过来，xy=0 说明至少一个为0，再结合 x+y=0，另一个也必须为0。' }],
      },
      { type: 'blank', blankId: 'p3-classification' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(4) 锐角三角形一定满足 ∠A<90°；但 A=60°,B=100°,C=20° 时 ∠A<90°，却不是锐角三角形。' }],
      },
      { type: 'blank', blankId: 'p4-classification' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(5) 左侧只要求 a=b 或 a²+b²=c² 至少一个成立。正三角形 a=b=c=1 满足左侧，却不是直角等腰三角形。' },
          { type: 'text', text: '反方向取 A 为直角、b=c=1、a=√2 的直角等腰三角形，右侧成立，但左侧两个因子都不为0。' },
        ],
      },
      { type: 'blank', blankId: 'p5-classification' },
    ],
    blanks: [
      {
        id: 'rule',
        prompt: '左侧记为 p、右侧记为 q 时，正确的判断规则是',
        choices: [
          choice('direction-map', 'p⇒q 为真则 p 是充分条件；q⇒p 为真则 p 是必要条件。', true),
          choice('reversed-map', 'p⇒q 为真则 p 是必要条件；q⇒p 为真则 p 是充分条件。'),
          choice('one-direction-enough', '只要一个方向为真，就一定是充要条件。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['necessary-condition', 'sufficient-condition', 'implication'],
        explanation: 'p 能保证 q 时是充分条件；q 成立必需 p 时，p 是必要条件。',
      },
      {
        id: 'p1-classification',
        prompt: '根据 (1) 两个方向的真假分类',
        choices: [
          choice('necessary-only', 'p⇒q:假，q⇒p:真 → 必要但不充分。', true),
          choice('sufficient-only', 'p⇒q:真，q⇒p:假 → 充分但不必要。'),
          choice('iff', '两个方向都真 → 充要条件。'),
          choice('neither', '两个方向都假 → 既不必要也不充分。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['necessary-condition', 'sufficient-condition', 'counterexample'],
        explanation: 'p 不能推出三个数全相等，但 q 成立时 p 必然成立，因此 p 必要但不充分。',
      },
      {
        id: 'p2-classification',
        prompt: '根据 (2) 两个方向的真假分类',
        choices: [
          choice('sufficient-only', 'p⇒q:真，q⇒p:假 → 充分但不必要。', true),
          choice('necessary-only', 'p⇒q:假，q⇒p:真 → 必要但不充分。'),
          choice('iff', '两个方向都真 → 充要条件。'),
          choice('neither', '两个方向都假 → 既不必要也不充分。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['necessary-condition', 'sufficient-condition', 'counterexample'],
        explanation: '正×负必为负，但积为负也可能是负×正，所以 p 充分但不必要。',
      },
      {
        id: 'p3-classification',
        prompt: '根据 (3) 两个方向的真假分类',
        choices: [
          choice('iff', '两个方向都真 → 充要条件。', true),
          choice('necessary-only', 'p⇒q:假，q⇒p:真 → 必要但不充分。'),
          choice('sufficient-only', 'p⇒q:真，q⇒p:假 → 充分但不必要。'),
          choice('neither', '两个方向都假 → 既不必要也不充分。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['necessary-condition', 'sufficient-condition', 'equivalence'],
        explanation: '右侧两个条件也能推出 x=y=0，因此两个方向都成立。',
      },
      {
        id: 'p4-classification',
        prompt: '根据 (4) 两个方向的真假分类',
        choices: [
          choice('necessary-only', 'p⇒q:假，q⇒p:真 → 必要但不充分。', true),
          choice('sufficient-only', 'p⇒q:真，q⇒p:假 → 充分但不必要。'),
          choice('iff', '两个方向都真 → 充要条件。'),
          choice('neither', '两个方向都假 → 既不必要也不充分。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['necessary-condition', 'sufficient-condition', 'geometry'],
        explanation: '锐角三角形的 A 必为锐角，但只知道 A 为锐角不能保证另外两角也为锐角。',
      },
      {
        id: 'p5-classification',
        prompt: '根据 (5) 两个方向的真假分类',
        choices: [
          choice('neither', '两个方向都假 → 既不必要也不充分。', true),
          choice('necessary-only', 'p⇒q:假，q⇒p:真 → 必要但不充分。'),
          choice('sufficient-only', 'p⇒q:真，q⇒p:假 → 充分但不必要。'),
          choice('iff', '两个方向都真 → 充要条件。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['necessary-condition', 'sufficient-condition', 'counterexample', 'geometry'],
        explanation: '正三角形给出 p⇒q 的反例；直角位于 A 的等腰直角三角形给出 q⇒p 的反例，因此两个方向都不成立。',
      },
    ],
    simulation: [
      {
        id: 's1', label: '(1)', prompt: '(x-y)(y-z)=0 是 x=y=z 的什么条件？', answerType: 'single-choice',
        choices: [choice('necessary-only', '必要但不充分。', true), choice('sufficient-only', '充分但不必要。'), choice('iff', '充要条件。'), choice('neither', '既不必要也不充分。')],
        score: 2, estimatedSeconds: 30, knowledgeTags: ['necessary-condition', 'sufficient-condition'], skillTags: ['conclusion'],
      },
      {
        id: 's2', label: '(2)', prompt: 'x>0 且 y<0 是 xy<0 的什么条件？', answerType: 'single-choice',
        choices: [choice('sufficient-only', '充分但不必要。', true), choice('necessary-only', '必要但不充分。'), choice('iff', '充要条件。'), choice('neither', '既不必要也不充分。')],
        score: 2, estimatedSeconds: 30, knowledgeTags: ['necessary-condition', 'sufficient-condition'], skillTags: ['conclusion'],
      },
      {
        id: 's3', label: '(3)', prompt: 'x=y=0 是“xy=0 且 x+y=0”的什么条件？', answerType: 'single-choice',
        choices: [choice('iff', '充要条件。', true), choice('necessary-only', '必要但不充分。'), choice('sufficient-only', '充分但不必要。'), choice('neither', '既不必要也不充分。')],
        score: 2, estimatedSeconds: 30, knowledgeTags: ['necessary-condition', 'sufficient-condition', 'equivalence'], skillTags: ['conclusion'],
      },
      {
        id: 's4', label: '(4)', prompt: '∠A<90° 是 △ABC 为锐角三角形的什么条件？', answerType: 'single-choice',
        choices: [choice('necessary-only', '必要但不充分。', true), choice('sufficient-only', '充分但不必要。'), choice('iff', '充要条件。'), choice('neither', '既不必要也不充分。')],
        score: 2, estimatedSeconds: 30, knowledgeTags: ['necessary-condition', 'sufficient-condition', 'geometry'], skillTags: ['conclusion'],
      },
      {
        id: 's5', label: '(5)', prompt: '(a-b)(a²+b²-c²)=0 是 △ABC 为直角等腰三角形的什么条件？', answerType: 'single-choice',
        choices: [choice('neither', '既不必要也不充分。', true), choice('necessary-only', '必要但不充分。'), choice('sufficient-only', '充分但不必要。'), choice('iff', '充要条件。')],
        score: 2, estimatedSeconds: 30, knowledgeTags: ['necessary-condition', 'sufficient-condition', 'geometry'], skillTags: ['conclusion'],
      },
    ],
    fullExplanation: '复杂条件仍按同一流程：分别判断 p⇒q 和 q⇒p，成立的方向给证明，不成立的方向给反例。(1)(4) 仅必要，(2) 仅充分，(3) 为充要，(5) 两者都不是。',
  },

]

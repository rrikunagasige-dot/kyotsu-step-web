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

]

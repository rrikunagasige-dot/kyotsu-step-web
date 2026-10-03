import type { MathPracticeSourceQuestion } from './source'

const choice = (id: string, label: string, correct = false, wrongReason?: string) => ({
  id,
  label,
  correct,
  ...(wrongReason ? { wrongReason } : {}),
})

export const mathPracticeProofsBatchCSource: MathPracticeSourceQuestion[] = [
  {
    problemNo: 108,
    section: 'proofs',
    sectionTitle: '命題と証明',
    title: '同値の証明',
    estimatedSeconds: 420,
    knowledgeTags: ['equivalence', 'implication', 'inequality', 'sign'],
    skillTags: ['proof-planning', 'case-classification', 'conclusion'],
    problem: [
      { type: 'text', text: 'a、b は実数とする。次の2つの条件 p、q は同値であることを証明せよ。' },
      { type: 'latex', latex: 'p:\\ a>1\\;\\text{かつ}\\;b>1' },
      { type: 'latex', latex: 'q:\\ a+b>2\\;\\text{かつ}\\;(a-1)(b-1)>0' },
    ],
    guide: [
      {
        type: 'content',
        blocks: [{ type: 'text', text: 'まず、「p と q が同値」を証明するために、どの2方向を示せばよいか確認する。' }],
      },
      { type: 'blank', blankId: 'rule' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '一方向目では p を仮定する。' },
          { type: 'latex', latex: 'a>1,\\qquad b>1' },
          { type: 'text', text: 'この2つの不等式から、q に必要な「和」と「積」の2条件をまとめて作る。' },
        ],
      },
      { type: 'blank', blankId: 'forward' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '次に逆方向。q を仮定する。' },
          { type: 'latex', latex: 'a+b>2,\\qquad (a-1)(b-1)>0' },
          { type: 'text', text: 'まず積が正であることだけから、2因子の符号関係を整理する。' },
        ],
      },
      { type: 'blank', blankId: 'reverse-sign' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '出てきた2つの符号ケースのうち、a+b>2 と両立する側だけを残す。' }],
      },
      { type: 'blank', blankId: 'reverse-eliminate' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: 'これで2方向の証明がそろった。最後に p と q の関係をまとめる。' }],
      },
      { type: 'blank', blankId: 'equivalence' },
    ],
    blanks: [
      {
        id: 'rule',
        prompt: 'p と q が同値であることを示すために必要なのは',
        choices: [
          choice('both-directions', 'p⇒q と q⇒p の両方を示す。', true),
          choice('forward-only', 'p⇒q だけを示す。'),
          choice('one-example', 'p と q を同時に満たす例を1つ示す。'),
        ],
        skillTag: 'proof-planning',
        knowledgeTags: ['equivalence', 'implication'],
        explanation: '同値とは両方向の含意がともに成り立つことなので、p⇒q と q⇒p の2方向が必要です。',
      },
      {
        id: 'forward',
        prompt: 'p から q の2条件を導く正しい流れは',
        choices: [
          choice('sum-and-product', 'a+b>2。また a-1>0、b-1>0 なので (a-1)(b-1)>0。よって p⇒q。', true),
          choice('sum-only', 'a+b>2 だけ分かれば q が成り立つ。'),
          choice('wrong-product', 'a-1>0、b-1>0 なので (a-1)(b-1)<0。'),
        ],
        skillTag: 'proof-planning',
        knowledgeTags: ['equivalence', 'implication', 'inequality', 'sign'],
        explanation: 'p から q の2条件を両方示す必要があります。和は2より大きく、2因子はともに正なので積も正です。',
      },
      {
        id: 'reverse-sign',
        prompt: '(a-1)(b-1)>0 から言える符号関係は',
        choices: [
          choice('same-sign', 'a-1 と b-1 は同符号で、両方正または両方負。', true),
          choice('opposite-sign', 'a-1 と b-1 は異符号。'),
          choice('both-positive-only', '必ず a-1>0、b-1>0。'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['sign', 'inequality'],
        explanation: '積が正になるのは2因子が同符号のときなので、両方正と両方負の2ケースがあります。',
      },
      {
        id: 'reverse-eliminate',
        prompt: 'a+b>2 を使って残るケースを判定すると',
        choices: [
          choice('positive-remains', '両方負なら a<1、b<1 から a+b<2 となり矛盾する。したがって両方正が残り、a>1、b>1。よって q⇒p。', true),
          choice('negative-remains', '両方正は a+b>2 と矛盾するので、両方負が残る。'),
          choice('cannot-decide', 'a+b>2 を使っても2ケースを区別できない。'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['equivalence', 'implication', 'inequality', 'sign'],
        explanation: '両方負なら a<1、b<1 なので a+b<2 となり、q の a+b>2 と矛盾します。したがって両方正だけが残ります。',
      },
      {
        id: 'equivalence',
        prompt: '2方向の証明結果から最終的に言えることは',
        choices: [
          choice('equivalent', 'p⇒q と q⇒p がともに成り立つので、p と q は同値である。', true),
          choice('one-way', 'p⇒q だけが成り立つので、p と q は同値ではない。'),
          choice('undecided', '2方向を示しても同値かどうかは決められない。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['equivalence', 'implication'],
        explanation: '両方向の含意がそろったので p⇔q、すなわち p と q は同値です。',
      },
    ],
    simulation: [
      {
        id: 's1',
        label: '証明方針',
        prompt: 'p と q の同値を示すために必要なものを選べ。',
        answerType: 'single-choice',
        choices: [choice('both-directions', 'p⇒q と q⇒p', true), choice('forward-only', 'p⇒q のみ'), choice('example', '具体例1つ')],
        score: 2,
        estimatedSeconds: 25,
        knowledgeTags: ['equivalence', 'implication'],
        skillTags: ['proof-planning'],
      },
      {
        id: 's2',
        label: '逆方向',
        prompt: '(a-1)(b-1)>0 からまず言えることを選べ。',
        answerType: 'single-choice',
        choices: [choice('same-sign', '2因子は同符号', true), choice('opposite-sign', '2因子は異符号'), choice('both-positive', '必ず両方正')],
        score: 2,
        estimatedSeconds: 25,
        knowledgeTags: ['sign'],
        skillTags: ['case-classification'],
      },
      {
        id: 's3',
        label: '結論',
        prompt: 'p⇒q と q⇒p がともに示されたときの結論を選べ。',
        answerType: 'single-choice',
        choices: [choice('equivalent', 'p と q は同値', true), choice('not-equivalent', 'p と q は同値でない')],
        score: 2,
        estimatedSeconds: 20,
        knowledgeTags: ['equivalence'],
        skillTags: ['conclusion'],
      },
    ],
    fullExplanation: '同値を示すには p⇒q と q⇒p の両方が必要である。p⇒q は a>1,b>1 から和条件と積条件を直接示す。q⇒p は積が正なので a-1,b-1 が同符号と分け、両方負のケースを a+b>2 で排除する。残る両方正から a>1,b>1 が得られ、両方向が成立するので p と q は同値である。',
  },
]

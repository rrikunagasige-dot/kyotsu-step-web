import type { MathPracticeSourceQuestion } from './source'

const choice = (id: string, label: string, correct = false, wrongReason?: string) => ({
  id,
  label,
  correct,
  ...(wrongReason ? { wrongReason } : {}),
})

export const mathPracticeFunctionsBatchDSource: MathPracticeSourceQuestion[] = [
  {
    problemNo: 118,
    section: 'functions',
    sectionTitle: '関数',
    title: '関数とは何か',
    estimatedSeconds: 300,
    knowledgeTags: ['function', 'unique-output', 'square-root', 'geometry'],
    skillTags: ['condition-reading', 'equation-building', 'conclusion'],
    problem: [
      { type: 'text', text: '次のうち、「y は x の関数である」といえるものはどれか。' },
      { type: 'text', text: '(1) 円周の長さが x である円の半径の長さ y' },
      { type: 'text', text: '(2) 正の数 x の平方根 y' },
      { type: 'text', text: '(3) 面積が1である長方形の縦の長さ x と横の長さ y' },
    ],
    guide: [
      {
        type: 'content',
        blocks: [{ type: 'text', text: 'まず、関数かどうかを判定するときに何を確認すればよいかを整理する。' }],
      },
      { type: 'blank', blankId: 'rule' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(1) 円周 x と半径 y の関係を式にし、1つの x から y が何個決まるかを見る。' }],
      },
      { type: 'blank', blankId: 'p1' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(2) 関数でないことを示すには、同じ x に異なる2つの y が対応する具体例を1つ作ればよい。' }],
      },
      { type: 'blank', blankId: 'p2' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(3) 長方形の面積条件を式にし、長さなので x>0 であることも使って y を決める。' }],
      },
      { type: 'blank', blankId: 'p3' },
    ],
    blanks: [
      {
        id: 'rule',
        prompt: 'y が x の関数であるための判定基準は',
        choices: [
          choice('unique', '許される各 x に対して、対応する y がただ1つに決まる。', true),
          choice('many', '1つの x に対して y が何個あってもよい。'),
          choice('formula-only', 'x と y の式が1本書ければ、必ず関数である。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['function', 'unique-output'],
        explanation: '関数では、定義域の各 x に対して出力 y がただ1つに定まることが必要です。',
      },
      {
        id: 'p1',
        prompt: '(1) 円周 x と半径 y の関係から判定すると',
        choices: [
          choice('function', 'x=2πy なので y=x/(2π)。1つの x に対し y はただ1つだから、関数である。', true),
          choice('not-function', 'x=2πy でも1つの x に半径が2つあるので、関数ではない。'),
          choice('wrong-formula', 'y=2πx なので、関数である。'),
        ],
        skillTag: 'equation-building',
        knowledgeTags: ['function', 'unique-output', 'circle'],
        explanation: '円周 x=2πy を y について解くと y=x/(2π)。x を決めれば y は1つに決まります。',
      },
      {
        id: 'p2',
        prompt: '(2) 同じ x に2つの平方根が対応する例を使って判定すると',
        choices: [
          choice('counterexample', 'x=4 なら平方根は y=2 と y=-2。1つの x に2つの y が対応するので、関数ではない。', true),
          choice('principal-only', 'x=4 なら y=2 だけなので、関数である。'),
          choice('zero', 'x=0 を使えば y=0 だけなので、関数である。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['function', 'unique-output', 'square-root'],
        explanation: '「4の平方根」は 2 と -2 の2つです。同じ入力4に異なる出力が2つあるため関数ではありません。',
      },
      {
        id: 'p3',
        prompt: '(3) 面積1の条件から判定すると',
        choices: [
          choice('function', 'xy=1 なので y=1/x。長さより x>0 で、各 x に y はただ1つだから関数である。', true),
          choice('not-function', 'xy=1 では1つの x に正負2つの y があるので、関数ではない。'),
          choice('wrong-relation', 'x+y=1 なので y=1-x。'),
        ],
        skillTag: 'equation-building',
        knowledgeTags: ['function', 'unique-output', 'rectangle'],
        explanation: '面積条件は xy=1。辺の長さなので x>0 であり、y=1/x は各 x に対して1つだけ決まります。',
      },
    ],
    simulation: [
      {
        id: 's1',
        label: '判定',
        prompt: '3つのうち関数であるものを選べ。',
        answerType: 'multi-choice',
        choices: [
          choice('p1', '(1) 円周 x → 半径 y', true),
          choice('p2', '(2) 正の x → その平方根 y'),
          choice('p3', '(3) 面積1の長方形で縦 x → 横 y', true),
        ],
        score: 3,
        estimatedSeconds: 30,
        knowledgeTags: ['function', 'unique-output'],
        skillTags: ['conclusion'],
      },
    ],
    fullExplanation: '関数の判定基準は、各 x に対して y がただ1つに決まること。(1) は y=x/(2π) なので関数。(2) は例えば x=4 に y=2,-2 の2つが対応するので関数ではない。(3) は xy=1、x>0 より y=1/x で一意に決まるので関数である。',
  },
]

import type { MathPracticeSourceQuestion } from './source'

const choice = (id: string, label: string, correct = false, wrongReason?: string) => ({
  id,
  label,
  correct,
  ...(wrongReason ? { wrongReason } : {}),
})

export const mathPracticePropositionsBatchBSource: MathPracticeSourceQuestion[] = [
  {
    problemNo: 98,
    section: 'propositions',
    sectionTitle: '命題と条件',
    title: '命題と真偽',
    estimatedSeconds: 360,
    knowledgeTags: ['proposition', 'truth-value', 'counterexample', 'objectivity'],
    skillTags: ['condition-reading', 'case-classification', 'conclusion'],
    problem: [
      { type: 'text', text: '次の文は命題か。命題なら真偽も答えよ。' },
      { type: 'text', text: '(1) 23 を 3 で割ると余りは 2 である。' },
      { type: 'text', text: '(2) 二等辺三角形は正三角形である。' },
      { type: 'text', text: '(3) 3.14 は円周率 π のよい近似値である。' },
    ],
    guide: [
      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: 'まず、文が命題かどうかを分ける共通の基準を作る。「多くの人が正しいと思うか」ではなく、真偽を客観的に決められるかを見る。',
        }],
      },
      { type: 'blank', blankId: 'definition' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(1) は実際に割り算をして内容を確かめる。' },
          { type: 'latex', latex: '23=3\\times7+2' },
        ],
      },
      { type: 'blank', blankId: 'p1-result' },

      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: '(2) は、二等辺三角形がすべて正三角形かどうかを、主張を破る具体例があるかで確かめる。',
        }],
      },
      { type: 'blank', blankId: 'p2-counterexample' },
      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: '反例が1つ見つかれば、「すべて正三角形である」という主張は成り立たない。',
        }],
      },
      { type: 'blank', blankId: 'p2-result' },

      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: '(3) では、「よい近似値」という言葉だけで真偽を客観的に決められるかを考える。',
        }],
      },
      { type: 'blank', blankId: 'p3-objectivity' },
      { type: 'blank', blankId: 'p3-result' },
    ],
    blanks: [
      {
        id: 'definition',
        prompt: '命題とは、内容が客観的に',
        choices: [
          choice('truth-or-false', '真・偽のどちらか一方に定まる文である。', true),
          choice('majority', '多くの人が正しいと思う文である。'),
          choice('has-formula', '数式を含む文である。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['proposition'],
        explanation: '命題かどうかは、内容が客観的に真・偽のどちらか一方へ定まるかで判断します。',
      },
      {
        id: 'p1-result',
        prompt: 'この計算から、(1)は',
        choices: [
          choice('true-proposition', '命題であり、真である。', true),
          choice('false-proposition', '命題であり、偽である。'),
          choice('not-proposition', '命題ではない。'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['proposition', 'truth-value'],
        explanation: '余りが2であることを計算で確認でき、真偽も客観的に決まるので、真の命題です。',
      },
      {
        id: 'p2-counterexample',
        prompt: '(2)を偽と示す反例として',
        choices: [
          choice('forty-degree', '頂角40°の二等辺三角形がある。', true),
          choice('equilateral', '正三角形がある。'),
          choice('sixty-degree', '頂角60°の二等辺三角形がある。'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['counterexample', 'truth-value'],
        explanation: '頂角40°の二等辺三角形では残りの2角は70°ずつなので、正三角形ではありません。',
      },
      {
        id: 'p2-result',
        prompt: 'この反例があるので、(2)は',
        choices: [
          choice('false-proposition', '命題であり、偽である。', true),
          choice('true-proposition', '命題であり、真である。'),
          choice('not-proposition', '命題ではない。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['proposition', 'truth-value', 'counterexample'],
        explanation: '反例があるので内容は偽です。一方、真偽そのものは客観的に決められるので、命題ではあります。',
      },
      {
        id: 'p3-objectivity',
        prompt: '「よい近似値」には、真偽を一意に決める客観的な基準が',
        choices: [
          choice('not-fixed', '定まっていない。', true),
          choice('fixed', '数学的に必ず1つに定まっている。'),
          choice('number-is-enough', '3.14という数値だけで自動的に定まる。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['objectivity', 'proposition'],
        explanation: '「どの程度近ければよいか」という基準が指定されていないため、真偽を一意に決められません。',
      },
      {
        id: 'p3-result',
        prompt: 'したがって、(3)は',
        choices: [
          choice('not-proposition', '命題ではない。', true),
          choice('true-proposition', '命題であり、真である。'),
          choice('false-proposition', '命題であり、偽である。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['proposition', 'objectivity'],
        explanation: '真偽を客観的に一意に決められない文は、命題ではありません。',
      },
    ],
    simulation: [
      {
        id: 's1',
        label: '(1)',
        prompt: '「23を3で割ると余りは2である」を分類せよ。',
        answerType: 'single-choice',
        choices: [
          choice('true-proposition', '命題であり、真である。', true),
          choice('false-proposition', '命題であり、偽である。'),
          choice('not-proposition', '命題ではない。'),
        ],
        score: 2,
        estimatedSeconds: 30,
        knowledgeTags: ['proposition', 'truth-value'],
        skillTags: ['case-classification'],
      },
      {
        id: 's2',
        label: '(2)',
        prompt: '「二等辺三角形は正三角形である」を分類せよ。',
        answerType: 'single-choice',
        choices: [
          choice('false-proposition', '命題であり、偽である。', true),
          choice('true-proposition', '命題であり、真である。'),
          choice('not-proposition', '命題ではない。'),
        ],
        score: 2,
        estimatedSeconds: 30,
        knowledgeTags: ['proposition', 'truth-value'],
        skillTags: ['case-classification'],
      },
      {
        id: 's3',
        label: '(3)',
        prompt: '「3.14はπのよい近似値である」を分類せよ。',
        answerType: 'single-choice',
        choices: [
          choice('not-proposition', '命題ではない。', true),
          choice('true-proposition', '命題であり、真である。'),
          choice('false-proposition', '命題であり、偽である。'),
        ],
        score: 2,
        estimatedSeconds: 30,
        knowledgeTags: ['proposition', 'objectivity'],
        skillTags: ['case-classification'],
      },
    ],
    fullExplanation: '命題かどうかは、内容が客観的に真・偽のどちらか一方へ定まるかで判断する。偽である文も、真偽を客観的に決められるなら命題である。反対に、「よい」のような基準が定まっていない表現では真偽を一意に決められず、命題ではない。',
  },
  {
    problemNo: 99,
    section: 'propositions',
    sectionTitle: '命題と条件',
    title: '含意の真偽',
    estimatedSeconds: 480,
    knowledgeTags: ['implication', 'set-inclusion', 'counterexample', 'absolute-value', 'interval'],
    skillTags: ['condition-reading', 'case-classification', 'conclusion'],
    problem: [
      { type: 'text', text: 'x を実数とする。条件を満たす集合の包含関係を用いて、次の命題の真偽を調べよ。' },
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
          text: 'まず、前件を満たす集合 P と後件を満たす集合 Q の関係から、含意の真偽を判定する共通規則を作る。',
        }],
      },
      { type: 'blank', blankId: 'rule' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(1) の前件と後件を区間で表して比較する。' },
          { type: 'latex', latex: 'P=(1,2),\\qquad Q=(1,3)' },
        ],
      },
      { type: 'blank', blankId: 'p1-result' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(2) では、前件を満たす集合の方が後件を満たす集合より広い。P に属して Q に属さない値を1つ探す。' },
          { type: 'latex', latex: 'P=(-\\infty,1),\\qquad Q=(0,1)' },
        ],
      },
      { type: 'blank', blankId: 'p2-counterexample' },
      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: '選んだ値が前件を満たし、後件を満たさないことを確認して真偽を決める。',
        }],
      },
      { type: 'blank', blankId: 'p2-result' },

      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: '(3) は x>3 から x+1 の符号と大きさを読み、絶対値の後件が必ず成り立つかを確かめる。',
        }],
      },
      { type: 'blank', blankId: 'p3-result' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(4) の前件を満たす集合は次の区間である。後件も区間へ直して比較する。' },
          { type: 'latex', latex: 'P=[-2,2]' },
        ],
      },
      { type: 'blank', blankId: 'p4-q-set' },
      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: 'P と Q の端点を比べ、P にだけ入る値があるかを確認する。',
        }],
      },
      { type: 'blank', blankId: 'p4-counterexample-result' },
    ],
    blanks: [
      {
        id: 'rule',
        prompt: '命題 p⇒q が真になる集合関係は',
        choices: [
          choice('p-subset-q', 'P⊆Q である。', true),
          choice('q-subset-p', 'Q⊆P である。'),
          choice('disjoint', 'P∩Q=∅ である。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['implication', 'set-inclusion'],
        explanation: 'p を満たすすべての値が q も満たすことは、条件集合で P⊆Q と表せます。',
      },
      {
        id: 'p1-result',
        prompt: 'P=(1,2), Q=(1,3) を比べると、(1)は',
        choices: [
          choice('subset-true', 'P⊆Q なので真である。', true),
          choice('reverse-false', 'Q⊆P なので偽である。'),
          choice('not-comparable', '包含関係がないので偽である。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['implication', 'set-inclusion', 'interval'],
        explanation: '(1,2) のすべての実数は (1,3) に含まれるため P⊆Q であり、命題は真です。',
      },
      {
        id: 'p2-counterexample',
        prompt: 'P に属し Q に属さない反例として使えるのは',
        choices: [
          choice('minus-one', 'x=-1', true),
          choice('half', 'x=1/2'),
          choice('two', 'x=2'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['counterexample', 'set-inclusion', 'interval'],
        explanation: 'x=-1 は x<1 を満たしますが、0<x<1 は満たしません。',
      },
      {
        id: 'p2-result',
        prompt: 'この反例があるので、(2)は',
        choices: [
          choice('false', 'P⊆Q ではないため偽である。', true),
          choice('true', 'P⊆Q なので真である。'),
          choice('not-proposition', '真偽を決められない。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['implication', 'counterexample'],
        explanation: '前件を満たすのに後件を満たさない反例が1つあるため、命題は偽です。',
      },
      {
        id: 'p3-result',
        prompt: 'x>3 から後件が必ず成り立つことを示す推論は',
        choices: [
          choice('positive-bound', 'x+1>4 だから |x+1|=x+1>4>2 となり、真である。', true),
          choice('wrong-sign', 'x+1>4 だから |x+1|<2 となり、偽である。'),
          choice('unknown-sign', 'x+1 の符号が決まらないので、真偽を決められない。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['implication', 'absolute-value'],
        explanation: 'x>3 なら x+1>4>0 なので絶対値を外せて、|x+1|>2 が必ず成り立ちます。',
      },
      {
        id: 'p4-q-set',
        prompt: '|x-1|<3 を区間の条件に直すと',
        choices: [
          choice('correct', '-2<x<4', true),
          choice('shift-left', '-4<x<2'),
          choice('closed', '-2≤x≤4'),
        ],
        skillTag: 'calculation',
        knowledgeTags: ['absolute-value', 'interval'],
        explanation: '|x-1|<3 は -3<x-1<3、したがって -2<x<4 と同値です。',
      },
      {
        id: 'p4-counterexample-result',
        prompt: 'P=[-2,2] と Q=(-2,4) を比べると、(4)は',
        choices: [
          choice('minus-two-false', 'x=-2 が P に属して Q に属さないので偽である。', true),
          choice('two-true', 'x=2 が P と Q の両方に属するので真である。'),
          choice('minus-three-false', 'x=-3 が Q に属さないので偽である。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['implication', 'counterexample', 'set-inclusion', 'interval'],
        explanation: 'x=-2 では |x|=2≤2 ですが |x-1|=3 となり後件の <3 を満たさないため、反例になります。',
      },
    ],
    simulation: [
      {
        id: 's1',
        label: '(1)',
        prompt: '1<x<2 ⇒ 1<x<3 の真偽を選べ。',
        answerType: 'single-choice',
        choices: [choice('true', '真', true), choice('false', '偽')],
        score: 2,
        estimatedSeconds: 30,
        knowledgeTags: ['implication', 'set-inclusion'],
        skillTags: ['conclusion'],
      },
      {
        id: 's2',
        label: '(2)',
        prompt: 'x<1 ⇒ 0<x<1 の真偽を選べ。',
        answerType: 'single-choice',
        choices: [choice('false', '偽', true), choice('true', '真')],
        score: 2,
        estimatedSeconds: 30,
        knowledgeTags: ['implication', 'counterexample'],
        skillTags: ['conclusion'],
      },
      {
        id: 's3',
        label: '(3)',
        prompt: 'x>3 ⇒ |x+1|>2 の真偽を選べ。',
        answerType: 'single-choice',
        choices: [choice('true', '真', true), choice('false', '偽')],
        score: 2,
        estimatedSeconds: 30,
        knowledgeTags: ['implication', 'absolute-value'],
        skillTags: ['conclusion'],
      },
      {
        id: 's4',
        label: '(4)',
        prompt: '|x|≤2 ⇒ |x-1|<3 の真偽を選べ。',
        answerType: 'single-choice',
        choices: [choice('false', '偽', true), choice('true', '真')],
        score: 2,
        estimatedSeconds: 30,
        knowledgeTags: ['implication', 'counterexample', 'absolute-value'],
        skillTags: ['conclusion'],
      },
    ],
    fullExplanation: '命題 p⇒q の真偽は、前件の条件集合 P が後件の条件集合 Q に含まれるかで判定できる。P⊆Q なら真であり、含まれない場合は P に属して Q に属さない値を1つ示せば反例となる。絶対値を含む条件は区間へ直すと包含関係を確認しやすい。',
  },

  {
    problemNo: 100,
    section: 'propositions',
    sectionTitle: '命題と条件',
    title: '反例',
    estimatedSeconds: 360,
    knowledgeTags: ['counterexample', 'implication', 'absolute-value', 'prime-number'],
    skillTags: ['condition-reading', 'case-classification', 'conclusion'],
    problem: [
      { type: 'text', text: 'x、y は実数、n は自然数とする。次の命題が偽であることを示せ。' },
      { type: 'latex', latex: '(1)\\;x^2=3\\Rightarrow x=\\sqrt{3}' },
      { type: 'latex', latex: '(2)\\;|x|>|y|\\Rightarrow x>y' },
      { type: 'latex', latex: '(3)\\;n\\text{ は奇数}\\Rightarrow 10n+1\\text{ は素数}' },
    ],
    guide: [
      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: 'まず、命題が偽であることを1つの具体例で示すとき、その例が満たすべき条件を確認する。',
        }],
      },
      { type: 'blank', blankId: 'rule' },

      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: '(1) は平方すると符号が消えることに注目する。前件を満たしながら、後件に書かれた値とは異なる解を選ぶ。',
        }],
      },
      { type: 'blank', blankId: 'p1-counterexample' },

      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: '(2) は絶対値の大小と、符号を含む元の数の大小が一致しない例を作る。y=1 と固定して考える。',
        }],
      },
      { type: 'blank', blankId: 'p2-counterexample' },

      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: '(3) は奇数 n の中から、10n+1 が合成数になるものを探す。',
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
        prompt: '偽を示す反例として必要なのは',
        choices: [
          choice('antecedent-true-consequent-false', '前件を満たし、後件を満たさない具体例である。', true),
          choice('both-true', '前件と後件をともに満たす具体例である。'),
          choice('antecedent-false', '前件を満たさない具体例であれば何でもよい。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['counterexample', 'implication'],
        explanation: '含意 p⇒q を偽にするには、p が真なのに q が偽になる具体例が1つあれば十分です。',
      },
      {
        id: 'p1-counterexample',
        prompt: '(1)の反例として使えるのは',
        choices: [
          choice('negative-root', 'x=-√3', true),
          choice('positive-root', 'x=√3'),
          choice('zero', 'x=0'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['counterexample', 'implication'],
        explanation: 'x=-√3 なら x²=3 を満たしますが、x=√3 ではないので後件を満たしません。',
      },
      {
        id: 'p2-counterexample',
        prompt: 'y=1 としたとき、(2)の反例になる x は',
        choices: [
          choice('minus-two', 'x=-2', true),
          choice('two', 'x=2'),
          choice('half', 'x=1/2'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['counterexample', 'absolute-value'],
        explanation: 'x=-2,y=1 なら |x|=2>|y|=1 ですが、-2>1 は成り立ちません。',
      },
      {
        id: 'p3-counterexample',
        prompt: '奇数 n のうち、(3)の反例になるのは',
        choices: [
          choice('five', 'n=5', true),
          choice('one', 'n=1'),
          choice('three', 'n=3'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['counterexample', 'prime-number'],
        explanation: 'n=5 は奇数ですが、10n+1=51=3×17 は合成数なので反例になります。',
      },
    ],
    simulation: [
      {
        id: 's1',
        label: '(1)',
        prompt: 'x²=3 ⇒ x=√3 を偽と示す反例を選べ。',
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
        prompt: '|x|>|y| ⇒ x>y を偽と示す反例を選べ。',
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
        prompt: 'n が奇数 ⇒ 10n+1 は素数 を偽と示す反例を選べ。',
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
    fullExplanation: '命題 p⇒q が偽であることを示すには、前件 p を満たすのに後件 q を満たさない反例を1つ示せばよい。平方では符号、絶対値では元の数の符号、素数条件では合成数になる具体例に注目すると反例を作りやすい。',
  },

]

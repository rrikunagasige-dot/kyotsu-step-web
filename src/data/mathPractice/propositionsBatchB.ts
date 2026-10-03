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
  {
    problemNo: 101,
    section: 'propositions',
    sectionTitle: '命題と条件',
    title: '条件の否定',
    estimatedSeconds: 300,
    knowledgeTags: ['negation', 'complement', 'inequality', 'rational-number'],
    skillTags: ['condition-reading', 'case-classification', 'conclusion'],
    problem: [
      { type: 'text', text: 'x、y は実数とする。次の条件の否定を述べよ。' },
      { type: 'latex', latex: '(1)\\;x>-5' },
      { type: 'latex', latex: '(2)\\;x+y\\ne0' },
      { type: 'text', text: '(3) x は有理数である。' },
    ],
    guide: [
      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: 'まず、条件の否定とは何を表すのかを確認する。記号だけを機械的に変えるのではなく、元の条件が成り立たない場合を漏れなく表す。',
        }],
      },
      { type: 'blank', blankId: 'rule' },

      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: '(1) は境界の -5 自身が元の条件を満たすかどうかまで含めて考える。',
        }],
      },
      { type: 'blank', blankId: 'p1-result' },

      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: '(2) は「0ではない」という条件が成り立たない場合を、そのまま等式で表す。',
        }],
      },
      { type: 'blank', blankId: 'p2-result' },

      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: '(3) は x が実数であることを使い、有理数の補集合に当たる数の種類を考える。',
        }],
      },
      { type: 'blank', blankId: 'p3-result' },
    ],
    blanks: [
      {
        id: 'rule',
        prompt: '条件 p の否定が表すのは',
        choices: [
          choice('all-not-p', 'p が成り立たないすべての場合である。', true),
          choice('opposite-looking', '見た目が反対の式を1つ書けばよい。'),
          choice('some-not-p', 'p が成り立たない例を1つだけ挙げればよい。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['negation', 'complement'],
        explanation: '条件の否定は、元の条件が成り立たない場合をすべて表す条件です。',
      },
      {
        id: 'p1-result',
        prompt: 'x>-5 の否定は',
        choices: [
          choice('le-minus-five', 'x≤-5', true),
          choice('lt-minus-five', 'x<-5'),
          choice('ge-minus-five', 'x≥-5'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['negation', 'inequality', 'complement'],
        explanation: 'x=-5 は x>-5 を満たさないため、境界を含めて x≤-5 が否定です。',
      },
      {
        id: 'p2-result',
        prompt: 'x+y≠0 の否定は',
        choices: [
          choice('equals-zero', 'x+y=0', true),
          choice('greater-zero', 'x+y>0'),
          choice('less-equal-zero', 'x+y≤0'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['negation'],
        explanation: '「0ではない」が成り立たないのは、ちょうど 0 に等しい場合です。',
      },
      {
        id: 'p3-result',
        prompt: '実数 x が有理数であることの否定は',
        choices: [
          choice('irrational', 'x は無理数である。', true),
          choice('not-integer', 'x は整数ではない。'),
          choice('negative', 'x は負の数である。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['negation', 'rational-number', 'complement'],
        explanation: '実数は有理数と無理数に分かれるので、有理数でない実数は無理数です。',
      },
    ],
    simulation: [
      {
        id: 's1',
        label: '(1)',
        prompt: 'x>-5 の否定を選べ。',
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
        prompt: 'x+y≠0 の否定を選べ。',
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
        prompt: '実数 x が有理数であることの否定を選べ。',
        answerType: 'single-choice',
        choices: [
          choice('irrational', 'x は無理数である。', true),
          choice('not-integer', 'x は整数ではない。'),
          choice('negative', 'x は負の数である。'),
        ],
        score: 2,
        estimatedSeconds: 25,
        knowledgeTags: ['negation', 'rational-number'],
        skillTags: ['conclusion'],
      },
    ],
    fullExplanation: '条件の否定は、元の条件が成り立たないすべての場合を表す。不等号では境界を落とさないこと、≠ の否定は = であること、実数全体では有理数の補集合が無理数であることを確認する。',
  },
  {
    problemNo: 102,
    section: 'propositions',
    sectionTitle: '命題と条件',
    title: '「かつ」と「または」',
    estimatedSeconds: 360,
    knowledgeTags: ['logical-and-or', 'intersection', 'union', 'interval'],
    skillTags: ['condition-reading', 'case-classification', 'conclusion'],
    problem: [
      { type: 'text', text: '次の条件を満たす実数 x 全体の集合を求めよ。' },
      { type: 'latex', latex: '(1)\\;0<x<3\\;\\text{かつ}\\;-2<x<2' },
      { type: 'latex', latex: '(2)\\;0<x<3\\;\\text{または}\\;-2<x<2' },
      { type: 'latex', latex: '(3)\\;-1\\le x<2\\;\\text{かつ}\\;-1<x\\le4' },
      { type: 'latex', latex: '(4)\\;-1\\le x<2\\;\\text{または}\\;-1<x\\le4' },
    ],
    guide: [
      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: 'まず、「かつ」「または」を集合演算に直す共通の対応を確認する。',
        }],
      },
      { type: 'blank', blankId: 'rule' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(1) は2つの区間を同時に満たす範囲を残す。' },
          { type: 'latex', latex: 'A=(0,3),\\qquad B=(-2,2)' },
        ],
      },
      { type: 'blank', blankId: 'p1-result' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(2) は同じ2区間のうち、少なくとも一方に入る範囲を合わせる。' },
          { type: 'latex', latex: 'A=(0,3),\\qquad B=(-2,2)' },
        ],
      },
      { type: 'blank', blankId: 'p2-result' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(3) は共通部分を取り、左端と右端が両方の条件で許されるかを確認する。' },
          { type: 'latex', latex: 'A=[-1,2),\\qquad B=(-1,4]' },
        ],
      },
      { type: 'blank', blankId: 'p3-result' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(4) は和集合を取り、どちらか一方が含む端点は残す。' },
          { type: 'latex', latex: 'A=[-1,2),\\qquad B=(-1,4]' },
        ],
      },
      { type: 'blank', blankId: 'p4-result' },
    ],
    blanks: [
      {
        id: 'rule',
        prompt: '「かつ」「または」と集合演算の対応は',
        choices: [
          choice('and-intersection-or-union', 'かつ→共通部分、または→和集合', true),
          choice('and-union-or-intersection', 'かつ→和集合、または→共通部分'),
          choice('both-intersection', 'どちらも共通部分'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['logical-and-or', 'intersection', 'union'],
        explanation: '「かつ」は両方を満たす共通部分、「または」は少なくとも一方を満たす和集合です。',
      },
      {
        id: 'p1-result',
        prompt: '(1) の2区間の共通部分は',
        choices: [
          choice('zero-two-open', '0<x<2', true),
          choice('minus-two-three', '-2<x<3'),
          choice('zero-two-closed', '0≤x≤2'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['intersection', 'interval'],
        explanation: '(0,3) と (-2,2) の両方に入るのは 0<x<2 です。',
      },
      {
        id: 'p2-result',
        prompt: '(2) の2区間の和集合は',
        choices: [
          choice('minus-two-three', '-2<x<3', true),
          choice('zero-two-open', '0<x<2'),
          choice('minus-two-three-closed', '-2≤x≤3'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['union', 'interval'],
        explanation: '(0,3) と (-2,2) は重なっているため、合わせると -2<x<3 です。',
      },
      {
        id: 'p3-result',
        prompt: '(3) の共通部分は',
        choices: [
          choice('minus-one-two-open', '-1<x<2', true),
          choice('left-closed', '-1≤x<2'),
          choice('both-closed', '-1≤x≤2'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['intersection', 'interval'],
        explanation: '-1 は B に入らず、2 は A に入らないため、両端とも除いて -1<x<2 です。',
      },
      {
        id: 'p4-result',
        prompt: '(4) の和集合は',
        choices: [
          choice('minus-one-four-closed', '-1≤x≤4', true),
          choice('minus-one-four-open', '-1<x<4'),
          choice('minus-one-two-open', '-1<x<2'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['union', 'interval'],
        explanation: '-1 は A が含み、4 は B が含むので、和集合では両端を残して -1≤x≤4 です。',
      },
    ],
    simulation: [
      {
        id: 's1',
        label: '(1)',
        prompt: '0<x<3 かつ -2<x<2 を満たす範囲を選べ。',
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
        prompt: '0<x<3 または -2<x<2 を満たす範囲を選べ。',
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
        prompt: '-1≤x<2 かつ -1<x≤4 を満たす範囲を選べ。',
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
        prompt: '-1≤x<2 または -1<x≤4 を満たす範囲を選べ。',
        answerType: 'single-choice',
        choices: [choice('minus-one-four-closed', '-1≤x≤4', true), choice('minus-one-four-open', '-1<x<4'), choice('minus-one-two-open', '-1<x<2')],
        score: 2,
        estimatedSeconds: 25,
        knowledgeTags: ['union', 'interval'],
        skillTags: ['conclusion'],
      },
    ],
    fullExplanation: '「かつ」は共通部分、「または」は和集合として扱う。端点は、共通部分では両方の条件が含むときだけ残し、和集合ではどちらか一方が含めば残す。',
  },
  {
    problemNo: 103,
    section: 'propositions',
    sectionTitle: '命題と条件',
    title: '複合条件の否定',
    estimatedSeconds: 420,
    knowledgeTags: ['negation', 'de-morgan', 'logical-and-or', 'inequality', 'rational-number'],
    skillTags: ['condition-reading', 'case-classification', 'conclusion'],
    problem: [
      { type: 'text', text: 'x、y は実数、n は自然数とする。次の条件の否定を述べよ。' },
      { type: 'latex', latex: '(1)\\;x=2\\;\\text{かつ}\\;y\\ne-1' },
      { type: 'latex', latex: '(2)\\;x>8\\;\\text{または}\\;x=3' },
      { type: 'latex', latex: '(3)\\;5<x\\le10' },
      { type: 'text', text: '(4) n は偶数または 5 の倍数である。' },
      { type: 'text', text: '(5) x、y の少なくとも一方は無理数である。' },
    ],
    guide: [
      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: '「かつ」全体を成り立たなくするには少なくとも一方を失敗させる。「または」全体を成り立たなくするには両方を失敗させる。この意味から複合条件の否定規則を作る。',
        }],
      },
      { type: 'blank', blankId: 'rule' },

      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: '(1) は「かつ」の条件なので、2つの原子条件をそれぞれ否定し、全体が失敗する形に結び直す。',
        }],
      },
      { type: 'blank', blankId: 'p1-result' },

      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: '(2) は「または」の条件なので、元の2条件がどちらも成り立たない場合を表す。',
        }],
      },
      { type: 'blank', blankId: 'p2-result' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(3) の連続不等式を、まず2つの条件の「かつ」として読む。' },
          { type: 'latex', latex: 'x>5\\;\\text{かつ}\\;x\\le10' },
        ],
      },
      { type: 'blank', blankId: 'p3-result' },

      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: '(4) は「偶数」と「5の倍数」の少なくとも一方を満たす条件である。全体を否定するには両方の性質を否定する。',
        }],
      },
      { type: 'blank', blankId: 'p4-result' },

      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: '(5) の「少なくとも一方が無理数」は「xが無理数 または yが無理数」と読む。これが成り立たない状態を考える。',
        }],
      },
      { type: 'blank', blankId: 'p5-result' },
    ],
    blanks: [
      {
        id: 'rule',
        prompt: '複合条件全体を否定するときの正しい対応は',
        choices: [
          choice('de-morgan', 'かつ→否定同士を「または」、または→否定同士を「かつ」', true),
          choice('keep-connective', 'かつ→否定同士を「かつ」、または→否定同士を「または」'),
          choice('swap-only', '接続語だけを入れ替え、各条件はそのままにする'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['negation', 'de-morgan', 'logical-and-or'],
        explanation: '「かつ」を壊すには少なくとも一方が失敗し、「または」を壊すには両方が失敗するため、各条件を否定したうえで接続語が入れ替わります。',
      },
      {
        id: 'p1-result',
        prompt: '(1) の否定は',
        choices: [
          choice('correct', 'x≠2 または y=-1', true),
          choice('and', 'x≠2 かつ y=-1'),
          choice('wrong-y', 'x≠2 または y≠-1'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['negation', 'de-morgan'],
        explanation: 'x=2 の否定は x≠2、y≠-1 の否定は y=-1。「かつ」の否定なので「または」で結びます。',
      },
      {
        id: 'p2-result',
        prompt: '(2) の否定は',
        choices: [
          choice('correct', 'x≤8 かつ x≠3', true),
          choice('or', 'x≤8 または x≠3'),
          choice('boundary-loss', 'x<8 かつ x≠3'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['negation', 'de-morgan', 'inequality'],
        explanation: 'x>8 の否定は境界を含む x≤8、x=3 の否定は x≠3。「または」の否定なので「かつ」で結びます。',
      },
      {
        id: 'p3-result',
        prompt: '(3) の否定は',
        choices: [
          choice('correct', 'x≤5 または x>10', true),
          choice('boundary-wrong', 'x<5 または x≥10'),
          choice('inside', '5≤x<10'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['negation', 'de-morgan', 'inequality'],
        explanation: '5<x≤10 は x>5 かつ x≤10。各条件を否定すると x≤5 と x>10 になり、「または」で結びます。',
      },
      {
        id: 'p4-result',
        prompt: '(4) の否定は',
        choices: [
          choice('correct', 'n は奇数かつ 5 の倍数でない。', true),
          choice('or', 'n は奇数または 5 の倍数でない。'),
          choice('even-not-five', 'n は偶数かつ 5 の倍数でない。'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['negation', 'de-morgan'],
        explanation: '偶数の否定は奇数、5の倍数の否定は5の倍数でないこと。「または」の否定なので両方を「かつ」で満たします。',
      },
      {
        id: 'p5-result',
        prompt: '(5) の否定は',
        choices: [
          choice('both-rational', 'x、y はともに有理数である。', true),
          choice('both-irrational', 'x、y はともに無理数である。'),
          choice('at-least-rational', 'x、y の少なくとも一方は有理数である。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['negation', 'de-morgan', 'rational-number'],
        explanation: '「少なくとも一方が無理数」の否定は「どちらも無理数ではない」。x,y は実数なので、両方とも有理数です。',
      },
    ],
    simulation: [
      {
        id: 's1',
        label: '(1)',
        prompt: 'x=2 かつ y≠-1 の否定を選べ。',
        answerType: 'single-choice',
        choices: [choice('correct', 'x≠2 または y=-1', true), choice('and', 'x≠2 かつ y=-1'), choice('wrong-y', 'x≠2 または y≠-1')],
        score: 2,
        estimatedSeconds: 25,
        knowledgeTags: ['negation', 'de-morgan'],
        skillTags: ['case-classification'],
      },
      {
        id: 's2',
        label: '(2)',
        prompt: 'x>8 または x=3 の否定を選べ。',
        answerType: 'single-choice',
        choices: [choice('correct', 'x≤8 かつ x≠3', true), choice('or', 'x≤8 または x≠3'), choice('boundary-loss', 'x<8 かつ x≠3')],
        score: 2,
        estimatedSeconds: 25,
        knowledgeTags: ['negation', 'de-morgan', 'inequality'],
        skillTags: ['case-classification'],
      },
      {
        id: 's3',
        label: '(3)',
        prompt: '5<x≤10 の否定を選べ。',
        answerType: 'single-choice',
        choices: [choice('correct', 'x≤5 または x>10', true), choice('boundary-wrong', 'x<5 または x≥10'), choice('inside', '5≤x<10')],
        score: 2,
        estimatedSeconds: 25,
        knowledgeTags: ['negation', 'de-morgan', 'inequality'],
        skillTags: ['case-classification'],
      },
      {
        id: 's4',
        label: '(4)',
        prompt: '「n は偶数または5の倍数」の否定を選べ。',
        answerType: 'single-choice',
        choices: [choice('correct', 'n は奇数かつ 5 の倍数でない。', true), choice('or', 'n は奇数または 5 の倍数でない。'), choice('even-not-five', 'n は偶数かつ 5 の倍数でない。')],
        score: 2,
        estimatedSeconds: 25,
        knowledgeTags: ['negation', 'de-morgan'],
        skillTags: ['case-classification'],
      },
      {
        id: 's5',
        label: '(5)',
        prompt: '「x,y の少なくとも一方は無理数」の否定を選べ。',
        answerType: 'single-choice',
        choices: [choice('both-rational', 'x、y はともに有理数である。', true), choice('both-irrational', 'x、y はともに無理数である。'), choice('at-least-rational', 'x、y の少なくとも一方は有理数である。')],
        score: 2,
        estimatedSeconds: 25,
        knowledgeTags: ['negation', 'de-morgan', 'rational-number'],
        skillTags: ['conclusion'],
      },
    ],
    fullExplanation: '複合条件の否定は、各原子条件を否定したうえで De Morgan の対応を使う。「かつ」の否定は否定同士を「または」、「または」の否定は否定同士を「かつ」で結ぶ。「少なくとも一方」の否定は「両方とも〜でない」である。',
  },

]

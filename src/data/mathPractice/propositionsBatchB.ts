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
  {
    problemNo: 104,
    section: 'propositions',
    sectionTitle: '命題と条件',
    title: '必要条件・十分条件',
    estimatedSeconds: 600,
    knowledgeTags: ['necessary-condition', 'sufficient-condition', 'implication', 'equivalence'],
    skillTags: ['condition-reading', 'case-classification', 'conclusion'],
    problem: [
      { type: 'text', text: 'x、y は実数とする。次の□には、「必要条件であるが十分条件ではない」「十分条件であるが必要条件ではない」「必要十分条件である」「必要条件でも十分条件でもない」のうち、どれが入るか。' },
      { type: 'latex', latex: '(1)\\;x=2\\;\\text{ は }\\;x^2-5x+6=0\\;\\text{ であるための□}' },
      { type: 'latex', latex: '(2)\\;x\\ne0\\;\\text{ は }\\;(x-1)(x-2)=0\\;\\text{ であるための□}' },
      { type: 'latex', latex: '(3)\\;xy=1\\;\\text{ は }\\;x=1\\;\\text{ であるための□}' },
      { type: 'latex', latex: '(4)\\;|x|=0\\;\\text{ は }\\;x=0\\;\\text{ であるための□}' },
      { type: 'latex', latex: '(5)\\;x=y=2\\;\\text{ は }\\;2x-y=2y-2=2\\;\\text{ であるための□}' },
      { type: 'text', text: '(6) 四角形ABCDがひし形であることは、四角形ABCDが正方形であるための□。' },
    ],
    guide: [
      {
        type: 'content',
        blocks: [{
          type: 'text',
          text: 'まず、p が q のための何条件かを決めるとき、p⇒q と q⇒p がそれぞれ何を意味するかを固定する。',
        }],
      },
      { type: 'blank', blankId: 'rule' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(1) では p:x=2、q:x²-5x+6=0 とする。p から q は代入で確認し、逆向きは方程式の解を全部見る。' },
          { type: 'latex', latex: '2^2-5\\cdot2+6=0' },
          { type: 'latex', latex: 'x^2-5x+6=(x-2)(x-3)=0\\Rightarrow x=2,3' },
          { type: 'text', text: 'したがって p⇒q は真だが、q⇒p は x=3 があるため偽である。' },
        ],
      },
      { type: 'blank', blankId: 'p1-classification' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(2) では p:x≠0、q:(x-1)(x-2)=0 とする。q の解は x=1,2 なので q⇒p は真。一方、x=3 は p を満たすが q を満たさないので p⇒q は偽である。' },
        ],
      },
      { type: 'blank', blankId: 'p2-classification' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(3) では p:xy=1、q:x=1 とする。x=2,y=1/2 は p を満たすが q を満たさない。逆に x=1,y=0 は q を満たすが p を満たさない。' },
        ],
      },
      { type: 'blank', blankId: 'p3-classification' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(4) では p:|x|=0、q:x=0 とする。絶対値が0になるのは x=0 のときだけであり、x=0 なら |x|=0 でもある。' },
        ],
      },
      { type: 'blank', blankId: 'p4-classification' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(5) では p:x=y=2。p を代入すると右の2式を満たす。逆向きは右の条件を実際に解く。' },
          { type: 'latex', latex: '2y-2=2\\Rightarrow y=2' },
          { type: 'latex', latex: '2x-y=2,\\;y=2\\Rightarrow x=2' },
          { type: 'text', text: 'したがって両方向とも成り立つ。' },
        ],
      },
      { type: 'blank', blankId: 'p5-classification' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(6) では p:ひし形、q:正方形。正方形なら4辺が等しいので q⇒p は真。一方、直角でないひし形を取れば p を満たして q を満たさないため p⇒q は偽である。' },
        ],
      },
      { type: 'blank', blankId: 'p6-classification' },
    ],
    blanks: [
      {
        id: 'rule',
        prompt: 'p が q のための条件を判定するときの正しい対応は',
        choices: [
          choice('direction-map', 'p⇒q が真なら p は十分条件、q⇒p が真なら p は必要条件。', true),
          choice('reversed-map', 'p⇒q が真なら p は必要条件、q⇒p が真なら p は十分条件。'),
          choice('both-needed', '両方向とも真でなければ、必要条件とも十分条件とも呼べない。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['necessary-condition', 'sufficient-condition', 'implication'],
        explanation: 'p⇒q が真なら p だけで q を保証できるので十分条件、q⇒p が真なら q が成り立つために p が必要なので必要条件です。',
      },
      {
        id: 'p1-classification',
        prompt: '(1) の2方向の真偽から p を分類すると',
        choices: [
          choice('sufficient-only', 'p⇒q:真、q⇒p:偽 → 十分条件だが必要条件ではない。', true),
          choice('necessary-only', 'p⇒q:偽、q⇒p:真 → 必要条件だが十分条件ではない。'),
          choice('iff', '両方向とも真 → 必要十分条件。'),
          choice('neither', '両方向とも偽 → 必要条件でも十分条件でもない。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['necessary-condition', 'sufficient-condition'],
        explanation: 'p⇒q だけが真なので、p は十分条件ですが必要条件ではありません。',
      },
      {
        id: 'p2-classification',
        prompt: '(2) の2方向の真偽から p を分類すると',
        choices: [
          choice('necessary-only', 'p⇒q:偽、q⇒p:真 → 必要条件だが十分条件ではない。', true),
          choice('sufficient-only', 'p⇒q:真、q⇒p:偽 → 十分条件だが必要条件ではない。'),
          choice('iff', '両方向とも真 → 必要十分条件。'),
          choice('neither', '両方向とも偽 → 必要条件でも十分条件でもない。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['necessary-condition', 'sufficient-condition'],
        explanation: 'q⇒p だけが真なので、p は必要条件ですが十分条件ではありません。',
      },
      {
        id: 'p3-classification',
        prompt: '(3) の2方向の真偽から p を分類すると',
        choices: [
          choice('neither', '両方向とも偽 → 必要条件でも十分条件でもない。', true),
          choice('sufficient-only', 'p⇒q:真、q⇒p:偽 → 十分条件だが必要条件ではない。'),
          choice('necessary-only', 'p⇒q:偽、q⇒p:真 → 必要条件だが十分条件ではない。'),
          choice('iff', '両方向とも真 → 必要十分条件。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['necessary-condition', 'sufficient-condition', 'counterexample'],
        explanation: 'p⇒q にも q⇒p にも反例があるため、p は必要条件でも十分条件でもありません。',
      },
      {
        id: 'p4-classification',
        prompt: '(4) の2方向の真偽から p を分類すると',
        choices: [
          choice('iff', '両方向とも真 → 必要十分条件。', true),
          choice('sufficient-only', 'p⇒q:真、q⇒p:偽 → 十分条件だが必要条件ではない。'),
          choice('necessary-only', 'p⇒q:偽、q⇒p:真 → 必要条件だが十分条件ではない。'),
          choice('neither', '両方向とも偽 → 必要条件でも十分条件でもない。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['necessary-condition', 'sufficient-condition', 'equivalence'],
        explanation: '|x|=0 と x=0 は互いに導けるため、必要十分条件です。',
      },
      {
        id: 'p5-classification',
        prompt: '(5) の2方向の真偽から p を分類すると',
        choices: [
          choice('iff', '両方向とも真 → 必要十分条件。', true),
          choice('necessary-only', 'p⇒q:偽、q⇒p:真 → 必要条件だが十分条件ではない。'),
          choice('sufficient-only', 'p⇒q:真、q⇒p:偽 → 十分条件だが必要条件ではない。'),
          choice('neither', '両方向とも偽 → 必要条件でも十分条件でもない。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['necessary-condition', 'sufficient-condition', 'equivalence'],
        explanation: '代入で p⇒q が成り立ち、右の連立条件から x=y=2 が一意に出るので q⇒p も成り立ちます。',
      },
      {
        id: 'p6-classification',
        prompt: '(6) の2方向の真偽から p を分類すると',
        choices: [
          choice('necessary-only', 'p⇒q:偽、q⇒p:真 → 必要条件だが十分条件ではない。', true),
          choice('sufficient-only', 'p⇒q:真、q⇒p:偽 → 十分条件だが必要条件ではない。'),
          choice('iff', '両方向とも真 → 必要十分条件。'),
          choice('neither', '両方向とも偽 → 必要条件でも十分条件でもない。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['necessary-condition', 'sufficient-condition'],
        explanation: '正方形ならひし形ですが、ひし形が必ず正方形とは限らないため、p は必要条件ですが十分条件ではありません。',
      },
    ],
    simulation: [
      {
        id: 's1',
        label: '(1)',
        prompt: 'x=2 は x²-5x+6=0 であるための何条件か。',
        answerType: 'single-choice',
        choices: [choice('sufficient-only', '十分条件だが必要条件ではない。', true), choice('necessary-only', '必要条件だが十分条件ではない。'), choice('iff', '必要十分条件。'), choice('neither', '必要条件でも十分条件でもない。')],
        score: 2, estimatedSeconds: 30,
        knowledgeTags: ['necessary-condition', 'sufficient-condition'], skillTags: ['conclusion'],
      },
      {
        id: 's2',
        label: '(2)',
        prompt: 'x≠0 は (x-1)(x-2)=0 であるための何条件か。',
        answerType: 'single-choice',
        choices: [choice('necessary-only', '必要条件だが十分条件ではない。', true), choice('sufficient-only', '十分条件だが必要条件ではない。'), choice('iff', '必要十分条件。'), choice('neither', '必要条件でも十分条件でもない。')],
        score: 2, estimatedSeconds: 30,
        knowledgeTags: ['necessary-condition', 'sufficient-condition'], skillTags: ['conclusion'],
      },
      {
        id: 's3',
        label: '(3)',
        prompt: 'xy=1 は x=1 であるための何条件か。',
        answerType: 'single-choice',
        choices: [choice('neither', '必要条件でも十分条件でもない。', true), choice('sufficient-only', '十分条件だが必要条件ではない。'), choice('necessary-only', '必要条件だが十分条件ではない。'), choice('iff', '必要十分条件。')],
        score: 2, estimatedSeconds: 30,
        knowledgeTags: ['necessary-condition', 'sufficient-condition'], skillTags: ['conclusion'],
      },
      {
        id: 's4',
        label: '(4)',
        prompt: '|x|=0 は x=0 であるための何条件か。',
        answerType: 'single-choice',
        choices: [choice('iff', '必要十分条件。', true), choice('sufficient-only', '十分条件だが必要条件ではない。'), choice('necessary-only', '必要条件だが十分条件ではない。'), choice('neither', '必要条件でも十分条件でもない。')],
        score: 2, estimatedSeconds: 30,
        knowledgeTags: ['necessary-condition', 'sufficient-condition', 'equivalence'], skillTags: ['conclusion'],
      },
      {
        id: 's5',
        label: '(5)',
        prompt: 'x=y=2 は 2x-y=2y-2=2 であるための何条件か。',
        answerType: 'single-choice',
        choices: [choice('iff', '必要十分条件。', true), choice('necessary-only', '必要条件だが十分条件ではない。'), choice('sufficient-only', '十分条件だが必要条件ではない。'), choice('neither', '必要条件でも十分条件でもない。')],
        score: 2, estimatedSeconds: 30,
        knowledgeTags: ['necessary-condition', 'sufficient-condition', 'equivalence'], skillTags: ['conclusion'],
      },
      {
        id: 's6',
        label: '(6)',
        prompt: 'ひし形であることは、正方形であるための何条件か。',
        answerType: 'single-choice',
        choices: [choice('necessary-only', '必要条件だが十分条件ではない。', true), choice('sufficient-only', '十分条件だが必要条件ではない。'), choice('iff', '必要十分条件。'), choice('neither', '必要条件でも十分条件でもない。')],
        score: 2, estimatedSeconds: 30,
        knowledgeTags: ['necessary-condition', 'sufficient-condition'], skillTags: ['conclusion'],
      },
    ],
    fullExplanation: 'p が q のための何条件かは、p⇒q と q⇒p を別々に確認してから決める。p⇒q が真なら十分条件、q⇒p が真なら必要条件であり、両方真なら必要十分、両方偽なら必要でも十分でもない。',
  },
  {
    problemNo: 105,
    section: 'propositions',
    sectionTitle: '命題と条件',
    title: '命題の真偽',
    estimatedSeconds: 420,
    knowledgeTags: ['truth-value', 'implication', 'counterexample', 'rational-number'],
    skillTags: ['condition-reading', 'case-classification', 'conclusion'],
    problem: [
      { type: 'text', text: 'a、b は実数とする。次の命題の真偽を調べよ。' },
      { type: 'latex', latex: '(1)\\;ab=0\\Rightarrow a^2+b^2=0' },
      { type: 'latex', latex: '(2)\\;a^2=4\\Rightarrow |a+1|\\ge1' },
      { type: 'text', text: '(3) ab が有理数ならば、a、b はともに有理数である。' },
      { type: 'text', text: '(4) a+b、ab がともに有理数ならば、a、b はともに有理数である。' },
    ],
    guide: [
      {
        type: 'content',
        blocks: [{ type: 'text', text: 'まず、含意が真であることを示す場合と、偽であることを示す場合で、何を確認すればよいかを整理する。' }],
      },
      { type: 'blank', blankId: 'rule' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(1) は ab=0 から「少なくとも一方が0」までは分かる。両方が0でなければ後件は崩れるので、前件を満たす具体例を探す。' }],
      },
      { type: 'blank', blankId: 'p1-result' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(2) は前件から a の可能性をすべて出し、各ケースで後件を確認する。' },
          { type: 'latex', latex: 'a^2=4\\Rightarrow a=2\\;\\text{または}\\;a=-2' },
          { type: 'latex', latex: 'a=2:\\ |a+1|=3\\ge1' },
          { type: 'latex', latex: 'a=-2:\\ |a+1|=1\\ge1' },
        ],
      },
      { type: 'blank', blankId: 'p2-result' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(3) は「積が有理数」でも、各因子まで有理数とは限らないことに注目し、無理数どうしで積だけが有理数になる例を探す。' }],
      },
      { type: 'blank', blankId: 'p3-result' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(4) は和と積の両方を同時に有理数にしながら、a、b 自体は無理数のままになる組を探す。' }],
      },
      { type: 'blank', blankId: 'p4-result' },
    ],
    blanks: [
      {
        id: 'rule',
        prompt: '命題 p⇒q の真偽を示すときの正しい考え方は',
        choices: [
          choice('all-vs-counterexample', '真なら p を満たすすべての場合で q を示し、偽なら p を満たして q を破る反例を1つ示す。', true),
          choice('one-example-both', '真でも偽でも、具体例を1つ調べれば十分である。'),
          choice('counterexample-for-true', '真を示すときは反例を1つ探せばよい。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['truth-value', 'implication', 'counterexample'],
        explanation: '含意が真であるには前件を満たすすべての場合で後件が必要です。偽は前件が真で後件が偽になる反例1つで示せます。',
      },
      {
        id: 'p1-result',
        prompt: '(1)を判定する反例と結論は',
        choices: [
          choice('counterexample-false', 'a=0,b=1 なら ab=0 だが a²+b²=1≠0。よって偽。', true),
          choice('zero-zero-true', 'a=0,b=0 で後件も成り立つので真。'),
          choice('one-one-false', 'a=1,b=1 が反例なので偽。'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['truth-value', 'counterexample'],
        explanation: 'a=0,b=1 は前件を満たし、後件を満たさないので反例です。',
      },
      {
        id: 'p2-result',
        prompt: '(2)の全ケース確認から分かるのは',
        choices: [
          choice('both-cases-true', 'a=2 と a=-2 の両方で |a+1|≥1 が成り立つので真。', true),
          choice('positive-only', 'a=2 の場合だけ確認できたので真。'),
          choice('negative-false', 'a=-2 のとき |a+1|<1 なので偽。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['truth-value', 'implication'],
        explanation: 'a²=4 の解は ±2 の2つで、どちらの場合も後件が成り立つため命題は真です。',
      },
      {
        id: 'p3-result',
        prompt: '(3)を判定する反例と結論は',
        choices: [
          choice('sqrt-two-false', 'a=b=√2 なら ab=2 は有理数だが a,b は無理数。よって偽。', true),
          choice('rational-example-true', 'a=b=1 で前件と後件が成り立つので真。'),
          choice('mixed-counterexample', 'a=√2,b=1 なら反例になるので偽。'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['truth-value', 'counterexample', 'rational-number'],
        explanation: '√2×√2=2 は有理数ですが、2つの因子はともに無理数なので反例です。',
      },
      {
        id: 'p4-result',
        prompt: '(4)を判定する反例と結論は',
        choices: [
          choice('conjugate-false', 'a=√2,b=-√2 なら a+b=0, ab=-2 は有理数だが a,b は無理数。よって偽。', true),
          choice('same-root-false', 'a=b=√2 なら和と積がともに有理数なので偽。'),
          choice('rational-example-true', 'a=b=1 で和と積が有理数なので真。'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['truth-value', 'counterexample', 'rational-number'],
        explanation: '√2 と -√2 の和は0、積は-2でどちらも有理数ですが、a,b は無理数なので反例です。',
      },
    ],
    simulation: [
      {
        id: 's1',
        label: '(1)',
        prompt: 'ab=0 ⇒ a²+b²=0 の真偽を選べ。',
        answerType: 'single-choice',
        choices: [choice('false', '偽', true), choice('true', '真')],
        score: 2, estimatedSeconds: 25,
        knowledgeTags: ['truth-value', 'counterexample'], skillTags: ['conclusion'],
      },
      {
        id: 's2',
        label: '(2)',
        prompt: 'a²=4 ⇒ |a+1|≥1 の真偽を選べ。',
        answerType: 'single-choice',
        choices: [choice('true', '真', true), choice('false', '偽')],
        score: 2, estimatedSeconds: 25,
        knowledgeTags: ['truth-value', 'implication'], skillTags: ['conclusion'],
      },
      {
        id: 's3',
        label: '(3)',
        prompt: 'ab が有理数 ⇒ a,b はともに有理数 の真偽を選べ。',
        answerType: 'single-choice',
        choices: [choice('false', '偽', true), choice('true', '真')],
        score: 2, estimatedSeconds: 25,
        knowledgeTags: ['truth-value', 'counterexample', 'rational-number'], skillTags: ['conclusion'],
      },
      {
        id: 's4',
        label: '(4)',
        prompt: 'a+b,ab がともに有理数 ⇒ a,b はともに有理数 の真偽を選べ。',
        answerType: 'single-choice',
        choices: [choice('false', '偽', true), choice('true', '真')],
        score: 2, estimatedSeconds: 25,
        knowledgeTags: ['truth-value', 'counterexample', 'rational-number'], skillTags: ['conclusion'],
      },
    ],
    fullExplanation: '含意が真であることを示すには前件を満たすすべての場合で後件を確認し、偽を示すには前件を満たして後件を破る反例を1つ示す。(2)では ±2 の全ケース確認、(1)(3)(4)では反例が決定的である。',
  },
  {
    problemNo: 106,
    section: 'propositions',
    sectionTitle: '命題と条件',
    title: '集合で条件を表す',
    estimatedSeconds: 360,
    knowledgeTags: ['set-expression', 'intersection', 'complement', 'divisibility'],
    skillTags: ['condition-reading', 'case-classification', 'conclusion'],
    problem: [
      { type: 'text', text: '自然数全体を全体集合とし、条件 p：2の倍数、q：3の倍数を満たす自然数全体の集合を、それぞれ P、Q とする。次の条件を満たす自然数全体の集合を P、Q を用いて表せ。' },
      { type: 'text', text: '(1) 6の倍数' },
      { type: 'text', text: '(2) 奇数' },
      { type: 'text', text: '(3) 3の倍数で奇数' },
      { type: 'text', text: '(4) 3の倍数でない奇数' },
    ],
    guide: [
      {
        type: 'content',
        blocks: [{ type: 'text', text: 'まず、日本語の「であり」と「でない」を集合演算へ直す共通規則を確認する。P は2の倍数、Q は3の倍数の集合である。' }],
      },
      { type: 'blank', blankId: 'rule' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(1) 6の倍数は、2の倍数でもあり3の倍数でもある。したがって P と Q の両方に入る自然数を表せばよい。' }],
      },
      { type: 'blank', blankId: 'p1-result' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(2) 奇数は、自然数の中で2の倍数ではない数である。P の外側を集合として表す。' }],
      },
      { type: 'blank', blankId: 'p2-result' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(3) 「3の倍数」は Q、「奇数」は2の倍数でない数である。この2条件を同時に満たす集合を作る。' }],
      },
      { type: 'blank', blankId: 'p3-result' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(4) 「3の倍数でない」と「奇数」を、それぞれ Q と P のどの部分に当たるか考え、2条件を同時に満たす集合へまとめる。' }],
      },
      { type: 'blank', blankId: 'p4-result' },
    ],
    blanks: [
      {
        id: 'rule',
        prompt: '日本語条件と集合演算の正しい対応は',
        choices: [
          choice('and-complement', '「であり」→共通部分、「でない」→補集合', true),
          choice('union-complement', '「であり」→和集合、「でない」→補集合'),
          choice('and-union', '「であり」→共通部分、「でない」→和集合'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['set-expression', 'intersection', 'complement'],
        explanation: '2条件を同時に満たす「であり」は共通部分、ある集合に入らない「でない」は補集合で表します。',
      },
      {
        id: 'p1-result',
        prompt: '6の倍数全体を P、Q で表すと',
        choices: [
          choice('p-inter-q', 'P∩Q', true),
          choice('p-union-q', 'P∪Q'),
          choice('p-complement', 'P̄'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['intersection', 'divisibility'],
        explanation: '6の倍数は2と3の両方の倍数なので、P と Q の共通部分です。',
      },
      {
        id: 'p2-result',
        prompt: '奇数全体を P、Q で表すと',
        choices: [
          choice('p-complement', 'P̄', true),
          choice('p', 'P'),
          choice('q-complement', 'Q̄'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['complement', 'divisibility'],
        explanation: '自然数の中で奇数は2の倍数ではない数なので、P の補集合です。',
      },
      {
        id: 'p3-result',
        prompt: '3の倍数で奇数である自然数全体は',
        choices: [
          choice('q-inter-pbar', 'Q∩P̄', true),
          choice('q-union-pbar', 'Q∪P̄'),
          choice('p-inter-qbar', 'P∩Q̄'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['intersection', 'complement', 'divisibility'],
        explanation: '3の倍数は Q、奇数は P の補集合で、両方を満たすので Q∩P̄ です。',
      },
      {
        id: 'p4-result',
        prompt: '3の倍数でない奇数全体は',
        choices: [
          choice('qbar-inter-pbar', 'Q̄∩P̄', true),
          choice('qbar-union-pbar', 'Q̄∪P̄'),
          choice('q-inter-pbar', 'Q∩P̄'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['intersection', 'complement', 'divisibility'],
        explanation: '3の倍数でない数は Q̄、奇数は P̄ で、2条件を同時に満たすため Q̄∩P̄ です。',
      },
    ],
    simulation: [
      {
        id: 's1', label: '(1)', prompt: '6の倍数全体を P、Q で表せ。', answerType: 'single-choice',
        choices: [choice('p-inter-q', 'P∩Q', true), choice('p-union-q', 'P∪Q'), choice('p-complement', 'P̄')],
        score: 2, estimatedSeconds: 25, knowledgeTags: ['intersection', 'divisibility'], skillTags: ['case-classification'],
      },
      {
        id: 's2', label: '(2)', prompt: '奇数全体を P、Q で表せ。', answerType: 'single-choice',
        choices: [choice('p-complement', 'P̄', true), choice('p', 'P'), choice('q-complement', 'Q̄')],
        score: 2, estimatedSeconds: 25, knowledgeTags: ['complement', 'divisibility'], skillTags: ['case-classification'],
      },
      {
        id: 's3', label: '(3)', prompt: '3の倍数で奇数である自然数全体を表せ。', answerType: 'single-choice',
        choices: [choice('q-inter-pbar', 'Q∩P̄', true), choice('q-union-pbar', 'Q∪P̄'), choice('p-inter-qbar', 'P∩Q̄')],
        score: 2, estimatedSeconds: 25, knowledgeTags: ['intersection', 'complement'], skillTags: ['conclusion'],
      },
      {
        id: 's4', label: '(4)', prompt: '3の倍数でない奇数全体を表せ。', answerType: 'single-choice',
        choices: [choice('qbar-inter-pbar', 'Q̄∩P̄', true), choice('qbar-union-pbar', 'Q̄∪P̄'), choice('q-inter-pbar', 'Q∩P̄')],
        score: 2, estimatedSeconds: 25, knowledgeTags: ['intersection', 'complement'], skillTags: ['conclusion'],
      },
    ],
    fullExplanation: 'P は2の倍数、Q は3の倍数の集合。「であり」は共通部分、「でない」は補集合として読む。したがって6の倍数は P∩Q、奇数は P̄、3の倍数で奇数は Q∩P̄、3の倍数でない奇数は Q̄∩P̄ となる。',
  },
  {
    problemNo: 107,
    section: 'propositions',
    sectionTitle: '命題と条件',
    title: '必要・十分条件の判定',
    estimatedSeconds: 540,
    knowledgeTags: ['necessary-condition', 'sufficient-condition', 'implication', 'geometry'],
    skillTags: ['condition-reading', 'case-classification', 'conclusion'],
    problem: [
      { type: 'text', text: 'x、y、z は実数とする。次の□には、「必要条件であるが十分条件ではない」「十分条件であるが必要条件ではない」「必要十分条件である」「必要条件でも十分条件でもない」のうち、どれが入るか。' },
      { type: 'latex', latex: '(1)\\;(x-y)(y-z)=0\\;\\text{ は }\\;x=y=z\\;\\text{ であるための□}' },
      { type: 'latex', latex: '(2)\\;x>0\\;\\text{かつ}\\;y<0\\;\\text{ は }\\;xy<0\\;\\text{ であるための□}' },
      { type: 'latex', latex: '(3)\\;x=y=0\\;\\text{ は }\\;xy=0\\;\\text{かつ}\\;x+y=0\\;\\text{ であるための□}' },
      { type: 'text', text: '(4) ∠A<90° は、△ABC が鋭角三角形であるための□。' },
      { type: 'latex', latex: '(5)\\;(a-b)(a^2+b^2-c^2)=0\\;\\text{ は直角二等辺三角形であるための□}' },
    ],
    guide: [
      {
        type: 'content',
        blocks: [{ type: 'text', text: 'まず、p が q であるための何条件かは、p⇒q と q⇒p を別々に調べてから分類する。' }],
      },
      { type: 'blank', blankId: 'rule' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(1) q:x=y=z なら x-y=0、y-z=0 なので q⇒p は成り立つ。一方、p は2因子の少なくとも一方が0ならよい。例えば x=0,y=0,z=1 では p は成り立つが q は成り立たない。' },
        ],
      },
      { type: 'blank', blankId: 'p1-classification' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(2) 正×負は負なので p⇒q は成り立つ。ただし積が負になる符号は「正×負」だけでなく「負×正」もある。' },
        ],
      },
      { type: 'blank', blankId: 'p2-classification' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(3) x=y=0 を代入すれば右の2条件はともに成り立つ。逆に xy=0 なら少なくとも一方が0であり、さらに x+y=0 も使うともう一方も0になる。' },
        ],
      },
      { type: 'blank', blankId: 'p3-classification' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(4) 鋭角三角形なら ∠A<90° は必ず成り立つ。逆に ∠A<90° だけでは残り2角までは決まらず、例えば A=60°、B=100°、C=20° は鋭角三角形ではない。' },
        ],
      },
      { type: 'blank', blankId: 'p4-classification' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(5) 積が0なので、a=b または a²+b²=c²。前者は A=B の二等辺、後者は ∠C=90° の直角三角形を表す。正三角形 a=b=c は p を満たすが直角ではない。逆に、直角が A にある直角二等辺三角形では b=c、a=√2 b となり、一般にどちらの因子も0にならない。' },
        ],
      },
      { type: 'blank', blankId: 'p5-classification' },
    ],
    blanks: [
      {
        id: 'rule',
        prompt: 'p が q のための条件を判定するときの正しい対応は',
        choices: [
          choice('direction-map', 'p⇒q が真なら p は十分条件、q⇒p が真なら p は必要条件。', true),
          choice('reversed-map', 'p⇒q が真なら p は必要条件、q⇒p が真なら p は十分条件。'),
          choice('both-only', '両方向が真のときだけ必要・十分を判定できる。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['necessary-condition', 'sufficient-condition', 'implication'],
        explanation: 'p⇒q が真なら p は q を保証するので十分条件、q⇒p が真なら q のために p が必要です。',
      },
      {
        id: 'p1-classification',
        prompt: '(1) の2方向から p を分類すると',
        choices: [
          choice('necessary-only', 'p⇒q:偽、q⇒p:真 → 必要条件だが十分条件ではない。', true),
          choice('sufficient-only', 'p⇒q:真、q⇒p:偽 → 十分条件だが必要条件ではない。'),
          choice('iff', '両方向とも真 → 必要十分条件。'),
          choice('neither', '両方向とも偽 → 必要条件でも十分条件でもない。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['necessary-condition', 'sufficient-condition'],
        explanation: 'x=y=z なら積は0ですが、積が0でも x=y=z とは限りません。',
      },
      {
        id: 'p2-classification',
        prompt: '(2) の2方向から p を分類すると',
        choices: [
          choice('sufficient-only', 'p⇒q:真、q⇒p:偽 → 十分条件だが必要条件ではない。', true),
          choice('necessary-only', 'p⇒q:偽、q⇒p:真 → 必要条件だが十分条件ではない。'),
          choice('iff', '両方向とも真 → 必要十分条件。'),
          choice('neither', '両方向とも偽 → 必要条件でも十分条件でもない。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['necessary-condition', 'sufficient-condition'],
        explanation: '正×負なら積は負ですが、積が負なら負×正の可能性もあるため逆向きは成り立ちません。',
      },
      {
        id: 'p3-classification',
        prompt: '(3) の2方向から p を分類すると',
        choices: [
          choice('iff', '両方向とも真 → 必要十分条件。', true),
          choice('necessary-only', 'p⇒q:偽、q⇒p:真 → 必要条件だが十分条件ではない。'),
          choice('sufficient-only', 'p⇒q:真、q⇒p:偽 → 十分条件だが必要条件ではない。'),
          choice('neither', '両方向とも偽 → 必要条件でも十分条件でもない。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['necessary-condition', 'sufficient-condition', 'equivalence'],
        explanation: 'x=y=0 なら右の条件を満たし、右の2条件からも x=y=0 が導けるので必要十分です。',
      },
      {
        id: 'p4-classification',
        prompt: '(4) の2方向から p を分類すると',
        choices: [
          choice('necessary-only', 'p⇒q:偽、q⇒p:真 → 必要条件だが十分条件ではない。', true),
          choice('sufficient-only', 'p⇒q:真、q⇒p:偽 → 十分条件だが必要条件ではない。'),
          choice('iff', '両方向とも真 → 必要十分条件。'),
          choice('neither', '両方向とも偽 → 必要条件でも十分条件でもない。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['necessary-condition', 'sufficient-condition', 'geometry'],
        explanation: '鋭角三角形なら A は鋭角ですが、A が鋭角だけでは他の角まで鋭角とは限りません。',
      },
      {
        id: 'p5-classification',
        prompt: '(5) の2方向から p を分類すると',
        choices: [
          choice('neither', '両方向とも偽 → 必要条件でも十分条件でもない。', true),
          choice('necessary-only', 'p⇒q:偽、q⇒p:真 → 必要条件だが十分条件ではない。'),
          choice('sufficient-only', 'p⇒q:真、q⇒p:偽 → 十分条件だが必要条件ではない。'),
          choice('iff', '両方向とも真 → 必要十分条件。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['necessary-condition', 'sufficient-condition', 'geometry'],
        explanation: 'a=b だけでも p は成立するため十分ではなく、直角位置が A や B の直角二等辺三角形では p が成立しないので必要でもありません。',
      },
    ],
    simulation: [
      {
        id: 's1', label: '(1)', prompt: '(x-y)(y-z)=0 は x=y=z であるための何条件か。', answerType: 'single-choice',
        choices: [choice('necessary-only', '必要条件だが十分条件ではない。', true), choice('sufficient-only', '十分条件だが必要条件ではない。'), choice('iff', '必要十分条件。'), choice('neither', '必要条件でも十分条件でもない。')],
        score: 2, estimatedSeconds: 30, knowledgeTags: ['necessary-condition', 'sufficient-condition'], skillTags: ['conclusion'],
      },
      {
        id: 's2', label: '(2)', prompt: 'x>0 かつ y<0 は xy<0 であるための何条件か。', answerType: 'single-choice',
        choices: [choice('sufficient-only', '十分条件だが必要条件ではない。', true), choice('necessary-only', '必要条件だが十分条件ではない。'), choice('iff', '必要十分条件。'), choice('neither', '必要条件でも十分条件でもない。')],
        score: 2, estimatedSeconds: 30, knowledgeTags: ['necessary-condition', 'sufficient-condition'], skillTags: ['conclusion'],
      },
      {
        id: 's3', label: '(3)', prompt: 'x=y=0 は xy=0 かつ x+y=0 であるための何条件か。', answerType: 'single-choice',
        choices: [choice('iff', '必要十分条件。', true), choice('necessary-only', '必要条件だが十分条件ではない。'), choice('sufficient-only', '十分条件だが必要条件ではない。'), choice('neither', '必要条件でも十分条件でもない。')],
        score: 2, estimatedSeconds: 30, knowledgeTags: ['necessary-condition', 'sufficient-condition', 'equivalence'], skillTags: ['conclusion'],
      },
      {
        id: 's4', label: '(4)', prompt: '∠A<90° は △ABC が鋭角三角形であるための何条件か。', answerType: 'single-choice',
        choices: [choice('necessary-only', '必要条件だが十分条件ではない。', true), choice('sufficient-only', '十分条件だが必要条件ではない。'), choice('iff', '必要十分条件。'), choice('neither', '必要条件でも十分条件でもない。')],
        score: 2, estimatedSeconds: 30, knowledgeTags: ['necessary-condition', 'sufficient-condition', 'geometry'], skillTags: ['conclusion'],
      },
      {
        id: 's5', label: '(5)', prompt: '(a-b)(a²+b²-c²)=0 は直角二等辺三角形であるための何条件か。', answerType: 'single-choice',
        choices: [choice('neither', '必要条件でも十分条件でもない。', true), choice('necessary-only', '必要条件だが十分条件ではない。'), choice('sufficient-only', '十分条件だが必要条件ではない。'), choice('iff', '必要十分条件。')],
        score: 2, estimatedSeconds: 35, knowledgeTags: ['necessary-condition', 'sufficient-condition', 'geometry'], skillTags: ['conclusion'],
      },
    ],
    fullExplanation: '必要・十分条件は必ず p⇒q と q⇒p を別々に調べて決める。(1)必要のみ、(2)十分のみ、(3)必要十分、(4)必要のみ、(5)どちらでもない。特に(5)は直角二等辺三角形の直角位置が固定されていない点が重要である。',
  },

]

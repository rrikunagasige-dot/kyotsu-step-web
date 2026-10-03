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
        skillTag: 'law-selection',
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
        skillTag: 'law-selection',
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
  },  {
    problemNo: 110,
    section: 'proofs',
    sectionTitle: '命題と証明',
    title: '逆・対偶・裏',
    estimatedSeconds: 720,
    knowledgeTags: ['implication', 'converse', 'contrapositive', 'inverse', 'counterexample'],
    skillTags: ['condition-reading', 'law-selection', 'calculation', 'conclusion'],
    problem: [
      { type: 'text', text: 'n は自然数、x は実数とする。次の命題の真偽を調べよ。また、その逆、対偶、裏を述べ、それらの真偽を調べよ。' },
      { type: 'text', text: '(1) n は9の倍数である ⇒ n は3の倍数である。' },
      { type: 'latex', latex: '(2)\\;x\\ne2\\Rightarrow x^2-3x+2\\ne0' },
      { type: 'latex', latex: '(3)\\;x^2-x=0\\Rightarrow (x=0\\;\\text{または}\\;x=1)' },
    ],
    guide: [
      {
        type: 'content',
        blocks: [{ type: 'text', text: '元の命題を p⇒q とおき、まず逆・対偶・裏で「向き」と「否定」をどう変えるかを整理する。' }],
      },
      { type: 'blank', blankId: 'rule' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(1) 元の命題。n が9の倍数なら n=9k と書ける。これを 3×整数 の形へ直して判定する。' },
          { type: 'latex', latex: 'n=9k=3(3k)' },
        ],
      },
      { type: 'blank', blankId: 'p1-original' },
      {
        type: 'content',
        blocks: [{ type: 'text', text: '(1) 次に逆 q⇒p を作り、前件を満たすが後件を満たさない自然数があるかを調べる。' }],
      },
      { type: 'blank', blankId: 'p1-converse' },
      {
        type: 'content',
        blocks: [{ type: 'text', text: '(1) 対偶では q と p をそれぞれ否定して、¬q⇒¬p の形を作る。' }],
      },
      { type: 'blank', blankId: 'p1-contrapositive' },
      {
        type: 'content',
        blocks: [{ type: 'text', text: '(1) 裏は ¬p⇒¬q。逆とは向きが違うので、文を作ってから反例の有無を調べる。' }],
      },
      { type: 'blank', blankId: 'p1-inverse' },
      {
        type: 'content',
        blocks: [{ type: 'text', text: '(1) 4つの命題を最後に1つの真偽表へまとめる。' }],
      },
      { type: 'blank', blankId: 'p1-summary' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(2) 元の命題を調べる。後件が失敗する値を見つけるため、多項式を因数分解する。' },
          { type: 'latex', latex: 'x^2-3x+2=(x-1)(x-2)' },
        ],
      },
      { type: 'blank', blankId: 'p2-original' },
      {
        type: 'content',
        blocks: [{ type: 'text', text: '(2) 逆は「多項式が0でない ⇒ x≠2」。x=2 のとき多項式がどうなるかから判定する。' }],
      },
      { type: 'blank', blankId: 'p2-converse' },
      {
        type: 'content',
        blocks: [{ type: 'text', text: '(2) 対偶は「多項式=0 ⇒ x=2」。因数分解で得た2つの根を使って判定する。' }],
      },
      { type: 'blank', blankId: 'p2-contrapositive' },
      {
        type: 'content',
        blocks: [{ type: 'text', text: '(2) 裏は「x=2 ⇒ 多項式=0」。実際に代入して判定する。' }],
      },
      { type: 'blank', blankId: 'p2-inverse' },
      {
        type: 'content',
        blocks: [{ type: 'text', text: '(2) 4つの命題の真偽をまとめる。' }],
      },
      { type: 'blank', blankId: 'p2-summary' },

      {
        type: 'content',
        blocks: [
          { type: 'text', text: '(3) 元の命題では左辺を因数分解し、積が0になる条件を読む。' },
          { type: 'latex', latex: 'x^2-x=x(x-1)' },
        ],
      },
      { type: 'blank', blankId: 'p3-original' },
      {
        type: 'content',
        blocks: [{ type: 'text', text: '(3) 逆では x=0 または x=1 を前件として、元の式が0になるかを確かめる。' }],
      },
      { type: 'blank', blankId: 'p3-converse' },
      {
        type: 'content',
        blocks: [{ type: 'text', text: '(3) 対偶では後件「x=0 または x=1」を否定する。「または」全体が失敗する条件にも注意する。' }],
      },
      { type: 'blank', blankId: 'p3-contrapositive' },
      {
        type: 'content',
        blocks: [{ type: 'text', text: '(3) 裏は元の前件を否定した条件から、後件の否定が導けるかを調べる。' }],
      },
      { type: 'blank', blankId: 'p3-inverse' },
      {
        type: 'content',
        blocks: [{ type: 'text', text: '(3) 最後に4つの真偽をまとめる。' }],
      },
      { type: 'blank', blankId: 'p3-summary' },
    ],
    blanks: [
      {
        id: 'rule',
        prompt: '元の命題が p⇒q のとき、逆・対偶・裏の正しい形は',
        choices: [
          choice('correct', '逆 q⇒p、対偶 ¬q⇒¬p、裏 ¬p⇒¬q。', true),
          choice('swap-contrapositive', '逆 q⇒p、対偶 ¬p⇒¬q、裏 ¬q⇒¬p。'),
          choice('negate-only', '逆 ¬p⇒¬q、対偶 q⇒p、裏 p⇒q。'),
        ],
        skillTag: 'law-selection',
        knowledgeTags: ['implication', 'converse', 'contrapositive', 'inverse'],
        explanation: '逆は向きだけを反転、対偶は向きを反転して両方を否定、裏は向きを保って両方を否定します。',
      },
      {
        id: 'p1-original',
        prompt: '(1) 元の命題の真偽は',
        choices: [
          choice('true', 'n=9k=3(3k) と書けるので真。', true),
          choice('false-three', 'n=3 が反例なので偽。'),
          choice('false-nine', 'n=9 が反例なので偽。'),
        ],
        skillTag: 'calculation',
        knowledgeTags: ['implication', 'divisibility'],
        explanation: '9の倍数は必ず 3×整数 の形に書けるので、元の命題は真です。',
      },
      {
        id: 'p1-converse',
        prompt: '(1) の逆と真偽は',
        choices: [
          choice('false-three', '「3の倍数 ⇒ 9の倍数」。n=3 が反例なので偽。', true),
          choice('true', '「3の倍数 ⇒ 9の倍数」。すべて成り立つので真。'),
          choice('wrong-form', '「3の倍数でない ⇒ 9の倍数でない」。真。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['converse', 'counterexample', 'divisibility'],
        explanation: '逆は q⇒p。「3の倍数なら9の倍数」は n=3 で破れるので偽です。',
      },
      {
        id: 'p1-contrapositive',
        prompt: '(1) の対偶と真偽は',
        choices: [
          choice('true', '「3の倍数でない ⇒ 9の倍数でない」。真。', true),
          choice('inverse-false', '「9の倍数でない ⇒ 3の倍数でない」。偽。'),
          choice('wrong-negation', '「3の倍数 ⇒ 9の倍数でない」。真。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['contrapositive', 'negation', 'divisibility'],
        explanation: '9の倍数なら必ず3の倍数なので、3の倍数でない数が9の倍数であることはありません。',
      },
      {
        id: 'p1-inverse',
        prompt: '(1) の裏と真偽は',
        choices: [
          choice('false-three', '「9の倍数でない ⇒ 3の倍数でない」。n=3 が反例なので偽。', true),
          choice('true', '「9の倍数でない ⇒ 3の倍数でない」。真。'),
          choice('wrong-form', '「3の倍数でない ⇒ 9の倍数でない」。真。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['inverse', 'counterexample', 'divisibility'],
        explanation: '裏は ¬p⇒¬q。n=3 は9の倍数ではありませんが3の倍数なので反例です。',
      },
      {
        id: 'p1-summary',
        prompt: '(1) の4つの真偽をまとめると',
        choices: [
          choice('tftf', '元：真、逆：偽、対偶：真、裏：偽。', true),
          choice('ttff', '元：真、逆：真、対偶：偽、裏：偽。'),
          choice('ftft', '元：偽、逆：真、対偶：偽、裏：真。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['implication', 'converse', 'contrapositive', 'inverse'],
        explanation: '(1) は 真・偽・真・偽 の順です。',
      },

      {
        id: 'p2-original',
        prompt: '(2) 元の命題の真偽は',
        choices: [
          choice('false-one', 'x=1 なら x≠2 だが多項式は0。反例があるので偽。', true),
          choice('true-factor', '因数分解できるので必ず真。'),
          choice('false-two', 'x=2 が前件を満たす反例なので偽。'),
        ],
        skillTag: 'calculation',
        knowledgeTags: ['implication', 'counterexample', 'factorization'],
        explanation: 'x=1 は前件 x≠2 を満たす一方、(x-1)(x-2)=0 なので後件を破ります。',
      },
      {
        id: 'p2-converse',
        prompt: '(2) の逆と真偽は',
        choices: [
          choice('true', '「x²-3x+2≠0 ⇒ x≠2」。x=2 なら多項式は0なので真。', true),
          choice('false-one', '「x²-3x+2≠0 ⇒ x≠2」。x=1 が反例なので偽。'),
          choice('wrong-form', '「x²-3x+2=0 ⇒ x=2」。真。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['converse', 'factorization'],
        explanation: '多項式が0でないなら x=2 ではあり得ないため、逆は真です。',
      },
      {
        id: 'p2-contrapositive',
        prompt: '(2) の対偶と真偽は',
        choices: [
          choice('false-one', '「x²-3x+2=0 ⇒ x=2」。x=1 が反例なので偽。', true),
          choice('true', '「x²-3x+2=0 ⇒ x=2」。真。'),
          choice('wrong-form', '「x=2 ⇒ x²-3x+2=0」。真。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['contrapositive', 'counterexample', 'factorization'],
        explanation: '多項式=0 の解は1と2なので、x=1 が「必ず x=2」を破ります。',
      },
      {
        id: 'p2-inverse',
        prompt: '(2) の裏と真偽は',
        choices: [
          choice('true', '「x=2 ⇒ x²-3x+2=0」。代入すると0なので真。', true),
          choice('false-one', '「x=2 ⇒ x²-3x+2=0」。x=1 が反例なので偽。'),
          choice('wrong-form', '「x²-3x+2=0 ⇒ x=2」。偽。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['inverse', 'calculation'],
        explanation: 'x=2 を代入すると 4-6+2=0 なので裏は真です。',
      },
      {
        id: 'p2-summary',
        prompt: '(2) の4つの真偽をまとめると',
        choices: [
          choice('ftft', '元：偽、逆：真、対偶：偽、裏：真。', true),
          choice('tftf', '元：真、逆：偽、対偶：真、裏：偽。'),
          choice('tttt', '4つとも真。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['implication', 'converse', 'contrapositive', 'inverse'],
        explanation: '(2) は 偽・真・偽・真 の順です。',
      },

      {
        id: 'p3-original',
        prompt: '(3) 元の命題の真偽は',
        choices: [
          choice('true-zero-product', 'x(x-1)=0 なら x=0 または x=1。よって真。', true),
          choice('false-half', 'x=1/2 が反例なので偽。'),
          choice('false-one', 'x=1 が反例なので偽。'),
        ],
        skillTag: 'calculation',
        knowledgeTags: ['implication', 'factorization', 'zero-product'],
        explanation: '積が0なら少なくとも一方の因子が0なので、x=0 または x=1 です。',
      },
      {
        id: 'p3-converse',
        prompt: '(3) の逆と真偽は',
        choices: [
          choice('true', '「x=0 または x=1 ⇒ x²-x=0」。どちらを代入しても0なので真。', true),
          choice('false-half', '「x=0 または x=1 ⇒ x²-x=0」。x=1/2 が反例なので偽。'),
          choice('wrong-form', '「x≠0 かつ x≠1 ⇒ x²-x≠0」。真。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['converse', 'calculation'],
        explanation: 'x=0 と x=1 のどちらの場合も x²-x=0 になるため逆は真です。',
      },
      {
        id: 'p3-contrapositive',
        prompt: '(3) の対偶と真偽は',
        choices: [
          choice('true', '「x≠0 かつ x≠1 ⇒ x²-x≠0」。2因子がともに0でないので真。', true),
          choice('or-negation', '「x≠0 または x≠1 ⇒ x²-x≠0」。真。'),
          choice('inverse', '「x²-x≠0 ⇒ x≠0 かつ x≠1」。真。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['contrapositive', 'negation', 'de-morgan'],
        explanation: '「x=0 または x=1」の否定は「x≠0 かつ x≠1」です。すると x(x-1) の両因子が0でないので積も0ではありません。',
      },
      {
        id: 'p3-inverse',
        prompt: '(3) の裏と真偽は',
        choices: [
          choice('true', '「x²-x≠0 ⇒ x≠0 かつ x≠1」。真。', true),
          choice('false-half', '同じ文は x=1/2 で偽。'),
          choice('wrong-form', '「x≠0 かつ x≠1 ⇒ x²-x≠0」。真。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['inverse', 'factorization'],
        explanation: 'x²-x が0でないなら x=0,1 のどちらでもありません。したがって裏も真です。',
      },
      {
        id: 'p3-summary',
        prompt: '(3) の4つの真偽をまとめると',
        choices: [
          choice('tttt', '元：真、逆：真、対偶：真、裏：真。', true),
          choice('tftf', '元：真、逆：偽、対偶：真、裏：偽。'),
          choice('ftft', '元：偽、逆：真、対偶：偽、裏：真。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['implication', 'converse', 'contrapositive', 'inverse'],
        explanation: '(3) は4つすべて真です。',
      },
    ],
    simulation: [
      {
        id: 's1', label: '(1)', prompt: '(1) の元・逆・対偶・裏の真偽を選べ。', answerType: 'single-choice',
        choices: [choice('tftf', '真・偽・真・偽', true), choice('ftft', '偽・真・偽・真'), choice('tttt', '真・真・真・真')],
        score: 2, estimatedSeconds: 35, knowledgeTags: ['converse', 'contrapositive', 'inverse'], skillTags: ['conclusion'],
      },
      {
        id: 's2', label: '(2)', prompt: '(2) の元・逆・対偶・裏の真偽を選べ。', answerType: 'single-choice',
        choices: [choice('ftft', '偽・真・偽・真', true), choice('tftf', '真・偽・真・偽'), choice('tttt', '真・真・真・真')],
        score: 2, estimatedSeconds: 35, knowledgeTags: ['converse', 'contrapositive', 'inverse'], skillTags: ['conclusion'],
      },
      {
        id: 's3', label: '(3)', prompt: '(3) の元・逆・対偶・裏の真偽を選べ。', answerType: 'single-choice',
        choices: [choice('tttt', '真・真・真・真', true), choice('tftf', '真・偽・真・偽'), choice('ftft', '偽・真・偽・真')],
        score: 2, estimatedSeconds: 35, knowledgeTags: ['converse', 'contrapositive', 'inverse'], skillTags: ['conclusion'],
      },
    ],
    fullExplanation: '元命題 p⇒q に対し、逆は q⇒p、対偶は ¬q⇒¬p、裏は ¬p⇒¬q。(1) は 真・偽・真・偽、(2) は 偽・真・偽・真、(3) は4つすべて真となる。各真偽は倍数の定義、因数分解、反例、否定の作り方を用いて個別に確認する。',
  },
  {
    problemNo: 111,
    section: 'proofs',
    sectionTitle: '命題と証明',
    title: '対偶による証明',
    estimatedSeconds: 600,
    knowledgeTags: ['contrapositive', 'negation', 'inequality', 'divisibility', 'parity'],
    skillTags: ['law-selection', 'condition-reading', 'calculation', 'conclusion'],
    problem: [
      { type: 'text', text: 'x、y は実数、n は整数とする。対偶を考えて、次の命題を証明せよ。' },
      { type: 'latex', latex: '(1)\\;x^3\\ne1\\Rightarrow x\\ne1' },
      { type: 'latex', latex: '(2)\\;x+y>3\\Rightarrow (x>2\\;\\text{または}\\;y>1)' },
      { type: 'text', text: '(3) n² が3の倍数でないならば、n は3の倍数でない。' },
      { type: 'text', text: '(4) n³+1 が奇数ならば、n は偶数である。' },
    ],
    guide: [
      {
        type: 'content',
        blocks: [{ type: 'text', text: '今回は「対偶を考えて」と指定されている。方法を選ぶのではなく、まず p⇒q の対偶を正しく作る形を確認する。' }],
      },
      { type: 'blank', blankId: 'rule' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(1) 後件 x≠1 と前件 x³≠1 をそれぞれ否定し、向きを反転して対偶を作る。' }],
      },
      { type: 'blank', blankId: 'p1-contrapositive' },
      {
        type: 'content',
        blocks: [{ type: 'text', text: '(1) 作った対偶の前件を仮定し、右側を直接計算して証明する。' }],
      },
      { type: 'blank', blankId: 'p1-proof' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(2) 後件は「x>2 または y>1」。この「または」全体が成り立たない条件を先に作る。' }],
      },
      { type: 'blank', blankId: 'p2-negation' },
      {
        type: 'content',
        blocks: [{ type: 'text', text: '(2) 後件の否定を対偶の前件として、x+y の上限を直接評価する。' }],
      },
      { type: 'blank', blankId: 'p2-proof' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(3) 「n² が3の倍数でない」と「n が3の倍数でない」をそれぞれ否定し、対偶を文章で作る。' }],
      },
      { type: 'blank', blankId: 'p3-contrapositive' },
      {
        type: 'content',
        blocks: [{ type: 'text', text: '(3) 対偶の前件「n は3の倍数」を、ある整数 k を使う式に直し、2乗する。' }],
      },
      { type: 'blank', blankId: 'p3-proof' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(4) 「偶数」と「奇数」を正しく否定して、対偶の文章を作る。' }],
      },
      { type: 'blank', blankId: 'p4-contrapositive' },
      {
        type: 'content',
        blocks: [{ type: 'text', text: '(4) 対偶の前件 n が奇数であることを、ある整数 k を用いた式へ直す。' }],
      },
      { type: 'blank', blankId: 'p4-form' },
      {
        type: 'content',
        blocks: [{ type: 'text', text: '(4) その式を n³+1 へ代入し、全体を 2×整数 の形まで整理する。' }],
      },
      { type: 'blank', blankId: 'p4-proof' },
    ],
    blanks: [
      {
        id: 'rule',
        prompt: '元の命題 p⇒q の対偶は',
        choices: [
          choice('correct', '¬q⇒¬p', true),
          choice('inverse', '¬p⇒¬q'),
          choice('converse', 'q⇒p'),
        ],
        skillTag: 'law-selection',
        knowledgeTags: ['contrapositive', 'negation', 'implication'],
        explanation: '対偶は後件と前件をどちらも否定し、向きを反転した ¬q⇒¬p です。',
      },
      {
        id: 'p1-contrapositive',
        prompt: '(1) の対偶は',
        choices: [
          choice('correct', 'x=1 ⇒ x³=1', true),
          choice('inverse', 'x³=1 ⇒ x=1'),
          choice('same', 'x³≠1 ⇒ x≠1'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['contrapositive', 'negation'],
        explanation: 'x≠1 の否定は x=1、x³≠1 の否定は x³=1 なので、対偶は x=1⇒x³=1 です。',
      },
      {
        id: 'p1-proof',
        prompt: '(1) の対偶を証明して元命題へ戻すと',
        choices: [
          choice('correct', 'x=1 なら x³=1³=1。対偶が真なので元の命題も真。', true),
          choice('wrong-cube', 'x=1 なら x³=3 なので対偶は偽。'),
          choice('example-only', 'x=2 では元命題が成り立つので証明完了。'),
        ],
        skillTag: 'calculation',
        knowledgeTags: ['contrapositive', 'conclusion'],
        explanation: '対偶の前件 x=1 から後件 x³=1 が直接示せるので、対偶、したがって元命題も真です。',
      },
      {
        id: 'p2-negation',
        prompt: '(2) の後件「x>2 または y>1」の否定は',
        choices: [
          choice('and-le', 'x≤2 かつ y≤1', true),
          choice('or-le', 'x≤2 または y≤1'),
          choice('and-ge', 'x≥2 かつ y≥1'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['contrapositive', 'negation', 'de-morgan', 'inequality'],
        explanation: '「A または B」の否定は「Aでない かつ Bでない」。> の否定では境界を含めて ≤ になります。',
      },
      {
        id: 'p2-proof',
        prompt: '(2) の対偶を完成させて証明すると',
        choices: [
          choice('correct', 'x≤2 かつ y≤1 なら x+y≤2+1=3。よって対偶が真で、元命題も真。', true),
          choice('strict', 'x≤2 かつ y≤1 なら必ず x+y<3。'),
          choice('wrong-direction', 'x+y≤3 なら必ず x≤2 かつ y≤1。'),
        ],
        skillTag: 'calculation',
        knowledgeTags: ['contrapositive', 'inequality', 'conclusion'],
        explanation: '対偶は「x≤2 かつ y≤1 ⇒ x+y≤3」で、左辺から和の上限を直接足せます。',
      },
      {
        id: 'p3-contrapositive',
        prompt: '(3) の対偶は',
        choices: [
          choice('correct', 'n が3の倍数ならば、n² は3の倍数である。', true),
          choice('same', 'n² が3の倍数でないならば、n は3の倍数でない。'),
          choice('inverse', 'n² が3の倍数ならば、n は3の倍数である。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['contrapositive', 'negation', 'divisibility'],
        explanation: '後件「n は3の倍数でない」の否定は「3の倍数」、前件の否定は「n² は3の倍数」です。',
      },
      {
        id: 'p3-proof',
        prompt: '(3) の対偶を倍数の定義で証明すると',
        choices: [
          choice('correct', 'n=3k とおけば n²=9k²=3(3k²)。よって n² は3の倍数で、元命題も真。', true),
          choice('wrong-factor', 'n=3k なら n²=3k² なので証明できる。'),
          choice('wrong-form', 'n=3k+1 とおけば n² は3の倍数になる。'),
        ],
        skillTag: 'calculation',
        knowledgeTags: ['contrapositive', 'divisibility', 'conclusion'],
        explanation: 'n=3k を2乗すると n²=9k²=3(3k²) となり、3×整数の形が得られます。',
      },
      {
        id: 'p4-contrapositive',
        prompt: '(4) の対偶は',
        choices: [
          choice('correct', 'n が奇数ならば、n³+1 は偶数である。', true),
          choice('inverse', 'n が偶数ならば、n³+1 は奇数である。'),
          choice('same', 'n³+1 が奇数ならば、n は偶数である。'),
        ],
        skillTag: 'condition-reading',
        knowledgeTags: ['contrapositive', 'negation', 'parity'],
        explanation: '「n は偶数」の否定は「n は奇数」、「n³+1 は奇数」の否定は「n³+1 は偶数」です。',
      },
      {
        id: 'p4-form',
        prompt: 'n が奇数であることを整数 k で表すと',
        choices: [
          choice('odd-form', 'n=2k+1', true),
          choice('even-form', 'n=2k'),
          choice('three-form', 'n=3k+1'),
        ],
        skillTag: 'equation-building',
        knowledgeTags: ['parity', 'contrapositive'],
        explanation: '奇数は 2×整数+1 の形なので n=2k+1 と表します。',
      },
      {
        id: 'p4-proof',
        prompt: 'n=2k+1 を使って対偶を証明すると',
        choices: [
          choice('correct', 'n³+1=8k³+12k²+6k+2=2(4k³+6k²+3k+1)。よって偶数で、元命題も真。', true),
          choice('odd-result', 'n³+1=2(4k³+6k²+3k)+1 なので奇数。'),
          choice('no-factor', '展開できても2×整数の形にはできない。'),
        ],
        skillTag: 'calculation',
        knowledgeTags: ['contrapositive', 'parity', 'conclusion'],
        explanation: '展開後に2をくくると 2×整数 の形になるため n³+1 は偶数です。よって対偶、元命題ともに真です。',
      },
    ],
    simulation: [
      {
        id: 's1', label: '(1)', prompt: '(1) の対偶を選べ。', answerType: 'single-choice',
        choices: [choice('correct', 'x=1⇒x³=1', true), choice('wrong', 'x³=1⇒x=1')],
        score: 2, estimatedSeconds: 25, knowledgeTags: ['contrapositive'], skillTags: ['condition-reading'],
      },
      {
        id: 's2', label: '(2)', prompt: '「x>2 または y>1」の否定を選べ。', answerType: 'single-choice',
        choices: [choice('correct', 'x≤2 かつ y≤1', true), choice('wrong', 'x≤2 または y≤1')],
        score: 2, estimatedSeconds: 25, knowledgeTags: ['negation', 'de-morgan'], skillTags: ['condition-reading'],
      },
      {
        id: 's3', label: '(3)', prompt: '(3) の対偶の前件 n が3の倍数のとき、証明に使う式を選べ。', answerType: 'single-choice',
        choices: [choice('correct', 'n=3k', true), choice('wrong', 'n=3k+1')],
        score: 2, estimatedSeconds: 25, knowledgeTags: ['divisibility'], skillTags: ['calculation'],
      },
      {
        id: 's4', label: '(4)', prompt: '奇数 n の表し方を選べ。', answerType: 'single-choice',
        choices: [choice('correct', 'n=2k+1', true), choice('wrong', 'n=2k')],
        score: 2, estimatedSeconds: 25, knowledgeTags: ['parity'], skillTags: ['calculation'],
      },
    ],
    fullExplanation: '対偶による証明では、元命題 p⇒q を ¬q⇒¬p に直してその対偶を直接示す。(1)は x=1 の代入、(2)は OR の否定を AND にして x+y≤3 を示す、(3)は n=3k から n²=3(3k²)、(4)は n=2k+1 を展開して n³+1=2×整数 と示す。各対偶が真なので元命題も真である。',
  },
  {
    problemNo: 112,
    section: 'proofs',
    sectionTitle: '命題と証明',
    title: '無理数の証明',
    estimatedSeconds: 480,
    knowledgeTags: ['irrational-number', 'proof-by-contradiction', 'rationalization', 'radical'],
    skillTags: ['law-selection', 'equation-building', 'calculation', 'conclusion'],
    problem: [
      { type: 'text', text: '√3 が無理数であることを用いて、次の数が無理数であることを証明せよ。' },
      { type: 'latex', latex: '(1)\\;1+\\sqrt{3}' },
      { type: 'latex', latex: '(2)\\;\\frac{1}{2+\\sqrt{3}}' },
    ],
    guide: [
      {
        type: 'content',
        blocks: [{ type: 'text', text: '今回は √3 が無理数であることが既知。対象が有理数だと仮定し、そこから √3 まで有理数になってしまう矛盾を作る。' }],
      },
      { type: 'blank', blankId: 'rule' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(1) 背理法では、示したい「無理数」の反対を仮定する。' }],
      },
      { type: 'blank', blankId: 'p1-assumption' },
      {
        type: 'content',
        blocks: [{ type: 'text', text: '(1) 仮定した有理数を r とおき、1+√3=r から √3 だけを残す。' }],
      },
      { type: 'blank', blankId: 'p1-isolate' },
      {
        type: 'content',
        blocks: [{ type: 'text', text: '(1) 得られた式の右辺がどの数の集合に入るかを確認し、既知の事実と比べる。' }],
      },
      { type: 'blank', blankId: 'p1-contradiction' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(2) √3 が分母にあるので、まず共役な式を用いて分母を有理化し、扱いやすい形へ直す。' }],
      },
      { type: 'blank', blankId: 'p2-rationalize' },
      {
        type: 'content',
        blocks: [{ type: 'text', text: '(2) 有理化後の値が有理数だと仮定し、その値を r とおく。' }],
      },
      { type: 'blank', blankId: 'p2-assumption' },
      {
        type: 'content',
        blocks: [{ type: 'text', text: '(2) 2-√3=r から、既知の無理数 √3 を単独にする。' }],
      },
      { type: 'blank', blankId: 'p2-isolate' },
      {
        type: 'content',
        blocks: [{ type: 'text', text: '(2) 最後に右辺の有理性と √3 の既知の無理性を比べ、背理法を閉じる。' }],
      },
      { type: 'blank', blankId: 'p2-contradiction' },
    ],
    blanks: [
      {
        id: 'rule',
        prompt: '√3 が無理数であることを使う背理法の方針は',
        choices: [
          choice('rational-assume', '対象を有理数だと仮定し、√3 が有理数になってしまう矛盾を作る。', true),
          choice('irrational-assume', '対象を無理数だと仮定し、そのまま結論とする。'),
          choice('decimal', '小数表示を調べ、循環しないことだけを示す。'),
        ],
        skillTag: 'law-selection',
        knowledgeTags: ['irrational-number', 'proof-by-contradiction'],
        explanation: '無理数であることの反対として「有理数」と仮定し、既知の無理数 √3 が有理数になってしまう矛盾を導きます。',
      },
      {
        id: 'p1-assumption',
        prompt: '(1) 背理法の最初の仮定は',
        choices: [
          choice('rational', '1+√3 は有理数である。', true),
          choice('irrational', '1+√3 は無理数である。'),
          choice('sqrt-rational', '√3 は有理数である。'),
        ],
        skillTag: 'law-selection',
        knowledgeTags: ['proof-by-contradiction', 'irrational-number'],
        explanation: '示したい結論「1+√3 は無理数」の反対を仮定するので、有理数だと仮定します。',
      },
      {
        id: 'p1-isolate',
        prompt: '1+√3=r から √3 を単独にすると',
        choices: [
          choice('r-minus-one', '√3=r-1', true),
          choice('one-minus-r', '√3=1-r'),
          choice('r-plus-one', '√3=r+1'),
        ],
        skillTag: 'equation-building',
        knowledgeTags: ['radical', 'proof-by-contradiction'],
        explanation: '両辺から1を引けば √3=r-1 です。',
      },
      {
        id: 'p1-contradiction',
        prompt: '(1) の証明を閉じる正しい結論は',
        choices: [
          choice('contradiction', 'r と1は有理数なので r-1 も有理数。すると √3 が有理数となり既知の事実と矛盾する。よって 1+√3 は無理数。', true),
          choice('no-contradiction', 'r-1 は必ず無理数なので矛盾は起こらない。'),
          choice('sqrt-rational', '√3 が有理数であると結論して証明を終える。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['irrational-number', 'proof-by-contradiction'],
        explanation: '有理数の差は有理数なので √3 が有理数になってしまい、「√3 は無理数」という既知の事実に矛盾します。',
      },
      {
        id: 'p2-rationalize',
        prompt: '(2) 分母を有理化する正しい変形は',
        choices: [
          choice('conjugate', '1/(2+√3) に (2-√3)/(2-√3) を掛けると 2-√3。', true),
          choice('same-sign', '1/(2+√3) に (2+√3)/(2+√3) を掛けると 2+√3。'),
          choice('sqrt-only', '√3/√3 を掛けると 2-√3。'),
        ],
        skillTag: 'calculation',
        knowledgeTags: ['rationalization', 'radical'],
        explanation: '(2+√3)(2-√3)=4-3=1 なので、共役を掛けると 1/(2+√3)=2-√3 となります。',
      },
      {
        id: 'p2-assumption',
        prompt: '(2) 背理法の仮定を有理化後の式で書くと',
        choices: [
          choice('two-minus-root', '値を有理数 r と仮定し、2-√3=r と書く。', true),
          choice('two-plus-root', '値を有理数 r と仮定し、2+√3=r と書く。'),
          choice('sqrt-alone', '√3=r と最初から仮定する。'),
        ],
        skillTag: 'equation-building',
        knowledgeTags: ['proof-by-contradiction', 'rationalization'],
        explanation: '有理化で元の値が 2-√3 と分かったので、その値が有理数 r だと仮定して 2-√3=r と置きます。',
      },
      {
        id: 'p2-isolate',
        prompt: '2-√3=r から √3 を単独にすると',
        choices: [
          choice('two-minus-r', '√3=2-r', true),
          choice('r-minus-two', '√3=r-2'),
          choice('two-plus-r', '√3=2+r'),
        ],
        skillTag: 'equation-building',
        knowledgeTags: ['radical', 'proof-by-contradiction'],
        explanation: '2-√3=r を移項すると √3=2-r です。',
      },
      {
        id: 'p2-contradiction',
        prompt: '(2) の証明を閉じる正しい結論は',
        choices: [
          choice('contradiction', '2 と r は有理数なので 2-r も有理数。すると √3 が有理数となり矛盾する。よって 1/(2+√3) は無理数。', true),
          choice('no-contradiction', '2-r は必ず無理数なので矛盾しない。'),
          choice('denominator', '分母が無理数なら分数は必ず無理数なので、それだけで証明できる。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['irrational-number', 'proof-by-contradiction'],
        explanation: '有理数の差は有理数なので √3 が有理数になってしまい、既知の無理性と矛盾します。',
      },
    ],
    simulation: [
      {
        id: 's1', label: '(1)', prompt: '1+√3 が有理数 r だと仮定したとき、矛盾へつながる式を選べ。', answerType: 'single-choice',
        choices: [choice('correct', '√3=r-1', true), choice('wrong', '√3=r+1')],
        score: 2, estimatedSeconds: 25, knowledgeTags: ['proof-by-contradiction', 'radical'], skillTags: ['equation-building'],
      },
      {
        id: 's2', label: '(2)', prompt: '1/(2+√3) を有理化した形を選べ。', answerType: 'single-choice',
        choices: [choice('correct', '2-√3', true), choice('wrong', '2+√3')],
        score: 2, estimatedSeconds: 25, knowledgeTags: ['rationalization', 'radical'], skillTags: ['calculation'],
      },
    ],
    fullExplanation: '√3 の無理性を使うには、対象が有理数だと仮定して √3 を有理数だけから作れる式として取り出す。(1) は 1+√3=r から √3=r-1。(2) はまず 1/(2+√3)=2-√3 と有理化し、2-√3=r から √3=2-r。どちらも右辺が有理数となって √3 の無理性に矛盾するので、元の数は無理数である。',
  },
  {
    problemNo: 113,
    section: 'proofs',
    sectionTitle: '命題と証明',
    title: '平方根と無理数',
    estimatedSeconds: 300,
    knowledgeTags: ['irrational-number', 'proof-by-contradiction', 'radical', 'rational-number'],
    skillTags: ['law-selection', 'equation-building', 'calculation', 'conclusion'],
    problem: [
      { type: 'text', text: '実数 x が正の無理数であるとき、√x は無理数であることを証明せよ。' },
    ],
    guide: [
      {
        type: 'content',
        blocks: [{ type: 'text', text: '背理法で、結論「√x は無理数」の反対を仮定する。仮定した有理数を r とおいて式にする。' }],
      },
      { type: 'blank', blankId: 'assumption' },
      {
        type: 'content',
        blocks: [{ type: 'text', text: '√x=r から元の x を取り出すには、両辺に同じ操作を行う。' }],
      },
      { type: 'blank', blankId: 'operation' },
      {
        type: 'content',
        blocks: [{ type: 'text', text: '操作後の式と、r が有理数であることを使って x がどの数の集合に入るかを判断する。' }],
      },
      { type: 'blank', blankId: 'square-result' },
      {
        type: 'content',
        blocks: [{ type: 'text', text: '最後に、今得た x の性質を問題の仮定「x は無理数」と比べて背理法を閉じる。' }],
      },
      { type: 'blank', blankId: 'contradiction' },
    ],
    blanks: [
      {
        id: 'assumption',
        prompt: '背理法の反対仮定を有理数 r を使って書くと',
        choices: [
          choice('sqrt-rational', '√x は有理数と仮定し、ある有理数 r により √x=r とおく。', true),
          choice('sqrt-irrational', '√x は無理数と仮定し、√x=r とおく。'),
          choice('x-rational', 'x は有理数と仮定し、x=r とおく。'),
        ],
        skillTag: 'law-selection',
        knowledgeTags: ['irrational-number', 'proof-by-contradiction'],
        explanation: '示したい結論の反対として √x が有理数だと仮定し、有理数 r を使って √x=r と表します。',
      },
      {
        id: 'operation',
        prompt: '√x=r から x を取り出す操作は',
        choices: [
          choice('square', '両辺を2乗する。', true),
          choice('sqrt-again', '両辺の平方根をさらにとる。'),
          choice('subtract', '両辺から x を引く。'),
        ],
        skillTag: 'law-selection',
        knowledgeTags: ['radical', 'proof-by-contradiction'],
        explanation: '平方根を外して元の x に戻すには、等式の両辺を2乗します。',
      },
      {
        id: 'square-result',
        prompt: '両辺を2乗した後に言えることは',
        choices: [
          choice('x-rational', 'x=r²。r は有理数なので r² も有理数、したがって x は有理数。', true),
          choice('x-r-rational', 'x=r。r が有理数なので x は有理数。'),
          choice('x-r-squared-irrational', 'x=r² だが、有理数の平方は必ず無理数。'),
        ],
        skillTag: 'calculation',
        knowledgeTags: ['rational-number', 'radical'],
        explanation: '√x=r を2乗すると x=r²。有理数どうしの積は有理数なので r² も有理数です。',
      },
      {
        id: 'contradiction',
        prompt: '証明を閉じる正しい結論は',
        choices: [
          choice('contradiction', 'x が有理数となるが、問題では x は無理数。矛盾するので、√x は無理数である。', true),
          choice('no-contradiction', 'x が有理数でも無理数でもよいので矛盾しない。'),
          choice('x-rational-final', '矛盾から x は有理数であると結論する。'),
        ],
        skillTag: 'conclusion',
        knowledgeTags: ['irrational-number', 'proof-by-contradiction'],
        explanation: '背理法の仮定から x が有理数になりましたが、与えられた x は無理数です。この矛盾により反対仮定が否定されます。',
      },
    ],
    simulation: [
      {
        id: 's1',
        label: '背理法',
        prompt: '√x が有理数 r だと仮定した後、矛盾へつながる式を選べ。',
        answerType: 'single-choice',
        choices: [choice('correct', 'x=r²', true), choice('wrong', 'x=r')],
        score: 2,
        estimatedSeconds: 25,
        knowledgeTags: ['proof-by-contradiction', 'radical'],
        skillTags: ['calculation'],
      },
    ],
    fullExplanation: '√x が有理数だと仮定し、√x=r（r は有理数）とおく。両辺を2乗すると x=r²。有理数の平方は有理数なので x は有理数となるが、問題では x は無理数である。矛盾するため、√x は無理数である。',
  },

  {
    problemNo: 114,
    section: 'proofs',
    sectionTitle: '命題と証明',
    title: '倍数の証明',
    estimatedSeconds: 540,
    knowledgeTags: ['contrapositive', 'divisibility', 'modular-arithmetic', 'counterexample'],
    skillTags: ['law-selection', 'case-classification', 'calculation', 'conclusion'],
    problem: [
      { type: 'text', text: 'm、n は整数とする。次の命題を証明せよ。' },
      { type: 'text', text: '(1) n² が5の倍数ならば、n は5の倍数である。' },
      { type: 'text', text: '(2) mn が3の倍数ならば、m、n の少なくとも一方は3の倍数である。' },
    ],
    guide: [
      {
        type: 'content',
        blocks: [{ type: 'text', text: '(1) 直接証明より、まず元命題の対偶を作ると、5で割った余りを調べる問題に変えられる。' }],
      },
      { type: 'blank', blankId: 'p1-plan' },
      {
        type: 'content',
        blocks: [{ type: 'text', text: '(1) 対偶の前件「n は5の倍数でない」を、5で割った余りの有限個のケースに分ける。' }],
      },
      { type: 'blank', blankId: 'p1-residues' },
      {
        type: 'content',
        blocks: [{ type: 'text', text: '(1) 出てきた全ての余りを2乗し、n² の余りが0になる場合があるかをまとめて調べる。' }],
      },
      { type: 'blank', blankId: 'p1-squares' },

      {
        type: 'content',
        blocks: [{ type: 'text', text: '(2) 「m、n の少なくとも一方は3の倍数」の否定に注意して、元命題の対偶を作る。' }],
      },
      { type: 'blank', blankId: 'p2-plan' },
      {
        type: 'content',
        blocks: [{ type: 'text', text: '(2) m、n がどちらも3の倍数でないとき、それぞれを3で割った余りを分類する。' }],
      },
      { type: 'blank', blankId: 'p2-residues' },
      {
        type: 'content',
        blocks: [{ type: 'text', text: '(2) m、n の余りの全組合せについて積の余りを調べ、0になるケースがあるかを確認する。' }],
      },
      { type: 'blank', blankId: 'p2-products' },
    ],
    blanks: [
      {
        id: 'p1-plan',
        prompt: '(1) の対偶として正しいのは',
        choices: [
          choice('correct', 'n が5の倍数でないならば、n² は5の倍数でない。', true),
          choice('converse', 'n が5の倍数ならば、n² は5の倍数である。'),
          choice('inverse', 'n² が5の倍数でないならば、n は5の倍数でない。'),
        ],
        skillTag: 'law-selection',
        knowledgeTags: ['contrapositive', 'divisibility'],
        explanation: '元命題「n² が5の倍数 ⇒ n が5の倍数」の対偶は、後件・前件を否定して向きを反転した形です。',
      },
      {
        id: 'p1-residues',
        prompt: '5の倍数でない整数を5で割った余りは',
        choices: [
          choice('one-to-four', '1、2、3、4 のいずれか。', true),
          choice('zero-to-three', '0、1、2、3 のいずれか。'),
          choice('one-two', '1、2 のいずれか。'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['divisibility', 'modular-arithmetic'],
        explanation: '5で割った余りは0〜4ですが、5の倍数でないので余り0を除き、1、2、3、4 の4通りです。',
      },
      {
        id: 'p1-squares',
        prompt: '4つの余りを2乗して対偶を完成させると',
        choices: [
          choice('none-zero', '平方の余りは順に 1、4、4、1。0はないので n² も5の倍数でない。よって対偶、元命題ともに真。', true),
          choice('has-zero', '平方の余りに0が含まれるので、対偶は偽。'),
          choice('all-one', '平方の余りはすべて1なので、計算せずに元命題を結論できる。'),
        ],
        skillTag: 'calculation',
        knowledgeTags: ['contrapositive', 'divisibility', 'modular-arithmetic'],
        explanation: '1²≡1、2²≡4、3²≡4、4²≡1 (mod 5) で、どれも0ではありません。',
      },
      {
        id: 'p2-plan',
        prompt: '(2) の対偶として正しいのは',
        choices: [
          choice('correct', 'm、n がどちらも3の倍数でないならば、mn は3の倍数でない。', true),
          choice('one-not', 'm、n の少なくとも一方が3の倍数でないならば、mn は3の倍数でない。'),
          choice('converse', 'm、n の少なくとも一方が3の倍数ならば、mn は3の倍数である。'),
        ],
        skillTag: 'law-selection',
        knowledgeTags: ['contrapositive', 'negation', 'divisibility'],
        explanation: '「少なくとも一方が3の倍数」の否定は「どちらも3の倍数でない」です。これを前件にしたものが対偶です。',
      },
      {
        id: 'p2-residues',
        prompt: '3の倍数でない整数を3で割った余りは',
        choices: [
          choice('one-two', '1 または2。したがって m、n の各余りも1か2。', true),
          choice('zero-one', '0 または1。'),
          choice('one-two-three', '1、2、3 のいずれか。'),
        ],
        skillTag: 'case-classification',
        knowledgeTags: ['divisibility', 'modular-arithmetic'],
        explanation: '3で割った余りは0、1、2。3の倍数でないので0を除き、1か2です。',
      },
      {
        id: 'p2-products',
        prompt: '余りの4組を掛けて対偶を完成させると',
        choices: [
          choice('none-zero', '積の余りは (1,1),(1,2),(2,1),(2,2) の順に 1、2、2、1。0はないので mn は3の倍数でない。よって対偶、元命題ともに真。', true),
          choice('has-zero', '4組のうち少なくとも1組で積の余りが0になるので、対偶は偽。'),
          choice('all-two', '積の余りはすべて2になる。'),
        ],
        skillTag: 'calculation',
        knowledgeTags: ['contrapositive', 'divisibility', 'modular-arithmetic'],
        explanation: '非0剰余1、2どうしの積は mod 3 で 1 または2のままで、0にはなりません。',
      },
    ],
    simulation: [
      {
        id: 's1', label: '(1)', prompt: '5の倍数でない n の平方の mod 5 の余りを選べ。', answerType: 'single-choice',
        choices: [choice('correct', '1、4、4、1', true), choice('wrong', '1、2、3、4')],
        score: 2, estimatedSeconds: 30, knowledgeTags: ['modular-arithmetic', 'divisibility'], skillTags: ['calculation'],
      },
      {
        id: 's2', label: '(2)', prompt: 'm、n がともに3の倍数でないとき、mn の mod 3 の余りについて正しいものを選べ。', answerType: 'single-choice',
        choices: [choice('correct', '1または2で、0にはならない。', true), choice('wrong', '必ず0になる。')],
        score: 2, estimatedSeconds: 30, knowledgeTags: ['modular-arithmetic', 'divisibility'], skillTags: ['calculation'],
      },
    ],
    fullExplanation: '(1) は対偶「n が5の倍数でない ⇒ n² も5の倍数でない」を示す。非0剰余1,2,3,4の平方は mod 5 で1,4,4,1となり0にならない。(2) は対偶「m,n がどちらも3の倍数でない ⇒ mn も3の倍数でない」を示す。各余りは1か2で、4通りの積の余りは1,2,2,1となり0にならない。よって両方の元命題が証明される。',
  },

]

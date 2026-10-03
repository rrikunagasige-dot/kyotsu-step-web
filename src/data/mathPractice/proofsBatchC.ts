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

]

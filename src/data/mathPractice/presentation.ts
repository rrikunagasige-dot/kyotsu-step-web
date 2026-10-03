export type MathPracticeResult = {
  blankId: string
  label: { ja: string; zh: string }
  latexPrefix?: string
}

export type MathPracticeTarget = {
  id: string
  kicker: { ja: string; zh: string }
  label?: { ja: string; zh: string }
  latex?: string
  blankIds: readonly string[]
  dependsOn?: readonly string[]
  result?: MathPracticeResult
  results?: readonly MathPracticeResult[]
  resultLinkLabel?: { ja: string; zh: string }
}

const targetsByQuestion: Record<string, readonly MathPracticeTarget[]> = {
  'math-practice-087': [
    {
      id: 'membership-rule',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: '集合 A に入る条件を整理する', zh: '整理进入集合 A 的条件' },
      blankIds: ['condition-sufficiency', 'prime-condition'],
    },
    {
      id: 'two',
      kicker: { ja: '今の問い', zh: '当前问题' },
      latex: '2\\;\\square\\;A',
      blankIds: ['two-divisors', 'two-membership'],
    },
    {
      id: 'fifteen',
      kicker: { ja: '今の問い', zh: '当前问题' },
      latex: '15\\;\\square\\;A',
      blankIds: ['fifteen-factor', 'fifteen-membership'],
    },
    {
      id: 'twentyone',
      kicker: { ja: '今の問い', zh: '当前问题' },
      latex: '21\\;\\square\\;A',
      blankIds: ['twentyone-factor', 'twentyone-membership'],
    },
    {
      id: 'twentynine',
      kicker: { ja: '今の問い', zh: '当前问题' },
      latex: '29\\;\\square\\;A',
      blankIds: ['twentynine-divisor-check', 'twentynine-membership'],
    },
  ],
  'math-practice-088': [
    {
      id: 's1',
      kicker: { ja: '今の問い｜(1)', zh: '当前问题｜(1)' },
      label: { ja: '36の正の約数を漏れなく並べる', zh: '完整列出36的正因数' },
      blankIds: ['p1-strategy', 'p1-stop', 'p1-result'],
    },
    {
      id: 's2',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      label: { ja: '100以下の正の奇数を並べる', zh: '列出100以下的正奇数' },
      blankIds: ['p2-step', 'p2-last', 'p2-result'],
    },
    {
      id: 's3',
      kicker: { ja: '今の問い｜(3)', zh: '当前问题｜(3)' },
      latex: '\\{x\\mid -3\\le x<4,\\;x\\in\\mathbb Z\\}',
      blankIds: ['p3-left', 'p3-right', 'p3-result'],
    },
    {
      id: 's4',
      kicker: { ja: '今の問い｜(4)', zh: '当前问题｜(4)' },
      latex: '\\{3n-2\\mid n=1,2,3,\\ldots\\}',
      blankIds: ['p4-sample', 'p4-pattern', 'p4-result'],
    },
  ],
  'math-practice-089': [
    {
      id: 'basis',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: 'Aと「部分集合」の判定基準を確認する', zh: '确认A与子集判断标准' },
      blankIds: ['a-set', 'subset-rule'],
    },
    {
      id: 'b',
      kicker: { ja: '今の問い｜B', zh: '当前问题｜B' },
      label: { ja: 'BはAの部分集合か', zh: 'B是否为A的子集' },
      blankIds: ['b-counterexample', 'b-judgment'],
    },
    {
      id: 'c',
      kicker: { ja: '今の問い｜C', zh: '当前问题｜C' },
      label: { ja: 'CはAの部分集合か', zh: 'C是否为A的子集' },
      blankIds: ['c-judgment'],
    },
    {
      id: 'd',
      kicker: { ja: '今の問い｜D', zh: '当前问题｜D' },
      label: { ja: 'DはAの部分集合か', zh: 'D是否为A的子集' },
      blankIds: ['d-counterexample', 'd-judgment'],
    },
    {
      id: 'e',
      kicker: { ja: '今の問い｜E', zh: '当前问题｜E' },
      label: { ja: 'EはAの部分集合か', zh: 'E是否为A的子集' },
      blankIds: ['e-judgment'],
    },
    {
      id: 'final',
      kicker: { ja: '結論', zh: '结论' },
      label: { ja: 'Aの部分集合をまとめる', zh: '汇总A的子集' },
      blankIds: ['final-result'],
    },
  ],
  'math-practice-090': [
    {
      id: 's1',
      kicker: { ja: '今の問い｜(1)', zh: '当前问题｜(1)' },
      label: { ja: 'AとBの包含関係を決める', zh: '判断A与B的包含关系' },
      blankIds: ['p1-method', 'p1-a', 'p1-b', 'p1-relation'],
    },
    {
      id: 's2',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      label: { ja: 'AとBが同じ集合か確かめる', zh: '确认A与B是否相同' },
      blankIds: ['p2-a', 'p2-zero-product', 'p2-b', 'p2-relation'],
    },
  ],
  'math-practice-091': [
    {
      id: 's1',
      kicker: { ja: '今の問い｜(1)', zh: '当前问题｜(1)' },
      label: { ja: '{a,b}の部分集合を漏れなく列挙する', zh: '完整列出{a,b}的子集' },
      blankIds: ['p1-organize', 'p1-zero', 'p1-one', 'p1-two'],
    },
    {
      id: 's2-plan',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      label: { ja: 'まず選ぶ要素数で整理する', zh: '先按所选元素个数整理' },
      blankIds: ['p2-range'],
    },
    {
      id: 's2-pairs',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      label: { ja: '2個選ぶ場合を漏れなく並べる', zh: '完整列出选2个元素的情况' },
      blankIds: ['p2-pairs'],
    },
    {
      id: 's2-finish',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      label: { ja: '3個・4個の場合まで確認する', zh: '继续确认选3个和4个元素的情况' },
      blankIds: ['p2-triples', 'p2-check'],
    },
  ],
  'math-practice-092': [
    {
      id: 'basis',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: '∩と∪の意味を確認する', zh: '确认∩与∪的含义' },
      blankIds: ['intersection-meaning', 'union-meaning'],
    },
    {
      id: 's1',
      kicker: { ja: '今の問い｜(1)', zh: '当前问题｜(1)' },
      latex: 'A\\cap B,\\quad A\\cup B',
      blankIds: ['p1-intersection', 'p1-union'],
    },
    {
      id: 's2',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      latex: 'A\\cap B,\\quad A\\cup B',
      blankIds: ['p2-common', 'p2-union'],
    },
    {
      id: 's3',
      kicker: { ja: '今の問い｜(3)', zh: '当前问题｜(3)' },
      label: { ja: '2つの実数区間の共通部分と和集合', zh: '求两个实数区间的交集与并集' },
      blankIds: ['p3-intersection', 'p3-union'],
    },
    {
      id: 's4',
      kicker: { ja: '今の問い｜(4)', zh: '当前问题｜(4)' },
      label: { ja: '18と27の約数集合を比べる', zh: '比较18与27的正因数集合' },
      blankIds: ['p4-a', 'p4-b', 'p4-intersection', 'p4-union'],
    },
    {
      id: 's5',
      kicker: { ja: '今の問い｜(5)', zh: '当前问题｜(5)' },
      label: { ja: '式で表された2集合を具体化して比べる', zh: '把两个式子表示的集合具体化后比较' },
      blankIds: ['p5-a', 'p5-b', 'p5-intersection', 'p5-union'],
    },
  ],
  'math-practice-093': [
    {
      id: 'basis',
      kicker: { ja: 'まず準備', zh: '先准备' },
      label: { ja: 'A,B,Cを要素で表す', zh: '把A、B、C列成元素形式' },
      blankIds: ['a-set', 'b-set', 'c-set'],
      resultLinkLabel: { ja: '準備した3集合', zh: '已求出的三个集合' },
      results: [
        { blankId: 'a-set', label: { ja: 'A', zh: 'A' }, latexPrefix: 'A=' },
        { blankId: 'b-set', label: { ja: 'B', zh: 'B' }, latexPrefix: 'B=' },
        { blankId: 'c-set', label: { ja: 'C', zh: 'C' }, latexPrefix: 'C=' },
      ],
    },
    {
      id: 's1',
      kicker: { ja: '今の問い｜(1)', zh: '当前问题｜(1)' },
      latex: 'A\\cap B\\cap C',
      blankIds: ['p1-meaning', 'p1-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's2',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      latex: 'A\\cup B\\cup C',
      blankIds: ['p2-meaning', 'p2-result'],
      dependsOn: ['basis'],
    },
  ],
  'math-practice-095': [
    {
      id: 's1',
      kicker: { ja: '今の問い｜(1)', zh: '当前问题｜(1)' },
      latex: 'A\\cup B',
      blankIds: ['p1-outside', 'p1-result'],
    },
    {
      id: 's2',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      latex: 'B',
      blankIds: ['p2-decompose', 'p2-result'],
    },
    {
      id: 's3',
      kicker: { ja: '今の問い｜(3)', zh: '当前问题｜(3)' },
      latex: 'A\\cap\\overline B',
      blankIds: ['p3-regions', 'p3-missing', 'p3-result'],
    },
  ],
  'math-practice-096': [
    {
      id: 's1',
      kicker: { ja: '今の問い｜(1)', zh: '当前问题｜(1)' },
      latex: 'A\\cap B\\cap C',
      blankIds: ['p1-ab', 'p1-result'],
      result: {
        blankId: 'p1-result',
        label: { ja: '(1) の結果', zh: '(1) 的结果' },
        latexPrefix: 'A\\cap B\\cap C=',
      },
    },
    {
      id: 's2',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      latex: 'A\\cup B\\cup C',
      blankIds: ['p2-result'],
    },
    {
      id: 's3',
      kicker: { ja: '今の問い｜(3)', zh: '当前问题｜(3)' },
      latex: 'A\\cap B\\cap\\overline C',
      blankIds: ['p3-ab', 'p3-result'],
    },
    {
      id: 's4',
      kicker: { ja: '今の問い｜(4)', zh: '当前问题｜(4)' },
      latex: '\\overline A\\cap B\\cap\\overline C',
      blankIds: ['p4-candidates', 'p4-result'],
    },
    {
      id: 's5',
      kicker: { ja: '今の問い｜(5)', zh: '当前问题｜(5)' },
      latex: '\\overline{A\\cap B\\cap C}',
      blankIds: ['p5-result'],
      dependsOn: ['s1'],
    },
    {
      id: 's6',
      kicker: { ja: '今の問い｜(6)', zh: '当前问题｜(6)' },
      latex: '(A\\cup C)\\cap\\overline B',
      blankIds: ['p6-a-union-c', 'p6-result'],
    },
  ],
  'math-practice-094': [
    {
      id: 'basis',
      kicker: { ja: '準備', zh: '准备' },
      label: { ja: '補集合を考える基準を確認する', zh: '先确认补集的基准' },
      blankIds: ['universe-basis'],
    },
    {
      id: 's1',
      kicker: { ja: '今の問い｜(1)', zh: '当前问题｜(1)' },
      latex: '\\overline{A}',
      blankIds: ['a-complement'],
      result: {
        blankId: 'a-complement',
        label: { ja: '(1) の結果', zh: '(1) 的结果' },
        latexPrefix: '\\overline{A}=',
      },
    },
    {
      id: 's2',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      latex: '\\overline{B}',
      blankIds: ['b-complement'],
      result: {
        blankId: 'b-complement',
        label: { ja: '(2) の結果', zh: '(2) 的结果' },
        latexPrefix: '\\overline{B}=',
      },
    },
    {
      id: 's3',
      kicker: { ja: '今の問い｜(3)', zh: '当前问题｜(3)' },
      latex: '\\overline{A}\\cap B',
      blankIds: ['abar-intersection-b-meaning', 'abar-intersection-b'],
      dependsOn: ['s1'],
    },
    {
      id: 's4',
      kicker: { ja: '今の問い｜(4)', zh: '当前问题｜(4)' },
      latex: 'A\\cup\\overline{B}',
      blankIds: ['a-union-bbar'],
      dependsOn: ['s2'],
    },
    {
      id: 's5',
      kicker: { ja: '今の問い｜(5)', zh: '当前问题｜(5)' },
      latex: '\\overline{A}\\cap\\overline{B}',
      blankIds: ['abar-intersection-bbar'],
      dependsOn: ['s1', 's2'],
    },
    {
      id: 's6',
      kicker: { ja: '今の問い｜(6)', zh: '当前问题｜(6)' },
      latex: '\\overline{A}\\cup\\overline{B}',
      blankIds: ['abar-union-bbar'],
      dependsOn: ['s1', 's2'],
    },
    {
      id: 's7',
      kicker: { ja: '今の問い｜(7)', zh: '当前问题｜(7)' },
      latex: '\\overline{A\\cap B}',
      blankIds: ['a-intersection-b', 'complement-a-intersection-b'],
    },
    {
      id: 's8',
      kicker: { ja: '今の問い｜(8)', zh: '当前问题｜(8)' },
      latex: '\\overline{A\\cup B}',
      blankIds: ['a-union-b', 'complement-a-union-b'],
    },
  ],
  'math-practice-097': [
    {
      id: 'solve-a',
      kicker: { ja: 'まずの目標', zh: '第一目标' },
      label: { ja: '共通部分の条件から a を求める', zh: '由交集条件求 a' },
      blankIds: ['four-membership', 'variable-element', 'equation-for-four', 'solve-a'],
      result: {
        blankId: 'solve-a',
        label: { ja: '前の結果', zh: '前一步结果' },
        latexPrefix: 'a=',
      },
    },
    {
      id: 'verify-a',
      kicker: { ja: '次の目標', zh: '下一目标' },
      label: { ja: '求めた a が条件を本当に満たすか確かめる', zh: '确认求得的 a 是否真的满足条件' },
      blankIds: ['a-set', 'b-set', 'intersection-check'],
      dependsOn: ['solve-a'],
      resultLinkLabel: { ja: '前の確認結果', zh: '前一步确认结果' },
      results: [
        {
          blankId: 'a-set',
          label: { ja: 'A', zh: 'A' },
          latexPrefix: 'A=',
        },
        {
          blankId: 'b-set',
          label: { ja: 'B', zh: 'B' },
          latexPrefix: 'B=',
        },
      ],
    },
    {
      id: 'union',
      kicker: { ja: '最後の目標', zh: '最后目标' },
      latex: 'A\\cup B',
      blankIds: ['union-result'],
      dependsOn: ['verify-a'],
    },
  ],
  'math-practice-098': [
    {
      id: 'basis',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: '命題かどうかの判定基準を作る', zh: '建立是否为命题的判断标准' },
      blankIds: ['definition'],
      result: {
        blankId: 'definition',
        label: { ja: '判定基準', zh: '判断标准' },
      },
    },
    {
      id: 's1',
      kicker: { ja: '今の問い｜(1)', zh: '当前问题｜(1)' },
      label: { ja: '計算して、命題か・真かを判断する', zh: '通过计算判断是否为命题以及真假' },
      blankIds: ['p1-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's2',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      label: { ja: '反例を使って真偽を判断する', zh: '用反例判断真假' },
      blankIds: ['p2-counterexample', 'p2-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's3',
      kicker: { ja: '今の問い｜(3)', zh: '当前问题｜(3)' },
      label: { ja: '客観的に真偽を決められるか判断する', zh: '判断能否客观地确定真假' },
      blankIds: ['p3-objectivity', 'p3-result'],
      dependsOn: ['basis'],
    },
  ],
  'math-practice-099': [
    {
      id: 'basis',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: '含意を集合の包含関係へ直す', zh: '把蕴含关系改写为集合包含' },
      blankIds: ['rule'],
      result: {
        blankId: 'rule',
        label: { ja: '判定規則', zh: '判断规则' },
      },
    },
    {
      id: 's1',
      kicker: { ja: '今の問い｜(1)', zh: '当前问题｜(1)' },
      label: { ja: '2つの区間の包含関係を見る', zh: '比较两个区间的包含关系' },
      blankIds: ['p1-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's2',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      label: { ja: '反例を1つ作って真偽を決める', zh: '构造一个反例判断真假' },
      blankIds: ['p2-counterexample', 'p2-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's3',
      kicker: { ja: '今の問い｜(3)', zh: '当前问题｜(3)' },
      label: { ja: '不等式から後件が必ず成り立つかを見る', zh: '由不等式判断后件是否必然成立' },
      blankIds: ['p3-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's4',
      kicker: { ja: '今の問い｜(4)', zh: '当前问题｜(4)' },
      label: { ja: '絶対値を区間へ直し、端点を比べる', zh: '把绝对值改写为区间并比较端点' },
      blankIds: ['p4-q-set', 'p4-counterexample-result'],
      dependsOn: ['basis'],
    },
  ],
  'math-practice-100': [
    {
      id: 'basis',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: '反例が満たす条件を確認する', zh: '确认反例必须满足的条件' },
      blankIds: ['rule'],
      result: {
        blankId: 'rule',
        label: { ja: '反例の条件', zh: '反例条件' },
      },
    },
    {
      id: 's1',
      kicker: { ja: '今の問い｜(1)', zh: '当前问题｜(1)' },
      label: { ja: '平方で符号が消えることを使う', zh: '利用平方会消去正负号' },
      blankIds: ['p1-counterexample'],
      dependsOn: ['basis'],
    },
    {
      id: 's2',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      label: { ja: '絶対値と元の数の大小を分けて考える', zh: '区分绝对值大小与原数大小' },
      blankIds: ['p2-counterexample'],
      dependsOn: ['basis'],
    },
    {
      id: 's3',
      kicker: { ja: '今の問い｜(3)', zh: '当前问题｜(3)' },
      label: { ja: '合成数になる奇数を探す', zh: '寻找使结果成为合数的奇数' },
      blankIds: ['p3-counterexample'],
      dependsOn: ['basis'],
    },
  ],
}

function localBlankId(questionId: string, fullBlankId: string) {
  const prefix = `${questionId}-`
  return fullBlankId.startsWith(prefix) ? fullBlankId.slice(prefix.length) : fullBlankId
}

export function mathPracticeTargetForBlank(questionId: string, fullBlankId: string | null | undefined) {
  if (!fullBlankId) return targetsByQuestion[questionId]?.[0] ?? null
  const localId = localBlankId(questionId, fullBlankId)
  return targetsByQuestion[questionId]?.find((target) => target.blankIds.includes(localId)) ?? null
}

export function mathPracticeTargetsForQuestion(questionId: string) {
  return targetsByQuestion[questionId] ?? []
}


export function mathPracticeTargetById(questionId: string, targetId: string) {
  return targetsByQuestion[questionId]?.find((target) => target.id === targetId) ?? null
}

export function mathPracticeDependencyTargets(questionId: string, targetId: string) {
  const target = mathPracticeTargetById(questionId, targetId)
  if (!target?.dependsOn?.length) return []
  return target.dependsOn
    .map((dependencyId) => mathPracticeTargetById(questionId, dependencyId))
    .filter((dependency): dependency is MathPracticeTarget => Boolean(dependency))
}

export function mathPracticeResultItems(target: MathPracticeTarget) {
  if (target.results?.length) return target.results
  return target.result ? [target.result] : []
}

export function mathPracticeUsesSubproblemCompression(questionId: string) {
  return [
    'math-practice-087',
    'math-practice-088',
    'math-practice-089',
    'math-practice-090',
    'math-practice-091',
    'math-practice-092',
    'math-practice-093',
    'math-practice-094',
    'math-practice-095',
    'math-practice-096',
    'math-practice-097',
    'math-practice-098',
    'math-practice-099',
    'math-practice-100',
  ].includes(questionId)
}

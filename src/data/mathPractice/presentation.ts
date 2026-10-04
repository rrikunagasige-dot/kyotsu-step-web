export type MathPracticeResult = {
  blankId: string
  label: { ja: string; zh: string }
  latexPrefix?: string
}

export type MathPracticeExternalDependency = {
  id: string
  sourceQuestionId: string
  label: { ja: string; zh: string }
  resultLatex: string
  detail: { ja: string; zh: string }
}

export type MathPracticeTarget = {
  id: string
  kicker: { ja: string; zh: string }
  label?: { ja: string; zh: string }
  latex?: string
  blankIds: readonly string[]
  dependsOn?: readonly string[]
  externalDependencies?: readonly MathPracticeExternalDependency[]
  result?: MathPracticeResult
  results?: readonly MathPracticeResult[]
  resultLinkLabel?: { ja: string; zh: string }
}

const theorem116ForSqrt2: MathPracticeExternalDependency = {
  id: 'R116-sqrt2',
  sourceQuestionId: 'math-practice-116',
  label: { ja: '116の結果', zh: '116的结论' },
  resultLatex: 'A+B\\sqrt{2}=0,\\;A,B\\in\\mathbb Q\\;\\Rightarrow\\;A=B=0',
  detail: {
    ja: '116では、B≠0 とすると √2=-A/B が有理数になって矛盾するため B=0、そこから A=0 と示した。',
    zh: '116中，若 B≠0，则 √2=-A/B 会成为有理数而产生矛盾，所以 B=0，进而 A=0。',
  },
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
      blankIds: ['p4-sample', 'p4-result'],
    },
  ],
  'math-practice-089': [
    {
      id: 'basis',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: 'Aと「部分集合」の判定基準を確認する', zh: '确认A与子集判断标准' },
      blankIds: ['a-set', 'subset-rule'],
      resultLinkLabel: { ja: '判定に使う共通準備', zh: '判断所用的共同准备' },
      results: [
        { blankId: 'a-set', label: { ja: 'A', zh: 'A' }, latexPrefix: 'A=' },
        { blankId: 'subset-rule', label: { ja: '部分集合の基準', zh: '子集判定标准' } },
      ],
    },
    {
      id: 'b',
      kicker: { ja: '今の問い｜B', zh: '当前问题｜B' },
      label: { ja: 'BはAの部分集合か', zh: 'B是否为A的子集' },
      blankIds: ['b-counterexample', 'b-judgment'],
      dependsOn: ['basis'],
      result: { blankId: 'b-judgment', label: { ja: 'B の判定', zh: 'B 的判断' } },
    },
    {
      id: 'c',
      kicker: { ja: '今の問い｜C', zh: '当前问题｜C' },
      label: { ja: 'CはAの部分集合か', zh: 'C是否为A的子集' },
      blankIds: ['c-judgment'],
      dependsOn: ['basis'],
      result: { blankId: 'c-judgment', label: { ja: 'C の判定', zh: 'C 的判断' } },
    },
    {
      id: 'd',
      kicker: { ja: '今の問い｜D', zh: '当前问题｜D' },
      label: { ja: 'DはAの部分集合か', zh: 'D是否为A的子集' },
      blankIds: ['d-counterexample', 'd-judgment'],
      dependsOn: ['basis'],
      result: { blankId: 'd-judgment', label: { ja: 'D の判定', zh: 'D 的判断' } },
    },
    {
      id: 'e',
      kicker: { ja: '今の問い｜E', zh: '当前问题｜E' },
      label: { ja: 'EはAの部分集合か', zh: 'E是否为A的子集' },
      blankIds: ['e-judgment'],
      dependsOn: ['basis'],
      result: { blankId: 'e-judgment', label: { ja: 'E の判定', zh: 'E 的判断' } },
    },
    {
      id: 'final',
      kicker: { ja: '結論', zh: '结论' },
      label: { ja: 'Aの部分集合をまとめる', zh: '汇总A的子集' },
      blankIds: ['final-result'],
      dependsOn: ['b', 'c', 'd', 'e'],
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
      blankIds: ['p4-candidates', 'p4-after-a', 'p4-result'],
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
      label: { ja: '命題かどうかの判定基準を確認する', zh: '确认是否为命题的判断标准' },
      blankIds: ['definition'],
      result: { blankId: 'definition', label: { ja: '判定基準', zh: '判断标准' } },
    },
    {
      id: 's1',
      kicker: { ja: '今の問い｜(1)', zh: '当前问题｜(1)' },
      label: { ja: '割り算の結果と文の内容を照らす', zh: '比较除法结果与语句内容' },
      blankIds: ['p1-calculation', 'p1-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's2',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      label: { ja: '二等辺三角形の条件を具体例で確かめる', zh: '用具体例检验等腰三角形的条件' },
      blankIds: ['p2-property', 'p2-third-side', 'p2-example', 'p2-verify', 'p2-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's3',
      kicker: { ja: '今の問い｜(3)', zh: '当前问题｜(3)' },
      label: { ja: '客観的に真偽を決められるかを見る', zh: '判断能否客观确定真假' },
      blankIds: ['p3-objectivity', 'p3-result'],
      dependsOn: ['basis'],
    },
  ],

  'math-practice-099': [
    {
      id: 'basis',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: '含意と集合包含の対応を確認する', zh: '确认蕴含与集合包含的对应' },
      blankIds: ['rule'],
      result: { blankId: 'rule', label: { ja: '判定規則', zh: '判断规则' } },
    },
    {
      id: 's1',
      kicker: { ja: '今の問い｜(1)', zh: '当前问题｜(1)' },
      label: { ja: 'PとQを作って包含関係を確かめる', zh: '求出P、Q并检查包含关系' },
      blankIds: ['p1-sets', 'p1-inclusion', 'p1-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's2',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      label: { ja: 'PとQのずれを具体的な値で確かめる', zh: '用具体数值检查P与Q的差异' },
      blankIds: ['p2-sets', 'p2-inclusion', 'p2-counterexample', 'p2-verify', 'p2-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's3',
      kicker: { ja: '今の問い｜(3)', zh: '当前问题｜(3)' },
      label: { ja: '絶対値条件も集合に直して比べる', zh: '把绝对值条件也改写成集合后比较' },
      blankIds: ['p3-p-set', 'p3-q-set', 'p3-inclusion', 'p3-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's4',
      kicker: { ja: '今の問い｜(4)', zh: '当前问题｜(4)' },
      label: { ja: '2つの区間を端点まで比べる', zh: '连同端点一起比较两个区间' },
      blankIds: ['p4-p-set', 'p4-q-set', 'p4-left-endpoint', 'p4-inclusion', 'p4-result'],
      dependsOn: ['basis'],
    },
  ],

  'math-practice-100': [
    {
      id: 'basis',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: '命題を破る具体例の条件を確認する', zh: '确认能破坏命题的具体例条件' },
      blankIds: ['rule'],
      result: { blankId: 'rule', label: { ja: '具体例の条件', zh: '具体例条件' } },
    },
    {
      id: 's1',
      kicker: { ja: '今の問い｜(1)', zh: '当前问题｜(1)' },
      label: { ja: '前件を満たす値を全部見て照合する', zh: '列出所有满足前件的值并逐一核对' },
      blankIds: ['p1-roots', 'p1-counterexample', 'p1-verify'],
      dependsOn: ['basis'],
    },
    {
      id: 's2',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      label: { ja: '2条件を同時に満たす具体例を作る', zh: '构造同时满足两个条件的具体例' },
      blankIds: ['p2-break-q', 'p2-y', 'p2-x', 'p2-verify'],
      dependsOn: ['basis'],
    },
    {
      id: 's3',
      kicker: { ja: '今の問い｜(3)', zh: '当前问题｜(3)' },
      label: { ja: '小さい奇数から条件を破る例を探す', zh: '从较小奇数中寻找破坏条件的例子' },
      blankIds: ['p3-candidate', 'p3-factor', 'p3-verify'],
      dependsOn: ['basis'],
    },
  ],

  'math-practice-101': [
    {
      id: 'basis',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: '否定が表す範囲を確認する', zh: '确认否定所表示的范围' },
      blankIds: ['rule'],
      result: { blankId: 'rule', label: { ja: '否定の基準', zh: '否定标准' } },
    },
    {
      id: 's1',
      kicker: { ja: '今の問い｜(1)', zh: '当前问题｜(1)' },
      label: { ja: '境界とその左右を順に確かめる', zh: '依次检查边界及其两侧' },
      blankIds: ['p1-boundary', 'p1-side', 'p1-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's2',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      label: { ja: '「0ではない」が失敗する場合を考える', zh: '思考“不等于0”不成立的情况' },
      blankIds: ['p2-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's3',
      kicker: { ja: '今の問い｜(3)', zh: '当前问题｜(3)' },
      label: { ja: '実数の分類から補集合を考える', zh: '从实数分类考虑补集' },
      blankIds: ['p3-result'],
      dependsOn: ['basis'],
    },
  ],

  'math-practice-102': [
    {
      id: 'basis',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: '「かつ」「または」と集合演算を対応させる', zh: '对应“且”“或”与集合运算' },
      blankIds: ['rule'],
      result: { blankId: 'rule', label: { ja: '集合演算の対応', zh: '集合运算对应' } },
    },
    {
      id: 's1',
      kicker: { ja: '今の問い｜(1)', zh: '当前问题｜(1)' },
      label: { ja: '重なる範囲と端点を決める', zh: '确定重叠范围与端点' },
      blankIds: ['p1-bounds', 'p1-endpoints', 'p1-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's2',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      label: { ja: '合わせた範囲と端点を決める', zh: '确定合并范围与端点' },
      blankIds: ['p2-bounds', 'p2-endpoints', 'p2-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's3',
      kicker: { ja: '今の問い｜(3)', zh: '当前问题｜(3)' },
      label: { ja: '左右の端点を1つずつ判定する', zh: '逐个判断左右端点' },
      blankIds: ['p3-core', 'p3-left', 'p3-right', 'p3-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's4',
      kicker: { ja: '今の問い｜(4)', zh: '当前问题｜(4)' },
      label: { ja: '和集合の両端を1つずつ判定する', zh: '逐个判断并集两端' },
      blankIds: ['p4-span', 'p4-left', 'p4-right', 'p4-result'],
      dependsOn: ['basis'],
    },
  ],

  'math-practice-103': [
    {
      id: 'basis',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: '複合条件を小さな条件に分けて否定する', zh: '把复合条件拆成小条件后再否定' },
      blankIds: ['rule'],
      result: { blankId: 'rule', label: { ja: '複合条件の否定', zh: '复合条件否定' } },
    },
    {
      id: 's1',
      kicker: { ja: '今の問い｜(1)', zh: '当前问题｜(1)' },
      label: { ja: '原子条件を否定してから結び直す', zh: '先否定原子条件再重新连接' },
      blankIds: ['p1-atoms', 'p1-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's2',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      label: { ja: '境界に注意して2条件を否定する', zh: '注意边界并否定两个条件' },
      blankIds: ['p2-atoms', 'p2-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's3',
      kicker: { ja: '今の問い｜(3)', zh: '当前问题｜(3)' },
      label: { ja: '連続不等式を分解してから否定する', zh: '拆分连锁不等式后再否定' },
      blankIds: ['p3-split', 'p3-atoms', 'p3-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's4',
      kicker: { ja: '今の問い｜(4)', zh: '当前问题｜(4)' },
      label: { ja: '2つの数の性質を別々に否定する', zh: '分别否定两个数的性质' },
      blankIds: ['p4-atoms', 'p4-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's5',
      kicker: { ja: '今の問い｜(5)', zh: '当前问题｜(5)' },
      label: { ja: '「少なくとも一方」を論理構造へ直す', zh: '把“至少一个”改写为逻辑结构' },
      blankIds: ['p5-form', 'p5-atoms', 'p5-result'],
      dependsOn: ['basis'],
    },
  ],

  'math-practice-104': [
    {
      id: 'basis',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: '必要・十分を2方向の含意で判定する', zh: '用两个方向的蕴含判断必要与充分' },
      blankIds: ['rule'],
      result: { blankId: 'rule', label: { ja: '方向と条件の対応', zh: '方向与条件的对应' } },
    },
    {
      id: 's1',
      kicker: { ja: '今の問い｜(1)', zh: '当前问题｜(1)' },
      label: { ja: '代入と方程式で2方向を確かめる', zh: '用代入与方程检查两个方向' },
      blankIds: ['p1-forward-calc', 'p1-forward-judgment', 'p1-reverse-solve', 'p1-reverse-judgment', 'p1-classification'],
      dependsOn: ['basis'],
    },
    {
      id: 's2',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      label: { ja: '具体例と解集合で2方向を確かめる', zh: '用具体例与解集检查两个方向' },
      blankIds: ['p2-forward-example', 'p2-forward-judgment', 'p2-reverse-solve', 'p2-reverse-judgment', 'p2-classification'],
      dependsOn: ['basis'],
    },
    {
      id: 's3',
      kicker: { ja: '今の問い｜(3)', zh: '当前问题｜(3)' },
      label: { ja: 'それぞれの向きを具体例で検証する', zh: '分别用具体例检验两个方向' },
      blankIds: ['p3-forward-example', 'p3-forward-judgment', 'p3-reverse-example', 'p3-reverse-judgment', 'p3-classification'],
      dependsOn: ['basis'],
    },
    {
      id: 's4',
      kicker: { ja: '今の問い｜(4)', zh: '当前问题｜(4)' },
      label: { ja: '絶対値0とx=0を双方向に確かめる', zh: '双向检查绝对值为0与x=0' },
      blankIds: ['p4-forward', 'p4-reverse', 'p4-classification'],
      dependsOn: ['basis'],
    },
    {
      id: 's5',
      kicker: { ja: '今の問い｜(5)', zh: '当前问题｜(5)' },
      label: { ja: '代入と連立条件で2方向を確かめる', zh: '用代入与联立条件检查两个方向' },
      blankIds: ['p5-forward-check', 'p5-forward-judgment', 'p5-reverse-y', 'p5-reverse-x', 'p5-reverse-judgment', 'p5-classification'],
      dependsOn: ['basis'],
    },
    {
      id: 's6',
      kicker: { ja: '今の問い｜(6)', zh: '当前问题｜(6)' },
      label: { ja: '辺と角の条件を2方向に分けて比べる', zh: '把边与角的条件分成两个方向比较' },
      blankIds: ['p6-forward-property', 'p6-forward-judgment', 'p6-reverse-property', 'p6-reverse-judgment', 'p6-classification'],
      dependsOn: ['basis'],
    },
  ],

  'math-practice-105': [
    {
      id: 'basis',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: '真を示す場合と偽を示す場合を分ける', zh: '区分证明为真与证明为假的方法' },
      blankIds: ['rule'],
      result: { blankId: 'rule', label: { ja: '判定の基準', zh: '判断标准' } },
    },
    {
      id: 's1',
      kicker: { ja: '今の問い｜(1)', zh: '当前问题｜(1)' },
      label: { ja: '前件を満たす組を作って後件まで確かめる', zh: '构造满足前件的数对并检查后件' },
      blankIds: ['p1-zero-case', 'p1-example', 'p1-verify', 'p1-judgment'],
      dependsOn: ['basis'],
    },
    {
      id: 's2',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      label: { ja: '前件の全ケースを漏れなく確認する', zh: '完整检查前件的所有情况' },
      blankIds: ['p2-solutions', 'p2-check', 'p2-judgment'],
      dependsOn: ['basis'],
    },
    {
      id: 's3',
      kicker: { ja: '今の問い｜(3)', zh: '当前问题｜(3)' },
      label: { ja: '積と各因子を別々に確かめる', zh: '分别检查乘积与各因子' },
      blankIds: ['p3-example', 'p3-product', 'p3-factors', 'p3-judgment'],
      dependsOn: ['basis'],
    },
    {
      id: 's4',
      kicker: { ja: '今の問い｜(4)', zh: '当前问题｜(4)' },
      label: { ja: '和・積と a,b 自身を順に確かめる', zh: '依次检查和、积以及a、b本身' },
      blankIds: ['p4-example', 'p4-sum-product', 'p4-factors', 'p4-judgment'],
      dependsOn: ['basis'],
    },
  ],

  'math-practice-106': [
    {
      id: 'basis',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: '日本語条件と集合演算を対応させる', zh: '对应文字条件与集合运算' },
      blankIds: ['rule'],
      result: { blankId: 'rule', label: { ja: '集合演算の対応', zh: '集合运算对应' } },
    },
    {
      id: 's1',
      kicker: { ja: '今の問い｜(1)', zh: '当前问题｜(1)' },
      label: { ja: '6の倍数を2つの条件へ分ける', zh: '把6的倍数拆成两个条件' },
      blankIds: ['p1-parts', 'p1-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's2',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      label: { ja: '奇数の条件を集合 P で表す', zh: '用集合 P 表示奇数条件' },
      blankIds: ['p2-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's3',
      kicker: { ja: '今の問い｜(3)', zh: '当前问题｜(3)' },
      label: { ja: '2条件を集合の部品へ翻訳して結ぶ', zh: '把两个条件翻译成集合部件再连接' },
      blankIds: ['p3-parts', 'p3-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's4',
      kicker: { ja: '今の問い｜(4)', zh: '当前问题｜(4)' },
      label: { ja: '補集合を含む2条件を翻訳して結ぶ', zh: '翻译含补集的两个条件再连接' },
      blankIds: ['p4-parts', 'p4-result'],
      dependsOn: ['basis'],
    },
  ],

  'math-practice-107': [
    {
      id: 'basis',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: '必要・十分を2方向の含意で判定する', zh: '用两个方向的蕴含判断必要与充分' },
      blankIds: ['rule'],
      result: { blankId: 'rule', label: { ja: '方向と条件の対応', zh: '方向与条件的对应' } },
    },
    {
      id: 's1',
      kicker: { ja: '今の問い｜(1)', zh: '当前问题｜(1)' },
      label: { ja: '積が0の条件と3数一致を双方向に比べる', zh: '双向比较乘积为0与三个数相等' },
      blankIds: ['p1-forward-branches', 'p1-forward-example', 'p1-forward-judgment', 'p1-reverse-check', 'p1-reverse-judgment', 'p1-classification'],
      dependsOn: ['basis'],
    },
    {
      id: 's2',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      label: { ja: '符号条件を2方向に分けて確かめる', zh: '把符号条件分成两个方向检查' },
      blankIds: ['p2-forward-sign', 'p2-forward-judgment', 'p2-reverse-signs', 'p2-reverse-example', 'p2-reverse-judgment', 'p2-classification'],
      dependsOn: ['basis'],
    },
    {
      id: 's3',
      kicker: { ja: '今の問い｜(3)', zh: '当前问题｜(3)' },
      label: { ja: '積0と和0を組み合わせて双方向を確かめる', zh: '结合乘积为0与和为0检查两个方向' },
      blankIds: ['p3-forward-check', 'p3-forward-judgment', 'p3-reverse-zero-product', 'p3-reverse-sum', 'p3-reverse-judgment', 'p3-classification'],
      dependsOn: ['basis'],
    },
    {
      id: 's4',
      kicker: { ja: '今の問い｜(4)', zh: '当前问题｜(4)' },
      label: { ja: '1つの角と三角形全体の条件を比べる', zh: '比较一个角与整个三角形的条件' },
      blankIds: ['p4-acute-definition', 'p4-reverse-judgment', 'p4-counterexample-angles', 'p4-forward-verify', 'p4-forward-judgment', 'p4-classification'],
      dependsOn: ['basis'],
    },
    {
      id: 's5',
      kicker: { ja: '今の問い｜(5)', zh: '当前问题｜(5)' },
      label: { ja: '辺の式を2枝に分けて幾何条件を双方向に確かめる', zh: '把边长条件分成两支并双向检查几何条件' },
      blankIds: [
        'p5-factor-branches',
        'p5-branch-isosceles',
        'p5-branch-right',
        'p5-forward-example',
        'p5-forward-verify',
        'p5-forward-judgment',
        'p5-reverse-position',
        'p5-reverse-lengths',
        'p5-reverse-factors',
        'p5-reverse-judgment',
        'p5-classification',
      ],
      dependsOn: ['basis'],
    },
  ],

  'math-practice-108': [
    {
      id: 'basis',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: '同値は2方向を別々に証明する', zh: '分别证明等价的两个方向' },
      blankIds: ['rule'],
      result: { blankId: 'rule', label: { ja: '同値の証明方針', zh: '等价证明方针' } },
    },
    {
      id: 'forward',
      kicker: { ja: '一方向目', zh: '第一个方向' },
      label: { ja: 'pからqの2条件を1つずつ作る', zh: '由p逐个得到q的两个条件' },
      blankIds: ['forward-sum', 'forward-product', 'forward-judgment'],
      dependsOn: ['basis'],
    },
    {
      id: 'reverse',
      kicker: { ja: '逆方向', zh: '反方向' },
      label: { ja: '符号分岐を和条件で絞る', zh: '用和条件筛选符号分支' },
      blankIds: ['reverse-sign', 'reverse-eliminate', 'reverse-judgment'],
      dependsOn: ['basis'],
    },
    {
      id: 'final',
      kicker: { ja: '結論', zh: '结论' },
      label: { ja: '2方向から同値を結論する', zh: '由两个方向得出等价' },
      blankIds: ['equivalence'],
      dependsOn: ['forward', 'reverse'],
    },
  ],

  'math-practice-109': [
    {
      id: 'basis',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: '量化語と中の条件をセットで否定する', zh: '同时否定量化词与内部条件' },
      blankIds: ['rule'],
      result: { blankId: 'rule', label: { ja: '量化命題の否定', zh: '量化命题的否定' } },
    },
    {
      id: 's1',
      kicker: { ja: '今の問い｜(1)', zh: '当前问题｜(1)' },
      label: { ja: '否定文を作って実際に解を探す', zh: '写出否定并实际寻找解' },
      blankIds: ['p1-negation', 'p1-solve', 'p1-truth'],
      dependsOn: ['basis'],
    },
    {
      id: 's2',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      label: { ja: '否定・方程式・定義域を順に確かめる', zh: '依次检查否定、方程与定义域' },
      blankIds: ['p2-negation', 'p2-solve', 'p2-domain', 'p2-truth'],
      dependsOn: ['basis'],
    },
  ],

  'math-practice-110': [
    {
      id: 'basis',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: '逆・対偶・裏の形を整理する', zh: '整理逆、逆否与否命题的形式' },
      blankIds: ['rule'],
      result: { blankId: 'rule', label: { ja: '変換規則', zh: '变换规则' } },
    },

    {
      id: 'p1-original',
      kicker: { ja: '今の問い｜(1) 元', zh: '当前问题｜(1) 原' },
      label: { ja: '9の倍数から3の倍数を示す', zh: '由9的倍数推出3的倍数' },
      blankIds: ['p1-original-proof', 'p1-original-judgment'],
      dependsOn: ['basis'],
      result: { blankId: 'p1-original-judgment', label: { ja: '元命題', zh: '原命题' } },
    },
    {
      id: 'p1-converse',
      kicker: { ja: '今の問い｜(1) 逆', zh: '当前问题｜(1) 逆' },
      label: { ja: '逆を作り、具体例で確かめる', zh: '写出逆命题并用具体例检查' },
      blankIds: ['p1-converse-form', 'p1-converse-example', 'p1-converse-judgment'],
      dependsOn: ['basis'],
      result: { blankId: 'p1-converse-judgment', label: { ja: '逆', zh: '逆命题' } },
    },
    {
      id: 'p1-contrapositive',
      kicker: { ja: '今の問い｜(1) 対偶', zh: '当前问题｜(1) 逆否' },
      label: { ja: '対偶を作り、倍数関係で確かめる', zh: '写出逆否命题并用倍数关系检查' },
      blankIds: ['p1-contrapositive-form', 'p1-contrapositive-evidence', 'p1-contrapositive-judgment'],
      dependsOn: ['basis'],
      result: { blankId: 'p1-contrapositive-judgment', label: { ja: '対偶', zh: '逆否命题' } },
    },
    {
      id: 'p1-inverse',
      kicker: { ja: '今の問い｜(1) 裏', zh: '当前问题｜(1) 否' },
      label: { ja: '裏を作り、具体例で確かめる', zh: '写出否命题并用具体例检查' },
      blankIds: ['p1-inverse-form', 'p1-inverse-example', 'p1-inverse-judgment'],
      dependsOn: ['basis'],
      result: { blankId: 'p1-inverse-judgment', label: { ja: '裏', zh: '否命题' } },
    },
    {
      id: 'p1-summary',
      kicker: { ja: '今の問い｜(1) まとめ', zh: '当前问题｜(1) 汇总' },
      label: { ja: '4つの真偽を並べる', zh: '汇总四个命题的真假' },
      blankIds: ['p1-summary'],
      dependsOn: ['p1-original', 'p1-converse', 'p1-contrapositive', 'p1-inverse'],
    },

    {
      id: 'p2-original',
      kicker: { ja: '今の問い｜(2) 元', zh: '当前问题｜(2) 原' },
      label: { ja: '根を求めて元命題を確かめる', zh: '求根并检查原命题' },
      blankIds: ['p2-roots', 'p2-original-example', 'p2-original-judgment'],
      dependsOn: ['basis'],
      result: { blankId: 'p2-original-judgment', label: { ja: '元命題', zh: '原命题' } },
    },
    {
      id: 'p2-converse',
      kicker: { ja: '今の問い｜(2) 逆', zh: '当前问题｜(2) 逆' },
      label: { ja: '逆命題を作り、真偽を確かめる', zh: '写出逆命题并判断真假' },
      blankIds: ['p2-converse-form', 'p2-converse-evidence', 'p2-converse-judgment'],
      dependsOn: ['basis'],
      result: { blankId: 'p2-converse-judgment', label: { ja: '逆', zh: '逆命题' } },
    },
    {
      id: 'p2-contrapositive',
      kicker: { ja: '今の問い｜(2) 対偶', zh: '当前问题｜(2) 逆否' },
      label: { ja: '対偶を作り、根から反例を調べる', zh: '写出逆否命题并由根检查反例' },
      blankIds: ['p2-contrapositive-form', 'p2-contrapositive-example', 'p2-contrapositive-judgment'],
      dependsOn: ['basis'],
      result: { blankId: 'p2-contrapositive-judgment', label: { ja: '対偶', zh: '逆否命题' } },
    },
    {
      id: 'p2-inverse',
      kicker: { ja: '今の問い｜(2) 裏', zh: '当前问题｜(2) 否' },
      label: { ja: '裏を作り、代入で確かめる', zh: '写出否命题并用代入检查' },
      blankIds: ['p2-inverse-form', 'p2-inverse-evidence', 'p2-inverse-judgment'],
      dependsOn: ['basis'],
      result: { blankId: 'p2-inverse-judgment', label: { ja: '裏', zh: '否命题' } },
    },
    {
      id: 'p2-summary',
      kicker: { ja: '今の問い｜(2) まとめ', zh: '当前问题｜(2) 汇总' },
      label: { ja: '4つの真偽を並べる', zh: '汇总四个命题的真假' },
      blankIds: ['p2-summary'],
      dependsOn: ['p2-original', 'p2-converse', 'p2-contrapositive', 'p2-inverse'],
    },

    {
      id: 'p3-original',
      kicker: { ja: '今の問い｜(3) 元', zh: '当前问题｜(3) 原' },
      label: { ja: '因数分解から元命題を確かめる', zh: '由因式分解检查原命题' },
      blankIds: ['p3-original-factor', 'p3-original-judgment'],
      dependsOn: ['basis'],
      result: { blankId: 'p3-original-judgment', label: { ja: '元命題', zh: '原命题' } },
    },
    {
      id: 'p3-converse',
      kicker: { ja: '今の問い｜(3) 逆', zh: '当前问题｜(3) 逆' },
      label: { ja: '逆を作り、2ケースを代入する', zh: '写出逆命题并代入两个情况' },
      blankIds: ['p3-converse-form', 'p3-converse-evidence', 'p3-converse-judgment'],
      dependsOn: ['basis'],
      result: { blankId: 'p3-converse-judgment', label: { ja: '逆', zh: '逆命题' } },
    },
    {
      id: 'p3-contrapositive',
      kicker: { ja: '今の問い｜(3) 対偶', zh: '当前问题｜(3) 逆否' },
      label: { ja: 'ORを否定して対偶を確かめる', zh: '否定OR并检查逆否命题' },
      blankIds: ['p3-contrapositive-form', 'p3-contrapositive-evidence', 'p3-contrapositive-judgment'],
      dependsOn: ['basis'],
      result: { blankId: 'p3-contrapositive-judgment', label: { ja: '対偶', zh: '逆否命题' } },
    },
    {
      id: 'p3-inverse',
      kicker: { ja: '今の問い｜(3) 裏', zh: '当前问题｜(3) 否' },
      label: { ja: '裏を作り、非零積から確かめる', zh: '写出否命题并由非零乘积检查' },
      blankIds: ['p3-inverse-form', 'p3-inverse-evidence', 'p3-inverse-judgment'],
      dependsOn: ['basis'],
      result: { blankId: 'p3-inverse-judgment', label: { ja: '裏', zh: '否命题' } },
    },
    {
      id: 'p3-summary',
      kicker: { ja: '今の問い｜(3) まとめ', zh: '当前问题｜(3) 汇总' },
      label: { ja: '4つの真偽を並べる', zh: '汇总四个命题的真假' },
      blankIds: ['p3-summary'],
      dependsOn: ['p3-original', 'p3-converse', 'p3-contrapositive', 'p3-inverse'],
    },
  ],

  'math-practice-111': [
    {
      id: 'basis',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: '対偶の形を確認する', zh: '确认逆否命题的形式' },
      blankIds: ['rule'],
      result: {
        blankId: 'rule',
        label: { ja: '対偶の形', zh: '逆否命题的形式' },
      },
    },
    {
      id: 'p1-contrapositive',
      kicker: { ja: '今の問い｜(1) 対偶', zh: '当前问题｜(1) 逆否命题' },
      label: { ja: '2つの条件を否定して対偶を作る', zh: '否定两个条件并写出逆否命题' },
      blankIds: ['p1-contrapositive'],
      dependsOn: ['basis'],
      result: { blankId: 'p1-contrapositive', label: { ja: '(1) の対偶', zh: '(1) 的逆否命题' } },
    },
    {
      id: 'p1-proof',
      kicker: { ja: '今の問い｜(1) 証明', zh: '当前问题｜(1) 证明' },
      label: { ja: '対偶を直接計算して示す', zh: '直接计算证明逆否命题' },
      blankIds: ['p1-proof'],
      dependsOn: ['p1-contrapositive'],
    },
    {
      id: 'p2-negation',
      kicker: { ja: '今の問い｜(2) 対偶の前件', zh: '当前问题｜(2) 逆否命题前件' },
      label: { ja: '「または」全体を否定する', zh: '否定整个“或”条件' },
      blankIds: ['p2-negation'],
      dependsOn: ['basis'],
      result: { blankId: 'p2-negation', label: { ja: '後件の否定', zh: '后件的否定' } },
    },
    {
      id: 'p2-proof',
      kicker: { ja: '今の問い｜(2) 証明', zh: '当前问题｜(2) 证明' },
      label: { ja: '2つの上界を足して対偶を示す', zh: '相加两个上界证明逆否命题' },
      blankIds: ['p2-proof'],
      dependsOn: ['p2-negation'],
    },
    {
      id: 'p3-contrapositive',
      kicker: { ja: '今の問い｜(3) 対偶', zh: '当前问题｜(3) 逆否命题' },
      label: { ja: '倍数条件を否定して対偶を作る', zh: '否定倍数条件并写出逆否命题' },
      blankIds: ['p3-contrapositive'],
      dependsOn: ['basis'],
      result: { blankId: 'p3-contrapositive', label: { ja: '(3) の対偶', zh: '(3) 的逆否命题' } },
    },
    {
      id: 'p3-proof',
      kicker: { ja: '今の問い｜(3) 証明', zh: '当前问题｜(3) 证明' },
      label: { ja: 'n=3kから3×整数の形を作る', zh: '由n=3k写成3×整数' },
      blankIds: ['p3-proof'],
      dependsOn: ['p3-contrapositive'],
    },
    {
      id: 'p4-contrapositive',
      kicker: { ja: '今の問い｜(4) 対偶', zh: '当前问题｜(4) 逆否命题' },
      label: { ja: '奇数・偶数を否定して対偶を作る', zh: '否定奇偶条件并写出逆否命题' },
      blankIds: ['p4-contrapositive'],
      dependsOn: ['basis'],
      result: { blankId: 'p4-contrapositive', label: { ja: '(4) の対偶', zh: '(4) 的逆否命题' } },
    },
    {
      id: 'p4-form',
      kicker: { ja: '今の問い｜(4) 奇数の式', zh: '当前问题｜(4) 奇数表示' },
      label: { ja: '奇数を整数 k を使って表す', zh: '用整数 k 表示奇数' },
      blankIds: ['p4-form'],
      dependsOn: ['p4-contrapositive'],
      result: { blankId: 'p4-form', label: { ja: '奇数の表現', zh: '奇数的表示式' } },
    },
    {
      id: 'p4-proof',
      kicker: { ja: '今の問い｜(4) 証明', zh: '当前问题｜(4) 证明' },
      label: { ja: '展開して2×整数の形を作る', zh: '展开并写成2×整数' },
      blankIds: ['p4-proof'],
      dependsOn: ['p4-form'],
    },
  ],
  'math-practice-112': [
    {
      id: 'basis',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: '背理法で√3の無理性へ矛盾を戻す', zh: '用反证法把矛盾导回√3的无理性' },
      blankIds: ['rule'],
      result: {
        blankId: 'rule',
        label: { ja: '背理法の方針', zh: '反证法方针' },
      },
    },
    {
      id: 'p1-assumption',
      kicker: { ja: '今の問い｜(1) 仮定', zh: '当前问题｜(1) 反设' },
      label: { ja: '結論の反対を仮定する', zh: '假设结论的反面' },
      blankIds: ['p1-assumption'],
      dependsOn: ['basis'],
      result: { blankId: 'p1-assumption', label: { ja: '(1) の反対仮定', zh: '(1) 的反设' } },
    },
    {
      id: 'p1-isolate',
      kicker: { ja: '今の問い｜(1) √3を取り出す', zh: '当前问题｜(1) 分离√3' },
      label: { ja: '1+√3=rから√3を単独にする', zh: '由1+√3=r单独表示√3' },
      blankIds: ['p1-isolate'],
      dependsOn: ['p1-assumption'],
      result: { blankId: 'p1-isolate', label: { ja: '(1) で得た√3の式', zh: '(1) 得到的√3表达式' } },
    },
    {
      id: 'p1-contradiction',
      kicker: { ja: '今の問い｜(1) 矛盾', zh: '当前问题｜(1) 矛盾' },
      label: { ja: '有理数の差と既知の無理性を比べる', zh: '比较有理数之差与已知无理性' },
      blankIds: ['p1-contradiction'],
      dependsOn: ['p1-isolate'],
    },
    {
      id: 'p2-rationalize',
      kicker: { ja: '今の問い｜(2) 有理化', zh: '当前问题｜(2) 有理化' },
      label: { ja: '共役を掛けて分母を消す', zh: '乘共轭式消去根式分母' },
      blankIds: ['p2-rationalize'],
      dependsOn: ['basis'],
      result: { blankId: 'p2-rationalize', label: { ja: '有理化した形', zh: '有理化后的形式' } },
    },
    {
      id: 'p2-assumption',
      kicker: { ja: '今の問い｜(2) 仮定', zh: '当前问题｜(2) 反设' },
      label: { ja: '有理化後の式で背理法の反対仮定を置く', zh: '用有理化后的式子写出反设' },
      blankIds: ['p2-assumption'],
      dependsOn: ['p2-rationalize'],
      result: { blankId: 'p2-assumption', label: { ja: '(2) の反対仮定', zh: '(2) 的反设' } },
    },
    {
      id: 'p2-isolate',
      kicker: { ja: '今の問い｜(2) √3を取り出す', zh: '当前问题｜(2) 分离√3' },
      label: { ja: '2-√3=rから√3を単独にする', zh: '由2-√3=r单独表示√3' },
      blankIds: ['p2-isolate'],
      dependsOn: ['p2-assumption'],
      result: { blankId: 'p2-isolate', label: { ja: '(2) で得た√3の式', zh: '(2) 得到的√3表达式' } },
    },
    {
      id: 'p2-contradiction',
      kicker: { ja: '今の問い｜(2) 矛盾', zh: '当前问题｜(2) 矛盾' },
      label: { ja: '有理数の差から矛盾を閉じる', zh: '由有理数之差完成矛盾' },
      blankIds: ['p2-contradiction'],
      dependsOn: ['p2-isolate'],
    },
  ],
  'math-practice-113': [
    {
      id: 'assumption',
      kicker: { ja: 'まずの目標', zh: '第一个目标' },
      label: { ja: '背理法の反対仮定を置く', zh: '写出反证法所需的反设' },
      blankIds: ['assumption'],
      result: {
        blankId: 'assumption',
        label: { ja: '反対仮定', zh: '反设' },
      },
    },
    {
      id: 'operation',
      kicker: { ja: '次の目標', zh: '下一个目标' },
      label: { ja: '√x=rから元のxへ戻る操作を選ぶ', zh: '选择由√x=r恢复x的运算' },
      blankIds: ['operation'],
      dependsOn: ['assumption'],
      result: {
        blankId: 'operation',
        label: { ja: 'xへ戻る操作', zh: '恢复x的运算' },
      },
    },
    {
      id: 'square-result',
      kicker: { ja: '次の目標', zh: '下一个目标' },
      label: { ja: '2乗後にxの有理性を判断する', zh: '平方后判断x的有理性' },
      blankIds: ['square-result'],
      dependsOn: ['operation'],
      result: {
        blankId: 'square-result',
        label: { ja: '2乗して得た式', zh: '平方得到的式子' },
      },
    },
    {
      id: 'contradiction',
      kicker: { ja: '最後の目標', zh: '最后目标' },
      label: { ja: 'xが無理数という仮定と矛盾させる', zh: '与x是无理数的题设形成矛盾' },
      blankIds: ['contradiction'],
      dependsOn: ['square-result'],
    },
  ],
  'math-practice-114': [
    {
      id: 'p1-plan',
      kicker: { ja: '今の問い｜(1) 方針', zh: '当前问题｜(1) 方针' },
      label: { ja: '余りを調べられる対偶へ直す', zh: '改写为可检查余数的逆否命题' },
      blankIds: ['p1-plan'],
      result: { blankId: 'p1-plan', label: { ja: '(1) の対偶', zh: '(1) 的逆否命题' } },
    },
    {
      id: 'p1-residues',
      kicker: { ja: '今の問い｜(1) 余り', zh: '当前问题｜(1) 余数' },
      label: { ja: '5の倍数でない余りを全部出す', zh: '列出不是5的倍数时的全部余数' },
      blankIds: ['p1-residues'],
      dependsOn: ['p1-plan'],
      result: { blankId: 'p1-residues', label: { ja: 'mod 5 の候補', zh: 'mod 5 的候选余数' } },
    },
    {
      id: 'p1-squares',
      kicker: { ja: '今の問い｜(1) 全ケース', zh: '当前问题｜(1) 全部情况' },
      label: { ja: '4つの平方余りをすべて調べる', zh: '检查四种平方余数' },
      blankIds: ['p1-squares'],
      dependsOn: ['p1-residues'],
    },
    {
      id: 'p2-plan',
      kicker: { ja: '今の問い｜(2) 方針', zh: '当前问题｜(2) 方针' },
      label: { ja: '「少なくとも一方」を否定して対偶を作る', zh: '否定“至少一个”并写出逆否命题' },
      blankIds: ['p2-plan'],
      result: { blankId: 'p2-plan', label: { ja: '(2) の対偶', zh: '(2) 的逆否命题' } },
    },
    {
      id: 'p2-residues',
      kicker: { ja: '今の問い｜(2) 余り', zh: '当前问题｜(2) 余数' },
      label: { ja: '3の倍数でない余りを分類する', zh: '分类不是3的倍数时的余数' },
      blankIds: ['p2-residues'],
      dependsOn: ['p2-plan'],
      result: { blankId: 'p2-residues', label: { ja: 'mod 3 の候補', zh: 'mod 3 的候选余数' } },
    },
    {
      id: 'p2-products',
      kicker: { ja: '今の問い｜(2) 全ケース', zh: '当前问题｜(2) 全部情况' },
      label: { ja: '4つの積の余りをすべて調べる', zh: '检查四种乘积余数' },
      blankIds: ['p2-products'],
      dependsOn: ['p2-residues'],
    },
  ],
  'math-practice-115': [
    {
      id: 'assumption',
      kicker: { ja: 'まずの目標', zh: '第一个目标' },
      label: { ja: '背理法の反対仮定を置く', zh: '写出反证法的反设' },
      blankIds: ['assumption'],
      result: {
        blankId: 'assumption',
        label: { ja: '反対仮定', zh: '反设' },
      },
    },
    {
      id: 'operation',
      kicker: { ja: '次の目標', zh: '下一个目标' },
      label: { ja: '√6を式に出す操作を選ぶ', zh: '选择让√6出现在式中的运算' },
      blankIds: ['operation'],
      dependsOn: ['assumption'],
      result: {
        blankId: 'operation',
        label: { ja: '√6を作る操作', zh: '产生√6的运算' },
      },
    },
    {
      id: 'expand',
      kicker: { ja: '次の目標', zh: '下一个目标' },
      label: { ja: '2乗して√6を含む式まで整理する', zh: '平方并整理到含√6的式子' },
      blankIds: ['expand'],
      dependsOn: ['operation'],
      result: {
        blankId: 'expand',
        label: { ja: '2乗後の式', zh: '平方后的式子' },
      },
    },
    {
      id: 'isolate',
      kicker: { ja: '次の目標', zh: '下一个目标' },
      label: { ja: '√6を単独にする', zh: '单独表示√6' },
      blankIds: ['isolate'],
      dependsOn: ['expand'],
      result: {
        blankId: 'isolate',
        label: { ja: '√6の式', zh: '√6的表达式' },
      },
    },
    {
      id: 'contradiction',
      kicker: { ja: '最後の目標', zh: '最后目标' },
      label: { ja: '右辺の有理性から矛盾を閉じる', zh: '由右边的有理性完成矛盾' },
      blankIds: ['contradiction'],
      dependsOn: ['isolate'],
    },
  ],
  'math-practice-116': [
    {
      id: 'target',
      kicker: { ja: 'まずの目標', zh: '第一个目标' },
      label: { ja: '無理数Xに掛かる係数を見つける', zh: '找出乘在无理数X前的系数' },
      blankIds: ['target'],
      result: {
        blankId: 'target',
        label: { ja: '最初に調べる係数', zh: '首先研究的系数' },
      },
    },
    {
      id: 'assumption',
      kicker: { ja: '次の目標', zh: '下一个目标' },
      label: { ja: 'q=0を示すための反対仮定を置く', zh: '为证明q=0写出反设' },
      blankIds: ['assumption'],
      dependsOn: ['target'],
      result: {
        blankId: 'assumption',
        label: { ja: '反対仮定', zh: '反设' },
      },
    },
    {
      id: 'isolate',
      kicker: { ja: '次の目標', zh: '下一个目标' },
      label: { ja: '元の式からXを単独にする', zh: '由原式单独表示X' },
      blankIds: ['isolate'],
      dependsOn: ['assumption'],
      result: {
        blankId: 'isolate',
        label: { ja: 'Xの式', zh: 'X的表达式' },
      },
    },
    {
      id: 'q-zero',
      kicker: { ja: '次の目標', zh: '下一个目标' },
      label: { ja: '有理数の商とXの無理性を矛盾させる', zh: '用有理数之商与X的无理性形成矛盾' },
      blankIds: ['q-zero'],
      dependsOn: ['isolate'],
      result: {
        blankId: 'q-zero',
        label: { ja: 'まず得た結論', zh: '首先得到的结论' },
      },
    },
    {
      id: 'p-zero',
      kicker: { ja: '最後の目標', zh: '最后目标' },
      label: { ja: 'q=0を元の式へ戻してpを決める', zh: '把q=0代回原式求p' },
      blankIds: ['p-zero'],
      dependsOn: ['q-zero'],
      result: {
        blankId: 'p-zero',
        label: { ja: '116の結果', zh: '116的结论' },
      },
    },
  ],
  'math-practice-117': [
    {
      id: 'p1-expand',
      kicker: { ja: '今の問い｜(1) 展開', zh: '当前问题｜(1) 展开' },
      label: { ja: '(√2-1)pを展開する', zh: '展开(√2-1)p' },
      blankIds: ['p1-expand'],
      result: {
        blankId: 'p1-expand',
        label: { ja: '(1) 展開結果', zh: '(1) 展开结果' },
      },
    },
    {
      id: 'p1-group',
      kicker: { ja: '今の問い｜(1) 整理', zh: '当前问题｜(1) 整理' },
      label: { ja: '√2の係数と有理数部分に分ける', zh: '分离√2系数与有理数部分' },
      blankIds: ['p1-group'],
      dependsOn: ['p1-expand'],
      result: {
        blankId: 'p1-group',
        label: { ja: '(1) の係数分離形', zh: '(1) 的系数分离式' },
      },
    },
    {
      id: 'p1-apply',
      kicker: { ja: '今の問い｜(1) 116を使う', zh: '当前问题｜(1) 使用116' },
      label: { ja: '2つの有理係数をそれぞれ0とする', zh: '令两个有理系数分别为0' },
      blankIds: ['p1-apply'],
      dependsOn: ['p1-group'],
      externalDependencies: [theorem116ForSqrt2],
      result: {
        blankId: 'p1-apply',
        label: { ja: '(1) の2本の式', zh: '(1) 的两个方程' },
      },
    },
    {
      id: 'p1-solve',
      kicker: { ja: '今の問い｜(1) 解く', zh: '当前问题｜(1) 求解' },
      label: { ja: '2本の一次方程式からp,qを決める', zh: '由两个一次方程求p,q' },
      blankIds: ['p1-solve'],
      dependsOn: ['p1-apply'],
    },

    {
      id: 'p2-conjugate',
      kicker: { ja: '今の問い｜(2) 共役', zh: '当前问题｜(2) 共轭' },
      label: { ja: '√2-1の共役を選ぶ', zh: '选择√2-1的共轭式' },
      blankIds: ['p2-conjugate'],
      result: {
        blankId: 'p2-conjugate',
        label: { ja: '有理化に使う共役', zh: '有理化所用共轭式' },
      },
    },
    {
      id: 'p2-rationalize',
      kicker: { ja: '今の問い｜(2) 有理化', zh: '当前问题｜(2) 有理化' },
      label: { ja: '2つの分母を有理化する', zh: '分别有理化两个分母' },
      blankIds: ['p2-rationalize'],
      dependsOn: ['p2-conjugate'],
      result: {
        blankId: 'p2-rationalize',
        label: { ja: '(2) の有理化結果', zh: '(2) 的有理化结果' },
      },
    },
    {
      id: 'p2-group',
      kicker: { ja: '今の問い｜(2) 整理', zh: '当前问题｜(2) 整理' },
      label: { ja: '全体を2倍して係数分離形を作る', zh: '全式乘2并整理成系数分离式' },
      blankIds: ['p2-group'],
      dependsOn: ['p2-rationalize'],
      result: {
        blankId: 'p2-group',
        label: { ja: '(2) の係数分離形', zh: '(2) 的系数分离式' },
      },
    },
    {
      id: 'p2-apply',
      kicker: { ja: '今の問い｜(2) 116を使う', zh: '当前问题｜(2) 使用116' },
      label: { ja: '2つの有理係数をそれぞれ0とする', zh: '令两个有理系数分别为0' },
      blankIds: ['p2-apply'],
      dependsOn: ['p2-group'],
      externalDependencies: [theorem116ForSqrt2],
      result: {
        blankId: 'p2-apply',
        label: { ja: '(2) の2本の式', zh: '(2) 的两个方程' },
      },
    },
    {
      id: 'p2-solve',
      kicker: { ja: '今の問い｜(2) 解く', zh: '当前问题｜(2) 求解' },
      label: { ja: '2本の一次方程式からp,qを決める', zh: '由两个一次方程求p,q' },
      blankIds: ['p2-solve'],
      dependsOn: ['p2-apply'],
    },
  ],
  'math-practice-118': [
    {
      id: 'basis',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: '1つの入力に出力が何個かを見る', zh: '检查一个输入对应几个输出' },
      blankIds: ['rule'],
      result: { blankId: 'rule', label: { ja: '関数の判定基準', zh: '函数判断标准' } },
    },
    {
      id: 's1',
      kicker: { ja: '今の問い｜(1)', zh: '当前问题｜(1)' },
      label: { ja: '円周と半径の対応を式から読む', zh: '由公式读取圆周与半径的对应' },
      blankIds: ['p1-relation', 'p1-solve', 'p1-unique', 'p1-judgment'],
      dependsOn: ['basis'],
    },
    {
      id: 's2',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      label: { ja: '具体的な入力で平方根を全部出す', zh: '用具体输入列出全部平方根' },
      blankIds: ['p2-sample', 'p2-roots', 'p2-count', 'p2-judgment'],
      dependsOn: ['basis'],
    },
    {
      id: 's3',
      kicker: { ja: '今の問い｜(3)', zh: '当前问题｜(3)' },
      label: { ja: '面積条件からxとyの対応を読む', zh: '由面积条件读取x与y的对应' },
      blankIds: ['p3-area', 'p3-solve', 'p3-domain', 'p3-unique', 'p3-judgment'],
      dependsOn: ['basis'],
    },
  ],

  'math-practice-119': [
    {
      id: 'basis',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: '関数値の代入ルールを確認する', zh: '确认求函数值时的代入规则' },
      blankIds: ['rule'],
      result: {
        blankId: 'rule',
        label: { ja: '代入のルール', zh: '代入规则' },
      },
    },
    {
      id: 'f0',
      kicker: { ja: '今の問い｜(1) f(0)', zh: '当前问题｜(1) f(0)' },
      label: { ja: 'x=0を代入して計算する', zh: '代入x=0并计算' },
      blankIds: ['f0'],
      dependsOn: ['basis'],
    },
    {
      id: 'f2',
      kicker: { ja: '今の問い｜(2) f(2)', zh: '当前问题｜(2) f(2)' },
      label: { ja: 'x=2を代入して計算する', zh: '代入x=2并计算' },
      blankIds: ['f2'],
      dependsOn: ['basis'],
    },
    {
      id: 'fm1',
      kicker: { ja: '今の問い｜(3) f(-1)', zh: '当前问题｜(3) f(-1)' },
      label: { ja: '負数を括弧付きで代入する', zh: '用括号代入负数' },
      blankIds: ['fm1'],
      dependsOn: ['basis'],
    },
    {
      id: 'fa',
      kicker: { ja: '今の問い｜(4) f(a)', zh: '当前问题｜(4) f(a)' },
      label: { ja: 'xをaで置き換える', zh: '用a替换x' },
      blankIds: ['fa'],
      dependsOn: ['basis'],
    },
    {
      id: 'fa1-substitute',
      kicker: { ja: '今の問い｜(5) 代入', zh: '当前问题｜(5) 代入' },
      label: { ja: 'a+1を括弧ごと代入する', zh: '把a+1整体代入' },
      blankIds: ['fa1-substitute'],
      dependsOn: ['basis'],
      result: {
        blankId: 'fa1-substitute',
        label: { ja: '(5) 代入後の式', zh: '(5) 代入后的式子' },
      },
    },
    {
      id: 'fa1-simplify',
      kicker: { ja: '今の問い｜(5) 整理', zh: '当前问题｜(5) 整理' },
      label: { ja: '展開してf(a+1)を求める', zh: '展开并求f(a+1)' },
      blankIds: ['fa1-simplify'],
      dependsOn: ['fa1-substitute'],
    },
    {
      id: 'g0',
      kicker: { ja: '今の問い｜(6) g(0)', zh: '当前问题｜(6) g(0)' },
      label: { ja: '2か所のxを0で置き換える', zh: '把两处x都替换为0' },
      blankIds: ['g0'],
      dependsOn: ['basis'],
    },
    {
      id: 'g3',
      kicker: { ja: '今の問い｜(7) g(3)', zh: '当前问题｜(7) g(3)' },
      label: { ja: '2か所のxを3で置き換える', zh: '把两处x都替换为3' },
      blankIds: ['g3'],
      dependsOn: ['basis'],
    },
    {
      id: 'gm2',
      kicker: { ja: '今の問い｜(8) g(-2)', zh: '当前问题｜(8) g(-2)' },
      label: { ja: '負数-2を2か所とも括弧付きで代入する', zh: '两处都用括号代入-2' },
      blankIds: ['gm2'],
      dependsOn: ['basis'],
    },
    {
      id: 'gma-substitute',
      kicker: { ja: '今の問い｜(9) 代入', zh: '当前问题｜(9) 代入' },
      label: { ja: '-aを2か所とも括弧付きで代入する', zh: '两处都用括号代入-a' },
      blankIds: ['gma-substitute'],
      dependsOn: ['basis'],
      result: {
        blankId: 'gma-substitute',
        label: { ja: '(9) 代入後の式', zh: '(9) 代入后的式子' },
      },
    },
    {
      id: 'gma-square',
      kicker: { ja: '今の問い｜(9) 2乗', zh: '当前问题｜(9) 平方' },
      label: { ja: '(-a)²の符号を整理する', zh: '整理(-a)²的符号' },
      blankIds: ['gma-square'],
      dependsOn: ['gma-substitute'],
      result: {
        blankId: 'gma-square',
        label: { ja: '負号を含む2乗', zh: '带负号的平方' },
      },
    },
    {
      id: 'gma-simplify',
      kicker: { ja: '今の問い｜(9) 整理', zh: '当前问题｜(9) 整理' },
      label: { ja: '同類項をまとめてg(-a)を求める', zh: '合并同类项求g(-a)' },
      blankIds: ['gma-simplify'],
      dependsOn: ['gma-square'],
    },
    {
      id: 'ga1-substitute',
      kicker: { ja: '今の問い｜(10) 代入', zh: '当前问题｜(10) 代入' },
      label: { ja: 'a-1を2か所とも括弧付きで代入する', zh: '两处都把a-1整体代入' },
      blankIds: ['ga1-substitute'],
      dependsOn: ['basis'],
      result: {
        blankId: 'ga1-substitute',
        label: { ja: '(10) 代入後の式', zh: '(10) 代入后的式子' },
      },
    },
    {
      id: 'ga1-expand',
      kicker: { ja: '今の問い｜(10) 展開', zh: '当前问题｜(10) 展开' },
      label: { ja: '(a-1)²を展開する', zh: '展开(a-1)²' },
      blankIds: ['ga1-expand'],
      dependsOn: ['ga1-substitute'],
      result: {
        blankId: 'ga1-expand',
        label: { ja: '(a-1)²の展開', zh: '(a-1)²的展开' },
      },
    },
    {
      id: 'ga1-simplify',
      kicker: { ja: '今の問い｜(10) 整理', zh: '当前问题｜(10) 整理' },
      label: { ja: '全体を整理してg(a-1)を求める', zh: '整理全式求g(a-1)' },
      blankIds: ['ga1-simplify'],
      dependsOn: ['ga1-expand'],
    },
  ],
  'math-practice-120': [
    {
      id: 'p1-formula',
      kicker: { ja: '今の問い｜(1) 面積公式', zh: '当前问题｜(1) 面积公式' },
      label: { ja: '三角形の面積公式を思い出す', zh: '回忆三角形面积公式' },
      blankIds: ['p1-formula'],
      result: {
        blankId: 'p1-formula',
        label: { ja: '三角形の面積公式', zh: '三角形面积公式' },
      },
    },
    {
      id: 'p1-model',
      kicker: { ja: '今の問い｜(1) 式を作る', zh: '当前问题｜(1) 建立式子' },
      label: { ja: '三角形の条件から関数式を作る', zh: '根据三角形条件建立函数式' },
      blankIds: ['p1-model'],
      dependsOn: ['p1-formula'],
      result: {
        blankId: 'p1-model',
        label: { ja: '(1) の関数式', zh: '(1) 的函数式' },
      },
    },
    {
      id: 'p1-domain-meaning',
      kicker: { ja: '今の問い｜(1) 変域の意味', zh: '当前问题｜(1) 定义域含义' },
      label: { ja: 'xが高さであることから0・負の値を考える', zh: '由x表示高度判断0和负数' },
      blankIds: ['p1-domain-meaning'],
      result: {
        blankId: 'p1-domain-meaning',
        label: { ja: 'xの意味と境界', zh: 'x的含义与边界' },
      },
    },
    {
      id: 'p1-domain',
      kicker: { ja: '今の問い｜(1) 変域', zh: '当前问题｜(1) 定义域' },
      label: { ja: '高さの条件を不等式にする', zh: '把高度条件写成不等式' },
      blankIds: ['p1-domain'],
      dependsOn: ['p1-domain-meaning'],
    },
    {
      id: 'p2-distance-rule',
      kicker: { ja: '今の問い｜(2) 距離の関係', zh: '当前问题｜(2) 路程关系' },
      label: { ja: '距離・速さ・時間の関係を使う', zh: '使用路程速度时间关系' },
      blankIds: ['p2-distance-rule'],
      result: {
        blankId: 'p2-distance-rule',
        label: { ja: '距離の関係', zh: '路程关系' },
      },
    },
    {
      id: 'p2-traveled',
      kicker: { ja: '今の問い｜(2) 進んだ距離', zh: '当前问题｜(2) 已走路程' },
      label: { ja: 'x時間で進む距離を求める', zh: '求x小时走过的路程' },
      blankIds: ['p2-traveled'],
      dependsOn: ['p2-distance-rule'],
      result: {
        blankId: 'p2-traveled',
        label: { ja: 'x時間で進む距離', zh: 'x小时走过的路程' },
      },
    },
    {
      id: 'p2-model',
      kicker: { ja: '今の問い｜(2) 残りを式にする', zh: '当前问题｜(2) 表示剩余路程' },
      label: { ja: '残りの道のりを関数式にする', zh: '把剩余路程写成函数式' },
      blankIds: ['p2-model'],
      dependsOn: ['p2-traveled'],
      result: {
        blankId: 'p2-model',
        label: { ja: '(2) の関数式', zh: '(2) 的函数式' },
      },
    },
    {
      id: 'p2-start',
      kicker: { ja: '今の問い｜(2) 始点', zh: '当前问题｜(2) 起点' },
      label: { ja: '歩き始めた瞬間のxを決める', zh: '确定刚开始时的x' },
      blankIds: ['p2-start'],
      result: {
        blankId: 'p2-start',
        label: { ja: '始点', zh: '起点' },
      },
    },
    {
      id: 'p2-end',
      kicker: { ja: '今の問い｜(2) 終点', zh: '当前问题｜(2) 终点' },
      label: { ja: '15kmを歩き終える時刻を求める', zh: '求走完15km的时刻' },
      blankIds: ['p2-end'],
      result: {
        blankId: 'p2-end',
        label: { ja: '終点', zh: '终点' },
      },
    },
    {
      id: 'p2-domain',
      kicker: { ja: '今の問い｜(2) 変域', zh: '当前问题｜(2) 定义域' },
      label: { ja: '始点と終点からxの変域を決める', zh: '由起点和终点确定x的范围' },
      blankIds: ['p2-domain'],
      dependsOn: ['p2-start', 'p2-end'],
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

export function mathPracticeExternalDependencies(questionId: string, targetId: string) {
  return mathPracticeTargetById(questionId, targetId)?.externalDependencies ?? []
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
    'math-practice-101',
    'math-practice-102',
    'math-practice-103',
    'math-practice-104',
    'math-practice-105',
    'math-practice-106',
    'math-practice-107',
    'math-practice-108',
    'math-practice-109',
    'math-practice-110',
    'math-practice-111',
    'math-practice-112',
    'math-practice-113',
    'math-practice-114',
    'math-practice-115',
    'math-practice-116',
    'math-practice-117',
    'math-practice-118',
    'math-practice-119',
    'math-practice-120',
  ].includes(questionId)
}

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
  'math-practice-101': [
    {
      id: 'basis',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: '条件の否定が表す範囲を確認する', zh: '确认条件的否定表示什么范围' },
      blankIds: ['rule'],
      result: {
        blankId: 'rule',
        label: { ja: '否定の基準', zh: '否定的标准' },
      },
    },
    {
      id: 's1',
      kicker: { ja: '今の問い｜(1)', zh: '当前问题｜(1)' },
      label: { ja: '境界を含めて不等号を否定する', zh: '连同边界一起否定不等式' },
      blankIds: ['p1-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's2',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      label: { ja: '「0ではない」の否定を考える', zh: '否定“不等于0”' },
      blankIds: ['p2-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's3',
      kicker: { ja: '今の問い｜(3)', zh: '当前问题｜(3)' },
      label: { ja: '実数の中で有理数の補集合を考える', zh: '在实数范围内找有理数的补集' },
      blankIds: ['p3-result'],
      dependsOn: ['basis'],
    },
  ],
  'math-practice-102': [
    {
      id: 'basis',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: '「かつ」「または」を集合演算へ直す', zh: '把“且”“或”改写为集合运算' },
      blankIds: ['rule'],
      result: {
        blankId: 'rule',
        label: { ja: '集合演算の対応', zh: '集合运算对应' },
      },
    },
    {
      id: 's1',
      kicker: { ja: '今の問い｜(1)', zh: '当前问题｜(1)' },
      label: { ja: '2区間の共通部分を求める', zh: '求两个区间的交集' },
      blankIds: ['p1-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's2',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      label: { ja: '2区間の和集合を求める', zh: '求两个区间的并集' },
      blankIds: ['p2-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's3',
      kicker: { ja: '今の問い｜(3)', zh: '当前问题｜(3)' },
      label: { ja: '共通部分の端点を判定する', zh: '判断交集的端点' },
      blankIds: ['p3-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's4',
      kicker: { ja: '今の問い｜(4)', zh: '当前问题｜(4)' },
      label: { ja: '和集合の端点を判定する', zh: '判断并集的端点' },
      blankIds: ['p4-result'],
      dependsOn: ['basis'],
    },
  ],
  'math-practice-103': [
    {
      id: 'basis',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: '複合条件が失敗する意味から否定規則を作る', zh: '从复合条件如何失败来建立否定规则' },
      blankIds: ['rule'],
      result: {
        blankId: 'rule',
        label: { ja: '複合条件の否定', zh: '复合条件的否定' },
      },
    },
    {
      id: 's1',
      kicker: { ja: '今の問い｜(1)', zh: '当前问题｜(1)' },
      label: { ja: '「かつ」の条件を否定する', zh: '否定“且”条件' },
      blankIds: ['p1-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's2',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      label: { ja: '「または」の条件を否定する', zh: '否定“或”条件' },
      blankIds: ['p2-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's3',
      kicker: { ja: '今の問い｜(3)', zh: '当前问题｜(3)' },
      label: { ja: '連続不等式を分解して否定する', zh: '拆分连续不等式后再否定' },
      blankIds: ['p3-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's4',
      kicker: { ja: '今の問い｜(4)', zh: '当前问题｜(4)' },
      label: { ja: '数の性質を2つとも否定する', zh: '同时否定两个数的性质' },
      blankIds: ['p4-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's5',
      kicker: { ja: '今の問い｜(5)', zh: '当前问题｜(5)' },
      label: { ja: '「少なくとも一方」の否定を考える', zh: '否定“至少一个”' },
      blankIds: ['p5-result'],
      dependsOn: ['basis'],
    },
  ],
  'math-practice-104': [
    {
      id: 'basis',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: '必要条件・十分条件を含意の向きへ直す', zh: '把必要条件与充分条件对应到蕴含方向' },
      blankIds: ['rule'],
      result: {
        blankId: 'rule',
        label: { ja: '双方向判定表', zh: '双向判断表' },
      },
    },
    {
      id: 's1',
      kicker: { ja: '今の問い｜(1)', zh: '当前问题｜(1)' },
      label: { ja: '代入と方程式の全解で2方向を判定する', zh: '用代入和方程全部解判断两个方向' },
      blankIds: ['p1-classification'],
      dependsOn: ['basis'],
    },
    {
      id: 's2',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      label: { ja: '逆向きの真と正向きの反例を分ける', zh: '区分反向成立与正向反例' },
      blankIds: ['p2-classification'],
      dependsOn: ['basis'],
    },
    {
      id: 's3',
      kicker: { ja: '今の問い｜(3)', zh: '当前问题｜(3)' },
      label: { ja: '両方向に反例があるかを確認する', zh: '检查两个方向是否都有反例' },
      blankIds: ['p3-classification'],
      dependsOn: ['basis'],
    },
    {
      id: 's4',
      kicker: { ja: '今の問い｜(4)', zh: '当前问题｜(4)' },
      label: { ja: '互いに導ける条件かを確認する', zh: '检查两个条件能否互相推出' },
      blankIds: ['p4-classification'],
      dependsOn: ['basis'],
    },
    {
      id: 's5',
      kicker: { ja: '今の問い｜(5)', zh: '当前问题｜(5)' },
      label: { ja: '連立条件を逆向きに解いて確かめる', zh: '反向解联立条件进行确认' },
      blankIds: ['p5-classification'],
      dependsOn: ['basis'],
    },
    {
      id: 's6',
      kicker: { ja: '今の問い｜(6)', zh: '当前问题｜(6)' },
      label: { ja: '図形の包含関係から2方向を判定する', zh: '由图形包含关系判断两个方向' },
      blankIds: ['p6-classification'],
      dependsOn: ['basis'],
    },
  ],
  'math-practice-105': [
    {
      id: 'basis',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: '真と偽で必要な証明の違いを確認する', zh: '区分证明真与证明假分别需要什么' },
      blankIds: ['rule'],
      result: {
        blankId: 'rule',
        label: { ja: '真偽判定の基準', zh: '真假判断标准' },
      },
    },
    {
      id: 's1',
      kicker: { ja: '今の問い｜(1)', zh: '当前问题｜(1)' },
      label: { ja: '「少なくとも一方が0」の反例を作る', zh: '由“至少一个为0”构造反例' },
      blankIds: ['p1-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's2',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      label: { ja: '±2 の全ケースを確認する', zh: '检查 ±2 的全部情况' },
      blankIds: ['p2-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's3',
      kicker: { ja: '今の問い｜(3)', zh: '当前问题｜(3)' },
      label: { ja: '無理数どうしの積で反例を探す', zh: '用两个无理数的乘积寻找反例' },
      blankIds: ['p3-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's4',
      kicker: { ja: '今の問い｜(4)', zh: '当前问题｜(4)' },
      label: { ja: '和と積を同時に満たす反例を作る', zh: '构造和与积同时满足条件的反例' },
      blankIds: ['p4-result'],
      dependsOn: ['basis'],
    },
  ],
  'math-practice-106': [
    {
      id: 'basis',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: '日本語条件を集合演算へ直す', zh: '把语言条件翻译成集合运算' },
      blankIds: ['rule'],
      result: {
        blankId: 'rule',
        label: { ja: '集合表現の規則', zh: '集合表达规则' },
      },
    },
    {
      id: 's1',
      kicker: { ja: '今の問い｜(1)', zh: '当前问题｜(1)' },
      label: { ja: '6の倍数を2つの倍数条件へ分ける', zh: '把6的倍数拆成两个倍数条件' },
      blankIds: ['p1-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's2',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      label: { ja: '奇数を2の倍数の補集合として表す', zh: '把奇数表示为2的倍数的补集' },
      blankIds: ['p2-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's3',
      kicker: { ja: '今の問い｜(3)', zh: '当前问题｜(3)' },
      label: { ja: '3の倍数と奇数を同時に満たす', zh: '同时满足3的倍数与奇数' },
      blankIds: ['p3-result'],
      dependsOn: ['basis'],
    },
    {
      id: 's4',
      kicker: { ja: '今の問い｜(4)', zh: '当前问题｜(4)' },
      label: { ja: '2つの否定条件を補集合で組み立てる', zh: '用两个补集组合否定条件' },
      blankIds: ['p4-result'],
      dependsOn: ['basis'],
    },
  ],
  'math-practice-107': [
    {
      id: 'basis',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: '必要・十分を双方向含意で判定する', zh: '用双向蕴含判断必要与充分' },
      blankIds: ['rule'],
      result: {
        blankId: 'rule',
        label: { ja: '双方向判定表', zh: '双向判断表' },
      },
    },
    {
      id: 's1',
      kicker: { ja: '今の問い｜(1)', zh: '当前问题｜(1)' },
      label: { ja: '積が0の条件を一方向ずつ調べる', zh: '逐方向判断乘积为0的条件' },
      blankIds: ['p1-classification'],
      dependsOn: ['basis'],
    },
    {
      id: 's2',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      label: { ja: '積が負になる符号パターンを全部見る', zh: '列出乘积为负的全部符号情况' },
      blankIds: ['p2-classification'],
      dependsOn: ['basis'],
    },
    {
      id: 's3',
      kicker: { ja: '今の問い｜(3)', zh: '当前问题｜(3)' },
      label: { ja: '2条件を同時に使って逆向きを示す', zh: '同时使用两个条件证明反向' },
      blankIds: ['p3-classification'],
      dependsOn: ['basis'],
    },
    {
      id: 's4',
      kicker: { ja: '今の問い｜(4)', zh: '当前问题｜(4)' },
      label: { ja: '1つの角と三角形全体を区別する', zh: '区分一个角与整个三角形' },
      blankIds: ['p4-classification'],
      dependsOn: ['basis'],
    },
    {
      id: 's5',
      kicker: { ja: '今の問い｜(5)', zh: '当前问题｜(5)' },
      label: { ja: '積の2枝と直角位置を分けて調べる', zh: '区分乘积两支与直角位置' },
      blankIds: ['p5-classification'],
      dependsOn: ['basis'],
    },
  ],
  'math-practice-108': [
    {
      id: 'basis',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: '同値の証明を2方向へ分ける', zh: '把等价证明分成两个方向' },
      blankIds: ['rule'],
      result: {
        blankId: 'rule',
        label: { ja: '同値の証明方針', zh: '等价证明方针' },
      },
    },
    {
      id: 'forward',
      kicker: { ja: '一方向目', zh: '第一个方向' },
      label: { ja: 'p から q の2条件を示す', zh: '由 p 推出 q 的两个条件' },
      blankIds: ['forward'],
      dependsOn: ['basis'],
      result: {
        blankId: 'forward',
        label: { ja: '一方向目', zh: '第一个方向' },
      },
    },
    {
      id: 'reverse',
      kicker: { ja: '二方向目', zh: '第二个方向' },
      label: { ja: '積の符号を分け、和条件で片方を除く', zh: '由乘积符号分类，再用和条件排除一支' },
      blankIds: ['reverse-sign', 'reverse-eliminate'],
      dependsOn: ['basis'],
      result: {
        blankId: 'reverse-eliminate',
        label: { ja: '二方向目', zh: '第二个方向' },
      },
    },
    {
      id: 'conclude',
      kicker: { ja: '結論', zh: '结论' },
      label: { ja: '2方向を合わせて同値を結論する', zh: '合并两个方向得到等价结论' },
      blankIds: ['equivalence'],
      dependsOn: ['forward', 'reverse'],
      resultLinkLabel: { ja: '示した2方向', zh: '已证明的两个方向' },
    },
  ],
  'math-practice-109': [
    {
      id: 'basis',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: '「すべて」「ある」を否定する規則を確認する', zh: '确认否定“所有”“存在”的规则' },
      blankIds: ['rule'],
      result: {
        blankId: 'rule',
        label: { ja: '量化命題の否定規則', zh: '量化命题否定规则' },
      },
    },
    {
      id: 's1',
      kicker: { ja: '今の問い｜(1)', zh: '当前问题｜(1)' },
      label: { ja: '全称命題を否定し、反例で真偽を決める', zh: '否定全称命题并用反例判断真假' },
      blankIds: ['p1-negation', 'p1-truth'],
      dependsOn: ['basis'],
    },
    {
      id: 's2',
      kicker: { ja: '今の問い｜(2)', zh: '当前问题｜(2)' },
      label: { ja: '存在命題を否定し、候補を解いて真偽を決める', zh: '否定存在命题并通过求解候选值判断真假' },
      blankIds: ['p2-negation', 'p2-solve', 'p2-truth'],
      dependsOn: ['basis'],
    },
  ],
  'math-practice-110': [
    {
      id: 'basis',
      kicker: { ja: 'まず確認', zh: '先确认' },
      label: { ja: '逆・対偶・裏の形を整理する', zh: '整理逆命题、逆否命题与否命题的形式' },
      blankIds: ['rule'],
      result: {
        blankId: 'rule',
        label: { ja: '逆・対偶・裏の形', zh: '三种相关命题的形式' },
      },
    },

    {
      id: 'p1-original',
      kicker: { ja: '今の問い｜(1) 元命題', zh: '当前问题｜(1) 原命题' },
      label: { ja: '9の倍数から3の倍数を直接示す', zh: '由9的倍数直接推出3的倍数' },
      blankIds: ['p1-original'],
      dependsOn: ['basis'],
      result: { blankId: 'p1-original', label: { ja: '元命題', zh: '原命题' } },
    },
    {
      id: 'p1-converse',
      kicker: { ja: '今の問い｜(1) 逆', zh: '当前问题｜(1) 逆命题' },
      label: { ja: '向きを反転し、反例を探す', zh: '反转方向并寻找反例' },
      blankIds: ['p1-converse'],
      dependsOn: ['basis'],
      result: { blankId: 'p1-converse', label: { ja: '逆', zh: '逆命题' } },
    },
    {
      id: 'p1-contrapositive',
      kicker: { ja: '今の問い｜(1) 対偶', zh: '当前问题｜(1) 逆否命题' },
      label: { ja: '両方を否定して向きを反転する', zh: '否定两边并反转方向' },
      blankIds: ['p1-contrapositive'],
      dependsOn: ['basis'],
      result: { blankId: 'p1-contrapositive', label: { ja: '対偶', zh: '逆否命题' } },
    },
    {
      id: 'p1-inverse',
      kicker: { ja: '今の問い｜(1) 裏', zh: '当前问题｜(1) 否命题' },
      label: { ja: '向きを保って両方を否定する', zh: '保持方向并否定两边' },
      blankIds: ['p1-inverse'],
      dependsOn: ['basis'],
      result: { blankId: 'p1-inverse', label: { ja: '裏', zh: '否命题' } },
    },
    {
      id: 'p1-summary',
      kicker: { ja: '今の問い｜(1) まとめ', zh: '当前问题｜(1) 汇总' },
      label: { ja: '4つの真偽を1つの表にまとめる', zh: '汇总四个命题的真假' },
      blankIds: ['p1-summary'],
      dependsOn: ['p1-original', 'p1-converse', 'p1-contrapositive', 'p1-inverse'],
      resultLinkLabel: { ja: '(1)で確認した4命題', zh: '(1) 已确认的四个命题' },
    },

    {
      id: 'p2-original',
      kicker: { ja: '今の問い｜(2) 元命題', zh: '当前问题｜(2) 原命题' },
      label: { ja: '因数分解から反例を探す', zh: '由因式分解寻找反例' },
      blankIds: ['p2-original'],
      dependsOn: ['basis'],
      result: { blankId: 'p2-original', label: { ja: '元命題', zh: '原命题' } },
    },
    {
      id: 'p2-converse',
      kicker: { ja: '今の問い｜(2) 逆', zh: '当前问题｜(2) 逆命题' },
      label: { ja: '多項式が0でない条件からx≠2を確かめる', zh: '由多项式不为0判断x≠2' },
      blankIds: ['p2-converse'],
      dependsOn: ['basis'],
      result: { blankId: 'p2-converse', label: { ja: '逆', zh: '逆命题' } },
    },
    {
      id: 'p2-contrapositive',
      kicker: { ja: '今の問い｜(2) 対偶', zh: '当前问题｜(2) 逆否命题' },
      label: { ja: '0になる2つの根を使って判定する', zh: '利用使多项式为0的两个根判断' },
      blankIds: ['p2-contrapositive'],
      dependsOn: ['basis'],
      result: { blankId: 'p2-contrapositive', label: { ja: '対偶', zh: '逆否命题' } },
    },
    {
      id: 'p2-inverse',
      kicker: { ja: '今の問い｜(2) 裏', zh: '当前问题｜(2) 否命题' },
      label: { ja: 'x=2を代入して判定する', zh: '代入x=2进行判断' },
      blankIds: ['p2-inverse'],
      dependsOn: ['basis'],
      result: { blankId: 'p2-inverse', label: { ja: '裏', zh: '否命题' } },
    },
    {
      id: 'p2-summary',
      kicker: { ja: '今の問い｜(2) まとめ', zh: '当前问题｜(2) 汇总' },
      label: { ja: '4つの真偽をまとめる', zh: '汇总四个命题的真假' },
      blankIds: ['p2-summary'],
      dependsOn: ['p2-original', 'p2-converse', 'p2-contrapositive', 'p2-inverse'],
      resultLinkLabel: { ja: '(2)で確認した4命題', zh: '(2) 已确认的四个命题' },
    },

    {
      id: 'p3-original',
      kicker: { ja: '今の問い｜(3) 元命題', zh: '当前问题｜(3) 原命题' },
      label: { ja: '積が0になる条件を読む', zh: '读取乘积为0的条件' },
      blankIds: ['p3-original'],
      dependsOn: ['basis'],
      result: { blankId: 'p3-original', label: { ja: '元命題', zh: '原命题' } },
    },
    {
      id: 'p3-converse',
      kicker: { ja: '今の問い｜(3) 逆', zh: '当前问题｜(3) 逆命题' },
      label: { ja: 'x=0,1を式へ戻して確かめる', zh: '把x=0,1代回原式检查' },
      blankIds: ['p3-converse'],
      dependsOn: ['basis'],
      result: { blankId: 'p3-converse', label: { ja: '逆', zh: '逆命题' } },
    },
    {
      id: 'p3-contrapositive',
      kicker: { ja: '今の問い｜(3) 対偶', zh: '当前问题｜(3) 逆否命题' },
      label: { ja: '「または」の否定を「かつ」に直す', zh: '把“或”的否定改写为“且”' },
      blankIds: ['p3-contrapositive'],
      dependsOn: ['basis'],
      result: { blankId: 'p3-contrapositive', label: { ja: '対偶', zh: '逆否命题' } },
    },
    {
      id: 'p3-inverse',
      kicker: { ja: '今の問い｜(3) 裏', zh: '当前问题｜(3) 否命题' },
      label: { ja: '式が0でないときのxを読む', zh: '由式子不为0判断x的取值' },
      blankIds: ['p3-inverse'],
      dependsOn: ['basis'],
      result: { blankId: 'p3-inverse', label: { ja: '裏', zh: '否命题' } },
    },
    {
      id: 'p3-summary',
      kicker: { ja: '今の問い｜(3) まとめ', zh: '当前问题｜(3) 汇总' },
      label: { ja: '4つの真偽をまとめる', zh: '汇总四个命题的真假' },
      blankIds: ['p3-summary'],
      dependsOn: ['p3-original', 'p3-converse', 'p3-contrapositive', 'p3-inverse'],
      resultLinkLabel: { ja: '(3)で確認した4命題', zh: '(3) 已确认的四个命题' },
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
      label: { ja: '奇数を2k+1の形に直す', zh: '把奇数写成2k+1' },
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
  ].includes(questionId)
}

import { validateTextbookUnits } from '../../../../domain/textbookSchema'
import { T, M, C, K, reviewItem as item, oneToOneSourceMap } from './reviewLessonHelpers'

// W-MATH-003 / approved N10 proof and rationalization copy, pp.24–26.
// Preserves source assumptions a>0, b>0. 21 independently solved prompts;
// separate publisher answer booklet was not supplied. Review only.
export const n10SourceToItemIds = oneToOneSourceMap('N10', 21)

const rawN10 = {
  schemaVersion: '1.1' as const,
  unitId: 'math-numbers-expressions-n10',
  revision: 1, status: 'review' as const, subject: 'math-1a' as const,
  chapter: {
    chapterId: 'math-ch01-numbers-expressions', chapterNumber: '1',
    chapterTitle: '数と式', unitCode: '1NUM', orderInChapter: 10,
    sourcePages: [24, 25, 26],
  },
  title: '平方根の証明と有理化',
  subtitle: '二乗と符号を確かめ、分数の値を保ったまま根号を扱う。',
  source: {
    type: 'reference' as const,
    label: 'ユーザー提供「数と式」教科書モード対話段階導入版 v2 / N10',
    rightsNote: '教師編集WordのN10原問21件を照合したレビュー用新規学習本文。元の解答別冊未提供・独立数学監査。出版社ガイドの再配布許諾は確認されていない。',
  },
  objectives: [
    '平方根の積・商の性質を、二乗と符号の両方から確かめる',
    '根号の積と和を区別して式を計算する',
    '等価な分数操作と共役を使って分母を有理化する',
  ],
  sections: [{
    id: 'lesson', number: '10', title: '本文', role: 'concept' as const,
    description: '根号を変形する根拠を証明し、有理化へ応用する。',
    figures: [],
    readingFlow: [
      { id: 'heading-roots', type: 'heading' as const, text: '根号を簡単にするとき、何を確かめるか' },
      { id: 'marker-root-example', type: 'marker' as const, kind: 'example' as const, text: '例題' },
      { id: 'paragraph-root-example', type: 'paragraph' as const, parts: [
        M('\\sqrt{125}'), T(' を根号の中の数が小さくなる形に直そう。'),
        M('125=25\\cdot5'), T(' である。'), M('t>0'), T(' として、'),
        M('t\\sqrt5'), T(' という形を考える。もし '), M('\\sqrt{125}=t\\sqrt5'),
        T(' なら、両辺を2乗した値は一致するはずだ。'),
      ] },
      { id: 'formula-n10-01', type: 'formula' as const, parts: [
        M('(t\\sqrt5)^2=5t^2=125\\quad\\Longrightarrow\\quad'), C('n10-01'),
      ] },
      { id: 'paragraph-root-sign', type: 'paragraph' as const, parts: [
        T('この等式から '), M('t'), T(' を一つに決めるには、'), M('t>0'),
        T(' の条件も使う。すると、'),
      ] },
      { id: 'formula-n10-02', type: 'formula' as const, parts: [M('\\sqrt{125}='), C('n10-02')] },
      { id: 'paragraph-root-after', type: 'paragraph' as const, parts: [
        T('「2乗すると125になる」だけでなく、「正である」ことも確かめた。正の数の平方根を一つに決めるために、この二つの条件が必要になる。'),
      ] },

      { id: 'marker-root-proof', type: 'marker' as const, kind: 'proof' as const, text: '証明' },
      { id: 'paragraph-proof-product', type: 'paragraph' as const, parts: [
        M('a>0,\\ b>0'), T(' とする。'), M('\\sqrt a\\sqrt b'),
        T(' と '), M('\\sqrt{ab}'),
        T(' の関係を、平方根の意味から調べよう。まず積の2乗は、'),
      ] },
      { id: 'formula-n10-03', type: 'formula' as const, parts: [
        M('(\\sqrt a\\sqrt b)^2=(\\sqrt a)^2(\\sqrt b)^2='), C('n10-03'),
      ] },
      { id: 'paragraph-proof-product-sign', type: 'paragraph' as const, parts: [
        T('しかし2乗の値が同じだけでは、正負どちらかを区別できない。'),
        M('\\sqrt a'), T(' と '), M('\\sqrt b'),
        T(' はそれぞれ正なので、その積も正である。これで'),
      ] },
      { id: 'formula-n10-04', type: 'formula' as const, parts: [M('\\sqrt a\\sqrt b='), C('n10-04')] },
      { id: 'paragraph-proof-quotient', type: 'paragraph' as const, parts: [
        T('続いて、商 '), M('\\frac{\\sqrt a}{\\sqrt b}'),
        T(' を調べよう。'), M('b>0'), T(' だから '), M('\\sqrt b\\ne0'),
        T(' であり、商が定義できる。2乗して、'),
      ] },
      { id: 'formula-n10-05', type: 'formula' as const, parts: [
        M('\\left(\\frac{\\sqrt a}{\\sqrt b}\\right)^2=\\frac{(\\sqrt a)^2}{(\\sqrt b)^2}='), C('n10-05'),
      ] },
      { id: 'paragraph-proof-quotient-sign', type: 'paragraph' as const, parts: [
        T('商も正であることを合わせると、'),
      ] },
      { id: 'formula-n10-06', type: 'formula' as const, parts: [
        M('\\frac{\\sqrt a}{\\sqrt b}='), C('n10-06'), M('\\qquad(a>0,\\ b>0)'),
      ] },
      { id: 'paragraph-proof-after', type: 'paragraph' as const, parts: [
        T('ここまでが'), K('証明'), T('である。どちらも「候補の2乗」と「候補の符号」を確認してから結論を出した。次の例題ではこの関係を道具として使う。'),
      ] },
      { id: 'marker-root-check', type: 'marker' as const, kind: 'check' as const, text: '確認' },
      { id: 'paragraph-product-check', type: 'paragraph' as const, parts: [
        M('\\sqrt6\\sqrt8'), T(' を簡単にしよう。まず一つの根号にして、根号の内側から平方数を見つけると、'),
      ] },
      { id: 'formula-n10-07', type: 'formula' as const, derivationId: 'root-product', parts: [M('\\sqrt6\\sqrt8='), C('n10-07')] },
      { id: 'formula-n10-08', type: 'formula' as const, derivationId: 'root-product', parts: [M('='), C('n10-08')] },
      { id: 'marker-sum-example', type: 'marker' as const, kind: 'example' as const, text: '例題' },
      { id: 'paragraph-sum-intro', type: 'paragraph' as const, parts: [
        M('\\sqrt8+\\sqrt{50}'), T(' を考えよう。いま扱っているのは積ではなく'),
        K('和'), T('である。積の法則をそのまま足し算へ移さず、それぞれの項を簡単にしてみよう。'),
      ] },
      { id: 'formula-n10-09', type: 'formula' as const, derivationId: 'root-sum', parts: [M('\\sqrt8+\\sqrt{50}='), C('n10-09')] },
      { id: 'formula-n10-10', type: 'formula' as const, derivationId: 'root-sum', parts: [M('='), C('n10-10')] },
      { id: 'paragraph-sum-after', type: 'paragraph' as const, parts: [
        T('同じ根号の部分が残れば、以前に学んだ同類項のように数の係数を足せる。'),
      ] },
      { id: 'marker-formula-check', type: 'marker' as const, kind: 'check' as const, text: '確認' },
      { id: 'paragraph-square-intro', type: 'paragraph' as const, parts: [
        T('乗法公式も、根号を含む数に使える。'), M('(\\sqrt2-\\sqrt3)^2'),
        T(' をまず平方の公式で展開すると、'),
      ] },
      { id: 'formula-n10-11', type: 'formula' as const, derivationId: 'root-square', parts: [M('(\\sqrt2-\\sqrt3)^2='), C('n10-11')] },
      { id: 'formula-n10-12', type: 'formula' as const, derivationId: 'root-square', parts: [M('='), C('n10-12')] },
      { id: 'paragraph-difference-squares', type: 'paragraph' as const, parts: [
        T('さらに '), M('(\\sqrt7+\\sqrt2)(\\sqrt7-\\sqrt2)'),
        T(' では、和と差の積に注目しよう。'),
      ] },
      { id: 'formula-n10-13', type: 'formula' as const, parts: [
        M('(\\sqrt7+\\sqrt2)(\\sqrt7-\\sqrt2)='), C('n10-13'),
      ] },
      { id: 'paragraph-difference-after', type: 'paragraph' as const, parts: [
        T('二つの数の和と差を掛け合わせると、真ん中の交差する項が打ち消し合う。この仕組みを次の分数に利用する。'),
      ] },

      { id: 'heading-rationalize', type: 'heading' as const, text: '分数の値を保って、分母の根号をなくす' },
      { id: 'marker-rationalize-example', type: 'marker' as const, kind: 'example' as const, text: '例題' },
      { id: 'paragraph-rationalize-intro', type: 'paragraph' as const, parts: [
        M('\\dfrac1{2\\sqrt3}'), T(' の分母から根号をなくしたい。ただし分母だけを書き換えると元の分数とは異なる値になってしまう。'),
        T('分母を変える前に、分子と分母の比を保つ操作を確認しよう。それは '),
        C('n10-14'), T('。'),
      ] },
      { id: 'paragraph-rationalize-multiplier', type: 'paragraph' as const, parts: [
        T('分母の '), M('\\sqrt3'), T(' と掛けて平方数を作る因子を選ぼう。'),
      ] },
      { id: 'formula-n10-15', type: 'formula' as const, derivationId: 'root-rationalize-one', parts: [M('\\frac1{2\\sqrt3}='), C('n10-15')] },
      { id: 'formula-n10-16', type: 'formula' as const, derivationId: 'root-rationalize-one', parts: [M('='), C('n10-16')] },
      { id: 'paragraph-rationalize-concept', type: 'paragraph' as const, parts: [
        T('このように分数の値を変えずに分母の根号をなくすことを、'),
        K('分母を有理化する'), T('という。'),
      ] },
      { id: 'marker-conjugate-example', type: 'marker' as const, kind: 'example' as const, text: '例題' },
      { id: 'paragraph-conjugate-intro', type: 'paragraph' as const, parts: [
        T('次は '), M('\\dfrac{\\sqrt3}{\\sqrt3+\\sqrt2}'),
        T(' である。分母が和の形なので、ただ '), M('\\sqrt3'),
        T(' を掛けても根号が一つ残る。直前の「和と差の積」の性質を思い出そう。'),
      ] },
      { id: 'formula-n10-17', type: 'formula' as const, parts: [
        M('\\frac{\\sqrt3}{\\sqrt3+\\sqrt2}='), C('n10-17'),
      ] },
      { id: 'paragraph-conjugate-denominator', type: 'paragraph' as const, parts: [T('分母は')] },
      { id: 'formula-n10-18', type: 'formula' as const, parts: [
        M('(\\sqrt3+\\sqrt2)(\\sqrt3-\\sqrt2)='), C('n10-18'),
      ] },
      { id: 'paragraph-conjugate-result', type: 'paragraph' as const, parts: [
        T('分子も展開して分数全体を完成させると、'),
      ] },
      { id: 'formula-n10-19', type: 'formula' as const, parts: [M('='), C('n10-19')] },
      { id: 'paragraph-conjugate-after', type: 'paragraph' as const, parts: [
        T('ここでも掛けた '), M('\\sqrt3-\\sqrt2'),
        T(' は0でないので、分数の値は確かに保たれている。'),
      ] },
      { id: 'marker-rationalize-check', type: 'marker' as const, kind: 'check' as const, text: '確認' },
      { id: 'paragraph-rationalize-transfer', type: 'paragraph' as const, parts: [
        M('\\dfrac{2-\\sqrt3}{2+\\sqrt3}'), T(' は自分で有理化しよう。使う因子を選び、掛けた直後の式を作る。'),
      ] },
      { id: 'formula-n10-20', type: 'formula' as const, derivationId: 'root-rationalize-transfer', parts: [
        M('\\frac{2-\\sqrt3}{2+\\sqrt3}='), C('n10-20'),
      ] },
      { id: 'formula-n10-21', type: 'formula' as const, derivationId: 'root-rationalize-transfer', parts: [M('='), C('n10-21')] },
      { id: 'paragraph-rationalize-final', type: 'paragraph' as const, parts: [
        T('同じ操作でも、今度は分子の平方を最後まで計算する必要がある。根号の計算も、これまでの積・商、乗法公式、正負条件を組み合わせて成り立っている。'),
      ] },
    ],
    items: [
      item('n10-01', '2乗後の等式をtについて整理しよう。', 't^2=25', 'formula',
        ['t=25', 't^2=125', 't^2=5'], 'causal-reasoning', 'strong', ['5t²=125の両辺を5で割る。']),
      item('n10-02', 'tの正の条件も使って√125を表そう。', '5\\sqrt5', 'formula',
        ['-5\\sqrt5', '25\\sqrt5', '5\\sqrt{25}'], 'concept-formation', 'strong', ['t²の値だけでは正負が決まらない。']),
      item('n10-03', '積の2乗を計算しよう。', 'ab', 'formula',
        ['a+b', '\\sqrt{ab}', 'a^2b^2'], 'representation-link', 'strong', ['それぞれの正の平方根を2乗する。']),
      item('n10-04', '2乗と正であることの両方から積を特定しよう。', '\\sqrt{ab}', 'formula',
        ['-\\sqrt{ab}', 'ab', '\\sqrt a+\\sqrt b'], 'causal-reasoning', 'medium', ['2乗の値に加え、元の積の符号も確かめる。']),
      item('n10-05', '分母が0でないことを確かめ、商を2乗しよう。', '\\frac ab', 'formula',
        ['\\frac ba', '\\sqrt{\\frac ab}', 'ab'], 'representation-link', 'medium', ['各根号を2乗し、分子と分母を分けて計算する。']),
      item('n10-06', '正の商に対応する平方根を選ぼう。', '\\sqrt{\\frac ab}', 'formula',
        ['-\\sqrt{\\frac ab}', '\\frac ab', '\\sqrt a\\sqrt b'], 'causal-reasoning', 'medium', ['分子も分母も正の数の平方根である。']),
      item('n10-07', '一つの根号にまとめ、平方数を探そう。', '\\sqrt{48}=\\sqrt{16\\cdot3}', 'formula',
        ['\\sqrt{14}', '\\sqrt{48}=\\sqrt{8\\cdot8}', '\\sqrt{48}=\\sqrt{16\\cdot2}'], 'representation-link', 'medium', ['平方数である16を因子として取り出す。']),
      item('n10-08', '根号の外に平方数の根を出そう。', '4\\sqrt3', 'formula',
        ['16\\sqrt3', '4\\sqrt{12}', '8\\sqrt3'], 'transfer', 'medium', ['16の正の平方根は4になる。']),
      item('n10-09', '和の各項を別々に簡単にしよう。', '2\\sqrt2+5\\sqrt2', 'formula',
        ['\\sqrt{58}', '2\\sqrt2+25\\sqrt2', '2\\sqrt2+5\\sqrt{10}'], 'representation-link', 'medium', ['積の法則を和にそのまま適用してはいけない。']),
      item('n10-10', '同じ√2の係数をまとめよう。', '7\\sqrt2', 'formula',
        ['7\\sqrt4', '7\\sqrt{2+2}', '3\\sqrt2'], 'transfer', 'medium', ['同じ根号が残るとき、係数だけを足す。']),
      item('n10-11', '平方公式の中項まで全て展開しよう。', '2-2\\sqrt2\\sqrt3+3', 'formula',
        ['2+2\\sqrt2\\sqrt3+3', '2-\\sqrt2\\sqrt3+3', '2-2\\sqrt2\\sqrt3+9'], 'representation-link', 'medium', ['(A−B)²の中項は−2ABとなる。']),
      item('n10-12', '根号を掛け、定数を整理しよう。', '5-2\\sqrt6', 'formula',
        ['5+2\\sqrt6', '5-\\sqrt6', '6-2\\sqrt6'], 'transfer', 'light', ['2と3の和、√2と√3の積を別々に処理する。']),
      item('n10-13', '和と差の積を計算しよう。', '7-2=5', 'formula',
        ['7+2=9', '7-\\sqrt{14}', '7-4=3'], 'transfer', 'light', ['(A+B)(A−B)では交差する項が消える。']),
      item('n10-14', '分数の値を保つ操作を選ぼう。', '0でない同じ数を分子・分母の両方に掛ける', 'text',
        ['分母だけに同じ数を掛ける', '分子だけに平方根を足す', '分母から根号をそのまま消す'],
        'concept-formation', 'medium', ['分子・分母の比が変わらない操作を考える。']),
      item('n10-15', '√3を使って値を変えずに有理化しよう。', '\\frac1{2\\sqrt3}\\cdot\\frac{\\sqrt3}{\\sqrt3}=\\frac{\\sqrt3}{2(\\sqrt3)^2}', 'formula',
        ['\\frac1{2\\sqrt3}\\cdot\\sqrt3', '\\frac1{2\\sqrt3}\\cdot\\frac3{\\sqrt3}', '\\frac1{2\\sqrt3}\\cdot\\frac{\\sqrt2}{\\sqrt2}'],
        'representation-link', 'medium', ['分母の√3と掛けて整数になる同じ因子を両方へ掛ける。']),
      item('n10-16', '分母の(√3)²を数に直そう。', '\\frac{\\sqrt3}{6}', 'formula',
        ['\\frac{\\sqrt3}{2}', '\\frac3{6}', '\\frac1{6\\sqrt3}'], 'transfer', 'medium', ['(√3)²は3なので分母全体はどうなる？']),
      item('n10-17', '和の分母を和差の積にする因子を選ぼう。', '\\frac{\\sqrt3}{\\sqrt3+\\sqrt2}\\cdot\\frac{\\sqrt3-\\sqrt2}{\\sqrt3-\\sqrt2}', 'formula',
        ['\\frac{\\sqrt3}{\\sqrt3+\\sqrt2}\\cdot\\frac{\\sqrt3+\\sqrt2}{\\sqrt3+\\sqrt2}', '\\frac{\\sqrt3}{\\sqrt3+\\sqrt2}\\cdot\\frac{\\sqrt3}{\\sqrt3}', '\\frac{\\sqrt3}{\\sqrt3+\\sqrt2}\\cdot\\frac{\\sqrt2}{\\sqrt2}'],
        'representation-link', 'light', ['分母が(A+B)なら(A−B)を掛けると平方差になる。']),
      item('n10-18', '共役を掛けた分母の値を選ぼう。', '3-2=1', 'formula',
        ['3+2=5', '3-\\sqrt6', '\\sqrt3-\\sqrt2'], 'transfer', 'light', ['積の中項は消え、二つの平方だけが残る。']),
      item('n10-19', '分子にも因子を掛け、最後まで整理しよう。', '3-\\sqrt6', 'formula',
        ['3+\\sqrt6', '1-\\sqrt6', '3-2\\sqrt6'], 'transfer', 'light', ['分子の√3を括弧内の両項に掛ける。']),
      item('n10-20', '共役因子を選び、掛けた直後の分数を作ろう。', '\\frac{(2-\\sqrt3)^2}{(2+\\sqrt3)(2-\\sqrt3)}=\\frac{(2-\\sqrt3)^2}{4-3}', 'formula',
        ['\\frac{(2-\\sqrt3)^2}{(2+\\sqrt3)^2}', '\\frac{2-\\sqrt3}{2+\\sqrt3}\\cdot\\frac{2+\\sqrt3}{2+\\sqrt3}', '\\frac{(2-\\sqrt3)^2}{4+3}'],
        'transfer', 'light', ['分母の和に対して差を掛け、分子にも同じ差を掛ける。']),
      item('n10-21', '分子の平方を計算して最終結果を選ぼう。', '7-4\\sqrt3', 'formula',
        ['7+4\\sqrt3', '7-2\\sqrt3', '1-4\\sqrt3'], 'transfer', 'light', ['平方公式の中項−2ABも忘れず計算する。']),
    ],
  }],
}

export const mathNumbersN10Unit = validateTextbookUnits([rawN10])[0]

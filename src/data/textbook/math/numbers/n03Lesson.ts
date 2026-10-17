import { validateTextbookUnits } from '../../../../domain/textbookSchema'
import { T, M, C, K, reviewItem as item, oneToOneSourceMap } from './reviewLessonHelpers'

// W-MATH-003 / approved N03 learner copy. Original Word N03 Q1–Q13, pp.6–7.
// Figure N03-F01 is the unchanged original image1.png. Independently solved;
// the original separate answer booklet was not supplied. Review only.
export const n03SourceToItemIds = oneToOneSourceMap('N03', 13)

const rawN03 = {
  schemaVersion: '1.1' as const,
  unitId: 'math-numbers-expressions-n03',
  revision: 1,
  status: 'review' as const,
  subject: 'math-1a' as const,
  chapter: {
    chapterId: 'math-ch01-numbers-expressions',
    chapterNumber: '1', chapterTitle: '数と式', unitCode: '1NUM',
    orderInChapter: 3, sourcePages: [6, 7],
  },
  title: '指数法則と展開',
  subtitle: '掛ける構造を見分け、分配する項を一つずつ確かめる。',
  source: {
    type: 'reference' as const,
    label: 'ユーザー提供「数と式」教科書モード対話段階導入版 v2 / N03',
    rightsNote: '教師編集Wordの原問13件と元図1点に対応するレビュー用新規学習本文。原文中の出版社ガイドへの言及は再配布許諾を意味しない。元の解答別冊は未提供のため独立計算で検証。',
  },
  objectives: [
    '指数法則を因子の個数や組の繰返しから区別する',
    '括弧の全項へ分配し、同類項を整理する',
    '新しい多項式でも符号を含めて展開する',
  ],
  sections: [{
    id: 'lesson', number: '03', title: '本文', role: 'concept' as const,
    description: '具体例から法則を作り、分配の考えへつなげる。',
    figures: [{
      id: 'n03-f01',
      src: '/assets/math/textbook/numbers/n03-f01.png',
      alt: '積の対応を考える表。上に3xと4、左に2xと1があり、内側の四つのマスは全て疑問符。',
      caption: '二つの括弧の項を一つずつ組み合わせる。まだ答えは書き込まない。',
      overlays: [],
    }],
    readingFlow: [
      { id: 'heading-indices', type: 'heading' as const, text: '指数は、掛けた個数を数える' },
      { id: 'marker-example-powers', type: 'marker' as const, kind: 'example' as const, text: '例題' },
      { id: 'paragraph-powers-intro', type: 'paragraph' as const, parts: [
        M('a^3\\times4a^5'), T(' を簡単にしよう。'),
        M('a^3'), T(' は '), M('a'), T(' を3回掛けたもの、'), M('a^5'),
        T(' は5回掛けたものである。このように同じ数を繰り返し掛けた形を'),
        K('累乗'), T('、右上の数を'), K('指数'), T('という。ここでは指数を正の整数として考える。'),
      ] },
      { id: 'paragraph-powers-count', type: 'paragraph' as const, parts: [
        T('途中の '), M('4'), T(' は '), M('a'), T(' の個数には入らない。数の部分を前へ置き、文字を数え直すと、'),
      ] },
      { id: 'formula-n03-01', type: 'formula' as const, parts: [
        M('a^3\\times4a^5=4\\times\\underbrace{a\\times a\\times a}_{3\\text{個}}\\times\\underbrace{a\\times a\\times a\\times a\\times a}_{5\\text{個}}='), C('n03-01'),
      ] },
      { id: 'paragraph-powers-after', type: 'paragraph' as const, parts: [T('となる。ここでは '), M('a'), T(' の個数を足した。')] },
      { id: 'paragraph-powers-product', type: 'paragraph' as const, parts: [
        T('では正の整数 '), M('m,n'), T(' について考えよう。'),
        M('a^ma^n'), T(' では '), M('m'), T(' 個と '), M('n'), T(' 個が続いている。したがって、'),
      ] },
      { id: 'formula-n03-02', type: 'formula' as const, parts: [M('a^ma^n='), C('n03-02')] },
      { id: 'paragraph-powers-power', type: 'paragraph' as const, parts: [
        T('一方、'), M('(a^m)^n'), T(' は「'), M('a'), T(' を '), M('m'),
        T(' 回掛けた組」が '), M('n'), T(' 組ある。'),
        M('m+n'), T(' 個ではなく、'), M('m'), T(' 個の組を '), M('n'), T(' 回重ねるから、'),
      ] },
      { id: 'formula-n03-03', type: 'formula' as const, parts: [M('(a^m)^n='), C('n03-03')] },
      { id: 'paragraph-powers-factors', type: 'paragraph' as const, parts: [
        T('最後に '), M('(ab)^n'), T(' を考える。掛け算の交換法則・結合法則で、'),
        M('a'), T(' と '), M('b'), T(' をそれぞれ集められる。'),
      ] },
      { id: 'formula-n03-04', type: 'formula' as const, parts: [M('(ab)^n=(ab)(ab)\\cdots(ab)='), C('n03-04')] },
      { id: 'paragraph-powers-rules', type: 'paragraph' as const, parts: [
        T('ここで作った三つの関係を'), K('指数法則'), T('という。「同じ底の積」「累乗の累乗」「積の累乗」は、それぞれ掛け合わせる構造が異なるので、指数の計算も区別する。'),
      ] },
      { id: 'marker-powers-check', type: 'marker' as const, kind: 'check' as const, text: '確認' },
      { id: 'paragraph-powers-check', type: 'paragraph' as const, parts: [
        M('(-2x^3y^2)^3'), T(' を簡単にしよう。負号を含む '), M('-2'), T(' も、括弧の中の一つの因子である。'),
      ] },
      { id: 'formula-n03-05', type: 'formula' as const, derivationId: 'negative-power', parts: [M('(-2x^3y^2)^3='), C('n03-05')] },
      { id: 'formula-n03-06', type: 'formula' as const, derivationId: 'negative-power', parts: [M('='), C('n03-06')] },
      { id: 'paragraph-powers-check-after', type: 'paragraph' as const, parts: [
        T('最初は係数・'), M('x'), T('・'), M('y'), T(' に分け、次に符号と指数を計算した。'),
      ] },

      { id: 'heading-distribute', type: 'heading' as const, text: '括弧の全ての項に掛ける' },
      { id: 'marker-distribute-example', type: 'marker' as const, kind: 'example' as const, text: '例題' },
      { id: 'paragraph-distribute-intro', type: 'paragraph' as const, parts: [
        M('x^2(x^2-3x+4)'), T(' を展開しよう。中学校の分配法則 '),
        M('A(B+C)=AB+AC'), T(' は、括弧の中が三つの項でも同じである。'),
        M('x^2'), T(' は最初の '), M('x^2'), T(' だけでなく、'), M('-3x'),
        T(' と '), M('4'), T(' にも掛かる。まず積を残して書こう。'),
      ] },
      { id: 'formula-n03-07', type: 'formula' as const, derivationId: 'distribute-three', parts: [M('x^2(x^2-3x+4)='), C('n03-07')] },
      { id: 'formula-n03-08', type: 'formula' as const, derivationId: 'distribute-three', parts: [M('='), C('n03-08')] },
      { id: 'paragraph-distribute-after', type: 'paragraph' as const, parts: [
        T('このように積の形を単項式の和へ書き直すことを'), K('展開する'), T('という。後ろの式が3項なら、対応する積も3個である。'),
      ] },
      { id: 'paragraph-two-brackets', type: 'paragraph' as const, parts: [
        T('今度は '), M('(2x+1)(3x+4)'), T(' を考えよう。前の括弧も2項なので、掛け合わせる組を抜かさないことが大切だ。'),
      ] },
      { id: 'figure-multiplication-grid', type: 'figure' as const, figureId: 'n03-f01' },
      { id: 'paragraph-grid-first', type: 'paragraph' as const, parts: [
        T('まず '), M('2x'), T(' と '), M('1'), T(' を、それぞれ後ろの括弧全体に掛けると、'),
      ] },
      { id: 'formula-n03-09', type: 'formula' as const, parts: [M('(2x+1)(3x+4)='), C('n03-09')] },
      { id: 'paragraph-grid-products', type: 'paragraph' as const, parts: [
        T('さらに各括弧を開く。図の「?」4マスに対応する4個の積をまだまとめずに書くと、'),
      ] },
      { id: 'formula-n03-10', type: 'formula' as const, parts: [M('='), C('n03-10')] },
      { id: 'paragraph-grid-collect', type: 'paragraph' as const, parts: [T('同じ文字の部分を持つ項を集めると、')] },
      { id: 'formula-n03-11', type: 'formula' as const, parts: [M('='), C('n03-11')] },
      { id: 'paragraph-grid-after', type: 'paragraph' as const, parts: [
        T('「どの項どうしを掛けるか」を決めてから、「同類項をまとめる」という二段階を踏めば、項の抜けや符号の誤りを防げる。'),
      ] },
      { id: 'marker-final-check', type: 'marker' as const, kind: 'check' as const, text: '確認' },
      { id: 'paragraph-final-check', type: 'paragraph' as const, parts: [
        M('(3x-1)(2x^2-x+5)'), T(' では、後ろの括弧が3項になった。同じ方法で、まず前の括弧の二つの項に分けよう。'),
      ] },
      { id: 'formula-n03-12', type: 'formula' as const, derivationId: 'transfer-distribution', parts: [M('(3x-1)(2x^2-x+5)='), C('n03-12')] },
      { id: 'formula-n03-13', type: 'formula' as const, derivationId: 'transfer-distribution', parts: [M('='), C('n03-13')] },
      { id: 'paragraph-final-bridge', type: 'paragraph' as const, parts: [
        T('最後は積の対応図を使わず、分配の考えを新しい式へ適用した。次は、展開に繰り返し現れる形を乗法公式として整理する。'),
      ] },
    ],
    items: [
      item('n03-01', '同じaの因子を数えて簡単にしよう。', '4a^8', 'formula',
        ['4a^{15}', 'a^8', '4a^2'], 'concept-formation', 'strong', ['係数4は指数へ加えず、aの個数だけを合わせる。']),
      item('n03-02', '同じ底を掛けると指数はどうなる？', 'a^{m+n}', 'formula',
        ['a^{mn}', 'a^{m-n}', '2a^{mn}'], 'representation-link', 'strong', ['m個とn個を一列に続けて数える。']),
      item('n03-03', 'm個の組をn回繰り返すと？', 'a^{mn}', 'formula',
        ['a^{m+n}', 'a^{m^n}', 'na^m'], 'causal-reasoning', 'medium', ['一組の長さと組の数の関係を使う。']),
      item('n03-04', 'aとbを集め直した形を選ぼう。', 'a^nb^n', 'formula',
        ['a^nb', 'ab^n', 'a^{2n}b^n'], 'representation-link', 'medium', ['括弧内のaとbは毎回一つずつ現れる。']),
      item('n03-05', '負号も文字も括弧の全因子へ3乗を配ろう。', '(-2)^3(x^3)^3(y^2)^3', 'formula',
        ['(-2)(x^3)^3(y^2)^3', '(-2)^3x^3y^6', '(-2)^3(x^3)^3y^2'], 'representation-link', 'medium', ['括弧の内側の因子を三つに分けて考える。']),
      item('n03-06', '符号と指数をそれぞれ計算しよう。', '-8x^9y^6', 'formula',
        ['8x^9y^6', '-6x^9y^6', '-8x^6y^5'], 'transfer', 'medium', ['負の数を3乗した符号と、指数の積に注目。']),
      item('n03-07', 'x²を括弧内の全項に掛けた形を選ぼう。', 'x^2x^2+x^2(-3x)+x^2\\cdot4', 'formula',
        ['x^2x^2+x^2\\cdot4', 'x^2x^2+x^2(3x)+x^2\\cdot4', 'x^2x^2+(-3x)+4'], 'representation-link', 'medium', ['括弧内の三項に対応する積を一つずつ書く。']),
      item('n03-08', '三つの積を計算しよう。', 'x^4-3x^3+4x^2', 'formula',
        ['x^4-3x^2+4x^2', 'x^4+3x^3+4x^2', 'x^4-3x^3+4x'], 'transfer', 'medium', ['同じ底の指数は加え、符号はそのまま残す。']),
      item('n03-09', '最初の括弧の2項で全体を分配しよう。', '2x(3x+4)+1(3x+4)', 'formula',
        ['2x(3x+4)+1', '2x(3x+4)+1(3x)', '2x(3x+4)-1(3x+4)'], 'representation-link', 'medium', ['前の括弧の各項が後ろの括弧全体に掛かる。']),
      item('n03-10', '図の四つのマスに対応する積を全て書こう。', '6x^2+8x+3x+4', 'formula',
        ['6x^2+8x+4', '6x^2+8x-3x+4', '6x^2+11x+4'], 'representation-link', 'light', ['四組の積は、同類項をまとめる前に全て現れる。']),
      item('n03-11', '同類項をまとめて展開を終えよう。', '6x^2+11x+4', 'formula',
        ['6x^2+5x+4', '6x^2+12x+4', '6x^2+11x'], 'transfer', 'light', ['xの項どうしの係数を足す。']),
      item('n03-12', '2項それぞれへ後ろの括弧全体を掛けよう。', '3x(2x^2-x+5)-(2x^2-x+5)', 'formula',
        ['3x(2x^2-x+5)-(2x^2-x)', '3x(2x^2-x+5)+(2x^2-x+5)', '3x(2x^2-x+5)-1'], 'transfer', 'light', ['前の括弧の−1が後ろの全項へ掛かる。']),
      item('n03-13', '全項を展開し、符号に注意してまとめよう。', '6x^3-5x^2+16x-5', 'formula',
        ['6x^3-3x^2+14x-5', '6x^3-5x^2+16x+5', '6x^3-5x^2+14x-5'], 'transfer', 'light', ['−1を配るとき、後ろの各項の符号はどうなる？']),
    ],
  }],
}

export const mathNumbersN03Unit = validateTextbookUnits([rawN03])[0]

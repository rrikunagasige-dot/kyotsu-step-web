import { validateTextbookUnits } from '../../../../domain/textbookSchema'

// W-MATH-003 / approved P-001, reviewed N01 v2. Original source: N01 Q1–Q10,
// user-provided Word 2026-10-17, SHA-256 93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa.
// 15 small decisions preserve all ten original prompts. Answer key was NOT provided
// with the source: answers below are independently checked calculations.
// Draft/review only: do not publish or merge into the existing setup without user acceptance.

const T = (text: string) => ({ type: 'text' as const, text })
const M = (latex: string) => ({ type: 'math' as const, latex })
const C = (itemId: string) => ({ type: 'choice' as const, itemId })
const K = (text: string) => ({ type: 'term' as const, text })
type ItemPurpose = 'concept-formation' | 'representation-link' | 'transfer' | 'causal-reasoning'
type Level = 'strong' | 'medium' | 'light'
function item(
  id: string, prompt: string, answer: string, answerType: 'formula' | 'text',
  choices: string[], purpose: ItemPurpose, scaffoldLevel: Level, hints: string[] = [],
) {
  return { id, label: id.toUpperCase(), prompt, answer, acceptedAnswers: [], answerType, choices, purpose, scaffoldLevel, hints }
}

// Source-to-interaction correspondence is authoring metadata, NEVER learner copy.
export const n01SourceToItemIds = {
  'N01-Q01': ['n01-01'],
  'N01-Q02': ['n01-02a', 'n01-02b', 'n01-02c'],
  'N01-Q03': ['n01-03'],
  'N01-Q04': ['n01-04'], // x coefficient is reused from Q03, not re-asked
  'N01-Q05': ['n01-05'],
  'N01-Q06': ['n01-06a', 'n01-06b'],
  'N01-Q07': ['n01-07'],
  'N01-Q08': ['n01-08'],
  'N01-Q09': ['n01-09a', 'n01-09b'],
  'N01-Q10': ['n01-10a', 'n01-10b'],
} as const

const rawN01 = {
  schemaVersion: '1.1' as const,
  unitId: 'math-numbers-expressions-n01',
  revision: 2,
  status: 'review' as const,
  subject: 'math-1a' as const,
  chapter: {
    chapterId: 'math-ch01-numbers-expressions',
    chapterNumber: '1',
    chapterTitle: '数と式',
    unitCode: '1NUM',
    orderInChapter: 1,
    // Source Word table of contents: N01 pp.2–3; N02 begins p.4.
    sourcePages: [2, 3],
  },
  title: '式の見方',
  subtitle: '数と文字を掛け算として読み、どの文字に注目するか考える。',
  source: {
    type: 'reference' as const,
    label: 'ユーザー提供「数と式」教科書モード対話段階導入版 v2 / N01',
    rightsNote: '教師作成WordのN01 Q1–Q10を原式に照合したレビュー用新規学習本文。啓林館「深進数学Ⅰ」教科書ガイドへの原稿側言及は元教科書への独立アクセスや再配布許諾を意味しない。解答別冊なし・独立解法監査。',
  },
  objectives: [
    '数と文字の積を一つずつ読み取る',
    '注目する文字を変えて式の見方を比べる',
    '同じ文字の部分をまとめた結果から式を読む',
  ],
  sections: [{
    id: 'lesson',
    number: '01',
    title: '本文',
    role: 'concept' as const,
    description: '問い→意味→用語→別の式への応用をつなげる。',
    figures: [],
    readingFlow: [
      { id: 'heading-factors', type: 'heading' as const, text: '式を掛け算に戻す' },
      { id: 'marker-factor-example', type: 'marker' as const, kind: 'example' as const, text: '例題' },
      { id: 'paragraph-intro', type: 'paragraph' as const, parts: [
        T('次の三つの式を比べよう。'), M('-2x,\\quad x^2,\\quad -x^2y^2'),
        T('。どれも数と文字の掛け算で読める。例えば '), M('x^2=x\\times x'),
        T(' である。マイナスがあるときは、符号も数の部分に含めて考える。'),
      ] },
      { id: 'formula-n01-01', type: 'formula' as const, parts: [
        M('-x^2y^2='), C('n01-01'), M('\\times x\\times x\\times y\\times y'),
      ] },
      { id: 'paragraph-concept-monomial', type: 'paragraph' as const, parts: [
        T('このように数と文字の積で表した式を'), K('単項式'), T('という。ここでは文字の指数を0以上の整数として扱う。数の部分を'),
        K('係数'), T('、掛け合わせた文字の総数を'), K('次数'), T('という。'),
      ] },
      { id: 'paragraph-coefficient-compare', type: 'paragraph' as const, parts: [
        T('三つの式をもう一度見よう。次の各式について（係数，次数）の組を完成させよう。文字の前に数が書かれていなくても、数の部分はある。'),
      ] },
      { id: 'formula-n01-02a', type: 'formula' as const, derivationId: 'coefficients', parts: [M('-2x\\;\\longrightarrow\\; (\\text{係数,次数})='), C('n01-02a')] },
      { id: 'formula-n01-02b', type: 'formula' as const, derivationId: 'coefficients', parts: [M('x^2\\;\\longrightarrow\\; (\\text{係数,次数})='), C('n01-02b')] },
      { id: 'formula-n01-02c', type: 'formula' as const, derivationId: 'coefficients', parts: [M('-x^2y^2\\;\\longrightarrow\\; (\\text{係数,次数})='), C('n01-02c')] },

      { id: 'heading-variable', type: 'heading' as const, text: 'どの文字を見るか' },
      { id: 'marker-variable-example', type: 'marker' as const, kind: 'example' as const, text: '例題' },
      { id: 'paragraph-variable-intro', type: 'paragraph' as const, parts: [
        T('同じ式 '), M('5x^3y'), T(' でも、注目する文字によって見方が変わる。'),
        M('x'), T(' に注目するとき、'), M('y'), T(' は変わらない数とみなす。'),
        T('そこで、'), M('x^3'), T(' の前に掛かるものを一つにまとめよう。'),
      ] },
      { id: 'formula-n01-03', type: 'formula' as const, parts: [
        M('5x^3y='), C('n01-03'), M('\\,x^3'),
      ] },
      { id: 'paragraph-variable-switch', type: 'paragraph' as const, parts: [
        T('いまの結果から、'), M('x'), T(' に注目した係数が読める。同じ式を今度は '),
        M('y'), T(' について見ると、（係数，次数）は '), C('n01-04'), T(' となる。'),
      ] },
      { id: 'marker-variable-check', type: 'marker' as const, kind: 'check' as const, text: '確認' },
      { id: 'paragraph-n01-05', type: 'paragraph' as const, parts: [
        T('同じ考え方を '), M('axy'), T(' に使おう。'),
        M('x'), T(' に注目した係数と、'), M('y'), T(' に注目した係数をこの順に書くと '),
        C('n01-05'), T(' となる。'),
      ] },
      { id: 'paragraph-variable-bridge', type: 'paragraph' as const, parts: [
        T('注目する文字以外を、係数側にひとまとめにする。式そのものを別の式に変えたわけではない。'),
      ] },

      { id: 'heading-like-terms', type: 'heading' as const, text: '同じ種類の項を集める' },
      { id: 'marker-like-example', type: 'marker' as const, kind: 'example' as const, text: '例題' },
      { id: 'paragraph-like-intro', type: 'paragraph' as const, parts: [
        T('次の式を簡単にしよう。'),
      ] },
      { id: 'formula-like-original', type: 'formula' as const, parts: [M('3x^2-5x+6-5x^2+2x-3')] },
      { id: 'paragraph-term-concept', type: 'paragraph' as const, parts: [
        T('引き算は負の数を足すこととして読み取れる。符号も含めた一つ一つのまとまりを'),
        K('項'), T('といい、単項式の和で表した式を'), K('多項式'), T('という。文字の部分が同じ項を'),
        K('同類項'), T('という。同類項をまとめるときは、符号もその項と一緒に扱う。'),
      ] },
      { id: 'paragraph-n01-06a', type: 'paragraph' as const, parts: [
        T('まず '), M('x^2'), T(' の項を取り出すと '), C('n01-06a'), T(' である。'),
      ] },
      { id: 'paragraph-n01-06b', type: 'paragraph' as const, parts: [
        T('残る '), M('x'), T(' の項と定数の項を分けると '), C('n01-06b'), T(' となる。'),
      ] },
      { id: 'paragraph-n01-07-intro', type: 'paragraph' as const, parts: [
        T('三つに分けた項について、同じ文字の係数を計算しよう。'),
      ] },
      { id: 'formula-r3-q07-x2coef', type: 'formula' as const, derivationId: 'n01-q07-evaluate', parts: [
        M('=(3-5)x^2+(-5+2)x+(6-3)\\quad\\Longrightarrow\\quad('),
        C('n01-r3-q07-x2coef'), M(')x^2+(-5+2)x+(6-3)'),
      ] },
      { id: 'formula-r3-q07-xcoef', type: 'formula' as const, derivationId: 'n01-q07-evaluate', parts: [
        M('=(-2)x^2+(-5+2)x+(6-3)\\quad\\Longrightarrow\\quad(-2)x^2+('),
        C('n01-r3-q07-xcoef'), M(')x+(6-3)'),
      ] },
      { id: 'formula-r3-q07-const', type: 'formula' as const, derivationId: 'n01-q07-evaluate', parts: [
        M('=(-2)x^2+(-3)x+(6-3)\\quad\\Longrightarrow\\quad(-2)x^2+(-3)x+('),
        C('n01-r3-q07-const'), M(')'),
      ] },
      { id: 'formula-n01-07', type: 'formula' as const, derivationId: 'n01-q07-evaluate', parts: [
        M('=(3-5)x^2+(-5+2)x+(6-3)='), C('n01-07'),
      ] },
      { id: 'paragraph-n01-08', type: 'paragraph' as const, parts: [
        T('多項式の'), K('次数'), T('は、同類項をまとめた後に残る項の次数の最大値。注目する文字を含まない項を'),
        K('定数項'), T('という。今整理した式の（次数，定数項）は '), C('n01-08'), T(' となる。'),
      ] },
      { id: 'marker-degree-check', type: 'marker' as const, kind: 'check' as const, text: '確認' },
      { id: 'paragraph-cancellation-intro', type: 'paragraph' as const, parts: [
        T('整理する前に次数を決めてよいのだろうか。次の式を同じ手順で整理してみよう。'),
      ] },
      { id: 'formula-cancellation-original', type: 'formula' as const, parts: [M('x^3-2x^2+x-x^3+3x-1')] },
      { id: 'paragraph-n01-09a', type: 'paragraph' as const, parts: [
        T('同類項で組み直すと '), C('n01-09a'), T(' となる。'),
      ] },
      { id: 'paragraph-n01-09b', type: 'paragraph' as const, parts: [
        T('係数を計算して整理すると '), C('n01-09b'), T(' である。'),
      ] },
      { id: 'paragraph-n01-10a', type: 'paragraph' as const, parts: [
        T('整理した結果、この多項式は '), C('n01-10a'), T(' である。'),
      ] },
      { id: 'paragraph-n01-10b', type: 'paragraph' as const, parts: [
        T('そのように判断できる理由は '), C('n01-10b'), T('。'),
      ] },
      { id: 'marker-n01-summary', type: 'marker' as const, kind: 'summary' as const, text: 'ここまでの要点' },
      { id: 'paragraph-summary', type: 'paragraph' as const, parts: [
        T('式を読むときは、'), K('注目する文字'), T('を決め、'), K('同類項'), T('をまとめてから、残った項の'),
        K('次数'), T('を判断する。この考え方を次の長い式の整理と足し引きにも使う。'),
      ] },
    ],
    items: [
      item('n01-01', '負号を含めた数の部分を選ぼう。', '-1', 'formula',
        ['-1', '1', '-2'], 'concept-formation', 'strong',
        ['式全体の前にあるマイナスは、文字ではなく数の部分に入る。']),
      item('n01-02a', '−2xの係数と次数を選ぼう。', '(-2,1)', 'formula',
        ['(-2,1)', '(2,1)', '(-2,2)'], 'representation-link', 'strong',
        ['符号は係数に、掛け合わせた文字の個数は次数に入る。']),
      item('n01-02b', 'x²の係数と次数を選ぼう。', '(1,2)', 'formula',
        ['(1,2)', '(2,1)', '(0,2)'], 'representation-link', 'strong',
        ['見えない係数も掛け算に戻して考える。']),
      item('n01-02c', '−x²y²の係数と次数を選ぼう。', '(-1,4)', 'formula',
        ['(-1,4)', '(1,4)', '(-1,2)'], 'representation-link', 'medium',
        ['xとyを掛けている総数を数える。']),
      item('n01-03', 'x³に掛かるものをまとめよう。', '5y', 'formula',
        ['5y', '5', '5x'], 'concept-formation', 'strong',
        ['xに注目するとき、yは係数に含められる。']),
      item('n01-04', 'yについて見た係数と次数を選ぼう。', '(5x^3,1)', 'formula',
        ['(5x^3,1)', '(5y,3)', '(5x^3,3)'], 'representation-link', 'medium',
        ['今度はyだけを変える文字として数える。']),
      item('n01-05', 'xとyに注目した係数をこの順に選ぼう。', '(ay,ax)', 'formula',
        ['(ay,ax)', '(ax,ay)', '(a,a)'], 'transfer', 'medium',
        ['注目しない文字を係数に含める。順序にも注意。']),
      item('n01-06a', 'x²を含む二つの項を符号ごと選ぼう。', '3x^2-5x^2', 'formula',
        ['3x^2-5x^2', '3x^2+5x^2', '3x^2-5x'], 'concept-formation', 'medium',
        ['文字の部分が同じ項だけを抜き出す。']),
      item('n01-06b', '残りのxの項と定数項の二組を選ぼう。', '(-5x+2x)\\quad (6-3)', 'formula',
        ['(-5x+2x)\\quad (6-3)', '(5x+2x)\\quad (6-3)', '(-5x-2x)\\quad (6+3)'], 'representation-link', 'medium',
        ['符号も含めて元の式から項を拾う。']),
      item('n01-r3-q07-x2coef', 'x²の係数 3−5 を計算しよう。', '-2', 'formula',
        ['-2', '2', '-8'], 'representation-link', 'medium', ['3から5を引く。符号まで答えに含めよう。']),
      item('n01-r3-q07-xcoef', 'xの係数 −5+2 を計算しよう。', '-3', 'formula',
        ['-3', '3', '-7'], 'representation-link', 'medium', ['負の5と正の2を加える。']),
      item('n01-r3-q07-const', '定数項 6−3 を計算しよう。', '3', 'formula',
        ['3', '-3', '9'], 'representation-link', 'medium', ['文字を含まない二つの数を計算する。']),
      item('n01-07', '分類した三組の係数をそれぞれ計算しよう。', '-2x^2-3x+3', 'formula',
        ['-2x^2-3x+3', '-2x^2+3x+3', '-2x^2-3x-3', '-2x-3x^2+3'], 'transfer', 'medium',
        ['各組の数だけを計算し、文字の部分は残す。']),
      item('n01-08', '整理後の次数と定数項の組を選ぼう。', '(2,3)', 'formula',
        ['(2,3)', '(3,2)', '(2,-3)'], 'representation-link', 'medium',
        ['すでに計算した式の中で、最大次数と定数項を探す。']),
      item('n01-09a', '同類項をまとめて並べる式を選ぼう。', '(1-1)x^3-2x^2+(1+3)x-1', 'formula',
        ['(1-1)x^3-2x^2+(1+3)x-1', '(1+1)x^3-2x^2+(1+3)x-1', '(1-1)x^3+2x^2+(1+3)x-1', '(1-1)x^3-2x^2+(1-3)x-1'],
        'representation-link', 'light', ['元の式にある各項を、符号を変えずに並べ直す。']),
      item('n01-09b', '各係数を整理し、結果の式を選ぼう。', '-2x^2+4x-1', 'formula',
        ['-2x^2+4x-1', '2x^3-2x^2+4x-1', '-2x^2+2x-1', '-2x^2+4x+1'], 'transfer', 'light',
        ['一組ずつ係数を計算してから、残る項を並べる。']),
      item('n01-10a', '整理した結果の式は何次式だろう。', '2次式', 'text',
        ['2次式', '3次式', '1次式', '0次式'], 'transfer', 'light',
        ['元の式ではなく、整理後に残る項を調べる。']),
      item('n01-10b', 'その次数と判断した理由を選ぼう。', '3次の項が整理によって消えるから', 'text',
        ['3次の項が整理によって消えるから', '式にはxが3回出てくるから', '定数項があるから', '負の係数があるから'],
        'causal-reasoning', 'light', ['次数は項を整理した後に残る最大の指数から判断する。']),
    ],
  }],
}

export const mathNumbersN01Unit = validateTextbookUnits([rawN01])[0]

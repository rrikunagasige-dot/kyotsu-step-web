import { validateTextbookUnits, type TextbookItem, type TextbookReadingPart } from '../../../../domain/textbookSchema'

// N01 is a review-only adaptation of ten questions from the user-supplied Word.
// The separate answer booklet is not available; formulas were independently checked.
// Existing textbook units and student progress keys remain unchanged.
const t = (text: string): TextbookReadingPart => ({ type: 'text', text })
const m = (latex: string): TextbookReadingPart => ({ type: 'math', latex })
const k = (text: string): TextbookReadingPart => ({ type: 'term', text })
const c = (itemId: string): TextbookReadingPart => ({ type: 'choice', itemId })
const p = (id: string, ...parts: TextbookReadingPart[]) => ({ id, type: 'paragraph' as const, parts })
const f = (id: string, ...parts: TextbookReadingPart[]) => ({ id, type: 'formula' as const, parts })
type Purpose = NonNullable<TextbookItem['purpose']>
type Scaffold = TextbookItem['scaffoldLevel']

function question(
  id: string, prompt: string, answer: string, alternatives: [string, string],
  purpose: Purpose, scaffoldLevel: Scaffold, hints: [string, string],
  answerType: 'text' | 'formula' = 'formula',
) {
  return {
    id, label: id.toUpperCase(), prompt, answer, acceptedAnswers: [],
    answerType, choices: [answer, ...alternatives], purpose, scaffoldLevel, hints,
  }
}

const rawN01 = {
  schemaVersion: '1.0' as const,
  unitId: 'math-numbers-expressions-n01',
  revision: 1,
  status: 'review' as const,
  subject: 'math-1a' as const,
  title: '式の見方',
  subtitle: '数学Ⅰ「数と式」：掛け算から文字の役割と多項式の整理を考える。',
  source: {
    type: 'reference' as const,
    label: 'ユーザー提供「01_数と式_教科書モード_対話段階導入版_v2」N01（問題1〜10）',
    rightsNote: '教員作成の既存教材案に基づく新しい対話型本文。出典ページ番号を推測しないためschema 1.0とした。別冊解答は未照合。',
  },
  objectives: [
    '数と文字の掛け算から、係数や次数の意味を考える',
    '注目する文字により、係数の見方が変わることを知る',
    '同類項を整理し、結果から多項式の次数を判断する',
  ],
  sections: [{
    id: 'lesson',
    number: '01',
    title: '本文',
    role: 'concept' as const,
    description: '文章と式の中で判断し、前の結果を次に利用する。',
    figures: [],
    readingFlow: [
      { id: 'heading-monomial', type: 'heading' as const, text: '式を掛け算に戻す' },
      { id: 'marker-example-monomial', type: 'marker' as const, kind: 'example' as const, text: '例題' },
      p('intro-three', t('次の三つの式を比べよう。どれも数と文字の掛け算として読むことができる。')),
      f('three-expressions', m('-2x,\\qquad x^2,\\qquad -x^2y^2')),
      p('intro-negative', t('例えば '), m('x^2=x\\times x'), t(' だ。マイナスがあるときは、符号も数の部分に含めて考える。')),
      f('formula-q01', m('-x^2y^2='), c('n01-01'), m('\\times x\\times x\\times y\\times y')),
      p('concept-monomial', t('このように数や文字の積で表した式を'), k('単項式'), t('という。ここでは文字の指数を0以上の整数として扱う。数の部分を'), k('係数'), t('、掛け合わせた文字の総数を'), k('次数'), t('という。')),
      p('intro-pairs', t('これらの式の（係数, 次数）を一組ずつ読み取ってみよう。')),
      p('q02a', m('-2x'), t(' の（係数, 次数）は '), c('n01-02a'), t('。')),
      p('q02b', m('x^2'), t(' の（係数, 次数）は '), c('n01-02b'), t('。')),
      p('q02c', m('-x^2y^2'), t(' の（係数, 次数）は '), c('n01-02c'), t('。')),
      p('after-pairs', t('式の前に数が書かれていなくても、掛け算に戻せば係数が分かる。')),

      { id: 'heading-focus', type: 'heading' as const, text: 'どの文字を見るか' },
      { id: 'marker-example-focus', type: 'marker' as const, kind: 'example' as const, text: '例題' },
      p('focus-intro', m('5x^3y'), t(' を今度は '), m('x'), t(' についての式として見よう。ここでは '), m('y'), t(' を変わらない数とみなす。')),
      f('formula-q03', m('5x^3y='), c('n01-03'), m('\\,x^3')),
      p('focus-readback', t('したがって、いま求めた係数のまとまりと '), m('x^3'), t(' の指数から、'), m('x'), t(' に注目した係数と次数が分かる。')),
      p('q04', t('同じ式を '), m('y'), t(' について見ると、（係数, 次数）は '), c('n01-04'), t('。')),
      { id: 'marker-check-focus', type: 'marker' as const, kind: 'check' as const, text: '確認' },
      p('q05', t('同じ見方を '), m('axy'), t(' に移そう。'), m('x'), t(' に注目した係数と '), m('y'), t(' に注目した係数は順に '), c('n01-05'), t('。')),
      p('focus-summary', t('注目する文字以外は、係数側で一つにまとめる。文字そのものを変える必要はない。')),

      { id: 'heading-like', type: 'heading' as const, text: '同じ種類の項を集める' },
      { id: 'marker-example-like', type: 'marker' as const, kind: 'example' as const, text: '例題' },
      p('like-intro', t('次の式を簡単にし、整理した結果から次数を判断してみよう。')),
      f('original-polynomial', m('3x^2-5x+6-5x^2+2x-3')),
      p('terms-intro', t('引き算は負の数の足し算として読む。符号も含めた一つ一つのまとまりを'), k('項'), t('といい、単項式の和として表した式を'), k('多項式'), t('という。文字の部分が同じ項を'), k('同類項'), t('という。')),
      p('q06a', t('まず '), m('x^2'), t(' の項を符号ごと集めると '), c('n01-06a'), t('。')),
      p('q06b', t('残りの '), m('x'), t(' の項と定数の項を、二つの組に分けると '), c('n01-06b'), t('。')),
      p('before-q07', t('今つくった三組を使い、文字の部分は変えず係数を足し引きする。')),
      f('formula-q07', m('=(3-5)x^2+(-5+2)x+(6-3)='), c('n01-07')),
      p('degree-def', t('多項式の'), k('次数'), t('は、同類項をまとめた後に残った項の次数の最大値である。注目する文字を含まない項を'), k('定数項'), t('という。')),
      p('q08', t('いま整理した式の（次数, 定数項）は '), c('n01-08'), t(' となる。')),
      { id: 'marker-check-degree', type: 'marker' as const, kind: 'check' as const, text: '確認' },
      p('cancel-intro', t('整理する前に見えた最高次数の項がそのまま残るとは限らない。次の式も同じ順番で考えよう。')),
      f('cancel-original', m('x^3-2x^2+x-x^3+3x-1')),
      p('q09a', t('まず符号を保ったまま同類項を並べ直すと '), c('n01-09a'), t('。')),
      p('q09b', t('ここから係数を計算して整理すると '), c('n01-09b'), t('。')),
      p('q10a', t('整理した結果を見て判断しよう。この式は '), c('n01-10a'), t(' である。')),
      p('q10b', t('最初に見えた次数と違う理由は '), c('n01-10b'), t('。')),
      { id: 'marker-n01-summary', type: 'marker' as const, kind: 'summary' as const, text: 'まとめ' },
      p('n01-summary-text', t('式を読むときは、'), k('注目する文字を決める'), t(' → '), k('同類項をまとめる'), t(' → '), k('整理後に残った項の次数を調べる'), t('という順で考えよう。次は、長い式の整理や式全体の足し引きに使う。')),
    ],
    items: [
      question('n01-01', '−x²y²の数の部分を答えよう。', '-1', ['1','-2'], 'concept-formation','strong',['負の符号も数の部分に含める。','文字部分はx×x×y×yとなる。']),
      question('n01-02a', '−2xの係数と次数は？','(-2,1)',['(2,1)','(-2,2)'],'concept-formation','strong',['文字xを何個掛けているか数えよう。','マイナスも係数の一部。']),
      question('n01-02b', 'x²の係数と次数は？','(1,2)',['(2,2)','(1,1)'],'concept-formation','strong',['目には見えない1が掛けられている。','指数は文字が掛け合わされた個数。']),
      question('n01-02c', '−x²y²の係数と次数は？','(-1,4)',['(-1,2)','(1,4)'],'concept-formation','medium',['xとyの文字を合わせて数える。','マイナスを係数に含めよう。']),
      question('n01-03', 'xについて5x³yを係数×x³に書こう。','5y',['5','5x^3'],'representation-link','medium',['yを定数だとみなそう。','xを含む部分は右のx³に残している。']),
      question('n01-04', '5x³yをyに注目して見るときの（係数, 次数）は？','(5x^3,1)',['(5y,3)','(5x^3,3)'],'representation-link','medium',['今度はyだけを変数とみなす。','x³を含む部分を係数に入れる。']),
      question('n01-05', 'axyのx係数とy係数をこの順に答えよう。','(ay,ax)',['(ax,ay)','(a,a)'],'transfer','medium',['注目しない方の文字は係数側に残る。','それぞれxとyについて別々に考える。']),
      question('n01-06a', 'x²の同類項を符号ごと集めよう。','3x^2-5x^2',['3x^2+5x^2','3x^2-5x'],'relation-selection','medium',['文字部分が同じ項を探す。','移動するときは直前のマイナスも一緒に。']),
      question('n01-06b', '一次の項と定数の項の二組を選ぼう。','(-5x+2x)\\quad(6-3)',['(-5x-2x)\\quad(6-3)','(-5x+2x)\\quad(6+3)'],'relation-selection','medium',['xの項と文字のない項を分ける。','−5xと−3の符号に注意。']),
      question('n01-07', '同類項をまとめ、元の式を簡単にしよう。','-2x^2-3x+3',['-2x^2+7x+3','2x^2-3x+3'],'transfer','medium',['文字部分ごとに係数を計算する。','x²とxはまとめられない。']),
      question('n01-08', '整理後の（次数, 定数項）は？','(2,3)',['(3,3)','(2,-3)'],'representation-link','light',['整理して残った最高次数を確認する。','文字のない項の符号を見る。']),
      question('n01-09a', '同類項で並べ直した式を選ぼう。','(1-1)x^3-2x^2+(1+3)x-1',['(1+1)x^3-2x^2+(1+3)x-1','(1-1)x^3-2x^2+(1-3)x-1'],'relation-selection','light',['同じ次数ごとにまとめる。','各項の符号をそのまま保つ。']),
      question('n01-09b', '同類項の係数を計算して整理しよう。','-2x^2+4x-1',['x^3-2x^2+4x-1','-2x^2-2x-1'],'transfer','light',['最も高い指数の項が残るか確認する。','xの係数は1と3の和になる。']),
      question('n01-10a', '整理後の多項式は何次式か？','2次式',['3次式','1次式'],'causal-reasoning','light',['整理後に残った項で次数を比べる。','整理前の最高指数で即答しない。'],'text'),
      question('n01-10b', '次数が小さくなった理由を選ぼう。','x³の項が打ち消し合うから',['x³がx²に変わったから','定数項を引いたから'],'causal-reasoning','light',['同類項の係数の和に注目する。','符号が違う同類項が消えることがある。'],'text'),
    ],
  }],
}

export const mathNumbersN01Unit = validateTextbookUnits([rawN01])[0]

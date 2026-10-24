import { teachFirstSection } from './firstSectionTeaching'
import { repairFirstTheme } from './firstThemeRepair'
import { validateTextbookUnits } from '../../../../domain/textbookSchema'
import { T, M, C, K, reviewItem as item, oneToOneSourceMap } from './reviewLessonHelpers'

// W-MATH-003/P-001: user-accepted N02 exact learner-design review.
// Teacher-edited original Word N02 Q1–Q12, pp.4–5, original SHA 93827322...
// Solutions independently derived; separate official answer booklet not supplied.
// All source markers map to one cognitive choice, including two-part Q03/Q09.
export const n02SourceToItemIds = oneToOneSourceMap('N02', 12)

const rawN02 = {
  schemaVersion: '1.1' as const,
  unitId: 'math-numbers-expressions-n02',
  revision: 1, status: 'review' as const, subject: 'math-1a' as const,
  chapter: {
    chapterId: 'math-ch01-numbers-expressions',
    chapterNumber: '1', chapterTitle: '数と式', unitCode: '1NUM',
    orderInChapter: 2, sourcePages: [4, 5],
  },
  title: '多項式の整理と加減',
  subtitle: '注目する文字を決め、同じ次数をそろえて式を扱う。',
  source: {
    type: 'reference' as const,
    label: 'ユーザー提供「数と式」教科書モード対話段階導入版 v2 / N02',
    rightsNote: '教師編集Wordの原問12件を独立計算で照合したレビュー用新規学習本文。図の追加なし。公式別冊解答・出版社の再配布許諾は未確認。',
  },
  objectives: [
    '注目する文字を一つ選んで式の項を整理する',
    '欠けた次数を0として扱い、式全体の加法・減法を説明する',
    'AやBを一つのまとまりとして既に求めた式を再利用する',
  ],
  sections: [{
    id: 'lesson', number: '02', title: '本文', role: 'concept' as const,
    description: '同じ次数・全体への符号・既出の式の再利用をつなぐ。',
    figures: [],
    readingFlow: [
      { id: 'heading-variable', type: 'heading' as const, text: '「何の文字について」見るかを先に決める' },
      { id: 'marker-polynomial-example', type: 'marker' as const, kind: 'example' as const, text: '例題' },
      { id: 'paragraph-polynomial-intro', type: 'paragraph' as const, parts: [
        M('2bx+x^3+5c-ax^2+bx'), T(' を '), M('x'), T(' について整理しよう。'),
        M('a,b,c'), T(' は定数とする。文字が何種類もあっても、今回は '),
        K('xが何回掛けられているか'), T(' に注目する。'),
        M('2bx'), T(' と '), M('bx'), T(' はどちらも '), M('x'), T(' の1次の項なので同類項になる。'),
      ] },
      { id: 'formula-n02-01', type: 'formula' as const, parts: [M('2bx+bx='), C('n02-01')] },
      { id: 'paragraph-polynomial-order', type: 'paragraph' as const, parts: [
        M('x'), T(' の3次、2次、1次、そして '), M('x'),
        T(' を含まない項を順に並べよう。次数が高い方から書くと、'),
      ] },
      { id: 'formula-n02-02', type: 'formula' as const, parts: [M('2bx+x^3+5c-ax^2+bx='), C('n02-02')] },
      { id: 'paragraph-order-name', type: 'paragraph' as const, parts: [
        T('注目した文字の次数が高い順に並べることを'), K('降べきの順'),
        T('、低い順に並べることを'), K('昇べきの順'), T('という。項の順序を変えても値は変わらない。'),
        M('5c'), T(' は '), M('x'), T(' を含まないため、この見方では定数項になる。'),
      ] },
      { id: 'marker-variable-check', type: 'marker' as const, kind: 'check' as const, text: '確認' },
      { id: 'paragraph-variable-check', type: 'paragraph' as const, parts: [
        M('x^2+2xy+y^2-3x-3y+2'), T(' を '), M('x'), T(' の降べき順に整理しよう。'),
        M('2xy'), T(' と '), M('-3x'), T(' は一次項。'),
        M('y'), T(' は係数の一部として扱う。'),
        M('y^2-3y+2'), T(' は '), M('x'), T(' を含まない。係数と定数項の組は、'),
      ] },
      { id: 'formula-n02-03', type: 'formula' as const, parts: [
        M('\\bigl(\\text{一次係数},\\ \\text{定数部分}\\bigr)='), C('n02-03'),
      ] },
      { id: 'paragraph-variable-assembly', type: 'paragraph' as const, parts: [
        T('今の二つのまとまりを戻し、'), M('x^2'), T('、'), M('x'), T('、定数項の順に並べると、'),
      ] },
      { id: 'formula-n02-04', type: 'formula' as const, parts: [
        M('x^2+2xy+y^2-3x-3y+2='), C('n02-04'),
      ] },
      { id: 'paragraph-variable-summary', type: 'paragraph' as const, parts: [
        T('大切なのは、'), M('x'), T(' について見ると他の文字が係数や定数項の中に残ることだ。'),
        T('次はこの見方で二つの式全体を足し引きする。'),
      ] },

      { id: 'heading-add', type: 'heading' as const, text: '同じ次数の列をそろえて足す' },
      { id: 'marker-add-example', type: 'marker' as const, kind: 'example' as const, text: '例題' },
      { id: 'paragraph-ab-intro', type: 'paragraph' as const, parts: [
        T('次の '), M('A,B'), T(' について、'), M('A+B'), T(' と '), M('A-B'), T(' を求めよう。'),
      ] },
      { id: 'formula-ab-definition', type: 'formula' as const, parts: [
        M('\\begin{aligned}A&=2x^3-3x^2+x-1\\\\B&=-x^3+2x^2+2\\end{aligned}'),
      ] },
      { id: 'paragraph-b-missing', type: 'paragraph' as const, parts: [
        M('A'), T(' には '), M('x'), T(' の一次項があるが、'), M('B'),
        T(' には一次の項が見当たらない。同じ次数の列をそろえるため、Bの値を変えずに補える一次項を考えよう。'),
      ] },
      { id: 'formula-n02-05', type: 'formula' as const, parts: [
        M('B=-x^3+2x^2+'), C('n02-05'), M('+2'),
      ] },
      { id: 'paragraph-n02-05-after', type: 'paragraph' as const, parts: [
        T('一次項の係数は '), M('0'), T('。次数ごとに列をそろえるときだけ '),
        M('0x'), T(' と書いても、もとの式の値は変わらない。'),
      ] },
      { id: 'paragraph-sum-coeff', type: 'paragraph' as const, parts: [
        T('同じ次数の係数を足す。'), M('x^3'), T(' は '), M('2+(-1)'),
        T('、'), M('x^2'), T(' は '), M('-3+2'), T('、'), M('x'),
        T(' は '), M('1+0'), T('、定数は '), M('-1+2'), T('。'),
      ] },
      { id: 'formula-n02-06', type: 'formula' as const, parts: [M('A+B='), C('n02-06')] },

      { id: 'heading-minus', type: 'heading' as const, text: 'マイナスは括弧の全ての項に掛かる' },
      { id: 'paragraph-minus-intro', type: 'paragraph' as const, parts: [
        M('A-B'), T(' は、'), M('B'), T(' に '), M('-1'), T(' を掛けて '),
        M('A'), T(' に足すこと。最初の項だけでなく '), M('B'), T(' の全項の符号が変わる。'),
      ] },
      { id: 'formula-n02-07', type: 'formula' as const, parts: [
        M('-B=-(-x^3+2x^2+2)='), C('n02-07'),
      ] },
      { id: 'paragraph-minus-add', type: 'paragraph' as const, parts: [
        T('この結果を '), M('A'), T(' に足して、同類項をまとめよう。'),
      ] },
      { id: 'formula-n02-08', type: 'formula' as const, parts: [
        M('A-B=(2x^3-3x^2+x-1)+(x^3-2x^2-2)='), C('n02-08'),
      ] },
      { id: 'paragraph-minus-summary', type: 'paragraph' as const, parts: [
        T('「全項の符号を変える」と「同類項をまとめる」を分けると、符号を落としにくい。'),
      ] },

      { id: 'marker-multiply-check', type: 'marker' as const, kind: 'check' as const, text: '確認' },
      { id: 'paragraph-multiple-intro', type: 'paragraph' as const, parts: [
        T('同じ '), M('A,B'), T(' で '), M('2A-3B'), T(' を求めよう。'),
        T('まずそれぞれの式全体に係数を掛ける。二つの式を組として書くと、'),
      ] },
      { id: 'formula-n02-09', type: 'formula' as const, parts: [
        M('\\bigl(2A,\\ -3B\\bigr)='), C('n02-09'),
      ] },
      { id: 'paragraph-multiple-collect', type: 'paragraph' as const, parts: [
        T('それぞれ展開した二つの多項式を、同じ次数ごとにまとめると、'),
      ] },
      { id: 'formula-n02-10', type: 'formula' as const, parts: [M('2A-3B='), C('n02-10')] },

      { id: 'heading-structure', type: 'heading' as const, text: '長い式に戻す前に、まとまりを使う' },
      { id: 'marker-last-check', type: 'marker' as const, kind: 'check' as const, text: '確認' },
      { id: 'paragraph-last-intro', type: 'paragraph' as const, parts: [
        M('3A-4B-(A-B)'), T(' を計算しよう。'), M('A,B'),
        T(' を長い多項式へ戻す前に、まとまりのまま括弧を外して同類項を集めると、'),
      ] },
      { id: 'formula-n02-11', type: 'formula' as const, parts: [
        M('3A-4B-(A-B)='), C('n02-11'),
      ] },
      { id: 'paragraph-reuse', type: 'paragraph' as const, parts: [
        T('出てきた式は直前に計算したものだ。その結果を利用すれば、'),
      ] },
      { id: 'formula-n02-12', type: 'formula' as const, parts: [
        M('3A-4B-(A-B)='), C('n02-12'),
      ] },
      { id: 'paragraph-final-bridge', type: 'paragraph' as const, parts: [
        T('注目文字を決める → 同じ次数をそろえる → 括弧全体を処理する → 既出の結果を使う。'),
        T('次は掛け算でも、どの項どうしを組み合わせるかを考えよう。'),
      ] },
    ],
    items: [
      item('n02-01','二つのx一次項の係数を足そう。','3bx','formula',
        ['3b^2x','2bx^2','bx'],'concept-formation','strong',['bを掛け合わせるのでなく、2bとbを足す。']),
      item('n02-02','xの次数3→2→1→0の順へ。','x^3-ax^2+3bx+5c','formula',
        ['5c+3bx-ax^2+x^3','x^3+3bx-ax^2+5c','x^3-ax^2+2bx+5c'],'representation-link','strong',['並べ替えの順序と同類項の係数の両方に注目。']),
      item('n02-03','x一次の係数とxなし部分を組で答えよう。','(2y-3,\\ y^2-3y+2)','formula',
        ['(2y,\\ y^2-3y+2)','(2y-3,\\ 2)','(-3,\\ y^2-3y+2)'],'representation-link','medium',['-3xも一次項。yがあってもxがなければ定数部分。']),
      item('n02-04','xの次数順にひとつの式へ戻そう。','x^2+(2y-3)x+(y^2-3y+2)','formula',
        ['x^2+(2y-3)x+2','x^2+(2y+3)x+(y^2-3y+2)','x^2+y^2+(2y-3)x-3y+2'],'transfer','medium',['一次係数の符号と、xなし部分をそのまま残す。']),
      item('n02-05','係数が0の一次項を、Bの式中に補おう。','0x','formula',
        ['x','-x','2x'],'representation-link','medium',['ない項は係数0。Bの値を変えてはいけない。']),
      item('n02-06','同じ次数の係数をそれぞれ足そう。','x^3-x^2+x+1','formula',
        ['x^3-5x^2+x+1','x^3-x^2+x+3','x^3-x^2+1'],'transfer','medium',['和の計算。次数ごとの係数を一列に合わせる。']),
      item('n02-07','-1をBの全項へ掛けよう。','x^3-2x^2-2','formula',
        ['x^3+2x^2+2','x^3-2x^2+2','-x^3-2x^2-2'],'causal-reasoning','medium',['Bの定数+2にも-1が掛かる。']),
      item('n02-08','Aと今の-Bを加えよう。','3x^3-5x^2+x-3','formula',
        ['x^3-x^2+x+1','3x^3-x^2+x-3','3x^3-5x^2+x+1'],'transfer','light',['-1+(-2)は定数項に残る。']),
      item('n02-09','2Aと-3Bをそれぞれ全項へ配ろう。',
        '(4x^3-6x^2+2x-2,\\ 3x^3-6x^2-6)','formula',
        ['(4x^3-3x^2+2x-1,\\ 3x^3-6x^2-6)',
         '(4x^3-6x^2+2x-2,\\ 3x^3+6x^2-6)',
         '(4x^3-6x^2+2x-2,\\ 3x^3-6x^2+6)'],'representation-link','medium',
        ['-3Bの二次係数と定数の両方の符号を確かめる。']),
      item('n02-10','係数倍した二式を次数ごとに足そう。','7x^3-12x^2+2x-8','formula',
        ['7x^3+0x^2+2x-8','x^3-12x^2+2x-8','7x^3-12x^2+2x+4'],'transfer','light',
        ['二次係数は-6-6、定数は-2-6。']),
      item('n02-11','AとBのまとまりのまま括弧を外そう。','2A-3B','formula',
        ['2A-5B','4A-5B','2A-4B'],'causal-reasoning','light',['-(A-B)では-A+Bになる。']),
      item('n02-12','既に計算した2A-3Bの結果を再利用しよう。','7x^3-12x^2+2x-8','formula',
        ['3x^3-5x^2+x-3','x^3-x^2+x+1','7x^3-12x^2+2x-6'],'transfer','light',
        ['Qの番号ではなく、直前に求めた式の形を見返そう。']),
    ],
  }],
}

export const mathNumbersN02R3Unit = validateTextbookUnits([repairFirstTheme(validateTextbookUnits([rawN02])[0])])[0]

export const mathNumbersN02Unit = validateTextbookUnits([teachFirstSection(mathNumbersN02R3Unit)])[0]

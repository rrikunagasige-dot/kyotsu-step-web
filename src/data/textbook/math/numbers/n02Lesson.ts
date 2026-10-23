import { validateTextbookUnits } from '../../../../domain/textbookSchema'
import { T, M, C, K, reviewItem as item, oneToOneSourceMap } from './reviewLessonHelpers'

// W-MATH-003/P-001: user-accepted N02 exact learner-design review.
// Teacher-edited original Word N02 Q1–Q12, pp.4–5, original SHA 93827322...
// Solutions independently derived; separate official answer booklet not supplied.
// W-MATH-027/P-002-N02-R1: 12 original questions, 15 locally staged actions.
// Q01-Q05 and Q12 retain their accepted answer semantics; v1 is archived for re-keyed Q06-Q11.
export const n02SourceToItemIds = {
  ...oneToOneSourceMap('N02', 12),
  'N02-Q07': ['n02-r2-q07-x3', 'n02-07'],
  'N02-Q09': ['n02-r2-q09-a2', 'n02-09'],
  'N02-Q11': ['n02-r2-q11-sign', 'n02-11'],
} as const

const rawN02 = {
  schemaVersion: '1.1' as const,
  unitId: 'math-numbers-expressions-n02',
  revision: 2, status: 'review' as const, subject: 'math-1a' as const,
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
      {
        "id": "paragraph-sum-coeff",
        "type": "paragraph" as const,
        "parts": [
          {
            "type": "text" as const,
            "text": "Bに一次項がないときも、係数を0として同じ次数をそろえられる。次数ごとのまとまりを作ってから、それぞれの係数を足す。二次の係数では負の数と正の数を足すので、符号を含めて計算する。"
          }
        ],
        "derivationId": "n02-r2-add"
      },
      {
        "id": "n02-r2-add-groups",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "\\begin{aligned}A+B={}&(2+(-1))x^3\\\\&+(-3+2)x^2\\\\&+(1+0)x+(-1+2)\\end{aligned}"
          }
        ],
        "derivationId": "n02-r2-add"
      },
      {
        "id": "n02-r2-add-visible",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "\\begin{aligned}2+(-1)&=1\\\\1+0&=1\\\\-1+2&=1\\end{aligned}"
          }
        ],
        "derivationId": "n02-r2-add"
      },
      {
        "id": "formula-n02-06",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "(-3)+2="
          },
          {
            "type": "choice" as const,
            "itemId": "n02-06"
          }
        ],
        "derivationId": "n02-r2-add"
      },
      {
        "id": "n02-r2-add-after",
        "type": "paragraph" as const,
        "parts": [
          {
            "type": "text" as const,
            "text": "同じ次数では文字の部分を残し、いま計算した係数を前に置く。一次項の係数1は、通常の式では書かない。"
          }
        ],
        "derivationId": "n02-r2-add"
      },
      {
        "id": "n02-r2-add-result",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "A+B=x^3-x^2+x+1"
          }
        ],
        "derivationId": "n02-r2-add"
      },
      {
        "id": "heading-minus",
        "type": "heading" as const,
        "text": "マイナスは括弧の全ての項に掛かる"
      },
      {
        "id": "paragraph-minus-intro",
        "type": "paragraph" as const,
        "parts": [
          {
            "type": "text" as const,
            "text": "引き算は、引く式全体に-1を掛けて足すことに戻せる。Bの三次項はもともと負なので、-1を掛けると正になる。一方、二次項と定数項の係数は同じ2だから、同じ計算結果を再利用できる。"
          }
        ],
        "derivationId": "n02-r2-minus"
      },
      {
        "id": "n02-r2-minus-distribute",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "\\begin{aligned}-B={}&(-1)(-x^3)\\\\&+(-1)(2x^2)+(-1)\\cdot2\\end{aligned}"
          }
        ],
        "derivationId": "n02-r2-minus"
      },
      {
        "id": "n02-r2-minus-x3",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "(-1)\\times(-1)="
          },
          {
            "type": "choice" as const,
            "itemId": "n02-r2-q07-x3"
          }
        ],
        "derivationId": "n02-r2-minus"
      },
      {
        "id": "n02-r2-minus-reuse",
        "type": "paragraph" as const,
        "parts": [
          {
            "type": "text" as const,
            "text": "三次項の係数を決めた。次は、二次項と定数項で共通する係数2に-1を掛ける。同じ計算なので、一度求めた値を両方に使える。"
          }
        ],
        "derivationId": "n02-r2-minus"
      },
      {
        "id": "formula-n02-07",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "(-1)\\times2="
          },
          {
            "type": "choice" as const,
            "itemId": "n02-07"
          }
        ],
        "derivationId": "n02-r2-minus"
      },
      {
        "id": "n02-r2-minus-result",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "-B=x^3-2x^2-2"
          }
        ],
        "derivationId": "n02-r2-minus"
      },
      {
        "id": "paragraph-minus-add",
        "type": "paragraph" as const,
        "parts": [
          {
            "type": "text" as const,
            "text": "今求めた-BをAへ足す。括弧を外して符号を変える段階は済んでいるので、ここでは同じ次数の項だけを隣り合わせにする。文字の部分はそのままに、前に掛かる数を足していこう。"
          }
        ],
        "derivationId": "n02-r2-subtract"
      },
      {
        "id": "n02-r2-substitute-minus",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "\\begin{aligned}A-B={}&(2x^3-3x^2+x-1)\\\\&+(x^3-2x^2-2)\\end{aligned}"
          }
        ],
        "derivationId": "n02-r2-subtract"
      },
      {
        "id": "n02-r2-minus-groups",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "\\begin{aligned}A-B={}&(2+1)x^3\\\\&+(-3+(-2))x^2\\\\&+x+(-1+(-2))\\end{aligned}"
          }
        ],
        "derivationId": "n02-r2-subtract"
      },
      {
        "id": "n02-r2-minus-visible",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "\\begin{aligned}2+1&=3\\\\(-3)+(-2)&=-5\\end{aligned}"
          }
        ],
        "derivationId": "n02-r2-subtract"
      },
      {
        "id": "formula-n02-08",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "(-1)+(-2)="
          },
          {
            "type": "choice" as const,
            "itemId": "n02-08"
          }
        ],
        "derivationId": "n02-r2-subtract"
      },
      {
        "id": "n02-r2-subtract-result",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "A-B=3x^3-5x^2+x-3"
          }
        ],
        "derivationId": "n02-r2-subtract"
      },
      {
        "id": "paragraph-minus-summary",
        "type": "paragraph" as const,
        "parts": [
          {
            "type": "text" as const,
            "text": "「全項へ-1を掛ける」と「同類項をまとめる」を分けると、どの符号を処理しているかを確かめながら進められる。"
          }
        ],
        "derivationId": "n02-r2-subtract"
      },
      {
        "id": "marker-multiply-check",
        "type": "marker" as const,
        "kind": "check" as const,
        "text": "確認"
      },
      {
        "id": "paragraph-multiple-intro",
        "type": "paragraph" as const,
        "parts": [
          {
            "type": "text" as const,
            "text": "2A-3Bは、Aを2倍した式と、Bを-3倍した式を足す計算だ。まずAの全項へ2を配り、その後でBの全項へ-3を配る。一度に二つの完成式を見抜く必要はない。"
          }
        ],
        "derivationId": "n02-r2-two-a"
      },
      {
        "id": "n02-r2-two-a-source",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "2A=2(2x^3-3x^2+x-1)"
          }
        ],
        "derivationId": "n02-r2-two-a"
      },
      {
        "id": "n02-r2-two-a-distribute",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "\\begin{aligned}2A={}&2(2x^3)+2(-3x^2)\\\\&+2x+2(-1)\\end{aligned}"
          }
        ],
        "derivationId": "n02-r2-two-a"
      },
      {
        "id": "n02-r2-two-a-visible",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "\\begin{aligned}2\\times2&=4\\\\2\\times1&=2\\\\2\\times(-1)&=-2\\end{aligned}"
          }
        ],
        "derivationId": "n02-r2-two-a"
      },
      {
        "id": "n02-r2-two-a-coefficient",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "2\\times(-3)="
          },
          {
            "type": "choice" as const,
            "itemId": "n02-r2-q09-a2"
          }
        ],
        "derivationId": "n02-r2-two-a"
      },
      {
        "id": "n02-r2-two-a-result",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "2A=4x^3-6x^2+2x-2"
          }
        ],
        "derivationId": "n02-r2-two-a"
      },
      {
        "id": "n02-r2-three-b-intro",
        "type": "paragraph" as const,
        "parts": [
          {
            "type": "text" as const,
            "text": "Aの係数倍ができたので、次はBの全項へ-3を配る。Bの最初の項には、もともと負号が付いている。"
          }
        ],
        "derivationId": "n02-r2-three-b"
      },
      {
        "id": "n02-r2-three-b-source",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "-3B=-3(-x^3+2x^2+2)"
          }
        ],
        "derivationId": "n02-r2-three-b"
      },
      {
        "id": "n02-r2-three-b-distribute",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "\\begin{aligned}-3B={}&(-3)(-x^3)\\\\&+(-3)(2x^2)+(-3)\\cdot2\\end{aligned}"
          }
        ],
        "derivationId": "n02-r2-three-b"
      },
      {
        "id": "formula-n02-09",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "(-3)\\times(-1)="
          },
          {
            "type": "choice" as const,
            "itemId": "n02-09"
          }
        ],
        "derivationId": "n02-r2-three-b"
      },
      {
        "id": "n02-r2-three-b-reuse",
        "type": "paragraph" as const,
        "parts": [
          {
            "type": "text" as const,
            "text": "残る係数計算は、さきほどの2×(-3)と掛ける順が逆になったものだ。交換法則を使って、求めた値を再利用する。"
          }
        ],
        "derivationId": "n02-r2-three-b"
      },
      {
        "id": "n02-r2-three-b-coefficient",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "(-3)\\times2=2\\times(-3)=-6"
          }
        ],
        "derivationId": "n02-r2-three-b"
      },
      {
        "id": "n02-r2-three-b-result",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "-3B=3x^3-6x^2-6"
          }
        ],
        "derivationId": "n02-r2-three-b"
      },
      {
        "id": "paragraph-multiple-collect",
        "type": "paragraph" as const,
        "parts": [
          {
            "type": "text" as const,
            "text": "二つの式を別々に作れたので、ここで初めて足し合わせる。次数の違う項は足せない。同じ次数の係数を一組ずつ集めると、どの数を足しているかが式の中に残る。"
          }
        ],
        "derivationId": "n02-r2-multiple-add"
      },
      {
        "id": "n02-r2-multiple-substitute",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "\\begin{aligned}2A-3B={}&(4x^3-6x^2+2x-2)\\\\&+(3x^3-6x^2-6)\\end{aligned}"
          }
        ],
        "derivationId": "n02-r2-multiple-add"
      },
      {
        "id": "n02-r2-multiple-groups",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "\\begin{aligned}2A-3B={}&(4+3)x^3\\\\&+(-6+(-6))x^2\\\\&+2x+(-2+(-6))\\end{aligned}"
          }
        ],
        "derivationId": "n02-r2-multiple-add"
      },
      {
        "id": "n02-r2-multiple-visible",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "\\begin{aligned}4+3&=7\\\\(-2)+(-6)&=-8\\end{aligned}"
          }
        ],
        "derivationId": "n02-r2-multiple-add"
      },
      {
        "id": "formula-n02-10",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "(-6)+(-6)="
          },
          {
            "type": "choice" as const,
            "itemId": "n02-10"
          }
        ],
        "derivationId": "n02-r2-multiple-add"
      },
      {
        "id": "n02-r2-multiple-result",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "2A-3B=7x^3-12x^2+2x-8"
          }
        ],
        "derivationId": "n02-r2-multiple-add"
      },
      {
        "id": "heading-structure",
        "type": "heading" as const,
        "text": "長い式に戻す前に、まとまりを使う"
      },
      {
        "id": "marker-last-check",
        "type": "marker" as const,
        "kind": "check" as const,
        "text": "確認"
      },
      {
        "id": "paragraph-last-intro",
        "type": "paragraph" as const,
        "parts": [
          {
            "type": "text" as const,
            "text": "最後の式も、すぐにxの多項式へ戻す必要はない。AとBをまとまりのまま扱えば、既に計算した形へ戻せる。まず括弧の前のマイナスを、括弧内の二つの項へ配る。"
          }
        ],
        "derivationId": "n02-r2-structure"
      },
      {
        "id": "n02-r2-structure-source",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "3A-4B-(A-B)"
          }
        ],
        "derivationId": "n02-r2-structure"
      },
      {
        "id": "n02-r2-structure-sign",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "-(A-B)=-A"
          },
          {
            "type": "choice" as const,
            "itemId": "n02-r2-q11-sign"
          },
          {
            "type": "math" as const,
            "latex": "B"
          }
        ],
        "derivationId": "n02-r2-structure"
      },
      {
        "id": "n02-r2-structure-open",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "3A-4B-(A-B)=3A-4B-A+B"
          }
        ],
        "derivationId": "n02-r2-structure"
      },
      {
        "id": "n02-r2-structure-collect",
        "type": "paragraph" as const,
        "parts": [
          {
            "type": "text" as const,
            "text": "Aに掛かる数とBに掛かる数を、それぞれ集める。この単元の最初にxの次数ごとに整理したのと同じように、いまはAとBを別々のまとまりとして扱う。"
          }
        ],
        "derivationId": "n02-r2-structure"
      },
      {
        "id": "n02-r2-structure-groups",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "=(3-1)A+(-4+1)B"
          }
        ],
        "derivationId": "n02-r2-structure"
      },
      {
        "id": "n02-r2-structure-a",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "3-1=2"
          }
        ],
        "derivationId": "n02-r2-structure"
      },
      {
        "id": "formula-n02-11",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "(-4)+1="
          },
          {
            "type": "choice" as const,
            "itemId": "n02-11"
          }
        ],
        "derivationId": "n02-r2-structure"
      },
      {
        "id": "n02-r2-structure-result",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "3A-4B-(A-B)=2A-3B"
          }
        ],
        "derivationId": "n02-r2-structure"
      },
      {
        "id": "paragraph-reuse",
        "type": "paragraph" as const,
        "parts": [
          {
            "type": "text" as const,
            "text": "この2A-3Bは、直前にxの多項式として求めた式そのものだ。式の形が同じだと確かめれば、AとBの中身へ戻って同じ計算をやり直す必要はない。今求めた形を手掛かりに、その結果を利用しよう。"
          }
        ],
        "derivationId": "n02-r2-reuse"
      },
      {
        "id": "formula-n02-12",
        "type": "formula" as const,
        "parts": [
          {
            "type": "math" as const,
            "latex": "2A-3B="
          },
          {
            "type": "choice" as const,
            "itemId": "n02-12"
          }
        ],
        "derivationId": "n02-r2-reuse"
      },
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
      item("n02-06","二次の係数を、負号を含めて計算しよう。","-1",'formula',["1", "-5", "0"],'causal-reasoning','medium',["数直線で負の位置から正の向きへ進むと考えよう。"]),
      item("n02-r2-q07-x3","三次項に掛かる係数を、負の数どうしの積で計算しよう。","1",'formula',["-1", "0", "2"],'causal-reasoning','medium',["負の数に負の数を掛けた符号を確かめよう。"]),
      item("n02-07","二次項と定数項に共通する係数計算をしよう。","-2",'formula',["2", "0", "-1"],'causal-reasoning','medium',["正の2に-1を掛けると、符号が反転する。"]),
      item("n02-08","負の定数どうしを足して、定数項を決めよう。","-3",'formula',["1", "-1", "3"],'causal-reasoning','medium',["負の数をさらに足すと、数直線の負の向きへ進む。"]),
      item("n02-r2-q09-a2","Aの二次項の係数を2倍しよう。","-6",'formula',["6", "-3", "-5"],'causal-reasoning','medium',["正の数と負の数の積では、絶対値と符号を分けて考える。"]),
      item("n02-09","Bの三次項の係数に-3を掛けよう。","3",'formula',["-3", "1", "-1"],'causal-reasoning','medium',["Bの三次項の係数は-1。負の数どうしの積を使う。"]),
      item("n02-10","同じ二次項に掛かる負の係数を足そう。","-12",'formula',["0", "12", "-6"],'causal-reasoning','light',["符号が同じ負の数どうしなので、絶対値を足して負号を付ける。"]),
      {
        "id": "n02-r2-q11-sign",
        "label": "N02-R2-Q11-SIGN",
        "prompt": "括弧内の-Bに、外のマイナスを掛けた符号を選ぼう。",
        "answer": "+",
        "acceptedAnswers": [],
        "answerType": "formula" as const,
        "choices": [
          "+",
          "-"
        ],
        "purpose": "causal-reasoning" as const,
        "scaffoldLevel": "light" as const,
        "hints": [
          "外の-1は、Aだけでなく-Bにも掛かる。"
        ]
      },
      item("n02-11","Bの係数をまとめよう。","-3",'formula',["-5", "3", "-4"],'causal-reasoning','light',["負の4に正の1を足す。"]),
      item('n02-12','既に計算した2A-3Bの結果を再利用しよう。','7x^3-12x^2+2x-8','formula',
        ['3x^3-5x^2+x-3','x^3-x^2+x+1','7x^3-12x^2+2x-6'],'transfer','light',
        ['Qの番号ではなく、直前に求めた式の形を見返そう。']),
    ],
  }],
}

export const mathNumbersN02Unit = validateTextbookUnits([rawN02])[0]

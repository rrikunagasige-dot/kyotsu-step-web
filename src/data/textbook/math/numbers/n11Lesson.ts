import { validateTextbookUnits } from '../../../../domain/textbookSchema'
import { C, M, T, oneToOneSourceMap, reviewItem } from './reviewLessonHelpers'
import type { TextbookItem, TextbookReadingBlock } from '../../../../domain/textbookSchema'
import { makeReviewSteps } from './newBatchGuidedSteps'

export const n11SourceToItemIds = {
  ...oneToOneSourceMap('N11', 14),
  'N11-Q02': ['n11-02', 'n11-wm011-q02-compare'],
  'N11-Q03': ['n11-wm011-q03-factor', 'n11-wm011-q03-positive', 'n11-03', 'n11-wm011-q03-zero'],
  'N11-Q04': ['n11-wm011-q04-fraction', 'n11-04'],
}
const oldContent = makeReviewSteps('n11', [
  {
    title:'不等号の向きが変わる理由',
    intro:'不等式では、左右の大小関係を保つ操作と反転させる操作がある。先に具体的な数直線で見てから、差の符号を使って確かめる。',
    steps:[
      {q:1,lead:'2<5の両辺に−1を掛け、数直線上で左右の位置が逆転することを確かめる。',expr:'2<5',prompt:'負の1を掛けた後の不等号を選ぼう。',answer:'-2>-5',wrong:['-2<-5','-2=-5','2>-5'],hint:'−2は−5より数直線の右にある。',after:'負の数で両辺を掛けると、不等号の向きが逆になる。'},
      {q:2,lead:'一般にa<bなら差b−aは正。両方に同じcを加えた後の差を計算しよう。',expr:'(b+c)-(a+c)',prompt:'差を整理し、変化するかどうか確かめよう。',answer:'b-a',wrong:['b-a+2c','b-a-c','a-b'],hint:'+cと−cの項が打ち消し合う。',after:'両辺に同じ数を加えても、左右の差は変わらないので大小関係も保たれる。'},
      {q:3,lead:'a<bならb−aは正。掛け算後の差bc−acはc(b−a)と書ける。cの符号別に考える。',expr:'bc-ac=c(b-a)',prompt:'cの符号と不等号の対応を選ぼう。',kind:'text',answer:'c>0ならac<bc、c<0ならac>bc、c=0なら等しい',wrong:['c>0ならac>bc、c<0ならac<bc','cの符号に関係なくac<bc','c=0ならac<bcのまま'],hint:'b−aは正。正・負・0と掛けた結果の符号を順番に判断する。',after:'正の数では差の符号を保ち、負の数では逆転する。0倍では等号になり、0で割ることはできない。'},
      {q:4,lead:'a<bで両辺に負の1/5を掛け、その後に同じ3を足す例を考える。',expr:'a<b',prompt:'−a/5と−b/5、および3−aと3−bの向きを選ぼう。',answer:'-\\frac a5>-\\frac b5,\\quad3-a>3-b',wrong:['-\\frac a5<-\\frac b5,\\quad3-a<3-b','-\\frac a5>-\\frac b5,\\quad3-a<3-b','-\\frac a5<-\\frac b5,\\quad3-a>3-b'],hint:'どちらもa,bへ−1を掛けた関係を使う。正の5で割っても向きは変わらない。',after:'引き算の形でも、元の大小関係と操作の符号を分ければ判断できる。'},
    ],
  },
  {
    title:'変形して解の範囲を残す',
    intro:'不等式を解くとは、一つの数を求めることではなく、条件を満たすすべての実数の範囲を残すこと。',
    steps:[
      {q:5,lead:'3x−2<5を解く。左辺の定数−2をなくすため、両辺に施す同じ操作を選んでから不等式を変形しよう。',expr:'3x-2<5',prompt:'両辺への操作と、変形直後の不等式を組にして選ぼう。',answer:'\\text{両辺に }2\\text{ を足す},\\quad3x<7',wrong:['\\text{両辺から }2\\text{ を引く},\\quad3x<3','\\text{両辺に }2\\text{ を足す},\\quad3x>7','\\text{両辺に }2\\text{ を足す},\\quad x<7'],hint:'−2を打ち消す数を両辺に加えよう。加減だけなら不等号の向きは変わらない。',after:'両辺に2を足して3x<7となる。正負の倍率を使っていないので不等号はそのまま。'},
      {q:6,lead:'3x<7から係数を1にする操作と、不等号の向きを考えよう。',expr:'3x<7',prompt:'操作と変形結果を組にして選ぼう。',answer:'\\text{両辺を正の}3\\text{で割る},\\quad x<\\frac73',wrong:['\\text{両辺を負の}3\\text{で割る},\\quad x>\\frac73','\\text{両辺を正の}3\\text{で割る},\\quad x>\\frac73','\\text{両辺を正の}3\\text{で割る},\\quad x\\le\\frac73'],hint:'正の3で割るので向きはそのまま。等号が付いていたかも確認する。',after:'解は「7/3より小さい実数すべて」であり、ひとつの値ではない。'},
      {q:7,lead:'境界x=7/3を元の不等式に代入すると、左右は同じ値になる。',expr:'3\\left(\\frac73\\right)-2<5',prompt:'境界の値が含まれるかを選ぼう。',kind:'text',answer:'含まれない（等号となり<を満たさない）',wrong:['含まれる（左右が等しくなるから）','含まれる（3は正だから）','判断できない（分数だから）'],hint:'元の記号は「<」で、等号は許されていない。',after:'厳密不等号の境界は数直線では白丸で表す。'},
      {q:8,lead:'−2x+3≤5で左辺の定数を消すには、両辺に何をすればよいだろう。',expr:'-2x+3\\le5',prompt:'操作と変形結果を組にして選ぼう。',answer:'\\text{両辺から}3\\text{を引く},\\quad-2x\\le2',wrong:['\\text{両辺に}3\\text{を足す},\\quad-2x\\le8','\\text{両辺から}3\\text{を引く},\\quad-2x\\ge2','\\text{両辺から}3\\text{を引く},\\quad2x\\le2'],hint:'同じ数を加減した段階では不等号の向きは変わらない。',after:'次はxの係数を1にする操作を選び、不等号の向きを確かめる。'},
      {q:9,lead:'−2x≤2から係数を1にする。割る数の符号と不等号の向きを判断しよう。',expr:'-2x\\le2',prompt:'操作と変形結果を組にして選ぼう。',answer:'\\text{両辺を}-2\\text{で割る},\\quad x\\ge-1',wrong:['\\text{両辺を}-2\\text{で割る},\\quad x\\le-1','\\text{両辺を}2\\text{で割る},\\quad x\\le1','\\text{両辺を}-2\\text{で割る},\\quad x>-1'],hint:'−2で割ると向きが逆になり、右辺は−1になる。',after:'負数除算は符号だけでなく、不等号の向きもセットで扱う。'},
      {q:10,lead:'x=−1を元の−2x+3≤5に戻して、境界に等号を含めてよいか調べる。',expr:'-2(-1)+3\\le5',prompt:'境界を含むかどうか、根拠とともに選ぼう。',kind:'text',answer:'含む（代入すると5≤5）',wrong:['含まない（負の数だから）','含まない（代入すると5<5）','含む（不等号を逆にしないから）'],hint:'元の≤は等号を許し、境界を代入すると左右が一致する。',after:'境界の黒丸と白丸の違いは、不等号に等号があるかどうかから決まる。'},
    ],
  },
  {
    title:'括弧・分数があっても同じ規則',
    intro:'長い不等式では、まず展開と移項をしてから係数の符号を確かめる。移項とは左右に同じ式を加減すること。',
    marker:'check',
    steps:[
      {q:11,lead:'3(2x+3)≥10x−17を展開し、x項を左、定数項を右へ集める。',expr:'3(2x+3)\\ge10x-17',prompt:'整理した不等式を選ぼう。',answer:'-4x\\ge-26',wrong:['-4x\\le-26','4x\\ge-26','-4x\\ge26'],hint:'左は6x+9。両辺から10xと9を引く。',after:'係数が負の−4になったことが次の変形の要点である。'},
      {q:12,lead:'−4x≥−26を負の−4で割る。不等号の反転と分数の符号の両方を確認しよう。',expr:'-4x\\ge-26',prompt:'解の範囲を選ぼう。',answer:'x\\le\\frac{13}{2}',wrong:['x\\ge\\frac{13}{2}','x\\le-\\frac{13}{2}','x<\\frac{13}{2}'],hint:'負の数で割るので≥は≤になり、負÷負は正。',after:'境界で等号が成立するので、その値も解に含む。'},
      {q:13,lead:'(x−2)/3≤2x+1の分母をなくす操作と、その直後の不等式を考えよう。',expr:'\\frac{x-2}{3}\\le2x+1',prompt:'操作と変形結果を組にして選ぼう。',answer:'\\text{両辺に正の}3\\text{を掛ける},\\quad x-2\\le6x+3',wrong:['\\text{両辺に正の}3\\text{を掛ける},\\quad x-2\\ge6x+3','\\text{両辺に正の}3\\text{を掛ける},\\quad x-2\\le2x+3','\\text{両辺に負の}3\\text{を掛ける},\\quad x-2\\le6x+3'],hint:'右辺の2xと1の両方に3を掛ける。',after:'分母を払った後は通常の一次不等式として移項できる。'},
      {q:14,lead:'x−2≤6x+3のxを右に集め、定数を左に集める。',expr:'x-2\\le6x+3',prompt:'最終的な解の範囲を選ぼう。',answer:'x\\ge-1',wrong:['x\\le-1','x\\ge1','x>-1'],hint:'−5≤5xとなり、正の5で割る。',after:'括弧や分数の有無に関係なく、各変形で同じ条件を保てているか確かめる。'},
    ],
  },
], [
  {id:'n11-f01',q:1,when:'before'},
  {id:'n11-f02',q:10,when:'after'},
])
// W-MATH-011/P-001: *only* N11's first four original source markers use
// staged, hand-authored proof decisions. Keep Q05–Q14's original generated
// reading flow and keys verbatim, and the two original Word figures untouched.
const firstItems: TextbookItem[] = [
  reviewItem('n11-01', '数直線の−2と−5を比べよう。', '-2>-5', 'formula',
    ['-2<-5', '-2=-5', '2>-5'], 'concept-formation', 'strong', ['右側の点ほど大きい数を表す。']),
  reviewItem('n11-02', '両辺に同じcを加えたあとの差を計算しよう。', 'b-a', 'formula',
    ['b-a+2c', 'b-a-c', 'a-b'], 'causal-reasoning', 'strong', ['+cと−cを整理しよう。']),
  reviewItem('n11-wm011-q02-compare', '差の符号を根拠に、加えたあとの大小関係を選ぼう。',
    'a+c<b+c,\\quad\\text{差は正のまま}', 'formula',
    ['a+c>b+c,\\quad\\text{差は負になる}', 'a+c=b+c,\\quad\\text{差は0}',
     'a+c>b+c,\\quad\\text{差は正のまま}'], 'causal-reasoning', 'medium',
    ['右−左の差が正なら、どちらが大きいだろう。']),
  reviewItem('n11-wm011-q03-factor', '共通の(b−a)を残して、括り出す係数を選ぼう。',
    'c', 'formula', ['-c', 'c^2', '1'], 'causal-reasoning', 'medium',
    ['bc−acを分配法則の逆向きで見よう。']),
  reviewItem('n11-wm011-q03-positive', 'c>0のとき、差の符号と大小関係を判断しよう。',
    'ac<bc,\\quad bc-ac>0', 'formula',
    ['ac>bc,\\quad bc-ac<0', 'ac=bc,\\quad bc-ac=0', 'ac<bc,\\quad bc-ac<0'],
    'causal-reasoning', 'medium', ['正の数と正の数の積は正。右−左が正なら左が小さい。']),
  reviewItem('n11-03', 'c<0のとき、差の符号と大小関係を判断しよう。',
    'ac>bc,\\quad bc-ac<0', 'formula',
    ['ac<bc,\\quad bc-ac>0', 'ac=bc,\\quad bc-ac=0', 'ac>bc,\\quad bc-ac>0'],
    'causal-reasoning', 'medium', ['負の数×正の数は負。右−左が負なら左が大きい。']),
  reviewItem('n11-wm011-q03-zero', 'c=0のとき、両辺と厳密な不等号はどうなるだろう。',
    'ac=bc=0,\\quad\\text{元の厳密な大小は失われる}', 'formula',
    ['ac<bc,\\quad\\text{そのまま保つ}', 'ac>bc,\\quad\\text{逆転する}',
     'ac=bc=0,\\quad\\text{元の不等号を保つ}'],
    'causal-reasoning', 'medium', ['左右とも0。等号になると元の「<」は成り立たない。']),
  reviewItem('n11-wm011-q04-fraction', 'a<bの両辺に負の1/5を掛けるとどうなるだろう。',
    '-\\frac a5>-\\frac b5,\\quad\\text{負数倍なので反転}', 'formula',
    ['-\\frac a5<-\\frac b5,\\quad\\text{向きを保つ}',
     '-\\frac a5=-\\frac b5,\\quad\\text{等号になる}',
     '-\\frac a5>-\\frac b5,\\quad\\text{正数倍なので反転}'],
    'transfer', 'light', ['倍率−1/5は負。先ほど確かめた差の符号を使おう。']),
  reviewItem('n11-04', 'a<bから−1倍と+3を順に行った大小関係を選ぼう。',
    '3-a>3-b', 'formula',
    ['3-a<3-b', '3-a=3-b', '3+a>3+b'],
    'transfer', 'light', ['独立した変形として−a>−bから両辺に3を足す。']),
]

const firstFlow: TextbookReadingBlock[] = [
  { id: 'n11-heading-1', type: 'heading', text: '不等号の向きが変わる理由' },
  { id: 'n11-marker-1', type: 'marker', kind: 'proof', text: '導出' },
  { id: 'n11-group-1', type: 'paragraph', parts: [T('2<5の両辺に同じ数を加えたり引いたりすると、どうなるだろう。たとえば2を引くと0<3、正の4を掛けると8<20となる。では負の数を掛けたときは、数直線上の位置で確かめよう。')] },
  { id: 'n11-show-n11-f01', type: 'figure', figureId: 'n11-f01' },
  { id: 'n11-lead-01', type: 'paragraph', parts: [T('元の2と5の位置、符号を変えた−2と−5の位置を見比べよう。'), M('2<5') ] },
  { id: 'n11-formula-01', type: 'formula', parts: [M('-2\\;\\mathrel{?}\\;-5\\quad'), C('n11-01')] },
  { id: 'n11-after-01', type: 'paragraph', parts: [T('−2は−5より数直線の右側にある。具体例で並び方の変化が見えた。次は一般の文字で、差の符号から理由を確かめる。')] },

  { id: 'n11-lead-02', type: 'paragraph', parts: [T('a<bならば右から左を引いた差b−aは正になる。aとbに同じcを足したときの差を、先に計算しよう。'), M('(b+c)-(a+c)')] },
  { id: 'n11-formula-02', type: 'formula', parts: [M('(b+c)-(a+c)='), C('n11-02')] },
  { id: 'n11-after-02', type: 'paragraph', parts: [T('展開するとb+c−a−c。cと−cが打ち消し合うので、差は元のb−aのままだ。ここから大小を決めよう。')] },
  { id: 'n11-lead-wm011-q02-compare', type: 'paragraph', parts: [T('元の差b−aは正で、足したあとの右−左の差も同じ正の値である。')] },
  { id: 'n11-formula-wm011-q02-compare', type: 'formula', parts: [C('n11-wm011-q02-compare')] },
  { id: 'n11-after-wm011-q02-compare', type: 'paragraph', parts: [T('両方に同じ数を足しても差の符号は変わらない。したがって不等号の向きは保たれる。引き算は負の数を足すことなので同じ理由で成り立つ。')] },

  { id: 'n11-lead-wm011-q03-factor', type: 'paragraph', parts: [T('掛け算の場合も、右−左の差を調べる。bとaに同じcを掛けると差はbc−ac。分配法則の逆を使い、共通の係数を括り出そう。')] },
  { id: 'n11-formula-wm011-q03-factor', type: 'formula', parts: [M('bc-ac='), C('n11-wm011-q03-factor'), M('(b-a)')] },
  { id: 'n11-after-wm011-q03-factor', type: 'paragraph', parts: [T('よってbc−ac=c(b−a)。b−aは正だから、この積の符号はcの符号によって決まる。')] },
  { id: 'n11-lead-wm011-q03-positive', type: 'paragraph', parts: [T('まずc>0を考える。正の数同士を掛けたc(b−a)はどの符号になるだろう。'), M('c>0,\\quad b-a>0')] },
  { id: 'n11-formula-wm011-q03-positive', type: 'formula', parts: [C('n11-wm011-q03-positive')] },
  { id: 'n11-after-wm011-q03-positive', type: 'paragraph', parts: [T('右−左の差が正だから、cが正のときはac<bcであり、不等号はそのままになる。')] },
  { id: 'n11-lead-03', type: 'paragraph', parts: [T('ではc<0にする。負の数と正の数の積から右−左の差を判断しよう。'), M('c<0,\\quad b-a>0')] },
  { id: 'n11-formula-03', type: 'formula', parts: [C('n11-03')] },
  { id: 'n11-after-03', type: 'paragraph', parts: [T('右−左の差が負なら、右の数bcのほうが小さい。したがって負数を掛けたときはac>bcとなる。')] },
  { id: 'n11-lead-wm011-q03-zero', type: 'paragraph', parts: [T('最後にc=0を考える。両辺はどの数になるだろう。'), M('c=0')] },
  { id: 'n11-formula-wm011-q03-zero', type: 'formula', parts: [C('n11-wm011-q03-zero')] },
  { id: 'n11-after-wm011-q03-zero', type: 'paragraph', parts: [T('整理すると、正の数を両辺に掛けると不等号を保ち、負の数では向きが逆になり、0倍では等号になる。0で割ることはできない。')] },

  { id: 'n11-lead-wm011-q04-fraction', type: 'paragraph', parts: [T('証明した規則を二つの別々の式で確かめる。一つ目はa<bの両辺に負の1/5を掛ける場合だ。'), M('a<b')] },
  { id: 'n11-formula-wm011-q04-fraction', type: 'formula', parts: [C('n11-wm011-q04-fraction')] },
  { id: 'n11-after-wm011-q04-fraction', type: 'paragraph', parts: [T('負の1/5倍では大小が反転する。これは次の式と独立した変形である。')] },
  { id: 'n11-lead-04', type: 'paragraph', parts: [T('二つ目は元のa<bに戻って、両辺に−1を掛けてから3を足す。先ほどの−1/5倍の式に3を足すわけではない。'), M('a<b\\quad\\Longrightarrow\\quad-a>-b')] },
  { id: 'n11-formula-04', type: 'formula', parts: [C('n11-04')] },
  { id: 'n11-after-04', type: 'paragraph', parts: [T('−1倍したあとに同じ3を足すので3−a>3−bとなる。−1/5倍の式に3を足すなら3−a/5>3−b/5であり、二つの操作は区別する。')] },
]
const restReadingIndex = oldContent.readingFlow.findIndex(block => block.id === 'n11-heading-2')
if (restReadingIndex < 0) throw new Error('N11 second-group boundary disappeared')
const content = {
  readingFlow: [...firstFlow, ...oldContent.readingFlow.slice(restReadingIndex)],
  items: [...firstItems, ...oldContent.items.filter(item => !['n11-01', 'n11-02', 'n11-03', 'n11-04'].includes(item.id))],
}

const rawN11={
  schemaVersion:'1.1' as const,unitId:'math-numbers-expressions-n11',revision:4,status:'review' as const,subject:'math-1a' as const,
  chapter:{chapterId:'math-ch01-numbers-expressions',chapterNumber:'1',chapterTitle:'数と式',unitCode:'1NUM',orderInChapter:11,sourcePages:[27,28,29]},
  title:'大小関係を保つ変形を選ぶ',subtitle:'不等号が変わる根拠を、差の符号と数直線で確かめる。',
  source:{type:'reference' as const,label:'ユーザー提供「数と式」教科書モード対話段階導入版 v2 / N11',
    rightsNote:'教師編集Word N11原問14件と元数直線2点を使用。独立解答、公式別冊未提供、レビュー限定。'},
  objectives:['正負の倍率で不等号がどう変わるか証明する','一次不等式を一段ずつ解く','開いた端点と閉じた端点を元の式で確かめる'],
  sections:[{id:'lesson',number:'11',title:'本文',role:'concept' as const,
    description:'不等号の根拠から実数の解の範囲へ進む。',
    figures:[
      {id:'n11-f01',src:'/assets/math/textbook/numbers/n11-f01.png',alt:'元Wordの数直線。2と5、符号を変えた−2と−5の位置関係を上下に示す。',caption:'両辺の符号を変えると、位置関係はどうなるだろう。',overlays:[]},
      {id:'n11-f02',src:'/assets/math/textbook/numbers/n11-f02.png',alt:'二つの不等式の解の範囲を、白丸・黒丸を区別した元の完成数直線。',caption:'境界の含有を解いた後で数直線でも確認する。',overlays:[]},
    ],readingFlow:content.readingFlow,items:content.items}],
}
export const mathNumbersN11Unit=validateTextbookUnits([rawN11])[0]

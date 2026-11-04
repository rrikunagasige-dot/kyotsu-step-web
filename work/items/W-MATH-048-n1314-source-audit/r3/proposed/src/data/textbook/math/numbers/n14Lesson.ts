import { validateTextbookUnits, type TextbookItem, type TextbookReadingBlock } from '../../../../domain/textbookSchema'
import { oneToOneSourceMap, T, M, C, reviewItem } from './reviewLessonHelpers'
import { makeReviewSteps } from './newBatchGuidedSteps'

export const n14SourceToItemIds = oneToOneSourceMap('N14', 16)
n14SourceToItemIds['N14-Q07'] = ['n14-wm014-q07-nonnegative', 'n14-wm014-q07-negative', 'n14-07']
n14SourceToItemIds['N14-Q08'] = ['n14-wm015-q08-nonnegative', 'n14-wm015-q08-negative', 'n14-08']
n14SourceToItemIds['N14-Q12'] = ['n14-wm016-q12-left', 'n14-wm016-q12-right', 'n14-12']
n14SourceToItemIds['N14-Q10'] = ['n14-wm018-q10-add-left', 'n14-wm018-q10-add-center', 'n14-wm018-q10-add-right', 'n14-10', 'n14-wm018-q10-bound-right']
n14SourceToItemIds['N14-Q14'] = ['n14-wm019-q14-add-left', 'n14-wm019-q14-add-center', 'n14-wm019-q14-add-right', 'n14-14', 'n14-wm019-q14-bound-right']
n14SourceToItemIds['N14-Q15'] = ['n14-wm020-q15-divide-left', 'n14-wm020-q15-divide-center', 'n14-wm020-q15-divide-right', 'n14-15', 'n14-wm020-q15-bound-right']
n14SourceToItemIds['N14-Q16'] = ['n14-wm022-q16-left-inner', 'n14-wm022-q16-left-abs', 'n14-wm022-q16-right-inner', 'n14-wm022-q16-right-abs', 'n14-16']
const originalContent = makeReviewSteps('n14', [
  {
    title:'近い点は内側、遠い点は外側',
    intro:'絶対値の不等式を距離の条件として読む。「より近い」と「少なくともこれだけ遠い」では残す範囲が反対になる。',
    steps:[
      {q:1,lead:'|x|<3は、数直線上で原点からの距離に上限を付けた条件。',expr:'|x|<3',prompt:'言葉で表した条件を選ぼう。',kind:'text',answer:'原点からの距離が3より小さい',wrong:['原点からの距離が3より大きい','座標が3より大きい','原点からの距離が3以上'],hint:'絶対値は座標の符号ではなく原点からの距離。',after:'境界になる位置を先に見つけ、そこからどちら側を残すか判断する。'},
      {q:2,lead:'原点からの距離がちょうど3になる点は左右に一つずつある。',expr:'|x|=3',prompt:'二つの境界を選ぼう。',answer:'x=-3,\\quad x=3',wrong:['x=0,\\quad x=3','x=-3,\\quad x=0','x=3,\\quad x=6'],hint:'3だけ左へ動いた点と3だけ右へ動いた点。',after:'距離が3未満なら二点の間にある点だけを残す。'},
      {q:3,lead:'|x|<3の意味から、−3と3の間か外側か、端点を含むかを判断する。',expr:'|x|<3',prompt:'残す位置と境界の扱いを選ぼう。',kind:'text',answer:'二点の間、両端を含まない',wrong:['二点の外側、両端を含まない','二点の間、両端を含む','二点の外側、両端を含む'],hint:'近い位置は原点の近く。記号は<なので等号を許さない。',after:'範囲は左右二つの境界の内側で、端点は白丸になる。'},
      {q:4,lead:'残す区間を一つの二重不等式へ書き換える。',expr:'|x|<3',prompt:'xについての範囲を選ぼう。',answer:'-3<x<3',wrong:['x<-3\\;\\text{または}\\;x>3','-3\\le x\\le3','3<x<-3'],hint:'xは−3より大きく、かつ3より小さい。',after:'二重不等式は左右両方の条件を同時に満たす数全体を表す。'},
      {q:5,lead:'今度は|x|≥4を数直線上の距離として読もう。境界の二点を求め、間と外側のどちらを残すか、境界を含むかを考えよう。',expr:'|x|\\ge4',prompt:'境界・内外・等号の扱いを選ぼう。',kind:'text',answer:'境界−4と4、外側、端点を含む',wrong:['境界−4と4、内側、端点を含む','境界−4と4、外側、端点を含まない','境界0と4、外側、端点を含む'],hint:'遠い点は原点の左右どちらか外側。≥には等号がある。',after:'原点から遠い範囲は、右と左に分かれた二つの区間となる。'},
      {q:6,lead:'直前に決めた境界・内外・端点の扱いを、xについての二つの不等式へ翻訳しよう。二つの枝をどう結ぶかも自分で判断する。',expr:'|x|\\ge4',prompt:'残す範囲と二つの枝のつなぎ方を選ぼう。',answer:'x\\le-4\\;\\text{または}\\;x\\ge4',wrong:['-4\\le x\\le4','x<-4\\;\\text{または}\\;x>4','x\\le-4\\;\\text{かつ}\\;x\\ge4'],hint:'左右に離れた二つの範囲のいずれかを満たせばよい。等号も確認する。',after:'境界を含む左右の外側なのでx≤−4またはx≥4となる。二つの問題を解いたので完成原図で比較しよう。'},
    ],
  },
  {
    title:'距離の規則を一般化する',
    intro:'境界の距離を正の数aとし、中の式全体をXと見ても、数直線の意味は同じである。',
    marker:'proof',
    steps:[
      {q:7,lead:'a>0で|X|<aなら、Xは−aからaまでの内側にある。',expr:'|X|<a\\quad(a>0)',prompt:'絶対値なしの一つの範囲を選ぼう。',answer:'-a<X<a',wrong:['X<-a\\;\\text{または}\\;X>a','-a\\le X\\le a','a<X<-a'],hint:'距離の上限は二つの境界の間で、等号を含まない。',after:'Xが文字式でも、式全体を一つの数としてこの関係を使える。'},
      {q:8,lead:'逆に|X|>aでは、距離がaより大きい外側だけが残る。',expr:'|X|>a\\quad(a>0)',prompt:'絶対値のない二つの範囲を選ぼう。',answer:'X<-a\\;\\text{または}\\;X>a',wrong:['-a<X<a','X\\le-a\\;\\text{または}\\;X\\ge a','X<-a\\;\\text{かつ}\\;X>a'],hint:'左右の外側に分かれ、等号を含まない。',after:'上限なら内側、下限なら外側。等号が付く場合は境界も含める。'},
    ],
  },
  {
    title:'中の式を一つの数として変形する',
    intro:'絶対値を外した後も不等式は続く。二重不等式なら三辺すべてに同じ操作をし、外側の条件なら二枝をそれぞれ解く。',
    marker:'check',
    steps:[
      {q:9,lead:'|x−3|<5を解く。中身x−3全体をXと見て、一般化した内側の規則を使う。',expr:'|x-3|<5',prompt:'最初に得られる二重不等式を選ぼう。',answer:'-5<x-3<5',wrong:['x-3<-5\\;\\text{または}\\;x-3>5','-5\\le x-3\\le5','-5<x<5'],hint:'まだ3を移動せず、中身x−3のまま−5と5の間に挟む。',after:'次は三辺に同じ操作をして、中央をxだけにする。'},
      {q:10,lead:'−5<x−3<5の中央をxだけにするには、三辺にどの操作を行えばよいだろう。',expr:'-5<x-3<5',prompt:'操作と変形結果を組にして選ぼう。',answer:'\\text{三辺に}3\\text{を足す},\\quad-2<x<8',wrong:['\\text{三辺から}3\\text{を引く},\\quad-8<x<2','\\text{三辺に}3\\text{を足す},\\quad-2\\le x\\le8','\\text{三辺に}3\\text{を足す},\\quad-5<x<8'],hint:'左端は−5+3、右端は5+3。両端の記号は変わらない。',after:'二重不等式では一部だけ移項すると同値な条件にならない。'},
      {q:11,lead:'|x+3|≥2の絶対値を外す。中身x+3を一つの数Xと考え、距離の下限が表す領域と等号の扱いを判断しよう。',expr:'|x+3|\\ge2',prompt:'内外と端点を判断し、絶対値を外した二条件を選ぼう。',answer:'x+3\\le-2\\;\\text{または}\\;x+3\\ge2',wrong:['-2\\le x+3\\le2','x+3<-2\\;\\text{または}\\;x+3>2','x+3\\le-2\\;\\text{かつ}\\;x+3\\ge2'],hint:'≥という距離の下限を、x+3が取りうる位置として数直線で想像しよう。端点を含むかも考える。',after:'外側で端点を含むため、x+3≤−2またはx+3≥2。続いて各枝をxについて解く。'},
      {q:12,lead:'二つの不等式x+3≤−2またはx+3≥2を別々に解く。',expr:'|x+3|\\ge2',prompt:'最終的な二領域を選ぼう。',answer:'x\\le-5\\;\\text{または}\\;x\\ge-1',wrong:['-5\\le x\\le-1','x<-5\\;\\text{または}\\;x>-1','x\\le-1\\;\\text{または}\\;x\\ge5'],hint:'両方の枝から同じ3を引くが、枝どうしは結合しない。',after:'距離の下限は区間の外側という意味が最後まで保たれている。'},
      {q:13,lead:'|3x−2|≤4では等号を含む距離の上限。内側の二重不等式を作る。',expr:'|3x-2|\\le4',prompt:'絶対値を外した条件を選ぼう。',answer:'-4\\le3x-2\\le4',wrong:['3x-2\\le-4\\;\\text{または}\\;3x-2\\ge4','-4<3x-2<4','-4\\le3x\\le4'],hint:'≤では内側の両端も残し、中身全体を挟む。',after:'次は三辺に共通する操作を考え、中央の定数を整理する。'},
      {q:14,lead:'−4≤3x−2≤4の定数を消す、三辺共通の操作を考えよう。',expr:'-4\\le3x-2\\le4',prompt:'操作と変形結果を組にして選ぼう。',answer:'\\text{三辺に}2\\text{を足す},\\quad-2\\le3x\\le6',wrong:['\\text{三辺から}2\\text{を引く},\\quad-6\\le3x\\le2','\\text{三辺に}2\\text{を足す},\\quad-2<3x<6','\\text{三辺に}2\\text{を足す},\\quad-2\\le3x\\le4'],hint:'左端−4+2、右端4+2をどちらも計算する。',after:'三辺に同じ変形を行い、中央のxの係数を1にする段階へ進もう。'},
      {q:15,lead:'−2≤3x≤6の中央の係数を1にする操作と、得られる範囲を考えよう。',expr:'-2\\le3x\\le6',prompt:'操作と変形結果を組にして選ぼう。',answer:'\\text{三辺を正の}3\\text{で割る},\\quad-\\frac23\\le x\\le2',wrong:['\\text{三辺を正の}3\\text{で割る},\\quad-\\frac23<x<2','\\text{三辺を正の}3\\text{で割る},\\quad-2\\le x\\le6','\\text{三辺を負の}3\\text{で割る},\\quad-\\frac23\\le x\\le2'],hint:'両端を3で割る。等号の有無は変えない。',after:'最後に両端を元の|3x−2|へ戻して、本当に等号が成立するか検査する。'},
      {q:16,lead:'左端x=−2/3と右端x=2をそれぞれ3x−2へ代入し、絶対値が4になるか確かめる。',expr:'|3x-2|\\quad\\left(x=-\\frac23,\\;2\\right)',prompt:'両端の代入結果を選ぼう。',answer:'|-4|=4,\\quad|4|=4',wrong:['|-4|=-4,\\quad|4|=4','|-2|=2,\\quad|4|=4','|-4|=4,\\quad|2|=2'],hint:'x=−2/3では3x−2=−4、x=2では3x−2=4。距離はいずれも非負。',after:'両端とも元の条件を等号で満たすため含める。これで絶対値不等式の範囲が完成した。'},
    ],
  },
], [{id:'n14-f01',q:6,when:'after'}])

// W-MATH-014/P-001 — under the EXISTING source marker N14-Q07,
// derive the two signs before asking for the original four-choice union.
// Do not alter N14-Q08 / Q12, figure n14-f01 or old n14-07 answer.
const newQ07Items: TextbookItem[] = [
  reviewItem('n14-wm014-q07-nonnegative',
    'Xが0以上のとき、|X|<aとX≥0の両方から範囲を考えよう。',
    '0\\le X<a', 'formula', ['0\\le X\\le a', 'X>a', '-a<X<0'],
    'causal-reasoning', 'medium',
    ['X≥0では絶対値を外すとXのまま。もとの「より小さい」は厳密な不等号。']),
  reviewItem('n14-wm014-q07-negative',
    'Xが負のとき、−X<aを解き、X<0と組み合わせよう。',
    '-a<X<0', 'formula', ['-a\\le X<0', 'X<-a', '0\\le X<a'],
    'causal-reasoning', 'medium',
    ['Xに直すため−1倍すると、不等号の向きが逆になる。X<0も忘れない。']),
]
const firstQ07 = originalContent.readingFlow.findIndex(block => block.id === 'n14-lead-07')
const lastQ07 = originalContent.readingFlow.findIndex(block => block.id === 'n14-after-07')
const q08Start = originalContent.readingFlow.findIndex(block => block.id === 'n14-lead-08')
const oldQ07Index = originalContent.items.findIndex(item => item.id === 'n14-07')
if (firstQ07 < 0 || lastQ07 < firstQ07 || q08Start <= lastQ07 || oldQ07Index !== 6)
  throw new Error('N14-Q07 approved source boundary has changed')
const q07Flow: TextbookReadingBlock[] = [
  { id: 'n14-lead-wm014-q07-nonnegative', type: 'paragraph', parts: [
    T('距離の規則を一般の数Xで考える。a>0とし、まずXが0以上の場合を調べよう。'),
    M('|X|<a\\quad(a>0)'),
    T('X≥0なら|X|=Xとなる。この場合に成り立つXの範囲を選ぼう。'),
  ] },
  { id: 'n14-formula-wm014-q07-nonnegative', type: 'formula', parts: [
    C('n14-wm014-q07-nonnegative'),
  ] },
  { id: 'n14-after-wm014-q07-nonnegative', type: 'paragraph', parts: [
    T('X≥0なので|X|=X。よってX<aであり、二つの条件を合わせて0≤X<aとなる。'),
  ] },
  { id: 'n14-lead-wm014-q07-negative', type: 'paragraph', parts: [
    T('次にXが負の場合を調べる。X<0なら|X|=−Xだから、−X<aとなる。両辺に−1を掛けると不等号は反転する。X<0も考慮した範囲を選ぼう。'),
    M('-X<a\\quad(X<0)'),
  ] },
  { id: 'n14-formula-wm014-q07-negative', type: 'formula', parts: [
    C('n14-wm014-q07-negative'),
  ] },
  { id: 'n14-after-wm014-q07-negative', type: 'paragraph', parts: [
    T('−X<aの両辺を−1倍するとX>−a。X<0と合わせて−a<X<0となる。'),
  ] },
  { id: 'n14-lead-07', type: 'paragraph', parts: [
    T('X≥0とX<0の二つの場合を合わせよう。いずれか一方に入るX全体を、絶対値なしの一つの範囲で表す。'),
    M('|X|<a\\quad(a>0)'),
  ] },
  // Keep the original final item, its four original choices and review key.
  originalContent.readingFlow[firstQ07 + 1],
  originalContent.readingFlow[lastQ07],
  { id: 'n14-after-wm014-q07-converse', type: 'paragraph', parts: [
    T('逆も確かめる。今得た範囲にXがあるとする。X≥0なら|X|=X<a。X<0ならX>−aより−X<aであり、|X|=−X<a。どちらも元の条件を満たすので、両方向が成り立つ。'),
    M('|X|<a\\iff -a<X<a\\quad(a>0)'),
  ] },
]
if (originalContent.readingFlow[firstQ07+1].id !== 'n14-formula-07')
  throw new Error('original n14-07 final choice block changed')
// W-MATH-015/P-001 — source Q08 only, after frozen approved Q07 block.
// Keep original final n14-08 (same answer+3 distractors and history).
const newQ08Items: TextbookItem[] = [
  reviewItem('n14-wm015-q08-nonnegative',
    'Xが0以上のとき、|X|>aを絶対値のない条件へ直そう。',
    'X>a', 'formula', ['X\\ge a', '0\\le X<a', 'X<-a'],
    'causal-reasoning', 'medium',
    ['X≥0なら|X|はXのまま。元の不等号は「より大きい」。']),
  reviewItem('n14-wm015-q08-negative',
    'Xが負のとき、−X>aを解こう。',
    'X<-a', 'formula', ['X\\le-a', 'X>-a', 'X>a'],
    'causal-reasoning', 'medium',
    ['−1を掛けると不等号の向きが変わる。']),
]
const q08End = originalContent.readingFlow.findIndex(block => block.id === 'n14-after-08')
const oldQ08Index = originalContent.items.findIndex(item => item.id === 'n14-08')
if (q08Start <= lastQ07 || q08End <= q08Start || oldQ08Index !== 7
    || originalContent.readingFlow[q08Start+1].id !== 'n14-formula-08')
  throw new Error('Approved N14-Q08 source boundary changed')
const q08Flow: TextbookReadingBlock[] = [
  { id: 'n14-lead-wm015-q08-nonnegative', type: 'paragraph', parts: [
    T('次は原点からの距離がaより大きい場合を考える。a>0として、まずXが0以上のとき。'),
    M('|X|>a\\quad(a>0)'),
    T('X≥0では|X|=X。この場合に必要な条件を選ぼう。'),
  ] },
  { id: 'n14-formula-wm015-q08-nonnegative', type: 'formula', parts: [
    C('n14-wm015-q08-nonnegative'),
  ] },
  { id: 'n14-after-wm015-q08-nonnegative', type: 'paragraph', parts: [
    T('X≥0なら|X|=Xなので、この場合はX>aとなる。等号は含めない。'),
  ] },
  { id: 'n14-lead-wm015-q08-negative', type: 'paragraph', parts: [
    T('X<0なら|X|=−X。−X>aの両辺に−1を掛けると不等号の向きが変わる。'),
    M('-X>a\\quad(X<0)'),
    T('負の場合に残る範囲を選ぼう。'),
  ] },
  { id: 'n14-formula-wm015-q08-negative', type: 'formula', parts: [
    C('n14-wm015-q08-negative'),
  ] },
  { id: 'n14-after-wm015-q08-negative', type: 'paragraph', parts: [
    T('−X>aを−1倍するとX<−aとなる。こちらも等号を含めない。'),
  ] },
  { id: 'n14-lead-08', type: 'paragraph', parts: [
    T('二つの場合のいずれかに入ればよい。左右に離れた範囲の結び方も考えて、絶対値のない条件を選ぼう。'),
    M('|X|>a\\quad(a>0)'),
  ] },
  originalContent.readingFlow[q08Start+1],
  originalContent.readingFlow[q08End],
  { id: 'n14-after-wm015-q08-converse', type: 'paragraph', parts: [
    T('逆も確かめよう。X>aならa>0よりX>0なので|X|=X>a。X<−aならX<0なので|X|=−X>a。'),
    T('左右のどちらか一方でよく「または」で結ぶ。「かつ」では両方同時に満たせない。X=±aも等号がないため含まれない。'),
    M('|X|>a\\iff\\left(X<-a\\;\\text{または}\\;X>a\\right)\\quad(a>0)'),
  ] },
]
const q08Content = {
  readingFlow: [
    ...originalContent.readingFlow.slice(0, firstQ07),
    ...q07Flow,
    ...originalContent.readingFlow.slice(lastQ07+1, q08Start),
    ...q08Flow,
    ...originalContent.readingFlow.slice(q08End+1),
  ],
  items: [
    ...originalContent.items.slice(0, oldQ07Index),
    ...newQ07Items,
    ...originalContent.items.slice(oldQ07Index, oldQ08Index),
    ...newQ08Items,
    ...originalContent.items.slice(oldQ08Index),
  ],
}
// W-MATH-016/P-001 — Q12 source asks for EACH subtraction before final OR.
// Preserve Q07/Q08 already approved and the original n14-12 final four-choice.
const q12NewItems: TextbookItem[] = [
  reviewItem('n14-wm016-q12-left',
    '左側の不等式x+3≤−2について、両辺から3を引こう。',
    'x\\le-5', 'formula', ['x<-5', 'x\\ge-5', 'x\\le-1'],
    'causal-reasoning','medium',
    ['両辺から同じ3を引いても不等号の向きは変わらない。']),
  reviewItem('n14-wm016-q12-right',
    '右側の不等式x+3≥2について、両辺から3を引こう。',
    'x\\ge-1', 'formula', ['x>-1', 'x\\le-1', 'x\\ge1'],
    'causal-reasoning','medium',
    ['右辺では2−3を計算する。両辺から3を引くと向きは変わらない。']),
]
const q12First = q08Content.readingFlow.findIndex(block => block.id === 'n14-lead-12')
const q12End = q08Content.readingFlow.findIndex(block => block.id === 'n14-after-12')
const q13Start = q08Content.readingFlow.findIndex(block => block.id === 'n14-lead-13')
const oldQ12Index = q08Content.items.findIndex(item => item.id === 'n14-12')
if (q12First<0 || q12End<=q12First || q13Start<=q12End
    || oldQ12Index!==15 || q08Content.readingFlow[q12First+1].id!=='n14-formula-12')
  throw new Error('N14-Q12 original approved source boundary drifted')
const q12Flow: TextbookReadingBlock[] = [
  { id:'n14-lead-wm016-q12-left',type:'paragraph',parts:[
    T('前の問題で得た二つの条件は「または」で結ばれている。まず左側を一つずつ解こう。'),
    M('x+3\\le-2'),
    T('両辺から3を引いたときのxの範囲を選ぼう。'),
  ]},
  { id:'n14-formula-wm016-q12-left',type:'formula',parts:[
    C('n14-wm016-q12-left'),
  ]},
  { id:'n14-after-wm016-q12-left',type:'paragraph',parts:[
    T('両辺から同じ3を引けば不等号の向きは変わらない。右辺は−2−3=−5なので、x≤−5となる。'),
  ]},
  { id:'n14-lead-wm016-q12-right',type:'paragraph',parts:[
    T('次は右側の条件を解こう。左側とは別に、同じ操作を行う。'),
    M('x+3\\ge2'),
    T('両辺から3を引いてxの範囲を選ぼう。'),
  ]},
  { id:'n14-formula-wm016-q12-right',type:'formula',parts:[
    C('n14-wm016-q12-right'),
  ]},
  { id:'n14-after-wm016-q12-right',type:'paragraph',parts:[
    T('2−3=−1だからx≥−1となる。ここでも同じ数を引くだけなので、不等号は反転しない。'),
  ]},
  { id:'n14-lead-12',type:'paragraph',parts:[
    T('左右の不等式をそれぞれ解いた。前問の「または」を保って、二つの範囲を合わせた最終解を選ぼう。'),
    M('|x+3|\\ge2'),
  ]},
  q08Content.readingFlow[q12First+1],
  q08Content.readingFlow[q12End],
  { id:'n14-after-wm016-q12-union',type:'paragraph',parts:[
    T('左の枝ではx≤−5、右の枝ではx≥−1。どちらか一方を満たせばよいため「または」で結ぶ。'),
    T('もとの不等号には等号があるので、x=−5とx=−1はどちらも解に含まれる。その間は解にならない。'),
    M('x\\le-5\\;\\text{または}\\;x\\ge-1'),
  ]},
]
const content = {
  readingFlow: [
    ...q08Content.readingFlow.slice(0,q12First),
    ...q12Flow,
    ...q08Content.readingFlow.slice(q12End+1),
  ],
  items: [
    ...q08Content.items.slice(0,oldQ12Index),
    ...q12NewItems,
    ...q08Content.items.slice(oldQ12Index),
  ],
}

// W-MATH-018/P-001: N14 original Q10 is a three-sided algebra chain.
// Existing Q07/Q08/Q12 branches, N14 figure and original Q09/Q11 stay intact.
const q10Start = content.readingFlow.findIndex(b => b.id === 'n14-lead-10')
const q10After = content.readingFlow.findIndex(b => b.id === 'n14-after-10')
const q09After = content.readingFlow.findIndex(b => b.id === 'n14-after-09')
const q11Lead = content.readingFlow.findIndex(b => b.id === 'n14-lead-11')
const oldQ10Index = content.items.findIndex(item => item.id === 'n14-10')
if (q09After < 0 || q10Start !== q09After + 1 || q10After !== q10Start + 2
  || q11Lead !== q10After + 1 || oldQ10Index < 0) {
  throw new Error('N14 Q09→Q10→Q11 approved Word boundaries changed')
}
const q10Flow: TextbookReadingBlock[] = [
  { id: 'n14-lead-10', type: 'formula', derivationId: 'n14-q10-chain', parts: [
    M('-5<x-3<5'),
  ] },
  { id: 'n14-formula-10', type: 'formula', derivationId: 'n14-q10-chain', parts: [
    M('-5+'), C('n14-wm018-q10-add-left'),
    M('<x-3+'), C('n14-wm018-q10-add-center'),
    M('<5+'), C('n14-wm018-q10-add-right'),
  ] },
  { id: 'n14-wm018-q10-explain', type: 'paragraph', derivationId: 'n14-q10-chain', parts: [
    T('三辺に同じ数を足しても、二つの不等号の向きは変わらない。真ん中の−3と＋3が打ち消し合い、xだけが残る。'),
  ] },
  { id: 'n14-wm018-q10-result', type: 'formula', derivationId: 'n14-q10-chain', parts: [
    C('n14-10'), M('<x<'), C('n14-wm018-q10-bound-right'),
  ] },
  content.readingFlow[q10After], // keep original Q10 transition outside chain
]
const q10LeftItem: TextbookItem = reviewItem(
  'n14-wm018-q10-add-left', '左端−5に足す数を選ぼう。',
  '3', 'formula', ['-3', '2', '5'], 'causal-reasoning', 'light',
  ['中央の−3を打ち消す操作を、左端にも行おう。'],
)
const q10CenterItem: TextbookItem = reviewItem(
  'n14-wm018-q10-add-center', '真ん中のx−3の定数を打ち消す数を選ぼう。',
  '3', 'formula', ['-3', '0', '5'], 'causal-reasoning', 'light',
  ['負の定数を打ち消すには、符号が逆の数を足す。'],
)
const q10RightItem: TextbookItem = reviewItem(
  'n14-wm018-q10-add-right', '右端5にも同じ数を足そう。',
  '3', 'formula', ['-3', '-5', '2'], 'causal-reasoning', 'light',
  ['左端と真ん中に使った加える数にそろえる。'],
)
const q10LowerItem: TextbookItem = reviewItem(
  'n14-10', '左端の−5と加えた数を計算しよう。',
  '-2', 'formula', ['2', '-8', '-5'], 'causal-reasoning', 'light',
  ['−5に正の数を足したときの位置を数直線で考える。'],
)
const q10UpperItem: TextbookItem = reviewItem(
  'n14-wm018-q10-bound-right', '右端の5と加えた数を計算しよう。',
  '8', 'formula', ['2', '5', '-8'], 'causal-reasoning', 'light',
  ['5から正の方向へ動いた結果を計算する。'],
)
const q10Content = {
  readingFlow: [
    ...content.readingFlow.slice(0, q10Start),
    ...q10Flow,
    ...content.readingFlow.slice(q10After + 1),
  ],
  items: [
    ...content.items.slice(0, oldQ10Index),
    q10LeftItem, q10CenterItem, q10RightItem, q10LowerItem, q10UpperItem,
    ...content.items.slice(oldQ10Index + 1),
  ],
}

// W-MATH-019/P-001 — one bounded original N14 Q14: show three logical
// equations, ask for all three additions and both endpoints, then Q15 as-is.
// Existing accepted Q07/Q08/Q10/Q12 IDs, answer keys and source are immutable.
const q14Start = q10Content.readingFlow.findIndex(b => b.id === 'n14-lead-14')
const q14After = q10Content.readingFlow.findIndex(b => b.id === 'n14-after-14')
const q13After = q10Content.readingFlow.findIndex(b => b.id === 'n14-after-13')
const q15Start = q10Content.readingFlow.findIndex(b => b.id === 'n14-lead-15')
const oldQ14Index = q10Content.items.findIndex(item => item.id === 'n14-14')
if (q13After < 0 || q14Start !== q13After + 1 ||
    q14After !== q14Start + 2 || q15Start !== q14After + 1 ||
    oldQ14Index < 0 || q10Content.readingFlow[q14Start + 1]?.id !== 'n14-formula-14')
  throw new Error('N14 Q13→Q14→Q15 source/approved boundary has changed')
const q14Flow: TextbookReadingBlock[] = [
  { id: 'n14-lead-14', type: 'formula', derivationId: 'n14-q14-chain', parts: [
    M('-4\\le3x-2\\le4'),
  ] },
  { id: 'n14-formula-14', type: 'formula', derivationId: 'n14-q14-chain', parts: [
    M('-4+'), C('n14-wm019-q14-add-left'),
    M('\\le3x-2+'), C('n14-wm019-q14-add-center'),
    M('\\le4+'), C('n14-wm019-q14-add-right'),
  ] },
  { id: 'n14-wm019-q14-explain', type: 'paragraph', derivationId: 'n14-q14-chain', parts: [
    T('三辺に同じ数を足しても、不等号の向きと等号は変わらない。中央の−2と＋2が打ち消し合い、3xだけが残る。'),
  ] },
  { id: 'n14-wm019-q14-result', type: 'formula', derivationId: 'n14-q14-chain', parts: [
    C('n14-14'), M('\\le3x\\le'), C('n14-wm019-q14-bound-right'),
  ] },
  q10Content.readingFlow[q14After], // approved existing bridge into Q15
]
const q14AddLeft: TextbookItem = reviewItem(
  'n14-wm019-q14-add-left', '左端−4にも同じ数を足そう。',
  '2', 'formula', ['-2', '4', '6'], 'causal-reasoning', 'light',
  ['中央の−2を打ち消すには何を足すか考え、左端にも同じ操作をしよう。'],
)
const q14AddCenter: TextbookItem = reviewItem(
  'n14-wm019-q14-add-center', '中央3x−2の定数を打ち消す数を選ぼう。',
  '2', 'formula', ['-2', '0', '3'], 'causal-reasoning', 'light',
  ['−2と足して0になる数を考えよう。'],
)
const q14AddRight: TextbookItem = reviewItem(
  'n14-wm019-q14-add-right', '右端4にも同じ数を足そう。',
  '2', 'formula', ['-2', '4', '0'], 'causal-reasoning', 'light',
  ['左端と中央に使った同じ数を右端にも足そう。'],
)
const q14BoundLeft: TextbookItem = reviewItem(
  'n14-14', '左端の−4と加えた数を計算しよう。',
  '-2', 'formula', ['2', '-6', '-4'], 'causal-reasoning', 'light',
  ['−4に正の2を足すと数直線上でどこに動くか考えよう。'],
)
const q14BoundRight: TextbookItem = reviewItem(
  'n14-wm019-q14-bound-right', '右端の4と加えた数を計算しよう。',
  '6', 'formula', ['2', '4', '-6'], 'causal-reasoning', 'light',
  ['4と2を足した結果を計算しよう。'],
)
const q14Content = {
  readingFlow: [
    ...q10Content.readingFlow.slice(0, q14Start),
    ...q14Flow,
    ...q10Content.readingFlow.slice(q14After + 1),
  ],
  items: [
    ...q10Content.items.slice(0, oldQ14Index),
    q14AddLeft, q14AddCenter, q14AddRight, q14BoundLeft, q14BoundRight,
    ...q10Content.items.slice(oldQ14Index + 1),
  ],
}

// W-MATH-020/P-001: preserve all prior approved blocks; correct only original
// N14 Q15 bundled operation+completed answer into 3 division choices
// followed by 2 endpoint calculations, between accepted Q14 and intact Q16.
const q15Wm020Start = q14Content.readingFlow.findIndex(b=>b.id==='n14-lead-15')
const q15After = q14Content.readingFlow.findIndex(b=>b.id==='n14-after-15')
const q14Prev = q14Content.readingFlow.findIndex(b=>b.id==='n14-after-14')
const q16Start = q14Content.readingFlow.findIndex(b=>b.id==='n14-lead-16')
const oldQ15Index=q14Content.items.findIndex(i=>i.id==='n14-15')
if(q15Wm020Start<0 || q15After!==q15Wm020Start+2 || q14Prev!==q15Wm020Start-1 ||
   q16Start!==q15After+1 || oldQ15Index<0 ||
   q14Content.readingFlow[q15Wm020Start+1]?.id!=='n14-formula-15')
  throw new Error('N14 accepted Q14→original Q15→Q16 boundary has changed')
const q15Flow:TextbookReadingBlock[]=[
  {id:'n14-lead-15',type:'formula',derivationId:'n14-q15-chain',parts:[
    M('-2\\le3x\\le6'),
  ]},
  {id:'n14-formula-15',type:'formula',derivationId:'n14-q15-chain',parts:[
    M('-2\\div'),C('n14-wm020-q15-divide-left'),
    M('\\le3x\\div'),C('n14-wm020-q15-divide-center'),
    M('\\le6\\div'),C('n14-wm020-q15-divide-right'),
  ]},
  {id:'n14-wm020-q15-explain',type:'paragraph',derivationId:'n14-q15-chain',parts:[
    T('三辺を正の3で割っても、不等号の向きと等号は変わらない。中央の3xを3で割ると、xだけが残る。'),
  ]},
  {id:'n14-wm020-q15-result',type:'formula',derivationId:'n14-q15-chain',parts:[
    C('n14-15'),M('\\le x\\le'),C('n14-wm020-q15-bound-right'),
  ]},
  q14Content.readingFlow[q15After], // original bridge into Q16
]
const q15DivisionLeft:TextbookItem=reviewItem(
  'n14-wm020-q15-divide-left','左端−2を割る正の数を選ぼう。',
  '3','formula',['-3','2','6'],'causal-reasoning','light',
  ['中央の3xから係数3を取り除くには何で割ればよいか考え、左端にも同じ除数を使おう。'],
)
const q15DivisionCenter:TextbookItem=reviewItem(
  'n14-wm020-q15-divide-center','中央3xの係数を1にする除数を選ぼう。',
  '3','formula',['-3','1','6'],'causal-reasoning','light',
  ['係数を1にする方法を、まず小さい数で考えよう。① 2×□=1 の□には何が入る？ ② 3×□=1 では？ ③ 同じ考え方で、3x×□=x の□には何が入る？ ④ この掛け算を割り算に直すと、3x÷□=x の□には何が入る？'],
)
const q15DivisionRight:TextbookItem=reviewItem(
  'n14-wm020-q15-divide-right','右端6にも同じ正の除数を使おう。',
  '3','formula',['-3','2','6'],'causal-reasoning','light',
  ['左端と中央に使った正の除数と同じ数で割ろう。'],
)
const q15BoundLeft:TextbookItem=reviewItem(
  'n14-15','左端−2を正の3で割った値を計算しよう。',
  '-\\frac23','formula',['\\frac23','-6','-\\frac32'],'causal-reasoning','light',
  ['負の2を正の3で割るので答えは負。分子と分母を確認しよう。'],
)
const q15BoundRight:TextbookItem=reviewItem(
  'n14-wm020-q15-bound-right','右端6を正の3で割った値を計算しよう。',
  '2','formula',['3','-2','\\frac12'],'causal-reasoning','light',
  ['6÷3を計算し、等号の有無を変えずに右端の境界を埋めよう。'],
)
const q15Content={
  readingFlow:[
    ...q14Content.readingFlow.slice(0,q15Wm020Start),
    ...q15Flow,
    ...q14Content.readingFlow.slice(q15After+1),
  ],
  items:[
    ...q14Content.items.slice(0,oldQ15Index),
    q15DivisionLeft,q15DivisionCenter,q15DivisionRight,q15BoundLeft,q15BoundRight,
    ...q14Content.items.slice(oldQ15Index+1),
  ],
}

// W-MATH-022/P-001 — Q16 alone: substitute each endpoint, take absolute values,
// then interpret inclusion. The accepted Q10/Q14/Q15 blocks are never rewritten.
const q16Wm022Start=q15Content.readingFlow.findIndex(b=>b.id==='n14-lead-16')
const q16After=q15Content.readingFlow.findIndex(b=>b.id==='n14-after-16')
const oldQ16Index=q15Content.items.findIndex(i=>i.id==='n14-16')
if(q16Wm022Start<0 || q16After!==q16Wm022Start+2 ||
   q15Content.readingFlow[q16Wm022Start-1]?.id!=='n14-after-15' ||
   q15Content.readingFlow[q16Wm022Start+1]?.id!=='n14-formula-16' ||
   oldQ16Index!==q15Content.items.length-1) {
  throw new Error('N14 accepted Q15 to original Q16 final boundary changed')
}
const q16Flow:TextbookReadingBlock[]=[
  {id:'n14-lead-16',type:'paragraph',derivationId:'n14-q16-chain',parts:[
    T('前問で求めた左端 x=−2/3 と右端 x=2 を、元の不等式に戻して確かめよう。まず絶対値の中身を計算し、次に絶対値を求める。'),
    M('|3x-2|\\le4'),
  ]},
  {id:'n14-formula-16',type:'formula',derivationId:'n14-q16-chain',parts:[
    M('x=-\\frac23:\\quad|3(-\\frac23)-2|'),M('=|'),
    C('n14-wm022-q16-left-inner'),M('|='),C('n14-wm022-q16-left-abs'),
  ]},
  {id:'n14-wm022-q16-right',type:'formula',derivationId:'n14-q16-chain',parts:[
    M('x=2:\\quad|3\\cdot2-2|'),M('=|'),
    C('n14-wm022-q16-right-inner'),M('|='),C('n14-wm022-q16-right-abs'),
  ]},
  {id:'n14-wm022-q16-bridge',type:'paragraph',derivationId:'n14-q16-chain',parts:[
    T('元の条件は絶対値が4以下であること。左右とも、その条件を満たすか考えよう。'),
  ]},
  {id:'n14-wm022-q16-conclusion',type:'paragraph',derivationId:'n14-q16-chain',parts:[
    T('両端の扱いを選ぼう。'),C('n14-16'),
  ]},
  {id:'n14-after-16',type:'paragraph',parts:[
    T('左端も右端も絶対値が4となり、4≤4を満たす。もとの不等号には等号があるので、両端とも解に含まれる。'),
  ]},
]
const q16Items:TextbookItem[]=[
  reviewItem('n14-wm022-q16-left-inner',
    '左端x=−2/3を代入して、3x−2を計算しよう。',
    '-4','formula',['4','-2','0'],'causal-reasoning','light',
    ['まず3×(−1/3)=−1を考えよう。今度は−2/3を掛ける。その積を求めた後で2を引こう。']),
  reviewItem('n14-wm022-q16-left-abs',
    '左端の中身を使って絶対値を求めよう。',
    '4','formula',['-4','2','0'],'causal-reasoning','light',
    ['たとえば|−3|=3。絶対値は0からの距離だよ。直前に求めた負の数にも同じ規則を使おう。']),
  reviewItem('n14-wm022-q16-right-inner',
    '右端x=2を代入して、3x−2を計算しよう。',
    '4','formula',['-4','2','6'],'causal-reasoning','light',
    ['たとえばx=1なら3×1−2を計算する。同じ順序で、今回はx=2を入れよう。']),
  reviewItem('n14-wm022-q16-right-abs',
    '右端の中身を使って絶対値を求めよう。',
    '4','formula',['-4','2','0'],'causal-reasoning','light',
    ['たとえば|2|=2。中身が0以上のときは、その値がそのまま距離になる。直前の結果に当てはめよう。']),
  reviewItem('n14-16','元の不等式を満たすか確認し、両端の扱いを選ぼう。',
    '両端とも含む','text',['左端だけ含む','右端だけ含む','両端とも含まない'],
    'transfer','light',
    ['たとえば|−2|≤2は、等号でも成り立つ。左右の絶対値と元の上限4を一つずつ比べよう。']),
]
const q16Content={
  readingFlow:[
    ...q15Content.readingFlow.slice(0,q16Wm022Start),
    ...q16Flow,
    ...q15Content.readingFlow.slice(q16After+1),
  ],
  items:[
    ...q15Content.items.slice(0,oldQ16Index),
    ...q16Items,
    ...q15Content.items.slice(oldQ16Index+1),
  ],
}

const rawN14={
  schemaVersion:'1.1' as const,unitId:'math-numbers-expressions-n14',revision:10,status:'review' as const,subject:'math-1a' as const,
  chapter:{chapterId:'math-ch01-numbers-expressions',chapterNumber:'1',chapterTitle:'数と式',unitCode:'1NUM',orderInChapter:14,sourcePages:[35,36]},
  title:'距離の上限と下限から、残す範囲を決める',subtitle:'絶対値の内側・外側と端点を、数直線で選び分ける。',
  source:{type:'reference' as const,label:'ユーザー提供「数と式」教科書モード対話段階導入版 v2 / N14',
    rightsNote:'教師編集WordのN14原問16件、答えの後に開く元数直線1点、別冊解答未提供の独立導出、レビュー限定。'},
  objectives:['距離の上限と下限を内外の範囲へ翻訳する','等号の有無から端点の包含を判断する','二重不等式と「または」の二枝を区別して解く'],
  sections:[{id:'lesson',number:'14',title:'本文',role:'concept' as const,
    description:'範囲の意味から変形し、元の条件へ戻して検算する。',
    figures:[{id:'n14-f01',src:'/assets/math/textbook/numbers/n14-f01.png',alt:'距離が3より小さい範囲と4以上の範囲を上下で比較した、解答後確認用の元図。',caption:'二つの範囲を導いた後で、内側と外側を図で比較する。',overlays:[]}],
    readingFlow:q16Content.readingFlow,items:q16Content.items}],
}
export const mathNumbersN14LegacyUnit=validateTextbookUnits([rawN14])[0]

// W048 proposed exact compiler/physical-row output. Original legacy unit remains available.
const rawN14W048 = {
  "schemaVersion": "1.1",
  "unitId": "math-numbers-expressions-n14",
  "revision": 11,
  "status": "review",
  "subject": "math-1a",
  "chapter": {
    "chapterId": "math-ch01-numbers-expressions",
    "chapterNumber": "1",
    "chapterTitle": "数と式",
    "unitCode": "1NUM",
    "orderInChapter": 14,
    "sourcePages": [
      35,
      36
    ]
  },
  "title": "距離の上限と下限から、残す範囲を決める",
  "subtitle": "絶対値の内側・外側と端点を、数直線で選び分ける。",
  "source": {
    "type": "reference",
    "label": "ユーザー提供「数と式」教科書モード対話段階導入版 v2 / N14",
    "rightsNote": "教師編集WordのN14原問16件、答えの後に開く元数直線1点、別冊解答未提供の独立導出、レビュー限定。"
  },
  "objectives": [
    "距離の上限と下限を内外の範囲へ翻訳する",
    "等号の有無から端点の包含を判断する",
    "二重不等式と「または」の二枝を区別して解く"
  ],
  "sections": [
    {
      "id": "lesson",
      "number": "14",
      "title": "本文",
      "description": "範囲の意味から変形し、元の条件へ戻して検算する。",
      "role": "concept",
      "figures": [
        {
          "id": "n14-f01",
          "src": "/assets/math/textbook/numbers/n14-f01.png",
          "alt": "距離が3より小さい範囲と4以上の範囲を上下で比較した、解答後確認用の元図。",
          "caption": "二つの範囲を導いた後で、内側と外側を図で比較する。",
          "overlays": []
        }
      ],
      "readingFlow": [
        {
          "id": "n14-heading-1",
          "type": "heading",
          "text": "距離から残す範囲を考える"
        },
        {
          "id": "n14-marker-1",
          "type": "marker",
          "kind": "example",
          "text": "例題"
        },
        {
          "id": "n14-group-1",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "絶対値の不等式を距離の条件として読む。「より近い」と「少なくともこれだけ遠い」では残す範囲が反対になる。"
            }
          ]
        },
        {
          "id": "n14-lead-01",
          "type": "paragraph",
          "parts": [
            {
              "type": "math",
              "latex": "|x|<3"
            },
            {
              "type": "text",
              "text": "は、数直線上で原点からの距離に上限を付けた条件。"
            },
            {
              "type": "math",
              "latex": "|x|<3"
            }
          ]
        },
        {
          "id": "n14-formula-01",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "考えて選ぶ："
            },
            {
              "type": "choice",
              "itemId": "n14-01"
            }
          ]
        },
        {
          "id": "n14-after-01",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "境界になる位置を先に見つけ、そこからどちら側を残すか判断する。"
            }
          ]
        },
        {
          "id": "n14-lead-02",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "原点からの距離がちょうど3になる点は左右に一つずつある。"
            },
            {
              "type": "math",
              "latex": "|x|=3"
            }
          ]
        },
        {
          "id": "n14-formula-02",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "n14-02"
            }
          ]
        },
        {
          "id": "n14-after-02",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "境界の二点が決まりました。次に、その間と外側のどちらを残すか、元の距離の条件から考えます。"
            }
          ]
        },
        {
          "id": "n14-lead-03",
          "type": "paragraph",
          "parts": [
            {
              "type": "math",
              "latex": "|x|<3"
            },
            {
              "type": "text",
              "text": "の意味から、−3と3の間か外側か、端点を含むかを判断する。"
            },
            {
              "type": "math",
              "latex": "|x|<3"
            }
          ]
        },
        {
          "id": "n14-w048-q03-region-lead",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "距離が3未満となる領域を、二点の間と外側から選びましょう。"
            }
          ],
          "derivationId": "n14-q03-chain"
        },
        {
          "id": "n14-w048-q03-region-formula",
          "type": "paragraph",
          "parts": [
            {
              "type": "choice",
              "itemId": "n14-w048-q03-region"
            }
          ],
          "derivationId": "n14-q03-chain"
        },
        {
          "id": "n14-w048-q03-region-after",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "残す領域が決まりました。次は、距離がちょうど3の境界を含むかを判断します。"
            }
          ],
          "derivationId": "n14-q03-chain"
        },
        {
          "id": "n14-formula-03",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "考えて選ぶ："
            },
            {
              "type": "choice",
              "itemId": "n14-03"
            }
          ],
          "derivationId": "n14-q03-chain"
        },
        {
          "id": "n14-after-03",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "範囲は左右二つの境界の内側で、端点は白丸になる。"
            }
          ]
        },
        {
          "id": "n14-lead-04",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "残す区間を一つの二重不等式へ書き換える。"
            },
            {
              "type": "math",
              "latex": "|x|<3"
            }
          ]
        },
        {
          "id": "n14-formula-04",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "n14-04"
            }
          ]
        },
        {
          "id": "n14-after-04",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "二重不等式は左右両方の条件を同時に満たす数全体を表す。"
            }
          ]
        },
        {
          "id": "n14-lead-05",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "次の例題は、距離に下限がある条件です。境界の位置、残す領域、等号の扱いを順に判断します。"
            },
            {
              "type": "math",
              "latex": "|x|\\ge4"
            }
          ]
        },
        {
          "id": "n14-w048-q05-boundaries-lead",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "距離がちょうど4になる二つの境界を選びましょう。"
            }
          ],
          "derivationId": "n14-q05-chain"
        },
        {
          "id": "n14-w048-q05-boundaries-formula",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "n14-w048-q05-boundaries"
            }
          ],
          "derivationId": "n14-q05-chain"
        },
        {
          "id": "n14-w048-q05-boundaries-after",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "境界の二点が決まりました。次は残す領域を考えます。"
            }
          ],
          "derivationId": "n14-q05-chain"
        },
        {
          "id": "n14-w048-q05-region-lead",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "元の距離の下限を満たすのは、二点の間と外側のどちらでしょう。"
            }
          ],
          "derivationId": "n14-q05-chain"
        },
        {
          "id": "n14-w048-q05-region-formula",
          "type": "paragraph",
          "parts": [
            {
              "type": "choice",
              "itemId": "n14-w048-q05-region"
            }
          ],
          "derivationId": "n14-q05-chain"
        },
        {
          "id": "n14-w048-q05-region-after",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "残す領域が決まりました。最後に、元の不等号が境界を含むかを判断します。"
            }
          ],
          "derivationId": "n14-q05-chain"
        },
        {
          "id": "n14-formula-05",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "考えて選ぶ："
            },
            {
              "type": "choice",
              "itemId": "n14-05"
            }
          ],
          "derivationId": "n14-q05-chain"
        },
        {
          "id": "n14-after-05",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "原点から遠い範囲は、右と左に分かれた二つの区間となる。"
            }
          ]
        },
        {
          "id": "n14-lead-06",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "直前に決めた境界・内外・端点の扱いを、"
            },
            {
              "type": "math",
              "latex": "x"
            },
            {
              "type": "text",
              "text": "についての二つの不等式へ翻訳しよう。二つの枝をどう結ぶかも自分で判断する。"
            },
            {
              "type": "math",
              "latex": "|x|\\ge4"
            }
          ]
        },
        {
          "id": "n14-formula-06",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "n14-06"
            }
          ]
        },
        {
          "id": "n14-after-06",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "境界を含む左右の外側なので"
            },
            {
              "type": "math",
              "latex": "x\\le -4"
            },
            {
              "type": "text",
              "text": "または"
            },
            {
              "type": "math",
              "latex": "x\\ge 4"
            },
            {
              "type": "text",
              "text": "となる。二つの問題を解いたので完成原図で比較しよう。"
            }
          ]
        },
        {
          "id": "n14-show-n14-f01",
          "type": "figure",
          "figureId": "n14-f01"
        },
        {
          "id": "n14-heading-2",
          "type": "heading",
          "text": "距離の規則を一般化する"
        },
        {
          "id": "n14-marker-2",
          "type": "marker",
          "kind": "proof",
          "text": "導出"
        },
        {
          "id": "n14-group-2",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "境界の距離を正の数"
            },
            {
              "type": "math",
              "latex": "a"
            },
            {
              "type": "text",
              "text": "とし、中の式全体を"
            },
            {
              "type": "math",
              "latex": "X"
            },
            {
              "type": "text",
              "text": "と見ても、数直線の意味は同じである。"
            }
          ]
        },
        {
          "id": "n14-lead-wm014-q07-nonnegative",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "距離の規則を一般の数"
            },
            {
              "type": "math",
              "latex": "X"
            },
            {
              "type": "text",
              "text": "で考える。"
            },
            {
              "type": "math",
              "latex": "a>0"
            },
            {
              "type": "text",
              "text": "とし、まず"
            },
            {
              "type": "math",
              "latex": "X"
            },
            {
              "type": "text",
              "text": "が0以上の場合を調べよう。"
            },
            {
              "type": "math",
              "latex": "|X|<a\\quad(a>0)"
            },
            {
              "type": "math",
              "latex": "X\\ge 0"
            },
            {
              "type": "text",
              "text": "なら"
            },
            {
              "type": "math",
              "latex": "|X|=X"
            },
            {
              "type": "text",
              "text": "となる。この場合に成り立つ"
            },
            {
              "type": "math",
              "latex": "X"
            },
            {
              "type": "text",
              "text": "の範囲を選ぼう。"
            }
          ]
        },
        {
          "id": "n14-formula-wm014-q07-nonnegative",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "n14-wm014-q07-nonnegative"
            }
          ]
        },
        {
          "id": "n14-after-wm014-q07-nonnegative",
          "type": "paragraph",
          "parts": [
            {
              "type": "math",
              "latex": "X\\ge 0"
            },
            {
              "type": "text",
              "text": "なので"
            },
            {
              "type": "math",
              "latex": "|X|=X"
            },
            {
              "type": "text",
              "text": "。よって"
            },
            {
              "type": "math",
              "latex": "X<a"
            },
            {
              "type": "text",
              "text": "であり、二つの条件を合わせて"
            },
            {
              "type": "math",
              "latex": "0\\le X<a"
            },
            {
              "type": "text",
              "text": "となる。"
            }
          ]
        },
        {
          "id": "n14-lead-wm014-q07-negative",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "次に"
            },
            {
              "type": "math",
              "latex": "X"
            },
            {
              "type": "text",
              "text": "が負の場合を調べる。"
            },
            {
              "type": "math",
              "latex": "X<0"
            },
            {
              "type": "text",
              "text": "なら"
            },
            {
              "type": "math",
              "latex": "|X|=-X"
            },
            {
              "type": "text",
              "text": "だから、"
            },
            {
              "type": "math",
              "latex": "-X<a"
            },
            {
              "type": "text",
              "text": "となる。両辺に−1を掛けると不等号は反転する。"
            },
            {
              "type": "math",
              "latex": "X<0"
            },
            {
              "type": "text",
              "text": "も考慮した範囲を選ぼう。"
            },
            {
              "type": "math",
              "latex": "-X<a\\quad(X<0)"
            }
          ]
        },
        {
          "id": "n14-formula-wm014-q07-negative",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "n14-wm014-q07-negative"
            }
          ]
        },
        {
          "id": "n14-after-wm014-q07-negative",
          "type": "paragraph",
          "parts": [
            {
              "type": "math",
              "latex": "-X<a"
            },
            {
              "type": "text",
              "text": "の両辺を−1倍すると"
            },
            {
              "type": "math",
              "latex": "X>-a"
            },
            {
              "type": "text",
              "text": "。"
            },
            {
              "type": "math",
              "latex": "X<0"
            },
            {
              "type": "text",
              "text": "と合わせて"
            },
            {
              "type": "math",
              "latex": "-a<X<0"
            },
            {
              "type": "text",
              "text": "となる。"
            }
          ]
        },
        {
          "id": "n14-lead-07",
          "type": "paragraph",
          "parts": [
            {
              "type": "math",
              "latex": "X\\ge 0"
            },
            {
              "type": "text",
              "text": "と"
            },
            {
              "type": "math",
              "latex": "X<0"
            },
            {
              "type": "text",
              "text": "の二つの場合を合わせよう。いずれか一方に入る"
            },
            {
              "type": "math",
              "latex": "X"
            },
            {
              "type": "text",
              "text": "全体を、絶対値なしの一つの範囲で表す。"
            },
            {
              "type": "math",
              "latex": "|X|<a\\quad(a>0)"
            }
          ]
        },
        {
          "id": "n14-formula-07",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "n14-07"
            }
          ]
        },
        {
          "id": "n14-after-07",
          "type": "paragraph",
          "parts": [
            {
              "type": "math",
              "latex": "X"
            },
            {
              "type": "text",
              "text": "が文字式でも、式全体を一つの数としてこの関係を使える。"
            }
          ]
        },
        {
          "id": "n14-after-wm014-q07-converse",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "逆も確かめる。今得た範囲に"
            },
            {
              "type": "math",
              "latex": "X"
            },
            {
              "type": "text",
              "text": "があるとする。"
            },
            {
              "type": "math",
              "latex": "X\\ge 0"
            },
            {
              "type": "text",
              "text": "なら"
            },
            {
              "type": "math",
              "latex": "|X|=X<a"
            },
            {
              "type": "text",
              "text": "。"
            },
            {
              "type": "math",
              "latex": "X<0"
            },
            {
              "type": "text",
              "text": "なら"
            },
            {
              "type": "math",
              "latex": "X>-a"
            },
            {
              "type": "text",
              "text": "より"
            },
            {
              "type": "math",
              "latex": "-X<a"
            },
            {
              "type": "text",
              "text": "であり、"
            },
            {
              "type": "math",
              "latex": "|X|=-X<a"
            },
            {
              "type": "text",
              "text": "。どちらも元の条件を満たすので、両方向が成り立つ。"
            },
            {
              "type": "math",
              "latex": "|X|<a\\iff -a<X<a\\quad(a>0)"
            }
          ]
        },
        {
          "id": "n14-lead-wm015-q08-nonnegative",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "次は原点からの距離が"
            },
            {
              "type": "math",
              "latex": "a"
            },
            {
              "type": "text",
              "text": "より大きい場合を考える。"
            },
            {
              "type": "math",
              "latex": "a>0"
            },
            {
              "type": "text",
              "text": "として、まず"
            },
            {
              "type": "math",
              "latex": "X"
            },
            {
              "type": "text",
              "text": "が0以上のとき。"
            },
            {
              "type": "math",
              "latex": "|X|>a\\quad(a>0)"
            },
            {
              "type": "math",
              "latex": "X\\ge 0"
            },
            {
              "type": "text",
              "text": "では"
            },
            {
              "type": "math",
              "latex": "|X|=X"
            },
            {
              "type": "text",
              "text": "。この場合に必要な条件を選ぼう。"
            }
          ]
        },
        {
          "id": "n14-formula-wm015-q08-nonnegative",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "n14-wm015-q08-nonnegative"
            }
          ]
        },
        {
          "id": "n14-after-wm015-q08-nonnegative",
          "type": "paragraph",
          "parts": [
            {
              "type": "math",
              "latex": "X\\ge 0"
            },
            {
              "type": "text",
              "text": "なら"
            },
            {
              "type": "math",
              "latex": "|X|=X"
            },
            {
              "type": "text",
              "text": "なので、この場合は"
            },
            {
              "type": "math",
              "latex": "X>a"
            },
            {
              "type": "text",
              "text": "となる。等号は含めない。"
            }
          ]
        },
        {
          "id": "n14-lead-wm015-q08-negative",
          "type": "paragraph",
          "parts": [
            {
              "type": "math",
              "latex": "X<0"
            },
            {
              "type": "text",
              "text": "なら"
            },
            {
              "type": "math",
              "latex": "|X|=-X"
            },
            {
              "type": "text",
              "text": "。"
            },
            {
              "type": "math",
              "latex": "-X>a"
            },
            {
              "type": "text",
              "text": "の両辺に−1を掛けると不等号の向きが変わる。"
            },
            {
              "type": "math",
              "latex": "-X>a\\quad(X<0)"
            },
            {
              "type": "text",
              "text": "負の場合に残る範囲を選ぼう。"
            }
          ]
        },
        {
          "id": "n14-formula-wm015-q08-negative",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "n14-wm015-q08-negative"
            }
          ]
        },
        {
          "id": "n14-after-wm015-q08-negative",
          "type": "paragraph",
          "parts": [
            {
              "type": "math",
              "latex": "-X>a"
            },
            {
              "type": "text",
              "text": "を−1倍すると"
            },
            {
              "type": "math",
              "latex": "X<-a"
            },
            {
              "type": "text",
              "text": "となる。こちらも等号を含めない。"
            }
          ]
        },
        {
          "id": "n14-lead-08",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "二つの場合のいずれかに入ればよい。左右に離れた範囲の結び方も考えて、絶対値のない条件を選ぼう。"
            },
            {
              "type": "math",
              "latex": "|X|>a\\quad(a>0)"
            }
          ]
        },
        {
          "id": "n14-formula-08",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "n14-08"
            }
          ]
        },
        {
          "id": "n14-after-08",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "上限なら内側、下限なら外側。等号が付く場合は境界も含める。"
            }
          ]
        },
        {
          "id": "n14-after-wm015-q08-converse",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "逆も確かめよう。"
            },
            {
              "type": "math",
              "latex": "X>a"
            },
            {
              "type": "text",
              "text": "なら"
            },
            {
              "type": "math",
              "latex": "a>0"
            },
            {
              "type": "text",
              "text": "より"
            },
            {
              "type": "math",
              "latex": "X>0"
            },
            {
              "type": "text",
              "text": "なので"
            },
            {
              "type": "math",
              "latex": "|X|=X>a"
            },
            {
              "type": "text",
              "text": "。"
            },
            {
              "type": "math",
              "latex": "X<-a"
            },
            {
              "type": "text",
              "text": "なら"
            },
            {
              "type": "math",
              "latex": "X<0"
            },
            {
              "type": "text",
              "text": "なので"
            },
            {
              "type": "math",
              "latex": "|X|=-X>a"
            },
            {
              "type": "text",
              "text": "。"
            },
            {
              "type": "text",
              "text": "左右のどちらか一方でよく「または」で結ぶ。「かつ」では両方同時に満たせない。"
            },
            {
              "type": "math",
              "latex": "X=\\pm a"
            },
            {
              "type": "text",
              "text": "も等号がないため含まれない。"
            },
            {
              "type": "math",
              "latex": "|X|>a\\iff\\left(X<-a\\;\\text{または}\\;X>a\\right)\\quad(a>0)"
            }
          ]
        },
        {
          "id": "n14-heading-3",
          "type": "heading",
          "text": "中の式を一つの数として変形する"
        },
        {
          "id": "n14-marker-3",
          "type": "marker",
          "kind": "example",
          "text": "例題"
        },
        {
          "id": "n14-group-3",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "絶対値を外した後も不等式は続く。二重不等式なら三辺すべてに同じ操作をし、外側の条件なら二枝をそれぞれ解く。"
            }
          ]
        },
        {
          "id": "n14-lead-09",
          "type": "paragraph",
          "parts": [
            {
              "type": "math",
              "latex": "|x-3|<5"
            },
            {
              "type": "text",
              "text": "を解く。中身"
            },
            {
              "type": "math",
              "latex": "x-3"
            },
            {
              "type": "text",
              "text": "全体を"
            },
            {
              "type": "math",
              "latex": "X"
            },
            {
              "type": "text",
              "text": "と見て、一般化した内側の規則を使う。"
            },
            {
              "type": "math",
              "latex": "|x-3|<5"
            }
          ]
        },
        {
          "id": "n14-formula-09",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "n14-09"
            }
          ]
        },
        {
          "id": "n14-after-09",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "次は三辺に同じ操作をして、中央を"
            },
            {
              "type": "math",
              "latex": "x"
            },
            {
              "type": "text",
              "text": "だけにする。"
            }
          ]
        },
        {
          "id": "n14-lead-10",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "-5<x-3<5"
            }
          ],
          "derivationId": "n14-q10-chain"
        },
        {
          "id": "n14-formula-10",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "-5+"
            },
            {
              "type": "choice",
              "itemId": "n14-wm018-q10-add-left"
            },
            {
              "type": "math",
              "latex": "<x-3+"
            },
            {
              "type": "choice",
              "itemId": "n14-wm018-q10-add-center"
            },
            {
              "type": "math",
              "latex": "<5+"
            },
            {
              "type": "choice",
              "itemId": "n14-wm018-q10-add-right"
            }
          ],
          "derivationId": "n14-q10-chain"
        },
        {
          "id": "n14-wm018-q10-explain",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "三辺に同じ数を足しても、二つの不等号の向きは変わらない。真ん中の−3と＋3が打ち消し合い、"
            },
            {
              "type": "math",
              "latex": "x"
            },
            {
              "type": "text",
              "text": "だけが残る。"
            }
          ],
          "derivationId": "n14-q10-chain"
        },
        {
          "id": "n14-wm018-q10-result",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "n14-10"
            },
            {
              "type": "math",
              "latex": "<x<"
            },
            {
              "type": "choice",
              "itemId": "n14-wm018-q10-bound-right"
            }
          ],
          "derivationId": "n14-q10-chain"
        },
        {
          "id": "n14-after-10",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "二重不等式では一部だけ移項すると同値な条件にならない。"
            }
          ]
        },
        {
          "id": "n14-w048-check-marker",
          "type": "marker",
          "kind": "check",
          "text": "確認"
        },
        {
          "id": "n14-lead-11",
          "type": "paragraph",
          "parts": [
            {
              "type": "math",
              "latex": "|x+3|\\ge 2"
            },
            {
              "type": "text",
              "text": "の絶対値を外す。中身"
            },
            {
              "type": "math",
              "latex": "x+3"
            },
            {
              "type": "text",
              "text": "を一つの数"
            },
            {
              "type": "math",
              "latex": "X"
            },
            {
              "type": "text",
              "text": "と考え、距離の下限が表す領域と等号の扱いを判断しよう。"
            },
            {
              "type": "math",
              "latex": "|x+3|\\ge2"
            }
          ]
        },
        {
          "id": "n14-formula-11",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "n14-11"
            }
          ]
        },
        {
          "id": "n14-after-11",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "外側で端点を含むため、"
            },
            {
              "type": "math",
              "latex": "x+3\\le -2"
            },
            {
              "type": "text",
              "text": "または"
            },
            {
              "type": "math",
              "latex": "x+3\\ge 2"
            },
            {
              "type": "text",
              "text": "。続いて各枝を"
            },
            {
              "type": "math",
              "latex": "x"
            },
            {
              "type": "text",
              "text": "について解く。"
            }
          ]
        },
        {
          "id": "n14-lead-wm016-q12-left",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "前の問題で得た二つの条件は「または」で結ばれている。まず左側を一つずつ解こう。"
            },
            {
              "type": "math",
              "latex": "x+3\\le-2"
            },
            {
              "type": "text",
              "text": "両辺から3を引いたときの"
            },
            {
              "type": "math",
              "latex": "x"
            },
            {
              "type": "text",
              "text": "の範囲を選ぼう。"
            }
          ]
        },
        {
          "id": "n14-formula-wm016-q12-left",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "n14-wm016-q12-left"
            }
          ]
        },
        {
          "id": "n14-after-wm016-q12-left",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "両辺から同じ3を引けば不等号の向きは変わらない。右辺は"
            },
            {
              "type": "math",
              "latex": "-2-3=-5"
            },
            {
              "type": "text",
              "text": "なので、"
            },
            {
              "type": "math",
              "latex": "x\\le -5"
            },
            {
              "type": "text",
              "text": "となる。"
            }
          ]
        },
        {
          "id": "n14-lead-wm016-q12-right",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "次は右側の条件を解こう。左側とは別に、同じ操作を行う。"
            },
            {
              "type": "math",
              "latex": "x+3\\ge2"
            },
            {
              "type": "text",
              "text": "両辺から3を引いて"
            },
            {
              "type": "math",
              "latex": "x"
            },
            {
              "type": "text",
              "text": "の範囲を選ぼう。"
            }
          ]
        },
        {
          "id": "n14-formula-wm016-q12-right",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "n14-wm016-q12-right"
            }
          ]
        },
        {
          "id": "n14-after-wm016-q12-right",
          "type": "paragraph",
          "parts": [
            {
              "type": "math",
              "latex": "2-3=-1"
            },
            {
              "type": "text",
              "text": "だから"
            },
            {
              "type": "math",
              "latex": "x\\ge -1"
            },
            {
              "type": "text",
              "text": "となる。ここでも同じ数を引くだけなので、不等号は反転しない。"
            }
          ]
        },
        {
          "id": "n14-lead-12",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "左右の不等式をそれぞれ解いた。前問の「または」を保って、二つの範囲を合わせた最終解を選ぼう。"
            },
            {
              "type": "math",
              "latex": "|x+3|\\ge2"
            }
          ]
        },
        {
          "id": "n14-formula-12",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "n14-12"
            }
          ]
        },
        {
          "id": "n14-after-12",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "距離の下限は区間の外側という意味が最後まで保たれている。"
            }
          ]
        },
        {
          "id": "n14-after-wm016-q12-union",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "左の枝では"
            },
            {
              "type": "math",
              "latex": "x\\le -5"
            },
            {
              "type": "text",
              "text": "、右の枝では"
            },
            {
              "type": "math",
              "latex": "x\\ge -1"
            },
            {
              "type": "text",
              "text": "。どちらか一方を満たせばよいため「または」で結ぶ。"
            },
            {
              "type": "text",
              "text": "もとの不等号には等号があるので、"
            },
            {
              "type": "math",
              "latex": "x=-5"
            },
            {
              "type": "text",
              "text": "と"
            },
            {
              "type": "math",
              "latex": "x=-1"
            },
            {
              "type": "text",
              "text": "はどちらも解に含まれる。その間は解にならない。"
            },
            {
              "type": "math",
              "latex": "x\\le-5\\;\\text{または}\\;x\\ge-1"
            }
          ]
        },
        {
          "id": "n14-lead-13",
          "type": "paragraph",
          "parts": [
            {
              "type": "math",
              "latex": "|3x-2|\\le 4"
            },
            {
              "type": "text",
              "text": "では等号を含む距離の上限。内側の二重不等式を作る。"
            },
            {
              "type": "math",
              "latex": "|3x-2|\\le4"
            }
          ]
        },
        {
          "id": "n14-formula-13",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "n14-13"
            }
          ]
        },
        {
          "id": "n14-after-13",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "次は三辺に共通する操作を考え、中央の定数を整理する。"
            }
          ]
        },
        {
          "id": "n14-lead-14",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "-4\\le3x-2\\le4"
            }
          ],
          "derivationId": "n14-q14-chain"
        },
        {
          "id": "n14-formula-14",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "-4+"
            },
            {
              "type": "choice",
              "itemId": "n14-wm019-q14-add-left"
            },
            {
              "type": "math",
              "latex": "\\le3x-2+"
            },
            {
              "type": "choice",
              "itemId": "n14-wm019-q14-add-center"
            },
            {
              "type": "math",
              "latex": "\\le4+"
            },
            {
              "type": "choice",
              "itemId": "n14-wm019-q14-add-right"
            }
          ],
          "derivationId": "n14-q14-chain"
        },
        {
          "id": "n14-wm019-q14-explain",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "三辺に同じ数を足しても、不等号の向きと等号は変わらない。中央の−2と＋2が打ち消し合い、"
            },
            {
              "type": "math",
              "latex": "3x"
            },
            {
              "type": "text",
              "text": "だけが残る。"
            }
          ],
          "derivationId": "n14-q14-chain"
        },
        {
          "id": "n14-wm019-q14-result",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "n14-14"
            },
            {
              "type": "math",
              "latex": "\\le3x\\le"
            },
            {
              "type": "choice",
              "itemId": "n14-wm019-q14-bound-right"
            }
          ],
          "derivationId": "n14-q14-chain"
        },
        {
          "id": "n14-after-14",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "三辺に同じ変形を行い、中央の"
            },
            {
              "type": "math",
              "latex": "x"
            },
            {
              "type": "text",
              "text": "の係数を1にする段階へ進もう。"
            }
          ]
        },
        {
          "id": "n14-lead-15",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "-2\\le3x\\le6"
            }
          ],
          "derivationId": "n14-q15-chain"
        },
        {
          "id": "n14-formula-15",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "-2\\div"
            },
            {
              "type": "choice",
              "itemId": "n14-wm020-q15-divide-left"
            },
            {
              "type": "math",
              "latex": "\\le3x\\div"
            },
            {
              "type": "choice",
              "itemId": "n14-wm020-q15-divide-center"
            },
            {
              "type": "math",
              "latex": "\\le6\\div"
            },
            {
              "type": "choice",
              "itemId": "n14-wm020-q15-divide-right"
            }
          ],
          "derivationId": "n14-q15-chain"
        },
        {
          "id": "n14-wm020-q15-explain",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "三辺を正の3で割っても、不等号の向きと等号は変わらない。中央の"
            },
            {
              "type": "math",
              "latex": "3x"
            },
            {
              "type": "text",
              "text": "を3で割ると、"
            },
            {
              "type": "math",
              "latex": "x"
            },
            {
              "type": "text",
              "text": "だけが残る。"
            }
          ],
          "derivationId": "n14-q15-chain"
        },
        {
          "id": "n14-wm020-q15-result",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "n14-15"
            },
            {
              "type": "math",
              "latex": "\\le x\\le"
            },
            {
              "type": "choice",
              "itemId": "n14-wm020-q15-bound-right"
            }
          ],
          "derivationId": "n14-q15-chain"
        },
        {
          "id": "n14-after-15",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "最後に両端を元の"
            },
            {
              "type": "math",
              "latex": "|3x-2|"
            },
            {
              "type": "text",
              "text": "へ戻して、本当に等号が成立するか検査する。"
            }
          ]
        },
        {
          "id": "n14-lead-16",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "前問で求めた左端 "
            },
            {
              "type": "math",
              "latex": "x=-2/3"
            },
            {
              "type": "text",
              "text": " と右端 "
            },
            {
              "type": "math",
              "latex": "x=2"
            },
            {
              "type": "text",
              "text": " を、元の不等式に戻して確かめよう。まず絶対値の中身を計算し、次に絶対値を求める。"
            },
            {
              "type": "math",
              "latex": "|3x-2|\\le4"
            }
          ],
          "derivationId": "n14-q16-chain"
        },
        {
          "id": "n14-formula-16",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "x=-\\frac23:\\quad|3(-\\frac23)-2|"
            },
            {
              "type": "math",
              "latex": "=|"
            },
            {
              "type": "choice",
              "itemId": "n14-wm022-q16-left-inner"
            },
            {
              "type": "math",
              "latex": "|="
            },
            {
              "type": "choice",
              "itemId": "n14-wm022-q16-left-abs"
            }
          ],
          "derivationId": "n14-q16-chain"
        },
        {
          "id": "n14-wm022-q16-right",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "x=2:\\quad|3\\cdot2-2|"
            },
            {
              "type": "math",
              "latex": "=|"
            },
            {
              "type": "choice",
              "itemId": "n14-wm022-q16-right-inner"
            },
            {
              "type": "math",
              "latex": "|="
            },
            {
              "type": "choice",
              "itemId": "n14-wm022-q16-right-abs"
            }
          ],
          "derivationId": "n14-q16-chain"
        },
        {
          "id": "n14-wm022-q16-bridge",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "元の条件は絶対値が4以下であること。左右とも、その条件を満たすか考えよう。"
            }
          ],
          "derivationId": "n14-q16-chain"
        },
        {
          "id": "n14-wm022-q16-conclusion",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "両端の扱いを選ぼう。"
            },
            {
              "type": "choice",
              "itemId": "n14-16"
            }
          ],
          "derivationId": "n14-q16-chain"
        },
        {
          "id": "n14-after-16",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "左端も右端も絶対値が4となり、"
            },
            {
              "type": "math",
              "latex": "4\\le 4"
            },
            {
              "type": "text",
              "text": "を満たす。もとの不等号には等号があるので、両端とも解に含まれる。"
            }
          ]
        },
        {
          "id": "n14-w048-chapter-summary",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "この章では、同じ値や同じ条件を別の形で表してきました。式を整理するときは注目する文字を決め、展開ではすべての積を拾い、因数分解では展開との一致を確かめました。平方根では平方と符号を、絶対値では距離の意味を、不等式では変形に使う数の符号と境界の扱いを確かめました。"
            }
          ]
        },
        {
          "id": "n14-w048-next-chapter-bridge",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "次の二次関数では、一つの値を変えたときに、もう一つの値がどう変わるかを調べます。この章で使った展開・因数分解・平方根・不等式を、グラフの形や値の範囲を読む道具として使います。"
            }
          ]
        }
      ],
      "items": [
        {
          "id": "n14-01",
          "label": "N14-01",
          "prompt": "言葉で表した条件を選ぼう。",
          "answer": "原点からの距離が3より小さい",
          "acceptedAnswers": [],
          "answerType": "text",
          "choices": [
            "原点からの距離が3より小さい",
            "原点からの距離が3より大きい",
            "座標が3より大きい",
            "原点からの距離が3以上"
          ],
          "purpose": "concept-formation",
          "scaffoldLevel": "strong",
          "hints": [
            "絶対値は座標の符号ではなく原点からの距離。"
          ]
        },
        {
          "id": "n14-02",
          "label": "N14-02",
          "prompt": "二つの境界を選ぼう。",
          "answer": "x=-3,\\quad x=3",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "x=-3,\\quad x=3",
            "x=0,\\quad x=3",
            "x=-3,\\quad x=0",
            "x=3,\\quad x=6"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "strong",
          "hints": [
            "3だけ左へ動いた点と3だけ右へ動いた点。"
          ]
        },
        {
          "id": "n14-w048-q03-region",
          "label": "N14-W048-Q03-REGION",
          "prompt": "距離が3未満となる領域を、二点の間と外側から選びましょう。",
          "answer": "二点の間",
          "acceptedAnswers": [],
          "answerType": "text",
          "choices": [
            "二点の間",
            "二点の外側",
            "右側だけ",
            "左側だけ"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "light",
          "hints": [
            "原点と、境界の外にある点をそれぞれ元の条件に当てはめて比べます。"
          ]
        },
        {
          "id": "n14-03",
          "label": "N14-03",
          "prompt": "判定した領域に、境界を含むかどうかを合わせてまとめよう。",
          "answer": "二点の間、両端を含まない",
          "acceptedAnswers": [],
          "answerType": "text",
          "choices": [
            "二点の間、両端を含まない",
            "二点の外側、両端を含まない",
            "二点の間、両端を含む",
            "二点の外側、両端を含む"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "境界では距離がちょうど3です。その値が元の不等号を満たすか確かめます。"
          ]
        },
        {
          "id": "n14-04",
          "label": "N14-04",
          "prompt": "xについての範囲を選ぼう。",
          "answer": "-3<x<3",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "-3<x<3",
            "x<-3\\;\\text{または}\\;x>3",
            "-3\\le x\\le3",
            "3<x<-3"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "xは−3より大きく、かつ3より小さい。"
          ]
        },
        {
          "id": "n14-w048-q05-boundaries",
          "label": "N14-W048-Q05-BOUNDARIES",
          "prompt": "距離がちょうど4になる二つの境界を選びましょう。",
          "answer": "x=-4,\\quad x=4",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "x=-4,\\quad x=4",
            "x=0,\\quad x=4",
            "x=-4,\\quad x=0",
            "x=4,\\quad x=8"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "light",
          "hints": [
            "境界では距離がちょうど4になります。N13で求めた左右の位置を使います。"
          ]
        },
        {
          "id": "n14-w048-q05-region",
          "label": "N14-W048-Q05-REGION",
          "prompt": "元の距離の下限を満たすのは、二点の間と外側のどちらでしょう。",
          "answer": "二点の外側",
          "acceptedAnswers": [],
          "answerType": "text",
          "choices": [
            "二点の外側",
            "二点の間",
            "右側だけ",
            "左側だけ"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "light",
          "hints": [
            "原点と、境界より遠い位置をそれぞれ条件に当てはめて比べます。"
          ]
        },
        {
          "id": "n14-05",
          "label": "N14-05",
          "prompt": "求めた境界と領域に、等号の条件を合わせて結果をまとめよう。",
          "answer": "境界−4と4、外側、端点を含む",
          "acceptedAnswers": [],
          "answerType": "text",
          "choices": [
            "境界−4と4、外側、端点を含む",
            "境界−4と4、内側、端点を含む",
            "境界−4と4、外側、端点を含まない",
            "境界0と4、外側、端点を含む"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "境界では距離がちょうど4です。その値が元の不等号を満たすか確かめます。"
          ]
        },
        {
          "id": "n14-06",
          "label": "N14-06",
          "prompt": "残す範囲と二つの枝のつなぎ方を選ぼう。",
          "answer": "x\\le-4\\;\\text{または}\\;x\\ge4",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "x\\le-4\\;\\text{または}\\;x\\ge4",
            "-4\\le x\\le4",
            "x<-4\\;\\text{または}\\;x>4",
            "x\\le-4\\;\\text{かつ}\\;x\\ge4"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "左右に離れた二つの範囲のいずれかを満たせばよい。等号も確認する。"
          ]
        },
        {
          "id": "n14-wm014-q07-nonnegative",
          "label": "N14-WM014-Q07-NONNEGATIVE",
          "prompt": "Xが0以上のとき、|X|<aとX≥0の両方から範囲を考えよう。",
          "answer": "0\\le X<a",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "0\\le X<a",
            "0\\le X\\le a",
            "X>a",
            "-a<X<0"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "X≥0では絶対値を外すとXのまま。もとの「より小さい」は厳密な不等号。"
          ]
        },
        {
          "id": "n14-wm014-q07-negative",
          "label": "N14-WM014-Q07-NEGATIVE",
          "prompt": "Xが負のとき、−X<aを解き、X<0と組み合わせよう。",
          "answer": "-a<X<0",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "-a<X<0",
            "-a\\le X<0",
            "X<-a",
            "0\\le X<a"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "Xに直すため−1倍すると、不等号の向きが逆になる。X<0も忘れない。"
          ]
        },
        {
          "id": "n14-07",
          "label": "N14-07",
          "prompt": "絶対値なしの一つの範囲を選ぼう。",
          "answer": "-a<X<a",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "-a<X<a",
            "X<-a\\;\\text{または}\\;X>a",
            "-a\\le X\\le a",
            "a<X<-a"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "距離の上限は二つの境界の間で、等号を含まない。"
          ]
        },
        {
          "id": "n14-wm015-q08-nonnegative",
          "label": "N14-WM015-Q08-NONNEGATIVE",
          "prompt": "Xが0以上のとき、|X|>aを絶対値のない条件へ直そう。",
          "answer": "X>a",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "X>a",
            "X\\ge a",
            "0\\le X<a",
            "X<-a"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "X≥0なら|X|はXのまま。元の不等号は「より大きい」。"
          ]
        },
        {
          "id": "n14-wm015-q08-negative",
          "label": "N14-WM015-Q08-NEGATIVE",
          "prompt": "Xが負のとき、−X>aを解こう。",
          "answer": "X<-a",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "X<-a",
            "X\\le-a",
            "X>-a",
            "X>a"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "−1を掛けると不等号の向きが変わる。"
          ]
        },
        {
          "id": "n14-08",
          "label": "N14-08",
          "prompt": "絶対値のない二つの範囲を選ぼう。",
          "answer": "X<-a\\;\\text{または}\\;X>a",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "X<-a\\;\\text{または}\\;X>a",
            "-a<X<a",
            "X\\le-a\\;\\text{または}\\;X\\ge a",
            "X<-a\\;\\text{かつ}\\;X>a"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "左右の外側に分かれ、等号を含まない。"
          ]
        },
        {
          "id": "n14-09",
          "label": "N14-09",
          "prompt": "最初に得られる二重不等式を選ぼう。",
          "answer": "-5<x-3<5",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "-5<x-3<5",
            "x-3<-5\\;\\text{または}\\;x-3>5",
            "-5\\le x-3\\le5",
            "-5<x<5"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "まだ3を移動せず、中身x−3のまま−5と5の間に挟む。"
          ]
        },
        {
          "id": "n14-wm018-q10-add-left",
          "label": "N14-WM018-Q10-ADD-LEFT",
          "prompt": "左端−5に足す数を選ぼう。",
          "answer": "3",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "3",
            "-3",
            "2",
            "5"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "light",
          "hints": [
            "中央の−3を打ち消す操作を、左端にも行おう。"
          ]
        },
        {
          "id": "n14-wm018-q10-add-center",
          "label": "N14-WM018-Q10-ADD-CENTER",
          "prompt": "真ん中のx−3の定数を打ち消す数を選ぼう。",
          "answer": "3",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "3",
            "-3",
            "0",
            "5"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "light",
          "hints": [
            "負の定数を打ち消すには、符号が逆の数を足す。"
          ]
        },
        {
          "id": "n14-wm018-q10-add-right",
          "label": "N14-WM018-Q10-ADD-RIGHT",
          "prompt": "右端5にも同じ数を足そう。",
          "answer": "3",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "3",
            "-3",
            "-5",
            "2"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "light",
          "hints": [
            "左端と真ん中に使った加える数にそろえる。"
          ]
        },
        {
          "id": "n14-10",
          "label": "N14-10",
          "prompt": "左端の−5と加えた数を計算しよう。",
          "answer": "-2",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "-2",
            "2",
            "-8",
            "-5"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "light",
          "hints": [
            "−5に正の数を足したときの位置を数直線で考える。"
          ]
        },
        {
          "id": "n14-wm018-q10-bound-right",
          "label": "N14-WM018-Q10-BOUND-RIGHT",
          "prompt": "右端の5と加えた数を計算しよう。",
          "answer": "8",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "8",
            "2",
            "5",
            "-8"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "light",
          "hints": [
            "5から正の方向へ動いた結果を計算する。"
          ]
        },
        {
          "id": "n14-11",
          "label": "N14-11",
          "prompt": "内外と端点を判断し、絶対値を外した二条件を選ぼう。",
          "answer": "x+3\\le-2\\;\\text{または}\\;x+3\\ge2",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "x+3\\le-2\\;\\text{または}\\;x+3\\ge2",
            "-2\\le x+3\\le2",
            "x+3<-2\\;\\text{または}\\;x+3>2",
            "x+3\\le-2\\;\\text{かつ}\\;x+3\\ge2"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "≥という距離の下限を、x+3が取りうる位置として数直線で想像しよう。端点を含むかも考える。"
          ]
        },
        {
          "id": "n14-wm016-q12-left",
          "label": "N14-WM016-Q12-LEFT",
          "prompt": "左側の不等式x+3≤−2について、両辺から3を引こう。",
          "answer": "x\\le-5",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "x\\le-5",
            "x<-5",
            "x\\ge-5",
            "x\\le-1"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "両辺から同じ3を引いても不等号の向きは変わらない。"
          ]
        },
        {
          "id": "n14-wm016-q12-right",
          "label": "N14-WM016-Q12-RIGHT",
          "prompt": "右側の不等式x+3≥2について、両辺から3を引こう。",
          "answer": "x\\ge-1",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "x\\ge-1",
            "x>-1",
            "x\\le-1",
            "x\\ge1"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "右辺では2−3を計算する。両辺から3を引くと向きは変わらない。"
          ]
        },
        {
          "id": "n14-12",
          "label": "N14-12",
          "prompt": "最終的な二領域を選ぼう。",
          "answer": "x\\le-5\\;\\text{または}\\;x\\ge-1",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "x\\le-5\\;\\text{または}\\;x\\ge-1",
            "-5\\le x\\le-1",
            "x<-5\\;\\text{または}\\;x>-1",
            "x\\le-1\\;\\text{または}\\;x\\ge5"
          ],
          "purpose": "transfer",
          "scaffoldLevel": "light",
          "hints": [
            "両方の枝から同じ3を引くが、枝どうしは結合しない。"
          ]
        },
        {
          "id": "n14-13",
          "label": "N14-13",
          "prompt": "絶対値を外した条件を選ぼう。",
          "answer": "-4\\le3x-2\\le4",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "-4\\le3x-2\\le4",
            "3x-2\\le-4\\;\\text{または}\\;3x-2\\ge4",
            "-4<3x-2<4",
            "-4\\le3x\\le4"
          ],
          "purpose": "transfer",
          "scaffoldLevel": "light",
          "hints": [
            "≤では内側の両端も残し、中身全体を挟む。"
          ]
        },
        {
          "id": "n14-wm019-q14-add-left",
          "label": "N14-WM019-Q14-ADD-LEFT",
          "prompt": "左端−4にも同じ数を足そう。",
          "answer": "2",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "2",
            "-2",
            "4",
            "6"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "light",
          "hints": [
            "中央の−2を打ち消すには何を足すか考え、左端にも同じ操作をしよう。"
          ]
        },
        {
          "id": "n14-wm019-q14-add-center",
          "label": "N14-WM019-Q14-ADD-CENTER",
          "prompt": "中央3x−2の定数を打ち消す数を選ぼう。",
          "answer": "2",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "2",
            "-2",
            "0",
            "3"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "light",
          "hints": [
            "−2と足して0になる数を考えよう。"
          ]
        },
        {
          "id": "n14-wm019-q14-add-right",
          "label": "N14-WM019-Q14-ADD-RIGHT",
          "prompt": "右端4にも同じ数を足そう。",
          "answer": "2",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "2",
            "-2",
            "4",
            "0"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "light",
          "hints": [
            "左端と中央に使った同じ数を右端にも足そう。"
          ]
        },
        {
          "id": "n14-14",
          "label": "N14-14",
          "prompt": "左端の−4と加えた数を計算しよう。",
          "answer": "-2",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "-2",
            "2",
            "-6",
            "-4"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "light",
          "hints": [
            "−4に正の2を足すと数直線上でどこに動くか考えよう。"
          ]
        },
        {
          "id": "n14-wm019-q14-bound-right",
          "label": "N14-WM019-Q14-BOUND-RIGHT",
          "prompt": "右端の4と加えた数を計算しよう。",
          "answer": "6",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "6",
            "2",
            "4",
            "-6"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "light",
          "hints": [
            "4と2を足した結果を計算しよう。"
          ]
        },
        {
          "id": "n14-wm020-q15-divide-left",
          "label": "N14-WM020-Q15-DIVIDE-LEFT",
          "prompt": "左端−2を割る正の数を選ぼう。",
          "answer": "3",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "3",
            "-3",
            "2",
            "6"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "light",
          "hints": [
            "中央の3xから係数3を取り除くには何で割ればよいか考え、左端にも同じ除数を使おう。"
          ]
        },
        {
          "id": "n14-wm020-q15-divide-center",
          "label": "N14-WM020-Q15-DIVIDE-CENTER",
          "prompt": "中央3xの係数を1にする除数を選ぼう。",
          "answer": "3",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "3",
            "-3",
            "1",
            "6"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "light",
          "hints": [
            "係数を1にする方法を、まず小さい数で考えよう。① 2×□=1 の□には何が入る？ ② 3×□=1 では？ ③ 同じ考え方で、3x×□=x の□には何が入る？ ④ この掛け算を割り算に直すと、3x÷□=x の□には何が入る？"
          ]
        },
        {
          "id": "n14-wm020-q15-divide-right",
          "label": "N14-WM020-Q15-DIVIDE-RIGHT",
          "prompt": "右端6にも同じ正の除数を使おう。",
          "answer": "3",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "3",
            "-3",
            "2",
            "6"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "light",
          "hints": [
            "左端と中央に使った正の除数と同じ数で割ろう。"
          ]
        },
        {
          "id": "n14-15",
          "label": "N14-15",
          "prompt": "左端−2を正の3で割った値を計算しよう。",
          "answer": "-\\frac23",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "-\\frac23",
            "\\frac23",
            "-6",
            "-\\frac32"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "light",
          "hints": [
            "負の2を正の3で割るので答えは負。分子と分母を確認しよう。"
          ]
        },
        {
          "id": "n14-wm020-q15-bound-right",
          "label": "N14-WM020-Q15-BOUND-RIGHT",
          "prompt": "右端6を正の3で割った値を計算しよう。",
          "answer": "2",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "2",
            "3",
            "-2",
            "\\frac12"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "light",
          "hints": [
            "6÷3を計算し、等号の有無を変えずに右端の境界を埋めよう。"
          ]
        },
        {
          "id": "n14-wm022-q16-left-inner",
          "label": "N14-WM022-Q16-LEFT-INNER",
          "prompt": "左端x=−2/3を代入して、3x−2を計算しよう。",
          "answer": "-4",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "-4",
            "4",
            "-2",
            "0"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "light",
          "hints": [
            "まず3×(−1/3)=−1を考えよう。今度は−2/3を掛ける。その積を求めた後で2を引こう。"
          ]
        },
        {
          "id": "n14-wm022-q16-left-abs",
          "label": "N14-WM022-Q16-LEFT-ABS",
          "prompt": "左端の中身を使って絶対値を求めよう。",
          "answer": "4",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "4",
            "-4",
            "2",
            "0"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "light",
          "hints": [
            "たとえば|−3|=3。絶対値は0からの距離だよ。直前に求めた負の数にも同じ規則を使おう。"
          ]
        },
        {
          "id": "n14-wm022-q16-right-inner",
          "label": "N14-WM022-Q16-RIGHT-INNER",
          "prompt": "右端x=2を代入して、3x−2を計算しよう。",
          "answer": "4",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "4",
            "-4",
            "2",
            "6"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "light",
          "hints": [
            "たとえばx=1なら3×1−2を計算する。同じ順序で、今回はx=2を入れよう。"
          ]
        },
        {
          "id": "n14-wm022-q16-right-abs",
          "label": "N14-WM022-Q16-RIGHT-ABS",
          "prompt": "右端の中身を使って絶対値を求めよう。",
          "answer": "4",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "4",
            "-4",
            "2",
            "0"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "light",
          "hints": [
            "たとえば|2|=2。中身が0以上のときは、その値がそのまま距離になる。直前の結果に当てはめよう。"
          ]
        },
        {
          "id": "n14-16",
          "label": "N14-16",
          "prompt": "元の不等式を満たすか確認し、両端の扱いを選ぼう。",
          "answer": "両端とも含む",
          "acceptedAnswers": [],
          "answerType": "text",
          "choices": [
            "両端とも含む",
            "左端だけ含む",
            "右端だけ含む",
            "両端とも含まない"
          ],
          "purpose": "transfer",
          "scaffoldLevel": "light",
          "hints": [
            "たとえば|−2|≤2は、等号でも成り立つ。左右の絶対値と元の上限4を一つずつ比べよう。"
          ]
        }
      ]
    }
  ]
}
export const mathNumbersN14Unit=validateTextbookUnits([rawN14W048])[0]
export const n14W048DisplayContract = {
  "unitId": "math-numbers-expressions-n14",
  "revision": 11,
  "irHash": "e4cc4488df65fc59fbe820cb7d85d769f792f562f6ca6feb3600517c659f75aa",
  "equationNumbers": {
    "n14-formula-02": 1,
    "n14-formula-04": 2,
    "n14-w048-q05-boundaries-formula": 3,
    "n14-formula-06": 4,
    "n14-formula-wm014-q07-nonnegative": 5,
    "n14-formula-wm014-q07-negative": 6,
    "n14-formula-07": 7,
    "n14-formula-wm015-q08-nonnegative": 8,
    "n14-formula-wm015-q08-negative": 9,
    "n14-formula-08": 10,
    "n14-formula-09": 11,
    "n14-wm018-q10-result": 12,
    "n14-formula-11": 13,
    "n14-formula-wm016-q12-left": 14,
    "n14-formula-wm016-q12-right": 15,
    "n14-formula-12": 16,
    "n14-formula-13": 17,
    "n14-wm019-q14-result": 18,
    "n14-wm020-q15-result": 19,
    "n14-wm022-q16-right": 20
  }
} as const
n14SourceToItemIds["N14-Q03"] = ["n14-w048-q03-region", "n14-03"]
n14SourceToItemIds["N14-Q05"] = ["n14-w048-q05-boundaries", "n14-w048-q05-region", "n14-05"]

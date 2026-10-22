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

const rawN14={
  schemaVersion:'1.1' as const,unitId:'math-numbers-expressions-n14',revision:9,status:'review' as const,subject:'math-1a' as const,
  chapter:{chapterId:'math-ch01-numbers-expressions',chapterNumber:'1',chapterTitle:'数と式',unitCode:'1NUM',orderInChapter:14,sourcePages:[35,36]},
  title:'距離の上限と下限から、残す範囲を決める',subtitle:'絶対値の内側・外側と端点を、数直線で選び分ける。',
  source:{type:'reference' as const,label:'ユーザー提供「数と式」教科書モード対話段階導入版 v2 / N14',
    rightsNote:'教師編集WordのN14原問16件、答えの後に開く元数直線1点、別冊解答未提供の独立導出、レビュー限定。'},
  objectives:['距離の上限と下限を内外の範囲へ翻訳する','等号の有無から端点の包含を判断する','二重不等式と「または」の二枝を区別して解く'],
  sections:[{id:'lesson',number:'14',title:'本文',role:'concept' as const,
    description:'範囲の意味から変形し、元の条件へ戻して検算する。',
    figures:[{id:'n14-f01',src:'/assets/math/textbook/numbers/n14-f01.png',alt:'距離が3より小さい範囲と4以上の範囲を上下で比較した、解答後確認用の元図。',caption:'二つの範囲を導いた後で、内側と外側を図で比較する。',overlays:[]}],
    readingFlow:q15Content.readingFlow,items:q15Content.items}],
}
export const mathNumbersN14Unit=validateTextbookUnits([rawN14])[0]

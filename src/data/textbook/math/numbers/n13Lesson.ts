import { validateTextbookUnits } from '../../../../domain/textbookSchema'
import { T, M, C, reviewItem, oneToOneSourceMap } from './reviewLessonHelpers'
import type { TextbookItem, TextbookReadingBlock } from '../../../../domain/textbookSchema'
import { makeReviewSteps } from './newBatchGuidedSteps'

export const n13SourceToItemIds = oneToOneSourceMap('N13', 9)
n13SourceToItemIds['N13-Q05'] = ['n13-wm023-q05-right', 'n13-05']
const originalContent = makeReviewSteps('n13', [
  {
    title:'距離を満たす二つの位置',
    intro:'絶対値は数直線上の距離を表す。距離が正であれば原点の左右に同じ距離の点が一つずつある。「または」で二つの位置を表す。',
    steps:[
      {q:1,lead:'|x|=5は原点から5離れた点の条件。左右どちらも調べる。',expr:'|x|=5',prompt:'すべての実数解を選ぼう。',answer:'x=5\\;\\text{または}\\;x=-5',wrong:['x=5','x=-5','x=5\\;\\text{かつ}\\;x=-5'],hint:'距離は正でも点の座標は左右で符号が違う。',after:'「または」はどちらか一方を満たせばよい条件で、両方を同時に満たす意味ではない。'},
      {q:2,lead:'|x−1|=4では中のx−1全体をXと置く。さきほどの距離4の条件をXに使う。',expr:'X=x-1,\\quad|X|=4',prompt:'Xについての二つの可能性を選ぼう。',answer:'X=4\\;\\text{または}\\;X=-4',wrong:['X=4','X=4\\;\\text{かつ}\\;X=-4','X=\\pm1'],hint:'|X|=正の数の解は左右の二つに分かれる。',after:'中身をひとまとまりにしたまま、距離の条件を方程式へ戻せた。'},
      {q:3,lead:'仮の文字Xを元のx−1に置き換え、二つの普通の方程式にする。',expr:'X=x-1',prompt:'xについての二つの方程式を書こう。',answer:'x-1=4\\;\\text{または}\\;x-1=-4',wrong:['x=4\\;\\text{または}\\;x=-4','x+1=4\\;\\text{または}\\;x+1=-4','x-1=4\\;\\text{かつ}\\;x-1=-4'],hint:'Xだけをx−1へ戻す。両方の符号の枝を残す。',after:'二本の式をそれぞれ解けば、元の絶対値方程式の候補が揃う。'},
      {q:4,lead:'x−1=4とx−1=−4のそれぞれで、両辺へ1を足す。',expr:'|x-1|=4',prompt:'xの解をすべて選ぼう。',answer:'x=5\\;\\text{または}\\;x=-3',wrong:['x=5','x=3\\;\\text{または}\\;x=-5','x=4\\;\\text{または}\\;x=-4'],hint:'両方の等式でxを一つだけにする。−4+1の符号にも注意。',after:'二つの点は1を中心として左右に同じ4だけ離れている。'},
    ],
  },
  {
    title:'中心を移しても距離は同じ',
    intro:'|x−1|は点xと点1の間の距離。xが1の右側か左側かによって、引き算の順を変える。',
    steps:[
      {q:5,lead:'元図では点1の右にある場合と左にある場合を別々に示す。距離は常に右の座標から左の座標を引く。',expr:'|x-1|',prompt:'二つの場合の式を選ぼう。',answer:'x-1\\;(x\\ge1),\\quad1-x\\;(x<1)',wrong:['x-1\\;(x\\ge1),\\quad x-1\\;(x<1)','1-x\\;(x\\ge1),\\quad x-1\\;(x<1)','x+1\\;(x\\ge1),\\quad1+x\\;(x<1)'],hint:'右側ではx−1、左側では1−xという引き算の順を考える。',after:'絶対値の一般的な場合分けを、中心1からの距離として読み直せる。'},
    ],
  },
  {
    title:'中の式を一つの数として扱う',
    intro:'別の式でも距離の二分岐がそのまま使える。右辺が0や負のときは、距離として可能かどうかを先に確かめる。',
    marker:'check',
    steps:[
      {q:6,lead:'|x+2|=3を解く。中身のx+2を、原点から距離3の一つの数と見よう。',expr:'|x+2|=3',prompt:'絶対値なしの二つの方程式を選ぼう。',answer:'x+2=3\\;\\text{または}\\;x+2=-3',wrong:['x=3\\;\\text{または}\\;x=-3','x+2=3\\;\\text{かつ}\\;x+2=-3','x-2=3\\;\\text{または}\\;x-2=-3'],hint:'中の式全体が3か−3のどちらかになる。',after:'二つの方程式を解くとき、+2を両方の枝から引く。'},
      {q:7,lead:'x+2=3とx+2=−3をそれぞれ解く。',expr:'|x+2|=3',prompt:'両方の解を選ぼう。',answer:'x=1\\;\\text{または}\\;x=-5',wrong:['x=1','x=5\\;\\text{または}\\;x=-1','x=-1\\;\\text{または}\\;x=-5'],hint:'どちらの枝も両辺から2を引く。',after:'二つの解は−2を中心に左右へ3ずつ離れた位置にある。'},
      {q:8,lead:'|3x|=6の中身は3x全体。正と負の二つの等式へ分け、3で割ろう。',expr:'|3x|=6',prompt:'絶対値を外した二つの方程式と、得られた解を組にして選ぼう。',answer:'3x=6\\;\\text{または}\\;3x=-6,\\quad x=2\\;\\text{または}\\;x=-2',wrong:['3x=6\\;\\text{または}\\;3x=-6,\\quad x=6\\;\\text{または}\\;x=-6','3x=6\\;\\text{かつ}\\;3x=-6,\\quad x=2\\;\\text{または}\\;x=-2','3x=6\\;\\text{または}\\;3x=-6,\\quad x=2'],hint:'3x=6か3x=−6かを解く。',after:'係数付きでも、絶対値の中身全体の符号を先に分けるのが原則。'},
      {q:9,lead:'絶対値は負にならない。距離が0の場合と負の値を要求される場合を比べる。',expr:'|x|=0,\\quad|x|=-2',prompt:'それぞれの実数解について選ぼう。',kind:'text',answer:'0ならx=0、負なら実数解なし',wrong:['0ならx=±0、負ならx=±2','0なら解なし、負ならx=−2','両方ともすべての実数'],hint:'距離0は原点、負の距離を持つ点は存在しない。',after:'|X|=aでは、a>0なら二枝、a=0なら一つ、a<0なら実数解なし。次は距離に上限・下限を付ける。'},
    ],
  },
], [
  {id:'n13-f02',q:1,when:'after'},
  {id:'n13-f01',q:4,when:'after'},
])

// W-MATH-023/P-002, Stage A: original Q05 becomes two independent distance
// decisions, while original Q08 and every other original marker remain intact.
const q05Lead = originalContent.readingFlow.findIndex(block => block.id === 'n13-lead-05')
const q05Choice = originalContent.readingFlow.findIndex(block => block.id === 'n13-formula-05')
const q05After = originalContent.readingFlow.findIndex(block => block.id === 'n13-after-05')
const q05ItemIndex = originalContent.items.findIndex(item => item.id === 'n13-05')
if (q05Lead < 0 || q05Choice !== q05Lead + 1 ||
    q05After !== q05Lead + 2 || q05ItemIndex !== 4 ||
    originalContent.readingFlow[q05Lead - 1]?.id !== 'n13-show-n13-f01') {
  throw new Error('N13 Q05 source figure and guarded readingFlow changed')
}
const q05Blocks: TextbookReadingBlock[] = [
  {id:'n13-lead-05',type:'paragraph',derivationId:'n13-q05-chain',parts:[
    T('|x−1| は点 x と点 1 の距離。数直線でどちらが右にあるかを先に見て、右の座標から左の座標を引こう。'),
  ]},
  {id:'n13-wm023-q05-right',type:'formula',derivationId:'n13-q05-chain',parts:[
    M('x\\ge1:\\quad |x-1|='),C('n13-wm023-q05-right'),
  ]},
  {id:'n13-formula-05',type:'formula',derivationId:'n13-q05-chain',parts:[
    M('x<1:\\quad |x-1|='),C('n13-05'),
  ]},
  {id:'n13-after-05',type:'paragraph',parts:[
    T('x≥1ならx−1≥0、x<1なら1−x>0。どちらも二点間の距離として負にならない。'),
  ]},
]
const q05Items: TextbookItem[] = [
  reviewItem('n13-wm023-q05-right','x≥1 のとき、距離を式で表そう。',
    'x-1','formula',['1-x','x+1','-1-x'],'causal-reasoning','medium',
    ['たとえば x=3 のときは点3が点1より右。2点の距離はどちらの座標からどちらを引くだろう。']),
  reviewItem('n13-05','x<1 のとき、距離を式で表そう。',
    '1-x','formula',['x-1','1+x','-1-x'],'causal-reasoning','medium',
    ['たとえば x=0 のときは点1が点0より右。右側から左側を引く順番を、文字 x に戻そう。']),
]
const content = {
  readingFlow: [
    ...originalContent.readingFlow.slice(0,q05Lead),
    ...q05Blocks,
    ...originalContent.readingFlow.slice(q05After+1),
  ],
  items: [
    ...originalContent.items.slice(0,q05ItemIndex),
    ...q05Items,
    ...originalContent.items.slice(q05ItemIndex+1),
  ],
}
const rawN13={
  schemaVersion:'1.1' as const,unitId:'math-numbers-expressions-n13',revision:3,status:'review' as const,subject:'math-1a' as const,
  chapter:{chapterId:'math-ch01-numbers-expressions',chapterNumber:'1',chapterTitle:'数と式',unitCode:'1NUM',orderInChapter:13,sourcePages:[33,34]},
  title:'距離の条件を、二つの位置へ戻す',subtitle:'絶対値方程式を左右二つの位置と「または」で解く。',
  source:{type:'reference' as const,label:'ユーザー提供「数と式」教科書モード対話段階導入版 v2 / N13',
    rightsNote:'教師編集WordのN13原問9件と元の距離図2点を使用。独立解答、公式別冊未提供、レビュー限定。'},
  objectives:['絶対値方程式を左右二つの式へ分ける','平行移動した中心からの距離を読む','距離が0・負の場合を区別する'],
  sections:[{id:'lesson',number:'13',title:'本文',role:'concept' as const,
    description:'距離の意味を保ったまま二つの方程式へ変形する。',
    figures:[
      {id:'n13-f02',src:'/assets/math/textbook/numbers/n13-f02.png',alt:'原点から左右に同じ距離の二点を示す、解答後確認用の元数直線。',caption:'左右の位置と等しい距離を検算する。',overlays:[]},
      {id:'n13-f01',src:'/assets/math/textbook/numbers/n13-f01.png',alt:'点xが1の右側にある場合と左側にある場合の元図。',caption:'中心1からの距離を、引き算の順として考えよう。',overlays:[]},
    ],readingFlow:content.readingFlow,items:content.items}],
}
export const mathNumbersN13Unit=validateTextbookUnits([rawN13])[0]

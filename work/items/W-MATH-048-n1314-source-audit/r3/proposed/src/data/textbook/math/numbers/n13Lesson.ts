import { validateTextbookUnits } from '../../../../domain/textbookSchema'
import { T, M, C, reviewItem, oneToOneSourceMap } from './reviewLessonHelpers'
import type { TextbookItem, TextbookReadingBlock } from '../../../../domain/textbookSchema'
import { makeReviewSteps } from './newBatchGuidedSteps'

export const n13SourceToItemIds = oneToOneSourceMap('N13', 9)
n13SourceToItemIds['N13-Q05'] = ['n13-wm023-q05-right', 'n13-05']
n13SourceToItemIds['N13-Q08'] = ['n13-wm023-q08-branches','n13-wm023-q08-positive-root','n13-08']
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
    originalContent.readingFlow[q05Lead - 1]?.id !== 'n13-group-2' ||
    originalContent.readingFlow.findIndex(block => block.id === 'n13-show-n13-f01') >= q05Lead) {
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
const q05Content = {
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

// W-MATH-023/P-002 Stage B: Q05 Gate① user accepted. Keep its two existing
// decisions and all N13 Q01–04/Q06–07/Q09; only replace original Q08
// with branch-choice -> positive root -> negative root (3 separate choices).
const q08Start = q05Content.readingFlow.findIndex(block => block.id === 'n13-lead-08')
const q08OriginalChoice = q05Content.readingFlow.findIndex(block => block.id === 'n13-formula-08')
const q08After = q05Content.readingFlow.findIndex(block => block.id === 'n13-after-08')
const q08OriginalItemIndex = q05Content.items.findIndex(item => item.id === 'n13-08')
if (q08Start < 0 || q08OriginalChoice !== q08Start + 1 ||
    q08After !== q08Start + 2 || q08OriginalItemIndex !== 8 ||
    q05Content.readingFlow[q08Start-1]?.id !== 'n13-after-07' ||
    q05Content.readingFlow[q08After+1]?.id !== 'n13-lead-09') {
  throw new Error('N13 Q08 original boundaries/approved Q05 order changed')
}
const q08Blocks:TextbookReadingBlock[]=[
  {id:'n13-lead-08',type:'paragraph',derivationId:'n13-q08-chain',parts:[
    T('|3x|=6 では、はじめに絶対値の中身がとり得る二通りの等式を作り、それぞれを x について解こう。'),
    M('|3x|=6'),
  ]},
  {id:'n13-formula-08',type:'formula',derivationId:'n13-q08-chain',parts:[
    C('n13-wm023-q08-branches'),
  ]},
  {id:'n13-wm023-q08-positive-root',type:'formula',derivationId:'n13-q08-chain',parts:[
    M('3x=6\\Rightarrow x='),C('n13-wm023-q08-positive-root'),
  ]},
  {id:'n13-wm023-q08-negative-root',type:'formula',derivationId:'n13-q08-chain',parts:[
    M('3x=-6\\Rightarrow x='),C('n13-08'),
  ]},
  {id:'n13-after-08',type:'paragraph',parts:[
    M('x=2\\;\\text{または}\\;x=-2'),
    T('。二つの解は「または」で結ぶ。両方の条件を同時に満たすという意味ではない。'),
  ]},
]
const q08Items:TextbookItem[]=[
  reviewItem('n13-wm023-q08-branches',
    '中身3xがとり得る二つの等式を選ぼう。',
    '3x=6\\;\\text{または}\\;3x=-6','formula',
    ['3x=6\\;\\text{かつ}\\;3x=-6','3x=6','3x=-6'],
    'causal-reasoning','medium',
    ['|y|=3なら、正の位置と負の位置の両方がある。その2通りを今の中身3xに当てはめよう。']),
  reviewItem('n13-wm023-q08-positive-root',
    '3x=6 の解を求めよう。',
    '2','formula',['-2','6','\\frac12'],'causal-reasoning','medium',
    ['たとえば2u=6なら両辺を2で割ってu=3。ここでは係数3を使おう。']),
  reviewItem('n13-08','3x=−6 の解を求めよう。',
    '-2','formula',['2','-6','-\\frac12'],'causal-reasoning','medium',
    ['たとえば2u=−6ならu=−3。負の方も同じ正の係数3で割ろう。']),
]
const content={
  readingFlow:[
    ...q05Content.readingFlow.slice(0,q08Start),
    ...q08Blocks,
    ...q05Content.readingFlow.slice(q08After+1),
  ],
  items:[
    ...q05Content.items.slice(0,q08OriginalItemIndex),
    ...q08Items,
    ...q05Content.items.slice(q08OriginalItemIndex+1),
  ],
}
const rawN13={
  schemaVersion:'1.1' as const,unitId:'math-numbers-expressions-n13',revision:4,status:'review' as const,subject:'math-1a' as const,
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
export const mathNumbersN13LegacyUnit=validateTextbookUnits([rawN13])[0]

// W048 proposed exact compiler/physical-row output. Original legacy unit remains available.
const rawN13W048 = {
  "schemaVersion": "1.1",
  "unitId": "math-numbers-expressions-n13",
  "revision": 5,
  "status": "review",
  "subject": "math-1a",
  "chapter": {
    "chapterId": "math-ch01-numbers-expressions",
    "chapterNumber": "1",
    "chapterTitle": "数と式",
    "unitCode": "1NUM",
    "orderInChapter": 13,
    "sourcePages": [
      33,
      34
    ]
  },
  "title": "距離の条件を、二つの位置へ戻す",
  "subtitle": "絶対値方程式を左右二つの位置と「または」で解く。",
  "source": {
    "type": "reference",
    "label": "ユーザー提供「数と式」教科書モード対話段階導入版 v2 / N13",
    "rightsNote": "教師編集WordのN13原問9件と元の距離図2点を使用。独立解答、公式別冊未提供、レビュー限定。"
  },
  "objectives": [
    "絶対値方程式を左右二つの式へ分ける",
    "平行移動した中心からの距離を読む",
    "距離が0・負の場合を区別する"
  ],
  "sections": [
    {
      "id": "lesson",
      "number": "13",
      "title": "本文",
      "description": "距離の意味を保ったまま二つの方程式へ変形する。",
      "role": "concept",
      "figures": [
        {
          "id": "n13-f02",
          "src": "/assets/math/textbook/numbers/n13-f02.png",
          "alt": "原点から左右に同じ距離の二点を示す、解答後確認用の元数直線。",
          "caption": "左右の位置と等しい距離を検算する。",
          "overlays": []
        },
        {
          "id": "n13-f01",
          "src": "/assets/math/textbook/numbers/n13-f01.png",
          "alt": "点xが1の右側にある場合と左側にある場合の元図。",
          "caption": "中心1からの距離を、引き算の順として考えよう。",
          "overlays": []
        }
      ],
      "readingFlow": [
        {
          "id": "n13-heading-1",
          "type": "heading",
          "text": "距離を満たす二つの位置"
        },
        {
          "id": "n13-marker-1",
          "type": "marker",
          "kind": "example",
          "text": "例題"
        },
        {
          "id": "n13-group-1",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "絶対値は数直線上の距離を表す。距離が正であれば原点の左右に同じ距離の点が一つずつある。「または」で二つの位置を表す。"
            }
          ]
        },
        {
          "id": "n13-lead-01",
          "type": "paragraph",
          "parts": [
            {
              "type": "math",
              "latex": "|x|=5"
            },
            {
              "type": "text",
              "text": "は原点から5離れた点の条件。左右どちらも調べる。"
            },
            {
              "type": "math",
              "latex": "|x|=5"
            }
          ]
        },
        {
          "id": "n13-formula-01",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "n13-01"
            }
          ]
        },
        {
          "id": "n13-after-01",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "「または」はどちらか一方を満たせばよい条件で、両方を同時に満たす意味ではない。"
            }
          ]
        },
        {
          "id": "n13-show-n13-f02",
          "type": "figure",
          "figureId": "n13-f02"
        },
        {
          "id": "n13-w048-positive-distance-property",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "今の二つの位置を、正の距離"
            },
            {
              "type": "math",
              "latex": "a"
            },
            {
              "type": "text",
              "text": "に広げます。"
            },
            {
              "type": "math",
              "latex": "a>0:\\quad |x|=a\\iff(x=a\\;\\text{または}\\;x=-a)"
            },
            {
              "type": "text",
              "text": "「または」は、どちらか一方を満たせばよいという条件です。"
            }
          ]
        },
        {
          "id": "n13-lead-02",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "次の例題は、中身が式になっています。"
            },
            {
              "type": "math",
              "latex": "|x-1|=4"
            },
            {
              "type": "text",
              "text": "中身全体を一つの数として扱うため、"
            },
            {
              "type": "math",
              "latex": "X=x-1"
            },
            {
              "type": "text",
              "text": "と置きます。いまの距離の条件を"
            },
            {
              "type": "math",
              "latex": "X"
            },
            {
              "type": "text",
              "text": "について書き直しましょう。"
            }
          ]
        },
        {
          "id": "n13-formula-02",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "n13-02"
            }
          ]
        },
        {
          "id": "n13-after-02",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "中身をひとまとまりにしたまま、距離の条件を方程式へ戻せた。"
            }
          ]
        },
        {
          "id": "n13-lead-03",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "仮の文字"
            },
            {
              "type": "math",
              "latex": "X"
            },
            {
              "type": "text",
              "text": "を元の"
            },
            {
              "type": "math",
              "latex": "x-1"
            },
            {
              "type": "text",
              "text": "に置き換え、二つの普通の方程式にする。"
            },
            {
              "type": "math",
              "latex": "X=x-1"
            }
          ]
        },
        {
          "id": "n13-formula-03",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "n13-03"
            }
          ]
        },
        {
          "id": "n13-after-03",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "二本の式をそれぞれ解けば、元の絶対値方程式の候補が揃う。"
            }
          ]
        },
        {
          "id": "n13-lead-04",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "絶対値を外して得た二つの方程式を、それぞれ解きます。両辺に同じ数を加える規則を使い、片方を解いた後も、もう片方の枝を残します。"
            }
          ]
        },
        {
          "id": "n13-w048-q04-positive-lead",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "右の位置を求めます。右辺の4+1を計算しましょう。"
            }
          ],
          "derivationId": "n13-q04-chain"
        },
        {
          "id": "n13-w048-q04-positive-formula",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "x-1=4\\ \\Rightarrow\\ x=4+1="
            },
            {
              "type": "choice",
              "itemId": "n13-w048-q04-positive"
            }
          ],
          "derivationId": "n13-q04-chain"
        },
        {
          "id": "n13-w048-q04-positive-after",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "右の位置が決まりました。次は負の方程式を解きます。"
            }
          ],
          "derivationId": "n13-q04-chain"
        },
        {
          "id": "n13-w048-q04-negative-lead",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "左の位置を求めます。負号を残し、−4+1を計算しましょう。"
            }
          ],
          "derivationId": "n13-q04-chain"
        },
        {
          "id": "n13-w048-q04-negative-formula",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "x-1=-4\\ \\Rightarrow\\ x=-4+1="
            },
            {
              "type": "choice",
              "itemId": "n13-w048-q04-negative"
            }
          ],
          "derivationId": "n13-q04-chain"
        },
        {
          "id": "n13-w048-q04-negative-after",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "二本の方程式の解が揃いました。元の問いへの答えとして一組にします。"
            }
          ],
          "derivationId": "n13-q04-chain"
        },
        {
          "id": "n13-formula-04",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "n13-04"
            }
          ],
          "derivationId": "n13-q04-chain"
        },
        {
          "id": "n13-after-04",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "二つの点は1を中心として左右に同じ4だけ離れている。"
            }
          ]
        },
        {
          "id": "n13-show-n13-f01",
          "type": "figure",
          "figureId": "n13-f01"
        },
        {
          "id": "n13-heading-2",
          "type": "heading",
          "text": "中心を移しても距離は同じ"
        },
        {
          "id": "n13-marker-2",
          "type": "marker",
          "kind": "check",
          "text": "確認"
        },
        {
          "id": "n13-group-2",
          "type": "paragraph",
          "parts": [
            {
              "type": "math",
              "latex": "|x-1|"
            },
            {
              "type": "text",
              "text": "は点"
            },
            {
              "type": "math",
              "latex": "x"
            },
            {
              "type": "text",
              "text": "と点1の間の距離。"
            },
            {
              "type": "math",
              "latex": "x"
            },
            {
              "type": "text",
              "text": "が1の右側か左側かによって、引き算の順を変える。"
            }
          ]
        },
        {
          "id": "n13-lead-05",
          "type": "paragraph",
          "parts": [
            {
              "type": "math",
              "latex": "|x-1|"
            },
            {
              "type": "text",
              "text": " は点 "
            },
            {
              "type": "math",
              "latex": "x"
            },
            {
              "type": "text",
              "text": " と点 1 の距離。数直線でどちらが右にあるかを先に見て、右の座標から左の座標を引こう。"
            }
          ],
          "derivationId": "n13-q05-chain"
        },
        {
          "id": "n13-wm023-q05-right",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "x\\ge1:\\quad |x-1|="
            },
            {
              "type": "choice",
              "itemId": "n13-wm023-q05-right"
            }
          ],
          "derivationId": "n13-q05-chain"
        },
        {
          "id": "n13-formula-05",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "x<1:\\quad |x-1|="
            },
            {
              "type": "choice",
              "itemId": "n13-05"
            }
          ],
          "derivationId": "n13-q05-chain"
        },
        {
          "id": "n13-after-05",
          "type": "paragraph",
          "parts": [
            {
              "type": "math",
              "latex": "x\\ge 1"
            },
            {
              "type": "text",
              "text": "なら"
            },
            {
              "type": "math",
              "latex": "x-1\\ge 0"
            },
            {
              "type": "text",
              "text": "、"
            },
            {
              "type": "math",
              "latex": "x<1"
            },
            {
              "type": "text",
              "text": "なら"
            },
            {
              "type": "math",
              "latex": "1-x>0"
            },
            {
              "type": "text",
              "text": "。どちらも二点間の距離として負にならない。"
            }
          ]
        },
        {
          "id": "n13-heading-3",
          "type": "heading",
          "text": "中の式を一つの数として扱う"
        },
        {
          "id": "n13-marker-3",
          "type": "marker",
          "kind": "check",
          "text": "確認"
        },
        {
          "id": "n13-group-3",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "別の式でも距離の二分岐がそのまま使える。右辺が0や負のときは、距離として可能かどうかを先に確かめる。"
            }
          ]
        },
        {
          "id": "n13-lead-06",
          "type": "paragraph",
          "parts": [
            {
              "type": "math",
              "latex": "|x+2|=3"
            },
            {
              "type": "text",
              "text": "を解く。中身の"
            },
            {
              "type": "math",
              "latex": "x+2"
            },
            {
              "type": "text",
              "text": "を、原点から距離3の一つの数と見よう。"
            },
            {
              "type": "math",
              "latex": "|x+2|=3"
            }
          ]
        },
        {
          "id": "n13-formula-06",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "n13-06"
            }
          ]
        },
        {
          "id": "n13-after-06",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "二つの方程式を解くとき、+2を両方の枝から引く。"
            }
          ]
        },
        {
          "id": "n13-lead-07",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "次の確認でも、二つの方程式を別々に解きます。前の例題より説明を減らし、符号を自分で確かめましょう。"
            }
          ]
        },
        {
          "id": "n13-w048-q07-positive-lead",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "正の枝を"
            },
            {
              "type": "math",
              "latex": "x"
            },
            {
              "type": "text",
              "text": "について解きましょう。"
            }
          ],
          "derivationId": "n13-q07-chain"
        },
        {
          "id": "n13-w048-q07-positive-formula",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "x+2=3\\ \\Rightarrow\\ x="
            },
            {
              "type": "choice",
              "itemId": "n13-w048-q07-positive"
            }
          ],
          "derivationId": "n13-q07-chain"
        },
        {
          "id": "n13-w048-q07-positive-after",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "もう一方の枝も同じ操作で解きます。"
            }
          ],
          "derivationId": "n13-q07-chain"
        },
        {
          "id": "n13-w048-q07-negative-lead",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "負の枝も"
            },
            {
              "type": "math",
              "latex": "x"
            },
            {
              "type": "text",
              "text": "について解きましょう。"
            }
          ],
          "derivationId": "n13-q07-chain"
        },
        {
          "id": "n13-w048-q07-negative-formula",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "x+2=-3\\ \\Rightarrow\\ x="
            },
            {
              "type": "choice",
              "itemId": "n13-w048-q07-negative"
            }
          ],
          "derivationId": "n13-q07-chain"
        },
        {
          "id": "n13-w048-q07-negative-after",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "二つの結果を元の絶対値方程式の解としてまとめます。"
            }
          ],
          "derivationId": "n13-q07-chain"
        },
        {
          "id": "n13-formula-07",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "n13-07"
            }
          ],
          "derivationId": "n13-q07-chain"
        },
        {
          "id": "n13-after-07",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "二つの解は−2を中心に左右へ3ずつ離れた位置にある。"
            }
          ]
        },
        {
          "id": "n13-lead-08",
          "type": "paragraph",
          "parts": [
            {
              "type": "math",
              "latex": "|3x|=6"
            },
            {
              "type": "text",
              "text": " では、はじめに絶対値の中身がとり得る二通りの等式を作り、それぞれを "
            },
            {
              "type": "math",
              "latex": "x"
            },
            {
              "type": "text",
              "text": " について解こう。"
            },
            {
              "type": "math",
              "latex": "|3x|=6"
            }
          ],
          "derivationId": "n13-q08-chain"
        },
        {
          "id": "n13-formula-08",
          "type": "formula",
          "parts": [
            {
              "type": "choice",
              "itemId": "n13-wm023-q08-branches"
            }
          ],
          "derivationId": "n13-q08-chain"
        },
        {
          "id": "n13-wm023-q08-positive-root",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "3x=6\\Rightarrow x="
            },
            {
              "type": "choice",
              "itemId": "n13-wm023-q08-positive-root"
            }
          ],
          "derivationId": "n13-q08-chain"
        },
        {
          "id": "n13-wm023-q08-negative-root",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "3x=-6\\Rightarrow x="
            },
            {
              "type": "choice",
              "itemId": "n13-08"
            }
          ],
          "derivationId": "n13-q08-chain"
        },
        {
          "id": "n13-after-08",
          "type": "paragraph",
          "parts": [
            {
              "type": "math",
              "latex": "x=2\\;\\text{または}\\;x=-2"
            },
            {
              "type": "text",
              "text": "。二つの解は「または」で結ぶ。両方の条件を同時に満たすという意味ではない。"
            }
          ]
        },
        {
          "id": "n13-lead-09",
          "type": "paragraph",
          "parts": [
            {
              "type": "term",
              "text": "性質"
            },
            {
              "type": "text",
              "text": "を確かめます。ここまでは距離が正の場合でした。距離が0の場合と、負の値を要求された場合を分けて考えます。"
            }
          ]
        },
        {
          "id": "n13-w048-q09-zero-lead",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "まず、原点からの距離が0になる位置を求めましょう。"
            }
          ],
          "derivationId": "n13-q09-chain"
        },
        {
          "id": "n13-w048-q09-zero-formula",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "|x|=0\\ \\Rightarrow\\ x="
            },
            {
              "type": "choice",
              "itemId": "n13-w048-q09-zero"
            }
          ],
          "derivationId": "n13-q09-chain"
        },
        {
          "id": "n13-w048-q09-zero-after",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "距離が0の場合は一つの位置です。次は負の値を要求した条件を調べます。"
            }
          ],
          "derivationId": "n13-q09-chain"
        },
        {
          "id": "n13-w048-q09-negative-lead",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "次に、絶対値が負の数に等しくなる実数があるか判断しましょう。"
            }
          ],
          "derivationId": "n13-q09-chain"
        },
        {
          "id": "n13-w048-q09-negative-formula",
          "type": "formula",
          "parts": [
            {
              "type": "math",
              "latex": "|x|=-2\\quad "
            },
            {
              "type": "choice",
              "itemId": "n13-w048-q09-negative"
            }
          ],
          "derivationId": "n13-q09-chain"
        },
        {
          "id": "n13-w048-q09-negative-after",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "二つの場合の違いを、元の問いの順にまとめます。"
            }
          ],
          "derivationId": "n13-q09-chain"
        },
        {
          "id": "n13-formula-09",
          "type": "paragraph",
          "parts": [
            {
              "type": "text",
              "text": "考えて選ぶ："
            },
            {
              "type": "choice",
              "itemId": "n13-09"
            }
          ],
          "derivationId": "n13-q09-chain"
        },
        {
          "id": "n13-after-09",
          "type": "paragraph",
          "parts": [
            {
              "type": "math",
              "latex": "|X|=a"
            },
            {
              "type": "text",
              "text": "では、"
            },
            {
              "type": "math",
              "latex": "a>0"
            },
            {
              "type": "text",
              "text": "なら二枝、"
            },
            {
              "type": "math",
              "latex": "a=0"
            },
            {
              "type": "text",
              "text": "なら一つ、"
            },
            {
              "type": "math",
              "latex": "a<0"
            },
            {
              "type": "text",
              "text": "なら実数解なし。次は距離に上限・下限を付ける。"
            }
          ]
        }
      ],
      "items": [
        {
          "id": "n13-01",
          "label": "N13-01",
          "prompt": "すべての実数解を選ぼう。",
          "answer": "x=5\\;\\text{または}\\;x=-5",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "x=5\\;\\text{または}\\;x=-5",
            "x=5",
            "x=-5",
            "x=5\\;\\text{かつ}\\;x=-5"
          ],
          "purpose": "concept-formation",
          "scaffoldLevel": "strong",
          "hints": [
            "距離は正でも点の座標は左右で符号が違う。"
          ]
        },
        {
          "id": "n13-02",
          "label": "N13-02",
          "prompt": "Xについての二つの可能性を選ぼう。",
          "answer": "X=4\\;\\text{または}\\;X=-4",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "X=4\\;\\text{または}\\;X=-4",
            "X=4",
            "X=4\\;\\text{かつ}\\;X=-4",
            "X=\\pm1"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "strong",
          "hints": [
            "|X|=正の数の解は左右の二つに分かれる。"
          ]
        },
        {
          "id": "n13-03",
          "label": "N13-03",
          "prompt": "xについての二つの方程式を書こう。",
          "answer": "x-1=4\\;\\text{または}\\;x-1=-4",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "x-1=4\\;\\text{または}\\;x-1=-4",
            "x=4\\;\\text{または}\\;x=-4",
            "x+1=4\\;\\text{または}\\;x+1=-4",
            "x-1=4\\;\\text{かつ}\\;x-1=-4"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "Xだけをx−1へ戻す。両方の符号の枝を残す。"
          ]
        },
        {
          "id": "n13-w048-q04-positive",
          "label": "N13-W048-Q04-POSITIVE",
          "prompt": "右の位置を求めます。右辺の4+1を計算しましょう。",
          "answer": "5",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "5",
            "3",
            "-5",
            "4"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "light",
          "hints": [
            "両辺に1を足した結果を計算します。"
          ]
        },
        {
          "id": "n13-w048-q04-negative",
          "label": "N13-W048-Q04-NEGATIVE",
          "prompt": "左の位置を求めます。負号を残し、−4+1を計算しましょう。",
          "answer": "-3",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "-3",
            "3",
            "-5",
            "-4"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "light",
          "hints": [
            "負の数に正の1を加える位置を考えます。"
          ]
        },
        {
          "id": "n13-04",
          "label": "N13-04",
          "prompt": "xの解をすべて選ぼう。",
          "answer": "x=5\\;\\text{または}\\;x=-3",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "x=5\\;\\text{または}\\;x=-3",
            "x=5",
            "x=3\\;\\text{または}\\;x=-5",
            "x=4\\;\\text{または}\\;x=-4"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "両方の等式でxを一つだけにする。−4+1の符号にも注意。"
          ]
        },
        {
          "id": "n13-wm023-q05-right",
          "label": "N13-WM023-Q05-RIGHT",
          "prompt": "x≥1 のとき、距離を式で表そう。",
          "answer": "x-1",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "x-1",
            "1-x",
            "x+1",
            "-1-x"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "たとえば x=3 のときは点3が点1より右。2点の距離はどちらの座標からどちらを引くだろう。"
          ]
        },
        {
          "id": "n13-05",
          "label": "N13-05",
          "prompt": "x<1 のとき、距離を式で表そう。",
          "answer": "1-x",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "1-x",
            "x-1",
            "1+x",
            "-1-x"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "たとえば x=0 のときは点1が点0より右。右側から左側を引く順番を、文字 x に戻そう。"
          ]
        },
        {
          "id": "n13-06",
          "label": "N13-06",
          "prompt": "絶対値なしの二つの方程式を選ぼう。",
          "answer": "x+2=3\\;\\text{または}\\;x+2=-3",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "x+2=3\\;\\text{または}\\;x+2=-3",
            "x=3\\;\\text{または}\\;x=-3",
            "x+2=3\\;\\text{かつ}\\;x+2=-3",
            "x-2=3\\;\\text{または}\\;x-2=-3"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "絶対値が付いている範囲を確認し、中身全体を一つの数として、最初の例題で使った分け方を適用します。"
          ]
        },
        {
          "id": "n13-w048-q07-positive",
          "label": "N13-W048-Q07-POSITIVE",
          "prompt": "正の枝をxについて解きましょう。",
          "answer": "1",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "1",
            "5",
            "-1",
            "3"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "light",
          "hints": [
            "xだけを残すため、両辺から同じ数を引きます。"
          ]
        },
        {
          "id": "n13-w048-q07-negative",
          "label": "N13-W048-Q07-NEGATIVE",
          "prompt": "負の枝もxについて解きましょう。",
          "answer": "-5",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "-5",
            "-1",
            "5",
            "-3"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "light",
          "hints": [
            "右辺が負でも、左辺の定数を打ち消す操作は同じです。"
          ]
        },
        {
          "id": "n13-07",
          "label": "N13-07",
          "prompt": "両方の解を選ぼう。",
          "answer": "x=1\\;\\text{または}\\;x=-5",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "x=1\\;\\text{または}\\;x=-5",
            "x=1",
            "x=5\\;\\text{または}\\;x=-1",
            "x=-1\\;\\text{または}\\;x=-5"
          ],
          "purpose": "transfer",
          "scaffoldLevel": "light",
          "hints": [
            "どちらの枝も両辺から2を引く。"
          ]
        },
        {
          "id": "n13-wm023-q08-branches",
          "label": "N13-WM023-Q08-BRANCHES",
          "prompt": "中身3xがとり得る二つの等式を選ぼう。",
          "answer": "3x=6\\;\\text{または}\\;3x=-6",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "3x=6\\;\\text{または}\\;3x=-6",
            "3x=6\\;\\text{かつ}\\;3x=-6",
            "3x=6",
            "3x=-6"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "|y|=3なら、正の位置と負の位置の両方がある。その2通りを今の中身3xに当てはめよう。"
          ]
        },
        {
          "id": "n13-wm023-q08-positive-root",
          "label": "N13-WM023-Q08-POSITIVE-ROOT",
          "prompt": "3x=6 の解を求めよう。",
          "answer": "2",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "2",
            "-2",
            "6",
            "\\frac12"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "たとえば2u=6なら両辺を2で割ってu=3。ここでは係数3を使おう。"
          ]
        },
        {
          "id": "n13-08",
          "label": "N13-08",
          "prompt": "3x=−6 の解を求めよう。",
          "answer": "-2",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "-2",
            "2",
            "-6",
            "-\\frac12"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "medium",
          "hints": [
            "たとえば2u=−6ならu=−3。負の方も同じ正の係数3で割ろう。"
          ]
        },
        {
          "id": "n13-w048-q09-zero",
          "label": "N13-W048-Q09-ZERO",
          "prompt": "まず、原点からの距離が0になる位置を求めましょう。",
          "answer": "0",
          "acceptedAnswers": [],
          "answerType": "formula",
          "choices": [
            "0",
            "1",
            "-1",
            "2"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "light",
          "hints": [
            "点と原点が同じ位置にある場合の距離を考えます。"
          ]
        },
        {
          "id": "n13-w048-q09-negative",
          "label": "N13-W048-Q09-NEGATIVE",
          "prompt": "次に、絶対値が負の数に等しくなる実数があるか判断しましょう。",
          "answer": "実数解なし",
          "acceptedAnswers": [],
          "answerType": "text",
          "choices": [
            "実数解なし",
            "x=-2",
            "x=2",
            "すべての実数"
          ],
          "purpose": "causal-reasoning",
          "scaffoldLevel": "light",
          "hints": [
            "絶対値が取り得る値と、右辺の符号を照合します。"
          ]
        },
        {
          "id": "n13-09",
          "label": "N13-09",
          "prompt": "それぞれの実数解について選ぼう。",
          "answer": "0ならx=0、負なら実数解なし",
          "acceptedAnswers": [],
          "answerType": "text",
          "choices": [
            "0ならx=0、負なら実数解なし",
            "0ならx=±0、負ならx=±2",
            "0なら解なし、負ならx=−2",
            "両方ともすべての実数"
          ],
          "purpose": "transfer",
          "scaffoldLevel": "light",
          "hints": [
            "直前に別々に求めた二つの結果を、距離が0の場合、負の場合の順に対応させます。"
          ]
        }
      ]
    }
  ]
}
export const mathNumbersN13Unit=validateTextbookUnits([rawN13W048])[0]
export const n13W048DisplayContract = {
  "unitId": "math-numbers-expressions-n13",
  "revision": 5,
  "irHash": "eeebc72ad77f484720c768991e2b29ce6a4e5dd00d6d48403c3401e5aef3c827",
  "equationNumbers": {
    "n13-formula-01": 1,
    "n13-formula-02": 2,
    "n13-formula-03": 3,
    "n13-formula-04": 4,
    "n13-formula-05": 5,
    "n13-formula-06": 6,
    "n13-formula-07": 7,
    "n13-wm023-q08-negative-root": 8,
    "n13-w048-q09-negative-formula": 9
  }
} as const
n13SourceToItemIds["N13-Q04"] = ["n13-w048-q04-positive", "n13-w048-q04-negative", "n13-04"]
n13SourceToItemIds["N13-Q07"] = ["n13-w048-q07-positive", "n13-w048-q07-negative", "n13-07"]
n13SourceToItemIds["N13-Q09"] = ["n13-w048-q09-zero", "n13-w048-q09-negative", "n13-09"]

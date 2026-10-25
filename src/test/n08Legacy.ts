// Test-only frozen N08 v3; never imported by learner production modules.
import { validateTextbookUnits } from '../domain/textbookSchema'
import { oneToOneSourceMap } from '../data/textbook/math/numbers/reviewLessonHelpers'
import { makeReviewSteps } from '../data/textbook/math/numbers/newBatchGuidedSteps'

export const n08SourceToItemIds = oneToOneSourceMap('N08', 12)
const content = makeReviewSteps('n08', [
  {
    title:'原点からの距離を表す',
    intro:'数直線で位置の向きと距離を切り離して考える。左側の点でも、長さとしての距離は負にならない。',
    steps:[
      {q:1,lead:'元図の2.3と−5は、それぞれ原点の右と左にある。原点までの距離をこの順に比べる。',expr:'2.3,\\quad-5',prompt:'二点から原点までの距離を選ぼう。',answer:'2.3,\\quad5',wrong:['2.3,\\quad-5','-2.3,\\quad5','2.3,\\quad-5.0'],hint:'距離は原点からどれだけ離れているか。マイナスの向きは距離そのものではない。',after:'実数aの点と原点との距離を絶対値といい、|a|と書く。'},
      {q:2,lead:'aが0以上の位置にある。原点との距離を、座標aだけでどう表せるか考えよう。',expr:'a\\ge0',prompt:'この場合の|a|を記号なしで書こう。',answer:'|a|=a',wrong:['|a|=-a','|a|=0','|a|=a^2'],hint:'右側の座標aから原点0を引いた距離を考える。',after:'0を含む右側では、そのままの値が距離になる。'},
      {q:3,lead:'aが0より小さいなら左側にある。距離は右側の座標0から左側のaを引く。',expr:'a<0',prompt:'引き算から簡単にした距離を選ぼう。',answer:'0-a=-a',wrong:['0-a=a','a-0=a','0+a=a'],hint:'左側の点でも距離は正。0−aを計算する。',after:'負のaにマイナスを付けると、距離として正の値になる。'},
      {q:4,lead:'いまの−aへa=−5を代入して、実際の距離と照合する。',expr:'-a\\quad(a=-5)',prompt:'代入して得られる値を選ぼう。',answer:'-(-5)=5',wrong:['-(-5)=-5','-5=5','-(-5)=0'],hint:'二つの負号が重なったときの符号を確認する。',after:'a≥0なら|a|=a、a<0なら|a|=−aという場合分けが確かめられた。'},
    ],
  },
  {
    title:'中の式の正負を決めてから絶対値を外す',
    intro:'絶対値の中が差の形だからといって負とは限らない。まず数の大小を比べ、それから式全体の符号を扱う。',
    steps:[
      {q:5,lead:'√5と3はどちらも非負の数。二乗した値を自分で求めて比較すれば、元の二数の大小が決められる。',expr:'\\sqrt5,\\quad3',prompt:'二乗した値の大小比較と、√5と3の大小関係を組にして選ぼう。',answer:'5<9,\\quad\\sqrt5<3',wrong:['5>9,\\quad\\sqrt5>3','5<9,\\quad\\sqrt5>3','5=9,\\quad\\sqrt5=3'],hint:'根号の付いた数は、二乗すると根号の中の数に戻る。もう一方も二乗し、二つの値を比べよう。両方とも非負なので大小の向きは保たれる。',after:'5<9であり、両方非負なので√5<3。理由と結論の両方を確認できた。'},
      {q:6,lead:'直前の大小関係から、二つの数の差の符号が分かる。',expr:'\\sqrt5-3',prompt:'この式の符号を選ぼう。',kind:'text',answer:'負',wrong:['正','0','符号は決まらない'],hint:'左の数のほうが小さければ、左から右を引いた値はどうなるか。',after:'中身が負だと分かったので、絶対値を外すときは式全体に−1を掛ける。'},
      {q:7,lead:'中身が負のときは、括弧を付けて式全体を反転する。',expr:'|\\sqrt5-3|',prompt:'絶対値を外した式を選ぼう。',answer:'3-\\sqrt5',wrong:['\\sqrt5-3','-\\sqrt5-3','3+\\sqrt5'],hint:'−(√5−3)の括弧を外すと両項の符号が変わる。',after:'判定→括弧全体の反転という二段階を区別する。'},
      {q:8,lead:'今度は3−π。円周率πは3.14159…と分かっている。',expr:'3-\\pi',prompt:'差の符号と根拠を選ぼう。',kind:'text',answer:'負（πは3より大きい）',wrong:['正（3はπより大きい）','0（πは3と等しい）','符号は決められない'],hint:'πの小数表示の整数部分と続く数字を比べる。',after:'ここでも先に中身の符号を確定した。'},
      {q:9,lead:'3−πは負なので、絶対値を取ると式全体の符号を反転する。',expr:'|3-\\pi|',prompt:'絶対値記号のない式で答えよう。',answer:'\\pi-3',wrong:['3-\\pi','-\\pi-3','3+\\pi'],hint:'−(3−π)の括弧を外す。',after:'負の数を含む式でも、中身全体が一つの数と考えれば処理できる。'},
    ],
  },
  {
    title:'絶対値の性質を距離から確かめる',
    intro:'個々の計算を超えて、原点からの距離の性質を考える。どれも絶対値の定義から説明できる。',
    marker:'proof',
    steps:[
      {q:10,lead:'原点との距離が0になる点は数直線のどこにあるだろう。',expr:'|a|=0',prompt:'aの値と、数直線上で距離が0になる理由を組にして選ぼう。',answer:'a=0,\\quad\\text{原点と同じ位置にある}',wrong:['a=0,\\quad\\text{原点から離れている}','a>0,\\quad\\text{原点と同じ位置にある}','a<0,\\quad\\text{原点と同じ位置にある}'],hint:'離れている距離が0なら、原点と同じ位置。',after:'絶対値が0になるのは、もとの数そのものが0のときだけ。'},
      {q:11,lead:'aと−aは原点を挟んで左右対称な位置にある。',expr:'|a|,\\quad|-a|',prompt:'原点までの距離の関係を選ぼう。',answer:'|a|=|-a|',wrong:['|a|=-|-a|','|a|>|-a|','|a|+|-a|=0'],hint:'左右対称な点は原点から同じ距離にある。',after:'符号を反転させても絶対値は変わらない。'},
      {q:12,lead:'aが正でも負でも、|a|はaか−aのいずれか。その二乗の値を比較する。',expr:'|a|^2',prompt:'絶対値の二乗をaで表そう。',answer:'a^2',wrong:['|a|','-a^2','2a'],hint:'(+a)²と(−a)²は等しい。',after:'距離は非負だが、その二乗はもとの数の二乗に等しい。次の根号の学習へつながる。'},
    ],
  },
], [{id:'n08-f01',q:1,when:'before'}])
const rawN08={
  schemaVersion:'1.1' as const,unitId:'math-numbers-expressions-n08',revision:3,status:'review' as const,subject:'math-1a' as const,
  chapter:{chapterId:'math-ch01-numbers-expressions',chapterNumber:'1',chapterTitle:'数と式',unitCode:'1NUM',orderInChapter:8,sourcePages:[20,21]},
  title:'向きと距離を分けて、絶対値を読む',subtitle:'数直線の距離から場合分けを作り、式全体の符号を判定する。',
  source:{type:'reference' as const,label:'ユーザー提供「数と式」教科書モード対話段階導入版 v2 / N08',
    rightsNote:'教師編集WordのN08原問12件と元の数直線画像1点、独立解答、レビュー限定。'},
  objectives:['数直線上の距離を絶対値として捉える','式の正負を先に確かめて絶対値を外す','絶対値の一般的な性質を距離から導く'],
  sections:[{id:'lesson',number:'08',title:'本文',role:'concept' as const,
    description:'元図の二点から距離・符号の考えへつなげる。',
    figures:[{id:'n08-f01',src:'/assets/math/textbook/numbers/n08-f01.png',alt:'原点の両側に2.3と−5の点が配置された元の数直線。距離の解答はまだ書かれていない。',caption:'点の位置を見て、原点までの距離を考えよう。',overlays:[]}],
    readingFlow:content.readingFlow,items:content.items}],
}
export const mathNumbersN08Unit=validateTextbookUnits([rawN08])[0]

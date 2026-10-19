import { validateTextbookUnits } from '../../../../domain/textbookSchema'
import { oneToOneSourceMap } from './reviewLessonHelpers'
import { makeReviewSteps } from './newBatchGuidedSteps'

export const n11SourceToItemIds = oneToOneSourceMap('N11', 14)
const content = makeReviewSteps('n11', [
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
      {q:5,lead:'3x−2<5の定数−2を消すには、両辺に2を足す。',expr:'3x-2<5',prompt:'一段目の変形結果を選ぼう。',answer:'3x<7',wrong:['3x<3','3x>7','x<7'],hint:'左右の両方に同じ2を足す。',after:'ここでは正負の倍率を使っていないので、不等号の向きは同じ。'},
      {q:6,lead:'xの前にある正の3で両辺を割る。',expr:'3x<7',prompt:'すべての解を表す範囲を選ぼう。',answer:'x<\\frac73',wrong:['x>\\frac73','x<\\frac37','x\\le\\frac73'],hint:'正の3で割るので向きはそのまま。等号が付いていたかも確認する。',after:'解は「7/3より小さい実数すべて」であり、ひとつの値ではない。'},
      {q:7,lead:'境界x=7/3を元の不等式に代入すると、左右は同じ値になる。',expr:'3\\left(\\frac73\\right)-2<5',prompt:'境界の値が含まれるかを選ぼう。',kind:'text',answer:'含まれない（等号となり<を満たさない）',wrong:['含まれる（左右が等しくなるから）','含まれる（3は正だから）','判断できない（分数だから）'],hint:'元の記号は「<」で、等号は許されていない。',after:'厳密不等号の境界は数直線では白丸で表す。'},
      {q:8,lead:'−2x+3≤5から定数3を除くため、左右に−3を足す。',expr:'-2x+3\\le5',prompt:'一段目の変形を選ぼう。',answer:'-2x\\le2',wrong:['-2x\\le8','-2x\\ge2','2x\\le2'],hint:'同じ数を加減した段階では不等号の向きは変わらない。',after:'次は負の数で割るので、先ほどとは向きの扱いが異なる。'},
      {q:9,lead:'−2x≤2を−2で割る。負の倍率のときは不等号を逆にしなければならない。',expr:'-2x\\le2',prompt:'xについて解いた範囲を選ぼう。',answer:'x\\ge-1',wrong:['x\\le-1','x\\ge1','x>-1'],hint:'−2で割ると向きが逆になり、右辺は−1になる。',after:'負数除算は符号だけでなく、不等号の向きもセットで扱う。'},
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
      {q:13,lead:'(x−2)/3≤2x+1の分母3は正。まず左右に3を掛ける。',expr:'\\frac{x-2}{3}\\le2x+1',prompt:'分母を払った直後の不等式を選ぼう。',answer:'x-2\\le6x+3',wrong:['x-2\\ge6x+3','x-2\\le2x+3','x-2\\le6x+1'],hint:'右辺の2xと1の両方に3を掛ける。',after:'分母を払った後は通常の一次不等式として移項できる。'},
      {q:14,lead:'x−2≤6x+3のxを右に集め、定数を左に集める。',expr:'x-2\\le6x+3',prompt:'最終的な解の範囲を選ぼう。',answer:'x\\ge-1',wrong:['x\\le-1','x\\ge1','x>-1'],hint:'−5≤5xとなり、正の5で割る。',after:'括弧や分数の有無に関係なく、各変形で同じ条件を保てているか確かめる。'},
    ],
  },
], [
  {id:'n11-f01',q:1,when:'before'},
  {id:'n11-f02',q:10,when:'after'},
])
const rawN11={
  schemaVersion:'1.1' as const,unitId:'math-numbers-expressions-n11',revision:1,status:'review' as const,subject:'math-1a' as const,
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

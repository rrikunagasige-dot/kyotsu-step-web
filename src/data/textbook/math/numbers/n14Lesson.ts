import { validateTextbookUnits } from '../../../../domain/textbookSchema'
import { oneToOneSourceMap } from './reviewLessonHelpers'
import { makeReviewSteps } from './newBatchGuidedSteps'

export const n14SourceToItemIds = oneToOneSourceMap('N14', 16)
const content = makeReviewSteps('n14', [
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
      {q:9,lead:'|x−3|<5を解く。中身x−3全体をXと見て、一般化した内側の規則を使う。',expr:'|x-3|<5',prompt:'最初に得られる二重不等式を選ぼう。',answer:'-5<x-3<5',wrong:['x-3<-5\\;\\text{または}\\;x-3>5','-5\\le x-3\\le5','-5<x<5'],hint:'まだ3を移動せず、中身x−3のまま−5と5の間に挟む。',after:'次は三辺に同じ3を足して、中央をxにする。'},
      {q:10,lead:'−5<x−3<5の中央をxだけにするには、三辺にどの操作を行えばよいだろう。',expr:'-5<x-3<5',prompt:'操作と変形結果を組にして選ぼう。',answer:'\\text{三辺に}3\\text{を足す},\\quad-2<x<8',wrong:['\\text{三辺から}3\\text{を引く},\\quad-8<x<2','\\text{三辺に}3\\text{を足す},\\quad-2\\le x\\le8','\\text{三辺に}3\\text{を足す},\\quad-5<x<8'],hint:'左端は−5+3、右端は5+3。両端の記号は変わらない。',after:'二重不等式では一部だけ移項すると同値な条件にならない。'},
      {q:11,lead:'|x+3|≥2の絶対値を外す。中身x+3を一つの数Xと考え、距離の下限が表す領域と等号の扱いを判断しよう。',expr:'|x+3|\\ge2',prompt:'内外と端点を判断し、絶対値を外した二条件を選ぼう。',answer:'x+3\\le-2\\;\\text{または}\\;x+3\\ge2',wrong:['-2\\le x+3\\le2','x+3<-2\\;\\text{または}\\;x+3>2','x+3\\le-2\\;\\text{かつ}\\;x+3\\ge2'],hint:'≥という距離の下限を、x+3が取りうる位置として数直線で想像しよう。端点を含むかも考える。',after:'外側で端点を含むため、x+3≤−2またはx+3≥2。続いて各枝をxについて解く。'},
      {q:12,lead:'二つの不等式x+3≤−2またはx+3≥2を別々に解く。',expr:'|x+3|\\ge2',prompt:'最終的な二領域を選ぼう。',answer:'x\\le-5\\;\\text{または}\\;x\\ge-1',wrong:['-5\\le x\\le-1','x<-5\\;\\text{または}\\;x>-1','x\\le-1\\;\\text{または}\\;x\\ge5'],hint:'両方の枝から同じ3を引くが、枝どうしは結合しない。',after:'距離の下限は区間の外側という意味が最後まで保たれている。'},
      {q:13,lead:'|3x−2|≤4では等号を含む距離の上限。内側の二重不等式を作る。',expr:'|3x-2|\\le4',prompt:'絶対値を外した条件を選ぼう。',answer:'-4\\le3x-2\\le4',wrong:['3x-2\\le-4\\;\\text{または}\\;3x-2\\ge4','-4<3x-2<4','-4\\le3x\\le4'],hint:'≤では内側の両端も残し、中身全体を挟む。',after:'まず定数−2を消す操作を三辺すべてに行う。'},
      {q:14,lead:'−4≤3x−2≤4の定数を消す、三辺共通の操作を考えよう。',expr:'-4\\le3x-2\\le4',prompt:'操作と変形結果を組にして選ぼう。',answer:'\\text{三辺に}2\\text{を足す},\\quad-2\\le3x\\le6',wrong:['\\text{三辺から}2\\text{を引く},\\quad-6\\le3x\\le2','\\text{三辺に}2\\text{を足す},\\quad-2<3x<6','\\text{三辺に}2\\text{を足す},\\quad-2\\le3x\\le4'],hint:'左端−4+2、右端4+2をどちらも計算する。',after:'正の3で三辺を割っても不等号の向きは変わらない。'},
      {q:15,lead:'−2≤3x≤6の中央の係数を1にする操作と、得られる範囲を考えよう。',expr:'-2\\le3x\\le6',prompt:'操作と変形結果を組にして選ぼう。',answer:'\\text{三辺を正の}3\\text{で割る},\\quad-\\frac23\\le x\\le2',wrong:['\\text{三辺を正の}3\\text{で割る},\\quad-\\frac23<x<2','\\text{三辺を正の}3\\text{で割る},\\quad-2\\le x\\le6','\\text{三辺を負の}3\\text{で割る},\\quad-\\frac23\\le x\\le2'],hint:'両端を3で割る。等号の有無は変えない。',after:'最後に両端を元の|3x−2|へ戻して、本当に等号が成立するか検査する。'},
      {q:16,lead:'左端x=−2/3と右端x=2をそれぞれ3x−2へ代入し、絶対値が4になるか確かめる。',expr:'|3x-2|\\quad\\left(x=-\\frac23,\\;2\\right)',prompt:'両端の代入結果を選ぼう。',answer:'|-4|=4,\\quad|4|=4',wrong:['|-4|=-4,\\quad|4|=4','|-2|=2,\\quad|4|=4','|-4|=4,\\quad|2|=2'],hint:'x=−2/3では3x−2=−4、x=2では3x−2=4。距離はいずれも非負。',after:'両端とも元の条件を等号で満たすため含める。これで絶対値不等式の範囲が完成した。'},
    ],
  },
], [{id:'n14-f01',q:6,when:'after'}])
const rawN14={
  schemaVersion:'1.1' as const,unitId:'math-numbers-expressions-n14',revision:3,status:'review' as const,subject:'math-1a' as const,
  chapter:{chapterId:'math-ch01-numbers-expressions',chapterNumber:'1',chapterTitle:'数と式',unitCode:'1NUM',orderInChapter:14,sourcePages:[35,36]},
  title:'距離の上限と下限から、残す範囲を決める',subtitle:'絶対値の内側・外側と端点を、数直線で選び分ける。',
  source:{type:'reference' as const,label:'ユーザー提供「数と式」教科書モード対話段階導入版 v2 / N14',
    rightsNote:'教師編集WordのN14原問16件、答えの後に開く元数直線1点、別冊解答未提供の独立導出、レビュー限定。'},
  objectives:['距離の上限と下限を内外の範囲へ翻訳する','等号の有無から端点の包含を判断する','二重不等式と「または」の二枝を区別して解く'],
  sections:[{id:'lesson',number:'14',title:'本文',role:'concept' as const,
    description:'範囲の意味から変形し、元の条件へ戻して検算する。',
    figures:[{id:'n14-f01',src:'/assets/math/textbook/numbers/n14-f01.png',alt:'距離が3より小さい範囲と4以上の範囲を上下で比較した、解答後確認用の元図。',caption:'二つの範囲を導いた後で、内側と外側を図で比較する。',overlays:[]}],
    readingFlow:content.readingFlow,items:content.items}],
}
export const mathNumbersN14Unit=validateTextbookUnits([rawN14])[0]

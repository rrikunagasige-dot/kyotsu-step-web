import { teachFirstSection } from './firstSectionTeaching'
import { repairFirstTheme } from './firstThemeRepair'
import { validateTextbookUnits } from '../../../../domain/textbookSchema'
import { oneToOneSourceMap } from './reviewLessonHelpers'
import { makeReviewSteps } from './newBatchGuidedSteps'

// Original teacher-edited Word N05 Q01–Q20, independent solutions, review only.
export const n05SourceToItemIds = oneToOneSourceMap('N05', 20)
const content = makeReviewSteps('n05', [
  {
    title:'共通する因数を外へ出す',
    intro:'展開は積を和へ直す操作だった。ここでは和から共通する掛け算を探し、逆向きに積へ戻す。最初に式全体を展開する必要はない。',
    steps:[
      {q:1,lead:'二つの項 x(y+5) と −3(y+5) に共通して掛かっている括弧を探す。',expr:'x(y+5)-3(y+5)',prompt:'共通因数となる括弧を選ぼう。',answer:'y+5',wrong:['x-3','xy+5','y-5'],hint:'xと−3のどちらにも掛かっている部分を残す。',after:'括弧全体をTとすれば、式はxT−3Tという単純な形で見られる。'},
      {q:2,lead:'共通因数をTと仮置きする。係数xと−3を一つの括弧へまとめ、最後にTを元へ戻す。',expr:'xT-3T,\\quad T=y+5',prompt:'積に戻した式を選ぼう。',answer:'(x-3)(y+5)',wrong:['(x+3)(y+5)','(x-3)(y-5)','x-3(y+5)'],hint:'Tは一度だけ外へ出し、残る係数をx−3にする。',after:'このように多項式を積の形に直すことを因数分解といい、掛け合わせる各式を因数という。'},
      {q:3,lead:'因数分解が正しいかどうかは逆の展開で確かめられる。四組の積へ戻そう。',expr:'(x-3)(y+5)',prompt:'展開して元の式と一致する形を選ぼう。',answer:'xy+5x-3y-15',wrong:['xy+5x+3y-15','xy+5x-3y+15','xy+5x-3y'],hint:'−3をyと5の両方に掛ける。',after:'積から和へ戻して同じ式になることが、因数分解の検算になる。'},
      {q:4,lead:'次の二つの括弧は、引き算の順序が逆になっている。',expr:'a-b,\\quad b-a',prompt:'b−aをa−bの何倍と見ればよいか。',answer:'-(a-b)',wrong:['a-b','a+b','-a-b'],hint:'括弧の前に−1を掛けると中の符号が入れ替わる。',after:'引き算の順を反対にすると、式全体にマイナスが掛かる。'},
      {q:5,lead:'先ほどの符号反転を使って二項の共通因数を揃える。',expr:'(a-b)x+(b-a)y',prompt:'一つの積にまとめよう。',answer:'(a-b)(x-y)',wrong:['(a-b)(x+y)','(a+b)(x-y)','(a-b)(y-x)'],hint:'二項目は−(a−b)yと書き直せる。',after:'見た目の異なる括弧でも、符号を揃えれば同じ因数を見つけられる。'},
    ],
  },
  {
    title:'平方の公式を逆向きに読む',
    intro:'積の候補を見つけたら、両端の平方だけで決めない。中央の項まで展開と照らす。',
    steps:[
      {q:6,lead:'16x²+24xy+9y²の両端は、何を二乗したものだろう。',expr:'16x^2+24xy+9y^2',prompt:'最初と最後の項をそれぞれ平方として表そう。',answer:'(4x)^2,\\quad(3y)^2',wrong:['(8x)^2,\\quad(3y)^2','(4x)^2,\\quad(9y)^2','(4x)^2,\\quad(-3y)'],hint:'両端の係数と文字の指数を別々に見て、それぞれ何を二乗すると元の項に戻るか確かめよう。',after:'二つの平方が見つかっても、中央の項が合うまではまだ候補である。'},
      {q:7,lead:'平方の候補を(4x+3y)²とする。中央に現れる二組の交差積はいくらになるか。',expr:'(4x+3y)^2',prompt:'中央の項を計算しよう。',answer:'24xy',wrong:['12xy','7xy','24x^2y^2'],hint:'4xと3yの積12xyは二組ある。',after:'中央の項24xyが、元の式の係数と符号に一致する。'},
      {q:8,lead:'両端の平方と中央の項がすべて一致した。和の平方に戻そう。',expr:'16x^2+24xy+9y^2',prompt:'因数分解を完成させよう。',answer:'(4x+3y)^2',wrong:['(4x-3y)^2','(4x+3y)(4x-3y)','(16x+9y)^2'],hint:'中央が正なので同じ和の括弧を二つ使う。',after:'中央の符号まで含めて照合することが、公式の逆利用では欠かせない。'},
      {q:9,lead:'平方にならない二次式は、(a+r)(a+s)という二つの一次式へ戻す。まず一般に展開してみよう。',expr:'(a+r)(a+s)',prompt:'次数ごとに整理した形を選ぼう。',answer:'a^2+(r+s)a+rs',wrong:['a^2+rsa+(r+s)','a^2+(r-s)a+rs','a^2+(r+s)a+r+s'],hint:'一次項はarとas、定数項はrs。',after:'一次の係数は二数の和、定数項は二数の積に対応する。'},
      {q:10,lead:'もとの二次式a²−6a−16と、いまの一般展開の係数を比較する。',expr:'a^2-6a-16',prompt:'r+sとrsが満たす条件を選ぼう。',answer:'r+s=-6,\\quad rs=-16',wrong:['r+s=-16,\\quad rs=-6','r+s=6,\\quad rs=-16','r+s=-6,\\quad rs=16'],hint:'aの係数が和、定数項が積である。',after:'積が負なので符号の異なる二数を探し、その中から和を一致させる。'},
      {q:11,lead:'積が−16、和が−6となる二つの整数を探す。',expr:'a^2-6a-16',prompt:'整数の組と完成した因数分解を選ぼう。',answer:'(a-8)(a+2)',wrong:['(a-4)(a+4)','(a-2)(a+8)','(a-8)(a-2)'],hint:'積が負なので二数の符号は異なる。和が負になるには、絶対値の大きい方が負になる。積が−16、和が−6の両方に合うか確かめよう。',after:'(a−8)(a+2)を展開するとa²−6a−16に戻る。'},
    ],
  },
  {
    title:'交差する係数を照合する',
    intro:'二次の係数が1でないときも、四組の積に戻る。左右の係数の斜めの積が一次項になる仕組みを使う。',
    steps:[
      {q:12,lead:'(px+q)(rx+s)では、最初どうし・交差どうし・最後どうしを掛ける。',expr:'(px+q)(rx+s)',prompt:'三つの係数が見える形へ展開しよう。',answer:'prx^2+(ps+qr)x+qs',wrong:['prx^2+(pq+rs)x+qs','prx^2+(ps-qr)x+qs','prx^2+psx+qs'],hint:'一次の積はpx×sとq×rxの二組。',after:'この交差する二つの積を足す考えが、たすき掛けの根拠になる。'},
      {q:13,lead:'4x²+7x+3になるためには、二次、一次、定数の三つの係数が一致しなければならない。',expr:'4x^2+7x+3',prompt:'p,q,r,sについて必要な三条件を選ぼう。',answer:'pr=4,\\quad ps+qr=7,\\quad qs=3',wrong:['pr=4,\\quad ps+qr=3,\\quad qs=7','pr=4,\\quad pq+rs=7,\\quad qs=3','pr=7,\\quad ps+qr=4,\\quad qs=3'],hint:'二次の積・交差項の和・最後の積を順番に比べる。',after:'両端の積だけが合っても、中央の係数が不一致なら因数分解にはならない。'},
      {q:14,lead:'原Wordの表の三候補を実際の積として並べる。Aは(2x+1)(2x+3)、Bは(x+1)(4x+3)、Cは(x+3)(4x+1)。原図の交差積をそれぞれ足そう。',exprLines:['\\text{候補 A: }(2x+1)(2x+3)','\\text{候補 B: }(x+1)(4x+3)','\\text{候補 C: }(x+3)(4x+1)'],prompt:'A、B、Cの一次係数をこの順に選ぼう。',answer:'8,\\quad 7,\\quad 13',wrong:['7,\\quad8,\\quad13','8,\\quad13,\\quad7','8,\\quad7,\\quad12'],hint:'図の左右の組を縦ではなく斜めに掛け、それぞれ足す。',after:'狙う一次係数は7なので、これに一致する候補だけが残る。'},
      {q:15,lead:'三条件を満たす候補を選び、実際の一次式の積へ戻す。',expr:'4x^2+7x+3',prompt:'原図の候補と因数分解の組を選ぼう。',answer:'(x+1)(4x+3)',wrong:['(x+3)(4x+1)','(2x+1)(2x+3)','(x-1)(4x-3)'],hint:'x×3と1×4xの和は7x。',after:'ここまで確かめた後で、完成形の原図を開いて斜めの積を逆展開で照合する。'},
    ],
  },
  {
    title:'条件を自分で立てて因数分解する',
    intro:'最後は候補が与えられなくても、先ほどの「和と積の両方を照合する」考えを使ってみよう。',
    marker:'check',
    steps:[
      {q:16,lead:'5x²−2x−3を(x+r)(5x+s)へ戻す。r,sはこれから決める数である。',expr:'(x+r)(5x+s)',prompt:'一次係数と定数項から二条件を選ぼう。',answer:'s+5r=-2,\\quad rs=-3',wrong:['s+5r=-3,\\quad rs=-2','s+r=-2,\\quad rs=-3','s-5r=-2,\\quad rs=3'],hint:'展開した一次項はsx+5rx、定数はrs。',after:'二数の積が負であることから、符号の組を絞れる。'},
      {q:17,lead:'直前に得た積の条件rs=−3から、二数の符号を判定しよう。判断には条件そのものを根拠として使う。',expr:'rs=-3',prompt:'rとsの符号関係と、その理由を組にして選ぼう。',kind:'text',answer:'rとsは異符号（rs=-3<0だから）',wrong:['rとsは同符号（rs=-3<0だから）','rとsは異符号（r+s=-2だから）','rとsはともに負（rs=-3だから）'],hint:'積の正負と、二数の符号の組合せを対応させよう。和の条件だけでは理由にならない。',after:'rs=−3<0なのでrとsは異符号。どちらが正かは和の条件も使って決める。'},
      {q:18,lead:'符号の異なる因子のうち、s+5r=−2も満たす組を探す。',expr:'5x^2-2x-3',prompt:'両条件に一致する因数分解を選ぼう。',answer:'(x-1)(5x+3)',wrong:['(x+1)(5x-3)','(x-3)(5x+1)','(x-1)(5x-3)'],hint:'例えば r=1、s=−3 なら、積は−3でも s+5r=2 となり、−2には一致しない。候補は積だけでなく、一次の係数も計算して選ぼう。',after:'積と一次係数の両方を満たすか、最後に逆展開して確かめる。'},
      {q:19,lead:'3a²b−12b³では、すべての項に共通する係数と文字を最初に外へ出す。',expr:'3a^2b-12b^3',prompt:'共通因数でくくった最初の形を選ぼう。',answer:'3b(a^2-4b^2)',wrong:['3(a^2-4b^2)','3b(a^2-4b)','3b(a^2+4b^2)'],hint:'3とbが両項に掛かる。−12b³÷3bを計算する。',after:'括弧内にまだ二つの平方の差が残っている。'},
      {q:20,lead:'共通因数を残したまま、a²−(2b)²を和と差の積へ変える。',expr:'3b(a^2-4b^2)',prompt:'できるところまで因数分解しよう。',answer:'3b(a-2b)(a+2b)',wrong:['3b(a-4b)(a+4b)','3b(a-2b)^2','3b(a^2-2b)(a+2b)'],hint:'4b²=(2b)²。平方差A²−B²の公式を使う。',after:'共通因数を外に出す→括弧内の形を見る→さらに因数分解する、という順序が有効である。'},
    ],
  },
], [
  {id:'n05-f01',q:14,when:'before'},
  {id:'n05-f02',q:15,when:'after'},
])
const rawN05 = {
  schemaVersion:'1.1' as const, unitId:'math-numbers-expressions-n05', revision:2,
  status:'review' as const, subject:'math-1a' as const,
  chapter:{chapterId:'math-ch01-numbers-expressions',chapterNumber:'1',chapterTitle:'数と式',unitCode:'1NUM',orderInChapter:5,sourcePages:[11,12,13,14]},
  title:'展開を逆にたどり、積の形を見つける',
  subtitle:'共通因数から平方の公式、たすき掛けまで、元の展開を確かめる。',
  source:{type:'reference' as const,label:'ユーザー提供「数と式」教科書モード対話段階導入版 v2 / N05',
    rightsNote:'教師編集原WordのN05原問20件と元画像2点を保持。別冊解答未提供・独立導出、レビュー限定。'},
  objectives:['分配法則の逆向きに共通因数を探す','中央の項まで照合して因数分解を確認する','たすき掛けの係数の由来を四組の積から理解する'],
  sections:[{id:'lesson',number:'05',title:'本文',role:'concept' as const,
    description:'和から積へ戻るとき、各係数の一致を確かめる。',
    figures:[
      {id:'n05-f01',src:'/assets/math/textbook/numbers/n05-f01.png',alt:'係数p、q、r、sを斜めの矢印で結び、交差積を考える元の一般たすき掛け図。',caption:'斜めに掛けた積の和を、候補ごとに確かめよう。',overlays:[]},
      {id:'n05-f02',src:'/assets/math/textbook/numbers/n05-f02.png',alt:'正しい組を選んだ後に確認する、原Wordの完成たすき掛け図。',caption:'ここまでの判断を完成図で検算する。',overlays:[]},
    ], readingFlow:content.readingFlow,items:content.items}],
}
export const mathNumbersN05R3Unit = validateTextbookUnits([repairFirstTheme(validateTextbookUnits([rawN05])[0])])[0]

export const mathNumbersN05Unit = validateTextbookUnits([teachFirstSection(mathNumbersN05R3Unit)])[0]

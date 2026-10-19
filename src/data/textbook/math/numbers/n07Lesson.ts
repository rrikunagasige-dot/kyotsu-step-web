import { validateTextbookUnits } from '../../../../domain/textbookSchema'
import { oneToOneSourceMap } from './reviewLessonHelpers'
import { makeReviewSteps } from './newBatchGuidedSteps'

// N07 original source markers Q01–Q14, teacher-edited Word pp.17–19.
export const n07SourceToItemIds = oneToOneSourceMap('N07', 14)
const content = makeReviewSteps('n07', [
  {
    title:'割り算の余りから小数の続き方を見る',
    intro:'分数は割り算で小数にできる。数字だけを記録するのではなく、次の位に送る余りを追うと、割り算が終わるかどうかが分かる。',
    steps:[
      {q:1,lead:'3を4で割ると、10分の位と100分の位の商を決められる。',expr:'\\frac34',prompt:'小数と、割り算が終わる位を選ぼう。',kind:'text',answer:'0.75（小数第2位で終了）',wrong:['0.7（小数第1位で終了）','0.75（無限に循環）','0.075（小数第3位で終了）'],hint:'3.00を4で割って余りが0になるかを見る。',after:'小数の途中で余りが0になり、そこで終わるものを有限小数という。'},
      {q:2,lead:'23÷11の整数部分は2、余りは1。次に1を10倍して割り、また余りを10倍して割る。',expr:'23\\div11',prompt:'二つの小数の位の「商・余り」を順に選ぼう。',kind:'text',answer:'（0・余り10）→（9・余り1）',wrong:['（9・余り1）→（0・余り10）','（0・余り1）→（9・余り10）','（0・余り10）→（0・余り10）'],hint:'10÷11の商と余り、続く100÷11の商と余りを計算する。',after:'余りが最初の1へ戻った。同じ余りからは同じ筆算が始まる。'},
      {q:3,lead:'余りの並びが繰り返されるので、小数の数字にも同じ並びが現れる。',expr:'\\frac{23}{11}',prompt:'繰り返し部分を含む小数表示を選ぼう。',answer:'2.\\overline{09}',wrong:['2.\\overline9','2.09','2.\\overline{90}'],hint:'整数部分2の後の「0、9」が繰り返す。',after:'小数が途中で終わらず、同じ数字の列を繰り返すものを循環小数という。'},
      {q:4,lead:'3/4の小数と23/11の小数を比べる。どちらも分数で表せることに注目する。',expr:'0.75,\\quad2.\\overline{09}',prompt:'二数の小数分類と有理数かどうかを選ぼう。',kind:'text',answer:'有限小数／循環小数、どちらも有理数',wrong:['有限小数／循環小数、後者は無理数','どちらも有限小数、どちらも有理数','どちらも循環小数、後者は無理数'],hint:'整数の比で表せる数は有理数で、小数が続くかどうかとは別。',after:'有理数は、整数m,nを用いてm/n（n≠0）と表せる数である。'},
      {q:5,lead:'分母nで割るとき、余りは0からn−1までしかない。余り0にならず無限に割り続けたら、何が必ず起こるだろう。',prompt:'余りが繰り返す理由を選ぼう。',kind:'text',answer:'0以外の余りは有限種類なので同じ余りが再び現れる',wrong:['商の数字は必ず0か1だけになる','余りはいつまでも違う数へ増え続ける','余りが0でなければ分数は無理数になる'],hint:'0以外の余りにはn−1種類しかない。計算は何度でも続く。',after:'同じ余りへ戻れば、その後の商の列も繰り返す。余り0なら有限小数、そうでなければ循環小数になる。'},
    ],
  },
  {
    title:'繰り返す小数部分をそろえて消す',
    intro:'循環小数も分数で表せる。その数を一つの文字とし、同じ小数部分を持つ二式を引き算する。',
    steps:[
      {q:6,lead:'x=0.8888…と置く。10、100、1000倍した小数を比べ、繰り返す小数部分が元のxとそろう最小の倍率を探そう。',expr:'x=0.\\overline8',prompt:'繰り返す部分がそろう最小の倍率と、掛けた後の小数を選ぼう。',answer:'10\\text{倍},\\quad10x=8.\\overline8',wrong:['100\\text{倍},\\quad100x=88.\\overline8','10\\text{倍},\\quad10x=0.\\overline8','10\\text{倍},\\quad10x=8.8'],hint:'小数点を何桁ずらすと、元のxと同じ繰り返し部分になる？最も小さい倍率を選ぶ。',after:'一桁周期なので最小倍率は10。10x=8.888…とx=0.888…の小数部分がそろう。'},
      {q:7,lead:'10xとxは小数部分が同じ。引き算して整数だけを残す。',expr:'10x-x',prompt:'引き算から得られる等式を選ぼう。',answer:'9x=8',wrong:['9x=0.8','10x=8','9x=88'],hint:'左は10x−x、右は8.888…−0.888…である。',after:'無限に続く部分を有限の等式へ変換できた。'},
      {q:8,lead:'9x=8をxについて解く。',expr:'9x=8',prompt:'もとの循環小数を分数で表そう。',answer:'x=\\frac89',wrong:['x=\\frac9{8}','x=\\frac8{10}','x=\\frac{88}{9}'],hint:'xの係数9で両辺を割る。',after:'循環していても、整数どうしの比で表せれば有理数である。'},
      {q:9,lead:'次はx=0.696969…と置く。繰り返す部分が二桁なので、小数点を二桁ずらす。',expr:'x=0.\\overline{69}',prompt:'100倍した式と引き算からの等式を選ぼう。',answer:'100x=69.\\overline{69},\\quad99x=69',wrong:['10x=6.\\overline{69},\\quad9x=6','100x=69.\\overline{69},\\quad100x=69','100x=69,\\quad99x=69'],hint:'100xとxの小数部分を揃え、左辺は100x−xにする。',after:'循環する二桁を扱うには、10ではなく100倍する必要がある。'},
      {q:10,lead:'99x=69から分数に直し、分子と分母の共通因数で約分する。',expr:'x=\\frac{69}{99}',prompt:'既約分数で答えよう。',answer:'\\frac{23}{33}',wrong:['\\frac{69}{100}','\\frac{23}{99}','\\frac{33}{23}'],hint:'69と99は両方3で割れる。',after:'小数が無限に続いても、分数で表せることを自分の計算で確かめた。'},
    ],
  },
  {
    title:'有限小数の分母と実数の分類',
    intro:'一つずつ筆算しなくても、分母を10の累乗にできるかどうかから有限小数の条件を考えられる。',
    marker:'check',
    steps:[
      {q:11,lead:'有限小数は整数/10^kと表せる。分母の10を素因数に分けよう。',expr:'10^k,\\quad k\\ge1',prompt:'分母の素因数分解を選ぼう。',answer:'2^k\\cdot5^k',wrong:['2^k+5^k','10k','2^{2k}\\cdot5^k'],hint:'10=2×5なので、その積をk回掛ける。',after:'約分しても2と5以外の素因数が新たに分母へ生じることはない。'},
      {q:12,lead:'2≤a≤20の整数を調べる。1/aが有限小数なのは、aの素因数が2と5だけのとき。',expr:'2\\le a\\le20',prompt:'条件を満たす整数aを漏れなく選ぼう。',answer:'2,4,5,8,10,16,20',wrong:['2,4,5,8,10,12,16,20','2,4,5,8,10,15,20','2,4,5,8,10,16'],hint:'2の累乗、5の累乗、その積を範囲内で挙げる。3が因数に混ざるものは除く。',after:'分母に3などが残る分数は、10の累乗を分母にする有限小数へは直せない。'},
      {q:13,lead:'自然数を正の整数とする。a=2,b=3の差と商を計算し、それぞれ自然数か判断する。',expr:'a-b,\\quad\\frac ab\\quad(a=2,b=3)',prompt:'二つの値と自然数かどうかを選ぼう。',kind:'text',answer:'−1と2/3、どちらも自然数でない',wrong:['1と2/3、後者だけ自然数でない','−1と2/3、両方自然数','−1と3/2、どちらも自然数でない'],hint:'2−3は負、2÷3は整数にならない。',after:'整数・有理数へ数の範囲を広げれば、差や商も扱える。実数は有理数と無理数を合わせた数の全体である。'},
      {q:14,lead:'先ほど0.696969…を整数どうしの比へ直したことを使う。',expr:'0.\\overline{69}',prompt:'この循環小数は有理数か、理由とともに選ぼう。',kind:'text',answer:'有理数（23/33と表せる）',wrong:['無理数（小数が無限に続く）','無理数（整数ではない）','有理数（小数第2位で終わる）'],hint:'循環小数を具体的に分数に直した計算を思い出す。',after:'無限小数の中にも有理数がある。有理数ではない実数を無理数という。次は数を位置と距離で捉える。'},
    ],
  },
])
const rawN07={
  schemaVersion:'1.1' as const,unitId:'math-numbers-expressions-n07',revision:2,status:'review' as const,subject:'math-1a' as const,
  chapter:{chapterId:'math-ch01-numbers-expressions',chapterNumber:'1',chapterTitle:'数と式',unitCode:'1NUM',orderInChapter:7,sourcePages:[17,18,19]},
  title:'分数と小数で、同じ数を表す',subtitle:'余りの繰り返しを追い、有限・循環小数と有理数の関係を考える。',
  source:{type:'reference' as const,label:'ユーザー提供「数と式」教科書モード対話段階導入版 v2 / N07',
    rightsNote:'教師編集WordのN07原問14件を段階化。別冊解答未提供・独立計算、レビュー限定。'},
  objectives:['割り算の余りから小数表示を判断する','循環部分をそろえ循環小数を分数へ戻す','分母の素因数から有限小数の条件を確かめる'],
  sections:[{id:'lesson',number:'07',title:'本文',role:'concept' as const,
    description:'具体的な割り算から数の分類を作る。',figures:[],readingFlow:content.readingFlow,items:content.items}],
}
export const mathNumbersN07Unit=validateTextbookUnits([rawN07])[0]

import { validateTextbookUnits } from '../../../../domain/textbookSchema'
import { oneToOneSourceMap } from './reviewLessonHelpers'
import { makeReviewSteps } from './newBatchGuidedSteps'

// Original Word N06 Q01–Q16, no original figures. Author-independent worked answers.
export const n06SourceToItemIds = oneToOneSourceMap('N06', 16)
const content = makeReviewSteps('n06', [
  {
    title:'共通の塊を置き換える',
    intro:'見慣れない式が現れても、新しい公式を増やす必要はない。繰り返す式を一つの文字として扱い、知っている二次式へ戻す。',
    steps:[
      {q:1,lead:'二つの括弧に繰り返し現れる式のまとまりを見つけ、それをXと置いてみよう。',expr:'(x+2y+1)(x+2y-2)-4',prompt:'Xの定義と置換後の式を選ぼう。',answer:'X=x+2y,\\quad(X+1)(X-2)-4',wrong:['X=x-2y,\\quad(X+1)(X-2)-4','X=x+2y,\\quad(X+1)(X+2)-4','X=x+2y,\\quad(X+1)(X-2)+4'],hint:'二つの括弧に完全に同じ形で入っている部分だけをXにする。',after:'文字を変えただけで元の式の値は変わらない。最後にはXを戻す。'},
      {q:2,lead:'置換してできた式を通常の二次式へ展開する。',expr:'(X+1)(X-2)-4',prompt:'同類項をまとめた二次式を選ぼう。',answer:'X^2-X-6',wrong:['X^2+X-6','X^2-X+2','X^2-2X-6'],hint:'交差項−2X+Xをまとめ、定数−2−4を足す。',after:'これは二次式の因数分解の問題へ戻った。'},
      {q:3,lead:'和が−1、積が−6になる二つの整数を探す。',expr:'X^2-X-6',prompt:'Xを使う因数分解を完成させよう。',answer:'(X-3)(X+2)',wrong:['(X+3)(X-2)','(X-6)(X+1)','(X-3)(X-2)'],hint:'−3と2の和・積をそれぞれ計算する。',after:'Xのままでは元のx,yの問題の解答になっていない。'},
      {q:4,lead:'置換の定義X=x+2yを両方の因数へ戻そう。',expr:'(X-3)(X+2)',prompt:'元の文字だけで積を書こう。',answer:'(x+2y-3)(x+2y+2)',wrong:['(x+2y-3)(X+2)','(x+2y+3)(x+2y-2)','(x-2y-3)(x-2y+2)'],hint:'Xをどちらの括弧からもなくす。',after:'置換は途中の計算を短くするための仮の名前である。'},
    ],
  },
  {
    title:'偶数次の式を二次式に変える',
    intro:'四次式でも、繰り返し現れる式のまとまりを見つければ、二次式として扱える場合がある。',
    steps:[
      {q:5,lead:'四次式を見て、一文字に置き換えると二次式として扱える部分を探そう。',expr:'x^4-5x^2+4',prompt:'置換の定義とTの二次式を選ぼう。',answer:'T=x^2,\\quad T^2-5T+4',wrong:['T=x,\\quad T^2-5T+4','T=x^2,\\quad T^4-5T+4','T=x^2,\\quad T^2+5T+4'],hint:'x⁴の指数はTを用いたとき2になる。',after:'二次式になれば和−5・積4を使える。'},
      {q:6,lead:'T²−5T+4を積に直し、元のx²へ戻す。',expr:'T^2-5T+4',prompt:'xの式として戻した積を選ぼう。',answer:'(x^2-1)(x^2-4)',wrong:['(x^2+1)(x^2+4)','(x^2-2)(x^2-2)','(x^2-1)(x^2+4)'],hint:'T−1とT−4に分けてからTをx²へ戻す。',after:'二つの因子はどちらも平方の差なので、さらに分解できる。'},
      {q:7,lead:'x²−1とx²−4をそれぞれ平方の差と見て、積を最後まで細かくする。',expr:'(x^2-1)(x^2-4)',prompt:'一次式の積まで因数分解しよう。',answer:'(x-1)(x+1)(x-2)(x+2)',wrong:['(x-1)^2(x-2)^2','(x-1)(x+1)(x^2-4)','(x+1)(x+2)(x^2-2)'],hint:'x²−a²=(x−a)(x+a)を両方の因子に使う。',after:'置換を戻して終わりとは限らない。残る各因子も確認する。'},
    ],
  },
  {
    title:'整理に使う文字を選び直す',
    intro:'xとyが混ざるときは、低い次数でまとめられる文字に注目すると共通の括弧が浮かび上がる。',
    steps:[
      {q:8,lead:'x³+x²y+x²+xy−2x−2yを、一つの文字について整理したい。xとyそれぞれを変数と見たときの最高次数を調べよう。',expr:'x^3+x^2y+x^2+xy-2x-2y',prompt:'xとyそれぞれの次数を比べ、低い次数で整理できる文字を選ぼう。',kind:'text',answer:'xについて3次、yについて1次。yで整理',wrong:['xについて3次、yについて1次。xで整理','xについて1次、yについて3次。yで整理','xについて2次、yについて2次。どちらでも同じ'],hint:'最高次数を文字ごとに数える。x³はxについて何次？yを含む項のyの指数は？',after:'xについては3次、yについては1次。yで整理すると二つの部分に分けられる。'},
      {q:9,lead:'yの付く項をすべて集め、その残りと分けよう。',expr:'x^3+x^2y+x^2+xy-2x-2y',prompt:'yをくくった形を選ぼう。',answer:'y(x^2+x-2)+(x^3+x^2-2x)',wrong:['y(x^2+x-2)+(x^3+x^2)','y(x^2+x+2)+(x^3+x^2-2x)','y(x^2+x-2)+(x^3-x^2-2x)'],hint:'yを含むのはx²y、xy、−2yの三項。',after:'残りの部分にも、よく似たxの二次式が隠れている。'},
      {q:10,lead:'yを含まない後半の三項は、全部にxが掛かっている。',expr:'x^3+x^2-2x',prompt:'この部分だけを共通因数でくくろう。',answer:'x(x^2+x-2)',wrong:['x(x^2+x+2)','x^2(x+1-2x)','x(x^2-x-2)'],hint:'どの項にもxを一回ずつくくり出せる。',after:'前半と後半に同じ(x²+x−2)が現れる。'},
      {q:11,lead:'整理した二つの項を見比べ、どの括弧が共通しているかを探そう。残る係数も確かめて、一つの積にまとめよう。',expr:'y(x^2+x-2)+x(x^2+x-2)',prompt:'共通の括弧を一度だけ外へ出そう。',answer:'(x+y)(x^2+x-2)',wrong:['(x-y)(x^2+x-2)','(x+y)(x^2-x-2)','xy(x^2+x-2)'],hint:'二つの係数はyとx。その和が括弧の外に残る。',after:'多変数の式でも一文字について整理することで、共通因数が見つかる。'},
      {q:12,lead:'残ったx²+x−2では、和が1・積が−2の二数を探す。',expr:'(x+y)(x^2+x-2)',prompt:'因数分解を最後まで完成させよう。',answer:'(x+y)(x+2)(x-1)',wrong:['(x+y)(x-2)(x+1)','(x-y)(x+2)(x-1)','(x+y)(x+1)(x-2)'],hint:'2と−1なら和は1、積は−2。',after:'最後に逆展開すれば、元のx³から−2yまで全項が戻る。'},
    ],
  },
  {
    title:'係数も文字式として読む',
    intro:'xについての二次式と見れば、yを含む係数も「一つの数」と同じように扱える。',
    marker:'check',
    steps:[
      {q:13,lead:'x²+3xy+2y²−x−3y−2を、xの二次・一次・定数の順に並べる。',expr:'x^2+3xy+2y^2-x-3y-2',prompt:'xについて整理した形を選ぼう。',answer:'x^2+(3y-1)x+(2y^2-3y-2)',wrong:['x^2+(3y+1)x+(2y^2-3y-2)','x^2+(3y-1)x+(2y^2+3y-2)','x^2+(3y-1)+(2y^2-3y-2)x'],hint:'3xy−xからxを外へ出し、残りはxを含まない項。',after:'xの係数3y−1と定数項2y²−3y−2を区別できた。'},
      {q:14,lead:'xに依存しない部分2y²−3y−2を、二つの一次式の積へ分ける。',expr:'2y^2-3y-2',prompt:'定数項の因数分解を選ぼう。',answer:'(2y+1)(y-2)',wrong:['(2y-1)(y+2)','(2y+1)(y+2)','(y-1)(2y+2)'],hint:'先頭は2y²、最後は−2。交差積を合わせる。',after:'二つの因子の組は、xの一次係数との一致も検査する。'},
      {q:15,lead:'(2y+1)と(y−2)を二つの一次式の定数項と見たとき、展開後のxの係数は何になるだろう。',expr:'(2y+1)+(y-2)',prompt:'和を計算し、元のxの係数に一致して因数分解に使えるか判断しよう。',answer:'3y-1,\\quad\\text{一致する（使える）}',wrong:['3y+3,\\quad\\text{一致する（使える）}','3y-1,\\quad\\text{一致しない（使えない）}','2y^2-3y-2,\\quad\\text{一致しない（使えない）}'],hint:'文字の項2yとy、定数1と−2を別々に足す。',after:'和も積も一致したので、xについての二つの一次式へ戻せる。'},
      {q:16,lead:'x²+(3y−1)x+(2y+1)(y−2)を、xに関する二つの一次式へまとめる。',expr:'x^2+(3y-1)x+(2y^2-3y-2)',prompt:'xとyを含む因数分解の完成形を選ぼう。',answer:'(x+2y+1)(x+y-2)',wrong:['(x+2y-1)(x+y+2)','(x+2y+1)(x+y+2)','(x+2y-2)(x+y+1)'],hint:'二つの定数項は2y+1とy−2で、足すと3y−1。',after:'係数が数でも文字式でも、先頭・中央・定数のすべてを逆展開で照合する。'},
    ],
  },
])
const rawN06 = {
  schemaVersion:'1.1' as const,unitId:'math-numbers-expressions-n06',revision:3,status:'review' as const,subject:'math-1a' as const,
  chapter:{chapterId:'math-ch01-numbers-expressions',chapterNumber:'1',chapterTitle:'数と式',unitCode:'1NUM',orderInChapter:6,sourcePages:[15,16]},
  title:'複雑な式を、既に知っている形へ戻す',subtitle:'式の塊を一文字と見て、因数分解の道筋を選ぶ。',
  source:{type:'reference' as const,label:'ユーザー提供「数と式」教科書モード対話段階導入版 v2 / N06',
    rightsNote:'教師編集原WordのN06原問16件に対応。公式解答別冊は未提供、答えは独立に導出したレビュー教材。'},
  objectives:['共通する式の塊を置換する','変形後の式を因数分解して元の文字に戻す','低い次数の文字を選んで共通因数を見つける'],
  sections:[{id:'lesson',number:'06',title:'本文',role:'concept' as const,
    description:'置換・復元・文字の選択を通して因数分解する。',figures:[],
    readingFlow:content.readingFlow,items:content.items}],
}
export const mathNumbersN06Unit = validateTextbookUnits([rawN06])[0]

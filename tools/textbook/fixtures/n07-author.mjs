import { repeatCandidates } from '../planner/candidates.mjs';
import { division, finiteDenominators, fraction } from '../rules/n07.mjs';
import { invariant } from '../util.mjs';
// Authored choices/prose are explicitly reviewed AI output; only supported traces are rule-generated.
export function authorN07(source){
 invariant(source.unit==='N07'&&source.status==='PASS','located N07 source extraction required');
 invariant(source.documentHash==='93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa','source revision mismatch');
 const catalog=source.blocks.map(b=>({id:b.id,locator:b.locator,kind:b.kind,questionMarkers:b.markers,mathHashes:b.mathStructures.map(m=>m.sha256)}));
 const block=i=>'word-p-'+String(i).padStart(6,'0'),nodes=[];
 const q=n=>'N07-Q'+String(n).padStart(2,'0');
 function add(n,tag,src,{goal,before,input='',answer,wrong=[],after,output='',kind='text',classification='derivation',role='example',requires=[],teaches=[],known=[],reason,table,trace=[]}){
  const id='n07-q'+String(n).padStart(2,'0')+'-'+tag;
  const node={id,problemId:q(n),sourceRefs:src.map(block),role,goal,operation:tag,reason:reason??goal,before,after,inputLatex:input,outputLatex:output,knownRefs:known,requires,teachesBefore:teaches,teachesAfter:[],resultId:id+'-result',stageId:'n07-q'+String(n).padStart(2,'0')+'-stage',visibleBeforeResults:[],traceRefs:trace,provenance:'ai-authored',...(table?{table}:{}),...(answer!==undefined?{interaction:{id:id+'-answer',classification,prompt:goal+'。',answer,answerType:kind,choices:[answer,...wrong],distractorReasons:Object.fromEntries(wrong.map(c=>[c,'今の条件・操作対象と照合し、正答後の根拠を確認する。'])),hints:[reason??'今の小目標で使う条件と、前の結果を確認します。'],reason:reason??goal,taskContract:classification==='reason'?'reason':'exact'}}:{})};
  for(const k of known){const other=nodes.find(n=>n.resultId===k);if(other&&other.problemId!==node.problemId)node.traceRefs.push('designed-cross-problem-reuse:'+k);}
  nodes.push(node);return node.resultId;
 }
 const d34=division('3','4'),d2311=division('23','11');
 let r=add(1,'tenths',[299,300],{goal:'小数第1位の商を決める',before:'3÷4では、整数部分は0で余りは3です。小数第1位を求めるため、余りを10倍した30を4で割ります。',input:'30=4\\times\\boxed{\\phantom7}+2',answer:d34.steps[0].digit,wrong:['6','8'],kind:'formula',classification:'state-update',after:'30の中に4は7個入り、余りは2です。商の7を小数第1位に置きます。次の位では、この余り2を使います。',output:'30=4\\times7+2',trace:['long-division@1:3/4:0']});
 r=add(1,'hundredths',[300],{goal:'小数第2位を求める',before:'前の余り2を10倍し、20を4で割ります。今の商を小数第2位へ置きます。',input:'20=4\\times\\boxed{\\phantom5}+0',answer:d34.steps[1].digit,wrong:['4','2'],kind:'formula',known:[r],after:'20は4で割り切れます。これで余りが0になり、この先に求める数字はありません。',output:'\\frac34=0.75',trace:['long-division@1:3/4:1']});
 add(1,'end',[300],{goal:'割り算が止まる理由を読む',before:'得られた小数と、最後の余りを対応させます。止まる理由は、書いた小数の長さではなく余りで判断します。',answer:'小数第2位で余りが0になったから',wrong:['小数を2桁書いたら必ず止めるから','余りが同じ値へ戻ったから'],known:[r],classification:'reason',after:'3/4は0.75と表せます。次は、余りが0にならない割り算と比べます。',output:'\\frac34=0.75'});
 r=add(2,'integer',[301,302,303],{goal:'整数部分の後の余りを求める',before:'23÷11では、まず整数部分を求めます。23に含まれる11を二つ取り、残りを次の計算へ送ります。',input:'23=11\\times2+\\boxed{\\phantom1}',answer:'1',wrong:['2','0'],kind:'formula',after:'整数部分は2、余りは1です。小数の各位では、余りを10倍してから11で割ります。',output:'23=11\\times2+1'});
 for(const [i,s] of d2311.steps.entries()){
  r=add(2,'digit-'+i,[303],{goal:'小数第'+(i+1)+'位の商を決める',before:`今の余り${s.incoming}を10倍すると${s.moved}です。この数を11で割り、整数として取り出せる商の数字を決めます。`,input:s.moved+'\\div11',answer:s.digit,wrong:i===0?['1','9']:['8','0'],kind:'formula',known:[r],classification:'state-update',after:`商は${s.digit}です。余りはまだ計算していません。割る前の数から、11にこの商を掛けた分を引きます。`,output:'\\text{小数第'+(i+1)+'位の商}='+s.digit,trace:['long-division@1:23/11:'+i]});
  r=add(2,'remainder-'+i,[303],{goal:'次の位へ送る余りを求める',before:'直前の商を使い、残った数を求めます。この余りが、次の位の計算の出発点になります。',input:s.moved+'-11\\times'+s.digit,answer:s.remainder,wrong:i===0?['0','1']:['0','10'],kind:'formula',known:[r],classification:'state-update',after:`余りは${s.remainder}です。`+(i===1?'最初と同じ余りに戻りました。商と余りを表でまとめ、その先を予測します。':'次の位では、この余りを10倍して割ります。'),output:s.moved+'=11\\times'+s.digit+'+'+s.remainder,table:i===1?[['位','割る前','商','余り'],['小数第1位','10','0','10'],['小数第2位','100','9','1']]:undefined,trace:['long-division@1:23/11:'+i]});
 }
 const repeatResult=add(3,'cycle',[304],{goal:'余りが戻った後の数字を予測する',before:'小数第2位まで進むと、余りが最初の1へ戻りました。同じ余りから始めれば、次に割る数も商も同じになります。',answer:'0、9の並びが繰り返される',wrong:['9だけが繰り返される','ここで余りが0になる'],known:[r],classification:'reason',after:'整数部分2の後に09が繰り返されます。上の横線は、その下の数字列が繰り返されることを表します。',output:'\\frac{23}{11}=2.\\overline{09}'});
 add(4,'definitions',[305],{role:'definition',goal:'小数と分数の分類を知る',before:'整数m,nを用い、n≠0としてm/nと表せる数を有理数といいます。整数も分母を1にして表せます。小数部分が途中で終わるものを有限小数、終わらないものを無限小数といいます。無限小数のうち、ある所から同じ数字列を繰り返すものが循環小数です。',teaches:['rational-definition','decimal-classification'],after:'小数の続き方と、整数どうしの比で表せることは、別の観点です。この二つを分けて最初の数へ当てはめます。'});
 add(4,'finite',[306],{goal:'0.75の小数分類を決める',before:'0.75は、小数部分が途中で終わるかを見ます。定義をそのまま使い、数の大きさとは分けて分類します。',answer:'有限小数',wrong:['循環小数','終わらない小数'],requires:['decimal-classification'],classification:'interpretation',after:'小数部分が終わるので有限小数です。また3/4と書けることから、有理数でもあります。',output:'0.75=\\frac34'});
 add(4,'rational',[306],{goal:'循環する小数が有理数である根拠を選ぶ',before:'もう一つの小数は09が繰り返されます。有理数かどうかは、終わるかどうかではなく定義で判断します。',answer:'整数23と11の比で表せるから',wrong:['小数が無限に続けば整数比で表せないから','整数部分が2だから'],known:[repeatResult],requires:['rational-definition','decimal-classification'],classification:'reason',after:'23/11という分数で表せるので、有理数であり循環小数です。有限小数だけが有理数なのではありません。'});
 add(5,'remainders',[307,308,309],{goal:'同じ余りが必ず現れる理由を導く',role:'proof',before:'負の分数は、負号を外して正の数の小数表示を調べ、最後に負号を戻せます。ここでは分母を正の整数nとし、正の分数について考えます。余りは0からn−1までで、0以外はn−1種類しかありません。余り0で終わらずに計算が続くとき、限られた種類の余りを何度も使うことになります。',input:'1,2,\\ldots,n-1',answer:'余りは有限種類なので、計算が続けば同じ余りが再び現れる',wrong:['商が必ず同じ数字になるから','余りはいつまでも別の整数に増えるから'],classification:'reason',after:'同じ余りからは、次に10倍して割る計算も同じです。したがって、その後の商の列が繰り返されます。これは具体例の観察だけでなく、任意の正の分母に対する説明です。'});
 add(5,'property',[310],{role:'property',goal:'有理数の小数表示をまとめる',before:'余りが0になればそこで終わり、0にならずに続けば同じ余りが再び現れます。二つの場合で全てを尽くしています。',after:'したがって有理数の小数表示は有限小数か循環小数です。次は逆に、循環小数から整数どうしの比を作ります。',teaches:['rational-decimal-property']});
 function repeat(n,src,digits,steps,prior){const c=repeatCandidates(digits,q(n),src.map(block),{steps,priorResult:prior});invariant(c.status==='PASS','repeat profile unsupported');if(n===6)c.nodes[0].before='この数をxと置きます。小数部分の周期を確認し、小数点を何桁動かすと元と同じ並びにそろうか考えます。';nodes.push(...c.nodes);return c.nodes.at(-1).resultId;}
 r=repeat(6,[311,312,313,314,315,316],'8',['scale','scaled']);
 r=repeat(7,[317],'8',['subtract','left-form','coefficient','right-difference'],r);
 r=repeat(8,[318],'8',['divide'],r);
 add(8,'meaning',[319],{role:'interpretation',goal:'有限の等式へ直せた理由を確かめる',before:'無限に続く数字を最後まで計算したのではありません。二式で同じ小数部分が対応していたことを振り返ります。',answer:'同じ小数部分を差で消せたから',wrong:['無限に続く部分を途中で切り捨てたから','循環している数字を整数とみなしたから'],known:[r],classification:'reason',after:'同じ部分をそろえて消すことで、有限の等式から元の数を求められました。今度は周期が二桁の例にこの方法を使います。'});
 r=repeat(9,[320,321,322],'69',['scale','scaled','subtract','left-form','coefficient','right-difference']);
 r=repeat(10,[323],'69',['divide','reduce'],r);
 const rational69=r;
 const oldTen=nodes.find(n=>n.problemId==='N07-Q10'&&n.operation==='reduce-fraction');oldTen.interaction={...oldTen.interaction,id:'n07-10',answer:'\\frac{23}{33}',answerType:'formula',choices:['\\frac{23}{33}','\\frac{69}{100}','\\frac{23}{99}','\\frac{33}{23}']};
 add(11,'factor-ten',[324,325,326,327],{goal:'分母10の素因数を読む',before:'例えば0.75=75/100のように、有限小数は小数点を右へ動かした分だけ10の累乗で割る形へ戻せます。ここではまず、その分母を作る10を素数の積へ分けます。素数は1と自分自身以外に正の約数を持たない、1より大きい整数です。素因数分解とは、正の整数を素数の積に表すことです。',teaches:['prime-factorization'],input:'10=\\boxed{\\phantom{2\\times5}}',answer:'2\\times5',wrong:['2+5','10\\times10'],kind:'formula',classification:'representation',after:'10は2×5です。10をk回掛ける場合には、2と5がそれぞれ何個ずつ現れるかを数えます。',output:'10=2\\times5'});
 r=add(11,'power',[327],{goal:'10のk乗を素因数の積で作る',before:'kは正の整数です。10を一つ掛けるたびに、2が一つ、5が一つずつ増えます。',input:'10^k=\\boxed{\\phantom{2^k5^k}}',answer:'2^k\\cdot5^k',wrong:['2^k+5^k','2^{2k}\\cdot5^k'],kind:'formula',classification:'derivation',requires:['prime-factorization'],after:'分母10^kの素因数は2と5だけです。約分しても、新しい種類の素因数が分母へ加わることはありません。',output:'10^k=2^k\\cdot5^k'});
 add(11,'converse',[328],{role:'proof',goal:'条件の逆向きも確認する',before:'逆に、既約分数をp/(2^u5^v)とします。pは整数、u,vは0以上の整数です。大きい方の指数をhとするとh−u,h−vは0以上です。分子と分母へ2^(h−u)5^(h−v)を掛けると、分母は2^h5^h=10^hになります。例えば1/8なら分子分母へ125を掛け、125/1000とできます。',requires:['prime-factorization'],known:[r],after:'既約分母の素因数が2と5だけであることは、有限小数になるための必要十分条件です。分母1も有限小数になる場合に含まれます。分母に3等が残れば有限小数にはなりません。',teaches:['finite-denominator-rule'],output:'\\begin{aligned}\\frac{p}{2^u5^v}&=\\frac{p\\cdot2^{h-u}5^{h-v}}{2^h5^h}\\\\&=\\frac{p\\cdot2^{h-u}5^{h-v}}{10^h}\\end{aligned}'});
 const enumeration=finiteDenominators(2,20),valid=enumeration.filter(x=>x.finite).map(x=>x.a);
 add(12,'powers-two',[329],{goal:'範囲内の2の累乗を集める',before:'2≤a≤20の範囲で、まず5を因数に持たない場合を調べます。2を順に掛けて、上限を超える直前まで記録します。',answer:'2,4,8,16',wrong:['2,4,8','2,4,8,16,32'],requires:['finite-denominator-rule'],classification:'representation',after:'2の累乗は2、4、8、16です。次は5を因数に持つ数を調べ、全候補へまとめます。'});
 add(12,'include-five',[329],{goal:'5に掛けられる2の個数の上限を決める',before:'5を因数に持つ場合は5×2^r（rは0以上の整数）と表せます。rを0から一つずつ増やし、20を超えない最後の場合を調べます。5を二つ含むと25以上になるので、この範囲には入りません。',input:'5\\times2^r\\le20',answer:'2',wrong:['1','3'],kind:'formula',requires:['finite-denominator-rule'],classification:'derivation',after:'r=0,1,2の三つの場合から、5、10、20が得られます。次のr=3では40となり、範囲を超えます。'});
 add(12,'assemble',[329],{goal:'候補の除外理由を条件から判断する',before:'二つの群を合わせる前に、12を含めてよいか確認します。12を素因数の積に分け、分母として必要な条件と比べます。',input:'12=2^2\\times3',answer:'3が残るため除く',wrong:['偶数なので含める','20以下なので含める'],classification:'reason',requires:['finite-denominator-rule'],after:'12は3を含むため除きます。16は範囲内の2の累乗なので含みます。二つの群を合わせると、答えは'+valid.join('、')+'です。',output:'a='+valid.join(','),trace:['exhaustive-finite-denominators@1:2..20']});
 add(13,'difference',[330,331,332,333],{goal:'差を求め自然数の範囲と比べる',before:'ここで自然数は正の整数と約束します。a=2、b=3を使い、まずa−bだけを計算します。',teaches:['natural-convention'],input:'a-b=2-3',answer:fraction(2).sub(3).toFraction(),wrong:['1','0'],kind:'formula',classification:'state-update',after:'差は−1です。正の整数ではないため自然数ではありませんが、整数として扱えます。',output:'a-b=-1'});
 add(13,'quotient',[333],{goal:'求めた商が自然数か判断する',before:'次にa/bを計算します。分母に入るb=3は0ではありません。自然数かどうかは、正の整数という約束で判断します。',input:'\\frac ab=\\frac23',answer:'自然数ではない（整数ではないから）',wrong:['2/3で、自然数である','3/2で、自然数である'],requires:['natural-convention'],classification:'interpretation',after:'商は2/3で整数ではありません。したがって、自然数どうしの差や商がいつも自然数になるわけではないと、この反例で分かります。',output:'\\frac ab=\\frac23'});
 add(14,'real-definition',[334,335],{role:'definition',goal:'数の範囲と実数の分類を知る',before:'整数へ範囲を広げると差を扱え、有理数では0でない数による商も扱えます。ここで扱う数のうち、整数どうしの比で表せないものを無理数といい、√2やπが例です。有理数と無理数を合わせた全体を実数と呼びます。',teaches:['irrational-definition','real-definition'],after:'無限に続くかどうかだけで、有理数と無理数を分けないことが大切です。具体的に得た分数へ戻って確認します。'});
 add(14,'reuse',[336],{goal:'前の分数を使い分類の理由を述べる',before:'先ほどの0.696969…について、保存した最終結果を参照します。もう一度計算せず、有理数の定義と照合します。',answer:'23/33と表せるので有理数',wrong:['無限小数なので無理数','整数ではないので無理数'],known:[rational69],requires:['rational-definition','irrational-definition'],classification:'reason',after:'23と33は整数で33≠0です。整数どうしの比で表せたため、有理数であることが確かめられました。',output:'0.\\overline{69}=\\frac{23}{33}'});
 add(14,'closing',[337,338,339],{role:'bridge',goal:'分類を整理し、数直線へつなぐ',before:'無理数の小数表示は循環しない無限小数です。√2が有理数でないことの証明は「命題と証明」で扱います。この節の具体例の計算だけで証明済みとはしません。',after:'実数でも交換法則・結合法則・分配法則が成り立ち、これまでの文字式の変形を使えます。ただし0で割ることはできません。次は数直線上の位置と、原点からの距離を分けて考えます。'});
 const oldFourteen=nodes.find(n=>n.problemId==='N07-Q14'&&n.operation==='reuse');oldFourteen.interaction={...oldFourteen.interaction,id:'n07-14',answer:'有理数（23/33と表せる）',choices:['有理数（23/33と表せる）','無理数（小数が無限に続く）','無理数（整数ではない）','有理数（小数第2位で終わる）']};
 for(const n of nodes){if(!n.interaction)continue;const q=n.interaction;
  q.prefixLatex??='';q.suffixLatex??='';q.scaffoldLevel??='strong';q.supportReason??='対象となる条件と操作を段階ごとに示す。';
  if(n.id==='n07-q01-tenths'){n.inputLatex='3\\div4';q.prefixLatex='30=4\\times';q.suffixLatex='+2';}
  if(n.id==='n07-q01-hundredths'){n.inputLatex='';q.prefixLatex='20=4\\times';q.suffixLatex='+0';}
  if(n.id==='n07-q02-integer'){n.inputLatex='';q.prefixLatex='23=11\\times2+';}
  if(n.id==='n07-q11-factor-ten'){n.inputLatex='';q.prefixLatex='10=';}
  if(n.id==='n07-q11-power'){n.inputLatex='';q.prefixLatex='10^k=';}
  if(n.operation.startsWith('digit-'))q.prefixLatex=n.outputLatex.slice(0,n.outputLatex.lastIndexOf('=')+1);
  if(n.id==='n07-q13-difference')q.prefixLatex='a-b=';
  if(n.id==='n07-q14-reuse'){q.scaffoldLevel='light';q.supportReason='確定済み分数と導入済み定義を照合する適用。';}
 }
 const errors={
 'tenths':['4×6を引くと余りが4以上になり、商をまだ増やせる。','4×8は30より大きくなる。'],
 'hundredths':['4×4を引くと余り4で、もう一つ4を取り出せる。','4×2では20の半分以上が残る。'],
 'end':['桁数は終了条件ではなく、余り0が終了条件。','同じ余りが戻るのは循環する場合。'],
 'integer':['23−11×2は2ではない。','23は11の倍数ではなく、余りが残る。'],
 'cycle':['直前の商は0と9の二桁であり9だけではない。','最後の余りは1であり0ではない。'],
 'finite':['0.75は途中で終わるので循環する無限小数ではない。','小数第2位で余り0になったため、終わらない小数ではない。'],
 'rational':['無限小数でも整数比で表せる場合があり、今回の数は23/11で表せる。','整数部分の値は有理数の定義ではない。'],
 'remainders':['商の数字が同じかではなく、余りの種類が有限なことが根拠。','余りは常に0以上n未満で、無限に増やせない。'],
 'meaning':['途中を切り捨てると元の数と等しい保証がない。','循環部分を整数とみなす操作はしていない。'],
 'factor-ten':['素因数分解は和ではなく素数の積で表す。','10自体は素数でなく、10×10は値も違う。'],
 'power':['10を掛け合わせるので、2と5の累乗の和にはならない。','2も5も各k個ずつであり、2だけ2k個にはならない。'],
 'powers-two':['もう一度2を掛けた16も20以下である。','32は上限20を超える。'],
 'include-five':['もう一つ2を掛けても20以下になる。','2を三つ掛けると40で上限を超える。'],
 'assemble':['偶数でも3等が既約分母に残れば有限小数でない。','範囲内であることだけでは素因数の条件を満たさない。'],
 'difference':['引く順は2−3であり3−2ではない。','二つの数は等しくないため差0ではない。'],
 'quotient':['2/3は整数ではないため正の整数にもならない。','商はa/b=2/3であり逆の3/2ではない。'],
 'reuse':['整数比23/33で表せるので、無限小数でも有理数。','有理数には整数でない数も含む。','69は繰り返し、二桁で終わる小数ではない。']};
 for(const n of nodes){if(!n.interaction)continue;const a=n.interaction,wrong=a.choices.filter(c=>c!==a.answer);
  if(n.provenance==='ai-authored'){
   let reasons=errors[n.operation];
   if(n.operation.startsWith('digit-'))reasons=wrong.map(c=>'割る前の数と11の倍数を比べたとき、取り出せる整数の商と一致しない。');
   if(n.operation.startsWith('remainder-'))reasons=wrong.map(c=>'割る前の数から11×確定した商を引いた値と一致しない。');
   invariant(reasons&&reasons.length===wrong.length,'missing authored distractor reasons: '+n.id);
   a.distractorReasons=Object.fromEntries(wrong.map((c,i)=>[c,reasons[i]]));
   a.hints=[n.operation.startsWith('digit-')?'割る前の数を超えない11の倍数を探します。':n.operation.startsWith('remainder-')?'割る前の数から、11に商を掛けた分を引きます。':n.operation==='reuse'||n.operation==='rational'?'整数の比で表せるという有理数の定義に戻ります。':n.operation==='include-five'?'5へ2を順に掛け、上限を超える直前を探します。':n.operation==='power'?'10を一つ掛けるとき、2と5がそれぞれ何個ずつ増えるか数えます。':n.reason];
  }
 }
 const preservedTen=nodes.find(n=>n.interaction?.id==='n07-10');preservedTen.interaction.distractorReasons=Object.fromEntries(preservedTen.interaction.choices.slice(1).map(c=>[c,'69/99と同じ値になるよう、分子と分母を同じ共通因数で割る必要がある。']));
 nodes.find(n=>n.operation==='cycle').teachesAfter.push('repeating-notation');nodes.find(n=>n.problemId==='N07-Q08'&&n.operation==='meaning').teachesAfter.push('repeat-to-rational-method');for(const n of nodes){if(n.operation==='select-minimum-scale')n.requires.push('repeating-notation');if(n.problemId==='N07-Q09')n.requires.push('repeat-to-rational-method');if(n.problemId==='N07-Q11'&&n.operation==='power')n.requires.push('power-law');}
 // AI-reviewed Japanese transitions are instantiated from the mathematical trace slots.
 for(const n of nodes){if(n.provenance!=='rule-generated')continue;
  const digits=n.traceRefs.find(x=>x.startsWith('pure-repeat@1:')).split(':')[1];
  const c=repeatCandidates(digits,n.problemId,n.sourceRefs);const scale=c.scale,num=c.numerator,den=c.denominator;
  const transitions={
   'select-minimum-scale':`一周期は${c.period.length}桁なので、選んだ${scale}倍で同じ並びがそろいます。次は、その倍率を両辺に掛けた等式を作ります。`,
   'multiply-both-sides':`整数部分は${num}になり、小数部分は元と同じ${digits}の繰り返しです。二式を並べ、同じ部分を消す操作を選びます。`,
   'choose-subtraction':'上の等式から元の等式を引きます。いきなり両辺をまとめず、左辺のxの項と右辺の小数を別々に整理します。',
   'build-coefficient-expression':`二つ目のxは1xなので、係数の差は${scale}−1です。xを消さずに括弧の外へ残せました。次は括弧の中を計算します。`,
   'collect-coefficient':`${scale}−1=${den}なので、左辺は${den}xです。左辺の結果を残し、次に右辺の差を求めます。`,
   'subtract-equal-decimal-parts':`同じ小数部分が消え、右辺には${num}が残ります。左辺と合わせると${den}x=${num}です。この等式からxを求めます。`,
   'divide-both-sides':`両辺を${den}で割ると、xを整数どうしの比${num}/${den}で表せます。`+(n.problemId==='N07-Q10'?'最後に分子・分母の共通因数を調べます。':'元の循環小数を分数で表せました。'),
   'reduce-fraction':`69と99を同じ3で割ると23/33です。整数どうしの比を作れたので、この無限小数も有理数です。次は有限小数になる分母の条件を調べます。`
  };
  invariant(transitions[n.operation],'missing reviewed transition');n.after=transitions[n.operation];n.provenance='ai-refined';
 }
 const coverage=catalog.map(s=>{const refs=nodes.filter(n=>n.sourceRefs.includes(s.id)).map(n=>n.id);invariant(refs.length||[block(297),block(298),block(340)].includes(s.id),'unmapped source content: '+s.id);return {sourceId:s.id,nodeIds:refs,disposition:refs.length?'taught':s.id===block(340)?'next-unit-context':'structural',reason:refs.length?'対応する説明・判断へ統合':s.id===block(340)?'次のN08に付く節見出し':'見出し・役割表示を教材の構造へ対応'};});
 return {schemaVersion:1,unitId:'math-numbers-expressions-n07',revision:4,state:'candidate',sourceHash:source.documentHash,sourceCatalog:catalog,coverage,initialConcepts:['decimal-place','equality-operation','power-law','common-factor'],orderedNodeIds:nodes.map(n=>n.id),nodes,title:'分数と小数で、同じ数を表す',objectives:['商と余りから小数の続き方を読む','循環部分をそろえる理由を考え分数へ直す','有限小数の分母と数の分類をつなぐ'],audit:{status:'pending',reviewer:'separate novice/source audit required',findings:[]}};
}

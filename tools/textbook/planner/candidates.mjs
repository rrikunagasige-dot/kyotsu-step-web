import { repeating } from '../rules/n07.mjs';
// Patterns inspired by Mathsteps changeType/substeps and Numbas parts. No upstream code copied.
const descriptions={
 period:['循環する部分を読む','小数の先頭から、同じ数字の並びが繰り返される所に注目します。'],
 scale:['小数部分をそろえる','前の例と比べて、繰り返す部分の桁数を確認します。元の数と小数部分が同じになる最小の倍率を選びます。'],
 scaled:['倍率後の式を作る','選んだ倍率を、等式の左辺と右辺の両方に掛けます。小数点の移動と整数部分を対応させます。'],
 subtract:['同じ部分を消す操作を選ぶ','確定した二つの式を並べ、小数部分を比べます。同じ部分を消し、有限の等式に直します。'],
 'left-form':['左辺を係数の差として作る','二つの項に共通するxに注目します。xを残したまま、掛かっている数だけを括弧の中へまとめます。'],
 'right-difference':['右辺の小数部分を消す','今度は右辺に注目します。二つの数の小数部分が同じであることを使い、差を求めます。'],
 coefficient:['左辺の係数をまとめる','xに掛かる数だけを取り出し、その差を計算します。右辺の値は変えずに残します。'],
 divide:['x一つの値を求める','今の等式は、xに係数を掛けた形です。等式の両辺に同じ操作をして、xだけを残します。'],
 reduce:['分数を整える','分子と分母を同じ数で割れるか調べ、値を変えずに既約分数に直します。']};
export function repeatCandidates(repeat,problemId,sourceRefs,{steps,priorResult=null}={}){
 const solution=repeating(repeat);if(solution.status!=='PASS')return solution;
 const selected=steps??solution.trace.map(s=>s.id);let previous=priorResult;
 const nodes=solution.trace.filter(t=>selected.includes(t.id)).map(t=>{
  const key=problemId.toLowerCase()+'-'+t.id;const [goal,before]=descriptions[t.id];
  const answer=t.id==='reduce'?solution.exact:t.answer;
  const alternatives={period:[String(solution.period.length+1),'0'],scale:[String(BigInt(solution.scale)*10n),String(BigInt(solution.scale)>=100n?BigInt(solution.scale)/10n:BigInt(solution.scale)*100n)],scaled:['0.\\overline{'+solution.period+'}',String(BigInt(solution.numerator)*10n)+'.\\overline{'+solution.period+'}'],subtract:['足す','掛ける'],'left-form':['('+solution.scale+'+1)x',solution.scale+'x-1'],'right-difference':['0',String(BigInt(solution.numerator)*10n)],coefficient:[solution.scale,String(BigInt(solution.scale)+1n)],divide:['\\frac{'+solution.denominator+'}{'+solution.numerator+'}','\\frac{'+solution.numerator+'}{'+solution.scale+'}'],reduce:[solution.numerator+'/'+solution.scale,solution.denominator+'/'+solution.numerator]};
  const type=t.id==='subtract'||t.id==='reduce'?'text':'formula';
  const classification=t.id==='scale'||t.id==='subtract'?'planning':t.id==='scaled'?'representation':t.id==='coefficient'||t.id==='left-form'?'derivation':t.id==='period'?'problem-understanding':'state-update';
  const node={id:key,problemId,sourceRefs,role:'example',goal,operation:t.operation,reason:t.reason,before,after:t.reason+' 得られた結果を次の段階で使います。',inputLatex:t.before,outputLatex:t.after,knownRefs:previous?[previous]:[],requires:['decimal-place','equality-operation',...(t.id==='left-form'?['common-factor']:[])],teachesBefore:[],teachesAfter:[],resultId:key+'-result',stageId:problemId.toLowerCase()+'-stage',interaction:{id:key+'-answer',classification,prompt:goal+'。',answer,answerType:type,choices:[answer,...alternatives[t.id]].filter((x,i,a)=>a.indexOf(x)===i),distractorReasons:Object.fromEntries(alternatives[t.id].map(c=>[c,t.id==='scale'?(BigInt(c)>BigInt(solution.scale)?'同じ部分がそろっても、もっと小さい倍率があるので最小ではない。':'一周期分の桁移動に足りず、小数部分が元とそろわない。'):t.id==='subtract'?'この操作では同じ小数部分の差を0にできない。':t.id==='left-form'?'xは両方の項に共通し、係数だけの差を括弧へ入れる。':t.id==='right-difference'?'小数部分の差は0になり、整数部分の差だけが残る。':t.id==='coefficient'?'元のxは1xなので、倍率から1を引く必要がある。':t.id==='divide'?'両辺をxの係数で割る際の分子・分母が対応していない。':t.id==='scaled'?'選んだ倍率で動く小数点と整数部分が対応していない。':t.id==='reduce'?'元の分数と同じ値の既約分数になっていない。':'最短の繰返し部分の桁数と一致しない。'])),hints:[{scale:'一周期の桁数と、小数点を動かす桁数を対応させます。',scaled:'小数点を動かした後、整数部分へ移る数字を確認します。',subtract:'同じ数どうしから0を作る操作を考えます。','left-form':'二つ目のxは1×xと読み、x以外の数を括弧へ入れます。','right-difference':'同じ小数部分を引くと0になります。',coefficient:'元の式のxは1xと読めます。',divide:'xに掛かる係数を1にする操作を考えます。',reduce:'分子と分母の両方を同じ整数で割れるか調べます。',period:'先頭から同じ並びが繰り返される最短部分を見ます。'}[t.id]],reason:t.reason,prefixLatex:t.id==='scaled'?solution.scale+'x=':t.id==='divide'||t.id==='reduce'?'x=':t.id==='left-form'?solution.scale+'x-x=':t.id==='right-difference'?t.before+'=':t.id==='coefficient'?'':t.id==='scale'?'\\text{倍率}=':'',suffixLatex:t.id==='coefficient'?'x':t.id==='scale'?'\\text{倍}':'',scaffoldLevel:problemId==='N07-Q09'?'medium':'strong',supportReason:problemId==='N07-Q09'?'Q06–Q08で一桁周期の方法を説明・練習済み。二桁へ移す判断は残す。':'初回の方法を操作ごとに説明する。',taskContract:t.id==='scale'?'minimum':t.id==='reduce'?'reduced':'exact'},visibleBeforeResults:[],traceRefs:[`pure-repeat@1:${repeat}:${t.id}`,...(priorResult&&previous===priorResult?['designed-cross-problem-reuse:'+priorResult]:[])],provenance:'rule-generated'};
  previous=node.resultId;return node;
 });return {...solution,nodes};
}

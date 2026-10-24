import Fraction from 'fraction.js';
import { invariant } from '../util.mjs';
export const version='n07-rules-1';
export const fraction = value => { invariant(typeof value!=='number'||Number.isSafeInteger(value),'use exact strings for non-integer or unsafe numbers');return new Fraction(value); };
const int = x=>{invariant(typeof x!=='number'||Number.isSafeInteger(x),'unsafe integer input');invariant(/^-?\d+$/.test(String(x)),'integer required');return BigInt(x);};
export function division(numerator,denominator,limit=2000){
  let p=int(numerator),q=int(denominator);invariant(q!==0n,'zero denominator');
  const sign=(p<0n)!==(q<0n)?'-':'';p=p<0n?-p:p;q=q<0n?-q:q;
  const integer=p/q;let remainder=p%q;const seen=new Map(),steps=[];
  while(remainder!==0n&&!seen.has(remainder.toString())){
    if(steps.length>=limit)return {status:'UNSUPPORTED',reason:'division-step-limit',steps};
    seen.set(remainder.toString(),steps.length);const incoming=remainder;
    const moved=10n*incoming,digit=moved/q;remainder=moved%q;
    steps.push({incoming:String(incoming),moved:String(moved),digit:String(digit),remainder:String(remainder)});
  }
  const cycle=remainder===0n?null:seen.get(String(remainder));
  return {status:'PASS',sign,integer:String(integer),steps,cycleStart:cycle,
    decimal:sign+integer+'.'+steps.map(s=>s.digit).join(''),terminated:remainder===0n,
    exact:new Fraction(numerator,denominator).toFraction()};
}
export function shortestPeriod(repeat){
  invariant(/^\d+$/.test(repeat),'explicit repeating digit block required');
  for(let k=1;k<=repeat.length;k++)if(repeat.length%k===0&&repeat.slice(0,k).repeat(repeat.length/k)===repeat)return repeat.slice(0,k);
}
export function repeating(repeat){
  const period=shortestPeriod(repeat);
  if(/^0+$/.test(period)||/^9+$/.test(period))return {status:'UNSUPPORTED',reason:'non-unique-decimal-needs-separate-teaching-profile',exact:new Fraction('0.('+repeat+')').toFraction()};
  invariant(period.length<=100,'period too large for teaching profile');
  const scale=10n**BigInt(period.length),denominator=scale-1n,numerator=int(period);
  const exact=new Fraction('0.('+repeat+')');
  invariant(exact.equals(new Fraction(numerator,denominator)),'independent rational consistency failed');
  const tail='0.\\overline{'+period+'}',shift=String(numerator)+'.\\overline{'+period+'}';
  const trace=[
    {id:'period',operation:'read-period',before:tail,after:String(period.length),answer:String(period.length),reason:'同じ並びが繰り返される最短の桁数を読む。'},
    {id:'scale',operation:'select-minimum-scale',before:'x='+tail,after:String(scale),answer:String(scale),reason:'小数部分を元と同じ並びにそろえるため、小数点を一周期分だけ動かす。'},
    {id:'scaled',operation:'multiply-both-sides',before:'x='+tail,after:String(scale)+'x='+shift,answer:shift,reason:'選んだ倍率を等式の両辺に掛ける。'},
    {id:'subtract',operation:'choose-subtraction',before:'\\begin{aligned}'+scale+'x&='+shift+'\\\\x&='+tail+'\\end{aligned}',after:String(scale)+'x-x='+shift+'-'+tail,answer:'引く',reason:'二式の同じ小数部分の差を0にする。'},
    {id:'left-form',operation:'build-coefficient-expression',before:String(scale)+'x-x',after:String(scale)+'x-x=('+scale+'-1)x',answer:'('+scale+'-1)x',reason:'二つの項に共通するxを残し、係数の差を括弧の中に作る。'},
    {id:'coefficient',operation:'collect-coefficient',before:'('+scale+'-1)x',after:denominator+'x',answer:String(denominator),reason:'xに掛かる数を計算して一つにする。'},
    {id:'right-difference',operation:'subtract-equal-decimal-parts',before:shift+'-'+tail,after:denominator+'x='+numerator,answer:String(numerator),reason:'同じ小数部分を引くと0になり、整数部分だけが残る。'},
    {id:'divide',operation:'divide-both-sides',before:denominator+'x='+numerator,after:'x=\\frac{'+numerator+'}{'+denominator+'}',answer:'\\frac{'+numerator+'}{'+denominator+'}',reason:'xの係数で両辺を割る。'},
    {id:'reduce',operation:'reduce-fraction',before:'\\frac{'+numerator+'}{'+denominator+'}',after:'\\frac{'+exact.s*exact.n+'}{'+exact.d+'}',answer:exact.toFraction(),reason:'分子と分母を同じ共通因数で割り、既約分数にする。'}
  ];
  return {status:'PASS',period,scale:String(scale),numerator:String(numerator),denominator:String(denominator),exact:exact.toFraction(),trace};
}
export function finite(value){
 const f=fraction(value);let q=f.d;let two=0,five=0;
 while(q%2n===0n){q/=2n;two++;}while(q%5n===0n){q/=5n;five++;}
 return {exact:f.toFraction(),denominator:String(f.d),two,five,remaining:String(q),finite:q===1n};
}
export function finiteDenominators(min,max){invariant(Number.isSafeInteger(min)&&Number.isSafeInteger(max)&&min>=1&&max>=min&&max-min<=10000,'unsupported enumeration range');return Array.from({length:max-min+1},(_,i)=>min+i).map(a=>({a,...finite('1/'+a)}));}
export function answerCheck(student,teacher,{reduced=false}={}){
 try{const plain=s=>s.replace(/^\\frac\{(-?\d+)\}\{(\d+)\}$/,"$1/$2");student=plain(student);teacher=plain(teacher);const actual=new Fraction(student),expected=new Fraction(teacher);const equivalent=actual.equals(expected);
  const m=/^(-?\d+)\/(\d+)$/.exec(student);const formOK=!reduced||!m||(actual.s*actual.n===BigInt(m[1])&&actual.d===BigInt(m[2]));
  return {equivalent,formOK,correct:equivalent&&formOK};
 }catch{return {equivalent:false,formOK:false,correct:false};}
}

/** Small, closed mathematical AST. No eval, executable strings, or arbitrary LaTeX parsing. */
import { z } from 'zod';
const integer = z.string().regex(/^-?\d{1,30}$/);
export const expressionSchema = z.lazy(() => z.discriminatedUnion('kind', [
  z.object({kind:z.literal('rational'),n:integer,d:integer.refine(x=>BigInt(x)>0n)}).strict(),
  z.object({kind:z.literal('symbol'),name:z.string().regex(/^[a-zA-Z][a-zA-Z0-9_]{0,15}$/)}).strict(),
  z.object({kind:z.literal('absolute'),argument:expressionSchema}).strict(),
  z.object({kind:z.literal('sqrt'),argument:z.object({kind:z.literal('rational'),n:integer.refine(x=>BigInt(x)>=0n),d:integer.refine(x=>BigInt(x)>0n)}).strict()}).strict(),
  z.object({kind:z.literal('constant'),name:z.literal('pi')}).strict(),
  z.object({kind:z.literal('add'),args:z.array(expressionSchema).min(2).max(12)}).strict(),
  z.object({kind:z.literal('multiply'),args:z.array(expressionSchema).min(2).max(12)}).strict(),
  z.object({kind:z.literal('power'),base:expressionSchema,exponent:z.number().int().min(0).max(4)}).strict(),
  z.object({kind:z.literal('divide'),numerator:expressionSchema,denominator:expressionSchema}).strict(),
]));
export const intervalSchema=z.object({lower:expressionSchema.nullable(),upper:expressionSchema.nullable(),lowerOpen:z.boolean(),upperOpen:z.boolean()}).strict();
export const statementSchema=z.discriminatedUnion('kind',[
  z.object({kind:z.literal('expression'),expression:expressionSchema}).strict(),
  z.object({kind:z.literal('relation'),operator:z.enum(['=','<','<=','>','>=']),left:expressionSchema,right:expressionSchema}).strict(),
  z.object({kind:z.literal('extrema'),function:expressionSchema,variable:z.string().regex(/^[a-zA-Z]\w*$/),domain:intervalSchema,extremum:z.enum(['minimum','maximum']),value:expressionSchema,at:z.array(expressionSchema),attained:z.boolean()}).strict(),
]);
export const rat=(n,d=1)=>({kind:'rational',n:String(n),d:String(d)});
export const sym=name=>({kind:'symbol',name});
export const add=(...args)=>({kind:'add',args});
export const mul=(...args)=>({kind:'multiply',args});
export const pow=(base,exponent)=>({kind:'power',base,exponent});
export const div=(numerator,denominator)=>({kind:'divide',numerator,denominator});
export const relation=(left,operator,right)=>({kind:'relation',left,operator,right});
export const expr=expression=>({kind:'expression',expression});
export const realLine={lower:null,upper:null,lowerOpen:true,upperOpen:true};
export function symbols(value){
  const found=new Set();let count=0;
  const walk=(v,depth=0)=>{if(++count>600||depth>24)throw Error('AST_LIMIT');if(v&&typeof v==='object'){if(v.kind==='symbol')found.add(v.name);for(const x of Object.values(v))if(x&&typeof x==='object')Array.isArray(x)?x.forEach(a=>walk(a,depth+1)):walk(x,depth+1);}};
  walk(value);return [...found];
}
export function expressionLatex(e){
  if(e.kind==='slot')return `\\boxed{\\mathrm{${e.label}}}`;
  if(e.kind==='absolute')return `\\left|${expressionLatex(e.argument)}\\right|`;
  if(e.kind==='sqrt')return `\\sqrt{${expressionLatex(e.argument)}}`;
  if(e.kind==='constant')return '\\pi';
  if(e.kind==='rational')return e.d==='1'?e.n:`\\frac{${e.n}}{${e.d}}`;
  if(e.kind==='symbol')return e.name.includes('_')?e.name.replace('_','_{')+'}':e.name;
  if(e.kind==='add')return e.args.map(expressionLatex).join('+').replace(/\+-/g,'-');
  if(e.kind==='multiply'){
    const factor=a=>a.kind==='add'?`\\left(${expressionLatex(a)}\\right)`:expressionLatex(a);
    if(e.args.length===2&&e.args[0].kind==='rational'&&e.args[0].n==='-1'&&e.args[0].d==='1')return '-'+factor(e.args[1]);
    return e.args.map((a,i)=>(i&&a.kind!=='symbol'?'\\cdot ':'')+factor(a)).join('');
  }
  if(e.kind==='power')return `${e.base.kind==='symbol'?expressionLatex(e.base):`\\left(${expressionLatex(e.base)}\\right)`}^{${e.exponent}}`;
  return `\\frac{${expressionLatex(e.numerator)}}{${expressionLatex(e.denominator)}}`;
}
export function statementLatex(s){
  if(s.kind==='expression')return expressionLatex(s.expression);
  if(s.kind==='relation')return `${expressionLatex(s.left)} ${({'<=':'\\le','>=':'\\ge'})[s.operator]??s.operator} ${expressionLatex(s.right)}`;
  const d=s.domain;
  const interval=`${d.lowerOpen?'(': '['}${d.lower?expressionLatex(d.lower):'-\\infty'},${d.upper?expressionLatex(d.upper):'\\infty'}${d.upperOpen?')':']'}`;
  const operator=s.attained?(s.extremum==='minimum'?'min':'max'):(s.extremum==='minimum'?'inf':'sup');
  const result=`\\${operator}_{${s.variable}\\in ${interval}}\\left(${expressionLatex(s.function)}\\right) = ${expressionLatex(s.value)}`;
  return s.attained&&s.at.length?`\\begin{gathered}${result}\\\\ ${s.variable}=${s.at.map(expressionLatex).join(',')}\\end{gathered}`:result;
}

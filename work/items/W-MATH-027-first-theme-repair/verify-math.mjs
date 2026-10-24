import fs from 'node:fs'
import assert from 'node:assert/strict'
const data=JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/firstThemeRepair.json','utf8'))
// Independent arithmetic parser: only polynomials, integer powers and authored symbols.
// No generated answer or production grading code is used as the mathematical oracle.
function value(source,env){
 const clean=source.replace(/\\(?:cdot|times)/g,'*').replace(/[{}]/g,'').replace(/\s/g,'')
 const tokens=clean.match(/\d+|[A-Za-z]|[()+*^\-]/g)??[]
 assert.equal(tokens.join(''),clean,'Unsupported math syntax '+source)
 let p=0
 function primary(){const t=tokens[p++];if(t==='('){const v=sum();assert.equal(tokens[p++],')');return v}if(/^\d+$/.test(t??''))return Number(t);assert(t in env,'Unknown symbol '+t);return env[t]}
 function power(){let n=primary();if(tokens[p]==='^'){p++;n=n**unary()}return n}
 function unary(){if(tokens[p]==='-'){p++;return -unary()}if(tokens[p]==='+'){p++;return unary()}return power()}
 function product(){let n=unary();while(p<tokens.length){const t=tokens[p];if(t==='*'){p++;n*=unary()}else if(t==='('||/^\d+$/.test(t)||/^[A-Za-z]$/.test(t)){n*=unary()}else break}return n}
 function sum(){let n=product();while(tokens[p]==='+'||tokens[p]==='-'){const sign=tokens[p++];const v=product();n=sign==='+'?n+v:n-v}return n}
 const result=sum();assert.equal(p,tokens.length,'Unconsumed syntax '+source);return result
}
const report=[]
for(const [prefix,nodes]of Object.entries(data))for(const node of nodes){
 if(!node.stem.endsWith('=')||node.stem.includes('\\text')||node.stem.includes(','))continue
 const expressions=node.stem.slice(0,-1).split('=')
 const wrongDifferent=node.wrong.map(()=>false)
 for(let k=-3;k<=4;k++){
  const env={x:k,y:k+2,a:k+1,b:2*k-1,c:3-k,X:k,T:k}
  if(node.id==='n04-bridge-restore-t')env.T=env.a+env.b
  env.A=2*env.x**3-3*env.x**2+env.x-1;env.B=-(env.x**3)+2*env.x**2+2
  const target=value(expressions[0],env)
  for(const expression of expressions.slice(1))assert(value(expression,env)===target,node.id+' intermediate')
  assert(value(node.answer,env)===target,node.id+' answer')
  node.wrong.forEach((choice,i)=>{if(value(choice,env)!==target)wrongDifferent[i]=true})
 }
 assert(wrongDifferent.every(Boolean),node.id+' contains equivalent distractor')
 report.push({id:node.id,samples:8,correct:true,distractorsDistinct:true})
}
assert(report.length>=40)
fs.mkdirSync('e2e-evidence/theme-one',{recursive:true})
fs.writeFileSync('e2e-evidence/theme-one/math.json',JSON.stringify({independentPolynomialChecks:report.length,report},null,2))
console.log(JSON.stringify({independentPolynomialChecks:report.length,samples:8,passed:true}))

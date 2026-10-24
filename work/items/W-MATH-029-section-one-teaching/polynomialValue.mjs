import assert from "node:assert/strict";
export function value(source,env){
 const clean=source.replace(/\^\{([^{}]*)\}/g,'^($1)').replace(/\\(?:cdot|times)/g,'*').replace(/[{}]/g,'').replace(/\s/g,'')
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

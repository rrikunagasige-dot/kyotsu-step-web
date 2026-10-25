import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {linearExample,squareExample,extremaExample} from './solution-examples.mjs';
import {compileIR} from '../ir/index.mjs';
const dir=fileURLToPath(new URL('./solution-generated/',import.meta.url));mkdirSync(dir,{recursive:true});
for(const [name,fn] of Object.entries({linear:linearExample,square:squareExample,extrema:extremaExample})){
 const ir=fn();const compiled=compileIR(ir);
 for(const [suffix,data] of [['ir',ir],['reading',compiled]]){
  const path=dir+name+'-'+suffix+'.json',text=JSON.stringify(data,null,2)+'\n';
  if(process.argv.includes('--check')){if(readFileSync(path,'utf8')!==text)throw Error('GENERATED_FIXTURE_DRIFT: '+name+'-'+suffix);}
  else writeFileSync(path,text);
 }
}
console.log(JSON.stringify({status:'PASS',fixtures:3,contentAccepted:false}));

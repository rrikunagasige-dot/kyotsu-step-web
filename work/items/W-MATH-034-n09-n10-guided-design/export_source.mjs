import {createServer} from 'vite';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const base='work/items/W-MATH-034-n09-n10-guided-design/evidence/';
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
try{for(const u of ['n09','n10']){
 const mod=await server.ssrLoadModule('/src/data/textbook/math/numbers/'+u+'Lesson.ts');
 const unit=mod['mathNumbers'+u.toUpperCase()+'Unit'];
 fs.writeFileSync(base+u.toUpperCase()+'_CURRENT.json',JSON.stringify({sourceSHA:'ea47dd97f7d323267281915e8d9a7bb92a8e7c03',unit},null,2));
 console.log(JSON.stringify({unit:u,revision:unit.revision,items:unit.sections[0].items.length}));
}}
finally{await server.close()}

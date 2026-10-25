import {createServer} from 'vite';
import fs from 'node:fs';
const base='work/items/W-MATH-036-ne02-n11-n12-guided-design/evidence/';
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
try{for(const u of ['ne02','n11','n12']){
 const mod=await server.ssrLoadModule('/src/data/textbook/math/numbers/'+u+'Lesson.ts');
 const unit=mod['mathNumbers'+u.toUpperCase()+'Unit'];
 fs.writeFileSync(base+u.toUpperCase()+'_CURRENT.json',JSON.stringify({sourceSHA:'fa0eff271a97940fad08d83960ae50faeabc81b9',unit},null,2)+'\n');
 console.log(JSON.stringify({unit:u,revision:unit.revision,items:unit.sections[0].items.length}));
}}finally{await server.close()}

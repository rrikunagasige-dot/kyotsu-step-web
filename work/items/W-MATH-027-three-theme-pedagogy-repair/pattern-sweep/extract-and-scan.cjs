const {readFileSync,writeFileSync}=require('node:fs')
const {resolve,dirname}=require('node:path')
const {stripTypeScriptTypes}=require('node:module')
const {createHash}=require('node:crypto')
const root=resolve(__dirname), manifest=JSON.parse(readFileSync(resolve(root,'manifest.json'),'utf8'))
const cache=new Map()
function load(path){
 path=resolve(path)
 if(cache.has(path))return cache.get(path)
 const raw=readFileSync(path,'utf8'), rel=path.slice(root.length+1)
 const hash=createHash('sha1').update(Buffer.concat([Buffer.from('blob '+Buffer.byteLength(raw)+'\0'),Buffer.from(raw)])).digest('hex')
 if(manifest.git_blobs[rel]!==hash)throw Error('unverified source '+rel)
 let code=stripTypeScriptTypes(raw,{mode:'transform'})
 const names=[...code.matchAll(/\bexport\s+(?:const|let|function)\s+(\w+)/g)].map(m=>m[1])
 code=code.replace(/import\s*\{([^}]+)\}\s*from\s*(['"])([^'"]+)\2;?/g,(_,list,q,target)=>'const {'+list.replace(/\s+as\s+/g,':')+'}=require('+JSON.stringify(target)+');')
 code=code.replace(/\bexport\s+(?=(const|let|function)\s)/g,'')
 const module={exports:{}};cache.set(path,module.exports)
 const localRequire=target=>{
  if(target.endsWith('/domain/textbookSchema'))return {validateTextbookUnits:units=>units}
  if(!target.startsWith('./'))throw Error('unexpected dependency '+target)
  return load(resolve(dirname(path),target+'.ts'))
 }
 new Function('require','module',code+'\nmodule.exports={'+names.join(',')+'}')(localRequire,module)
 cache.set(path,module.exports);return module.exports
}
const units=[],maps={}
for(const name of [...Array.from({length:14},(_,i)=>'n'+String(i+1).padStart(2,'0')),'ne01','ne02']){
 const m=load(resolve(root,'src/data/textbook/math/numbers/'+name+'Lesson.ts'))
 const u=Object.values(m).find(x=>x&&typeof x==='object'&&x.unitId)
 if(!u)throw Error('unit not found '+name)
 units.push(u)
 maps[name]=Object.values(m).find(x=>x&&typeof x==='object'&&!x.unitId&&Object.keys(x).some(k=>k.startsWith(name.toUpperCase()+'-Q')))
}
const originalQuestions=Object.values(maps).reduce((n,m)=>n+Object.keys(m).length,0),actions=units.reduce((n,u)=>n+u.sections.reduce((k,s)=>k+s.items.length,0),0)
if(originalQuestions!==233||actions!==318)throw Error('unexpected source totals '+originalQuestions+'/'+actions)
const candidates=[]
for(const unit of units)for(const section of unit.sections)for(const item of section.items){
 const flags=[]
 if(item.answer.includes('\\quad')||item.answer.includes(';')||item.answer.includes('／'))flags.push('MULTIPLE_REPRESENTATIONS_CANDIDATE')
 if(item.answer.length>65)flags.push('LONG_COMPLEX_ANSWER_CANDIDATE')
 if(/二つ|二式|両方|組に|すべて|全て/.test(item.prompt))flags.push('MULTIPLE_REQUESTS_CANDIDATE')
 if(flags.length)candidates.push({unit:unit.unitId,item:item.id,prompt:item.prompt,answer:item.answer,flags,verdict:'NEEDS_SEMANTIC_REVIEW'})
}
writeFileSync(resolve(root,'all-current-units.json'),JSON.stringify({source_sha:manifest.source_sha,units,maps},null,2))
const result={source_sha:manifest.source_sha,source_files:Object.keys(manifest.git_blobs).length,units:units.length,originalQuestions,actions,method:'Evaluate verified data-only TypeScript using Node type stripping and an identity schema boundary. This extracts authored objects; it does NOT run Zod validation. Actual schema/type/build checks are separately provided by CI.',candidates,quality_labels_assigned:0,limitations:['Flags are review candidates, not confirmed defects or quality labels.','Current math/schema correctness is not inferred from lexical patterns.','This does not prove every educational defect was found.']}
writeFileSync(resolve(root,'PATTERN_SCAN.json'),JSON.stringify(result,null,2))
console.log(JSON.stringify({units:units.length,originalQuestions,actions,reviewCandidates:candidates.length,qualityLabels:0}))

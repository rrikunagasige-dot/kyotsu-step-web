import { createServer } from 'vite'
import { execFileSync } from 'node:child_process'
import { mkdirSync,writeFileSync } from 'node:fs'
const sourceSHA=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim()
const paths=execFileSync('git',['ls-files','src/data/textbook/math/numbers','src/domain/textbook.ts','src/domain/textbookSchema.ts'],{encoding:'utf8'}).trim().split('\n')
const manifest=Object.fromEntries(paths.map(path=>[path,execFileSync('git',['rev-parse','HEAD:'+path],{encoding:'utf8'}).trim()]))
const server=await createServer({server:{middlewareMode:true},appType:'custom'})
const units=[]
const domain=await server.ssrLoadModule('/src/domain/textbook.ts')
try {
 for(const suffix of [...Array.from({length:14},(_,i)=>'n'+String(i+1).padStart(2,'0')),'ne01','ne02']){
  const code=suffix.slice(1),path='/src/data/textbook/math/numbers/'+suffix+'Lesson.ts'
  const module=await server.ssrLoadModule(path)
  const unit=module['mathNumbers'+suffix.toUpperCase()+'Unit']
  if(!unit||unit.unitId!=='math-numbers-expressions-'+suffix)throw Error('Unit export mismatch '+path)
  const sourceMap=Object.entries(module).find(([name])=>/SourceToItemIds$/.test(name))?.[1]??null
  units.push({code,sourceMap,unit,visibleChoices:unit.sections.flatMap(s=>s.items.map(item=>({id:item.id,choices:domain.getTextbookChoices(unit,item)})))})
 }
}finally{await server.close()}
mkdirSync('e2e-evidence/chapter-runtime',{recursive:true})
const metadata={sourceSHA,executedHead:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),manifest}
writeFileSync('e2e-evidence/chapter-runtime/runtime-units.json',JSON.stringify({metadata,units},null,2))
for(const {code,sourceMap,unit}of units){
 writeFileSync('e2e-evidence/chapter-runtime/n'+code+'.json',JSON.stringify({metadata,sourceMap,unit},null,2))
 const lines=unit.sections.flatMap(s=>s.items.map(q=>[q.id,q.prompt,q.answer,q.hints.join(' / ')].join('\t')))
 writeFileSync('e2e-evidence/chapter-runtime/n'+code+'-hints.tsv',lines.join('\n')+'\n')
}
console.log(JSON.stringify({sourceSHA,executedHead:metadata.executedHead,validatedRuntimeUnits:units.length,items:units.reduce((n,x)=>n+x.unit.sections.reduce((s,y)=>s+y.items.length,0),0),sourceMarkers:units.map(x=>({code:x.code,originals:x.sourceMap?Object.keys(x.sourceMap).length:null,revision:x.unit.revision,items:x.unit.sections.reduce((s,y)=>s+y.items.length,0)}))},null,2))



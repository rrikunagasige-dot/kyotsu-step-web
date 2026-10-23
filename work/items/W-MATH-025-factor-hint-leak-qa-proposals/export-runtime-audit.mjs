import { createServer } from 'vite'
import { execFileSync } from 'node:child_process'
import { mkdirSync,writeFileSync } from 'node:fs'
const sourceSHA='fc27e7f5fbdc28345917276d43602ea4787537bd'
const expected={
  "src/data/textbook/math/numbers/n01Lesson.ts": "ed74537eeed63aca7a6f1c0347a173c2270fba06",
  "src/data/textbook/math/numbers/n02Lesson.ts": "c4935663ae96e04e4568268b8f23714890076d7e",
  "src/data/textbook/math/numbers/n03Lesson.ts": "4d45efb21ee431076c5cbd18e77f07ffdf0200c3",
  "src/data/textbook/math/numbers/n04Lesson.ts": "e7fad886acb80af3953ae06842b63dfb291506fb",
  "src/data/textbook/math/numbers/n05Lesson.ts": "ba143dd6fc5207f92f3278979ddcbdcbf6c41243",
  "src/data/textbook/math/numbers/n06Lesson.ts": "f4b3986a9309eef33752a7793d214d210aae85e5",
  "src/data/textbook/math/numbers/n07Lesson.ts": "b461265d233f47acba4cf7394661d23d5608d219",
  "src/data/textbook/math/numbers/n08Lesson.ts": "399243e722aadccd01a9970ca26beb3811f8bc81",
  "src/data/textbook/math/numbers/n09Lesson.ts": "fe387b76da2012aa88e171726addfd818895c715",
  "src/data/textbook/math/numbers/n10Lesson.ts": "e7498844e3fa7dcc4f7862e5ad6b25abb92cae67",
  "src/data/textbook/math/numbers/n11Lesson.ts": "48ea8421495227ea464b544d4c11b3bbdf1f3223",
  "src/data/textbook/math/numbers/n12Lesson.ts": "b53fd3d1673b8475de666dae2c9e5158a939fd3d",
  "src/data/textbook/math/numbers/n13Lesson.ts": "eabc2ce47f84d387bf6f7c7d21af55c61a634591",
  "src/data/textbook/math/numbers/n14Lesson.ts": "4c361178f172c8a03b8e86385b3f2a3217af145c",
  "src/domain/textbookSchema.ts": "10bcd4a96860214c8578f8d698c032e6e46a26ef",
  "src/data/textbook/math/numbers/reviewLessonHelpers.ts": "6bcb2907373cd8236cbdcc82e7982b215527badd",
  "src/data/textbook/math/numbers/newBatchGuidedSteps.ts": "d6e8edcb8bd4f41a184bfd241ed7f8db7d953be6",
  "src/data/textbook/math/numbers/n04BatchSupplement.ts": "d8cc8e96b7bcadba87969e16a5b9f71ad95659fc"
}
const manifest={}
for(const [path,blob] of Object.entries(expected)){
 const actual=execFileSync('git',['rev-parse','HEAD:'+path],{encoding:'utf8'}).trim()
 if(actual!==blob)throw Error('Frozen-source blob differs: '+path)
 manifest[path]=actual
}
const server=await createServer({server:{middlewareMode:true},appType:'custom'})
const units=[]
try {
 for(let n=1;n<=14;n++){
  const code=String(n).padStart(2,'0'),path='/src/data/textbook/math/numbers/n'+code+'Lesson.ts'
  const module=await server.ssrLoadModule(path)
  const unit=module['mathNumbersN'+code+'Unit']
  if(!unit||unit.unitId!=='math-numbers-expressions-n'+code)throw Error('Unit export mismatch '+path)
  const sourceMap=Object.entries(module).find(([name])=>/SourceToItemIds$/.test(name))?.[1]??null
  units.push({code,sourceMap,unit})
 }
}finally{await server.close()}
mkdirSync('e2e-evidence/chapter-audit',{recursive:true})
const metadata={sourceSHA,executedHead:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),manifest}
writeFileSync('e2e-evidence/chapter-audit/runtime-units.json',JSON.stringify({metadata,units},null,2))
for(const {code,sourceMap,unit}of units){
 writeFileSync('e2e-evidence/chapter-audit/n'+code+'.json',JSON.stringify({metadata,sourceMap,unit},null,2))
 const lines=unit.sections.flatMap(s=>s.items.map(q=>[q.id,q.prompt,q.answer,q.hints.join(' / ')].join('\t')))
 writeFileSync('e2e-evidence/chapter-audit/n'+code+'-hints.tsv',lines.join('\n')+'\n')
}
console.log(JSON.stringify({sourceSHA,executedHead:metadata.executedHead,validatedRuntimeUnits:units.length,items:units.reduce((n,x)=>n+x.unit.sections.reduce((s,y)=>s+y.items.length,0),0),sourceMarkers:units.map(x=>({code:x.code,originals:x.sourceMap?Object.keys(x.sourceMap).length:null,revision:x.unit.revision,items:x.unit.sections.reduce((s,y)=>s+y.items.length,0)}))},null,2))

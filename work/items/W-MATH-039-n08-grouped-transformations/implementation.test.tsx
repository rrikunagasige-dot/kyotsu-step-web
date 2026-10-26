import {it,expect,afterEach} from 'vitest'
import {renderToStaticMarkup} from 'react-dom/server'
import {MemoryRouter} from 'react-router-dom'
import {BaselineReader} from './BaselineReader'
import {N08SolutionReadingFlow} from '../../../src/components/textbook/N08SolutionReadingFlow'
import {TransformationReadingSchema,projectTransformationView} from '../../../src/domain/transformationReading'
import {validateTextbookUnits} from '../../../src/domain/textbookSchema'
import {type TextbookUnitProgress} from '../../../src/domain/textbook'
import data from '../../../src/data/textbook/math/numbers/n08Revision5.json'
import raw from '../../../src/data/textbook/math/numbers/n08Transformation.json'
const unit=validateTextbookUnits([data.unit])[0],compiled=TransformationReadingSchema.parse(raw)
afterEach(()=>localStorage.clear())
for(const stageIndex of [0,5,6,7,8,11])it('original fallback matches frozen pre-change reader at stage '+(stageIndex+1),()=>{
 localStorage.setItem('math-textbook-compact-v1:'+unit.unitId+':r5',String(stageIndex))
 const stageId=data.stages[stageIndex].id,prior=data.nodes.filter(n=>data.stages.findIndex(s=>s.id===n.stageId)<stageIndex&&n.interaction).map(n=>n.interaction)
 const progress={unitId:unit.unitId,unitRevision:5,startedAt:1,updatedAt:2,answers:Object.fromEntries(unit.sections[0].items.filter(i=>prior.includes(i.id)).map(i=>[i.id,{itemId:i.id,value:i.answer,firstValue:i.answer,resolved:true,isFirstCorrect:true,attemptCount:1,firstAnsweredAt:1,lastAnsweredAt:2}]))} as TextbookUnitProgress
 const props={unit,section:unit.sections[0],progress}
 const before=renderToStaticMarkup(<MemoryRouter><BaselineReader {...props}/></MemoryRouter>)
 const after=renderToStaticMarkup(<MemoryRouter><N08SolutionReadingFlow {...props} originalMathLayout/></MemoryRouter>).replace(' data-n08-layout="original"','')
 expect(after).toEqual(before);expect(after).toContain('math-textbook-stage-'+stageId)
})
it('TypeScript projection agrees with code for source boundaries and existing later records',async()=>{
 const {execFileSync}=await import('node:child_process')
 const output=JSON.parse(execFileSync(process.execPath,['--input-type=module','-e',"import fs from 'node:fs';import {projectTransformationView} from './tools/textbook/transformation/visible.mjs';const p=JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/n08Transformation.json'));console.log(JSON.stringify(projectTransformationView(p,['n08-07'],{stageId:'n08-stage-07',boundarySolvedNodeIds:['n08-q07-rule']})));"],{encoding:'utf8'}))
 expect(projectTransformationView(compiled,['n08-07'],{stageId:'n08-stage-07',boundarySolvedNodeIds:['n08-q07-rule']})).toEqual(output)
})

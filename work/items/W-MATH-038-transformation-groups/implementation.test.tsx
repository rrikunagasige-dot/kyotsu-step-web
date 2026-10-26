import {it,expect,afterEach} from 'vitest'
import {render,cleanup,fireEvent} from '@testing-library/react'
import {execFileSync} from 'node:child_process'
import fs from 'node:fs'
import {TransformationReadingSchema,projectTransformationView} from '../../../src/domain/transformationReading'
import {TransformationReadingGroup} from '../../../src/components/textbook/TransformationReadingGroup'
import {GuidedMathReadingFlow} from '../../../src/components/textbook/GuidedMathReadingFlow'
import {mathTextbookUnits} from '../../../src/data/textbook/math'
import type {TextbookUnitProgress} from '../../../src/domain/textbook'
import raw from '../../../src/data/textbook/math/numbers/n11Transformation.json'
import authored from '../../../src/data/textbook/math/numbers/n11Authored.json'
const compiled=TransformationReadingSchema.parse(raw),unit=mathTextbookUnits.find(u=>u.unitId===compiled.unitId)!
afterEach(()=>{cleanup();localStorage.clear()})
it('generated artifact exactly matches approved source adapter and current engine',()=>{execFileSync(process.execPath,['work/items/W-MATH-038-transformation-groups/materialize.mjs','--check']);expect(compiled.interactions).toHaveLength(5);expect(unit.revision).toBe(11);expect(unit.sections[0].items).toHaveLength(39)})
it('node and browser visible projections agree without answer metadata',()=>{
 const snapshots=JSON.parse(execFileSync(process.execPath,['--input-type=module','-e',"import fs from 'node:fs';import {projectTransformationView} from './tools/textbook/transformation/visible.mjs';const p=JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/n11Transformation.json'));console.log(JSON.stringify([[],p.interactions.slice(0,3).map(c=>c.id),p.interactions.map(c=>c.id)].map(s=>projectTransformationView(p,s))));"],{encoding:'utf8'}))
 for(const [i,solved]of [[],compiled.interactions.slice(0,3).map(c=>c.id),compiled.interactions.map(c=>c.id)].entries())expect(projectTransformationView(compiled,solved)).toEqual(snapshots[i])
})
it('fraction blank is one valid button and no split LaTeX fragment',()=>{
 const solved=compiled.interactions.slice(0,3).map(c=>c.id),g=projectTransformationView(compiled,solved).groups[0],selected:string[]=[]
 const v=render(<TransformationReadingGroup group={g} renderSlot={id=><button onClick={()=>selected.push(id)}>選択</button>} renderPanel={()=>null}/>);
 expect(v.container.querySelectorAll('.katex-error')).toHaveLength(0);expect(v.container.querySelectorAll('.transformation-fraction')).toHaveLength(1)
 fireEvent.click(v.getByRole('button',{name:'選択'}));expect(selected).toEqual(['n11-q06-operation']);expect(v.container.querySelector('[data-state-ref="S4"]')).toBeNull()
})
function priorStage(){const ids=authored.nodes.filter(n=>Number(n.stageId.slice(-2))<5&&n.interaction).map(n=>n.interaction);return {unitId:unit.unitId,unitRevision:11,startedAt:1,updatedAt:2,answers:Object.fromEntries(unit.sections[0].items.filter(i=>ids.includes(i.id)).map(i=>[i.id,{itemId:i.id,value:i.answer,firstValue:i.answer,resolved:true,isFirstCorrect:true,attemptCount:1,firstAnsweredAt:1,lastAnsweredAt:2}]))} as TextbookUnitProgress}
it('N11 opts in only two stages, preserves original as selectable input and hides future divisor',()=>{
 const progress=priorStage(),v=render(<GuidedMathReadingFlow transformationPresentation={raw} presentation={authored} unit={unit} section={unit.sections[0]} progress={progress}/>);
 expect(v.container.querySelectorAll('[data-transformation-group]')).toHaveLength(1);expect(v.container.querySelector('[data-transformation-row="n11-tg-divisor"]')).toBeNull();expect(v.container.querySelector('[data-transformation-row="n11-tg-final"]')).toBeNull();expect(v.container.querySelector('[data-node-id="n11-solve-problem"]')).toBeNull()
 v.rerender(<GuidedMathReadingFlow presentation={authored} unit={unit} section={unit.sections[0]} progress={progress}/>);expect(v.container.querySelectorAll('[data-transformation-group]')).toHaveLength(0);expect(v.container.querySelector('[data-node-id="n11-solve-problem"]')).not.toBeNull()
})
it('unchanged N08 r4/r5 and original N11 source remain byte-identical to approved base',()=>{
 for(const p of ['src/data/textbook/math/numbers/n11Authored.json','src/data/textbook/math/numbers/n08Authored.json','src/data/textbook/math/numbers/n08Revision5.json','src/components/textbook/N08ReadingFlow.tsx','src/components/textbook/N08SolutionReadingFlow.tsx'])expect(fs.readFileSync(p)).toEqual(execFileSync('git',['show','f297503b574e92f1d2f120f9f9d09d7da6cd0af9:'+p]))
})

it('legacy later answers remain stored while new prerequisite questions are visible',()=>{const progress=priorStage();for(const id of ['n11-05','n11-06']){const i=unit.sections[0].items.find(i=>i.id===id)!;progress.answers[id]={itemId:id,value:i.answer,firstValue:'legacy-first',resolved:true,isFirstCorrect:false,attemptCount:2,firstAnsweredAt:1,lastAnsweredAt:2}}const before=structuredClone(progress);const v=render(<GuidedMathReadingFlow transformationPresentation={raw} presentation={authored} unit={unit} section={unit.sections[0]} progress={progress}/>);expect(v.getByTestId('textbook-item-n11-wm017-q05-operation')).toBeDefined();expect(v.container.querySelector('[data-state-ref="S4"]')).toBeNull();expect(progress).toEqual(before)})

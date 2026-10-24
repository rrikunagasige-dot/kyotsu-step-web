import { describe,it,expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { validateTextbookUnits } from '../../../src/domain/textbookSchema'
import katex from 'katex'
// Tool modules are intentionally isolated from the learner TypeScript build.
// @ts-expect-error Node authoring module has no runtime declaration dependency.
import { authorN07 } from '../fixtures/n07-author.mjs'
// @ts-expect-error Node authoring module has no runtime declaration dependency.
import { compileLesson } from '../compile-lesson.mjs'
const source=JSON.parse(readFileSync('tools/textbook/fixtures/n07-source-index.json','utf8'))
describe('candidate compiler against actual accepted app schema',()=>{
 it('accepts all generated items, blocks and figure references without changing runtime schema',()=>{
  const result=compileLesson(authorN07(source))
  const [unit]=validateTextbookUnits([result.unit])
  expect(unit.sections.flatMap(s=>s.items)).toHaveLength(36)
  expect(result.publishable).toBe(false)
  expect(result.integrationStatus).toBe('NOT_REGISTERED')
  const formulas=unit.sections.flatMap(s=>s.readingFlow.filter(b=>b.type==='formula'))
  expect(new Set(result.renderPlan.map((r:{equationId:string})=>r.equationId))).toEqual(new Set(formulas.map(b=>b.id)))
  expect(unit.sections[0].readingFlow.some(b=>b.type==='marker'&&b.kind==='proof')).toBe(true)
 })
 it('renders every formula and every formula candidate with installed KaTeX',()=>{
  const plan=authorN07(source)
  for(const n of plan.nodes){
   const formulas=[n.inputLatex,n.outputLatex,n.interaction?.prefixLatex,n.interaction?.suffixLatex]
   if(n.interaction?.answerType==='formula')formulas.push(...n.interaction.choices)
   for(const latex of formulas.filter(Boolean)){
    expect(()=>katex.renderToString(latex,{throwOnError:true,strict:'error'}),n.id+': '+latex).not.toThrow()
    expect(latex).not.toContain('\\boxed')
   }
  }
 })
 it('does not duplicate an answered equation as a second output formula',()=>{
  const result=compileLesson(authorN07(source));const flow=result.unit.sections[0].readingFlow;
  const matching=flow.filter((b:{id:string})=>b.id==='n07-q11-factor-ten-output');
  expect(matching).toHaveLength(1);expect(matching[0].parts.some((p:{type:string})=>p.type==='choice')).toBe(true);
 })
 it('preserves accepted meaning for the two retained old response IDs',async()=>{
  const { mathNumbersN07Unit }=await import('../../../src/data/textbook/math/numbers/n07Lesson')
  const current=mathNumbersN07Unit.sections.flatMap(s=>s.items)
  const generated=compileLesson(authorN07(source)).unit.sections.flatMap((s:{items:unknown[]})=>s.items) as {id:string;answer:string;choices:string[]}[]
  for(const id of ['n07-10','n07-14']){
   const old=current.find(q=>q.id===id)!;const next=generated.find(q=>q.id===id)!
   expect(next.answer).toBe(old.answer)
   expect(next.choices).toEqual(old.choices)
  }
 })
})

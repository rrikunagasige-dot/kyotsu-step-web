import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { N08ReadingFlow } from '../../../src/components/textbook/N08ReadingFlow'
import { mathNumbersN08Unit as unit, n08Presentation as data, n08SourceToItemIds } from '../../../src/data/textbook/math/numbers/n08Lesson'
import { mathNumbersN08Unit as oldUnit } from '../../../src/test/n08Legacy'
import { answerTextbookItem, effectiveTextbookProgress, textbookUnitProgress, type TextbookUnitProgress } from '../../../src/domain/textbook'
const key='math-textbook-compact-v1:'+unit.unitId+':r4'
const html=(progress: TextbookUnitProgress | undefined, stage: number)=>{
  localStorage.setItem(key,String(stage))
  return renderToStaticMarkup(<N08ReadingFlow unit={unit} section={unit.sections[0]} progress={progress} />)
}
describe('approved N08 materialization and saved work',()=>{
  it('reproduces the exact approved IR and retains all twelve original answers',()=>{
    execFileSync(process.execPath,['work/items/W-MATH-033-n08-absolute-value/materialize.mjs','--check'])
    expect(data.irHash).toBe(JSON.parse(readFileSync('work/items/W-MATH-033-n08-absolute-value/APPROVAL.json','utf8')).contentDesignHash)
    expect(unit.sections[0].items).toHaveLength(31)
    expect(data.nodes).toHaveLength(36)
    expect(data.stages).toHaveLength(12)
    expect(Object.values(n08SourceToItemIds).flat()).toEqual(unit.sections[0].items.map(i=>i.id))
    for(const old of oldUnit.sections[0].items) expect(unit.sections[0].items.find(i=>i.id===old.id)?.answer).toBe(old.answer)
  })
  it.each([1,2,3])('archives v%i with attempts, first values and completed time; invents no intermediate answers',revision=>{
    let old: TextbookUnitProgress | undefined
    for(const i of oldUnit.sections[0].items){old=answerTextbookItem(old,oldUnit,i,i.choices!.find(x=>x!==i.answer)!,100);old=answerTextbookItem(old,oldUnit,i,i.answer,200)}
    old={...old!,unitRevision:revision};const snapshot=structuredClone(old)
    const next=effectiveTextbookProgress(unit,old)!
    expect(next.answers).toEqual(old.answers)
    expect(next.archivedRevisions?.[String(revision)].answers).toEqual(old.answers)
    expect(next.previousRevisionCompletedAt).toBe(200)
    expect(next.completedAt).toBeUndefined()
    expect(textbookUnitProgress(unit,next).completed).toBe(12)
    expect(effectiveTextbookProgress(unit,next)).toBe(next)
    const before=html(next,11)
    expect(before).toContain('math-textbook-stage-n08-stage-01')
    expect(before).toContain('textbook-item-n08-q01-left-answer')
    expect(before).not.toContain('data-testid="n08-complete"')
    let done=next
    for(const i of unit.sections[0].items) if(!done.answers[i.id]) done=answerTextbookItem(done,unit,i,i.answer,300)
    expect(textbookUnitProgress(unit,done).completed).toBe(31)
    expect(done.completedAt).toBe(300)
    expect(done.archivedRevisions).toEqual(next.archivedRevisions)
    expect(old).toEqual(snapshot)
  })
  it('renders all36 nodes before and after answers; hides future states and keeps conditional records',()=>{
    let progress: TextbookUnitProgress | undefined
    for(const n of data.nodes){
      const stage=data.stages.findIndex(s=>s.id===n.stageId)
      const before=html(progress,stage)
      expect(before).not.toContain('katex-error')
      if(n.interaction){
        expect(before).toContain('textbook-item-'+n.interaction)
        const i=unit.sections[0].items.find(i=>i.id===n.interaction)!
        progress=answerTextbookItem(progress,unit,i,i.choices!.find(x=>x!==i.answer)!,100)
        expect(progress.answers[i.id].resolved).toBe(false)
        progress=answerTextbookItem(progress,unit,i,i.answer,200)
      }
      const after=html(progress,stage)
      expect(after).not.toContain('katex-error')
      if(n.interaction) expect(after).not.toContain('data-block-id="'+n.id+'-interaction')
    }
    expect(html(progress,11)).toContain('data-testid="n08-complete"')
    expect(html(progress,6)).toContain('n08-cases-table')
  })
})

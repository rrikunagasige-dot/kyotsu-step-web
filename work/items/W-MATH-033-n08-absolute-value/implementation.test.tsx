import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { render, fireEvent, screen, cleanup } from '@testing-library/react'
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
    old={...old!,unitRevision:revision}
    if(revision<3)old.answers['n08-10']={...old.answers['n08-10'],value:'a=0',firstValue:'a=0',isFirstCorrect:true,attemptCount:1}
    if(revision===1)old.answers['n08-05']={...old.answers['n08-05'],value:'\\sqrt5<3',firstValue:'\\sqrt5<3',isFirstCorrect:true,attemptCount:1}
    const snapshot=structuredClone(old)
    const next=effectiveTextbookProgress(unit,old)!
    const retired=new Set(revision===1?['n08-05','n08-10']:revision===2?['n08-10']:[])
    expect(next.answers).toEqual(Object.fromEntries(Object.entries(old.answers).filter(([id])=>!retired.has(id))))
    for(const id of retired)expect(next.answers[id]).toBeUndefined()
    expect(next.archivedRevisions?.[String(revision)].answers).toEqual(old.answers)
    expect(next.previousRevisionCompletedAt).toBe(200)
    expect(next.completedAt).toBeUndefined()
    expect(textbookUnitProgress(unit,next).completed).toBe(12-retired.size)
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
  it('keeps implications and equivalence between complete conditions, apart from equality transformations',()=>{
    let progress: TextbookUnitProgress | undefined
    for(const i of unit.sections[0].items) progress=answerTextbookItem(progress,unit,i,i.answer,200)
    const doc=new DOMParser().parseFromString(html(progress,9),'text/html')
    const equivalence=[...doc.querySelectorAll('[data-logical-relation]')].find(n=>n.getAttribute('data-logical-relation')==='\\Leftrightarrow')!
    expect(equivalence).toBeDefined()
    const conditions=equivalence.querySelectorAll('.reading-formula-line')
    expect(conditions).toHaveLength(2)
    const latex=(n:Element)=>[...n.querySelectorAll('annotation')].map(x=>x.textContent).join('')
    expect(latex(conditions[0])).toBe('|a|=0')
    expect(latex(conditions[1])).toBe('a=0')
    expect(latex(equivalence.querySelector('.n08-logical-arrow')!)).toBe('\\Updownarrow')
  })
  it('opens a saved retired wrong option without losing its original attempts or crashing feedback',()=>{
    localStorage.setItem(key,'0')
    const item=unit.sections[0].items.find(i=>i.id==='n08-01')!
    const retired='2.3,\\quad-5.0'
    const record={itemId:item.id,value:retired,firstValue:retired,isFirstCorrect:false,resolved:false,attemptCount:1,firstAnsweredAt:1,lastAnsweredAt:2}
    const old:TextbookUnitProgress={unitId:unit.unitId,unitRevision:3,startedAt:1,updatedAt:2,answers:{[item.id]:record}}
    let next=effectiveTextbookProgress(unit,old)!
    const first=unit.sections[0].items[0]
    next=answerTextbookItem(next,unit,first,first.answer,3)
    try{
      render(<N08ReadingFlow unit={unit} section={unit.sections[0]} progress={next} />)
      fireEvent.click(screen.getByTestId('textbook-item-'+item.id))
      expect(screen.getByTestId('textbook-hint-'+item.id).textContent).toContain(item.hints[0])
      expect(screen.getByTestId('inline-choice-panel-'+item.id).querySelectorAll('button')).toHaveLength(4)
    }finally{cleanup()}
    const done=answerTextbookItem(next,unit,item,item.answer,4)
    expect(done.answers[item.id].firstValue).toBe(retired)
    expect(done.answers[item.id].attemptCount).toBe(2)
    expect(done.archivedRevisions?.['3'].answers[item.id]).toEqual(record)
  })
})

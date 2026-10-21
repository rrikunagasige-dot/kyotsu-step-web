import { describe, expect, it } from 'vitest'
import { mathNumbersN11Unit, n11SourceToItemIds } from './n11Lesson'
import { effectiveTextbookProgress, getTextbookChoices, type TextbookAnswerRecord, type TextbookUnitProgress } from '../../../../domain/textbook'

const lesson = mathNumbersN11Unit
const section = lesson.sections[0]
const at = (id: string) => section.readingFlow.findIndex(b => b.id === id)
const item = (id: string) => section.items.find(i => i.id === id)!

describe('W-MATH-017/P-003 prose integration / preserved progress', () => {
  it('integrates Q01 relation choice directly inside the sentence', () => {
    expect(lesson.revision).toBe(7)
    const block = section.readingFlow[at('n11-formula-01')]
    expect(block.type).toBe('paragraph')
    if (block.type !== 'paragraph') return
    expect(block.parts.filter(p => p.type === 'choice')).toEqual([{type:'choice',itemId:'n11-01'}])
    expect(block.parts.filter(p => p.type === 'math').map(p => p.latex)).toEqual(['(-2)','(-5)'])
    expect(item('n11-01').answer).toBe('>')
    expect(item('n11-01').choices).toEqual(['>','<','=','\\le'])
    expect(getTextbookChoices(lesson,item('n11-01'))).toHaveLength(4)
    expect(JSON.stringify(block)).not.toContain('mathrel{?}')
  })
  it('grades Q05 operation and the real 5+2 arithmetic separately in prose', () => {
    expect(n11SourceToItemIds['N11-Q05']).toEqual(['n11-wm017-q05-operation','n11-05'])
    expect(at('n11-formula-05')).toBeGreaterThan(at('n11-lead-05'))
    expect(at('n11-after-05')).toBeGreaterThan(at('n11-formula-05'))
    expect(at('n11-lead-06')).toBeGreaterThan(at('n11-after-05'))
    for(const id of ['n11-lead-05','n11-formula-05'])
      expect(section.readingFlow[at(id)].type).toBe('paragraph')
    const beforeOperation=JSON.stringify(section.readingFlow.slice(0,at('n11-lead-05')+1))
    expect(beforeOperation).not.toContain('3x-2+2<5+2')
    expect(beforeOperation).not.toContain('3x<7')
    const beforeResult=JSON.stringify(section.readingFlow.slice(0,at('n11-formula-05')+1))
    expect(beforeResult).not.toContain('3x<7')
    expect(item('n11-wm017-q05-operation').answer).toBe('2')
    expect(item('n11-wm017-q05-operation').choices).toHaveLength(4)
    expect(item('n11-05').answer).toBe('7')
    expect(item('n11-05').choices).toHaveLength(4)
    expect(section.items.map(i=>i.id)).toEqual(Object.values(n11SourceToItemIds).flat())
    expect(section.items).toHaveLength(24)
    expect(item('n11-06').answer).toContain('x<\\frac73')
  })
  const record=(id:string,value:string):TextbookAnswerRecord=>({
    itemId:id,value,firstValue:value,isFirstCorrect:true,resolved:true,
    attemptCount:1,firstAnsweredAt:100,lastAnsweredAt:200,
  })
  it('preserves complete revision6 answers and reopens only old Q01/Q05 grading semantics',()=>{
    const old:TextbookUnitProgress={
      unitId:lesson.unitId,unitRevision:6,startedAt:50,updatedAt:200,completedAt:210,
      answers:{
        'n11-01':record('n11-01','-2>-5'),
        'n11-05':record('n11-05','old compound choice'),
        'n11-06':record('n11-06',item('n11-06').answer),
        'n11-wm012-q11-expand':record('n11-wm012-q11-expand','6x+9'),
      },
    }
    const now=effectiveTextbookProgress(lesson,old)!
    expect(now.unitRevision).toBe(7)
    expect(now.answers['n11-01']).toBeUndefined()
    expect(now.answers['n11-05']).toBeUndefined()
    expect(now.answers['n11-wm017-q05-operation']).toBeUndefined()
    expect(now.answers['n11-06']).toEqual(old.answers['n11-06'])
    expect(now.answers['n11-wm012-q11-expand']).toEqual(old.answers['n11-wm012-q11-expand'])
    expect(now.archivedRevisions?.['6']?.answers).toEqual(old.answers)
    expect(now.archivedRevisions?.['6']?.completedAt).toBe(210)
    expect(now.previousRevisionCompletedAt).toBe(210)
    expect(now.completedAt).toBeUndefined()
    expect(effectiveTextbookProgress(lesson,now)).toBe(now)
  })
  it('chains the approved historical migrations when starting from revision3',()=>{
    const old:TextbookUnitProgress={
      unitId:lesson.unitId,unitRevision:3,startedAt:50,updatedAt:200,
      answers:{
        'n11-01':record('n11-01','-2>-5'),
        'n11-02':record('n11-02','b-a'),
        'n11-05':record('n11-05','old compound choice'),
      },
    }
    const now=effectiveTextbookProgress(lesson,old)!
    expect(now.unitRevision).toBe(7)
    expect(now.archivedRevisions?.['3']).toBeDefined()
    expect(now.archivedRevisions?.['6']).toBeDefined()
    expect(now.answers['n11-02']).toEqual(old.answers['n11-02'])
    expect(now.answers['n11-01']).toBeUndefined()
    expect(now.answers['n11-05']).toBeUndefined()
  })
})

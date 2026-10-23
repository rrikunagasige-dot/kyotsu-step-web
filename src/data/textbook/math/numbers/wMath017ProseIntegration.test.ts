import { describe, expect, it } from 'vitest'
import { mathNumbersN11Unit, n11SourceToItemIds } from './n11Lesson'
import { effectiveTextbookProgress, getTextbookChoices, type TextbookAnswerRecord, type TextbookUnitProgress } from '../../../../domain/textbook'

const lesson=mathNumbersN11Unit
const section=lesson.sections[0]
const index=(id:string)=>section.readingFlow.findIndex(block=>block.id===id)
const item=(id:string)=>section.items.find(entry=>entry.id===id)!

describe('W-MATH-017 P-005/P-006 — four-line continuous formula derivation with interstitial reasons',()=>{
  const chain=['n11-lead-05','n11-formula-05','n11-after-05','n11-formula-06']
  it('preserves Q01 correct signed-number relation while retaining original figure',()=>{
    expect(lesson.revision).toBe(10)
    const b=section.readingFlow[index('n11-formula-01')]
    expect(b.type).toBe('paragraph')
    if(b.type!=='paragraph')return
    expect(b.parts.filter(p=>p.type==='choice')).toEqual([{type:'choice',itemId:'n11-01'}])
    expect(b.parts.filter(p=>p.type==='math').map(p=>p.latex)).toEqual(['(-2)','(-5)'])
    expect(item('n11-01').answer).toBe('>')
    expect(getTextbookChoices(lesson,item('n11-01'))).toHaveLength(2)
  })
  it('renders exactly four ordered formula rows in a single derivation, not prose cards',()=>{
    expect(index('n11-marker-2')).toBe(-1)
    const indices=chain.map(index)
    expect(indices.every(i=>i>=0)).toBe(true)
    expect(indices).toEqual([indices[0],indices[0]+1,indices[0]+3,indices[0]+5])
    const explanation1=section.readingFlow[indices[0]+2]
    const explanation2=section.readingFlow[indices[0]+4]
    expect(explanation1).toEqual({
      id:'n11-p006-q05-cancel-explain',type:'paragraph',
      derivationId:'n11-q05-q06-chain',parts:[{type:'text',text:'両辺に同じ数を足しても、不等号の向きは変わらない。左辺では−2と＋2が打ち消し合う。'}],
    })
    expect(explanation2).toEqual({
      id:'n11-p006-q06-positive-explain',type:'paragraph',
      derivationId:'n11-q05-q06-chain',parts:[{type:'text',text:'xの係数は正の3なので、両辺を3で割っても不等号の向きは変わらない。'}],
    })
    expect(section.readingFlow.slice(indices[0],indices[3]+1).map(b=>b.type))
      .toEqual(['formula','formula','paragraph','formula','paragraph','formula'])
    const bs=indices.map(i=>section.readingFlow[i])
    expect(bs.every(b=>b.type==='formula'&&b.derivationId==='n11-q05-q06-chain')).toBe(true)
    const formulaBlocks=bs.map(b=>{if(b.type!=='formula')throw Error('derivation includes non-formula block');return b})
    expect(formulaBlocks.map(b=>b.parts.filter(p=>p.type==='math').map(p=>p.latex))).toEqual([
      ['3x-2<5'],['3x-2+','<5+'],['3x<'],['x<'],
    ])
    expect(formulaBlocks.map(b=>b.parts.filter(p=>p.type==='choice').map(p=>p.itemId))).toEqual([
      [],['n11-wm017-q05-operation','n11-wm017-q05-balance'],['n11-05'],['n11-06'],
    ])
    expect(index('n11-lead-06')).toBe(-1)
    expect(index('n11-after-06')).toBe(indices[3]+1)
    expect(section.readingFlow[index('n11-after-06')]).toEqual({id:'n11-after-06',type:'paragraph',parts:[{type:'text',text:'求めたのは一つの値ではなく、不等式を満たす実数の範囲である。境界の値を元の式に代入して、含まれるか確かめよう。'}]})
    const prefix=JSON.stringify(section.readingFlow.slice(0,index('n11-formula-05')+1))
    expect(prefix).not.toContain('3x<7')
    expect(prefix).not.toContain('x<\\frac73')
    expect(section.items.map(i=>i.id)).toEqual(Object.values(n11SourceToItemIds).flat())
    expect(section.items).toHaveLength(31)
    expect(n11SourceToItemIds['N11-Q05']).toEqual(['n11-wm017-q05-operation','n11-wm017-q05-balance','n11-05'])
    expect((n11SourceToItemIds as Record<string,readonly string[]>)['N11-Q06']).toEqual(['n11-06'])
    expect([item('n11-wm017-q05-operation').answer,item('n11-wm017-q05-balance').answer,item('n11-05').answer,item('n11-06').answer])
      .toEqual(['2','2','7','\\frac73'])
    expect(section.readingFlow[index('n11-lead-07')]).toBeDefined()
  })
  const record=(id:string,value:string):TextbookAnswerRecord=>({
    itemId:id,value,firstValue:value,isFirstCorrect:true,resolved:true,
    attemptCount:1,firstAnsweredAt:100,lastAnsweredAt:200,
  })
  it('preserves v7 complete answers and reopens ONLY Q06 changed key in revision8',()=>{
    const old:TextbookUnitProgress={
      unitId:lesson.unitId,unitRevision:7,startedAt:50,updatedAt:200,completedAt:210,
      answers:{
        'n11-01':record('n11-01','>'),
        'n11-wm017-q05-operation':record('n11-wm017-q05-operation','2'),
        'n11-05':record('n11-05','7'),
        'n11-06':record('n11-06','\\text{両辺を正の}3\\text{で割る},\\quad x<\\frac73'),
        'n11-wm012-q11-expand':record('n11-wm012-q11-expand','6x+9'),
      },
    }
    const now=effectiveTextbookProgress({...lesson,revision:8},old)!
    expect(now.unitRevision).toBe(8)
    expect(now.answers['n11-01']).toEqual(old.answers['n11-01'])
    expect(now.answers['n11-wm017-q05-operation']).toEqual(old.answers['n11-wm017-q05-operation'])
    expect(now.answers['n11-05']).toEqual(old.answers['n11-05'])
    expect(now.answers['n11-06']).toBeUndefined()
    expect(now.answers['n11-wm017-q05-balance']).toBeUndefined()
    expect(now.answers['n11-wm012-q11-expand']).toEqual(old.answers['n11-wm012-q11-expand'])
    expect(now.archivedRevisions?.['7']?.answers).toEqual(old.answers)
    expect(now.archivedRevisions?.['7']?.completedAt).toBe(210)
    expect(now.previousRevisionCompletedAt).toBe(210)
    expect(now.completedAt).toBeUndefined()
    expect(effectiveTextbookProgress({...lesson,revision:8},now)).toBe(now)
  })
  it('chains rev3→7→8, keeping all prior archives and unaffected proof decisions',()=>{
    const old:TextbookUnitProgress={
      unitId:lesson.unitId,unitRevision:3,startedAt:50,updatedAt:200,
      answers:{
        'n11-01':record('n11-01','-2>-5'),
        'n11-02':record('n11-02','b-a'),
        'n11-05':record('n11-05','old compound choice'),
        'n11-06':record('n11-06','old compound fraction'),
      },
    }
    const now=effectiveTextbookProgress({...lesson,revision:8},old)!
    expect(now.unitRevision).toBe(8)
    expect(now.archivedRevisions?.['3']).toBeDefined()
    expect(now.archivedRevisions?.['6']).toBeDefined()
    expect(now.archivedRevisions?.['7']).toBeDefined()
    expect(now.answers['n11-02']).toEqual(old.answers['n11-02'])
    for(const id of ['n11-01','n11-05','n11-06','n11-wm017-q05-balance'])expect(now.answers[id]).toBeUndefined()
  })
})

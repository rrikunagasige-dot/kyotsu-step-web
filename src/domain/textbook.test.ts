// Historical edition regression; current-theme coverage lives in firstThemeRepair.test.ts.
import { firstThemeBaseline } from '../test/firstThemeBaseline'
import { describe, expect, it, vi } from 'vitest'
import { builtInTextbookUnits } from '../data/textbookUnits'
import {
  answerTextbookItem,
  effectiveTextbookProgress,
  getTextbookChoices,
  groupTextbookUnitsByChapter,
  isTextbookAnswerCorrect,
  isTextbookItemResolved,
  normalizeTextbookAnswer,
  resetTextbookUnitProgress,
  textbookUnitProgress,
  type TextbookUnitProgress,
} from './textbook'

import { mathNumbersN12LegacyUnit as mathNumbersN12Unit } from '../data/textbook/math/numbers/n12Lesson'
import { mathNumbersN01Unit as current_mathNumbersN01Unit, n01R2SourceMap as n01SourceToItemIds } from '../data/textbook/math/numbers/n01Lesson'
import { mathNumbersN03Unit as current_mathNumbersN03Unit, n03SourceToItemIds } from '../data/textbook/math/numbers/n03Lesson'
import { mathNumbersN09Unit } from '../test/n09Legacy'
const mathNumbersN01Unit = firstThemeBaseline(current_mathNumbersN01Unit)

const mathNumbersN03Unit = firstThemeBaseline(current_mathNumbersN03Unit)


const unit = builtInTextbookUnits[0]
const firstItem = unit.sections[0].items[0]
const formulaItem = unit.sections[0].items.find((item) => item.id === 'a6')!

describe('textbook learning state', () => {
  it('groups published textbook units into ordered chapters', () => {
    const publishedUnits = builtInTextbookUnits.filter((candidate) => candidate.status === 'published')
    const chapters = groupTextbookUnitsByChapter(publishedUnits)
    expect(chapters).toHaveLength(2)
    expect(chapters[0]).toMatchObject({
      chapterId: 'physics-ch01-motion',
      chapterNumber: '1',
      chapterTitle: '物体の運動',
    })
    expect(chapters[0].units.map((candidate) => candidate.chapter?.unitCode)).toEqual(['1A', '1B', '1C', '1D', '1E', '1F', '1G'])
    expect(chapters[1]).toMatchObject({
      chapterId: 'math-ch03-sets-propositions',
      chapterNumber: '3',
      chapterTitle: '集合と命題',
    })
    expect(chapters[1].units.map((candidate) => candidate.unitId)).toEqual(['math-sets'])
  })

  it('normalizes spacing, unicode minus and vector marks for formula entry', () => {
    expect(normalizeTextbookAnswer(' r₂ − r₁ ')).toBe(normalizeTextbookAnswer('r2-r1'))
    expect(isTextbookAnswerCorrect(formulaItem, formulaItem.answer.replace(/ /g, ''))).toBe(true)
  })

  it('builds stable scaffolded options while preserving the correct answer', () => {
    const choices = getTextbookChoices(unit, firstItem)
    expect(firstItem.scaffoldLevel).toBe('strong')
    expect(choices).toContain(firstItem.answer)
    expect(choices).toHaveLength(2)
    expect(getTextbookChoices(unit, firstItem)).toEqual(choices)

    const medium = builtInTextbookUnits.flatMap((candidate) => candidate.sections[0].items)
      .find((item) => item.scaffoldLevel === 'medium')!
    const light = builtInTextbookUnits.flatMap((candidate) => candidate.sections[0].items)
      .find((item) => item.scaffoldLevel === 'light')!
    const mediumUnit = builtInTextbookUnits.find((candidate) => candidate.sections[0].items.some((item) => item.id === medium.id))!
    const lightUnit = builtInTextbookUnits.find((candidate) => candidate.sections[0].items.some((item) => item.id === light.id))!

    expect(getTextbookChoices(mediumUnit, medium)).toHaveLength(3)
    expect(getTextbookChoices(lightUnit, light)).toHaveLength(4)
    expect(getTextbookChoices(mediumUnit, medium)).toContain(medium.answer)
    expect(getTextbookChoices(lightUnit, light)).toContain(light.answer)
  })

  it('keeps a wrong choice unresolved and resolves only after a correct retry', () => {
    const wrong = firstItem.choices!.find((choice) => choice !== firstItem.answer)!
    const wrongProgress = answerTextbookItem(undefined, unit, firstItem, wrong, 1000)
    const wrongRecord = wrongProgress.answers[firstItem.id]

    expect(wrongRecord.isFirstCorrect).toBe(false)
    expect(wrongRecord.firstValue).toBe(wrong)
    expect(wrongRecord.value).toBe(wrong)
    expect(wrongRecord.resolved).toBe(false)
    expect(wrongRecord.attemptCount).toBe(1)
    expect(isTextbookItemResolved(firstItem, wrongRecord)).toBe(false)
    expect(textbookUnitProgress(unit, wrongProgress).completed).toBe(0)

    const correctedProgress = answerTextbookItem(wrongProgress, unit, firstItem, firstItem.answer, 2000)
    const correctedRecord = correctedProgress.answers[firstItem.id]

    expect(correctedRecord.isFirstCorrect).toBe(false)
    expect(correctedRecord.firstValue).toBe(wrong)
    expect(correctedRecord.value).toBe(firstItem.answer)
    expect(correctedRecord.resolved).toBe(true)
    expect(correctedRecord.attemptCount).toBe(2)
    expect(isTextbookItemResolved(firstItem, correctedRecord)).toBe(true)
    expect(textbookUnitProgress(unit, correctedProgress).completed).toBe(1)
  })

  it('ignores stale progress when the textbook revision changes', () => {
    const stale = {
      unitId: unit.unitId,
      unitRevision: unit.revision - 1,
      startedAt: 10,
      updatedAt: 20,
      answers: {
        [firstItem.id]: {
          itemId: firstItem.id,
          value: firstItem.answer,
          firstValue: firstItem.answer,
          isFirstCorrect: true,
          resolved: true,
          attemptCount: 1,
          firstAnsweredAt: 10,
          lastAnsweredAt: 20,
        },
      },
    }

    expect(textbookUnitProgress(unit, stale).completed).toBe(0)

    const refreshed = answerTextbookItem(stale, unit, firstItem, firstItem.answer, 1000)
    expect(refreshed.unitRevision).toBe(unit.revision)
    expect(refreshed.startedAt).toBe(1000)
    expect(Object.keys(refreshed.answers)).toEqual([firstItem.id])
  })

  it('rejects resolved-wrong records while preserving first-correct records', () => {
    const wrong = firstItem.choices!.find((choice) => choice !== firstItem.answer)!
    const legacyWrong = {
      itemId: firstItem.id,
      value: wrong,
      firstValue: wrong,
      isFirstCorrect: false,
      resolved: true,
      attemptCount: 1,
      firstAnsweredAt: 1,
      lastAnsweredAt: 1,
    }
    const legacyCorrect = {
      ...legacyWrong,
      value: firstItem.answer,
      firstValue: firstItem.answer,
      isFirstCorrect: true,
    }

    expect(isTextbookItemResolved(firstItem, legacyWrong)).toBe(false)
    expect(isTextbookItemResolved(firstItem, legacyCorrect)).toBe(true)
  })
})


describe('N12 P-003 revision-3 start-over with historical archive', () => {
  const lesson = mathNumbersN12Unit
  const getItem = (id: string) => lesson.sections[0].items.find(item => item.id === id)!
  const oldAnswer = (id: string, value: string, resolved = true) => ({
    itemId: id, value, firstValue: value, isFirstCorrect: resolved, resolved,
    attemptCount: resolved ? 1 : 2, firstAnsweredAt: 100, lastAnsweredAt: 200,
  })
  const oldProgress = (revision: 1 | 2): TextbookUnitProgress => ({
    unitId: lesson.unitId,
    unitRevision: revision,
    startedAt: 50,
    updatedAt: 200,
    completedAt: 300,
    ...(revision === 2 ? { migratedFromRevision: 1, previousRevisionCompletedAt: 280 } : {}),
    answers: {
      'n12-01': oldAnswer('n12-01', getItem('n12-01').answer),
      'n12-01a': oldAnswer('n12-01a', '-7<2x'),
      'n12-02': oldAnswer('n12-02', getItem('n12-02').answer),
      'n12-03': oldAnswer('n12-03', '一つ目を満たすから適する', false),
      ...(revision === 2 ? { 'n12-p002-q01-coef': oldAnswer('n12-p002-q01-coef', '2') } : {}),
    },
  })

  it.each([1, 2] as const)('archives every v%d answer and presents zero of 35 as complete', (revision) => {
    const previous = oldProgress(revision)
    const projection = effectiveTextbookProgress(lesson, previous)!
    expect(projection.unitRevision).toBe(3)
    expect(projection.migratedFromRevision).toBe(revision)
    expect(projection.completedAt).toBeUndefined()
    expect(projection.answers).toEqual({})
    expect(projection.archivedRevisions?.[revision].answers).toEqual(previous.answers)
    expect(projection.archivedRevisions?.[revision].completedAt).toBe(300)
    expect(projection.archivedRevisions?.[revision].answers['n12-03'].attemptCount).toBe(2)
    expect(textbookUnitProgress(lesson, previous)).toEqual({ completed: 0, total: 35, percent: 0 })
    expect(effectiveTextbookProgress(lesson, projection)).toBe(projection)
    expect(effectiveTextbookProgress(lesson, previous)).toEqual(projection)
  })

  it('preserves prior v2 records after first response, after reload-style reads, and after another response', () => {
    const v2 = oldProgress(2)
    const first = getItem('n12-p002-q01-coef')
    const afterFirst = answerTextbookItem(v2, lesson, first, first.answer, 500)
    expect(afterFirst.unitRevision).toBe(3)
    expect(afterFirst.answers[first.id].value).toBe('2')
    expect(afterFirst.answers['n12-01']).toBeUndefined()
    expect(afterFirst.archivedRevisions?.['2'].answers['n12-01']).toEqual(v2.answers['n12-01'])
    expect(afterFirst.archivedRevisions?.['2'].answers['n12-01a']).toEqual(v2.answers['n12-01a'])
    expect(textbookUnitProgress(lesson, afterFirst).completed).toBe(1)

    const reloaded = effectiveTextbookProgress(lesson, afterFirst)!
    expect(reloaded).toBe(afterFirst)
    const second = getItem('n12-p002-q01-const')
    const afterSecond = answerTextbookItem(reloaded, lesson, second, second.answer, 600)
    expect(afterSecond.answers[first.id].value).toBe('2')
    expect(afterSecond.answers[second.id].value).toBe('-7')
    expect(afterSecond.archivedRevisions).toEqual(afterFirst.archivedRevisions)
    expect(textbookUnitProgress(lesson, afterSecond).completed).toBe(2)
  })

  it('manual restart wipes only current N12 answers while retaining old version archive', () => {
    const v2 = oldProgress(2)
    const first = getItem('n12-p002-q01-coef')
    const active = answerTextbookItem(v2, lesson, first, first.answer, 500)
    const restarted = resetTextbookUnitProgress(lesson, active, 700)!
    expect(restarted.answers).toEqual({})
    expect(restarted.startedAt).toBe(700)
    expect(restarted.unitRevision).toBe(3)
    expect(restarted.archivedRevisions).toEqual(active.archivedRevisions)
    expect(restarted.completedAt).toBeUndefined()
    expect(textbookUnitProgress(lesson, restarted).completed).toBe(0)
    expect(resetTextbookUnitProgress(lesson, v2, 701)?.archivedRevisions?.['2'].answers)
      .toEqual(v2.answers)
  })

  it('keeps ordinary other-unit revision invalidation and historical P-002 migration', () => {
    const stale = oldProgress(1)
    expect(effectiveTextbookProgress(unit, { ...stale, unitId: unit.unitId, unitRevision: unit.revision - 1 }))
      .toBeUndefined()
    expect(resetTextbookUnitProgress(unit, stale, 1000)).toBeUndefined()
    const historicalV2 = { ...lesson, revision: 2 }
    const p002 = effectiveTextbookProgress(historicalV2, stale)!
    expect(p002.unitRevision).toBe(2)
    expect(p002.answers).toEqual(stale.answers)
    expect(p002.previousRevisionCompletedAt).toBe(300)
  })
})


describe('W-MATH-005/P-002: N01/N03-only v1 to v2 answer preservation', () => {
  const cases = [
    { lesson: mathNumbersN01Unit, source: n01SourceToItemIds,
      tokens: ['n01-r3-q07-x2coef', 'n01-r3-q07-xcoef', 'n01-r3-q07-const'], total: 18 },
    { lesson: mathNumbersN03Unit, source: n03SourceToItemIds,
      tokens: ['n03-r3-q10-p1', 'n03-r3-q10-p2', 'n03-r3-q10-p3', 'n03-r3-q10-p4'], total: 17 },
  ]

  for (const { lesson, source, tokens, total } of cases) {
    it(lesson.unitId + ': preserves all original completion and attempts, while seven-hole family is unanswered', () => {
      const ids = Object.values(source).flat()
      const answers = Object.fromEntries(ids.map(id => {
        const item = lesson.sections[0].items.find(candidate => candidate.id === id)!
        return [id, {
          itemId: id, value: item.answer, firstValue: item.answer, isFirstCorrect: true,
          resolved: true, attemptCount: 3, firstAnsweredAt: 100, lastAnsweredAt: 200,
        }]
      }))
      const old: TextbookUnitProgress = {
        unitId: lesson.unitId, unitRevision: 1, startedAt: 80,
        updatedAt: 200, completedAt: 300, answers,
      }
      const migrated = effectiveTextbookProgress(lesson, old)!
      expect(migrated.unitRevision).toBe(2)
      expect(migrated.migratedFromRevision).toBe(1)
      expect(migrated.previousRevisionCompletedAt).toBe(300)
      expect(migrated.completedAt).toBeUndefined()
      expect(migrated.answers).toEqual(old.answers)
      expect(migrated.startedAt).toBe(80)
      expect(textbookUnitProgress(lesson, old)).toMatchObject({ completed: ids.length, total })
      expect(effectiveTextbookProgress(lesson, migrated)).toBe(migrated)
      for (const id of tokens) expect(migrated.answers[id]).toBeUndefined()

      let active = old
      tokens.forEach((id, index) => {
        const item = lesson.sections[0].items.find(candidate => candidate.id === id)!
        active = answerTextbookItem(active, lesson, item, item.answer, 400 + index)
      })
      expect(textbookUnitProgress(lesson, active)).toMatchObject({ completed: total, total, percent: 100 })
      expect(active.completedAt).toBeDefined()
      expect(active.previousRevisionCompletedAt).toBe(300)
      expect(active.answers[ids[0]].attemptCount).toBe(3)
      expect(effectiveTextbookProgress(lesson, active)).toBe(active)
    })

    it(lesson.unitId + ': wrong old answers and unrelated revision never become solved', () => {
      const id = Object.values(source).flat()[0]
      const item = lesson.sections[0].items.find(candidate => candidate.id === id)!
      const wrong = {
        itemId: id, value: 'wrong', firstValue: 'wrong',
        isFirstCorrect: false, resolved: true,
        attemptCount: 2, firstAnsweredAt: 100, lastAnsweredAt: 200,
      }
      const old: TextbookUnitProgress = {
        unitId: lesson.unitId, unitRevision: 1, startedAt: 100, updatedAt: 200,
        answers: { [id]: wrong },
      }
      const migrated = effectiveTextbookProgress(lesson, old)!
      expect(migrated.answers[id]).toEqual(wrong)
      expect(textbookUnitProgress(lesson, old).completed).toBe(0)
      const corrected = answerTextbookItem(old, lesson, item, item.answer, 400)
      expect(corrected.answers[id].firstValue).toBe('wrong')
      expect(corrected.answers[id].attemptCount).toBe(3)
      expect(textbookUnitProgress(lesson, corrected).completed).toBe(1)
      expect(effectiveTextbookProgress(lesson, { ...old, unitRevision: 0 })).toBeUndefined()
      expect(effectiveTextbookProgress(lesson, { ...old, unitId: 'math-numbers-expressions-n02' })).toBeUndefined()
    })
  }

  it('keeps already-released N09 restart and N12 35-stage archive behavior', () => {
    const n09old: TextbookUnitProgress = {
      unitId: mathNumbersN09Unit.unitId, unitRevision: 1, startedAt: 10, updatedAt: 20,
      completedAt: 30, answers: {},
    }
    const n09 = effectiveTextbookProgress(mathNumbersN09Unit, n09old)!
    expect(n09.answers).toEqual({})
    expect(n09.archivedRevisions?.['1'].completedAt).toBe(30)
    expect(textbookUnitProgress(mathNumbersN09Unit, n09old).total).toBe(18)

    const n12old: TextbookUnitProgress = { ...n09old, unitId: mathNumbersN12Unit.unitId, unitRevision: 2 }
    const n12 = effectiveTextbookProgress(mathNumbersN12Unit, n12old)!
    expect(n12.unitRevision).toBe(3)
    expect(n12.answers).toEqual({})
    expect(n12.archivedRevisions?.['2'].completedAt).toBe(30)
    expect(textbookUnitProgress(mathNumbersN12Unit, n12old).total).toBe(35)
  })
})


// Initialize the real persist middleware against a deterministic browser-storage double.
vi.hoisted(() => {
  const data = new Map<string,string>()
  Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:(key:string)=>data.get(key) ?? null,setItem:(key:string,value:string)=>{data.set(key,value)},removeItem:(key:string)=>{data.delete(key)},clear:()=>data.clear(),key:(index:number)=>[...data.keys()][index] ?? null,get length(){return data.size}}})
  Object.defineProperty(globalThis,'window',{configurable:true,value:{localStorage:globalThis.localStorage}})
})
// P017: exercise actual Store write boundaries as well as pure migration.
import qf01Data from '../data/textbook/math/quadratic/qf01Unit.json'
import { TextbookUnitSchema } from './textbookSchema'
import { useAppStore } from '../stores/useAppStore'
import { textbookSectionProgress } from './textbook'
const qf01v2 = TextbookUnitSchema.parse(qf01Data)
const qf01Items = qf01v2.sections.flatMap(s => s.items)
const qf01Active = qf01Items.filter(i => i.id !== 'qf01-n20-answer')
function qf01Old(prefix = 0): TextbookUnitProgress {
  const answers = Object.fromEntries(qf01Items.slice(0,prefix).map((i,index) => [i.id,{itemId:i.id,value:i.answer,firstValue:i.answer,isFirstCorrect:true,resolved:true,attemptCount:1,firstAnsweredAt:index+1,lastAnsweredAt:index+1}]))
  return {unitId:qf01v2.unitId,unitRevision:1,startedAt:0,updatedAt:30,answers,...(prefix === 25 ? {completedAt:29} : {}),archivedRevisions:{'1':{unitRevision:0,startedAt:0,updatedAt:0,answers:{},nestedUnknown:{value:17}}}} as TextbookUnitProgress
}
const jsonRoundtrip = <T,>(x:T):T => JSON.parse(JSON.stringify(x)) as T

describe('P017 QF01 lossless revision and real Store boundaries', () => {
  it('retains physical25 grading meanings but counts only24 active decisions', () => {
    expect(qf01v2.revision).toBe(2); expect(qf01Items).toHaveLength(25)
    expect(qf01v2.requiredInteractionRefs).toEqual(qf01Active.map(i => i.id))
    expect(textbookUnitProgress(qf01v2,undefined)).toMatchObject({total:24,completed:0})
    expect(qf01v2.sections.reduce((sum,section) => sum + textbookSectionProgress(qf01v2,undefined,section.id).total,0)).toBe(24)
  })
  it('captures the complete JSON original, nested archives, unknown fields, n20 and completion', () => {
    const original = {...qf01Old(25),unknownMetadata:{nested:[null,'original',false]}}
    const frozen = JSON.stringify(original), migrated = effectiveTextbookProgress(qf01v2,original)!
    expect(JSON.stringify(original)).toBe(frozen)
    expect(JSON.parse(migrated.qf01Revision1Snapshot!.serializedProgress)).toEqual(original)
    expect(migrated.archivedRevisions).toEqual(original.archivedRevisions)
    expect(migrated.answers['qf01-n20-answer']).toBeUndefined()
    expect(textbookUnitProgress(qf01v2,migrated)).toMatchObject({completed:24,total:24})
    expect(migrated.completedAt).toBeUndefined(); expect(migrated.previousRevisionCompletedAt).toBe(29)
    expect(effectiveTextbookProgress(qf01v2,jsonRoundtrip(migrated))).toEqual(migrated)
  })
  it('derives every old prefix frontier from exact IDs, including retirement boundary', () => {
    for (let prefix=0; prefix<=25; prefix++) {
      const original = qf01Old(prefix), current = effectiveTextbookProgress(qf01v2,original)!
      const retained = qf01Items.slice(0,prefix).filter(i => i.id !== 'qf01-n20-answer')
      expect(Object.keys(current.answers)).toEqual(retained.map(i => i.id))
      expect(textbookUnitProgress(qf01v2,current).completed).toBe(retained.length)
      expect(qf01Active.find(i => !current.answers[i.id])?.id).toBe(qf01Active[retained.length]?.id)
    }
  })
  it('quarantines forged flags and malformed records while preserving every raw byte as JSON', () => {
    const original=qf01Old(7), ids=qf01Active.map(i => i.id)
    original.answers[ids[0]].value=qf01Active[0].choices!.find(v => v !== qf01Active[0].answer)!
    original.answers[ids[1]].firstValue=qf01Active[1].choices!.find(v => v !== qf01Active[1].answer)!
    original.answers[ids[2]].attemptCount=0
    original.answers[ids[3]].lastAnsweredAt=-1
    original.answers[ids[4]].resolved='true' as unknown as boolean
    original.answers['unknown-id']={...original.answers[ids[5]],itemId:'unknown-id'}
    const current=effectiveTextbookProgress(qf01v2,original)!
    expect(Object.keys(current.answers)).toEqual([ids[5],ids[6]])
    expect(JSON.parse(current.qf01Revision1Snapshot!.serializedProgress)).toEqual(original)
  })
  it('keeps recognized wrong attempts and sparse correct records exactly and resolves on a real answer', () => {
    const item=qf01Active[0], wrong=item.choices!.find(v => v !== item.answer)!, original=qf01Old()
    original.answers[item.id]={itemId:item.id,value:wrong,firstValue:wrong,isFirstCorrect:false,resolved:false,attemptCount:3,firstAnsweredAt:2,lastAnsweredAt:7}
    original.answers[qf01Active[15].id]=qf01Old(16).answers[qf01Active[15].id]
    const migrated=effectiveTextbookProgress(qf01v2,original)!, snapshot=migrated.qf01Revision1Snapshot!.serializedProgress
    expect(migrated.answers[item.id]).toEqual(original.answers[item.id])
    const answered=answerTextbookItem(original,qf01v2,item,item.answer,50)
    expect(answered.unitRevision).toBe(2); expect(answered.answers[item.id]).toMatchObject({attemptCount:4,firstAnsweredAt:2,lastAnsweredAt:50,isFirstCorrect:false,resolved:true})
    expect(jsonRoundtrip(answered).qf01Revision1Snapshot!.serializedProgress).toBe(snapshot)
    expect(answered.answers[qf01Active[15].id]).toEqual(original.answers[qf01Active[15].id])
  })
  it('returns migrated revision on already resolved write without creating attempts or completion', () => {
    const original=qf01Old(25), item=qf01Active[0], answered=answerTextbookItem(original,qf01v2,item,item.answer,999)
    expect(answered.unitRevision).toBe(2); expect(answered.updatedAt).toBe(30)
    expect(answered.answers[item.id]).toEqual(original.answers[item.id]); expect(answered.completedAt).toBeUndefined()
  })
  it('reconstructs full pre-reset JSON for three repeated resets, including old archive and snapshots', () => {
    let current=answerTextbookItem(qf01Old(10),qf01v2,qf01Active[10],qf01Active[10].answer,40)
    const originalSnapshot=current.qf01Revision1Snapshot!.serializedProgress
    for(let index=0;index<3;index++) {
      const before=jsonRoundtrip(current)
      current=jsonRoundtrip(resetTextbookUnitProgress(qf01v2,current,100+index)!)
      const entries=current.qf01ResetSnapshots!, entry=entries[index]
      const recovered=JSON.parse(entry.serializedProgressWithoutResetSnapshots)
      if(entry.hadResetSnapshots) recovered.qf01ResetSnapshots=entries.slice(0,index)
      expect(recovered).toEqual(before);expect(current.qf01Revision1Snapshot!.serializedProgress).toBe(originalSnapshot)
      expect(current.archivedRevisions).toEqual(before.archivedRevisions);expect(current.answers).toEqual({})
    }
  })
  it('rejects a backwards-clock write before producing an invalid revision2 record', () => {
    const original=qf01Old(), item=qf01Active[0], wrong=item.choices!.find(v => v !== item.answer)!
    original.answers[item.id]={itemId:item.id,value:wrong,firstValue:wrong,isFirstCorrect:false,resolved:false,attemptCount:2,firstAnsweredAt:100,lastAnsweredAt:200}
    expect(() => answerTextbookItem(original,qf01v2,item,item.answer,50)).toThrow()
    expect(() => answerTextbookItem(original,qf01v2,item,item.answer,200)).not.toThrow()
    expect(effectiveTextbookProgress(qf01v2,answerTextbookItem(original,qf01v2,item,item.answer,200))).toBeDefined()
  })
  it('does not fabricate revision1 history for a fresh revision2 learner', () => {
    const reset=resetTextbookUnitProgress(qf01v2,undefined,5)!
    expect(reset.qf01Revision1Snapshot).toBeUndefined();expect(reset.qf01ResetSnapshots).toHaveLength(1)
    expect(answerTextbookItem(reset,qf01v2,qf01Active[0],qf01Active[0].answer,10).qf01ResetSnapshots).toEqual(reset.qf01ResetSnapshots)
  })
  it('refuses changed grading, unsupported JSON and reserved-key collisions before any write', () => {
    const changed=jsonRoundtrip(qf01v2);changed.sections[0].items[0].answer='unreviewed'
    expect(() => effectiveTextbookProgress(changed,qf01Old())).toThrow()
    for(const original of [Object.assign(qf01Old(),{qf01Revision1Snapshot:{}}),Object.assign(qf01Old(),{qf01ResetSnapshots:[]}),Object.assign(qf01Old(),{bad:undefined}),Object.assign(qf01Old(),{bad:NaN})]) {
      expect(() => answerTextbookItem(original as TextbookUnitProgress,qf01v2,qf01Active[0],qf01Active[0].answer,40)).toThrow()
      expect(() => resetTextbookUnitProgress(qf01v2,original as TextbookUnitProgress,40)).toThrow()
    }
    const cycle=Object.assign(qf01Old(),{self:null as unknown}); cycle.self=cycle
    expect(() => effectiveTextbookProgress(qf01v2,cycle)).toThrow()
  })
  it('fails closed through actual Store answer/reset actions, preserving memory and persisted bytes', () => {
    const storageKey=useAppStore.persist.getOptions().name
    if (typeof storageKey !== 'string' || storageKey.trim() === '') throw new Error('Actual Store persist name must be a nonempty string')
    const valid=effectiveTextbookProgress(qf01v2,qf01Old(10))!
    const malformedR2={...valid,qf01Revision1Snapshot:{...valid.qf01Revision1Snapshot!,sourceSHA:'forged'}} as unknown as TextbookUnitProgress
    const badLog={...valid,qf01ResetSnapshots:[{schemaVersion:'qf01-reset-snapshot/1',priorResetCount:2,hadResetSnapshots:false,serializedProgressWithoutResetSnapshots:'{}'}]} as TextbookUnitProgress
    for(const original of [Object.assign(qf01Old(),{qf01ResetSnapshots:[]}),malformedR2,badLog,{...valid,unitId:'another-unit'},{...valid,unitRevision:3}]) {
      useAppStore.setState({textbookProgress:{[qf01v2.unitId]:original}})
      const memory=JSON.stringify(useAppStore.getState().textbookProgress), saved=localStorage.getItem(storageKey)
      expect(saved).not.toBeNull()
      expect(textbookUnitProgress(qf01v2,original)).toEqual({completed:0,total:24,percent:0})
      expect(textbookSectionProgress(qf01v2,original,qf01v2.sections[0].id)).toEqual({completed:0,total:24})
      expect(() => effectiveTextbookProgress(qf01v2,original)).toThrow()
      expect(() => useAppStore.getState().answerTextbook(qf01v2,qf01Active[10].id,qf01Active[10].answer)).toThrow()
      expect(() => useAppStore.getState().resetTextbookUnit(qf01v2.unitId,qf01v2)).toThrow()
      expect(JSON.stringify(useAppStore.getState().textbookProgress)).toBe(memory);expect(localStorage.getItem(storageKey)).toBe(saved)
    }
    useAppStore.setState({textbookProgress:{}})
  })
  it('uses actual Store first-write, persisted rehydration and reset paths without dropping the old snapshot', async () => {
    const storageKey=useAppStore.persist.getOptions().name
    if (typeof storageKey !== 'string' || storageKey.trim() === '') throw new Error('Actual Store persist name must be a nonempty string')
    const original=qf01Old(10);useAppStore.setState({textbookProgress:{[qf01v2.unitId]:original}})
    useAppStore.getState().answerTextbook(qf01v2,qf01Active[10].id,qf01Active[10].answer)
    let current=jsonRoundtrip(useAppStore.getState().textbookProgress[qf01v2.unitId])
    expect(current.unitRevision).toBe(2);expect(JSON.parse(current.qf01Revision1Snapshot!.serializedProgress)).toEqual(original)
    const persisted=localStorage.getItem(storageKey)!
    expect(persisted).not.toBeNull()
    expect(JSON.parse(persisted).state.textbookProgress[qf01v2.unitId]).toEqual(current)
    useAppStore.setState({textbookProgress:{}})
    localStorage.setItem(storageKey,persisted)
    await useAppStore.persist.rehydrate()
    expect(useAppStore.getState().textbookProgress[qf01v2.unitId]).toEqual(current)
    useAppStore.getState().resetTextbookUnit(qf01v2.unitId,qf01v2)
    current=useAppStore.getState().textbookProgress[qf01v2.unitId]
    expect(current).toBeDefined();expect(current.answers).toEqual({});expect(JSON.parse(current.qf01Revision1Snapshot!.serializedProgress)).toEqual(original)
    expect(() => useAppStore.getState().answerTextbook(qf01v2,'qf01-n20-answer','0より大きい')).toThrow()
    useAppStore.setState({textbookProgress:{}})
  })
})

import previousUnits from '../../../../../work/items/W-MATH-029-section-one-teaching/BASELINE.json'
import {describe,expect,it} from 'vitest'
import {readFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {mathTextbookUnits as currentUnits} from '../index'
import {mathNumbersN01R2Unit} from './n01Lesson'
// Historical R2 contract. Current R3 scope, migration and presentation are tested in n01Teaching.test.ts.
const mathTextbookUnits=currentUnits.map(u=>u.unitId===mathNumbersN01R2Unit.unitId?mathNumbersN01R2Unit:(previousUnits as unknown as Record<string,typeof u>)[u.unitId]??u)
import {isFirstThemeUnit} from '../presentation'
const baseline=JSON.parse(readFileSync('work/items/W-MATH-027-first-theme-repair/R2_BASELINE.json','utf8')) as {units:Record<string,{unitHash:string;items:Record<string,string>}>}
const hash=(value:unknown)=>createHash('sha256').update(JSON.stringify(value)).digest('hex')
it('preserves all399 graded decisions and all nine out-of-scope lesson editions from public f1627507',()=>{
 let count=0
 for(const unit of mathTextbookUnits){
  const old=baseline.units[unit.unitId]
  if(!old)continue
  if(!isFirstThemeUnit(unit.unitId))expect(hash(unit),unit.unitId).toBe(old.unitHash)
  for(const [id,expected]of Object.entries(old.items)){
   const item=unit.sections.flatMap(s=>s.items).find(q=>q.id===id)
   expect(hash(item),id).toBe(expected);count++
  }
 }
 expect(count).toBe(399)
})
describe('the screenshot-reported late derivations use the same local calculations as earlier examples',()=>{
 it('calculates the cancelling cubic coefficient and the remaining linear coefficient before N01 final assembly',()=>{
  const flow=mathTextbookUnits.find(u=>u.unitId.endsWith('-n01'))!.sections[0].readingFlow
  const at=(id:string)=>flow.findIndex(b=>b.id===id)
  expect(at('n01-bridge-audit-cancel-cube-formula')).toBeGreaterThan(at('paragraph-n01-09a'))
  expect(at('n01-bridge-audit-cancel-linear-formula')).toBeLessThan(at('paragraph-n01-09b'))
  expect(at('n01-bridge-worked-n01-bridge-audit-cancel-cube-after-0-equation-0')).toBeLessThan(at('paragraph-n01-09b'))
 })
 it('writes the regrouping and common-factor equations before N02 final assembly',()=>{
  const flow=mathTextbookUnits.find(u=>u.unitId.endsWith('-n02'))!.sections[0].readingFlow
  const final=flow.findIndex(b=>b.id==='formula-n02-04')
  for(const id of ['n02-bridge-worked-n02-04-before-0-equation-0','n02-bridge-worked-n02-04-before-1-equation-0']){
   expect(flow.findIndex(b=>b.id===id)).toBeGreaterThan(-1)
   expect(flow.findIndex(b=>b.id===id)).toBeLessThan(final)
  }
 })
})

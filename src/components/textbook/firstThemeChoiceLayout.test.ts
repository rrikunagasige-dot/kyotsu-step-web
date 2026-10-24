import {describe,expect,it} from 'vitest'
import katex from 'katex'
import {mathTextbookUnits} from '../../data/textbook/math'
import {isFirstThemeUnit} from '../../data/textbook/math/presentation'
import {firstThemeChoiceRows,firstThemeChoiceChunks} from './firstThemeChoiceLayout'
import {normalizeTextbookMath} from '../../domain/textbookMath'
import derivations from '../../data/textbook/math/numbers/firstThemeDerivations.json'

describe('first-theme mathematical choice readability and written derivations',()=>{
 it('distinguishes two requested groups instead of making them look like a product',()=>{
  const rows=firstThemeChoiceRows('n01-06b','(-5x+2x)\\quad (6-3)')
  expect(rows).toHaveLength(2)
  expect(rows[0]).toContain('xの項')
  expect(rows[0]).toContain('(-5x+2x)')
  expect(rows[1]).toContain('定数項')
  expect(rows[1]).toContain('(6-3)')
 })
 it('preserves labelled coefficient/degree tuples as two separate facts',()=>{
  expect(firstThemeChoiceRows('n01-02a','(-2,1)')).toEqual(['\\text{係数}\\;-2','\\text{次数}\\;1'])
  expect(firstThemeChoiceRows('n02-03','(2y-3,\\ y^2-3y+2)')).toHaveLength(2)
 })
 it('renders every correct and wrong option in the seven real units at semantic breakpoints',()=>{
  for(const unit of mathTextbookUnits.filter(u=>isFirstThemeUnit(u.unitId)))for(const item of unit.sections[0].items){
   if(item.answerType!=='formula')continue
   for(const choice of item.choices??[])for(const row of firstThemeChoiceRows(item.id,choice))for(const chunk of firstThemeChoiceChunks(row,item.id.includes('-s5-'))){
    expect(()=>katex.renderToString(normalizeTextbookMath(chunk),{throwOnError:true,strict:'ignore'}),item.id+' '+chunk).not.toThrow()
   }
  }
 })
 it('keeps the new derivation alternatives in whole small parentheses',()=>{
  expect(firstThemeChoiceChunks('(2y+1)+(y-2)',true)).toEqual(['(2y+1)','{}+(y-2)'])
  expect(firstThemeChoiceChunks('(2y+1)(y-2)',true)).toEqual(['(2y+1)','\\cdot(y-2)'])
 })
 it('renders all written intermediate equations, including each row of a comparison',()=>{
  let count=0
  for(const unit of Object.values(derivations))for(const target of Object.values(unit))for(const rows of Object.values(target))for(const row of rows){
   for(const math of row.math.split('\\quad;\\quad'))expect(()=>katex.renderToString(math,{throwOnError:true,strict:'ignore'}),row.math).not.toThrow()
   count++
  }
  expect(count).toBeGreaterThan(90)
 })
})

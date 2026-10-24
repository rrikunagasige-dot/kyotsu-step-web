// Independent invariant: reflow cannot omit, duplicate or reorder authored tokens.
import fs from 'node:fs'
import assert from 'node:assert/strict'
import { typesetRows } from '../../../src/components/textbook/typesetRows.ts'
import { normalizeTextbookMath } from '../../../src/domain/textbookMath.ts'
const runtime=JSON.parse(fs.readFileSync('e2e-evidence/chapter-runtime/runtime-units.json','utf8'))
const compact=s=>s.replace(/\\(?:begin|end)\{aligned\}|\\qquad|&|\\\\|\s/g,'')
let blocks=0, plans=0
for(const {unit} of runtime.units.filter(({unit})=>/^math-numbers-expressions-(n0[1-6]|ne01)$/.test(unit.unitId))){
  const items=Object.fromEntries(unit.sections.flatMap(s=>s.items).map(q=>[q.id,q]))
  for(const block of unit.sections.flatMap(s=>s.readingFlow??[]).filter(b=>b.type==='formula')){
    blocks++
    for(const answered of [false,true]){
      const source=block.parts.map((part,index)=>part.type==='math'?normalizeTextbookMath(part.latex):part.type==='choice'?(answered?normalizeTextbookMath(items[part.itemId].answer):'§'+index+'§'):'\\text{'+(part.text??'')+'}').join('')
      for(const width of [120,200,280,600]){
        const plan=typesetRows(source,width,s=>s.length*8)
        if(plan.table){
          const expected=source.replace(/\\begin\{array\}\{[^}]+\}|\\end\{array\}|\\hline/g,'')
          assert.equal(compact(plan.table.flat().join('')),compact(expected),unit.unitId+'/'+block.id)
        }else assert.equal(compact(plan.rows.map(row=>row.latex).join('')),compact(source),unit.unitId+'/'+block.id)
        plans++
      }
    }
  }
}
console.log(JSON.stringify({blocks,plans,authoredTokenOrderPreserved:true,passed:true}))

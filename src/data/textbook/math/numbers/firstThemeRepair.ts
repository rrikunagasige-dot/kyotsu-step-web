import type { TextbookUnit, TextbookReadingBlock } from '../../../../domain/textbookSchema'
import { T, M, C, reviewItem } from './reviewLessonHelpers'
import repairs from './firstThemeRepair.json'
import deepening from './firstThemeDeepening.json'
import derivations from './firstThemeDerivations.json'

/** Authored dependencies and formula templates; no answers are generated here. */
export function repairFirstTheme(unit: TextbookUnit): TextbookUnit {
  const prefix = unit.unitId.replace('math-numbers-expressions-', '')
  const nodes = repairs[prefix as keyof typeof repairs]
  if (!nodes) return unit
  const equations = derivations[prefix as keyof typeof derivations] as Record<string,Partial<Record<'before'|'assemble'|'after',{text:string;math:string}[]>>>
  const explanations = deepening[prefix as keyof typeof deepening] as Record<string,{before:string;after:string;mathAfter:string[]}>
  return {
    ...unit, revision: unit.revision + (prefix === 'n01' ? 2 : 3),
    sections: unit.sections.map(section => {
      const readingFlow: TextbookReadingBlock[] = []
      const items = [...section.items]
      const inserted = new Set<string>()
      const visiting = new Set<string>()
      const renderedRows = new Set<string>()
      const explain = (target:string, when:'before'|'after', derivationId?:string) => {
        const detail = explanations[target]
        if (!detail) return
        readingFlow.push({id:prefix+'-bridge-explain-'+target+'-'+when,type:'paragraph',parts:[T(detail[when])],derivationId})
        if (when === 'after') detail.mathAfter.forEach((latex,i) => readingFlow.push({id:prefix+'-bridge-explain-'+target+'-math-'+i,type:'formula',parts:[M(latex)],derivationId}))
      }
      const workedRows = (target:string, position:'before'|'assemble'|'after', derivationId?:string) => {
        for(const [i,row] of (equations[target]?.[position] ?? []).entries()){
          const id=prefix+'-bridge-worked-'+target+'-'+position+'-'+i
          if(renderedRows.has(id))throw Error('Repeated written derivation: '+id)
          renderedRows.add(id)
          readingFlow.push({id:id+'-lead',type:'paragraph',parts:[T(row.text)],derivationId})
          row.math.split('\\quad;\\quad').forEach((latex,j)=>readingFlow.push({id:id+'-equation-'+j,type:'formula',parts:[M(latex)],derivationId}))
        }
      }
      const before = (target:string, derivationId?:string) => {
        if (visiting.has(target)) throw Error('Cyclic reasoning dependency: '+target)
        visiting.add(target)
        explain(target,'before',derivationId)
        workedRows(target,'before',derivationId)
        for (const node of nodes.filter(node => node.target === target)) {
          if (inserted.has(node.id)) throw Error('Repeated repair node: '+node.id)
          inserted.add(node.id)
          readingFlow.push({id:node.id+'-lead',type:'paragraph',parts:[T(node.lead)],derivationId})
          before(node.id,derivationId)
          readingFlow.push({id:node.id+'-formula',type:node.kind === 'text'?'paragraph':'formula',parts:[...(node.stem?[M(node.stem)]:[]),C(node.id),...(node.tail?[M(node.tail)]:[])],derivationId})
          if (node.after) readingFlow.push({id:node.id+'-after',type:'paragraph',parts:[T(node.after)],derivationId})
          explain(node.id,'after',derivationId)
          workedRows(node.id,'after',derivationId)
          items.push(reviewItem(node.id,node.lead,node.answer,node.kind === 'text'?'text':'formula',node.wrong as [string,string,...string[]],'causal-reasoning',node.target === section.items[0]?.id ? 'strong' : 'medium',[node.hint]))
        }
        workedRows(target,'assemble',derivationId)
        visiting.delete(target)
      }
      for (const sourceBlock of section.readingFlow) {
        const block = prefix === 'ne01' && /^ne01-(lead|formula|after)-06$/.test(sourceBlock.id)
          && (sourceBlock.type === 'paragraph' || sourceBlock.type === 'formula')
          ? {...sourceBlock,derivationId:'ne01-chain-06'} : sourceBlock
        const targets = block.type === 'formula' || block.type === 'paragraph'
          ? block.parts.filter(p=>p.type === 'choice').map(p=>p.itemId) : []
        const derivationId = block.type === 'formula' || block.type === 'paragraph' ? block.derivationId : undefined
        targets.forEach(target=>before(target,derivationId))
        if (prefix === 'n03' && block.id === 'figure-multiplication-grid') readingFlow.push({id:'n03-bridge-grid-reading',type:'paragraph',parts:[T('表の上の3x・4が後ろの括弧、左の2x・1が前の括弧の項に当たる。一つのマスでは、同じ列の上の項と同じ行の左の項を掛ける。四つの交点を一回ずつ使えば、掛け漏れがないか確かめられる。')]})
        readingFlow.push(block)
        targets.forEach(target=>{explain(target,'after',derivationId);workedRows(target,'after',derivationId)})
      }
      const expectedRows=Object.values(equations).reduce((sum,phases)=>sum+Object.values(phases).reduce((n,rows)=>n+(rows?.length??0),0),0)
      if(renderedRows.size!==expectedRows)throw Error('Unrendered written derivation: '+prefix)
      if (inserted.size !== nodes.length) throw Error('Missing first-theme repair anchor: '+prefix)
      const order=readingFlow.flatMap(b=>b.type === 'formula'||b.type === 'paragraph'?b.parts.filter(p=>p.type === 'choice').map(p=>p.itemId):[])
      items.sort((a,b)=>order.indexOf(a.id)-order.indexOf(b.id))
      return {...section,readingFlow,items}
    }),
  }
}

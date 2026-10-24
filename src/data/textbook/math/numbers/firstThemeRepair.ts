import type { TextbookUnit, TextbookReadingBlock } from '../../../../domain/textbookSchema'
import { T, M, C, reviewItem } from './reviewLessonHelpers'
import repairs from './firstThemeRepair.json'

/** Authored local reasoning nodes, linked to an unchanged original source question.
 * No answer/distractor is inferred by the renderer. Missing anchors fail closed. */
export function repairFirstTheme(unit: TextbookUnit): TextbookUnit {
  const prefix = unit.unitId.replace('math-numbers-expressions-', '')
  const nodes = repairs[prefix as keyof typeof repairs]
  if (!nodes) return unit
  return {
    ...unit, revision: unit.revision + 1,
    sections: unit.sections.map(section => {
      const readingFlow: TextbookReadingBlock[] = []
      const items = [...section.items]
      const inserted = new Set<string>()
      for (const sourceBlock of section.readingFlow) {
        const block = prefix === 'ne01' && /^ne01-(lead|formula|after)-06$/.test(sourceBlock.id)
          && (sourceBlock.type === 'paragraph' || sourceBlock.type === 'formula')
          ? { ...sourceBlock, derivationId: 'ne01-chain-06' } : sourceBlock
        const targets = block.type === 'formula' || block.type === 'paragraph'
          ? block.parts.filter(p => p.type === 'choice').map(p => p.itemId) : []
        for (const node of nodes.filter(node => targets.includes(node.target))) {
          if (inserted.has(node.id)) throw Error('Repeated repair node: ' + node.id)
          inserted.add(node.id)
          const derivationId = block.type === 'formula' || block.type === 'paragraph' ? block.derivationId : undefined
          readingFlow.push({ id: node.id + '-lead', type: 'paragraph', parts: [T(node.lead)], derivationId })
          readingFlow.push({ id: node.id + '-formula', type: node.kind === 'text' ? 'paragraph' : 'formula', parts: [...(node.stem ? [M(node.stem)] : []), C(node.id)], derivationId })
          if (node.after) readingFlow.push({ id: node.id + '-after', type: 'paragraph', parts: [T(node.after)], derivationId })
          items.push(reviewItem(node.id, node.lead, node.answer, node.kind === 'text' ? 'text' : 'formula', node.wrong as [string, string, ...string[]], 'causal-reasoning', 'medium', [node.hint]))
        }
        if (prefix === 'n03' && block.id === 'figure-multiplication-grid') readingFlow.push({
          id: 'n03-bridge-grid-reading', type: 'paragraph',
          parts: [T('表の上の3x・4が後ろの括弧、左の2x・1が前の括弧の項に当たる。一つのマスでは、同じ列の上の項と同じ行の左の項を掛ける。四つの交点を一回ずつ使えば、掛け漏れがないか確かめられる。')],
        })
        readingFlow.push(block)
      }
      if (inserted.size !== nodes.length) throw Error('Missing first-theme repair anchor: ' + prefix)
      // Keep item order identical to the actual learner dependency order.
      const order = readingFlow.flatMap(b => b.type === 'formula' || b.type === 'paragraph' ? b.parts.filter(p => p.type === 'choice').map(p => p.itemId) : [])
      items.sort((a,b) => order.indexOf(a.id) - order.indexOf(b.id))
      return { ...section, readingFlow, items }
    }),
  }
}

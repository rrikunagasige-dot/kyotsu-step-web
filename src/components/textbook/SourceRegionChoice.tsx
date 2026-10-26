import { sourceRegionLabel } from './sourceRegion'
import { InlineMath } from 'react-katex'
import { constructionExpressionLatex } from '../../domain/constructionReading'
import type { ConstructionInteractionV2 } from '../../domain/constructionReadingV2'

/** The alternatives highlight a range of the same immutable source expression;
 * they are not three new completed right-hand-side formula answers. */
export function SourceRegionChoice({ interaction, subtreeRef }: { interaction: ConstructionInteractionV2; subtreeRef: string }) {
  const source = interaction.boundSourceTree
  if (!source || source.rootExpression.kind !== 'add' || source.rootExpression.args.length !== 2 || !source.subtreeMap[subtreeRef]) return <span data-source-region-status="UNVERIFIED">元の式の範囲を確認できません</span>
  const whole = subtreeRef === source.rootId
  return <span className="axis-source-region" data-source-ast-hash={source.sourceASTHash} data-selected-source-ref={subtreeRef}>
    <span className="axis-source-region-label">{sourceRegionLabel(interaction, subtreeRef)}</span>
    <InlineMath math="|" /><span className={whole ? 'axis-source-range axis-source-range--selected' : 'axis-source-range'} data-source-ref={source.rootId}>
      {source.rootExpression.args.map((term, index) => <span key={index} className={!whole && subtreeRef === source.rootId + '/term-' + (index + 1) ? 'axis-source-range axis-source-range--selected' : 'axis-source-range'} data-source-ref={source.rootId + '/term-' + (index + 1)}><InlineMath math={constructionExpressionLatex(term)} /></span>)}
    </span><InlineMath math="|" />
  </span>
}

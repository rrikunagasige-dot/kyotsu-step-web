import { TypesetFormula } from './TypesetFormula'
import { typesettingEnabled } from '../../data/textbook/math/typesetting'
import { InlineMath } from 'react-katex'
import { normalizeTextbookMath } from '../../domain/textbookMath'
import { firstThemeChoiceRows, firstThemeChoiceChunks } from './firstThemeChoiceLayout'

export function FirstThemeChoiceFormula({itemId,value}:{itemId:string;value:string}){
  const unitId = 'math-numbers-expressions-' + itemId.split('-')[0]
  if (typesettingEnabled(unitId)) return <span className="first-theme-choice-math">{firstThemeChoiceRows(itemId, value).map((source, i) => <TypesetFormula key={i} unitId={unitId} sourceId={'choice-' + itemId + '-' + i} source={normalizeTextbookMath(source)} />)}</span>
  return <span className="first-theme-choice-math">
    {firstThemeChoiceRows(itemId,value).map((row,i)=><span className="first-theme-choice-row" data-choice-row={i} key={i}>
      {firstThemeChoiceChunks(row,itemId.includes('-s5-')).map((chunk,j)=>{
        const prose=/^\\text\{([^{}]+)\}(?:\\;)?$/.exec(chunk)
        return <span className={'first-theme-choice-chunk'+(prose?' first-theme-choice-chunk--prose':'')} key={j}>{prose?prose[1]:<InlineMath math={normalizeTextbookMath(chunk)} />}</span>
      })}
    </span>)}
  </span>
}

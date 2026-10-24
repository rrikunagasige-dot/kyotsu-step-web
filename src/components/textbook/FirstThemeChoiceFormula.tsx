import { InlineMath } from 'react-katex'
import { normalizeTextbookMath } from '../../domain/textbookMath'
import { firstThemeChoiceRows, firstThemeChoiceChunks } from './firstThemeChoiceLayout'

export function FirstThemeChoiceFormula({itemId,value}:{itemId:string;value:string}){
  return <span className="first-theme-choice-math">
    {firstThemeChoiceRows(itemId,value).map((row,i)=><span className="first-theme-choice-row" data-choice-row={i} key={i}>
      {firstThemeChoiceChunks(row).map((chunk,j)=>{
        const prose=/^\\text\{([^{}]+)\}(?:\\;)?$/.exec(chunk)
        return <span className={'first-theme-choice-chunk'+(prose?' first-theme-choice-chunk--prose':'')} key={j}>{prose?prose[1]:<InlineMath math={normalizeTextbookMath(chunk)} />}</span>
      })}
    </span>)}
  </span>
}

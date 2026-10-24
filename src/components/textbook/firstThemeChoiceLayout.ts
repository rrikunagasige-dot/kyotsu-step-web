import { formulaWrapChunks } from './formulaWrap'

// Preserve semantic rows. Two requested groups must never be displayed as a product.
function tupleParts(value:string): string[] {
  let source=value.trim()
  if(source.startsWith('(')&&source.endsWith(')')) source=source.slice(1,-1)
  let depth=0,braces=0,start=0
  const rows:string[]=[]
  for(let i=0;i<source.length;i++){
    if(source[i]==='{')braces++
    if(source[i]==='}')braces--
    if(braces)continue
    if(source[i]==='(')depth++
    if(source[i]===')')depth--
    if(source[i]===','&&depth===0){rows.push(source.slice(start,i).trim());start=i+1}
  }
  rows.push(source.slice(start).trim())
  return rows
}
const labels:Record<string,string[]>={
  'n01-02a':['係数','次数'],'n01-02b':['係数','次数'],'n01-02c':['係数','次数'],
  'n01-04':['係数','次数'],'n01-05':['xの係数','yの係数'],'n01-08':['次数','定数項'],
  'n02-03':['xの一次係数','xの定数部分'],'n02-09':['2A','-3B'],
  'n04-10':['一つ目','二つ目'],'n04-13':['交差積1','交差積2','展開結果'],
  'n04-17':['共通部分','符号が異なる部分'],'n05-06':['最初の平方','最後の平方'],
  'n05-14':['候補A','候補B','候補C'],'n06-15':['和','判定'],
  'ne01-12':['一つ目','二つ目'],'ne01-13':['一つ目','二つ目'],
}
export function firstThemeChoiceRows(itemId:string,value:string):string[]{
  let rows:string[]
  if(itemId==='n01-06b'){
    rows=value.split(/\\quad\s*/)
    return rows.map((row,i)=>'\\text{'+(i===0?'xの項':'定数項')+'}\\;'+row.trim())
  }
  if(value.includes('\\quad;\\quad'))rows=value.split('\\quad;\\quad')
  else if(value.includes('\\quad'))rows=value.split(/,?\s*\\quad\s*/)
  else if(labels[itemId])rows=tupleParts(value)
  else rows=[value]
  const names=labels[itemId]
  return rows.filter(Boolean).map((row,i)=>names?.[i]?'\\text{'+names[i]+'}\\;'+row.trim():row.trim())
}
export function firstThemeChoiceChunks(value:string,preserveFactors=false):string[]{
  // Explicit multiplication keeps separate factors readable after wrapping.
  const labelled=/^(\\text\{[^}]+\}\\;)(.*)$/.exec(value)
  if(labelled) return [labelled[1],...firstThemeChoiceChunks(labelled[2],preserveFactors)]
  const source=value.replace(/\)\(/g,')\\cdot(')
  return formulaWrapChunks({id:preserveFactors?'first-theme-aligned':'first-theme-choice',type:'formula',parts:[{type:'math',latex:source}]})
    // A leading + or - needs its preceding empty atom to retain binary spacing.
    .map(chunk=>/^[+=-]/.test(chunk.trim())?'{}'+chunk:chunk)
}

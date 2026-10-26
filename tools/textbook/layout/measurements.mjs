/** Check measured facts; this does not decide educational quality or capture a browser. */
import {LAYOUT_TOKENS as T} from './plan.mjs';
export function validateLayoutMeasurements(input,context={}){
 const findings=[],add=(ruleId,detail)=>findings.push({ruleId,detail});
 if(!Array.isArray(input)||!input.length)return {status:'FAIL',findings:[{ruleId:'LAYOUT_MEASUREMENTS_REQUIRED'}]};
 const widths=new Set(),states=new Map(),keys=new Set();
 for(const m of input){
  const key=`${m.viewportWidth}:${m.state}:${m.groupId}`;
  if(keys.has(key))add('LAYOUT_DUPLICATE_MEASUREMENT',key);keys.add(key);
  if(!Number.isFinite(m.viewportWidth)||m.viewportWidth<=0||!['initial','partial','complete'].includes(m.state)||!m.groupId){add('LAYOUT_MEASUREMENT_SCOPE',key);continue;}
  widths.add(m.viewportWidth);const group=`${m.viewportWidth}:${m.groupId}`;if(!states.has(group))states.set(group,new Set());states.get(group).add(m.state);
  if(context.sourceSHA&&m.sourceSHA!==context.sourceSHA)add('LAYOUT_SOURCE_MISMATCH',key);
  if(context.layoutHash&&m.layoutHash!==context.layoutHash)add('LAYOUT_PLAN_MISMATCH',key);
  if(!/^[a-f0-9]{64}$/.test(m.imageHash??'')||!/^[a-f0-9]{64}$/.test(m.visibleStateHash??''))add('LAYOUT_STATE_EVIDENCE',key);
  if(!Array.isArray(m.rows)||!m.rows.length){add('LAYOUT_ROWS_REQUIRED',key);continue;}
  const ids=m.rows.map(r=>r.rowId), expectedRows=context.groupStates?.[m.groupId]?.[m.state]??(m.state==='complete'?context.groupRows?.[m.groupId]:null);
  if(new Set(ids).size!==ids.length||context.groupRows?.[m.groupId]&&ids.some(id=>!context.groupRows[m.groupId].includes(id))||expectedRows&&JSON.stringify(ids)!==JSON.stringify(expectedRows))add('LAYOUT_STATE_ROW_COVERAGE',key);
  if(!Number.isInteger(m.activePromptCount)||m.activePromptCount<0||m.activePromptCount>1||m.currentInteractionId!==undefined&&m.activePromptCount!==(m.currentInteractionId?1:0))add('LAYOUT_CURRENT_PROMPT',key);
  for(const [field,expected] of [['rowGapPx',T.rowGapPx],['noteGapPx',T.noteGapPx],['paragraphGapPx',T.paragraphGapPx]])if(!Number.isFinite(m[field])||Math.abs(m[field]-expected)>1)add('LAYOUT_GAP',key+':'+field);
  const terminal=ids.at(-1), terminalVisible=ids.length>0;
  if(typeof m.numberVisible!=='boolean'||m.numberVisible!==terminalVisible||m.numberVisible&&(m.numberAnchorRowRef!==terminal||!['beside-final-row','below-final-row'].includes(m.numberPosition)))add('LAYOUT_NUMBER_ANCHOR',key);
  const xs=[];
  for(const r of m.rows){
   if(!r.rowId||!Number.isFinite(r.fontPx)||Math.abs(r.fontPx-T.mathFontPx)>T.fontTolerancePx)add('LAYOUT_FONT_SIZE',key+':'+r.rowId);
   if(!Number.isFinite(r.katexScale)||Math.abs(r.katexScale-T.katexScale)>0.01)add('LAYOUT_KATEX_SCALE',key+':'+r.rowId);
   if(r.relationX===undefined)add('LAYOUT_RELATION_POSITION',key);
   if(r.relationX!==null&&r.relationX!==undefined){if(Number.isFinite(r.relationX))xs.push(r.relationX);else add('LAYOUT_RELATION_POSITION',key);}
   if(!Number.isFinite(r.mathCenterX)||!Number.isFinite(r.contentCenterX)||Math.abs(r.mathCenterX-r.contentCenterX)>T.centerTolerancePx)add('LAYOUT_MATH_CENTER',key+':'+r.rowId);
   if(r.clipped!==false||r.mathOverflow!==false||r.hitOverlap!==false)add('LAYOUT_CLIP_OR_OVERLAP',key+':'+r.rowId);
   if(r.interactive&&(r.hitWidth<T.minHitPx||r.hitHeight<T.minHitPx||!Number.isFinite(r.hitWidth)||!Number.isFinite(r.hitHeight)))add('LAYOUT_HIT_TARGET',key+':'+r.rowId);
  }
  if(xs.length&&Math.max(...xs)-Math.min(...xs)>T.relationTolerancePx)add('LAYOUT_RELATION_ALIGNMENT',key);
  if(m.state==='complete'&&m.activePromptCount!==0)add('LAYOUT_STALE_ACTIVE_PROMPT',key);
  if(context.groupRows?.[m.groupId]&&m.state==='complete'&&JSON.stringify(m.rows.map(r=>r.rowId))!==JSON.stringify(context.groupRows[m.groupId]))add('LAYOUT_COMPLETE_ROW_COVERAGE',key);
 }
 const requiredWidths=context.widths??[320,390,430,1440];
 if(requiredWidths.some(w=>!widths.has(w)))add('LAYOUT_VIEWPORT_COVERAGE',requiredWidths.join(','));
 for(const groupId of context.groupIds??[...new Set(input.map(m=>m.groupId))])for(const width of requiredWidths){const seen=states.get(`${width}:${groupId}`);if(!seen||['initial','partial','complete'].some(s=>!seen.has(s)))add('LAYOUT_STATE_COVERAGE',`${width}:${groupId}`);}
 return {status:findings.length?'FAIL':'PASS',findings,measurementCount:input.length,meaningAuditRequired:true,automaticAcceptance:false};
}

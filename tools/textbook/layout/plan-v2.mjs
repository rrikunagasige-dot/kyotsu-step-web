import { hash } from '../util.mjs'

export const AXIS_CONTRACT = Object.freeze({ schemaVersion:'axis-contract/1', mathStyle:{fontPx:18,katexScale:1}, strutProfile:'same-font-katex-in-flow', baselineSource:'zero-inline-dom-marker', axisSource:'same-font-fraction-rule', minHitPx:44, framePolicy:'fixed-group-envelope', envelopeSource:'all-candidates-neutral-syntax', numberBaselineRef:'current-visible-last-math-row', numberCollision:'below-final-row', numberClearancePx:8, responsiveBreak:'fixed-envelope-only', tolerances:{baselinePx:1,axisPx:1,stateAnchorPx:1,frameCenterPx:2} })
const copy = text => [{type:'text',text}]
/** Construction groups keep their source node membership. Every other source
 * node gets an explicit standalone contract, including prose-only nodes; none
 * can silently disappear because it has no mathematical row. */
export function buildLayoutPlanV2({unitId,nodeDesign,groups=[],interactionsV1=[],interactionsV2=[],legacyItems=[],semantic,equationNumbers={}}) {
  const nodes = Array.isArray(semantic) ? semantic : semantic?.nodes ?? []
  const output=[], covered=new Set()
  const groupDefs=[...groups.map(g=>({id:g.id,sourceNodeIds:g.sourceNodeIds,number:g.number})),...nodeDesign.filter(n=>!groups.some(g=>g.sourceNodeIds.includes(n.nodeId))).map(n=>({id:'r7-'+n.nodeId,sourceNodeIds:[n.nodeId]}))]
  for(const g of groupDefs){
    const rows=[],prose=[]
    for(const nodeId of g.sourceNodeIds){
      const design=nodeDesign.find(n=>n.nodeId===nodeId),source=nodes.find(n=>n.id===nodeId),v2=interactionsV2.find(i=>i.sourceNodeId===nodeId),v1=interactionsV1.find(i=>i.sourceNodeId===nodeId)
      covered.add(nodeId)
      if(v2){for(const step of v2.steps)rows.push({id:step.rowId,nodeId,kind:step.formula?'math':'prose',interactionRef:v2.id,requiresCorrectParts:step.requiresCorrectParts,partIds:step.partIds,visibleAfter: v2.prerequisiteInteractionIds})}
      else if(v1)rows.push({id:nodeId+'-r7-row',nodeId,kind:'math',interactionRef:v1.id,requiresCorrectParts:[],partIds:v1.parts.map(p=>p.id),visibleAfter:v1.prerequisiteInteractionIds})
      else {const formulaBlocks=(source?.before??[]).filter(b=>b.type==='formula');for(const b of formulaBlocks)rows.push({id:b.id,nodeId,kind:'math',interactionRef:design?.interactionId??null,requiresCorrectParts:[],partIds:[],visibleAfter:[]})}
      if(design?.leadParts?.length)prose.push({id:nodeId+'-r7-lead',nodeId,role:'group-lead',content:design.leadParts,visibleAfter:design.prerequisiteNodeIds??[],requiresCorrectParts:[],placement:'before-node'})
      else if(design?.lead)prose.push({id:nodeId+'-r7-lead',nodeId,role:'group-lead',content:copy(design.lead),visibleAfter:design.prerequisiteNodeIds??[],requiresCorrectParts:[],placement:'before-node'})
    }
    const mathRows=rows.filter(r=>r.kind==='math'),allParts=[...interactionsV1,...interactionsV2].filter(i=>g.sourceNodeIds.includes(i.sourceNodeId)).flatMap(i=>i.parts.map(p=>p.id))
    const number=g.number??g.sourceNodeIds.flatMap(nodeId=>{const n=nodes.find(n=>n.id===nodeId);return [...n?.before??[],...n?.after??[]].map(b=>equationNumbers[b.id]).filter(n=>n!==undefined)}).at(-1)??null
    output.push({id:g.id,sourceNodeIds:g.sourceNodeIds,rows,rowIds:rows.map(r=>r.id),mathRowIds:mathRows.map(r=>r.id),partIds:allParts,number,numberRowRef:mathRows.at(-1)?.id??null,numberBaselineRef:'current-visible-last-math-row',axisContract:'axis-contract/1',framePolicy:'fixed-group-envelope',envelopeSource:'all-candidates-neutral-syntax',responsiveBreak:'fixed-envelope-only',prose})
  }
  return {schemaVersion:'layout-plan/2',unitId,axisContract:structuredClone(AXIS_CONTRACT),tokens:{mathFontPx:18,katexScale:1,minHitPx:44,rowGapPx:4,noteGapPx:6,paragraphGapPx:8},nodeCoverage:nodeDesign.map(n=>({nodeId:n.nodeId,groupId:output.find(g=>g.sourceNodeIds.includes(n.nodeId))?.id??null})),groups:output,partIds:[...interactionsV1,...interactionsV2].flatMap(i=>i.parts.map(p=>p.id)),legacyInteractionIds:legacyItems.map(i=>i.id),sourceNodeCount:nodeDesign.length}
}

export function validateLayoutPlanV2(input,{rowIds,interactionIds,nodeIds,partIds}={}){
  const findings=[],add=(ruleId,detail)=>findings.push({ruleId,detail})
  try {
  if(!input||input.schemaVersion!=='layout-plan/2'||typeof input.unitId!=='string'||!Array.isArray(input.groups)||!input.groups.length)return {status:'FAIL',findings:[{ruleId:'LAYOUT2_SCHEMA',detail:'nonempty typed layout-plan/2 required'}]}
  if(hash(input.axisContract)!==hash(AXIS_CONTRACT))add('LAYOUT2_AXIS_CONTRACT','axis/strut/frame/number requirements must match axis-contract/1')
  for(const [key,value]of Object.entries({mathFontPx:18,katexScale:1,minHitPx:44,rowGapPx:4,noteGapPx:6,paragraphGapPx:8}))if(input.tokens?.[key]!==value)add('LAYOUT2_TOKENS',key)
  const seen=new Set(),covered=new Set(),knownParts=new Set(partIds??input.partIds??[]),allNodeIds=nodeIds??input.nodeCoverage?.map(n=>n.nodeId)??[]
  for(const g of input.groups){
    if(!g.id||seen.has(g.id)){add('LAYOUT2_DUPLICATE_ID',g.id);continue}seen.add(g.id)
    if(!Array.isArray(g.sourceNodeIds)||!g.sourceNodeIds.length||g.sourceNodeIds.some(id=>!allNodeIds.includes(id)))add('LAYOUT2_UNKNOWN_NODE',g.id)
    for(const n of g.sourceNodeIds??[]){if(covered.has(n))add('LAYOUT2_DUPLICATE_NODE',n);covered.add(n)}
    if(g.axisContract!=='axis-contract/1'||g.framePolicy!=='fixed-group-envelope'||g.envelopeSource!=='all-candidates-neutral-syntax'||g.responsiveBreak!=='fixed-envelope-only')add('LAYOUT2_FRAME_CONTRACT',g.id)
    if(!Array.isArray(g.rows)||!Array.isArray(g.rowIds)||hash(g.rows.map(r=>r.id))!==hash(g.rowIds))add('LAYOUT2_ROW_COVERAGE',g.id)
    const local=new Set()
    for(const r of g.rows??[]){
      if(!r.id||local.has(r.id)||rowIds&&!rowIds.includes(r.id))add('LAYOUT2_UNKNOWN_ROW',r.id);local.add(r.id)
      if(!g.sourceNodeIds.includes(r.nodeId)||!['math','prose'].includes(r.kind))add('LAYOUT2_ROW_NODE',r.id)
      if(r.interactionRef&&interactionIds&&!interactionIds.includes(r.interactionRef))add('LAYOUT2_UNKNOWN_INTERACTION',r.id)
      if(!Array.isArray(r.requiresCorrectParts)||!Array.isArray(r.partIds)||!Array.isArray(r.visibleAfter)||[...r.requiresCorrectParts,...r.partIds].some(p=>!knownParts.has(p)))add('LAYOUT2_UNKNOWN_PART',r.id)
      // A prerequisite must have appeared in a preceding step of this parent,
      // never in the same/future row; source-level dependencies remain explicit.
      for(const p of r.requiresCorrectParts??[]){const origin=g.rows.findIndex(x=>x.partIds?.includes(p));if(origin<0||origin>=g.rows.indexOf(r))add('LAYOUT2_FUTURE_PREREQUISITE',r.id+':'+p)}
    }
    const math=(g.rows??[]).filter(r=>r.kind==='math').map(r=>r.id)
    if(hash(g.mathRowIds)!==hash(math)||g.numberRowRef!==(math.at(-1)??null)||g.numberBaselineRef!=='current-visible-last-math-row')add('LAYOUT2_NUMBER_ANCHOR',g.id)
    for(const p of g.prose??[]){if(!g.sourceNodeIds.includes(p.nodeId)||!Array.isArray(p.content)||!p.content.length||!Array.isArray(p.requiresCorrectParts)||p.requiresCorrectParts.some(part=>!knownParts.has(part)))add('LAYOUT2_PROSE',p.id);for(const c of p.content??[])if(c.type==='math'&&/[ぁ-んァ-ン一-龥]/.test(c.latex??''))add('LAYOUT2_PROSE_IN_TEX',p.id)}
  }
  if(!Array.isArray(input.nodeCoverage)||input.nodeCoverage.length!==input.sourceNodeCount||new Set(input.nodeCoverage.map(n=>n.nodeId)).size!==input.sourceNodeCount||allNodeIds.some(id=>!covered.has(id)))add('LAYOUT2_NODE_COVERAGE','all source nodes must have an explicit math/prose disposition')
  return {status:findings.length?'FAIL':'PASS',findings,layoutHash:hash(input),learnerCopyHash:hash(input.groups.map(g=>({id:g.id,prose:g.prose}))),meaningAuditRequired:true}
  } catch(error) { return {status:'FAIL',findings:[...findings,{ruleId:'LAYOUT2_SCHEMA',detail:String(error.message)}]} }
}

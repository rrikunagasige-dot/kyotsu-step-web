import { z } from 'zod'
export type TransformationPart = { type: 'math'; latex: string } | { type: 'slot'; id: string; interactionRef: string } | { type: 'fraction'; numerator: TransformationPart[]; denominator: TransformationPart[] }
const part: z.ZodType<TransformationPart> = z.lazy(() => z.discriminatedUnion('type', [
  z.object({ type: z.literal('math'), latex: z.string() }),
  z.object({ type: z.literal('slot'), id: z.string(), interactionRef: z.string() }),
  z.object({ type: z.literal('fraction'), numerator: z.array(part), denominator: z.array(part) }),
]))
const copy = z.discriminatedUnion('type', [z.object({ type: z.literal('math'), latex: z.string() }), z.object({ type: z.literal('text'), text: z.string() }), z.object({ type: z.literal('term'), text: z.string() })])
const formula = z.object({ left: z.array(part), relation: z.string(), relationSlot: part.optional(), right: z.array(part) })
export const TransformationReadingSchema = z.object({
  schemaVersion: z.literal('transformation-reading/1'), unitId: z.string(), presentationVersion: z.number(), baseIRHash: z.string(), planHash: z.string(), gradingHash: z.string(),
  numberAliases: z.record(z.string(), z.string()).optional(),
  scope: z.object({ nodeIds: z.array(z.string()), stageIds: z.array(z.string()) }),
  groups: z.array(z.object({ id: z.string(), kind: z.enum(['relation-sequence', 'expression-chain', 'independent-comparison']), number: z.number(), numberId: z.string(), boundaryNodeIds: z.array(z.string()).optional(), stageIds: z.array(z.string()), sourceNodeIds: z.array(z.string()), rows: z.array(z.object({
    id: z.string(), sourceNodeId: z.string(), stateRef: z.string(), role: z.enum(['main', 'auxiliary']), visibleAfter: z.array(z.string()), interactionRef: z.string().nullable(), before: z.array(copy), after: z.array(copy), afterVisible: z.boolean(), continuation: z.boolean(), completed: formula, masked: formula,
  })) })),
  proseOverrides: z.array(z.object({ nodeId: z.string(), sourceRefs: z.array(z.string()), visibleAfterNodeId: z.string(), after: z.array(copy) })).optional(),
  interactions: z.array(z.object({ id: z.string(), nodeId: z.string(), blankRole: z.string(), learnerDecision: z.string(), prerequisiteInteractionIds: z.array(z.string()), choices: z.array(z.string()), correctValue: z.string() })),
})
export type TransformationReading = z.infer<typeof TransformationReadingSchema>
export type TransformationFormula = z.infer<typeof formula>
export function projectTransformationView(presentation: TransformationReading, solvedIds: string[] = [], view: { boundarySolvedNodeIds?: string[]; stageId?: string; choicesOpen?: string; hint?: { interactionId: string; parts: z.infer<typeof copy>[] } } = {}) {
  const recorded = new Set(solvedIds), solved = new Set<string>(), allowed = new Set(presentation.interactions.map(c => c.id))
  for (const id of recorded) if (!allowed.has(id)) throw Error('UNKNOWN_COMPLETED_INTERACTION')
  // Existing saved answers do not imply that newly added prerequisites are complete.
  for (let pass = 0; pass < presentation.interactions.length; pass++) for (const c of presentation.interactions) if (recorded.has(c.id) && c.prerequisiteInteractionIds.every(id => solved.has(id))) solved.add(c.id)
  const groups = presentation.groups.filter(g => (!view.stageId || g.stageIds.includes(view.stageId)) && (g.boundaryNodeIds ?? []).every(id => view.boundarySolvedNodeIds?.includes(id))).map(g => ({ id: g.id, kind: g.kind, number: g.number, numberId: g.numberId,
    rows: g.rows.filter(r => r.visibleAfter.every(id => solved.has(id))).map(r => {
      const done = !r.interactionRef || solved.has(r.interactionRef), c = presentation.interactions.find(c => c.id === r.interactionRef)
      return { aliasRefs: Object.entries(presentation.numberAliases ?? {}).filter(([, target]) => target === r.id).map(([id]) => id), id: r.id, sourceNodeId: r.sourceNodeId, stateRef: r.stateRef, role: r.role, continuation: r.continuation, done, before: r.before, after: done && r.afterVisible ? r.after : [], formula: done ? r.completed : r.masked,
        current: !done && c ? { id: c.id, learnerDecision: c.learnerDecision, blankRole: c.blankRole, ...(view.choicesOpen === c.id ? { choices: c.choices } : {}), ...(view.hint?.interactionId === c.id ? { hint: view.hint.parts } : {}) } : null }
    }),
  })).filter(g => g.rows.length)
  return { schemaVersion: 'transformation-visible/1', unitId: presentation.unitId, presentationVersion: presentation.presentationVersion, planHash: presentation.planHash, groups }
}
export type VisibleTransformationGroup = ReturnType<typeof projectTransformationView>['groups'][number]

// P046-R3: explicit QF01 opt-in. Earlier transformation versions are unchanged.
import type { TextbookItem, TextbookReadingBlock, TextbookReadingPart, TextbookUnit } from './textbookSchema'
import type { TextbookAnswerRecord } from './textbook'
export const QF01_R3_METADATA_CANONICAL_SHA256 = '36caca4665ca60eb59b5ef54c752c383eb93c5e5a54a84e391f9e1bd165b1122'
export const QF01_R3_COMPILED_BINDING = Object.freeze({
  irHash: '37a6c3af4e2bd4f9dec007efb927542e8a0b7e1577414e022a12b14db9e6583d',
  baseIRHash: '37a6c3af4e2bd4f9dec007efb927542e8a0b7e1577414e022a12b14db9e6583d',
  planHash: '6228820489bf7b7bb6751565f6d065bcd5e7a0cc253a1338f6b62e1939f11c6e',
  constructionDesignHash: '57d9d7c7bc2ac3f215ae953a51b8d4f7c87487024c85bb83a4b7127dd22fb23e',
  layoutDesignHash: 'c85596a851a4127c71fe53f1a18da21451a52f7c406206ea0b2f15f18aad4923',
  learnerCopyHash: 'de369a7064304cb525a3d05aea411154644120571bb88666a46cad71887b4e24',
  compiledPresentationHash: 'c3c68b548f29467483ac1f5645bce4063fa9412d099d2e7f96391f5d4714daf0',
})
type R3Math = {kind:'rational';n:string;d:string} | {kind:'symbol';name:string} | {kind:'add';args:R3Math[]} | {kind:'multiply';args:R3Math[]} | {kind:'power';base:R3Math;exponent:number}
type R3Ref = {blockId:string;partIndex:number;blockHash:string;partHash:string}
type R3Operand = R3Math | {kind:'function-application';name:'f';functionDefinitionRef:R3Ref;argument:R3Math} | {kind:'named-quantity';name:'output';label:'出てくる数';sourceRef:R3Ref}
type R3Relation = {kind:'relation';operator:'='|'<'|'<='|'>'|'>=';left:R3Operand;right:R3Operand}
type R3Statement = R3Relation | {kind:'expression';expression:R3Math} | {kind:'conjunction';connective:'かつ';statements:R3Relation[]} | {kind:'relation-chain';operands:R3Math[];operators:('<'|'<='|'>'|'>=')[]}
export type QF01R3Owner = {schemaVersion:'qf01-mixed-owner/1';contextId:string;statement:R3Statement}
type R3Notation = Record<string,{product?:'times'|'implicit';group?:boolean;explicitNegativeOne?:boolean;signedCoefficient?:boolean;signedAddend?:boolean}>
const r3Math: z.ZodType<R3Math> = z.lazy(()=>z.union([
 z.object({kind:z.literal('rational'),n:z.string().regex(/^-?\d{1,30}$/),d:z.string().regex(/^[1-9]\d{0,29}$/)}).strict(),
 z.object({kind:z.literal('symbol'),name:z.string().regex(/^[a-zA-Z][a-zA-Z0-9_]{0,15}$/)}).strict(),
 z.object({kind:z.enum(['add','multiply']),args:z.array(r3Math).min(2).max(12)}).strict(),
 z.object({kind:z.literal('power'),base:r3Math,exponent:z.number().int().min(0).max(4)}).strict(),
]))
const r3Ref = z.object({blockId:z.string(),partIndex:z.number().int().nonnegative(),blockHash:z.string().length(64),partHash:z.string().length(64)}).strict()
const r3Operand:z.ZodType<R3Operand> = z.union([r3Math,z.object({kind:z.literal('function-application'),name:z.literal('f'),functionDefinitionRef:r3Ref,argument:r3Math}).strict(),z.object({kind:z.literal('named-quantity'),name:z.literal('output'),label:z.literal('出てくる数'),sourceRef:r3Ref}).strict()])
const r3Relation:z.ZodType<R3Relation> = z.object({kind:z.literal('relation'),operator:z.enum(['=','<','<=','>','>=']),left:r3Operand,right:r3Operand}).strict()
export const QF01R3OwnerSchema:z.ZodType<QF01R3Owner> = z.object({schemaVersion:z.literal('qf01-mixed-owner/1'),contextId:z.enum(['qf01-r3-context-rule-linear','qf01-r3-context-rule-square','qf01-r3-context-rectangle']),statement:z.union([r3Relation,z.object({kind:z.literal('expression'),expression:r3Math}).strict(),z.object({kind:z.literal('conjunction'),connective:z.literal('かつ'),statements:z.array(r3Relation).length(2)}).strict(),z.object({kind:z.literal('relation-chain'),operands:z.array(r3Math).length(3),operators:z.array(z.enum(['<','<=','>','>='])).length(2)}).strict()])}).strict()
export function qf01R3Path(object:unknown,path:string):unknown {
 if(!path||!path.split('.').every(k=>/^(?:[a-zA-Z][a-zA-Z0-9_]*|\d+)$/.test(k)&&!['constructor','prototype','__proto__'].includes(k)))throw Error('R3_UNSAFE_PATH')
 return path.split('.').reduce<unknown>((v,k)=>{if(!v||typeof v!=='object'||!Object.hasOwn(v,k))throw Error('R3_UNKNOWN_PATH');return (v as Record<string,unknown>)[k]},object)
}
export function formatQF01R3Owner(owner:QF01R3Owner,{targetPath='',mask=false,notation={},slotMarker='§0§'}:{targetPath?:string;mask?:boolean;notation?:R3Notation;slotMarker?:'§0§'|'\\boxed{\\square}'}={}):string {
 QF01R3OwnerSchema.parse(owner);if(mask)qf01R3Path(owner,targetPath)
 const styleSchema=z.object({product:z.enum(['times','implicit']).optional(),group:z.boolean().optional(),explicitNegativeOne:z.boolean().optional(),signedCoefficient:z.boolean().optional(),signedAddend:z.boolean().optional()}).strict()
 for(const[path,style]of Object.entries(notation)){styleSchema.parse(style);const n=qf01R3Path(owner,path) as {kind:string};if(style.product&&n.kind!=='multiply'||style.group&&n.kind!=='add'||style.explicitNegativeOne&&n.kind!=='multiply'||(style.signedCoefficient||style.signedAddend)&&n.kind!=='multiply')throw Error('R3_NOTATION_TARGET')}
 let count=0;const walk=(n:R3Operand|R3Statement,path:string):string=>{
 if(++count>400)throw Error('R3_AST_LIMIT');if(mask&&path===targetPath)return slotMarker
 const style=notation[path]??{}
 if(n.kind==='function-application')return 'f('+walk(n.argument,path+'.argument')+')'
 if(n.kind==='named-quantity')return '\\text{'+n.label+'}'
 if(n.kind==='relation')return walk(n.left,path+'.left')+(n.operator==='<='?'\\le':n.operator==='>='?'\\ge':n.operator)+walk(n.right,path+'.right')
 if(n.kind==='expression')return walk(n.expression,path+'.expression')
 if(n.kind==='conjunction')return n.statements.map((s,j)=>walk(s,path+'.statements.'+j)).join('\\text{ かつ }')
 if(n.kind==='relation-chain')return n.operands.map((x,j)=>(j?(n.operators[j-1]==='<='?'\\le':n.operators[j-1]==='>='?'\\ge':n.operators[j-1]):'')+walk(x,path+'.operands.'+j)).join('')
 if(n.kind==='add')return n.args.map((a,j)=>{let v=walk(a,path+'.args.'+j);if(notation[path+'.args.'+j]?.group)v='('+v+')';return(j&&!v.startsWith('-')&&!(mask&&(notation[path+'.args.'+j]?.signedCoefficient||notation[path+'.args.'+j]?.signedAddend)&&(targetPath===path+'.args.'+j||targetPath.startsWith(path+'.args.'+j+'.')))?'+':'')+v}).join('')
 if(n.kind==='multiply'){
 if(n.args.length===2&&n.args[0].kind==='rational'&&n.args[0].n==='-1'&&n.args[0].d==='1'&&!style.explicitNegativeOne){let v=walk(n.args[1],path+'.args.1');if(n.args[1].kind==='add')v='('+v+')';return '-'+v}
 return n.args.map((a,j)=>{let v=walk(a,path+'.args.'+j);if(a.kind==='add'||a.kind==='rational'&&a.n.startsWith('-')&&j>0)v='('+v+')';return j&&style.product==='times'?'\\times'+v:v}).join('')
 }
 if(n.kind==='power'){let v=walk(n.base,path+'.base');if(n.base.kind!=='symbol'&&!(n.base.kind==='rational'&&!n.base.n.startsWith('-')))v='('+v+')';return v+'^{'+n.exponent+'}'}
 if(n.kind==='symbol')return n.name.includes('_')?n.name.replace('_','_{')+'}':n.name
 return n.d==='1'?n.n:'\\frac{'+n.n+'}{'+n.d+'}'
 };return walk(owner.statement,'statement')
}
type R3Piece = {kind:'whole-part'|'slot'|'text-span';blockId?:string;partIndex:number;start?:number;end?:number;sourcePartSHA256?:string;textSHA256?:string}
type R3Interaction={id:string;nodeId:string;contextId:string;stageId:string;source:{blockId:string;partIndex:number;partSHA256:string};registryBlockId:string;layoutKind:'paragraph'|'equation';answerDomain:'semantic'|'math';progressionRequires:string[];projection:{pending:{pieces?:R3Piece[];maskTargetPart:number};postAnswerTail?:unknown[]};scaffold:{phase:string};wrongReasonByChoiceIndex:(string|null)[];completionResultUnit:{canonicalBlockId:string}}
type R3SourceMap={canonicalOrder:number;authorBlockId:string;authorBlockSHA256:string;authorKeyOrder:string[];authorAttributes:Record<string,unknown>;unitBlockId:string;unitBlockSHA256:string;parts:{authorPartIndex:number;unitPartIndex:number;semanticId:string;authorPartSHA256:string;unitPartSHA256:string}[]}
type R3ASTBinding={interactionId:string;ownerAST:QF01R3Owner;ownerASTHash:string;targetPath:string;targetAST:unknown;targetASTHash:string;notation:R3Notation;targetStatement:R3Statement;targetNotation:R3Notation;sourceOwnerRef:{blockId:string;blockHash:string;partsHash:string;targetPartIndex:number;targetPartHash:string}}
type R3Record={equation?:{displayNumber:number|null}|null;id:string;sourceRef:{blockId:string};availableWhen:{allSolved:string[]};contextId:string;stageId:string}
type R3Stage={stageId:string;contextId:string;headerSourceRef:string;conclusionRecordIds:string[];fullLessonBlockRefs:string[];availableWhen:{allSolved:string[]};terminalSourceRef:string}
export type QF01R3Metadata={schemaVersion:'qf01-reading-presentation/3';unitId:string;revision:3;unitParsedCanonicalSHA256:string;canonicalBlockIds:string[];sourceMap:R3SourceMap[];interactionRegistryBlocks:{blockId:string;itemId:string;channel:string;render:boolean;blockSHA256:string}[];interactions:R3Interaction[];blockVisibility:{blockId:string;visibleWhen:{allSolved:string[];helpOrSolvedFor?:string};mode?:'normal'|'help-or-solved'}[];ownerASTBindings:R3ASTBinding[];generatedPlanBinding:Record<string,unknown>;viewContracts:{FRAME_CONTRACT:{frames:{frameId:string;contextId:string;stageIds:string[];headerBlockRef:string;givenBlockRefs:string[];figureBlockRefs:string[]}[];stagePreludeRefs:Record<string,string[]>;単元block配置:{'unit-summary':{sourceRefs:string[]};'unit-purpose':{sourceRef:string}}};RESULT_REGISTRY:{records:R3Record[]};INTERACTION_REFERENCES:{rows:{currentInteractionId:string;topReferenceRecordIds:string[];nearbyReferenceRecordIds:string[]}[]};STAGE_HISTORY_CONTRACT:{stages:R3Stage[]};FIGURE_POLICY:{placement:{requiredCurrentInteractionIds:string[]};figureId:string}}}
export type QF01R3Validated={unit:TextbookUnit;metadata:QF01R3Metadata;blocks:Map<string,TextbookReadingBlock>;items:Map<string,TextbookItem>;authorBlocks:Map<string,Record<string,unknown>>}
const sorted=(v:unknown):unknown=>Array.isArray(v)?v.map(sorted):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,sorted((v as Record<string,unknown>)[k])])):v
export async function qf01R3Digest(value:unknown,scheme:'compact'|'pretty'='compact'):Promise<string>{const text=scheme==='compact'?JSON.stringify(sorted(value)):JSON.stringify(value,null,2)+'\n';const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));return Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('')}
const r3Need=(condition:unknown,code:string)=>{if(!condition)throw Error('QF01_R3_'+code)}
function qf01R3HelpGate(m:QF01R3Metadata,rule:QF01R3Metadata['blockVisibility'][number]):string|undefined {
 r3Need(rule.visibleWhen&&Array.isArray(rule.visibleWhen.allSolved)&&rule.visibleWhen.allSolved.every(id=>m.interactions.some(q=>q.id===id)),'VISIBILITY_PREREQUISITE')
 r3Need(rule.mode===undefined||rule.mode==='normal'||rule.mode==='help-or-solved','VISIBILITY_MODE')
 const help=rule.visibleWhen.helpOrSolvedFor
 r3Need(!('helpOrSolvedFor' in rule),'HELP_GATE_STRUCTURE')
 r3Need(rule.mode==='help-or-solved'?typeof help==='string'&&m.interactions.some(q=>q.id===help):help===undefined,'HELP_REFERENCE')
 return help
}

export async function validateQF01R3Reading(unit:TextbookUnit,input:unknown):Promise<QF01R3Validated>{
 r3Need(input&&typeof input==='object','METADATA');const m=input as QF01R3Metadata
 r3Need(await qf01R3Digest(input)===QF01_R3_METADATA_CANONICAL_SHA256,'METADATA_HASH')
 r3Need(unit.unitId==='math-quadratic-qf01'&&unit.revision===3&&m.schemaVersion==='qf01-reading-presentation/3'&&m.unitId===unit.unitId&&m.revision===3,'IDENTITY')
 for(const[k,v]of Object.entries(QF01_R3_COMPILED_BINDING))r3Need(m.generatedPlanBinding?.[k]===v,'COMPILED_BINDING_'+k)
 r3Need(await qf01R3Digest(unit)===m.unitParsedCanonicalSHA256,'UNIT_PARSED_HASH')
 const all=unit.sections.flatMap(s=>s.readingFlow),blocks=new Map(all.map(b=>[b.id,b])),items=new Map(unit.sections.flatMap(s=>s.items).map(i=>[i.id,i])),authorBlocks=new Map<string,Record<string,unknown>>()
 r3Need(all.length===169&&blocks.size===169&&m.sourceMap.length===134&&m.canonicalBlockIds.length===134&&new Set(m.canonicalBlockIds).size===134&&m.interactions.length===35&&new Set(m.interactions.map(q=>q.id)).size===35&&items.size===35,'COUNTS')
 r3Need(JSON.stringify(unit.requiredInteractionRefs)===JSON.stringify(m.interactions.map(q=>q.id)),'REQUIRED_IDS')
 r3Need(m.blockVisibility.length===m.canonicalBlockIds.length&&new Set(m.blockVisibility.map(v=>v.blockId)).size===m.canonicalBlockIds.length,'VISIBILITY_COVERAGE')
 for(const rule of m.blockVisibility){r3Need(m.canonicalBlockIds.includes(rule.blockId),'VISIBILITY_BLOCK');qf01R3HelpGate(m,rule)}
 r3Need(m.interactionRegistryBlocks.length===35,'REGISTRY_COUNT')
 for(const r of m.interactionRegistryBlocks){r3Need(r.channel==='interaction-registry-only'&&!r.render&&!m.canonicalBlockIds.includes(r.blockId),'REGISTRY_CHANNEL');const b=blocks.get(r.blockId);r3Need(b&&await qf01R3Digest(b)===r.blockSHA256&&b.type==='paragraph'&&b.parts.length===1&&b.parts[0].type==='choice'&&b.parts[0].itemId===r.itemId,'REGISTRY_BINDING')}
 for(const[order,s]of m.sourceMap.entries()){
 r3Need(s.canonicalOrder===order&&s.authorBlockId===m.canonicalBlockIds[order]&&s.unitBlockId===s.authorBlockId,'SOURCE_ORDER');const b=blocks.get(s.unitBlockId);r3Need(b&&await qf01R3Digest(b)===s.unitBlockSHA256,'BLOCK_HASH');if(!b)throw Error('R3_BLOCK')
 const author:Record<string,unknown>={id:s.authorBlockId,type:b.type,...s.authorAttributes}
 if(b.type==='paragraph'||b.type==='formula'){author.parts=b.parts.map(p=>Object.fromEntries(Object.entries(p).filter(([key])=>key!=='semanticId')));for(const p of s.parts)r3Need(await qf01R3Digest(b.parts[p.unitPartIndex])===p.unitPartSHA256,'PART_HASH')}
 else if(b.type==='marker'||b.type==='heading')author.text=b.text
 else if(b.type==='figure'){const f=unit.sections.flatMap(s=>s.figures).find(f=>f.id===b.figureId);r3Need(f,'FIGURE');author.figureId=b.figureId;author.alt=f!.alt;author.caption=f!.caption}
 r3Need(await qf01R3Digest(author)===s.authorBlockSHA256,'AUTHOR_RECONSTRUCTION');authorBlocks.set(s.authorBlockId,Object.fromEntries(s.authorKeyOrder.map(k=>[k,author[k]])))
 }
 for(const[qIndex,q]of m.interactions.entries()){
 const b=blocks.get(q.source.blockId),author=authorBlocks.get(q.source.blockId),item=items.get(q.id)
 r3Need(b&&(b.type==='paragraph'||b.type==='formula')&&item&&m.interactionRegistryBlocks.some(r=>r.itemId===q.id&&r.blockId===q.registryBlockId),'TARGET_ITEM')
 const parts=author?.parts as unknown[];r3Need(parts&&await qf01R3Digest(parts[q.source.partIndex])===q.source.partSHA256,'TARGET_PART')
 r3Need(q.progressionRequires.every(id=>m.interactions.slice(0,qIndex).some(p=>p.id===id)),'FUTURE_PREREQUISITE')
 if(q.answerDomain==='math'){
 const a=m.ownerASTBindings.find(a=>a.interactionId===q.id);r3Need(a,'MATH_OWNER');if(!a)throw Error('R3_MATH_OWNER');QF01R3OwnerSchema.parse(a.ownerAST)
 r3Need(await qf01R3Digest(a.ownerAST,'pretty')===a.ownerASTHash&&await qf01R3Digest(a.targetAST,'pretty')===a.targetASTHash&&await qf01R3Digest(qf01R3Path(a.ownerAST,a.targetPath),'pretty')===a.targetASTHash,'OWNER_TARGET_HASH')
 r3Need(a.sourceOwnerRef.blockId===q.source.blockId&&a.sourceOwnerRef.targetPartIndex===q.source.partIndex&&await qf01R3Digest(author,'pretty')===a.sourceOwnerRef.blockHash,'OWNER_SOURCE')
 const normal=(s:string)=>s.replace(/\\text\{([^{}]*)\}/g,'$1').replaceAll('\\left','').replaceAll('\\right','').replaceAll('\\times','×').replaceAll('\\cdot','×').replaceAll('−','-').replaceAll('²','^2').replace(/[{}\s]/g,'')
 const original=parts as {type:string;latex?:string;text?:string}[],target=original[q.source.partIndex]
 const source=b!.type==='paragraph'?target.latex:original.map(p=>p.latex??p.text).join('')
 r3Need(normal(formatQF01R3Owner(a.ownerAST,{notation:a.notation}))===normal(source??''),'OWNER_SURFACE')
 const maskExpected=b!.type==='paragraph'?'§0§':original.map((p,j)=>j===q.source.partIndex?'§0§':p.latex??p.text).join('')
 r3Need(normal(formatQF01R3Owner(a.ownerAST,{targetPath:a.targetPath,mask:true,notation:a.notation}))===normal(maskExpected),'OWNER_MASK')
 }else r3Need(!m.ownerASTBindings.some(a=>a.interactionId===q.id),'SEMANTIC_AST_CONFUSION')
 }
 return{unit,metadata:m,blocks,items,authorBlocks}
}
export function qf01R3Solved(source:QF01R3Validated,answers:Record<string,TextbookAnswerRecord>|undefined):Set<string>{
 const solved=new Set<string>(),normal=(s:string)=>s.trim().replace(/\s/g,'').replaceAll('−','-')
 for(const q of source.metadata.interactions){const item=source.items.get(q.id)!,r=answers?.[q.id];if(r&&r.itemId===q.id&&r.resolved&&typeof r.value==='string'&&[item.answer,...item.acceptedAnswers].some(v=>normal(v)===normal(r.value))&&q.progressionRequires.every(id=>solved.has(id)))solved.add(q.id)}return solved
}
export type QF01R3VisibleBlock={source:TextbookReadingBlock;parts?:TextbookReadingPart[];formulaSource?:string;slotItemId?:string;sourceRole:string}
export function projectQF01R3Block(source:QF01R3Validated,id:string,solved:Set<string>,{helpFor=null,recorded=false}:{helpFor?:string|null;recorded?:boolean}={}):QF01R3VisibleBlock|undefined{
 const m=source.metadata;r3Need(m.canonicalBlockIds.includes(id),'NONCANONICAL_RENDER');const block=source.blocks.get(id)!,rule=m.blockVisibility.find(v=>v.blockId===id);r3Need(rule,'MISSING_GATE')
 const help=qf01R3HelpGate(m,rule!)
 if(!rule!.visibleWhen.allSolved.every(s=>solved.has(s)))return undefined
 if(help&&!solved.has(help)&&helpFor!==help)return undefined
 const q=m.interactions.find(q=>q.source.blockId===id),role=String(m.sourceMap.find(s=>s.unitBlockId===id)!.authorAttributes.role)
 if(q&&recorded&&!solved.has(q.id))return undefined
 if(!q||solved.has(q.id))return{source:block,sourceRole:role,...(block.type==='paragraph'||block.type==='formula'?{parts:block.parts}: {})}
 if(!q.progressionRequires.every(id=>solved.has(id)))return undefined
 if(q.answerDomain==='math'&&block.type==='formula'){const a=m.ownerASTBindings.find(a=>a.interactionId===q.id)!;return{source:block,sourceRole:role,formulaSource:formatQF01R3Owner(a.ownerAST,{targetPath:a.targetPath,mask:true,notation:a.notation}),slotItemId:q.id}}
 r3Need(block.type==='paragraph','PENDING_PARAGRAPH');if(block.type!=='paragraph')throw Error('R3_PARAGRAPH')
 const pieces=q.projection.pending.pieces;r3Need(pieces,'MISSING_PIECES');const parts=pieces!.map(piece=>{const part=block.parts[piece.partIndex];if(piece.kind==='slot')return{type:'choice' as const,itemId:q.id};if(piece.kind==='whole-part')return part;r3Need(part.type==='text'&&piece.start!==undefined&&piece.end!==undefined,'SPAN');return{type:'text' as const,text:(part as {text:string}).text.slice(piece.start,piece.end)}})
 return{source:block,sourceRole:role,parts,slotItemId:q.id}
}

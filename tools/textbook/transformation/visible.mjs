import {projectTransformationV3} from './v3.mjs';
/** Answer keys and future statements never enter a visible projection. */
import {projectTransformationV2} from './v2.mjs';
export function projectTransformationView(presentation,solvedIds=[],view={}){
 if(Object.hasOwn(presentation??{},'mixedCanonical'))return projectMixedCanonicalView(presentation,solvedIds,view);
 if(presentation?.schemaVersion==='transformation-reading/3')return projectTransformationV3(presentation,solvedIds,view);
 if(presentation?.schemaVersion==='transformation-reading/2')return projectTransformationV2(presentation,solvedIds,view);
 const recorded=new Set(solvedIds),solved=new Set(),allowed=new Set(presentation.interactions.map(c=>c.id));
 for(const id of recorded)if(!allowed.has(id))throw Error('UNKNOWN_COMPLETED_INTERACTION');
 // Legacy records may contain later answers while new prerequisites are pending.
 // Preserve those records; only expose the dependency-closed subset.
 for(let pass=0;pass<presentation.interactions.length;pass++)for(const c of presentation.interactions)if(recorded.has(c.id)&&c.prerequisiteInteractionIds.every(id=>solved.has(id)))solved.add(c.id);
 const groups=presentation.groups.filter(g=>(!view.stageId||g.stageIds.includes(view.stageId))&&(g.boundaryNodeIds??[]).every(id=>view.boundarySolvedNodeIds?.includes(id))).map(g=>({id:g.id,kind:g.kind,number:g.number,numberId:g.numberId,
 rows:g.rows.filter(r=>r.visibleAfter.every(id=>solved.has(id))).map(r=>{
  const done=!r.interactionRef||solved.has(r.interactionRef),c=presentation.interactions.find(c=>c.id===r.interactionRef);
  return {aliasRefs:Object.entries(presentation.numberAliases??{}).filter(([,target])=>target===r.id).map(([id])=>id),id:r.id,sourceNodeId:r.sourceNodeId,stateRef:r.stateRef,role:r.role,continuation:r.continuation,done,before:r.before,after:done&&r.afterVisible?r.after:[],formula:done?r.completed:r.masked,
   current:!done&&c?{id:c.id,learnerDecision:c.learnerDecision,blankRole:c.blankRole,...(view.choicesOpen===c.id?{choices:c.choices}:{}),...(view.hint?.interactionId===c.id?{hint:view.hint.parts}:{})}:null};
 })})).filter(g=>g.rows.length);
 return {schemaVersion:'transformation-visible/1',unitId:presentation.unitId,presentationVersion:presentation.presentationVersion,planHash:presentation.planHash,groups};
}

import {formatMixedOwner,mixedCanonicalHash} from './schema.mjs';
import {hash} from '../util.mjs';
/** The verifier uses the same exact canonical pending projection as the app. */
export function projectMixedCanonicalView(p,recordedIds=[],view={}){
 if(p.schemaVersion!=='transformation-reading/1'||p.mixedCanonical!=='qf01-r3/1')throw Error('MIXED_VISIBLE_SCHEMA');
 const {compiledPresentationHash,...body}=p;if(mixedCanonicalHash(body)!==compiledPresentationHash)throw Error('MIXED_COMPILED_HASH');
 const items=p.canonical.interactions.interactions,ids=new Set(items.map(i=>i.id)),recorded=new Set(recordedIds),solved=new Set();
 if(recordedIds.length!==recorded.size||recordedIds.some(id=>!ids.has(id)))throw Error('UNKNOWN_COMPLETED_INTERACTION');
 for(let pass=0;pass<items.length;pass++)for(const i of items)if(recorded.has(i.id)&&i.progressionRequires.every(id=>solved.has(id)))solved.add(i.id);
 const eligible=items.filter(i=>!solved.has(i.id)&&i.progressionRequires.every(id=>solved.has(id))),current=eligible[0]??null;
 if(view.choicesOpen&&view.choicesOpen!==current?.id)throw Error('MIXED_NOT_CURRENT_CHOICES');
 const source=p.canonical.fullLesson.blocks,visibility=new Map(p.canonical.interactions.blockVisibility.map(b=>[b.blockId,b]));
 const visible=b=>{const gate=visibility.get(b.id);if(!gate||!gate.visibleWhen.allSolved.every(id=>solved.has(id)))return false;if(gate.visibleWhen.helpOrSolvedFor&&!solved.has(gate.visibleWhen.helpOrSolvedFor)&&view.helpFor!==gate.visibleWhen.helpOrSolvedFor)return false;return true};
 const project=b=>{
  const item=items.find(i=>i.source.blockId===b.id),done=!item||solved.has(item.id),base={id:b.id,type:b.type,role:b.role,contextId:b.contextId,stageId:b.stageId};
  if(done)return {...base,...(b.parts?{parts:b.parts}:{}),...(b.type==='figure'?{assetOrigin:b.asset}:{}),...(b.type==='marker'?{label:b.label??b.text}:{}),readonly:true};
  const interaction={id:item.id,answerDomain:item.answerDomain,...(view.choicesOpen===item.id?{choices:item.choices}:{})};
  if(b.type==='formula'){const binding=p.astBindings.find(x=>x.interactionId===item.id);if(!binding)throw Error('MIXED_MISSING_OWNER');return {...base,parts:[{type:'math',latex:formatMixedOwner(binding.ownerAST,{targetPath:binding.targetPath,mask:true,notation:binding.notation})}],interaction}}
  const parts=item.projection.pending.pieces.map(piece=>{const part=b.parts[piece.partIndex];if(piece.kind==='slot')return {type:'slot',id:item.id,answerDomain:item.answerDomain};if(piece.kind==='whole-part')return part;if(piece.kind==='text-span'&&part.type==='text')return {type:'text',text:part.text.slice(piece.start,piece.end)};throw Error('MIXED_UNKNOWN_PENDING_PIECE')});
  return {...base,parts,interaction};
 };
 const projected=source.filter(visible),byId=new Map(projected.map(b=>[b.id,b])),registry=p.presentation['RESULT_REGISTRY.json'].value.records,currentRefs=p.presentation['INTERACTION_REFERENCES.json'].value.rows.find(r=>r.currentInteractionId===current?.id);
 const record=id=>{const r=registry.find(r=>r.id===id),b=r&&byId.get(r.sourceRef.blockId);if(!r||!b||!r.availableWhen.allSolved.every(i=>solved.has(i))||items.some(i=>i.source.blockId===b.id&&!solved.has(i.id)))throw Error('MIXED_REFERENCE_NOT_ESTABLISHED');return {id,source:project(b)}};
 const top=(currentRefs?.topReferenceRecordIds??[]).map(record),nearby=(currentRefs?.nearbyReferenceRecordIds??[]).map(record);
 const histories=p.presentation['STAGE_HISTORY_CONTRACT.json'].value.stages.filter(s=>s.availableWhen.allSolved.every(id=>solved.has(id))).map(s=>({stageId:s.stageId,contextId:s.contextId,conclusions:s.conclusionRecordIds.map(record),fullLessonBlockRefs:s.fullLessonBlockRefs.filter(id=>byId.has(id))}));
 return {schemaVersion:'transformation-visible/1',mixedCanonical:'qf01-r3/1',unitId:p.unitId,planHash:p.planHash,currentInteractionId:current?.id??null,topReferences:top,nearbyReferences:nearby,blocks:projected.filter(b=>!view.stageId||b.stageId===view.stageId||b.contextId===null).map(project),history:histories};
}

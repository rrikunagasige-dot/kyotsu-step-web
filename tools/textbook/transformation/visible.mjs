/** Answer keys and future statements never enter a visible projection. */
export function projectTransformationView(presentation,solvedIds=[],view={}){
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

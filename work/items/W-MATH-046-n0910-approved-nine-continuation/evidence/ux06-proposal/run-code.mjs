/** Thin input materialization of the authored proposal, not a new teaching engine. No Runtime/Store. */
import fs from 'node:fs';
import crypto from 'node:crypto';
const dir='/tmp/w046-r04', root='/workspace/scratch/6ff917b2ec4a/w046-ux05-full';
const {operate}=await import(root+'/tools/textbook/operations.mjs');
const {rat,sym,add,mul,pow,expr}=await import(root+'/tools/textbook/solution/expression.mjs');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const raw=fs.readFileSync(dir+'/PROPOSAL.json'), proposal=JSON.parse(raw), proposalSHA256=sha(raw);
const write=(name,obj)=>fs.writeFileSync(dir+'/'+name,JSON.stringify(obj,null,2)+'\n');
const partFact=(node,key)=>node+'-part-'+key+'-certified';
const producedNodeResults=new Set(proposal.blocks.map(b=>b.nodeId+'-result'));
const isKnowledge=(text)=>!/^今回の目標：/.test(text)&&!/(?:受講完了を前提にしない|完了を仮定しない|資産あり)/.test(text);
const basisIds=b=>b.availableBefore.flatMap((text,i)=>isKnowledge(text)?[b.nodeId+'-declared-basis-'+(i+1)]:[]);
const knowledge=[...new Set(proposal.blocks.flatMap(b=>[...b.upstreamResultRefs.filter(x=>!producedNodeResults.has(x)),...basisIds(b)]))];
const knowledgeEvidence=proposal.blocks.flatMap(b=>b.availableBefore.map((text,i)=>({factId:b.nodeId+'-declared-basis-'+(i+1),text,status:isKnowledge(text)?'AUTHOR_DECLARED_MATHEMATICAL_GROUND_NOT_PERSONAL_MASTERY':/^今回の目標：/.test(text)?'GOAL_CONTEXT_NOT_KNOWLEDGE':'SOURCE_ASSET_EXISTS_NOT_LEARNER_KNOWLEDGE'})));
const solution=[],blankNodes=[],sourceMap=[];
for(const b of proposal.blocks){
 const byKey=new Map(b.parts.map(p=>[p.key,p]));let previous;
 const baseFacts=[...b.upstreamResultRefs,...basisIds(b)];
 for(const [ri,r] of b.visibleSequence.entries()){
  const keys=r.partKeys.length?r.partKeys:[null];
  for(const [ki,key] of keys.entries()){
   const p=key?byKey.get(key):null;if(key&&!p)throw Error('unknown part '+key);
   const id=b.nodeId+'-semantic-row-'+(ri+1)+(key?'-'+key:'-shown'), result=id+'-result';
   const inputs=[...new Set([...baseFacts,...r.requiresCorrectKeys.map(k=>partFact(b.nodeId,k)),...(previous?[previous]:[])])];
   const statement=r.template.replace(/\{([A-Za-z][\w-]*)\}/g,(m,k)=>byKey.has(k)?byKey.get(k).expected:m);
   const outFacts=[result,...(key?[partFact(b.nodeId,key)]:[])];
   solution.push({id,inputFacts:inputs,outputFacts:outFacts,goal:statement,operation:{kind:p?p.learningAction:'explain-or-reuse-shown-relation',targets:p?[p.partId]:[r.id]},basisRefs:baseFacts,sourceNodeId:b.nodeId,rowRef:r.id,intro:r.intro,learnerPrompt:p?.prompt??null});
   sourceMap.push({stepId:id,nodeId:b.nodeId,rowId:r.id,partId:p?.partId??null,origin:'AI_AUTHORED_PROPOSAL_SEMANTIC_STAGE_MAPPED_BY_THIN_ADAPTER',partOrderWithinRow:ki+1});
   previous=result;
   if(p)blankNodes.push({id:p.partId,operation:{kind:p.learningAction,targets:[p.key]},produces:[partFact(b.nodeId,key)],goal:p.prompt,nextUse:b.completion,sourceRefs:[b.nodeId,r.id],proposalExpected:p.expected});
  }
 }
 solution.push({id:b.nodeId+'-semantic-conclusion',inputFacts:[previous,...b.parts.map(p=>partFact(b.nodeId,p.key))],outputFacts:[b.nodeId+'-result'],goal:b.afterVisibleText,operation:{kind:'reassemble',targets:[b.nodeId+'-result']},basisRefs:baseFacts,sourceNodeId:b.nodeId});
}
const teachingInput={solution,knowledge,options:{budget:3}};
const teaching=operate('teaching-candidates',teachingInput);
const blankInput={nodes:blankNodes};const blanks=operate('blank-candidates',blankInput);
const rawDecisions=blanks.candidates.map((c,i)=>({candidateId:c.nodeId+'#'+c.targetPath,origin:'EXISTING_CODE_ENUMERATED_CANDIDATE_PLUS_AI_ADOPTION',nodeId:c.nodeId,targetPath:c.targetPath,decision:c.targetPath==='operation.targets.0'?'ADOPT':'REJECT',reason:c.targetPath==='operation.targets.0'?'実案の文字・数・符号のslotを生徒が構成する対象。行と前提・本文は別途非作者審査する。':'生成事実IDやoperation.kindという私有metadataを学習者へ答えさせない。',evidence:{proposalSHA256,partId:c.nodeId},formalEligibilityReceipt:false}));
// The raw candidate API has no eligibility field. Do not invent one to obtain ADOPT PASS.
const rawPendingPlan={candidates:rawDecisions.map(d=>({id:d.candidateId}))};
const rawPendingDecisions=rawDecisions.map(d=>({candidateId:d.candidateId,decision:'UNRESOLVED',reason:'Raw API provides no graph eligibility; AI disposition is recorded separately, not promoted to CODE eligibility.',evidence:'raw-blank-ai-decisions.json'}));
const rawDecisionCheck=operate('interaction-plan',{plan:rawPendingPlan,decisions:rawPendingDecisions});
// Bind the real representative six slots to the actual proposed polynomial stages.
const b=proposal.blocks.find(b=>b.nodeId==='n09-decimal-method');
const A=sym('A'),B=sym('B'),S=add(A,B);
const vals=[pow(S,2),mul(S,S),add(mul(S,A),mul(S,B)),add(pow(A,2),mul(B,A),mul(A,B),pow(B,2)),add(pow(A,2),mul(A,B),mul(A,B),pow(B,2)),add(pow(A,2),mul(rat(2),A,B),pow(B,2))];
const basis=['square-definition','distributive-law','commutative-law','collect-like-terms'];
const graph={schemaVersion:'solution-graph/1',id:'ux06-decimal-method',variable:'A',parameters:['B'],initialFacts:basis,givens:[{id:'ux06-given-square',statement:expr(vals[0])}],rootStateId:'ux06-s0',goalStateIds:['ux06-s5'],states:vals.map((v,i)=>({id:'ux06-s'+i,statement:expr(v),activeVariable:'A',fixedParameters:['B'],facts:i?['ux06-fact'+i]:[]})),transitions:vals.slice(1).map((_,i)=>({id:'ux06-e'+i,from:'ux06-s'+i,to:'ux06-s'+(i+1),ruleId:'rewrite',requires:i?['ux06-fact'+i]:[],produces:['ux06-fact'+(i+1)],basisRefs:[[basis[0]],[basis[1]],[basis[1]],[basis[2]],[basis[3]]][i]}))};
const positions={ux06BinomialBase:0,ux06DistributeA:1,ux06DistributeB:1,ux06CrossProduct:2,ux06LastSquare:2,ux06LikeTermCount:4};
const candidates=b.parts.map(p=>({id:p.partId,stateId:'ux06-s'+positions[p.key],availableFacts:[...basis,...(positions[p.key]?['ux06-fact'+positions[p.key]]:[])],learnerDecision:p.learningAction,nextUse:p.key==='ux06LikeTermCount'?'141²/142²の中項構成へ適用':'同じ和の平方の次の意味段階へ',target:p.key}));
const graphBlankInput={graph,candidates};const graphBlankPlan=operate('interaction-plan',graphBlankInput);
const graphDecisions=candidates.map(c=>({candidateId:c.id,decision:'ADOPT',reason:'平方→分配→四項→同類項という本人指定の導出で、式内の因子/積/係数を構成する。最終選択と実表示の独立審査は別。',evidence:{proposalSHA256,partId:c.id}}));
const graphDecisionCheck=operate('interaction-plan',{plan:graphBlankPlan,decisions:graphDecisions});
const mathInput={kind:'solution',graph};const math=operate('solve',mathInput);
const graphTeaching=operate('teaching-candidates',{graph,options:{budget:3}});
write('CODE_INPUTS.json',{proposalSHA256,sourceSHA:proposal.sourceSHA,knowledgeEvidence,teachingInput,blankInput,sourceMap,mathInput,graphBlankInput,graphDecisions,scopeLimits:['AI authored semantic decomposition; CODE reordered/enumerated/checked it.','The target-only AI raw decisions are not CODE eligibility receipts.','Full prose IR/visible solution review/construction/actual images were not executed by this script.']});
write('raw-blank-ai-decisions.json',{proposalSHA256,decisions:rawDecisions});
write('CODE_OUTPUTS.json',{proposalSHA256,sourceSHA:proposal.sourceSHA,teaching,blanks,rawDecisionCheck,graphBlankPlan,graphDecisionCheck,math,graphTeaching,automaticAcceptance:false});
if(sha(fs.readFileSync(dir+'/PROPOSAL.json'))!==proposalSHA256)throw Error('proposal changed during execution');
const summary={proposalSHA256,proposalNodes:proposal.blocks.length,authoredSemanticSteps:solution.length,authoredParts:blankNodes.length,knowledgeFacts:knowledge.length,teachingStatus:teaching.status,teachingCandidates:teaching.candidates.length,rawCandidates:blanks.candidates.length,rawAIDispositions:Object.fromEntries(['ADOPT','REJECT'].map(x=>[x,rawDecisions.filter(d=>d.decision===x).length])),rawDecisionCheck:rawDecisionCheck.status,graphBlank:graphBlankPlan.status,representativeCandidates:candidates.length,representativeAdoption:graphDecisionCheck.status,math:math.status,mathReason:math.reason,graphTeaching:graphTeaching.status,proseIR:'NOT_RUN',meaningImport:'NOT_RUN',formalStoreReceipt:false};
write('CODE_SUMMARY.json',summary);console.log(JSON.stringify(summary));

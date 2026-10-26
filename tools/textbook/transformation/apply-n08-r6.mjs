/** Emit the approved r6 artifacts without mutating the frozen r4/r5 source files. */
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {hash,writeJSON} from '../util.mjs';
import {materializeN08Revision6Design} from './n08-r6.mjs';
import {compileTransformationPresentation} from './compile.mjs';
import {verifyConstructionMath} from '../interaction/construction.mjs';
export function applyN08Revision6(ir,bundle){
 const design=materializeN08Revision6Design(ir,{sourceBundle:bundle}),math=verifyConstructionMath(design.constructionPlan);
 if(math.status!=='PASS')throw Error(JSON.stringify(math));
 const compiled=compileTransformationPresentation(ir,design.transformationPlan);if(compiled.status!=='PASS')throw Error(JSON.stringify(compiled));
 const data=JSON.parse(JSON.stringify(ir)),byNode=new Map(design.nodes.map(n=>[n.sourceNodeId,n])),removed=new Set(design.nodes.filter(n=>n.action==='construction'||n.action==='worked-substitution').map(n=>n.oldInteractionId));
 data.sourceProvenance={revision:5,sourceIRHash:hash(ir),approvedCommit:ir.approvedCommit,proposalHash:ir.proposalHash,irHash:ir.irHash};
 data.approvedCommit=null;data.proposalHash='8106181787d61bf7ef474c09acd89a41cdb61537bff529c5f7ece9c78cfe883e';
 data.applicationApproval={workId:'W-MATH-040',proposalId:'P-001',proposalHash:data.proposalHash,applicationApprovalRef:'work/items/W-MATH-040-n08-construction-layout/APPROVAL_APPLICATION.json',implementationCommit:null};
 data.nodes=data.nodes.map(n=>({...n,interaction:byNode.get(n.id).interactionId}));
 data.unit.revision=6;data.unit.constructionItems=design.constructionPlan.interactions.map(i=>({...i,sectionId:'lesson'}));
 data.unit.requiredInteractionRefs=design.nodes.flatMap(n=>n.interactionId?[n.interactionId]:[]);
 data.unit.sections=data.unit.sections.map(s=>({...s,items:s.items.filter(i=>!removed.has(i.id)),readingFlow:s.readingFlow.flatMap(b=>{
  if(!b.parts?.some(p=>p.type==='choice'&&removed.has(p.itemId)))return [b];
  if(b.parts.some(p=>p.type==='choice'&&p.itemId===byNode.get('n08-q04-substitute').oldInteractionId))return [{...b,parts:b.parts.map(p=>p.type==='choice'?{type:'math',latex:'-(-5)'}:p)}];
  return []; // New construction contracts supply these interactive formulas in the r6 reader.
 })}));
 data.semantic.nodes=data.semantic.nodes.map(n=>n.id!=='n08-q04-substitute'?n:{...n,before:n.before.map(b=>!b.parts?b:{...b,parts:b.parts.map(p=>p.type==='choice'?{type:'math',latex:'-(-5)'}:p)})});
 data.revision6Design={schemaVersion:design.schemaVersion,designHash:design.designHash,baseIRHash:design.baseIRHash,sourceBundleHash:design.sourceBundleHash,sourceSegmentCount:design.sourceSegmentCount,inventory:design.inventory,nodes:design.nodes,retiredOnlyInRevision6:design.retiredOnlyInRevision6,constructionDesignHash:compiled.compiled.constructionDesignHash,layoutDesignHash:compiled.compiled.layoutDesignHash,learnerCopyHash:compiled.compiled.learnerCopyHash};
 data.irHash=hash(data.unit);
 return {revision6:data,construction:design.constructionPlan,layout:design.layoutPlan,presentation:compiled.compiled,verification:{sourceSegments:design.sourceSegmentCount,finiteCases:math.caseCount,constructionDesignHash:compiled.compiled.constructionDesignHash,layoutDesignHash:compiled.compiled.layoutDesignHash,learnerCopyHash:compiled.compiled.learnerCopyHash,compiledPresentationHash:compiled.compiled.compiledPresentationHash}};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const root=fileURLToPath(new URL('../../../',import.meta.url)),folder=resolve(root,'src/data/textbook/math/numbers');
 const ir=JSON.parse(readFileSync(resolve(folder,'n08Revision5.json'),'utf8')),bundle=JSON.parse(readFileSync(resolve(root,'work/items/W-MATH-037-n08-workflow-trial/SOLUTION_BUNDLE_R5.json'),'utf8'));
 const out=applyN08Revision6(ir,bundle);
 for(const [name,value]of Object.entries({n08Revision6:out.revision6,n08Construction:out.construction,n08Layout:out.layout,n08ConstructionPresentation:out.presentation}))writeJSON(resolve(folder,name+'.json'),value);
 process.stdout.write(JSON.stringify(out.verification)+'\n');
}

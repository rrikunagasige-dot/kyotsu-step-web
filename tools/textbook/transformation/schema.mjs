import {z} from 'zod';
import {graphSchema} from '../solution/graph.mjs';
export const id=z.string().min(1).max(160);
const ids=z.array(id);
const copy=z.discriminatedUnion('type',[z.object({type:z.literal('text'),text:z.string()}).strict(),z.object({type:z.literal('math'),latex:z.string()}).strict(),z.object({type:z.literal('term'),text:z.string()}).strict()]);
export const planSchema=z.object({
 schemaVersion:z.literal('transformation-plan/1'),unitId:id,presentationVersion:z.number().int().positive(),baseIRHash:id,
 gradingHash:id,scope:z.object({problemId:id,nodeIds:ids,stageIds:ids,assumptionRefs:ids}).strict(),
 graphs:z.array(graphSchema).min(1),
 groups:z.array(z.object({id,kind:z.enum(['expression-chain','relation-sequence','independent-comparison']),patternId:id,graphRef:id,
  stageIds:ids,sourceNodeIds:ids,stepRefs:ids,number:z.number().int().positive(),numberId:id,
  boundaryReason:z.string().min(1),conclusion:z.object({kind:z.enum(['terminal-in-flow','interpretation','join','reference','restate-with-reason']),stateRef:id,reason:z.string().optional()}).strict(),
  rows:z.array(z.object({id,graphRef:id,stateRef:id,sourceNodeId:id,sourceRefs:ids,role:z.enum(['main','auxiliary']),visibleAfter:ids,interactionRef:id.nullable(),slots:z.array(z.object({id,interactionRef:id,path:id}).strict()),
   before:z.array(copy),after:z.array(copy),afterVisible:z.boolean().default(true),continuation:z.boolean().default(false)}).strict()).min(1),
 }).strict()).min(1),
 candidates:z.array(z.object({id,nodeId:id,blankRole:z.enum(['operation','operand','target','expression','calculation','relation','justification','interpretation']),learnerDecision:z.string().min(1),availableFactRefs:ids,prerequisiteInteractionIds:ids,nextUseRef:id,taskContract:z.object({kind:id,requestedOperation:id}).strict(),decision:z.enum(['ADOPT','REJECT']),reason:z.string().min(1),expected:z.string(),targetLatex:z.string(),choices:ids}).strict()),
 coverage:z.array(z.object({sourceRef:id,disposition:z.enum(['main-row','auxiliary','prose','condition','reference','superseded-display']),rowRef:id,reason:z.string().min(1)}).strict()),
 numberAliases:z.record(z.string(),id),
}).strict();
export const getPath=(object,path)=>path.split('.').reduce((v,k)=>/^(?:[a-zA-Z][a-zA-Z0-9_]*|[0-9]+)$/.test(k)&&!['__proto__','prototype','constructor'].includes(k)&&v&&Object.hasOwn(v,k)?v[k]:undefined,object);
export function putPath(object,path,value){const keys=path.split('.');let out=object;for(const key of keys.slice(0,-1))out=out[key];out[keys.at(-1)]=value;}

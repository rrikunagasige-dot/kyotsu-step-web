import { invariant } from '../util.mjs';
export function operationSentence({id,operation,subjectParts,slotId,interactionId,purposeParts}){
 invariant(operation.targets.length&&subjectParts.length&&purposeParts.length,'operation needs target and purpose');
 if(operation.kind==='subtract')invariant(operation.targets.length===2&&operation.direction,'subtraction direction required');
 return {kind:'paragraph',id,parts:[...subjectParts,{kind:'answerSlot',id:slotId,interactionId,semanticRef:id+'-operation'},...purposeParts]};
}
export function quantity(value,semanticRole,appliesTo,{unit='times',standalone=false}={}){
 invariant(semanticRole&&appliesTo,'quantity meaning required');return {value,semanticRole,appliesTo,unit,display:standalone?'standalone-answer':'sentence-or-next-operation'};
}

import { z } from 'zod'
import { validateInteractionV2, projectConstructionV2, gradeConstructionV2 } from '../../tools/textbook/interaction/construction-v2-runtime.mjs'
import type { ConstructionExpression } from './constructionReading'
export type ConstructionRoleV2 = 'coordinate'|'operand'|'rational'|'coefficient'|'unary-sign'|'binary-operation'|'signed-term'|'relation'|'meaning'|'bound-subtree-reference'
export type ConstructionChoiceV2 = { id:string; value:string; displayLatex?:string; expression?:ConstructionExpression; subtreeRef?:string; label?:string }
export type ConstructionPartV2 = { id:string;key:string;role:ConstructionRoleV2;expected:string;choices:ConstructionChoiceV2[];prompt:string;feedback:string }
export type ConstructionTokenV2 = {type:'math';latex:string}|{type:'slot';id:string;partId:string;interactionRef:string;role:ConstructionRoleV2}|{type:'mirror';partId:string;context?:'factor'}|{type:'text';text:string}
export type ConstructionFormulaV2 = {left:ConstructionTokenV2[];relation:string;relationSlot?:ConstructionTokenV2;right:ConstructionTokenV2[]}
export type ConstructionStepV2 = {id:string;rowId:string;requiresCorrectParts:string[];partIds:string[];formula?:ConstructionFormulaV2;prose?:ConstructionTokenV2[]}
export type ConstructionInteractionV2 = {schemaVersion:'construction-interaction/2';id:string;sourceNodeId:string;sectionId?:string;sourceRefs:string[];prerequisiteInteractionIds:string[];parts:ConstructionPartV2[];partOrder:string[];steps:ConstructionStepV2[];boundSourceTree?:{rootId:string;sourceASTHash:string;rootExpression:ConstructionExpression;subtreeMap:Record<string,ConstructionExpression>};assumptions:string[];assertions:Record<string,unknown>[];gradingPurpose:string;activePrompt:string;meaningHash:string;nextUseRef:string;finalConclusion:string}
export const ConstructionInteractionV2Schema = z.unknown().superRefine((value,ctx)=>{for(const message of validateInteractionV2(value))ctx.addIssue({code:'custom',message})}).transform(value=>value as ConstructionInteractionV2)
export type ConstructionProjectedPartV2 = Omit<ConstructionPartV2,'expected'|'feedback'> & {visibleFeedback?:string} & {value?:string;choiceId?:string;correct:boolean;editable:boolean;visible:true}
export type ConstructionProjectedRowV2 = {id:string;rowId:string;stepId:string;sourceNodeId:string;partIds:string[];certification:'PROVEN'|'CANDIDATE';formula?:ConstructionFormulaV2;prose?:ConstructionTokenV2[]}
export type ConstructionViewV2 = {rows:ConstructionProjectedRowV2[];parts:ConstructionProjectedPartV2[];currentPartId:string|null;complete:boolean;correct:boolean;numberRowRef:string|null;blockedReason:string|null}
export function projectConstructionInteractionV2(i:ConstructionInteractionV2,draft:Record<string,string>={},view:{solvedInteractionIds?:string[];availableSourceNodeIds?:string[]}={}):ConstructionViewV2{return projectConstructionV2(i,draft,view) as ConstructionViewV2}
export const gradeConstructionDraftV2 = (i:ConstructionInteractionV2,draft:Record<string,string>={})=>gradeConstructionV2(i,draft)

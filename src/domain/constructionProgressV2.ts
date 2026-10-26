import { selectConstructionPartV2 as select, isConstructionResolvedV2 as resolved } from '../../tools/textbook/interaction/construction-v2-runtime.mjs'
import type { ConstructionInteractionV2 } from './constructionReadingV2'
export type ConstructionPartRecordV2={value:string;choiceId:string;firstValue:string;firstChoiceId:string;selectionCount:number;firstSelectedAt:number;lastSelectedAt:number}
export type ConstructionParentProgressV2={schemaVersion:'construction-progress/2';parentId:string;draft:Record<string,string>;partRecords:Record<string,ConstructionPartRecordV2>;attemptCount:number;resolved:boolean;firstPassAllPartsCorrect?:boolean;isFirstCorrect?:boolean;firstSubmittedValues?:Record<string,string>;firstSubmittedAt?:number;lastSubmittedAt?:number;startedAt:number;updatedAt:number;processedEventIds:string[]}
export type ConstructionProgressV2=Record<string,ConstructionParentProgressV2>
export function selectConstructionPartV2(i:ConstructionInteractionV2,previous:ConstructionParentProgressV2|undefined,partId:string,choiceId:string,eventId:string,now:number){return select(i,previous,partId,choiceId,eventId,now) as ConstructionParentProgressV2|undefined}
export function isConstructionResolvedV2(i:ConstructionInteractionV2,record:ConstructionParentProgressV2|undefined){return resolved(i,record)}
export function deriveFirstPassAllPartsCorrect(i:ConstructionInteractionV2,record:ConstructionParentProgressV2|undefined){return i.parts.every(p=>record?.partRecords[p.id]?.firstValue===p.expected)}

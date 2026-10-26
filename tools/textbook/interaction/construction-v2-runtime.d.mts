export const constructionRolesV2: string[]
export function validateInteractionV2(i: unknown): string[]
export function gradeConstructionV2(i: unknown, draft?: Record<string,string>): {complete:boolean;correct:boolean;reason:string|null}
export function projectConstructionV2(i: unknown,draft?:Record<string,string>,view?:unknown): unknown
export function selectConstructionPartV2(i:unknown,previous:unknown,partId:string,choiceId:string,eventId:string,now:number): unknown
export function isConstructionResolvedV2(i:unknown,record:unknown): boolean
export function reachablePartsV2(i:unknown,draft?:Record<string,string>): unknown
export function resolveAssertionV2(i:unknown,node:unknown,draft:Record<string,string>): unknown

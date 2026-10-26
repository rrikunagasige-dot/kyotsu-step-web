/** Candidates only: a numeric/structural filter never selects the teaching purpose. */
export const PATTERNS=Object.freeze({
 T01:{name:'同類項',supported:true},T02:{name:'分配',supported:true},T03:{name:'方程式',supported:true},T04:{name:'正の除数の不等式',supported:true},T05:{name:'負の除数の不等式',supported:true},T06:{name:'数値分数',supported:true},T07:{name:'連立条件',supported:false},T08:{name:'連不等式',supported:false},T09:{name:'絶対値の条件境界',supported:false},T10:{name:'一般根号・有理化',supported:false},T11:{name:'有理係数の平方完成',supported:true},T12:{name:'代入と解釈',supported:false},T13:{name:'概念・証明',supported:false},
});
export function transformationCandidates(graph){return {status:'NEEDS_AI_REVIEW',candidates:graph.transitions.map(t=>({stepRef:t.id,from:t.from,to:t.to,operation:t.ruleId,assumptionRefs:t.requires,adoption:'NEEDS_AI_SELECTION'})),boundaries:['different-problem','different-assumptions','case','join','concept','independent-comparison'],automaticAcceptance:false};}

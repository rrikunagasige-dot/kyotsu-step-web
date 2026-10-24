export function validateReviewPolicy(policy){
 const errors=[];const require=(condition,message)=>{if(!condition)errors.push(message)};
 require(policy?.version===2,'review policy version must be2');
 require(policy?.reviewSurface==='existing-public-app','existing public app review required');
 for(const key of ['screenshotApprovalRequired','repeatPublicationApproval'])require(policy?.[key]===false,key+' must be false');
 for(const key of ['contentDesignApprovalRequired','exactSourceRequired','internalQARequired','preserveAcceptedScope'])require(policy?.[key]===true,key+' must be true');
 require(policy?.acceptance==='explicit-scoped-natural-language','natural scoped acceptance required');
 require(policy?.existingApp==='https://rrikunagasige-dot.github.io/kyotsu-step-web/','wrong public app');
 require(typeof policy?.historicalPolicy==='string'&&policy.historicalPolicy.startsWith('work/items/'),'historical provenance required');
 return errors;
}

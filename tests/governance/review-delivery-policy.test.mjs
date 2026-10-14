import { test } from 'node:test'
import assert from 'node:assert/strict'
import { checkReviewDelivery } from '../../tools/review-delivery-policy.mjs'
const sha='b8791e82215a56512094e265025c112d116e59d3'
const url='https://preview.example.test/kyotsu-step-web/#/learning/textbook/math-sets'
const yes={reviewType:'APP_UI',approvedScope:true,deliveryPlan:'authorized preview',appUrl:url,targetCommit:sha,servedCommit:sha,
  browserEvidence:{status:'PASS',checkedUrl:url,checkedCommit:sha,routeAndAssets:'PASS',evidenceUrl:'https://example.test/evidence/1'}}
test('APP_UI evidence record does not prove actual review readiness', () => {
  const r = checkReviewDelivery(yes)
  assert.equal(r.recordComplete,true)
  assert.equal(r.userReviewReady,false)
})
const cases=[
['no URL',{appUrl:''},'PREVIEW_MISSING'],
['GitHub PR is not UI',{appUrl:'https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/57'},'NOT_AN_APP'],
['ZIP is not UI',{appUrl:'https://example.test/review.zip'},'NOT_AN_APP'],
['localhost inaccessible',{appUrl:'http://localhost:4173'},'LOCAL_ONLY'],
['unapproved new means',{proposedMeansOutsideScope:true},'REVISE_PROPOSAL_REQUIRED'],
['unapproved scope',{approvedScope:false},'SCOPE_NOT_APPROVED'],
['no plan',{deliveryPlan:''},'DELIVERY_PLAN_MISSING'],
['incorrect deployed SHA',{servedCommit:'0'.repeat(40)},'COMMIT_MISMATCH'],
['missing browser check',{browserEvidence:null},'BROWSER_EVIDENCE_MISSING'],
['old browser SHA',{browserEvidence:{...yes.browserEvidence,checkedCommit:'0'.repeat(40)}},'BROWSER_EVIDENCE_MISSING'],
['broken figure route',{browserEvidence:{...yes.browserEvidence,routeAndAssets:'FAIL'}},'BROWSER_EVIDENCE_MISSING'],
['missing SHA',{targetCommit:''},'TARGET_COMMIT_MISSING'],
]
for(const [name,changes,expected] of cases) test(name,()=>assert.equal(checkReviewDelivery({...yes,...changes}).reason,expected))
test('CODE PR accepted',()=>assert.equal(checkReviewDelivery({reviewType:'CODE',approvedScope:true,deliveryPlan:'PR',reviewUrl:'https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/57'}).recordComplete,true))
test('DOCUMENT direct link accepted',()=>assert.equal(checkReviewDelivery({reviewType:'DOCUMENT',approvedScope:true,deliveryPlan:'link',reviewUrl:'https://example.test/report.pdf'}).recordComplete,true))
test('CODE ZIP rejected',()=>assert.equal(checkReviewDelivery({reviewType:'CODE',approvedScope:true,deliveryPlan:'link',reviewUrl:'https://example.test/foo.zip'}).recordComplete,false))
test('review type required',()=>assert.equal(checkReviewDelivery({approvedScope:true}).reason,'REVIEW_TYPE_MISSING'))

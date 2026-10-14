import {test} from 'node:test'
import assert from 'node:assert/strict'
import {validateNewWorkContract,auditNewWorkFiles} from '../../tools/review-work-intake.mjs'
const work='Status: PROPOSED\n## Review Delivery\nType: CODE\n'
const proposal='## Review Delivery Contract\nReview Type: CODE\nRequired Review Artifact: PR\nDelivery Route: GitHub\nAdditional Permission: none\nAcceptance: code review\n'
test('new Work with complete contract passes',()=>assert.deepEqual(validateNewWorkContract(work,proposal),[]))
test('missing review contract fails',()=>assert.ok(validateNewWorkContract(work,proposal.replace('## Review Delivery Contract','')).length))
test('missing Work review section fails',()=>assert.ok(validateNewWorkContract('Status: PROPOSED\n',proposal).length))
test('review type required',()=>assert.ok(validateNewWorkContract(work,proposal.replace('Review Type: CODE','')).length))
test('invalid status fails',()=>assert.ok(validateNewWorkContract('Status: PROPOSED (extra)\n## Review Delivery',proposal).length))
test('APP_UI acceptance must mention app URL',()=>assert.ok(validateNewWorkContract(work,proposal.replace('Review Type: CODE','Review Type: APP_UI')).length))
test('APP_UI explicit app URL may be planned',()=>assert.deepEqual(validateNewWorkContract(work,proposal.replace('Review Type: CODE','Review Type: APP_UI').replace('Acceptance: code review','Acceptance: direct application URL after independent browser validation')),[]))
test('new Work change is inspected',()=>assert.equal(auditNewWorkFiles([['A','work/items/W-NEW-001/WORK.md']],path=>path.endsWith('WORK.md')?work:proposal).length,0))
test('non-new Work does not retrofit old history',()=>assert.equal(auditNewWorkFiles([['M','work/items/W-OLD-001/WORK.md']],()=>{throw Error('should not read')}).length,0))
test('uncontracted newly-added Work is rejected',()=>assert.ok(auditNewWorkFiles([['A','work/items/W-NEW-001/WORK.md']],()=> 'Status: PROPOSED').length))
